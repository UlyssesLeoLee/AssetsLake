/*
```cypher
CREATE
  (f:File {name: "management_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::management_handler", type: "module"}),
  (c1:Class {name: "ManagementIntelligencePayload", type: "class", language: "rust", signature: "struct ManagementIntelligencePayload"}),
  (c2:Class {name: "ManagementIntelligenceResponse", type: "class", language: "rust", signature: "struct ManagementIntelligenceResponse"}),
  (c7:Class {name: "AiChatRequest", type: "class", language: "rust", signature: "struct AiChatRequest"}),
  (c8:Class {name: "AiChatResponse", type: "class", language: "rust", signature: "struct AiChatResponse"}),
  (c9:Class {name: "AiChatAction", type: "class", language: "rust", signature: "struct AiChatAction"}),
  (c10:Class {name: "ReplicaActionResponse", type: "class", language: "rust", signature: "struct ReplicaActionResponse"}),
  (c3:Class {name: "LangGraphNode", type: "class", language: "rust", signature: "struct LangGraphNode"}),
  (c4:Class {name: "DataLakeFeed", type: "class", language: "rust", signature: "struct DataLakeFeed"}),
  (c5:Class {name: "AiAutomationRule", type: "class", language: "rust", signature: "struct AiAutomationRule"}),
  (c6:Class {name: "AiCallStatus", type: "class", language: "rust", signature: "struct AiCallStatus"}),
  (fn1:Function {name: "management_intelligence", type: "function", language: "rust", signature: "async fn management_intelligence(req: HttpRequest) -> HttpResponse"}),
  (fn10:Function {name: "management_chat", type: "function", language: "rust", signature: "async fn management_chat(req: HttpRequest, body: web::Json<AiChatRequest>) -> HttpResponse"}),
  (fn11:Function {name: "build_ai_chat_response", type: "function", language: "rust", signature: "async fn build_ai_chat_response(config: AiProviderConfig, request: &AiChatRequest, rag_context: Option<&RagSearchResponse>) -> AiChatResponse"}),
  (fn12:Function {name: "build_fallback_chat_response", type: "function", language: "rust", signature: "fn build_fallback_chat_response(request: &AiChatRequest, ai_status: AiCallStatus, rag_context: Option<&RagSearchResponse>) -> AiChatResponse"}),
  (fn13:Function {name: "build_chat_prompt", type: "function", language: "rust", signature: "fn build_chat_prompt(request: &AiChatRequest, rag_context: Option<&RagSearchResponse>) -> String"}),
  (fn14:Function {name: "default_chat_actions", type: "function", language: "rust", signature: "fn default_chat_actions() -> Vec<AiChatAction>"}),
  (fn15:Function {name: "management_rag_search", type: "function", language: "rust", signature: "async fn management_rag_search(state: web::Data<AppState>, req: HttpRequest, body: web::Json<RagSearchRequest>) -> Result<HttpResponse, AppError>"}),
  (fn16:Function {name: "load_rag_context", type: "function", language: "rust", signature: "async fn load_rag_context(state: &web::Data<AppState>, ai_config: Option<&AiProviderConfig>, request: &AiChatRequest) -> Option<RagSearchResponse>"}),
  (fn17:Function {name: "format_rag_context", type: "function", language: "rust", signature: "fn format_rag_context(rag_context: Option<&RagSearchResponse>) -> String"}),
  (fn18:Function {name: "management_replica_action", type: "function", language: "rust", signature: "async fn management_replica_action(state: web::Data<AppState>, req: HttpRequest, body: web::Json<AiReplicaActionInput>) -> Result<HttpResponse, AppError>"}),
  (fn19:Function {name: "is_replica_write_scope", type: "function", language: "rust", signature: "fn is_replica_write_scope(req: &HttpRequest) -> bool"}),
  (fn2:Function {name: "build_ai_management_intelligence", type: "function", language: "rust", signature: "async fn build_ai_management_intelligence(config: AiProviderConfig) -> ManagementIntelligenceResponse"}),
  (fn3:Function {name: "build_management_intelligence", type: "function", language: "rust", signature: "fn build_management_intelligence(ai_status: AiCallStatus) -> ManagementIntelligenceResponse"}),
  (fn4:Function {name: "build_response", type: "function", language: "rust", signature: "fn build_response(payload: ManagementIntelligencePayload, ai_status: AiCallStatus) -> ManagementIntelligenceResponse"}),
  (fn5:Function {name: "build_management_intelligence_payload", type: "function", language: "rust", signature: "fn build_management_intelligence_payload() -> ManagementIntelligencePayload"}),
  (fn6:Function {name: "AiCallStatus::not_configured", type: "function", language: "rust", signature: "fn not_configured() -> Self"}),
  (fn7:Function {name: "AiCallStatus::used", type: "function", language: "rust", signature: "fn used(config: &AiProviderConfig) -> Self"}),
  (fn8:Function {name: "AiCallStatus::failed", type: "function", language: "rust", signature: "fn failed(config: &AiProviderConfig, error: String) -> Self"}),
  (tm:Module {name: "crate::handlers::management_handler::tests", type: "module"}),
  (fn9:Function {name: "management_intelligence_endpoint_returns_contract", type: "function", language: "rust", signature: "async fn management_intelligence_endpoint_returns_contract()"}),
  (v1:Variable {name: "AI_SYSTEM_PROMPT", type: "variable"}),
  (v2:Variable {name: "AI_USER_PROMPT", type: "variable"}),
  (v3:Variable {name: "config", type: "variable"}),
  (v4:Variable {name: "response", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (c6)-[:HAS_METHOD]->(fn6),
  (c6)-[:HAS_METHOD]->(fn7),
  (c6)-[:HAS_METHOD]->(fn8),
  (m)-[:CONTAINS]->(tm),
  (tm)-[:CONTAINS]->(fn9),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn10)-[:CALLS]->(fn11),
  (fn10)-[:CALLS]->(fn12),
  (fn10)-[:CALLS]->(fn16),
  (fn10)-[:CALLS]->(fn6),
  (fn11)-[:CALLS]->(fn13),
  (fn11)-[:CALLS]->(fn14),
  (fn11)-[:CALLS]->(fn7),
  (fn11)-[:CALLS]->(fn8),
  (fn12)-[:CALLS]->(fn14),
  (fn13)-[:CALLS]->(fn17),
  (fn15)-[:CALLS]->(fn6),
  (fn18)-[:CALLS]->(fn19),
  (fn16)-[:CALLS]->(fn15),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn7),
  (fn2)-[:CALLS]->(fn8),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:CALLS]->(fn5),
  (fn4)-[:USES]->(v4),
  (fn9)-[:CALLS]->(fn1);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};

use crate::{
    errors::{ApiResponse, AppError},
    services::{
        ai_provider_service::{AiProviderConfig, AiProviderService},
        ai_replica_action_service::{AiReplicaActionInput, AiReplicaActionRecord},
        rag_memory_service::{RagSearchRequest, RagSearchResponse},
    },
    AppState,
};

const AI_SYSTEM_PROMPT: &str =
    "Return strict JSON only. Do not use Markdown. Match the requested schema exactly.";
const AI_USER_PROMPT: &str = r#"Create an AssetsLake production-management intelligence contract.
Return a JSON object with this shape:
{
  "product_surface": "jira-grade-production-management",
  "langgraph_nodes": [{"name": "string", "state": "ready|guarded|planned", "detail": "string"}],
  "data_lake_feeds": [{"name": "string", "detail": "string"}],
  "automation_rules": [{"name": "string", "detail": "string", "guardrail": "human_review_required"}]
}
Use concise operational wording for game-art outsourcing, asset evidence, review gates, overdue risk, and delivery readiness.
Return 4 langgraph_nodes, 4 data_lake_feeds, and 4 automation_rules."#;
const AI_CHAT_SYSTEM_PROMPT: &str = r#"You are the AssetsLake AI Control operator.
Answer as a concise product-control assistant. Use the provided context to help the user decide which product action to run.
Coordinate data lake evidence, GitHub-style asset version control, and Jira-style issue flow.
AI may only record replica shadow actions and must not claim primary data was changed.
Do not claim that you executed primary writes. Prefer short operational guidance."#;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ManagementIntelligencePayload {
    product_surface: String,
    langgraph_nodes: Vec<LangGraphNode>,
    data_lake_feeds: Vec<DataLakeFeed>,
    automation_rules: Vec<AiAutomationRule>,
}

#[derive(Debug, Serialize)]
struct ManagementIntelligenceResponse {
    product_surface: String,
    langgraph_nodes: Vec<LangGraphNode>,
    data_lake_feeds: Vec<DataLakeFeed>,
    automation_rules: Vec<AiAutomationRule>,
    ai_status: AiCallStatus,
}

#[derive(Debug, Deserialize)]
pub struct AiChatRequest {
    message: String,
    context: Option<String>,
}

#[derive(Debug, Serialize)]
struct AiChatResponse {
    message: String,
    actions: Vec<AiChatAction>,
    ai_status: AiCallStatus,
}

#[derive(Debug, Serialize)]
struct AiChatAction {
    label: String,
    action_id: String,
    kind: String,
}

#[derive(Debug, Serialize)]
struct ReplicaActionResponse {
    record: AiReplicaActionRecord,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LangGraphNode {
    name: String,
    state: String,
    detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DataLakeFeed {
    name: String,
    detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutomationRule {
    name: String,
    detail: String,
    guardrail: String,
}

#[derive(Debug, Serialize)]
struct AiCallStatus {
    configured: bool,
    used: bool,
    provider: Option<String>,
    model: Option<String>,
    error: Option<String>,
}

impl AiCallStatus {
    fn not_configured() -> Self {
        Self {
            configured: false,
            used: false,
            provider: None,
            model: None,
            error: None,
        }
    }

    fn used(config: &AiProviderConfig) -> Self {
        Self {
            configured: true,
            used: true,
            provider: Some(config.provider.clone()),
            model: Some(config.model.clone()),
            error: None,
        }
    }

    fn failed(config: &AiProviderConfig, error: String) -> Self {
        Self {
            configured: true,
            used: false,
            provider: Some(config.provider.clone()),
            model: Some(config.model.clone()),
            error: Some(error),
        }
    }
}

/// GET /api/management/intelligence
#[get("/api/management/intelligence")]
pub async fn management_intelligence(req: HttpRequest) -> HttpResponse {
    let response = match AiProviderConfig::from_headers(req.headers()) {
        Some(config) => build_ai_management_intelligence(config).await,
        None => build_management_intelligence(AiCallStatus::not_configured()),
    };
    HttpResponse::Ok().json(ApiResponse::ok(response))
}

/// POST /api/management/chat
#[post("/api/management/chat")]
pub async fn management_chat(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<AiChatRequest>,
) -> HttpResponse {
    let chat_request = body.into_inner();
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let rag_context = load_rag_context(&state, ai_config.as_ref(), &chat_request).await;
    let response = match ai_config {
        Some(config) => build_ai_chat_response(config, &chat_request, rag_context.as_ref()).await,
        None => build_fallback_chat_response(
            &chat_request,
            AiCallStatus::not_configured(),
            rag_context.as_ref(),
        ),
    };
    HttpResponse::Ok().json(ApiResponse::ok(response))
}

/// POST /api/management/rag/search
#[post("/api/management/rag/search")]
pub async fn management_rag_search(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<RagSearchRequest>,
) -> Result<HttpResponse, AppError> {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let response = state
        .rag_memory_service
        .search(ai_config.as_ref(), body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// POST /api/management/replica-actions
#[post("/api/management/replica-actions")]
pub async fn management_replica_action(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<AiReplicaActionInput>,
) -> Result<HttpResponse, AppError> {
    if !is_replica_write_scope(&req) {
        return Err(AppError::validation(
            "AI write operations must declare x-assetslake-ai-write-scope: replica",
        ));
    }

    let record = state
        .ai_replica_action_service
        .record_action(body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(ReplicaActionResponse { record })))
}

fn is_replica_write_scope(req: &HttpRequest) -> bool {
    req.headers()
        .get("x-assetslake-ai-write-scope")
        .and_then(|value| value.to_str().ok())
        .map(|value| value.eq_ignore_ascii_case("replica"))
        .unwrap_or(false)
}

async fn build_ai_management_intelligence(
    config: AiProviderConfig,
) -> ManagementIntelligenceResponse {
    let service = AiProviderService::new();
    match service
        .chat_json::<ManagementIntelligencePayload>(&config, AI_SYSTEM_PROMPT, AI_USER_PROMPT)
        .await
    {
        Ok(payload) => build_response(payload, AiCallStatus::used(&config)),
        Err(error) => build_response(
            build_management_intelligence_payload(),
            AiCallStatus::failed(&config, error.to_string()),
        ),
    }
}

fn build_management_intelligence(ai_status: AiCallStatus) -> ManagementIntelligenceResponse {
    build_response(build_management_intelligence_payload(), ai_status)
}

async fn build_ai_chat_response(
    config: AiProviderConfig,
    request: &AiChatRequest,
    rag_context: Option<&RagSearchResponse>,
) -> AiChatResponse {
    let service = AiProviderService::new();
    let prompt = build_chat_prompt(request, rag_context);
    match service
        .chat_text(&config, AI_CHAT_SYSTEM_PROMPT, &prompt)
        .await
    {
        Ok(message) => AiChatResponse {
            message,
            actions: default_chat_actions(),
            ai_status: AiCallStatus::used(&config),
        },
        Err(error) => build_fallback_chat_response(
            request,
            AiCallStatus::failed(&config, error.to_string()),
            rag_context,
        ),
    }
}

fn build_fallback_chat_response(
    request: &AiChatRequest,
    ai_status: AiCallStatus,
    rag_context: Option<&RagSearchResponse>,
) -> AiChatResponse {
    let trimmed = request.message.trim();
    let memory_count = rag_context
        .map(|context| context.matches.len())
        .unwrap_or(0);
    let focus = if trimmed.is_empty() {
        "Tell me what you want to control, then choose a guarded action button."
    } else if memory_count > 0 {
        "I retrieved related operation memory from RAG. Use the guarded buttons below to control data lake evidence, version gates, issue flow, or cross-app links."
    } else {
        "I can prepare the relevant product context. Use the guarded buttons below to control data lake evidence, version gates, issue flow, or cross-app links."
    };

    AiChatResponse {
        message: focus.to_string(),
        actions: default_chat_actions(),
        ai_status,
    }
}

async fn load_rag_context(
    state: &web::Data<AppState>,
    ai_config: Option<&AiProviderConfig>,
    request: &AiChatRequest,
) -> Option<RagSearchResponse> {
    let query = format!(
        "{}\n{}",
        request.message.trim(),
        request.context.as_deref().unwrap_or_default()
    );
    if query.trim().is_empty() {
        return None;
    }

    match state
        .rag_memory_service
        .search(
            ai_config,
            RagSearchRequest {
                query,
                limit: Some(5),
            },
        )
        .await
    {
        Ok(response) => Some(response),
        Err(error) => {
            tracing::warn!(error = %error, "RAG context retrieval failed");
            None
        }
    }
}

fn build_chat_prompt(request: &AiChatRequest, rag_context: Option<&RagSearchResponse>) -> String {
    format!(
        "User message:\n{}\n\nCurrent product context:\n{}\n\nRelevant operation memory:\n{}",
        request.message.trim(),
        request.context.as_deref().unwrap_or("No context supplied."),
        format_rag_context(rag_context)
    )
}

fn format_rag_context(rag_context: Option<&RagSearchResponse>) -> String {
    let Some(context) = rag_context else {
        return "No operation memory retrieved.".to_string();
    };

    if context.matches.is_empty() {
        return "No matching operation memory found.".to_string();
    }

    context
        .matches
        .iter()
        .map(|item| {
            format!(
                "- score {:.3} / {} / {} / {}: {}",
                item.score, item.app, item.entity_type, item.operation_type, item.summary
            )
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn default_chat_actions() -> Vec<AiChatAction> {
    vec![
        AiChatAction {
            label: "Risk Comment".to_string(),
            action_id: "comment-risk".to_string(),
            kind: "issue.comment".to_string(),
        },
        AiChatAction {
            label: "Review Transition".to_string(),
            action_id: "transition-review".to_string(),
            kind: "issue.transition".to_string(),
        },
        AiChatAction {
            label: "AI Work Log".to_string(),
            action_id: "log-ai-work".to_string(),
            kind: "issue.work_log".to_string(),
        },
        AiChatAction {
            label: "Asset Evidence Update".to_string(),
            action_id: "update-asset-evidence".to_string(),
            kind: "asset.update".to_string(),
        },
        AiChatAction {
            label: "Lake Index".to_string(),
            action_id: "index-data-lake".to_string(),
            kind: "asset.index".to_string(),
        },
        AiChatAction {
            label: "Version Gate".to_string(),
            action_id: "version-gate".to_string(),
            kind: "asset.version_gate".to_string(),
        },
        AiChatAction {
            label: "Open Issue".to_string(),
            action_id: "create-issue-from-asset".to_string(),
            kind: "issue.create_from_asset".to_string(),
        },
        AiChatAction {
            label: "Attach Evidence".to_string(),
            action_id: "attach-asset-evidence".to_string(),
            kind: "issue.attach_asset".to_string(),
        },
    ]
}

fn build_response(
    payload: ManagementIntelligencePayload,
    ai_status: AiCallStatus,
) -> ManagementIntelligenceResponse {
    ManagementIntelligenceResponse {
        product_surface: payload.product_surface,
        langgraph_nodes: payload.langgraph_nodes,
        data_lake_feeds: payload.data_lake_feeds,
        automation_rules: payload.automation_rules,
        ai_status,
    }
}

fn build_management_intelligence_payload() -> ManagementIntelligencePayload {
    ManagementIntelligencePayload {
        product_surface: "jira-grade-production-management".to_string(),
        langgraph_nodes: vec![
            LangGraphNode {
                name: "Intake Classifier".to_string(),
                state: "ready".to_string(),
                detail: "Normalizes briefs, bugs, review notes, uploads, and delivery evidence."
                    .to_string(),
            },
            LangGraphNode {
                name: "Priority Planner".to_string(),
                state: "ready".to_string(),
                detail:
                    "Ranks issues by due date, priority, revision count, QA status, and milestone risk."
                        .to_string(),
            },
            LangGraphNode {
                name: "Evidence Retriever".to_string(),
                state: "ready".to_string(),
                detail:
                    "Retrieves asset metadata, issue history, review annotations, vectors, and search results."
                        .to_string(),
            },
            LangGraphNode {
                name: "Action Proposer".to_string(),
                state: "guarded".to_string(),
                detail:
                    "Prepares comments, transitions, revision requests, and delivery checks for human approval."
                        .to_string(),
            },
        ],
        data_lake_feeds: vec![
            DataLakeFeed {
                name: "Issue Event Stream".to_string(),
                detail: "Status changes, comments, assignments, review rounds, and approval decisions."
                    .to_string(),
            },
            DataLakeFeed {
                name: "Asset Evidence Lake".to_string(),
                detail:
                    "Object storage keys, preview URLs, checksums, tags, versions, and delivery package links."
                        .to_string(),
            },
            DataLakeFeed {
                name: "Vector and Search Indexes".to_string(),
                detail:
                    "Qdrant operation memory, asset similarity references, and OpenSearch-style full text metadata retrieval."
                        .to_string(),
            },
            DataLakeFeed {
                name: "Graph Lineage".to_string(),
                detail:
                    "Issue, asset, milestone, vendor, client, and delivery package relationship context."
                        .to_string(),
            },
        ],
        automation_rules: vec![
            AiAutomationRule {
                name: "Overdue Escalation".to_string(),
                detail:
                    "Summarizes late work and proposes producer escalation with linked evidence."
                        .to_string(),
                guardrail: "human_review_required".to_string(),
            },
            AiAutomationRule {
                name: "Review Gate".to_string(),
                detail:
                    "Builds internal and client review checklists when vendor submissions arrive."
                        .to_string(),
                guardrail: "human_review_required".to_string(),
            },
            AiAutomationRule {
                name: "Revision Loop".to_string(),
                detail: "Clusters repeated revision reasons and recommends root-cause fixes.".to_string(),
                guardrail: "human_review_required".to_string(),
            },
            AiAutomationRule {
                name: "Delivery Readiness".to_string(),
                detail:
                    "Checks approved issues against selected assets and data lake delivery evidence."
                        .to_string(),
                guardrail: "human_review_required".to_string(),
            },
        ],
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test, App};
    use serde_json::Value;

    use super::management_intelligence;

    const ENDPOINT: &str = "/api/management/intelligence";

    #[actix_web::test]
    async fn management_intelligence_endpoint_returns_contract() {
        let app = test::init_service(App::new().service(management_intelligence)).await;
        let request = test::TestRequest::get().uri(ENDPOINT).to_request();
        let response = test::call_service(&app, request).await;

        assert_eq!(response.status(), StatusCode::OK);

        let body: Value = test::read_body_json(response).await;
        assert_eq!(body["success"], true);
        assert_eq!(
            body["data"]["product_surface"],
            "jira-grade-production-management"
        );
        assert_eq!(body["data"]["ai_status"]["configured"], false);
        assert_eq!(body["data"]["ai_status"]["used"], false);

        let langgraph_nodes = body["data"]["langgraph_nodes"]
            .as_array()
            .expect("langgraph_nodes is an array");
        assert!(langgraph_nodes
            .iter()
            .any(|node| node["name"] == "Intake Classifier"));
        assert!(langgraph_nodes
            .iter()
            .any(|node| node["state"] == "guarded"));

        let data_lake_feeds = body["data"]["data_lake_feeds"]
            .as_array()
            .expect("data_lake_feeds is an array");
        assert!(data_lake_feeds
            .iter()
            .any(|feed| feed["name"] == "Asset Evidence Lake"));

        let automation_rules = body["data"]["automation_rules"]
            .as_array()
            .expect("automation_rules is an array");
        assert!(automation_rules
            .iter()
            .all(|rule| rule["guardrail"] == "human_review_required"));
    }
}
