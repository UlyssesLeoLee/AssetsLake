/*
```cypher
CREATE
  (f:File {name: "security-audit-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.security_audit_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "security audit service writes local audit log and outbox event", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "rbac denials and auth failures are audited", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "asset security actions are audited through the shared service", type: "function", language: "javascript", signature: "test callback"}),
  (fn5:Function {name: "security audit query API is routed and protected", type: "function", language: "javascript", signature: "test callback"}),
  (fn6:Function {name: "security audit plugin page is registered for enterprise admins", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REPO_ROOT", type: "variable"}),
  (v3:Variable {name: "FILES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v3),
  (fn5)-[:USES]->(v3),
  (fn6)-[:USES]->(v3);
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
  servicesMod: join(REPO_ROOT, 'backend', 'src', 'services', 'mod.rs'),
  securityAuditService: join(REPO_ROOT, 'backend', 'src', 'services', 'security_audit_service.rs'),
  securityAuditHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'security_audit_handler.rs'),
  handlersMod: join(REPO_ROOT, 'backend', 'src', 'handlers', 'mod.rs'),
  routes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  authorizationService: join(REPO_ROOT, 'backend', 'src', 'services', 'authorization_service.rs'),
  assetHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'asset_handler.rs'),
  securityAuditApi: join(FRONTEND_ROOT, 'src', 'lib', 'securityAuditApi.ts'),
  securityAuditPage: join(
    FRONTEND_ROOT,
    'src',
    'plugin-groups',
    'production',
    'SecurityAuditPage.tsx',
  ),
  securityAuditRoute: join(FRONTEND_ROOT, 'src', 'app', 'security-audit', 'page.tsx'),
  pluginTypes: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'types.ts'),
  pluginRegistry: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'registry.ts'),
  routeHost: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'route-host.tsx'),
  rolePermissions: join(FRONTEND_ROOT, 'src', 'lib', 'rolePermissions.ts'),
  packageJson: join(FRONTEND_ROOT, 'package.json'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('security audit service writes local audit log and outbox event', () => {
  const main = readText(FILES.main);
  const servicesMod = readText(FILES.servicesMod);
  const service = readText(FILES.securityAuditService);
  const packageJson = readText(FILES.packageJson);

  assert.match(servicesMod, /pub mod security_audit_service/);
  assert.match(main, /pub security_audit_service: SecurityAuditService/);
  assert.match(
    main,
    /SecurityAuditService::new\(pool\.clone\(\), event_publisher_service\.clone\(\)\)/,
  );
  assert.match(service, /INSERT INTO audit_log/);
  assert.match(
    service,
    /DomainEventInput::new\([\s\S]*"audit\.domain-event\.v1"[\s\S]*"SecurityAuditRecorded"/,
  );
  assert.match(service, /SecurityAuditInput::new/);
  assert.match(service, /record_http_request/);
  assert.match(service, /record_service_request/);
  assert.match(service, /pub struct SecurityAuditQuery/);
  assert.match(service, /pub struct SecurityAuditEvent/);
  assert.match(service, /pub async fn list_events/);
  assert.match(packageJson, /test:security-audit/);
});

test('rbac denials and auth failures are audited', () => {
  const service = readText(FILES.authorizationService);

  assert.match(service, /SecurityAuditInput::new\("auth_failed", "denied", "security", None\)/);
  assert.match(service, /SecurityAuditInput::new\("rbac_denied", "denied", "security", None\)/);
  assert.match(service, /security_audit_service[\s\S]*record_service_request/);
  assert.match(service, /"permission": permission_name\(permission\)/);
  assert.match(service, /is_asset_content_route\(path\)/);
});

test('asset security actions are audited through the shared service', () => {
  const assetHandler = readText(FILES.assetHandler);

  for (const action of [
    'asset_uploaded',
    'asset_deleted',
    'asset_content_accessed',
    'asset_downloaded',
    'asset_content_denied',
  ]) {
    assert.match(assetHandler, new RegExp(`"${action}"`));
  }

  assert.match(assetHandler, /record_asset_security_audit/);
  assert.match(assetHandler, /security_audit_service[\s\S]*record_http_request/);
  assert.match(
    assetHandler,
    /SecurityAuditInput::new\(action, "success", "asset", Some\(asset_id\)\)/,
  );
  assert.match(assetHandler, /audit = audit\.session\(session\)/);
  assert.doesNotMatch(assetHandler, /record_asset_access\(asset_id/);
});

test('security audit query API is routed and protected', () => {
  const service = readText(FILES.securityAuditService);
  const handler = readText(FILES.securityAuditHandler);
  const handlersMod = readText(FILES.handlersMod);
  const routes = readText(FILES.routes);
  const authorization = readText(FILES.authorizationService);

  assert.match(service, /FROM audit_log/);
  assert.match(service, /diff->>'outcome'/);
  assert.match(service, /LIMIT \$4/);
  assert.match(handler, /#\[get\("\/api\/security\/audit-events"\)\]/);
  assert.match(handler, /security_audit_service[\s\S]*list_events\(query\.into_inner\(\)\)/);
  assert.match(handlersMod, /pub mod security_audit_handler/);
  assert.match(routes, /security_audit_handler/);
  assert.match(routes, /configure_security\(cfg\)/);
  assert.match(routes, /security_audit_handler::list_security_audit_events/);
  assert.match(
    authorization,
    /path\.starts_with\("\/api\/security\/audit-events"\)[\s\S]*RoutePermission::EnterpriseAdmin/,
  );
  assert.match(
    authorization,
    /permission_for_route\(&Method::GET, "\/api\/security\/audit-events"\)/,
  );
});

test('security audit plugin page is registered for enterprise admins', () => {
  const api = readText(FILES.securityAuditApi);
  const page = readText(FILES.securityAuditPage);
  const route = readText(FILES.securityAuditRoute);
  const pluginTypes = readText(FILES.pluginTypes);
  const registry = readText(FILES.pluginRegistry);
  const routeHost = readText(FILES.routeHost);
  const rolePermissions = readText(FILES.rolePermissions);

  assert.match(api, /\/api\/security\/audit-events/);
  assert.match(api, /SecurityAuditEvent/);
  assert.match(page, /securityAuditApi\.list/);
  assert.match(page, /refetchInterval: 15_000/);
  assert.match(page, /Audit Events/);
  assert.match(route, /AuthGate/);
  assert.match(route, /routeId="production\.security-audit"/);
  assert.match(route, /SecurityAuditPage/);
  assert.match(pluginTypes, /'production\.security-audit'/);
  assert.match(registry, /id: 'production\.security-audit'/);
  assert.match(registry, /href: '\/security-audit'/);
  assert.match(registry, /permissions: \['enterprise:admin'\]/);
  assert.match(routeHost, /SecurityAuditPage/);
  assert.match(routeHost, /'production\.security-audit': 'SecurityAuditPage'/);
  assert.match(rolePermissions, /'production\.security-audit': \['enterprise:admin'\]/);
});
