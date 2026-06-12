/*
```cypher
CREATE
  (f:File {name: "BoardPlanningPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/BoardPlanningPrimitives", type: "module"}),
  (fn1:Function {name: "BoardHealthPanel", type: "function", language: "typescript", signature: "function BoardHealthPanel(props: { model: BoardPlanningModel })"}),
  (fn2:Function {name: "BoardSwimlanePanel", type: "function", language: "typescript", signature: "function BoardSwimlanePanel(props: { model: BoardPlanningModel })"}),
  (fn3:Function {name: "BoardRiskQueuePanel", type: "function", language: "typescript", signature: "function BoardRiskQueuePanel(props: { model: BoardPlanningModel })"}),
  (fn4:Function {name: "wipStateClass", type: "function", language: "typescript", signature: "function wipStateClass(state: BoardColumnModel['wipState']): string"}),
  (fn5:Function {name: "riskClass", type: "function", language: "typescript", signature: "function riskClass(risk: BoardRiskItem['risk']): string"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "column", type: "variable"}),
  (v3:Variable {name: "lane", type: "variable"}),
  (v4:Variable {name: "item", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v4);
```
*/

import Link from 'next/link';
import { AlertTriangle, Gauge, Rows3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type {
  BoardColumnModel,
  BoardPlanningModel,
  BoardRiskItem,
} from '@/plugin-groups/production/boardPlanningModel';
import { ISSUE_PRIORITY_LABELS } from '@/types/production';

export function BoardHealthPanel({ model }: { model: BoardPlanningModel }) {
  const limitedColumns = model.columns.filter((column) => column.limit !== undefined);

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary/90 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Gauge className="h-4 w-4 text-brand-300" />
          Board Health
        </div>
        <span className="badge border-shu-300/25 bg-shu-400/10 text-shu-300">
          {model.wipBreachCount} breaches
        </span>
      </div>
      <div className="space-y-2 p-4">
        {limitedColumns.map((column) => (
          <div
            key={column.status}
            className="flex items-center justify-between gap-3 rounded-md border border-white/[0.04] bg-[#0d141c]/75 px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-slate-200">{column.label}</div>
              <div className="mt-1 text-xs text-slate-500">{column.storyPoints} pts</div>
            </div>
            <span
              className={cn(
                'rounded-md px-2 py-1 text-xs font-semibold',
                wipStateClass(column.wipState),
              )}
            >
              {column.count}/{column.limit}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BoardSwimlanePanel({ model }: { model: BoardPlanningModel }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary/90 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Rows3 className="h-4 w-4 text-sakura-300" />
          Swimlanes
        </div>
        <span className="badge border-brand-300/25 bg-brand-500/10 text-brand-200">
          {model.totalStoryPoints} pts
        </span>
      </div>
      <div className="divide-y divide-surface-border">
        {model.swimlanes.map((lane) => (
          <div
            key={lane.priority}
            className="grid grid-cols-[1fr_repeat(3,auto)] items-center gap-3 px-4 py-3 text-xs"
          >
            <div className="min-w-0 font-medium text-slate-200">
              {ISSUE_PRIORITY_LABELS[lane.priority]}
            </div>
            <div className="text-slate-500">{lane.count} issues</div>
            <div className="text-slate-500">{lane.reviewCount} review</div>
            <div className={lane.riskCount > 0 ? 'text-amber-300' : 'text-slate-500'}>
              {lane.riskCount} risk
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BoardRiskQueuePanel({ model }: { model: BoardPlanningModel }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary/90 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <AlertTriangle className="h-4 w-4 text-shu-300" />
          Board Risk Queue
        </div>
        <span className="badge border-sakura-300/25 bg-sakura-400/10 text-sakura-300">
          {model.reviewPressureCount} review
        </span>
      </div>
      <div className="divide-y divide-surface-border">
        {model.riskQueue.slice(0, 5).map((item) => (
          <Link
            key={item.issue.id}
            href={`/issues/${item.issue.id}`}
            className="block px-4 py-3 transition hover:bg-white/[0.035]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className={cn('text-xs font-semibold', riskClass(item.risk))}>{item.risk}</div>
                <div className="mt-1 truncate text-sm font-medium text-slate-100">
                  {item.issue.title}
                </div>
              </div>
              <div className="shrink-0 text-xs text-slate-500">{item.issue.issue_key}</div>
            </div>
          </Link>
        ))}
        {model.riskQueue.length === 0 && (
          <div className="p-4 text-sm text-slate-500">No board risk</div>
        )}
      </div>
    </section>
  );
}

function wipStateClass(state: BoardColumnModel['wipState']) {
  if (state === 'over_limit') return 'bg-shu-400/15 text-shu-300';
  if (state === 'at_limit') return 'bg-sakura-400/15 text-sakura-300';
  return 'bg-matcha-400/15 text-matcha-300';
}

function riskClass(risk: BoardRiskItem['risk']) {
  if (risk === 'overdue') return 'text-shu-300';
  if (risk === 'missing_evidence') return 'text-sakura-300';
  if (risk === 'qa_warning') return 'text-brand-300';
  return 'text-matcha-300';
}
