"""
TT-OPC 共享数据层
从 React 端 src/data.ts 翻译为 Python 格式
让 Streamlit 镜像版可独立运行 (不依赖 FastAPI 后端启动)
"""
from typing import List, Dict, Any
from dataclasses import dataclass, field

# ─── 12 个经济学理论（从 data.ts 翻译） ───
THEORIES = [
    {"id": "solow", "name": "Solow 增长模型", "nameEn": "Solow Growth Model", "author": "Robert Solow", "year": "1957", "category": "classical", "summary": "技术进步是经济增长的核心驱动力,占总产出增长的约 2/3,为科技成果转化与经济发展的关联性提供了核心理论框架。", "relevance": "苏州 R&D 占 GDP 4.2% 以上 (2025 年),距深圳 5.8%、北京 6.39% 仍有追赶空间,Solow 模型揭示了研发投入对经济增长的直接贡献。", "color": "#3b82f6", "icon": "📈"},
    {"id": "romer", "name": "内生增长理论", "nameEn": "Endogenous Growth Theory", "author": "Romer", "year": "1990", "category": "classical", "summary": "知识溢出与人力资本是技术转移和创新的核心驱动力,创新主体的协同互动是提升成果转化效率的重要支撑。", "relevance": "苏州规上工业企业研发机构建有率超 80%,创新联合体 235 家,知识溢出效应正在形成。", "color": "#8b5cf6", "icon": "💡"},
    {"id": "stokes", "name": "巴斯德象限", "nameEn": "Stokes' Pasteur's Quadrant", "author": "Stokes", "year": "1997", "category": "classical", "summary": "基础研究与应用研究协同发展,打破了传统'基础研究与产业化脱节'的认知,为新型研发机构建设提供理论指引。", "relevance": "姑苏实验室既做基础研究又做产业应用,正是巴斯德象限的典型实践。", "color": "#06b6d4", "icon": "🧫"},
    {"id": "arrow", "name": "Arrow 信息悖论", "nameEn": "Arrow's Information Paradox", "author": "Kenneth Arrow", "year": "1962", "category": "classical", "summary": "技术买卖中的核心矛盾:买方需要了解技术才能评估价值,但了解后就不需要买了。盲盒评估是解决此悖论的方案。", "relevance": "TT-OPC 平台的盲盒评估模块直接解决此问题——不泄露核心技术就能展示价值。", "color": "#ef4444", "icon": "📦"},
    {"id": "coase", "name": "Coase 交易成本", "nameEn": "Coase Transaction Cost", "author": "Ronald Coase", "year": "1937", "category": "classical", "summary": "交易成本决定了企业的边界。当 AI 将交易成本降至接近零时,一人公司成为可能。", "relevance": "OPC 模式的核心理论支撑——AI 将搜索、评估、匹配、合同等交易成本大幅降低。", "color": "#f59e0b", "icon": "💰"},
    {"id": "schumpeter", "name": "创造性破坏", "nameEn": "Creative Destruction", "author": "Schumpeter", "year": "1942", "category": "classical", "summary": "创新本质上是对旧有生产方式的破坏和替代。技术雷达模块帮助预测替代时机。", "relevance": "技术雷达模块扫描技术生命周期,帮助 OPC 在'破坏'窗口期抓住机会。", "color": "#10b981", "icon": "🔄"},
    {"id": "triple", "name": "三螺旋理论", "nameEn": "Triple Helix", "author": "Etzkowitz & Leydesdorff", "year": "1995", "category": "classical", "summary": "大学-产业-政府三方协同是创新生态的核心。三角色工作台将此理论产品化。", "relevance": "三角色工作台 (教授+CEO+律师) 是三螺旋理论的 AI 实现——一人扮演三方。", "color": "#6366f1", "icon": "🧬"},
    {"id": "absorptive", "name": "吸收能力理论", "nameEn": "Absorptive Capacity", "author": "Cohen & Levinthal", "year": "1990", "category": "classical", "summary": "企业识别、消化、应用外部知识的能力决定了技术转移的成功率。场景翻译降低吸收门槛。", "relevance": "场景翻译模块将技术语言翻译为投资人/CEO/院长版,本质上是提升买方吸收能力。", "color": "#ec4899", "icon": "🔄"},
    {"id": "network", "name": "网络效应", "nameEn": "Network Effects", "author": "Metcalfe", "year": "1995", "category": "modern", "summary": "网络的价值与用户数的平方成正比。社交传播交易模块利用网络效应扩大技术影响力。", "relevance": "SocialHub 模块连接 OPC 社区,用户越多,匹配效率越高,形成正向飞轮。", "color": "#14b8a6", "icon": "🌐"},
    {"id": "fed", "name": "联邦学习经济学", "nameEn": "Federated Learning Economics", "author": "McMahan et al.", "year": "2017", "category": "modern", "summary": "数据不动模型动——在保护隐私的前提下实现跨机构协作。联邦匹配模块的底层逻辑。", "relevance": "FedMatch 模块让高校专利数据不出校就能匹配需求方,是联邦学习在技术转移的应用。", "color": "#8b5cf6", "icon": "🔗"},
    {"id": "us-ai", "name": "美国 AI 政策框架 (2026)", "nameEn": "US National AI Policy Framework", "author": "NSTC", "year": "2026", "category": "policy", "summary": "联邦数据集以 AI-ready 格式开放,能源部应用此机制使新材料研发周期缩短 40%。", "relevance": "借鉴此框架,苏州可建立技术供需信息标准化格式,打通'数据孤岛'。", "color": "#f59e0b", "icon": "🇺🇸"},
    {"id": "g60", "name": "长三角 G60 科创走廊", "nameEn": "G60 S&T Innovation Corridor", "author": "三省一市", "year": "2016-", "category": "regional", "summary": "跨区域协同创新载体,九城市联运,推动创新资源跨区域流动。", "relevance": "苏州作为 G60 核心城市,可依托此机制承接上海技术溢出。", "color": "#ef4444", "icon": "🌐"},
]

