/*
```cypher
CREATE
  (f:File {name: "workflowAutomationModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/workflowAutomationModel", type: "module"}),
  (c1:Class {name: "WorkflowDesignerTransition", type: "class", language: "typescript", signature: "interface WorkflowDesignerTransition"}),
  (c2:Class {name: "WorkflowDesignerModel", type: "class", language: "typescript", signature: "interface WorkflowDesignerModel"}),
  (c3:Class {name: "AutomationRuleReadiness", type: "class", language: "typescript", signature: "interface AutomationRuleReadiness"}),
  (c4:Class {name: "AutomationExecutionPlan", type: "class", language: "typescript", signature: "interface AutomationExecutionPlan"}),
  (fn1:Function {name: "formatLabel", type: "function", language: "typescript", signature: "function formatLabel(value: string): string"}),
  (fn2:Function {name: "labelStatus", type: "function", language: "typescript", signature: "function labelStatus(status: IssueStatus): string"}),
  (fn3:Function {name: "deriveFallbackTransitions", type: "function", language: "typescript", signature: "function deriveFallbackTransitions(statuses: IssueStatus[], guards: string[], validators: string[]): ProjectWorkflowTransition[]"}),
  (fn4:Function {name: "resolveWorkflowTransitions", type: "function", language: "typescript", signature: "function resolveWorkflowTransitions(catalog: ProjectWorkflowCatalog | undefined, statuses: IssueStatus[]): ProjectWorkflowTransition[]"}),
  (fn5:Function {name: "buildWorkflowDesignerModel", type: "function", language: "typescript", signature: "function buildWorkflowDesignerModel(catalog: ProjectWorkflowCatalog | undefined, fallbackStatuses: IssueStatus[]): WorkflowDesignerModel"}),
  (fn6:Function {name: "ruleReadsDataLake", type: "function", language: "typescript", signature: "function ruleReadsDataLake(rule: ProjectAutomationRule): boolean"}),
  (fn7:Function {name: "buildAutomationExecutionPlan", type: "function", language: "typescript", signature: "function buildAutomationExecutionPlan(catalog: ProjectAutomationCatalog | undefined): AutomationExecutionPlan"}),
  (v1:Variable {name: "STATUS_LABELS", type: "variable"}),
  (v2:Variable {name: "DEFAULT_APPROVAL_POLICY", type: "variable"}),
  (v3:Variable {name: "catalog", type: "variable"}),
  (v4:Variable {name: "statuses", type: "variable"}),
  (v5:Variable {name: "transitions", type: "variable"}),
  (v6:Variable {name: "rules", type: "variable"}),
  (v7:Variable {name: "runbook", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:USES]->(v4),
  (fn4)-[:CALLS]->(fn3),
  (fn4)-[:USES]->(v3),
  (fn4)-[:USES]->(v4),
  (fn5)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn4),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:USES]->(v2),
  (fn5)-[:USES]->(v3),
  (fn5)-[:USES]->(v4),
  (fn5)-[:USES]->(v5),
  (fn6)-[:USES]->(v6),
  (fn7)-[:CALLS]->(fn6),
  (fn7)-[:USES]->(v3),
  (fn7)-[:USES]->(v6),
  (fn7)-[:USES]->(v7);
```
*/

import type {
  ProjectAutomationCatalog,
  ProjectAutomationRule,
  ProjectAutomationRunbookStep,
  ProjectWorkflowApprovalPolicy,
  ProjectWorkflowCatalog,
  ProjectWorkflowTransition,
} from '@/types/projectManagement';
import type { IssueStatus } from '@/types/production';

const STATUS_LABELS: Partial<Record<IssueStatus, string>> = {
  backlog: 'Backlog',
  brief_ready: 'Brief Ready',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  internal_review: 'Internal Review',
  client_review: 'Client Review',
  revision_required: 'Revision Required',
  approved: 'Approved',
  delivered: 'Delivered',
  archived: 'Archived',
};

const DEFAULT_APPROVAL_POLICY: ProjectWorkflowApprovalPolicy = {
  default_reviewer_role: 'producer',
  data_lake_evidence_required: true,
  human_approval_statuses: ['internal_review', 'client_review', 'approved'],
  audit_event: 'workflow_transition_reviewed',
};

export interface WorkflowDesignerTransition extends ProjectWorkflowTransition {
  fromLabel: string;
  toLabel: string;
  gateSummary: string;
}

export interface WorkflowDesignerModel {
  statuses: IssueStatus[];
  transitions: WorkflowDesignerTransition[];
  coveragePercent: number;
  evidenceGateCount: number;
  approvalGateCount: number;
  humanApprovalStatuses: IssueStatus[];
  missingTransitionPairs: string[];
  policy: ProjectWorkflowApprovalPolicy;
}

export interface AutomationRuleReadiness {
  rule: ProjectAutomationRule;
  state: 'disabled' | 'needs_approval' | 'ready';
  conditionCount: number;
  actionCount: number;
  readsDataLake: boolean;
}

