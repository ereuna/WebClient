import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchModel, fetchRelatedModels, FAMILY_COLORS, invalidateModelsCache } from '../api/models'
import { fetchModelRepoArtifacts } from '../api/repoFiles'
import { updateRepository } from '../api/repositories.js'
import { FAMILY_ILLUSTRATIONS, getIllustrationById } from '../lib/illustrations'
import IllustrationPicker from '../components/IllustrationPicker.jsx'
import Modal from '../components/Modal.jsx'
import MetricCard from '../components/MetricCard'
import CodeBlock from '../components/CodeBlock'
import StarButton from '../components/StarButton'
import RepoReadme from '../components/model/RepoReadme'
import HyperparametersTable from '../components/model/HyperparametersTable'
import InferenceParamsCard from '../components/model/InferenceParamsCard'
import ModelConfigCard from '../components/model/ModelConfigCard'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#c2410c'
const DOT_BG = 'radial-gradient(#ddd8cc 1px,transparent 1px)'

function FamilyChip({ family }) {
  const color = FAMILY_COLORS[family] || '#5f6670'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {family}
    </span>
  )
}

function LicenseBadge({ license }) {
  const restricted = license === 'Restricted'
  return (
    <span style={{
      display: 'inline-block', padding: '4px 10px', borderRadius: 20,
      border: `1px solid ${restricted ? '#e67e2240' : '#ddd8cc'}`,
      background: restricted ? '#e67e2210' : '#ffffff',
      color: restricted ? '#e67e22' : '#5f6670',
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11,
    }}>
      {license}
    </span>
  )
}

function StatPill({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670',
    }}>
      {icon} {label}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
      color: '#545b66', marginBottom: 14, textTransform: 'uppercase',
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

function ArchRow({ k, v }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '10px 0',
      borderBottom: '1px solid #efebe2', fontSize: 13.5,
    }}>
      <div style={{ width: 160, flexShrink: 0, color: '#5f6670', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>{k}</div>
      <div style={{ color: '#17202e' }}>{v}</div>
    </div>
  )
}

function VersionRow({ tag, date, note, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #efebe2' }}>
      <div style={{ flexShrink: 0, paddingTop: 1 }}>
        <span style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '3px 8px',
          borderRadius: 6, border: '1px solid #ddd8cc', color: '#17202e', background: '#ffffff',
          whiteSpace: 'nowrap',
        }}>{tag}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: '#17202e' }}>{note}</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#5f6670', marginTop: 4 }}>{date}</div>
      </div>
    </div>
  )
}