# ─── 6 个国内案例 ───
CASES = [
    {"id": "opc-agent", "name": "OPC×Agent 超级个体挑战赛", "type": "academic", "tags": ["OPC×Agent", "百度千帆"], "description": "2026 年 4 月,西交利物浦大学联合百度集团举办'西浦·百度星河杯 OPC·Agent 超级个体挑战赛',156 支团队、近 500 名青年学子参与,在百度千帆智能体平台完成技术转移全流程实战。", "outcomes": ["西浦副校长丁忆民博士亲临颁奖典礼", "验证'AI Agent+OPC' 模式可行性"], "votes": 52, "featured": True, "year": 2026, "institution": "西交利物浦大学 × 百度集团", "icon": "🏆"},
    {"id": "embodied", "name": "苏州具身智能机器人产业生态大会", "type": "industry", "tags": ["具身智能", "机器人"], "description": "2026 年 4 月'苏州具身智能机器人产业生态大会'发布 10 台新具身智能机器人,机器人核心产业产值同比增长超 50%,连续五年稳居全国前三。", "outcomes": ["江苏人形机器人'十三太保'中苏州独占 6 席", "吴中区服务机器人产量占全国六成以上"], "votes": 41, "featured": True, "year": 2026, "institution": "苏州市", "icon": "🤖"},
    {"id": "xjtlu", "name": "西浦 AI 融创工坊", "type": "academic", "tags": ["AI+工科教育", "联邦学习"], "description": "西浦 AI 融创工坊探索'企业出题-学员提案-原型制造-成果认证' 模式,涵盖 AMR 移动机器人、七自由度工业机械臂、CNC 精密加工中心、3D 打印系统、工业视觉检测模块及 MES 生产管理系统五大功能单元。", "outcomes": ["联邦学习框架 R²=99.17%", "国内领先的 AI+工科教学载体"], "votes": 47, "featured": True, "year": 2025, "institution": "西交利物浦大学", "icon": "🎓"},
    {"id": "robokem", "name": "RoboChem-Flex 无人实验室", "type": "industry", "tags": ["自动化实验", "贝叶斯优化"], "description": "荷兰阿姆斯特丹大学 Timothy Noël 团队 2025 年发表 RoboChem-Flex(Nature Synthesis),验证仅需约 5000 美元即可建成基于流动化学与 Arduino 开源组件的自动化实验平台,实验次数压缩 60% 以上。", "outcomes": ["5000 美元/台低成本部署", "Nature Synthesis 2025"], "votes": 35, "featured": False, "year": 2025, "institution": "阿姆斯特丹大学", "icon": "🧪"},
    {"id": "gusulab", "name": "姑苏实验室", "type": "academic", "tags": ["新型研发机构", "揭榜挂帅"], "description": "苏州市财政重点支持的新型研发机构(据苏州工业园区管委会公开报道,规划总投资约 200 亿元),联合华为、中芯国际等龙头企业设立'揭榜挂帅'项目,在高端光刻胶、第三代半导体等领域攻克多项'卡脖子'难题。", "outcomes": ["累计建设资金超 200 亿元(行业普遍引用数)", "揭榜挂帅 41 项需求"], "votes": 29, "featured": False, "year": 2020, "institution": "苏州市", "icon": "🏛️"},
    {"id": "biobay", "name": "BioBAY 生物医药产业园", "type": "industry", "tags": ["生物医药", "1655 亿产值"], "description": "苏州工业园区 BioBAY 已集聚生物医药及大健康企业超 2000 家,2024 年产值达 1655 亿元(数据来源:苏州市政府 2024 年经济数据公报),全国生物医药产业园区综合竞争力稳居前三。", "outcomes": ["2024 年产值 1655 亿元", "全国生物医药产业园区前三"], "votes": 38, "featured": False, "year": 2006, "institution": "苏州工业园区", "icon": "💊"},
]

