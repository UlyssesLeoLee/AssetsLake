/*
```cypher
CREATE
  (f:File {name: "production_repository.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::repositories::production_repository", type: "module"}),
  (c1:Class {name: "ProductionRepository", type: "class", language: "rust"}),
  (fn1:Function {name: "ProductionRepository::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "ProductionRepository::create_issue", type: "function", language: "rust", signature: "async fn create_issue(&self, req: CreateIssueRequest) -> Result<Issue, AppError>"}),
  (fn3:Function {name: "ProductionRepository::list_issues", type: "function", language: "rust", signature: "async fn list_issues(&self, query: &IssueQuery) -> Result<(Vec<IssueSummary>, i64), AppError>"}),
  (fn25:Function {name: "ProductionRepository::board_sync_snapshot", type: "function", language: "rust", signature: "async fn board_sync_snapshot(&self, query: &IssueBoardSyncQuery) -> Result<IssueBoardSyncSnapshot, AppError>"}),
  (fn4:Function {name: "ProductionRepository::find_issue", type: "function", language: "rust", signature: "async fn find_issue(&self, id: Uuid) -> Result<Issue, AppError>"}),
  (fn5:Function {name: "ProductionRepository::update_issue", type: "function", language: "rust", signature: "async fn update_issue(&self, id: Uuid, req: UpdateIssueRequest) -> Result<Issue, AppError>"}),
  (fn6:Function {name: "ProductionRepository::transition_issue", type: "function", language: "rust", signature: "async fn transition_issue(&self, id: Uuid, req: TransitionIssueRequest) -> Result<Issue, AppError>"}),
  (fn7:Function {name: "ProductionRepository::add_comment", type: "function", language: "rust", signature: "async fn add_comment(&self, issue_id: Uuid, req: CreateIssueCommentRequest) -> Result<IssueComment, AppError>"}),
  (fn8:Function {name: "ProductionRepository::list_comments", type: "function", language: "rust", signature: "async fn list_comments(&self, issue_id: Uuid) -> Result<Vec<IssueComment>, AppError>"}),
  (fn9:Function {name: "ProductionRepository::create_work_log", type: "function", language: "rust", signature: "async fn create_work_log(&self, issue_id: Uuid, req: CreateIssueWorkLogRequest) -> Result<IssueWorkLog, AppError>"}),
  (fn10:Function {name: "ProductionRepository::list_work_logs", type: "function", language: "rust", signature: "async fn list_work_logs(&self, issue_id: Uuid) -> Result<Vec<IssueWorkLog>, AppError>"}),
  (fn11:Function {name: "ProductionRepository::delete_issue", type: "function", language: "rust", signature: "async fn delete_issue(&self, id: Uuid) -> Result<(), AppError>"}),
  (fn12:Function {name: "ProductionRepository::attach_asset", type: "function", language: "rust", signature: "async fn attach_asset(&self, issue_id: Uuid, req: AttachIssueAssetRequest) -> Result<(), AppError>"}),
  (fn13:Function {name: "ProductionRepository::list_issue_assets", type: "function", language: "rust", signature: "async fn list_issue_assets(&self, issue_id: Uuid) -> Result<Vec<IssueAssetSummary>, AppError>"}),
  (fn14:Function {name: "ProductionRepository::list_issue_history", type: "function", language: "rust", signature: "async fn list_issue_history(&self, issue_id: Uuid) -> Result<Vec<IssueStatusHistory>, AppError>"}),
  (fn15:Function {name: "ProductionRepository::create_review", type: "function", language: "rust", signature: "async fn create_review(&self, issue_id: Uuid, req: CreateReviewRequest) -> Result<ReviewRound, AppError>"}),
  (fn16:Function {name: "ProductionRepository::approve_issue", type: "function", language: "rust", signature: "async fn approve_issue(&self, issue_id: Uuid, req: ApproveIssueRequest) -> Result<Issue, AppError>"}),
  (fn17:Function {name: "ProductionRepository::request_revision", type: "function", language: "rust", signature: "async fn request_revision(&self, issue_id: Uuid, req: RequestRevisionRequest) -> Result<Issue, AppError>"}),
  (fn18:Function {name: "ProductionRepository::list_milestones", type: "function", language: "rust", signature: "async fn list_milestones(&self, query: &MilestoneQuery) -> Result<Vec<Milestone>, AppError>"}),
  (fn19:Function {name: "ProductionRepository::create_delivery_package", type: "function", language: "rust", signature: "async fn create_delivery_package(&self, req: CreateDeliveryPackageRequest) -> Result<DeliveryPackage, AppError>"}),
  (fn20:Function {name: "ProductionRepository::submit_delivery_package", type: "function", language: "rust", signature: "async fn submit_delivery_package(&self, id: Uuid, req: SubmitDeliveryPackageRequest) -> Result<DeliveryPackage, AppError>"}),
  (fn17:Function {name: "insert_status_history", type: "function", language: "rust", signature: "async fn insert_status_history(tx: &mut Transaction<'_, Postgres>, ...) -> Result<(), AppError>"}),
  (fn18:Function {name: "insert_audit", type: "function", language: "rust", signature: "async fn insert_audit(tx: &mut Transaction<'_, Postgres>, ...) -> Result<(), AppError>"}),
  (fn19:Function {name: "default_workspace_id", type: "function", language: "rust", signature: "fn default_workspace_id() -> Uuid"}),
  (fn20:Function {name: "default_project_id", type: "function", language: "rust", signature: "fn default_project_id() -> Uuid"}),
  (fn21:Function {name: "run_asset_qa", type: "function", language: "rust", signature: "async fn run_asset_qa(tx: &mut Transaction<'_, Postgres>, issue_id: Uuid, asset_id: Uuid) -> Result<(), AppError>"}),
  (fn22:Function {name: "is_clean_asset_name", type: "function", language: "rust", signature: "fn is_clean_asset_name(name: &str) -> bool"}),
  (fn23:Function {name: "has_extension", type: "function", language: "rust", signature: "fn has_extension(filename: &str, allowed_extensions: &[&str]) -> bool"}),
  (fn24:Function {name: "has_any_token", type: "function", language: "rust", signature: "fn has_any_token(filename: &str, tags: &str, tokens: &[&str]) -> bool"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "tx", type: "variable"}),
  (v3:Variable {name: "issue_key", type: "variable"}),
  (v4:Variable {name: "actor", type: "variable"}),
  (v5:Variable {name: "asset_ids", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn25),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (c1)-[:HAS_METHOD]->(fn10),
  (c1)-[:HAS_METHOD]->(fn11),
  (c1)-[:HAS_METHOD]->(fn12),
  (c1)-[:HAS_METHOD]->(fn13),
  (c1)-[:HAS_METHOD]->(fn14),
  (c1)-[:HAS_METHOD]->(fn15),
  (c1)-[:HAS_METHOD]->(fn16),
  (c1)-[:HAS_METHOD]->(fn17),
  (c1)-[:HAS_METHOD]->(fn18),
  (c1)-[:HAS_METHOD]->(fn19),
  (c1)-[:HAS_METHOD]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
  (m)-[:CONTAINS]->(fn23),
  (m)-[:CONTAINS]->(fn24),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn17),
  (fn2)-[:CALLS]->(fn18),
  (fn2)-[:CALLS]->(fn19),
  (fn2)-[:CALLS]->(fn20),
  (fn3)-[:CALLS]->(fn2),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn5)-[:CALLS]->(fn17),
  (fn5)-[:CALLS]->(fn18),
  (fn6)-[:USES]->(v2),
  (fn6)-[:USES]->(v4),
  (fn6)-[:CALLS]->(fn17),
  (fn6)-[:CALLS]->(fn18),
  (fn7)-[:CALLS]->(fn18),
  (fn9)-[:CALLS]->(fn18),
  (fn11)-[:CALLS]->(fn18),
  (fn12)-[:CALLS]->(fn18),
  (fn12)-[:CALLS]->(fn21),
  (fn15)-[:CALLS]->(fn17),
  (fn15)-[:CALLS]->(fn18),
  (fn16)-[:CALLS]->(fn17),
  (fn16)-[:CALLS]->(fn18),
  (fn17)-[:CALLS]->(fn17),
  (fn17)-[:CALLS]->(fn18),
  (fn19)-[:USES]->(v5),
  (fn19)-[:CALLS]->(fn18),
  (fn20)-[:CALLS]->(fn18),
  (fn21)-[:CALLS]->(fn22),
  (fn21)-[:CALLS]->(fn23),
  (fn21)-[:CALLS]->(fn24);
```
*/

