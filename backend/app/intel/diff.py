"""
Logic controller: compare new crawl vs previous state.
Detects changes in Hero, Pricing, or Features and outputs a change descriptor for Nemotron.
"""
from typing import Any


def diff_crawl(new_crawl: dict, previous_crawl: dict | None) -> dict | None:
    """
    Compare new_crawl to previous_crawl.
    Returns a change descriptor for Nemotron, or None if no changes.
    Descriptor shape: { "changed_sections": [...], "hero_before": ..., "hero_after": ..., ... }
    """
    if previous_crawl is None:
        # First run: treat as full new content (all sections "changed")
        return _build_descriptor(
            changed_sections=["hero", "pricing", "features"],
            new_crawl=new_crawl,
            previous_crawl={},
        )

    changed: list[str] = []

    # Hero
    new_hero = (new_crawl.get("hero") or {}) if isinstance(new_crawl.get("hero"), dict) else {}
    old_hero = (previous_crawl.get("hero") or {}) if isinstance(previous_crawl.get("hero"), dict) else {}
    if _hero_changed(new_hero, old_hero):
        changed.append("hero")

    # Pricing (list comparison)
    new_pricing = new_crawl.get("pricing") if isinstance(new_crawl.get("pricing"), list) else []
    old_pricing = previous_crawl.get("pricing") if isinstance(previous_crawl.get("pricing"), list) else []
    if _list_changed(new_pricing, old_pricing):
        changed.append("pricing")

    # Features
    new_features = new_crawl.get("features") if isinstance(new_crawl.get("features"), list) else []
    old_features = previous_crawl.get("features") if isinstance(previous_crawl.get("features"), list) else []
    if _list_changed(new_features, old_features):
        changed.append("features")

    if not changed:
        return None

    return _build_descriptor(
        changed_sections=changed,
        new_crawl=new_crawl,
        previous_crawl=previous_crawl,
    )


def _hero_changed(new: dict, old: dict) -> bool:
    a = (new.get("headline") or "").strip(), (new.get("subheadline") or "").strip()
    b = (old.get("headline") or "").strip(), (old.get("subheadline") or "").strip()
    return a != b


def _list_changed(new: list, old: list) -> bool:
    return new != old


def _build_descriptor(
    changed_sections: list[str],
    new_crawl: dict,
    previous_crawl: dict,
) -> dict:
    out: dict[str, Any] = {
        "changed_sections": changed_sections,
    }
    if "hero" in changed_sections:
        out["hero_before"] = previous_crawl.get("hero") or {}
        out["hero_after"] = new_crawl.get("hero") or {}
    if "pricing" in changed_sections:
        out["pricing_before"] = previous_crawl.get("pricing") or []
        out["pricing_after"] = new_crawl.get("pricing") or []
    if "features" in changed_sections:
        out["features_before"] = previous_crawl.get("features") or []
        out["features_after"] = new_crawl.get("features") or []
    # Include full markdown for context if present
    if new_crawl.get("markdown"):
        out["markdown_after"] = new_crawl["markdown"]
    if previous_crawl.get("markdown"):
        out["markdown_before"] = previous_crawl["markdown"]
    return out
