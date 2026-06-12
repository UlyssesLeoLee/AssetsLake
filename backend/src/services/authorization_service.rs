/*
```cypher
CREATE
  (f:File {name: "authorization_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::authorization_service", type: "module"}),
  (c1:Class {name: "RoutePermission", type: "class", language: "rust", signature: "enum RoutePermission"}),
  (fn1:Function {name: "enforce_route_authorization", type: "function", language: "rust", signature: "async fn enforce_route_authorization<B>(req: ServiceRequest, next: Next<B>) -> Result<ServiceResponse<B>, Error>"}),
  (fn2:Function {name: "permission_for_route", type: "function", language: "rust", signature: "fn permission_for_route(method: &Method, path: &str) -> Option<RoutePermission>"}),
  (fn3:Function {name: "asset_permission", type: "function", language: "rust", signature: "fn asset_permission(method: &Method, path: &str) -> RoutePermission"}),
  (fn4:Function {name: "production_permission", type: "function", language: "rust", signature: "fn production_permission(method: &Method, path: &str) -> RoutePermission"}),
  (fn5:Function {name: "project_management_permission", type: "function", language: "rust", signature: "fn project_management_permission(method: &Method, path: &str) -> RoutePermission"}),
  (fn6:Function {name: "management_permission", type: "function", language: "rust", signature: "fn management_permission(method: &Method, path: &str) -> RoutePermission"}),
  (fn7:Function {name: "is_read_method", type: "function", language: "rust", signature: "fn is_read_method(method: &Method) -> bool"}),
  (fn8:Function {name: "is_mutating_method", type: "function", language: "rust", signature: "fn is_mutating_method(method: &Method) -> bool"}),
  (fn9:Function {name: "is_public_route", type: "function", language: "rust", signature: "fn is_public_route(method: &Method, path: &str) -> bool"}),
  (fn10:Function {name: "role_allows", type: "function", language: "rust", signature: "fn role_allows(role: &str, permission: RoutePermission) -> bool"}),
  (fn11:Function {name: "is_known_authenticated_role", type: "function", language: "rust", signature: "fn is_known_authenticated_role(role: &str) -> bool"}),
  (fn12:Function {name: "normalized_role", type: "function", language: "rust", signature: "fn normalized_role(role: &str) -> String"}),
  (fn13:Function {name: "permission_name", type: "function", language: "rust", signature: "fn permission_name(permission: RoutePermission) -> &'static str"}),
  (fn14:Function {name: "is_asset_content_route", type: "function", language: "rust", signature: "fn is_asset_content_route(path: &str) -> bool"}),
  (fn15:Function {name: "people_permission", type: "function", language: "rust", signature: "fn people_permission(method: &Method, path: &str) -> RoutePermission"}),
  (tm:Module {name: "crate::services::authorization_service::tests", type: "module"}),
  (tfn1:Function {name: "public_routes_do_not_require_sessions", type: "function", language: "rust", signature: "fn public_routes_do_not_require_sessions()"}),
  (tfn2:Function {name: "maps_asset_permissions", type: "function", language: "rust", signature: "fn maps_asset_permissions()"}),
  (tfn3:Function {name: "maps_production_permissions", type: "function", language: "rust", signature: "fn maps_production_permissions()"}),
  (tfn4:Function {name: "maps_planning_reporting_and_ai_permissions", type: "function", language: "rust", signature: "fn maps_planning_reporting_and_ai_permissions()"}),
  (tfn5:Function {name: "role_matrix_blocks_cross_domain_writes", type: "function", language: "rust", signature: "fn role_matrix_blocks_cross_domain_writes()"}),
  (tfn6:Function {name: "maps_people_intelligence_permissions", type: "function", language: "rust", signature: "fn maps_people_intelligence_permissions()"}),
  (v1:Variable {name: "req", type: "variable"}),
  (v2:Variable {name: "permission", type: "variable"}),
  (v3:Variable {name: "state", type: "variable"}),
  (v4:Variable {name: "session", type: "variable"}),
  (v5:Variable {name: "role", type: "variable"}),
  (v6:Variable {name: "state.security_audit_service", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
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
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(tm),
  (tm)-[:CONTAINS]->(tfn1),
  (tm)-[:CONTAINS]->(tfn2),
  (tm)-[:CONTAINS]->(tfn3),
  (tm)-[:CONTAINS]->(tfn4),
  (tm)-[:CONTAINS]->(tfn5),
  (tm)-[:CONTAINS]->(tfn6),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn10),
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn13),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v6),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:CALLS]->(fn9),
  (fn2)-[:CALLS]->(fn14),
  (fn2)-[:CALLS]->(fn15),
  (fn3)-[:CALLS]->(fn7),
  (fn3)-[:CALLS]->(fn8),
  (fn4)-[:CALLS]->(fn7),
  (fn4)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn7),
  (fn5)-[:CALLS]->(fn8),
  (fn6)-[:CALLS]->(fn7),
  (fn7)-[:USES]->(v2),
  (fn8)-[:USES]->(v2),
  (fn9)-[:CALLS]->(fn7),
  (fn10)-[:CALLS]->(fn11),
  (fn10)-[:CALLS]->(fn12),
  (fn10)-[:USES]->(v5),
  (fn11)-[:USES]->(v5),
  (tfn1)-[:CALLS]->(fn2),
  (tfn2)-[:CALLS]->(fn2),
  (tfn3)-[:CALLS]->(fn2),
  (tfn4)-[:CALLS]->(fn2),
  (tfn5)-[:CALLS]->(fn10),
  (tfn6)-[:CALLS]->(fn2),
  (tfn6)-[:CALLS]->(fn10);
```
*/

