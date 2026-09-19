import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllModels, FAMILY_COLORS } from '../api/models'
import PageHero from '../components/PageHero'
import { CardIllustration } from '../components/CardIllustration'
import { FAMILY_ILLUSTRATIONS, PAGE_ILLUSTRATIONS, getIllustrationById } from '../lib/illustrations'

const LICENSES = ['All licenses', 'Apache-2.0', 'MIT', 'CC BY 4.0', 'Restricted']

function FamilyDot({ family }) {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: FAMILY_COLORS[family] || '#8a857a', marginRight: 6, verticalAlign: 'middle',
    }} />
  )
}

function ModelCard({ model }) {
  const illo = (model.illustration && getIllustrationById(model.illustration)?.src) || FAMILY_ILLUSTRATIONS[model.family] || '/illustrations/card-pinn-library.png'
  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
          overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .15s', height: '100%',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {illo && <CardIllustration src={illo} alt={`${model.title} illustration`} height={140} />}
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a', marginBottom: 5 }}>
                <FamilyDot family={model.family} />{model.family}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{model.title}</div>
            </div>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #e7e0d2', color: '#8a857a', whiteSpace: 'nowrap',
            }}>{model.license}</span>
          </div>
          <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 9 }}>{model.desc}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {model.tags.map(t => (
              <span key={t} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
                borderRadius: 5, background: '#f5f0e8', color: '#7a7568',
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, fontSize: 12, color: '#a09990' }}>
            <span>Updated {model.updated}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ModelsPage() {
  const [allModels, setAllModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [license, setLicense] = useState('All licenses')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchAllModels().then(data => { setAllModels(data); setLoading(false) })
  }, [])

  const filtered = allModels.filter(m => {
    const matchLicense = license === 'All licenses' || m.license === license
    const matchQuery = !query ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.tags.some(t => t.includes(query.toLowerCase()))
    return matchLicense && matchQuery
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHero
        eyebrow="GEOTHERMAL MODELS"
        title="Models"
        description="Physics-informed machine learning models for geothermal energy — all passing the physics constraint checker."
        illustration={PAGE_ILLUSTRATIONS.models}
        illustrationAlt="Geothermal models illustration"
      >
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search models…"
              style={{
                fontFamily: 'inherit', fontSize: 14, padding: '9px 14px', borderRadius: 9,
                border: '1.4px solid #ddd6c8', background: '#fff', outline: 'none', width: 220,
              }}
            />
            <select
              value={license}
              onChange={e => setLicense(e.target.value)}
              style={{
                fontFamily: 'inherit', fontSize: 13, padding: '9px 12px', borderRadius: 9,
                border: '1.4px solid #ddd6c8', background: '#fff', outline: 'none', cursor: 'pointer',
              }}
            >
              {LICENSES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
      </PageHero>

      {/* Model grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} model${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 200, background: '#f0ebe0', borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {filtered.map(m => <ModelCard key={m.id} model={m} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8a857a', fontSize: 15 }}>
            No models match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
