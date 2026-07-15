/**
 * NewRepositoryPage — /new
 *
 * Two-step form:
 *   1. Choose repository type (MODEL or DATASET)
 *   2. Fill metadata and submit
 *
 * On success redirects to /models/:slug or /datasets/:slug.
 * Requires authentication — redirects to /login if not signed in.
 */
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { createRepository } from '../api/repositories.js'
import IllustrationPicker from '../components/IllustrationPicker.jsx'
import { CARD_ILLUSTRATION_OPTIONS, FAMILY_DEFAULT_ILLUSTRATION_ID, DOMAIN_DEFAULT_ILLUSTRATION_ID } from '../lib/illustrations.js'

const ACCENT = '#cf5a2a'

// ── Constants ──────────────────────────────────────────────────────────────────

const REPO_TYPES = [
  {
    id: 'MODEL',
    icon: '⬡',
    label: 'Model Repository',
    desc: 'Physics-informed models, neural network weights, inference endpoints, and checkpoints.',
    destPrefix: '/models',
  },
  {
    id: 'DATASET',
    icon: '◉',
    label: 'Dataset Repository',
    desc: 'Curated, versioned datasets — sensor logs, simulation outputs, field measurements.',
    destPrefix: '/datasets',
  },
]

const MODEL_FAMILIES = ['PINN', 'GNN / NNP', 'Grid RL', 'Forecasting', 'Generative', 'Other']
const DATASET_DOMAINS = ['Geothermal', 'Nuclear', 'Wind', 'Solar', 'Hydro', 'Grid', 'Other']
const DATASET_FORMATS = ['Parquet', 'CSV', 'JSON', 'NetCDF', 'HDF5', 'TSV', 'Other']
const LICENSES = ['Apache-2.0', 'MIT', 'CC BY 4.0', 'CC BY-NC 4.0', 'GPL-3.0', 'Restricted', 'Other']
const VISIBILITIES = [
  { value: 'public',  label: 'Public',  desc: 'Visible to everyone' },
  { value: 'private', label: 'Private', desc: 'Only visible to you' },
]

// ── Utilities ──────────────────────────────────────────────────────────────────

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .slice(0, 100)
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <div style={{
      fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.07em',
      color: '#56524a', textTransform: 'uppercase', marginBottom: 8,
    }}>
      {children}
      {required && <span style={{ color: ACCENT, marginLeft: 4 }}>*</span>}
    </div>
  )
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <Label required={required}>{label}</Label>
      {children}
      {hint && <div style={{ fontSize: 12, color: '#a09990', marginTop: 6 }}>{hint}</div>}
    </div>
  )
}

