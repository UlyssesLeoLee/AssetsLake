# AssetsLake k6 performance tests

This folder contains a k6 load test for the Rust/Actix-Web backend. It uses
Grafana k6 through Docker so the host does not need a global k6 install.

## Local Docker Compose backend

```powershell
docker run --rm `
  -e BASE_URL=http://host.docker.internal:18080 `
  -e DURATION=1m `
  -e HEALTH_RPS=500 `
  -e AUTH_RPS=120 `
  -e ISSUE_RPS=60 `
  -e LOCK_RPS=30 `
  -e MAX_VUS=1000 `
  -v ${PWD}\perf\k6:/scripts `
  -v ${PWD}\.run-logs\perf:/results `
  grafana/k6:latest run /scripts/assetslake-api-load.js `
  --summary-export /results/assetslake-k6-summary.json
```

The default target is `http://host.docker.internal:18080`, matching the local
Docker Compose backend port currently used by this repo.

## Useful knobs

- `BASE_URL`: backend base URL.
- `DURATION`: k6 scenario duration, for example `30s`, `1m`, `5m`.
- `HEALTH_RPS`: unauthenticated `/api/health` request rate.
- `AUTH_RPS`: authenticated `/api/auth/me` request rate.
- `ISSUE_RPS`: authenticated `/api/issues` list request rate.
- `LOCK_RPS`: authenticated `/api/locks/acquire` race request rate.
- `LOCK_HOLD_SECONDS`: time a lock winner holds the lock before release.
- `MAX_VUS`: cap for virtual users.
- `P95_MS`: global p95 latency threshold.
- `HEALTH_P95_MS`: stricter p95 latency threshold for health checks.
- `FAIL_RATE`: maximum accepted k6 `http_req_failed` rate.

Set a scenario RPS to `0` to disable it.
