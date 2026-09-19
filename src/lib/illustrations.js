export const FAMILY_ILLUSTRATIONS = {
  'PINN': '/illustrations/card-pinn-library.png',
}

export const APP_ILLUSTRATIONS = {
  geosight: '/illustrations/card-app-geosight.png',
}

export const DOMAIN_ILLUSTRATIONS = {
  Geothermal: '/illustrations/card-domain-geothermal.png',
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

export const CARD_ILLUSTRATION_OPTIONS = [
  { id: 'card-pinn-library',      src: '/illustrations/card-pinn-library.png',      label: 'PINN Library' },
  { id: 'card-domain-geothermal', src: '/illustrations/card-domain-geothermal.png', label: 'Geothermal' },
  { id: 'geothermal-reservoir',   src: '/illustrations/05-geothermal-reservoir-slab.png', label: 'Geothermal Reservoir' },
]

export function getIllustrationById(id) {
  return CARD_ILLUSTRATION_OPTIONS.find(o => o.id === id) || null
}

export const FAMILY_DEFAULT_ILLUSTRATION_ID = {
  'PINN': 'card-pinn-library',
}

export const DOMAIN_DEFAULT_ILLUSTRATION_ID = {
  Geothermal: 'card-domain-geothermal',
}
