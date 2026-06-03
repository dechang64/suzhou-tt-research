import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'
import { TT_MODULES, HW_MODULES, API_BASE } from './data'
import type { BlindBoxResult, TripleHelixResult, HWEvalResult, QuadHelixResult, MapProvince, AuthState, EvaluationRecord } from './types'

// ─── API helpers ───
async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// SSE stream reader - calls onEvent for each SSE event
function streamSSE(path: string, body: Record<string, unknown>, onEvent: (event: string, data: any) => void): AbortController {
  const ctrl = new AbortController()
  fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal })
    .then(async res => {
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = '', evt = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('event: ')) evt = line.slice(7).trim()
          if (line.startsWith('data: ')) { try { onEvent(evt, JSON.parse(line.slice(6))) } catch {} }
        }
      }
    })
    .catch(() => {})
  return ctrl
}

// ─── Spinner ───
function Spinner() { return <div className="spinner"><div /><div /><div /></div> }

// ─── LLM Badge ───
function LLMSourceBadge({ source }: { source?: string }) {
  if (source === 'llm') return <span className="badge badge-llm">🤖 AI增强</span>
  return <span className="badge badge-fallback">⚡ 快速预览</span>
}

// ─── Nav ───
function Nav({ page, setPage, dark, setDark, auth, fedctxOk }: { page: string; setPage: (p: string) => void; dark: boolean; setDark: (d: boolean) => void; auth: AuthState | null; fedctxOk: boolean | null }) {
  const [open, setOpen] = useState(false)
  const groups = [
    { label: '首页', items: [{ id: 'cover', name: '🏠 首页' }, { id: 'map', name: '🗺️ 区域热力图' }] },
    { label: 'TT-OPC', items: TT_MODULES.map(m => ({ id: m.id, name: `${m.icon} ${m.name}` })) },
    { label: 'HW-OPC', items: HW_MODULES.map(m => ({ id: m.id, name: `${m.icon} ${m.name}` })) },
    { label: '更多', items: [{ id: 'history', name: '📋 评估历史' }, { id: 'book', name: '📖 书籍' }, { id: 'intl', name: '🌏 国际案例' }] },
  ]
  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <span className="topbar-brand" onClick={() => setPage('cover')}>🚀 TT-OPC</span>
        <div className="topbar-links">
          {groups.map(g => <div key={g.label} className="nav-group">
            <span className="nav-group-label">{g.label}</span>
            {g.items.map(i => <a key={i.id} className={page === i.id ? 'active' : ''} onClick={() => setPage(i.id)}>{i.name}</a>)}
          </div>)}
        </div>
        <div className="topbar-right">
          <span className="fedctx-indicator" title={fedctxOk ? 'FedCtx 已连接' : 'FedCtx 未连接'}>{fedctxOk ? '🟢' : '🔴'}</span>
          {auth && <span className="user-badge">👤 {auth.username}</span>}
          <button className="dark-toggle" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
          <button className="mobile-toggle" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>
      {open && <div className="mobile-menu">{groups.map(g => <div key={g.label}><div className="nav-group-label">{g.label}</div>{g.items.map(i => <a key={i.id} onClick={() => { setPage(i.id); setOpen(false) }}>{i.name}</a>)}</div>)}</div>}
    </nav>
  )
}

// ─── Cover Page ───
function CoverPage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="page-content">
      <div className="hero-section">
        <h1 className="hero-title">🚀 TT-OPC 智能运营平台</h1>
        <p className="hero-sub">用AI赋能技术转移，让一个人成为一支团队 · 基于24个经济学理论设计</p>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-val">8+9</div><div className="hero-stat-label">功能模块</div></div>
          <div className="hero-stat"><div className="hero-stat-val">24</div><div className="hero-stat-label">经济学理论</div></div>
          <div className="hero-stat"><div className="hero-stat-val">3</div><div className="hero-stat-label">平台（TT/HW/Web）</div></div>
        </div>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('tt-blindbox')}>📦 开始盲盒评估</button>
          <button className="btn-secondary" onClick={() => setPage('map')}>🗺️ 查看区域热力图</button>
        </div>
      </div>
      <div className="module-grid">
        {TT_MODULES.map(m => <div key={m.id} className="module-card" style={{ borderTopColor: m.color }} onClick={() => setPage(m.id)}>
          <div className="module-icon">{m.icon}</div>
          <div className="module-name">{m.name}</div>
          <div className="module-desc">{m.desc}</div>
          <div className="module-theory">{m.theory}</div>
        </div>)}
      </div>
    </div>
  )
}

