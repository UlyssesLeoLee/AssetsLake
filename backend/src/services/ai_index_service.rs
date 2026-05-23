/// AI Index Service stub.
/// Future: connects to Qdrant for vector embedding storage and similarity search.
/// Triggered by the asset_uploaded hook to index new assets automatically.
pub struct AiIndexService {
    enabled: bool,
}

impl AiIndexService {
    pub fn new_stub() -> Self {
        Self { enabled: false }
    }

    /// Enqueue an asset for AI embedding generation.
    /// Future: send to a worker queue (Kafka) that calls an embedding model.
    pub async fn enqueue_embedding(&self, asset_id: uuid::Uuid) {
        if self.enabled {
            tracing::info!(asset_id = %asset_id, "[ai_index] Enqueueing for embedding");
        }
        // TODO: publish to Kafka topic "asset.embedding.request"
    }

    /// Search by vector similarity (semantic / image similarity search).
    /// Future: query Qdrant with a vector and return ranked asset IDs.
    pub async fn vector_search(&self, _query_vector: Vec<f32>, _top_k: usize) -> Vec<uuid::Uuid> {
        // TODO: Qdrant client.search(collection, query_vector, top_k)
        vec![]
    }
}
