/*
```cypher
CREATE
  (f:File {name: "design_requirement_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::design_requirement_service", type: "module"}),
  (c1:Class {name: "DesignRequirementService", type: "class", language: "rust", signature: "struct DesignRequirementService"}),
  (fn1:Function {name: "DesignRequirementService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "DesignRequirementIf::list_requirements", type: "function", language: "rust"}),
  (fn3:Function {name: "DesignRequirementIf::create_requirement", type: "function", language: "rust"}),
  (fn4:Function {name: "DesignRequirementIf::get_requirement", type: "function", language: "rust"}),
  (fn5:Function {name: "DesignRequirementIf::update_requirement", type: "function", language: "rust"}),
  (fn6:Function {name: "DesignRequirementIf::attach_asset", type: "function", language: "rust"}),
  (fn7:Function {name: "DesignRequirementIf::add_comment", type: "function", language: "rust"}),
  (fn8:Function {name: "validate_priority", type: "function", language: "rust", signature: "fn validate_priority(value: &str) -> Result<String, AppError>"}),
  (fn9:Function {name: "validate_status", type: "function", language: "rust", signature: "fn validate_status(value: &str) -> Result<String, AppError>"}),
  (fn10:Function {name: "validate_relation_type", type: "function", language: "rust", signature: "fn validate_relation_type(value: &str) -> Result<String, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (fn3)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn9),
  (fn6)-[:CALLS]->(fn10);
```
*/

use sqlx::{types::Json, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::{asset_if::AssetIf, design_requirement_if::DesignRequirementIf, AppActor},
    models::design_requirement::{
        AttachDesignAssetRequest, CreateDesignCommentRequest, CreateDesignRequirementRequest,
        DesignRequirement, DesignRequirementAsset, DesignRequirementComment,
        DesignRequirementDetail, DesignRequirementQuery, UpdateDesignRequirementRequest,
    },
};

#[derive(Clone)]
pub struct DesignRequirementService {
    pool: PgPool,
}

impl DesignRequirementService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl DesignRequirementIf for DesignRequirementService {
    async fn list_requirements(
        &self,
        query: &DesignRequirementQuery,
    ) -> Result<Vec<DesignRequirement>, AppError> {
        Ok(sqlx::query_as::<_, DesignRequirement>(
            r#"
            SELECT id, workspace_id, project_id, title, summary, status, priority,
                   acceptance_criteria, owner_id, owner_name, reviewer_id, reviewer_name,
                   due_date, version, created_at, updated_at
            FROM design_requirements requirement
            WHERE workspace_id = $1
              AND deleted_at IS NULL
              AND ($2::text IS NULL OR status = $2)
              AND ($3::uuid IS NULL OR EXISTS (
                    SELECT 1 FROM design_requirement_assets binding
                    WHERE binding.requirement_id = requirement.id AND binding.asset_id = $3
              ))
            ORDER BY updated_at DESC
            "#,
        )
        .bind(query.workspace_id)
        .bind(query.status.as_deref())
        .bind(query.asset_id)
        .fetch_all(&self.pool)
        .await?)
    }

