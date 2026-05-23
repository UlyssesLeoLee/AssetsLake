/*
```cypher
CREATE
  (f:File {name: "plugin-groups-regression.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/plugin-groups-regression.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "extractConstObject", type: "function", language: "javascript", signature: "function extractConstObject(source, constName)"}),
  (fn3:Function {name: "loadProductArchitecture", type: "function", language: "javascript", signature: "function loadProductArchitecture()"}),
  (fn4:Function {name: "flattenProductApps", type: "function", language: "javascript", signature: "function flattenProductApps(product)"}),
  (fn5:Function {name: "flattenAppPluginGroups", type: "function", language: "javascript", signature: "function flattenAppPluginGroups(app)"}),
  (fn6:Function {name: "flattenGroupPlugins", type: "function", language: "javascript", signature: "function flattenGroupPlugins(group)"}),
  (fn7:Function {name: "flattenPluginRoutes", type: "function", language: "javascript", signature: "function flattenPluginRoutes(groups)"}),
  (fn8:Function {name: "flattenAppPluginRoutes", type: "function", language: "javascript", signature: "function flattenAppPluginRoutes(app)"}),
  (fn9:Function {name: "navAppPluginRoutes", type: "function", language: "javascript", signature: "function navAppPluginRoutes(app)"}),
  (fn10:Function {name: "resolvePluginRoute", type: "function", language: "javascript", signature: "function resolvePluginRoute(routes, pathname)"}),
  (fn11:Function {name: "routeIds", type: "function", language: "javascript", signature: "function routeIds(routes)"}),
  (fn12:Function {name: "productionPagePath", type: "function", language: "javascript", signature: "function productionPagePath(routeId)"}),
  (fn13:Function {name: "plugin product architecture regression test", type: "function", language: "javascript", signature: "test callback"}),
  (fn14:Function {name: "filterEnabledPluginsForApp", type: "function", language: "javascript", signature: "function filterEnabledPluginsForApp(app, plugins)"}),
  (fn15:Function {name: "isPluginEnabledForApp", type: "function", language: "javascript", signature: "function isPluginEnabledForApp(plugin, app)"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REPO_ROOT", type: "variable"}),
  (v3:Variable {name: "REGISTRY_PATH", type: "variable"}),
  (v4:Variable {name: "PRODUCTION_DIR", type: "variable"}),
  (v5:Variable {name: "BACKEND_MANAGEMENT_HANDLER_PATH", type: "variable"}),
  (v6:Variable {name: "VALIDATION_PATH", type: "variable"}),
  (v7:Variable {name: "ICON_NAMES", type: "variable"}),
  (v8:Variable {name: "REGISTRY_CONSTS", type: "variable"}),
  (v9:Variable {name: "PRODUCTION_ROUTE_COMPONENTS", type: "variable"}),
  (v10:Variable {name: "PROJECT_MANAGEMENT_CONTRACT_FILES", type: "variable"}),
  (v11:Variable {name: "BACKEND_PROJECT_MANAGEMENT_FILES", type: "variable"}),
  (v12:Variable {name: "PRODUCTION_ATOMIC_PAGE_COMPONENTS", type: "variable"}),
  (v13:Variable {name: "PROJECT_MANAGEMENT_ATOMIC_PAGE_COMPONENTS", type: "variable"}),
  (v14:Variable {name: "policy", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn14),
  (fn5)-[:CALLS]->(fn6),
  (fn5)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn14),
  (fn7)-[:CALLS]->(fn6),
  (fn8)-[:CALLS]->(fn5),
  (fn9)-[:CALLS]->(fn8),
  (fn13)-[:CALLS]->(fn1),
  (fn13)-[:CALLS]->(fn3),
  (fn13)-[:CALLS]->(fn4),
  (fn13)-[:CALLS]->(fn5),
  (fn13)-[:CALLS]->(fn8),
  (fn13)-[:CALLS]->(fn9),
  (fn13)-[:CALLS]->(fn10),
  (fn13)-[:CALLS]->(fn11),
  (fn13)-[:CALLS]->(fn12),
  (fn1)-[:USES]->(v1),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v6),
  (fn3)-[:USES]->(v7),
  (fn12)-[:USES]->(v4),
  (fn12)-[:USES]->(v8),
  (fn13)-[:USES]->(v5),
  (fn13)-[:USES]->(v9),
  (fn13)-[:USES]->(v10),
  (fn13)-[:USES]->(v11),
  (fn13)-[:USES]->(v12),
  (fn13)-[:USES]->(v13),
  (fn14)-[:CALLS]->(fn15),
  (fn15)-[:USES]->(v14);
```
*/

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(FRONTEND_ROOT, '..');
const REGISTRY_PATH = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'registry.ts');
const PRODUCTION_DIR = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production');
const VALIDATION_PATH = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'validation.ts');
const BACKEND_MANAGEMENT_HANDLER_PATH = join(REPO_ROOT, 'backend', 'src', 'handlers', 'management_handler.rs');
const PROJECT_MANAGEMENT_CONTRACT_FILES = {
  types: join(FRONTEND_ROOT, 'src', 'types', 'projectManagement.ts'),
  api: join(FRONTEND_ROOT, 'src', 'lib', 'projectManagementApi.ts'),
  hooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProjectManagement.ts'),
  ganttModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ganttModel.ts'),
  migration: join(REPO_ROOT, 'database', 'migrations', '003_project_management_planning.sql'),
  productizationMigration: join(REPO_ROOT, 'database', 'migrations', '004_project_management_productization.sql'),
  issueCoreMigration: join(REPO_ROOT, 'database', 'migrations', '005_issue_core_loop.sql'),
};
const BACKEND_PROJECT_MANAGEMENT_FILES = {
  model: join(REPO_ROOT, 'backend', 'src', 'models', 'project_management.rs'),
  repository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'project_management_repository.rs'),
  service: join(REPO_ROOT, 'backend', 'src', 'services', 'project_management_service.rs'),
  handler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'project_management_handler.rs'),
  routes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  main: join(REPO_ROOT, 'backend', 'src', 'main.rs'),
};

