export default function MetricCard({ label, value, delta, good }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ddd8cc',
      borderRadius: 12,
      padding: '18px 20px',
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono',monospace",
        fontSize: 10,
        color: '#5f6670',
        letterSpacing: '0.04em',
        marginBottom: 8,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#17202e' }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 10.5,
          marginTop: 5,
          color: good ? '#2db88a' : '#e67e22',
        }}>
          {delta}
        </div>
      )}
    </div>
  )
}
