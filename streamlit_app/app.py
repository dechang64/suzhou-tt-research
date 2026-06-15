"""
TT-OPC Streamlit 镜像版 - 入口
用 st.navigation() 接管路由, 自定义 sidebar + 6 个 page

目录结构:
  app.py          <- 本文件 (入口 + 导航调度)
  _home.py        <- 主页 (home()) + 自定义 sidebar (custom_sidebar())
  data.py         <- 共享数据层
  pages_pages/    <- 6 个独立 page 模块 (1_TheoryMap / 2_TT-OPC / ...)
"""
import streamlit as st
import importlib

# 必须在任何 st.xxx 之前调用一次
st.set_page_config(
    page_title="TT-OPC 智能运营平台 · 镜像版",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "About": "TT-OPC 平台是西交利物浦大学徐德昌教授课题组的开源项目。GitHub: dechang64/suzhou-tt-research",
    },
)

# 全局 CSS (每个 page 都要的样式 + 隐藏 streamlit 默认 sidebar 导航)
GLOBAL_CSS = """
<style>
    .nav-card {
        background: var(--background-color, white);
        border-left: 4px solid var(--primary-color, #3b82f6);
        border-radius: 8px;
        padding: 12px 14px;
        margin: 6px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        cursor: pointer;
        transition: transform 0.15s;
    }
    .nav-card:hover { transform: translateX(2px); }
    /* 隐藏 streamlit multipage app 默认生成的 sidebar 导航 */
    [data-testid="stSidebarNav"] { display: none !important; }
</style>
"""
st.markdown(GLOBAL_CSS, unsafe_allow_html=True)

# 导入主页 + 6 个 page 模块
from _home import home, custom_sidebar
from pages_pages import TheoryMap_1, TT_OPC_2, HW_OPC_3, IntlCases_4, Publications_5, Heatmap_6


# 7 个 page 定义
PAGES = [
    st.Page(home, title="项目总览", icon="🚀", url_path="", default=True),
    st.Page(TheoryMap_1.render, title="理论地图", icon="🧠", url_path="TheoryMap"),
    st.Page(TT_OPC_2.render, title="TT-OPC 软件模块", icon="📦", url_path="TT-OPC"),
    st.Page(HW_OPC_3.render, title="HW-OPC 硬件模块", icon="📊", url_path="HW-OPC"),
    st.Page(IntlCases_4.render, title="国际案例", icon="🌏", url_path="IntlCases"),
    st.Page(Publications_5.render, title="成果汇编", icon="📚", url_path="Publications"),
    st.Page(Heatmap_6.render, title="区域热力图", icon="🗺️", url_path="Heatmap"),
]

# 接管路由
nav = st.navigation(PAGES)

# 自定义 sidebar (放每个 page 的左侧导航)
with st.sidebar:
    custom_sidebar()

# 运行当前 page
nav.run()
