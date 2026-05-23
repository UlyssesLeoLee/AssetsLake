/*
```cypher
CREATE
  (f:File {name: "asset_analysis_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::asset_analysis_handler", type: "module"}),
  (fn1:Function {name: "analyze_asset", type: "function", language: "rust", signature: "async fn analyze_asset(state: web::Data<AppState>, req: HttpRequest, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "list_asset_insights", type: "function", language: "rust", signature: "async fn list_asset_insights(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "remember_asset_insight", type: "function", language: "rust", signature: "async fn remember_asset_insight(state: &web::Data<AppState>, req: &HttpRequest, output: &AssetAnalysisOutput) -> bool"}),
  (v1:Variable {name: "state", type: "variable"}),
  (v2:Variable {name: "req", type: "variable"}),
  (v3:Variable {name: "output", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde_json::json;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    models::asset::AnalyzeAssetResponse,
    services::{
        ai_provider_service::AiProviderConfig, asset_analysis_service::AssetAnalysisOutput,
        rag_memory_service::RagOperationMemoryInput,
    },
    AppState,
};

#[post("/api/assets/{id}/analyze")]
pub async fn analyze_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "asset", *path)
        .await?;
    let output = state
        .asset_analysis_service
        .analyze_asset(*path, ai_config.as_ref())
        .await?;
    let rag_stored = remember_asset_insight(&state, &req, &output).await;

    Ok(
        HttpResponse::Ok().json(ApiResponse::ok(AnalyzeAssetResponse {
            asset: output.asset,
            insight: output.insight,
            rag_stored,
        })),
    )
}

#[get("/api/assets/{id}/insights")]
pub async fn list_asset_insights(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let insights = state.asset_analysis_service.list_insights(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(insights)))
}

async fn remember_asset_insight(
    state: &web::Data<AppState>,
    req: &HttpRequest,
    output: &AssetAnalysisOutput,
) -> bool {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let result = state
        .rag_memory_service
        .remember_operation(
            ai_config.as_ref(),
            RagOperationMemoryInput::new("asset.ai_insight.created", "Data Lake", "asset")
                .entity_id(Some(output.asset.id))
                .actor("ai-multimodal-indexer")
                .summary(format!("AI analyzed asset {}", output.asset.name))
                .content(format!(
                    "Summary: {} Labels: {} Risks: {} Suggestions: {}",
                    output.insight.summary,
                    output.insight.labels.join(", "),
                    output.insight.quality_risks.join(", "),
                    output.insight.reuse_suggestions.join(", ")
                ))
                .metadata(json!({
                    "asset_id": output.asset.id,
                    "insight_id": output.insight.id,
                    "modality": output.insight.modality,
                    "provider": output.insight.provider,
                    "status": output.insight.status
                })),
        )
        .await;

    if let Some(error) = result.error {
        tracing::warn!(error = %error, "Asset AI insight was not stored in RAG memory");
    }
    result.stored
}
