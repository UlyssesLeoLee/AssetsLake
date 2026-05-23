/*
```cypher
CREATE
  (f:File {name: "PlanningPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/PlanningPage", type: "module"}),
  (c1:Class {name: "PlanningModel", type: "class", language: "typescript", signature: "interface PlanningModel"}),
  (fn1:Function {name: "PlanningPage", type: "function", language: "typescript", signature: "function PlanningPage()"}),
  (fn2:Function {name: "buildPlanningModel", type: "function", language: "typescript", signature: "function buildPlanningModel(issues: IssueSummary[]): PlanningModel"}),
  (fn3:Function {name: "isBacklogCandidate", type: "function", language: "typescript", signature: "function isBacklogCandidate(issue: IssueSummary): boolean"}),
  (fn4:Function {name: "isSprintCandidate", type: "function", language: "typescript", signature: "function isSprintCandidate(issue: IssueSummary): boolean"}),
  (fn5:Function {name: "isOverdue", type: "function", language: "typescript", signature: "function isOverdue(issue: IssueSummary): boolean"}),
  (fn6:Function {name: "daysUntil", type: "function", language: "typescript", signature: "function daysUntil(value?: string): number | null"}),
  (fn7:Function {name: "Metric", type: "function", language: "typescript", signature: "function Metric(props: { label: string; value: string | number; detail: string; tone?: string })"}),
  (fn8:Function {name: "WorkList", type: "function", language: "typescript", signature: "function WorkList(props: { title: string; icon: React.ReactNode; issues: IssueSummary[]; empty: string })"}),
  (fn9:Function {name: "StatusBadge", type: "function", language: "typescript", signature: "function StatusBadge(props: { issue: IssueSummary })"}),
  (fn10:Function {name: "priorityClass", type: "function", language: "typescript", signature: "function priorityClass(priority: IssueSummary['priority']): string"}),
  (fn11:Function {name: "formatDate", type: "function", language: "typescript", signature: "function formatDate(value?: string): string"}),
  (v1:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (v2:Variable {name: "EMPTY_ISSUES", type: "variable"}),
  (v3:Variable {name: "BACKLOG_STATUSES", type: "variable"}),
  (v4:Variable {name: "SPRINT_STATUSES", type: "variable"}),
  (v5:Variable {name: "REVIEW_STATUSES", type: "variable"}),
  (v6:Variable {name: "issues", type: "variable"}),
  (v7:Variable {name: "model", type: "variable"}),
  (v8:Variable {name: "milestones", type: "variable"}),
  (v9:Variable {name: "issue", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
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
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:CALLS]->(fn11),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:USES]->(v6),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v9),
  (fn4)-[:USES]->(v4),
  (fn4)-[:USES]->(v9),
  (fn5)-[:CALLS]->(fn6),
  (fn5)-[:USES]->(v9),
  (fn8)-[:CALLS]->(fn9),
  (fn8)-[:CALLS]->(fn11),
  (fn8)-[:USES]->(v9),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:USES]->(v9);
```
*/

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, FileText, GitBranch, Milestone, Plus } from 'lucide-react';

import { useIssues, useMilestones } from '@/hooks/useProduction';
import { cn } from '@/lib/utils';
import type { IssueStatus, IssueSummary } from '@/types/production';
import { ISSUE_PRIORITY_LABELS, ISSUE_STATUS_LABELS } from '@/types/production';

const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';
const EMPTY_ISSUES: IssueSummary[] = [];
const BACKLOG_STATUSES: IssueStatus[] = ['backlog', 'brief_ready'];
const SPRINT_STATUSES: IssueStatus[] = ['assigned', 'in_progress', 'submitted'];
const REVIEW_STATUSES: IssueStatus[] = ['internal_review', 'client_review', 'revision_required'];

interface PlanningModel {
  backlog: IssueSummary[];
  sprintCandidates: IssueSummary[];
  reviewQueue: IssueSummary[];
  overdue: IssueSummary[];
  totalEstimate: number;
}

