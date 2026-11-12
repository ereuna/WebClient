import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchNotifications } from '../api/notifications'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const MONO = "'Space Mono',monospace"
const CARD_BORDER = '1px solid #e7e0d2'

const TYPE_ICONS = {
  pipeline_completed: '🔄',
  experiment_failed: '⚠️',
  deployment_error: '⚠️',
  model_starred: '⭐',
  org_invite: '👥',
  dataset_comment: '💬',
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function NotificationRow({ notif, onMarkRead }) {
  const [hovered, setHovered] = useState(false)
  const icon = TYPE_ICONS[notif.type] || '🔔'

  const iconBg = notif.read
    ? 'rgba(139,133,122,0.12)'
    : 'rgba(207,90,42,0.12)'

  const rowBg = notif.read
    ? (hovered ? '#f9f5ee' : '#fff')
    : (hovered ? '#f5f0e8' : '#faf7f0')

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 22px',
        background: rowBg,
        borderBottom: CARD_BORDER,
        borderLeft: notif.read ? '3px solid transparent' : `3px solid ${ACCENT}`,
        transition: 'background .15s',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: notif.read ? 500 : 700,
          color: DARK,
          marginBottom: 4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {notif.title}
        </div>
        <div style={{
          fontSize: 13,
          color: MEDIUM,
          lineHeight: 1.5,
          marginBottom: 4,
        }}>
          {notif.body}
        </div>
        <div style={{
          fontFamily: MONO,
          fontSize: 10.5,
          color: MUTED,
          letterSpacing: '0.04em',
        }}>
          {timeAgo(notif.createdAt)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {!notif.read && (
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#3b82f6',
          }} />
        )}
        <Link
          to={notif.link}
          style={{
            fontSize: 18,
            color: MUTED,
            textDecoration: 'none',
            lineHeight: 1,
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = ACCENT}
          onMouseLeave={e => e.currentTarget.style.color = MUTED}
        >
          →
        </Link>
      </div>
    </div>
  )
}

const TABS = ['All', 'Unread', 'Read']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetchNotifications().then(data => {
      setNotifications(data)
      setLoading(false)
    })
  }, [])

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.read
    if (activeTab === 'Read') return n.read
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 36px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <h1 style={{
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: DARK,
                  margin: 0,
                  lineHeight: 1.1,
                }}>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <div style={{
                    background: ACCENT,
                    color: '#fff',
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '3px 10px',
                    borderRadius: 20,
                    lineHeight: 1.6,
                  }}>
                    {unreadCount} unread
                  </div>
                )}
              </div>
              <div style={{ fontSize: 15, color: MEDIUM, marginTop: 6 }}>
                Stay up to date with your pipeline runs, experiments, and activity.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  padding: '9px 16px',
                  border: `1px solid ${ACCENT}`,
                  borderRadius: 8,
                  background: unreadCount === 0 ? 'transparent' : ACCENT,
                  color: unreadCount === 0 ? MUTED : '#fff',
                  cursor: unreadCount === 0 ? 'default' : 'pointer',
                  transition: 'background .15s, color .15s',
                  opacity: unreadCount === 0 ? 0.5 : 1,
                }}
              >
                Mark all as read
              </button>
              <Link
                to="/settings#notifications"
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  padding: '9px 16px',
                  border: CARD_BORDER,
                  borderRadius: 8,
                  background: '#fff',
                  color: MEDIUM,
                  textDecoration: 'none',
                  transition: 'box-shadow .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 80px' }}>
        <div style={{
          background: '#fff',
          border: CARD_BORDER,
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            gap: 0,
            borderBottom: CARD_BORDER,
            padding: '0 6px',
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: activeTab === tab ? ACCENT : MUTED,
                  borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color .15s',
                }}
              >
                {tab}
                {tab === 'Unread' && unreadCount > 0 && (
                  <span style={{
                    marginLeft: 6,
                    background: activeTab === 'Unread' ? ACCENT : '#e7e0d2',
                    color: activeTab === 'Unread' ? '#fff' : MUTED,
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 9.5,
                    fontWeight: 700,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading && (
            <div style={{
              padding: '48px 22px',
              textAlign: 'center',
              fontFamily: MONO,
              fontSize: 11,
              color: MUTED,
              letterSpacing: '0.06em',
            }}>
              LOADING...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{
              padding: '64px 22px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🔔</div>
              <div style={{
                fontFamily: MONO,
                fontSize: 11,
                color: MUTED,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                No notifications here.
              </div>
            </div>
          )}

          {!loading && filtered.map(notif => (
            <NotificationRow
              key={notif.id}
              notif={notif}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