# ─── 4 个国际案例 ───
INTL_CASES = [
    {"country": "美国", "name": "波士顿肯德尔广场", "model": "政府-产业-大学三螺旋", "keyPoints": ["MIT TLO 专业化技术转移", "AI 评估系统分析技术成熟度"], "metrics": [{"label": "年度技术转移合同", "value": "2.6 亿美元"}, {"label": "专利许可数", "value": "1000+/年"}], "color": "#1d4ed8"},
    {"country": "德国", "name": "巴登-符腾堡州", "model": "弗劳恩霍夫中试模式", "keyPoints": ["弗劳恩霍夫协会连接基础研究与产业", "中试项目成功率 > 85%"], "metrics": [{"label": "年度预算", "value": "30 亿欧元"}, {"label": "中试成功率", "value": ">85%"}], "color": "#15803d"},
    {"country": "全球", "name": "研究三角园 (RTP)", "model": "大学-产业-政府协同", "keyPoints": ["杜克+UNC+NC State 三校协同", "3300+ 项专利积累"], "metrics": [{"label": "年均研发投入", "value": ">20 亿美元"}, {"label": "孵化器", "value": "30+ 家"}], "color": "#7c3aed"},
    {"country": "中国", "name": "松山湖材料实验室", "model": "创新样板工厂", "keyPoints": ["中试成功后直接产业化", "政府+科学家+企业家共治"], "metrics": [{"label": "入驻团队", "value": "50+ 个"}, {"label": "产业化率", "value": ">40%"}], "color": "#dc2626"},
]

# ─── 5 大瓶颈 ───
BOTTLENECKS = [
    {"name": "创新链脱节", "score": 72, "color": "#ef4444", "desc": "科研立项与市场需求严重脱节"},
    {"name": "中试环节薄弱", "score": 65, "color": "#f59e0b", "desc": "缺乏专业中试平台"},
    {"name": "评价体系单一", "score": 58, "color": "#eab308", "desc": "论文导向的评价体系"},
    {"name": "金融支持不足", "score": 55, "color": "#84cc16", "desc": "成果转化早期融资困难"},
    {"name": "服务链条断裂", "score": 48, "color": "#22c55e", "desc": "技术转移机构能力分散"},
]

