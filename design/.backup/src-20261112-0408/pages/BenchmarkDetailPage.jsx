import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBenchmark, fetchRelatedBenchmarks, SUITE_COLORS } from '../api/benchmarks'
import { fetchModel } from '../api/models'
import CodeBlock from '../components/CodeBlock'

const ACCENT = '#cf5a2a'
const DOT_BG = 'radial-gradient(#e7e0d1 1px,transparent 1px)'
const FAMILY_COLORS = {
  'PINN': '#7c6af7',
  'GNN / NNP': '#2db88a',
  'Grid RL': '#e67e22',
  'Forecasting': '#3498db',
  'Generative': '#e91e8c',
  'Baseline': '#b0a99a',
  'ML': '#56524a',
  'Statistical': '#8a857a',
  'Hydrological': '#2db88a',
  'Physical': '#7c6af7',
  'Satellite': '#3498db',
  'NWP': '#e67e22',
  'Control': '#cf5a2a',
  'Optimisation': '#e91e8c',
}

function SuiteChip({ suite }) {
  const color = SUITE_COLORS[suite] || '#8a857a'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {suite}
    </span>
  )
}

function StatPill({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a',
    }}>
      {icon} {label}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
      color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function SectionCard({ label, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  )
}

function RankMedal({ rank }) {
  if (rank === 1) return <span>🥇</span>
  if (rank === 2) return <span>🥈</span>
  if (rank === 3) return <span>🥉</span>
  return <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#a09990' }}>#{rank}</span>
}

