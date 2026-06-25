/**
 * Canonical file manifests and mock content for each repository type.
 *
 * Each file entry:
 *   name    – filename or folder name
 *   ext     – extension used to pick an icon / renderer
 *   type    – 'file' | 'folder'
 *   size    – human-readable size
 *   commit  – last commit message
 *   time    – relative timestamp
 *   content – { type: 'json'|'text'|'markdown', data|text|sections }
 *             null for folders (no preview)
 */

// ── MODEL ─────────────────────────────────────────────────────────────────────

const MODEL_FILES = [
  {
    name: 'README.md', ext: 'md', type: 'file',
    size: '4.2 KB', commit: 'Update model documentation', time: '2d ago',
    content: {
      type: 'markdown',
      sections: [
        { kind: 'h1', text: 'GeoThermalNet' },
        { kind: 'p',  text: 'A physics-informed neural network (PINN) for high-fidelity simulation of geothermal reservoir dynamics. Couples Navier-Stokes fluid flow with heat-transport PDEs, enforcing physical constraints directly in the loss function.' },
        { kind: 'h2', text: 'Installation' },
        { kind: 'code', lang: 'bash', text: 'pip install -r requirements.txt\n# Python 3.11 and PyTorch 2.1+ required' },
        { kind: 'h2', text: 'Quick Start' },
        { kind: 'code', lang: 'python', text: 'from model import GeoThermalNet\n\nmodel = GeoThermalNet.from_pretrained("aether/geothermalnet-base")\nresult = model.predict(x, y, z, t)  # pressure, temperature, velocity' },
        { kind: 'h2', text: 'Citation' },
        { kind: 'p',  text: 'If you use GeoThermalNet in research please cite: "Physics-Informed Neural Simulation of Geothermal Reservoirs", Aether Energy Lab, 2024.' },
      ],
    },
  },
  {
    name: 'config.json', ext: 'json', type: 'file',
    size: '2.1 KB', commit: 'Tune hyperparameters for v1.2 release', time: '3d ago',
    content: {
      type: 'json',
      data: {
        model_type: 'pinn',
        version: '1.2.0',
        architecture: {
          encoder_layers: [256, 512, 512, 256],
          decoder_layers: [256, 128, 64],
          activation: 'tanh',
          residual_connections: true,
          input_dim: 4,
          output_dim: 3,
          fourier_features: 64,
        },
        training: {
          learning_rate: 0.0001,
          lr_scheduler: 'cosine_annealing',
          batch_size: 2048,
          epochs: 500,
          warmup_steps: 1000,
          gradient_clip: 1.0,
          weight_decay: 0.00001,
        },
        physics: {
          pde_weight: 0.8,
          data_weight: 0.2,
          boundary_weight: 1.0,
          collocation_points: 10000,
          equations: ['navier_stokes', 'heat_transport', 'darcy_flow'],
        },
      },
    },
  },
  {
    name: 'inference.json', ext: 'json', type: 'file',
    size: '1.4 KB', commit: 'Add latency stats and batch size constraint', time: '3d ago',
    content: {
      type: 'json',
      data: {
        schema_version: '1.0',
        inputs: [
          { name: 'x', type: 'float32', shape: [-1, 1], range: [0, 1], description: 'Normalized x-coordinate' },
          { name: 'y', type: 'float32', shape: [-1, 1], range: [0, 1], description: 'Normalized y-coordinate' },
          { name: 'z', type: 'float32', shape: [-1, 1], range: [0, 1], description: 'Normalized depth' },
          { name: 't', type: 'float32', shape: [-1, 1], range: [0, 1], description: 'Normalized time' },
        ],
        outputs: [
          { name: 'pressure',    type: 'float32', shape: [-1, 1], unit: 'MPa', description: 'Reservoir pressure' },
          { name: 'temperature', type: 'float32', shape: [-1, 1], unit: '°C',  description: 'Fluid temperature' },
          { name: 'velocity',    type: 'float32', shape: [-1, 3], unit: 'm/s', description: 'Flow velocity vector (u, v, w)' },
        ],
        constraints: { max_batch_size: 4096, input_normalization: 'min_max' },
        performance: { latency_p50_ms: 12, latency_p99_ms: 45, throughput_samples_per_sec: 85000 },
        endpoint: '/v1/inference/geothermalnet-base',
      },
    },
  },
  {
    name: 'model_card.json', ext: 'json', type: 'file',
    size: '3.2 KB', commit: 'Update evaluation metrics for v1.2', time: '3d ago',
    content: {
      type: 'json',
      data: {
        model_id: 'aether/geothermalnet-base',
        intended_use: {
          primary: ['Geothermal reservoir simulation', 'Well-log interpolation', 'Production forecasting'],
          out_of_scope: ['General fluid dynamics', 'Supersonic or turbulent flows'],
        },
        training_data: {
          dataset: 'aether/olkaria-field-logs',
          synthetic_fraction: 0.35,
          description: '14,000 downhole logs from Olkaria Geothermal Field, Kenya.',
        },
        evaluation: {
          benchmarks: ['GeoThermal-Bench-v1'],
          metrics: { pressure_rmse_mpa: 0.031, temperature_mae_c: 1.8, velocity_r2: 0.97 },
        },
        limitations: 'Performance degrades for supercritical CO₂ injection and high-salinity brines (>280 g/L). Validated for liquid-dominated systems to 3 km depth.',
        biases: 'Training data concentrated in East African rift-zone geology. Less reliable for granitic or sedimentary basin reservoirs.',
        license: 'Apache 2.0',
        contact: 'models@aether.energy',
      },
    },
  },
  {
    name: 'requirements.txt', ext: 'txt', type: 'file',
    size: '480 B', commit: 'Pin torch to 2.1.2', time: '8d ago',
    content: {
      type: 'text',
      text: 'torch==2.1.2\ntorchvision==0.16.2\nnumpy==1.26.4\nscipy==1.12.0\npandas==2.2.2\naether==0.9.4\ntqdm==4.66.4\ntensorboard==2.16.2\nonnx==1.16.1\nonnxruntime==1.18.1',
    },
  },
  {
    name: 'checkpoints', ext: 'folder', type: 'folder',
    size: '14.8 GB', commit: 'Add v1.2.0 checkpoint (best val RMSE)', time: '3d ago',
    content: null,
  },
]

