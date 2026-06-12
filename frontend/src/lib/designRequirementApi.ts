/*
```cypher
CREATE
  (f:File {name: "designRequirementApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/designRequirementApi", type: "module"}),
  (fn1:Function {name: "designRequirementApi.list", type: "function", language: "typescript"}),
  (fn2:Function {name: "designRequirementApi.create", type: "function", language: "typescript"}),
  (fn3:Function {name: "designRequirementApi.get", type: "function", language: "typescript"}),
  (fn4:Function {name: "designRequirementApi.update", type: "function", language: "typescript"}),
  (fn5:Function {name: "designRequirementApi.attachAsset", type: "function", language: "typescript"}),
  (fn6:Function {name: "designRequirementApi.comment", type: "function", language: "typescript"}),
  (fn7:Function {name: "designRequirementApi.aiDraft", type: "function", language: "typescript"}),
  (v1:Variable {name: "apiClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn7)-[:USES]->(v1);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type {
  CreateDesignRequirementRequest,
  DesignAiDraft,
  DesignAssetRelation,
  DesignRequirement,
  DesignRequirementAsset,
  DesignRequirementComment,
  DesignRequirementDetail,
  DesignRequirementStatus,
  UpdateDesignRequirementRequest,
} from '@/types/designRequirement';

export const designRequirementApi = {
  list: async (
    workspaceId: string,
    status?: DesignRequirementStatus,
  ): Promise<DesignRequirement[]> => {
    const params = new URLSearchParams({ workspace_id: workspaceId });
    if (status) params.set('status', status);
    const { data } = await apiClient.get<ApiResponse<DesignRequirement[]>>(
      `/api/design-requirements?${params.toString()}`,
    );
    return data.data;
  },
  create: async (request: CreateDesignRequirementRequest): Promise<DesignRequirement> => {
    const { data } = await apiClient.post<ApiResponse<DesignRequirement>>(
      '/api/design-requirements',
      request,
    );
    return data.data;
  },
  get: async (id: string): Promise<DesignRequirementDetail> => {
    const { data } = await apiClient.get<ApiResponse<DesignRequirementDetail>>(
      `/api/design-requirements/${id}`,
    );
    return data.data;
  },
  update: async (
    id: string,
    request: UpdateDesignRequirementRequest,
  ): Promise<DesignRequirement> => {
    const { data } = await apiClient.patch<ApiResponse<DesignRequirement>>(
      `/api/design-requirements/${id}`,
      request,
    );
    return data.data;
  },
  attachAsset: async (
    id: string,
    assetId: string,
    relationType: DesignAssetRelation,
    note?: string,
  ): Promise<DesignRequirementAsset> => {
    const { data } = await apiClient.post<ApiResponse<DesignRequirementAsset>>(
      `/api/design-requirements/${id}/assets`,
      { asset_id: assetId, relation_type: relationType, note },
    );
    return data.data;
  },
  comment: async (id: string, body: string): Promise<DesignRequirementComment> => {
    const { data } = await apiClient.post<ApiResponse<DesignRequirementComment>>(
      `/api/design-requirements/${id}/comments`,
      { body },
    );
    return data.data;
  },
  aiDraft: async (
    workspaceId: string,
    prompt: string,
    assetIds: string[],
    projectId?: string,
  ): Promise<DesignAiDraft> => {
    const { data } = await apiClient.post<ApiResponse<DesignAiDraft>>(
      '/api/design-requirements/ai/draft',
      { workspace_id: workspaceId, project_id: projectId, prompt, asset_ids: assetIds },
      { timeout: 60_000 },
    );
    return data.data;
  },
};
