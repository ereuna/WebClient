-- Ereuna Transactional Database
-- 09_pipeline.sql — Pipeline Domain (schema: pipeline)
-- Supports: PINN → RL → Forecast style chained pipelines

CREATE TABLE pipeline.pipelines (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL UNIQUE REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    pipeline_type   TEXT NOT NULL DEFAULT 'batch', -- batch | stream | realtime
    owner_user_id   UUID REFERENCES identity.users(id),
    owner_org_id    UUID REFERENCES identity.organizations(id),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Pipeline Versions
-- ─────────────────────────────────────────────────────────

CREATE TABLE pipeline.pipeline_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id     UUID NOT NULL REFERENCES pipeline.pipelines(id) ON DELETE CASCADE,
    version         TEXT NOT NULL,
    definition      JSONB NOT NULL,         -- DAG definition (nodes + edges)
    is_latest       BOOLEAN NOT NULL DEFAULT false,
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (pipeline_id, version)
);

-- ─────────────────────────────────────────────────────────
-- Pipeline Steps (nodes in the DAG)
-- ─────────────────────────────────────────────────────────

CREATE TABLE pipeline.pipeline_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES pipeline.pipeline_versions(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    step_type       TEXT NOT NULL,          -- model | dataset | transform | condition | output
    ordinal         SMALLINT NOT NULL,
    model_version_id UUID REFERENCES model.model_versions(id),
    config          JSONB NOT NULL DEFAULT '{}',
    depends_on      UUID[],                 -- array of step IDs
    UNIQUE (version_id, name)
);

-- ─────────────────────────────────────────────────────────
-- Pipeline Runs
-- ─────────────────────────────────────────────────────────

CREATE TABLE pipeline.pipeline_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id      UUID NOT NULL REFERENCES pipeline.pipeline_versions(id),
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | running | succeeded | failed | cancelled
    trigger_type    TEXT NOT NULL DEFAULT 'manual',  -- manual | scheduled | webhook | upstream
    trigger_ref     TEXT,
    input_params    JSONB NOT NULL DEFAULT '{}',
    triggered_by    UUID REFERENCES identity.users(id),
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON pipeline.pipeline_runs (version_id, created_at DESC);
CREATE INDEX ON pipeline.pipeline_runs (status);

-- ─────────────────────────────────────────────────────────
-- Pipeline Run Steps (per-node execution detail)
-- ─────────────────────────────────────────────────────────

CREATE TABLE pipeline.pipeline_run_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID NOT NULL REFERENCES pipeline.pipeline_runs(id) ON DELETE CASCADE,
    step_id         UUID NOT NULL REFERENCES pipeline.pipeline_steps(id),
    status          TEXT NOT NULL DEFAULT 'pending',
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    logs_uri        TEXT,
    output          JSONB,
    error_message   TEXT,
    retry_count     SMALLINT NOT NULL DEFAULT 0,
    UNIQUE (run_id, step_id)
);

-- ─────────────────────────────────────────────────────────
-- Pipeline Artifacts (outputs passed between steps)
-- ─────────────────────────────────────────────────────────

CREATE TABLE pipeline.pipeline_artifacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID NOT NULL REFERENCES pipeline.pipeline_runs(id) ON DELETE CASCADE,
    step_id         UUID REFERENCES pipeline.pipeline_steps(id),
    name            TEXT NOT NULL,
    artifact_type   TEXT NOT NULL,          -- dataset | model | file | metric
    storage_uri     TEXT,
    size_bytes      BIGINT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
