"""
Application settings for AutoWeb backend.
Load from environment; .env is loaded from the backend directory when present.
"""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Firecrawl: scrape target URLs
    firecrawl_api_key: str = ""

    # NVIDIA NIM / Nemotron: chat completions
    nvidia_api_key: str = ""

    # Base URL of this backend (for Intelligence Engine to POST to /agent/webhook)
    backend_base_url: str = "http://localhost:8000"


settings = Settings()
