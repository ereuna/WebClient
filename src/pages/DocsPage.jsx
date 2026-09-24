import { useState } from 'react'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'
import { renderMarkdown } from '../lib/markdown.jsx'

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
      { id: 'upload', label: 'Creating a model repository' },
      { id: 'model-card', label: 'Model repository files' },
      { id: 'physics-check', label: 'Physics constraint checker' },
      { id: 'versioning', label: 'Versioning & tags' },
    ],
  },
  {
    group: 'Datasets',
    items: [
      { id: 'dataset-repo', label: 'Creating a dataset repository' },
      { id: 'dataset-files', label: 'Dataset repository files' },
    ],
  },
  {
    group: 'Python SDK',
    items: [
      { id: 'sdk-install', label: 'Installation' },
      { id: 'sdk-infer', label: 'Running inference' },
      { id: 'sdk-dataset', label: 'Loading datasets' },
    ],
  },
  {
    group: 'REST API',
    items: [
      { id: 'api-auth', label: 'Authentication' },
      { id: 'api-infer', label: 'Inference endpoint' },
      { id: 'api-search', label: 'Search & filter' },
    ],
  },
]

const content = {
  intro: {
    title: 'Introduction to Ereuna',
    body: `Ereuna is a physics-informed machine learning platform for geothermal energy.

GeoSight is a demo geothermal application running on synthetic and public data. Models on the platform utilize **EnergyGraph** — Ereuna's data representation schema comprising **PhysicsSpec**, **SensorGraph**, and **FieldState**.

## What makes Ereuna different

Ereuna includes a physics constraint checker to verify governing equations and energy conservation bounds before model outputs are accepted.

## Technical & Regional Context

Geothermal reservoir modelling of this class is a **Type 2 inverse PINN problem**: 3D transient heat conduction with spatially varying thermal conductivity k(x). Inverse PINN formulations are the relevant archetype where subsurface parameters are unknown.

The East African Rift System is a significant geothermal region; Kenyan fields including Olkaria and Menengai are located there.`,
  },
  quickstart: {
    title: 'Quickstart',
    body: `Get from zero to your first inference call in under five minutes.

## 1. Install the SDK

\`\`\`bash
pip install ereuna-geothermal
\`\`\`

## 2. Authenticate

Create an API key at **ereuna.energy/settings/keys**, then:

\`\`\`bash
export EREUNA_API_KEY=ak_live_...
\`\`\`

## 3. Run inference

\`\`\`python
import ereuna

model = ereuna.load("your-org/your-model")

# Build an EnergyGraph with your site features
graph = ereuna.EnergyGraph.from_csv("geothermal_wells.csv")

# Infer 3D temperature and thermal conductivity k(x)
result = model.predict(graph)
print(result.field_state)
\`\`\`

## 4. Physics Constraint Check

\`\`\`python
from ereuna.checks import PhysicsSpec

report = PhysicsSpec().run(model, graph, result)
print(report.pass_status)
\`\`\``,
  },
  concepts: {
    title: 'Core concepts',
    body: `## EnergyGraph Schema

EnergyGraph is Ereuna's data representation schema. It comprises three core objects:

- **PhysicsSpec**: Governing PDE equations, boundary conditions, and inferred terms.
- **SensorGraph**: Geothermal well and sensor instrument topology.
- **FieldState**: Discretised scalar snapshots of subsurface state.

## Technical Problem Formulation

Geothermal reservoir modelling of this class is a Type 2 inverse PINN problem: 3D transient heat conduction with spatially varying thermal conductivity k(x). Inverse PINN formulations are the relevant archetype where subsurface parameters are unknown.

## Regional Geological Setting

The East African Rift System is a significant geothermal region; Kenyan fields including Olkaria and Menengai are located there.

## Physics Constraint Checker

Ereuna includes a physics constraint checker that evaluates PDE residual bounds and conservation principles.`,
  },
  'eg-spec': {
    title: 'The EnergyGraph specification',
    body: `EnergyGraph is Ereuna's data representation schema comprising PhysicsSpec, SensorGraph, and FieldState.

## Python dataclass

\`\`\`python
@dataclass
class EnergyGraph:
    physics_spec: PhysicsSpec  # PDE class & boundary conditions
    sensor_graph: SensorGraph  # Wellbore & instrument graph topology
    field_state: FieldState    # Spatiotemporal discretised state
    meta: GraphMeta            # Region, field, timestamps
\`\`\`

## GraphMeta fields

| Field | Type | Description |
|-------|------|-------------|
| \`domain\` | \`str\` | \`geothermal\` |
| \`region\` | \`str\` | Regional location (e.g. East African Rift System) |
| \`t_start\` | \`datetime\` | Window start |
| \`t_end\` | \`datetime\` | Window end |`,
  },
  upload: {
    title: 'Creating a model repository',
    body: `Model repositories are created and pushed using the Ereuna CLI (\`ereuna\`).

\`\`\`bash
mkdir geothermal-pinn && cd geothermal-pinn
ereuna init --type MODEL
ereuna repo create geothermal-pinn --type MODEL --description "PINN for geothermal reservoir modelling"
\`\`\`

Push files with \`ereuna add .\`, \`ereuna commit\`, and \`ereuna push\`.`,
  },
  'model-card': {
    title: 'Model repository files',
    body: `Model repository convention files rendered on Ereuna model pages:

| File | Description |
|------|-------------|
| \`README.md\` | Model description and physics spec |
| \`config.json\` | Framework and architecture parameters |
| \`hyperparameters.json\` | Training run parameters |
| \`params.json\` | Model input/output tensor schema |`,
  },
  'dataset-repo': {
    title: 'Creating a dataset repository',
    body: `Dataset repositories store geothermal observation datasets. Use \`ereuna init --type DATASET\` to initialize.`,
  },
  'dataset-files': {
    title: 'Dataset repository files',
    body: `Supported formats include CSV/TSV, Parquet, JSON, NetCDF (\`.nc\`), and HDF5 (\`.h5\`).`,
  },
  'sdk-install': {
    title: 'SDK Installation',
    body: `Install the geothermal SDK:

\`\`\`bash
pip install ereuna-geothermal
\`\`\``,
  },
  'api-auth': {
    title: 'API Authentication',
    body: `All REST API endpoints require a bearer token passed in the Authorization header.`,
  },
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState('intro')
  const current = content[activeId] || { title: sections.flatMap(s => s.items).find(i => i.id === activeId)?.label || '', body: '' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHero
        eyebrow="DOCUMENTATION"
        title="Docs"
        description="EnergyGraph spec, geothermal PINN model cards, physics constraint checker, and API reference."
        illustration={PAGE_ILLUSTRATIONS.docs}
        illustrationAlt="Documentation illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px 64px', flex: 1, display: 'flex', gap: 48, paddingTop: 36, width: '100%', boxSizing: 'border-box' }}>
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

        <div style={{ width: 1, background: '#e3dccd', flexShrink: 0 }} />

        <div style={{ flex: 1, maxWidth: 740 }}>
          <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
            {current.title}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderMarkdown(current.body)}
          </div>
        </div>
      </div>
    </div>
  )
}
