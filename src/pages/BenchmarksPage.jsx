import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'

const MONO = "'IBM Plex Mono', monospace"

export default function BenchmarksPage() {
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
            EVALUATION & VALIDATION
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 600, margin: 0 }}>
            Benchmarks
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.55,
            color: '#545b66',
            maxWidth: 680,
            margin: '18px 0 0',
          }}>
            Open tasks with well-held-out splits and uncertainty scoring — not leaderboard accuracy alone.
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
            Coming soon. The first benchmark, on temperature at depth, is in progress.
          </div>
        </div>

        {/* Benchmark Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', letterSpacing: '0.05em' }}>
            BENCHMARKS IN PREPARATION
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#5f6670', fontFamily: MONO }}>STATUS:</span>
            <StatusBadge status="In progress" />
          </div>
        </div>

        {/* Featured Benchmark Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #ddd8cc',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            padding: '30px 34px',
            borderBottom: '1px solid #efebe2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', fontWeight: 600 }}>TASK · BENCHMARK-01</span>
                <StatusBadge status="In progress" />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 600, margin: 0, color: '#17202e' }}>
                Temperature at Depth
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#545b66', margin: '8px 0 0', maxWidth: 740 }}>
                Predicting continuous subsurface temperature profiles along deep geothermal wells in the Kenya Rift Valley under spatial held-out conditions.
              </p>
            </div>
          </div>

          <div style={{ padding: '30px 34px', background: '#ffffff' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {/* Protocol 1 */}
              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', marginBottom: 6 }}>
                  01 · WELL-HELD-OUT SPLITS
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                  Spatial Generalization
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#545b66', margin: 0 }}>
                  Models are conditioned on data from a subset of wells in a field and evaluated exclusively on completely withheld well trajectories. Random row splitting is explicitly rejected.
                </p>
              </div>

              {/* Protocol 2 */}
              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', marginBottom: 6 }}>
                  02 · UNCERTAINTY SCORING
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                  Calibrated Intervals
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#545b66', margin: 0 }}>
                  Evaluates proper predictive uncertainty distributions (Continuous Ranked Probability Score and empirical coverage calibration), rather than single-point error metrics alone.
                </p>
              </div>

              {/* Protocol 3 */}
              <div style={{
                background: '#fff',
                border: '1px solid #efebe2',
                borderRadius: 12,
                padding: '20px 22px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', marginBottom: 6 }}>
                  03 · RESIDUAL BOUNDS
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                  Physics Compliance
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#545b66', margin: 0 }}>
                  Inferred fields must satisfy governing heat conduction PDE residual tolerance limits and energy balance conservation across the continuous domain.
                </p>
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
                Benchmark datasets will be published as versioned EnergyGraph archives with reproducible evaluation scripts for the physics constraint checker.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
