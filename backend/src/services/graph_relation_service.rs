/// Graph Relation Service stub.
/// Future: connects to Neo4j to model asset dependency graphs.
/// Tracks which assets reference/depend on each other (e.g., a .blend file
/// depending on texture assets, a scene file referencing 3D models).
pub struct GraphRelationService {
    enabled: bool,
}

impl GraphRelationService {
    pub fn new_stub() -> Self {
        Self { enabled: false }
    }

    /// Create a dependency edge: source_id → target_id with a given relation type.
    pub async fn add_dependency(
        &self,
        source_id: uuid::Uuid,
        target_id: uuid::Uuid,
        relation_type: &str,
    ) {
        if self.enabled {
            tracing::info!(
                source = %source_id,
                target = %target_id,
                relation = relation_type,
                "[graph] Adding dependency edge"
            );
        }
        // TODO: Neo4j Bolt: MERGE (a:Asset {id: source_id})-[:DEPENDS_ON {type}]->(b:Asset {id: target_id})
    }

    /// Get all dependencies of an asset (direct and transitive).
    pub async fn get_dependencies(&self, _asset_id: uuid::Uuid) -> Vec<uuid::Uuid> {
        // TODO: Neo4j MATCH (a:Asset {id})-[:DEPENDS_ON*]->(dep) RETURN dep
        vec![]
    }

    /// Get all assets that depend on a given asset.
    pub async fn get_dependents(&self, _asset_id: uuid::Uuid) -> Vec<uuid::Uuid> {
        // TODO: Neo4j MATCH (dep)-[:DEPENDS_ON*]->(a:Asset {id}) RETURN dep
        vec![]
    }
}
