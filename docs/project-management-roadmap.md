# Project Management Product Roadmap

## Current Coverage

The project management surface now has a full plugin-app/plugin-group skeleton
through the final productization phase. The product has a management console,
Kanban-style production views, issue detail routing, brief/review/approval/
delivery pages, planning, milestone timeline, Gantt, calendar, reports,
workflow, automation, and enterprise admin route surfaces. The backend exposes
project management boundaries for planning plus Phase 2-5 productization
snapshots, and the management intelligence contract connects the frontend to the
backend with LangGraph and data lake context.

It is still not a complete Jira-class implementation. The architecture, routes,
contracts, migrations, and regression tests are in place, but the deepest
interactive behavior still needs iterative product work: drag/drop board
persistence, full issue editing, Gantt drag scheduling and baseline comparison,
calendar CRUD, advanced report calculations, workflow designer editing,
automation rule execution, permissions UI, notifications, import/export
execution, and full Playwright-grade browser E2E coverage.

## Plugin Manifest and App Isolation Hardening Status

Implemented:

- Added per-plugin manifests for permissions, dependency declarations, feature
  flags, lifecycle state, and backend/data-lake scopes.
- Added app-level plugin policies so the same plugin groups can be composed
  differently by app without leaking routes or write permissions. The Studio
  Console keeps the full product surface, the Production Console can read the
  asset library without exposing upload, and the Asset Console is limited to
  workspace plus asset operations.
- Routed plugin flattening and navigation through the app policy filter so
  enabled/disabled plugins and permission allowlists affect routes, groups, and
  navigation consistently.
- Extended architecture validation to fail on missing manifests, unresolved
  plugin dependencies, unknown app-policy plugin references, and policy
  conflicts.
- Extended UT/IT regression scripts so plugin atomization, manifest metadata,
  dependencies, and app isolation remain covered.

Verification:

- `pnpm run test:ut` covers manifest and app-policy regression contracts.
- `pnpm run test:it` covers the integration contract for manifest/policy types,
  registry metadata, and validator gates.

## Capability Matrix

| Capability | Current Status | Notes |
| --- | --- | --- |
| Management overview | Partial | `/management` summarizes portfolio, backlog, sprint, review, delivery, AI, and data lake state. |
| Kanban board | Partial | Board renders draggable status columns plus model-backed WIP health, swimlanes, and risk queue; needs persisted ranking, saved filters, and WIP policy editing. |
| Issue detail | Partial | Route includes edit fields, comments, work logs, linked assets, attach-evidence UX, history, evidence readiness, data-lake evidence links, and LangGraph recommendations; needs richer audit drill-down. |
| Backlog and sprint planning | Partial | Frontend/backend planning contracts and CRUD boundaries exist; needs full issue CRUD, ranking persistence, estimation, and capacity UX. |
| Milestone timeline | Partial | Timeline exists and Gantt route is registered; needs full interactive dependency rendering. |
| Gantt chart | Partial | `/gantt` renders a model-backed schedule timeline, blocking edges, critical path, and risk queue; needs zoom, drag scheduling, dependency lines, and baseline comparison behavior. |
| Calendar | Partial | `/calendar` renders model-backed events, lane summaries, workload heatmap, and risk queue; needs release/sprint/review/vendor CRUD behavior. |
| Reports | Partial | `/reports` renders structured burndown, velocity, cumulative flow, cycle/SLA, and delivery readiness analytics; needs persistence-backed historical snapshots and exportable charts. |
| Workflow configuration | Partial | `/workflow` renders a structured transition designer, guard/validator coverage, approval policy, and data-lake evidence gates; needs persistence and drag editing. |
| Automation | Partial | `/automation` renders structured rules, LangGraph runbook, graph coverage, approval gates, and data-lake reads; needs rule persistence and audited execution results. |
| LangGraph integration | Partial | Contract and runbook model exist; needs live workflow graph execution, explainable recommendations, and human approval outcomes. |
| Data lake integration | Partial | Live smoke validates MinIO/backend storage; management needs evidence retrieval, lineage, and graph/vector/search-backed context. |
| Permissions and audit | Partial | Enterprise route renders governance readiness, permission coverage, audit drilldowns, roles, and CI gates; needs server-side policy enforcement and audit drill-down actions. |
| Notifications | Partial | Enterprise route renders notification delivery policies and enabled coverage; needs delivery execution and user preference editing. |
| Import/export | Partial | Enterprise route renders import/export jobs, webhooks, templates, and governance risk scoring; needs CSV/Jira/JSON execution flows. |

