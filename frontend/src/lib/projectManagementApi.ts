/*
```cypher
CREATE
  (f:File {name: "projectManagementApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/projectManagementApi", type: "module"}),
  (fn1:Function {name: "buildParams", type: "function", language: "typescript", signature: "function buildParams(filters: Record<string, unknown>): string"}),
  (fn2:Function {name: "projectManagementApi.planning.plan", type: "function", language: "typescript", signature: "async plan(projectId: string): Promise<ProjectManagementPlan>"}),
  (fn3:Function {name: "projectManagementApi.planning.epics", type: "function", language: "typescript", signature: "async epics(projectId: string): Promise<ProjectManagementEpic[]>"}),
  (fn4:Function {name: "projectManagementApi.planning.createEpic", type: "function", language: "typescript", signature: "async createEpic(req: CreateEpicRequest): Promise<ProjectManagementEpic>"}),
  (fn5:Function {name: "projectManagementApi.planning.sprints", type: "function", language: "typescript", signature: "async sprints(projectId: string): Promise<ProjectManagementSprint[]>"}),
  (fn6:Function {name: "projectManagementApi.planning.createSprint", type: "function", language: "typescript", signature: "async createSprint(req: CreateSprintRequest): Promise<ProjectManagementSprint>"}),
  (fn7:Function {name: "projectManagementApi.timeline.dependencies", type: "function", language: "typescript", signature: "async dependencies(projectId: string): Promise<IssueDependency[]>"}),
  (fn8:Function {name: "projectManagementApi.timeline.createDependency", type: "function", language: "typescript", signature: "async createDependency(req: CreateIssueDependencyRequest): Promise<IssueDependency>"}),
  (fn9:Function {name: "projectManagementApi.timeline.events", type: "function", language: "typescript", signature: "async events(projectId: string): Promise<IssueEvent[]>"}),
  (fn10:Function {name: "projectManagementApi.product.gantt", type: "function", language: "typescript", signature: "async gantt(projectId: string): Promise<ProjectGanttSnapshot>"}),
  (fn11:Function {name: "projectManagementApi.product.calendar", type: "function", language: "typescript", signature: "async calendar(projectId: string): Promise<ProjectCalendarSnapshot>"}),
  (fn12:Function {name: "projectManagementApi.product.reports", type: "function", language: "typescript", signature: "async reports(projectId: string): Promise<ProjectReportsSnapshot>"}),
  (fn13:Function {name: "projectManagementApi.product.workflow", type: "function", language: "typescript", signature: "async workflow(projectId: string): Promise<ProjectWorkflowCatalog>"}),
  (fn14:Function {name: "projectManagementApi.product.automation", type: "function", language: "typescript", signature: "async automation(projectId: string): Promise<ProjectAutomationCatalog>"}),
  (fn15:Function {name: "projectManagementApi.product.enterprise", type: "function", language: "typescript", signature: "async enterprise(projectId: string): Promise<ProjectEnterpriseControls>"}),
  (v1:Variable {name: "apiClient", type: "variable"}),
  (v2:Variable {name: "URLSearchParams", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn7)-[:CALLS]->(fn1),
  (fn7)-[:USES]->(v1),
  (fn8)-[:USES]->(v1),
  (fn9)-[:CALLS]->(fn1),
  (fn9)-[:USES]->(v1),
  (fn10)-[:CALLS]->(fn1),
  (fn10)-[:USES]->(v1),
  (fn11)-[:CALLS]->(fn1),
  (fn11)-[:USES]->(v1),
  (fn12)-[:CALLS]->(fn1),
  (fn12)-[:USES]->(v1),
  (fn13)-[:CALLS]->(fn1),
  (fn13)-[:USES]->(v1),
  (fn14)-[:CALLS]->(fn1),
  (fn14)-[:USES]->(v1),
  (fn15)-[:CALLS]->(fn1),
  (fn15)-[:USES]->(v1);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type {
  CreateEpicRequest,
  CreateIssueDependencyRequest,
  CreateSprintRequest,
  IssueDependency,
  IssueEvent,
  ProjectAutomationCatalog,
  ProjectCalendarSnapshot,
  ProjectEnterpriseControls,
  ProjectGanttSnapshot,
  ProjectManagementEpic,
  ProjectManagementPlan,
  ProjectManagementSprint,
  ProjectReportsSnapshot,
  ProjectWorkflowCatalog,
} from '@/types/projectManagement';

function buildParams(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export const projectManagementApi = {
  planning: {
    plan: async (projectId: string): Promise<ProjectManagementPlan> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectManagementPlan>>(
        `/api/project-management/plan?${params}`,
      );
      return data.data;
    },

    epics: async (projectId: string): Promise<ProjectManagementEpic[]> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectManagementEpic[]>>(
        `/api/project-management/epics?${params}`,
      );
      return data.data;
    },

    createEpic: async (req: CreateEpicRequest): Promise<ProjectManagementEpic> => {
      const { data } = await apiClient.post<ApiResponse<ProjectManagementEpic>>(
        '/api/project-management/epics',
        req,
      );
      return data.data;
    },

    sprints: async (projectId: string): Promise<ProjectManagementSprint[]> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectManagementSprint[]>>(
        `/api/project-management/sprints?${params}`,
      );
      return data.data;
    },

    createSprint: async (req: CreateSprintRequest): Promise<ProjectManagementSprint> => {
      const { data } = await apiClient.post<ApiResponse<ProjectManagementSprint>>(
        '/api/project-management/sprints',
        req,
      );
      return data.data;
    },
  },

  timeline: {
    dependencies: async (projectId: string): Promise<IssueDependency[]> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<IssueDependency[]>>(
        `/api/project-management/dependencies?${params}`,
      );
      return data.data;
    },

    createDependency: async (req: CreateIssueDependencyRequest): Promise<IssueDependency> => {
      const { data } = await apiClient.post<ApiResponse<IssueDependency>>(
        '/api/project-management/dependencies',
        req,
      );
      return data.data;
    },

    events: async (projectId: string): Promise<IssueEvent[]> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<IssueEvent[]>>(
        `/api/project-management/events?${params}`,
      );
      return data.data;
    },
  },

  product: {
    gantt: async (projectId: string): Promise<ProjectGanttSnapshot> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectGanttSnapshot>>(
        `/api/project-management/gantt?${params}`,
      );
      return data.data;
    },

    calendar: async (projectId: string): Promise<ProjectCalendarSnapshot> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectCalendarSnapshot>>(
        `/api/project-management/calendar?${params}`,
      );
      return data.data;
    },

    reports: async (projectId: string): Promise<ProjectReportsSnapshot> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectReportsSnapshot>>(
        `/api/project-management/reports?${params}`,
      );
      return data.data;
    },

    workflow: async (projectId: string): Promise<ProjectWorkflowCatalog> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectWorkflowCatalog>>(
        `/api/project-management/workflow?${params}`,
      );
      return data.data;
    },

    automation: async (projectId: string): Promise<ProjectAutomationCatalog> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectAutomationCatalog>>(
        `/api/project-management/automation?${params}`,
      );
      return data.data;
    },

    enterprise: async (projectId: string): Promise<ProjectEnterpriseControls> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<ProjectEnterpriseControls>>(
        `/api/project-management/enterprise?${params}`,
      );
      return data.data;
    },
  },
};
