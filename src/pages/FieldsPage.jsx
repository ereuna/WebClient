import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { FIELDS } from '../data/fields'

const MONO = "'IBM Plex Mono', monospace"

export default function FieldsPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(180deg, #efebe2 0%, #f5f2eb 100%)',
        borderBottom: '1px solid #ddd8cc',
        padding: '56px 28px 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: '#17202e', marginBottom: 14 }}>
            EAST AFRICAN RIFT SYSTEM · KENYAN FIELDS
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 600, margin: 0 }}>
            Fields
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.55,
            color: '#545b66',
            maxWidth: 680,
            margin: '18px 0 0',
          }}>
            Real geothermal systems — their wells, geology, and the studies built on them.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 0' }}>
        {/* Empty State Banner */}
        <div style={{
          background: '#fff',
          border: '1px solid #ddd8cc',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <StatusBadge status="Coming soon" />
          <div style={{ fontSize: 15, color: '#243042', lineHeight: 1.5, flex: 1, minWidth: 280 }}>
            Coming soon. Field profiles are built from published sources only, not operator data.
          </div>
        </div>

        {/* Fields List Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', letterSpacing: '0.05em' }}>
            KENYAN GEOTHERMAL SYSTEMS ({FIELDS.length})
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#5f6670', fontFamily: MONO }}>STATUS:</span>
            <StatusBadge status="Coming soon" />
          </div>
        </div>

        {/* Fields Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 24,
        }}>
          {FIELDS.map(f => (
            <div
              key={f.id}
              style={{
                background: '#fff',
                border: '1px solid #ddd8cc',
                borderRadius: 16,
                padding: '28px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', fontWeight: 600 }}>
                    {f.setting}
                  </span>
                  <StatusBadge status={f.status} />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 6px', color: '#17202e' }}>
                  {f.name}
                </h2>
                <div style={{ fontSize: 13, color: '#5f6670', marginBottom: 12 }}>
                  {f.region}
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#545b66', margin: '0 0 16px' }}>
                  {f.geology}
                </p>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #efebe2',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 12.5,
                  color: '#545b66',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: '#17202e', fontFamily: MONO, fontSize: 11 }}>Published source basis:</strong> {f.publishedSources}
                </div>
              </div>

              <div style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid #f2ede4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 11.5, fontFamily: MONO, color: '#5f6670' }}>
                  {f.studies.length} study in progress
                </span>
                <Link
                  to={`/fields/${f.slug}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#17202e',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Inspect field <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
