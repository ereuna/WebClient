export const FAMILY_ILLUSTRATIONS = {
  'PINN': '/illustrations/card-pinn-library.png',
  'GNN / NNP': '/illustrations/card-materials-gnn.png',
  'Grid RL': '/illustrations/card-grid-dispatch-rl.png',
  'Forecasting': '/illustrations/card-forecasting.png',
  'Generative': '/illustrations/card-generative.png',
}

export const APP_ILLUSTRATIONS = {
  geosight: '/illustrations/card-app-geosight.png',
  gridlens: '/illustrations/card-app-gridlens.png',
  windscout: '/illustrations/card-app-windscout.png',
  matexplorer: '/illustrations/card-app-matexplorer.png',
  solaratlas: '/illustrations/card-app-solaratlas.png',
  nucleval: '/illustrations/card-app-nucleval.png',
}

export const DOMAIN_ILLUSTRATIONS = {
  Geothermal: '/illustrations/card-domain-geothermal.png',
  Nuclear: '/illustrations/card-domain-nuclear.png',
  Wind: '/illustrations/card-domain-wind.png',
  Solar: '/illustrations/card-domain-solar.png',
  Hydro: '/illustrations/card-domain-hydro.png',
  Grid: '/illustrations/card-domain-grid.png',
}

export const ACTION_ILLUSTRATIONS = {
  newModel: '/illustrations/action-new-model.png',
  newDataset: '/illustrations/action-new-dataset.png',
  launchTraining: '/illustrations/action-launch-training.png',
  deployModel: '/illustrations/action-deploy-model.png',
}

export const METRIC_ILLUSTRATIONS = {
  Models: '/illustrations/metric-models.png',
  Datasets: '/illustrations/metric-datasets.png',
  Pipelines: '/illustrations/metric-pipelines.png',
  Spaces: '/illustrations/metric-spaces.png',
}

export const TOKAMAK_ILLUSTRATIONS = {
  reactorCore: '/illustrations/tokamak-reactor-core.png',
  magneticConfinement: '/illustrations/tokamak-magnetic-confinement.png',
  plasmaMonitor: '/illustrations/tokamak-plasma-monitor.png',
}

export const PAGE_ILLUSTRATIONS = {
  models: '/illustrations/page-models-hero.png',
  datasets: '/illustrations/page-datasets-hero.png',
  benchmarks: '/illustrations/page-benchmarks-hero.png',
  apps: '/illustrations/page-apps-hero.png',
  docs: '/illustrations/page-docs-hero.png',
  pipelines: '/illustrations/page-pipelines-hero.png',
  deployments: '/illustrations/page-deployments-hero.png',
  experiments: '/illustrations/page-experiments-hero.png',
  inference: '/illustrations/page-inference-hero.png',
  repositories: '/illustrations/page-repositories-hero.png',
  dashboard: '/illustrations/page-dashboard-hero.png',
}

// ── Selectable card illustrations (creation form + detail-page picker) ─────────
// Built from the existing card-* and tokamak-* assets — the ones drawn at card
// aspect ratio. page-*/action-*/metric-* assets are UI chrome, not repo art.

export const CARD_ILLUSTRATION_OPTIONS = [
  { id: 'card-pinn-library',         src: '/illustrations/card-pinn-library.png',         label: 'PINN Library' },
  { id: 'card-materials-gnn',        src: '/illustrations/card-materials-gnn.png',        label: 'Materials GNN' },
  { id: 'card-grid-dispatch-rl',     src: '/illustrations/card-grid-dispatch-rl.png',     label: 'Grid Dispatch RL' },
  { id: 'card-forecasting',          src: '/illustrations/card-forecasting.png',          label: 'Forecasting' },
  { id: 'card-generative',           src: '/illustrations/card-generative.png',           label: 'Generative' },
  { id: 'card-domain-geothermal',    src: '/illustrations/card-domain-geothermal.png',    label: 'Geothermal' },
  { id: 'card-domain-nuclear',       src: '/illustrations/card-domain-nuclear.png',       label: 'Nuclear' },
  { id: 'card-domain-wind',          src: '/illustrations/card-domain-wind.png',          label: 'Wind' },
  { id: 'card-domain-solar',         src: '/illustrations/card-domain-solar.png',         label: 'Solar' },
  { id: 'card-domain-hydro',         src: '/illustrations/card-domain-hydro.png',         label: 'Hydro' },
  { id: 'card-domain-grid',          src: '/illustrations/card-domain-grid.png',          label: 'Grid' },
  { id: 'tokamak-reactor-core',         src: '/illustrations/tokamak-reactor-core.png',         label: 'Reactor Core' },
  { id: 'tokamak-magnetic-confinement', src: '/illustrations/tokamak-magnetic-confinement.png', label: 'Magnetic Confinement' },
  { id: 'tokamak-plasma-monitor',       src: '/illustrations/tokamak-plasma-monitor.png',       label: 'Plasma Monitor' },
]

export function getIllustrationById(id) {
  return CARD_ILLUSTRATION_OPTIONS.find(o => o.id === id) || null
}

// Illustration *id* (not a path) per family — used to pre-select a default in the picker, distinct from the path-keyed FAMILY_ILLUSTRATIONS above.
export const FAMILY_DEFAULT_ILLUSTRATION_ID = {
  'PINN':        'card-pinn-library',
  'GNN / NNP':   'card-materials-gnn',
  'Grid RL':     'card-grid-dispatch-rl',
  'Forecasting': 'card-forecasting',
  'Generative':  'card-generative',
}

// Illustration *id* (not a path) per domain — used to pre-select a default in the picker, distinct from the path-keyed DOMAIN_ILLUSTRATIONS above.
export const DOMAIN_DEFAULT_ILLUSTRATION_ID = {
  Geothermal: 'card-domain-geothermal',
  Nuclear:    'card-domain-nuclear',
  Wind:       'card-domain-wind',
  Solar:      'card-domain-solar',
  Hydro:      'card-domain-hydro',
  Grid:       'card-domain-grid',
}
