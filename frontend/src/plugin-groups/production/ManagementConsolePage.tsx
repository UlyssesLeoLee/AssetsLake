/*
```cypher
CREATE
  (f:File {name: "ManagementConsolePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ManagementConsolePage", type: "module"}),
  (fn1:Function {name: "ManagementConsolePage", type: "function", language: "typescript", signature: "function ManagementConsolePage()"}),
  (fn2:Function {name: "Metric", type: "function", language: "typescript", signature: "function Metric(props: { label: string; value: string | number; detail: string; tone?: string })"}),
  (fn3:Function {name: "CapabilityMatrix", type: "function", language: "typescript", signature: "function CapabilityMatrix()"}),
  (fn4:Function {name: "WorkstreamColumn", type: "function", language: "typescript", signature: "function WorkstreamColumn(props: { title: string; issues: IssueSummary[]; empty: string })"}),
  (fn5:Function {name: "LangGraphPanel", type: "function", language: "typescript", signature: "function LangGraphPanel(props: { model: ManagementModel; intelligence?: ManagementIntelligence })"}),
  (fn6:Function {name: "DataLakePanel", type: "function", language: "typescript", signature: "function DataLakePanel(props: { model: ManagementModel; intelligence?: ManagementIntelligence })"}),
  (fn7:Function {name: "AutomationPanel", type: "function", language: "typescript", signature: "function AutomationPanel(props: { model: ManagementModel; intelligence?: ManagementIntelligence })"}),
  (fn8:Function {name: "SectionHeader", type: "function", language: "typescript", signature: "function SectionHeader(props: { icon: ReactNode; title: string; subtitle: string })"}),
  (fn9:Function {name: "StatusChip", type: "function", language: "typescript", signature: "function StatusChip(props: { label: string; tone?: string })"}),
  (fn10:Function {name: "formatDate", type: "function", language: "typescript", signature: "function formatDate(value?: string): string"}),
  (fn11:Function {name: "deriveManagementModel", type: "function", language: "typescript", signature: "function deriveManagementModel(issues: IssueSummary[], assetTotal: number, milestoneTotal: number): ManagementModel"}),
  (fn12:Function {name: "EmergentCommandPanel", type: "function", language: "typescript", signature: "function EmergentCommandPanel(props: { model: EmergentOperatingModel })"}),
  (fn13:Function {name: "buildEmergentOperatingModel", type: "function", language: "typescript", signature: "function buildEmergentOperatingModel(input: BuildEmergentOperatingModelInput): EmergentOperatingModel"}),
  (v1:Variable {name: "MANAGEMENT_CAPABILITIES", type: "variable"}),
  (v2:Variable {name: "LANGGRAPH_STEPS", type: "variable"}),
  (v3:Variable {name: "DATA_LAKE_FEEDS", type: "variable"}),
  (v4:Variable {name: "AUTOMATION_RULES", type: "variable"}),
  (v5:Variable {name: "issues", type: "variable"}),
  (v6:Variable {name: "model", type: "variable"}),
  (v7:Variable {name: "emergentModel", type: "variable"}),
  (v8:Variable {name: "BackendEmergencePanel", type: "variable"}),
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
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn11),
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn13),
  (fn1)-[:USES]->(v8),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn3)-[:USES]->(v1),
  (fn4)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn9),
  (fn5)-[:USES]->(v2),
  (fn6)-[:CALLS]->(fn8),
  (fn6)-[:CALLS]->(fn9),
  (fn6)-[:USES]->(v3),
  (fn7)-[:CALLS]->(fn8),
  (fn7)-[:CALLS]->(fn9),
  (fn7)-[:USES]->(v4);
```
*/

'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Boxes,
  FileText,
  GitBranch,
  KanbanSquare,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

import { useAssets } from '@/hooks/useAssets';
import { useIssues, useManagementIntelligence, useMilestones } from '@/hooks/useProduction';
import { cn } from '@/lib/utils';
import { BackendEmergencePanel } from '@/plugin-groups/production/BackendEmergencePanel';
import { EmergentCommandPanel } from '@/plugin-groups/production/EmergentIntelligencePrimitives';
import { buildEmergentOperatingModel } from '@/plugin-groups/production/emergentIntelligenceModel';
import type { IssueStatus, IssueSummary, ManagementIntelligence } from '@/types/production';
import { ISSUE_STATUS_LABELS } from '@/types/production';

const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';

