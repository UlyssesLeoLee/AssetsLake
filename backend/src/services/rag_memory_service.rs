/*
```cypher
CREATE
  (f:File {name: "rag_memory_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::rag_memory_service", type: "module"}),
  (c1:Class {name: "RagOperationMemoryInput", type: "class", language: "rust", signature: "struct RagOperationMemoryInput"}),
  (c2:Class {name: "RagMemoryWriteResult", type: "class", language: "rust", signature: "struct RagMemoryWriteResult"}),
  (c3:Class {name: "RagSearchRequest", type: "class", language: "rust", signature: "struct RagSearchRequest"}),
  (c4:Class {name: "RagSearchResponse", type: "class", language: "rust", signature: "struct RagSearchResponse"}),
  (c5:Class {name: "RagMemoryMatch", type: "class", language: "rust", signature: "struct RagMemoryMatch"}),
  (c6:Class {name: "RagMemoryService", type: "class", language: "rust", signature: "struct RagMemoryService"}),
  (c7:Class {name: "QdrantPoint", type: "class", language: "rust", signature: "struct QdrantPoint"}),
  (c8:Class {name: "QdrantUpsertRequest", type: "class", language: "rust", signature: "struct QdrantUpsertRequest"}),
  (c9:Class {name: "QdrantSearchRequest", type: "class", language: "rust", signature: "struct QdrantSearchRequest"}),
  (c10:Class {name: "QdrantApiResponse", type: "class", language: "rust", signature: "struct QdrantApiResponse<T>"}),
  (c11:Class {name: "QdrantScoredPoint", type: "class", language: "rust", signature: "struct QdrantScoredPoint"}),
  (c12:Class {name: "PersistedRagMemoryRecord", type: "class", language: "rust", signature: "struct PersistedRagMemoryRecord<'a>"}),
  (fn1:Function {name: "RagOperationMemoryInput::new", type: "function", language: "rust", signature: "fn new(operation_type: impl Into<String>, app: impl Into<String>, entity_type: impl Into<String>) -> Self"}),
  (fn2:Function {name: "RagMemoryService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool, config: RagMemoryConfig) -> Self"}),
  (fn3:Function {name: "RagMemoryService::remember_operation", type: "function", language: "rust", signature: "async fn remember_operation(&self, ai_config: Option<&AiProviderConfig>, input: RagOperationMemoryInput) -> RagMemoryWriteResult"}),
  (fn4:Function {name: "RagMemoryService::search", type: "function", language: "rust", signature: "async fn search(&self, ai_config: Option<&AiProviderConfig>, request: RagSearchRequest) -> Result<RagSearchResponse, AppError>"}),
  (fn5:Function {name: "RagMemoryService::build_embedding", type: "function", language: "rust", signature: "async fn build_embedding(&self, ai_config: Option<&AiProviderConfig>, text: &str, input_type: &str) -> (Vec<f32>, String, Option<String>)"}),
  (fn6:Function {name: "RagMemoryService::ensure_collection", type: "function", language: "rust", signature: "async fn ensure_collection(&self) -> Result<(), AppError>"}),
  (fn7:Function {name: "RagMemoryService::upsert_point", type: "function", language: "rust", signature: "async fn upsert_point(&self, vector_id: &str, vector: Vec<f32>, payload: Value) -> Result<(), AppError>"}),
  (fn8:Function {name: "RagMemoryService::search_points", type: "function", language: "rust", signature: "async fn search_points(&self, vector: Vec<f32>, limit: u64) -> Result<Vec<RagMemoryMatch>, AppError>"}),
  (fn9:Function {name: "RagMemoryService::persist_record", type: "function", language: "rust", signature: "async fn persist_record(&self, record: PersistedRagMemoryRecord<'_>) -> Result<(), AppError>"}),
  (fn10:Function {name: "RagMemoryService::qdrant_url", type: "function", language: "rust", signature: "fn qdrant_url(&self, path: &str) -> String"}),
  (fn11:Function {name: "normalize_vector", type: "function", language: "rust", signature: "fn normalize_vector(vector: Vec<f32>, size: usize) -> Vec<f32>"}),
  (fn12:Function {name: "hash_embedding", type: "function", language: "rust", signature: "fn hash_embedding(text: &str, size: usize) -> Vec<f32>"}),
  (fn13:Function {name: "vector_norm", type: "function", language: "rust", signature: "fn vector_norm(vector: &[f32]) -> f32"}),
  (fn14:Function {name: "payload_str", type: "function", language: "rust", signature: "fn payload_str(payload: &Value, key: &str) -> String"}),
  (fn15:Function {name: "payload_uuid", type: "function", language: "rust", signature: "fn payload_uuid(payload: &Value, key: &str) -> Option<Uuid>"}),
  (fn16:Function {name: "qdrant_point_id", type: "function", language: "rust", signature: "fn qdrant_point_id(value: &Value) -> String"}),
  (fn17:Function {name: "RagOperationMemoryInput::entity_id", type: "function", language: "rust", signature: "fn entity_id(mut self, entity_id: Option<Uuid>) -> Self"}),
  (fn18:Function {name: "RagOperationMemoryInput::actor", type: "function", language: "rust", signature: "fn actor(mut self, actor: impl Into<String>) -> Self"}),
  (fn19:Function {name: "RagOperationMemoryInput::summary", type: "function", language: "rust", signature: "fn summary(mut self, summary: impl Into<String>) -> Self"}),
  (fn20:Function {name: "RagOperationMemoryInput::content", type: "function", language: "rust", signature: "fn content(mut self, content: impl Into<String>) -> Self"}),
  (fn21:Function {name: "RagOperationMemoryInput::metadata", type: "function", language: "rust", signature: "fn metadata(mut self, metadata: Value) -> Self"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (v3:Variable {name: "client", type: "variable"}),
  (v4:Variable {name: "payload", type: "variable"}),
  (v5:Variable {name: "vector", type: "variable"}),
  (v6:Variable {name: "record", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(c12),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn17),
  (c1)-[:HAS_METHOD]->(fn18),
  (c1)-[:HAS_METHOD]->(fn19),
  (c1)-[:HAS_METHOD]->(fn20),
  (c1)-[:HAS_METHOD]->(fn21),
  (c6)-[:HAS_METHOD]->(fn2),
  (c6)-[:HAS_METHOD]->(fn3),
  (c6)-[:HAS_METHOD]->(fn4),
  (c6)-[:HAS_METHOD]->(fn5),
  (c6)-[:HAS_METHOD]->(fn6),
  (c6)-[:HAS_METHOD]->(fn7),
  (c6)-[:HAS_METHOD]->(fn8),
  (c6)-[:HAS_METHOD]->(fn9),
  (c6)-[:HAS_METHOD]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn6),
  (fn3)-[:CALLS]->(fn7),
  (fn3)-[:CALLS]->(fn9),
  (fn3)-[:USES]->(v4),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn5),
  (fn4)-[:CALLS]->(fn6),
  (fn4)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn11),
  (fn5)-[:CALLS]->(fn12),
  (fn6)-[:CALLS]->(fn10),
  (fn7)-[:CALLS]->(fn10),
  (fn8)-[:CALLS]->(fn10),
  (fn8)-[:CALLS]->(fn14),
  (fn8)-[:CALLS]->(fn15),
  (fn8)-[:CALLS]->(fn16),
  (fn9)-[:USES]->(v6),
  (fn11)-[:CALLS]->(fn13),
  (fn12)-[:CALLS]->(fn11),
  (fn15)-[:CALLS]->(fn14);
```
*/

