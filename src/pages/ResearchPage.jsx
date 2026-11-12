import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'

const MONO = "'IBM Plex Mono', monospace"

export default function ResearchPage() {
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
            COMPOSITIONS & REPRODUCIBLE STUDIES
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 600, margin: 0 }}>
            Research
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.55,
            color: '#545b66',
            maxWidth: 680,
            margin: '18px 0 0',
          }}>
            Every study here is a composition you can rerun — the field, the simulation, the model, and the validation, all linked.
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
            Coming soon. The first study, on temperature prediction for Kenyan wells, is in progress.
          </div>
        </div>

        {/* Featured Study Section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', color: '#5f6670', marginBottom: 16 }}>
            CURRENT STUDY IN DEVELOPMENT
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #ddd8cc',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            {/* Header */}
            <div style={{
              padding: '28px 32px 24px',
              borderBottom: '1px solid #efebe2',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 20,
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#17202e', fontWeight: 600 }}>STUDY · RIFT-01</span>
                  <StatusBadge status="In progress" />
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 600, margin: 0, color: '#17202e' }}>
                  Temperature Prediction for Kenyan Wells
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#545b66', margin: '8px 0 0', maxWidth: 740 }}>
                  A physics-informed study predicting continuous 3D temperature fields and subsurface thermal conductivity across published Kenyan geothermal well trajectories in the East African Rift System.
                </p>
              </div>
            </div>

            {/* The 4 Linked Composition Elements */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#5f6670', marginBottom: 16, letterSpacing: '0.04em' }}>
                COMPOSITION ARCHITECTURE — LINKED ELEMENTS
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}>
                {/* Element 1: Field */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #efebe2',
                  borderRadius: 12,
                  padding: '20px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#17202e', fontWeight: 600 }}>01 · FIELD</span>
                    <Link to="/fields/olkaria" style={{ fontSize: 12, color: '#17202e', textDecoration: 'none' }}>View field →</Link>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                    Olkaria & Menengai
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: '#545b66', margin: 0 }}>
                    Kenyan volcanic fields in the East African Rift System, anchored strictly to published academic borehole profiles and lithological logs.
                  </p>
                </div>

                {/* Element 2: Simulation */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #efebe2',
                  borderRadius: 12,
                  padding: '20px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#17202e', fontWeight: 600 }}>02 · SIMULATION</span>
                    <Link to="/workbench/simulate" style={{ fontSize: 12, color: '#17202e', textDecoration: 'none' }}>Simulate →</Link>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                    3D Transient Heat Conduction
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: '#545b66', margin: 0 }}>
                    Governing energy conservation equation in heterogeneous porous rock with spatially varying conductivity k(x) and caprock boundary conditions.
                  </p>
                </div>

                {/* Element 3: Model */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #efebe2',
                  borderRadius: 12,
                  padding: '20px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#17202e', fontWeight: 600 }}>03 · MODEL</span>
                    <Link to="/workbench/train" style={{ fontSize: 12, color: '#17202e', textDecoration: 'none' }}>Train →</Link>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                    Type 2 Inverse PINN
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: '#545b66', margin: 0 }}>
                    Neural network architecture simultaneously solving temperature fields and inverting unknown subsurface thermal parameters from sparse observations.
                  </p>
                </div>

                {/* Element 4: Validation */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #efebe2',
                  borderRadius: 12,
                  padding: '20px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#17202e', fontWeight: 600 }}>04 · VALIDATION</span>
                    <Link to="/benchmarks" style={{ fontSize: 12, color: '#17202e', textDecoration: 'none' }}>Benchmark →</Link>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#17202e', marginBottom: 6 }}>
                    Held-Out Well Verification
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: '#545b66', margin: 0 }}>
                    PDE residual constraint checking alongside calibrated uncertainty scoring on withheld Kenyan wells, not leaderboard accuracy alone.
                  </p>
                </div>
              </div>

              {/* Rerun note */}
              <div style={{
                marginTop: 24,
                padding: '16px 20px',
                background: '#ffffff',
                border: '1px dashed #c9c4b8',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                color: '#545b66',
              }}>
                <span style={{ fontFamily: MONO, color: '#17202e', fontSize: 16 }}>⬡</span>
                <span>
                  <strong>Reproducible study composition:</strong> Once active, the study will provide executable scripts and notebooks tying together EnergyGraph input configs, PINN checkpoint weights, and physics validation reports.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
