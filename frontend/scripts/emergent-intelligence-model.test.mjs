/*
```cypher
CREATE
  (f:File {name: "emergent-intelligence-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/emergent-intelligence-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadEmergentIntelligenceModel", type: "function", language: "javascript", signature: "function loadEmergentIntelligenceModel()"}),
  (fn3:Function {name: "emergent model combines lake evidence, project flow, and AI readiness", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "issues", type: "variable"}),
  (v6:Variable {name: "intelligence", type: "variable"}),
  (v7:Variable {name: "operatingModel", type: "variable"}),
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
  emergentIntelligenceModel: join(
    FRONTEND_ROOT,
    'src',
    'plugin-groups',
    'production',
    'emergentIntelligenceModel.ts',
  ),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadEmergentIntelligenceModel() {
  const source = readText(FILES.emergentIntelligenceModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.emergentIntelligenceModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in emergentIntelligenceModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, {
    filename: FILES.emergentIntelligenceModel,
    timeout: 1000,
  });
  return module.exports;
}

test('emergent model combines lake evidence, project flow, and AI readiness', () => {
  const model = loadEmergentIntelligenceModel();
  const issues = [
    {
      id: 'issue-a',
      issue_key: 'AL-001',
      project_id: 'project-a',
      title: 'Submitted without evidence',
      status: 'submitted',
      priority: 'urgent',
      due_date: '2026-05-18',
      asset_count: 0,
      qa_status: 'pending',
      rank_key: 'a',
      revision_count: 0,
      created_at: '2026-05-01',
      updated_at: '2026-05-19',
    },
    {
      id: 'issue-b',
      issue_key: 'AL-002',
      project_id: 'project-a',
      title: 'QA warning work',
      status: 'in_progress',
      priority: 'high',
      due_date: '2026-05-25',
      asset_count: 2,
      qa_status: 'warning',
      rank_key: 'b',
      revision_count: 1,
      created_at: '2026-05-02',
      updated_at: '2026-05-19',
    },
    {
      id: 'issue-c',
      issue_key: 'AL-003',
      project_id: 'project-a',
      title: 'Approved delivery candidate',
      status: 'approved',
      priority: 'medium',
      due_date: '2026-05-23',
      asset_count: 1,
      qa_status: 'passed',
      rank_key: 'c',
      revision_count: 0,
      created_at: '2026-05-03',
      updated_at: '2026-05-19',
    },
  ];
  const intelligence = {
    product_surface: 'management',
    langgraph_nodes: [
      { name: 'Intake Classifier', state: 'ready', detail: 'normalizes work' },
      { name: 'Priority Planner', state: 'ready', detail: 'scores risk' },
      { name: 'Evidence Retriever', state: 'ready', detail: 'reads lake evidence' },
      { name: 'Automation Executor', state: 'guarded', detail: 'proposes actions' },
    ],
    data_lake_feeds: [
      { name: 'Issue Event Stream', detail: 'status changes' },
      { name: 'Asset Evidence Lake', detail: 'asset lineage' },
    ],
    automation_rules: [
      { name: 'Overdue Escalation', detail: 'producer review', guardrail: 'human_review_required' },
      { name: 'Delivery Readiness', detail: 'package checks', guardrail: 'human_review_required' },
    ],
    ai_status: { configured: true, used: true, provider: 'nvidia', model: 'nemotron' },
  };

  const operatingModel = model.buildEmergentOperatingModel({
    issues,
    assetTotal: 7,
    milestoneTotal: 2,
    intelligence,
    today: '2026-05-20',
  });

  assert.equal(operatingModel.mode, 'sense');
  assert.equal(operatingModel.evidenceCoveragePercent, 67);
  assert.equal(operatingModel.riskCount, 3);
  assert.ok(operatingModel.aiReadinessPercent >= 90);
  assert.equal(operatingModel.signals.length, 4);
  assert.equal(operatingModel.recommendations[0].id, 'evidence_gate');
  assert.equal(
    operatingModel.recommendations.some((item) => item.id === 'delivery_package'),
    true,
  );
});
