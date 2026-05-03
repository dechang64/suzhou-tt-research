import { useState } from 'react'
import './App.css'

const ORANGE = '#e8521a'
const GREEN = '#16a34a'
const ACCENT = '#c9a227'

// ─── Data ───
const BOOK_CHAPTERS = [
  { num: '01', title: 'OPC 模式认知框架', desc: 'OPC 定义、运作机制、与传统模式的本质区别，一人公司创业者的核心能力模型。' },
  { num: '02', title: 'AI 工具全流程应用', desc: 'ChatGPT、Claude 等大模型在市场分析、技术评估、商业决策中的具体应用流程与效率数据。' },
  { num: '03', title: '技术转移成功案例', desc: '真实案例分析、踩坑记录与经验提炼，覆盖生物医药、新材料、信息技术三大领域。' },
  { num: '04', title: '法律合规与知识产权', desc: '公司注册、税务合规、知识产权归属、数据安全、合同风险等法律问题详解。' },
  { num: '05', title: '可持续发展路径', desc: '长期运营策略、行业趋势展望、未来机会分析。' },
  { num: '06', title: '运营实操与工具推荐', desc: '日常运营流程、工具链搭建、效率优化，含 TT-OPC 智能运营平台（v0.3）操作指南。' },
  { num: '07', title: '创业者能力培养', desc: '从新手到高手的学习路径、核心能力模型、成长阶梯。' },
  { num: '08', title: '全球化发展策略', desc: '跨境技术转移、国际市场进入、全球化运营实战。' },
  { num: '09', title: '系统优化方法论', desc: '运营体系诊断、持续改进机制、系统化升级路径。' },
]

// TT-OPC 智能运营平台 v0.3 — 8大工具模块（来自 tt_opc_platform 仓库）
const TOOLS = [
  {
    icon: '📦', bg: '#ebf8ff', accent: '#2b6cb0',
    name: '盲盒评估 TechBlindBox',
    theory: 'Arrow 信息悖论',
    desc: '在不泄露技术细节的前提下评估技术价值——基于信息不对称理论设计，保护卖方核心know-how同时让买方了解价值。',
    cmd: 'streamlit run pages/blindbox.py',
    tags: ['技术评估', '信息不对称', '买卖双方'],
  },
  {
    icon: '🔗', bg: '#f0fff4', accent: '#16a34a',
    name: '联邦匹配 FedMatch',
    theory: '联邦学习经济学',
    desc: '跨校专利数据不出校门就能匹配——高校 A 的专利特征与高校 B 的需求方数据加密对齐，找出最优匹配。',
    cmd: 'streamlit run pages/fedmatch.py',
    tags: ['联邦学习', '隐私计算', '专利匹配'],
  },
  {
    icon: '🌐', bg: '#fffaf0', accent: '#dd6b20',
    name: '知识图谱 KnowledgeFlow',
    theory: '内生增长理论',
    desc: '可视化知识从论文到产品的流动路径——追踪技术在学术圈→企业界→市场的迁移轨迹与时间节点。',
    cmd: 'streamlit run pages/knowledge_flow.py',
    tags: ['知识图谱', '技术演化', '创新路径'],
  },
  {
    icon: '📡', bg: '#faf5ff', accent: '#6b46c1',
    name: '技术雷达 TechRadar',
    theory: '创造性破坏理论',
    desc: '预测技术生命周期与替代时机——基于技术成熟度曲线，判断当前技术所处阶段及替代技术出现的时间窗口。',
    cmd: 'streamlit run pages/tech_radar.py',
    tags: ['技术预测', '生命周期', '替代时机'],
  },
  {
    icon: '🔄', bg: '#fff1f2', accent: '#e11d48',
    name: '场景翻译 TechTranslator',
    theory: '吸收能力理论',
    desc: '一键生成投资人版 / CEO版 / 院长版——同一技术根据不同受众生成不同叙事方式，提升沟通效率。',
    cmd: 'streamlit run pages/tech_translator.py',
    tags: ['AI写作', '技术沟通', '多场景适配'],
  },
  {
    icon: '🧬', bg: '#e0f2fe', accent: '#0369a1',
    name: '三角色工作台 TripleHelix',
    theory: '三螺旋理论',
    desc: '教授 + CEO + 律师三 Agent 协同——同时模拟技术供给方、商业运营方、法律顾问三方视角，综合评估技术转移可行性。',
    cmd: 'streamlit run pages/triple_helix.py',
    tags: ['多Agent', '三螺旋', '协同决策'],
  },
  {
    icon: '🌐', bg: '#f0fdf4', accent: '#15803d',
    name: '社交传播交易 SocialHub',
    theory: '网络效应 + 双边市场',
    desc: '技术持有者与需求方在同一平台发布信息，系统智能匹配并记录供需双方信誉，构建技术转移双边市场。',
    cmd: 'streamlit run pages/social_hub.py',
    tags: ['双边市场', '供需匹配', '信誉系统'],
  },
  {
    icon: '🌡️', bg: '#fefce8', accent: '#ca8a04',
    name: '创新温度计 InnovationThermo',
    theory: 'GPT渗透率 + 新质生产力',
    desc: '实时测量 AI 在技术转移领域的渗透程度——追踪大模型在技术评估、合同生成、供需匹配等环节的实际使用率。',
    cmd: 'streamlit run pages/innovation_thermo.py',
    tags: ['AI渗透率', '创新指标', '新质生产力'],
  },
]

