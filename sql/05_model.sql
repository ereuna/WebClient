-- Aether Transactional Database
-- 05_model.sql — Model Domain (schema: model)
-- Represents: Llama, PINN, GNN, RL Agent, Forecast Model, …

CREATE TABLE model.models (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id         UUID NOT NULL UNIQUE REFERENCES repository.repositories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    model_class     TEXT,                   -- llm | vision | rl | pinn | gnn | forecast
    architecture    TEXT,                   -- transformer | cnn | gnn | …
    license         TEXT,
    language        TEXT[],
    task_categories TEXT[],
    download_count  BIGINT NOT NULL DEFAULT 0,
    like_count      BIGINT NOT NULL DEFAULT 0,
    is_gated        BOOLEAN NOT NULL DEFAULT false,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON model.models (model_class);

-- ─────────────────────────────────────────────────────────
-- Model Versions
-- Stores: checkpoint URI, runtime, framework, signature
-- ─────────────────────────────────────────────────────────

CREATE TABLE model.model_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id        UUID NOT NULL REFERENCES model.models(id) ON DELETE CASCADE,
    version         TEXT NOT NULL,
    commit_sha      TEXT,
    checkpoint_uri  TEXT,                   -- s3:// path to weights
    framework_id    UUID REFERENCES core.frameworks(id),
    runtime_id      UUID REFERENCES core.runtimes(id),
    signature       JSONB,                  -- input/output tensor specs
    param_count     BIGINT,
    size_bytes      BIGINT,
    quantization    TEXT,                   -- fp32 | fp16 | int8 | gguf
    is_latest       BOOLEAN NOT NULL DEFAULT false,
    published_at    TIMESTAMPTZ,
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (model_id, version)
);

-- ─────────────────────────────────────────────────────────
-- Model Cards (documentation)
-- ─────────────────────────────────────────────────────────

CREATE TABLE model.model_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id        UUID NOT NULL UNIQUE REFERENCES model.models(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,          -- Markdown
    language        CHAR(2) NOT NULL DEFAULT 'en',
    updated_by      UUID REFERENCES identity.users(id),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Model Tags
-- ─────────────────────────────────────────────────────────

CREATE TABLE model.model_tags (
    model_id        UUID NOT NULL REFERENCES model.models(id) ON DELETE CASCADE,
    tag_id          UUID NOT NULL REFERENCES core.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (model_id, tag_id)
);

-- ─────────────────────────────────────────────────────────
-- Model Dependencies (base models, tokenizers)
-- ─────────────────────────────────────────────────────────

CREATE TABLE model.model_dependencies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id        UUID NOT NULL REFERENCES model.models(id) ON DELETE CASCADE,
    depends_on_id   UUID NOT NULL REFERENCES model.models(id),
    dep_type        TEXT NOT NULL,          -- base | tokenizer | adapter
    version_constraint TEXT,               -- semver range
    UNIQUE (model_id, depends_on_id, dep_type)
);

-- ─────────────────────────────────────────────────────────
-- Model Evaluations & Benchmarks
-- ─────────────────────────────────────────────────────────

CREATE TABLE model.model_evaluations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID NOT NULL REFERENCES model.model_versions(id) ON DELETE CASCADE,
    dataset_id      UUID REFERENCES dataset.datasets(id),
    eval_type       TEXT NOT NULL,          -- benchmark | custom | human
    status          TEXT NOT NULL DEFAULT 'pending',
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    results         JSONB,
    evaluated_by    UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE model.model_benchmarks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id   UUID NOT NULL REFERENCES model.model_evaluations(id) ON DELETE CASCADE,
    benchmark_name  TEXT NOT NULL,          -- MMLU | HumanEval | MATH | …
    metric          TEXT NOT NULL,          -- accuracy | f1 | perplexity
    value           FLOAT NOT NULL,
    split           TEXT,
    details         JSONB
);
