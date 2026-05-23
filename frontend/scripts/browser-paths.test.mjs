/*
```cypher
CREATE
  (f:File {name: "browser-paths.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/browser-paths.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "extractConstObject", type: "function", language: "javascript", signature: "function extractConstObject(source, constName)"}),
  (fn3:Function {name: "loadProductArchitecture", type: "function", language: "javascript", signature: "function loadProductArchitecture()"}),
  (fn4:Function {name: "flattenProductApps", type: "function", language: "javascript", signature: "function flattenProductApps(product)"}),
  (fn5:Function {name: "flattenAppPluginGroups", type: "function", language: "javascript", signature: "function flattenAppPluginGroups(app)"}),
  (fn6:Function {name: "flattenGroupPlugins", type: "function", language: "javascript", signature: "function flattenGroupPlugins(group)"}),
  (fn7:Function {name: "flattenPluginRoutes", type: "function", language: "javascript", signature: "function flattenPluginRoutes(groups)"}),
  (fn8:Function {name: "flattenAppPluginRoutes", type: "function", language: "javascript", signature: "function flattenAppPluginRoutes(app)"}),
  (fn9:Function {name: "resolvePluginRoute", type: "function", language: "javascript", signature: "function resolvePluginRoute(routes, pathname)"}),
  (fn10:Function {name: "appPagePath", type: "function", language: "javascript", signature: "function appPagePath(segments)"}),
  (fn11:Function {name: "assertAdapter", type: "function", language: "javascript", signature: "function assertAdapter(step)"}),
  (fn12:Function {name: "assertImplementation", type: "function", language: "javascript", signature: "function assertImplementation(step)"}),
  (fn13:Function {name: "selected browser path product journey gate", type: "function", language: "javascript", signature: "test callback"}),
  (fn14:Function {name: "filterEnabledPluginsForApp", type: "function", language: "javascript", signature: "function filterEnabledPluginsForApp(app, plugins)"}),
  (fn15:Function {name: "isPluginEnabledForApp", type: "function", language: "javascript", signature: "function isPluginEnabledForApp(plugin, app)"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REGISTRY_PATH", type: "variable"}),
  (v3:Variable {name: "APP_DIR", type: "variable"}),
  (v4:Variable {name: "ICON_NAMES", type: "variable"}),
  (v5:Variable {name: "REGISTRY_CONSTS", type: "variable"}),
  (v6:Variable {name: "SELECTED_BROWSER_PATHS", type: "variable"}),
  (v7:Variable {name: "routes", type: "variable"}),
  (v8:Variable {name: "policy", type: "variable"}),
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
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v5),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v4),
  (fn5)-[:CALLS]->(fn14),
  (fn5)-[:CALLS]->(fn6),
  (fn5)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn14),
  (fn7)-[:CALLS]->(fn6),
  (fn8)-[:CALLS]->(fn5),
  (fn9)-[:USES]->(v7),
  (fn10)-[:USES]->(v3),
  (fn11)-[:CALLS]->(fn1),
  (fn11)-[:CALLS]->(fn10),
  (fn12)-[:CALLS]->(fn1),
  (fn13)-[:CALLS]->(fn3),
  (fn13)-[:CALLS]->(fn4),
  (fn13)-[:CALLS]->(fn8),
  (fn13)-[:CALLS]->(fn9),
  (fn13)-[:CALLS]->(fn11),
  (fn13)-[:CALLS]->(fn12),
  (fn13)-[:USES]->(v6),
  (fn13)-[:USES]->(v7),
  (fn14)-[:CALLS]->(fn15),
  (fn15)-[:USES]->(v8);
```
*/

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'registry.ts');
const APP_DIR = join(FRONTEND_ROOT, 'src', 'app');