// ─── Map Page ───
function MapPage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<MapProvince[]>([])
  const [selected, setSelected] = useState<MapProvince | null>(null)

  useEffect(() => {
    apiGet<{ provinces: MapProvince[] }>('/api/map-data').then(d => setData(d.provinces)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return
    Promise.all([import('echarts'), fetch('/china.json').then(r => r.json())]).then(([echarts, chinaJson]) => {
      echarts.registerMap('china', chinaJson)
      const chart = echarts.init(chartRef.current!)
      const mapData = data.map(d => ({ name: d.name, value: d.value, patents: d.patents, transfers: d.transfers, institutes: d.institutes }))
      chart.setOption({
        tooltip: { trigger: 'item', formatter: (p: any) => {
          if (!p.data) return ''
          const d = p.data
          return `<b>${d.name}</b><br/>技术转移指数: ${d.value}<br/>专利数: ${(d.patents/1000).toFixed(0)}K<br/>转化数: ${d.transfers}<br/>机构数: ${d.institutes}`
        }},
        visualMap: { min: 0, max: 100, left: 20, bottom: 20, text: ['高', '低'], inRange: { color: ['#e0f2fe', '#7dd3fc', '#0284c7', '#075985'] }, calculable: true },
        series: [{
          type: 'map', map: 'china', roam: true,
          label: { show: true, fontSize: 9, color: '#333' },
          itemStyle: { areaColor: '#f0f4f8', borderColor: '#94a3b8', borderWidth: 0.5 },
          emphasis: { label: { color: '#fff' }, itemStyle: { areaColor: '#0284c7', borderColor: '#075985' } },
          data: mapData
        }]
      })
      chart.on('click', (p: any) => { const prov = data.find(d => d.name === p.name); if (prov) setSelected(prov) })
      const onResize = () => chart.resize(); window.addEventListener('resize', onResize)
      return () => { window.removeEventListener('resize', onResize); chart.dispose() }
    })
  }, [data])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
        <h1>🗺️ 技术转移区域热力图</h1>
        <p>中国各省技术转移活跃度分布 · 数据来源：公开统计数据</p>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 500, background: 'var(--card)', borderRadius: 12, marginBottom: 16 }} />
      {selected && <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
        <h3>{selected.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 8 }}>
          <div className="metric-box"><div className="metric-val">{selected.value}</div><div className="metric-label">技术转移指数</div></div>
          <div className="metric-box"><div className="metric-val">{(selected.patents/1000).toFixed(0)}K</div><div className="metric-label">专利数</div></div>
          <div className="metric-box"><div className="metric-val">{selected.transfers}</div><div className="metric-label">转化数</div></div>
          <div className="metric-box"><div className="metric-val">{selected.institutes}</div><div className="metric-label">机构数</div></div>
        </div>
      </div>}
    </div>
  )
}

