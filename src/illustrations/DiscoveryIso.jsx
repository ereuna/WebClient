// Axon S1 Solid Iso — dark mode generative materials discovery
export default function DiscoveryIso() {
  return (
    <svg viewBox="0 0 480 360" style={{ width: '100%', display: 'block' }}>
      {/* ── Generator base (dark iso box) ── */}
      <g stroke="#545b66" strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="240,256 326,296 240,336 154,296" fill="#17202e"/>
        <polygon points="154,296 240,336 240,352 154,312" fill="#17202e"/>
        <polygon points="240,336 326,296 326,312 240,352" fill="#0f1622"/>
        {/* accent inset on top */}
        <polygon points="240,272 294,296 240,320 186,296" fill="#243042" stroke="#c2410c" strokeWidth="1.4"/>
        <circle cx="240" cy="296" r="5" fill="#c2410c" stroke="none"/>
        {/* bolt details */}
        <circle cx="166" cy="300" r="2.2" fill="#2c3646" stroke="none"/>
        <circle cx="314" cy="300" r="2.2" fill="#2c3646" stroke="none"/>
        {/* surface line */}
        <line x1="154" y1="320" x2="240" y2="352" stroke="#2c3646" strokeWidth="0.8"/>
        <line x1="240" y1="352" x2="326" y2="320" stroke="#2c3646" strokeWidth="0.8"/>
      </g>

      {/* ── Emerging hexagonal candidates ── */}
      {/* centre top hex (accent — best candidate) */}
      <g stroke="#c2410c" strokeWidth="1.8" fill="none">
        <polygon points="240,84 262,96 262,120 240,132 218,120 218,96" fill="#3a241b"/>
      </g>
      <circle cx="240" cy="108" r="4.5" fill="#c2410c" stroke="none"/>

      {/* left hex */}
      <g stroke="#c9c4b8" strokeWidth="1.5" fill="none">
        <polygon points="178,138 192,146 192,162 178,170 164,162 164,146" fill="#17202e"/>
      </g>
      <circle cx="178" cy="154" r="2.8" fill="#5f6670" stroke="none"/>

      {/* right hex */}
      <g stroke="#c9c4b8" strokeWidth="1.5" fill="none">
        <polygon points="302,134 316,142 316,158 302,166 288,158 288,142" fill="#17202e"/>
      </g>
      <circle cx="302" cy="150" r="2.8" fill="#5f6670" stroke="none"/>

      {/* secondary left */}
      <g stroke="#2c3646" strokeWidth="1.2" fill="none">
        <polygon points="138,200 148,206 148,218 138,224 128,218 128,206" fill="#17202e"/>
      </g>
      {/* secondary right */}
      <g stroke="#2c3646" strokeWidth="1.2" fill="none">
        <polygon points="342,196 352,202 352,214 342,220 332,214 332,202" fill="#17202e"/>
      </g>

      {/* ── Rising guide lines ── */}
      <g stroke="#2c3646" strokeWidth="1" strokeDasharray="2 4">
        <line x1="240" y1="272" x2="240" y2="132"/>
        <line x1="178" y1="258" x2="178" y2="170"/>
        <line x1="302" y1="260" x2="302" y2="166"/>
      </g>

      {/* ── Property tags ── */}
      <g fontFamily="'IBM Plex Mono',monospace" fontSize="9.5">
        <rect x="284" y="90" width="92" height="22" rx="4" fill="#17202e" stroke="#2c3646"/>
        <text x="292" y="105" fill="#c2410c">ρ 1.92 g/cc</text>

        <rect x="62" y="194" width="86" height="22" rx="4" fill="#17202e" stroke="#2c3646"/>
        <text x="70" y="209" fill="#c9c4b8">SA 3.1 ✓</text>

        <rect x="330" y="210" width="98" height="22" rx="4" fill="#17202e" stroke="#2c3646"/>
        <text x="338" y="225" fill="#c9c4b8">Vdet 8940</text>
      </g>
    </svg>
  )
}
