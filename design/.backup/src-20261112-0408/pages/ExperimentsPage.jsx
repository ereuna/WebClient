import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllExperiments } from '../api/experiments'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'

const STATUSES = ['All', 'Running', 'Completed', 'Failed']

const STATUS_STYLES = {
  running:   { dot: '#22c55e', label: 'Running',   bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  completed: { dot: '#3b82f6', label: 'Completed', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  failed:    { dot: '#ef4444', label: 'Failed',    bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
}

function fmt(val) {
  return val == null ? '—' : val.toFixed(4)
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || {}
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function ColHeader({ children, flex }) {
  return (
    <div style={{
      flex, fontSize: 11, fontFamily: "'Space Mono',monospace",
      color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
      minWidth: 0,
    }}>
      {children}
    </div>
  )
}

function TableHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 20px 10px',
      borderBottom: '1.5px solid #e7e0d2',
    }}>
      <div style={{ width: 18, flexShrink: 0 }} />
      <ColHeader flex="2">Name</ColHeader>
      <ColHeader flex="1.5">Project</ColHeader>
      <ColHeader flex="1">Status</ColHeader>
      <ColHeader flex="1">Accuracy</ColHeader>
      <ColHeader flex="1">Loss</ColHeader>
      <ColHeader flex="1">F1</ColHeader>
      <ColHeader flex="1">Duration</ColHeader>
      <ColHeader flex="1">Date</ColHeader>
    </div>
  )
}

function ExperimentRow({ exp, checked, onCheck }) {
  const [hovered, setHovered] = useState(false)
  const date = new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: hovered ? '#fdf9f4' : '#fff',
        border: `1px solid ${checked ? ACCENT : '#e7e0d2'}`,
        borderRadius: 10, padding: '14px 20px',
        transition: 'background .12s, border-color .12s, box-shadow .12s',
        boxShadow: hovered ? '0 2px 12px rgba(0,0,0,.06)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onCheck(exp.id)}
        onClick={e => e.stopPropagation()}
        style={{ width: 15, height: 15, accentColor: ACCENT, flexShrink: 0, cursor: 'pointer' }}
      />

      <Link
        to={`/experiments/${exp.id}`}
        style={{ flex: 2, textDecoration: 'none', color: 'inherit', minWidth: 0 }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {exp.name}
        </div>
        <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>by {exp.owner}</div>
      </Link>

      <div style={{ flex: 1.5, minWidth: 0 }}>
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 11.5,
          background: '#f5f0e8', color: '#7a7568',
          padding: '2px 7px', borderRadius: 5,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '100%',
        }}>
          {exp.project}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <StatusBadge status={exp.status} />
      </div>

      <div style={{ flex: 1, fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: exp.metrics.accuracy == null ? MUTED : DARK }}>
        {fmt(exp.metrics.accuracy)}
      </div>

      <div style={{ flex: 1, fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: exp.metrics.loss == null ? MUTED : DARK }}>
        {fmt(exp.metrics.loss)}
      </div>

      <div style={{ flex: 1, fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: exp.metrics.f1 == null ? MUTED : DARK }}>
        {fmt(exp.metrics.f1)}
      </div>

      <div style={{ flex: 1, fontSize: 13, color: MEDIUM }}>
        {exp.duration}
      </div>

      <div style={{ flex: 1, fontSize: 12, color: MUTED }}>
        {date}
      </div>
    </div>
  )
}

export default function ExperimentsPage() {
  const [allExperiments, setAllExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState('All projects')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    fetchAllExperiments().then(data => { setAllExperiments(data); setLoading(false) })
  }, [])

  const projects = ['All projects', ...Array.from(new Set(allExperiments.map(e => e.project)))]

  const filtered = allExperiments.filter(e => {
    const matchQuery = !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.owner.toLowerCase().includes(query.toLowerCase()) ||
      e.project.toLowerCase().includes(query.toLowerCase())
    const matchProject = projectFilter === 'All projects' || e.project === projectFilter
    const matchStatus = statusFilter === 'All' || e.status === statusFilter.toLowerCase()
    return matchQuery && matchProject && matchStatus
  })

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectedCount = selected.size

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PageHero
        eyebrow="EXPERIMENTS"
        title="Experiments"
        description="Track, compare, and analyze your ML runs."
        illustration={PAGE_ILLUSTRATIONS.experiments}
        illustrationAlt="Experiments illustration"
      >
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: DARK, color: '#f1ede4', border: 'none', borderRadius: 9,
              padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              New Experiment
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search experiments…"
              style={{
                fontFamily: 'inherit', fontSize: 14, padding: '9px 14px', borderRadius: 9,
                border: '1.4px solid #ddd6c8', background: '#fff', outline: 'none', width: 240,
              }}
            />
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 12px', borderRadius: 9,
                border: '1.4px solid #ddd6c8', background: '#fff', outline: 'none', cursor: 'pointer',
              }}
            >
              {projects.map(p => <option key={p}>{p}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    fontFamily: 'inherit', fontSize: 13, padding: '6px 14px', borderRadius: 20,
                    border: '1.4px solid', cursor: 'pointer', fontWeight: statusFilter === s ? 600 : 400,
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

            {selectedCount >= 2 && (
              <button
                style={{
                  marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: ACCENT, color: '#fff',
                  border: 'none', borderRadius: 9,
                  padding: '9px 16px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'opacity .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Compare ({selectedCount})
              </button>
            )}
          </div>
      </PageHero>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} experiment${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 68, background: '#f0ebe0', borderRadius: 10 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: MUTED, fontSize: 15 }}>
            No experiments match your filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <TableHeader />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {filtered.map(exp => (
                <ExperimentRow
                  key={exp.id}
                  exp={exp}
                  checked={selected.has(exp.id)}
                  onCheck={toggleSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
