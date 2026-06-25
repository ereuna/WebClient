import { Link } from 'react-router-dom'

const ACCENT = '#cf5a2a'

function AppRow({ tag, title, desc, bullets, illoSrc, illoAlt, illoLeft, linkTo }) {
  const illo = (
    <img
      src={illoSrc}
      alt={illoAlt}
      style={{ width: '100%', borderRadius: 16, display: 'block' }}
    />
  )
  const copy = (
    <div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', letterSpacing: '0.05em' }}>{tag}</div>
      <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: '10px 0 0' }}>{title}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', margin: '12px 0 0', maxWidth: 400 }}>{desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: ACCENT, fontFamily: "'Space Mono',monospace", fontSize: 12, marginTop: 2 }}>{String(i+1).padStart(2,'0')}</span>
            <span style={{ fontSize: 14, color: '#3a382f' }}>{b}</span>
          </div>
        ))}
      </div>
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        <div style={{ marginTop: 20, fontWeight: 500, fontSize: 14, color: '#1b1a17', borderBottom: `1.5px solid ${ACCENT}`, display: 'inline-block', paddingBottom: 2, cursor: 'pointer' }}>Launch app →</div>
      </Link>
    </div>
  )
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '22px 28px', display: 'grid', gridTemplateColumns: illoLeft ? '1.1fr 1fr' : '1fr 1.1fr', gap: 48, alignItems: 'center' }}>
      {illoLeft ? <>{illo}{copy}</> : <>{copy}{illo}</>}
    </div>
  )
}

export default function FlagshipApps() {
  return (
    <div style={{ background: '#fff', borderTop: '1px solid #e7e0d2', borderBottom: '1px solid #e7e0d2', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 28px 30px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>FLAGSHIP APPLICATIONS</div>
        <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>Built end-to-end on the hub.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 520, margin: '14px auto 0' }}>
          Three production apps prove the EnergyGraph interface works for real operator workflows — connect your own sensor data and run.
        </p>
      </div>

      <AppRow
        tag="/apps/geosight"
        title="Geothermal Field Intelligence"
        desc="A live reservoir thermal map from the inverse PINN, inferred k(x), and plain-language anomaly alerts before they become production losses."
        bullets={[
          'Reservoir thermal field, updated every 15 minutes',
          'Anomaly alert with severity, interpretation and response',
          'Upload well logs, fine-tune a PINN, launch in hours',
        ]}
        illoSrc="/illustrations/05-geothermal-reservoir-slab.png"
        illoAlt="Geothermal reservoir slab"
        linkTo="/apps/geosight"
      />

      <AppRow
        tag="/apps/nucleval"
        title="Nuclear Materials Safety Monitor"
        desc="A vessel cross-section degradation heatmap from the materials GNN, 180-day property forecasts against hard safety limits, and inspection recommendations that write to your CMMS."
        bullets={[
          'Yield strength forecast with 90% CI and limit line',
          'One-click IAEA-formatted inspection readiness report',
          'Accept a recommendation → advance the inspection date',
        ]}
        illoSrc="/illustrations/06-nuclear-vessel-monitor.png"
        illoAlt="Nuclear vessel monitor"
        illoLeft
        linkTo="/apps/nucleval"
      />

      <AppRow
        tag="/apps/gridlens"
        title="National Grid Dispatch Optimiser"
        desc="A 72-hour RL dispatch schedule that couples PINN reservoir-health signals into the reward — the unique geothermal-to-grid integration — with plain-language recommendations and a scenario simulator."
        bullets={[
          'Live generation mix with carbon intensity vs NDC',
          '"Reduce Olkaria drawdown 8% — reservoir declining"',
          'Export the schedule to SCADA over OPC-UA',
        ]}
        illoSrc="/illustrations/07-grid-dispatch-convergence.png"
        illoAlt="Grid dispatch convergence"
        linkTo="/apps/gridlens"
      />
    </div>
  )
}
