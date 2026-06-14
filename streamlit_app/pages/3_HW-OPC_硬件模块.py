"""HW-OPC 硬件模块展示页 - 9 个模块详细设计"""
import streamlit as st
from data import HW_MODULES, get_theory

st.set_page_config(page_title="HW-OPC 硬件模块 · TT-OPC", page_icon="📊", layout="wide")

st.markdown("""
<div style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">
    <div style="font-size: 1.8rem; font-weight: 700;">📊 HW-OPC 硬件技术转移</div>
    <div style="opacity: 0.92; margin-top: 4px;">9 大硬件模块 · 覆盖芯片选型、BOM 估算、供应链对接、合规认证全流程</div>
</div>
""", unsafe_allow_html=True)

st.caption("💡 在主项目（React + FastAPI）中，标注 ⭐ 的模块支持实时 AI 增强流式输出。镜像版展示完整设计。8/9 硬件模块已在主项目中实现交互功能。")

st.markdown("### 🧩 模块矩阵")
cols = st.columns(3)
for i, m in enumerate(HW_MODULES):
    with cols[i % 3]:
        color = m["color"]
        interactive_badge = '⭐ <span style="background: #10b981; color: white; padding: 1px 6px; border-radius: 8px; font-size: 0.7rem;">AI 增强</span>' if m.get("interactive") else '<span style="background: #94a3b8; color: white; padding: 1px 6px; border-radius: 8px; font-size: 0.7rem;">静态</span>'
        st.markdown(f"""
        <div style="background: var(--background-color, white); border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid {color}; height: 100%;">
            <div style="font-size: 2rem; text-align: center;">{m['icon']}</div>
            <div style="font-size: 1.05rem; font-weight: 700; text-align: center; margin: 4px 0;">{m['name']}</div>
            <div style="font-size: 0.78rem; color: #64748b; text-align: center; margin-bottom: 6px;">{m['nameEn']}</div>
            <div style="font-size: 0.82rem; line-height: 1.5; margin-bottom: 8px;">{m['desc']}</div>
            <div style="font-size: 0.75rem; padding: 6px 8px; background: {color}15; border-radius: 6px; color: {color}; margin-bottom: 6px;">
                🛠️ <strong>理论：</strong>{m['theory']}
            </div>
            <div style="text-align: center;">{interactive_badge}</div>
        </div>
        """, unsafe_allow_html=True)

st.markdown("---")
st.markdown("### 📋 各模块详细设计")

for m in HW_MODULES:
    with st.expander(f"{m['icon']} **{m['name']}** ({m['nameEn']}) — {m['theory']}", expanded=False):
        st.markdown(f"**核心定位**：{m['desc']}")
        st.markdown("**核心功能**：")
        for f in m["features"]:
            st.markdown(f"  - {f}")
        st.markdown("---")
