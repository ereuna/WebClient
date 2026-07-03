-- Ereuna Transactional Database
-- 02_identity.sql — Identity & Access Management (schema: identity)

CREATE TABLE identity.users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    password_hash   TEXT,                          -- null if OAuth-only
    full_name       TEXT,
    avatar_url      TEXT,
    bio             TEXT,
    website         TEXT,
    location        TEXT,
    profile         JSONB NOT NULL DEFAULT '{}',   -- flexible profile fields
    settings        JSONB NOT NULL DEFAULT '{}',   -- user preferences
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_superuser    BOOLEAN NOT NULL DEFAULT false,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON identity.users (email);
CREATE INDEX ON identity.users (username);

-- ─────────────────────────────────────────────────────────
-- Organizations (equivalent to GitHub / HuggingFace orgs)
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL UNIQUE,
    display_name    TEXT NOT NULL,
    description     TEXT,
    avatar_url      TEXT,
    website         TEXT,
    plan            TEXT NOT NULL DEFAULT 'free',  -- free | pro | enterprise
    settings        JSONB NOT NULL DEFAULT '{}',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    owner_id        UUID NOT NULL REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identity.organization_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES identity.organizations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'member', -- owner | admin | member | read
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, user_id)
);

-- ─────────────────────────────────────────────────────────
-- Teams (ML Team, Research Team, Platform Team, …)
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES identity.organizations(id) ON DELETE CASCADE,
    slug            TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    description     TEXT,
    visibility      TEXT NOT NULL DEFAULT 'private', -- private | org | public
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, slug)
);

CREATE TABLE identity.team_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id         UUID NOT NULL REFERENCES identity.teams(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'member', -- maintainer | member
    added_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (team_id, user_id)
);

-- ─────────────────────────────────────────────────────────
-- Roles & Permissions (RBAC)
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,   -- admin | editor | viewer | …
    description     TEXT,
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identity.permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource        TEXT NOT NULL,          -- model | dataset | pipeline | …
    action          TEXT NOT NULL,          -- read | write | delete | deploy
    description     TEXT,
    UNIQUE (resource, action)
);

CREATE TABLE identity.role_permissions (
    role_id         UUID NOT NULL REFERENCES identity.roles(id) ON DELETE CASCADE,
    permission_id   UUID NOT NULL REFERENCES identity.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ─────────────────────────────────────────────────────────
-- API Keys
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    org_id          UUID REFERENCES identity.organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    key_hash        TEXT NOT NULL UNIQUE,   -- store hash, never plaintext
    prefix          CHAR(8) NOT NULL,       -- show "aeth_abc1…" to user
    scopes          TEXT[] NOT NULL DEFAULT '{}',
    expires_at      TIMESTAMPTZ,
    last_used_at    TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT api_keys_owner CHECK (user_id IS NOT NULL OR org_id IS NOT NULL)
);

-- ─────────────────────────────────────────────────────────
-- OAuth Accounts
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.oauth_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    provider        TEXT NOT NULL,          -- github | google | huggingface
    provider_user_id TEXT NOT NULL,
    access_token    TEXT,
    refresh_token   TEXT,
    token_expires_at TIMESTAMPTZ,
    raw_profile     JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (provider, provider_user_id)
);

-- ─────────────────────────────────────────────────────────
-- Sessions
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    ip_address      INET,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON identity.sessions (user_id);
CREATE INDEX ON identity.sessions (expires_at);

-- ─────────────────────────────────────────────────────────
-- Service Accounts (machine-to-machine)
-- ─────────────────────────────────────────────────────────

CREATE TABLE identity.service_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES identity.organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, slug)
);
