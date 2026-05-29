/*
```cypher
CREATE
  (f:File {name: "asset-security-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.asset_security_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "asset storage is private and served through signed backend URLs", type: "function", language: "javascript", signature: "test callback"}),
  (fn3:Function {name: "asset uploads enforce product storage safety gates", type: "function", language: "javascript", signature: "test callback"}),
  (fn4:Function {name: "frontend no longer labels asset links as direct MinIO access", type: "function", language: "javascript", signature: "test callback"}),
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
  assetSecurityService: join(REPO_ROOT, 'backend', 'src', 'services', 'asset_security_service.rs'),
  assetService: join(REPO_ROOT, 'backend', 'src', 'services', 'asset_service.rs'),
  assetHandler: join(REPO_ROOT, 'backend', 'src', 'handlers', 'asset_handler.rs'),
  assetRepository: join(REPO_ROOT, 'backend', 'src', 'repositories', 'asset_repository.rs'),
  routes: join(REPO_ROOT, 'backend', 'src', 'routes', 'mod.rs'),
  cargoToml: join(REPO_ROOT, 'backend', 'Cargo.toml'),
  k8sConfig: join(REPO_ROOT, 'infra', 'k8s', 'configmap.yaml'),
  k8sSecret: join(REPO_ROOT, 'infra', 'k8s', 'secret.yaml'),
  k8sMinio: join(REPO_ROOT, 'infra', 'k8s', 'minio.yaml'),
  compose: join(REPO_ROOT, 'infra', 'docker-compose.yml'),
  assetPreview: join(FRONTEND_ROOT, 'src', 'components', 'assets', 'AssetPreview.tsx'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('asset storage is private and served through signed backend URLs', () => {
  const assetSecurityService = readText(FILES.assetSecurityService);
  const assetService = readText(FILES.assetService);
  const assetHandler = readText(FILES.assetHandler);
  const routes = readText(FILES.routes);
  const k8sConfig = readText(FILES.k8sConfig);
  const k8sSecret = readText(FILES.k8sSecret);
  const k8sMinio = readText(FILES.k8sMinio);
  const compose = readText(FILES.compose);

  assert.match(assetSecurityService, /HmacSha256/);
  assert.match(assetSecurityService, /asset-content:v1/);
  assert.match(assetService, /content_url\(asset_uuid, None\)/);
  assert.match(assetService, /secure_asset_summary/);
  assert.match(assetHandler, /authenticate_request\(&req\)/);
  assert.match(assetHandler, /X-Content-Type-Options", "nosniff"/);
  assert.match(assetHandler, /Content-Security-Policy", "sandbox"/);
  assert.match(routes, /get_asset_content/);
  assert.match(routes, /get_asset_version_content/);

  assert.match(k8sConfig, /ASSET_SIGNED_URLS_ENABLED: "true"/);
  assert.match(k8sConfig, /ASSET_READ_AUTH_REQUIRED: "true"/);
  assert.match(k8sSecret, /ASSET_ACCESS_TOKEN_SECRET/);
  assert.doesNotMatch(k8sMinio, /anonymous set download/);
  assert.doesNotMatch(compose, /anonymous set download/);
  assert.match(k8sMinio, /anonymous set none/);
  assert.match(compose, /anonymous set none/);
});

test('asset uploads enforce product storage safety gates', () => {
  const assetSecurityService = readText(FILES.assetSecurityService);
  const assetService = readText(FILES.assetService);
  const assetRepository = readText(FILES.assetRepository);
  const cargoToml = readText(FILES.cargoToml);

  assert.match(cargoToml, /hmac = "0\.12"/);
  assert.match(assetSecurityService, /DEFAULT_BLOCKED_EXTENSIONS/);
  assert.match(assetSecurityService, /DEFAULT_BLOCKED_MIME_TYPES/);
  assert.match(assetSecurityService, /has_blocked_binary_signature/);
  assert.match(assetSecurityService, /bytes\.starts_with\(b"MZ"\)/);
  assert.match(assetSecurityService, /bytes\.starts_with\(b"\\x7FELF"\)/);
  assert.match(assetService, /validate_upload\(&original_filename, &mime_type, &file_bytes\)/);
  assert.match(assetRepository, /INSERT INTO audit_log/);
});

test('frontend no longer labels asset links as direct MinIO access', () => {
  const assetPreview = readText(FILES.assetPreview);

  assert.doesNotMatch(assetPreview, /Open in MinIO/);
  assert.match(assetPreview, /Open secure URL/);
});
