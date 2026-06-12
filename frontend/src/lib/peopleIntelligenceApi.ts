/*
```cypher
CREATE
  (f:File {name: "peopleIntelligenceApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/peopleIntelligenceApi", type: "module"}),
  (v1:Variable {name: "peopleIntelligenceApi", type: "variable"}),
  (fn1:Function {name: "peopleIntelligenceApi.myProfile", type: "function", language: "typescript"}),
  (fn2:Function {name: "peopleIntelligenceApi.updateMyProfile", type: "function", language: "typescript"}),
  (fn3:Function {name: "peopleIntelligenceApi.capabilities", type: "function", language: "typescript"}),
  (fn4:Function {name: "peopleIntelligenceApi.search", type: "function", language: "typescript"}),
  (fn5:Function {name: "peopleIntelligenceApi.evaluation", type: "function", language: "typescript"}),
  (fn6:Function {name: "peopleIntelligenceApi.submitCorrection", type: "function", language: "typescript"}),
  (fn7:Function {name: "peopleIntelligenceApi.verifyCapability", type: "function", language: "typescript"}),
  (fn8:Function {name: "peopleIntelligenceApi.reindex", type: "function", language: "typescript"}),
  (fn9:Function {name: "peopleIntelligenceApi.approveCapability", type: "function", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (v1)-[:HAS_METHOD]->(fn1),
  (v1)-[:HAS_METHOD]->(fn2),
  (v1)-[:HAS_METHOD]->(fn3),
  (v1)-[:HAS_METHOD]->(fn4),
  (v1)-[:HAS_METHOD]->(fn5),
  (v1)-[:HAS_METHOD]->(fn6),
  (v1)-[:HAS_METHOD]->(fn7),
  (v1)-[:HAS_METHOD]->(fn8),
  (v1)-[:HAS_METHOD]->(fn9);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type {
  CapabilityTaxonomyItem,
  EmployeeEvaluation,
  EmployeeProfile,
  PeopleReindexResponse,
  PeopleSearchMatch,
  PeopleSearchQuery,
  UpdateEmployeeProfileRequest,
} from '@/types/peopleIntelligence';

export const peopleIntelligenceApi = {
  async myProfile(): Promise<EmployeeProfile> {
    const { data } = await apiClient.get<ApiResponse<EmployeeProfile>>('/api/people/me');
    return data.data;
  },

  async updateMyProfile(request: UpdateEmployeeProfileRequest): Promise<EmployeeProfile> {
    const { data } = await apiClient.patch<ApiResponse<EmployeeProfile>>(
      '/api/people/me',
      request,
    );
    return data.data;
  },

  async capabilities(workspaceId: string, includeCandidates = false) {
    const params = new URLSearchParams({
      workspace_id: workspaceId,
      include_candidates: String(includeCandidates),
    });
    const { data } = await apiClient.get<ApiResponse<CapabilityTaxonomyItem[]>>(
      `/api/people/capabilities?${params.toString()}`,
    );
    return data.data;
  },

  async search(request: PeopleSearchQuery): Promise<PeopleSearchMatch[]> {
    const { data } = await apiClient.post<ApiResponse<PeopleSearchMatch[]>>(
      '/api/people/search',
      request,
    );
    return data.data;
  },

  async evaluation(userId: string, windowDays: number): Promise<EmployeeEvaluation> {
    const { data } = await apiClient.get<ApiResponse<EmployeeEvaluation>>(
      `/api/people/${userId}/evaluation?window_days=${windowDays}`,
    );
    return data.data;
  },

  async submitCorrection(userId: string, reason: string) {
    const { data } = await apiClient.post<ApiResponse<{ id: string }>>(
      `/api/people/${userId}/corrections`,
      { correction_type: 'evaluation', reason },
    );
    return data.data;
  },

  async verifyCapability(
    userId: string,
    capabilityId: string,
    verificationStatus: 'verified' | 'rejected' | 'pending',
  ) {
    const { data } = await apiClient.post(
      `/api/people/${userId}/capabilities/${capabilityId}/verify`,
      { verification_status: verificationStatus },
    );
    return data.data;
  },

  async reindex(workspaceId: string): Promise<PeopleReindexResponse> {
    const { data } = await apiClient.post<ApiResponse<PeopleReindexResponse>>(
      '/api/people/admin/reindex',
      { workspace_id: workspaceId, employee_ids: [] },
    );
    return data.data;
  },

  async approveCapability(capabilityId: string): Promise<CapabilityTaxonomyItem> {
    const { data } = await apiClient.post<ApiResponse<CapabilityTaxonomyItem>>(
      `/api/people/admin/capabilities/${capabilityId}/approve`,
    );
    return data.data;
  },
};
