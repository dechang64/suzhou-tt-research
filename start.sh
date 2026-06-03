#!/bin/bash
# TT-OPC 智能运营平台 启动脚本

set -e
cd "$(dirname "$0")"

echo "🚀 TT-OPC 智能运营平台 v1.0"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

# Install Python deps
echo "📦 安装 Python 依赖..."
pip3 install -q fastapi uvicorn 2>/dev/null || true

# Install Node deps and build
if [ ! -d "node_modules" ]; then
    echo "📦 安装 Node.js 依赖..."
    npm install
fi

if [ ! -d "dist" ]; then
    echo "🔨 构建前端..."
    npm run build
fi

# Start server
echo "🌐 启动服务器..."
echo "   访问 http://localhost:8000"
echo ""
python3 -c "
import sys; sys.path.insert(0, '.')
from backend.server import app
import uvicorn
uvicorn.run(app, host='0.0.0.0', port=8000)
"
