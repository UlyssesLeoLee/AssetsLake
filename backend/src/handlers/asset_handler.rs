use std::env;

use actix_multipart::Multipart;
use actix_web::{delete, get, http::header, patch, post, web, HttpRequest, HttpResponse};
use bytes::BytesMut;
use futures_util::StreamExt;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError, PaginatedResponse},
    models::asset::{AssetQuery, AssetVersionCompareQuery, UpdateAssetRequest},
    models::auth::SessionContext,
    services::{
        ai_provider_service::AiProviderConfig, asset_security_service::AssetAccessToken,
        asset_service::UploadAssetInput, event_publisher_service::DomainEventInput,
        rag_memory_service::RagOperationMemoryInput, security_audit_service::SecurityAuditInput,
    },
    AppState,
};

#[derive(Debug, Deserialize)]
pub struct AssetContentQuery {
    pub expires: Option<i64>,
    pub signature: Option<String>,
    pub download: Option<bool>,
}

/// POST /api/assets/upload
/// Accepts multipart/form-data with fields: file, name, description, project_id, tags, uploader
#[post("/api/assets/upload")]
pub async fn upload_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    mut payload: Multipart,
) -> Result<HttpResponse, AppError> {
    let mut file_bytes: Option<bytes::Bytes> = None;
    let mut original_filename = String::from("unknown");
    let mut mime_type = String::from("application/octet-stream");
    let mut name: Option<String> = None;
    let mut description: Option<String> = None;
    let mut project_id: Option<Uuid> = None;
    let mut tags: Vec<String> = vec![];
    let mut uploader = String::from("anonymous");

    while let Some(item) = payload.next().await {
        let mut field = item.map_err(|e| AppError::validation(e.to_string()))?;
        let field_name = field
            .content_disposition()
            .and_then(|cd| cd.get_name())
            .unwrap_or("")
            .to_string();

        match field_name.as_str() {
            "file" => {
                original_filename = field
                    .content_disposition()
                    .and_then(|cd| cd.get_filename())
                    .map(sanitize_filename)
                    .unwrap_or_else(|| "upload".to_string());

                mime_type = field
                    .content_type()
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| {
                        mime_guess::from_path(&original_filename)
                            .first_or_octet_stream()
                            .to_string()
                    });

                let mut buf = BytesMut::new();
                while let Some(chunk) = field.next().await {
                    let data = chunk.map_err(|e| AppError::internal(e.to_string()))?;
                    buf.extend_from_slice(&data);
                }
                file_bytes = Some(buf.freeze());
            }
            "name" => {
                name = Some(read_field_text(&mut field).await?);
            }
            "description" => {
                description = Some(read_field_text(&mut field).await?);
            }
            "project_id" => {
                let s = read_field_text(&mut field).await?;
                if !s.is_empty() {
                    project_id = Uuid::parse_str(&s).map(Some).unwrap_or_else(|_| {
                        tracing::warn!("Invalid project_id UUID: {}", s);
                        None
                    });
                }
            }
            "tags" => {
                let s = read_field_text(&mut field).await?;
                tags = s
                    .split(',')
                    .map(|t| t.trim().to_string())
                    .filter(|t| !t.is_empty())
                    .collect();
            }
            "uploader" => {
                uploader = read_field_text(&mut field).await?;
            }
            _ => {
                // Drain unknown fields
                while field.next().await.is_some() {}
            }
        }
    }

    let file_bytes =
        file_bytes.ok_or_else(|| AppError::validation("No file field found in multipart form"))?;

    if file_bytes.is_empty() {
        return Err(AppError::validation("Uploaded file is empty"));
    }

    let uploader_for_memory = uploader.clone();
    let result = state
        .asset_service
        .upload_asset(UploadAssetInput {
            file_bytes,
            original_filename,
            mime_type,
            name,
            description,
            project_id,
            tags,
            uploader,
        })
        .await?;

    remember_asset_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("asset.uploaded", "Data Lake", "asset")
            .entity_id(Some(result.asset_id))
            .actor(uploader_for_memory.clone())
            .summary(format!("Uploaded asset {}", result.name))
            .content(format!(
                "Asset uploaded to data lake. Filename: {}. Type: {:?}. Mime: {}. Tags: {}.",
                result.original_filename,
                result.asset_type,
                result.mime_type,
                result.tags.join(", ")
            ))
            .metadata(json!({
                "asset_id": result.asset_id,
                "asset_type": result.asset_type.clone(),
                "version": result.version,
                "bucket": result.bucket.clone(),
                "object_key": result.object_key.clone()
            })),
    )
    .await;
    stage_asset_event(
        &state,
        DomainEventInput::new(
            "assets.asset.v1",
            "AssetUploaded",
            "asset",
            result.asset_id,
            json!({
                "asset_id": result.asset_id,
                "project_id": project_id,
                "name": result.name,
                "bucket": result.bucket,
                "object_key": result.object_key,
                "mime_type": result.mime_type,
                "uploader": uploader_for_memory,
                "version": result.version,
                "status": result.status
            }),
        )
        .idempotency_key(format!("asset-uploaded:{}", result.asset_id)),
    )
    .await;
    record_asset_security_audit(
        &state,
        &req,
        "asset_uploaded",
        result.asset_id,
        json!({
            "project_id": project_id,
            "name": &result.name,
            "original_filename": &result.original_filename,
            "mime_type": &result.mime_type,
            "file_size": result.file_size,
            "version": result.version,
            "uploader_form_value": &uploader_for_memory
        }),
    )
    .await;

    Ok(HttpResponse::Created().json(ApiResponse::ok(result)))
}

