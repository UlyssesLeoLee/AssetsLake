/*
```cypher
CREATE
  (f:File {name: "ai_provider_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::ai_provider_service", type: "module"}),
  (c1:Class {name: "AiProviderConfig", type: "class", language: "rust", signature: "struct AiProviderConfig"}),
  (c2:Class {name: "AiProviderService", type: "class", language: "rust", signature: "struct AiProviderService"}),
  (c3:Class {name: "ChatCompletionRequest", type: "class", language: "rust", signature: "struct ChatCompletionRequest"}),
  (c4:Class {name: "ChatMessage", type: "class", language: "rust", signature: "struct ChatMessage"}),
  (c5:Class {name: "ChatCompletionResponse", type: "class", language: "rust", signature: "struct ChatCompletionResponse"}),
  (c6:Class {name: "ChatChoice", type: "class", language: "rust", signature: "struct ChatChoice"}),
  (c7:Class {name: "ChatResponseMessage", type: "class", language: "rust", signature: "struct ChatResponseMessage"}),
  (c8:Class {name: "EmbeddingRequest", type: "class", language: "rust", signature: "struct EmbeddingRequest"}),
  (c9:Class {name: "EmbeddingResponse", type: "class", language: "rust", signature: "struct EmbeddingResponse"}),
  (c10:Class {name: "EmbeddingData", type: "class", language: "rust", signature: "struct EmbeddingData"}),
  (c11:Class {name: "AiImageInput", type: "class", language: "rust", signature: "struct AiImageInput"}),
  (c12:Class {name: "ChatMessageContent", type: "class", language: "rust", signature: "enum ChatMessageContent<'a>"}),
  (c13:Class {name: "ChatContentPart", type: "class", language: "rust", signature: "struct ChatContentPart<'a>"}),
  (c14:Class {name: "ImageUrl", type: "class", language: "rust", signature: "struct ImageUrl<'a>"}),
  (fn1:Function {name: "AiProviderConfig::from_headers", type: "function", language: "rust", signature: "fn from_headers(headers: &HeaderMap) -> Option<Self>"}),
  (fn2:Function {name: "AiProviderService::new", type: "function", language: "rust", signature: "fn new() -> Self"}),
  (fn3:Function {name: "AiProviderService::chat_json", type: "function", language: "rust", signature: "async fn chat_json<T>(&self, config: &AiProviderConfig, system_prompt: &str, user_prompt: &str) -> Result<T, AppError>"}),
  (fn11:Function {name: "AiProviderService::chat_multimodal_json", type: "function", language: "rust", signature: "async fn chat_multimodal_json<T>(&self, config: &AiProviderConfig, system_prompt: &str, user_prompt: &str, images: &[AiImageInput]) -> Result<T, AppError>"}),
  (fn7:Function {name: "AiProviderService::chat_text", type: "function", language: "rust", signature: "async fn chat_text(&self, config: &AiProviderConfig, system_prompt: &str, user_prompt: &str) -> Result<String, AppError>"}),
  (fn8:Function {name: "AiProviderService::chat_completion_content", type: "function", language: "rust", signature: "async fn chat_completion_content(&self, config: &AiProviderConfig, system_prompt: &str, user_prompt: &str, max_tokens: u16) -> Result<String, AppError>"}),
  (fn9:Function {name: "AiProviderService::embed_text", type: "function", language: "rust", signature: "async fn embed_text(&self, config: &AiProviderConfig, input: &str) -> Result<Vec<f32>, AppError>"}),
  (fn12:Function {name: "AiProviderService::embed_text_with_input_type", type: "function", language: "rust", signature: "async fn embed_text_with_input_type(&self, config: &AiProviderConfig, input: &str, input_type: &str) -> Result<Vec<f32>, AppError>"}),
  (fn4:Function {name: "header_value", type: "function", language: "rust", signature: "fn header_value(headers: &HeaderMap, name: &str) -> Option<String>"}),
  (fn5:Function {name: "chat_completions_url", type: "function", language: "rust", signature: "fn chat_completions_url(base_url: &str) -> Result<String, AppError>"}),
  (fn6:Function {name: "extract_json_object", type: "function", language: "rust", signature: "fn extract_json_object(content: &str) -> Option<&str>"}),
  (fn10:Function {name: "embeddings_url", type: "function", language: "rust", signature: "fn embeddings_url(base_url: &str) -> Result<String, AppError>"}),
  (fn13:Function {name: "should_send_embedding_input_type", type: "function", language: "rust", signature: "fn should_send_embedding_input_type(config: &AiProviderConfig) -> bool"}),
  (v1:Variable {name: "DEFAULT_AI_BASE_URL", type: "variable"}),
  (v2:Variable {name: "DEFAULT_AI_MODEL", type: "variable"}),
  (v3:Variable {name: "client", type: "variable"}),
  (v4:Variable {name: "AI_PROVIDER_TIMEOUT_SECONDS", type: "variable"}),
  (v5:Variable {name: "DEFAULT_AI_EMBEDDING_MODEL", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(c12),
  (m)-[:CONTAINS]->(c13),
  (m)-[:CONTAINS]->(c14),
  (c1)-[:HAS_METHOD]->(fn1),
  (c2)-[:HAS_METHOD]->(fn2),
  (c2)-[:HAS_METHOD]->(fn3),
  (c2)-[:HAS_METHOD]->(fn11),
  (c2)-[:HAS_METHOD]->(fn7),
  (c2)-[:HAS_METHOD]->(fn8),
  (c2)-[:HAS_METHOD]->(fn9),
  (c2)-[:HAS_METHOD]->(fn12),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v5),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn8),
  (fn3)-[:CALLS]->(fn6),
  (fn11)-[:CALLS]->(fn8),
  (fn11)-[:CALLS]->(fn6),
  (fn7)-[:CALLS]->(fn8),
  (fn8)-[:CALLS]->(fn5),
  (fn8)-[:USES]->(v3),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:CALLS]->(fn12),
  (fn9)-[:USES]->(v3),
  (fn12)-[:CALLS]->(fn10),
  (fn12)-[:CALLS]->(fn13),
  (fn12)-[:USES]->(v3);
```
*/

