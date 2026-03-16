from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import agent, intel, personalization

app = FastAPI(title="AutoWeb API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent.router, prefix="/agent", tags=["agent"])
app.include_router(intel.router, prefix="/intel", tags=["intel"])
app.include_router(personalization.router, prefix="/personalization", tags=["personalization"])


@app.get("/health")
def health():
    return {"status": "ok"}
