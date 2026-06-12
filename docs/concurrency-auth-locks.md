# Concurrency, Sessions, And Exclusive Locks

AssetsLake now has a DB-backed session and resource lock layer for multi-user operation.

Runtime tuning:

```env
SERVER_WORKERS=0
DB_MAX_CONNECTIONS=80
DB_MIN_CONNECTIONS=4
DB_ACQUIRE_TIMEOUT_SECONDS=2
DB_STATEMENT_TIMEOUT_MS=2500
DB_LOCK_TIMEOUT_MS=2000
SESSION_TOUCH_INTERVAL_SECONDS=60
```

`SERVER_WORKERS=0` lets the backend use available CPU parallelism. Increase or pin it only when the host is shared with other services. The database pool is intentionally larger than the previous local default so concurrent API requests do not serialize behind a small pool.

Session validation is database-backed, so revoked or expired tokens are rejected
consistently across replicas. To keep high-concurrency read paths from turning
into a write storm, `last_seen_at` is touched at most once per session per
`SESSION_TOUCH_INTERVAL_SECONDS`.

Session APIs:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/test-accounts`

Lock APIs:

- `POST /api/locks/acquire`
- `POST /api/locks/renew`
- `POST /api/locks/release`
- `GET /api/locks/{resource_type}/{resource_id}`

Supported lock resources are `issue`, `asset`, `delivery_package`, and `project`. Write endpoints remain backward compatible when a resource is not locked. Once a resource is locked, mutating requests must include both:

```http
Authorization: Bearer <session-token>
x-assetslake-lock-token: <lock-token>
```

The lock owner can update, renew, and release the lock. Other sessions receive `409 CONFLICT`.

Kanban realtime feedback:

- `GET /api/issues/board-sync`
- Frontend polling interval: 2 seconds
- Payload: board cursor, changed issue count, and the latest status-history rows

The board does not poll the full issue list every 2 seconds. It first calls the lightweight sync endpoint, which reads `MAX(issues.updated_at)` and a small recent activity window. Only when the cursor changes does the UI invalidate the full `issues` query. Drag transitions still send `expected_version`; stale clients receive `409 CONFLICT`, refresh the board, and ask the user to retry from the current card state.

Seeded test accounts:

- `alice.producer`
- `bob.artist`
- `chen.reviewer`
- `dana.manager`

They share the local integration password configured by `ASSETSLAKE_TEST_PASSWORD` in tests. For the default seed data it is `test`.

Run the multi-user integration test against a running backend:

```powershell
$env:ASSETSLAKE_API_URL='http://127.0.0.1:18080'
pnpm run test:auth-locks
```

The test logs in as Alice and Bob, creates an issue, verifies Alice can lock it, verifies Bob cannot acquire or write through Alice's lock, verifies Alice can write with the lock token, then releases and verifies Bob can acquire afterward. It also runs a parallel four-account lock race and asserts that exactly one session wins while the others receive `409 CONFLICT`.
