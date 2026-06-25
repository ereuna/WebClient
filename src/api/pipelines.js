/**
 * Pipelines — PIPELINE repos from RepositoryService + runs from PlatformService.
 */
import { platformApi } from './client.js'
import { listRepositories } from './repositories.js'

function timeSince(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

async function mapPipelineRepo(repo, runs = []) {
  const m = repo.metadata || {}
  const lastRun = runs[0]
  return {
    id: repo.slug,
    _repoId: repo.id,
    name: repo.slug,
    owner: m.owner_slug || 'unknown',
    description: repo.description || '',
    status: repo.is_archived ? 'paused' : 'active',
    schedule: m.schedule || null,
    lastRun: lastRun?.created_at || repo.updated_at,
    runs: runs.length,
    tags: m.tags || [],
    createdAt: repo.created_at,
    lastRunLabel: timeSince(lastRun?.created_at || repo.updated_at),
  }
}

export async function fetchAllPipelines() {
  const repos = await listRepositories({ repoType: 'PIPELINE', limit: 200 }).catch(() => [])
  return Promise.all(
    (repos || []).map(async (repo) => {
      let runs = []
      try {
        runs = await platformApi.get(`/pipelines/${repo.id}/runs?limit=10`)
      } catch { /* ignore */ }
      return mapPipelineRepo(repo, runs || [])
    }),
  )
}

export async function fetchPipeline(id) {
  const all = await fetchAllPipelines()
  const pipeline = all.find(p => p.id === id || p._repoId === id)
  if (!pipeline) throw new Error(`Pipeline not found: ${id}`)
  let runHistory = []
  try {
    runHistory = await platformApi.get(`/pipelines/${pipeline._repoId}/runs?limit=50`)
  } catch { /* ignore */ }
  return { ...pipeline, runHistory: runHistory || [] }
}
