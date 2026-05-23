use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::asset::{
        Asset, AssetQuery, AssetSummary, AssetType, AssetVersionDiff, AssetVersionDiffItem,
        AssetVersionSummary, UpdateAssetRequest,
    },
};

pub struct AssetRepository {
    pool: PgPool,
}

impl AssetRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, params: CreateAssetParams) -> Result<Asset, AppError> {
        let asset = sqlx::query_as::<_, Asset>(
            r#"
            INSERT INTO assets (
                id, name, original_filename, description,
                asset_type, mime_type, tags,
                bucket, object_key, file_url, preview_url,
                file_size, checksum_sha256,
                version, project_id,
                uploader_id, uploader, status
            ) VALUES (
                $1, $2, $3, $4,
                $5, $6, $7,
                $8, $9, $10, $11,
                $12, $13,
                1, $14,
                $15, $16, 'pending'
            )
            RETURNING *
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(&params.name)
        .bind(&params.original_filename)
        .bind(&params.description)
        .bind(&params.asset_type)
        .bind(&params.mime_type)
        .bind(&params.tags)
        .bind(&params.bucket)
        .bind(&params.object_key)
        .bind(&params.file_url)
        .bind(&params.preview_url)
        .bind(params.file_size)
        .bind(&params.checksum_sha256)
        .bind(params.project_id)
        .bind(params.uploader_id)
        .bind(&params.uploader)
        .fetch_one(&self.pool)
        .await?;

        Ok(asset)
    }

    pub async fn find_by_id(&self, id: Uuid) -> Result<Asset, AppError> {
        sqlx::query_as::<_, Asset>("SELECT * FROM assets WHERE id = $1 AND deleted_at IS NULL")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or_else(|| AppError::not_found(format!("Asset {} not found", id)))
    }

    /// List assets with optional filters. Uses separate typed queries per filter combination
    /// to keep sqlx compile-time safety. For a full dynamic query builder, integrate `sea-query`.
    pub async fn list(&self, query: &AssetQuery) -> Result<(Vec<AssetSummary>, i64), AppError> {
        let limit = query.page_size();
        let offset = query.offset();

        // We use a single flexible query with nullable filter parameters.
        // PostgreSQL coalesces NULLs to skip filters.
        let total: i64 = sqlx::query_scalar(
            r#"SELECT COUNT(*) FROM assets a
               WHERE a.deleted_at IS NULL
               AND ($1::text IS NULL OR a.asset_type::text = $1)
               AND ($2::text IS NULL OR a.status::text = $2)
               AND ($3::uuid IS NULL OR a.project_id = $3)
               AND ($4::text IS NULL OR $4 = ANY(a.tags))
               AND ($5::text IS NULL OR a.uploader ILIKE '%' || $5 || '%')
               AND ($6::text IS NULL OR a.name ILIKE '%' || $6 || '%'
                    OR a.original_filename ILIKE '%' || $6 || '%')"#,
        )
        .bind(&query.asset_type)
        .bind(&query.status)
        .bind(query.project_id)
        .bind(&query.tag)
        .bind(&query.uploader)
        .bind(&query.q)
        .fetch_one(&self.pool)
        .await?;

        let rows = sqlx::query_as::<_, AssetSummary>(
            r#"SELECT
                a.id, a.name, a.original_filename,
                a.asset_type, a.mime_type, a.tags,
                a.file_url, a.preview_url,
                a.file_size, a.version,
                a.project_id, a.uploader, a.status,
                a.created_at, a.updated_at
            FROM assets a
            WHERE a.deleted_at IS NULL
               AND ($1::text IS NULL OR a.asset_type::text = $1)
               AND ($2::text IS NULL OR a.status::text = $2)
               AND ($3::uuid IS NULL OR a.project_id = $3)
               AND ($4::text IS NULL OR $4 = ANY(a.tags))
               AND ($5::text IS NULL OR a.uploader ILIKE '%' || $5 || '%')
               AND ($6::text IS NULL OR a.name ILIKE '%' || $6 || '%'
                    OR a.original_filename ILIKE '%' || $6 || '%')
            ORDER BY a.created_at DESC
            LIMIT $7 OFFSET $8"#,
        )
        .bind(&query.asset_type)
        .bind(&query.status)
        .bind(query.project_id)
        .bind(&query.tag)
        .bind(&query.uploader)
        .bind(&query.q)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        Ok((rows, total))
    }

    pub async fn search(&self, query: &AssetQuery) -> Result<(Vec<AssetSummary>, i64), AppError> {
        let q = format!("%{}%", query.q.as_deref().unwrap_or(""));
        let limit = query.page_size();
        let offset = query.offset();

        let total: i64 = sqlx::query_scalar(
            r#"SELECT COUNT(*) FROM assets
               WHERE deleted_at IS NULL
               AND (name ILIKE $1 OR original_filename ILIKE $1
                    OR description ILIKE $1 OR $1 = ANY(tags))"#,
        )
        .bind(&q)
        .fetch_one(&self.pool)
        .await?;

        let rows = sqlx::query_as::<_, AssetSummary>(
            r#"SELECT
                id, name, original_filename,
                asset_type, mime_type, tags,
                file_url, preview_url,
                file_size, version,
                project_id, uploader, status,
                created_at, updated_at
            FROM assets
            WHERE deleted_at IS NULL
            AND (name ILIKE $1 OR original_filename ILIKE $1
                 OR description ILIKE $1 OR $1 = ANY(tags))
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3"#,
        )
        .bind(&q)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        Ok((rows, total))
    }

