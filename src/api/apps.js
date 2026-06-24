export const STATUS_COLORS = {
  'Live': '#2db88a',
  'Beta': '#e67e22',
  'Coming soon': '#8a857a',
}

const APPS = [
  {
    id: 'geosight',
    emoji: '🌋',
    title: 'GeoSight',
    tagline: 'Geothermal reservoir visualiser',
    desc: 'Interactive 3D view of subsurface P-T-stress fields inferred from well logs and PINN outputs. Drag wells, adjust injection rates, see predicted drawdown in real time.',
    longDesc: 'GeoSight transforms GeoPINN-v2 outputs into an interactive 3D subsurface environment built on Three.js. Operators and researchers load well-log data from the Olkaria Field Logs dataset, run GeoPINN-v2 inference in the browser via WebAssembly or the Aether API, and explore pressure-temperature-stress fields as isosurfaces and cross-sections. Injection rate sliders update predictions in real time, enabling rapid what-if analysis without running a full numerical simulator.',
    tags: ['geothermal', 'PINN', '3D'],
    status: 'Live',
    users: '420',
    poweredByIds: ['geopinn-v2'],
    trainingDatasetIds: ['olkaria-field-logs'],
    features: [
      {
        icon: '⬡',
        title: '3D subsurface visualization',
        desc: 'Pressure, temperature and principal-stress isosurfaces rendered in real time using Three.js WebGL. Drag to orbit, scroll to zoom, click wells for telemetry popups.',
      },
      {
        icon: '↻',
        title: 'Live inference slider',
        desc: 'Adjust injection rate (kg/s) or production draw and watch GeoPINN-v2 recompute P-T-stress fields in < 2 s via the Aether API.',
      },
      {
        icon: '↓',
        title: 'Export to CSV / VTK',
        desc: 'Download field predictions as CSV or VTK files for import into Petrel, TOUGH3 or any third-party reservoir simulator.',
      },
      {
        icon: '⚠',
        title: 'Physics constraint overlay',
        desc: 'PhysicsSpec violation heatmap overlaid on the 3D view — cells failing conservation checks are highlighted in amber.',
      },
    ],
    techStack: ['React + Three.js (r3f)', 'GeoPINN-v2 via Aether REST API', 'WebAssembly (ONNX Runtime Web)', 'Mapbox GL (surface map)'],
    apiEndpoint: 'POST /v1/apps/geosight/session',
    embedSnippet: `<!-- Embed GeoSight in your own page -->
<script src="https://cdn.aether.energy/geosight/v1/embed.min.js"></script>
<aether-geosight
  api-key="YOUR_API_KEY"
  dataset="aether/olkaria-field-logs"
  well-ids="OW-01,OW-02,OW-03"
  height="600px"
></aether-geosight>`,
    changelog: [
      { version: 'v1.2.0', date: '2026-06-10', note: 'Added multi-well comparison view and PhysicsSpec overlay.' },
      { version: 'v1.1.0', date: '2026-04-15', note: 'Live injection slider; < 2 s latency via API streaming.' },
      { version: 'v1.0.0', date: '2026-01-20', note: 'Initial public launch with static P-T visualisation.' },
    ],
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

# Create a GeoSight session (returns a shareable URL)
session = client.apps.geosight.create_session(
    dataset="aether/olkaria-field-logs",
    well_ids=["OW-01", "OW-02", "OW-03"],
    injection_rate_kgs=45.2,
)

print(session.url)     # https://geosight.aether.energy/s/...
print(session.embed_url)   # iframe-ready URL`,
      curl: `curl -X POST https://api.aether.energy/v1/apps/geosight/session \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset": "aether/olkaria-field-logs",
    "well_ids": ["OW-01", "OW-02", "OW-03"],
    "injection_rate_kgs": 45.2
  }'`,
    },
  },

  {
    id: 'gridlens',
    emoji: '⚡',
    title: 'GridLens',
    tagline: 'Real-time dispatch dashboard',
    desc: 'Live generation mix, frequency deviation and marginal cost for the Kenyan national grid. Powered by KenyaDispatch-v1 rolling 15-minute RL rollouts.',
    longDesc: 'GridLens is a real-time situational awareness dashboard for the Kenyan electricity grid, consuming KPLC public telemetry and enriching it with KenyaDispatch-v1 four-step (1h) RL rollouts. Operators see the current generation mix as animated donut charts, frequency deviation as a live sparkline, and the model\'s recommended dispatch adjustments highlighted in green or red against the current merit-order schedule. All data refreshes every 15 minutes via Server-Sent Events.',
    tags: ['grid', 'RL', 'dispatch'],
    status: 'Live',
    users: '1.2k',
    poweredByIds: ['kenyadispatch-v1'],
    trainingDatasetIds: ['kplc-dispatch'],
    features: [
      {
        icon: '◉',
        title: 'Live generation mix',
        desc: 'Animated donut chart showing real-time contribution from geothermal, hydro, wind, solar and thermal. Data sourced from KPLC public telemetry every 15 minutes.',
      },
      {
        icon: '⟳',
        title: 'RL rollout preview',
        desc: 'KenyaDispatch-v1 projects 4 steps (1h) ahead, showing expected cost and carbon trajectory. Colour-coded vs. merit-order baseline.',
      },
      {
        icon: '≈',
        title: 'Frequency deviation monitor',
        desc: 'Live sparkline of system frequency deviation (Hz) with ±0.2 Hz alert bands. Historical rolling 24h view with anomaly annotations.',
      },
      {
        icon: '↕',
        title: 'Dispatch recommendation diff',
        desc: 'Side-by-side comparison of RL recommended setpoints vs. current merit-order for each of the 28 dispatchable units.',
      },
    ],
    techStack: ['React + Recharts', 'Server-Sent Events (15-min refresh)', 'KenyaDispatch-v1 via Aether API', 'KPLC public telemetry scraper'],
    apiEndpoint: 'GET /v1/apps/gridlens/snapshot',
    embedSnippet: `<!-- Embed GridLens frequency monitor widget -->
<script src="https://cdn.aether.energy/gridlens/v1/embed.min.js"></script>
<aether-gridlens-widget
  api-key="YOUR_API_KEY"
  view="frequency"
  refresh-interval="15"
  height="320px"
></aether-gridlens-widget>`,
    changelog: [
      { version: 'v1.3.0', date: '2026-06-18', note: 'Added dispatch recommendation diff panel; 28-unit breakdown.' },
      { version: 'v1.2.0', date: '2026-05-01', note: 'RL rollout preview (4-step horizon) added.' },
      { version: 'v1.0.0', date: '2026-02-14', note: 'Initial launch with live generation mix and frequency monitor.' },
    ],
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

# Get the latest grid snapshot
snapshot = client.apps.gridlens.snapshot()

print(snapshot.timestamp)
print(snapshot.generation_mix)    # {'geothermal': 882.4, 'wind': 210.1, ...}
print(snapshot.frequency_hz)       # 49.98
print(snapshot.rl_recommended_setpoints)  # MW per unit

# Subscribe to live updates
for update in client.apps.gridlens.stream(interval_s=60):
    print(update.frequency_hz, update.total_load_mw)`,
      curl: `# Get latest snapshot
curl https://api.aether.energy/v1/apps/gridlens/snapshot \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Subscribe to SSE stream
curl https://api.aether.energy/v1/apps/gridlens/stream \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: text/event-stream"`,
    },
  },

  {
    id: 'windscout',
    emoji: '🌬️',
    title: 'WindScout',
    tagline: 'Wind farm siting assistant',
    desc: 'Upload a candidate site polygon and receive 24h generation forecasts, wake-loss estimates and grid connection cost curves — all from TurkanaWind-24h.',
    longDesc: 'WindScout automates the first-pass wind farm siting workflow. Upload a GeoJSON polygon defining the candidate site boundary and WindScout runs TurkanaWind-24h to generate a full year of hourly P50/P90 generation forecasts, applies a parametric wake-loss model tuned to East African terrain roughness, and estimates levelised grid connection costs from the nearest high-voltage node using the KPLC network graph. Results are delivered as an interactive report with downloadable Excel workbook.',
    tags: ['wind', 'forecasting', 'siting'],
    status: 'Live',
    users: '680',
    poweredByIds: ['turkanawind-24h'],
    trainingDatasetIds: ['turkana-scada', 'east-africa-ghi'],
    features: [
      {
        icon: '⬡',
        title: 'Polygon site upload',
        desc: 'Upload a GeoJSON or KML polygon. WindScout extracts terrain elevation, roughness length and grid-point NWP data automatically.',
      },
      {
        icon: '⟳',
        title: 'P50/P90 generation forecast',
        desc: '8,760-hour (full year) probabilistic generation forecast from TurkanaWind-24h. P50 and P90 exceedance curves with monthly seasonality breakdown.',
      },
      {
        icon: '◈',
        title: 'Wake-loss modelling',
        desc: 'Parametric Jensen wake model with East African terrain roughness calibration. Optimise turbine layout within the polygon to maximise energy yield.',
      },
      {
        icon: '↕',
        title: 'Grid connection cost estimator',
        desc: 'Least-cost path to the nearest 132/220 kV node on the KPLC network graph. Unit cost curves for overhead line and underground cable options.',
      },
    ],
    techStack: ['React + Mapbox GL', 'TurkanaWind-24h via Aether API', 'Turf.js (spatial ops)', 'KPLC network graph (public)'],
    apiEndpoint: 'POST /v1/apps/windscout/analyse',
    embedSnippet: `<!-- Embed WindScout map in your app -->
<script src="https://cdn.aether.energy/windscout/v1/embed.min.js"></script>
<aether-windscout
  api-key="YOUR_API_KEY"
  base-year="2023"
  turbine-model="Vestas-V150-4.5"
  height="500px"
></aether-windscout>`,
    changelog: [
      { version: 'v1.2.0', date: '2026-05-28', note: 'Turbine layout optimiser added; Jensen wake model update.' },
      { version: 'v1.1.0', date: '2026-03-12', note: 'Grid connection cost estimator using KPLC network graph.' },
      { version: 'v1.0.0', date: '2025-11-05', note: 'Initial launch with P50/P90 forecast and wake-loss model.' },
    ],
    codeSnippet: {
      python: `import aether
import json

client = aether.Client(api_key="YOUR_API_KEY")

site_polygon = json.load(open("candidate_site.geojson"))

report = client.apps.windscout.analyse(
    site=site_polygon,
    turbine_model="Vestas-V150-4.5",
    n_turbines=50,
    base_year=2023,
)

print(f"Annual P50 generation: {report.p50_gwh:.1f} GWh")
print(f"Wake loss:             {report.wake_loss_pct:.1f}%")
print(f"Grid connection cost:  \${report.connection_cost_musd:.1f}M")
report.download_excel("windscout_report.xlsx")`,
      curl: `curl -X POST https://api.aether.energy/v1/apps/windscout/analyse \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "site": { "type": "Polygon", "coordinates": [[...]] },
    "turbine_model": "Vestas-V150-4.5",
    "n_turbines": 50,
    "base_year": 2023
  }'`,
    },
  },

  {
    id: 'matexplorer',
    emoji: '⚗️',
    title: 'MatExplorer',
    tagline: 'Materials property browser',
    desc: 'Search and filter 820k CHNO and RAFM candidates by predicted property. Visualise structure with 3Dmol.js and download DFT-validated subsets for fine-tuning.',
    longDesc: 'MatExplorer is a property-guided materials browser over the CHNO Molecule Library and RAFM Mechanical DB. Users set property filters (detonation velocity, oxygen balance, yield strength, formation enthalpy) and instantly see matching candidates ranked by a composite score. Clicking any candidate opens a 3Dmol.js interactive 3D structure viewer alongside EnergGNN-CHNO or SteelGNN predicted properties with uncertainty intervals. Curated subsets can be exported as SDF, CIF or Parquet for downstream fine-tuning workflows.',
    tags: ['materials', 'GNN', 'CHNO'],
    status: 'Beta',
    users: '190',
    poweredByIds: ['energgnn-chno', 'steelgnn'],
    trainingDatasetIds: ['chno-molecule-library', 'rafm-mechanical-db'],
    features: [
      {
        icon: '⬡',
        title: 'Multi-property filter UI',
        desc: 'Range sliders for detonation velocity, oxygen balance, density, yield strength and formation enthalpy. Instant re-ranking as you adjust — no page reload.',
      },
      {
        icon: '◉',
        title: '3D structure viewer',
        desc: '3Dmol.js interactive viewer with ball-and-stick, surface and electrostatic potential display modes. Available for all 820k CHNO candidates and 140 RAFM alloy unit cells.',
      },
      {
        icon: '↓',
        title: 'Subset export',
        desc: 'Download filtered candidate subsets as SDF (molecules), CIF (crystals) or Parquet (full property table). Fine-tune EnergGNN-CHNO or SteelGNN on your subset directly.',
      },
      {
        icon: '≈',
        title: 'Uncertainty display',
        desc: 'EnergGNN-CHNO and SteelGNN 95% prediction intervals shown alongside point estimates. Candidates with high uncertainty are flagged for DFT validation priority.',
      },
    ],
    techStack: ['React + 3Dmol.js', 'EnergGNN-CHNO + SteelGNN via Aether API', 'TanStack Table (virtual scrolling)', 'Parquet streaming (Apache Arrow JS)'],
    apiEndpoint: 'POST /v1/apps/matexplorer/search',
    embedSnippet: `<!-- Embed MatExplorer structure viewer for a specific molecule -->
<script src="https://cdn.aether.energy/matexplorer/v1/embed.min.js"></script>
<aether-matexplorer-viewer
  api-key="YOUR_API_KEY"
  mol-id="CHNO-00142857"
  display-mode="surface"
  height="400px"
></aether-matexplorer-viewer>`,
    changelog: [
      { version: 'v0.4.0', date: '2026-06-12', note: 'Parquet subset export; virtual-scroll table for 820k rows.' },
      { version: 'v0.3.0', date: '2026-04-20', note: '3Dmol.js structure viewer integrated; electrostatic potential surface.' },
      { version: 'v0.2.0', date: '2026-02-08', note: 'RAFM alloys added alongside CHNO library.' },
      { version: 'v0.1.0', date: '2026-01-10', note: 'Beta launch with CHNO filter UI and point-estimate display.' },
    ],
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

results = client.apps.matexplorer.search(
    dataset="chno-molecule-library",
    filters={
        "detonation_velocity_ms": {"gte": 8200, "lte": 8600},
        "oxygen_balance_pct": {"gte": -15, "lte": 5},
        "sa_score": {"lte": 3.5},
    },
    sort_by="detonation_velocity_ms",
    limit=50,
)

for mol in results.candidates:
    print(mol.mol_id, mol.smiles, mol.predicted_velocity_ms,
          mol.uncertainty_95ci)

results.export_sdf("top50_candidates.sdf")`,
      curl: `curl -X POST https://api.aether.energy/v1/apps/matexplorer/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset": "chno-molecule-library",
    "filters": {
      "detonation_velocity_ms": {"gte": 8200, "lte": 8600},
      "oxygen_balance_pct": {"gte": -15, "lte": 5}
    },
    "sort_by": "detonation_velocity_ms",
    "limit": 50
  }'`,
    },
  },

  {
    id: 'solaratlas',
    emoji: '☀️',
    title: 'SolarAtlas',
    tagline: 'East Africa irradiance map',
    desc: 'Hourly GHI and DNI maps for sub-Saharan Africa at 1 km resolution. Integrates cloud-regime stratification from SolarGHI-Irrad with satellite nowcasting.',
    longDesc: 'SolarAtlas renders the East Africa GHI Atlas as a Mapbox GL interactive map with time-scrubbing. Users step through hourly GHI and DNI rasters for any date from 2010 to the present, toggle aerosol optical depth overlays, and draw custom analysis polygons to extract area-averaged irradiance time series. SolarGHI-Irrad is used for real-time nowcasting (current + 3h ahead), blending seamlessly with historical atlas data.',
    tags: ['solar', 'GHI', 'atlas'],
    status: 'Live',
    users: '850',
    poweredByIds: ['solarghi-irrad'],
    trainingDatasetIds: ['east-africa-ghi'],
    features: [
      {
        icon: '⬡',
        title: 'Interactive 1 km irradiance map',
        desc: 'Mapbox GL raster tiles for GHI and DNI at 1 km resolution across East Africa. Scrub through time with a slider — any date from 2010 to today.',
      },
      {
        icon: '◉',
        title: 'Aerosol overlay',
        desc: 'MERRA-2 aerosol optical depth (550 nm) as a semi-transparent overlay. Toggle to understand dust-driven irradiance losses, especially in the Sahel corridor.',
      },
      {
        icon: '≈',
        title: 'Polygon time series extraction',
        desc: 'Draw a polygon on the map; SolarAtlas extracts and plots the area-averaged hourly GHI time series for any date range. Export as CSV.',
      },
      {
        icon: '⟳',
        title: 'Real-time nowcasting',
        desc: 'SolarGHI-Irrad provides live GHI + 3h nowcast, updated every 15 min from MSG satellite. Blends into historical atlas data for continuous playback.',
      },
    ],
    techStack: ['React + Mapbox GL', 'SolarGHI-Irrad via Aether API', 'COG (Cloud-Optimised GeoTIFF) tile server', 'Recharts (time series panel)'],
    apiEndpoint: 'POST /v1/apps/solaratlas/extract',
    embedSnippet: `<!-- Embed SolarAtlas map for a fixed location -->
<script src="https://cdn.aether.energy/solaratlas/v1/embed.min.js"></script>
<aether-solaratlas
  api-key="YOUR_API_KEY"
  lat="-1.286"
  lon="36.817"
  date="2026-06-21"
  layer="ghi"
  height="480px"
></aether-solaratlas>`,
    changelog: [
      { version: 'v2.1.0', date: '2026-06-08', note: 'Real-time nowcasting (SolarGHI-Irrad); 15-min refresh.' },
      { version: 'v2.0.0', date: '2026-03-01', note: 'DNI layer added; aerosol overlay from MERRA-2 AOD.' },
      { version: 'v1.0.0', date: '2025-07-14', note: 'Initial launch with GHI historical atlas.' },
    ],
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

# Extract area-averaged GHI for a polygon
ghi_series = client.apps.solaratlas.extract(
    polygon={
        "type": "Polygon",
        "coordinates": [[[36.5, -1.5], [38.0, -1.5], [38.0, 1.5], [36.5, 1.5], [36.5, -1.5]]]
    },
    start_date="2023-01-01",
    end_date="2023-12-31",
    layer="ghi",
    resolution_h=1,
)

import pandas as pd
df = pd.DataFrame(ghi_series)
print(df.describe())
df.to_csv("nairobi_region_ghi_2023.csv")`,
      curl: `curl -X POST https://api.aether.energy/v1/apps/solaratlas/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "polygon": { "type": "Polygon", "coordinates": [[[36.5,-1.5],[38.0,-1.5],[38.0,1.5],[36.5,1.5],[36.5,-1.5]]] },
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "layer": "ghi"
  }'`,
    },
  },

  {
    id: 'nucleval',
    emoji: '🔭',
    title: 'NuclEval',
    tagline: 'Nuclear model evaluation playground',
    desc: 'Run NuclPINN-1 against user-defined reactor geometries and compare against MCNP reference PDFs. Diff view highlights constraint violations per voxel.',
    longDesc: 'NuclEval will be the first interactive evaluation environment for nuclear physics-informed ML models. Users define custom reactor geometries using a guided voxel editor, run NuclPINN-1 and compare outputs against user-uploaded MCNP reference PDFs. A per-voxel diff view highlights regions where the flux prediction diverges from the reference, enabling targeted model debugging and fine-tuning. The app is currently in final development and will launch to the waitlist first.',
    tags: ['nuclear', 'PINN', 'evaluation'],
    status: 'Coming soon',
    users: '—',
    poweredByIds: ['nuclpinn-1'],
    trainingDatasetIds: ['rafm-mechanical-db'],
    features: [
      {
        icon: '⬡',
        title: 'Voxel geometry editor',
        desc: 'Browser-based 64³ voxel editor with preset templates for PWR, BWR and SMR geometries. Drag and drop material zones, place control rods, define reflector boundaries.',
      },
      {
        icon: '◉',
        title: 'NuclPINN-1 inference',
        desc: 'Run NuclPINN-1 on your geometry and view 6-group neutron flux fields as 3D isosurfaces and 2D cross-section slices.',
      },
      {
        icon: '≈',
        title: 'MCNP comparison view',
        desc: 'Upload your own MCNP mesh-tally output. The diff view renders per-voxel absolute and relative error, with colour-coded constraint violation flags.',
      },
      {
        icon: '↓',
        title: 'Fine-tune checkpoint export',
        desc: 'Geometry-result pairs can be added to your personal fine-tuning dataset for NuclPINN-1. Export in Aether fine-tune format for one-click re-training.',
      },
    ],
    techStack: ['React + Three.js', 'NuclPINN-1 via Aether API', 'MCNP MESHTAL parser (WASM)', 'Voxel editor (custom WebGL)'],
    apiEndpoint: 'POST /v1/apps/nucleval/run (coming soon)',
    embedSnippet: `<!-- NuclEval embed (available at launch) -->
<script src="https://cdn.aether.energy/nucleval/v1/embed.min.js"></script>
<aether-nucleval
  api-key="YOUR_API_KEY"
  geometry="pwr-standard"
  height="600px"
></aether-nucleval>`,
    changelog: [
      { version: 'v0.1.0-preview', date: '2026-08-01', note: 'Preview build for waitlist users. Voxel editor and NuclPINN-1 inference.' },
    ],
    codeSnippet: {
      python: `# NuclEval API — available at launch
import aether

client = aether.Client(api_key="YOUR_API_KEY")

result = client.apps.nucleval.run(
    geometry_voxels=your_geometry,   # shape (64, 64, 64)
    material_map=your_materials,
    enrichment=0.035,
    mcnp_reference="path/to/meshtal.out",   # optional
)

print(result.k_effective)
print(result.flux_6group.shape)     # (6, 64, 64, 64)
if result.mcnp_diff:
    print(f"Max voxel error: {result.mcnp_diff.max_error_pct:.2f}%")`,
      curl: `# Available at launch
curl -X POST https://api.aether.energy/v1/apps/nucleval/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometry_voxels": "...",
    "material_map": "...",
    "enrichment": 0.035
  }'`,
    },
  },
]

export function fetchAllApps() {
  return new Promise(resolve => setTimeout(() => resolve(APPS), 300))
}

export function fetchApp(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve(APPS.find(a => a.id === id) ?? null), 350)
  )
}

export { APPS }
