/*
```cypher
CREATE
  (f:File {name: "015_admin_control_settings.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.admin_control_settings", type: "module"}),
  (c1:Class {name: "admin_control_settings", type: "class", language: "sql", signature: "CREATE TABLE admin_control_settings"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1);
```
*/

-- Runtime control settings for the dedicated backend administration app.
CREATE TABLE IF NOT EXISTS admin_control_settings (
    id                          TEXT PRIMARY KEY DEFAULT 'default',
    session_ttl_seconds          BIGINT NOT NULL DEFAULT 43200,
    idle_timeout_seconds         BIGINT NOT NULL DEFAULT 3600,
    abnormal_login_threshold     BIGINT NOT NULL DEFAULT 5,
    abnormal_window_minutes      BIGINT NOT NULL DEFAULT 15,
    failed_login_alert_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
    rbac_denial_alert_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by                  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (session_ttl_seconds BETWEEN 300 AND 2592000),
    CHECK (idle_timeout_seconds >= 60 AND idle_timeout_seconds <= session_ttl_seconds),
    CHECK (abnormal_login_threshold BETWEEN 1 AND 10000),
    CHECK (abnormal_window_minutes BETWEEN 1 AND 1440)
);

DROP TRIGGER IF EXISTS trg_admin_control_settings_updated_at ON admin_control_settings;
CREATE TRIGGER trg_admin_control_settings_updated_at
    BEFORE UPDATE ON admin_control_settings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO admin_control_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;
