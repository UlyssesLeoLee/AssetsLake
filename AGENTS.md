# Repository Conventions

- Use Browserbase for cloud browser smoke tests through `pnpm run test:browserbase`; keep the existing local Playwright suite for localhost E2E coverage.
- Read Browserbase credentials from `BROWSERBASE_API_KEY` in the user environment or CI secret store, and never commit or print the credential.
