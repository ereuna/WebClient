const ACCENT = '#cf5a2a'

function normalizeFields(data, keys) {
  for (const key of keys) {
    const val = data?.[key]
    if (!val) continue
    if (Array.isArray(val)) return val
    if (typeof val === 'object' && val.properties) {
      return Object.entries(val.properties).map(([name, spec]) => ({
        name,
        type: spec.type || spec.format || '—',
        description: spec.description,
        shape: spec.shape || (spec.items ? `[${spec.items.type || 'item'}]` : undefined),
      }))
    }
    if (typeof val === 'object') {
      return Object.entries(val).map(([name, spec]) => ({
        name,
        ...(typeof spec === 'object' ? spec : { type: String(spec) }),
      }))
    }
  }
  return []
}

function ParamRow({ field, direction }) {
  const name = field.name || field.key || '—'
  const type = field.type || field.dtype || field.format || '—'
  const shape = field.shape || field.dimensions
  const desc = field.description || field.desc

  return (
    <div style={{
      padding: '10px 0',
      borderBottom: '1px solid #f0ebe0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1b1a17' }}>{name}</span>
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
          borderRadius: 5, background: direction === 'in' ? '#7c6af718' : '#2db88a18',
          color: direction === 'in' ? '#7c6af7' : '#2db88a', flexShrink: 0,
        }}>
          {type}
        </span>
      </div>
      {shape && (
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', marginTop: 4 }}>
          shape: {Array.isArray(shape) ? shape.join(' × ') : shape}
        </div>
      )}
      {desc && (
        <div style={{ fontSize: 12, color: '#56524a', marginTop: 4, lineHeight: 1.45 }}>{desc}</div>
      )}
    </div>
  )
}

function ParamGroup({ label, fields, direction }) {
  if (!fields.length) return null
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
        color: ACCENT, marginBottom: 8, textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div>
        {fields.map((field, i) => (
          <ParamRow key={field.name || field.key || i} field={field} direction={direction} />
        ))}
      </div>
    </div>
  )
}

export default function InferenceParamsCard({ params }) {
  if (!params || typeof params !== 'object') return null

  const inputs = normalizeFields(params, ['inputs', 'input', 'input_schema', 'inputSchema'])
  const outputs = normalizeFields(params, ['outputs', 'output', 'output_schema', 'outputSchema'])

  if (!inputs.length && !outputs.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
        color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
      }}>
        Inference contract
      </div>
      <ParamGroup label="Inputs" fields={inputs} direction="in" />
      <ParamGroup label="Expected outputs" fields={outputs} direction="out" />
    </div>
  )
}
