import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'
import { renderMarkdown } from '../lib/markdown.jsx'

const sections = [
  {
    group: "Getting Started",
    items: [
      { id: "intro", label: "Introduction" },
      { id: "status", label: "What works today" },
      { id: "account", label: "Accounts & sign-in" },
      { id: "platform-map", label: "Finding your way around" },
    ],
  },
  {
    group: "Publish your work",
    items: [
      { id: "publish-overview", label: "Models & datasets on Ereuna" },
      { id: "publish-web", label: "Create a repository on the web" },
      { id: "cli-install", label: "Install the Ereuna CLI" },
      { id: "cli-workflow", label: "Push & pull with the CLI" },
      { id: "model-files", label: "Model repository files" },
      { id: "dataset-files", label: "Dataset repository files" },
      { id: "commits", label: "How commits work" },
    ],
  },
  {
    group: "REST API",
    items: [
      { id: "api-overview", label: "Base URLs" },
      { id: "api-auth", label: "Authentication" },
      { id: "api-repos", label: "Repositories" },
      { id: "api-files", label: "Commits, files & downloads" },
      { id: "api-platform", label: "Platform (read-only)" },
      { id: "api-experimental", label: "Datasets & inference" },
    ],
  },
  {
    group: "Concepts & roadmap",
    items: [
      { id: "eg-spec", label: "EnergyGraph (draft spec)" },
      { id: "roadmap", label: "Planned: SDK, constraint checker, workbench" },
      { id: "limitations", label: "Known limitations" },
    ],
  },
]

