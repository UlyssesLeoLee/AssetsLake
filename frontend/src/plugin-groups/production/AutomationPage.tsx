/*
```cypher
CREATE
  (f:File {name: "AutomationPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/AutomationPage", type: "module"}),
  (fn1:Function {name: "AutomationPage", type: "function", language: "typescript", signature: "function AutomationPage()"}),
  (v1:Variable {name: "automation", type: "variable"}),
  (v2:Variable {name: "executionPlan", type: "variable"}),
  (v3:Variable {name: "nodes", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3);
```
*/

'use client';

import { Sparkles } from 'lucide-react';

import { useProjectAutomation } from '@/hooks/useProjectManagement';
import { AutomationExecutionPlanPanel, AutomationRuleCards } from '@/plugin-groups/production/WorkflowAutomationPrimitives';
import { buildAutomationExecutionPlan } from '@/plugin-groups/production/workflowAutomationModel';
import {
  DEFAULT_PROJECT_ID,
  Metric,
  PageShell,
  Panel,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function AutomationPage() {
  const { data: automation } = useProjectAutomation(DEFAULT_PROJECT_ID);
  const executionPlan = buildAutomationExecutionPlan(automation);
  const nodes = automation?.langgraph_nodes ?? [];

  return (
    <PageShell title="Automation" subtitle="Rule catalog, LangGraph proposals, AI guardrails, and human approval gates">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Rules" value={executionPlan.rules.length} detail={`${executionPlan.enabledCount} enabled`} />
        <Metric label="Approvals" value={executionPlan.approvalRequiredCount} detail="human gates" tone="text-amber-300" />
        <Metric label="Data Lake Reads" value={executionPlan.dataLakeReadCount} detail="evidence checks" tone="text-emerald-300" />
        <Metric label="Graph Coverage" value={`${executionPlan.graphCoveragePercent}%`} detail={automation?.guardrail ?? 'pending'} tone="text-cyan-300" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <AutomationRuleCards plan={executionPlan} />
        <AutomationExecutionPlanPanel plan={executionPlan} />
      </div>
      <div className="mt-5">
        <Panel title="LangGraph Nodes" icon={<Sparkles className="h-4 w-4" />}>
          <div className="grid gap-3 md:grid-cols-4">
            {nodes.map((node, index) => (
              <div key={node} className="flex items-center gap-3 rounded-md border border-surface-border bg-slate-900/40 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/15 text-xs font-semibold text-brand-300">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-200">{node}</span>
              </div>
            ))}
            {nodes.length === 0 && <div className="p-4 text-sm text-slate-500">Loading graph nodes</div>}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

export default AutomationPage;
