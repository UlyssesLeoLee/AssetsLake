/*
```cypher
CREATE
  (f:File {name: "authorization_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::authorization_service", type: "module"}),
  (c1:Class {name: "WritePermission", type: "class", language: "rust", signature: "enum WritePermission"}),
  (fn1:Function {name: "enforce_write_authorization", type: "function", language: "rust", signature: "async fn enforce_write_authorization<B>(req: ServiceRequest, next: Next<B>) -> Result<ServiceResponse<B>, Error>"}),
  (fn2:Function {name: "permission_for_write_path", type: "function", language: "rust", signature: "fn permission_for_write_path(method: &Method, path: &str) -> Option<WritePermission>"}),
  (fn3:Function {name: "is_mutating_method", type: "function", language: "rust", signature: "fn is_mutating_method(method: &Method) -> bool"}),
  (fn4:Function {name: "is_public_write_path", type: "function", language: "rust", signature: "fn is_public_write_path(path: &str) -> bool"}),
  (fn5:Function {name: "role_allows", type: "function", language: "rust", signature: "fn role_allows(role: &str, permission: WritePermission) -> bool"}),
  (fn6:Function {name: "role_name", type: "function", language: "rust", signature: "fn role_name(role: &str) -> String"}),
  (fn7:Function {name: "permission_name", type: "function", language: "rust", signature: "fn permission_name(permission: WritePermission) -> &'static str"}),
  (v1:Variable {name: "req", type: "variable"}),
  (v2:Variable {name: "permission", type: "variable"}),
  (v3:Variable {name: "state", type: "variable"}),
  (v4:Variable {name: "session", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn5)-[:CALLS]->(fn6);
```
*/

use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    http::Method,
    middleware::Next,
    web, Error, HttpMessage,
};

use crate::{errors::AppError, AppState};

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum WritePermission {
    AuthenticatedWrite,
    AssetWrite,
    IssueWrite,
    IssueReview,
    DeliveryWrite,
    ProjectManagementWrite,
    DataLakeQuery,
    AiControl,
    FallbackAdminWrite,
}

pub async fn enforce_write_authorization<B>(
    req: ServiceRequest,
    next: Next<B>,
) -> Result<ServiceResponse<B>, Error>
where
    B: MessageBody + 'static,
{
    let method = req.method().clone();
    let path = req.path().to_string();
    let Some(permission) = permission_for_write_path(&method, &path) else {
        return next.call(req).await;
    };

    let state = req
        .app_data::<web::Data<AppState>>()
        .cloned()
        .ok_or_else(|| AppError::internal("App state is not configured"))?;
    let session = state
        .auth_service
        .authenticate_request(req.request())
        .await?;

    if !role_allows(&session.user.role, permission) {
        return Err(AppError::forbidden(format!(
            "Role {} is not allowed to perform {}",
            role_name(&session.user.role),
            permission_name(permission)
        ))
        .into());
    }

    req.extensions_mut().insert(session);
    next.call(req).await
}

fn permission_for_write_path(method: &Method, path: &str) -> Option<WritePermission> {
    if !is_mutating_method(method) || is_public_write_path(path) {
        return None;
    }

    if path == "/api/auth/logout" || path.starts_with("/api/locks/") {
        return Some(WritePermission::AuthenticatedWrite);
    }

    if path.starts_with("/api/assets/") {
        return Some(WritePermission::AssetWrite);
    }

    if path.starts_with("/api/issues/") || path == "/api/issues" {
        if path.ends_with("/review")
            || path.ends_with("/approve")
            || path.ends_with("/request-revision")
        {
            return Some(WritePermission::IssueReview);
        }
        return Some(WritePermission::IssueWrite);
    }

    if path.starts_with("/api/delivery-packages") {
        return Some(WritePermission::DeliveryWrite);
    }

    if path.starts_with("/api/project-management/") {
        return Some(WritePermission::ProjectManagementWrite);
    }

    if path.starts_with("/api/data-lake/query/") {
        return Some(WritePermission::DataLakeQuery);
    }

    if path.starts_with("/api/management/") {
        return Some(WritePermission::AiControl);
    }

    Some(WritePermission::FallbackAdminWrite)
}

fn is_mutating_method(method: &Method) -> bool {
    matches!(
        method,
        &Method::POST | &Method::PUT | &Method::PATCH | &Method::DELETE
    )
}

fn is_public_write_path(path: &str) -> bool {
    path == "/api/auth/login"
        || path == "/api/verification/challenges"
        || path == "/api/verification/register"
        || path == "/api/verification/password"
        || (path.starts_with("/api/verification/challenges/") && path.ends_with("/verify"))
}

fn role_allows(role: &str, permission: WritePermission) -> bool {
    let role = role_name(role);
    if role == "admin" {
        return true;
    }

    match permission {
        WritePermission::AuthenticatedWrite => {
            matches!(role.as_str(), "producer" | "artist" | "reviewer")
        }
        WritePermission::AssetWrite => matches!(role.as_str(), "producer" | "artist"),
        WritePermission::IssueWrite => matches!(role.as_str(), "producer" | "artist"),
        WritePermission::IssueReview => matches!(role.as_str(), "producer" | "reviewer"),
        WritePermission::DeliveryWrite => role == "producer",
        WritePermission::ProjectManagementWrite => role == "producer",
        WritePermission::DataLakeQuery => matches!(role.as_str(), "producer" | "reviewer"),
        WritePermission::AiControl => role == "producer",
        WritePermission::FallbackAdminWrite => false,
    }
}

fn role_name(role: &str) -> String {
    role.trim().to_ascii_lowercase().replace('_', "-")
}

fn permission_name(permission: WritePermission) -> &'static str {
    match permission {
        WritePermission::AuthenticatedWrite => "authenticated write",
        WritePermission::AssetWrite => "asset write",
        WritePermission::IssueWrite => "issue write",
        WritePermission::IssueReview => "issue review",
        WritePermission::DeliveryWrite => "delivery package write",
        WritePermission::ProjectManagementWrite => "project management write",
        WritePermission::DataLakeQuery => "data lake query",
        WritePermission::AiControl => "AI control",
        WritePermission::FallbackAdminWrite => "admin write",
    }
}
