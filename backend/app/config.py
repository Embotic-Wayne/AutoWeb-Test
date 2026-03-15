import json
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Paths
BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
ACTIVITY_FILE = DATA_DIR / "agent_activity.json"
DANGEROUS_MODE_FILE = DATA_DIR / "dangerous_mode.json"

# Merge retry
MERGE_RETRY_ATTEMPTS = int(os.getenv("MERGE_RETRY_ATTEMPTS", "5"))
MERGE_RETRY_DELAY_SECONDS = int(os.getenv("MERGE_RETRY_DELAY_SECONDS", "12"))

# Runtime dangerous_mode: in-memory, optionally persisted to file
_dangerous_mode: bool | None = None


def _load_dangerous_mode_from_file() -> bool:
    if DANGEROUS_MODE_FILE.exists():
        try:
            data = json.loads(DANGEROUS_MODE_FILE.read_text())
            return bool(data.get("dangerousMode", False))
        except Exception:
            pass
    return str(os.getenv("DANGEROUS_MODE", "false")).lower() in ("true", "1", "yes")


def get_dangerous_mode() -> bool:
    global _dangerous_mode
    if _dangerous_mode is None:
        _dangerous_mode = _load_dangerous_mode_from_file()
    return _dangerous_mode


def set_dangerous_mode(value: bool) -> bool:
    global _dangerous_mode
    _dangerous_mode = value
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        DANGEROUS_MODE_FILE.write_text(json.dumps({"dangerousMode": value}))
    except Exception:
        pass
    return _dangerous_mode


class Settings:
    github_token: str = os.getenv("GITHUB_TOKEN", "")
    github_repo: str = os.getenv("GITHUB_REPO", "")  # owner/repo
    vercel_token: str = os.getenv("VERCEL_TOKEN", "")
    vercel_project_id: str = os.getenv("VERCEL_PROJECT_ID", "")
    vercel_team_id: str | None = os.getenv("VERCEL_TEAM_ID") or None
    slack_webhook_url: str = os.getenv("SLACK_WEBHOOK_URL", "")
    merge_retry_attempts: int = MERGE_RETRY_ATTEMPTS
    merge_retry_delay_seconds: int = MERGE_RETRY_DELAY_SECONDS

    @property
    def dangerous_mode(self) -> bool:
        return get_dangerous_mode()

    def set_dangerous_mode(self, value: bool) -> bool:
        return set_dangerous_mode(value)


settings = Settings()
