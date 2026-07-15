import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllDatasets, DOMAIN_COLORS } from '../api/datasets'
import PageHero from '../components/PageHero'
import { CardIllustration } from '../components/CardIllustration'
import { DOMAIN_ILLUSTRATIONS, PAGE_ILLUSTRATIONS, getIllustrationById } from '../lib/illustrations'

const ACCENT = '#cf5a2a'

const DOMAINS = ['All', 'Geothermal', 'Nuclear', 'Wind', 'Solar', 'Hydro', 'Grid']

function DatasetCard({ dataset: d }) {
  const illo = (d.illustration && getIllustrationById(d.illustration)?.src) || DOMAIN_ILLUSTRATIONS[d.domain]
  return (
    <Link to={`/datasets/${d.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
          overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .15s', height: '100%',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {illo && <CardIllustration src={illo} alt={`${d.domain} dataset illustration`} height={140} />}
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <span style={{
                display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                fontFamily: "'Space Mono',monospace", marginBottom: 8,
                background: (DOMAIN_COLORS[d.domain] || '#8a857a') + '18',
                color: DOMAIN_COLORS[d.domain] || '#8a857a',
              }}>
                {d.domain}
              </span>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{d.title}</div>
            </div>
          </div>
          <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 9 }}>{d.desc}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #e7e0d2', color: '#8a857a',
            }}>{d.format}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #e7e0d2', color: '#8a857a',
            }}>{d.license}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: '#a09990' }}>
            <span>{d.rows} rows · {d.size}</span>
            <span>↓ {d.downloads}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DatasetsPage() {
  const [allDatasets, setAllDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [domain, setDomain] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchAllDatasets().then(data => { setAllDatasets(data); setLoading(false) })
  }, [])

  const filtered = allDatasets.filter(d => {
    const matchDomain = domain === 'All' || d.domain === domain
    const matchQuery = !query ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.desc.toLowerCase().includes(query.toLowerCase())
    return matchDomain && matchQuery
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHero
        eyebrow="DATA REPOSITORY"
        title="Datasets"
        description="Curated, physics-validated datasets for energy ML research — from well logs and SCADA streams to molecular libraries."
        illustration={PAGE_ILLUSTRATIONS.datasets}
        illustrationAlt="Datasets illustration"
      >
        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search datasets…"
            style={{
              fontFamily: 'inherit', fontSize: 14, padding: '9px 14px', borderRadius: 9,
              border: '1.4px solid #ddd6c8', background: '#fff', outline: 'none', width: 240,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              style={{
                fontFamily: 'inherit', fontSize: 13, padding: '6px 14px', borderRadius: 20,
                border: '1.4px solid', cursor: 'pointer', fontWeight: domain === d ? 600 : 400,
                background: domain === d ? '#1b1a17' : '#fff',
                color: domain === d ? '#f1ede4' : '#56524a',
                borderColor: domain === d ? '#1b1a17' : '#ddd6c8',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </PageHero>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} dataset${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 280, background: '#f0ebe0', borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {filtered.map(d => <DatasetCard key={d.id} dataset={d} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8a857a', fontSize: 15 }}>
            No datasets match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
