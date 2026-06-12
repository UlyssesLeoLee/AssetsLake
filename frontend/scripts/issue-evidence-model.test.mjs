/*
```cypher
CREATE
  (f:File {name: "issue-evidence-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/issue-evidence-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadIssueEvidenceModel", type: "function", language: "javascript", signature: "function loadIssueEvidenceModel()"}),
  (fn3:Function {name: "issue evidence model derives readiness, data lake links, and LangGraph suggestions", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "issue", type: "variable"}),
  (v6:Variable {name: "assets", type: "variable"}),
  (v7:Variable {name: "evidence", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v4),
  (fn3)-[:USES]->(v5),
  (fn3)-[:USES]->(v6),
  (fn3)-[:USES]->(v7);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = {
  issueEvidenceModel: join(
    FRONTEND_ROOT,
    'src',
    'plugin-groups',
    'production',
    'issueEvidenceModel.ts',
  ),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadIssueEvidenceModel() {
  const source = readText(FILES.issueEvidenceModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.issueEvidenceModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in issueEvidenceModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, {
    filename: FILES.issueEvidenceModel,
    timeout: 1000,
  });
  return module.exports;
}

test('issue evidence model derives readiness, data lake links, and LangGraph suggestions', () => {
  const model = loadIssueEvidenceModel();
  const issue = {
    id: 'issue-a',
    issue_key: 'AL-001',
    title: 'Client Review',
    status: 'submitted',
    priority: 'urgent',
    due_date: '2026-05-21',
    qa_status: 'warning',
    revision_count: 1,
  };
  const assets = [
    {
      id: 'asset-a',
      name: 'Concept Board',
      asset_type: 'concept_art',
      status: 'active',
      link_type: 'reference',
    },
  ];
  const history = [{ id: 'history-a', to_status: 'submitted' }];
  const comments = [{ id: 'comment-a', body: 'Needs client context.' }];

  assert.equal(model.deriveEvidenceRisk(issue, assets), 'watch');
  assert.equal(model.buildDataLakeEvidenceLinks(assets).length, 2);

  const evidence = model.buildIssueEvidenceModel(issue, assets, history, comments);
  assert.equal(evidence.readinessPercent, 75);
  assert.equal(evidence.risk, 'watch');
  assert.equal(evidence.missingEvidenceCount, 1);
  assert.equal(evidence.approvalRequired, true);
  assert.equal(evidence.suggestions[0].node, 'evidence_retriever');
  assert.equal(
    evidence.suggestions.some((suggestion) => suggestion.node === 'priority_planner'),
    true,
  );
  assert.equal(
    evidence.suggestions.some((suggestion) => suggestion.node === 'action_proposer'),
    true,
  );

  const blocked = model.buildIssueEvidenceModel({ ...issue, qa_status: 'pending' }, [], [], []);
  assert.equal(blocked.risk, 'blocked');
  assert.equal(blocked.missingEvidenceCount, 3);
});
