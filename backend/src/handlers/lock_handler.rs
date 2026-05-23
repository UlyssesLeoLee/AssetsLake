/*
```cypher
CREATE
  (f:File {name: "lock_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::lock_handler", type: "module"}),
  (fn1:Function {name: "acquire_lock", type: "function", language: "rust", signature: "async fn acquire_lock(state: web::Data<AppState>, req: HttpRequest, body: web::Json<AcquireLockRequest>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "renew_lock", type: "function", language: "rust", signature: "async fn renew_lock(state: web::Data<AppState>, req: HttpRequest, body: web::Json<RenewLockRequest>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "release_lock", type: "function", language: "rust", signature: "async fn release_lock(state: web::Data<AppState>, req: HttpRequest, body: web::Json<ReleaseLockRequest>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "current_lock", type: "function", language: "rust", signature: "async fn current_lock(state: web::Data<AppState>, req: HttpRequest, path: web::Path<(String, Uuid)>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state.resource_lock_service", type: "variable"}),
  (v2:Variable {name: "ApiResponse", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    models::auth::{AcquireLockRequest, LockStatusResponse, ReleaseLockRequest, RenewLockRequest},
    AppState,
};

/// POST /api/locks/acquire
#[post("/api/locks/acquire")]
pub async fn acquire_lock(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<AcquireLockRequest>,
) -> Result<HttpResponse, AppError> {
    let lock = state
        .resource_lock_service
        .acquire(&req, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(lock)))
}

/// POST /api/locks/renew
#[post("/api/locks/renew")]
pub async fn renew_lock(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<RenewLockRequest>,
) -> Result<HttpResponse, AppError> {
    let lock = state
        .resource_lock_service
        .renew(&req, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(lock)))
}

/// POST /api/locks/release
#[post("/api/locks/release")]
pub async fn release_lock(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<ReleaseLockRequest>,
) -> Result<HttpResponse, AppError> {
    let lock = state
        .resource_lock_service
        .release(&req, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(lock)))
}

/// GET /api/locks/{resource_type}/{resource_id}
#[get("/api/locks/{resource_type}/{resource_id}")]
pub async fn current_lock(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<(String, Uuid)>,
) -> Result<HttpResponse, AppError> {
    let context = state.auth_service.authenticate_request(&req).await?;
    let (resource_type, resource_id) = path.into_inner();
    let mut lock = state
        .resource_lock_service
        .current(&resource_type, resource_id)
        .await?;

    if let Some(active_lock) = lock.as_mut() {
        if active_lock.session_id != context.session_id {
            active_lock.lock_token.clear();
        }
    }

    Ok(HttpResponse::Ok().json(ApiResponse::ok(LockStatusResponse {
        locked: lock.is_some(),
        lock,
    })))
}
