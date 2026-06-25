/**
 * Deployments via PlatformService.
 */
import { platformApi } from './client.js'

function mapDeployment(d) {
  const cfg = d.config || {}
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    model: cfg.model_slug || cfg.model || '—',
    version: cfg.version || '—',
    status: d.status === 'active' ? 'running' : d.status,
    replicas: cfg.replicas ?? 0,
    latencyMs: cfg.latency_ms ?? null,
    requestsPerSec: cfg.requests_per_sec ?? 0,
    gpuUsage: cfg.gpu_usage ?? 0,
    cost: cfg.cost ?? 0,
    region: cfg.region || '—',
    url: d.url,
    createdAt: d.created_at,
    repoId: d.repo_id,
  }
}

export async function fetchAllDeployments() {
  const rows = await platformApi.get('/deployments?limit=200').catch(() => [])
  return (rows || []).map(mapDeployment)
}

export async function fetchDeployment(id) {
  const rows = await fetchAllDeployments()
  const bySlug = rows.find(d => d.slug === id || d.id === id)
  if (bySlug) {
    let logs = []
    try {
      logs = await platformApi.get(`/deployments/${bySlug.slug}/logs?limit=100`)
    } catch { /* ignore */ }
    return { ...bySlug, logs: logs || [] }
  }
  throw new Error(`Deployment not found: ${id}`)
}
