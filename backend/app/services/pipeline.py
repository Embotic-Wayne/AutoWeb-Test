import json
import logging
import re
from datetime import datetime, timezone
from typing import Any

from app.config import settings
from app.schemas.agent import AgentActionPayload
from app.services import activity_store
from app.services import github_service
from app.services import slack_service
from app.services import vercel_service

logger = logging.getLogger(__name__)


def _normalize_tsx_content(content: str) -> str:
    """
    Sanitize model-generated TSX so it compiles in a Next.js build.

    Handles common model mistakes:
      - Literal \\n / \\t instead of real whitespace
      - Escaped single quotes  \\'  →  '
      - Single-quoted JSX attributes  className='...'  →  className="..."
      - Duplicate className props on same element
      - Self-closing tags missing space before />
    """
    if not content or not content.strip():
        return content

    s = content.replace("\\n", "\n").replace("\\t", "\t")
    s = s.replace("\\'", "'")

    # Convert single-quoted JSX attribute values to double-quoted.
    # Matches  attr='value'  and replaces with  attr="value"
    s = re.sub(
        r"""(\w+=)'([^']*?)'""",
        r'\1"\2"',
        s,
    )

    # Remove stray single quotes left after attribute conversion
    # e.g.  className="value"'  →  className="value"
    s = re.sub(r'(="[^"]*")\'+ ', r"\1 ", s)
    s = re.sub(r'(="[^"]*")\'+>', r"\1>", s)

    # Remove duplicate className props (keep the last one on each element).
    # Pattern: className="..." followed (possibly with whitespace) by className="..."
    s = re.sub(
        r'className="[^"]*"\s+(className="[^"]*")',
        r"\1",
        s,
    )

    # Remove stray { after > at end of line (model wraps children in braces)
    s = re.sub(r">\{\s*$", ">", s, flags=re.MULTILINE)

    # Ensure space before self-closing />  (e.g.  <div/> → <div />)
    s = re.sub(r'([^ /])(/\s*>)', r"\1 \2", s)

    s = "\n".join(line.rstrip() for line in s.splitlines())
    if s and not s.endswith("\n"):
        s += "\n"
    return s


_ALL_COMPONENTS = ("hero", "stats", "features", "courses", "pricing", "cta")
_FUNC_NAMES = {
    "hero": "Hero", "stats": "Stats", "features": "Features",
    "courses": "Courses", "pricing": "Pricing", "cta": "CTA",
}


def _extract_components_regex(raw: str) -> dict[str, str] | None:
    """
    Last-resort extraction when json.loads fails on the payload.
    Looks for  "key": "..."  patterns or export default function boundaries.
    """
    components: dict[str, str] = {}
    keys_pattern = "|".join(_ALL_COMPONENTS)
    for key in _ALL_COMPONENTS:
        pattern = rf'"{key}"\s*:\s*"([\s\S]*?)(?:"\s*[,}}]\s*"(?:{keys_pattern})"|\"\s*\}}$)'
        m = re.search(pattern, raw)
        if m:
            content = m.group(1)
            content = content.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")
            components[key] = _normalize_tsx_content(content)

    if not components:
        for key, func_name in _FUNC_NAMES.items():
            pattern = rf'(export\s+default\s+function\s+{func_name}\s*\(\)[\s\S]*?\n\}})'
            m = re.search(pattern, raw)
            if m:
                components[key] = _normalize_tsx_content(m.group(1))

    return components if components else None


def _normalize_payload(payload: AgentActionPayload) -> dict[str, Any]:
    """Ensure timestamp and status are set for persistence and services."""
    data = payload.model_dump()
    if not data.get("timestamp"):
        data["timestamp"] = datetime.now(timezone.utc).isoformat()
    if not data.get("status"):
        data["status"] = "generating"
    return data


