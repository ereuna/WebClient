import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BORDER = '1px solid #e7e0d2'
const MONO = "'Space Mono',monospace"

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const QUICK_ACTIONS = [
  { emoji: '🧠', label: 'New Model', desc: 'Upload or create a model repository', to: '/new?type=model' },
  { emoji: '📊', label: 'New Dataset', desc: 'Add a dataset to the platform', to: '/new?type=dataset' },
  { emoji: '🚀', label: 'Launch Training', desc: 'Start an experiment or training run', to: '/experiments' },
  { emoji: '⚡', label: 'Deploy Model', desc: 'Serve a model as an API endpoint', to: '/deployments' },
]

const METRICS = [
  { label: 'Models', value: '12', accent: '#cf5a2a' },
  { label: 'Datasets', value: '8', accent: '#7c6af7' },
  { label: 'Inference Calls', value: '48.2K', accent: '#2db88a' },
  { label: 'Storage', value: '234 GB', accent: '#3498db' },
]

const ACTIVITY = [
  { title: 'Training completed', sub: 'resnet50-lr-sweep', time: '2h ago', color: '#2db88a' },
  { title: 'Model deployed', sub: 'bert-sentiment-v2', time: '5h ago', color: '#cf5a2a' },
  { title: 'Dataset uploaded', sub: 'swahili-speech-corpus', time: 'Yesterday', color: '#7c6af7' },
  { title: 'Pipeline executed', sub: 'image-classification-training', time: 'Yesterday', color: '#3498db' },
  { title: 'Experiment started', sub: 'stable-diffusion-lora-v1', time: '2d ago', color: '#e67e22' },
]

const RESOURCES = {
  Repositories: [
    { name: 'resnet50-finetuned', desc: 'Fine-tuned ResNet-50 on custom image corpus', to: '/models/resnet50-finetuned' },
    { name: 'bert-sentiment-v2', desc: 'Sentiment classifier trained on multilingual data', to: '/models/bert-sentiment-v2' },
    { name: 'stable-diffusion-lora-v1', desc: 'LoRA adaptation for African art style generation', to: '/models/stable-diffusion-lora-v1' },
  ],
  Datasets: [
    { name: 'swahili-speech-corpus', desc: '12,000 hours of annotated Swahili speech audio', to: '/datasets/swahili-speech-corpus' },
    { name: 'nairobi-traffic-v2', desc: 'Urban traffic flow sensor data, 2021–2024', to: '/datasets/nairobi-traffic-v2' },
    { name: 'afro-nlp-benchmark', desc: 'Benchmark suite across 18 African NLP tasks', to: '/datasets/afro-nlp-benchmark' },
  ],
  Experiments: [
    { name: 'lr-sweep-resnet50', desc: 'Grid search over learning rate schedules', to: '/experiments/lr-sweep-resnet50' },
    { name: 'bert-multilingual-eval', desc: 'Cross-lingual transfer evaluation run', to: '/experiments/bert-multilingual-eval' },
    { name: 'sd-lora-ablation', desc: 'LoRA rank ablation study for style fidelity', to: '/experiments/sd-lora-ablation' },
  ],
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em',
      color: ACCENT, marginBottom: 14, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function QuickActionCard({ emoji, label, desc, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
      <div
        style={{
          background: '#fff', border: CARD_BORDER, borderRadius: 14,
          padding: '20px 18px', cursor: 'pointer', transition: 'box-shadow .15s, transform .15s',
          height: '100%', boxSizing: 'border-box',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ fontSize: 26, marginBottom: 12, lineHeight: 1 }}>{emoji}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: DARK, marginBottom: 5 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </Link>
  )
}

function MetricStatCard({ label, value, accent }) {
  return (
    <div style={{
      background: '#fff', border: CARD_BORDER, borderRadius: 14,
      padding: '20px 22px', flex: 1,
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{
        fontFamily: MONO, fontSize: 11, color: MUTED,
        marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </div>
    </div>
  )
}

function ActivityItem({ title, sub, time, color, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '13px 0',
      borderBottom: isLast ? 'none' : '1px solid #f0ebe0',
    }}>
      <div style={{
        width: 9, height: 9, borderRadius: '50%', background: color,
        flexShrink: 0, marginTop: 5,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{title}</div>
        <div style={{
          fontFamily: MONO, fontSize: 10.5, color: MUTED,
          marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {sub}
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: '#b0a99a', flexShrink: 0, marginTop: 2 }}>
        {time}
      </div>
    </div>
  )
}

function ResourceCard({ name, desc, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: '#faf7f0', border: CARD_BORDER, borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </Link>
  )
}

function ResourceTabs() {
  const tabs = Object.keys(RESOURCES)
  const [active, setActive] = useState(tabs[0])

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid #e7e0d2' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
              color: active === tab ? ACCENT : MUTED,
              borderBottom: active === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1, transition: 'color .15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RESOURCES[active].map(r => (
          <ResourceCard key={r.name} {...r} />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PageHero
        eyebrow={TODAY}
        title="Dashboard"
        description="Good morning, TomiTsuma"
        illustration={PAGE_ILLUSTRATIONS.dashboard}
        illustrationAlt="Dashboard illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>

        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Quick Actions</SectionLabel>
          <div style={{ display: 'flex', gap: 16 }}>
            {QUICK_ACTIONS.map(a => (
              <QuickActionCard key={a.label} {...a} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Your Metrics</SectionLabel>
          <div style={{ display: 'flex', gap: 16 }}>
            {METRICS.map(m => (
              <MetricStatCard key={m.label} {...m} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          <div style={{ flex: '0 0 calc(60% - 12px)', minWidth: 0 }}>
            <SectionLabel>Recent Activity</SectionLabel>
            <div style={{
              background: '#fff', border: CARD_BORDER, borderRadius: 14,
              padding: '4px 22px',
            }}>
              {ACTIVITY.map((item, i) => (
                <ActivityItem key={item.sub} {...item} isLast={i === ACTIVITY.length - 1} />
              ))}
            </div>
          </div>

          <div style={{ flex: '0 0 calc(40% - 12px)', minWidth: 0 }}>
            <SectionLabel>Recent Resources</SectionLabel>
            <div style={{
              background: '#fff', border: CARD_BORDER, borderRadius: 14,
              padding: '16px 20px',
            }}>
              <ResourceTabs />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
