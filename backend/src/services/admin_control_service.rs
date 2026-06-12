/*
```cypher
CREATE
  (f:File {name: "admin_control_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::admin_control_service", type: "module"}),
  (c1:Class {name: "AdminControlService", type: "class", language: "rust", signature: "struct AdminControlService"}),
  (fn1:Function {name: "AdminControlService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "AdminControlService::snapshot", type: "function", language: "rust", signature: "pub async fn snapshot(&self) -> Result<AdminControlSnapshot, AppError>"}),
  (fn3:Function {name: "AdminControlService::update_settings", type: "function", language: "rust", signature: "pub async fn update_settings(&self, req: UpdateAdminControlSettingsRequest, actor: &SessionContext) -> Result<AdminControlSettings, AppError>"}),
  (fn4:Function {name: "AdminControlService::update_user_role", type: "function", language: "rust", signature: "pub async fn update_user_role(&self, user_id: Uuid, req: UpdateAdminUserRoleRequest) -> Result<AdminUserSummary, AppError>"}),
  (fn5:Function {name: "AdminControlService::settings", type: "function", language: "rust", signature: "async fn settings(&self) -> Result<AdminControlSettings, AppError>"}),
  (fn6:Function {name: "AdminControlService::ensure_default_settings", type: "function", language: "rust", signature: "async fn ensure_default_settings(&self) -> Result<(), AppError>"}),
  (fn7:Function {name: "AdminControlService::usage_stats", type: "function", language: "rust", signature: "async fn usage_stats(&self, settings: &AdminControlSettings) -> Result<AdminUsageStats, AppError>"}),
  (fn8:Function {name: "AdminControlService::users", type: "function", language: "rust", signature: "async fn users(&self) -> Result<Vec<AdminUserSummary>, AppError>"}),
  (fn9:Function {name: "AdminControlService::user_summary", type: "function", language: "rust", signature: "async fn user_summary(&self, user_id: Uuid) -> Result<AdminUserSummary, AppError>"}),
  (fn11:Function {name: "configured_session_ttl_seconds", type: "function", language: "rust", signature: "pub async fn configured_session_ttl_seconds(pool: &PgPool) -> i64"}),
  (fn13:Function {name: "env_i64", type: "function", language: "rust", signature: "fn env_i64(name: &str, default_value: i64) -> i64"}),
  (fn14:Function {name: "clamp_session_ttl_seconds", type: "function", language: "rust", signature: "fn clamp_session_ttl_seconds(value: i64) -> i64"}),
  (fn16:Function {name: "validate_settings", type: "function", language: "rust", signature: "fn validate_settings(session_ttl_seconds: i64, idle_timeout_seconds: i64, abnormal_login_threshold: i64, abnormal_window_minutes: i64) -> Result<(), AppError>"}),
  (fn17:Function {name: "normalize_role", type: "function", language: "rust", signature: "fn normalize_role(role: &str) -> String"}),
  (fn18:Function {name: "ensure_allowed_role", type: "function", language: "rust", signature: "fn ensure_allowed_role(role: &str) -> Result<(), AppError>"}),
  (fn19:Function {name: "ensure_not_last_admin", type: "function", language: "rust", signature: "async fn ensure_not_last_admin(pool: &PgPool, user_id: Uuid, next_role: &str) -> Result<(), AppError>"}),
  (fn20:Function {name: "role_permissions", type: "function", language: "rust", signature: "fn role_permissions(users: &[AdminUserSummary]) -> Vec<AdminRolePermission>"}),
  (fn21:Function {name: "permission_catalog", type: "function", language: "rust", signature: "fn permission_catalog(role: &str) -> Vec<String>"}),
  (fn22:Function {name: "build_alerts", type: "function", language: "rust", signature: "fn build_alerts(settings: &AdminControlSettings, usage: &AdminUsageStats) -> Vec<AdminAlert>"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "settings", type: "variable"}),
  (v3:Variable {name: "users", type: "variable"}),
  (v4:Variable {name: "usage", type: "variable"}),
  (v5:Variable {name: "actor", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn7),
  (fn2)-[:CALLS]->(fn8),
  (fn2)-[:CALLS]->(fn20),
  (fn2)-[:CALLS]->(fn22),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn16),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn17),
  (fn4)-[:CALLS]->(fn18),
  (fn4)-[:CALLS]->(fn19),
  (fn4)-[:CALLS]->(fn9),
  (fn5)-[:CALLS]->(fn6),
  (fn11)-[:CALLS]->(fn13),
  (fn11)-[:CALLS]->(fn14),
  (fn19)-[:CALLS]->(fn17),
  (fn20)-[:CALLS]->(fn17),
  (fn20)-[:CALLS]->(fn21);
```
*/

use std::collections::HashMap;

use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{
        admin_control::{
            AdminAiCallStatus, AdminAiRecommendation, AdminAiRiskAnalysis,
            AdminAiRiskAnalysisRequest, AdminAlert, AdminControlSettings, AdminControlSnapshot,
            AdminLangGraphNode, AdminOperationTrace, AdminOperationTracePage,
            AdminOperationTraceQuery, AdminRiskPolicySettings, AdminRolePermission,
            AdminSecurityPosture, AdminUsageStats, AdminUserPage, AdminUserSummary,
            AdminUsersQuery, UpdateAdminControlSettingsRequest, UpdateAdminRiskPolicyRequest,
            UpdateAdminUserRoleRequest, UpdateAdminUserStatusRequest,
        },
        auth::SessionContext,
    },
    services::ai_provider_service::{AiProviderConfig, AiProviderService},
};

pub const DEFAULT_SESSION_TTL_SECONDS: i64 = 43_200;
pub const DEFAULT_IDLE_TIMEOUT_SECONDS: i64 = 3_600;
const MIN_SESSION_TTL_SECONDS: i64 = 300;
const MAX_SESSION_TTL_SECONDS: i64 = 2_592_000;
const MIN_IDLE_TIMEOUT_SECONDS: i64 = 60;
const MIN_ABNORMAL_LOGIN_THRESHOLD: i64 = 1;
const MAX_ABNORMAL_LOGIN_THRESHOLD: i64 = 10_000;
const MIN_ABNORMAL_WINDOW_MINUTES: i64 = 1;
const MAX_ABNORMAL_WINDOW_MINUTES: i64 = 1_440;
const DEFAULT_USER_PAGE_LIMIT: i64 = 25;
const MAX_USER_PAGE_LIMIT: i64 = 100;
const DEFAULT_TRACE_PAGE_LIMIT: i64 = 50;
const MAX_TRACE_PAGE_LIMIT: i64 = 200;
const MAX_TRACE_EXPORT_LIMIT: i64 = 1_000;
const ADMIN_AI_RISK_JSON_MAX_TOKENS: u16 = 1_200;

#[derive(Debug, Deserialize)]
struct AdminAiRiskAnalysisPayload {
    summary: String,
    severity: String,
    langgraph_nodes: Vec<AdminLangGraphNode>,
    recommendations: Vec<AdminAiRecommendation>,
}

