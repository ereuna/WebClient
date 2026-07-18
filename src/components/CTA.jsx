import { Link } from 'react-router-dom'

const ACCENT = '#cf5a2a'
export default function CTA() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px 64px', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>
        FROM OLKARIA TO WAIRAKEI TO CADARACHE
      </div>
      <h2 style={{ fontSize: 46, lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 600, margin: '16px auto 0', maxWidth: 680 }}>
        Make every energy model reusable by the next person who needs it.
      </h2>
      <div style={{ display: 'flex', gap: 13, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
        <Link to="/models" style={{ textDecoration: 'none' }}>
          <span style={{
            background: ACCENT, color: '#fff', fontWeight: 500, fontSize: 15,
            padding: '14px 24px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-block',
          }}>Browse the model zoo →</span>
        </Link>
        <Link to="/docs" style={{ textDecoration: 'none' }}>
          <span style={{
            background: '#fff', border: '1.4px solid #d8d1c2', color: '#1b1a17', fontWeight: 500,
            fontSize: 15, padding: '14px 24px', borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-block',
          }}>Read the docs</span>
        </Link>
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginTop: 18 }}>
        git clone the repo → cd EreunaCLI → pip install -e .
      </div>
    </div>
  )
}
