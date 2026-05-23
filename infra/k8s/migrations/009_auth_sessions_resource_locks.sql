-- AssetsLake account sessions and exclusive resource locks
-- Version: 1.0.0

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS user_sessions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash   TEXT NOT NULL UNIQUE,
    device_label TEXT,
    expires_at   TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ,
    revoked_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active
    ON user_sessions(token_hash, expires_at)
    WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS resource_locks (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type  VARCHAR(64) NOT NULL,
    resource_id    UUID NOT NULL,
    holder_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id     UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
    lock_token     TEXT NOT NULL UNIQUE,
    purpose        TEXT,
    expires_at     TIMESTAMPTZ NOT NULL,
    released_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (resource_type IN ('issue', 'asset', 'delivery_package', 'project')),
    CHECK (expires_at > created_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_resource_locks_active_resource
    ON resource_locks(resource_type, resource_id)
    WHERE released_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_resource_locks_holder ON resource_locks(holder_user_id);
CREATE INDEX IF NOT EXISTS idx_resource_locks_session ON resource_locks(session_id);
CREATE INDEX IF NOT EXISTS idx_resource_locks_expiry ON resource_locks(expires_at)
    WHERE released_at IS NULL;

DROP TRIGGER IF EXISTS trg_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER trg_user_sessions_updated_at
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_resource_locks_updated_at ON resource_locks;
CREATE TRIGGER trg_resource_locks_updated_at
    BEFORE UPDATE ON resource_locks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO users (id, username, display_name, email, role, password_salt, password_hash)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'alice.producer',
        'Alice Producer',
        'alice.producer@assetslake.internal',
        'producer',
        'alice-session-salt',
        'ee14d353ce2bad0ff99a9f525398477daac5f7ee196208a1877122d7a9d7eb44'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'bob.artist',
        'Bob Artist',
        'bob.artist@assetslake.internal',
        'artist',
        'bob-session-salt',
        'f3b94e3af9ca2f2b88a48e8cdd6d0aab09337493b2797cc790699a023e4ce3aa'
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'chen.reviewer',
        'Chen Reviewer',
        'chen.reviewer@assetslake.internal',
        'reviewer',
        'chen-session-salt',
        'f1035922bc67bbfa81371393d154c91c7c0c5d0ec7d10dc293edc4d8dc858f33'
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'dana.manager',
        'Dana Manager',
        'dana.manager@assetslake.internal',
        'admin',
        'dana-session-salt',
        'fb7e28d79441f5c8a86df1a3508c135c480baa276c1e1ba2f35326495904c20b'
    )
ON CONFLICT (id) DO UPDATE
SET display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    password_salt = EXCLUDED.password_salt,
    password_hash = EXCLUDED.password_hash,
    deleted_at = NULL,
    updated_at = NOW();
