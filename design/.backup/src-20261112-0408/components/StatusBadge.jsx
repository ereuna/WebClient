import React from 'react'

/**
 * Status vocabulary — exactly four words, in order of readiness:
 * 1. Coming soon — nothing built yet
 * 2. Drafted — a first version exists but isn't validated or complete
 * 3. In progress — actively being built right now
 * 4. Live — real and usable
 *
 * Rules:
 * - Use these four words consistently everywhere on the site.
 * - In this order of readiness.
 * - No links attached to any of them.
 */

export const STATUS_VOCABULARY = [
  'Coming soon',
  'Drafted',
  'In progress',
  'Live',
]

export const STATUS_DEFINITIONS = {
  'Coming soon': 'nothing built yet',
  'Drafted': "a first version exists but isn't validated or complete",
  'In progress': 'actively being built right now',
  'Live': 'real and usable',
}

export const STATUS_STYLES = {
  'Coming soon': {
    color: '#6e695f',
    bg: '#ece7de',
    border: '#dcd4c5',
    dot: '#8a857a',
  },
  'Drafted': {
    color: '#854d0e',
    bg: '#fef3c7',
    border: '#fde68a',
    dot: '#d97706',
  },
  'In progress': {
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
    dot: '#2563eb',
  },
  'Live': {
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    dot: '#16a34a',
  },
}

export default function StatusBadge({ status, style, showDot = true, size = 'sm' }) {
  const meta = STATUS_STYLES[status] || STATUS_STYLES['Coming soon']
  const isSm = size === 'sm'

  return (
    <span
      className="status-badge"
      aria-label={`Status: ${status}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: isSm ? '3px 9px' : '5px 12px',
        borderRadius: 999,
        fontFamily: "'Space Mono', monospace",
        fontSize: isSm ? 11 : 12.5,
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        lineHeight: 1.2,
        userSelect: 'none',
        pointerEvents: 'none', // Strictly unlinked and unclickable
        ...style,
      }}
    >
      {showDot && (
        <span
          style={{
            width: isSm ? 6 : 7,
            height: isSm ? 6 : 7,
            borderRadius: '50%',
            background: meta.dot,
            display: 'inline-block',
          }}
        />
      )}
      {status}
    </span>
  )
}
