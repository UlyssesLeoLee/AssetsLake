/*
```cypher
CREATE
  (f:File {name: "production_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::production_handler", type: "module"}),
  (fn1:Function {name: "list_issues", type: "function", language: "rust", signature: "async fn list_issues(state: web::Data<AppState>, query: web::Query<IssueQuery>) -> Result<HttpResponse, AppError>"}),
  (fn2:Function {name: "create_issue", type: "function", language: "rust", signature: "async fn create_issue(state: web::Data<AppState>, body: web::Json<CreateIssueRequest>) -> Result<HttpResponse, AppError>"}),
  (fn3:Function {name: "get_issue", type: "function", language: "rust", signature: "async fn get_issue(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn4:Function {name: "update_issue", type: "function", language: "rust", signature: "async fn update_issue(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<UpdateIssueRequest>) -> Result<HttpResponse, AppError>"}),
  (fn5:Function {name: "transition_issue", type: "function", language: "rust", signature: "async fn transition_issue(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<TransitionIssueRequest>) -> Result<HttpResponse, AppError>"}),
  (fn6:Function {name: "add_issue_comment", type: "function", language: "rust", signature: "async fn add_issue_comment(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<CreateIssueCommentRequest>) -> Result<HttpResponse, AppError>"}),
  (fn7:Function {name: "list_issue_comments", type: "function", language: "rust", signature: "async fn list_issue_comments(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn8:Function {name: "attach_issue_asset", type: "function", language: "rust", signature: "async fn attach_issue_asset(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<AttachIssueAssetRequest>) -> Result<HttpResponse, AppError>"}),
  (fn9:Function {name: "list_issue_assets", type: "function", language: "rust", signature: "async fn list_issue_assets(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn10:Function {name: "list_issue_history", type: "function", language: "rust", signature: "async fn list_issue_history(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn11:Function {name: "create_issue_work_log", type: "function", language: "rust", signature: "async fn create_issue_work_log(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<CreateIssueWorkLogRequest>) -> Result<HttpResponse, AppError>"}),
  (fn12:Function {name: "list_issue_work_logs", type: "function", language: "rust", signature: "async fn list_issue_work_logs(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn13:Function {name: "delete_issue", type: "function", language: "rust", signature: "async fn delete_issue(state: web::Data<AppState>, path: web::Path<Uuid>) -> Result<HttpResponse, AppError>"}),
  (fn14:Function {name: "create_issue_review", type: "function", language: "rust", signature: "async fn create_issue_review(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<CreateReviewRequest>) -> Result<HttpResponse, AppError>"}),
  (fn15:Function {name: "approve_issue", type: "function", language: "rust", signature: "async fn approve_issue(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<ApproveIssueRequest>) -> Result<HttpResponse, AppError>"}),
  (fn16:Function {name: "request_issue_revision", type: "function", language: "rust", signature: "async fn request_issue_revision(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<RequestRevisionRequest>) -> Result<HttpResponse, AppError>"}),
  (fn17:Function {name: "list_milestones", type: "function", language: "rust", signature: "async fn list_milestones(state: web::Data<AppState>, query: web::Query<MilestoneQuery>) -> Result<HttpResponse, AppError>"}),
  (fn18:Function {name: "create_delivery_package", type: "function", language: "rust", signature: "async fn create_delivery_package(state: web::Data<AppState>, body: web::Json<CreateDeliveryPackageRequest>) -> Result<HttpResponse, AppError>"}),
  (fn19:Function {name: "submit_delivery_package", type: "function", language: "rust", signature: "async fn submit_delivery_package(state: web::Data<AppState>, path: web::Path<Uuid>, body: web::Json<SubmitDeliveryPackageRequest>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state.production_service", type: "variable"}),
  (v2:Variable {name: "ApiResponse", type: "variable"}),
  (v3:Variable {name: "PaginatedResponse", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn15),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn7)-[:USES]->(v1),
  (fn8)-[:USES]->(v1),
  (fn9)-[:USES]->(v1),
  (fn10)-[:USES]->(v1),
  (fn11)-[:USES]->(v1),
  (fn12)-[:USES]->(v1),
  (fn13)-[:USES]->(v1),
  (fn14)-[:USES]->(v1),
  (fn15)-[:USES]->(v1);
```
*/