const ICON_NAMES = [
  'Boxes',
  'ClipboardCheck',
  'Database',
  'FileText',
  'KanbanSquare',
  'KeyRound',
  'LayoutGrid',
  'ListChecks',
  'Milestone',
  'PackageCheck',
  'ShieldCheck',
  'Truck',
  'Upload',
];

const REGISTRY_CONSTS = [
  'WORKSPACE_PLUGIN_GROUP',
  'IDENTITY_VERIFICATION_PLUGIN_GROUP',
  'PRODUCTION_MANAGEMENT_PLUGIN_GROUP',
  'PRODUCTION_PLANNING_PLUGIN_GROUP',
  'PRODUCTION_EXECUTION_PLUGIN_GROUP',
  'PRODUCTION_TIMELINE_PLUGIN_GROUP',
  'PRODUCTION_REPORTING_PLUGIN_GROUP',
  'PRODUCTION_WORKFLOW_PLUGIN_GROUP',
  'PRODUCTION_DELIVERY_PLUGIN_GROUP',
  'PRODUCTION_ENTERPRISE_PLUGIN_GROUP',
  'ASSET_LIBRARY_PLUGIN_GROUP',
  'ASSETSLAKE_PRODUCT',
];

const PRODUCTION_ROUTE_COMPONENTS = new Map([
  ['production.ai-control', 'AiControlPage'],
  ['production.management', 'ManagementConsolePage'],
  ['production.planning', 'PlanningPage'],
  ['production.board', 'KanbanBoardPage'],
  ['production.board.detail', 'IssueDetailPage'],
  ['production.briefs', 'BriefEditorPage'],
  ['production.reviews', 'ReviewBoardPage'],
  ['production.approvals', 'ApprovalQueuePage'],
  ['production.gantt', 'GanttPage'],
  ['production.calendar', 'CalendarPage'],
  ['production.reports', 'ReportsPage'],
  ['production.workflow', 'WorkflowPage'],
  ['production.automation', 'AutomationPage'],
  ['production.delivery', 'DeliveryPackagePage'],
  ['production.milestones', 'MilestoneTimelinePage'],
  ['production.enterprise', 'EnterpriseAdminPage'],
  ['production.vendors', 'VendorDashboardPage'],
]);

