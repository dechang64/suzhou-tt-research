#!/bin/bash
# TT-OPC 一键启动脚本
set -e

echo "🚀 TT-OPC 智能运营平台 v4.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "📦 Building frontend..."
    npm install && npm run build
fi

# Check if data dir exists
mkdir -p data

# Start backend
echo "🔧 Starting FastAPI backend (2 workers)..."
export JWT_SECRET=${JWT_SECRET:-"tt-opc-secret-change-in-production"}
uvicorn backend.server:app --host 0.0.0.0 --port 8000 --workers 2 &

echo "✅ Server running at http://localhost:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
wait
