/*
```cypher
CREATE
  (f:File {name: "auth-session-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.auth_session_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "frontend persists sessions and injects bearer tokens", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "plugin routes are protected by a shared auth gate", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "navigation shell reflects authenticated users", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v2);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = {
  api: join(FRONTEND_ROOT, 'src', 'lib', 'api.ts'),
  authApi: join(FRONTEND_ROOT, 'src', 'lib', 'authApi.ts'),
  authSession: join(FRONTEND_ROOT, 'src', 'lib', 'authSession.ts'),
  authGate: join(FRONTEND_ROOT, 'src', 'components', 'auth', 'AuthGate.tsx'),
  routeHost: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'route-host.tsx'),
  rolePermissions: join(FRONTEND_ROOT, 'src', 'lib', 'rolePermissions.ts'),
  appShell: join(FRONTEND_ROOT, 'src', 'components', 'layout', 'AppShell.tsx'),
  packageJson: join(FRONTEND_ROOT, 'package.json'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('frontend persists sessions and injects bearer tokens', () => {
  const api = readText(FILES.api);
  const authApi = readText(FILES.authApi);
  const authSession = readText(FILES.authSession);

  assert.match(authSession, /AUTH_SESSION_STORAGE_KEY = 'assetslake\.auth\.session'/);
  assert.match(authSession, /Date\.parse\(session\.expires_at\)/);
  assert.match(authSession, /clearStoredAuthSession\(\)/);
  assert.match(authSession, /isAuthRequiredPath/);
  assert.match(authSession, /PUBLIC_AUTH_PATH_PREFIXES = \['\/verification', '\/app\/identity'\]/);
  assert.match(authSession, /return !PUBLIC_AUTH_PATH_PREFIXES\.some/);

  assert.match(api, /getStoredAuthToken/);
  assert.match(api, /headers\.set\('Authorization', `Bearer \$\{token\}`\)/);
  assert.match(api, /error\.response\?\.status === 401/);
  assert.match(api, /clearStoredAuthSession\(\)/);

  assert.match(authApi, /\/api\/auth\/login/);
  assert.match(authApi, /\/api\/auth\/me/);
  assert.match(authApi, /\/api\/auth\/logout/);
  assert.match(authApi, /\/api\/auth\/test-accounts/);
});

test('plugin routes are protected by a shared auth gate', () => {
  const authGate = readText(FILES.authGate);
  const routeHost = readText(FILES.routeHost);
  const rolePermissions = readText(FILES.rolePermissions);
  const packageJson = readText(FILES.packageJson);

  assert.match(authGate, /isAuthRequiredPath\(pathname\)/);
  assert.match(authGate, /authApi\.login/);
  assert.match(authGate, /storeAuthSession\(nextSession\)/);
  assert.match(authGate, /authApi[\s\S]*\.me\(\)/);
  assert.match(routeHost, /<AuthGate pathname=\{pathname\} routeId=\{route\.id\}>[\s\S]*<PageComponent \/>[\s\S]*<\/AuthGate>/);
  assert.match(rolePermissions, /PUBLIC_ROUTE_IDS = new Set<string>\(\['verification\.sms'\]\)/);
  assert.match(rolePermissions, /'workspace\.home': \['project:read'\]/);
  assert.match(packageJson, /test:auth-session/);
});

test('navigation shell reflects authenticated users', () => {
  const appShell = readText(FILES.appShell);

  assert.match(appShell, /getStoredAuthSession\(\)/);
  assert.match(appShell, /AUTH_SESSION_EVENT/);
  assert.match(appShell, /authApi\.logout\(\)/);
  assert.match(appShell, /clearStoredAuthSession\(\)/);
  assert.match(appShell, /displayName \?\? PLUGIN_APP\.label/);
});
