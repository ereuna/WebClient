import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchApp, STATUS_COLORS } from '../api/apps'
import { APP_ILLUSTRATIONS } from '../lib/illustrations'
import { fetchRelatedModels } from '../api/models'
import { fetchRelatedDatasets } from '../api/datasets'
import CodeBlock from '../components/CodeBlock'

const ACCENT = '#cf5a2a'
const DOT_BG = 'radial-gradient(#e7e0d1 1px,transparent 1px)'
const FAMILY_COLORS = {
  'PINN': '#7c6af7',
  'GNN / NNP': '#2db88a',
  'Grid RL': '#e67e22',
  'Forecasting': '#3498db',
  'Generative': '#e91e8c',
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#8a857a'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 11px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {status}
    </span>
  )
}

function StatPill({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a',
    }}>
      {icon} {label}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
      color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function SectionCard({ label, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12,
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: '#faf7f0',
          border: '1px solid #ece5d6', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 5 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#56524a', lineHeight: 1.55 }}>{desc}</div>
        </div>
      </div>
    </div>
  )
}

function PoweredByCard({ model }) {
  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{model.title}</div>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 9, padding: '2px 6px',
            borderRadius: 5,
            background: (FAMILY_COLORS[model.family] || '#8a857a') + '18',
            color: FAMILY_COLORS[model.family] || '#8a857a',
            whiteSpace: 'nowrap',
          }}>{model.family}</span>
        </div>
        <div style={{ fontSize: 12, color: '#8a857a', marginTop: 5, lineHeight: 1.45 }}>
          {model.desc.slice(0, 80)}…
        </div>
      </div>
    </Link>
  )
}

function DatasetChip({ dataset }) {
  return (
    <Link to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#faf7f0', border: '1px solid #e7e0d2', borderRadius: 10,
        padding: '10px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{dataset.title}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#a09990', marginTop: 4 }}>
          {dataset.rows} rows · {dataset.size}
        </div>
      </div>
    </Link>
  )
}

