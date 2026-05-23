/*
```cypher
CREATE
  (f:File {name: "production.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/production", type: "module"}),
  (c1:Class {name: "IssueType", type: "class", language: "typescript"}),
  (c2:Class {name: "IssueStatus", type: "class", language: "typescript"}),
  (c3:Class {name: "IssuePriority", type: "class", language: "typescript"}),
  (c4:Class {name: "ProductionRole", type: "class", language: "typescript"}),
  (c5:Class {name: "ReviewScope", type: "class", language: "typescript"}),
  (c6:Class {name: "Issue", type: "class", language: "typescript"}),
  (c7:Class {name: "IssueSummary", type: "class", language: "typescript"}),
  (c8:Class {name: "IssueComment", type: "class", language: "typescript"}),
  (c9:Class {name: "IssueStatusHistory", type: "class", language: "typescript"}),
  (c10:Class {name: "IssueAssetSummary", type: "class", language: "typescript"}),
  (c11:Class {name: "IssueWorkLog", type: "class", language: "typescript"}),
  (c12:Class {name: "ReviewRound", type: "class", language: "typescript"}),
  (c13:Class {name: "Milestone", type: "class", language: "typescript"}),
  (c14:Class {name: "DeliveryPackage", type: "class", language: "typescript"}),
  (c15:Class {name: "IssueFilters", type: "class", language: "typescript"}),
  (c16:Class {name: "CreateIssueRequest", type: "class", language: "typescript"}),
  (c17:Class {name: "UpdateIssueRequest", type: "class", language: "typescript"}),
  (c18:Class {name: "TransitionIssueRequest", type: "class", language: "typescript"}),
  (c19:Class {name: "CreateIssueCommentRequest", type: "class", language: "typescript"}),
  (c20:Class {name: "CreateIssueWorkLogRequest", type: "class", language: "typescript"}),
  (c21:Class {name: "AttachIssueAssetRequest", type: "class", language: "typescript"}),
  (c22:Class {name: "CreateReviewRequest", type: "class", language: "typescript"}),
  (c23:Class {name: "ApproveIssueRequest", type: "class", language: "typescript"}),
  (c24:Class {name: "RequestRevisionRequest", type: "class", language: "typescript"}),
  (c25:Class {name: "CreateDeliveryPackageRequest", type: "class", language: "typescript"}),
  (c26:Class {name: "LangGraphNode", type: "class", language: "typescript"}),
  (c27:Class {name: "DataLakeFeed", type: "class", language: "typescript"}),
  (c28:Class {name: "AiAutomationRule", type: "class", language: "typescript"}),
  (c29:Class {name: "ManagementIntelligence", type: "class", language: "typescript"}),
  (c30:Class {name: "AiCallStatus", type: "class", language: "typescript", signature: "interface AiCallStatus"}),
  (c31:Class {name: "AiControlChatRequest", type: "class", language: "typescript", signature: "interface AiControlChatRequest"}),
  (c32:Class {name: "AiControlChatResponse", type: "class", language: "typescript", signature: "interface AiControlChatResponse"}),
  (c33:Class {name: "ReplicaActionRequest", type: "class", language: "typescript", signature: "interface ReplicaActionRequest"}),
  (c34:Class {name: "ReplicaActionRecord", type: "class", language: "typescript", signature: "interface ReplicaActionRecord"}),
  (c35:Class {name: "ReplicaActionResponse", type: "class", language: "typescript", signature: "interface ReplicaActionResponse"}),
  (c36:Class {name: "RagSearchRequest", type: "class", language: "typescript", signature: "interface RagSearchRequest"}),
  (c37:Class {name: "RagSearchResponse", type: "class", language: "typescript", signature: "interface RagSearchResponse"}),
  (v1:Variable {name: "ISSUE_STATUSES", type: "variable"}),
  (v2:Variable {name: "ISSUE_STATUS_LABELS", type: "variable"}),
  (v3:Variable {name: "ISSUE_TYPE_LABELS", type: "variable"}),
  (v4:Variable {name: "ISSUE_PRIORITY_LABELS", type: "variable"}),
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
  (m)-[:CONTAINS]->(c36),
  (m)-[:CONTAINS]->(c37),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4);
```
*/

import type { AssetStatus, AssetType } from '@/types/asset';

export type IssueType =
  | 'concept_art'
  | 'character_model'
  | 'environment_model'
  | 'texture'
  | 'rigging'
  | 'animation'
  | 'vfx'
  | 'ui_art'
  | 'shader'
  | 'technical_art'
  | 'delivery_check'
  | 'bug'
  | 'revision_request';

