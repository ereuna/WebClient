// Axon S3 Blueprint — 4 floating iso planes with right-angle leader lines
export default function EnergyGraphLayers() {
  return (
    <svg viewBox="0 0 820 400" style={{ width: '100%', maxWidth: 880, display: 'block', margin: '0 auto', fontFamily: "'Space Mono',monospace" }}>
      {/* vertical dashed spine */}
      <line x1="410" y1="60" x2="410" y2="320" stroke="#cfc8b9" strokeWidth="1" strokeDasharray="2 4"/>

      {/* ── LAYER 4 MaterialSpec (bottom) ── */}
      <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="260,280 410,292 560,280 410,268" fill="#efeadf"/>
        <polygon points="260,280 410,292 410,304 260,292" fill="#e0d9ca"/>
        <polygon points="410,292 560,280 560,292 410,304" fill="#d5cdb9"/>
        {/* crystal lattice — atom nodes + bonds */}
        <g stroke="#9c968a" strokeWidth="0.85">
          <line x1="355" y1="274" x2="383" y2="280"/><line x1="383" y1="280" x2="410" y2="272"/>
          <line x1="410" y1="272" x2="438" y2="280"/><line x1="438" y1="280" x2="466" y2="274"/>
          <line x1="355" y1="274" x2="383" y2="286"/><line x1="383" y1="280" x2="383" y2="286"/>
          <line x1="410" y1="272" x2="383" y2="286"/><line x1="438" y1="280" x2="410" y2="288"/>
          <line x1="438" y1="280" x2="438" y2="288"/><line x1="466" y1="274" x2="438" y2="288"/>
          <line x1="383" y1="286" x2="410" y2="288"/><line x1="410" y1="288" x2="438" y2="288"/>
          <line x1="340" y1="280" x2="355" y2="274"/><line x1="340" y1="280" x2="355" y2="286"/>
          <line x1="480" y1="280" x2="466" y2="274"/><line x1="480" y1="280" x2="466" y2="286"/>
        </g>
        <g fill="#9c968a" stroke="none">
          <circle cx="340" cy="280" r="2.2"/><circle cx="355" cy="274" r="2.2"/>
          <circle cx="410" cy="272" r="2.2"/><circle cx="466" cy="274" r="2.2"/>
          <circle cx="480" cy="280" r="2.2"/><circle cx="355" cy="286" r="2.2"/>
          <circle cx="438" cy="280" r="2.2"/><circle cx="410" cy="288" r="2.2"/>
          <circle cx="438" cy="288" r="2.2"/><circle cx="466" cy="286" r="2.2"/>
        </g>
        <circle cx="383" cy="280" r="3.2" fill="#cf5a2a" stroke="none"/>
      </g>

      {/* ── LAYER 3 FieldState ── */}
      <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="260,214 410,226 560,214 410,202" fill="#ffffff"/>
        <polygon points="260,214 410,226 410,238 260,226" fill="#efeadf"/>
        <polygon points="410,226 560,214 560,226 410,238" fill="#e4ddcf"/>
        {/* field isolines — discretised scalar field */}
        <line x1="360" y1="207" x2="460" y2="207" stroke="#d3ccbd" strokeWidth="0.7"/>
        <line x1="316" y1="211" x2="504" y2="211" stroke="#cfc8b9" strokeWidth="0.7"/>
        <line x1="278" y1="214" x2="542" y2="214" stroke="#c8c0b0" strokeWidth="0.8"/>
        <line x1="316" y1="217" x2="504" y2="217" stroke="#cfc8b9" strokeWidth="0.7"/>
        <line x1="360" y1="221" x2="460" y2="221" stroke="#d3ccbd" strokeWidth="0.7"/>
        {/* hot zone */}
        <line x1="393" y1="210" x2="427" y2="210" stroke="#cf5a2a" strokeWidth="1.3" opacity="0.75"/>
        <circle cx="410" cy="211" r="3.2" fill="#cf5a2a" opacity="0.65" stroke="none"/>
        {/* sensor measurement points */}
        <circle cx="362" cy="214" r="2.2" fill="#9c968a" stroke="none"/>
        <circle cx="458" cy="214" r="2.2" fill="#9c968a" stroke="none"/>
      </g>

      {/* ── LAYER 2 SensorGraph ── */}
      <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="260,148 410,160 560,148 410,136" fill="#ffffff"/>
        <polygon points="260,148 410,160 410,172 260,160" fill="#efeadf"/>
        <polygon points="410,160 560,148 560,160 410,172" fill="#e4ddcf"/>
        {/* sensor graph — expanded network topology */}
        <line x1="297" y1="150" x2="350" y2="148" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="350" y1="148" x2="375" y2="146" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="375" y1="146" x2="410" y2="154" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="375" y1="146" x2="410" y2="141" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="410" y1="154" x2="445" y2="146" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="445" y1="146" x2="481" y2="144" stroke="#34322d" strokeWidth="1.1"/>
        <line x1="481" y1="144" x2="512" y2="148" stroke="#34322d" strokeWidth="1.1"/>
        <circle cx="297" cy="150" r="2.2" fill="#efeadf" stroke="#34322d" strokeWidth="1.1"/>
        <circle cx="350" cy="148" r="2.4" fill="#efeadf" stroke="#34322d" strokeWidth="1.2"/>
        <circle cx="375" cy="146" r="2.8" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
        <circle cx="410" cy="154" r="3.2" fill="#cf5a2a" stroke="none"/>
        <circle cx="410" cy="141" r="2.4" fill="#fff" stroke="#34322d" strokeWidth="1.1"/>
        <circle cx="445" cy="146" r="2.8" fill="#fff" stroke="#34322d" strokeWidth="1.2"/>
        <circle cx="481" cy="144" r="2.4" fill="#efeadf" stroke="#34322d" strokeWidth="1.2"/>
        <circle cx="512" cy="148" r="2.2" fill="#efeadf" stroke="#34322d" strokeWidth="1.1"/>
      </g>

      {/* ── LAYER 1 PhysicsSpec (top, accent) ── */}
      <g stroke="#34322d" strokeWidth="1.7" strokeLinejoin="round">
        <polygon points="260,82 410,94 560,82 410,70" fill="#ffffff"/>
        <polygon points="260,82 410,94 410,106 260,94" fill="#f3d9c9"/>
        <polygon points="410,94 560,82 560,94 410,106" fill="#ecc9b4"/>
        {/* accent inset */}
        <polygon points="360,82 410,86 460,82 410,78" fill="#f7e2d5" stroke="#cf5a2a" strokeWidth="1.5"/>
        {/* crop corner marks */}
        <line x1="250" y1="70" x2="262" y2="70" stroke="#cf5a2a" strokeWidth="1.2"/>
        <line x1="250" y1="70" x2="250" y2="82" stroke="#cf5a2a" strokeWidth="1.2"/>
        <line x1="570" y1="70" x2="558" y2="70" stroke="#cf5a2a" strokeWidth="1.2"/>
        <line x1="570" y1="70" x2="570" y2="82" stroke="#cf5a2a" strokeWidth="1.2"/>
      </g>

      {/* ── LEFT leader lines ── */}
      <g stroke="#bdb6a6" strokeWidth="1" strokeDasharray="2 3">
        <line x1="260" y1="82" x2="170" y2="82"/>
        <line x1="260" y1="148" x2="170" y2="148"/>
        <line x1="260" y1="214" x2="170" y2="214"/>
        <line x1="260" y1="280" x2="170" y2="280"/>
        {/* right-angle elbows */}
        <line x1="170" y1="82" x2="160" y2="82"/>
        <line x1="170" y1="148" x2="160" y2="148"/>
        <line x1="170" y1="214" x2="160" y2="214"/>
        <line x1="170" y1="280" x2="160" y2="280"/>
      </g>
      {/* left labels */}
      <g fontSize="12" fill="#1b1a17" textAnchor="end">
        <text x="152" y="80" fontWeight="700">PhysicsSpec</text>
        <text x="152" y="94" fontSize="9.5" fill="#8a857a">governing equation</text>
        <text x="152" y="146">SensorGraph</text>
        <text x="152" y="160" fontSize="9.5" fill="#8a857a">sensor topology</text>
        <text x="152" y="212">FieldState</text>
        <text x="152" y="226" fontSize="9.5" fill="#8a857a">spatiotemporal field</text>
        <text x="152" y="278">MaterialSpec</text>
        <text x="152" y="292" fontSize="9.5" fill="#8a857a">crystal + composition</text>
      </g>

      {/* ── RIGHT leader lines ── */}
      <g stroke="#bdb6a6" strokeWidth="1" strokeDasharray="2 3">
        <line x1="560" y1="82" x2="638" y2="82"/>
        <line x1="560" y1="214" x2="638" y2="214"/>
      </g>
      <g fontSize="10" fill="#8a857a" textAnchor="start">
        <text x="644" y="80">PhysicsSpec_cosine</text>
        <text x="644" y="92">→ transfer score</text>
        <text x="644" y="212">FEM mesh + 1σ</text>
        <text x="644" y="224">uncertainty field</text>
      </g>

      {/* layer index ticks */}
      <g fontFamily="'Space Mono',monospace" fontSize="8" fill="#cf5a2a" textAnchor="middle">
        <text x="410" y="64">L1</text>
        <text x="410" y="130">L2</text>
        <text x="410" y="196">L3</text>
        <text x="410" y="262">L4</text>
      </g>
    </svg>
  )
}