// ─── BlindBox Page (with LLM SSE enhancement) ───
function BlindBoxPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BlindBoxResult | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    const fd = new FormData(e.currentTarget)
    const body = { tech_name: fd.get('tech_name'), tech_field: fd.get('tech_field'), tech_description: fd.get('tech_description'), trl_level: fd.get('trl_level') }
    try {
      // 1. Get fallback immediately
      const r = await apiPost<BlindBoxResult>('/api/blindbox', body)
      setResult(r); setLoading(false)
      // 2. Start LLM enhancement in background
      setLlmLoading(true)
      streamSSE('/api/llm/blindbox', body, (evt, data) => {
        if (evt === 'result' && data.source === 'llm') { setResult(prev => ({ ...prev, ...data, source: 'llm' })); setLlmLoading(false) }
      })
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
        <h1>📦 盲盒评估 TechBlindBox</h1>
        <p>打破Arrow信息悖论 · 不泄露技术就能评估价值</p>
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <div className="form-row"><input name="tech_name" placeholder="技术名称 *" required className="form-input" />
        <select name="trl_level" className="form-input"><option>TRL3</option><option>TRL4</option><option selected>TRL5</option><option>TRL6</option><option>TRL7</option></select></div>
        <input name="tech_field" placeholder="技术领域（如：AI/生物医药/新材料）" className="form-input" />
        <textarea name="tech_description" placeholder="技术描述（可选，越详细AI评估越准确）" rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? '评估中...' : '🔍 开始评估'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {result && <div className="result-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <h2>{result.name} 评估报告</h2>
          <LLMSourceBadge source={result.source} />
          {llmLoading && <span className="llm-loading">🤖 AI增强中...</span>}
        </div>
        <div className="score-ring" style={{ '--score': result.score } as any}><div className="score-val">{result.score}</div><div className="score-label">综合评分</div></div>
        <div className="info-grid">
          <div className="info-item"><span className="info-label">TRL</span><span>{result.trl}</span></div>
          <div className="info-item"><span className="info-label">市场规模</span><span>{result.market_size}</span></div>
          <div className="info-item"><span className="info-label">目标客户</span><span>{result.target_customers}</span></div>
          <div className="info-item"><span className="info-label">竞争程度</span><span>{result.competition_level}</span></div>
          <div className="info-item"><span className="info-label">上市时间</span><span>{result.time_to_market}</span></div>
          <div className="info-item"><span className="info-label">风险等级</span><span>{result.risk_level}</span></div>
        </div>
        <div className="swot-grid">
          <div className="swot-card swot-s"><h4>✅ 优势</h4><ul>{result.strengths.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
          <div className="swot-card swot-w"><h4>⚠️ 劣势</h4><ul>{result.weaknesses.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
          <div className="swot-card swot-o"><h4>🌈 机会</h4><ul>{result.opportunities.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
          <div className="swot-card swot-t"><h4>🔴 威胁</h4><ul>{result.threats.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
        </div>
        <div className="card" style={{ marginTop: 12 }}><h4>💡 转化建议</h4><p>{result.suggestion}</p></div>
      </div>}
    </div>
  )
}

// ─── TechTranslator Page ───
function TechTranslatorPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)
  const icons: Record<string, string> = { '投资人版': '💰', 'CEO版': '👔', '院长版': '🎓' }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResults(null)
    const fd = new FormData(e.currentTarget)
    const body = { tech_name: fd.get('tech_name'), tech_description: fd.get('tech_description'), versions: ['投资人版', 'CEO版', '院长版'] }
    try {
      const r = await apiPost<Record<string, string>>('/api/tech-translate', body)
      setResults(r); setLoading(false)
      setLlmLoading(true)
      streamSSE('/api/llm/tech-translate', body, (evt, data) => {
        if (evt === 'result' && data.version) setResults(prev => prev ? { ...prev, [data.version]: data.content } : { [data.version]: data.content })
      })
      setTimeout(() => setLlmLoading(false), 60000)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
        <h1>🔄 场景翻译 TechTranslator</h1>
        <p>消除吸收能力门槛 · 一键生成多版本</p>
        {llmLoading && <span className="llm-loading-header">🤖 AI增强中...</span>}
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <input name="tech_name" placeholder="技术名称 *" required className="form-input" />
        <textarea name="tech_description" placeholder="技术描述 *" required rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Spinner /> : '🔄 开始翻译'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {results && <div className="translate-results">
        {Object.entries(results).map(([ver, content]) => (
          <div key={ver} className="card" style={{ borderLeft: `4px solid ${ver === '投资人版' ? '#f59e0b' : ver === 'CEO版' ? '#10b981' : '#3b82f6'}` }}>
            <h4>{icons[ver] || '📄'} {ver}</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
          </div>
        ))}
      </div>}
    </div>
  )
}

// ─── TripleHelix Page ───
function TripleHelixPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TripleHelixResult | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)
  const roleIcons: Record<string, string> = { '教授': '🎓', 'CEO': '👔', '律师': '⚖️' }
  const roleColors: Record<string, string> = { '教授': '#3b82f6', 'CEO': '#10b981', '律师': '#f59e0b' }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResults(null)
    const fd = new FormData(e.currentTarget)
    const body = { project_name: fd.get('project_name'), project_description: fd.get('project_description') }
    try {
      const r = await apiPost<TripleHelixResult>('/api/triple-helix', body)
      setResults(r); setLoading(false)
      setLlmLoading(true)
      streamSSE('/api/llm/triple-helix', body, (evt, data) => {
        if (evt === 'result' && data.role) setResults(prev => prev ? { ...prev, [data.role]: { name: data.name, analysis: data.analysis } } : prev)
      })
      setTimeout(() => setLlmLoading(false), 60000)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <h1>🧬 三角色工作台 TripleHelix</h1>
        <p>一人=三团队 · 教授+CEO+律师协同分析</p>
        {llmLoading && <span className="llm-loading-header">🤖 AI增强中...</span>}
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <input name="project_name" placeholder="项目名称 *" required className="form-input" />
        <textarea name="project_description" placeholder="项目描述 *" required rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Spinner /> : '🧬 开始分析'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {results && <div className="helix-results">
        {(Object.entries(results) as [string, { name: string; analysis: string }][]).map(([key, val]) => (
          <div key={key} className="card" style={{ borderLeft: `4px solid ${roleColors[val.name] || '#666'}` }}>
            <h4>{roleIcons[val.name] || '👤'} {val.name}</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{val.analysis}</p>
          </div>
        ))}
      </div>}
    </div>
  )
}