function ChangelogRow({ version, date, note, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #f0ebe0' }}>
      <span style={{
        fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
        borderRadius: 6, border: '1px solid #e7e0d2', color: '#1b1a17', background: '#faf7f0',
        whiteSpace: 'nowrap', flexShrink: 0, height: 'fit-content', marginTop: 2,
      }}>{version}</span>
      <div>
        <div style={{ fontSize: 13.5, color: '#1b1a17' }}>{note}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990', marginTop: 4 }}>{date}</div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 140, background: '#e7e0d2', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 36, width: 240, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 460, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[120, 200, 180, 180, 160].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 276, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[140, 120, 80].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AppDetailPage() {
  const { appId } = useParams()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [poweredByModels, setPoweredByModels] = useState([])
  const [trainingDatasets, setTrainingDatasets] = useState([])
  const isComingSoon = app?.status === 'Coming soon'

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setPoweredByModels([])
    setTrainingDatasets([])
    fetchApp(appId).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setApp(data)
      Promise.all([
        fetchRelatedModels(data.poweredByIds || []),
        fetchRelatedDatasets(data.trainingDatasetIds || []),
      ]).then(([models, datasets]) => {
        setPoweredByModels(models)
        setTrainingDatasets(datasets)
        setLoading(false)
      })
    })
  }, [appId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: '#8a857a' }}>App not found.</div>
        <Link to="/apps" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Apps</Link>
      </div>
    )
  }

  const { emoji, title, tagline, desc, longDesc, tags, status, users,
    features, techStack, apiEndpoint, embedSnippet, changelog, codeSnippet } = app

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/apps" style={{ color: '#8a857a', textDecoration: 'none' }}>Apps</Link>
            <span>›</span>
            <span style={{ color: '#1b1a17' }}>{title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              {/* Emoji + chips row */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                {APP_ILLUSTRATIONS[appId] ? (
                  <img
                    src={APP_ILLUSTRATIONS[appId]}
                    alt={`${title} illustration`}
                    style={{
                      width: 52, height: 52, borderRadius: 14, objectFit: 'cover',
                      border: '1px solid #e7e0d2', flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: '#fff',
                    border: '1px solid #e7e0d2', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 28, flexShrink: 0,
                  }}>{emoji}</div>
                )}
                <StatusBadge status={status} />
                {tags.map(t => (
                  <span key={t} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 9px',
                    borderRadius: 6, background: '#f5f0e8', color: '#7a7568',
                  }}>{t}</span>
                ))}
              </div>

              <h1 style={{ fontSize: 42, letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1.06, margin: 0 }}>
                {title}
              </h1>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#8a857a', marginTop: 6 }}>
                {tagline}
              </div>
              <p style={{ fontSize: 15.5, color: '#56524a', marginTop: 12, maxWidth: 560, lineHeight: 1.6 }}>
                {desc}
              </p>

              {!isComingSoon && (
                <div style={{ display: 'flex', gap: 18, marginTop: 18, flexWrap: 'wrap' }}>
                  <StatPill icon="◉" label={`${users} active users`} />
                  <StatPill icon="⬡" label={`v${changelog[0]?.version.replace('v', '')}`} />
                  <StatPill icon="↺" label={`Updated ${changelog[0]?.date}`} />
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
              {isComingSoon ? (
                <>
                  <Link
                    to="/docs"
                    style={{
                      display: 'block', fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                      border: 'none', background: '#1b1a17', color: '#f1ede4', fontWeight: 500,
                      textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Join waitlist →
                  </Link>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', textAlign: 'center' }}>
                    Expected {changelog[0]?.date}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => document.getElementById('app-preview')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{
                      fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                      border: 'none', background: ACCENT, color: '#fff', fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    Launch app →
                  </button>
                  <Link
                    to="/docs"
                    style={{
                      display: 'block', fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                      border: '1.4px solid #ddd6c8', background: '#fff', color: '#1b1a17', fontWeight: 500,
                      textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Embed / API
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 80px', display: 'flex', gap: 36, alignItems: 'flex-start' }}>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* App preview area */}
          <div id="app-preview" style={{ marginBottom: 32 }}>
            <div style={{
              borderRadius: 14, overflow: 'hidden', border: '1px solid #e7e0d2',
              background: '#faf7f0',
            }}>
              {APP_ILLUSTRATIONS[appId] ? (
                <img
                  src={APP_ILLUSTRATIONS[appId]}
                  alt={`${title} preview`}
                  style={{ width: '100%', display: 'block' }}
                />
              ) : (
                <div style={{
                  height: 220, backgroundImage: DOT_BG, backgroundSize: '18px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 12,
                }}>
                  <span style={{ fontSize: 64 }}>{emoji}</span>
                </div>
              )}
              <div style={{
                padding: '14px 18px', borderTop: '1px solid #ece5d6',
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#b0a99a',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>{isComingSoon ? 'Preview available at launch' : `${title} — interactive preview`}</span>
              {!isComingSoon && (
                <Link
                  to="/docs"
                  style={{
                    fontFamily: 'inherit', fontSize: 13, padding: '9px 18px', borderRadius: 9,
                    border: 'none', background: '#1b1a17', color: '#f1ede4', fontWeight: 500,
                    textDecoration: 'none', cursor: 'pointer',
                  }}
                >
                  Open full app →
                </Link>
              )}
              </div>
            </div>
          </div>

          {/* About */}
          <SectionCard label="About">
            <p style={{ fontSize: 14.5, color: '#3b3830', lineHeight: 1.7, margin: 0 }}>{longDesc}</p>
          </SectionCard>

          {/* Features */}
          <SectionCard label="Features">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
              {features.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </SectionCard>

          {/* Embed snippet */}
          {!isComingSoon && (
            <SectionCard label="Embed">
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2824' }}>
                <div style={{ background: '#1b1a17', padding: '10px 16px', borderBottom: '1px solid #2a2824' }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#6b6660' }}>HTML embed snippet</span>
                </div>
                <pre style={{
                  margin: 0, padding: '18px 20px', background: '#141310',
                  fontFamily: "'Space Mono',monospace", fontSize: 12, lineHeight: 1.65,
                  color: '#c8c0b0', overflowX: 'auto',
                }}>
                  <code>{embedSnippet}</code>
                </pre>
              </div>
            </SectionCard>
          )}

          {/* API / SDK */}
          <SectionCard label="API & SDK">
            <CodeBlock tabs={codeSnippet} />
          </SectionCard>

          {/* Changelog */}
          <SectionCard label="Changelog">
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '4px 20px' }}>
              {changelog.map((c, i) => (
                <ChangelogRow key={c.version} {...c} isLast={i === changelog.length - 1} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 276, flexShrink: 0 }}>

          {/* Quick info */}
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <SectionLabel>Quick info</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Status', status],
                ['Users', isComingSoon ? 'On the roadmap' : `${users} active`],
                ['Version', changelog[0]?.version],
                ['Updated', changelog[0]?.date],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                  <span style={{ color: '#8a857a' }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API endpoint */}
          {!isComingSoon && (
            <div style={{ background: '#141310', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
                  color: ACCENT, marginBottom: 10, textTransform: 'uppercase',
                }}>
                  API Endpoint
                </div>
                <code style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#c8c0b0',
                  wordBreak: 'break-all', lineHeight: 1.5, display: 'block',
                }}>
                  {apiEndpoint}
                </code>
              </div>
            </div>
          )}

          {/* Tech stack */}
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <SectionLabel>Tech stack</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {techStack.map(t => (
                <div key={t} style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10.5, padding: '5px 9px',
                  borderRadius: 7, background: '#f5f0e8', color: '#56524a',
                }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Powered by models */}
          {poweredByModels.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionLabel>Powered by</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {poweredByModels.map(m => <PoweredByCard key={m.id} model={m} />)}
              </div>
            </div>
          )}

          {/* Training datasets */}
          {trainingDatasets.length > 0 && (
            <div>
              <SectionLabel>Training datasets</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {trainingDatasets.map(d => <DatasetChip key={d.id} dataset={d} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
