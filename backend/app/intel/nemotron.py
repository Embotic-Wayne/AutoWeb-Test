"""
Nemotron Brain: analyze change descriptor and output exactly one AgentAction as valid JSON.
Uses NVIDIA NIM API (OpenAI-compatible chat completions).
"""
import json
import re
import uuid
from datetime import datetime, timezone

import httpx

from app.config import settings
from app.schemas.agent import AgentActionPayload

NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "nvidia/nemotron-3-super-120b-a12b"

SYSTEM_PROMPT = """You are the AutoWeb Intelligence Engine. You analyze competitor site changes and output exactly ONE AgentAction as a single JSON object.

## Output format (required)
Output ONLY one JSON object matching this shape—no markdown, no explanation, no code fence:
{
  "id": "string (e.g. intel-<uuid> or intel-<date>-<slug>)",
  "timestamp": "ISO 8601 (e.g. new Date().toISOString())",
  "status": "generating",
  "actionType": "DIRECT_CODE" or "SLACK_MESSAGE",
  "payload": "string (see below)",
  "reasoning": "string (short explanation)"
}

## actionType rules

### DIRECT_CODE
- Use when the change is a code-fix we can auto-apply: hero copy update, keyword injection, pricing text change, etc.
- payload = the FULL contents of a single React component file: one default-exported component, valid TSX, Tailwind only.
- The deployment pipeline will write this string as-is to apps/project-flow/src/components/ai-generated/Hero.tsx.
- No file path, no markdown wrapper, no narrative. Only the code that could replace Hero.tsx (including `export default function Hero() { ... }`).
- Styling: Tailwind CSS. Use same patterns as ProjectFlow: section, py-12, text-gray-900, text-gray-600, mt-2. The app uses dynamic import of @/components/ai-generated/Hero. Align with dynamic-config.json structure (hero.headline, hero.subheadline) if relevant.

### SLACK_MESSAGE
- Use when we should escalate: competitor added testimonials we don't have, or a change we shouldn't auto-apply.
- payload = the suggested Slack message / copy (what to post).
- reasoning = why we're escalating (e.g. "Competitor added testimonials we don't have").

## Constraints
- id: unique per action (e.g. intel-<uuid>).
- timestamp: ISO 8601.
- status: use "generating" for newly produced actions.
- Output exactly one JSON object. No other text."""


def build_user_prompt(change_descriptor: dict) -> str:
    """Build the user prompt from the change descriptor."""
    desc = json.dumps(change_descriptor, indent=2)
    return f"""Analyze this competitor site change and output exactly one AgentAction JSON object.

Change descriptor:
{desc}

Respond with only the JSON object (no markdown code block, no extra text)."""


def _extract_json(text: str) -> dict:
    """Extract a single JSON object from model output; strip markdown fences or surrounding text."""
    text = text.strip()
    for pattern in (r"```json\s*([\s\S]*?)\s*```", r"```\s*([\s\S]*?)\s*```"):
        m = re.search(pattern, text)
        if m:
            text = m.group(1).strip()
            break
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


def analyze_and_generate_action(change_descriptor: dict) -> AgentActionPayload:
    """
    Call Nemotron with the change descriptor; parse and validate response as AgentActionPayload.
    Returns validated payload; raises on API or validation errors.
    """
    if not settings.nvidia_api_key:
        raise ValueError("NVIDIA_API_KEY is not set")

    user_content = build_user_prompt(change_descriptor)
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "temperature": 0.3,
        "max_tokens": 8192,
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {settings.nvidia_api_key}",
        "Content-Type": "application/json",
    }

    with httpx.Client(timeout=120.0) as client:
        resp = client.post(NVIDIA_CHAT_URL, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("Nemotron returned no choices")
    message = choices[0].get("message") or {}
    content = (message.get("content") or "").strip()
    if not content:
        raise RuntimeError("Nemotron returned empty content")

    raw = _extract_json(content)

    # Ensure required fields; set defaults if missing
    if "id" not in raw or not raw["id"]:
        raw["id"] = f"intel-{uuid.uuid4().hex[:12]}"
    if "timestamp" not in raw or not raw["timestamp"]:
        raw["timestamp"] = datetime.now(timezone.utc).isoformat()
    if "status" not in raw or not raw["status"]:
        raw["status"] = "generating"

    return AgentActionPayload.model_validate(raw)
