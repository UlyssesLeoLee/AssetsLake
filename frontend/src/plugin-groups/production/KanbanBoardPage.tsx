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
  (v1:Variable {name: "filters", type: "variable"}),
  (v2:Variable {name: "draggingId", type: "variable"}),
  (v3:Variable {name: "issues", type: "variable"}),
  (v4:Variable {name: "boardModel", type: "variable"}),
  (v5:Variable {name: "dropTargetStatus", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5);
```
*/

'use client';

import type { DragEvent } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

import { useIssues, useTransitionIssue } from '@/hooks/useProduction';
import { cn } from '@/lib/utils';
import type { IssueFilters, IssueStatus } from '@/types/production';
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

export function KanbanBoardPage() {
  const [filters, setFilters] = useState<IssueFilters>({ page_size: 250 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<IssueStatus | null>(null);
  const { data, isLoading, isError, error } = useIssues(filters);
  const transitionIssue = useTransitionIssue();

  const issues = data?.data ?? [];
  const boardModel = useMemo(() => buildBoardPlanningModel(issues), [issues]);

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

  const handleDrop = (status: IssueStatus, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const issueId = event.dataTransfer.getData('text/issue-id') || draggingId;
    const issue = data?.data.find((item) => item.id === issueId);
    if (issue && issue.status !== status && !transitionIssue.isPending) {
      transitionIssue.mutate({ id: issue.id, status });
    }
    handleDragEnd();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Kanban Board"
        subtitle={data ? `${data.total.toLocaleString()} production issues / ${boardModel.totalStoryPoints} pts` : 'Production issues'}
        actions={
          <Link href="/briefs" className="btn-primary">
            <FileText className="h-4 w-4" />
            New Brief
          </Link>
        }
      />

      <FilterBar filters={filters} onChange={handleFilterChange} />

      <div className="grid shrink-0 gap-3 px-5 py-4 xl:grid-cols-3">
        <BoardHealthPanel model={boardModel} />
        <BoardSwimlanePanel model={boardModel} />
        <BoardRiskQueuePanel model={boardModel} />
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
                  dropActive && 'border-sakura-300/50 bg-sakura-300/[0.055] shadow-[0_0_0_1px_rgba(247,183,199,0.18),0_18px_40px_rgba(0,0,0,0.24)]',
                  draggingId && !dropActive && 'border-white/[0.08]'
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
                        column.wipState === 'at_limit' && 'bg-amber-500/15 text-amber-200'
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

                <div className={cn('flex-1 space-y-3 overflow-y-auto p-3 transition-colors', dropActive && 'bg-sakura-300/[0.025]')}>
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

export default KanbanBoardPage;
