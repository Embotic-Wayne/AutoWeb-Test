# AutoWeb Backend

FastAPI service that runs the **Intelligence Engine** (Firecrawl + Nemotron) and the **deployment pipeline** (GitHub PR, Slack, optional Vercel).

**Flow:** Scrape a URL → diff vs previous state → if changes, Nemotron returns an action (DIRECT_CODE or SLACK_MESSAGE) → webhook runs the pipeline → GitHub branch/PR (and Slack notification for DIRECT_CODE; Slack-only for SLACK_MESSAGE).

---

## Run locally

### 1. Create env from example

```bash
cd backend
# Windows
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

### 2. Edit `.env` with your values

| Variable | Required for | Where to get it |
|----------|--------------|------------------|
| `FIRECRAWL_API_KEY` | Intel Engine (scrape) | [firecrawl.dev](https://firecrawl.dev) |
| `NVIDIA_API_KEY` | Intel Engine (Nemotron) | [build.nvidia.com](https://build.nvidia.com) |
| `BACKEND_BASE_URL` | Intel → webhook | `http://localhost:8000` for local |
| `GITHUB_TOKEN` | Create branch/PR | GitHub → Settings → Developer settings → Personal access tokens |
| `GITHUB_REPO` | Create branch/PR | e.g. `owner/repo` |
| `SLACK_WEBHOOK_URL` | Slack notifications (PR opened + SLACK_MESSAGE) | Slack app → Incoming Webhooks |
| `VERCEL_TOKEN` | Poll deployment after merge | Vercel → Settings → Access Tokens |
| `VERCEL_PROJECT_ID` | Same | Vercel project → Settings → General |
| `DANGEROUS_MODE` | Optional | `false` (default) or `true`; or toggle via `PATCH /agent/dangerous-mode` |

You can start with **FIRECRAWL_API_KEY**, **NVIDIA_API_KEY**, **GITHUB_TOKEN**, and **GITHUB_REPO** to run the full Intel → PR flow. Add Slack to see notifications when a PR is opened.

### 3. Install and run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On Windows if `uvicorn` isn’t on PATH:

```bash
python -m uvicorn app.main:app --reload
```

- **API:** http://localhost:8000  
- **Docs:** http://localhost:8000/docs  
- **Health:** http://localhost:8000/health  

`.env` is loaded from the `backend/` directory.

---

## Endpoints

### Health

- **GET /health** — Returns `{"status": "ok"}`.

### Intelligence Engine

- **POST /intel/run** — Run the pipeline for a URL.  
  **Body:** `{"url": "https://..."}`  
  **Flow:** Firecrawl scrape → diff vs `backend/data/last_crawl.json` → if changes, Nemotron → POST to `/agent/webhook` → deployment pipeline (PR, Slack, etc.).  
  **Returns:** `crawl`, `changes_detected`, `action` (if any), `webhook_response`.

### Agent (webhook + activity)

- **POST /agent/webhook** — Accepts an agent action (from Intel or external). Returns 202 and runs the pipeline in the background. Body: `AgentActionPayload` (id, actionType, payload, reasoning, etc.).
- **GET /agent/activity** — List all pipeline runs (PR URLs, status, errors).
- **GET /agent/activity/{action_id}** — One run by action ID.
- **GET /agent/dangerous-mode** — Current auto-merge flag.
- **PATCH /agent/dangerous-mode** — Body `{"dangerousMode": true|false}` to toggle (no restart).

---

## How to test

1. **Health:** Open http://localhost:8000/health → expect `{"status":"ok"}`.

2. **Full Intel → PR flow:** In Swagger (http://localhost:8000/docs), call **POST /intel/run** with:
   ```json
   {"url": "https://example.com"}
   ```
   - **First run** (or after deleting `backend/data/last_crawl.json`): you should get `changes_detected: true`, an `action`, and `webhook_response`. Check GitHub for a new branch and PR; check Slack if configured.
   - **Second run** with same URL and no site change: `changes_detected: false`, no action, no webhook.

3. **Activity:** **GET /agent/activity** to see runs, `pr_url`, `branch`, `status`.

4. **Direct webhook (optional):** **POST /agent/webhook** with a DIRECT_CODE or SLACK_MESSAGE body to test the pipeline without Intel (see [TESTING.md](../TESTING.md) for example payloads).

---

## Data and security

- **`backend/data/`** is gitignored. It stores:
  - **`last_crawl.json`** — previous scrape for diff (Intel Engine).
  - **`agent_activity.json`** — pipeline run history.
  - **`dangerous_mode.json`** — optional override for DANGEROUS_MODE.
- **Never commit `backend/.env`** — it contains secrets. Only `.env.example` (placeholders) is in the repo.
