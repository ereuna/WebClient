
export default function RegionalContext() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 20px' }}>
      <div style={{
        background: '#fff', border: '1px solid #ddd8cc', borderRadius: 20,
        padding: '40px 44px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: '0.06em', color: '#545b66', marginBottom: 10 }}>
            GEOLOGICAL CONTEXT
          </div>
          <h2 style={{ fontSize: 30, lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            East African Rift System
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#545b66', margin: '14px 0 0' }}>
            The East African Rift System is a significant geothermal region; Kenyan fields including Olkaria and Menengai are located there. High enthalpy tectonic settings provide unique subsurface heat conduction dynamics.
          </p>
        </div>
        <div style={{
          background: '#ffffff', border: '1px solid #efebe2', borderRadius: 14, padding: '24px 28px',
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: '#243042', lineHeight: 1.8,
        }}>
          <div style={{ fontSize: 11, color: '#5f6670', marginBottom: 6 }}>REGIONAL SETTING</div>
          <div>• Tectonic Region: East African Rift System</div>
          <div>• Key Fields: Olkaria, Menengai</div>
          <div>• Thermal Regime: High-enthalpy volcanic & tectonic rift zone</div>
        </div>
      </div>
    </div>
  )
}
