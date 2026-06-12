/*
```cypher
CREATE
  (f:File {name: "useProduction.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/hooks/useProduction", type: "module"}),
  (fn1:Function {name: "useIssues", type: "function", language: "typescript", signature: "function useIssues(filters?: IssueFilters)"}),
  (fn20:Function {name: "useIssueBoardSync", type: "function", language: "typescript", signature: "function useIssueBoardSync(since?: string | null)"}),
  (fn2:Function {name: "useIssue", type: "function", language: "typescript", signature: "function useIssue(id?: string)"}),
  (fn3:Function {name: "useIssueAssets", type: "function", language: "typescript", signature: "function useIssueAssets(id?: string)"}),
  (fn4:Function {name: "useIssueHistory", type: "function", language: "typescript", signature: "function useIssueHistory(id?: string)"}),
  (fn5:Function {name: "useIssueComments", type: "function", language: "typescript", signature: "function useIssueComments(id?: string)"}),
  (fn6:Function {name: "useIssueWorkLogs", type: "function", language: "typescript", signature: "function useIssueWorkLogs(id?: string)"}),
  (fn7:Function {name: "useMilestones", type: "function", language: "typescript", signature: "function useMilestones(projectId?: string)"}),
  (fn8:Function {name: "useCreateIssue", type: "function", language: "typescript", signature: "function useCreateIssue()"}),
  (fn9:Function {name: "useUpdateIssue", type: "function", language: "typescript", signature: "function useUpdateIssue()"}),
  (fn10:Function {name: "useDeleteIssue", type: "function", language: "typescript", signature: "function useDeleteIssue()"}),
  (fn11:Function {name: "useAddIssueComment", type: "function", language: "typescript", signature: "function useAddIssueComment()"}),
  (fn12:Function {name: "useCreateIssueWorkLog", type: "function", language: "typescript", signature: "function useCreateIssueWorkLog()"}),
  (fn13:Function {name: "useTransitionIssue", type: "function", language: "typescript", signature: "function useTransitionIssue()"}),
  (fn14:Function {name: "useApproveIssue", type: "function", language: "typescript", signature: "function useApproveIssue()"}),
  (fn15:Function {name: "useRequestRevision", type: "function", language: "typescript", signature: "function useRequestRevision()"}),
  (fn16:Function {name: "useCreateDeliveryPackage", type: "function", language: "typescript", signature: "function useCreateDeliveryPackage()"}),
  (fn17:Function {name: "useManagementIntelligence", type: "function", language: "typescript", signature: "function useManagementIntelligence()"}),
  (fn18:Function {name: "invalidateIssueCollections", type: "function", language: "typescript", signature: "function invalidateIssueCollections(queryClient: QueryClient, issueId?: string)"}),
  (fn19:Function {name: "useAttachIssueAsset", type: "function", language: "typescript", signature: "function useAttachIssueAsset()"}),
  (v1:Variable {name: "productionApi", type: "variable"}),
  (v2:Variable {name: "queryClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn20),
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
  (fn1)-[:USES]->(v1),
  (fn20)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2),
  (fn6)-[:CALLS]->(fn12),
  (fn7)-[:USES]->(v1),
  (fn7)-[:USES]->(v2),
  (fn7)-[:CALLS]->(fn12),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v2),
  (fn8)-[:CALLS]->(fn12),
  (fn9)-[:USES]->(v1),
  (fn9)-[:USES]->(v2),
  (fn9)-[:CALLS]->(fn12),
  (fn10)-[:USES]->(v1),
  (fn10)-[:USES]->(v2),
  (fn11)-[:USES]->(v1),
  (fn19)-[:USES]->(v1),
  (fn19)-[:USES]->(v2),
  (fn19)-[:CALLS]->(fn18);
```
*/

'use client';

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { getStoredAuthSession } from '@/lib/authSession';
import { productionApi } from '@/lib/productionApi';
import type {
  ApproveIssueRequest,
  AttachIssueAssetRequest,
  CreateDeliveryPackageRequest,
  CreateIssueCommentRequest,
  CreateIssueRequest,
  CreateIssueWorkLogRequest,
  IssueFilters,
  IssueStatus,
  RequestRevisionRequest,
  UpdateIssueRequest,
} from '@/types/production';

export function useIssues(filters: IssueFilters = {}) {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => productionApi.issues.list(filters),
    staleTime: 20_000,
  });
}

