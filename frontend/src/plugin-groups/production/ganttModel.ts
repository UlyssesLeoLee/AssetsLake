/*
```cypher
CREATE
  (f:File {name: "ganttModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ganttModel", type: "module"}),
  (c1:Class {name: "GanttBlockingEdge", type: "class", language: "typescript", signature: "interface GanttBlockingEdge"}),
  (c2:Class {name: "GanttTimelineRow", type: "class", language: "typescript", signature: "interface GanttTimelineRow"}),
  (c3:Class {name: "GanttCriticalPathSummary", type: "class", language: "typescript", signature: "interface GanttCriticalPathSummary"}),
  (c4:Class {name: "GanttTimelineMarker", type: "class", language: "typescript", signature: "interface GanttTimelineMarker"}),
  (c5:Class {name: "GanttTimelineModel", type: "class", language: "typescript", signature: "interface GanttTimelineModel"}),
  (fn1:Function {name: "parseDateDay", type: "function", language: "typescript", signature: "function parseDateDay(value?: string): number | undefined"}),
  (fn2:Function {name: "toIsoDate", type: "function", language: "typescript", signature: "function toIsoDate(day: number): string"}),
  (fn3:Function {name: "estimateDurationDays", type: "function", language: "typescript", signature: "function estimateDurationDays(item: ProjectGanttItem): number"}),
  (fn4:Function {name: "estimateStartDay", type: "function", language: "typescript", signature: "function estimateStartDay(item: ProjectGanttItem, endDay: number): number"}),
  (fn5:Function {name: "clampPercent", type: "function", language: "typescript", signature: "function clampPercent(value: number): number"}),
  (fn6:Function {name: "normalizeBlockingEdge", type: "function", language: "typescript", signature: "function normalizeBlockingEdge(dependency: IssueDependency, itemIds: Set<string>): GanttBlockingEdge | undefined"}),
  (fn7:Function {name: "buildBlockingEdges", type: "function", language: "typescript", signature: "function buildBlockingEdges(dependencies: IssueDependency[], itemIds: Set<string>): GanttBlockingEdge[]"}),
  (fn8:Function {name: "buildAdjacency", type: "function", language: "typescript", signature: "function buildAdjacency(edges: GanttBlockingEdge[]): Map<string, string[]>"}),
  (fn9:Function {name: "scoreCriticalPath", type: "function", language: "typescript", signature: "function scoreCriticalPath(issueId: string, adjacency: Map<string, string[]>, durationById: Map<string, number>, visiting: Set<string>): GanttCriticalPathSummary"}),
  (fn10:Function {name: "findCriticalPath", type: "function", language: "typescript", signature: "function findCriticalPath(rows: GanttTimelineRow[], edges: GanttBlockingEdge[]): GanttCriticalPathSummary"}),
  (fn11:Function {name: "buildTimelineMarkers", type: "function", language: "typescript", signature: "function buildTimelineMarkers(startDay: number, totalDays: number): GanttTimelineMarker[]"}),
  (fn12:Function {name: "getScheduleRisk", type: "function", language: "typescript", signature: "function getScheduleRisk(row: GanttTimelineRow, nowDay: number): GanttTimelineRow['scheduleRisk']"}),
  (fn13:Function {name: "buildGanttTimelineModel", type: "function", language: "typescript", signature: "function buildGanttTimelineModel(items: ProjectGanttItem[], dependencies: IssueDependency[], now?: Date | string): GanttTimelineModel"}),
  (fn14:Function {name: "formatGanttDateRange", type: "function", language: "typescript", signature: "function formatGanttDateRange(startDate?: string, endDate?: string): string"}),
  (v1:Variable {name: "DAY_MS", type: "variable"}),
  (v2:Variable {name: "BLOCKING_DEPENDENCY_TYPES", type: "variable"}),
  (v3:Variable {name: "items", type: "variable"}),
  (v4:Variable {name: "dependencies", type: "variable"}),
  (v5:Variable {name: "edges", type: "variable"}),
  (v6:Variable {name: "rows", type: "variable"}),
  (v7:Variable {name: "criticalPath", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn4)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn3),
  (fn6)-[:USES]->(v2),
  (fn7)-[:CALLS]->(fn6),
  (fn7)-[:USES]->(v4),
  (fn9)-[:CALLS]->(fn9),
  (fn10)-[:CALLS]->(fn8),
  (fn10)-[:CALLS]->(fn9),
  (fn10)-[:USES]->(v5),
  (fn10)-[:USES]->(v6),
  (fn11)-[:CALLS]->(fn2),
  (fn13)-[:CALLS]->(fn1),
  (fn13)-[:CALLS]->(fn2),
  (fn13)-[:CALLS]->(fn3),
  (fn13)-[:CALLS]->(fn4),
  (fn13)-[:CALLS]->(fn5),
  (fn13)-[:CALLS]->(fn7),
  (fn13)-[:CALLS]->(fn10),
  (fn13)-[:CALLS]->(fn11),
  (fn13)-[:CALLS]->(fn12),
  (fn13)-[:USES]->(v3),
  (fn13)-[:USES]->(v4),
  (fn13)-[:USES]->(v5),
  (fn13)-[:USES]->(v6),
  (fn13)-[:USES]->(v7);
```
*/

