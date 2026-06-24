const ACCENT = '#cf5a2a'

export default function Hero() {
  return (
    <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 70%)', borderBottom: '1px solid #e3dccd' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '64px 28px 60px',
        display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 36, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.08em', color: ACCENT, marginBottom: 20 }}>
            PHYSICS-INFORMED ML · THE ENERGY STACK
          </div>
          <h1 style={{ fontSize: 58, lineHeight: 1.02, letterSpacing: '-0.03em', fontWeight: 600, margin: 0 }}>
            Energy ML,<br />finally reusable.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: '#56524a', maxWidth: 430, margin: '22px 0 0' }}>
            The community hub for physics-informed models across geothermal, nuclear, wind, solar, hydro
            and grid — sharing one representation, <strong style={{ color: '#1b1a17' }}>EnergyGraph</strong>,
            so every model travels.
          </p>
          <div style={{ display: 'flex', gap: 13, marginTop: 30, flexWrap: 'wrap' }}>
            <button style={{
              background: ACCENT, color: '#fff', fontWeight: 500, fontSize: 15,
              padding: '13px 22px', borderRadius: 11, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'inherit',
            }}>Browse models <span style={{ fontSize: 13 }}>→</span></button>
            <button style={{
              background: '#fff', border: '1.4px solid #d8d1c2', color: '#1b1a17', fontWeight: 500,
              fontSize: 15, padding: '13px 22px', borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit',
            }}>See how it works</button>
          </div>
          <div style={{ display: 'flex', gap: 30, marginTop: 42, fontFamily: "'Space Mono',monospace" }}>
            {[['20','models hosted'],['1,048','inference calls/mo'],['5','countries']].map(([n, l]) => (
              <div key={l} style={{ borderLeft: n !== '20' ? '1px solid #ddd6c8' : 'none', paddingLeft: n !== '20' ? 30 : 0 }}>
                <div style={{ fontSize: 25, color: '#1b1a17' }}>{n}</div>
                <div style={{ fontSize: 11, color: '#8a857a', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <img
          src="/illustrations/09-aether-hub-pipeline.png"
          alt="Aether hub pipeline"
          style={{ width: '100%', borderRadius: 16, display: 'block' }}
        />
      </div>
    </div>
  )
}
