/*
```cypher
CREATE
  (f:File {name: "003_project_management_planning.sql", type: "file", language: "sql"}),
  (m:Module {name: "project_management_planning_schema", type: "module"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (v1:Variable {name: "sprint_status", type: "variable"}),
  (v2:Variable {name: "issue_dependency_type", type: "variable"}),
  (v3:Variable {name: "issue_event_type", type: "variable"}),
  (v4:Variable {name: "epics", type: "variable"}),
  (v5:Variable {name: "sprints", type: "variable"}),
  (v6:Variable {name: "issues.epic_id", type: "variable"}),
  (v7:Variable {name: "issues.sprint_id", type: "variable"}),
  (v8:Variable {name: "issues.story_points", type: "variable"}),
  (v9:Variable {name: "issues.rank_key", type: "variable"}),
  (v10:Variable {name: "issue_dependencies", type: "variable"}),
  (v11:Variable {name: "issue_events", type: "variable"}),
  (v12:Variable {name: "saved_issue_filters", type: "variable"}),
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
  (m)-[:USES]->(v11),
  (m)-[:USES]->(v12);
```
*/

-- AssetsLake Project Management Planning Schema
-- Phase 1: Epic, sprint, dependency, event, ranking, and saved-filter contracts.

DO $$ BEGIN
    CREATE TYPE sprint_status AS ENUM ('planned', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_dependency_type AS ENUM (
        'blocks',
        'is_blocked_by',
        'relates_to',
        'duplicates',
        'parent_child'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_event_type AS ENUM (
        'created',
        'updated',
        'ranked',
        'assigned',
        'transitioned',
        'commented',
        'asset_linked',
        'dependency_linked',
        'sprint_changed',
        'ai_recommended'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS epics (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    epic_key     VARCHAR(64) NOT NULL,
    name         VARCHAR(256) NOT NULL,
    summary      TEXT,
    status       issue_status NOT NULL DEFAULT 'backlog',
    priority     issue_priority NOT NULL DEFAULT 'medium',
    owner_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    start_date   DATE,
    target_date  DATE,
    rank_key     VARCHAR(64) NOT NULL DEFAULT '000000',
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    UNIQUE(project_id, epic_key)
);

CREATE INDEX IF NOT EXISTS idx_epics_project ON epics(project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_epics_status ON epics(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_epics_rank ON epics(project_id, rank_key) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS sprints (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name             VARCHAR(256) NOT NULL,
    goal             TEXT,
    status           sprint_status NOT NULL DEFAULT 'planned',
    start_date       DATE,
    end_date         DATE,
    capacity_points  NUMERIC(8,2) NOT NULL DEFAULT 0,
    committed_points NUMERIC(8,2) NOT NULL DEFAULT 0,
    completed_points NUMERIC(8,2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ,
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sprints_project_name
    ON sprints(project_id, name)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sprints_project_status
    ON sprints(project_id, status)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sprints_dates
    ON sprints(project_id, start_date, end_date)
    WHERE deleted_at IS NULL;

ALTER TABLE issues ADD COLUMN IF NOT EXISTS epic_id UUID REFERENCES epics(id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS story_points NUMERIC(8,2);
ALTER TABLE issues ADD COLUMN IF NOT EXISTS rank_key VARCHAR(64) NOT NULL DEFAULT '000000';

CREATE INDEX IF NOT EXISTS idx_issues_epic ON issues(epic_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_sprint ON issues(sprint_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_project_rank ON issues(project_id, rank_key) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS issue_dependencies (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    target_issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    dependency_type issue_dependency_type NOT NULL,
    description     TEXT,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (source_issue_id <> target_issue_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_issue_dependencies_unique
    ON issue_dependencies(source_issue_id, target_issue_id, dependency_type);
CREATE INDEX IF NOT EXISTS idx_issue_dependencies_project
    ON issue_dependencies(project_id);
CREATE INDEX IF NOT EXISTS idx_issue_dependencies_source
    ON issue_dependencies(source_issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_dependencies_target
    ON issue_dependencies(target_issue_id);

CREATE TABLE IF NOT EXISTS issue_events (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    issue_id     UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    event_type   issue_event_type NOT NULL,
    actor_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name   VARCHAR(256) NOT NULL DEFAULT 'system',
    payload      JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issue_events_issue ON issue_events(issue_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issue_events_project ON issue_events(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issue_events_type ON issue_events(event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS saved_issue_filters (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    owner_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    name         VARCHAR(128) NOT NULL,
    query        JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_shared    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_saved_issue_filters_workspace
    ON saved_issue_filters(workspace_id)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_saved_issue_filters_owner
    ON saved_issue_filters(owner_id)
    WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS trg_epics_updated_at ON epics;
CREATE TRIGGER trg_epics_updated_at
    BEFORE UPDATE ON epics
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sprints_updated_at ON sprints;
CREATE TRIGGER trg_sprints_updated_at
    BEFORE UPDATE ON sprints
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_saved_issue_filters_updated_at ON saved_issue_filters;
CREATE TRIGGER trg_saved_issue_filters_updated_at
    BEFORE UPDATE ON saved_issue_filters
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
