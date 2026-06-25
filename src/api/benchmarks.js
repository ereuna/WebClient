/**
 * Benchmarks via PlatformService.
 */
import { platformApi } from './client.js'

export const SUITE_COLORS = {
  'Physics Constraints': '#7c6af7',
  'Forecasting': '#3498db',
  'Materials': '#2db88a',
  'Dispatch': '#e67e22',
}

function mapBenchmark(b) {
  return {
    id: b.id,
    suite: b.suite || 'Benchmark',
    name: b.name,
    desc: b.desc || `${b.name} evaluation suite`,
    longDesc: b.desc || '',
    metric: b.metric,
    higherIsBetter: b.higher_is_better ?? true,
    leader: b.leader,
    leaderModelId: b.leaderboard?.[0]?.model_id || null,
    leaderScore: b.leader_score != null ? `${b.leader_score}` : '—',
    modelCount: b.model_count ?? 0,
    evaluationDataset: b.desc || '—',
    relatedSuiteIds: [],
    methodology: '',
    submissionGuide: '',
    changelog: [],
    leaderboard: (b.leaderboard || []).map(entry => ({
      rank: entry.rank,
      model: entry.model,
      modelId: entry.model_id,
      family: entry.family || '—',
      score: entry.score,
      submitted: entry.submitted,
    })),
    codeSnippet: { python: '# Benchmark evaluation via Aether PlatformService' },
  }
}

export async function fetchAllBenchmarks() {
  const rows = await platformApi.get('/benchmarks').catch(() => [])
  return (rows || []).map(mapBenchmark)
}

export async function fetchBenchmark(id) {
  try {
    const b = await platformApi.get(`/benchmarks/${id}`)
    return mapBenchmark(b)
  } catch {
    const all = await fetchAllBenchmarks()
    const match = all.find(b => b.id === id)
    if (!match) throw new Error(`Benchmark not found: ${id}`)
    return match
  }
}

export async function fetchRelatedBenchmarks(ids = []) {
  if (!ids.length) return []
  const all = await fetchAllBenchmarks()
  return all.filter(b => ids.includes(b.id))
}
