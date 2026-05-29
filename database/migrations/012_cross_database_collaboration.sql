/*
```cypher
CREATE
  (f:File {name: "012_cross_database_collaboration.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.cross_database_collaboration", type: "module"}),
  (c1:Class {name: "outbox_events", type: "class", language: "sql", signature: "CREATE TABLE outbox_events"}),
  (c2:Class {name: "inbox_events", type: "class", language: "sql", signature: "CREATE TABLE inbox_events"}),
  (c3:Class {name: "user_snapshot", type: "class", language: "sql", signature: "CREATE TABLE user_snapshot"}),
  (c4:Class {name: "project_snapshot", type: "class", language: "sql", signature: "CREATE TABLE project_snapshot"}),
  (c5:Class {name: "asset_snapshot", type: "class", language: "sql", signature: "CREATE TABLE asset_snapshot"}),
  (c6:Class {name: "issue_snapshot", type: "class", language: "sql", signature: "CREATE TABLE issue_snapshot"}),
  (c7:Class {name: "saga_instances", type: "class", language: "sql", signature: "CREATE TABLE saga_instances"}),
  (c8:Class {name: "domain_event_dead_letters", type: "class", language: "sql", signature: "CREATE TABLE domain_event_dead_letters"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8);
```
*/

-- Cross-database collaboration primitives.
-- These tables are duplicated per service database after the database split.

CREATE TABLE IF NOT EXISTS outbox_events (
    event_id           UUID PRIMARY KEY,
    event_type         VARCHAR(128) NOT NULL,
    schema_version     INTEGER NOT NULL DEFAULT 1,
    producer           VARCHAR(64) NOT NULL,
    aggregate_type     VARCHAR(64) NOT NULL,
    aggregate_id       UUID NOT NULL,
    workspace_id       UUID,
    occurred_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    trace_id           UUID NOT NULL,
    causation_id       UUID,
    idempotency_key    TEXT NOT NULL UNIQUE,
    topic              VARCHAR(128) NOT NULL,
    payload            JSONB NOT NULL,
    published_at       TIMESTAMPTZ,
    publish_attempts   INTEGER NOT NULL DEFAULT 0,
    last_publish_error TEXT,
    next_attempt_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_events_pending
    ON outbox_events(next_attempt_at, occurred_at)
    WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_outbox_events_aggregate
    ON outbox_events(aggregate_type, aggregate_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS inbox_events (
    consumer        VARCHAR(64) NOT NULL,
    event_id        UUID NOT NULL,
    event_type      VARCHAR(128) NOT NULL,
    producer        VARCHAR(64) NOT NULL,
    aggregate_type  VARCHAR(64) NOT NULL,
    aggregate_id    UUID NOT NULL,
    payload         JSONB NOT NULL,
    processed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (consumer, event_id)
);

CREATE INDEX IF NOT EXISTS idx_inbox_events_aggregate
    ON inbox_events(aggregate_type, aggregate_id, processed_at DESC);

CREATE TABLE IF NOT EXISTS user_snapshot (
    user_id               UUID PRIMARY KEY,
    display_name          TEXT NOT NULL,
    email                 TEXT,
    status                VARCHAR(32) NOT NULL DEFAULT 'active',
    source_event_id       UUID NOT NULL,
    source_version        BIGINT NOT NULL DEFAULT 1,
    source_updated_at     TIMESTAMPTZ NOT NULL,
    projection_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload               JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS project_snapshot (
    project_id            UUID PRIMARY KEY,
    workspace_id          UUID,
    name                  TEXT NOT NULL,
    code                  TEXT NOT NULL,
    status                VARCHAR(32) NOT NULL DEFAULT 'active',
    source_event_id       UUID NOT NULL,
    source_version        BIGINT NOT NULL DEFAULT 1,
    source_updated_at     TIMESTAMPTZ NOT NULL,
    projection_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload               JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_project_snapshot_workspace
    ON project_snapshot(workspace_id, status);

CREATE TABLE IF NOT EXISTS asset_snapshot (
    asset_id              UUID PRIMARY KEY,
    project_id            UUID,
    name                  TEXT NOT NULL,
    asset_type            TEXT,
    mime_type             TEXT,
    status                VARCHAR(32) NOT NULL DEFAULT 'active',
    file_url              TEXT,
    preview_url           TEXT,
    version               INTEGER NOT NULL DEFAULT 1,
    source_event_id       UUID NOT NULL,
    source_version        BIGINT NOT NULL DEFAULT 1,
    source_updated_at     TIMESTAMPTZ NOT NULL,
    projection_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload               JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_asset_snapshot_project
    ON asset_snapshot(project_id, status);

CREATE TABLE IF NOT EXISTS issue_snapshot (
    issue_id              UUID PRIMARY KEY,
    project_id            UUID,
    issue_key             TEXT NOT NULL,
    title                 TEXT NOT NULL,
    status                VARCHAR(64) NOT NULL,
    priority              VARCHAR(32),
    source_event_id       UUID NOT NULL,
    source_version        BIGINT NOT NULL DEFAULT 1,
    source_updated_at     TIMESTAMPTZ NOT NULL,
    projection_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload               JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_issue_snapshot_project
    ON issue_snapshot(project_id, status);

CREATE TABLE IF NOT EXISTS saga_instances (
    saga_id          UUID PRIMARY KEY,
    saga_type        VARCHAR(128) NOT NULL,
    aggregate_type   VARCHAR(64) NOT NULL,
    aggregate_id     UUID NOT NULL,
    status           VARCHAR(32) NOT NULL,
    current_step     VARCHAR(128) NOT NULL,
    trace_id         UUID NOT NULL,
    payload          JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_error       TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saga_instances_aggregate
    ON saga_instances(aggregate_type, aggregate_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_saga_instances_status
    ON saga_instances(status, updated_at);

CREATE TABLE IF NOT EXISTS domain_event_dead_letters (
    dead_letter_id UUID PRIMARY KEY,
    consumer       VARCHAR(64) NOT NULL,
    event_id       UUID,
    topic          VARCHAR(128) NOT NULL,
    payload        JSONB NOT NULL,
    error          TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_event_dead_letters_consumer
    ON domain_event_dead_letters(consumer, created_at DESC);
