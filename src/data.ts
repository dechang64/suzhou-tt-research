import type { Theory, Case, IntlCase, ModuleInfo } from './types'

export const THEORIES: Theory[] = [
  { id: 'solow', name: 'Solow增长模型', nameEn: 'Solow Growth Model', author: 'Robert Solow', year: '1957', category: 'classical', summary: '技术进步是经济增长的核心驱动力，占总产出增长的约2/3，为科技成果转化与经济发展的关联性提供了核心理论框架。', relevance: '苏州R&D占GDP 4.2%以上（2025年），距深圳5.8%、北京6.39%仍有追赶空间，Solow模型揭示了研发投入对经济增长的直接贡献。', color: '#3b82f6', icon: '📈' },
  { id: 'romer', name: '内生增长理论', nameEn: 'Endogenous Growth Theory', author: 'Romer', year: '1990', category: 'classical', summary: '知识溢出与人力资本是技术转移和创新的核心驱动力，创新主体的协同互动是提升成果转化效率的重要支撑。', relevance: '苏州规上工业企业研发机构建有率超80%，创新联合体235家，知识溢出效应正在形成。', color: '#8b5cf6', icon: '💡' },
  { id: 'stokes', name: '巴斯德象限', nameEn: "Stokes' Pasteur's Quadrant", author: 'Stokes', year: '1997', category: 'classical', summary: '基础研究与应用研究协同发展，打破了传统"基础研究与产业化脱节"的认知，为新型研发机构建设提供理论指引。', relevance: '姑苏实验室既做基础研究又做产业应用，正是巴斯德象限的典型实践。', color: '#06b6d4', icon: '🧫' },
  { id: 'arrow', name: 'Arrow信息悖论', nameEn: "Arrow's Information Paradox", author: 'Kenneth Arrow', year: '1962', category: 'classical', summary: '技术买卖中的核心矛盾：买方需要了解技术才能评估价值，但了解后就不需要买了。盲盒评估是解决此悖论的方案。', relevance: 'TT-OPC平台的盲盒评估模块直接解决此问题——不泄露核心技术就能展示价值。', color: '#ef4444', icon: '📦' },
  { id: 'coase', name: 'Coase交易成本', nameEn: 'Coase Transaction Cost', author: 'Ronald Coase', year: '1937', category: 'classical', summary: '交易成本决定了企业的边界。当AI将交易成本降至接近零时，一人公司成为可能。', relevance: 'OPC模式的核心理论支撑——AI将搜索、评估、匹配、合同等交易成本大幅降低。', color: '#f59e0b', icon: '💰' },
  { id: 'schumpeter', name: '创造性破坏', nameEn: 'Creative Destruction', author: 'Schumpeter', year: '1942', category: 'classical', summary: '创新本质上是对旧有生产方式的破坏和替代。技术雷达模块帮助预测替代时机。', relevance: '技术雷达模块扫描技术生命周期，帮助OPC在"破坏"窗口期抓住机会。', color: '#10b981', icon: '🔄' },
  { id: 'triple', name: '三螺旋理论', nameEn: 'Triple Helix', author: 'Etzkowitz & Leydesdorff', year: '1995', category: 'classical', summary: '大学-产业-政府三方协同是创新生态的核心。三角色工作台将此理论产品化。', relevance: '三角色工作台（教授+CEO+律师）是三螺旋理论的AI实现——一人扮演三方。', color: '#6366f1', icon: '🧬' },
  { id: 'absorptive', name: '吸收能力理论', nameEn: 'Absorptive Capacity', author: 'Cohen & Levinthal', year: '1990', category: 'classical', summary: '企业识别、消化、应用外部知识的能力决定了技术转移的成功率。场景翻译降低吸收门槛。', relevance: '场景翻译模块将技术语言翻译为投资人/CEO/院长版，本质上是提升买方吸收能力。', color: '#ec4899', icon: '🔄' },
  { id: 'network', name: '网络效应', nameEn: 'Network Effects', author: 'Metcalfe', year: '1995', category: 'modern', summary: '网络的价值与用户数的平方成正比。社交传播交易模块利用网络效应扩大技术影响力。', relevance: 'SocialHub模块连接OPC社区，用户越多，匹配效率越高，形成正向飞轮。', color: '#14b8a6', icon: '🌐' },
  { id: 'fed', name: '联邦学习经济学', nameEn: 'Federated Learning Economics', author: 'McMahan et al.', year: '2017', category: 'modern', summary: '数据不动模型动——在保护隐私的前提下实现跨机构协作。联邦匹配模块的底层逻辑。', relevance: 'FedMatch模块让高校专利数据不出校就能匹配需求方，是联邦学习在技术转移的应用。', color: '#8b5cf6', icon: '🔗' },
  { id: 'us-ai', name: '美国AI政策框架（2026）', nameEn: 'US National AI Policy Framework', author: 'NSTC', year: '2026', category: 'policy', summary: '联邦数据集以AI-ready格式开放，能源部应用此机制使新材料研发周期缩短40%。', relevance: '借鉴此框架，苏州可建立技术供需信息标准化格式，打通"数据孤岛"。', color: '#f59e0b', icon: '🇺🇸' },
  { id: 'g60', name: '长三角G60科创走廊', nameEn: 'G60 S&T Innovation Corridor', author: '三省一市', year: '2016-', category: 'regional', summary: '跨区域协同创新载体，九城市联运，推动创新资源跨区域流动。', relevance: '苏州作为G60核心城市，可依托此机制承接上海技术溢出。', color: '#ef4444', icon: '🌐' },
]

