import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPipelines } from '../api/pipelines'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'

const STATUS_COLORS = {
  active: '#22c55e',
  paused: '#8a857a',
  draft: '#f59e0b',
}

const STATUS_LABELS = {
  active: 'Active',
  paused: 'Paused',
  draft: 'Draft',
}

const STATUSES = ['All', 'Active', 'Paused', 'Draft']

function formatDate(iso) {
  if (!iso) return 'Never'
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function PipelineCard({ pipeline }) {
  const statusColor = STATUS_COLORS[pipeline.status] || MUTED
  const statusLabel = STATUS_LABELS[pipeline.status] || pipeline.status

  return (
    <Link to={`/pipelines/${pipeline.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e7e0d2',
          borderRadius: 14,
          padding: '20px 24px',
          cursor: 'pointer',
          transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{ paddingTop: 5, flexShrink: 0 }}>
              <span style={{
                display: 'inline-block',
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: statusColor,
                boxShadow: pipeline.status === 'active' ? `0 0 0 3px ${statusColor}22` : 'none',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 14,
                  fontWeight: 600,
                  color: DARK,
                  letterSpacing: '-0.01em',
                }}>
                  {pipeline.name}
                </span>
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 5,
                  background: `${statusColor}18`,
                  color: statusColor,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}>
                  {statusLabel.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
                {pipeline.owner}
              </div>
              <div style={{ fontSize: 13.5, color: MEDIUM, lineHeight: 1.55, marginBottom: 12 }}>
                {pipeline.description}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {pipeline.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    padding: '2px 7px',
                    borderRadius: 5,
                    background: '#f5f0e8',
                    color: '#7a7568',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontSize: 12,
                color: MUTED,
                flexWrap: 'wrap',
              }}>
                <span>🔄 {pipeline.runs} runs</span>
                <span>🕐 Last run: {formatDate(pipeline.lastRun)}</span>
                {pipeline.schedule && (
                  <span style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 5,
                    border: '1px solid #e7e0d2',
                    color: MUTED,
                    background: '#faf7f2',
                  }}>
                    {pipeline.schedule}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PipelinesPage() {
  const [allPipelines, setAllPipelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchAllPipelines().then(data => {
      setAllPipelines(data)
      setLoading(false)
    })
  }, [])

  const filtered = allPipelines.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase()
    const matchQuery = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.owner.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    return matchStatus && matchQuery
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f1ede4' }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '52px 28px 44px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                color: ACCENT,
                marginBottom: 16,
              }}>
                WORKFLOWS
              </div>
              <h1 style={{
                fontSize: 46,
                letterSpacing: '-0.03em',
                fontWeight: 600,
                lineHeight: 1.06,
                margin: 0,
                color: DARK,
              }}>
                Pipelines
              </h1>
              <p style={{ fontSize: 16, color: MEDIUM, marginTop: 14, maxWidth: 540, lineHeight: 1.6 }}>
                Automate your ML workflows with scheduled DAG pipelines.
              </p>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 8 }}>
              <button style={{
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: 9,
                border: 'none',
                background: ACCENT,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#b84e24'}
                onMouseLeave={e => e.currentTarget.style.background = ACCENT}
              >
                + New Pipeline
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search pipelines…"
              style={{
                fontFamily: 'inherit',
                fontSize: 14,
                padding: '9px 14px',
                borderRadius: 9,
                border: '1.4px solid #ddd6c8',
                background: '#fff',
                outline: 'none',
                width: 240,
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13,
                    padding: '7px 15px',
                    borderRadius: 20,
                    border: '1.4px solid',
                    cursor: 'pointer',
                    fontWeight: statusFilter === s ? 600 : 400,
                    background: statusFilter === s ? DARK : '#fff',
                    color: statusFilter === s ? '#f1ede4' : MEDIUM,
                    borderColor: statusFilter === s ? DARK : '#ddd6c8',
                    transition: 'all .12s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 11,
          color: MUTED,
          marginBottom: 20,
        }}>
          {loading ? 'Loading…' : `${filtered.length} pipeline${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                height: 140,
                background: '#ece6da',
                borderRadius: 14,
                animation: 'pulse 1.4s ease-in-out infinite',
                opacity: 1 - i * 0.12,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(p => <PipelineCard key={p.id} pipeline={p} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: MUTED,
          }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>—</div>
            <div style={{ fontSize: 15, marginBottom: 6 }}>No pipelines match your filters.</div>
            <div style={{ fontSize: 13, color: '#b0a898' }}>Try adjusting your search or status filter.</div>
          </div>
        )}
      </div>
    </div>
  )
}