/// GET /api/assets
#[get("/api/assets")]
pub async fn list_assets(
    state: web::Data<AppState>,
    req: HttpRequest,
    query: web::Query<AssetQuery>,
) -> Result<HttpResponse, AppError> {
    require_asset_read_access(&state, &req).await?;
    let (assets, total) = state.asset_service.list_assets(&query).await?;
    let page = query.page();
    let page_size = query.page_size();
    Ok(HttpResponse::Ok().json(PaginatedResponse::new(assets, total, page, page_size)))
}

/// GET /api/assets/search
#[get("/api/assets/search")]
pub async fn search_assets(
    state: web::Data<AppState>,
    req: HttpRequest,
    query: web::Query<AssetQuery>,
) -> Result<HttpResponse, AppError> {
    require_asset_read_access(&state, &req).await?;
    let (assets, total) = state.asset_service.search_assets(&query).await?;
    let page = query.page();
    let page_size = query.page_size();
    Ok(HttpResponse::Ok().json(PaginatedResponse::new(assets, total, page, page_size)))
}

/// GET /api/assets/{id}
#[get("/api/assets/{id}")]
pub async fn get_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    require_asset_read_access(&state, &req).await?;
    let asset = state.asset_service.get_asset(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(asset)))
}

/// GET /api/assets/{id}/content
#[get("/api/assets/{id}/content")]
pub async fn get_asset_content(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    query: web::Query<AssetContentQuery>,
) -> Result<HttpResponse, AppError> {
    serve_asset_content(state, req, *path, None, query.into_inner()).await
}

/// GET /api/assets/{id}/versions/{version}/content
#[get("/api/assets/{id}/versions/{version}/content")]
pub async fn get_asset_version_content(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<(Uuid, i32)>,
    query: web::Query<AssetContentQuery>,
) -> Result<HttpResponse, AppError> {
    let (asset_id, version) = path.into_inner();
    if version < 1 {
        return Err(AppError::validation("Asset version must start at 1"));
    }
    serve_asset_content(state, req, asset_id, Some(version), query.into_inner()).await
}

/// GET /internal/assets/{id}
#[get("/internal/assets/{id}")]
pub async fn internal_get_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    require_internal_service_token(&req)?;
    let asset = state.asset_service.get_asset(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(asset)))
}

/// GET /api/assets/{id}/versions
#[get("/api/assets/{id}/versions")]
pub async fn list_asset_versions(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    require_asset_read_access(&state, &req).await?;
    let versions = state.asset_service.list_asset_versions(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(versions)))
}