export const CASES: Case[] = [
  { id: 'opc-agent', name: 'OPC×Agent超级个体挑战赛', type: 'academic', tags: ['OPC×Agent', '百度千帆', '130人决赛'], description: '2026年4月24日，西交利物浦大学联合百度集团举办第二届OPC×Agent超级个体挑战赛，130余名选手参赛，11组进入决赛。', outcomes: ['西浦副校长丁忆民博士亲临颁奖典礼', '验证"AI Agent+OPC"模式可行性'], votes: 52, featured: true, year: 2026, institution: '西交利物浦大学 × 百度集团', icon: '🏆' },
  { id: 'embodied', name: '苏州具身智能机器人产业生态大会', type: 'industry', tags: ['具身智能', 'A股3.64万亿'], description: '2026年4月27日发布10台新具身智能机器人，A股总市值3.64万亿元（同比增长114%）。', outcomes: ['机器人核心产业产值同比增长超50%', '东山精密市值3420亿元'], votes: 41, featured: true, year: 2026, institution: '苏州市', icon: '🤖' },
  { id: 'xjtlu', name: '西浦AI融创工坊', type: 'academic', tags: ['AI+工科教育', '联邦学习FL'], description: '西浦AI融创工坊探索"企业出题-学员提案-原型制造-成果认证"模式。', outcomes: ['四位一体教学体系', '联邦学习框架R²=99.17%'], votes: 47, featured: true, year: 2025, institution: '西交利物浦大学', icon: '🎓' },
  { id: 'robokem', name: 'RoboChem-Flex无人实验室', type: 'industry', tags: ['自动化实验', '贝叶斯优化'], description: '仅需5000美元建成自动化实验平台，实验次数压缩60%以上。', outcomes: ['5000美元/台低成本部署', 'Nature Chemical Biology 2025'], votes: 35, featured: false, year: 2025, institution: '阿姆斯特丹大学', icon: '🧪' },
  { id: 'gusulab', name: '姑苏实验室', type: 'academic', tags: ['新型研发机构', '揭榜挂帅'], description: '苏州市财政投入200亿元，攻克多项"卡脖子"难题。', outcomes: ['揭榜挂帅41项需求，总投入50亿元'], votes: 29, featured: false, year: 2020, institution: '苏州市', icon: '🏛️' },
  { id: 'biobay', name: 'BioBAY生物医药产业园', type: 'industry', tags: ['生物医药', '1655亿产值'], description: '集聚生物医药企业超2000家，2024年产值达1655亿元。', outcomes: ['全国生物医药产业园区前三'], votes: 38, featured: false, year: 2006, institution: '苏州工业园区', icon: '💊' },
]

export const INTLCASES: IntlCase[] = [
  { country: '美国', name: '波士顿肯德尔广场', model: '政府-产业-大学三螺旋', keyPoints: ['MIT TLO专业化技术转移', 'AI评估系统分析技术成熟度'], metrics: [{ label: '年度技术转移合同', value: '2.6亿美元' }, { label: '专利许可数', value: '1000+/年' }], color: '#1d4ed8' },
  { country: '德国', name: '巴登-符腾堡州', model: '弗劳恩霍夫中试模式', keyPoints: ['弗劳恩霍夫协会连接基础研究与产业', '中试项目成功率>85%'], metrics: [{ label: '年度预算', value: '30亿欧元' }, { label: '中试成功率', value: '>85%' }], color: '#15803d' },
  { country: '全球', name: '研究三角园 (RTP)', model: '大学-产业-政府协同', keyPoints: ['杜克+UNC+NC State三校协同', '3300+项专利积累'], metrics: [{ label: '年均研发投入', value: '>20亿美元' }, { label: '孵化器', value: '30+家' }], color: '#7c3aed' },
  { country: '中国', name: '松山湖材料实验室', model: '创新样板工厂', keyPoints: ['中试成功后直接产业化', '政府+科学家+企业家共治'], metrics: [{ label: '入驻团队', value: '50+个' }, { label: '产业化率', value: '>40%' }], color: '#dc2626' },
]

