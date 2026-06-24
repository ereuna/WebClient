import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllDatasets, DOMAIN_COLORS } from '../api/datasets'

const ACCENT = '#cf5a2a'

const DOMAINS = ['All', 'Geothermal', 'Nuclear', 'Wind', 'Solar', 'Hydro', 'Grid']

function DatasetRow({ dataset: d }) {
  return (
    <Link to={`/datasets/${d.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
          padding: '20px 24px', display: 'flex', gap: 24, alignItems: 'flex-start',
          cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {/* Domain badge */}
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          <span style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500,
            fontFamily: "'Space Mono',monospace",
            background: (DOMAIN_COLORS[d.domain] || '#8a857a') + '18',
            color: DOMAIN_COLORS[d.domain] || '#8a857a',
          }}>
            {d.domain}
          </span>
        </div>

        {/* Main info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>{d.title}</div>
          <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 6 }}>{d.desc}</div>
        </div>

        {/* Meta */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', minWidth: 140 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #e7e0d2', color: '#8a857a',
            }}>{d.format}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #e7e0d2', color: '#8a857a',
            }}>{d.license}</span>
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990', textAlign: 'right' }}>
            {d.rows} rows · {d.size}
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990' }}>
            ↓ {d.downloads}
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
      {/* Page header */}
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.08em', color: ACCENT, marginBottom: 16 }}>
            DATA REPOSITORY
          </div>
          <h1 style={{ fontSize: 46, letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.06, margin: 0 }}>
            Datasets
          </h1>
          <p style={{ fontSize: 16, color: '#56524a', marginTop: 14, maxWidth: 540, lineHeight: 1.6 }}>
            Curated, physics-validated datasets for energy ML research — from well logs and SCADA streams to molecular libraries.
          </p>

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

          {/* Domain tabs */}
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
        </div>
      </div>

      {/* Dataset list */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} dataset${filtered.length !== 1 ? 's' : ''}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 96, background: '#f0ebe0', borderRadius: 14 }} />
              ))
            : filtered.map(d => <DatasetRow key={d.id} dataset={d} />)
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8a857a', fontSize: 15 }}>
            No datasets match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