export type IssueStatus =
  | 'backlog'
  | 'brief_ready'
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'internal_review'
  | 'client_review'
  | 'revision_required'
  | 'approved'
  | 'delivered'
  | 'archived';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type ProductionRole =
  | 'admin'
  | 'producer'
  | 'art_director'
  | 'lead_artist'
  | 'artist'
  | 'technical_artist'
  | 'reviewer'
  | 'vendor_manager'
  | 'client_viewer';

export type ReviewScope = 'internal' | 'client';

export type ReviewRoundStatus = 'open' | 'changes_requested' | 'approved' | 'closed';

export type DeliveryPackageStatus = 'draft' | 'submitted' | 'accepted' | 'rejected' | 'archived';

export type AiQaStatus = 'pending' | 'passed' | 'warning' | 'failed';

export type QaSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface Issue {
  id: string;
  issue_key: string;
  workspace_id: string;
  project_id: string;
  brief_id?: string;
  epic_id?: string;
  sprint_id?: string;
  milestone_id?: string;
  vendor_id?: string;
  client_id?: string;
  title: string;
  description?: string;
  issue_type: IssueType;
  asset_type?: AssetType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id?: string;
  reporter_id?: string;
  start_date?: string;
  due_date?: string;
  story_points?: number;
  rank_key?: string;
  revision_count: number;
  qa_status: AiQaStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface IssueSummary {
  id: string;
  issue_key: string;
  project_id: string;
  epic_id?: string;
  sprint_id?: string;
  vendor_id?: string;
  client_id?: string;
  title: string;
  issue_type: IssueType;
  asset_type?: AssetType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id?: string;
  assignee_name?: string;
  start_date?: string;
  due_date?: string;
  story_points?: number;
  rank_key: string;
  revision_count: number;
  qa_status: AiQaStatus;
  asset_count: number;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueComment {
  id: string;
  issue_id: string;
  author_id?: string;
  author_name: string;
  body: string;
  visibility: string;
  created_at: string;
}

export interface IssueStatusHistory {
  id: string;
  issue_id: string;
  from_status?: IssueStatus;
  to_status: IssueStatus;
  actor_id?: string;
  actor: string;
  reason?: string;
  created_at: string;
}

export interface IssueAssetSummary {
  id: string;
  name: string;
  original_filename: string;
  asset_type: AssetType;
  mime_type: string;
  tags: string[];
  file_url: string;
  preview_url?: string;
  file_size: number;
  version: number;
  project_id: string;
  uploader: string;
  status: AssetStatus;
  link_type: string;
  created_at: string;
  updated_at: string;
}

export interface IssueWorkLog {
  id: string;
  issue_id: string;
  author_id?: string;
  author_name: string;
  time_spent_minutes: number;
  started_at: string;
  body?: string;
  created_at: string;
}

export interface ReviewRound {
  id: string;
  issue_id: string;
  scope: ReviewScope;
  round_number: number;
  status: ReviewRoundStatus;
  reviewer_id?: string;
  reviewer_name: string;
  summary?: string;
  created_at: string;
  completed_at?: string;
}

export interface Milestone {
  id: string;
  workspace_id: string;
  project_id: string;
  name: string;
  description?: string;
  due_date?: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryPackage {
  id: string;
  workspace_id: string;
  project_id: string;
  vendor_id?: string;
  client_id?: string;
  name: string;
  status: DeliveryPackageStatus;
  notes?: string;
  submitted_by?: string;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueFilters {
  page?: number;
  page_size?: number;
  q?: string;
  project_id?: string;
  vendor_id?: string;
  client_id?: string;
  assignee_id?: string;
  issue_type?: IssueType | '';
  asset_type?: AssetType | '';
  status?: IssueStatus | '';
  priority?: IssuePriority | '';
  due_before?: string;
}

export interface CreateIssueRequest {
  workspace_id?: string;
  project_id?: string;
  brief_id?: string;
  epic_id?: string;
  sprint_id?: string;
  milestone_id?: string;
  vendor_id?: string;
  client_id?: string;
  title: string;
  description?: string;
  issue_type: IssueType;
  asset_type?: AssetType;
  priority?: IssuePriority;
  assignee_id?: string;
  reporter_id?: string;
  start_date?: string;
  due_date?: string;
  story_points?: number;
  rank_key?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateIssueRequest {
  brief_id?: string;
  epic_id?: string;
  sprint_id?: string;
  milestone_id?: string;
  vendor_id?: string;
  client_id?: string;
  title?: string;
  description?: string;
  issue_type?: IssueType;
  asset_type?: AssetType;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee_id?: string;
  start_date?: string;
  due_date?: string;
  story_points?: number;
  rank_key?: string;
  qa_status?: AiQaStatus;
  metadata?: Record<string, unknown>;
  actor?: string;
}

export interface TransitionIssueRequest {
  status: IssueStatus;
  actor_id?: string;
  actor?: string;
  reason?: string;
}

export interface CreateIssueCommentRequest {
  author_id?: string;
  author_name?: string;
  body: string;
  visibility?: 'internal' | 'vendor' | 'client';
}

export interface CreateIssueWorkLogRequest {
  author_id?: string;
  author_name?: string;
  time_spent_minutes: number;
  started_at?: string;
  body?: string;
}

export interface AttachIssueAssetRequest {
  asset_id: string;
  link_type?: 'reference' | 'submission' | 'dependency';
  actor_id?: string;
  actor?: string;
}

export interface CreateReviewRequest {
  scope: ReviewScope;
  reviewer_id?: string;
  reviewer_name?: string;
  summary?: string;
  comment?: string;
  asset_id?: string;
  annotation?: Record<string, unknown>;
  severity?: QaSeverity;
}

export interface ApproveIssueRequest {
  approver_id?: string;
  approver_name?: string;
  scope?: ReviewScope;
  note?: string;
}

export interface RequestRevisionRequest {
  requester_id?: string;
  requester_name?: string;
  scope?: ReviewScope;
  reason: string;
  annotation?: Record<string, unknown>;
  asset_id?: string;
}

export interface CreateDeliveryPackageRequest {
  workspace_id?: string;
  project_id: string;
  vendor_id?: string;
  client_id?: string;
  name: string;
  notes?: string;
  asset_ids: string[];
  included_by?: string;
}

export interface LangGraphNode {
  name: string;
  state: 'ready' | 'guarded' | 'planned' | string;
  detail: string;
}

export interface DataLakeFeed {
  name: string;
  detail: string;
}

export interface AiAutomationRule {
  name: string;
  detail: string;
  guardrail: string;
}

export interface AiCallStatus {
  configured: boolean;
  used: boolean;
  provider?: string;
  model?: string;
  error?: string;
}

export interface ManagementIntelligence {
  product_surface: string;
  langgraph_nodes: LangGraphNode[];
  data_lake_feeds: DataLakeFeed[];
  automation_rules: AiAutomationRule[];
  ai_status?: AiCallStatus;
}

export interface AiControlChatRequest {
  message: string;
  context?: string;
}

export interface AiControlChatAction {
  label: string;
  action_id: string;
  kind: string;
}

export interface AiControlChatResponse {
  message: string;
  actions: AiControlChatAction[];
  ai_status?: AiCallStatus;
}

export interface ReplicaActionRequest {
  action_id: string;
  title: string;
  app: string;
  target_label: string;
  intent: string;
  writes: string[];
  metadata?: Record<string, unknown>;
}

export interface ReplicaActionRecord {
  vector_id: string;
  collection: string;
  write_scope: 'replica';
  replica_url: string;
  status: string;
  created_at: string;
}

export interface ReplicaActionResponse {
  record: ReplicaActionRecord;
}

export interface RagMemoryMatch {
  id: string;
  score: number;
  operation_type: string;
  app: string;
  entity_type: string;
  entity_id?: string;
  actor: string;
  summary: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at?: string;
}

export interface RagSearchRequest {
  query: string;
  limit?: number;
}

export interface RagSearchResponse {
  qdrant_enabled: boolean;
  collection: string;
  embedding_provider: string;
  matches: RagMemoryMatch[];
}

export const ISSUE_STATUSES: IssueStatus[] = [
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
  'archived',
];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
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

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  concept_art: 'Concept Art',
  character_model: 'Character Model',
  environment_model: 'Environment Model',
  texture: 'Texture',
  rigging: 'Rigging',
  animation: 'Animation',
  vfx: 'VFX',
  ui_art: 'UI Art',
  shader: 'Shader',
  technical_art: 'Technical Art',
  delivery_check: 'Delivery Check',
  bug: 'Bug',
  revision_request: 'Revision Request',
};

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
