/*
```cypher
CREATE
  (f:File {name: "014_multi_user_test_accounts.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.multi_user_test_accounts", type: "module"}),
  (c1:Class {name: "users.multi_user_test_accounts", type: "class", language: "sql", signature: "INSERT INTO users"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1);
```
*/

-- Extends the deterministic local test account pool to ten users for concurrency tests.
INSERT INTO users (id, username, display_name, email, role, password_salt, password_hash)
VALUES
    (
        '10000000-0000-0000-0000-000000000005',
        'eve.producer',
        'Eve Producer',
        'eve.producer@assetslake.internal',
        'producer',
        'eve-session-salt',
        'c18ffe87d4e1500647963fb332f1a37dd7779ed1ea84674c37a195def3bb4186'
    ),
    (
        '10000000-0000-0000-0000-000000000006',
        'felix.artist',
        'Felix Artist',
        'felix.artist@assetslake.internal',
        'artist',
        'felix-session-salt',
        'bb51447a5f0f22d0449544564181f22c32f7f66828ee9e0432f89ab5d7d5f6a7'
    ),
    (
        '10000000-0000-0000-0000-000000000007',
        'grace.reviewer',
        'Grace Reviewer',
        'grace.reviewer@assetslake.internal',
        'reviewer',
        'grace-session-salt',
        '31996c39f9041e925df5b36f12f6485d00ce2f5806cca438f4543f08a0e13bf5'
    ),
    (
        '10000000-0000-0000-0000-000000000008',
        'hao.manager',
        'Hao Manager',
        'hao.manager@assetslake.internal',
        'manager',
        'hao-session-salt',
        '0168249286fd0930cc738811a66cd39543a7cfe50fe8650c32b78b0ad8464939'
    ),
    (
        '10000000-0000-0000-0000-000000000009',
        'iris.artist',
        'Iris Artist',
        'iris.artist@assetslake.internal',
        'artist',
        'iris-session-salt',
        'acbd9da6a091a0eeac3c3e0b9ce2f0598edd3f793014bc78385b0889bff52602'
    ),
    (
        '10000000-0000-0000-0000-000000000010',
        'jo.viewer',
        'Jo Viewer',
        'jo.viewer@assetslake.internal',
        'viewer',
        'jo-session-salt',
        '56499500a8687e76c15769009e7688059b061457a1dd3ac073d096acce30ddf1'
    )
ON CONFLICT (id) DO UPDATE
SET username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    password_salt = EXCLUDED.password_salt,
    password_hash = EXCLUDED.password_hash,
    deleted_at = NULL,
    updated_at = NOW();
