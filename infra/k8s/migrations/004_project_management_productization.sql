/*
```cypher
CREATE
  (f:File {name: "004_project_management_productization.sql", type: "file", language: "sql"}),
  (m:Module {name: "project_management_productization_schema", type: "module"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (v1:Variable {name: "schedule_baselines", type: "variable"}),
  (v2:Variable {name: "calendar_events", type: "variable"}),
  (v3:Variable {name: "report_snapshots", type: "variable"}),
  (v4:Variable {name: "dashboard_widgets", type: "variable"}),
  (v5:Variable {name: "workflow_definitions", type: "variable"}),
  (v6:Variable {name: "workflow_transitions", type: "variable"}),
  (v7:Variable {name: "automation_rules", type: "variable"}),
  (v8:Variable {name: "automation_runs", type: "variable"}),
  (v9:Variable {name: "project_role_assignments", type: "variable"}),
  (v10:Variable {name: "notification_preferences", type: "variable"}),
  (v11:Variable {name: "import_export_jobs", type: "variable"}),
  (v12:Variable {name: "project_webhooks", type: "variable"}),
  (v13:Variable {name: "project_templates", type: "variable"}),
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
  (m)-[:USES]->(v12),
  (m)-[:USES]->(v13);
```
*/

-- AssetsLake Project Management Productization Schema
-- Phases 2-5: Gantt/calendar, reports, workflow/automation, and enterprise controls.

CREATE TABLE IF NOT EXISTS schedule_baselines (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(256) NOT NULL,
    description  TEXT,
    captured_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    snapshot     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_baselines_project
    ON schedule_baselines(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS calendar_events (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    issue_id     UUID REFERENCES issues(id) ON DELETE CASCADE,
    sprint_id    UUID REFERENCES sprints(id) ON DELETE CASCADE,
    title        VARCHAR(256) NOT NULL,
    event_type   VARCHAR(64) NOT NULL,
    starts_at    TIMESTAMPTZ NOT NULL,
    ends_at      TIMESTAMPTZ,
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_project_time
    ON calendar_events(project_id, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS report_snapshots (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_type  VARCHAR(64) NOT NULL,
    period_start DATE,
    period_end   DATE,
    metrics      JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_snapshots_project_type
    ON report_snapshots(project_id, report_type, generated_at DESC);

CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    owner_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    name         VARCHAR(128) NOT NULL,
    widget_type  VARCHAR(64) NOT NULL,
    config       JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_definitions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(128) NOT NULL,
    status       VARCHAR(64) NOT NULL DEFAULT 'active',
    config       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_transitions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id  UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    from_status  issue_status,
    to_status    issue_status NOT NULL,
    guards       JSONB NOT NULL DEFAULT '[]'::jsonb,
    validators   JSONB NOT NULL DEFAULT '[]'::jsonb,
    approvals    JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS automation_rules (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(128) NOT NULL,
    status       VARCHAR(64) NOT NULL DEFAULT 'draft',
    trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    conditions   JSONB NOT NULL DEFAULT '[]'::jsonb,
    actions      JSONB NOT NULL DEFAULT '[]'::jsonb,
    guardrail    VARCHAR(64) NOT NULL DEFAULT 'human_review_required',
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_runs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id      UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
    issue_id     UUID REFERENCES issues(id) ON DELETE SET NULL,
    status       VARCHAR(64) NOT NULL DEFAULT 'queued',
    proposal     JSONB NOT NULL DEFAULT '{}'::jsonb,
    result       JSONB NOT NULL DEFAULT '{}'::jsonb,
    approved_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS project_role_assignments (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    role         production_role NOT NULL,
    permissions  JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id, role)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    channels     JSONB NOT NULL DEFAULT '[]'::jsonb,
    events       JSONB NOT NULL DEFAULT '[]'::jsonb,
    quiet_hours  JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS import_export_jobs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    job_type     VARCHAR(64) NOT NULL,
    status       VARCHAR(64) NOT NULL DEFAULT 'queued',
    source       JSONB NOT NULL DEFAULT '{}'::jsonb,
    result       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS project_webhooks (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(128) NOT NULL,
    target_url   TEXT NOT NULL,
    events       JSONB NOT NULL DEFAULT '[]'::jsonb,
    secret_ref   TEXT,
    status       VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_templates (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name         VARCHAR(128) NOT NULL,
    description  TEXT,
    template     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER trg_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_widgets_updated_at ON dashboard_widgets;
CREATE TRIGGER trg_dashboard_widgets_updated_at
    BEFORE UPDATE ON dashboard_widgets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_workflow_definitions_updated_at ON workflow_definitions;
CREATE TRIGGER trg_workflow_definitions_updated_at
    BEFORE UPDATE ON workflow_definitions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_automation_rules_updated_at ON automation_rules;
CREATE TRIGGER trg_automation_rules_updated_at
    BEFORE UPDATE ON automation_rules
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_project_webhooks_updated_at ON project_webhooks;
CREATE TRIGGER trg_project_webhooks_updated_at
    BEFORE UPDATE ON project_webhooks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_project_templates_updated_at ON project_templates;
CREATE TRIGGER trg_project_templates_updated_at
    BEFORE UPDATE ON project_templates
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
