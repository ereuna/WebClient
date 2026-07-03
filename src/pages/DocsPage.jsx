import { useState } from 'react'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'
import { renderMarkdown } from '../lib/markdown.jsx'

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
    title: 'Introduction to Ereuna',
    body: `Ereuna is the community hub for physics-informed machine learning in the energy sector.

Every model in the zoo implements the **EnergyGraph** interface — a common graph representation for energy system state. This means a geothermal reservoir model and a grid dispatch policy can share the same input/output contract, and transfer learning across domains is first-class, not an afterthought.

## What makes Ereuna different

Most ML model repositories are domain-agnostic. Ereuna is opinionated: every model must pass the **physics constraint checker** before it appears. That means conservation of energy and mass are verified, not assumed.

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
pip install ereuna-energy
\`\`\`

## 2. Authenticate

Create an API key at **ereuna.energy/settings/keys**, then:

\`\`\`bash
export EREUNA_API_KEY=ak_live_...
\`\`\`

## 3. Run inference

\`\`\`python
import ereuna

model = ereuna.load("TurkanaWind-24h")

# Build an EnergyGraph with your site features
graph = ereuna.EnergyGraph.from_csv("my_site.csv")

# Forecast the next 24 hours
result = model.predict(graph, horizon="24h")
print(result.generation_kw)   # shape: (24,)
print(result.uncertainty_p90) # calibrated P90 band
\`\`\`

## 4. Check physics

\`\`\`python
from ereuna.checks import PhysicsSpec

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
  upload: {
    title: 'Creating a model repository',
    body: `Model repositories are created and pushed to with the **Ereuna CLI** (\`ereuna\`) — a git-like tool for syncing a local folder with an Ereuna repository.

## 1. Install the CLI

The CLI ships from source inside the monorepo:

\`\`\`bash
cd EreunaCLI
pip install -e .
ereuna --version
\`\`\`

## 2. Authenticate

\`\`\`bash
ereuna login
\`\`\`

This stores a token in \`~/.ereuna/credentials.json\` (auth is handled by **AuthService**, repo storage by **RepositoryService**).

## 3. Create the repository

Two equivalent ways to get started, both take \`--type MODEL\` (repo types are \`MODEL\`, \`DATASET\`, \`PIPELINE\`, \`SPACE\`, \`AGENT\`, \`WORKFLOW\`):

\`\`\`bash
# Option A — turn the current folder into a repo and create the remote for it
mkdir geothermal-pinn && cd geothermal-pinn
ereuna init --type MODEL

# Option B — create the remote first, then clone it locally
ereuna repo create geothermal-pinn --type MODEL --description "PINN for geothermal reservoirs"
ereuna clone yourname/geothermal-pinn
\`\`\`

By default repos are created **private**; pass \`--public\` to make one visible in the model zoo immediately.

## 4. Add your files and push

\`\`\`bash
ereuna add .
ereuna commit -m "Add model weights and metadata"
ereuna push
\`\`\`

\`ereuna status\` shows local-vs-remote diffs before you push; \`ereuna pull\` fetches the latest commit. Changed files are tracked by SHA-256 in \`.ereuna/manifest.json\`, and \`.gitignore\` / \`.ereunaignore\` are respected.

## Alternative: upload from the browser

If you don't want to install the CLI, sign in on **ereuna.energy** and use the **Upload files** button on a model's page (\`/models/:slug/upload\`) to drag-and-drop the same files — it creates a commit the same way \`ereuna push\` does.

## What to commit

At minimum, push your model weights/checkpoint. To get a rich, auto-rendered model page, also include the four convention files described in **Model repository files** — README.md, config.json, hyperparameters.json and params.json.`,
  },
  'model-card': {
    title: 'Model repository files',
    body: `When you \`ereuna push\` files into a **MODEL** repository, the WebClient reads four well-known filenames out of the latest commit and renders them automatically on the model's detail page. All four are optional and independent — a section only appears if its file is present and parses correctly. Filenames are matched case-insensitively, at the repo root or nested in a subdirectory (e.g. \`metadata/config.json\`).

| File | Rendered as | Required keys |
|------|-------------|----------------|
| \`README.md\` | "README" section (markdown) | none — free-form markdown |
| \`config.json\` | "Configuration" table | none — any keys |
| \`hyperparameters.json\` | "Hyperparameters" table | none — any keys |
| \`params.json\` | Sidebar "Inference contract" card | \`inputs\`/\`outputs\` (see below) |

## README.md

Plain markdown, rendered verbatim. If it's missing, the page falls back to the short description you passed to \`ereuna repo create -d "..."\`. Use it the way you'd use a Hugging Face model card — overview, intended use, training data, limitations.

## config.json

General model metadata. There's no enforced schema — any key/value you add is shown as a row — but a fixed set of keys are recognized and pulled out as highlighted fields at the top of the table (everything else still renders below them):

\`framework\`, \`model_type\`, \`architecture\`, \`task\`, \`family\`, \`version\`, \`license\`, \`optimizer\`, \`epochs\`, \`batch_size\`, \`parameters\`, \`description\`, and one of \`training_dataset\` / \`trainingDataset\` / \`dataset\` (also used to link the "Training data" sidebar card back to the dataset), plus \`dataset_version\`.

\`\`\`json
{
  "framework": "PyTorch",
  "model_type": "PINN",
  "architecture": "encoder-decoder",
  "task": "geothermal-reservoir-forecasting",
  "training_dataset": "yourname/geothermal-sensors-2024",
  "dataset_version": "v2.1.0",
  "epochs": 200,
  "batch_size": 32,
  "optimizer": "AdamW",
  "parameters": "42M",
  "license": "Apache-2.0"
}
\`\`\`

## hyperparameters.json

A flat or nested key/value map of the actual training run's hyperparameters. Nested objects are flattened into dot-notation rows (e.g. \`optimizer.weight_decay\`) in a two-column Parameter / Value table.

\`\`\`json
{
  "learning_rate": 3e-4,
  "batch_size": 32,
  "epochs": 200,
  "optimizer": { "name": "AdamW", "weight_decay": 0.01 },
  "scheduler": "cosine"
}
\`\`\`

## params.json

Describes the model's inference input/output contract, shown in the sidebar as "Inputs" / "Expected outputs". It needs an \`inputs\` (or \`input\` / \`input_schema\` / \`inputSchema\`) key and/or an \`outputs\` (or \`output\` / \`output_schema\` / \`outputSchema\`) key. Any of these three shapes works:

\`\`\`json
{
  "inputs": [
    { "name": "well_temperature", "type": "float32", "shape": [24], "description": "Hourly bottom-hole temperature, degC" },
    { "name": "flow_rate", "type": "float32", "shape": [24], "description": "Hourly mass flow rate, kg/s" }
  ],
  "outputs": [
    { "name": "power_output_kw", "type": "float32", "shape": [24], "description": "Forecasted generation" }
  ]
}
\`\`\`

A JSON-Schema-style object (\`{ "properties": { ... } }\`) or a plain \`{ "field_name": { "type": "..." } }\` map are also accepted — see \`InferenceParamsCard\` for the exact normalization rules.`,
  },
  'dataset-repo': {
    title: 'Creating a dataset repository',
    body: `Dataset repositories use the same \`ereuna\` CLI workflow as models — only the \`--type\` flag changes.

## 1–2. Install & authenticate

Same as models: \`pip install -e EreunaCLI\`, then \`ereuna login\`. See **Creating a model repository** for details.

## 3. Create the repository

\`\`\`bash
mkdir geothermal-sensors-2024 && cd geothermal-sensors-2024
ereuna init --type DATASET

# or
ereuna repo create geothermal-sensors-2024 --type DATASET --description "Hourly sensor readings, 2020-2024"
ereuna clone yourname/geothermal-sensors-2024
\`\`\`

## 4. Push your data files

\`\`\`bash
ereuna add .
ereuna commit -m "Add raw sensor readings"
ereuna push
\`\`\`

The platform recognizes tabular and scientific formats: CSV/TSV, Parquet, JSON/JSONL, NetCDF (\`.nc\`), and HDF5 (\`.h5\`/\`.hdf5\`). Pushed files are versioned like any other repo — visible in the repository's **Files** tab, downloadable, and diffed on every \`ereuna push\`.

## Important: this is separate from the searchable dataset record

Pushing files with \`ereuna push\` gives you source-controlled storage and a browsable Files/Versions history — the same as a model repo. It does **not** by itself populate the columns/rows/profile shown on the dataset's catalog page. That data is served live by **DatasetsService**, which has its own \`dataset\` resource (schema, row count, profile, lineage) linked to your repo by \`repo_id\`. A DatasetsService dataset + version currently has to be registered separately (its \`/datasets\` and \`/datasets/{id}/versions\` endpoints, keyed to the same \`repo_id\`) before the "Schema", "Preview", and "Profile" sections on the dataset page populate. See **Dataset repository files** for what to include either way.`,
  },
  'dataset-files': {
    title: 'Dataset repository files',
    body: `Unlike model repositories, dataset repositories don't have a fixed set of convention filenames that the WebClient auto-parses out of a commit. What to push:

## Required: the data itself

One or more data files in a format the platform understands — CSV/TSV, Parquet, JSON/JSONL, NetCDF, or HDF5. Prefer Parquet for large tabular data (columnar, typed, compressed) and NetCDF/HDF5 for gridded or multi-dimensional scientific data.

## Recommended: README.md

Good practice for anyone browsing the repo or running \`ereuna clone\` — describe collection methodology, coverage, units, and known caveats the way you would for a model. Note that today it's shown as plain repo content (Files tab / clone) rather than being auto-rendered on the dataset catalog page the way a model's README.md is (see **Model repository files**) — that gap is worth knowing about if you're relying on it for discoverability.

## Where the catalog page's fields actually come from

The dataset catalog page's domain, format, license, coverage, and schema fields are read from the repository's own \`metadata\` field on RepositoryService, not parsed from files you push. If you need those populated, set them via RepositoryService directly (or the web upload flow) rather than expecting a JSON file in the repo to be picked up automatically.

## Optional: a manifest

For multi-file datasets (e.g. per-year CSVs), a small \`manifest.json\` or \`manifest.csv\` listing files and their contents is good practice for consumers — it isn't parsed by the platform today, but it's the same pattern used for large model checkpoint sets.`,
  },
  'sdk-install': {
    title: 'SDK Installation',
    body: `## Requirements

- Python ≥ 3.10
- PyTorch ≥ 2.2 (CPU or CUDA)

## Install

\`\`\`bash
pip install ereuna-energy
\`\`\`

For GPU support with CUDA 12:

\`\`\`bash
pip install ereuna-energy[cuda12]
\`\`\`

## Verify

\`\`\`python
import ereuna
print(ereuna.__version__)  # 0.9.1
ereuna.ping()              # pong — API key verified
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

1. Sign in at **ereuna.energy**
2. Go to **Settings → API keys**
3. Click **New key**, give it a name, copy it immediately (it won't be shown again)

## Using the key

Pass the key as an \`Authorization\` header:

\`\`\`bash
curl https://api.ereuna.energy/v1/models \\
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
            {renderMarkdown(current.body)}
          </div>
        </div>
      </div>
    </div>
  )
}