# ─── 8 个 TT-OPC 软件模块 ───
TT_MODULES = [
    {"id": "tt-blindbox", "name": "盲盒评估", "nameEn": "TechBlindBox", "icon": "📦", "theory": "Arrow 信息悖论", "theoryId": "arrow", "desc": "不泄露技术就能评估价值——解决技术买卖中的核心矛盾", "color": "#ef4444", "interactive": True, "features": ["SWOT 四象限自动生成", "TRL 成熟度评估", "市场规模/竞品/风险/时间表自动测算", "LLM AI 增强流式输出"]},
    {"id": "tt-fedmatch", "name": "联邦匹配", "nameEn": "FedMatch", "icon": "🔗", "theory": "联邦学习经济学", "theoryId": "fed", "desc": "跨校专利数据不出校就能匹配需求方", "color": "#8b5cf6", "interactive": False, "features": ["联邦学习 + HNSW 向量检索", "高校专利数据不出域", "需求方画像自动匹配", "Top-K 语义相似度排序"]},
    {"id": "tt-knowledge", "name": "知识图谱", "nameEn": "KnowledgeFlow", "icon": "🌐", "theory": "内生增长理论", "theoryId": "romer", "desc": "可视化知识从论文到产品的流动路径", "color": "#3b82f6", "interactive": False, "features": ["知识溢出路径可视化", "论文→产品全链路追踪", "作者-机构-领域三方图谱", "Neo4j 图数据库后端"]},
    {"id": "tt-radar", "name": "技术雷达", "nameEn": "TechRadar", "icon": "📡", "theory": "创造性破坏", "theoryId": "schumpeter", "desc": "预测技术生命周期和替代时机", "color": "#10b981", "interactive": False, "features": ["技术 S 曲线预测", "替代时机窗口识别", "专利申请趋势 + 论文增长", "跨领域技术交叉预警"]},
    {"id": "tt-translate", "name": "场景翻译", "nameEn": "TechTranslator", "icon": "🔄", "theory": "吸收能力理论", "theoryId": "absorptive", "desc": "一键生成投资人/CEO/院长版技术描述", "color": "#ec4899", "interactive": True, "features": ["投资人/CEO/院长 三版本自动翻译", "SSE 流式逐版本推送", "L1/L2/L3 吸收能力适配", "LLM AI 增强"]},
    {"id": "tt-triple", "name": "三角色工作台", "nameEn": "TripleHelix", "icon": "🧬", "theory": "三螺旋理论", "theoryId": "triple", "desc": "教授+CEO+律师三 Agent 协同分析", "color": "#6366f1", "interactive": True, "features": ["教授视角:技术可行性+学术价值", "CEO 视角:市场机会+商业模式", "律师视角:合规风险+知识产权", "三 Agent 协同流式输出"]},
    {"id": "tt-social", "name": "社交传播交易", "nameEn": "SocialHub", "icon": "🌐", "theory": "网络效应+双边市场", "theoryId": "network", "desc": "社交+传播+交易一体化", "color": "#14b8a6", "interactive": False, "features": ["OPC 社区+技术交易撮合", "用户数² 网络效应放大", "双边市场供需动态平衡", "FedCtx 语义检索"]},
    {"id": "tt-thermo", "name": "创新温度计", "nameEn": "InnovationThermo", "icon": "🌡️", "theory": "GPT 渗透+新质生产力", "theoryId": "us-ai", "desc": "实时测量 AI 渗透率", "color": "#f59e0b", "interactive": False, "features": ["GPT/AI 渗透率实时测算", "新质生产力指标体系", "区域创新热度地图", "季度/年度趋势报告"]},
]

