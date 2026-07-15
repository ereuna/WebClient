import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer, maxWidth = 640 }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(27,26,23,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, border: '1px solid #e7e0d2',
          width: '100%', maxWidth, maxHeight: '85vh', overflowY: 'auto',
          padding: '28px 28px 24px', boxShadow: '0 20px 60px rgba(0,0,0,.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 20,
              color: '#8a857a', lineHeight: 1, padding: 4,
            }}
          >
            ×
          </button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>{footer}</div>}
      </div>
    </div>
  )
}
