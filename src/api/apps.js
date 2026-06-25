/**
 * Spaces (Apps) — SPACE repos from RepositoryService with metadata mapping.
 */
import { listRepositories } from './repositories.js'

export const STATUS_COLORS = {
  Live: '#2db88a',
  Beta: '#e67e22',
  'Coming soon': '#8a857a',
}

function mapSpaceRepo(repo) {
  const m = repo.metadata || {}
  return {
    id: repo.slug,
    _repoId: repo.id,
    emoji: m.emoji || '◈',
    title: m.title || repo.slug,
    tagline: m.tagline || repo.description || '',
    desc: repo.description || '',
    longDesc: m.long_description || repo.description || '',
    tags: m.tags || [],
    status: m.status || 'Live',
    users: String(repo.download_count ?? 0),
    poweredByIds: m.powered_by_ids || m.related_model_ids || [],
    trainingDatasetIds: m.training_dataset_ids || m.related_dataset_ids || [],
    features: m.features || [],
    techStack: m.tech_stack || [],
    apiEndpoint: m.api_endpoint || '',
    embedSnippet: m.embed_snippet || '',
    starCount: repo.star_count ?? 0,
  }
}

export async function fetchAllApps() {
  const repos = await listRepositories({ repoType: 'SPACE', limit: 200 }).catch(() => [])
  return (repos || []).map(mapSpaceRepo)
}

export async function fetchApp(id) {
  const apps = await fetchAllApps()
  return apps.find(a => a.id === id) ?? null
}
