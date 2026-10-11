import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { WORKBENCH_ACTIONS } from '../data/workbench'

const ACCENT = '#cf5a2a'
const MONO = "'Space Mono', monospace"

export default function WorkbenchPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(180deg, #ede7d8 0%, #f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '56px 28px 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: ACCENT, marginBottom: 14 }}>
            EXECUTION ENVIRONMENT
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 600, margin: 0 }}>
            Workbench
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.55,
            color: '#56524a',
            maxWidth: 680,
            margin: '18px 0 0',
          }}>
            Simulate, train, and validate models against Rift geothermal data.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 0' }}>
        {/* Landing Copy Banner */}
        <div style={{
          background: '#fff',
          border: '1px solid #e7e0d2',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <StatusBadge status="Coming soon" />
          <div style={{ fontSize: 15, color: '#3a382f', lineHeight: 1.5, flex: 1, minWidth: 280 }}>
            Coming soon. The first workflow — simulate a Rift-style reservoir, train a temperature model, and validate it against real Kenyan wells — is in progress.
          </div>
        </div>

        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a857a', letterSpacing: '0.05em' }}>
            WORKFLOW ACTIONS (5)
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#8a857a', fontFamily: MONO }}>ACTION LABELS:</span>
            <StatusBadge status="Coming soon" />
          </div>
        </div>

        {/* Action Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {WORKBENCH_ACTIONS.map(action => (
            <div
              key={action.id}
              style={{
                background: '#fff',
                border: '1px solid #e7e0d2',
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
                  <span style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, fontWeight: 600 }}>
                    ACTION {action.step}
                  </span>
                  <StatusBadge status={action.status} />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 6px', color: '#1b1a17' }}>
                  {action.label}
                </h2>

                <div style={{ fontSize: 13, color: '#8a857a', marginBottom: 12, fontWeight: 500 }}>
                  {action.subhead}
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#56524a', margin: '0 0 16px' }}>
                  {action.description}
                </p>

                <div style={{
                  background: '#faf7f0',
                  border: '1px solid #ede6d8',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#6f6a60',
                  lineHeight: 1.5,
                }}>
                  <div style={{ marginBottom: 4 }}>
                    <strong style={{ color: '#1b1a17', fontFamily: MONO, fontSize: 10.5 }}>Inputs:</strong> {action.inputs}
                  </div>
                  <div>
                    <strong style={{ color: '#1b1a17', fontFamily: MONO, fontSize: 10.5 }}>Outputs:</strong> {action.outputs}
                  </div>
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
                <span style={{ fontSize: 11.5, fontFamily: MONO, color: '#8a857a' }}>
                  {action.slug}
                </span>
                <Link
                  to={`/workbench/${action.slug}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: ACCENT,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Configure action <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
