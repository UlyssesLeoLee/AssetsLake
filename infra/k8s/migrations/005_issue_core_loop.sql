/*
```cypher
CREATE
  (f:File {name: "005_issue_core_loop.sql", type: "file", language: "sql"}),
  (m:Module {name: "issue_core_loop_schema", type: "module"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (v1:Variable {name: "issue_work_logs", type: "variable"}),
  (v2:Variable {name: "issues.epic_id", type: "variable"}),
  (v3:Variable {name: "issues.sprint_id", type: "variable"}),
  (v4:Variable {name: "issues.story_points", type: "variable"}),
  (v5:Variable {name: "issues.rank_key", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5);
```
*/

-- AssetsLake Issue Core Loop Schema
-- Completes the Jira-style issue lifecycle with work logs and planning-field indexes.

ALTER TABLE issues ADD COLUMN IF NOT EXISTS epic_id UUID REFERENCES epics(id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS story_points NUMERIC(8,2);
ALTER TABLE issues ADD COLUMN IF NOT EXISTS rank_key VARCHAR(64) NOT NULL DEFAULT '000000';

CREATE INDEX IF NOT EXISTS idx_issues_epic ON issues(epic_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_sprint ON issues(sprint_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issues_project_rank ON issues(project_id, rank_key) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS issue_work_logs (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id           UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    author_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name        VARCHAR(256) NOT NULL DEFAULT 'artist',
    time_spent_minutes INT NOT NULL CHECK (time_spent_minutes > 0),
    started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    body               TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issue_work_logs_issue
    ON issue_work_logs(issue_id, started_at DESC);

DROP TRIGGER IF EXISTS trg_issue_work_logs_updated_at ON issue_work_logs;
CREATE TRIGGER trg_issue_work_logs_updated_at
    BEFORE UPDATE ON issue_work_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
