/*
```cypher
CREATE
  (f:File {name: "auth_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::auth_handler", type: "module"}),
  (fn1:Function {name: "login", type: "function", language: "rust", signature: "async fn login(state: web::Data<AppState>, req: HttpRequest, body: web::Json<LoginRequest>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "logout", type: "function", language: "rust", signature: "async fn logout(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "me", type: "function", language: "rust", signature: "async fn me(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "test_accounts", type: "function", language: "rust", signature: "async fn test_accounts(state: web::Data<AppState>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state.auth_service", type: "variable"}),
  (v2:Variable {name: "ApiResponse", type: "variable"}),
  (v3:Variable {name: "state.rate_limit_service", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};

use crate::{
    errors::{ApiResponse, AppError},
    models::auth::{LoginRequest, SessionUserResponse},
    AppState,
};

/// POST /api/auth/login
#[post("/api/auth/login")]
pub async fn login(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<LoginRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    state
        .rate_limit_service
        .check_login(&req, &request_body.username)?;
    let response = state.auth_service.login(request_body).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// POST /api/auth/logout
#[post("/api/auth/logout")]
pub async fn logout(
    state: web::Data<AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    state.auth_service.logout(&req).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({ "success": true })))
}

/// GET /api/auth/me
#[get("/api/auth/me")]
pub async fn me(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, AppError> {
    let context = state.auth_service.authenticate_request(&req).await?;
    Ok(
        HttpResponse::Ok().json(ApiResponse::ok(SessionUserResponse {
            user: context.user,
            session_id: context.session_id,
            expires_at: context.expires_at,
        })),
    )
}

/// GET /api/auth/test-accounts
#[get("/api/auth/test-accounts")]
pub async fn test_accounts(state: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    let accounts = state.auth_service.list_test_accounts().await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(accounts)))
}
