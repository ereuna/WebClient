-- Aether Transactional Database
-- 12_billing.sql — Billing Domain (schema: billing)
-- Tracks: GPU hours, inference usage, storage usage, training usage

CREATE TABLE billing.plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,   -- free | pro | team | enterprise
    display_name    TEXT NOT NULL,
    price_monthly   NUMERIC(10,2),
    price_yearly    NUMERIC(10,2),
    currency        CHAR(3) NOT NULL DEFAULT 'USD' REFERENCES core.currencies(code),
    features        JSONB NOT NULL DEFAULT '{}',
    limits          JSONB NOT NULL DEFAULT '{}', -- storage_gb, gpu_hours_mo, etc.
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Subscriptions
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id         UUID NOT NULL REFERENCES billing.plans(id),
    user_id         UUID REFERENCES identity.users(id),
    org_id          UUID REFERENCES identity.organizations(id),
    status          TEXT NOT NULL DEFAULT 'active', -- active | past_due | cancelled | trialing
    billing_cycle   TEXT NOT NULL DEFAULT 'monthly', -- monthly | yearly
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end   TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    cancelled_at    TIMESTAMPTZ,
    external_id     TEXT,                   -- Stripe subscription ID
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT subscription_owner CHECK (user_id IS NOT NULL OR org_id IS NOT NULL)
);

-- ─────────────────────────────────────────────────────────
-- Invoices
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id),
    invoice_number  TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'draft', -- draft | open | paid | void | uncollectible
    currency        CHAR(3) NOT NULL DEFAULT 'USD',
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_paid     NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_due      NUMERIC(12,2) NOT NULL DEFAULT 0,
    period_start    TIMESTAMPTZ NOT NULL,
    period_end      TIMESTAMPTZ NOT NULL,
    due_date        TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,
    external_id     TEXT,                   -- Stripe invoice ID
    pdf_url         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Payments
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES billing.invoices(id),
    amount          NUMERIC(12,2) NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'USD',
    status          TEXT NOT NULL,          -- succeeded | failed | refunded
    payment_method  TEXT,                   -- card | bank_transfer | credits
    external_id     TEXT,                   -- Stripe charge ID
    paid_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Usage Charges (metered billing line items)
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.usage_charges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID REFERENCES billing.invoices(id),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id),
    charge_type     TEXT NOT NULL,          -- gpu_training | inference | storage | bandwidth
    quantity        FLOAT NOT NULL,
    unit            TEXT NOT NULL,          -- gpu_hour | token | gb | request
    unit_price      NUMERIC(12,6) NOT NULL,
    total           NUMERIC(12,2) NOT NULL,
    period_start    TIMESTAMPTZ NOT NULL,
    period_end      TIMESTAMPTZ NOT NULL,
    resource_id     UUID,                   -- job_id, endpoint_id, etc.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Credits
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.credits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES identity.users(id),
    org_id          UUID REFERENCES identity.organizations(id),
    amount          NUMERIC(12,2) NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'USD',
    reason          TEXT,                   -- promo | refund | trial | support
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT credits_owner CHECK (user_id IS NOT NULL OR org_id IS NOT NULL)
);

-- ─────────────────────────────────────────────────────────
-- GPU Usage (detailed tracking for cost attribution)
-- ─────────────────────────────────────────────────────────

CREATE TABLE billing.gpu_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id),
    resource_type   TEXT NOT NULL,          -- training_job | inference_endpoint | space
    resource_id     UUID NOT NULL,
    gpu_type        TEXT NOT NULL,
    gpu_count       SMALLINT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    ended_at        TIMESTAMPTZ,
    gpu_hours       FLOAT,
    cost            NUMERIC(12,4),
    region_id       UUID REFERENCES core.regions(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON billing.gpu_usage (subscription_id, started_at DESC);
