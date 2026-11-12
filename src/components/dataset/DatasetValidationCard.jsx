const PASS_COLOR = '#2db88a'
const FAIL_COLOR = '#e05252'
const WARN_COLOR = '#e6b800'

function StatusBadge({ status }) {
  const passed = status === 'passed'
  const color = passed ? PASS_COLOR : FAIL_COLOR
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, padding: '2px 8px',
      borderRadius: 20, background: color + '18', color, textTransform: 'uppercase', fontWeight: 700,
    }}>
      {passed ? '✓' : '✕'} {status}
    </span>
  )
}

function FindingRow({ finding, isLast }) {
  const { expectation, column_name, severity, passed, observed_value, expected_value, details } = finding
  const color = passed ? PASS_COLOR : (severity === 'warning' ? WARN_COLOR : FAIL_COLOR)
  return (
    <div style={{ padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #efebe2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#17202e' }}>{expectation}</span>
          {column_name && (
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '2px 6px',
              borderRadius: 5, background: '#efebe2', color: '#545b66',
            }}>{column_name}</span>
          )}
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, padding: '2px 6px',
            borderRadius: 5, color, background: color + '18', textTransform: 'uppercase',
          }}>{severity}</span>
        </div>
        <span style={{ fontSize: 14, color, flexShrink: 0 }}>{passed ? '✓' : '✕'}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', marginTop: 6 }}>
        observed: <span style={{ color: '#17202e' }}>{observed_value}</span> · expected: {expected_value}
      </div>
      {details?.note && (
        <div style={{ fontSize: 12, color: '#545b66', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>{details.note}</div>
      )}
    </div>
  )
}

/**
 * Renders a dataset's validation.json — the expectation checks run against
 * each data file (finite values, shape, bounds, class balance, etc.).
 */
export default function DatasetValidationCard({ validation }) {
  const files = validation?.files
  if (!files || typeof files !== 'object' || !Object.keys(files).length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {validation.suite_name && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670' }}>
            suite: <strong style={{ color: '#17202e' }}>{validation.suite_name}</strong>
          </span>
          {validation.status && <StatusBadge status={validation.status} />}
        </div>
      )}
      {Object.entries(files).map(([name, file]) => (
        <div key={name} style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid #efebe2',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, fontWeight: 700, color: '#17202e' }}>{name}</span>
            {file.status && <StatusBadge status={file.status} />}
          </div>
          <div style={{ padding: '2px 18px 6px' }}>
            {(file.findings || []).map((f, i) => (
              <FindingRow key={`${f.expectation}-${f.column_name}-${i}`} finding={f} isLast={i === file.findings.length - 1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
