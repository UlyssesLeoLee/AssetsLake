/*
```cypher
CREATE
  (f:File {name: "event_publisher_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::event_publisher_service", type: "module"}),
  (c1:Class {name: "EventPublisherService", type: "class", language: "rust", signature: "struct EventPublisherService"}),
  (c2:Class {name: "DomainEventInput", type: "class", language: "rust", signature: "struct DomainEventInput"}),
  (c3:Class {name: "AssetUploadedEvent", type: "class", language: "rust", signature: "struct AssetUploadedEvent"}),
  (c4:Class {name: "AssetDeletedEvent", type: "class", language: "rust", signature: "struct AssetDeletedEvent"}),
  (fn1:Function {name: "EventPublisherService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool, config: EventPipelineConfig) -> Self"}),
  (fn2:Function {name: "EventPublisherService::stage", type: "function", language: "rust", signature: "pub async fn stage(&self, input: DomainEventInput) -> Result<Uuid, AppError>"}),
  (fn3:Function {name: "EventPublisherService::publish", type: "function", language: "rust", signature: "pub async fn publish<T: Serialize + std::fmt::Debug>(&self, topic: &str, event: &T) -> Result<Uuid, AppError>"}),
  (fn4:Function {name: "EventPublisherService::spawn_outbox_relay", type: "function", language: "rust", signature: "pub fn spawn_outbox_relay(pool: PgPool, config: EventPipelineConfig)"}),
  (fn5:Function {name: "DomainEventInput::new", type: "function", language: "rust", signature: "pub fn new(topic: impl Into<String>, event_type: impl Into<String>, aggregate_type: impl Into<String>, aggregate_id: Uuid, payload: Value) -> Self"}),
  (fn6:Function {name: "DomainEventInput::workspace_id", type: "function", language: "rust", signature: "pub fn workspace_id(mut self, workspace_id: Option<Uuid>) -> Self"}),
  (fn7:Function {name: "DomainEventInput::schema_version", type: "function", language: "rust", signature: "pub fn schema_version(mut self, schema_version: i32) -> Self"}),
  (fn8:Function {name: "DomainEventInput::causation_id", type: "function", language: "rust", signature: "pub fn causation_id(mut self, causation_id: Option<Uuid>) -> Self"}),
  (fn9:Function {name: "DomainEventInput::idempotency_key", type: "function", language: "rust", signature: "pub fn idempotency_key(mut self, idempotency_key: impl Into<String>) -> Self"}),
  (fn10:Function {name: "relay_once", type: "function", language: "rust", signature: "async fn relay_once(pool: &PgPool, config: &EventPipelineConfig) -> Result<(), AppError>"}),
  (fn11:Function {name: "mark_published", type: "function", language: "rust", signature: "async fn mark_published(pool: &PgPool, event_id: Uuid) -> Result<(), AppError>"}),
  (fn12:Function {name: "mark_failed", type: "function", language: "rust", signature: "async fn mark_failed(pool: &PgPool, event_id: Uuid, error: &str) -> Result<(), AppError>"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (v3:Variable {name: "input", type: "variable"}),
  (v4:Variable {name: "event_id", type: "variable"}),
  (v5:Variable {name: "rows", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c2)-[:HAS_METHOD]->(fn5),
  (c2)-[:HAS_METHOD]->(fn6),
  (c2)-[:HAS_METHOD]->(fn7),
  (c2)-[:HAS_METHOD]->(fn8),
  (c2)-[:HAS_METHOD]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn10),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn10)-[:CALLS]->(fn11),
  (fn10)-[:CALLS]->(fn12),
  (fn10)-[:USES]->(v1),
  (fn10)-[:USES]->(v2),
  (fn10)-[:USES]->(v5),
  (fn11)-[:USES]->(v1),
  (fn11)-[:USES]->(v4),
  (fn12)-[:USES]->(v1),
  (fn12)-[:USES]->(v4);
```
*/

use std::time::Duration;

use serde::Serialize;
use serde_json::Value;
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{config::EventPipelineConfig, errors::AppError};

#[derive(Clone)]
pub struct EventPublisherService {
    pool: PgPool,
    config: EventPipelineConfig,
}

#[derive(Debug, Clone)]
pub struct DomainEventInput {
    pub topic: String,
    pub event_type: String,
    pub schema_version: i32,
    pub aggregate_type: String,
    pub aggregate_id: Uuid,
    pub workspace_id: Option<Uuid>,
    pub trace_id: Uuid,
    pub causation_id: Option<Uuid>,
    pub idempotency_key: Option<String>,
    pub payload: Value,
}

impl EventPublisherService {
    pub fn new(pool: PgPool, config: EventPipelineConfig) -> Self {
        Self { pool, config }
    }

