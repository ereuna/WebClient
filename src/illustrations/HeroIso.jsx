// Axon S1 Solid Iso — Ereuna pipeline: inputs → central hub → output
// Cool Mono palette with orange accent status LED
export default function HeroIso() {
  return (
    <div style={{
      position: 'relative',
      backgroundImage: 'radial-gradient(#d3ccba 1px, transparent 1px)',
      backgroundSize: '22px 22px',
      borderRadius: 18, padding: 8,
    }}>
      {/* corner brackets */}
      {[['top:14px','left:14px','borderLeft','borderTop'],['top:14px','right:14px','borderRight','borderTop'],
        ['bottom:14px','left:14px','borderLeft','borderBottom'],['bottom:14px','right:14px','borderRight','borderBottom']
      ].map(([v, h, bA, bB], i) => (
        <div key={i} style={{
          position: 'absolute',
          ...Object.fromEntries([[v.split(':')[0], v.split(':')[1]], [h.split(':')[0], h.split(':')[1]]]),
          width: 20, height: 20,
          [bA]: '1.5px solid #b6ae9d', [bB]: '1.5px solid #b6ae9d',
        }} />
      ))}
      <div style={{
        position: 'absolute', top: 22, left: 24,
        fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: '#8a857a',
      }}>FIG.01 — EREUNA CORE</div>

      <svg viewBox="0 0 600 470" style={{ width: '100%', display: 'block' }}>
        {/* iso grid ground */}
        <g stroke="#d3ccbd" strokeWidth="0.8" opacity="0.7">
          <line x1="80" y1="320" x2="420" y2="480"/><line x1="140" y1="288" x2="480" y2="448"/>
          <line x1="200" y1="256" x2="540" y2="416"/><line x1="260" y1="224" x2="520" y2="374"/>
          <line x1="80" y1="320" x2="420" y2="160"/><line x1="120" y1="342" x2="460" y2="182"/>
          <line x1="160" y1="364" x2="500" y2="204"/><line x1="200" y1="386" x2="540" y2="226"/>
        </g>

        {/* conveyor guide dashed */}
        <polyline points="130,148 220,192 320,242 455,336"
          fill="none" stroke="#bdb6a6" strokeWidth="1.1" strokeDasharray="3 5"/>

        {/* INPUT MODULE A */}
        <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="130,130 196,162 130,194 64,162" fill="#ffffff"/>
          <polygon points="64,162 130,194 130,226 64,194" fill="#efeadf"/>
          <polygon points="130,194 196,162 196,194 130,226" fill="#e0d9ca"/>
          {/* PDE wave on surface */}
          <path d="M82,162 Q106,145 130,162 Q154,179 178,162"
            fill="none" stroke="#bdb6a6" strokeWidth="1.4"/>
          <circle cx="82" cy="162" r="2" fill="#bdb6a6" stroke="none"/>
          <circle cx="130" cy="162" r="2.5" fill="#34322d" stroke="none"/>
          <circle cx="178" cy="162" r="2" fill="#bdb6a6" stroke="none"/>
          {/* bolts */}
          <circle cx="95" cy="172" r="2.4" fill="#34322d" stroke="none"/>
          <circle cx="165" cy="172" r="2.4" fill="#34322d" stroke="none"/>
          {/* status LED — red (offline) */}
          <circle cx="130" cy="145" r="3.5" fill="#e04040" stroke="none"/>
        </g>
        {/* label */}
        <text x="130" y="126" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a" textAnchor="middle">PINN MODULE</text>

        {/* INPUT MODULE B */}
        <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="232,178 298,210 232,242 166,210" fill="#ffffff"/>
          <polygon points="166,210 232,242 232,274 166,242" fill="#efeadf"/>
          <polygon points="232,242 298,210 298,242 232,274" fill="#e0d9ca"/>
          {/* molecular graph on surface */}
          <line x1="183" y1="210" x2="206" y2="200" stroke="#bdb6a6" strokeWidth="1.2"/>
          <line x1="206" y1="200" x2="232" y2="208" stroke="#bdb6a6" strokeWidth="1.2"/>
          <line x1="232" y1="208" x2="258" y2="200" stroke="#bdb6a6" strokeWidth="1.2"/>
          <line x1="258" y1="200" x2="278" y2="209" stroke="#bdb6a6" strokeWidth="1.2"/>
          <line x1="206" y1="200" x2="258" y2="200" stroke="#bdb6a6" strokeWidth="0.9" strokeDasharray="2 3"/>
          <circle cx="183" cy="210" r="4" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
          <circle cx="206" cy="200" r="4" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
          <circle cx="232" cy="208" r="5" fill="#fff" stroke="#34322d" strokeWidth="1.5"/>
          <circle cx="258" cy="200" r="4.5" fill="#cf5a2a" stroke="none"/>
          <circle cx="278" cy="209" r="4" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
          {/* bolts */}
          <circle cx="197" cy="220" r="2.4" fill="#34322d" stroke="none"/>
          <circle cx="267" cy="220" r="2.4" fill="#34322d" stroke="none"/>
          {/* status LED — green (active) */}
          <circle cx="232" cy="193" r="3.5" fill="#34c759" stroke="none"/>
        </g>
        <text x="232" y="174" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a" textAnchor="middle">GNN MODULE</text>

        {/* CENTRAL HUB — large, floating */}
        <g style={{ animation: 'floaty 6s ease-in-out infinite', transformOrigin: '345px 295px' }}>
          <g stroke="#34322d" strokeWidth="1.8" strokeLinejoin="round">
            {/* body */}
            <polygon points="210,252 345,318 345,390 210,324" fill="#efeadf"/>
            <polygon points="345,318 480,252 480,324 345,390" fill="#ddd6c4"/>
            <polygon points="345,190 480,252 345,318 210,252" fill="#ffffff"/>
            {/* accent top inset */}
            <polygon points="345,218 415,252 345,286 275,252" fill="#f7e2d5" stroke="#cf5a2a" strokeWidth="1.6"/>
            {/* center orange LED */}
            <circle cx="345" cy="252" r="7.5" fill="#cf5a2a" stroke="none"/>
            {/* surface detail lines */}
            <line x1="240" y1="270" x2="345" y2="318" stroke="#cfc8b9" strokeWidth="0.8"/>
            <line x1="345" y1="318" x2="450" y2="270" stroke="#cfc8b9" strokeWidth="0.8"/>
            {/* circuit traces from center LED */}
            <line x1="345" y1="252" x2="295" y2="228" stroke="#cfc8b9" strokeWidth="0.9"/>
            <circle cx="295" cy="228" r="2.2" fill="#cfc8b9" stroke="none"/>
            <line x1="345" y1="252" x2="395" y2="228" stroke="#cfc8b9" strokeWidth="0.9"/>
            <circle cx="395" cy="228" r="2.2" fill="#cfc8b9" stroke="none"/>
            <line x1="345" y1="252" x2="345" y2="218" stroke="#cfc8b9" strokeWidth="0.9"/>
            <circle cx="345" cy="218" r="2" fill="#cfc8b9" stroke="none"/>
            {/* bolts */}
            <circle cx="270" cy="240" r="3" fill="#34322d" stroke="none"/>
            <circle cx="420" cy="240" r="3" fill="#34322d" stroke="none"/>
            <circle cx="255" cy="296" r="3" fill="#34322d" stroke="none"/>
            <circle cx="435" cy="296" r="3" fill="#34322d" stroke="none"/>
          </g>
        </g>
        <text x="345" y="186" fontFamily="'Space Mono',monospace" fontSize="10" fill="#1b1a17" textAnchor="middle" fontWeight="bold">EREUNA HUB</text>

        {/* OUTPUT MODULE — floating */}
        <g style={{ animation: 'floaty2 7s ease-in-out infinite' }}>
          <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="462,318 524,350 462,382 400,350" fill="#ffffff"/>
            <polygon points="400,350 462,382 462,412 400,382" fill="#efeadf"/>
            <polygon points="462,382 524,350 524,382 462,412" fill="#e0d9ca"/>
            <polygon points="462,332 492,348 462,364 432,348" fill="#f7e2d5" stroke="#cf5a2a" strokeWidth="1.3"/>
            {/* reward bars on bottom-left area */}
            <line x1="419" y1="362" x2="419" y2="356" stroke="#bdb6a6" strokeWidth="2.2"/>
            <line x1="427" y1="362" x2="427" y2="352" stroke="#bdb6a6" strokeWidth="2.2"/>
            <line x1="435" y1="362" x2="435" y2="349" stroke="#cf5a2a" strokeWidth="2.2"/>
            <line x1="443" y1="362" x2="443" y2="345" stroke="#cf5a2a" strokeWidth="2.2"/>
            <line x1="416" y1="362" x2="447" y2="362" stroke="#bdb6a6" strokeWidth="0.7"/>
            {/* green LED = ready */}
            <circle cx="462" cy="320" r="3.5" fill="#34c759" stroke="none"/>
            <circle cx="434" cy="360" r="2.3" fill="#34322d" stroke="none"/>
            <circle cx="490" cy="360" r="2.3" fill="#34322d" stroke="none"/>
          </g>
        </g>
        <text x="462" y="314" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a" textAnchor="middle">RL POLICY</text>

        {/* dimension guides */}
        <g stroke="#bdb6a6" strokeWidth="0.9" strokeDasharray="2 4">
          <line x1="210" y1="324" x2="210" y2="400"/>
          <line x1="480" y1="324" x2="480" y2="400"/>
          <line x1="215" y1="396" x2="475" y2="396"/>
        </g>
        <text x="345" y="410" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a" textAnchor="middle">ENERGYGRAPH INTERFACE</text>
      </svg>

      {/* floating labels */}
      {[
        { top: '32%', left: '5%', text: 'PINN ◦' },
        { top: '28%', right: '5%', text: '◦ GNN' },
        { bottom: '14%', right: '12%', text: 'RL policy', accent: true },
      ].map((l, i) => (
        <div key={i} style={{
          position: 'absolute', ...l,
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: l.accent ? '#cf5a2a' : '#56524a',
          background: '#fff',
          border: `1px solid ${l.accent ? '#f0c9b3' : '#ddd6c8'}`,
          borderRadius: 5, padding: '2px 7px',
        }}>{l.text}</div>
      ))}
    </div>
  )
}
