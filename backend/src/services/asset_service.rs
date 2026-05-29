use bytes::Bytes;
use serde_json::json;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use tracing::{info, instrument};
use uuid::Uuid;

use crate::{
    config::AppConfig,
    errors::AppError,
    models::asset::{
        Asset, AssetQuery, AssetSummary, AssetType, AssetVersionDiff, AssetVersionSummary,
        UpdateAssetRequest, UploadResult,
    },
    repositories::asset_repository::{AssetRepository, CreateAssetParams},
    services::{
        asset_security_service::{AssetAccessToken, AssetSecurityService},
        storage_service::StorageService,
    },
};

pub struct AssetService {
    repo: AssetRepository,
    storage: StorageService,
    config: AppConfig,
    security: AssetSecurityService,
}

pub struct AssetContent {
    pub bytes: Bytes,
    pub filename: String,
    pub mime_type: String,
    pub file_size: i64,
}

pub struct UploadAssetInput {
    pub file_bytes: Bytes,
    pub original_filename: String,
    pub mime_type: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub project_id: Option<Uuid>,
    pub tags: Vec<String>,
    pub uploader: String,
}

impl AssetService {
    pub fn new(pool: PgPool, storage: StorageService, config: AppConfig) -> anyhow::Result<Self> {
        Ok(Self {
            repo: AssetRepository::new(pool),
            storage,
            config,
            security: AssetSecurityService::from_env()?,
        })
    }

    #[instrument(skip(self, input), fields(filename = %input.original_filename, size = input.file_bytes.len()))]
    pub async fn upload_asset(&self, input: UploadAssetInput) -> Result<UploadResult, AppError> {
        let UploadAssetInput {
            file_bytes,
            original_filename,
            mime_type,
            name,
            description,
            project_id,
            tags,
            uploader,
        } = input;

        // Validate file size
        if file_bytes.len() as u64 > self.config.upload.max_size_bytes {
            return Err(AppError::PayloadTooLarge(format!(
                "File exceeds maximum allowed size of {} MB",
                self.config.upload.max_size_bytes / 1024 / 1024
            )));
        }
        self.security
            .validate_upload(&original_filename, &mime_type, &file_bytes)?;

        let ext = std::path::Path::new(&original_filename)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("")
            .to_lowercase();

        // Classify asset type from filename first so extensionless code files
        // such as Dockerfile and Makefile still land in the code data lake.
        let asset_type = AssetType::from_filename(&original_filename, &mime_type);

        // Compute checksum
        let mut hasher = Sha256::new();
        hasher.update(&file_bytes);
        let checksum = hex::encode(hasher.finalize());

        // Generate unique object key: {type}/{date}/{uuid}.{ext}
        let now = chrono::Utc::now();
        let date_prefix = now.format("%Y/%m/%d");
        let asset_uuid = Uuid::new_v4();
        let object_key = if ext.is_empty() {
            format!(
                "{}/{}/{}",
                asset_type_prefix(&asset_type),
                date_prefix,
                asset_uuid
            )
        } else {
            format!(
                "{}/{}/{}.{}",
                asset_type_prefix(&asset_type),
                date_prefix,
                asset_uuid,
                ext
            )
        };

        // Write to MinIO
        self.storage
            .put_object(&object_key, file_bytes.clone(), &mime_type)
            .await?;

        let file_url = self.security.content_url(asset_uuid, None);
        let bucket = self.storage.bucket().to_string();

        let resolved_project_id = project_id
            .unwrap_or_else(|| Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());

        let asset_name = name.unwrap_or_else(|| {
            std::path::Path::new(&original_filename)
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or(&original_filename)
                .to_string()
        });

        // Write metadata to PostgreSQL
        let asset = self
            .repo
            .create(CreateAssetParams {
                id: asset_uuid,
                name: asset_name,
                original_filename: original_filename.clone(),
                description,
                asset_type: asset_type.clone(),
                mime_type: mime_type.clone(),
                tags: tags.clone(),
                bucket: bucket.clone(),
                object_key: object_key.clone(),
                file_url: file_url.clone(),
                preview_url: None,
                file_size: file_bytes.len() as i64,
                checksum_sha256: Some(checksum),
                project_id: resolved_project_id,
                uploader_id: None,
                uploader: uploader.clone(),
            })
            .await?;

        // Hook: asset_uploaded — future AI pipeline trigger
        self.on_asset_uploaded(&asset).await;

        info!(
            asset_id = %asset.id,
            object_key = %object_key,
            uploader = %uploader,
            "Asset uploaded successfully"
        );

        Ok(UploadResult {
            asset_id: asset.id,
            bucket,
            object_key,
            file_url,
            preview_url: asset.preview_url,
            name: asset.name,
            original_filename: asset.original_filename,
            asset_type: asset.asset_type,
            mime_type: asset.mime_type,
            file_size: asset.file_size,
            tags: asset.tags,
            version: asset.version,
            status: asset.status,
            created_at: asset.created_at,
        })
    }

    pub async fn get_asset(&self, id: Uuid) -> Result<Asset, AppError> {
        self.repo
            .find_by_id(id)
            .await
            .map(|asset| self.secure_asset(asset))
    }

    pub async fn list_assets(
        &self,
        query: &AssetQuery,
    ) -> Result<(Vec<AssetSummary>, i64), AppError> {
        let (assets, total) = self.repo.list(query).await?;
        Ok((
            assets
                .into_iter()
                .map(|asset| self.secure_asset_summary(asset))
                .collect(),
            total,
        ))
    }