## Phase 1 Slice 1 Status

Implemented:

- Split the production app into `production-management`, `production-planning`,
  `production-execution`, `production-timeline`, and `production-delivery`
  plugin groups.
- Added `/planning` as the first planning surface for backlog grooming, sprint
  candidates, review pressure, and milestone anchors.
- Added frontend contracts for epics, sprints, issue dependencies, issue events,
  saved filters, and project management plans.
- Added frontend API and hook boundaries for future
  `/api/project-management/*` endpoints.
- Added `database/migrations/003_project_management_planning.sql` for Phase 1
  epics, sprints, dependencies, events, issue ranking, story points, and saved
  filters.
- Extended UT/IT regression scripts to cover the new plugin groups, route,
  contracts, hooks, and migration.

Verification:

- `pnpm run test:ut` passes.
- `pnpm run test:it` passes.
- `pnpm run test:all` passes.
- `pnpm run type-check` is blocked until local frontend dependencies install
  `tsc`; `pnpm install` timed out in this workspace and should be handled as a
  Phase 0 environment task.

## Phase 1 Slice 2 Status

Implemented:

- Added backend project management models for sprint status, dependency type,
  issue event type, epics, sprints, dependencies, events, saved filters, and
  aggregate plans.
- Added `ProjectManagementRepository` for listing/creating epics, sprints, and
  dependencies, listing events, and collecting backlog/active sprint issue
  summaries.
- Added `ProjectManagementService` to assemble `/api/project-management/plan`.
- Added `ProjectManagementHandler` endpoints:
  `/api/project-management/plan`, `/epics`, `/sprints`, `/dependencies`, and
  `/events`.
- Wired the new service into `AppState` and registered the routes under the
  production route set.
- Extended UT/IT regression scripts to cover backend model, repository, service,
  handler, route registration, and AppState wiring.

Verification:

- `pnpm run test:ut` passes.
- `pnpm run test:it` passes.
- `cargo +1.91.1-x86_64-pc-windows-msvc check --tests --jobs 1 --message-format short` passes with existing unused-code warnings.

## Phase 2-5 Horizontal Productization Slice Status

Implemented:

- Added `production-reporting`, `production-workflow`, and
  `production-enterprise` plugin groups, with route plugins for `/gantt`,
  `/calendar`, `/reports`, `/workflow`, `/automation`, and `/enterprise`.
- Added product surfaces for Gantt, calendar, reports, workflow, automation,
  and enterprise controls, all wired through the production plugin index and
  App Router adapters.
- Added frontend API and React Query hooks for:
  `/api/project-management/gantt`, `/calendar`, `/reports`, `/workflow`,
  `/automation`, and `/enterprise`.
- Added backend service and handler endpoints that assemble productization
  snapshots from the planning plan and expose workflow, automation, and
  enterprise catalogs.
- Added `database/migrations/004_project_management_productization.sql` for
  schedule baselines, calendar events, report snapshots, dashboard widgets,
  workflow definitions/transitions, automation rules/runs, roles,
  notifications, import/export jobs, webhooks, and templates.
- Extended UT/IT regression scripts to cover the final plugin groups, pages,
  routes, API contracts, hooks, migrations, backend handlers, services, and
  route registration.

Verification:

