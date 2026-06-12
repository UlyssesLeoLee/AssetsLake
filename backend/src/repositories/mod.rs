use std::{env, time::Duration};

pub mod asset_insight_repository;
pub mod asset_repository;
pub mod production_repository;
pub mod project_management_repository;
pub mod project_repository;

use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use sqlx::PgPool;
use std::str::FromStr;

pub async fn create_pool(database_url: &str) -> anyhow::Result<PgPool> {
    let max_connections = env::var("DB_MAX_CONNECTIONS")
        .unwrap_or_else(|_| "80".to_string())
        .parse()
        .unwrap_or(80);
    let min_connections = env::var("DB_MIN_CONNECTIONS")
        .unwrap_or_else(|_| "4".to_string())
        .parse()
        .unwrap_or(4);
    let acquire_timeout_seconds = env::var("DB_ACQUIRE_TIMEOUT_SECONDS")
        .unwrap_or_else(|_| "5".to_string())
        .parse()
        .unwrap_or(5);
    let statement_timeout_ms = env::var("DB_STATEMENT_TIMEOUT_MS")
        .unwrap_or_else(|_| "2500".to_string())
        .parse::<u64>()
        .unwrap_or(2500);
    let lock_timeout_ms = env::var("DB_LOCK_TIMEOUT_MS")
        .unwrap_or_else(|_| "2000".to_string())
        .parse::<u64>()
        .unwrap_or(2000);
    let statement_timeout = format!("{statement_timeout_ms}ms");
    let lock_timeout = format!("{lock_timeout_ms}ms");
    let connect_options = PgConnectOptions::from_str(database_url)?.options([
        ("statement_timeout", statement_timeout),
        ("lock_timeout", lock_timeout),
    ]);

    let pool = PgPoolOptions::new()
        .max_connections(max_connections)
        .min_connections(min_connections)
        .acquire_timeout(Duration::from_secs(acquire_timeout_seconds))
        .idle_timeout(Duration::from_secs(300))
        .max_lifetime(Duration::from_secs(1800))
        .connect_with(connect_options)
        .await?;
    Ok(pool)
}
