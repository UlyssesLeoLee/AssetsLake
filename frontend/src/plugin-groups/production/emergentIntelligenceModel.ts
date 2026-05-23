/*
```cypher
CREATE
  (f:File {name: "emergentIntelligenceModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/emergentIntelligenceModel", type: "module"}),
  (c1:Class {name: "EmergentOperatingMode", type: "class", language: "typescript", signature: "type EmergentOperatingMode"}),
  (c2:Class {name: "EmergentSignalTone", type: "class", language: "typescript", signature: "type EmergentSignalTone"}),
  (c3:Class {name: "EmergentSignalSource", type: "class", language: "typescript", signature: "type EmergentSignalSource"}),
  (c4:Class {name: "EmergentSignal", type: "class", language: "typescript", signature: "interface EmergentSignal"}),
  (c5:Class {name: "EmergentRecommendation", type: "class", language: "typescript", signature: "interface EmergentRecommendation"}),
  (c6:Class {name: "EmergentLoopStage", type: "class", language: "typescript", signature: "interface EmergentLoopStage"}),
  (c7:Class {name: "EmergentOperatingModel", type: "class", language: "typescript", signature: "interface EmergentOperatingModel"}),
  (c8:Class {name: "BuildEmergentOperatingModelInput", type: "class", language: "typescript", signature: "interface BuildEmergentOperatingModelInput"}),
  (c9:Class {name: "EmergentMetrics", type: "class", language: "typescript", signature: "type EmergentMetrics"}),
  (fn1:Function {name: "buildEmergentOperatingModel", type: "function", language: "typescript", signature: "function buildEmergentOperatingModel(input: BuildEmergentOperatingModelInput): EmergentOperatingModel", visibility: "public"}),
  (fn2:Function {name: "isOpenIssue", type: "function", language: "typescript", signature: "function isOpenIssue(issue: IssueSummary): boolean", visibility: "private"}),
  (fn3:Function {name: "isReviewIssue", type: "function", language: "typescript", signature: "function isReviewIssue(issue: IssueSummary): boolean", visibility: "private"}),
  (fn4:Function {name: "isDeliveryIssue", type: "function", language: "typescript", signature: "function isDeliveryIssue(issue: IssueSummary): boolean", visibility: "private"}),
  (fn5:Function {name: "isQaRiskIssue", type: "function", language: "typescript", signature: "function isQaRiskIssue(issue: IssueSummary): boolean", visibility: "private"}),
  (fn6:Function {name: "isOverdueIssue", type: "function", language: "typescript", signature: "function isOverdueIssue(issue: IssueSummary, todayKey: number): boolean", visibility: "private"}),
  (fn7:Function {name: "deriveOperatingMode", type: "function", language: "typescript", signature: "function deriveOperatingMode(metrics: EmergentMetrics): EmergentOperatingMode", visibility: "private"}),
  (fn8:Function {name: "buildLoopStages", type: "function", language: "typescript", signature: "function buildLoopStages(metrics: EmergentMetrics): EmergentLoopStage[]", visibility: "private"}),
  (fn9:Function {name: "buildSignals", type: "function", language: "typescript", signature: "function buildSignals(metrics: EmergentMetrics): EmergentSignal[]", visibility: "private"}),
  (fn10:Function {name: "buildRecommendations", type: "function", language: "typescript", signature: "function buildRecommendations(metrics: EmergentMetrics): EmergentRecommendation[]", visibility: "private"}),
  (fn11:Function {name: "calculatePercent", type: "function", language: "typescript", signature: "function calculatePercent(value: number, total: number): number", visibility: "private"}),
  (fn12:Function {name: "clampPercent", type: "function", language: "typescript", signature: "function clampPercent(value: number): number", visibility: "private"}),
  (fn13:Function {name: "toneFromPercent", type: "function", language: "typescript", signature: "function toneFromPercent(value: number): EmergentSignalTone", visibility: "private"}),
  (fn14:Function {name: "toDateKey", type: "function", language: "typescript", signature: "function toDateKey(value?: string | Date): number | null", visibility: "private"}),
  (v1:Variable {name: "OPEN_STATUSES", type: "variable"}),
  (v2:Variable {name: "REVIEW_STATUSES", type: "variable"}),
  (v3:Variable {name: "DELIVERY_STATUSES", type: "variable"}),
  (v4:Variable {name: "MAX_RECOMMENDATIONS", type: "variable"}),
  (v5:Variable {name: "input", type: "variable"}),
  (v6:Variable {name: "metrics", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
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
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn14),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn6)-[:CALLS]->(fn2),
  (fn6)-[:CALLS]->(fn14),
  (fn7)-[:USES]->(v6),
  (fn8)-[:USES]->(v6),
  (fn9)-[:CALLS]->(fn13),
  (fn9)-[:USES]->(v6),
  (fn10)-[:USES]->(v4),
  (fn10)-[:USES]->(v6),
  (fn11)-[:CALLS]->(fn12),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6);
```
*/

