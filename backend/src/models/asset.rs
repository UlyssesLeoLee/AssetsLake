use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
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
    Code,
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
        let normalized = mime
            .split(';')
            .next()
            .unwrap_or(mime)
            .trim()
            .to_ascii_lowercase();

        match normalized.as_str() {
            m if m.starts_with("image/") => Self::Texture,
            m if m.starts_with("audio/") => Self::Audio,
            m if m.starts_with("video/") => Self::Video,
            m if Self::is_code_mime(m) => Self::Code,
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

    pub fn from_filename(filename: &str, mime: &str) -> Self {
        let lower_filename = filename.to_ascii_lowercase();
        if Self::is_code_filename(&lower_filename) {
            return Self::Code;
        }

        let ext = std::path::Path::new(filename)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("");

        if ext.is_empty() {
            Self::from_mime(mime)
        } else {
            Self::from_extension(ext)
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
            "rs" | "py" | "ipynb" | "js" | "jsx" | "ts" | "tsx" | "mjs" | "cjs" | "java" | "kt"
            | "kts" | "go" | "rb" | "php" | "cs" | "c" | "cc" | "cpp" | "cxx" | "h" | "hh"
            | "hpp" | "hxx" | "swift" | "scala" | "sh" | "bash" | "zsh" | "fish" | "ps1"
            | "bat" | "cmd" | "lua" | "r" | "sql" | "html" | "htm" | "css" | "scss" | "sass"
            | "less" | "vue" | "svelte" | "toml" | "yaml" | "yml" | "json" | "jsonc" | "xml"
            | "graphql" | "gql" | "proto" | "gradle" | "cmake" | "tf" | "tfvars" | "sol" | "ex"
            | "exs" | "erl" | "hrl" | "clj" | "cljs" | "dart" | "fs" | "fsx" => Self::Code,
            _ => Self::Other,
        }
    }

    fn is_code_mime(mime: &str) -> bool {
        matches!(
            mime,
            "application/javascript"
                | "application/typescript"
                | "application/json"
                | "application/ld+json"
                | "application/x-ndjson"
                | "application/xml"
                | "application/x-sh"
                | "application/x-yaml"
                | "text/javascript"
                | "text/ecmascript"
                | "text/typescript"
                | "text/html"
                | "text/css"
                | "text/xml"
                | "text/yaml"
                | "text/x-yaml"
                | "text/x-toml"
                | "text/x-json"
                | "text/x-rust"
                | "text/x-python"
                | "text/x-go"
                | "text/x-java-source"
                | "text/x-c"
                | "text/x-c++src"
                | "text/x-csharp"
                | "text/x-php"
                | "text/x-ruby"
                | "text/x-shellscript"
                | "text/x-sql"
        ) || mime.ends_with("+json")
            || mime.ends_with("+xml")
    }

    fn is_code_filename(filename: &str) -> bool {
        let basename = filename.rsplit(['/', '\\']).next().unwrap_or(filename);
        matches!(
            basename,
            ".babelrc"
                | ".dockerignore"
                | ".editorconfig"
                | ".env"
                | ".eslintrc"
                | ".gitignore"
                | ".npmrc"
                | ".prettierrc"
                | "dockerfile"
                | "makefile"
                | "cmakelists.txt"
                | "gemfile"
                | "jenkinsfile"
                | "procfile"
                | "rakefile"
                | "vagrantfile"
        ) || basename.starts_with(".env.")
            || basename.starts_with("dockerfile.")
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

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AssetVersionSummary {
    pub id: Uuid,
    pub asset_id: Uuid,
    pub version: i32,
    pub bucket: String,
    pub object_key: String,
    pub file_url: String,
    pub file_size: i64,
    pub checksum_sha256: Option<String>,
    pub uploader_id: Option<Uuid>,
    pub uploader: String,
    pub change_note: Option<String>,
    pub created_at: DateTime<Utc>,
    pub branch_name: String,
    pub commit_sha: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetVersionDiffItem {
    pub field: String,
    pub before: String,
    pub after: String,
    pub changed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetVersionDiff {
    pub asset_id: Uuid,
    pub base: AssetVersionSummary,
    pub head: AssetVersionSummary,
    pub file_size_delta: i64,
    pub checksum_changed: bool,
    pub object_changed: bool,
    pub changes: Vec<AssetVersionDiffItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AssetAiInsight {
    pub id: Uuid,
    pub asset_id: Uuid,
    pub modality: String,
    pub provider: String,
    pub model: Option<String>,
    pub status: String,
    pub summary: String,
    pub labels: Vec<String>,
    pub detected_text: Option<String>,
    pub quality_risks: Vec<String>,
    pub reuse_suggestions: Vec<String>,
    pub entities: Value,
    pub raw_response: Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalyzeAssetResponse {
    pub asset: Asset,
    pub insight: AssetAiInsight,
    pub rag_stored: bool,
}

#[derive(Debug, Deserialize)]
pub struct AssetVersionCompareQuery {
    pub base: i32,
    pub head: i32,
}

/// Request body for creating/uploading an asset (multipart fields)
#[allow(dead_code)]
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
    pub expected_version: Option<i32>,
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