use std::collections::HashSet;

use chrono::{DateTime, Utc};
use serde_json::{json, Value};
use sqlx::{PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{
        asset::AssetType,
        production::{
            AiQaStatus, ApproveIssueRequest, AttachIssueAssetRequest, CreateDeliveryPackageRequest,
            CreateIssueCommentRequest, CreateIssueRequest, CreateIssueWorkLogRequest,
            CreateReviewRequest, DeliveryPackage, Issue, IssueAssetSummary, IssueBoardSyncActivity,
            IssueBoardSyncQuery, IssueBoardSyncSnapshot, IssueComment, IssueQuery, IssueStatus,
            IssueStatusHistory, IssueSummary, IssueType, IssueWorkLog, Milestone, MilestoneQuery,
            QaSeverity, RequestRevisionRequest, ReviewRound, ReviewRoundStatus, ReviewScope,
            SubmitDeliveryPackageRequest, TransitionIssueRequest, UpdateIssueRequest,
        },
    },
};

pub struct ProductionRepository {
    pool: PgPool,
}

impl ProductionRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_issue(&self, req: CreateIssueRequest) -> Result<Issue, AppError> {
        if req.title.trim().is_empty() {
            return Err(AppError::validation("Issue title is required"));
        }

        let id = Uuid::new_v4();
        let short = id.simple().to_string();
        let issue_key = format!("AL-{}", &short[..8]).to_uppercase();
        let workspace_id = req.workspace_id.unwrap_or_else(default_workspace_id);
        let project_id = req.project_id.unwrap_or_else(default_project_id);
        let priority = req
            .priority
            .unwrap_or(crate::models::production::IssuePriority::Medium);
        let metadata = req.metadata.unwrap_or_else(|| json!({}));

        let mut tx = self.pool.begin().await?;

        let issue = sqlx::query_as::<_, Issue>(
            r#"
            INSERT INTO issues (
                id, issue_key, workspace_id, project_id, brief_id, epic_id, sprint_id, milestone_id,
                vendor_id, client_id, title, description, issue_type, asset_type,
                priority, assignee_id, reporter_id, start_date, due_date, story_points, rank_key, metadata
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8,
                $9, $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19, $20::DOUBLE PRECISION::NUMERIC, COALESCE($21, '000000'), $22
            )
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(&issue_key)
        .bind(workspace_id)
        .bind(project_id)
        .bind(req.brief_id)
        .bind(req.epic_id)
        .bind(req.sprint_id)
        .bind(req.milestone_id)
        .bind(req.vendor_id)
        .bind(req.client_id)
        .bind(req.title.trim())
        .bind(&req.description)
        .bind(req.issue_type)
        .bind(req.asset_type)
        .bind(priority)
        .bind(req.assignee_id)
        .bind(req.reporter_id)
        .bind(req.start_date)
        .bind(req.due_date)
        .bind(req.story_points)
        .bind(req.rank_key)
        .bind(metadata)
        .fetch_one(&mut *tx)
        .await?;

        insert_status_history(
            &mut tx,
            issue.id,
            None,
            issue.status,
            req.reporter_id,
            "system",
            Some("Issue created"),
        )
        .await?;
        insert_audit(
            &mut tx,
            "issue",
            issue.id,
            "created",
            req.reporter_id,
            Some("system"),
            json!({ "issue_key": issue.issue_key.clone(), "status": issue.status }),
        )
        .await?;

        tx.commit().await?;
        Ok(issue)
    }

    pub async fn list_issues(
        &self,
        query: &IssueQuery,
    ) -> Result<(Vec<IssueSummary>, i64), AppError> {
        let limit = query.page_size();
        let offset = query.offset();

        let total: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM issues i
            WHERE i.deleted_at IS NULL
              AND ($1::uuid IS NULL OR i.project_id = $1)
              AND ($2::uuid IS NULL OR i.vendor_id = $2)
              AND ($3::uuid IS NULL OR i.client_id = $3)
              AND ($4::uuid IS NULL OR i.assignee_id = $4)
              AND ($5::text IS NULL OR i.issue_type::text = $5)
              AND ($6::text IS NULL OR i.asset_type::text = $6)
              AND ($7::text IS NULL OR i.status::text = $7)
              AND ($8::text IS NULL OR i.priority::text = $8)
              AND ($9::date IS NULL OR i.due_date <= $9)
              AND ($10::text IS NULL OR i.title ILIKE '%' || $10 || '%' OR i.issue_key ILIKE '%' || $10 || '%')
            "#,
        )
        .bind(query.project_id)
        .bind(query.vendor_id)
        .bind(query.client_id)
        .bind(query.assignee_id)
        .bind(&query.issue_type)
        .bind(&query.asset_type)
        .bind(&query.status)
        .bind(&query.priority)
        .bind(query.due_before)
        .bind(&query.q)
        .fetch_one(&self.pool)
        .await?;

