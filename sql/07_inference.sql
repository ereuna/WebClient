-- Ereuna Transactional Database
-- 07_inference.sql — Inference Domain (schema: inference)
-- Tracks: every inference, every async job, every deployment

-- ─────────────────────────────────────────────────────────
-- Model Endpoints
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.model_endpoints (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID NOT NULL REFERENCES model.model_versions(id),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    endpoint_type   TEXT NOT NULL DEFAULT 'dedicated', -- dedicated | serverless | batch
    status          TEXT NOT NULL DEFAULT 'provisioning', -- provisioning | running | paused | failed | deleted
    url             TEXT,
    region_id       UUID REFERENCES core.regions(id),
    owner_user_id   UUID REFERENCES identity.users(id),
    owner_org_id    UUID REFERENCES identity.organizations(id),
    config          JSONB NOT NULL DEFAULT '{}',    -- timeout, max_tokens, etc.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON inference.model_endpoints (status);

-- ─────────────────────────────────────────────────────────
-- Worker Nodes
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.worker_nodes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id     UUID NOT NULL REFERENCES inference.model_endpoints(id) ON DELETE CASCADE,
    node_id         TEXT NOT NULL UNIQUE,   -- internal cluster node ID
    status          TEXT NOT NULL DEFAULT 'starting', -- starting | ready | draining | terminated
    gpu_type        TEXT,
    gpu_count       SMALLINT,
    ip_address      INET,
    region_id       UUID REFERENCES core.regions(id),
    started_at      TIMESTAMPTZ,
    terminated_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Model Placements (which model is loaded on which node)
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.model_placements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id       UUID NOT NULL REFERENCES inference.worker_nodes(id) ON DELETE CASCADE,
    model_version_id UUID NOT NULL REFERENCES model.model_versions(id),
    loaded_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    unloaded_at     TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────
-- Inference Requests (synchronous)
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.inference_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id     UUID NOT NULL REFERENCES inference.model_endpoints(id),
    worker_id       UUID REFERENCES inference.worker_nodes(id),
    caller_user_id  UUID REFERENCES identity.users(id),
    caller_org_id   UUID REFERENCES identity.organizations(id),
    api_key_id      UUID REFERENCES identity.api_keys(id),
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | processing | succeeded | failed
    input_tokens    INT,
    output_tokens   INT,
    input_payload   JSONB,                  -- omit in prod for PII; store hash
    latency_ms      INT,
    error_code      TEXT,
    requested_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX ON inference.inference_requests (endpoint_id, requested_at DESC);
CREATE INDEX ON inference.inference_requests (caller_user_id, requested_at DESC);

-- ─────────────────────────────────────────────────────────
-- Inference Jobs (asynchronous / batch)
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.inference_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id     UUID NOT NULL REFERENCES inference.model_endpoints(id),
    caller_user_id  UUID REFERENCES identity.users(id),
    name            TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    input_uri       TEXT NOT NULL,          -- s3:// path to batch input
    output_uri      TEXT,                   -- s3:// path to batch output
    item_count      INT,
    completed_count INT NOT NULL DEFAULT 0,
    failed_count    INT NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Inference Results (async job outputs)
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.inference_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES inference.inference_jobs(id) ON DELETE CASCADE,
    item_index      INT NOT NULL,
    status          TEXT NOT NULL,          -- succeeded | failed
    output          JSONB,
    error_message   TEXT,
    latency_ms      INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Usage Records (for billing)
-- ─────────────────────────────────────────────────────────

CREATE TABLE inference.usage_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id     UUID NOT NULL REFERENCES inference.model_endpoints(id),
    caller_user_id  UUID REFERENCES identity.users(id),
    caller_org_id   UUID REFERENCES identity.organizations(id),
    period_start    TIMESTAMPTZ NOT NULL,
    period_end      TIMESTAMPTZ NOT NULL,
    request_count   BIGINT NOT NULL DEFAULT 0,
    input_tokens    BIGINT NOT NULL DEFAULT 0,
    output_tokens   BIGINT NOT NULL DEFAULT 0,
    compute_seconds FLOAT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (endpoint_id, caller_user_id, period_start)
);
