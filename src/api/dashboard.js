/**
 * Dashboard aggregates from RepositoryService and AuthService.
 */
import { authApi } from './client.js'
import { listRepositories } from './repositories.js'

export async function fetchDashboardData() {
  const [models, datasets, pipelines, spaces, orgs] = await Promise.all([
    listRepositories({ repoType: 'MODEL', limit: 200 }).catch(() => []),
    listRepositories({ repoType: 'DATASET', limit: 200 }).catch(() => []),
    listRepositories({ repoType: 'PIPELINE', limit: 200 }).catch(() => []),
    listRepositories({ repoType: 'SPACE', limit: 200 }).catch(() => []),
    authApi.get('/organizations').catch(() => []),
  ])

  const allRepos = [...models, ...datasets, ...pipelines, ...spaces]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

  return {
    metrics: {
      models: models.length,
      datasets: datasets.length,
      pipelines: pipelines.length,
      spaces: spaces.length,
    },
    recentRepos: allRepos.slice(0, 6),
    organizations: orgs,
  }
}
