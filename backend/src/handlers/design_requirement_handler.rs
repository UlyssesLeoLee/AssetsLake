/*
```cypher
CREATE
  (f:File {name: "design_requirement_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::design_requirement_handler", type: "module"}),
  (fn1:Function {name: "list_requirements", type: "function", language: "rust"}),
  (fn2:Function {name: "create_requirement", type: "function", language: "rust"}),
  (fn3:Function {name: "get_requirement", type: "function", language: "rust"}),
  (fn4:Function {name: "update_requirement", type: "function", language: "rust"}),
  (fn5:Function {name: "attach_asset", type: "function", language: "rust"}),
  (fn6:Function {name: "add_comment", type: "function", language: "rust"}),
  (fn7:Function {name: "draft_requirement", type: "function", language: "rust"}),
  (fn8:Function {name: "request_actor", type: "function", language: "rust", signature: "async fn request_actor(state: &web::Data<AppState>, request: &HttpRequest) -> Result<AppActor, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (fn2)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn8),
  (fn6)-[:CALLS]->(fn8);
```
*/

use actix_web::{get, patch, post, web, HttpRequest, HttpResponse};
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    interfaces::{
        asset_if::AssetIf,
        design_ai_if::{DesignAiConfig, DesignAiIf},
        design_requirement_if::DesignRequirementIf,
        AppActor,
    },
    models::design_requirement::{
        AttachDesignAssetRequest, CreateDesignCommentRequest, CreateDesignRequirementRequest,
        DesignAiDraftRequest, DesignRequirementQuery, UpdateDesignRequirementRequest,
    },
    services::ai_provider_service::AiProviderConfig,
    AppState,
};

#[get("/api/design-requirements")]
pub async fn list_requirements(
    state: web::Data<AppState>,
    query: web::Query<DesignRequirementQuery>,
) -> Result<HttpResponse, AppError> {
    let requirements = state
        .design_requirement_service
        .list_requirements(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(requirements)))
}

#[post("/api/design-requirements")]
pub async fn create_requirement(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<CreateDesignRequirementRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let requirement = state
        .design_requirement_service
        .create_requirement(&actor, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(requirement)))
}

#[get("/api/design-requirements/{requirement_id}")]
pub async fn get_requirement(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let detail = state
        .design_requirement_service
        .get_requirement(*path)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(detail)))
}

#[patch("/api/design-requirements/{requirement_id}")]
pub async fn update_requirement(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    body: web::Json<UpdateDesignRequirementRequest>,
) -> Result<HttpResponse, AppError> {
    let requirement = state
        .design_requirement_service
        .update_requirement(*path, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(requirement)))
}

#[post("/api/design-requirements/{requirement_id}/assets")]
pub async fn attach_asset(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<AttachDesignAssetRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let binding = state
        .design_requirement_service
        .attach_asset(&state.asset_if_service, &actor, *path, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(binding)))
}

#[post("/api/design-requirements/{requirement_id}/comments")]
pub async fn add_comment(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<CreateDesignCommentRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let comment = state
        .design_requirement_service
        .add_comment(&actor, *path, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(comment)))
}

#[post("/api/design-requirements/ai/draft")]
pub async fn draft_requirement(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<DesignAiDraftRequest>,
) -> Result<HttpResponse, AppError> {
    let provider = AiProviderConfig::from_headers(request.headers())
        .ok_or_else(|| AppError::validation("AI provider is not configured"))?;
    let body = body.into_inner();
    if body.prompt.trim().is_empty() {
        return Err(AppError::validation("Design AI prompt is required"));
    }
    let prompt = format!(
        "Workspace: {}\nProject: {}\n{}",
        body.workspace_id,
        body.project_id
            .map(|value| value.to_string())
            .unwrap_or_else(|| "not assigned".to_string()),
        body.prompt.trim()
    );
    let mut assets = Vec::with_capacity(body.asset_ids.len());
    for asset_id in body.asset_ids {
        assets.push(state.asset_if_service.resolve_asset(asset_id).await?);
    }
    let config = DesignAiConfig {
        provider: provider.provider,
        base_url: provider.base_url,
        model: provider.model,
        api_key: provider.api_key,
    };
    let draft = state
        .design_ai_if_service
        .draft_requirement(&config, &prompt, &assets)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(draft)))
}

async fn request_actor(
    state: &web::Data<AppState>,
    request: &HttpRequest,
) -> Result<AppActor, AppError> {
    let session = state.auth_service.authenticate_request(request).await?;
    Ok(AppActor::from_session(&session))
}
