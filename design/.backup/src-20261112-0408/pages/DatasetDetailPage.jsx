import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchDataset, fetchRelatedDatasets, DOMAIN_COLORS, invalidateDatasetsCache } from '../api/datasets'
import { fetchDatasetRepoArtifacts } from '../api/repoFiles'
import { updateRepository } from '../api/repositories.js'
import { DOMAIN_ILLUSTRATIONS, getIllustrationById } from '../lib/illustrations'
import IllustrationPicker from '../components/IllustrationPicker.jsx'
import Modal from '../components/Modal.jsx'
import { fetchRelatedModels } from '../api/models'
import CodeBlock from '../components/CodeBlock'
import StarButton from '../components/StarButton'
import RepoReadme from '../components/model/RepoReadme'
import SchemaTable from '../components/dataset/SchemaTable'
import DatasetFilesList from '../components/dataset/DatasetFilesList'
import DatasetSchemaFiles from '../components/dataset/DatasetSchemaFiles'
import DatasetProfileCard from '../components/dataset/DatasetProfileCard'
import DatasetValidationCard from '../components/dataset/DatasetValidationCard'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#cf5a2a'
const DOT_BG = 'radial-gradient(#e7e0d1 1px,transparent 1px)'

const FORMAT_COLORS = {
  Parquet: '#7c6af7',
  JSON: '#3498db',
  NetCDF: '#2db88a',
  CSV: '#e67e22',
  HDF5: '#e91e8c',
}

function DomainChip({ domain }) {
  const color = DOMAIN_COLORS[domain] || '#8a857a'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {domain}
    </span>
  )
}

function LicenseBadge({ license }) {
  const restricted = license === 'Restricted'
  return (
    <span style={{
      display: 'inline-block', padding: '4px 10px', borderRadius: 20,
      border: `1px solid ${restricted ? '#e67e2240' : '#e7e0d2'}`,
      background: restricted ? '#e67e2210' : '#faf7f0',
      color: restricted ? '#e67e22' : '#8a857a',
      fontFamily: "'Space Mono',monospace", fontSize: 11,
    }}>
      {license}
    </span>
  )
}

function FormatBadge({ format }) {
  const color = FORMAT_COLORS[format] || '#8a857a'
  return (
    <span style={{
      display: 'inline-block', padding: '4px 10px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11,
    }}>
      {format}
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

function CoverageRow({ k, v }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '10px 0',
      borderBottom: '1px solid #f0ebe0', fontSize: 13.5,
    }}>
      <div style={{ width: 160, flexShrink: 0, color: '#8a857a', fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{k}</div>
      <div style={{ color: '#1b1a17', lineHeight: 1.5 }}>{v}</div>
    </div>
  )
}

function RelatedModelCard({ model }) {
  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#faf7f0', border: '1px solid #e7e0d2', borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{model.title}</div>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 9, padding: '2px 6px',
            borderRadius: 5, border: '1px solid #e7e0d2', color: '#8a857a', whiteSpace: 'nowrap',
          }}>{model.family}</span>
        </div>
        <div style={{ fontSize: 12, color: '#8a857a', marginTop: 5, lineHeight: 1.45 }}>
          {model.desc.slice(0, 72)}…
        </div>
      </div>
    </Link>
  )
}

