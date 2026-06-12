/*
```cypher
CREATE
  (f:File {name: "CalendarWorkloadPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/CalendarWorkloadPrimitives", type: "module"}),
  (fn1:Function {name: "CalendarLanePanel", type: "function", language: "typescript", signature: "function CalendarLanePanel(props: { model: CalendarWorkloadModel })"}),
  (fn2:Function {name: "CalendarWorkloadPanel", type: "function", language: "typescript", signature: "function CalendarWorkloadPanel(props: { model: CalendarWorkloadModel })"}),
  (fn3:Function {name: "CalendarRiskPanel", type: "function", language: "typescript", signature: "function CalendarRiskPanel(props: { model: CalendarWorkloadModel })"}),
  (v1:Variable {name: "model", type: "variable"}),
  (v2:Variable {name: "lane", type: "variable"}),
  (v3:Variable {name: "day", type: "variable"}),
  (v4:Variable {name: "event", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v4);
```
*/

import Link from 'next/link';
import { CalendarDays, Gauge, ShieldAlert } from 'lucide-react';

import type { CalendarWorkloadModel } from '@/plugin-groups/production/calendarWorkloadModel';
import { formatDate, Panel } from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function CalendarLanePanel({ model }: { model: CalendarWorkloadModel }) {
  return (
    <Panel title="Calendar Lanes" icon={<CalendarDays className="h-4 w-4" />}>
      <div className="grid gap-3 md:grid-cols-2">
        {model.laneSummaries.map((lane) => (
          <div
            key={lane.id}
            className="rounded-md border border-surface-border bg-slate-900/40 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-100">{lane.label}</div>
                <div className="mt-1 text-xs text-slate-500">{lane.calendar_type}</div>
              </div>
              <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300">
                {lane.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-slate-950/40 p-2">
                <div className="text-slate-500">Events</div>
                <div className="mt-1 font-semibold text-slate-100">{lane.event_count}</div>
              </div>
              <div className="rounded-md bg-slate-950/40 p-2">
                <div className="text-slate-500">Risk</div>
                <div className="mt-1 font-semibold text-slate-100">{lane.risk_count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function CalendarWorkloadPanel({ model }: { model: CalendarWorkloadModel }) {
  const maxTotal = Math.max(1, ...model.workload.map((day) => day.total));

  return (
    <Panel title="Workload Heatmap" icon={<Gauge className="h-4 w-4" />}>
      {model.workload.length === 0 ? (
        <div className="p-4 text-sm text-slate-500">No scheduled workload</div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {model.workload.map((day) => (
            <div
              key={day.date}
              className="rounded-md border border-surface-border bg-slate-900/40 p-2"
            >
              <div className="truncate text-xs text-slate-500">{day.date.slice(5)}</div>
              <div className="mt-2 flex h-16 items-end rounded bg-slate-800">
                <div
                  className="w-full rounded bg-cyan-400/80"
                  style={{ height: `${Math.max(12, (day.total / maxTotal) * 100)}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-400">{day.total} items</div>
              {day.risk > 0 && <div className="mt-1 text-xs text-amber-300">{day.risk} risk</div>}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function CalendarRiskPanel({ model }: { model: CalendarWorkloadModel }) {
  return (
    <Panel title="Calendar Risk Queue" icon={<ShieldAlert className="h-4 w-4" />}>
      <div className="divide-y divide-surface-border">
        {model.riskEvents.slice(0, 8).map((event) => (
          <Link
            key={event.id}
            href={`/issues/${event.id}`}
            className="block py-3 transition hover:bg-slate-800/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-medium text-amber-300">{event.risk}</div>
                <div className="mt-1 truncate text-sm font-medium text-slate-100">
                  {event.title}
                </div>
              </div>
              <div className="shrink-0 text-xs text-slate-500">{formatDate(event.date)}</div>
            </div>
          </Link>
        ))}
        {model.riskEvents.length === 0 && (
          <div className="p-4 text-sm text-slate-500">No calendar risk</div>
        )}
      </div>
    </Panel>
  );
}