#[derive(Debug, Serialize)]
struct AdminRiskAnalysisPromptContext<'a> {
    usage: &'a AdminUsageStats,
    security_posture: &'a AdminSecurityPosture,
    risk_policy: &'a AdminRiskPolicySettings,
    users: &'a [AdminUserSummary],
    operation_traces: &'a [AdminOperationTrace],
    instruction: Option<&'a str>,
    focus_user_id: Option<Uuid>,
}

#[derive(Clone)]
pub struct AdminControlService {
    pool: PgPool,
}

impl AdminControlService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn snapshot(&self) -> Result<AdminControlSnapshot, AppError> {
        let settings = self.settings().await?;
        let risk_policy = self.risk_policy().await?;
        let usage = self.usage_stats(&settings).await?;
        let users_page = self
            .users_page(AdminUsersQuery {
                q: None,
                status: None,
                role: None,
                risk_level: None,
                limit: Some(DEFAULT_USER_PAGE_LIMIT),
                offset: Some(0),
            })
            .await?;
        let users = users_page.items.clone();
        let security_posture = self.security_posture(&users).await?;
        let operation_traces_page = self
            .operation_traces_page(AdminOperationTraceQuery {
                action: None,
                outcome: None,
                entity_type: None,
                limit: Some(DEFAULT_TRACE_PAGE_LIMIT),
                offset: Some(0),
            })
            .await?;
        let operation_traces = operation_traces_page.items.clone();
        let alerts = build_alerts(&settings, &usage, &security_posture);
        let role_permissions = role_permissions(&users);

