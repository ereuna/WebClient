import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BG = '#fff'
const CARD_BORDER = '1px solid #e7e0d2'
const CARD_RADIUS = 14

const TABS = ['Overview', 'Files', 'Versions', 'Models', 'Datasets', 'Pipelines', 'Experiments', 'Deployments', 'Settings']

function TabBar({ activeTab, onTab }) {
  return (
    <div style={{
      borderBottom: '1px solid #e3dccd',
      background: BG,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTab(tab)}
            style={{
              fontFamily: 'inherit',
              fontSize: 13.5,
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
              color: activeTab === tab ? DARK : MEDIUM,
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: -1,
              transition: 'color .15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Space Mono',monospace",
      fontSize: 10,
      letterSpacing: '0.08em',
      color: ACCENT,
      marginBottom: 14,
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function Chip({ children, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 20,
      background: color ? color + '18' : '#f5f0e8',
      color: color || '#7a7568',
      fontFamily: "'Space Mono',monospace",
      fontSize: 11,
      fontWeight: color ? 600 : 400,
      border: color ? `1px solid ${color}30` : '1px solid #e7e0d2',
    }}>
      {children}
    </span>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      background: CARD_BG,
      border: CARD_BORDER,
      borderRadius: CARD_RADIUS,
      ...style,
    }}>
      {children}
    </div>
  )
}

function EmptyState({ type }) {
  const icons = { Models: '🧠', Datasets: '🗄️', Pipelines: '⚙️', Experiments: '🔬', Deployments: '🚀' }
  return (
    <Card style={{ padding: '40px 28px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.35 }}>{icons[type]}</div>
      <div style={{ fontSize: 14, color: MUTED }}>
        No {type.toLowerCase()} yet.{' '}
        <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 500 }}>Add one →</span>
      </div>
    </Card>
  )
}

function OverviewTab() {
  const readmeSections = [
    {
      heading: 'GeoThermalNet',
      body: 'GeoThermalNet is a physics-informed neural network (PINN) designed for high-fidelity simulation of geothermal reservoir dynamics. It couples the Navier-Stokes equations for fluid flow with heat-transport PDEs, enforcing physical constraints directly in the loss function.',
    },
    {
      heading: 'Installation',
      body: 'Clone the repository and install dependencies via pip install -r requirements.txt. Python 3.11 and PyTorch 2.1+ are required. A CUDA-capable GPU is recommended for training but not required for inference.',
    },
    {
      heading: 'Quick start',
      body: 'Import the model with `from model import GeoThermalNet` and instantiate with your reservoir configuration. Pass a pressure-temperature field tensor to obtain flow velocity and heat-flux predictions. See train.py for a full training loop example.',
    },
    {
      heading: 'Citation',
      body: 'If you use GeoThermalNet in your research, please cite the accompanying paper: "Physics-Informed Neural Simulation of Geothermal Reservoirs", Aether Energy Lab, 2024.',
    },
  ]

  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card style={{ padding: '28px 32px' }}>
          <SectionLabel>README.md</SectionLabel>
          {readmeSections.map((s, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <div style={{
                fontSize: i === 0 ? 22 : 16,
                fontWeight: i === 0 ? 700 : 600,
                color: DARK,
                letterSpacing: i === 0 ? '-0.02em' : '-0.01em',
                marginBottom: 10,
              }}>
                {s.heading}
              </div>
              <p style={{ fontSize: 14, color: MEDIUM, lineHeight: 1.72, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: '20px 20px' }}>
          <SectionLabel>Topics</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['geothermal', 'pinn', 'simulation', 'pytorch', 'reservoir', 'heat-transfer', 'physics-ml'].map(t => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </Card>

        <Card style={{ padding: '20px 20px' }}>
          <SectionLabel>License</SectionLabel>
          <div style={{ fontSize: 13.5, color: DARK, fontWeight: 500, marginBottom: 4 }}>Apache 2.0</div>
          <div style={{ fontSize: 12, color: MUTED }}>Open source, commercial use allowed.</div>
        </Card>

        <Card style={{ padding: '20px 20px' }}>
          <SectionLabel>Frameworks</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Chip color="#ee4c2c">PyTorch</Chip>
            <Chip color="#3776ab">Python 3.11</Chip>
          </div>
        </Card>
      </div>
    </div>
  )
}

function FilesTab() {
  const files = [
    { type: 'file',   name: 'README.md',       size: '4.2 KB',  commit: 'Update installation docs',       time: '3d ago' },
    { type: 'file',   name: 'model.py',         size: '18.7 KB', commit: 'Add residual skip connections',  time: '3d ago' },
    { type: 'file',   name: 'train.py',         size: '11.3 KB', commit: 'Fix learning rate scheduler',    time: '5d ago' },
    { type: 'file',   name: 'config.yaml',      size: '1.8 KB',  commit: 'Update default hyperparams',     time: '3d ago' },
    { type: 'file',   name: 'requirements.txt', size: '480 B',   commit: 'Pin torch to 2.1.2',             time: '8d ago' },
    { type: 'folder', name: 'checkpoints',      size: '—',       commit: 'Add v1.2 checkpoint files',      time: '3d ago' },
  ]

  return (
    <Card>
      <div style={{
        display: 'flex',
        padding: '12px 20px',
        borderBottom: '1px solid #f0ebe0',
        background: '#faf7f0',
        borderRadius: `${CARD_RADIUS}px ${CARD_RADIUS}px 0 0`,
      }}>
        <div style={{ flex: 1, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Name</div>
        <div style={{ width: 220, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Last commit</div>
        <div style={{ width: 80, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>Size</div>
        <div style={{ width: 70, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>When</div>
      </div>
      {files.map((f, i) => (
        <div
          key={f.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '11px 20px',
            borderBottom: i < files.length - 1 ? '1px solid #f5f0e8' : 'none',
            cursor: 'pointer',
            transition: 'background .1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#faf7f0'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{f.type === 'folder' ? '📁' : '📄'}</span>
            <span style={{ fontSize: 13.5, color: DARK, fontWeight: f.type === 'folder' ? 600 : 400 }}>{f.name}</span>
          </div>
          <div style={{ width: 220, fontSize: 12.5, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.commit}</div>
          <div style={{ width: 80, fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, textAlign: 'right' }}>{f.size}</div>
          <div style={{ width: 70, fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, textAlign: 'right' }}>{f.time}</div>
        </div>
      ))}
    </Card>
  )
}

function VersionsTab() {
  const versions = [
    {
      tag: 'v1.2.0',
      date: 'Jun 22, 2025',
      notes: 'Improved multi-phase flow solver, reduced inference latency by 18%, added gradient checkpointing for 40 GB+ reservoirs.',
      downloads: '890',
      latest: true,
    },
    {
      tag: 'v1.1.0',
      date: 'May 14, 2025',
      notes: 'Added support for supercritical CO₂ injection scenarios. Fixed numerical instability in high-salinity brine simulations.',
      downloads: '234',
      latest: false,
    },
    {
      tag: 'v1.0.0',
      date: 'Mar 3, 2025',
      notes: 'Initial public release. Covers single-phase liquid-dominated geothermal systems with steady-state and transient solvers.',
      downloads: '76',
      latest: false,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {versions.map(v => (
        <Card key={v.tag} style={{ padding: '22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 13,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 8,
                border: `1.5px solid ${v.latest ? ACCENT : '#e7e0d2'}`,
                color: v.latest ? ACCENT : DARK,
                background: v.latest ? ACCENT + '0e' : '#faf7f0',
              }}>
                {v.tag}
              </span>
              {v.latest && (
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 9,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#2db88a18',
                  color: '#2db88a',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  Latest
                </span>
              )}
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>{v.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>↓ {v.downloads}</span>
              <button style={{
                fontFamily: 'inherit',
                fontSize: 13,
                padding: '7px 16px',
                borderRadius: 8,
                border: '1.4px solid #e7e0d2',
                background: '#faf7f0',
                color: DARK,
                cursor: 'pointer',
                fontWeight: 500,
              }}>
                Download
              </button>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 13.5, color: MEDIUM, lineHeight: 1.65 }}>
            <span style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              color: MUTED,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: 6,
            }}>
              Release notes
            </span>
            {v.notes}
          </div>
        </Card>
      ))}
    </div>
  )
}

function LinkedItemsTab({ type, items }) {
  if (!items || items.length === 0) return <EmptyState type={type} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, i) => (
        <Card key={i} style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {item.badge && (
              <span style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                padding: '3px 9px',
                borderRadius: 6,
                border: '1px solid #e7e0d2',
                color: MUTED,
                background: '#faf7f0',
              }}>
                {item.badge}
              </span>
            )}
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>View →</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

function DeploymentsTab() {
  const deployments = [
    {
      name: 'geo-reservoir-prod',
      desc: 'Production inference endpoint — Iceland pilot region. 99.7% uptime over last 30 days.',
      status: 'Running',
    },
    {
      name: 'geo-reservoir-staging',
      desc: 'Staging endpoint for v1.3.0 pre-release testing. Mirrors production config.',
      status: 'Idle',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {deployments.map((d, i) => (
        <Card key={i} style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: DARK,
              marginBottom: 4,
              fontFamily: "'Space Mono',monospace",
            }}>
              {d.name}
            </div>
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{d.desc}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              padding: '4px 10px',
              borderRadius: 20,
              background: d.status === 'Running' ? '#2db88a18' : '#8a857a18',
              color: d.status === 'Running' ? '#2db88a' : MUTED,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: d.status === 'Running' ? '#2db88a' : MUTED,
                display: 'inline-block',
              }} />
              {d.status}
            </span>
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>Manage →</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

function SettingsTab({ repo }) {
  const [repoName, setRepoName] = useState(repo)
  const [description, setDescription] = useState('A physics-informed neural network for geothermal reservoir simulation.')
  const [isPublic, setIsPublic] = useState(true)

  const inputStyle = {
    fontFamily: 'inherit',
    fontSize: 13.5,
    width: '100%',
    padding: '10px 14px',
    borderRadius: 9,
    border: '1.4px solid #e7e0d2',
    background: '#faf7f0',
    color: DARK,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: "'Space Mono',monospace",
    fontSize: 10,
    fontWeight: 500,
    color: MEDIUM,
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Card style={{ padding: '28px 32px', marginBottom: 20 }}>
        <SectionLabel>General</SectionLabel>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Repository name</label>
          <input
            value={repoName}
            onChange={e => setRepoName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Visibility</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {[true, false].map(pub => (
              <button
                key={String(pub)}
                onClick={() => setIsPublic(pub)}
                style={{
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  padding: '9px 20px',
                  borderRadius: 9,
                  border: isPublic === pub ? `1.5px solid ${ACCENT}` : '1.4px solid #e7e0d2',
                  background: isPublic === pub ? ACCENT + '0e' : '#faf7f0',
                  color: isPublic === pub ? ACCENT : MEDIUM,
                  fontWeight: isPublic === pub ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {pub ? '🌐 Public' : '🔒 Private'}
              </button>
            ))}
          </div>
        </div>

        <button style={{
          fontFamily: 'inherit',
          fontSize: 14,
          padding: '10px 22px',
          borderRadius: 9,
          border: 'none',
          background: DARK,
          color: '#f1ede4',
          fontWeight: 500,
          cursor: 'pointer',
        }}>
          Save changes
        </button>
      </Card>

      <Card style={{ padding: '28px 32px', border: '1px solid #f0c4c4' }}>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 10,
          letterSpacing: '0.08em',
          color: '#c0392b',
          marginBottom: 14,
          textTransform: 'uppercase',
        }}>
          Danger zone
        </div>
        <div style={{ fontSize: 13.5, color: MEDIUM, lineHeight: 1.6, marginBottom: 20 }}>
          Deleting this repository is permanent and cannot be undone. All files, versions, models, datasets, and deployment configurations will be removed.
        </div>
        <button style={{
          fontFamily: 'inherit',
          fontSize: 14,
          padding: '10px 22px',
          borderRadius: 9,
          border: '1.5px solid #e74c3c',
          background: 'transparent',
          color: '#e74c3c',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          Delete this repository
        </button>
      </Card>
    </div>
  )
}

export default function RepositoryDetailPage() {
  const { owner, repo } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')

  const linkedModels = [
    { name: 'GeoThermalNet Base',  desc: 'Core PINN checkpoint — single-phase steady-state solver.',      badge: 'v1.2.0' },
    { name: 'GeoThermalNet Lite',  desc: 'Distilled 4× smaller variant for edge deployment.',             badge: 'v1.1.0' },
  ]

  const linkedDatasets = [
    { name: 'Iceland Basin Surveys 2022',   desc: '14,000 well logs from the Reykjanes ridge geothermal field.',     badge: '8.3 GB' },
    { name: 'Synthetic Reservoir Benchmark', desc: 'Numerically generated P-T field pairs for pretraining.',          badge: '2.1 GB' },
  ]

  const linkedPipelines = [
    { name: 'reservoir-training-pipeline', desc: 'End-to-end training pipeline: data ingestion → augmentation → PINN training → eval.', badge: '6 steps' },
  ]

  const linkedExperiments = [
    { name: 'lr-sweep-2025-06',       desc: 'Learning rate sweep across 1e-3 to 1e-5 with cosine annealing.',             badge: '18 runs' },
    { name: 'arch-ablation-skipconn', desc: 'Ablation study on residual skip connections in the encoder.',                badge: '6 runs'  },
    { name: 'multiphase-finetune',    desc: 'Fine-tuning run for supercritical CO₂ injection scenarios.',                 badge: '3 runs'  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            color: MUTED,
            marginBottom: 18,
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}>
            <Link to="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: DARK, fontWeight: 500 }}>{owner}</span>
            <span>›</span>
            <span style={{ color: DARK }}>{repo}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '1px solid #2db88a40',
                  background: '#2db88a10',
                  color: '#2db88a',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Public
                </span>
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '1px solid #7c6af740',
                  background: '#7c6af710',
                  color: '#7c6af7',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Model
                </span>
              </div>

              <h1 style={{
                fontSize: 38,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                lineHeight: 1.08,
                margin: 0,
                color: DARK,
              }}>
                {owner}<span style={{ color: MUTED, fontWeight: 300 }}>/</span>{repo}
              </h1>

              <p style={{ fontSize: 15, color: MEDIUM, marginTop: 12, maxWidth: 520, lineHeight: 1.6 }}>
                A physics-informed neural network for geothermal reservoir simulation.
              </p>

              <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  ['⭐', '540 stars'],
                  ['🍴', '76 forks'],
                  ['↓', '1.2K downloads'],
                  ['📅', 'Updated 3d ago'],
                ].map(([icon, label]) => (
                  <span key={label} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 11,
                    color: MUTED,
                  }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {[
                { label: '⭐ Star',     dark: false },
                { label: '🍴 Fork',     dark: false },
                { label: '↓ Download',  dark: false },
                { label: 'Deploy',      dark: true  },
              ].map(btn => (
                <button
                  key={btn.label}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    padding: '10px 18px',
                    borderRadius: 9,
                    border: btn.dark ? 'none' : '1.4px solid #e7e0d2',
                    background: btn.dark ? DARK : '#faf7f0',
                    color: btn.dark ? '#f1ede4' : DARK,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TabBar activeTab={activeTab} onTab={setActiveTab} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 80px' }}>
        {activeTab === 'Overview'     && <OverviewTab />}
        {activeTab === 'Files'        && <FilesTab />}
        {activeTab === 'Versions'     && <VersionsTab />}
        {activeTab === 'Models'       && <LinkedItemsTab type="Models"      items={linkedModels} />}
        {activeTab === 'Datasets'     && <LinkedItemsTab type="Datasets"    items={linkedDatasets} />}
        {activeTab === 'Pipelines'    && <LinkedItemsTab type="Pipelines"   items={linkedPipelines} />}
        {activeTab === 'Experiments'  && <LinkedItemsTab type="Experiments" items={linkedExperiments} />}
        {activeTab === 'Deployments'  && <DeploymentsTab />}
        {activeTab === 'Settings'     && <SettingsTab repo={repo} />}
      </div>
    </div>
  )
}
