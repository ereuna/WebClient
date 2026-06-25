import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'

const MOCK_REPOS = [
  { id: 'repo-001', name: 'aether-trainer', owner: 'TomiTsuma', type: 'MODEL', description: 'Lightweight training loop library for Aether models.', stars: 312, forks: 48, lastUpdated: '2h ago', tags: ['training', 'pytorch'], visibility: 'public' },
  { id: 'repo-002', name: 'swahili-nlp-toolkit', owner: 'TomiTsuma', type: 'DATASET', description: 'NLP utilities and corpora for Swahili language processing.', stars: 89, forks: 14, lastUpdated: '1d ago', tags: ['nlp', 'swahili', 'africa'], visibility: 'public' },
  { id: 'repo-003', name: 'geothermal-pinn', owner: 'aether-ai', type: 'MODEL', description: 'Physics-informed neural network for geothermal reservoir simulation.', stars: 540, forks: 76, lastUpdated: '3d ago', tags: ['pinn', 'geothermal', 'physics'], visibility: 'public' },
  { id: 'repo-004', name: 'energy-forecasting-dataset', owner: 'data-team', type: 'DATASET', description: 'Time-series energy demand dataset for 50 countries, 2010–2025.', stars: 203, forks: 31, lastUpdated: '1w ago', tags: ['energy', 'time-series', 'forecasting'], visibility: 'public' },
  { id: 'repo-005', name: 'bert-multilingual-ner', owner: 'TomiTsuma', type: 'MODEL', description: 'NER model supporting 18 African languages fine-tuned from mBERT.', stars: 167, forks: 22, lastUpdated: '2w ago', tags: ['ner', 'multilingual', 'bert'], visibility: 'public' },
  { id: 'repo-006', name: 'vision-transformer-experiments', owner: 'research-lab', type: 'MODEL', description: 'Collection of ViT experiments with ablations on ImageNet variants.', stars: 95, forks: 11, lastUpdated: '3w ago', tags: ['vit', 'vision', 'experiments'], visibility: 'private' },
]

function TypeBadge({ type }) {
  const isModel = type === 'MODEL'
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 7,
      background: isModel ? '#dbeafe' : '#dcfce7',
      color: isModel ? '#1d4ed8' : '#166534',
      fontFamily: "'Space Mono',monospace",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {type}
    </span>
  )
}

function TagPill({ label }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: 6,
      background: '#f5f0e8',
      color: '#7a7568',
      fontFamily: "'Space Mono',monospace",
      fontSize: 10,
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

function RepoCard({ repo }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid #e7e0d2',
        borderRadius: 14,
        padding: '20px 24px',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        transition: 'box-shadow .15s',
        boxShadow: hovered ? '0 3px 14px rgba(0,0,0,.07)' : 'none',
      }}
    >
      <div style={{ paddingTop: 2, flexShrink: 0 }}>
        <TypeBadge type={repo.type} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
          <Link
            to="/repositories"
            style={{ textDecoration: 'none', color: DARK }}
          >
            <span style={{
              fontSize: 15.5,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}>
              {repo.owner}/<span style={{ color: ACCENT }}>{repo.name}</span>
            </span>
          </Link>
          {repo.visibility === 'private' && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid #e7e0d2',
              background: '#faf7f0',
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              color: MUTED,
            }}>
              🔒 Private
            </span>
          )}
        </div>

        <p style={{
          fontSize: 13.5,
          color: MEDIUM,
          margin: '0 0 12px',
          lineHeight: 1.55,
        }}>
          {repo.description}
        </p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {repo.tags.map(t => <TagPill key={t} label={t} />)}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 7,
        flexShrink: 0,
        minWidth: 110,
      }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            color: MUTED,
          }}>
            ⭐ {repo.stars.toLocaleString()}
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            color: MUTED,
          }}>
            🍴 {repo.forks}
          </span>
        </div>
        <span style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 10,
          color: '#b0a898',
          whiteSpace: 'nowrap',
        }}>
          Updated {repo.lastUpdated}
        </span>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { key: 'stars', label: 'Most stars' },
  { key: 'updated', label: 'Recently updated' },
  { key: 'forks', label: 'Most forks' },
]

