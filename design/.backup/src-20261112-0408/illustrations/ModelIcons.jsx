// Axon S2 Line Iso — single-hue teal-grey outline icons for model zoo cards
const S = { stroke: '#34322d', strokeWidth: 1.5, strokeLinejoin: 'round', fill: 'none' }
const ACC = '#cf5a2a'

export function PINNIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 178 }}>
      {/* iso flat diamond surface */}
      <g {...S}>
        <polygon points="100,114 158,84 100,54 42,84" fill="#ffffff"/>
        <polygon points="42,84 100,114 100,130 42,100" fill="#efeadf"/>
        <polygon points="100,114 158,84 158,100 100,130" fill="#e4ddcf"/>
      </g>
      {/* wave equation arc on top face */}
      <path d="M54,84 q12,-22 24,0 t24,0 t24,0" fill="none" stroke={ACC} strokeWidth="1.7"/>
      {/* PDE solution nodes */}
      <circle cx="54" cy="84" r="3" fill={ACC} stroke="none"/>
      <circle cx="100" cy="62" r="3" fill="#34322d" stroke="none"/>
      <circle cx="146" cy="84" r="3" fill="#34322d" stroke="none"/>
      {/* grid lines on top face */}
      <g stroke="#d3ccbd" strokeWidth="0.7">
        <line x1="71" y1="75" x2="129" y2="93"/>
        <line x1="129" y1="75" x2="71" y2="93"/>
      </g>
      {/* corner bolts */}
      <circle cx="46" cy="86" r="1.8" fill="#8a857a" stroke="none"/>
      <circle cx="154" cy="86" r="1.8" fill="#8a857a" stroke="none"/>
    </svg>
  )
}

export function MaterialsGNNIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 178 }}>
      {/* iso hex crystal base */}
      <g {...S}>
        <polygon points="100,116 148,90 100,64 52,90" fill="#ffffff"/>
        <polygon points="52,90 100,116 100,132 52,106" fill="#efeadf"/>
        <polygon points="100,116 148,90 148,106 100,132" fill="#e4ddcf"/>
      </g>
      {/* atom graph on top */}
      <g stroke="#34322d" strokeWidth="1.2">
        <line x1="100" y1="64" x2="76" y2="78"/>
        <line x1="100" y1="64" x2="124" y2="78"/>
        <line x1="76" y1="78" x2="100" y2="90"/>
        <line x1="124" y1="78" x2="100" y2="90"/>
        <line x1="76" y1="78" x2="76" y2="64"/>
        <line x1="124" y1="78" x2="124" y2="64"/>
      </g>
      <circle cx="100" cy="64" r="5" fill="#fff" stroke="#34322d" strokeWidth="1.4"/>
      <circle cx="76" cy="78" r="4.5" fill="#fff" stroke="#34322d" strokeWidth="1.4"/>
      <circle cx="124" cy="78" r="4.5" fill={ACC} stroke="none"/>
      <circle cx="100" cy="90" r="4.5" fill="#efeadf" stroke="#34322d" strokeWidth="1.2"/>
      <circle cx="76" cy="64" r="3.5" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
      <circle cx="124" cy="64" r="3.5" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
      {/* crystal glow dot */}
      <circle cx="100" cy="118" r="2.5" fill={ACC} stroke="none"/>
    </svg>
  )
}

export function RLDispatchIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 178 }}>
      {/* iso lattice diamond */}
      <g {...S}>
        <polygon points="100,120 158,88 100,56 42,88" fill="#ffffff"/>
        <polygon points="42,88 100,120 100,136 42,104" fill="#efeadf"/>
        <polygon points="100,120 158,88 158,104 100,136" fill="#e4ddcf"/>
      </g>
      {/* lattice grid */}
      <g stroke="#cfc8b9" strokeWidth="0.9">
        <line x1="71" y1="72" x2="129" y2="104"/>
        <line x1="129" y1="72" x2="71" y2="104"/>
        <line x1="85" y1="64" x2="143" y2="96"/>
        <line x1="115" y1="64" x2="57" y2="96"/>
      </g>
      {/* active RL path */}
      <polyline points="71,88 100,72 129,88 100,104" fill="none" stroke={ACC} strokeWidth="1.8"/>
      <circle cx="71" cy="88" r="3.5" fill="#34322d" stroke="none"/>
      <circle cx="129" cy="88" r="3.5" fill={ACC} stroke="none"/>
      <circle cx="100" cy="72" r="3" fill="#34322d" stroke="none"/>
      <circle cx="100" cy="104" r="3" fill="#34322d" stroke="none"/>
    </svg>
  )
}

