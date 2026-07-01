import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchModel, fetchRelatedModels, FAMILY_COLORS } from '../api/models'
import { fetchModelRepoArtifacts } from '../api/repoFiles'
import { FAMILY_ILLUSTRATIONS } from '../lib/illustrations'
import MetricCard from '../components/MetricCard'
import CodeBlock from '../components/CodeBlock'
import StarButton from '../components/StarButton'
import RepoReadme from '../components/model/RepoReadme'
import HyperparametersTable from '../components/model/HyperparametersTable'
import InferenceParamsCard from '../components/model/InferenceParamsCard'
import ModelConfigCard from '../components/model/ModelConfigCard'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#cf5a2a'
const DOT_BG = 'radial-gradient(#e7e0d1 1px,transparent 1px)'

function FamilyChip({ family }) {
  const color = FAMILY_COLORS[family] || '#8a857a'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
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
      border: `1px solid ${restricted ? '#e67e2240' : '#e7e0d2'}`,
      background: restricted ? '#e67e2210' : '#faf7f0',
      color: restricted ? '#e67e22' : '#8a857a',
      fontFamily: "'Space Mono',monospace", fontSize: 11,
    }}>
      {license}
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

function ArchRow({ k, v }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '10px 0',
      borderBottom: '1px solid #f0ebe0', fontSize: 13.5,
    }}>
      <div style={{ width: 160, flexShrink: 0, color: '#8a857a', fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{k}</div>
      <div style={{ color: '#1b1a17' }}>{v}</div>
    </div>
  )
}

function VersionRow({ tag, date, note, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #f0ebe0' }}>
      <div style={{ flexShrink: 0, paddingTop: 1 }}>
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 8px',
          borderRadius: 6, border: '1px solid #e7e0d2', color: '#1b1a17', background: '#faf7f0',
          whiteSpace: 'nowrap',
        }}>{tag}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: '#1b1a17' }}>{note}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#a09990', marginTop: 4 }}>{date}</div>
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

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 140, background: '#e7e0d2', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 36, width: 260, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 420, background: '#ece5d6', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 28px', display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[180, 140, 120, 200].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[120, 80, 80].map((h, i) => (
            <div key={i} style={{ height: h, background: '#f0ebe0', borderRadius: 12 }} />
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
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: '#8a857a' }}>Model not found.</div>
        <Link to="/models" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Models</Link>
      </div>
    )
  }

  const { title, family, license, desc, longDesc, tags, downloads, stars, size, updated, version,
    metrics, architecture, modelCard, versions, trainingDataset, endpoint, codeSnippet } = model

  const { readme, hyperparameters, params, config } = repoArtifacts || {}
  const configDataset = config?.training_dataset || config?.trainingDataset || config?.dataset

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero header ── */}
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/models" style={{ color: '#8a857a', textDecoration: 'none' }}>Models</Link>
            <span>›</span>
            <span style={{ color: '#1b1a17' }}>{title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              {/* Chips row */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <FamilyChip family={family} />
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
              {FAMILY_ILLUSTRATIONS[family] && (
                <img
                  src={FAMILY_ILLUSTRATIONS[family]}
                  alt={`${family} illustration`}
                  style={{ width: '100%', borderRadius: 12, display: 'block' }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => document.getElementById('usage-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: 'none', background: '#1b1a17', color: '#f1ede4', fontWeight: 500, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Use via API →
              </button>
              <Link
                to="/docs"
                style={{
                  display: 'block', fontFamily: 'inherit', fontSize: 14, padding: '11px 20px', borderRadius: 10,
                  border: '1.4px solid #ddd6c8', background: '#fff', color: '#1b1a17', fontWeight: 500,
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

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 9px',
                borderRadius: 6, background: '#f5f0e8', color: '#7a7568',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

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
              <p style={{ fontSize: 14.5, color: '#3b3830', lineHeight: 1.7, margin: 0 }}>{longDesc}</p>
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
              <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 8, backgroundImage: DOT_BG, backgroundSize: '14px 14px', background: '#faf7f0', borderBottom: '1px solid #ece5d6', backgroundImage: DOT_BG }} />
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
              <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden' }}>
                {Object.entries({
                  'Intended use': modelCard.intendedUse,
                  'Limitations': modelCard.limitations,
                  'Evaluation': modelCard.evaluation,
                  'Known biases': modelCard.biases,
                }).filter(([, v]) => v).map(([k, v], i, arr) => (
                  <div key={k} style={{
                    display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16,
                    padding: '16px 20px',
                    borderBottom: i < arr.length - 1 ? '1px solid #f0ebe0' : 'none',
                  }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#8a857a', paddingTop: 2 }}>{k}</div>
                    <div style={{ fontSize: 13.5, color: '#3b3830', lineHeight: 1.6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Version history */}
          {versions.length > 0 && (
            <SectionCard label="Versions">
              <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '4px 20px' }}>
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
          <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0ebe0' }}>
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
                    <span style={{ color: '#8a857a' }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API endpoint */}
          <div style={{ background: '#141310', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.08em',
                color: ACCENT, marginBottom: 10, textTransform: 'uppercase',
              }}>
                API Endpoint
              </div>
              <code style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#c8c0b0',
                wordBreak: 'break-all', lineHeight: 1.5, display: 'block',
              }}>
                {endpoint}
              </code>
              <div style={{ marginTop: 12, fontSize: 11.5, color: '#6b6660', lineHeight: 1.5 }}>
                Base URL: <span style={{ color: '#8a857a' }}>api.aether.energy</span>
              </div>
            </div>
          </div>

          {/* Training dataset */}
          {(trainingDataset !== '—' || configDataset || architecture.training) && (
            <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
              <SectionLabel>Training data</SectionLabel>
              {(configDataset || trainingDataset !== '—') && (
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1b1a17', marginBottom: 4 }}>
                  {configDataset || trainingDataset}
                </div>
              )}
              {config?.dataset_version && (
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8a857a', marginBottom: 4 }}>
                  {config.dataset_version}
                </div>
              )}
              {architecture.training && (
                <div style={{ fontSize: 12.5, color: '#56524a', lineHeight: 1.5 }}>{architecture.training}</div>
              )}
              <Link to="/datasets" style={{ display: 'block', marginTop: 10, fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
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
