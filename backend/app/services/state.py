"""
State storage: read/write previous crawl for diff comparison.
Uses a JSON file under backend/data/.
"""
import json
from pathlib import Path

# Default to backend/data relative to this file
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
LAST_CRAWL_PATH = DATA_DIR / "last_crawl.json"


def load_previous_crawl() -> dict | None:
    """Load the last stored crawl, or None if none exists."""
    if not LAST_CRAWL_PATH.exists():
        return None
    try:
        text = LAST_CRAWL_PATH.read_text(encoding="utf-8")
        return json.loads(text)
    except (json.JSONDecodeError, OSError):
        return None


def save_crawl(crawl: dict) -> None:
    """Persist crawl data as the new 'previous' state."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LAST_CRAWL_PATH.write_text(json.dumps(crawl, indent=2), encoding="utf-8")