export function ForecastingIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 178 }}>
      {/* stacked iso time-series planes */}
      <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
        <polygon points="100,112 152,88 112,72 60,96" fill="#efeadf"/>
        <polygon points="100,92 152,68 112,52 60,76" fill="#ffffff"/>
        <polygon points="100,72 152,48 112,32 60,56" fill="#f0ede6"/>
      </g>
      {/* trend line (forecast) on top plane */}
      <polyline points="65,56 82,50 102,54 130,38 148,50" fill="none" stroke={ACC} strokeWidth="1.8"/>
      <circle cx="148" cy="50" r="3.2" fill={ACC} stroke="none"/>
      {/* uncertainty band */}
      <path d="M130,38 L130,44 M148,50 L148,56" stroke={ACC} strokeWidth="1" opacity="0.5"/>
      {/* depth guides */}
      <g stroke="#bdb6a6" strokeWidth="0.9" strokeDasharray="2 3">
        <line x1="60" y1="96" x2="60" y2="76"/>
        <line x1="152" y1="88" x2="152" y2="68"/>
      </g>
      {/* data point dots on lower plane */}
      <circle cx="72" cy="94" r="2" fill="#9c968a" stroke="none"/>
      <circle cx="90" cy="90" r="2" fill="#9c968a" stroke="none"/>
      <circle cx="110" cy="86" r="2" fill="#9c968a" stroke="none"/>
      <circle cx="130" cy="90" r="2" fill="#9c968a" stroke="none"/>
    </svg>
  )
}

export function GenerativeIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 178 }}>
      {/* iso emitter box */}
      <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="100,112 148,88 100,64 52,88" fill="#ffffff"/>
        <polygon points="52,88 100,112 100,128 52,104" fill="#efeadf"/>
        <polygon points="100,112 148,88 148,104 100,128" fill="#e4ddcf"/>
      </g>
      {/* rising SELFIES hexagons */}
      <g stroke={ACC} strokeWidth="1.6" fill="none">
        <polygon points="100,52 112,59 112,73 100,80 88,73 88,59" fill="#f7e2d5"/>
      </g>
      <circle cx="100" cy="66" r="3.5" fill={ACC} stroke="none"/>
      <g stroke="#cdc6b8" strokeWidth="1.4" fill="none">
        <polygon points="74,34 82,38 82,48 74,52 66,48 66,38" fill="#fafafa"/>
        <polygon points="126,30 134,34 134,44 126,48 118,44 118,34" fill="#fafafa"/>
      </g>
      <circle cx="74" cy="43" r="2.4" fill="#8a857a" stroke="none"/>
      <circle cx="126" cy="39" r="2.4" fill="#8a857a" stroke="none"/>
      {/* rising guides */}
      <g stroke="#d8d1c1" strokeWidth="1" strokeDasharray="2 4">
        <line x1="100" y1="88" x2="100" y2="80"/>
        <line x1="74" y1="80" x2="74" y2="52"/>
        <line x1="126" y1="80" x2="126" y2="48"/>
      </g>
    </svg>
  )
}

export function UploadIcon() {
  return (
    <svg viewBox="0 0 200 150" style={{ width: 170 }}>
      {/* dark iso box */}
      <g stroke="#f1ede4" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="100,90 148,66 100,42 52,66" fill="#2a2825"/>
        <polygon points="52,66 100,90 100,116 52,92" fill="#211f1c"/>
        <polygon points="100,90 148,66 148,92 100,116" fill="#1b1a17"/>
      </g>
      {/* upload arrow */}
      <path d="M100,82 l0,-28 M100,54 l-10,10 M100,54 l10,10"
        fill="none" stroke={ACC} strokeWidth="2.2" strokeLinecap="round"/>
      {/* status LED green */}
      <circle cx="140" cy="60" r="3.5" fill="#34c759" stroke="none"/>
      {/* bolt corners */}
      <circle cx="58" cy="68" r="2" fill="#3a3733" stroke="none"/>
      <circle cx="142" cy="68" r="2" fill="#3a3733" stroke="none"/>
    </svg>
  )
}
