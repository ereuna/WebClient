/**
 * UploadFilesPage — /models/:slug/upload  and  /datasets/:slug/upload
 *
 * Drag-and-drop file upload that creates a commit in the repository.
 * Works for both MODEL and DATASET repo types.
 *
 * URL params:  slug  (the repository slug)
 * Router state (optional):  { repoId, justCreated }  passed from NewRepositoryPage
 *   on creation redirect so we can skip the repo-fetch round-trip.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { createCommit, listRepositories } from '../api/repositories.js'

const ACCENT = '#cf5a2a'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`
  return `${(n / 1024 ** 3).toFixed(2)} GB`
}

const EXT_ICONS = {
  csv: '📊', parquet: '📊', tsv: '📊',
  json: '📋', jsonl: '📋',
  nc: '🌐', h5: '🔬', hdf5: '🔬',
  pkl: '⚙️', pt: '⚙️', ckpt: '⚙️', bin: '⚙️', safetensors: '⚙️',
  py: '🐍', yaml: '📄', yml: '📄', toml: '📄',
  md: '📝', txt: '📝', pdf: '📑',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', svg: '🖼️',
  zip: '🗜️', tar: '🗜️', gz: '🗜️',
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  return EXT_ICONS[ext] || '📄'
}

// ── File list item ─────────────────────────────────────────────────────────────

function FileItem({ file, onRemove, status }) {
  const STATUS_COLOR = { pending: '#a09990', uploading: ACCENT, done: '#2db88a', error: '#e74c3c' }
  const STATUS_LABEL = { pending: '—', uploading: 'Uploading…', done: '✓', error: '✗' }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '11px 16px', borderBottom: '1px solid #f0ebe0',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{fileIcon(file.name)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: '#1b1a17',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {file.name}
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990', marginTop: 2 }}>
          {fmtBytes(file.size)}
        </div>
      </div>
      <span style={{
        fontFamily: "'Space Mono',monospace", fontSize: 11,
        color: STATUS_COLOR[status] || '#a09990', flexShrink: 0,
      }}>
        {STATUS_LABEL[status] || '—'}
      </span>
      {status === 'pending' && (
        <button
          type="button"
          onClick={() => onRemove(file)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#c0b8b0', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0,
          }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function UploadFilesPage() {
  const { slug } = useParams()
  const { state: routerState } = useLocation()
  const navigate = useNavigate()
  const { user, loading: authLoading, authenticated } = useAuth()

  // Repo info — comes either from router state (just created) or fetched
  const [repoId, setRepoId]     = useState(routerState?.repoId || null)
  const [repoInfo, setRepoInfo] = useState(null)
  const [repoLoading, setRepoLoading] = useState(!routerState?.repoId)

  // Upload state
  const [files, setFiles]           = useState([])           // File[]
  const [fileStatuses, setFileStatuses] = useState({})       // name → status
  const [message, setMessage]       = useState('Upload files')
  const [branch, setBranch]         = useState('main')
  const [dragging, setDragging]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [done, setDone]             = useState(false)

  const dropRef = useRef(null)
  const inputRef = useRef(null)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user && !authenticated) navigate('/login', { replace: true })
  }, [user, authenticated, authLoading, navigate])

  // Fetch repo info if not passed via router state
  useEffect(() => {
    if (repoId) { setRepoLoading(false); return }
    listRepositories({ limit: 200 }).then(repos => {
      const repo = (repos || []).find(r => r.slug === slug)
      if (repo) { setRepoId(repo.id); setRepoInfo(repo) }
      setRepoLoading(false)
    }).catch(() => setRepoLoading(false))
  }, [slug, repoId])

  // Drag events
  const onDragOver = useCallback(e => { e.preventDefault(); setDragging(true) }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])
  const onDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    addFiles([...e.dataTransfer.files])
  }, [])

  function addFiles(incoming) {
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name))
      const fresh = incoming.filter(f => !names.has(f.name))
      return [...prev, ...fresh]
    })
  }

  function removeFile(file) {
    setFiles(prev => prev.filter(f => f.name !== file.name))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!files.length) { setError('Add at least one file.'); return }
    if (!repoId) { setError('Repository not found.'); return }
    setSubmitting(true)
    setError('')

    // Mark all as uploading
    const statuses = {}
    files.forEach(f => { statuses[f.name] = 'uploading' })
    setFileStatuses(statuses)

    try {
      await createCommit(repoId, { message, branch, files })
      const final = {}
      files.forEach(f => { final[f.name] = 'done' })
      setFileStatuses(final)
      setDone(true)
    } catch (err) {
      const failed = {}
      files.forEach(f => { failed[f.name] = 'error' })
      setFileStatuses(failed)
      setError(err.message || 'Upload failed.')
    } finally {
      setSubmitting(false)
    }
  }

  // Resolve the detail page path
  const isDataset = repoInfo?.repo_type === 'DATASET' ||
    (routerState && !routerState.repoId /* fallback heuristic via URL */) ||
    window.location.pathname.startsWith('/datasets')
  const detailPath = isDataset ? `/datasets/${slug}` : `/models/${slug}`
  const sectionLabel = isDataset ? 'DATASET REPOSITORY' : 'MODEL REPOSITORY'

  if (authLoading || repoLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#8a857a' }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd', padding: '44px 28px 36px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
            color: '#a09990', marginBottom: 14, display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <Link to={isDataset ? '/datasets' : '/models'} style={{ color: '#a09990', textDecoration: 'none' }}>
              {isDataset ? 'Datasets' : 'Models'}
            </Link>
            <span>›</span>
            <Link to={detailPath} style={{ color: '#a09990', textDecoration: 'none' }}>{slug}</Link>
            <span>›</span>
            <span style={{ color: '#1b1a17' }}>Upload files</span>
          </div>

          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em', color: ACCENT, marginBottom: 12, textTransform: 'uppercase' }}>
            {sectionLabel}
          </div>
          <h1 style={{ fontSize: 34, letterSpacing: '-0.03em', fontWeight: 700, margin: 0 }}>
            {routerState?.justCreated ? '🎉 Repository created — upload your files' : `Upload files to ${slug}`}
          </h1>
          <p style={{ fontSize: 14.5, color: '#56524a', marginTop: 12, lineHeight: 1.6, maxWidth: 560 }}>
            Files are stored in MinIO and versioned as a commit. You can add more files or update them anytime.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 760, margin: '36px auto', padding: '0 28px 80px' }}>

        {done ? (
          /* ── Success state ── */
          <div style={{
            background: '#fff', border: '1.5px solid #b8ead8', borderRadius: 14,
            padding: '32px 28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Files uploaded successfully</div>
            <div style={{ fontSize: 14, color: '#56524a', marginBottom: 24 }}>
              {files.length} file{files.length !== 1 ? 's' : ''} committed to <code style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{branch}</code>.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link
                to={detailPath}
                style={{
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  padding: '11px 22px', borderRadius: 10, textDecoration: 'none',
                  background: '#1b1a17', color: '#f1ede4',
                }}
              >
                View repository →
              </Link>
              <button
                onClick={() => { setFiles([]); setFileStatuses({}); setDone(false); setMessage('Upload files') }}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '11px 22px', borderRadius: 10,
                  border: '1.4px solid #ddd6c8', background: '#fff', cursor: 'pointer', color: '#56524a',
                }}
              >
                Upload more files
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ── Drop zone ── */}
            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? ACCENT : '#ddd6c8'}`,
                borderRadius: 14, background: dragging ? '#fff8f4' : '#faf7f0',
                padding: '48px 24px', textAlign: 'center',
                cursor: 'pointer', transition: 'border-color .15s, background .15s',
                marginBottom: 24,
              }}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={e => addFiles([...e.target.files])}
              />
              <div style={{ fontSize: 32, marginBottom: 12 }}>⬆</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1b1a17', marginBottom: 6 }}>
                Drag and drop files here
              </div>
              <div style={{ fontSize: 13.5, color: '#8a857a', lineHeight: 1.6 }}>
                or <span style={{ color: ACCENT, fontWeight: 500 }}>click to browse</span>
                <br />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11 }}>
                  .parquet  .csv  .json  .pkl  .pt  .safetensors  .nc  .h5  .yaml  .md  …
                </span>
              </div>
            </div>

            {/* ── File list ── */}
            {files.length > 0 && (
              <div style={{
                background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12,
                overflow: 'hidden', marginBottom: 24,
              }}>
                <div style={{
                  padding: '12px 16px', borderBottom: '1px solid #f0ebe0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#8a857a', letterSpacing: '0.06em' }}>
                    {files.length} FILE{files.length !== 1 ? 'S' : ''} QUEUED
                  </span>
                  {!submitting && (
                    <button
                      type="button"
                      onClick={() => { setFiles([]); setFileStatuses({}) }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, color: '#a09990', fontFamily: 'inherit',
                      }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {files.map(f => (
                  <FileItem
                    key={f.name}
                    file={f}
                    onRemove={removeFile}
                    status={fileStatuses[f.name] || 'pending'}
                  />
                ))}
              </div>
            )}

            {/* ── Commit options ── */}
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '20px 20px', marginBottom: 24 }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
                color: ACCENT, marginBottom: 16, textTransform: 'uppercase',
              }}>
                Commit details
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#56524a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Commit message
                </div>
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe what you're uploading…"
                  style={{
                    fontFamily: 'inherit', fontSize: 14, width: '100%', boxSizing: 'border-box',
                    padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
                    background: '#faf7f0', outline: 'none', color: '#1b1a17',
                  }}
                />
              </div>

              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#56524a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Branch
                </div>
                <input
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  placeholder="main"
                  style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 13, width: '100%', boxSizing: 'border-box',
                    padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
                    background: '#faf7f0', outline: 'none', color: '#1b1a17',
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fdf2f0', border: '1px solid #f5c0b0', borderRadius: 9,
                padding: '12px 16px', fontSize: 13.5, color: '#c0392b', marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={submitting || !files.length}
                style={{
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  padding: '12px 28px', borderRadius: 10, border: 'none',
                  background: submitting || !files.length ? '#d0c8bc' : '#1b1a17',
                  color: submitting || !files.length ? '#8a857a' : '#f1ede4',
                  cursor: submitting || !files.length ? 'not-allowed' : 'pointer',
                  transition: 'background .15s',
                }}
              >
                {submitting ? 'Uploading…' : `Commit ${files.length ? files.length + ' ' : ''}file${files.length !== 1 ? 's' : ''} →`}
              </button>
              <Link
                to={detailPath}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '12px 20px', borderRadius: 10,
                  border: '1.4px solid #ddd6c8', background: '#fff', color: '#56524a',
                  textDecoration: 'none', display: 'flex', alignItems: 'center',
                }}
              >
                {routerState?.justCreated ? 'Skip for now' : 'Cancel'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
