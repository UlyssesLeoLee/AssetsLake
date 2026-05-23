# Emergent Operating Layer

This layer turns AssetsLake from separate app surfaces into one operating loop.

## What Changed

- Backend now owns a canonical emergence snapshot at `GET /api/management/emergence`.
- The snapshot combines data lake evidence, Jira-style flow, AI/RAG memory, sessions, locks, milestones, and delivery packages.
- Management UI displays the backend snapshot above the local browser-derived model.
- `POST /api/management/emergence/remember` can distill the current snapshot into RAG memory for authorized AI-control sessions.

## Operating Loop

- Sense: evidence coverage, asset/code/version signals, multimodal AI insights.
- Decide: overdue work, QA risks, missing review evidence, RAG freshness.
- Act: delivery candidates, guarded AI controls, exclusive locks, package readiness.

## Verification

```powershell
cd backend
cargo fmt --check
cargo check
cargo test

cd ../frontend
pnpm run type-check
pnpm run test:emergence
```
