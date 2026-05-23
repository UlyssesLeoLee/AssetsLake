/*
```cypher
CREATE
  (f:File {name: "emergence_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::emergence_handler", type: "module"}),
  (c1:Class {name: "EmergenceMemoryResponse", type: "class", language: "rust", signature: "struct EmergenceMemoryResponse"}),
  (fn1:Function {name: "emergence_snapshot", type: "function", language: "rust", signature: "async fn emergence_snapshot(state: web::Data<AppState>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "remember_emergence_snapshot", type: "function", language: "rust", signature: "async fn remember_emergence_snapshot(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "snapshot_summary", type: "function", language: "rust", signature: "fn snapshot_summary(snapshot: &EmergenceSnapshot) -> String"}),
  (fn4:Function {name: "snapshot_content", type: "function", language: "rust", signature: "fn snapshot_content(snapshot: &EmergenceSnapshot) -> String"}),
  (v1:Variable {name: "state", type: "variable"}),
  (v2:Variable {name: "snapshot", type: "variable"}),
  (v3:Variable {name: "memory", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v2);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Serialize;
use serde_json::json;

use crate::{
    errors::{ApiResponse, AppError},
    services::{
        ai_provider_service::AiProviderConfig,
        emergence_service::EmergenceSnapshot,
        rag_memory_service::{RagMemoryWriteResult, RagOperationMemoryInput},
    },
    AppState,
};

#[derive(Debug, Serialize)]
struct EmergenceMemoryResponse {
    snapshot: EmergenceSnapshot,
    memory: RagMemoryWriteResult,
}

/// GET /api/management/emergence
#[get("/api/management/emergence")]
pub async fn emergence_snapshot(state: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    let snapshot = state.emergence_service.snapshot().await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

/// POST /api/management/emergence/remember
#[post("/api/management/emergence/remember")]
pub async fn remember_emergence_snapshot(
    state: web::Data<AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let snapshot = state.emergence_service.snapshot().await?;
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let memory = state
        .rag_memory_service
        .remember_operation(
            ai_config.as_ref(),
            RagOperationMemoryInput::new(
                "emergence.snapshot.distilled",
                "Emergent Control",
                "operating_snapshot",
            )
            .actor("emergence-engine")
            .summary(snapshot_summary(&snapshot))
            .content(snapshot_content(&snapshot))
            .metadata(json!({
                "posture": snapshot.posture,
                "readiness_percent": snapshot.readiness_percent,
                "evidence_coverage_percent": snapshot.evidence_coverage_percent,
                "flow_health_percent": snapshot.flow_health_percent,
                "ai_readiness_percent": snapshot.ai_readiness_percent,
                "risk_count": snapshot.risk_count,
                "recommendations": snapshot.recommendations,
                "signals": snapshot.signals
            })),
        )
        .await;

    Ok(
        HttpResponse::Ok().json(ApiResponse::ok(EmergenceMemoryResponse {
            snapshot,
            memory,
        })),
    )
}

fn snapshot_summary(snapshot: &EmergenceSnapshot) -> String {
    format!(
        "Emergent operating snapshot: {} posture, {}% readiness, {} risks",
        snapshot.posture, snapshot.readiness_percent, snapshot.risk_count
    )
}

fn snapshot_content(snapshot: &EmergenceSnapshot) -> String {
    let recommendations = snapshot
        .recommendations
        .iter()
        .map(|item| format!("{}: {}", item.title, item.action))
        .collect::<Vec<_>>()
        .join(" | ");
    format!(
        "Evidence {}%, flow {}%, AI {}%. Signals: {}. Recommendations: {}",
        snapshot.evidence_coverage_percent,
        snapshot.flow_health_percent,
        snapshot.ai_readiness_percent,
        snapshot
            .signals
            .iter()
            .map(|signal| format!("{} {}", signal.label, signal.value))
            .collect::<Vec<_>>()
            .join(", "),
        recommendations
    )
}
