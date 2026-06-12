/*
```cypher
CREATE
  (f:File {name: "wiki_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::wiki_service", type: "module"}),
  (c1:Class {name: "WikiService", type: "class", language: "rust", signature: "struct WikiService"}),
  (fn1:Function {name: "WikiService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "WikiIf::list_spaces", type: "function", language: "rust"}),
  (fn3:Function {name: "WikiIf::create_space", type: "function", language: "rust"}),
  (fn4:Function {name: "WikiIf::list_pages", type: "function", language: "rust"}),
  (fn5:Function {name: "WikiIf::create_page", type: "function", language: "rust"}),
  (fn6:Function {name: "WikiIf::get_page", type: "function", language: "rust"}),
  (fn7:Function {name: "WikiIf::apply_update", type: "function", language: "rust"}),
  (fn8:Function {name: "WikiIf::sync_page", type: "function", language: "rust"}),
  (fn9:Function {name: "WikiIf::touch_presence", type: "function", language: "rust"}),
  (fn10:Function {name: "validate_slug", type: "function", language: "rust", signature: "fn validate_slug(slug: &str) -> Result<String, AppError>"}),
  (fn11:Function {name: "transform_patch", type: "function", language: "rust", signature: "fn transform_patch(incoming: &mut TextPatch, applied: &TextPatch) -> Result<(), AppError>"}),
  (fn12:Function {name: "apply_patch", type: "function", language: "rust", signature: "fn apply_patch(content: &str, patch: &TextPatch) -> Result<String, AppError>"}),
  (fn13:Function {name: "active_presence", type: "function", language: "rust", signature: "async fn active_presence(pool: &PgPool, page_id: Uuid) -> Result<Vec<WikiPresence>, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (fn3)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn10),
  (fn7)-[:CALLS]->(fn11),
  (fn7)-[:CALLS]->(fn12),
  (fn8)-[:CALLS]->(fn6),
  (fn8)-[:CALLS]->(fn13),
  (fn9)-[:CALLS]->(fn13);
```
*/

use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::{wiki_if::WikiIf, AppActor},
    models::wiki::{
        ApplyWikiUpdateRequest, CreateWikiPageRequest, CreateWikiSpaceRequest, TextPatch, WikiPage,
        WikiPageUpdate, WikiPresence, WikiPresenceRequest, WikiSpace, WikiSyncSnapshot,
    },
};

#[derive(Clone)]
pub struct WikiService {
    pool: PgPool,
}

impl WikiService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl WikiIf for WikiService {
    async fn list_spaces(&self, workspace_id: Uuid) -> Result<Vec<WikiSpace>, AppError> {
        Ok(sqlx::query_as::<_, WikiSpace>(
            r#"
            SELECT id, workspace_id, name, slug, description, created_by, created_by_name,
                   created_at, updated_at
            FROM wiki_spaces
            WHERE workspace_id = $1
            ORDER BY updated_at DESC
            "#,
        )
        .bind(workspace_id)
        .fetch_all(&self.pool)
        .await?)
    }

