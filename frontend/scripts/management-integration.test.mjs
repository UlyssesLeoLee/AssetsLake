/*
```cypher
CREATE
  (f:File {name: "management-integration.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/management-integration.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "expectIncludes", type: "function", language: "javascript", signature: "function expectIncludes(source, value, label)"}),
  (fn3:Function {name: "expectMatches", type: "function", language: "javascript", signature: "function expectMatches(source, pattern, label)"}),
  (fn4:Function {name: "management integration contract test", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REPO_ROOT", type: "variable"}),
  (v3:Variable {name: "CONTRACT_ENDPOINT", type: "variable"}),
  (v4:Variable {name: "FILES", type: "variable"}),
  (v5:Variable {name: "registry", type: "variable"}),
  (v6:Variable {name: "managementPage", type: "variable"}),
  (v7:Variable {name: "backendHandler", type: "variable"}),
  (v8:Variable {name: "atomicAdvancedPages", type: "variable"}),
  (v9:Variable {name: "productionPrimitives", type: "variable"}),
  (v10:Variable {name: "projectManagementPrimitives", type: "variable"}),
  (v11:Variable {name: "projectManagementApi", type: "variable"}),
  (v12:Variable {name: "packageJson", type: "variable"}),
  (v13:Variable {name: "browserPathsTest", type: "variable"}),
  (v14:Variable {name: "nextConfig", type: "variable"}),
  (v15:Variable {name: "ganttModel", type: "variable"}),
  (v16:Variable {name: "ganttModelTest", type: "variable"}),
  (v17:Variable {name: "playwrightConfig", type: "variable"}),
  (v18:Variable {name: "playwrightSpec", type: "variable"}),
  (v19:Variable {name: "playwrightMocks", type: "variable"}),
  (v20:Variable {name: "playwrightDocs", type: "variable"}),
  (v21:Variable {name: "playwrightArtifactsTest", type: "variable"}),
  (v22:Variable {name: "workflowAutomationModel", type: "variable"}),
  (v23:Variable {name: "workflowAutomationModelTest", type: "variable"}),
  (v24:Variable {name: "reportAnalyticsModel", type: "variable"}),
  (v25:Variable {name: "reportAnalyticsModelTest", type: "variable"}),
  (v26:Variable {name: "calendarWorkloadModel", type: "variable"}),
  (v27:Variable {name: "calendarWorkloadModelTest", type: "variable"}),
  (v28:Variable {name: "boardPlanningModel", type: "variable"}),
  (v29:Variable {name: "boardPlanningModelTest", type: "variable"}),
  (v30:Variable {name: "boardPage", type: "variable"}),
  (v31:Variable {name: "issueEvidenceModel", type: "variable"}),
  (v32:Variable {name: "issueEvidenceModelTest", type: "variable"}),
  (v33:Variable {name: "issueDetailPage", type: "variable"}),
  (v34:Variable {name: "enterpriseGovernanceModel", type: "variable"}),
  (v35:Variable {name: "enterpriseGovernanceModelTest", type: "variable"}),
  (v36:Variable {name: "issueAssetAttachContractTest", type: "variable"}),
  (v37:Variable {name: "pluginValidation", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v4),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v3),
  (fn4)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn3),
  (fn4)-[:USES]->(v4),
  (fn4)-[:USES]->(v5),
  (fn4)-[:USES]->(v6),
  (fn4)-[:USES]->(v7),
  (fn4)-[:USES]->(v8),
  (fn4)-[:USES]->(v9),
  (fn4)-[:USES]->(v10),
  (fn4)-[:USES]->(v11),
  (fn4)-[:USES]->(v12),
  (fn4)-[:USES]->(v13),
  (fn4)-[:USES]->(v14),
  (fn4)-[:USES]->(v15),
  (fn4)-[:USES]->(v16),
  (fn4)-[:USES]->(v17),
  (fn4)-[:USES]->(v18),
  (fn4)-[:USES]->(v19),
  (fn4)-[:USES]->(v20),
  (fn4)-[:USES]->(v21),
  (fn4)-[:USES]->(v22),
  (fn4)-[:USES]->(v23),
  (fn4)-[:USES]->(v24),
  (fn4)-[:USES]->(v25),
  (fn4)-[:USES]->(v26),
  (fn4)-[:USES]->(v27),
  (fn4)-[:USES]->(v28),
  (fn4)-[:USES]->(v29),
  (fn4)-[:USES]->(v30),
  (fn4)-[:USES]->(v31),
  (fn4)-[:USES]->(v32),
  (fn4)-[:USES]->(v33),
  (fn4)-[:USES]->(v34),
  (fn4)-[:USES]->(v35),
  (fn4)-[:USES]->(v36),
  (fn4)-[:USES]->(v37);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(FRONTEND_ROOT, '..');
const CONTRACT_ENDPOINT = '/api/management/intelligence';

const FILES = {
  registry: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'registry.ts'),
  packageJson: join(FRONTEND_ROOT, 'package.json'),
  nextConfig: join(FRONTEND_ROOT, 'next.config.mjs'),
  playwrightConfig: join(FRONTEND_ROOT, 'playwright.config.ts'),
  playwrightSpec: join(FRONTEND_ROOT, 'e2e', 'product-journey.spec.ts'),
  playwrightMocks: join(FRONTEND_ROOT, 'e2e', 'fixtures', 'apiMocks.ts'),
  playwrightDocs: join(REPO_ROOT, 'docs', 'playwright-e2e.md'),
  playwrightArtifactsTest: join(FRONTEND_ROOT, 'scripts', 'playwright-artifacts.test.mjs'),
  browserPathsTest: join(FRONTEND_ROOT, 'scripts', 'browser-paths.test.mjs'),
  ganttModelTest: join(FRONTEND_ROOT, 'scripts', 'gantt-model.test.mjs'),
  workflowAutomationModelTest: join(FRONTEND_ROOT, 'scripts', 'workflow-automation-model.test.mjs'),
  reportAnalyticsModelTest: join(FRONTEND_ROOT, 'scripts', 'report-analytics-model.test.mjs'),
  calendarWorkloadModelTest: join(FRONTEND_ROOT, 'scripts', 'calendar-workload-model.test.mjs'),
  boardPlanningModelTest: join(FRONTEND_ROOT, 'scripts', 'board-planning-model.test.mjs'),
  issueEvidenceModelTest: join(FRONTEND_ROOT, 'scripts', 'issue-evidence-model.test.mjs'),
  enterpriseGovernanceModelTest: join(FRONTEND_ROOT, 'scripts', 'enterprise-governance-model.test.mjs'),
  issueAssetAttachContractTest: join(FRONTEND_ROOT, 'scripts', 'issue-asset-attach-contract.test.mjs'),
  pluginTypes: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'types.ts'),
  pluginValidation: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'validation.ts'),
  managementRoute: join(FRONTEND_ROOT, 'src', 'app', 'management', 'page.tsx'),
  planningRoute: join(FRONTEND_ROOT, 'src', 'app', 'planning', 'page.tsx'),
  ganttRoute: join(FRONTEND_ROOT, 'src', 'app', 'gantt', 'page.tsx'),
  calendarRoute: join(FRONTEND_ROOT, 'src', 'app', 'calendar', 'page.tsx'),
  reportsRoute: join(FRONTEND_ROOT, 'src', 'app', 'reports', 'page.tsx'),
  workflowRoute: join(FRONTEND_ROOT, 'src', 'app', 'workflow', 'page.tsx'),
  automationRoute: join(FRONTEND_ROOT, 'src', 'app', 'automation', 'page.tsx'),
  enterpriseRoute: join(FRONTEND_ROOT, 'src', 'app', 'enterprise', 'page.tsx'),
  productionIndex: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'index.ts'),
  managementPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ManagementConsolePage.tsx'),
  planningPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'PlanningPage.tsx'),
  advancedProjectManagementPages: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'AdvancedProjectManagementPages.tsx'),
  productionPrimitives: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ProductionPluginPrimitives.tsx'),
  projectManagementPrimitives: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ProjectManagementPluginPrimitives.tsx'),
  ganttModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ganttModel.ts'),
  workflowAutomationModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'workflowAutomationModel.ts'),
  reportAnalyticsModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'reportAnalyticsModel.ts'),
  calendarWorkloadModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'calendarWorkloadModel.ts'),
  boardPlanningModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'boardPlanningModel.ts'),
  ganttPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'GanttPage.tsx'),
  boardPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'KanbanBoardPage.tsx'),
  issueDetailPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'IssueDetailPage.tsx'),
  issueEvidenceModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'issueEvidenceModel.ts'),
  enterpriseGovernanceModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'enterpriseGovernanceModel.ts'),
  calendarPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'CalendarPage.tsx'),
  reportsPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ReportsPage.tsx'),
  workflowPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'WorkflowPage.tsx'),
  automationPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'AutomationPage.tsx'),
  enterprisePage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'EnterpriseAdminPage.tsx'),
  productionTypes: join(FRONTEND_ROOT, 'src', 'types', 'production.ts'),
  projectManagementTypes: join(FRONTEND_ROOT, 'src', 'types', 'projectManagement.ts'),
  productionApi: join(FRONTEND_ROOT, 'src', 'lib', 'productionApi.ts'),
  projectManagementApi: join(FRONTEND_ROOT, 'src', 'lib', 'projectManagementApi.ts'),
  productionHooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts'),
  projectManagementHooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProjectManagement.ts'),
  backendHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'management_handler.rs'),
  backendProjectManagementHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'project_management_handler.rs'),
  backendProjectManagementModel: join(REPO_ROOT, 'backend', 'src', 'models', 'project_management.rs'),
  backendProjectManagementRepository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'project_management_repository.rs'),
  backendProjectManagementService: join(REPO_ROOT, 'backend', 'src', 'services', 'project_management_service.rs'),
  backendHandlersMod: join(REPO_ROOT, 'backend', 'src', 'handlers', 'mod.rs'),
  backendModelsMod: join(REPO_ROOT, 'backend', 'src', 'models', 'mod.rs'),
  backendRepositoriesMod: join(REPO_ROOT, 'backend', 'src', 'repositories', 'mod.rs'),
  backendServicesMod: join(REPO_ROOT, 'backend', 'src', 'services', 'mod.rs'),
  backendRoutes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  backendMain: join(REPO_ROOT, 'backend', 'src', 'main.rs'),
  planningMigration: join(REPO_ROOT, 'database', 'migrations', '003_project_management_planning.sql'),
  productizationMigration: join(REPO_ROOT, 'database', 'migrations', '004_project_management_productization.sql'),
  issueCoreMigration: join(REPO_ROOT, 'database', 'migrations', '005_issue_core_loop.sql'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function expectIncludes(source, value, label) {
  assert.ok(source.includes(value), label);
}

function expectMatches(source, pattern, label) {
  assert.match(source, pattern, label);
}

test('management integration contract test', () => {
  const registry = readText(FILES.registry);
  const packageJson = readText(FILES.packageJson);
  const nextConfig = readText(FILES.nextConfig);
  const playwrightConfig = readText(FILES.playwrightConfig);
  const playwrightSpec = readText(FILES.playwrightSpec);
  const playwrightMocks = readText(FILES.playwrightMocks);
  const playwrightDocs = readText(FILES.playwrightDocs);
  const playwrightArtifactsTest = readText(FILES.playwrightArtifactsTest);
  const browserPathsTest = readText(FILES.browserPathsTest);
  const ganttModelTest = readText(FILES.ganttModelTest);
  const workflowAutomationModelTest = readText(FILES.workflowAutomationModelTest);
  const reportAnalyticsModelTest = readText(FILES.reportAnalyticsModelTest);
  const calendarWorkloadModelTest = readText(FILES.calendarWorkloadModelTest);
  const boardPlanningModelTest = readText(FILES.boardPlanningModelTest);
  const issueEvidenceModelTest = readText(FILES.issueEvidenceModelTest);
  const enterpriseGovernanceModelTest = readText(FILES.enterpriseGovernanceModelTest);
  const issueAssetAttachContractTest = readText(FILES.issueAssetAttachContractTest);
  const pluginTypes = readText(FILES.pluginTypes);
  const pluginValidation = readText(FILES.pluginValidation);
  const managementRoute = readText(FILES.managementRoute);
  const planningRoute = readText(FILES.planningRoute);
  const ganttRoute = readText(FILES.ganttRoute);
  const calendarRoute = readText(FILES.calendarRoute);
  const reportsRoute = readText(FILES.reportsRoute);
  const workflowRoute = readText(FILES.workflowRoute);
  const automationRoute = readText(FILES.automationRoute);
  const enterpriseRoute = readText(FILES.enterpriseRoute);
  const productionIndex = readText(FILES.productionIndex);
  const managementPage = readText(FILES.managementPage);
  const planningPage = readText(FILES.planningPage);
  const advancedProjectManagementPages = readText(FILES.advancedProjectManagementPages);
  const productionPrimitives = readText(FILES.productionPrimitives);
  const projectManagementPrimitives = readText(FILES.projectManagementPrimitives);
  const ganttModel = readText(FILES.ganttModel);
  const workflowAutomationModel = readText(FILES.workflowAutomationModel);
  const reportAnalyticsModel = readText(FILES.reportAnalyticsModel);
  const calendarWorkloadModel = readText(FILES.calendarWorkloadModel);
  const boardPlanningModel = readText(FILES.boardPlanningModel);
  const boardPage = readText(FILES.boardPage);
  const issueDetailPage = readText(FILES.issueDetailPage);
  const issueEvidenceModel = readText(FILES.issueEvidenceModel);
  const enterpriseGovernanceModel = readText(FILES.enterpriseGovernanceModel);
  const atomicAdvancedPages = {
    GanttPage: readText(FILES.ganttPage),
    CalendarPage: readText(FILES.calendarPage),
    ReportsPage: readText(FILES.reportsPage),
    WorkflowPage: readText(FILES.workflowPage),
    AutomationPage: readText(FILES.automationPage),
    EnterpriseAdminPage: readText(FILES.enterprisePage),
  };
  const productionTypes = readText(FILES.productionTypes);
  const projectManagementTypes = readText(FILES.projectManagementTypes);
  const productionApi = readText(FILES.productionApi);
  const projectManagementApi = readText(FILES.projectManagementApi);
  const productionHooks = readText(FILES.productionHooks);
  const projectManagementHooks = readText(FILES.projectManagementHooks);
  const backendHandler = readText(FILES.backendHandler);
  const backendProjectManagementHandler = readText(FILES.backendProjectManagementHandler);
  const backendProjectManagementModel = readText(FILES.backendProjectManagementModel);
  const backendProjectManagementRepository = readText(FILES.backendProjectManagementRepository);
  const backendProjectManagementService = readText(FILES.backendProjectManagementService);
  const backendHandlersMod = readText(FILES.backendHandlersMod);
  const backendModelsMod = readText(FILES.backendModelsMod);
  const backendRepositoriesMod = readText(FILES.backendRepositoriesMod);
  const backendServicesMod = readText(FILES.backendServicesMod);
  const backendRoutes = readText(FILES.backendRoutes);
  const backendMain = readText(FILES.backendMain);
  const planningMigration = readText(FILES.planningMigration);
  const productizationMigration = readText(FILES.productizationMigration);
  const issueCoreMigration = readText(FILES.issueCoreMigration);

  expectIncludes(pluginTypes, "'production.management'", 'plugin id type includes management');
  expectIncludes(pluginTypes, "'production.planning'", 'plugin id type includes planning');
  expectIncludes(pluginTypes, "'production.ai-orchestration'", 'plugin id type includes AI orchestration');
  expectIncludes(pluginTypes, "'production.data-lake'", 'plugin id type includes data lake');
  expectIncludes(pluginTypes, "'production-planning'", 'plugin group type includes planning');
  expectIncludes(pluginTypes, "'production-timeline'", 'plugin group type includes timeline');
  expectIncludes(pluginTypes, "'production-reporting'", 'plugin group type includes reporting');
  expectIncludes(pluginTypes, "'production-workflow'", 'plugin group type includes workflow');
  expectIncludes(pluginTypes, "'production-enterprise'", 'plugin group type includes enterprise');
  for (const pluginId of [
    "'production.gantt'",
    "'production.calendar'",
    "'production.reports'",
    "'production.workflow'",
    "'production.automation'",
    "'production.enterprise'",
  ]) {
    expectIncludes(pluginTypes, pluginId, `plugin id type includes ${pluginId}`);
  }
  expectMatches(
    pluginTypes,
    /PluginPermission[\s\S]*PluginLifecycle[\s\S]*interface PluginManifest[\s\S]*interface PluginAppPolicy[\s\S]*allowedPermissions/,
    'plugin type system exposes manifest permissions, lifecycle, and app policy'
  );
  expectMatches(
    pluginTypes,
    /isPluginEnabledForApp[\s\S]*enabledPlugins[\s\S]*disabledPlugins[\s\S]*allowedPermissions/,
    'plugin type helpers enforce app-level plugin policy'
  );

  expectIncludes(registry, "id: 'production.management'", 'registry exposes management plugin');
  expectIncludes(registry, "href: '/management'", 'registry exposes management route');
  expectIncludes(registry, "id: 'production-planning'", 'registry exposes planning plugin group');
  expectIncludes(registry, "id: 'production.planning'", 'registry exposes planning plugin');
  expectIncludes(registry, "href: '/planning'", 'registry exposes planning route');
  for (const route of ['/gantt', '/calendar', '/reports', '/workflow', '/automation', '/enterprise']) {
    expectIncludes(registry, `href: '${route}'`, `registry exposes ${route} route`);
  }
  expectIncludes(registry, "id: 'production.ai-orchestration'", 'registry exposes AI orchestration plugin');
  expectIncludes(registry, "id: 'production.data-lake'", 'registry exposes data lake plugin');
  expectMatches(registry, /apiScopes:\s*\[[^\]]*'langgraph'[^\]]*'ai'[^\]]*'data-lake'[^\]]*\]/, 'registry scopes include LangGraph, AI, and data lake');
  expectIncludes(registry, 'assertHealthyProductArchitecture', 'registry validates plugin architecture health');
  expectIncludes(registry, "id: 'production.board.detail'", 'registry assigns issue detail to the board plugin');
  expectMatches(
    registry,
    /manifest:\s*\{[\s\S]*permissions:[\s\S]*lifecycle:[\s\S]*backendScopes:/,
    'registry plugins declare manifest permissions, lifecycle, and backend scopes'
  );
  expectMatches(
    registry,
    /id: 'production-console'[\s\S]*policy:\s*\{[\s\S]*enabledPlugins:[\s\S]*allowedPermissions:[\s\S]*id: 'asset-console'[\s\S]*policy:\s*\{[\s\S]*enabledPlugins:[\s\S]*allowedPermissions:/,
    'registry apps declare isolation policies for production and asset consoles'
  );
  expectMatches(
    pluginValidation,
    /plugin\.dependency\.missing[\s\S]*app\.policy\.plugin\.unknown[\s\S]*plugin\.manifest\.required/,
    'plugin validator enforces dependency, policy, and manifest contracts'
  );
  expectIncludes(packageJson, '"test:browser-paths": "node --test scripts/browser-paths.test.mjs"', 'package scripts expose selected browser path gate');
  expectIncludes(packageJson, '"test:gantt-model": "node --test scripts/gantt-model.test.mjs"', 'package scripts expose Gantt model unit test');
  expectIncludes(packageJson, '"test:workflow-automation-model": "node --test scripts/workflow-automation-model.test.mjs"', 'package scripts expose workflow automation model unit test');
  expectIncludes(packageJson, '"test:report-analytics-model": "node --test scripts/report-analytics-model.test.mjs"', 'package scripts expose report analytics model unit test');
  expectIncludes(packageJson, '"test:calendar-workload-model": "node --test scripts/calendar-workload-model.test.mjs"', 'package scripts expose calendar workload model unit test');
  expectIncludes(packageJson, '"test:board-planning-model": "node --test scripts/board-planning-model.test.mjs"', 'package scripts expose board planning model unit test');
  expectIncludes(packageJson, '"test:issue-evidence-model": "node --test scripts/issue-evidence-model.test.mjs"', 'package scripts expose issue evidence model unit test');
  expectIncludes(packageJson, '"test:enterprise-governance-model": "node --test scripts/enterprise-governance-model.test.mjs"', 'package scripts expose enterprise governance model unit test');
  expectIncludes(packageJson, '"test:issue-asset-attach": "node --test scripts/issue-asset-attach-contract.test.mjs"', 'package scripts expose issue asset attach contract test');
  expectIncludes(packageJson, 'scripts/gantt-model.test.mjs', 'test:ut includes Gantt model unit test');
  expectIncludes(packageJson, 'scripts/workflow-automation-model.test.mjs', 'test:ut includes workflow automation model unit test');
  expectIncludes(packageJson, 'scripts/report-analytics-model.test.mjs', 'test:ut includes report analytics model unit test');
  expectIncludes(packageJson, 'scripts/calendar-workload-model.test.mjs', 'test:ut includes calendar workload model unit test');
  expectIncludes(packageJson, 'scripts/board-planning-model.test.mjs', 'test:ut includes board planning model unit test');
  expectIncludes(packageJson, 'scripts/issue-evidence-model.test.mjs', 'test:ut includes issue evidence model unit test');
  expectIncludes(packageJson, 'scripts/enterprise-governance-model.test.mjs', 'test:ut includes enterprise governance model unit test');
  expectIncludes(packageJson, 'scripts/issue-asset-attach-contract.test.mjs', 'test:ut includes issue asset attach contract test');
  expectIncludes(packageJson, 'pnpm run test:browser-paths', 'test:all includes selected browser path gate');
  expectIncludes(packageJson, '"test:e2e": "pnpm run test:e2e:run && pnpm run test:e2e:artifacts"', 'package scripts run Playwright and artifact contract');
  expectIncludes(packageJson, '"test:e2e:run": "playwright test"', 'package scripts expose raw Playwright run');
  expectIncludes(packageJson, '"test:e2e:artifacts": "node --test scripts/playwright-artifacts.test.mjs"', 'package scripts expose Playwright artifact contract');
  expectIncludes(packageJson, '"test:e2e:trace": "playwright test --trace on"', 'package scripts expose explicit Playwright trace run');
  expectIncludes(packageJson, '"test:e2e:report": "playwright show-report playwright-report"', 'package scripts expose Playwright report viewer');
  expectIncludes(packageJson, '"test:full":', 'package scripts expose full automatic test gate');
  expectIncludes(packageJson, '"@playwright/test"', 'package dev dependencies include Playwright test runner');
  expectIncludes(playwrightConfig, "mode: 'on'", 'Playwright config retains traces for every test');
  expectIncludes(playwrightConfig, 'screenshots: true', 'Playwright trace captures built-in screenshots');
  expectIncludes(playwrightConfig, "outputDir: './test-results/playwright'", 'Playwright config writes trace artifacts to stable output dir');
  expectIncludes(playwrightConfig, 'timeout: 120_000', 'Playwright config tolerates cold Next route compilation');
  expectIncludes(playwrightConfig, 'navigationTimeout: 60_000', 'Playwright config tolerates cold navigation compilation');
  expectIncludes(playwrightConfig, "'html'", 'Playwright config enables HTML report');
  expectIncludes(playwrightConfig, 'webServer', 'Playwright config starts the Next app automatically');
  expectIncludes(playwrightSpec, "test('clicks project management plugin journeys'", 'Playwright suite clicks project management journeys');
  expectIncludes(playwrightSpec, "test('clicks Gantt, calendar, workflow, automation, reports, enterprise, and asset library journeys'", 'Playwright suite clicks product surface journeys');
  expectIncludes(playwrightSpec, "test('uploads an asset through the browser flow'", 'Playwright suite clicks upload journey');
  expectIncludes(playwrightSpec, 'setInputFiles', 'Playwright upload journey sets a browser file input');
  expectIncludes(playwrightMocks, "page.route('**/api/**'", 'Playwright suite mocks API routes for deterministic browser traces');
  expectIncludes(playwrightMocks, '/api/project-management/gantt', 'Playwright API mock covers Gantt product endpoint');
  expectIncludes(playwrightMocks, '/api/assets/upload', 'Playwright API mock covers upload endpoint');
  expectIncludes(playwrightArtifactsTest, "test('playwright trace and report artifacts are retained'", 'Playwright artifact contract declares trace/report retention test');
  expectIncludes(playwrightArtifactsTest, 'playwright-results.json', 'Playwright artifact contract reads JSON test results');
  expectIncludes(playwrightArtifactsTest, "attachment.name === 'trace' && attachment.contentType === 'application/zip'", 'Playwright artifact contract validates trace zip attachments');
  expectIncludes(playwrightArtifactsTest, 'playwright-report', 'Playwright artifact contract validates HTML report output');
  expectIncludes(playwrightDocs, 'Trace Retention', 'Playwright docs explain trace retention');
  expectIncludes(playwrightDocs, 'frontend/test-results/playwright/', 'Playwright docs point to trace output directory');
  expectIncludes(browserPathsTest, "test('selected browser path product journey gate'", 'browser path test declares product journey gate');
  expectIncludes(browserPathsTest, "pathname: '/issues/browser-path-issue'", 'browser path test covers issue detail journey');
  expectIncludes(browserPathsTest, "pathname: '/enterprise'", 'browser path test covers enterprise admin journey');
  expectIncludes(browserPathsTest, 'useEnterpriseControls\\(DEFAULT_PROJECT_ID\\)', 'browser path test verifies enterprise data hook');
  expectIncludes(browserPathsTest, 'useProjectGantt\\(DEFAULT_PROJECT_ID\\)', 'browser path test verifies Gantt data hook');
  expectIncludes(nextConfig, 'keepManagedPath', 'Next config filters empty optional SWC managed paths');
  expectIncludes(nextConfig, 'infrastructureLogging', 'Next config controls webpack infrastructure logging');
  expectIncludes(nextConfig, "level: 'error'", 'Next config suppresses false-positive webpack cache warnings');
  expectIncludes(ganttModelTest, "test('gantt timeline model lays out blocking path'", 'Gantt model unit test covers blocking path layout');
  expectIncludes(ganttModelTest, "scheduleRisk, 'blocked'", 'Gantt model unit test asserts blocked risk');
  expectIncludes(workflowAutomationModelTest, "test('workflow automation model builds guarded workflow and LangGraph execution plan'", 'workflow automation model unit test covers guarded workflow and execution plan');
  expectIncludes(workflowAutomationModelTest, 'graphCoveragePercent', 'workflow automation model unit test asserts LangGraph coverage');
  expectIncludes(reportAnalyticsModelTest, "test('report analytics model builds dashboard KPIs, flow, SLA, and readiness'", 'report analytics model unit test covers report dashboard metrics');
  expectIncludes(reportAnalyticsModelTest, 'readinessStatus', 'report analytics model unit test asserts readiness status');
  expectIncludes(calendarWorkloadModelTest, "test('calendar workload model sorts events and derives lane risk'", 'calendar workload model unit test covers sorting and lane risk');
  expectIncludes(calendarWorkloadModelTest, 'buildCalendarWorkloadModel', 'calendar workload model unit test asserts workload model output');
  expectIncludes(boardPlanningModelTest, "test('board planning model derives WIP, swimlanes, and risk queue'", 'board planning model unit test covers WIP, swimlanes, and risk queue');
  expectIncludes(boardPlanningModelTest, 'buildBoardPlanningModel', 'board planning model unit test asserts board model output');
  expectIncludes(issueEvidenceModelTest, "test('issue evidence model derives readiness, data lake links, and LangGraph suggestions'", 'issue evidence model unit test covers data lake and LangGraph evidence');
  expectIncludes(issueEvidenceModelTest, 'buildIssueEvidenceModel', 'issue evidence model unit test asserts issue evidence output');
  expectIncludes(enterpriseGovernanceModelTest, "test('enterprise governance model scores permissions, gates, webhooks, and audit'", 'enterprise governance model unit test covers permissions, gates, webhooks, and audit');
  expectIncludes(enterpriseGovernanceModelTest, 'buildEnterpriseGovernanceModel', 'enterprise governance model unit test asserts governance output');
  expectIncludes(issueAssetAttachContractTest, "test('issue asset attach contract keeps API, hook, page, and E2E aligned'", 'issue asset attach contract covers API, hook, page, and E2E wiring');

  expectMatches(
    managementRoute,
    /PluginRouteHost[\s\S]*expectedRouteId="production\.management"/,
    'Next App Router /management adapter is plugin-hosted'
  );
  expectMatches(
    planningRoute,
    /PluginRouteHost[\s\S]*expectedRouteId="production\.planning"/,
    'Next App Router /planning adapter is plugin-hosted'
  );
  expectMatches(ganttRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.gantt"/, 'Next App Router /gantt adapter is plugin-hosted');
  expectMatches(calendarRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.calendar"/, 'Next App Router /calendar adapter is plugin-hosted');
  expectMatches(reportsRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.reports"/, 'Next App Router /reports adapter is plugin-hosted');
  expectMatches(workflowRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.workflow"/, 'Next App Router /workflow adapter is plugin-hosted');
  expectMatches(automationRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.automation"/, 'Next App Router /automation adapter is plugin-hosted');
  expectMatches(enterpriseRoute, /PluginRouteHost[\s\S]*expectedRouteId="production\.enterprise"/, 'Next App Router /enterprise adapter is plugin-hosted');
  expectIncludes(
    productionIndex,
    "export { ManagementConsolePage } from '@/plugin-groups/production/ManagementConsolePage';",
    'production plugin group exports management console'
  );
  expectIncludes(
    productionIndex,
    "export { PlanningPage } from '@/plugin-groups/production/PlanningPage';",
    'production plugin group exports planning page'
  );
  for (const pageExport of ['GanttPage', 'CalendarPage', 'ReportsPage', 'WorkflowPage', 'AutomationPage', 'EnterpriseAdminPage']) {
    expectIncludes(productionIndex, `export { ${pageExport} }`, `production plugin group exports ${pageExport}`);
  }

  expectIncludes(productionTypes, 'export interface ManagementIntelligence', 'frontend types expose management intelligence');
  expectIncludes(productionTypes, 'langgraph_nodes: LangGraphNode[];', 'frontend types include LangGraph nodes');
  expectIncludes(productionTypes, 'data_lake_feeds: DataLakeFeed[];', 'frontend types include data lake feeds');
  expectIncludes(productionTypes, 'automation_rules: AiAutomationRule[];', 'frontend types include AI automation rules');
  expectMatches(productionTypes, /IssueWorkLog[\s\S]*CreateIssueWorkLogRequest/, 'frontend production types include issue work logs');
  expectMatches(productionTypes, /story_points[\s\S]*rank_key/, 'frontend production types include issue planning fields');
  expectMatches(projectManagementTypes, /ProjectManagementEpic[\s\S]*ProjectManagementSprint[\s\S]*IssueDependency[\s\S]*IssueEvent/, 'project management types cover Phase 1 planning contracts');
  expectMatches(projectManagementTypes, /ProjectGanttSnapshot[\s\S]*ProjectCalendarSnapshot[\s\S]*ProjectReportsSnapshot[\s\S]*ProjectWorkflowCatalog[\s\S]*ProjectAutomationCatalog[\s\S]*ProjectEnterpriseControls/, 'project management types cover Phase 2-5 product payloads');
  expectMatches(projectManagementTypes, /ProjectGanttItem[\s\S]*priority: IssuePriority[\s\S]*start_date\?: string[\s\S]*story_points\?: number/, 'project management types carry Gantt schedule inputs');
  expectMatches(projectManagementTypes, /ProjectCalendarEvent[\s\S]*ProjectCalendarLane[\s\S]*ProjectCalendarWorkloadDay[\s\S]*lanes: ProjectCalendarLane\[][\s\S]*workload: ProjectCalendarWorkloadDay\[]/, 'project management types cover structured calendar lanes and workload contracts');
  expectMatches(projectManagementTypes, /ProjectBurndownPoint[\s\S]*ProjectVelocityPoint[\s\S]*ProjectCumulativeFlowPoint[\s\S]*ProjectCycleTimeMetric[\s\S]*ProjectSlaMetric/, 'project management types cover structured report analytics contracts');
  expectMatches(projectManagementTypes, /ProjectWorkflowTransition[\s\S]*ProjectWorkflowApprovalPolicy[\s\S]*ProjectAutomationRule[\s\S]*ProjectAutomationRunbookStep/, 'project management types cover structured workflow and automation contracts');
  expectMatches(projectManagementTypes, /ProjectEnterpriseRole[\s\S]*ProjectEnterpriseNotification[\s\S]*ProjectEnterpriseImportExport[\s\S]*ProjectEnterpriseWebhook[\s\S]*ProjectEnterpriseTemplate[\s\S]*ProjectEnterpriseCiGate[\s\S]*ProjectEnterpriseAudit/, 'project management types cover structured Phase 5 enterprise controls');

  expectIncludes(productionApi, ` '${CONTRACT_ENDPOINT}'`.trim(), 'frontend API client targets management endpoint');
  expectIncludes(productionApi, 'management: {', 'frontend API client exposes management namespace');
  expectMatches(productionApi, /\/api\/issues\/\$\{id\}\/comments[\s\S]*\/api\/issues\/\$\{id\}\/work-logs[\s\S]*apiClient\.delete\(`\/api\/issues\/\$\{id\}`\)/, 'frontend production API covers issue comments, work logs, and delete');
  expectMatches(projectManagementApi, /\/api\/project-management\/plan[\s\S]*\/api\/project-management\/epics[\s\S]*\/api\/project-management\/sprints[\s\S]*\/api\/project-management\/dependencies[\s\S]*\/api\/project-management\/gantt[\s\S]*\/api\/project-management\/calendar[\s\S]*\/api\/project-management\/reports[\s\S]*\/api\/project-management\/workflow[\s\S]*\/api\/project-management\/automation[\s\S]*\/api\/project-management\/enterprise/, 'project management API declares planning and productization endpoints');
  expectMatches(projectManagementApi, /Promise<ProjectGanttSnapshot>[\s\S]*Promise<ProjectCalendarSnapshot>[\s\S]*Promise<ProjectReportsSnapshot>[\s\S]*Promise<ProjectWorkflowCatalog>[\s\S]*Promise<ProjectAutomationCatalog>[\s\S]*Promise<ProjectEnterpriseControls>/, 'project management API has typed Phase 2-5 responses');
  expectIncludes(productionHooks, 'export function useManagementIntelligence()', 'frontend hook exposes management intelligence');
  expectIncludes(productionHooks, "queryKey: ['management-intelligence']", 'frontend hook uses stable integration query key');
  expectMatches(productionHooks, /useIssueComments[\s\S]*useIssueWorkLogs[\s\S]*useUpdateIssue[\s\S]*useDeleteIssue[\s\S]*useAddIssueComment[\s\S]*useCreateIssueWorkLog[\s\S]*useAttachIssueAsset/, 'frontend hooks expose issue core loop mutations, asset attach, and queries');
  expectMatches(projectManagementHooks, /useProjectManagementPlan[\s\S]*useProjectManagementEpics[\s\S]*useProjectManagementSprints[\s\S]*useIssueDependencies/, 'project management hooks expose planning query keys');

  expectIncludes(managementPage, 'useManagementIntelligence', 'management page reads intelligence hook');
  expectIncludes(managementPage, 'intelligence?.langgraph_nodes', 'management page consumes LangGraph nodes');
  expectIncludes(managementPage, 'intelligence?.data_lake_feeds', 'management page consumes data lake feeds');
  expectIncludes(managementPage, 'intelligence?.automation_rules', 'management page consumes AI automation rules');
  expectIncludes(managementPage, "useIssues({ page_size: 250 })", 'management page integrates production issues');
  expectIncludes(managementPage, "useAssets({ status: 'active', page_size: 100 })", 'management page integrates data lake assets');
  expectIncludes(managementPage, 'useMilestones(DEFAULT_PROJECT_ID)', 'management page integrates roadmap milestones');
  expectIncludes(planningPage, "useIssues({ page_size: 250 })", 'planning page integrates issue backlog');
  expectIncludes(planningPage, 'useMilestones(DEFAULT_PROJECT_ID)', 'planning page integrates milestone anchors');
  expectIncludes(planningPage, 'buildPlanningModel', 'planning page builds a local planning model');
  expectMatches(issueDetailPage, /useAttachIssueAsset[\s\S]*buildIssueEvidenceModel[\s\S]*Data Lake Asset ID[\s\S]*Attach Evidence[\s\S]*IssueEvidenceReadinessPanel[\s\S]*DataLakeEvidencePanel[\s\S]*LangGraphRecommendationPanel/, 'Issue detail renders data lake evidence, LangGraph recommendation panels, and asset attach controls');
  expectMatches(advancedProjectManagementPages, /export \{ GanttPage \}[\s\S]*export \{ ReportsPage \}/, 'legacy advanced page module is only a compatibility barrel');
  expectIncludes(productionPrimitives, 'export function IssueCard', 'production primitives own shared issue card UI');
  expectIncludes(projectManagementPrimitives, 'export function usePlanIssues', 'project management primitives own shared planning query composition');
  for (const [pageName, source] of Object.entries(atomicAdvancedPages)) {
    expectMatches(source, new RegExp(`export function ${pageName}`), `${pageName} has an atomic page implementation`);
    expectMatches(source, /ProjectManagementPluginPrimitives/, `${pageName} consumes shared project management primitives`);
  }
  expectIncludes(atomicAdvancedPages.GanttPage, 'useProjectGantt(DEFAULT_PROJECT_ID)', 'Gantt page consumes product Gantt hook');
  expectMatches(atomicAdvancedPages.GanttPage, /buildGanttTimelineModel[\s\S]*Schedule Timeline[\s\S]*Critical Path[\s\S]*Dependency Map[\s\S]*Risk Queue/, 'Gantt page renders timeline model, critical path, dependency map, and risk queue');
  expectMatches(boardPage, /buildBoardPlanningModel[\s\S]*BoardHealthPanel[\s\S]*BoardSwimlanePanel[\s\S]*BoardRiskQueuePanel/, 'Kanban board renders WIP health, swimlanes, and risk queue panels');
  expectMatches(ganttModel, /normalizeBlockingEdge[\s\S]*findCriticalPath[\s\S]*getScheduleRisk[\s\S]*buildGanttTimelineModel/, 'Gantt model owns layout, critical path, blocking edge, and schedule risk logic');
  expectIncludes(atomicAdvancedPages.CalendarPage, 'useProjectCalendar(DEFAULT_PROJECT_ID)', 'Calendar page consumes product calendar hook');
  expectMatches(atomicAdvancedPages.CalendarPage, /buildCalendarWorkloadModel[\s\S]*Upcoming Work[\s\S]*CalendarLanePanel[\s\S]*CalendarWorkloadPanel[\s\S]*CalendarRiskPanel/, 'Calendar page renders structured workload, lane, and risk panels');
  expectIncludes(atomicAdvancedPages.ReportsPage, 'useProjectReports(DEFAULT_PROJECT_ID)', 'Reports page consumes product reports hook');
  expectMatches(atomicAdvancedPages.ReportsPage, /buildReportsDashboardModel[\s\S]*BurndownTrendPanel[\s\S]*VelocityPanel[\s\S]*CycleSlaPanel[\s\S]*DeliveryReadinessPanel/, 'Reports page renders structured analytics dashboard panels');
  expectIncludes(atomicAdvancedPages.WorkflowPage, 'useProjectWorkflow(DEFAULT_PROJECT_ID)', 'Workflow page consumes product workflow hook');
  expectIncludes(atomicAdvancedPages.AutomationPage, 'useProjectAutomation(DEFAULT_PROJECT_ID)', 'Automation page consumes product automation hook');
  expectMatches(atomicAdvancedPages.WorkflowPage, /buildWorkflowDesignerModel[\s\S]*WorkflowPolicyPanel[\s\S]*WorkflowTransitionDesigner/, 'Workflow page renders structured workflow designer and policy panels');
  expectMatches(atomicAdvancedPages.AutomationPage, /buildAutomationExecutionPlan[\s\S]*AutomationRuleCards[\s\S]*AutomationExecutionPlanPanel/, 'Automation page renders structured automation rules and execution plan');
  expectMatches(workflowAutomationModel, /buildWorkflowDesignerModel[\s\S]*resolveWorkflowTransitions[\s\S]*buildAutomationExecutionPlan[\s\S]*ruleReadsDataLake/, 'workflow automation model owns transition coverage and LangGraph execution logic');
  expectMatches(reportAnalyticsModel, /buildReportsDashboardModel[\s\S]*buildBurndownPoints[\s\S]*latestFlowPoint[\s\S]*buildReadinessStatus/, 'report analytics model owns KPI, burndown, flow, SLA, and readiness logic');
  expectMatches(calendarWorkloadModel, /sortEventsByDate[\s\S]*buildLaneSummaries[\s\S]*buildCalendarWorkloadModel/, 'calendar workload model owns event sorting, lane risk, and workload assembly logic');
  expectMatches(boardPlanningModel, /getBoardRisk[\s\S]*buildBoardColumns[\s\S]*buildBoardSwimlanes[\s\S]*buildBoardPlanningModel/, 'board planning model owns WIP, swimlane, and risk queue logic');
  expectMatches(issueEvidenceModel, /deriveEvidenceRisk[\s\S]*buildEvidenceChecklist[\s\S]*buildDataLakeEvidenceLinks[\s\S]*buildLangGraphSuggestions[\s\S]*buildIssueEvidenceModel/, 'issue evidence model owns readiness, data lake links, and LangGraph suggestions');
  expectIncludes(atomicAdvancedPages.EnterpriseAdminPage, 'useEnterpriseControls(DEFAULT_PROJECT_ID)', 'Enterprise page consumes enterprise controls hook');
  expectMatches(atomicAdvancedPages.EnterpriseAdminPage, /buildEnterpriseGovernanceModel[\s\S]*GovernanceReadinessPanel[\s\S]*GovernanceRiskPanel[\s\S]*roles\.map[\s\S]*permissions\.map[\s\S]*notifications\.map[\s\S]*webhooks\.map[\s\S]*templates\.map[\s\S]*ciGates\.map/, 'Enterprise page renders governance model plus structured role, notification, webhook, template, and CI controls');
  expectMatches(enterpriseGovernanceModel, /buildPermissionCoverage[\s\S]*buildGovernanceRisks[\s\S]*buildEnterpriseGovernanceModel/, 'enterprise governance model owns permissions, risk, and readiness scoring logic');

  expectIncludes(backendHandlersMod, 'pub mod management_handler;', 'backend handler module exports management handler');
  expectIncludes(backendHandlersMod, 'pub mod project_management_handler;', 'backend handler module exports project management handler');
  expectIncludes(backendModelsMod, 'pub mod project_management;', 'backend model module exports project management model');
  expectIncludes(backendRepositoriesMod, 'pub mod project_management_repository;', 'backend repository module exports project management repository');
  expectIncludes(backendServicesMod, 'pub mod project_management_service;', 'backend service module exports project management service');
  expectIncludes(backendRoutes, 'management_handler', 'backend routes import management handler');
  expectIncludes(backendRoutes, 'project_management_handler', 'backend routes import project management handler');
  expectIncludes(
    backendRoutes,
    '.service(management_handler::management_intelligence)',
    'backend production routes register management intelligence endpoint'
  );
  expectMatches(
    backendRoutes,
    /project_management_handler::planning_plan[\s\S]*project_management_handler::list_epics[\s\S]*project_management_handler::create_epic[\s\S]*project_management_handler::list_sprints[\s\S]*project_management_handler::create_sprint[\s\S]*project_management_handler::list_dependencies[\s\S]*project_management_handler::create_dependency[\s\S]*project_management_handler::list_events/,
    'backend production routes register project management endpoints'
  );
  expectMatches(
    backendRoutes,
    /fn configure_planning[\s\S]*project_management_handler::gantt_snapshot[\s\S]*project_management_handler::calendar_snapshot/,
    'backend planning routes register timeline productization endpoints'
  );
  expectMatches(
    backendRoutes,
    /fn configure_workflow[\s\S]*project_management_handler::workflow_catalog[\s\S]*project_management_handler::automation_catalog[\s\S]*project_management_handler::enterprise_controls/,
    'backend workflow routes register workflow productization endpoints'
  );
  expectMatches(
    backendRoutes,
    /fn configure_reporting[\s\S]*project_management_handler::reports_snapshot/,
    'backend reporting routes register report productization endpoints'
  );
  expectIncludes(
    backendHandler,
    `#[get("${CONTRACT_ENDPOINT}")]`,
    'backend handler exposes the same management endpoint'
  );
  expectMatches(backendHandler, /struct ManagementIntelligenceResponse[\s\S]*langgraph_nodes[\s\S]*data_lake_feeds[\s\S]*automation_rules/, 'backend response contract includes all intelligence channels');
  expectMatches(backendHandler, /LangGraphNode[\s\S]*DataLakeFeed[\s\S]*AiAutomationRule/, 'backend contract models LangGraph, data lake, and AI automation');
  expectIncludes(backendHandler, 'ApiResponse::ok(response)', 'backend wraps management intelligence in standard API response');
  expectMatches(backendProjectManagementHandler, /#\[get\("\/api\/project-management\/plan"\)\][\s\S]*#\[get\("\/api\/project-management\/epics"\)\][\s\S]*#\[post\("\/api\/project-management\/epics"\)\][\s\S]*#\[get\("\/api\/project-management\/sprints"\)\][\s\S]*#\[post\("\/api\/project-management\/sprints"\)\][\s\S]*#\[get\("\/api\/project-management\/dependencies"\)\][\s\S]*#\[post\("\/api\/project-management\/dependencies"\)\][\s\S]*#\[get\("\/api\/project-management\/events"\)\]/, 'backend project management handler exposes planning endpoints');
  expectMatches(backendProjectManagementRepository, /i\.epic_id[\s\S]*i\.sprint_id[\s\S]*i\.story_points::DOUBLE PRECISION[\s\S]*i\.rank_key/, 'backend project planning summaries include sprint, epic, story points, and rank');
  expectMatches(backendProjectManagementHandler, /project-management\/gantt/, 'backend project management handler remains loaded after issue core additions');
  expectMatches(backendProjectManagementService, /gantt_snapshot[\s\S]*calendar_snapshot/, 'backend project management service remains loaded after issue core additions');
  expectMatches(backendProjectManagementService, /"priority": &issue\.priority[\s\S]*"start_date": issue\.start_date[\s\S]*"story_points": issue\.story_points/, 'backend Gantt snapshot exposes schedule input fields');
  expectMatches(backendRoutes, /production_handler::list_issue_comments[\s\S]*production_handler::create_issue_work_log[\s\S]*production_handler::list_issue_work_logs[\s\S]*production_handler::delete_issue/, 'backend routes register issue core loop endpoints');
  expectMatches(backendProjectManagementModel, /ProjectManagementEpic[\s\S]*ProjectManagementSprint/, 'backend project management model remains available for issue planning fields');
  expectMatches(backendProjectManagementHandler, /#\[get\("\/api\/project-management\/gantt"\)\][\s\S]*#\[get\("\/api\/project-management\/calendar"\)\][\s\S]*#\[get\("\/api\/project-management\/reports"\)\][\s\S]*#\[get\("\/api\/project-management\/workflow"\)\][\s\S]*#\[get\("\/api\/project-management\/automation"\)\][\s\S]*#\[get\("\/api\/project-management\/enterprise"\)\]/, 'backend project management handler exposes Phase 2-5 endpoints');
  expectMatches(backendProjectManagementModel, /SprintStatus[\s\S]*IssueDependencyType[\s\S]*IssueEventType[\s\S]*ProjectManagementEpic[\s\S]*ProjectManagementSprint[\s\S]*ProjectManagementPlan/, 'backend project management model mirrors frontend planning contracts');
  expectMatches(backendProjectManagementRepository, /list_epics[\s\S]*create_epic[\s\S]*list_sprints[\s\S]*create_sprint[\s\S]*list_dependencies[\s\S]*create_dependency[\s\S]*list_events/, 'backend project management repository supports Phase 1 operations');
  expectMatches(backendProjectManagementService, /planning_plan[\s\S]*backlog[\s\S]*active_sprint[\s\S]*dependencies[\s\S]*recent_events/, 'backend project management service assembles planning plan payload');
  expectMatches(backendProjectManagementService, /gantt_snapshot[\s\S]*calendar_snapshot[\s\S]*reports_snapshot[\s\S]*workflow_catalog[\s\S]*automation_catalog[\s\S]*enterprise_controls/, 'backend project management service assembles Phase 2-5 payloads');
  expectMatches(backendProjectManagementService, /"burndown": \{[\s\S]*"points": \[[\s\S]*"velocity": \{[\s\S]*"predictability_percent"[\s\S]*"cycle_time": \{[\s\S]*"sla": \{/, 'backend report payload exposes structured analytics metrics');
  expectMatches(backendProjectManagementService, /"lanes": \[[\s\S]*"workload": workload[\s\S]*"review_calendar": "ready"/, 'backend calendar payload exposes structured lanes and workload metrics');
  expectMatches(backendProjectManagementService, /"transitions": \[[\s\S]*"approval_policy": \{[\s\S]*"rules": \[[\s\S]*"runbook": \[/, 'backend workflow and automation payloads expose structured transition and LangGraph catalogs');
  expectMatches(backendProjectManagementService, /"roles": \[[\s\S]*"permissions"[\s\S]*"notifications": \[[\s\S]*"delivery_policy"[\s\S]*"import_export": \[[\s\S]*"webhooks": \[[\s\S]*"templates": \[[\s\S]*"ci_gates": \[[\s\S]*"audit": \{/, 'backend enterprise controls expose structured Phase 5 productization catalog');
  expectMatches(backendMain, /project_management_service::ProjectManagementService[\s\S]*pub project_management_service: ProjectManagementService[\s\S]*project_management_service,/, 'backend AppState wires project management service');
  expectMatches(planningMigration, /CREATE TABLE IF NOT EXISTS epics[\s\S]*CREATE TABLE IF NOT EXISTS sprints[\s\S]*CREATE TABLE IF NOT EXISTS issue_dependencies[\s\S]*CREATE TABLE IF NOT EXISTS issue_events/, 'planning migration adds epics, sprints, dependencies, and events');
  expectMatches(planningMigration, /ALTER TABLE issues ADD COLUMN IF NOT EXISTS epic_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS sprint_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS story_points[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS rank_key/, 'planning migration extends issues for sprint planning and ranking');
  expectMatches(productizationMigration, /CREATE TABLE IF NOT EXISTS schedule_baselines[\s\S]*CREATE TABLE IF NOT EXISTS calendar_events[\s\S]*CREATE TABLE IF NOT EXISTS report_snapshots[\s\S]*CREATE TABLE IF NOT EXISTS workflow_definitions[\s\S]*CREATE TABLE IF NOT EXISTS automation_rules[\s\S]*CREATE TABLE IF NOT EXISTS project_role_assignments[\s\S]*CREATE TABLE IF NOT EXISTS import_export_jobs[\s\S]*CREATE TABLE IF NOT EXISTS project_webhooks/, 'productization migration adds Phase 2-5 tables');
  expectMatches(issueCoreMigration, /ALTER TABLE issues ADD COLUMN IF NOT EXISTS epic_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS sprint_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS story_points[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS rank_key[\s\S]*CREATE TABLE IF NOT EXISTS issue_work_logs[\s\S]*time_spent_minutes/, 'issue core migration adds work logs and planning fields');
});
