const ACCENT = '#cf5a2a'

export default function RegionalContext() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 20px' }}>
      <div style={{
        background: '#fff', border: '1px solid #e7e0d2', borderRadius: 20,
        padding: '40px 44px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: ACCENT, marginBottom: 10 }}>
            GEOLOGICAL CONTEXT
          </div>
          <h2 style={{ fontSize: 30, lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            East African Rift System
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#56524a', margin: '14px 0 0' }}>
            The East African Rift System is a significant geothermal region; Kenyan fields including Olkaria and Menengai are located there. High enthalpy tectonic settings provide unique subsurface heat conduction dynamics.
          </p>
        </div>
        <div style={{
          background: '#f8f5ee', border: '1px solid #ece5d6', borderRadius: 14, padding: '24px 28px',
          fontFamily: "'Space Mono',monospace", fontSize: 13, color: '#3a382f', lineHeight: 1.8,
        }}>
          <div style={{ fontSize: 11, color: '#8a857a', marginBottom: 6 }}>REGIONAL SETTING</div>
          <div>• Tectonic Region: East African Rift System</div>
          <div>• Key Fields: Olkaria, Menengai</div>
          <div>• Thermal Regime: High-enthalpy volcanic & tectonic rift zone</div>
        </div>
      </div>
    </div>
  )
}
