use actix_multipart::Multipart;
use actix_web::{delete, get, patch, post, web, HttpResponse};
use bytes::BytesMut;
use futures_util::StreamExt;
use uuid::Uuid;

use crate::{
    errors::{ApiResponse, AppError, PaginatedResponse},
    models::asset::{AssetQuery, UpdateAssetRequest},
    AppState,
};

/// POST /api/assets/upload
/// Accepts multipart/form-data with fields: file, name, description, project_id, tags, uploader
#[post("/api/assets/upload")]
pub async fn upload_asset(
    state: web::Data<AppState>,
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
            .get_name()
            .unwrap_or("")
            .to_string();

        match field_name.as_str() {
            "file" => {
                // Extract filename and content type from the field
                let cd = field.content_disposition().clone();
                original_filename = cd
                    .get_filename()
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
                    project_id = Uuid::parse_str(&s)
                        .map(Some)
                        .unwrap_or_else(|_| {
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

    let result = state
        .asset_service
        .upload_asset(
            file_bytes,
            original_filename,
            mime_type,
            name,
            description,
            project_id,
            tags,
            uploader,
        )
        .await?;

    Ok(HttpResponse::Created().json(ApiResponse::ok(result)))
}

/// GET /api/assets
#[get("/api/assets")]
pub async fn list_assets(
    state: web::Data<AppState>,
    query: web::Query<AssetQuery>,
) -> Result<HttpResponse, AppError> {
    let (assets, total) = state.asset_service.list_assets(&query).await?;
    let page = query.page();
    let page_size = query.page_size();
    Ok(HttpResponse::Ok().json(PaginatedResponse::new(assets, total, page, page_size)))
}

/// GET /api/assets/search
#[get("/api/assets/search")]
pub async fn search_assets(
    state: web::Data<AppState>,
    query: web::Query<AssetQuery>,
) -> Result<HttpResponse, AppError> {
    let (assets, total) = state.asset_service.search_assets(&query).await?;
    let page = query.page();
    let page_size = query.page_size();
    Ok(HttpResponse::Ok().json(PaginatedResponse::new(assets, total, page, page_size)))
}

/// GET /api/assets/{id}
#[get("/api/assets/{id}")]
pub async fn get_asset(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let asset = state.asset_service.get_asset(*path).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(asset)))
}

/// PATCH /api/assets/{id}
#[patch("/api/assets/{id}")]
pub async fn update_asset(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    body: web::Json<UpdateAssetRequest>,
) -> Result<HttpResponse, AppError> {
    let asset = state.asset_service.update_asset(*path, body.into_inner()).await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(asset)))
}

/// DELETE /api/assets/{id}
#[delete("/api/assets/{id}")]
pub async fn delete_asset(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    state.asset_service.delete_asset(*path).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Asset deleted"
    })))
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
        .map(|c| if c.is_alphanumeric() || c == '.' || c == '-' || c == '_' { c } else { '_' })
        .collect()
}
