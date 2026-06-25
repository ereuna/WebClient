import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchDeployment } from '../api/deployments'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'

const STATUS_COLORS = {
  running: '#2db88a',
  stopped: '#8a857a',
  error: '#e53e3e',
  pending: '#e67e22',
  paused: '#7c6af7',
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || MUTED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 11px', borderRadius: 20,
      background: color + '18', color,
      fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {status}
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

function MetricCard({ label, value, unit, trend }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14,
      padding: '18px 20px', flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: DARK, lineHeight: 1.1 }}>
        {value}<span style={{ fontSize: 14, fontWeight: 500, color: MUTED, marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: trend === 'up' ? '#2db88a' : '#e53e3e',
        }}>
          {trend === 'up' ? '▲' : '▼'}
        </span>
      </div>
    </div>
  )
}

function ActionButton({ children, onClick, variant }) {
  const base = {
    fontFamily: 'inherit', fontSize: 13, padding: '9px 16px', borderRadius: 9,
    cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
    whiteSpace: 'nowrap',
  }
  if (variant === 'primary') {
    return (
      <button onClick={onClick} style={{ ...base, background: DARK, color: BG, border: 'none' }}>
        {children}
      </button>
    )
  }
  if (variant === 'danger') {
    return (
      <button onClick={onClick} style={{ ...base, background: '#fff0f0', color: '#e53e3e', border: '1.4px solid #fcd0d0' }}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick} style={{ ...base, background: '#fff', color: DARK, border: '1.4px solid #ddd6c8' }}>
      {children}
    </button>
  )
}

