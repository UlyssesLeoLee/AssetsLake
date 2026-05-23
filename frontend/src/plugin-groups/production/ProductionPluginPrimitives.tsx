/*
```cypher
CREATE
  (f:File {name: "ProductionPluginPrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ProductionPluginPrimitives", type: "module"}),
  (fn1:Function {name: "ReviewLane", type: "function", language: "typescript", signature: "function ReviewLane(props: { title: string; issues: IssueSummary[]; loading: boolean })"}),
  (fn2:Function {name: "IssueCard", type: "function", language: "typescript", signature: "function IssueCard(props: { issue: IssueSummary; onDragStart: (id: string) => void; onDragEnd?: () => void; dragging?: boolean })"}),
  (fn3:Function {name: "IssueRow", type: "function", language: "typescript", signature: "function IssueRow(props: { issue: IssueSummary; actions?: ReactNode })"}),
  (fn4:Function {name: "FilterBar", type: "function", language: "typescript", signature: "function FilterBar(props: { filters: IssueFilters; onChange: (next: Partial<IssueFilters>) => void })"}),
  (fn5:Function {name: "PageHeader", type: "function", language: "typescript", signature: "function PageHeader(props: { title: string; subtitle?: string; actions?: ReactNode })"}),
  (fn6:Function {name: "SectionTitle", type: "function", language: "typescript", signature: "function SectionTitle(props: { icon: ReactNode; title: string })"}),
  (fn7:Function {name: "Metric", type: "function", language: "typescript", signature: "function Metric(props: { label: string; value: string | number; tone?: string })"}),
  (fn8:Function {name: "EmptyPanel", type: "function", language: "typescript", signature: "function EmptyPanel(props: { title: string; subtitle?: string })"}),
  (fn9:Function {name: "StatusPill", type: "function", language: "typescript", signature: "function StatusPill(props: { status: IssueStatus })"}),
  (fn10:Function {name: "PriorityPill", type: "function", language: "typescript", signature: "function PriorityPill(props: { priority: IssuePriority })"}),
  (fn11:Function {name: "QaPill", type: "function", language: "typescript", signature: "function QaPill(props: { status: AiQaStatus })"}),
  (fn12:Function {name: "formatDate", type: "function", language: "typescript", signature: "function formatDate(value?: string): string"}),
  (fn13:Function {name: "formatMinutes", type: "function", language: "typescript", signature: "function formatMinutes(minutes: number): string"}),
  (fn14:Function {name: "getParamId", type: "function", language: "typescript", signature: "function getParamId(value: string | string[] | undefined): string | undefined"}),
  (fn15:Function {name: "groupIssuesByStatus", type: "function", language: "typescript", signature: "function groupIssuesByStatus(issues: IssueSummary[]): Record<IssueStatus, IssueSummary[]>"}),
  (fn16:Function {name: "priorityClass", type: "function", language: "typescript", signature: "function priorityClass(priority: IssuePriority): string"}),
  (fn17:Function {name: "statusClass", type: "function", language: "typescript", signature: "function statusClass(status: IssueStatus): string"}),
  (fn18:Function {name: "qaClass", type: "function", language: "typescript", signature: "function qaClass(status: AiQaStatus): string"}),
  (fn19:Function {name: "priorityAccentClass", type: "function", language: "typescript", signature: "function priorityAccentClass(priority: IssuePriority): string"}),
  (v1:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (v2:Variable {name: "DEFAULT_VENDOR_ID", type: "variable"}),
  (v3:Variable {name: "DEFAULT_CLIENT_ID", type: "variable"}),
  (v4:Variable {name: "ISSUE_TYPES", type: "variable"}),
  (v5:Variable {name: "ASSET_TYPES", type: "variable"}),
  (v6:Variable {name: "AI_QA_RULES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
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
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (fn1)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn11),
  (fn2)-[:CALLS]->(fn12),
  (fn2)-[:CALLS]->(fn19),
  (fn3)-[:CALLS]->(fn9),
  (fn3)-[:CALLS]->(fn10),
  (fn3)-[:CALLS]->(fn12),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v5),
  (fn9)-[:CALLS]->(fn17),
  (fn10)-[:CALLS]->(fn16),
  (fn11)-[:CALLS]->(fn18);
```
*/

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Calendar, GripVertical, ImageIcon, Layers3, Search, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { AssetType } from '@/types/asset';
import type {
  AiQaStatus,
  IssueFilters,
  IssuePriority,
  IssueStatus,
  IssueSummary,
  IssueType,
} from '@/types/production';
import {
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  ISSUE_TYPE_LABELS,
} from '@/types/production';

