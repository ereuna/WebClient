import { getPresignedUrl } from '../../api/repositories'

function fmtBytes(n) {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

async function handleDownload(repoId, commitSha, path) {
  const { url } = await getPresignedUrl(repoId, commitSha, path)
  window.open(url, '_blank')
}

/**
 * Lists every file committed to a dataset's repository (schema/profile/validation
 * artifacts alongside the actual data files), each downloadable via a presigned URL.
 */
export default function DatasetFilesList({ files, repoId, commitSha }) {
  if (!files?.length) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
      {files.map((f, i) => (
        <button
          key={f.path || i}
          onClick={() => handleDownload(repoId, commitSha, f.path)}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', gap: 12,
            padding: '11px 18px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: i < files.length - 1 ? '1px solid #f0ebe0' : 'none',
            fontFamily: 'inherit', textAlign: 'left',
          }}
        >
          <span style={{ flex: 1, fontSize: 13.5, color: '#1b1a17' }}>{f.path}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a' }}>{fmtBytes(f.size_bytes)}</span>
          <span style={{ fontSize: 13, color: '#cf5a2a' }}>↓</span>
        </button>
      ))}
    </div>
  )
}
