import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchOrganization, fetchOrganizationMembers, fetchOrganizationTeams } from '../api/organizations'

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

function UnavailablePanel({ title }) {
  return (
    <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '40px 28px', textAlign: 'center', color: MUTED }}>
      {title} is not available yet.
    </div>
  )
}

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
        <StatCard label="Storage Used" value="—" sub="Usage API not available" />
      </div>
      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '24px 28px', color: MUTED, fontSize: 13 }}>
        Activity feed will appear here when audit events are exposed via API.
      </div>
    </div>
  )
}

function MembersTab({ members = [] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionLabel>Members ({members.length})</SectionLabel>
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
        {members.length === 0 ? (
          <div style={{ padding: 24, color: MUTED, fontSize: 13 }}>No members found.</div>
        ) : members.map((m, i) => {
          const role = m.role?.charAt(0).toUpperCase() + m.role?.slice(1) || 'Member'
          const rc = ROLE_COLORS[role] || ROLE_COLORS.Member
          const initials = (m.username || 'U').slice(0, 2).toUpperCase()
          return (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 120px 140px 100px',
              padding: '14px 20px',
              borderBottom: i < members.length - 1 ? ROW_BORDER : 'none',
              gap: 16, alignItems: 'center',
            }}>
              <InitialAvatar initials={initials} size={36} fontSize={13} color={ACCENT} />
              <div style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{m.username}</div>
              <div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                  background: rc.bg, color: rc.color,
                  fontFamily: "'Space Mono',monospace", fontSize: 10.5, fontWeight: 700,
                }}>
                  {role}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11.5, color: MUTED }}>
                {m.joined ? new Date(m.joined).toLocaleDateString() : '—'}
              </div>
              <div />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamsTab({ teams = [] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionLabel>Teams ({teams.length})</SectionLabel>
        <button style={{
          fontFamily: 'inherit', fontSize: 13, padding: '9px 18px', borderRadius: 9,
          border: 'none', background: DARK, color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
        }}>
          + New Team
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {teams.length === 0 ? (
          <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 24, color: MUTED }}>No teams yet.</div>
        ) : teams.map(team => (
          <div key={team.id} style={{
            background: '#fff', border: CARD_BORDER, borderRadius: 14,
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: ACCENT + '18', border: `1.5px solid ${ACCENT}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: ACCENT,
              flexShrink: 0,
            }}>
              {team.name.slice(0, 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{team.name}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4 }}>{team.description || team.permissions}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageTab() {
  return <UnavailablePanel title="Usage analytics" />
}

function AuditLogsTab() {
  return <UnavailablePanel title="Audit logs" />
}

function BillingTab({ plan }) {
  return (
    <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: '24px 28px' }}>
      <SectionLabel>Current Plan</SectionLabel>
      <div style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8 }}>{plan || 'free'}</div>
      <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Billing management is not available via API yet.</p>
    </div>
  )
}

export default function OrganizationDetailPage() {
  const { orgSlug } = useParams()
  const [org, setOrg] = useState(null)
  const [members, setMembers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchOrganization(orgSlug)
      .then(async data => {
        setOrg(data)
        const [m, t] = await Promise.all([
          fetchOrganizationMembers(data.id).catch(() => []),
          fetchOrganizationTeams(data.id).catch(() => []),
        ])
        setMembers(m)
        setTeams(t)
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
        {activeTab === 'Members' && <MembersTab members={members} />}
        {activeTab === 'Teams' && <TeamsTab teams={teams} />}
        {activeTab === 'Usage' && <UsageTab />}
        {activeTab === 'Billing' && <BillingTab plan={org.plan} />}
        {activeTab === 'Audit Logs' && <AuditLogsTab />}
      </div>
    </div>
  )
}