// ─── HWEval Page ───
function HWEvalPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HWEvalResult | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    const fd = new FormData(e.currentTarget)
    const body = { tech_name: fd.get('tech_name'), tech_description: fd.get('tech_description'), target_chip: fd.get('target_chip') }
    try {
      const r = await apiPost<HWEvalResult>('/api/hw-eval', body)
      setResult(r); setLoading(false)
      setLlmLoading(true)
      streamSSE('/api/llm/hw-eval', body, (evt, data) => {
        if (evt === 'result' && data.source === 'llm') setResult(prev => prev ? { ...prev, ...data, source: 'llm' } : prev)
      })
      setTimeout(() => setLlmLoading(false), 60000)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0984e3 0%, #0770c2 100%)' }}>
        <h1>📊 硬件评估 HWEval</h1>
        <p>芯片Benchmark+算法适配+BOM成本+国产化率</p>
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <div className="form-row"><input name="tech_name" placeholder="技术名称 *" required className="form-input" />
        <input name="target_chip" placeholder="目标芯片（可选）" className="form-input" /></div>
        <textarea name="tech_description" placeholder="技术描述 *" required rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Spinner /> : '📊 开始评估'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {result && <div className="result-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <h2>{result.name} 硬件评估</h2>
          <LLMSourceBadge source={result.source} />
          {llmLoading && <span className="llm-loading">🤖 AI增强中...</span>}
        </div>
        <div className="hw-grid">
          <div className="card"><h4>🔲 推荐芯片</h4><p>{result.chip_benchmark.recommended}</p><small>性能：{result.chip_benchmark.performance} | 功耗：{result.chip_benchmark.power}</small></div>
          <div className="card"><h4>🧠 算法适配</h4><div className="score-ring small" style={{ '--score': result.algorithm_fit.score } as any}><div className="score-val">{result.algorithm_fit.score}</div></div><p>瓶颈：{result.algorithm_fit.bottleneck}</p><small>优化：{result.algorithm_fit.optimization}</small></div>
          <div className="card"><h4>💰 BOM成本</h4><p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{result.bom_cost.estimate}</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>{Object.entries(result.bom_cost.breakdown).map(([k,v]) => <span key={k} className="bom-tag">{k}: {v}</span>)}</div></div>
          <div className="card"><h4>🇨🇳 国产化率</h4><div style={{ fontSize: '2rem', fontWeight: 800, color: result.localization_rate >= 60 ? '#10b981' : '#f59e0b' }}>{result.localization_rate}%</div><small>风险：{result.risk_level}</small></div>
        </div>
        <div className="card" style={{ marginTop: 12 }}><h4>💡 建议</h4><p>{result.suggestion}</p></div>
      </div>}
    </div>
  )
}