use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    http::Method,
    middleware::Next,
    web, Error, HttpMessage,
};
use serde_json::json;

use crate::{errors::AppError, services::security_audit_service::SecurityAuditInput, AppState};

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum RoutePermission {
    AuthenticatedSession,
    ProjectRead,
    AssetRead,
    AssetWrite,
    AssetAnalyze,
    AssetDelete,
    ProductionRead,
    IssueWrite,
    IssueComment,
    IssueReview,
    IssueDelete,
    DeliveryWrite,
    PlanningRead,
    PlanningWrite,
    WorkflowRead,
    ReportingRead,
    DataLakeQuery,
    AiControlRead,
    AiControlWrite,
    WikiRead,
    WikiWrite,
    DesignRequirementRead,
    DesignRequirementWrite,
    DesignRequirementAi,
    PeopleRead,
    PeopleWrite,
    PeopleEvaluate,
    PeopleAdmin,
    EnterpriseAdmin,
    FallbackAdmin,
}

pub async fn enforce_route_authorization<B>(
    req: ServiceRequest,
    next: Next<B>,
) -> Result<ServiceResponse<B>, Error>
where
    B: MessageBody + 'static,
{
    let method = req.method().clone();
    let path = req.path().to_string();
    let Some(permission) = permission_for_route(&method, &path) else {
        return next.call(req).await;
    };

    let state = req
        .app_data::<web::Data<AppState>>()
        .cloned()
        .ok_or_else(|| AppError::internal("App state is not configured"))?;
    let session = match state.auth_service.authenticate_request(req.request()).await {
        Ok(session) => session,
        Err(error) => {
            state
                .security_audit_service
                .record_service_request(
                    &req,
                    None,
                    SecurityAuditInput::new("auth_failed", "denied", "security", None)
                        .severity("warning")
                        .reason(error.to_string())
                        .metadata(json!({
                            "permission": permission_name(permission)
                        })),
                )
                .await;
            return Err(error.into());
        }
    };

    if !role_allows(&session.user.role, permission) {
        state
            .security_audit_service
            .record_service_request(
                &req,
                Some(&session),
                SecurityAuditInput::new("rbac_denied", "denied", "security", None)
                    .severity("warning")
                    .reason(format!(
                        "Role {} is not allowed to perform {}",
                        normalized_role(&session.user.role),
                        permission_name(permission)
                    ))
                    .metadata(json!({
                        "permission": permission_name(permission),
                        "role": normalized_role(&session.user.role)
                    })),
            )
            .await;
        return Err(AppError::forbidden(format!(
            "Role {} is not allowed to perform {}",
            normalized_role(&session.user.role),
            permission_name(permission)
        ))
        .into());
    }

    req.extensions_mut().insert(session);
    next.call(req).await
}

