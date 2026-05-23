# High Concurrency Development Plan

## Completed in this pass

- Lowered default backend DB pool sizing for multi-replica deployments.
- Added in-process rate limiting for login and verification challenge creation.
- Added backend maintenance cleanup for expired locks, old released locks, old sessions, and old verification outbox rows.
- Added Kubernetes resource requests, limits, liveness probes, HPAs, and PDBs for app services.
- Added a high-concurrency smoke test for health, auth, and lock race behavior.

## Operating defaults

- `DB_MAX_CONNECTIONS=20`
- `DB_MIN_CONNECTIONS=2`
- `DB_ACQUIRE_TIMEOUT_SECONDS=3`
- `RATE_LIMIT_LOGIN_MAX=30`
- `RATE_LIMIT_LOGIN_WINDOW_SECONDS=60`
- `RATE_LIMIT_VERIFICATION_MAX=10`
- `RATE_LIMIT_VERIFICATION_WINDOW_SECONDS=300`
- `BACKEND_MAINTENANCE_INTERVAL_SECONDS=300`

## Verification

```powershell
cd backend
cargo fmt --check
cargo test
cargo clippy --all-targets --all-features -- -D warnings

cd ../frontend
pnpm run type-check
pnpm run test:auth-locks
pnpm run test:concurrency

cd ..
docker compose --env-file infra\.env -f infra\docker-compose.yml config --quiet
kubectl kustomize infra\k8s
```

## Latest Local Execution

- Docker backend was rebuilt and restarted successfully.
- Local port `8080` was already occupied, so ignored local config `infra/.env` now maps backend to `18080`.
- `http://127.0.0.1:18080/api/health` returned healthy.
- `pnpm run test:auth-locks` passed against `http://127.0.0.1:18080`.
- `pnpm run test:concurrency` passed against `http://127.0.0.1:18080`.
- `infra/.env` is confirmed ignored by Git via `.gitignore`.

## Remaining Production Work

- Add PgBouncer or a managed pooler in front of PostgreSQL.
- Split read-heavy routes onto a read replica with explicit stale-read tolerance.
- Add distributed rate limiting backed by Redis or Postgres advisory counters.
- Add queue-based isolation for AI analysis, email delivery, and heavy indexing.
- Add real load tests with k6 or Locust and publish baseline throughput/latency targets.
- Add automatic PostgreSQL failover instead of mirror-only replication.