const PRODUCTION_ATOMIC_PAGE_COMPONENTS = new Set([
  'KanbanBoardPage',
  'IssueDetailPage',
  'BriefEditorPage',
  'ReviewBoardPage',
  'ApprovalQueuePage',
  'DeliveryPackagePage',
  'MilestoneTimelinePage',
  'VendorDashboardPage',
]);

const PROJECT_MANAGEMENT_ATOMIC_PAGE_COMPONENTS = new Set([
  'GanttPage',
  'CalendarPage',
  'ReportsPage',
  'WorkflowPage',
  'AutomationPage',
  'EnterpriseAdminPage',
]);

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function extractConstObject(source, constName) {
  const marker = `const ${constName} =`;
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `${constName} declaration exists`);

  const start = source.indexOf('{', markerIndex);
  assert.notEqual(start, -1, `${constName} starts with an object literal`);

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  assert.fail(`${constName} object literal is balanced`);
}

function loadProductArchitecture() {
  const source = readText(REGISTRY_PATH);
  const context = Object.fromEntries(ICON_NAMES.map((name) => [name, { displayName: name }]));

  for (const constName of REGISTRY_CONSTS) {
    const literal = extractConstObject(source, constName);
    context[constName] = vm.runInNewContext(`(${literal})`, context, { timeout: 1000 });
  }

  return context.ASSETSLAKE_PRODUCT;
}

function flattenProductApps(product) {
  return Array.from(product.apps).sort((a, b) => a.order - b.order);
}

function flattenAppPluginGroups(app) {
  return Array.from(app.pluginGroups, (group) => {
    const scopedGroup = {
      ...group,
      pluginAppId: app.id,
      pluginAppLabel: app.label,
    };

    return {
      ...scopedGroup,
      plugins: flattenGroupPlugins(scopedGroup, app),
      routes: flattenPluginRoutes([scopedGroup], app),
      pluginAppId: app.id,
      pluginAppLabel: app.label,
    };
  }).sort((a, b) => a.order - b.order);
}

function flattenGroupPlugins(group, app) {
  return Array.from(filterEnabledPluginsForApp(app, group.plugins), (plugin) => ({
    ...plugin,
    pluginAppId: group.pluginAppId,
    pluginAppLabel: group.pluginAppLabel,
    pluginGroupId: group.id,
    pluginGroupLabel: group.label,
  })).sort((a, b) => a.order - b.order);
}

function flattenPluginRoutes(groups, app) {
  return Array.from(groups)
    .flatMap((group) =>
      flattenGroupPlugins(group, app).flatMap((plugin) =>
        Array.from(plugin.routes, (route) => ({
          ...route,
          nav: route.nav ?? plugin.nav,
          pluginId: plugin.id,
          pluginLabel: plugin.label,
          pluginAppId: plugin.pluginAppId,
          pluginAppLabel: plugin.pluginAppLabel,
          pluginGroupId: plugin.pluginGroupId,
          pluginGroupLabel: plugin.pluginGroupLabel,
        }))
      )
    )
    .sort((a, b) => a.order - b.order);
}

function filterEnabledPluginsForApp(app, plugins) {
  return Array.from(plugins).filter((plugin) => isPluginEnabledForApp(plugin, app));
}

function isPluginEnabledForApp(plugin, app) {
  const policy = app?.policy;
  if (!policy) {
    return true;
  }

  if (policy.enabledPlugins && !policy.enabledPlugins.includes(plugin.id)) {
    return false;
  }

  if (policy.disabledPlugins?.includes(plugin.id)) {
    return false;
  }

  const allowedPermissions = policy.allowedPermissions;
  if (allowedPermissions) {
    return plugin.manifest.permissions.every((permission) => allowedPermissions.includes(permission));
  }

  return true;
}

function flattenAppPluginRoutes(app) {
  return flattenAppPluginGroups(app)
    .flatMap((group) => group.routes)
    .sort((a, b) => a.order - b.order);
}

function navAppPluginRoutes(app) {
  return flattenAppPluginRoutes(app).filter((route) => route.nav);
}

function resolvePluginRoute(routes, pathname) {
  return routes.find((route) =>
    route.exact ? pathname === route.href : pathname === route.href || pathname.startsWith(`${route.href}/`)
  );
}

