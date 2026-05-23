/*
```cypher
CREATE
  (f:File {name: "issueEvidenceModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/issueEvidenceModel", type: "module"}),
  (c1:Class {name: "EvidenceChecklistItem", type: "class", language: "typescript", signature: "interface EvidenceChecklistItem"}),
  (c2:Class {name: "DataLakeEvidenceLink", type: "class", language: "typescript", signature: "interface DataLakeEvidenceLink"}),
  (c3:Class {name: "LangGraphSuggestion", type: "class", language: "typescript", signature: "interface LangGraphSuggestion"}),
  (c4:Class {name: "IssueEvidenceModel", type: "class", language: "typescript", signature: "interface IssueEvidenceModel"}),
  (fn1:Function {name: "deriveEvidenceRisk", type: "function", language: "typescript", signature: "function deriveEvidenceRisk(issue: Issue, assets: IssueAssetSummary[]): IssueEvidenceModel['risk']"}),
  (fn2:Function {name: "buildEvidenceChecklist", type: "function", language: "typescript", signature: "function buildEvidenceChecklist(issue: Issue, assets: IssueAssetSummary[], comments: IssueComment[]): EvidenceChecklistItem[]"}),
  (fn3:Function {name: "buildDataLakeEvidenceLinks", type: "function", language: "typescript", signature: "function buildDataLakeEvidenceLinks(assets: IssueAssetSummary[]): DataLakeEvidenceLink[]"}),
  (fn4:Function {name: "buildLangGraphSuggestions", type: "function", language: "typescript", signature: "function buildLangGraphSuggestions(issue: Issue, assets: IssueAssetSummary[], history: IssueStatusHistory[]): LangGraphSuggestion[]"}),
  (fn5:Function {name: "buildIssueEvidenceModel", type: "function", language: "typescript", signature: "function buildIssueEvidenceModel(issue: Issue, assets: IssueAssetSummary[], history: IssueStatusHistory[], comments: IssueComment[]): IssueEvidenceModel"}),
  (v1:Variable {name: "issue", type: "variable"}),
  (v2:Variable {name: "assets", type: "variable"}),
  (v3:Variable {name: "history", type: "variable"}),
  (v4:Variable {name: "comments", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v4),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn3),
  (fn5)-[:CALLS]->(fn4),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn5)-[:USES]->(v3),
  (fn5)-[:USES]->(v4);
```
*/

import type { Issue, IssueAssetSummary, IssueComment, IssueStatusHistory } from '@/types/production';

const REVIEW_STATUSES = ['submitted', 'internal_review', 'client_review', 'revision_required', 'approved', 'delivered'];
const DELIVERY_STATUSES = ['approved', 'delivered'];

export interface EvidenceChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface DataLakeEvidenceLink {
  id: string;
  label: string;
  assetType: string;
  status: string;
  source: 'object_store' | 'search_index' | 'graph_lineage';
}

export interface LangGraphSuggestion {
  node: 'evidence_retriever' | 'priority_planner' | 'action_proposer';
  action: string;
  confidence: number;
  approvalRequired: boolean;
}

export interface IssueEvidenceModel {
  readinessPercent: number;
  risk: 'ready' | 'watch' | 'blocked';
  checklist: EvidenceChecklistItem[];
  dataLakeLinks: DataLakeEvidenceLink[];
  suggestions: LangGraphSuggestion[];
  missingEvidenceCount: number;
  approvalRequired: boolean;
}

export function deriveEvidenceRisk(issue: Issue, assets: IssueAssetSummary[]): IssueEvidenceModel['risk'] {
  if (assets.length === 0 && REVIEW_STATUSES.includes(issue.status)) return 'blocked';
  if (issue.qa_status === 'failed') return 'blocked';
  if (issue.qa_status === 'warning' || issue.revision_count > 0) return 'watch';
  return 'ready';
}

export function buildEvidenceChecklist(
  issue: Issue,
  assets: IssueAssetSummary[],
  comments: IssueComment[]
): EvidenceChecklistItem[] {
  return [
    {
      id: 'asset_lineage',
      label: 'Asset lineage',
      passed: assets.length > 0,
      detail: assets.length > 0 ? `${assets.length} linked evidence objects` : 'No linked data lake assets',
    },
    {
      id: 'qa_gate',
      label: 'AI QA gate',
      passed: issue.qa_status === 'passed',
      detail: `AI QA status is ${issue.qa_status}`,
    },
    {
      id: 'review_context',
      label: 'Review context',
      passed: comments.length > 0 || !REVIEW_STATUSES.includes(issue.status),
      detail: comments.length > 0 ? `${comments.length} review/comment records` : 'Review issue needs written context',
    },
    {
      id: 'delivery_evidence',
      label: 'Delivery evidence',
      passed: !DELIVERY_STATUSES.includes(issue.status) || assets.some((asset) => asset.status === 'active'),
      detail: DELIVERY_STATUSES.includes(issue.status) ? 'Approved work needs active asset evidence' : 'Not in delivery gate',
    },
  ];
}

export function buildDataLakeEvidenceLinks(assets: IssueAssetSummary[]): DataLakeEvidenceLink[] {
  return assets.flatMap((asset) => [
    {
      id: `${asset.id}-object`,
      label: asset.name,
      assetType: asset.asset_type,
      status: asset.status,
      source: 'object_store' as const,
    },
    {
      id: `${asset.id}-graph`,
      label: `${asset.name} lineage`,
      assetType: asset.asset_type,
      status: asset.link_type,
      source: 'graph_lineage' as const,
    },
  ]);
}

export function buildLangGraphSuggestions(
  issue: Issue,
  assets: IssueAssetSummary[],
  history: IssueStatusHistory[]
): LangGraphSuggestion[] {
  const suggestions: LangGraphSuggestion[] = [
    {
      node: 'evidence_retriever',
      action: assets.length > 0 ? 'summarize_asset_lineage' : 'request_missing_asset_evidence',
      confidence: assets.length > 0 ? 0.86 : 0.72,
      approvalRequired: false,
    },
  ];

  if (issue.priority === 'urgent' || issue.due_date) {
    suggestions.push({
      node: 'priority_planner',
      action: issue.priority === 'urgent' ? 'prepare_escalation_summary' : 'check_due_date_risk',
      confidence: issue.priority === 'urgent' ? 0.82 : 0.68,
      approvalRequired: issue.priority === 'urgent',
    });
  }

  if (history.length > 0 || REVIEW_STATUSES.includes(issue.status)) {
    suggestions.push({
      node: 'action_proposer',
      action: REVIEW_STATUSES.includes(issue.status) ? 'draft_review_next_action' : 'summarize_recent_status_changes',
      confidence: 0.78,
      approvalRequired: true,
    });
  }

  return suggestions;
}

export function buildIssueEvidenceModel(
  issue: Issue,
  assets: IssueAssetSummary[],
  history: IssueStatusHistory[],
  comments: IssueComment[]
): IssueEvidenceModel {
  const checklist = buildEvidenceChecklist(issue, assets, comments);
  const passedCount = checklist.filter((item) => item.passed).length;
  const missingEvidenceCount = checklist.length - passedCount;

  return {
    readinessPercent: Math.round((passedCount / checklist.length) * 100),
    risk: deriveEvidenceRisk(issue, assets),
    checklist,
    dataLakeLinks: buildDataLakeEvidenceLinks(assets),
    suggestions: buildLangGraphSuggestions(issue, assets, history),
    missingEvidenceCount,
    approvalRequired: REVIEW_STATUSES.includes(issue.status) || issue.priority === 'urgent',
  };
}
