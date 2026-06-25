import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchOrganization } from '../api/organizations'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BORDER = '1px solid #e7e0d2'
const ROW_BORDER = '1px solid #f0ebe0'

const PLAN_COLORS = {
  enterprise: { bg: '#1b1a1714', color: DARK, label: 'Enterprise' },
  pro: { bg: '#cf5a2a18', color: ACCENT, label: 'Pro' },
  free: { bg: '#8a857a14', color: MUTED, label: 'Free' },
}

const TABS = ['Overview', 'Members', 'Teams', 'Usage', 'Billing', 'Audit Logs']

const MOCK_MEMBERS = [
  { id: 1, username: 'TomiTsuma', initials: 'TT', role: 'Owner', joined: 'Jun 1, 2025' },
  { id: 2, username: 'aether-ai', initials: 'AA', role: 'Admin', joined: 'Jun 1, 2025' },
  { id: 3, username: 'ml-researcher', initials: 'MR', role: 'Member', joined: 'Jul 14, 2025' },
  { id: 4, username: 'data-eng', initials: 'DE', role: 'Member', joined: 'Aug 3, 2025' },
  { id: 5, username: 'devops-lead', initials: 'DL', role: 'Admin', joined: 'Sep 20, 2025' },
]

const MOCK_TEAMS = [
  { id: 1, name: 'ML Team', memberCount: 8, permissions: 'Read · Write · Deploy', color: '#cf5a2a' },
  { id: 2, name: 'Data Team', memberCount: 5, permissions: 'Read · Write', color: '#4a7c59' },
  { id: 3, name: 'DevOps', memberCount: 3, permissions: 'Read · Deploy · Admin', color: '#2a6bcf' },
]

const MOCK_ACTIVITY = [
  { id: 1, text: 'aether-ai added model bert-v3', time: '2h ago', icon: '◈' },
  { id: 2, text: 'TomiTsuma joined the team', time: '1d ago', icon: '◉' },
  { id: 3, text: 'ml-researcher uploaded dataset wiki-corpus-v2', time: '2d ago', icon: '◈' },
  { id: 4, text: 'devops-lead scaled deployment inference-endpoint-1', time: '3d ago', icon: '◎' },
  { id: 5, text: 'data-eng created experiment fine-tune-run-42', time: '4d ago', icon: '◈' },
]

const MONTHLY_USAGE = [
  { month: 'Jan', value: 55 },
  { month: 'Feb', value: 70 },
  { month: 'Mar', value: 62 },
  { month: 'Apr', value: 88 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 78 },
]

const AUDIT_LOGS = [
  { id: 1, ts: '2026-06-25 14:32', user: 'TomiTsuma', action: 'model.create', resource: 'bert-v3', ip: '192.168.1.4' },
  { id: 2, ts: '2026-06-25 13:01', user: 'aether-ai', action: 'member.invite', resource: 'ml-researcher', ip: '10.0.0.2' },
  { id: 3, ts: '2026-06-24 22:18', user: 'devops-lead', action: 'deployment.scale', resource: 'inference-endpoint-1', ip: '10.0.0.9' },
  { id: 4, ts: '2026-06-24 17:55', user: 'data-eng', action: 'dataset.upload', resource: 'wiki-corpus-v2', ip: '172.16.0.5' },
  { id: 5, ts: '2026-06-23 11:44', user: 'TomiTsuma', action: 'billing.update', resource: 'enterprise-plan', ip: '192.168.1.4' },
  { id: 6, ts: '2026-06-23 09:30', user: 'aether-ai', action: 'team.create', resource: 'ML Team', ip: '10.0.0.2' },
  { id: 7, ts: '2026-06-22 16:12', user: 'ml-researcher', action: 'model.delete', resource: 'gpt2-small-v1', ip: '172.16.0.11' },
  { id: 8, ts: '2026-06-21 08:05', user: 'devops-lead', action: 'deployment.create', resource: 'inference-endpoint-2', ip: '10.0.0.9' },
]

const ROLE_COLORS = {
  Owner: { bg: '#cf5a2a18', color: ACCENT },
  Admin: { bg: '#1b1a1714', color: DARK },
  Member: { bg: '#8a857a14', color: MUTED },
}

const ACTION_COLORS = {
  'model.create': '#4a7c59',
  'model.delete': '#c0392b',
  'member.invite': '#2a6bcf',
  'deployment.scale': '#8e44ad',
  'deployment.create': '#8e44ad',
  'dataset.upload': '#cf5a2a',
  'billing.update': '#1b1a17',
  'team.create': '#16a085',
}

