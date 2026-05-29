/*
```cypher
CREATE
  (f:File {name: "resource_lock_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::resource_lock_service", type: "module"}),
  (c1:Class {name: "ResourceLockService", type: "class", language: "rust", signature: "struct ResourceLockService"}),
  (c2:Class {name: "LockSessionRow", type: "class", language: "rust", signature: "struct LockSessionRow"}),
  (fn1:Function {name: "ResourceLockService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "ResourceLockService::acquire", type: "function", language: "rust", signature: "pub async fn acquire(&self, req: &HttpRequest, body: AcquireLockRequest) -> Result<ResourceLock, AppError>"}),
  (fn3:Function {name: "ResourceLockService::renew", type: "function", language: "rust", signature: "pub async fn renew(&self, req: &HttpRequest, body: RenewLockRequest) -> Result<ResourceLock, AppError>"}),
  (fn4:Function {name: "ResourceLockService::release", type: "function", language: "rust", signature: "pub async fn release(&self, req: &HttpRequest, body: ReleaseLockRequest) -> Result<ResourceLock, AppError>"}),
  (fn5:Function {name: "ResourceLockService::current", type: "function", language: "rust", signature: "pub async fn current(&self, resource_type: &str, resource_id: Uuid) -> Result<Option<ResourceLock>, AppError>"}),
  (fn6:Function {name: "ResourceLockService::ensure_write_allowed", type: "function", language: "rust", signature: "pub async fn ensure_write_allowed(&self, req: &HttpRequest, resource_type: &str, resource_id: Uuid) -> Result<(), AppError>"}),
  (fn7:Function {name: "active_lock", type: "function", language: "rust", signature: "async fn active_lock(pool: &PgPool, resource_type: &str, resource_id: Uuid) -> Result<Option<ResourceLock>, AppError>"}),
  (fn8:Function {name: "lock_by_hash", type: "function", language: "rust", signature: "async fn lock_by_hash(pool: &PgPool, lock_token_hash: &str, revealed_lock_token: Option<&str>) -> Result<ResourceLock, AppError>"}),
  (fn9:Function {name: "active_lock_token_matches", type: "function", language: "rust", signature: "async fn active_lock_token_matches(pool: &PgPool, lock_id: Uuid, lock_token_hash: &str) -> Result<bool, AppError>"}),
  (fn10:Function {name: "cleanup_expired", type: "function", language: "rust", signature: "async fn cleanup_expired(pool: &PgPool) -> Result<(), AppError>"}),
  (fn11:Function {name: "normalize_resource_type", type: "function", language: "rust", signature: "fn normalize_resource_type(value: &str) -> Result<String, AppError>"}),
  (fn12:Function {name: "lock_ttl_seconds", type: "function", language: "rust", signature: "fn lock_ttl_seconds(value: Option<i64>) -> i64"}),
  (fn13:Function {name: "generate_lock_token", type: "function", language: "rust", signature: "fn generate_lock_token() -> String"}),
  (fn14:Function {name: "is_unique_violation", type: "function", language: "rust", signature: "fn is_unique_violation(error: &sqlx::Error) -> bool"}),
  (fn15:Function {name: "lock_token_from_headers", type: "function", language: "rust", signature: "fn lock_token_from_headers(req: &HttpRequest) -> Option<String>"}),
  (fn16:Function {name: "lock_conflict", type: "function", language: "rust", signature: "fn lock_conflict(lock: &ResourceLock) -> AppError"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "context", type: "variable"}),
  (v3:Variable {name: "lock_token_hash", type: "variable"}),
  (v4:Variable {name: "lock", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn11),
  (fn2)-[:CALLS]->(fn12),
  (fn2)-[:CALLS]->(fn13),
  (fn2)-[:CALLS]->(fn8),
  (fn2)-[:CALLS]->(fn9),
  (fn2)-[:CALLS]->(fn14),
  (fn2)-[:CALLS]->(fn15),
  (fn2)-[:CALLS]->(fn16),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn10),
  (fn3)-[:CALLS]->(fn8),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn4)-[:CALLS]->(fn10),
  (fn4)-[:CALLS]->(fn8),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn5)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn11),
  (fn5)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn10),
  (fn6)-[:CALLS]->(fn11),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn9),
  (fn6)-[:CALLS]->(fn15),
  (fn6)-[:CALLS]->(fn16),
  (fn6)-[:USES]->(v3),
  (fn6)-[:USES]->(v4);
```
*/