use std::time::Duration;

use actix_web::http::header::HeaderMap;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::errors::AppError;

const DEFAULT_AI_BASE_URL: &str = "https://integrate.api.nvidia.com/v1";
const DEFAULT_AI_MODEL: &str = "meta/llama-3.2-1b-instruct";
const DEFAULT_AI_EMBEDDING_MODEL: &str = "nvidia/nv-embedqa-e5-v5";
const AI_PROVIDER_TIMEOUT_SECONDS: u64 = 45;

#[derive(Clone)]
pub struct AiProviderConfig {
    pub provider: String,
    pub base_url: String,
    pub model: String,
    pub embedding_model: String,
    pub api_key: String,
}

#[derive(Clone)]
pub struct AiImageInput {
    pub mime_type: String,
    pub data_base64: String,
}

pub struct AiProviderService {
    client: reqwest::Client,
}

#[derive(Serialize)]
struct ChatCompletionRequest<'a> {
    model: &'a str,
    messages: Vec<ChatMessage<'a>>,
    temperature: f32,
    max_tokens: u16,
}

#[derive(Serialize)]
struct ChatMessage<'a> {
    role: &'a str,
    content: ChatMessageContent<'a>,
}

#[derive(Serialize)]
#[serde(untagged)]
enum ChatMessageContent<'a> {
    Text(&'a str),
    Parts(Vec<ChatContentPart<'a>>),
}

#[derive(Serialize)]
struct ChatContentPart<'a> {
    #[serde(rename = "type")]
    kind: &'a str,
    #[serde(skip_serializing_if = "Option::is_none")]
    text: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    image_url: Option<ImageUrl<'a>>,
}

#[derive(Serialize)]
struct ImageUrl<'a> {
    url: &'a str,
}

#[derive(Deserialize)]
struct ChatCompletionResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Deserialize)]
struct ChatChoice {
    message: ChatResponseMessage,
}

#[derive(Deserialize)]
struct ChatResponseMessage {
    content: Option<String>,
}

#[derive(Serialize)]
struct EmbeddingRequest<'a> {
    model: &'a str,
    input: &'a str,
    #[serde(skip_serializing_if = "Option::is_none")]
    input_type: Option<&'a str>,
}

#[derive(Deserialize)]
struct EmbeddingResponse {
    data: Vec<EmbeddingData>,
}

