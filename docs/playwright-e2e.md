# Playwright E2E Test System

## Scope

The Playwright suite runs real Chromium browser journeys against the Next app.
It clicks plugin navigation, project management pages, issue detail actions,
Gantt/workflow/automation/report/enterprise surfaces, asset library controls,
and the upload flow.

The tests mock `/api/**` in the browser so trace generation is stable and does
not depend on a live backend deployment. Live backend and data lake coverage
remain in `pnpm run test:smoke`.

The config keeps browser and navigation timeouts high enough for cold Next dev
route compilation on Windows workstations.

## Commands

- `pnpm run test:e2e` runs the Playwright suite headlessly and then validates
  that traces and the HTML report were retained.
- `pnpm run test:e2e:run` runs only the raw Playwright browser suite.
- `pnpm run test:e2e:artifacts` validates `playwright-results.json`, trace
  zip attachments, and the saved HTML report.
- `pnpm run test:e2e:headed` runs with a visible browser.
- `pnpm run test:e2e:trace` forces trace collection from the command line.
- `pnpm run test:e2e:gallery` captures full-page screenshots for every app
  interface and retains a trace for the gallery run.
- `pnpm run test:e2e:branches` records separate traces for the main operation
  branches, including navigation, issue actions, delivery, upload, and AI
  settings.
- `pnpm run test:e2e:report` opens the saved HTML report.
- `pnpm run test:full` runs static regression, Playwright E2E, smoke, type
  check, and production build.

## Trace Retention

`frontend/playwright.config.ts` sets trace mode to `on` with screenshots,
snapshots, and sources enabled, so every Playwright test keeps a trace zip
under `frontend/test-results/playwright/`.

HTML reports are written to `frontend/playwright-report/`.

Interface gallery screenshots are written to
`frontend/test-results/interface-gallery/screenshots/`.

`pnpm run test:e2e:artifacts` is the regression contract for retained
debugging evidence. It fails if the latest JSON result, any trace zip, or the
HTML report is missing or unexpectedly small.

These generated outputs are ignored by Git but remain on disk for debugging.
