const ACCENT = '#cf5a2a'

export default function PageHero({ eyebrow, title, description, children, illustration, illustrationAlt }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
      borderBottom: '1px solid #e3dccd',
      padding: illustration ? '44px 28px 40px' : '52px 28px 44px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: illustration ? 'grid' : 'block',
        gridTemplateColumns: illustration ? '1fr 1fr' : undefined,
        gap: illustration ? 36 : undefined,
        alignItems: 'center',
      }}>
        <div>
          {eyebrow && (
            <div style={{
              fontFamily: "'Space Mono',monospace", fontSize: 11,
              letterSpacing: '0.08em', color: ACCENT, marginBottom: 16,
            }}>
              {eyebrow}
            </div>
          )}
          <h1 style={{
            fontSize: 46, letterSpacing: '-0.03em', fontWeight: 600,
            lineHeight: 1.06, margin: 0,
          }}>
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: 16, color: '#56524a', marginTop: 14, maxWidth: 540, lineHeight: 1.6 }}>
              {description}
            </p>
          )}
          {children}
        </div>
        {illustration && (
          <img
            src={illustration}
            alt={illustrationAlt || ''}
            style={{ width: '100%', borderRadius: 14, display: 'block' }}
          />
        )}
      </div>
    </div>
  )
}
