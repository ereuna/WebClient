import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchExperiment } from '../api/experiments'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BG = '#fff'
const CARD_BORDER = '1px solid #e7e0d2'
const CARD_RADIUS = 14

const LOSS_HEIGHTS = [140, 128, 114, 102, 92, 80, 68, 58, 50, 44]
const ACCURACY_HEIGHTS = [28, 40, 54, 68, 80, 92, 104, 116, 126, 136]

function StatusBadge({ status }) {
  const map = {
    completed: { bg: '#e6f4ec', color: '#2d8a4e', label: 'Completed' },
    running:   { bg: '#fff3e0', color: '#e67e22', label: 'Running'   },
    failed:    { bg: '#fdecea', color: '#c0392b', label: 'Failed'    },
  }
  const s = map[status] || { bg: '#f0ebe0', color: MUTED, label: status }
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
      background: s.bg, color: s.color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  )
}

function ActionButton({ children, onClick, variant }) {
  const isPrimary = variant === 'primary'
  const isDanger  = variant === 'danger'
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'inherit', fontSize: 13, padding: '9px 18px',
        borderRadius: 9, cursor: 'pointer', fontWeight: 500,
        border: isDanger ? '1.4px solid #e74c3c40' : isPrimary ? 'none' : CARD_BORDER,
        background: isDanger ? '#fdecea' : isPrimary ? DARK : CARD_BG,
        color: isDanger ? '#c0392b' : isPrimary ? BG : DARK,
        transition: 'opacity .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
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

function Card({ children, style }) {
  return (
    <div style={{
      background: CARD_BG, border: CARD_BORDER,
      borderRadius: CARD_RADIUS, padding: '20px 22px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function MetaRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', gap: 12,
      padding: '9px 0', borderBottom: '1px solid #f0ebe0', fontSize: 13,
    }}>
      <span style={{ color: MUTED, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, color: DARK, textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 400,
        color: active ? DARK : MUTED,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 0 12px 0',
        borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent',
        transition: 'color .15s',
      }}
    >
      {label}
    </button>
  )
}

function BarChart({ title, bars, yLow, yHigh, xLabel }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 20 }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160, paddingLeft: 32, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          paddingBottom: 0,
        }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: MUTED }}>{yHigh}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: MUTED }}>{yLow}</span>
        </div>
        {bars.map((h, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 24, height: h, background: ACCENT,
              borderRadius: '4px 4px 0 0',
              opacity: 0.85 + (i / bars.length) * 0.15,
            }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: MUTED }}>{i + 1}</span>
          </div>
        ))}
      </div>
      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: 9, color: MUTED,
        textAlign: 'center', marginTop: 8, paddingLeft: 32,
      }}>
        {xLabel}
      </div>
    </div>
  )
}

