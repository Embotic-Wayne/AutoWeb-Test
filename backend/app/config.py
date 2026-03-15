"""
Application settings for AutoWeb backend.
Intel Engine: Firecrawl, Nemotron, backend_base_url.
Deployment pipeline: GitHub, Vercel, Slack, dangerous_mode.
"""
import json
import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent

# Paths used by deployment pipeline
DATA_DIR = _BACKEND_DIR / "data"
ACTIVITY_FILE = DATA_DIR / "agent_activity.json"
DANGEROUS_MODE_FILE = DATA_DIR / "dangerous_mode.json"

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


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Intel Engine: Firecrawl, Nemotron
    firecrawl_api_key: str = ""
    nvidia_api_key: str = ""
    backend_base_url: str = "http://localhost:8000"

    # Deployment pipeline: GitHub, Vercel, Slack
    github_token: str = ""
    github_repo: str = ""
    vercel_token: str = ""
    vercel_project_id: str = ""
    vercel_team_id: str | None = None
    slack_webhook_url: str = ""
    merge_retry_attempts: int = 5
    merge_retry_delay_seconds: int = 12

    @property
    def dangerous_mode(self) -> bool:
        return get_dangerous_mode()

    def set_dangerous_mode(self, value: bool) -> bool:
        return set_dangerous_mode(value)


settings = Settings()