const MANAGEMENT_CAPABILITIES = [
  { label: 'Backlog', detail: 'Triage, priority, type, assignee, due date', state: 'Live' },
  { label: 'Sprint', detail: 'Status flow, WIP, blocked work, QA gates', state: 'Live' },
  { label: 'Roadmap', detail: 'Milestones, delivery packages, vendor scope', state: 'Live' },
  { label: 'Reports', detail: 'Throughput, overdue, revisions, review load', state: 'Live' },
  {
    label: 'Automation',
    detail: 'SLA routing, revision loops, delivery readiness',
    state: 'AI ready',
  },
  {
    label: 'Governance',
    detail: 'Audit trail, review history, client/internal scope',
    state: 'Live',
  },
  {
    label: 'LangGraph',
    detail: 'Multi-step issue planning and AI worker routing',
    state: 'Contracted',
  },
  {
    label: 'Data Lake',
    detail: 'Issues, assets, events, reviews, embeddings lineage',
    state: 'Contracted',
  },
];

const LANGGRAPH_STEPS = [
  {
    name: 'Intake Classifier',
    state: 'ready',
    detail: 'Normalizes briefs, bugs, review notes, and uploaded evidence.',
  },
  {
    name: 'Priority Planner',
    state: 'ready',
    detail: 'Ranks work by due date, revision count, QA status, and delivery risk.',
  },
  {
    name: 'Assignee Router',
    state: 'ready',
    detail: 'Routes work to internal artists, vendor managers, or approval queues.',
  },
  {
    name: 'Evidence Retriever',
    state: 'ready',
    detail: 'Reads asset metadata, previews, issue history, and lake search results.',
  },
  {
    name: 'Automation Executor',
    state: 'guarded',
    detail: 'Proposes transitions, comments, revision requests, and delivery actions.',
  },
];

const DATA_LAKE_FEEDS = [
  { name: 'Issue Event Stream', detail: 'status, priority, assignee, comments, review rounds' },
  {
    name: 'Asset Evidence Lake',
    detail: 'object keys, previews, checksums, tags, versions, delivery packages',
  },
  {
    name: 'Vector and Search Indexes',
    detail: 'Qdrant image similarity and OpenSearch metadata retrieval',
  },
  {
    name: 'Graph Lineage',
    detail: 'Neo4j-style links between issues, assets, milestones, vendors, and packages',
  },
];

const AUTOMATION_RULES = [
  {
    name: 'Overdue Escalation',
    detail: 'Moves late active issues into producer attention with AI summary.',
    guardrail: 'human_review_required',
  },
  {
    name: 'Review Gate',
    detail: 'Detects submitted work and prepares internal/client review checklists.',
    guardrail: 'human_review_required',
  },
  {
    name: 'Revision Loop',
    detail: 'Clusters repeated revision reasons and suggests root-cause fixes.',
    guardrail: 'human_review_required',
  },
  {
    name: 'Delivery Readiness',
    detail: 'Checks approved issues against selected assets and package evidence.',
    guardrail: 'human_review_required',
  },
];

type ManagementModel = {
  totalIssues: number;
  openIssues: number;
  overdueIssues: number;
  reviewIssues: number;
  revisionIssues: number;
  approvedIssues: number;
  qaRiskIssues: number;
  assetTotal: number;
  milestoneTotal: number;
  backlog: IssueSummary[];
  sprint: IssueSummary[];
  review: IssueSummary[];
  delivery: IssueSummary[];
};