export function useIssueBoardSync(since?: string | null) {
  return useQuery({
    queryKey: ['issue-board-sync', since ?? 'initial'],
    queryFn: () => productionApi.issues.boardSync(since),
    staleTime: 1_000,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
    retry: 1,
  });
}

export function useIssue(id?: string) {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => productionApi.issues.get(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useIssueAssets(id?: string) {
  return useQuery({
    queryKey: ['issue-assets', id],
    queryFn: () => productionApi.issues.assets(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useIssueHistory(id?: string) {
  return useQuery({
    queryKey: ['issue-history', id],
    queryFn: () => productionApi.issues.history(id as string),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useIssueComments(id?: string) {
  return useQuery({
    queryKey: ['issue-comments', id],
    queryFn: () => productionApi.issues.comments(id as string),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useIssueWorkLogs(id?: string) {
  return useQuery({
    queryKey: ['issue-work-logs', id],
    queryFn: () => productionApi.issues.workLogs(id as string),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useMilestones(projectId?: string) {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => productionApi.milestones.list(projectId),
    staleTime: 60_000,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateIssueRequest) => productionApi.issues.create(req),
    onSuccess: (issue) => {
      queryClient.setQueryData(['issue', issue.id], issue);
      invalidateIssueCollections(queryClient, issue.id);
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateIssueRequest }) =>
      productionApi.issues.update(id, req),
    onSuccess: (issue) => {
      queryClient.setQueryData(['issue', issue.id], issue);
      invalidateIssueCollections(queryClient, issue.id);
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productionApi.issues.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useAddIssueComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: CreateIssueCommentRequest }) =>
      productionApi.issues.comment(id, req),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['issue-comments', comment.issue_id] });
      invalidateIssueCollections(queryClient, comment.issue_id);
    },
  });
}

export function useCreateIssueWorkLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: CreateIssueWorkLogRequest }) =>
      productionApi.issues.createWorkLog(id, req),
    onSuccess: (workLog) => {
      queryClient.invalidateQueries({ queryKey: ['issue-work-logs', workLog.issue_id] });
      invalidateIssueCollections(queryClient, workLog.issue_id);
    },
  });
}

export function useAttachIssueAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: AttachIssueAssetRequest }) =>
      productionApi.issues.attachAsset(id, req),
    onSuccess: (_result, variables) => {
      invalidateIssueCollections(queryClient, variables.id);
    },
  });
}

export function useTransitionIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      expectedVersion,
    }: {
      id: string;
      status: IssueStatus;
      expectedVersion?: number;
    }) => {
      const session = getStoredAuthSession();
      const actor = session?.user.display_name || session?.user.username || 'ui-kanban';
      return productionApi.issues.transition(id, {
        status,
        actor_id: session?.user.id,
        actor,
        reason: 'Kanban drag transition',
        expected_version: expectedVersion,
      });
    },
    onSuccess: (issue) => {
      queryClient.setQueryData(['issue', issue.id], issue);
      invalidateIssueCollections(queryClient, issue.id);
    },
  });
}

export function useApproveIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: ApproveIssueRequest }) =>
      productionApi.issues.approve(id, req),
    onSuccess: (issue) => {
      queryClient.setQueryData(['issue', issue.id], issue);
      invalidateIssueCollections(queryClient, issue.id);
    },
  });
}

export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: RequestRevisionRequest }) =>
      productionApi.issues.requestRevision(id, req),
    onSuccess: (issue) => {
      queryClient.setQueryData(['issue', issue.id], issue);
      invalidateIssueCollections(queryClient, issue.id);
    },
  });
}

export function useCreateDeliveryPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateDeliveryPackageRequest) => productionApi.deliveryPackages.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useManagementIntelligence() {
  return useQuery({
    queryKey: ['management-intelligence'],
    queryFn: () => productionApi.management.intelligence(),
    staleTime: 300_000,
  });
}

function invalidateIssueCollections(queryClient: QueryClient, issueId?: string) {
  queryClient.invalidateQueries({ queryKey: ['issues'] });
  if (issueId) {
    queryClient.invalidateQueries({ queryKey: ['issue-history', issueId] });
    queryClient.invalidateQueries({ queryKey: ['issue-assets', issueId] });
    queryClient.invalidateQueries({ queryKey: ['issue-comments', issueId] });
    queryClient.invalidateQueries({ queryKey: ['issue-work-logs', issueId] });
  }
}
