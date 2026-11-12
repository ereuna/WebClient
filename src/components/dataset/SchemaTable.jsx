export default function SchemaTable({ columns }) {
  if (!columns?.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#ffffff', borderBottom: '1px solid #efebe2' }}>
            {['Column', 'Type', 'Description'].map(h => (
              <th key={h} style={{
                padding: '10px 16px', textAlign: 'left',
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                color: '#5f6670', fontWeight: 400, letterSpacing: '0.04em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((col, i) => (
            <tr key={col.column} style={{ borderBottom: i < columns.length - 1 ? '1px solid #efebe2' : 'none' }}>
              <td style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 700, color: '#17202e' }}>
                {col.column}
              </td>
              <td style={{ padding: '10px 16px' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '2px 7px',
                  borderRadius: 5, background: '#efebe2', color: '#545b66',
                }}>{col.type}</span>
              </td>
              <td style={{ padding: '10px 16px', color: '#545b66', lineHeight: 1.45 }}>{col.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
