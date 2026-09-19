import { Link } from 'react-router-dom'
import { CardIllustration } from './CardIllustration'

const ACCENT = '#cf5a2a'

const cards = [
  {
    title: 'PINN Reservoir Model',
    desc: 'Inverse and forward physics-informed neural networks for 3D transient heat conduction in geothermal fields.',
    tags: 'parabolic · inverse · geothermal',
    illo: '/illustrations/card-pinn-library.png',
    illoAlt: 'PINN reservoir model illustration',
  },
  {
    title: 'Thermal Conductivity Inversion PINN',
    desc: 'Inverse PINN formulation for recovering spatially varying thermal conductivity k(x) from sparse wellbore observations.',
    tags: 'type-2-inverse · k(x) · reservoir-modeling',
    illo: '/illustrations/card-domain-geothermal.png',
    illoAlt: 'Thermal conductivity inversion illustration',
  },
  {
    title: 'Transient Heat Solver',
    desc: 'Spatiotemporal field model operating on FieldState snapshots with calibrated uncertainty bounds.',
    tags: 'transient-heat · fieldstate · uncertainty',
    illo: '/illustrations/05-geothermal-reservoir-slab.png',
    illoAlt: 'Transient heat solver illustration',
  },
]

export default function ModelZoo() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>GEOTHERMAL MODELS</div>
          <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>
            Geothermal PINN Architectures.
          </h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 360, margin: 0 }}>
          Every geothermal model implements the EnergyGraph interface and passes the physics constraint checker.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {cards.map(({ title, desc, tags, illo, illoAlt }) => (
          <Link key={title} to="/models" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 16, overflow: 'hidden', height: '100%' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <CardIllustration src={illo} alt={illoAlt} height={150} />
              <div style={{ padding: '20px 22px 22px' }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 7 }}>{desc}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', marginTop: 12 }}>{tags}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
