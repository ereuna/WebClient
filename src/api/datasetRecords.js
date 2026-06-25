/**
 * DatasetsService records — schema, preview, profile, lineage linked by repo_id.
 */
import { datasetApi } from './client.js'

export async function listDatasetRecords({ skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams({ skip, limit })
  return datasetApi.get(`/datasets?${params}`)
}

export async function getDatasetRecordByRepoId(repoId) {
  const all = await listDatasetRecords({ limit: 1000 })
  return (all || []).find(d => d.repo_id === repoId) ?? null
}

export async function getDatasetSchema(datasetId, versionId = null) {
  const params = versionId ? `?version_id=${versionId}` : ''
  return datasetApi.get(`/datasets/${datasetId}/schema/${params}`)
}

export async function previewRows(datasetId, { limit = 20, versionId = null } = {}) {
  const params = new URLSearchParams({ limit })
  if (versionId) params.set('version_id', versionId)
  return datasetApi.get(`/datasets/${datasetId}/preview/rows?${params}`)
}

export async function previewColumns(datasetId, versionId = null) {
  const params = versionId ? `?version_id=${versionId}` : ''
  return datasetApi.get(`/datasets/${datasetId}/preview/columns${params}`)
}

export async function getDatasetProfile(datasetId, versionId = null) {
  const params = versionId ? `?version_id=${versionId}` : ''
  return datasetApi.get(`/datasets/${datasetId}/profile/${params}`)
}

export async function getDatasetLineage(datasetId) {
  return datasetApi.get(`/datasets/${datasetId}/lineage/`)
}

export async function listDatasetVersions(datasetId) {
  return datasetApi.get(`/datasets/${datasetId}/versions/`)
}

export async function uploadDatasetVersion(datasetId, { file, message = 'Upload' }) {
  const form = new FormData()
  form.append('file', file, file.name)
  form.append('message', message)
  return datasetApi.form(`/datasets/${datasetId}/versions/`, form)
}
