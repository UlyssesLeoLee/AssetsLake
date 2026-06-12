/*
```cypher
CREATE
  (f:File {name: "admin_control_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::admin_control_handler", type: "module"}),
  (fn1:Function {name: "admin_control_snapshot", type: "function", language: "rust", signature: "pub async fn admin_control_snapshot(state: web::Data<AppState>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "update_admin_control_settings", type: "function", language: "rust", signature: "pub async fn update_admin_control_settings(state: web::Data<AppState>, req: HttpRequest, body: web::Json<UpdateAdminControlSettingsRequest>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "update_admin_user_role", type: "function", language: "rust", signature: "pub async fn update_admin_user_role(state: web::Data<AppState>, req: HttpRequest, path: web::Path<Uuid>, body: web::Json<UpdateAdminUserRoleRequest>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "session_from_request", type: "function", language: "rust", signature: "fn session_from_request(req: &HttpRequest) -> Result<SessionContext, AppError>"}),
  (v1:Variable {name: "state", type: "variable"}),
  (v2:Variable {name: "req", type: "variable"}),
  (v3:Variable {name: "session", type: "variable"}),
  (v4:Variable {name: "SecurityAuditInput", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v4);
```
*/

use actix_web::{get, patch, post, web, HttpMessage, HttpRequest, HttpResponse};
use serde_json::json;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    models::{
        admin_control::{
            AdminAiRiskAnalysisRequest, AdminOperationTraceQuery, AdminUsersQuery,
            UpdateAdminControlSettingsRequest, UpdateAdminRiskPolicyRequest,
            UpdateAdminUserRoleRequest, UpdateAdminUserStatusRequest,
        },
        auth::SessionContext,
    },
    services::{ai_provider_service::AiProviderConfig, security_audit_service::SecurityAuditInput},
    AppState,
};

#[get("/api/admin/control")]
pub async fn admin_control_snapshot(state: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    let snapshot = state.admin_control_service.snapshot().await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

#[get("/api/admin/control/users")]
pub async fn admin_control_users(
    state: web::Data<AppState>,
    query: web::Query<AdminUsersQuery>,
) -> Result<HttpResponse, AppError> {
    let page = state
        .admin_control_service
        .users_page(query.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(page)))
}

#[get("/api/admin/control/operation-traces")]
pub async fn admin_control_operation_traces(
    state: web::Data<AppState>,
    query: web::Query<AdminOperationTraceQuery>,
) -> Result<HttpResponse, AppError> {
    let page = state
        .admin_control_service
        .operation_traces_page(query.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(page)))
}

#[get("/api/admin/control/operation-traces/export")]
pub async fn export_admin_control_operation_traces(
    state: web::Data<AppState>,
    req: HttpRequest,
    query: web::Query<AdminOperationTraceQuery>,
) -> Result<HttpResponse, AppError> {
    let csv = state
        .admin_control_service
        .export_operation_traces_csv(query.into_inner())
        .await?;

    state
        .security_audit_service
        .record_http_request(
            &req,
            SecurityAuditInput::new(
                "admin_operation_traces_exported",
                "success",
                "security",
                None,
            )
            .metadata(json!({
                "format": "csv",
                "scope": "admin-control"
            })),
        )
        .await;

    Ok(HttpResponse::Ok()
        .insert_header(("Content-Type", "text/csv; charset=utf-8"))
        .insert_header((
            "Content-Disposition",
            "attachment; filename=\"assetslake-admin-operation-traces.csv\"",
        ))
        .body(csv))
}

#[patch("/api/admin/control/settings")]
pub async fn update_admin_control_settings(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<UpdateAdminControlSettingsRequest>,
) -> Result<HttpResponse, AppError> {
    let session = session_from_request(&req)?;
    let settings = state
        .admin_control_service
        .update_settings(body.into_inner(), &session)
        .await?;

    state
        .security_audit_service
        .record_http_request(
            &req,
            SecurityAuditInput::new(
                "admin_control_settings_updated",
                "success",
                "security",
                None,
            )
            .metadata(json!({
                "session_ttl_seconds": settings.session_ttl_seconds,
                "idle_timeout_seconds": settings.idle_timeout_seconds,
                "abnormal_login_threshold": settings.abnormal_login_threshold,
                "abnormal_window_minutes": settings.abnormal_window_minutes
            })),
        )
        .await;

    Ok(HttpResponse::Ok().json(ApiResponse::ok(settings)))
}