        let issues = sqlx::query_as::<_, IssueSummary>(
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
                i.version,
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
              AND ($1::uuid IS NULL OR i.project_id = $1)
              AND ($2::uuid IS NULL OR i.vendor_id = $2)
              AND ($3::uuid IS NULL OR i.client_id = $3)
              AND ($4::uuid IS NULL OR i.assignee_id = $4)
              AND ($5::text IS NULL OR i.issue_type::text = $5)
              AND ($6::text IS NULL OR i.asset_type::text = $6)
              AND ($7::text IS NULL OR i.status::text = $7)
              AND ($8::text IS NULL OR i.priority::text = $8)
              AND ($9::date IS NULL OR i.due_date <= $9)
              AND ($10::text IS NULL OR i.title ILIKE '%' || $10 || '%' OR i.issue_key ILIKE '%' || $10 || '%')
            ORDER BY
                CASE i.priority
                    WHEN 'urgent' THEN 0
                    WHEN 'high' THEN 1
                    WHEN 'medium' THEN 2
                    ELSE 3
                END,
                i.due_date ASC NULLS LAST,
                i.updated_at DESC
            LIMIT $11 OFFSET $12
            "#,
        )
        .bind(query.project_id)
        .bind(query.vendor_id)
        .bind(query.client_id)
        .bind(query.assignee_id)
        .bind(&query.issue_type)
        .bind(&query.asset_type)
        .bind(&query.status)
        .bind(&query.priority)
        .bind(query.due_before)
        .bind(&query.q)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;