# ─── 9 个 HW-OPC 硬件模块 ───
HW_MODULES = [
    {"id": "hw-eval", "name": "硬件评估", "nameEn": "HWEval", "icon": "📊", "theory": "芯片 Benchmark", "desc": "芯片适配+BOM 成本+国产化率", "color": "#0984e3", "interactive": True, "features": ["内置国产 AI 芯片数据库 (RK3588/BM1684/...)", "算法-芯片适配度评分 (0-100)", "BOM 成本自动拆解 (芯片/传感器/PCB/组装/其他)", "国产化率+风险等级"]},
    {"id": "hw-supply", "name": "供应链图谱", "nameEn": "SupplyChain", "icon": "🔗", "theory": "产业链协同", "desc": "算法→芯片→ODM→认证全链路", "color": "#6c5ce7", "interactive": False, "features": ["内置 ODM/传感器/认证机构库", "算法-芯片-ODM 链路匹配", "国产替代进度追踪", "BOM 成本优化建议"]},
    {"id": "hw-translate", "name": "硬件翻译", "nameEn": "HWTranslator", "icon": "🔄", "theory": "吸收能力", "desc": "硬件规格书→4 个专业版本", "color": "#e17055", "interactive": True, "features": ["投资人/PM/供应链/认证 四版本", "硬件领域专业 Prompt 模板", "SSE 流式输出", "BOM/交期/认证 自动嵌入"]},
    {"id": "hw-quad", "name": "四角色工作台", "nameEn": "QuadHelix", "icon": "🧬", "theory": "四螺旋", "desc": "算法专家+硬件 PM+供应链专家+认证顾问", "color": "#00b894", "interactive": True, "features": ["算法专家视角: ONNX+TensorRT 部署", "硬件 PM 视角: EVT→DVT→PVT→MP", "供应链专家视角: BOM+备选供应商", "认证顾问视角: 3C/SRRC/算法备案"]},
    {"id": "hw-radar", "name": "硬件雷达", "nameEn": "HWRadar", "icon": "📡", "theory": "技术预测", "desc": "芯片路线图+国产替代进度", "color": "#fdcb6e", "interactive": False, "features": ["覆盖 7 类器件 (MCU/SoC/PMIC/Sensor/...)", "芯片路线图 0-36 月预测", "国产替代率月度更新", "供应链断点预警"]},
    {"id": "hw-cert", "name": "认证导航", "nameEn": "CertNav", "icon": "📋", "theory": "合规管理", "desc": "3C/SRRC/算法备案全流程", "color": "#d63031", "interactive": False, "features": ["3C 认证 (4-6 个月)", "SRRC 核准 (2-3 个月)", "算法备案 (1-2 个月)", "并行策略+材料清单"]},
    {"id": "hw-proto", "name": "打样工坊", "nameEn": "Prototyping", "icon": "🏭", "theory": "敏捷开发", "desc": "EVT→DVT→PVT→MP 全流程", "color": "#00cec9", "interactive": False, "features": ["BOM 估算+风险管理", "EVT/DVT/PVT/MP 阶段追踪", "工时/物料/良率看板", "量产前 Check List"]},
    {"id": "hw-social-trade", "name": "社交交易", "nameEn": "SocialTrade", "icon": "🌐", "theory": "网络效应", "desc": "硬件开发者社区+供应链对接", "color": "#e84393", "interactive": False, "features": ["硬件开发者社区", "供应链对接 (BOM 共享+议价)", "供需匹配+数据看板", "FedCtx 语义检索"]},
    {"id": "hw-overview", "name": "总览", "nameEn": "Overview", "icon": "🏠", "theory": "全景仪表盘", "desc": "七层产业链可视化+竞品对比", "color": "#636e72", "interactive": False, "features": ["七层产业链可视化 (算法→芯片→ODM→生产→认证→渠道→用户)", "竞品对比 (按芯片/算法/BOM/认证多维度)", "苏州 vs 长三角主要城市对比", "OPC 全景仪表盘"]},
]

# ─── 5 大政策建议（从 data.ts 翻译） ───
RECOMMENDATIONS = [
    {"icon": "🏛️", "title": "强化顶层设计", "color": "#3b82f6", "points": ["将 AI+OPC 融合纳入苏州市人工智能+城市行动计划", "完善科技成果转化相关政策"]},
    {"icon": "🤖", "title": "AI+OPC 平台建设", "color": "#8b5cf6", "points": ["以开源 tt_opc_platform 为技术底座", "建设技术供需信息标准化格式"]},
    {"icon": "🎓", "title": "AI 融创工坊育才", "color": "#10b981", "points": ["深化'企业出题-学员提案-原型制造-成果认证' 模式", "每年培养复合型技术转移人才 300 人"]},
    {"icon": "🔒", "title": "数据安全与隐私计算", "color": "#06b6d4", "points": ["联邦学习解决企业配方数据隐私", "数据完全自主可控"]},
    {"icon": "🌏", "title": "产学研协同", "color": "#ef4444", "points": ["依托 G60 科创走廊承接上海技术溢出", "借鉴波士顿三螺旋模式"]},
]

