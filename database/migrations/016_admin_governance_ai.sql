/*
```cypher
CREATE
  (f:File {name: "016_admin_governance_ai.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.admin_governance_ai", type: "module"}),
  (c1:Class {name: "users_governance_status", type: "class", language: "sql", signature: "ALTER TABLE users ADD governance status columns"}),
  (c2:Class {name: "admin_risk_policy_settings", type: "class", language: "sql", signature: "CREATE TABLE admin_risk_policy_settings"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()", visibility: "existing"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1);
```
*/

-- Independent governance status for account blocking. deleted_at remains deletion semantics.
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_status VARCHAR(32) NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unblocked_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unblocked_by UUID REFERENCES users(id) ON DELETE SET NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_users_user_status'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT chk_users_user_status
        CHECK (user_status IN ('active', 'blocked'));
    END IF;
END $$;

UPDATE users
SET user_status = 'blocked',
    blocked_at = COALESCE(blocked_at, deleted_at),
    blocked_reason = COALESCE(blocked_reason, 'migrated from deleted_at admin block state')
WHERE deleted_at IS NOT NULL
  AND user_status = 'active';

CREATE INDEX IF NOT EXISTS idx_users_user_status ON users(user_status);
CREATE INDEX IF NOT EXISTS idx_users_blocked_at ON users(blocked_at DESC) WHERE user_status = 'blocked';
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, user_status);

CREATE TABLE IF NOT EXISTS admin_risk_policy_settings (
    id                         TEXT PRIMARY KEY DEFAULT 'default',
    session_weight             BIGINT NOT NULL DEFAULT 10,
    lock_weight                BIGINT NOT NULL DEFAULT 15,
    event_weight               BIGINT NOT NULL DEFAULT 3,
    blocked_weight             BIGINT NOT NULL DEFAULT 80,
    auth_failure_weight        BIGINT NOT NULL DEFAULT 12,
    rbac_denial_weight         BIGINT NOT NULL DEFAULT 10,
    high_session_threshold     BIGINT NOT NULL DEFAULT 5,
    high_event_threshold       BIGINT NOT NULL DEFAULT 20,
    ai_analysis_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
    langgraph_risk_node        TEXT NOT NULL DEFAULT 'admin_risk_orchestrator',
    updated_by                 UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (session_weight BETWEEN 0 AND 1000),
    CHECK (lock_weight BETWEEN 0 AND 1000),
    CHECK (event_weight BETWEEN 0 AND 1000),
    CHECK (blocked_weight BETWEEN 0 AND 5000),
    CHECK (auth_failure_weight BETWEEN 0 AND 1000),
    CHECK (rbac_denial_weight BETWEEN 0 AND 1000),
    CHECK (high_session_threshold BETWEEN 1 AND 10000),
    CHECK (high_event_threshold BETWEEN 1 AND 100000)
);

DROP TRIGGER IF EXISTS trg_admin_risk_policy_settings_updated_at ON admin_risk_policy_settings;
CREATE TRIGGER trg_admin_risk_policy_settings_updated_at
    BEFORE UPDATE ON admin_risk_policy_settings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO admin_risk_policy_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_audit_log_action_created_at ON audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_created_at ON audit_log(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_created_at ON audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_outcome_created_at ON audit_log((diff->>'outcome'), created_at DESC);
