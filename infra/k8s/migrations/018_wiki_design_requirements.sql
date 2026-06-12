/*
```cypher
CREATE
  (f:File {name: "018_wiki_design_requirements.sql", type: "file", language: "sql"}),
  (m:Module {name: "infra.k8s.migrations.wiki_design_requirements", type: "module"}),
  (c1:Class {name: "wiki_spaces", type: "class", language: "sql", signature: "CREATE TABLE wiki_spaces"}),
  (c2:Class {name: "wiki_pages", type: "class", language: "sql", signature: "CREATE TABLE wiki_pages"}),
  (c3:Class {name: "wiki_page_updates", type: "class", language: "sql", signature: "CREATE TABLE wiki_page_updates"}),
  (c4:Class {name: "wiki_presence", type: "class", language: "sql", signature: "CREATE TABLE wiki_presence"}),
  (c5:Class {name: "design_requirements", type: "class", language: "sql", signature: "CREATE TABLE design_requirements"}),
  (c6:Class {name: "design_requirement_assets", type: "class", language: "sql", signature: "CREATE TABLE design_requirement_assets"}),
  (c7:Class {name: "design_requirement_comments", type: "class", language: "sql", signature: "CREATE TABLE design_requirement_comments"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7);
```
*/

CREATE TABLE IF NOT EXISTS wiki_spaces (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_by UUID,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (workspace_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_wiki_spaces_workspace
    ON wiki_spaces(workspace_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS wiki_pages (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    space_id UUID NOT NULL REFERENCES wiki_spaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES wiki_pages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_markdown TEXT NOT NULL DEFAULT '',
    version BIGINT NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_by UUID,
    created_by_name TEXT NOT NULL,
    updated_by UUID,
    updated_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (space_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_wiki_pages_space
    ON wiki_pages(space_id, updated_at DESC)
    WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS wiki_page_updates (
    id UUID PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES wiki_pages(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL,
    base_version BIGINT NOT NULL,
    version BIGINT NOT NULL,
    patch JSONB NOT NULL,
    content_markdown TEXT NOT NULL,
    created_by UUID,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (page_id, version)
);

CREATE INDEX IF NOT EXISTS idx_wiki_page_updates_sync
    ON wiki_page_updates(page_id, version);

CREATE TABLE IF NOT EXISTS wiki_presence (
    page_id UUID NOT NULL REFERENCES wiki_pages(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL,
    user_id UUID,
    display_name TEXT NOT NULL,
    cursor_anchor INTEGER,
    cursor_head INTEGER,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (page_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_wiki_presence_active
    ON wiki_presence(page_id, last_seen_at DESC);

CREATE TABLE IF NOT EXISTS design_requirements (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    project_id UUID,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'review', 'approved', 'rejected', 'archived')),
    priority VARCHAR(32) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    acceptance_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    owner_id UUID,
    owner_name TEXT NOT NULL,
    reviewer_id UUID,
    reviewer_name TEXT,
    due_date DATE,
    version BIGINT NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_design_requirements_workspace
    ON design_requirements(workspace_id, status, updated_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_design_requirements_project
    ON design_requirements(project_id, updated_at DESC)
    WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS design_requirement_assets (
    requirement_id UUID NOT NULL REFERENCES design_requirements(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL,
    asset_name TEXT NOT NULL,
    asset_type TEXT,
    preview_url TEXT,
    asset_version INTEGER,
    verified BOOLEAN NOT NULL DEFAULT false,
    relation_type VARCHAR(32) NOT NULL DEFAULT 'reference'
        CHECK (relation_type IN ('reference', 'source', 'target', 'deliverable')),
    note TEXT,
    attached_by UUID,
    attached_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (requirement_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_design_requirement_assets_asset
    ON design_requirement_assets(asset_id, created_at DESC);

CREATE TABLE IF NOT EXISTS design_requirement_comments (
    id UUID PRIMARY KEY,
    requirement_id UUID NOT NULL REFERENCES design_requirements(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author_id UUID,
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_design_requirement_comments_requirement
    ON design_requirement_comments(requirement_id, created_at ASC);

DROP TRIGGER IF EXISTS trg_wiki_spaces_updated_at ON wiki_spaces;
CREATE TRIGGER trg_wiki_spaces_updated_at
    BEFORE UPDATE ON wiki_spaces
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_wiki_pages_updated_at ON wiki_pages;
CREATE TRIGGER trg_wiki_pages_updated_at
    BEFORE UPDATE ON wiki_pages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_design_requirements_updated_at ON design_requirements;
CREATE TRIGGER trg_design_requirements_updated_at
    BEFORE UPDATE ON design_requirements
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_design_requirement_comments_updated_at ON design_requirement_comments;
CREATE TRIGGER trg_design_requirement_comments_updated_at
    BEFORE UPDATE ON design_requirement_comments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