export interface AutomationExecutionPlan {
  rules: AutomationRuleReadiness[];
  runbook: ProjectAutomationRunbookStep[];
  enabledCount: number;
  approvalRequiredCount: number;
  dataLakeReadCount: number;
  graphCoveragePercent: number;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ');
}

export function labelStatus(status: IssueStatus): string {
  return STATUS_LABELS[status] ?? formatLabel(status);
}

export function deriveFallbackTransitions(
  statuses: IssueStatus[],
  guards: string[],
  validators: string[],
): ProjectWorkflowTransition[] {
  return statuses.slice(0, -1).map((status, index) => {
    const nextStatus = statuses[index + 1];
    const evidenceRequired =
      nextStatus === 'submitted' || nextStatus === 'approved' || nextStatus === 'delivered';
    const approvalRequired =
      nextStatus === 'internal_review' ||
      nextStatus === 'client_review' ||
      nextStatus === 'approved';
    return {
      id: `${status}_to_${nextStatus}`,
      from_status: status,
      to_status: nextStatus,
      name: `${formatLabel(status)} to ${formatLabel(nextStatus)}`,
      guard: guards[index % Math.max(1, guards.length)] ?? 'valid_transition',
      validator: validators[index % Math.max(1, validators.length)] ?? 'required_fields',
      approval_required: approvalRequired,
      evidence_required: evidenceRequired,
      sla_hours: approvalRequired ? 24 : 8,
    };
  });
}

export function resolveWorkflowTransitions(
  catalog: ProjectWorkflowCatalog | undefined,
  statuses: IssueStatus[],
): ProjectWorkflowTransition[] {
  if (catalog?.transitions?.length) {
    return catalog.transitions;
  }
  return deriveFallbackTransitions(statuses, catalog?.guards ?? [], catalog?.validators ?? []);
}

export function buildWorkflowDesignerModel(
  catalog: ProjectWorkflowCatalog | undefined,
  fallbackStatuses: IssueStatus[],
): WorkflowDesignerModel {
  const statuses = catalog?.statuses?.length ? catalog.statuses : fallbackStatuses;
  const transitions = resolveWorkflowTransitions(catalog, statuses);
  const policy = catalog?.approval_policy ?? DEFAULT_APPROVAL_POLICY;
  const transitionPairs = new Set(
    transitions.map((transition) => `${transition.from_status}->${transition.to_status}`),
  );
  const missingTransitionPairs = statuses
    .slice(0, -1)
    .map((status, index) => `${status}->${statuses[index + 1]}`)
    .filter((pair) => !transitionPairs.has(pair));
  const expectedTransitionCount = Math.max(1, statuses.length - 1);

  return {
    statuses,
    transitions: transitions.map((transition) => ({
      ...transition,
      fromLabel: labelStatus(transition.from_status),
      toLabel: labelStatus(transition.to_status),
      gateSummary: [
        transition.guard,
        transition.validator,
        transition.evidence_required ? 'data_lake_evidence' : undefined,
        transition.approval_required ? 'human_approval' : undefined,
      ]
        .filter(Boolean)
        .join(' / '),
    })),
    coveragePercent: Math.min(
      100,
      Math.round((transitions.length / expectedTransitionCount) * 100),
    ),
    evidenceGateCount: transitions.filter((transition) => transition.evidence_required).length,
    approvalGateCount: transitions.filter((transition) => transition.approval_required).length,
    humanApprovalStatuses: policy.human_approval_statuses,
    missingTransitionPairs,
    policy,
  };
}

export function ruleReadsDataLake(rule: ProjectAutomationRule): boolean {
  const searchable = [...rule.conditions, ...rule.actions, rule.trigger, rule.langgraph_node]
    .join(' ')
    .toLowerCase();
  return (
    searchable.includes('data_lake') ||
    searchable.includes('evidence') ||
    searchable.includes('asset')
  );
}

export function buildAutomationExecutionPlan(
  catalog: ProjectAutomationCatalog | undefined,
): AutomationExecutionPlan {
  const rules = catalog?.rules ?? [];
  const runbook = catalog?.runbook ?? [];
  const graphNodes = new Set(catalog?.langgraph_nodes ?? []);
  const readiness = rules.map((rule) => {
    const readsDataLake = ruleReadsDataLake(rule);
    return {
      rule,
      state: !rule.enabled ? 'disabled' : rule.approval_required ? 'needs_approval' : 'ready',
      conditionCount: rule.conditions.length,
      actionCount: rule.actions.length,
      readsDataLake,
    } satisfies AutomationRuleReadiness;
  });
  const enabledRules = readiness.filter((item) => item.rule.enabled);
  const coveredRules = enabledRules.filter((item) => graphNodes.has(item.rule.langgraph_node));

  return {
    rules: readiness,
    runbook,
    enabledCount: enabledRules.length,
    approvalRequiredCount: readiness.filter((item) => item.rule.approval_required).length,
    dataLakeReadCount: readiness.filter((item) => item.readsDataLake).length,
    graphCoveragePercent:
      enabledRules.length === 0
        ? 100
        : Math.round((coveredRules.length / enabledRules.length) * 100),
  };
}
