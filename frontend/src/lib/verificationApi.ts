/*
```cypher
CREATE
  (f:File {name: "verificationApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/verificationApi", type: "module"}),
  (fn1:Function {name: "getApp", type: "function", language: "typescript", signature: "async function getApp(): Promise<VerificationAppInfo>"}),
  (fn2:Function {name: "startChallenge", type: "function", language: "typescript", signature: "async function startChallenge(req: StartVerificationRequest): Promise<StartVerificationResponse>"}),
  (fn3:Function {name: "verifyCode", type: "function", language: "typescript", signature: "async function verifyCode(challengeId: string, req: VerifyCodeRequest): Promise<VerifyCodeResponse>"}),
  (fn4:Function {name: "register", type: "function", language: "typescript", signature: "async function register(req: RegisterWithVerificationRequest): Promise<VerificationMutationResponse>"}),
  (fn5:Function {name: "changePassword", type: "function", language: "typescript", signature: "async function changePassword(req: ChangePasswordWithVerificationRequest): Promise<VerificationMutationResponse>"}),
  (fn6:Function {name: "outbox", type: "function", language: "typescript", signature: "async function outbox(limit?: number): Promise<VerificationOutboxItem[]>"}),
  (v1:Variable {name: "verificationApi", type: "variable"}),
  (v2:Variable {name: "apiClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v2),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v2);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type {
  ChangePasswordWithVerificationRequest,
  RegisterWithVerificationRequest,
  StartVerificationRequest,
  StartVerificationResponse,
  VerificationAppInfo,
  VerificationMutationResponse,
  VerificationOutboxItem,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from '@/types/verification';

export const verificationApi = {
  getApp: async (): Promise<VerificationAppInfo> => {
    const { data } = await apiClient.get<ApiResponse<VerificationAppInfo>>('/api/verification/app');
    return data.data;
  },

  startChallenge: async (req: StartVerificationRequest): Promise<StartVerificationResponse> => {
    const { data } = await apiClient.post<ApiResponse<StartVerificationResponse>>(
      '/api/verification/challenges',
      req,
    );
    return data.data;
  },

  verifyCode: async (challengeId: string, req: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const { data } = await apiClient.post<ApiResponse<VerifyCodeResponse>>(
      `/api/verification/challenges/${challengeId}/verify`,
      req,
    );
    return data.data;
  },

  register: async (req: RegisterWithVerificationRequest): Promise<VerificationMutationResponse> => {
    const { data } = await apiClient.post<ApiResponse<VerificationMutationResponse>>(
      '/api/verification/register',
      req,
    );
    return data.data;
  },

  changePassword: async (
    req: ChangePasswordWithVerificationRequest,
  ): Promise<VerificationMutationResponse> => {
    const { data } = await apiClient.post<ApiResponse<VerificationMutationResponse>>(
      '/api/verification/password',
      req,
    );
    return data.data;
  },

  outbox: async (limit = 20): Promise<VerificationOutboxItem[]> => {
    const { data } = await apiClient.get<ApiResponse<VerificationOutboxItem[]>>(
      `/api/verification/outbox?limit=${limit}`,
    );
    return data.data;
  },
};