fn permission_for_route(method: &Method, path: &str) -> Option<RoutePermission> {
    if is_public_route(method, path)
        || is_asset_content_route(path)
        || path.starts_with("/internal/")
        || !path.starts_with("/api/")
    {
        return None;
    }

    if path.starts_with("/api/auth/") || path.starts_with("/api/locks/") {
        return Some(RoutePermission::AuthenticatedSession);
    }

    if path == "/api/projects" || path.starts_with("/api/projects/") {
        return Some(RoutePermission::ProjectRead);
    }

    if path == "/api/assets" || path.starts_with("/api/assets/") {
        return Some(asset_permission(method, path));
    }

    if path == "/api/issues"
        || path.starts_with("/api/issues/")
        || path == "/api/milestones"
        || path.starts_with("/api/delivery-packages")
    {
        return Some(production_permission(method, path));
    }

    if path.starts_with("/api/project-management/") {
        return Some(project_management_permission(method, path));
    }

    if path.starts_with("/api/data-lake/query/") {
        return Some(RoutePermission::DataLakeQuery);
    }

    if path.starts_with("/api/security/audit-events") {
        return Some(RoutePermission::EnterpriseAdmin);
    }

    if path.starts_with("/api/admin/") {
        return Some(RoutePermission::EnterpriseAdmin);
    }

    if path.starts_with("/api/management/") {
        return Some(management_permission(method, path));
    }

    if path.starts_with("/api/wiki/") {
        return Some(if is_read_method(method) {
            RoutePermission::WikiRead
        } else {
            RoutePermission::WikiWrite
        });
    }

    if path == "/api/design-requirements" || path.starts_with("/api/design-requirements/") {
        if path == "/api/design-requirements/ai/draft" {
            return Some(RoutePermission::DesignRequirementAi);
        }
        return Some(if is_read_method(method) {
            RoutePermission::DesignRequirementRead
        } else {
            RoutePermission::DesignRequirementWrite
        });
    }

    if path == "/api/people" || path.starts_with("/api/people/") {
        return Some(people_permission(method, path));
    }

    Some(RoutePermission::FallbackAdmin)
}

fn asset_permission(method: &Method, path: &str) -> RoutePermission {
    if is_read_method(method) {
        return RoutePermission::AssetRead;
    }
    if method == Method::DELETE {
        return RoutePermission::AssetDelete;
    }
    if method == Method::POST && path.ends_with("/analyze") {
        return RoutePermission::AssetAnalyze;
    }
    if is_mutating_method(method) {
        return RoutePermission::AssetWrite;
    }
    RoutePermission::FallbackAdmin
}

fn production_permission(method: &Method, path: &str) -> RoutePermission {
    if path.starts_with("/api/delivery-packages") {
        return RoutePermission::DeliveryWrite;
    }
    if is_read_method(method) {
        return RoutePermission::ProductionRead;
    }
    if method == Method::DELETE {
        return RoutePermission::IssueDelete;
    }
    if path.ends_with("/review")
        || path.ends_with("/approve")
        || path.ends_with("/request-revision")
    {
        return RoutePermission::IssueReview;
    }
    if path.ends_with("/comments") {
        return RoutePermission::IssueComment;
    }
    if is_mutating_method(method) {
        return RoutePermission::IssueWrite;
    }
    RoutePermission::FallbackAdmin
}

fn project_management_permission(method: &Method, path: &str) -> RoutePermission {
    if path == "/api/project-management/reports" {
        return RoutePermission::ReportingRead;
    }
    if path == "/api/project-management/workflow" || path == "/api/project-management/automation" {
        return RoutePermission::WorkflowRead;
    }
    if path == "/api/project-management/enterprise" {
        return RoutePermission::EnterpriseAdmin;
    }
    if is_read_method(method) {
        return RoutePermission::PlanningRead;
    }
    if is_mutating_method(method) {
        return RoutePermission::PlanningWrite;
    }
    RoutePermission::FallbackAdmin
}