- `pnpm run test:ut` passes.
- `pnpm run test:it` passes.
- `pnpm run test:all` passes.
- `pnpm run type-check` passes after restoring frontend dependencies with
  `pnpm install`.
- `pnpm run build` passes with local non-standalone output; Docker builds keep
  standalone output through `NEXT_OUTPUT_MODE=standalone`.
- `pnpm run test:smoke` passes and validates live data lake storage access.
- `cargo +1.91.1-x86_64-pc-windows-msvc check --tests --jobs 1 --message-format short`
  passes with existing unused-code warnings.
- `cargo +1.91.1-x86_64-pc-windows-msvc test management_intelligence_endpoint_returns_contract --jobs 1 --message-format short`
  passes.
- Full backend `cargo test --jobs 1 --message-format short` now passes after
  dependency/build cache warm-up; earlier five-minute timeout was a local
  cold-cache runtime issue rather than a failing test.

## Issue Core Loop Status

Implemented:

- Extended issue contracts with Epic/Sprint planning fields, story points, and
  rank keys so board, planning, Gantt, and reports can share the same work item
  identity.
- Added issue comment listing and issue work logs to complete the daily Jira-like
  collaboration loop.
- Added soft-delete support for issues with audit logging.
- Added `database/migrations/005_issue_core_loop.sql` for work logs and
  idempotent planning-field indexes.
- Wired backend routes for:
  `/api/issues/{id}/comments`, `/api/issues/{id}/work-logs`, and
  `DELETE /api/issues/{id}`.
- Added frontend API/hook coverage for issue comments, work logs, update, and
  delete.
- Upgraded the issue detail page with editable core fields, comments, work logs,
  and delete action. Brief creation now captures story points.
- Extended UT/IT regression scripts so the issue core loop remains covered.

Verification:

- `pnpm run test:ut` passes.
- `pnpm run test:it` passes.
- `pnpm run test:all` passes.
- `pnpm run type-check` passes.
- `pnpm run build` passes.
- `pnpm run test:smoke` passes and validates live data lake storage access.
- `cargo +1.91.1-x86_64-pc-windows-msvc check --tests --jobs 1 --message-format short`
  passes with existing unused-code warnings.
- `cargo +1.91.1-x86_64-pc-windows-msvc test --jobs 1 --message-format short`
  passes with the existing management contract test.

## Board Planning Deepening Slice Status

Implemented:

- Added a pure frontend board planning model for WIP limit state, column story
  points, priority swimlanes, review pressure, and risk queue ordering.
- Upgraded `/board` with product panels for Board Health, Swimlanes, and Board
  Risk Queue while keeping the existing drag-to-transition behavior.
- Added `scripts/board-planning-model.test.mjs` and wired it into
  `pnpm run test:ut`.
- Extended browser-path, integration, and Playwright coverage so the board
  cannot regress to a simple status-column placeholder.

Verification:

- `pnpm run test:board-planning-model` covers WIP state, swimlane risk counts,
  review pressure, total story points, and risk ordering.
- `pnpm run test:all` includes the board planning model unit test plus IT,
  regression, and browser-path contracts.

## Issue Evidence Deepening Slice Status

Implemented:

- Added a pure frontend issue evidence model for readiness scoring, checklist
  gaps, data lake evidence links, and LangGraph recommendation proposals.
- Upgraded `/issues/[id]` with Evidence Readiness, Data Lake Evidence, and
  LangGraph Recommendations panels derived from linked assets, comments,
  status history, QA state, and priority.
- Added an Attach Evidence form on `/issues/[id]` that posts an existing data
  lake asset ID to `/api/issues/{id}/attach-asset`, supports reference,
  submission, and dependency link types, and refreshes issue evidence queries.
- Added `scripts/issue-evidence-model.test.mjs` and wired it into
  `pnpm run test:ut`.
- Added `scripts/issue-asset-attach-contract.test.mjs` to keep the API client,
  hook, page controls, mock API, and Playwright click path aligned.
