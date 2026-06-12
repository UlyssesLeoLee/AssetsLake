/*
```cypher
CREATE
  (f:File {name: "asset_if_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::asset_if_service", type: "module"}),
  (c1:Class {name: "AssetIfService", type: "class", language: "rust", signature: "struct AssetIfService"}),
  (c2:Class {name: "AssetReferenceRow", type: "class", language: "rust", signature: "struct AssetReferenceRow"}),
  (c3:Class {name: "InternalAssetEnvelope", type: "class", language: "rust", signature: "struct InternalAssetEnvelope"}),
  (c4:Class {name: "InternalAsset", type: "class", language: "rust", signature: "struct InternalAsset"}),
  (fn1:Function {name: "AssetIfService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "AssetIf::resolve_asset", type: "function", language: "rust"}),
  (fn3:Function {name: "AssetIfService::resolve_local", type: "function", language: "rust", signature: "async fn resolve_local(&self, asset_id: Uuid) -> Result<Option<AssetReference>, AppError>"}),
  (fn4:Function {name: "AssetIfService::resolve_remote", type: "function", language: "rust", signature: "async fn resolve_remote(&self, asset_id: Uuid) -> Result<AssetReference, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4);
```
*/

use std::env;

use serde::Deserialize;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::asset_if::{AssetIf, AssetReference},
};

#[derive(Clone)]
pub struct AssetIfService {
    pool: PgPool,
    client: reqwest::Client,
}

#[derive(FromRow)]
struct AssetReferenceRow {
    id: Uuid,
    name: String,
    asset_type: Option<String>,
    preview_url: Option<String>,
    version: Option<i32>,
}

#[derive(Deserialize)]
struct InternalAssetEnvelope {
    data: InternalAsset,
}

#[derive(Deserialize)]
struct InternalAsset {
    id: Uuid,
    name: String,
    asset_type: Option<String>,
    preview_url: Option<String>,
    version: Option<i32>,
}

impl AssetIfService {
    pub fn new(pool: PgPool) -> Self {
        Self {
            pool,
            client: reqwest::Client::new(),
        }
    }

    async fn resolve_local(&self, asset_id: Uuid) -> Result<Option<AssetReference>, AppError> {
        let row = sqlx::query_as::<_, AssetReferenceRow>(
            r#"
            SELECT asset_id AS id, name, asset_type, preview_url, version
            FROM asset_snapshot
            WHERE asset_id = $1 AND status = 'active'
            UNION ALL
            SELECT id, name, asset_type::text, preview_url, version
            FROM assets
            WHERE id = $1 AND deleted_at IS NULL
            LIMIT 1
            "#,
        )
        .bind(asset_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(|value| AssetReference {
            id: value.id,
            name: value.name,
            asset_type: value.asset_type,
            preview_url: value.preview_url,
            version: value.version,
            verified: true,
        }))
    }

    async fn resolve_remote(&self, asset_id: Uuid) -> Result<AssetReference, AppError> {
        let base_url = env::var("ASSETS_INTERNAL_URL").map_err(|_| {
            AppError::not_found(format!(
                "Asset {} is not available in the local projection and ASSETS_INTERNAL_URL is not configured",
                asset_id
            ))
        })?;
        let token = env::var("INTERNAL_SERVICE_TOKEN")
            .map_err(|_| AppError::forbidden("INTERNAL_SERVICE_TOKEN is not configured"))?;
        let response = self
            .client
            .get(format!(
                "{}/internal/assets/{}",
                base_url.trim_end_matches('/'),
                asset_id
            ))
            .header("x-assetslake-service-token", token)
            .send()
            .await
            .map_err(|error| AppError::internal(error.to_string()))?;

        if response.status().as_u16() == 404 {
            return Err(AppError::not_found(format!("Asset {} not found", asset_id)));
        }
        if !response.status().is_success() {
            return Err(AppError::validation(format!(
                "Asset IF returned HTTP {}",
                response.status()
            )));
        }
        let envelope = response
            .json::<InternalAssetEnvelope>()
            .await
            .map_err(|error| AppError::internal(error.to_string()))?;
        Ok(AssetReference {
            id: envelope.data.id,
            name: envelope.data.name,
            asset_type: envelope.data.asset_type,
            preview_url: envelope.data.preview_url,
            version: envelope.data.version,
            verified: true,
        })
    }
}

impl AssetIf for AssetIfService {
    async fn resolve_asset(&self, asset_id: Uuid) -> Result<AssetReference, AppError> {
        if let Some(asset) = self.resolve_local(asset_id).await? {
            return Ok(asset);
        }
        self.resolve_remote(asset_id).await
    }
}
