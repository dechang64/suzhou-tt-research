"""成果汇编页 - 5 项已发表/在投成果展示"""
import streamlit as st
from data import PUBLICATIONS

st.set_page_config(page_title="成果汇编 · TT-OPC", page_icon="📚", layout="wide")

st.markdown("""
<div style="background: linear-gradient(135deg, #c9a227 0%, #a08020 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">
    <div style="font-size: 1.8rem; font-weight: 700;">📚 已发表/在投成果（5 项）</div>
    <div style="opacity: 0.92; margin-top: 4px;">政策建议 + 党刊理论 + 顶刊论文 + 开源书</div>
</div>
""", unsafe_allow_html=True)

# 成果统计
st.markdown("### 📊 成果分布")
import pandas as pd
type_data = {"成果类型": ["政策建议", "党刊理论", "顶刊论文", "开源书"], "数量": [1, 1, 2, 1]}
level_data = {"发表级别": ["市厅级（决策参阅）", "省级（群众）", "顶刊（RES/JFE 在投）", "开源"], "数量": [1, 1, 2, 1]}

c1, c2 = st.columns(2)
with c1:
    st.markdown("**按类型：**")
    st.dataframe(pd.DataFrame(type_data), use_container_width=True, hide_index=True)
with c2:
    st.markdown("**按级别：**")
    st.dataframe(pd.DataFrame(level_data), use_container_width=True, hide_index=True)

# 详细展示
st.markdown("---")
st.markdown("### 📋 5 项成果详细")

for i, pub in enumerate(PUBLICATIONS, 1):
    st.markdown(f"""
    <div style="background: var(--background-color, white); border-radius: 12px; padding: 22px; margin-bottom: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid {pub['color']};">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <div style="background: {pub['color']}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">{i}</div>
            <div>
                <div style="font-size: 1.15rem; font-weight: 700;">{pub['title']}</div>
                <div style="font-size: 0.85rem; color: #64748b; margin-top: 2px;">{pub['subtitle']}</div>
            </div>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin: 8px 0 12px 0;">
            <span style="background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">📂 {pub['type']}</span>
            <span style="background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">🏛️ {pub['level']}</span>
            <span style="background: #f3e8ff; color: #6d28d9; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">📅 {pub['year']}</span>
        </div>
        <div style="font-size: 0.9rem; margin-bottom: 10px; padding: 8px 10px; background: rgba(0,0,0,0.03); border-radius: 6px;">
            <strong>👤 作者：</strong> {pub['authors']}
        </div>
        <div style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 12px; padding: 10px 12px; background: {pub['color']}10; border-radius: 6px; border-left: 3px solid {pub['color']};">
            <strong>📊 状态：</strong> {pub['status']}
        </div>
        <div style="font-size: 0.88rem; line-height: 1.7;">
            <strong>🎯 关键亮点：</strong>
            <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
                {"".join(f'<span style="background: #f0f9ff; color: #075985; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem;">✓ {h}</span>' for h in pub['highlights'])}
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# 评审历程时间线
st.markdown("---")
st.markdown("### 🕐 评审/修改时间线")

timeline = [
    {"date": "2026-04", "event": "中央政治局会议强调'全面实施人工智能+行动'", "type": "政策事件", "color": "#3b82f6"},
    {"date": "2026-04-15", "event": "v13 完成（Words Beyond the Rate 论文）", "type": "论文", "color": "#10b981"},
    {"date": "2026-05-12", "event": "v14 完成（v10 早期版对照）", "type": "论文", "color": "#10b981"},
    {"date": "2026-06-09", "event": "v15.1 完成（顶刊严格审评通过 56/70）", "type": "论文", "color": "#10b981"},
    {"date": "2026-06-10", "event": "v5 完成（修改稿 9 项硬伤全修 62/70）", "type": "党刊", "color": "#dc2626"},
    {"date": "2026-06-11", "event": "v14 完成（决策参阅条件性采用 64/100）", "type": "决策参阅", "color": "#8b5cf6"},
    {"date": "2026-06-13", "event": "v5 完成（学术终稿 9 项修复 19/19 验证）", "type": "学术终稿", "color": "#10b981"},
    {"date": "2026-06-14", "event": "Streamlit 镜像版启动", "type": "本项目", "color": "#f59e0b"},
]

st.markdown("""
<div style="background: var(--background-color, white); padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
""", unsafe_allow_html=True)

for tl in timeline:
    st.markdown(f"""
    <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #e5e7eb;">
        <div style="background: {tl['color']}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; min-width: 80px; text-align: center;">{tl['date']}</div>
        <div style="font-size: 0.92rem; flex: 1;">{tl['event']}</div>
        <div style="background: {tl['color']}20; color: {tl['color']}; padding: 3px 8px; border-radius: 10px; font-size: 0.75rem;">{tl['type']}</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("</div>", unsafe_allow_html=True)

# 关键评审指标
st.markdown("---")
st.markdown("### 📈 关键评审指标")

metrics_cols = st.columns(4)
with metrics_cols[0]:
    st.metric("完成稿修改", "9 项", delta=5, delta_color="normal")
    st.caption("v5 顶刊标准")
with metrics_cols[1]:
    st.metric("党刊评分", "62/70", delta=18, delta_color="normal")
    st.caption("v3→v5")
with metrics_cols[2]:
    st.metric("决策参阅评分", "64/100", delta=12, delta_color="normal")
    st.caption("v13→v14")
with metrics_cols[3]:
    st.metric("MD5 验证", "7/7", delta=100, delta_color="normal")
    st.caption("100% 一致")
