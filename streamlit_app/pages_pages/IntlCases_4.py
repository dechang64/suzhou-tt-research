'国际案例页 - 4 个国际标杆 + 苏州差距分析'
import streamlit as st
from data import INTL_CASES, CASES
import pandas as pd


def render():
    st.markdown('\n<div style="background: linear-gradient(135deg, #e8521a 0%, #c44116 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">\n    <div style="font-size: 1.8rem; font-weight: 700;">🌏 国际技术转移标杆</div>\n    <div style="opacity: 0.92; margin-top: 4px;">4 个国际案例 · 给苏州的对标和启示</div>\n</div>\n', unsafe_allow_html=True)
    st.markdown('### 🏆 全球标杆')
    cols = st.columns(2)
    for i, case in enumerate(INTL_CASES):
        with cols[i % 2]:
            metrics_html = ''.join((f"""<div style="display: inline-block; background: {case['color']}20; color: {case['color']}; padding: 6px 12px; border-radius: 8px; margin: 4px;"><div style="font-size: 1.15rem; font-weight: 700;">{m['value']}</div><div style="font-size: 0.75rem;">{m['label']}</div></div>""" for m in case['metrics']))
            keypoints = ''.join((f'<li>{kp}</li>' for kp in case['keyPoints']))
            st.markdown(f"""\n        <div style="background: var(--background-color, white); border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-top: 4px solid {case['color']};">\n            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">\n                <div style="font-size: 2.5rem;">{case['country']}</div>\n                <div>\n                    <div style="font-size: 1.3rem; font-weight: 700;">{case['country']} · {case['name']}</div>\n                    <div style="font-size: 0.85rem; color: #64748b;">模型: {case['model']}</div>\n                </div>\n            </div>\n            <div style="margin-bottom: 10px;">{metrics_html}</div>\n            <div style="font-size: 0.92rem; line-height: 1.6; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 6px;">\n                <strong>🎯 关键要素：</strong>\n                <ul style="margin: 6px 0 0 0; padding-left: 20px;">{keypoints}</ul>\n            </div>\n        </div>\n        """, unsafe_allow_html=True)
    st.markdown('---')
    st.markdown('### 📊 苏州 vs 国际标杆对比')
    comparison = pd.DataFrame([{'指标': '技术合同成交额', '美国波士顿': '2.6 亿美元/年（MIT 单机构）', '德国 Fraunhofer': '30 亿欧元/年（协会总预算）', '苏州 2024': '1050 亿元/年（全市）', '苏州判断': '✅ 已达国际水平'}, {'指标': '概念验证中心', '美国波士顿': '20+ 家（区域型）', '德国 Fraunhofer': '80+ 家（研究所级）', '苏州 2024': '29 家', '苏州判断': '🟡 接近波士顿'}, {'指标': '技术经纪人', '美国': '3-5 万人', '深圳 2023': '5000+ 人', '苏州 2023': '2876 人', '苏州判断': '⚠️ 落后深圳'}, {'指标': '中试成功率', '德国 Fraunhofer': '>85%', '苏州': '未公开（估测 50-60%）', '深圳': '估测 60-70%', '苏州判断': '⚠️ 显著落后'}, {'指标': 'OPC 社区数量', '全球领先（美国）': '硅谷 YC 约 200 个', '深圳': '20+ 个（2025 年新批）', '苏州': '2025 年 11 月启动首批 20 个', '苏州判断': '🟡 起步阶段'}, {'指标': 'OPC 培育基金', '美国 YC': '标准 50 万美元/家', '深圳': '≤1000 万元/项目', '苏州': '已发布 120 个场景清单 + 100 亿新型工业化基金', '苏州判断': '✅ 资金充足'}])
    st.dataframe(comparison, use_container_width=True, hide_index=True)
    st.markdown('---')
    st.markdown('### 💡 启示')
    st.info('\n**🎯 苏州 vs 国际：3 个差距、3 个优势**\n\n**3 个差距**：\n1. **技术经纪人密度**：苏州 2876 人 vs 美国 3-5 万人，差距 10 倍\n2. **中试成功率**：苏州估测 50-60% vs 德国 Fraunhofer >85%，差距 30 个百分点\n3. **OPC 起步晚**：苏州 2025 年 11 月才启动首批 20 个 OPC 社区，vs 深圳已发布 20+ 个\n\n**3 个优势**：\n1. **资金充足**：1100 亿新型工业化基金 + 110 亿授信额度，已超过深圳同期\n2. **场景资源**：120 个本地企业真实场景清单，直接对接产业\n3. **政策体系**：揭榜挂帅+包干制+职称改革+联合党委，制度集成度领先\n')
    st.markdown('---')
    st.markdown('### 🇨🇳 国内标杆案例')
    china_cols = st.columns(3)
    for i, case in enumerate(CASES):
        with china_cols[i % 3]:
            st.markdown(f"""\n        <div style="background: var(--background-color, white); border-radius: 10px; padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border-left: 3px solid #ef4444;">\n            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">\n                <span style="font-size: 1.8rem;">{case['icon']}</span>\n                <span style="font-size: 0.95rem; font-weight: 700;">{case['name']}</span>\n            </div>\n            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">{case['institution']} · {case['year']}</div>\n            <div style="font-size: 0.82rem; line-height: 1.5; margin-bottom: 6px;">{case['description'][:120]}...</div>\n            <div style="font-size: 0.78rem; color: #10b981;">{', '.join(case['outcomes'])}</div>\n        </div>\n        """, unsafe_allow_html=True)
