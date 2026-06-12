/*
```cypher
CREATE
  (f:File {name: "admin-control-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.admin_control_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "backend persists admin settings and applies session policy", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "admin control API is routed and protected", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "frontend admin app exposes settings users usage and alerts", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "REPO_ROOT", type: "variable"}),
  (v3:Variable {name: "FILES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v3);
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
  migration: join(REPO_ROOT, 'database', 'migrations', '015_admin_control_settings.sql'),
  k8sMigration: join(REPO_ROOT, 'infra', 'k8s', 'migrations', '015_admin_control_settings.sql'),
  governanceMigration: join(REPO_ROOT, 'database', 'migrations', '016_admin_governance_ai.sql'),
  k8sGovernanceMigration: join(
    REPO_ROOT,
    'infra',
    'k8s',
    'migrations',
    '016_admin_governance_ai.sql',
  ),
  adminModel: join(REPO_ROOT, 'backend', 'src', 'models', 'admin_control.rs'),
  adminService: join(REPO_ROOT, 'backend', 'src', 'services', 'admin_control_service.rs'),
  authService: join(REPO_ROOT, 'backend', 'src', 'services', 'auth_service.rs'),
  adminHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'admin_control_handler.rs'),
  routes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  authorization: join(REPO_ROOT, 'backend', 'src', 'services', 'authorization_service.rs'),
  main: join(REPO_ROOT, 'backend', 'src', 'main.rs'),
  adminTypes: join(FRONTEND_ROOT, 'src', 'types', 'adminControl.ts'),
  adminApi: join(FRONTEND_ROOT, 'src', 'lib', 'adminControlApi.ts'),
  adminHook: join(FRONTEND_ROOT, 'src', 'hooks', 'useAdminControl.ts'),
  adminPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'AdminControlPage.tsx'),
  adminRoute: join(FRONTEND_ROOT, 'src', 'app', 'admin-control', 'page.tsx'),
  registry: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'registry.ts'),
  routeHost: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'route-host.tsx'),
  rolePermissions: join(FRONTEND_ROOT, 'src', 'lib', 'rolePermissions.ts'),
  packageJson: join(FRONTEND_ROOT, 'package.json'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('backend persists admin settings and applies session policy', () => {
  const migration = readText(FILES.migration);
  const k8sMigration = readText(FILES.k8sMigration);
  const governanceMigration = readText(FILES.governanceMigration);
  const k8sGovernanceMigration = readText(FILES.k8sGovernanceMigration);
  const model = readText(FILES.adminModel);
  const service = readText(FILES.adminService);
  const authService = readText(FILES.authService);
  const main = readText(FILES.main);

  for (const source of [migration, k8sMigration]) {
    assert.match(source, /CREATE TABLE IF NOT EXISTS admin_control_settings/);
    assert.match(source, /session_ttl_seconds\s+BIGINT NOT NULL DEFAULT 43200/);
    assert.match(source, /idle_timeout_seconds\s+BIGINT NOT NULL DEFAULT 3600/);
    assert.match(source, /abnormal_login_threshold\s+BIGINT NOT NULL DEFAULT 5/);
    assert.match(source, /trg_admin_control_settings_updated_at/);
  }

  for (const source of [governanceMigration, k8sGovernanceMigration]) {
    assert.match(source, /ALTER TABLE users[\s\S]*ADD COLUMN IF NOT EXISTS user_status/);
    assert.match(source, /admin_risk_policy_settings/);
    assert.match(source, /langgraph_risk_node/);
    assert.match(source, /ai_analysis_enabled/);
    assert.match(source, /idx_audit_log_action_created_at/);
  }

  assert.match(model, /AdminControlSettings/);
  assert.match(model, /AdminUsageStats/);
  assert.match(model, /UpdateAdminUserStatusRequest/);
  assert.match(model, /AdminSecurityPosture/);
  assert.match(model, /AdminOperationTrace/);
  assert.match(model, /AdminUsersQuery/);
  assert.match(model, /AdminUserPage/);
  assert.match(model, /AdminOperationTracePage/);
  assert.match(model, /AdminRiskPolicySettings/);
  assert.match(model, /AdminAiRiskAnalysis/);
  assert.match(model, /AdminLangGraphNode/);
  assert.match(model, /AdminControlSnapshot/);

  assert.match(service, /pub struct AdminControlService/);
  assert.match(service, /pub async fn configured_session_ttl_seconds/);
  assert.match(service, /pub async fn update_user_status/);
  assert.match(service, /pub async fn users_page/);
  assert.match(service, /pub async fn operation_traces_page/);
  assert.match(service, /pub async fn export_operation_traces_csv/);
  assert.match(service, /pub async fn ai_risk_analysis/);
  assert.match(service, /FROM admin_control_settings/);
  assert.match(service, /FROM admin_risk_policy_settings/);
  assert.match(service, /UPDATE admin_control_settings/);
  assert.match(service, /UPDATE admin_risk_policy_settings/);
  assert.match(service, /UPDATE users[\s\S]*SET role = \$1/);
  assert.match(service, /user_status/);
  assert.match(service, /UPDATE user_sessions[\s\S]*revoked_at/);
  assert.match(service, /UPDATE resource_locks[\s\S]*released_at/);
  assert.match(service, /async fn security_posture/);
  assert.match(service, /Block reason is required/);
  assert.match(service, /AiProviderService/);
  assert.match(service, /build_fallback_ai_risk_analysis/);
  assert.match(service, /At least one active admin account must remain/);
  assert.match(service, /auth_failures_window/);
  assert.match(service, /rbac_denials_window/);

  assert.match(authService, /configured_session_ttl_seconds\(&self\.pool\)\.await/);
  assert.match(authService, /COALESCE\(cfg\.idle_timeout_seconds, \$2\) AS idle_timeout_seconds/);
  assert.match(authService, /Session token is idle-expired/);
  assert.match(authService, /COALESCE\(u\.user_status, 'active'\) = 'active'/);
  assert.match(main, /pub admin_control_service: AdminControlService/);
  assert.match(main, /AdminControlService::new\(pool\.clone\(\)\)/);
});

test('admin control API is routed and protected', () => {
  const handler = readText(FILES.adminHandler);
  const routes = readText(FILES.routes);
  const authorization = readText(FILES.authorization);

  assert.match(handler, /#\[get\("\/api\/admin\/control"\)\]/);
  assert.match(handler, /#\[get\("\/api\/admin\/control\/users"\)\]/);
  assert.match(handler, /#\[get\("\/api\/admin\/control\/operation-traces"\)\]/);
  assert.match(handler, /#\[get\("\/api\/admin\/control\/operation-traces\/export"\)\]/);
  assert.match(handler, /#\[patch\("\/api\/admin\/control\/settings"\)\]/);
  assert.match(handler, /#\[patch\("\/api\/admin\/control\/risk-policy"\)\]/);
  assert.match(handler, /#\[patch\("\/api\/admin\/control\/users\/\{id\}\/role"\)\]/);
  assert.match(handler, /#\[patch\("\/api\/admin\/control\/users\/\{id\}\/status"\)\]/);
  assert.match(handler, /#\[post\("\/api\/admin\/control\/ai\/risk-analysis"\)\]/);
  assert.match(handler, /admin_control_service[\s\S]*snapshot\(\)/);
  assert.match(handler, /admin_control_service[\s\S]*users_page/);
  assert.match(handler, /admin_control_service[\s\S]*operation_traces_page/);
  assert.match(handler, /admin_control_service[\s\S]*export_operation_traces_csv/);
  assert.match(handler, /admin_control_service[\s\S]*update_settings/);
  assert.match(handler, /admin_control_service[\s\S]*update_risk_policy/);
  assert.match(handler, /admin_control_service[\s\S]*update_user_role/);
  assert.match(handler, /admin_control_service[\s\S]*update_user_status/);
  assert.match(handler, /admin_control_service[\s\S]*ai_risk_analysis/);
  assert.match(handler, /AiProviderConfig::from_headers/);
  assert.match(handler, /admin_control_settings_updated/);
  assert.match(handler, /admin_risk_policy_updated/);
  assert.match(handler, /admin_operation_traces_exported/);
  assert.match(handler, /admin_ai_risk_analysis_requested/);
  assert.match(handler, /admin_user_role_updated/);
  assert.match(handler, /admin_user_blocked/);
  assert.match(handler, /admin_user_unblocked/);

  assert.match(routes, /admin_control_handler/);
  assert.match(routes, /configure_admin\(cfg\)/);
  assert.match(routes, /admin_control_handler::admin_control_snapshot/);
  assert.match(routes, /admin_control_handler::admin_control_users/);
  assert.match(routes, /admin_control_handler::admin_control_operation_traces/);
  assert.match(routes, /admin_control_handler::export_admin_control_operation_traces/);
  assert.match(routes, /admin_control_handler::update_admin_risk_policy/);
  assert.match(routes, /admin_control_handler::admin_ai_risk_analysis/);
  assert.match(routes, /admin_control_handler::update_admin_user_status/);
  assert.match(
    authorization,
    /path\.starts_with\("\/api\/admin\/"\)[\s\S]*RoutePermission::EnterpriseAdmin/,
  );
  assert.match(authorization, /permission_for_route\(&Method::GET, "\/api\/admin\/control"\)/);
});

test('frontend admin app exposes settings users usage and alerts', () => {
  const types = readText(FILES.adminTypes);
  const api = readText(FILES.adminApi);
  const hook = readText(FILES.adminHook);
  const page = readText(FILES.adminPage);
  const route = readText(FILES.adminRoute);
  const registry = readText(FILES.registry);
  const routeHost = readText(FILES.routeHost);
  const rolePermissions = readText(FILES.rolePermissions);
  const packageJson = readText(FILES.packageJson);

  assert.match(types, /AdminControlSnapshot/);
  assert.match(types, /AdminUserSummary/);
  assert.match(types, /AdminUsersQuery/);
  assert.match(types, /AdminUserPage/);
  assert.match(types, /AdminOperationTracePage/);
  assert.match(types, /AdminRiskPolicySettings/);
  assert.match(types, /AdminAiRiskAnalysis/);
  assert.match(types, /AdminLangGraphNode/);
  assert.match(types, /UpdateAdminUserStatusRequest/);
  assert.match(types, /AdminSecurityPosture/);
  assert.match(types, /AdminOperationTrace/);
  assert.match(api, /\/api\/admin\/control/);
  assert.match(api, /\/api\/admin\/control\/users/);
  assert.match(api, /\/api\/admin\/control\/operation-traces/);
  assert.match(api, /\/api\/admin\/control\/operation-traces\/export/);
  assert.match(api, /\/api\/admin\/control\/settings/);
  assert.match(api, /\/api\/admin\/control\/risk-policy/);
  assert.match(api, /\/api\/admin\/control\/ai\/risk-analysis/);
  assert.match(api, /\/api\/admin\/control\/users\/\$\{userId\}\/role/);
  assert.match(api, /\/api\/admin\/control\/users\/\$\{userId\}\/status/);
  assert.match(hook, /useAdminControlSnapshot/);
  assert.match(hook, /useAdminControlUsers/);
  assert.match(hook, /useAdminOperationTraces/);
  assert.match(hook, /useUpdateAdminControlSettings/);
  assert.match(hook, /useUpdateAdminRiskPolicy/);
  assert.match(hook, /useUpdateAdminUserRole/);
  assert.match(hook, /useUpdateAdminUserStatus/);
  assert.match(hook, /useRunAdminAiRiskAnalysis/);

  assert.match(page, /Session Policy/);
  assert.match(page, /Risk Policy/);
  assert.match(page, /AI Risk Analysis/);
  assert.match(page, /LangGraph risk node/);
  assert.match(page, /User Permissions/);
  assert.match(page, /Effective RBAC/);
  assert.match(page, /Operation Trace/);
  assert.match(page, /Blocked Users/);
  assert.match(page, /High Risk/);
  assert.match(page, /Block reason/);
  assert.match(page, /Unblock/);
  assert.match(page, /Search/);
  assert.match(page, /Export/);
  assert.match(page, /Analyze/);
  assert.match(page, /useAdminControlSnapshot/);
  assert.match(page, /useAdminControlUsers/);
  assert.match(page, /useRunAdminAiRiskAnalysis/);
  assert.match(page, /exportOperationTraces/);
  assert.match(page, /risk_score/);
  assert.match(page, /riskPolicyDirty/);
  assert.match(page, /security_posture/);
  assert.match(route, /expectedRouteId="admin\.control"/);
  assert.match(registry, /id: 'admin\.control'/);
  assert.match(registry, /id: 'admin-console'/);
  assert.match(routeHost, /AdminControlPage/);
  assert.match(routeHost, /'admin\.control': 'AdminControlPage'/);
  assert.match(rolePermissions, /'admin\.control': \['enterprise:admin'\]/);
  assert.match(packageJson, /test:admin-control/);
  assert.match(packageJson, /admin-control-contract\.test\.mjs/);
});
