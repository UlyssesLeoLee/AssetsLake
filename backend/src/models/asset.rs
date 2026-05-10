use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type, PartialEq)]
#[sqlx(type_name = "asset_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum AssetStatus {
    Pending,
    Active,
    Archived,
    Rejected,
    Processing,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type, PartialEq)]
#[sqlx(type_name = "asset_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum AssetType {
    #[sqlx(rename = "3d_model")]
    #[serde(rename = "3d_model")]
    Model3d,
    Texture,
    ConceptArt,
    Audio,
    Video,
    Document,
    Animation,
    Vfx,
    Ui,
    Font,
    Shader,
    Scene,
    Prefab,
    Archive,
    Other,
}

impl AssetType {
    pub fn from_mime(mime: &str) -> Self {
        match mime {
            m if m.starts_with("image/") => Self::Texture,
            m if m.starts_with("audio/") => Self::Audio,
            m if m.starts_with("video/") => Self::Video,
            "application/pdf" => Self::Document,
            "application/zip"
            | "application/x-zip-compressed"
            | "application/x-7z-compressed"
            | "application/x-tar"
            | "application/x-rar-compressed" => Self::Archive,
            "application/octet-stream" => Self::Other,
            _ => Self::Other,
        }
    }

    pub fn from_extension(ext: &str) -> Self {
        match ext.to_lowercase().as_str() {
            "fbx" | "obj" | "blend" | "dae" | "glb" | "gltf" | "3ds" | "max" | "ma" | "mb" => {
                Self::Model3d
            }
            "png" | "jpg" | "jpeg" | "tga" | "bmp" | "tiff" | "exr" | "hdr" | "psd" | "psb" => {
                Self::Texture
            }
            "wav" | "mp3" | "ogg" | "flac" | "aif" | "aiff" => Self::Audio,
            "mp4" | "mov" | "avi" | "mkv" | "webm" => Self::Video,
            "pdf" | "doc" | "docx" | "txt" | "md" => Self::Document,
            "zip" | "7z" | "tar" | "gz" | "rar" => Self::Archive,
            "anim" | "bvh" => Self::Animation,
            "vfx" | "niagara" => Self::Vfx,
            "ttf" | "otf" | "woff" | "woff2" => Self::Font,
            "hlsl" | "glsl" | "shader" | "usf" | "ush" => Self::Shader,
            "unity" | "umap" | "level" => Self::Scene,
            "prefab" | "asset" | "uasset" => Self::Prefab,
            _ => Self::Other,
        }
    }
}

/// Full asset record from PostgreSQL
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Asset {
    pub id: Uuid,
    pub name: String,
    pub original_filename: String,
    pub description: Option<String>,
    pub asset_type: AssetType,
    pub mime_type: String,
    pub tags: Vec<String>,
    pub bucket: String,
    pub object_key: String,
    pub file_url: String,
    pub preview_url: Option<String>,
    pub file_size: i64,
    pub checksum_sha256: Option<String>,
    pub version: i32,
    pub parent_id: Option<Uuid>,
    pub project_id: Uuid,
    pub uploader_id: Option<Uuid>,
    pub uploader: String,
    pub status: AssetStatus,
    pub reviewed_by: Option<Uuid>,
    pub reviewed_at: Option<DateTime<Utc>>,
    pub review_note: Option<String>,
    pub ai_tags: Vec<String>,
    pub embedding_id: Option<String>,
    pub search_doc_id: Option<String>,
    pub graph_node_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

/// Compact asset summary for list views
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AssetSummary {
    pub id: Uuid,
    pub name: String,
    pub original_filename: String,
    pub asset_type: AssetType,
    pub mime_type: String,
    pub tags: Vec<String>,
    pub file_url: String,
    pub preview_url: Option<String>,
    pub file_size: i64,
    pub version: i32,
    pub project_id: Uuid,
    pub uploader: String,
    pub status: AssetStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Request body for creating/uploading an asset (multipart fields)
#[derive(Debug, Deserialize)]
pub struct CreateAssetRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub project_id: Option<Uuid>,
    pub tags: Option<Vec<String>>,
    pub uploader: Option<String>,
}

/// Request body for updating asset metadata
#[derive(Debug, Deserialize)]
pub struct UpdateAssetRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
    pub status: Option<AssetStatus>,
    pub project_id: Option<Uuid>,
    pub review_note: Option<String>,
}

/// Query params for listing assets
#[derive(Debug, Deserialize)]
pub struct AssetQuery {
    pub page: Option<i64>,
    pub page_size: Option<i64>,
    pub q: Option<String>,
    pub asset_type: Option<String>,
    pub status: Option<String>,
    pub project_id: Option<Uuid>,
    pub tag: Option<String>,
    pub uploader: Option<String>,
}

impl AssetQuery {
    pub fn page(&self) -> i64 {
        self.page.unwrap_or(1).max(1)
    }

    pub fn page_size(&self) -> i64 {
        self.page_size.unwrap_or(24).clamp(1, 100)
    }

    pub fn offset(&self) -> i64 {
        (self.page() - 1) * self.page_size()
    }
}

/// Upload result returned after successful asset creation
#[derive(Debug, Serialize)]
pub struct UploadResult {
    pub asset_id: Uuid,
    pub bucket: String,
    pub object_key: String,
    pub file_url: String,
    pub preview_url: Option<String>,
    pub name: String,
    pub original_filename: String,
    pub asset_type: AssetType,
    pub mime_type: String,
    pub file_size: i64,
    pub tags: Vec<String>,
    pub version: i32,
    pub status: AssetStatus,
    pub created_at: DateTime<Utc>,
}
