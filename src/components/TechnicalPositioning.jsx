const ACCENT = '#cf5a2a'

export default function TechnicalPositioning() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 20px' }}>
      <div style={{
        background: '#1b1a17', color: '#f1ede4', borderRadius: 20, padding: '44px 46px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#34322d 1px,transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.6,
        }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT, marginBottom: 12 }}>
            TECHNICAL FORMULATION
          </div>
          <h2 style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            Inverse Physics-Informed Formulation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24, fontSize: 14.5, lineHeight: 1.65, color: '#cdc6b8' }}>
            <div>
              <p style={{ margin: 0 }}>
                Geothermal reservoir modelling of this class is a <strong style={{ color: '#fff' }}>Type 2 inverse PINN problem</strong>: 3D transient heat conduction with spatially varying thermal conductivity <code style={{ fontFamily: "'Space Mono',monospace", color: ACCENT }}>k(x)</code>.
              </p>
            </div>
            <div>
              <p style={{ margin: 0 }}>
                Inverse PINN formulations are the relevant archetype where subsurface parameters are unknown rather than given, allowing parameter recovery directly from sparse temperature and flow observations.
              </p>
            </div>
          </div>
          <div style={{
            marginTop: 28, paddingTop: 20, borderTop: '1px solid #34322d',
            fontFamily: "'Space Mono',monospace", fontSize: 12.5, color: '#a09990',
          }}>
            Governing PDE: &nbsp; <span style={{ color: '#fff' }}>ρ c_p (∂T / ∂t) - ∇ · (k(x) ∇T) = q(x,t)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
