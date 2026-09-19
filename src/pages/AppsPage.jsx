import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllApps, STATUS_COLORS } from '../api/apps'
import PageHero from '../components/PageHero'
import { CardIllustration } from '../components/CardIllustration'
import { APP_ILLUSTRATIONS, PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'

function AppCard({ app }) {
  const illo = APP_ILLUSTRATIONS[app.id] || '/illustrations/card-app-geosight.png'
  return (
    <Link
      to={`/apps/${app.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 16,
          overflow: 'hidden', cursor: 'pointer',
          transition: 'box-shadow .15s',
          height: '100%',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {illo && (
          <CardIllustration
            src={illo}
            alt={`${app.title} illustration`}
            height={140}
          />
        )}

        <div style={{ padding: '20px 22px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{app.title}</div>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
              borderRadius: 6, fontWeight: 500,
              background: (STATUS_COLORS[app.status] || '#8a857a') + '18',
              color: STATUS_COLORS[app.status] || '#8a857a',
            }}>{app.status}</span>
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', marginTop: 3 }}>
            {app.tagline}
          </div>
          <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 10 }}>{app.desc}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {app.tags.map(t => (
              <span key={t} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
                borderRadius: 5, background: '#f5f0e8', color: '#7a7568',
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, fontSize: 12, color: '#a09990' }}>
            <span style={{ color: ACCENT, fontWeight: 500 }}>Launch →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function AppsPage() {
  const [allApps, setAllApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllApps().then(data => {
      // Filter for geothermal applications
      const geothermalApps = data.filter(a =>
        a.id === 'geosight' ||
        a.title.toLowerCase().includes('geothermal') ||
        a.title.toLowerCase().includes('geosight')
      )
      setAllApps(geothermalApps.length ? geothermalApps : [
        {
          id: 'geosight',
          title: 'GeoSight',
          status: 'Live',
          tagline: 'Geothermal Field Intelligence',
          desc: 'GeoSight is Ereuna\'s geothermal application for 3D reservoir thermal mapping and inverse PINN inference.',
          tags: ['geothermal', 'pinn', 'reservoir'],
        }
      ])
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHero
        eyebrow="GEOTHERMAL APPLICATION"
        title="Apps"
        description="GeoSight is Ereuna's geothermal application for 3D reservoir thermal mapping."
        illustration={PAGE_ILLUSTRATIONS.apps}
        illustrationAlt="Apps illustration"
      >
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <Link to="/docs" style={{
            fontFamily: 'inherit', fontSize: 14, padding: '10px 20px', borderRadius: 10,
            border: '1.4px solid #ddd6c8', background: '#fff', color: '#1b1a17', fontWeight: 500,
            textDecoration: 'none', display: 'inline-block',
          }}>
            View API docs
          </Link>
        </div>
      </PageHero>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 64px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ height: 260, background: '#f0ebe0', borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {allApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  )
}
