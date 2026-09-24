import { useState } from 'react'
import Modal from './Modal'

const ACCENT = '#cf5a2a'
const MONO = "'Space Mono',monospace"

const GEOTHERMAL_DOMAINS = [
  {
    id: 'exploration',
    n: '01',
    label: 'Exploration',
    subtitle: 'Surface Geophysics & Magnetotelluric Arrays',
    image: '/illustrations/geothermal-exploration.png',
    alt: 'Geothermal exploration isometric schematic showing active survey nodes, magnetotelluric sensors, and borehole targets',
    desc: 'Finding and ranking geothermal prospects before drilling confirms them.',
    tags: ['Magnetotelluric Sensor Nodes', 'Active Survey Grids', 'nT Contour Mapping', 'Borehole Target Siting'],
    energyGraphRole: 'SensorGraph Spatial Nodes & Surface Boundary Conditions',
    legendItems: [
      { name: 'Active Survey Node', symbol: '◎' },
      { name: 'Magnetotelluric Sensor Node', symbol: '○' },
      { name: 'Borehole Target', symbol: '▷' },
      { name: 'Contour Line (nT)', symbol: '◎' },
    ],
    technicalSummary: 'Isometric schematic featuring an active survey node network, magnetotelluric resistivity sensors, borehole targets, and magnetic anomaly contour lines across faulted terrain.'
  },
  {
    id: 'seismicity',
    n: '02',
    label: 'Seismicity',
    subtitle: 'Microseismic Monitoring & Fault Zones',
    image: '/illustrations/geothermal-seismicity.png',
    alt: 'Geothermal seismicity monitoring schematic with surface seismometers, hypocenter depth, and acoustic wave propagation',
    desc: 'Detecting and forecasting induced seismicity from injection and hydroshearing.',
    tags: ['Surface Seismometer Array', 'Hypocenter Localization', 'Fault & Fracture Kinematics', 'Wave Velocity Profiles'],
    energyGraphRole: 'SensorGraph Time-Series Nodes & Dynamic Stress Constraints',
    legendItems: [
      { name: 'Hypocenter (Event)', symbol: '●' },
      { name: 'Fault / Fracture Zone', symbol: '---' },
      { name: 'Seismic Wave Propagation', symbol: '◎' },
      { name: 'Seismometer Station (Surface)', symbol: '▲' },
    ],
    technicalSummary: 'Axon S1 schematic showing a surface seismometer array, wave propagation wavefronts through subsurface strata, and hypocenter localization down to -4,000 m depth.'
  },
  {
    id: 'drilling',
    n: '03',
    label: 'Drilling',
    subtitle: 'Wellbore Architecture & Casing Integrity',
    image: '/illustrations/geothermal-drilling.png',
    alt: 'Geothermal drilling rig schematic detailing surface, intermediate, and production casing strings down to the drill bit',
    desc: 'Drilling to confirm and develop a resource, from exploratory to development wells.',
    tags: ['Surface Conductor Casing', 'Intermediate Sealed Casing', 'Production Casing Liner', 'Drill Bit Mechanics'],
    energyGraphRole: 'PhysicsSpec Wellbore Boundaries & Thermal Transfer Lines',
    legendItems: [
      { name: 'Surface Casing', symbol: 'Conductor Section' },
      { name: 'Intermediate Casing', symbol: 'Sealed Section' },
      { name: 'Production Casing', symbol: 'Liner Section' },
      { name: 'Drill Bit at Depth', symbol: 'Subsurface Penetration' },
    ],
    technicalSummary: 'Drilling substructure and rig schematic displaying multi-stage casing integrity (conductor, sealed intermediate, slotted liner) and mechanical bit penetration through geothermal formation.'
  },
  {
    id: 'petrophysics',
    n: '04',
    label: 'Petrophysics',
    subtitle: 'Core Analysis & Rock Properties',
    image: '/illustrations/geothermal-petrophysics.png',
    alt: 'Geothermal petrophysics laboratory showing core plugs, measurement module, and rock property curves vs depth',
    desc: 'Reading rock and fluid properties from well logs.',
    tags: ['1" Core Plugs (25.4 mm)', 'Porosity & Permeability (mD)', 'Thin-Section Pore Fabric', 'Depth-Indexed Curves'],
    energyGraphRole: 'FieldState Rock Parameters & Heterogeneous Material Properties',
    legendItems: [
      { name: 'Core Plugs', symbol: '1 in / 25.4 mm diam.' },
      { name: 'Pore-Perm Module', symbol: 'Confining Stress Chamber' },
      { name: 'Thin Section Slab', symbol: 'Mineralogy & Pore Fabric' },
      { name: 'Property Curves', symbol: 'Porosity & Permeability vs Depth' },
    ],
    technicalSummary: 'Experimental bench layout showing core plug specimens, digital porosity/permeability measurement module, thin section mineralogy slab, and depth-dependent rock property response.'
  },
  {
    id: 'reservoir-characterization',
    n: '05',
    label: 'Reservoir Characterization',
    subtitle: '3D Voxel Models & k(x) Distributions',
    image: '/illustrations/geothermal-reservoir-characterization.png',
    alt: 'Geothermal reservoir characterization voxel model with thermal conductivity layer and well trajectories',
    desc: 'Describing what a reservoir holds and how it stores and moves heat.',
    tags: ['3D Geocellular Voxel Grid', 'k(x) Thermal Conductivity', 'Stratigraphic Horizons', 'Well Trajectory Intersections'],
    energyGraphRole: 'FieldState Discretized Domain & Inverse PINN Spatial Parameters',
    legendItems: [
      { name: 'k(x) Layer', symbol: 'Thermal Conductivity Band' },
      { name: 'Property Band', symbol: 'Porosity / Permeability / Temp' },
      { name: 'Stratigraphic Framework', symbol: 'Layered Horizons' },
      { name: 'Voxel Model', symbol: '3D Geocellular Grid' },
    ],
    technicalSummary: 'Layered 3D geocellular voxel grid illustrating stratigraphic horizons, spatial property bands including inferred k(x) distribution, and intersected well completions.'
  },
  {
    id: 'reservoir-engineering',
    n: '06',
    label: 'Reservoir Engineering',
    subtitle: 'Finite-Volume Simulation & Mass-Energy Balance',
    image: '/illustrations/geothermal-reservoir-engineering.png',
    alt: 'Geothermal reservoir simulation schematic with structured orthogonal grid and boundary conditions',
    desc: "Modeling and managing a reservoir's dynamics over its operating life.",
    tags: ['Finite-Volume Discretization', 'Mass-Energy Conservation', 'Caprock / Basement No-Flow', 'Active Injection Thermal Sweep'],
    energyGraphRole: 'PhysicsSpec Governing PDEs & Residual Constraint Evaluation',
    legendItems: [
      { name: 'Simulation Mesh', symbol: 'Structured Orthogonal Grid' },
      { name: 'Caprock / Basement', symbol: 'No-Flow: ∂P/∂n = 0' },
      { name: 'Active Injection Zone', symbol: 'Cold Sweep Plume' },
      { name: 'Balance Equations', symbol: 'Mass & Energy Integral Laws' },
    ],
    technicalSummary: 'Finite-volume cell discretization with orthogonal grid geometry, active injection plume thermal dynamics, caprock and basement no-flow conditions, and mass-energy balance equations.'
  },
  {
    id: 'production-injection',
    n: '07',
    label: 'Production/Injection Engineering',
    subtitle: 'Coupled Wellheads & Closed Circulation Loops',
    image: '/illustrations/geothermal-production-injection.png',
    alt: 'Geothermal production and injection wellheads schematic showing closed subsurface circulation loop',
    desc: 'Managing flow through production and injection wells.',
    tags: ['Steam Production Wellhead', 'Reinjection Fluid Wellhead', 'Fractured Heat Sweep', 'Closed Circulation Loop'],
    energyGraphRole: 'SensorGraph Source/Sink Nodes & Multi-Well Conservation',
    legendItems: [
      { name: 'Production Wellhead', symbol: 'Steam to Surface' },
      { name: 'Injection Wellhead', symbol: 'Fluid from Surface' },
      { name: 'Geothermal Reservoir', symbol: 'Heat Source & Circulation' },
      { name: 'Circulation Loop', symbol: 'Pressure Maintenance Sweep' },
    ],
    technicalSummary: 'Coupled surface pad and subsurface circulation architecture showing steam extraction, surface manifold, reinjection wellbore, and fluid sweep through fractured reservoir rock.'
  },
]

