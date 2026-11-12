import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllDeployments } from '../api/deployments'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'

const STATUS_COLORS = {
  running: '#22c55e',
  stopped: '#8a857a',
  error: '#ef4444',
}

const STATUS_LABELS = ['All', 'Running', 'Stopped', 'Error']

function StatusDot({ status }) {
  const color = STATUS_COLORS[status] || MUTED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 600,
      color,
      textTransform: 'capitalize',
    }}>
      <span style={{
        width: 9, height: 9, borderRadius: '50%', background: color,
        flexShrink: 0,
        boxShadow: status === 'running' ? `0 0 0 3px ${color}28` : 'none',
      }} />
      {status}
    </span>
  )
}

function StatChip({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#f5f0e8', borderRadius: 8, padding: '4px 10px',
      fontSize: 12, color: DARK, fontFamily: "'Space Mono',monospace",
      whiteSpace: 'nowrap',
    }}>
      {icon} {label}
    </span>
  )
}

function RegionBadge({ region }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px', borderRadius: 6,
      border: '1px solid #e7e0d2', background: '#faf7f0',
      fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED,
      whiteSpace: 'nowrap',
    }}>
      {region}
    </span>
  )
}

function ActionButton({ label, onClick, variant }) {
  const isPrimary = variant === 'primary'
  const isDanger = variant === 'danger'
  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClick && onClick() }}
      style={{
        fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
        padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
        border: isPrimary ? 'none' : `1.4px solid ${isDanger ? '#ef444440' : '#e7e0d2'}`,
        background: isPrimary ? DARK : isDanger ? '#fff0f0' : '#fff',
        color: isPrimary ? '#f1ede4' : isDanger ? '#ef4444' : MEDIUM,
        transition: 'opacity .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {label}
    </button>
  )
}

function SummaryBar({ deployments }) {
  const running = deployments.filter(d => d.status === 'running').length
  const stopped = deployments.filter(d => d.status === 'stopped').length
  const error = deployments.filter(d => d.status === 'error').length
  const total = deployments.length

  const items = [
    { count: running, label: 'Running', color: '#22c55e' },
    { count: stopped, label: 'Stopped', color: MUTED },
    { count: error, label: 'Error', color: '#ef4444' },
  ]

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      fontFamily: "'Space Mono',monospace", fontSize: 12,
    }}>
      <span style={{ color: MUTED, marginRight: 4 }}>{total} total</span>
      <span style={{ color: '#ddd6c8' }}>·</span>
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {i > 0 && <span style={{ color: '#ddd6c8' }}>·</span>}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: item.color + '18', color: item.color,
            padding: '3px 9px', borderRadius: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
            {item.count} {item.label}
          </span>
        </span>
      ))}
    </div>
  )
}

function DeploymentCard({ deployment }) {
  const { id, name, model, version, status, replicas, latencyMs, requestsPerSec, cost, region } = deployment

  return (
    <Link to={`/deployments/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
          padding: '20px 24px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ paddingTop: 3, flexShrink: 0 }}>
              <StatusDot status={status} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>{name}</span>
                <RegionBadge region={region} />
              </div>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED,
              }}>
                {model} <span style={{ color: '#ddd6c8' }}>·</span> {version}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <ActionButton label="Scale" />
            <ActionButton
              label={status === 'running' ? 'Pause' : 'Resume'}
              variant={status === 'running' ? 'danger' : undefined}
            />
            <ActionButton label="Logs" />
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <StatChip icon="🖥" label={`${replicas} replica${replicas !== 1 ? 's' : ''}`} />
          <StatChip icon="⚡" label={`${latencyMs !== null ? latencyMs : '—'}ms latency`} />
          <StatChip icon="📈" label={`${requestsPerSec} req/s`} />
          <StatChip icon="💰" label={`$${cost.toFixed(2)}/hr`} />
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 80, height: 16, background: '#f0ebe0', borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: 200, height: 18, background: '#f0ebe0', borderRadius: 8, marginBottom: 8 }} />
          <div style={{ width: 140, height: 12, background: '#f5f0e8', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        {[72, 90, 80, 76].map((w, i) => (
          <div key={i} style={{ width: w, height: 28, background: '#f5f0e8', borderRadius: 8 }} />
        ))}
      </div>
    </div>
  )
}

export default function DeploymentsPage() {
  const [allDeployments, setAllDeployments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetchAllDeployments().then(data => {
      setAllDeployments(data)
      setLoading(false)
    })
  }, [])

  const filtered = allDeployments.filter(d => {
    if (activeFilter === 'All') return true
    return d.status === activeFilter.toLowerCase()
  })

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PageHero
        eyebrow="DEPLOYMENTS"
        title="Deployments"
        description="Monitor and scale your production model endpoints."
        illustration={PAGE_ILLUSTRATIONS.deployments}
        illustrationAlt="Deployments illustration"
      >
        <div style={{ marginTop: 24 }}>
          <button style={{
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500, padding: '11px 20px',
            borderRadius: 10, border: 'none', background: DARK, color: '#f1ede4', cursor: 'pointer',
          }}>
            + New Deployment
          </button>
        </div>
        {!loading && allDeployments.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <SummaryBar deployments={allDeployments} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {STATUS_LABELS.map(label => {
              const isActive = activeFilter === label
              return (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  style={{
                    fontFamily: 'inherit', fontSize: 13, padding: '6px 16px', borderRadius: 20,
                    border: '1.4px solid', cursor: 'pointer', fontWeight: isActive ? 600 : 400,
                    background: isActive ? DARK : '#fff',
                    color: isActive ? '#f1ede4' : MEDIUM,
                    borderColor: isActive ? DARK : '#ddd6c8',
                    transition: 'all .15s',
                  }}
                >
                  {label}
                </button>
              )
            })}
        </div>
      </PageHero>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>
        <div style={{
          fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 20,
        }}>
          {loading
            ? 'Loading…'
            : `${filtered.length} deployment${filtered.length !== 1 ? 's' : ''}${activeFilter !== 'All' ? ` · ${activeFilter.toLowerCase()}` : ''}`
          }
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(d => <DeploymentCard key={d.id} deployment={d} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '72px 0',
            color: MUTED, fontSize: 15,
          }}>
            No {activeFilter !== 'All' ? activeFilter.toLowerCase() + ' ' : ''}deployments found.
          </div>
        )}
      </div>
    </div>
  )
}
