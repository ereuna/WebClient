import SchemaTable from './SchemaTable'

const ACCENT = '#cf5a2a'

function fmtNum(n) {
  if (n == null) return '—'
  return n.toLocaleString()
}

function formatShape(shape) {
  if (!shape || shape.length === 0) return 'scalar'
  return shape.map(s => (s == null ? 'N' : s)).join(' × ')
}

function fieldsToColumns(fields) {
  return (fields || []).map(f => ({
    column: f.name,
    type: `${f.dtype || '—'} · ${formatShape(f.shape)}`,
    desc: f.description || '',
  }))
}

/**
 * Renders one schema table per data file from a dataset's schema.json,
 * where each file has its own row count, format, and field list.
 */
export default function DatasetSchemaFiles({ schema }) {
  const files = schema?.files
  if (!files || typeof files !== 'object' || !Object.keys(files).length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {Object.entries(files).map(([name, file]) => (
        <div key={name}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12.5, fontWeight: 700, color: '#1b1a17' }}>
              {name}
            </span>
            {file.format && (
              <span style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9.5, padding: '2px 7px',
                borderRadius: 5, background: ACCENT + '18', color: ACCENT, textTransform: 'uppercase',
              }}>{file.format}</span>
            )}
            {file.row_count != null && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a' }}>
                {fmtNum(file.row_count)} rows
              </span>
            )}
          </div>
          <SchemaTable columns={fieldsToColumns(file.fields)} />
        </div>
      ))}
    </div>
  )
}
