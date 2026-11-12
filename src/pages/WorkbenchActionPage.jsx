import React from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { getWorkbenchActionBySlug, WORKBENCH_ACTIONS } from '../data/workbench'

const MONO = "'IBM Plex Mono', monospace"

export default function WorkbenchActionPage() {
  const { action: actionSlug } = useParams()
  const currentAction = getWorkbenchActionBySlug(actionSlug)

  if (!currentAction) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>Action Not Found</h1>
        <p style={{ color: '#545b66', marginTop: 12 }}>The requested workbench action "{actionSlug}" does not exist.</p>
        <Link to="/workbench" style={{ color: '#17202e', textDecoration: 'none', fontWeight: 500, marginTop: 20, display: 'inline-block' }}>
          ← Back to Workbench
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
            to="/workbench"
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
            ← Back to Workbench
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#17202e', fontWeight: 600, letterSpacing: '0.06em' }}>
              WORKBENCH ACTION {currentAction.step} · RIFT PIPELINE
            </span>
            <StatusBadge status={currentAction.status} />
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
            {currentAction.label}
          </h1>

          <p style={{ fontSize: 18, color: '#545b66', margin: '10px 0 0', maxWidth: 680 }}>
            Simulate, train, and validate models against Rift geothermal data.
          </p>

          {/* Action Tabs switcher */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            {WORKBENCH_ACTIONS.map(act => {
              const active = act.slug === currentAction.slug
              return (
                <Link
                  key={act.slug}
                  to={`/workbench/${act.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 9,
                    fontSize: 13,
                    fontFamily: MONO,
                    textDecoration: 'none',
                    background: active ? '#17202e' : '#fff',
                    color: active ? '#f5f2eb' : '#545b66',
                    border: active ? '1px solid #17202e' : '1px solid #ddd8cc',
                    fontWeight: active ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{act.label}</span>
                  <span style={{
                    fontSize: 10,
                    padding: '1px 6px',
                    borderRadius: 4,
                    background: active ? 'rgba(255,255,255,0.2)' : '#ece7de',
                    color: active ? '#fff' : '#545b66',
                  }}>
                    {act.status}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 0' }}>
        {/* Landing Copy Banner */}
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
            Coming soon. The first workflow — simulate a Rift-style reservoir, train a temperature model, and validate it against real Kenyan wells — is in progress.
          </div>
        </div>

        {/* Action Detail Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #ddd8cc',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ padding: '32px 36px', borderBottom: '1px solid #efebe2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', fontWeight: 600 }}>ACTION DETAILS</span>
              <StatusBadge status="Coming soon" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 10px', color: '#17202e' }}>
              {currentAction.subhead}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: '#545b66', margin: 0, maxWidth: 800 }}>
              {currentAction.description}
            </p>
          </div>

          <div style={{ padding: '32px 36px', background: '#ffffff' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 6 }}>
                  INPUT PARAMETERS
                </div>
                <div style={{ fontSize: 14, color: '#17202e', lineHeight: 1.5 }}>
                  {currentAction.inputs}
                </div>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 6 }}>
                  OUTPUT ARTIFACTS
                </div>
                <div style={{ fontSize: 14, color: '#17202e', lineHeight: 1.5 }}>
                  {currentAction.outputs}
                </div>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', marginBottom: 6 }}>
                  ENERGYGRAPH INTEGRATION
                </div>
                <div style={{ fontSize: 14, color: '#17202e', lineHeight: 1.5 }}>
                  {currentAction.energyGraph}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 24,
              padding: '16px 20px',
              background: '#fff',
              border: '1px dashed #c9c4b8',
              borderRadius: 10,
              fontSize: 13,
              color: '#545b66',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontFamily: MONO, color: '#17202e', fontSize: 16 }}>⬡</span>
              <span>
                This workbench module will run locally via the <code>EreunaCLI</code> Python engine or through browser-dispatched jobs once execution environments are enabled.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