function RelatedDatasetCard({ dataset }) {
  return (
    <Link to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#faf7f0', border: '1px solid #e7e0d2', borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{dataset.title}</div>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 9, padding: '2px 6px',
            borderRadius: 5,
            background: (DOMAIN_COLORS[dataset.domain] || '#8a857a') + '18',
            color: DOMAIN_COLORS[dataset.domain] || '#8a857a',
            whiteSpace: 'nowrap',
          }}>{dataset.domain}</span>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#a09990', marginTop: 6 }}>
          {dataset.rows} rows · {dataset.size}
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
          <div style={{ height: 36, width: 300, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 480, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[140, 280, 200, 220].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[120, 80, 90].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DatasetDetailPage() {
  const { datasetId } = useParams()
  const { user, authenticated } = useAuth()
  const [dataset, setDataset] = useState(null)
  const [relatedDatasets, setRelatedDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [relatedModels, setRelatedModels] = useState([])
  const [repoArtifacts, setRepoArtifacts] = useState(null)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingIllustration, setPendingIllustration] = useState(null)
  const [savingIllustration, setSavingIllustration] = useState(false)
  const [illustrationError, setIllustrationError] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setRepoArtifacts(null)
    fetchDataset(datasetId).then(async data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setDataset(data)
      const [ds, ms, artifacts] = await Promise.all([
        fetchRelatedDatasets(data.relatedDatasetIds),
        fetchRelatedModels(data.relatedModelIds),
        data._repoId ? fetchDatasetRepoArtifacts(data._repoId) : Promise.resolve(null),
      ])
      setRelatedDatasets(ds)
      setRelatedModels(ms)
      setRepoArtifacts(artifacts)
      setLoading(false)
    })
  }, [datasetId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: '#8a857a' }}>Dataset not found.</div>
        <Link to="/datasets" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Datasets</Link>
      </div>
    )
  }

  const { title, domain, format, license, desc, longDesc, size, rows, downloads, updated, version,
    coverage, schema, collection, usageNotes, codeSnippet } = dataset

  const { readme, schema: repoSchema, profile, validation, files, commitSha } = repoArtifacts || {}

  const heroIllustrationSrc = (dataset.illustration && getIllustrationById(dataset.illustration)?.src) || DOMAIN_ILLUSTRATIONS[domain] || null
  const isOwner = Boolean(user && dataset.ownerUserId && user.id === dataset.ownerUserId)

  function openIllustrationPicker() {
    setPendingIllustration(dataset.illustration || null)
    setIllustrationError('')
    setPickerOpen(true)
  }

  async function handleSaveIllustration() {
    if (!pendingIllustration || !dataset._repoId) return
    setSavingIllustration(true)
    setIllustrationError('')
    try {
      await updateRepository(dataset._repoId, { metadata: { illustration: pendingIllustration } })
      invalidateDatasetsCache()
      setDataset(d => ({ ...d, illustration: pendingIllustration }))
      setPickerOpen(false)
    } catch (err) {
      setIllustrationError(err.message || 'Failed to update illustration.')
    } finally {
      setSavingIllustration(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero header ── */}
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/datasets" style={{ color: '#8a857a', textDecoration: 'none' }}>Datasets</Link>
            <span>›</span>
            <span style={{ color: '#1b1a17' }}>{title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              {/* Chips */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <DomainChip domain={domain} />
                <FormatBadge format={format} />
                <LicenseBadge license={license} />
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '4px 9px',
                  borderRadius: 20, border: '1px solid #e7e0d2', color: '#8a857a', background: '#faf7f0',
                }}>v{version}</span>
              </div>

              <h1 style={{ fontSize: 42, letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1.06, margin: 0 }}>
                {title}
              </h1>
              <p style={{ fontSize: 15.5, color: '#56524a', marginTop: 12, maxWidth: 560, lineHeight: 1.6 }}>
                {desc}
              </p>

              <div style={{ display: 'flex', gap: 14, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                <StatPill icon="↓" label={`${downloads} downloads`} />
                <StatPill icon="⬢" label={`${rows} rows`} />
                <StatPill icon="◉" label={size} />
                <StatPill icon="↺" label={`Updated ${updated}`} />
                <StarButton repoId={dataset._repoId} initialCount={0} />
              </div>
            </div>

            {/* CTA + illustration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 200, maxWidth: 280 }}>
              {(heroIllustrationSrc || isOwner) && (
                <div style={{ position: 'relative' }}>
                  {heroIllustrationSrc ? (
                    <img
                      src={heroIllustrationSrc}
                      alt={`${domain} illustration`}
                      style={{ width: '100%', borderRadius: 12, display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', aspectRatio: '16/10', borderRadius: 12,
                      background: '#f5f0e8', border: '1.4px dashed #ddd6c8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#a09990',
                    }}>
                      No illustration
                    </div>
                  )}
                  {isOwner && (
                    <button
                      onClick={openIllustrationPicker}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        fontFamily: 'inherit', fontSize: 11, padding: '5px 10px', borderRadius: 7,
                        border: 'none', background: 'rgba(27,26,23,.72)', color: '#fff', cursor: 'pointer',
                      }}
                    >
                      {heroIllustrationSrc ? 'Change illustration' : 'Add illustration'}
                    </button>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/docs"
                style={{
                  display: 'block', fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: 'none', background: '#1b1a17', color: '#f1ede4', fontWeight: 500,
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Download ↓
              </Link>
              <button
                onClick={() => document.getElementById('usage-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: '1.4px solid #ddd6c8', background: '#fff', color: '#1b1a17', fontWeight: 500, cursor: 'pointer',
                }}
              >
                Query via API
              </button>
              {(user || authenticated) && dataset?._repoId && (
                <Link
                  to={`/datasets/${datasetId}/upload`}
                  style={{
                    fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                    border: `1.4px solid ${ACCENT}`, color: ACCENT, fontWeight: 500,
                    textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap',
                  }}
                >
                  Upload files ↑
                </Link>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Choose a card illustration"
        footer={
          <>
            <button
              onClick={() => setPickerOpen(false)}
              style={{
                fontFamily: 'inherit', fontSize: 14, padding: '10px 20px', borderRadius: 10,
                border: '1.4px solid #ddd6c8', background: '#fff', color: '#56524a', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveIllustration}
              disabled={savingIllustration || !pendingIllustration}
              style={{
                fontFamily: 'inherit', fontSize: 14, fontWeight: 500, padding: '10px 20px', borderRadius: 10,
                border: 'none',
                background: savingIllustration || !pendingIllustration ? '#d0c8bc' : '#1b1a17',
                color: savingIllustration || !pendingIllustration ? '#8a857a' : '#f1ede4',
                cursor: savingIllustration || !pendingIllustration ? 'not-allowed' : 'pointer',
              }}
            >
              {savingIllustration ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        {illustrationError && (
          <div style={{
            background: '#fdf2f0', border: '1px solid #f5c0b0', borderRadius: 9,
            padding: '10px 14px', fontSize: 13, color: '#c0392b', marginBottom: 16,
          }}>
            {illustrationError}
          </div>
        )}
        <IllustrationPicker value={pendingIllustration} onChange={setPendingIllustration} />
      </Modal>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 80px', display: 'flex', gap: 36, alignItems: 'flex-start' }}>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* README from repository */}
          {readme && (
            <SectionCard label="README">
              <RepoReadme content={readme} />
            </SectionCard>
          )}

          {/* About — fallback when repository has no README.md */}
          {!readme && (
            <SectionCard label="About">
              <p style={{ fontSize: 14.5, color: '#3b3830', lineHeight: 1.7, margin: 0 }}>{longDesc}</p>
            </SectionCard>
          )}

          {/* Files committed to the repository */}
          {files?.length > 0 && (
            <SectionCard label={`Files — ${files.length}`}>
              <DatasetFilesList files={files} repoId={repoArtifacts.repoId} commitSha={commitSha} />
            </SectionCard>
          )}

          {/* Coverage */}
          {Object.keys(coverage).length > 0 && (
            <SectionCard label="Coverage">
              <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 8, background: '#faf7f0', backgroundImage: DOT_BG, backgroundSize: '14px 14px', borderBottom: '1px solid #ece5d6' }} />
                <div style={{ padding: '2px 20px 8px' }}>
                  {Object.entries(coverage).map(([k, v]) => (
                    <CoverageRow key={k} k={k.replace(/([A-Z])/g, ' $1').toLowerCase()} v={v} />
                  ))}
                </div>
              </div>
            </SectionCard>
          )}

          {/* Schema — from repo schema.json (grouped per data file) or metadata fallback */}
          {repoSchema?.files ? (
            <SectionCard label="Schema">
              <DatasetSchemaFiles schema={repoSchema} />
            </SectionCard>
          ) : schema?.length > 0 && (
            <SectionCard label={`Schema — ${schema.length} columns`}>
              <SchemaTable columns={schema} />
            </SectionCard>
          )}

          {/* Profile — per-file statistics from profile.json */}
          {profile && (
            <SectionCard label="Profile">
              <DatasetProfileCard profile={profile} />
            </SectionCard>
          )}

          {/* Validation — expectation checks from validation.json */}
          {validation && (
            <SectionCard label="Validation">
              <DatasetValidationCard validation={validation} />
            </SectionCard>
          )}

          {/* Collection & preprocessing */}
          {collection && (
            <SectionCard label="Collection & Preprocessing">
              <div style={{
                background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12,
                padding: '18px 20px', fontSize: 14, color: '#3b3830', lineHeight: 1.7,
              }}>
                {collection}
              </div>
            </SectionCard>
          )}

          {/* Usage notes */}
          {usageNotes && (
            <SectionCard label="Usage Notes">
              <div style={{
                background: '#fdf9f3', border: '1.5px solid #e8d9c0', borderRadius: 12,
                padding: '16px 20px', fontSize: 14, color: '#3b3830', lineHeight: 1.65,
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>ⓘ</span>
                <span>{usageNotes}</span>
              </div>
            </SectionCard>
          )}

          {/* Code */}
          {Object.keys(codeSnippet).length > 0 && (
            <div id="usage-section">
              <SectionCard label="Usage">
                <CodeBlock tabs={codeSnippet} />
              </SectionCard>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 276, flexShrink: 0 }}>

          {/* Quick info */}
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <SectionLabel>Quick info</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Domain', domain],
                ['Format', format],
                ['Version', `v${version}`],
                ['Rows', rows],
                ['Size', size],
                ['License', license],
                ['Downloads', downloads],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                  <span style={{ color: '#8a857a' }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API endpoint */}
          <div style={{ background: '#141310', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
                color: ACCENT, marginBottom: 10, textTransform: 'uppercase',
              }}>
                Query Endpoint
              </div>
              <code style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#c8c0b0',
                wordBreak: 'break-all', lineHeight: 1.5, display: 'block',
              }}>
                {`POST /v1/datasets/${dataset.id}/query`}
              </code>
            </div>
          </div>

          {/* Models trained on this dataset */}
          {relatedModels.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionLabel>Models trained on this</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {relatedModels.map(m => <RelatedModelCard key={m.id} model={m} />)}
              </div>
            </div>
          )}

          {/* Related datasets */}
          {relatedDatasets.length > 0 && (
            <div>
              <SectionLabel>Related datasets</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {relatedDatasets.map(d => <RelatedDatasetCard key={d.id} dataset={d} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
