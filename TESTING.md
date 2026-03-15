# Testing the Deployment Pipeline (feature branch)

Use this guide to clone the **feature/deployment-pipeline** branch and run the backend, test the webhook, and optionally run the Next.js apps.

---

## 1. Clone and checkout the branch

```bash
git clone https://github.com/Embotic-Wayne/AutoWeb-Test.git
cd AutoWeb-Test
git fetch origin
git checkout feature/deployment-pipeline
```

---

## 2. Prerequisites

- **Node.js** 18+ (for Next.js apps; optional if only testing the backend)
- **Python** 3.10+
- **Git**

---

## 3. Backend: env and run

**Create env from example (no secrets are committed):**

```bash
cd backend
copy .env.example .env
```

**Edit `backend/.env`** and set real values. Minimum to test PR creation:

| Variable | Required for | Where to get it |
|----------|--------------|------------------|
| `GITHUB_TOKEN` | DIRECT_CODE (branch, PR) | GitHub → Settings → Developer settings → Personal access tokens (fine-grained: repo **Contents** + **Pull requests** Read and write) |
| `GITHUB_REPO` | DIRECT_CODE | Your repo, e.g. `Embotic-Wayne/AutoWeb-Test` |
| `VERCEL_TOKEN` | Poll deployment after merge | Vercel → Settings → Access Tokens (scope to the project) |
| `VERCEL_PROJECT_ID` | Same | Vercel project → Settings → General → Project ID |
| `SLACK_WEBHOOK_URL` | SLACK_MESSAGE only | Slack app → Incoming Webhooks → Webhook URL |
| `DANGEROUS_MODE` | Optional | `false` or `true`; can also toggle via API |

You can start with **only** `GITHUB_TOKEN` and `GITHUB_REPO` to test PR creation; add Vercel/Slack when testing those flows.

**Install and run:**

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

On Windows use **`python -m uvicorn`** if `uvicorn` isn't on your PATH.

- API base: **http://localhost:8000**
- Docs: **http://localhost:8000/docs**
- Health: **http://localhost:8000/health**

---

## 4. What to test

Open **http://localhost:8000/docs** (Swagger UI).

### POST /agent/webhook

- **DIRECT_CODE** (creates branch + PR with React code):
  ```json
  {
    "id": "test-1",
    "actionType": "DIRECT_CODE",
    "payload": "export default function Hero() { return <h1>Updated Pricing</h1> }",
    "reasoning": "Competitor lowered prices; updating our hero for parity."
  }
  ```
  Expect **202** and `{"received": true, "actionId": "test-1"}`. With valid `GITHUB_TOKEN` and `GITHUB_REPO`, a branch and PR are created in the repo.

- **SLACK_MESSAGE** (sends reasoning + suggested text to Slack):
  ```json
  {
    "id": "test-slack-1",
    "actionType": "SLACK_MESSAGE",
    "payload": "Consider adding a pricing banner to the homepage.",
    "reasoning": "Competitor X just launched a promo; we should respond."
  }
  ```
  Requires `SLACK_WEBHOOK_URL` in `.env`.

### Other endpoints

- **GET /agent/activity** — List all pipeline runs (with `pr_url`, `branch`, `status`, etc.).
- **GET /agent/activity/{id}** — Single run (e.g. `test-1`).
- **GET /agent/dangerous-mode** — Current auto-merge flag.
- **PATCH /agent/dangerous-mode** — Body `{"dangerousMode": true}` or `false` to toggle (no restart).

---

## 5. DIRECT_CODE flow (what actually runs)

1. Webhook accepted → pipeline runs in the background.
2. Branch created: `agent-update-<timestamp>`.
3. File updated: **`apps/project-flow/src/components/ai-generated/Hero.tsx`** with the `payload` (React code).
4. PR opened; activity record gets `pr_url`, `branch`.
5. If **DANGEROUS_MODE** is true: PR is merged (with retry), then Vercel is polled by merge commit SHA until the deployment is READY; activity gets `deployment_url`, `live_at`.

The repo must be one the pipeline can create branches and PRs in (e.g. `GITHUB_REPO=Embotic-Wayne/AutoWeb-Test` and token has access).

---

## 6. Optional: run the Next.js apps

From repo root:

```bash
npm install
npm run dev:project-flow   # http://localhost:3002
```

Project-flow's page dynamically imports **Hero** from `@/components/ai-generated/Hero`; after the pipeline updates that file and you merge (or pull), the UI will show the new hero.

---

## 7. Gotchas

- **No `.env` in repo** — Only `.env.example` is committed. You must create `backend/.env` from it and fill in real values.
- **Windows** — Use `python -m uvicorn app.main:app --reload` and `copy` instead of `cp`.
- **Push protection** — `.env.example` uses placeholders like `your_github_personal_access_token_here`; never put real tokens in `.env.example`.
- **Vercel** — Only needed for the "poll until Live" step after merge. PR creation works without it.
- **Data** — Activity is stored in **`backend/data/agent_activity.json`** (and optional `dangerous_mode.json`). That directory is gitignored; each clone starts with empty state.

---

## 8. Quick start (after editing `.env`)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Then open **http://localhost:8000/docs** and try **POST /agent/webhook** and **GET /agent/activity**.
