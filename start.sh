#!/bin/bash
# TT-OPC 一键启动脚本 v5（含 FedCtx）
set -e

echo "🚀 TT-OPC 智能运营平台 v5.0 + FedCtx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── 1. Start FedCtx ───
FEDCTX_BIN="${FEDCTX_BIN:-../unified-fl-backend/target/release/unified-fl-backend}"
FEDCTX_PORT="${FEDCTX_PORT:-8090}"
FEDCTX_DATA="${FEDCTX_DATA:-/tmp/fedctx-tt-opc}"

if [ -x "$FEDCTX_BIN" ]; then
    echo "🔧 Starting FedCtx on port $FEDCTX_PORT..."
    mkdir -p "$FEDCTX_DATA"
    $FEDCTX_BIN --grpc-port 50051 --http-port $FEDCTX_PORT --data-dir "$FEDCTX_DATA" --auto-persist-secs 60 &
    FEDCTX_PID=$!
    sleep 2
    if curl -s http://localhost:$FEDCTX_PORT/health > /dev/null 2>&1; then
        echo "✅ FedCtx running (PID: $FEDCTX_PID)"
        export FEDCTX_URL=http://localhost:$FEDCTX_PORT
    else
        echo "⚠️  FedCtx failed to start, running without semantic storage"
        unset FEDCTX_PID
    fi
else
    echo "⚠️  FedCtx binary not found at $FEDCTX_BIN"
    echo "   Running without semantic storage (set FEDCTX_BIN to enable)"
fi

# ─── 2. Build frontend if needed ───
if [ ! -d "dist" ]; then
    echo "📦 Building frontend..."
    npm install && npm run build
fi

# ─── 3. Start TT-OPC backend ───
mkdir -p data
export JWT_SECRET=${JWT_SECRET:-"tt-opc-secret-change-in-production"}
export FEDCTX_URL=${FEDCTX_URL:-"http://localhost:8090"}

echo "🔧 Starting TT-OPC API on port 8000..."
uvicorn backend.server:app --host 0.0.0.0 --port 8000 --workers 2 &
TTOPC_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TT-OPC:  http://localhost:8000"
[ -n "$FEDCTX_PID" ] && echo "✅ FedCtx:  http://localhost:$FEDCTX_PORT (PID: $FEDCTX_PID)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for either process
wait
