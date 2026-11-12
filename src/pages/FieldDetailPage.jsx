import React from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { getFieldBySlug, FIELDS } from '../data/fields'

const MONO = "'IBM Plex Mono', monospace"

export default function FieldDetailPage() {
  const { fieldName } = useParams()
  const field = getFieldBySlug(fieldName)

  if (!field) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>Field Not Found</h1>
        <p style={{ color: '#545b66', marginTop: 12 }}>The requested field "{fieldName}" does not exist in the database.</p>
        <Link to="/fields" style={{ color: '#17202e', textDecoration: 'none', fontWeight: 500, marginTop: 20, display: 'inline-block' }}>
          ← Back to Fields
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header / Breadcrumb */}
      <section style={{
        background: 'linear-gradient(180deg, #efebe2 0%, #f5f2eb 100%)',
        borderBottom: '1px solid #ddd8cc',
        padding: '40px 28px 44px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link
            to="/fields"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontFamily: MONO,
              color: '#17202e',
              textDecoration: 'none',
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            ← Back to Fields
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#17202e', fontWeight: 600, letterSpacing: '0.06em' }}>
              EAST AFRICAN RIFT SYSTEM · {field.setting}
            </span>
            <StatusBadge status="Coming soon" />
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            {field.name}
          </h1>

          <p style={{ fontSize: 18, color: '#545b66', margin: '10px 0 0', maxWidth: 680 }}>
            Real geothermal systems — their wells, geology, and the studies built on them.
          </p>
        </div>
      </section>

      {/* Main Content */}
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

        {/* Content Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Column 1: Geological Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: '#fff',
              border: '1px solid #ddd8cc',
              borderRadius: 18,
              padding: '28px 30px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', letterSpacing: '0.06em', marginBottom: 12 }}>
                GEOLOGY & RESERVOIR FRAMEWORK
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: '#243042', margin: 0 }}>
                {field.geology}
              </p>

              <div style={{
                marginTop: 20,
                padding: '16px 18px',
                background: '#ffffff',
                border: '1px solid #efebe2',
                borderRadius: 12,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 6 }}>
                  PUBLISHED SOURCE CITATION BASIS
                </div>
                <div style={{ fontSize: 13.5, color: '#545b66', lineHeight: 1.5 }}>
                  {field.publishedSources}
                </div>
              </div>
            </div>

            <div style={{
              background: '#fff',
              border: '1px solid #ddd8cc',
              borderRadius: 18,
              padding: '28px 30px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', letterSpacing: '0.04em', marginBottom: 10 }}>
                WELLBORE LOGS & TRAJECTORIES
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#17202e' }}>Published Borehole Profiles</span>
                <StatusBadge status="Coming soon" />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#545b66', margin: 0 }}>
                {field.wellsNote} Subsurface depth profiles and temperature-pressure logs are being extracted and validated for open benchmark splits.
              </p>
            </div>
          </div>

          {/* Column 2: Linked Studies & Regional Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Linked Studies */}
            <div style={{
              background: '#fff',
              border: '1px solid #ddd8cc',
              borderRadius: 18,
              padding: '28px 30px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', letterSpacing: '0.06em', marginBottom: 14 }}>
                STUDIES BUILT ON THIS FIELD
              </div>
              {field.studies.map((st, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #efebe2',
                    borderRadius: 12,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: '#17202e' }}>{st}</span>
                    <StatusBadge status="In progress" />
                  </div>
                  <p style={{ fontSize: 13, color: '#545b66', margin: 0, lineHeight: 1.5 }}>
                    Coupling published well observations with 3D transient heat conduction models in the Rift.
                  </p>
                  <Link to="/research" style={{ fontSize: 12.5, color: '#17202e', textDecoration: 'none', fontWeight: 500, marginTop: 4 }}>
                    View study in Research →
                  </Link>
                </div>
              ))}
            </div>

            {/* Quick Switch */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #efebe2',
              borderRadius: 14,
              padding: '20px 22px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 12 }}>
                OTHER RIFT GEOTHERMAL FIELDS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FIELDS.filter(f => f.slug !== field.slug).map(f => (
                  <Link
                    key={f.slug}
                    to={`/fields/${f.slug}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#fff',
                      border: '1px solid #ddd8cc',
                      borderRadius: 8,
                      padding: '10px 14px',
                      textDecoration: 'none',
                      color: '#17202e',
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{f.name}</span>
                    <span style={{ fontSize: 11, fontFamily: MONO, color: '#5f6670' }}>{f.region}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