const ICON_NAMES = [
  'Boxes',
  'ClipboardCheck',
  'Database',
  'FileText',
  'KanbanSquare',
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

const SELECTED_BROWSER_PATHS = [
  {
    pathname: '/',
    routeId: 'workspace.home',
    appSegments: ['page.tsx'],
    adapterPattern: /@\/plugin-groups\/workspace\/HomePage/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'workspace', 'HomePage.tsx'),
    implementationPatterns: [/getPluginApps/, /RouteShortcut/],
  },
  {
    pathname: '/ai-control',
    routeId: 'production.ai-control',
    appSegments: ['ai-control', 'page.tsx'],
    adapterPattern: /AiControlPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'AiControlPage.tsx'),
    implementationPatterns: [/loadAiSettings/, /productionApi\.management\.chat/, /productionApi\.management\.ragSearch/, /Embedding Model/, /RAG Memory/, /AI Autopilot/, /buildAutopilotPlan/, /Emergent Control Matrix/, /create_issue_from_asset/],
  },
  {
    pathname: '/planning',
    routeId: 'production.planning',
    appSegments: ['planning', 'page.tsx'],
    adapterPattern: /PlanningPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'PlanningPage.tsx'),
    implementationPatterns: [/useIssues\(\{ page_size: 250 \}\)/, /useMilestones\(DEFAULT_PROJECT_ID\)/],
  },
  {
    pathname: '/briefs',
    routeId: 'production.briefs',
    appSegments: ['briefs', 'page.tsx'],
    adapterPattern: /BriefEditorPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'BriefEditorPage.tsx'),
    implementationPatterns: [/useCreateIssue/, /story_points/],
  },
  {
    pathname: '/board',
    routeId: 'production.board',
    appSegments: ['board', 'page.tsx'],
    adapterPattern: /KanbanBoardPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'KanbanBoardPage.tsx'),
    implementationPatterns: [/useTransitionIssue/, /buildBoardPlanningModel/, /BoardHealthPanel/],
  },
  {
    pathname: '/issues/browser-path-issue',
    routeId: 'production.board.detail',
    appSegments: ['issues', '[id]', 'page.tsx'],
    adapterPattern: /IssueDetailPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'IssueDetailPage.tsx'),
    implementationPatterns: [/useIssueComments/, /useIssueWorkLogs/, /useUpdateIssue/, /useDeleteIssue/, /useAttachIssueAsset/, /buildIssueEvidenceModel/, /LangGraphRecommendationPanel/],
  },
  {
    pathname: '/gantt',
    routeId: 'production.gantt',
    appSegments: ['gantt', 'page.tsx'],
    adapterPattern: /GanttPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'GanttPage.tsx'),
    implementationPatterns: [/useProjectGantt\(DEFAULT_PROJECT_ID\)/, /buildGanttTimelineModel/, /Critical Path/, /Dependency Map/],
  },
  {
    pathname: '/calendar',
    routeId: 'production.calendar',
    appSegments: ['calendar', 'page.tsx'],
    adapterPattern: /CalendarPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'CalendarPage.tsx'),
    implementationPatterns: [/useProjectCalendar\(DEFAULT_PROJECT_ID\)/, /buildCalendarWorkloadModel/, /CalendarWorkloadPanel/, /Upcoming Work/],
  },
  {
    pathname: '/reports',
    routeId: 'production.reports',
    appSegments: ['reports', 'page.tsx'],
    adapterPattern: /ReportsPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ReportsPage.tsx'),
    implementationPatterns: [/useProjectReports\(DEFAULT_PROJECT_ID\)/, /buildReportsDashboardModel/, /CycleSlaPanel/],
  },
  {
    pathname: '/workflow',
    routeId: 'production.workflow',
    appSegments: ['workflow', 'page.tsx'],
    adapterPattern: /WorkflowPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'WorkflowPage.tsx'),
    implementationPatterns: [/useProjectWorkflow\(DEFAULT_PROJECT_ID\)/, /buildWorkflowDesignerModel/, /WorkflowPolicyPanel/],
  },
  {
    pathname: '/automation',
    routeId: 'production.automation',
    appSegments: ['automation', 'page.tsx'],
    adapterPattern: /AutomationPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'AutomationPage.tsx'),
    implementationPatterns: [/useProjectAutomation\(DEFAULT_PROJECT_ID\)/, /buildAutomationExecutionPlan/, /AutomationExecutionPlanPanel/],
  },
  {
    pathname: '/enterprise',
    routeId: 'production.enterprise',
    appSegments: ['enterprise', 'page.tsx'],
    adapterPattern: /EnterpriseAdminPage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'EnterpriseAdminPage.tsx'),
    implementationPatterns: [/useEnterpriseControls\(DEFAULT_PROJECT_ID\)/, /buildEnterpriseGovernanceModel/, /GovernanceReadinessPanel/, /Templates & CI Gates/],
  },
  {
    pathname: '/delivery-packages',
    routeId: 'production.delivery',
    appSegments: ['delivery-packages', 'page.tsx'],
    adapterPattern: /DeliveryPackagePage as default/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'DeliveryPackagePage.tsx'),
    implementationPatterns: [/useCreateDeliveryPackage/, /deliveryPackages\.submit/],
  },
  {
    pathname: '/assets',
    routeId: 'assets.library',
    appSegments: ['assets', 'page.tsx'],
    adapterPattern: /@\/plugin-groups\/asset-library\/AssetsPage/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'asset-library', 'AssetsPage.tsx'),
    implementationPatterns: [/useAssets/, /AssetGrid/, /AssetTable/],
  },
  {
    pathname: '/data-lake-query',
    routeId: 'assets.query',
    appSegments: ['data-lake-query', 'page.tsx'],
    adapterPattern: /@\/plugin-groups\/asset-library\/DataLakeQueryPage/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'asset-library', 'DataLakeQueryPage.tsx'),
    implementationPatterns: [/dataLakeQueryApi\.sql/, /dataLakeQueryApi\.cypher/, /Data Lake Query/, /MATCH \(i:Issue\)-\[r:HAS_EVIDENCE\]->\(a:Asset\)/, /HAS_INSIGHT/],
  },
  {
    pathname: '/upload',
    routeId: 'assets.upload',
    appSegments: ['upload', 'page.tsx'],
    adapterPattern: /@\/plugin-groups\/asset-library\/UploadPage/,
    implementationPath: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'asset-library', 'UploadPage.tsx'),
    implementationPatterns: [/assetsApi\.upload/, /UploadSuccess/],
  },
];

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

