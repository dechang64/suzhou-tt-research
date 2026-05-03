export interface Theory { id: string; name: string; nameEn: string; author: string; year: string; category: string; summary: string; relevance: string; color: string; icon: string }
export interface Case { id: string; name: string; type: string; tags: string[]; description: string; outcomes: string[]; votes: number; featured: boolean; year: number; institution: string; icon?: string }
export interface IntlCase { country: string; name: string; model: string; keyPoints: string[]; metrics: { label: string; value: string }[]; color: string }

export const THEORIES: Theory[] = [
  { id: 'solow', name: 'Solow增长模型', nameEn: 'Solow Growth Model', author: 'Robert Solow', year: '1957', category: 'classical', summary: '技术进步是经济增长的核心驱动力，占总产出增长的约2/3，为科技成果转化与经济发展的关联性提供了核心理论框架。', relevance: '苏州R&D占GDP 4.2%以上（2025年），距深圳5.8%、北京6.39%仍有追赶空间，Solow模型揭示了研发投入对经济增长的直接贡献。', color: '#3b82f6', icon: '📈' },
  { id: 'romer', name: '内生增长理论', nameEn: 'Endogenous Growth Theory', author: 'Romer', year: '1990', category: 'classical', summary: '知识溢出与人力资本是技术转移和创新的核心驱动力，创新主体的协同互动是提升成果转化效率的重要支撑。', relevance: '苏州规上工业企业研发机构建有率超80%，创新联合体235家，知识溢出效应正在形成。', color: '#8b5cf6', icon: '💡' },
  { id: 'stokes', name: '巴斯德象限', nameEn: "Stokes' Pasteur's Quadrant", author: 'Stokes', year: '1997', category: 'classical', summary: '基础研究与应用研究协同发展，打破了传统"基础研究与产业化脱节"的认知，为新型研发机构建设提供理论指引。', relevance: '姑苏实验室既做基础研究又做产业应用，正是巴斯德象限的典型实践。', color: '#06b6d4', icon: '🧫' },
  { id: 'us-ai', name: '美国AI政策框架（2026）', nameEn: 'US National AI Policy Framework', author: 'NSTC', year: '2026', category: 'policy', summary: '联邦数据集以AI-ready格式开放，能源部应用此机制使新材料研发周期缩短40%，是AI赋能科技成果转化的重要制度参照。', relevance: '借鉴此框架，苏州可建立技术供需信息标准化格式，打通"数据孤岛"，推动供需精准对接。', color: '#f59e0b', icon: '🇺🇸' },
  { id: 'g60', name: '长三角G60科创走廊', nameEn: 'G60 S&T Innovation Corridor', author: '三省一市', year: '2016-', category: 'regional', summary: '跨区域协同创新载体，九城市联运，推动创新资源跨区域流动，实现科技成果的跨区域转化。', relevance: '苏州作为G60核心城市，可依托此机制承接上海技术溢出，与无锡、杭州形成产业协同。', color: '#ef4444', icon: '🌐' },
  { id: 'bayesian', name: '贝叶斯优化', nameEn: 'Bayesian Optimization', author: '多领域应用', year: '2020s', category: 'modern', summary: '在稀缺数据场景下，贝叶斯优化可将实验次数压缩60%以上，是AI赋能研发的核心算法。', relevance: 'RoboChem-Flex（Nature Chemical Biology, 2025）验证：仅5000美元建成自动化实验平台，实验次数压缩60%。', color: '#10b981', icon: '🤖' },
  { id: 'pol42', name: '中共中央政治局4.28会议', nameEn: 'Politburo Meeting Apr 28 2026', author: '中共中央政治局', year: '2026', category: 'policy', summary: '2026年4月28日召开，强调要"全面实施人工智能+行动，推动科技自立自强、产业链自主可控"——这是AI+科技成果转化融合的最高层政策背书。', relevance: '政治局会议信号与本报告AI+OPC主线高度契合，苏州应率先作为"全面实施人工智能+行动"试点城市，将AI+OPC融合路径纳入市级战略。', color: '#dc2626', icon: '🏛️' },
]

