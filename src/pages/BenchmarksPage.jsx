import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllBenchmarks, SUITE_COLORS } from '../api/benchmarks'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'
const FAMILY_COLORS = {
  'PINN': '#7c6af7',
  'GNN / NNP': '#2db88a',
  'Grid RL': '#e67e22',
  'Forecasting': '#3498db',
  'Generative': '#e91e8c',
}

const SUITES = ['All', 'Physics Constraints', 'Forecasting', 'Materials', 'Dispatch']

const overallLeaderboard = [
  { rank: 1, model: 'TurkanaWind-24h', modelId: 'turkanawind-24h', family: 'Forecasting', score: 98.4, badge: '🥇' },
  { rank: 2, model: 'GeoPINN-v2',      modelId: 'geopinn-v2',      family: 'PINN',        score: 97.6, badge: '🥈' },
  { rank: 3, model: 'SteelGNN',        modelId: 'steelgnn',        family: 'GNN / NNP',   score: 96.1, badge: '🥉' },
  { rank: 4, model: 'KenyaDispatch-v1',modelId: 'kenyadispatch-v1',family: 'Grid RL',     score: 94.8, badge: '' },
  { rank: 5, model: 'SolarGHI-Irrad',  modelId: 'solarghi-irrad',  family: 'Forecasting', score: 94.2, badge: '' },
  { rank: 6, model: 'HydroBalancer',   modelId: 'hydrobalancer',   family: 'Grid RL',     score: 92.7, badge: '' },
]

function BenchmarkCard({ b }) {
  return (
    <Link to={`/benchmarks/${b.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
          padding: '22px 24px', cursor: 'pointer', transition: 'box-shadow .15s', height: '100%',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <span style={{
              display: 'inline-block', padding: '3px 9px', borderRadius: 7, fontSize: 10, fontWeight: 500,
              fontFamily: "'Space Mono',monospace", marginBottom: 10,
              background: (SUITE_COLORS[b.suite] || '#8a857a') + '18',
              color: SUITE_COLORS[b.suite] || '#8a857a',
            }}>{b.suite}</span>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{b.name}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a' }}>SOTA</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1b1a17', marginTop: 2 }}>{b.leaderScore}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#a09990', marginTop: 2 }}>{b.leader}</div>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 10 }}>{b.desc}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: 12 }}>
          <span style={{ color: '#8a857a', fontFamily: "'Space Mono',monospace", fontSize: 10.5 }}>
            {b.metric}
          </span>
          <span style={{ color: '#8a857a', fontFamily: "'Space Mono',monospace", fontSize: 10.5 }}>
            {b.modelCount} models
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BenchmarksPage() {
  const [allBenchmarks, setAllBenchmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [suite, setSuite] = useState('All')

  useEffect(() => {
    fetchAllBenchmarks().then(data => { setAllBenchmarks(data); setLoading(false) })
  }, [])

  const filtered = allBenchmarks.filter(b => suite === 'All' || b.suite === suite)

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHero
        eyebrow="EVALUATION & LEADERBOARDS"
        title="Benchmarks"
        description="Standardised benchmark suites for physics-informed energy ML. Every model that appears on Ereuna reports scores here."
        illustration={PAGE_ILLUSTRATIONS.benchmarks}
        illustrationAlt="Benchmarks illustration"
      >
          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {SUITES.map(s => (
              <button
                key={s}
                onClick={() => setSuite(s)}
                style={{
                  fontFamily: 'inherit', fontSize: 13, padding: '6px 14px', borderRadius: 20,
                  border: '1.4px solid', cursor: 'pointer', fontWeight: suite === s ? 600 : 400,
                  background: suite === s ? '#1b1a17' : '#fff',
                  color: suite === s ? '#f1ede4' : '#56524a',
                  borderColor: suite === s ? '#1b1a17' : '#ddd6c8',
                }}
              >
                {s}
              </button>
            ))}
          </div>
      </PageHero>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 64px' }}>
        {/* Overall leaderboard — shown only on "All" */}
        {suite === 'All' && !loading && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.06em', color: ACCENT, marginBottom: 16 }}>
              OVERALL LEADERBOARD
            </div>
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#faf7f0', borderBottom: '1px solid #ece5d6' }}>
                    {['Rank', 'Model', 'Family', 'Ereuna Score', ''].map(h => (
                      <th key={h} style={{
                        padding: '12px 18px', textAlign: 'left', fontFamily: "'Space Mono',monospace",
                        fontSize: 10.5, color: '#8a857a', fontWeight: 400, letterSpacing: '0.04em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {overallLeaderboard.map((row, i) => (
                    <tr key={row.model} style={{ borderBottom: i < overallLeaderboard.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                      <td style={{ padding: '14px 18px', fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#8a857a' }}>
                        {row.badge || `#${row.rank}`}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                        <Link to={`/models/${row.modelId}`} style={{ textDecoration: 'none', color: '#1b1a17' }}>
                          {row.model}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#56524a', fontSize: 13 }}>
                        <span style={{
                          fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
                          borderRadius: 5, background: (FAMILY_COLORS[row.family] || '#8a857a') + '18',
                          color: FAMILY_COLORS[row.family] || '#8a857a',
                        }}>{row.family}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ height: 6, width: 120, background: '#f0ebe0', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${row.score}%`, background: ACCENT, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{row.score}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <Link to={`/models/${row.modelId}`} style={{ fontSize: 12, color: ACCENT, textDecoration: 'none' }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Benchmark cards */}
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${filtered.length} benchmark suite${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 180, background: '#f0ebe0', borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {filtered.map(b => <BenchmarkCard key={b.id} b={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}
