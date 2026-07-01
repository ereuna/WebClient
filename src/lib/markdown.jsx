/**
 * Lightweight markdown renderer styled for Aether docs / README content.
 */

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          fontFamily: "'Space Mono',monospace", fontSize: '0.9em',
          background: '#f5f0e8', padding: '1px 5px', borderRadius: 4,
        }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} style={{ color: '#cf5a2a', textDecoration: 'none' }}>
          {linkMatch[1]}
        </a>
      )
    }
    return part
  })
}

function renderList(lines, key) {
  return (
    <ul key={key} style={{ margin: '8px 0 12px', paddingLeft: 22, fontSize: 14.5, color: '#3d3a32', lineHeight: 1.7 }}>
      {lines.map((line, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{inlineFormat(line.replace(/^[-*]\s+/, ''))}</li>
      ))}
    </ul>
  )
}

export function renderMarkdown(raw) {
  if (!raw?.trim()) return null

  const blocks = []
  const lines = raw.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines = []
      i += 1
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push(
        <pre key={blocks.length} style={{
          background: '#1b1a17', color: '#e8e2d6', borderRadius: 10, padding: '16px 18px',
          fontSize: 13, fontFamily: "'Space Mono',monospace", overflowX: 'auto',
          marginTop: 14, marginBottom: 14, lineHeight: 1.6,
        }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Markdown table
    if (line.startsWith('| ')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i += 1
      }
      const rows = tableLines.filter(r => !r.match(/^\|[-| :]+\|$/))
      blocks.push(
        <div key={blocks.length} style={{ overflowX: 'auto', marginTop: 14, marginBottom: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(c => c.trim())
              const Tag = ri === 0 ? 'th' : 'td'
              return (
                <tr key={ri} style={{ borderBottom: '1px solid #ece5d6' }}>
                  {cells.map((c, ci) => (
                    <Tag key={ci} style={{
                      padding: '9px 14px', textAlign: 'left',
                      background: ri === 0 ? '#faf7f0' : 'transparent',
                      fontWeight: ri === 0 ? 600 : 400,
                      fontFamily: ri === 0 ? "'Space Mono',monospace" : 'inherit',
                      fontSize: ri === 0 ? 11 : 13.5,
                      color: ri === 0 ? '#8a857a' : '#1b1a17',
                    }}>
                      {c.trim().replace(/`([^`]+)`/g, '$1')}
                    </Tag>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
      continue
    }

    // Bullet list
    if (line.match(/^[-*]\s+/)) {
      const listLines = []
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        listLines.push(lines[i])
        i += 1
      }
      blocks.push(renderList(listLines, blocks.length))
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={blocks.length} style={{ fontSize: 16, fontWeight: 600, marginTop: 22, marginBottom: 8 }}>
          {line.slice(4)}
        </h3>
      )
      i += 1
      continue
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={blocks.length} style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10, letterSpacing: '-0.01em' }}>
          {line.slice(3)}
        </h2>
      )
      i += 1
      continue
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={blocks.length} style={{ fontSize: 26, fontWeight: 700, marginTop: 0, marginBottom: 12, letterSpacing: '-0.02em' }}>
          {line.slice(2)}
        </h1>
      )
      i += 1
      continue
    }

    // Paragraph (collect until blank line)
    if (line.trim()) {
      const paraLines = []
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('|') && !lines[i].startsWith('```') && !lines[i].match(/^[-*]\s+/)) {
        paraLines.push(lines[i])
        i += 1
      }
      blocks.push(
        <p key={blocks.length} style={{ fontSize: 14.5, color: '#3d3a32', lineHeight: 1.7, marginBottom: 4, marginTop: 0 }}>
          {inlineFormat(paraLines.join(' '))}
        </p>
      )
      continue
    }

    i += 1
  }

  return blocks
}