- Extended browser-path, integration, and Playwright coverage so issue detail
  keeps exposing AI/data-lake evidence context.

Verification:

- `pnpm run test:issue-evidence-model` covers readiness, risk state, missing
  evidence counts, data lake link generation, and LangGraph suggestions.
- `pnpm run test:issue-asset-attach` covers attach-asset API/hook/page/E2E
  contract wiring.
- `pnpm run test:all` includes the issue evidence model unit test plus IT,
  regression, and browser-path contracts.

## Enterprise Governance Deepening Slice Status

Implemented:

- Added a pure frontend enterprise governance model for permission coverage,
  required CI pass rate, notification coverage, import/export readiness,
  active webhook coverage, audit drilldowns, and governance risk scoring.
- Upgraded `/enterprise` with Governance Readiness and Governance Risks panels
  above the existing roles, notifications, import/export, webhook, template,
  audit, and CI controls.
- Added `scripts/enterprise-governance-model.test.mjs` and wired it into
  `pnpm run test:ut`.
- Extended browser-path, integration, and Playwright coverage so enterprise
  governance cannot regress to static administration lists.

Verification:

- `pnpm run test:enterprise-governance-model` covers permission de-duplication,
  CI gate scoring, disabled notification risks, guarded webhook risks, audit
  retention risks, and readiness score.
- `pnpm run test:all` includes the enterprise governance model unit test plus
  IT, regression, and browser-path contracts.

## Phase 5 Enterprise Productization Slice Status

Implemented:

- Upgraded `/api/project-management/enterprise` from simple string arrays to a
  structured enterprise catalog covering roles, permissions, notification
  policies, import/export jobs, webhooks, templates, CI gates, and audit
  retention/drill-down policy.
- Added frontend enterprise contracts for role controls, notification controls,
  import/export controls, webhook controls, templates, CI gates, and audit
  policy.
- Upgraded `/enterprise` into a structured productization console with metrics,
  role/permission cards, notification and audit panels, import/export jobs,
  webhook health, project templates, and CI gate status.
- Extended regression coverage so the final phase cannot regress back to a
  simple placeholder list.
- Added a selected browser-path product journey gate that verifies the plugin
  registry, Next App Router adapters, and implementation hooks for home,
  planning, board, issue detail, Gantt, calendar, reports, workflow, automation,
  enterprise, delivery, asset library, and upload routes.
- Hardened the Next build configuration so Windows/pnpm optional SWC package
  cache noise does not produce false-positive webpack warnings in clean builds.
- Added Playwright E2E automation with real Chromium clicks, deterministic API
  mocks, automatic Next server startup, always-on trace retention, HTML reports,
  and product journeys for project management, Gantt, workflow, automation,
  reports, enterprise, asset library, and upload.
- Added a Playwright artifact contract so E2E regression fails when the JSON
  result, trace zip attachments, or HTML report are not retained.

Verification:

- `pnpm run type-check` passes.
- `pnpm run test:ut` passes.
- `pnpm run test:it` passes.
- `pnpm run test:all` passes.
- `pnpm run test:browser-paths` passes.
- `pnpm run test:e2e` passes, clicks the browser journeys, and verifies retained
  traces under `frontend/test-results/playwright/` plus
  `frontend/playwright-report/index.html`.
- `pnpm run build` passes.
- `pnpm run test:smoke` passes.
- `cargo +1.91.1-x86_64-pc-windows-msvc check --tests --jobs 1 --message-format short`
  passes.

## Gantt Deepening Slice Status

Implemented:

- Added a pure frontend Gantt model for date normalization, duration inference,
  blocking dependency edge normalization, critical path scoring, timeline
  marker layout, and schedule risk classification.
- Upgraded `/gantt` to render a model-backed schedule timeline, critical path
  sequence, dependency map, and risk queue instead of index-based placeholder
  bars.
