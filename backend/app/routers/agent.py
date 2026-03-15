from fastapi import APIRouter, status

from app.schemas.agent import AgentActionPayload

router = APIRouter()


@router.post("/webhook", status_code=status.HTTP_202_ACCEPTED)
def agent_webhook(payload: AgentActionPayload):
    """
    Accepts a payload from a site change (agent action).
    Validate and enqueue for processing; respond immediately.
    """
    # TODO: enqueue to worker / persist / notify platform
    return {"received": True, "actionId": payload.id}