// ─── Components ───

function Nav({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  return (
    <div className="topbar">
      <div className="topbar-title">🧭 <span>成果转化</span>研究平台</div>
      <div className="topbar-nav">
        {[
          ['cover', '🏠', '首页'],
          ['hero', '📐', '社科联课题'],
          ['book', '📖', 'OPC书籍'],
          ['tools', '🛠️', '工具集'],
          ['intl', '🌏', '国际经验'],
        ].map(([id, icon, label]) => (
          <button key={id} className={`topbar-btn ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
            <span style={{ marginRight: 4 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
      <div className="topbar-actions">
        <div className="topbar-badge">J2025LX005</div>
        <button onClick={() => window.print()} className="print-btn">🖨️ 导出PDF</button>
      </div>
    </div>
  )
}

function Cover({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="cover">
      <div className="cover-bg" />
      <div className="cover-grid-overlay" />
      <div className="cover-content">
        <div className="cover-label">🏛 苏州市社科联 · 揭榜挂帅类课题 · J2025LX005</div>
        <h1 className="cover-title">苏州科技成果<br /><span className="gold">转移转化路径</span></h1>
        <p className="cover-subtitle">路径 · 机制 · 对策 · 工具 · 案例</p>
        <p className="cover-desc">基于AI技术与一人公司（OPC）模式协同创新的融合路径研究<br />社科联课题成果 · 西交利物浦大学人工智能学院</p>

        <div className="cover-leader">
          <div className="cover-leader-avatar">🎓</div>
          <div>
            <div className="cover-leader-name">徐德昌 教授</div>
            <div className="cover-leader-title">西交利物浦大学人工智能学院 · 副院长 · 课题组组长</div>
          </div>
        </div>

        <div className="cover-stats">
          {[
            { v: '1050', u: '亿元', l: '技术合同成交额', sub: '2024年 · 全省第一' },
            { v: '4.2', u: '%+', l: 'R&D占GDP', sub: '2025年目标' },
            { v: '1655', u: '亿元', l: 'BioBAY产值', sub: '2024年' },
            { v: '1600', u: '家', l: 'OPC注册总数', sub: '截至2026年4月' },
          ].map(x => (
            <div key={x.l} className="cover-stat">
              <div className="cover-stat-val">{x.v}<span className="unit">{x.u}</span></div>
              <div className="cover-stat-label">{x.l}</div>
              <div className="cover-stat-sub">{x.sub}</div>
            </div>
          ))}
        </div>

        <div className="cover-cta">
          <button className="btn-gold" onClick={() => setPage('hero')}>开始阅读课题报告 →</button>
          <button className="btn-outline" onClick={() => window.print()}>🖨️ 导出PDF</button>
        </div>

        <div className="cover-channels">
          <div className="channel-card" onClick={() => setPage('book')}>
            <div className="channel-icon">📖</div>
            <div className="channel-name">《OPC × AI 实战手册》</div>
            <div className="channel-desc">基于 ai-for-tt-opc 仓库 · 从认知框架到工具应用，覆盖法律合规、运营策略、技术转移全链路</div>
            <div className="channel-arrow">→ 阅读书籍章节 →</div>
          </div>
          <div className="channel-card" onClick={() => setPage('tools')}>
            <div className="channel-icon">🛠️</div>
            <div className="channel-name">TT-OPC 智能运营平台</div>
            <div className="channel-desc">基于 tt_opc_platform 仓库 · 8大工具模块 · 基于24个经济学理论设计 · 可本地运行</div>
            <div className="channel-arrow">→ 查看工具集 →</div>
          </div>
          <div className="channel-card" onClick={() => setPage('hero')}>
            <div className="channel-icon">📊</div>
            <div className="channel-name">社科联课题报告</div>
            <div className="channel-desc">AI+OPC融合路径 · 五大瓶颈量化诊断 · 六大对策建议 · 国际经验与启示</div>
            <div className="channel-arrow">→ 查看报告 →</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [activeTab, setActiveTab] = useState('theory')
  const tabs = [
    { id: 'theory', label: '📐 理论框架' },
    { id: 'bottleneck', label: '📊 五大瓶颈' },
    { id: 'path', label: '🛤️ 八条路径' },
    { id: 'mechanism', label: '⚙️ 五大机制' },
  ]
  return (
    <div className="page">
      <div className="stats-bar"><div className="page-content" style={{ padding: '0 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="hero-stats">
          {[
            { v: '1050', u: '亿元', l: '技术合同成交额', sub: '2024年 · 全省第一', c: ACCENT },
            { v: '4.2', u: '%+', l: 'R&D占GDP', sub: '2025年目标', c: GREEN },
            { v: '1655', u: '亿元', l: 'BioBAY产值', sub: '2024年', c: '#805ad5' },
            { v: '1600', u: '家', l: 'OPC总数', sub: '截至2026年4月', c: ORANGE },
          ].map(x => (
            <div key={x.l} className="hero-stat">
              <div className="count" style={{ color: x.c }}>{x.v}<span style={{ fontSize: '0.7rem', fontWeight: 400 }}>{x.u}</span></div>
              <div className="label">{x.l}</div>
              <div className="sub">{x.sub}</div>
            </div>
          ))}
        </div>
      </div></div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          <div style={{ background: 'linear-gradient(135deg, #dc262615, #991b1b08)', border: '1.5px solid #dc262640', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.82rem', marginBottom: 8 }}>🏛️ 政治局4.28会议 · 2026年4月28日</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.7 }}><strong>"全面实施人工智能+行动，推动科技自立自强、产业链自主可控"</strong>——最高层权威背书，为本报告AI+OPC融合路径提供政策依据。</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf615, #06b6d408)', border: '1.5px solid #8b5cf640', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontWeight: 700, color: '#805ad5', fontSize: '0.82rem', marginBottom: 8 }}>🏆 OPC×Agent挑战赛 · 2026年4月24日</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.7 }}>西交利物浦大学×百度集团，<strong>130+名选手、11组决赛</strong>，在百度千帆Agent平台完成技术转移全流程实战，化身"一人公司"创始人。</p>
          </div>
        </div>

        <div className="section-label">研究内容</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={`filter-btn ${activeTab === t.id ? 'active' : ''}`}>{t.label}</button>)}
        </div>

        {activeTab === 'theory' && (
          <div className="framework-grid">
            {[
              { icon: '📈', t: '理论基础', color: '#2b6cb0', items: ['Solow增长模型', '内生增长理论（Romer）', '巴斯德象限（Stokes）', '贝叶斯优化', '政治局4.28信号'] },
              { icon: '🤖', t: 'AI+OPC融合', color: '#805ad5', items: ['联邦学习FL（数据不动）', '私有化AI Agent', 'OPC×Agent实战', '产学研协同'] },
              { icon: '🌐', t: '国际经验', color: '#00a3c4', items: ['波士顿三螺旋', '德国弗劳恩霍夫', '研究三角园RTP', 'G60科创走廊'] },
              { icon: '🛤️', t: '路径设计', color: ORANGE, items: ['AI赋能8条路径', 'OPC推广6条路径', '需求导向机制', '市场化根本动力'] },
              { icon: '⚙️', t: '五大机制', color: GREEN, items: ['市场化需求牵引', '多元投入保障', '协同创新驱动', '评价激励机制'] },
              { icon: '🏛️', t: '政策框架', color: '#dc2626', items: ['国家技术转移体系', '苏州市AI+行动方案', 'OPC扶持政策', 'G60区域协同'] },
            ].map(f => (
              <div key={f.t} className="framework-card" style={{ borderTop: `3px solid ${f.color}` }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 10 }}><span>{f.icon}</span> {f.t}</div>
                {f.items.map(i => <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 6 }}>▸ {i}</div>)}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bottleneck' && (
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 18 }}>📉 五大瓶颈风险指数 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>（分值越高越紧迫，满分100）</span></div>
            {[
              { n: '创新链脱节', s: 72, c: '#e53e3e', d: '科研立项与市场需求严重脱节，成果转化链条梗阻' },
              { n: '中试环节薄弱', s: 65, c: ORANGE, d: '缺乏专业中试平台，成果难以跨越"死亡谷"' },
              { n: '评价体系单一', s: 58, c: '#eab308', d: '论文导向难以衡量产业应用价值' },
              { n: '金融支持不足', s: 55, c: GREEN, d: '成果转化早期融资困难，风险资本介入不足' },
              { n: '服务链条断裂', s: 48, c: '#2b6cb0', d: '技术转移机构能力分散，缺乏全流程服务' },
            ].map(b => (
              <div key={b.n} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{b.n}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: b.c }}>{b.s}/100</span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${b.s}%`, height: '100%', background: `linear-gradient(90deg, ${b.c}99, ${b.c})`, borderRadius: 6 }} />
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 4 }}>{b.d}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'path' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { n: '1', t: 'AI赋能OPC全流程', d: '数据分析、市场分析、技术评估、商业决策全由AI驱动', c: '#2b6cb0' },
              { n: '2', t: '联邦学习数据协作', d: '配方数据不出厂，梯度加密传输，数据安全与性能兼得', c: '#805ad5' },
              { n: '3', t: '贝叶斯优化实验', d: 'RoboChem-Flex模式：5000美元/台，实验次数压缩60%', c: GREEN },
              { n: '4', t: '私有化AI Agent', d: '百度千帆私有化部署，数据完全自主可控', c: ORANGE },
              { n: '5', t: 'OPC×Agent实战', d: '技术转移全流程实战，培养"一人公司"创始人能力', c: '#00a3c4' },
              { n: '6', t: 'AI融创工坊育才', d: '企业出题-学员提案-原型制造-成果认证', c: '#6b46c1' },
              { n: '7', t: '中试平台建设', d: '借鉴弗劳恩霍夫模式，建设专业中试平台跨越"死亡谷"', c: '#dc2626' },
              { n: '8', t: 'G60区域协同', d: '承接上海技术溢出，与无锡、杭州形成产业协同', c: '#ca8a04' },
            ].map(x => (
              <div key={x.n} style={{ display: 'flex', gap: 12, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: x.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{x.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>{x.t}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mechanism' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: '💰', t: '市场化需求牵引', color: GREEN, p: ['以企业真实需求拉动科技成果转化方向', '建立技术需求标准化采集与发布机制', 'AI匹配技术供需，降低搜索成本'] },
              { icon: '🏦', t: '多元投入保障', color: ORANGE, p: ['政府引导基金+社会资本+OPC自筹', 'G60区域技术转移联合投资基金', 'OPC早期融资绿色通道'] },
              { icon: '🤝', t: '协同创新驱动', color: '#805ad5', p: ['西浦+百度+企业三方联合创新', '联邦学习OPC联盟，数据不动模型动', '跨国技术转移绿色通道'] },
              { icon: '📋', t: '评价激励机制', color: '#2b6cb0', p: ['建立技术转移人才专项评价体系', 'AI+OPC贡献纳入科技成果奖励', '揭榜挂帅+赛马制激发创新'] },
              { icon: '🛡️', t: '数据安全与隐私计算', color: '#dc2626', p: ['联邦学习解决配方数据隐私问题', '百度千帆私有化部署', '建立技术转移数据合规标准'] },
            ].map(r => (
              <div key={r.t} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}><span style={{ fontSize: '1.3rem', marginRight: 6 }}>{r.icon}</span>{r.t}</div>
                {r.p.map(p => <div key={p} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6, display: 'flex', gap: 6 }}><span style={{ color: r.color, flexShrink: 0 }}>•</span>{p}</div>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookPage() {
  return (
    <div className="page">
      <div className="page-content">
        <div className="section-label">OPC × AI 实战手册</div>
        <h2 className="section-title">📖 书籍章节导航</h2>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 24 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            本书全称《<strong>AI赋能技术转移OPC运营实操</strong>》，基于西交利物浦大学AI融创工坊三年教学实践与苏州1600家OPC田野调查，覆盖<strong>认知框架、工具应用、法律合规、运营策略</strong>四大模块。
            已在 GitHub 开源（<strong>Dechang64 / ai-for-tt-opc</strong>），配套 TT-OPC 智能运营平台（v0.3）。
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <a href="https://github.com/Dechang64/ai-for-tt-opc" target="_blank" className="btn-primary">
              📂 GitHub: ai-for-tt-opc →
            </a>
          </div>
        </div>
        <div className="book-toc">
          {BOOK_CHAPTERS.map(ch => (
            <div key={ch.num} className="book-chapter">
              <div className="book-ch-num">{ch.num}</div>
              <div>
                <div className="book-ch-title">{ch.title}</div>
                <div className="book-ch-desc">{ch.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolsPage() {
  return (
    <div className="page">
      <div className="page-content">
        <div className="section-label">TT-OPC 智能运营平台 v0.3</div>
        <h2 className="section-title">🛠️ 八大工具模块</h2>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 24 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            基于 <strong>24个经济学理论</strong>设计的 8 大使能功能，完整覆盖技术转移全链路。由 <strong>Dechang64 / tt_opc_platform</strong> 提供，开源免费，可本地运行。
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="https://github.com/Dechang64/tt_opc_platform" target="_blank" className="btn-primary">
              📂 GitHub: tt_opc_platform →
            </a>
            <div className="btn-primary" style={{ background: 'var(--text-secondary)', color: '#fff' }}>
              pip install streamlit · streamlit run app.py
            </div>
          </div>
        </div>
        <div className="tools-grid">
          {TOOLS.map(t => (
            <div key={t.name} className="tool-card" style={{ borderTop: `3px solid ${t.accent}` }}>
              <div className="tool-icon-wrap" style={{ background: t.bg }}>{t.icon}</div>
              <div className="tool-name">{t.name}</div>
              <div style={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, marginBottom: 8 }}>理论：{t.theory}</div>
              <div className="tool-desc">{t.desc}</div>
              <div className="tool-tags">
                {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
              <div className="tool-run-hint">{t.cmd}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IntlPage() {
  const items = [
    { name: '波士顿肯德尔广场', model: '政府-产业-大学三螺旋', color: '#1d4ed8', country: '美国',
      points: ['MIT TLO专业化技术转移办公室', 'AI评估系统分析技术成熟度', '市场化运作成效显著', '监管沙盒机制'],
      metrics: [{ l: '年度技术转移合同', v: '2.6亿美元' }, { l: '专利许可数', v: '1000+/年' }] },
    { name: '巴登-符腾堡州', model: '弗劳恩霍夫中试模式', color: '#15803d', country: '德国',
      points: ['弗劳恩霍夫协会连接基础与产业', '产业集群知识溢出效应显著', '"双元制"中试人才培养'],
      metrics: [{ l: '年度预算', v: '30亿欧元' }, { l: '中试成功率', v: '>85%' }] },
    { name: '研究三角园 (RTP)', model: '大学-产业-政府协同生态', color: '#7c3aed', country: '美国',
      points: ['杜克+UNC+NC State三校协同', '生命科学45%+信息技术集聚', '3300+项专利积累'],
      metrics: [{ l: '年均研发投入', v: '>20亿美元' }, { l: '孵化器数量', v: '30+家' }] },
    { name: '松山湖材料实验室', model: '创新样板工厂模式', color: '#dc2626', country: '中国',
      points: ['科研团队带成果入驻，中试后直接产业化', '政府+科学家+企业家共治', '广东省已成立首批7家省实验室'],
      metrics: [{ l: '入驻团队', v: '50+个' }, { l: '产业化率', v: '>40%' }] },
  ]
  return (
    <div className="page">
      <div className="page-content">
        <div className="section-label">国际经验</div>
        <h2 className="section-title">🌏 国际先进模式与启示</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 24 }}>
          {items.map(x => (
            <div key={x.name} className="card" style={{ borderTop: `4px solid ${x.color}` }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '1.4rem' }}>🌏</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{x.name}</div>
                  <div style={{ fontSize: '0.72rem', color: x.color, fontWeight: 600 }}>{x.model}</div>
                </div>
              </div>
              {x.points.map(p => <div key={p} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 5, paddingLeft: 6 }}>▸ {p}</div>)}
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {x.metrics.map(m => (
                  <div key={m.l} style={{ flex: 1, background: `${x.color}11`, borderRadius: 8, padding: '8px 12px', border: `1px solid ${x.color}33` }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.l}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: x.color }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: ACCENT, marginBottom: 14 }}>📌 对苏州的启示</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { from: '波士顿模式', to: '强化MIT TLO式专业化技术转移机构建设，引入AI评估系统' },
              { from: '弗劳恩霍夫', to: '建设专业中试平台，缩短实验室到产业化的周期' },
              { from: '研究三角园', to: '依托G60科创走廊，建立沪苏浙跨区域协同创新机制' },
              { from: '松山湖实验室', to: '借鉴"揭榜挂帅"机制，推动高校成果直接进入企业' },
            ].map(r => (
              <div key={r.from} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>▸</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{r.from}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.to}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="footer">
      <p><strong>苏州科技成果转移转化路径·机制·对策</strong> · 苏州市社科联揭榜挂帅类课题 · J2025LX005</p>
      <p style={{ marginTop: 6 }}>课题组组长：徐德昌 教授 | 西交利物浦大学人工智能学院</p>
      <p style={{ marginTop: 6 }}>📖 ai-for-tt-opc（书籍）| 🛠️ tt_opc_platform（工具集）· 已在 GitHub 开源 · Dechang64</p>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('cover')
  const pages: Record<string, React.ReactElement> = {
    cover: <Cover setPage={setPage} />,
    hero: <Hero />,
    book: <BookPage />,
    tools: <ToolsPage />,
    intl: <IntlPage />,
  }
  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      {pages[page] ?? pages.cover}
      <Footer />
    </div>
  )
}