def run_pipeline(payload: AgentActionPayload) -> None:
    """
    Run the deployment pipeline: persist at each step, branch on actionType.
    Does not re-raise; logs and persists errors.
    """
    data = _normalize_payload(payload)
    action_id = data["id"]
    action_type = data["actionType"]

    try:
        activity_store.upsert_activity(
            action_id,
            {
                "timestamp": data["timestamp"],
                "status": data["status"],
                "actionType": action_type,
                "reasoning": data["reasoning"],
                "payload_preview": (data.get("payload") or "")[:200],
            },
        )
    except Exception as e:
        logger.exception("Failed to persist received state for %s", action_id)
        return

    if action_type == "SLACK_MESSAGE":
        try:
            slack_service.send_slack_message(
                reasoning=data["reasoning"],
                suggested_text=data.get("payload") or "",
            )
            activity_store.upsert_activity(
                action_id,
                {"slack_sent_at": datetime.now(timezone.utc).isoformat()},
            )
        except Exception as e:
            logger.exception("Slack send failed for %s", action_id)
            activity_store.upsert_activity(
                action_id,
                {"error": str(e), "status": "slack_failed"},
            )
        return

    if action_type == "DIRECT_CODE":
        activity_store.upsert_activity(action_id, {"status": "in_progress"})

        payload_raw = data.get("payload") or ""
        components: dict[str, str] | None = None

        # payload may already be a dict (nemotron.py serializes dicts, but the
        # webhook could also receive one directly)
        allowed = set(_ALL_COMPONENTS)
        if isinstance(payload_raw, dict):
            components = {
                k: _normalize_tsx_content(v)
                for k, v in payload_raw.items()
                if k.lower() in allowed and isinstance(v, str) and v.strip()
            }
        elif isinstance(payload_raw, str) and payload_raw.strip().startswith("{"):
            try:
                parsed = json.loads(payload_raw)
                if isinstance(parsed, dict) and parsed:
                    components = {
                        k: _normalize_tsx_content(v)
                        for k, v in parsed.items()
                        if k.lower() in allowed and isinstance(v, str) and v.strip()
                    }
            except json.JSONDecodeError:
                logger.warning("payload looks like JSON but failed to parse; "
                               "attempting regex extraction for %s", action_id)
                components = _extract_components_regex(payload_raw)

        if not components:
            if isinstance(payload_raw, str) and payload_raw.strip():
                components = {"hero": _normalize_tsx_content(payload_raw)}
            else:
                components = None
        if not components:
            logger.warning("DIRECT_CODE payload empty or invalid for %s", action_id)
            activity_store.upsert_activity(
                action_id,
                {"error": "Empty or invalid payload", "status": "failed"},
            )
            return

        try:
            if len(components) == 1 and "hero" in components:
                gh_result = github_service.create_branch_commit_pr(
                    action_id=action_id,
                    payload=components["hero"],
                    timestamp=data["timestamp"],
                    reasoning=data["reasoning"],
                )
            else:
                gh_result = github_service.create_branch_commit_pr_multi(
                    action_id=action_id,
                    components=components,
                    timestamp=data["timestamp"],
                    reasoning=data["reasoning"],
                )
        except Exception as e:
            logger.exception("GitHub create branch/PR failed for %s", action_id)
            activity_store.upsert_activity(
                action_id,
                {"error": str(e), "status": "failed"},
            )
            return

        activity_store.upsert_activity(
            action_id,
            {
                "pr_url": gh_result["pr_url"],
                "branch": gh_result["branch"],
                "pr_number": gh_result["pr_number"],
                "status": "pr_opened",
            },
        )

        # Notify Slack that a PR was opened (optional; skip if webhook not set).
        # We enrich the message with:
        # - target URL
        # - changed sections
        # - PR URL and branch
        # - An ethics note if the competitor page has a reviews/testimonials section.
        if settings.slack_webhook_url:
            try:
                meta = activity_store.get_activity(action_id) or {}
                target_url = meta.get("target_url")
                changed_sections = meta.get("changed_sections") or []
                has_reviews_section = bool(meta.get("has_reviews_section"))

                summary_lines: list[str] = [
                    "*New AutoWeb PR opened from agent run.*",
                ]
                if target_url:
                    summary_lines.append(f"- *Target URL:* {target_url}")
                summary_lines.append(f"- *PR:* {gh_result['pr_url']}")
                summary_lines.append(f"- *Branch:* `{gh_result['branch']}`")
                summary_lines.append(f"- *Action ID:* `{action_id}`")
                if changed_sections:
                    joined = ", ".join(changed_sections)
                    summary_lines.append(f"- *Changed sections detected:* {joined}")

                if has_reviews_section:
                    summary_lines.extend(
                        [
                            "",
                            "*Heads up: competitor has a reviews/testimonials section.*",
                            "We should not fabricate reviews or testimonials. To build similar social proof ethically, consider:",
                            "- Running short satisfaction or outcome surveys with current users.",
                            "- Interviewing past or existing clients and asking for permission to quote them.",
                            "- Summarizing anonymized, aggregate results (e.g., completion rates, NPS, time saved) instead of individual quotes.",
                            "- Asking customer-facing teams (sales, support, customer success) for real stories and permissioned quotes.",
                        ]
                    )

                suggested_text = "\n".join(summary_lines)

                slack_service.send_slack_message(
                    reasoning=data["reasoning"],
                    suggested_text=suggested_text,
                )
                activity_store.upsert_activity(
                    action_id,
                    {"slack_pr_notified_at": datetime.now(timezone.utc).isoformat()},
                )
            except Exception as e:
                logger.warning("Slack PR notification failed for %s: %s", action_id, e)

        merge_commit_sha: str | None = None
        if settings.dangerous_mode:
            merge_result = github_service.merge_pull_request_with_retry(
                gh_result["pr_number"]
            )
            if merge_result.get("merged"):
                merge_commit_sha = merge_result.get("merge_commit_sha")
                activity_store.upsert_activity(
                    action_id,
                    {
                        "merged_at": datetime.now(timezone.utc).isoformat(),
                        "merge_commit_sha": merge_commit_sha,
                        "status": "merged",
                    },
                )
            else:
                activity_store.upsert_activity(
                    action_id,
                    {
                        "merge_error": merge_result.get("merge_error", "Unknown"),
                        "status": "merge_failed",
                    },
                )

        if merge_commit_sha:
            try:
                vercel_result = vercel_service.find_and_poll_deployment_until_ready(
                    merge_commit_sha
                )
                activity_store.upsert_activity(
                    action_id,
                    {
                        "deployment_id": vercel_result.get("deployment_id"),
                        "deployment_url": vercel_result.get("deployment_url"),
                        "deployment_status": vercel_result.get("deployment_status"),
                        "live_at": vercel_result.get("live_at"),
                        "status": "ready" if vercel_result.get("live_at") else vercel_result.get("deployment_status", "unknown"),
                    },
                )
                if vercel_result.get("error"):
                    activity_store.upsert_activity(
                        action_id,
                        {"error": vercel_result["error"]},
                    )
            except Exception as e:
                logger.exception("Vercel poll failed for %s", action_id)
                activity_store.upsert_activity(
                    action_id,
                    {"error": str(e), "status": "vercel_failed"},
                )
