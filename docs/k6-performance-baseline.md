# k6 Performance Baseline

## Tooling

- Tool: Grafana k6 Docker image, `grafana/k6:latest`
- Runtime observed locally: `k6 v2.0.0+dirty`
- Target: local Docker Compose backend, `http://127.0.0.1:18080`
- Script: `perf/k6/assetslake-api-load.js`

## Scenario Mix

The local baseline uses k6 `constant-arrival-rate` scenarios:

| Scenario | Endpoint | Rate |
| --- | --- | ---: |
| `health_baseline` | `GET /api/health` | 1000 iterations/s |
| `auth_read` | `GET /api/auth/me` | 200 iterations/s |
| `issue_list` | `GET /api/issues?page=1&page_size=20` | 100 iterations/s |
| `lock_race` | `POST /api/locks/acquire` | 100 iterations/s |

Lock winners hold the lock for `0.2s` before release to create real contention.
Expected `409` lock conflicts are treated as successful business responses.

## Command

```powershell
docker run --rm `
  -e BASE_URL=http://host.docker.internal:18080 `
  -e DURATION=1m `
  -e HEALTH_RPS=1000 `
  -e AUTH_RPS=200 `
  -e ISSUE_RPS=100 `
  -e LOCK_RPS=100 `
  -e MAX_VUS=1500 `
  -e LOCK_HOLD_SECONDS=0.2 `
  -v ${PWD}\perf\k6:/scripts `
  -v ${PWD}\.run-logs\perf:/results `
  grafana/k6:latest run /scripts/assetslake-api-load.js `
  --summary-export /results/assetslake-k6-load-summary.json
```

## Local Result

| Metric | Value |
| --- | ---: |
| HTTP requests | 85586 |
| HTTP request rate | 1416.22 req/s |
| Completed iterations | 84004 |
| Iteration rate | 1390.04 iter/s |
| HTTP failed rate | 0% |
| Check pass rate | 100% |
| Unexpected responses | 0 |
| HTTP duration avg | 2.85 ms |
| HTTP duration p90 | 4.72 ms |
| HTTP duration p95 | 5.91 ms |
| HTTP duration max | 440.17 ms |
| Lock winners | 1573 |
| Expected lock conflicts | 4428 |

## Thresholds

All configured k6 thresholds passed:

- `http_req_failed < 1%`
- global `http_req_duration p95 < 3000ms`
- health `http_req_duration p95 < 750ms`
- `checks > 99%`
- `unexpected_responses == 0`

## Notes

This is a local Docker Desktop baseline, not a production capacity claim. Use
the same script against staging or Kubernetes with production-like CPU, database,
pooler, network, and observability settings before setting SLOs.
