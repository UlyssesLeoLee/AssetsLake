/*
```cypher
CREATE
  (f:File {name: "data-lake-smoke.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/data-lake-smoke.test", type: "module"}),
  (fn1:Function {name: "url", type: "function", language: "javascript", signature: "function url(path, baseUrl = API_BASE_URLS[0])"}),
  (fn2:Function {name: "fetchWithTimeout", type: "function", language: "javascript", signature: "async function fetchWithTimeout(target, options = {})"}),
  (fn3:Function {name: "expectJson", type: "function", language: "javascript", signature: "async function expectJson(response, label)"}),
  (fn4:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(response, expected, label)"}),
  (fn5:Function {name: "fetchApi", type: "function", language: "javascript", signature: "async function fetchApi(path, options = {})"}),
  (fn6:Function {name: "getJson", type: "function", language: "javascript", signature: "async function getJson(path, label)"}),
  (fn7:Function {name: "uploadSmokeAsset", type: "function", language: "javascript", signature: "async function uploadSmokeAsset(marker)"}),
  (fn8:Function {name: "deleteSmokeAsset", type: "function", language: "javascript", signature: "async function deleteSmokeAsset(assetId)"}),
  (fn9:Function {name: "AssetsLake data lake smoke test", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "API_BASE_URLS", type: "variable"}),
  (v2:Variable {name: "MINIO_BASE_URL", type: "variable"}),
  (v3:Variable {name: "EXPECTED_BUCKET", type: "variable"}),
  (v4:Variable {name: "TIMEOUT_MS", type: "variable"}),
  (v5:Variable {name: "marker", type: "variable"}),
  (v6:Variable {name: "assetId", type: "variable"}),
  (v7:Variable {name: "upload", type: "variable"}),
  (v8:Variable {name: "REQUIRE_MANAGEMENT", type: "variable"}),
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
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn4),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn2),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn3),
  (fn6)-[:CALLS]->(fn4),
  (fn6)-[:CALLS]->(fn5),
  (fn7)-[:CALLS]->(fn5),
  (fn7)-[:CALLS]->(fn3),
  (fn7)-[:CALLS]->(fn4),
  (fn7)-[:USES]->(v3),
  (fn7)-[:USES]->(v5),
  (fn8)-[:CALLS]->(fn5),
  (fn8)-[:CALLS]->(fn4),
  (fn8)-[:USES]->(v6),
  (fn9)-[:CALLS]->(fn2),
  (fn9)-[:CALLS]->(fn4),
  (fn9)-[:CALLS]->(fn6),
  (fn9)-[:CALLS]->(fn7),
  (fn9)-[:CALLS]->(fn8),
  (fn9)-[:USES]->(v2),
  (fn9)-[:USES]->(v5),
  (fn9)-[:USES]->(v6),
  (fn9)-[:USES]->(v7),
  (fn9)-[:USES]->(v8);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';

const API_BASE_URLS = (process.env.SMOKE_API_BASE_URL ?? 'http://127.0.0.1:8080,http://127.0.0.1:18080')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const MINIO_BASE_URL = process.env.SMOKE_MINIO_BASE_URL ?? 'http://127.0.0.1:9000';
const EXPECTED_BUCKET = process.env.SMOKE_MINIO_BUCKET ?? 'art-assets';
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 20_000);
const REQUIRE_MANAGEMENT = process.env.SMOKE_REQUIRE_MANAGEMENT === '1';

function url(path, baseUrl = API_BASE_URLS[0]) {
  return new URL(path, baseUrl).toString();
}

async function fetchWithTimeout(target, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(target, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`Request failed for ${target}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function expectJson(response, label) {
  const text = await response.text();
  expectStatus(response, response.status, label);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} returned non-JSON response: ${text.slice(0, 300)}`);
  }
}

function expectStatus(response, expected, label) {
  const statuses = Array.isArray(expected) ? expected : [expected];
  assert.ok(
    statuses.includes(response.status),
    `${label} expected HTTP ${statuses.join(' or ')}, got ${response.status}`
  );
}

async function getJson(path, label) {
  const response = await fetchApi(path);
  expectStatus(response, 200, label);
  return expectJson(response, label);
}

async function fetchApi(path, options = {}) {
  let lastError;
  for (const [index, baseUrl] of API_BASE_URLS.entries()) {
    try {
      const response = await fetchWithTimeout(url(path, baseUrl), options);
      if (response.status === 404 && index < API_BASE_URLS.length - 1) {
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error(`No API base URL configured for ${path}`);
}

async function uploadSmokeAsset(marker) {
  const form = new FormData();
  const content = `AssetsLake data lake smoke payload: ${marker}`;
  const blob = new Blob([content], { type: 'text/plain' });

  form.append('file', blob, `${marker}.txt`);
  form.append('name', marker);
  form.append('description', `Smoke test asset for ${marker}`);
  form.append('tags', `smoke,${marker}`);
  form.append('uploader', 'smoke-test');

  const response = await fetchApi('/api/assets/upload', {
    method: 'POST',
    body: form,
  });
  expectStatus(response, 201, 'asset upload');
  const body = await expectJson(response, 'asset upload');
  assert.equal(body.success, true, 'asset upload returns success');
  assert.ok(body.data.asset_id, 'asset upload returns asset_id');
  assert.equal(body.data.bucket, EXPECTED_BUCKET, 'asset upload writes expected bucket');
  assert.ok(body.data.object_key, 'asset upload returns object key');
  assert.ok(body.data.file_url, 'asset upload returns public file URL');
  assert.equal(body.data.name, marker, 'asset upload stores name');
  assert.equal(body.data.original_filename, `${marker}.txt`, 'asset upload stores original filename');
  assert.equal(body.data.file_size, content.length, 'asset upload stores expected byte size');

  return { ...body.data, content };
}

async function deleteSmokeAsset(assetId) {
  const response = await fetchApi(`/api/assets/${assetId}`, {
    method: 'DELETE',
  });
  expectStatus(response, 200, 'asset cleanup delete');
}

test('AssetsLake data lake smoke test', async () => {
  const marker = `smoke-${Date.now()}`;
  let assetId;

  try {
    const health = await getJson('/api/health', 'backend health');
    assert.equal(health.status, 'ok', 'backend health is ok');

    if (REQUIRE_MANAGEMENT) {
      const intelligence = await getJson('/api/management/intelligence', 'management intelligence');
      assert.equal(intelligence.success, true, 'management intelligence returns ApiResponse');
      assert.ok(
        intelligence.data.langgraph_nodes.length > 0,
        'management intelligence exposes LangGraph nodes'
      );
    }

    const minioHealth = await fetchWithTimeout(`${MINIO_BASE_URL}/minio/health/live`);
    expectStatus(minioHealth, 200, 'MinIO live health');

    const upload = await uploadSmokeAsset(marker);
    assetId = upload.asset_id;

    const detail = await getJson(`/api/assets/${assetId}`, 'asset detail read');
    assert.equal(detail.success, true, 'asset detail returns ApiResponse');
    assert.equal(detail.data.id, assetId, 'asset detail reads uploaded id');
    assert.equal(detail.data.object_key, upload.object_key, 'asset detail reads uploaded object key');
    assert.equal(detail.data.checksum_sha256.length, 64, 'asset detail stores SHA-256 checksum');

    const listed = await getJson(
      `/api/assets?q=${encodeURIComponent(marker)}&page_size=5`,
      'asset list read'
    );
    assert.ok(
      listed.data.some((asset) => asset.id === assetId),
      'asset list can read uploaded smoke asset'
    );

    const searched = await getJson(
      `/api/assets/search?q=${encodeURIComponent(marker)}&page_size=5`,
      'asset search read'
    );
    assert.ok(
      searched.data.some((asset) => asset.id === assetId),
      'asset search can read uploaded smoke asset'
    );

    const objectResponse = await fetchWithTimeout(upload.file_url);
    expectStatus(objectResponse, 200, 'MinIO public object read');
    assert.equal(await objectResponse.text(), upload.content, 'MinIO object content round trips');
  } finally {
    if (assetId && process.env.SMOKE_KEEP_ASSET !== '1') {
      await deleteSmokeAsset(assetId);
    }
  }
});
