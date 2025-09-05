# -------------------------
# Stage 1: Frontend build
# -------------------------
FROM node:20-alpine AS frontend-builder

# (Optional) If you ever add native deps, you'll need build tools:
# RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only package manifest first for better caching
COPY frontend/package.json /app/frontend/package.json
# If a lockfile exists, copy it too; otherwise npm will generate one
# (We intentionally DO NOT use npm ci here.)
# COPY frontend/package-lock.json /app/frontend/package-lock.json

WORKDIR /app/frontend
RUN npm install --no-audit --no-fund

# Copy the rest of the frontend sources
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/vite.config.ts ./vite.config.ts
COPY frontend/tailwind.config.js ./tailwind.config.js
COPY frontend/postcss.config.js ./postcss.config.js
COPY frontend/src ./src

# IMPORTANT: Tailwind's content array references the backend templates.
# Make them available inside this build stage so purge/jit includes our classes.
# We mirror the repo structure under /app so the "../backend/app/templates" path is valid.
WORKDIR /app
COPY backend/app/templates /app/backend/app/templates

# Build assets => /app/frontend/dist (app.js, app.css)
WORKDIR /app/frontend
RUN npm run build

# -------------------------
# Stage 2: Python runtime
# -------------------------
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# curl for container healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Python deps
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Backend source
COPY backend/app /app/backend/app

# Copy built frontend assets into static dir
COPY --from=frontend-builder /app/frontend/dist/ /app/backend/app/static/

EXPOSE 8000

# Healthcheck against FastAPI
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS "http://localhost:${PORT}/api/healthcheck" || exit 1

# Run server
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --reload"]
