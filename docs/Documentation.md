# Ereuna Documentation

Content specification for **https://app.ereuna.org/docs**. Status as of 11 October 2026.

This file holds the full text the docs page should show, section by section. Each `##` heading is a sidebar group. Each `###` heading is one sidebar item; its id (in brackets) is the deep-link anchor, e.g. `/docs#workbench-simulate`. Appendix A is developer reference and is **not** shown in the user sidebar. Appendix B tells whoever edits `WebClient/src/pages/DocsPage.jsx` how to apply this file.

**Guiding principle.** People use Ereuna through **Research, Domains, Fields, Workbench and Benchmarks**. Datasets, models, checkpoints and apps are created and stored by the platform as a side effect of that work. Users never publish them by hand, so the user docs do not teach repositories, uploads or the CLI.

**Status vocabulary** (same as the site): **Live** works today · **Drafted** content exists, not executable · **Coming soon** designed, not built · **Planned** on the roadmap, not designed in detail.

---

## Sidebar map

| Group | Sections (anchor) |
|---|---|
| Getting started | Introduction (`intro`) · What works today (`status`) · Accounts & sign-in (`account`) · How Ereuna is organized (`organized`) |
| Research | Studies (`research-studies`) · RIFT-01: Temperature prediction for Kenyan wells (`research-rift01`) · Reproducing and extending a study (`research-reproduce`) |
| Domains | The geothermal resource lifecycle (`domains-lifecycle`) · The seven domains (`domains-list`) |
| Fields | Kenyan geothermal fields (`fields-list`) · Field data policy (`fields-policy`) · Contributing field data (`fields-contribute`) |
| Workbench | How the Workbench works (`workbench-overview`) · Simulate (`workbench-simulate`) · Train (`workbench-train`) · Validate (`workbench-validate`) · Monitor (`workbench-monitor`) · Workflows (`workbench-workflows`) |
| Benchmarks | How benchmarks work (`benchmarks-overview`) · BENCHMARK-01: Temperature at depth (`benchmarks-01`) |
| Concepts | EnergyGraph (draft spec) (`eg-spec`) · Physics constraint checker (`physics-check`) · How Ereuna keeps your work (`storage`) |
| Reference | Known limitations (`limitations`) · Glossary (`glossary`) · Contact and feedback (`contact`) |

---

## Getting started

### Introduction [`intro`]

Ereuna is the computational engine for Kenya's geothermal energy: the place where Rift reservoirs are simulated, modelled and understood, so that decisions about where to explore, drill and inject can be tested before they are made in the field.

You use Ereuna through five connected areas:

- **[Research](/research)** holds reproducible studies that answer one question about one field.
- **[Domains](/domains)** cover the seven stages of the geothermal resource lifecycle, from exploration to production and injection.
- **[Fields](/fields)** are real Kenyan geothermal fields, built from published sources.
- **[Workbench](/workbench)** is where you simulate, train, validate and monitor.
- **[Benchmarks](/benchmarks)** are fixed evaluation tasks that make results comparable.

