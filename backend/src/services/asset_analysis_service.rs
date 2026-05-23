/*
```cypher
CREATE
  (f:File {name: "asset_analysis_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::asset_analysis_service", type: "module"}),
  (c1:Class {name: "AssetAnalysisService", type: "class", language: "rust", signature: "struct AssetAnalysisService"}),
  (c2:Class {name: "AssetAnalysisOutput", type: "class", language: "rust", signature: "struct AssetAnalysisOutput"}),
  (c3:Class {name: "AiInsightContract", type: "class", language: "rust", signature: "struct AiInsightContract"}),
  (fn1:Function {name: "AssetAnalysisService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool, storage: StorageService) -> Self"}),
  (fn2:Function {name: "AssetAnalysisService::analyze_asset", type: "function", language: "rust", signature: "async fn analyze_asset(&self, asset_id: Uuid, ai_config: Option<&AiProviderConfig>) -> Result<AssetAnalysisOutput, AppError>"}),
  (fn3:Function {name: "AssetAnalysisService::list_insights", type: "function", language: "rust", signature: "async fn list_insights(&self, asset_id: Uuid) -> Result<Vec<AssetAiInsight>, AppError>"}),
  (fn4:Function {name: "analyze_with_ai", type: "function", language: "rust", signature: "async fn analyze_with_ai(...) -> Result<AiInsightContract, AppError>"}),
  (fn5:Function {name: "fallback_insight", type: "function", language: "rust", signature: "fn fallback_insight(asset: &Asset, text_sample: Option<&str>) -> AiInsightContract"}),
  (fn6:Function {name: "asset_modality", type: "function", language: "rust", signature: "fn asset_modality(asset: &Asset) -> String"}),
  (fn7:Function {name: "text_sample", type: "function", language: "rust", signature: "fn text_sample(bytes: &[u8]) -> Option<String>"}),
  (fn8:Function {name: "is_image_asset", type: "function", language: "rust", signature: "fn is_image_asset(asset: &Asset) -> bool"}),
  (fn9:Function {name: "normalize_list", type: "function", language: "rust", signature: "fn normalize_list(items: Vec<String>, fallback: &[&str]) -> Vec<String>"}),
  (fn10:Function {name: "clean_text_list", type: "function", language: "rust", signature: "fn clean_text_list(items: Vec<String>) -> Vec<String>"}),
  (v1:Variable {name: "asset_repo", type: "variable"}),
  (v2:Variable {name: "insight_repo", type: "variable"}),
  (v3:Variable {name: "storage", type: "variable"}),
  (v4:Variable {name: "asset", type: "variable"}),
  (v5:Variable {name: "insight", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:CALLS]->(fn7),
  (fn2)-[:CALLS]->(fn9),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn2)-[:USES]->(v5),
  (fn3)-[:USES]->(v2),
  (fn4)-[:CALLS]->(fn8),
  (fn4)-[:USES]->(v4),
  (fn5)-[:USES]->(v4);
```
*/

use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::asset::{Asset, AssetAiInsight, AssetType},
    repositories::{
        asset_insight_repository::{AssetInsightRepository, CreateAssetInsightParams},
        asset_repository::AssetRepository,
    },
    services::{
        ai_provider_service::{AiImageInput, AiProviderConfig, AiProviderService},
        storage_service::StorageService,
    },
};

const MAX_TEXT_SAMPLE_CHARS: usize = 12_000;
const MAX_IMAGE_BYTES_FOR_AI: usize = 4 * 1024 * 1024;

pub struct AssetAnalysisService {
    asset_repo: AssetRepository,
    insight_repo: AssetInsightRepository,
    storage: StorageService,
}

pub struct AssetAnalysisOutput {
    pub asset: Asset,
    pub insight: AssetAiInsight,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiInsightContract {
    summary: String,
    #[serde(default)]
    labels: Vec<String>,
    detected_text: Option<String>,
    #[serde(default)]
    quality_risks: Vec<String>,
    #[serde(default)]
    reuse_suggestions: Vec<String>,
    #[serde(default)]
    entities: Value,
}

impl AssetAnalysisService {
    pub fn new(pool: PgPool, storage: StorageService) -> Self {
        Self {
            asset_repo: AssetRepository::new(pool.clone()),
            insight_repo: AssetInsightRepository::new(pool),
            storage,
        }
    }

