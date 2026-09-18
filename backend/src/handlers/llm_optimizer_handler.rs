/*
```cypher
CREATE
  (f:File {name: "llm_optimizer_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::llm_optimizer_handler", type: "module"}),
  (c1:Class {name: "RecordSignalRequest", type: "class", language: "rust", signature: "struct RecordSignalRequest"}),
  (fn1:Function {name: "record_signal", type: "function", language: "rust", signature: "async fn record_signal(state: web::Data<AppState>, req: HttpRequest, body: web::Json<RecordSignalRequest>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "trigger_optimization_run", type: "function", language: "rust", signature: "async fn trigger_optimization_run(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "get_optimizer_status", type: "function", language: "rust", signature: "async fn get_optimizer_status(state: web::Data<AppState>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "get_best_prompt", type: "function", language: "rust", signature: "async fn get_best_prompt(state: web::Data<AppState>, path: web::Path<String>) -> Result<HttpResponse, AppError>"}),
  (fn5:Function {name: "list_prompt_versions", type: "function", language: "rust", signature: "async fn list_prompt_versions(state: web::Data<AppState>, path: web::Path<String>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    services::{
        ai_provider_service::AiProviderConfig,
        llm_optimizer_service::RecordSignalInput,
    },
    AppState,
};

#[derive(Debug, Deserialize)]
pub struct RecordSignalRequest {
    pub operation_type: String,
    pub project_id: Option<Uuid>,
    pub prompt_version_id: Option<Uuid>,
    pub model: String,
    pub quality_score: Option<f32>,
    pub latency_ms: Option<i32>,
    pub tokens_used: Option<i32>,
    pub actor: Option<String>,
    pub metadata: Option<Value>,
}

/// POST /api/llm-optimizer/signal
///
/// Records a telemetry signal emitted after any AI call.  Callers pass the
/// outcome quality (0–1), latency, token usage and a free-form metadata blob.
/// The optimizer aggregates these cross-project to drive continuous prompt
/// improvement.
#[post("/api/llm-optimizer/signal")]
pub async fn record_signal(
    state: web::Data<AppState>,
    _req: HttpRequest,
    body: web::Json<RecordSignalRequest>,
) -> Result<HttpResponse, AppError> {
    let input = RecordSignalInput {
        operation_type: body.operation_type.clone(),
        project_id: body.project_id,
        prompt_version_id: body.prompt_version_id,
        model: body.model.clone(),
        quality_score: body.quality_score,
        latency_ms: body.latency_ms,
        tokens_used: body.tokens_used,
        actor: body.actor.clone().unwrap_or_else(|| "api".to_string()),
        metadata: body.metadata.clone().unwrap_or(serde_json::json!({})),
    };

    let id = state.llm_optimizer_service.record_signal(input).await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(serde_json::json!({ "id": id }))))
}

/// POST /api/llm-optimizer/run
///
/// Manually triggers one full optimization loop run.  If AI credentials are
/// provided via the standard `x-assetslake-ai-*` headers, the loop will
/// generate improved prompt candidates using the AI provider.
#[post("/api/llm-optimizer/run")]
pub async fn trigger_optimization_run(
    state: web::Data<AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let run = state
        .llm_optimizer_service
        .run_optimization_loop(ai_config.as_ref(), "api")
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(run)))
}

/// GET /api/llm-optimizer/status
///
/// Returns a dashboard summary: last run, total signals collected, active and
/// candidate prompt counts, and when the next background run is due.
#[get("/api/llm-optimizer/status")]
pub async fn get_optimizer_status(
    state: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let status = state.llm_optimizer_service.get_loop_status().await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(status)))
}

/// GET /api/llm-optimizer/prompts/{operation_type}
///
/// Retrieves the best validated (active) prompt for the requested operation
/// type.  Returns 404 when no validated prompt exists yet — the caller should
/// use its built-in system prompt and keep emitting signals.
#[get("/api/llm-optimizer/prompts/{operation_type}")]
pub async fn get_best_prompt(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> Result<HttpResponse, AppError> {
    let operation_type = path.into_inner();
    match state
        .llm_optimizer_service
        .get_best_prompt(&operation_type)
        .await?
    {
        Some(prompt) => Ok(HttpResponse::Ok().json(ApiResponse::ok(prompt))),
        None => Err(AppError::not_found(format!(
            "No active prompt found for operation type '{operation_type}'"
        ))),
    }
}

/// GET /api/llm-optimizer/versions/{operation_type}
///
/// Lists all prompt versions (candidate, active, retired) for an operation
/// type, ordered newest first.
#[get("/api/llm-optimizer/versions/{operation_type}")]
pub async fn list_prompt_versions(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> Result<HttpResponse, AppError> {
    let operation_type = path.into_inner();
    let versions = state
        .llm_optimizer_service
        .list_prompt_versions(&operation_type)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(versions)))
}
