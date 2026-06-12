/*
```cypher
CREATE
  (f:File {name: "rbac-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.rbac_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "backend middleware enforces route-level authorization", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "route matrix covers domain read and write permissions", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "role matrix separates producer artist reviewer and admin capabilities", type: "function", language: "javascript", signature: "test callback"}),
  (fn5:Function {name: "frontend filters navigation and direct route access by role", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REPO_ROOT", type: "variable"}),
  (v3:Variable {name: "FILES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v3),
  (fn5)-[:USES]->(v3);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(FRONTEND_ROOT, '..');
const FILES = {
  main: join(REPO_ROOT, 'backend', 'src', 'main.rs'),
  authorizationService: join(REPO_ROOT, 'backend', 'src', 'services', 'authorization_service.rs'),
  rolePermissions: join(FRONTEND_ROOT, 'src', 'lib', 'rolePermissions.ts'),
  authGate: join(FRONTEND_ROOT, 'src', 'components', 'auth', 'AuthGate.tsx'),
  routeHost: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'route-host.tsx'),
  appShell: join(FRONTEND_ROOT, 'src', 'components', 'layout', 'AppShell.tsx'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('backend middleware enforces route-level authorization', () => {
  const main = readText(FILES.main);
  const service = readText(FILES.authorizationService);

  assert.match(main, /authorization_service::enforce_route_authorization/);
  assert.match(main, /middleware::from_fn\(enforce_route_authorization\)/);
  assert.match(service, /pub async fn enforce_route_authorization/);
  assert.match(service, /auth_service[\s\S]*authenticate_request\(req\.request\(\)\)/);
  assert.match(service, /role_allows\(&session\.user\.role, permission\)/);
  assert.match(service, /req\.extensions_mut\(\)\.insert\(session\)/);
});

test('route matrix covers domain read and write permissions', () => {
  const service = readText(FILES.authorizationService);

  for (const permission of [
    'AssetRead',
    'AssetWrite',
    'AssetAnalyze',
    'AssetDelete',
    'ProductionRead',
    'IssueWrite',
    'IssueComment',
    'IssueReview',
    'IssueDelete',
    'DeliveryWrite',
    'PlanningRead',
    'PlanningWrite',
    'WorkflowRead',
    'ReportingRead',
    'DataLakeQuery',
    'AiControlRead',
    'AiControlWrite',
    'EnterpriseAdmin',
  ]) {
    assert.match(service, new RegExp(`RoutePermission::${permission}`));
  }

  assert.match(service, /path == "\/api\/assets" \|\| path\.starts_with\("\/api\/assets\/"\)/);
  assert.match(service, /path == "\/api\/issues"[\s\S]*path\.starts_with\("\/api\/issues\/"\)/);
  assert.match(service, /path\.starts_with\("\/api\/project-management\/"\)/);
  assert.match(service, /path\.starts_with\("\/api\/data-lake\/query\/"\)/);
  assert.match(service, /path\.starts_with\("\/api\/management\/"\)/);
  assert.match(service, /method == Method::OPTIONS/);
  assert.match(service, /path\.starts_with\("\/internal\/"\)/);
});

test('role matrix separates producer artist reviewer and admin capabilities', () => {
  const service = readText(FILES.authorizationService);

  assert.match(service, /if role == "admin"[\s\S]*return true/);
  assert.match(
    service,
    /RoutePermission::AssetWrite => matches!\(role\.as_str\(\), "producer" \| "artist"\)/,
  );
  assert.match(
    service,
    /RoutePermission::IssueReview => matches!\(role\.as_str\(\), "producer" \| "reviewer"\)/,
  );
  assert.match(service, /RoutePermission::DeliveryWrite => role == "producer"/);
  assert.match(
    service,
    /RoutePermission::EnterpriseAdmin \| RoutePermission::FallbackAdmin => false/,
  );
  assert.match(service, /assert!\(!role_allows\("reviewer", RoutePermission::AssetWrite\)\)/);
  assert.match(service, /assert!\(!role_allows\("producer", RoutePermission::EnterpriseAdmin\)\)/);
});

test('frontend filters navigation and direct route access by role', () => {
  const rolePermissions = readText(FILES.rolePermissions);
  const authGate = readText(FILES.authGate);
  const routeHost = readText(FILES.routeHost);
  const appShell = readText(FILES.appShell);

  assert.match(
    rolePermissions,
    /PUBLIC_ROUTE_IDS = new Set<string>\(\['workspace\.home', 'verification\.sms'\]\)/,
  );
  assert.match(rolePermissions, /'admin\.control': \['enterprise:admin'\]/);
  assert.match(rolePermissions, /'production\.enterprise': \['enterprise:admin'\]/);
  assert.match(rolePermissions, /'production\.security-audit': \['enterprise:admin'\]/);
  assert.match(rolePermissions, /'assets\.upload': \['asset:write'\]/);
  assert.match(rolePermissions, /producer:[\s\S]*'observability:read'/);
  assert.match(
    rolePermissions,
    /artist:[\s\S]*?'asset:read'[\s\S]*?'asset:write'[\s\S]*?'issue:read'[\s\S]*?'issue:write'[\s\S]*?'project:read'[\s\S]*?\],/,
  );
  assert.match(rolePermissions, /roleCanAccessRouteId/);
  assert.match(rolePermissions, /filterPluginRoutesForRole/);

  assert.match(routeHost, /<AuthGate pathname=\{pathname\} routeId=\{route\.id\}>/);
  assert.match(authGate, /roleCanAccessRouteId\(session\.user\.role, routeId\)/);
  assert.match(authGate, /Access denied/);
  assert.match(appShell, /filterPluginRoutesForRole\(PRIMARY_NAV_ITEMS, role\)/);
  assert.match(appShell, /visiblePrimaryNavItems\.map/);
  assert.match(appShell, /roleCanAccessRouteId\(role, OBSERVABILITY_NAV_ITEM\.id\)/);
  assert.match(appShell, /roleCanAccessRouteId\(role, SETTINGS_NAV_ITEM\.id\)/);
});
