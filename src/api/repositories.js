/**
 * Direct RepositoryService API calls.
 * Used for live star counts, search, fork, star/unstar actions.
 */
import { repoApi } from './client.js'

// ── Listing & search ──────────────────────────────────────────────────────────

export async function listRepositories({ repoType, visibility, skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams()
  if (repoType)    params.set('repo_type', repoType)
  if (visibility)  params.set('visibility', visibility)
  params.set('skip', skip)
  params.set('limit', limit)
  return repoApi.get(`/repositories?${params}`)
}

export async function searchRepositories({ q, repoType, visibility, skip = 0, limit = 20 } = {}) {
  const params = new URLSearchParams({ q, skip, limit })
  if (repoType)   params.set('repo_type', repoType)
  if (visibility) params.set('visibility', visibility)
  return repoApi.get(`/repositories/search?${params}`)
}

export async function getRepository(repoId) {
  return repoApi.get(`/repositories/${repoId}`)
}

export async function getRepositoryBySlug(ownerSlug, repoSlug) {
  return repoApi.get(`/${ownerSlug}/${repoSlug}`)
}

// ── Creation ──────────────────────────────────────────────────────────────────

/**
 * Create a new repository.
 * @param {object} data
 * @param {string} data.slug           - URL-safe identifier e.g. "geopinn-v2"
 * @param {string} data.repoType       - "MODEL" | "DATASET" | "PIPELINE" | ...
 * @param {string} data.visibility     - "public" | "private" | "internal"
 * @param {string} [data.description]
 * @param {object} [data.metadata]     - Arbitrary rich metadata stored as JSONB
 */
export async function createRepository({ slug, repoType, visibility, description = '', metadata = {} }) {
  return repoApi.post('/repositories', {
    slug,
    repo_type: repoType,
    visibility,
    description,
    metadata,
  })
}

/**
 * Upload files to a repository as a commit (multipart POST).
 * @param {string}   repoId
 * @param {object}   opts
 * @param {string}   opts.message  - Commit message
 * @param {string}   [opts.branch] - Target branch (default: "main")
 * @param {File[]}   opts.files    - Browser File objects to upload
 */
export async function createCommit(repoId, { message, branch = 'main', files = [] }) {
  const form = new FormData()
  form.append('message', message)
  form.append('branch', branch)
  for (const file of files) {
    form.append('files', file, file.name)
  }
  return repoApi.form(`/repositories/${repoId}/commits`, form)
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function starRepository(repoId) {
  return repoApi.post(`/repositories/${repoId}/star`, {})
}

export async function unstarRepository(repoId) {
  return repoApi.delete(`/repositories/${repoId}/star`)
}

export async function forkRepository(repoId, targetOrgId = null) {
  return repoApi.post(`/repositories/${repoId}/fork`, { target_org_id: targetOrgId })
}

// ── Live stat helpers ─────────────────────────────────────────────────────────

/**
 * Fetch live star/download counts for a list of slugs.
 * Returns a Map<slug, { star_count, download_count, id }>.
 */
export async function fetchLiveStats(repoType) {
  try {
    const repos = await listRepositories({ repoType, limit: 200 })
    const map = new Map()
    for (const r of repos) {
      map.set(r.slug, {
        id: r.id,
        star_count: r.star_count,
        download_count: r.download_count,
        updated_at: r.updated_at,
      })
    }
    return map
  } catch {
    return new Map()
  }
}

// ── Releases & artifacts ──────────────────────────────────────────────────────

export async function listReleases(repoId) {
  return repoApi.get(`/repositories/${repoId}/releases`)
}

export async function listArtifacts(repoId) {
  return repoApi.get(`/repositories/${repoId}/artifacts`)
}