// ── DATASET ───────────────────────────────────────────────────────────────────

const DATASET_FILES = [
  {
    name: 'README.md', ext: 'md', type: 'file',
    size: '3.8 KB', commit: 'Add collection methodology and license section', time: '1w ago',
    content: {
      type: 'markdown',
      sections: [
        { kind: 'h1', text: 'Olkaria Field Logs' },
        { kind: 'p',  text: '14,000 well logs from the Olkaria Geothermal Field, Kenya. Collected during the 2022 KenGen / GDC drilling campaign. Covers downhole temperature, pressure, gamma-ray, resistivity, and caliper across OW-01 through OW-28.' },
        { kind: 'h2', text: 'Quick Load' },
        { kind: 'code', lang: 'python', text: 'import aether\n\nds   = aether.load_dataset("aether/olkaria-field-logs")\ntrain = ds["train"]       # 9,800 rows\nval   = ds["validation"]  # 2,100 rows\ntest  = ds["test"]        # 2,100 rows' },
        { kind: 'h2', text: 'License' },
        { kind: 'p',  text: 'Distributed under CC BY 4.0. Please cite: KenGen / GDC Well Logging Program 2022, Olkaria Geothermal Field, Kenya.' },
      ],
    },
  },
  {
    name: 'dataset_info.json', ext: 'json', type: 'file',
    size: '1.8 KB', commit: 'Update row count and size after v2.1 release', time: '1w ago',
    content: {
      type: 'json',
      data: {
        name: 'olkaria-field-logs',
        version: '2.1.0',
        domain: 'Geothermal',
        format: 'Parquet',
        total_rows: 14000,
        size_bytes: 8926234624,
        size_human: '8.3 GB',
        license: 'CC BY 4.0',
        created_at: '2022-03-15',
        updated_at: '2024-11-01',
        provenance: {
          source: 'KenGen / GDC Well Logging Program 2022',
          collection_method: 'Downhole logging: caliper, gamma-ray, resistivity, temperature',
          geographic_area: 'Olkaria Geothermal Field, Kenya (36.27–36.32°E, 0.86–0.91°S)',
        },
        splits: { train: 0.7, validation: 0.15, test: 0.15 },
        contact: 'data@aether.energy',
      },
    },
  },
  {
    name: 'schema.json', ext: 'json', type: 'file',
    size: '4.2 KB', commit: 'Add lithology column and partitioning config', time: '2w ago',
    content: {
      type: 'json',
      data: {
        version: '2.1.0',
        columns: [
          { name: 'well_id',          type: 'string',            nullable: false, description: 'Unique well identifier (e.g. OW-01)' },
          { name: 'depth_m',          type: 'float32',           nullable: false, description: 'Measured depth from surface (m)' },
          { name: 'temperature_c',    type: 'float32',           nullable: true,  description: 'Downhole temperature (°C)' },
          { name: 'pressure_mpa',     type: 'float32',           nullable: true,  description: 'Reservoir pressure (MPa)' },
          { name: 'gamma_ray_api',    type: 'float32',           nullable: true,  description: 'Gamma-ray log (API units)' },
          { name: 'resistivity_ohmm', type: 'float32',           nullable: true,  description: 'Deep resistivity (Ω·m)' },
          { name: 'caliper_in',       type: 'float32',           nullable: true,  description: 'Borehole caliper (inches)' },
          { name: 'lithology',        type: 'string',            nullable: true,  description: 'Interpreted lithology class' },
          { name: 'timestamp',        type: 'datetime64[ns,UTC]', nullable: false, description: 'Log acquisition timestamp (UTC)' },
        ],
        primary_key: ['well_id', 'depth_m', 'timestamp'],
        partitioning: { column: 'well_id', strategy: 'hash', num_partitions: 28 },
      },
    },
  },
  {
    name: 'splits.json', ext: 'json', type: 'file',
    size: '0.9 KB', commit: 'Use well-stratified split to prevent data leakage', time: '2w ago',
    content: {
      type: 'json',
      data: {
        version: '2.1.0',
        strategy: 'well_stratified',
        description: 'Split by well to avoid spatial leakage between train and test sets.',
        splits: {
          train: {
            wells: ['OW-01','OW-02','OW-03','OW-04','OW-05','OW-06','OW-07','OW-08','OW-09','OW-10','OW-11','OW-12','OW-13','OW-14','OW-15','OW-16','OW-17','OW-18','OW-19','OW-20'],
            fraction: 0.7,
            rows: 9800,
          },
          validation: {
            wells: ['OW-21','OW-22','OW-23','OW-24'],
            fraction: 0.15,
            rows: 2100,
          },
          test: {
            wells: ['OW-25','OW-26','OW-27','OW-28'],
            fraction: 0.15,
            rows: 2100,
          },
        },
      },
    },
  },
  {
    name: 'preprocessing.py', ext: 'py', type: 'file',
    size: '6.4 KB', commit: 'Add z-score normalization and null interpolation', time: '2w ago',
    content: {
      type: 'text',
      text: [
        'import pandas as pd',
        'import numpy as np',
        '',
        'NUMERIC_COLS = [',
        '    "depth_m", "temperature_c", "pressure_mpa",',
        '    "gamma_ray_api", "resistivity_ohmm", "caliper_in",',
        ']',
        '',
        'def load_parquet(path: str) -> pd.DataFrame:',
        '    return pd.read_parquet(path)',
        '',
        'def interpolate_nulls(df: pd.DataFrame) -> pd.DataFrame:',
        '    """Linear interpolation within each well, then forward-fill edges."""',
        '    return (',
        '        df.sort_values(["well_id", "depth_m"])',
        '          .groupby("well_id", group_keys=False)',
        '          .apply(lambda g: g.interpolate(method="linear").ffill().bfill())',
        '    )',
        '',
        'def z_score_normalize(df: pd.DataFrame, stats: dict | None = None):',
        '    """Normalize NUMERIC_COLS by z-score. Fit on train, apply to val/test."""',
        '    if stats is None:',
        '        stats = {c: (df[c].mean(), df[c].std()) for c in NUMERIC_COLS}',
        '    for col, (mu, sigma) in stats.items():',
        '        df[col] = (df[col] - mu) / (sigma + 1e-8)',
        '    return df, stats',
        '',
        'def preprocess(path: str, stats: dict | None = None):',
        '    df = load_parquet(path)',
        '    df = interpolate_nulls(df)',
        '    df, stats = z_score_normalize(df, stats)',
        '    return df, stats',
      ].join('\n'),
    },
  },
  {
    name: 'data', ext: 'folder', type: 'folder',
    size: '8.3 GB', commit: 'Add v2.1 Parquet shards (28 wells)', time: '1w ago',
    content: null,
  },
]

