"""
Intelligence Engine HTTP endpoint: trigger run for a target URL.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.intel.run import run_intel
from app.services.state import load_previous_crawl

router = APIRouter()


class IntelRunRequest(BaseModel):
    """Request body for POST /intel/run."""
    url: str = Field(..., description="Target URL to scrape and analyze")


@router.post("/run")
def intel_run(body: IntelRunRequest):
    """
    Run the Intelligence Engine for the given target URL.
    Scrapes URL, diffs vs previous state, calls Nemotron if changes, POSTs action to webhook, updates state.
    """
    url = body.url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        raise HTTPException(status_code=400, detail="url must be http or https")
    try:
        result = run_intel(url)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latest")
def intel_latest():
    """
    Return the most recent stored crawl (if any).
    """
    crawl = load_previous_crawl()
    if not crawl:
        raise HTTPException(status_code=404, detail="No crawl available")

    return {
        "url": crawl.get("url"),
        "scanned_at": crawl.get("scanned_at"),
        "hero": crawl.get("hero") or {},
        "features": crawl.get("features") or [],
        "pricing": crawl.get("pricing") or [],
        "keywords": crawl.get("keywords") or [],
    }
