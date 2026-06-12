/*
```cypher
CREATE
  (f:File {name: "CalendarPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/CalendarPage", type: "module"}),
  (fn1:Function {name: "CalendarPage", type: "function", language: "typescript", signature: "function CalendarPage()"}),
  (v1:Variable {name: "issues", type: "variable"}),
  (v2:Variable {name: "calendar", type: "variable"}),
  (v3:Variable {name: "calendarModel", type: "variable"}),
  (v4:Variable {name: "undatedCount", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4);
```
*/

'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { useProjectCalendar } from '@/hooks/useProjectManagement';
import {
  CalendarLanePanel,
  CalendarRiskPanel,
  CalendarWorkloadPanel,
} from '@/plugin-groups/production/CalendarWorkloadPrimitives';
import {
  DEFAULT_PROJECT_ID,
  formatDate,
  Metric,
  PageShell,
  Panel,
  usePlanIssues,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';
import { buildCalendarWorkloadModel } from '@/plugin-groups/production/calendarWorkloadModel';

export function CalendarPage() {
  const { issues, loading } = usePlanIssues();
  const { data: calendar } = useProjectCalendar(DEFAULT_PROJECT_ID);
  const undatedCount = issues.filter((issue) => !issue.due_date).length;
  const calendarModel = buildCalendarWorkloadModel(calendar, undatedCount);

  return (
    <PageShell
      title="Calendar"
      subtitle="Sprint, release, review, vendor delivery, and due-date planning"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Events" value={calendarModel.eventCount} detail="dated issue events" />
        <Metric
          label="Risk"
          value={calendarModel.riskCount}
          detail="overdue, blocked, or missing evidence"
          tone="text-amber-300"
        />
        <Metric
          label="Next Date"
          value={calendarModel.nextEventDate ? formatDate(calendarModel.nextEventDate) : 'pending'}
          detail="nearest scheduled work"
          tone="text-cyan-300"
        />
        <Metric
          label="Undated"
          value={calendarModel.undatedCount}
          detail="needs planning"
          tone="text-rose-300"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Upcoming Work" icon={<Calendar className="h-4 w-4" />}>
          <div className="divide-y divide-surface-border">
            {calendarModel.upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/issues/${event.id}`}
                className="block py-3 transition hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-brand-300">
                      {event.lane} / {event.item_type}
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-slate-100">
                      {event.title}
                    </div>
                    {event.owner && (
                      <div className="mt-1 truncate text-xs text-slate-500">{event.owner}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">{formatDate(event.date)}</div>
                </div>
              </Link>
            ))}
            {calendarModel.upcomingEvents.length === 0 && (
              <div className="p-4 text-sm text-slate-500">
                {loading ? 'Loading calendar' : 'No dated work'}
              </div>
            )}
          </div>
        </Panel>
        <CalendarLanePanel model={calendarModel} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CalendarWorkloadPanel model={calendarModel} />
        <CalendarRiskPanel model={calendarModel} />
      </div>
    </PageShell>
  );
}

export default CalendarPage;
