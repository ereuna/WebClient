-- Ereuna Transactional Database
-- 04_dataset.sql — Dataset Domain (schema: dataset)

CREATE TABLE dataset.datasets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL UNIQUE REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    license         TEXT,
    language        TEXT[],                 -- ISO 639-1 codes
    task_categories TEXT[],                 -- classification | generation | …
    size_bytes      BIGINT,
    row_count       BIGINT,
    download_count  BIGINT NOT NULL DEFAULT 0,
    like_count      BIGINT NOT NULL DEFAULT 0,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Dataset Versions
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id      UUID NOT NULL REFERENCES dataset.datasets(id) ON DELETE CASCADE,
    version         TEXT NOT NULL,          -- semver or named (e.g. "v2.1.0")
    commit_sha      TEXT,
    description     TEXT,
    size_bytes      BIGINT,
    row_count       BIGINT,
    is_latest       BOOLEAN NOT NULL DEFAULT false,
    published_at    TIMESTAMPTZ,
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (dataset_id, version)
);

-- ─────────────────────────────────────────────────────────
-- Dataset Files
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES dataset.dataset_versions(id) ON DELETE CASCADE,
    path            TEXT NOT NULL,
    split           TEXT,                   -- train | validation | test
    format          TEXT,                   -- parquet | csv | jsonl | arrow
    size_bytes      BIGINT,
    row_count       BIGINT,
    storage_uri     TEXT NOT NULL,
    content_hash    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (version_id, path)
);

-- ─────────────────────────────────────────────────────────
-- Schemas & Fields
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_schemas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL UNIQUE REFERENCES dataset.dataset_versions(id) ON DELETE CASCADE,
    raw_schema      JSONB NOT NULL,         -- arrow / pandas schema as JSON
    inferred        BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dataset.schema_fields (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_id       UUID NOT NULL REFERENCES dataset.dataset_schemas(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    dtype           TEXT NOT NULL,          -- string | int64 | float32 | …
    nullable        BOOLEAN NOT NULL DEFAULT true,
    description     TEXT,
    pii             BOOLEAN NOT NULL DEFAULT false,
    ordinal         SMALLINT NOT NULL,
    UNIQUE (schema_id, name)
);

-- ─────────────────────────────────────────────────────────
-- Profiling
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES dataset.dataset_versions(id) ON DELETE CASCADE,
    split           TEXT,
    row_count       BIGINT,
    size_bytes      BIGINT,
    null_rate       FLOAT,
    duplicate_rate  FLOAT,
    computed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dataset.column_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id      UUID NOT NULL REFERENCES dataset.dataset_profiles(id) ON DELETE CASCADE,
    field_name      TEXT NOT NULL,
    dtype           TEXT NOT NULL,
    null_count      BIGINT,
    unique_count    BIGINT,
    min_val         TEXT,
    max_val         TEXT,
    mean_val        FLOAT,
    std_val         FLOAT,
    histogram       JSONB,
    top_values      JSONB,
    UNIQUE (profile_id, field_name)
);

-- ─────────────────────────────────────────────────────────
-- Validation
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.validation_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES dataset.dataset_versions(id) ON DELETE CASCADE,
    suite_name      TEXT NOT NULL,          -- great_expectations | custom
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | running | passed | failed
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    triggered_by    UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dataset.validation_findings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID NOT NULL REFERENCES dataset.validation_runs(id) ON DELETE CASCADE,
    expectation     TEXT NOT NULL,
    column_name     TEXT,
    severity        TEXT NOT NULL DEFAULT 'error', -- error | warning | info
    passed          BOOLEAN NOT NULL,
    observed_value  TEXT,
    expected_value  TEXT,
    details         JSONB
);

-- ─────────────────────────────────────────────────────────
-- Lineage
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_lineage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    downstream_id   UUID NOT NULL REFERENCES dataset.datasets(id),
    upstream_id     UUID NOT NULL REFERENCES dataset.datasets(id),
    transform       TEXT,                   -- description of the transform
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (downstream_id, upstream_id)
);

-- ─────────────────────────────────────────────────────────
-- Async Jobs & Previews
-- ─────────────────────────────────────────────────────────

CREATE TABLE dataset.dataset_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id      UUID NOT NULL REFERENCES dataset.datasets(id) ON DELETE CASCADE,
    job_type        TEXT NOT NULL,          -- profile | validate | convert | embed
    status          TEXT NOT NULL DEFAULT 'pending',
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    error_message   TEXT,
    result          JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dataset.dataset_previews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES dataset.dataset_versions(id) ON DELETE CASCADE,
    split           TEXT,
    rows            JSONB NOT NULL,         -- first N rows as JSON array
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
