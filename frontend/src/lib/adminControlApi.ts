/*
```cypher
CREATE
  (f:File {name: "adminControlApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/adminControlApi", type: "module"}),
  (fn1:Function {name: "snapshot", type: "function", language: "typescript", signature: "async function snapshot(): Promise<AdminControlSnapshot>"}),
  (fn2:Function {name: "updateSettings", type: "function", language: "typescript", signature: "async function updateSettings(req: UpdateAdminControlSettingsRequest): Promise<AdminControlSettings>"}),
  (fn3:Function {name: "updateUserRole", type: "function", language: "typescript", signature: "async function updateUserRole(userId: string, role: string): Promise<AdminUserSummary>"}),
  (v1:Variable {name: "adminControlApi", type: "variable"}),
  (v2:Variable {name: "apiClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type {
  AdminControlSettings,
  AdminControlSnapshot,
  AdminAiRiskAnalysis,
  AdminAiRiskAnalysisRequest,
  AdminOperationTracePage,
  AdminOperationTraceQuery,
  AdminRiskPolicySettings,
  AdminUserPage,
  AdminUserSummary,
  AdminUsersQuery,
  UpdateAdminControlSettingsRequest,
  UpdateAdminRiskPolicyRequest,
  UpdateAdminUserStatusRequest,
} from '@/types/adminControl';

function paramsFromQuery(query: object): string {
  const params = new URLSearchParams();
  Object.entries(query as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const adminControlApi = {
  snapshot: async (): Promise<AdminControlSnapshot> => {
    const { data } = await apiClient.get<ApiResponse<AdminControlSnapshot>>('/api/admin/control');
    return data.data;
  },

  users: async (query: AdminUsersQuery = {}): Promise<AdminUserPage> => {
    const { data } = await apiClient.get<ApiResponse<AdminUserPage>>(
      `/api/admin/control/users${paramsFromQuery(query)}`,
    );
    return data.data;
  },

  operationTraces: async (
    query: AdminOperationTraceQuery = {},
  ): Promise<AdminOperationTracePage> => {
    const { data } = await apiClient.get<ApiResponse<AdminOperationTracePage>>(
      `/api/admin/control/operation-traces${paramsFromQuery(query)}`,
    );
    return data.data;
  },

  exportOperationTraces: async (query: AdminOperationTraceQuery = {}): Promise<string> => {
    const { data } = await apiClient.get<string>(
      `/api/admin/control/operation-traces/export${paramsFromQuery(query)}`,
      { responseType: 'text' },
    );
    return data;
  },

  updateSettings: async (req: UpdateAdminControlSettingsRequest): Promise<AdminControlSettings> => {
    const { data } = await apiClient.patch<ApiResponse<AdminControlSettings>>(
      '/api/admin/control/settings',
      req,
    );
    return data.data;
  },

  updateRiskPolicy: async (req: UpdateAdminRiskPolicyRequest): Promise<AdminRiskPolicySettings> => {
    const { data } = await apiClient.patch<ApiResponse<AdminRiskPolicySettings>>(
      '/api/admin/control/risk-policy',
      req,
    );
    return data.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<AdminUserSummary> => {
    const { data } = await apiClient.patch<ApiResponse<AdminUserSummary>>(
      `/api/admin/control/users/${userId}/role`,
      { role },
    );
    return data.data;
  },

  updateUserStatus: async (
    userId: string,
    req: UpdateAdminUserStatusRequest,
  ): Promise<AdminUserSummary> => {
    const { data } = await apiClient.patch<ApiResponse<AdminUserSummary>>(
      `/api/admin/control/users/${userId}/status`,
      req,
    );
    return data.data;
  },

  runAiRiskAnalysis: async (req: AdminAiRiskAnalysisRequest = {}): Promise<AdminAiRiskAnalysis> => {
    const { data } = await apiClient.post<ApiResponse<AdminAiRiskAnalysis>>(
      '/api/admin/control/ai/risk-analysis',
      req,
    );
    return data.data;
  },
};
