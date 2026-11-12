// Axon S1 Solid Iso — nuclear pressure vessel cross-section
export default function NuclearIso() {
  return (
    <div style={{
      position: 'relative', background: '#faf7f0', border: '1px solid #ece5d6',
      borderRadius: 16, padding: 18,
      backgroundImage: 'radial-gradient(#e7e0d1 1px,transparent 1px)', backgroundSize: '22px 22px',
    }}>
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a' }}>
        VESSEL A · EUROFER97
      </div>
      <svg viewBox="0 0 460 360" style={{ width: '100%', display: 'block' }}>
        {/* ── Vessel body iso cylinder ── */}
        <g stroke="#34322d" strokeWidth="1.7" strokeLinejoin="round">
          {/* cylinder left/right walls */}
          <line x1="148" y1="120" x2="148" y2="256" stroke="#34322d" strokeWidth="1.7"/>
          <line x1="312" y1="120" x2="312" y2="256" stroke="#34322d" strokeWidth="1.7"/>
          {/* bottom curve */}
          <path d="M148,256 A82,35 0 0 0 312,256" fill="#efeadf" stroke="#34322d" strokeWidth="1.7"/>
          {/* body fill */}
          <rect x="148" y="120" width="164" height="136" fill="#f6f2ea"/>
        </g>
        {/* top cap ellipse */}
        <ellipse cx="230" cy="120" rx="82" ry="35" fill="#ffffff" stroke="#34322d" strokeWidth="1.7"/>
        <ellipse cx="230" cy="120" rx="56" ry="23" fill="#efeadf" stroke="#34322d" strokeWidth="1.2"/>

        {/* ── Embrittlement band ── */}
        <path d="M148,190 A82,35 0 0 0 312,190" fill="none" stroke="#cf5a2a" strokeWidth="7" opacity="0.85"/>
        {/* dashed boundary lines */}
        <path d="M148,178 A82,35 0 0 0 312,178" fill="none" stroke="#34322d" strokeWidth="1" strokeDasharray="3 4"/>
        <path d="M148,202 A82,35 0 0 0 312,202" fill="none" stroke="#34322d" strokeWidth="1" strokeDasharray="3 4"/>

        {/* ── Surface detail lines ── */}
        <g stroke="#ddd6c4" strokeWidth="0.8">
          <line x1="148" y1="150" x2="312" y2="150"/>
          <line x1="148" y1="230" x2="312" y2="230"/>
        </g>

        {/* ── Rivets / bolts ── */}
        <g fill="#34322d">
          <circle cx="156" cy="148" r="2.5"/><circle cx="304" cy="148" r="2.5"/>
          <circle cx="156" cy="212" r="2.5"/><circle cx="304" cy="212" r="2.5"/>
          <circle cx="156" cy="180" r="2.5"/><circle cx="304" cy="180" r="2.5"/>
        </g>

        {/* ── Inspection callout ── */}
        <g stroke="#bdb6a6" strokeWidth="1" strokeDasharray="2 3">
          <line x1="312" y1="190" x2="374" y2="162"/>
        </g>
        <rect x="346" y="142" width="96" height="38" rx="5" fill="#fff" stroke="#e0d9ca" strokeWidth="1"/>
        <text x="356" y="157" fontFamily="'Space Mono',monospace" fontSize="9" fill="#b23b2e">⚠ embrittlement</text>
        <text x="356" y="170" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a">0.78 idx ↑</text>

        {/* ── Dimension guide ── */}
        <g stroke="#bdb6a6" strokeWidth="0.9" strokeDasharray="2 3">
          <line x1="116" y1="120" x2="116" y2="256"/>
          <line x1="110" y1="120" x2="122" y2="120"/>
          <line x1="110" y1="256" x2="122" y2="256"/>
        </g>
        <text x="106" y="192" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a" textAnchor="middle" transform="rotate(-90,106,192)">HEIGHT</text>

        {/* status LEDs bottom */}
        <circle cx="200" cy="280" r="3.5" fill="#cf5a2a" stroke="none"/>
        <circle cx="216" cy="280" r="3.5" fill="#cf5a2a" stroke="none"/>
        <circle cx="232" cy="280" r="3.5" fill="#34c759" stroke="none"/>
        <text x="255" y="284" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a">STATUS LEDS</text>
      </svg>
    </div>
  )
}
