import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'
import { fetchDashboardData } from '../api/dashboard'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BORDER = '1px solid #e7e0d2'
const MONO = "'Space Mono',monospace"

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const QUICK_ACTIONS = [
  { emoji: '🧠', label: 'New Model', desc: 'Upload or create a model repository', to: '/new?type=model' },
  { emoji: '📊', label: 'New Dataset', desc: 'Add a dataset to the platform', to: '/new?type=dataset' },
  { emoji: '🚀', label: 'Launch Training', desc: 'Start an experiment or training run', to: '/experiments' },
  { emoji: '⚡', label: 'Deploy Model', desc: 'Serve a model as an API endpoint', to: '/deployments' },
]

const METRICS_DEFAULT = [
  { label: 'Models', value: '0', accent: '#cf5a2a' },
  { label: 'Datasets', value: '0', accent: '#7c6af7' },
  { label: 'Pipelines', value: '0', accent: '#2db88a' },
  { label: 'Spaces', value: '0', accent: '#3498db' },
]

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em',
      color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function QuickActionCard({ emoji, label, desc, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
      <div
        style={{
          background: '#fff', border: CARD_BORDER, borderRadius: 14,
          padding: '20px 18px', cursor: 'pointer', transition: 'box-shadow .15s, transform .15s',
          height: '100%', boxSizing: 'border-box',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ fontSize: 26, marginBottom: 12, lineHeight: 1 }}>{emoji}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: DARK, marginBottom: 5 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </Link>
  )
}

function MetricStatCard({ label, value, accent }) {
  return (
    <div style={{
      background: '#fff', border: CARD_BORDER, borderRadius: 14,
      padding: '20px 22px', flex: 1,
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{
        fontFamily: MONO, fontSize: 11, color: MUTED,
        marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </div>
    </div>
  )
}

function ActivityItem({ title, sub, time, color, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '13px 0',
      borderBottom: isLast ? 'none' : '1px solid #f0ebe0',
    }}>
      <div style={{
        width: 9, height: 9, borderRadius: '50%', background: color,
        flexShrink: 0, marginTop: 5,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{title}</div>
        <div style={{
          fontFamily: MONO, fontSize: 10.5, color: MUTED,
          marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {sub}
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: '#b0a99a', flexShrink: 0, marginTop: 2 }}>
        {time}
      </div>
    </div>
  )
}

function ResourceCard({ name, desc, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#faf7f0', border: CARD_BORDER, borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </Link>
  )
}

function ResourceTabs({ resources }) {
  const tabs = Object.keys(resources)
  const [active, setActive] = useState(tabs[0] || 'Repositories')

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid #e7e0d2' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
              color: active === tab ? ACCENT : MUTED,
              borderBottom: active === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1, transition: 'color .15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {resources[active]?.length ? resources[active].map(r => (
          <ResourceCard key={r.name} {...r} />
        )) : (
          <div style={{ fontSize: 13, color: MUTED, padding: '12px 0' }}>No resources yet.</div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState(METRICS_DEFAULT)
  const [activity, setActivity] = useState([])
  const [resources, setResources] = useState({ Repositories: [], Datasets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
      .then(data => {
        setMetrics([
          { label: 'Models', value: String(data.metrics.models), accent: '#cf5a2a' },
          { label: 'Datasets', value: String(data.metrics.datasets), accent: '#7c6af7' },
          { label: 'Pipelines', value: String(data.metrics.pipelines), accent: '#2db88a' },
          { label: 'Spaces', value: String(data.metrics.spaces), accent: '#3498db' },
        ])
        const recent = (data.recentRepos || []).slice(0, 5).map(r => ({
          title: `${r.repo_type} updated`,
          sub: r.slug,
          time: new Date(r.updated_at).toLocaleDateString(),
          color: '#cf5a2a',
        }))
        setActivity(recent)
        const models = (data.recentRepos || []).filter(r => r.repo_type === 'MODEL').slice(0, 3)
        const datasets = (data.recentRepos || []).filter(r => r.repo_type === 'DATASET').slice(0, 3)
        setResources({
          Repositories: models.map(r => ({
            name: r.slug,
            desc: r.description || '',
            to: `/models/${r.slug}`,
          })),
          Datasets: datasets.map(r => ({
            name: r.slug,
            desc: r.description || '',
            to: `/datasets/${r.slug}`,
          })),
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const greeting = user?.full_name || user?.username || 'there'

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PageHero
        eyebrow={TODAY}
        title="Dashboard"
        description={`Good morning, ${greeting}`}
        illustration={PAGE_ILLUSTRATIONS.dashboard}
        illustrationAlt="Dashboard illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>

        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Quick Actions</SectionLabel>
          <div style={{ display: 'flex', gap: 16 }}>
            {QUICK_ACTIONS.map(a => (
              <QuickActionCard key={a.label} {...a} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Your Metrics</SectionLabel>
          {loading ? (
            <div style={{ color: MUTED, fontFamily: MONO, fontSize: 13 }}>Loading metrics…</div>
          ) : (
            <div style={{ display: 'flex', gap: 16 }}>
              {metrics.map(m => (
                <MetricStatCard key={m.label} {...m} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          <div style={{ flex: '0 0 calc(60% - 12px)', minWidth: 0 }}>
            <SectionLabel>Recent Activity</SectionLabel>
            <div style={{
              background: '#fff', border: CARD_BORDER, borderRadius: 14,
              padding: '4px 22px',
            }}>
              {activity.length === 0 ? (
                <div style={{ padding: '20px 0', color: MUTED, fontSize: 13 }}>No recent activity.</div>
              ) : activity.map((item, i) => (
                <ActivityItem key={item.sub} {...item} isLast={i === activity.length - 1} />
              ))}
            </div>
          </div>

          <div style={{ flex: '0 0 calc(40% - 12px)', minWidth: 0 }}>
            <SectionLabel>Recent Resources</SectionLabel>
            <div style={{
              background: '#fff', border: CARD_BORDER, borderRadius: 14,
              padding: '16px 20px',
            }}>
              <ResourceTabs resources={resources} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