// ── SPACE (App) ───────────────────────────────────────────────────────────────

const SPACE_FILES = [
  {
    name: 'README.md', ext: 'md', type: 'file',
    size: '2.6 KB', commit: 'Update deployment instructions', time: '5d ago',
    content: {
      type: 'markdown',
      sections: [
        { kind: 'h1', text: 'GeoSight' },
        { kind: 'p',  text: 'Interactive 3D visualiser for geothermal reservoir P-T-stress fields, powered by GeoPINN-v2. Operators drag wells, adjust injection rates, and see predicted drawdown in real time.' },
        { kind: 'h2', text: 'Running Locally' },
        { kind: 'code', lang: 'bash', text: 'pip install -r requirements.txt\npython app.py\n# Open http://localhost:7860' },
        { kind: 'h2', text: 'Deployment' },
        { kind: 'p',  text: 'This Space runs on 2 vCPU + 8 GB RAM + T4 GPU on the Aether platform. Configure resources in app.json.' },
        { kind: 'h2', text: 'Models & Datasets' },
        { kind: 'p',  text: 'Powered by aether/geopinn-v2. Requires access to aether/olkaria-field-logs (CC BY 4.0).' },
      ],
    },
  },
  {
    name: 'app.json', ext: 'json', type: 'file',
    size: '1.2 KB', commit: 'Upgrade to T4 GPU and increase memory to 8 GB', time: '5d ago',
    content: {
      type: 'json',
      data: {
        name: 'geosight',
        display_name: 'GeoSight',
        version: '1.2.0',
        runtime: 'python3.11',
        entry_point: 'app.py',
        port: 7860,
        sdk: 'gradio',
        sdk_version: '4.36.1',
        resources: {
          cpu_cores: 2,
          memory_gb: 8,
          gpu: 'T4',
          gpu_memory_gb: 16,
        },
        environment: {
          AETHER_API_URL: 'https://api.aether.energy',
          MAX_BATCH_SIZE: '64',
          CACHE_TTL_SECONDS: '300',
        },
        models: ['aether/geopinn-v2'],
        datasets: ['aether/olkaria-field-logs'],
        tags: ['geothermal', 'PINN', '3D', 'visualization'],
      },
    },
  },
  {
    name: 'requirements.txt', ext: 'txt', type: 'file',
    size: '560 B', commit: 'Pin gradio and onnxruntime versions', time: '5d ago',
    content: {
      type: 'text',
      text: 'gradio==4.36.1\naether==0.9.4\nnumpy==1.26.4\npandas==2.2.2\nonnxruntime-gpu==1.18.1\nplotly==5.22.0\nscipy==1.12.0',
    },
  },
  {
    name: 'app.py', ext: 'py', type: 'file',
    size: '8.3 KB', commit: 'Add live inference slider and export button', time: '5d ago',
    content: {
      type: 'text',
      text: [
        'import gradio as gr',
        'import aether',
        'import numpy as np',
        '',
        'client = aether.Client()',
        'model  = client.models.load("aether/geopinn-v2")',
        '',
        'def run_inference(injection_rate: float, well_id: str):',
        '    """Run GeoPINN-v2 and return pressure + temperature fields."""',
        '    pts = np.mgrid[0:1:32j, 0:1:32j, 0:1:32j].reshape(3, -1).T',
        '    x, y, z = pts[:, 0], pts[:, 1], pts[:, 2]',
        '    t = np.full(len(x), 0.5)',
        '',
        '    result = model.predict(',
        '        x=x, y=y, z=z, t=t,',
        '        context={"injection_rate_kgs": injection_rate, "well_id": well_id},',
        '    )',
        '    return result.pressure_fig, result.temperature_fig',
        '',
        'with gr.Blocks(title="GeoSight") as demo:',
        '    gr.Markdown("# GeoSight — Geothermal Reservoir Visualiser")',
        '    with gr.Row():',
        '        well_id = gr.Dropdown(label="Well", choices=["OW-01","OW-02","OW-03"])',
        '        rate    = gr.Slider(0, 100, value=45, label="Injection rate (kg/s)")',
        '    btn             = gr.Button("Run inference")',
        '    pressure_plot   = gr.Plot(label="Pressure (MPa)")',
        '    temperature_plot = gr.Plot(label="Temperature (°C)")',
        '    btn.click(run_inference, [rate, well_id], [pressure_plot, temperature_plot])',
        '',
        'demo.launch(server_port=7860)',
      ].join('\n'),
    },
  },
  {
    name: 'assets', ext: 'folder', type: 'folder',
    size: '—', commit: 'Add logo, favicon and 3D widget thumbnails', time: '2w ago',
    content: null,
  },
]

