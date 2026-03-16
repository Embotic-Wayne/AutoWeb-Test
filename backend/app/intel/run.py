"""
Orchestration: run the Intelligence Engine pipeline.
1. Firecrawl scrape target URL
2. Diff vs previous state
3. If changes: Nemotron produces AgentAction -> validate -> POST to webhook
4. Update stored state + annotate activity metadata for downstream services
"""
import logging
from datetime import datetime, timezone

import httpx

from app.config import settings
from app.intel.diff import diff_crawl
from app.intel.nemotron import analyze_and_generate_action
from app.services import activity_store
from app.services.firecrawl import scrape_url
from app.services.state import load_previous_crawl, save_crawl

logger = logging.getLogger(__name__)


def _detect_reviews_section(descriptor: dict | None) -> bool:
    """
    Heuristic to detect if the competitor page includes a reviews/testimonials section.
    Based on markdown_after content from the crawl diff.
    """
    if not descriptor:
        return False
    markdown_after = descriptor.get("markdown_after")
    if not isinstance(markdown_after, str):
        return False

    text = markdown_after.lower()
    # Simple keyword heuristics; we intentionally keep this transparent and deterministic.
    review_keywords = [
        "reviews",
        "review",
        "testimonials",
        "testimonial",
        "customer stories",
        "customer story",
        "what our customers say",
        "what our clients say",
    ]
    if any(k in text for k in review_keywords):
        return True

    # Fallback: look for common star-rating glyphs.
    star_snippets = ["★★★★★", "★★★★☆", "5/5", "4.9/5", "4.8/5"]
    return any(snippet in markdown_after for snippet in star_snippets)


def run_intel(target_url: str) -> dict:
    """
    Run the full pipeline for one target URL.
    Returns a result dict: { "crawl": {...}, "changes_detected": bool, "action": AgentActionPayload | None, "webhook_response": {...} | None }
    """
    # 1. Scrape
    crawl = scrape_url(target_url)
    crawl["scanned_at"] = datetime.now(timezone.utc).isoformat()

    # 2. Diff
    previous = load_previous_crawl()
    descriptor = diff_crawl(crawl, previous)

    result = {
        "crawl": {k: v for k, v in crawl.items() if k not in ("markdown", "html")},
        "changes_detected": descriptor is not None,
        "action": None,
        "webhook_response": None,
    }

    if descriptor is None:
        # No changes: still save crawl so next run can diff
        save_crawl(crawl)
        return result

    # 3. Nemotron
    action = analyze_and_generate_action(descriptor)
    result["action"] = action.model_dump()

    # 3a. Persist high-level context for downstream services (Slack, activity log, etc.).
    # This lets the deployment pipeline enrich Slack notifications with URL, sections,
    # and whether we detected a reviews/testimonials area on the competitor page.
    try:
        meta_updates: dict = {
            "timestamp": crawl["scanned_at"],
            "target_url": target_url,
            "changed_sections": descriptor.get("changed_sections", []),
        }
        if _detect_reviews_section(descriptor):
            meta_updates["has_reviews_section"] = True
        activity_store.upsert_activity(action.id, meta_updates)
    except Exception as e:
        # This metadata is best-effort; do not fail the intel run if it breaks.
        logger.warning("Failed to persist intel metadata for %s: %s", getattr(action, "id", "?"), e)

    # 4. POST to webhook
    webhook_url = f"{settings.backend_base_url.rstrip('/')}/agent/webhook"
    payload_json = action.model_dump(mode="json")
    try:
        with httpx.Client(timeout=30.0) as client:
            wh_resp = client.post(webhook_url, json=payload_json)
            ct = (wh_resp.headers.get("content-type") or "").lower()
            if "application/json" in ct:
                try:
                    body = wh_resp.json()
                except Exception:
                    body = wh_resp.text
            else:
                body = wh_resp.text
            result["webhook_response"] = {"status_code": wh_resp.status_code, "body": body}
    except Exception as e:
        result["webhook_response"] = {"error": str(e)}
    finally:
        # 5. Update state
        save_crawl(crawl)

    return result