# ─── 区域热力图数据（从 server.py 翻译） ───
MAP_PROVINCES = [
    {"name": "北京", "value": 92, "patents": 128000, "transfers": 4500, "institutes": 89, "coord": [116.4, 39.9]},
    {"name": "上海", "value": 88, "patents": 95000, "transfers": 3800, "institutes": 72, "coord": [121.5, 31.2]},
    {"name": "广东", "value": 85, "patents": 110000, "transfers": 4200, "institutes": 65, "coord": [113.3, 23.1]},
    {"name": "江苏", "value": 82, "patents": 88000, "transfers": 3600, "institutes": 68, "coord": [118.8, 32.1]},
    {"name": "浙江", "value": 78, "patents": 72000, "transfers": 2900, "institutes": 55, "coord": [120.2, 30.3]},
    {"name": "湖北", "value": 65, "patents": 45000, "transfers": 1800, "institutes": 42, "coord": [114.3, 30.6]},
    {"name": "四川", "value": 62, "patents": 42000, "transfers": 1600, "institutes": 38, "coord": [104.1, 30.7]},
    {"name": "陕西", "value": 60, "patents": 38000, "transfers": 1400, "institutes": 35, "coord": [108.9, 34.3]},
    {"name": "山东", "value": 58, "patents": 40000, "transfers": 1500, "institutes": 32, "coord": [117.0, 36.7]},
    {"name": "安徽", "value": 55, "patents": 35000, "transfers": 1300, "institutes": 28, "coord": [117.3, 31.8]},
    {"name": "天津", "value": 55, "patents": 33000, "transfers": 1200, "institutes": 25, "coord": [117.2, 39.1]},
    {"name": "湖南", "value": 52, "patents": 32000, "transfers": 1200, "institutes": 26, "coord": [112.9, 28.2]},
    {"name": "重庆", "value": 50, "patents": 28000, "transfers": 950, "institutes": 20, "coord": [106.5, 29.6]},
    {"name": "福建", "value": 50, "patents": 28000, "transfers": 1000, "institutes": 22, "coord": [119.3, 26.1]},
    {"name": "辽宁", "value": 48, "patents": 30000, "transfers": 900, "institutes": 24, "coord": [123.4, 41.8]},
    {"name": "河南", "value": 42, "patents": 25000, "transfers": 800, "institutes": 18, "coord": [113.7, 34.8]},
    {"name": "山西", "value": 38, "patents": 22000, "transfers": 700, "institutes": 15, "coord": [112.5, 37.9]},
    {"name": "河北", "value": 38, "patents": 22000, "transfers": 700, "institutes": 16, "coord": [114.5, 38.0]},
    {"name": "江西", "value": 35, "patents": 18000, "transfers": 600, "institutes": 14, "coord": [115.9, 28.7]},
    {"name": "吉林", "value": 35, "patents": 18000, "transfers": 550, "institutes": 15, "coord": [125.3, 43.9]},
    {"name": "广西", "value": 30, "patents": 14000, "transfers": 450, "institutes": 12, "coord": [108.3, 22.8]},
    {"name": "云南", "value": 28, "patents": 12000, "transfers": 380, "institutes": 10, "coord": [102.7, 25.0]},
    {"name": "贵州", "value": 25, "patents": 10000, "transfers": 320, "institutes": 8, "coord": [106.7, 26.6]},
    {"name": "甘肃", "value": 22, "patents": 8000, "transfers": 250, "institutes": 7, "coord": [103.8, 36.1]},
    {"name": "内蒙古", "value": 20, "patents": 7000, "transfers": 220, "institutes": 6, "coord": [111.7, 40.8]},
    {"name": "海南", "value": 20, "patents": 6000, "transfers": 200, "institutes": 5, "coord": [110.3, 20.0]},
    {"name": "新疆", "value": 18, "patents": 5000, "transfers": 150, "institutes": 5, "coord": [87.6, 43.8]},
    {"name": "宁夏", "value": 15, "patents": 3000, "transfers": 100, "institutes": 3, "coord": [106.3, 38.5]},
    {"name": "青海", "value": 12, "patents": 2000, "transfers": 60, "institutes": 2, "coord": [101.8, 36.6]},
    {"name": "西藏", "value": 8, "patents": 800, "transfers": 20, "institutes": 1, "coord": [91.1, 29.7]},
    {"name": "黑龙江", "value": 32, "patents": 16000, "transfers": 500, "institutes": 14, "coord": [126.6, 45.8]},
]