        Ok(AdminControlSnapshot {
            settings,
            risk_policy,
            usage,
            alerts,
            security_posture,
            operation_traces,
            operation_traces_page,
            role_permissions,
            users,
            users_page,
        })
    }

    pub async fn update_settings(
        &self,
        req: UpdateAdminControlSettingsRequest,
        actor: &SessionContext,
    ) -> Result<AdminControlSettings, AppError> {
        let current = self.settings().await?;
        let session_ttl_seconds = req
            .session_ttl_seconds
            .unwrap_or(current.session_ttl_seconds);
        let idle_timeout_seconds = req
            .idle_timeout_seconds
            .unwrap_or(current.idle_timeout_seconds);
        let abnormal_login_threshold = req
            .abnormal_login_threshold
            .unwrap_or(current.abnormal_login_threshold);
        let abnormal_window_minutes = req
            .abnormal_window_minutes
            .unwrap_or(current.abnormal_window_minutes);

        validate_settings(
            session_ttl_seconds,
            idle_timeout_seconds,
            abnormal_login_threshold,
            abnormal_window_minutes,
        )?;

        let settings = sqlx::query_as::<_, AdminControlSettings>(
            r#"
            UPDATE admin_control_settings
            SET session_ttl_seconds = $1,
                idle_timeout_seconds = $2,
                abnormal_login_threshold = $3,
                abnormal_window_minutes = $4,
                failed_login_alert_enabled = $5,
                rbac_denial_alert_enabled = $6,
                updated_by = $7,
                updated_at = NOW()
            WHERE id = 'default'
            RETURNING id, session_ttl_seconds, idle_timeout_seconds, abnormal_login_threshold,
                      abnormal_window_minutes, failed_login_alert_enabled, rbac_denial_alert_enabled,
                      updated_by, created_at, updated_at
            "#,
        )
        .bind(session_ttl_seconds)
        .bind(idle_timeout_seconds)
        .bind(abnormal_login_threshold)
        .bind(abnormal_window_minutes)
        .bind(req.failed_login_alert_enabled.unwrap_or(current.failed_login_alert_enabled))
        .bind(req.rbac_denial_alert_enabled.unwrap_or(current.rbac_denial_alert_enabled))
        .bind(actor.user.id)
        .fetch_one(&self.pool)
        .await?;

        Ok(settings)
    }

    pub async fn update_user_role(
        &self,
        user_id: Uuid,
        req: UpdateAdminUserRoleRequest,
    ) -> Result<AdminUserSummary, AppError> {
        let role = normalize_role(&req.role);
        ensure_allowed_role(&role)?;
        ensure_not_last_admin(&self.pool, user_id, &role).await?;

        let result = sqlx::query(
            r#"
            UPDATE users
            SET role = $1, updated_at = NOW()
            WHERE id = $2
              AND deleted_at IS NULL
              AND COALESCE(user_status, 'active') = 'active'
            "#,
        )
        .bind(&role)
        .bind(user_id)
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::not_found("User not found"));
        }

        self.user_summary(user_id).await
    }

    pub async fn update_user_status(
        &self,
        user_id: Uuid,
        req: UpdateAdminUserStatusRequest,
        actor: &SessionContext,
    ) -> Result<AdminUserSummary, AppError> {
        let target_role = sqlx::query_scalar::<_, String>("SELECT role FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or_else(|| AppError::not_found("User not found"))?;

        if req.blocked && user_id == actor.user.id {
            return Err(AppError::validation(
                "Administrators cannot block their own active session",
            ));
        }

        if req.blocked && normalize_role(&target_role) == "admin" {
            ensure_not_last_admin(&self.pool, user_id, "blocked").await?;
        }

        let reason = req
            .reason
            .as_deref()
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(ToOwned::to_owned);

        if req.blocked && reason.is_none() {
            return Err(AppError::validation("Block reason is required"));
        }

        let mut tx = self.pool.begin().await?;
        if req.blocked {
            let result = sqlx::query(
                r#"
                UPDATE users
                SET user_status = 'blocked',
                    blocked_at = COALESCE(blocked_at, NOW()),
                    blocked_by = $2,
                    blocked_reason = $3,
                    unblocked_at = NULL,
                    unblocked_by = NULL,
                    updated_at = NOW()
                WHERE id = $1
                "#,
            )
            .bind(user_id)
            .bind(actor.user.id)
            .bind(reason.as_deref())
            .execute(&mut *tx)
            .await?;

            if result.rows_affected() == 0 {
                return Err(AppError::not_found("User not found"));
            }

            sqlx::query(
                r#"
                UPDATE user_sessions
                SET revoked_at = COALESCE(revoked_at, NOW()), updated_at = NOW()
                WHERE user_id = $1 AND revoked_at IS NULL
                "#,
            )
            .bind(user_id)
            .execute(&mut *tx)
            .await?;

            sqlx::query(
                r#"
                UPDATE resource_locks
                SET released_at = COALESCE(released_at, NOW()), updated_at = NOW()
                WHERE holder_user_id = $1 AND released_at IS NULL
                "#,
            )
            .bind(user_id)
            .execute(&mut *tx)
            .await?;
        } else {
            let result = sqlx::query(
                r#"
                UPDATE users
                SET user_status = 'active',
                    deleted_at = NULL,
                    unblocked_at = NOW(),
                    unblocked_by = $2,
                    updated_at = NOW()
                WHERE id = $1
                "#,
            )
            .bind(user_id)
            .bind(actor.user.id)
            .execute(&mut *tx)
            .await?;

            if result.rows_affected() == 0 {
                return Err(AppError::not_found("User not found"));
            }
        }
        tx.commit().await?;

        tracing::info!(
            target_user_id = %user_id,
            actor_user_id = %actor.user.id,
            blocked = req.blocked,
            reason = reason.as_deref().unwrap_or(""),
            "Admin user status updated"
        );

        self.user_summary(user_id).await
    }

    async fn settings(&self) -> Result<AdminControlSettings, AppError> {
        self.ensure_default_settings().await?;
        let settings = sqlx::query_as::<_, AdminControlSettings>(
            r#"
            SELECT id, session_ttl_seconds, idle_timeout_seconds, abnormal_login_threshold,
                   abnormal_window_minutes, failed_login_alert_enabled, rbac_denial_alert_enabled,
                   updated_by, created_at, updated_at
            FROM admin_control_settings
            WHERE id = 'default'
            "#,
        )
        .fetch_one(&self.pool)
        .await?;
        Ok(settings)
    }

    async fn ensure_default_settings(&self) -> Result<(), AppError> {
        sqlx::query("INSERT INTO admin_control_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING")
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn risk_policy(&self) -> Result<AdminRiskPolicySettings, AppError> {
        self.ensure_default_risk_policy().await?;
        let policy = sqlx::query_as::<_, AdminRiskPolicySettings>(
            r#"
            SELECT id, session_weight, lock_weight, event_weight, blocked_weight,
                   auth_failure_weight, rbac_denial_weight, high_session_threshold,
                   high_event_threshold, ai_analysis_enabled, langgraph_risk_node,
                   updated_by, created_at, updated_at
            FROM admin_risk_policy_settings
            WHERE id = 'default'
            "#,
        )
        .fetch_one(&self.pool)
        .await?;
        Ok(policy)
    }

    pub async fn update_risk_policy(
        &self,
        req: UpdateAdminRiskPolicyRequest,
        actor: &SessionContext,
    ) -> Result<AdminRiskPolicySettings, AppError> {
        let current = self.risk_policy().await?;
        let session_weight = req.session_weight.unwrap_or(current.session_weight);
        let lock_weight = req.lock_weight.unwrap_or(current.lock_weight);
        let event_weight = req.event_weight.unwrap_or(current.event_weight);
        let blocked_weight = req.blocked_weight.unwrap_or(current.blocked_weight);
        let auth_failure_weight = req
            .auth_failure_weight
            .unwrap_or(current.auth_failure_weight);
        let rbac_denial_weight = req.rbac_denial_weight.unwrap_or(current.rbac_denial_weight);
        let high_session_threshold = req
            .high_session_threshold
            .unwrap_or(current.high_session_threshold);
        let high_event_threshold = req
            .high_event_threshold
            .unwrap_or(current.high_event_threshold);
        let langgraph_risk_node = req
            .langgraph_risk_node
            .unwrap_or(current.langgraph_risk_node)
            .trim()
            .to_string();

        validate_risk_policy(
            session_weight,
            lock_weight,
            event_weight,
            blocked_weight,
            auth_failure_weight,
            rbac_denial_weight,
            high_session_threshold,
            high_event_threshold,
            &langgraph_risk_node,
        )?;

        let policy = sqlx::query_as::<_, AdminRiskPolicySettings>(
            r#"
            UPDATE admin_risk_policy_settings
            SET session_weight = $1,
                lock_weight = $2,
                event_weight = $3,
                blocked_weight = $4,
                auth_failure_weight = $5,
                rbac_denial_weight = $6,
                high_session_threshold = $7,
                high_event_threshold = $8,
                ai_analysis_enabled = $9,
                langgraph_risk_node = $10,
                updated_by = $11,
                updated_at = NOW()
            WHERE id = 'default'
            RETURNING id, session_weight, lock_weight, event_weight, blocked_weight,
                      auth_failure_weight, rbac_denial_weight, high_session_threshold,
                      high_event_threshold, ai_analysis_enabled, langgraph_risk_node,
                      updated_by, created_at, updated_at
            "#,
        )
        .bind(session_weight)
        .bind(lock_weight)
        .bind(event_weight)
        .bind(blocked_weight)
        .bind(auth_failure_weight)
        .bind(rbac_denial_weight)
        .bind(high_session_threshold)
        .bind(high_event_threshold)
        .bind(
            req.ai_analysis_enabled
                .unwrap_or(current.ai_analysis_enabled),
        )
        .bind(langgraph_risk_node)
        .bind(actor.user.id)
        .fetch_one(&self.pool)
        .await?;

        Ok(policy)
    }

    async fn ensure_default_risk_policy(&self) -> Result<(), AppError> {
        sqlx::query(
            "INSERT INTO admin_risk_policy_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING",
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn usage_stats(
        &self,
        settings: &AdminControlSettings,
    ) -> Result<AdminUsageStats, AppError> {
        let stats = sqlx::query_as::<_, AdminUsageStats>(
            r#"
            SELECT
                (SELECT COUNT(*)::BIGINT FROM users WHERE deleted_at IS NULL AND COALESCE(user_status, 'active') = 'active') AS total_users,
                (SELECT COUNT(*)::BIGINT FROM user_sessions WHERE revoked_at IS NULL AND expires_at > NOW()) AS active_sessions,
                (SELECT COUNT(*)::BIGINT FROM user_sessions WHERE revoked_at IS NULL AND expires_at > NOW() AND expires_at <= NOW() + INTERVAL '30 minutes') AS expiring_sessions,
                (SELECT COUNT(*)::BIGINT FROM user_sessions WHERE revoked_at IS NOT NULL AND revoked_at >= NOW() - INTERVAL '24 hours') AS revoked_sessions_24h,
                (SELECT COUNT(*)::BIGINT FROM resource_locks WHERE released_at IS NULL AND expires_at > NOW()) AS active_locks,
                (SELECT COUNT(*)::BIGINT FROM audit_log WHERE action = 'auth_failed' AND created_at >= NOW() - make_interval(mins => $1::INT)) AS auth_failures_window,
                (SELECT COUNT(*)::BIGINT FROM audit_log WHERE action = 'rbac_denied' AND created_at >= NOW() - make_interval(mins => $1::INT)) AS rbac_denials_window,
                (SELECT COUNT(*)::BIGINT FROM audit_log WHERE created_at >= NOW() - INTERVAL '24 hours') AS audit_events_24h
            "#,
        )
        .bind(settings.abnormal_window_minutes as i32)
        .fetch_one(&self.pool)
        .await?;
        Ok(stats)
    }

    pub async fn users_page(&self, query: AdminUsersQuery) -> Result<AdminUserPage, AppError> {
        let risk_policy = self.risk_policy().await?;
        let q = normalize_optional_filter(query.q);
        let status = normalize_optional_filter(query.status);
        let role = normalize_optional_filter(query.role).map(|value| normalize_role(&value));
        let risk_level = normalize_optional_filter(query.risk_level);
        let limit = query
            .limit
            .unwrap_or(DEFAULT_USER_PAGE_LIMIT)
            .clamp(1, MAX_USER_PAGE_LIMIT);
        let offset = query.offset.unwrap_or(0).max(0);

        let users = sqlx::query_as::<_, AdminUserSummary>(
            r#"
            WITH user_signals AS (
                SELECT
                    u.id,
                    u.username,
                    u.display_name,
                    u.email,
                    u.role,
                    CASE
                        WHEN COALESCE(u.user_status, CASE WHEN u.deleted_at IS NULL THEN 'active' ELSE 'blocked' END) = 'blocked'
                            THEN 'blocked'
                        ELSE 'active'
                    END AS status,
                    COALESCE(u.blocked_at, CASE WHEN u.deleted_at IS NOT NULL THEN u.deleted_at ELSE NULL END) AS blocked_at,
                    u.blocked_by,
                    u.blocked_reason,
                    u.unblocked_at,
                    u.unblocked_by,
                    COUNT(DISTINCT s.id)::BIGINT AS active_sessions,
                    COUNT(DISTINCT rl.id)::BIGINT AS active_locks,
                    COUNT(DISTINCT al.id)::BIGINT AS recent_event_count,
                    COUNT(DISTINCT CASE WHEN al.action = 'auth_failed' THEN al.id END)::BIGINT AS auth_failure_count,
                    COUNT(DISTINCT CASE WHEN al.action = 'rbac_denied' THEN al.id END)::BIGINT AS rbac_denial_count,
                    u.last_login_at,
                    u.created_at,
                    u.updated_at
                FROM users u
                LEFT JOIN user_sessions s ON s.user_id = u.id
                    AND s.revoked_at IS NULL
                    AND s.expires_at > NOW()
                LEFT JOIN resource_locks rl ON rl.holder_user_id = u.id
                    AND rl.released_at IS NULL
                    AND rl.expires_at > NOW()
                LEFT JOIN audit_log al ON (al.actor_id = u.id OR al.entity_id = u.id)
                    AND al.created_at >= NOW() - INTERVAL '24 hours'
                WHERE u.deleted_at IS NULL
                   OR COALESCE(u.user_status, 'active') = 'blocked'
                GROUP BY u.id, u.username, u.display_name, u.email, u.role, u.user_status,
                         u.deleted_at, u.blocked_at, u.blocked_by, u.blocked_reason,
                         u.unblocked_at, u.unblocked_by, u.last_login_at, u.created_at, u.updated_at
            ),
            scored AS (
                SELECT
                    id,
                    username,
                    display_name,
                    email,
                    role,
                    status,
                    blocked_at,
                    blocked_by,
                    blocked_reason,
                    unblocked_at,
                    unblocked_by,
                    active_sessions,
                    active_locks,
                    recent_event_count,
                    (
                        CASE WHEN status = 'blocked' THEN $1::BIGINT ELSE 0::BIGINT END
                        + LEAST(active_sessions * $2::BIGINT, 80::BIGINT)
                        + LEAST(active_locks * $3::BIGINT, 60::BIGINT)
                        + LEAST(recent_event_count * $4::BIGINT, 120::BIGINT)
                        + auth_failure_count * $5::BIGINT
                        + rbac_denial_count * $6::BIGINT
                    )::BIGINT AS risk_score,
                    CASE
                        WHEN status = 'blocked' THEN 'critical'
                        WHEN active_sessions >= $7::BIGINT OR recent_event_count >= $8::BIGINT THEN 'high'
                        WHEN active_sessions >= 2 OR active_locks > 0 OR recent_event_count >= 8 THEN 'watch'
                        ELSE 'normal'
                    END AS risk_level,
                    last_login_at,
                    created_at,
                    updated_at
                FROM user_signals
            )
            SELECT
                id, username, display_name, email, role, status, blocked_at, blocked_by,
                blocked_reason, unblocked_at, unblocked_by, active_sessions, active_locks,
                recent_event_count, risk_score, risk_level, last_login_at, created_at, updated_at
            FROM scored
            WHERE ($9::text IS NULL OR username ILIKE '%' || $9 || '%' OR COALESCE(display_name, '') ILIKE '%' || $9 || '%' OR COALESCE(email, '') ILIKE '%' || $9 || '%')
              AND ($10::text IS NULL OR status = $10)
              AND ($11::text IS NULL OR role = $11)
              AND ($12::text IS NULL OR risk_level = $12)
            ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END,
                     CASE WHEN status = 'blocked' THEN 0 ELSE 1 END,
                     risk_score DESC,
                     username
            LIMIT $13 OFFSET $14
            "#,
        )
        .bind(risk_policy.blocked_weight)
        .bind(risk_policy.session_weight)
        .bind(risk_policy.lock_weight)
        .bind(risk_policy.event_weight)
        .bind(risk_policy.auth_failure_weight)
        .bind(risk_policy.rbac_denial_weight)
        .bind(risk_policy.high_session_threshold)
        .bind(risk_policy.high_event_threshold)
        .bind(q.as_deref())
        .bind(status.as_deref())
        .bind(role.as_deref())
        .bind(risk_level.as_deref())
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        let total = sqlx::query_scalar::<_, i64>(
            r#"
            WITH user_signals AS (
                SELECT
                    u.id,
                    u.username,
                    u.display_name,
                    u.email,
                    u.role,
                    CASE
                        WHEN COALESCE(u.user_status, CASE WHEN u.deleted_at IS NULL THEN 'active' ELSE 'blocked' END) = 'blocked'
                            THEN 'blocked'
                        ELSE 'active'
                    END AS status,
                    COUNT(DISTINCT s.id)::BIGINT AS active_sessions,
                    COUNT(DISTINCT rl.id)::BIGINT AS active_locks,
                    COUNT(DISTINCT al.id)::BIGINT AS recent_event_count
                FROM users u
                LEFT JOIN user_sessions s ON s.user_id = u.id
                    AND s.revoked_at IS NULL
                    AND s.expires_at > NOW()
                LEFT JOIN resource_locks rl ON rl.holder_user_id = u.id
                    AND rl.released_at IS NULL
                    AND rl.expires_at > NOW()
                LEFT JOIN audit_log al ON (al.actor_id = u.id OR al.entity_id = u.id)
                    AND al.created_at >= NOW() - INTERVAL '24 hours'
                WHERE u.deleted_at IS NULL
                   OR COALESCE(u.user_status, 'active') = 'blocked'
                GROUP BY u.id, u.username, u.display_name, u.email, u.role, u.user_status, u.deleted_at
            ),
            scored AS (
                SELECT
                    id,
                    username,
                    display_name,
                    email,
                    role,
                    status,
                    CASE
                        WHEN status = 'blocked' THEN 'critical'
                        WHEN active_sessions >= $1::BIGINT OR recent_event_count >= $2::BIGINT THEN 'high'
                        WHEN active_sessions >= 2 OR active_locks > 0 OR recent_event_count >= 8 THEN 'watch'
                        ELSE 'normal'
                    END AS risk_level
                FROM user_signals
            )
            SELECT COUNT(*)::BIGINT
            FROM scored
            WHERE ($3::text IS NULL OR username ILIKE '%' || $3 || '%' OR COALESCE(display_name, '') ILIKE '%' || $3 || '%' OR COALESCE(email, '') ILIKE '%' || $3 || '%')
              AND ($4::text IS NULL OR status = $4)
              AND ($5::text IS NULL OR role = $5)
              AND ($6::text IS NULL OR risk_level = $6)
            "#,
        )
        .bind(risk_policy.high_session_threshold)
        .bind(risk_policy.high_event_threshold)
        .bind(q.as_deref())
        .bind(status.as_deref())
        .bind(role.as_deref())
        .bind(risk_level.as_deref())
        .fetch_one(&self.pool)
        .await?;

        Ok(AdminUserPage {
            next_offset: (offset + (users.len() as i64) < total).then_some(offset + limit),
            items: users,
            total,
            limit,
            offset,
        })
    }

    async fn user_summary(&self, user_id: Uuid) -> Result<AdminUserSummary, AppError> {
        let risk_policy = self.risk_policy().await?;
        let user = sqlx::query_as::<_, AdminUserSummary>(
            r#"
            WITH user_signals AS (
                SELECT
                    u.id,
                    u.username,
                    u.display_name,
                    u.email,
                    u.role,
                    CASE
                        WHEN COALESCE(u.user_status, CASE WHEN u.deleted_at IS NULL THEN 'active' ELSE 'blocked' END) = 'blocked'
                            THEN 'blocked'
                        ELSE 'active'
                    END AS status,
                    COALESCE(u.blocked_at, CASE WHEN u.deleted_at IS NOT NULL THEN u.deleted_at ELSE NULL END) AS blocked_at,
                    u.blocked_by,
                    u.blocked_reason,
                    u.unblocked_at,
                    u.unblocked_by,
                    COUNT(DISTINCT s.id)::BIGINT AS active_sessions,
                    COUNT(DISTINCT rl.id)::BIGINT AS active_locks,
                    COUNT(DISTINCT al.id)::BIGINT AS recent_event_count,
                    COUNT(DISTINCT CASE WHEN al.action = 'auth_failed' THEN al.id END)::BIGINT AS auth_failure_count,
                    COUNT(DISTINCT CASE WHEN al.action = 'rbac_denied' THEN al.id END)::BIGINT AS rbac_denial_count,
                    u.last_login_at,
                    u.created_at,
                    u.updated_at
                FROM users u
                LEFT JOIN user_sessions s ON s.user_id = u.id
                    AND s.revoked_at IS NULL
                    AND s.expires_at > NOW()
                LEFT JOIN resource_locks rl ON rl.holder_user_id = u.id
                    AND rl.released_at IS NULL
                    AND rl.expires_at > NOW()
                LEFT JOIN audit_log al ON (al.actor_id = u.id OR al.entity_id = u.id)
                    AND al.created_at >= NOW() - INTERVAL '24 hours'
                WHERE u.id = $1
                GROUP BY u.id, u.username, u.display_name, u.email, u.role, u.user_status,
                         u.deleted_at, u.blocked_at, u.blocked_by, u.blocked_reason,
                         u.unblocked_at, u.unblocked_by, u.last_login_at, u.created_at, u.updated_at
            )
            SELECT
                id,
                username,
                display_name,
                email,
                role,
                status,
                blocked_at,
                blocked_by,
                blocked_reason,
                unblocked_at,
                unblocked_by,
                active_sessions,
                active_locks,
                recent_event_count,
                (
                    CASE WHEN status = 'blocked' THEN $2::BIGINT ELSE 0::BIGINT END
                    + LEAST(active_sessions * $3::BIGINT, 80::BIGINT)
                    + LEAST(active_locks * $4::BIGINT, 60::BIGINT)
                    + LEAST(recent_event_count * $5::BIGINT, 120::BIGINT)
                    + auth_failure_count * $6::BIGINT
                    + rbac_denial_count * $7::BIGINT
                )::BIGINT AS risk_score,
                CASE
                    WHEN status = 'blocked' THEN 'critical'
                    WHEN active_sessions >= $8::BIGINT OR recent_event_count >= $9::BIGINT THEN 'high'
                    WHEN active_sessions >= 2 OR active_locks > 0 OR recent_event_count >= 8 THEN 'watch'
                    ELSE 'normal'
                END AS risk_level,
                last_login_at,
                created_at,
                updated_at
            FROM user_signals
            "#,
        )
        .bind(user_id)
        .bind(risk_policy.blocked_weight)
        .bind(risk_policy.session_weight)
        .bind(risk_policy.lock_weight)
        .bind(risk_policy.event_weight)
        .bind(risk_policy.auth_failure_weight)
        .bind(risk_policy.rbac_denial_weight)
        .bind(risk_policy.high_session_threshold)
        .bind(risk_policy.high_event_threshold)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::not_found("User not found"))?;
        Ok(user)
    }

    async fn security_posture(
        &self,
        users: &[AdminUserSummary],
    ) -> Result<AdminSecurityPosture, AppError> {
        let high_risk_users = users
            .iter()
            .filter(|user| matches!(user.risk_level.as_str(), "high" | "critical"))
            .count() as i64;

        let posture = sqlx::query_as::<_, AdminSecurityPosture>(
            r#"
            SELECT
                (SELECT COUNT(*)::BIGINT FROM users WHERE COALESCE(user_status, 'active') = 'blocked') AS blocked_users,
                $1::BIGINT AS high_risk_users,
                (
                    SELECT COUNT(*)::BIGINT
                    FROM user_sessions s
                    JOIN users u ON u.id = s.user_id
                    WHERE u.role = 'admin'
                      AND u.deleted_at IS NULL
                      AND COALESCE(u.user_status, 'active') = 'active'
                      AND s.revoked_at IS NULL
                      AND s.expires_at > NOW()
                ) AS active_admin_sessions,
                (
                    SELECT COUNT(*)::BIGINT
                    FROM resource_locks
                    WHERE released_at IS NULL
                      AND expires_at > NOW()
                ) AS active_user_locks,
                (
                    SELECT COUNT(*)::BIGINT
                    FROM audit_log
                    WHERE action LIKE 'admin_%'
                      AND created_at >= NOW() - INTERVAL '24 hours'
                ) AS recent_admin_actions,
                (
                    SELECT COUNT(*)::BIGINT
                    FROM user_sessions
                    WHERE revoked_at IS NULL
                      AND expires_at > NOW()
                ) AS revocable_sessions
            "#,
        )
        .bind(high_risk_users)
        .fetch_one(&self.pool)
        .await?;

        Ok(posture)
    }

    pub async fn operation_traces_page(
        &self,
        query: AdminOperationTraceQuery,
    ) -> Result<AdminOperationTracePage, AppError> {
        let action = normalize_optional_filter(query.action);
        let outcome = normalize_optional_filter(query.outcome);
        let entity_type = normalize_optional_filter(query.entity_type);
        let limit = query
            .limit
            .unwrap_or(DEFAULT_TRACE_PAGE_LIMIT)
            .clamp(1, MAX_TRACE_PAGE_LIMIT);
        let offset = query.offset.unwrap_or(0).max(0);

        let traces = sqlx::query_as::<_, AdminOperationTrace>(
            r#"
            SELECT
                id,
                entity_type,
                entity_id,
                action,
                actor_id,
                actor,
                diff->>'outcome' AS outcome,
                diff->>'severity' AS severity,
                diff->>'reason' AS reason,
                diff->>'path' AS path,
                CONCAT(action, ' - ', COALESCE(actor, 'system'), ' - ', entity_type) AS summary,
                created_at
            FROM audit_log
            WHERE ($1::text IS NULL OR action = $1)
              AND ($2::text IS NULL OR diff->>'outcome' = $2)
              AND ($3::text IS NULL OR entity_type = $3)
            ORDER BY created_at DESC
            LIMIT $4 OFFSET $5
            "#,
        )
        .bind(action.as_deref())
        .bind(outcome.as_deref())
        .bind(entity_type.as_deref())
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        let total = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT COUNT(*)::BIGINT
            FROM audit_log
            WHERE ($1::text IS NULL OR action = $1)
              AND ($2::text IS NULL OR diff->>'outcome' = $2)
              AND ($3::text IS NULL OR entity_type = $3)
            "#,
        )
        .bind(action.as_deref())
        .bind(outcome.as_deref())
        .bind(entity_type.as_deref())
        .fetch_one(&self.pool)
        .await?;

        Ok(AdminOperationTracePage {
            next_offset: (offset + (traces.len() as i64) < total).then_some(offset + limit),
            items: traces,
            total,
            limit,
            offset,
        })
    }

    pub async fn ai_risk_analysis(
        &self,
        ai_config: Option<AiProviderConfig>,
        req: AdminAiRiskAnalysisRequest,
    ) -> Result<AdminAiRiskAnalysis, AppError> {
        let settings = self.settings().await?;
        let risk_policy = self.risk_policy().await?;
        let usage = self.usage_stats(&settings).await?;
        let users_page = self
            .users_page(AdminUsersQuery {
                q: None,
                status: None,
                role: None,
                risk_level: None,
                limit: Some(20),
                offset: Some(0),
            })
            .await?;
        let users = users_page.items;
        let security_posture = self.security_posture(&users).await?;
        let trace_page = self
            .operation_traces_page(AdminOperationTraceQuery {
                action: None,
                outcome: None,
                entity_type: None,
                limit: Some(30),
                offset: Some(0),
            })
            .await?;
        let traces = trace_page.items;
        let context = AdminRiskAnalysisPromptContext {
            usage: &usage,
            security_posture: &security_posture,
            risk_policy: &risk_policy,
            users: &users,
            operation_traces: &traces,
            instruction: req.instruction.as_deref(),
            focus_user_id: req.focus_user_id,
        };

        let fallback = || {
            build_fallback_ai_risk_analysis(
                AdminAiCallStatus {
                    configured: false,
                    used: false,
                    provider: None,
                    model: None,
                    error: None,
                },
                &security_posture,
                &users,
                &traces,
            )
        };

        if !risk_policy.ai_analysis_enabled {
            return Ok(AdminAiRiskAnalysis {
                summary: "AI risk analysis is disabled by admin risk policy".to_string(),
                severity: "normal".to_string(),
                generated_at: Utc::now(),
                ai_status: AdminAiCallStatus {
                    configured: false,
                    used: false,
                    provider: None,
                    model: None,
                    error: Some("AI analysis is disabled".to_string()),
                },
                langgraph_nodes: vec![AdminLangGraphNode {
                    name: risk_policy.langgraph_risk_node,
                    state: "guarded".to_string(),
                    detail: "Admin risk policy disabled AI analysis".to_string(),
                }],
                recommendations: Vec::new(),
            });
        }

        let Some(config) = ai_config else {
            return Ok(fallback());
        };

        let prompt_context = serde_json::to_string(&context).map_err(|error| {
            AppError::internal(format!("Admin AI context serialization failed: {}", error))
        })?;
        let system_prompt = "Return strict JSON only. Act as an AssetsLake admin LangGraph risk orchestrator. Never propose primary writes without human approval.";
        let user_prompt = format!(
            r#"Analyze this admin-control context and return JSON:
{{
  "summary": "one concise sentence",
  "severity": "normal|watch|high|critical",
  "langgraph_nodes": [
    {{"name": "collect_admin_signals", "state": "ready|guarded|planned", "detail": "string"}},
    {{"name": "score_identity_risk", "state": "ready|guarded|planned", "detail": "string"}},
    {{"name": "detect_abnormal_behavior", "state": "ready|guarded|planned", "detail": "string"}},
    {{"name": "propose_governance_actions", "state": "ready|guarded|planned", "detail": "string"}},
    {{"name": "human_approval_gate", "state": "ready|guarded|planned", "detail": "string"}}
  ],
  "recommendations": [
    {{
      "title": "string",
      "severity": "normal|watch|high|critical",
      "target": "user/session/role/audit scope",
      "action": "string",
      "rationale": "string",
      "requires_human_approval": true
    }}
  ]
}}
Use the configured LangGraph node name "{}" as the orchestration anchor.
Keep output compact: exactly 5 langgraph_nodes, at most 2 recommendations, string fields under 100 characters.
Context JSON: {}"#,
            risk_policy.langgraph_risk_node, prompt_context
        );

        let ai_service = AiProviderService::new();
        match ai_service
            .chat_json_with_max_tokens::<AdminAiRiskAnalysisPayload>(
                &config,
                system_prompt,
                &user_prompt,
                ADMIN_AI_RISK_JSON_MAX_TOKENS,
            )
            .await
        {
            Ok(payload) => Ok(AdminAiRiskAnalysis {
                summary: payload.summary,
                severity: payload.severity,
                generated_at: Utc::now(),
                ai_status: AdminAiCallStatus {
                    configured: true,
                    used: true,
                    provider: Some(config.provider),
                    model: Some(config.model),
                    error: None,
                },
                langgraph_nodes: payload.langgraph_nodes,
                recommendations: payload.recommendations,
            }),
            Err(error) => Ok(build_fallback_ai_risk_analysis(
                AdminAiCallStatus {
                    configured: true,
                    used: false,
                    provider: Some(config.provider),
                    model: Some(config.model),
                    error: Some(error.to_string()),
                },
                &security_posture,
                &users,
                &traces,
            )),
        }
    }

    pub async fn export_operation_traces_csv(
        &self,
        query: AdminOperationTraceQuery,
    ) -> Result<String, AppError> {
        let page = self
            .operation_traces_page(AdminOperationTraceQuery {
                limit: Some(
                    query
                        .limit
                        .unwrap_or(MAX_TRACE_EXPORT_LIMIT)
                        .min(MAX_TRACE_EXPORT_LIMIT),
                ),
                offset: Some(query.offset.unwrap_or(0).max(0)),
                ..query
            })
            .await?;
        let mut csv =
            "id,created_at,action,outcome,severity,entity_type,entity_id,actor,reason,path,summary\n"
                .to_string();
        for trace in page.items {
            csv.push_str(&format!(
                "{},{},{},{},{},{},{},{},{},{},{}\n",
                trace.id,
                csv_escape(&trace.created_at.to_rfc3339()),
                csv_escape(&trace.action),
                csv_escape(trace.outcome.as_deref().unwrap_or("")),
                csv_escape(trace.severity.as_deref().unwrap_or("")),
                csv_escape(&trace.entity_type),
                csv_escape(&trace.entity_id.to_string()),
                csv_escape(trace.actor.as_deref().unwrap_or("")),
                csv_escape(trace.reason.as_deref().unwrap_or("")),
                csv_escape(trace.path.as_deref().unwrap_or("")),
                csv_escape(&trace.summary)
            ));
        }
        Ok(csv)
    }
}

pub async fn configured_session_ttl_seconds(pool: &PgPool) -> i64 {
    match sqlx::query_scalar::<_, i64>(
        r#"
        SELECT session_ttl_seconds
        FROM admin_control_settings
        WHERE id = 'default'
        "#,
    )
    .fetch_optional(pool)
    .await
    {
        Ok(Some(value)) => clamp_session_ttl_seconds(value),
        Ok(None) | Err(_) => {
            clamp_session_ttl_seconds(env_i64("SESSION_TTL_SECONDS", DEFAULT_SESSION_TTL_SECONDS))
        }
    }
}

fn env_i64(name: &str, default_value: i64) -> i64 {
    std::env::var(name)
        .ok()
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(default_value)
}

fn clamp_session_ttl_seconds(value: i64) -> i64 {
    value.clamp(MIN_SESSION_TTL_SECONDS, MAX_SESSION_TTL_SECONDS)
}

fn validate_settings(
    session_ttl_seconds: i64,
    idle_timeout_seconds: i64,
    abnormal_login_threshold: i64,
    abnormal_window_minutes: i64,
) -> Result<(), AppError> {
    if !(MIN_SESSION_TTL_SECONDS..=MAX_SESSION_TTL_SECONDS).contains(&session_ttl_seconds) {
        return Err(AppError::validation(format!(
            "session_ttl_seconds must be between {} and {}",
            MIN_SESSION_TTL_SECONDS, MAX_SESSION_TTL_SECONDS
        )));
    }
    if !(MIN_IDLE_TIMEOUT_SECONDS..=session_ttl_seconds).contains(&idle_timeout_seconds) {
        return Err(AppError::validation(
            "idle_timeout_seconds must be at least 60 and no greater than session_ttl_seconds",
        ));
    }
    if !(MIN_ABNORMAL_LOGIN_THRESHOLD..=MAX_ABNORMAL_LOGIN_THRESHOLD)
        .contains(&abnormal_login_threshold)
    {
        return Err(AppError::validation(format!(
            "abnormal_login_threshold must be between {} and {}",
            MIN_ABNORMAL_LOGIN_THRESHOLD, MAX_ABNORMAL_LOGIN_THRESHOLD
        )));
    }
    if !(MIN_ABNORMAL_WINDOW_MINUTES..=MAX_ABNORMAL_WINDOW_MINUTES)
        .contains(&abnormal_window_minutes)
    {
        return Err(AppError::validation(format!(
            "abnormal_window_minutes must be between {} and {}",
            MIN_ABNORMAL_WINDOW_MINUTES, MAX_ABNORMAL_WINDOW_MINUTES
        )));
    }
    Ok(())
}

fn validate_risk_policy(
    session_weight: i64,
    lock_weight: i64,
    event_weight: i64,
    blocked_weight: i64,
    auth_failure_weight: i64,
    rbac_denial_weight: i64,
    high_session_threshold: i64,
    high_event_threshold: i64,
    langgraph_risk_node: &str,
) -> Result<(), AppError> {
    for (name, value, max) in [
        ("session_weight", session_weight, 1_000),
        ("lock_weight", lock_weight, 1_000),
        ("event_weight", event_weight, 1_000),
        ("blocked_weight", blocked_weight, 5_000),
        ("auth_failure_weight", auth_failure_weight, 1_000),
        ("rbac_denial_weight", rbac_denial_weight, 1_000),
    ] {
        if !(0..=max).contains(&value) {
            return Err(AppError::validation(format!(
                "{} must be between 0 and {}",
                name, max
            )));
        }
    }
    if !(1..=10_000).contains(&high_session_threshold) {
        return Err(AppError::validation(
            "high_session_threshold must be between 1 and 10000",
        ));
    }
    if !(1..=100_000).contains(&high_event_threshold) {
        return Err(AppError::validation(
            "high_event_threshold must be between 1 and 100000",
        ));
    }
    if langgraph_risk_node.is_empty() || langgraph_risk_node.len() > 96 {
        return Err(AppError::validation(
            "langgraph_risk_node must be 1 to 96 characters",
        ));
    }
    Ok(())
}

fn normalize_optional_filter(value: Option<String>) -> Option<String> {
    value
        .map(|item| item.trim().to_ascii_lowercase())
        .filter(|item| !item.is_empty() && item != "all")
}

fn csv_escape(value: &str) -> String {
    if value.contains(',') || value.contains('"') || value.contains('\n') || value.contains('\r') {
        format!("\"{}\"", value.replace('"', "\"\""))
    } else {
        value.to_string()
    }
}

fn build_fallback_ai_risk_analysis(
    ai_status: AdminAiCallStatus,
    posture: &AdminSecurityPosture,
    users: &[AdminUserSummary],
    traces: &[AdminOperationTrace],
) -> AdminAiRiskAnalysis {
    let high_risk_users: Vec<&AdminUserSummary> = users
        .iter()
        .filter(|user| matches!(user.risk_level.as_str(), "high" | "critical"))
        .take(5)
        .collect();
    let denied_events = traces
        .iter()
        .filter(|trace| trace.outcome.as_deref() == Some("denied"))
        .count();
    let severity = if posture.high_risk_users > 0 || denied_events >= 5 {
        "high"
    } else if posture.active_admin_sessions > 3 || denied_events > 0 {
        "watch"
    } else {
        "normal"
    };

    let mut recommendations = Vec::new();
    for user in high_risk_users {
        recommendations.push(AdminAiRecommendation {
            title: format!("Review {}", user.username),
            severity: user.risk_level.clone(),
            target: user.username.clone(),
            action: "Inspect recent sessions, locks, and audit trace before changing access"
                .to_string(),
            rationale: format!(
                "Risk score {} from {} sessions, {} locks, and {} recent events",
                user.risk_score, user.active_sessions, user.active_locks, user.recent_event_count
            ),
            requires_human_approval: true,
        });
    }
    if recommendations.is_empty() {
        recommendations.push(AdminAiRecommendation {
            title: "Maintain current policy".to_string(),
            severity: severity.to_string(),
            target: "admin-control".to_string(),
            action: "Continue monitoring auth failures, RBAC denials, and admin session count"
                .to_string(),
            rationale: "No user currently crosses the local high-risk action threshold".to_string(),
            requires_human_approval: false,
        });
    }

    AdminAiRiskAnalysis {
        summary: format!(
            "{} high-risk users, {} active admin sessions, {} denied audit events in view",
            posture.high_risk_users, posture.active_admin_sessions, denied_events
        ),
        severity: severity.to_string(),
        generated_at: Utc::now(),
        ai_status,
        langgraph_nodes: vec![
            AdminLangGraphNode {
                name: "collect_admin_signals".to_string(),
                state: "ready".to_string(),
                detail: "Collected sessions, locks, users, and audit traces".to_string(),
            },
            AdminLangGraphNode {
                name: "score_identity_risk".to_string(),
                state: "ready".to_string(),
                detail: "Applied local risk policy weights to current users".to_string(),
            },
            AdminLangGraphNode {
                name: "detect_abnormal_behavior".to_string(),
                state: if severity == "normal" {
                    "ready"
                } else {
                    "guarded"
                }
                .to_string(),
                detail: "Checked denied events, admin sessions, blocked users, and active locks"
                    .to_string(),
            },
            AdminLangGraphNode {
                name: "propose_governance_actions".to_string(),
                state: "guarded".to_string(),
                detail: "Generated recommendations without primary writes".to_string(),
            },
            AdminLangGraphNode {
                name: "human_approval_gate".to_string(),
                state: "guarded".to_string(),
                detail: "Block, unblock, and role changes remain explicit admin actions"
                    .to_string(),
            },
        ],
        recommendations,
    }
}

fn normalize_role(role: &str) -> String {
    role.trim().to_ascii_lowercase().replace('_', "-")
}

fn ensure_allowed_role(role: &str) -> Result<(), AppError> {
    if matches!(
        role,
        "admin" | "producer" | "artist" | "reviewer" | "manager" | "viewer" | "client" | "vendor"
    ) {
        return Ok(());
    }
    Err(AppError::validation("Unsupported user role"))
}

async fn ensure_not_last_admin(
    pool: &PgPool,
    user_id: Uuid,
    next_role: &str,
) -> Result<(), AppError> {
    if next_role == "admin" {
        return Ok(());
    }

    let current_role = sqlx::query_scalar::<_, String>(
        "SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL AND COALESCE(user_status, 'active') = 'active'",
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::not_found("User not found"))?;

    if normalize_role(&current_role) != "admin" {
        return Ok(());
    }

    let remaining_admins = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*)::BIGINT FROM users WHERE id <> $1 AND role = 'admin' AND deleted_at IS NULL AND COALESCE(user_status, 'active') = 'active'",
    )
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    if remaining_admins == 0 {
        return Err(AppError::validation(
            "At least one active admin account must remain",
        ));
    }
    Ok(())
}

