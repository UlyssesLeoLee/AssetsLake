/*
```cypher
CREATE
  (f:File {name: "ReportAnalyticsPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ReportAnalyticsPrimitives", type: "module"}),
  (fn1:Function {name: "BurndownTrendPanel", type: "function", language: "typescript", signature: "function BurndownTrendPanel(props: { model: ReportDashboardModel })"}),
  (fn2:Function {name: "CumulativeFlowPanel", type: "function", language: "typescript", signature: "function CumulativeFlowPanel(props: { model: ReportDashboardModel })"}),
  (fn3:Function {name: "VelocityPanel", type: "function", language: "typescript", signature: "function VelocityPanel(props: { reports?: ProjectReportsSnapshot; model: ReportDashboardModel })"}),
  (fn4:Function {name: "CycleSlaPanel", type: "function", language: "typescript", signature: "function CycleSlaPanel(props: { model: ReportDashboardModel })"}),
  (fn5:Function {name: "DeliveryReadinessPanel", type: "function", language: "typescript", signature: "function DeliveryReadinessPanel(props: { reports?: ProjectReportsSnapshot; model: ReportDashboardModel })"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "reports", type: "variable"}),
  (v3:Variable {name: "point", type: "variable"}),
  (v4:Variable {name: "segment", type: "variable"}),
  (v5:Variable {name: "metric", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v4),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v5),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2);
```
*/

import { Activity, BarChart3, Gauge, LayoutGrid, Timer } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ReportDashboardModel } from '@/plugin-groups/production/reportAnalyticsModel';
import { Panel } from '@/plugin-groups/production/ProjectManagementPluginPrimitives';
import type { ProjectReportsSnapshot } from '@/types/projectManagement';

export function BurndownTrendPanel({ model }: { model: ReportDashboardModel }) {
  const maxScope = Math.max(1, ...model.burndownPoints.map((point) => point.open + point.closed));

  return (
    <Panel title="Burndown Trend" icon={<BarChart3 className="h-4 w-4" />}>
      <div className="grid h-48 grid-cols-4 items-end gap-3">
        {model.burndownPoints.map((point) => (
          <div key={point.label} className="flex h-full flex-col justify-end gap-2">
            <div className="flex min-h-0 flex-1 items-end gap-1">
              <div
                className="w-full rounded-t bg-cyan-400/80"
                style={{ height: `${Math.max(8, (point.open / maxScope) * 100)}%` }}
                title={`${point.open} open`}
              />
              <div
                className="w-full rounded-t bg-emerald-400/80"
                style={{ height: `${Math.max(8, (point.closed / maxScope) * 100)}%` }}
                title={`${point.closed} closed`}
              />
            </div>
            <div className="truncate text-center text-xs text-slate-500">{point.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-cyan-400" />
          Open
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-emerald-400" />
          Closed
        </span>
      </div>
    </Panel>
  );
}

export function CumulativeFlowPanel({ model }: { model: ReportDashboardModel }) {
  return (
    <Panel title="Cumulative Flow" icon={<LayoutGrid className="h-4 w-4" />}>
      <div className="space-y-4">
        <div className="flex h-5 overflow-hidden rounded-full bg-slate-800">
          {model.flowSegments.map((segment) => (
            <div
              key={segment.label}
              className={cn('h-5', segment.className)}
              style={{ width: `${segment.percent}%` }}
              title={`${segment.label}: ${segment.value}`}
            />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {model.flowSegments.map((segment) => (
            <div
              key={segment.label}
              className="rounded-md border border-surface-border bg-slate-900/40 p-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-sm', segment.className)} />
                  {segment.label}
                </span>
                <span>{segment.percent}%</span>
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-100">{segment.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function VelocityPanel({
  reports,
  model,
}: {
  reports?: ProjectReportsSnapshot;
  model: ReportDashboardModel;
}) {
  return (
    <Panel title="Velocity" icon={<Activity className="h-4 w-4" />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-surface-border bg-slate-900/40 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Average Completed</div>
          <div className="mt-1 text-xl font-semibold text-emerald-300">{model.velocityAverage}</div>
        </div>
        <div className="rounded-md border border-surface-border bg-slate-900/40 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Predictability</div>
          <div className="mt-1 text-xl font-semibold text-cyan-300">
            {model.velocityPredictability}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {(reports?.velocity.points ?? []).map((point) => (
          <div key={point.sprint} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{point.sprint}</span>
              <span>
                {point.completed}/{point.committed}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(100, Math.round((point.completed / Math.max(1, point.committed)) * 100))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function CycleSlaPanel({ model }: { model: ReportDashboardModel }) {
  return (
    <Panel title="Cycle Time & SLA" icon={<Timer className="h-4 w-4" />}>
      <div className="space-y-4">
        {model.cycleMetrics.map((metric) => (
          <div
            key={metric.name}
            className="rounded-md border border-surface-border bg-slate-900/40 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-100">{metric.name}</div>
              <div className="text-xs text-slate-500">{metric.sample_size} samples</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-400">Avg {metric.average_hours}h</span>
              <span className="text-slate-400">P85 {metric.p85_hours}h</span>
            </div>
          </div>
        ))}
        {model.slaMetrics.map((metric) => (
          <div
            key={metric.name}
            className="rounded-md border border-surface-border bg-slate-900/40 p-3"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-100">{metric.name}</span>
              <span className="text-amber-300">{metric.compliance_percent}%</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {metric.breached}/{metric.total} breached, target {metric.target_hours}h
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function DeliveryReadinessPanel({
  reports,
  model,
}: {
  reports?: ProjectReportsSnapshot;
  model: ReportDashboardModel;
}) {
  const readiness = reports?.delivery_readiness;

  return (
    <Panel title="Delivery Readiness" icon={<Gauge className="h-4 w-4" />}>
      <div className="rounded-md border border-surface-border bg-slate-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Readiness</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-300">
              {model.readinessPercent}%
            </div>
          </div>
          <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300">
            {model.readinessStatus}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-slate-950/40 p-3">
            <div className="text-slate-500">Dependencies</div>
            <div className="mt-1 font-semibold text-slate-100">
              {readiness?.dependency_count ?? 0}
            </div>
          </div>
          <div className="rounded-md bg-slate-950/40 p-3">
            <div className="text-slate-500">Blocked</div>
            <div className="mt-1 font-semibold text-slate-100">{readiness?.blocked_count ?? 0}</div>
          </div>
          <div className="rounded-md bg-slate-950/40 p-3">
            <div className="text-slate-500">Missing Evidence</div>
            <div className="mt-1 font-semibold text-slate-100">
              {readiness?.missing_evidence_count ?? 0}
            </div>
          </div>
          <div className="rounded-md bg-slate-950/40 p-3">
            <div className="text-slate-500">Epics</div>
            <div className="mt-1 font-semibold text-slate-100">{readiness?.epic_count ?? 0}</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