#[derive(Deserialize)]
struct EmbeddingData {
    embedding: Vec<f32>,
}

impl AiProviderConfig {
    pub fn from_headers(headers: &HeaderMap) -> Option<Self> {
        let api_key = header_value(headers, "x-assetslake-ai-api-key")
            .or_else(|| header_value(headers, "x-ai-api-key"))?;

        if api_key.trim().is_empty() {
            return None;
        }

        Some(Self {
            provider: header_value(headers, "x-assetslake-ai-provider")
                .unwrap_or_else(|| "Custom AI".to_string()),
            base_url: header_value(headers, "x-assetslake-ai-base-url")
                .unwrap_or_else(|| DEFAULT_AI_BASE_URL.to_string()),
            model: header_value(headers, "x-assetslake-ai-model")
                .unwrap_or_else(|| DEFAULT_AI_MODEL.to_string()),
            embedding_model: header_value(headers, "x-assetslake-ai-embedding-model")
                .or_else(|| header_value(headers, "x-ai-embedding-model"))
                .unwrap_or_else(|| DEFAULT_AI_EMBEDDING_MODEL.to_string()),
            api_key,
        })
    }
}

impl AiProviderService {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::builder()
                .connect_timeout(Duration::from_secs(10))
                .timeout(Duration::from_secs(AI_PROVIDER_TIMEOUT_SECONDS))
                .build()
                .expect("AI provider HTTP client should build"),
        }
    }

    pub async fn chat_json<T>(
        &self,
        config: &AiProviderConfig,
        system_prompt: &str,
        user_prompt: &str,
    ) -> Result<T, AppError>
    where
        T: DeserializeOwned,
    {
        let content = self
            .chat_completion_content(
                config,
                ChatMessageContent::Text(system_prompt),
                ChatMessageContent::Text(user_prompt),
                700,
            )
            .await?;
        let json_text = extract_json_object(&content).ok_or_else(|| {
            AppError::internal("AI provider response did not include a JSON object")
        })?;

        serde_json::from_str(json_text).map_err(|e| {
            AppError::internal(format!(
                "AI provider JSON payload did not match contract: {}",
                e
            ))
        })
    }

    pub async fn chat_multimodal_json<T>(
        &self,
        config: &AiProviderConfig,
        system_prompt: &str,
        user_prompt: &str,
        images: &[AiImageInput],
    ) -> Result<T, AppError>
    where
        T: DeserializeOwned,
    {
        let mut parts = vec![ChatContentPart {
            kind: "text",
            text: Some(user_prompt),
            image_url: None,
        }];
        let data_urls: Vec<String> = images
            .iter()
            .map(|image| format!("data:{};base64,{}", image.mime_type, image.data_base64))
            .collect();
        for data_url in &data_urls {
            parts.push(ChatContentPart {
                kind: "image_url",
                text: None,
                image_url: Some(ImageUrl { url: data_url }),
            });
        }

        let content = self
            .chat_completion_content(
                config,
                ChatMessageContent::Text(system_prompt),
                ChatMessageContent::Parts(parts),
                900,
            )
            .await?;
        let json_text = extract_json_object(&content).ok_or_else(|| {
            AppError::internal("AI provider response did not include a JSON object")
        })?;

        serde_json::from_str(json_text).map_err(|e| {
            AppError::internal(format!(
                "AI provider JSON payload did not match contract: {}",
                e
            ))
        })
    }

    pub async fn chat_text(
        &self,
        config: &AiProviderConfig,
        system_prompt: &str,
        user_prompt: &str,
    ) -> Result<String, AppError> {
        let content = self
            .chat_completion_content(
                config,
                ChatMessageContent::Text(system_prompt),
                ChatMessageContent::Text(user_prompt),
                420,
            )
            .await?;
        Ok(content.trim().to_string())
    }

    async fn chat_completion_content(
        &self,
        config: &AiProviderConfig,
        system_prompt: ChatMessageContent<'_>,
        user_prompt: ChatMessageContent<'_>,
        max_tokens: u16,
    ) -> Result<String, AppError> {
        let url = chat_completions_url(&config.base_url)?;
        let request = ChatCompletionRequest {
            model: &config.model,
            messages: vec![
                ChatMessage {
                    role: "system",
                    content: system_prompt,
                },
                ChatMessage {
                    role: "user",
                    content: user_prompt,
                },
            ],
            temperature: 0.2,
            max_tokens,
        };

        let response = self
            .client
            .post(url)
            .bearer_auth(&config.api_key)
            .json(&request)
            .send()
            .await
            .map_err(|e| AppError::internal(format!("AI provider request failed: {}", e)))?;

        let status = response.status();
        let body = response
            .text()
            .await
            .map_err(|e| AppError::internal(format!("AI provider response read failed: {}", e)))?;

        if !status.is_success() {
            return Err(AppError::internal(format!(
                "AI provider returned HTTP {}",
                status.as_u16()
            )));
        }

        let completion: ChatCompletionResponse = serde_json::from_str(&body).map_err(|e| {
            AppError::internal(format!("AI provider response was not valid JSON: {}", e))
        })?;
        completion
            .choices
            .first()
            .and_then(|choice| choice.message.content.clone())
            .ok_or_else(|| {
                AppError::internal("AI provider response did not include message content")
            })
    }

    pub async fn embed_text(
        &self,
        config: &AiProviderConfig,
        input: &str,
    ) -> Result<Vec<f32>, AppError> {
        self.embed_text_with_input_type(config, input, "query")
            .await
    }

    pub async fn embed_text_with_input_type(
        &self,
        config: &AiProviderConfig,
        input: &str,
        input_type: &str,
    ) -> Result<Vec<f32>, AppError> {
        let url = embeddings_url(&config.base_url)?;
        let request = EmbeddingRequest {
            model: &config.embedding_model,
            input,
            input_type: should_send_embedding_input_type(config).then_some(input_type),
        };

        let response = self
            .client
            .post(url)
            .bearer_auth(&config.api_key)
            .json(&request)
            .send()
            .await
            .map_err(|e| AppError::internal(format!("AI embedding request failed: {}", e)))?;

        let status = response.status();
        let body = response
            .text()
            .await
            .map_err(|e| AppError::internal(format!("AI embedding response read failed: {}", e)))?;

        if !status.is_success() {
            return Err(AppError::internal(format!(
                "AI embedding provider returned HTTP {}",
                status.as_u16()
            )));
        }

        let embedding: EmbeddingResponse = serde_json::from_str(&body).map_err(|e| {
            AppError::internal(format!("AI embedding response was not valid JSON: {}", e))
        })?;

        embedding
            .data
            .into_iter()
            .next()
            .map(|item| item.embedding)
            .ok_or_else(|| AppError::internal("AI embedding response did not include data"))
    }
}