function routeIds(routes) {
  return Array.from(routes, (route) => route.id);
}

function productionPagePath(routeId) {
  const component = PRODUCTION_ROUTE_COMPONENTS.get(routeId);
  assert.ok(component, `${routeId} has a production page adapter expectation`);
  return join(PRODUCTION_DIR, `${component}.tsx`);
}

test('plugin product architecture regression test', () => {
  const product = loadProductArchitecture();
  const apps = flattenProductApps(product);
  const defaultApp = apps.find((app) => app.id === 'studio-console');
  const productionApp = apps.find((app) => app.id === 'production-console');
  const assetApp = apps.find((app) => app.id === 'asset-console');

  assert.equal(product.id, 'assetslake-product');
  assert.equal(product.label, 'AssetsLake');
  assert.deepEqual(
    Array.from(apps, (app) => app.id),
    ['studio-console', 'production-console', 'asset-console', 'verification-app']
  );
  assert.ok(defaultApp, 'default studio app exists');
  assert.ok(productionApp, 'production app exists');
  assert.ok(assetApp, 'asset app exists');

  for (const app of apps) {
    const groups = flattenAppPluginGroups(app);
    const routes = flattenAppPluginRoutes(app);
    const plugins = groups.flatMap((group) => group.plugins);
    const pluginIds = new Set(plugins.map((plugin) => plugin.id));

    assert.ok(groups.length >= 2, `${app.id} is composed from multiple plugin groups`);
    assert.ok(groups.every((group) => group.plugins.length > 0), `${app.id} groups are composed from plugins`);
    assert.ok(plugins.every((plugin) => plugin.manifest), `${app.id} plugins declare manifests`);
    assert.ok(
      plugins.every((plugin) => plugin.manifest.permissions.length > 0 && plugin.manifest.backendScopes.length > 0),
      `${app.id} plugin manifests declare permissions and backend scopes`
    );
    assert.ok(plugins.every((plugin) => plugin.manifest.lifecycle), `${app.id} plugin manifests declare lifecycle`);
    assert.ok(
      plugins.every((plugin) => (plugin.manifest.dependencies ?? []).every((dependencyId) => pluginIds.has(dependencyId))),
      `${app.id} plugin dependencies resolve within the app`
    );
    assert.equal(new Set(routeIds(routes)).size, routes.length, `${app.id} route ids are unique within the app`);
    assert.ok(routes.every((route) => route.pluginAppId === app.id), `${app.id} routes carry app scope`);
    assert.ok(routes.every((route) => route.pluginGroupId), `${app.id} routes carry group scope`);
    assert.ok(routes.every((route) => route.pluginId), `${app.id} routes carry plugin scope`);
  }

  const groups = flattenAppPluginGroups(defaultApp);
  const routes = flattenAppPluginRoutes(defaultApp);
  const navRoutes = navAppPluginRoutes(defaultApp);

  assert.deepEqual(
    Array.from(groups, (group) => group.id),
    [
      'workspace',
      'identity-verification',
      'production-management',
      'production-planning',
      'production-execution',
      'production-timeline',
      'production-reporting',
      'production-workflow',
      'production-delivery',
      'production-enterprise',
      'asset-library',
    ]
  );
  assert.equal(defaultApp.pluginGroups[0].pluginAppId, undefined, 'flattening does not mutate source groups');
  assert.equal(routes.length, 22);

  const routeOrders = Array.from(routes, (route) => route.order);
  assert.deepEqual(
    routeOrders,
    routeOrders.toSorted((a, b) => a - b),
    'routes are ordered by registry order'
  );
  assert.equal(new Set(routeOrders).size, routeOrders.length, 'routes have unique ordering for stable navigation');
  assert.equal(new Set(Array.from(routes, (route) => route.href)).size, routes.length, 'route hrefs are unique within the app');

  assert.deepEqual(routeIds(navRoutes), [
    'workspace.home',
    'production.ai-control',
    'production.management',
    'production.planning',
    'production.board',
    'production.reviews',
    'production.approvals',
    'production.gantt',
    'production.calendar',
    'production.reports',
    'production.workflow',
    'production.automation',
    'production.delivery',
    'production.enterprise',
    'verification.sms',
    'assets.library',
    'assets.query',
    'assets.upload',
  ]);

  assert.deepEqual(routeIds(flattenAppPluginRoutes(assetApp)), [
    'workspace.home',
    'assets.library',
    'assets.query',
    'assets.upload',
  ]);
  assert.deepEqual(routeIds(flattenAppPluginRoutes(productionApp)).includes('assets.upload'), false);
  assert.deepEqual(
    routeIds(flattenAppPluginRoutes(productionApp)).includes('assets.library'),
    true,
    'production app can read asset library while upload stays isolated to studio/asset apps'
  );

  assert.equal(resolvePluginRoute(routes, '/')?.id, 'workspace.home');
  assert.equal(resolvePluginRoute(routes, '/verification')?.id, 'verification.sms');
  assert.equal(resolvePluginRoute(routes, '/ai-control')?.id, 'production.ai-control');
  assert.equal(resolvePluginRoute(routes, '/management')?.id, 'production.management');
  assert.equal(resolvePluginRoute(routes, '/planning')?.id, 'production.planning');
  assert.equal(resolvePluginRoute(routes, '/gantt')?.id, 'production.gantt');
  assert.equal(resolvePluginRoute(routes, '/issues/example')?.id, 'production.board.detail');
  assert.equal(resolvePluginRoute(routes, '/reports')?.id, 'production.reports');
  assert.equal(resolvePluginRoute(routes, '/workflow')?.id, 'production.workflow');
  assert.equal(resolvePluginRoute(routes, '/assets')?.id, 'assets.library');
  assert.equal(resolvePluginRoute(routes, '/assets/asset-001')?.id, 'assets.library');
  assert.equal(resolvePluginRoute(routes, '/data-lake-query')?.id, 'assets.query');
  assert.equal(resolvePluginRoute(routes, '/board/example')?.id, 'production.board');
  assert.equal(resolvePluginRoute(routes, '/missing'), undefined);

  for (const route of routes.filter((item) => item.pluginGroupId?.startsWith('production-'))) {
    const pagePath = productionPagePath(route.id);
    const component = PRODUCTION_ROUTE_COMPONENTS.get(route.id);
    const pageSource = readText(pagePath);
    assert.ok(existsSync(pagePath), `${component} page adapter exists`);
    assert.match(
      pageSource,
      new RegExp(`export \\{ ${component}, ${component} as default \\}|export default function ${component}|export default ${component}`),
      `${component} exports a page component`
    );

    if (PRODUCTION_ATOMIC_PAGE_COMPONENTS.has(component)) {
      assert.doesNotMatch(
        pageSource,
        /@\/components\/production\/ProductionViews/,
        `${component} owns its implementation instead of re-exporting ProductionViews`
      );
      assert.match(
        pageSource,
        /ProductionPluginPrimitives/,
        `${component} consumes atomized production primitives`
      );
    }

    if (PROJECT_MANAGEMENT_ATOMIC_PAGE_COMPONENTS.has(component)) {
      assert.doesNotMatch(
        pageSource,
        /AdvancedProjectManagementPages/,
        `${component} owns its implementation instead of re-exporting AdvancedProjectManagementPages`
      );
      assert.match(
        pageSource,
        /ProjectManagementPluginPrimitives/,
        `${component} consumes atomized project management primitives`
      );
    }
  }

  assert.ok(
    existsSync(join(PRODUCTION_DIR, 'ProductionPluginPrimitives.tsx')),
    'production plugin primitives are isolated from page implementations'
  );
  assert.ok(
    existsSync(join(PRODUCTION_DIR, 'ProjectManagementPluginPrimitives.tsx')),
    'project management plugin primitives are isolated from page implementations'
  );
  assert.match(
    readText(REGISTRY_PATH),
    /assertHealthyProductArchitecture\(\{[\s\S]*getProductArchitectureHealth/,
    'plugin registry validates product architecture health at module load'
  );
  assert.match(
    readText(VALIDATION_PATH),
    /validateProductArchitecture[\s\S]*route\.order\.unique[\s\S]*plugin\.dependency\.missing[\s\S]*plugin\.manifest\.required[\s\S]*plugin\.nav\.route-required/,
    'plugin architecture validator guards route order uniqueness, dependencies, manifests, and nav route completeness'
  );

  for (const component of PRODUCTION_ATOMIC_PAGE_COMPONENTS) {
    const pageSource = readText(join(PRODUCTION_DIR, `${component}.tsx`));
    assert.doesNotMatch(
      pageSource,
      /@\/components\/production\/ProductionViews/,
      `${component} is not a ProductionViews adapter`
    );
    assert.match(pageSource, /ProductionPluginPrimitives/, `${component} uses production primitives`);
  }

  for (const component of PROJECT_MANAGEMENT_ATOMIC_PAGE_COMPONENTS) {
    const pageSource = readText(join(PRODUCTION_DIR, `${component}.tsx`));
    assert.doesNotMatch(
      pageSource,
      /AdvancedProjectManagementPages/,
      `${component} is not an AdvancedProjectManagementPages adapter`
    );
    assert.match(pageSource, /ProjectManagementPluginPrimitives/, `${component} uses project management primitives`);
  }

  const productionIndex = readText(join(PRODUCTION_DIR, 'index.ts'));
  for (const component of PRODUCTION_ROUTE_COMPONENTS.values()) {
    assert.match(
      productionIndex,
      new RegExp(`export \\{ ${component} \\} from '@/plugin-groups/production/${component}'`),
      `${component} is exported through the production plugin group index`
    );
  }

  assert.match(
    readText(BACKEND_MANAGEMENT_HANDLER_PATH),
    /#\[get\("\/api\/management\/intelligence"\)\]/,
    'backend exposes the management intelligence contract'
  );
  assert.match(
    readText(BACKEND_MANAGEMENT_HANDLER_PATH),
    /#\[post\("\/api\/management\/rag\/search"\)\]/,
    'backend exposes the Qdrant RAG operation memory search contract'
  );
  assert.match(
    readText(BACKEND_MANAGEMENT_HANDLER_PATH),
    /LangGraphNode[\s\S]*DataLakeFeed[\s\S]*AiAutomationRule/,
    'backend management contract covers LangGraph, data lake, and AI automation'
  );
  assert.match(
    readText(join(REPO_ROOT, 'backend', 'src', 'services', 'rag_memory_service.rs')),
    /Qdrant[\s\S]*remember_operation[\s\S]*search_points/,
    'backend RAG memory service writes operation memory into Qdrant and retrieves it'
  );
  assert.match(
    readText(join(REPO_ROOT, 'infra', 'docker-compose.yml')),
    /qdrant:[\s\S]*QDRANT_COLLECTION/,
    'local stack includes Qdrant for operation memory vectors'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'lib', 'productionApi.ts')),
    /\/api\/management\/intelligence[\s\S]*\/api\/management\/rag\/search/,
    'frontend API client targets management intelligence and RAG memory contracts'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'lib', 'dataLakeQueryApi.ts')),
    /\/api\/data-lake\/query\/sql[\s\S]*\/api\/data-lake\/query\/cypher/,
    'frontend API client targets SQL and Cypher data lake query contracts'
  );
  assert.match(
    readText(join(REPO_ROOT, 'backend', 'src', 'services', 'lake_query_service.rs')),
    /execute_sql[\s\S]*execute_cypher[\s\S]*HAS_EVIDENCE[\s\S]*HAS_INSIGHT/,
    'backend data lake query service supports read-only SQL, Cypher graph projections, and AI insight relations'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'lib', 'aiSettings.ts')),
    /embeddingModel[\s\S]*x-assetslake-ai-embedding-model/,
    'frontend AI settings carry an embedding model for operation-memory vectorization'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts')),
    /useManagementIntelligence/,
    'frontend hook exposes management intelligence to product pages'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts')),
    /useIssueComments[\s\S]*useIssueWorkLogs[\s\S]*useUpdateIssue[\s\S]*useDeleteIssue[\s\S]*useAddIssueComment[\s\S]*useCreateIssueWorkLog/,
    'frontend hooks expose issue core loop queries and mutations'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'lib', 'productionApi.ts')),
    /\/api\/issues\/\$\{id\}\/comments[\s\S]*\/api\/issues\/\$\{id\}\/work-logs[\s\S]*apiClient\.delete\(`\/api\/issues\/\$\{id\}`\)/,
    'frontend production API declares issue comments, work logs, and delete endpoints'
  );
  assert.match(
    readText(join(FRONTEND_ROOT, 'src', 'types', 'production.ts')),
    /IssueWorkLog[\s\S]*CreateIssueWorkLogRequest[\s\S]*story_points|story_points[\s\S]*IssueWorkLog[\s\S]*CreateIssueWorkLogRequest/,
    'frontend production types cover issue work logs and planning fields'
  );
  assert.match(
    readText(join(PRODUCTION_DIR, 'ManagementConsolePage.tsx')),
    /intelligence\?\.langgraph_nodes[\s\S]*intelligence\?\.data_lake_feeds[\s\S]*intelligence\?\.automation_rules/,
    'management console consumes LangGraph, data lake, and AI automation intelligence'
  );

  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.types),
    /ProjectManagementEpic[\s\S]*ProjectManagementSprint[\s\S]*IssueDependency[\s\S]*IssueEvent/,
    'frontend project management contracts cover epics, sprints, dependencies, and events'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.types),
    /ProjectGanttItem[\s\S]*priority: IssuePriority[\s\S]*start_date\?: string[\s\S]*story_points\?: number/,
    'frontend Gantt contract carries priority, start date, and story point schedule inputs'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.ganttModel),
    /normalizeBlockingEdge[\s\S]*findCriticalPath[\s\S]*getScheduleRisk[\s\S]*buildGanttTimelineModel/,
    'frontend Gantt model computes timeline layout, blocking edges, critical path, and schedule risk'
  );
  assert.match(
    readText(join(PRODUCTION_DIR, 'GanttPage.tsx')),
    /buildGanttTimelineModel[\s\S]*Schedule Timeline[\s\S]*Critical Path[\s\S]*Dependency Map[\s\S]*Risk Queue/,
    'Gantt page renders the product timeline, critical path, dependency map, and risk queue'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.api),
    /\/api\/project-management\/plan[\s\S]*\/api\/project-management\/epics[\s\S]*\/api\/project-management\/sprints[\s\S]*\/api\/project-management\/dependencies[\s\S]*\/api\/project-management\/gantt[\s\S]*\/api\/project-management\/calendar[\s\S]*\/api\/project-management\/reports[\s\S]*\/api\/project-management\/workflow[\s\S]*\/api\/project-management\/automation[\s\S]*\/api\/project-management\/enterprise/,
    'frontend project management API client declares Phase 1-5 endpoints'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.types),
    /ProjectEnterpriseRole[\s\S]*ProjectEnterpriseNotification[\s\S]*ProjectEnterpriseImportExport[\s\S]*ProjectEnterpriseWebhook[\s\S]*ProjectEnterpriseTemplate[\s\S]*ProjectEnterpriseCiGate[\s\S]*ProjectEnterpriseAudit/,
    'frontend project management contracts cover structured Phase 5 enterprise controls'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.hooks),
    /useProjectManagementPlan[\s\S]*useProjectManagementEpics[\s\S]*useProjectManagementSprints[\s\S]*useIssueDependencies/,
    'frontend hooks expose project management planning queries'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.hooks),
    /useProjectGantt[\s\S]*useProjectCalendar[\s\S]*useProjectReports[\s\S]*useProjectWorkflow[\s\S]*useProjectAutomation[\s\S]*useEnterpriseControls/,
    'frontend hooks expose Phase 2-5 product queries'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.migration),
    /CREATE TABLE IF NOT EXISTS epics[\s\S]*CREATE TABLE IF NOT EXISTS sprints[\s\S]*CREATE TABLE IF NOT EXISTS issue_dependencies[\s\S]*CREATE TABLE IF NOT EXISTS issue_events/,
    'database migration adds Phase 1 project management planning tables'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.productizationMigration),
    /CREATE TABLE IF NOT EXISTS schedule_baselines[\s\S]*CREATE TABLE IF NOT EXISTS calendar_events[\s\S]*CREATE TABLE IF NOT EXISTS report_snapshots[\s\S]*CREATE TABLE IF NOT EXISTS workflow_definitions[\s\S]*CREATE TABLE IF NOT EXISTS automation_rules[\s\S]*CREATE TABLE IF NOT EXISTS project_role_assignments[\s\S]*CREATE TABLE IF NOT EXISTS import_export_jobs[\s\S]*CREATE TABLE IF NOT EXISTS project_webhooks/,
    'database migration adds Phase 2-5 productization tables'
  );
  assert.match(
    readText(PROJECT_MANAGEMENT_CONTRACT_FILES.issueCoreMigration),
    /ALTER TABLE issues ADD COLUMN IF NOT EXISTS epic_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS sprint_id[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS story_points[\s\S]*ALTER TABLE issues ADD COLUMN IF NOT EXISTS rank_key[\s\S]*CREATE TABLE IF NOT EXISTS issue_work_logs[\s\S]*time_spent_minutes/,
    'database migration adds issue core loop work logs and planning fields'
  );

  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.model),
    /ProjectManagementEpic[\s\S]*ProjectManagementSprint[\s\S]*IssueDependency[\s\S]*IssueEvent[\s\S]*ProjectManagementPlan/,
    'backend project management model mirrors Phase 1 contracts'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.repository),
    /list_epics[\s\S]*create_epic[\s\S]*list_sprints[\s\S]*create_sprint[\s\S]*list_dependencies[\s\S]*create_dependency[\s\S]*list_events/,
    'backend repository declares project management persistence operations'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.service),
    /planning_plan[\s\S]*list_epics[\s\S]*list_sprints[\s\S]*list_dependencies[\s\S]*list_events[\s\S]*gantt_snapshot[\s\S]*calendar_snapshot[\s\S]*reports_snapshot[\s\S]*workflow_catalog[\s\S]*automation_catalog[\s\S]*enterprise_controls/,
    'backend service assembles project management planning and productization data'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.service),
    /"roles": \[[\s\S]*"permissions"[\s\S]*"notifications": \[[\s\S]*"import_export": \[[\s\S]*"webhooks": \[[\s\S]*"templates": \[[\s\S]*"ci_gates": \[[\s\S]*"audit": \{/,
    'backend service exposes structured Phase 5 enterprise productization controls'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.handler),
    /#\[get\("\/api\/project-management\/plan"\)\][\s\S]*#\[get\("\/api\/project-management\/epics"\)\][\s\S]*#\[post\("\/api\/project-management\/epics"\)\][\s\S]*#\[get\("\/api\/project-management\/sprints"\)\][\s\S]*#\[post\("\/api\/project-management\/sprints"\)\][\s\S]*#\[get\("\/api\/project-management\/dependencies"\)\][\s\S]*#\[post\("\/api\/project-management\/dependencies"\)\][\s\S]*#\[get\("\/api\/project-management\/events"\)\][\s\S]*#\[get\("\/api\/project-management\/gantt"\)\][\s\S]*#\[get\("\/api\/project-management\/calendar"\)\][\s\S]*#\[get\("\/api\/project-management\/reports"\)\][\s\S]*#\[get\("\/api\/project-management\/workflow"\)\][\s\S]*#\[get\("\/api\/project-management\/automation"\)\][\s\S]*#\[get\("\/api\/project-management\/enterprise"\)\]/,
    'backend handler exposes project management planning and productization endpoints'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.routes),
    /project_management_handler[\s\S]*planning_plan[\s\S]*list_epics[\s\S]*create_epic[\s\S]*list_sprints[\s\S]*create_sprint[\s\S]*list_dependencies[\s\S]*create_dependency[\s\S]*list_events[\s\S]*gantt_snapshot[\s\S]*calendar_snapshot[\s\S]*reports_snapshot[\s\S]*workflow_catalog[\s\S]*automation_catalog[\s\S]*enterprise_controls/,
    'backend routes register project management endpoints through Phase 5'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.routes),
    /production_handler::list_issue_comments[\s\S]*production_handler::create_issue_work_log[\s\S]*production_handler::list_issue_work_logs[\s\S]*production_handler::delete_issue/,
    'backend routes register issue core loop endpoints'
  );
  assert.match(
    readText(BACKEND_PROJECT_MANAGEMENT_FILES.main),
    /project_management_service::ProjectManagementService[\s\S]*pub project_management_service: ProjectManagementService[\s\S]*ProjectManagementService::new\(pool\.clone\(\)\)/,
    'backend app state owns project management service'
  );
});
