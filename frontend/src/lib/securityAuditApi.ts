/*
```cypher
CREATE
  (f:File {name: "securityAuditApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/securityAuditApi", type: "module"}),
  (c1:Class {name: "SecurityAuditQuery", type: "class", language: "typescript", signature: "interface SecurityAuditQuery"}),
  (c2:Class {name: "SecurityAuditEvent", type: "class", language: "typescript", signature: "interface SecurityAuditEvent"}),
  (fn1:Function {name: "buildSecurityAuditQueryString", type: "function", language: "typescript", signature: "function buildSecurityAuditQueryString(query?: SecurityAuditQuery): string"}),
  (v1:Variable {name: "securityAuditApi", type: "variable"}),
  (v2:Variable {name: "apiClient", type: "variable"}),
  (v3:Variable {name: "query", type: "variable"}),
  (v4:Variable {name: "params", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';

export interface SecurityAuditQuery {
  limit?: number;
  action?: string;
  outcome?: string;
  entity_type?: string;
}

export interface SecurityAuditEvent {
  id: number;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id?: string | null;
  actor?: string | null;
  diff: Record<string, unknown>;
  created_at: string;
}

function buildSecurityAuditQueryString(query: SecurityAuditQuery = {}): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params.set(key, String(value));
    }
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export const securityAuditApi = {
  list: async (query: SecurityAuditQuery = {}): Promise<SecurityAuditEvent[]> => {
    const { data } = await apiClient.get<ApiResponse<SecurityAuditEvent[]>>(
      `/api/security/audit-events${buildSecurityAuditQueryString(query)}`
    );
    return data.data;
  },
};