/// GET /api/assets/{id}/versions/compare?base=1&head=2
#[get("/api/assets/{id}/versions/compare")]
pub async fn compare_asset_versions(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    query: web::Query<AssetVersionCompareQuery>,
) -> Result<HttpResponse, AppError> {
    require_asset_read_access(&state, &req).await?;
    let diff = state
        .asset_service
        .compare_asset_versions(*path, query.base, query.head)
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(diff)))
}

/// PATCH /api/assets/{id}
#[patch("/api/assets/{id}")]
pub async fn update_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    body: web::Json<UpdateAssetRequest>,
) -> Result<HttpResponse, AppError> {
    let request_body = body.into_inner();
    let requested_tags = request_body.tags.clone();
    let requested_status = request_body.status.clone();
    let review_note = request_body.review_note.clone();
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "asset", *path)
        .await?;
    let asset = state
        .asset_service
        .update_asset(*path, request_body)
        .await?;
    remember_asset_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("asset.updated", "Data Lake", "asset")
            .entity_id(Some(asset.id))
            .actor("system")
            .summary(format!("Updated data lake asset {}", asset.name))
            .content(format!(
                "Asset metadata updated. Filename: {}. Requested tags: {}. Requested status: {:?}. Review note: {}.",
                asset.original_filename,
                requested_tags.unwrap_or_default().join(", "),
                requested_status,
                review_note.unwrap_or_else(|| "none".to_string())
            ))
            .metadata(json!({
                "asset_id": asset.id,
                "asset_type": asset.asset_type.clone(),
                "version": asset.version,
                "tags": asset.tags.clone(),
                "status": asset.status.clone()
            })),
    )
    .await;
    stage_asset_event(
        &state,
        DomainEventInput::new(
            "assets.asset.v1",
            "AssetUpdated",
            "asset",
            asset.id,
            json!({
                "asset_id": asset.id,
                "project_id": asset.project_id,
                "name": asset.name,
                "status": asset.status,
                "version": asset.version,
                "tags": asset.tags
            }),
        )
        .idempotency_key(format!("asset-updated:{}:{}", asset.id, asset.version)),
    )
    .await;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(asset)))
}

/// DELETE /api/assets/{id}
#[delete("/api/assets/{id}")]
pub async fn delete_asset(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    state
        .resource_lock_service
        .ensure_write_allowed(&req, "asset", *path)
        .await?;
    state.asset_service.delete_asset(*path).await?;
    remember_asset_operation(
        &state,
        &req,
        RagOperationMemoryInput::new("asset.deleted", "Data Lake", "asset")
            .entity_id(Some(*path))
            .actor("system")
            .summary("Deleted data lake asset")
            .content(format!("Asset {} was deleted from the data lake.", *path))
            .metadata(json!({})),
    )
    .await;
    stage_asset_event(
        &state,
        DomainEventInput::new(
            "assets.asset.v1",
            "AssetDeleted",
            "asset",
            *path,
            json!({ "asset_id": *path }),
        )
        .idempotency_key(format!("asset-deleted:{}", *path)),
    )
    .await;
    record_asset_security_audit(
        &state,
        &req,
        "asset_deleted",
        *path,
        json!({ "asset_id": *path }),
    )
    .await;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Asset deleted"
    })))
}

async fn remember_asset_operation(
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
        tracing::warn!(error = %error, "Asset operation was not stored in RAG memory");
    }
}

async fn stage_asset_event(state: &web::Data<AppState>, input: DomainEventInput) {
    if let Err(error) = state.event_publisher_service.stage(input).await {
        tracing::warn!(error = %error, "Asset domain event was not staged");
    }
}

async fn record_asset_security_audit(
    state: &web::Data<AppState>,
    req: &HttpRequest,
    action: &str,
    asset_id: Uuid,
    metadata: Value,
) {
    state
        .security_audit_service
        .record_http_request(
            req,
            SecurityAuditInput::new(action, "success", "asset", Some(asset_id)).metadata(metadata),
        )
        .await;
}