use actix_web::HttpRequest;
use chrono::{Duration, Utc};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::auth::{AcquireLockRequest, ReleaseLockRequest, RenewLockRequest, ResourceLock},
    services::auth_service::{
        authenticate_token_hash, bearer_token_from_headers, hash_secret,
        optional_bearer_token_from_headers,
    },
};

const DEFAULT_LOCK_TTL_SECONDS: i64 = 300;
const MIN_LOCK_TTL_SECONDS: i64 = 30;
const MAX_LOCK_TTL_SECONDS: i64 = 3600;

#[derive(Clone)]
pub struct ResourceLockService {
    pool: PgPool,
}

#[derive(Debug, FromRow)]
struct LockSessionRow {
    session_id: Uuid,
}

impl ResourceLockService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn acquire(
        &self,
        req: &HttpRequest,
        body: AcquireLockRequest,
    ) -> Result<ResourceLock, AppError> {
        let token = bearer_token_from_headers(req.headers())?;
        let token_hash = hash_secret(&token);
        let context = authenticate_token_hash(&self.pool, &token_hash).await?;
        let resource_type = normalize_resource_type(&body.resource_type)?;
        let ttl_seconds = lock_ttl_seconds(body.ttl_seconds);
        let expires_at = Utc::now() + Duration::seconds(ttl_seconds);

        cleanup_expired(&self.pool, &resource_type, body.resource_id).await?;
        if let Some(lock) = active_lock(&self.pool, &resource_type, body.resource_id).await? {
            if lock.session_id == context.session_id {
                sqlx::query(
                    r#"
                    UPDATE resource_locks
                    SET expires_at = $1, purpose = COALESCE($2, purpose)
                    WHERE id = $3
                    "#,
                )
                .bind(expires_at)
                .bind(body.purpose)
                .bind(lock.id)
                .execute(&self.pool)
                .await?;

                if let Some(lock_token) = match lock_token_from_headers(req) {
                    Some(lock_token) => {
                        let lock_token_hash = hash_secret(&lock_token);
                        active_lock_token_matches(&self.pool, lock.id, &lock_token_hash)
                            .await?
                            .then_some(lock_token)
                    }
                    None => None,
                } {
                    let lock_token_hash = hash_secret(&lock_token);
                    return lock_by_hash(&self.pool, &lock_token_hash, Some(&lock_token)).await;
                }
                return Ok(lock);
            }
            return Err(lock_conflict(&lock));
        }

        let lock_token = generate_lock_token();
        let lock_token_hash = hash_secret(&lock_token);
        let inserted = sqlx::query_as::<_, ResourceLock>(
            r#"
            INSERT INTO resource_locks (
                resource_type, resource_id, holder_user_id, session_id, lock_token_hash, purpose, expires_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id, resource_type, resource_id, holder_user_id,
                (SELECT username FROM users WHERE id = holder_user_id) AS holder_username,
                (SELECT display_name FROM users WHERE id = holder_user_id) AS holder_display_name,
                session_id, ''::TEXT AS lock_token, purpose, expires_at, released_at, created_at, updated_at
            "#,
        )
        .bind(&resource_type)
        .bind(body.resource_id)
        .bind(context.user.id)
        .bind(context.session_id)
        .bind(&lock_token_hash)
        .bind(body.purpose)
        .bind(expires_at)
        .fetch_one(&self.pool)
        .await;

        match inserted {
            Ok(mut lock) => {
                lock.lock_token = lock_token;
                Ok(lock)
            }
            Err(error) if is_unique_violation(&error) => {
                let lock = active_lock(&self.pool, &resource_type, body.resource_id).await?;
                Err(lock.map_or_else(
                    || AppError::conflict("Resource lock was acquired by another session"),
                    |lock| lock_conflict(&lock),
                ))
            }
            Err(error) => Err(error.into()),
        }
    }

    pub async fn renew(
        &self,
        req: &HttpRequest,
        body: RenewLockRequest,
    ) -> Result<ResourceLock, AppError> {
        let token = bearer_token_from_headers(req.headers())?;
        let token_hash = hash_secret(&token);
        let context = authenticate_token_hash(&self.pool, &token_hash).await?;
        let ttl_seconds = lock_ttl_seconds(body.ttl_seconds);
        let expires_at = Utc::now() + Duration::seconds(ttl_seconds);
        let lock_token_hash = hash_secret(&body.lock_token);

        let result = sqlx::query(
            r#"
            UPDATE resource_locks
            SET expires_at = $1
            WHERE lock_token_hash = $2
              AND session_id = $3
              AND released_at IS NULL
              AND expires_at > NOW()
            "#,
        )
        .bind(expires_at)
        .bind(&lock_token_hash)
        .bind(context.session_id)
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::conflict(
                "Lock can only be renewed by its owning active session",
            ));
        }

        lock_by_hash(&self.pool, &lock_token_hash, Some(&body.lock_token)).await
    }

    pub async fn release(
        &self,
        req: &HttpRequest,
        body: ReleaseLockRequest,
    ) -> Result<ResourceLock, AppError> {
        let token = bearer_token_from_headers(req.headers())?;
        let token_hash = hash_secret(&token);
        let context = authenticate_token_hash(&self.pool, &token_hash).await?;
        let lock_token_hash = hash_secret(&body.lock_token);

        let result = sqlx::query(
            r#"
            UPDATE resource_locks
            SET released_at = NOW()
            WHERE lock_token_hash = $1 AND session_id = $2 AND released_at IS NULL
            "#,
        )
        .bind(&lock_token_hash)
        .bind(context.session_id)
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::conflict(
                "Lock can only be released by its owning active session",
            ));
        }

        lock_by_hash(&self.pool, &lock_token_hash, Some(&body.lock_token)).await
    }

    pub async fn current(
        &self,
        resource_type: &str,
        resource_id: Uuid,
    ) -> Result<Option<ResourceLock>, AppError> {
        let resource_type = normalize_resource_type(resource_type)?;
        cleanup_expired(&self.pool, &resource_type, resource_id).await?;
        active_lock(&self.pool, &resource_type, resource_id).await
    }

    pub async fn ensure_write_allowed(
        &self,
        req: &HttpRequest,
        resource_type: &str,
        resource_id: Uuid,
    ) -> Result<(), AppError> {
        let resource_type = normalize_resource_type(resource_type)?;
        cleanup_expired(&self.pool, &resource_type, resource_id).await?;
        let Some(lock) = active_lock(&self.pool, &resource_type, resource_id).await? else {
            if strict_write_locks_enabled() {
                return Err(AppError::conflict(
                    "Resource must be locked before write in strict lock mode",
                ));
            }
            return Ok(());
        };

        let lock_token = lock_token_from_headers(req).ok_or_else(|| lock_conflict(&lock))?;
        let lock_token_hash = hash_secret(&lock_token);
        if !active_lock_token_matches(&self.pool, lock.id, &lock_token_hash).await? {
            return Err(lock_conflict(&lock));
        }

        let Some(session_token) = optional_bearer_token_from_headers(req.headers()) else {
            return Err(lock_conflict(&lock));
        };
        let token_hash = hash_secret(&session_token);
        let session = sqlx::query_as::<_, LockSessionRow>(
            r#"
            SELECT id AS session_id
            FROM user_sessions
            WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()
            "#,
        )
        .bind(token_hash)
        .fetch_optional(&self.pool)
        .await?;

        if session
            .map(|row| row.session_id == lock.session_id)
            .unwrap_or(false)
        {
            Ok(())
        } else {
            Err(lock_conflict(&lock))
        }
    }
}

