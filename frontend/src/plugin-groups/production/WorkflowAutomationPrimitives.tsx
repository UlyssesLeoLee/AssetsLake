/*
```cypher
CREATE
  (f:File {name: "WorkflowAutomationPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/WorkflowAutomationPrimitives", type: "module"}),
  (fn1:Function {name: "WorkflowTransitionDesigner", type: "function", language: "typescript", signature: "function WorkflowTransitionDesigner(props: { model: WorkflowDesignerModel })"}),
  (fn2:Function {name: "WorkflowPolicyPanel", type: "function", language: "typescript", signature: "function WorkflowPolicyPanel(props: { model: WorkflowDesignerModel })"}),
  (fn3:Function {name: "AutomationRuleCards", type: "function", language: "typescript", signature: "function AutomationRuleCards(props: { plan: AutomationExecutionPlan })"}),
  (fn4:Function {name: "AutomationExecutionPlanPanel", type: "function", language: "typescript", signature: "function AutomationExecutionPlanPanel(props: { plan: AutomationExecutionPlan })"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "plan", type: "variable"}),
  (v3:Variable {name: "transition", type: "variable"}),
  (v4:Variable {name: "rule", type: "variable"}),
  (v5:Variable {name: "step", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v4),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v5);
```
*/

import { CheckCircle2, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';

import type {
  AutomationExecutionPlan,
  WorkflowDesignerModel,
} from '@/plugin-groups/production/workflowAutomationModel';
import { labelStatus } from '@/plugin-groups/production/workflowAutomationModel';
import { Panel } from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function WorkflowTransitionDesigner({ model }: { model: WorkflowDesignerModel }) {
  return (
    <Panel title="Transition Designer" icon={<GitBranch className="h-4 w-4" />}>
      <div className="grid gap-3">
        {model.transitions.map((transition) => (
          <div
            key={transition.id}
            className="grid gap-3 rounded-md border border-surface-border bg-slate-900/40 p-3 md:grid-cols-[1fr_1fr_1.4fr_auto]"
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">From</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {transition.fromLabel}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">To</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{transition.toLabel}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Gate</div>
              <div className="mt-1 text-sm text-slate-300">{transition.gateSummary}</div>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              {transition.evidence_required && (
                <span className="badge border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  Evidence
                </span>
              )}
              {transition.approval_required && (
                <span className="badge border-amber-500/30 bg-amber-500/10 text-amber-300">
                  Approval
                </span>
              )}
              <span className="badge border-slate-700 bg-slate-900 text-slate-300">
                {transition.sla_hours}h
              </span>
            </div>
          </div>
        ))}
        {model.missingTransitionPairs.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            Missing: {model.missingTransitionPairs.join(', ')}
          </div>
        )}
      </div>
    </Panel>
  );
}

export function WorkflowPolicyPanel({ model }: { model: WorkflowDesignerModel }) {
  return (
    <Panel title="Guards & Validators" icon={<ShieldCheck className="h-4 w-4" />}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md border border-surface-border bg-slate-900/40 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Coverage</div>
            <div className="mt-1 text-lg font-semibold text-emerald-300">
              {model.coveragePercent}%
            </div>
          </div>
          <div className="rounded-md border border-surface-border bg-slate-900/40 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Evidence</div>
            <div className="mt-1 text-lg font-semibold text-cyan-300">
              {model.evidenceGateCount}
            </div>
          </div>
          <div className="rounded-md border border-surface-border bg-slate-900/40 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Approvals</div>
            <div className="mt-1 text-lg font-semibold text-amber-300">
              {model.approvalGateCount}
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Human Review</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {model.humanApprovalStatuses.map((status) => (
              <span
                key={status}
                className="badge border-amber-500/30 bg-amber-500/10 text-amber-300"
              >
                {labelStatus(status)}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-surface-border bg-slate-900/40 p-3 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">{model.policy.default_reviewer_role}</div>
          <div className="mt-1 text-slate-400">{model.policy.audit_event}</div>
        </div>
      </div>
    </Panel>
  );
}

export function AutomationRuleCards({ plan }: { plan: AutomationExecutionPlan }) {
  return (
    <Panel title="Automation Rules" icon={<Sparkles className="h-4 w-4" />}>
      <div className="grid gap-3 md:grid-cols-2">
        {plan.rules.map(({ rule, state, conditionCount, actionCount, readsDataLake }) => (
          <div
            key={rule.id}
            className="rounded-md border border-surface-border bg-slate-900/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-100">{rule.name}</div>
                <div className="mt-1 text-xs text-slate-500">{rule.trigger}</div>
              </div>
              <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300">
                {state}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border border-surface-border bg-slate-950/40 p-2">
                <div className="text-slate-500">Conditions</div>
                <div className="mt-1 font-semibold text-slate-100">{conditionCount}</div>
              </div>
              <div className="rounded-md border border-surface-border bg-slate-950/40 p-2">
                <div className="text-slate-500">Actions</div>
                <div className="mt-1 font-semibold text-slate-100">{actionCount}</div>
              </div>
              <div className="rounded-md border border-surface-border bg-slate-950/40 p-2">
                <div className="text-slate-500">Lake</div>
                <div className="mt-1 font-semibold text-slate-100">
                  {readsDataLake ? 'yes' : 'no'}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs uppercase tracking-wide text-cyan-300">
              {rule.langgraph_node}
            </div>
          </div>
        ))}
        {plan.rules.length === 0 && (
          <div className="p-4 text-sm text-slate-500">Loading automation catalog</div>
        )}
      </div>
    </Panel>
  );
}

export function AutomationExecutionPlanPanel({ plan }: { plan: AutomationExecutionPlan }) {
  return (
    <Panel title="Execution Plan" icon={<CheckCircle2 className="h-4 w-4" />}>
      <div className="space-y-3">
        {plan.runbook.map((step, index) => (
          <div
            key={step.id}
            className="rounded-md border border-surface-border bg-slate-900/40 p-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/15 text-xs font-semibold text-brand-300">
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">{step.node}</div>
                <div className="mt-1 text-xs text-slate-500">{step.action}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {step.reads.map((item) => (
                <span key={item} className="badge border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  read:{item}
                </span>
              ))}
              {step.writes.map((item) => (
                <span
                  key={item}
                  className="badge border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                >
                  write:{item}
                </span>
              ))}
              {step.requires_approval && (
                <span className="badge border-amber-500/30 bg-amber-500/10 text-amber-300">
                  approval
                </span>
              )}
            </div>
          </div>
        ))}
        {plan.runbook.length === 0 && (
          <div className="p-4 text-sm text-slate-500">Loading LangGraph runbook</div>
        )}
      </div>
    </Panel>
  );
}