// ─── HWTranslator Page ───
function HWTranslatorPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)
  const icons: Record<string, string> = { '投资人版': '💰', 'PM版': '📋', '供应链版': '🔗', '认证版': '✅' }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResults(null)
    const fd = new FormData(e.currentTarget)
    const body = { tech_name: fd.get('tech_name'), tech_description: fd.get('tech_description'), versions: ['投资人版', 'PM版', '供应链版', '认证版'] }
    try {
      const r = await apiPost<Record<string, string>>('/api/hw-translate', body)
      setResults(r); setLoading(false)
      setLlmLoading(true)
      streamSSE('/api/llm/hw-translate', body, (evt, data) => {
        if (evt === 'result' && data.version) setResults(prev => prev ? { ...prev, [data.version]: data.content } : { [data.version]: data.content })
      })
      setTimeout(() => setLlmLoading(false), 60000)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #5b4cdb 100%)' }}>
        <h1>🔄 硬件翻译 HWTranslator</h1>
        <p>硬件规格书→4个专业版本</p>
        {llmLoading && <span className="llm-loading-header">🤖 AI增强中...</span>}
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <input name="tech_name" placeholder="技术名称 *" required className="form-input" />
        <textarea name="tech_description" placeholder="技术描述 *" required rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Spinner /> : '🔄 开始翻译'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {results && <div className="translate-results">{Object.entries(results).map(([ver, content]) => (
        <div key={ver} className="card" style={{ borderLeft: '4px solid #6c5ce7' }}><h4>{icons[ver] || '📄'} {ver}</h4><p style={{ whiteSpace: 'pre-wrap' }}>{content}</p></div>
      ))}</div>}
    </div>
  )
}

// ─── QuadHelix Page ───
function QuadHelixPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<QuadHelixResult | null>(null)
  const [error, setError] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)
  const roleIcons: Record<string, string> = { '算法专家': '🧠', '硬件PM': '📋', '供应链专家': '🔗', '认证顾问': '✅' }
  const roleColors: Record<string, string> = { '算法专家': '#8b5cf6', '硬件PM': '#0984e3', '供应链专家': '#00b894', '认证顾问': '#fdcb6e' }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(''); setResults(null)
    const fd = new FormData(e.currentTarget)
    const body = { project_name: fd.get('project_name'), project_description: fd.get('project_description') }
    try {
      const r = await apiPost<QuadHelixResult>('/api/quad-helix', body)
      setResults(r); setLoading(false)
      setLlmLoading(true)
      streamSSE('/api/llm/quad-helix', body, (evt, data) => {
        if (evt === 'result' && data.role) setResults(prev => prev ? { ...prev, [data.role]: { name: data.name, analysis: data.analysis } } : prev)
      })
      setTimeout(() => setLlmLoading(false), 60000)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : '请求失败') }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #5b4cdb 100%)' }}>
        <h1>🧬 四角色工作台 QuadHelix</h1>
        <p>算法专家+硬件PM+供应链专家+认证顾问</p>
        {llmLoading && <span className="llm-loading-header">🤖 AI增强中...</span>}
      </div>
      <form onSubmit={handleSubmit} className="eval-form">
        <input name="project_name" placeholder="项目名称 *" required className="form-input" />
        <textarea name="project_description" placeholder="项目描述 *" required rows={3} className="form-input" />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Spinner /> : '🧬 开始分析'}</button>
      </form>
      {error && <div className="error-card">{error}</div>}
      {results && <div className="helix-results quad">
        {(Object.entries(results) as [string, { name: string; analysis: string }][]).map(([key, val]) => (
          <div key={key} className="card" style={{ borderLeft: `4px solid ${roleColors[val.name] || '#666'}` }}>
            <h4>{roleIcons[val.name] || '👤'} {val.name}</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{val.analysis}</p>
          </div>
        ))}
      </div>}
    </div>
  )
}

// ─── Static Module Page ───
function StaticModule({ name, nameEn, icon, theory, desc, color }: { id: string; name: string; nameEn: string; icon: string; theory: string; desc: string; color: string }) {
  return (
    <div className="page-content">
      <div className="module-header" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
        <h1>{icon} {name}</h1>
        <p>{nameEn} · {theory}</p>
      </div>
      <div className="card"><p>{desc}</p><p style={{ marginTop: 12, color: 'var(--text-muted)' }}>🚧 该模块的交互功能正在开发中，敬请期待！</p></div>
    </div>
  )
}