    pub async fn analyze_asset(
        &self,
        asset_id: Uuid,
        ai_config: Option<&AiProviderConfig>,
    ) -> Result<AssetAnalysisOutput, AppError> {
        let asset = self.asset_repo.find_by_id(asset_id).await?;
        let bytes = self.storage.get_object(&asset.object_key).await?;
        let sample = if is_image_asset(&asset)
            || matches!(
                asset.asset_type,
                AssetType::Archive | AssetType::Video | AssetType::Audio | AssetType::Model3d
            ) {
            None
        } else {
            text_sample(&bytes)
        };
        let modality = asset_modality(&asset);

        let (contract, provider, model, status, raw_response) = match ai_config {
            Some(config) => {
                match analyze_with_ai(config, &asset, &bytes, sample.as_deref()).await {
                    Ok(contract) => (
                        contract.clone(),
                        config.provider.clone(),
                        Some(config.model.clone()),
                        "completed".to_string(),
                        json!({ "source": "ai_provider", "result": contract }),
                    ),
                    Err(error) => {
                        let fallback = fallback_insight(&asset, sample.as_deref());
                        (
                            fallback.clone(),
                            "local_heuristic".to_string(),
                            None,
                            "fallback".to_string(),
                            json!({ "source": "local_heuristic", "ai_error": error.to_string(), "result": fallback }),
                        )
                    }
                }
            }
            None => {
                let fallback = fallback_insight(&asset, sample.as_deref());
                (
                    fallback.clone(),
                    "local_heuristic".to_string(),
                    None,
                    "fallback".to_string(),
                    json!({ "source": "local_heuristic", "result": fallback }),
                )
            }
        };

        let labels = normalize_list(contract.labels, &[modality.as_str()]);
        let quality_risks = clean_text_list(contract.quality_risks);
        let reuse_suggestions = clean_text_list(contract.reuse_suggestions);
        let detected_text = contract
            .detected_text
            .map(|text| text.trim().chars().take(4_000).collect::<String>())
            .filter(|text| !text.is_empty());

        let insight = self
            .insight_repo
            .create(CreateAssetInsightParams {
                asset_id,
                modality,
                provider,
                model,
                status,
                summary: contract.summary.trim().chars().take(1_200).collect(),
                labels: labels.clone(),
                detected_text,
                quality_risks,
                reuse_suggestions,
                entities: contract.entities,
                raw_response,
            })
            .await?;
        let asset = self.asset_repo.update_ai_tags(asset_id, &labels).await?;

        Ok(AssetAnalysisOutput { asset, insight })
    }

