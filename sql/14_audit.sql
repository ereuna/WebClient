-- Ereuna Transactional Database
-- 14_audit.sql — Audit Domain (schema: audit)
-- Important for enterprise customers: immutable event log

-- ─────────────────────────────────────────────────────────
-- Audit Events (general application audit trail)
-- ─────────────────────────────────────────────────────────

CREATE TABLE audit.audit_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id   UUID REFERENCES identity.users(id),
    actor_org_id    UUID REFERENCES identity.organizations(id),
    actor_type      TEXT NOT NULL DEFAULT 'user', -- user | service_account | system
    action          TEXT NOT NULL,          -- e.g. model.create, dataset.delete, user.login
    resource_type   TEXT,                   -- model | dataset | pipeline | user | …
    resource_id     UUID,
    resource_slug   TEXT,
    outcome         TEXT NOT NULL DEFAULT 'success', -- success | failure | partial
    ip_address      INET,
    user_agent      TEXT,
    request_id      TEXT,
    before_state    JSONB,
    after_state     JSONB,
    metadata        JSONB NOT NULL DEFAULT '{}',
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit events are append-only — no updates or deletes allowed.
-- Partition by month for performance at scale.
CREATE INDEX ON audit.audit_events (actor_user_id, occurred_at DESC);
CREATE INDEX ON audit.audit_events (resource_type, resource_id, occurred_at DESC);
CREATE INDEX ON audit.audit_events (action, occurred_at DESC);
CREATE INDEX ON audit.audit_events (occurred_at DESC);

-- ─────────────────────────────────────────────────────────
-- Security Events (login attempts, key usage, policy changes)
-- ─────────────────────────────────────────────────────────

CREATE TABLE audit.security_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type      TEXT NOT NULL,          -- login_success | login_failure | mfa_challenge | key_rotated | suspicious_ip
    user_id         UUID REFERENCES identity.users(id),
    ip_address      INET,
    user_agent      TEXT,
    country_code    CHAR(2),
    severity        TEXT NOT NULL DEFAULT 'info', -- info | low | medium | high | critical
    details         JSONB NOT NULL DEFAULT '{}',
    resolved        BOOLEAN NOT NULL DEFAULT false,
    resolved_at     TIMESTAMPTZ,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON audit.security_events (user_id, occurred_at DESC);
CREATE INDEX ON audit.security_events (event_type, occurred_at DESC);
CREATE INDEX ON audit.security_events (severity, resolved, occurred_at DESC);

-- ─────────────────────────────────────────────────────────
-- Access Logs (API-level access log for compliance)
-- ─────────────────────────────────────────────────────────

CREATE TABLE audit.access_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES identity.users(id),
    api_key_id      UUID REFERENCES identity.api_keys(id),
    method          TEXT NOT NULL,          -- GET | POST | PUT | DELETE
    path            TEXT NOT NULL,
    status_code     SMALLINT NOT NULL,
    request_id      TEXT,
    latency_ms      INT,
    ip_address      INET,
    bytes_sent      BIGINT,
    bytes_received  BIGINT,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- High-volume table — keep only a retention window; archive to cold storage.
CREATE INDEX ON audit.access_logs (user_id, logged_at DESC);
CREATE INDEX ON audit.access_logs (logged_at DESC);
