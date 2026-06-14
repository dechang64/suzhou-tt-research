"""理论地图页 - 12 个经济学理论 + 类别 + 关联模块可视化"""
import streamlit as st
from data import THEORIES, TT_MODULES, HW_MODULES, get_module

st.set_page_config(page_title="理论地图 · TT-OPC", page_icon="🧠", layout="wide")

st.markdown("""
<div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">
    <div style="font-size: 1.8rem; font-weight: 700;">🧠 12 个经济学理论</div>
    <div style="opacity: 0.92; margin-top: 4px;">每个 TT-OPC / HW-OPC 模块都对应一个核心理论支撑</div>
</div>
""", unsafe_allow_html=True)

# 类别分组
categories = {}
for t in THEORIES:
    cat = t["category"]
    categories.setdefault(cat, []).append(t)

# 类别标签映射
cat_labels = {
    "classical": "🏛️ 经典理论",
    "modern": "💡 现代理论",
    "policy": "📜 政策框架",
    "regional": "🌏 区域协同",
}

# 4 列布局显示
for cat_id, cat_name in cat_labels.items():
    theories = categories.get(cat_id, [])
    if not theories:
        continue
    st.markdown(f"### {cat_name}")
    cols = st.columns(3)
    for i, t in enumerate(theories):
        with cols[i % 3]:
            # 找到关联模块
            related_modules = []
            for m in TT_MODULES + HW_MODULES:
                if m.get("theoryId") == t["id"]:
                    related_modules.append(m)
            module_links = "".join(f'<span class="badge" style="background: {m["color"]}20; color: {m["color"]};">{m["icon"]} {m["name"]}</span>' for m in related_modules)

            st.markdown(f"""
            <div style="background: var(--background-color, white); border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid {t['color']};">
                <div style="font-size: 2.2rem; text-align: center; margin-bottom: 4px;">{t['icon']}</div>
                <div style="font-size: 1.05rem; font-weight: 700; text-align: center; margin-bottom: 2px;">{t['name']}</div>
                <div style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin-bottom: 8px;">{t['nameEn']} · {t['author']} ({t['year']})</div>
                <div style="font-size: 0.85rem; line-height: 1.55; margin-bottom: 8px;">{t['summary']}</div>
                <div style="font-size: 0.82rem; line-height: 1.55; padding: 8px; background: rgba(139,92,246,0.06); border-radius: 6px; color: #6d28d9; margin-bottom: 8px;">
                    <strong>🎯 苏州应用：</strong> {t['relevance']}
                </div>
                {f'<div style="font-size: 0.78rem; margin-top: 6px;">{module_links}</div>' if module_links else ''}
            </div>
            """, unsafe_allow_html=True)

# 理论图谱（连线图）
st.markdown("---")
st.markdown("### 🗺️ 理论-模块对应关系图")

st.markdown("""
<div style="background: var(--background-color, white); padding: 18px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
    <p style="font-size: 0.92rem; color: #64748b; margin-bottom: 12px;">下方是 12 个理论 → 17 个模块的对应关系，点击模块可跳转到对应详情页：</p>
</div>
""", unsafe_allow_html=True)

# 创建理论-模块映射
import pandas as pd

mapping_rows = []
for t in THEORIES:
    for m in TT_MODULES + HW_MODULES:
        if m.get("theoryId") == t["id"]:
            mtype = "TT-OPC" if m["id"].startswith("tt-") else "HW-OPC"
            mapping_rows.append({
                "理论": f"{t['icon']} {t['name']}",
                "理论作者": t["author"],
                "模块": f"{m['icon']} {m['name']}",
                "平台": mtype,
                "对应关系": m["desc"][:50] + "...",
            })

if mapping_rows:
    st.dataframe(pd.DataFrame(mapping_rows), use_container_width=True, hide_index=True, column_config={
        "对应关系": st.column_config.TextColumn(width="large"),
    })
else:
    st.info("暂无完整映射")

# 总结
st.markdown("---")
st.markdown("### 📊 理论框架全景")

theory_count_by_cat = {cat_labels[k]: len(v) for k, v in categories.items()}
ttc1, ttc2, ttc3, ttc4 = st.columns(4)
for col, (cat, count) in zip([ttc1, ttc2, ttc3, ttc4], theory_count_by_cat.items()):
    with col:
        st.metric(cat, count, help=f"该类别包含 {count} 个理论")

# 设计哲学
st.markdown("---")
st.markdown("### 💭 设计哲学")
st.info("""
> **技术转移不是"技术 + 经济"的简单拼凑,而是"经济学的 12 个理论在 8+9 个工程模块的产品化落地"**。

- 每个 TT-OPC 模块都解决一个**具体经济问题**（Arrow 信息悖论、Coase 交易成本、三螺旋、吸收能力、网络效应……）
- 每个 HW-OPC 模块都对应一个**具体工程环节**（芯片选型、BOM 估算、供应链对接、合规认证……）
- **理论与工程的对应不是"贴标签"**，而是"理论告诉你为什么要做这个模块，工程告诉你怎么实现"
""")
