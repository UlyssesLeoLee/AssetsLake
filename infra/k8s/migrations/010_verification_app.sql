/*
```cypher
CREATE
  (f:File {name: "010_verification_app.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.verification_app", type: "module"}),
  (c1:Class {name: "verification_apps", type: "class", language: "sql", signature: "CREATE TABLE verification_apps"}),
  (c2:Class {name: "verification_challenges", type: "class", language: "sql", signature: "CREATE TABLE verification_challenges"}),
  (c3:Class {name: "verification_outbox", type: "class", language: "sql", signature: "CREATE TABLE verification_outbox"}),
  (v1:Variable {name: "users.phone_number", type: "variable"}),
  (v2:Variable {name: "hanakagumi@outlook.com", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (c2)-[:USES]->(c1),
  (c3)-[:USES]->(c1),
  (c3)-[:USES]->(c2);
```
*/

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(32);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_number
    ON users(phone_number)
    WHERE phone_number IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS verification_apps (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_key          VARCHAR(128) NOT NULL UNIQUE,
    name             VARCHAR(256) NOT NULL,
    owner_email      VARCHAR(256) NOT NULL DEFAULT 'hanakagumi@outlook.com',
    sender_email     VARCHAR(256) NOT NULL DEFAULT 'hanakagumi@outlook.com',
    sms_sender_label VARCHAR(64) NOT NULL DEFAULT 'AssetsLake',
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_apps_active
    ON verification_apps(app_key)
    WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS verification_challenges (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id                  UUID NOT NULL REFERENCES verification_apps(id) ON DELETE CASCADE,
    purpose                 VARCHAR(32) NOT NULL CHECK (purpose IN ('registration', 'password_change')),
    channel                 VARCHAR(16) NOT NULL CHECK (channel IN ('sms', 'email')),
    phone_number            VARCHAR(32),
    email                   VARCHAR(256),
    target_hash             VARCHAR(64) NOT NULL,
    code_salt               VARCHAR(64) NOT NULL,
    code_hash               VARCHAR(64) NOT NULL,
    verification_token_hash VARCHAR(64),
    attempts                INT NOT NULL DEFAULT 0,
    max_attempts            INT NOT NULL DEFAULT 5,
    expires_at              TIMESTAMPTZ NOT NULL,
    verified_at             TIMESTAMPTZ,
    consumed_at             TIMESTAMPTZ,
    locked_at               TIMESTAMPTZ,
    client_ref              TEXT,
    metadata                JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (phone_number IS NOT NULL OR email IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_verification_challenges_app_target
    ON verification_challenges(app_id, purpose, target_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verification_challenges_active
    ON verification_challenges(app_id, expires_at)
    WHERE consumed_at IS NULL AND locked_at IS NULL;

CREATE TABLE IF NOT EXISTS verification_outbox (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id              UUID NOT NULL REFERENCES verification_apps(id) ON DELETE CASCADE,
    challenge_id        UUID NOT NULL REFERENCES verification_challenges(id) ON DELETE CASCADE,
    channel             VARCHAR(16) NOT NULL CHECK (channel IN ('sms', 'email')),
    provider            VARCHAR(64) NOT NULL DEFAULT 'local-outbox',
    recipient           TEXT NOT NULL,
    recipient_masked    TEXT NOT NULL,
    subject             TEXT,
    body                TEXT NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'queued',
    provider_message_id TEXT,
    error_message       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at             TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_verification_outbox_challenge
    ON verification_outbox(challenge_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verification_outbox_status
    ON verification_outbox(status, created_at);

DROP TRIGGER IF EXISTS trg_verification_apps_updated_at ON verification_apps;
CREATE TRIGGER trg_verification_apps_updated_at
    BEFORE UPDATE ON verification_apps
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_verification_challenges_updated_at ON verification_challenges;
CREATE TRIGGER trg_verification_challenges_updated_at
    BEFORE UPDATE ON verification_challenges
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO verification_apps (
    id,
    app_key,
    name,
    owner_email,
    sender_email,
    sms_sender_label
)
VALUES (
    '00000000-0000-0000-0000-000000000510',
    'assetslake',
    'AssetsLake Verification',
    'hanakagumi@outlook.com',
    'hanakagumi@outlook.com',
    'AssetsLake'
)
ON CONFLICT (app_key) DO UPDATE SET
    name = EXCLUDED.name,
    owner_email = EXCLUDED.owner_email,
    sender_email = EXCLUDED.sender_email,
    sms_sender_label = EXCLUDED.sms_sender_label,
    is_active = TRUE,
    updated_at = NOW();
