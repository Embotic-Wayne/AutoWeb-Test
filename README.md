# AutoWeb

Autonomous AI agent that monitors competitors and updates our website in real-time.

## Monorepo structure

| Path | Description |
|------|-------------|
| `types/` | Shared TypeScript types (e.g. `AgentAction`) for Next.js apps |
| `backend/` | FastAPI (Python) — agent webhook and API |
| `apps/platform` | Next.js dashboard — customer onboarding and agent monitoring (port 3001) |
| `apps/project-flow` | Next.js B2B SaaS landing page (port 3002) |
| `apps/task-master` | Next.js fictional competitor landing page (port 3003) |

## Shared types

- **`types/agent.ts`** — `AgentAction` with `id`, `timestamp`, `status`, `actionType`, `payload`, `reasoning`. Use in apps via path alias `@shared/types/agent`.

## Quick start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  
- Webhook: `POST /agent/webhook` (accepts site-change payload, returns 202)

### Frontend apps

From repo root:

```bash
npm install
npm run dev:platform      # http://localhost:3001
npm run dev:project-flow  # http://localhost:3002
npm run dev:task-master   # http://localhost:3003
```

Tailwind CSS is initialized in all three Next.js apps.

## Project-flow specifics

- **`apps/project-flow/components/ai-generated/`** — Components for UI driven by the agent.
- **`apps/project-flow/dynamic-config.json`** — Config that drives landing page sections (hero, features, cta). Update this to change the live UI.

## Team workflow

- Backend: implement webhook processing and persistence under `backend/`.
- Platform: build onboarding and monitoring UI in `apps/platform`; import `AgentAction` from `@shared/types/agent`.
- Project-flow: add components under `components/ai-generated/` and wire them to `dynamic-config.json`.
- Task-master: use as a static competitor reference; avoid sharing code with project-flow to reduce merge conflicts.