function resolvePluginRoute(routes, pathname) {
  return routes.find((route) =>
    route.exact ? pathname === route.href : pathname === route.href || pathname.startsWith(`${route.href}/`)
  );
}

function appPagePath(segments) {
  return join(APP_DIR, ...segments);
}

function assertAdapter(step) {
  const pagePath = appPagePath(step.appSegments);
  assert.ok(existsSync(pagePath), `${step.pathname} App Router page exists`);
  assert.match(readText(pagePath), step.adapterPattern, `${step.pathname} App Router adapter targets expected page`);
}

function assertImplementation(step) {
  assert.ok(existsSync(step.implementationPath), `${step.pathname} implementation file exists`);
  const source = readText(step.implementationPath);
  for (const pattern of step.implementationPatterns) {
    assert.match(source, pattern, `${step.pathname} implementation includes ${pattern}`);
  }
}

test('selected browser path product journey gate', () => {
  const product = loadProductArchitecture();
  const studioApp = flattenProductApps(product).find((app) => app.id === 'studio-console');
  assert.ok(studioApp, 'studio-console plugin app exists');

  const routes = flattenAppPluginRoutes(studioApp);

  for (const step of SELECTED_BROWSER_PATHS) {
    assert.equal(resolvePluginRoute(routes, step.pathname)?.id, step.routeId, `${step.pathname} resolves to ${step.routeId}`);
    assertAdapter(step);
    assertImplementation(step);
  }
});
