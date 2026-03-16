import logging
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, status
from pydantic import BaseModel

from app.config import settings
from app.services import activity_store, github_service, vercel_service
from app.services.personalization_templates import (
    DEFAULT_HERO_TSX,
    HERO_PATH,
    MIDDLEWARE_PATH,
    PERSONA_CONFIG_PATH,
    generate_personalization_files,
)

logger = logging.getLogger(__name__)

router = APIRouter()


class PersonaItem(BaseModel):
    key: str
    utm_source: str
    headline: str
    subheadline: str
    cta: str
    ctaHref: str = "/signup"


class PersonalizationPayload(BaseModel):
    personas: list[PersonaItem]
    default_headline: str = "Learn without limits, grow without boundaries."
    default_subheadline: str = "Access world-class education from top instructors."
    default_cta: str = "Start learning free"
    default_ctaHref: str = "/signup"


def _run_deploy(payload: PersonalizationPayload) -> None:
    action_id = f"persona-{uuid4().hex[:12]}"
    ts = datetime.now(timezone.utc).isoformat()

    try:
        activity_store.upsert_activity(action_id, {
            "timestamp": ts,
            "status": "generating",
            "actionType": "PERSONALIZATION",
        })
    except Exception:
        logger.exception("Failed to persist initial state for %s", action_id)
        return

    try:
        personas = [p.model_dump() for p in payload.personas]
        default = {
            "headline": payload.default_headline,
            "subheadline": payload.default_subheadline,
            "cta": payload.default_cta,
            "ctaHref": payload.default_ctaHref,
        }
        files = generate_personalization_files(personas, default)
    except Exception as e:
        logger.exception("Template generation failed for %s", action_id)
        activity_store.upsert_activity(action_id, {"error": str(e), "status": "failed"})
        return

    try:
        gh_result = github_service.create_personalization_pr(
            action_id=action_id,
            files=files,
            timestamp=ts,
            reasoning="Deploy visitor personalization (middleware + persona config + Hero)",
        )
    except Exception as e:
        logger.exception("GitHub PR creation failed for %s", action_id)
        activity_store.upsert_activity(action_id, {"error": str(e), "status": "failed"})
        return

    activity_store.upsert_activity(action_id, {
        "pr_url": gh_result["pr_url"],
        "branch": gh_result["branch"],
        "pr_number": gh_result["pr_number"],
        "status": "pr_opened",
    })

    merge_commit_sha = None
    if settings.dangerous_mode:
        merge_result = github_service.merge_pull_request_with_retry(gh_result["pr_number"])
        if merge_result.get("merged"):
            merge_commit_sha = merge_result.get("merge_commit_sha")
            activity_store.upsert_activity(action_id, {
                "merged_at": datetime.now(timezone.utc).isoformat(),
                "merge_commit_sha": merge_commit_sha,
                "status": "merged",
            })
        else:
            activity_store.upsert_activity(action_id, {
                "merge_error": merge_result.get("merge_error", "Unknown"),
                "status": "merge_failed",
            })

    if merge_commit_sha:
        try:
            vercel_result = vercel_service.find_and_poll_deployment_until_ready(merge_commit_sha)
            activity_store.upsert_activity(action_id, {
                "deployment_id": vercel_result.get("deployment_id"),
                "deployment_url": vercel_result.get("deployment_url"),
                "deployment_status": vercel_result.get("deployment_status"),
                "live_at": vercel_result.get("live_at"),
                "status": "ready" if vercel_result.get("live_at") else vercel_result.get("deployment_status", "unknown"),
            })
            if vercel_result.get("error"):
                activity_store.upsert_activity(action_id, {"error": vercel_result["error"]})
        except Exception as e:
            logger.exception("Vercel poll failed for %s", action_id)
            activity_store.upsert_activity(action_id, {"error": str(e), "status": "vercel_failed"})


def _run_reset() -> None:
    action_id = f"persona-reset-{uuid4().hex[:12]}"
    ts = datetime.now(timezone.utc).isoformat()

    try:
        activity_store.upsert_activity(action_id, {
            "timestamp": ts,
            "status": "resetting",
            "actionType": "PERSONALIZATION_RESET",
        })
    except Exception:
        logger.exception("Failed to persist initial state for %s", action_id)
        return

    try:
        gh_result = github_service.delete_files_pr(
            action_id=action_id,
            delete_paths=[MIDDLEWARE_PATH, PERSONA_CONFIG_PATH],
            revert_files={HERO_PATH: DEFAULT_HERO_TSX},
            timestamp=ts,
            reasoning="Reset personalization: remove middleware/config, revert Hero to default",
        )
    except Exception as e:
        logger.exception("GitHub PR creation failed for %s", action_id)
        activity_store.upsert_activity(action_id, {"error": str(e), "status": "failed"})
        return

    activity_store.upsert_activity(action_id, {
        "pr_url": gh_result["pr_url"],
        "branch": gh_result["branch"],
        "pr_number": gh_result["pr_number"],
        "status": "pr_opened",
    })

    merge_commit_sha = None
    if settings.dangerous_mode:
        merge_result = github_service.merge_pull_request_with_retry(gh_result["pr_number"])
        if merge_result.get("merged"):
            merge_commit_sha = merge_result.get("merge_commit_sha")
            activity_store.upsert_activity(action_id, {
                "merged_at": datetime.now(timezone.utc).isoformat(),
                "merge_commit_sha": merge_commit_sha,
                "status": "merged",
            })
        else:
            activity_store.upsert_activity(action_id, {
                "merge_error": merge_result.get("merge_error", "Unknown"),
                "status": "merge_failed",
            })

    if merge_commit_sha:
        try:
            vercel_result = vercel_service.find_and_poll_deployment_until_ready(merge_commit_sha)
            activity_store.upsert_activity(action_id, {
                "deployment_id": vercel_result.get("deployment_id"),
                "deployment_url": vercel_result.get("deployment_url"),
                "deployment_status": vercel_result.get("deployment_status"),
                "live_at": vercel_result.get("live_at"),
                "status": "ready" if vercel_result.get("live_at") else vercel_result.get("deployment_status", "unknown"),
            })
            if vercel_result.get("error"):
                activity_store.upsert_activity(action_id, {"error": vercel_result["error"]})
        except Exception as e:
            logger.exception("Vercel poll failed for %s", action_id)
            activity_store.upsert_activity(action_id, {"error": str(e), "status": "vercel_failed"})


@router.post("/deploy", status_code=status.HTTP_202_ACCEPTED)
def deploy_personalization(payload: PersonalizationPayload, background_tasks: BackgroundTasks):
    """Trigger personalization deployment (middleware + persona config + Hero)."""
    background_tasks.add_task(_run_deploy, payload)
    return {"received": True, "message": "Personalization deployment started"}


@router.post("/reset", status_code=status.HTTP_202_ACCEPTED)
def reset_personalization(background_tasks: BackgroundTasks):
    """Reset personalization: remove middleware/config, revert Hero to default."""
    background_tasks.add_task(_run_reset)
    return {"received": True, "message": "Personalization reset started"}
