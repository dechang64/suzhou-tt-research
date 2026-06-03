# ─── Stage 1: Build frontend ───
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: Production ───
FROM python:3.12-slim
WORKDIR /app

# Install uvicorn
RUN pip install --no-cache-dir uvicorn[standard] fastapi

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy backend
COPY backend/server.py ./backend/

# Create data directory
RUN mkdir -p ./data

# Environment
ENV JWT_SECRET=change-me-in-production
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