import type { IssueStatus, IssueSummary, ManagementIntelligence } from '@/types/production';

const OPEN_STATUSES: IssueStatus[] = [
  'backlog',
  'brief_ready',
  'assigned',
  'in_progress',
  'submitted',
  'internal_review',
  'client_review',
  'revision_required',
];
const REVIEW_STATUSES: IssueStatus[] = ['submitted', 'internal_review', 'client_review', 'revision_required'];
const DELIVERY_STATUSES: IssueStatus[] = ['approved', 'delivered'];
const MAX_RECOMMENDATIONS = 4;

export type EmergentOperatingMode = 'sense' | 'decide' | 'act';
export type EmergentSignalTone = 'healthy' | 'watch' | 'blocked';
export type EmergentSignalSource = 'data_lake' | 'project_flow' | 'ai' | 'automation';

export interface EmergentSignal {
  id: string;
  label: string;
  value: string;
  detail: string;
  source: EmergentSignalSource;
  tone: EmergentSignalTone;
}

export interface EmergentRecommendation {
  id: string;
  title: string;
  mode: EmergentOperatingMode;
  action: string;
  impact: string;
  confidence: number;
  tone: EmergentSignalTone;
}

export interface EmergentLoopStage {
  mode: EmergentOperatingMode;
  label: string;
  value: string;
  detail: string;
}

export interface EmergentOperatingModel {
  readinessPercent: number;
  evidenceCoveragePercent: number;
  flowHealthPercent: number;
  aiReadinessPercent: number;
  riskCount: number;
  mode: EmergentOperatingMode;
  loop: EmergentLoopStage[];
  signals: EmergentSignal[];
  recommendations: EmergentRecommendation[];
}

export interface BuildEmergentOperatingModelInput {
  issues: IssueSummary[];
  assetTotal: number;
  milestoneTotal: number;
  intelligence?: ManagementIntelligence;
  today?: string | Date;
}

type EmergentMetrics = {
  totalIssues: number;
  openIssues: number;
  reviewIssues: number;
  deliveryIssues: number;
  evidenceLinkedIssues: number;
  missingEvidenceIssues: number;
  overdueIssues: number;
  qaRiskIssues: number;
  assetTotal: number;
  milestoneTotal: number;
  evidenceCoveragePercent: number;
  flowHealthPercent: number;
  aiReadinessPercent: number;
  readinessPercent: number;
  riskCount: number;
  langGraphNodeCount: number;
  dataLakeFeedCount: number;
  automationRuleCount: number;
  aiConfigured: boolean;
  aiUsed: boolean;
  aiProvider: string;
};

