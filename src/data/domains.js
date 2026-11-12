/**
 * Domains organized around the geothermal resource lifecycle,
 * from finding a prospect to managing production.
 *
 * Statuses:
 * - "Drafted" for Reservoir characterization once the workflow lands
 * - "Coming soon" for all other domains with nothing yet
 */

export const DOMAINS = [
  {
    id: 'exploration',
    slug: 'exploration',
    n: '01',
    label: 'Exploration',
    subtitle: 'Surface Geophysics & Magnetotelluric Arrays',
    image: '/illustrations/survey/geothermal-exploration.webp',
    alt: 'Geothermal exploration isometric schematic showing active survey nodes, magnetotelluric sensors, and borehole targets',
    desc: 'Finding and ranking geothermal prospects before drilling confirms them.',
    status: 'Coming soon',
    emptyStateText: 'Coming soon — nothing built yet. Surface geophysics, resistivity inversion, and prospect ranking workflows are coming soon.',
    tags: ['Magnetotelluric Sensor Nodes', 'Active Survey Grids', 'nT Contour Mapping', 'Borehole Target Siting'],
    energyGraphRole: 'SensorGraph Spatial Nodes & Surface Boundary Conditions',
    legendItems: [
      { name: 'Active Survey Node', symbol: '◎' },
      { name: 'Magnetotelluric Sensor Node', symbol: '○' },
      { name: 'Borehole Target', symbol: '▷' },
      { name: 'Contour Line (nT)', symbol: '◎' },
    ],
    technicalSummary: 'Active survey node network, magnetotelluric resistivity sensors, borehole targets, and magnetic anomaly contour lines across faulted Rift terrain.'
  },
  {
    id: 'seismicity',
    slug: 'seismicity',
    n: '02',
    label: 'Seismicity',
    subtitle: 'Microseismic Monitoring & Fault Zones',
    image: '/illustrations/survey/geothermal-seismicity.webp',
    alt: 'Geothermal seismicity monitoring schematic with surface seismometers, hypocenter depth, and acoustic wave propagation',
    desc: 'Detecting and forecasting induced seismicity from injection and hydroshearing.',
    status: 'Coming soon',
    emptyStateText: 'Coming soon — nothing built yet. Microseismic event localization and dynamic stress tensor constraint evaluation are coming soon.',
    tags: ['Surface Seismometer Array', 'Hypocenter Localization', 'Fault & Fracture Kinematics', 'Wave Velocity Profiles'],
    energyGraphRole: 'SensorGraph Time-Series Nodes & Dynamic Stress Constraints',
    legendItems: [
      { name: 'Hypocenter (Event)', symbol: '●' },
      { name: 'Fault / Fracture Zone', symbol: '---' },
      { name: 'Seismic Wave Propagation', symbol: '◎' },
      { name: 'Seismometer Station (Surface)', symbol: '▲' },
    ],
    technicalSummary: 'Surface seismometer array, wave propagation wavefronts through subsurface strata, and hypocenter localization down to -4,000 m depth.'
  },
  {
    id: 'drilling',
    slug: 'drilling',
    n: '03',
    label: 'Drilling',
    subtitle: 'Wellbore Architecture & Casing Integrity',
    image: '/illustrations/survey/geothermal-drilling.webp',
    alt: 'Geothermal drilling rig schematic detailing surface, intermediate, and production casing strings down to the drill bit',
    desc: 'Drilling to confirm and develop a resource, from exploratory to development wells.',
    status: 'Coming soon',
    emptyStateText: 'Coming soon — nothing built yet. Casing integrity validation and drilling thermal boundary condition models are coming soon.',
    tags: ['Surface Conductor Casing', 'Intermediate Sealed Casing', 'Production Casing Liner', 'Drill Bit Mechanics'],
    energyGraphRole: 'PhysicsSpec Wellbore Boundaries & Thermal Transfer Lines',
    legendItems: [
      { name: 'Surface Casing', symbol: 'Conductor Section' },
      { name: 'Intermediate Casing', symbol: 'Sealed Section' },
      { name: 'Production Casing', symbol: 'Liner Section' },
      { name: 'Drill Bit at Depth', symbol: 'Subsurface Penetration' },
    ],
    technicalSummary: 'Multi-stage casing integrity (conductor, sealed intermediate, slotted liner) and mechanical bit penetration through geothermal formation.'
  },
  {
    id: 'petrophysics',
    slug: 'petrophysics',
    n: '04',
    label: 'Petrophysics',
    subtitle: 'Core Analysis & Rock Properties',
    image: '/illustrations/survey/geothermal-petrophysics.webp',
    alt: 'Geothermal petrophysics laboratory showing core plugs, measurement module, and rock property curves vs depth',
    desc: 'Reading rock and fluid properties from well logs.',
    status: 'Coming soon',
    emptyStateText: 'Coming soon — nothing built yet. Core plug porosity/permeability inversion and depth-dependent rock property calibration are coming soon.',
    tags: ['1" Core Plugs (25.4 mm)', 'Porosity & Permeability (mD)', 'Thin-Section Pore Fabric', 'Depth-Indexed Curves'],
    energyGraphRole: 'FieldState Rock Parameters & Heterogeneous Material Properties',
    legendItems: [
      { name: 'Core Plugs', symbol: '1 in / 25.4 mm diam.' },
      { name: 'Pore-Perm Module', symbol: 'Confining Stress Chamber' },
      { name: 'Thin Section Slab', symbol: 'Mineralogy & Pore Fabric' },
      { name: 'Property Curves', symbol: 'Porosity & Permeability vs Depth' },
    ],
    technicalSummary: 'Digital porosity/permeability measurement, thin section mineralogy, and depth-dependent rock property response curves.'
  },
  {
    id: 'reservoir-characterization',
    slug: 'reservoir-characterization',
    n: '05',
    label: 'Reservoir Characterization',
    subtitle: '3D Voxel Models & k(x) Distributions',
    image: '/illustrations/survey/geothermal-reservoir-characterization.webp',
    alt: 'Geothermal reservoir characterization voxel model with thermal conductivity layer and well trajectories',
    desc: 'Describing what a reservoir holds and how it stores and moves heat.',
    status: 'Drafted',
    emptyStateText: "Drafted — a first version exists but isn't validated or complete. Reservoir characterization workflow is drafted and awaiting integration with the Rift simulation pipeline.",
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
    slug: 'reservoir-engineering',
    n: '06',
    label: 'Reservoir Engineering',
    subtitle: 'Finite-Volume Simulation & Mass-Energy Balance',
    image: '/illustrations/survey/geothermal-reservoir-engineering.webp',
    alt: 'Geothermal reservoir simulation schematic with structured orthogonal grid and boundary conditions',
    desc: "Modeling and managing a reservoir's dynamics over its operating life.",
    status: 'Coming soon',
    emptyStateText: "Coming soon — nothing built yet. Finite-volume simulation meshes and dynamic thermal sweep models are coming soon.",
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
    slug: 'production-injection',
    n: '07',
    label: 'Production/Injection Engineering',
    subtitle: 'Coupled Wellheads & Closed Circulation Loops',
    image: '/illustrations/survey/geothermal-production-injection.webp',
    alt: 'Geothermal production and injection wellheads schematic showing closed subsurface circulation loop',
    desc: 'Managing flow through production and injection wells.',
    status: 'Coming soon',
    emptyStateText: 'Coming soon — nothing built yet. Production and reinjection wellhead coupling and pressure sweep balance models are coming soon.',
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

export function getDomainBySlug(slug) {
  return DOMAINS.find(d => d.slug === slug || d.id === slug) || null
}