fn management_permission(method: &Method, path: &str) -> RoutePermission {
    if path == "/api/management/chat" || path == "/api/management/chat/history" {
        return RoutePermission::AuthenticatedSession;
    }
    if is_read_method(method) || path.ends_with("/autopilot-plan") || path.ends_with("/rag/search")
    {
        return RoutePermission::AiControlRead;
    }
    RoutePermission::AiControlWrite
}

fn people_permission(method: &Method, path: &str) -> RoutePermission {
    if path.starts_with("/api/people/admin/") {
        return RoutePermission::PeopleAdmin;
    }
    if path.ends_with("/verify") || path.ends_with("/evaluation") {
        return RoutePermission::PeopleEvaluate;
    }
    if is_read_method(method) || path == "/api/people/search" || path == "/api/people/personalize" {
        return RoutePermission::PeopleRead;
    }
    RoutePermission::PeopleWrite
}

fn is_read_method(method: &Method) -> bool {
    method == Method::GET || method == Method::HEAD
}

fn is_mutating_method(method: &Method) -> bool {
    method == Method::POST
        || method == Method::PUT
        || method == Method::PATCH
        || method == Method::DELETE
}

fn is_public_route(method: &Method, path: &str) -> bool {
    method == Method::OPTIONS
        || path == "/api/health"
        || path == "/api/auth/login"
        || path == "/api/auth/test-accounts"
        || path == "/api/verification/app"
        || path == "/api/verification/outbox"
        || path == "/api/verification/challenges"
        || path == "/api/verification/register"
        || path == "/api/verification/password"
        || (path.starts_with("/api/verification/challenges/") && path.ends_with("/verify"))
}

fn is_asset_content_route(path: &str) -> bool {
    path.starts_with("/api/assets/") && path.ends_with("/content")
}

fn role_allows(role: &str, permission: RoutePermission) -> bool {
    let role = normalized_role(role);
    if role == "admin" {
        return true;
    }

    match permission {
        RoutePermission::AuthenticatedSession => is_known_authenticated_role(&role),
        RoutePermission::ProjectRead => is_known_authenticated_role(&role),
        RoutePermission::AssetRead => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager" | "viewer" | "client" | "vendor"
            )
        }
        RoutePermission::AssetWrite => matches!(role.as_str(), "producer" | "artist"),
        RoutePermission::AssetAnalyze => {
            matches!(role.as_str(), "producer" | "artist" | "reviewer")
        }
        RoutePermission::AssetDelete => role == "producer",
        RoutePermission::ProductionRead => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager" | "viewer" | "client" | "vendor"
            )
        }
        RoutePermission::IssueWrite => matches!(role.as_str(), "producer" | "artist"),
        RoutePermission::IssueComment => {
            matches!(role.as_str(), "producer" | "artist" | "reviewer")
        }
        RoutePermission::IssueReview => matches!(role.as_str(), "producer" | "reviewer"),
        RoutePermission::IssueDelete => role == "producer",
        RoutePermission::DeliveryWrite => role == "producer",
        RoutePermission::PlanningRead => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager"
            )
        }
        RoutePermission::PlanningWrite => role == "producer",
        RoutePermission::WorkflowRead => matches!(role.as_str(), "producer" | "reviewer"),
        RoutePermission::ReportingRead => {
            matches!(role.as_str(), "producer" | "reviewer" | "manager")
        }
        RoutePermission::DataLakeQuery => {
            matches!(role.as_str(), "producer" | "reviewer" | "manager")
        }
        RoutePermission::AiControlRead => matches!(role.as_str(), "producer" | "reviewer"),
        RoutePermission::AiControlWrite => role == "producer",
        RoutePermission::WikiRead => is_known_authenticated_role(&role),
        RoutePermission::WikiWrite => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager"
            )
        }
        RoutePermission::DesignRequirementRead => is_known_authenticated_role(&role),
        RoutePermission::DesignRequirementWrite => {
            matches!(role.as_str(), "producer" | "artist" | "reviewer")
        }
        RoutePermission::DesignRequirementAi => matches!(role.as_str(), "producer" | "artist"),
        RoutePermission::PeopleRead => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager"
            )
        }
        RoutePermission::PeopleWrite => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager"
            )
        }
        RoutePermission::PeopleEvaluate => {
            matches!(
                role.as_str(),
                "producer" | "artist" | "reviewer" | "manager"
            )
        }
        RoutePermission::PeopleAdmin => false,
        RoutePermission::EnterpriseAdmin | RoutePermission::FallbackAdmin => false,
    }
}

