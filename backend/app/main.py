from datetime import datetime, timezone
import os
from typing import Dict, Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

START_TIME = datetime.now(timezone.utc)

# Read PORT from environment (compose sets this; default 8000 for local dev)
PORT = int(os.getenv("PORT", "8000"))

app = FastAPI(title="FastAPI + Jinja2 base")

# Static & templates
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    """
    Returns the base template with index content.
    React navbar island will mount to #navbar-root (wired in the next step).
    """
    context: Dict[str, Any] = {
        "request": request,
        "now_iso": datetime.now(timezone.utc).isoformat(),
        "app_title": "FastAPI + React Islands Jumpstarter",
    }
    return templates.TemplateResponse("index.html", context)

@app.get("/api/healthcheck")
async def healthcheck() -> JSONResponse:
    """
    Simple healthcheck with uptime.
    """
    uptime_seconds = (datetime.now(timezone.utc) - START_TIME).total_seconds()
    return JSONResponse(
        {
            "status": "ok",
            "uptime_seconds": int(uptime_seconds),
            "started_at": START_TIME.isoformat(),
        }
    )
