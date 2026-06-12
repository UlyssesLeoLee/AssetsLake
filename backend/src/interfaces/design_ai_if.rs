/*
```cypher
CREATE
  (f:File {name: "design_ai_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::design_ai_if", type: "module"}),
  (c1:Class {name: "DesignAiConfig", type: "class", language: "rust", signature: "struct DesignAiConfig"}),
  (c2:Class {name: "DesignAiIf", type: "class", language: "rust", signature: "trait DesignAiIf"}),
  (fn1:Function {name: "DesignAiIf::draft_requirement", type: "function", language: "rust", signature: "async fn draft_requirement(&self, config: &DesignAiConfig, prompt: &str, assets: &[AssetReference]) -> Result<DesignAiDraft, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c2)-[:HAS_METHOD]->(fn1);
```
*/

use crate::{
    errors::AppError, interfaces::asset_if::AssetReference,
    models::design_requirement::DesignAiDraft,
};

#[derive(Debug, Clone)]
pub struct DesignAiConfig {
    pub provider: String,
    pub base_url: String,
    pub model: String,
    pub api_key: String,
}

pub trait DesignAiIf {
    async fn draft_requirement(
        &self,
        config: &DesignAiConfig,
        prompt: &str,
        assets: &[AssetReference],
    ) -> Result<DesignAiDraft, AppError>;
}
