import { Link } from 'react-router-dom'

const ACCENT = '#cf5a2a'

export default function Discovery() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 20px' }}>
      <div style={{
        background: '#1b1a17', color: '#f1ede4', borderRadius: 22, padding: 46,
        display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 44, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#34322d 1px,transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.6,
        }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>CONCEPT · CHNO ENERGETICS</div>
          <h2 style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>
            De-novo energetic<br />materials discovery.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#b7b1a4', margin: '16px 0 0', maxWidth: 420 }}>
            A concept on the roadmap: set target properties, let diffusion and SELFIES-LM models propose CHNO
            candidates, and have the GNN score every one. Activation-steering sliders would nudge the latent
            toward higher energy density — sensitivity stays a hard ceiling.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            {[
              { label: 'diffusion sample', accent: false },
              { label: 'GNN property scorer', accent: false },
              { label: 'activation steering', accent: true },
            ].map(({ label, accent }) => (
              <span key={label} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11,
                border: `1px solid ${accent ? ACCENT : '#3a3833'}`,
                borderRadius: 20, padding: '6px 13px',
                color: accent ? ACCENT : '#cdc6b8',
              }}>{label}</span>
            ))}
          </div>
          <Link to="/apps" style={{ textDecoration: 'none' }}>
            <div style={{ marginTop: 24, fontWeight: 500, fontSize: 14, color: '#f1ede4', borderBottom: `1.5px solid ${ACCENT}`, display: 'inline-block', paddingBottom: 2, cursor: 'pointer' }}>
              See what's live on /apps →
            </div>
          </Link>
        </div>
        <div style={{ position: 'relative' }}>
          <img
            src="/illustrations/08-generative-diffusion-emitter.png"
            alt="CHNO generative diffusion emitter"
            style={{ width: '100%', borderRadius: 14, display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
