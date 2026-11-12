const HIGHLIGHT_KEYS = [
  ['training_dataset', 'Training dataset'],
  ['trainingDataset', 'Training dataset'],
  ['dataset', 'Training dataset'],
  ['dataset_id', 'Dataset ID'],
  ['dataset_version', 'Dataset version'],
  ['framework', 'Framework'],
  ['model_type', 'Model type'],
  ['architecture', 'Architecture'],
  ['task', 'Task'],
  ['family', 'Family'],
  ['version', 'Version'],
  ['license', 'License'],
  ['optimizer', 'Optimizer'],
  ['epochs', 'Epochs'],
  ['batch_size', 'Batch size'],
  ['parameters', 'Parameters'],
  ['description', 'Description'],
]

function formatValue(value) {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function collectRows(config) {
  const used = new Set()
  const highlights = []

  for (const [key, label] of HIGHLIGHT_KEYS) {
    if (config[key] != null && config[key] !== '' && !used.has(label)) {
      highlights.push({ label, value: formatValue(config[key]) })
      used.add(label)
      used.add(key)
    }
  }

  const extras = Object.entries(config)
    .filter(([key]) => !used.has(key))
    .map(([key, value]) => ({ label: key.replace(/_/g, ' '), value: formatValue(value) }))

  return { highlights, extras }
}

export default function ModelConfigCard({ config }) {
  if (!config || typeof config !== 'object') return null

  const { highlights, extras } = collectRows(config)
  const allRows = [...highlights, ...extras]
  if (!allRows.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '4px 18px 12px' }}>
        {allRows.map(({ label, value }, i) => (
          <div key={label} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12,
            padding: '11px 0',
            borderBottom: i < allRows.length - 1 ? '1px solid #efebe2' : 'none',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#5f6670',
              textTransform: 'capitalize', paddingTop: 1,
            }}>
              {label}
            </div>
            <div style={{ fontSize: 13.5, color: '#17202e', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
