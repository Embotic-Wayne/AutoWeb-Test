# AutoWeb Integration Plan

Use this document to understand every piece of the codebase and how to connect them into one working product. This is written for a Cursor Agent to execute.

---

## 1. Current State — What Exists

### 1a. Backend (FastAPI — `backend/`)

The backend has TWO independent engines that are already wired together:

**Intel Engine** (`app/intel/` + `app/services/firecrawl.py` + `app/services/state.py`)
- **Route:** `POST /intel/run` — body `{ "url": "https://..." }`
- **Flow:** Firecrawl scrapes URL → diff vs previous crawl (`data/last_crawl.json`) → Nemotron generates `AgentAction` JSON → POSTs to `POST /agent/webhook` → saves crawl state.
- **Output:** An `AgentAction` with `actionType: "DIRECT_CODE"` (React code in `payload`) or `"SLACK_MESSAGE"` (escalation text).

**Deployment Pipeline** (`app/services/pipeline.py` + `github_service.py` + `vercel_service.py` + `slack_service.py` + `activity_store.py`)
- **Route:** `POST /agent/webhook` — body is `AgentActionPayload`.
- **Flow:** Persists "received" → branches on `actionType`:
  - `DIRECT_CODE`: GitHub branch + commit + PR → optional auto-merge → Vercel poll until Live.
  - `SLACK_MESSAGE`: Sends Block Kit message to Slack webhook.
- **Persistence:** `data/agent_activity.json` — updated at every pipeline step (pr_url, merge_commit_sha, deployment_url, live_at, etc.). Thread-safe with `threading.Lock`.

**Other Backend Routes:**
- `GET /agent/activity` — list all activity records (for dashboard).
- `GET /agent/activity/{id}` — single activity record.
- `GET /agent/dangerous-mode` — current auto-merge flag.
- `PATCH /agent/dangerous-mode` — toggle auto-merge (`{ "dangerousMode": true }`).
- `GET /health` — health check.

**Config** (`app/config.py`): Uses `pydantic_settings.BaseSettings` loading from `backend/.env`:
- Intel: `FIRECRAWL_API_KEY`, `NVIDIA_API_KEY`, `BACKEND_BASE_URL`
- Pipeline: `GITHUB_TOKEN`, `GITHUB_REPO`, `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `SLACK_WEBHOOK_URL`
- Runtime: `DANGEROUS_MODE` (also toggleable via API and persisted in `data/dangerous_mode.json`)

**Schemas** (`app/schemas/agent.py`):
```python
class AgentActionPayload(BaseModel):
    id: str
    timestamp: Optional[str] = None
    status: Optional[AgentStatusLiteral] = None
    actionType: Literal["DIRECT_CODE", "SLACK_MESSAGE"]
    payload: str
    reasoning: str
```

---

### 1b. Frontend App: `apps/platform` (port 3001) — Customer Dashboard

**Purpose:** Dashboard for customer onboarding and agent monitoring.

**Current state:**
- Uses Supabase for auth (sign-in/sign-up/sign-out via `@supabase/ssr`).
- Single-page with sidebar nav and tabs: Onboarding, Activity Log, Competitor Insights, Personalization, SEO/GEO, Settings.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

**Problem:** ALL data is hardcoded/mock. The dashboard does NOT call any backend REST endpoints. It has:
- Mock activity log entries (hardcoded array).
- Mock competitor insights (hardcoded).
- Mock onboarding steps (local state only, not persisted).
- Settings page with agent mode, competitors, Slack webhook inputs — but no save/submit to backend.

**What needs to happen:**
1. Connect the Activity Log tab to `GET /agent/activity` (poll or fetch on load).
2. Add a way to trigger the intel engine from the dashboard (e.g. "Run Agent" button → `POST /intel/run` with the competitor URL).
3. Connect Settings to `GET/PATCH /agent/dangerous-mode`.
4. Display real `pr_url`, `deployment_url`, `live_at` from activity records as clickable links.
5. Needs `NEXT_PUBLIC_API_URL` env var pointing to the backend (e.g. `http://localhost:8000`).

---

### 1c. Frontend App: `apps/project-flow` (port 3002) — "Our" Landing Page (Learnify)

**Purpose:** This is "our company's" website — the one the AI agent updates. The deployment pipeline commits code to `apps/project-flow/src/components/ai-generated/*.tsx` and deploys via Vercel.

