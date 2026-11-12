import { Link } from 'react-router-dom'

const ACCENT = '#c2410c'
export default function CTA() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px 64px', textAlign: 'center' }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: '#545b66' }}>
        BUILT FOR GEOTHERMAL SUBSURFACE DATA
      </div>
      <h2 style={{ fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 600, margin: '16px auto 0', maxWidth: 680 }}>
        Physics-informed machine learning platform for geothermal energy.
      </h2>
      <div style={{ display: 'flex', gap: 13, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
        <Link to="/research" style={{ textDecoration: 'none' }}>
          <span style={{
            background: ACCENT, color: '#fff', fontWeight: 500, fontSize: 15,
            padding: '14px 24px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-block',
          }}>Explore research →</span>
        </Link>
        <Link to="/workbench" style={{ textDecoration: 'none' }}>
          <span style={{
            background: '#fff', border: '1.4px solid #c9c4b8', color: '#17202e', fontWeight: 500,
            fontSize: 15, padding: '14px 24px', borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-block',
          }}>Open workbench</span>
        </Link>
      </div>

      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', marginTop: 18 }}>
        git clone the repo → cd EreunaCLI → pip install -e .
      </div>
    </div>
  )
}