function Input({ value, onChange, placeholder, ...rest }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        fontFamily: 'inherit', fontSize: 14, width: '100%', boxSizing: 'border-box',
        padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
        background: '#fff', outline: 'none', color: '#1b1a17',
        transition: 'border-color .15s',
      }}
      onFocus={e => e.target.style.borderColor = ACCENT}
      onBlur={e => e.target.style.borderColor = '#ddd6c8'}
      {...rest}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        fontFamily: 'inherit', fontSize: 14, width: '100%', boxSizing: 'border-box',
        padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
        background: '#fff', outline: 'none', color: '#1b1a17', resize: 'vertical',
        transition: 'border-color .15s',
      }}
      onFocus={e => e.target.style.borderColor = ACCENT}
      onBlur={e => e.target.style.borderColor = '#ddd6c8'}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        fontFamily: 'inherit', fontSize: 14, width: '100%',
        padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
        background: '#fff', outline: 'none', color: '#1b1a17', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a857a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 36,
      }}
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('')

  function add() {
    const tag = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !tags.includes(tag) && tags.length < 10) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  function remove(t) {
    onChange(tags.filter(x => x !== t))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
          placeholder={placeholder}
          style={{
            fontFamily: 'inherit', fontSize: 14, flex: 1,
            padding: '10px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
            background: '#fff', outline: 'none', color: '#1b1a17',
          }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => { e.target.style.borderColor = '#ddd6c8'; add() }}
        />
        <button
          type="button"
          onClick={add}
          style={{
            fontFamily: 'inherit', fontSize: 13, padding: '10px 16px', borderRadius: 9,
            border: '1.4px solid #ddd6c8', background: '#faf7f0', cursor: 'pointer', color: '#56524a',
          }}
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {tags.map(t => (
            <span
              key={t}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Space Mono',monospace", fontSize: 11, padding: '3px 9px 3px 10px',
                borderRadius: 6, background: '#f0ebe0', color: '#56524a',
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#a09990', fontSize: 14, lineHeight: 1, padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function NewRepositoryPage() {
  const { user, loading: authLoading, authenticated } = useAuth()
  const navigate = useNavigate()

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user && !authenticated) navigate('/login', { replace: true })
  }, [user, authenticated, authLoading, navigate])

  // ── Form state ──
  const [step, setStep] = useState(1)            // 1 = type picker, 2 = details
  const [repoType, setRepoType] = useState(null)

  // Common fields
  const [title, setTitle]           = useState('')
  const [slug, setSlug]             = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [license, setLicense]       = useState('Apache-2.0')
  const [tags, setTags]             = useState([])

  // MODEL-specific
  const [family, setFamily] = useState('PINN')

  // DATASET-specific
  const [domain, setDomain]   = useState('Geothermal')
  const [format, setFormat]   = useState('Parquet')

  // Card illustration — defaults to the family/domain pick until the user overrides it
  const [illustration, setIllustration] = useState(FAMILY_DEFAULT_ILLUSTRATION_ID['PINN'])
  const [illustrationEdited, setIllustrationEdited] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  // Auto-generate slug from title unless user has manually edited it
  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title))
  }, [title, slugEdited])

  // Auto-pick a default illustration from family/domain unless the user overrode it
  useEffect(() => {
    if (illustrationEdited) return
    if (repoType === 'MODEL') {
      setIllustration(FAMILY_DEFAULT_ILLUSTRATION_ID[family] || CARD_ILLUSTRATION_OPTIONS[0].id)
    } else if (repoType === 'DATASET') {
      setIllustration(DOMAIN_DEFAULT_ILLUSTRATION_ID[domain] || CARD_ILLUSTRATION_OPTIONS[0].id)
    }
  }, [repoType, family, domain, illustrationEdited])

  function handleIllustrationChange(id) {
    setIllustrationEdited(true)
    setIllustration(id)
  }

  function handleSlugChange(e) {
    setSlugEdited(true)
    setSlug(toSlug(e.target.value))
  }

  function selectType(type) {
    setRepoType(type)
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!slug) { setError('Repository name is required.'); return }
    setSubmitting(true)
    setError('')

    const metadata = {
      title: title || slug,
      license,
      tags,
      illustration,
      ...(repoType === 'MODEL'
        ? { family }
        : { domain, format }),
    }

    try {
      const repo = await createRepository({
        slug,
        repoType,
        visibility,
        description,
        metadata,
      })
      const destPrefix = REPO_TYPES.find(t => t.id === repoType)?.destPrefix || '/models'
      navigate(`${destPrefix}/${repo.slug}/upload`, {
        state: { repoId: repo.id, justCreated: true },
      })
    } catch (err) {
      setError(err.message || 'Failed to create repository.')
      setSubmitting(false)
    }
  }

  if (authLoading) return null

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd', padding: '44px 28px 36px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
            color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
          }}>
            New Repository
          </div>
          <h1 style={{ fontSize: 36, letterSpacing: '-0.03em', fontWeight: 700, margin: 0 }}>
            {step === 1 ? 'What are you building?' : `New ${repoType === 'MODEL' ? 'Model' : 'Dataset'} Repository`}
          </h1>
          {step === 2 && (
            <div style={{ marginTop: 14, fontSize: 13.5, color: '#8a857a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: ACCENT, fontSize: 13, fontFamily: 'inherit', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                ← Change type
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 28px 80px' }}>

        {/* ── Step 1: Type picker ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {REPO_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => selectType(type.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                  background: '#fff', border: '1.5px solid #e7e0d2', borderRadius: 14,
                  padding: '22px 24px', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', transition: 'border-color .15s, box-shadow .15s',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ACCENT
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(207,90,42,.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e7e0d2'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{
                  fontSize: 28, width: 44, height: 44, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#f5f0e8', borderRadius: 10,
                }}>
                  {type.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#1b1a17', marginBottom: 6 }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: 13.5, color: '#56524a', lineHeight: 1.55 }}>
                    {type.desc}
                  </div>
                </div>
                <span style={{ color: '#a09990', fontSize: 20, alignSelf: 'center', flexShrink: 0 }}>›</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Details form ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <Field label="Display name" required hint="Human-readable title shown in the catalog.">
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={repoType === 'MODEL' ? 'e.g. GeoPINN-v2' : 'e.g. Olkaria Field Logs'}
              />
            </Field>

            {/* Slug / repo name */}
            <Field
              label="Repository name"
              required
              hint={
                <span>
                  URL-safe identifier. Your repo will be at{' '}
                  <code style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, background: '#f0ebe0', padding: '1px 5px', borderRadius: 4 }}>
                    /{repoType === 'MODEL' ? 'models' : 'datasets'}/{slug || '…'}
                  </code>
                </span>
              }
            >
              <Input
                value={slug}
                onChange={handleSlugChange}
                placeholder="my-repository-name"
              />
            </Field>

            {/* Description */}
            <Field label="Description" hint="One-sentence summary shown on listing cards.">
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={repoType === 'MODEL'
                  ? 'Physics-informed network for geothermal reservoir simulation…'
                  : 'Well-log P-T profiles from 34 production wells at Olkaria, Kenya…'}
                rows={2}
              />
            </Field>

            {/* Type-specific fields */}
            {repoType === 'MODEL' && (
              <Field label="Model family" hint="Architecture family used for filtering and color coding.">
                <Select value={family} onChange={e => setFamily(e.target.value)} options={MODEL_FAMILIES} />
              </Field>
            )}

            {repoType === 'DATASET' && (
              <>
                <Field label="Domain">
                  <Select value={domain} onChange={e => setDomain(e.target.value)} options={DATASET_DOMAINS} />
                </Field>
                <Field label="Primary format" hint="The primary file format of the dataset.">
                  <Select value={format} onChange={e => setFormat(e.target.value)} options={DATASET_FORMATS} />
                </Field>
              </>
            )}

            {/* Card illustration */}
            <Field
              label="Card illustration"
              hint="Shown on catalog cards and the repository page. Defaults to your family/domain pick — change it anytime from the repository page."
            >
              <IllustrationPicker value={illustration} onChange={handleIllustrationChange} />
            </Field>

            {/* License */}
            <Field label="License">
              <Select value={license} onChange={e => setLicense(e.target.value)} options={LICENSES} />
            </Field>

            {/* Tags */}
            <Field label="Tags" hint="Press Enter or comma to add. Up to 10 tags.">
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder={repoType === 'MODEL' ? 'geothermal, inverse, pinn…' : 'geothermal, sensor, timeseries…'}
              />
            </Field>

            {/* Visibility */}
            <Field label="Visibility">
              <div style={{ display: 'flex', gap: 12 }}>
                {VISIBILITIES.map(v => (
                  <label
                    key={v.value}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                      background: visibility === v.value ? '#fff8f4' : '#fff',
                      border: `1.5px solid ${visibility === v.value ? ACCENT : '#e7e0d2'}`,
                      borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                      transition: 'border-color .15s',
                    }}
                  >
                    <input
                      type="radio"
                      value={v.value}
                      checked={visibility === v.value}
                      onChange={() => setVisibility(v.value)}
                      style={{ accentColor: ACCENT }}
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{v.label}</div>
                      <div style={{ fontSize: 12, color: '#8a857a', marginTop: 2 }}>{v.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Field>

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
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={submitting || !slug}
                style={{
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  padding: '12px 28px', borderRadius: 10, border: 'none',
                  background: submitting || !slug ? '#d0c8bc' : '#1b1a17',
                  color: submitting || !slug ? '#8a857a' : '#f1ede4',
                  cursor: submitting || !slug ? 'not-allowed' : 'pointer',
                  transition: 'background .15s',
                }}
              >
                {submitting ? 'Creating…' : 'Create repository →'}
              </button>
              <Link
                to={repoType === 'MODEL' ? '/models' : '/datasets'}
                style={{
                  fontFamily: 'inherit', fontSize: 14, padding: '12px 20px', borderRadius: 10,
                  border: '1.4px solid #ddd6c8', background: '#fff', color: '#56524a',
                  textDecoration: 'none', display: 'flex', alignItems: 'center',
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
