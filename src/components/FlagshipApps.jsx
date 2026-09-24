import { Link } from 'react-router-dom'
import { STATUS_COLORS, DEMO_STATUS } from '../api/apps'

const ACCENT = '#cf5a2a'

export default function FlagshipApps() {
  return (
    <div style={{ background: '#fff', borderTop: '1px solid #e7e0d2', borderBottom: '1px solid #e7e0d2', marginTop: 64, paddingBottom: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 28px 30px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>APPLICATION & VALIDATION</div>
        <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0' }}>GeoSight & Physics Constraint Checker</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 540, margin: '14px auto 0' }}>
          GeoSight is a demo geothermal application running on synthetic and public data, alongside an integrated physics constraint checker that validates PDE residual constraints and subsurface physics specs.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'stretch' }}>
        {/* GeoSight */}
        <div style={{ background: '#f8f5ee', border: '1px solid #e7e0d2', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: ACCENT, letterSpacing: '0.05em' }}>APPLICATION</div>
              <span style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10.5, padding: '3px 8px', borderRadius: 6, fontWeight: 500,
                background: STATUS_COLORS[DEMO_STATUS] + '18', color: STATUS_COLORS[DEMO_STATUS],
              }}>{DEMO_STATUS}</span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 600, margin: '10px 0 0' }}>GeoSight</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#56524a', margin: '12px 0 0' }}>
              A demo of reservoir thermal mapping, evaluating inferred thermal conductivity k(x) against field observations. Runs on synthetic and public data.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• 3D reservoir thermal field visualization</div>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• Inferred thermal conductivity k(x) mapping</div>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• Integration with PhysicsSpec and FieldState</div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link to="/apps" style={{ textDecoration: 'none', color: ACCENT, fontWeight: 500, fontSize: 14 }}>
              Explore the GeoSight demo →
            </Link>
          </div>
        </div>

        {/* Physics Constraint Checker */}
        <div style={{ background: '#f8f5ee', border: '1px solid #e7e0d2', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: ACCENT, letterSpacing: '0.05em' }}>CONSTRAINT CHECKER</div>
            <h3 style={{ fontSize: 24, fontWeight: 600, margin: '10px 0 0' }}>Physics Constraint Checker</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#56524a', margin: '12px 0 0' }}>
              Ereuna includes a physics constraint checker that evaluates model predictions against governing PDE residual bounds and conservation laws before model output acceptance.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• PDE residual evaluation for heat conduction</div>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• Conservation of energy and boundary condition check</div>
              <div style={{ fontSize: 13.5, color: '#3a382f' }}>• Automated validation against PhysicsSpec parameters</div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link to="/docs" style={{ textDecoration: 'none', color: ACCENT, fontWeight: 500, fontSize: 14 }}>
              Read constraint checker specs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
