"""
Mirrors shared types/agent.ts for webhook payload validation.
"""
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    DETECTING = "detecting"
    ANALYZING = "analyzing"
    GENERATING = "generating"
    DEPLOYING = "deploying"
    ESCALATING = "escalating"


class AgentActionType(str, Enum):
    DIRECT_CODE = "DIRECT_CODE"
    SLACK_MESSAGE = "SLACK_MESSAGE"


AgentStatusLiteral = Literal["detecting", "analyzing", "generating", "deploying", "escalating"]


class AgentActionPayload(BaseModel):
    """Payload accepted by /agent/webhook (site change from agent)."""

    id: str
    timestamp: Optional[str] = None  # ISO 8601; defaulted in pipeline if missing
    status: Optional[AgentStatusLiteral] = None  # defaulted in pipeline if missing
    actionType: Literal["DIRECT_CODE", "SLACK_MESSAGE"]
    payload: str
    reasoning: str = Field(..., description="Agent reasoning for this action")