export const CASES: Case[] = [
  { id: 'opc-agent', name: 'OPC×Agent超级个体挑战赛', type: 'academic', tags: ['OPC×Agent', '百度千帆', '130人决赛', 'AI人才培育', '全国知识产权宣传周'], description: '2026年4月24日，西交利物浦大学人工智能学院联合百度集团举办"第二届OPC×Agent超级个体挑战赛"，以"重构技术转移"为赛题，130余名选手参赛、11组进入决赛，西浦学子在百度千帆Agent平台完成技术转移全流程实战——理解技术原理、判断应用场景、匹配潜在企业、设计商业化路径，化身"一人公司"创始人。', outcomes: ['西浦副校长丁忆民博士亲临颁奖典礼', '人工智能学院院长林永义教授高度认可学生探索精神', '验证"AI Agent+OPC"模式在技术转移人才培养中的可行性'], votes: 52, featured: true, year: 2026, institution: '西交利物浦大学 × 百度集团', icon: '🏆' },
  { id: 'embodied', name: '苏州具身智能机器人产业生态大会', type: 'industry', tags: ['具身智能', '机器人', 'A股3.64万亿', '产业生态', '全国前三'], description: '2026年4月27日，"2026苏州具身智能机器人产业生态大会"发布10台新具身智能机器人（数量是去年的两倍）、十大新场景，标志着苏州具身智能机器人产业从"预告登场"进入"全面争霸"阶段。A股总市值3.64万亿元（同比增长114%），东山精密市值3420亿元（涨幅超6倍）。', outcomes: ['机器人核心产业产值同比增长超50%', 'A股总市值3.64万亿元（全国第四）', '东山精密市值3420亿元（涨幅超6倍）'], votes: 41, featured: true, year: 2026, institution: '苏州市 + 绿的谐波/科沃斯/追觅/东山精密等', icon: '🤖' },
  { id: 'xjtlu', name: '西浦AI融创工坊', type: 'academic', tags: ['AI+工科教育', '企业出题-学员提案', '原型制造', '百度千帆', '联邦学习FL'], description: '西交利物浦大学AI融创工坊已率先探索"企业出题-学员提案-原型制造-成果认证"模式：企业提出真实技术需求，学员在西浦完成Proposal设计与原型制造，成果经企业评审后直接进入产业化通道。配套百度千帆私有化AI Agent平台和电子设计实验室。', outcomes: ['四位一体教学体系', '联邦学习organoid-fl框架（R²=99.17%）已验证', '课程覆盖AMR+机械臂+CNC+3D打印+视觉五大单元'], votes: 47, featured: true, year: 2025, institution: '西交利物浦大学', icon: '🎓' },
  { id: 'robokem', name: 'RoboChem-Flex无人实验室', type: 'industry', tags: ['自动化实验', '贝叶斯优化', '催化剂', '开源硬件'], description: '荷兰阿姆斯特丹大学Timothy Noel团队验证：仅需5000美元建成完整的自动化实验平台（3D打印+Arduino+贝叶斯优化引擎RoBrains），可自主完成催化剂配方探索全流程，实验次数压缩60%以上。', outcomes: ['5000美元/台低成本部署', '实验次数压缩60%以上', 'Nature Chemical Biology发表（2025）'], votes: 35, featured: false, year: 2025, institution: '阿姆斯特丹大学', icon: '🧪' },
  { id: 'gusulab', name: '姑苏实验室', type: 'academic', tags: ['新型研发机构', '材料科学', '揭榜挂帅', '中试平台'], description: '苏州市财政投入200亿元（10年），联合华为、中芯国际等龙头企业，在第三代半导体、先进碳材料等领域攻克多项"卡脖子"难题。实施"揭榜挂帅"机制，发布41项需求榜单，总投入超50亿元。', outcomes: ['攻克多项"卡脖子"技术', '揭榜挂帅41项需求，总投入50亿元'], votes: 29, featured: false, year: 2020, institution: '苏州市 / 江苏省', icon: '🏛️' },
  { id: 'biobay', name: 'BioBAY生物医药产业园', type: 'industry', tags: ['生物医药', '产业集群', '上市公司', '1655亿产值'], description: '苏州工业园区BioBAY已集聚生物医药及大健康企业超2000家，2024年产值达1655亿元，信达生物、百济神州等创新型药企相继上市。', outcomes: ['2000+家企业集聚', '2024年产值1655亿元', '全国生物医药产业园区前三'], votes: 38, featured: false, year: 2006, institution: '苏州工业园区', icon: '💊' },
  { id: 'songshanhu', name: '松山湖材料实验室', type: 'academic', tags: ['新型研发机构', '中试平台', '创新样板工厂', '全链条转化'], description: '广东省首批省实验室之一，探索"创新样板工厂"模式，科研团队带成果入驻，中试成功后直接对接产业，构建"研发-中试-产业化"完整链条。', outcomes: ['中试成功后直接产业化', '治理结构可全国复制'], votes: 24, featured: false, year: 2018, institution: '广东省 / 东莞市', icon: '🏗️' },
  { id: 'qianfan', name: '百度千帆私有化AI Agent平台', type: 'industry', tags: ['AI Agent', '私有化部署', '企业AI大脑', '百度', '数据安全'], description: '百度千帆App Builder企业版支持私有化部署，数据完全自主可控，可接入企业私有知识库构建专属AI大脑，已在西浦完成私有化部署。', outcomes: ['数据完全自主可控', '已支持西浦课程体系', 'OPC×Agent大赛技术平台底座'], votes: 31, featured: false, year: 2024, institution: '百度集团 × 西交利物浦大学', icon: '🔧' },
]