export const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';
export const DEFAULT_VENDOR_ID = '00000000-0000-0000-0000-000000000021';
export const DEFAULT_CLIENT_ID = '00000000-0000-0000-0000-000000000011';

export const ISSUE_TYPES: IssueType[] = [
  'concept_art',
  'character_model',
  'environment_model',
  'texture',
  'rigging',
  'animation',
  'vfx',
  'ui_art',
  'shader',
  'technical_art',
  'delivery_check',
  'bug',
  'revision_request',
];

export const ASSET_TYPES: AssetType[] = [
  '3d_model',
  'texture',
  'concept_art',
  'animation',
  'vfx',
  'ui',
  'shader',
  'code',
  'archive',
  'other',
];

export const AI_QA_RULES = [
  'naming_convention',
  'texture_map_set',
  'rigging_required',
  'ui_dimensions',
  'sprite_animation_set',
  'prompt_source_record',
  'approved_only_delivery',
  'duplicate_similarity',
];

export function ReviewLane({ title, issues, loading }: { title: string; issues: IssueSummary[]; loading: boolean }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center justify-between border-b border-surface-border p-4">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-slate-400">{issues.length}</span>
      </div>
      <div className="divide-y divide-surface-border">
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
        {loading && <EmptyPanel title="Loading review issues" />}
        {!loading && issues.length === 0 && <EmptyPanel title="No review issues" />}
      </div>
    </section>
  );
}

export function IssueCard({
  issue,
  onDragStart,
  onDragEnd,
  dragging = false,
}: {
  issue: IssueSummary;
  onDragStart: (id: string) => void;
  onDragEnd?: () => void;
  dragging?: boolean;
}) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      draggable
      aria-label={`${issue.issue_key} ${issue.title}`}
      data-testid={`issue-card-${issue.id}`}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/issue-id', issue.id);
        onDragStart(issue.id);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        'group relative block rounded-lg border border-surface-border bg-[#111a24] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition duration-150 hover:-translate-y-0.5 hover:border-brand-400/45 hover:bg-[#152233] hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]',
        dragging && 'scale-[0.98] opacity-55 ring-2 ring-sakura-300/35'
      )}
    >
      <span className={cn('absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full', priorityAccentClass(issue.priority))} />
      <GripVertical className="absolute right-2 top-2 h-4 w-4 text-slate-600 transition-colors group-hover:text-sakura-300" />
      <div className="mb-3 flex items-start gap-3 pr-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-[#0b121a]">
          {issue.thumbnail_url ? (
            <img src={issue.thumbnail_url} alt={issue.title} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-xs text-brand-300/80">{issue.issue_key}</div>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-100">{issue.title}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <PriorityPill priority={issue.priority} />
        <QaPill status={issue.qa_status} />
        <span className="badge border-surface-border bg-surface/70 text-slate-300">{issue.revision_count} rev</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.04] pt-3 text-xs text-slate-500">
        <span className="flex min-w-0 items-center gap-1">
          <UserRound className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{issue.assignee_name || 'Unassigned'}</span>
        </span>
        <span className="flex items-center justify-end gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(issue.due_date)}
        </span>
        <span className="flex min-w-0 items-center gap-1 text-slate-500">
          <Layers3 className="h-3.5 w-3.5 shrink-0" />
          <span>{issue.asset_count} assets</span>
        </span>
        <span className="text-right text-slate-500">{issue.story_points ?? 0} pts</span>
      </div>
    </Link>
  );
}