export const BOTTLENECKS = [
  { name: '创新链脱节', score: 72, color: '#ef4444', desc: '科研立项与市场需求严重脱节' },
  { name: '中试环节薄弱', score: 65, color: '#f59e0b', desc: '缺乏专业中试平台' },
  { name: '评价体系单一', score: 58, color: '#eab308', desc: '论文导向的评价体系' },
  { name: '金融支持不足', score: 55, color: '#84cc16', desc: '成果转化早期融资困难' },
  { name: '服务链条断裂', score: 48, color: '#22c55e', desc: '技术转移机构能力分散' },
]

export const TT_MODULES: ModuleInfo[] = [
  { id: 'blindbox', name: '盲盒评估', nameEn: 'TechBlindBox', icon: '📦', theory: 'Arrow信息悖论', desc: '不泄露技术就能评估价值——解决技术买卖中的核心矛盾', color: '#ef4444' },
  { id: 'fedmatch', name: '联邦匹配', nameEn: 'FedMatch', icon: '🔗', theory: '联邦学习经济学', desc: '跨校专利数据不出校就能匹配需求方', color: '#8b5cf6' },
  { id: 'knowledge', name: '知识图谱', nameEn: 'KnowledgeFlow', icon: '🌐', theory: '内生增长理论', desc: '可视化知识从论文到产品的流动路径', color: '#3b82f6' },
  { id: 'radar', name: '技术雷达', nameEn: 'TechRadar', icon: '📡', theory: '创造性破坏', desc: '预测技术生命周期和替代时机', color: '#10b981' },
  { id: 'translator', name: '场景翻译', nameEn: 'TechTranslator', icon: '🔄', theory: '吸收能力理论', desc: '一键生成投资人/CEO/院长版技术描述', color: '#ec4899' },
  { id: 'triple', name: '三角色工作台', nameEn: 'TripleHelix', icon: '🧬', theory: '三螺旋理论', desc: '教授+CEO+律师三Agent协同分析', color: '#6366f1' },
  { id: 'social', name: '社交传播交易', nameEn: 'SocialHub', icon: '🌐', theory: '网络效应+双边市场', desc: '社交+传播+交易一体化', color: '#14b8a6' },
  { id: 'thermo', name: '创新温度计', nameEn: 'InnovationThermo', icon: '🌡️', theory: 'GPT渗透+新质生产力', desc: '实时测量AI渗透率', color: '#f59e0b' },
]

export const HW_MODULES: ModuleInfo[] = [
  { id: 'hw-eval', name: '硬件评估', nameEn: 'HWEval', icon: '📊', theory: '芯片Benchmark', desc: '芯片适配+BOM成本+国产化率', color: '#0984e3' },
  { id: 'supply', name: '供应链图谱', nameEn: 'SupplyChain', icon: '🔗', theory: '产业链协同', desc: '算法→芯片→ODM→认证全链路', color: '#6c5ce7' },
  { id: 'hw-translate', name: '硬件翻译', nameEn: 'HWTranslator', icon: '🔄', theory: '吸收能力', desc: '硬件规格书→4个专业版本', color: '#e17055' },
  { id: 'quad', name: '四角色工作台', nameEn: 'QuadHelix', icon: '🧬', theory: '四螺旋', desc: '算法专家+硬件PM+供应链+认证', color: '#00b894' },
  { id: 'hw-radar', name: '硬件雷达', nameEn: 'HWRadar', icon: '📡', theory: '技术预测', desc: '芯片路线图+国产替代进度', color: '#fdcb6e' },
  { id: 'cert', name: '认证导航', nameEn: 'CertNav', icon: '📋', theory: '合规管理', desc: '3C/SRRC/算法备案全流程', color: '#d63031' },
  { id: 'proto', name: '打样工坊', nameEn: 'Prototyping', icon: '🏭', theory: '敏捷开发', desc: 'EVT→DVT→PVT→MP全流程', color: '#00cec9' },
  { id: 'social-trade', name: '社交交易', nameEn: 'SocialTrade', icon: '🌐', theory: '网络效应', desc: '硬件开发者社区+供应链对接', color: '#e84393' },
]

export const RECOMMENDATIONS = [
  { icon: '🏛️', title: '强化顶层设计', color: '#3b82f6', points: ['将AI+OPC融合纳入苏州市人工智能+城市行动计划', '完善科技成果转化相关政策'] },
  { icon: '🤖', title: 'AI+OPC平台建设', color: '#8b5cf6', points: ['以开源tt_opc_platform为技术底座', '建设技术供需信息标准化格式'] },
  { icon: '🎓', title: 'AI融创工坊育才', color: '#10b981', points: ['深化"企业出题-学员提案-原型制造-成果认证"模式', '每年培养复合型技术转移人才300人'] },
  { icon: '🔒', title: '数据安全与隐私计算', color: '#06b6d4', points: ['联邦学习解决企业配方数据隐私', '数据完全自主可控'] },
  { icon: '🌏', title: '产学研协同', color: '#ef4444', points: ['依托G60科创走廊承接上海技术溢出', '借鉴波士顿三螺旋模式'] },
]

// ─── API 基础配置 ───
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
