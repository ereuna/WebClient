const ACCENT = '#cf5a2a'

const cards = [
  {
    title: 'PINN library',
    desc: 'Inverse and forward physics-informed networks, organised by PDE class and domain. Transfer scores computed from PhysicsSpec.',
    tags: 'parabolic · inverse · geothermal',
    illo: '/illustrations/card-pinn-library.png',
    illoAlt: 'PINN library illustration',
  },
  {
    title: 'Materials GNN / NNP',
    desc: 'Equivariant networks for nuclear and energetic materials. Reports formation enthalpy, yield strength and calibrated coverage.',
    tags: 'RAFM_steel · fission · yield-strength',
    illo: '/illustrations/card-materials-gnn.png',
    illoAlt: 'Materials GNN illustration',
  },
  {
    title: 'Grid & dispatch RL',
    desc: 'Policies that balance cost, carbon and reservoir health in real time. Each ships a GridEnvSpec describing its training grid.',
    tags: 'kenya · geothermal-heavy · cost+carbon',
    illo: '/illustrations/card-grid-dispatch-rl.png',
    illoAlt: 'Grid dispatch RL illustration',
  },
  {
    title: 'Forecasting models',
    desc: 'Demand, wind, solar and hydro-inflow forecasters by geography and horizon — with uncertainty bands as standard.',
    tags: 'wind · lake-turkana · 24h',
    illo: '/illustrations/card-forecasting.png',
    illoAlt: 'Forecasting models illustration',
  },
  {
    title: 'Generative models',
    desc: 'Diffusion and SELFIES-LM that design CHNO energetics and nuclear alloy crystals — drug-discovery architectures, retargeted to energy.',
    tags: 'energetic-material · CHNO · de-novo',
    illo: '/illustrations/card-generative.png',
    illoAlt: 'Generative models illustration',
  },
]

function CardIllustration({ src, alt }) {
  return (
    <div style={{
      height: 158, background: '#faf7f0', borderBottom: '1px solid #ece5d6',
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

export default function ModelZoo() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>THE MODEL ZOO</div>
          <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>
            Five model families.<br />One interface.
          </h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 340, margin: 0 }}>
          Every model implements the EnergyGraph interface, ships a validated card, and passes the physics
          constraint checker before it appears.
        </p>
      </div>

      <img
        src="/illustrations/03-sandbox-model-array.png"
        alt="Model sandbox array"
        style={{ width: '100%', borderRadius: 14, display: 'block', marginBottom: 18 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {cards.map(({ title, desc, tags, illo, illoAlt }) => (
          <div key={title} style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 16, overflow: 'hidden' }}>
            <CardIllustration src={illo} alt={illoAlt} />
            <div style={{ padding: '20px 22px 22px' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 7 }}>{desc}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', marginTop: 12 }}>{tags}</div>
            </div>
          </div>
        ))}

        <div style={{ background: '#1b1a17', color: '#f1ede4', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <img
            src="/illustrations/02-modular-weight-transfer.png"
            alt="Modular weight transfer"
            style={{ width: '100%', height: 158, objectFit: 'cover', display: 'block', borderBottom: '1px solid #34322d' }}
          />
          <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Upload your model</div>
            <div style={{ fontSize: 13.5, color: '#b7b1a4', lineHeight: 1.55, marginTop: 7 }}>
              Guided model-card flow with an automated physics check. Apache-2.0, MIT or restricted — your call.
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ marginTop: 14, fontWeight: 500, fontSize: 14, color: ACCENT, cursor: 'pointer' }}>Contribute →</div>
          </div>
        </div>
      </div>
    </div>
  )
}
