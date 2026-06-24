-- Aether Transactional Database
-- 08_deployment.sql — Deployment Domain (schema: deployment)
-- Equivalent to: HuggingFace Endpoints, SageMaker Endpoints

CREATE TABLE deployment.deployments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id),
    model_version_id UUID REFERENCES model.model_versions(id),
    endpoint_id     UUID REFERENCES inference.model_endpoints(id),
    owner_user_id   UUID REFERENCES identity.users(id),
    owner_org_id    UUID REFERENCES identity.organizations(id),
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | active | paused | failed | deleted
    region_id       UUID REFERENCES core.regions(id),
    url             TEXT,
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON deployment.deployments (status);

-- ─────────────────────────────────────────────────────────
-- Deployment Revisions (immutable history of each deploy)
-- ─────────────────────────────────────────────────────────

CREATE TABLE deployment.deployment_revisions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   UUID NOT NULL REFERENCES deployment.deployments(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    model_version_id UUID REFERENCES model.model_versions(id),
    config          JSONB NOT NULL DEFAULT '{}',
    deployed_by     UUID REFERENCES identity.users(id),
    deployed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active       BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (deployment_id, revision_number)
);

-- ─────────────────────────────────────────────────────────
-- Scaling Configuration
-- ─────────────────────────────────────────────────────────

CREATE TABLE deployment.deployment_scaling (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   UUID NOT NULL UNIQUE REFERENCES deployment.deployments(id) ON DELETE CASCADE,
    min_replicas    SMALLINT NOT NULL DEFAULT 1,
    max_replicas    SMALLINT NOT NULL DEFAULT 1,
    target_rps      INT,                    -- requests per second trigger
    scale_down_delay_s INT NOT NULL DEFAULT 300,
    gpu_type        TEXT,
    gpu_count       SMALLINT NOT NULL DEFAULT 1,
    cpu_cores       FLOAT,
    memory_gb       FLOAT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Health Checks
-- ─────────────────────────────────────────────────────────

CREATE TABLE deployment.deployment_health (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   UUID NOT NULL REFERENCES deployment.deployments(id) ON DELETE CASCADE,
    status          TEXT NOT NULL,          -- healthy | degraded | unhealthy
    replica_count   SMALLINT,
    ready_count     SMALLINT,
    latency_p50_ms  INT,
    latency_p99_ms  INT,
    error_rate      FLOAT,
    checked_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON deployment.deployment_health (deployment_id, checked_at DESC);

-- ─────────────────────────────────────────────────────────
-- Deployment Logs
-- ─────────────────────────────────────────────────────────

CREATE TABLE deployment.deployment_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   UUID NOT NULL REFERENCES deployment.deployments(id) ON DELETE CASCADE,
    revision_id     UUID REFERENCES deployment.deployment_revisions(id),
    level           TEXT NOT NULL DEFAULT 'info', -- debug | info | warn | error
    message         TEXT NOT NULL,
    source          TEXT,                   -- replica ID or system
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON deployment.deployment_logs (deployment_id, logged_at DESC);
