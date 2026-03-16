"""
Nemotron Brain: analyze change descriptor and output exactly one AgentAction.
Uses NVIDIA NIM API (OpenAI-compatible chat completions).
"""
import json
import logging
import re
import uuid
from datetime import datetime, timezone

import httpx

from app.config import settings
from app.schemas.agent import AgentActionPayload

logger = logging.getLogger(__name__)

NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "nvidia/nemotron-3-nano-30b-a3b"

DESIGN_SYSTEM = """\
Light theme (Learnify):
  Background: bg-white
  Card/surface: bg-white with border border-neutral-200, rounded-2xl
  Foreground text: text-neutral-900
  Muted text: text-neutral-500
  Subtle text: text-neutral-400
  Accent (green): text-green-500, bg-green-500 (for badges/dots), text-green-600, text-green-700
  Accent light bg: bg-green-50
  Border: border-neutral-200
  Highlight border: border-neutral-900
  Section dividers: border-b border-neutral-200
Typography:
  Headings: font-bold text-neutral-900
  Section titles: text-3xl font-bold text-neutral-900 md:text-4xl
  Body: text-neutral-500 leading-relaxed
  Small: text-sm text-neutral-400
Buttons:
  Primary: rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors
  Secondary: rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors
Cards:
  rounded-2xl border border-neutral-200 bg-white p-8
Tags/Badges:
  rounded-full px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600
  Accent tag: bg-green-50 text-green-700
Layout:
  Section wrapper: border-b border-neutral-200 bg-white px-6 py-20
  Container: mx-auto max-w-6xl
  Grids: grid gap-8 sm:grid-cols-3
CTA Section (dark inversion):
  bg-neutral-900 text-white, buttons invert to bg-white text-neutral-900
"""

SYSTEM_PROMPT = f"""You are the AutoWeb Intelligence Engine. You analyze competitor site changes and produce updated React (TSX) components that match the competitor's content with our design system.

## Design System (MUST use these exact styles)
{DESIGN_SYSTEM}

## Output format (required)
Use EXACTLY this delimiter format. No JSON, no markdown fences. Output the sections in this exact order:

===ACTIONTYPE===
DIRECT_CODE
===REASONING===
Short explanation of what changed and why we are revamping.
===HERO===
export default function Hero() {{
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Badge text
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Headline</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Subheadline</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {{/* Primary: rounded-full bg-neutral-900 text-white; Secondary: rounded-full border border-neutral-200 bg-white text-neutral-700 */}}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          {{/* Right-side card content */}}
        </div>
      </div>
    </section>
  );
}}
===STATS===
export default function Stats() {{
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {{/* Stat items: text-3xl font-bold text-neutral-900 for number, text-sm font-semibold text-neutral-900 for label, text-sm text-neutral-400 for sub */}}
      </div>
    </section>
  );
}}
===FEATURES===
export default function Features() {{
  return (
    <section id="features" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Section Title</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">Subtitle</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {{/* Feature cards: rounded-2xl border border-neutral-200 bg-white p-8 text-left, icon in rounded-xl border box */}}
        </div>
      </div>
    </section>
  );
}}
===COURSES===
export default function Courses() {{
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Section Title</h2>
        <p className="mt-2 text-neutral-500">Subtitle</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {{/* Course cards: overflow-hidden rounded-2xl border border-neutral-200 bg-white, image placeholder div h-48 bg-neutral-100, tags, title, description, metadata, Enroll button */}}
        </div>
      </div>
    </section>
  );
}}
===PRICING===
export default function Pricing() {{
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Pricing Title</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Subtitle</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {{/* Pricing cards: rounded-2xl border p-8 text-left. Popular plan: border-neutral-900 shadow-lg with "Most Popular" badge. Others: border-neutral-200. Check marks: text-green-500 */}}
        </div>
      </div>
    </section>
  );
}}
===CTA===
export default function CTA() {{
  return (
    <section className="bg-neutral-900 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">CTA Heading</h2>
        <p className="mt-4 text-neutral-400">CTA subtext</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {{/* Primary: rounded-full bg-white text-neutral-900; Secondary: rounded-full border border-neutral-600 text-white */}}
        </div>
      </div>
    </section>
  );
}}
===END===

## Rules for DIRECT_CODE

- **Primary source:** Use **markdown_after** from the change descriptor as the FULL PAGE content. Completely revamp the page to capture the competitor's UI and copy.
- **hero**: Full above-the-fold section with two-column layout—left side has badge, headline, subheadline, CTAs, social proof; right side has a visual card.
- **stats**: Key numbers/metrics bar in a 4-column grid (number bold text-neutral-900, label, sublabel).
- **features**: Feature grid with icon boxes (emoji in rounded-xl border box), title, and description per card.
- **courses**: Course cards with image placeholder (div h-48 bg-neutral-100), category tags, title, description, metadata (duration, students, rating), and Enroll button.
- **pricing**: Complete pricing section—all tiers/plans with check mark feature lists, CTAs. Highlight the most popular plan with border-neutral-900 shadow-lg and a "Most Popular" badge.
- **cta**: Final call-to-action on dark bg (bg-neutral-900) with white text, inverted buttons.
- Each section is a full TSX file: `export default function ComponentName() {{ return (...); }}`.
- Use **Tailwind CSS only** with our light theme design system above.
- Use double quotes for all JSX attributes: `className="text-lg"`.
- No duplicate props on any element.
- Self-closing tags need a space before />: `<div />` not `<div/>`.
- Do NOT use SVG icons or complex SVG paths. Use emoji (e.g. ✓ 📚 🎓 💼 🚀 ⭐ 🏆 👥 💡 📊) or HTML entities instead.
- Be thorough: capture all impressive UI and copy from the competitor, not minimal snippets.
- Match the competitor's actual text content as closely as possible.
- Use rounded-full for buttons and rounded-2xl for cards throughout.

## For SLACK_MESSAGE (escalation)
===ACTIONTYPE===
SLACK_MESSAGE
===REASONING===
Why we are escalating.
===PAYLOAD===
The Slack message text to post.
===END==="""


