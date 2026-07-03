-- Ereuna Transactional Database
-- 01_core.sql — Shared reference tables (schema: core)

CREATE TABLE core.tags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    color       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    parent_id   UUID REFERENCES core.categories(id),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.frameworks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,   -- e.g. PyTorch, TensorFlow, JAX
    slug        TEXT NOT NULL UNIQUE,
    version     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.runtimes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,   -- e.g. python3.11, cuda12.1
    slug        TEXT NOT NULL UNIQUE,
    runtime_type TEXT NOT NULL,         -- language | cuda | onnx | triton
    version     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.regions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL UNIQUE,   -- us-east-1, eu-west-1
    name        TEXT NOT NULL,
    provider    TEXT NOT NULL,          -- aws | gcp | azure
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.currencies (
    code        CHAR(3) PRIMARY KEY,    -- ISO 4217: USD, EUR
    name        TEXT NOT NULL,
    symbol      TEXT NOT NULL,
    decimal_places SMALLINT NOT NULL DEFAULT 2
);

INSERT INTO core.currencies (code, name, symbol) VALUES
    ('USD', 'US Dollar', '$'),
    ('EUR', 'Euro', '€'),
    ('GBP', 'British Pound', '£');
