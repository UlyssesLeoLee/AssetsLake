/*
```cypher
CREATE
  (f:File {name: "reportAnalyticsModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/reportAnalyticsModel", type: "module"}),
  (c1:Class {name: "ReportKpi", type: "class", language: "typescript", signature: "interface ReportKpi"}),
  (c2:Class {name: "ReportFlowSegment", type: "class", language: "typescript", signature: "interface ReportFlowSegment"}),
  (c3:Class {name: "ReportDashboardModel", type: "class", language: "typescript", signature: "interface ReportDashboardModel"}),
  (fn1:Function {name: "safePercent", type: "function", language: "typescript", signature: "function safePercent(value: number, total: number): number"}),
  (fn2:Function {name: "formatPercent", type: "function", language: "typescript", signature: "function formatPercent(value: number): string"}),
  (fn3:Function {name: "buildBurndownPoints", type: "function", language: "typescript", signature: "function buildBurndownPoints(reports?: ProjectReportsSnapshot): ProjectBurndownPoint[]"}),
  (fn4:Function {name: "latestFlowPoint", type: "function", language: "typescript", signature: "function latestFlowPoint(reports?: ProjectReportsSnapshot): ProjectCumulativeFlowPoint"}),
  (fn5:Function {name: "buildReadinessStatus", type: "function", language: "typescript", signature: "function buildReadinessStatus(readyPercent: number): ReportDashboardModel['readinessStatus']"}),
  (fn6:Function {name: "buildReportsDashboardModel", type: "function", language: "typescript", signature: "function buildReportsDashboardModel(reports?: ProjectReportsSnapshot): ReportDashboardModel"}),
  (v1:Variable {name: "reports", type: "variable"}),
  (v2:Variable {name: "points", type: "variable"}),
  (v3:Variable {name: "flowPoint", type: "variable"}),
  (v4:Variable {name: "flowTotal", type: "variable"}),
  (v5:Variable {name: "closedTotal", type: "variable"}),
  (v6:Variable {name: "scopeTotal", type: "variable"}),
  (v7:Variable {name: "readyPercent", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn2),
  (fn6)-[:CALLS]->(fn3),
  (fn6)-[:CALLS]->(fn4),
  (fn6)-[:CALLS]->(fn5),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v3),
  (fn6)-[:USES]->(v4),
  (fn6)-[:USES]->(v5),
  (fn6)-[:USES]->(v6),
  (fn6)-[:USES]->(v7);
```
*/

import type {
  ProjectBurndownPoint,
  ProjectCumulativeFlowPoint,
  ProjectReportsSnapshot,
} from '@/types/projectManagement';

export interface ReportKpi {
  label: string;
  value: number | string;
  detail: string;
  tone?: string;
}

export interface ReportFlowSegment {
  label: string;
  value: number;
  percent: number;
  className: string;
}

export interface ReportDashboardModel {
  kpis: ReportKpi[];
  burndownPoints: ProjectBurndownPoint[];
  flowSegments: ReportFlowSegment[];
  velocityAverage: number;
  velocityPredictability: string;
  cycleMetrics: ProjectReportsSnapshot['cycle_time']['metrics'];
  slaMetrics: ProjectReportsSnapshot['sla']['metrics'];
  readinessPercent: number;
  readinessStatus: 'blocked' | 'watch' | 'ready';
}

export function safePercent(value: number, total: number): number {
  return total > 0 ? Math.max(0, Math.min(100, Math.round((value / total) * 100))) : 0;
}

export function formatPercent(value: number): string {
  return `${safePercent(value, 100)}%`;
}

export function buildBurndownPoints(reports?: ProjectReportsSnapshot): ProjectBurndownPoint[] {
  const points = reports?.burndown.points ?? [];
  if (points.length > 0) {
    return points;
  }

  return [
    {
      label: 'Current',
      open: reports?.burndown.open ?? 0,
      closed: reports?.burndown.closed ?? 0,
      ideal_remaining: reports?.burndown.open ?? 0,
    },
  ];
}

export function latestFlowPoint(reports?: ProjectReportsSnapshot): ProjectCumulativeFlowPoint {
  return (
    reports?.cumulative_flow.points.at(-1) ?? {
      label: 'Current',
      backlog: reports?.cumulative_flow.backlog ?? 0,
      active: reports?.cumulative_flow.active ?? 0,
      review: reports?.cumulative_flow.review ?? 0,
      done: reports?.cumulative_flow.done ?? 0,
    }
  );
}

export function buildReadinessStatus(readyPercent: number): ReportDashboardModel['readinessStatus'] {
  if (readyPercent >= 85) {
    return 'ready';
  }
  if (readyPercent >= 60) {
    return 'watch';
  }
  return 'blocked';
}

export function buildReportsDashboardModel(reports?: ProjectReportsSnapshot): ReportDashboardModel {
  const burndownPoints = buildBurndownPoints(reports);
  const flowPoint = latestFlowPoint(reports);
  const flowTotal = flowPoint.backlog + flowPoint.active + flowPoint.review + flowPoint.done;
  const closedTotal = reports?.burndown.closed ?? 0;
  const scopeTotal = (reports?.burndown.open ?? 0) + closedTotal;
  const readyPercent = reports?.delivery_readiness.ready_percent ?? 0;

  return {
    kpis: [
      { label: 'Open', value: reports?.burndown.open ?? 0, detail: 'burndown open scope' },
      {
        label: 'Closed',
        value: closedTotal,
        detail: `${formatPercent(safePercent(closedTotal, scopeTotal))} complete`,
        tone: 'text-cyan-300',
      },
      {
        label: 'Velocity',
        value: reports?.velocity.average_completed ?? 0,
        detail: `${reports?.velocity.sprints ?? 0} sprint samples`,
        tone: 'text-emerald-300',
      },
      {
        label: 'SLA',
        value: formatPercent(reports?.sla.overall_compliance_percent ?? 0),
        detail: 'overall compliance',
        tone: 'text-amber-300',
      },
    ],
    burndownPoints,
    flowSegments: [
      { label: 'Backlog', value: flowPoint.backlog, percent: safePercent(flowPoint.backlog, flowTotal), className: 'bg-amber-400' },
      { label: 'Active', value: flowPoint.active, percent: safePercent(flowPoint.active, flowTotal), className: 'bg-brand-400' },
      { label: 'Review', value: flowPoint.review, percent: safePercent(flowPoint.review, flowTotal), className: 'bg-cyan-400' },
      { label: 'Done', value: flowPoint.done, percent: safePercent(flowPoint.done, flowTotal), className: 'bg-emerald-400' },
    ],
    velocityAverage: reports?.velocity.average_completed ?? 0,
    velocityPredictability: formatPercent(reports?.velocity.predictability_percent ?? 0),
    cycleMetrics: reports?.cycle_time.metrics ?? [],
    slaMetrics: reports?.sla.metrics ?? [],
    readinessPercent: readyPercent,
    readinessStatus: buildReadinessStatus(readyPercent),
  };
}
