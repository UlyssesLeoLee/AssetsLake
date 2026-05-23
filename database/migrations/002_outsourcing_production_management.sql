/*
```cypher
CREATE
  (f:File {name: "002_outsourcing_production_management.sql", type: "file", language: "sql"}),
  (m:Module {name: "outsourcing_production_management_schema", type: "module"}),
  (fn1:Function {name: "create_asset_version_on_insert", type: "function", language: "plpgsql", signature: "trigger()"}),
  (fn2:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (v1:Variable {name: "issue_type", type: "variable"}),
  (v2:Variable {name: "issue_status", type: "variable"}),
  (v3:Variable {name: "issue_priority", type: "variable"}),
  (v4:Variable {name: "workspaces", type: "variable"}),
  (v5:Variable {name: "issues", type: "variable"}),
  (v6:Variable {name: "issue_status_history", type: "variable"}),
  (v7:Variable {name: "reviews_and_revisions", type: "variable"}),
  (v8:Variable {name: "delivery_packages", type: "variable"}),
  (v9:Variable {name: "audit_logs", type: "variable"}),
  (v10:Variable {name: "ai_qa", type: "variable"}),
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
  (m)-[:USES]->(v9),
  (m)-[:USES]->(v10),
  (fn1)-[:USES]->(v5),
  (fn1)-[:CALLS]->(fn2);
```
*/

-- AssetsLake Outsourcing Production Management Schema
-- Version: 2.0.0

