# FastAPI + React (TypeScript) + Tailwind + Docker Jumpstarter

## Overview
A minimal, production-minded starter that pairs **FastAPI + Jinja2** with **React “islands”** built by **Vite + Tailwind** and served as static assets by the API. The Docker image is built in two stages (Node → Python). A **dev compose profile** gives full hot-reload for Python/Jinja and live rebuilds for React/Tailwind—without bloating the runtime image.

## Stack
- Backend: FastAPI, Jinja2 templates, Uvicorn
- Frontend: React 18 + TypeScript, Vite, TailwindCSS, PostCSS/Autoprefixer
- Docker: Multi-stage build (Node 20 LTS → Python 3.12-slim)
- Compose profiles:
  - default: one container (API) serving built assets
  - dev: API hot-reload + Vite watch building to a shared static volume

## Requirements
- Docker & Docker Compose
- (Optional) Git + SSH configured for your GitHub pushes
- `.env` (copy from `.env.example`), primary var:
  - `PORT` (default `8000`)

## Quick Start (production-like)
From repo root:

    cp .env.example .env
    # optionally edit PORT in .env

    docker compose up --build -d
    docker compose logs -f

Open:
- App: http://localhost:${PORT}/
- Health: http://localhost:${PORT}/api/healthcheck

## Dev Profile (full hot reload)
Dev mode runs two containers:
- `api-dev`: FastAPI with backend source bind-mounted; `uvicorn --reload` + template auto-reload.
- `frontend-dev`: Node watcher running `vite build --watch`, writing `app.js/app.css` to a shared named volume that the API serves read-only.

Start dev:

    docker compose --profile dev up --build -d
    docker compose --profile dev logs -f

Edit & see changes:
- Python/Jinja: edit files under `backend/app` → browser refresh reflects changes.
- React/Tailwind: edit files under `frontend/src` → watch logs show quick rebuild; refresh page.

Return to normal:

    docker compose down
    docker compose up -d

## Endpoints
- `GET /` → Jinja2 `index.html`, React navbar mounts at `#navbar-root`
- `GET /api/healthcheck` → `{"status":"ok","uptime_seconds":...,"started_at":...}`

## Directory Tree (key parts)
    backend/
      app/
        templates/        # base.html, index.html
        static/           # app.css, app.js (built by Vite)
        main.py
      requirements.txt
    frontend/
      src/                # React TS + Tailwind sources
      vite.config.ts      # builds single app.js/app.css
      tailwind.config.js  # ESM; scans Jinja and TSX
      postcss.config.js   # ESM
      package.json
    Dockerfile
    docker-compose.yml
    .env.example

## Configuration Notes
- `PORT` controls both container bind and healthcheck target (default `8000`).
- Vite is configured to emit **single** `app.js` + `app.css`. React/Tailwind are bundled into `app.js` so no extra scripts are needed.

## Smoke Tests
1) App loads: visit `/` → see “Jumpstarter” navbar and styled page.  
2) Healthcheck: visit `/api/healthcheck` → JSON `{"status":"ok",...}`.  
3) Static assets: `GET /static/app.js` and `/static/app.css` return non-empty files.

## Troubleshooting
- **FOUC / “layout was forced” warning**: We mount the React island on `window.load` to wait for CSS; you shouldn’t see this warning now.  
- **Stale assets**: Hard refresh (Ctrl+F5 / Cmd+Shift+R). In dev, the bundle lives in a named volume (`static-bundle`).  
- **Tailwind purging classes**: Ensure your classes appear either in Jinja templates or TSX; the Tailwind `content` globs include:
  - `../backend/app/templates/**/*.html`
  - `./src/**/*.{ts,tsx}`
- **Ports already in use**: Change `PORT` in `.env` (e.g., `18001`) and re-`up`.

## Start a New Project From This Template

### Option A — Use as a GitHub Template (recommended)
1. On GitHub, mark this repo as a **Template Repository** (Repo Settings → General → “Template repository”).  
2. Click **Use this template** → **Create a new repository**, name your new project.  
3. Clone your new repo and run:

       cp .env.example .env
       docker compose up --build -d

4. Update names/titles:
   - App title: `backend/app/templates/base.html` (`<title>…</title>`)
   - Navbar label/link (optional): `frontend/src/Navbar.tsx`
   - `package.json` name (optional): `frontend/package.json`

### Option B — Start from a Tag Snapshot (immutable)
Use a known-good tag like `v0.1.1`:

    git clone --depth 1 --branch v0.1.1 git@github.com:<you>/<your-new-repo>.git my-new-project
    cd my-new-project
    cp .env.example .env
    docker compose up --build -d

### Option C — Copy without Git history (degit-style)
If you want a fresh history from this repo:

    git clone git@github.com:WildcatZack/FastApi-React-TailWinds-Jumpstart.git my-new-project
    cd my-new-project
    rm -rf .git
    git init
    git add .
    git commit -m "chore: bootstrap from jumpstarter"
    git branch -M main
    git remote add origin git@github.com:<you>/<your-new-repo>.git
    git push -u origin main

### Option D — Keep history but change origin
If you want to preserve commit history:

    git clone git@github.com:WildcatZack/FastApi-React-TailWinds-Jumpstart.git my-new-project
    cd my-new-project
    git remote remove origin
    git remote add origin git@github.com:<you>/<your-new-repo>.git
    git push -u origin master   # or main, if you rename

## Common Commands
Build & run (prod-like):

    docker compose up --build -d

Logs:

    docker compose logs -f

Stop:

    docker compose down

Dev profile:

    docker compose --profile dev up --build -d
    docker compose --profile dev logs -f

## License
MIT (see LICENSE).