export function buildEmergentOperatingModel(input: BuildEmergentOperatingModelInput): EmergentOperatingModel {
  const todayKey = toDateKey(input.today ?? new Date()) ?? 0;
  const totalIssues = input.issues.length;
  const openIssues = input.issues.filter(isOpenIssue).length;
  const reviewIssues = input.issues.filter(isReviewIssue).length;
  const deliveryIssues = input.issues.filter(isDeliveryIssue).length;
  const evidenceLinkedIssues = input.issues.filter((issue) => issue.asset_count > 0).length;
  const missingEvidenceIssues = input.issues.filter((issue) => isReviewIssue(issue) && issue.asset_count === 0).length;
  const overdueIssues = input.issues.filter((issue) => isOverdueIssue(issue, todayKey)).length;
  const qaRiskIssues = input.issues.filter(isQaRiskIssue).length;
  const riskCount = missingEvidenceIssues + overdueIssues + qaRiskIssues;
  const evidenceCoveragePercent = totalIssues > 0 ? calculatePercent(evidenceLinkedIssues, totalIssues) : 100;
  const flowHealthPercent = clampPercent(100 - calculatePercent(riskCount, Math.max(openIssues, 1)));
  const langGraphNodeCount = input.intelligence?.langgraph_nodes.length ?? 0;
  const dataLakeFeedCount = input.intelligence?.data_lake_feeds.length ?? 0;
  const automationRuleCount = input.intelligence?.automation_rules.length ?? 0;
  const aiConfigured = Boolean(input.intelligence?.ai_status?.configured);
  const aiUsed = Boolean(input.intelligence?.ai_status?.used);
  const aiSurfacePercent = calculatePercent(langGraphNodeCount + automationRuleCount, 9);
  const aiReadinessPercent = clampPercent((aiConfigured ? 45 : 15) + (aiUsed ? 30 : 0) + Math.round(aiSurfacePercent * 0.25));
  const milestonePercent = input.milestoneTotal > 0 ? 100 : 45;
  const readinessPercent = clampPercent(
    Math.round(evidenceCoveragePercent * 0.34 + flowHealthPercent * 0.28 + aiReadinessPercent * 0.28 + milestonePercent * 0.1)
  );
  const metrics: EmergentMetrics = {
    totalIssues,
    openIssues,
    reviewIssues,
    deliveryIssues,
    evidenceLinkedIssues,
    missingEvidenceIssues,
    overdueIssues,
    qaRiskIssues,
    assetTotal: input.assetTotal,
    milestoneTotal: input.milestoneTotal,
    evidenceCoveragePercent,
    flowHealthPercent,
    aiReadinessPercent,
    readinessPercent,
    riskCount,
    langGraphNodeCount,
    dataLakeFeedCount,
    automationRuleCount,
    aiConfigured,
    aiUsed,
    aiProvider: input.intelligence?.ai_status?.provider ?? 'not configured',
  };

  return {
    readinessPercent,
    evidenceCoveragePercent,
    flowHealthPercent,
    aiReadinessPercent,
    riskCount,
    mode: deriveOperatingMode(metrics),
    loop: buildLoopStages(metrics),
    signals: buildSignals(metrics),
    recommendations: buildRecommendations(metrics),
  };
}

function isOpenIssue(issue: IssueSummary): boolean {
  return OPEN_STATUSES.includes(issue.status);
}

function isReviewIssue(issue: IssueSummary): boolean {
  return REVIEW_STATUSES.includes(issue.status);
}

function isDeliveryIssue(issue: IssueSummary): boolean {
  return DELIVERY_STATUSES.includes(issue.status);
}

function isQaRiskIssue(issue: IssueSummary): boolean {
  return issue.qa_status === 'warning' || issue.qa_status === 'failed';
}

function isOverdueIssue(issue: IssueSummary, todayKey: number): boolean {
  const dueKey = toDateKey(issue.due_date);
  return Boolean(dueKey && dueKey < todayKey && isOpenIssue(issue));
}

function deriveOperatingMode(metrics: EmergentMetrics): EmergentOperatingMode {
  if (metrics.totalIssues > 0 && (metrics.missingEvidenceIssues > 0 || metrics.evidenceCoveragePercent < 50)) return 'sense';
  if (metrics.overdueIssues > 0 || metrics.qaRiskIssues > 0 || metrics.aiReadinessPercent < 55) return 'decide';
  return metrics.deliveryIssues > 0 || metrics.readinessPercent >= 75 ? 'act' : 'decide';
}

function buildLoopStages(metrics: EmergentMetrics): EmergentLoopStage[] {
  return [
    {
      mode: 'sense',
      label: 'Sense',
      value: `${metrics.evidenceCoveragePercent}%`,
      detail:
        metrics.totalIssues > 0
          ? `${metrics.evidenceLinkedIssues}/${metrics.totalIssues} issues have lake evidence`
          : `${metrics.assetTotal} assets ready for issue evidence`,
    },
    {
      mode: 'decide',
      label: 'Decide',
      value: `${metrics.flowHealthPercent}%`,
      detail: `${metrics.riskCount} risks across due dates, QA, and evidence`,
    },
    {
      mode: 'act',
      label: 'Act',
      value: `${metrics.aiReadinessPercent}%`,
      detail: `${metrics.automationRuleCount} guarded automation rules`,
    },
  ];
}