- Extended the Gantt API payload with issue priority, start date, and story
  points so the frontend timeline uses real planning inputs.
- Added `scripts/gantt-model.test.mjs` and wired it into `pnpm run test:ut`.
- Extended regression and selected browser-path gates to cover the Gantt model,
  page rendering contract, and backend payload fields.

Verification:

- `pnpm run test:gantt-model` covers blocking edge orientation, critical path,
  blocked risk, unscheduled risk, and date range formatting.
- `pnpm run test:ut` includes the Gantt model unit test.
- `pnpm run test:all` passes with the Gantt model test, IT regression,
  regression script, and selected browser-path gate.
- `pnpm run type-check` passes.
- `pnpm run build` passes without webpack cache warnings.
- `pnpm run test:smoke` passes and validates data lake storage access.
- `cargo +1.91.1-x86_64-pc-windows-msvc check --tests --jobs 1 --message-format short`
  passes.
- `cargo +1.91.1-x86_64-pc-windows-msvc test --jobs 1 --message-format short`
  passes.

## Workflow and Automation Deepening Slice Status

Implemented:

- Upgraded `/api/project-management/workflow` from status/guard string lists to
  a structured transition catalog with from/to statuses, guards, validators,
  SLA hours, approval flags, data lake evidence flags, and approval policy.
- Upgraded `/api/project-management/automation` from string rule names to
  structured automation rules plus a LangGraph runbook for context collection,
  evidence retrieval, and guarded action proposal.
- Added a pure frontend workflow/automation model for transition coverage,
  missing edge detection, evidence gate counts, approval gate counts, data lake
  rule detection, and LangGraph coverage.
- Atomized workflow/automation rendering into shared primitives for transition
  designer, policy panel, rule cards, and execution plan.
- Extended Playwright product journeys to click Workflow and Automation pages,
  not only Gantt, Reports, Enterprise, Library, and Upload.
- Added `scripts/workflow-automation-model.test.mjs` and wired it into
  `pnpm run test:ut`.

Verification:

- `pnpm run test:workflow-automation-model` covers guarded workflow coverage,
  missing transition detection, approval gates, data lake rule detection, and
  LangGraph coverage.
- `pnpm run test:ut` includes the workflow automation model unit test.
- `pnpm run test:it` covers the structured frontend/backend contract.
- `pnpm run test:browser-paths` covers the new Workflow and Automation page
  implementation contracts.

## Reports Analytics Deepening Slice Status

Implemented:

- Upgraded `/api/project-management/reports` from simple counters to a
  structured analytics snapshot covering burndown points, velocity points,
  cumulative flow points, cycle-time metrics, SLA metrics, and delivery
  readiness risk counts.
- Added a pure frontend reports model for KPI derivation, completion
  percentage, cumulative-flow segment percentages, velocity predictability,
  SLA display, and readiness status classification.
- Atomized report rendering into dashboard primitives for burndown trend,
  cumulative flow, velocity, cycle/SLA, and delivery readiness panels.
- Extended Playwright product journeys to verify Burndown Trend and
  Cycle Time & SLA panels on `/reports`.
- Added `scripts/report-analytics-model.test.mjs` and wired it into
  `pnpm run test:ut`.

Verification:

- `pnpm run test:report-analytics-model` covers KPI derivation, flow
  percentages, velocity predictability, SLA metrics, and readiness status.
- `pnpm run test:all` includes the report analytics model unit test plus IT,
  regression, and browser-path contracts.

## Calendar Workload Deepening Slice Status

Implemented:

- Upgraded `/api/project-management/calendar` from a simple event list to a
  structured snapshot with calendar lanes, workload-by-date metrics, event
  ownership, lane classification, and schedule risk classification.
- Added a pure frontend calendar workload model for event sorting, lane risk
  summaries, undated work tracking, upcoming work, and risk queue assembly.
- Atomized calendar rendering into reusable lane, workload heatmap, and risk
  queue primitives.
