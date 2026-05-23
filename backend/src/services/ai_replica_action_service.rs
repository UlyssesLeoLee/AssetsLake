/*
```cypher
CREATE
  (f:File {name: "ai_replica_action_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::ai_replica_action_service", type: "module"}),
  (c1:Class {name: "AiReplicaActionService", type: "class", language: "rust", signature: "struct AiReplicaActionService"}),
  (c2:Class {name: "AiReplicaActionInput", type: "class", language: "rust", signature: "struct AiReplicaActionInput"}),
  (c3:Class {name: "AiReplicaActionRecord", type: "class", language: "rust", signature: "struct AiReplicaActionRecord"}),
  (fn1:Function {name: "AiReplicaActionService::new", type: "function", language: "rust", signature: "fn new(config: AiReplicaConfig) -> Self"}),
  (fn2:Function {name: "AiReplicaActionService::record_action", type: "function", language: "rust", signature: "async fn record_action(&self, input: AiReplicaActionInput) -> Result<AiReplicaActionRecord, AppError>"}),
  (fn3:Function {name: "AiReplicaActionService::ensure_collection", type: "function", language: "rust", signature: "async fn ensure_collection(&self) -> Result<(), AppError>"}),
  (fn4:Function {name: "AiReplicaActionService::qdrant_url", type: "function", language: "rust", signature: "fn qdrant_url(&self, path: &str) -> String"}),
  (fn5:Function {name: "hash_vector", type: "function", language: "rust", signature: "fn hash_vector(text: &str, size: usize) -> Vec<f32>"}),
  (fn6:Function {name: "vector_norm", type: "function", language: "rust", signature: "fn vector_norm(vector: &[f32]) -> f32"}),
  (fn7:Function {name: "AiReplicaActionService::ensure_replica_local_layout", type: "function", language: "rust", signature: "async fn ensure_replica_local_layout(&self) -> Result<(), AppError>"}),
  (v1:Variable {name: "config", type: "variable"}),
  (v2:Variable {name: "client", type: "variable"}),
  (v3:Variable {name: "payload", type: "variable"}),
  (v4:Variable {name: "vector", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn7),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:CALLS]->(fn7),
  (fn7)-[:CALLS]->(fn4),
  (fn5)-[:CALLS]->(fn6);
```
*/

use std::time::Duration;

use chrono::Utc;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::{config::AiReplicaConfig, errors::AppError};

#[derive(Clone)]
pub struct AiReplicaActionService {
    config: AiReplicaConfig,
    client: reqwest::Client,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AiReplicaActionInput {
    pub action_id: String,
    pub title: String,
    pub app: String,
    pub target_label: String,
    pub intent: String,
    #[serde(default)]
    pub writes: Vec<String>,
    #[serde(default)]
    pub metadata: Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct AiReplicaActionRecord {
    pub vector_id: String,
    pub collection: String,
    pub write_scope: String,
    pub replica_url: String,
    pub status: String,
    pub created_at: String,
}

impl AiReplicaActionService {
    pub fn new(config: AiReplicaConfig) -> Self {
        Self {
            config,
            client: reqwest::Client::builder()
                .connect_timeout(Duration::from_secs(3))
                .timeout(Duration::from_secs(12))
                .build()
                .expect("AI replica action HTTP client should build"),
        }
    }

    pub async fn record_action(
        &self,
        input: AiReplicaActionInput,
    ) -> Result<AiReplicaActionRecord, AppError> {
        if !self.config.enabled {
            return Err(AppError::validation("AI replica writes are disabled"));
        }

        self.ensure_collection().await?;

        let vector_id = Uuid::new_v4().to_string();
        let created_at = Utc::now().to_rfc3339();
        let payload = json!({
            "vector_id": vector_id,
            "write_scope": "replica",
            "actor": "ai-control",
            "action_id": input.action_id,
            "title": input.title,
            "app": input.app,
            "target_label": input.target_label,
            "intent": input.intent,
            "writes": input.writes,
            "metadata": input.metadata,
            "created_at": created_at,
        });
        let vector = hash_vector(&payload.to_string(), self.config.vector_size);

        let response = self
            .client
            .put(self.qdrant_url(&format!(
                "/collections/{}/points?wait=true",
                self.config.collection
            )))
            .json(&json!({
                "points": [{
                    "id": vector_id,
                    "vector": vector,
                    "payload": payload
                }]
            }))
            .send()
            .await
            .map_err(|e| AppError::internal(format!("AI replica action write failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(AppError::internal(format!(
                "AI replica action write returned HTTP {}",
                response.status().as_u16()
            )));
        }

        Ok(AiReplicaActionRecord {
            vector_id,
            collection: self.config.collection.clone(),
            write_scope: "replica".to_string(),
            replica_url: self.config.qdrant_url.clone(),
            status: "recorded".to_string(),
            created_at,
        })
    }

    async fn ensure_collection(&self) -> Result<(), AppError> {
        let url = self.qdrant_url(&format!("/collections/{}", self.config.collection));
        let get_response = self.client.get(&url).send().await.map_err(|e| {
            AppError::internal(format!("AI replica collection check failed: {}", e))
        })?;

        if get_response.status().is_success() {
            self.ensure_replica_local_layout().await?;
            return Ok(());
        }

        if get_response.status() != StatusCode::NOT_FOUND {
            return Err(AppError::internal(format!(
                "AI replica collection check returned HTTP {}",
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
                "shard_number": 1,
                "replication_factor": 1,
                "write_consistency_factor": 1
            }))
            .send()
            .await
            .map_err(|e| {
                AppError::internal(format!("AI replica collection create failed: {}", e))
            })?;

        if create_response.status().is_success() {
            Ok(())
        } else {
            Err(AppError::internal(format!(
                "AI replica collection create returned HTTP {}",
                create_response.status().as_u16()
            )))
        }
    }

    fn qdrant_url(&self, path: &str) -> String {
        format!("{}{}", self.config.qdrant_url.trim_end_matches('/'), path)
    }

    async fn ensure_replica_local_layout(&self) -> Result<(), AppError> {
        let url = self.qdrant_url(&format!("/collections/{}/cluster", self.config.collection));
        let response = self.client.get(&url).send().await.map_err(|e| {
            AppError::internal(format!("AI replica collection layout check failed: {}", e))
        })?;

        if !response.status().is_success() {
            return Ok(());
        }

        let value: Value = response.json().await.map_err(|e| {
            AppError::internal(format!("AI replica collection layout parse failed: {}", e))
        })?;
        let remote_shard_count = value
            .pointer("/result/remote_shards")
            .and_then(Value::as_array)
            .map_or(0, Vec::len);

        if remote_shard_count > 0 {
            return Err(AppError::internal(
                "AI replica action collection is not replica-local; recreate it with shard_number=1 on AI_REPLICA_QDRANT_URL",
            ));
        }

        Ok(())
    }
}

fn hash_vector(text: &str, size: usize) -> Vec<f32> {
    let mut vector = vec![0.0_f32; size.max(1)];
    for (index, byte) in text.bytes().enumerate() {
        let mut hasher = Sha256::new();
        hasher.update([byte]);
        hasher.update(index.to_le_bytes());
        let digest = hasher.finalize();
        let slot = index % vector.len();
        vector[slot] += f32::from(digest[0]) / 255.0;
    }

    let norm = vector_norm(&vector);
    if norm > 0.0 {
        for value in &mut vector {
            *value /= norm;
        }
    }
    vector
}

fn vector_norm(vector: &[f32]) -> f32 {
    vector.iter().map(|value| value * value).sum::<f32>().sqrt()
}
