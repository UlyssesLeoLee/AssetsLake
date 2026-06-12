/*
```cypher
CREATE
  (f:File {name: "ProjectManagementPluginPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ProjectManagementPluginPrimitives", type: "module"}),
  (fn1:Function {name: "usePlanIssues", type: "function", language: "typescript", signature: "function usePlanIssues(): { plan?: ProjectManagementPlan; issues: IssueSummary[]; loading: boolean }"}),
  (fn2:Function {name: "PageShell", type: "function", language: "typescript", signature: "function PageShell(props: { title: string; subtitle: string; children: ReactNode })"}),
  (fn3:Function {name: "Metric", type: "function", language: "typescript", signature: "function Metric(props: { label: string; value: string | number; detail: string; tone?: string })"}),
  (fn4:Function {name: "Panel", type: "function", language: "typescript", signature: "function Panel(props: { title: string; icon: ReactNode; children: ReactNode })"}),
  (fn5:Function {name: "IssueRows", type: "function", language: "typescript", signature: "function IssueRows(props: { issues: IssueSummary[]; empty: string })"}),
  (fn6:Function {name: "formatDate", type: "function", language: "typescript", signature: "function formatDate(value?: string): string"}),
  (v1:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (v2:Variable {name: "WORKFLOW_STEPS", type: "variable"}),
  (v3:Variable {name: "ENTERPRISE_CONTROLS", type: "variable"}),
  (v4:Variable {name: "plan", type: "variable"}),
  (v5:Variable {name: "issues", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn5)-[:CALLS]->(fn6);
```
*/

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import { useProjectManagementPlan } from '@/hooks/useProjectManagement';
import { cn } from '@/lib/utils';
import type { ProjectManagementPlan } from '@/types/projectManagement';
import type { IssueSummary } from '@/types/production';

export const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export const WORKFLOW_STEPS = [
  'backlog',
  'brief_ready',
  'assigned',
  'in_progress',
  'submitted',
  'internal_review',
  'client_review',
  'revision_required',
  'approved',
  'delivered',
] as const;

export const ENTERPRISE_CONTROLS = [
  ['Roles', 'Project roles, issue permissions, vendor access, and client visibility policies.'],
  [
    'Notifications',
    'Assignment, mention, due-date, review, delivery, and automation result preferences.',
  ],
  [
    'Import Export',
    'CSV/Jira import, JSON export, template project, and migration validation jobs.',
  ],
  [
    'Webhooks',
    'Outbound delivery, approval, issue transition, automation, and audit event webhooks.',
  ],
  ['CI Gates', 'Unit, integration, smoke, type-check, migration, and selected browser-path gates.'],
] as const;

export function usePlanIssues(): {
  plan?: ProjectManagementPlan;
  issues: IssueSummary[];
  loading: boolean;
} {
  const { data: plan, isLoading } = useProjectManagementPlan(DEFAULT_PROJECT_ID);
  const issues = [...(plan?.active_sprint ?? []), ...(plan?.backlog ?? [])];
  return { plan, issues, loading: isLoading };
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-border bg-[linear-gradient(180deg,rgba(243,234,216,0.05),rgba(17,24,33,0.18))] px-6 py-4">
        <h1 className="truncate text-xl font-bold text-white">{title}</h1>
        <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </div>
  );
}

export function Metric({
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
    <section className="rounded-lg border border-surface-border bg-surface-secondary/90 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </section>
  );
}

export function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary/90 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3 text-sm font-semibold text-slate-100">
        <span className="text-brand-300">{icon}</span>
        {title}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function IssueRows({ issues, empty }: { issues: IssueSummary[]; empty: string }) {
  if (issues.length === 0) {
    return <div className="p-4 text-sm text-slate-500">{empty}</div>;
  }

  return (
    <div className="divide-y divide-surface-border">
      {issues.map((issue) => (
        <Link
          key={issue.id}
          href={`/issues/${issue.id}`}
          className="block py-3 transition hover:bg-slate-800/40"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-brand-300">{issue.issue_key}</div>
              <div className="mt-1 truncate text-sm font-medium text-slate-100">{issue.title}</div>
            </div>
            <div className="shrink-0 text-xs text-slate-500">{formatDate(issue.due_date)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function formatDate(value?: string): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(value));
}
