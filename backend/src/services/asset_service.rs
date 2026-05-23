use bytes::Bytes;
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
    services::storage_service::StorageService,
};

pub struct AssetService {
    repo: AssetRepository,
    storage: StorageService,
    config: AppConfig,
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
    pub fn new(pool: PgPool, storage: StorageService, config: AppConfig) -> Self {
        Self {
            repo: AssetRepository::new(pool),
            storage,
            config,
        }
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

        let file_url = self.storage.public_url(&object_key);
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
        self.repo.find_by_id(id).await
    }

    pub async fn list_assets(
        &self,
        query: &AssetQuery,
    ) -> Result<(Vec<AssetSummary>, i64), AppError> {
        self.repo.list(query).await
    }

    pub async fn search_assets(
        &self,
        query: &AssetQuery,
    ) -> Result<(Vec<AssetSummary>, i64), AppError> {
        self.repo.search(query).await
    }

    pub async fn update_asset(&self, id: Uuid, req: UpdateAssetRequest) -> Result<Asset, AppError> {
        self.repo.update(id, &req).await
    }

    pub async fn list_asset_versions(
        &self,
        id: Uuid,
    ) -> Result<Vec<AssetVersionSummary>, AppError> {
        self.repo.list_versions(id).await
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
        self.repo.compare_versions(id, base, head).await
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
