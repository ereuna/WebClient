export const FAMILY_ILLUSTRATIONS = {
  'PINN': '/illustrations/survey/card-pinn-library.webp',
}

export const APP_ILLUSTRATIONS = {
  geosight: '/illustrations/survey/card-app-geosight.webp',
}

export const DOMAIN_ILLUSTRATIONS = {
  Geothermal: '/illustrations/survey/card-domain-geothermal.webp',
  'Geothermal Exploration': '/illustrations/survey/geothermal-exploration.webp',
  'Exploration': '/illustrations/survey/geothermal-exploration.webp',
  'Seismicity': '/illustrations/survey/geothermal-seismicity.webp',
  'Site Drilling': '/illustrations/survey/geothermal-drilling.webp',
  'Drilling': '/illustrations/survey/geothermal-drilling.webp',
  'Petrophysics': '/illustrations/survey/geothermal-petrophysics.webp',
  'Reservoir Characterization': '/illustrations/survey/geothermal-reservoir-characterization.webp',
  'Reservoir Engineering': '/illustrations/survey/geothermal-reservoir-engineering.webp',
  'Production/Injection Engineering': '/illustrations/survey/geothermal-production-injection.webp',
}

export const ACTION_ILLUSTRATIONS = {
  newModel: '/illustrations/survey/action-new-model.webp',
  newDataset: '/illustrations/survey/action-new-dataset.webp',
  launchTraining: '/illustrations/survey/action-launch-training.webp',
  deployModel: '/illustrations/survey/action-deploy-model.webp',
}

export const METRIC_ILLUSTRATIONS = {
  Models: '/illustrations/survey/metric-models.webp',
  Datasets: '/illustrations/survey/metric-datasets.webp',
  Pipelines: '/illustrations/survey/metric-pipelines.webp',
  Spaces: '/illustrations/survey/metric-spaces.webp',
}

export const PAGE_ILLUSTRATIONS = {
  models: '/illustrations/survey/page-models-hero.webp',
  datasets: '/illustrations/survey/page-datasets-hero.webp',
  benchmarks: '/illustrations/survey/page-benchmarks-hero.webp',
  apps: '/illustrations/survey/page-apps-hero.webp',
  docs: '/illustrations/survey/page-docs-hero.webp',
  pipelines: '/illustrations/survey/page-pipelines-hero.webp',
  deployments: '/illustrations/survey/page-deployments-hero.webp',
  experiments: '/illustrations/survey/page-experiments-hero.webp',
  inference: '/illustrations/survey/page-inference-hero.webp',
  repositories: '/illustrations/survey/page-repositories-hero.webp',
  dashboard: '/illustrations/survey/page-dashboard-hero.webp',
}

export const CARD_ILLUSTRATION_OPTIONS = [
  { id: 'card-pinn-library',                      src: '/illustrations/survey/card-pinn-library.webp',                     label: 'PINN Library' },
  { id: 'card-domain-geothermal',                 src: '/illustrations/survey/card-domain-geothermal.webp',                label: 'Geothermal' },
  { id: 'geothermal-reservoir',                   src: '/illustrations/survey/05-geothermal-reservoir-slab.webp',          label: 'Geothermal Reservoir' },
  { id: 'geothermal-exploration',                 src: '/illustrations/survey/geothermal-exploration.webp',                label: 'Exploration' },
  { id: 'geothermal-seismicity',                  src: '/illustrations/survey/geothermal-seismicity.webp',                 label: 'Seismicity' },
  { id: 'geothermal-drilling',                    src: '/illustrations/survey/geothermal-drilling.webp',                   label: 'Drilling' },
  { id: 'geothermal-petrophysics',                src: '/illustrations/survey/geothermal-petrophysics.webp',               label: 'Petrophysics' },
  { id: 'geothermal-reservoir-characterization',  src: '/illustrations/survey/geothermal-reservoir-characterization.webp', label: 'Reservoir Characterization' },
  { id: 'geothermal-reservoir-engineering',       src: '/illustrations/survey/geothermal-reservoir-engineering.webp',      label: 'Reservoir Engineering' },
  { id: 'geothermal-production-injection',        src: '/illustrations/survey/geothermal-production-injection.webp',       label: 'Production/Injection Engineering' },
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
