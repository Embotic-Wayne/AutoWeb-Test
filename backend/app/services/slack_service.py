import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def send_slack_message(reasoning: str, suggested_text: str) -> None:
    """
    POST to SLACK_WEBHOOK_URL with Block Kit blocks for Reasoning and Suggested text.
    """
    if not settings.slack_webhook_url:
        raise ValueError("SLACK_WEBHOOK_URL must be set")

    blocks: list[dict[str, Any]] = [
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

    with httpx.Client(timeout=10.0) as client:
        r = client.post(
            settings.slack_webhook_url,
            json={"blocks": blocks},
        )
        r.raise_for_status()
