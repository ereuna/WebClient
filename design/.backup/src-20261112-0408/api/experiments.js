/**
 * Experiments via PlatformService.
 */
import { platformApi } from './client.js'

function durationFromRun(run) {
  if (!run?.start_time) return '—'
  const end = run.end_time ? new Date(run.end_time) : new Date()
  const ms = end - new Date(run.start_time)
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function mapExperiment(e, latestRun = null) {
  const params = latestRun?.params || e.tags || {}
  const metrics = latestRun?.tags?.metrics || {}
  return {
    id: e.id,
    name: e.name,
    owner: e.tags?.owner || 'unknown',
    project: e.tags?.project || e.description || '',
    status: latestRun?.status || 'created',
    metrics: {
      accuracy: metrics.accuracy ?? null,
      loss: metrics.loss ?? null,
      f1: metrics.f1 ?? null,
    },
    params: {
      lr: params.lr ?? params.learning_rate ?? null,
      epochs: params.epochs ?? null,
      batchSize: params.batch_size ?? params.batchSize ?? null,
    },
    createdAt: e.created_at,
    duration: latestRun ? durationFromRun(latestRun) : '—',
    repoId: e.repo_id,
    runs: [],
  }
}

export async function fetchAllExperiments() {
  const rows = await platformApi.get('/experiments?limit=200').catch(() => [])
  return Promise.all(
    (rows || []).map(async (e) => {
      let runs = []
      try {
        runs = await platformApi.get(`/experiments/${e.id}/runs?limit=1`)
      } catch { /* ignore */ }
      return mapExperiment(e, runs?.[0])
    }),
  )
}

export async function fetchExperiment(id) {
  const e = await platformApi.get(`/experiments/${id}`)
  let runs = []
  try {
    runs = await platformApi.get(`/experiments/${id}/runs?limit=50`)
  } catch { /* ignore */ }
  return { ...mapExperiment(e, runs?.[0]), runs: runs || [] }
}
