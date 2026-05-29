/*
```cypher
CREATE
  (f:File {name: "authApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/authApi", type: "module"}),
  (c1:Class {name: "LoginRequest", type: "class", language: "typescript", signature: "interface LoginRequest"}),
  (c2:Class {name: "SessionUserResponse", type: "class", language: "typescript", signature: "interface SessionUserResponse"}),
  (c3:Class {name: "TestAccount", type: "class", language: "typescript", signature: "interface TestAccount"}),
  (v1:Variable {name: "authApi", type: "variable"}),
  (v2:Variable {name: "apiClient", type: "variable"}),
  (v3:Variable {name: "ApiResponse", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type { AuthSession, AuthUser } from '@/lib/authSession';

export interface LoginRequest {
  username: string;
  password: string;
  device_label?: string;
}

export interface SessionUserResponse {
  user: AuthUser;
  session_id: string;
  expires_at: string;
}

export interface TestAccount {
  username: string;
  display_name?: string | null;
  role: string;
}

export const authApi = {
  login: async (req: LoginRequest): Promise<AuthSession> => {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>('/api/auth/login', req);
    return data.data;
  },

  me: async (): Promise<SessionUserResponse> => {
    const { data } = await apiClient.get<ApiResponse<SessionUserResponse>>('/api/auth/me');
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  testAccounts: async (): Promise<TestAccount[]> => {
    const { data } = await apiClient.get<ApiResponse<TestAccount[]>>('/api/auth/test-accounts');
    return data.data;
  },
};
