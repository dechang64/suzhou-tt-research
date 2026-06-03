# TT-OPC 智能运营平台 v1.0

> 技术转移一人公司全链路AI工具 · 基于24个经济学理论设计 · 8+9使能功能

## 🚀 快速开始

```bash
# 方式1：一键启动
bash start.sh

# 方式2：手动启动
npm install && npm run build
pip3 install fastapi uvicorn
python3 -c "import sys; sys.path.insert(0, '.'); from backend.server import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"

# 方式3：Docker
docker-compose up -d
```

访问 http://localhost:8000

## 📦 功能模块

### TT-OPC 技术转移平台（8大模块）

| 模块 | 功能 | 理论支撑 |
|------|------|---------|
| 📦 盲盒评估 TechBlindBox | 不泄露技术就能评估价值 | Arrow信息悖论 |
| 🔗 联邦匹配 FedMatch | 跨校专利数据不出校就能匹配 | 联邦学习经济学 |
| 🌐 知识图谱 KnowledgeFlow | 可视化知识从论文到产品的流动路径 | 内生增长理论 |
| 📡 技术雷达 TechRadar | 预测技术生命周期和替代时机 | 创造性破坏 |
| 🔄 场景翻译 TechTranslator | 一键生成投资人/CEO/院长版 | 吸收能力理论 |
| 🧬 三角色工作台 TripleHelix | 教授+CEO+律师三Agent协同 | 三螺旋理论 |
| 🌐 社交传播交易 SocialHub | 社交+传播+交易一体化 | 网络效应+双边市场 |
| 🌡️ 创新温度计 InnovationThermo | 实时测量AI渗透率 | GPT渗透+新质生产力 |

### HW-OPC 硬件技术转移平台（9大模块）

| 模块 | 功能 | 理论支撑 |
|------|------|---------|
| 📊 硬件评估 HWEval | 芯片Benchmark+算法适配+BOM成本+国产化率 | 内置国产AI芯片数据库 |
| 🔗 供应链图谱 SupplyChain | 算法→芯片→ODM→认证全链路匹配 | 内置ODM/传感器/认证机构库 |
| 🔄 硬件翻译 HWTranslator | 硬件规格书→投资人/PM/供应链/认证四版本 | 硬件领域专业Prompt |
| 🧬 四角色工作台 QuadHelix | 算法专家+硬件PM+供应链专家+认证顾问 | 四Agent协同分析 |
| 📡 硬件雷达 HWRadar | 芯片路线图+传感器价格+国产替代进度 | 覆盖7类器件 |
| 📋 认证导航 CertNav | 3C/SRRC/算法备案/网安评估全流程 | 含标准/材料/测试项/并行策略 |
| 🏭 打样工坊 Prototyping | EVT→DVT→PVT→MP全流程管理 | BOM估算+风险管理 |
| 🌐 社交交易 SocialTrade | 硬件开发者社区+供应链对接+交易管理 | 供需匹配+数据看板 |
| 🏠 总览 | 七层产业链可视化+竞品对比 | 全景仪表盘 |

## 🏗️ 技术架构

```
React 19 + Vite 8 + Tailwind 4  ← 前端
         ↓
    FastAPI + Uvicorn            ← 后端 API
         ↓
    z-ai-web-dev-sdk             ← LLM 增强（可选）
```

- **前端**：React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Recharts
- **后端**：FastAPI + Uvicorn（单进程，即时返回 fallback 数据）
- **LLM**：z-ai-web-dev-sdk（可选增强，SSE 流式返回）
- **部署**：Docker Compose + Nginx

## 📂 项目结构

```
suzhou-tt-research/
├── backend/
│   └── server.py          # FastAPI 后端（API + 静态文件）
├── src/
│   ├── App.tsx            # 主应用（所有页面组件）
│   ├── App.css            # 样式（含暗色模式）
│   ├── data.ts            # 数据（理论、案例、模块）
│   └── types.ts           # TypeScript 类型定义
├── dist/                  # 构建产物（自动生成）
├── docker-compose.yml     # Docker 部署
├── Dockerfile             # Docker 构建
├── nginx.conf             # Nginx 配置
└── start.sh               # 一键启动脚本
```

## 🔑 核心观点

> **OPC不是"一个人的小公司"，而是"一个人+AI=一支团队"。**

传统技术转移需要团队协作：技术评估、需求匹配、法律合规、市场推广……每个环节都需要专人负责。

OPC模式的核心突破在于：**用AI工具将个人能力扩展为"虚拟团队"**，使一个人能够独立完成全链路业务闭环。

## 📄 License

MIT
