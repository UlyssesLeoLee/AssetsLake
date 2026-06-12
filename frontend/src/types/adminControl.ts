/*
```cypher
CREATE
  (f:File {name: "adminControl.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/adminControl", type: "module"}),
  (c1:Class {name: "AdminControlSettings", type: "class", language: "typescript", signature: "interface AdminControlSettings"}),
  (c2:Class {name: "UpdateAdminControlSettingsRequest", type: "class", language: "typescript", signature: "interface UpdateAdminControlSettingsRequest"}),
  (c3:Class {name: "AdminUsageStats", type: "class", language: "typescript", signature: "interface AdminUsageStats"}),
  (c4:Class {name: "AdminAlert", type: "class", language: "typescript", signature: "interface AdminAlert"}),
  (c5:Class {name: "AdminRolePermission", type: "class", language: "typescript", signature: "interface AdminRolePermission"}),
  (c6:Class {name: "AdminUserSummary", type: "class", language: "typescript", signature: "interface AdminUserSummary"}),
  (c7:Class {name: "AdminControlSnapshot", type: "class", language: "typescript", signature: "interface AdminControlSnapshot"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7);
```
*/

export interface AdminControlSettings {
  id: string;
  session_ttl_seconds: number;
  idle_timeout_seconds: number;
  abnormal_login_threshold: number;
  abnormal_window_minutes: number;
  failed_login_alert_enabled: boolean;
  rbac_denial_alert_enabled: boolean;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateAdminControlSettingsRequest {
  session_ttl_seconds?: number;
  idle_timeout_seconds?: number;
  abnormal_login_threshold?: number;
  abnormal_window_minutes?: number;
  failed_login_alert_enabled?: boolean;
  rbac_denial_alert_enabled?: boolean;
}

export interface UpdateAdminUserStatusRequest {
  blocked: boolean;
  reason?: string;
}

export interface AdminUsersQuery {
  q?: string;
  status?: string;
  role?: string;
  risk_level?: string;
  limit?: number;
  offset?: number;
}

export interface AdminOperationTraceQuery {
  action?: string;
  outcome?: string;
  entity_type?: string;
  limit?: number;
  offset?: number;
}

export interface AdminUsageStats {
  total_users: number;
  active_sessions: number;
  expiring_sessions: number;
  revoked_sessions_24h: number;
  active_locks: number;
  auth_failures_window: number;
  rbac_denials_window: number;
  audit_events_24h: number;
}

export interface AdminAlert {
  severity: string;
  title: string;
  detail: string;
  created_at: string;
}

export interface AdminRolePermission {
  role: string;
  user_count: number;
  permissions: string[];
}

export interface AdminUserSummary {
  id: string;
  username: string;
  display_name?: string | null;
  email?: string | null;
  role: string;
  status: 'active' | 'blocked' | string;
  blocked_at?: string | null;
  blocked_by?: string | null;
  blocked_reason?: string | null;
  unblocked_at?: string | null;
  unblocked_by?: string | null;
  active_sessions: number;
  active_locks: number;
  recent_event_count: number;
  risk_score: number;
  risk_level: 'normal' | 'watch' | 'high' | 'critical' | string;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSecurityPosture {
  blocked_users: number;
  high_risk_users: number;
  active_admin_sessions: number;
  active_user_locks: number;
  recent_admin_actions: number;
  revocable_sessions: number;
}

export interface AdminOperationTrace {
  id: number;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id?: string | null;
  actor?: string | null;
  outcome?: string | null;
  severity?: string | null;
  reason?: string | null;
  path?: string | null;
  summary: string;
  created_at: string;
}

export interface AdminUserPage {
  items: AdminUserSummary[];
  total: number;
  limit: number;
  offset: number;
  next_offset?: number | null;
}

export interface AdminOperationTracePage {
  items: AdminOperationTrace[];
  total: number;
  limit: number;
  offset: number;
  next_offset?: number | null;
}

export interface AdminRiskPolicySettings {
  id: string;
  session_weight: number;
  lock_weight: number;
  event_weight: number;
  blocked_weight: number;
  auth_failure_weight: number;
  rbac_denial_weight: number;
  high_session_threshold: number;
  high_event_threshold: number;
  ai_analysis_enabled: boolean;
  langgraph_risk_node: string;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateAdminRiskPolicyRequest {
  session_weight?: number;
  lock_weight?: number;
  event_weight?: number;
  blocked_weight?: number;
  auth_failure_weight?: number;
  rbac_denial_weight?: number;
  high_session_threshold?: number;
  high_event_threshold?: number;
  ai_analysis_enabled?: boolean;
  langgraph_risk_node?: string;
}

export interface AdminAiRiskAnalysisRequest {
  focus_user_id?: string;
  instruction?: string;
}

export interface AdminAiCallStatus {
  configured: boolean;
  used: boolean;
  provider?: string | null;
  model?: string | null;
  error?: string | null;
}

export interface AdminLangGraphNode {
  name: string;
  state: string;
  detail: string;
}

export interface AdminAiRecommendation {
  title: string;
  severity: string;
  target: string;
  action: string;
  rationale: string;
  requires_human_approval: boolean;
}

export interface AdminAiRiskAnalysis {
  summary: string;
  severity: string;
  generated_at: string;
  ai_status: AdminAiCallStatus;
  langgraph_nodes: AdminLangGraphNode[];
  recommendations: AdminAiRecommendation[];
}

export interface AdminControlSnapshot {
  settings: AdminControlSettings;
  risk_policy: AdminRiskPolicySettings;
  usage: AdminUsageStats;
  alerts: AdminAlert[];
  security_posture: AdminSecurityPosture;
  operation_traces: AdminOperationTrace[];
  operation_traces_page: AdminOperationTracePage;
  role_permissions: AdminRolePermission[];
  users: AdminUserSummary[];
  users_page: AdminUserPage;
}
