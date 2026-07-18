const ACCENT = '#cf5a2a'

const steps = [
  { n: '01', title: 'Upload', desc: 'Drag a .pt or .safetensors checkpoint — TorchPharma format accepted.' },
  { n: '02', title: 'Physics check', desc: 'Automated validation of PDE residual, conservation and calibration.' },
  { n: '03', title: 'Model card', desc: 'A formal physics-domain card: provenance, performance, safety class.' },
  { n: '04', title: 'Infer & fine-tune', desc: 'Pull it with the CLI today; REST API and in-browser fine-tuning are on the roadmap.' },
]

export default function Pipeline() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>
            Checkpoint to running model,<br />in four steps.
          </h2>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', maxWidth: 280, lineHeight: 1.6 }}>
          No model reaches the public zoo until the physics constraint checker passes.
        </div>
      </div>

      <img
        src="/illustrations/04-physics-gate-validator.png"
        alt="Physics constraint gate validator"
        style={{ width: '100%', borderRadius: 14, display: 'block', marginBottom: 24 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {steps.map(({ n, title, desc }) => (
          <div key={n} style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px 20px' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: ACCENT }}>{n}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 5 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#56524a', lineHeight: 1.5, marginTop: 5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#1b1a17', borderRadius: 14, marginTop: 18, padding: '20px 24px',
        fontFamily: "'Space Mono',monospace", fontSize: 13, color: '#e9e4d8', lineHeight: 1.9, overflowX: 'auto',
      }}>
        <span style={{ color: '#8a857a' }}># Ereuna CLI</span><br />
        <span style={{ color: ACCENT }}>ereuna</span> login<br />
        <span style={{ color: ACCENT }}>ereuna</span> clone <span style={{ color: '#cdb89a' }}>thomas/olkaria-inverse-pinn-v1.2</span><br />
        <span style={{ color: ACCENT }}>ereuna</span> pull
      </div>
    </div>
  )
}