export const INTLCASES: IntlCase[] = [
  { country: '美国', name: '波士顿肯德尔广场', model: '政府-产业-大学三螺旋', keyPoints: ['MIT TLO专业化技术转移办公室', 'AI评估系统分析技术成熟度与市场需求', '市场化运作成效显著', '监管沙盒机制强化技术转移效能'], metrics: [{ label: '年度技术转移合同', value: '2.6亿美元' }, { label: '专利许可数', value: '1000+/年' }], color: '#1d4ed8' },
  { country: '德国', name: '巴登-符腾堡州', model: '弗劳恩霍夫中试模式', keyPoints: ['弗劳恩霍夫协会连接基础研究与产业应用', '产业集群知识溢出效应显著', '"双元制"中试人才培养体系'], metrics: [{ label: '弗劳恩霍夫年度预算', value: '30亿欧元' }, { label: '中试项目成功率', value: '>85%' }], color: '#15803d' },
  { country: '全球', name: '研究三角园 (RTP)', model: '大学-产业-政府协同生态', keyPoints: ['杜克+UNC+NC State三校协同', '生命科学45%+信息技术高度集聚', '3300+项专利积累'], metrics: [{ label: '年均研发投入', value: '>20亿美元' }, { label: '孵化器数量', value: '30+家' }], color: '#7c3aed' },
  { country: '中国', name: '松山湖材料实验室', model: '创新样板工厂模式', keyPoints: ['科研团队带成果入驻，中试成功后直接产业化', '政府+科学家+企业家共治', '广东省已成立首批7家省实验室'], metrics: [{ label: '入驻团队', value: '50+个' }, { label: '产业化率', value: '>40%' }], color: '#dc2626' },
]

export const BOTTLENECKS = [
  { name: '创新链脱节', score: 72, color: '#ef4444', desc: '科研立项与市场需求严重脱节，成果转化链条梗阻' },
  { name: '中试环节薄弱', score: 65, color: '#f59e0b', desc: '缺乏专业中试平台，成果难以跨越"死亡谷"' },
  { name: '评价体系单一', score: 58, color: '#eab308', desc: '论文导向的评价体系难以衡量产业应用价值' },
  { name: '金融支持不足', score: 55, color: '#84cc16', desc: '成果转化早期融资困难，风险资本介入不足' },
  { name: '服务链条断裂', score: 48, color: '#22c55e', desc: '技术转移机构能力分散，缺乏全流程服务' },
]

export const RECOMMENDATIONS = [
  { icon: '🏛️', title: '强化顶层设计', color: '#3b82f6', points: ['将AI+OPC融合纳入苏州市人工智能+城市行动计划（2025-2026）', '完善科技成果转化相关政策，重点优化中试平台、OPC扶持、金融支持政策', '借鉴湖北省、内蒙古自治区经验，强化政策针对性与可操作性'] },
  { icon: '🤖', title: 'AI+OPC平台建设', color: '#8b5cf6', points: ['依托百度千帆私有化平台，建设AI驱动科技成果转化全流程智能平台', '以开源tt_opc_platform为技术底座，率先开展AI+OPC技术转移专项试点', '建设技术供需信息标准化格式，打通"数据孤岛"'] },
  { icon: '🎓', title: 'AI融创工坊育才', color: '#10b981', points: ['依托西浦AI融创工坊，深化"企业出题-学员提案-原型制造-成果认证"新模式', '每年培养复合型技术转移人才300人，到2027年底累计超900人', '推动高校与百度等行业龙头联合培养AI+OPC复合型人才'] },
  { icon: '🏭', title: '机构能级提升', color: '#f59e0b', points: ['培育年营收超亿元的技术服务机构20家以上', '以市场竞争而非行政手段推动机构整体能级跃升'] },
  { icon: '🔒', title: '数据安全与隐私计算', color: '#06b6d4', points: ['以联邦学习（FL）解决企业配方数据隐私问题，实现"数据不动，模型进步"', '百度千帆私有化部署，数据完全自主可控'] },
  { icon: '🌏', title: '产学研协同', color: '#ef4444', points: ['依托G60科创走廊，承接上海技术溢出，与无锡、杭州形成产业协同', '借鉴波士顿三螺旋模式，强化MIT TLO式专业化技术转移机构建设'] },
]