fn is_known_authenticated_role(role: &str) -> bool {
    matches!(
        role,
        "admin" | "producer" | "artist" | "reviewer" | "manager" | "viewer" | "client" | "vendor"
    )
}

fn normalized_role(role: &str) -> String {
    role.trim().to_ascii_lowercase().replace('_', "-")
}

fn permission_name(permission: RoutePermission) -> &'static str {
    match permission {
        RoutePermission::AuthenticatedSession => "authenticated session",
        RoutePermission::ProjectRead => "project read",
        RoutePermission::AssetRead => "asset read",
        RoutePermission::AssetWrite => "asset write",
        RoutePermission::AssetAnalyze => "asset analysis",
        RoutePermission::AssetDelete => "asset delete",
        RoutePermission::ProductionRead => "production read",
        RoutePermission::IssueWrite => "issue write",
        RoutePermission::IssueComment => "issue comment",
        RoutePermission::IssueReview => "issue review",
        RoutePermission::IssueDelete => "issue delete",
        RoutePermission::DeliveryWrite => "delivery package write",
        RoutePermission::PlanningRead => "planning read",
        RoutePermission::PlanningWrite => "planning write",
        RoutePermission::WorkflowRead => "workflow read",
        RoutePermission::ReportingRead => "reporting read",
        RoutePermission::DataLakeQuery => "data lake query",
        RoutePermission::AiControlRead => "AI control read",
        RoutePermission::AiControlWrite => "AI control write",
        RoutePermission::WikiRead => "wiki read",
        RoutePermission::WikiWrite => "wiki write",
        RoutePermission::DesignRequirementRead => "design requirement read",
        RoutePermission::DesignRequirementWrite => "design requirement write",
        RoutePermission::DesignRequirementAi => "design requirement AI draft",
        RoutePermission::PeopleRead => "people intelligence read",
        RoutePermission::PeopleWrite => "people intelligence write",
        RoutePermission::PeopleEvaluate => "people intelligence evaluation",
        RoutePermission::PeopleAdmin => "people intelligence admin",
        RoutePermission::EnterpriseAdmin => "enterprise admin",
        RoutePermission::FallbackAdmin => "admin access",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn public_routes_do_not_require_sessions() {
        assert_eq!(permission_for_route(&Method::GET, "/api/health"), None);
        assert_eq!(permission_for_route(&Method::POST, "/api/auth/login"), None);
        assert_eq!(
            permission_for_route(&Method::GET, "/api/auth/test-accounts"),
            None
        );
        assert_eq!(permission_for_route(&Method::OPTIONS, "/api/assets"), None);
        assert_eq!(
            permission_for_route(&Method::GET, "/internal/assets/asset-id"),
            None
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/assets/asset-id/content"),
            None
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/assets/asset-id/versions/1/content"),
            None
        );
    }

    #[test]
    fn maps_asset_permissions() {
        assert_eq!(
            permission_for_route(&Method::GET, "/api/assets"),
            Some(RoutePermission::AssetRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/assets/upload"),
            Some(RoutePermission::AssetWrite)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/assets/asset-id/analyze"),
            Some(RoutePermission::AssetAnalyze)
        );
        assert_eq!(
            permission_for_route(&Method::DELETE, "/api/assets/asset-id"),
            Some(RoutePermission::AssetDelete)
        );
    }

    #[test]
    fn maps_production_permissions() {
        assert_eq!(
            permission_for_route(&Method::GET, "/api/issues"),
            Some(RoutePermission::ProductionRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/issues/issue-id/comments"),
            Some(RoutePermission::IssueComment)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/issues/issue-id/approve"),
            Some(RoutePermission::IssueReview)
        );
        assert_eq!(
            permission_for_route(&Method::DELETE, "/api/issues/issue-id"),
            Some(RoutePermission::IssueDelete)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/delivery-packages"),
            Some(RoutePermission::DeliveryWrite)
        );
    }

    #[test]
    fn maps_planning_reporting_and_ai_permissions() {
        assert_eq!(
            permission_for_route(&Method::GET, "/api/project-management/gantt"),
            Some(RoutePermission::PlanningRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/project-management/epics"),
            Some(RoutePermission::PlanningWrite)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/project-management/reports"),
            Some(RoutePermission::ReportingRead)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/project-management/enterprise"),
            Some(RoutePermission::EnterpriseAdmin)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/security/audit-events"),
            Some(RoutePermission::EnterpriseAdmin)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/admin/control"),
            Some(RoutePermission::EnterpriseAdmin)
        );
        assert_eq!(
            permission_for_route(&Method::PATCH, "/api/admin/control/settings"),
            Some(RoutePermission::EnterpriseAdmin)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/data-lake/query/sql"),
            Some(RoutePermission::DataLakeQuery)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/management/rag/search"),
            Some(RoutePermission::AiControlRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/management/chat"),
            Some(RoutePermission::AuthenticatedSession)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/management/chat/history"),
            Some(RoutePermission::AuthenticatedSession)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/management/replica-actions"),
            Some(RoutePermission::AiControlWrite)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/wiki/spaces"),
            Some(RoutePermission::WikiRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/wiki/pages/page-id/updates"),
            Some(RoutePermission::WikiWrite)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/design-requirements"),
            Some(RoutePermission::DesignRequirementRead)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/design-requirements/ai/draft"),
            Some(RoutePermission::DesignRequirementAi)
        );
    }

    #[test]
    fn role_matrix_blocks_cross_domain_writes() {
        assert!(role_allows("admin", RoutePermission::EnterpriseAdmin));
        assert!(role_allows("producer", RoutePermission::DeliveryWrite));
        assert!(role_allows("artist", RoutePermission::AssetWrite));
        assert!(role_allows("reviewer", RoutePermission::IssueReview));
        assert!(role_allows("reviewer", RoutePermission::DataLakeQuery));
        assert!(role_allows("manager", RoutePermission::WikiWrite));
        assert!(role_allows("artist", RoutePermission::DesignRequirementAi));

        assert!(!role_allows("artist", RoutePermission::IssueReview));
        assert!(!role_allows("reviewer", RoutePermission::AssetWrite));
        assert!(!role_allows("artist", RoutePermission::DeliveryWrite));
        assert!(!role_allows("producer", RoutePermission::EnterpriseAdmin));
        assert!(!role_allows("viewer", RoutePermission::WikiWrite));
        assert!(!role_allows(
            "reviewer",
            RoutePermission::DesignRequirementAi
        ));
        assert!(!role_allows(
            "unknown",
            RoutePermission::AuthenticatedSession
        ));
    }

    #[test]
    fn maps_people_intelligence_permissions() {
        assert_eq!(
            permission_for_route(&Method::POST, "/api/people/search"),
            Some(RoutePermission::PeopleRead)
        );
        assert_eq!(
            permission_for_route(&Method::PATCH, "/api/people/me"),
            Some(RoutePermission::PeopleWrite)
        );
        assert_eq!(
            permission_for_route(&Method::GET, "/api/people/user-id/evaluation"),
            Some(RoutePermission::PeopleEvaluate)
        );
        assert_eq!(
            permission_for_route(&Method::POST, "/api/people/admin/reindex"),
            Some(RoutePermission::PeopleAdmin)
        );
        assert_eq!(
            permission_for_route(
                &Method::POST,
                "/api/people/admin/capabilities/capability-id/approve"
            ),
            Some(RoutePermission::PeopleAdmin)
        );
        assert!(role_allows("artist", RoutePermission::PeopleEvaluate));
        assert!(!role_allows("client", RoutePermission::PeopleRead));
    }
}
