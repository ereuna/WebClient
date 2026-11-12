import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { PAGE_ILLUSTRATIONS } from '../lib/illustrations'
import { renderMarkdown } from '../lib/markdown.jsx'

const sections = [
  {
    group: 'Getting started',
    items: [
      { id: 'intro', label: 'Introduction' },
      { id: 'status', label: 'What works today' },
      { id: 'account', label: 'Accounts & sign-in' },
      { id: 'organized', label: 'How Ereuna is organized' },
    ],
  },
  {
    group: 'Research',
    items: [
      { id: 'research-studies', label: 'Studies' },
      { id: 'research-rift01', label: 'RIFT-01: Temperature prediction for Kenyan wells' },
      { id: 'research-reproduce', label: 'Reproducing and extending a study' },
    ],
  },
  {
    group: 'Domains',
    items: [
      { id: 'domains-lifecycle', label: 'The geothermal resource lifecycle' },
      { id: 'domains-list', label: 'The seven domains' },
    ],
  },
  {
    group: 'Fields',
    items: [
      { id: 'fields-list', label: 'Kenyan geothermal fields' },
      { id: 'fields-policy', label: 'Field data policy' },
      { id: 'fields-contribute', label: 'Contributing field data' },
    ],
  },
  {
    group: 'Workbench',
    items: [
      { id: 'workbench-overview', label: 'How the Workbench works' },
      { id: 'workbench-simulate', label: 'Simulate' },
      { id: 'workbench-train', label: 'Train' },
      { id: 'workbench-validate', label: 'Validate' },
      { id: 'workbench-monitor', label: 'Monitor' },
      { id: 'workbench-workflows', label: 'Workflows' },
    ],
  },
  {
    group: 'Benchmarks',
    items: [
      { id: 'benchmarks-overview', label: 'How benchmarks work' },
      { id: 'benchmarks-01', label: 'BENCHMARK-01: Temperature at depth' },
    ],
  },
  {
    group: 'Concepts',
    items: [
      { id: 'eg-spec', label: 'EnergyGraph (draft spec)' },
      { id: 'physics-check', label: 'Physics constraint checker' },
      { id: 'storage', label: 'How Ereuna keeps your work' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { id: 'limitations', label: 'Known limitations' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'contact', label: 'Contact and feedback' },
    ],
  },
]

const content = {
  intro: {
    title: 'Introduction',
    body: `Ereuna is the computational engine for Kenya's geothermal energy: the place where Rift reservoirs are simulated, modelled and understood, so that decisions about where to explore, drill and inject can be tested before they are made in the field.

You use Ereuna through five connected areas:

- **[Research](/research)** holds reproducible studies that answer one question about one field.
- **[Domains](/domains)** cover the seven stages of the geothermal resource lifecycle, from exploration to production and injection.
- **[Fields](/fields)** are real Kenyan geothermal fields, built from published sources.
- **[Workbench](/workbench)** is where you simulate, train, validate and monitor.
- **[Benchmarks](/benchmarks)** are fixed evaluation tasks that make results comparable.

Ereuna is under active construction. Read [What works today](/docs#status) before planning work around a feature.`,
  },
  status: {
    title: 'What works today',
    body: `| Area | Status | What you can do now |
|---|---|---|
| Research | Drafted | Read RIFT-01, the first study, and see how it links field, simulation, model and validation |
| Domains | Drafted (Reservoir Characterization) · Coming soon (other six) | Read each domain's observables, governing physics and EnergyGraph mapping |
| Fields | Coming soon | Read geology, location and source basis for Olkaria, Menengai, Eburru, Paka and Silali |
| Workbench | Coming soon | Read what each action will take in and produce; actions cannot be run yet |
| Benchmarks | Coming soon | Read BENCHMARK-01's task and scoring criteria; scoring is not automated yet |
| Physics constraint checker | Coming soon | Specified, not runnable |
| Accounts | Live | Register, sign in, manage sessions |
| Search | Live | Keyword search from the top bar |
| GeoSight demo | Not available | Listed on the home page as a demo, not deployed |`,
  },
  account: {
    title: 'Accounts & sign-in',
    body: `**Create an account**

- **1.** Open [/register](/register). Choose a username, enter your email and a password of at least 10 characters.
- **2.** A verification email is sent to that address.
- **3.** Sign in at [/login](/login). Choose "Remember me" to stay signed in on this device.

You do not need an account to read Research, Domains, Fields or Benchmarks. You will need one to run Workbench actions and save studies once they are available.

**Sessions.** **Settings → Security** lists the devices you are signed in on and lets you sign them out.

**Two-factor authentication.** Not available yet. The sign-in page cannot complete a two-factor challenge, and the toggle in Settings does not work. Do not try to turn it on another way.

**Forgotten password.** The sign-in page has no reset link yet. Contact us (see [Contact and feedback](/docs#contact)) and we will reset it.`,
  },
  organized: {
    title: 'How Ereuna is organized',
    body: `A typical piece of work moves through the five areas in order:

- **1. Research:** open a study, or start from its question. Example: RIFT-01, "Temperature prediction for Kenyan wells".
- **2. Domains:** place the question in the lifecycle. RIFT-01 sits in **Reservoir Characterization**, which tells you the observables (temperature, conductivity k(x), porosity, permeability) and the governing physics.
- **3. Fields:** ground it in a real field. RIFT-01 uses **Olkaria**: its geology and its published borehole temperature profiles.
- **4. Workbench:** run the computation. **Simulate** synthetic reservoir states, **Train** a model on field and synthetic data, **Validate** it against physics, **Monitor** the run, then save the chain as a **Workflow**.
- **5. Benchmarks:** score the result on a fixed task with held-out wells, so it can be compared with other approaches.

The result is attached back to the study, the field and the domain, where others can inspect it and rerun it with their own parameters.

What you never have to do is upload a dataset, publish a model or manage files. Ereuna stores every dataset version, model checkpoint and run behind the scenes, with its lineage. See [How Ereuna keeps your work](/docs#storage).`,
  },
  'research-studies': {
    title: 'Studies',
    body: `A **study** is a reproducible composition that answers one question about one field. Every study names four parts:

| Part | What it is | Where it lives |
|---|---|---|
| Field | The real system the question is about | [Fields](/fields) |
| Simulation | The physics used to generate synthetic data or test scenarios | [Workbench → Simulate](/workbench/simulate) |
| Model | The method fitted to field and synthetic data | [Workbench → Train](/workbench/train) |
| Validation | How the answer is checked: physics compliance and a benchmark | [Workbench → Validate](/workbench/validate), [Benchmarks](/benchmarks) |

Because every part is recorded, a study can be rerun exactly, or rerun with changed parameters to answer a new question.

**Status:** Drafted. Studies are described on the Research page; running them is not available yet.`,
  },
  'research-rift01': {
    title: 'RIFT-01: Temperature prediction for Kenyan wells',
    body: `**Question.** From published temperature logs, can we recover the subsurface thermal regime of a well (upflow, outflow, recharge, compound, isothermal) and predict temperature at depth with honest uncertainty?

| Part | RIFT-01 |
|---|---|
| Field | [Olkaria](/fields/olkaria), Central Kenya Rift |
| Simulation | Synthetic temperature logs from conduction and advection physics, used for pre-training |
| Model | Temperature-log regime classifier trained on synthetic and digitised Olkaria logs |
| Validation | [BENCHMARK-01: Temperature at depth](/docs#benchmarks-01) and physics compliance |

**Data basis.** Temperature logs digitised from published figures and reports, with the source cited for every well. No operator data is used.

**Status:** In progress. Results will be added to this study when the evaluation is complete.`,
  },
  'research-reproduce': {
    title: 'Reproducing and extending a study',
    body: `**Planned.** When Workbench Workflows are available, each study will have a **Rerun** action that repeats the saved workflow, and a **Rerun with parameters** action, for example another field, other wells or a different model setting. Your rerun becomes a new version of the study, linked to the original, and its benchmark score appears beside the original score.`,
  },
  'domains-lifecycle': {
    title: 'The geothermal resource lifecycle',
    body: `Domains follow a geothermal resource from first survey to long-term operation. Each domain page lists:

- the **observables** measured at that stage,
- the **governing physics** used to interpret them,
- the **EnergyGraph** objects (PhysicsSpec, SensorGraph, FieldState) the stage maps onto,
- the Workbench actions and studies that use it.`,
  },
  'domains-list': {
    title: 'The seven domains',
    body: `| # | Domain | Focus | Status |
|---|---|---|---|
| 01 | [Exploration](/domains/exploration) | Surface geophysics and magnetotelluric arrays, resistivity inversion, prospect ranking | Coming soon |
| 02 | [Seismicity](/domains/seismicity) | Surface seismometer arrays, wave propagation, hypocentre location to about 4 km depth | Coming soon |
| 03 | [Drilling](/domains/drilling) | Casing design (conductor, intermediate, slotted liner) and bit penetration through geothermal formations | Coming soon |
| 04 | [Petrophysics](/domains/petrophysics) | Porosity and permeability from core, thin-section mineralogy, rock property curves with depth | Coming soon |
| 05 | [Reservoir Characterization](/domains/reservoir-characterization) | Layered 3D property models, including inferred thermal conductivity k(x), stratigraphic horizons and well intersections | Drafted |
| 06 | [Reservoir Engineering](/domains/reservoir-engineering) | Finite-volume simulation, caprock and basement no-flow boundaries, injection plume dynamics, mass and energy balance | Coming soon |
| 07 | [Production/Injection Engineering](/domains/production-injection) | Production and injection wells, surface manifold, reinjection and circulation through fractured rock | Coming soon |`,
  },
  'fields-list': {
    title: 'Kenyan geothermal fields',
    body: `| Field | Location | Setting | Studies |
|---|---|---|---|
| [Olkaria](/fields/olkaria) | Naivasha, Central Kenya Rift (0°53′S, 36°18′E) | High-temperature volcanic complex; caldera collapse and N–S normal faults; rhyolite and trachyte hosts | RIFT-01 (in progress) |
| [Menengai](/fields/menengai) | Nakuru, Central Kenya Rift (0°12′S, 36°04′E) | Large Quaternary caldera; post-caldera trachytes; high gradients along intra-rift faults | Rift caldera thermal modelling (planned) |
| [Eburru](/fields/eburru) | North of Lake Naivasha (0°38′S, 36°14′E) | Rhyolitic and pantelleritic domes; vapour-dominated zone at shallow to intermediate depth | Vapour-dominated reservoir simulation (planned) |
| [Paka](/fields/paka) | Baringo County, Northern Kenya Rift (0°55′N, 36°11′E) | Shield volcano with summit caldera; boiling springs along rift-parallel faults | Northern rift prospect characterization (planned) |
| [Silali](/fields/silali) | Baringo County, Northern Kenya Rift | Caldera volcano in the Baringo–Silali prospect | Regional fault-controlled heat sweep (planned) |

Each field page shows geology, the source basis, published borehole profiles (coming soon) and the studies built on that field.`,
  },
  'fields-policy': {
    title: 'Field data policy',
    body: `- Field profiles are built **from published sources only**: peer-reviewed papers, Stanford Geothermal Workshop and World Geothermal Congress proceedings, UNU-GTP / GRÓ GTP reports and public geological surveys.
- **No operator data** is used unless an operator has agreed to share it under written terms.
- Every well and every data point carries its **source citation**.
- Data digitised from figures is labelled **"digitised from published figures"**, with its estimated digitisation error.`,
  },
  'fields-contribute': {
    title: 'Contributing field data',
    body: `**Planned.** You will be able to add data to a field, for example temperature logs digitised from a paper or a published well report. You give the field, the well, the source citation and the values. Ereuna stores the data as a versioned record, checks it for basic consistency and makes it available to Workbench actions and studies on that field. You do not create or manage a dataset yourself.

Until then, send published data you would like included to us (see [Contact and feedback](/docs#contact)) with the full citation.`,
  },
  'workbench-overview': {
    title: 'How the Workbench works',
    body: `The Workbench is where computation runs. It has five actions, normally used in this order:

| Step | Action | In one line | Status |
|---|---|---|---|
| 01 | [Simulate](/docs#workbench-simulate) | Generate synthetic reservoir states with PDE solvers | Coming soon |
| 02 | [Train](/docs#workbench-train) | Fit physics-informed models to field and synthetic data | Coming soon |
| 03 | [Validate](/docs#workbench-validate) | Check outputs against physical laws and residual bounds | Coming soon |
| 04 | [Monitor](/docs#workbench-monitor) | Watch losses, residuals and convergence while a run trains | Coming soon |
| 05 | [Workflows](/docs#workbench-workflows) | Save the chain as a rerunnable recipe | Coming soon |

Every action starts from a **field** and a **domain**, so inputs come pre-filled with that field's published data and that domain's physics. Everything an action produces, such as synthetic logs, trained models, validation reports and run metrics, is stored automatically and linked to the study you are working in.

Workbench actions will run either locally, through the Ereuna engine on your machine, or as jobs dispatched from the browser once execution environments are enabled.`,
  },
  'workbench-simulate': {
    title: 'Simulate',
    body: `Generate synthetic reservoir states by discretising the subsurface and solving transient heat transport across heterogeneous Rift strata, with caprock and basement no-flow boundaries.

| | |
|---|---|
| Inputs | Field mesh (FieldState), thermal conductivity bounds, initial temperature field, boundary conditions |
| Outputs | Synthetic borehole temperature profiles; spatio-temporal thermal fields |
| EnergyGraph | PhysicsSpec (governing equations), FieldState (voxel arrays) |
| Used by | RIFT-01, to generate synthetic logs for pre-training |`,
  },
  'workbench-train': {
    title: 'Train',
    body: `Fit models that respect physics to sparse well observations. For inverse problems, this recovers spatially varying thermal conductivity k(x) and predicts continuous temperature fields.

| | |
|---|---|
| Inputs | Observed boreholes (location, depth, temperature), boundary temperatures, physics loss weights, synthetic data from Simulate |
| Outputs | Trained model with a model card, inferred parameter fields (e.g. k(x)) |
| EnergyGraph | SensorGraph (observation points), PhysicsSpec (loss terms) |`,
  },
  'workbench-validate': {
    title: 'Validate',
    body: `Submit model outputs to the [physics constraint checker](/docs#physics-check), which verifies energy balance, heat-flux continuity and boundary conditions before an output is accepted, then score the model on a [benchmark](/docs#benchmarks-overview).

| | |
|---|---|
| Inputs | Model predictions, residual tolerance thresholds from PhysicsSpec, a benchmark |
| Outputs | Physics compliance report, residual violation maps, benchmark score |`,
  },
  'workbench-monitor': {
    title: 'Monitor',
    body: `Follow a training run while it happens: physics residual loss, data loss against well observations, and gradient norms across formations.

| | |
|---|---|
| Inputs | Live telemetry from an active run |
| Outputs | Convergence traces, residual histograms, loss curves |`,
  },
  'workbench-workflows': {
    title: 'Workflows',
    body: `Chain Simulate → Train → Validate into one saved recipe that records every input, parameter and version. A workflow is what makes a study reproducible: rerunning it repeats the study exactly, and rerunning it with new parameters extends it.

| | |
|---|---|
| Inputs | A study composition: field, simulation settings, model settings, benchmark |
| Outputs | A reproducible study result with its validation summary |`,
  },
  'benchmarks-overview': {
    title: 'How benchmarks work',
    body: `A benchmark is a fixed evaluation task: the same data, the same splits and the same scoring for every method. Scores are therefore comparable across studies.

Every Ereuna benchmark specifies:

- **Splits by well:** whole wells are held out, never random depth points, so a model is tested on wells it has not seen.
- **Calibrated uncertainty:** probabilistic predictions are scored, not only point estimates.
- **Physics compliance:** a prediction that violates the governing physics is flagged, whatever its error.`,
  },
  'benchmarks-01': {
    title: 'BENCHMARK-01: Temperature at depth',
    body: `**Task.** Predict temperature down a well from published Kenyan geothermal well data.

| Criterion | How it is scored |
|---|---|
| Generalisation to new wells | Held-out wells (leave-one-well-out and held-out test wells) |
| Calibrated intervals | Continuous ranked probability score (CRPS) and interval coverage |
| Physics compliance | Residual check against the governing heat-transport equation |

**Status:** In progress. Scores will appear here and on the RIFT-01 study page.`,
  },
  'eg-spec': {
    title: 'EnergyGraph (draft spec)',
    body: `EnergyGraph is Ereuna's planned data representation for geothermal problems. It is a **draft**: it describes how fields, physics and measurements will be represented and is not yet implemented.

It has three core objects:

- **PhysicsSpec:** governing equations, boundary conditions and the terms to be inferred. Example: transient heat conduction with spatially varying thermal conductivity, ρ c_p ∂T/∂t − ∇·(k(x)∇T) = q(x,t).
- **SensorGraph:** the topology of wells and instruments: where measurements are taken and how they relate.
- **FieldState:** discretised snapshots of subsurface state, such as temperature and pressure on a grid.

\`\`\`python
@dataclass
class EnergyGraph:
    physics_spec: PhysicsSpec  # PDE class and boundary conditions
    sensor_graph: SensorGraph  # wellbore and instrument topology
    field_state: FieldState    # spatio-temporal discretised state
    meta: GraphMeta            # region, field, time window
\`\`\`

| GraphMeta field | Type | Description |
|---|---|---|
| \`domain\` | str | \`geothermal\` |
| \`region\` | str | For example East African Rift System |
| \`t_start\` | datetime | Window start |
| \`t_end\` | datetime | Window end |

Node types, edge types and serialisation formats will be documented when the specification is implemented. Each [Domain](/domains) page shows how its observables map onto EnergyGraph.`,
  },
  'physics-check': {
    title: 'Physics constraint checker',
    body: `**Coming soon.** The checker will evaluate a model's outputs against the PhysicsSpec of its domain before the outputs are accepted:

- PDE residuals within tolerance across the domain,
- energy conservation and heat-flux continuity,
- boundary conditions satisfied (for example no-flow at caprock and basement),
- physically plausible ranges (for example temperature below the boiling-point-with-depth curve where single-phase conditions are assumed).

It runs as the **Validate** step in the Workbench, and its result is one of the scoring criteria in every benchmark.`,
  },
  storage: {
    title: 'How Ereuna keeps your work',
    body: `You work with studies, fields and workbench actions. Underneath, Ereuna keeps everything needed to reproduce that work, so you never upload or publish it yourself:

| What you do | What Ereuna stores for you |
|---|---|
| Add data to a field | A versioned field dataset with its citation |
| Run Simulate | The synthetic data and the exact simulation settings |
| Run Train | The trained model, its configuration and a model card |
| Run Validate | The compliance report and the benchmark score |
| Save a Workflow | The full chain, linking every input and output (lineage) |

Every stored item is versioned and never overwritten. You can always see which data a model was trained on, and which studies use a dataset.`,
  },
  limitations: {
    title: 'Known limitations',
    body: `- The Workbench, the physics constraint checker and benchmark scoring are not running yet; their pages describe what is coming.
- Field pages describe geology and sources; published borehole profiles are not yet shown.
- Two-factor sign-in and password reset are not available in the web app.
- Some pages that need sign-in (Notifications, Organizations) keep loading when you are signed out instead of asking you to sign in.
- The GeoSight demo linked from the home page is not deployed.`,
  },
  glossary: {
    title: 'Glossary',
    body: `| Term | Meaning |
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
| Workflow | A saved, rerunnable chain of Workbench actions |`,
  },
  contact: {
    title: 'Contact and feedback',
    body: `Questions, corrections to field data, published data you would like included, and collaboration requests: **[contact address to be added]**.

When reporting a data issue, include the field, the well, the source citation and what you believe is wrong.`,
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

  // Deep links: /docs#workbench-simulate opens that section; the hash follows the sidebar.
  useEffect(() => {
    const onHash = () => setActiveIdState(idFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function setActiveId(id) {
    setActiveIdState(id)
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  // Intercept in-markdown anchor links to /docs#<anchor> or #<anchor> for instant, smooth switching
  function handleContentClick(e) {
    const anchor = e.target.closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href) return
    if (href.startsWith('/docs#') || href.startsWith('#')) {
      const targetId = href.replace(/^(\/docs)?#/, '')
      if (ALL_IDS.includes(targetId)) {
        e.preventDefault()
        setActiveId(targetId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const current = content[activeId] || {
    title: sections.flatMap(s => s.items).find(i => i.id === activeId)?.label || '',
    body: '',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHero
        eyebrow="DOCUMENTATION"
        title="Docs"
        description="How to use Ereuna: research studies, geothermal domains and fields, the Workbench and benchmarks."
        illustration={PAGE_ILLUSTRATIONS.docs}
        illustrationAlt="Documentation illustration"
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px 64px', flex: 1, display: 'flex', gap: 48, paddingTop: 36, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          {sections.map(section => (
            <div key={section.group} style={{ marginBottom: 26 }}>
              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '0.05em',
                color: '#5f6670', marginBottom: 8,
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
                    background: activeId === item.id ? '#efebe2' : 'transparent',
                    color: activeId === item.id ? '#17202e' : '#545b66',
                    fontWeight: activeId === item.id ? 600 : 400,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ width: 1, background: '#ddd8cc', flexShrink: 0 }} />

        <div style={{ flex: 1, maxWidth: 740 }}>
          <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
            {current.title}
          </h1>
          <div onClick={handleContentClick} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderMarkdown(current.body)}
          </div>
        </div>
      </div>
    </div>
  )
}