    async fn create_requirement(
        &self,
        actor: &AppActor,
        request: CreateDesignRequirementRequest,
    ) -> Result<DesignRequirement, AppError> {
        let title = request.title.trim();
        if title.is_empty() {
            return Err(AppError::validation("Design requirement title is required"));
        }
        let priority = validate_priority(request.priority.as_deref().unwrap_or("medium"))?;
        let criteria = request.acceptance_criteria.unwrap_or_default();
        Ok(sqlx::query_as::<_, DesignRequirement>(
            r#"
            INSERT INTO design_requirements (
                id, workspace_id, project_id, title, summary, priority, acceptance_criteria,
                owner_id, owner_name, due_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, workspace_id, project_id, title, summary, status, priority,
                      acceptance_criteria, owner_id, owner_name, reviewer_id, reviewer_name,
                      due_date, version, created_at, updated_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(request.workspace_id)
        .bind(request.project_id)
        .bind(title)
        .bind(request.summary.unwrap_or_default().trim().to_string())
        .bind(priority)
        .bind(Json(criteria))
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .bind(request.due_date)
        .fetch_one(&self.pool)
        .await?)
    }

    async fn get_requirement(
        &self,
        requirement_id: Uuid,
    ) -> Result<DesignRequirementDetail, AppError> {
        let requirement = sqlx::query_as::<_, DesignRequirement>(
            r#"
            SELECT id, workspace_id, project_id, title, summary, status, priority,
                   acceptance_criteria, owner_id, owner_name, reviewer_id, reviewer_name,
                   due_date, version, created_at, updated_at
            FROM design_requirements
            WHERE id = $1 AND deleted_at IS NULL
            "#,
        )
        .bind(requirement_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| {
            AppError::not_found(format!("Design requirement {} not found", requirement_id))
        })?;
        let assets = sqlx::query_as::<_, DesignRequirementAsset>(
            r#"
            SELECT requirement_id, asset_id, asset_name, asset_type, preview_url, asset_version,
                   verified, relation_type, note, attached_by, attached_by_name, created_at
            FROM design_requirement_assets
            WHERE requirement_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(requirement_id)
        .fetch_all(&self.pool)
        .await?;
        let comments = sqlx::query_as::<_, DesignRequirementComment>(
            r#"
            SELECT id, requirement_id, body, author_id, author_name, created_at, updated_at
            FROM design_requirement_comments
            WHERE requirement_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(requirement_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(DesignRequirementDetail {
            requirement,
            assets,
            comments,
        })
    }

    async fn update_requirement(
        &self,
        requirement_id: Uuid,
        request: UpdateDesignRequirementRequest,
    ) -> Result<DesignRequirement, AppError> {
        let status = request.status.as_deref().map(validate_status).transpose()?;
        let priority = request
            .priority
            .as_deref()
            .map(validate_priority)
            .transpose()?;
        let requirement = sqlx::query_as::<_, DesignRequirement>(
            r#"
            UPDATE design_requirements
            SET title = COALESCE($2, title),
                summary = COALESCE($3, summary),
                status = COALESCE($4, status),
                priority = COALESCE($5, priority),
                acceptance_criteria = COALESCE($6, acceptance_criteria),
                reviewer_id = COALESCE($7, reviewer_id),
                reviewer_name = COALESCE($8, reviewer_name),
                due_date = COALESCE($9, due_date),
                version = version + 1
            WHERE id = $1 AND version = $10 AND deleted_at IS NULL
            RETURNING id, workspace_id, project_id, title, summary, status, priority,
                      acceptance_criteria, owner_id, owner_name, reviewer_id, reviewer_name,
                      due_date, version, created_at, updated_at
            "#,
        )
        .bind(requirement_id)
        .bind(request.title.map(|value| value.trim().to_string()))
        .bind(request.summary.map(|value| value.trim().to_string()))
        .bind(status)
        .bind(priority)
        .bind(request.acceptance_criteria.map(Json))
        .bind(request.reviewer_id)
        .bind(request.reviewer_name.map(|value| value.trim().to_string()))
        .bind(request.due_date)
        .bind(request.expected_version)
        .fetch_optional(&self.pool)
        .await?;
        requirement.ok_or_else(|| {
            AppError::conflict(format!(
                "Design requirement {} changed since version {}",
                requirement_id, request.expected_version
            ))
        })
    }

    async fn attach_asset<A: AssetIf>(
        &self,
        asset_if: &A,
        actor: &AppActor,
        requirement_id: Uuid,
        request: AttachDesignAssetRequest,
    ) -> Result<DesignRequirementAsset, AppError> {
        let asset = asset_if.resolve_asset(request.asset_id).await?;
        let relation_type =
            validate_relation_type(request.relation_type.as_deref().unwrap_or("reference"))?;
        Ok(sqlx::query_as::<_, DesignRequirementAsset>(
            r#"
            INSERT INTO design_requirement_assets (
                requirement_id, asset_id, asset_name, asset_type, preview_url, asset_version,
                verified, relation_type, note, attached_by, attached_by_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (requirement_id, asset_id) DO UPDATE SET
                asset_name = EXCLUDED.asset_name,
                asset_type = EXCLUDED.asset_type,
                preview_url = EXCLUDED.preview_url,
                asset_version = EXCLUDED.asset_version,
                verified = EXCLUDED.verified,
                relation_type = EXCLUDED.relation_type,
                note = EXCLUDED.note,
                attached_by = EXCLUDED.attached_by,
                attached_by_name = EXCLUDED.attached_by_name
            RETURNING requirement_id, asset_id, asset_name, asset_type, preview_url,
                      asset_version, verified, relation_type, note, attached_by,
                      attached_by_name, created_at
            "#,
        )
        .bind(requirement_id)
        .bind(asset.id)
        .bind(asset.name)
        .bind(asset.asset_type)
        .bind(asset.preview_url)
        .bind(asset.version)
        .bind(asset.verified)
        .bind(relation_type)
        .bind(request.note.map(|value| value.trim().to_string()))
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .fetch_one(&self.pool)
        .await?)
    }

    async fn add_comment(
        &self,
        actor: &AppActor,
        requirement_id: Uuid,
        request: CreateDesignCommentRequest,
    ) -> Result<DesignRequirementComment, AppError> {
        let body = request.body.trim();
        if body.is_empty() {
            return Err(AppError::validation(
                "Design requirement comment is required",
            ));
        }
        Ok(sqlx::query_as::<_, DesignRequirementComment>(
            r#"
            INSERT INTO design_requirement_comments (
                id, requirement_id, body, author_id, author_name
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, requirement_id, body, author_id, author_name, created_at, updated_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(requirement_id)
        .bind(body)
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .fetch_one(&self.pool)
        .await?)
    }
}

fn validate_priority(value: &str) -> Result<String, AppError> {
    let normalized = value.trim().to_ascii_lowercase();
    if matches!(normalized.as_str(), "low" | "medium" | "high" | "critical") {
        Ok(normalized)
    } else {
        Err(AppError::validation(
            "Unsupported design requirement priority",
        ))
    }
}

fn validate_status(value: &str) -> Result<String, AppError> {
    let normalized = value.trim().to_ascii_lowercase();
    if matches!(
        normalized.as_str(),
        "draft" | "review" | "approved" | "rejected" | "archived"
    ) {
        Ok(normalized)
    } else {
        Err(AppError::validation(
            "Unsupported design requirement status",
        ))
    }
}

fn validate_relation_type(value: &str) -> Result<String, AppError> {
    let normalized = value.trim().to_ascii_lowercase();
    if matches!(
        normalized.as_str(),
        "reference" | "source" | "target" | "deliverable"
    ) {
        Ok(normalized)
    } else {
        Err(AppError::validation("Unsupported asset relation type"))
    }
}
