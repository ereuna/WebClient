const ACCENT = '#cf5a2a'

export default function EnergyGraph() {
  const features = [
    { title: 'PhysicsSpec', desc: 'PDE class, boundary conditions and inferred terms — the basis for weight transfer.' },
    { title: 'SensorGraph', desc: 'Wells and instruments as nodes; physical relationships as weighted edges.' },
    { title: 'FieldState', desc: 'A discretised field snapshot with per-node calibrated uncertainty.' },
    { title: 'MaterialSpec', desc: 'Composition, crystal graph and operating conditions for materials GNNs.' },
  ]
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px 30px' }}>
      <div style={{
        background: '#fff', border: '1px solid #e7e0d2', borderRadius: 20,
        padding: '46px 46px 38px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#ece5d6 1px,transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.5,
        }}/>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 30, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>★ THE MISSING ABSTRACTION LAYER</div>
            <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0', maxWidth: 480 }}>
              One representation for<br />every energy model.
            </h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 340, margin: '6px 0 0' }}>
            Text has the token. Energy ML had nothing — until <strong>EnergyGraph</strong>. Four composable
            objects encode the physics that lets any model's inputs and outputs interoperate, and weights transfer.
          </p>
        </div>
        <div style={{ position: 'relative', marginTop: 18 }}>
          <img
            src="/illustrations/01-energygraph-four-layers.png"
            alt="EnergyGraph four-layer architecture"
            style={{ width: '100%', borderRadius: 12, display: 'block' }}
          />
        </div>
        <div style={{
          position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 22, marginTop: 24, borderTop: '1px solid #ece5d6', paddingTop: 26,
        }}>
          {features.map(f => (
            <div key={f.title}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#56524a', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
