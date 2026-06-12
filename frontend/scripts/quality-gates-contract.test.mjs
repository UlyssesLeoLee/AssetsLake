/*
```cypher
CREATE
  (f:File {name: "quality-gates-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.quality_gates_contract", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(path)"}),
  (fn2:Function {name: "expectIncludes", type: "function", language: "javascript", signature: "function expectIncludes(content, expected, label)"}),
  (fn3:Function {name: "quality gates preserve automated UT to UAT scripts", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "REPO_ROOT", type: "variable"}),
  (v2:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v3:Variable {name: "FILES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v3);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const FRONTEND_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REPO_ROOT = dirname(FRONTEND_ROOT);
const FILES = {
  packageJson: join(FRONTEND_ROOT, 'package.json'),
  qualityGateScript: join(REPO_ROOT, 'scripts', 'test-assetslake-quality-gates.ps1'),
  testStrategyDoc: join(REPO_ROOT, 'docs', 'test-strategy-ut-to-uat.md'),
  k6Readme: join(REPO_ROOT, 'perf', 'k6', 'README.md'),
  k6Script: join(REPO_ROOT, 'perf', 'k6', 'assetslake-api-load.js'),
};

function readText(path) {
  return readFileSync(path, 'utf8');
}

function expectIncludes(content, expected, label) {
  assert.ok(content.includes(expected), `${label} must include ${expected}`);
}

test('quality gates preserve automated UT to UAT scripts', () => {
  const packageJson = readText(FILES.packageJson);
  const qualityGateScript = readText(FILES.qualityGateScript);
  const testStrategyDoc = readText(FILES.testStrategyDoc);
  const k6Readme = readText(FILES.k6Readme);
  const k6Script = readText(FILES.k6Script);

  expectIncludes(packageJson, '"test:contract"', 'package scripts expose contract gate');
  expectIncludes(packageJson, '"test:uat"', 'package scripts expose UAT gate');
  expectIncludes(packageJson, '"test:quality:local"', 'package scripts expose local quality gate');
  expectIncludes(packageJson, '"test:quality:live"', 'package scripts expose live quality gate');

  for (const layer of ['static', 'ut', 'contract', 'it', 'e2e', 'uat', 'smoke', 'perf']) {
    expectIncludes(qualityGateScript, `'${layer}'`, `quality gate script keeps ${layer} layer`);
    expectIncludes(testStrategyDoc, `\`${layer}\``, `test strategy documents ${layer} layer`);
  }

  expectIncludes(
    qualityGateScript,
    'pnpm run $ScriptName',
    'quality gate script runs retained pnpm scripts',
  );
  expectIncludes(qualityGateScript, 'cargo test', 'quality gate script runs Rust unit tests');
  expectIncludes(
    qualityGateScript,
    'grafana/k6:latest',
    'quality gate script runs k6 through Docker',
  );
  expectIncludes(k6Readme, 'grafana/k6:latest', 'k6 README keeps Docker test command');
  expectIncludes(k6Script, 'constant-arrival-rate', 'k6 script keeps mature load-test executor');
});