use actix_web::{delete, get, patch, post, web, HttpRequest, HttpResponse};
use serde_json::json;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError, PaginatedResponse},
    models::production::{
        ApproveIssueRequest, AttachIssueAssetRequest, CreateDeliveryPackageRequest,
        CreateIssueCommentRequest, CreateIssueRequest, CreateIssueWorkLogRequest,
        CreateReviewRequest, IssueQuery, MilestoneQuery, RequestRevisionRequest,
        SubmitDeliveryPackageRequest, TransitionIssueRequest, UpdateIssueRequest,
    },
    services::{
        ai_provider_service::AiProviderConfig, rag_memory_service::RagOperationMemoryInput,
    },
    AppState,
};

/// GET /api/issues
#[get("/api/issues")]
pub async fn list_issues(
    state: web::Data<AppState>,
    query: web::Query<IssueQuery>,
) -> Result<HttpResponse, AppError> {
    let (issues, total) = state.production_service.list_issues(&query).await?;
    Ok(HttpResponse::Ok().json(PaginatedResponse::new(
        issues,
        total,
        query.page(),
        query.page_size(),
    )))
}

/// POST /api/issues
#[post("/api/issues")]
pub async fn create_issue(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<CreateIssueRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let source_title = request_body.title.clone();
    let source_description = request_body.description.clone();
    let issue = state.production_service.create_issue(request_body).await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.created", "Jira Flow", "issue")
            .entity_id(Some(issue.id))
            .actor("system")
            .summary(format!("Created {} {}", issue.issue_key, issue.title))
            .content(format!(
                "Issue created from product operation. Title: {}. Description: {}. Status: {:?}. Priority: {:?}.",
                source_title,
                source_description.unwrap_or_else(|| "none".to_string()),
                issue.status,
                issue.priority
            ))
            .metadata(json!({
                "issue_key": issue.issue_key.clone(),
                "status": issue.status,
                "priority": issue.priority,
                "issue_type": issue.issue_type
            })),
    )
    .await;
    Ok(HttpResponse::Created().json(ApiResponse::ok(issue)))
}

/// GET /api/issues/{id}
#[get("/api/issues/{id}")]
pub async fn get_issue(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let issue = state.production_service.find_issue(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(issue)))
}

/// PATCH /api/issues/{id}
#[patch("/api/issues/{id}")]
pub async fn update_issue(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<UpdateIssueRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let actor = request_body
        .actor
        .clone()
        .unwrap_or_else(|| "system".to_string());
    let requested_status = request_body.status;
    let requested_priority = request_body.priority;
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let issue = state
        .production_service
        .update_issue(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.updated", "Jira Flow", "issue")
            .entity_id(Some(issue.id))
            .actor(actor)
            .summary(format!("Updated {} {}", issue.issue_key, issue.title))
            .content(format!(
                "Issue metadata updated. Requested status: {:?}. Requested priority: {:?}. Current status: {:?}. Current priority: {:?}.",
                requested_status, requested_priority, issue.status, issue.priority
            ))
            .metadata(json!({
                "issue_key": issue.issue_key.clone(),
                "status": issue.status,
                "priority": issue.priority
            })),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(issue)))
}

/// POST /api/issues/{id}/transition
#[post("/api/issues/{id}/transition")]
pub async fn transition_issue(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<TransitionIssueRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let actor = request_body
        .actor
        .clone()
        .unwrap_or_else(|| "system".to_string());
    let reason = request_body.reason.clone();
    let target_status = request_body.status;
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let issue = state
        .production_service
        .transition_issue(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.transitioned", "Jira Flow", "issue")
            .entity_id(Some(issue.id))
            .actor(actor)
            .summary(format!(
                "Transitioned {} to {:?}",
                issue.issue_key, issue.status
            ))
            .content(format!(
                "Issue transitioned to {:?}. Reason: {}.",
                target_status,
                reason.unwrap_or_else(|| "none".to_string())
            ))
            .metadata(json!({
                "issue_key": issue.issue_key.clone(),
                "to_status": issue.status
            })),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(issue)))
}