fn should_send_embedding_input_type(config: &AiProviderConfig) -> bool {
    let base_url = config.base_url.to_ascii_lowercase();
    let model = config.embedding_model.to_ascii_lowercase();
    base_url.contains("nvidia.com") || model.contains("nv-embed") || model.starts_with("nvidia/")
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned)
}

fn chat_completions_url(base_url: &str) -> Result<String, AppError> {
    let trimmed = base_url.trim().trim_end_matches('/');
    if !(trimmed.starts_with("https://") || trimmed.starts_with("http://")) {
        return Err(AppError::validation(
            "AI base URL must start with http:// or https://",
        ));
    }

    if trimmed.ends_with("/chat/completions") {
        Ok(trimmed.to_string())
    } else {
        Ok(format!("{}/chat/completions", trimmed))
    }
}

fn embeddings_url(base_url: &str) -> Result<String, AppError> {
    let trimmed = base_url.trim().trim_end_matches('/');
    if !(trimmed.starts_with("https://") || trimmed.starts_with("http://")) {
        return Err(AppError::validation(
            "AI base URL must start with http:// or https://",
        ));
    }

    if trimmed.ends_with("/embeddings") {
        Ok(trimmed.to_string())
    } else {
        Ok(format!("{}/embeddings", trimmed))
    }
}

fn extract_json_object(content: &str) -> Option<&str> {
    let trimmed = content.trim();
    if trimmed.starts_with('{') && trimmed.ends_with('}') {
        return Some(trimmed);
    }

    let start = trimmed.find('{')?;
    let end = trimmed.rfind('}')?;
    (end > start).then_some(&trimmed[start..=end])
}