    pub async fn stage(&self, input: DomainEventInput) -> Result<Uuid, AppError> {
        let event_id = Uuid::new_v4();
        if !self.config.enabled {
            tracing::debug!(
                event_type = %input.event_type,
                aggregate_id = %input.aggregate_id,
                "Event pipeline disabled; skipping outbox stage"
            );
            return Ok(event_id);
        }

        let idempotency_key = input.idempotency_key.unwrap_or_else(|| {
            format!(
                "{}:{}:{}:{}",
                self.config.service_name, input.event_type, input.aggregate_id, event_id
            )
        });

        sqlx::query(
            r#"
            INSERT INTO outbox_events (
                event_id, event_type, schema_version, producer, aggregate_type,
                aggregate_id, workspace_id, trace_id, causation_id, idempotency_key,
                topic, payload
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (idempotency_key) DO NOTHING
            "#,
        )
        .bind(event_id)
        .bind(input.event_type)
        .bind(input.schema_version)
        .bind(&self.config.service_name)
        .bind(input.aggregate_type)
        .bind(input.aggregate_id)
        .bind(input.workspace_id)
        .bind(input.trace_id)
        .bind(input.causation_id)
        .bind(idempotency_key)
        .bind(input.topic)
        .bind(input.payload)
        .execute(&self.pool)
        .await?;

        Ok(event_id)
    }

    pub async fn publish<T: Serialize + std::fmt::Debug>(
        &self,
        topic: &str,
        event: &T,
    ) -> Result<Uuid, AppError> {
        let payload =
            serde_json::to_value(event).map_err(|error| AppError::internal(error.to_string()))?;
        let input = DomainEventInput::new(topic, topic, "event", Uuid::new_v4(), payload);
        self.stage(input).await
    }

    pub fn spawn_outbox_relay(pool: PgPool, config: EventPipelineConfig) {
        if !config.enabled || !config.outbox_relay_enabled {
            return;
        }

        tokio::spawn(async move {
            let interval = Duration::from_secs(config.poll_interval_seconds.max(1));
            loop {
                if let Err(error) = relay_once(&pool, &config).await {
                    tracing::warn!(error = %error, "Outbox relay pass failed");
                }
                tokio::time::sleep(interval).await;
            }
        });
    }
}

impl DomainEventInput {
    pub fn new(
        topic: impl Into<String>,
        event_type: impl Into<String>,
        aggregate_type: impl Into<String>,
        aggregate_id: Uuid,
        payload: Value,
    ) -> Self {
        Self {
            topic: topic.into(),
            event_type: event_type.into(),
            schema_version: 1,
            aggregate_type: aggregate_type.into(),
            aggregate_id,
            workspace_id: None,
            trace_id: Uuid::new_v4(),
            causation_id: None,
            idempotency_key: None,
            payload,
        }
    }

    pub fn workspace_id(mut self, workspace_id: Option<Uuid>) -> Self {
        self.workspace_id = workspace_id;
        self
    }

    pub fn schema_version(mut self, schema_version: i32) -> Self {
        self.schema_version = schema_version;
        self
    }

    pub fn causation_id(mut self, causation_id: Option<Uuid>) -> Self {
        self.causation_id = causation_id;
        self
    }

    pub fn idempotency_key(mut self, idempotency_key: impl Into<String>) -> Self {
        self.idempotency_key = Some(idempotency_key.into());
        self
    }
}

async fn relay_once(pool: &PgPool, config: &EventPipelineConfig) -> Result<(), AppError> {
    let rows = sqlx::query(
        r#"
        WITH selected AS (
            SELECT event_id
            FROM outbox_events
            WHERE published_at IS NULL
              AND next_attempt_at <= now()
            ORDER BY occurred_at ASC
            LIMIT $1
            FOR UPDATE SKIP LOCKED
        )
        UPDATE outbox_events o
        SET publish_attempts = publish_attempts + 1
        FROM selected
        WHERE o.event_id = selected.event_id
        RETURNING o.event_id, o.topic, o.payload
        "#,
    )
    .bind(config.batch_size.max(1))
    .fetch_all(pool)
    .await?;

    for row in rows {
        let event_id: Uuid = row.try_get("event_id")?;
        let topic: String = row.try_get("topic")?;
        let payload: Value = row.try_get("payload")?;

        if config.dry_run || config.kafka_brokers.is_none() {
            tracing::info!(
                event_id = %event_id,
                topic = %topic,
                payload = %payload,
                "Outbox relay dry-run acknowledged event"
            );
            mark_published(pool, event_id).await?;
        } else {
            mark_failed(
                pool,
                event_id,
                "Kafka client is not linked in this binary; deploy an external outbox relay or enable EVENT_RELAY_DRY_RUN",
            )
            .await?;
        }
    }

    Ok(())
}

async fn mark_published(pool: &PgPool, event_id: Uuid) -> Result<(), AppError> {
    sqlx::query(
        r#"
        UPDATE outbox_events
        SET published_at = now(),
            last_publish_error = NULL
        WHERE event_id = $1
        "#,
    )
    .bind(event_id)
    .execute(pool)
    .await?;
    Ok(())
}

async fn mark_failed(pool: &PgPool, event_id: Uuid, error: &str) -> Result<(), AppError> {
    sqlx::query(
        r#"
        UPDATE outbox_events
        SET last_publish_error = $2,
            next_attempt_at = now() + make_interval(secs => LEAST(300, 5 * publish_attempts))
        WHERE event_id = $1
        "#,
    )
    .bind(event_id)
    .bind(error)
    .execute(pool)
    .await?;
    Ok(())
}

#[allow(dead_code)]
#[derive(Debug, Serialize)]
pub struct AssetUploadedEvent {
    pub asset_id: uuid::Uuid,
    pub bucket: String,
    pub object_key: String,
    pub mime_type: String,
    pub uploader: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize)]
pub struct AssetDeletedEvent {
    pub asset_id: uuid::Uuid,
    pub deleted_by: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}