function ArtifactRow({ icon, name, size, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', gap: 16,
      borderBottom: isLast ? 'none' : '1px solid #f0ebe0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 8, background: '#f5f0e8',
          border: CARD_BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{name}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, marginTop: 2 }}>{size}</div>
        </div>
      </div>
      <button style={{
        fontFamily: 'inherit', fontSize: 12, padding: '7px 14px', borderRadius: 8,
        border: CARD_BORDER, background: CARD_BG, color: MEDIUM,
        cursor: 'pointer', fontWeight: 500, flexShrink: 0,
        transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
        onMouseLeave={e => e.currentTarget.style.background = CARD_BG}
      >
        Download ↓
      </button>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 11, width: 200, background: '#e7e0d2', borderRadius: 6, marginBottom: 18 }} />
          <div style={{ height: 38, width: 300, background: '#e2dbd0', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <div style={{ height: 26, width: 90, background: '#e7e0d2', borderRadius: 20 }} />
            <div style={{ height: 26, width: 120, background: '#ede6d8', borderRadius: 20 }} />
          </div>
          <div style={{ height: 13, width: 280, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '36px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[220, 180, 160].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: CARD_RADIUS }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[160, 100].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: CARD_RADIUS }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ experiment }) {
  const { params, metrics, project, owner, createdAt, duration, status, tags } = experiment
  const fmtDate = d => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const fmtMetric = v => v == null ? '—' : typeof v === 'number' ? (v < 1 ? (v * 100).toFixed(2) + '%' : v.toFixed(4)) : v

  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 58%', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <SectionLabel>Parameters</SectionLabel>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Learning Rate', params.lr],
                  ['Epochs',        params.epochs],
                  ['Batch Size',    params.batchSize],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{
                      padding: '9px 0', borderBottom: '1px solid #f0ebe0',
                      fontSize: 13, color: MUTED, width: '55%',
                    }}>{k}</td>
                    <td style={{
                      padding: '9px 0', borderBottom: '1px solid #f0ebe0',
                      fontFamily: "'Space Mono',monospace", fontSize: 13, color: DARK,
                      fontWeight: 600, textAlign: 'right',
                    }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card style={{ flex: 1, minWidth: 200 }}>
            <SectionLabel>Final Metrics</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Accuracy', metrics.accuracy],
                ['Loss',     metrics.loss],
                ['F1 Score', metrics.f1],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: DARK, lineHeight: 1 }}>
                    {fmtMetric(val)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ flex: '1 1 36%', minWidth: 240 }}>
        <Card>
          <SectionLabel>Experiment Info</SectionLabel>
          <div style={{ marginTop: -4 }}>
            {[
              ['Project',  project],
              ['Owner',    owner],
              ['Created',  fmtDate(createdAt)],
              ['Duration', duration],
              ['Status',   status.charAt(0).toUpperCase() + status.slice(1)],
            ].map(([label, value]) => (
              <MetaRow key={label} label={label} value={value} />
            ))}
          </div>
          {tags && tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9.5, letterSpacing: '0.06em',
                color: MUTED, marginBottom: 8, textTransform: 'uppercase',
              }}>Tags</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {tags.map(t => (
                  <span key={t} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 9px',
                    borderRadius: 6, background: '#f5f0e8', color: '#7a7568',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function MetricsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Card>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <BarChart
            title="Training Loss over Epochs"
            bars={LOSS_HEIGHTS}
            yHigh="1.0"
            yLow="0.0"
            xLabel="Epoch"
          />
          <BarChart
            title="Accuracy over Epochs"
            bars={ACCURACY_HEIGHTS}
            yHigh="100%"
            yLow="0%"
            xLabel="Epoch"
          />
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Best Accuracy', value: '92.31%', sub: 'Epoch 10' },
          { label: 'Final Loss',    value: '0.2104', sub: 'Epoch 10' },
          { label: 'Best F1',       value: '91.88%', sub: 'Epoch 9'  },
          { label: 'Total Epochs',  value: '10',     sub: 'Completed'},
        ].map(({ label, value, sub }) => (
          <Card key={label} style={{ flex: '1 1 140px', minWidth: 130 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: DARK, lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, marginTop: 6 }}>{sub}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ArtifactsTab() {
  const artifacts = [
    { icon: '🧠', name: 'model.pt',             size: '1.2 GB' },
    { icon: '📄', name: 'training_log.json',    size: '48 KB'  },
    { icon: '🖼️', name: 'confusion_matrix.png', size: '112 KB' },
    { icon: '📊', name: 'metrics.csv',          size: '8 KB'   },
  ]
  return (
    <Card style={{ padding: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ebe0' }}>
        <SectionLabel>Artifacts</SectionLabel>
        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
          Files generated during the experiment run.
        </p>
      </div>
      {artifacts.map((a, i) => (
        <ArtifactRow key={a.name} {...a} isLast={i === artifacts.length - 1} />
      ))}
    </Card>
  )
}

function ComparisonsTab() {
  return (
    <Card>
      <div style={{ padding: '28px 0', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: '#f5f0e8',
          border: CARD_BORDER, margin: '0 auto 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>
          ⚖️
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 10 }}>
          No experiments selected for comparison
        </div>
        <p style={{ fontSize: 13.5, color: MUTED, maxWidth: 380, margin: '0 auto 22px', lineHeight: 1.6 }}>
          Select experiments from the experiments list to compare them here.
        </p>
        <Link
          to="/experiments"
          style={{
            display: 'inline-block', padding: '10px 22px', borderRadius: 9,
            background: DARK, color: BG, fontSize: 13.5, fontWeight: 500,
            textDecoration: 'none', transition: 'opacity .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ← Go to Experiments
        </Link>
      </div>
    </Card>
  )
}

const TABS = ['Overview', 'Metrics', 'Artifacts', 'Comparisons']

export default function ExperimentDetailPage() {
  const { expId } = useParams()
  const [experiment, setExperiment] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)
  const [activeTab, setActiveTab]   = useState('Overview')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchExperiment(expId)
      .then(data => {
        setExperiment(data)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [expId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{
        minHeight: '100vh', background: BG,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: MUTED }}>Experiment not found.</div>
        <Link to="/experiments" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Experiments</Link>
      </div>
    )
  }

  const fmtDate = d => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED,
            marginBottom: 18, display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <Link to="/experiments" style={{ color: MUTED, textDecoration: 'none' }}>Experiments</Link>
            <span>›</span>
            <Link to={`/projects/${experiment.project}`} style={{ color: MUTED, textDecoration: 'none' }}>{experiment.project}</Link>
            <span>›</span>
            <span style={{ color: DARK }}>{experiment.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <StatusBadge status={experiment.status} />
              </div>
              <h1 style={{
                fontSize: 36, letterSpacing: '-0.02em', fontWeight: 700,
                lineHeight: 1.1, margin: 0, color: DARK,
              }}>
                {experiment.name}
              </h1>
              <div style={{
                display: 'flex', gap: 20, marginTop: 12,
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, flexWrap: 'wrap',
              }}>
                <span>⏱ {experiment.duration}</span>
                <span>📅 {fmtDate(experiment.createdAt)}</span>
                <span>👤 {experiment.owner}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <ActionButton variant="secondary">Clone</ActionButton>
              <ActionButton variant="secondary">Archive</ActionButton>
              <ActionButton variant="danger">Delete</ActionButton>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 28, marginTop: 28 }}>
            {TABS.map(tab => (
              <Tab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 28px 80px' }}>
        {activeTab === 'Overview'     && <OverviewTab experiment={experiment} />}
        {activeTab === 'Metrics'      && <MetricsTab />}
        {activeTab === 'Artifacts'    && <ArtifactsTab />}
        {activeTab === 'Comparisons'  && <ComparisonsTab />}
      </div>
    </div>
  )
}
