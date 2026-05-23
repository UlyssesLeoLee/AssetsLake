/*
```cypher
CREATE
  (f:File {name: "WorkflowPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/WorkflowPage", type: "module"}),
  (fn1:Function {name: "WorkflowPage", type: "function", language: "typescript", signature: "function WorkflowPage()"}),
  (v1:Variable {name: "workflow", type: "variable"}),
  (v2:Variable {name: "workflowModel", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2);
```
*/

'use client';

import { ShieldCheck } from 'lucide-react';

import { useProjectWorkflow } from '@/hooks/useProjectManagement';
import type { IssueStatus } from '@/types/production';
import { WorkflowPolicyPanel, WorkflowTransitionDesigner } from '@/plugin-groups/production/WorkflowAutomationPrimitives';
import { buildWorkflowDesignerModel, labelStatus } from '@/plugin-groups/production/workflowAutomationModel';
import {
  DEFAULT_PROJECT_ID,
  Metric,
  PageShell,
  Panel,
  WORKFLOW_STEPS,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function WorkflowPage() {
  const { data: workflow } = useProjectWorkflow(DEFAULT_PROJECT_ID);
  const workflowModel = buildWorkflowDesignerModel(workflow, Array.from(WORKFLOW_STEPS) as IssueStatus[]);

  return (
    <PageShell title="Workflow" subtitle="Configurable statuses, transitions, validators, guards, and approval policy">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Statuses" value={workflowModel.statuses.length} detail="workflow states" />
        <Metric label="Transitions" value={workflowModel.transitions.length} detail="configured edges" tone="text-cyan-300" />
        <Metric label="Evidence Gates" value={workflowModel.evidenceGateCount} detail="data lake checks" tone="text-emerald-300" />
        <Metric label="Approval Gates" value={workflowModel.approvalGateCount} detail="human review" tone="text-amber-300" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Panel title="Status Ladder" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {workflowModel.statuses.map((status, index) => (
              <div key={status} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                <div className="text-xs text-slate-500">Step {index + 1}</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">{labelStatus(status)}</div>
                <div className="mt-2 text-xs text-slate-500">transition policy</div>
              </div>
            ))}
          </div>
        </Panel>
        <WorkflowPolicyPanel model={workflowModel} />
      </div>
      <div className="mt-5">
        <WorkflowTransitionDesigner model={workflowModel} />
      </div>
    </PageShell>
  );
}

export default WorkflowPage;
