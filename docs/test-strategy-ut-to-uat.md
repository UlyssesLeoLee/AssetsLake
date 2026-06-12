# Test Strategy from UT to UAT

AssetsLake keeps automated tests at each confidence layer instead of relying on
one large end-to-end suite. Run the cheaper gates first, then promote the same
build through live smoke, UAT, and performance checks.

## Layers

| Layer | Purpose | Command | Live services |
| --- | --- | --- | --- |
| `static` | Format and type contracts before runtime tests. | `scripts/test-assetslake-quality-gates.ps1 -Layer static` | No |
| `ut` | Rust service unit tests plus frontend domain/model unit tests. | `scripts/test-assetslake-quality-gates.ps1 -Layer ut` | No |
| `contract` | API, RBAC, auth-session, asset-security, concurrency, and quality-gate wiring contracts. | `cd frontend; pnpm run test:contract` | No |
| `it` | Cross-module integration contracts that verify frontend, docs, mocks, and scripts remain aligned. | `cd frontend; pnpm run test:it` | No |
| `e2e` | Full Playwright browser suite with deterministic `/api/**` mocks and retained traces. | `cd frontend; pnpm run test:e2e` | No |
| `uat` | Acceptance journeys for product management, asset library, upload, issue lifecycle, reports, delivery, and AI control. | `cd frontend; pnpm run test:uat` | No |
| `smoke` | Live backend/data-lake, auth-lock, and high-concurrency smoke tests. | `scripts/test-assetslake-quality-gates.ps1 -Layer smoke -IncludeLive -ApiUrl http://127.0.0.1:18080` | Yes |
| `perf` | k6 HTTP performance baseline against a deployed backend. | `scripts/test-assetslake-quality-gates.ps1 -Layer perf -IncludePerf` | Yes |

## Standard Gates

Local non-live gate:

```powershell
scripts/test-assetslake-quality-gates.ps1
```

Frontend-only local gate:

```powershell
cd frontend
pnpm run test:quality:local
```

Live gate against the local Docker Compose backend:

```powershell
scripts/test-assetslake-quality-gates.ps1 `
  -Layer all `
  -IncludeLive `
  -ApiUrl http://127.0.0.1:18080
```

Performance baseline:

```powershell
scripts/test-assetslake-quality-gates.ps1 -Layer perf -IncludePerf -PerfDuration 1m
```

## Promotion Policy

- Pull requests should pass `static`, `ut`, `contract`, and `it`.
- UI workflow changes should also pass `uat`; broad navigation changes should
  pass `e2e`.
- Backend, storage, auth, lock, and concurrency changes should pass `smoke`
  against Docker Compose or a staging deployment.
- Throughput or scaling claims require `perf` with the k6 summary retained under
  `.run-logs/perf`.

The generated reports, traces, and k6 summaries stay on disk for diagnosis and
are intentionally ignored by Git.
