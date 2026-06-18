'区域热力图页 - 31 省技术转移数据'
import streamlit as st
from data import MAP_PROVINCES, BOTTLENECKS
import pandas as pd


def render():
    st.markdown('\n<div style="background: linear-gradient(135deg, #0284c7 0%, #075985 100%); padding: 22px; border-radius: 12px; color: white; margin-bottom: 20px;">\n    <div style="font-size: 1.8rem; font-weight: 700;">🗺️ 中国技术转移区域热力图</div>\n    <div style="opacity: 0.92; margin-top: 4px;">31 省技术转移指数 · 专利数 · 年转化数 · 机构数</div>\n</div>\n', unsafe_allow_html=True)
    df = pd.DataFrame(MAP_PROVINCES)
    total_patents = df['patents'].sum()
    total_transfers = df['transfers'].sum()
    total_institutes = df['institutes'].sum()
    avg_value = df['value'].mean()
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric('总专利数', f'{total_patents // 10000}万+')
    with c2:
        st.metric('年转化数', f'{total_transfers // 1000}千+')
    with c3:
        st.metric('机构数', f'{total_institutes} 家')
    with c4:
        st.metric('平均指数', f'{avg_value:.1f}')
    st.markdown('---')
    st.markdown('### 🏆 Top 5 省份')
    top5 = df.sort_values('value', ascending=False).head(5)
    top5_display = top5[['name', 'value', 'patents', 'transfers', 'institutes']].rename(columns={'name': '省份', 'value': '技术转移指数', 'patents': '专利数', 'transfers': '年转化数', 'institutes': '机构数'})
    _top5_v_min = int(top5_display['技术转移指数'].min())
    _top5_v_max = int(top5_display['技术转移指数'].max())
    st.dataframe(top5_display, use_container_width=True, hide_index=True, column_config={'技术转移指数': st.column_config.ProgressColumn('技术转移指数', min_value=_top5_v_min, max_value=_top5_v_max, format='%d'), '专利数': st.column_config.NumberColumn(format='%d')})
    st.markdown('---')
    st.markdown('### 🗺️ 全部 31 省数据（按指数排序）')
    df_sorted = df.sort_values('value', ascending=False).reset_index(drop=True)
    df_sorted['排名'] = df_sorted.index + 1
    display_df = df_sorted[['排名', 'name', 'value', 'patents', 'transfers', 'institutes']].rename(columns={'name': '省份', 'value': '技术转移指数', 'patents': '专利数', 'transfers': '年转化数', 'institutes': '机构数'})
    _df_v_min = int(display_df['技术转移指数'].min())
    _df_v_max = int(display_df['技术转移指数'].max())
    st.dataframe(display_df, use_container_width=True, hide_index=True, height=600, column_config={'技术转移指数': st.column_config.ProgressColumn('技术转移指数', min_value=_df_v_min, max_value=_df_v_max, format='%d'), '专利数': st.column_config.NumberColumn(format='%d')})
    st.markdown('---')
    st.markdown('### 🏆 江苏（苏州）vs 全国对比')
    jiangsu_data = df[df['name'] == '江苏'].iloc[0]
    jiangsu_rank = (df['value'] > jiangsu_data['value']).sum() + 1
    col_a, col_b, col_c = st.columns(3)
    with col_a:
        st.metric('江苏排名', f'第 {jiangsu_rank} / 31')
        st.metric('江苏指数', jiangsu_data['value'])
    with col_b:
        st.metric('江苏专利数', f"{jiangsu_data['patents']:,}")
        st.metric('全国均值', f'{total_patents // 31:,}')
    with col_c:
        st.metric('江苏年转化数', f"{jiangsu_data['transfers']:,}")
        st.metric('全国均值', f'{total_transfers // 31:,}')
    st.markdown('---')
    st.markdown('### 🌏 长三角三省一市对比')
    yrd_provinces = df[df['name'].isin(['上海', '江苏', '浙江', '安徽'])].copy()
    yrd_data = yrd_provinces[['name', 'value', 'patents', 'transfers', 'institutes']].rename(columns={'name': '省份', 'value': '技术转移指数', 'patents': '专利数', 'transfers': '年转化数', 'institutes': '机构数'})
    _yrd_v_min = int(yrd_data['技术转移指数'].min())
    _yrd_v_max = int(yrd_data['技术转移指数'].max())
    st.dataframe(yrd_data, use_container_width=True, hide_index=True, column_config={'技术转移指数': st.column_config.ProgressColumn('技术转移指数', min_value=_yrd_v_min, max_value=_yrd_v_max, format='%d'), '专利数': st.column_config.NumberColumn(format='%d')})
    st.markdown('---')
    st.markdown('### ⚠️ 五大瓶颈 vs 区域分布')
    st.info('\n**苏州的技术转移瓶颈与全国 5 大瓶颈高度吻合**：\n\n| 瓶颈 | 全国评分 | 苏州现状 |\n|---|---|---|\n| 创新链脱节 | 72/100 | 严重：1050 亿技术合同 vs 3.9% 高校产业化率 |\n| 中试环节薄弱 | 65/100 | 严重：29 家概念验证中心 vs Fraunhofer 80+ |\n| 评价体系单一 | 58/100 | 改进中：职称改革+包干制 |\n| 金融支持不足 | 55/100 | 改善：1100 亿基金+110 亿授信+数据知识产权质押 |\n| 服务链条断裂 | 48/100 | 严重：2876 名技术经纪人 vs 美国 3-5 万 |\n')
    st.caption('💡 数据来源：公开统计数据汇总（国家知识产权局、各省科技厅年度报告）。仅供学术研究和决策参考。')
