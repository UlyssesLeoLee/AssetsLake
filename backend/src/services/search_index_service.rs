/// Search Index Service stub.
/// Future: connects to OpenSearch for full-text tag and metadata search.
pub struct SearchIndexService {
    enabled: bool,
}

impl SearchIndexService {
    pub fn new_stub() -> Self {
        Self { enabled: false }
    }

    /// Index an asset document in OpenSearch.
    pub async fn index_asset(&self, asset_id: uuid::Uuid) {
        if self.enabled {
            tracing::info!(asset_id = %asset_id, "[search_index] Indexing asset");
        }
        // TODO: opensearch client.index("assets", asset_id, document)
    }

    /// Remove an asset from the search index.
    pub async fn remove_asset(&self, asset_id: uuid::Uuid) {
        if self.enabled {
            tracing::info!(asset_id = %asset_id, "[search_index] Removing from index");
        }
        // TODO: opensearch client.delete("assets", asset_id)
    }

    /// Full-text search across tags, descriptions, filenames.
    pub async fn search(&self, _query: &str, _page: i64, _size: i64) -> Vec<uuid::Uuid> {
        // TODO: opensearch query DSL
        vec![]
    }
}