// ─── History Page ───
function HistoryPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [fedctxStatus, setFedctxStatus] = useState<{available: boolean; total: number} | null>(null)

  useEffect(() => {
    apiGet<any>('/api/fedctx/status').then(d => setFedctxStatus({ available: d.available, total: d.total_vectors || d.stats?.total_vectors || 0 })).catch(() => {})
  }, [])

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const r = await apiGet<any[]>(`/api/evaluations/search?q=${encodeURIComponent(query)}&k=20`)
      setRecords(Array.isArray(r) ? r : [])
    } catch { setRecords([]) }
    setLoading(false)
  }, [query])

  return (
    <div className="page-content">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)' }}>
        <h1>📋 评估历史</h1>
        <p>FedCtx HNSW 语义检索 · 输入自然语言搜索相似评估</p>
        {fedctxStatus && <span style={{ float: 'right', fontSize: '0.8rem', opacity: 0.8 }}>
          {fedctxStatus.available ? `🟢 FedCtx 已连接 (${fedctxStatus.total} 条记录)` : '🔴 FedCtx 未连接'}
        </span>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="语义搜索：如'量子计算相关项目'、'AI芯片评估'" className="form-input" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch} className="btn-primary" disabled={loading}>🔍 搜索</button>
      </div>
      {loading ? <Spinner /> : records.length === 0 ? <div className="card"><p>输入关键词搜索评估记录。FedCtx HNSW 引擎会返回语义最相似的结果。</p></div> :
        <div>{records.map((r, i) => <div key={r.id || i} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{r.id} · {r.metadata?.type || r.metadata?.tech_name || '未知'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>相似度: {(r.score * 100).toFixed(1)}%</span>
          </div>
          {r.metadata?.tech_name && <div style={{ marginTop: 4 }}>技术: {r.metadata.tech_name} {r.metadata.score && `| 评分: ${r.metadata.score}`}</div>
          }</div>)}</div>
      }
    </div>
  )
}

// ─── Book & Intl Pages (simplified) ───
function BookPage() { return <div className="page-content"><div className="module-header" style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a08020 100%)' }}><h1>📖 AI for TT-OPC</h1><p>技术转移一人公司全链路指南</p></div><div className="card"><p>9章+附录，覆盖OPC模式认知、AI工具应用、成功案例、法律合规、可持续发展等主题。</p><p style={{ marginTop: 8 }}><a href="https://github.com/dechang64/AI-for-TT-OPC" target="_blank">GitHub仓库</a></p></div></div> }
function IntlPage() { return <div className="page-content"><div className="module-header" style={{ background: 'linear-gradient(135deg, #e8521a 0%, #c44116 100%)' }}><h1>🌏 国际案例</h1><p>全球技术转移最佳实践</p></div><div className="card"><p>波士顿三螺旋模式、德国Fraunhofer、以色列Yozma、日本TLO等国际经验。</p></div></div> }

// ─── Footer ───
function Footer() {
  return <div className="footer"><p>TT-OPC 智能运营平台 v5.0 · FedCtx HNSW + 24个经济学理论</p><p>西交利物浦大学 · 徐德昌教授课题组 · GitHub: dechang64</p></div>
}

// ─── App ───
export default function App() {
  const [page, setPage] = useState('cover')
  const [dark, setDark] = useState(false)
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [fedctxOk, setFedctxOk] = useState<boolean | null>(null)

  useEffect(() => {
    apiGet<{fedctx: boolean}>('/api/health').then(d => setFedctxOk(d.fedctx)).catch(() => setFedctxOk(false))
    const iv = setInterval(() => {
      apiGet<{fedctx: boolean}>('/api/health').then(d => setFedctxOk(d.fedctx)).catch(() => setFedctxOk(false))
    }, 30000)
    return () => clearInterval(iv)
  }, [])

  const pageMap: Record<string, React.ReactElement> = {
    cover: <CoverPage setPage={setPage} />,
    map: <MapPage />,
    'tt-blindbox': <BlindBoxPage />,
    'tt-fedmatch': <StaticModule {...TT_MODULES[1]} id="tt-fedmatch" />,
    'tt-knowledge': <StaticModule {...TT_MODULES[2]} id="tt-knowledge" />,
    'tt-radar': <StaticModule {...TT_MODULES[3]} id="tt-radar" />,
    'tt-translate': <TechTranslatorPage />,
    'tt-triple': <TripleHelixPage />,
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
    history: <HistoryPage />,
    book: <BookPage />,
    intl: <IntlPage />,
  }

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <Nav page={page} setPage={setPage} dark={dark} setDark={setDark} auth={auth} fedctxOk={fedctxOk} />
      {pageMap[page] ?? pageMap.cover}
      <Footer />
    </div>
  )
}
