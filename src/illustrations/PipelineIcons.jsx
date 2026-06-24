// Axon S2 Line Iso — pipeline step icons
const S = { stroke: '#34322d', strokeWidth: 1.5, strokeLinejoin: 'round', fill: 'none' }
const ACC = '#cf5a2a'

export function UploadStepIcon() {
  return (
    <svg viewBox="0 0 160 120" style={{ width: 130 }}>
      {/* iso box */}
      <g {...S}>
        <polygon points="80,76 122,56 80,36 38,56" fill="#fff"/>
        <polygon points="38,56 80,76 80,100 38,76" fill="#efeadf"/>
        <polygon points="80,76 122,56 122,80 80,100" fill="#e4ddcf"/>
      </g>
      {/* bolts */}
      <circle cx="46" cy="60" r="2" fill="#8a857a" stroke="none"/>
      <circle cx="114" cy="60" r="2" fill="#8a857a" stroke="none"/>
      {/* upload arrow */}
      <path d="M80,68 l0,-24 M80,44 l-9,9 M80,44 l9,9" fill="none" stroke={ACC} strokeWidth="2.2" strokeLinecap="round"/>
      {/* status LED */}
      <circle cx="114" cy="42" r="3" fill="#34c759" stroke="none"/>
    </svg>
  )
}

export function PhysicsCheckIcon() {
  return (
    <svg viewBox="0 0 160 120" style={{ width: 130 }}>
      {/* PDE wave arc above */}
      <path d="M30,52 q14,-18 28,0 t28,0" fill="none" stroke="#cfc8b9" strokeWidth="1.4"/>
      {/* iso flat diamond */}
      <g {...S}>
        <polygon points="80,82 122,62 80,42 38,62" fill="#fff"/>
        <polygon points="38,62 80,82 80,98 38,78" fill="#efeadf"/>
        <polygon points="80,82 122,62 122,78 80,98" fill="#e4ddcf"/>
      </g>
      {/* checkmark on top face */}
      <path d="M62,64 l10,10 l18,-20" fill="none" stroke={ACC} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* bolt */}
      <circle cx="114" cy="64" r="2" fill="#8a857a" stroke="none"/>
    </svg>
  )
}

export function ModelCardIcon() {
  return (
    <svg viewBox="0 0 160 120" style={{ width: 130 }}>
      {/* stacked slab cards */}
      <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
        <polygon points="80,90 120,72 80,54 40,72" fill="#efeadf"/>
        <polygon points="80,76 120,58 80,40 40,58" fill="#fff"/>
        <polygon points="80,62 120,44 80,26 40,44" fill="#f7f3ec"/>
      </g>
      {/* accent inset on top */}
      <polygon points="80,30 96,23 80,16 64,23" fill="#f7e2d5" stroke={ACC} strokeWidth="1.3"/>
      {/* connector line dots */}
      <circle cx="60" cy="58" r="2" fill="#bdb6a6" stroke="none"/>
      <circle cx="100" cy="58" r="2" fill={ACC} stroke="none"/>
      <circle cx="80" cy="66" r="2" fill="#bdb6a6" stroke="none"/>
    </svg>
  )
}

export function InferIcon() {
  return (
    <svg viewBox="0 0 160 120" style={{ width: 130 }}>
      {/* iso box */}
      <g {...S}>
        <polygon points="80,78 122,58 80,38 38,58" fill="#fff"/>
        <polygon points="38,58 80,78 80,102 38,82" fill="#efeadf"/>
        <polygon points="80,78 122,58 122,82 80,102" fill="#e4ddcf"/>
      </g>
      {/* broadcast arcs */}
      <g stroke={ACC} strokeWidth="1.7" fill="none">
        <path d="M96,42 a11,11 0 0 1 16,16"/>
        <path d="M102,36 a19,19 0 0 1 16,20"/>
      </g>
      <circle cx="93" cy="48" r="2.8" fill={ACC} stroke="none"/>
      {/* bolt */}
      <circle cx="46" cy="62" r="2" fill="#8a857a" stroke="none"/>
    </svg>
  )
}
