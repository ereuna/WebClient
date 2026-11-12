// Axon S1 Solid Iso — reservoir thermal cross-section with 3 stacked terrain layers
export default function GeothermalIso() {
  return (
    <div style={{
      position: 'relative', background: '#faf7f0', border: '1px solid #ece5d6',
      borderRadius: 16, padding: 18,
      backgroundImage: 'radial-gradient(#e7e0d1 1px,transparent 1px)', backgroundSize: '22px 22px',
    }}>
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a' }}>
        RESERVOIR · 24 WELLS
      </div>
      <svg viewBox="0 0 460 360" style={{ width: '100%', display: 'block' }}>
        {/* ── LAYER 3 deep rock ── */}
        <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="230,258 358,322 358,346 230,282" fill="#e2dbcc"/>
          <polygon points="102,322 230,258 230,282 102,346" fill="#e9e3d6"/>
          <polygon points="102,322 358,322 358,346 102,346" fill="#d8d0bc"/>
          {/* surface detail */}
          <line x1="166" y1="322" x2="230" y2="294" stroke="#cfc8b9" strokeWidth="0.8"/>
          <line x1="294" y1="322" x2="230" y2="294" stroke="#cfc8b9" strokeWidth="0.8"/>
        </g>

        {/* ── LAYER 2 thermal zone (hotspot) ── */}
        <g stroke="#34322d" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="230,194 358,258 230,322 102,258" fill="#f6f2ea"/>
          {/* thermal hotspot inset */}
          <polygon points="230,228 268,248 230,268 192,248" fill="#f3d3c0" stroke="#cf5a2a" strokeWidth="1.4"/>
          <circle cx="230" cy="248" r="6.5" fill="#cf5a2a" stroke="none"/>
          {/* heat contour lines */}
          <path d="M192,248 q19,-22 76,0" fill="none" stroke="#cf5a2a" strokeWidth="0.9" opacity="0.4"/>
          <path d="M176,248 q27,-32 108,0" fill="none" stroke="#cf5a2a" strokeWidth="0.7" opacity="0.25"/>
        </g>

        {/* ── LAYER 1 surface ── */}
        <g stroke="#34322d" strokeWidth="1.6" strokeLinejoin="round">
          <polygon points="230,130 358,194 230,258 102,194" fill="#ffffff"/>
          {/* cross grid */}
          <g stroke="#cfc8b9" strokeWidth="0.9">
            <line x1="166" y1="162" x2="294" y2="226"/>
            <line x1="294" y1="162" x2="166" y2="226"/>
          </g>
          {/* bolt corners */}
          <circle cx="110" cy="196" r="2.4" fill="#8a857a" stroke="none"/>
          <circle cx="350" cy="196" r="2.4" fill="#8a857a" stroke="none"/>
        </g>

        {/* ── Wells ── */}
        <g stroke="#34322d" strokeWidth="1.4">
          <line x1="196" y1="156" x2="196" y2="258"/>
          <line x1="272" y1="168" x2="272" y2="272"/>
        </g>
        <circle cx="196" cy="156" r="4.5" fill="#fff" stroke="#34322d" strokeWidth="1.4"/>
        <circle cx="272" cy="168" r="4.5" fill="#cf5a2a" stroke="none"/>
        {/* well LEDs */}
        <circle cx="196" cy="148" r="3" fill="#34c759" stroke="none"/>
        <circle cx="272" cy="160" r="3" fill="#cf5a2a" stroke="none"/>

        {/* ── Labels ── */}
        <text x="204" y="152" fontFamily="'Space Mono',monospace" fontSize="9" fill="#8a857a">OW-47</text>
        <text x="280" y="165" fontFamily="'Space Mono',monospace" fontSize="9" fill="#cf5a2a">OW-52 ●</text>

        {/* inspection callout */}
        <g stroke="#bdb6a6" strokeWidth="1" strokeDasharray="2 3">
          <line x1="268" y1="248" x2="340" y2="220"/>
        </g>
        <rect x="342" y="206" width="90" height="30" rx="5" fill="#fff" stroke="#e0d9ca" strokeWidth="1"/>
        <text x="352" y="219" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#cf5a2a">⚠ T+18°C</text>
        <text x="352" y="230" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a">anomaly</text>
      </svg>
    </div>
  )
}
