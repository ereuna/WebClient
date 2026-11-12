export default function SchemaTable({ columns }) {
  if (!columns?.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#faf7f0', borderBottom: '1px solid #ece5d6' }}>
            {['Column', 'Type', 'Description'].map(h => (
              <th key={h} style={{
                padding: '10px 16px', textAlign: 'left',
                fontFamily: "'Space Mono',monospace", fontSize: 10,
                color: '#8a857a', fontWeight: 400, letterSpacing: '0.04em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((col, i) => (
            <tr key={col.column} style={{ borderBottom: i < columns.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
              <td style={{ padding: '10px 16px', fontFamily: "'Space Mono',monospace", fontSize: 11.5, fontWeight: 700, color: '#1b1a17' }}>
                {col.column}
              </td>
              <td style={{ padding: '10px 16px' }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
                  borderRadius: 5, background: '#f5f0e8', color: '#7a7568',
                }}>{col.type}</span>
              </td>
              <td style={{ padding: '10px 16px', color: '#56524a', lineHeight: 1.45 }}>{col.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
