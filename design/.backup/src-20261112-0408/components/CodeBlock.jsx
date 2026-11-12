import { useState } from 'react'

export default function CodeBlock({ tabs }) {
  const tabKeys = Object.keys(tabs)
  const [active, setActive] = useState(tabKeys[0])
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(tabs[active]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2824' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#1b1a17',
        padding: '0 16px',
        borderBottom: '1px solid #2a2824',
      }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {tabKeys.map(k => (
            <button
              key={k}
              onClick={() => setActive(k)}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: active === k ? '#f1ede4' : '#6b6660',
                borderBottom: active === k ? '2px solid #cf5a2a' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color .12s',
              }}
            >
              {k}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            padding: '5px 10px',
            background: copied ? '#2db88a22' : '#ffffff14',
            border: '1px solid #3a3833',
            borderRadius: 6,
            color: copied ? '#2db88a' : '#8a857a',
            cursor: 'pointer',
            transition: 'all .15s',
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>

      {/* Code body */}
      <pre style={{
        margin: 0,
        padding: '20px 22px',
        background: '#141310',
        overflowX: 'auto',
        fontFamily: "'Space Mono',monospace",
        fontSize: 12.5,
        lineHeight: 1.65,
        color: '#c8c0b0',
      }}>
        <code>{tabs[active]}</code>
      </pre>
    </div>
  )
}
