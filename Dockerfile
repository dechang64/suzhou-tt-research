# ─── Stage 1: Build FedCtx ───
FROM rust:1.95-bookworm AS fedctx-builder
WORKDIR /build
RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*
COPY --from=unified-fl-backend-src / ./
RUN cargo build --release

# ─── Stage 2: Build frontend ───
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 3: Production ───
FROM python:3.12-slim
WORKDIR /app

RUN pip install --no-cache-dir uvicorn[standard] fastapi

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Copy backend
COPY backend/server.py ./backend/

# Copy FedCtx binary (built externally)
# In production, mount the binary or use a separate container
# COPY --from=fedctx-builder /build/target/release/unified-fl-backend ./fedctx/

# Create data directory
RUN mkdir -p ./data ./fedctx-data

ENV JWT_SECRET=change-me-in-production
ENV FEDCTX_URL=http://fedctx:8090
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
