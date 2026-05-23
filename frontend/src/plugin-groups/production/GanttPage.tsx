/*
```cypher
CREATE
  (f:File {name: "GanttPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/GanttPage", type: "module"}),
  (fn1:Function {name: "GanttPage", type: "function", language: "typescript", signature: "function GanttPage()"}),
  (v1:Variable {name: "plan", type: "variable"}),
  (v2:Variable {name: "issues", type: "variable"}),
  (v3:Variable {name: "gantt", type: "variable"}),
  (v4:Variable {name: "scheduleItems", type: "variable"}),
  (v5:Variable {name: "dependencyCount", type: "variable"}),
  (v6:Variable {name: "timeline", type: "variable"}),
  (v7:Variable {name: "rowByIssueId", type: "variable"}),
  (v8:Variable {name: "riskRows", type: "variable"}),
  (v9:Variable {name: "riskTone", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8),
  (fn1)-[:USES]->(v9);
```
*/

'use client';

import Link from 'next/link';
import { ArrowRight, Clock3, GitBranch, ShieldCheck } from 'lucide-react';

import { useProjectGantt } from '@/hooks/useProjectManagement';
import { cn } from '@/lib/utils';
import { buildGanttTimelineModel, formatGanttDateRange } from '@/plugin-groups/production/ganttModel';
import {
  DEFAULT_PROJECT_ID,
  formatDate,
  Metric,
  PageShell,
  Panel,
  usePlanIssues,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

const riskTone = {
  ready: 'bg-emerald-400',
  critical: 'bg-amber-400',
  blocked: 'bg-cyan-400',
  overdue: 'bg-red-400',
  unscheduled: 'bg-slate-500',
} as const;

export function GanttPage() {
  const { plan, issues, loading } = usePlanIssues();
  const { data: gantt } = useProjectGantt(DEFAULT_PROJECT_ID);
  const scheduleItems = gantt?.schedule_items ?? [];
  const dependencyCount = gantt?.dependencies.length ?? plan?.dependencies.length ?? 0;
  const timeline = buildGanttTimelineModel(scheduleItems, gantt?.dependencies ?? plan?.dependencies ?? []);
  const rowByIssueId = new Map(timeline.rows.map((row) => [row.item.id, row]));
  const riskRows = timeline.rows
    .filter((row) => row.scheduleRisk === 'blocked' || row.scheduleRisk === 'overdue' || row.scheduleRisk === 'unscheduled')
    .slice(0, 8);

  return (
    <PageShell title="Gantt" subtitle="Schedule, dependencies, baseline drift, and critical path readiness">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Bars" value={scheduleItems.length || issues.length} detail="planned or active issues" />
        <Metric label="Dependencies" value={dependencyCount} detail="blocking edges" tone="text-cyan-300" />
        <Metric label="Critical Path" value={timeline.criticalPath.issueIds.length || '-'} detail={`${timeline.criticalPath.durationDays}d chain`} tone="text-amber-300" />
        <Metric label="Baseline" value={gantt?.baseline_status ?? 'pending'} detail="capture status" tone="text-amber-300" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Schedule Timeline" icon={<GitBranch className="h-4 w-4" />}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>{formatGanttDateRange(timeline.startDate, timeline.endDate)}</span>
            <span>{timeline.totalDays} days</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[15rem_1fr] gap-3 border-b border-surface-border pb-2 text-xs uppercase text-slate-500">
                <span>Issue</span>
                <div className="relative h-5">
                  {timeline.markers.map((marker) => (
                    <span
                      key={`${marker.label}-${marker.leftPercent}`}
                      className="absolute top-0 -translate-x-1/2 whitespace-nowrap"
                      style={{ left: `${marker.leftPercent}%` }}
                    >
                      {marker.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-surface-border">
                {timeline.rows.slice(0, 12).map((row) => (
                  <Link key={row.item.id} href={`/issues/${row.item.id}`} className="grid grid-cols-[15rem_1fr] gap-3 py-3 transition hover:bg-slate-800/40">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-medium text-brand-300">
                        <span>{row.item.issue_key}</span>
                        <span className={cn('h-2 w-2 rounded-full', riskTone[row.scheduleRisk])} />
                      </div>
                      <div className="mt-1 truncate text-sm font-medium text-slate-100">{row.item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{formatGanttDateRange(row.startDate, row.endDate)}</div>
                    </div>
                    <div className="relative h-14">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
                      {timeline.markers.map((marker) => (
                        <span
                          key={`${row.item.id}-${marker.label}`}
                          className="absolute top-1 h-12 border-l border-slate-800/80"
                          style={{ left: `${marker.leftPercent}%` }}
                        />
                      ))}
                      <div
                        className={cn(
                          'absolute top-5 h-4 rounded-sm shadow-sm',
                          row.isUnscheduled ? 'border border-dashed border-slate-500 bg-slate-800' : riskTone[row.scheduleRisk]
                        )}
                        style={{ left: `${row.leftPercent}%`, width: `${row.widthPercent}%` }}
                      />
                      <div className="absolute bottom-0 left-0 flex gap-3 text-[11px] text-slate-500">
                        <span>{row.durationDays}d</span>
                        <span>{row.blockedBy} blocked-by</span>
                        <span>{row.blocks} blocks</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {timeline.rows.length === 0 && (
                <div className="p-6 text-sm text-slate-500">{loading ? 'Loading schedule' : 'No schedule items'}</div>
              )}
            </div>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Critical Path" icon={<Clock3 className="h-4 w-4" />}>
            {timeline.criticalPath.issueIds.length > 0 ? (
              <div className="space-y-3">
                {timeline.criticalPath.issueIds.map((issueId, index) => {
                  const row = rowByIssueId.get(issueId);
                  if (!row) return null;
                  return (
                    <div key={issueId} className="flex items-center gap-3 rounded-md border border-amber-400/20 bg-amber-400/5 p-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-amber-400/20 text-xs font-semibold text-amber-200">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-100">{row.item.title}</div>
                        <div className="text-xs text-slate-500">{row.item.issue_key} · {row.durationDays}d · due {formatDate(row.endDate)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-sm text-slate-500">No blocking chain detected</div>
            )}
          </Panel>
          <Panel title="Dependency Map" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="space-y-3">
              {timeline.blockingEdges.slice(0, 8).map((edge) => {
                const source = rowByIssueId.get(edge.fromIssueId)?.item;
                const target = rowByIssueId.get(edge.toIssueId)?.item;
                return (
                  <div key={edge.id} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
                      <span>{source?.issue_key ?? edge.fromIssueId}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{target?.issue_key ?? edge.toIssueId}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm text-slate-100">
                      <span className="truncate">{source?.title ?? 'Source issue'}</span>
                      <ArrowRight className="h-4 w-4 text-cyan-300" />
                      <span className="truncate">{target?.title ?? 'Target issue'}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{edge.dependencyType}</div>
                  </div>
                );
              })}
              {timeline.blockingEdges.length === 0 && <div className="p-4 text-sm text-slate-500">No blocking dependencies</div>}
            </div>
          </Panel>
          <Panel title="Risk Queue" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="divide-y divide-surface-border">
              {riskRows.map((row) => (
                <Link key={row.item.id} href={`/issues/${row.item.id}`} className="block py-3 transition hover:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-brand-300">{row.item.issue_key}</div>
                      <div className="mt-1 truncate text-sm font-medium text-slate-100">{row.item.title}</div>
                    </div>
                    <span className="shrink-0 rounded-sm border border-surface-border px-2 py-1 text-xs capitalize text-slate-300">
                      {row.scheduleRisk}
                    </span>
                  </div>
                </Link>
              ))}
              {riskRows.length === 0 && <div className="p-4 text-sm text-slate-500">No schedule risks</div>}
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

export default GanttPage;