function RelatedModelCard({ model }) {
  return (
    <Link
      to={`/models/${model.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: '#ffffff', border: '1px solid #ddd8cc', borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{model.title}</div>
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, padding: '2px 6px',
            borderRadius: 5, border: '1px solid #ddd8cc', color: '#5f6670', whiteSpace: 'nowrap',
          }}>{model.family}</span>
        </div>
        <div style={{ fontSize: 12, color: '#5f6670', marginTop: 5, lineHeight: 1.45 }}>
          {model.desc.slice(0, 72)}…
        </div>
      </div>
    </Link>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efebe2 0%,#f5f2eb 100%)', borderBottom: '1px solid #ddd8cc', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 140, background: '#ddd8cc', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 36, width: 260, background: '#ddd8cc', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 420, background: '#efebe2', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[180, 140, 120, 200].map((h, i) => (
            <div key={i} style={{ height: h, background: '#efebe2', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[120, 80, 80].map((h, i) => (
            <div key={i} style={{ height: h, background: '#efebe2', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ModelDetailPage() {
  const { modelId } = useParams()
  const { user, authenticated } = useAuth()
  const [model, setModel] = useState(null)
  const [related, setRelated] = useState([])
  const [repoArtifacts, setRepoArtifacts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingIllustration, setPendingIllustration] = useState(null)
  const [savingIllustration, setSavingIllustration] = useState(false)
  const [illustrationError, setIllustrationError] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setRepoArtifacts(null)
    fetchModel(modelId).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setModel(data)
      const relatedPromise = fetchRelatedModels(data.relatedIds)
      const artifactsPromise = data._repoId
        ? fetchModelRepoArtifacts(data._repoId)
        : Promise.resolve(null)
      Promise.all([relatedPromise, artifactsPromise]).then(([r, artifacts]) => {
        setRelated(r)
        setRepoArtifacts(artifacts)
        setLoading(false)
      })
    })
  }, [modelId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#ddd8cc' }}>404</div>
        <div style={{ fontSize: 16, color: '#5f6670' }}>Model not found.</div>
        <Link to="/models" style={{ color: '#17202e', fontSize: 14, textDecoration: 'none' }}>← Back to Models</Link>
      </div>
    )
  }

  const { title, family, license, desc, longDesc, tags, downloads, stars, size, updated, version,
    metrics, architecture, modelCard, versions, trainingDataset, endpoint, codeSnippet } = model

  const { readme, hyperparameters, params, config } = repoArtifacts || {}
  const configDataset = config?.training_dataset || config?.trainingDataset || config?.dataset

  const heroIllustrationSrc = (model.illustration && getIllustrationById(model.illustration)?.src) || FAMILY_ILLUSTRATIONS[family] || null
  const isOwner = Boolean(user && model.ownerUserId && user.id === model.ownerUserId)

  function openIllustrationPicker() {
    setPendingIllustration(model.illustration || null)
    setIllustrationError('')
    setPickerOpen(true)
  }

  async function handleSaveIllustration() {
    if (!pendingIllustration || !model._repoId) return
    setSavingIllustration(true)
    setIllustrationError('')
    try {
      await updateRepository(model._repoId, { metadata: { illustration: pendingIllustration } })
      invalidateModelsCache()
      setModel(m => ({ ...m, illustration: pendingIllustration }))
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
      <div style={{ background: 'linear-gradient(180deg,#efebe2 0%,#f5f2eb 100%)', borderBottom: '1px solid #ddd8cc', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/models" style={{ color: '#5f6670', textDecoration: 'none' }}>Models</Link>
            <span>›</span>
            <span style={{ color: '#17202e' }}>{title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              {/* Chips row */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <FamilyChip family={family} />
                <LicenseBadge license={license} />
                <span style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '4px 9px',
                  borderRadius: 20, border: '1px solid #ddd8cc', color: '#5f6670', background: '#ffffff',
                }}>v{version}</span>
              </div>

              <h1 style={{ fontSize: 42, letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1.06, margin: 0 }}>
                {title}
              </h1>
              <p style={{ fontSize: 15.5, color: '#545b66', marginTop: 12, maxWidth: 560, lineHeight: 1.6 }}>
                {desc}
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 14, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                <StatPill icon="↓" label={`${downloads} downloads`} />
                <StatPill icon="⬡" label={size} />
                <StatPill icon="↺" label={`Updated ${updated}`} />
                <StarButton repoId={model._repoId} initialCount={parseInt(stars) || 0} />
              </div>
            </div>

            {/* CTA + illustration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 200, maxWidth: 280 }}>
              {(heroIllustrationSrc || isOwner) && (
                <div style={{ position: 'relative' }}>
                  {heroIllustrationSrc ? (
                    <img
                      src={heroIllustrationSrc}
                      alt={`${family} illustration`}
                      style={{ width: '100%', borderRadius: 12, display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', aspectRatio: '16/10', borderRadius: 12,
                      background: '#efebe2', border: '1.4px dashed #c9c4b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670',
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
              <button
                onClick={() => document.getElementById('usage-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: 'none', background: '#17202e', color: '#f5f2eb', fontWeight: 500, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Use via API →
              </button>
              <Link
                to="/docs"
                style={{
                  display: 'block', fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: '1.4px solid #c9c4b8', background: '#fff', color: '#17202e', fontWeight: 500,
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Download ↓
              </Link>
              {(user || authenticated) && model?._repoId && (
                <Link
                  to={`/models/${modelId}/upload`}
                  style={{
                    fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                    border: `1.4px solid ${ACCENT}`, color: '#17202e', fontWeight: 500,
                    textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap',
                  }}
                >
                  Upload files ↑
                </Link>
              )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, padding: '3px 9px',
                borderRadius: 6, background: '#efebe2', color: '#545b66',
              }}>{t}</span>
            ))}
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
                border: '1.4px solid #c9c4b8', background: '#fff', color: '#545b66', cursor: 'pointer',
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
                background: savingIllustration || !pendingIllustration ? '#c9c4b8' : '#17202e',
                color: savingIllustration || !pendingIllustration ? '#5f6670' : '#f5f2eb',
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

      {/* ── Body: 2-col layout ── */}
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
              <p style={{ fontSize: 14.5, color: '#243042', lineHeight: 1.7, margin: 0 }}>{longDesc}</p>
            </SectionCard>
          )}

          {/* Model config from config.json */}
          {config && (
            <SectionCard label="Configuration">
              <ModelConfigCard config={config} />
            </SectionCard>
          )}

          {/* Hyperparameters from hyperparameters.json */}
          {hyperparameters && (
            <SectionCard label="Hyperparameters">
              <HyperparametersTable data={hyperparameters} />
            </SectionCard>
          )}

          {/* Performance metrics */}
          {metrics.length > 0 && (
            <SectionCard label="Performance">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {metrics.map(m => (
                  <MetricCard key={m.label} {...m} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Architecture */}
          {Object.keys(architecture).length > 0 && (
            <SectionCard label="Architecture">
              <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 8, backgroundImage: DOT_BG, backgroundSize: '14px 14px', background: '#ffffff', borderBottom: '1px solid #efebe2', backgroundImage: DOT_BG }} />
                <div style={{ padding: '2px 20px 8px' }}>
                  {Object.entries({
                    Type: architecture.type,
                    Parameters: architecture.params,
                    Framework: architecture.framework,
                    Input: architecture.input,
                    Output: architecture.output,
                    Optimizer: architecture.optimizer,
                    Hardware: architecture.hardware,
                  }).filter(([, v]) => v).map(([k, v]) => <ArchRow key={k} k={k} v={v} />)}
                </div>
              </div>
            </SectionCard>
          )}

          {/* Usage */}
          {Object.keys(codeSnippet).length > 0 && (
            <div id="usage-section">
              <SectionCard label="Usage">
                <CodeBlock tabs={codeSnippet} />
              </SectionCard>
            </div>
          )}

          {/* Model card */}
          {modelCard.intendedUse && (
            <SectionCard label="Model Card">
              <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden' }}>
                {Object.entries({
                  'Intended use': modelCard.intendedUse,
                  'Limitations': modelCard.limitations,
                  'Evaluation': modelCard.evaluation,
                  'Known biases': modelCard.biases,
                }).filter(([, v]) => v).map(([k, v], i, arr) => (
                  <div key={k} style={{
                    display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16,
                    padding: '16px 20px',
                    borderBottom: i < arr.length - 1 ? '1px solid #efebe2' : 'none',
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#5f6670', paddingTop: 2 }}>{k}</div>
                    <div style={{ fontSize: 13.5, color: '#243042', lineHeight: 1.6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Version history */}
          {versions.length > 0 && (
            <SectionCard label="Versions">
              <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, padding: '4px 20px' }}>
                {versions.map((v, i) => (
                  <VersionRow key={v.tag} {...v} isLast={i === versions.length - 1} />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 276, flexShrink: 0 }}>

          {/* Inference inputs/outputs from params.json */}
          {params && <InferenceParamsCard params={params} />}

          {/* Quick info */}
          <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #efebe2' }}>
              <SectionLabel>Quick info</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Family', family],
                  ['Version', `v${version}`],
                  ['Parameters', architecture.params],
                  ['Size', size],
                  ['Framework', architecture.framework],
                  ['License', license],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                    <span style={{ color: '#5f6670' }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API endpoint */}
          <div style={{ background: '#0f1622', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
                color: '#545b66', marginBottom: 10, textTransform: 'uppercase',
              }}>
                API Endpoint
              </div>
              <code style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#c9c4b8',
                wordBreak: 'break-all', lineHeight: 1.5, display: 'block',
              }}>
                {endpoint}
              </code>
              <div style={{ marginTop: 12, fontSize: 11.5, color: '#5f6670', lineHeight: 1.5 }}>
                Base URL: <span style={{ color: '#5f6670' }}>api.ereuna.energy</span>
              </div>
            </div>
          </div>

          {/* Training dataset */}
          {(trainingDataset !== '—' || configDataset || architecture.training) && (
            <div style={{ background: '#fff', border: '1px solid #ddd8cc', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
              <SectionLabel>Training data</SectionLabel>
              {(configDataset || trainingDataset !== '—') && (
                <div style={{ fontSize: 13, fontWeight: 500, color: '#17202e', marginBottom: 4 }}>
                  {configDataset || trainingDataset}
                </div>
              )}
              {config?.dataset_version && (
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5f6670', marginBottom: 4 }}>
                  {config.dataset_version}
                </div>
              )}
              {architecture.training && (
                <div style={{ fontSize: 12.5, color: '#545b66', lineHeight: 1.5 }}>{architecture.training}</div>
              )}
              <Link to="/datasets" style={{ display: 'block', marginTop: 10, fontSize: 12, color: '#17202e', textDecoration: 'none', fontWeight: 500 }}>
                View in datasets →
              </Link>
            </div>
          )}

          {/* Related models */}
          {related.length > 0 && (
            <div>
              <SectionLabel>Related models</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {related.map(r => <RelatedModelCard key={r.id} model={r} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
