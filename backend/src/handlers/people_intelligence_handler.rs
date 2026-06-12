/*
```cypher
CREATE
  (f:File {name: "people_intelligence_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::people_intelligence_handler", type: "module"}),
  (c1:Class {name: "EvaluationQuery", type: "class", language: "rust"}),
  (c2:Class {name: "CapabilityQuery", type: "class", language: "rust"}),
  (fn1:Function {name: "my_profile", type: "function", language: "rust"}),
  (fn2:Function {name: "update_my_profile", type: "function", language: "rust"}),
  (fn3:Function {name: "employee_profile", type: "function", language: "rust"}),
  (fn4:Function {name: "search_people", type: "function", language: "rust"}),
  (fn5:Function {name: "employee_evaluation", type: "function", language: "rust"}),
  (fn6:Function {name: "verify_capability", type: "function", language: "rust"}),
  (fn7:Function {name: "submit_correction", type: "function", language: "rust"}),
  (fn8:Function {name: "personalize_content", type: "function", language: "rust"}),
  (fn9:Function {name: "reindex_people", type: "function", language: "rust"}),
  (fn10:Function {name: "request_actor", type: "function", language: "rust"}),
  (fn11:Function {name: "list_capabilities", type: "function", language: "rust"}),
  (fn12:Function {name: "approve_capability", type: "function", language: "rust"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (fn1)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn10),
  (fn3)-[:CALLS]->(fn10),
  (fn4)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn10),
  (fn6)-[:CALLS]->(fn10),
  (fn7)-[:CALLS]->(fn10),
  (fn8)-[:CALLS]->(fn10),
  (fn9)-[:CALLS]->(fn10),
  (fn11)-[:CALLS]->(fn10),
  (fn12)-[:CALLS]->(fn10);
```
*/

use actix_web::{get, patch, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    interfaces::{employee_intelligence_if::EmployeeIntelligenceIf, AppActor},
    models::people_intelligence::{
        ContentRerankRequest, PeopleReindexRequest, PeopleReindexResponse, PeopleSearchQuery,
        SubmitCorrectionRequest, UpdateEmployeeProfileRequest, VerifyCapabilityRequest,
    },
    services::ai_provider_service::AiProviderConfig,
    AppState,
};

#[derive(Deserialize)]
pub struct EvaluationQuery {
    window_days: Option<i32>,
}

#[derive(Deserialize)]
pub struct CapabilityQuery {
    workspace_id: Uuid,
    include_candidates: Option<bool>,
}

#[get("/api/people/capabilities")]
pub async fn list_capabilities(
    state: web::Data<AppState>,
    request: HttpRequest,
    query: web::Query<CapabilityQuery>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let capabilities = state
        .people_intelligence_service
        .list_capabilities(
            &actor,
            query.workspace_id,
            query.include_candidates.unwrap_or(false),
        )
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(capabilities)))
}

#[post("/api/people/admin/capabilities/{capability_id}/approve")]
pub async fn approve_capability(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let capability = state
        .people_intelligence_service
        .approve_capability(&actor, path.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(capability)))
}

#[get("/api/people/me")]
pub async fn my_profile(
    state: web::Data<AppState>,
    request: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let profile = state
        .people_intelligence_service
        .get_profile(&actor, actor.user_id)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(profile)))
}

#[patch("/api/people/me")]
pub async fn update_my_profile(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<UpdateEmployeeProfileRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let profile = state
        .people_intelligence_service
        .update_self_profile(&actor, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(profile)))
}

#[get("/api/people/{user_id}")]
pub async fn employee_profile(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let profile = state
        .people_intelligence_service
        .get_profile(&actor, path.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(profile)))
}

#[post("/api/people/search")]
pub async fn search_people(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<PeopleSearchQuery>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let ai_config = AiProviderConfig::from_headers(request.headers());
    let matches = state
        .people_intelligence_service
        .search_people(&actor, ai_config.as_ref(), body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(matches)))
}

#[get("/api/people/{user_id}/evaluation")]
pub async fn employee_evaluation(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    query: web::Query<EvaluationQuery>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let evaluation = state
        .people_intelligence_service
        .get_evaluation(&actor, path.into_inner(), query.window_days.unwrap_or(90))
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(evaluation)))
}

#[post("/api/people/{user_id}/capabilities/{capability_id}/verify")]
pub async fn verify_capability(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<(Uuid, Uuid)>,
    body: web::Json<VerifyCapabilityRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let (user_id, capability_id) = path.into_inner();
    let capability = state
        .people_intelligence_service
        .verify_capability(&actor, user_id, capability_id, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(capability)))
}

#[post("/api/people/{user_id}/corrections")]
pub async fn submit_correction(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<SubmitCorrectionRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let correction = state
        .people_intelligence_service
        .submit_correction(&actor, path.into_inner(), body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(correction)))
}

#[post("/api/people/personalize")]
pub async fn personalize_content(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<ContentRerankRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let results = state
        .people_intelligence_service
        .rerank_content(&actor, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(results)))
}

#[post("/api/people/admin/reindex")]
pub async fn reindex_people(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<PeopleReindexRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let ai_config = AiProviderConfig::from_headers(request.headers());
    let reindex = body.into_inner();
    let employee_ids = if reindex.employee_ids.is_empty() {
        state
            .people_intelligence_service
            .employee_ids_for_workspace(reindex.workspace_id)
            .await?
    } else {
        reindex.employee_ids
    };
    let mut results = Vec::with_capacity(employee_ids.len());
    for employee_id in employee_ids {
        results.push(
            state
                .people_intelligence_service
                .refresh_employee_projection(&actor, ai_config.as_ref(), employee_id)
                .await?,
        );
    }
    let response = PeopleReindexResponse {
        requested: results.len(),
        indexed: results.iter().filter(|result| result.indexed).count(),
        failed: results.iter().filter(|result| !result.indexed).count(),
        results,
    };
    Ok(HttpResponse::Ok().json(ApiResponse::ok(response)))
}

async fn request_actor(
    state: &web::Data<AppState>,
    request: &HttpRequest,
) -> Result<AppActor, AppError> {
    let session = state.auth_service.authenticate_request(request).await?;
    Ok(AppActor::from_session(&session))
}
