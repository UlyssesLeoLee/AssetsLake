/*
```cypher
CREATE
  (f:File {name: "EnterpriseGovernancePrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/EnterpriseGovernancePrimitives", type: "module"}),
  (fn1:Function {name: "GovernanceReadinessPanel", type: "function", language: "typescript", signature: "function GovernanceReadinessPanel(props: { model: EnterpriseGovernanceModel })"}),
  (fn2:Function {name: "GovernanceRiskPanel", type: "function", language: "typescript", signature: "function GovernanceRiskPanel(props: { model: EnterpriseGovernanceModel })"}),
  (fn3:Function {name: "severityClass", type: "function", language: "typescript", signature: "function severityClass(severity: EnterpriseGovernanceRisk['severity']): string"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "permission", type: "variable"}),
  (v3:Variable {name: "risk", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3);
```
*/

import { AlertTriangle, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { EnterpriseGovernanceModel, EnterpriseGovernanceRisk } from '@/plugin-groups/production/enterpriseGovernanceModel';
import { Metric, Panel } from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function GovernanceReadinessPanel({ model }: { model: EnterpriseGovernanceModel }) {
  return (
    <Panel title="Governance Readiness" icon={<ShieldCheck className="h-4 w-4" />}>
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Score" value={`${model.score}%`} detail="policy readiness" tone="text-emerald-300" />
        <Metric label="CI" value={`${model.requiredCiPassing}/${model.requiredCiTotal}`} detail="required passing" tone="text-amber-300" />
        <Metric label="Imports" value={model.importReadyCount} detail="ready jobs" tone="text-cyan-300" />
        <Metric label="Audit" value={model.auditDrilldownCount} detail="drilldowns" tone="text-brand-300" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {model.permissionCoverage.slice(0, 12).map((permission) => (
          <span key={permission} className="badge border-slate-600 bg-slate-700/30 text-slate-300">
            {permission}
          </span>
        ))}
      </div>
    </Panel>
  );
}

export function GovernanceRiskPanel({ model }: { model: EnterpriseGovernanceModel }) {
  return (
    <Panel title="Governance Risks" icon={<AlertTriangle className="h-4 w-4" />}>
      <div className="space-y-3">
        {model.risks.map((risk) => (
          <div key={risk.id} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-100">{risk.label}</div>
              <span className={cn('badge', severityClass(risk.severity))}>{risk.severity}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{risk.detail}</div>
          </div>
        ))}
        {model.risks.length === 0 && <div className="p-4 text-sm text-slate-500">No governance risk</div>}
      </div>
    </Panel>
  );
}

function severityClass(severity: EnterpriseGovernanceRisk['severity']) {
  if (severity === 'blocked') return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
  return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
}