import type { IssueDependency, IssueDependencyType, ProjectGanttItem } from '@/types/projectManagement';

const DAY_MS = 86_400_000;
const BLOCKING_DEPENDENCY_TYPES = new Set<IssueDependencyType>(['blocks', 'is_blocked_by', 'parent_child']);

export interface GanttBlockingEdge {
  id: string;
  fromIssueId: string;
  toIssueId: string;
  dependencyType: IssueDependencyType;
  description?: string;
}

export interface GanttTimelineRow {
  item: ProjectGanttItem;
  startDate?: string;
  endDate?: string;
  leftPercent: number;
  widthPercent: number;
  durationDays: number;
  blockedBy: number;
  blocks: number;
  isCriticalPath: boolean;
  isUnscheduled: boolean;
  scheduleRisk: 'ready' | 'critical' | 'blocked' | 'overdue' | 'unscheduled';
}

export interface GanttCriticalPathSummary {
  issueIds: string[];
  durationDays: number;
}

export interface GanttTimelineMarker {
  label: string;
  leftPercent: number;
}

export interface GanttTimelineModel {
  rows: GanttTimelineRow[];
  blockingEdges: GanttBlockingEdge[];
  criticalPath: GanttCriticalPathSummary;
  markers: GanttTimelineMarker[];
  startDate?: string;
  endDate?: string;
  totalDays: number;
}

export function parseDateDay(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.includes('T') ? value : `${value}T00:00:00Z`;
  const time = Date.parse(normalized);
  if (Number.isNaN(time)) {
    return undefined;
  }

  return Math.floor(time / DAY_MS);
}

