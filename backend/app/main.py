from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from app.routers import agent

app = FastAPI(title="AutoWeb API", version="0.1.0")

app.include_router(agent.router, prefix="/agent", tags=["agent"])


@app.get("/health")
def health():
    return {"status": "ok"}
