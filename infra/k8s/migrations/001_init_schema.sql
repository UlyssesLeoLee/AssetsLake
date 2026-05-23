/*
```cypher
CREATE
  (f:File {name: "001_init_schema.sql", type: "file", language: "sql"}),
  (m:Module {name: "assetslake_core_schema", type: "module"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()"}),
  (v1:Variable {name: "asset_status", type: "variable"}),
  (v2:Variable {name: "asset_type", type: "variable"}),
  (v3:Variable {name: "users", type: "variable"}),
  (v4:Variable {name: "projects", type: "variable"}),
  (v5:Variable {name: "assets", type: "variable"}),
  (v6:Variable {name: "asset_versions", type: "variable"}),
  (v7:Variable {name: "tags", type: "variable"}),
  (v8:Variable {name: "audit_log", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5);
```
*/

-- AssetsLake PostgreSQL Schema
-- Version: 1.0.0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for future full-text/trigram search

-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────

CREATE TYPE asset_status AS ENUM (
    'pending',      -- uploaded, awaiting review
    'active',       -- approved and visible
    'archived',     -- soft-archived, not deleted
    'rejected',     -- failed review
    'processing'    -- AI pipeline / thumbnail generation in progress
);

CREATE TYPE asset_type AS ENUM (
    '3d_model',
    'texture',
    'concept_art',
    'audio',
    'video',
    'document',
    'animation',
    'vfx',
    'ui',
    'font',
    'shader',
    'scene',
    'prefab',
    'archive',
    'other'
);

-- ─── USERS (simplified, no auth system yet) ──────────────────────────────────

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    VARCHAR(128) NOT NULL UNIQUE,
    display_name VARCHAR(256),
    email       VARCHAR(256) UNIQUE,
    role        VARCHAR(64) NOT NULL DEFAULT 'artist',
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;

INSERT INTO users (id, username, display_name, email, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'system',
    'System',
    'system@assetslake.internal',
    'admin'
) ON CONFLICT DO NOTHING;

-- ─── PROJECTS ────────────────────────────────────────────────────────────────

CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(256) NOT NULL,
    code        VARCHAR(64) NOT NULL UNIQUE,  -- short identifier e.g. "PROJ-001"
    description TEXT,
    owner_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    status      VARCHAR(64) NOT NULL DEFAULT 'active',
    color       VARCHAR(16) DEFAULT '#6366f1',  -- UI accent color
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_projects_code ON projects(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;

INSERT INTO projects (id, name, code, description)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Project',
    'DEFAULT',
    'Default project for ungrouped assets'
) ON CONFLICT DO NOTHING;

-- ─── ASSETS (core table) ─────────────────────────────────────────────────────

CREATE TABLE assets (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identity
    name              VARCHAR(512) NOT NULL,
    original_filename VARCHAR(512) NOT NULL,
    description       TEXT,

    -- Classification
    asset_type        asset_type NOT NULL DEFAULT 'other',
    mime_type         VARCHAR(256) NOT NULL,
    tags              TEXT[] NOT NULL DEFAULT '{}',

    -- Storage (MinIO references — never store binary here)
    bucket            VARCHAR(256) NOT NULL,
    object_key        TEXT NOT NULL UNIQUE,
    file_url          TEXT NOT NULL,
    preview_url       TEXT,

    -- File metadata
    file_size         BIGINT NOT NULL CHECK (file_size >= 0),
    checksum_sha256   VARCHAR(64),

    -- Versioning
    version           INT NOT NULL DEFAULT 1,
    parent_id         UUID REFERENCES assets(id) ON DELETE SET NULL,

    -- Relations
    project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    uploader_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    uploader          VARCHAR(256) NOT NULL DEFAULT 'anonymous',

    -- Lifecycle
    status            asset_status NOT NULL DEFAULT 'pending',
    reviewed_by       UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at       TIMESTAMPTZ,
    review_note       TEXT,

    -- AI / search extensions (reserved, nullable)
    ai_tags           TEXT[] DEFAULT '{}',
    embedding_id      TEXT,      -- future: Qdrant point ID
    search_doc_id     TEXT,      -- future: OpenSearch document ID
    graph_node_id     TEXT,      -- future: Neo4j node ID

    -- Timestamps
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_assets_project_id    ON assets(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_status        ON assets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_asset_type    ON assets(asset_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_uploader_id   ON assets(uploader_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_tags          ON assets USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_ai_tags       ON assets USING GIN(ai_tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_created_at    ON assets(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_name_trgm     ON assets USING GIN(name gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_filename_trgm ON assets USING GIN(original_filename gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_parent_id     ON assets(parent_id) WHERE deleted_at IS NULL;

-- ─── ASSET VERSIONS ──────────────────────────────────────────────────────────

CREATE TABLE asset_versions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    version         INT NOT NULL,

    -- Storage snapshot
    bucket          VARCHAR(256) NOT NULL,
    object_key      TEXT NOT NULL,
    file_url        TEXT NOT NULL,
    file_size       BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64),

    -- Who changed it
    uploader_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    uploader        VARCHAR(256) NOT NULL DEFAULT 'anonymous',
    change_note     TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(asset_id, version)
);

CREATE INDEX idx_asset_versions_asset_id ON asset_versions(asset_id);

-- ─── ASSET TAGS (normalized, for future tag management) ──────────────────────

CREATE TABLE tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(128) NOT NULL UNIQUE,
    color       VARCHAR(16) DEFAULT '#64748b',
    description TEXT,
    usage_count BIGINT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- ─── AUDIT LOG (future-proof, append-only) ───────────────────────────────────

CREATE TABLE audit_log (
    id          BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id   UUID NOT NULL,
    action      VARCHAR(64) NOT NULL,  -- created, updated, deleted, reviewed, downloaded
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    actor       VARCHAR(256),
    diff        JSONB,
    ip_address  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ─── TRIGGERS ────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
