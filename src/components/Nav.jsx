import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import GlobalSearch from './GlobalSearch.jsx'

const ACCENT = '#cf5a2a'

const navLinks = [
  { label: 'Repositories', to: '/repositories' },
  { label: 'Models', to: '/models' },
  { label: 'Datasets', to: '/datasets' },
  { label: 'Pipelines', to: '/pipelines' },
  { label: 'Experiments', to: '/experiments' },
  { label: 'Deployments', to: '/deployments' },
  { label: 'Spaces', to: '/apps' },
  { label: 'Organizations', to: '/organizations' },
]

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = (user.full_name || user.username)
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: '1.4px solid #ddd6c8',
          borderRadius: 22, padding: '6px 12px 6px 6px',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
        }}
      >
        {user.avatar_url
          ? <img src={user.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
          : (
            <span style={{
              width: 22, height: 22, borderRadius: '50%', background: ACCENT,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
            }}>{initials}</span>
          )
        }
        <span style={{ color: '#1b1a17', fontWeight: 500 }}>{user.username}</span>
        <span style={{ fontSize: 10, color: '#8a857a' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,.1)', minWidth: 180, zIndex: 100,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0ebe0' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.username}</div>
            <div style={{ fontSize: 11, color: '#8a857a', marginTop: 2 }}>{user.email}</div>
          </div>
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Settings', to: '/settings' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '11px 16px', fontSize: 13, color: '#56524a',
                textDecoration: 'none', boxSizing: 'border-box',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #f0ebe0' }}>
            <button
              onClick={() => { setOpen(false); onLogout() }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '11px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13, color: '#56524a', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, loading, authenticated, logout } = useAuth()

  const signedIn = Boolean(user) || authenticated

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(241,237,228,0.88)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #ddd6c8',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '15px 28px',
        display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>
            <span style={{
              display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
              border: '1.6px solid #1b1a17', borderRadius: 7, fontSize: 13,
            }}>⬡</span>
            Ereuna
          </div>
        </Link>

        <div style={{ display: 'flex', gap: 22, fontSize: 14 }}>
          {navLinks.map(({ label, to }) => {
            const active = pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  color: active ? '#1b1a17' : '#56524a',
                  fontWeight: active ? 600 : 400,
                  paddingBottom: 2,
                  borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent',
                  transition: 'color .15s, border-color .15s',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <GlobalSearch style={{ width: 240 }} placeholder="Search…" />

        <Link to="/notifications" style={{ color: '#56524a', fontSize: 18, textDecoration: 'none', lineHeight: 1 }}>🔔</Link>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14 }}>
          {loading ? (
            <span style={{ color: '#a09990', fontSize: 13 }}>…</span>
          ) : (
            <>
              {signedIn && (
                <Link
                  to="/new"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: ACCENT, color: '#fff', padding: '7px 14px',
                    borderRadius: 9, fontWeight: 500, textDecoration: 'none', fontSize: 13,
                    transition: 'opacity .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                </Link>
              )}
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{ color: '#56524a', textDecoration: 'none', fontWeight: 400 }}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      background: '#1b1a17', color: '#f1ede4', padding: '8px 16px',
                      borderRadius: 9, fontWeight: 500, textDecoration: 'none',
                    }}
                  >
                    Get started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