export default function GeothermalResearchAreas() {
  const [modalItem, setModalItem] = useState(null)

  return (
    <section id="domains" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', color: ACCENT }}>
          GEOTHERMAL RESEARCH AREAS
        </div>
        <h2 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 600, margin: '14px 0 0', maxWidth: 640 }}>
          From Exploration to Production
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#56524a', maxWidth: 620, margin: '12px 0 0' }}>
          Seven core research areas spanning the geothermal energy lifecycle, addressing subsurface exploration, borehole construction, reservoir physics, and operational field engineering.
        </p>
      </div>

      {/* Grid: all 7 research areas */}
      <div className="domain-cards-grid">
          {GEOTHERMAL_DOMAINS.map((item, idx) => {
            const isFullSpan = idx === 6 // Production/Injection Engineering spans across bottom
            return (
              <div
                key={item.id}
                onClick={() => setModalItem(item)}
                style={{
                  background: '#fff',
                  border: '1px solid #e7e0d2',
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform .15s ease, box-shadow .15s ease',
                  gridColumn: isFullSpan ? '1 / -1' : 'auto',
                  display: isFullSpan ? 'grid' : 'flex',
                  gridTemplateColumns: isFullSpan ? '1.1fr 1fr' : 'none',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Card Image */}
                <div style={{
                  background: '#faf7f0',
                  borderBottom: isFullSpan ? 'none' : '1px solid #ece5d6',
                  borderRight: isFullSpan ? '1px solid #ece5d6' : 'none',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: isFullSpan ? 260 : 180,
                  padding: 12,
                }}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: isFullSpan ? 280 : 190,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(4px)',
                    border: '1px solid #e7e0d2', borderRadius: 6,
                    padding: '3px 8px', fontFamily: MONO, fontSize: 10.5, color: ACCENT, fontWeight: 600,
                  }}>
                    {item.n}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8a857a', letterSpacing: '0.04em' }}>
                        DOMAIN {item.n}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: MONO, color: ACCENT }}>
                        Inspect ↗
                      </span>
                    </div>

                    <h3 style={{ fontSize: isFullSpan ? 22 : 18, fontWeight: 600, margin: '8px 0 4px', color: '#1b1a17' }}>
                      {item.label}
                    </h3>

                    <div style={{ fontSize: 12.5, color: '#6f6a60', marginBottom: 8, fontWeight: 500 }}>
                      {item.subtitle}
                    </div>

                    <p style={{ fontSize: 13, lineHeight: 1.55, color: '#56524a', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {item.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 10.5, fontFamily: MONO, background: '#f8f5ee',
                          border: '1px solid #e7e0d2', padding: '3px 7px',
                          borderRadius: 5, color: '#6f6a60',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Lightbox / Full-Res Schematic Modal */}
      {modalItem && (
        <Modal
          open={!!modalItem}
          onClose={() => setModalItem(null)}
          title={`${modalItem.n} · ${modalItem.label}`}
          maxWidth={980}
        >
          <div>
            <div style={{
              background: '#faf7f0', borderRadius: 12, border: '1px solid #e7e0d2',
              overflow: 'hidden', padding: '12px', display: 'flex', justifyContent: 'center',
            }}>
              <img
                src={modalItem.image}
                alt={modalItem.alt}
                style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.06em' }}>
                {modalItem.subtitle.toUpperCase()}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, margin: '6px 0 10px' }}>
                {modalItem.label}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#56524a', margin: 0 }}>
                {modalItem.desc}
              </p>

              <div style={{ marginTop: 18, background: '#f8f5ee', border: '1px solid #ece5d6', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a857a', marginBottom: 8 }}>
                  KEY SCHEMATIC OBSERVABLES & ANNOTATIONS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  {modalItem.legendItems.map((leg, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#3a382f', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: MONO, color: ACCENT, fontSize: 11, fontWeight: 600 }}>•</span>
                      <span><strong>{leg.name}:</strong> {leg.symbol}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 11, color: '#8a857a' }}>
                Integrated EnergyGraph Component: <strong style={{ color: '#1b1a17' }}>{modalItem.energyGraphRole}</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
