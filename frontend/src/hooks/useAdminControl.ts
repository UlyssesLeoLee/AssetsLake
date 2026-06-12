/*
```cypher
CREATE
  (f:File {name: "useAdminControl.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/hooks/useAdminControl", type: "module"}),
  (fn1:Function {name: "useAdminControlSnapshot", type: "function", language: "typescript", signature: "function useAdminControlSnapshot()"}),
  (fn2:Function {name: "useUpdateAdminControlSettings", type: "function", language: "typescript", signature: "function useUpdateAdminControlSettings()"}),
  (fn3:Function {name: "useUpdateAdminUserRole", type: "function", language: "typescript", signature: "function useUpdateAdminUserRole()"}),
  (v1:Variable {name: "adminControlApi", type: "variable"}),
  (v2:Variable {name: "queryClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2);
```
*/

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminControlApi } from '@/lib/adminControlApi';
import type { AdminOperationTraceQuery, AdminUsersQuery } from '@/types/adminControl';

export function useAdminControlSnapshot() {
  return useQuery({
    queryKey: ['admin-control-snapshot'],
    queryFn: () => adminControlApi.snapshot(),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
}

export function useAdminControlUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: ['admin-control-users', query],
    queryFn: () => adminControlApi.users(query),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
}

export function useAdminOperationTraces(query: AdminOperationTraceQuery) {
  return useQuery({
    queryKey: ['admin-control-operation-traces', query],
    queryFn: () => adminControlApi.operationTraces(query),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
}

export function useUpdateAdminControlSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminControlApi.updateSettings,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-control-snapshot'] });
    },
  });
}

export function useUpdateAdminRiskPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminControlApi.updateRiskPolicy,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-control-snapshot'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-control-users'] });
    },
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminControlApi.updateUserRole(userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-control-snapshot'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-control-users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-control-operation-traces'] });
    },
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      blocked,
      reason,
    }: {
      userId: string;
      blocked: boolean;
      reason?: string;
    }) => adminControlApi.updateUserStatus(userId, { blocked, reason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-control-snapshot'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-control-users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-control-operation-traces'] });
    },
  });
}

export function useRunAdminAiRiskAnalysis() {
  return useMutation({
    mutationFn: adminControlApi.runAiRiskAnalysis,
  });
}
