/*
```cypher
CREATE
  (f:File {name: "017_local_account_credentials.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.local_account_credentials", type: "module"}),
  (c1:Class {name: "users.local_admin_account", type: "class", language: "sql", signature: "INSERT INTO users"}),
  (c2:Class {name: "users.local_test_account_passwords", type: "class", language: "sql", signature: "UPDATE users FROM credentials"}),
  (v1:Variable {name: "admin-session-salt", type: "variable"}),
  (v2:Variable {name: "test-account-salts", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:USES]->(v1),
  (c2)-[:USES]->(v2);
```
*/

-- Keeps local/demo credentials deterministic across fresh and existing databases.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_status VARCHAR(32) NOT NULL DEFAULT 'active';

INSERT INTO users (
    id,
    username,
    display_name,
    email,
    role,
    password_salt,
    password_hash,
    user_status
)
VALUES (
    '10000000-0000-0000-0000-000000000011',
    'admin',
    'Admin',
    'admin@assetslake.internal',
    'admin',
    'admin-session-salt',
    'a6d89dd943b8bb75925185c393355de07b7c07dbb8913c338af6297d29489241',
    'active'
)
ON CONFLICT (username) DO UPDATE
SET display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    password_salt = EXCLUDED.password_salt,
    password_hash = EXCLUDED.password_hash,
    user_status = 'active',
    deleted_at = NULL,
    updated_at = NOW();

WITH credentials(username, password_salt, password_hash) AS (
    VALUES
        (
            'alice.producer',
            'alice-session-salt',
            '2b07675b2baa91d2c057909d7e536cf89e49dfc6300e20a2b4fec730692b750f'
        ),
        (
            'bob.artist',
            'bob-session-salt',
            '7fc9198f0bc79f59e09fb6f5a0e1724261e5d37d82674113054010ea9eacfabb'
        ),
        (
            'chen.reviewer',
            'chen-session-salt',
            '871a12a3c0f695b297f081b70ff9dc18db681c3328ffbdffc6807cf1551179d8'
        ),
        (
            'dana.manager',
            'dana-session-salt',
            'ea4a28a6c5a4a3c474244f3bdcd22c632f25f43d9df209b356dd9473b9b82370'
        ),
        (
            'eve.producer',
            'eve-session-salt',
            'c18ffe87d4e1500647963fb332f1a37dd7779ed1ea84674c37a195def3bb4186'
        ),
        (
            'felix.artist',
            'felix-session-salt',
            'bb51447a5f0f22d0449544564181f22c32f7f66828ee9e0432f89ab5d7d5f6a7'
        ),
        (
            'grace.reviewer',
            'grace-session-salt',
            '31996c39f9041e925df5b36f12f6485d00ce2f5806cca438f4543f08a0e13bf5'
        ),
        (
            'hao.manager',
            'hao-session-salt',
            '0168249286fd0930cc738811a66cd39543a7cfe50fe8650c32b78b0ad8464939'
        ),
        (
            'iris.artist',
            'iris-session-salt',
            'acbd9da6a091a0eeac3c3e0b9ce2f0598edd3f793014bc78385b0889bff52602'
        ),
        (
            'jo.viewer',
            'jo-session-salt',
            '56499500a8687e76c15769009e7688059b061457a1dd3ac073d096acce30ddf1'
        )
)
UPDATE users u
SET password_salt = credentials.password_salt,
    password_hash = credentials.password_hash,
    user_status = 'active',
    deleted_at = NULL,
    updated_at = NOW()
FROM credentials
WHERE u.username = credentials.username;
