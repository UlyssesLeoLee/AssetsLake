/*
```cypher
CREATE
  (f:File {name: "gantt-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/gantt-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadGanttModel", type: "function", language: "javascript", signature: "function loadGanttModel()"}),
  (fn3:Function {name: "gantt timeline model lays out blocking path", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "items", type: "variable"}),
  (v6:Variable {name: "dependencies", type: "variable"}),
  (v7:Variable {name: "timeline", type: "variable"}),
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
  ganttModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'ganttModel.ts'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadGanttModel() {
  const source = readText(FILES.ganttModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.ganttModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in ganttModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: FILES.ganttModel, timeout: 1000 });
  return module.exports;
}

test('gantt timeline model lays out blocking path', () => {
  const model = loadGanttModel();
  const items = [
    {
      id: 'issue-a',
      issue_key: 'AL-1',
      title: 'Concept lock',
      status: 'in_progress',
      priority: 'high',
      start_date: '2026-05-01',
      due_date: '2026-05-04',
      story_points: 4,
      dependency_count: 1,
    },
    {
      id: 'issue-b',
      issue_key: 'AL-2',
      title: 'Model pass',
      status: 'assigned',
      priority: 'urgent',
      due_date: '2026-05-08',
      story_points: 3,
      dependency_count: 2,
    },
    {
      id: 'issue-c',
      issue_key: 'AL-3',
      title: 'Client review',
      status: 'brief_ready',
      priority: 'medium',
      due_date: '2026-05-10',
      story_points: 2,
      dependency_count: 1,
    },
    {
      id: 'issue-d',
      issue_key: 'AL-4',
      title: 'Unscheduled polish',
      status: 'backlog',
      priority: 'low',
      dependency_count: 0,
    },
  ];
  const dependencies = [
    {
      id: 'dep-a-b',
      source_issue_id: 'issue-a',
      target_issue_id: 'issue-b',
      dependency_type: 'blocks',
    },
    {
      id: 'dep-c-b',
      source_issue_id: 'issue-c',
      target_issue_id: 'issue-b',
      dependency_type: 'is_blocked_by',
    },
    {
      id: 'dep-d-a',
      source_issue_id: 'issue-d',
      target_issue_id: 'issue-a',
      dependency_type: 'relates_to',
    },
  ];

  const timeline = model.buildGanttTimelineModel(items, dependencies, '2026-05-02');
  const rowsById = new Map(timeline.rows.map((row) => [row.item.id, row]));

  assert.equal(timeline.blockingEdges.length, 2);
  assert.deepEqual(Array.from(timeline.criticalPath.issueIds), ['issue-a', 'issue-b', 'issue-c']);
  assert.equal(timeline.criticalPath.durationDays, 9);
  assert.equal(rowsById.get('issue-a').blocks, 1);
  assert.equal(rowsById.get('issue-a').isCriticalPath, true);
  assert.equal(rowsById.get('issue-b').blockedBy, 1);
  assert.equal(rowsById.get('issue-b').scheduleRisk, 'blocked');
  assert.equal(rowsById.get('issue-d').scheduleRisk, 'unscheduled');
  assert.equal(model.formatGanttDateRange('2026-05-01', '2026-05-04'), '2026-05-01 to 2026-05-04');

  const reversed = model.normalizeBlockingEdge(
    dependencies[1],
    new Set(items.map((item) => item.id)),
  );
  assert.equal(reversed.fromIssueId, 'issue-b');
  assert.equal(reversed.toIssueId, 'issue-c');
  assert.equal(
    model.normalizeBlockingEdge(dependencies[2], new Set(items.map((item) => item.id))),
    undefined,
  );
});
