/*
```cypher
CREATE
  (f:File {name: "KanbanBoardPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/KanbanBoardPage", type: "module"}),
  (fn1:Function {name: "KanbanBoardPage", type: "function", language: "typescript", signature: "function KanbanBoardPage()"}),
  (fn2:Function {name: "handleFilterChange", type: "function", language: "typescript", signature: "const handleFilterChange = (next: Partial<IssueFilters>) => void"}),
  (fn3:Function {name: "handleDrop", type: "function", language: "typescript", signature: "const handleDrop = (status: IssueStatus, event: DragEvent<HTMLDivElement>) => void"}),
  (fn4:Function {name: "handleDragOver", type: "function", language: "typescript", signature: "const handleDragOver = (event: DragEvent<HTMLDivElement>) => void"}),
  (fn5:Function {name: "handleDragEnd", type: "function", language: "typescript", signature: "const handleDragEnd = () => void"}),
  (fn6:Function {name: "mergeRecentActivity", type: "function", language: "typescript", signature: "function mergeRecentActivity(next: IssueBoardSyncActivity[], previous: IssueBoardSyncActivity[]): IssueBoardSyncActivity[]"}),
  (fn7:Function {name: "formatBoardActivity", type: "function", language: "typescript", signature: "function formatBoardActivity(activity: IssueBoardSyncActivity): string"}),
  (fn8:Function {name: "formatActivityTime", type: "function", language: "typescript", signature: "function formatActivityTime(value: string): string"}),
  (fn9:Function {name: "isConflictError", type: "function", language: "typescript", signature: "function isConflictError(error: unknown): boolean"}),
  (fn10:Function {name: "BoardAiAssistPanel", type: "function", language: "typescript", signature: "function BoardAiAssistPanel(props: BoardAiAssistPanelProps)"}),
  (fn11:Function {name: "buildBoardAiPlanRequest", type: "function", language: "typescript", signature: "function buildBoardAiPlanRequest(model: BoardPlanningModel, syncState: string, recentActivity: IssueBoardSyncActivity[]): AiAutopilotPlanRequest"}),
  (fn12:Function {name: "boardRiskTone", type: "function", language: "typescript", signature: "function boardRiskTone(risk: string): string"}),
  (fn13:Function {name: "handleGenerateBoardAiPlan", type: "function", language: "typescript", signature: "const handleGenerateBoardAiPlan = async () => void"}),
  (v1:Variable {name: "filters", type: "variable"}),
  (v2:Variable {name: "draggingId", type: "variable"}),
  (v3:Variable {name: "issues", type: "variable"}),
  (v4:Variable {name: "boardModel", type: "variable"}),
  (v5:Variable {name: "dropTargetStatus", type: "variable"}),
  (v6:Variable {name: "boardAiPlan", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:CONTAINS]->(fn5),
  (fn1)-[:CONTAINS]->(fn13),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:CALLS]->(fn9),
  (fn1)-[:CALLS]->(fn10),
  (fn1)-[:CALLS]->(fn11),
  (fn1)-[:CALLS]->(fn13),
  (fn13)-[:CALLS]->(fn11),
  (fn13)-[:USES]->(v4),
  (fn10)-[:CALLS]->(fn12);
```
*/

'use client';

import type { DragEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  FileText,
  ListChecks,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useIssueBoardSync, useIssues, useTransitionIssue } from '@/hooks/useProduction';
import { productionApi } from '@/lib/productionApi';
import { cn } from '@/lib/utils';
import type {
  AiAutopilotPlanRequest,
  AiAutopilotPlanResponse,
  IssueBoardSyncActivity,
  IssueFilters,
  IssueStatus,
} from '@/types/production';
import { ISSUE_STATUS_LABELS } from '@/types/production';
import {
  BoardHealthPanel,
  BoardRiskQueuePanel,
  BoardSwimlanePanel,
} from '@/plugin-groups/production/BoardPlanningPrimitives';
import {
  FilterBar,
  IssueCard,
  PageHeader,
  statusClass,
} from '@/plugin-groups/production/ProductionPluginPrimitives';
import { buildBoardPlanningModel } from '@/plugin-groups/production/boardPlanningModel';
import type { BoardPlanningModel } from '@/plugin-groups/production/boardPlanningModel';

