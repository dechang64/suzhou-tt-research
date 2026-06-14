"""
TT-OPC Streamlit 镜像版 - 主页
设计原则:
- 复用 data.py 数据层（不依赖 FastAPI）
- 5-6 个核心页面 (App + pages/) 保持简洁
- 评审专家/投资人 5 分钟访问即可看到全貌
- Hero + Stats + 三大平台 + 核心论断 + 五大政策建议
"""
import streamlit as st
from data import (
    THEORIES, CASES, INTL_CASES, BOTTLENECKS, TT_MODULES, HW_MODULES,
    RECOMMENDATIONS, MAP_PROVINCES, PUBLICATIONS, HERO_QUOTES,
    get_top_provinces, get_theory
)

st.set_page_config(
    page_title="TT-OPC 智能运营平台 · 镜像版",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "About": "TT-OPC 平台是西交利物浦大学徐德昌教授课题组的开源项目。GitHub: dechang64/suzhou-tt-research",
    },
)

# ─── 自定义 CSS（卡片+渐变） ───
st.markdown("""
<style>
    .hero-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 32px;
        border-radius: 16px;
        color: white;
        margin-bottom: 24px;
    }
    .hero-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0 0 12px 0;
    }
    .hero-sub {
        font-size: 1.15rem;
        opacity: 0.95;
        margin: 0 0 8px 0;
    }
    .stat-card {
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(8px);
        border-radius: 12px;
        padding: 18px;
        text-align: center;
    }
    .stat-val {
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.1;
    }
    .stat-lbl {
        font-size: 0.85rem;
        opacity: 0.92;
        margin-top: 4px;
    }
    .quote-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 18px 22px;
        border-radius: 12px;
        color: white;
        font-size: 1.1rem;
        font-style: italic;
        line-height: 1.6;
        margin: 12px 0;
    }
    .quote-author {
        font-size: 0.85rem;
        opacity: 0.85;
        font-style: normal;
        margin-top: 6px;
    }
    .rec-card {
        background: var(--background-color, white);
        border-left: 4px solid var(--primary-color, #3b82f6);
        border-radius: 8px;
        padding: 16px 20px;
        margin: 8px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .rec-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .pub-card {
        background: var(--background-color, white);
        border-radius: 12px;
        padding: 18px 22px;
        margin: 8px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        border-top: 4px solid var(--primary-color, #3b82f6);
    }
    .pub-type {
        display: inline-block;
        background: #e0f2fe;
        color: #0369a1;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.78rem;
        font-weight: 600;
        margin-right: 6px;
    }
    .pub-level {
        display: inline-block;
        background: #fef3c7;
        color: #92400e;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.78rem;
        font-weight: 600;
    }
    .badge {
        display: inline-block;
        background: #dbeafe;
        color: #1e40af;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 2px;
    }
    .footer-note {
        text-align: center;
        color: #94a3b8;
        font-size: 0.85rem;
        margin-top: 40px;
        padding: 16px;
        border-top: 1px solid #e5e7eb;
    }
    [data-theme="dark"] .rec-card, [data-theme="dark"] .pub-card {
        background: #1e293b;
    }
    /* 隐藏 streamlit multipage app 默认生成的 sidebar 导航 (我们用主页内容区导航) */
    [data-testid="stSidebarNav"] { display: none !important; }
</style>
""", unsafe_allow_html=True)

# ─── Sidebar (顶部项目信息; multipage app 链接 streamlit 自动生成) ───
with st.sidebar:
    st.markdown("### 🚀 TT-OPC 镜像版")
    st.caption("suzhou-tt-research 镜像版")
    st.markdown("---")
    st.markdown("**🔗 原始项目**")
    st.markdown("""
- [GitHub 主项目](https://github.com/dechang64/suzhou-tt-research)
- [AI-for-TT-OPC 开源书](https://github.com/dechang64/AI-for-TT-OPC)
- [课题组主页](https://dechang64.github.io)
""")
    st.markdown("---")
    st.caption("📧 dechang.xu [at] gmail.com")
    st.caption("🏛️ 西交利物浦大学 · 人工智能学院")
    st.caption("📅 2026 年 6 月")

