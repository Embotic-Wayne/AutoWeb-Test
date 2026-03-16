# AutoWeb

Autonomous AI agent that monitors competitor sites and can update your website via pull requests. Flow: **Firecrawl** scrapes a URL → **Nemotron** analyzes changes → **GitHub PR** (and optional **Slack** + **Vercel** deployment).

This repo now includes a full demo stack:

- **Customer dashboard** (platform) to trigger the agent and watch activity
- **Our marketing site** (project-flow) that the agent actually edits via PRs
- **Competitor site** (auto-test-comp) that the Intel engine scrapes
- **FastAPI backend** wiring everything together

---

## Monorepo structure

| Path                  | Description                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `backend/`            | FastAPI — Intelligence Engine (Firecrawl, Nemotron) + deployment pipeline (GitHub, Vercel, Slack)   |
| `apps/platform`       | Next.js dashboard (port 3001). Onboarding, “Run Agent” button, activity log, dangerous mode toggle. |
| `apps/project-flow`   | Next.js B2B SaaS landing page (port 3002). ai-generated components are overwritten by the pipeline. |
| `apps/auto-test-comp` | Next.js competitor landing page (port 3004). Scraped by Firecrawl.                                  |
| `types/`              | Shared TypeScript types (e.g. `AgentAction`).                                                       |

High-level architecture:

- Platform dashboard → **calls backend**:
  - `POST /intel/run` — “Run Agent” with a competitor URL
  - `GET /agent/activity` — live activity log (polling)
  - `GET/PATCH /agent/dangerous-mode` — toggle auto-merge
- Backend → **GitHub + Vercel + Slack**:
  - Creates PRs that update `apps/project-flow/src/components/ai-generated/*.tsx`
  - Optionally auto-merges and polls Vercel for deployment
  - Sends Slack messages for escalation actions

For deeper backend testing details, see **[TESTING.md](TESTING.md)** and **[backend/README.md](backend/README.md)**.

---

## Quick start: local demo (all four apps)

### Prerequisites

- **Python 3.10+** (backend)
- **Node.js 18+** (Next.js apps)
- **Git**

### 1. Clone and set up backend env

```bash
git clone https://github.com/Embotic-Wayne/AutoWeb-Test.git
cd AutoWeb-Test

cd backend
# Windows
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

Edit `backend/.env`. Minimum for the full PR + deployment flow:

- **Intel Engine:**
  - `FIRECRAWL_API_KEY`
  - `NVIDIA_API_KEY`
  - `BACKEND_BASE_URL=http://localhost:8000`
- **PR creation:**
  - `GITHUB_TOKEN` (fine-grained PAT with repo **Contents** + **Pull requests**, read/write)
  - `GITHUB_REPO` (e.g. `Embotic-Wayne/AutoWeb-Test`)
- **Vercel deploy polling (optional but recommended for demo):**
  - `VERCEL_TOKEN`
  - `VERCEL_PROJECT_ID` (for the `apps/project-flow` Vercel project)
- **Slack escalation (optional):**
  - `SLACK_WEBHOOK_URL`
- **Dangerous mode:**
  - `DANGEROUS_MODE=false` (can be toggled via API or dashboard)

> **Note:** Never commit `backend/.env`. Only `.env.example` is in git.

### 2. Install JS deps and set platform env

From repo root:

```bash
npm install
```

Platform dashboard needs to know where the backend is:

- Local dev file: `apps/platform/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This is already created in this repo; adjust only if you change backend port/host.

### 3. Run everything locally

Use four terminals from the repo root (`AutoWeb-Test`):

**Terminal 1 – backend (FastAPI):**

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload  # or uvicorn app.main:app --reload
```

Endpoints:

- API base: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

**Terminal 2 – platform dashboard:**

```bash
npm run dev:platform    # http://localhost:3001
```

**Terminal 3 – project-flow (our site):**

```bash
npm run dev:project-flow   # http://localhost:3002
```

**Terminal 4 – competitor site:**

```bash
npm run dev:auto-test-comp   # http://localhost:3004
```

---

## End-to-end flow from the dashboard

Once all four services are running:

1. Open **platform dashboard** at http://localhost:3001.
2. In **Onboarding → Add Competitors**, add `http://localhost:3004` (or a deployed competitor URL).
3. Switch to the **Activity** tab:
   - At the top, you’ll see a competitor URL input and a **Run Agent** button.
   - By default it points at `http://localhost:3004`.
4. Click **Run Agent**:
   - The dashboard calls `POST /intel/run` on the backend.
   - Backend: Firecrawl scrapes the competitor → diffs vs last crawl → Nemotron generates an `AgentAction`.
   - Backend self-calls `POST /agent/webhook`, which:
     - Creates a GitHub branch + PR updating `apps/project-flow/src/components/ai-generated/*.tsx`.
     - If dangerous mode is **on**, auto-merges and polls Vercel (when configured).
5. Watch the **Activity Log** list update (it polls `GET /agent/activity` every few seconds):
   - Initial statuses like `generating` / `in_progress`
   - Then `pr_opened` with a **View PR** link
   - If dangerous mode + Vercel configured: `merged` → `ready` with a **View Deployment** link.
6. Open **project-flow** at http://localhost:3002:
   - The `Hero`, `Stats`, `Features`, `Courses`, `Pricing`, `CTA` components under `src/components/ai-generated/` reflect the latest PR content after you merge/pull.

You can also hit the backend directly via Swagger:

- **POST /intel/run** — manual trigger (body: `{"url": "http://localhost:3004"}`)
- **GET /agent/activity** — list all runs
- **GET /agent/dangerous-mode**, **PATCH /agent/dangerous-mode** — control auto-merge flag

For more low-level webhook tests (bypassing Nemotron), see **[TESTING.md](TESTING.md)**.

---

## Deployments (high level)

For a hackathon demo, the simplest is:

- **Backend** (`backend/`): run locally on your laptop (as above), or deploy to a Python-friendly host (Railway/Render/Fly.io).
- **Platform dashboard** (`apps/platform`): Vercel project with Root Directory set to `apps/platform`.
  - In Vercel env vars: `NEXT_PUBLIC_API_URL=http://localhost:8000` if you demo from the same machine running the backend.
- **Project-flow** (`apps/project-flow`): Vercel project with Root Directory `apps/project-flow`.
  - Use its **Project ID** in `VERCEL_PROJECT_ID` for backend polling.
- **Competitor site** (`apps/auto-test-comp`):
  - Either run locally at `http://localhost:3004` or deploy as a separate Vercel project (Root Directory `apps/auto-test-comp`) and use that URL when running the agent.

Because the dashboard is a client-side Next.js app, using `NEXT_PUBLIC_API_URL=http://localhost:8000` works fine for a local demo: the browser on your laptop talks to your locally running backend even if the dashboard is deployed on Vercel.

---

## Backend details

See **[backend/README.md](backend/README.md)** and **[TESTING.md](TESTING.md)** for:

- Full list of environment variables and what each integration requires (GitHub, Vercel, Slack, Intel).
- All API routes (`/intel/run`, `/agent/webhook`, `/agent/activity`, `/agent/dangerous-mode`).
- How the deployment pipeline works internally (GitHub branch + PR, auto-merge, Vercel poll).

---

## Project-flow specifics

- **`apps/project-flow/src/components/ai-generated/`** — Components (e.g. `Hero.tsx`) that the pipeline updates when Nemotron returns `DIRECT_CODE`.
- **`apps/project-flow/dynamic-config.json`** — Config for hero, features, CTA; can be aligned with agent-generated content.

---
