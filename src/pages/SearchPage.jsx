import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { searchAll } from '../api/search'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BORDER = '1px solid #e7e0d2'

const TYPE_META = {
  model:        { label: 'Model',        color: '#7c6af7', icon: '⬡' },
  dataset:      { label: 'Dataset',      color: '#2db88a', icon: '◫' },
  repository:   { label: 'Repository',   color: '#3498db', icon: '⊞' },
  pipeline:     { label: 'Pipeline',     color: '#e67e22', icon: '⇢' },
  experiment:   { label: 'Experiment',   color: '#e91e8c', icon: '⚗' },
  space:        { label: 'Space',        color: '#9b59b6', icon: '◈' },
  organization: { label: 'Organization', color: '#cf5a2a', icon: '⬡' },
  user:         { label: 'User',         color: '#56524a', icon: '◯' },
}

const TABS = [
  { key: 'all',          label: 'All' },
  { key: 'model',        label: 'Models' },
  { key: 'dataset',      label: 'Datasets' },
  { key: 'repository',   label: 'Repositories' },
  { key: 'pipeline',     label: 'Pipelines' },
  { key: 'experiment',   label: 'Experiments' },
  { key: 'space',        label: 'Spaces' },
  { key: 'organization', label: 'Organizations' },
  { key: 'user',         label: 'Users' },
]

function resultLink(item) {
  switch (item.type) {
    case 'model':        return `/models/${item.id}`
    case 'dataset':      return `/datasets/${item.id}`
    case 'repository':   return `/repositories`
    case 'pipeline':     return `/pipelines/${item.id}`
    case 'experiment':   return `/experiments/${item.id}`
    case 'space':        return `/apps/${item.id}`
    case 'organization': return `/organizations/${item.slug}`
    case 'user':         return `/${item.username}`
    default:             return '/'
  }
}

function resultName(item) {
  return item.name || item.username || item.fullName || '—'
}

function resultOwner(item) {
  if (item.type === 'user') return item.fullName || ''
  if (item.type === 'organization') return item.slug || ''
  return item.owner || ''
}

function resultDescription(item) {
  return item.description || item.bio || ''
}

function flattenResults(data) {
  if (!data) return []
  return [
    ...(data.models        || []),
    ...(data.datasets      || []),
    ...(data.repositories  || []),
    ...(data.pipelines     || []),
    ...(data.experiments   || []),
    ...(data.spaces        || []),
    ...(data.organizations || []),
    ...(data.users         || []),
  ]
}

function countByType(data) {
  if (!data) return {}
  return {
    model:        (data.models        || []).length,
    dataset:      (data.datasets      || []).length,
    repository:   (data.repositories  || []).length,
    pipeline:     (data.pipelines     || []).length,
    experiment:   (data.experiments   || []).length,
    space:        (data.spaces        || []).length,
    organization: (data.organizations || []).length,
    user:         (data.users         || []).length,
  }
}

function ResultCard({ item }) {
  const meta = TYPE_META[item.type] || TYPE_META.model
  const name = resultName(item)
  const owner = resultOwner(item)
  const desc = resultDescription(item)
  const href = resultLink(item)

  return (
    <Link to={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#fff',
          border: CARD_BORDER,
          borderRadius: 14,
          padding: '18px 22px',
          display: 'flex',
          gap: 18,
          alignItems: 'flex-start',
          cursor: 'pointer',
          transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: meta.color + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          color: meta.color,
          marginTop: 2,
        }}>
          {meta.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: DARK }}>{name}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 6,
              background: meta.color + '18',
              color: meta.color,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {meta.label}
            </span>
          </div>
          {owner && (
            <div style={{
              fontSize: 12.5,
              color: MUTED,
              marginTop: 3,
              fontFamily: "'Space Mono',monospace",
            }}>
              {owner}
            </div>
          )}
          {desc && (
            <div style={{
              fontSize: 13.5,
              color: MEDIUM,
              lineHeight: 1.55,
              marginTop: 7,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {desc}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff',
      border: CARD_BORDER,
      borderRadius: 14,
      padding: '18px 22px',
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: '#f0ebe0', flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, width: '38%', background: '#f0ebe0', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: '20%', background: '#f5f0e8', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 12, width: '80%', background: '#f5f0e8', borderRadius: 6, marginBottom: 6 }} />
        <div style={{ height: 12, width: '60%', background: '#f5f0e8', borderRadius: 6 }} />
      </div>
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: '#f0ebe0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        color: MUTED,
      }}>
        ⌕
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: DARK }}>
        No results for "{query}"
      </div>
      <div style={{ fontSize: 14, color: MUTED, maxWidth: 360, lineHeight: 1.6 }}>
        Try different keywords, or browse by category using the navigation above.
      </div>
    </div>
  )
}

