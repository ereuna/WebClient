import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllOrganizations } from '../api/organizations'

const PLAN_BADGE = {
  free: { background: '#f5f0e8', color: '#8a857a', label: 'Free' },
  pro: { background: '#dbeafe', color: '#1d4ed8', label: 'Pro' },
  enterprise: { background: '#fef3c7', color: '#92400e', label: 'Enterprise' },
}

const PLAN_AVATAR_BG = {
  free: '#e7e0d2',
  pro: '#bfdbfe',
  enterprise: '#fde68a',
}

const PLAN_AVATAR_COLOR = {
  free: '#8a857a',
  pro: '#1d4ed8',
  enterprise: '#92400e',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function OrgCard({ org }) {
  const badge = PLAN_BADGE[org.plan] || PLAN_BADGE.free
  const avatarBg = PLAN_AVATAR_BG[org.plan] || PLAN_AVATAR_BG.free
  const avatarColor = PLAN_AVATAR_COLOR[org.plan] || PLAN_AVATAR_COLOR.free

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e7e0d2',
        borderRadius: 14,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'box-shadow .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: org.avatar ? 'transparent' : avatarBg,
            color: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 17,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {org.avatar
            ? <img src={org.avatar} alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : getInitials(org.name)
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link
              to={`/organizations/${org.slug}`}
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: '#1b1a17',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              {org.name}
            </Link>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 6,
                background: badge.background,
                color: badge.color,
                whiteSpace: 'nowrap',
              }}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: 13.5,
          color: '#56524a',
          lineHeight: 1.55,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {org.description}
      </p>

      <div style={{ fontSize: 13, color: '#8a857a', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <span>👥 {org.memberCount} members</span>
        <span style={{ color: '#ddd6c8' }}>·</span>
        <span>🧠 {org.modelCount} models</span>
        <span style={{ color: '#ddd6c8' }}>·</span>
        <span>📊 {org.datasetCount} datasets</span>
      </div>

      <div>
        <Link
          to={`/organizations/${org.slug}`}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#cf5a2a',
            textDecoration: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          View Organization →
        </Link>
      </div>
    </div>
  )
}

export default function OrganizationsPage() {
  const [allOrgs, setAllOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchAllOrganizations().then(data => { setAllOrgs(data); setLoading(false) })
  }, [])

  const filtered = allOrgs.filter(org =>
    !query ||
    org.name.toLowerCase().includes(query.toLowerCase()) ||
    org.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.08em', color: '#cf5a2a', marginBottom: 16 }}>
            ORGANIZATIONS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 46, letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.06, margin: 0, color: '#1b1a17' }}>
                Organizations
              </h1>
              <p style={{ fontSize: 16, color: '#56524a', marginTop: 14, maxWidth: 540, lineHeight: 1.6 }}>
                Collaborate with your team on models, datasets, and pipelines.
              </p>
            </div>
            <button
              style={{
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                background: '#1b1a17',
                color: '#f1ede4',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#cf5a2a'}
              onMouseLeave={e => e.currentTarget.style.background = '#1b1a17'}
            >
              + New Organization
            </button>
          </div>
          <div style={{ marginTop: 28 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search organizations…"
              style={{
                fontFamily: 'inherit',
                fontSize: 14,
                padding: '9px 14px',
                borderRadius: 9,
                border: '1.4px solid #ddd6c8',
                background: '#fff',
                outline: 'none',
                width: 260,
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} organization${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 180, background: '#f0ebe0', borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {filtered.map(org => <OrgCard key={org.id} org={org} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8a857a', fontSize: 15 }}>
            No organizations match your search.
          </div>
        )}
      </div>
    </div>
  )
}