export function ManagementConsolePage() {
  const { data: issueData, isLoading: issuesLoading } = useIssues({ page_size: 250 });
  const { data: assetsData } = useAssets({ status: 'active', page_size: 100 });
  const { data: milestones = [] } = useMilestones(DEFAULT_PROJECT_ID);
  const { data: intelligence } = useManagementIntelligence();

  const issues = issueData?.data ?? [];
  const model = useMemo(
    () => deriveManagementModel(issues, assetsData?.total ?? 0, milestones.length),
    [assetsData?.total, issues, milestones.length],
  );
  const emergentModel = useMemo(
    () =>
      buildEmergentOperatingModel({
        issues,
        assetTotal: assetsData?.total ?? 0,
        milestoneTotal: milestones.length,
        intelligence,
      }),
    [assetsData?.total, intelligence, issues, milestones.length],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b border-surface-border px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-300">
            <Boxes className="h-3.5 w-3.5" />
            Product Management Console
          </div>
          <h1 className="mt-1 truncate text-xl font-bold text-white">
            Emergent Asset Lake Operating System
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            One workspace for project flow, data-lake evidence, AI decisions, and guarded
            automation.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href="/briefs" className="btn-secondary">
            <FileText className="h-4 w-4" />
            New Brief
          </Link>
          <Link href="/board" className="btn-primary">
            <GitBranch className="h-4 w-4" />
            Open Board
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Open Work"
            value={model.openIssues}
            detail={`${model.totalIssues} total issues`}
          />
          <Metric
            label="Review Load"
            value={model.reviewIssues}
            detail={`${model.revisionIssues} revision loops`}
            tone="text-cyan-300"
          />
          <Metric
            label="Overdue Risk"
            value={model.overdueIssues}
            detail={`${model.qaRiskIssues} AI QA risks`}
            tone="text-amber-300"
          />
          <Metric
            label="Data Lake Evidence"
            value={model.assetTotal}
            detail={`${model.milestoneTotal} milestones linked`}
            tone="text-emerald-300"
          />
        </div>

        {issuesLoading && (
          <div className="mt-4 rounded-lg border border-surface-border bg-surface-secondary p-4 text-sm text-slate-400">
            Loading management data
          </div>
        )}

        <BackendEmergencePanel />
        <EmergentCommandPanel model={emergentModel} />

        <section className="mt-4 grid gap-4 xl:grid-cols-4">
          <WorkstreamColumn title="Backlog" issues={model.backlog} empty="No backlog items" />
          <WorkstreamColumn title="Sprint" issues={model.sprint} empty="No active sprint work" />
          <WorkstreamColumn title="Review" issues={model.review} empty="No review items" />
          <WorkstreamColumn
            title="Delivery"
            issues={model.delivery}
            empty="No delivery candidates"
          />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
          <CapabilityMatrix />
          <LangGraphPanel model={model} intelligence={intelligence} />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-2">
          <DataLakePanel model={model} intelligence={intelligence} />
          <AutomationPanel model={model} intelligence={intelligence} />
        </section>
      </div>
    </div>
  );
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

function CapabilityMatrix() {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionHeader
        icon={<KanbanSquare className="h-4 w-4" />}
        title="Product Management Surface"
        subtitle="Primary Jira-like capabilities covered by the production console."
      />
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {MANAGEMENT_CAPABILITIES.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-sm font-medium text-slate-100">{item.label}</div>
              <StatusChip
                label={item.state}
                tone={item.state === 'Live' ? 'text-emerald-300' : 'text-brand-300'}
              />
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500">{item.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkstreamColumn({
  title,
  issues,
  empty,
}: {
  title: string;
  issues: IssueSummary[];
  empty: string;
}) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center justify-between border-b border-surface-border px-3 py-2.5">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-slate-400">
          {issues.length}
        </span>
      </div>
      <div className="space-y-2 p-3">
        {issues.slice(0, 5).map((issue) => (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            className="block rounded-lg border border-surface-border bg-surface-elevated p-3 transition-colors hover:border-brand-500/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-brand-300">{issue.issue_key}</span>
              <span className="text-xs text-slate-500">{formatDate(issue.due_date)}</span>
            </div>
            <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-100">
              {issue.title}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {ISSUE_STATUS_LABELS[issue.status]} / {issue.priority} / {issue.qa_status}
            </div>
          </Link>
        ))}
        {issues.length === 0 && (
          <div className="p-4 text-center text-sm text-slate-500">{empty}</div>
        )}
      </div>
    </section>
  );
}

function LangGraphPanel({
  model,
  intelligence,
}: {
  model: ManagementModel;
  intelligence?: ManagementIntelligence;
}) {
  const steps = intelligence?.langgraph_nodes ?? LANGGRAPH_STEPS;

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionHeader
        icon={<Sparkles className="h-4 w-4" />}
        title="LangGraph AI Orchestration"
        subtitle="Graph nodes coordinate triage, retrieval, risk scoring, and guarded action proposals."
      />
      <div className="mt-4 space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className="flex gap-3 rounded-lg border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/10 text-xs font-semibold text-brand-300">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm font-medium text-slate-100">{step.name}</div>
                <StatusChip
                  label={step.state}
                  tone={step.state === 'ready' ? 'text-emerald-300' : 'text-amber-300'}
                />
              </div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <Metric
          label="AI Queue"
          value={model.openIssues}
          detail="candidate issue contexts"
          tone="text-brand-300"
        />
        <Metric
          label="Risk Inputs"
          value={model.overdueIssues + model.qaRiskIssues}
          detail="late or QA-warning issues"
          tone="text-amber-300"
        />
        <Metric
          label="Actions"
          value={model.reviewIssues + model.approvedIssues}
          detail="review and delivery proposals"
          tone="text-emerald-300"
        />
      </div>
    </section>
  );
}

