import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllBenchmarks, SUITE_COLORS } from '../api/benchmarks'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

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
        </div>
        <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55, marginTop: 10 }}>{b.desc}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: 12 }}>
          <span style={{ color: '#8a857a', fontFamily: "'Space Mono',monospace", fontSize: 10.5 }}>
            {b.metric}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BenchmarksPage() {
  const [allBenchmarks, setAllBenchmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllBenchmarks().then(data => { setAllBenchmarks(data); setLoading(false) })
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHero
        eyebrow="EVALUATION & VALIDATION"
        title="Benchmarks"
        description="Physics constraint validation suites for geothermal machine learning models."
        illustration={PAGE_ILLUSTRATIONS.benchmarks}
        illustrationAlt="Benchmarks illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 64px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20 }}>
          {loading ? 'Loading…' : `${allBenchmarks.length} evaluation suite${allBenchmarks.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 140, background: '#f0ebe0', borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {allBenchmarks.map(b => <BenchmarkCard key={b.id} b={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}
