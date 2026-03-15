import json
import threading
from pathlib import Path
from typing import Any

from app.config import ACTIVITY_FILE, DATA_DIR

file_lock = threading.Lock()


def _ensure_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not ACTIVITY_FILE.exists():
        with file_lock:
            if not ACTIVITY_FILE.exists():
                ACTIVITY_FILE.write_text("{}")


def get_activity(action_id: str) -> dict[str, Any] | None:
    _ensure_file()
    with file_lock:
        data = json.loads(ACTIVITY_FILE.read_text())
    return data.get(action_id)


def get_all_activities() -> list[dict[str, Any]]:
    _ensure_file()
    with file_lock:
        data = json.loads(ACTIVITY_FILE.read_text())
    # Return as list, newest first (by timestamp if present)
    items = list(data.values())
    items.sort(key=lambda x: x.get("timestamp") or "", reverse=True)
    return items


def upsert_activity(action_id: str, updates: dict[str, Any]) -> dict[str, Any]:
    _ensure_file()
    with file_lock:
        data = json.loads(ACTIVITY_FILE.read_text())
        record = data.setdefault(action_id, {})
        record.update(updates)
        record["id"] = action_id
        ACTIVITY_FILE.write_text(json.dumps(data, indent=2))
    return record
