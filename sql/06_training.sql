-- Aether Transactional Database
-- 06_training.sql — Training Domain (schema: training)
-- Equivalent to: MLflow, Weights & Biases

-- ─────────────────────────────────────────────────────────
-- Experiments (grouping of related runs)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.experiments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    tags            JSONB NOT NULL DEFAULT '{}',
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_id, name)
);

CREATE TABLE training.experiment_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id   UUID NOT NULL REFERENCES training.experiments(id) ON DELETE CASCADE,
    run_name        TEXT,
    status          TEXT NOT NULL DEFAULT 'created', -- created | running | completed | failed | killed
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    params          JSONB NOT NULL DEFAULT '{}',
    tags            JSONB NOT NULL DEFAULT '{}',
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Training Jobs (compute-level, cluster-aware)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.training_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id),
    experiment_id   UUID REFERENCES training.experiments(id),
    name            TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | queued | running | completed | failed
    job_type        TEXT NOT NULL DEFAULT 'train',   -- train | fine_tune | distill | rl
    region_id       UUID REFERENCES core.regions(id),
    gpu_type        TEXT,                   -- a100 | h100 | v100
    gpu_count       SMALLINT,
    priority        SMALLINT NOT NULL DEFAULT 5,
    config          JSONB NOT NULL DEFAULT '{}',
    submitted_by    UUID REFERENCES identity.users(id),
    queued_at       TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON training.training_jobs (status);

-- ─────────────────────────────────────────────────────────
-- Training Runs (per-epoch / per-step execution)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.training_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES training.training_jobs(id) ON DELETE CASCADE,
    run_id          UUID REFERENCES training.experiment_runs(id),
    run_index       SMALLINT NOT NULL DEFAULT 0,  -- for multi-run jobs
    status          TEXT NOT NULL DEFAULT 'running',
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at     TIMESTAMPTZ,
    checkpoint_uri  TEXT
);

-- ─────────────────────────────────────────────────────────
-- Training Metrics (time-series)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.training_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID NOT NULL REFERENCES training.training_runs(id) ON DELETE CASCADE,
    key             TEXT NOT NULL,          -- loss | val_loss | accuracy | lr
    value           FLOAT NOT NULL,
    step            BIGINT,
    epoch           FLOAT,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON training.training_metrics (run_id, key, step);

-- ─────────────────────────────────────────────────────────
-- Training Artifacts
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.training_artifacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID NOT NULL REFERENCES training.training_runs(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    artifact_type   TEXT NOT NULL,          -- checkpoint | log | config | plot
    storage_uri     TEXT NOT NULL,
    size_bytes      BIGINT,
    step            BIGINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Hyperparameter Trials (HPO)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.hyperparameter_trials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id   UUID NOT NULL REFERENCES training.experiments(id) ON DELETE CASCADE,
    trial_number    INT NOT NULL,
    params          JSONB NOT NULL,
    objective_value FLOAT,
    status          TEXT NOT NULL DEFAULT 'pending',
    run_id          UUID REFERENCES training.experiment_runs(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (experiment_id, trial_number)
);

-- ─────────────────────────────────────────────────────────
-- Resource Usage (for billing attribution)
-- ─────────────────────────────────────────────────────────

CREATE TABLE training.resource_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES training.training_jobs(id) ON DELETE CASCADE,
    gpu_type        TEXT,
    gpu_count       SMALLINT,
    gpu_hours       FLOAT,
    cpu_hours       FLOAT,
    memory_gb_hours FLOAT,
    storage_gb_hours FLOAT,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