async fn require_asset_read_access(
    state: &web::Data<AppState>,
    req: &HttpRequest,
) -> Result<(), AppError> {
    if state.asset_service.asset_read_auth_required() {
        state.auth_service.authenticate_request(req).await?;
    }
    Ok(())
}

async fn serve_asset_content(
    state: web::Data<AppState>,
    req: HttpRequest,
    asset_id: Uuid,
    version: Option<i32>,
    query: AssetContentQuery,
) -> Result<HttpResponse, AppError> {
    let access_token = AssetAccessToken {
        expires: query.expires,
        signature: query.signature.clone(),
    };
    let signed_url = state
        .asset_service
        .validate_access_token(asset_id, version, &access_token);
    let session: Option<SessionContext> =
        if signed_url || !state.asset_service.asset_read_auth_required() {
            None
        } else {
            match state.auth_service.authenticate_request(&req).await {
                Ok(session) => Some(session),
                Err(error) => {
                    state
                        .security_audit_service
                        .record_http_request(
                            &req,
                            SecurityAuditInput::new(
                                "asset_content_denied",
                                "denied",
                                "asset",
                                Some(asset_id),
                            )
                            .severity("warning")
                            .reason(error.to_string())
                            .metadata(json!({
                                "version": version,
                                "signed_url": signed_url,
                                "download": query.download.unwrap_or(false)
                            })),
                        )
                        .await;
                    return Err(error);
                }
            }
        };

    let content = state
        .asset_service
        .get_asset_content(asset_id, version)
        .await?;
    let download = query.download.unwrap_or(false);
    let content_disposition =
        state
            .asset_service
            .content_disposition(&content.filename, &content.mime_type, download);
    let action = if download {
        "asset_downloaded"
    } else {
        "asset_content_accessed"
    };
    let mut audit =
        SecurityAuditInput::new(action, "success", "asset", Some(asset_id)).metadata(json!({
            "version": version,
            "signed_url": signed_url,
            "download": download,
            "filename": &content.filename,
            "mime_type": &content.mime_type,
            "file_size": content.file_size
        }));
    if let Some(session) = session.as_ref() {
        audit = audit.session(session);
    }
    state
        .security_audit_service
        .record_http_request(&req, audit)
        .await;

    Ok(HttpResponse::Ok()
        .insert_header((header::CONTENT_TYPE, content.mime_type))
        .insert_header((header::CONTENT_LENGTH, content.file_size.to_string()))
        .insert_header((header::CONTENT_DISPOSITION, content_disposition))
        .insert_header(("X-Content-Type-Options", "nosniff"))
        .insert_header(("Content-Security-Policy", "sandbox"))
        .insert_header(("Cross-Origin-Resource-Policy", "same-origin"))
        .insert_header((header::CACHE_CONTROL, "private, max-age=60"))
        .body(content.bytes))
}

// ─── helpers ─────────────────────────────────────────────────────────────────

async fn read_field_text(field: &mut actix_multipart::Field) -> Result<String, AppError> {
    let mut buf = BytesMut::new();
    while let Some(chunk) = field.next().await {
        let data = chunk.map_err(|e| AppError::internal(e.to_string()))?;
        buf.extend_from_slice(&data);
    }
    String::from_utf8(buf.to_vec()).map_err(|e| AppError::validation(e.to_string()))
}

fn sanitize_filename(name: &str) -> String {
    name.chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '.' || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect()
}

fn require_internal_service_token(req: &HttpRequest) -> Result<(), AppError> {
    let expected = env::var("INTERNAL_SERVICE_TOKEN")
        .ok()
        .filter(|value| !value.trim().is_empty())
        .ok_or_else(|| AppError::forbidden("INTERNAL_SERVICE_TOKEN is not configured"))?;
    let actual = req
        .headers()
        .get("x-assetslake-service-token")
        .and_then(|value| value.to_str().ok())
        .unwrap_or_default();

    if actual == expected {
        Ok(())
    } else {
        Err(AppError::unauthorized("Invalid internal service token"))
    }
}