export function toIsoDate(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

export function estimateDurationDays(item: ProjectGanttItem): number {
  const startDay = parseDateDay(item.start_date);
  const endDay = parseDateDay(item.due_date);
  if (startDay !== undefined && endDay !== undefined && endDay >= startDay) {
    return Math.max(1, endDay - startDay + 1);
  }

  if (item.story_points && item.story_points > 0) {
    return Math.max(1, Math.ceil(item.story_points));
  }

  return Math.max(1, item.dependency_count + 1);
}

export function estimateStartDay(item: ProjectGanttItem, endDay: number): number {
  const startDay = parseDateDay(item.start_date);
  if (startDay !== undefined) {
    return startDay;
  }

  return endDay - estimateDurationDays(item) + 1;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function normalizeBlockingEdge(
  dependency: IssueDependency,
  itemIds: Set<string>
): GanttBlockingEdge | undefined {
  if (!BLOCKING_DEPENDENCY_TYPES.has(dependency.dependency_type)) {
    return undefined;
  }

  const fromIssueId =
    dependency.dependency_type === 'is_blocked_by' ? dependency.target_issue_id : dependency.source_issue_id;
  const toIssueId =
    dependency.dependency_type === 'is_blocked_by' ? dependency.source_issue_id : dependency.target_issue_id;

  if (!itemIds.has(fromIssueId) || !itemIds.has(toIssueId)) {
    return undefined;
  }

  return {
    id: dependency.id,
    fromIssueId,
    toIssueId,
    dependencyType: dependency.dependency_type,
    description: dependency.description,
  };
}

export function buildBlockingEdges(dependencies: IssueDependency[], itemIds: Set<string>): GanttBlockingEdge[] {
  return dependencies.flatMap((dependency) => {
    const edge = normalizeBlockingEdge(dependency, itemIds);
    return edge ? [edge] : [];
  });
}

function buildAdjacency(edges: GanttBlockingEdge[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const targets = adjacency.get(edge.fromIssueId) ?? [];
    targets.push(edge.toIssueId);
    adjacency.set(edge.fromIssueId, targets);
  }
  return adjacency;
}

function scoreCriticalPath(
  issueId: string,
  adjacency: Map<string, string[]>,
  durationById: Map<string, number>,
  visiting: Set<string>
): GanttCriticalPathSummary {
  if (visiting.has(issueId)) {
    return { issueIds: [], durationDays: 0 };
  }

  visiting.add(issueId);

  let bestTail: GanttCriticalPathSummary = { issueIds: [], durationDays: 0 };
  for (const nextIssueId of adjacency.get(issueId) ?? []) {
    const candidate = scoreCriticalPath(nextIssueId, adjacency, durationById, visiting);
    if (candidate.durationDays > bestTail.durationDays) {
      bestTail = candidate;
    }
  }

  visiting.delete(issueId);

  return {
    issueIds: [issueId, ...bestTail.issueIds],
    durationDays: (durationById.get(issueId) ?? 1) + bestTail.durationDays,
  };
}

export function findCriticalPath(
  rows: GanttTimelineRow[],
  edges: GanttBlockingEdge[]
): GanttCriticalPathSummary {
  if (edges.length === 0) {
    return { issueIds: [], durationDays: 0 };
  }

  const adjacency = buildAdjacency(edges);
  const durationById = new Map(rows.map((row) => [row.item.id, row.durationDays]));
  let bestPath: GanttCriticalPathSummary = { issueIds: [], durationDays: 0 };

  for (const row of rows) {
    const candidate = scoreCriticalPath(row.item.id, adjacency, durationById, new Set<string>());
    if (candidate.issueIds.length > 1 && candidate.durationDays > bestPath.durationDays) {
      bestPath = candidate;
    }
  }

  return bestPath;
}

function buildTimelineMarkers(startDay: number, totalDays: number): GanttTimelineMarker[] {
  const markerCount = totalDays <= 1 ? 1 : Math.min(6, Math.max(2, totalDays));
  return Array.from({ length: markerCount }, (_, index) => {
    const offset = markerCount === 1 ? 0 : Math.round(((totalDays - 1) * index) / (markerCount - 1));
    return {
      label: toIsoDate(startDay + offset).slice(5),
      leftPercent: clampPercent((offset / Math.max(1, totalDays - 1)) * 100),
    };
  });
}

function getScheduleRisk(row: GanttTimelineRow, nowDay: number): GanttTimelineRow['scheduleRisk'] {
  const dueDay = parseDateDay(row.endDate);
  if (row.isUnscheduled) {
    return 'unscheduled';
  }
  if (dueDay !== undefined && dueDay < nowDay && row.item.status !== 'delivered' && row.item.status !== 'archived') {
    return 'overdue';
  }
  if (row.blockedBy > 0 && row.item.status !== 'delivered' && row.item.status !== 'archived') {
    return 'blocked';
  }
  if (row.isCriticalPath) {
    return 'critical';
  }
  return 'ready';
}

export function buildGanttTimelineModel(
  items: ProjectGanttItem[],
  dependencies: IssueDependency[],
  now: Date | string = new Date()
): GanttTimelineModel {
  const nowDay = typeof now === 'string' ? parseDateDay(now) ?? parseDateDay(new Date().toISOString()) ?? 0 : Math.floor(now.getTime() / DAY_MS);
  const itemIds = new Set(items.map((item) => item.id));
  const blockingEdges = buildBlockingEdges(dependencies, itemIds);

  const candidates = items.map((item, index) => {
    const durationDays = estimateDurationDays(item);
    const dueDay = parseDateDay(item.due_date);
    const explicitStartDay = parseDateDay(item.start_date);
    const endDay = dueDay ?? (explicitStartDay !== undefined ? explicitStartDay + durationDays - 1 : nowDay + index);
    const startDay = explicitStartDay ?? estimateStartDay(item, endDay);
    return {
      item,
      durationDays,
      startDay,
      endDay,
      isUnscheduled: explicitStartDay === undefined && dueDay === undefined,
    };
  });

  const firstDay = candidates.length > 0 ? Math.min(...candidates.map((candidate) => candidate.startDay)) : nowDay;
  const lastDay = candidates.length > 0 ? Math.max(...candidates.map((candidate) => candidate.endDay)) : nowDay;
  const totalDays = Math.max(1, lastDay - firstDay + 1);
  const blockedByCounts = new Map<string, number>();
  const blocksCounts = new Map<string, number>();

  for (const edge of blockingEdges) {
    blocksCounts.set(edge.fromIssueId, (blocksCounts.get(edge.fromIssueId) ?? 0) + 1);
    blockedByCounts.set(edge.toIssueId, (blockedByCounts.get(edge.toIssueId) ?? 0) + 1);
  }

  const initialRows: GanttTimelineRow[] = candidates.map((candidate) => ({
    item: candidate.item,
    startDate: toIsoDate(candidate.startDay),
    endDate: toIsoDate(candidate.endDay),
    leftPercent: clampPercent(((candidate.startDay - firstDay) / totalDays) * 100),
    widthPercent: Math.max(6, clampPercent((candidate.durationDays / totalDays) * 100)),
    durationDays: candidate.durationDays,
    blockedBy: blockedByCounts.get(candidate.item.id) ?? 0,
    blocks: blocksCounts.get(candidate.item.id) ?? 0,
    isCriticalPath: false,
    isUnscheduled: candidate.isUnscheduled,
    scheduleRisk: 'ready',
  }));

  const criticalPath = findCriticalPath(initialRows, blockingEdges);
  const criticalIds = new Set(criticalPath.issueIds);
  const rows = initialRows.map((row) => {
    const criticalRow = { ...row, isCriticalPath: criticalIds.has(row.item.id) };
    return { ...criticalRow, scheduleRisk: getScheduleRisk(criticalRow, nowDay) };
  });

  return {
    rows,
    blockingEdges,
    criticalPath,
    markers: buildTimelineMarkers(firstDay, totalDays),
    startDate: toIsoDate(firstDay),
    endDate: toIsoDate(lastDay),
    totalDays,
  };
}

export function formatGanttDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) {
    return 'Unscheduled';
  }
  if (startDate === endDate || !endDate) {
    return startDate ?? 'Unscheduled';
  }
  return `${startDate} to ${endDate}`;
}
