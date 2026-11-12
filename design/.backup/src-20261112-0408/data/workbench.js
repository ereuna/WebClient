/**
 * Workbench actions for Rift geothermal modeling.
 * Actions: Simulate, Train, Validate, Monitor, Workflows.
 * All statuses: "Coming soon" per status vocabulary.
 */

export const WORKBENCH_ACTIONS = [
  {
    id: 'simulate',
    slug: 'simulate',
    label: 'Simulate',
    step: '01',
    status: 'Coming soon',
    subhead: 'Generate 3D synthetic reservoir states with finite-volume PDE solvers.',
    description: 'Discretize the subsurface domain and solve 3D transient heat conduction equations across heterogeneous Rift strata, generating synthetic reservoir snapshots under caprock and basement no-flow boundary conditions.',
    inputs: 'FieldState mesh, thermal conductivity bounds, initial temperature fields',
    outputs: 'Synthetic borehole temperature profiles, spatiotemporal thermal fields',
    energyGraph: 'PhysicsSpec governing equations & FieldState voxel arrays',
  },
  {
    id: 'train',
    slug: 'train',
    label: 'Train',
    step: '02',
    status: 'Coming soon',
    subhead: 'Fit physics-informed neural networks to invert subsurface parameters.',
    description: 'Execute Type 2 inverse PINN training loops to recover spatially varying thermal conductivity k(x) and predict continuous 3D temperature fields from sparse well observations in the Kenya Rift Valley.',
    inputs: 'Observed borehole coordinates, boundary temperatures, PDE residual loss weights',
    outputs: 'Trained PINN checkpoint weights, inferred continuous k(x) field',
    energyGraph: 'SensorGraph observation points & PhysicsSpec loss functions',
  },
  {
    id: 'validate',
    slug: 'validate',
    label: 'Validate',
    step: '03',
    status: 'Coming soon',
    subhead: 'Evaluate PDE residual bounds and physical conservation laws.',
    description: 'Submit model inferences to the physics constraint checker to verify energy balance, heat flux continuity, and boundary condition satisfaction before outputs are accepted.',
    inputs: 'Candidate model predictions, PhysicsSpec residual tolerance thresholds',
    outputs: 'Physics compliance certification, residual violation heatmaps',
    energyGraph: 'Physics constraint checker verification report',
  },
  {
    id: 'monitor',
    slug: 'monitor',
    label: 'Monitor',
    step: '04',
    status: 'Coming soon',
    subhead: 'Inspect training dynamics, residual convergence, and loss terms.',
    description: 'Observe multi-objective optimization metrics in real time: PDE residual loss, well observation data loss, and spatial gradient norms across Rift geological formations.',
    inputs: 'Live telemetry stream from active PINN training runs',
    outputs: 'Convergence traces, residual violation histograms, parameter loss curves',
    energyGraph: 'SensorGraph telemetry & runtime logs',
  },
  {
    id: 'workflows',
    slug: 'workflows',
    label: 'Workflows',
    step: '05',
    status: 'Coming soon',
    subhead: 'End-to-end composite chains connecting reservoir data to predictions.',
    description: 'Compose and execute complete reproducible chains linking synthetic reservoir simulation, inverse model training, and rigorous validation against real Kenyan geothermal wells.',
    inputs: 'Complete study composition pipeline configuration',
    outputs: 'End-to-end reproducible study artifact and validation summary',
    energyGraph: 'Unified EnergyGraph study manifest (PhysicsSpec + SensorGraph + FieldState)',
  },
]

export function getWorkbenchActionBySlug(slug) {
  return WORKBENCH_ACTIONS.find(a => a.slug === slug || a.id === slug) || null
}