export function PlanningPage() {
  const { data: issueData, isLoading: issuesLoading } = useIssues({ page_size: 250 });
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestones(DEFAULT_PROJECT_ID);
  const issues = issueData?.data ?? EMPTY_ISSUES;
  const model = useMemo(() => buildPlanningModel(issues), [issues]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b border-surface-border px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-white">Planning</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {issueData ? `${issueData.total.toLocaleString()} issues` : 'Production planning'}
          </p>
        </div>
        <Link href="/briefs" className="btn-primary">
          <Plus className="h-4 w-4" />
          Brief
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Backlog" value={model.backlog.length} detail="ready for grooming" />
          <Metric label="Sprint Pull" value={model.sprintCandidates.length} detail="active work candidates" tone="text-cyan-300" />
          <Metric label="Review Load" value={model.reviewQueue.length} detail="review or revision queue" tone="text-amber-300" />
          <Metric label="Schedule Risk" value={model.overdue.length} detail={`${model.totalEstimate} estimated points`} tone="text-red-300" />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <WorkList
              title="Backlog Grooming"
              icon={<FileText className="h-4 w-4" />}
              issues={model.backlog}
              empty={issuesLoading ? 'Loading backlog' : 'No backlog candidates'}
            />
            <WorkList
              title="Sprint Candidates"
              icon={<GitBranch className="h-4 w-4" />}
              issues={model.sprintCandidates}
              empty={issuesLoading ? 'Loading sprint work' : 'No sprint candidates'}
            />
          </div>

          <div className="space-y-5">
            <section className="rounded-lg border border-surface-border bg-surface-secondary">
              <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3 text-sm font-semibold text-slate-100">
                <Milestone className="h-4 w-4 text-brand-300" />
                Milestones
              </div>
              <div className="divide-y divide-surface-border">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 truncate text-sm font-medium text-slate-100">{milestone.name}</div>
                      <span className="rounded-md border border-slate-600 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                        {milestone.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(milestone.due_date)}
                    </div>
                  </div>
                ))}
                {milestones.length === 0 && (
                  <div className="p-6 text-sm text-slate-500">
                    {milestonesLoading ? 'Loading milestones' : 'No milestone anchors'}
                  </div>
                )}
              </div>
            </section>

            <WorkList
              title="Review Pressure"
              icon={<Calendar className="h-4 w-4" />}
              issues={model.reviewQueue}
              empty={issuesLoading ? 'Loading review work' : 'No review pressure'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPlanningModel(issues: IssueSummary[]): PlanningModel {
  const backlog = issues.filter(isBacklogCandidate);
  const sprintCandidates = issues
    .filter(isSprintCandidate)
    .toSorted((left, right) => (daysUntil(left.due_date) ?? 9999) - (daysUntil(right.due_date) ?? 9999));
  const reviewQueue = issues.filter((issue) => REVIEW_STATUSES.includes(issue.status));
  const overdue = issues.filter(isOverdue);
  const totalEstimate = issues.reduce((sum, issue) => sum + Number(issue.revision_count || 0), 0);

  return {
    backlog,
    sprintCandidates,
    reviewQueue,
    overdue,
    totalEstimate,
  };
}

function isBacklogCandidate(issue: IssueSummary): boolean {
  return BACKLOG_STATUSES.includes(issue.status);
}

function isSprintCandidate(issue: IssueSummary): boolean {
  return SPRINT_STATUSES.includes(issue.status);
}

function isOverdue(issue: IssueSummary): boolean {
  const remaining = daysUntil(issue.due_date);
  return remaining !== null && remaining < 0 && issue.status !== 'delivered' && issue.status !== 'archived';
}

function daysUntil(value?: string): number | null {
  if (!value) return null;
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return null;
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function Metric({
  label,
  value,
  detail,
  tone = 'text-slate-100',
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: string;
}) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </section>
  );
}

function WorkList({
  title,
  icon,
  issues,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  issues: IssueSummary[];
  empty: string;
}) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3 text-sm font-semibold text-slate-100">
        <span className="text-brand-300">{icon}</span>
        {title}
      </div>
      <div className="divide-y divide-surface-border">
        {issues.slice(0, 8).map((issue) => (
          <Link key={issue.id} href={`/issues/${issue.id}`} className="block p-4 transition hover:bg-slate-800/50">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-brand-300">{issue.issue_key}</span>
                  <StatusBadge issue={issue} />
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-100">{issue.title}</div>
              </div>
              <span className={cn('shrink-0 rounded-md border px-2 py-0.5 text-xs', priorityClass(issue.priority))}>
                {ISSUE_PRIORITY_LABELS[issue.priority]}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>{issue.assignee_name ?? 'Unassigned'}</span>
              <span>{formatDate(issue.due_date)}</span>
            </div>
          </Link>
        ))}
        {issues.length === 0 && <div className="p-6 text-sm text-slate-500">{empty}</div>}
      </div>
    </section>
  );
}

function StatusBadge({ issue }: { issue: IssueSummary }) {
  return (
    <span className="rounded-md border border-slate-600 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
      {ISSUE_STATUS_LABELS[issue.status]}
    </span>
  );
}

function priorityClass(priority: IssueSummary['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'border-red-500/30 bg-red-500/10 text-red-300';
    case 'high':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    case 'medium':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
    default:
      return 'border-slate-600 bg-slate-700/30 text-slate-300';
  }
}

function formatDate(value?: string): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(value));
}

export default PlanningPage;
