import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPipeline } from '../api/pipelines'

const ACCENT = '#cf5a2a'
const BG = '#f1ede4'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'

const DAG_NODES = [
  { id: 'ingest',     label: 'Dataset Ingest', state: 'completed' },
  { id: 'preprocess', label: 'Preprocess',      state: 'completed' },
  { id: 'train',      label: 'Train Model',     state: 'active'    },
  { id: 'evaluate',   label: 'Evaluate',        state: 'pending'   },
  { id: 'deploy',     label: 'Deploy',          state: 'pending'   },
]

const STATE_ICON = { completed: '✅', active: '🔄', pending: '⏳' }

const STATUS_COLORS = {
  active:  { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  paused:  { bg: '#fef9c3', color: '#a16207', border: '#fde68a' },
  draft:   { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  failed:  { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
  success: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  running: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.draft
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontFamily: "'Space Mono',monospace", fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {status}
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

function MetaRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 0', borderBottom: '1px solid #f0ebe0', gap: 12, fontSize: 13,
    }}>
      <span style={{ color: MUTED, flexShrink: 0 }}>{label}</span>
      <span style={{ color: DARK, fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}

function DagNode({ node }) {
  const isActive = node.state === 'active'
  const isCompleted = node.state === 'completed'
  return (
    <div style={{
      background: isCompleted ? '#f0fdf4' : '#fff',
      border: isActive
        ? `2px solid ${ACCENT}`
        : isCompleted
          ? '1px solid #22c55e40'
          : '1px solid #e7e0d2',
      borderRadius: 10,
      padding: '12px 16px',
      minWidth: 120,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      boxShadow: isActive ? `0 0 0 3px ${ACCENT}18` : 'none',
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{STATE_ICON[node.state]}</span>
      <span style={{
        fontSize: 12, fontWeight: 600, color: isActive ? ACCENT : DARK,
        fontFamily: "'Space Mono',monospace", textAlign: 'center', lineHeight: 1.3,
      }}>
        {node.label}
      </span>
      <span style={{
        fontSize: 10, color: MUTED, fontFamily: "'Space Mono',monospace",
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {node.state}
      </span>
    </div>
  )
}

function DagArrow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', color: '#c4bdb1',
      fontFamily: "'Space Mono',monospace", fontSize: 18, flexShrink: 0, padding: '0 4px',
      userSelect: 'none',
    }}>
      ›
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 140, background: '#e7e0d2', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 36, width: 300, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 440, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[220, 160, 140].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[130, 100].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ pipeline }) {
  const nextRun = pipeline.schedule
    ? new Date(Date.now() + 6 * 3600 * 1000).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 65%', minWidth: 0 }}>
        <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '24px 24px 20px', marginBottom: 24 }}>
          <SectionLabel>DAG Visualization</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', paddingBottom: 8 }}>
            {DAG_NODES.map((node, i) => (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <DagNode node={node} />
                {i < DAG_NODES.length - 1 && <DagArrow />}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries({ completed: '✅ Completed', active: '🔄 Running', pending: '⏳ Pending' }).map(([k, v]) => (
              <span key={k} style={{ fontSize: 11, color: MUTED, fontFamily: "'Space Mono',monospace" }}>{v}</span>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '24px 24px 20px' }}>
          <SectionLabel>About this pipeline</SectionLabel>
          <p style={{ fontSize: 14, color: MEDIUM, lineHeight: 1.7, margin: 0 }}>
            {pipeline.description}
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(pipeline.tags || []).map(tag => (
              <span key={tag} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 9px',
                borderRadius: 6, background: '#f5f0e8', color: '#7a7568',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: '0 0 35%', minWidth: 0 }}>
        <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '20px 20px 8px', marginBottom: 16 }}>
          <SectionLabel>Pipeline Metadata</SectionLabel>
          <MetaRow label="Owner" value={pipeline.owner} />
          <MetaRow label="Schedule" value={pipeline.schedule || 'Manual only'} />
          <MetaRow label="Framework" value="Apache Airflow" />
          <MetaRow label="Total runs" value={String(pipeline.runs)} />
          <MetaRow
            label="Last run"
            value={pipeline.lastRun
              ? new Date(pipeline.lastRun).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
              : '—'}
          />
          <div style={{ padding: '10px 0', fontSize: 13 }}>
            <span style={{ color: MUTED }}>Created</span>
            <span style={{ float: 'right', color: DARK, fontWeight: 500 }}>
              {new Date(pipeline.createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
            </span>
          </div>
        </div>

        {nextRun && (
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '16px 20px' }}>
            <SectionLabel>Next Run</SectionLabel>
            <div style={{ fontSize: 13.5, color: DARK, fontWeight: 600, fontFamily: "'Space Mono',monospace" }}>
              {nextRun}
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Scheduled via cron: {pipeline.schedule}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function RunHistoryTab({ runs = [] }) {
  const statusStyle = s => {
    const c = STATUS_COLORS[s] || STATUS_COLORS.draft
    return { background: c.bg, color: c.color, border: `1px solid ${c.border}` }
  }
  const rows = runs.map(r => ({
    run: r.id?.slice(0, 8) || '—',
    status: r.status === 'succeeded' ? 'success' : r.status,
    started: r.started_at || r.created_at,
    duration: r.finished_at && r.started_at
      ? `${Math.round((new Date(r.finished_at) - new Date(r.started_at)) / 60000)}m`
      : '—',
    trigger: r.trigger_type || 'manual',
  }))
  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #f0ebe0' }}>
        <SectionLabel>Run History</SectionLabel>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: 24, color: MUTED, fontSize: 13 }}>No runs yet.</div>
      ) : (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#faf7f0' }}>
            {['Run', 'Status', 'Started', 'Duration', 'Trigger'].map(h => (
              <th key={h} style={{
                padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                color: MUTED, fontFamily: "'Space Mono',monospace", letterSpacing: '0.04em',
                borderBottom: '1px solid #ece5d6',
              }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.run + i}
              style={{ borderBottom: i < rows.length - 1 ? '1px solid #f5f0e8' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#faf7f0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '12px 20px', fontFamily: "'Space Mono',monospace", fontSize: 12, color: DARK, fontWeight: 600 }}>
                {row.run}
              </td>
              <td style={{ padding: '12px 20px' }}>
                <span style={{
                  ...statusStyle(row.status),
                  display: 'inline-block', padding: '2px 9px', borderRadius: 20,
                  fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  {row.status}
                </span>
              </td>
              <td style={{ padding: '12px 20px', fontSize: 13, color: MEDIUM }}>{row.started}</td>
              <td style={{ padding: '12px 20px', fontFamily: "'Space Mono',monospace", fontSize: 12, color: DARK }}>{row.duration}</td>
              <td style={{ padding: '12px 20px' }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 8px',
                  borderRadius: 6, background: '#f5f0e8', color: '#7a7568',
                }}>
                  {row.trigger}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  )
}

function SettingsTab({ pipeline }) {
  const [form, setForm] = useState({
    name: pipeline.name,
    description: pipeline.description,
    schedule: pipeline.schedule || '',
    timeout: '3600',
  })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 13.5,
    border: '1px solid #e7e0d2', borderRadius: 8, background: '#faf7f0', color: DARK,
    fontFamily: 'inherit', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED,
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
  }
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '28px 28px 24px' }}>
        <SectionLabel>Pipeline Settings</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Schedule (cron)</label>
            <input
              style={{ ...inputStyle, fontFamily: "'Space Mono',monospace" }}
              value={form.schedule}
              placeholder="e.g. 0 2 * * *"
              onChange={e => set('schedule', e.target.value)}
            />
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 5 }}>
              Leave empty to disable scheduled runs.
            </div>
          </div>
          <div>
            <label style={labelStyle}>Timeout (seconds)</label>
            <input
              style={{ ...inputStyle, fontFamily: "'Space Mono',monospace" }}
              type="number"
              value={form.timeout}
              onChange={e => set('timeout', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button style={{
              fontFamily: 'inherit', fontSize: 13.5, padding: '10px 22px', borderRadius: 9,
              border: 'none', background: DARK, color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
            }}>
              Save Changes
            </button>
            <button style={{
              fontFamily: 'inherit', fontSize: 13.5, padding: '10px 22px', borderRadius: 9,
              border: '1px solid #e7e0d2', background: '#fff', color: DARK, fontWeight: 500, cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelineDetailPage() {
  const { pipelineId } = useParams()
  const [pipeline, setPipeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchPipeline(pipelineId)
      .then(data => { setPipeline(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [pipelineId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: MUTED }}>Pipeline not found.</div>
        <Link to="/pipelines" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Pipelines</Link>
      </div>
    )
  }

  const TABS = [
    { id: 'overview',    label: 'Overview'     },
    { id: 'run-history', label: 'Run History'  },
    { id: 'settings',    label: 'Settings'     },
  ]

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 18, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/pipelines" style={{ color: MUTED, textDecoration: 'none' }}>Pipelines</Link>
            <span>›</span>
            <span style={{ color: DARK }}>{pipeline.owner}</span>
            <span>›</span>
            <span style={{ color: DARK }}>{pipeline.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700,
                  color: DARK, margin: 0, letterSpacing: '-0.02em',
                }}>
                  {pipeline.name}
                </h1>
                <StatusBadge status={pipeline.status} />
              </div>
              <p style={{ fontSize: 14.5, color: MEDIUM, margin: 0, maxWidth: 580, lineHeight: 1.6 }}>
                {pipeline.description}
              </p>
              <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                  ↺ {pipeline.runs} runs
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                  ⏱ {pipeline.lastRun
                    ? new Date(pipeline.lastRun).toLocaleDateString('en-GB', { dateStyle: 'medium' })
                    : 'Never run'}
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                  📅 {pipeline.schedule || 'No schedule'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <button style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 16px', borderRadius: 9,
                border: 'none', background: ACCENT, color: '#fff', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                ▶ Run Now
              </button>
              <button style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 16px', borderRadius: 9,
                border: '1px solid #e7e0d2', background: '#fff', color: DARK, fontWeight: 500, cursor: 'pointer',
              }}>
                ⏸ Pause
              </button>
              <button style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 16px', borderRadius: 9,
                border: '1px solid #e7e0d2', background: '#fff', color: DARK, fontWeight: 500, cursor: 'pointer',
              }}>
                Edit
              </button>
              <button style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 16px', borderRadius: 9,
                border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontWeight: 500, cursor: 'pointer',
              }}>
                Delete
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #e3dccd', marginTop: 4 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: 'inherit', fontSize: 13.5, padding: '13px 20px',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: activeTab === tab.id ? ACCENT : MUTED,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  borderBottom: activeTab === tab.id ? `2px solid ${ACCENT}` : '2px solid transparent',
                  transition: 'color .15s',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>
        {activeTab === 'overview'    && <OverviewTab pipeline={pipeline} />}
        {activeTab === 'run-history' && <RunHistoryTab runs={pipeline.runHistory} />}
        {activeTab === 'settings'    && <SettingsTab pipeline={pipeline} />}
      </div>
    </div>
  )
}