// ── PIPELINE ──────────────────────────────────────────────────────────────────

const PIPELINE_FILES = [
  {
    name: 'README.md', ext: 'md', type: 'file',
    size: '3.1 KB', commit: 'Document deploy condition and notification config', time: '4d ago',
    content: {
      type: 'markdown',
      sections: [
        { kind: 'h1', text: 'reservoir-training-pipeline' },
        { kind: 'p',  text: 'End-to-end training pipeline for GeoThermalNet. Runs nightly at 02:00 UTC: ingests fresh well-log data, fine-tunes the model, evaluates against GeoThermal-Bench-v1, and auto-promotes if RMSE < 0.05 MPa.' },
        { kind: 'h2', text: 'Steps' },
        { kind: 'p',  text: '1. Dataset Ingest — loads train split from aether/olkaria-field-logs\n2. Preprocess — normalises and interpolates missing values\n3. Train — fine-tunes aether/geothermalnet-base using params.json\n4. Evaluate — runs GeoThermal-Bench-v1 suite\n5. Deploy — promotes checkpoint if RMSE < 0.05 MPa' },
        { kind: 'h2', text: 'Manual Trigger' },
        { kind: 'code', lang: 'bash', text: 'aether pipeline run reservoir-training-pipeline\naether pipeline run reservoir-training-pipeline --params params.json' },
      ],
    },
  },
  {
    name: 'pipeline.json', ext: 'json', type: 'file',
    size: '3.6 KB', commit: 'Add conditional deploy step and email notifications', time: '4d ago',
    content: {
      type: 'json',
      data: {
        name: 'reservoir-training-pipeline',
        version: '2.0.0',
        schedule: '0 2 * * *',
        timeout_seconds: 3600,
        max_retries: 2,
        notifications: { on_failure: ['ops@aether.energy'] },
        dag: [
          {
            id: 'ingest', type: 'DatasetLoader', depends_on: [],
            config: { dataset: 'aether/olkaria-field-logs', split: 'train', output_path: '/tmp/data/train' },
          },
          {
            id: 'preprocess', type: 'Preprocessor', depends_on: ['ingest'],
            config: { normalize: true, fill_nulls: 'linear_interpolation', output_path: '/tmp/data/processed' },
          },
          {
            id: 'train', type: 'ModelTrainer', depends_on: ['preprocess'],
            config: { model: 'aether/geothermalnet-base', params_file: 'params.json', output_path: '/tmp/checkpoints' },
          },
          {
            id: 'evaluate', type: 'Evaluator', depends_on: ['train'],
            config: { benchmark: 'aether/geothermal-bench-v1', metrics: ['rmse', 'mae', 'r2'] },
          },
          {
            id: 'deploy', type: 'Deployer', depends_on: ['evaluate'],
            condition: 'evaluate.metrics.rmse < 0.05',
            config: { endpoint: 'geo-reservoir-prod', strategy: 'rolling' },
          },
        ],
      },
    },
  },
  {
    name: 'params.json', ext: 'json', type: 'file',
    size: '1.1 KB', commit: 'Reduce LR to 1e-4 and enable early stopping', time: '4d ago',
    content: {
      type: 'json',
      data: {
        training: {
          learning_rate: 0.0001,
          lr_scheduler: 'cosine_annealing',
          batch_size: 2048,
          epochs: 200,
          early_stopping_patience: 20,
          gradient_clip: 1.0,
        },
        preprocessing: {
          sequence_length: 100,
          stride: 10,
          normalize_method: 'z-score',
          augmentation: { noise_std: 0.01, dropout_rate: 0.1 },
        },
        evaluation: {
          primary_metric: 'rmse',
          promotion_threshold: 0.05,
        },
      },
    },
  },
  {
    name: 'requirements.txt', ext: 'txt', type: 'file',
    size: '380 B', commit: 'Add aether pipeline SDK dependency', time: '1w ago',
    content: {
      type: 'text',
      text: 'aether==0.9.4\ntorch==2.1.2\nnumpy==1.26.4\npandas==2.2.2\nscikit-learn==1.5.0\napache-airflow==2.9.3',
    },
  },
  {
    name: 'steps', ext: 'folder', type: 'folder',
    size: '—', commit: 'Add Deployer and Evaluator step implementations', time: '4d ago',
    content: null,
  },
]

// ── Exports ───────────────────────────────────────────────────────────────────

export const REPO_FILES = {
  MODEL:    MODEL_FILES,
  DATASET:  DATASET_FILES,
  SPACE:    SPACE_FILES,
  PIPELINE: PIPELINE_FILES,
}

/** Human-readable type labels */
export const REPO_TYPE_LABELS = {
  MODEL:    'Model',
  DATASET:  'Dataset',
  SPACE:    'Space',
  PIPELINE: 'Pipeline',
}