    pub async fn search_assets(
        &self,
        query: &AssetQuery,
    ) -> Result<(Vec<AssetSummary>, i64), AppError> {
        let (assets, total) = self.repo.search(query).await?;
        Ok((
            assets
                .into_iter()
                .map(|asset| self.secure_asset_summary(asset))
                .collect(),
            total,
        ))
    }

    pub async fn update_asset(&self, id: Uuid, req: UpdateAssetRequest) -> Result<Asset, AppError> {
        self.repo
            .update(id, &req)
            .await
            .map(|asset| self.secure_asset(asset))
    }

    pub async fn list_asset_versions(
        &self,
        id: Uuid,
    ) -> Result<Vec<AssetVersionSummary>, AppError> {
        let versions = self.repo.list_versions(id).await?;
        Ok(versions
            .into_iter()
            .map(|version| self.secure_asset_version(version))
            .collect())
    }

    pub async fn compare_asset_versions(
        &self,
        id: Uuid,
        base: i32,
        head: i32,
    ) -> Result<AssetVersionDiff, AppError> {
        if base < 1 || head < 1 {
            return Err(AppError::validation("Asset versions must start at 1"));
        }
        let mut diff = self.repo.compare_versions(id, base, head).await?;
        diff.base = self.secure_asset_version(diff.base);
        diff.head = self.secure_asset_version(diff.head);
        Ok(diff)
    }

    pub async fn get_asset_content(
        &self,
        id: Uuid,
        version: Option<i32>,
    ) -> Result<AssetContent, AppError> {
        let (object_key, filename, mime_type, file_size) = if let Some(version) = version {
            let content = self.repo.find_version_content(id, version).await?;
            (
                content.object_key,
                content.original_filename,
                content.mime_type,
                content.file_size,
            )
        } else {
            let asset = self.repo.find_by_id(id).await?;
            (
                asset.object_key,
                asset.original_filename,
                asset.mime_type,
                asset.file_size,
            )
        };
        let bytes = self.storage.get_object(&object_key).await?;
        Ok(AssetContent {
            bytes,
            filename,
            mime_type,
            file_size,
        })
    }

    pub fn validate_access_token(
        &self,
        id: Uuid,
        version: Option<i32>,
        token: &AssetAccessToken,
    ) -> bool {
        self.security.validate_token(id, version, token)
    }

    pub fn asset_read_auth_required(&self) -> bool {
        self.security.read_auth_required()
    }

    pub fn content_disposition(&self, filename: &str, mime_type: &str, download: bool) -> String {
        self.security
            .content_disposition(filename, mime_type, download)
    }

    pub async fn record_asset_access(
        &self,
        id: Uuid,
        version: Option<i32>,
        actor: Option<&str>,
        signed_url: bool,
        download: bool,
    ) {
        if !self.security.access_audit_enabled() {
            return;
        }
        if let Err(error) = self
            .repo
            .record_access(
                id,
                if download {
                    "downloaded"
                } else {
                    "content_accessed"
                },
                actor,
                json!({
                    "version": version,
                    "signed_url": signed_url,
                    "download": download
                }),
            )
            .await
        {
            tracing::warn!(asset_id = %id, error = %error, "Asset access audit insert failed");
        }
    }

    pub async fn delete_asset(&self, id: Uuid) -> Result<(), AppError> {
        let asset = self.repo.find_by_id(id).await?;
        self.repo.soft_delete(id).await?;

        info!(
            asset_id = %id,
            object_key = %asset.object_key,
            "Asset soft-deleted (MinIO object retained)"
        );
        // Note: MinIO object is NOT deleted on soft-delete.
        // Hard purge is a separate scheduled operation.
        Ok(())
    }

    fn secure_asset(&self, mut asset: Asset) -> Asset {
        asset.file_url = self.security.content_url(asset.id, None);
        asset.preview_url = asset
            .preview_url
            .map(|_| self.security.content_url(asset.id, None));
        asset
    }

    fn secure_asset_summary(&self, mut asset: AssetSummary) -> AssetSummary {
        asset.file_url = self.security.content_url(asset.id, None);
        asset.preview_url = asset
            .preview_url
            .map(|_| self.security.content_url(asset.id, None));
        asset
    }

    fn secure_asset_version(&self, mut version: AssetVersionSummary) -> AssetVersionSummary {
        version.file_url = self
            .security
            .content_url(version.asset_id, Some(version.version));
        version
    }

    /// Hook called after every successful upload.
    /// Currently logs only; future: emit to Kafka, trigger AI tagging, thumbnail generation.
    async fn on_asset_uploaded(&self, asset: &Asset) {
        info!(
            asset_id = %asset.id,
            name = %asset.name,
            mime_type = %asset.mime_type,
            "[hook:asset_uploaded] Asset available for AI pipeline"
        );
        // TODO: self.event_publisher.publish("asset.uploaded", asset).await
        // TODO: self.ai_index_service.enqueue(asset.id).await
        // TODO: self.search_index_service.index(asset).await
    }
}

fn asset_type_prefix(t: &AssetType) -> &'static str {
    match t {
        AssetType::Model3d => "3d_models",
        AssetType::Texture => "textures",
        AssetType::ConceptArt => "concept_art",
        AssetType::Audio => "audio",
        AssetType::Video => "video",
        AssetType::Code => "code",
        AssetType::Document => "documents",
        AssetType::Animation => "animations",
        AssetType::Vfx => "vfx",
        AssetType::Ui => "ui",
        AssetType::Font => "fonts",
        AssetType::Shader => "shaders",
        AssetType::Scene => "scenes",
        AssetType::Prefab => "prefabs",
        AssetType::Archive => "archives",
        AssetType::Other => "other",
    }
}
