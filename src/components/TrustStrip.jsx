export default function TrustStrip() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '26px 28px', display: 'flex', alignItems: 'center', gap: 34, flexWrap: 'wrap', borderBottom: '1px solid #e3dccd' }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.06em', color: '#8a857a' }}>
        TRUSTED BY OPERATORS & LABS
      </div>
      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', fontSize: 15, fontWeight: 500, color: '#9c968a' }}>
        {['KenGen','GNS Science','ÍSOR','NuPEA','KETRACO','ORNL'].map(n => <span key={n}>{n}</span>)}
      </div>
    </div>
  )
}
