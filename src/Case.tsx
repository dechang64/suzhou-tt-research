import type { Theory } from './types'

const CAT_MAP: Record<string, string> = { classical: '经典理论', policy: '政策框架', regional: '区域实践', modern: '现代方法' }

export function Theory({ t, expanded, onToggle }: { t: Theory; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="theory-card" style={{ borderTop: `3px solid ${t.color}` }} onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>{t.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.nameEn} · {t.author} · {t.year}</div>
        </div>
        <span className={`cat-badge cat-${t.category}`}>{CAT_MAP[t.category]}</span>
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.7 }}>{t.summary}</div>
      {expanded && (
        <div style={{ marginTop: 12, background: `${t.color}11`, borderRadius: 8, padding: 12, border: `1px solid ${t.color}33` }}>
          <div style={{ color: t.color, fontWeight: 700, fontSize: '0.78rem', marginBottom: 6 }}>📌 与苏州的关联</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.7 }}>{t.relevance}</div>
        </div>
      )}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>{expanded ? '点击收起 ↑' : '点击展开关联解读 ↓'}</div>
    </div>
  )
}
