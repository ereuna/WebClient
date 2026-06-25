/**
 * Models API — all data comes from RepositoryService.
 * Rich fields (metrics, architecture, model card, etc.) are stored in
 * the repo's `metadata` JSONB column and mapped here into the shape
 * the UI components expect.
 */
import { listRepositories, starRepository, unstarRepository } from './repositories.js'

export const FAMILY_COLORS = {
  'PINN':        '#7c6af7',
  'GNN / NNP':   '#2db88a',
  'Grid RL':     '#e67e22',
  'Forecasting': '#3498db',
  'Generative':  '#e91e8c',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtNum(n) {
  if (!n) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function timeSince(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 2) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} day${d !== 1 ? 's' : ''} ago`
  const mo = Math.floor(d / 30)
  return `${mo} month${mo !== 1 ? 's' : ''} ago`
}

/**
 * Map a RepositoryService repo object → UI model shape.
 * The `metadata` JSONB field carries every rich property that the
 * static catalog used to hard-code.
 */
function mapRepoToModel(repo) {
  const m = repo.metadata || {}
  return {
    // Identity
    id:      repo.slug,
    _repoId: repo.id,
    // Card-level fields
    title:   m.title   || repo.slug,
    family:  m.family  || 'Unknown',
    license: m.license || '—',
    desc:    repo.description || '',
    tags:    m.tags    || [],
    // Stats (live from repo, formatted)
    downloads: fmtNum(repo.download_count),
    stars:     fmtNum(repo.star_count),
    updated:   timeSince(repo.updated_at),
    // Detail-page fields (all optional — sections hidden when absent)
    longDesc:        m.long_description || repo.description || '',
    size:            m.size             || '—',
    version:         m.version          || '1.0.0',
    metrics:         m.metrics          || [],
    architecture:    m.architecture     || {},
    modelCard:       m.model_card       || {},
    versions:        m.versions         || [],
    trainingDataset: m.training_dataset || '—',
    endpoint:        m.endpoint         || `/v1/inference/${repo.slug}`,
    codeSnippet:     m.code_snippet     || {},
    relatedIds:      m.related_ids      || [],
  }
}

// ── Module-level cache ────────────────────────────────────────────────────────
// Avoids re-fetching when fetchModel / fetchRelatedModels are called
// shortly after fetchAllModels on the same page load.

let _cache = null

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchAllModels() {
  try {
    const repos = await listRepositories({ repoType: 'MODEL', limit: 200 })
    _cache = (repos || []).map(mapRepoToModel)
  } catch {
    _cache = []
  }
  return _cache
}

export async function fetchModel(slug) {
  const models = _cache ?? await fetchAllModels()
  return models.find(m => m.id === slug) ?? null
}

export async function fetchRelatedModels(ids = []) {
  if (!ids.length) return []
  const models = _cache ?? await fetchAllModels()
  return models.filter(m => ids.includes(m.id))
}

export async function toggleModelStar(model, currentlyStarred) {
  if (!model._repoId) return
  if (currentlyStarred) {
    await unstarRepository(model._repoId)
  } else {
    await starRepository(model._repoId)
  }
}
