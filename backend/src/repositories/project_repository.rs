use sqlx::PgPool;
use uuid::Uuid;

use crate::{errors::AppError, models::project::Project};

#[allow(dead_code)]
pub struct ProjectRepository {
    pool: PgPool,
}

#[allow(dead_code)]
impl ProjectRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn list_active(&self) -> Result<Vec<Project>, AppError> {
        sqlx::query_as::<_, Project>(
            "SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY name ASC",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)
    }

    pub async fn find_by_id(&self, id: Uuid) -> Result<Project, AppError> {
        sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or_else(|| AppError::not_found(format!("Project {} not found", id)))
    }
}