function TabBar({ tabs, active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e7e0d2', marginBottom: 32 }}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          style={{
            fontFamily: 'inherit', fontSize: 13.5, fontWeight: active === t ? 600 : 400,
            color: active === t ? DARK : MUTED,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 20px',
            borderBottom: active === t ? `2px solid ${ACCENT}` : '2px solid transparent',
            marginBottom: -1,
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function BarChart({ title, bars }) {
  const maxVal = Math.max(...bars.map(b => b.value))
  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 80, flexShrink: 0, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, textAlign: 'right' }}>
              {b.label}
            </div>
            <div style={{ flex: 1, background: '#f5f0e8', borderRadius: 4, height: 22, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${ACCENT} 0%, #e8834a 100%)`,
                width: `${Math.round((b.value / maxVal) * 100)}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ width: 48, flexShrink: 0, fontFamily: "'Space Mono',monospace", fontSize: 11, color: DARK, fontWeight: 600 }}>
              {b.value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED }}>
        requests / sec
      </div>
    </div>
  )
}

function LatencyChart({ p50, p95, p99 }) {
  const maxVal = Math.max(p50, p95, p99)
  const tiers = [
    { label: 'p50', value: p50, color: '#2db88a' },
    { label: 'p95', value: p95, color: '#e67e22' },
    { label: 'p99', value: p99, color: '#e53e3e' },
  ]
  return (
    <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '20px 24px' }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
        Latency (p50 / p95 / p99)
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', height: 120, marginBottom: 12 }}>
        {tiers.map(t => (
          <div key={t.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: t.color }}>
              {t.value}ms
            </div>
            <div style={{
              width: '100%', background: t.color, borderRadius: '4px 4px 0 0',
              height: `${Math.round((t.value / maxVal) * 92)}px`,
              transition: 'height 0.4s ease',
              opacity: 0.85,
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        {tiers.map(t => (
          <div key={t.label} style={{ flex: 1, textAlign: 'center', fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED }}>
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED }}>
        milliseconds
      </div>
    </div>
  )
}

function OverviewTab({ deployment }) {
  const [copied, setCopied] = useState(false)
  const endpointUrl = `https://api.aether.ai/v1/deployments/${deployment.name}`
  const curlSnippet = `curl -X POST ${endpointUrl} \\
  -H "Authorization: Bearer $AETHER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Hello, world!", "max_tokens": 128}'`

  function handleCopy() {
    navigator.clipboard.writeText(endpointUrl).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
      <div>
        <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ebe0' }}>
            <SectionLabel>Endpoint URL</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11, color: DARK,
                flex: 1, wordBreak: 'break-all', lineHeight: 1.6, background: '#faf7f0',
                padding: '10px 12px', borderRadius: 8, border: '1px solid #ece5d6',
              }}>
                {endpointUrl}
              </code>
              <button
                onClick={handleCopy}
                style={{
                  fontFamily: 'inherit', fontSize: 12, padding: '8px 14px', borderRadius: 8,
                  border: '1.4px solid #ddd6c8', background: copied ? '#f0faf5' : '#fff',
                  color: copied ? '#2db88a' : DARK, cursor: 'pointer', fontWeight: 500,
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              cURL example
            </div>
            <pre style={{
              margin: 0, padding: '16px', background: DARK, borderRadius: 10,
              fontFamily: "'Space Mono',monospace", fontSize: 11.5, lineHeight: 1.7,
              color: '#c8c0b0', overflowX: 'auto',
            }}>
              <code>{curlSnippet}</code>
            </pre>
          </div>
        </div>
      </div>

      <div>
        <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ebe0' }}>
            <SectionLabel>Configuration</SectionLabel>
          </div>
          <div style={{ padding: '4px 20px 12px' }}>
            {[
              ['Model', deployment.model],
              ['Version', deployment.version],
              ['Hardware', 'A100 GPU'],
              ['Region', deployment.region],
              ['Replicas', `${deployment.replicas} (active)`],
              ['Autoscale min', '1'],
              ['Autoscale max', '8'],
              ['Timeout', '30s'],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f5f0e8' : 'none',
                fontSize: 13.5,
              }}>
                <span style={{ color: MUTED, fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{k}</span>
                <span style={{ fontWeight: 500, color: DARK }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricsTab({ deployment }) {
  const rpsData = [
    { label: '03:09', value: 142 },
    { label: '03:10', value: 178 },
    { label: '03:11', value: 203 },
    { label: '03:12', value: 188 },
    { label: '03:13', value: 165 },
    { label: '03:14', value: deployment.requestsPerSec || 180 },
  ]

  const latency = {
    p50: deployment.latencyMs || 42,
    p95: Math.round((deployment.latencyMs || 42) * 2.3),
    p99: Math.round((deployment.latencyMs || 42) * 4.1),
  }

  return (
    <div>
      <BarChart title="Requests per second" bars={rpsData} />
      <LatencyChart p50={latency.p50} p95={latency.p95} p99={latency.p99} />
    </div>
  )
}

function LogsTab() {
  const logs = [
    '[2026-06-25 03:14:01] INFO  Server started on port 8080',
    '[2026-06-25 03:14:08] INFO  Model loaded from cache: bert-sentiment-v2',
    '[2026-06-25 03:14:15] INFO  Health check passed — all replicas healthy',
    '[2026-06-25 03:14:22] INFO  Request received: POST /predict',
    '[2026-06-25 03:14:22] INFO  Tokenizing input (len=47)',
    '[2026-06-25 03:14:22] INFO  Inference complete in 41ms',
    '[2026-06-25 03:14:22] INFO  Response sent: 200 OK',
    '[2026-06-25 03:14:29] WARN  Replica dep-001-r2 memory at 82% — approaching limit',
    '[2026-06-25 03:14:35] INFO  Request received: POST /predict',
    '[2026-06-25 03:14:35] INFO  Inference complete in 39ms',
    '[2026-06-25 03:14:40] INFO  Autoscaler check: current=3 replicas, load=61%',
    '[2026-06-25 03:14:50] INFO  Request received: POST /predict',
    '[2026-06-25 03:14:50] INFO  Inference complete in 44ms',
    '[2026-06-25 03:14:58] INFO  Metrics flushed to collector',
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED }}>
          Live log stream — last 14 events
        </div>
        <button style={{
          fontFamily: 'inherit', fontSize: 13, padding: '8px 16px', borderRadius: 9,
          border: '1.4px solid #ddd6c8', background: '#fff', color: DARK, cursor: 'pointer', fontWeight: 500,
        }}>
          Download logs
        </button>
      </div>
      <div style={{
        background: DARK, color: '#a8d8a8', fontFamily: 'monospace', fontSize: 12,
        padding: 16, borderRadius: 10, lineHeight: 1.8, overflowX: 'auto',
      }}>
        {logs.map((line, i) => {
          const isWarn = line.includes('WARN')
          const isErr = line.includes('ERROR')
          return (
            <div key={i} style={{
              color: isWarn ? '#f6c90e' : isErr ? '#fc8181' : '#a8d8a8',
            }}>
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SettingsTab() {
  const [minReplicas, setMinReplicas] = useState(1)
  const [maxReplicas, setMaxReplicas] = useState(8)
  const [timeoutVal, setTimeoutVal] = useState(30)
  const [hardware, setHardware] = useState('A100')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    fontFamily: 'inherit', fontSize: 14, padding: '10px 14px', borderRadius: 9,
    border: '1.4px solid #ddd6c8', background: '#fff', color: DARK,
    width: '100%', boxSizing: 'border-box', outline: 'none',
  }

  const labelStyle = {
    display: 'block', fontFamily: "'Space Mono',monospace", fontSize: 10,
    color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7,
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: '#fff', border: '1px solid #e7e0d2', borderRadius: 14, padding: '24px 28px' }}>
        <SectionLabel>Scaling</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Min replicas</label>
            <input
              type="number" min={0} max={16} value={minReplicas}
              onChange={e => setMinReplicas(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Max replicas</label>
            <input
              type="number" min={1} max={32} value={maxReplicas}
              onChange={e => setMaxReplicas(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        <SectionLabel>Runtime</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
          <div>
            <label style={labelStyle}>Timeout (seconds)</label>
            <input
              type="number" min={1} max={300} value={timeoutVal}
              onChange={e => setTimeoutVal(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Hardware tier</label>
            <select
              value={hardware}
              onChange={e => setHardware(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="A10G">A10G GPU</option>
              <option value="A100">A100 GPU</option>
              <option value="H100">H100 GPU</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            fontFamily: 'inherit', fontSize: 14, padding: '11px 24px', borderRadius: 10,
            border: 'none', background: saved ? '#2db88a' : DARK, color: '#fff',
            fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '52px 28px 44px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 12, width: 160, background: '#e7e0d2', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 38, width: 280, background: '#e7e0d2', borderRadius: 8, marginBottom: 14 }} />
          <div style={{ height: 14, width: 380, background: '#ece5d6', borderRadius: 6, marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            {[90, 80, 80, 80].map((w, i) => (
              <div key={i} style={{ height: 36, width: w, background: '#ece5d6', borderRadius: 9 }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ flex: 1, height: 90, background: '#e7e0d2', borderRadius: 14 }} />
          ))}
        </div>
        <div style={{ height: 400, background: '#e7e0d2', borderRadius: 14 }} />
      </div>
    </div>
  )
}

export default function DeploymentDetailPage() {
  const { deployId } = useParams()
  const [deployment, setDeployment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchDeployment(deployId).then(data => {
      setDeployment(data)
      setLoading(false)
    }).catch(() => {
      setNotFound(true)
      setLoading(false)
    })
  }, [deployId])

  if (loading) return <Skeleton />

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e7e0d2' }}>404</div>
        <div style={{ fontSize: 16, color: MUTED }}>Deployment not found.</div>
        <Link to="/deployments" style={{ color: ACCENT, fontSize: 14, textDecoration: 'none' }}>← Back to Deployments</Link>
      </div>
    )
  }

  const { name, model, version, status, replicas, latencyMs, requestsPerSec, gpuUsage, cost, region, createdAt } = deployment

  const createdDate = new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const metrics = [
    { label: 'Requests / sec', value: requestsPerSec, unit: 'r/s', trend: 'up' },
    { label: 'Latency', value: latencyMs ?? '—', unit: latencyMs ? 'ms' : '', trend: 'down' },
    { label: 'GPU Usage', value: gpuUsage ? `${Math.round(gpuUsage * 100)}` : '0', unit: '%', trend: 'up' },
    { label: 'Replicas', value: replicas, unit: '', trend: replicas > 1 ? 'up' : 'down' },
    { label: 'Cost / hr', value: `$${cost.toFixed(2)}`, unit: '', trend: 'up' },
  ]

  const TABS = ['Overview', 'Metrics', 'Logs', 'Settings']

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{ background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)', borderBottom: '1px solid #e3dccd', padding: '40px 28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link to="/deployments" style={{ color: MUTED, textDecoration: 'none' }}>Deployments</Link>
            <span>›</span>
            <span style={{ color: DARK }}>{name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <StatusBadge status={status} />
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '4px 10px',
                  borderRadius: 20, border: '1px solid #e7e0d2', color: MUTED, background: '#faf7f0',
                }}>
                  {model}
                </span>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '4px 10px',
                  borderRadius: 20, border: '1px solid #e7e0d2', color: MUTED, background: '#faf7f0',
                }}>
                  {version}
                </span>
              </div>

              <h1 style={{ fontSize: 38, letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1.08, margin: 0, color: DARK }}>
                {name}
              </h1>

              <div style={{ display: 'flex', gap: 18, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ◎ {region}
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ⊕ Created {createdDate}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <ActionButton variant="primary">▶ Scale</ActionButton>
              <ActionButton>⏸ Pause</ActionButton>
              <ActionButton>📋 Logs</ActionButton>
              <ActionButton variant="danger">🗑 Delete</ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 80px' }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
          {metrics.map(m => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        <TabBar tabs={TABS} active={activeTab} onSelect={setActiveTab} />

        {activeTab === 'Overview' && <OverviewTab deployment={deployment} />}
        {activeTab === 'Metrics' && <MetricsTab deployment={deployment} />}
        {activeTab === 'Logs' && <LogsTab />}
        {activeTab === 'Settings' && <SettingsTab />}
      </div>
    </div>
  )
}
