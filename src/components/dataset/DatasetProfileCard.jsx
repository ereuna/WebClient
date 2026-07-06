import HyperparametersTable from '../model/HyperparametersTable'

const ACCENT = '#cf5a2a'

function fmtNum(n) {
  if (n == null) return '—'
  return n.toLocaleString()
}

function fmtBytes(n) {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function fmtPct(n) {
  if (n == null) return '—'
  return `${(n * 100).toFixed(1)}%`
}

function FileStatPill({ label, value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a',
    }}>
      {label}: <strong style={{ color: '#1b1a17' }}>{value}</strong>
    </span>
  )
}

/**
 * Renders per-file, per-field statistics from a dataset's profile.json
 * (min/max/mean/std, null/duplicate rates, class balance, etc.).
 */
export default function DatasetProfileCard({ profile }) {
  const files = profile?.files
  if (!files || typeof files !== 'object' || !Object.keys(files).length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {Object.entries(files).map(([name, file]) => (
        <div key={name} style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0ebe0' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12.5, fontWeight: 700, color: '#1b1a17', marginBottom: 8 }}>
              {name}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <FileStatPill label="rows" value={fmtNum(file.row_count)} />
              <FileStatPill label="size" value={fmtBytes(file.size_bytes)} />
              <FileStatPill label="null rate" value={fmtPct(file.null_rate)} />
              <FileStatPill label="duplicate rate" value={fmtPct(file.duplicate_rate)} />
            </div>
          </div>
          {file.fields && typeof file.fields === 'object' && (
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(file.fields).map(([fieldName, stats]) => (
                <div key={fieldName}>
                  <div style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 10.5, letterSpacing: '0.04em',
                    color: ACCENT, marginBottom: 6, textTransform: 'uppercase',
                  }}>
                    {fieldName}
                  </div>
                  <HyperparametersTable data={stats} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
