/*
```cypher
CREATE
  (f:File {name: "workflow-automation-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/workflow-automation-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadWorkflowAutomationModel", type: "function", language: "javascript", signature: "function loadWorkflowAutomationModel()"}),
  (fn3:Function {name: "workflow automation model builds guarded workflow and LangGraph execution plan", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "workflow", type: "variable"}),
  (v6:Variable {name: "designer", type: "variable"}),
  (v7:Variable {name: "automation", type: "variable"}),
  (v8:Variable {name: "plan", type: "variable"}),
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
  (fn3)-[:USES]->(v7),
  (fn3)-[:USES]->(v8);
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
  workflowAutomationModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'workflowAutomationModel.ts'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadWorkflowAutomationModel() {
  const source = readText(FILES.workflowAutomationModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.workflowAutomationModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in workflowAutomationModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: FILES.workflowAutomationModel, timeout: 1000 });
  return module.exports;
}

test('workflow automation model builds guarded workflow and LangGraph execution plan', () => {
  const model = loadWorkflowAutomationModel();
  const statuses = ['backlog', 'brief_ready', 'assigned', 'in_progress', 'submitted'];
  const workflow = {
    project_id: 'project-a',
    statuses,
    guards: ['assignment_required', 'asset_evidence_required'],
    validators: ['valid_transition', 'data_lake_evidence_present'],
    transitions: [
      {
        id: 'backlog_to_brief_ready',
        from_status: 'backlog',
        to_status: 'brief_ready',
        name: 'Backlog to Brief Ready',
        guard: 'required_fields',
        validator: 'valid_transition',
        approval_required: false,
        evidence_required: false,
        sla_hours: 8,
      },
      {
        id: 'brief_ready_to_assigned',
        from_status: 'brief_ready',
        to_status: 'assigned',
        name: 'Brief Ready to Assigned',
        guard: 'assignment_required',
        validator: 'data_lake_evidence_present',
        approval_required: true,
        evidence_required: true,
        sla_hours: 24,
      },
    ],
    approval_policy: {
      default_reviewer_role: 'art_director',
      data_lake_evidence_required: true,
      human_approval_statuses: ['assigned'],
      audit_event: 'workflow_transition_reviewed',
    },
  };

  const designer = model.buildWorkflowDesignerModel(workflow, statuses);
  assert.equal(designer.coveragePercent, 50);
  assert.equal(designer.evidenceGateCount, 1);
  assert.equal(designer.approvalGateCount, 1);
  assert.deepEqual(designer.missingTransitionPairs, ['assigned->in_progress', 'in_progress->submitted']);
  assert.equal(designer.transitions[1].gateSummary, 'assignment_required / data_lake_evidence_present / data_lake_evidence / human_approval');

  const fallbackDesigner = model.buildWorkflowDesignerModel(undefined, statuses);
  assert.equal(fallbackDesigner.transitions.length, 4);
  assert.equal(fallbackDesigner.coveragePercent, 100);

  const automation = {
    project_id: 'project-a',
    rules: [
      {
        id: 'overdue_escalation',
        name: 'Overdue Escalation',
        trigger: 'issue_due_date_missed',
        conditions: ['status_not_delivered', 'data_lake_evidence_present'],
        actions: ['notify_producer'],
        langgraph_node: 'priority_planner',
        guardrail: 'human_review_required',
        enabled: true,
        approval_required: true,
      },
      {
        id: 'delivery_readiness',
        name: 'Delivery Readiness',
        trigger: 'approved_assets_ready',
        conditions: ['no_blocking_dependencies'],
        actions: ['package_delivery_manifest'],
        langgraph_node: 'action_proposer',
        guardrail: 'human_review_required',
        enabled: true,
        approval_required: false,
      },
      {
        id: 'disabled_rule',
        name: 'Disabled Rule',
        trigger: 'manual',
        conditions: [],
        actions: [],
        langgraph_node: 'archived_node',
        guardrail: 'disabled',
        enabled: false,
        approval_required: false,
      },
    ],
    langgraph_nodes: ['priority_planner', 'action_proposer'],
    runbook: [
      {
        id: 'retrieve-evidence',
        node: 'evidence_retriever',
        action: 'load_asset_lineage_and_history',
        reads: ['data_lake'],
        writes: ['evidence_summary'],
        requires_approval: false,
      },
    ],
    guardrail: 'human_review_required',
  };

  const plan = model.buildAutomationExecutionPlan(automation);
  assert.equal(plan.enabledCount, 2);
  assert.equal(plan.approvalRequiredCount, 1);
  assert.equal(plan.dataLakeReadCount, 2);
  assert.equal(plan.graphCoveragePercent, 100);
  assert.equal(plan.rules[0].state, 'needs_approval');
  assert.equal(plan.rules[1].state, 'ready');
  assert.equal(plan.rules[2].state, 'disabled');
  assert.equal(plan.runbook[0].node, 'evidence_retriever');
});
