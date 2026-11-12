export function CardIllustration({ src, alt, height = 158, dark = false }) {
  return (
    <div style={{
      height,
      background: dark ? '#17202e' : '#ffffff',
      borderBottom: `1px solid ${dark ? '#17202e' : '#efebe2'}`,
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