function SearchPrompt() {
  const [inputVal, setInputVal] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const q = inputVal.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 28,
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 520 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#fff',
          border: CARD_BORDER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          color: ACCENT,
          margin: '0 auto 24px',
          boxShadow: '0 4px 18px rgba(0,0,0,.06)',
        }}>
          ⌕
        </div>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 11,
          letterSpacing: '0.08em',
          color: ACCENT,
          marginBottom: 14,
        }}>
          GLOBAL SEARCH
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 600, color: DARK, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Search Aether
        </h1>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, marginBottom: 32 }}>
          Find models, datasets, pipelines, experiments, spaces, and more.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: '#a09990', fontSize: 16, pointerEvents: 'none',
            }}>⌕</span>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search models, datasets, users…"
              style={{
                fontFamily: 'inherit',
                fontSize: 15,
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 16px 13px 42px',
                borderRadius: 11,
                border: '1.4px solid #ddd6c8',
                background: '#fff',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,.04)',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              padding: '13px 22px',
              borderRadius: 11,
              border: 'none',
              background: DARK,
              color: '#f1ede4',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setActiveTab('all')
    if (!query.trim()) {
      setResults(null)
      return
    }
    setLoading(true)
    setResults(null)
    searchAll(query).then(data => {
      setResults(data)
      setLoading(false)
    }).catch(() => {
      setResults({ models: [], datasets: [], repositories: [], pipelines: [], experiments: [], spaces: [], organizations: [], users: [] })
      setLoading(false)
    })
  }, [query])

  if (!query.trim()) {
    return <SearchPrompt />
  }

  const allItems = flattenResults(results)
  const counts = countByType(results)
  const totalCount = allItems.length

  const visibleItems = activeTab === 'all'
    ? allItems
    : allItems.filter(item => item.type === activeTab)

  function tabCount(tabKey) {
    if (tabKey === 'all') return totalCount
    return counts[tabKey] || 0
  }

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '44px 28px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: '0.08em',
            color: ACCENT,
            marginBottom: 12,
          }}>
            SEARCH RESULTS
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 600,
            color: DARK,
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}>
            Results for "{query}"
          </h1>
          <div style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            color: MUTED,
            marginBottom: 28,
          }}>
            {loading ? 'Searching…' : `${totalCount} result${totalCount !== 1 ? 's' : ''} found`}
          </div>

          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 0,
          }}>
            {TABS.map(tab => {
              const count = tabCount(tab.key)
              const isActive = activeTab === tab.key
              const isDisabled = !loading && tab.key !== 'all' && count === 0
              return (
                <button
                  key={tab.key}
                  onClick={() => !isDisabled && setActiveTab(tab.key)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13,
                    padding: '8px 14px',
                    borderRadius: '10px 10px 0 0',
                    border: '1.4px solid',
                    borderBottom: isActive ? '1.4px solid transparent' : '1.4px solid #ddd6c8',
                    cursor: isDisabled ? 'default' : 'pointer',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? DARK : '#fff',
                    color: isActive ? '#f1ede4' : isDisabled ? '#c8c1b6' : MEDIUM,
                    borderColor: isActive ? DARK : '#ddd6c8',
                    marginBottom: isActive ? -1 : 0,
                    position: 'relative',
                    zIndex: isActive ? 2 : 1,
                    transition: 'background .12s, color .12s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {tab.label}
                  {!loading && count > 0 && (
                    <span style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: isActive ? 'rgba(241,237,228,.2)' : '#f0ebe0',
                      color: isActive ? '#f1ede4' : MUTED,
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 28px 64px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && results !== null && visibleItems.length === 0 && (
          <EmptyState query={query} />
        )}

        {!loading && visibleItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleItems.map((item, i) => (
              <ResultCard key={item.id || item.username || i} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