const UPDATED_ORDER = ['2h ago', '1d ago', '3d ago', '1w ago', '2w ago', '3w ago']

export default function RepositoriesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [visibilityFilter, setVisibilityFilter] = useState('ALL')
  const [sort, setSort] = useState('stars')

  const filtered = useMemo(() => {
    let list = MOCK_REPOS.filter(r => {
      const q = search.trim().toLowerCase()
      if (q && !r.name.toLowerCase().includes(q) && !r.owner.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false
      if (typeFilter !== 'ALL' && r.type !== typeFilter) return false
      if (visibilityFilter !== 'ALL' && r.visibility !== visibilityFilter.toLowerCase()) return false
      return true
    })

    if (sort === 'stars') list = [...list].sort((a, b) => b.stars - a.stars)
    else if (sort === 'forks') list = [...list].sort((a, b) => b.forks - a.forks)
    else if (sort === 'updated') list = [...list].sort((a, b) => UPDATED_ORDER.indexOf(a.lastUpdated) - UPDATED_ORDER.indexOf(b.lastUpdated))

    return list
  }, [search, typeFilter, visibilityFilter, sort])

  return (
    <div style={{ minHeight: '100vh', background: '#f1ede4' }}>
      <PageHero
        eyebrow="AETHER ML PLATFORM"
        title="Repositories"
        description={`${MOCK_REPOS.length} repositories — models, datasets, and utilities from the Aether community.`}
        illustration={PAGE_ILLUSTRATIONS.repositories}
        illustrationAlt="Repositories illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 28px 80px' }}>
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <span style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              color: MUTED,
              fontSize: 14,
              pointerEvents: 'none',
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search repositories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px 10px 36px',
                borderRadius: 10,
                border: '1.4px solid #d8d1c2',
                background: '#fff',
                fontSize: 14,
                color: DARK,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 3, background: '#fff', border: '1.4px solid #d8d1c2', borderRadius: 10, padding: 3 }}>
            {['ALL', 'MODEL', 'DATASET'].map(opt => (
              <button
                key={opt}
                onClick={() => setTypeFilter(opt)}
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  padding: '7px 13px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  background: typeFilter === opt ? DARK : 'transparent',
                  color: typeFilter === opt ? '#f1ede4' : MUTED,
                  fontWeight: typeFilter === opt ? 700 : 400,
                  transition: 'background .12s, color .12s',
                }}
              >
                {opt === 'ALL' ? 'All types' : opt}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 3, background: '#fff', border: '1.4px solid #d8d1c2', borderRadius: 10, padding: 3 }}>
            {['ALL', 'PUBLIC', 'PRIVATE'].map(opt => (
              <button
                key={opt}
                onClick={() => setVisibilityFilter(opt)}
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  padding: '7px 13px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  background: visibilityFilter === opt ? DARK : 'transparent',
                  color: visibilityFilter === opt ? '#f1ede4' : MUTED,
                  fontWeight: visibilityFilter === opt ? 700 : 400,
                  transition: 'background .12s, color .12s',
                }}
              >
                {opt === 'ALL' ? 'All' : opt.charAt(0) + opt.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1.5px solid #e7e0d2',
          marginBottom: 24,
        }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: '0.03em',
                padding: '10px 18px',
                border: 'none',
                borderBottom: sort === opt.key ? `2px solid ${ACCENT}` : '2px solid transparent',
                background: 'transparent',
                color: sort === opt.key ? ACCENT : MUTED,
                fontWeight: sort === opt.key ? 700 : 400,
                cursor: 'pointer',
                marginBottom: '-1.5px',
                transition: 'color .12s',
                textTransform: 'uppercase',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{
            padding: '64px 0',
            textAlign: 'center',
            color: MUTED,
            fontFamily: "'Space Mono',monospace",
            fontSize: 13,
          }}>
            No repositories match your filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{
            marginTop: 28,
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            color: '#b0a898',
            letterSpacing: '0.04em',
          }}>
            SHOWING {filtered.length} OF {MOCK_REPOS.length} REPOSITORIES
          </div>
        )}
      </div>
    </div>
  )
}