        Ok((issues, total))
    }

    pub async fn board_sync_snapshot(
        &self,
        query: &IssueBoardSyncQuery,
    ) -> Result<IssueBoardSyncSnapshot, AppError> {
        let cursor = sqlx::query_scalar::<_, DateTime<Utc>>(
            r#"
            SELECT COALESCE(MAX(updated_at), NOW())
            FROM issues
            WHERE deleted_at IS NULL
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        let changed_count = if let Some(since) = query.since.as_ref() {
            sqlx::query_scalar::<_, i64>(
                r#"
                SELECT COUNT(*)
                FROM issues
                WHERE deleted_at IS NULL AND updated_at > $1
                "#,
            )
            .bind(since)
            .fetch_one(&self.pool)
            .await?
        } else {
            0
        };

        let recent_activity = if let Some(since) = query.since.as_ref() {
            sqlx::query_as::<_, IssueBoardSyncActivity>(
                r#"
                SELECT
                    h.id,
                    h.issue_id,
                    i.issue_key,
                    i.title,
                    h.from_status,
                    h.to_status,
                    h.actor,
                    h.created_at,
                    i.version AS issue_version,
                    i.updated_at AS issue_updated_at
                FROM issue_status_history h
                JOIN issues i ON i.id = h.issue_id
                WHERE i.deleted_at IS NULL AND h.created_at > $1
                ORDER BY h.created_at DESC
                LIMIT $2
                "#,
            )
            .bind(since)
            .bind(query.limit())
            .fetch_all(&self.pool)
            .await?
        } else {
            sqlx::query_as::<_, IssueBoardSyncActivity>(
                r#"
                SELECT
                    h.id,
                    h.issue_id,
                    i.issue_key,
                    i.title,
                    h.from_status,
                    h.to_status,
                    h.actor,
                    h.created_at,
                    i.version AS issue_version,
                    i.updated_at AS issue_updated_at
                FROM issue_status_history h
                JOIN issues i ON i.id = h.issue_id
                WHERE i.deleted_at IS NULL
                ORDER BY h.created_at DESC
                LIMIT $1
                "#,
            )
            .bind(query.limit())
            .fetch_all(&self.pool)
            .await?
        };

        Ok(IssueBoardSyncSnapshot {
            cursor,
            changed_count,
            recent_activity,
        })
    }

    pub async fn find_issue(&self, id: Uuid) -> Result<Issue, AppError> {
        sqlx::query_as::<_, Issue>("SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or_else(|| AppError::not_found(format!("Issue {} not found", id)))
    }

    pub async fn update_issue(&self, id: Uuid, req: UpdateIssueRequest) -> Result<Issue, AppError> {
        let mut tx = self.pool.begin().await?;
        let old = sqlx::query_as::<_, Issue>(
            "SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
        )
        .bind(id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Issue {} not found", id)))?;

        if req
            .expected_version
            .map(|expected_version| expected_version != old.version)
            .unwrap_or(false)
        {
            return Err(AppError::conflict(
                "Issue version conflict; refresh the issue and retry the update",
            ));
        }

        let actor = req.actor.clone().unwrap_or_else(|| "system".to_string());
        let issue = sqlx::query_as::<_, Issue>(
            r#"
            UPDATE issues SET
                brief_id = COALESCE($2, brief_id),
                epic_id = COALESCE($3, epic_id),
                sprint_id = COALESCE($4, sprint_id),
                milestone_id = COALESCE($5, milestone_id),
                vendor_id = COALESCE($6, vendor_id),
                client_id = COALESCE($7, client_id),
                title = COALESCE($8, title),
                description = COALESCE($9, description),
                issue_type = COALESCE($10::issue_type, issue_type),
                asset_type = COALESCE($11::asset_type, asset_type),
                status = COALESCE($12::issue_status, status),
                priority = COALESCE($13::issue_priority, priority),
                assignee_id = COALESCE($14, assignee_id),
                start_date = COALESCE($15, start_date),
                due_date = COALESCE($16, due_date),
                story_points = COALESCE($17::DOUBLE PRECISION::NUMERIC, story_points),
                rank_key = COALESCE($18, rank_key),
                qa_status = COALESCE($19::ai_qa_status, qa_status),
                metadata = COALESCE($20::jsonb, metadata),
                version = version + 1,
                updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(req.brief_id)
        .bind(req.epic_id)
        .bind(req.sprint_id)
        .bind(req.milestone_id)
        .bind(req.vendor_id)
        .bind(req.client_id)
        .bind(&req.title)
        .bind(&req.description)
        .bind(req.issue_type)
        .bind(req.asset_type)
        .bind(req.status)
        .bind(req.priority)
        .bind(req.assignee_id)
        .bind(req.start_date)
        .bind(req.due_date)
        .bind(req.story_points)
        .bind(req.rank_key)
        .bind(req.qa_status)
        .bind(req.metadata)
        .fetch_one(&mut *tx)
        .await?;

        if old.status != issue.status {
            insert_status_history(
                &mut tx,
                id,
                Some(old.status),
                issue.status,
                None,
                actor.as_str(),
                Some("Status changed by patch"),
            )
            .await?;
        }

        insert_audit(
            &mut tx,
            "issue",
            id,
            "updated",
            None,
            Some(actor.as_str()),
            json!({ "from_status": old.status, "to_status": issue.status }),
        )
        .await?;

        tx.commit().await?;
        Ok(issue)
    }

    pub async fn transition_issue(
        &self,
        id: Uuid,
        req: TransitionIssueRequest,
    ) -> Result<Issue, AppError> {
        let mut tx = self.pool.begin().await?;
        let old = sqlx::query_as::<_, Issue>(
            "SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
        )
        .bind(id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Issue {} not found", id)))?;

        if req
            .expected_version
            .map(|expected_version| expected_version != old.version)
            .unwrap_or(false)
        {
            return Err(AppError::conflict(
                "Issue version conflict; refresh the issue and retry the transition",
            ));
        }

        let issue = sqlx::query_as::<_, Issue>(
            r#"
            UPDATE issues
            SET status = $2, version = version + 1, updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(req.status)
        .fetch_one(&mut *tx)
        .await?;

        let actor = req.actor.clone().unwrap_or_else(|| "system".to_string());
        insert_status_history(
            &mut tx,
            id,
            Some(old.status),
            issue.status,
            req.actor_id,
            actor.as_str(),
            req.reason.as_deref(),
        )
        .await?;
        insert_audit(
            &mut tx,
            "issue",
            id,
            "transitioned",
            req.actor_id,
            Some(actor.as_str()),
            json!({ "from": old.status, "to": issue.status, "reason": req.reason }),
        )
        .await?;

        tx.commit().await?;
        Ok(issue)
    }

    pub async fn add_comment(
        &self,
        issue_id: Uuid,
        req: CreateIssueCommentRequest,
    ) -> Result<IssueComment, AppError> {
        if req.body.trim().is_empty() {
            return Err(AppError::validation("Comment body is required"));
        }

        let mut tx = self.pool.begin().await?;
        let comment = sqlx::query_as::<_, IssueComment>(
            r#"
            INSERT INTO issue_comments (issue_id, author_id, author_name, body, visibility)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            "#,
        )
        .bind(issue_id)
        .bind(req.author_id)
        .bind(req.author_name.as_deref().unwrap_or("anonymous"))
        .bind(req.body.trim())
        .bind(req.visibility.as_deref().unwrap_or("internal"))
        .fetch_one(&mut *tx)
        .await?;

        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "commented",
            req.author_id,
            req.author_name.as_deref(),
            json!({ "comment_id": comment.id, "visibility": comment.visibility }),
        )
        .await?;
        tx.commit().await?;

        Ok(comment)
    }

    pub async fn list_comments(&self, issue_id: Uuid) -> Result<Vec<IssueComment>, AppError> {
        sqlx::query_as::<_, IssueComment>(
            r#"
            SELECT id, issue_id, author_id, author_name, body, visibility, created_at
            FROM issue_comments
            WHERE issue_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(issue_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_work_log(
        &self,
        issue_id: Uuid,
        req: CreateIssueWorkLogRequest,
    ) -> Result<IssueWorkLog, AppError> {
        if req.time_spent_minutes <= 0 {
            return Err(AppError::validation("Work log minutes must be positive"));
        }

        let mut tx = self.pool.begin().await?;
        let issue_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM issues WHERE id = $1 AND deleted_at IS NULL)",
        )
        .bind(issue_id)
        .fetch_one(&mut *tx)
        .await?;
        if !issue_exists {
            return Err(AppError::not_found(format!("Issue {} not found", issue_id)));
        }

        let work_log = sqlx::query_as::<_, IssueWorkLog>(
            r#"
            INSERT INTO issue_work_logs (
                issue_id, author_id, author_name, time_spent_minutes, started_at, body
            )
            VALUES ($1, $2, $3, $4, COALESCE($5::TIMESTAMPTZ, NOW()), $6)
            RETURNING id, issue_id, author_id, author_name, time_spent_minutes, started_at, body, created_at
            "#,
        )
        .bind(issue_id)
        .bind(req.author_id)
        .bind(req.author_name.as_deref().unwrap_or("artist"))
        .bind(req.time_spent_minutes)
        .bind(req.started_at)
        .bind(req.body.as_deref())
        .fetch_one(&mut *tx)
        .await?;

        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "work_logged",
            req.author_id,
            req.author_name.as_deref(),
            json!({ "work_log_id": work_log.id, "minutes": work_log.time_spent_minutes }),
        )
        .await?;

        tx.commit().await?;
        Ok(work_log)
    }

    pub async fn list_work_logs(&self, issue_id: Uuid) -> Result<Vec<IssueWorkLog>, AppError> {
        sqlx::query_as::<_, IssueWorkLog>(
            r#"
            SELECT id, issue_id, author_id, author_name, time_spent_minutes, started_at, body, created_at
            FROM issue_work_logs
            WHERE issue_id = $1
            ORDER BY started_at DESC, created_at DESC
            "#,
        )
        .bind(issue_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn delete_issue(&self, id: Uuid) -> Result<(), AppError> {
        let mut tx = self.pool.begin().await?;
        let affected = sqlx::query(
            r#"
            UPDATE issues
            SET deleted_at = NOW(), version = version + 1, updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            "#,
        )
        .bind(id)
        .execute(&mut *tx)
        .await?
        .rows_affected();

        if affected == 0 {
            return Err(AppError::not_found(format!("Issue {} not found", id)));
        }

        insert_audit(
            &mut tx,
            "issue",
            id,
            "deleted",
            None,
            Some("system"),
            json!({ "soft_delete": true }),
        )
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn attach_asset(
        &self,
        issue_id: Uuid,
        req: AttachIssueAssetRequest,
    ) -> Result<(), AppError> {
        let mut tx = self.pool.begin().await?;

        let issue_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM issues WHERE id = $1 AND deleted_at IS NULL)",
        )
        .bind(issue_id)
        .fetch_one(&mut *tx)
        .await?;
        if !issue_exists {
            return Err(AppError::not_found(format!("Issue {} not found", issue_id)));
        }

        let asset_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM assets WHERE id = $1 AND deleted_at IS NULL)",
        )
        .bind(req.asset_id)
        .fetch_one(&mut *tx)
        .await?;
        if !asset_exists {
            return Err(AppError::not_found(format!(
                "Asset {} not found",
                req.asset_id
            )));
        }

        sqlx::query(
            r#"
            INSERT INTO issue_assets (issue_id, asset_id, link_type, created_by)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (issue_id, asset_id)
            DO UPDATE SET link_type = EXCLUDED.link_type
            "#,
        )
        .bind(issue_id)
        .bind(req.asset_id)
        .bind(req.link_type.as_deref().unwrap_or("submission"))
        .bind(req.actor_id)
        .execute(&mut *tx)
        .await?;

        run_asset_qa(&mut tx, issue_id, req.asset_id).await?;

        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "asset_attached",
            req.actor_id,
            req.actor.as_deref(),
            json!({ "asset_id": req.asset_id, "link_type": req.link_type }),
        )
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn list_issue_assets(
        &self,
        issue_id: Uuid,
    ) -> Result<Vec<IssueAssetSummary>, AppError> {
        let rows = sqlx::query_as::<_, IssueAssetSummary>(
            r#"
            SELECT
                a.id,
                a.name,
                a.original_filename,
                a.asset_type,
                a.mime_type,
                a.tags,
                '/api/assets/' || a.id || '/content' AS file_url,
                CASE WHEN a.preview_url IS NULL THEN NULL ELSE '/api/assets/' || a.id || '/content' END AS preview_url,
                a.file_size,
                a.version,
                a.project_id,
                a.uploader,
                a.status,
                ia.link_type,
                a.created_at,
                a.updated_at
            FROM issue_assets ia
            JOIN assets a ON a.id = ia.asset_id
            WHERE ia.issue_id = $1 AND a.deleted_at IS NULL
            ORDER BY ia.created_at DESC
            "#,
        )
        .bind(issue_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows)
    }

    pub async fn list_issue_history(
        &self,
        issue_id: Uuid,
    ) -> Result<Vec<IssueStatusHistory>, AppError> {
        sqlx::query_as::<_, IssueStatusHistory>(
            r#"
            SELECT *
            FROM issue_status_history
            WHERE issue_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(issue_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_review(
        &self,
        issue_id: Uuid,
        req: CreateReviewRequest,
    ) -> Result<ReviewRound, AppError> {
        let mut tx = self.pool.begin().await?;
        let reviewer_name = req
            .reviewer_name
            .clone()
            .unwrap_or_else(|| "reviewer".to_string());
        let old = sqlx::query_as::<_, Issue>(
            "SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
        )
        .bind(issue_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Issue {} not found", issue_id)))?;

        let round_number: i32 = sqlx::query_scalar(
            r#"
            SELECT COALESCE(MAX(round_number), 0) + 1
            FROM review_rounds
            WHERE issue_id = $1 AND scope = $2
            "#,
        )
        .bind(issue_id)
        .bind(req.scope)
        .fetch_one(&mut *tx)
        .await?;

        let review = sqlx::query_as::<_, ReviewRound>(
            r#"
            INSERT INTO review_rounds (
                issue_id, scope, round_number, status, reviewer_id, reviewer_name, summary
            )
            VALUES ($1, $2, $3, 'open', $4, $5, $6)
            RETURNING *
            "#,
        )
        .bind(issue_id)
        .bind(req.scope)
        .bind(round_number)
        .bind(req.reviewer_id)
        .bind(reviewer_name.as_str())
        .bind(&req.summary)
        .fetch_one(&mut *tx)
        .await?;

        if let Some(comment) = req.comment.as_ref().filter(|c| !c.trim().is_empty()) {
            sqlx::query(
                r#"
                INSERT INTO review_comments (
                    review_round_id, issue_id, asset_id, author_id, author_name,
                    body, annotation, severity
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                "#,
            )
            .bind(review.id)
            .bind(issue_id)
            .bind(req.asset_id)
            .bind(req.reviewer_id)
            .bind(reviewer_name.as_str())
            .bind(comment.trim())
            .bind(req.annotation.clone().unwrap_or_else(|| json!({})))
            .bind(
                req.severity
                    .unwrap_or(crate::models::production::QaSeverity::Info),
            )
            .execute(&mut *tx)
            .await?;
        }

        let target_status = match req.scope {
            ReviewScope::Internal => IssueStatus::InternalReview,
            ReviewScope::Client => IssueStatus::ClientReview,
        };

        sqlx::query(
            "UPDATE issues SET status = $2, version = version + 1, updated_at = NOW() WHERE id = $1",
        )
            .bind(issue_id)
            .bind(target_status)
            .execute(&mut *tx)
            .await?;

        insert_status_history(
            &mut tx,
            issue_id,
            Some(old.status),
            target_status,
            req.reviewer_id,
            reviewer_name.as_str(),
            Some("Review round opened"),
        )
        .await?;
        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "review_opened",
            req.reviewer_id,
            Some(reviewer_name.as_str()),
            json!({ "review_round_id": review.id, "scope": review.scope, "round": review.round_number }),
        )
        .await?;

        tx.commit().await?;
        Ok(review)
    }

    pub async fn approve_issue(
        &self,
        issue_id: Uuid,
        req: ApproveIssueRequest,
    ) -> Result<Issue, AppError> {
        let mut tx = self.pool.begin().await?;
        let old = sqlx::query_as::<_, Issue>(
            "SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
        )
        .bind(issue_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Issue {} not found", issue_id)))?;

        let issue = sqlx::query_as::<_, Issue>(
            "UPDATE issues SET status = 'approved', version = version + 1, updated_at = NOW() WHERE id = $1 RETURNING *",
        )
        .bind(issue_id)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO approval_records (
                issue_id, asset_id, asset_version_id, approved_by,
                approver_name, approval_scope, note
            )
            SELECT
                ia.issue_id,
                ia.asset_id,
                av.id,
                $2,
                $3,
                $4,
                $5
            FROM issue_assets ia
            LEFT JOIN LATERAL (
                SELECT id FROM asset_versions
                WHERE asset_id = ia.asset_id
                ORDER BY version DESC
                LIMIT 1
            ) av ON TRUE
            WHERE ia.issue_id = $1
            "#,
        )
        .bind(issue_id)
        .bind(req.approver_id)
        .bind(req.approver_name.as_deref().unwrap_or("approver"))
        .bind(req.scope.unwrap_or(ReviewScope::Internal))
        .bind(&req.note)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            UPDATE assets
            SET status = 'active',
                reviewed_by = COALESCE($2, reviewed_by),
                reviewed_at = NOW(),
                review_note = COALESCE($3, review_note)
            WHERE id IN (SELECT asset_id FROM issue_assets WHERE issue_id = $1)
            "#,
        )
        .bind(issue_id)
        .bind(req.approver_id)
        .bind(&req.note)
        .execute(&mut *tx)
        .await?;

        insert_status_history(
            &mut tx,
            issue_id,
            Some(old.status),
            IssueStatus::Approved,
            req.approver_id,
            req.approver_name.as_deref().unwrap_or("approver"),
            req.note.as_deref(),
        )
        .await?;
        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "approved",
            req.approver_id,
            req.approver_name.as_deref(),
            json!({ "scope": req.scope.unwrap_or(ReviewScope::Internal), "note": req.note }),
        )
        .await?;

        tx.commit().await?;
        Ok(issue)
    }

    pub async fn request_revision(
        &self,
        issue_id: Uuid,
        req: RequestRevisionRequest,
    ) -> Result<Issue, AppError> {
        if req.reason.trim().is_empty() {
            return Err(AppError::validation("Revision reason is required"));
        }

        let mut tx = self.pool.begin().await?;
        let old = sqlx::query_as::<_, Issue>(
            "SELECT * FROM issues WHERE id = $1 AND deleted_at IS NULL FOR UPDATE",
        )
        .bind(issue_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Issue {} not found", issue_id)))?;

        let new_round = old.revision_count + 1;
        let scope = req.scope.unwrap_or(ReviewScope::Internal);
        let reviewer_name = req
            .requester_name
            .clone()
            .unwrap_or_else(|| "reviewer".to_string());

        let review = sqlx::query_as::<_, ReviewRound>(
            r#"
            INSERT INTO review_rounds (
                issue_id, scope, round_number, status, reviewer_id, reviewer_name, summary
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (issue_id, scope, round_number)
            DO UPDATE SET status = EXCLUDED.status, summary = EXCLUDED.summary
            RETURNING *
            "#,
        )
        .bind(issue_id)
        .bind(scope)
        .bind(new_round)
        .bind(ReviewRoundStatus::ChangesRequested)
        .bind(req.requester_id)
        .bind(reviewer_name.as_str())
        .bind(&req.reason)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO review_comments (
                review_round_id, issue_id, asset_id, author_id, author_name,
                body, annotation, severity
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'error')
            "#,
        )
        .bind(review.id)
        .bind(issue_id)
        .bind(req.asset_id)
        .bind(req.requester_id)
        .bind(reviewer_name.as_str())
        .bind(req.reason.trim())
        .bind(req.annotation.unwrap_or_else(|| json!({})))
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO revision_requests (
                issue_id, review_round_id, requested_by, requester_name, reason, round_number
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(issue_id)
        .bind(review.id)
        .bind(req.requester_id)
        .bind(reviewer_name.as_str())
        .bind(req.reason.trim())
        .bind(new_round)
        .execute(&mut *tx)
        .await?;

        let issue = sqlx::query_as::<_, Issue>(
            r#"
            UPDATE issues
            SET status = 'revision_required',
                revision_count = revision_count + 1,
                version = version + 1,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(issue_id)
        .fetch_one(&mut *tx)
        .await?;

        insert_status_history(
            &mut tx,
            issue_id,
            Some(old.status),
            IssueStatus::RevisionRequired,
            req.requester_id,
            reviewer_name.as_str(),
            Some(req.reason.trim()),
        )
        .await?;
        insert_audit(
            &mut tx,
            "issue",
            issue_id,
            "revision_requested",
            req.requester_id,
            Some(reviewer_name.as_str()),
            json!({ "round": new_round, "reason": req.reason }),
        )
        .await?;

        tx.commit().await?;
        Ok(issue)
    }

    pub async fn list_milestones(
        &self,
        query: &MilestoneQuery,
    ) -> Result<Vec<Milestone>, AppError> {
        sqlx::query_as::<_, Milestone>(
            r#"
            SELECT
                id, workspace_id, project_id, name, description, due_date,
                status, sort_order, created_at, updated_at
            FROM milestones
            WHERE deleted_at IS NULL
              AND ($1::uuid IS NULL OR project_id = $1)
            ORDER BY sort_order ASC, due_date ASC NULLS LAST
            "#,
        )
        .bind(query.project_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn create_delivery_package(
        &self,
        req: CreateDeliveryPackageRequest,
    ) -> Result<DeliveryPackage, AppError> {
        if req.name.trim().is_empty() {
            return Err(AppError::validation("Delivery package name is required"));
        }

        let asset_ids = unique_asset_ids(req.asset_ids);
        if asset_ids.is_empty() {
            return Err(AppError::validation(
                "Delivery package requires approved assets",
            ));
        }

        let mut tx = self.pool.begin().await?;
        let approved_count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM assets
            WHERE id = ANY($1::uuid[]) AND status = 'active' AND deleted_at IS NULL
            "#,
        )
        .bind(&asset_ids)
        .fetch_one(&mut *tx)
        .await?;

        if approved_count != asset_ids.len() as i64 {
            return Err(AppError::validation(
                "Delivery package can only include approved assets",
            ));
        }

        let package = sqlx::query_as::<_, DeliveryPackage>(
            r#"
            INSERT INTO delivery_packages (
                workspace_id, project_id, vendor_id, client_id, name, notes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            "#,
        )
        .bind(req.workspace_id.unwrap_or_else(default_workspace_id))
        .bind(req.project_id)
        .bind(req.vendor_id)
        .bind(req.client_id)
        .bind(req.name.trim())
        .bind(&req.notes)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO delivery_package_assets (
                package_id, asset_id, asset_version_id, issue_id, included_by
            )
            SELECT
                $1,
                a.id,
                av.id,
                ia.issue_id,
                $3
            FROM assets a
            LEFT JOIN LATERAL (
                SELECT id FROM asset_versions
                WHERE asset_id = a.id
                ORDER BY version DESC
                LIMIT 1
            ) av ON TRUE
            LEFT JOIN LATERAL (
                SELECT issue_id FROM issue_assets
                WHERE asset_id = a.id
                ORDER BY created_at DESC
                LIMIT 1
            ) ia ON TRUE
            WHERE a.id = ANY($2::uuid[])
            "#,
        )
        .bind(package.id)
        .bind(&asset_ids)
        .bind(req.included_by)
        .execute(&mut *tx)
        .await?;

        insert_audit(
            &mut tx,
            "delivery_package",
            package.id,
            "created",
            req.included_by,
            None,
            json!({ "asset_ids": asset_ids }),
        )
        .await?;

        tx.commit().await?;
        Ok(package)
    }

    pub async fn submit_delivery_package(
        &self,
        id: Uuid,
        req: SubmitDeliveryPackageRequest,
    ) -> Result<DeliveryPackage, AppError> {
        let mut tx = self.pool.begin().await?;
        let asset_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM delivery_package_assets WHERE package_id = $1",
        )
        .bind(id)
        .fetch_one(&mut *tx)
        .await?;
        if asset_count == 0 {
            return Err(AppError::validation(
                "Cannot submit an empty delivery package",
            ));
        }

        let unapproved_count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM delivery_package_assets dpa
            JOIN assets a ON a.id = dpa.asset_id
            WHERE dpa.package_id = $1 AND a.status <> 'active'
            "#,
        )
        .bind(id)
        .fetch_one(&mut *tx)
        .await?;
        if unapproved_count > 0 {
            return Err(AppError::validation(
                "Delivery package contains assets that are not approved",
            ));
        }

        let package = sqlx::query_as::<_, DeliveryPackage>(
            r#"
            UPDATE delivery_packages
            SET status = 'submitted',
                submitted_by = COALESCE($2, submitted_by),
                submitted_at = NOW(),
                updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(req.submitted_by)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Delivery package {} not found", id)))?;

        let actor = req
            .actor
            .clone()
            .unwrap_or_else(|| "delivery-manager".to_string());
        let issue_rows: Vec<(Uuid, IssueStatus)> = sqlx::query_as(
            r#"
            SELECT DISTINCT i.id, i.status
            FROM delivery_package_assets dpa
            JOIN issues i ON i.id = dpa.issue_id
            WHERE dpa.package_id = $1
              AND i.deleted_at IS NULL
              AND i.status <> 'delivered'
            "#,
        )
        .bind(id)
        .fetch_all(&mut *tx)
        .await?;

        for (issue_id, old_status) in issue_rows {
            sqlx::query(
                "UPDATE issues SET status = 'delivered', version = version + 1, updated_at = NOW() WHERE id = $1",
            )
                .bind(issue_id)
                .execute(&mut *tx)
                .await?;
            insert_status_history(
                &mut tx,
                issue_id,
                Some(old_status),
                IssueStatus::Delivered,
                req.submitted_by,
                actor.as_str(),
                Some("Delivery package submitted"),
            )
            .await?;
            insert_audit(
                &mut tx,
                "issue",
                issue_id,
                "delivered",
                req.submitted_by,
                Some(actor.as_str()),
                json!({ "delivery_package_id": id }),
            )
            .await?;
        }

        insert_audit(
            &mut tx,
            "delivery_package",
            id,
            "submitted",
            req.submitted_by,
            Some(actor.as_str()),
            json!({ "asset_count": asset_count }),
        )
        .await?;

        tx.commit().await?;
        Ok(package)
    }
}

async fn run_asset_qa(
    tx: &mut Transaction<'_, Postgres>,
    issue_id: Uuid,
    asset_id: Uuid,
) -> Result<(), AppError> {
    let (filename, asset_type, mime_type, version, checksum, tags, issue_type): (
        String,
        AssetType,
        String,
        i32,
        Option<String>,
        Vec<String>,
        IssueType,
    ) = sqlx::query_as(
        r#"
        SELECT
            a.original_filename,
            a.asset_type,
            a.mime_type,
            a.version,
            a.checksum_sha256,
            a.tags,
            i.issue_type
        FROM assets a
        JOIN issues i ON i.id = $1
        WHERE a.id = $2 AND a.deleted_at IS NULL AND i.deleted_at IS NULL
        "#,
    )
    .bind(issue_id)
    .bind(asset_id)
    .fetch_one(&mut **tx)
    .await?;

    let lower_filename = filename.to_ascii_lowercase();
    let lower_tags = tags
        .iter()
        .map(|tag| tag.to_ascii_lowercase())
        .collect::<Vec<_>>()
        .join(" ");
    let mut findings: Vec<(String, QaSeverity, String, Value)> = Vec::new();

    if !is_clean_asset_name(&filename) {
        findings.push((
            "naming_convention".to_string(),
            QaSeverity::Warning,
            "Filename should use lowercase letters, numbers, dots, hyphens, and underscores"
                .to_string(),
            json!({ "filename": filename }),
        ));
    }

    if version < 1 {
        findings.push((
            "version_number".to_string(),
            QaSeverity::Error,
            "Asset version must start at 1".to_string(),
            json!({ "version": version }),
        ));
    }

    match asset_type {
        AssetType::Texture
            if !has_extension(
                &lower_filename,
                &["png", "jpg", "jpeg", "tga", "exr", "psd"],
            ) =>
        {
            findings.push((
                "file_type".to_string(),
                QaSeverity::Warning,
                "Texture asset uses an unexpected file type".to_string(),
                json!({ "mime_type": mime_type, "filename": lower_filename.clone() }),
            ));
        }
        AssetType::Model3d
            if !has_extension(
                &lower_filename,
                &["fbx", "obj", "blend", "glb", "gltf", "ma", "mb"],
            ) =>
        {
            findings.push((
                "file_type".to_string(),
                QaSeverity::Warning,
                "Model asset uses an unexpected file type".to_string(),
                json!({ "mime_type": mime_type, "filename": lower_filename.clone() }),
            ));
        }
        AssetType::Ui if !has_extension(&lower_filename, &["png", "jpg", "jpeg", "svg", "psd"]) => {
            findings.push((
                "ui_dimensions".to_string(),
                QaSeverity::Info,
                "UI asset should include source dimensions in metadata or source file naming"
                    .to_string(),
                json!({ "filename": lower_filename.clone() }),
            ));
        }
        AssetType::Code
            if !matches!(
                lower_filename.as_str(),
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
            ) && !lower_filename.starts_with(".env.")
                && !lower_filename.starts_with("dockerfile.")
                && !has_extension(
                    &lower_filename,
                    &[
                        "rs", "py", "ipynb", "js", "jsx", "ts", "tsx", "mjs", "cjs", "java", "kt",
                        "kts", "go", "rb", "php", "cs", "c", "cc", "cpp", "cxx", "h", "hh", "hpp",
                        "hxx", "swift", "scala", "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd",
                        "lua", "r", "sql", "html", "htm", "css", "scss", "sass", "less", "vue",
                        "svelte", "toml", "yaml", "yml", "json", "jsonc", "xml", "graphql", "gql",
                        "proto", "gradle", "cmake", "tf", "tfvars", "sol", "ex", "exs", "erl",
                        "hrl", "clj", "cljs", "dart", "fs", "fsx",
                    ],
                ) =>
        {
            findings.push((
                "code_file_type".to_string(),
                QaSeverity::Info,
                "Code asset uses an uncommon source or config file extension".to_string(),
                json!({ "mime_type": mime_type, "filename": lower_filename.clone() }),
            ));
        }
        _ => {}
    }

    if matches!(asset_type, AssetType::Texture) || matches!(issue_type, IssueType::Texture) {
        let missing_maps = ["normal", "roughness", "metallic"]
            .into_iter()
            .filter(|token| !has_any_token(&lower_filename, &lower_tags, &[*token]))
            .collect::<Vec<_>>();
        if !missing_maps.is_empty() {
            findings.push((
                "texture_map_set".to_string(),
                QaSeverity::Warning,
                "Texture submission may be missing required map variants".to_string(),
                json!({ "missing": missing_maps }),
            ));
        }
    }

    if matches!(issue_type, IssueType::CharacterModel)
        && !has_any_token(&lower_filename, &lower_tags, &["rig", "skeleton", "skel"])
    {
        findings.push((
            "rigging_required".to_string(),
            QaSeverity::Warning,
            "Character model submission has no rigging or skeleton signal".to_string(),
            json!({ "filename": lower_filename.clone() }),
        ));
    }

    if has_any_token(&lower_filename, &lower_tags, &["ai", "prompt", "generated"])
        && !has_any_token(
            &lower_filename,
            &lower_tags,
            &["source", "license", "copyright"],
        )
    {
        findings.push((
            "prompt_source_record".to_string(),
            QaSeverity::Warning,
            "AI generated asset should include source, license, or copyright notes".to_string(),
            json!({ "tags": tags }),
        ));
    }

    if let Some(checksum) = checksum.as_ref() {
        let duplicate_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM assets WHERE checksum_sha256 = $1 AND deleted_at IS NULL",
        )
        .bind(checksum)
        .fetch_one(&mut **tx)
        .await?;
        if duplicate_count > 1 {
            findings.push((
                "duplicate_asset".to_string(),
                QaSeverity::Warning,
                "Another asset already has the same SHA-256 checksum".to_string(),
                json!({ "checksum_sha256": checksum, "count": duplicate_count }),
            ));
        }
    }

    let status = if findings
        .iter()
        .any(|(_, severity, _, _)| matches!(severity, QaSeverity::Error | QaSeverity::Critical))
    {
        AiQaStatus::Failed
    } else if findings
        .iter()
        .any(|(_, severity, _, _)| matches!(severity, QaSeverity::Warning))
    {
        AiQaStatus::Warning
    } else {
        AiQaStatus::Passed
    };

    let report_id: Uuid = sqlx::query_scalar(
        r#"
        INSERT INTO ai_qa_reports (issue_id, asset_id, status, summary)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        "#,
    )
    .bind(issue_id)
    .bind(asset_id)
    .bind(status)
    .bind(format!("{} QA findings", findings.len()))
    .fetch_one(&mut **tx)
    .await?;

    for (rule_code, severity, message, metadata) in findings {
        sqlx::query(
            r#"
            INSERT INTO ai_qa_findings (report_id, rule_code, severity, message, metadata)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(report_id)
        .bind(rule_code)
        .bind(severity)
        .bind(message)
        .bind(metadata)
        .execute(&mut **tx)
        .await?;
    }

    sqlx::query(
        r#"
        UPDATE issues
        SET qa_status = CASE
                WHEN EXISTS (
                    SELECT 1 FROM ai_qa_reports
                    WHERE issue_id = $1 AND status = 'failed'
                ) THEN 'failed'
                WHEN EXISTS (
                    SELECT 1 FROM ai_qa_reports
                    WHERE issue_id = $1 AND status = 'warning'
                ) THEN 'warning'
                WHEN EXISTS (
                    SELECT 1 FROM ai_qa_reports
                    WHERE issue_id = $1 AND status = 'pending'
                ) THEN 'pending'
                ELSE 'passed'
            END,
            version = version + 1,
            updated_at = NOW()
        WHERE id = $1
        "#,
    )
    .bind(issue_id)
    .execute(&mut **tx)
    .await?;

    Ok(())
}

async fn insert_status_history(
    tx: &mut Transaction<'_, Postgres>,
    issue_id: Uuid,
    from_status: Option<IssueStatus>,
    to_status: IssueStatus,
    actor_id: Option<Uuid>,
    actor: &str,
    reason: Option<&str>,
) -> Result<(), AppError> {
    sqlx::query(
        r#"
        INSERT INTO issue_status_history (
            issue_id, from_status, to_status, actor_id, actor, reason
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(issue_id)
    .bind(from_status)
    .bind(to_status)
    .bind(actor_id)
    .bind(actor)
    .bind(reason)
    .execute(&mut **tx)
    .await?;

    Ok(())
}

async fn insert_audit(
    tx: &mut Transaction<'_, Postgres>,
    entity_type: &str,
    entity_id: Uuid,
    action: &str,
    actor_id: Option<Uuid>,
    actor: Option<&str>,
    diff: Value,
) -> Result<(), AppError> {
    sqlx::query(
        r#"
        INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, actor, diff)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(entity_type)
    .bind(entity_id)
    .bind(action)
    .bind(actor_id)
    .bind(actor)
    .bind(diff)
    .execute(&mut **tx)
    .await?;

    Ok(())
}

fn unique_asset_ids(asset_ids: Vec<Uuid>) -> Vec<Uuid> {
    let mut seen = HashSet::new();
    asset_ids
        .into_iter()
        .filter(|asset_id| seen.insert(*asset_id))
        .collect()
}

fn is_clean_asset_name(name: &str) -> bool {
    name.contains('.')
        && name
            .chars()
            .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || matches!(c, '_' | '-' | '.'))
}

fn has_extension(filename: &str, allowed_extensions: &[&str]) -> bool {
    allowed_extensions
        .iter()
        .any(|extension| filename.ends_with(&format!(".{}", extension)))
}

fn has_any_token(filename: &str, tags: &str, tokens: &[&str]) -> bool {
    tokens
        .iter()
        .any(|token| filename.contains(token) || tags.contains(token))
}

fn default_workspace_id() -> Uuid {
    Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()
}

fn default_project_id() -> Uuid {
    Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()
}