async fn active_lock(
    pool: &PgPool,
    resource_type: &str,
    resource_id: Uuid,
) -> Result<Option<ResourceLock>, AppError> {
    let lock = sqlx::query_as::<_, ResourceLock>(
        r#"
        SELECT
            rl.id,
            rl.resource_type,
            rl.resource_id,
            rl.holder_user_id,
            u.username AS holder_username,
            u.display_name AS holder_display_name,
            rl.session_id,
            ''::TEXT AS lock_token,
            rl.purpose,
            rl.expires_at,
            rl.released_at,
            rl.created_at,
            rl.updated_at
        FROM resource_locks rl
        JOIN users u ON u.id = rl.holder_user_id
        WHERE rl.resource_type = $1
          AND rl.resource_id = $2
          AND rl.released_at IS NULL
          AND rl.expires_at > NOW()
        ORDER BY rl.created_at ASC
        LIMIT 1
        "#,
    )
    .bind(resource_type)
    .bind(resource_id)
    .fetch_optional(pool)
    .await?;
    Ok(lock)
}

async fn lock_by_hash(
    pool: &PgPool,
    lock_token_hash: &str,
    revealed_lock_token: Option<&str>,
) -> Result<ResourceLock, AppError> {
    let mut lock = sqlx::query_as::<_, ResourceLock>(
        r#"
        SELECT
            rl.id,
            rl.resource_type,
            rl.resource_id,
            rl.holder_user_id,
            u.username AS holder_username,
            u.display_name AS holder_display_name,
            rl.session_id,
            ''::TEXT AS lock_token,
            rl.purpose,
            rl.expires_at,
            rl.released_at,
            rl.created_at,
            rl.updated_at
        FROM resource_locks rl
        JOIN users u ON u.id = rl.holder_user_id
        WHERE rl.lock_token_hash = $1
        "#,
    )
    .bind(lock_token_hash)
    .fetch_one(pool)
    .await?;

    if let Some(lock_token) = revealed_lock_token {
        lock.lock_token = lock_token.to_string();
    }

    Ok(lock)
}

