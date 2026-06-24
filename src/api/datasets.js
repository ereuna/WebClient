export const DOMAIN_COLORS = {
  Geothermal: '#cf5a2a',
  Nuclear: '#7c6af7',
  Wind: '#3498db',
  Solar: '#e6b800',
  Hydro: '#2db88a',
  Grid: '#e67e22',
}

const DATASETS = [
  {
    id: 'olkaria-field-logs',
    domain: 'Geothermal',
    title: 'Olkaria Field Logs',
    desc: 'Well-log pressure-temperature profiles from 34 production wells at Olkaria, Kenya. Includes lithology and mud-loss events.',
    longDesc: 'The Olkaria Field Logs dataset comprises continuous pressure-temperature (P-T) profiles collected from 34 active production and injection wells at the Olkaria geothermal complex in Kenya — Africa\'s largest geothermal producer. Data spans 2008–2024 and includes downhole gauge readings at 15-minute intervals, alongside borehole lithology logs, mud-loss event flags, and wellhead chemistry records. Measurements were collected by KenGen engineers and pre-processed by Aether to remove sensor drift, align timestamps and impute short gaps.',
    format: 'Parquet',
    size: '2.4 GB',
    rows: '18.2M',
    license: 'CC BY 4.0',
    downloads: '1.1k',
    updated: '1 month ago',
    version: '3.0',
    coverage: {
      geographic: 'Olkaria geothermal complex, Naivasha, Kenya (−0.89°N, 36.30°E)',
      temporal: '2008-01-01 to 2024-03-31',
      wells: '34 production wells, 8 injection wells',
      depthRange: '800 m – 3,400 m TVD',
    },
    schema: [
      { column: 'well_id', type: 'STRING', desc: 'Unique well identifier (e.g. OW-34)' },
      { column: 'timestamp_utc', type: 'TIMESTAMP', desc: 'UTC timestamp at 15-min resolution' },
      { column: 'depth_m', type: 'FLOAT32', desc: 'True vertical depth (m)' },
      { column: 'pressure_bar', type: 'FLOAT32', desc: 'Downhole pressure (bar)' },
      { column: 'temperature_c', type: 'FLOAT32', desc: 'Temperature (°C)' },
      { column: 'lithology_code', type: 'INT8', desc: 'Encoded rock type (see codebook)' },
      { column: 'mud_loss_flag', type: 'BOOL', desc: 'True if drilling mud loss recorded' },
      { column: 'injection_rate_kgs', type: 'FLOAT32', desc: 'Injection rate at surface (kg/s), NaN for producers' },
    ],
    collection: 'Downhole gauges (Kuster/Sondex) at 15-min interval. Raw CSV files ingested, sensor-drift corrected (Hampel filter), timestamps unified to UTC, gaps < 2h linearly interpolated, longer gaps left as NaN.',
    usageNotes: 'Primary training data for GeoPINN-v2. Recommended split: wells OW-1–OW-28 for training, OW-29–OW-34 for test (held out during Aether model training).',
    relatedModelIds: ['geopinn-v2'],
    relatedDatasetIds: ['hellisheidi-microseismic'],
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")

# Stream the full dataset
stream = client.datasets.stream(
    dataset="aether/olkaria-field-logs",
    columns=["well_id", "timestamp_utc", "depth_m", "pressure_bar", "temperature_c"],
    filters={"well_id": ["OW-01", "OW-02"]},
)

df = pd.DataFrame(stream)
df["timestamp_utc"] = pd.to_datetime(df["timestamp_utc"])
print(df.head())`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/olkaria-field-logs/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "columns": ["well_id", "timestamp_utc", "pressure_bar", "temperature_c"],
    "filters": {"well_id": ["OW-01", "OW-02"]},
    "limit": 1000
  }'`,
    },
  },

  {
    id: 'rafm-mechanical-db',
    domain: 'Nuclear',
    title: 'RAFM Mechanical DB',
    desc: 'Reduced-activation ferritic-martensitic steel mechanical properties compiled from 42 published studies. DFT cross-validated.',
    longDesc: 'The RAFM Mechanical DB consolidates mechanical property measurements for reduced-activation ferritic-martensitic (RAFM) steels — the leading structural material candidate for fusion reactor blanket modules — from 42 peer-reviewed publications (1998–2024). Included properties cover tensile strength, yield strength, Charpy impact energy and creep rupture at various irradiation doses (0–20 dpa) and temperatures (20–800°C). DFT-computed formation enthalpies from Materials Project 2024 are cross-linked to each alloy composition.',
    format: 'JSON',
    size: '340 MB',
    rows: '290k',
    license: 'CC BY 4.0',
    downloads: '620',
    updated: '2 months ago',
    version: '2.1',
    coverage: {
      geographic: 'Global (compiled from published literature)',
      temporal: 'Experiments 1998–2024',
      alloys: '140 distinct RAFM steel compositions',
      irradiationRange: '0 – 20 dpa (displacement per atom)',
    },
    schema: [
      { column: 'alloy_id', type: 'STRING', desc: 'Internal alloy identifier' },
      { column: 'composition', type: 'OBJECT', desc: 'Elemental mass fractions (Fe, Cr, W, Ta, …)' },
      { column: 'test_temperature_c', type: 'FLOAT32', desc: 'Mechanical test temperature (°C)' },
      { column: 'irradiation_dose_dpa', type: 'FLOAT32', desc: 'Cumulative neutron dose (dpa)' },
      { column: 'yield_strength_mpa', type: 'FLOAT32', desc: 'Yield strength (MPa)' },
      { column: 'tensile_strength_mpa', type: 'FLOAT32', desc: 'Ultimate tensile strength (MPa)' },
      { column: 'charpy_j', type: 'FLOAT32', desc: 'Charpy V-notch impact energy (J)' },
      { column: 'dft_formation_enthalpy_ev', type: 'FLOAT32', desc: 'DFT formation enthalpy (eV/atom) from MP-2024' },
      { column: 'source_doi', type: 'STRING', desc: 'DOI of source publication' },
    ],
    collection: 'Manual extraction from 42 publications with automated digitisation of figure-embedded data (WebPlotDigitizer). DFT formation enthalpy linked via Materials Project 2024 API using composition matching.',
    usageNotes: 'Training dataset for SteelGNN. Recommended 80/10/10 stratified split by alloy_id to avoid data leakage across compositions.',
    relatedModelIds: ['steelgnn', 'nuclpinn-1'],
    relatedDatasetIds: ['chno-molecule-library'],
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")

records = client.datasets.download(
    dataset="aether/rafm-mechanical-db",
    filters={
        "irradiation_dose_dpa": {"gte": 5.0, "lte": 15.0},
        "test_temperature_c": {"lte": 400},
    }
)

df = pd.json_normalize(records)
print(df[["alloy_id", "yield_strength_mpa", "irradiation_dose_dpa"]].describe())`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/rafm-mechanical-db/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "filters": {
      "irradiation_dose_dpa": {"gte": 5.0, "lte": 15.0},
      "test_temperature_c": {"lte": 400}
    },
    "limit": 500
  }'`,
    },
  },

  {
    id: 'turkana-scada',
    domain: 'Wind',
    title: 'Turkana 10-min SCADA',
    desc: '10-minute SCADA from 365 turbines at Lake Turkana Wind Power, 2018–2024. Pre-cleaned with curtailment flags.',
    longDesc: 'The Turkana 10-min SCADA dataset contains supervisory control and data acquisition (SCADA) records from all 365 wind turbines at the Lake Turkana Wind Power (LTWP) facility — Kenya\'s largest wind farm at 310 MW installed. Data runs from January 2018 to December 2024 at 10-minute resolution and covers active power, rotor speed, nacelle orientation, wind speed at hub height, blade pitch and generator temperature. Curtailment events are flagged by a separate column derived from LTWP dispatch logs.',
    format: 'Parquet',
    size: '18 GB',
    rows: '190M',
    license: 'Apache-2.0',
    downloads: '3.3k',
    updated: '3 weeks ago',
    version: '4.0',
    coverage: {
      geographic: 'Lake Turkana Wind Power, Marsabit County, Kenya (2.97°N, 36.94°E)',
      temporal: '2018-01-01 to 2024-12-31',
      turbines: '365 × Vestas V52-850kW turbines',
      resolution: '10-minute intervals',
    },
    schema: [
      { column: 'turbine_id', type: 'STRING', desc: 'Turbine identifier (T001 – T365)' },
      { column: 'timestamp_utc', type: 'TIMESTAMP', desc: 'UTC timestamp at 10-min resolution' },
      { column: 'active_power_kw', type: 'FLOAT32', desc: 'Active power output (kW)' },
      { column: 'wind_speed_ms', type: 'FLOAT32', desc: 'Nacelle anemometer wind speed (m/s)' },
      { column: 'wind_direction_deg', type: 'FLOAT32', desc: 'Nacelle orientation (°)' },
      { column: 'rotor_rpm', type: 'FLOAT32', desc: 'Rotor rotational speed (rpm)' },
      { column: 'blade_pitch_deg', type: 'FLOAT32', desc: 'Mean blade pitch angle (°)' },
      { column: 'generator_temp_c', type: 'FLOAT32', desc: 'Generator winding temperature (°C)' },
      { column: 'curtailment_flag', type: 'BOOL', desc: 'True if turbine was curtailed by grid operator' },
      { column: 'availability_flag', type: 'BOOL', desc: 'True if turbine was available (not in maintenance)' },
    ],
    collection: 'SCADA raw export from LTWP historian (OSIsoft PI). Sensor-range outliers removed (IQR 3σ), curtailment flags derived from KPLC dispatch instructions, timestamps unified to UTC.',
    usageNotes: 'Core training data for TurkanaWind-24h. Filter curtailment_flag=False and availability_flag=True for clean power curve modelling.',
    relatedModelIds: ['turkanawind-24h', 'kenyadispatch-v1'],
    relatedDatasetIds: ['kplc-dispatch'],
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")

df = client.datasets.load_partition(
    dataset="aether/turkana-scada",
    year=2023,
    turbine_ids=["T001", "T002", "T003"],
)

# Filter to clean, available, non-curtailed records
clean = df[df["availability_flag"] & ~df["curtailment_flag"]]
print(clean[["timestamp_utc", "wind_speed_ms", "active_power_kw"]].head(10))`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/turkana-scada/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "columns": ["turbine_id", "timestamp_utc", "wind_speed_ms", "active_power_kw"],
    "filters": {
      "turbine_id": ["T001","T002"],
      "curtailment_flag": false,
      "availability_flag": true,
      "year": 2023
    },
    "limit": 5000
  }'`,
    },
  },

  {
    id: 'east-africa-ghi',
    domain: 'Solar',
    title: 'East Africa GHI Atlas',
    desc: 'Hourly global horizontal irradiance for 1,200 sites across East Africa derived from MSG satellite imagery.',
    longDesc: 'The East Africa GHI Atlas provides hourly global horizontal irradiance (GHI) and direct normal irradiance (DNI) estimates at 1,200 ground-reference sites across a region spanning Kenya, Tanzania, Uganda, Ethiopia, Rwanda, Burundi and South Sudan. Irradiance is retrieved from Meteosat Second Generation (MSG) satellite imagery using a Heliosat-4 cloud-index algorithm, enhanced with MERRA-2 aerosol optical depth to correct for Saharan dust intrusion. Each site record includes sky-type classification (clear, partly cloudy, overcast) and aerosol loading index.',
    format: 'NetCDF',
    size: '5.1 GB',
    rows: '63M',
    license: 'CC BY 4.0',
    downloads: '2.0k',
    updated: '6 weeks ago',
    version: '2.0',
    coverage: {
      geographic: 'East Africa: 5°S–15°N, 28°E–42°E; 1,200 reference sites at ~1 km spacing',
      temporal: '2010-01-01 to 2024-12-31 (hourly)',
      satellite: 'Meteosat-9 / MSG-3 (primary), MSG-4 (backup)',
      groundValidation: '8 BSRN-grade pyranometer stations',
    },
    schema: [
      { column: 'site_id', type: 'STRING', desc: 'Site identifier (lat/lon encoded)' },
      { column: 'latitude', type: 'FLOAT32', desc: 'Site latitude (°N)' },
      { column: 'longitude', type: 'FLOAT32', desc: 'Site longitude (°E)' },
      { column: 'timestamp_utc', type: 'TIMESTAMP', desc: 'UTC timestamp (hourly)' },
      { column: 'ghi_wm2', type: 'FLOAT32', desc: 'Global horizontal irradiance (W/m²)' },
      { column: 'dni_wm2', type: 'FLOAT32', desc: 'Direct normal irradiance (W/m²)' },
      { column: 'dhi_wm2', type: 'FLOAT32', desc: 'Diffuse horizontal irradiance (W/m²)' },
      { column: 'sky_type', type: 'INT8', desc: '0=clear, 1=partly cloudy, 2=overcast' },
      { column: 'aod_550nm', type: 'FLOAT32', desc: 'Aerosol optical depth at 550 nm (MERRA-2)' },
    ],
    collection: 'MSG satellite cloud-index retrieval (Heliosat-4) with MERRA-2 AOD correction. Ground validation against 8 BSRN pyranometer stations; bias correction applied per cloud-regime stratum.',
    usageNotes: 'Training data for SolarGHI-Irrad. For PV yield modelling use the DNI+DHI split. Clear-sky periods (sky_type=0) are most reliable for aerosol sensitivity studies.',
    relatedModelIds: ['solarghi-irrad', 'kenyadispatch-v1'],
    relatedDatasetIds: ['turkana-scada'],
    codeSnippet: {
      python: `import aether
import xarray as xr

client = aether.Client(api_key="YOUR_API_KEY")

# Load as xarray Dataset for a bounding box
ds = client.datasets.load_netcdf(
    dataset="aether/east-africa-ghi",
    bbox={"lat": (-1.5, 1.5), "lon": (36.5, 38.0)},
    year=2023,
)

ghi = ds["ghi_wm2"]
print(ghi.sel(site_id="KE_NAI_001").mean())   # annual mean GHI`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/east-africa-ghi/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bbox": {"lat_min": -1.5, "lat_max": 1.5, "lon_min": 36.5, "lon_max": 38.0},
    "columns": ["site_id","timestamp_utc","ghi_wm2","dni_wm2"],
    "year": 2023,
    "limit": 5000
  }'`,
    },
  },

  {
    id: 'lake-victoria-inflow',
    domain: 'Hydro',
    title: 'Lake Victoria Inflow',
    desc: 'Daily inflow series for Owen Falls and Kiira dams, 1960–2023. Includes upstream catchment rainfall and evapotranspiration.',
    longDesc: 'The Lake Victoria Inflow dataset provides daily natural inflow estimates for the two main hydropower stations on the Victoria Nile — Owen Falls (Nalubaale) and Kiira — from 1960 to 2023. Inflow is reconstructed from reservoir-level records, release logs and rainfall-runoff modelling using the HBV-Light model calibrated on GRDC gauging stations. Upstream catchment rainfall (CHIRPS v2) and FAO Penman-Monteith evapotranspiration are co-located to support hydrological feature engineering.',
    format: 'CSV',
    size: '120 MB',
    rows: '1.1M',
    license: 'MIT',
    downloads: '880',
    updated: '2 months ago',
    version: '1.4',
    coverage: {
      geographic: 'Owen Falls / Kiira dam site, Jinja, Uganda (0.44°N, 33.20°E); upstream catchment ~194,000 km²',
      temporal: '1960-01-01 to 2023-12-31 (daily)',
      catchment: 'Lake Victoria basin (Kenya, Uganda, Tanzania, Rwanda, Burundi)',
      stations: '12 GRDC reference gauging stations',
    },
    schema: [
      { column: 'date', type: 'DATE', desc: 'Calendar date (daily)' },
      { column: 'site', type: 'STRING', desc: '"owen_falls" or "kiira"' },
      { column: 'inflow_cms', type: 'FLOAT32', desc: 'Daily mean inflow (m³/s)' },
      { column: 'release_cms', type: 'FLOAT32', desc: 'Turbine + spillway release (m³/s)' },
      { column: 'reservoir_level_m', type: 'FLOAT32', desc: 'End-of-day reservoir level (m asl)' },
      { column: 'catchment_rainfall_mm', type: 'FLOAT32', desc: 'Spatially-averaged CHIRPS rainfall (mm/day)' },
      { column: 'et_mm', type: 'FLOAT32', desc: 'FAO PM evapotranspiration (mm/day)' },
      { column: 'quality_flag', type: 'INT8', desc: '0=good, 1=interpolated, 2=estimated' },
    ],
    collection: 'Reservoir level records from Uganda Electricity Generation Company (UEGCL). Inflow back-calculated via water balance; gaps filled with HBV-Light rainfall-runoff model. CHIRPS and ERA5-Land used for meteorological drivers.',
    usageNotes: 'Training data for HydroBalancer. The quality_flag=0 subset is recommended for model training; quality_flag=2 records (estimated) cover mainly pre-1970 data.',
    relatedModelIds: ['hydrobalancer'],
    relatedDatasetIds: ['kplc-dispatch'],
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")

df = client.datasets.download(
    dataset="aether/lake-victoria-inflow",
    filters={
        "site": "owen_falls",
        "quality_flag": 0,   # good-quality only
        "date": {"gte": "1990-01-01"},
    }
)

df["date"] = pd.to_datetime(df["date"])
annual = df.set_index("date")["inflow_cms"].resample("Y").mean()
print(annual)`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/lake-victoria-inflow/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "filters": {
      "site": "owen_falls",
      "quality_flag": 0,
      "date": {"gte": "1990-01-01"}
    },
    "limit": 10000
  }'`,
    },
  },

  {
    id: 'kplc-dispatch',
    domain: 'Grid',
    title: 'KPLC Dispatch Records',
    desc: 'Hourly generation dispatch, frequency deviation and spot prices for the Kenyan national grid, 2019–2024.',
    longDesc: 'The KPLC Dispatch Records dataset contains hourly operational data for the Kenyan national electricity grid as compiled from Kenya Power and Lighting Company (KPLC) and the Energy and Petroleum Regulatory Authority (EPRA) public filings. Each record covers the full generation mix (geothermal, hydro, wind, solar, thermal), system frequency deviation, transmission losses, import/export flows and the published spot market price. This dataset is the ground-truth for training and evaluating KenyaDispatch-v1.',
    format: 'Parquet',
    size: '900 MB',
    rows: '43M',
    license: 'Restricted',
    downloads: '450',
    updated: '1 week ago',
    version: '2.3',
    coverage: {
      geographic: 'Kenya national grid (interconnected system)',
      temporal: '2019-01-01 to 2024-12-31 (hourly)',
      generators: '28 dispatchable generation units',
      nodes: '220 kV and 132 kV transmission nodes',
    },
    schema: [
      { column: 'timestamp_utc', type: 'TIMESTAMP', desc: 'UTC timestamp (hourly)' },
      { column: 'total_load_mw', type: 'FLOAT32', desc: 'System load (MW)' },
      { column: 'frequency_hz', type: 'FLOAT32', desc: 'System frequency (Hz)' },
      { column: 'geothermal_mw', type: 'FLOAT32', desc: 'Total geothermal generation (MW)' },
      { column: 'hydro_mw', type: 'FLOAT32', desc: 'Total hydro generation (MW)' },
      { column: 'wind_mw', type: 'FLOAT32', desc: 'Total wind generation (MW)' },
      { column: 'solar_mw', type: 'FLOAT32', desc: 'Total solar generation (MW)' },
      { column: 'thermal_mw', type: 'FLOAT32', desc: 'Total thermal (HFO/diesel) generation (MW)' },
      { column: 'spot_price_usd_mwh', type: 'FLOAT32', desc: 'Spot market clearing price (USD/MWh)' },
      { column: 'transmission_loss_pct', type: 'FLOAT32', desc: 'Transmission losses (%)' },
    ],
    collection: 'Compiled from KPLC Monthly Statistical Bulletins (machine-readable tables), EPRA quarterly generation reports, and a real-time scraper of the KPLC public grid dashboard. Restricted license due to commercial sensitivity of price series.',
    usageNotes: 'Access requires institutional registration. Do not redistribute raw spot-price series. Approved users may use derived features in open publications.',
    relatedModelIds: ['kenyadispatch-v1', 'turkanawind-24h'],
    relatedDatasetIds: ['turkana-scada', 'lake-victoria-inflow'],
    codeSnippet: {
      python: `import aether
import pandas as pd

client = aether.Client(api_key="YOUR_API_KEY")   # restricted access required

df = client.datasets.download(
    dataset="aether/kplc-dispatch",
    columns=[
        "timestamp_utc", "total_load_mw", "geothermal_mw",
        "wind_mw", "spot_price_usd_mwh", "frequency_hz",
    ],
    filters={"year": 2023},
)

df["timestamp_utc"] = pd.to_datetime(df["timestamp_utc"])
print(df.describe())`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/kplc-dispatch/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "columns": ["timestamp_utc","total_load_mw","geothermal_mw","spot_price_usd_mwh"],
    "filters": {"year": 2023},
    "limit": 8760
  }'`,
    },
  },

  {
    id: 'hellisheidi-microseismic',
    domain: 'Geothermal',
    title: 'Hellisheidi Microseismic',
    desc: 'Catalogued seismic events near Hellisheidi geothermal plant including moment magnitude and focal mechanisms.',
    longDesc: 'The Hellisheidi Microseismic dataset catalogues seismic events recorded by the SIL network near the Hellisheidi geothermal power plant in Iceland from 2010 to 2024. Each event includes moment magnitude, hypocenter location, depth, focal mechanism (where available) and proximity to active injection wells. The dataset enables study of induced seismicity risk at high-enthalpy geothermal sites — complementing Olkaria Field Logs with a temperate, high-injection-rate environment.',
    format: 'HDF5',
    size: '7.2 GB',
    rows: '4.8M',
    license: 'CC BY 4.0',
    downloads: '710',
    updated: '3 months ago',
    version: '1.2',
    coverage: {
      geographic: 'Hellisheidi geothermal plant, SW Iceland (64.04°N, 21.41°W) ± 30 km radius',
      temporal: '2010-01-01 to 2024-06-30',
      network: 'SIL (South Iceland Lowlands) seismic network, 22 stations',
      magnitudeRange: 'ML −1.0 to 4.1',
    },
    schema: [
      { column: 'event_id', type: 'STRING', desc: 'Unique event identifier' },
      { column: 'origin_time_utc', type: 'TIMESTAMP', desc: 'Origin time (UTC, ±0.1s precision)' },
      { column: 'latitude', type: 'FLOAT64', desc: 'Hypocenter latitude (°N)' },
      { column: 'longitude', type: 'FLOAT64', desc: 'Hypocenter longitude (°W, negative)' },
      { column: 'depth_km', type: 'FLOAT32', desc: 'Focal depth (km)' },
      { column: 'magnitude_ml', type: 'FLOAT32', desc: 'Local magnitude (ML)' },
      { column: 'focal_mechanism', type: 'OBJECT', desc: 'Strike/dip/rake, NaN if unavailable' },
      { column: 'nearest_injection_well', type: 'STRING', desc: 'Closest active injection well ID' },
      { column: 'distance_to_injection_km', type: 'FLOAT32', desc: 'Distance to nearest active injector (km)' },
      { column: 'waveforms_available', type: 'BOOL', desc: 'True if raw waveform HDF5 group exists' },
    ],
    collection: 'Seismic catalogue from ÍSOR (Iceland GeoSurvey) SIL network. Waveforms stored in HDF5 groups keyed by event_id. Locations computed with HYPOINVERSE-2000.',
    usageNotes: 'For induced seismicity studies, filter distance_to_injection_km < 5 and depth_km < 4. Raw waveforms support PhaseNet and EQTransformer feature extraction.',
    relatedModelIds: ['geopinn-v2'],
    relatedDatasetIds: ['olkaria-field-logs'],
    codeSnippet: {
      python: `import aether
import h5py, io

client = aether.Client(api_key="YOUR_API_KEY")

# Download catalogue as DataFrame
catalogue = client.datasets.download(
    dataset="aether/hellisheidi-microseismic",
    table="catalogue",
    filters={"magnitude_ml": {"gte": 1.5}, "depth_km": {"lte": 5.0}},
)

# Fetch waveform group for a specific event
waveform_bytes = client.datasets.get_waveform(
    dataset="aether/hellisheidi-microseismic",
    event_id=catalogue.iloc[0]["event_id"],
)
with h5py.File(io.BytesIO(waveform_bytes), "r") as f:
    print(list(f.keys()))   # channel names`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/hellisheidi-microseismic/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "table": "catalogue",
    "filters": {
      "magnitude_ml": {"gte": 1.5},
      "depth_km": {"lte": 5.0}
    },
    "limit": 1000
  }'`,
    },
  },

  {
    id: 'chno-molecule-library',
    domain: 'Nuclear',
    title: 'CHNO Molecule Library',
    desc: 'Structural and thermochemical properties for 820k CHNO energetic molecule candidates generated by DFT screening.',
    longDesc: 'The CHNO Molecule Library contains density functional theory (DFT) computed structural and thermochemical properties for 820,000 carbon-hydrogen-nitrogen-oxygen (CHNO) molecule candidates, generated by systematic enumeration of SELFIES grammar sequences and filtered for synthetic accessibility. Properties include formation enthalpy, molecular volume, oxygen balance, estimated detonation velocity (Kamlet-Jacobs), and electronic descriptors (HOMO-LUMO gap). This library underpins both EnergGNN-CHNO and DiffEnergetics.',
    format: 'Parquet',
    size: '3.6 GB',
    rows: '820k',
    license: 'Restricted',
    downloads: '290',
    updated: '4 months ago',
    version: '1.0',
    coverage: {
      geographic: 'Computational (in-silico, no geographic scope)',
      temporal: 'DFT calculations completed 2024',
      molecules: '820,000 CHNO candidates',
      dftLevel: 'PBE-D3/6-311G** (Gaussian 16)',
    },
    schema: [
      { column: 'mol_id', type: 'STRING', desc: 'Unique molecule identifier' },
      { column: 'selfies', type: 'STRING', desc: 'SELFIES string representation' },
      { column: 'smiles', type: 'STRING', desc: 'Canonical SMILES' },
      { column: 'molecular_formula', type: 'STRING', desc: 'Hill notation formula' },
      { column: 'formation_enthalpy_eV', type: 'FLOAT32', desc: 'DFT formation enthalpy (eV/molecule)' },
      { column: 'molecular_volume_A3', type: 'FLOAT32', desc: 'Computed molecular volume (Å³)' },
      { column: 'density_gcm3', type: 'FLOAT32', desc: 'Estimated crystal density (g/cm³)' },
      { column: 'oxygen_balance_pct', type: 'FLOAT32', desc: 'Oxygen balance (%)' },
      { column: 'detonation_velocity_ms', type: 'FLOAT32', desc: 'Kamlet-Jacobs estimated detonation velocity (m/s)' },
      { column: 'homo_lumo_gap_ev', type: 'FLOAT32', desc: 'HOMO-LUMO gap (eV)' },
      { column: 'sa_score', type: 'FLOAT32', desc: 'Synthetic accessibility score (1=easy, 10=hard)' },
    ],
    collection: 'Systematic SELFIES enumeration (depth-first grammar walk, max 25 tokens) filtered by CHNO element constraint. DFT geometry optimisation + single-point energy at PBE-D3/6-311G** level using Gaussian 16 on an HPC cluster (12,000 GPU-hours). Access restricted due to dual-use considerations.',
    usageNotes: 'Access requires institutional affiliation and approved use-case. Filter sa_score < 4 for synthetically accessible candidates. Detonation velocity column is a Kamlet-Jacobs estimate; use EnergGNN-CHNO for higher-fidelity predictions.',
    relatedModelIds: ['energgnn-chno', 'diffenergetics'],
    relatedDatasetIds: ['rafm-mechanical-db'],
    codeSnippet: {
      python: `import aether
import pandas as pd

# Restricted access — requires approved account
client = aether.Client(api_key="YOUR_API_KEY")

df = client.datasets.download(
    dataset="aether/chno-molecule-library",
    filters={
        "oxygen_balance_pct": {"gte": -20, "lte": 10},
        "detonation_velocity_ms": {"gte": 8000},
        "sa_score": {"lte": 4.0},
    },
    columns=["mol_id", "smiles", "detonation_velocity_ms", "oxygen_balance_pct", "density_gcm3"],
)

print(f"Candidate count: {len(df)}")
print(df.sort_values("detonation_velocity_ms", ascending=False).head())`,
      curl: `curl -X POST https://api.aether.energy/v1/datasets/chno-molecule-library/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "filters": {
      "oxygen_balance_pct": {"gte": -20, "lte": 10},
      "detonation_velocity_ms": {"gte": 8000},
      "sa_score": {"lte": 4.0}
    },
    "columns": ["mol_id","smiles","detonation_velocity_ms","oxygen_balance_pct"],
    "limit": 500
  }'`,
    },
  },
]

export function fetchAllDatasets() {
  return new Promise(resolve => setTimeout(() => resolve(DATASETS), 300))
}

export function fetchDataset(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve(DATASETS.find(d => d.id === id) ?? null), 350)
  )
}

export function fetchRelatedDatasets(ids) {
  return new Promise(resolve =>
    setTimeout(() => resolve(DATASETS.filter(d => ids.includes(d.id))), 200)
  )
}

export { DATASETS }