    pub async fn update(&self, id: Uuid, req: &UpdateAssetRequest) -> Result<Asset, AppError> {
        self.find_by_id(id).await?;

        sqlx::query_as::<_, Asset>(
            r#"UPDATE assets SET
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                tags = COALESCE($4, tags),
                status = COALESCE($5, status),
                project_id = COALESCE($6, project_id),
                review_note = COALESCE($7, review_note),
                updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *"#,
        )
        .bind(id)
        .bind(&req.name)
        .bind(&req.description)
        .bind(&req.tags)
        .bind(&req.status)
        .bind(req.project_id)
        .bind(&req.review_note)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn update_ai_tags(&self, id: Uuid, ai_tags: &[String]) -> Result<Asset, AppError> {
        sqlx::query_as::<_, Asset>(
            r#"
            UPDATE assets
            SET ai_tags = $2, updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(ai_tags)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn soft_delete(&self, id: Uuid) -> Result<(), AppError> {
        let rows = sqlx::query(
            "UPDATE assets SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(&self.pool)
        .await?
        .rows_affected();

        if rows == 0 {
            return Err(AppError::not_found(format!("Asset {} not found", id)));
        }
        Ok(())
    }

    pub async fn list_versions(
        &self,
        asset_id: Uuid,
    ) -> Result<Vec<AssetVersionSummary>, AppError> {
        self.find_by_id(asset_id).await?;

        sqlx::query_as::<_, AssetVersionSummary>(
            r#"
            SELECT
                av.id,
                av.asset_id,
                av.version,
                av.bucket,
                av.object_key,
                av.file_url,
                av.file_size,
                av.checksum_sha256,
                av.uploader_id,
                av.uploader,
                av.change_note,
                av.created_at,
                CASE
                    WHEN a.parent_id IS NULL THEN 'main'
                    ELSE 'branch/' || LEFT(REPLACE(a.parent_id::text, '-', ''), 8)
                END AS branch_name,
                LEFT(COALESCE(av.checksum_sha256, REPLACE(av.id::text, '-', '')), 12) AS commit_sha
            FROM asset_versions av
            INNER JOIN assets a ON a.id = av.asset_id
            WHERE av.asset_id = $1
              AND a.deleted_at IS NULL
            ORDER BY av.version DESC
            "#,
        )
        .bind(asset_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn compare_versions(
        &self,
        asset_id: Uuid,
        base_version: i32,
        head_version: i32,
    ) -> Result<AssetVersionDiff, AppError> {
        let base = self.find_version(asset_id, base_version).await?;
        let head = self.find_version(asset_id, head_version).await?;
        let mut changes = vec![];

        push_diff(
            &mut changes,
            "object_key",
            base.object_key.clone(),
            head.object_key.clone(),
        );
        push_diff(
            &mut changes,
            "checksum_sha256",
            base.checksum_sha256
                .clone()
                .unwrap_or_else(|| "-".to_string()),
            head.checksum_sha256
                .clone()
                .unwrap_or_else(|| "-".to_string()),
        );
        push_diff(
            &mut changes,
            "file_size",
            base.file_size.to_string(),
            head.file_size.to_string(),
        );
        push_diff(
            &mut changes,
            "uploader",
            base.uploader.clone(),
            head.uploader.clone(),
        );

        Ok(AssetVersionDiff {
            asset_id,
            file_size_delta: head.file_size - base.file_size,
            checksum_changed: base.checksum_sha256 != head.checksum_sha256,
            object_changed: base.object_key != head.object_key,
            base,
            head,
            changes,
        })
    }

    async fn find_version(
        &self,
        asset_id: Uuid,
        version: i32,
    ) -> Result<AssetVersionSummary, AppError> {
        sqlx::query_as::<_, AssetVersionSummary>(
            r#"
            SELECT
                av.id,
                av.asset_id,
                av.version,
                av.bucket,
                av.object_key,
                av.file_url,
                av.file_size,
                av.checksum_sha256,
                av.uploader_id,
                av.uploader,
                av.change_note,
                av.created_at,
                CASE
                    WHEN a.parent_id IS NULL THEN 'main'
                    ELSE 'branch/' || LEFT(REPLACE(a.parent_id::text, '-', ''), 8)
                END AS branch_name,
                LEFT(COALESCE(av.checksum_sha256, REPLACE(av.id::text, '-', '')), 12) AS commit_sha
            FROM asset_versions av
            INNER JOIN assets a ON a.id = av.asset_id
            WHERE av.asset_id = $1
              AND av.version = $2
              AND a.deleted_at IS NULL
            "#,
        )
        .bind(asset_id)
        .bind(version)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| {
            AppError::not_found(format!("Asset {} version {} not found", asset_id, version))
        })
    }
}

fn push_diff(changes: &mut Vec<AssetVersionDiffItem>, field: &str, before: String, after: String) {
    changes.push(AssetVersionDiffItem {
        field: field.to_string(),
        changed: before != after,
        before,
        after,
    });
}

pub struct CreateAssetParams {
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
    pub project_id: Uuid,
    pub uploader_id: Option<Uuid>,
    pub uploader: String,
}