-- --- ENUM TYPES --------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE issue_type AS ENUM (
        'concept_art',
        'character_model',
        'environment_model',
        'texture',
        'rigging',
        'animation',
        'vfx',
        'ui_art',
        'shader',
        'technical_art',
        'delivery_check',
        'bug',
        'revision_request'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_status AS ENUM (
        'backlog',
        'brief_ready',
        'assigned',
        'in_progress',
        'submitted',
        'internal_review',
        'client_review',
        'revision_required',
        'approved',
        'delivered',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE production_role AS ENUM (
        'admin',
        'producer',
        'art_director',
        'lead_artist',
        'artist',
        'technical_artist',
        'reviewer',
        'vendor_manager',
        'client_viewer'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE review_scope AS ENUM ('internal', 'client');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE review_round_status AS ENUM ('open', 'changes_requested', 'approved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_package_status AS ENUM ('draft', 'submitted', 'accepted', 'rejected', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE ai_qa_status AS ENUM ('pending', 'passed', 'warning', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE qa_severity AS ENUM ('info', 'warning', 'error', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- --- WORKSPACES / CLIENTS / VENDORS -----------------------------------------

CREATE TABLE IF NOT EXISTS workspaces (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(256) NOT NULL,
    slug        VARCHAR(128) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

INSERT INTO workspaces (id, name, slug, description)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Workspace',
    'default',
    'Default production workspace'
) ON CONFLICT DO NOTHING;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE RESTRICT
        DEFAULT '00000000-0000-0000-0000-000000000001';

CREATE TABLE IF NOT EXISTS clients (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name         VARCHAR(256) NOT NULL,
    code         VARCHAR(64) NOT NULL,
    contact_name VARCHAR(256),
    contact_email VARCHAR(256),
    status       VARCHAR(64) NOT NULL DEFAULT 'active',
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    UNIQUE(workspace_id, code)
);

CREATE TABLE IF NOT EXISTS vendors (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name         VARCHAR(256) NOT NULL,
    code         VARCHAR(64) NOT NULL,
    contact_name VARCHAR(256),
    contact_email VARCHAR(256),
    status       VARCHAR(64) NOT NULL DEFAULT 'active',
    rating       NUMERIC(3,2),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    UNIQUE(workspace_id, code)
);

INSERT INTO clients (id, workspace_id, name, code, contact_name, contact_email, notes)
VALUES (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Default Client',
    'CLIENT',
    'Client Reviewer',
    'client@example.com',
    'Seed client for client review workflows'
) ON CONFLICT DO NOTHING;

INSERT INTO vendors (id, workspace_id, name, code, contact_name, contact_email, notes)
VALUES (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'Default Vendor',
    'VENDOR',
    'Vendor Producer',
    'vendor@example.com',
    'Seed vendor for outsourced production workflows'
) ON CONFLICT DO NOTHING;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- --- BRIEFS / MILESTONES ----------------------------------------------------

CREATE TABLE IF NOT EXISTS briefs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_id           UUID REFERENCES clients(id) ON DELETE SET NULL,
    title               VARCHAR(512) NOT NULL,
    summary             TEXT,
    content             TEXT,
    reference_urls      TEXT[] NOT NULL DEFAULT '{}',
    acceptance_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS milestones (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(256) NOT NULL,
    description  TEXT,
    due_date     DATE,
    status       VARCHAR(64) NOT NULL DEFAULT 'planned',
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

INSERT INTO milestones (id, workspace_id, project_id, name, description, due_date, status, sort_order)
VALUES
(
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Brief Lock',
    'Final art requirements and acceptance criteria locked',
    CURRENT_DATE + 7,
    'planned',
    10
),
(
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'First Delivery',
    'Initial vendor delivery for internal review',
    CURRENT_DATE + 21,
    'planned',
    20
) ON CONFLICT DO NOTHING;

-- --- ISSUES -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS issues (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_key      VARCHAR(64) NOT NULL UNIQUE,
    workspace_id   UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    brief_id       UUID REFERENCES briefs(id) ON DELETE SET NULL,
    milestone_id   UUID REFERENCES milestones(id) ON DELETE SET NULL,
    vendor_id      UUID REFERENCES vendors(id) ON DELETE SET NULL,
    client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
    title          VARCHAR(512) NOT NULL,
    description    TEXT,
    issue_type     issue_type NOT NULL,
    asset_type     asset_type,
    status         issue_status NOT NULL DEFAULT 'backlog',
    priority       issue_priority NOT NULL DEFAULT 'medium',
    assignee_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    start_date     DATE,
    due_date       DATE,
    revision_count INT NOT NULL DEFAULT 0 CHECK (revision_count >= 0),
    qa_status      ai_qa_status NOT NULL DEFAULT 'pending',
    metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_issues_project ON issues(project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_vendor ON issues(vendor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_client ON issues(client_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_asset_type ON issues(asset_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_due_date ON issues(due_date) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS issue_comments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    author_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(256) NOT NULL DEFAULT 'anonymous',
    body        TEXT NOT NULL,
    visibility  VARCHAR(32) NOT NULL DEFAULT 'internal',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_status_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    from_status issue_status,
    to_status   issue_status NOT NULL,
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    actor       VARCHAR(256) NOT NULL DEFAULT 'system',
    reason      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_assignments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    role        production_role NOT NULL DEFAULT 'artist',
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_assets (
    issue_id   UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    asset_id   UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    link_type  VARCHAR(64) NOT NULL DEFAULT 'submission',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(issue_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_issue_assets_asset ON issue_assets(asset_id);

-- --- REVIEWS / REVISIONS / APPROVAL -----------------------------------------

CREATE TABLE IF NOT EXISTS review_rounds (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id     UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    scope        review_scope NOT NULL,
    round_number INT NOT NULL,
    status       review_round_status NOT NULL DEFAULT 'open',
    reviewer_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(256) NOT NULL DEFAULT 'reviewer',
    summary      TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(issue_id, scope, round_number)
);

CREATE TABLE IF NOT EXISTS review_comments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_round_id  UUID NOT NULL REFERENCES review_rounds(id) ON DELETE CASCADE,
    issue_id         UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    asset_id         UUID REFERENCES assets(id) ON DELETE SET NULL,
    asset_version_id UUID REFERENCES asset_versions(id) ON DELETE SET NULL,
    author_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name      VARCHAR(256) NOT NULL DEFAULT 'reviewer',
    body             TEXT NOT NULL,
    annotation       JSONB NOT NULL DEFAULT '{}'::jsonb,
    severity         qa_severity NOT NULL DEFAULT 'info',
    resolved         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revision_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id        UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    review_round_id UUID REFERENCES review_rounds(id) ON DELETE SET NULL,
    requested_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    requester_name  VARCHAR(256) NOT NULL DEFAULT 'reviewer',
    reason          TEXT NOT NULL,
    round_number    INT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_records (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id         UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    asset_id         UUID REFERENCES assets(id) ON DELETE SET NULL,
    asset_version_id UUID REFERENCES asset_versions(id) ON DELETE SET NULL,
    approved_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    approver_name    VARCHAR(256) NOT NULL DEFAULT 'approver',
    approval_scope   review_scope NOT NULL DEFAULT 'internal',
    note             TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --- DELIVERY PACKAGES ------------------------------------------------------

CREATE TABLE IF NOT EXISTS delivery_packages (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    vendor_id    UUID REFERENCES vendors(id) ON DELETE SET NULL,
    client_id    UUID REFERENCES clients(id) ON DELETE SET NULL,
    name         VARCHAR(512) NOT NULL,
    status       delivery_package_status NOT NULL DEFAULT 'draft',
    notes        TEXT,
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ,
    approved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS delivery_package_assets (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id       UUID NOT NULL REFERENCES delivery_packages(id) ON DELETE CASCADE,
    asset_id         UUID NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    asset_version_id UUID REFERENCES asset_versions(id) ON DELETE SET NULL,
    issue_id         UUID REFERENCES issues(id) ON DELETE SET NULL,
    included_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(package_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_delivery_package_assets_package ON delivery_package_assets(package_id);
CREATE INDEX IF NOT EXISTS idx_delivery_package_assets_asset ON delivery_package_assets(asset_id);

-- --- AI QA / AUDIT -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_qa_reports (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id    UUID REFERENCES issues(id) ON DELETE CASCADE,
    asset_id    UUID REFERENCES assets(id) ON DELETE CASCADE,
    package_id  UUID REFERENCES delivery_packages(id) ON DELETE CASCADE,
    status      ai_qa_status NOT NULL DEFAULT 'pending',
    summary     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_qa_findings (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id   UUID NOT NULL REFERENCES ai_qa_reports(id) ON DELETE CASCADE,
    rule_code   VARCHAR(128) NOT NULL,
    severity    qa_severity NOT NULL,
    message     TEXT NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id   UUID NOT NULL,
    action      VARCHAR(64) NOT NULL,
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    actor       VARCHAR(256),
    diff        JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Keep the original singular audit table available, but new production code writes audit_logs.

-- --- ASSET VERSION GUARANTEE ------------------------------------------------

CREATE OR REPLACE FUNCTION create_asset_version_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO asset_versions (
        asset_id,
        version,
        bucket,
        object_key,
        file_url,
        file_size,
        checksum_sha256,
        uploader_id,
        uploader,
        change_note
    )
    VALUES (
        NEW.id,
        NEW.version,
        NEW.bucket,
        NEW.object_key,
        NEW.file_url,
        NEW.file_size,
        NEW.checksum_sha256,
        NEW.uploader_id,
        NEW.uploader,
        'Initial submission'
    )
    ON CONFLICT (asset_id, version) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_asset_version_on_insert ON assets;
CREATE TRIGGER trg_asset_version_on_insert
    AFTER INSERT ON assets
    FOR EACH ROW EXECUTE FUNCTION create_asset_version_on_insert();

INSERT INTO asset_versions (
    asset_id,
    version,
    bucket,
    object_key,
    file_url,
    file_size,
    checksum_sha256,
    uploader_id,
    uploader,
    change_note
)
SELECT
    a.id,
    a.version,
    a.bucket,
    a.object_key,
    a.file_url,
    a.file_size,
    a.checksum_sha256,
    a.uploader_id,
    a.uploader,
    'Backfilled initial submission'
FROM assets a
WHERE NOT EXISTS (
    SELECT 1 FROM asset_versions av
    WHERE av.asset_id = a.id AND av.version = a.version
);

-- --- UPDATED_AT TRIGGERS ----------------------------------------------------

DROP TRIGGER IF EXISTS trg_workspaces_updated_at ON workspaces;
CREATE TRIGGER trg_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_clients_updated_at ON clients;
CREATE TRIGGER trg_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_vendors_updated_at ON vendors;
CREATE TRIGGER trg_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_briefs_updated_at ON briefs;
CREATE TRIGGER trg_briefs_updated_at
    BEFORE UPDATE ON briefs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_milestones_updated_at ON milestones;
CREATE TRIGGER trg_milestones_updated_at
    BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_issues_updated_at ON issues;
CREATE TRIGGER trg_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_delivery_packages_updated_at ON delivery_packages;
CREATE TRIGGER trg_delivery_packages_updated_at
    BEFORE UPDATE ON delivery_packages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