export function IssueRow({ issue, actions }: { issue: IssueSummary; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/issues/${issue.id}`} className="font-mono text-xs text-brand-300">
            {issue.issue_key}
          </Link>
          <StatusPill status={issue.status} />
          <PriorityPill priority={issue.priority} />
        </div>
        <Link href={`/issues/${issue.id}`} className="mt-2 block truncate text-sm font-semibold text-slate-100">
          {issue.title}
        </Link>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{ISSUE_TYPE_LABELS[issue.issue_type]}</span>
          <span>{issue.assignee_name || 'Unassigned'}</span>
          <span>{formatDate(issue.due_date)}</span>
          <span>{issue.asset_count} assets</span>
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export function FilterBar({ filters, onChange }: { filters: IssueFilters; onChange: (next: Partial<IssueFilters>) => void }) {
  return (
    <div className="grid gap-3 border-b border-surface-border bg-[#0d141c]/80 px-5 py-3 backdrop-blur lg:grid-cols-[1.2fr_repeat(4,1fr)]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input className="input pl-9" value={filters.q || ''} onChange={(event) => onChange({ q: event.target.value })} placeholder="Search issues" />
      </label>
      <select className="input" value={filters.project_id || ''} onChange={(event) => onChange({ project_id: event.target.value })}>
        <option value="">All projects</option>
        <option value={DEFAULT_PROJECT_ID}>DEFAULT</option>
      </select>
      <select className="input" value={filters.vendor_id || ''} onChange={(event) => onChange({ vendor_id: event.target.value })}>
        <option value="">All vendors</option>
        <option value={DEFAULT_VENDOR_ID}>VENDOR</option>
      </select>
      <select className="input" value={filters.asset_type || ''} onChange={(event) => onChange({ asset_type: event.target.value as AssetType | '' })}>
        <option value="">All asset types</option>
        {ASSET_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select className="input" value={filters.priority || ''} onChange={(event) => onChange({ priority: event.target.value as IssuePriority | '' })}>
        <option value="">All priorities</option>
        {(['low', 'medium', 'high', 'urgent'] as IssuePriority[]).map((priority) => (
          <option key={priority} value={priority}>
            {ISSUE_PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-surface-border bg-[linear-gradient(180deg,rgba(243,234,216,0.05),rgba(17,24,33,0.18))] px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
      <span className="text-brand-300">{icon}</span>
      {title}
    </div>
  );
}

export function Metric({ label, value, tone = 'text-slate-100' }: { label: string; value: string | number; tone?: string }) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
    </section>
  );
}

export function EmptyPanel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 text-center">
      <div className="text-sm font-medium text-slate-300">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: IssueStatus }) {
  return <span className={cn('badge', statusClass(status))}>{ISSUE_STATUS_LABELS[status]}</span>;
}

export function PriorityPill({ priority }: { priority: IssuePriority }) {
  return <span className={cn('badge', priorityClass(priority))}>{ISSUE_PRIORITY_LABELS[priority]}</span>;
}

export function QaPill({ status }: { status: AiQaStatus }) {
  return <span className={cn('badge', qaClass(status))}>AI {status}</span>;
}

export function formatDate(value?: string): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(value));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function getParamId(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function groupIssuesByStatus(issues: IssueSummary[]): Record<IssueStatus, IssueSummary[]> {
  const grouped = ISSUE_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: [] }),
    {} as Record<IssueStatus, IssueSummary[]>
  );
  issues.forEach((issue) => {
    grouped[issue.status].push(issue);
  });
  return grouped;
}

export function priorityClass(priority: IssuePriority): string {
  switch (priority) {
    case 'urgent':
      return 'border-shu-300/35 bg-shu-400/10 text-shu-300';
    case 'high':
      return 'border-sakura-300/35 bg-sakura-400/10 text-sakura-300';
    case 'medium':
      return 'border-brand-300/35 bg-brand-500/10 text-brand-200';
    default:
      return 'border-matcha-300/25 bg-matcha-400/10 text-matcha-300';
  }
}

export function statusClass(status: IssueStatus): string {
  switch (status) {
    case 'approved':
    case 'delivered':
      return 'border-matcha-300/35 bg-matcha-400/10 text-matcha-300';
    case 'revision_required':
      return 'border-shu-300/35 bg-shu-400/10 text-shu-300';
    case 'internal_review':
    case 'client_review':
      return 'border-sakura-300/35 bg-sakura-400/10 text-sakura-300';
    case 'archived':
      return 'border-slate-600 bg-slate-800/50 text-slate-400';
    default:
      return 'border-brand-300/35 bg-brand-500/10 text-brand-200';
  }
}

export function qaClass(status: AiQaStatus): string {
  switch (status) {
    case 'passed':
      return 'border-matcha-300/35 bg-matcha-400/10 text-matcha-300';
    case 'warning':
      return 'border-shu-300/35 bg-shu-400/10 text-shu-300';
    case 'failed':
      return 'border-rose-400/35 bg-rose-500/10 text-rose-300';
    default:
      return 'border-slate-600 bg-slate-800/50 text-slate-300';
  }
}

export function priorityAccentClass(priority: IssuePriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-shu-400';
    case 'high':
      return 'bg-sakura-400';
    case 'medium':
      return 'bg-brand-400';
    default:
      return 'bg-matcha-400';
  }
}
