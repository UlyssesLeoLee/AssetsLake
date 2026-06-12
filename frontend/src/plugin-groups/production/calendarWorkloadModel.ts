/*
```cypher
CREATE
  (f:File {name: "calendarWorkloadModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/calendarWorkloadModel", type: "module"}),
  (c1:Class {name: "CalendarLaneSummary", type: "class", language: "typescript", signature: "interface CalendarLaneSummary"}),
  (c2:Class {name: "CalendarWorkloadModel", type: "class", language: "typescript", signature: "interface CalendarWorkloadModel"}),
  (fn1:Function {name: "sortEventsByDate", type: "function", language: "typescript", signature: "function sortEventsByDate(events: ProjectCalendarEvent[]): ProjectCalendarEvent[]"}),
  (fn2:Function {name: "buildLaneSummaries", type: "function", language: "typescript", signature: "function buildLaneSummaries(calendar?: ProjectCalendarSnapshot): CalendarLaneSummary[]"}),
  (fn3:Function {name: "buildCalendarWorkloadModel", type: "function", language: "typescript", signature: "function buildCalendarWorkloadModel(calendar: ProjectCalendarSnapshot | undefined, undatedCount: number): CalendarWorkloadModel"}),
  (v1:Variable {name: "calendar", type: "variable"}),
  (v2:Variable {name: "events", type: "variable"}),
  (v3:Variable {name: "lanes", type: "variable"}),
  (v4:Variable {name: "riskEvents", type: "variable"}),
  (v5:Variable {name: "undatedCount", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v4),
  (fn3)-[:USES]->(v5);
```
*/

import type {
  ProjectCalendarEvent,
  ProjectCalendarLane,
  ProjectCalendarSnapshot,
  ProjectCalendarWorkloadDay,
} from '@/types/projectManagement';

export interface CalendarLaneSummary extends ProjectCalendarLane {
  risk_count: number;
}

export interface CalendarWorkloadModel {
  upcomingEvents: ProjectCalendarEvent[];
  riskEvents: ProjectCalendarEvent[];
  laneSummaries: CalendarLaneSummary[];
  workload: ProjectCalendarWorkloadDay[];
  eventCount: number;
  riskCount: number;
  undatedCount: number;
  nextEventDate?: string;
}

export function sortEventsByDate(events: ProjectCalendarEvent[]): ProjectCalendarEvent[] {
  return [...events].sort((left, right) => (left.date ?? '').localeCompare(right.date ?? ''));
}

export function buildLaneSummaries(calendar?: ProjectCalendarSnapshot): CalendarLaneSummary[] {
  const events = calendar?.events ?? [];
  const lanes = calendar?.lanes ?? [];
  return lanes.map((lane) => ({
    ...lane,
    risk_count: events.filter((event) => event.lane === lane.id && event.risk !== 'normal').length,
  }));
}

export function buildCalendarWorkloadModel(
  calendar: ProjectCalendarSnapshot | undefined,
  undatedCount: number,
): CalendarWorkloadModel {
  const events = sortEventsByDate(calendar?.events ?? []);
  const riskEvents = events.filter((event) => event.risk !== 'normal');

  return {
    upcomingEvents: events.slice(0, 12),
    riskEvents,
    laneSummaries: buildLaneSummaries(calendar),
    workload: calendar?.workload ?? [],
    eventCount: events.length,
    riskCount: riskEvents.length,
    undatedCount,
    nextEventDate: events[0]?.date,
  };
}