**Current state:**
- Full Learnify education landing page with Header, Hero, Stats, Features, Courses, Pricing, CTA, Footer.
- Page (`src/app/page.tsx`) dynamically imports ALL ai-generated components: Hero, Stats, Features, Courses, Pricing, CTA.
- Components are in `src/components/ai-generated/` — these are the files the pipeline overwrites.
- Header has a "Before / After" toggle (currently no-op or visual only).
- Uses Tailwind CSS, Geist font.
- Deployed on Vercel (root directory: `apps/project-flow`).

**Problem:** Mostly working. The ai-generated components already have Learnify content. When the pipeline writes new code to these files and deploys, the site updates. The Header/Footer are static and not overwritten.

**What needs to happen:**
- Mostly done. Ensure the Vercel project is connected and auto-deploys on push to main.
- The "Before / After" toggle could be wired to show original vs agent-updated content (optional enhancement).

---

### 1d. Frontend App: `apps/auto-test-comp` (port 3004) — Competitor Site

**Purpose:** This is the "competitor" website that the Intel Engine scrapes. It replaced the original `task-master` app.

**Current state:**
- Another Learnify-style landing page with ViewModeContext (simple vs advanced).
- Has Reviews and conditional Pricing sections (different from project-flow).
- Uses Tailwind v4, Next.js 16, Geist fonts.
- Has a "Before / After" toggle that switches between simple and advanced views via `localStorage`.
- No backend connection.

**What needs to happen:**
- Deploy this on Vercel (or run locally) so it has a URL the Intel Engine can scrape.
- The URL of this deployed site is what gets passed to `POST /intel/run` as the competitor URL.
- No code changes needed; it just needs to be accessible at a URL.

---

### 1e. Shared Types (`types/agent.ts`)

```typescript
export interface AgentAction {
  id: string;
  timestamp: string;
  status: AgentStatus;
  actionType: AgentActionType;  // 'DIRECT_CODE' | 'SLACK_MESSAGE'
  payload: string;
  reasoning: string;
}
```

Wired in `platform` and `project-flow` tsconfigs via `@shared/types/*` path alias but NOT imported anywhere in frontend code yet.

---

### 1f. Root `package.json`

```json
{
  "workspaces": ["apps/*"],
  "scripts": {
    "dev:platform": "npm run dev -w @autoweb/platform",
    "dev:project-flow": "npm run dev -w @autoweb/project-flow",
    "dev:auto-test-comp": "npm run dev -w @autoweb/auto-test-comp"
  }
}
```

---

## 2. Architecture — How It All Connects

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PLATFORM DASHBOARD                          │
│                     (apps/platform, port 3001)                     │
│                                                                     │
│  [Onboarding] → User enters competitor URL                         │
│  [Run Agent]  → POST /intel/run { url: competitor_url }            │
│  [Activity]   → GET /agent/activity (poll for updates)             │
│  [Settings]   → GET/PATCH /agent/dangerous-mode                    │
│  [Activity]   → Shows pr_url, deployment_url as clickable links    │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP calls
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI, port 8000)                   │
│                                                                     │
│  POST /intel/run ──► Firecrawl scrape competitor URL                │
│                   ──► Diff vs previous crawl                        │
│                   ──► Nemotron generates AgentAction                │
│                   ──► POST /agent/webhook (self-call)               │
│                                                                     │
│  POST /agent/webhook ──► run_pipeline(payload)                     │
│                       ──► DIRECT_CODE: GitHub branch + commit + PR  │
│                       ──► If dangerous_mode: merge PR               │
│                       ──► If merged: poll Vercel until Live          │
│                       ──► SLACK_MESSAGE: send to Slack               │
│                       ──► Persist activity at every step             │
│                                                                     │
│  GET /agent/activity ──► Return all activity records                │
│  GET/PATCH /agent/dangerous-mode ──► Toggle auto-merge              │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │ GitHub API                        │ Vercel API
           ▼                                   ▼
