/*
```cypher
CREATE
  (f:File {name: "playwright-artifacts.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/playwright-artifacts.test", type: "module"}),
  (fn1:Function {name: "readJson", type: "function", language: "javascript", signature: "function readJson(filePath)"}),
  (fn2:Function {name: "flattenSpecs", type: "function", language: "javascript", signature: "function flattenSpecs(suites)"}),
  (fn3:Function {name: "latestResult", type: "function", language: "javascript", signature: "function latestResult(testCase)"}),
  (fn4:Function {name: "traceAttachment", type: "function", language: "javascript", signature: "function traceAttachment(result)"}),
  (fn5:Function {name: "assertFileMinSize", type: "function", language: "javascript", signature: "function assertFileMinSize(filePath, minBytes, label)"}),
  (fn6:Function {name: "playwright trace and report artifacts are retained", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "RESULTS_PATH", type: "variable"}),
  (v3:Variable {name: "REPORT_PATH", type: "variable"}),
  (v4:Variable {name: "MIN_TRACE_BYTES", type: "variable"}),
  (v5:Variable {name: "results", type: "variable"}),
  (v6:Variable {name: "specs", type: "variable"}),
  (v7:Variable {name: "result", type: "variable"}),
  (v8:Variable {name: "trace", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v7),
  (fn4)-[:USES]->(v8),
  (fn6)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn2),
  (fn6)-[:CALLS]->(fn3),
  (fn6)-[:CALLS]->(fn4),
  (fn6)-[:CALLS]->(fn5),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2),
  (fn6)-[:USES]->(v3),
  (fn6)-[:USES]->(v4),
  (fn6)-[:USES]->(v5),
  (fn6)-[:USES]->(v6),
  (fn6)-[:USES]->(v7),
  (fn6)-[:USES]->(v8);
```
*/

import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RESULTS_PATH = join(FRONTEND_ROOT, 'test-results', 'playwright-results.json');
const REPORT_PATH = join(FRONTEND_ROOT, 'playwright-report', 'index.html');
const MIN_TRACE_BYTES = 1024;

function readJson(filePath) {
  assert.ok(existsSync(filePath), `${filePath} exists`);
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function flattenSpecs(suites) {
  return suites.flatMap((suite) => [...(suite.specs ?? []), ...flattenSpecs(suite.suites ?? [])]);
}

function latestResult(testCase) {
  const result = testCase.results?.at(-1);
  assert.ok(result, `${testCase.projectName} has a result`);
  return result;
}

function traceAttachment(result) {
  const trace = result.attachments?.find(
    (attachment) => attachment.name === 'trace' && attachment.contentType === 'application/zip'
  );
  assert.ok(trace?.path, 'Playwright result has a trace.zip attachment');
  return trace;
}

function assertFileMinSize(filePath, minBytes, label) {
  assert.ok(existsSync(filePath), `${label} exists at ${filePath}`);
  assert.ok(statSync(filePath).size >= minBytes, `${label} is at least ${minBytes} bytes`);
}

test('playwright trace and report artifacts are retained', () => {
  const results = readJson(RESULTS_PATH);
  const specs = flattenSpecs(results.suites ?? []);

  assert.ok(specs.length >= 1, 'Playwright result includes at least one traced spec');
  assert.equal(results.stats?.unexpected, 0, 'Playwright run has no unexpected failures');
  assert.equal(results.stats?.flaky, 0, 'Playwright run has no flaky tests');

  for (const spec of specs) {
    assert.equal(spec.ok, true, `${spec.title} passed`);
    for (const testCase of spec.tests ?? []) {
      assert.equal(testCase.status, 'expected', `${spec.title} has expected status`);
      const result = latestResult(testCase);
      assert.equal(result.status, 'passed', `${spec.title} latest run passed`);
      const trace = traceAttachment(result);
      assertFileMinSize(trace.path, MIN_TRACE_BYTES, `${spec.title} trace.zip`);
    }
  }

  assertFileMinSize(REPORT_PATH, MIN_TRACE_BYTES, 'Playwright HTML report');
});
