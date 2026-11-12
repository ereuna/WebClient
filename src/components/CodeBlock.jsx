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
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #17202e' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#17202e',
        padding: '0 16px',
        borderBottom: '1px solid #17202e',
      }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {tabKeys.map(k => (
            <button
              key={k}
              onClick={() => setActive(k)}
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 11,
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: active === k ? '#f5f2eb' : '#5f6670',
                borderBottom: active === k ? '2px solid #c2410c' : '2px solid transparent',
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
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10,
            padding: '5px 10px',
            background: copied ? '#2db88a22' : '#ffffff14',
            border: '1px solid #2c3646',
            borderRadius: 6,
            color: copied ? '#2db88a' : '#5f6670',
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
        background: '#0f1622',
        overflowX: 'auto',
        fontFamily: "'IBM Plex Mono',monospace",
        fontSize: 12.5,
        lineHeight: 1.65,
        color: '#c9c4b8',
      }}>
        <code>{tabs[active]}</code>
      </pre>
    </div>
  )
}
