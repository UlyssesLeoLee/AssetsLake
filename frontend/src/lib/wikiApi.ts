/*
```cypher
CREATE
  (f:File {name: "wikiApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/wikiApi", type: "module"}),
  (fn1:Function {name: "wikiApi.listSpaces", type: "function", language: "typescript"}),
  (fn2:Function {name: "wikiApi.createSpace", type: "function", language: "typescript"}),
  (fn3:Function {name: "wikiApi.listPages", type: "function", language: "typescript"}),
  (fn4:Function {name: "wikiApi.createPage", type: "function", language: "typescript"}),
  (fn5:Function {name: "wikiApi.syncPage", type: "function", language: "typescript"}),
  (fn6:Function {name: "wikiApi.applyUpdate", type: "function", language: "typescript"}),
  (fn7:Function {name: "wikiApi.touchPresence", type: "function", language: "typescript"}),
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
  CreateWikiPageRequest,
  CreateWikiSpaceRequest,
  TextPatch,
  WikiPage,
  WikiPageUpdate,
  WikiPresence,
  WikiSpace,
  WikiSyncSnapshot,
} from '@/types/wiki';

export const wikiApi = {
  listSpaces: async (workspaceId: string): Promise<WikiSpace[]> => {
    const { data } = await apiClient.get<ApiResponse<WikiSpace[]>>(
      `/api/wiki/spaces?workspace_id=${workspaceId}`,
    );
    return data.data;
  },
  createSpace: async (request: CreateWikiSpaceRequest): Promise<WikiSpace> => {
    const { data } = await apiClient.post<ApiResponse<WikiSpace>>('/api/wiki/spaces', request);
    return data.data;
  },
  listPages: async (spaceId: string): Promise<WikiPage[]> => {
    const { data } = await apiClient.get<ApiResponse<WikiPage[]>>(
      `/api/wiki/spaces/${spaceId}/pages`,
    );
    return data.data;
  },
  createPage: async (request: CreateWikiPageRequest): Promise<WikiPage> => {
    const { data } = await apiClient.post<ApiResponse<WikiPage>>('/api/wiki/pages', request);
    return data.data;
  },
  syncPage: async (pageId: string, afterVersion: number): Promise<WikiSyncSnapshot> => {
    const { data } = await apiClient.get<ApiResponse<WikiSyncSnapshot>>(
      `/api/wiki/pages/${pageId}/sync?after_version=${afterVersion}`,
    );
    return data.data;
  },
  applyUpdate: async (
    pageId: string,
    clientId: string,
    baseVersion: number,
    patch: TextPatch,
  ): Promise<WikiPageUpdate> => {
    const { data } = await apiClient.post<ApiResponse<WikiPageUpdate>>(
      `/api/wiki/pages/${pageId}/updates`,
      { client_id: clientId, base_version: baseVersion, patch },
    );
    return data.data;
  },
  touchPresence: async (
    pageId: string,
    clientId: string,
    cursorAnchor?: number,
    cursorHead?: number,
  ): Promise<WikiPresence[]> => {
    const { data } = await apiClient.post<ApiResponse<WikiPresence[]>>(
      `/api/wiki/pages/${pageId}/presence`,
      { client_id: clientId, cursor_anchor: cursorAnchor, cursor_head: cursorHead },
    );
    return data.data;
  },
};
