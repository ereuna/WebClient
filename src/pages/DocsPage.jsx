import { useState } from 'react'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'

const ACCENT = '#cf5a2a'

const sections = [
  {
    group: 'Getting Started',
    items: [
      { id: 'intro', label: 'Introduction' },
      { id: 'quickstart', label: 'Quickstart' },
      { id: 'concepts', label: 'Core concepts' },
    ],
  },
  {
    group: 'EnergyGraph',
    items: [
      { id: 'eg-spec', label: 'The EnergyGraph spec' },
      { id: 'eg-nodes', label: 'Node types' },
      { id: 'eg-edges', label: 'Edge types' },
      { id: 'eg-io', label: 'Serialisation (JSON / HDF5)' },
    ],
  },
  {
    group: 'Models',
    items: [
      { id: 'model-card', label: 'Model card format' },
      { id: 'physics-check', label: 'Physics constraint checker' },
      { id: 'upload', label: 'Uploading a model' },
      { id: 'versioning', label: 'Versioning & tags' },
    ],
  },
  {
    group: 'Python SDK',
    items: [
      { id: 'sdk-install', label: 'Installation' },
      { id: 'sdk-infer', label: 'Running inference' },
      { id: 'sdk-dataset', label: 'Loading datasets' },
      { id: 'sdk-bench', label: 'Running benchmarks' },
    ],
  },
  {
    group: 'REST API',
    items: [
      { id: 'api-auth', label: 'Authentication' },
      { id: 'api-infer', label: 'Inference endpoint' },
      { id: 'api-search', label: 'Search & filter' },
      { id: 'api-rate', label: 'Rate limits' },
    ],
  },
]

const content = {
  intro: {
    title: 'Introduction to Aether',
    body: `Aether is the community hub for physics-informed machine learning in the energy sector.

Every model in the zoo implements the **EnergyGraph** interface — a common graph representation for energy system state. This means a geothermal reservoir model and a grid dispatch policy can share the same input/output contract, and transfer learning across domains is first-class, not an afterthought.

## What makes Aether different

Most ML model repositories are domain-agnostic. Aether is opinionated: every model must pass the **physics constraint checker** before it appears. That means conservation of energy and mass are verified, not assumed.

## Who it's for

- **Researchers** building new PINN, GNN, or RL methods for energy applications
- **Engineers** deploying ML models in grid control rooms and geothermal operations centres
- **Policymakers** running scenario analyses on national energy systems

## How to navigate

Start with the Quickstart to run your first inference call. Then read the EnergyGraph spec to understand the shared representation. When you're ready to contribute, the Model card format and Physics constraint checker sections explain what's required.`,
  },
  quickstart: {
    title: 'Quickstart',
    body: `Get from zero to your first inference call in under five minutes.

## 1. Install the SDK

\`\`\`bash
pip install aether-energy
\`\`\`

## 2. Authenticate

Create an API key at **aether.energy/settings/keys**, then:

\`\`\`bash
export AETHER_API_KEY=ak_live_...
\`\`\`

## 3. Run inference

\`\`\`python
import aether

model = aether.load("TurkanaWind-24h")

# Build an EnergyGraph with your site features
graph = aether.EnergyGraph.from_csv("my_site.csv")

# Forecast the next 24 hours
result = model.predict(graph, horizon="24h")
print(result.generation_kw)   # shape: (24,)
print(result.uncertainty_p90) # calibrated P90 band
\`\`\`

## 4. Check physics

\`\`\`python
from aether.checks import PhysicsSpec

report = PhysicsSpec().run(model, graph, result)
print(report.pass_rate)  # target: > 99%
\`\`\`

The constraint checker runs automatically on every hosted model nightly. You can run it locally for development.`,
  },
  concepts: {
    title: 'Core concepts',
    body: `## EnergyGraph

The EnergyGraph is a directed graph where nodes represent physical entities (wells, turbines, buses, molecules) and edges represent flows or coupling terms (power, heat, mass, stress). Every model in the zoo reads and writes this format.

## Model families

| Family | Task | Key constraint |
|--------|------|----------------|
| PINN | Solve PDEs from sparse obs | PDE residual < ε |
| GNN / NNP | Predict material properties | DFT cross-validation |
| Grid RL | Dispatch & scheduling | Energy balance |
| Forecasting | Generation / load prediction | Calibrated uncertainty |
| Generative | Molecular design | Stability & synthesis score |

## Physics constraint checker

Before a model can be listed, it must pass PhysicsSpec — a suite of symbolic checks that verify conservation laws and domain-specific constraints in model outputs. Pass-rate is published on each model card.

## Versioning

Models use semantic versioning (\`major.minor\`). A major bump indicates a breaking change to the EnergyGraph interface. Minor bumps add features without breaking contracts.`,
  },
  'eg-spec': {
    title: 'The EnergyGraph specification',
    body: `EnergyGraph is a typed property graph with first-class physics metadata.

## Python dataclass

\`\`\`python
@dataclass
class EnergyGraph:
    nodes: list[Node]         # physical entities
    edges: list[Edge]         # flows / couplings
    meta: GraphMeta           # domain, region, timestamp
    constraints: list[str]    # active physics checks
\`\`\`

## GraphMeta fields

| Field | Type | Description |
|-------|------|-------------|
| \`domain\` | \`str\` | \`geothermal \| nuclear \| wind \| solar \| hydro \| grid\` |
| \`region\` | \`str\` | ISO 3166-1 alpha-2 country code |
| \`t_start\` | \`datetime\` | Simulation / forecast window start |
| \`t_end\` | \`datetime\` | Simulation / forecast window end |
| \`resolution\` | \`str\` | e.g. \`"1h"\`, \`"15min"\` |

## Serialisation

EnergyGraph serialises to JSON (for small graphs) or HDF5 (for large time-series graphs). Both formats are round-trip lossless.

\`\`\`python
graph.to_json("graph.json")
graph.to_hdf5("graph.h5")

g2 = EnergyGraph.from_json("graph.json")
\`\`\``,
  },
  'sdk-install': {
    title: 'SDK Installation',
    body: `## Requirements

- Python ≥ 3.10
- PyTorch ≥ 2.2 (CPU or CUDA)

## Install

\`\`\`bash
pip install aether-energy
\`\`\`

For GPU support with CUDA 12:

\`\`\`bash
pip install aether-energy[cuda12]
\`\`\`

## Verify

\`\`\`python
import aether
print(aether.__version__)  # 0.9.1
aether.ping()              # pong — API key verified
\`\`\`

## Optional dependencies

| Extra | Installs |
|-------|---------|
| \`[viz]\` | 3Dmol.js bridge for structure visualisation |
| \`[hdf5]\` | h5py for large EnergyGraph serialisation |
| \`[bench]\` | pytest fixtures for benchmark suites |`,
  },
  'api-auth': {
    title: 'API Authentication',
    body: `All REST API endpoints require a bearer token.

## Getting a key

1. Sign in at **aether.energy**
2. Go to **Settings → API keys**
3. Click **New key**, give it a name, copy it immediately (it won't be shown again)

## Using the key

Pass the key as an \`Authorization\` header:

\`\`\`bash
curl https://api.aether.energy/v1/models \\
  -H "Authorization: Bearer ak_live_..."
\`\`\`

## Key types

| Prefix | Scope |
|--------|-------|
| \`ak_live_\` | Production — counts against rate limits |
| \`ak_test_\` | Sandbox — capped at 100 req/day, no billing |

## Rotating keys

Old keys remain valid for 24 hours after rotation to allow zero-downtime deploys. Revoke immediately from the dashboard if compromised.`,
  },
}

