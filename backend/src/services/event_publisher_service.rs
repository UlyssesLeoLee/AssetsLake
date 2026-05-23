use serde::Serialize;

/// Event Publisher Service stub.
/// Future: publishes domain events to Kafka for downstream consumers
/// (thumbnail generator, AI tagger, audit pipeline, webhooks).
pub struct EventPublisherService {
    enabled: bool,
}

impl EventPublisherService {
    pub fn new_stub() -> Self {
        Self { enabled: false }
    }

    pub async fn publish<T: Serialize + std::fmt::Debug>(&self, topic: &str, event: &T) {
        if self.enabled {
            tracing::info!(topic, ?event, "[events] Publishing event");
        }
        // TODO: rdkafka producer.send(topic, serde_json::to_string(event))
    }
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