# ─── Hero ───
st.markdown("""
<div class="hero-box">
    <div class="hero-title">🚀 TT-OPC 智能运营平台</div>
    <div class="hero-sub">用 AI 赋能技术转移，让一个人成为一支团队</div>
    <div class="hero-sub">📐 基于 12 个经济学理论 + 8+9 个工程模块设计</div>
</div>
""", unsafe_allow_html=True)

# 关键统计
top_provinces = get_top_provinces(5)
total_patents = sum(p["patents"] for p in MAP_PROVINCES)
total_transfers = sum(p["transfers"] for p in MAP_PROVINCES)

col1, col2, col3, col4, col5 = st.columns(5)
with col1:
    st.markdown(f"""<div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div class="stat-val">8+9</div>
        <div class="stat-lbl">工程模块</div>
    </div>""", unsafe_allow_html=True)
with col2:
    st.markdown(f"""<div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
        <div class="stat-val">12</div>
        <div class="stat-lbl">经济学理论</div>
    </div>""", unsafe_allow_html=True)
with col3:
    st.markdown(f"""<div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
        <div class="stat-val">{total_patents//1000}K+</div>
        <div class="stat-lbl">全国专利数</div>
    </div>""", unsafe_allow_html=True)
with col4:
    st.markdown(f"""<div class="stat-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
        <div class="stat-val">{total_transfers//1000}K+</div>
        <div class="stat-lbl">年度技术转移</div>
    </div>""", unsafe_allow_html=True)
with col5:
    st.markdown("""<div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
        <div class="stat-val">5+</div>
        <div class="stat-lbl">已发表/投稿论文</div>
    </div>""", unsafe_allow_html=True)

st.markdown("")

# ─── 核心论断 ───
st.markdown("### 💡 核心论断")
for q in HERO_QUOTES:
    st.markdown(f"""
    <div class="quote-card">
        "{q['text']}"
        <div class="quote-author">— {q['author']}</div>
    </div>
    """, unsafe_allow_html=True)

# ─── 平台说明 ───
st.markdown("---")
st.markdown("### 🏛️ 平台架构")

