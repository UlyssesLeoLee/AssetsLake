/*
```cypher
CREATE
  (f:File {name: "board-planning-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/board-planning-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadBoardPlanningModel", type: "function", language: "javascript", signature: "function loadBoardPlanningModel()"}),
  (fn3:Function {name: "board planning model derives WIP, swimlanes, and risk queue", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "issues", type: "variable"}),
  (v6:Variable {name: "board", type: "variable"}),
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
  (fn3)-[:USES]->(v6);
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
  boardPlanningModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'boardPlanningModel.ts'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadBoardPlanningModel() {
  const source = readText(FILES.boardPlanningModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.boardPlanningModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in boardPlanningModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: FILES.boardPlanningModel, timeout: 1000 });
  return module.exports;
}

test('board planning model derives WIP, swimlanes, and risk queue', () => {
  const model = loadBoardPlanningModel();
  const issues = [
    {
      id: 'issue-a',
      issue_key: 'AL-001',
      title: 'Overdue Review',
      status: 'submitted',
      priority: 'urgent',
      due_date: '2026-05-18',
      story_points: 5,
      asset_count: 1,
      qa_status: 'passed',
    },
    {
      id: 'issue-b',
      issue_key: 'AL-002',
      title: 'Missing Evidence',
      status: 'internal_review',
      priority: 'high',
      due_date: '2026-05-22',
      story_points: 3,
      asset_count: 0,
      qa_status: 'pending',
    },
    {
      id: 'issue-c',
      issue_key: 'AL-003',
      title: 'QA Warning',
      status: 'in_progress',
      priority: 'medium',
      due_date: '2026-05-25',
      story_points: 2,
      asset_count: 2,
      qa_status: 'warning',
    },
    {
      id: 'issue-d',
      issue_key: 'AL-004',
      title: 'Healthy Work',
      status: 'assigned',
      priority: 'low',
      due_date: '2026-05-26',
      story_points: 1,
      asset_count: 1,
      qa_status: 'passed',
    },
  ];

  assert.equal(model.getBoardRisk(issues[0], '2026-05-20'), 'overdue');
  assert.equal(model.getBoardRisk(issues[1], '2026-05-20'), 'missing_evidence');

  const columns = model.buildBoardColumns(issues, ['submitted'], { submitted: 1 });
  assert.equal(columns[0].wipState, 'at_limit');
  assert.equal(columns[0].storyPoints, 5);

  const board = model.buildBoardPlanningModel(issues, '2026-05-20');
  assert.equal(board.totalIssues, 4);
  assert.equal(board.totalStoryPoints, 11);
  assert.equal(board.reviewPressureCount, 2);
  assert.equal(board.riskQueue[0].risk, 'overdue');
  assert.equal(board.riskQueue[1].risk, 'missing_evidence');
  assert.equal(board.riskQueue[2].risk, 'qa_warning');
  assert.equal(board.swimlanes.find((lane) => lane.priority === 'urgent').riskCount, 1);
  assert.equal(board.columns.find((column) => column.status === 'in_progress').count, 1);
});
