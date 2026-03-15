# AutoWeb Backend

FastAPI service for agent webhooks and API.

## Run

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

## Endpoints

- `POST /agent/webhook` — Accept site-change payload from agent (202 Accepted)
- `GET /health` — Health check
