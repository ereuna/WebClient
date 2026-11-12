/**
 * Global search bar — hits the RepositoryService OpenSearch endpoint
 * and shows instant results across models, datasets, spaces, etc.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchRepositories } from '../api/repositories.js'


const TYPE_LABELS = {
  MODEL:    { label: 'Model',    color: '#7c6af7', path: '/models' },
  DATASET:  { label: 'Dataset',  color: '#2db88a', path: '/datasets' },
  SPACE:    { label: 'Space',    color: '#e91e8c', path: '/apps' },
  PIPELINE: { label: 'Pipeline', color: '#e67e22', path: '/models' },
  AGENT:    { label: 'Agent',    color: '#3498db', path: '/models' },
  WORKFLOW: { label: 'Workflow', color: '#5f6670', path: '/models' },
}

export default function GlobalSearch({ placeholder = 'Search Ereuna…', style }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)
  const debounceRef           = useRef(null)
  const containerRef          = useRef(null)
  const navigate              = useNavigate()

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const hits = await searchRepositories({ q: query.trim(), limit: 8 })
        setResults(hits)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 280)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(hit) {
    const meta = TYPE_LABELS[hit.repository_type] || TYPE_LABELS.MODEL
    // Use the slug field as the page ID; fall back to id
    const id = hit.slug || hit.id
    navigate(`${meta.path}/${id}`)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0])
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          color: '#5f6670', fontSize: 14, pointerEvents: 'none',
        }}>⌕</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          style={{
            fontFamily: 'inherit', fontSize: 14, width: '100%', boxSizing: 'border-box',
            padding: '10px 14px 10px 36px', borderRadius: 10,
            border: '1.4px solid #c9c4b8', background: '#fff', outline: 'none',
            boxShadow: open ? '0 0 0 3px rgba(207,90,42,.12)' : 'none',
            transition: 'box-shadow .15s',
          }}
        />
        {loading && (
          <span style={{
            position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
            color: '#5f6670', fontSize: 11,
          }}>…</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, overflow: 'hidden',
        }}>
          {results.map((hit, i) => {
            const meta = TYPE_LABELS[hit.repository_type] || TYPE_LABELS.MODEL
            return (
              <div
                key={hit.id || i}
                onClick={() => handleSelect(hit)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 16px', cursor: 'pointer',
                  borderBottom: i < results.length - 1 ? '1px solid #efebe2' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <span style={{
                  display: 'inline-block', padding: '2px 7px', borderRadius: 6, fontSize: 10,
                  fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600,
                  background: meta.color + '18', color: meta.color, flexShrink: 0,
                }}>{meta.label}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#17202e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {hit.slug}
                  </div>
                  {hit.description && (
                    <div style={{ fontSize: 12, color: '#5f6670', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hit.description}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, flexShrink: 0, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#5f6670' }}>
                  <span>★ {hit.star_count ?? 0}</span>
                  <span>↓ {hit.download_count ?? 0}</span>
                </div>
              </div>
            )
          })}

          <div style={{
            padding: '9px 16px', borderTop: '1px solid #efebe2',
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#5f6670',
          }}>
            Press Enter to open first result · Esc to close
          </div>
        </div>
      )}

      {open && results.length === 0 && !loading && query.trim() && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12,
          padding: '16px', textAlign: 'center', fontSize: 13, color: '#5f6670',
          boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 200,
        }}>
          No results for "{query}"
        </div>
      )}
    </div>
  )
}
