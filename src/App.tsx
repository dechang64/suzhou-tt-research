import { useState, useCallback } from 'react'
import './App.css'
import { TT_MODULES, HW_MODULES, API_BASE } from './data'
import type { BlindBoxResult, TripleHelixResult, HWEvalResult, QuadHelixResult } from './types'

const NAVY = '#1a365d'
const ORANGE = '#e8521a'
const GREEN = '#16a34a'
const ACCENT = '#c9a227'

// ─── API 调用 ───
async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ─── Loading Spinner ───
function Spinner() {
  return <div className="spinner"><div /><div /><div /></div>
}

// ─── 导航 ───
function Nav({ page, setPage, dark, setDark }: { page: string; setPage: (p: string) => void; dark: boolean; setDark: (d: boolean) => void }) {
  const groups = [
    { label: '首页', items: [{ id: 'cover', name: '🏠 首页' }] },
    { label: 'TT-OPC', items: TT_MODULES.map(m => ({ id: `tt-${m.id}`, name: `${m.icon} ${m.name}` })) },
    { label: 'HW-OPC', items: HW_MODULES.map(m => ({ id: `hw-${m.id}`, name: `${m.icon} ${m.name}` })) },
    { label: '研究', items: [{ id: 'book', name: '📖 理论框架' }, { id: 'intl', name: '🌏 国际案例' }] },
  ]
  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand" onClick={() => setPage('cover')}>
          <span style={{ fontSize: '1.2rem' }}>🚀</span>
          <span className="topbar-title">TT-OPC 智能运营平台</span>
        </div>
        <div className="topbar-links">
          {groups.map(g => (
            <div key={g.label} className="nav-group">
              <span className="nav-group-label">{g.label}</span>
              <div className="nav-dropdown">
                {g.items.map(i => (
                  <div key={i.id} className={`nav-item ${page === i.id ? 'active' : ''}`} onClick={() => setPage(i.id)}>
                    {i.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="dark-toggle" onClick={() => setDark(!dark)} title={dark ? '亮色模式' : '暗色模式'}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── 首页 ───
function Cover({ setPage }: { setPage: (p: string) => void }) {
  const stats = [
    { label: '经济学理论', value: '24', icon: '📚' },
    { label: 'TT-OPC 模块', value: '8', icon: '🛠️' },
    { label: 'HW-OPC 模块', value: '9', icon: '🔧' },
    { label: '开源协议', value: 'MIT', icon: '📜' },
  ]
  return (
    <div className="page-content">
      <div className="hero-section">
        <div className="hero-badge">v0.3 · MIT 开源</div>
        <h1 className="hero-title">TT-OPC 智能运营平台</h1>
        <p className="hero-subtitle">用 AI 赋能技术转移，让一个人成为一支团队</p>
        <p className="hero-desc">基于 24 个经济学理论设计 · 8+9 大使能功能 · LLM 驱动</p>
        <div className="hero-stats">
          {stats.map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-icon">{s.icon}</span>
              <span className="hero-stat-val">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('tt-blindbox')}>📦 开始盲盒评估</button>
          <button className="btn-secondary" onClick={() => setPage('book')}>📖 理论框架</button>
        </div>
      </div>

      <h2 className="section-title">TT-OPC 八大使能功能</h2>
      <div className="module-grid">
        {TT_MODULES.map(m => (
          <div key={m.id} className="module-card" style={{ borderTopColor: m.color }} onClick={() => setPage(`tt-${m.id}`)}>
            <div className="module-icon">{m.icon}</div>
            <div className="module-name">{m.name}</div>
            <div className="module-name-en">{m.nameEn}</div>
            <div className="module-theory" style={{ color: m.color }}>{m.theory}</div>
            <div className="module-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">HW-OPC 九大深度模块</h2>
      <div className="module-grid">
        {HW_MODULES.map(m => (
          <div key={m.id} className="module-card" style={{ borderTopColor: m.color }} onClick={() => setPage(`hw-${m.id}`)}>
            <div className="module-icon">{m.icon}</div>
            <div className="module-name">{m.name}</div>
            <div className="module-name-en">{m.nameEn}</div>
            <div className="module-theory" style={{ color: m.color }}>{m.theory}</div>
            <div className="module-desc">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 盲盒评估 ───
function BlindBoxPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BlindBoxResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<BlindBoxResult>('/api/blindbox', {
        tech_name: fd.get('tech_name'),
        tech_field: fd.get('tech_field'),
        tech_description: fd.get('tech_description'),
        trl_level: fd.get('trl_level'),
      })
      setResult(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)` }}>
        <h1>📦 盲盒评估 TechBlindBox</h1>
        <p>Arrow 信息悖论：不泄露技术就能评估价值</p>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>技术名称 *</label>
            <input name="tech_name" required placeholder="例：基于联邦学习的隐私保护推荐系统" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>技术领域</label>
              <input name="tech_field" placeholder="例：人工智能/隐私计算" />
            </div>
            <div className="form-group">
              <label>成熟度</label>
              <select name="trl_level">
                <option value="TRL1">TRL1 基础研究</option>
                <option value="TRL2">TRL2 概念验证</option>
                <option value="TRL3">TRL3 实验验证</option>
                <option value="TRL4" selected>TRL4 实验室验证</option>
                <option value="TRL5">TRL5 仿真验证</option>
                <option value="TRL6">TRL6 原型验证</option>
                <option value="TRL7">TRL7 环境验证</option>
                <option value="TRL8">TRL8 系统完成</option>
                <option value="TRL9">TRL9 实际运行</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>技术描述</label>
            <textarea name="tech_description" rows={4} placeholder="简要描述核心技术、创新点、应用场景..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🔍 评估中...' : '🔍 开始盲盒评估'}
          </button>
        </form>

        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}

        {result && !result.raw && (
          <div className="result-card">
            <div className="result-header">
              <h2>{result.name}</h2>
              <div className="score-circle" style={{ '--score': result.score } as React.CSSProperties}>
                <span className="score-val">{result.score}</span>
                <span className="score-label">综合评分</span>
              </div>
            </div>
            <div className="result-meta">
              <span className="tag">{result.trl}</span>
              <span className="tag">{result.market_size}</span>
              <span className="tag">{result.competition_level}竞争</span>
              <span className="tag">{result.risk_level}风险</span>
              <span className="tag">{result.time_to_market}</span>
            </div>
            <div className="swot-grid">
              <div className="swot strengths">
                <h4>✅ 优势</h4>
                <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="swot weaknesses">
                <h4>⚠️ 劣势</h4>
                <ul>{result.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="swot opportunities">
                <h4>🌈 机会</h4>
                <ul>{result.opportunities.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="swot threats">
                <h4>🔴 威胁</h4>
                <ul>{result.threats.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
            {result.suggestion && (
              <div className="suggestion-box">
                <h4>💡 转化建议</h4>
                <p>{result.suggestion}</p>
              </div>
            )}
          </div>
        )}
        {result?.raw && <div className="result-card"><pre>{result.raw}</pre></div>}
      </div>
    </div>
  )
}

// ─── 场景翻译 ───
function TranslatorPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<Record<string, string>>('/api/tech-translate', {
        tech_name: fd.get('tech_name'),
        tech_description: fd.get('tech_description'),
        versions: ['投资人版', 'CEO版', '院长版'],
      })
      setResults(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const icons: Record<string, string> = { '投资人版': '💰', 'CEO版': '👔', '院长版': '🎓' }

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
        <h1>🔄 场景翻译 TechTranslator</h1>
        <p>吸收能力理论：一键生成投资人/CEO/院长版</p>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>技术名称 *</label>
            <input name="tech_name" required placeholder="例：基于HNSW的联邦语义检索引擎" />
          </div>
          <div className="form-group">
            <label>技术描述 *</label>
            <textarea name="tech_description" required rows={5} placeholder="描述核心技术、创新点、应用场景..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🔄 翻译中...' : '🔄 开始场景翻译'}
          </button>
        </form>
        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}
        {results && (
          <div className="translate-results">
            {Object.entries(results).map(([ver, content]) => (
              <div key={ver} className="translate-card">
                <h3>{icons[ver] || '📄'} {ver}</h3>
                <div className="translate-content">{content}</div>
                <button className="btn-sm" onClick={() => navigator.clipboard.writeText(content)}>📋 复制</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 三角色工作台 ───
function TripleHelixPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TripleHelixResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<TripleHelixResult>('/api/triple-helix', {
        project_name: fd.get('project_name'),
        project_description: fd.get('project_description'),
      })
      setResults(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const roleIcons: Record<string, string> = { '教授': '🎓', 'CEO': '👔', '律师': '⚖️' }
  const roleColors: Record<string, string> = { '教授': '#3b82f6', 'CEO': '#10b981', '律师': '#f59e0b' }

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
        <h1>🧬 三角色工作台 TripleHelix</h1>
        <p>三螺旋理论：教授+CEO+律师三Agent协同分析</p>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>项目名称 *</label>
            <input name="project_name" required placeholder="例：联邦学习驱动的医疗影像诊断平台" />
          </div>
          <div className="form-group">
            <label>项目描述 *</label>
            <textarea name="project_description" required rows={5} placeholder="描述项目背景、核心技术、目标市场..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🧬 三角色分析中...' : '🧬 开始三角色分析'}
          </button>
        </form>
        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}
        {results && (
          <div className="helix-results">
            {Object.entries(results).map(([key, val]) => (
              <div key={key} className="helix-card" style={{ borderTopColor: roleColors[val.name] }}>
                <h3>{roleIcons[val.name] || '👤'} {val.name}</h3>
                <p>{val.analysis}</p>
              </div>
            ))}
            <div className="helix-summary">
              <h3>🧬 综合建议</h3>
              <p>三个角色的分析形成互补——教授确保技术"能做"，CEO确保"有人买单"，律师确保"合法合规"。</p>
              <p>建议按照"律师先行（合规确认）→ 教授跟进（技术优化）→ CEO收尾（商业落地）"的顺序推进。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 硬件评估 ───
function HWEvalPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HWEvalResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<HWEvalResult>('/api/hw-eval', {
        tech_name: fd.get('tech_name'),
        tech_description: fd.get('tech_description'),
        target_chip: fd.get('target_chip'),
      })
      setResult(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0984e3 0%, #0770c2 100%)' }}>
        <h1>📊 硬件评估 HWEval</h1>
        <p>芯片Benchmark + 算法适配 + BOM成本 + 国产化率</p>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>技术名称 *</label>
            <input name="tech_name" required placeholder="例：端侧AI语音识别模块" />
          </div>
          <div className="form-group">
            <label>目标芯片（可选）</label>
            <input name="target_chip" placeholder="例：RK3588 / 算能BM1684 / 自动推荐" />
          </div>
          <div className="form-group">
            <label>技术描述 *</label>
            <textarea name="tech_description" required rows={4} placeholder="描述算法、模型大小、算力需求..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '📊 评估中...' : '📊 开始硬件评估'}
          </button>
        </form>
        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}
        {result && !result.raw && (
          <div className="result-card">
            <h2>{result.name}</h2>
            <div className="hw-grid">
              <div className="hw-section">
                <h4>🔲 推荐芯片</h4>
                <p>{result.chip_benchmark.recommended}</p>
                <p>性能：{result.chip_benchmark.performance}</p>
                <p>功耗：{result.chip_benchmark.power}</p>
              </div>
              <div className="hw-section">
                <h4>🧮 算法适配</h4>
                <p>适配度：{result.algorithm_fit.score}/100</p>
                <p>瓶颈：{result.algorithm_fit.bottleneck}</p>
                <p>优化：{result.algorithm_fit.optimization}</p>
              </div>
              <div className="hw-section">
                <h4>💰 BOM成本</h4>
                <p>估算：{result.bom_cost.estimate}</p>
                {result.bom_cost.breakdown && Object.entries(result.bom_cost.breakdown).map(([k, v]) => (
                  <p key={k}>{k}：{v}</p>
                ))}
              </div>
              <div className="hw-section">
                <h4>🇨🇳 国产化率</h4>
                <div className="localization-bar">
                  <div className="localization-fill" style={{ width: `${result.localization_rate}%` }} />
                  <span>{result.localization_rate}%</span>
                </div>
                <p>风险：{result.risk_level}</p>
              </div>
            </div>
            {result.suggestion && <div className="suggestion-box"><h4>💡 建议</h4><p>{result.suggestion}</p></div>}
          </div>
        )}
        {result?.raw && <div className="result-card"><pre>{result.raw}</pre></div>}
      </div>
    </div>
  )
}

// ─── 硬件翻译 ───
function HWTranslatorPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<Record<string, string>>('/api/hw-translate', {
        tech_name: fd.get('tech_name'),
        tech_description: fd.get('tech_description'),
        versions: ['投资人版', 'PM版', '供应链版', '认证版'],
      })
      setResults(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const icons: Record<string, string> = { '投资人版': '💰', 'PM版': '📋', '供应链版': '🔗', '认证版': '✅' }

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #e17055 0%, #d35400 100%)' }}>
        <h1>🔄 硬件翻译 HWTranslator</h1>
        <p>硬件规格书 → 投资人/PM/供应链/认证 四版本</p>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>技术名称 *</label>
            <input name="tech_name" required placeholder="例：端侧AI语音识别模块" />
          </div>
          <div className="form-group">
            <label>技术描述 *</label>
            <textarea name="tech_description" required rows={5} placeholder="描述硬件规格、核心参数..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🔄 翻译中...' : '🔄 开始硬件翻译'}
          </button>
        </form>
        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}
        {results && (
          <div className="translate-results">
            {Object.entries(results).map(([ver, content]) => (
              <div key={ver} className="translate-card">
                <h3>{icons[ver] || '📄'} {ver}</h3>
                <div className="translate-content">{content}</div>
                <button className="btn-sm" onClick={() => navigator.clipboard.writeText(content)}>📋 复制</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 四角色工作台 ───
function QuadHelixPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<QuadHelixResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)
    const fd = new FormData(e.currentTarget)
    try {
      const r = await apiPost<QuadHelixResult>('/api/quad-helix', {
        project_name: fd.get('project_name'),
        project_description: fd.get('project_description'),
      })
      setResults(r)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const roleIcons: Record<string, string> = { '算法专家': '🧠', '硬件PM': '📋', '供应链专家': '🔗', '认证顾问': '✅' }
  const roleColors: Record<string, string> = { '算法专家': '#8b5cf6', '硬件PM': '#0984e3', '供应链专家': '#00b894', '认证顾问': '#fdcb6e' }

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #00b894 0%, #00a381 100%)' }}>
        <h1>🧬 四角色工作台 QuadHelix</h1>
        <p>算法专家+硬件PM+供应链专家+认证顾问 四Agent协同</p>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>项目名称 *</label>
            <input name="project_name" required placeholder="例：端侧AI语音识别硬件模块" />
          </div>
          <div className="form-group">
            <label>项目描述 *</label>
            <textarea name="project_description" required rows={5} placeholder="描述项目背景、核心技术、硬件需求..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🧬 四角色分析中...' : '🧬 开始四角色分析'}
          </button>
        </form>
        {loading && <Spinner />}
        {error && <div className="error-card">❌ {error}</div>}
        {results && (
          <div className="helix-results quad">
            {Object.entries(results).map(([key, val]) => (
              <div key={key} className="helix-card" style={{ borderTopColor: roleColors[val.name] }}>
                <h3>{roleIcons[val.name] || '👤'} {val.name}</h3>
                <p>{val.analysis}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 通用展示模块（无LLM交互） ───
function StaticModule({ id, name, nameEn, icon, theory, desc, color }: ModuleInfo & { id: string }) {
  const content: Record<string, React.ReactNode> = {
    'tt-fedmatch': (
      <>
        <div className="demo-card">
          <h4>🔗 联邦匹配演示</h4>
          <p>跨校专利数据不出校就能匹配需求方</p>
          <div className="fed-demo">
            <div className="fed-node" style={{ background: '#8b5cf6' }}>🏫 高校A<br />3项专利</div>
            <div className="fed-node" style={{ background: '#3b82f6' }}>🏫 高校B<br />5项专利</div>
            <div className="fed-center">🔒 联邦匹配引擎<br />数据不出校</div>
            <div className="fed-node" style={{ background: '#10b981' }}>🏢 企业X<br />需求匹配</div>
            <div className="fed-node" style={{ background: '#f59e0b' }}>🏢 企业Y<br />需求匹配</div>
          </div>
        </div>
      </>
    ),
    'tt-knowledge': (
      <div className="demo-card">
        <h4>🌐 知识图谱演示</h4>
        <p>可视化知识从论文到产品的流动路径</p>
        <div className="flow-demo">
          <div className="flow-step" style={{ background: '#3b82f6' }}>📄 论文</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step" style={{ background: '#8b5cf6' }}>🔬 专利</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step" style={{ background: '#f59e0b' }}>🧪 中试</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step" style={{ background: '#10b981' }}>📦 产品</div>
        </div>
      </div>
    ),
    'tt-radar': (
      <div className="demo-card">
        <h4>📡 技术雷达演示</h4>
        <p>预测技术生命周期和替代时机</p>
        <div className="radar-demo">
          {['萌芽期', '成长期', '成熟期', '衰退期'].map((phase, i) => (
            <div key={phase} className="radar-ring" style={{ width: `${90 - i * 20}%`, height: `${90 - i * 20}%`, borderColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][i] }}>
              <span>{phase}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    'tt-social': (
      <div className="demo-card">
        <h4>🌐 社交传播交易演示</h4>
        <p>社交+传播+交易一体化</p>
        <div className="social-demo">
          <div className="social-post"><span>📊</span> 技术评估报告发布 → 🔥 128次传播</div>
          <div className="social-post"><span>💡</span> 成交经验分享 → ❤️ 56次点赞</div>
          <div className="social-post"><span>🆘</span> 合作需求发布 → 🤝 3个匹配</div>
        </div>
      </div>
    ),
    'tt-thermo': (
      <div className="demo-card">
        <h4>🌡️ 创新温度计演示</h4>
        <p>实时测量AI渗透率</p>
        <div className="thermo-demo">
          {['生物医药', '新材料', '信息技术', '智能制造', '新能源'].map((field, i) => {
            const pct = [72, 45, 88, 63, 55][i]
            return (
              <div key={field} className="thermo-row">
                <span className="thermo-label">{field}</span>
                <div className="thermo-bar">
                  <div className="thermo-fill" style={{ width: `${pct}%`, background: pct > 70 ? '#10b981' : pct > 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="thermo-val">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    ),
    'hw-supply': (
      <div className="demo-card">
        <h4>🔗 供应链图谱演示</h4>
        <p>算法→芯片→ODM→认证全链路可视化</p>
        <div className="flow-demo">
          {['🧠 算法层', '🔲 芯片层', '📟 硬件层', '💻 系统层', '🤖 应用层', '📦 产品层', '🏪 市场层'].map((l, i) => (
            <div key={l} className="flow-step" style={{ background: ['#8b5cf6', '#0984e3', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#d63031'][i] }}>{l}</div>
          ))}
        </div>
      </div>
    ),
    'hw-radar': (
      <div className="demo-card">
        <h4>📡 硬件雷达演示</h4>
        <p>芯片路线图+传感器价格+国产替代进度</p>
        <div className="thermo-demo">
          {['RK3588', 'BM1684', '昇腾310', '寒武纪', '地平线J5'].map((chip, i) => {
            const pct = [85, 72, 68, 55, 78][i]
            return (
              <div key={chip} className="thermo-row">
                <span className="thermo-label">{chip}</span>
                <div className="thermo-bar">
                  <div className="thermo-fill" style={{ width: `${pct}%`, background: pct > 70 ? '#10b981' : pct > 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="thermo-val">国产替代 {pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    ),
    'hw-cert': (
      <div className="demo-card">
        <h4>📋 认证导航演示</h4>
        <p>3C/SRRC/算法备案/网安评估全流程</p>
        <div className="cert-steps">
          {[
            { name: '3C认证', time: '6-8周', cost: '3-5万', status: 'required' },
            { name: 'SRRC认证', time: '4-6周', cost: '1-3万', status: 'required' },
            { name: '算法备案', time: '2-4周', cost: '0.5-1万', status: 'conditional' },
            { name: '网安评估', time: '3-5周', cost: '2-4万', status: 'conditional' },
          ].map(s => (
            <div key={s.name} className="cert-step">
              <span className={`cert-status ${s.status}`}>{s.status === 'required' ? '●' : '○'}</span>
              <span className="cert-name">{s.name}</span>
              <span className="cert-time">⏱ {s.time}</span>
              <span className="cert-cost">💰 {s.cost}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    'hw-proto': (
      <div className="demo-card">
        <h4>🏭 打样工坊演示</h4>
        <p>EVT→DVT→PVT→MP全流程管理</p>
        <div className="proto-steps">
          {[
            { name: 'EVT', desc: '工程验证', qty: '5-20台', risk: '高' },
            { name: 'DVT', desc: '设计验证', qty: '50-200台', risk: '中' },
            { name: 'PVT', desc: '生产验证', qty: '500-2000台', risk: '低' },
            { name: 'MP', desc: '量产', qty: '5000+台', risk: '极低' },
          ].map((s, i) => (
            <div key={s.name} className="proto-step" style={{ borderColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'][i] }}>
              <div className="proto-name">{s.name}</div>
              <div className="proto-desc">{s.desc}</div>
              <div className="proto-qty">数量：{s.qty}</div>
              <div className="proto-risk">风险：{s.risk}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'hw-social-trade': (
      <div className="demo-card">
        <h4>🌐 社交交易演示</h4>
        <p>硬件开发者社区+供应链对接+交易管理</p>
        <div className="social-demo">
          <div className="social-post"><span>📊</span> 芯片选型讨论 → 💬 42条回复</div>
          <div className="social-post"><span>🔗</span> 供应链对接 → 🤝 5个匹配</div>
          <div className="social-post"><span>🏭</span> 打样需求发布 → 📩 8个报价</div>
        </div>
      </div>
    ),
  }

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
        <h1>{icon} {name} {nameEn}</h1>
        <p>{theory}：{desc}</p>
      </div>
      <div className="module-body">
        {content[id] || <div className="demo-card"><p>模块开发中...</p></div>}
      </div>
    </div>
  )
}

// ─── 理论框架页 ───
function BookPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { THEORIES } = require('./data')
  const catMap: Record<string, string> = { classical: '经典理论', policy: '政策框架', regional: '区域实践', modern: '现代方法' }

  return (
    <div className="page-content">
      <h2 className="section-title">📚 理论框架</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>24个经济学理论支撑TT-OPC平台设计</p>
      <div className="theory-grid">
        {THEORIES.map((t: any) => (
          <div key={t.id} className="theory-card" style={{ borderTop: `3px solid ${t.color}` }} onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.6rem' }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.nameEn} · {t.author} · {t.year}</div>
              </div>
              <span className={`cat-badge cat-${t.category}`}>{catMap[t.category]}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>{t.summary}</div>
            {expanded === t.id && (
              <div style={{ marginTop: 12, background: `${t.color}11`, borderRadius: 8, padding: 12, border: `1px solid ${t.color}33` }}>
                <div style={{ color: t.color, fontWeight: 700, fontSize: '0.78rem', marginBottom: 6 }}>📌 与OPC的关联</div>
                <div style={{ fontSize: '0.85rem' }}>{t.relevance}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 国际案例页 ───
function IntlPage() {
  const { INTLCASES } = require('./data')
  return (
    <div className="page-content">
      <h2 className="section-title">🌏 国际案例</h2>
      <div className="intl-grid">
        {INTLCASES.map((c: any) => (
          <div key={c.country + c.name} className="intl-card" style={{ borderTop: `4px solid ${c.color}` }}>
            <h3>{c.country} · {c.name}</h3>
            <div className="intl-model">{c.model}</div>
            <ul>{c.keyPoints.map((p: string, i: number) => <li key={i}>{p}</li>)}</ul>
            <div className="intl-metrics">
              {c.metrics.map((m: any, i: number) => (
                <div key={i} className="intl-metric">
                  <span className="intl-metric-val">{m.value}</span>
                  <span className="intl-metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Footer ───
function Footer() {
  return (
    <div className="footer">
      <p>TT-OPC 智能运营平台 · MIT 开源 · 基于24个经济学理论设计</p>
      <p>📖 ai-for-tt-opc（书籍）| 🛠️ tt_opc_platform（工具集）· GitHub: Dechang64</p>
      <p>西交利物浦大学人工智能学院 · 课题组组长：徐德昌 教授</p>
    </div>
  )
}

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState('cover')
  const [dark, setDark] = useState(false)

  // Map page IDs to components
  const pageMap: Record<string, React.ReactElement> = {
    cover: <Cover setPage={setPage} />,
    'tt-blindbox': <BlindBoxPage />,
    'tt-translator': <TranslatorPage />,
    'tt-triple': <TripleHelixPage />,
    'tt-fedmatch': <StaticModule {...TT_MODULES[1]} id="tt-fedmatch" />,
    'tt-knowledge': <StaticModule {...TT_MODULES[2]} id="tt-knowledge" />,
    'tt-radar': <StaticModule {...TT_MODULES[3]} id="tt-radar" />,
    'tt-social': <StaticModule {...TT_MODULES[6]} id="tt-social" />,
    'tt-thermo': <StaticModule {...TT_MODULES[7]} id="tt-thermo" />,
    'hw-eval': <HWEvalPage />,
    'hw-translate': <HWTranslatorPage />,
    'hw-quad': <QuadHelixPage />,
    'hw-supply': <StaticModule {...HW_MODULES[1]} id="hw-supply" />,
    'hw-radar': <StaticModule {...HW_MODULES[4]} id="hw-radar" />,
    'hw-cert': <StaticModule {...HW_MODULES[5]} id="hw-cert" />,
    'hw-proto': <StaticModule {...HW_MODULES[6]} id="hw-proto" />,
    'hw-social-trade': <StaticModule {...HW_MODULES[7]} id="hw-social-trade" />,
    book: <BookPage />,
    intl: <IntlPage />,
  }

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <Nav page={page} setPage={setPage} dark={dark} setDark={setDark} />
      {pageMap[page] ?? pageMap.cover}
      <Footer />
    </div>
  )
}