function renderContent(raw) {
  const paragraphs = raw.split('\n\n')
  return paragraphs.map((p, i) => {
    if (p.startsWith('## ')) {
      return <h2 key={i} style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10, letterSpacing: '-0.01em' }}>{p.slice(3)}</h2>
    }
    if (p.startsWith('| ')) {
      const rows = p.split('\n').filter(r => !r.match(/^\|[-| ]+\|$/))
      return (
        <div key={i} style={{ overflowX: 'auto', marginTop: 14, marginBottom: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(c => c.trim())
              const Tag = ri === 0 ? 'th' : 'td'
              return (
                <tr key={ri} style={{ borderBottom: '1px solid #ece5d6' }}>
                  {cells.map((c, ci) => (
                    <Tag key={ci} style={{
                      padding: '9px 14px', textAlign: 'left',
                      background: ri === 0 ? '#faf7f0' : 'transparent',
                      fontWeight: ri === 0 ? 600 : 400,
                      fontFamily: ri === 0 ? "'Space Mono',monospace" : 'inherit',
                      fontSize: ri === 0 ? 11 : 13.5,
                      color: ri === 0 ? '#8a857a' : '#1b1a17',
                    }}>
                      {c.trim().replace(/`([^`]+)`/g, '$1')}
                    </Tag>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
    }
    if (p.startsWith('```')) {
      const lines = p.split('\n')
      const code = lines.slice(1, lines.lastIndexOf('```')).join('\n')
      return (
        <pre key={i} style={{
          background: '#1b1a17', color: '#e8e2d6', borderRadius: 10, padding: '16px 18px',
          fontSize: 13, fontFamily: "'Space Mono',monospace", overflowX: 'auto',
          marginTop: 14, marginBottom: 14, lineHeight: 1.6,
        }}>
          <code>{code}</code>
        </pre>
      )
    }
    // Bold **text**
    const parts = p.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} style={{ fontSize: 14.5, color: '#3d3a32', lineHeight: 1.7, marginBottom: 4 }}>
        {parts.map((part, pi) =>
          part.startsWith('**') ? <strong key={pi}>{part.slice(2, -2)}</strong> : part
        )}
      </p>
    )
  })
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState('intro')
  const current = content[activeId] || { title: sections.flatMap(s => s.items).find(i => i.id === activeId)?.label || '', body: 'Coming soon.' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHero
        eyebrow="DOCUMENTATION"
        title="Docs"
        description="EnergyGraph spec, model cards, physics checks, SDK reference and REST API guides."
        illustration={PAGE_ILLUSTRATIONS.docs}
        illustrationAlt="Documentation illustration"
      />

      {/* Body: sidebar + content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px 64px', flex: 1, display: 'flex', gap: 48, paddingTop: 36, width: '100%', boxSizing: 'border-box' }}>
        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          {sections.map(section => (
            <div key={section.group} style={{ marginBottom: 26 }}>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.05em',
                color: '#8a857a', marginBottom: 8,
              }}>
                {section.group.toUpperCase()}
              </div>
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    fontFamily: 'inherit', fontSize: 13.5, padding: '6px 10px', borderRadius: 7,
                    border: 'none', cursor: 'pointer', marginBottom: 1,
                    background: activeId === item.id ? '#f0ebe0' : 'transparent',
                    color: activeId === item.id ? '#1b1a17' : '#56524a',
                    fontWeight: activeId === item.id ? 600 : 400,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: '#e3dccd', flexShrink: 0 }} />

        {/* Content */}
        <div style={{ flex: 1, maxWidth: 740 }}>
          <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
            {current.title}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderContent(current.body)}
          </div>
        </div>
      </div>
    </div>
  )
}