# ─── 成果汇编（咨政报告 + 党刊 + 学术论文） ───
PUBLICATIONS = [
    {
        "type": "policy", "level": "市厅级",
        "title": "《抓住人工智能发展机遇,加快苏州科技成果转移转化》",
        "subtitle": "苏州市社科联 2025 年度决策咨询'揭榜挂帅'类课题 (J2025LX005)",
        "status": "拟投稿《决策参阅》争取市厅级领导批示",
        "authors": "徐德昌（西交利物浦大学人工智能学院副院长）",
        "year": 2026,
        "highlights": [
            "对策建议占全文 61.4%（远超 40% 内参红线）",
            "AI 赋能机制拆解为 6 环节 + 6 部门 + 1 条数据流",
            "融资分账+部门协同:1 亿元投入、970% ROI、4 阶段",
            "调研 32 家单位、47 人次访谈、380 份问卷",
        ],
        "color": "#3b82f6",
    },
    {
        "type": "party", "level": "省级",
        "title": "《'AI+OPC'双轮驱动科技成果转化的苏州探索》",
        "subtitle": "拟投《群众》（中共江苏省委机关刊）",
        "status": "v15.1 已通过严格审评,达到党刊刊用标准（62/70）",
        "authors": "徐德昌（西交利物浦大学人工智能学院教授）",
        "year": 2026,
        "highlights": [
            "政治站位+事实准确性+文字规范性 全面修复",
            "OPC 党支部 / 联合党委 新业态党建建议（已被采纳）",
            "苏州 vs 长三角 + 4 阶段实施路线图（强可执行性）",
            "首条 OPC 揭榜挂帅 102 项需求 + 1100 亿新型工业化基金",
        ],
        "color": "#dc2626",
    },
    {
        "type": "academic", "level": "顶刊",
        "title": "Dovish Asymmetry / Regime-Dependent Asymmetry in FOMC Statement Sentiment",
        "subtitle": "Manuscript v16 修订稿（投稿 RES/JFE 准备中）",
        "status": "8 个 P0 deal-breaker 全部修复、22 项实质性修改、189 段/10921 词、7 张图字节级一致",
        "authors": "Dechang Xu (XJTLU Academy of AI) + Eileen Zhang",
        "year": 2026,
        "highlights": [
            "AI 时代 FOMC 沟通凸响应: 1.0%/30% of σ (hawkish) vs 0.04%/1% (dovish)",
            "ZLB+Post 时代集中 (Chow F=14.12, p<0.001)",
            "Bauer-Swanson 预测性检验通过 (target R²=0.041, p=0.06)",
            "OPC 1243 联合党委 + 半衰期 3.2 meetings、5.3× 长期乘数",
        ],
        "color": "#10b981",
    },
    {
        "type": "academic", "level": "顶刊",
        "title": "FOMC Stress Test & Bank Capital Adequacy",
        "subtitle": "WRDS 数据库 + Acosta (2022) 因子结构（SSRN Working Paper）",
        "status": "MPM v5 + FOMC v9.0 已定稿,准备投 Journal of Financial Economics",
        "authors": "Dechang Xu (XJTLU)",
        "year": 2026,
        "highlights": [
            "高阶矩矩匹配 + Fed Funds Futures 因果识别",
            "DFAST/CCAR 压力测试 AI 时代再校准",
            "v15.1 修复 22 项 deal-breaker（含 Gambacorta dup、3 处事实硬伤）",
        ],
        "color": "#8b5cf6",
    },
    {
        "type": "book", "level": "开源",
        "title": "AI for TT-OPC: 技术转移一人公司全链路指南",
        "subtitle": "MIT 协议开源 · 9 章 + 附录 · 覆盖 OPC 认知/AI 工具/案例/法律/运营",
        "status": "GitHub: dechang64/AI-for-TT-OPC",
        "authors": "Dechang Xu",
        "year": 2026,
        "highlights": [
            "OPC 模式不是'一个人的小公司'，而是'一个人+AI=一支团队'",
            "AI 工具将个人能力扩展为'虚拟团队'",
            "MIT 开源,可作为咨政报告+论文的补充材料",
        ],
        "color": "#f59e0b",
    },
]

# ─── 核心论断（首页 Hero 用） ───
HERO_QUOTES = [
    {"text": "OPC 不是'一个人的小公司'，而是'一个人 + AI = 一支团队'", "icon": "🚀", "author": "TT-OPC 平台核心论断"},
    {"text": "AI 是某个人协作方式，是贯穿全链路的'操作系统'", "icon": "💡", "author": "Slogan"},
    {"text": "技术转移是经济学的 24 个理论在 8+9 个模块的工程实现", "icon": "📚", "author": "设计哲学"},
]


def get_theory(theory_id: str) -> Dict[str, Any]:
    """根据 ID 获取理论"""
    for t in THEORIES:
        if t["id"] == theory_id:
            return t
    return {}


def get_module(module_id: str) -> Dict[str, Any]:
    """根据 ID 获取模块（TT 或 HW）"""
    for m in TT_MODULES + HW_MODULES:
        if m["id"] == module_id:
            return m
    return {}


def get_top_provinces(n: int = 5) -> List[Dict[str, Any]]:
    """返回技术转移指数 Top N 省份"""
    return sorted(MAP_PROVINCES, key=lambda x: -x["value"])[:n]
