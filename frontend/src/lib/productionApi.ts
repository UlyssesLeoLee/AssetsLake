/*
```cypher
CREATE
  (f:File {name: "productionApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/productionApi", type: "module"}),
  (fn1:Function {name: "buildParams", type: "function", language: "typescript", signature: "function buildParams(filters: object): string"}),
  (fn2:Function {name: "productionApi.issues.list", type: "function", language: "typescript", signature: "async list(filters?: IssueFilters): Promise<PaginatedResponse<IssueSummary>>"}),
  (fn25:Function {name: "productionApi.issues.boardSync", type: "function", language: "typescript", signature: "async boardSync(since?: string | null, limit?: number): Promise<IssueBoardSyncSnapshot>"}),
  (fn3:Function {name: "productionApi.issues.create", type: "function", language: "typescript", signature: "async create(req: CreateIssueRequest): Promise<Issue>"}),
  (fn4:Function {name: "productionApi.issues.get", type: "function", language: "typescript", signature: "async get(id: string): Promise<Issue>"}),
  (fn5:Function {name: "productionApi.issues.update", type: "function", language: "typescript", signature: "async update(id: string, req: UpdateIssueRequest): Promise<Issue>"}),
  (fn6:Function {name: "productionApi.issues.transition", type: "function", language: "typescript", signature: "async transition(id: string, req: TransitionIssueRequest): Promise<Issue>"}),
  (fn7:Function {name: "productionApi.issues.comment", type: "function", language: "typescript", signature: "async comment(id: string, req: CreateIssueCommentRequest): Promise<IssueComment>"}),
  (fn8:Function {name: "productionApi.issues.comments", type: "function", language: "typescript", signature: "async comments(id: string): Promise<IssueComment[]>"}),
  (fn9:Function {name: "productionApi.issues.createWorkLog", type: "function", language: "typescript", signature: "async createWorkLog(id: string, req: CreateIssueWorkLogRequest): Promise<IssueWorkLog>"}),
  (fn10:Function {name: "productionApi.issues.workLogs", type: "function", language: "typescript", signature: "async workLogs(id: string): Promise<IssueWorkLog[]>"}),
  (fn11:Function {name: "productionApi.issues.delete", type: "function", language: "typescript", signature: "async delete(id: string): Promise<void>"}),
  (fn12:Function {name: "productionApi.issues.attachAsset", type: "function", language: "typescript", signature: "async attachAsset(id: string, req: AttachIssueAssetRequest): Promise<void>"}),
  (fn13:Function {name: "productionApi.issues.assets", type: "function", language: "typescript", signature: "async assets(id: string): Promise<IssueAssetSummary[]>"}),
  (fn14:Function {name: "productionApi.issues.history", type: "function", language: "typescript", signature: "async history(id: string): Promise<IssueStatusHistory[]>"}),
  (fn15:Function {name: "productionApi.issues.review", type: "function", language: "typescript", signature: "async review(id: string, req: CreateReviewRequest): Promise<ReviewRound>"}),
  (fn16:Function {name: "productionApi.issues.approve", type: "function", language: "typescript", signature: "async approve(id: string, req: ApproveIssueRequest): Promise<Issue>"}),
  (fn17:Function {name: "productionApi.issues.requestRevision", type: "function", language: "typescript", signature: "async requestRevision(id: string, req: RequestRevisionRequest): Promise<Issue>"}),
  (fn18:Function {name: "productionApi.milestones.list", type: "function", language: "typescript", signature: "async list(projectId?: string): Promise<Milestone[]>"}),
  (fn19:Function {name: "productionApi.deliveryPackages.create", type: "function", language: "typescript", signature: "async create(req: CreateDeliveryPackageRequest): Promise<DeliveryPackage>"}),
  (fn20:Function {name: "productionApi.deliveryPackages.submit", type: "function", language: "typescript", signature: "async submit(id: string, req: { submitted_by?: string; actor?: string }): Promise<DeliveryPackage>"}),
  (fn21:Function {name: "productionApi.management.intelligence", type: "function", language: "typescript", signature: "async intelligence(): Promise<ManagementIntelligence>"}),
  (fn22:Function {name: "productionApi.management.chat", type: "function", language: "typescript", signature: "async chat(req: AiControlChatRequest): Promise<AiControlChatResponse>"}),
  (fn23:Function {name: "productionApi.management.ragSearch", type: "function", language: "typescript", signature: "async ragSearch(req: RagSearchRequest): Promise<RagSearchResponse>"}),
  (fn24:Function {name: "productionApi.management.recordReplicaAction", type: "function", language: "typescript", signature: "async recordReplicaAction(req: ReplicaActionRequest): Promise<ReplicaActionResponse>"}),
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
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
  (m)-[:CONTAINS]->(fn23),
  (m)-[:CONTAINS]->(fn24),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn25)-[:CALLS]->(fn1),
  (fn25)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn7)-[:USES]->(v1),
  (fn8)-[:USES]->(v1),
  (fn9)-[:USES]->(v1),
  (fn10)-[:USES]->(v1),
  (fn11)-[:USES]->(v1),
  (fn12)-[:USES]->(v1),
  (fn13)-[:USES]->(v1),
  (fn14)-[:CALLS]->(fn1),
  (fn14)-[:USES]->(v1),
  (fn15)-[:USES]->(v1),
  (fn16)-[:USES]->(v1),
  (fn17)-[:USES]->(v1),
  (fn21)-[:USES]->(v1),
  (fn22)-[:USES]->(v1),
  (fn23)-[:USES]->(v1),
  (fn24)-[:USES]->(v1);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/asset';
import type {
  ApproveIssueRequest,
  AttachIssueAssetRequest,
  AiControlChatRequest,
  AiControlChatResponse,
  AiProviderTestResponse,
  AiAutopilotPlanRequest,
  AiAutopilotPlanResponse,
  CreateDeliveryPackageRequest,
  CreateIssueCommentRequest,
  CreateIssueRequest,
  CreateIssueWorkLogRequest,
  CreateReviewRequest,
  DeliveryPackage,
  Issue,
  IssueBoardSyncSnapshot,
  IssueAssetSummary,
  IssueComment,
  IssueFilters,
  IssueStatusHistory,
  IssueSummary,
  IssueWorkLog,
  ManagementIntelligence,
  Milestone,
  RagSearchRequest,
  RagSearchResponse,
  ReplicaActionRequest,
  ReplicaActionResponse,
  RequestRevisionRequest,
  ReviewRound,
  TransitionIssueRequest,
  UpdateIssueRequest,
} from '@/types/production';

function buildParams(filters: object): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export const productionApi = {
  issues: {
    list: async (filters: IssueFilters = {}): Promise<PaginatedResponse<IssueSummary>> => {
      const params = buildParams(filters);
      const { data } = await apiClient.get<PaginatedResponse<IssueSummary>>(
        `/api/issues${params ? `?${params}` : ''}`,
      );
      return data;
    },

    boardSync: async (since?: string | null, limit = 6): Promise<IssueBoardSyncSnapshot> => {
      const params = buildParams({ since, limit });
      const { data } = await apiClient.get<ApiResponse<IssueBoardSyncSnapshot>>(
        `/api/issues/board-sync${params ? `?${params}` : ''}`,
      );
      return data.data;
    },

    create: async (req: CreateIssueRequest): Promise<Issue> => {
      const { data } = await apiClient.post<ApiResponse<Issue>>('/api/issues', req);
      return data.data;
    },

    get: async (id: string): Promise<Issue> => {
      const { data } = await apiClient.get<ApiResponse<Issue>>(`/api/issues/${id}`);
      return data.data;
    },

    update: async (id: string, req: UpdateIssueRequest): Promise<Issue> => {
      const { data } = await apiClient.patch<ApiResponse<Issue>>(`/api/issues/${id}`, req);
      return data.data;
    },

    transition: async (id: string, req: TransitionIssueRequest): Promise<Issue> => {
      const { data } = await apiClient.post<ApiResponse<Issue>>(
        `/api/issues/${id}/transition`,
        req,
      );
      return data.data;
    },

    comment: async (id: string, req: CreateIssueCommentRequest): Promise<IssueComment> => {
      const { data } = await apiClient.post<ApiResponse<IssueComment>>(
        `/api/issues/${id}/comments`,
        req,
      );
      return data.data;
    },

    comments: async (id: string): Promise<IssueComment[]> => {
      const { data } = await apiClient.get<ApiResponse<IssueComment[]>>(
        `/api/issues/${id}/comments`,
      );
      return data.data;
    },

    createWorkLog: async (id: string, req: CreateIssueWorkLogRequest): Promise<IssueWorkLog> => {
      const { data } = await apiClient.post<ApiResponse<IssueWorkLog>>(
        `/api/issues/${id}/work-logs`,
        req,
      );
      return data.data;
    },

    workLogs: async (id: string): Promise<IssueWorkLog[]> => {
      const { data } = await apiClient.get<ApiResponse<IssueWorkLog[]>>(
        `/api/issues/${id}/work-logs`,
      );
      return data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/issues/${id}`);
    },

    attachAsset: async (id: string, req: AttachIssueAssetRequest): Promise<void> => {
      await apiClient.post(`/api/issues/${id}/attach-asset`, req);
    },

    assets: async (id: string): Promise<IssueAssetSummary[]> => {
      const { data } = await apiClient.get<ApiResponse<IssueAssetSummary[]>>(
        `/api/issues/${id}/assets`,
      );
      return data.data;
    },

    history: async (id: string): Promise<IssueStatusHistory[]> => {
      const { data } = await apiClient.get<ApiResponse<IssueStatusHistory[]>>(
        `/api/issues/${id}/history`,
      );
      return data.data;
    },

    review: async (id: string, req: CreateReviewRequest): Promise<ReviewRound> => {
      const { data } = await apiClient.post<ApiResponse<ReviewRound>>(
        `/api/issues/${id}/review`,
        req,
      );
      return data.data;
    },

    approve: async (id: string, req: ApproveIssueRequest): Promise<Issue> => {
      const { data } = await apiClient.post<ApiResponse<Issue>>(`/api/issues/${id}/approve`, req);
      return data.data;
    },

    requestRevision: async (id: string, req: RequestRevisionRequest): Promise<Issue> => {
      const { data } = await apiClient.post<ApiResponse<Issue>>(
        `/api/issues/${id}/request-revision`,
        req,
      );
      return data.data;
    },
  },

  milestones: {
    list: async (projectId?: string): Promise<Milestone[]> => {
      const params = buildParams({ project_id: projectId });
      const { data } = await apiClient.get<ApiResponse<Milestone[]>>(
        `/api/milestones${params ? `?${params}` : ''}`,
      );
      return data.data;
    },
  },

  deliveryPackages: {
    create: async (req: CreateDeliveryPackageRequest): Promise<DeliveryPackage> => {
      const { data } = await apiClient.post<ApiResponse<DeliveryPackage>>(
        '/api/delivery-packages',
        req,
      );
      return data.data;
    },

    submit: async (
      id: string,
      req: { submitted_by?: string; actor?: string },
    ): Promise<DeliveryPackage> => {
      const { data } = await apiClient.post<ApiResponse<DeliveryPackage>>(
        `/api/delivery-packages/${id}/submit`,
        req,
      );
      return data.data;
    },
  },

  management: {
    intelligence: async (): Promise<ManagementIntelligence> => {
      const { data } = await apiClient.get<ApiResponse<ManagementIntelligence>>(
        '/api/management/intelligence',
      );
      return data.data;
    },

    chat: async (req: AiControlChatRequest): Promise<AiControlChatResponse> => {
      const { data } = await apiClient.post<ApiResponse<AiControlChatResponse>>(
        '/api/management/chat',
        req,
        { timeout: 90_000 },
      );
      return data.data;
    },

    testConnection: async (): Promise<AiProviderTestResponse> => {
      const { data } = await apiClient.post<ApiResponse<AiProviderTestResponse>>(
        '/api/management/ai/test',
        {},
        { timeout: 25_000 },
      );
      return data.data;
    },

    autopilotPlan: async (req: AiAutopilotPlanRequest): Promise<AiAutopilotPlanResponse> => {
      const { data } = await apiClient.post<ApiResponse<AiAutopilotPlanResponse>>(
        '/api/management/autopilot-plan',
        req,
        { timeout: 90_000 },
      );
      return data.data;
    },

    ragSearch: async (req: RagSearchRequest): Promise<RagSearchResponse> => {
      const { data } = await apiClient.post<ApiResponse<RagSearchResponse>>(
        '/api/management/rag/search',
        req,
        { timeout: 45_000 },
      );
      return data.data;
    },

    recordReplicaAction: async (req: ReplicaActionRequest): Promise<ReplicaActionResponse> => {
      const { data } = await apiClient.post<ApiResponse<ReplicaActionResponse>>(
        '/api/management/replica-actions',
        req,
        {
          headers: { 'x-assetslake-ai-write-scope': 'replica' },
          timeout: 45_000,
        },
      );
      return data.data;
    },
  },
};