- Extended Playwright product journeys to click `/calendar` and verify the
  workload and risk panels.
- Added `scripts/calendar-workload-model.test.mjs` and wired it into
  `pnpm run test:ut`.

Verification:

- `pnpm run test:calendar-workload-model` covers event sorting, lane risk
  counts, undated issue counts, workload metrics, and empty-state fallback.
- `pnpm run test:all` includes the calendar workload model unit test plus IT,
  regression, and browser-path contracts.

## Target Plugin Architecture

The product should keep the existing hierarchy:

`ProductArchitecture -> PluginApp -> PluginGroup -> Plugin -> PluginRoute`

Each `Plugin` should also keep an explicit `PluginManifest` for permissions,
dependencies, lifecycle, feature flags, and backend/data-lake scopes. Each
`PluginApp` should keep a policy boundary for enabled/disabled plugins and
permission allowlists so multiple apps can safely reuse the same plugin groups
without exposing unintended routes or write capabilities.

Recommended production app split:

| Plugin Group | Scope |
| --- | --- |
| `production.management` | Management dashboard, health, portfolio status, project summaries. |
| `production.planning` | Backlog, epic/story/task hierarchy, sprint planning, capacity. |
| `production.execution` | Kanban board, issue detail, comments, attachments, work logs. |
| `production.timeline` | Gantt, milestone timeline, dependency graph, release roadmap. |
| `production.calendar` | Sprint/release/review calendar and workload schedule. |
| `production.reports` | Burndown, velocity, cumulative flow, cycle time, SLA, delivery readiness. |
| `production.workflow` | Workflow/status configuration, transition guards, approval policy. |
| `production.automation` | Rule editor, LangGraph actions, AI suggestions, execution audit. |
| `production.data-lake` | Evidence retrieval, asset lineage, vector/search/graph context, storage health. |

## Phase Plan

### Phase 0 - Stabilize Test and Runtime Gates

Goal: make the existing management foundation reliably testable before adding
larger product surfaces.

Deliverables:

- Repair local frontend dependency state so `pnpm run type-check` is reliable.
- Rebuild and redeploy the backend image that contains
  `/api/management/intelligence`.
- Promote `SMOKE_REQUIRE_MANAGEMENT=1 pnpm run test:smoke` once the deployed
  backend includes the management endpoint.
- Keep `pnpm run test:ut`, `pnpm run test:it`, `pnpm run test:regression`, and
  `pnpm run test:smoke` as regression gates.

Acceptance:

- `pnpm run test:all` passes.
- `pnpm run type-check` passes.
- Live smoke validates backend health, management intelligence, upload, metadata
  read/search, MinIO object read, and cleanup.

### Phase 1 - Core Jira-Style Project Management

Goal: provide the core data model and UX that Jira-like workflows depend on.

Backend:

- Add project management tables or API models for epics, stories, tasks, bugs,
  sub-tasks, sprints, components, labels, priorities, estimates, assignees, and
  issue links.
- Add CRUD endpoints for projects, boards, issues, epics, sprints, comments,
  attachments, and work logs.
- Add ranking and saved-filter support.

Frontend:

- Add backlog planning page with epic/story hierarchy and sprint assignment.
- Upgrade board interactions with persistent drag/drop status changes.
- Add issue edit drawer/page with comments, attachments, history, asset links,
  estimates, and AI/data-lake evidence.
- Add bulk issue edit and saved filters.

Tests:

- Unit tests for route registry, issue hierarchy transforms, ranking, and filter
  serialization.
- Integration tests for issue CRUD, sprint planning, board status transition,
  and evidence references.

### Phase 2 - Gantt, Roadmap, Calendar, and Dependencies

Goal: make schedule management product-grade rather than a simple milestone
timeline.

Backend:

- Add dependency records, schedule baselines, planned/actual dates, release
  versions, and calendar event APIs.
- Add conflict detection for blocked tasks, overdue dependencies, and milestone
  drift.