Ereuna is under active construction. Read [What works today](/docs#status) before planning work around a feature.

### What works today [`status`]

| Area | Status | What you can do now |
|---|---|---|
| Research | Drafted | Read RIFT-01, the first study, and see how it links field, simulation, model and validation |
| Domains | Drafted (Reservoir Characterization) · Coming soon (other six) | Read each domain's observables, governing physics and EnergyGraph mapping |
| Fields | Coming soon | Read geology, location and source basis for Olkaria, Menengai, Eburru, Paka and Silali |
| Workbench | Coming soon | Read what each action will take in and produce; actions cannot be run yet |
| Benchmarks | Coming soon | Read BENCHMARK-01's task and scoring criteria; scoring is not automated yet |
| Physics constraint checker | Coming soon | Specified, not runnable |
| Accounts | Live | Register, sign in, manage sessions |
| Search | Live | Keyword search from the top bar |
| GeoSight demo | Not available | Listed on the home page as a demo, not deployed |

### Accounts & sign-in [`account`]

**Create an account**

- **1.** Open [/register](/register). Choose a username, enter your email and a password of at least 10 characters.
- **2.** A verification email is sent to that address.
- **3.** Sign in at [/login](/login). Choose "Remember me" to stay signed in on this device.

You do not need an account to read Research, Domains, Fields or Benchmarks. You will need one to run Workbench actions and save studies once they are available.

**Sessions.** **Settings → Security** lists the devices you are signed in on and lets you sign them out.

**Two-factor authentication.** Not available yet. The sign-in page cannot complete a two-factor challenge, and the toggle in Settings does not work. Do not try to turn it on another way.

**Forgotten password.** The sign-in page has no reset link yet. Contact us (see [Contact and feedback](/docs#contact)) and we will reset it.

### How Ereuna is organized [`organized`]

A typical piece of work moves through the five areas in order:

- **1. Research:** open a study, or start from its question. Example: RIFT-01, "Temperature prediction for Kenyan wells".
- **2. Domains:** place the question in the lifecycle. RIFT-01 sits in **Reservoir Characterization**, which tells you the observables (temperature, conductivity k(x), porosity, permeability) and the governing physics.
- **3. Fields:** ground it in a real field. RIFT-01 uses **Olkaria**: its geology and its published borehole temperature profiles.
- **4. Workbench:** run the computation. **Simulate** synthetic reservoir states, **Train** a model on field and synthetic data, **Validate** it against physics, **Monitor** the run, then save the chain as a **Workflow**.
- **5. Benchmarks:** score the result on a fixed task with held-out wells, so it can be compared with other approaches.

The result is attached back to the study, the field and the domain, where others can inspect it and rerun it with their own parameters.

What you never have to do is upload a dataset, publish a model or manage files. Ereuna stores every dataset version, model checkpoint and run behind the scenes, with its lineage. See [How Ereuna keeps your work](/docs#storage).

---

## Research

### Studies [`research-studies`]

A **study** is a reproducible composition that answers one question about one field. Every study names four parts:

| Part | What it is | Where it lives |
|---|---|---|
| Field | The real system the question is about | [Fields](/fields) |
| Simulation | The physics used to generate synthetic data or test scenarios | [Workbench → Simulate](/workbench/simulate) |
| Model | The method fitted to field and synthetic data | [Workbench → Train](/workbench/train) |
| Validation | How the answer is checked: physics compliance and a benchmark | [Workbench → Validate](/workbench/validate), [Benchmarks](/benchmarks) |

Because every part is recorded, a study can be rerun exactly, or rerun with changed parameters to answer a new question.

**Status:** Drafted. Studies are described on the Research page; running them is not available yet.

### RIFT-01: Temperature prediction for Kenyan wells [`research-rift01`]

**Question.** From published temperature logs, can we recover the subsurface thermal regime of a well (upflow, outflow, recharge, compound, isothermal) and predict temperature at depth with honest uncertainty?

| Part | RIFT-01 |
|---|---|
| Field | [Olkaria](/fields/olkaria), Central Kenya Rift |
| Simulation | Synthetic temperature logs from conduction and advection physics, used for pre-training |
| Model | Temperature-log regime classifier trained on synthetic and digitised Olkaria logs |
| Validation | [BENCHMARK-01: Temperature at depth](/docs#benchmarks-01) and physics compliance |

**Data basis.** Temperature logs digitised from published figures and reports, with the source cited for every well. No operator data is used.

**Status:** In progress. Results will be added to this study when the evaluation is complete.

### Reproducing and extending a study [`research-reproduce`]

**Planned.** When Workbench Workflows are available, each study will have a **Rerun** action that repeats the saved workflow, and a **Rerun with parameters** action, for example another field, other wells or a different model setting. Your rerun becomes a new version of the study, linked to the original, and its benchmark score appears beside the original score.

---

## Domains

### The geothermal resource lifecycle [`domains-lifecycle`]

Domains follow a geothermal resource from first survey to long-term operation. Each domain page lists:

- the **observables** measured at that stage,
- the **governing physics** used to interpret them,
- the **EnergyGraph** objects (PhysicsSpec, SensorGraph, FieldState) the stage maps onto,
- the Workbench actions and studies that use it.

### The seven domains [`domains-list`]

| # | Domain | Focus | Status |
|---|---|---|---|
| 01 | [Exploration](/domains/exploration) | Surface geophysics and magnetotelluric arrays, resistivity inversion, prospect ranking | Coming soon |
| 02 | [Seismicity](/domains/seismicity) | Surface seismometer arrays, wave propagation, hypocentre location to about 4 km depth | Coming soon |
| 03 | [Drilling](/domains/drilling) | Casing design (conductor, intermediate, slotted liner) and bit penetration through geothermal formations | Coming soon |
| 04 | [Petrophysics](/domains/petrophysics) | Porosity and permeability from core, thin-section mineralogy, rock property curves with depth | Coming soon |
| 05 | [Reservoir Characterization](/domains/reservoir-characterization) | Layered 3D property models, including inferred thermal conductivity k(x), stratigraphic horizons and well intersections | Drafted |
| 06 | [Reservoir Engineering](/domains/reservoir-engineering) | Finite-volume simulation, caprock and basement no-flow boundaries, injection plume dynamics, mass and energy balance | Coming soon |
| 07 | [Production/Injection Engineering](/domains/production-injection) | Production and injection wells, surface manifold, reinjection and circulation through fractured rock | Coming soon |

---

## Fields

### Kenyan geothermal fields [`fields-list`]

| Field | Location | Setting | Studies |
|---|---|---|---|
| [Olkaria](/fields/olkaria) | Naivasha, Central Kenya Rift (0°53′S, 36°18′E) | High-temperature volcanic complex; caldera collapse and N–S normal faults; rhyolite and trachyte hosts | RIFT-01 (in progress) |
| [Menengai](/fields/menengai) | Nakuru, Central Kenya Rift (0°12′S, 36°04′E) | Large Quaternary caldera; post-caldera trachytes; high gradients along intra-rift faults | Rift caldera thermal modelling (planned) |
| [Eburru](/fields/eburru) | North of Lake Naivasha (0°38′S, 36°14′E) | Rhyolitic and pantelleritic domes; vapour-dominated zone at shallow to intermediate depth | Vapour-dominated reservoir simulation (planned) |
| [Paka](/fields/paka) | Baringo County, Northern Kenya Rift (0°55′N, 36°11′E) | Shield volcano with summit caldera; boiling springs along rift-parallel faults | Northern rift prospect characterization (planned) |
| [Silali](/fields/silali) | Baringo County, Northern Kenya Rift | Caldera volcano in the Baringo–Silali prospect | Regional fault-controlled heat sweep (planned) |

Each field page shows geology, the source basis, published borehole profiles (coming soon) and the studies built on that field.

### Field data policy [`fields-policy`]

- Field profiles are built **from published sources only**: peer-reviewed papers, Stanford Geothermal Workshop and World Geothermal Congress proceedings, UNU-GTP / GRÓ GTP reports and public geological surveys.
- **No operator data** is used unless an operator has agreed to share it under written terms.
- Every well and every data point carries its **source citation**.
- Data digitised from figures is labelled **"digitised from published figures"**, with its estimated digitisation error.

### Contributing field data [`fields-contribute`]

**Planned.** You will be able to add data to a field, for example temperature logs digitised from a paper or a published well report. You give the field, the well, the source citation and the values. Ereuna stores the data as a versioned record, checks it for basic consistency and makes it available to Workbench actions and studies on that field. You do not create or manage a dataset yourself.

Until then, send published data you would like included to us (see [Contact and feedback](/docs#contact)) with the full citation.

---

## Workbench

### How the Workbench works [`workbench-overview`]

The Workbench is where computation runs. It has five actions, normally used in this order:

| Step | Action | In one line | Status |
|---|---|---|---|
| 01 | [Simulate](/docs#workbench-simulate) | Generate synthetic reservoir states with PDE solvers | Coming soon |
| 02 | [Train](/docs#workbench-train) | Fit physics-informed models to field and synthetic data | Coming soon |
| 03 | [Validate](/docs#workbench-validate) | Check outputs against physical laws and residual bounds | Coming soon |
| 04 | [Monitor](/docs#workbench-monitor) | Watch losses, residuals and convergence while a run trains | Coming soon |
| 05 | [Workflows](/docs#workbench-workflows) | Save the chain as a rerunnable recipe | Coming soon |

Every action starts from a **field** and a **domain**, so inputs come pre-filled with that field's published data and that domain's physics. Everything an action produces, such as synthetic logs, trained models, validation reports and run metrics, is stored automatically and linked to the study you are working in.

Workbench actions will run either locally, through the Ereuna engine on your machine, or as jobs dispatched from the browser once execution environments are enabled.

### Simulate [`workbench-simulate`]

Generate synthetic reservoir states by discretising the subsurface and solving transient heat transport across heterogeneous Rift strata, with caprock and basement no-flow boundaries.

| | |
|---|---|
| Inputs | Field mesh (FieldState), thermal conductivity bounds, initial temperature field, boundary conditions |
| Outputs | Synthetic borehole temperature profiles; spatio-temporal thermal fields |
| EnergyGraph | PhysicsSpec (governing equations), FieldState (voxel arrays) |
| Used by | RIFT-01, to generate synthetic logs for pre-training |

### Train [`workbench-train`]

Fit models that respect physics to sparse well observations. For inverse problems, this recovers spatially varying thermal conductivity k(x) and predicts continuous temperature fields.

| | |
|---|---|
| Inputs | Observed boreholes (location, depth, temperature), boundary temperatures, physics loss weights, synthetic data from Simulate |
| Outputs | Trained model with a model card, inferred parameter fields (e.g. k(x)) |
| EnergyGraph | SensorGraph (observation points), PhysicsSpec (loss terms) |

### Validate [`workbench-validate`]

Submit model outputs to the [physics constraint checker](/docs#physics-check), which verifies energy balance, heat-flux continuity and boundary conditions before an output is accepted, then score the model on a [benchmark](/docs#benchmarks-overview).

| | |
|---|---|
| Inputs | Model predictions, residual tolerance thresholds from PhysicsSpec, a benchmark |
| Outputs | Physics compliance report, residual violation maps, benchmark score |

### Monitor [`workbench-monitor`]

Follow a training run while it happens: physics residual loss, data loss against well observations, and gradient norms across formations.

| | |
|---|---|
| Inputs | Live telemetry from an active run |
| Outputs | Convergence traces, residual histograms, loss curves |

### Workflows [`workbench-workflows`]

Chain Simulate → Train → Validate into one saved recipe that records every input, parameter and version. A workflow is what makes a study reproducible: rerunning it repeats the study exactly, and rerunning it with new parameters extends it.

| | |
|---|---|
| Inputs | A study composition: field, simulation settings, model settings, benchmark |
| Outputs | A reproducible study result with its validation summary |

---

## Benchmarks

### How benchmarks work [`benchmarks-overview`]

A benchmark is a fixed evaluation task: the same data, the same splits and the same scoring for every method. Scores are therefore comparable across studies.

Every Ereuna benchmark specifies:

- **Splits by well:** whole wells are held out, never random depth points, so a model is tested on wells it has not seen.
- **Calibrated uncertainty:** probabilistic predictions are scored, not only point estimates.
- **Physics compliance:** a prediction that violates the governing physics is flagged, whatever its error.

### BENCHMARK-01: Temperature at depth [`benchmarks-01`]

**Task.** Predict temperature down a well from published Kenyan geothermal well data.

| Criterion | How it is scored |
|---|---|
| Generalisation to new wells | Held-out wells (leave-one-well-out and held-out test wells) |
| Calibrated intervals | Continuous ranked probability score (CRPS) and interval coverage |
| Physics compliance | Residual check against the governing heat-transport equation |

**Status:** In progress. Scores will appear here and on the RIFT-01 study page.

---

## Concepts

### EnergyGraph (draft spec) [`eg-spec`]

EnergyGraph is Ereuna's planned data representation for geothermal problems. It is a **draft**: it describes how fields, physics and measurements will be represented and is not yet implemented.

It has three core objects:

- **PhysicsSpec:** governing equations, boundary conditions and the terms to be inferred. Example: transient heat conduction with spatially varying thermal conductivity, ρ c_p ∂T/∂t − ∇·(k(x)∇T) = q(x,t).
- **SensorGraph:** the topology of wells and instruments: where measurements are taken and how they relate.
- **FieldState:** discretised snapshots of subsurface state, such as temperature and pressure on a grid.

```python
@dataclass
class EnergyGraph:
    physics_spec: PhysicsSpec  # PDE class and boundary conditions
    sensor_graph: SensorGraph  # wellbore and instrument topology
    field_state: FieldState    # spatio-temporal discretised state
    meta: GraphMeta            # region, field, time window
```

| GraphMeta field | Type | Description |
|---|---|---|
| `domain` | str | `geothermal` |
| `region` | str | For example East African Rift System |
| `t_start` | datetime | Window start |
| `t_end` | datetime | Window end |

Node types, edge types and serialisation formats will be documented when the specification is implemented. Each [Domain](/domains) page shows how its observables map onto EnergyGraph.

### Physics constraint checker [`physics-check`]

**Coming soon.** The checker will evaluate a model's outputs against the PhysicsSpec of its domain before the outputs are accepted:

- PDE residuals within tolerance across the domain,
- energy conservation and heat-flux continuity,
- boundary conditions satisfied (for example no-flow at caprock and basement),
- physically plausible ranges (for example temperature below the boiling-point-with-depth curve where single-phase conditions are assumed).

It runs as the **Validate** step in the Workbench, and its result is one of the scoring criteria in every benchmark.

### How Ereuna keeps your work [`storage`]

You work with studies, fields and workbench actions. Underneath, Ereuna keeps everything needed to reproduce that work, so you never upload or publish it yourself:

| What you do | What Ereuna stores for you |
|---|---|
| Add data to a field | A versioned field dataset with its citation |
| Run Simulate | The synthetic data and the exact simulation settings |
| Run Train | The trained model, its configuration and a model card |
| Run Validate | The compliance report and the benchmark score |
| Save a Workflow | The full chain, linking every input and output (lineage) |

Every stored item is versioned and never overwritten. You can always see which data a model was trained on, and which studies use a dataset.

---

## Reference

### Known limitations [`limitations`]

- The Workbench, the physics constraint checker and benchmark scoring are not running yet; their pages describe what is coming.
- Field pages describe geology and sources; published borehole profiles are not yet shown.
- Two-factor sign-in and password reset are not available in the web app.
- Some pages that need sign-in (Notifications, Organizations) keep loading when you are signed out instead of asking you to sign in.
- The GeoSight demo linked from the home page is not deployed.

### Glossary [`glossary`]

| Term | Meaning |
|---|---|
| BHT | Bottom-hole temperature, often measured during or soon after drilling, before the well has recovered thermally |
| BPD curve | Boiling point with depth: the temperature at which water boils at a given depth's hydrostatic pressure |
| CRPS | Continuous ranked probability score: scores a probabilistic prediction against the observed value; lower is better |
| Domain | One stage of the geothermal resource lifecycle (see [Domains](/docs#domains-list)) |
| Field | A real geothermal system, such as Olkaria |
| Inverse problem | Inferring unknown subsurface parameters (e.g. k(x)) from measurements |
| k(x) | Thermal conductivity varying in space |
| Lineage | The recorded chain of data, runs and models behind a result |
| PINN | Physics-informed neural network: a neural network trained with the governing equations in its loss |
| Study | A reproducible composition of field, simulation, model and validation that answers one question |
| Upflow / outflow / recharge | Thermal regimes in a temperature log: hot fluid rising, hot fluid moving laterally, cold fluid entering |
| Workflow | A saved, rerunnable chain of Workbench actions |

### Contact and feedback [`contact`]

Questions, corrections to field data, published data you would like included, and collaboration requests: **[contact address to be added]**.

When reporting a data issue, include the field, the well, the source citation and what you believe is wrong.

---

## Appendix A — Developer reference (not in the user sidebar)

These are the internal services that will back the Workbench. They exist today and are documented here for platform contributors. They should **not** appear in the user-facing docs, because users are not meant to manage repositories, files or models directly.

### A1. Service map

| Public prefix | Service | Status |
|---|---|---|
| `/api/auth` → `/api/v1` | AuthService: accounts, RS256 tokens, users, organizations, API keys | Live |
| `/api/repository` → `/api/v1` | RepositoryService: versioned storage for datasets, models and apps (repositories, commits, files) | Live (internal storage layer) |
| `/api/platform` → `/api/v1` | PlatformService: experiments, deployments, pipelines, benchmarks (read-only) | Live, mostly empty |
| `/api/datasets` → `/api/v1` | DatasetsService: dataset versions, schema, profile, preview, query, lineage | Experimental; accepts only HS256 tokens |
| `/api/inference` → `/api/v1` | InferenceService | Health check only |

Files are served via presigned URLs on `https://s3.ereuna.org`. Unknown `/api/*` paths currently return the SPA's HTML with status 200.

### A2. Authentication

- `POST /api/auth/auth/login` with `{"email","password"}` returns `{"tokens":{access_token, refresh_token, token_type, expires_in}}`, or `{"mfa_required":true,"mfa_challenge":...}`.
- `POST /api/auth/auth/refresh` with `{"refresh_token"}`; `POST /api/auth/auth/logout`; `GET /api/auth/users/me`.
- Access tokens: RS256, 15 minutes. Refresh tokens: 30 days.
- API keys (`/api/auth/auth/api-keys`) are not accepted by RepositoryService.

### A3. Storage layer (RepositoryService)

| Method and path (under `/api/repository`) | Auth | Purpose |
|---|---|---|
| `GET /repositories?repo_type=&skip=&limit=` | No | List |
| `GET /repositories/search?q=` | No | Keyword search (OpenSearch) |
| `GET /{owner}/{slug}` · `GET /repositories/{id}` | No | Look up |
| `POST /repositories` | Yes | Create (`slug`, `repo_type`, `visibility` default private, `metadata`) |
| `PATCH` / `DELETE /repositories/{id}` | Yes | Update or delete |
| `POST /repositories/{id}/commits` | Yes | Multipart upload: `message`, `files[]` (512 MB request limit) |
| `GET /repositories/{id}/commits` · `/files/{sha}` · `/files/{sha}/presign?path=` | No | History, file list, download URL (1 h) |

Repository types: MODEL, DATASET, PIPELINE, SPACE, AGENT, WORKFLOW.

Card files rendered by the current catalog pages: models use `README.md`, `config.json`, `hyperparameters.json`, `params.json`; datasets use `README.md`, `schema.json`, `profile.json`, `validation.json`. The ereuna-model-card and ereuna-dataset-card skills describe their formats.

### A4. EreunaCLI (contributor tool)

Installed from source (`cd EreunaCLI && pip install -e .`). It defaults to `https://app.ereuna.org/api/auth` and `/api/repository`. Commands: `login`, `logout`, `whoami`, `repo create`, `init`, `clone`, `status`, `add`, `commit`, `push [--all]`, `pull [--force]`, `git`. `init` creates the remote repository itself, private by default and without catalog metadata.

### A5. Known platform issues

| Ticket | Issue |
|---|---|
| KAN-160 | Commits store only the files in that push, while pages, `clone` and `pull` read only the latest commit, so a partial push hides earlier files |
| KAN-161 | Private visibility is not enforced on list, search, files and presign |
| — | DatasetsService rejects AuthService tokens and is not connected to dataset repositories |
| — | Enabling MFA through the API locks the user out of web and CLI sign-in |

---

## Appendix B — Applying this to `DocsPage.jsx`

1. **Sidebar.** Replace the current groups (Getting Started, EnergyGraph, Models, Datasets, Python SDK, REST API) with the groups and anchors in the sidebar map above.
2. **Remove** these sections from the user docs: Creating a model repository, Model repository files, Versioning & tags, Creating a dataset repository, Dataset repository files, Python SDK (Installation, Running inference, Loading datasets) and REST API (Authentication, Inference endpoint, Search & filter). Their accurate replacement is Appendix A, which belongs in developer docs, not on `/docs`.
3. **Remove these false claims:** `pip install ereuna-geothermal`, `ereuna.load()`, `EnergyGraph.from_csv()`, `ereuna.checks.PhysicsSpec`, `ereuna.energy/settings/keys`, `EREUNA_API_KEY=ak_live_...`, "GeoSight ... running", and the physics checker described as active.
4. **Deep links.** Keep the hash handling from `DocsPage.next.jsx` (`/docs#<anchor>` opens a section; the sidebar updates the hash). Point the footer links at `/docs#organized`, `/docs#workbench-overview` and `/docs#eg-spec`.
5. **Rendering.** `renderMarkdown` has no ordered-list support, so numbered steps are written as bold-numbered bullets ("- **1.** ..."). It renders `##`/`###` headings, tables, fenced code, bullet lists, bold, inline code and links.
6. **Hero description:** "How to use Ereuna: research studies, geothermal domains and fields, the Workbench and benchmarks."
7. **Related site fixes** (outside the docs page): remove the "Live" badges on GeoSight and the Physics Constraint Checker; remove or hide the Hugging Face-style entry points (`/models`, `/datasets`, `/new`, the home-page CLI call-to-action) from the user path; give the footer a real contact address.
