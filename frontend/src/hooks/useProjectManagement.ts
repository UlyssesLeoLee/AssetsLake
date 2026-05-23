/*
```cypher
CREATE
  (f:File {name: "useProjectManagement.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/hooks/useProjectManagement", type: "module"}),
  (fn1:Function {name: "useProjectManagementPlan", type: "function", language: "typescript", signature: "function useProjectManagementPlan(projectId?: string)"}),
  (fn2:Function {name: "useProjectManagementEpics", type: "function", language: "typescript", signature: "function useProjectManagementEpics(projectId?: string)"}),
  (fn3:Function {name: "useProjectManagementSprints", type: "function", language: "typescript", signature: "function useProjectManagementSprints(projectId?: string)"}),
  (fn4:Function {name: "useIssueDependencies", type: "function", language: "typescript", signature: "function useIssueDependencies(projectId?: string)"}),
  (fn5:Function {name: "useIssueEvents", type: "function", language: "typescript", signature: "function useIssueEvents(projectId?: string)"}),
  (fn6:Function {name: "useProjectGantt", type: "function", language: "typescript", signature: "function useProjectGantt(projectId?: string)"}),
  (fn7:Function {name: "useProjectCalendar", type: "function", language: "typescript", signature: "function useProjectCalendar(projectId?: string)"}),
  (fn8:Function {name: "useProjectReports", type: "function", language: "typescript", signature: "function useProjectReports(projectId?: string)"}),
  (fn9:Function {name: "useProjectWorkflow", type: "function", language: "typescript", signature: "function useProjectWorkflow(projectId?: string)"}),
  (fn10:Function {name: "useProjectAutomation", type: "function", language: "typescript", signature: "function useProjectAutomation(projectId?: string)"}),
  (fn11:Function {name: "useEnterpriseControls", type: "function", language: "typescript", signature: "function useEnterpriseControls(projectId?: string)"}),
  (v1:Variable {name: "projectManagementApi", type: "variable"}),
  (v2:Variable {name: "projectId", type: "variable"}),
  (f)-[:CONTAINS]->(m),
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
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2),
  (fn7)-[:USES]->(v1),
  (fn7)-[:USES]->(v2),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v2),
  (fn9)-[:USES]->(v1),
  (fn9)-[:USES]->(v2),
  (fn10)-[:USES]->(v1),
  (fn10)-[:USES]->(v2),
  (fn11)-[:USES]->(v1),
  (fn11)-[:USES]->(v2);
```
*/

'use client';

import { useQuery } from '@tanstack/react-query';

import { projectManagementApi } from '@/lib/projectManagementApi';

export function useProjectManagementPlan(projectId?: string) {
  return useQuery({
    queryKey: ['project-management-plan', projectId],
    queryFn: () => projectManagementApi.planning.plan(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectManagementEpics(projectId?: string) {
  return useQuery({
    queryKey: ['project-management-epics', projectId],
    queryFn: () => projectManagementApi.planning.epics(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectManagementSprints(projectId?: string) {
  return useQuery({
    queryKey: ['project-management-sprints', projectId],
    queryFn: () => projectManagementApi.planning.sprints(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useIssueDependencies(projectId?: string) {
  return useQuery({
    queryKey: ['issue-dependencies', projectId],
    queryFn: () => projectManagementApi.timeline.dependencies(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useIssueEvents(projectId?: string) {
  return useQuery({
    queryKey: ['issue-events', projectId],
    queryFn: () => projectManagementApi.timeline.events(projectId as string),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}

export function useProjectGantt(projectId?: string) {
  return useQuery({
    queryKey: ['project-gantt', projectId],
    queryFn: () => projectManagementApi.product.gantt(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectCalendar(projectId?: string) {
  return useQuery({
    queryKey: ['project-calendar', projectId],
    queryFn: () => projectManagementApi.product.calendar(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectReports(projectId?: string) {
  return useQuery({
    queryKey: ['project-reports', projectId],
    queryFn: () => projectManagementApi.product.reports(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectWorkflow(projectId?: string) {
  return useQuery({
    queryKey: ['project-workflow', projectId],
    queryFn: () => projectManagementApi.product.workflow(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useProjectAutomation(projectId?: string) {
  return useQuery({
    queryKey: ['project-automation', projectId],
    queryFn: () => projectManagementApi.product.automation(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useEnterpriseControls(projectId?: string) {
  return useQuery({
    queryKey: ['enterprise-controls', projectId],
    queryFn: () => projectManagementApi.product.enterprise(projectId as string),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}