function LeaderboardTable({ entries, metric, higherIsBetter }) {
  const best = entries[0]?.score ?? 1
  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: '#faf7f0', borderBottom: '1px solid #ece5d6' }}>
            {['Rank', 'Model', 'Family', metric, 'Submitted', ''].map(h => (
              <th key={h} style={{
                padding: '11px 16px', textAlign: 'left',
                fontFamily: "'Space Mono',monospace", fontSize: 10,
                color: '#8a857a', fontWeight: 400, letterSpacing: '0.04em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((row, i) => {
            const barWidth = higherIsBetter
              ? (row.score / best) * 100
              : (best / row.score) * 100
            const isEreuna = !!row.modelId
            return (
              <tr
                key={row.model}
                style={{
                  borderBottom: i < entries.length - 1 ? '1px solid #f0ebe0' : 'none',
                  background: row.rank === 1 ? '#fffdf8' : 'transparent',
                }}
              >
                <td style={{ padding: '13px 16px', width: 52 }}>
                  <RankMedal rank={row.rank} />
                </td>
                <td style={{ padding: '13px 16px', fontWeight: row.rank <= 3 ? 700 : 500 }}>
                  {isEreuna ? (
                    <Link to={`/models/${row.modelId}`} style={{ textDecoration: 'none', color: '#1b1a17' }}>
                      {row.model}
                      <span style={{
                        marginLeft: 6, fontFamily: "'Space Mono',monospace", fontSize: 9,
                        padding: '1px 5px', borderRadius: 4,
                        background: ACCENT + '18', color: ACCENT,
                      }}>ereuna</span>
                    </Link>
                  ) : (
                    <span style={{ color: '#3b3830' }}>{row.model}</span>
                  )}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '2px 7px',
                    borderRadius: 5, background: (FAMILY_COLORS[row.family] || '#8a857a') + '18',
                    color: FAMILY_COLORS[row.family] || '#8a857a',
                  }}>{row.family}</span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 80, height: 5, background: '#f0ebe0', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', width: `${Math.min(barWidth, 100)}%`, background: row.rank === 1 ? ACCENT : '#d4cfc7', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: row.rank <= 3 ? 700 : 400 }}>
                      {typeof row.score === 'number' && row.score % 1 !== 0 ? row.score.toFixed(1) : row.score}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990' }}>
                  {row.submitted}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  {isEreuna && (
                    <Link to={`/models/${row.modelId}`} style={{ fontSize: 12, color: ACCENT, textDecoration: 'none' }}>
                      View →
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ChangelogRow({ version, date, note, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #f0ebe0' }}>
      <span style={{
        fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
        borderRadius: 6, border: '1px solid #e7e0d2', color: '#1b1a17', background: '#faf7f0',
        whiteSpace: 'nowrap', flexShrink: 0, height: 'fit-content', marginTop: 2,
      }}>{version}</span>
      <div>
        <div style={{ fontSize: 13.5, color: '#1b1a17' }}>{note}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990', marginTop: 4 }}>{date}</div>
      </div>
    </div>
  )
}

function RelatedBenchmarkCard({ benchmark }) {
  return (
    <Link to={`/benchmarks/${benchmark.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#faf7f0', border: '1px solid #e7e0d2', borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{benchmark.name}</div>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 9, padding: '2px 6px',
            borderRadius: 5,
            background: (SUITE_COLORS[benchmark.suite] || '#8a857a') + '18',
            color: SUITE_COLORS[benchmark.suite] || '#8a857a',
            whiteSpace: 'nowrap',
          }}>{benchmark.suite}</span>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#a09990', marginTop: 6 }}>
          {benchmark.modelCount} models · SOTA: {benchmark.leaderScore}
        </div>
      </div>
    </Link>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 160, background: '#e7e0d2', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 36, width: 340, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 480, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[120, 320, 180, 200].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 276, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[140, 100, 100].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BenchmarkDetailPage() {
  const { benchmarkId } = useParams()
  const [benchmark, setBenchmark] = useState(null)
  const [relatedBenchmarks, setRelatedBenchmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [leaderModel, setLeaderModel] = useState(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setLeaderModel(null)
    fetchBenchmark(benchmarkId).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setBenchmark(data)
      Promise.all([
        fetchRelatedBenchmarks(data.relatedSuiteIds),
        data.leaderModelId ? fetchModel(data.leaderModelId) : Promise.resolve(null),
      ]).then(([related, leader]) => {
        setRelatedBenchmarks(related)
        setLeaderModel(leader)
        setLoading(false)
      })
    })
  }, [benchmarkId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: '#8a857a' }}>Benchmark not found.</div>
        <Link to="/benchmarks" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Benchmarks</Link>
      </div>
    )
  }

  const { name, suite, desc, longDesc, metric, higherIsBetter, leader, leaderScore,
    modelCount, evaluationDataset, methodology, submissionGuide, changelog,
    leaderboard, codeSnippet } = benchmark

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/benchmarks" style={{ color: '#8a857a', textDecoration: 'none' }}>Benchmarks</Link>
            <span>›</span>
            <span style={{ color: '#1b1a17' }}>{name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 14 }}>
                <SuiteChip suite={suite} />
              </div>
              <h1 style={{ fontSize: 42, letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1.06, margin: 0 }}>
                {name}
              </h1>
              <p style={{ fontSize: 15.5, color: '#56524a', marginTop: 12, maxWidth: 560, lineHeight: 1.6 }}>
                {desc}
              </p>
              <div style={{ display: 'flex', gap: 18, marginTop: 18, flexWrap: 'wrap' }}>
                <StatPill icon="⬡" label={`${modelCount} models`} />
                <StatPill icon="★" label={`SOTA: ${leader}`} />
                <StatPill icon="◉" label={`Best: ${leaderScore}`} />
                <StatPill icon="↕" label={`Metric: ${metric}`} />
              </div>
            </div>

            {/* SOTA card */}
            <div style={{
              background: '#1b1a17', borderRadius: 14, padding: '20px 22px', minWidth: 210,
              color: '#f1ede4', flexShrink: 0,
            }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#8a857a', letterSpacing: '0.08em', marginBottom: 8 }}>
                CURRENT SOTA
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{leaderScore}</div>
              <div style={{ fontSize: 13, color: '#b7b1a4', marginTop: 4 }}>{leader}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#6b6660', marginTop: 8 }}>{metric}</div>
              {leaderModel && (
                <Link to={`/models/${leaderModel.id}`} style={{
                  display: 'inline-block', marginTop: 14, fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 500,
                }}>
                  View model →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 80px', display: 'flex', gap: 36, alignItems: 'flex-start' }}>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* About */}
          <SectionCard label="About">
            <p style={{ fontSize: 14.5, color: '#3b3830', lineHeight: 1.7, margin: 0 }}>{longDesc}</p>
          </SectionCard>

          {/* Leaderboard */}
          <SectionCard label={`Leaderboard — ${leaderboard.length} models`}>
            <LeaderboardTable entries={leaderboard} metric={metric} higherIsBetter={higherIsBetter} />
            <div style={{ marginTop: 10, fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#a09990' }}>
              <span style={{ background: ACCENT + '18', color: ACCENT, padding: '1px 5px', borderRadius: 4, marginRight: 6 }}>ereuna</span>
              models are hosted on Ereuna and link to their model card.
            </div>
          </SectionCard>

          {/* Methodology */}
          <SectionCard label="Evaluation Protocol">
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '20px 22px', fontSize: 14.5, color: '#3b3830', lineHeight: 1.7 }}>
              {methodology}
            </div>
          </SectionCard>

          {/* Submission guide */}
          <SectionCard label="Submit a Model">
            <div style={{
              background: '#fdf9f3', border: '1.5px solid #e8d9c0', borderRadius: 12,
              padding: '18px 20px', fontSize: 14, color: '#3b3830', lineHeight: 1.65,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>↑</span>
              <span>{submissionGuide}</span>
            </div>
          </SectionCard>

          {/* Run benchmark code */}
          <SectionCard label="Run the Benchmark">
            <CodeBlock tabs={codeSnippet} />
          </SectionCard>

          {/* Changelog */}
          <SectionCard label="Benchmark Changelog">
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '4px 20px' }}>
              {changelog.map((c, i) => (
                <ChangelogRow key={c.version} {...c} isLast={i === changelog.length - 1} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 276, flexShrink: 0 }}>

          {/* Quick info */}
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <SectionLabel>Quick info</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Suite', suite],
                ['Models', String(modelCount)],
                ['Metric', metric],
                ['Direction', higherIsBetter ? '↑ Higher is better' : '↓ Lower is better'],
                ['Dataset', evaluationDataset.split(' —')[0]],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                  <span style={{ color: '#8a857a', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right', fontSize: 12 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation dataset */}
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <SectionLabel>Evaluation data</SectionLabel>
            <div style={{ fontSize: 13, color: '#3b3830', lineHeight: 1.55 }}>{evaluationDataset}</div>
            <Link to="/datasets" style={{ display: 'block', marginTop: 10, fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
              Browse datasets →
            </Link>
          </div>

          {/* API endpoint */}
          <div style={{ background: '#141310', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
                color: ACCENT, marginBottom: 10, textTransform: 'uppercase',
              }}>
                Submit API
              </div>
              <code style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#c8c0b0',
                wordBreak: 'break-all', lineHeight: 1.5, display: 'block',
              }}>
                {`POST /v1/benchmarks/${benchmark.id}/evaluate`}
              </code>
            </div>
          </div>

          {/* Related benchmarks */}
          {relatedBenchmarks.length > 0 && (
            <div>
              <SectionLabel>Related benchmarks</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {relatedBenchmarks.map(b => <RelatedBenchmarkCard key={b.id} benchmark={b} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