async fn active_lock_token_matches(
    pool: &PgPool,
    lock_id: Uuid,
    lock_token_hash: &str,
) -> Result<bool, AppError> {
    let matches = sqlx::query_scalar::<_, bool>(
        r#"
        SELECT EXISTS (
            SELECT 1
            FROM resource_locks
            WHERE id = $1
              AND lock_token_hash = $2
              AND released_at IS NULL
              AND expires_at > NOW()
        )
        "#,
    )
    .bind(lock_id)
    .bind(lock_token_hash)
    .fetch_one(pool)
    .await?;
    Ok(matches)
}

async fn cleanup_expired(
    pool: &PgPool,
    resource_type: &str,
    resource_id: Uuid,
) -> Result<(), AppError> {
    sqlx::query(
        r#"
        UPDATE resource_locks
        SET released_at = NOW()
        WHERE resource_type = $1
          AND resource_id = $2
          AND released_at IS NULL
          AND expires_at <= NOW()
        "#,
    )
    .bind(resource_type)
    .bind(resource_id)
    .execute(pool)
    .await?;
    Ok(())
}

fn strict_write_locks_enabled() -> bool {
    std::env::var("RESOURCE_LOCK_STRICT_WRITES")
        .map(|value| matches!(value.as_str(), "1" | "true" | "TRUE" | "yes" | "on"))
        .unwrap_or(false)
}

fn normalize_resource_type(value: &str) -> Result<String, AppError> {
    let normalized = value.trim().to_ascii_lowercase().replace('_', "-");
    match normalized.as_str() {
        "issue" | "asset" | "delivery-package" | "project" => Ok(normalized.replace('-', "_")),
        _ => Err(AppError::validation(
            "resource_type must be issue, asset, delivery_package, or project",
        )),
    }
}

fn lock_ttl_seconds(value: Option<i64>) -> i64 {
    value
        .unwrap_or(DEFAULT_LOCK_TTL_SECONDS)
        .clamp(MIN_LOCK_TTL_SECONDS, MAX_LOCK_TTL_SECONDS)
}

fn generate_lock_token() -> String {
    format!(
        "lock_{}_{}",
        Uuid::new_v4().simple(),
        Uuid::new_v4().simple()
    )
}

fn is_unique_violation(error: &sqlx::Error) -> bool {
    matches!(
        error,
        sqlx::Error::Database(db_error) if db_error.code().as_deref() == Some("23505")
    )
}

fn lock_token_from_headers(req: &HttpRequest) -> Option<String> {
    let value = req
        .headers()
        .get("x-assetslake-lock-token")?
        .to_str()
        .ok()?;
    let value = value.trim();
    (!value.is_empty()).then(|| value.to_string())
}

fn lock_conflict(lock: &ResourceLock) -> AppError {
    let owner = lock
        .holder_display_name
        .clone()
        .unwrap_or_else(|| lock.holder_username.clone());
    AppError::conflict(format!(
        "{} {} is locked by {} until {}",
        lock.resource_type, lock.resource_id, owner, lock.expires_at
    ))
}
