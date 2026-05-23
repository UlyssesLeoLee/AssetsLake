/*
```cypher
CREATE
  (f:File {name: "project_management_repository.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::repositories::project_management_repository", type: "module"}),
  (c1:Class {name: "ProjectManagementRepository", type: "class", language: "rust", signature: "struct ProjectManagementRepository"}),
  (fn1:Function {name: "ProjectManagementRepository::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "ProjectManagementRepository::list_epics", type: "function", language: "rust", signature: "async fn list_epics(&self, project_id: Uuid) -> Result<Vec<ProjectManagementEpic>, AppError>"}),
  (fn3:Function {name: "ProjectManagementRepository::create_epic", type: "function", language: "rust", signature: "async fn create_epic(&self, req: CreateEpicRequest) -> Result<ProjectManagementEpic, AppError>"}),
  (fn4:Function {name: "ProjectManagementRepository::list_sprints", type: "function", language: "rust", signature: "async fn list_sprints(&self, project_id: Uuid) -> Result<Vec<ProjectManagementSprint>, AppError>"}),
  (fn5:Function {name: "ProjectManagementRepository::create_sprint", type: "function", language: "rust", signature: "async fn create_sprint(&self, req: CreateSprintRequest) -> Result<ProjectManagementSprint, AppError>"}),
  (fn6:Function {name: "ProjectManagementRepository::list_dependencies", type: "function", language: "rust", signature: "async fn list_dependencies(&self, project_id: Uuid) -> Result<Vec<IssueDependency>, AppError>"}),
  (fn7:Function {name: "ProjectManagementRepository::create_dependency", type: "function", language: "rust", signature: "async fn create_dependency(&self, req: CreateIssueDependencyRequest) -> Result<IssueDependency, AppError>"}),
  (fn8:Function {name: "ProjectManagementRepository::list_events", type: "function", language: "rust", signature: "async fn list_events(&self, project_id: Uuid) -> Result<Vec<IssueEvent>, AppError>"}),
  (fn9:Function {name: "ProjectManagementRepository::list_issue_summaries_by_status", type: "function", language: "rust", signature: "async fn list_issue_summaries_by_status(&self, project_id: Uuid, statuses: &[&str]) -> Result<Vec<IssueSummary>, AppError>"}),
  (fn10:Function {name: "ProjectManagementRepository::issue_summary_query", type: "function", language: "rust", signature: "fn issue_summary_query() -> &'static str"}),
  (fn11:Function {name: "default_workspace_id", type: "function", language: "rust", signature: "fn default_workspace_id() -> Uuid"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "req", type: "variable"}),
  (v3:Variable {name: "project_id", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn11),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn5)-[:CALLS]->(fn11),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v3),
  (fn7)-[:CALLS]->(fn11),
  (fn7)-[:USES]->(v2),
  (fn8)-[:USES]->(v3),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:USES]->(v3);
```
*/

use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{
        production::{IssuePriority, IssueSummary},
        project_management::{
            CreateEpicRequest, CreateIssueDependencyRequest, CreateSprintRequest, IssueDependency,
            IssueEvent, ProjectManagementEpic, ProjectManagementSprint,
        },
    },
};

pub struct ProjectManagementRepository {
    pool: PgPool,
}