/// POST /api/issues/{id}/comments
#[post("/api/issues/{id}/comments")]
pub async fn add_issue_comment(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<CreateIssueCommentRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let author = request_body
        .author_name
        .clone()
        .unwrap_or_else(|| "system".to_string());
    let comment_body = request_body.body.clone();
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let comment = state
        .production_service
        .add_comment(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.comment.created", "Jira Flow", "issue")
            .entity_id(Some(*path))
            .actor(author)
            .summary("Added issue comment")
            .content(comment_body)
            .metadata(json!({
                "comment_id": comment.id,
                "visibility": comment.visibility.clone()
            })),
    )
    .await;
    Ok(HttpResponse::Created().json(ApiResponse::ok(comment)))
}

/// GET /api/issues/{id}/comments
#[get("/api/issues/{id}/comments")]
pub async fn list_issue_comments(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let comments = state.production_service.list_comments(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(comments)))
}

/// POST /api/issues/{id}/attach-asset
#[post("/api/issues/{id}/attach-asset")]
pub async fn attach_issue_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<AttachIssueAssetRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let actor = request_body
        .actor
        .clone()
        .unwrap_or_else(|| "system".to_string());
    let asset_id = request_body.asset_id;
    let link_type = request_body
        .link_type
        .clone()
        .unwrap_or_else(|| "reference".to_string());
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    state
        .production_service
        .attach_asset(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.asset.attached", "Jira Flow", "issue")
            .entity_id(Some(*path))
            .actor(actor)
            .summary("Attached data lake evidence to issue")
            .content(format!(
                "Attached asset {} to issue {} as {} evidence.",
                asset_id, *path, link_type
            ))
            .metadata(json!({
                "asset_id": asset_id,
                "link_type": link_type
            })),
    )
    .await;
    Ok(HttpResponse::Ok().json(serde_json::json!({ "success": true })))
}

/// GET /api/issues/{id}/assets
#[get("/api/issues/{id}/assets")]
pub async fn list_issue_assets(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let assets = state.production_service.list_issue_assets(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(assets)))
}

/// GET /api/issues/{id}/history
#[get("/api/issues/{id}/history")]
pub async fn list_issue_history(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let history = state.production_service.list_issue_history(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(history)))
}

/// POST /api/issues/{id}/work-logs
#[post("/api/issues/{id}/work-logs")]
pub async fn create_issue_work_log(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<CreateIssueWorkLogRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let author = request_body
        .author_name
        .clone()
        .unwrap_or_else(|| "system".to_string());
    let minutes = request_body.time_spent_minutes;
    let work_body = request_body.body.clone();
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let work_log = state
        .production_service
        .create_work_log(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.work_log.created", "Jira Flow", "issue")
            .entity_id(Some(*path))
            .actor(author)
            .summary(format!("Logged {} minutes of work", minutes))
            .content(
                work_body.unwrap_or_else(|| {
                    format!("Logged {} minutes against issue {}", minutes, *path)
                }),
            )
            .metadata(json!({
                "work_log_id": work_log.id,
                "minutes": work_log.time_spent_minutes
            })),
    )
    .await;
    Ok(HttpResponse::Created().json(ApiResponse::ok(work_log)))
}

/// GET /api/issues/{id}/work-logs
#[get("/api/issues/{id}/work-logs")]
pub async fn list_issue_work_logs(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let work_logs = state.production_service.list_work_logs(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(work_logs)))
}

/// DELETE /api/issues/{id}
#[delete("/api/issues/{id}")]
pub async fn delete_issue(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    state.production_service.delete_issue(*path).await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.deleted", "Jira Flow", "issue")
            .entity_id(Some(*path))
            .actor("system")
            .summary("Deleted issue")
            .content(format!(
                "Issue {} was deleted from the product flow.",
                *path
            ))
            .metadata(json!({})),
    )
    .await;
    Ok(HttpResponse::Ok().json(serde_json::json!({ "success": true })))
}

/// POST /api/issues/{id}/review
#[post("/api/issues/{id}/review")]
pub async fn create_issue_review(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<CreateReviewRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let reviewer = request_body
        .reviewer_name
        .clone()
        .unwrap_or_else(|| "reviewer".to_string());
    let summary = request_body.summary.clone();
    let comment = request_body.comment.clone();
    let scope = request_body.scope;
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let review = state
        .production_service
        .create_review(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.review.created", "Jira Flow", "issue")
            .entity_id(Some(*path))
            .actor(reviewer)
            .summary(format!(
                "Created {:?} review round {}",
                scope, review.round_number
            ))
            .content(format!(
                "Review summary: {}. Comment: {}.",
                summary.unwrap_or_else(|| "none".to_string()),
                comment.unwrap_or_else(|| "none".to_string())
            ))
            .metadata(json!({
                "review_id": review.id,
                "scope": review.scope,
                "status": review.status
            })),
    )
    .await;
    Ok(HttpResponse::Created().json(ApiResponse::ok(review)))
}

