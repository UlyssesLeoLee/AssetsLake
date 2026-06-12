/*
```cypher
CREATE
  (f:File {name: "wiki_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::wiki_handler", type: "module"}),
  (c1:Class {name: "WikiSpaceQuery", type: "class", language: "rust", signature: "struct WikiSpaceQuery"}),
  (fn1:Function {name: "list_spaces", type: "function", language: "rust"}),
  (fn2:Function {name: "create_space", type: "function", language: "rust"}),
  (fn3:Function {name: "list_pages", type: "function", language: "rust"}),
  (fn4:Function {name: "create_page", type: "function", language: "rust"}),
  (fn5:Function {name: "get_page", type: "function", language: "rust"}),
  (fn6:Function {name: "sync_page", type: "function", language: "rust"}),
  (fn7:Function {name: "apply_update", type: "function", language: "rust"}),
  (fn8:Function {name: "touch_presence", type: "function", language: "rust"}),
  (fn9:Function {name: "request_actor", type: "function", language: "rust", signature: "async fn request_actor(state: &web::Data<AppState>, request: &HttpRequest) -> Result<AppActor, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (fn2)-[:CALLS]->(fn9),
  (fn4)-[:CALLS]->(fn9),
  (fn7)-[:CALLS]->(fn9),
  (fn8)-[:CALLS]->(fn9);
```
*/

use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError},
    interfaces::{wiki_if::WikiIf, AppActor},
    models::wiki::{
        ApplyWikiUpdateRequest, CreateWikiPageRequest, CreateWikiSpaceRequest, WikiPresenceRequest,
        WikiSyncQuery,
    },
    AppState,
};

#[derive(Deserialize)]
pub struct WikiSpaceQuery {
    workspace_id: Uuid,
}

#[get("/api/wiki/spaces")]
pub async fn list_spaces(
    state: web::Data<AppState>,
    query: web::Query<WikiSpaceQuery>,
) -> Result<HttpResponse, AppError> {
    let spaces = state.wiki_service.list_spaces(query.workspace_id).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(spaces)))
}

#[post("/api/wiki/spaces")]
pub async fn create_space(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<CreateWikiSpaceRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let space = state
        .wiki_service
        .create_space(&actor, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(space)))
}

#[get("/api/wiki/spaces/{space_id}/pages")]
pub async fn list_pages(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let pages = state.wiki_service.list_pages(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(pages)))
}

#[post("/api/wiki/pages")]
pub async fn create_page(
    state: web::Data<AppState>,
    request: HttpRequest,
    body: web::Json<CreateWikiPageRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let page = state
        .wiki_service
        .create_page(&actor, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(page)))
}

#[get("/api/wiki/pages/{page_id}")]
pub async fn get_page(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let page = state.wiki_service.get_page(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(page)))
}

#[get("/api/wiki/pages/{page_id}/sync")]
pub async fn sync_page(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    query: web::Query<WikiSyncQuery>,
) -> Result<HttpResponse, AppError> {
    let snapshot = state
        .wiki_service
        .sync_page(*path, query.after_version.unwrap_or_default())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(snapshot)))
}

#[post("/api/wiki/pages/{page_id}/updates")]
pub async fn apply_update(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<ApplyWikiUpdateRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let update = state
        .wiki_service
        .apply_update(&actor, *path, body.into_inner())
        .await?;
    Ok(HttpResponse::Created().json(ApiResponse::ok(update)))
}

#[post("/api/wiki/pages/{page_id}/presence")]
pub async fn touch_presence(
    state: web::Data<AppState>,
    request: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<WikiPresenceRequest>,
) -> Result<HttpResponse, AppError> {
    let actor = request_actor(&state, &request).await?;
    let collaborators = state
        .wiki_service
        .touch_presence(&actor, *path, body.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(collaborators)))
}

async fn request_actor(
    state: &web::Data<AppState>,
    request: &HttpRequest,
) -> Result<AppActor, AppError> {
    let session = state.auth_service.authenticate_request(request).await?;
    Ok(AppActor::from_session(&session))
}
