from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import BaseModel

from app.config import settings
from app.schemas.agent import AgentActionPayload
from app.services import activity_store
from app.services.pipeline import run_pipeline

router = APIRouter()


class DangerousModeBody(BaseModel):
    dangerousMode: bool


@router.post("/webhook", status_code=status.HTTP_202_ACCEPTED)
def agent_webhook(payload: AgentActionPayload, background_tasks: BackgroundTasks):
    """
    Accepts a payload from a site change (agent action).
    Validate and enqueue for processing; respond immediately.
    """
    background_tasks.add_task(run_pipeline, payload)
    return {"received": True, "actionId": payload.id}


@router.get("/activity")
def list_activity():
    """Return all activity records for the dashboard."""
    return activity_store.get_all_activities()


@router.get("/activity/{action_id}")
def get_activity(action_id: str):
    """Return a single activity record or 404."""
    record = activity_store.get_activity(action_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    return record


@router.get("/dangerous-mode")
def get_dangerous_mode():
    """Return current dangerous mode (auto-merge) flag."""
    return {"dangerousMode": settings.dangerous_mode}


@router.patch("/dangerous-mode")
def patch_dangerous_mode(body: DangerousModeBody):
    """Set dangerous mode (auto-merge). Body: { \"dangerousMode\": true|false }."""
    settings.set_dangerous_mode(body.dangerousMode)
    return {"dangerousMode": settings.dangerous_mode}
