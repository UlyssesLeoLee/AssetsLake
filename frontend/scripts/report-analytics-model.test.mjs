/*
```cypher
CREATE
  (f:File {name: "report-analytics-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/report-analytics-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadReportAnalyticsModel", type: "function", language: "javascript", signature: "function loadReportAnalyticsModel()"}),
  (fn3:Function {name: "report analytics model builds dashboard KPIs, flow, SLA, and readiness", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "reports", type: "variable"}),
  (v6:Variable {name: "dashboard", type: "variable"}),
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
  reportAnalyticsModel: join(
    FRONTEND_ROOT,
    'src',
    'plugin-groups',
    'production',
    'reportAnalyticsModel.ts',
  ),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadReportAnalyticsModel() {
  const source = readText(FILES.reportAnalyticsModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.reportAnalyticsModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in reportAnalyticsModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, {
    filename: FILES.reportAnalyticsModel,
    timeout: 1000,
  });
  return module.exports;
}

test('report analytics model builds dashboard KPIs, flow, SLA, and readiness', () => {
  const model = loadReportAnalyticsModel();
  const reports = {
    project_id: 'project-a',
    burndown: {
      open: 6,
      closed: 4,
      points: [
        { label: 'Start', open: 10, closed: 0, ideal_remaining: 10 },
        { label: 'Now', open: 6, closed: 4, ideal_remaining: 0 },
      ],
    },
    velocity: {
      sprints: 2,
      status: 'calculated_from_story_points',
      average_completed: 7,
      predictability_percent: 88,
      points: [
        { sprint: 'Sprint 1', committed: 8, completed: 7, carryover: 1 },
        { sprint: 'Sprint 2', committed: 8, completed: 7, carryover: 1 },
      ],
    },
    cumulative_flow: {
      backlog: 2,
      active: 3,
      review: 1,
      done: 4,
      points: [{ label: 'Now', backlog: 2, active: 3, review: 1, done: 4 }],
    },
    cycle_time: {
      event_samples: 9,
      metrics: [{ name: 'Review Turnaround', average_hours: 20, p85_hours: 36, sample_size: 4 }],
    },
    sla: {
      overall_compliance_percent: 72,
      metrics: [
        { name: 'Review SLA', target_hours: 24, breached: 1, total: 4, compliance_percent: 75 },
      ],
    },
    delivery_readiness: {
      dependency_count: 3,
      epic_count: 2,
      blocked_count: 2,
      missing_evidence_count: 1,
      ready_percent: 72,
    },
  };

  const dashboard = model.buildReportsDashboardModel(reports);
  assert.equal(dashboard.kpis[1].detail, '40% complete');
  assert.equal(dashboard.burndownPoints.length, 2);
  assert.equal(
    JSON.stringify(dashboard.flowSegments.map((segment) => segment.percent)),
    '[20,30,10,40]',
  );
  assert.equal(dashboard.velocityAverage, 7);
  assert.equal(dashboard.velocityPredictability, '88%');
  assert.equal(dashboard.cycleMetrics[0].p85_hours, 36);
  assert.equal(dashboard.slaMetrics[0].compliance_percent, 75);
  assert.equal(dashboard.readinessStatus, 'watch');

  const emptyDashboard = model.buildReportsDashboardModel(undefined);
  assert.equal(emptyDashboard.kpis[0].value, 0);
  assert.equal(emptyDashboard.burndownPoints[0].label, 'Current');
  assert.equal(emptyDashboard.readinessStatus, 'blocked');
});
