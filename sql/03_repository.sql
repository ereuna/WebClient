-- Ereuna Transactional Database
-- 03_repository.sql — Repository Domain (schema: repository)
-- Everything in Ereuna IS a repository.

CREATE TYPE repository.repo_type AS ENUM (
    'MODEL', 'DATASET', 'PIPELINE', 'SPACE', 'AGENT', 'WORKFLOW'
);

CREATE TYPE repository.visibility AS ENUM (
    'public', 'private', 'internal'
);

-- ─────────────────────────────────────────────────────────
-- Repositories
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repositories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL,
    owner_user_id   UUID REFERENCES identity.users(id),
    owner_org_id    UUID REFERENCES identity.organizations(id),
    repo_type       repository.repo_type NOT NULL,
    visibility      repository.visibility NOT NULL DEFAULT 'private',
    description     TEXT,
    website         TEXT,
    default_branch  TEXT NOT NULL DEFAULT 'main',
    is_archived     BOOLEAN NOT NULL DEFAULT false,
    is_disabled     BOOLEAN NOT NULL DEFAULT false,
    fork_of         UUID REFERENCES repository.repositories(id),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT repo_owner CHECK (owner_user_id IS NOT NULL OR owner_org_id IS NOT NULL),
    UNIQUE (owner_user_id, slug),
    UNIQUE (owner_org_id, slug)
);

CREATE INDEX ON repository.repositories (repo_type);
CREATE INDEX ON repository.repositories (visibility);
CREATE INDEX ON repository.repositories USING gin(slug gin_trgm_ops);

-- ─────────────────────────────────────────────────────────
-- Repository Members (collaborators)
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    team_id         UUID REFERENCES identity.teams(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'read', -- admin | write | read
    added_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT member_target CHECK (user_id IS NOT NULL OR team_id IS NOT NULL)
);

-- ─────────────────────────────────────────────────────────
-- Branches
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_branches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    commit_sha      TEXT NOT NULL,
    is_protected    BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_id, name)
);

-- ─────────────────────────────────────────────────────────
-- Commits
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_commits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    sha             TEXT NOT NULL,
    parent_sha      TEXT,
    branch          TEXT,
    message         TEXT NOT NULL,
    author_user_id  UUID REFERENCES identity.users(id),
    author_name     TEXT,
    author_email    TEXT,
    committed_at    TIMESTAMPTZ NOT NULL,
    metadata        JSONB NOT NULL DEFAULT '{}',
    UNIQUE (repo_id, sha)
);

CREATE INDEX ON repository.repository_commits (repo_id, committed_at DESC);

-- ─────────────────────────────────────────────────────────
-- Tags & Releases
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    commit_sha      TEXT NOT NULL,
    tagger_id       UUID REFERENCES identity.users(id),
    message         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_id, name)
);

CREATE TABLE repository.repository_releases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    tag_name        TEXT NOT NULL,
    name            TEXT,
    body            TEXT,
    is_draft        BOOLEAN NOT NULL DEFAULT false,
    is_prerelease   BOOLEAN NOT NULL DEFAULT false,
    published_by    UUID REFERENCES identity.users(id),
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_id, tag_name)
);

-- ─────────────────────────────────────────────────────────
-- Files (LFS-style pointers)
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    commit_sha      TEXT NOT NULL,
    path            TEXT NOT NULL,          -- relative path in repo
    size_bytes      BIGINT,
    content_hash    TEXT,                   -- sha256 of content
    storage_uri     TEXT,                   -- s3:// or gcs:// pointer
    mime_type       TEXT,
    is_lfs          BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_id, commit_sha, path)
);

-- ─────────────────────────────────────────────────────────
-- Artifacts (build outputs, packaged releases)
-- ─────────────────────────────────────────────────────────

CREATE TABLE repository.repository_artifacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL REFERENCES repository.repositories(id) ON DELETE CASCADE,
    release_id      UUID REFERENCES repository.repository_releases(id),
    name            TEXT NOT NULL,
    artifact_type   TEXT NOT NULL,          -- wheel | docker | onnx | safetensors
    size_bytes      BIGINT,
    storage_uri     TEXT NOT NULL,
    content_hash    TEXT,
    download_count  BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
