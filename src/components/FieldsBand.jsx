import { Link } from 'react-router-dom'

const INK = '#17202e'
const MUTED = '#545b66'

const TILES = [
  { src: '/photos/menengai-caldera.webp', alt: 'Menengai caldera seen from the air', title: 'Menengai caldera, Nakuru',
    credit: 'Mkenyampoa', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Menengai_crater_at_dawn.jpg' },
  { src: '/photos/hellsgate-steam-pipes.webp', alt: "Steam pipelines winding across scrubland below a hill in Hell's Gate National Park", title: "Steam pipes, Hell's Gate National Park",
    credit: 'Alexandra Cadet', licence: 'CC BY-SA 4.0', href: "https://commons.wikimedia.org/wiki/File:Steam_pipes_in_Hell's_Gate_National_Park.jpg" },
  { src: '/photos/eburru-steam.webp', alt: 'Geothermal steam rising from rocks in the Eburru hills', title: 'Geothermal steam, Eburru hills',
    credit: 'Kamau Daniel Mwaura', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:GEOTHERMAL_STEAM_IN_THE_ROCKY_HILLS_OF_EBURRU.jpg' },
]

const mono = { fontFamily: "'IBM Plex Mono',monospace" }
const creditLink = { color: 'inherit' }

export default function FieldsBand() {
  return (
    <section aria-label="Fields" style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <figure style={{ margin: 0, position: 'relative', overflow: 'hidden', aspectRatio: '3 / 1', minHeight: 240, border: `1px solid ${INK}`, borderRadius: 2 }}>
        <img className="survey-kb" src="/photos/rift-escarpment.webp" loading="lazy"
          alt="The floor of the Great Rift Valley in Kenya seen from the escarpment"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(245,242,235,0.95) 0%, rgba(245,242,235,0.72) 40%, rgba(245,242,235,0) 72%)' }} />
        <figcaption style={{ position: 'absolute', left: 32, right: 32, bottom: 28, maxWidth: 470, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', color: INK }}>SHEET 02 · FIELDS</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 32, lineHeight: 1.08, letterSpacing: '-0.03em', color: INK }}>
            Work anchored to real Kenyan geothermal fields and the wells published about them.
          </span>
          <Link to="/fields" style={{ color: INK, fontSize: 15, fontWeight: 500 }}>Explore geothermal fields</Link>
        </figcaption>
      </figure>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        {TILES.map(t => (
          <figure key={t.src} className="survey-tile" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ overflow: 'hidden', border: `1px solid ${INK}` }}>
              <img src={t.src} alt={t.alt} loading="lazy" width="960" height="720"
                style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
            </div>
            <figcaption style={{ fontSize: 13, color: MUTED }}>
              <span style={{ color: INK, fontWeight: 500 }}>{t.title}</span><br />
              {t.credit} · {t.licence} · <a href={t.href} style={creditLink} target="_blank" rel="noreferrer">Commons</a>
            </figcaption>
          </figure>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: MUTED }}>
        Banner: Great Rift Valley, Kenya · Ninara · CC BY 2.0 · <a href="https://commons.wikimedia.org/wiki/File:Great_Rift_Valley,_Kenya_-_51951583317.jpg" style={creditLink} target="_blank" rel="noreferrer">Commons</a>.
        All photos cropped and duotoned; CC BY-SA adaptations are shared under the same licence.
      </p>
    </section>
  )
}