Frontend:

- Add a Gantt route with zoom levels, task bars, dependency lines, milestone
  markers, critical path highlighting, and drag scheduling.
- Add roadmap view grouped by project, epic, release, and vendor delivery.
- Add calendar view for sprints, releases, reviews, due dates, and workload.
- Add dependency graph drill-down linked to data lake lineage.

Tests:

- Unit tests for date math, dependency layout, critical path calculation, and
  schedule conflict rules.
- Integration tests for creating dependencies, moving schedule dates, and seeing
  Gantt/calendar updates.
- Smoke path for opening the Gantt route and verifying non-empty schedule data.

### Phase 3 - Reports, Dashboards, and Analytics

Goal: support project lead and producer decisions with measurable delivery
signals.

Backend:

- Add report endpoints for burndown, velocity, cumulative flow, cycle time,
  aging, blocked work, SLA, review load, and delivery readiness.
- Add aggregation jobs that can read issue events, asset events, review events,
  and data lake lineage.

Frontend:

- Add configurable dashboard widgets.
- Add reports app with drill-down tables and exportable charts.
- Add project health scoring that cites issue, asset, review, and delivery
  evidence.

Tests:

- Unit tests for metric calculations and edge cases.
- Integration tests for report API contracts.
- Regression snapshots for representative dashboard/report payloads.

### Phase 4 - Workflow, Automation, LangGraph, and AI

Goal: make AI and automation controlled, auditable, and useful in daily project
management.

Backend:

- Add workflow configuration for statuses, transitions, validators, guards, and
  approval requirements.
- Add automation rules with triggers, conditions, actions, execution history,
  and rollback metadata.
- Add LangGraph orchestration for recommendations, triage, risk detection,
  missing-evidence checks, and sprint planning suggestions.

Frontend:

- Add workflow designer for status transitions and approval policy.
- Add automation rule editor.
- Add AI recommendation queue with accept/reject, rationale, evidence links, and
  audit trail.

Tests:

- Unit tests for workflow transition validation and automation rule evaluation.
- Integration tests for LangGraph proposal generation, human approval, action
  execution, and audit record creation.
- Safety tests that ensure AI cannot mutate project state without configured
  permission and approval.

### Phase 5 - Enterprise Productization

Goal: close product-grade gaps for team adoption and long-term operations.

Deliverables:

- Project roles, permissions, audit UI, notification preferences, and webhooks.
- CSV/Jira import, JSON export, template projects, and board templates.
- Performance tests for large projects, large boards, large Gantt schedules, and
  high-volume data lake evidence retrieval.
- CI gates for unit, integration, smoke, type-check, formatting, and selected
  end-to-end browser paths.
- Operator docs for local Docker, Kubernetes, data lake health, backup/restore,
  and regression test execution.

Acceptance:

- Main user journeys pass in automated tests: create project, plan sprint, move
  issue through workflow, upload/link asset evidence, approve review, inspect
  Gantt, read reports, run automation with audit, and export project data.
- Data lake smoke stays green under live Docker/Kubernetes deployment.

## Suggested Next Deepening Slices

The plugin hierarchy and final-phase architecture are now in place. Continue by
deepening one product-grade journey at a time:

- Sprint planning: backlog ranking persistence, sprint assignment UX,
  committed/completed point rollups, active/completed sprint state changes, and
  saved filter management.
- Scheduling: Gantt dependency layout, critical path, date dragging, baseline
  capture, conflict detection, and calendar event CRUD.
- Reporting: burndown, velocity, cumulative flow, cycle time, aging, SLA, and
  delivery readiness calculations from issue/event/data-lake evidence.
- Automation: workflow designer, automation rule editor, LangGraph execution,
  human approval gates, and audited action results.
- Enterprise: project roles, permissions UI, notifications, CSV/Jira import,
  JSON export, webhooks, templates, and browser-path E2E gates.
