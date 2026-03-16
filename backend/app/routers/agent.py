from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import BaseModel

from app.config import settings
from app.schemas.agent import AgentActionPayload
from app.services import activity_store
from app.services import slack_service
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


class DemoSlackBody(BaseModel):
    competitorUrl: str | None = None


@router.post("/demo-slack")
def send_demo_slack(body: DemoSlackBody):
    """
    Demo-only endpoint: send a hardcoded Slack message when the dashboard "Run Agent" is clicked.

    This does NOT create any GitHub branches or PRs and does not call the Intelligence Engine.
    It simply uses the configured SLACK_WEBHOOK_URL to post a structured message that looks like
    an escalation for a proposed PR.
    """
    if not settings.slack_webhook_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SLACK_WEBHOOK_URL is not configured on the backend",
        )

    competitor_url = (body.competitorUrl or "").strip() or "http://localhost:3004"

    reasoning = (
        "Demo run: competitor pricing and reviews section detected. "
        "Agent is proposing changes and escalating to the on-call human for approval."
    )

    suggested_text_lines = [
        "*AutoWeb Demo: Proposed PR from agent run*",
        "",
        f"- *Competitor URL:* {competitor_url}",
        "- *Demo PR:* `https://github.com/your-org/your-repo/pull/123`",
        "- *Demo branch:* `demo/competitor-pricing-and-social-proof`",
        "",
        "*What this PR is trying to change (demo-only):*",
        "- Add a competitive pricing table that mirrors the tiers seen on the competitor site.",
        "- Update hero and CTA copy to better position Learnify versus the competitor.",
        "- Introduce a \"customer stories\" section to highlight real outcomes.",
        "",
        "*Important: ethical handling of reviews & testimonials*",
        "We should not fabricate reviews or testimonials, even if the competitor appears to do so.",
        "To build similar social proof ethically, consider:",
        "- Running short satisfaction or outcome surveys with current users and asking for permission to quote them.",
        "- Interviewing past or existing clients and getting explicit consent to use their words and names.",
        "- Summarizing anonymized, aggregate results (e.g., completion rates, NPS, time saved) instead of individual quotes.",
        "- Partnering with customer-facing teams (sales, support, customer success) to surface real stories and permissioned quotes.",
    ]

    slack_service.send_slack_message(
        reasoning=reasoning,
        suggested_text="\n".join(suggested_text_lines),
    )

    return {"sent": True}
