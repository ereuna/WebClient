/**
 * Fetch artifact files (README, config JSON, etc.) from a repository's latest commit.
 */
import { listCommits, listFiles, getPresignedUrl } from './repositories.js'

const ARTIFACT_NAMES = ['README.md', 'hyperparameters.json', 'params.json', 'config.json']
const DATASET_ARTIFACT_NAMES = ['README.md', 'schema.json', 'profile.json', 'validation.json']

export function findRepoFilePath(files, filename) {
  if (!files?.length) return null
  const lower = filename.toLowerCase()
  const exact = files.find(f => f.path?.toLowerCase() === lower)
  if (exact) return exact.path
  const nested = files.find(f => f.path?.toLowerCase().endsWith(`/${lower}`))
  return nested?.path ?? null
}

async function fetchTextFromPresigned(repoId, commitSha, path) {
  const { url } = await getPresignedUrl(repoId, commitSha, path)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return res.text()
}

async function fetchJsonFromPresigned(repoId, commitSha, path) {
  const text = await fetchTextFromPresigned(repoId, commitSha, path)
  return JSON.parse(text)
}

/**
 * Load model repository artifacts from the latest commit.
 * Returns { readme, hyperparameters, params, config } — each null when absent.
 */
export async function fetchModelRepoArtifacts(repoId) {
  const empty = { readme: null, hyperparameters: null, params: null, config: null }

  if (!repoId) return empty

  try {
    const commits = await listCommits(repoId, { limit: 1 })
    const sha = commits?.[0]?.sha
    if (!sha) return empty

    const files = await listFiles(repoId, sha)
    const paths = {}
    for (const name of ARTIFACT_NAMES) {
      paths[name] = findRepoFilePath(files, name)
    }

    const [readme, hyperparameters, params, config] = await Promise.all([
      paths['README.md']
        ? fetchTextFromPresigned(repoId, sha, paths['README.md']).catch(() => null)
        : null,
      paths['hyperparameters.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['hyperparameters.json']).catch(() => null)
        : null,
      paths['params.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['params.json']).catch(() => null)
        : null,
      paths['config.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['config.json']).catch(() => null)
        : null,
    ])

    return { readme, hyperparameters, params, config }
  } catch {
    return empty
  }
}

/**
 * Load dataset repository artifacts from the latest commit.
 * Returns { readme, schema, profile, validation, files, repoId, commitSha } —
 * the four artifacts are null when absent; `files` lists every file in the commit
 * (path + size) so the UI can render a file browser, and `commitSha` lets callers
 * request presigned download URLs for those files.
 */
export async function fetchDatasetRepoArtifacts(repoId) {
  const empty = { readme: null, schema: null, profile: null, validation: null, files: [], repoId, commitSha: null }

  if (!repoId) return empty

  try {
    const commits = await listCommits(repoId, { limit: 1 })
    const sha = commits?.[0]?.sha
    if (!sha) return empty

    const files = await listFiles(repoId, sha)
    const paths = {}
    for (const name of DATASET_ARTIFACT_NAMES) {
      paths[name] = findRepoFilePath(files, name)
    }

    const [readme, schema, profile, validation] = await Promise.all([
      paths['README.md']
        ? fetchTextFromPresigned(repoId, sha, paths['README.md']).catch(() => null)
        : null,
      paths['schema.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['schema.json']).catch(() => null)
        : null,
      paths['profile.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['profile.json']).catch(() => null)
        : null,
      paths['validation.json']
        ? fetchJsonFromPresigned(repoId, sha, paths['validation.json']).catch(() => null)
        : null,
    ])

    return { readme, schema, profile, validation, files: files || [], repoId, commitSha: sha }
  } catch {
    return empty
  }
}
