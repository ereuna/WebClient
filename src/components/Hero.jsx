import { Link } from 'react-router-dom'

const ACCENT = '#c2410c'
const INK = '#17202e'
const MUTED = '#545b66'

function RegMark({ style }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ position: 'absolute', ...style }}>
      <path d="M14 2V26M2 14H26" fill="none" stroke={INK} strokeWidth="1" />
      <circle cx="14" cy="14" r="7" fill="none" stroke={INK} strokeWidth="1" />
    </svg>
  )
}

export default function Hero() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#f5f2eb', borderBottom: '1px solid #ddd8cc' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="survey-grid" style={{ position: 'absolute', inset: 0 }} />
        <div className="survey-scan" style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'rgba(23,32,46,0.22)' }} />
        <RegMark style={{ left: 24, top: 24 }} />
        <RegMark style={{ right: 24, top: 24 }} />
        <RegMark style={{ left: 24, bottom: 24 }} />
        <RegMark style={{ right: 24, bottom: 24 }} />
      </div>
      <div className="survey-hero-grid" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '72px 28px 64px' }}>
        <div>
          <div className="survey-rise" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: '0.12em', color: MUTED, marginBottom: 20 }}>
            SHEET 01 · PHYSICS-INFORMED ML · GEOTHERMAL ENERGY
          </div>
          <h1 className="survey-rise survey-d1" style={{ fontSize: 58, lineHeight: 1.02, letterSpacing: '-0.035em', fontWeight: 600, margin: 0, color: INK }}>
            Ereuna
          </h1>
          <p className="survey-rise survey-d2" style={{ fontSize: 18, lineHeight: 1.55, color: MUTED, maxWidth: 470, margin: '22px 0 0' }}>
            Ereuna is a physics-informed machine learning platform for geothermal energy production in Kenya, with an integrated physics constraint checker, built on the EnergyGraph data representation schema. Includes GeoSight, a demo app running on synthetic and public data.
          </p>
          <div className="survey-rise survey-d3" style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            <Link to="/research" style={{
              background: ACCENT, color: '#fff', fontWeight: 500, fontSize: 15, textDecoration: 'none',
              padding: '13px 22px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 9,
            }}>Explore research <span aria-hidden="true" style={{ fontSize: 13 }}>→</span></Link>
            <Link to="/workbench" style={{
              background: 'transparent', border: `1px solid ${INK}`, color: INK, fontWeight: 500, textDecoration: 'none',
              fontSize: 15, padding: '13px 22px', borderRadius: 6, display: 'inline-block',
            }}>Open workbench</Link>
          </div>
        </div>
        <figure className="survey-rise survey-d2" style={{ margin: 0, background: '#fff', border: `1px solid ${INK}`, borderRadius: 2 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: MUTED, padding: '10px 14px', borderBottom: '1px solid #ddd8cc' }}>
            FIG. 1 · RESERVOIR SECTION
          </div>
          <img
            src="/illustrations/survey/05-geothermal-reservoir-slab.webp"
            alt="Isometric geothermal reservoir slab in three exploded layers, with two wellbores reaching a thermal anomaly"
            width="1400" height="933"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </figure>
      </div>
    </div>
  )
}