/// POST /api/issues/{id}/approve
#[post("/api/issues/{id}/approve")]
pub async fn approve_issue(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<ApproveIssueRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let approver = request_body
        .approver_name
        .clone()
        .unwrap_or_else(|| "approver".to_string());
    let note = request_body.note.clone();
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let issue = state
        .production_service
        .approve_issue(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.approved", "Jira Flow", "issue")
            .entity_id(Some(issue.id))
            .actor(approver)
            .summary(format!("Approved {}", issue.issue_key))
            .content(note.unwrap_or_else(|| "Issue approved without additional note.".to_string()))
            .metadata(json!({
                "issue_key": issue.issue_key.clone(),
                "status": issue.status
            })),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(issue)))
}

/// POST /api/issues/{id}/request-revision
#[post("/api/issues/{id}/request-revision")]
pub async fn request_issue_revision(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<RequestRevisionRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let requester = request_body
        .requester_name
        .clone()
        .unwrap_or_else(|| "reviewer".to_string());
    let reason = request_body.reason.clone();
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "issue", *path)
        .await?;
    let issue = state
        .production_service
        .request_revision(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("issue.revision.requested", "Jira Flow", "issue")
            .entity_id(Some(issue.id))
            .actor(requester)
            .summary(format!("Requested revision for {}", issue.issue_key))
            .content(reason)
            .metadata(json!({
                "issue_key": issue.issue_key.clone(),
                "revision_count": issue.revision_count,
                "status": issue.status
            })),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(issue)))
}

/// GET /api/milestones
#[get("/api/milestones")]
pub async fn list_milestones(
    state: web::Data<AppState>,
    query: web::Query<MilestoneQuery>,
) -> Result<HttpResponse, AppError> {
    let milestones = state.production_service.list_milestones(&query).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(milestones)))
}

/// POST /api/delivery-packages
#[post("/api/delivery-packages")]
pub async fn create_delivery_package(
    state: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<CreateDeliveryPackageRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let package_name = request_body.name.clone();
    let asset_count = request_body.asset_ids.len();
    let package = state
        .production_service
        .create_delivery_package(request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("delivery_package.created", "Jira Flow", "delivery_package")
            .entity_id(Some(package.id))
            .actor("delivery-manager")
            .summary(format!("Created delivery package {}", package.name))
            .content(format!(
                "Delivery package {} created with {} assets.",
                package_name, asset_count
            ))
            .metadata(json!({
                "status": package.status,
                "project_id": package.project_id,
                "asset_count": asset_count
            })),
    )
    .await;
    Ok(HttpResponse::Created().json(ApiResponse::ok(package)))
}

/// POST /api/delivery-packages/{id}/submit
#[post("/api/delivery-packages/{id}/submit")]
pub async fn submit_delivery_package(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<SubmitDeliveryPackageRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let actor = request_body
        .actor
        .clone()
        .unwrap_or_else(|| "delivery-manager".to_string());
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "delivery_package", *path)
        .await?;
    let package = state
        .production_service
        .submit_delivery_package(*path, request_body)
        .await?;
    remember_product_operation(
        &state,
        &req,
        RagOperationMemoryInput::new(
            "delivery_package.submitted",
            "Jira Flow",
            "delivery_package",
        )
        .entity_id(Some(package.id))
        .actor(actor)
        .summary(format!("Submitted delivery package {}", package.name))
        .content(format!(
            "Delivery package {} was submitted for delivery readiness.",
            package.name
        ))
        .metadata(json!({
            "status": package.status,
            "project_id": package.project_id
        })),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(package)))
}

async fn remember_product_operation(
    state: &web::Data<AppState>,
    req: &HttpRequest,
    input: RagOperationMemoryInput,
) {
    let ai_config = AiProviderConfig::from_headers(req.headers());
    let result = state
        .rag_memory_service
        .remember_operation(ai_config.as_ref(), input)
        .await;

    if let Some(error) = result.error {
        tracing::warn!(error = %error, "Product operation was not stored in RAG memory");
    }
}