function DataLakePanel({
  model,
  intelligence,
}: {
  model: ManagementModel;
  intelligence?: ManagementIntelligence;
}) {
  const feeds = intelligence?.data_lake_feeds ?? DATA_LAKE_FEEDS;

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionHeader
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Data Lake Interaction"
        subtitle="Issue management reads and writes evidence across asset metadata, events, vectors, search, and graph lineage."
      />
      <div className="mt-4 space-y-2">
        {feeds.map((feed) => (
          <div
            key={feed.name}
            className="rounded-lg border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-sm font-medium text-slate-100">{feed.name}</div>
              <StatusChip label="synced" tone="text-emerald-300" />
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500">{feed.detail}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <Metric
          label="Assets"
          value={model.assetTotal}
          detail="active evidence objects"
          tone="text-emerald-300"
        />
        <Metric label="Issues" value={model.totalIssues} detail="management records" />
        <Metric
          label="Milestones"
          value={model.milestoneTotal}
          detail="roadmap anchors"
          tone="text-cyan-300"
        />
      </div>
    </section>
  );
}

function AutomationPanel({
  model,
  intelligence,
}: {
  model: ManagementModel;
  intelligence?: ManagementIntelligence;
}) {
  const rules = intelligence?.automation_rules ?? AUTOMATION_RULES;

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
      <SectionHeader
        icon={<Sparkles className="h-4 w-4" />}
        title="AI Automation Rules"
        subtitle="Rules remain human-reviewed while LangGraph prepares context, recommendations, and audit evidence."
      />
      <div className="mt-4 space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.name}
            className="rounded-lg border border-surface-border bg-surface-elevated p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-sm font-medium text-slate-100">{rule.name}</div>
              <StatusChip
                label={rule.guardrail === 'human_review_required' ? 'guarded' : rule.guardrail}
                tone="text-brand-300"
              />
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500">{rule.detail}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
        <div className="flex items-start gap-2 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {model.overdueIssues} overdue issues and {model.revisionIssues} revision loops require
            producer review.
          </span>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <span className="text-brand-300">{icon}</span>
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusChip({ label, tone = 'text-slate-300' }: { label: string; tone?: string }) {
  return (
    <span
      className={cn('rounded-md border border-surface-border bg-surface px-2 py-0.5 text-xs', tone)}
    >
      {label}
    </span>
  );
}

function formatDate(value?: string): string {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(value));
}

function deriveManagementModel(
  issues: IssueSummary[],
  assetTotal: number,
  milestoneTotal: number,
): ManagementModel {
  const openStatuses: IssueStatus[] = [
    'backlog',
    'brief_ready',
    'assigned',
    'in_progress',
    'submitted',
    'internal_review',
    'client_review',
    'revision_required',
  ];
  const today = new Date();
  const activeIssues = issues.filter((issue) => openStatuses.includes(issue.status));

  return {
    totalIssues: issues.length,
    openIssues: activeIssues.length,
    overdueIssues: activeIssues.filter(
      (issue) => issue.due_date && new Date(issue.due_date) < today,
    ).length,
    reviewIssues: issues.filter((issue) =>
      ['submitted', 'internal_review', 'client_review'].includes(issue.status),
    ).length,
    revisionIssues: issues.filter((issue) => issue.status === 'revision_required').length,
    approvedIssues: issues.filter((issue) => issue.status === 'approved').length,
    qaRiskIssues: issues.filter((issue) => ['warning', 'failed'].includes(issue.qa_status)).length,
    assetTotal,
    milestoneTotal,
    backlog: issues.filter((issue) => ['backlog', 'brief_ready'].includes(issue.status)),
    sprint: issues.filter((issue) => ['assigned', 'in_progress'].includes(issue.status)),
    review: issues.filter((issue) =>
      ['submitted', 'internal_review', 'client_review', 'revision_required'].includes(issue.status),
    ),
    delivery: issues.filter((issue) => ['approved', 'delivered'].includes(issue.status)),
  };
}

export default ManagementConsolePage;
