/*
```cypher
CREATE
  (f:File {name: "concurrency-readiness.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.concurrency_readiness", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "optimistic write contracts are wired through backend and frontend", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "resource locks avoid global cleanup on hot write paths", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "kubernetes manifests expose poolers and high-concurrency scaling limits", type: "function", language: "javascript", signature: "test callback"}),
  (fn5:Function {name: "session auth and database operations are bounded for multi-user latency", type: "function", language: "javascript", signature: "test callback"}),
  (fn6:Function {name: "kanban realtime feedback uses lightweight sync probes", type: "function", language: "javascript", signature: "test callback"}),
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
  assetModel: join(REPO_ROOT, 'backend', 'src', 'models', 'asset.rs'),
  productionModel: join(REPO_ROOT, 'backend', 'src', 'models', 'production.rs'),
  assetRepository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'asset_repository.rs'),
  repositoryMod: join(REPO_ROOT, 'backend', 'src', 'repositories', 'mod.rs'),
  productionRepository: join(
    REPO_ROOT,
    'backend',
    'src',
    'repositories',
    'production_repository.rs',
  ),
  productionService: join(REPO_ROOT, 'backend', 'src', 'services', 'production_service.rs'),
  productionHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'production_handler.rs'),
  productionRoutes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  authService: join(REPO_ROOT, 'backend', 'src', 'services', 'auth_service.rs'),
  resourceLockService: join(REPO_ROOT, 'backend', 'src', 'services', 'resource_lock_service.rs'),
  frontendAssetTypes: join(FRONTEND_ROOT, 'src', 'types', 'asset.ts'),
  frontendProductionTypes: join(FRONTEND_ROOT, 'src', 'types', 'production.ts'),
  productionApi: join(FRONTEND_ROOT, 'src', 'lib', 'productionApi.ts'),
  productionHooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts'),
  issueDetailPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'IssueDetailPage.tsx'),
  kanbanPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'KanbanBoardPage.tsx'),
  k8sConfig: join(REPO_ROOT, 'infra', 'k8s', 'configmap.yaml'),
  k8sSecrets: join(REPO_ROOT, 'infra', 'k8s', 'secret.yaml'),
  k8sAutoscaling: join(REPO_ROOT, 'infra', 'k8s', 'autoscaling.yaml'),
  k8sPoolers: join(REPO_ROOT, 'infra', 'k8s', 'postgres-poolers.yaml'),
  compose: join(REPO_ROOT, 'infra', 'docker-compose.yml'),
  kustomization: join(REPO_ROOT, 'infra', 'k8s', 'kustomization.yaml'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('optimistic write contracts are wired through backend and frontend', () => {
  const assetModel = readText(FILES.assetModel);
  const productionModel = readText(FILES.productionModel);
  const assetRepository = readText(FILES.assetRepository);
  const productionRepository = readText(FILES.productionRepository);
  const frontendAssetTypes = readText(FILES.frontendAssetTypes);
  const frontendProductionTypes = readText(FILES.frontendProductionTypes);
  const productionHooks = readText(FILES.productionHooks);
  const issueDetailPage = readText(FILES.issueDetailPage);
  const kanbanPage = readText(FILES.kanbanPage);

  assert.match(assetModel, /pub expected_version: Option<i32>/);
  assert.match(productionModel, /pub expected_version: Option<i32>/);
  assert.match(frontendAssetTypes, /expected_version\?: number/);
  assert.match(frontendProductionTypes, /expected_version\?: number/);

  assert.match(
    assetRepository,
    /version = version \+ 1[\s\S]*\$8::INTEGER IS NULL OR version = \$8/,
  );
  assert.match(assetRepository, /fetch_optional\(&self\.pool\)[\s\S]*Asset version conflict/);
  assert.match(productionRepository, /expected_version[\s\S]*expected_version != old\.version/);
  assert.match(productionRepository, /version = version \+ 1[\s\S]*updated_at = NOW\(\)/);

  assert.match(
    productionHooks,
    /expectedVersion\?: number[\s\S]*expected_version: expectedVersion/,
  );
  assert.match(issueDetailPage, /expected_version: issue\.version/);
  assert.match(kanbanPage, /expectedVersion: issue\.version/);
});

test('resource locks avoid global cleanup on hot write paths', () => {
  const resourceLockService = readText(FILES.resourceLockService);

  assert.match(resourceLockService, /RESOURCE_LOCK_STRICT_WRITES/);
  assert.match(
    resourceLockService,
    /WHERE resource_type = \$1[\s\S]*AND resource_id = \$2[\s\S]*expires_at <= NOW\(\)/,
  );
  assert.doesNotMatch(
    resourceLockService,
    /UPDATE resource_locks[\s\S]*WHERE released_at IS NULL AND expires_at <= NOW\(\)/,
  );
});

test('kubernetes manifests expose poolers and high-concurrency scaling limits', () => {
  const config = readText(FILES.k8sConfig);
  const secrets = readText(FILES.k8sSecrets);
  const autoscaling = readText(FILES.k8sAutoscaling);
  const poolers = readText(FILES.k8sPoolers);
  const compose = readText(FILES.compose);
  const kustomization = readText(FILES.kustomization);

  assert.match(config, /DB_MAX_CONNECTIONS: "8"/);
  assert.match(config, /DB_ACQUIRE_TIMEOUT_SECONDS: "2"/);
  assert.match(config, /DB_STATEMENT_TIMEOUT_MS: "2500"/);
  assert.match(config, /DB_LOCK_TIMEOUT_MS: "2000"/);
  assert.match(config, /API_LATENCY_SLO_MS: "3000"/);
  assert.match(config, /SESSION_TOUCH_INTERVAL_SECONDS: "60"/);
  assert.match(config, /OUTBOX_RELAY_ENABLED: "true"/);
  assert.match(config, /OUTBOX_RELAY_BATCH_SIZE: "500"/);
  assert.match(config, /RESOURCE_LOCK_STRICT_WRITES: "false"/);
  assert.match(compose, /DB_STATEMENT_TIMEOUT_MS: \$\{DB_STATEMENT_TIMEOUT_MS:-2500\}/);
  assert.match(compose, /DB_LOCK_TIMEOUT_MS: \$\{DB_LOCK_TIMEOUT_MS:-2000\}/);
  assert.match(compose, /SESSION_TOUCH_INTERVAL_SECONDS: \$\{SESSION_TOUCH_INTERVAL_SECONDS:-60\}/);

  for (const service of [
    'identity',
    'projects',
    'assets',
    'production',
    'planning',
    'workflow',
    'reporting',
  ]) {
    assert.match(poolers, new RegExp(`name: assetslake-${service}-pgbouncer`));
    assert.match(secrets, new RegExp(`@assetslake-${service}-pgbouncer:5432/`));
  }

  assert.match(poolers, /kind: Pooler/);
  assert.match(poolers, /poolMode: transaction/);
  assert.match(poolers, /max_client_conn: "150000"/);
  assert.match(poolers, /query_wait_timeout: "2"/);
  assert.match(kustomization, /postgres-poolers\.yaml/);
  assert.match(autoscaling, /maxReplicas: 50/);
  assert.match(autoscaling, /name: memory[\s\S]*averageUtilization: 70/);
});

test('session auth and database operations are bounded for multi-user latency', () => {
  const authService = readText(FILES.authService);
  const repositoryMod = readText(FILES.repositoryMod);

  assert.match(authService, /DEFAULT_SESSION_TOUCH_INTERVAL_SECONDS: i64 = 60/);
  assert.match(authService, /SESSION_TOUCH_INTERVAL_SECONDS/);
  assert.match(authService, /should_touch_session\(row\.last_seen_at\)/);
  assert.match(authService, /UPDATE user_sessions SET last_seen_at = NOW\(\) WHERE id = \$1/);

  assert.match(repositoryMod, /DB_STATEMENT_TIMEOUT_MS/);
  assert.match(repositoryMod, /DB_LOCK_TIMEOUT_MS/);
  assert.match(repositoryMod, /\("statement_timeout", statement_timeout\)/);
  assert.match(repositoryMod, /\("lock_timeout", lock_timeout\)/);
});

test('kanban realtime feedback uses lightweight sync probes', () => {
  const productionModel = readText(FILES.productionModel);
  const productionRepository = readText(FILES.productionRepository);
  const productionService = readText(FILES.productionService);
  const productionHandler = readText(FILES.productionHandler);
  const productionRoutes = readText(FILES.productionRoutes);
  const frontendProductionTypes = readText(FILES.frontendProductionTypes);
  const productionApi = readText(FILES.productionApi);
  const productionHooks = readText(FILES.productionHooks);
  const kanbanPage = readText(FILES.kanbanPage);

  assert.match(productionModel, /IssueBoardSyncSnapshot/);
  assert.match(productionModel, /IssueBoardSyncActivity/);
  assert.match(productionRepository, /SELECT COALESCE\(MAX\(updated_at\), NOW\(\)\)/);
  assert.match(productionRepository, /WHERE deleted_at IS NULL AND updated_at > \$1/);
  assert.match(productionService, /board_sync_snapshot/);
  assert.match(productionHandler, /\#\[get\("\/api\/issues\/board-sync"\)\]/);
  assert.match(productionRoutes, /issue_board_sync[\s\S]*create_issue[\s\S]*get_issue/);

  assert.match(frontendProductionTypes, /interface IssueBoardSyncSnapshot/);
  assert.match(productionApi, /boardSync[\s\S]*\/api\/issues\/board-sync/);
  assert.match(productionHooks, /useIssueBoardSync/);
  assert.match(productionHooks, /refetchInterval: 2_000/);
  assert.match(productionHooks, /getStoredAuthSession\(\)/);
  assert.match(kanbanPage, /useIssueBoardSync\(syncCursor\)/);
  assert.match(kanbanPage, /invalidateQueries\(\{ queryKey: \['issues'\] \}\)/);
  assert.match(kanbanPage, /isConflictError\(mutationError\)/);
});