fn role_permissions(users: &[AdminUserSummary]) -> Vec<AdminRolePermission> {
    let mut counts = HashMap::<String, i64>::new();
    for user in users {
        if user.status == "active" {
            *counts.entry(normalize_role(&user.role)).or_insert(0) += 1;
        }
    }

    [
        "admin", "producer", "artist", "reviewer", "manager", "viewer", "client", "vendor",
    ]
    .into_iter()
    .map(|role| AdminRolePermission {
        role: role.to_string(),
        user_count: *counts.get(role).unwrap_or(&0),
        permissions: permission_catalog(role),
    })
    .collect()
}

fn permission_catalog(role: &str) -> Vec<String> {
    let permissions: &[&str] = match role {
        "admin" => &[
            "asset:read",
            "asset:write",
            "asset:analyze",
            "asset:delete",
            "issue:read",
            "issue:write",
            "issue:comment",
            "issue:review",
            "issue:delete",
            "delivery:write",
            "project:read",
            "project:write",
            "workflow:read",
            "report:read",
            "data-lake:query",
            "ai:read",
            "ai:write",
            "enterprise:admin",
        ],
        "producer" => &[
            "asset:read",
            "asset:write",
            "asset:analyze",
            "asset:delete",
            "issue:read",
            "issue:write",
            "issue:comment",
            "issue:review",
            "issue:delete",
            "delivery:write",
            "project:read",
            "project:write",
            "workflow:read",
            "report:read",
            "data-lake:query",
            "ai:read",
            "ai:write",
        ],
        "artist" => &[
            "asset:read",
            "asset:write",
            "issue:read",
            "issue:write",
            "project:read",
        ],
        "reviewer" => &[
            "asset:read",
            "asset:analyze",
            "issue:read",
            "issue:comment",
            "issue:review",
            "project:read",
            "workflow:read",
            "report:read",
            "data-lake:query",
            "ai:read",
        ],
        "manager" => &[
            "asset:read",
            "issue:read",
            "project:read",
            "report:read",
            "data-lake:query",
        ],
        "viewer" | "client" | "vendor" => &["asset:read", "issue:read", "project:read"],
        _ => &[],
    };
    permissions
        .iter()
        .map(|permission| permission.to_string())
        .collect()
}

