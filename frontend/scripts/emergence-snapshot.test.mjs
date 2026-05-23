/*
```cypher
CREATE
  (f:File {name: "emergence-snapshot.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.emergence_snapshot", type: "module"}),
  (fn1:Function {name: "jsonRequest", type: "function", language: "javascript", signature: "async function jsonRequest(path)"}),
  (fn2:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(result, status, label)"}),
  (fn3:Function {name: "test_emergence_snapshot_contract", type: "function", language: "javascript", signature: "test('emergence snapshot returns cross-app operating contract', async () => void)"}),
  (v1:Variable {name: "API_BASE", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:USES]->(v1),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';

const API_BASE =
  process.env.ASSETSLAKE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:18080';

async function jsonRequest(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

function expectStatus(result, status, label) {
  assert.equal(
    result.response.status,
    status,
    `${label} expected HTTP ${status}, got HTTP ${result.response.status}: ${JSON.stringify(result.body)}`
  );
}

test('emergence snapshot returns cross-app operating contract', async () => {
  const result = await jsonRequest('/api/management/emergence');
  expectStatus(result, 200, 'emergence snapshot');

  const snapshot = result.body.data;
  assert.equal(result.body.success, true);
  assert.ok(['sense', 'decide', 'act'].includes(snapshot.posture));
  assert.ok(Number.isInteger(snapshot.readiness_percent));
  assert.ok(Number.isInteger(snapshot.evidence_coverage_percent));
  assert.ok(Number.isInteger(snapshot.flow_health_percent));
  assert.ok(Number.isInteger(snapshot.ai_readiness_percent));
  assert.ok(Array.isArray(snapshot.loop_stages));
  assert.ok(Array.isArray(snapshot.signals));
  assert.ok(Array.isArray(snapshot.recommendations));
  assert.ok(snapshot.signals.some((signal) => signal.id === 'data_lake_evidence'));
  assert.ok(snapshot.recommendations.length >= 1);
});
