import { Link } from 'react-router-dom'
import { DomainsIso, FieldsIso, WorkbenchIso, BenchmarksIso } from '../illustrations/OrganizedIso'

const ACCENT = '#cf5a2a'
const MONO = "'Space Mono',monospace"

// Small eyebrow glyphs (14px line icons), one per row.
const glyph = { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: ACCENT, strokeWidth: 1.3, strokeLinejoin: 'round' }
const icons = {
  domains: (
    <svg {...glyph}><rect x="1" y="1" width="5" height="5" /><rect x="8" y="1" width="5" height="5" /><rect x="1" y="8" width="5" height="5" /><rect x="8" y="8" width="5" height="5" fill={ACCENT} /></svg>
  ),
  fields: (
    <svg {...glyph}><path d="M7 13s-4.5-4.2-4.5-7.3a4.5 4.5 0 0 1 9 0C11.5 8.8 7 13 7 13z" /><circle cx="7" cy="5.7" r="1.6" fill={ACCENT} /></svg>
  ),
  workbench: (
    <svg {...glyph}><circle cx="7" cy="7" r="6" /><path d="M5.5 4.3v5.4L9.8 7z" fill={ACCENT} /></svg>
  ),
  benchmarks: (
    <svg {...glyph}><circle cx="7" cy="7" r="6" /><circle cx="7" cy="7" r="3.2" /><circle cx="7" cy="7" r="1" fill={ACCENT} /></svg>
  ),
}

// Copy is fixed product wording — keep claims in sync with ereuna-geothermal-rewrite-brief.md.
// `link` is only set where a real route exists.
const rows = [
  {
    n: '01', key: 'domains', title: 'Domains', Art: DomainsIso,
    desc: 'Seven research areas, from exploration and drilling to reservoir and production engineering.',
    link: { to: '#domains', label: 'Explore the 7 research areas' },
  },
  {
    n: '02', key: 'fields', title: 'Fields', Art: FieldsIso,
    desc: 'Work anchored to real Kenyan geothermal fields and the wells published about them.',
  },
  {
    n: '03', key: 'workbench', title: 'Workbench', Art: WorkbenchIso,
    desc: 'Run the chain yourself: simulate a reservoir, sample virtual wells, train, validate.',
  },
  {
    n: '04', key: 'benchmarks', title: 'Benchmarks', Art: BenchmarksIso,
    desc: 'Models scored on held-out wells and calibrated uncertainty, not a single error number.',
    link: { to: '/benchmarks', label: 'Browse benchmarks' },
  },
]

export default function HowEreunaIsOrganized() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>HOW EREUNA IS ORGANIZED</div>
        <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0', maxWidth: 560 }}>
          From a geothermal question to a tested answer
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 20, overflow: 'hidden' }}>
        {rows.map(({ n, key, title, desc, Art, link }, i) => (
          <div key={key} className={`org-row${i % 2 ? ' org-row--flip' : ''}`}>
            <div className="org-text" style={{
              padding: 'clamp(32px, 5vw, 60px) clamp(24px, 4.5vw, 56px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>
                {icons[key]}
                {n}
              </div>
              <h3 style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, margin: '12px 0 0' }}>{title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', margin: '12px 0 0', maxWidth: 400 }}>{desc}</p>
              {link && (
                link.to.startsWith('#') ? (
                  <a href={link.to} style={{ marginTop: 18, fontSize: 14, fontWeight: 500, color: ACCENT, textDecoration: 'none' }}>
                    {link.label} ▸
                  </a>
                ) : (
                  <Link to={link.to} style={{ marginTop: 18, fontSize: 14, fontWeight: 500, color: ACCENT, textDecoration: 'none' }}>
                    {link.label} ▸
                  </Link>
                )
              )}
            </div>
            <div className="org-art" style={{
              background: '#faf7f0',
              backgroundImage: 'radial-gradient(#e7e0d1 1px,transparent 1px)', backgroundSize: '22px 22px',
              padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360,
            }}>
              <Art />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
