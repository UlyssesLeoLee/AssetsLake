/*
```cypher
CREATE
  (f:File {name: "concurrency-readiness.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.concurrency_readiness", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "optimistic write contracts are wired through backend and frontend", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "resource locks avoid global cleanup on hot write paths", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "kubernetes manifests expose poolers and high-concurrency scaling limits", type: "function", language: "javascript", signature: "test callback"}),
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
  assetModel: join(REPO_ROOT, 'backend', 'src', 'models', 'asset.rs'),
  productionModel: join(REPO_ROOT, 'backend', 'src', 'models', 'production.rs'),
  assetRepository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'asset_repository.rs'),
  productionRepository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'production_repository.rs'),
  resourceLockService: join(REPO_ROOT, 'backend', 'src', 'services', 'resource_lock_service.rs'),
  frontendAssetTypes: join(FRONTEND_ROOT, 'src', 'types', 'asset.ts'),
  frontendProductionTypes: join(FRONTEND_ROOT, 'src', 'types', 'production.ts'),
  productionHooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts'),
  issueDetailPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'IssueDetailPage.tsx'),
  kanbanPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'KanbanBoardPage.tsx'),
  k8sConfig: join(REPO_ROOT, 'infra', 'k8s', 'configmap.yaml'),
  k8sSecrets: join(REPO_ROOT, 'infra', 'k8s', 'secret.yaml'),
  k8sAutoscaling: join(REPO_ROOT, 'infra', 'k8s', 'autoscaling.yaml'),
  k8sPoolers: join(REPO_ROOT, 'infra', 'k8s', 'postgres-poolers.yaml'),
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

  assert.match(assetRepository, /version = version \+ 1[\s\S]*\$8::INTEGER IS NULL OR version = \$8/);
  assert.match(assetRepository, /fetch_optional\(&self\.pool\)[\s\S]*Asset version conflict/);
  assert.match(productionRepository, /expected_version[\s\S]*expected_version != old\.version/);
  assert.match(productionRepository, /version = version \+ 1[\s\S]*updated_at = NOW\(\)/);

  assert.match(productionHooks, /expectedVersion\?: number[\s\S]*expected_version: expectedVersion/);
  assert.match(issueDetailPage, /expected_version: issue\.version/);
  assert.match(kanbanPage, /expectedVersion: issue\.version/);
});

test('resource locks avoid global cleanup on hot write paths', () => {
  const resourceLockService = readText(FILES.resourceLockService);

  assert.match(resourceLockService, /RESOURCE_LOCK_STRICT_WRITES/);
  assert.match(resourceLockService, /WHERE resource_type = \$1[\s\S]*AND resource_id = \$2[\s\S]*expires_at <= NOW\(\)/);
  assert.doesNotMatch(resourceLockService, /UPDATE resource_locks[\s\S]*WHERE released_at IS NULL AND expires_at <= NOW\(\)/);
});

test('kubernetes manifests expose poolers and high-concurrency scaling limits', () => {
  const config = readText(FILES.k8sConfig);
  const secrets = readText(FILES.k8sSecrets);
  const autoscaling = readText(FILES.k8sAutoscaling);
  const poolers = readText(FILES.k8sPoolers);
  const kustomization = readText(FILES.kustomization);

  assert.match(config, /DB_MAX_CONNECTIONS: "8"/);
  assert.match(config, /OUTBOX_RELAY_ENABLED: "true"/);
  assert.match(config, /OUTBOX_RELAY_BATCH_SIZE: "500"/);
  assert.match(config, /RESOURCE_LOCK_STRICT_WRITES: "false"/);

  for (const service of ['identity', 'projects', 'assets', 'production', 'planning', 'workflow', 'reporting']) {
    assert.match(poolers, new RegExp(`name: assetslake-${service}-pgbouncer`));
    assert.match(secrets, new RegExp(`@assetslake-${service}-pgbouncer:5432/`));
  }

  assert.match(poolers, /kind: Pooler/);
  assert.match(poolers, /poolMode: transaction/);
  assert.match(poolers, /max_client_conn: "4000"/);
  assert.match(kustomization, /postgres-poolers\.yaml/);
  assert.match(autoscaling, /maxReplicas: 50/);
  assert.match(autoscaling, /name: memory[\s\S]*averageUtilization: 70/);
});
