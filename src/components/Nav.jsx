import { Link, useLocation } from 'react-router-dom'

const ACCENT = '#cf5a2a'

const navLinks = [
  { label: 'Models', to: '/models' },
  { label: 'Datasets', to: '/datasets' },
  { label: 'Benchmarks', to: '/benchmarks' },
  { label: 'Apps', to: '/apps' },
  { label: 'Docs', to: '/docs' },
]

export default function Nav() {
  const { pathname } = useLocation()

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
            Aether
          </div>
        </Link>

        <div style={{ display: 'flex', gap: 22, fontSize: 14 }}>
          {navLinks.map(({ label, to }) => {
            const active = pathname === to
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

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 14 }}>
          <span style={{ color: '#56524a', cursor: 'pointer' }}>Sign in</span>
          <span style={{
            background: '#1b1a17', color: '#f1ede4', padding: '8px 16px',
            borderRadius: 9, fontWeight: 500, cursor: 'pointer',
          }}>Get started</span>
        </div>
      </div>
    </div>
  )
}
