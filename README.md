# AutoWeb

Autonomous AI agent that monitors competitor sites and can update your website via pull requests. Flow: **Firecrawl** scrapes a URL → **Nemotron** analyzes changes → **GitHub PR** (and optional **Slack** + **Vercel** deployment).

## Monorepo structure

| Path | Description |
|------|-------------|
| `backend/` | FastAPI — Intelligence Engine (Firecrawl, Nemotron) + deployment pipeline (GitHub, Vercel, Slack) |
| `apps/project-flow` | Next.js B2B SaaS landing page — Hero and ai-generated components updated by the pipeline |
| `apps/platform` | Next.js dashboard (port 3001) |
| `apps/task-master` | Next.js fictional competitor (port 3003) |
| `types/` | Shared TypeScript types (e.g. `AgentAction`) |

## Quick start: run and test

### Prerequisites

- **Python 3.10+** (backend)
- **Node.js 18+** (optional, for Next.js apps)
- **Git**

### 1. Clone and backend env

```bash
git clone https://github.com/Embotic-Wayne/AutoWeb-Test.git
cd AutoWeb-Test
cd backend
```

Copy the example env and add your keys (see [backend README](backend/README.md) for where to get them):

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `backend/.env`. Minimum to test the full flow:

- **Intel:** `FIRECRAWL_API_KEY`, `NVIDIA_API_KEY`, `BACKEND_BASE_URL=http://localhost:8000`
- **PR creation:** `GITHUB_TOKEN`, `GITHUB_REPO`
- **Slack (optional):** `SLACK_WEBHOOK_URL` — get a notification when a PR is opened

### 2. Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- **API:** http://localhost:8000  
- **Docs (Swagger):** http://localhost:8000/docs  
- **Health:** http://localhost:8000/health  

### 3. Test the full flow

Open http://localhost:8000/docs and call **POST /intel/run** with:

```json
{"url": "https://example.com"}
```

(or any public URL you want to monitor).

- **First run** (or after deleting `backend/data/last_crawl.json`): the backend scrapes the URL, detects “changes,” calls Nemotron, and POSTs the action to the webhook. You get a **GitHub PR** with updated `Hero.tsx` and, if configured, a **Slack** message.
- **Subsequent runs** with the same URL: if the site hasn’t changed, you get `changes_detected: false` and no PR.

**Useful endpoints:**

- **GET /agent/activity** — list pipeline runs (PR links, status).
- **GET /agent/activity/{action_id}** — details for one run.
- **GET /agent/dangerous-mode** — current auto-merge flag.
- **PATCH /agent/dangerous-mode** — body `{"dangerousMode": true}` to auto-merge PRs and poll Vercel (requires Vercel env vars).

### 4. Optional: run the frontend

From repo root:

```bash
npm install
npm run dev:project-flow   # http://localhost:3002
```

To preview a PR’s changes locally: checkout the PR branch (e.g. `agent-update-<timestamp>`), then run `npm run dev:project-flow` and open the app in the browser.

## Backend details

See **[backend/README.md](backend/README.md)** for env vars, all endpoints, and testing tips.

## Project-flow specifics

- **`apps/project-flow/src/components/ai-generated/`** — Components (e.g. `Hero.tsx`) that the pipeline updates when Nemotron returns DIRECT_CODE.
- **`apps/project-flow/dynamic-config.json`** — Config for hero, features, CTA; can be aligned with agent-generated content.

## Security

- **Never commit `backend/.env`** — it holds API keys. Only `backend/.env.example` (placeholders) is in the repo.
- `.gitignore` excludes `.env`, `backend/.env`, and `backend/data/`.