#[patch("/api/admin/control/risk-policy")]
pub async fn update_admin_risk_policy(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<UpdateAdminRiskPolicyRequest>,
) -> Result<HttpResponse, AppError> {
    let session = session_from_request(&req)?;
    let policy = state
        .admin_control_service
        .update_risk_policy(body.into_inner(), &session)
        .await?;

    state
        .security_audit_service
        .record_http_request(
            &req,
            SecurityAuditInput::new("admin_risk_policy_updated", "success", "security", None)
                .metadata(json!({
                    "session_weight": policy.session_weight,
                    "lock_weight": policy.lock_weight,
                    "event_weight": policy.event_weight,
                    "blocked_weight": policy.blocked_weight,
                    "langgraph_risk_node": policy.langgraph_risk_node,
                    "ai_analysis_enabled": policy.ai_analysis_enabled
                })),
        )
        .await;

    Ok(HttpResponse::Ok().json(ApiResponse::ok(policy)))
}

#[patch("/api/admin/control/users/{id}/role")]
pub async fn update_admin_user_role(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<UpdateAdminUserRoleRequest>,
) -> Result<HttpResponse, AppError> {
    let session = session_from_request(&req)?;
    let user_id = path.into_inner();
    let user = state
        .admin_control_service
        .update_user_role(user_id, body.into_inner())
        .await?;

    state
        .security_audit_service
        .record_http_request(
            &req,
            SecurityAuditInput::new(
                "admin_user_role_updated",
                "success",
                "security",
                Some(user.id),
            )
            .metadata(json!({
                "target_username": user.username,
                "target_role": user.role,
                "actor": session.user.username
            })),
        )
        .await;

    Ok(HttpResponse::Ok().json(ApiResponse::ok(user)))
}

#[patch("/api/admin/control/users/{id}/status")]
pub async fn update_admin_user_status(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<UpdateAdminUserStatusRequest>,
) -> Result<HttpResponse, AppError> {
    let session = session_from_request(&req)?;
    let user_id = path.into_inner();
    let status_request = body.into_inner();
    let blocked = status_request.blocked;
    let reason = status_request.reason.clone();
    let user = state
        .admin_control_service
        .update_user_status(user_id, status_request, &session)
        .await?;

    let mut audit = SecurityAuditInput::new(
        if blocked {
            "admin_user_blocked"
        } else {
            "admin_user_unblocked"
        },
        "success",
        "user",
        Some(user.id),
    )
    .severity(if blocked { "warning" } else { "info" })
    .metadata(json!({
        "target_username": user.username,
        "target_status": user.status,
        "target_role": user.role,
        "actor": session.user.username,
        "active_sessions": user.active_sessions,
        "active_locks": user.active_locks,
        "risk_level": user.risk_level,
        "risk_score": user.risk_score
    }));

    if let Some(reason) = reason.and_then(|value| {
        let trimmed = value.trim().to_string();
        (!trimmed.is_empty()).then_some(trimmed)
    }) {
        audit = audit.reason(reason);
    }

    state
        .security_audit_service
        .record_http_request(&req, audit)
        .await;

    Ok(HttpResponse::Ok().json(ApiResponse::ok(user)))
}

#[post("/api/admin/control/ai/risk-analysis")]
pub async fn admin_ai_risk_analysis(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<AdminAiRiskAnalysisRequest>,
) -> Result<HttpResponse, AppError> {
    let session = session_from_request(&req)?;
    let analysis = state
        .admin_control_service
        .ai_risk_analysis(
            AiProviderConfig::from_headers(req.headers()),
            body.into_inner(),
        )
        .await?;

    state
        .security_audit_service
        .record_http_request(
            &req,
            SecurityAuditInput::new(
                "admin_ai_risk_analysis_requested",
                if analysis.ai_status.used {
                    "success"
                } else {
                    "fallback"
                },
                "security",
                Some(session.user.id),
            )
            .metadata(json!({
                "severity": analysis.severity,
                "provider": analysis.ai_status.provider,
                "model": analysis.ai_status.model,
                "recommendation_count": analysis.recommendations.len(),
                "langgraph_nodes": analysis.langgraph_nodes.iter().map(|node| node.name.clone()).collect::<Vec<_>>()
            })),
        )
        .await;

    Ok(HttpResponse::Ok().json(ApiResponse::ok(analysis)))
}

fn session_from_request(req: &HttpRequest) -> Result<SessionContext, AppError> {
    req.extensions()
        .get::<SessionContext>()
        .cloned()
        .ok_or_else(|| AppError::unauthorized("Admin session context is required"))
}
