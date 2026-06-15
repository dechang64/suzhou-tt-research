# TT-OPC Streamlit 镜像版 🚀

[suzhou-tt-research](https://github.com/dechang64/suzhou-tt-research) 主项目的 **Streamlit 轻量演示版**。

## 🎯 用途

主项目（React 19 + Vite 8 + TypeScript + Tailwind 4 + FastAPI + Docker）是**完整产品级应用**，支持真实 AI 增强流式输出、用户认证、FedCtx 语义检索，部署需要 Docker / VPS / 一台 Linux 服务器。

**本镜像版**专为以下场景设计：

- 🏛️ **评审专家**：5 分钟看到项目全貌（理论框架 + 模块设计 + 成果）
- 💰 **投资人**：直接看 5 大政策建议 + 5 项已发表/在投成果
- 📚 **学者/学生**：浏览 12 个经济学理论 + 6 国内 + 4 国际案例
- 🔬 **跨学科同行**：理解 AI + 经济学 + 技术转移的交叉融合

## ⚡ 优势

- ✅ **零依赖** —— 纯 Python + Streamlit + Pandas
- ✅ **3 分钟上线** —— 一键部署到 Streamlit Cloud
- ✅ **数据共享** —— 与 React 主项目 100% 共享数据层
- ✅ **5 个核心页面** —— 评审专家快速看全貌

## 📂 目录结构

```
streamlit_app/
├── app.py                          # 入口 + st.navigation() 调度 7 个 page
├── _home.py                        # 主页函数 home() + 自定义 sidebar custom_sidebar()
├── data.py                         # 共享数据层（12 理论 + 6 国内 + 4 国际 + 17 模块）
├── requirements.txt                # 依赖（streamlit + pandas + matplotlib）
├── README.md                       # 本文件
└── pages_pages/                    # 6 个独立 page 模块（不放在 pages/ 目录, 避免 streamlit 自动发现)
    ├── TheoryMap_1.py              # 12 个经济学理论详解
    ├── TT_OPC_2.py                 # 8 个软件模块详情
    ├── HW_OPC_3.py                 # 9 个硬件模块详情
    ├── IntlCases_4.py              # 4 国际 + 6 国内标杆
    ├── Publications_5.py           # 5 项已发表/在投成果
    └── Heatmap_6.py                # 31 省技术转移数据
```

**架构说明**：使用 `st.navigation()` 接管路由 + 自定义 sidebar（`st.sidebar.page_link`），避免 streamlit 默认的 `pages/` 目录自动发现 + 默认 sidebar 导航不可控。

## 🚀 本地运行

```bash
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
```

默认访问 http://localhost:8501

## ☁️ Streamlit Cloud 部署

### 1. 准备 GitHub 仓库

把 `streamlit_app/` 目录推送到 GitHub（作为独立目录，或独立 repo）。

```bash
# 假设原始仓库已 clone 到本地
cd path/to/suzhou-tt-research
git add streamlit_app/
git commit -m "feat: add Streamlit 镜像版"
git push origin main
```

### 2. 部署到 Streamlit Cloud

1. 访问 https://share.streamlit.io/
2. 用 GitHub 账号登录
3. 点 "New app"
4. 选择：
   - **Repository**: `dechang64/suzhou-tt-research`
   - **Branch**: `main`
   - **Main file path**: `streamlit_app/app.py`
5. 点 "Deploy!"
6. 等待 2-3 分钟，访问 `https://<your-app>.streamlit.app/`

### 3. （可选）自定义域名

Streamlit Cloud 支持自定义域名。在 Settings → General → Custom subdomain 设置。

## 📋 与主项目的关系

| 维度 | 主项目（React + FastAPI） | 镜像版（Streamlit） |
|---|---|---|
| **前端** | React 19 + Vite 8 + TS + Tailwind | Streamlit 1.32+ |
| **后端** | FastAPI + Uvicorn + FedCtx | 纯 Python（无后端） |
| **数据层** | src/data.ts (TS) | data.py (Python) — **100% 一致** |
| **AI 增强** | ✅ 真实 LLM SSE 流式 | ❌ 仅展示设计 |
| **用户认证** | ✅ JWT | ❌ 无 |
| **FedCtx 检索** | ✅ HNSW 语义检索 | ❌ 无 |
| **部署** | Docker Compose + Nginx | Streamlit Cloud（1 分钟） |
| **访问 URL** | `yourdomain.com` | `<app>.streamlit.app` |
| **适合** | 投资人/合作伙伴正式演示 | 评审专家快速看全貌 |

## 🛠️ 数据共享策略

`streamlit_app/data.py` 是从 `src/data.ts` **手工翻译**的 Python 版本：

- 12 个经济学理论
- 6 个国内案例
- 4 个国际案例
- 8 + 9 = 17 个模块元数据
- 5 大瓶颈
- 5 大政策建议
- 31 省区域数据
- 5 项已发表/在投成果

**为什么不直接调 FastAPI？** 因为镜像版要能在 Streamlit Cloud 上独立运行，**不能依赖任何外部服务**。

**未来改进方向**：用脚本自动从 `src/data.ts` 翻译为 `data.py`，保持 100% 同步。

## 📜 许可

MIT License - 与主项目 [suzhou-tt-research](https://github.com/dechang64/suzhou-tt-research) 一致。

## 🔗 链接

- [GitHub 主项目](https://github.com/dechang64/suzhou-tt-research)
- [AI for TT-OPC 开源书](https://github.com/dechang64/AI-for-TT-OPC)
- [课题组主页](https://dechang64.github.io)

## 📧 联系

- 📧 dechang.xu [at] gmail.com
- 🏛️ 西交利物浦大学 · 人工智能学院
- 👤 徐德昌（Xu Dechang / Dechang Xu）副教授
