# Wiki and Design Requirements Apps

## App boundaries

- `wiki-app` owns spaces, pages, update history, and active editor presence.
- `design-requirements-app` owns requirement lifecycle, comments, and asset bindings.
- Backend route sets are selected with `ASSETSLAKE_SERVICE=wiki` or
  `ASSETSLAKE_SERVICE=design-requirements`.
- Database connections can be isolated with `WIKI_DATABASE_URL` and
  `DESIGN_REQUIREMENTS_DATABASE_URL`. Both fall back to `DATABASE_URL` for the
  single-database development topology.

## IF contracts

The public Rust contracts live in `backend/src/interfaces`:

- `wiki_if.rs` defines collaborative Wiki operations.
- `design_requirement_if.rs` defines requirement lifecycle operations.
- `asset_if.rs` is the only asset lookup contract used by design requirements.
- `design_ai_if.rs` isolates AI drafting from requirement persistence.

The asset IF reads the local `asset_snapshot` projection first, supports the
single-database `assets` table during migration, and falls back to the secured
`/internal/assets/{id}` service endpoint.

## Concurrent editing

Wiki clients submit one character-range patch with a base version. The service
serializes page writes, transforms non-overlapping concurrent patches against
accepted updates, and returns HTTP 409 when edits overlap. Clients poll the sync
endpoint and heartbeat presence independently, so no exclusive resource lock is
held while a page is being edited.

## AI provider

The design requirements app uses the existing AI request headers. Google Gemini
can be configured through its OpenAI-compatible endpoint:

- Provider: `Google Gemini`
- Base URL: `https://generativelanguage.googleapis.com/v1beta/openai`
- Model: a Gemini chat model available to the configured API key

API keys remain client-side settings and request headers; they are not stored in
the repository or application database.
