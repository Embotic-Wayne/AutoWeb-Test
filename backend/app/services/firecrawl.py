"""
Firecrawl service: scrape a target URL and return normalized crawl data.
Uses Firecrawl v2 API. Returns a canonical structure for the diff layer.
"""
import httpx

from app.config import settings

SCRAPE_URL = "https://api.firecrawl.dev/v2/scrape"


def scrape_url(url: str) -> dict:
    """
    Scrape the given URL via Firecrawl v2 API.
    Returns normalized structure: hero, pricing, features, markdown, url.
    """
    if not settings.firecrawl_api_key:
        raise ValueError("FIRECRAWL_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {settings.firecrawl_api_key}",
        "Content-Type": "application/json",
    }
    body = {
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True,
    }

    with httpx.Client(timeout=60.0) as client:
        resp = client.post(SCRAPE_URL, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    if not data.get("success"):
        raise RuntimeError(f"Firecrawl scrape failed: {data.get('error', 'unknown')}")

    raw = data.get("data", {})
    markdown = raw.get("markdown") or ""

    # Normalize to canonical structure for diff: hero, pricing, features
    normalized = _normalize_crawl(markdown)
    normalized["markdown"] = markdown
    normalized["url"] = url
    return normalized


def _normalize_crawl(markdown: str) -> dict:
    """
    Extract hero (headline, subheadline), pricing, and features from markdown.
    Uses simple heuristics: first # as headline, next paragraph as subheadline;
    sections under ## Pricing / ## Features as lists.
    """
    lines = markdown.strip().split("\n")
    hero_headline = ""
    hero_subheadline = ""
    pricing: list[str] = []
    features: list[str] = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        # First # heading = hero headline
        if stripped.startswith("# ") and not hero_headline:
            hero_headline = stripped[2:].strip()
            i += 1
            # Next non-empty line(s) as subheadline until next heading or empty
            while i < len(lines):
                next_line = lines[i].strip()
                if next_line.startswith("#") or not next_line:
                    break
                if hero_subheadline:
                    hero_subheadline += " " + next_line
                else:
                    hero_subheadline = next_line
                i += 1
            continue
        if stripped.lower().startswith("## pricing"):
            i += 1
            while i < len(lines):
                l = lines[i].strip()
                if l.startswith("##"):
                    break
                if l and (l.startswith("- ") or l.startswith("* ")):
                    pricing.append(l[2:].strip())
                i += 1
            continue
        if stripped.lower().startswith("## features"):
            i += 1
            while i < len(lines):
                l = lines[i].strip()
                if l.startswith("##"):
                    break
                if l and (l.startswith("- ") or l.startswith("* ")):
                    features.append(l[2:].strip())
                i += 1
            continue
        i += 1

    return {
        "hero": {"headline": hero_headline, "subheadline": hero_subheadline},
        "pricing": pricing,
        "features": features,
    }
