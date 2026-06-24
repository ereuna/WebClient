const ACCENT = '#cf5a2a'

export const FAMILY_COLORS = {
  'PINN': '#7c6af7',
  'GNN / NNP': '#2db88a',
  'Grid RL': '#e67e22',
  'Forecasting': '#3498db',
  'Generative': '#e91e8c',
}

const MODELS = [
  {
    id: 'geopinn-v2',
    family: 'PINN',
    title: 'GeoPINN-v2',
    desc: 'Physics-informed network for geothermal reservoir simulation. Handles coupled THM with sparse observations.',
    longDesc: 'GeoPINN-v2 solves the coupled thermo-hydro-mechanical (THM) governing equations for geothermal reservoirs using a physics-informed neural network. It ingests sparse well-log pressure and temperature observations and produces spatially resolved P-T-stress fields without requiring a full numerical discretisation. Version 2 introduces a residual-adaptive loss weighting scheme that reduces convergence time by 40% and a Hellisheidi fine-tune checkpoint for Icelandic geologies.',
    tags: ['geothermal', 'inverse', 'THM'],
    license: 'Apache-2.0',
    downloads: '2.1k',
    stars: '184',
    size: '340 MB',
    updated: '2 days ago',
    version: '2.1.0',
    author: 'aether-team',
    metrics: [
      { label: 'RMSE — Pressure', value: '1.24 MPa', delta: '−8% vs v1', good: true },
      { label: 'RMSE — Temperature', value: '2.1 °C', delta: '−12% vs v1', good: true },
      { label: 'Physics residual', value: '3.2×10⁻⁵', delta: '−31% vs v1', good: true },
      { label: 'Coverage (95% CI)', value: '94.1%', delta: '+1.2%', good: true },
    ],
    architecture: {
      type: '8-layer MLP + periodic activations',
      params: '4.2M',
      framework: 'PyTorch 2.2',
      input: 'Well coordinates (x,y,z), depth, injection rate',
      output: 'Pressure, Temperature, Principal stresses',
      training: 'Olkaria Field Logs — 34 production wells, 18.2M observations',
      hardware: '18h on A100 80 GB',
      optimizer: 'Adam (warm-up) → L-BFGS',
    },
    modelCard: {
      intendedUse: 'Reservoir planning and injection optimisation for geothermal operators with sparse monitoring data.',
      limitations: 'Validated on East African rift-valley geology. Performance may degrade outside this regime without fine-tuning.',
      evaluation: 'Hold-out wells at Olkaria field; THM Consistency benchmark (PhysicsSpec v1.2).',
      biases: 'Training data biased towards high-enthalpy wells. Low-enthalpy or EGS sites require fine-tuning.',
    },
    versions: [
      { tag: 'v2.1.0', date: '2026-06-19', note: 'Residual-adaptive loss weighting; −40% convergence time.' },
      { tag: 'v2.0.0', date: '2026-04-01', note: 'Added Hellisheidi fine-tune checkpoint.' },
      { tag: 'v1.3.2', date: '2025-12-10', note: 'Bug fix: boundary condition handling at injection well.' },
      { tag: 'v1.0.0', date: '2025-07-22', note: 'Initial release.' },
    ],
    relatedIds: ['nuclpinn-1', 'kenyadispatch-v1'],
    trainingDataset: 'Olkaria Field Logs',
    endpoint: 'POST /v1/inference/geopinn-v2',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

response = client.models.run(
    model="aether/geopinn-v2",
    inputs={
        "wells": [
            {"x": 312.4, "y": 48.1, "z": -1200, "depth": 2400},
        ],
        "injection_rate": 45.2,   # kg/s
        "time_horizon": 365,       # days
    }
)

print(response.outputs["pressure_field"])
print(response.outputs["temperature_field"])
print(response.outputs["physics_residual"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/geopinn-v2 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "wells": [{"x": 312.4, "y": 48.1, "z": -1200, "depth": 2400}],
      "injection_rate": 45.2,
      "time_horizon": 365
    }
  }'`,
    },
  },

  {
    id: 'nuclpinn-1',
    family: 'PINN',
    title: 'NuclPINN-1',
    desc: 'Neutron flux solver built on PINN, validated against MCNP reference data for fission reactor geometries.',
    longDesc: 'NuclPINN-1 solves the multi-group neutron diffusion equation using a Fourier-feature PINN backbone. It takes a voxelised reactor geometry and material composition map as input and returns energy-group–resolved neutron flux fields. The model has been validated against Monte Carlo N-Particle (MCNP) reference simulations on PWR and BWR benchmark geometries, achieving sub-1% eigenvalue error without any mesh generation.',
    tags: ['nuclear', 'neutronics', 'fission'],
    license: 'Restricted',
    downloads: '840',
    stars: '97',
    size: '1.1 GB',
    updated: '1 week ago',
    version: '1.0.3',
    author: 'aether-nuclear',
    metrics: [
      { label: 'Eigenvalue error (keff)', value: '0.82 pcm', delta: 'vs MCNP ref.', good: true },
      { label: 'Max flux error', value: '0.94%', delta: 'at core periphery', good: true },
      { label: 'Physics residual', value: '1.1×10⁻⁶', good: true },
      { label: 'Inference time', value: '1.4 s', delta: 'vs ~4h MCNP', good: true },
    ],
    architecture: {
      type: 'Fourier-feature PINN (6-group diffusion)',
      params: '11.8M',
      framework: 'JAX 0.4',
      input: 'Voxel geometry (64³), material map, enrichment fractions',
      output: 'Neutron flux (6 energy groups), power density',
      training: 'RAFM Mechanical DB + synthetic PWR/BWR geometries',
      hardware: '72h on 4× A100',
      optimizer: 'Adam + second-order LBFGS',
    },
    modelCard: {
      intendedUse: 'Rapid neutronics screening for fission reactor design iterations where full MCNP runs are cost-prohibitive.',
      limitations: 'Six-group diffusion approximation; not suitable for transport-level precision or irregular geometries without re-training.',
      evaluation: 'OECD/NEA benchmark suite; internal MCNP cross-validation on 120 reactor configurations.',
      biases: 'Trained predominantly on LWR (light-water reactor) geometries. Advanced reactor types (MSR, HTGR) are out-of-distribution.',
    },
    versions: [
      { tag: 'v1.0.3', date: '2026-06-14', note: 'Improved boundary handling for control rod positions.' },
      { tag: 'v1.0.1', date: '2026-03-08', note: 'Fixed 6-group cross-section interpolation bug.' },
      { tag: 'v1.0.0', date: '2026-01-15', note: 'Initial restricted release.' },
    ],
    relatedIds: ['geopinn-v2', 'steelgnn'],
    trainingDataset: 'RAFM Mechanical DB',
    endpoint: 'POST /v1/inference/nuclpinn-1',
    codeSnippet: {
      python: `import aether
import numpy as np

client = aether.Client(api_key="YOUR_API_KEY")

geometry = np.load("pwr_geometry_64.npy")   # shape (64, 64, 64)
materials = np.load("material_map.npy")      # integer labels

response = client.models.run(
    model="aether/nuclpinn-1",
    inputs={
        "geometry_voxels": geometry.tolist(),
        "material_map": materials.tolist(),
        "enrichment": 0.035,   # 3.5% U-235
        "n_groups": 6,
    }
)

flux = response.outputs["neutron_flux"]   # shape (6, 64, 64, 64)
keff = response.outputs["k_effective"]`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/nuclpinn-1 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "geometry_voxels": "...",
      "material_map": "...",
      "enrichment": 0.035,
      "n_groups": 6
    }
  }'`,
    },
  },

  {
    id: 'steelgnn',
    family: 'GNN / NNP',
    title: 'SteelGNN',
    desc: 'Equivariant graph network for RAFM steel. Reports formation enthalpy and yield strength with calibrated uncertainty.',
    longDesc: 'SteelGNN is an SE(3)-equivariant graph neural network trained to predict formation enthalpy and irradiation-affected yield strength for reduced-activation ferritic-martensitic (RAFM) steels. It treats each atom in a crystal as a node, with message-passing over neighbour edges up to a 6 Å cutoff. Uncertainty is reported via an ensemble of 8 networks, giving calibrated 95% prediction intervals validated on DFT hold-out sets.',
    tags: ['RAFM_steel', 'materials', 'NNP'],
    license: 'MIT',
    downloads: '3.4k',
    stars: '312',
    size: '280 MB',
    updated: '3 days ago',
    version: '1.4.0',
    author: 'aether-materials',
    metrics: [
      { label: 'Formation enthalpy MAE', value: '18 meV/atom', delta: 'DFT hold-out', good: true },
      { label: 'Yield strength MAE', value: '21 MPa', delta: 'irradiated samples', good: true },
      { label: 'Coverage (95% CI)', value: '93.8%', delta: '+2.1% vs v1.3', good: true },
      { label: 'Inference time', value: '12 ms', delta: 'per structure', good: true },
    ],
    architecture: {
      type: 'SE(3)-equivariant GNN, 5 message-passing layers',
      params: '3.1M',
      framework: 'PyTorch Geometric 2.5',
      input: 'Atomic coordinates, species, unit cell, irradiation dose (dpa)',
      output: 'Formation enthalpy (eV/atom), yield strength (MPa) + uncertainty intervals',
      training: 'RAFM Mechanical DB — 290k property records, DFT cross-validated',
      hardware: '6h on A100',
      optimizer: 'AdamW + cosine LR schedule',
    },
    modelCard: {
      intendedUse: 'High-throughput screening of RAFM steel compositions for fusion reactor structural applications.',
      limitations: 'Trained on binary and ternary alloy compositions. Quaternary+ systems are extrapolations; uncertainty intervals widen accordingly.',
      evaluation: 'MP-2024 formation enthalpy hold-out (10k structures); IAEA yield-strength benchmark at 3–20 dpa.',
      biases: 'Over-represented in Fe-Cr-W ternary space; Fe-V and Fe-Mn sub-spaces have wider uncertainty.',
    },
    versions: [
      { tag: 'v1.4.0', date: '2026-06-18', note: 'Added irradiation dose conditioning; improved high-dpa extrapolation.' },
      { tag: 'v1.3.0', date: '2026-02-11', note: 'Ensemble uncertainty re-calibrated on IAEA benchmark.' },
      { tag: 'v1.0.0', date: '2025-09-03', note: 'Initial MIT release.' },
    ],
    relatedIds: ['energgnn-chno', 'nuclpinn-1'],
    trainingDataset: 'RAFM Mechanical DB',
    endpoint: 'POST /v1/inference/steelgnn',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

response = client.models.run(
    model="aether/steelgnn",
    inputs={
        "structure": {
            "lattice": [[2.87, 0, 0], [0, 2.87, 0], [0, 0, 2.87]],
            "species": ["Fe", "Cr"],
            "coords": [[0, 0, 0], [0.5, 0.5, 0.5]],
        },
        "irradiation_dose_dpa": 5.0,
    }
)

print(response.outputs["formation_enthalpy"])   # eV/atom
print(response.outputs["yield_strength"])        # MPa
print(response.outputs["uncertainty_95ci"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/steelgnn \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "structure": {
        "lattice": [[2.87,0,0],[0,2.87,0],[0,0,2.87]],
        "species": ["Fe","Cr"],
        "coords": [[0,0,0],[0.5,0.5,0.5]]
      },
      "irradiation_dose_dpa": 5.0
    }
  }'`,
    },
  },

  {
    id: 'energgnn-chno',
    family: 'GNN / NNP',
    title: 'EnergGNN-CHNO',
    desc: 'Crystal graph network for energetic materials. Predicts detonation velocity and oxygen balance for CHNO compounds.',
    longDesc: 'EnergGNN-CHNO is a crystal graph convolutional network that predicts detonation velocity (D) and oxygen balance (OB%) for carbon-hydrogen-nitrogen-oxygen (CHNO) energetic molecules. Trained on 820k DFT-screened candidates from the CHNO Molecule Library, it enables rapid in-silico screening of novel energetic material candidates before costly synthesis.',
    tags: ['energetic', 'CHNO', 'crystal'],
    license: 'Restricted',
    downloads: '512',
    stars: '61',
    size: '195 MB',
    updated: '5 days ago',
    version: '1.1.0',
    author: 'aether-materials',
    metrics: [
      { label: 'Detonation velocity MAE', value: '48 m/s', delta: 'CHNO hold-out', good: true },
      { label: 'Oxygen balance MAE', value: '1.8%', good: true },
      { label: 'Density MAE', value: '0.03 g/cm³', good: true },
      { label: 'Screening throughput', value: '12k mol/min', delta: 'vs ~1 mol/day DFT', good: true },
    ],
    architecture: {
      type: 'Crystal graph convolutional network (CGCNN), 4 conv layers',
      params: '1.8M',
      framework: 'PyTorch Geometric 2.5',
      input: 'SMILES string or CIF structure file',
      output: 'Detonation velocity (m/s), oxygen balance (%), density (g/cm³)',
      training: 'CHNO Molecule Library — 820k DFT-screened candidates',
      hardware: '14h on 2× A100',
      optimizer: 'Adam',
    },
    modelCard: {
      intendedUse: 'Pre-screening of CHNO energetic material candidates for academic research and authorised defence applications.',
      limitations: 'Predictions are screening-level estimates; synthesis and safety validation remain mandatory before any practical use.',
      evaluation: '10% stratified hold-out of CHNO Molecule Library; external validation against published EXPLO5 results.',
      biases: 'Training set skewed towards C/H/N/O stoichiometries that are easily synthesisable; exotic elemental ratios less reliable.',
    },
    versions: [
      { tag: 'v1.1.0', date: '2026-06-16', note: 'Added density prediction head; improved SMILES ingestion pipeline.' },
      { tag: 'v1.0.0', date: '2025-11-20', note: 'Initial restricted release.' },
    ],
    relatedIds: ['steelgnn', 'diffenergetics'],
    trainingDataset: 'CHNO Molecule Library',
    endpoint: 'POST /v1/inference/energgnn-chno',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

response = client.models.run(
    model="aether/energgnn-chno",
    inputs={
        "smiles": "C[N+](=O)[N+](C)=O",   # DMNA example
        # alternatively: "cif_content": "<CIF string>"
    }
)

print(response.outputs["detonation_velocity"])  # m/s
print(response.outputs["oxygen_balance"])        # %
print(response.outputs["density"])               # g/cm³`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/energgnn-chno \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "smiles": "C[N+](=O)[N+](C)=O"
    }
  }'`,
    },
  },

  {
    id: 'kenyadispatch-v1',
    family: 'Grid RL',
    title: 'KenyaDispatch-v1',
    desc: "RL dispatch policy for Kenya's geothermal-heavy grid. Balances real-time cost, carbon and reservoir longevity.",
    longDesc: "KenyaDispatch-v1 is a proximal policy optimisation (PPO) agent trained in a high-fidelity simulation of Kenya's national grid, where geothermal supplies ~47% of generation. The policy jointly minimises dispatch cost, carbon intensity and geothermal reservoir depletion rate — objectives that are in tension at high renewable penetration. It ships with a GridEnvSpec JSON describing the training environment so third-party simulators can reproduce or extend the training.",
    tags: ['kenya', 'geothermal', 'dispatch'],
    license: 'Apache-2.0',
    downloads: '1.7k',
    stars: '156',
    size: '45 MB',
    updated: 'Today',
    version: '1.2.1',
    author: 'aether-grid',
    metrics: [
      { label: 'Cost reduction vs. baseline', value: '−11.4%', delta: '30-day rollout', good: true },
      { label: 'Carbon reduction', value: '−6.8%', delta: 'vs merit-order', good: true },
      { label: 'Grid frequency std.', value: '0.031 Hz', delta: '−18% vs baseline', good: true },
      { label: 'Reservoir depletion rate', value: '−9.2%', delta: 'vs unconstrained', good: true },
    ],
    architecture: {
      type: 'PPO actor-critic, 4-layer MLP heads',
      params: '2.4M',
      framework: 'Stable-Baselines3 2.3',
      input: 'Grid state vector (load, frequency, SoC, reservoir P-T, spot price)',
      output: 'Dispatch setpoints for 12 generation units, 15-min intervals',
      training: 'KPLC Dispatch Records 2019–2024 + synthetic grid simulation',
      hardware: '28h on 8× CPU + 1× A100',
      optimizer: 'Adam (PPO clip 0.2)',
    },
    modelCard: {
      intendedUse: 'Real-time and day-ahead dispatch optimisation for grid operators on geothermal-heavy East African grids.',
      limitations: 'Trained on Kenya grid topology; requires re-training or fine-tuning for significantly different grid mixes.',
      evaluation: 'GridCost-Kenya benchmark; 30-day rolling out-of-sample simulation against KPLC merit-order baseline.',
      biases: 'Optimised for Kenya\'s 2024 grid topology and demand profile. Seasonal demand shifts may reduce performance without recalibration.',
    },
    versions: [
      { tag: 'v1.2.1', date: '2026-06-21', note: 'Patch: handle missing geothermal P-T telemetry gracefully.' },
      { tag: 'v1.2.0', date: '2026-05-03', note: 'Added reservoir depletion penalty; improved multi-objective balance.' },
      { tag: 'v1.0.0', date: '2025-10-14', note: 'Initial Apache-2.0 release.' },
    ],
    relatedIds: ['hydrobalancer', 'geopinn-v2'],
    trainingDataset: 'KPLC Dispatch Records',
    endpoint: 'POST /v1/inference/kenyadispatch-v1',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

# Current grid state snapshot
grid_state = {
    "load_mw": 1842.5,
    "frequency_hz": 49.97,
    "geothermal_pressure_bar": 38.2,
    "geothermal_temp_c": 240.1,
    "hydro_soc": 0.71,
    "spot_price_usd_mwh": 48.3,
}

response = client.models.run(
    model="aether/kenyadispatch-v1",
    inputs={"grid_state": grid_state, "horizon_steps": 4}
)

print(response.outputs["dispatch_setpoints"])  # MW per unit
print(response.outputs["expected_cost"])
print(response.outputs["expected_carbon_kg"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/kenyadispatch-v1 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "grid_state": {
        "load_mw": 1842.5,
        "frequency_hz": 49.97,
        "spot_price_usd_mwh": 48.3
      },
      "horizon_steps": 4
    }
  }'`,
    },
  },

  {
    id: 'hydrobalancer',
    family: 'Grid RL',
    title: 'HydroBalancer',
    desc: 'Multi-objective hydro scheduling agent trained on East African lake systems with stochastic inflow distributions.',
    longDesc: 'HydroBalancer is a soft actor-critic (SAC) agent for multi-reservoir hydro scheduling across East African lake catchments. It models stochastic inflows using an ensemble of LSTM inflow forecasters and optimises energy generation, flood-risk mitigation and ecological minimum-flow constraints simultaneously. The policy is conditioned on a 7-day inflow ensemble, enabling risk-aware hedging decisions.',
    tags: ['hydro', 'lake', 'multi-objective'],
    license: 'MIT',
    downloads: '920',
    stars: '108',
    size: '62 MB',
    updated: '4 days ago',
    version: '1.1.0',
    author: 'aether-grid',
    metrics: [
      { label: 'Cost reduction vs. baseline', value: '−8.3%', delta: 'annual simulation', good: true },
      { label: 'Spillage reduction', value: '−22%', delta: 'Owen Falls', good: true },
      { label: 'Min-flow violation rate', value: '0.4%', delta: '−3.1% vs rule-based', good: true },
      { label: 'Q90 skill score', value: '88.4%', delta: 'inflow forecasting', good: true },
    ],
    architecture: {
      type: 'SAC actor-critic + LSTM inflow ensemble (8 heads)',
      params: '5.7M',
      framework: 'PyTorch 2.2',
      input: '7-day inflow ensemble, reservoir levels, energy price, ecological constraints',
      output: 'Hourly release schedules per reservoir gate, generation forecast',
      training: 'Lake Victoria Inflow 1960–2023 + Owen Falls operational records',
      hardware: '36h on A100',
      optimizer: 'Adam (SAC entropy coefficient auto-tuned)',
    },
    modelCard: {
      intendedUse: 'Day-ahead and week-ahead hydro scheduling for reservoir operators in the East African Power Pool.',
      limitations: 'Ecological constraint weights are fixed at training time; re-weighting requires fine-tuning.',
      evaluation: 'HydroInflow-Q90 benchmark; 3-year (2021–2023) hold-out backtesting on Owen Falls and Kiira.',
      biases: 'Lake Victoria catchment hydrology; may not generalise to semi-arid or snow-fed catchments without adaptation.',
    },
    versions: [
      { tag: 'v1.1.0', date: '2026-06-17', note: 'Improved ecological min-flow constraint satisfaction.' },
      { tag: 'v1.0.0', date: '2025-08-29', note: 'Initial MIT release.' },
    ],
    relatedIds: ['kenyadispatch-v1', 'turkanawind-24h'],
    trainingDataset: 'Lake Victoria Inflow',
    endpoint: 'POST /v1/inference/hydrobalancer',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

response = client.models.run(
    model="aether/hydrobalancer",
    inputs={
        "reservoir_levels_m": [32.4, 11.8],   # Owen Falls, Kiira
        "inflow_forecast_cms": [...],          # 7-day ensemble (8 × 168h)
        "energy_price_usd_mwh": 51.2,
        "ecological_min_flow_cms": 340.0,
        "horizon_hours": 168,
    }
)

print(response.outputs["release_schedule_cms"])
print(response.outputs["generation_mwh"])
print(response.outputs["flood_risk_score"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/hydrobalancer \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "reservoir_levels_m": [32.4, 11.8],
      "energy_price_usd_mwh": 51.2,
      "horizon_hours": 168
    }
  }'`,
    },
  },

  {
    id: 'turkanawind-24h',
    family: 'Forecasting',
    title: 'TurkanaWind-24h',
    desc: '24-hour wind power forecast for Lake Turkana corridor. Ships calibrated uncertainty bands and bias correction.',
    longDesc: 'TurkanaWind-24h is a temporal fusion transformer (TFT) trained on six years of 10-minute SCADA data from the 365-turbine Lake Turkana Wind Power facility. It produces calibrated 24-hour ahead probabilistic forecasts with 10th/50th/90th percentile bands. A post-processing bias correction layer accounts for systematic NWP model errors in the Turkana channel, where low-level jets create strong diurnal signatures that confound generic forecasters.',
    tags: ['wind', 'lake-turkana', '24h'],
    license: 'Apache-2.0',
    downloads: '4.0k',
    stars: '407',
    size: '520 MB',
    updated: 'Today',
    version: '3.0.0',
    author: 'aether-forecasting',
    metrics: [
      { label: 'MAE (% capacity)', value: '4.2%', delta: 'Wind24 SOTA', good: true },
      { label: 'RMSE (MW)', value: '22.4 MW', delta: '−15% vs TFT baseline', good: true },
      { label: 'PICP (90% band)', value: '91.3%', delta: 'calibrated', good: true },
      { label: 'PINAW', value: '18.7%', delta: 'sharp intervals', good: true },
    ],
    architecture: {
      type: 'Temporal Fusion Transformer + NWP bias correction head',
      params: '18.2M',
      framework: 'PyTorch Lightning 2.4',
      input: 'SCADA 10-min history (72h look-back), NWP wind speed/direction at 100 m hub height',
      output: 'Probabilistic 24h generation forecast (P10, P50, P90) per turbine cluster',
      training: 'Turkana 10-min SCADA 2018–2024, 190M observations',
      hardware: '42h on 2× A100',
      optimizer: 'AdamW + OneCycleLR',
    },
    modelCard: {
      intendedUse: 'Day-ahead wind power scheduling and grid integration planning for Lake Turkana and similar low-level-jet corridors.',
      limitations: 'Bias correction trained on ERA5 NWP; performance degrades if a different NWP product is used without recalibration.',
      evaluation: 'Wind24 Benchmark (rolling 2023 test set, 5 East African wind farms); CRPS and Winkler score reported.',
      biases: 'Training biased towards Turkana channel meteorology (strong low-level jet, high-capacity factors). Other East African sites may need fine-tuning.',
    },
    versions: [
      { tag: 'v3.0.0', date: '2026-06-21', note: 'TFT backbone; added calibrated interval output; Wind24 SOTA.' },
      { tag: 'v2.1.0', date: '2026-01-30', note: 'Improved curtailment flag handling in SCADA pre-processing.' },
      { tag: 'v1.0.0', date: '2025-05-18', note: 'Initial Apache-2.0 release (LSTM baseline).' },
    ],
    relatedIds: ['solarghi-irrad', 'hydrobalancer'],
    trainingDataset: 'Turkana 10-min SCADA',
    endpoint: 'POST /v1/inference/turkanawind-24h',
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")

scada_history = pd.read_parquet("scada_72h.parquet")
nwp_forecast  = pd.read_parquet("era5_100m_24h.parquet")

response = client.models.run(
    model="aether/turkanawind-24h",
    inputs={
        "scada_history": scada_history.to_dict("records"),
        "nwp_forecast":  nwp_forecast.to_dict("records"),
        "site_id": "turkana-main",
    }
)

forecast = response.outputs["power_forecast_mw"]   # P10, P50, P90
print(forecast["p50"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/turkanawind-24h \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "site_id": "turkana-main",
      "scada_history": [...],
      "nwp_forecast": [...]
    }
  }'`,
    },
  },

  {
    id: 'solarghi-irrad',
    family: 'Forecasting',
    title: 'SolarGHI-Irrad',
    desc: 'Global horizontal irradiance model for sub-Saharan sites. Accounts for aerosol loading and cloud dynamics.',
    longDesc: 'SolarGHI-Irrad is a ConvLSTM model that predicts hourly global horizontal irradiance (GHI) and direct normal irradiance (DNI) across sub-Saharan Africa at 1 km spatial resolution. It ingests MSG satellite imagery (15-min cloud mask), ERA5 atmospheric fields and MERRA-2 aerosol optical depth to account for dust loading — a dominant source of error for standard GHI models in the Sahel and East Africa.',
    tags: ['solar', 'GHI', 'irradiance'],
    license: 'CC BY 4.0',
    downloads: '2.6k',
    stars: '234',
    size: '890 MB',
    updated: '6 days ago',
    version: '2.2.0',
    author: 'aether-forecasting',
    metrics: [
      { label: 'GHI RMSE', value: '28 W/m²', delta: 'Solar GHI SOTA', good: true },
      { label: 'GHI MAE', value: '19 W/m²', delta: '20-site average', good: true },
      { label: 'MBE', value: '+1.2 W/m²', delta: 'near-zero bias', good: true },
      { label: 'R²', value: '0.967', delta: 'hourly, all-sky', good: true },
    ],
    architecture: {
      type: 'ConvLSTM + aerosol attention head (spatial 128×128)',
      params: '31.4M',
      framework: 'TensorFlow 2.17',
      input: 'MSG satellite cloud mask (6h look-back), ERA5 2-m temp & humidity, MERRA-2 AOD',
      output: 'Hourly GHI and DNI (W/m²) at 1 km grid; cloud-regime confidence',
      training: 'East Africa GHI Atlas — 1,200 sites, 63M hourly records',
      hardware: '60h on 4× A100',
      optimizer: 'AdamW + cosine annealing',
    },
    modelCard: {
      intendedUse: 'Solar resource assessment, PV yield forecasting, and satellite-derived irradiance mapping for sub-Saharan Africa.',
      limitations: 'DNI estimates less accurate during extreme dust events (AOD > 1.5); requires MERRA-2 real-time feed for best performance.',
      evaluation: 'Solar GHI RMSE benchmark (20 sites, cloud-regime stratified); BSRN ground-station cross-validation at 8 African sites.',
      biases: 'Dense coverage in East Africa; Western and Central African sites have sparser ground-truth, leading to slightly wider errors.',
    },
    versions: [
      { tag: 'v2.2.0', date: '2026-06-15', note: 'Added DNI output head; MERRA-2 AOD integration.' },
      { tag: 'v2.0.0', date: '2025-12-01', note: 'ConvLSTM upgrade from LSTM baseline; +22% RMSE improvement.' },
      { tag: 'v1.0.0', date: '2025-04-10', note: 'Initial CC BY 4.0 release.' },
    ],
    relatedIds: ['turkanawind-24h', 'kenyadispatch-v1'],
    trainingDataset: 'East Africa GHI Atlas',
    endpoint: 'POST /v1/inference/solarghi-irrad',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

response = client.models.run(
    model="aether/solarghi-irrad",
    inputs={
        "latitude": -1.286,
        "longitude": 36.817,     # Nairobi example
        "forecast_date": "2026-06-22",
        "use_realtime_aod": True,
    }
)

hourly = response.outputs["hourly_irradiance"]
for h in hourly:
    print(f"{h['hour']:02d}:00  GHI={h['ghi_wm2']} W/m²  DNI={h['dni_wm2']} W/m²")`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/solarghi-irrad \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "latitude": -1.286,
      "longitude": 36.817,
      "forecast_date": "2026-06-22",
      "use_realtime_aod": true
    }
  }'`,
    },
  },

  {
    id: 'diffenergetics',
    family: 'Generative',
    title: 'DiffEnergetics',
    desc: 'Denoising diffusion model that proposes novel CHNO energetic molecules conditioned on performance targets.',
    longDesc: 'DiffEnergetics is a score-based denoising diffusion model operating in SELFIES latent space. It generates novel CHNO energetic molecule candidates conditioned on target detonation velocity and oxygen balance ranges. Molecules are post-screened with EnergGNN-CHNO to estimate performance, yielding a closed-loop de-novo design pipeline. Access is restricted to approved academic and institutional users due to the dual-use nature of the subject matter.',
    tags: ['diffusion', 'energetic', 'de-novo'],
    license: 'Restricted',
    downloads: '390',
    stars: '52',
    size: '1.4 GB',
    updated: '2 weeks ago',
    version: '1.0.1',
    author: 'aether-generative',
    metrics: [
      { label: 'Valid molecules', value: '96.4%', delta: 'SELFIES grammar', good: true },
      { label: 'Unique molecules', value: '98.1%', delta: 'per 1k samples', good: true },
      { label: 'Target D satisfaction', value: '74.2%', delta: '±100 m/s window', good: true },
      { label: 'FCD score', value: '1.84', delta: 'vs training dist.', good: true },
    ],
    architecture: {
      type: 'Score-based diffusion in SELFIES latent space (U-Net denoiser)',
      params: '86.3M',
      framework: 'PyTorch 2.2 + HuggingFace Diffusers',
      input: 'Target detonation velocity range (m/s), oxygen balance range (%), temperature',
      output: 'SELFIES strings for novel CHNO molecules + predicted properties from EnergGNN-CHNO',
      training: 'CHNO Molecule Library — 820k DFT-screened candidates',
      hardware: '5 days on 8× A100',
      optimizer: 'AdamW, linear noise schedule (T=1000)',
    },
    modelCard: {
      intendedUse: 'Restricted to approved academic researchers and institutional partners for authorised energetic-materials R&D.',
      limitations: 'Output molecules require full synthesis feasibility screening, toxicological assessment, and regulatory sign-off before any practical development.',
      evaluation: 'Validity, uniqueness, novelty (VUN) metrics; FCD against CHNO Molecule Library; EnergGNN-CHNO property satisfaction rate.',
      biases: 'Mode collapse risk near extreme performance targets (very high D > 9000 m/s); diversity drops in that regime.',
    },
    versions: [
      { tag: 'v1.0.1', date: '2026-06-07', note: 'Fixed SELFIES decoder for rare N-oxide motifs.' },
      { tag: 'v1.0.0', date: '2026-05-01', note: 'Initial restricted-access release.' },
    ],
    relatedIds: ['energgnn-chno', 'steelgnn'],
    trainingDataset: 'CHNO Molecule Library',
    endpoint: 'POST /v1/inference/diffenergetics',
    codeSnippet: {
      python: `import aether

client = aether.Client(api_key="YOUR_API_KEY")

# Generate 20 novel CHNO candidates near RDX-class performance
response = client.models.run(
    model="aether/diffenergetics",
    inputs={
        "target_detonation_velocity_ms": [8500, 8800],
        "target_oxygen_balance_pct": [-10, 5],
        "n_samples": 20,
        "temperature": 0.8,
        "post_screen": True,   # run EnergGNN-CHNO on outputs
    }
)

for mol in response.outputs["molecules"]:
    print(mol["selfies"], mol["predicted_velocity_ms"], mol["predicted_ob_pct"])`,
      curl: `curl -X POST https://api.aether.energy/v1/inference/diffenergetics \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputs": {
      "target_detonation_velocity_ms": [8500, 8800],
      "target_oxygen_balance_pct": [-10, 5],
      "n_samples": 20,
      "temperature": 0.8,
      "post_screen": true
    }
  }'`,
    },
  },
]

export function fetchAllModels() {
  return new Promise(resolve => setTimeout(() => resolve(MODELS), 300))
}

export function fetchModel(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve(MODELS.find(m => m.id === id) ?? null), 350)
  )
}

export function fetchRelatedModels(ids) {
  return new Promise(resolve =>
    setTimeout(() => resolve(MODELS.filter(m => ids.includes(m.id))), 200)
  )
}

export { MODELS }