use std::time::Duration;

use chrono::{DateTime, Utc};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    config::RagMemoryConfig,
    errors::AppError,
    services::ai_provider_service::{AiProviderConfig, AiProviderService},
};

#[derive(Debug, Clone)]
pub struct RagOperationMemoryInput {
    pub id: Uuid,
    pub operation_type: String,
    pub app: String,
    pub entity_type: String,
    pub entity_id: Option<Uuid>,
    pub actor: String,
    pub summary: String,
    pub content: String,
    pub metadata: Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct RagMemoryWriteResult {
    pub enabled: bool,
    pub stored: bool,
    pub vector_id: Option<String>,
    pub collection: String,
    pub embedding_provider: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RagSearchRequest {
    pub query: String,
    pub limit: Option<u64>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RagSearchResponse {
    pub qdrant_enabled: bool,
    pub collection: String,
    pub embedding_provider: String,
    pub matches: Vec<RagMemoryMatch>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RagMemoryMatch {
    pub id: String,
    pub score: f32,
    pub operation_type: String,
    pub app: String,
    pub entity_type: String,
    pub entity_id: Option<Uuid>,
    pub actor: String,
    pub summary: String,
    pub content: String,
    pub metadata: Value,
    pub created_at: Option<String>,
}

#[derive(Clone)]
pub struct RagMemoryService {
    pool: PgPool,
    config: RagMemoryConfig,
    client: reqwest::Client,
}

#[derive(Serialize)]
struct QdrantPoint {
    id: String,
    vector: Vec<f32>,
    payload: Value,
}

#[derive(Serialize)]
struct QdrantUpsertRequest {
    points: Vec<QdrantPoint>,
}

#[derive(Serialize)]
struct QdrantSearchRequest {
    vector: Vec<f32>,
    limit: u64,
    with_payload: bool,
}

#[derive(Deserialize)]
struct QdrantApiResponse<T> {
    result: T,
}

#[derive(Deserialize)]
struct QdrantScoredPoint {
    id: Value,
    score: f32,
    payload: Option<Value>,
}

struct PersistedRagMemoryRecord<'a> {
    vector_id: &'a str,
    payload: &'a Value,
    embedding_provider: &'a str,
    embedding_model: Option<&'a str>,
    indexed: bool,
    error: Option<&'a str>,
    created_at: DateTime<Utc>,
}

impl RagOperationMemoryInput {
    pub fn new(
        operation_type: impl Into<String>,
        app: impl Into<String>,
        entity_type: impl Into<String>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            operation_type: operation_type.into(),
            app: app.into(),
            entity_type: entity_type.into(),
            entity_id: None,
            actor: "system".to_string(),
            summary: String::new(),
            content: String::new(),
            metadata: json!({}),
        }
    }

    pub fn entity_id(mut self, entity_id: Option<Uuid>) -> Self {
        self.entity_id = entity_id;
        self
    }

    pub fn actor(mut self, actor: impl Into<String>) -> Self {
        self.actor = actor.into();
        self
    }

    pub fn summary(mut self, summary: impl Into<String>) -> Self {
        self.summary = summary.into();
        self
    }

    pub fn content(mut self, content: impl Into<String>) -> Self {
        self.content = content.into();
        self
    }

    pub fn metadata(mut self, metadata: Value) -> Self {
        self.metadata = metadata;
        self
    }
}

impl RagMemoryService {
    pub fn new(pool: PgPool, config: RagMemoryConfig) -> Self {
        let mut normalized_config = config;
        normalized_config.vector_size = normalized_config.vector_size.clamp(8, 4096);

        Self {
            pool,
            config: normalized_config,
            client: reqwest::Client::builder()
                .connect_timeout(Duration::from_secs(3))
                .timeout(Duration::from_secs(8))
                .build()
                .expect("RAG memory HTTP client should build"),
        }
    }

    pub async fn remember_operation(
        &self,
        ai_config: Option<&AiProviderConfig>,
        input: RagOperationMemoryInput,
    ) -> RagMemoryWriteResult {
        let vector_id = input.id.to_string();
        if !self.config.enabled {
            return RagMemoryWriteResult {
                enabled: false,
                stored: false,
                vector_id: Some(vector_id),
                collection: self.config.collection.clone(),
                embedding_provider: None,
                error: None,
            };
        }

        let text = format!("{}\n\n{}", input.summary, input.content);
        let (vector, embedding_provider, embedding_model) =
            self.build_embedding(ai_config, &text, "passage").await;
        let created_at = Utc::now();
        let payload = json!({
            "memory_id": vector_id,
            "operation_type": input.operation_type,
            "app": input.app,
            "entity_type": input.entity_type,
            "entity_id": input.entity_id.map(|id| id.to_string()),
            "actor": input.actor,
            "summary": input.summary,
            "content": input.content,
            "metadata": input.metadata,
            "created_at": created_at.to_rfc3339(),
        });

        let write_result = async {
            self.ensure_collection().await?;
            self.upsert_point(&vector_id, vector, payload.clone()).await
        }
        .await;

        let (stored, error) = match write_result {
            Ok(()) => (true, None),
            Err(error) => {
                let message = error.to_string();
                tracing::warn!(error = %message, "RAG operation memory write failed");
                (false, Some(message))
            }
        };

        if let Err(error) = self
            .persist_record(PersistedRagMemoryRecord {
                vector_id: &vector_id,
                payload: &payload,
                embedding_provider: &embedding_provider,
                embedding_model: embedding_model.as_deref(),
                indexed: stored,
                error: error.as_deref(),
                created_at,
            })
            .await
        {
            tracing::warn!(error = %error, "RAG operation memory persistence failed");
        }

        RagMemoryWriteResult {
            enabled: true,
            stored,
            vector_id: Some(vector_id),
            collection: self.config.collection.clone(),
            embedding_provider: Some(embedding_provider),
            error,
        }
    }

    pub async fn search(
        &self,
        ai_config: Option<&AiProviderConfig>,
        request: RagSearchRequest,
    ) -> Result<RagSearchResponse, AppError> {
        if !self.config.enabled {
            return Ok(RagSearchResponse {
                qdrant_enabled: false,
                collection: self.config.collection.clone(),
                embedding_provider: "disabled".to_string(),
                matches: Vec::new(),
            });
        }

        let limit = request.limit.unwrap_or(5).clamp(1, 12);
        let (vector, embedding_provider, _) = self
            .build_embedding(ai_config, request.query.trim(), "query")
            .await;
        self.ensure_collection().await?;
        let matches = self.search_points(vector, limit).await?;

        Ok(RagSearchResponse {
            qdrant_enabled: true,
            collection: self.config.collection.clone(),
            embedding_provider,
            matches,
        })
    }

    async fn build_embedding(
        &self,
        ai_config: Option<&AiProviderConfig>,
        text: &str,
        input_type: &str,
    ) -> (Vec<f32>, String, Option<String>) {
        if let Some(config) = ai_config {
            let ai_provider = AiProviderService::new();
            let embedding_result = if input_type == "query" {
                ai_provider.embed_text(config, text).await
            } else {
                ai_provider
                    .embed_text_with_input_type(config, text, input_type)
                    .await
            };

            match embedding_result {
                Ok(vector) if !vector.is_empty() => {
                    return (
                        normalize_vector(vector, self.config.vector_size),
                        "ai_provider".to_string(),
                        Some(config.embedding_model.clone()),
                    );
                }
                Ok(_) => {
                    tracing::warn!(
                        "AI provider returned an empty embedding; using local hash vector"
                    );
                }
                Err(error) => {
                    tracing::warn!(
                        provider = %config.provider,
                        model = %config.embedding_model,
                        error = %error,
                        "AI embedding failed; using local hash vector"
                    );
                }
            }
        }

        (
            hash_embedding(text, self.config.vector_size),
            "local_hash".to_string(),
            None,
        )
    }

    async fn ensure_collection(&self) -> Result<(), AppError> {
        let url = self.qdrant_url(&format!("/collections/{}", self.config.collection));
        let get_response =
            self.client.get(&url).send().await.map_err(|e| {
                AppError::internal(format!("Qdrant collection check failed: {}", e))
            })?;

        if get_response.status().is_success() {
            return Ok(());
        }

        if get_response.status() != StatusCode::NOT_FOUND {
            return Err(AppError::internal(format!(
                "Qdrant collection check returned HTTP {}",
                get_response.status().as_u16()
            )));
        }

        let create_response = self
            .client
            .put(&url)
            .json(&json!({
                "vectors": {
                    "size": self.config.vector_size,
                    "distance": "Cosine"
                },
                "replication_factor": self.config.replication_factor,
                "write_consistency_factor": 1
            }))
            .send()
            .await
            .map_err(|e| AppError::internal(format!("Qdrant collection create failed: {}", e)))?;

        if create_response.status().is_success() {
            Ok(())
        } else {
            Err(AppError::internal(format!(
                "Qdrant collection create returned HTTP {}",
                create_response.status().as_u16()
            )))
        }
    }

    async fn upsert_point(
        &self,
        vector_id: &str,
        vector: Vec<f32>,
        payload: Value,
    ) -> Result<(), AppError> {
        let url = self.qdrant_url(&format!(
            "/collections/{}/points?wait=true",
            self.config.collection
        ));
        let response = self
            .client
            .put(url)
            .json(&QdrantUpsertRequest {
                points: vec![QdrantPoint {
                    id: vector_id.to_string(),
                    vector,
                    payload,
                }],
            })
            .send()
            .await
            .map_err(|e| AppError::internal(format!("Qdrant point upsert failed: {}", e)))?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(AppError::internal(format!(
                "Qdrant point upsert returned HTTP {}",
                response.status().as_u16()
            )))
        }
    }

    async fn search_points(
        &self,
        vector: Vec<f32>,
        limit: u64,
    ) -> Result<Vec<RagMemoryMatch>, AppError> {
        let url = self.qdrant_url(&format!(
            "/collections/{}/points/search",
            self.config.collection
        ));
        let response = self
            .client
            .post(url)
            .json(&QdrantSearchRequest {
                vector,
                limit,
                with_payload: true,
            })
            .send()
            .await
            .map_err(|e| AppError::internal(format!("Qdrant search failed: {}", e)))?;
        let status = response.status();
        let body = response
            .text()
            .await
            .map_err(|e| AppError::internal(format!("Qdrant search response failed: {}", e)))?;

        if !status.is_success() {
            return Err(AppError::internal(format!(
                "Qdrant search returned HTTP {}",
                status.as_u16()
            )));
        }

        let decoded: QdrantApiResponse<Vec<QdrantScoredPoint>> = serde_json::from_str(&body)
            .map_err(|e| {
                AppError::internal(format!("Qdrant search response was not JSON: {}", e))
            })?;

        Ok(decoded
            .result
            .into_iter()
            .map(|point| {
                let payload = point.payload.unwrap_or_else(|| json!({}));
                RagMemoryMatch {
                    id: payload_str(&payload, "memory_id")
                        .trim()
                        .to_string()
                        .if_empty(|| qdrant_point_id(&point.id)),
                    score: point.score,
                    operation_type: payload_str(&payload, "operation_type"),
                    app: payload_str(&payload, "app"),
                    entity_type: payload_str(&payload, "entity_type"),
                    entity_id: payload_uuid(&payload, "entity_id"),
                    actor: payload_str(&payload, "actor"),
                    summary: payload_str(&payload, "summary"),
                    content: payload_str(&payload, "content"),
                    metadata: payload
                        .get("metadata")
                        .cloned()
                        .unwrap_or_else(|| json!({})),
                    created_at: payload
                        .get("created_at")
                        .and_then(Value::as_str)
                        .map(ToOwned::to_owned),
                }
            })
            .collect())
    }

    async fn persist_record(&self, record: PersistedRagMemoryRecord<'_>) -> Result<(), AppError> {
        let indexed_at = record.indexed.then(Utc::now);
        sqlx::query(
            r#"
            INSERT INTO rag_operation_memories (
                id, vector_id, operation_type, app, entity_type, entity_id, actor,
                summary, content, embedding_provider, embedding_model, qdrant_collection,
                payload, created_at, indexed_at, error
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            ON CONFLICT (vector_id) DO UPDATE SET
                operation_type = EXCLUDED.operation_type,
                app = EXCLUDED.app,
                entity_type = EXCLUDED.entity_type,
                entity_id = EXCLUDED.entity_id,
                actor = EXCLUDED.actor,
                summary = EXCLUDED.summary,
                content = EXCLUDED.content,
                embedding_provider = EXCLUDED.embedding_provider,
                embedding_model = EXCLUDED.embedding_model,
                qdrant_collection = EXCLUDED.qdrant_collection,
                payload = EXCLUDED.payload,
                indexed_at = EXCLUDED.indexed_at,
                error = EXCLUDED.error
            "#,
        )
        .bind(payload_uuid(record.payload, "memory_id").unwrap_or_else(Uuid::new_v4))
        .bind(record.vector_id)
        .bind(payload_str(record.payload, "operation_type"))
        .bind(payload_str(record.payload, "app"))
        .bind(payload_str(record.payload, "entity_type"))
        .bind(payload_uuid(record.payload, "entity_id"))
        .bind(payload_str(record.payload, "actor"))
        .bind(payload_str(record.payload, "summary"))
        .bind(payload_str(record.payload, "content"))
        .bind(record.embedding_provider)
        .bind(record.embedding_model)
        .bind(&self.config.collection)
        .bind(record.payload)
        .bind(record.created_at)
        .bind(indexed_at)
        .bind(record.error)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    fn qdrant_url(&self, path: &str) -> String {
        format!(
            "{}/{}",
            self.config.qdrant_url.trim_end_matches('/'),
            path.trim_start_matches('/')
        )
    }
}

trait EmptyStringFallback {
    fn if_empty(self, fallback: impl FnOnce() -> String) -> String;
}

impl EmptyStringFallback for String {
    fn if_empty(self, fallback: impl FnOnce() -> String) -> String {
        if self.is_empty() {
            fallback()
        } else {
            self
        }
    }
}

fn normalize_vector(mut vector: Vec<f32>, size: usize) -> Vec<f32> {
    vector.truncate(size);
    if vector.len() < size {
        vector.resize(size, 0.0);
    }

    let norm = vector_norm(&vector);
    if norm <= f32::EPSILON {
        if let Some(first) = vector.first_mut() {
            *first = 1.0;
        }
        return vector;
    }

    vector.into_iter().map(|value| value / norm).collect()
}

fn hash_embedding(text: &str, size: usize) -> Vec<f32> {
    let mut vector = vec![0.0; size];
    for token in text
        .split(|c: char| !c.is_alphanumeric())
        .map(str::trim)
        .filter(|token| !token.is_empty())
    {
        let digest = Sha256::digest(token.to_ascii_lowercase().as_bytes());
        let mut index_bytes = [0_u8; 8];
        index_bytes.copy_from_slice(&digest[..8]);
        let index = (u64::from_le_bytes(index_bytes) as usize) % size;
        let sign = if digest[8] & 1 == 0 { 1.0 } else { -1.0 };
        vector[index] += sign;
    }

    if vector_norm(&vector) <= f32::EPSILON {
        let digest = Sha256::digest(text.as_bytes());
        for (index, byte) in digest.iter().enumerate() {
            vector[index % size] += (*byte as f32 / 255.0) - 0.5;
        }
    }

    normalize_vector(vector, size)
}

fn vector_norm(vector: &[f32]) -> f32 {
    vector.iter().map(|value| value * value).sum::<f32>().sqrt()
}

fn payload_str(payload: &Value, key: &str) -> String {
    payload
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string()
}

fn payload_uuid(payload: &Value, key: &str) -> Option<Uuid> {
    payload
        .get(key)
        .and_then(Value::as_str)
        .and_then(|value| Uuid::parse_str(value).ok())
}

fn qdrant_point_id(value: &Value) -> String {
    match value {
        Value::String(text) => text.clone(),
        Value::Number(number) => number.to_string(),
        other => other.to_string(),
    }
}
