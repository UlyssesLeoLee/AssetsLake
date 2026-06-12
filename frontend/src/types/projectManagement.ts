/*
```cypher
CREATE
  (f:File {name: "projectManagement.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/projectManagement", type: "module"}),
  (c1:Class {name: "ProjectManagementEpic", type: "class", language: "typescript", signature: "interface ProjectManagementEpic"}),
  (c2:Class {name: "ProjectManagementSprint", type: "class", language: "typescript", signature: "interface ProjectManagementSprint"}),
  (c3:Class {name: "IssueDependency", type: "class", language: "typescript", signature: "interface IssueDependency"}),
  (c4:Class {name: "IssueEvent", type: "class", language: "typescript", signature: "interface IssueEvent"}),
  (c5:Class {name: "SavedIssueFilter", type: "class", language: "typescript", signature: "interface SavedIssueFilter"}),
  (c6:Class {name: "ProjectManagementPlan", type: "class", language: "typescript", signature: "interface ProjectManagementPlan"}),
  (c7:Class {name: "ProjectGanttItem", type: "class", language: "typescript", signature: "interface ProjectGanttItem"}),
  (c8:Class {name: "ProjectGanttSnapshot", type: "class", language: "typescript", signature: "interface ProjectGanttSnapshot"}),
  (c9:Class {name: "ProjectCalendarEvent", type: "class", language: "typescript", signature: "interface ProjectCalendarEvent"}),
  (c10:Class {name: "ProjectCalendarSnapshot", type: "class", language: "typescript", signature: "interface ProjectCalendarSnapshot"}),
  (c11:Class {name: "ProjectCalendarLane", type: "class", language: "typescript", signature: "interface ProjectCalendarLane"}),
  (c12:Class {name: "ProjectCalendarWorkloadDay", type: "class", language: "typescript", signature: "interface ProjectCalendarWorkloadDay"}),
  (c13:Class {name: "ProjectReportsSnapshot", type: "class", language: "typescript", signature: "interface ProjectReportsSnapshot"}),
  (c14:Class {name: "ProjectBurndownPoint", type: "class", language: "typescript", signature: "interface ProjectBurndownPoint"}),
  (c15:Class {name: "ProjectVelocityPoint", type: "class", language: "typescript", signature: "interface ProjectVelocityPoint"}),
  (c16:Class {name: "ProjectCumulativeFlowPoint", type: "class", language: "typescript", signature: "interface ProjectCumulativeFlowPoint"}),
  (c17:Class {name: "ProjectCycleTimeMetric", type: "class", language: "typescript", signature: "interface ProjectCycleTimeMetric"}),
  (c18:Class {name: "ProjectSlaMetric", type: "class", language: "typescript", signature: "interface ProjectSlaMetric"}),
  (c19:Class {name: "ProjectWorkflowCatalog", type: "class", language: "typescript", signature: "interface ProjectWorkflowCatalog"}),
  (c20:Class {name: "ProjectAutomationCatalog", type: "class", language: "typescript", signature: "interface ProjectAutomationCatalog"}),
  (c21:Class {name: "ProjectWorkflowTransition", type: "class", language: "typescript", signature: "interface ProjectWorkflowTransition"}),
  (c22:Class {name: "ProjectWorkflowApprovalPolicy", type: "class", language: "typescript", signature: "interface ProjectWorkflowApprovalPolicy"}),
  (c23:Class {name: "ProjectAutomationRule", type: "class", language: "typescript", signature: "interface ProjectAutomationRule"}),
  (c24:Class {name: "ProjectAutomationRunbookStep", type: "class", language: "typescript", signature: "interface ProjectAutomationRunbookStep"}),
  (c25:Class {name: "ProjectEnterpriseControls", type: "class", language: "typescript", signature: "interface ProjectEnterpriseControls"}),
  (c26:Class {name: "ProjectEnterpriseRole", type: "class", language: "typescript", signature: "interface ProjectEnterpriseRole"}),
  (c27:Class {name: "ProjectEnterpriseNotification", type: "class", language: "typescript", signature: "interface ProjectEnterpriseNotification"}),
  (c28:Class {name: "ProjectEnterpriseImportExport", type: "class", language: "typescript", signature: "interface ProjectEnterpriseImportExport"}),
  (c29:Class {name: "ProjectEnterpriseWebhook", type: "class", language: "typescript", signature: "interface ProjectEnterpriseWebhook"}),
  (c30:Class {name: "ProjectEnterpriseTemplate", type: "class", language: "typescript", signature: "interface ProjectEnterpriseTemplate"}),
  (c31:Class {name: "ProjectEnterpriseCiGate", type: "class", language: "typescript", signature: "interface ProjectEnterpriseCiGate"}),
  (c32:Class {name: "ProjectEnterpriseAudit", type: "class", language: "typescript", signature: "interface ProjectEnterpriseAudit"}),
  (c33:Class {name: "CreateEpicRequest", type: "class", language: "typescript", signature: "interface CreateEpicRequest"}),
  (c34:Class {name: "CreateSprintRequest", type: "class", language: "typescript", signature: "interface CreateSprintRequest"}),
  (c35:Class {name: "CreateIssueDependencyRequest", type: "class", language: "typescript", signature: "interface CreateIssueDependencyRequest"}),
  (v1:Variable {name: "SPRINT_STATUS_LABELS", type: "variable"}),
  (v2:Variable {name: "ISSUE_DEPENDENCY_TYPE_LABELS", type: "variable"}),
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
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(c12),
  (m)-[:CONTAINS]->(c13),
  (m)-[:CONTAINS]->(c14),
  (m)-[:CONTAINS]->(c15),
  (m)-[:CONTAINS]->(c16),
  (m)-[:CONTAINS]->(c17),
  (m)-[:CONTAINS]->(c18),
  (m)-[:CONTAINS]->(c19),
  (m)-[:CONTAINS]->(c20),
  (m)-[:CONTAINS]->(c21),
  (m)-[:CONTAINS]->(c22),
  (m)-[:CONTAINS]->(c23),
  (m)-[:CONTAINS]->(c24),
  (m)-[:CONTAINS]->(c25),
  (m)-[:CONTAINS]->(c26),
  (m)-[:CONTAINS]->(c27),
  (m)-[:CONTAINS]->(c28),
  (m)-[:CONTAINS]->(c29),
  (m)-[:CONTAINS]->(c30),
  (m)-[:CONTAINS]->(c31),
  (m)-[:CONTAINS]->(c32),
  (m)-[:CONTAINS]->(c33),
  (m)-[:CONTAINS]->(c34),
  (m)-[:CONTAINS]->(c35),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2);
```
*/

