/*
```cypher
CREATE
  (f:File {name: "IssueEvidencePrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/IssueEvidencePrimitives", type: "module"}),
  (fn1:Function {name: "IssueEvidenceReadinessPanel", type: "function", language: "typescript", signature: "function IssueEvidenceReadinessPanel(props: { model: IssueEvidenceModel })"}),
  (fn2:Function {name: "DataLakeEvidencePanel", type: "function", language: "typescript", signature: "function DataLakeEvidencePanel(props: { model: IssueEvidenceModel })"}),
  (fn3:Function {name: "LangGraphRecommendationPanel", type: "function", language: "typescript", signature: "function LangGraphRecommendationPanel(props: { model: IssueEvidenceModel })"}),
  (fn4:Function {name: "riskClass", type: "function", language: "typescript", signature: "function riskClass(risk: IssueEvidenceModel['risk']): string"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "item", type: "variable"}),
  (v3:Variable {name: "link", type: "variable"}),
  (v4:Variable {name: "suggestion", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v4);
```
*/

import { CheckCircle2, Database, Network, ShieldAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { IssueEvidenceModel } from '@/plugin-groups/production/issueEvidenceModel';
import { SectionTitle } from '@/plugin-groups/production/ProductionPluginPrimitives';

export function IssueEvidenceReadinessPanel({ model }: { model: IssueEvidenceModel }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionTitle icon={<ShieldAlert className="h-4 w-4" />} title="Evidence Readiness" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold text-slate-100">{model.readinessPercent}%</div>
          <div className={cn('mt-1 text-xs font-medium', riskClass(model.risk))}>{model.risk}</div>
        </div>
        <span className="badge border-slate-600 bg-slate-800 text-slate-300">
          {model.missingEvidenceCount} missing
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {model.checklist.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-sm font-medium text-slate-100">{item.label}</div>
              <CheckCircle2
                className={cn(
                  'h-4 w-4 shrink-0',
                  item.passed ? 'text-emerald-300' : 'text-slate-600',
                )}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500">{item.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DataLakeEvidencePanel({ model }: { model: IssueEvidenceModel }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionTitle icon={<Database className="h-4 w-4" />} title="Data Lake Evidence" />
      <div className="mt-3 space-y-2">
        {model.dataLakeLinks.slice(0, 6).map((link) => (
          <div
            key={link.id}
            className="rounded-md border border-surface-border bg-surface-elevated px-3 py-2"
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-slate-200">{link.label}</span>
              <span className="text-slate-500">{link.source}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {link.assetType} / {link.status}
            </div>
          </div>
        ))}
        {model.dataLakeLinks.length === 0 && (
          <div className="text-sm text-slate-500">No data lake evidence linked</div>
        )}
      </div>
    </section>
  );
}

export function LangGraphRecommendationPanel({ model }: { model: IssueEvidenceModel }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionTitle icon={<Network className="h-4 w-4" />} title="LangGraph Recommendations" />
      <div className="mt-3 space-y-2">
        {model.suggestions.map((suggestion) => (
          <div
            key={`${suggestion.node}-${suggestion.action}`}
            className="rounded-md border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-brand-300">
                  {suggestion.node}
                </div>
                <div className="mt-1 text-sm text-slate-100">{suggestion.action}</div>
              </div>
              <span className="shrink-0 text-xs text-slate-500">
                {Math.round(suggestion.confidence * 100)}%
              </span>
            </div>
            {suggestion.approvalRequired && (
              <div className="mt-2 text-xs text-amber-300">human approval required</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function riskClass(risk: IssueEvidenceModel['risk']) {
  if (risk === 'blocked') return 'text-rose-300';
  if (risk === 'watch') return 'text-amber-300';
  return 'text-emerald-300';
}
