export default function MetricCard({ label, value, delta, good }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e7e0d2',
      borderRadius: 12,
      padding: '18px 20px',
    }}>
      <div style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: 10,
        color: '#8a857a',
        letterSpacing: '0.04em',
        marginBottom: 8,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#1b1a17' }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontFamily: "'Space Mono',monospace",
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