const content = {
  "intro": {
    title: "Introduction to Ereuna",
    body: `Ereuna is the computational engine for Kenya's geothermal energy: a place where Rift reservoirs are simulated, modelled and understood, so decisions about where to explore, drill and inject can be tested before they are made in the field.

The platform is organised around **real Kenyan geothermal fields** (Olkaria, Menengai, Eburru, Paka, Silali) and seven **research domains** that follow the resource lifecycle: exploration, seismicity, drilling, petrophysics, reservoir characterization, reservoir engineering, and production/injection engineering.

## What you can do today

- Browse geothermal **Fields**, **Domains**, the first **Research** study (RIFT-01, temperature prediction for Kenyan wells) and the first **Benchmark** (temperature at depth).
- Create an account and publish **model** and **dataset repositories**, from the browser or with the Ereuna CLI.
- Clone and download any published repository.

Simulation, training and validation in the **Workbench** are not running yet. See [What works today](/docs#status) before you plan work around a feature.

## Field data policy

Field profiles are built from published sources only, not operator data. If you publish a dataset, include its source and licence in the repository README.`,
  },
  "status": {
    title: "What works today",
    body: `Ereuna is under active construction. This table is kept in step with the running platform so you know what to rely on.

| Area | Status | Notes |
|------|--------|-------|
| Accounts, sign-in, sessions | Live | Email and password; two-factor and password reset are not wired into the web app yet |
| Model and dataset repositories | Live | Create, upload, browse, star, clone |
| Ereuna CLI | Live | Installed from source; see Install the Ereuna CLI |
| Search | Live | Keyword search over repositories |
| Fields, Domains, Research, Benchmarks pages | Content | Descriptive pages; benchmark scoring is not automated yet |
| Workbench: Simulate, Train, Validate, Monitor, Workflows | Coming soon | Not executable yet |
| Physics constraint checker | Coming soon | Specified, not yet runnable |
| Inference API and Inference Studio | Not available | Requests return HTTP 503 |
| Python SDK | Not available | Use the CLI or REST API |
| GeoSight demo app | Not available | Listed as a demo; not deployed |
| Organizations and teams | Partial | API exists; web pages need sign-in and are incomplete |`,
  },
  "account": {
    title: "Accounts & sign-in",
    body: `## Create an account

- **1.** Go to [/register](/register) and choose a username, your email and a password of at least 10 characters.
- **2.** A verification email is sent to the address you register with.
- **3.** Sign in at [/login](/login).

Your username becomes the owner in every repository path: \`app.ereuna.org/<username>/<repository>\`.

## Two-factor authentication

The account API supports TOTP two-factor authentication, but neither the web sign-in page nor the CLI can complete a two-factor challenge yet. **Do not enable it**: you would not be able to sign in. The toggle under **Settings → Security** is display-only.

## Forgotten password

The sign-in page has no reset link yet. The API endpoint exists: \`POST /api/auth/auth/forgot-password\` with \`{"email": "..."}\` emails a reset link, and \`POST /api/auth/auth/reset-password\` with \`{"token": "...", "new_password": "..."}\` sets the new password.

## Sessions

**Settings → Security** lists your active sessions and lets you revoke them.`,
  },
  "platform-map": {
    title: "Finding your way around",
    body: `| Page | What it is for |
|------|----------------|
| [Research](/research) | Reproducible studies that tie a field, a simulation, a model and a validation together |
| [Domains](/domains) | The seven stages of the geothermal resource lifecycle and what each one observes |
| [Fields](/fields) | Kenyan geothermal fields, their geology and the published sources behind them |
| [Workbench](/workbench) | Where simulate, train, validate and monitor actions will run (coming soon) |
| [Benchmarks](/benchmarks) | Evaluation tasks with explicit splits and scoring criteria |
| [Models](/models) | Published model repositories |
| [Datasets](/datasets) | Published dataset repositories |
| [Repositories](/repositories) | Every repository, all types |
| [Search](/search) | Keyword search across repositories |
| [New repository](/new) | Create a model or dataset repository (sign-in required) |

**Models** and **Datasets** are not in the top navigation yet. Use the links above or the search box.`,
  },
  "publish-overview": {
    title: "Models & datasets on Ereuna",
    body: `Everything you publish lives in a **repository**. A repository has an owner (you), a slug (its URL name), a type, a visibility, catalog metadata, and a history of commits that hold files.

| Type | Shows up in | Rendered from |
|------|-------------|---------------|
| \`MODEL\` | [/models](/models) | \`README.md\`, \`config.json\`, \`hyperparameters.json\`, \`params.json\` |
| \`DATASET\` | [/datasets](/datasets) | \`README.md\`, \`schema.json\`, \`profile.json\`, \`validation.json\` |

Other types (\`PIPELINE\`, \`SPACE\`, \`AGENT\`, \`WORKFLOW\`) can be created but have no dedicated pages yet.

## Two ways to publish

- **On the web**: best for a first upload and the only way today to set catalog metadata (title, model family or dataset domain, format, licence, tags, card illustration). See [Create a repository on the web](/docs#publish-web).
- **With the CLI**: best for repeated pushes from a working folder. See [Push & pull with the CLI](/docs#cli-workflow).

The recommended flow is: create the repository on the web, then \`ereuna clone\` it and push from your machine.

## Before you publish

Private visibility is not yet enforced on listing and download endpoints, so treat every repository as public. Do not upload data you are not permitted to share.`,
  },
  "publish-web": {
    title: "Create a repository on the web",
    body: `- **1.** Sign in and open [/new](/new).
- **2.** Choose **Model** or **Dataset**.
- **3.** Fill in the title (the slug is generated from it), description, licence and tags.
- Models: pick a **model family** (PINN, GNN / NNP, Grid RL, Forecasting, Generative, Other).
- Datasets: pick a **domain** (one of the seven research domains) and a **format**.
- **4.** Pick a card illustration. You can change it later from the repository page.
- **5.** Choose visibility. New web repositories default to **public**.
- **6.** Select **Create repository**. You land on the upload page for the new repository.
- **7.** Drag in your files and commit them with a message.

The title, family or domain, format, licence, tags and illustration are stored as the repository's catalog metadata. They drive the cards on [/models](/models) and [/datasets](/datasets). Files you push do not change them.`,
  },
  "cli-install": {
    title: "Install the Ereuna CLI",
    body: `The CLI (\`ereuna\`) syncs a local folder with an Ereuna repository, in the style of \`git\` or the Hugging Face CLI. It needs Python 3.10 or newer.

It is not on PyPI yet. Install it from the source checkout:

\`\`\`bash
cd EreunaCLI
pip install -e .
ereuna --version
\`\`\`

## Sign in

\`\`\`bash
ereuna login -e you@example.com
\`\`\`

The CLI prompts for your password and stores tokens in \`~/.ereuna/credentials.json\`. By default it talks to the hosted platform:

| Setting | Default |
|---------|---------|
| Auth endpoint | \`https://app.ereuna.org/api/auth\` |
| Repository endpoint | \`https://app.ereuna.org/api/repository\` |

You can also paste an access token obtained from the API (see [Authentication](/docs#api-auth)) with \`ereuna login --token <access_token>\`.

Check who you are signed in as with \`ereuna whoami\`. Sign out with \`ereuna logout\`.

## Pointing at a local stack

For a local Docker Compose or PM2 stack, the services are reached directly, so include \`/api/v1\`:

\`\`\`bash
export EREUNA_AUTH_ENDPOINT=http://localhost:8000/api/v1
export EREUNA_ENDPOINT=http://localhost:8001/api/v1
ereuna login -e you@example.com
\`\`\``,
  },
  "cli-workflow": {
    title: "Push & pull with the CLI",
    body: `## Start from a repository you created on the web (recommended)

\`\`\`bash
ereuna clone <username>/<slug>
cd <slug>
# add or edit files
ereuna status
ereuna add .
ereuna commit -m "Add trained weights and model card"
ereuna push
\`\`\`

## Create a new repository from a folder

\`\`\`bash
cd geothermal-pinn
ereuna init --type MODEL --public
\`\`\`

\`ereuna init\` creates the remote repository for you, using the folder name as the slug (override with \`--slug\`). Do not also run \`ereuna repo create\` for the same name; that fails because the repository already exists.

Repositories created from the CLI:

- are **private by default**; pass \`--public\` to make them public,
- have **no catalog metadata**, so their card shows the slug as the title and the domain as Unknown. Create the repository on the web if you want a complete card.

## Commands

| Command | What it does |
|---------|--------------|
| \`ereuna login\` / \`logout\` / \`whoami\` | Manage your stored credentials |
| \`ereuna repo create SLUG --type MODEL\` | Create a remote repository without a local folder |
| \`ereuna init --type MODEL\` | Create a remote repository and link the current folder |
| \`ereuna clone owner/slug [dir]\` | Download the latest commit into a new folder |
| \`ereuna status\` | Show added, modified and deleted files |
| \`ereuna add [paths...]\` | Stage files for the next push |
| \`ereuna commit -m "msg"\` | Record the message (and a local git commit) |
| \`ereuna push\` | Upload staged files, or all changed files with \`--all\` |
| \`ereuna pull\` | Download the latest remote commit (\`--force\` overwrites local changes) |
| \`ereuna git <args>\` | Run git inside the repository folder |

Changed files are detected by SHA-256 hash. \`.gitignore\` and \`.ereunaignore\` are respected. Each push is uploaded through the API with a 512 MB limit per request.

Read [How commits work](/docs#commits) before your second push.`,
  },
  "model-files": {
    title: "Model repository files",
    body: `The model page reads four file names from the **latest commit**. Each is optional; a section appears only when its file exists and parses. Names are matched case-insensitively, at the root or in a subfolder.

| File | Renders as |
|------|------------|
| \`README.md\` | README section: what the model does, training data, intended use, limitations |
| \`config.json\` | Configuration table |
| \`hyperparameters.json\` | Hyperparameters table; nested keys are flattened to dot notation |
| \`params.json\` | Inference contract card in the sidebar |

## config.json

These keys are pulled out as highlighted fields; any other keys are listed below them: \`framework\`, \`model_type\`, \`architecture\`, \`task\`, \`family\`, \`version\`, \`license\`, \`optimizer\`, \`epochs\`, \`batch_size\`, \`parameters\`, \`description\`, \`training_dataset\` (or \`dataset\`), \`dataset_version\`.

Set \`training_dataset\` to a dataset repository as \`owner/slug\` to link the two.

\`\`\`json
{
  "framework": "pytorch",
  "family": "PINN",
  "task": "temperature-log-regime-classification",
  "parameters": 412873,
  "training_dataset": "<username>/olkaria-temperature-logs"
}
\`\`\`

## params.json

Describe the inputs and outputs a caller must provide, with real shapes (\`null\` for the batch dimension):

\`\`\`json
{
  "inputs": [{ "name": "depth_m", "shape": [null, 512], "dtype": "float32", "description": "Measured depth" }],
  "outputs": [{ "name": "regime", "shape": [null, 512, 5], "dtype": "float32", "description": "Per-section regime probabilities" }]
}
\`\`\`

Validate every JSON file before you push. A syntax error hides that section without an error message.`,
  },
  "dataset-files": {
    title: "Dataset repository files",
    body: `The dataset page reads four file names from the **latest commit**, plus a list of every file in that commit.

| File | Renders as |
|------|------------|
| \`README.md\` | README section; replaces the description when present |
| \`schema.json\` | One schema table per data file |
| \`profile.json\` | One profile card per data file |
| \`validation.json\` | Validation findings per data file |

Data files themselves (CSV/TSV, Parquet, JSON/JSONL, NetCDF \`.nc\`, HDF5 \`.h5\`) are listed with their sizes and can be downloaded. There is no in-browser preview or SQL query yet.

## schema.json

\`\`\`json
{ "files": { "wells.parquet": { "format": "parquet", "row_count": 18234,
  "fields": [{ "name": "temperature_c", "dtype": "float32", "description": "Measured temperature" }] } } }
\`\`\`

## profile.json

\`\`\`json
{ "files": { "wells.parquet": { "row_count": 18234, "size_bytes": 5242880, "null_rate": 0.0, "duplicate_rate": 0.0,
  "fields": { "temperature_c": { "min": 21.4, "max": 341.0, "mean": 187.2, "std": 74.9 } } } } }
\`\`\`

Write \`0.0\` rather than leaving a rate out; a missing key is shown as a dash.

## validation.json

\`\`\`json
{ "status": "passed", "files": { "wells.parquet": { "status": "passed",
  "findings": [{ "expectation": "values_between", "column_name": "temperature_c", "severity": "error", "passed": true, "observed_value": "21.4 to 341.0", "expected_value": "0 to 400" }] } } }
\`\`\`

Report only checks you actually ran.

The domain, format and licence on the catalog card come from the repository's metadata (set when you create it on the web), not from these files.`,
  },
  "commits": {
    title: "How commits work",
    body: `Each push creates one commit that contains **only the files uploaded in that push**. Pages and \`ereuna clone\` / \`ereuna pull\` read the **latest commit only**.

That means a push that changes one file hides every file that was not in it: the model or dataset page loses its README and JSON sections, and a fresh clone receives only that one file.

Until commits carry the full file tree, keep the repository complete in every push:

\`\`\`bash
ereuna add .
ereuna push --all
\`\`\`

and make sure the README and the JSON card files are in the folder each time. \`push --all\` uploads every file that changed since your last push, so re-add the card files if they did not change.

Earlier commits are not deleted. Their files stay in storage and are listed under the repository's **Versions** tab.`,
  },
  "api-overview": {
    title: "Base URLs",
    body: `All services sit behind one origin. Public prefixes map to each service's \`/api/v1\`:

| Prefix | Service | Status |
|--------|---------|--------|
| \`https://app.ereuna.org/api/auth\` | Accounts, tokens, users, organizations, API keys | Live |
| \`https://app.ereuna.org/api/repository\` | Repositories, commits, files, search | Live |
| \`https://app.ereuna.org/api/platform\` | Experiments, deployments, pipelines, benchmarks (read-only) | Live, mostly empty |
| \`https://app.ereuna.org/api/datasets\` | Dataset processing service | Experimental |
| \`https://app.ereuna.org/api/inference\` | Inference service | Health check only |

Example: \`POST https://app.ereuna.org/api/auth/auth/login\` reaches the auth service's \`/api/v1/auth/login\`. The doubled \`auth\` is expected.

Downloads are served from presigned URLs on \`https://s3.ereuna.org\`.

Requests and responses are JSON unless noted. Errors return \`{"detail": "..."}\` with the HTTP status. Unknown \`/api/...\` paths currently return the web app's HTML with status 200, so check the \`Content-Type\` of responses.`,
  },
  "api-auth": {
    title: "Authentication",
    body: `Send an access token as \`Authorization: Bearer <access_token>\`. Reading public repositories needs no token. Creating repositories, pushing commits, starring and managing your account do.

## Get a token

\`\`\`bash
curl -s -X POST https://app.ereuna.org/api/auth/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"you@example.com","password":"..."}'
\`\`\`

\`\`\`json
{ "tokens": { "access_token": "eyJ...", "refresh_token": "...", "token_type": "Bearer", "expires_in": 900 },
  "mfa_required": false, "mfa_challenge": null }
\`\`\`

If \`mfa_required\` is \`true\`, finish with \`POST /api/auth/auth/mfa/verify\` and \`{"challenge": "<mfa_challenge>", "code": "123456"}\`.

## Refresh and sign out

| Request | Body |
|---------|------|
| \`POST /api/auth/auth/refresh\` | \`{"refresh_token": "..."}\` returns a new token pair |
| \`POST /api/auth/auth/logout\` | \`{"refresh_token": "..."}\` |
| \`GET /api/auth/users/me\` | Returns your profile |

Access tokens are RS256 JWTs that expire after 15 minutes; refresh tokens last 30 days. The signing keys are not exposed through the public origin.

## API keys

You can create API keys under **Settings → API Keys** (\`/api/auth/auth/api-keys\`). The repository API does not accept them yet; use an access token.`,
  },
  "api-repos": {
    title: "Repositories",
    body: `| Method and path (under \`/api/repository\`) | Auth | Purpose |
|------|------|---------|
| \`GET /repositories?repo_type=MODEL&skip=0&limit=50\` | No | List repositories; filter by \`repo_type\`, \`visibility\`, \`owner_user_id\`, \`owner_org_id\` |
| \`GET /repositories/search?q=olkaria\` | No | Keyword search |
| \`GET /{owner}/{slug}\` | No | Look up a repository by its path |
| \`GET /repositories/{id}\` | No | Look up by id |
| \`POST /repositories\` | Yes | Create |
| \`PATCH /repositories/{id}\` | Yes | Update description, website, visibility, default branch or metadata |
| \`DELETE /repositories/{id}\` | Yes | Delete |
| \`POST /repositories/{id}/fork\` | Yes | Fork to your account |
| \`POST\` / \`DELETE /repositories/{id}/star\` | Yes | Star or unstar |
| \`GET\` / \`POST /repositories/{id}/members\` | Yes for POST | List or add collaborators |

## Create a repository with catalog metadata

\`\`\`bash
curl -s -X POST https://app.ereuna.org/api/repository/repositories \\
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \\
  -d '{"slug":"olkaria-temperature-logs","repo_type":"DATASET","visibility":"public",
       "description":"Digitised Olkaria well temperature logs",
       "metadata":{"title":"Olkaria temperature logs","domain":"Reservoir Characterization",
                   "format":"CSV","license":"CC BY 4.0","tags":["olkaria","temperature"]}}'
\`\`\`

\`visibility\` defaults to \`private\` when omitted. Model repositories use \`"family"\` in place of \`domain\` and \`format\`.

You can add metadata to a repository created from the CLI with \`PATCH /repositories/{id}\` and a \`metadata\` object.`,
  },
  "api-files": {
    title: "Commits, files & downloads",
    body: `| Method and path (under \`/api/repository\`) | Auth | Purpose |
|------|------|---------|
| \`POST /repositories/{id}/commits\` | Yes | Upload files as one commit (multipart form) |
| \`GET /repositories/{id}/commits?limit=50\` | No | List commits, newest first |
| \`GET /repositories/{id}/files/{sha}\` | No | Files in that commit |
| \`GET /repositories/{id}/files/{sha}/presign?path=README.md\` | No | Time-limited download URL |
| \`GET /repositories/{id}/releases\` | No | List releases |

## Push a commit

\`\`\`bash
curl -s -X POST https://app.ereuna.org/api/repository/repositories/$REPO_ID/commits \\
  -H "Authorization: Bearer $TOKEN" \\
  -F 'message=Add model card' \\
  -F 'files=@README.md' -F 'files=@config.json'
\`\`\`

Form fields: \`message\` (required), \`branch\`, \`parent_sha\`, and one \`files\` part per file. The file name is stored as its path. The request body limit is 512 MB.

## Download a file

\`\`\`bash
curl -s "https://app.ereuna.org/api/repository/repositories/$REPO_ID/files/$SHA/presign?path=README.md"
# {"url": "https://s3.ereuna.org/ereuna-models/..."}
\`\`\`

The URL is valid for one hour. See [How commits work](/docs#commits) for why you should read the latest commit's file list first.`,
  },
  "api-platform": {
    title: "Platform (read-only)",
    body: `These endpoints read experiment, deployment, pipeline and benchmark records. There are no write endpoints yet, and most lists are empty today.

| Path (under \`/api/platform\`) | Returns |
|------|---------|
| \`GET /experiments\` | Experiments |
| \`GET /experiments/{id}\` and \`/experiments/{id}/runs\` | One experiment and its runs |
| \`GET /deployments\`, \`/deployments/{slug}\`, \`/deployments/{slug}/logs\` | Deployments and logs |
| \`GET /pipelines\`, \`/pipelines/{repo_id}/runs\` | Pipelines and runs |
| \`GET /benchmarks\`, \`/benchmarks/{slug}\` | Benchmark results |

The benchmark described on [/benchmarks](/benchmarks) (BENCHMARK-01, temperature at depth) is not yet served from this API.`,
  },
  "api-experimental": {
    title: "Datasets & inference",
    body: `## Inference

\`POST /api/platform/inference/{model_slug}\` exists but returns **503 Service Unavailable**: no model runtime is deployed. The Inference Studio page uses this endpoint, so its Run button fails too. The inference service at \`/api/inference\` only answers a health check.

## Datasets service

The service under \`/api/datasets\` (dataset versions, schema, profile, preview, SQL query, lineage) is experimental. It is separate from dataset repositories: datasets you publish through \`/new\` or the CLI do not appear in it, and it does not yet accept the access tokens issued at sign-in. The query endpoint shown on dataset pages is not usable yet.

Use dataset repositories and the files API for now.`,
  },
  "eg-spec": {
    title: "EnergyGraph (draft spec)",
    body: `EnergyGraph is Ereuna's planned data representation for geothermal problems. It is a **draft**: no library or API implements it yet, and models on the platform do not consume it today.

It has three core objects:

- **PhysicsSpec**: governing equations, boundary conditions and inferred terms, for example 3D transient heat conduction with spatially varying thermal conductivity \`k(x)\`.
- **SensorGraph**: the topology of wells and instruments.
- **FieldState**: discretised snapshots of subsurface state, such as temperature and pressure.

\`\`\`python
@dataclass
class EnergyGraph:
    physics_spec: PhysicsSpec  # PDE class and boundary conditions
    sensor_graph: SensorGraph  # wellbore and instrument topology
    field_state: FieldState    # spatiotemporal discretised state
    meta: GraphMeta            # region, field, time window
\`\`\`

| GraphMeta field | Type | Description |
|-----------------|------|-------------|
| \`domain\` | \`str\` | \`geothermal\` |
| \`region\` | \`str\` | For example East African Rift System |
| \`t_start\` | \`datetime\` | Window start |
| \`t_end\` | \`datetime\` | Window end |

Node types, edge types and the JSON / HDF5 serialisation will be documented when the spec is implemented. Each [Domain](/domains) page shows how its observables are expected to map onto EnergyGraph.`,
  },
  "roadmap": {
    title: "Planned: SDK, constraint checker, workbench",
    body: `These are designed but **not available**. They are listed so you can see where the platform is going; do not build on them yet.

| Feature | Plan |
|---------|------|
| Python SDK | Load repositories and run models from Python. Until it ships, use the CLI and REST API. |
| Physics constraint checker | Check model outputs against PDE residual bounds and energy conservation before they are accepted. |
| Workbench | Simulate, Train, Validate, Monitor and Workflows actions, run locally through the CLI engine or as browser-dispatched jobs. |
| Inference API | Synchronous and asynchronous inference for published models. |
| Dataset preview and query | In-browser preview and SQL over Parquet. |

Progress is tracked on [What works today](/docs#status).`,
  },
  "limitations": {
    title: "Known limitations",
    body: `- **Commits are partial snapshots.** Pages and clones read only the latest commit's files. See [How commits work](/docs#commits).
- **Private visibility is not enforced** on list, search and download endpoints. Treat all repositories as public.
- **CLI repositories lack catalog metadata.** Create on the web, or add metadata with \`PATCH /repositories/{id}\`.
- **API keys are not accepted** by the repository API yet. Use an access token.
- **Inference returns 503**, and the Inference Studio cannot run models.
- **The datasets service is not connected** to dataset repositories or to sign-in tokens.
- **Unknown API paths return HTML** with status 200 instead of a JSON 404.
- **Models and Datasets are missing from the top navigation.** Use [/models](/models) and [/datasets](/datasets).
- **Two-factor sign-in and password reset** are not available in the web app or CLI.
- Some signed-in pages (Notifications, Organizations) keep loading when you are signed out instead of asking you to sign in.`,
  },
}

const ALL_IDS = sections.flatMap(s => s.items.map(i => i.id))
const DEFAULT_ID = 'intro'

function idFromHash() {
  if (typeof window === 'undefined') return DEFAULT_ID
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  return ALL_IDS.includes(id) ? id : DEFAULT_ID
}

export default function DocsPage() {
  const [activeId, setActiveIdState] = useState(idFromHash)

  // Deep links: /docs#api-auth opens that section; the hash follows the sidebar.
  useEffect(() => {
    const onHash = () => setActiveIdState(idFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function setActiveId(id) {
    setActiveIdState(id)
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, '', `#${id}`)
  }
  const current = content[activeId] || { title: sections.flatMap(s => s.items).find(i => i.id === activeId)?.label || '', body: '' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHero
        eyebrow="DOCUMENTATION"
        title="Docs"
        description="Publish geothermal models and datasets, use the Ereuna CLI and REST API, and see what works today."
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
