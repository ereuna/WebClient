import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getRepositoryBySlug,
  listCommits,
  listFiles,
  listReleases,
} from '../api/repositories'
import StarButton from '../components/StarButton'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BG = '#fff'
const CARD_BORDER = '1px solid #e7e0d2'
const CARD_RADIUS = 14

const TABS = ['Overview', 'Files', 'Versions']

function timeSince(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1) return 'today'
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

function formatBytes(n) {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function TabBar({ activeTab, onTab }) {
  return (
    <div style={{ borderBottom: '1px solid #e3dccd', background: BG, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTab(tab)}
            style={{
              fontFamily: 'inherit', fontSize: 13.5, padding: '14px 18px', background: 'none', border: 'none',
              borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
              color: activeTab === tab ? DARK : MEDIUM, fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: CARD_RADIUS, ...style }}>
      {children}
    </div>
  )
}

function OverviewTab({ repo }) {
  const m = repo.metadata || {}
  const readme = m.readme || m.long_description || repo.description || 'No description provided.'
  const topics = m.tags || m.topics || []

  return (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card style={{ padding: '28px 32px' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: ACCENT, marginBottom: 14, textTransform: 'uppercase' }}>About</div>
          <p style={{ fontSize: 14, color: MEDIUM, lineHeight: 1.72, margin: 0, whiteSpace: 'pre-wrap' }}>{readme}</p>
        </Card>
      </div>
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {topics.length > 0 && (
          <Card style={{ padding: '20px' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: ACCENT, marginBottom: 14, textTransform: 'uppercase' }}>Topics</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {topics.map(t => (
                <span key={t} style={{ padding: '4px 10px', borderRadius: 20, background: '#f5f0e8', fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </Card>
        )}
        {m.license && (
          <Card style={{ padding: '20px' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: ACCENT, marginBottom: 14, textTransform: 'uppercase' }}>License</div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.license}</div>
          </Card>
        )}
      </div>
    </div>
  )
}

function FilesTab({ files, latestCommit }) {
  if (!files?.length) {
    return (
      <Card style={{ padding: 40, textAlign: 'center', color: MUTED }}>
        No files yet. Upload files to create the first commit.
      </Card>
    )
  }
  return (
    <Card>
      {latestCommit && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0ebe0', background: '#faf7f0', fontSize: 12, color: MUTED }}>
          Latest commit: {latestCommit.message} ({latestCommit.sha?.slice(0, 7)})
        </div>
      )}
      {files.map((f, i) => (
        <div key={f.path || f.id} style={{
          display: 'flex', padding: '11px 20px',
          borderBottom: i < files.length - 1 ? '1px solid #f5f0e8' : 'none',
        }}>
          <span style={{ flex: 1, fontSize: 13.5 }}>{f.path}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>{formatBytes(f.size_bytes)}</span>
        </div>
      ))}
    </Card>
  )
}

function VersionsTab({ releases }) {
  if (!releases?.length) {
    return (
      <Card style={{ padding: 40, textAlign: 'center', color: MUTED }}>
        No releases yet.
      </Card>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {releases.map((v, i) => (
        <Card key={v.id || v.tag} style={{ padding: '22px 26px' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: i === 0 ? ACCENT : DARK }}>
            {v.tag || v.version || v.name}
          </div>
          {v.notes && <p style={{ fontSize: 13.5, color: MEDIUM, marginTop: 10 }}>{v.notes}</p>}
          <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>{timeSince(v.created_at)}</div>
        </Card>
      ))}
    </div>
  )
}

export default function RepositoryDetailPage() {
  const { owner, repo: repoSlug } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const [repo, setRepo] = useState(null)
  const [commits, setCommits] = useState([])
  const [files, setFiles] = useState([])
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getRepositoryBySlug(owner, repoSlug)
      .then(async (r) => {
        setRepo(r)
        const [commitList, releaseList] = await Promise.all([
          listCommits(r.id).catch(() => []),
          listReleases(r.id).catch(() => []),
        ])
        setCommits(commitList || [])
        setReleases(releaseList || [])
        const latest = commitList?.[0]
        if (latest?.sha) {
          const fileList = await listFiles(r.id, latest.sha).catch(() => [])
          setFiles(fileList || [])
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [owner, repoSlug])

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED }}>Loading repository…</div>
  }

  if (error || !repo) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ color: '#c0392b' }}>{error || 'Repository not found'}</div>
        <Link to="/repositories" style={{ color: ACCENT }}>← Back to repositories</Link>
      </div>
    )
  }

  const visibility = (repo.visibility || 'public').toLowerCase()
  const repoType = repo.repo_type || 'MODEL'

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 18 }}>
            <Link to="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
            <span> › </span>
            <Link to="/repositories" style={{ color: MUTED, textDecoration: 'none' }}>Repositories</Link>
            <span> › {owner}/{repoSlug}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '4px 10px', borderRadius: 20, background: '#2db88a18', color: '#2db88a', fontWeight: 700, textTransform: 'uppercase' }}>{visibility}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '4px 10px', borderRadius: 20, background: '#7c6af718', color: '#7c6af7', fontWeight: 700, textTransform: 'uppercase' }}>{repoType}</span>
              </div>
              <h1 style={{ fontSize: 38, fontWeight: 700, margin: 0, color: DARK }}>
                {owner}<span style={{ color: MUTED, fontWeight: 300 }}>/</span>{repoSlug}
              </h1>
              <p style={{ fontSize: 15, color: MEDIUM, marginTop: 12, maxWidth: 520, lineHeight: 1.6 }}>{repo.description || '—'}</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap', fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
                <span>⭐ {repo.star_count ?? 0} stars</span>
                <span>↓ {repo.download_count ?? 0} downloads</span>
                <span>📅 Updated {timeSince(repo.updated_at)}</span>
              </div>
            </div>
            <StarButton repoId={repo.id} initialCount={repo.star_count ?? 0} />
          </div>
        </div>
      </div>

      <TabBar activeTab={activeTab} onTab={setActiveTab} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 80px' }}>
        {activeTab === 'Overview' && <OverviewTab repo={repo} />}
        {activeTab === 'Files' && <FilesTab files={files} latestCommit={commits[0]} />}
        {activeTab === 'Versions' && <VersionsTab releases={releases} />}
      </div>
    </div>
  )
}
