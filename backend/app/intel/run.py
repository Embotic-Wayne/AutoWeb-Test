"""
Orchestration: run the Intelligence Engine pipeline.
1. Firecrawl scrape target URL
2. Diff vs previous state
3. If changes: Nemotron produces AgentAction -> validate -> POST to webhook
4. Update stored state
"""
import httpx

from app.config import settings
from app.services.firecrawl import scrape_url
from app.services.state import load_previous_crawl, save_crawl
from app.intel.diff import diff_crawl
from app.intel.nemotron import analyze_and_generate_action


def run_intel(target_url: str) -> dict:
    """
    Run the full pipeline for one target URL.
    Returns a result dict: { "crawl": {...}, "changes_detected": bool, "action": AgentActionPayload | None, "webhook_response": {...} | None }
    """
    # 1. Scrape
    crawl = scrape_url(target_url)

    # 2. Diff
    previous = load_previous_crawl()
    descriptor = diff_crawl(crawl, previous)

    result = {
        "crawl": {k: v for k, v in crawl.items() if k != "markdown"},
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
