"""TT-OPC 软件模块展示页 - 8 个模块详细设计"""
import streamlit as st
from data import TT_MODULES, get_theory

st.set_page_config(page_title="TT-OPC 软件模块 · TT-OPC", page_icon="📦", layout="wide")

st.markdown("""
<div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">
    <div style="font-size: 1.8rem; font-weight: 700;">📦 TT-OPC 软件技术转移</div>
    <div style="opacity: 0.92; margin-top: 4px;">8 大软件模块 · 覆盖技术评估、需求匹配、知识产权、社交传播全流程</div>
</div>
""", unsafe_allow_html=True)

st.caption("💡 在主项目（React + FastAPI）中，标注 ⭐ 的模块支持实时 AI 增强流式输出。镜像版展示完整设计。")

# 模块总览
st.markdown("### 🧩 模块矩阵")

cols = st.columns(4)
for i, m in enumerate(TT_MODULES):
    with cols[i % 4]:
        theory = get_theory(m.get("theoryId", ""))
        color = m["color"]
        interactive_badge = '⭐ <span style="background: #10b981; color: white; padding: 1px 6px; border-radius: 8px; font-size: 0.7rem;">AI 增强</span>' if m.get("interactive") else '<span style="background: #94a3b8; color: white; padding: 1px 6px; border-radius: 8px; font-size: 0.7rem;">静态</span>'

        st.markdown(f"""
        <div style="background: var(--background-color, white); border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid {color}; height: 100%;">
            <div style="font-size: 2rem; text-align: center;">{m['icon']}</div>
            <div style="font-size: 1.05rem; font-weight: 700; text-align: center; margin: 4px 0;">{m['name']}</div>
            <div style="font-size: 0.78rem; color: #64748b; text-align: center; margin-bottom: 6px;">{m['nameEn']}</div>
            <div style="font-size: 0.82rem; line-height: 1.5; margin-bottom: 8px;">{m['desc']}</div>
            <div style="font-size: 0.75rem; padding: 6px 8px; background: {color}15; border-radius: 6px; color: {color}; margin-bottom: 6px;">
                📚 <strong>理论：</strong>{m['theory']}
            </div>
            <div style="text-align: center;">{interactive_badge}</div>
        </div>
        """, unsafe_allow_html=True)

# 详细设计
st.markdown("---")
st.markdown("### 📋 各模块详细设计")

for m in TT_MODULES:
    with st.expander(f"{m['icon']} **{m['name']}** ({m['nameEn']}) — {m['theory']}", expanded=False):
        col1, col2 = st.columns([2, 1])
        with col1:
            st.markdown(f"**核心定位**：{m['desc']}")
            st.markdown("**核心功能**：")
            for f in m["features"]:
                st.markdown(f"  - {f}")
        with col2:
            st.markdown(f"""
            <div style="background: {m['color']}15; padding: 14px; border-radius: 8px; border-left: 3px solid {m['color']};">
                <div style="font-size: 0.8rem; color: {m['color']}; font-weight: 600; margin-bottom: 4px;">📚 理论支撑</div>
                <div style="font-size: 1rem; font-weight: 700;">{m['theory']}</div>
            </div>
            """, unsafe_allow_html=True)

            # 关联理论详情
            theory = get_theory(m.get("theoryId", ""))
            if theory:
                st.markdown(f"""
                <div style="background: rgba(99,102,241,0.08); padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 0.85rem; line-height: 1.55;">
                    <div style="font-weight: 600; margin-bottom: 4px;">📖 理论详情</div>
                    {theory.get('summary', '')}
                    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; color: #6366f1; font-size: 0.8rem;">
                        <strong>🎯 苏州应用：</strong>{theory.get('relevance', '')}
                    </div>
                </div>
                """, unsafe_allow_html=True)

        # 评估标准
        st.markdown("**📊 评估标准**：")
        eval_criteria = {
            "tt-blindbox": ["✅ 综合评分 ≥ 70 分为可投", "✅ TRL 评估准确性 ≥ 80%", "✅ SWOT 四象限完整度 100%", "✅ AI 增强流式输出延迟 < 5s"],
            "tt-fedmatch": ["✅ Top-5 匹配命中率 ≥ 75%", "✅ 跨校数据不出域（联邦学习 R² ≥ 95%）", "✅ 单次匹配 < 10s"],
            "tt-knowledge": ["✅ 知识图谱节点数 ≥ 10K", "✅ 论文-产品路径可视化完整度 90%"],
            "tt-radar": ["✅ 技术生命周期识别准确率 ≥ 70%", "✅ 替代时机窗口预测误差 < 6 个月"],
            "tt-translate": ["✅ 三版本自动生成准确率 ≥ 85%", "✅ SSE 流式输出延迟 < 3s/version"],
            "tt-triple": ["✅ 三角色分析完整度 100%", "✅ 协同流式输出延迟 < 5s"],
            "tt-social": ["✅ 网络效应飞轮验证度 ≥ 80%", "✅ 社区活跃用户月增长 ≥ 15%"],
            "tt-thermo": ["✅ AI 渗透率测算误差 < 5%", "✅ 区域创新热度地图更新频率 < 7d"],
        }
        for c in eval_criteria.get(m["id"], []):
            st.markdown(f"  - {c}")

        st.markdown("---")
