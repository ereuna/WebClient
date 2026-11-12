import React from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { getDomainBySlug, DOMAINS } from '../data/domains'

const MONO = "'IBM Plex Mono', monospace"

export default function DomainDetailPage() {
  const { domainName } = useParams()
  const domain = getDomainBySlug(domainName)

  if (!domain) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>Domain Not Found</h1>
        <p style={{ color: '#545b66', marginTop: 12 }}>The requested domain "{domainName}" does not exist.</p>
        <Link to="/domains" style={{ color: '#17202e', textDecoration: 'none', fontWeight: 500, marginTop: 20, display: 'inline-block' }}>
          ← Back to Domains
        </Link>
      </div>
    )
  }

  const isReservoirCharacterization = domain.slug === 'reservoir-characterization'

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
            to="/domains"
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
            ← Back to Domains
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#17202e', fontWeight: 600, letterSpacing: '0.06em' }}>
              DOMAIN {domain.n} · LIFECYCLE
            </span>
            <StatusBadge status={domain.status} />
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            {domain.label}
          </h1>

          <p style={{ fontSize: 18, color: '#545b66', margin: '8px 0 0', fontWeight: 500 }}>
            {domain.subtitle}
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#545b66', maxWidth: 680, margin: '14px 0 0' }}>
            {domain.desc}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 0' }}>
        {/* Per-Domain Empty State / Readiness Banner */}
        <div style={{
          background: '#fff',
          border: '1px solid #ddd8cc',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap',
        }}>
          <StatusBadge status={domain.status} />
          <div style={{ fontSize: 15, color: '#243042', lineHeight: 1.5, flex: 1, minWidth: 280 }}>
            {isReservoirCharacterization ? (
              <span>
                <strong>Drafted</strong> — a first version exists but isn't validated or complete. Reservoir characterization workflow is drafted and awaiting integration with the Rift simulation pipeline.
              </span>
            ) : (
              <span>
                <strong>Coming soon</strong> — nothing built yet. Active domain modeling for this stage of the geothermal lifecycle is slated for subsequent releases.
              </span>
            )}
          </div>
        </div>

        {/* Technical Schematic Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Schematic Graphic */}
          <div style={{
            background: '#fff',
            border: '1px solid #ddd8cc',
            borderRadius: 18,
            overflow: 'hidden',
          }}>
            <div style={{
              background: '#ffffff',
              padding: 24,
              borderBottom: '1px solid #ede5d6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 280,
            }}>
              <img
                src={domain.image}
                alt={domain.alt}
                style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 6 }}>
                TECHNICAL SCHEMATIC SUMMARY
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#545b66', margin: 0 }}>
                {domain.technicalSummary}
              </p>
            </div>
          </div>

          {/* Observables & EnergyGraph Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Observables */}
            <div style={{
              background: '#fff',
              border: '1px solid #ddd8cc',
              borderRadius: 18,
              padding: '24px 26px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', letterSpacing: '0.06em', marginBottom: 12 }}>
                KEY SCHEMATIC OBSERVABLES & ANNOTATIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {domain.legendItems.map((leg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: 8, border: '1px solid #efebe2' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: '#17202e' }}>{leg.name}</span>
                    <span style={{ fontSize: 12, fontFamily: MONO, color: '#545b66' }}>{leg.symbol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EnergyGraph Role */}
            <div style={{
              background: '#fff',
              border: '1px solid #ddd8cc',
              borderRadius: 18,
              padding: '24px 26px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', letterSpacing: '0.04em', marginBottom: 8 }}>
                ENERGYGRAPH SCHEMA INTEGRATION
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#17202e', marginBottom: 8 }}>
                {domain.energyGraphRole}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#545b66', margin: 0 }}>
                Maps directly to EnergyGraph's PhysicsSpec (governing equations), SensorGraph (spatial sensor nodes and well tracks), or FieldState (voxel parameters and thermal conductivity distributions).
              </p>
            </div>

            {/* Other Domains Quick Switch */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #efebe2',
              borderRadius: 14,
              padding: '18px 20px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 10 }}>
                OTHER LIFECYCLE DOMAINS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DOMAINS.filter(d => d.slug !== domain.slug).map(d => (
                  <Link
                    key={d.slug}
                    to={`/domains/${d.slug}`}
                    style={{
                      fontSize: 12,
                      fontFamily: MONO,
                      background: '#fff',
                      border: '1px solid #ddd8cc',
                      borderRadius: 6,
                      padding: '4px 10px',
                      color: '#17202e',
                      textDecoration: 'none',
                    }}
                  >
                    {d.n} · {d.label}
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
