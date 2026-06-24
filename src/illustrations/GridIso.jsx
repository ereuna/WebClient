// Axon S1 Solid Iso — dispatch network: 4 source modules → central hub
export default function GridIso() {
  return (
    <div style={{
      position: 'relative', background: '#faf7f0', border: '1px solid #ece5d6',
      borderRadius: 16, padding: 18,
      backgroundImage: 'radial-gradient(#e7e0d1 1px,transparent 1px)', backgroundSize: '22px 22px',
    }}>
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a' }}>
        KENYA · DISPATCH NETWORK
      </div>
      <svg viewBox="0 0 460 360" style={{ width: '100%', display: 'block' }}>

        {/* ── Link lines ── */}
        <g stroke="#bdb6a6" strokeWidth="1.3">
          <line x1="120" y1="126" x2="230" y2="204"/>
          <line x1="340" y1="126" x2="230" y2="204"/>
          <line x1="110" y1="250" x2="230" y2="204"/>
        </g>
        {/* geothermal link (accent dashed) */}
        <line x1="350" y1="256" x2="230" y2="204" stroke="#cf5a2a" strokeWidth="1.8" strokeDasharray="4 4"/>

        {/* ── Source module: hydro ── */}
        <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="120,100 166,124 120,148 74,124" fill="#fff"/>
          <polygon points="74,124 120,148 120,170 74,146" fill="#efeadf"/>
          <polygon points="120,148 166,124 166,146 120,170" fill="#e4ddcf"/>
          <circle cx="92" cy="126" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="148" cy="126" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="120" cy="102" r="3" fill="#34c759" stroke="none"/>
        </g>
        <text x="120" y="96" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a" textAnchor="middle">HYDRO</text>

        {/* ── Source module: wind ── */}
        <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="340,100 386,124 340,148 294,124" fill="#fff"/>
          <polygon points="294,124 340,148 340,170 294,146" fill="#efeadf"/>
          <polygon points="340,148 386,124 386,146 340,170" fill="#e4ddcf"/>
          <circle cx="312" cy="126" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="368" cy="126" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="340" cy="102" r="3" fill="#34c759" stroke="none"/>
        </g>
        <text x="340" y="96" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a" textAnchor="middle">WIND</text>

        {/* ── Source module: solar ── */}
        <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="110,226 156,250 110,274 64,250" fill="#fff"/>
          <polygon points="64,250 110,274 110,296 64,272" fill="#efeadf"/>
          <polygon points="110,274 156,250 156,272 110,296" fill="#e4ddcf"/>
          <circle cx="82" cy="252" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="138" cy="252" r="2" fill="#8a857a" stroke="none"/>
          <circle cx="110" cy="228" r="3" fill="#34c759" stroke="none"/>
        </g>
        <text x="110" y="222" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#8a857a" textAnchor="middle">SOLAR</text>

        {/* ── Source module: geothermal (accent) ── */}
        <g stroke="#34322d" strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="350,232 396,256 350,280 304,256" fill="#fff"/>
          <polygon points="304,256 350,280 350,302 304,278" fill="#f3d9c9"/>
          <polygon points="350,280 396,256 396,278 350,302" fill="#ecc9b4"/>
          <circle cx="322" cy="258" r="2" fill="#cf5a2a" stroke="none"/>
          <circle cx="378" cy="258" r="2" fill="#cf5a2a" stroke="none"/>
          <circle cx="350" cy="234" r="3.5" fill="#cf5a2a" stroke="none"/>
        </g>
        <text x="350" y="320" fontFamily="'Space Mono',monospace" fontSize="8.5" fill="#cf5a2a" textAnchor="middle">GEOTHERMAL</text>

        {/* ── Central hub ── */}
        <g stroke="#34322d" strokeWidth="1.7" strokeLinejoin="round">
          <polygon points="230,172 296,205 230,238 164,205" fill="#ffffff"/>
          <polygon points="164,205 230,238 230,270 164,237" fill="#efeadf"/>
          <polygon points="230,238 296,205 296,237 230,270" fill="#e2dbcc"/>
          {/* accent inset */}
          <polygon points="230,188 264,205 230,222 196,205" fill="#f7e2d5" stroke="#cf5a2a" strokeWidth="1.4"/>
          <circle cx="230" cy="205" r="5.5" fill="#cf5a2a" stroke="none"/>
          {/* bolts */}
          <circle cx="174" cy="208" r="2.3" fill="#34322d" stroke="none"/>
          <circle cx="286" cy="208" r="2.3" fill="#34322d" stroke="none"/>
          <circle cx="174" cy="232" r="2.3" fill="#34322d" stroke="none"/>
          <circle cx="286" cy="232" r="2.3" fill="#34322d" stroke="none"/>
        </g>
        <text x="230" y="168" fontFamily="'Space Mono',monospace" fontSize="9" fill="#1b1a17" textAnchor="middle" fontWeight="bold">DISPATCH HUB</text>
      </svg>
    </div>
  )
}
