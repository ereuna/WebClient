/**
 * Datasets API — all data comes from RepositoryService.
 * Rich fields (coverage, schema, collection notes, etc.) are stored in
 * the repo's `metadata` JSONB column and mapped here into the shape
 * the UI components expect.
 */
import { listRepositories, starRepository, unstarRepository } from './repositories.js'

export const DOMAIN_COLORS = {
  Geothermal: '#cf5a2a',
  Nuclear:    '#7c6af7',
  Wind:       '#3498db',
  Solar:      '#e6b800',
  Hydro:      '#2db88a',
  Grid:       '#e67e22',
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
 * Map a RepositoryService repo object → UI dataset shape.
 * The `metadata` JSONB field carries every rich property that the
 * static catalog used to hard-code.
 */
function mapRepoToDataset(repo) {
  const m = repo.metadata || {}
  return {
    // Identity
    id:          repo.slug,
    _repoId:     repo.id,
    ownerUserId: repo.owner_user_id || null,
    // Card-level fields
    title:        m.title   || repo.slug,
    domain:       m.domain  || 'Unknown',
    illustration: m.illustration || null,
    format:  m.format  || '—',
    license: m.license || '—',
    desc:    repo.description || '',
    // Stats (live from repo, formatted)
    downloads: fmtNum(repo.download_count),
    updated:   timeSince(repo.updated_at),
    // Detail-page fields (all optional — sections hidden when absent)
    longDesc:         m.long_description  || repo.description || '',
    rows:             m.rows              || '—',
    size:             m.size              || '—',
    version:          m.version           || '1.0.0',
    coverage:         m.coverage          || {},
    schema:           m.schema            || [],
    collection:       m.collection        || '',
    usageNotes:       m.usage_notes       || '',
    codeSnippet:      m.code_snippet      || {},
    relatedModelIds:  m.related_model_ids  || [],
    relatedDatasetIds: m.related_dataset_ids || [],
  }
}

// ── Module-level cache ────────────────────────────────────────────────────────

let _cache = null

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchAllDatasets() {
  try {
    const repos = await listRepositories({ repoType: 'DATASET', limit: 200 })
    _cache = (repos || []).map(mapRepoToDataset)
  } catch {
    _cache = []
  }
  return _cache
}

/** Force the next fetchDataset/fetchAllDatasets call to refetch from the server. */
export function invalidateDatasetsCache() {
  _cache = null
}

export async function fetchDataset(slug) {
  const datasets = _cache ?? await fetchAllDatasets()
  return datasets.find(d => d.id === slug) ?? null
}

export async function fetchRelatedDatasets(ids = []) {
  if (!ids.length) return []
  const datasets = _cache ?? await fetchAllDatasets()
  return datasets.filter(d => ids.includes(d.id))
}

export async function toggleDatasetStar(dataset, currentlyStarred) {
  if (!dataset._repoId) return
  if (currentlyStarred) {
    await unstarRepository(dataset._repoId)
  } else {
    await starRepository(dataset._repoId)
  }
}
