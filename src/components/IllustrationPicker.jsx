import { CARD_ILLUSTRATION_OPTIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'

export default function IllustrationPicker({ value, onChange }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: 10,
    }}>
      {CARD_ILLUSTRATION_OPTIONS.map(opt => {
        const selected = opt.id === value
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            style={{
              position: 'relative',
              padding: 0,
              border: `2px solid ${selected ? ACCENT : '#e7e0d2'}`,
              borderRadius: 10,
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#fff',
              textAlign: 'left',
              transition: 'border-color .15s',
            }}
          >
            <div style={{ height: 72, overflow: 'hidden' }}>
              <img
                src={opt.src}
                alt={opt.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '6px 8px',
              color: selected ? ACCENT : '#56524a', background: selected ? '#fff8f4' : '#faf7f0',
            }}>
              {opt.label}
            </div>
            {selected && (
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%',
                background: ACCENT, color: '#fff', fontSize: 11, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              }}>
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