type OperationNotice = {
  tone: 'info' | 'success' | 'warning';
  message: string;
};

type BoardAiAssistPanelProps = {
  model: BoardPlanningModel;
  plan: AiAutopilotPlanResponse | null;
  planning: boolean;
  syncState: string;
  onGenerate: () => void;
};

export function KanbanBoardPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<IssueFilters>({ page_size: 250 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<IssueStatus | null>(null);
  const [syncCursor, setSyncCursor] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<IssueBoardSyncActivity[]>([]);
  const [operationNotice, setOperationNotice] = useState<OperationNotice | null>(null);
  const [boardAiPlan, setBoardAiPlan] = useState<AiAutopilotPlanResponse | null>(null);
  const [boardAiPlanning, setBoardAiPlanning] = useState(false);
  const { data, isLoading, isError, error } = useIssues(filters);
  const boardSync = useIssueBoardSync(syncCursor);
  const transitionIssue = useTransitionIssue();

  const issues = data?.data ?? [];
  const boardModel = useMemo(() => buildBoardPlanningModel(issues), [issues]);
  const latestActivity = recentActivity[0];
  const boardSyncState = boardSync.isError ? 'offline' : boardSync.isFetching ? 'syncing' : 'live';

  useEffect(() => {
    const snapshot = boardSync.data;
    if (!snapshot) {
      return;
    }

    const snapshotActivity = snapshot.recent_activity ?? [];
    if (snapshotActivity.length > 0) {
      setRecentActivity((previous) => mergeRecentActivity(snapshotActivity, previous).slice(0, 5));
    }

    if (!syncCursor) {
      setSyncCursor(snapshot.cursor);
      return;
    }

    if (snapshot.cursor === syncCursor) {
      return;
    }

    setSyncCursor(snapshot.cursor);
    if (snapshot.changed_count > 0) {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      const message = snapshotActivity[0]
        ? formatBoardActivity(snapshotActivity[0])
        : 'Board updated in another session';
      setOperationNotice({ tone: 'info', message });
      toast(message);
    }
  }, [boardSync.data, queryClient, syncCursor]);

  const handleFilterChange = (next: Partial<IssueFilters>) => {
    setFilters((prev) => ({ ...prev, ...next, page: 1 }));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetStatus(null);
  };

  const handleGenerateBoardAiPlan = async () => {
    setBoardAiPlanning(true);
    try {
      const response = await productionApi.management.autopilotPlan(
        buildBoardAiPlanRequest(boardModel, boardSyncState, recentActivity),
      );
      setBoardAiPlan(response);
      toast.success(
        response.ai_status?.used ? 'Board AI plan generated' : 'Board local plan generated',
      );
    } catch (planError) {
      const message = planError instanceof Error ? planError.message : 'Board AI plan failed';
      toast.error(message);
    } finally {
      setBoardAiPlanning(false);
    }
  };

  const handleDrop = (status: IssueStatus, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const issueId = event.dataTransfer.getData('text/issue-id') || draggingId;
    const issue = data?.data.find((item) => item.id === issueId);
    if (issue && issue.status !== status && !transitionIssue.isPending) {
      const targetLabel = ISSUE_STATUS_LABELS[status];
      setOperationNotice({
        tone: 'info',
        message: `Moving ${issue.issue_key} to ${targetLabel}`,
      });
      transitionIssue.mutate(
        { id: issue.id, status, expectedVersion: issue.version },
        {
          onSuccess: (updatedIssue) => {
            setSyncCursor(updatedIssue.updated_at);
            setOperationNotice({
              tone: 'success',
              message: `${updatedIssue.issue_key} moved to ${ISSUE_STATUS_LABELS[updatedIssue.status]}`,
            });
            toast.success(`${updatedIssue.issue_key} moved`);
          },
          onError: (mutationError) => {
            const message = isConflictError(mutationError)
              ? 'This issue changed in another session. Board refreshed; retry with the current card.'
              : mutationError instanceof Error
                ? mutationError.message
                : 'Move failed';
            setOperationNotice({ tone: 'warning', message });
            queryClient.invalidateQueries({ queryKey: ['issues'] });
            toast.error(message);
          },
        },
      );
    }
    handleDragEnd();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Kanban Board"
        subtitle={
          data
            ? `${data.total.toLocaleString()} production issues / ${boardModel.totalStoryPoints} pts`
            : 'Production issues'
        }
        actions={
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium',
                boardSync.isError
                  ? 'border-rose-400/30 bg-rose-500/10 text-rose-200'
                  : 'border-matcha-300/30 bg-matcha-400/10 text-matcha-200',
              )}
            >
              {boardSync.isError ? (
                <WifiOff className="h-4 w-4" />
              ) : boardSync.isFetching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
              {boardSync.isError ? 'Sync offline' : boardSync.isFetching ? 'Syncing' : 'Live'}
            </span>
            <Link href="/briefs" className="btn-primary">
              <FileText className="h-4 w-4" />
              New Brief
            </Link>
          </div>
        }
      />

      <FilterBar filters={filters} onChange={handleFilterChange} />

      <div className="shrink-0 border-b border-surface-border bg-[#0b121a]/85 px-5 py-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div
            className={cn(
              'flex min-w-0 items-center gap-2 text-sm',
              operationNotice?.tone === 'warning'
                ? 'text-amber-200'
                : operationNotice?.tone === 'success'
                  ? 'text-matcha-200'
                  : 'text-slate-300',
            )}
          >
            {operationNotice?.tone === 'warning' ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : operationNotice?.tone === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Activity className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">
              {operationNotice?.message ??
                (latestActivity ? formatBoardActivity(latestActivity) : 'Board state current')}
            </span>
          </div>
          <div className="flex min-w-0 gap-2 overflow-hidden text-xs text-slate-500">
            {recentActivity.slice(0, 3).map((activity) => (
              <span
                key={activity.id}
                className="min-w-0 shrink rounded-md border border-white/[0.06] bg-surface/70 px-2 py-1"
              >
                <span className="text-slate-300">{activity.issue_key}</span>
                <span className="mx-1 text-slate-600">/</span>
                <span>{ISSUE_STATUS_LABELS[activity.to_status]}</span>
                <span className="mx-1 text-slate-600">/</span>
                <span>{formatActivityTime(activity.created_at)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid shrink-0 gap-3 px-5 py-4 xl:grid-cols-3">
        <BoardHealthPanel model={boardModel} />
        <BoardSwimlanePanel model={boardModel} />
        <BoardRiskQueuePanel model={boardModel} />
      </div>

      <div className="shrink-0 px-5 pb-4">
        <BoardAiAssistPanel
          model={boardModel}
          plan={boardAiPlan}
          planning={boardAiPlanning}
          syncState={boardSyncState}
          onGenerate={handleGenerateBoardAiPlan}
        />
      </div>

      {isError && (
        <div className="mx-5 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {String(error)}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-5 pb-5">
        <div className="flex h-full min-w-max gap-3">
          {boardModel.columns.map((column) => {
            const dropActive = dropTargetStatus === column.status;
            return (
              <div
                key={column.status}
                role="region"
                aria-label={`${column.label} column`}
                data-testid={`kanban-column-${column.status}`}
                onDragOver={handleDragOver}
                onDragEnter={() => setDropTargetStatus(column.status)}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setDropTargetStatus(null);
                  }
                }}
                onDrop={(event) => handleDrop(column.status, event)}
                className={cn(
                  'flex h-full w-[18rem] shrink-0 flex-col rounded-lg border border-surface-border bg-surface-secondary/80 shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-150',
                  dropActive &&
                    'border-sakura-300/50 bg-sakura-300/[0.055] shadow-[0_0_0_1px_rgba(247,183,199,0.18),0_18px_40px_rgba(0,0,0,0.24)]',
                  draggingId && !dropActive && 'border-white/[0.08]',
                )}
              >
                <div className="border-b border-surface-border px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', statusClass(column.status))} />
                      <h2 className="truncate text-sm font-semibold text-slate-100">
                        {column.label}
                      </h2>
                    </div>
                    <span
                      className={cn(
                        'rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-slate-400',
                        column.wipState === 'over_limit' && 'bg-rose-500/15 text-rose-200',
                        column.wipState === 'at_limit' && 'bg-amber-500/15 text-amber-200',
                      )}
                    >
                      {column.limit ? `${column.count}/${column.limit}` : column.count}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{column.storyPoints} pts</span>
                    <span>{dropActive ? 'Release to move here' : 'Drag tasks into lane'}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    'flex-1 space-y-3 overflow-y-auto p-3 transition-colors',
                    dropActive && 'bg-sakura-300/[0.025]',
                  )}
                >
                  {isLoading && (
                    <div className="rounded-lg border border-surface-border bg-surface-elevated p-4 text-sm text-slate-400">
                      Loading
                    </div>
                  )}
                  {!isLoading &&
                    column.issues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onDragStart={(id) => setDraggingId(id)}
                        onDragEnd={handleDragEnd}
                        dragging={draggingId === issue.id}
                      />
                    ))}
                  {!isLoading && column.issues.length === 0 && (
                    <div className="rounded-lg border border-dashed border-surface-border bg-[#0d141c]/60 p-4 text-center text-xs text-slate-500">
                      Drop production work here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BoardAiAssistPanel({
  model,
  plan,
  planning,
  syncState,
  onGenerate,
}: BoardAiAssistPanelProps) {
  const firstCommand = plan?.commands[0];
  const approvalGates = plan?.decision_review?.approval_gates ?? [
    'No approval gates required for the current low-risk replica queue.',
  ];
  const langgraphNodes = plan?.langgraph_nodes ?? [];

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <BrainCircuit className="h-4 w-4 text-brand-300" />
            Board AI Assist
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{model.totalIssues} issues</span>
            <span>{model.wipBreachCount} WIP breaches</span>
            <span>{model.riskQueue.length} risk items</span>
            <span>{syncState}</span>
          </div>
        </div>
        <button type="button" className="btn-secondary" onClick={onGenerate} disabled={planning}>
          {planning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ListChecks className="h-4 w-4" />
          )}
          {planning ? 'Planning' : 'Plan Board'}
        </button>
      </div>

      {plan ? (
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-surface-border bg-surface px-2 py-1 text-xs text-slate-300">
                {plan.ai_status?.used ? 'AI planned' : 'local planned'}
              </span>
              <span className="truncate text-xs text-slate-500">
                {plan.ai_status?.provider ?? 'fallback'} / {plan.ai_status?.model ?? 'local'}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-200">{plan.summary}</div>
            <div className="mt-2 grid gap-1 text-xs text-slate-500">
              {approvalGates.slice(0, 2).map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {firstCommand ? (
              <div className="rounded-md border border-surface-border bg-surface px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-200">
                    {firstCommand.title}
                  </span>
                  <span className={cn('text-[11px]', boardRiskTone(firstCommand.risk))}>
                    {firstCommand.risk}
                  </span>
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-brand-300">
                  {firstCommand.target_label}
                </div>
                <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                  {firstCommand.intent}
                </div>
              </div>
            ) : null}
            {langgraphNodes.slice(0, 3).map((node) => (
              <div
                key={`${node.name}-${node.state}`}
                className="rounded-md border border-surface-border bg-surface px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-200">{node.name}</span>
                  <span className="text-[11px] text-brand-300">{node.state}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                  {node.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function buildBoardAiPlanRequest(
  model: BoardPlanningModel,
  syncState: string,
  recentActivity: IssueBoardSyncActivity[],
): AiAutopilotPlanRequest {
  const firstRisk = model.riskQueue[0];
  const hasRiskQueue = model.riskQueue.length > 0;
  const hasWipPressure = model.wipBreachCount > 0;

  return {
    goal: 'Stabilize the Kanban board with synchronized, low-risk AI recommendations.',
    context: {
      surface: 'kanban-board',
      issues: model.totalIssues,
      total_story_points: model.totalStoryPoints,
      wip_breach_count: model.wipBreachCount,
      review_pressure_count: model.reviewPressureCount,
      sync_state: syncState,
      columns: model.columns.map((column) => ({
        status: column.status,
        count: column.count,
        limit: column.limit ?? null,
        wip_state: column.wipState,
        story_points: column.storyPoints,
      })),
      swimlanes: model.swimlanes.map((lane) => ({
        priority: lane.priority,
        count: lane.count,
        risk_count: lane.riskCount,
        review_count: lane.reviewCount,
      })),
      risk_queue: model.riskQueue.slice(0, 5).map((item) => ({
        issue_key: item.issue.issue_key,
        status: item.issue.status,
        priority: item.issue.priority,
        risk: item.risk,
        due_date: item.issue.due_date ?? null,
      })),
      recent_activity: recentActivity.slice(0, 5).map((activity) => ({
        issue_key: activity.issue_key,
        to_status: activity.to_status,
        actor: activity.actor,
        created_at: activity.created_at,
      })),
    },
    actions: [
      {
        id: 'sync-board-context',
        title: 'Sync Board Context',
        app: 'Kanban Board',
        target_label: `${model.totalIssues} issues / ${syncState}`,
        writes: ['replica board context snapshot'],
        disabled: model.totalIssues === 0,
      },
      {
        id: 'prioritize-board-risk',
        title: 'Prioritize Board Risk',
        app: 'Kanban Board',
        target_label: firstRisk
          ? `${firstRisk.issue.issue_key} / ${firstRisk.risk}`
          : 'No risk queue',
        writes: ['replica risk queue ordering proposal'],
        disabled: !hasRiskQueue,
      },
      {
        id: 'rebalance-kanban-wip',
        title: 'Rebalance WIP',
        app: 'Kanban Board',
        target_label: `${model.wipBreachCount} WIP breaches`,
        writes: ['replica WIP rebalance proposal'],
        disabled: !hasWipPressure,
      },
    ],
    signals: [
      {
        id: 'board-sync-state',
        source: 'Board Sync',
        strength: syncState === 'offline' ? 'blocked' : 'ready',
      },
      {
        id: 'board-wip-pressure',
        source: 'Kanban WIP',
        strength: hasWipPressure ? 'watch' : 'ready',
      },
      {
        id: 'board-risk-queue',
        source: 'Risk Queue',
        strength: model.riskQueue.some((item) => item.risk === 'overdue')
          ? 'blocked'
          : hasRiskQueue
            ? 'watch'
            : 'ready',
      },
      {
        id: 'board-review-pressure',
        source: 'Review Flow',
        strength: model.reviewPressureCount > 5 ? 'watch' : 'ready',
      },
    ],
  };
}

function boardRiskTone(risk: string): string {
  if (risk === 'high') return 'text-red-300';
  if (risk === 'medium') return 'text-amber-300';
  return 'text-emerald-300';
}

function mergeRecentActivity(
  next: IssueBoardSyncActivity[],
  previous: IssueBoardSyncActivity[],
): IssueBoardSyncActivity[] {
  const seen = new Set<string>();
  return [...next, ...previous].filter((activity) => {
    if (seen.has(activity.id)) {
      return false;
    }
    seen.add(activity.id);
    return true;
  });
}

function formatBoardActivity(activity: IssueBoardSyncActivity): string {
  return `${activity.actor} moved ${activity.issue_key} to ${ISSUE_STATUS_LABELS[activity.to_status]}`;
}

function formatActivityTime(value: string): string {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
}

function isConflictError(error: unknown): boolean {
  return error instanceof Error && /conflict|version|locked/i.test(error.message);
}

export default KanbanBoardPage;