function InitialAvatar({ initials, size, fontSize, color }) {
  const s = size || 48
  const fs = fontSize || 18
  const c = color || ACCENT
  return (
    <div style={{
      width: s, height: s, borderRadius: '50%',
      background: c + '22', border: `2px solid ${c}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Mono',monospace", fontSize: fs, fontWeight: 700, color: c,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function PlanBadge({ plan }) {
  const p = PLAN_COLORS[plan] || PLAN_COLORS.free
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
      background: p.bg, color: p.color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {p.label}
    </span>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#fff', border: CARD_BORDER, borderRadius: 14,
      padding: '22px 24px', flex: 1,
    }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: DARK, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12.5, color: MUTED, marginTop: 6 }}>{sub}</div>}
    </div>
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

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e7e0d2' }} />
            <div>
              <div style={{ height: 32, width: 220, background: '#e7e0d2', borderRadius: 8, marginBottom: 12 }} />
              <div style={{ height: 14, width: 320, background: '#ece5d6', borderRadius: 6 }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px' }}>
        <div style={{ height: 400, background: '#f0ebe0', borderRadius: 14 }} />
      </div>
    </div>
  )
}

function OverviewTab({ org }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <StatCard label="Models" value={org.modelCount} sub={`${org.modelCount} total repositories`} />
        <StatCard label="Datasets" value={org.datasetCount} sub={`${org.datasetCount} total datasets`} />
        <StatCard label="Storage Used" value="8.4 TB" sub="of unlimited storage" />
      </div>
      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '24px 28px' }}>
        <SectionLabel>Recent Activity</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {MOCK_ACTIVITY.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 0',
              borderBottom: i < MOCK_ACTIVITY.length - 1 ? ROW_BORDER : 'none',
            }}>
              <span style={{ fontSize: 16, color: ACCENT, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: DARK, flex: 1 }}>{item.text}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, flexShrink: 0 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MembersTab() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionLabel>Members ({MOCK_MEMBERS.length})</SectionLabel>
        <button style={{
          fontFamily: 'inherit', fontSize: 13, padding: '9px 18px', borderRadius: 9,
          border: 'none', background: DARK, color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
        }}>
          + Invite Member
        </button>
      </div>
      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '48px 1fr 120px 140px 100px',
          padding: '10px 20px',
          background: '#faf7f0', borderBottom: CARD_BORDER,
          fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
          gap: 16, alignItems: 'center',
        }}>
          <div />
          <div>Username</div>
          <div>Role</div>
          <div>Joined</div>
          <div />
        </div>
        {MOCK_MEMBERS.map((m, i) => {
          const rc = ROLE_COLORS[m.role] || ROLE_COLORS.Member
          return (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 120px 140px 100px',
              padding: '14px 20px',
              borderBottom: i < MOCK_MEMBERS.length - 1 ? ROW_BORDER : 'none',
              gap: 16, alignItems: 'center',
            }}>
              <InitialAvatar initials={m.initials} size={36} fontSize={13} color={ACCENT} />
              <div style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{m.username}</div>
              <div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                  background: rc.bg, color: rc.color,
                  fontFamily: "'Space Mono',monospace", fontSize: 10.5, fontWeight: 700,
                }}>
                  {m.role}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11.5, color: MUTED }}>{m.joined}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {m.role !== 'Owner' && (
                  <button style={{
                    fontFamily: 'inherit', fontSize: 12, padding: '6px 12px', borderRadius: 7,
                    border: '1px solid #e7e0d2', background: '#fff', color: '#c0392b', cursor: 'pointer',
                  }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamsTab() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionLabel>Teams ({MOCK_TEAMS.length})</SectionLabel>
        <button style={{
          fontFamily: 'inherit', fontSize: 13, padding: '9px 18px', borderRadius: 9,
          border: 'none', background: DARK, color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
        }}>
          + New Team
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_TEAMS.map(team => (
          <div key={team.id} style={{
            background: '#fff', border: CARD_BORDER, borderRadius: 14,
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: team.color + '18', border: `1.5px solid ${team.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: team.color,
              flexShrink: 0,
            }}>
              {team.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 4 }}>{team.name}</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                  {team.memberCount} members
                </span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                  {team.permissions}
                </span>
              </div>
            </div>
            <button style={{
              fontFamily: 'inherit', fontSize: 13, padding: '8px 16px', borderRadius: 8,
              border: '1px solid #e7e0d2', background: '#fff', color: DARK, cursor: 'pointer',
              fontWeight: 500,
            }}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageTab() {
  const maxVal = Math.max(...MONTHLY_USAGE.map(d => d.value))
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <StatCard label="Compute Hours" value="1,240h" sub="this month" />
        <StatCard label="Storage" value="8.4 TB" sub="total used" />
        <StatCard label="Inference Calls" value="2.1M" sub="this month" />
        <StatCard label="Active Deployments" value="5" sub="running now" />
      </div>
      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '24px 28px' }}>
        <SectionLabel>Monthly Compute Usage</SectionLabel>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 160, paddingBottom: 28, position: 'relative' }}>
          {MONTHLY_USAGE.map(d => {
            const barH = Math.round((d.value / maxVal) * 120)
            return (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: MUTED }}>{d.value}h</div>
                <div
                  style={{
                    width: '100%', height: barH,
                    background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT}88 100%)`,
                    borderRadius: '6px 6px 3px 3px',
                    transition: 'opacity .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                />
                <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: MUTED }}>{d.month}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BillingTab({ plan }) {
  const planDetails = {
    enterprise: {
      label: 'Enterprise',
      price: '$999/mo',
      features: ['Unlimited models', 'Unlimited datasets', 'Priority support', 'SLA guarantee', 'Custom integrations', 'Advanced audit logs'],
    },
    pro: {
      label: 'Pro',
      price: '$49/mo',
      features: ['100 models', '50 datasets', 'Email support', 'Basic analytics'],
    },
    free: {
      label: 'Free',
      price: '$0/mo',
      features: ['10 models', '5 datasets', 'Community support'],
    },
  }
  const details = planDetails[plan] || planDetails.free
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '24px 28px', marginBottom: 16 }}>
          <SectionLabel>Current Plan</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 4 }}>{details.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT, letterSpacing: '-0.02em' }}>{details.price}</div>
            </div>
            <PlanBadge plan={plan} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {details.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: MEDIUM }}>
                <span style={{ color: '#4a7c59', fontSize: 13 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
          <button style={{
            fontFamily: 'inherit', fontSize: 14, padding: '12px 24px', borderRadius: 10,
            border: 'none', background: DARK, color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
            width: '100%',
          }}>
            Upgrade Plan
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '22px 24px' }}>
          <SectionLabel>Payment Method</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 34, borderRadius: 6, background: '#1b1a17',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#f1ede4', fontWeight: 700,
            }}>
              VISA
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>Visa ending in 4242</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Expires 09 / 2028</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '22px 24px' }}>
          <SectionLabel>Billing Info</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Next billing date', 'Jul 1, 2026'],
              ['Billing cycle', 'Monthly'],
              ['Invoice email', 'billing@aether.energy'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: MUTED }}>{k}</span>
                <span style={{ fontWeight: 500, color: DARK }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuditLogsTab() {
  return (
    <div>
      <SectionLabel>Audit Logs</SectionLabel>
      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '160px 130px 160px 1fr 110px',
          padding: '10px 20px',
          background: '#faf7f0', borderBottom: CARD_BORDER,
          fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
          gap: 16,
        }}>
          <div>Timestamp</div>
          <div>User</div>
          <div>Action</div>
          <div>Resource</div>
          <div>IP</div>
        </div>
        {AUDIT_LOGS.map((log, i) => {
          const ac = ACTION_COLORS[log.action] || DARK
          return (
            <div key={log.id} style={{
              display: 'grid', gridTemplateColumns: '160px 130px 160px 1fr 110px',
              padding: '13px 20px',
              borderBottom: i < AUDIT_LOGS.length - 1 ? ROW_BORDER : 'none',
              gap: 16, alignItems: 'center',
            }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>{log.ts}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{log.user}</div>
              <div>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 6,
                  background: ac + '15', color: ac,
                  fontFamily: "'Space Mono',monospace", fontSize: 10.5, fontWeight: 600,
                }}>
                  {log.action}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: MEDIUM }}>{log.resource}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>{log.ip}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrganizationDetailPage() {
  const { orgSlug } = useParams()
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchOrganization(orgSlug)
      .then(data => {
        setOrg(data)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [orgSlug])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: MUTED }}>Organization not found.</div>
        <Link to="/organizations" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Organizations</Link>
      </div>
    )
  }

  const orgInitials = org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/organizations" style={{ color: MUTED, textDecoration: 'none' }}>Organizations</Link>
            <span>›</span>
            <span style={{ color: DARK }}>{org.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <InitialAvatar initials={orgInitials} size={72} fontSize={26} color={ACCENT} />
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: DARK }}>
                    {org.name}
                  </h1>
                  <PlanBadge plan={org.plan} />
                </div>
                <p style={{ fontSize: 14.5, color: MEDIUM, margin: '0 0 14px', maxWidth: 500, lineHeight: 1.6 }}>
                  {org.description}
                </p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { label: 'members', value: org.memberCount },
                    { label: 'models', value: org.modelCount },
                    { label: 'datasets', value: org.datasetCount },
                  ].map(s => (
                    <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Space Mono',monospace", fontSize: 12, color: MUTED }}>
                      <strong style={{ color: DARK, fontSize: 13 }}>{s.value}</strong>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
              <button style={{
                fontFamily: 'inherit', fontSize: 13.5, padding: '10px 18px', borderRadius: 9,
                border: '1.4px solid #ddd6c8', background: '#fff', color: DARK, cursor: 'pointer', fontWeight: 500,
              }}>
                Settings
              </button>
              <button style={{
                fontFamily: 'inherit', fontSize: 13.5, padding: '10px 18px', borderRadius: 9,
                border: 'none', background: DARK, color: '#f1ede4', cursor: 'pointer', fontWeight: 500,
              }}>
                + Invite Member
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #e3dccd' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500,
                  padding: '13px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                  color: activeTab === tab ? DARK : MUTED,
                  borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
                  marginBottom: -1, transition: 'color .15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>
        {activeTab === 'Overview' && <OverviewTab org={org} />}
        {activeTab === 'Members' && <MembersTab />}
        {activeTab === 'Teams' && <TeamsTab />}
        {activeTab === 'Usage' && <UsageTab />}
        {activeTab === 'Billing' && <BillingTab plan={org.plan} />}
        {activeTab === 'Audit Logs' && <AuditLogsTab />}
      </div>
    </div>
  )
}