    pub async fn list_insights(&self, asset_id: Uuid) -> Result<Vec<AssetAiInsight>, AppError> {
        self.asset_repo.find_by_id(asset_id).await?;
        self.insight_repo.list_by_asset(asset_id).await
    }
}

async fn analyze_with_ai(
    config: &AiProviderConfig,
    asset: &Asset,
    bytes: &[u8],
    sample: Option<&str>,
) -> Result<AiInsightContract, AppError> {
    let system_prompt = "You are AssetsLake's multimodal asset analyst. Return only JSON matching this schema: {\"summary\":\"string\",\"labels\":[\"string\"],\"detected_text\":\"string or null\",\"quality_risks\":[\"string\"],\"reuse_suggestions\":[\"string\"],\"entities\":{}}. Keep labels short and useful for asset search.";
    let user_prompt = format!(
        "Analyze this data lake asset.\nName: {}\nFilename: {}\nType: {:?}\nMIME: {}\nSize bytes: {}\nExisting tags: {}\nText sample:\n{}",
        asset.name,
        asset.original_filename,
        asset.asset_type,
        asset.mime_type,
        asset.file_size,
        asset.tags.join(", "),
        sample.unwrap_or("none")
    );

    if is_image_asset(asset) && bytes.len() <= MAX_IMAGE_BYTES_FOR_AI {
        let image = AiImageInput {
            mime_type: asset.mime_type.clone(),
            data_base64: STANDARD.encode(bytes),
        };
        AiProviderService::new()
            .chat_multimodal_json(config, system_prompt, &user_prompt, &[image])
            .await
    } else {
        AiProviderService::new()
            .chat_json(config, system_prompt, &user_prompt)
            .await
    }
}

fn fallback_insight(asset: &Asset, text_sample: Option<&str>) -> AiInsightContract {
    let modality = asset_modality(asset);
    let ext = std::path::Path::new(&asset.original_filename)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    let mut labels = vec![modality.clone(), ext.clone()]
        .into_iter()
        .filter(|value| !value.is_empty())
        .collect::<Vec<_>>();
    labels.extend(asset.tags.iter().cloned());
    if matches!(asset.asset_type, AssetType::Code) {
        labels.push("code-review".to_string());
    }

    let detected_text = text_sample.map(|sample| sample.chars().take(1_200).collect::<String>());
    let quality_risks = match asset.asset_type {
        AssetType::Code if text_sample.is_none() => {
            vec!["Code file could not be decoded as text.".to_string()]
        }
        AssetType::Texture | AssetType::ConceptArt if asset.file_size < 1_024 => {
            vec!["Image asset is very small; verify it is not a placeholder.".to_string()]
        }
        AssetType::Archive => {
            vec!["Archive contents require unpacking for deep inspection.".to_string()]
        }
        _ => Vec::new(),
    };

    AiInsightContract {
        summary: format!(
            "{} recognized as {} data lake content. Filename: {}. Existing tags: {}.",
            asset.name,
            modality,
            asset.original_filename,
            asset.tags.join(", ")
        ),
        labels,
        detected_text,
        quality_risks,
        reuse_suggestions: vec![
            "Link this insight to related issues as evidence when it affects delivery readiness."
                .to_string(),
        ],
        entities: json!({
            "filename": asset.original_filename,
            "asset_type": asset.asset_type,
            "mime_type": asset.mime_type,
            "version": asset.version
        }),
    }
}

fn asset_modality(asset: &Asset) -> String {
    if is_image_asset(asset) {
        "image".to_string()
    } else {
        match asset.asset_type {
            AssetType::Code => "code",
            AssetType::Document => "document",
            AssetType::Video => "video",
            AssetType::Audio => "audio",
            AssetType::Model3d => "3d",
            AssetType::Archive => "archive",
            _ => "metadata",
        }
        .to_string()
    }
}

fn text_sample(bytes: &[u8]) -> Option<String> {
    let text = String::from_utf8_lossy(bytes);
    let printable = text
        .chars()
        .filter(|ch| !ch.is_control() || *ch == '\n' || *ch == '\t')
        .take(MAX_TEXT_SAMPLE_CHARS)
        .collect::<String>();
    let trimmed = printable.trim();
    (!trimmed.is_empty()).then(|| trimmed.to_string())
}

fn is_image_asset(asset: &Asset) -> bool {
    asset.mime_type.starts_with("image/")
        || matches!(
            asset.asset_type,
            AssetType::Texture | AssetType::ConceptArt | AssetType::Ui
        )
}

fn normalize_list(items: Vec<String>, fallback: &[&str]) -> Vec<String> {
    let mut values = items
        .into_iter()
        .chain(fallback.iter().map(|item| item.to_string()))
        .map(|item| item.trim().to_ascii_lowercase().replace(' ', "-"))
        .filter(|item| !item.is_empty())
        .collect::<Vec<_>>();
    values.sort();
    values.dedup();
    values.truncate(12);
    values
}

fn clean_text_list(items: Vec<String>) -> Vec<String> {
    let mut values = items
        .into_iter()
        .map(|item| item.trim().to_string())
        .filter(|item| !item.is_empty())
        .collect::<Vec<_>>();
    values.sort();
    values.dedup();
    values.truncate(12);
    values
}
