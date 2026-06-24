export const SUITE_COLORS = {
  'Physics Constraints': '#7c6af7',
  'Forecasting': '#3498db',
  'Materials': '#2db88a',
  'Dispatch': '#e67e22',
}

const BENCHMARKS = [
  {
    id: 'physicsspec-v1-2',
    suite: 'Physics Constraints',
    name: 'PhysicsSpec v1.2',
    desc: 'End-to-end checker for conservation of energy and mass in PINN outputs. Flags violation magnitude and affected cells.',
    longDesc: 'PhysicsSpec v1.2 is the canonical Aether physics-constraint evaluation suite. It applies four checkers — energy conservation, mass conservation, momentum balance and thermodynamic consistency — to model outputs over a standardised set of 400 synthetic reservoir states. Each checker produces a per-cell violation score; the reported metric is the fraction of cells where all four checkers pass simultaneously (the "constraint pass-rate"). Only models that pass PhysicsSpec at ≥ 90% are permitted to appear on the Aether platform.',
    metric: 'Constraint pass-rate (%)',
    higherIsBetter: true,
    leader: 'GeoPINN-v2',
    leaderModelId: 'geopinn-v2',
    leaderScore: '99.1%',
    modelCount: 12,
    evaluationDataset: 'Synthetic reservoir states (400 standardised)',
    relatedSuiteIds: ['thm-consistency'],
    methodology: 'A fixed set of 400 synthetic P-T-stress reservoir states (drawn from a Latin-hypercube sampling of the Olkaria parameter space) is fed through each submitted model. The four constraint checkers are implemented as differentiable PyTorch loss functions and are publicly available in the aether-physicsspec package. Models run in an isolated Docker container with no internet access; the test states are withheld from all model authors.',
    submissionGuide: 'Package your model as an Aether-compatible inference container using the aether.model.wrap() helper. Submit the container image digest and your model card via the Aether submission portal. Evaluation runs within 24h and results are published automatically to this leaderboard.',
    changelog: [
      { version: 'v1.2', date: '2026-04-01', note: 'Added thermodynamic consistency checker; raised passing threshold from 85% to 90%.' },
      { version: 'v1.1', date: '2025-10-15', note: 'Momentum balance checker made stricter near boundary cells.' },
      { version: 'v1.0', date: '2025-06-01', note: 'Initial release with energy and mass conservation checkers.' },
    ],
    leaderboard: [
      { rank: 1, model: 'GeoPINN-v2', modelId: 'geopinn-v2', family: 'PINN', score: 99.1, submitted: '2026-06-19' },
      { rank: 2, model: 'NuclPINN-1', modelId: 'nuclpinn-1', family: 'PINN', score: 98.4, submitted: '2026-06-14' },
      { rank: 3, model: 'HydroBalancer', modelId: 'hydrobalancer', family: 'Grid RL', score: 97.2, submitted: '2026-06-17' },
      { rank: 4, model: 'KenyaDispatch-v1', modelId: 'kenyadispatch-v1', family: 'Grid RL', score: 96.8, submitted: '2026-06-21' },
      { rank: 5, model: 'TurkanaWind-24h', modelId: 'turkanawind-24h', family: 'Forecasting', score: 95.3, submitted: '2026-06-21' },
      { rank: 6, model: 'SolarGHI-Irrad', modelId: 'solarghi-irrad', family: 'Forecasting', score: 94.1, submitted: '2026-06-15' },
      { rank: 7, model: 'SteelGNN', modelId: 'steelgnn', family: 'GNN / NNP', score: 92.7, submitted: '2026-06-18' },
      { rank: 8, model: 'EnergGNN-CHNO', modelId: 'energgnn-chno', family: 'GNN / NNP', score: 91.5, submitted: '2026-06-16' },
      { rank: 9, model: 'DiffEnergetics', modelId: 'diffenergetics', family: 'Generative', score: 90.3, submitted: '2026-06-07' },
      { rank: 10, model: 'GeoLSTM-v3', modelId: null, family: 'Forecasting', score: 88.6, submitted: '2026-05-20' },
      { rank: 11, model: 'BasePINN-2024', modelId: null, family: 'PINN', score: 85.2, submitted: '2026-03-10' },
      { rank: 12, model: 'NaiveInterp', modelId: null, family: 'Baseline', score: 62.4, submitted: '2025-12-01' },
    ],
    codeSnippet: {
      python: `import aether_physicsspec as ps

# Install: pip install aether-physicsspec

evaluator = ps.PhysicsSpecEvaluator(version="1.2")

# Load your model predictions
predictions = your_model.predict(ps.TEST_STATES)

# Run evaluation
result = evaluator.evaluate(predictions)

print(f"Constraint pass-rate: {result.pass_rate:.1f}%")
print(f"Energy conservation:  {result.energy_pass_rate:.1f}%")
print(f"Mass conservation:    {result.mass_pass_rate:.1f}%")
print(f"Momentum balance:     {result.momentum_pass_rate:.1f}%")
print(f"Thermo consistency:   {result.thermo_pass_rate:.1f}%")`,
      curl: `# Submit evaluation job
curl -X POST https://api.aether.energy/v1/benchmarks/physicsspec-v1-2/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "model_version": "1.0.0",
    "container_digest": "sha256:..."
  }'`,
    },
  },

  {
    id: 'thm-consistency',
    suite: 'Physics Constraints',
    name: 'THM Consistency',
    desc: 'Validates thermo-hydro-mechanical coupling coherence in geothermal reservoir outputs against analytical Mandel solutions.',
    longDesc: 'THM Consistency evaluates the quality of coupled thermo-hydro-mechanical (THM) simulations by comparing model outputs against the analytical Mandel solution — a well-known benchmark for poroelastic consolidation. The test suite covers 120 problem configurations spanning a range of permeabilities (10⁻¹⁴–10⁻¹² m²), Young\'s moduli (5–50 GPa) and thermal expansion coefficients relevant to geothermal applications. The relative L2 error in the pressure, temperature and displacement fields is evaluated at 5 time snapshots per configuration.',
    metric: 'Relative L2 error < 0.1% pass-rate',
    higherIsBetter: true,
    leader: 'GeoPINN-v2',
    leaderModelId: 'geopinn-v2',
    leaderScore: '97.8%',
    modelCount: 7,
    evaluationDataset: 'Mandel analytical solutions (120 configurations)',
    relatedSuiteIds: ['physicsspec-v1-2'],
    methodology: '120 Mandel problem configurations are solved analytically using a symbolic solver (SymPy). Model predictions at 5 time snapshots are compared; a configuration passes if the L2 error in all three fields (P, T, u) falls below 0.1%. Pass-rate is the fraction of the 120 × 5 = 600 (config, time) pairs that pass.',
    submissionGuide: 'Submit your model as an Aether inference container. Your model must accept Mandel input format (geometry, boundary conditions, material parameters) and return P, T and displacement fields on the specified grid.',
    changelog: [
      { version: 'v1.1', date: '2026-03-15', note: 'Extended configuration set from 60 to 120; added thermal expansion range.' },
      { version: 'v1.0', date: '2025-08-20', note: 'Initial release.' },
    ],
    leaderboard: [
      { rank: 1, model: 'GeoPINN-v2', modelId: 'geopinn-v2', family: 'PINN', score: 97.8, submitted: '2026-06-19' },
      { rank: 2, model: 'NuclPINN-1', modelId: 'nuclpinn-1', family: 'PINN', score: 89.2, submitted: '2026-06-14' },
      { rank: 3, model: 'GeoPINN-v1', modelId: null, family: 'PINN', score: 84.5, submitted: '2026-01-10' },
      { rank: 4, model: 'FEM-PINN-hybrid', modelId: null, family: 'PINN', score: 79.3, submitted: '2026-04-22' },
      { rank: 5, model: 'ThermoNet', modelId: null, family: 'PINN', score: 71.2, submitted: '2025-11-05' },
      { rank: 6, model: 'LSTM-Geotherm', modelId: null, family: 'Forecasting', score: 58.1, submitted: '2025-09-14' },
      { rank: 7, model: 'LinearInterp', modelId: null, family: 'Baseline', score: 41.8, submitted: '2025-08-20' },
    ],
    codeSnippet: {
      python: `import aether_physicsspec as ps

evaluator = ps.THMConsistencyEvaluator()

# Your model must implement the THM interface
result = evaluator.evaluate(
    model=your_model,
    configs=ps.THM_CONFIGS,   # 120 Mandel configurations
)

print(f"THM pass-rate: {result.pass_rate:.1f}%")

# Per-field breakdown
for field in ["pressure", "temperature", "displacement"]:
    print(f"  {field}: L2 error = {result.l2_errors[field]:.4f}")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/thm-consistency/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "model_version": "1.0.0"
  }'`,
    },
  },

  {
    id: 'wind24-benchmark',
    suite: 'Forecasting',
    name: 'Wind24 Benchmark',
    desc: 'Day-ahead wind power MAE and CRPS on five East African wind farms using a rolling 2023 test set.',
    longDesc: 'The Wind24 Benchmark evaluates day-ahead (24h horizon) wind power forecasting models on a rolling out-of-sample test set covering all of 2023 across five East African wind farms: Lake Turkana (Kenya, 310 MW), Kipeto (Kenya, 100 MW), Ngong Hills (Kenya, 25 MW), Adama II (Ethiopia, 153 MW) and Aysha (Ethiopia, 120 MW). Models receive NWP wind speed and direction forecasts at hub height as input and must return probabilistic generation forecasts. Both point-forecast accuracy (MAE as % of installed capacity) and probabilistic skill (CRPS) are reported.',
    metric: 'MAE (% capacity)',
    higherIsBetter: false,
    leader: 'TurkanaWind-24h',
    leaderModelId: 'turkanawind-24h',
    leaderScore: '4.2% MAE',
    modelCount: 18,
    evaluationDataset: 'Turkana 10-min SCADA + Kipeto / Ngong / Adama / Aysha SCADA (held-out 2023)',
    relatedSuiteIds: ['solar-ghi-rmse', 'hydroinflow-q90'],
    methodology: 'Rolling daily evaluation: on each day d, models receive NWP for day d+1 and produce 24 hourly generation forecasts. Actuals are revealed after evaluation. MAE is averaged over all sites × hours. CRPS is computed using the full probabilistic forecast distribution. Models have no access to actual generation during the test period.',
    submissionGuide: 'Submit a Docker container exposing a /predict endpoint that accepts NWP JSON and returns hourly generation probabilistic forecasts. The container is called once per test day in the rolling evaluation harness.',
    changelog: [
      { version: 'v2.0', date: '2026-01-01', note: 'Extended to 5 sites (added Adama II and Aysha); 2023 test year.' },
      { version: 'v1.0', date: '2025-01-01', note: 'Initial release with 3 Kenyan sites; 2022 test year.' },
    ],
    leaderboard: [
      { rank: 1, model: 'TurkanaWind-24h', modelId: 'turkanawind-24h', family: 'Forecasting', score: 4.2, submitted: '2026-06-21' },
      { rank: 2, model: 'TFT-Wind-EA', modelId: null, family: 'Forecasting', score: 5.1, submitted: '2026-05-30' },
      { rank: 3, model: 'WindGRU-v2', modelId: null, family: 'Forecasting', score: 5.8, submitted: '2026-04-12' },
      { rank: 4, model: 'SolarGHI-Irrad', modelId: 'solarghi-irrad', family: 'Forecasting', score: 6.4, submitted: '2026-06-15' },
      { rank: 5, model: 'NWP-MOS-Direct', modelId: null, family: 'Baseline', score: 7.2, submitted: '2026-01-10' },
      { rank: 6, model: 'LSTM-Wind-48h', modelId: null, family: 'Forecasting', score: 7.9, submitted: '2026-03-05' },
      { rank: 7, model: 'XGBoost-Wind', modelId: null, family: 'ML', score: 8.4, submitted: '2026-02-18' },
      { rank: 8, model: 'Persistence-24h', modelId: null, family: 'Baseline', score: 12.6, submitted: '2026-01-01' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

evaluator = ab.Wind24Evaluator(year=2023)

# Your model must implement predict(nwp) → dict with hourly forecasts
scores = evaluator.run(model=your_model)

print(f"MAE:  {scores.mae_pct:.2f}% of capacity")
print(f"CRPS: {scores.crps:.4f}")
print(f"PICP: {scores.picp_90:.1f}%  (90% interval coverage)")

# Per-site breakdown
for site, s in scores.per_site.items():
    print(f"  {site}: MAE={s.mae_pct:.2f}%")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/wind24-benchmark/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "evaluation_year": 2023
  }'`,
    },
  },

  {
    id: 'hydroinflow-q90',
    suite: 'Forecasting',
    name: 'HydroInflow-Q90',
    desc: 'Q90 reliability score for monthly inflow forecasts at Owen Falls. Tests extreme-event capture.',
    longDesc: 'HydroInflow-Q90 measures how well models capture the 90th percentile of monthly inflow at Owen Falls dam — a critical quantity for flood-risk management and reservoir rule curve design. Monthly inflow forecasts with a 1–3 month lead time are evaluated against observed UEGCL inflow data for 2020–2023. The Q90 skill score is computed relative to a climatological Q90 baseline. High skill here indicates that a model can reliably warn operators of flood-risk months in advance.',
    metric: 'Q90 skill score (%)',
    higherIsBetter: true,
    leader: 'HydroBalancer',
    leaderModelId: 'hydrobalancer',
    leaderScore: '88.4%',
    modelCount: 9,
    evaluationDataset: 'Lake Victoria Inflow 2020–2023 (hold-out)',
    relatedSuiteIds: ['wind24-benchmark'],
    methodology: 'Monthly inflow forecasts (1-, 2- and 3-month lead) are compared against UEGCL observed inflow for the 48-month period 2020–2023. Q90 skill score = 1 − (MAE at Q90 / MAE of climatological Q90 baseline). Scores are averaged across the three lead times.',
    submissionGuide: 'Submit a container that accepts a feature vector (upstream rainfall, reservoir level, ENSO index, lead time) and returns a probabilistic inflow distribution. The Q90 of the returned distribution is extracted for scoring.',
    changelog: [
      { version: 'v1.1', date: '2025-12-01', note: 'Extended test period from 2022 to 2020–2023; added 3-month lead.' },
      { version: 'v1.0', date: '2025-05-01', note: 'Initial release.' },
    ],
    leaderboard: [
      { rank: 1, model: 'HydroBalancer', modelId: 'hydrobalancer', family: 'Grid RL', score: 88.4, submitted: '2026-06-17' },
      { rank: 2, model: 'LSTM-Hydro-EA', modelId: null, family: 'Forecasting', score: 81.2, submitted: '2026-05-10' },
      { rank: 3, model: 'TurkanaWind-24h', modelId: 'turkanawind-24h', family: 'Forecasting', score: 74.5, submitted: '2026-06-21' },
      { rank: 4, model: 'HBV-ENSO', modelId: null, family: 'Hydrological', score: 70.8, submitted: '2026-03-22' },
      { rank: 5, model: 'GRU-Inflow', modelId: null, family: 'Forecasting', score: 65.1, submitted: '2026-02-14' },
      { rank: 6, model: 'ARIMA-Monthly', modelId: null, family: 'Statistical', score: 58.3, submitted: '2025-12-10' },
      { rank: 7, model: 'RandomForest-Inflow', modelId: null, family: 'ML', score: 52.6, submitted: '2025-10-08' },
      { rank: 8, model: 'Climatology-Q90', modelId: null, family: 'Baseline', score: 0.0, submitted: '2025-05-01' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

evaluator = ab.HydroQ90Evaluator(
    site="owen_falls",
    test_period=("2020-01", "2023-12"),
)

result = evaluator.run(model=your_model)

print(f"Q90 skill score: {result.q90_skill:.1f}%")
for lead in [1, 2, 3]:
    print(f"  Lead {lead}m: {result.skill_by_lead[lead]:.1f}%")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/hydroinflow-q90/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "site": "owen_falls"
  }'`,
    },
  },

  {
    id: 'solar-ghi-rmse',
    suite: 'Forecasting',
    name: 'Solar GHI RMSE',
    desc: 'Hourly GHI RMSE across 20 East African sites, stratified by cloud regime. Reference: satellite-derived ERA5.',
    longDesc: 'The Solar GHI RMSE benchmark evaluates hourly global horizontal irradiance (GHI) predictions across 20 East African sites, stratified into three cloud regimes: clear-sky, partly cloudy and overcast. Each regime is evaluated separately because models that perform well in clear conditions often fail under high-aerosol or overcast conditions common in sub-Saharan Africa. RMSE is reported in W/m² and as a fraction of clear-sky GHI. The reference dataset is BSRN-grade pyranometer measurements (not satellite-derived ERA5) to avoid circularity.',
    metric: 'RMSE (W/m²)',
    higherIsBetter: false,
    leader: 'SolarGHI-Irrad',
    leaderModelId: 'solarghi-irrad',
    leaderScore: '28 W/m²',
    modelCount: 14,
    evaluationDataset: 'BSRN pyranometer measurements, 20 sites, 2022–2023',
    relatedSuiteIds: ['wind24-benchmark'],
    methodology: 'Hourly RMSE is computed at 20 sites for calendar year 2023 (held out from all model training). Sites are stratified by cloud regime using the MSG satellite cloud index. RMSE is reported as the site-average, and per-regime breakdowns are provided in the detailed results.',
    submissionGuide: 'Submit a container accepting latitude, longitude, date and time as inputs and returning predicted GHI (W/m²). The evaluation harness calls the container once per site × hour in the test set.',
    changelog: [
      { version: 'v2.0', date: '2026-01-01', note: 'Switched ground truth from ERA5 to BSRN pyranometers; stratified by cloud regime.' },
      { version: 'v1.0', date: '2025-03-01', note: 'Initial release with 10 sites.' },
    ],
    leaderboard: [
      { rank: 1, model: 'SolarGHI-Irrad', modelId: 'solarghi-irrad', family: 'Forecasting', score: 28, submitted: '2026-06-15' },
      { rank: 2, model: 'ConvLSTM-MSG', modelId: null, family: 'Forecasting', score: 34, submitted: '2026-05-22' },
      { rank: 3, model: 'TurkanaWind-24h', modelId: 'turkanawind-24h', family: 'Forecasting', score: 41, submitted: '2026-06-21' },
      { rank: 4, model: 'SARAH-3 Satellite', modelId: null, family: 'Satellite', score: 47, submitted: '2026-04-08' },
      { rank: 5, model: 'ERA5-Direct', modelId: null, family: 'NWP', score: 55, submitted: '2026-01-15' },
      { rank: 6, model: 'LSTM-Solar', modelId: null, family: 'Forecasting', score: 62, submitted: '2026-02-28' },
      { rank: 7, model: 'PVLib-Clear-Sky', modelId: null, family: 'Physical', score: 78, submitted: '2025-12-10' },
      { rank: 8, model: 'Climatology', modelId: null, family: 'Baseline', score: 110, submitted: '2026-01-01' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

evaluator = ab.SolarGHIEvaluator(year=2023, sites=ab.BSRN_SITES_EA)

result = evaluator.run(model=your_model)

print(f"Overall RMSE: {result.rmse_wm2:.0f} W/m²")
print(f"  Clear-sky:    {result.rmse_clear:.0f} W/m²")
print(f"  Partly cloudy:{result.rmse_partly:.0f} W/m²")
print(f"  Overcast:     {result.rmse_overcast:.0f} W/m²")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/solar-ghi-rmse/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "evaluation_year": 2023
  }'`,
    },
  },

  {
    id: 'formation-enthalpy',
    suite: 'Materials',
    name: 'Formation Enthalpy',
    desc: 'MAE on DFT formation enthalpy for 10k held-out RAFM steel compositions from the MP-2024 dataset.',
    longDesc: 'This benchmark evaluates GNN and neural network potential (NNP) models on predicting DFT formation enthalpy for reduced-activation ferritic-martensitic (RAFM) steels. The test set comprises 10,000 compositions sampled from the Materials Project 2024 database that were withheld from all Aether training datasets. Predictions must be made from crystal structure (lattice + species + coordinates) alone. MAE in meV/atom is the primary metric; models must also report 95% prediction interval coverage.',
    metric: 'MAE (meV/atom)',
    higherIsBetter: false,
    leader: 'SteelGNN',
    leaderModelId: 'steelgnn',
    leaderScore: '18 meV/atom',
    modelCount: 6,
    evaluationDataset: 'Materials Project 2024 — 10k RAFM hold-out',
    relatedSuiteIds: ['yield-strength-coverage'],
    methodology: 'The 10k test structures are processed through the submission container. Only atomic coordinates, species and lattice are provided; no experimental properties are included. MAE is computed over the full test set. Coverage is evaluated at 95% CI: the fraction of test points where the true value falls within the predicted interval.',
    submissionGuide: 'Submit a container accepting CIF-format crystal structures and returning predicted formation enthalpy (eV/atom) with uncertainty bounds. The evaluation harness provides test structures as individual CIF files.',
    changelog: [
      { version: 'v2.0', date: '2026-03-01', note: 'Upgraded to MP-2024; test set increased to 10k; added coverage metric.' },
      { version: 'v1.0', date: '2025-06-01', note: 'Initial release (MP-2023, 5k structures).' },
    ],
    leaderboard: [
      { rank: 1, model: 'SteelGNN', modelId: 'steelgnn', family: 'GNN / NNP', score: 18, submitted: '2026-06-18' },
      { rank: 2, model: 'EnergGNN-CHNO', modelId: 'energgnn-chno', family: 'GNN / NNP', score: 24, submitted: '2026-06-16' },
      { rank: 3, model: 'MACE-MP-0', modelId: null, family: 'GNN / NNP', score: 31, submitted: '2026-04-30' },
      { rank: 4, model: 'CHGNet-v0.3', modelId: null, family: 'GNN / NNP', score: 39, submitted: '2026-03-15' },
      { rank: 5, model: 'SchNet-RAFM', modelId: null, family: 'GNN / NNP', score: 52, submitted: '2025-11-02' },
      { rank: 6, model: 'Roost-ElemNet', modelId: null, family: 'ML', score: 78, submitted: '2025-08-18' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

evaluator = ab.FormationEnthalpyEvaluator(
    test_set="MP-2024-RAFM-10k",
)

result = evaluator.run(model=your_model)

print(f"MAE:      {result.mae_mev_atom:.1f} meV/atom")
print(f"Coverage: {result.coverage_95ci:.1f}% (95% CI)")

# Worst-performing composition subspace
print(result.error_by_subspace)`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/formation-enthalpy/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model",
    "test_set": "MP-2024-RAFM-10k"
  }'`,
    },
  },

  {
    id: 'yield-strength-coverage',
    suite: 'Materials',
    name: 'Yield Strength Coverage',
    desc: 'Calibrated uncertainty coverage at 90% CI for yield strength prediction across irradiation dose levels.',
    longDesc: 'Yield Strength Coverage evaluates the calibration of uncertainty estimates for yield strength prediction under irradiation. Well-calibrated models are critical for fusion materials qualification: an under-confident model wastes safety margin, while an over-confident model risks unsafe structural failures. The benchmark tests models across six irradiation dose levels (0, 1, 3, 5, 10, 20 dpa) using the RAFM Mechanical DB hold-out split, reporting 90% CI coverage at each dose level and the sharpness (interval width) at each level.',
    metric: '90% CI coverage (%)',
    higherIsBetter: true,
    leader: 'SteelGNN',
    leaderModelId: 'steelgnn',
    leaderScore: '91.3%',
    modelCount: 5,
    evaluationDataset: 'RAFM Mechanical DB hold-out (stratified by dose)',
    relatedSuiteIds: ['formation-enthalpy'],
    methodology: '10% of the RAFM Mechanical DB is held out with stratified sampling by irradiation dose and alloy composition. Coverage is the fraction of test points where the true yield strength falls within the 90% prediction interval. Sharpness is the mean interval width in MPa. Both metrics are reported per dose level.',
    submissionGuide: 'Submit a container accepting crystal structure and irradiation dose as inputs and returning a yield strength distribution (or mean + std). The 5th and 95th percentiles of the returned distribution are used to compute coverage.',
    changelog: [
      { version: 'v1.2', date: '2026-02-01', note: 'Added per-dose-level breakdown; sharpness metric added alongside coverage.' },
      { version: 'v1.0', date: '2025-07-01', note: 'Initial release.' },
    ],
    leaderboard: [
      { rank: 1, model: 'SteelGNN', modelId: 'steelgnn', family: 'GNN / NNP', score: 91.3, submitted: '2026-06-18' },
      { rank: 2, model: 'EnergGNN-CHNO', modelId: 'energgnn-chno', family: 'GNN / NNP', score: 87.6, submitted: '2026-06-16' },
      { rank: 3, model: 'MACE-Ensemble', modelId: null, family: 'GNN / NNP', score: 84.1, submitted: '2026-04-30' },
      { rank: 4, model: 'BNN-RAFM', modelId: null, family: 'ML', score: 79.8, submitted: '2026-01-12' },
      { rank: 5, model: 'GP-Yield', modelId: null, family: 'Statistical', score: 74.2, submitted: '2025-09-20' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

evaluator = ab.YieldStrengthCoverageEvaluator()

result = evaluator.run(model=your_model)

print(f"Overall 90% CI coverage: {result.coverage:.1f}%")
print(f"Mean interval width:      {result.sharpness_mpa:.0f} MPa")

# Per-dose-level breakdown
for dose, r in result.by_dose.items():
    print(f"  {dose} dpa: cov={r.coverage:.1f}%  width={r.width_mpa:.0f} MPa")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/yield-strength-coverage/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "your-org/your-model"
  }'`,
    },
  },

  {
    id: 'gridcost-kenya',
    suite: 'Dispatch',
    name: 'GridCost-Kenya',
    desc: 'Cumulative dispatch cost reduction over 30-day rollout in the Kenya grid simulation versus merit-order baseline.',
    longDesc: 'GridCost-Kenya evaluates real-time dispatch policies on a high-fidelity simulation of the Kenyan national grid, spanning 30 consecutive days with realistic load profiles, renewable variability and geothermal reservoir dynamics. Policies are compared against the standard merit-order dispatch baseline. Three objectives are tracked: cost reduction (USD), carbon reduction (tCO₂) and reservoir depletion rate change. The Aether Score is a weighted composite (40% cost, 30% carbon, 30% reservoir health). Frequency deviation must remain within ±0.2 Hz at all times; policies that violate this are disqualified.',
    metric: 'Cost reduction vs. baseline (%)',
    higherIsBetter: true,
    leader: 'KenyaDispatch-v1',
    leaderModelId: 'kenyadispatch-v1',
    leaderScore: '−11.4%',
    modelCount: 8,
    evaluationDataset: 'KPLC Dispatch Records + Kenya grid simulation (GridEnvSpec v2)',
    relatedSuiteIds: ['hydroinflow-q90'],
    methodology: 'Policies are evaluated in the Aether GridEnv Kenya v2 simulator (OpenAI Gym interface). The 30-day test episode uses a fixed random seed and the 2023 demand profile from KPLC records. Policies receive state observations every 15 minutes. Frequency constraint violations result in disqualification. Final score is the weighted composite of the three objectives.',
    submissionGuide: 'Implement your policy as an Aether GridAgent with a predict(observation) → action interface. Submit the agent container and GridEnvSpec describing your training environment. Evaluation runs in the standard GridEnv Kenya v2 simulation.',
    changelog: [
      { version: 'v2.0', date: '2026-01-01', note: 'Added reservoir depletion objective; upgraded to GridEnvSpec v2; 2023 demand profile.' },
      { version: 'v1.0', date: '2025-04-01', note: 'Initial release (cost-only objective).' },
    ],
    leaderboard: [
      { rank: 1, model: 'KenyaDispatch-v1', modelId: 'kenyadispatch-v1', family: 'Grid RL', score: 11.4, submitted: '2026-06-21' },
      { rank: 2, model: 'HydroBalancer', modelId: 'hydrobalancer', family: 'Grid RL', score: 8.3, submitted: '2026-06-17' },
      { rank: 3, model: 'SAC-GridKE', modelId: null, family: 'Grid RL', score: 7.6, submitted: '2026-05-08' },
      { rank: 4, model: 'PPO-MeritOrder', modelId: null, family: 'Grid RL', score: 5.9, submitted: '2026-04-15' },
      { rank: 5, model: 'DDPG-Dispatch', modelId: null, family: 'Grid RL', score: 4.2, submitted: '2026-03-02' },
      { rank: 6, model: 'Linear-MPC', modelId: null, family: 'Control', score: 2.8, submitted: '2025-12-18' },
      { rank: 7, model: 'Economic-Dispatch-LP', modelId: null, family: 'Optimisation', score: 1.4, submitted: '2025-10-01' },
      { rank: 8, model: 'Merit-Order', modelId: null, family: 'Baseline', score: 0.0, submitted: '2025-04-01' },
    ],
    codeSnippet: {
      python: `import aether_benchmarks as ab

# GridEnv Kenya v2 evaluation
evaluator = ab.GridCostKenyaEvaluator(
    test_days=30,
    seed=42,
)

result = evaluator.run(agent=your_agent)

print(f"Cost reduction:      −{result.cost_reduction_pct:.1f}%")
print(f"Carbon reduction:    −{result.carbon_reduction_pct:.1f}%")
print(f"Reservoir depletion: {result.reservoir_delta_pct:+.1f}%")
print(f"Aether Score:         {result.aether_score:.3f}")
print(f"Frequency violations: {result.freq_violations}")`,
      curl: `curl -X POST https://api.aether.energy/v1/benchmarks/gridcost-kenya/evaluate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "your-org/your-agent",
    "test_days": 30,
    "seed": 42
  }'`,
    },
  },
]

export function fetchAllBenchmarks() {
  return new Promise(resolve => setTimeout(() => resolve(BENCHMARKS), 300))
}

export function fetchBenchmark(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve(BENCHMARKS.find(b => b.id === id) ?? null), 350)
  )
}

export function fetchRelatedBenchmarks(ids) {
  return new Promise(resolve =>
    setTimeout(() => resolve(BENCHMARKS.filter(b => ids.includes(b.id))), 200)
  )
}

export { BENCHMARKS }
