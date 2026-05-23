/*
```cypher
CREATE
  (f:File {name: "data_lake_query_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::data_lake_query_handler", type: "module"}),
  (fn1:Function {name: "execute_sql_query", type: "function", language: "rust", signature: "async fn execute_sql_query(state: web::Data<AppState>, req: HttpRequest, body: web::Json<LakeQueryRequest>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "execute_cypher_query", type: "function", language: "rust", signature: "async fn execute_cypher_query(state: web::Data<AppState>, req: HttpRequest, body: web::Json<LakeQueryRequest>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "remember_lake_query", type: "function", language: "rust", signature: "async fn remember_lake_query(state: &web::Data<AppState>, req: &HttpRequest, engine: &str, query: &str, row_count: usize)"}),
  (v1:Variable {name: "state", type: "variable"}),
  (v2:Variable {name: "req", type: "variable"}),
  (v3:Variable {name: "response", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3);
```
*/

use actix_web::{post, web, HttpRequest, HttpResponse};
use serde_json::json;

use crate::{
    errors::{ApiResponse, AppError},
    services::{
        ai_provider_service::AiProviderConfig, lake_query_service::LakeQueryRequest,
        rag_memory_service::RagOperationMemoryInput,
    },
    AppState,
};

/// POST /api/data-lake/query/sql
#[post("/api/data-lake/query/sql")]
pub async fn execute_sql_query(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<LakeQueryRequest>,
) -> Result<HttpResponse, AppError> {
    let query = body.query.clone();
    let response = state
        .lake_query_service
        .execute_sql(body.into_inner())
        .await?;
    remember_lake_query(&state, &req, "sql", &query, response.row_count).await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// POST /api/data-lake/query/cypher
#[post("/api/data-lake/query/cypher")]
pub async fn execute_cypher_query(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<LakeQueryRequest>,
) -> Result<HttpResponse, AppError> {
    let query = body.query.clone();
    let response = state
        .lake_query_service
        .execute_cypher(body.into_inner())
        .await?;
    remember_lake_query(&state, &req, "cypher", &query, response.row_count).await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

async fn remember_lake_query(
    state: &web::Data<AppState>,
    req: &HttpRequest,
    engine: &str,
    query: &str,
    row_count: usize,
) {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let result = state
        .rag_memory_service
        .remember_operation(
            ai_config.as_ref(),
            RagOperationMemoryInput::new(
                format!("data_lake.{}_query", engine),
                "Data Lake",
                "query",
            )
            .actor("lake-query-workbench")
            .summary(format!(
                "Executed {} data lake query with {} rows",
                engine, row_count
            ))
            .content(query.to_string())
            .metadata(json!({
                    "engine": engine,
                    "row_count": row_count
            })),
        )
        .await;

    if let Some(error) = result.error {
        tracing::warn!(error = %error, "Data lake query was not stored in RAG memory");
    }
}