┌─────────────────────┐          ┌──────────────────────────┐
│   GitHub Repo        │          │   Vercel (project-flow)   │
│   Branch + PR to:    │──merge──►│   Deploys on merge        │
│   apps/project-flow/ │          │   Poll until READY        │
│   src/components/    │          └──────────────────────────┘
│   ai-generated/*.tsx │                     │
└─────────────────────┘                      ▼
                                ┌──────────────────────────┐
                                │  PROJECT-FLOW SITE        │
                                │  (apps/project-flow)      │
                                │  Shows updated Hero,      │
                                │  Pricing, Features, etc.  │
                                └──────────────────────────┘

┌──────────────────────────┐
│  COMPETITOR SITE          │
│  (apps/auto-test-comp)    │
│  Scraped by Firecrawl     │
│  via POST /intel/run      │
└──────────────────────────┘
```

---

## 3. What Needs to Be Done (Integration Tasks)

### Task 1: Connect Platform Dashboard to Backend API

**File:** `apps/platform/src/app/page.tsx` (the entire dashboard is in this single file)

**Changes needed:**

1. **Add API base URL env var.** The platform needs to know where the backend is.
   - Add `NEXT_PUBLIC_API_URL` to the platform's env (e.g. `http://localhost:8000`).
   - Create a small API helper or use `fetch` directly.

2. **Activity Log tab — replace mock data with real API call.**
   - Currently: hardcoded `activityLog` array with mock entries.
   - Change to: `fetch(`${NEXT_PUBLIC_API_URL}/agent/activity`)` on mount (and optionally poll every 5–10s).
   - Map each activity record to the existing UI format; use `pr_url` and `deployment_url` as clickable links.

3. **Add "Run Agent" button — triggers the intel engine.**
   - In the Onboarding or Activity tab, add a button or form: "Enter competitor URL" + "Run Agent".
   - On click: `POST ${NEXT_PUBLIC_API_URL}/intel/run` with body `{ "url": competitorUrl }`.
   - Show loading state, then redirect to Activity tab to watch progress.

4. **Settings tab — wire dangerous mode toggle.**
   - Currently: `agentMode` is local state (`autonomous` / `supervised`).
   - Change to: on load, `GET /agent/dangerous-mode` to get current value. On toggle, `PATCH /agent/dangerous-mode` with `{ "dangerousMode": bool }`.

5. **Settings tab — wire competitor URL field.**
   - The Settings tab has a "Competitors" input. Store the entered URL in local state (or Supabase) so the "Run Agent" button can use it.

6. **CORS — the backend must allow requests from the platform origin.**
   - Add CORS middleware to `backend/app/main.py`:
     ```python
     from fastapi.middleware.cors import CORSMiddleware
     app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
     ```
   - Or restrict origins to `http://localhost:3001` and the Vercel URL.

---

### Task 2: Add CORS to Backend

**File:** `backend/app/main.py`

Add CORS middleware so the platform dashboard (port 3001) can call the backend (port 8000). Without this, browser requests from the dashboard will be blocked.

---

### Task 3: Deploy auto-test-comp (Competitor Site) — So It Has a URL

**Purpose:** The Intel Engine needs a URL to scrape. Deploy `apps/auto-test-comp` on Vercel (or run locally at `http://localhost:3004`) so you can pass its URL to `POST /intel/run`.

- Create a Vercel project with Root Directory: `apps/auto-test-comp`.
- Or just run `npm run dev:auto-test-comp` locally and use `http://localhost:3004`.

---

### Task 4: Update `.env.example` with Intel Engine Keys

**File:** `backend/.env.example`

Add the Intel Engine env vars that are missing from `.env.example` but used by `config.py`:

```
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
BACKEND_BASE_URL=http://localhost:8000
```

---

### Task 5: Verify End-to-End Flow

After Tasks 1–4 are done, test the full loop:

1. Start backend: `cd backend && python -m uvicorn app.main:app --reload` (port 8000).
2. Start platform: `npm run dev:platform` (port 3001).
3. Start project-flow: `npm run dev:project-flow` (port 3002).
4. Start competitor site: `npm run dev:auto-test-comp` (port 3004).
5. Open platform dashboard (http://localhost:3001).
6. Enter competitor URL (http://localhost:3004 or its Vercel URL).
7. Click "Run Agent".
8. Watch Activity tab update: `generating` → `pr_opened` (with PR link) → `merged` → `ready` (with deployment link).
9. Open project-flow site (http://localhost:3002 or its Vercel URL) — see updated content.

---

## 4. File-by-File Reference

### Backend Files

| File | Purpose | Status |
|------|---------|--------|
| `app/main.py` | FastAPI app, mounts routers | Needs CORS middleware |
| `app/config.py` | Settings from .env (pydantic_settings) | Done |
| `app/routers/agent.py` | Webhook, activity, dangerous-mode routes | Done |
| `app/routers/intel.py` | `POST /intel/run` | Done |
| `app/schemas/agent.py` | `AgentActionPayload` | Done |
| `app/services/pipeline.py` | Pipeline orchestration (GitHub, Vercel, Slack) | Done |
| `app/services/github_service.py` | Branch, commit, PR, merge | Done |
| `app/services/vercel_service.py` | Poll deployment by merge SHA | Done |
| `app/services/slack_service.py` | Block Kit webhook | Done |
| `app/services/firecrawl.py` | Firecrawl v2 scrape + normalize | Done |
| `app/services/activity_store.py` | JSON activity persistence with lock | Done |
| `app/services/state.py` | Last crawl state for diff | Done |
| `app/intel/run.py` | Intel orchestration: scrape → diff → Nemotron → webhook | Done |
| `app/intel/diff.py` | Diff hero/pricing/features vs previous | Done |
| `app/intel/nemotron.py` | Nemotron prompt + parse output | Done |

### Frontend Files

| File | Purpose | Status |
|------|---------|--------|
| `apps/platform/src/app/page.tsx` | Dashboard (single-page, all tabs) | Needs API wiring |
| `apps/platform/src/lib/supabase/client.ts` | Supabase browser client | Done |
| `apps/project-flow/src/app/page.tsx` | Landing page, dynamic imports | Done |
| `apps/project-flow/src/components/ai-generated/*.tsx` | Agent-updated components | Done |
| `apps/project-flow/src/components/Header.tsx` | Static header | Done |
| `apps/project-flow/src/components/Footer.tsx` | Static footer | Done |
| `apps/auto-test-comp/src/app/page.tsx` | Competitor landing page | Done (needs deploy) |

---

## 5. Key Integration Points (For the Agent)

1. **Platform → Backend:** Add `fetch` calls in `apps/platform/src/app/page.tsx` to:
   - `GET ${API_URL}/agent/activity` (Activity tab)
   - `POST ${API_URL}/intel/run` (Run Agent button)
   - `GET ${API_URL}/agent/dangerous-mode` (Settings tab)
   - `PATCH ${API_URL}/agent/dangerous-mode` (Settings toggle)

2. **Backend → Backend:** Intel Engine already self-calls `POST /agent/webhook` after Nemotron. This works.

3. **Backend → GitHub:** Pipeline already creates branch + commit + PR to `apps/project-flow/src/components/ai-generated/`. This works.

4. **GitHub → Vercel:** Vercel auto-deploys project-flow on merge. Pipeline polls by merge SHA. This works.

5. **Backend → Slack:** Pipeline sends Block Kit messages for SLACK_MESSAGE actions. This works.

6. **CORS:** Must be added to `backend/app/main.py` for browser-based dashboard calls.

---

## 6. Environment Variables Summary

### Backend (`backend/.env`)

```
# Intel Engine
FIRECRAWL_API_KEY=...
NVIDIA_API_KEY=...
BACKEND_BASE_URL=http://localhost:8000

# Deployment Pipeline
GITHUB_TOKEN=...
GITHUB_REPO=Embotic-Wayne/AutoWeb-Test
VERCEL_TOKEN=...
VERCEL_PROJECT_ID=...
SLACK_WEBHOOK_URL=...

# Optional
DANGEROUS_MODE=false
```

### Platform (`apps/platform/.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 7. Ports

| App | Port | URL |
|-----|------|-----|
| Backend (FastAPI) | 8000 | http://localhost:8000 |
| Platform dashboard | 3001 | http://localhost:3001 |
| Project-flow (our site) | 3002 | http://localhost:3002 |
| Auto-test-comp (competitor) | 3004 | http://localhost:3004 |

---

## 8. Quick Test Commands

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Platform dashboard
npm run dev:platform

# Terminal 3: Our landing page
npm run dev:project-flow

# Terminal 4: Competitor site
npm run dev:auto-test-comp
```

Then open http://localhost:3001 (dashboard), enter http://localhost:3004 as competitor URL, click Run Agent, and watch the pipeline execute.