import type { IssuePriority, IssueStatus, IssueSummary } from '@/types/production';

export type ProjectManagementWorkItemType = 'epic' | 'story' | 'task' | 'bug' | 'sub_task';

export type SprintStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export type IssueDependencyType =
  | 'blocks'
  | 'is_blocked_by'
  | 'relates_to'
  | 'duplicates'
  | 'parent_child';

export type IssueEventType =
  | 'created'
  | 'updated'
  | 'ranked'
  | 'assigned'
  | 'transitioned'
  | 'commented'
  | 'asset_linked'
  | 'dependency_linked'
  | 'sprint_changed'
  | 'ai_recommended';

export interface ProjectManagementEpic {
  id: string;
  workspace_id: string;
  project_id: string;
  epic_key: string;
  name: string;
  summary?: string;
  status: IssueStatus;
  priority: IssuePriority;
  owner_id?: string;
  start_date?: string;
  target_date?: string;
  rank_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectManagementSprint {
  id: string;
  workspace_id: string;
  project_id: string;
  name: string;
  goal?: string;
  status: SprintStatus;
  start_date?: string;
  end_date?: string;
  capacity_points: number;
  committed_points: number;
  completed_points: number;
  created_at: string;
  updated_at: string;
}

export interface IssueDependency {
  id: string;
  workspace_id: string;
  project_id: string;
  source_issue_id: string;
  target_issue_id: string;
  dependency_type: IssueDependencyType;
  description?: string;
  created_by?: string;
  created_at: string;
}

export interface IssueEvent {
  id: string;
  workspace_id: string;
  project_id: string;
  issue_id: string;
  event_type: IssueEventType;
  actor_id?: string;
  actor_name: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface SavedIssueFilter {
  id: string;
  workspace_id: string;
  project_id?: string;
  owner_id?: string;
  name: string;
  query: Record<string, unknown>;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectManagementPlan {
  project_id: string;
  epics: ProjectManagementEpic[];
  sprints: ProjectManagementSprint[];
  backlog: IssueSummary[];
  active_sprint: IssueSummary[];
  dependencies: IssueDependency[];
  recent_events: IssueEvent[];
}

export interface ProjectGanttItem {
  id: string;
  issue_key: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  start_date?: string;
  due_date?: string;
  story_points?: number;
  dependency_count: number;
}

export interface ProjectGanttSnapshot {
  project_id: string;
  schedule_items: ProjectGanttItem[];
  dependencies: IssueDependency[];
  baseline_status: string;
}

export interface ProjectCalendarEvent {
  id: string;
  title: string;
  item_type: string;
  date?: string;
  end_date?: string;
  status: IssueStatus;
  lane: 'sprint' | 'release' | 'review' | 'vendor' | 'due_date' | string;
  risk: 'normal' | 'overdue' | 'blocked' | 'missing_evidence' | string;
  owner?: string;
}

export interface ProjectCalendarLane {
  id: string;
  label: string;
  calendar_type: 'sprint' | 'release' | 'review' | 'vendor' | string;
  status: string;
  event_count: number;
}

export interface ProjectCalendarWorkloadDay {
  date: string;
  total: number;
  review: number;
  vendor: number;
  risk: number;
}

export interface ProjectCalendarSnapshot {
  project_id: string;
  events: ProjectCalendarEvent[];
  lanes: ProjectCalendarLane[];
  workload: ProjectCalendarWorkloadDay[];
  review_calendar: string;
  vendor_delivery_calendar: string;
}

export interface ProjectBurndownPoint {
  label: string;
  open: number;
  closed: number;
  ideal_remaining: number;
}

export interface ProjectVelocityPoint {
  sprint: string;
  committed: number;
  completed: number;
  carryover: number;
}

export interface ProjectCumulativeFlowPoint {
  label: string;
  backlog: number;
  active: number;
  review: number;
  done: number;
}

export interface ProjectCycleTimeMetric {
  name: string;
  average_hours: number;
  p85_hours: number;
  sample_size: number;
}

export interface ProjectSlaMetric {
  name: string;
  target_hours: number;
  breached: number;
  total: number;
  compliance_percent: number;
}

export interface ProjectReportsSnapshot {
  project_id: string;
  burndown: {
    open: number;
    closed: number;
    points: ProjectBurndownPoint[];
  };
  velocity: {
    sprints: number;
    status: string;
    average_completed: number;
    predictability_percent: number;
    points: ProjectVelocityPoint[];
  };
  cumulative_flow: {
    backlog: number;
    active: number;
    review: number;
    done: number;
    points: ProjectCumulativeFlowPoint[];
  };
  cycle_time: {
    event_samples: number;
    metrics: ProjectCycleTimeMetric[];
  };
  sla: {
    overall_compliance_percent: number;
    metrics: ProjectSlaMetric[];
  };
  delivery_readiness: {
    dependency_count: number;
    epic_count: number;
    blocked_count: number;
    missing_evidence_count: number;
    ready_percent: number;
  };
}

export interface ProjectWorkflowTransition {
  id: string;
  from_status: IssueStatus;
  to_status: IssueStatus;
  name: string;
  guard: string;
  validator: string;
  approval_required: boolean;
  evidence_required: boolean;
  sla_hours: number;
}

export interface ProjectWorkflowApprovalPolicy {
  default_reviewer_role: string;
  data_lake_evidence_required: boolean;
  human_approval_statuses: IssueStatus[];
  audit_event: string;
}

export interface ProjectWorkflowCatalog {
  project_id: string;
  statuses: IssueStatus[];
  guards: string[];
  validators: string[];
  transitions: ProjectWorkflowTransition[];
  approval_policy: ProjectWorkflowApprovalPolicy;
}

export interface ProjectAutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  langgraph_node: string;
  guardrail: string;
  enabled: boolean;
  approval_required: boolean;
}

export interface ProjectAutomationRunbookStep {
  id: string;
  node: string;
  action: string;
  reads: string[];
  writes: string[];
  requires_approval: boolean;
}

export interface ProjectAutomationCatalog {
  project_id: string;
  rules: ProjectAutomationRule[];
  langgraph_nodes: string[];
  runbook: ProjectAutomationRunbookStep[];
  guardrail: string;
}

export interface ProjectEnterpriseRole {
  role: string;
  scope: string;
  member_count: number;
  permissions: string[];
}

export interface ProjectEnterpriseNotification {
  event: string;
  channels: string[];
  delivery_policy: string;
  enabled: boolean;
}

export interface ProjectEnterpriseImportExport {
  job_type: string;
  direction: 'import' | 'export' | 'template' | string;
  format: string;
  status: string;
  description: string;
}

export interface ProjectEnterpriseWebhook {
  event: string;
  status: string;
  target: string;
  retry_policy: string;
}

export interface ProjectEnterpriseTemplate {
  name: string;
  description: string;
  includes: string[];
}

export interface ProjectEnterpriseCiGate {
  name: string;
  command: string;
  required: boolean;
  status: string;
}

export interface ProjectEnterpriseAudit {
  policy: string;
  retention_days: number;
  drilldowns: string[];
  export_formats: string[];
}

export interface ProjectEnterpriseControls {
  project_id: string;
  roles: ProjectEnterpriseRole[];
  notifications: ProjectEnterpriseNotification[];
  import_export: ProjectEnterpriseImportExport[];
  webhooks: ProjectEnterpriseWebhook[];
  templates: ProjectEnterpriseTemplate[];
  ci_gates: ProjectEnterpriseCiGate[];
  audit: ProjectEnterpriseAudit;
}

export interface CreateEpicRequest {
  workspace_id?: string;
  project_id: string;
  name: string;
  summary?: string;
  priority?: IssuePriority;
  owner_id?: string;
  start_date?: string;
  target_date?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSprintRequest {
  workspace_id?: string;
  project_id: string;
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
  capacity_points?: number;
}

export interface CreateIssueDependencyRequest {
  workspace_id?: string;
  project_id: string;
  source_issue_id: string;
  target_issue_id: string;
  dependency_type: IssueDependencyType;
  description?: string;
  created_by?: string;
}

export const SPRINT_STATUS_LABELS: Record<SprintStatus, string> = {
  planned: 'Planned',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const ISSUE_DEPENDENCY_TYPE_LABELS: Record<IssueDependencyType, string> = {
  blocks: 'Blocks',
  is_blocked_by: 'Is Blocked By',
  relates_to: 'Relates To',
  duplicates: 'Duplicates',
  parent_child: 'Parent Child',
};
