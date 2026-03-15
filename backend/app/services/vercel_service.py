import logging
import time
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

VERCEL_API_BASE = "https://api.vercel.com"
POLL_INTERVAL_SECONDS = 10
MAX_POLL_MINUTES = 15
INITIAL_WAIT_SECONDS = 5  # Give Vercel time to see the merge


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.vercel_token}",
        "Content-Type": "application/json",
    }


def find_and_poll_deployment_until_ready(merge_commit_sha: str) -> dict[str, Any]:
    """
    Find deployment whose git SHA matches merge_commit_sha, then poll until readyState is READY.
    Returns dict with deployment_id, deployment_url, deployment_status, live_at (when READY).
    """
    if not settings.vercel_token or not settings.vercel_project_id:
        raise ValueError("VERCEL_TOKEN and VERCEL_PROJECT_ID must be set")

    time.sleep(INITIAL_WAIT_SECONDS)

    deployment_uid: str | None = None
    deployment_url: str | None = None
    deadline = time.time() + MAX_POLL_MINUTES * 60

    with httpx.Client(timeout=30.0) as client:
        # Find deployment by commit SHA
        while time.time() < deadline:
            params: dict[str, str | int] = {
                "projectId": settings.vercel_project_id,
                "sha": merge_commit_sha,
            }
            if settings.vercel_team_id:
                params["teamId"] = settings.vercel_team_id

            r = client.get(
                f"{VERCEL_API_BASE}/v6/deployments",
                headers=_headers(),
                params=params,
            )
            r.raise_for_status()
            data = r.json()
            deployments = data.get("deployments") or []

            if deployments:
                d = deployments[0]
                deployment_uid = d.get("uid")
                deployment_url = d.get("url") or ""
                break

            logger.info("No deployment yet for sha %s, waiting...", merge_commit_sha[:7])
            time.sleep(POLL_INTERVAL_SECONDS)

        if not deployment_uid:
            return {
                "deployment_id": None,
                "deployment_url": None,
                "deployment_status": "NOT_FOUND",
                "live_at": None,
                "error": "No deployment found for merge commit within timeout",
            }

        # Poll deployment until READY
        while time.time() < deadline:
            r = client.get(
                f"{VERCEL_API_BASE}/v13/deployments/{deployment_uid}",
                headers=_headers(),
            )
            r.raise_for_status()
            dep = r.json()
            ready_state = dep.get("readyState") or dep.get("state", "").upper()

            if ready_state == "READY":
                return {
                    "deployment_id": deployment_uid,
                    "deployment_url": deployment_url or dep.get("url", ""),
                    "deployment_status": ready_state,
                    "live_at": datetime.now(timezone.utc).isoformat(),
                }

            if ready_state in ("ERROR", "CANCELED"):
                return {
                    "deployment_id": deployment_uid,
                    "deployment_url": deployment_url,
                    "deployment_status": ready_state,
                    "live_at": None,
                    "error": f"Deployment ended with state {ready_state}",
                }

            logger.info("Deployment %s state: %s", deployment_uid[:7], ready_state)
            time.sleep(POLL_INTERVAL_SECONDS)

    return {
        "deployment_id": deployment_uid,
        "deployment_url": deployment_url,
        "deployment_status": "TIMEOUT",
        "live_at": None,
        "error": "Deployment did not become READY within timeout",
    }