    async fn create_space(
        &self,
        actor: &AppActor,
        request: CreateWikiSpaceRequest,
    ) -> Result<WikiSpace, AppError> {
        let name = request.name.trim();
        if name.is_empty() {
            return Err(AppError::validation("Wiki space name is required"));
        }
        let slug = validate_slug(&request.slug)?;
        Ok(sqlx::query_as::<_, WikiSpace>(
            r#"
            INSERT INTO wiki_spaces (
                id, workspace_id, name, slug, description, created_by, created_by_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, workspace_id, name, slug, description, created_by, created_by_name,
                      created_at, updated_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(request.workspace_id)
        .bind(name)
        .bind(slug)
        .bind(request.description.map(|value| value.trim().to_string()))
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .fetch_one(&self.pool)
        .await?)
    }

    async fn list_pages(&self, space_id: Uuid) -> Result<Vec<WikiPage>, AppError> {
        Ok(sqlx::query_as::<_, WikiPage>(
            r#"
            SELECT id, workspace_id, space_id, parent_id, title, slug, content_markdown,
                   version, created_by, created_by_name, updated_by, updated_by_name,
                   created_at, updated_at
            FROM wiki_pages
            WHERE space_id = $1 AND deleted_at IS NULL
            ORDER BY updated_at DESC
            "#,
        )
        .bind(space_id)
        .fetch_all(&self.pool)
        .await?)
    }

    async fn create_page(
        &self,
        actor: &AppActor,
        request: CreateWikiPageRequest,
    ) -> Result<WikiPage, AppError> {
        let title = request.title.trim();
        if title.is_empty() {
            return Err(AppError::validation("Wiki page title is required"));
        }
        let slug = validate_slug(&request.slug)?;
        Ok(sqlx::query_as::<_, WikiPage>(
            r#"
            INSERT INTO wiki_pages (
                id, workspace_id, space_id, parent_id, title, slug, content_markdown,
                created_by, created_by_name, updated_by, updated_by_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $8, $9)
            RETURNING id, workspace_id, space_id, parent_id, title, slug, content_markdown,
                      version, created_by, created_by_name, updated_by, updated_by_name,
                      created_at, updated_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(request.workspace_id)
        .bind(request.space_id)
        .bind(request.parent_id)
        .bind(title)
        .bind(slug)
        .bind(request.content_markdown.unwrap_or_default())
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .fetch_one(&self.pool)
        .await?)
    }

    async fn get_page(&self, page_id: Uuid) -> Result<WikiPage, AppError> {
        sqlx::query_as::<_, WikiPage>(
            r#"
            SELECT id, workspace_id, space_id, parent_id, title, slug, content_markdown,
                   version, created_by, created_by_name, updated_by, updated_by_name,
                   created_at, updated_at
            FROM wiki_pages
            WHERE id = $1 AND deleted_at IS NULL
            "#,
        )
        .bind(page_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Wiki page {} not found", page_id)))
    }

    async fn apply_update(
        &self,
        actor: &AppActor,
        page_id: Uuid,
        request: ApplyWikiUpdateRequest,
    ) -> Result<WikiPageUpdate, AppError> {
        if request.client_id.trim().is_empty() {
            return Err(AppError::validation("Wiki client_id is required"));
        }

        let mut transaction = self.pool.begin().await?;
        let page = sqlx::query_as::<_, WikiPage>(
            r#"
            SELECT id, workspace_id, space_id, parent_id, title, slug, content_markdown,
                   version, created_by, created_by_name, updated_by, updated_by_name,
                   created_at, updated_at
            FROM wiki_pages
            WHERE id = $1 AND deleted_at IS NULL
            FOR UPDATE
            "#,
        )
        .bind(page_id)
        .fetch_optional(&mut *transaction)
        .await?
        .ok_or_else(|| AppError::not_found(format!("Wiki page {} not found", page_id)))?;

        if request.base_version < 1 || request.base_version > page.version {
            return Err(AppError::conflict(format!(
                "Wiki base version {} is not valid for current version {}",
                request.base_version, page.version
            )));
        }

        let mut patch = request.patch;
        let applied_patches = sqlx::query_scalar::<_, serde_json::Value>(
            r#"
            SELECT patch
            FROM wiki_page_updates
            WHERE page_id = $1 AND version > $2
            ORDER BY version ASC
            "#,
        )
        .bind(page_id)
        .bind(request.base_version)
        .fetch_all(&mut *transaction)
        .await?;

        for value in applied_patches {
            let applied: TextPatch = serde_json::from_value(value)
                .map_err(|error| AppError::internal(error.to_string()))?;
            transform_patch(&mut patch, &applied)?;
        }

        let content_markdown = apply_patch(&page.content_markdown, &patch)?;
        let next_version = page.version + 1;
        let update = sqlx::query_as::<_, WikiPageUpdate>(
            r#"
            INSERT INTO wiki_page_updates (
                id, page_id, client_id, base_version, version, patch, content_markdown,
                created_by, created_by_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, page_id, client_id, base_version, version, patch, content_markdown,
                      created_by, created_by_name, created_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(page_id)
        .bind(request.client_id.trim())
        .bind(request.base_version)
        .bind(next_version)
        .bind(serde_json::to_value(&patch).map_err(|error| AppError::internal(error.to_string()))?)
        .bind(&content_markdown)
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .fetch_one(&mut *transaction)
        .await?;

        sqlx::query(
            r#"
            UPDATE wiki_pages
            SET content_markdown = $2, version = $3, updated_by = $4, updated_by_name = $5
            WHERE id = $1
            "#,
        )
        .bind(page_id)
        .bind(content_markdown)
        .bind(next_version)
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .execute(&mut *transaction)
        .await?;

        transaction.commit().await?;
        Ok(update)
    }

    async fn sync_page(
        &self,
        page_id: Uuid,
        after_version: i64,
    ) -> Result<WikiSyncSnapshot, AppError> {
        let page = self.get_page(page_id).await?;
        let updates = sqlx::query_as::<_, WikiPageUpdate>(
            r#"
            SELECT id, page_id, client_id, base_version, version, patch, content_markdown,
                   created_by, created_by_name, created_at
            FROM wiki_page_updates
            WHERE page_id = $1 AND version > $2
            ORDER BY version ASC
            LIMIT 200
            "#,
        )
        .bind(page_id)
        .bind(after_version.max(0))
        .fetch_all(&self.pool)
        .await?;
        let collaborators = active_presence(&self.pool, page_id).await?;
        Ok(WikiSyncSnapshot {
            page,
            updates,
            collaborators,
        })
    }

    async fn touch_presence(
        &self,
        actor: &AppActor,
        page_id: Uuid,
        request: WikiPresenceRequest,
    ) -> Result<Vec<WikiPresence>, AppError> {
        if request.client_id.trim().is_empty() {
            return Err(AppError::validation("Wiki client_id is required"));
        }
        self.get_page(page_id).await?;
        sqlx::query(
            r#"
            INSERT INTO wiki_presence (
                page_id, client_id, user_id, display_name, cursor_anchor, cursor_head, last_seen_at
            ) VALUES ($1, $2, $3, $4, $5, $6, now())
            ON CONFLICT (page_id, client_id) DO UPDATE SET
                user_id = EXCLUDED.user_id,
                display_name = EXCLUDED.display_name,
                cursor_anchor = EXCLUDED.cursor_anchor,
                cursor_head = EXCLUDED.cursor_head,
                last_seen_at = now()
            "#,
        )
        .bind(page_id)
        .bind(request.client_id.trim())
        .bind(actor.user_id)
        .bind(&actor.display_name)
        .bind(request.cursor_anchor)
        .bind(request.cursor_head)
        .execute(&self.pool)
        .await?;
        active_presence(&self.pool, page_id).await
    }
}

fn validate_slug(slug: &str) -> Result<String, AppError> {
    let normalized = slug.trim().to_ascii_lowercase();
    if normalized.is_empty()
        || normalized.len() > 120
        || !normalized
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || character == '-')
    {
        return Err(AppError::validation(
            "Slug must contain only lowercase letters, numbers, and hyphens",
        ));
    }
    Ok(normalized)
}

fn transform_patch(incoming: &mut TextPatch, applied: &TextPatch) -> Result<(), AppError> {
    if applied.to <= incoming.from {
        let removed = applied.to.saturating_sub(applied.from);
        let inserted = applied.insert.chars().count();
        let delta = inserted as isize - removed as isize;
        incoming.from = incoming.from.saturating_add_signed(delta);
        incoming.to = incoming.to.saturating_add_signed(delta);
        return Ok(());
    }
    if incoming.to <= applied.from {
        return Ok(());
    }
    Err(AppError::conflict(
        "Concurrent edits overlap; refresh the page and reapply the local change",
    ))
}

fn apply_patch(content: &str, patch: &TextPatch) -> Result<String, AppError> {
    let mut characters: Vec<char> = content.chars().collect();
    if patch.from > patch.to || patch.to > characters.len() {
        return Err(AppError::validation("Wiki text patch range is invalid"));
    }
    characters.splice(patch.from..patch.to, patch.insert.chars());
    Ok(characters.into_iter().collect())
}

async fn active_presence(pool: &PgPool, page_id: Uuid) -> Result<Vec<WikiPresence>, AppError> {
    sqlx::query("DELETE FROM wiki_presence WHERE last_seen_at < now() - interval '45 seconds'")
        .execute(pool)
        .await?;
    Ok(sqlx::query_as::<_, WikiPresence>(
        r#"
        SELECT page_id, client_id, user_id, display_name, cursor_anchor, cursor_head, last_seen_at
        FROM wiki_presence
        WHERE page_id = $1
        ORDER BY display_name ASC, client_id ASC
        "#,
    )
    .bind(page_id)
    .fetch_all(pool)
    .await?)
}
