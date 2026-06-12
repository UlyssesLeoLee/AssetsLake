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
  (c11:Class {name: "PeopleAssistantContext", type: "class", language: "rust", signature: "struct PeopleAssistantContext"}),
  (c12:Class {name: "AiChatHistoryQuery", type: "class", language: "rust", signature: "struct AiChatHistoryQuery"}),
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
  (fn20:Function {name: "management_chat_history", type: "function", language: "rust"}),
  (fn21:Function {name: "load_people_assistant_context", type: "function", language: "rust"}),
  (fn22:Function {name: "employee_langgraph_nodes", type: "function", language: "rust"}),
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
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(c12),
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
  (m)-[:CONTAINS]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
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

use std::time::Instant;

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use tokio::time::{timeout, Duration as TokioDuration};
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    interfaces::{employee_intelligence_if::EmployeeIntelligenceIf, AppActor},
    models::people_intelligence::{EmployeeEvaluation, EmployeeProfile},
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
const AI_TEST_SYSTEM_PROMPT: &str =
    "Connectivity probe. Reply with exactly this text and no extra words: API OK.";
const AI_TEST_USER_PROMPT: &str = "API connectivity check.";
const AI_TEST_MAX_TOKENS: u16 = 16;
const AI_TEST_CHAT_TIMEOUT_SECONDS: u64 = 12;
const AI_AUTOPILOT_JSON_MAX_TOKENS: u16 = 1_200;

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
    #[serde(default)]
    max_tokens: Option<u16>,
    #[serde(default)]
    conversation_id: Option<Uuid>,
    #[serde(default)]
    app_id: Option<String>,
    #[serde(default)]
    route_id: Option<String>,
    #[serde(default)]
    pathname: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AiChatHistoryQuery {
    app_id: Option<String>,
    limit: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct AiAutopilotPlanRequest {
    goal: String,
    context: serde_json::Value,
    #[serde(default)]
    actions: Vec<AiAutopilotActionSnapshot>,
    #[serde(default)]
    signals: Vec<AiAutopilotSignalSnapshot>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotActionSnapshot {
    id: String,
    title: String,
    app: String,
    target_label: String,
    #[serde(default)]
    writes: Vec<String>,
    #[serde(default)]
    disabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotSignalSnapshot {
    id: String,
    source: String,
    strength: String,
}

#[derive(Debug, Serialize)]
struct AiChatResponse {
    conversation_id: Uuid,
    message: String,
    actions: Vec<AiChatAction>,
    langgraph_nodes: Vec<LangGraphNode>,
    people_context: PeopleAssistantContext,
    ai_status: AiCallStatus,
}

#[derive(Debug, Serialize)]
struct AiProviderTestResponse {
    ok: bool,
    message: String,
    latency_ms: u128,
    chat_ok: bool,
    embedding_ok: bool,
    embedding_latency_ms: Option<u128>,
    embedding_dimensions: Option<usize>,
    ai_status: AiCallStatus,
}

#[derive(Debug, Serialize)]
struct AiAutopilotPlanResponse {
    id: String,
    goal: String,
    mode: String,
    confidence: f32,
    summary: String,
    commands: Vec<AiAutopilotCommand>,
    decision_review: AiAutopilotDecisionReview,
    audit_trail: Vec<String>,
    langgraph_nodes: Vec<LangGraphNode>,
    ai_status: AiCallStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotPlanPayload {
    id: String,
    goal: String,
    mode: String,
    confidence: f32,
    summary: String,
    commands: Vec<AiAutopilotCommand>,
    #[serde(default)]
    decision_review: AiAutopilotDecisionReview,
    audit_trail: Vec<String>,
    #[serde(default)]
    langgraph_nodes: Vec<LangGraphNode>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotCommand {
    id: String,
    action_id: Option<String>,
    title: String,
    app: String,
    target_label: String,
    intent: String,
    #[serde(default)]
    writes: Vec<String>,
    #[serde(default)]
    impact_preview: Vec<String>,
    risk: String,
    approval_required: bool,
    status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct AiAutopilotDecisionReview {
    #[serde(default)]
    evidence: Vec<AiAutopilotEvidence>,
    #[serde(default)]
    risk_assessment: Vec<AiAutopilotRiskAssessment>,
    #[serde(default)]
    approval_gates: Vec<String>,
    #[serde(default)]
    outcome_checks: Vec<String>,
    #[serde(default)]
    governance_notes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotEvidence {
    label: String,
    value: String,
    source: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AiAutopilotRiskAssessment {
    command_id: String,
    risk: String,
    reason: String,
    guardrail: String,
}

#[derive(Debug, Serialize)]
struct AiChatAction {
    label: String,
    action_id: String,
    kind: String,
    description: String,
    href: Option<String>,
    requires_human_approval: bool,
    status: String,
}

#[derive(Debug, Clone, Serialize)]
struct PeopleAssistantContext {
    available: bool,
    job_title: Option<String>,
    level: Option<String>,
    languages: Vec<String>,
    availability_status: Option<String>,
    workload_percent: Option<i32>,
    capabilities: Vec<PeopleCapabilityContext>,
    preferred_project_types: Vec<String>,
    evidence_sample_size: i32,
    project_count: i32,
    confidence: f64,
    emergent_signals: Vec<PeopleSignalContext>,
}

#[derive(Debug, Clone, Serialize)]
struct PeopleCapabilityContext {
    name: String,
    kind: String,
    proficiency: i16,
    verification_status: String,
    evidence_count: i32,
}

#[derive(Debug, Clone, Serialize)]
struct PeopleSignalContext {
    signal_type: String,
    title: String,
    confidence: f64,
    evidence_count: i32,
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
) -> Result<HttpResponse, AppError> {
    let chat_request = body.into_inner();
    let session = state.auth_service.authenticate_request(&req).await?;
    let actor = AppActor::from_session(&session);
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let rag_context = load_rag_context(&state, ai_config.as_ref(), &chat_request).await;
    let people_context = load_people_assistant_context(&state, &actor).await;
    let langgraph_nodes = employee_langgraph_nodes(&chat_request, &people_context);
    let mut response = match ai_config {
        Some(config) => {
            build_ai_chat_response(
                config,
                &chat_request,
                rag_context.as_ref(),
                &people_context,
                &langgraph_nodes,
            )
            .await
        }
        None => build_fallback_chat_response(
            &chat_request,
            AiCallStatus::not_configured(),
            rag_context.as_ref(),
            people_context,
            langgraph_nodes,
        ),
    };
    response
        .actions
        .retain(|action| assistant_action_allowed(&actor.role, action));

    let app_id = normalized_context_value(chat_request.app_id.as_deref(), "unified-platform");
    let route_id = normalized_context_value(chat_request.route_id.as_deref(), "unknown-route");
    let pathname = normalized_context_value(chat_request.pathname.as_deref(), "/");
    let metadata = serde_json::json!({
        "actions": &response.actions,
        "langgraph_nodes": &response.langgraph_nodes,
        "people_context": &response.people_context,
        "ai_status": &response.ai_status,
    });
    match state
        .app_assistant_service
        .record_exchange(
            session.user.id,
            chat_request.conversation_id,
            &app_id,
            &route_id,
            &pathname,
            chat_request.message.trim(),
            &response.message,
            metadata,
        )
        .await
    {
        Ok(conversation_id) => response.conversation_id = conversation_id,
        Err(error) => tracing::warn!(error = %error, "assistant history persistence failed"),
    }

    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

/// GET /api/management/chat/history
#[get("/api/management/chat/history")]
pub async fn management_chat_history(
    state: web::Data<AppState>,
    req: HttpRequest,
    query: web::Query<AiChatHistoryQuery>,
) -> Result<HttpResponse, AppError> {
    let session = state.auth_service.authenticate_request(&req).await?;
    let history = state
        .app_assistant_service
        .list_history(
            session.user.id,
            query.app_id.as_deref(),
            query.limit.unwrap_or(8),
        )
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(history)))
}

/// POST /api/management/ai/test
#[post("/api/management/ai/test")]
pub async fn management_ai_test(req: HttpRequest) -> HttpResponse {
    let Some(config) = AiProviderConfig::from_headers(req.headers()) else {
        let response = AiProviderTestResponse {
            ok: false,
            message: "AI API is not configured".to_string(),
            latency_ms: 0,
            chat_ok: false,
            embedding_ok: false,
            embedding_latency_ms: None,
            embedding_dimensions: None,
            ai_status: AiCallStatus::not_configured(),
        };
        return HttpResponse::Ok().json(ApiResponse::ok(response));
    };

    let service = AiProviderService::new();
    let started = Instant::now();
    let embedding_started = Instant::now();
    let (embedding_ok, embedding_latency_ms, embedding_dimensions, embedding_message) =
        match service.embed_text(&config, "AssetsLake API test").await {
            Ok(vector) => {
                let latency = embedding_started.elapsed().as_millis();
                (
                    true,
                    Some(latency),
                    Some(vector.len()),
                    format!(
                        "Embedding probe passed in {}ms with {} dimensions.",
                        latency,
                        vector.len()
                    ),
                )
            }
            Err(error) => (
                false,
                Some(embedding_started.elapsed().as_millis()),
                None,
                format!("Embedding probe failed: {}.", error),
            ),
        };

    let chat_future = service.chat_text_with_max_tokens(
        &config,
        AI_TEST_SYSTEM_PROMPT,
        AI_TEST_USER_PROMPT,
        AI_TEST_MAX_TOKENS,
    );
    let result = timeout(
        TokioDuration::from_secs(AI_TEST_CHAT_TIMEOUT_SECONDS),
        chat_future,
    )
    .await;

    let response = match result {
        Ok(Ok(message)) => AiProviderTestResponse {
            ok: true,
            message: format!(
                "Chat probe passed: {} {}",
                message.trim(),
                embedding_message
            ),
            latency_ms: started.elapsed().as_millis(),
            chat_ok: true,
            embedding_ok,
            embedding_latency_ms,
            embedding_dimensions,
            ai_status: AiCallStatus::used(&config),
        },
        Ok(Err(error)) => {
            let chat_error = error.to_string();

            AiProviderTestResponse {
                ok: false,
                message: format!(
                    "{} Chat completion probe failed: {}",
                    embedding_message, chat_error
                ),
                latency_ms: started.elapsed().as_millis(),
                chat_ok: false,
                embedding_ok,
                embedding_latency_ms,
                embedding_dimensions,
                ai_status: AiCallStatus::failed(&config, chat_error),
            }
        }
        Err(_) => {
            service.mark_chat_timeout(&config);
            let chat_error = format!(
                "AI chat completion probe timed out after {} seconds",
                AI_TEST_CHAT_TIMEOUT_SECONDS
            );

            AiProviderTestResponse {
                ok: false,
                message: format!("{} {}", embedding_message, chat_error),
                latency_ms: started.elapsed().as_millis(),
                chat_ok: false,
                embedding_ok,
                embedding_latency_ms,
                embedding_dimensions,
                ai_status: AiCallStatus::failed(&config, chat_error),
            }
        }
    };

    HttpResponse::Ok().json(ApiResponse::ok(response))
}

/// POST /api/management/autopilot-plan
#[post("/api/management/autopilot-plan")]
pub async fn management_autopilot_plan(
    req: HttpRequest,
    body: web::Json<AiAutopilotPlanRequest>,
) -> HttpResponse {
    let plan_request = body.into_inner();
    let response = match AiProviderConfig::from_headers(req.headers()) {
        Some(config) => build_ai_autopilot_plan(config, &plan_request).await,
        None => build_autopilot_response(
            build_fallback_autopilot_plan(&plan_request),
            AiCallStatus::not_configured(),
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

async fn build_ai_autopilot_plan(
    config: AiProviderConfig,
    request: &AiAutopilotPlanRequest,
) -> AiAutopilotPlanResponse {
    let service = AiProviderService::new();
    let prompt = build_autopilot_prompt(request);
    match service
        .chat_json_with_max_tokens::<AiAutopilotPlanPayload>(
            &config,
            AI_SYSTEM_PROMPT,
            &prompt,
            AI_AUTOPILOT_JSON_MAX_TOKENS,
        )
        .await
    {
        Ok(payload) => build_autopilot_response(
            normalize_autopilot_plan(payload, request),
            AiCallStatus::used(&config),
        ),
        Err(error) => build_autopilot_response(
            build_fallback_autopilot_plan(request),
            AiCallStatus::failed(&config, error.to_string()),
        ),
    }
}

async fn build_ai_chat_response(
    config: AiProviderConfig,
    request: &AiChatRequest,
    rag_context: Option<&RagSearchResponse>,
    people_context: &PeopleAssistantContext,
    langgraph_nodes: &[LangGraphNode],
) -> AiChatResponse {
    let service = AiProviderService::new();
    let prompt = build_chat_prompt(request, rag_context, people_context, langgraph_nodes);
    let max_tokens = request.max_tokens.unwrap_or(420).clamp(8, 420);
    let result = if max_tokens == 420 {
        service
            .chat_text(&config, AI_CHAT_SYSTEM_PROMPT, &prompt)
            .await
    } else {
        service
            .chat_text_with_max_tokens(&config, AI_CHAT_SYSTEM_PROMPT, &prompt, max_tokens)
            .await
    };
    match result {
        Ok(message) => AiChatResponse {
            conversation_id: request.conversation_id.unwrap_or_else(Uuid::new_v4),
            message,
            actions: contextual_chat_actions(request),
            langgraph_nodes: langgraph_nodes.to_vec(),
            people_context: people_context.clone(),
            ai_status: AiCallStatus::used(&config),
        },
        Err(error) => build_fallback_chat_response(
            request,
            AiCallStatus::failed(&config, error.to_string()),
            rag_context,
            people_context.clone(),
            langgraph_nodes.to_vec(),
        ),
    }
}

fn build_autopilot_prompt(request: &AiAutopilotPlanRequest) -> String {
    format!(
        r#"Create a guarded AssetsLake AI Autopilot plan.
Return strict JSON only with this shape:
{{
  "id": "plan-short-id",
  "goal": "string",
  "mode": "advisor|operator|manager",
  "confidence": 0.0,
  "summary": "string",
  "langgraph_nodes": [{{"name": "string", "state": "ready|guarded|planned", "detail": "string"}}],
  "commands": [{{
    "id": "cmd-1-action-id",
    "action_id": "one supplied action id or null",
    "title": "string",
    "app": "string",
    "target_label": "string",
    "intent": "string",
    "writes": ["replica writes only"],
    "impact_preview": ["string"],
    "risk": "low|medium|high",
    "approval_required": true,
    "status": "queued|requires_approval|blocked|done"
  }}],
  "decision_review": {{
    "evidence": [{{"label": "string", "value": "string", "source": "string"}}],
    "risk_assessment": [{{"command_id": "string", "risk": "low|medium|high", "reason": "string", "guardrail": "string"}}],
    "approval_gates": ["string"],
    "outcome_checks": ["string"],
    "governance_notes": ["string"]
  }},
  "audit_trail": ["string"]
}}
Use only supplied action ids. Do not invent primary writes. High and medium risk commands require approval.
Keep output compact: 2-4 langgraph_nodes, at most 3 commands, at most 4 evidence items, string fields under 100 characters.
Decision review must cite supplied context and explain each command risk.

Goal:
{}

Current product context:
{}

Available guarded actions:
{}

Emergent signals:
{}"#,
        request.goal.trim(),
        request.context,
        serde_json::to_string(&request.actions).unwrap_or_else(|_| "[]".to_string()),
        serde_json::to_string(&request.signals).unwrap_or_else(|_| "[]".to_string())
    )
}

fn normalize_autopilot_plan(
    mut payload: AiAutopilotPlanPayload,
    request: &AiAutopilotPlanRequest,
) -> AiAutopilotPlanPayload {
    if payload.id.trim().is_empty() {
        payload.id = format!("ai-plan-{}", slug_goal(&request.goal));
    }
    if payload.goal.trim().is_empty() {
        payload.goal = normalized_goal(request);
    }
    payload.mode = normalize_mode(&payload.mode, request);
    payload.confidence = payload.confidence.clamp(0.0, 0.98);
    if payload.summary.trim().is_empty() {
        payload.summary = fallback_summary(request);
    }
    if payload.langgraph_nodes.is_empty() {
        payload.langgraph_nodes = default_autopilot_nodes();
    }

    let commands: Vec<AiAutopilotCommand> = payload
        .commands
        .into_iter()
        .take(6)
        .enumerate()
        .map(|(index, command)| normalize_command(index, command, request))
        .collect();
    payload.commands = if commands.is_empty() {
        build_fallback_autopilot_plan(request).commands
    } else {
        commands
    };
    if payload.audit_trail.is_empty() {
        payload.audit_trail = fallback_audit_trail(request);
    }
    payload.decision_review =
        normalize_decision_review(payload.decision_review, request, &payload.commands);
    payload
}

fn normalize_command(
    index: usize,
    mut command: AiAutopilotCommand,
    request: &AiAutopilotPlanRequest,
) -> AiAutopilotCommand {
    let action = command
        .action_id
        .as_ref()
        .and_then(|id| request.actions.iter().find(|candidate| candidate.id == *id));
    let fallback_action = action.or_else(|| request.actions.get(index));

    if command.id.trim().is_empty() {
        command.id = format!(
            "cmd-{}-{}",
            index + 1,
            fallback_action
                .map(|item| item.id.as_str())
                .unwrap_or("observe-context")
        );
    }
    if command.title.trim().is_empty() {
        command.title = fallback_action
            .map(|item| item.title.clone())
            .unwrap_or_else(|| "Observe Context".to_string());
    }
    if command.app.trim().is_empty() {
        command.app = fallback_action
            .map(|item| item.app.clone())
            .unwrap_or_else(|| "AI Control".to_string());
    }
    if command.target_label.trim().is_empty() {
        command.target_label = fallback_action
            .map(|item| item.target_label.clone())
            .unwrap_or_else(|| "No executable target".to_string());
    }
    if command.intent.trim().is_empty() {
        command.intent = format!("Prepare a guarded replica proposal for {}.", command.title);
    }
    if command.writes.is_empty() {
        command.writes = fallback_action
            .map(|item| item.writes.clone())
            .unwrap_or_default();
    }
    if command.impact_preview.is_empty() {
        command.impact_preview = vec![
            format!("Target: {}", command.target_label),
            format!("App boundary: {}", command.app),
            format!(
                "Replica writes: {}",
                if command.writes.is_empty() {
                    "none".to_string()
                } else {
                    command.writes.join(", ")
                }
            ),
        ];
    }
    command.risk = normalize_risk(&command.risk, command.action_id.as_deref());
    command.approval_required = command.approval_required || command.risk != "low";
    command.status = normalize_status(&command.status, command.approval_required, fallback_action);
    command
}

fn build_fallback_autopilot_plan(request: &AiAutopilotPlanRequest) -> AiAutopilotPlanPayload {
    let commands: Vec<AiAutopilotCommand> = autopilot_action_order()
        .iter()
        .filter_map(|action_id| {
            request
                .actions
                .iter()
                .find(|action| action.id == *action_id)
        })
        .take(6)
        .enumerate()
        .map(|(index, action)| fallback_command(index, action))
        .collect();
    let commands = if commands.is_empty() {
        vec![AiAutopilotCommand {
            id: "cmd-observe-context".to_string(),
            action_id: None,
            title: "Observe Context".to_string(),
            app: "AI Control".to_string(),
            target_label: "No executable target".to_string(),
            intent: "Collect more lake, version, issue, and governance context before replica recording.".to_string(),
            writes: vec![],
            impact_preview: vec!["No product data will be modified.".to_string()],
            risk: "low".to_string(),
            approval_required: false,
            status: "blocked".to_string(),
        }]
    } else {
        commands
    };

    AiAutopilotPlanPayload {
        id: format!("plan-{}", slug_goal(&request.goal)),
        goal: normalized_goal(request),
        mode: normalize_mode("", request),
        confidence: fallback_confidence(request),
        summary: fallback_summary(request),
        decision_review: build_decision_review(request, &commands),
        commands,
        audit_trail: fallback_audit_trail(request),
        langgraph_nodes: default_autopilot_nodes(),
    }
}

fn build_autopilot_response(
    payload: AiAutopilotPlanPayload,
    ai_status: AiCallStatus,
) -> AiAutopilotPlanResponse {
    AiAutopilotPlanResponse {
        id: payload.id,
        goal: payload.goal,
        mode: payload.mode,
        confidence: payload.confidence,
        summary: payload.summary,
        commands: payload.commands,
        decision_review: payload.decision_review,
        audit_trail: payload.audit_trail,
        langgraph_nodes: payload.langgraph_nodes,
        ai_status,
    }
}

fn normalize_decision_review(
    mut review: AiAutopilotDecisionReview,
    request: &AiAutopilotPlanRequest,
    commands: &[AiAutopilotCommand],
) -> AiAutopilotDecisionReview {
    let fallback = build_decision_review(request, commands);

    review.evidence = if review.evidence.is_empty() {
        fallback.evidence
    } else {
        review
            .evidence
            .into_iter()
            .take(6)
            .enumerate()
            .map(|(index, mut evidence)| {
                if evidence.label.trim().is_empty() {
                    evidence.label = format!("Evidence {}", index + 1);
                }
                if evidence.value.trim().is_empty() {
                    evidence.value = "No value supplied".to_string();
                }
                if evidence.source.trim().is_empty() {
                    evidence.source = "model.output".to_string();
                }
                evidence
            })
            .collect()
    };

    review.risk_assessment = if review.risk_assessment.is_empty() {
        fallback.risk_assessment
    } else {
        let mut assessed: Vec<AiAutopilotRiskAssessment> = review
            .risk_assessment
            .into_iter()
            .take(8)
            .map(|mut item| {
                if item.command_id.trim().is_empty() {
                    item.command_id = "unmapped-command".to_string();
                }
                item.risk = normalize_risk(&item.risk, None);
                if item.reason.trim().is_empty() {
                    item.reason = "Risk was inferred from command scope.".to_string();
                }
                if item.guardrail.trim().is_empty() {
                    item.guardrail = guardrail_for_risk(&item.risk).to_string();
                }
                item
            })
            .collect();
        for fallback_item in fallback.risk_assessment {
            if !assessed
                .iter()
                .any(|item| item.command_id == fallback_item.command_id)
            {
                assessed.push(fallback_item);
            }
        }
        assessed
    };

    if review.approval_gates.is_empty() {
        review.approval_gates = fallback.approval_gates;
    }
    if review.outcome_checks.is_empty() {
        review.outcome_checks = fallback.outcome_checks;
    }
    if review.governance_notes.is_empty() {
        review.governance_notes = fallback.governance_notes;
    }
    review
}

fn build_decision_review(
    request: &AiAutopilotPlanRequest,
    commands: &[AiAutopilotCommand],
) -> AiAutopilotDecisionReview {
    let ready_actions = request
        .actions
        .iter()
        .filter(|action| !action.disabled)
        .count();
    let signal_summary = if request.signals.is_empty() {
        "no emergent signals".to_string()
    } else {
        request
            .signals
            .iter()
            .take(4)
            .map(|signal| format!("{}:{}", signal.source, signal.strength))
            .collect::<Vec<_>>()
            .join(", ")
    };

    let approval_gates: Vec<String> = commands
        .iter()
        .filter(|command| command.approval_required)
        .map(|command| {
            format!(
                "{} requires human approval before {} replica recording.",
                command.title, command.app
            )
        })
        .collect();

    AiAutopilotDecisionReview {
        evidence: vec![
            AiAutopilotEvidence {
                label: "Goal".to_string(),
                value: normalized_goal(request),
                source: "request.goal".to_string(),
            },
            AiAutopilotEvidence {
                label: "Product Context".to_string(),
                value: format!(
                    "issues={}, assets={}, readiness={}",
                    context_value(&request.context, &["issues", "total_issues"])
                        .unwrap_or_else(|| "unknown".to_string()),
                    context_value(&request.context, &["active_assets", "assets"])
                        .unwrap_or_else(|| "unknown".to_string()),
                    context_value(
                        &request.context,
                        &["delivery_ready_percent", "readiness_percent"]
                    )
                    .unwrap_or_else(|| "unknown".to_string())
                ),
                source: "request.context".to_string(),
            },
            AiAutopilotEvidence {
                label: "Action Surface".to_string(),
                value: format!(
                    "{} ready of {} supplied guarded actions",
                    ready_actions,
                    request.actions.len()
                ),
                source: "request.actions".to_string(),
            },
            AiAutopilotEvidence {
                label: "Emergent Signals".to_string(),
                value: signal_summary,
                source: "request.signals".to_string(),
            },
        ],
        risk_assessment: commands
            .iter()
            .map(|command| AiAutopilotRiskAssessment {
                command_id: command.id.clone(),
                risk: command.risk.clone(),
                reason: risk_review_reason(command).to_string(),
                guardrail: guardrail_for_risk(&command.risk).to_string(),
            })
            .collect(),
        approval_gates: if approval_gates.is_empty() {
            vec!["No approval gates required for the current low-risk replica queue.".to_string()]
        } else {
            approval_gates
        },
        outcome_checks: vec![
            "Confirm every accepted command writes only a replica action record.".to_string(),
            "Compare live board or asset state before promoting any primary workflow change."
                .to_string(),
            "Review AI memory matches and rejected commands before repeating automation."
                .to_string(),
        ],
        governance_notes: vec![
            "Server does not persist the user-supplied model API key.".to_string(),
            "AI commands must reference supplied action ids or remain observation-only."
                .to_string(),
            "Primary data promotion remains a human or admin-governed operation.".to_string(),
        ],
    }
}

fn fallback_command(index: usize, action: &AiAutopilotActionSnapshot) -> AiAutopilotCommand {
    let risk = risk_for_action(&action.id);
    let approval_required = risk != "low";
    AiAutopilotCommand {
        id: format!("cmd-{}-{}", index + 1, action.id),
        action_id: Some(action.id.clone()),
        title: action.title.clone(),
        app: action.app.clone(),
        target_label: action.target_label.clone(),
        intent: intent_for_action(&action.id, &action.title),
        writes: action.writes.clone(),
        impact_preview: vec![
            format!("Target: {}", action.target_label),
            format!("App boundary: {}", action.app),
            format!(
                "Replica writes: {}",
                if action.writes.is_empty() {
                    "none".to_string()
                } else {
                    action.writes.join(", ")
                }
            ),
        ],
        risk: risk.to_string(),
        approval_required,
        status: if action.disabled {
            "blocked".to_string()
        } else if approval_required {
            "requires_approval".to_string()
        } else {
            "queued".to_string()
        },
    }
}

fn normalized_goal(request: &AiAutopilotPlanRequest) -> String {
    let trimmed = request.goal.trim();
    if trimmed.is_empty() {
        "Drive the project toward delivery readiness".to_string()
    } else {
        trimmed.to_string()
    }
}

fn normalize_mode(mode: &str, request: &AiAutopilotPlanRequest) -> String {
    let lowered = mode.to_ascii_lowercase();
    if matches!(lowered.as_str(), "advisor" | "operator" | "manager") {
        return lowered;
    }
    if request
        .signals
        .iter()
        .all(|signal| signal.strength != "blocked")
        && request.actions.iter().any(|action| !action.disabled)
    {
        "manager".to_string()
    } else if request.actions.iter().any(|action| !action.disabled) {
        "operator".to_string()
    } else {
        "advisor".to_string()
    }
}

fn fallback_confidence(request: &AiAutopilotPlanRequest) -> f32 {
    let ready_actions = request
        .actions
        .iter()
        .filter(|action| !action.disabled)
        .count();
    let ready_signals = request
        .signals
        .iter()
        .filter(|signal| signal.strength == "ready")
        .count();
    (0.42 + (ready_actions.min(4) as f32 * 0.08) + (ready_signals.min(3) as f32 * 0.06)).min(0.9)
}

fn fallback_summary(request: &AiAutopilotPlanRequest) -> String {
    let ready_actions = request
        .actions
        .iter()
        .filter(|action| !action.disabled)
        .count();
    format!(
        "{} guarded commands available across {} signals; all writes remain replica-only.",
        ready_actions,
        request.signals.len()
    )
}

fn fallback_audit_trail(request: &AiAutopilotPlanRequest) -> Vec<String> {
    vec![
        format!("Goal captured: {}", normalized_goal(request)),
        format!(
            "Observed {} guarded actions and {} emergent signals.",
            request.actions.len(),
            request.signals.len()
        ),
        "Guardrails: medium and high risk commands require human approval before replica recording."
            .to_string(),
    ]
}

fn default_autopilot_nodes() -> Vec<LangGraphNode> {
    vec![
        LangGraphNode {
            name: "context_hydrator".to_string(),
            state: "ready".to_string(),
            detail: "Loads issue, asset, version, governance, and readiness state.".to_string(),
        },
        LangGraphNode {
            name: "evidence_retriever".to_string(),
            state: "ready".to_string(),
            detail: "Links supplied context, emergent signals, and operation memory candidates."
                .to_string(),
        },
        LangGraphNode {
            name: "risk_scorer".to_string(),
            state: "guarded".to_string(),
            detail: "Scores command risk from app boundary, write scope, and delivery impact."
                .to_string(),
        },
        LangGraphNode {
            name: "action_planner".to_string(),
            state: "ready".to_string(),
            detail: "Ranks guarded commands by delivery impact, evidence coverage, and risk."
                .to_string(),
        },
        LangGraphNode {
            name: "policy_guard".to_string(),
            state: "guarded".to_string(),
            detail: "Blocks invented primary writes and requires approval for medium or high risk."
                .to_string(),
        },
        LangGraphNode {
            name: "replica_executor".to_string(),
            state: "planned".to_string(),
            detail: "Records accepted commands only through the replica action channel."
                .to_string(),
        },
        LangGraphNode {
            name: "outcome_evaluator".to_string(),
            state: "planned".to_string(),
            detail: "Checks memory, board consistency, and rejected-command patterns after action."
                .to_string(),
        },
        LangGraphNode {
            name: "approval_gate".to_string(),
            state: "guarded".to_string(),
            detail: "Keeps the existing approval contract visible for compatibility.".to_string(),
        },
    ]
}

fn risk_for_action(action_id: &str) -> &'static str {
    match action_id {
        "create-issue-from-asset" | "transition-review" => "high",
        "version-gate"
        | "attach-asset-evidence"
        | "comment-risk"
        | "rebalance-kanban-wip"
        | "prioritize-board-risk" => "medium",
        _ => "low",
    }
}

fn risk_review_reason(command: &AiAutopilotCommand) -> &'static str {
    match command.risk.as_str() {
        "high" => "Command can create or move workflow records from AI-selected context.",
        "medium" => {
            "Command touches delivery evidence, board priorities, version gates, or review notes."
        }
        _ => "Command is limited to low-risk replica observation or indexing.",
    }
}

fn guardrail_for_risk(risk: &str) -> &'static str {
    match risk {
        "high" => "human_approval_required_and_replica_only",
        "medium" => "human_approval_required_before_replica_recording",
        _ => "replica_only_no_primary_write",
    }
}

fn context_value(context: &serde_json::Value, keys: &[&str]) -> Option<String> {
    keys.iter()
        .find_map(|key| context.get(*key).map(format_context_value))
}

fn format_context_value(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::Null => "null".to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Array(value) => format!("{} items", value.len()),
        serde_json::Value::Object(value) => format!("{} fields", value.len()),
    }
}

fn normalize_risk(risk: &str, action_id: Option<&str>) -> String {
    let lowered = risk.to_ascii_lowercase();
    if matches!(lowered.as_str(), "low" | "medium" | "high") {
        lowered
    } else {
        action_id.map(risk_for_action).unwrap_or("low").to_string()
    }
}

fn normalize_status(
    status: &str,
    approval_required: bool,
    action: Option<&AiAutopilotActionSnapshot>,
) -> String {
    if action.map(|item| item.disabled).unwrap_or(false) {
        return "blocked".to_string();
    }
    let lowered = status.to_ascii_lowercase();
    if matches!(
        lowered.as_str(),
        "queued" | "requires_approval" | "blocked" | "done"
    ) {
        return lowered;
    }
    if approval_required {
        "requires_approval".to_string()
    } else {
        "queued".to_string()
    }
}

fn intent_for_action(action_id: &str, title: &str) -> String {
    match action_id {
        "index-data-lake" => "Record a replica proposal to promote useful lake records into AI-readable retrieval context.".to_string(),
        "version-gate" => "Record a replica branch-style gate proposal for the most relevant asset version.".to_string(),
        "attach-asset-evidence" => "Record a replica evidence-link proposal for the strongest Jira-style work item.".to_string(),
        "create-issue-from-asset" => "Record a replica follow-up issue proposal from selected lake evidence.".to_string(),
        "transition-review" => "Record a replica review-lane transition proposal after evidence is prepared.".to_string(),
        "comment-risk" => "Record a replica risk-note proposal for the strongest issue target.".to_string(),
        _ => format!("Record {} through the replica-only control bus.", title),
    }
}

fn autopilot_action_order() -> [&'static str; 8] {
    [
        "index-data-lake",
        "version-gate",
        "attach-asset-evidence",
        "create-issue-from-asset",
        "transition-review",
        "comment-risk",
        "log-ai-work",
        "update-asset-evidence",
    ]
}

fn slug_goal(goal: &str) -> String {
    let mut output = String::new();
    let mut last_dash = false;
    for ch in goal.to_ascii_lowercase().chars() {
        if ch.is_ascii_alphanumeric() {
            output.push(ch);
            last_dash = false;
        } else if !last_dash {
            output.push('-');
            last_dash = true;
        }
    }
    let trimmed = output.trim_matches('-');
    if trimmed.is_empty() {
        "delivery-readiness".to_string()
    } else {
        trimmed.to_string()
    }
}

fn build_fallback_chat_response(
    request: &AiChatRequest,
    ai_status: AiCallStatus,
    rag_context: Option<&RagSearchResponse>,
    people_context: PeopleAssistantContext,
    langgraph_nodes: Vec<LangGraphNode>,
) -> AiChatResponse {
    let trimmed = request.message.trim();
    let memory_count = rag_context
        .map(|context| context.matches.len())
        .unwrap_or(0);
    let people_hint = if people_context.available {
        format!(
            " I also matched {} controlled capability tags against the current app context.",
            people_context.capabilities.len()
        )
    } else {
        String::new()
    };
    let focus = if trimmed.is_empty() {
        "Tell me what you want to control, then choose a guarded action button."
    } else if memory_count > 0 {
        "I retrieved related operation memory from RAG. Use the guarded buttons below to control data lake evidence, version gates, issue flow, or cross-app links."
    } else {
        "I can prepare the relevant product context. Use the guarded buttons below to control data lake evidence, version gates, issue flow, or cross-app links."
    };

    AiChatResponse {
        conversation_id: request.conversation_id.unwrap_or_else(Uuid::new_v4),
        message: format!("{}{}", focus, people_hint),
        actions: contextual_chat_actions(request),
        langgraph_nodes,
        people_context,
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

fn build_chat_prompt(
    request: &AiChatRequest,
    rag_context: Option<&RagSearchResponse>,
    people_context: &PeopleAssistantContext,
    langgraph_nodes: &[LangGraphNode],
) -> String {
    format!(
        "User message:\n{}\n\nCurrent app:\n{} / {} / {}\n\nCurrent product context:\n{}\n\nControlled employee context (PII removed):\n{}\n\nLangGraph execution plan:\n{}\n\nRelevant operation memory:\n{}",
        request.message.trim(),
        request.app_id.as_deref().unwrap_or("unified-platform"),
        request.route_id.as_deref().unwrap_or("unknown-route"),
        request.pathname.as_deref().unwrap_or("/"),
        request.context.as_deref().unwrap_or("No context supplied."),
        serde_json::to_string(people_context).unwrap_or_else(|_| "{}".to_string()),
        serde_json::to_string(langgraph_nodes).unwrap_or_else(|_| "[]".to_string()),
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
            description: "Review a replica-only risk comment before recording it.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Review Transition".to_string(),
            action_id: "transition-review".to_string(),
            kind: "issue.transition".to_string(),
            description: "Open the guarded issue transition workflow.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "AI Work Log".to_string(),
            action_id: "log-ai-work".to_string(),
            kind: "issue.work_log".to_string(),
            description: "Review an AI-authored work-log proposal.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Asset Evidence Update".to_string(),
            action_id: "update-asset-evidence".to_string(),
            kind: "asset.update".to_string(),
            description: "Open the evidence update proposal in AI Control.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Lake Index".to_string(),
            action_id: "index-data-lake".to_string(),
            kind: "asset.index".to_string(),
            description: "Inspect the data-lake indexing action.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Version Gate".to_string(),
            action_id: "version-gate".to_string(),
            kind: "asset.version_gate".to_string(),
            description: "Open the version gate review workflow.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Open Issue".to_string(),
            action_id: "create-issue-from-asset".to_string(),
            kind: "issue.create_from_asset".to_string(),
            description: "Review issue creation from governed asset evidence.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
        AiChatAction {
            label: "Attach Evidence".to_string(),
            action_id: "attach-asset-evidence".to_string(),
            kind: "issue.attach_asset".to_string(),
            description: "Review an asset-evidence attachment proposal.".to_string(),
            href: Some("/ai-control".to_string()),
            requires_human_approval: true,
            status: "requires_approval".to_string(),
        },
    ]
}

fn contextual_chat_actions(request: &AiChatRequest) -> Vec<AiChatAction> {
    let message = request.message.to_lowercase();
    let mut actions = vec![route_action(
        "Match People",
        "search-people",
        "people.search",
        "/people-intelligence",
        "Use verified capability tags, evidence confidence, availability, and project fit.",
    )];

    if contains_any(&message, &["wiki", "知识", "文档", "协作编辑"]) {
        actions.push(route_action(
            "Open Wiki",
            "open-wiki",
            "wiki.navigate",
            "/wiki",
            "Continue in the collaborative knowledge workspace.",
        ));
    }
    if contains_any(&message, &["requirement", "brief", "需求", "设计要求"]) {
        actions.push(route_action(
            "Open Requirements",
            "open-design-requirements",
            "design_requirement.navigate",
            "/design-requirements",
            "Open asset-bound design requirements with the current context.",
        ));
    }
    if contains_any(&message, &["asset", "version", "素材", "资产", "版本"]) {
        actions.push(route_action(
            "Open Assets",
            "open-assets",
            "asset.navigate",
            "/assets",
            "Inspect governed assets and version evidence.",
        ));
    }
    if contains_any(
        &message,
        &["issue", "task", "workflow", "任务", "工单", "流程", "派单"],
    ) {
        actions.push(route_action(
            "Open Work Queue",
            "open-issues",
            "issue.navigate",
            "/issues",
            "Open the production work queue with the assistant context preserved.",
        ));
    }

    if contains_any(
        &message,
        &[
            "create",
            "update",
            "assign",
            "transition",
            "approve",
            "deliver",
            "创建",
            "修改",
            "分配",
            "审批",
            "交付",
            "执行",
        ],
    ) {
        actions.extend(default_chat_actions().into_iter().take(2));
    }

    if actions.len() == 1 {
        if let Some(pathname) = request
            .pathname
            .as_deref()
            .filter(|value| value.starts_with('/') && *value != "/")
        {
            actions.push(route_action(
                "Focus Current App",
                "focus-current-app",
                "app.focus",
                pathname,
                "Keep the command scoped to the current app and selected route.",
            ));
        }
    }

    actions.truncate(4);
    actions
}

fn route_action(
    label: &str,
    action_id: &str,
    kind: &str,
    href: &str,
    description: &str,
) -> AiChatAction {
    AiChatAction {
        label: label.to_string(),
        action_id: action_id.to_string(),
        kind: kind.to_string(),
        description: description.to_string(),
        href: Some(href.to_string()),
        requires_human_approval: false,
        status: "ready".to_string(),
    }
}

fn contains_any(message: &str, values: &[&str]) -> bool {
    values.iter().any(|value| message.contains(value))
}

fn assistant_action_allowed(role: &str, action: &AiChatAction) -> bool {
    let role = role.trim().to_ascii_lowercase().replace('_', "-");
    if role == "admin" {
        return true;
    }
    if action.kind == "people.search" {
        return matches!(
            role.as_str(),
            "producer" | "artist" | "reviewer" | "manager"
        );
    }
    if action.requires_human_approval || action.href.as_deref() == Some("/ai-control") {
        return role == "producer";
    }
    true
}

async fn load_people_assistant_context(
    state: &web::Data<AppState>,
    actor: &AppActor,
) -> PeopleAssistantContext {
    let profile = match state
        .people_intelligence_service
        .get_profile(actor, actor.user_id)
        .await
    {
        Ok(profile) => profile,
        Err(error) => {
            tracing::debug!(error = %error, "employee context is unavailable for assistant");
            return unavailable_people_context();
        }
    };
    let evaluation = state
        .people_intelligence_service
        .get_evaluation(actor, actor.user_id, 90)
        .await
        .ok();
    people_assistant_context(&profile, evaluation.as_ref())
}

fn people_assistant_context(
    profile: &EmployeeProfile,
    evaluation: Option<&EmployeeEvaluation>,
) -> PeopleAssistantContext {
    let mut capabilities = profile
        .capabilities
        .iter()
        .map(|capability| PeopleCapabilityContext {
            name: capability.name.clone(),
            kind: capability.kind.clone(),
            proficiency: capability.proficiency,
            verification_status: capability.verification_status.clone(),
            evidence_count: capability.evidence_count,
        })
        .collect::<Vec<_>>();
    capabilities.sort_by(|left, right| {
        right
            .verification_status
            .eq("verified")
            .cmp(&left.verification_status.eq("verified"))
            .then_with(|| right.proficiency.cmp(&left.proficiency))
            .then_with(|| right.evidence_count.cmp(&left.evidence_count))
    });
    capabilities.truncate(24);

    let emergent_signals = evaluation
        .map(|value| {
            value
                .signals
                .iter()
                .take(8)
                .map(|signal| PeopleSignalContext {
                    signal_type: signal.signal_type.clone(),
                    title: signal.title.clone(),
                    confidence: signal.confidence,
                    evidence_count: signal.evidence_count,
                })
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();

    PeopleAssistantContext {
        available: true,
        job_title: profile.job_title.clone(),
        level: profile.level.clone(),
        languages: profile.languages.clone(),
        availability_status: Some(profile.availability_status.clone()),
        workload_percent: Some(profile.workload_percent),
        capabilities,
        preferred_project_types: profile.preferences.preferred_project_types.clone(),
        evidence_sample_size: evaluation.map(|value| value.sample_size).unwrap_or(0),
        project_count: evaluation.map(|value| value.project_count).unwrap_or(0),
        confidence: evaluation.map(|value| value.confidence).unwrap_or(0.0),
        emergent_signals,
    }
}

fn unavailable_people_context() -> PeopleAssistantContext {
    PeopleAssistantContext {
        available: false,
        job_title: None,
        level: None,
        languages: Vec::new(),
        availability_status: None,
        workload_percent: None,
        capabilities: Vec::new(),
        preferred_project_types: Vec::new(),
        evidence_sample_size: 0,
        project_count: 0,
        confidence: 0.0,
        emergent_signals: Vec::new(),
    }
}

fn employee_langgraph_nodes(
    request: &AiChatRequest,
    people_context: &PeopleAssistantContext,
) -> Vec<LangGraphNode> {
    let app_id = normalized_context_value(request.app_id.as_deref(), "unified-platform");
    vec![
        LangGraphNode {
            name: "observe_app_context".to_string(),
            state: "ready".to_string(),
            detail: format!("Observed {} route, user intent, ACL boundary, and current selection.", app_id),
        },
        LangGraphNode {
            name: "load_employee_profile".to_string(),
            state: if people_context.available { "ready" } else { "guarded" }.to_string(),
            detail: if people_context.available {
                "Loaded a PII-free profile projection from controlled employee attributes.".to_string()
            } else {
                "Employee projection is unavailable; workflow continues without inferred attributes.".to_string()
            },
        },
        LangGraphNode {
            name: "match_capability_tags".to_string(),
            state: "ready".to_string(),
            detail: format!(
                "Matched {} capability tags with verification, evidence recency, availability, and workload.",
                people_context.capabilities.len()
            ),
        },
        LangGraphNode {
            name: "detect_emergent_signals".to_string(),
            state: "ready".to_string(),
            detail: format!(
                "Evaluated {} growth, adjacent-skill, mentor, fit, and team-gap signals without changing formal skills.",
                people_context.emergent_signals.len()
            ),
        },
        LangGraphNode {
            name: "propose_guarded_actions".to_string(),
            state: "planned".to_string(),
            detail: "Generated app-scoped actions after permission filtering and included match explanations.".to_string(),
        },
        LangGraphNode {
            name: "human_approval".to_string(),
            state: "guarded".to_string(),
            detail: "Primary writes, evaluations, assignments, approvals, and deliveries require explicit human approval.".to_string(),
        },
        LangGraphNode {
            name: "execute_allowed_action".to_string(),
            state: "planned".to_string(),
            detail: "Navigation may run immediately; approved writes execute through the owning app interface.".to_string(),
        },
        LangGraphNode {
            name: "learn_from_feedback".to_string(),
            state: "planned".to_string(),
            detail: "Accept, reject, and correction feedback tunes recommendations without changing formal evaluation data.".to_string(),
        },
    ]
}

fn normalized_context_value(value: Option<&str>, fallback: &str) -> String {
    let normalized = value.unwrap_or(fallback).trim().replace(['\n', '\r'], " ");
    if normalized.is_empty() {
        return fallback.to_string();
    }
    normalized.chars().take(160).collect()
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

    use super::{
        assistant_action_allowed, contextual_chat_actions, employee_langgraph_nodes,
        management_ai_test, management_autopilot_plan, management_intelligence,
        unavailable_people_context, AiChatRequest,
    };

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

    #[actix_web::test]
    async fn management_autopilot_plan_returns_guarded_contract() {
        let app = test::init_service(App::new().service(management_autopilot_plan)).await;
        let request = test::TestRequest::post()
            .uri("/api/management/autopilot-plan")
            .set_json(serde_json::json!({
                "goal": "Drive delivery readiness",
                "context": {"issues": 3, "assets": 2},
                "actions": [{
                    "id": "version-gate",
                    "title": "Version Gate",
                    "app": "Version Graph",
                    "target_label": "asset.png / v2",
                    "writes": ["replica version gate proposal"],
                    "disabled": false
                }],
                "signals": [{
                    "id": "version-drift",
                    "source": "Version Graph",
                    "strength": "watch"
                }]
            }))
            .to_request();
        let response = test::call_service(&app, request).await;

        assert_eq!(response.status(), StatusCode::OK);

        let body: Value = test::read_body_json(response).await;
        assert_eq!(body["success"], true);
        assert_eq!(body["data"]["ai_status"]["configured"], false);
        assert_eq!(body["data"]["commands"][0]["action_id"], "version-gate");
        assert_eq!(body["data"]["commands"][0]["status"], "requires_approval");
        assert!(body["data"]["decision_review"]["evidence"]
            .as_array()
            .expect("decision review evidence is array")
            .iter()
            .any(|item| item["label"] == "Product Context"));
        assert!(body["data"]["decision_review"]["risk_assessment"]
            .as_array()
            .expect("decision review risk assessment is array")
            .iter()
            .any(|item| item["command_id"] == "cmd-1-version-gate"));
        assert!(body["data"]["decision_review"]["governance_notes"]
            .as_array()
            .expect("decision review governance notes is array")
            .iter()
            .any(|item| item
                .as_str()
                .unwrap_or_default()
                .contains("does not persist")));
        assert!(body["data"]["langgraph_nodes"]
            .as_array()
            .expect("langgraph_nodes is array")
            .iter()
            .any(|node| node["name"] == "approval_gate"));
    }

    #[actix_web::test]
    async fn management_ai_test_without_config_returns_contract() {
        let app = test::init_service(App::new().service(management_ai_test)).await;
        let request = test::TestRequest::post()
            .uri("/api/management/ai/test")
            .to_request();
        let response = test::call_service(&app, request).await;

        assert_eq!(response.status(), StatusCode::OK);

        let body: Value = test::read_body_json(response).await;
        assert_eq!(body["success"], true);
        assert_eq!(body["data"]["ok"], false);
        assert_eq!(body["data"]["message"], "AI API is not configured");
        assert_eq!(body["data"]["latency_ms"], 0);
        assert_eq!(body["data"]["chat_ok"], false);
        assert_eq!(body["data"]["embedding_ok"], false);
        assert_eq!(body["data"]["ai_status"]["configured"], false);
        assert_eq!(body["data"]["ai_status"]["used"], false);
    }

    #[actix_web::test]
    async fn employee_aware_chat_graph_keeps_writes_guarded() {
        let request = AiChatRequest {
            message: "给角色资产分配合适员工并创建任务".to_string(),
            context: None,
            max_tokens: None,
            conversation_id: None,
            app_id: Some("asset-library-app".to_string()),
            route_id: Some("assets.library".to_string()),
            pathname: Some("/assets".to_string()),
        };
        let nodes = employee_langgraph_nodes(&request, &unavailable_people_context());
        let actions = contextual_chat_actions(&request);

        assert!(nodes
            .iter()
            .any(|node| node.name == "match_capability_tags"));
        assert!(nodes
            .iter()
            .any(|node| node.name == "human_approval" && node.state == "guarded"));
        assert!(actions.iter().any(|action| action.kind == "people.search"));
        assert!(actions.iter().any(|action| action.requires_human_approval));
        assert!(actions
            .iter()
            .filter(|action| assistant_action_allowed("artist", action))
            .all(|action| !action.requires_human_approval));
        assert!(actions
            .iter()
            .filter(|action| assistant_action_allowed("vendor", action))
            .all(|action| action.kind != "people.search"));
    }
}
