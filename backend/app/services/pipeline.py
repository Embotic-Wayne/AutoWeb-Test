import logging
from datetime import datetime, timezone
from typing import Any

from app.config import settings
from app.schemas.agent import AgentActionPayload
from app.services import activity_store
from app.services import github_service
from app.services import slack_service
from app.services import vercel_service

logger = logging.getLogger(__name__)


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

        try:
            gh_result = github_service.create_branch_commit_pr(
                action_id=action_id,
                payload=data["payload"],
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
