from fastapi import FastAPI
from app.routers import agent, intel

app = FastAPI(title="AutoWeb API", version="0.1.0")

app.include_router(agent.router, prefix="/agent", tags=["agent"])
app.include_router(intel.router, prefix="/intel", tags=["intel"])


@app.get("/health")
def health():
    return {"status": "ok"}
