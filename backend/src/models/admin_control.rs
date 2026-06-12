/*
```cypher
CREATE
  (f:File {name: "admin_control.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::admin_control", type: "module"}),
  (c1:Class {name: "AdminControlSettings", type: "class", language: "rust", signature: "struct AdminControlSettings"}),
  (c2:Class {name: "UpdateAdminControlSettingsRequest", type: "class", language: "rust", signature: "struct UpdateAdminControlSettingsRequest"}),
  (c3:Class {name: "UpdateAdminUserRoleRequest", type: "class", language: "rust", signature: "struct UpdateAdminUserRoleRequest"}),
  (c4:Class {name: "UpdateAdminUserStatusRequest", type: "class", language: "rust", signature: "struct UpdateAdminUserStatusRequest"}),
  (c5:Class {name: "AdminUsageStats", type: "class", language: "rust", signature: "struct AdminUsageStats"}),
  (c6:Class {name: "AdminAlert", type: "class", language: "rust", signature: "struct AdminAlert"}),
  (c7:Class {name: "AdminRolePermission", type: "class", language: "rust", signature: "struct AdminRolePermission"}),
  (c8:Class {name: "AdminUserSummary", type: "class", language: "rust", signature: "struct AdminUserSummary"}),
  (c9:Class {name: "AdminSecurityPosture", type: "class", language: "rust", signature: "struct AdminSecurityPosture"}),
  (c10:Class {name: "AdminOperationTrace", type: "class", language: "rust", signature: "struct AdminOperationTrace"}),
  (c11:Class {name: "AdminUserPage", type: "class", language: "rust", signature: "struct AdminUserPage"}),
  (c12:Class {name: "AdminOperationTracePage", type: "class", language: "rust", signature: "struct AdminOperationTracePage"}),
  (c13:Class {name: "AdminRiskPolicySettings", type: "class", language: "rust", signature: "struct AdminRiskPolicySettings"}),
  (c14:Class {name: "UpdateAdminRiskPolicyRequest", type: "class", language: "rust", signature: "struct UpdateAdminRiskPolicyRequest"}),
  (c15:Class {name: "AdminAiRiskAnalysisRequest", type: "class", language: "rust", signature: "struct AdminAiRiskAnalysisRequest"}),
  (c16:Class {name: "AdminAiRiskAnalysis", type: "class", language: "rust", signature: "struct AdminAiRiskAnalysis"}),
  (c17:Class {name: "AdminControlSnapshot", type: "class", language: "rust", signature: "struct AdminControlSnapshot"}),
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
  (m)-[:CONTAINS]->(c17);
```
*/

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminControlSettings {
    pub id: String,
    pub session_ttl_seconds: i64,
    pub idle_timeout_seconds: i64,
    pub abnormal_login_threshold: i64,
    pub abnormal_window_minutes: i64,
    pub failed_login_alert_enabled: bool,
    pub rbac_denial_alert_enabled: bool,
    pub updated_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateAdminControlSettingsRequest {
    pub session_ttl_seconds: Option<i64>,
    pub idle_timeout_seconds: Option<i64>,
    pub abnormal_login_threshold: Option<i64>,
    pub abnormal_window_minutes: Option<i64>,
    pub failed_login_alert_enabled: Option<bool>,
    pub rbac_denial_alert_enabled: Option<bool>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateAdminUserRoleRequest {
    pub role: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateAdminUserStatusRequest {
    pub blocked: bool,
    pub reason: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AdminUsersQuery {
    pub q: Option<String>,
    pub status: Option<String>,
    pub role: Option<String>,
    pub risk_level: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AdminOperationTraceQuery {
    pub action: Option<String>,
    pub outcome: Option<String>,
    pub entity_type: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminUsageStats {
    pub total_users: i64,
    pub active_sessions: i64,
    pub expiring_sessions: i64,
    pub revoked_sessions_24h: i64,
    pub active_locks: i64,
    pub auth_failures_window: i64,
    pub rbac_denials_window: i64,
    pub audit_events_24h: i64,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminAlert {
    pub severity: String,
    pub title: String,
    pub detail: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminRolePermission {
    pub role: String,
    pub user_count: i64,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminUserSummary {
    pub id: Uuid,
    pub username: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub role: String,
    pub status: String,
    pub blocked_at: Option<DateTime<Utc>>,
    pub blocked_by: Option<Uuid>,
    pub blocked_reason: Option<String>,
    pub unblocked_at: Option<DateTime<Utc>>,
    pub unblocked_by: Option<Uuid>,
    pub active_sessions: i64,
    pub active_locks: i64,
    pub recent_event_count: i64,
    pub risk_score: i64,
    pub risk_level: String,
    pub last_login_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminSecurityPosture {
    pub blocked_users: i64,
    pub high_risk_users: i64,
    pub active_admin_sessions: i64,
    pub active_user_locks: i64,
    pub recent_admin_actions: i64,
    pub revocable_sessions: i64,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminOperationTrace {
    pub id: i64,
    pub entity_type: String,
    pub entity_id: Uuid,
    pub action: String,
    pub actor_id: Option<Uuid>,
    pub actor: Option<String>,
    pub outcome: Option<String>,
    pub severity: Option<String>,
    pub reason: Option<String>,
    pub path: Option<String>,
    pub summary: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminUserPage {
    pub items: Vec<AdminUserSummary>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
    pub next_offset: Option<i64>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminOperationTracePage {
    pub items: Vec<AdminOperationTrace>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
    pub next_offset: Option<i64>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AdminRiskPolicySettings {
    pub id: String,
    pub session_weight: i64,
    pub lock_weight: i64,
    pub event_weight: i64,
    pub blocked_weight: i64,
    pub auth_failure_weight: i64,
    pub rbac_denial_weight: i64,
    pub high_session_threshold: i64,
    pub high_event_threshold: i64,
    pub ai_analysis_enabled: bool,
    pub langgraph_risk_node: String,
    pub updated_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateAdminRiskPolicyRequest {
    pub session_weight: Option<i64>,
    pub lock_weight: Option<i64>,
    pub event_weight: Option<i64>,
    pub blocked_weight: Option<i64>,
    pub auth_failure_weight: Option<i64>,
    pub rbac_denial_weight: Option<i64>,
    pub high_session_threshold: Option<i64>,
    pub high_event_threshold: Option<i64>,
    pub ai_analysis_enabled: Option<bool>,
    pub langgraph_risk_node: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AdminAiRiskAnalysisRequest {
    pub focus_user_id: Option<Uuid>,
    pub instruction: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminAiCallStatus {
    pub configured: bool,
    pub used: bool,
    pub provider: Option<String>,
    pub model: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminLangGraphNode {
    pub name: String,
    pub state: String,
    pub detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminAiRecommendation {
    pub title: String,
    pub severity: String,
    pub target: String,
    pub action: String,
    pub rationale: String,
    pub requires_human_approval: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminAiRiskAnalysis {
    pub summary: String,
    pub severity: String,
    pub generated_at: DateTime<Utc>,
    pub ai_status: AdminAiCallStatus,
    pub langgraph_nodes: Vec<AdminLangGraphNode>,
    pub recommendations: Vec<AdminAiRecommendation>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AdminControlSnapshot {
    pub settings: AdminControlSettings,
    pub risk_policy: AdminRiskPolicySettings,
    pub usage: AdminUsageStats,
    pub alerts: Vec<AdminAlert>,
    pub security_posture: AdminSecurityPosture,
    pub operation_traces: Vec<AdminOperationTrace>,
    pub operation_traces_page: AdminOperationTracePage,
    pub role_permissions: Vec<AdminRolePermission>,
    pub users: Vec<AdminUserSummary>,
    pub users_page: AdminUserPage,
}
