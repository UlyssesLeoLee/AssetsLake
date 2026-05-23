/*
```cypher
CREATE
  (f:File {name: "project_management_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::project_management_handler", type: "module"}),
  (fn1:Function {name: "planning_plan", type: "function", language: "rust", signature: "async fn planning_plan(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "list_epics", type: "function", language: "rust", signature: "async fn list_epics(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "create_epic", type: "function", language: "rust", signature: "async fn create_epic(state: web::Data<AppState>, body: web::Json<CreateEpicRequest>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "list_sprints", type: "function", language: "rust", signature: "async fn list_sprints(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn5:Function {name: "create_sprint", type: "function", language: "rust", signature: "async fn create_sprint(state: web::Data<AppState>, body: web::Json<CreateSprintRequest>) -> Result<HttpResponse, AppError>"}),
  (fn6:Function {name: "list_dependencies", type: "function", language: "rust", signature: "async fn list_dependencies(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn7:Function {name: "create_dependency", type: "function", language: "rust", signature: "async fn create_dependency(state: web::Data<AppState>, body: web::Json<CreateIssueDependencyRequest>) -> Result<HttpResponse, AppError>"}),
  (fn8:Function {name: "list_events", type: "function", language: "rust", signature: "async fn list_events(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn9:Function {name: "gantt_snapshot", type: "function", language: "rust", signature: "async fn gantt_snapshot(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn10:Function {name: "calendar_snapshot", type: "function", language: "rust", signature: "async fn calendar_snapshot(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn11:Function {name: "reports_snapshot", type: "function", language: "rust", signature: "async fn reports_snapshot(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn12:Function {name: "workflow_catalog", type: "function", language: "rust", signature: "async fn workflow_catalog(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn13:Function {name: "automation_catalog", type: "function", language: "rust", signature: "async fn automation_catalog(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (fn14:Function {name: "enterprise_controls", type: "function", language: "rust", signature: "async fn enterprise_controls(state: web::Data<AppState>, query: web::Query<ProjectManagementQuery>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state.project_management_service", type: "variable"}),
  (v2:Variable {name: "ApiResponse", type: "variable"}),
  (f)-[:CONTAINS]->(m),
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
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v2),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2),
  (fn7)-[:USES]->(v1),
  (fn7)-[:USES]->(v2),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v2),
  (fn9)-[:USES]->(v1),
  (fn9)-[:USES]->(v2),
  (fn10)-[:USES]->(v1),
  (fn10)-[:USES]->(v2),
  (fn11)-[:USES]->(v1),
  (fn11)-[:USES]->(v2),
  (fn12)-[:USES]->(v1),
  (fn12)-[:USES]->(v2),
  (fn13)-[:USES]->(v1),
  (fn13)-[:USES]->(v2),
  (fn14)-[:USES]->(v1),
  (fn14)-[:USES]->(v2);
```
*/

use actix_web::{get, post, web, HttpResponse};

use crate::{
    errors::{ApiResponse, AppError},
    models::project_management::{
        CreateEpicRequest, CreateIssueDependencyRequest, CreateSprintRequest,
        ProjectManagementQuery,
    },
    AppState,
};

/// GET /api/project-management/plan
#[get("/api/project-management/plan")]
pub async fn planning_plan(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let plan = state
        .project_management_service
        .planning_plan(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(plan)))
}

/// GET /api/project-management/epics
#[get("/api/project-management/epics")]
pub async fn list_epics(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let epics = state.project_management_service.list_epics(&query).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(epics)))
}

/// POST /api/project-management/epics
#[post("/api/project-management/epics")]
pub async fn create_epic(
    state: web::Data<AppState>,
    body: web::Json<CreateEpicRequest>,
) -> Result<HttpResponse, AppError> {
    let epic = state
        .project_management_service
        .create_epic(body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(epic)))
}

/// GET /api/project-management/sprints
#[get("/api/project-management/sprints")]
pub async fn list_sprints(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let sprints = state
        .project_management_service
        .list_sprints(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(sprints)))
}

/// POST /api/project-management/sprints
#[post("/api/project-management/sprints")]
pub async fn create_sprint(
    state: web::Data<AppState>,
    body: web::Json<CreateSprintRequest>,
) -> Result<HttpResponse, AppError> {
    let sprint = state
        .project_management_service
        .create_sprint(body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(sprint)))
}

/// GET /api/project-management/dependencies
#[get("/api/project-management/dependencies")]
pub async fn list_dependencies(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let dependencies = state
        .project_management_service
        .list_dependencies(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(dependencies)))
}

/// POST /api/project-management/dependencies
#[post("/api/project-management/dependencies")]
pub async fn create_dependency(
    state: web::Data<AppState>,
    body: web::Json<CreateIssueDependencyRequest>,
) -> Result<HttpResponse, AppError> {
    let dependency = state
        .project_management_service
        .create_dependency(body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(dependency)))
}

/// GET /api/project-management/events
#[get("/api/project-management/events")]
pub async fn list_events(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let events = state.project_management_service.list_events(&query).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(events)))
}

/// GET /api/project-management/gantt
#[get("/api/project-management/gantt")]
pub async fn gantt_snapshot(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let snapshot = state
        .project_management_service
        .gantt_snapshot(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

/// GET /api/project-management/calendar
#[get("/api/project-management/calendar")]
pub async fn calendar_snapshot(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let snapshot = state
        .project_management_service
        .calendar_snapshot(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

/// GET /api/project-management/reports
#[get("/api/project-management/reports")]
pub async fn reports_snapshot(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let snapshot = state
        .project_management_service
        .reports_snapshot(&query)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

/// GET /api/project-management/workflow
#[get("/api/project-management/workflow")]
pub async fn workflow_catalog(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let catalog = state.project_management_service.workflow_catalog(&query)?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(catalog)))
}

/// GET /api/project-management/automation
#[get("/api/project-management/automation")]
pub async fn automation_catalog(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let catalog = state
        .project_management_service
        .automation_catalog(&query)?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(catalog)))
}

/// GET /api/project-management/enterprise
#[get("/api/project-management/enterprise")]
pub async fn enterprise_controls(
    state: web::Data<AppState>,
    query: web::Query<ProjectManagementQuery>,
) -> Result<HttpResponse, AppError> {
    let controls = state
        .project_management_service
        .enterprise_controls(&query)?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(controls)))
}
