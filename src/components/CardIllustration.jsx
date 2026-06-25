export function CardIllustration({ src, alt, height = 158, dark = false }) {
  return (
    <div style={{
      height,
      background: dark ? '#262421' : '#faf7f0',
      borderBottom: `1px solid ${dark ? '#34322d' : '#ece5d6'}`,
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