MAX_MARKDOWN_CHARS = 12_000


def _truncate_descriptor_for_prompt(descriptor: dict) -> dict:
    """Truncate markdown fields so the API request stays small and completes in time."""
    out = dict(descriptor)
    for key in ("markdown_after", "markdown_before"):
        if key in out and isinstance(out[key], str) and len(out[key]) > MAX_MARKDOWN_CHARS:
            out[key] = out[key][:MAX_MARKDOWN_CHARS] + "\n\n[... truncated for length ...]"
    return out


def build_user_prompt(change_descriptor: dict) -> str:
    """Build the user prompt from the change descriptor."""
    truncated = _truncate_descriptor_for_prompt(change_descriptor)

    design_hints = truncated.pop("design_hints", None)
    hints_block = ""
    if design_hints:
        hints_block = f"""
Design signals extracted from competitor HTML:
- Colors found: {', '.join(design_hints.get('hex_colors', [])[:10])}
- Background values: {', '.join(design_hints.get('bg_values', [])[:6])}
- Text color values: {', '.join(design_hints.get('text_values', [])[:6])}
- Layout patterns: {', '.join(design_hints.get('layout_patterns', []))}
- Section hints: {', '.join(design_hints.get('section_hints', [])[:8])}

Use these design signals to understand the competitor's visual style, but output using OUR design system (light theme: bg-white, text-neutral-900, rounded-2xl cards, rounded-full buttons).
"""

    desc = json.dumps(truncated, indent=2)
    return f"""Analyze the competitor page and produce a complete revamp using our light theme design system.

Change descriptor (includes full page content in markdown_after):
{desc}
{hints_block}
TASK: Complete revamp of our page using the competitor's content from markdown_after.

Output using the ===SECTION=== delimiter format (not JSON). Include ALL SIX components:
- ===HERO===: two-column layout—badge, headline, subheadline, CTAs, social proof on left; visual card on right
- ===STATS===: 4-column metrics bar (bold numbers, labels, sublabels)
- ===FEATURES===: feature grid (3-6 cards with emoji icon boxes, titles, descriptions)
- ===COURSES===: course cards (image placeholder, category tags, titles, metadata with rating stars, Enroll button)
- ===PRICING===: pricing tiers (2-4 plans with check marks, highlight popular plan with border-neutral-900)
- ===CTA===: dark section (bg-neutral-900) with white text, inverted buttons

Use double quotes for JSX attributes. Use emoji or HTML entities instead of SVGs. Follow the light theme design system exactly. Be thorough. End with ===END===."""