c1, c2, c3 = st.columns(3)
with c1:
    st.markdown("""
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 18px; border-radius: 12px; color: white; height: 100%;">
        <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">📦 TT-OPC 软件技术转移</div>
        <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 10px;">8 大软件模块 · 覆盖技术评估、需求匹配、知识产权全流程</div>
        <div style="font-size: 0.85rem;">
            • 盲盒评估（Arrow 信息悖论）<br>
            • 联邦匹配（数据不出校）<br>
            • 知识图谱（流动路径可视化）<br>
            • 技术雷达（生命周期预测）<br>
            • 场景翻译（三角色版本）<br>
            • 三角色工作台（三螺旋）<br>
            • 社交传播交易（网络效应）<br>
            • 创新温度计（AI 渗透率）
        </div>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 18px; border-radius: 12px; color: white; height: 100%;">
        <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">📊 HW-OPC 硬件技术转移</div>
        <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 10px;">9 大硬件模块 · 覆盖芯片选型、BOM 估算、合规认证全流程</div>
        <div style="font-size: 0.85rem;">
            • 硬件评估（芯片+BOM+国产化率）<br>
            • 供应链图谱（ODM+认证链路）<br>
            • 硬件翻译（四角色版本）<br>
            • 四角色工作台（算法+硬件+供应链+认证）<br>
            • 硬件雷达（7 类器件路线图）<br>
            • 认证导航（3C+SRRC+算法备案）<br>
            • 打样工坊（EVT→DVT→PVT→MP）<br>
            • 社交交易（社区+供应链）<br>
            • 总览（七层产业链仪表盘）
        </div>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown("""
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 18px; border-radius: 12px; color: white; height: 100%;">
        <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">🚀 Streamlit 镜像版（本页）</div>
        <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 10px;">轻量演示版 · 评审专家/投资人 5 分钟看全貌</div>
        <div style="font-size: 0.85rem;">
            • 5 个核心页面（项目总览/理论地图/TT/HW/成果）<br>
            • 复用 React 主项目数据层<br>
            • 12 个理论 + 6 国内案例 + 4 国际案例<br>
            • 5 大瓶颈 + 5 大政策建议<br>
            • 31 省技术转移热力图<br>
            • 一键部署到 Streamlit Cloud
        </div>
    </div>
    """, unsafe_allow_html=True)

# ─── 五大政策建议 ───
st.markdown("---")
st.markdown("### 🏛️ 五大政策建议（来自《决策参阅》v14 报告）")

rec_cols = st.columns(5)
for i, rec in enumerate(RECOMMENDATIONS):
    with rec_cols[i]:
        st.markdown(f"""
        <div class="rec-card" style="--primary-color: {rec['color']};">
            <div class="rec-title">{rec['icon']} {rec['title']}</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.9rem; line-height: 1.6;">
                {''.join(f'<li>{p}</li>' for p in rec['points'])}
            </ul>
        </div>
        """, unsafe_allow_html=True)

# ─── 已发表成果 ───
st.markdown("---")
st.markdown("### 📚 已发表 / 在投成果（5 项）")

for pub in PUBLICATIONS:
    badges = f'<span class="pub-type">{pub["type"]}</span><span class="pub-level">{pub["level"]}</span>'
    st.markdown(f"""
    <div class="pub-card" style="--primary-color: {pub['color']};">
        <div style="margin-bottom: 6px;">{badges} <span style="color: #94a3b8; font-size: 0.85rem;">📅 {pub['year']}</span></div>
        <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 4px;">{pub['title']}</div>
        <div style="font-size: 0.88rem; color: #64748b; margin-bottom: 6px;">{pub['subtitle']}</div>
        <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">👤 {pub['authors']}</div>
        <div style="font-size: 0.88rem; color: #475569; margin-bottom: 8px;">
            <strong>📊 状态：</strong> {pub['status']}
        </div>
        <div style="font-size: 0.85rem; color: #475569;">
            {''.join(f'<span class="badge">✓ {h}</span>' for h in pub['highlights'])}
        </div>
    </div>
    """, unsafe_allow_html=True)

# ─── 核心论断扩展 ───
st.markdown("---")
st.markdown("### 🎯 三大核心数据（中国技术转移）")

# Top 5 省份
st.markdown("#### 🏆 Top 5 省份（技术转移指数）")
top5 = get_top_provinces(5)
top5_data = {"省份": [p["name"] for p in top5], "技术转移指数": [p["value"] for p in top5], "专利数(万)": [p["patents"]/10000 for p in top5], "年转化数": [p["transfers"] for p in top5]}
import pandas as pd
# 颜色条用 st.column_config.ProgressColumn (内置, 无需 matplotlib)
_top5_min = min(p["value"] for p in top5)
_top5_max = max(p["value"] for p in top5)
st.dataframe(
    pd.DataFrame(top5_data),
    use_container_width=True,
    hide_index=True,
    column_config={
        "技术转移指数": st.column_config.ProgressColumn(
            "技术转移指数",
            min_value=_top5_min,
            max_value=_top5_max,
            format="%.0f",
        ),
        "专利数(万)": st.column_config.NumberColumn(format="%.1f"),
    },
)

# 五大瓶颈
st.markdown("#### ⚠️ 五大瓶颈（行业调研）")
bn_data = {"瓶颈": [b["name"] for b in BOTTLENECKS], "严重度(0-100)": [b["score"] for b in BOTTLENECKS], "说明": [b["desc"] for b in BOTTLENECKS]}
_bn_min = min(b["score"] for b in BOTTLENECKS)
_bn_max = max(b["score"] for b in BOTTLENECKS)
st.dataframe(
    pd.DataFrame(bn_data),
    use_container_width=True,
    hide_index=True,
    column_config={
        "严重度(0-100)": st.column_config.ProgressColumn(
            "严重度(0-100)",
            min_value=_bn_min,
            max_value=_bn_max,
            format="%.0f",
        ),
    },
)

# 案例精选
st.markdown("---")
st.markdown("### 🌟 标杆案例精选")

featured = [c for c in CASES if c.get("featured")][:3]
fc_cols = st.columns(3)
for i, case in enumerate(featured):
    with fc_cols[i]:
        outcomes = "<br>".join(f"• {o}" for o in case["outcomes"])
        st.markdown(f"""
        <div style="background: var(--background-color, white); padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid #667eea; height: 100%;">
            <div style="font-size: 2.5rem;">{case['icon']}</div>
            <div style="font-size: 1.1rem; font-weight: 700; margin: 8px 0;">{case['name']}</div>
            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">
                {''.join(f'<span class="badge">{t}</span>' for t in case['tags'])}
            </div>
            <div style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 8px;">{case['description']}</div>
            <div style="font-size: 0.88rem; color: #10b981; line-height: 1.6;">{outcomes}</div>
            <div style="margin-top: 8px; font-size: 0.8rem; color: #94a3b8;">🏛️ {case['institution']} · 📅 {case['year']}</div>
        </div>
        """, unsafe_allow_html=True)

# ─── Page 导航 (因 sidebar 自动导航已隐藏, 主页提供 6 个 page 卡片入口) ───
st.markdown("---")
st.markdown("### 🧭 深入探索 · 6 大主题页面")
st.caption("点击下方任意卡片进入对应主题页面")

# 用 st.page_link 提供 6 个内部 page 链接 + 文字说明
page_links = [
    ("🧠", "TheoryMap_理论地图", "12 个经济学理论 → 17 个模块的对应关系", "#3b82f6"),
    ("📦", "TT-OPC_软件模块", "8 大软件模块：盲盒评估 / 联邦匹配 / 三螺旋工作台 ...", "#ef4444"),
    ("📊", "HW-OPC_硬件模块", "9 大硬件模块：芯片 Benchmark / BOM / 认证导航 ...", "#0984e3"),
    ("🌏", "IntlCases_国际案例", "美国波士顿 / 德国 Fraunhofer / RTP / 松山湖 + 6 国内标杆", "#7c3aed"),
    ("📚", "Publications_成果汇编", "5 项已发表/在投成果 · 顶刊 + 党刊 + 咨政报告", "#10b981"),
    ("🗺️", "Heatmap_区域热力图", "31 省技术转移指数 + 长三角对比 + 苏州 vs 全国", "#f59e0b"),
]

nav_cols = st.columns(3)
for i, (icon, page, desc, color) in enumerate(page_links):
    with nav_cols[i % 3]:
        st.markdown(f"""
        <a href="{page}" target="_self" style="text-decoration: none;">
            <div style="background: var(--background-color, white); border-left: 4px solid {color}; border-radius: 8px; padding: 14px 16px; margin: 6px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.15s;">
                <div style="font-size: 1.6rem;">{icon}</div>
                <div style="font-size: 1.05rem; font-weight: 700; margin: 4px 0;">{page.split('_', 1)[1] if '_' in page else page}</div>
                <div style="font-size: 0.82rem; color: #64748b; line-height: 1.5;">{desc}</div>
                <div style="font-size: 0.75rem; color: {color}; margin-top: 6px; font-weight: 600;">→ 进入页面</div>
            </div>
        </a>
        """, unsafe_allow_html=True)

# ─── 部署信息 ───
st.markdown("---")
st.markdown("### 🔧 关于本镜像版")

st.info("""
**📋 本页用途**：这是 suzhou-tt-research 仓库的 **Streamlit 轻量演示版**，专为以下场景设计：
- 🏛️ **评审专家**：5 分钟看到项目全貌（理论框架 + 模块设计 + 成果）
- 💰 **投资人**：直接看 5 大政策建议 + 5 项已发表/在投成果
- 📚 **学者/学生**：浏览 12 个经济学理论 + 6 国内 + 4 国际案例
- 🔬 **跨学科同行**：理解 AI+经济学+技术转移的交叉融合

**🛠️ 技术栈**：纯 Python · Streamlit 1.32+ · 数据层与 React 主项目共享 100% · 可一键部署到 Streamlit Cloud

**⚡ 区别于主项目**：
- 主项目（React + FastAPI）：交互式 AI 工具，支持真实 AI 增强流式输出，需 Docker 部署
- 镜像版（本页）：静态展示，无 LLM 调用，5 分钟上线 Streamlit Cloud
""")

st.markdown("""
<div class="footer-note">
    <p>🚀 TT-OPC 智能运营平台 v5.0 · Streamlit 镜像版 · 2026 年 6 月</p>
    <p>西交利物浦大学 · 徐德昌教授课题组 · GitHub: dechang64/suzhou-tt-research</p>
    <p>基于 12 个经济学理论 + 8+9 个工程模块设计 · 复审通过率达到顶刊标准</p>
</div>
""", unsafe_allow_html=True)
