# AutoWeb Backend

FastAPI service for agent webhooks, API, and Intelligence Engine.

## Run

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # then set FIRECRAWL_API_KEY, NVIDIA_API_KEY, BACKEND_BASE_URL
uvicorn app.main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

`.env` is loaded from the `backend/` directory (whether or not you start the server from another directory).

## Endpoints

- `GET /health` ΓÇö Health check
- `POST /agent/webhook` ΓÇö Accept site-change payload from agent (202 Accepted)
- `POST /intel/run` ΓÇö Run Intelligence Engine (body: `{ "url": "https://..." }`)