impl ProjectManagementRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn list_epics(
        &self,
        project_id: Uuid,
    ) -> Result<Vec<ProjectManagementEpic>, AppError> {
        sqlx::query_as::<_, ProjectManagementEpic>(
            r#"
            SELECT
                id, workspace_id, project_id, epic_key, name, summary, status, priority,
                owner_id, start_date, target_date, rank_key, metadata, created_at, updated_at
            FROM epics
            WHERE deleted_at IS NULL AND project_id = $1
            ORDER BY rank_key ASC, created_at ASC
            "#,
        )
        .bind(project_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_epic(
        &self,
        req: CreateEpicRequest,
    ) -> Result<ProjectManagementEpic, AppError> {
        if req.name.trim().is_empty() {
            return Err(AppError::validation("Epic name is required"));
        }

        let id = Uuid::new_v4();
        let short = id.simple().to_string();
        let epic_key = format!("EP-{}", &short[..8]).to_uppercase();
        let workspace_id = req.workspace_id.unwrap_or_else(default_workspace_id);
        let priority = req.priority.unwrap_or(IssuePriority::Medium);
        let metadata = req.metadata.unwrap_or_else(|| json!({}));

        sqlx::query_as::<_, ProjectManagementEpic>(
            r#"
            INSERT INTO epics (
                id, workspace_id, project_id, epic_key, name, summary, priority,
                owner_id, start_date, target_date, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING
                id, workspace_id, project_id, epic_key, name, summary, status, priority,
                owner_id, start_date, target_date, rank_key, metadata, created_at, updated_at
            "#,
        )
        .bind(id)
        .bind(workspace_id)
        .bind(req.project_id)
        .bind(epic_key)
        .bind(req.name.trim())
        .bind(req.summary)
        .bind(priority)
        .bind(req.owner_id)
        .bind(req.start_date)
        .bind(req.target_date)
        .bind(metadata)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn list_sprints(
        &self,
        project_id: Uuid,
    ) -> Result<Vec<ProjectManagementSprint>, AppError> {
        sqlx::query_as::<_, ProjectManagementSprint>(
            r#"
            SELECT
                id, workspace_id, project_id, name, goal, status, start_date, end_date,
                capacity_points::DOUBLE PRECISION AS capacity_points,
                committed_points::DOUBLE PRECISION AS committed_points,
                completed_points::DOUBLE PRECISION AS completed_points,
                created_at, updated_at
            FROM sprints
            WHERE deleted_at IS NULL AND project_id = $1
            ORDER BY start_date DESC NULLS LAST, created_at DESC
            "#,
        )
        .bind(project_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_sprint(
        &self,
        req: CreateSprintRequest,
    ) -> Result<ProjectManagementSprint, AppError> {
        if req.name.trim().is_empty() {
            return Err(AppError::validation("Sprint name is required"));
        }
        if let (Some(start), Some(end)) = (req.start_date, req.end_date) {
            if end < start {
                return Err(AppError::validation(
                    "Sprint end date must be after start date",
                ));
            }
        }

        let workspace_id = req.workspace_id.unwrap_or_else(default_workspace_id);
        let capacity_points = req.capacity_points.unwrap_or(0.0).max(0.0);

        sqlx::query_as::<_, ProjectManagementSprint>(
            r#"
            INSERT INTO sprints (
                workspace_id, project_id, name, goal, start_date, end_date, capacity_points
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::DOUBLE PRECISION::NUMERIC)
            RETURNING
                id, workspace_id, project_id, name, goal, status, start_date, end_date,
                capacity_points::DOUBLE PRECISION AS capacity_points,
                committed_points::DOUBLE PRECISION AS committed_points,
                completed_points::DOUBLE PRECISION AS completed_points,
                created_at, updated_at
            "#,
        )
        .bind(workspace_id)
        .bind(req.project_id)
        .bind(req.name.trim())
        .bind(req.goal)
        .bind(req.start_date)
        .bind(req.end_date)
        .bind(capacity_points)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn list_dependencies(
        &self,
        project_id: Uuid,
    ) -> Result<Vec<IssueDependency>, AppError> {
        sqlx::query_as::<_, IssueDependency>(
            r#"
            SELECT
                id, workspace_id, project_id, source_issue_id, target_issue_id,
                dependency_type, description, created_by, created_at
            FROM issue_dependencies
            WHERE project_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(project_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_dependency(
        &self,
        req: CreateIssueDependencyRequest,
    ) -> Result<IssueDependency, AppError> {
        if req.source_issue_id == req.target_issue_id {
            return Err(AppError::validation(
                "Dependency source and target must differ",
            ));
        }

        let workspace_id = req.workspace_id.unwrap_or_else(default_workspace_id);
        let mut tx = self.pool.begin().await?;

        let source_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM issues WHERE id = $1 AND project_id = $2 AND deleted_at IS NULL)",
        )
        .bind(req.source_issue_id)
        .bind(req.project_id)
        .fetch_one(&mut *tx)
        .await?;

        let target_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM issues WHERE id = $1 AND project_id = $2 AND deleted_at IS NULL)",
        )
        .bind(req.target_issue_id)
        .bind(req.project_id)
        .fetch_one(&mut *tx)
        .await?;

        if !source_exists || !target_exists {
            return Err(AppError::not_found(
                "Dependency issues must exist in the project",
            ));
        }

        let dependency = sqlx::query_as::<_, IssueDependency>(
            r#"
            INSERT INTO issue_dependencies (
                workspace_id, project_id, source_issue_id, target_issue_id,
                dependency_type, description, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id, workspace_id, project_id, source_issue_id, target_issue_id,
                dependency_type, description, created_by, created_at
            "#,
        )
        .bind(workspace_id)
        .bind(req.project_id)
        .bind(req.source_issue_id)
        .bind(req.target_issue_id)
        .bind(req.dependency_type)
        .bind(req.description)
        .bind(req.created_by)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO issue_events (
                workspace_id, project_id, issue_id, event_type, actor_id, actor_name, payload
            )
            VALUES ($1, $2, $3, 'dependency_linked', $4, 'project-management', $5)
            "#,
        )
        .bind(workspace_id)
        .bind(req.project_id)
        .bind(req.source_issue_id)
        .bind(req.created_by)
        .bind(json!({
            "dependency_id": dependency.id,
            "target_issue_id": req.target_issue_id,
            "dependency_type": dependency.dependency_type,
        }))
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(dependency)
    }

    pub async fn list_events(&self, project_id: Uuid) -> Result<Vec<IssueEvent>, AppError> {
        sqlx::query_as::<_, IssueEvent>(
            r#"
            SELECT
                id, workspace_id, project_id, issue_id, event_type, actor_id,
                actor_name, payload, created_at
            FROM issue_events
            WHERE project_id = $1
            ORDER BY created_at DESC
            LIMIT 100
            "#,
        )
        .bind(project_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn list_issue_summaries_by_status(
        &self,
        project_id: Uuid,
        statuses: &[&str],
    ) -> Result<Vec<IssueSummary>, AppError> {
        sqlx::query_as::<_, IssueSummary>(Self::issue_summary_query())
            .bind(project_id)
            .bind(statuses)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)
    }

    fn issue_summary_query() -> &'static str {
        r#"
        SELECT
            i.id,
            i.issue_key,
            i.project_id,
            i.epic_id,
            i.sprint_id,
            i.vendor_id,
            i.client_id,
            i.title,
            i.issue_type,
            i.asset_type,
            i.status,
            i.priority,
            i.assignee_id,
            COALESCE(u.display_name, u.username) AS assignee_name,
            i.start_date,
            i.due_date,
            i.story_points::DOUBLE PRECISION AS story_points,
            i.rank_key,
            i.revision_count,
            i.qa_status,
            COALESCE(asset_counts.asset_count, 0)::BIGINT AS asset_count,
            thumb.thumbnail_url,
            i.created_at,
            i.updated_at
        FROM issues i
        LEFT JOIN users u ON u.id = i.assignee_id
        LEFT JOIN LATERAL (
            SELECT COUNT(*)::BIGINT AS asset_count
            FROM issue_assets ia
            WHERE ia.issue_id = i.id
        ) asset_counts ON TRUE
        LEFT JOIN LATERAL (
            SELECT COALESCE(a.preview_url, a.file_url) AS thumbnail_url
            FROM issue_assets ia
            JOIN assets a ON a.id = ia.asset_id
            WHERE ia.issue_id = i.id AND a.deleted_at IS NULL
            ORDER BY ia.created_at DESC
            LIMIT 1
        ) thumb ON TRUE
        WHERE i.deleted_at IS NULL
          AND i.project_id = $1
          AND i.status::TEXT = ANY($2)
        ORDER BY i.rank_key ASC, i.due_date ASC NULLS LAST, i.updated_at DESC
        LIMIT 100
        "#
    }
}

fn default_workspace_id() -> Uuid {
    Uuid::from_u128(1)
}
