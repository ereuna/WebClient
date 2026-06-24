-- Aether Transactional Database
-- 15_governance.sql — Governance Domain (schema: governance)
-- Useful for: GDPR, PII, Model Governance

-- ─────────────────────────────────────────────────────────
-- Licenses
-- ─────────────────────────────────────────────────────────

CREATE TABLE governance.licenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spdx_id         TEXT UNIQUE,            -- MIT | Apache-2.0 | CC-BY-4.0
    name            TEXT NOT NULL,
    url             TEXT,
    osi_approved    BOOLEAN NOT NULL DEFAULT false,
    fsf_free        BOOLEAN NOT NULL DEFAULT false,
    allows_commercial BOOLEAN,
    requires_attribution BOOLEAN,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Compliance Checks
-- ─────────────────────────────────────────────────────────

CREATE TABLE governance.compliance_checks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT NOT NULL,          -- model | dataset | pipeline
    entity_id       UUID NOT NULL,
    framework       TEXT NOT NULL,          -- GDPR | HIPAA | SOC2 | EU_AI_ACT
    check_name      TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | passed | failed | waived
    findings        JSONB,
    reviewed_by     UUID REFERENCES identity.users(id),
    reviewed_at     TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON governance.compliance_checks (entity_type, entity_id);
CREATE INDEX ON governance.compliance_checks (framework, status);

-- ─────────────────────────────────────────────────────────
-- Data Classifications (PII tagging)
-- ─────────────────────────────────────────────────────────

CREATE TABLE governance.data_classifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT NOT NULL,          -- dataset | dataset_field | model
    entity_id       UUID NOT NULL,
    field_name      TEXT,                   -- optional: specific column name
    classification  TEXT NOT NULL,          -- public | internal | confidential | pii | phi | secret
    pii_types       TEXT[],                 -- name | email | ssn | dob | ip_address
    justification   TEXT,
    classified_by   UUID REFERENCES identity.users(id),
    classified_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (entity_type, entity_id, field_name)
);

-- ─────────────────────────────────────────────────────────
-- Approval Workflows (model sign-off, data access requests)
-- ─────────────────────────────────────────────────────────

CREATE TABLE governance.approval_workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_type   TEXT NOT NULL,          -- model_release | data_access | compliance_waiver
    entity_type     TEXT NOT NULL,
    entity_id       UUID NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected | expired
    title           TEXT NOT NULL,
    description     TEXT,
    requestor_id    UUID NOT NULL REFERENCES identity.users(id),
    approver_id     UUID REFERENCES identity.users(id),
    approved_at     TIMESTAMPTZ,
    rejected_at     TIMESTAMPTZ,
    rejection_reason TEXT,
    expires_at      TIMESTAMPTZ,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON governance.approval_workflows (status, created_at DESC);
CREATE INDEX ON governance.approval_workflows (requestor_id);
