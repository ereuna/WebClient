import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUser } from '../api/users'

const ACCENT = '#c2410c'
const BG = '#f5f2eb'
const DARK = '#17202e'
const MEDIUM = '#545b66'
const MUTED = '#5f6670'

function getInitials(fullName) {
  const parts = (fullName || '').trim().split(' ')
  if (!parts[0]) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ActivityUnavailable() {
  return (
    <div>
      <div style={{
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
        color: '#545b66', marginBottom: 14, textTransform: 'uppercase',
      }}>
        Activity
      </div>
      <div style={{
        background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
        padding: '32px 22px', textAlign: 'center', color: MUTED, fontSize: 14,
      }}>
        Contribution activity is not available yet.
      </div>
    </div>
  )
}

function PinnedModelCard({ model }) {
  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
          padding: '18px 20px', cursor: 'pointer',
          transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#ffffff', border: '1px solid #ddd8cc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            ⬡
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{model.name}</div>
        </div>
        <div style={{ fontSize: 13, color: MEDIUM, lineHeight: 1.55 }}>
          {model.description}
        </div>
        <div style={{
          marginTop: 12, fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 10, color: '#545b66', letterSpacing: '0.04em',
        }}>
          View model →
        </div>
      </div>
    </Link>
  )
}

function ModelCard({ model }) {
  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
          padding: '20px 22px', cursor: 'pointer',
          transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 6 }}>{model.name}</div>
        <div style={{ fontSize: 13.5, color: MEDIUM, lineHeight: 1.55, marginBottom: 14 }}>{model.description}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(model.tags || []).map(tag => (
            <span key={tag} style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, background: '#efebe2', color: '#545b66',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function DatasetItem({ dataset }) {
  return (
    <Link to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
          padding: '18px 22px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 5 }}>{dataset.name}</div>
          <div style={{ fontSize: 13.5, color: MEDIUM, lineHeight: 1.55 }}>{dataset.description}</div>
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: '#545b66',
          flexShrink: 0, letterSpacing: '0.04em',
        }}>
          View →
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ icon, message }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
      padding: '52px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 14, color: MUTED }}>{message}</div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efebe2 0%,#f5f2eb 100%)',
        borderBottom: '1px solid #ddd8cc', padding: '40px 28px 44px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ddd8cc', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 22, width: 200, background: '#ddd8cc', borderRadius: 6, marginBottom: 10 }} />
            <div style={{ height: 13, width: 120, background: '#efebe2', borderRadius: 5, marginBottom: 16 }} />
            <div style={{ height: 13, width: 340, background: '#efebe2', borderRadius: 5 }} />
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px' }}>
        <div style={{ height: 400, background: '#efebe2', borderRadius: 14 }} />
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setLoading(true)
    fetchUser(username).then(data => {
      setUser(data)
      setLoading(false)
    })
  }, [username])

  if (loading) return <Skeleton />

  const contributions = (user.models?.length || 0) + (user.datasets?.length || 0)
  const pinnedModels = (user.models || []).slice(0, 2)

  const tabs = ['overview', 'models', 'datasets']

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efebe2 0%,#f5f2eb 100%)',
        borderBottom: '1px solid #ddd8cc',
        padding: '40px 28px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 600,
              flexShrink: 0,
            }}>
              {getInitials(user.fullName || user.username)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: 4 }}>
                {user.fullName}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: MUTED, marginBottom: 14,
              }}>
                @{user.username}
              </div>

              {user.bio && (
                <div style={{ fontSize: 14.5, color: MEDIUM, lineHeight: 1.6, maxWidth: 560, marginBottom: 12 }}>
                  {user.bio}
                </div>
              )}

              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
                {user.location && (
                  <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}>
                    📍 {user.location}
                  </span>
                )}
                {user.joinedAt && (
                  <span style={{ fontSize: 13, color: MUTED }}>
                    Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                <button
                  style={{
                    fontFamily: 'inherit', fontSize: 13.5, padding: '8px 18px',
                    borderRadius: 9, border: `1.5px solid #c9c4b8`,
                    background: 'transparent', color: DARK, fontWeight: 500, cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#efebe2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Follow
                </button>
                <button
                  style={{
                    fontFamily: 'inherit', fontSize: 13.5, padding: '8px 18px',
                    borderRadius: 9, border: `1.5px solid #c9c4b8`,
                    background: 'transparent', color: DARK, fontWeight: 500, cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#efebe2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Message
                </button>
              </div>

              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: MEDIUM,
                display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
                marginBottom: 4,
              }}>
                <span>
                  <strong style={{ color: DARK }}>{user.followers}</strong>
                  {' '}Followers
                </span>
                <span style={{ color: '#c9c4b8' }}>·</span>
                <span>
                  <strong style={{ color: DARK }}>{user.following}</strong>
                  {' '}Following
                </span>
                <span style={{ color: '#c9c4b8' }}>·</span>
                <span>
                  <strong style={{ color: DARK }}>{contributions}</strong>
                  {' '}Contributions
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #ddd8cc', marginTop: 4 }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: 'inherit', fontSize: 13.5, padding: '13px 20px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeTab === tab ? DARK : MUTED,
                  fontWeight: activeTab === tab ? 600 : 400,
                  borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
                  marginBottom: -1,
                  textTransform: 'capitalize',
                  transition: 'color .15s',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'models' && (
                  <span style={{
                    marginLeft: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                    background: '#efebe2', color: MUTED, borderRadius: 10,
                    padding: '2px 7px',
                  }}>
                    {(user.models || []).length}
                  </span>
                )}
                {tab === 'datasets' && (
                  <span style={{
                    marginLeft: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                    background: '#efebe2', color: MUTED, borderRadius: 10,
                    padding: '2px 7px',
                  }}>
                    {(user.datasets || []).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
                color: '#545b66', marginBottom: 14, textTransform: 'uppercase',
              }}>
                Pinned Models
              </div>
              {pinnedModels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {pinnedModels.map(model => (
                    <PinnedModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div style={{
                  background: '#fff', border: '1px solid #ddd8cc', borderRadius: 14,
                  padding: '40px 24px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>⬡</div>
                  <div style={{ fontSize: 14, color: MUTED }}>No pinned models yet.</div>
                </div>
              )}
            </div>

            <div>
              <ActivityUnavailable />
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div>
            {(user.models || []).length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 18,
              }}>
                {user.models.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <EmptyState icon="⬡" message="This user hasn't published any models yet." />
            )}
          </div>
        )}

        {activeTab === 'datasets' && (
          <div>
            {(user.datasets || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {user.datasets.map(dataset => (
                  <DatasetItem key={dataset.id} dataset={dataset} />
                ))}
              </div>
            ) : (
              <EmptyState icon="◫" message="This user hasn't published any datasets yet." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
