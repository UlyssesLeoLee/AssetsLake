/*
```cypher
CREATE
  (f:File {name: "design_ai_if_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::design_ai_if_service", type: "module"}),
  (c1:Class {name: "DesignAiIfService", type: "class", language: "rust", signature: "struct DesignAiIfService"}),
  (fn1:Function {name: "DesignAiIfService::new", type: "function", language: "rust", signature: "fn new() -> Self"}),
  (fn2:Function {name: "DesignAiIf::draft_requirement", type: "function", language: "rust"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2);
```
*/

use crate::{
    errors::AppError,
    interfaces::{
        asset_if::AssetReference,
        design_ai_if::{DesignAiConfig, DesignAiIf},
    },
    models::design_requirement::DesignAiDraft,
    services::ai_provider_service::{AiProviderConfig, AiProviderService},
};

pub struct DesignAiIfService {
    provider: AiProviderService,
}

impl DesignAiIfService {
    pub fn new() -> Self {
        Self {
            provider: AiProviderService::new(),
        }
    }
}

impl DesignAiIf for DesignAiIfService {
    async fn draft_requirement(
        &self,
        config: &DesignAiConfig,
        prompt: &str,
        assets: &[AssetReference],
    ) -> Result<DesignAiDraft, AppError> {
        let provider_config = AiProviderConfig {
            provider: config.provider.clone(),
            base_url: config.base_url.clone(),
            model: config.model.clone(),
            embedding_model: String::new(),
            api_key: config.api_key.clone(),
        };
        let asset_context = assets
            .iter()
            .map(|asset| {
                format!(
                    "{} ({}, version {})",
                    asset.name,
                    asset.asset_type.as_deref().unwrap_or("unknown"),
                    asset.version.unwrap_or_default()
                )
            })
            .collect::<Vec<_>>()
            .join("\n");
        let user_prompt = format!(
            "Design intent:\n{}\n\nBound assets:\n{}",
            prompt.trim(),
            if asset_context.is_empty() {
                "none"
            } else {
                &asset_context
            }
        );
        self.provider
            .chat_json::<DesignAiDraft>(
                &provider_config,
                "Create a concise production-ready design requirement. Return strict JSON with title, summary, priority (low|medium|high|critical), acceptance_criteria (array of strings), and rationale. Do not claim to modify assets.",
                &user_prompt,
            )
            .await
    }
}
