/*
```cypher
CREATE
  (f:File {name: "calendar-workload-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/calendar-workload-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadCalendarWorkloadModel", type: "function", language: "javascript", signature: "function loadCalendarWorkloadModel()"}),
  (fn3:Function {name: "calendar workload model sorts events and derives lane risk", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "calendar", type: "variable"}),
  (v6:Variable {name: "workloadModel", type: "variable"}),
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
  calendarWorkloadModel: join(
    FRONTEND_ROOT,
    'src',
    'plugin-groups',
    'production',
    'calendarWorkloadModel.ts',
  ),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadCalendarWorkloadModel() {
  const source = readText(FILES.calendarWorkloadModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.calendarWorkloadModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in calendarWorkloadModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, {
    filename: FILES.calendarWorkloadModel,
    timeout: 1000,
  });
  return module.exports;
}

test('calendar workload model sorts events and derives lane risk', () => {
  const model = loadCalendarWorkloadModel();
  const calendar = {
    project_id: 'project-a',
    events: [
      {
        id: 'vendor-a',
        title: 'Vendor Package',
        item_type: 'issue_due_date',
        date: '2026-05-23',
        end_date: '2026-05-23',
        status: 'approved',
        lane: 'vendor',
        risk: 'missing_evidence',
        owner: 'Vendor Lead',
      },
      {
        id: 'sprint-a',
        title: 'Sprint Task',
        item_type: 'issue_due_date',
        date: '2026-05-21',
        end_date: '2026-05-21',
        status: 'in_progress',
        lane: 'sprint',
        risk: 'normal',
        owner: 'Producer',
      },
      {
        id: 'review-a',
        title: 'Review Gate',
        item_type: 'issue_due_date',
        date: '2026-05-22',
        end_date: '2026-05-22',
        status: 'submitted',
        lane: 'review',
        risk: 'blocked',
        owner: 'Reviewer',
      },
    ],
    lanes: [
      {
        id: 'sprint',
        label: 'Sprint Plan',
        calendar_type: 'sprint',
        status: 'ready',
        event_count: 1,
      },
      {
        id: 'review',
        label: 'Review Windows',
        calendar_type: 'review',
        status: 'ready',
        event_count: 1,
      },
      {
        id: 'vendor',
        label: 'Vendor Delivery',
        calendar_type: 'vendor',
        status: 'ready',
        event_count: 1,
      },
    ],
    workload: [
      { date: '2026-05-21', total: 1, review: 0, vendor: 0, risk: 0 },
      { date: '2026-05-22', total: 2, review: 1, vendor: 0, risk: 1 },
      { date: '2026-05-23', total: 1, review: 0, vendor: 1, risk: 1 },
    ],
    review_calendar: 'ready',
    vendor_delivery_calendar: 'ready',
  };

  assert.equal(
    JSON.stringify(model.sortEventsByDate(calendar.events).map((event) => event.id)),
    '["sprint-a","review-a","vendor-a"]',
  );

  const workloadModel = model.buildCalendarWorkloadModel(calendar, 4);
  assert.equal(workloadModel.eventCount, 3);
  assert.equal(workloadModel.riskCount, 2);
  assert.equal(workloadModel.undatedCount, 4);
  assert.equal(workloadModel.nextEventDate, '2026-05-21');
  assert.equal(workloadModel.laneSummaries.find((lane) => lane.id === 'review').risk_count, 1);
  assert.equal(workloadModel.laneSummaries.find((lane) => lane.id === 'vendor').risk_count, 1);
  assert.equal(workloadModel.workload[1].risk, 1);

  const emptyModel = model.buildCalendarWorkloadModel(undefined, 2);
  assert.equal(emptyModel.eventCount, 0);
  assert.equal(emptyModel.riskCount, 0);
  assert.equal(emptyModel.undatedCount, 2);
  assert.equal(emptyModel.nextEventDate, undefined);
});
