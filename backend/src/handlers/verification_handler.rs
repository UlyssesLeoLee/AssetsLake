/*
```cypher
CREATE
  (f:File {name: "verification_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::verification_handler", type: "module"}),
  (fn1:Function {name: "app_info", type: "function", language: "rust", signature: "async fn app_info(state: web::Data<AppState>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "start_challenge", type: "function", language: "rust", signature: "async fn start_challenge(state: web::Data<AppState>, req: HttpRequest, body: web::Json<StartVerificationRequest>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "verify_code", type: "function", language: "rust", signature: "async fn verify_code(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<VerifyCodeRequest>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "register", type: "function", language: "rust", signature: "async fn register(state: web::Data<AppState>, body: web::Json<RegisterWithVerificationRequest>) -> Result<HttpResponse, AppError>"}),
  (fn5:Function {name: "change_password", type: "function", language: "rust", signature: "async fn change_password(state: web::Data<AppState>, body: web::Json<ChangePasswordWithVerificationRequest>) -> Result<HttpResponse, AppError>"}),
  (fn6:Function {name: "outbox", type: "function", language: "rust", signature: "async fn outbox(state: web::Data<AppState>, query: web::Query<OutboxQuery>) -> Result<HttpResponse, AppError>"}),
  (c1:Class {name: "OutboxQuery", type: "class", language: "rust", signature: "struct OutboxQuery"}),
  (v1:Variable {name: "state.verification_service", type: "variable"}),
  (v2:Variable {name: "ApiResponse", type: "variable"}),
  (v3:Variable {name: "state.rate_limit_service", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(c1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    models::verification::{
        ChangePasswordWithVerificationRequest, RegisterWithVerificationRequest,
        StartVerificationRequest, VerifyCodeRequest,
    },
    AppState,
};

#[derive(Debug, Deserialize)]
pub struct OutboxQuery {
    pub limit: Option<i64>,
}

/// GET /api/verification/app
#[get("/api/verification/app")]
pub async fn app_info(state: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    let response = state.verification_service.app_info().await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// POST /api/verification/challenges
#[post("/api/verification/challenges")]
pub async fn start_challenge(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<StartVerificationRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let target = request_body
        .email
        .as_deref()
        .or(request_body.phone_number.as_deref())
        .unwrap_or("unknown");
    state
        .rate_limit_service
        .check_verification_challenge(&req, target)?;
    let response = state
        .verification_service
        .start_challenge(request_body)
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(response)))
}

/// POST /api/verification/challenges/{id}/verify
#[post("/api/verification/challenges/{id}/verify")]
pub async fn verify_code(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    body: web::Json<VerifyCodeRequest>,
) -> Result<HttpResponse, AppError> {
    let response = state
        .verification_service
        .verify_code(path.into_inner(), body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// POST /api/verification/register
#[post("/api/verification/register")]
pub async fn register(
    state: web::Data<AppState>,
    body: web::Json<RegisterWithVerificationRequest>,
) -> Result<HttpResponse, AppError> {
    let response = state
        .verification_service
        .register(body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(response)))
}

/// POST /api/verification/password
#[post("/api/verification/password")]
pub async fn change_password(
    state: web::Data<AppState>,
    body: web::Json<ChangePasswordWithVerificationRequest>,
) -> Result<HttpResponse, AppError> {
    let response = state
        .verification_service
        .change_password(body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// GET /api/verification/outbox
#[get("/api/verification/outbox")]
pub async fn outbox(
    state: web::Data<AppState>,
    query: web::Query<OutboxQuery>,
) -> Result<HttpResponse, AppError> {
    let response = state.verification_service.list_outbox(query.limit).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}
