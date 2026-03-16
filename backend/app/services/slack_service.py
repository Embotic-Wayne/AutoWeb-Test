import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

_FEATURE_ADVISORY_KEYWORDS = [
    "feature detected", "feature alert", "cannot fake",
    "cannot be replicated", "data sources needed",
    "implementation advice", "suggested tools",
    "estimated effort", "real user", "backend integration",
]


def _is_feature_advisory(reasoning: str, suggested_text: str) -> bool:
    combined = (reasoning + suggested_text).lower()
    return any(kw in combined for kw in _FEATURE_ADVISORY_KEYWORDS)


def _build_advisory_blocks(reasoning: str, suggested_text: str) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": "Competitor Feature Advisory", "emoji": True},
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Why this was escalated:*\n{reasoning}",
            },
        },
        {"type": "divider"},
    ]

    MAX_BLOCK_LEN = 2900
    remaining = suggested_text
    while remaining:
        chunk = remaining[:MAX_BLOCK_LEN]
        remaining = remaining[MAX_BLOCK_LEN:]
        blocks.append({
            "type": "section",
            "text": {"type": "mrkdwn", "text": chunk},
        })

    blocks.append({"type": "divider"})
    blocks.append({
        "type": "context",
        "elements": [
            {"type": "mrkdwn", "text": "Sent by *AutoWeb Intelligence Engine* | This feature requires human implementation."},
        ],
    })
    return blocks


def _build_standard_blocks(reasoning: str, suggested_text: str) -> list[dict[str, Any]]:
    return [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": "AutoWeb Agent", "emoji": True},
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Reasoning:*\n{reasoning}",
            },
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Suggested text:*\n{suggested_text}",
            },
        },
    ]


def send_slack_message(reasoning: str, suggested_text: str) -> None:
    """
    POST to SLACK_WEBHOOK_URL with Block Kit blocks.
    Auto-detects feature advisory escalations and uses a richer format.
    """
    if not settings.slack_webhook_url:
        raise ValueError("SLACK_WEBHOOK_URL must be set")

    if _is_feature_advisory(reasoning, suggested_text):
        blocks = _build_advisory_blocks(reasoning, suggested_text)
    else:
        blocks = _build_standard_blocks(reasoning, suggested_text)

    with httpx.Client(timeout=10.0) as client:
        r = client.post(
            settings.slack_webhook_url,
            json={"blocks": blocks},
        )
        r.raise_for_status()
