function flattenObject(obj, prefix = '') {
  const rows = []
  if (obj == null || typeof obj !== 'object') return rows

  for (const [key, value] of Object.entries(obj)) {
    const label = prefix ? `${prefix}.${key}` : key
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      rows.push(...flattenObject(value, label))
    } else if (Array.isArray(value)) {
      rows.push({ key: label, value: value.map(v => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ') })
    } else {
      rows.push({ key: label, value: value == null ? '—' : String(value) })
    }
  }
  return rows
}

export default function HyperparametersTable({ data }) {
  if (!data || typeof data !== 'object') return null

  const rows = flattenObject(data)
  if (!rows.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #efebe2' }}>
              <th style={{
                padding: '10px 18px', textAlign: 'left', background: '#ffffff',
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', fontWeight: 600,
              }}>
                Parameter
              </th>
              <th style={{
                padding: '10px 18px', textAlign: 'left', background: '#ffffff',
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', fontWeight: 600,
              }}>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, value }, i) => (
              <tr key={key} style={{ borderBottom: i < rows.length - 1 ? '1px solid #efebe2' : 'none' }}>
                <td style={{
                  padding: '10px 18px', fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: 11.5, color: '#545b66', verticalAlign: 'top', width: '38%',
                }}>
                  {key}
                </td>
                <td style={{ padding: '10px 18px', color: '#17202e', verticalAlign: 'top', wordBreak: 'break-word' }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
