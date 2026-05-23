# Concurrency, Sessions, And Exclusive Locks

AssetsLake now has a DB-backed session and resource lock layer for multi-user operation.

Runtime tuning:

```env
SERVER_WORKERS=0
DB_MAX_CONNECTIONS=80
DB_MIN_CONNECTIONS=4
DB_ACQUIRE_TIMEOUT_SECONDS=5
```

`SERVER_WORKERS=0` lets the backend use available CPU parallelism. Increase or pin it only when the host is shared with other services. The database pool is intentionally larger than the previous local default so concurrent API requests do not serialize behind a small pool.

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

Seeded test accounts:

- `alice.producer`
- `bob.artist`
- `chen.reviewer`
- `dana.manager`

They share the local integration password configured by `ASSETSLAKE_TEST_PASSWORD` in tests. For the default seed data it is `AssetsLake#2026`.

Run the multi-user integration test against a running backend:

```powershell
$env:ASSETSLAKE_API_URL='http://127.0.0.1:18080'
pnpm run test:auth-locks
```

The test logs in as Alice and Bob, creates an issue, verifies Alice can lock it, verifies Bob cannot acquire or write through Alice's lock, verifies Alice can write with the lock token, then releases and verifies Bob can acquire afterward. It also runs a parallel four-account lock race and asserts that exactly one session wins while the others receive `409 CONFLICT`.