fn build_alerts(
    settings: &AdminControlSettings,
    usage: &AdminUsageStats,
    posture: &AdminSecurityPosture,
) -> Vec<AdminAlert> {
    let now = Utc::now();
    let mut alerts = Vec::new();

    if settings.failed_login_alert_enabled
        && usage.auth_failures_window >= settings.abnormal_login_threshold
    {
        alerts.push(AdminAlert {
            severity: "critical".to_string(),
            title: "Failed login spike".to_string(),
            detail: format!(
                "{} failures in the last {} minutes",
                usage.auth_failures_window, settings.abnormal_window_minutes
            ),
            created_at: now,
        });
    }

    if settings.rbac_denial_alert_enabled
        && usage.rbac_denials_window >= settings.abnormal_login_threshold
    {
        alerts.push(AdminAlert {
            severity: "warning".to_string(),
            title: "RBAC denial spike".to_string(),
            detail: format!(
                "{} denials in the last {} minutes",
                usage.rbac_denials_window, settings.abnormal_window_minutes
            ),
            created_at: now,
        });
    }

    if usage.expiring_sessions > 0 {
        alerts.push(AdminAlert {
            severity: "info".to_string(),
            title: "Sessions expiring soon".to_string(),
            detail: format!(
                "{} active sessions expire within 30 minutes",
                usage.expiring_sessions
            ),
            created_at: now,
        });
    }

    if posture.high_risk_users > 0 {
        alerts.push(AdminAlert {
            severity: "critical".to_string(),
            title: "High-risk users require review".to_string(),
            detail: format!(
                "{} users are blocked or showing elevated activity risk",
                posture.high_risk_users
            ),
            created_at: now,
        });
    }

    if posture.blocked_users > 0 {
        alerts.push(AdminAlert {
            severity: "warning".to_string(),
            title: "Blocked users under review".to_string(),
            detail: format!(
                "{} users are blocked and remain visible for traceability",
                posture.blocked_users
            ),
            created_at: now,
        });
    }

    if posture.active_admin_sessions > 3 {
        alerts.push(AdminAlert {
            severity: "warning".to_string(),
            title: "Elevated admin session count".to_string(),
            detail: format!(
                "{} active admin sessions can widen the control surface",
                posture.active_admin_sessions
            ),
            created_at: now,
        });
    }

    if alerts.is_empty() {
        alerts.push(AdminAlert {
            severity: "normal".to_string(),
            title: "No active alerts".to_string(),
            detail: "Authentication and authorization signals are within policy".to_string(),
            created_at: now,
        });
    }

    alerts
}
