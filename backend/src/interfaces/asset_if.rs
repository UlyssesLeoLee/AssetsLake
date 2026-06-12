/*
```cypher
CREATE
  (f:File {name: "asset_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::asset_if", type: "module"}),
  (c1:Class {name: "AssetReference", type: "class", language: "rust", signature: "struct AssetReference"}),
  (c2:Class {name: "AssetIf", type: "class", language: "rust", signature: "trait AssetIf"}),
  (fn1:Function {name: "AssetIf::resolve_asset", type: "function", language: "rust", signature: "async fn resolve_asset(&self, asset_id: Uuid) -> Result<AssetReference, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c2)-[:HAS_METHOD]->(fn1);
```
*/

use uuid::Uuid;

use crate::errors::AppError;

#[derive(Debug, Clone)]
pub struct AssetReference {
    pub id: Uuid,
    pub name: String,
    pub asset_type: Option<String>,
    pub preview_url: Option<String>,
    pub version: Option<i32>,
    pub verified: bool,
}

pub trait AssetIf {
    async fn resolve_asset(&self, asset_id: Uuid) -> Result<AssetReference, AppError>;
}
