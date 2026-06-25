/**
 * Unified search — repositories + organizations + users.
 */
import { authApi } from './client.js'
import { searchRepositories } from './repositories.js'

const EMPTY = {
  models: [],
  datasets: [],
  repositories: [],
  pipelines: [],
  experiments: [],
  spaces: [],
  organizations: [],
  users: [],
}

function mapRepoHit(r) {
  const typeMap = {
    MODEL: 'model',
    DATASET: 'dataset',
    PIPELINE: 'pipeline',
    SPACE: 'space',
    AGENT: 'model',
    WORKFLOW: 'experiment',
  }
  const type = typeMap[r.repo_type || r.repository_type] || 'repository'
  return {
    id: r.slug || r.id,
    name: r.slug,
    owner: r.owner_slug || r.metadata?.owner_slug || '',
    type,
    description: r.description || '',
  }
}

export async function searchAll(query) {
  if (!query || !query.trim()) return { ...EMPTY }

  const q = query.trim().toLowerCase()
  const results = { ...EMPTY }

  try {
    const repoHits = await searchRepositories({ q: query.trim(), limit: 30 })
    for (const r of repoHits || []) {
      const item = mapRepoHit(r)
      switch (item.type) {
        case 'model': results.models.push(item); break
        case 'dataset': results.datasets.push(item); break
        case 'pipeline': results.pipelines.push(item); break
        case 'space': results.spaces.push(item); break
        case 'experiment': results.experiments.push(item); break
        default: results.repositories.push(item)
      }
    }
  } catch { /* ignore */ }

  try {
    const orgs = await authApi.get('/organizations')
    for (const o of orgs || []) {
      if (
        o.slug?.toLowerCase().includes(q) ||
        o.display_name?.toLowerCase().includes(q)
      ) {
        results.organizations.push({
          id: o.id,
          slug: o.slug,
          name: o.display_name,
          type: 'organization',
          description: o.description || '',
        })
      }
    }
  } catch { /* not logged in */ }

  return results
}
