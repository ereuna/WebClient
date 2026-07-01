/**
 * Fetch artifact files (README, config JSON, etc.) from a repository's latest commit.
 */
import { listCommits, listFiles, getPresignedUrl } from './repositories.js'

const ARTIFACT_NAMES = ['README.md', 'hyperparameters.json', 'params.json', 'config.json']

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
