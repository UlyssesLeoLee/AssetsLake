/*
```cypher
CREATE
  (f:File {name: "appAssistantApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/appAssistantApi", type: "module"}),
  (fn1:Function {name: "appAssistantApi.chat", type: "function", language: "typescript"}),
  (fn2:Function {name: "appAssistantApi.history", type: "function", language: "typescript"}),
  (fn3:Function {name: "appAssistantApi.recordReplicaAction", type: "function", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3);
```
*/

import { apiClient } from '@/lib/api';
import type {
  AppAssistantChatRequest,
  AppAssistantChatResponse,
  AppAssistantConversation,
  AppAssistantReplicaActionResult,
} from '@/types/appAssistant';
import type { ApiResponse } from '@/types/asset';

export const appAssistantApi = {
  chat: async (request: AppAssistantChatRequest): Promise<AppAssistantChatResponse> => {
    const { data } = await apiClient.post<ApiResponse<AppAssistantChatResponse>>(
      '/api/management/chat',
      request,
      { timeout: 90_000 },
    );
    return data.data;
  },

  history: async (appId?: string, limit = 8): Promise<AppAssistantConversation[]> => {
    const { data } = await apiClient.get<ApiResponse<AppAssistantConversation[]>>(
      '/api/management/chat/history',
      { params: { app_id: appId, limit } },
    );
    return data.data;
  },

  recordReplicaAction: async (request: {
    action_id: string;
    title: string;
    app: string;
    target_label: string;
    intent: string;
    writes: string[];
    metadata: Record<string, unknown>;
  }): Promise<AppAssistantReplicaActionResult> => {
    const { data } = await apiClient.post<ApiResponse<AppAssistantReplicaActionResult>>(
      '/api/management/replica-actions',
      request,
      { headers: { 'x-assetslake-ai-write-scope': 'replica' } },
    );
    return data.data;
  },
};
