"""
Firecrawl service: scrape a target URL and return normalized crawl data.
Uses Firecrawl v2 API. Returns a canonical structure for the diff layer.
"""
import re

import httpx

from app.config import settings

SCRAPE_URL = "https://api.firecrawl.dev/v2/scrape"


def scrape_url(url: str) -> dict:
    """
    Scrape the given URL via Firecrawl v2 API.
    Returns normalized structure: hero, pricing, features, markdown, html, design_hints, url.
    """
    if not settings.firecrawl_api_key:
        raise ValueError("FIRECRAWL_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {settings.firecrawl_api_key}",
        "Content-Type": "application/json",
    }
    body = {
        "url": url,
        "formats": ["markdown", "html"],
        "onlyMainContent": False,
    }

    with httpx.Client(timeout=60.0) as client:
        resp = client.post(SCRAPE_URL, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    if not data.get("success"):
        raise RuntimeError(f"Firecrawl scrape failed: {data.get('error', 'unknown')}")

    raw = data.get("data", {})
    markdown = raw.get("markdown") or ""
    html = raw.get("html") or ""

    normalized = _normalize_crawl(markdown)
    normalized["markdown"] = markdown
    normalized["html"] = html
    normalized["url"] = url
    normalized["design_hints"] = _extract_design_hints(html)
    return normalized


def _extract_design_hints(html: str) -> dict:
    """
    Pull visual design signals from raw HTML: brand colors, layout patterns,
    section types, and text samples.
    """
    if not html:
        return {}

    hex_colors = list(dict.fromkeys(re.findall(r"#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b", html)))

    rgb_colors = re.findall(r"rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)", html)
    rgb_colors = list(dict.fromkeys(rgb_colors))

    layout_patterns: list[str] = []
    if re.search(r"grid|grid-cols|display:\s*grid", html, re.I):
        layout_patterns.append("grid")
    if re.search(r"flex|flex-col|display:\s*flex", html, re.I):
        layout_patterns.append("flex")

    section_ids = re.findall(r'<section[^>]*(?:id|class)=["\']([^"\']*)["\']', html, re.I)

    bg_classes = re.findall(r'bg-\[([^\]]+)\]', html)
    bg_classes = list(dict.fromkeys(bg_classes))

    text_classes = re.findall(r'text-\[([^\]]+)\]', html)
    text_classes = list(dict.fromkeys(text_classes))

    return {
        "hex_colors": hex_colors[:20],
        "rgb_colors": rgb_colors[:10],
        "bg_values": bg_classes[:10],
        "text_values": text_classes[:10],
        "layout_patterns": layout_patterns,
        "section_hints": section_ids[:15],
    }


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
        if stripped.startswith("# ") and not hero_headline:
            hero_headline = stripped[2:].strip()
            i += 1
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
