/*
```cypher
CREATE
  (f:File {name: "maintenance_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::maintenance_service", type: "module"}),
  (c1:Class {name: "MaintenanceService", type: "class", language: "rust", signature: "struct MaintenanceService"}),
  (c2:Class {name: "MaintenanceConfig", type: "class", language: "rust", signature: "struct MaintenanceConfig"}),
  (fn1:Function {name: "MaintenanceService::spawn", type: "function", language: "rust", signature: "pub fn spawn(pool: PgPool, config: MaintenanceConfig)"}),
  (fn2:Function {name: "MaintenanceService::run_once", type: "function", language: "rust", signature: "pub async fn run_once(pool: &PgPool, config: &MaintenanceConfig) -> Result<MaintenanceReport, AppError>"}),
  (fn3:Function {name: "MaintenanceConfig::from_env", type: "function", language: "rust", signature: "pub fn from_env() -> Self"}),
  (fn4:Function {name: "cleanup_expired_locks", type: "function", language: "rust", signature: "async fn cleanup_expired_locks(pool: &PgPool) -> Result<u64, AppError>"}),
  (fn5:Function {name: "delete_old_released_locks", type: "function", language: "rust", signature: "async fn delete_old_released_locks(pool: &PgPool, retention_hours: i64) -> Result<u64, AppError>"}),
  (fn6:Function {name: "delete_old_sessions", type: "function", language: "rust", signature: "async fn delete_old_sessions(pool: &PgPool, retention_hours: i64) -> Result<u64, AppError>"}),
  (fn7:Function {name: "delete_old_verification_outbox", type: "function", language: "rust", signature: "async fn delete_old_verification_outbox(pool: &PgPool, retention_hours: i64) -> Result<u64, AppError>"}),
  (fn8:Function {name: "env_bool", type: "function", language: "rust", signature: "fn env_bool(key: &str, default: bool) -> bool"}),
  (fn9:Function {name: "env_i64", type: "function", language: "rust", signature: "fn env_i64(key: &str, default: i64) -> i64"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c2)-[:HAS_METHOD]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (fn1)-[:CALLS]->(fn2),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:CALLS]->(fn7),
  (fn3)-[:CALLS]->(fn8),
  (fn3)-[:CALLS]->(fn9),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2);
```
*/

use std::{env, time::Duration};

use serde::Serialize;
use sqlx::PgPool;
use tokio::time::sleep;

use crate::errors::AppError;

pub struct MaintenanceService;

#[derive(Debug, Clone)]
pub struct MaintenanceConfig {
    pub enabled: bool,
    pub interval_seconds: u64,
    pub session_retention_hours: i64,
    pub released_lock_retention_hours: i64,
    pub verification_outbox_retention_hours: i64,
}

#[derive(Debug, Clone, Serialize)]
pub struct MaintenanceReport {
    pub expired_locks_released: u64,
    pub old_released_locks_deleted: u64,
    pub old_sessions_deleted: u64,
    pub old_verification_outbox_deleted: u64,
}

impl MaintenanceService {
    pub fn spawn(pool: PgPool, config: MaintenanceConfig) {
        if !config.enabled {
            tracing::info!("Backend maintenance loop is disabled");
            return;
        }

        tokio::spawn(async move {
            let interval = Duration::from_secs(config.interval_seconds.max(30));
            loop {
                match Self::run_once(&pool, &config).await {
                    Ok(report) => tracing::info!(
                        expired_locks_released = report.expired_locks_released,
                        old_released_locks_deleted = report.old_released_locks_deleted,
                        old_sessions_deleted = report.old_sessions_deleted,
                        old_verification_outbox_deleted = report.old_verification_outbox_deleted,
                        "Backend maintenance cycle completed"
                    ),
                    Err(error) => {
                        tracing::warn!(error = %error, "Backend maintenance cycle failed");
                    }
                }
                sleep(interval).await;
            }
        });
    }

    pub async fn run_once(
        pool: &PgPool,
        config: &MaintenanceConfig,
    ) -> Result<MaintenanceReport, AppError> {
        let expired_locks_released = cleanup_expired_locks(pool).await?;
        let old_released_locks_deleted =
            delete_old_released_locks(pool, config.released_lock_retention_hours).await?;
        let old_sessions_deleted =
            delete_old_sessions(pool, config.session_retention_hours).await?;
        let old_verification_outbox_deleted =
            delete_old_verification_outbox(pool, config.verification_outbox_retention_hours)
                .await?;

        Ok(MaintenanceReport {
            expired_locks_released,
            old_released_locks_deleted,
            old_sessions_deleted,
            old_verification_outbox_deleted,
        })
    }
}

impl MaintenanceConfig {
    pub fn from_env() -> Self {
        Self {
            enabled: env_bool("BACKEND_MAINTENANCE_ENABLED", true),
            interval_seconds: env_i64("BACKEND_MAINTENANCE_INTERVAL_SECONDS", 300).max(30) as u64,
            session_retention_hours: env_i64("SESSION_RETENTION_HOURS", 168).max(1),
            released_lock_retention_hours: env_i64("RELEASED_LOCK_RETENTION_HOURS", 24).max(1),
            verification_outbox_retention_hours: env_i64("VERIFICATION_OUTBOX_RETENTION_HOURS", 72)
                .max(1),
        }
    }
}

async fn cleanup_expired_locks(pool: &PgPool) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        UPDATE resource_locks
        SET released_at = NOW()
        WHERE released_at IS NULL AND expires_at <= NOW()
        "#,
    )
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

async fn delete_old_released_locks(pool: &PgPool, retention_hours: i64) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM resource_locks
        WHERE released_at IS NOT NULL
          AND released_at < NOW() - ($1 * INTERVAL '1 hour')
        "#,
    )
    .bind(retention_hours)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

async fn delete_old_sessions(pool: &PgPool, retention_hours: i64) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM user_sessions
        WHERE revoked_at IS NOT NULL
           OR expires_at < NOW() - ($1 * INTERVAL '1 hour')
        "#,
    )
    .bind(retention_hours)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

async fn delete_old_verification_outbox(
    pool: &PgPool,
    retention_hours: i64,
) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM verification_outbox
        WHERE created_at < NOW() - ($1 * INTERVAL '1 hour')
        "#,
    )
    .bind(retention_hours)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

fn env_bool(key: &str, default: bool) -> bool {
    env::var(key)
        .map(|value| {
            matches!(
                value.trim().to_ascii_lowercase().as_str(),
                "1" | "true" | "yes" | "on"
            )
        })
        .unwrap_or(default)
}

fn env_i64(key: &str, default: i64) -> i64 {
    env::var(key)
        .ok()
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(default)
}
