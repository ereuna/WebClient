-- Ereuna Transactional Database
-- 10_explainability.sql — Explainability Domain (schema: explainability)
-- Supports: SHAP, GNNExplainer, PINN residuals, RL policy explanations

CREATE TABLE explainability.explanations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID NOT NULL REFERENCES model.model_versions(id),
    inference_request_id UUID REFERENCES inference.inference_requests(id),
    method          TEXT NOT NULL,          -- shap | lime | integrated_gradients | gnn_explainer | pinn_residual | rl_policy
    explanation_type TEXT NOT NULL,         -- local | global
    status          TEXT NOT NULL DEFAULT 'pending',
    input_ref       JSONB,                  -- reference to the explained input
    summary         JSONB,                  -- high-level explanation summary
    created_by      UUID REFERENCES identity.users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at     TIMESTAMPTZ
);

CREATE INDEX ON explainability.explanations (model_version_id);
CREATE INDEX ON explainability.explanations (method);

-- ─────────────────────────────────────────────────────────
-- Explanation Artifacts (files: plots, JSON dumps)
-- ─────────────────────────────────────────────────────────

CREATE TABLE explainability.explanation_artifacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    explanation_id  UUID NOT NULL REFERENCES explainability.explanations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    artifact_type   TEXT NOT NULL,          -- shap_values | plot | html | json
    storage_uri     TEXT NOT NULL,
    size_bytes      BIGINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Feature Importance (SHAP global, permutation, etc.)
-- ─────────────────────────────────────────────────────────

CREATE TABLE explainability.feature_importance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    explanation_id  UUID NOT NULL REFERENCES explainability.explanations(id) ON DELETE CASCADE,
    feature_name    TEXT NOT NULL,
    importance      FLOAT NOT NULL,
    std_dev         FLOAT,
    rank            SMALLINT,
    direction       TEXT,                   -- positive | negative | neutral
    UNIQUE (explanation_id, feature_name)
);

-- ─────────────────────────────────────────────────────────
-- Attention Maps (Transformers)
-- ─────────────────────────────────────────────────────────

CREATE TABLE explainability.attention_maps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    explanation_id  UUID NOT NULL REFERENCES explainability.explanations(id) ON DELETE CASCADE,
    layer_name      TEXT NOT NULL,
    head_index      SMALLINT,
    map_uri         TEXT,                   -- storage URI for the matrix
    token_labels    TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────
-- Residual Maps (PINN-specific: physics residuals on domain)
-- ─────────────────────────────────────────────────────────

CREATE TABLE explainability.residual_maps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    explanation_id  UUID NOT NULL REFERENCES explainability.explanations(id) ON DELETE CASCADE,
    equation_name   TEXT NOT NULL,          -- e.g. navier_stokes_momentum_x
    max_residual    FLOAT,
    mean_residual   FLOAT,
    map_uri         TEXT,                   -- storage URI for spatial residual field
    domain_metadata JSONB,                  -- grid info, spatial bounds
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
