import { renderMarkdown } from '../../lib/markdown.jsx'

const CARD_BORDER = '1px solid #e7e0d2'
const DOT_BG = 'radial-gradient(#e7e0d1 1px,transparent 1px)'

export default function RepoReadme({ content }) {
  if (!content?.trim()) return null

  return (
    <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{
        height: 8,
        backgroundImage: DOT_BG,
        backgroundSize: '14px 14px',
        backgroundColor: '#faf7f0',
        borderBottom: '1px solid #ece5d6',
      }} />
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {renderMarkdown(content)}
        </div>
      </div>
    </div>
  )
}
