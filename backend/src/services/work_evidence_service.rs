/*
```cypher
CREATE
  (f:File {name: "work_evidence_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::work_evidence_service", type: "module"}),
  (c1:Class {name: "WorkEvidenceService", type: "class", language: "rust"}),
  (c2:Class {name: "WorkEvidenceRow", type: "class", language: "rust"}),
  (fn1:Function {name: "WorkEvidenceService::new", type: "function", language: "rust"}),
  (fn2:Function {name: "WorkEvidenceIf::summarize_employee_work", type: "function", language: "rust"}),
  (fn3:Function {name: "to_i32", type: "function", language: "rust", signature: "fn to_i32(value: i64) -> i32"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn2)-[:CALLS]->(fn3);
```
*/

use chrono::{DateTime, Utc};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError, interfaces::work_evidence_if::WorkEvidenceIf,
    models::people_intelligence::WorkEvidenceSummary,
};

#[derive(Clone)]
pub struct WorkEvidenceService {
    pool: PgPool,
}

#[derive(FromRow)]
struct WorkEvidenceRow {
    completed_issues: i64,
    project_count: i64,
    on_time_issues: i64,
    first_pass_approved: i64,
    qa_passed: i64,
    revision_count: i64,
    review_completed: i64,
    delivery_count: i64,
    work_log_count: i64,
    estimated_story_points: f64,
    logged_minutes: i64,
    evidence_from: Option<DateTime<Utc>>,
    evidence_to: Option<DateTime<Utc>>,
}

impl WorkEvidenceService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl WorkEvidenceIf for WorkEvidenceService {
    async fn summarize_employee_work(
        &self,
        employee_id: Uuid,
        window_days: i32,
    ) -> Result<WorkEvidenceSummary, AppError> {
        let window_days = window_days.clamp(1, 3650);
        let row = sqlx::query_as::<_, WorkEvidenceRow>(
            r#"
            WITH scoped_issues AS (
                SELECT DISTINCT issue.*
                FROM issues issue
                LEFT JOIN issue_assignments assignment
                  ON assignment.issue_id = issue.id
                 AND assignment.user_id = $1
                 AND assignment.active = TRUE
                WHERE issue.deleted_at IS NULL
                  AND (issue.assignee_id = $1 OR assignment.user_id = $1)
                  AND issue.updated_at >= NOW() - make_interval(days => $2)
            ), completed AS (
                SELECT * FROM scoped_issues
                WHERE status::text IN ('approved', 'delivered', 'archived')
            )
            SELECT
                (SELECT COUNT(*) FROM completed)::BIGINT AS completed_issues,
                (SELECT COUNT(DISTINCT project_id) FROM completed)::BIGINT AS project_count,
                (SELECT COUNT(*) FROM completed
                  WHERE due_date IS NULL OR updated_at::date <= due_date)::BIGINT AS on_time_issues,
                (SELECT COUNT(*) FROM completed WHERE revision_count = 0)::BIGINT AS first_pass_approved,
                (SELECT COUNT(*) FROM completed WHERE qa_status::text = 'passed')::BIGINT AS qa_passed,
                COALESCE((SELECT SUM(revision_count) FROM scoped_issues), 0)::BIGINT AS revision_count,
                (SELECT COUNT(*) FROM review_rounds review
                  WHERE review.reviewer_id = $1
                    AND review.completed_at >= NOW() - make_interval(days => $2))::BIGINT AS review_completed,
                (SELECT COUNT(DISTINCT package.id)
                   FROM delivery_packages package
                   LEFT JOIN delivery_package_assets item ON item.package_id = package.id
                  WHERE (package.submitted_by = $1 OR item.included_by = $1)
                    AND COALESCE(package.submitted_at, package.created_at) >= NOW() - make_interval(days => $2))::BIGINT AS delivery_count,
                (SELECT COUNT(*) FROM issue_work_logs log
                  WHERE log.author_id = $1
                    AND log.started_at >= NOW() - make_interval(days => $2))::BIGINT AS work_log_count,
                COALESCE((SELECT SUM(story_points::double precision) FROM scoped_issues), 0)::double precision AS estimated_story_points,
                COALESCE((SELECT SUM(time_spent_minutes) FROM issue_work_logs log
                  WHERE log.author_id = $1
                    AND log.started_at >= NOW() - make_interval(days => $2)), 0)::BIGINT AS logged_minutes,
                (SELECT MIN(updated_at) FROM scoped_issues) AS evidence_from,
                (SELECT MAX(updated_at) FROM scoped_issues) AS evidence_to
            "#,
        )
        .bind(employee_id)
        .bind(window_days)
        .fetch_one(&self.pool)
        .await?;

        Ok(WorkEvidenceSummary {
            window_days,
            completed_issues: to_i32(row.completed_issues),
            project_count: to_i32(row.project_count),
            on_time_issues: to_i32(row.on_time_issues),
            first_pass_approved: to_i32(row.first_pass_approved),
            qa_passed: to_i32(row.qa_passed),
            revision_count: to_i32(row.revision_count),
            review_completed: to_i32(row.review_completed),
            delivery_count: to_i32(row.delivery_count),
            work_log_count: to_i32(row.work_log_count),
            estimated_story_points: row.estimated_story_points,
            logged_minutes: row.logged_minutes,
            evidence_from: row.evidence_from,
            evidence_to: row.evidence_to,
        })
    }
}

fn to_i32(value: i64) -> i32 {
    value.clamp(i32::MIN as i64, i32::MAX as i64) as i32
}
