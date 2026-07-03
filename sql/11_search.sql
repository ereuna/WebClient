-- Ereuna Transactional Database
-- 11_search.sql — Search Domain (schema: search)
-- Postgres stores metadata only.
-- Actual search lives in: OpenSearch / Qdrant

CREATE TABLE search.search_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT NOT NULL,          -- model | dataset | pipeline | space | user | org
    entity_id       UUID NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    tags            TEXT[],
    owner           TEXT,
    visibility      TEXT NOT NULL DEFAULT 'public',
    indexed_at      TIMESTAMPTZ,
    opensearch_id   TEXT,                   -- document ID in OpenSearch index
    qdrant_point_id TEXT,                   -- point ID in Qdrant collection
    checksum        TEXT,                   -- hash to detect stale docs
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (entity_type, entity_id)
);

CREATE INDEX ON search.search_documents (entity_type);
CREATE INDEX ON search.search_documents (indexed_at);

-- ─────────────────────────────────────────────────────────
-- Embedding Jobs (async indexing queue)
-- ─────────────────────────────────────────────────────────

CREATE TABLE search.embedding_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID NOT NULL REFERENCES search.search_documents(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | running | done | failed
    model_name      TEXT NOT NULL DEFAULT 'text-embedding-3-small',
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON search.embedding_jobs (status, created_at);

-- ─────────────────────────────────────────────────────────
-- Embedding Metadata (track what was embedded)
-- ─────────────────────────────────────────────────────────

CREATE TABLE search.embedding_metadata (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID NOT NULL REFERENCES search.search_documents(id) ON DELETE CASCADE,
    model_name      TEXT NOT NULL,
    dimensions      SMALLINT NOT NULL,
    collection      TEXT NOT NULL,          -- Qdrant collection name
    point_id        TEXT NOT NULL,
    embedded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (document_id, model_name)
);