function buildSignals(metrics: EmergentMetrics): EmergentSignal[] {
  return [
    {
      id: 'data_lake_evidence',
      label: 'Data lake evidence',
      value: `${metrics.evidenceCoveragePercent}%`,
      detail:
        metrics.totalIssues > 0
          ? `${metrics.assetTotal} assets, ${metrics.dataLakeFeedCount} lake feeds, ${metrics.missingEvidenceIssues} review gaps`
          : `${metrics.assetTotal} assets, ${metrics.dataLakeFeedCount} lake feeds, no active issue gaps`,
      source: 'data_lake',
      tone: toneFromPercent(metrics.evidenceCoveragePercent),
    },
    {
      id: 'project_flow',
      label: 'Project flow',
      value: `${metrics.flowHealthPercent}%`,
      detail: `${metrics.openIssues} open, ${metrics.overdueIssues} overdue, ${metrics.qaRiskIssues} QA risks`,
      source: 'project_flow',
      tone: toneFromPercent(metrics.flowHealthPercent),
    },
    {
      id: 'ai_copilot',
      label: 'AI copilot',
      value: `${metrics.aiReadinessPercent}%`,
      detail: metrics.aiConfigured
        ? `${metrics.aiProvider} connected, ${metrics.langGraphNodeCount} LangGraph nodes`
        : `${metrics.langGraphNodeCount} LangGraph nodes waiting for API settings`,
      source: 'ai',
      tone: toneFromPercent(metrics.aiReadinessPercent),
    },
    {
      id: 'automation_guardrails',
      label: 'Automation guardrails',
      value: String(metrics.automationRuleCount),
      detail: `${metrics.reviewIssues} review items and ${metrics.deliveryIssues} delivery candidates`,
      source: 'automation',
      tone: metrics.automationRuleCount > 0 ? 'healthy' : 'watch',
    },
  ];
}

function buildRecommendations(metrics: EmergentMetrics): EmergentRecommendation[] {
  const recommendations: EmergentRecommendation[] = [];

  if (metrics.totalIssues > 0 && (metrics.missingEvidenceIssues > 0 || metrics.evidenceCoveragePercent < 60)) {
    recommendations.push({
      id: 'evidence_gate',
      title: 'Evidence-first review gate',
      mode: 'sense',
      action: 'Link asset evidence before review decisions',
      impact: `${metrics.missingEvidenceIssues} review items need stronger lake lineage`,
      confidence: 0.88,
      tone: metrics.missingEvidenceIssues > 0 ? 'blocked' : 'watch',
    });
  }

  if (metrics.overdueIssues > 0 || metrics.qaRiskIssues > 0) {
    recommendations.push({
      id: 'risk_triage',
      title: 'AI risk triage queue',
      mode: 'decide',
      action: 'Rank overdue and QA-risk work for producer review',
      impact: `${metrics.overdueIssues + metrics.qaRiskIssues} project-flow signals need a decision`,
      confidence: 0.82,
      tone: 'watch',
    });
  }

  if (!metrics.aiConfigured) {
    recommendations.push({
      id: 'ai_configuration',
      title: 'Activate AI decision layer',
      mode: 'decide',
      action: 'Connect an OpenAI-compatible API in Settings',
      impact: 'Turns lake and project signals into generated recommendations',
      confidence: 0.76,
      tone: 'watch',
    });
  }

  if (metrics.deliveryIssues > 0 || (metrics.totalIssues > 0 && metrics.readinessPercent >= 75)) {
    recommendations.push({
      id: 'delivery_package',
      title: 'Auto-package delivery readiness',
      mode: 'act',
      action: 'Assemble approved work with evidence and audit trail',
      impact: `${metrics.deliveryIssues} delivery candidates can move with guarded automation`,
      confidence: metrics.aiUsed ? 0.84 : 0.68,
      tone: 'healthy',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'continuous_loop',
      title: 'Continuous operating loop',
      mode: 'act',
      action: 'Keep sensing evidence, deciding priority, and preparing safe actions',
      impact: 'No blocking signals detected in the current project surface',
      confidence: 0.72,
      tone: 'healthy',
    });
  }

  return recommendations.slice(0, MAX_RECOMMENDATIONS);
}

function calculatePercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return clampPercent(Math.round((value / total) * 100));
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function toneFromPercent(value: number): EmergentSignalTone {
  if (value >= 75) return 'healthy';
  if (value >= 45) return 'watch';
  return 'blocked';
}

function toDateKey(value?: string | Date): number | null {
  if (!value) return null;

  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) return Number(`${match[1]}${match[2]}${match[3]}`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