def _strip_thinking(text: str) -> str:
    """Remove <think>...</think> reasoning blocks produced by reasoning-mode models."""
    text = re.sub(r"<think>[\s\S]*?</think>", "", text)
    text = re.sub(r"<think>[\s\S]*$", "", text)
    return text.strip()


_SECTION_TAGS = [
    "ACTIONTYPE", "REASONING",
    "HERO", "STATS", "FEATURES", "COURSES", "PRICING", "CTA",
    "PAYLOAD", "END",
]

_COMPONENT_KEYS = {"hero", "stats", "features", "courses", "pricing", "cta"}


def _parse_delimited_output(text: str) -> dict[str, str]:
    """
    Parse ===SECTION=== delimited output from the model.
    Returns dict mapping lowercase section name -> content.
    """
    text = _strip_thinking(text)
    sections: dict[str, str] = {}
    tag_pattern = re.compile(r"^===([A-Z_]+)===\s*$", re.MULTILINE)
    matches = list(tag_pattern.finditer(text))

    for i, m in enumerate(matches):
        tag = m.group(1).lower()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()
        if content:
            sections[tag] = content

    return sections


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
        "temperature": 0.6,
        "top_p": 0.95,
        "max_tokens": 16000,
        "stream": False,
        "chat_template_kwargs": {"enable_thinking": False},
    }

    headers = {
        "Authorization": f"Bearer {settings.nvidia_api_key}",
        "Content-Type": "application/json",
    }

    logger.info("Nemotron request: model=%s, max_tokens=%s, prompt_len=%d chars",
                MODEL, body["max_tokens"], len(user_content))

    with httpx.Client(timeout=300.0) as client:
        resp = client.post(NVIDIA_CHAT_URL, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    choices = data.get("choices") or []
    if not choices:
        logger.error("Nemotron response has no choices: %s", json.dumps(data)[:500])
        raise RuntimeError("Nemotron returned no choices")

    choice = choices[0]
    finish_reason = choice.get("finish_reason", "unknown")
    message = choice.get("message") or {}

    logger.info("Nemotron finish_reason=%s, message keys=%s", finish_reason, list(message.keys()))

    content = (message.get("content") or "").strip()
    if not content:
        content = (message.get("reasoning_content") or "").strip()
    if not content:
        logger.error("Nemotron returned empty content. Full message: %s", json.dumps(message)[:1000])
        raise RuntimeError("Nemotron returned empty content")

    logger.info("Nemotron raw output (first 300 chars): %s", content[:300])

    sections = _parse_delimited_output(content)
    logger.info("Parsed sections: %s", list(sections.keys()))

    components: dict[str, str] = {}
    for key in _COMPONENT_KEYS:
        if key in sections and sections[key].strip():
            components[key] = sections[key].strip()

    _VALID_ACTIONS = {"DIRECT_CODE", "SLACK_MESSAGE"}
    raw_action = (sections.get("actiontype") or "").strip().upper()
    if raw_action in _VALID_ACTIONS:
        action_type = raw_action
    elif components:
        action_type = "DIRECT_CODE"
    else:
        action_type = "SLACK_MESSAGE"

    if action_type == "DIRECT_CODE":
        if not components:
            logger.error("No component sections found. Raw: %s", content[:500])
            raise RuntimeError("Nemotron output has no component sections")
        payload_str = json.dumps(components)
    else:
        payload_str = sections.get("payload", "")

    reasoning = sections.get("reasoning", "Auto-generated revamp based on competitor page analysis")

    raw = {
        "id": f"intel-{uuid.uuid4().hex[:12]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "generating",
        "actionType": action_type,
        "payload": payload_str,
        "reasoning": reasoning,
    }

    return AgentActionPayload.model_validate(raw)
