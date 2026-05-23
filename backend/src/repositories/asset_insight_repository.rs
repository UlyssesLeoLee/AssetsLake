/*
```cypher
CREATE
  (f:File {name: "asset_insight_repository.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::repositories::asset_insight_repository", type: "module"}),
  (c1:Class {name: "AssetInsightRepository", type: "class", language: "rust", signature: "struct AssetInsightRepository"}),
  (c2:Class {name: "CreateAssetInsightParams", type: "class", language: "rust", signature: "struct CreateAssetInsightParams"}),
  (fn1:Function {name: "AssetInsightRepository::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "AssetInsightRepository::create", type: "function", language: "rust", signature: "async fn create(&self, params: CreateAssetInsightParams) -> Result<AssetAiInsight, AppError>"}),
  (fn3:Function {name: "AssetInsightRepository::list_by_asset", type: "function", language: "rust", signature: "async fn list_by_asset(&self, asset_id: Uuid) -> Result<Vec<AssetAiInsight>, AppError>"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "params", type: "variable"}),
  (v3:Variable {name: "asset_id", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v3);
```
*/

use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{errors::AppError, models::asset::AssetAiInsight};

pub struct AssetInsightRepository {
    pool: PgPool,
}

impl AssetInsightRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create(
        &self,
        params: CreateAssetInsightParams,
    ) -> Result<AssetAiInsight, AppError> {
        sqlx::query_as::<_, AssetAiInsight>(
            r#"
            INSERT INTO asset_ai_insights (
                id, asset_id, modality, provider, model, status, summary,
                labels, detected_text, quality_risks, reuse_suggestions,
                entities, raw_response
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(params.asset_id)
        .bind(&params.modality)
        .bind(&params.provider)
        .bind(&params.model)
        .bind(&params.status)
        .bind(&params.summary)
        .bind(&params.labels)
        .bind(&params.detected_text)
        .bind(&params.quality_risks)
        .bind(&params.reuse_suggestions)
        .bind(&params.entities)
        .bind(&params.raw_response)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn list_by_asset(&self, asset_id: Uuid) -> Result<Vec<AssetAiInsight>, AppError> {
        sqlx::query_as::<_, AssetAiInsight>(
            r#"
            SELECT *
            FROM asset_ai_insights
            WHERE asset_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(asset_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }
}

pub struct CreateAssetInsightParams {
    pub asset_id: Uuid,
    pub modality: String,
    pub provider: String,
    pub model: Option<String>,
    pub status: String,
    pub summary: String,
    pub labels: Vec<String>,
    pub detected_text: Option<String>,
    pub quality_risks: Vec<String>,
    pub reuse_suggestions: Vec<String>,
    pub entities: Value,
    pub raw_response: Value,
}
