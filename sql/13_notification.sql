-- Ereuna Transactional Database
-- 13_notification.sql — Notification Domain (schema: notification)
-- Supports: training completed, dataset uploaded, pipeline failed

CREATE TABLE notification.notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,          -- training_completed | pipeline_failed | dataset_uploaded | mention | pr_review
    title           TEXT NOT NULL,
    body            TEXT,
    entity_type     TEXT,                   -- model | dataset | pipeline | training_job
    entity_id       UUID,
    action_url      TEXT,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON notification.notifications (user_id, is_read, created_at DESC);
CREATE INDEX ON notification.notifications (user_id, created_at DESC);

-- ─────────────────────────────────────────────────────────
-- Notification Preferences
-- ─────────────────────────────────────────────────────────

CREATE TABLE notification.notification_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES identity.users(id) ON DELETE CASCADE,
    email_enabled   BOOLEAN NOT NULL DEFAULT true,
    push_enabled    BOOLEAN NOT NULL DEFAULT true,
    digest_enabled  BOOLEAN NOT NULL DEFAULT false,
    digest_frequency TEXT NOT NULL DEFAULT 'daily', -- immediate | daily | weekly
    -- per-type toggles stored as JSONB for flexibility
    type_preferences JSONB NOT NULL DEFAULT '{}',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Email Events (transactional email audit trail)
-- ─────────────────────────────────────────────────────────

CREATE TABLE notification.email_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES identity.users(id),
    to_address      TEXT NOT NULL,
    template        TEXT NOT NULL,          -- welcome | training_done | invoice | alert
    subject         TEXT NOT NULL,
    notification_id UUID REFERENCES notification.notifications(id),
    status          TEXT NOT NULL DEFAULT 'queued', -- queued | sent | delivered | bounced | failed
    provider_id     TEXT,                   -- SES / SendGrid message ID
    sent_at         TIMESTAMPTZ,
    opened_at       TIMESTAMPTZ,
    clicked_at      TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON notification.email_events (user_id, created_at DESC);
CREATE INDEX ON notification.email_events (status, created_at);
