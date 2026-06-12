/*
```cypher
CREATE
  (f:File {name: "auth_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::auth_service", type: "module"}),
  (c1:Class {name: "AuthService", type: "class", language: "rust", signature: "struct AuthService"}),
  (c2:Class {name: "UserCredentialRow", type: "class", language: "rust", signature: "struct UserCredentialRow"}),
  (c3:Class {name: "SessionRow", type: "class", language: "rust", signature: "struct SessionRow"}),
  (fn1:Function {name: "AuthService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "AuthService::login", type: "function", language: "rust", signature: "async fn login(&self, req: LoginRequest) -> Result<LoginResponse, AppError>"}),
  (fn3:Function {name: "AuthService::authenticate_request", type: "function", language: "rust", signature: "async fn authenticate_request(&self, req: &HttpRequest) -> Result<SessionContext, AppError>"}),
  (fn4:Function {name: "AuthService::logout", type: "function", language: "rust", signature: "async fn logout(&self, req: &HttpRequest) -> Result<(), AppError>"}),
  (fn5:Function {name: "AuthService::list_test_accounts", type: "function", language: "rust", signature: "async fn list_test_accounts(&self) -> Result<Vec<TestAccount>, AppError>"}),
  (fn6:Function {name: "authenticate_token_hash", type: "function", language: "rust", signature: "async fn authenticate_token_hash(pool: &PgPool, token_hash: &str) -> Result<SessionContext, AppError>"}),
  (fn7:Function {name: "bearer_token_from_headers", type: "function", language: "rust", signature: "fn bearer_token_from_headers(headers: &HeaderMap) -> Result<String, AppError>"}),
  (fn8:Function {name: "optional_bearer_token_from_headers", type: "function", language: "rust", signature: "fn optional_bearer_token_from_headers(headers: &HeaderMap) -> Option<String>"}),
  (fn9:Function {name: "hash_secret", type: "function", language: "rust", signature: "fn hash_secret(secret: &str) -> String"}),
  (fn10:Function {name: "password_hash", type: "function", language: "rust", signature: "fn password_hash(salt: &str, password: &str) -> String"}),
  (fn11:Function {name: "generate_session_token", type: "function", language: "rust", signature: "fn generate_session_token() -> String"}),
  (fn12:Function {name: "row_user", type: "function", language: "rust", signature: "fn row_user(row: &UserCredentialRow) -> UserAccount"}),
  (fn13:Function {name: "session_touch_interval_seconds", type: "function", language: "rust", signature: "fn session_touch_interval_seconds() -> i64"}),
  (fn14:Function {name: "should_touch_session", type: "function", language: "rust", signature: "fn should_touch_session(last_seen_at: Option<chrono::DateTime<Utc>>) -> bool"}),
  (fn15:Function {name: "is_idle_expired", type: "function", language: "rust", signature: "fn is_idle_expired(last_seen_at: Option<chrono::DateTime<Utc>>, idle_timeout_seconds: i64) -> bool"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "token_hash", type: "variable"}),
  (v3:Variable {name: "headers", type: "variable"}),
  (v4:Variable {name: "last_seen_at", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn11),
  (fn2)-[:CALLS]->(fn9),
  (fn2)-[:CALLS]->(fn12),
  (fn2)-[:CALLS]->(fn15),
  (fn3)-[:CALLS]->(fn7),
  (fn3)-[:CALLS]->(fn9),
  (fn3)-[:CALLS]->(fn6),
  (fn3)-[:USES]->(v2),
  (fn4)-[:CALLS]->(fn3),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v2),
  (fn6)-[:CALLS]->(fn14),
  (fn6)-[:CALLS]->(fn15),
  (fn14)-[:CALLS]->(fn13),
  (fn14)-[:USES]->(v4),
  (fn7)-[:CALLS]->(fn8),
  (fn7)-[:USES]->(v3),
  (fn8)-[:USES]->(v3),
  (fn10)-[:CALLS]->(fn9);
```
*/

use actix_web::{http::header::HeaderMap, HttpRequest};
use chrono::{Duration, Utc};
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::auth::{LoginRequest, LoginResponse, SessionContext, TestAccount, UserAccount},
    services::admin_control_service::{
        configured_session_ttl_seconds, DEFAULT_IDLE_TIMEOUT_SECONDS,
    },
};

const DEFAULT_SESSION_TOUCH_INTERVAL_SECONDS: i64 = 60;

#[derive(Clone)]
pub struct AuthService {
    pool: PgPool,
}

#[derive(Debug, FromRow)]
struct UserCredentialRow {
    id: Uuid,
    username: String,
    display_name: Option<String>,
    email: Option<String>,
    role: String,
    avatar_url: Option<String>,
    password_salt: Option<String>,
    password_hash: Option<String>,
}

#[derive(Debug, FromRow)]
struct SessionRow {
    session_id: Uuid,
    user_id: Uuid,
    username: String,
    display_name: Option<String>,
    email: Option<String>,
    role: String,
    avatar_url: Option<String>,
    expires_at: chrono::DateTime<Utc>,
    last_seen_at: Option<chrono::DateTime<Utc>>,
    idle_timeout_seconds: i64,
}

impl AuthService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn login(&self, req: LoginRequest) -> Result<LoginResponse, AppError> {
        let username = req.username.trim();
        if username.is_empty() || req.password.is_empty() {
            return Err(AppError::validation("Username and password are required"));
        }

        let row = sqlx::query_as::<_, UserCredentialRow>(
            r#"
            SELECT id, username, display_name, email, role, avatar_url, password_salt, password_hash
            FROM users
            WHERE lower(username) = lower($1)
              AND deleted_at IS NULL
              AND COALESCE(user_status, 'active') = 'active'
            "#,
        )
        .bind(username)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::unauthorized("Invalid username or password"))?;

        let salt = row
            .password_salt
            .as_deref()
            .ok_or_else(|| AppError::unauthorized("Invalid username or password"))?;
        let expected_hash = row
            .password_hash
            .as_deref()
            .ok_or_else(|| AppError::unauthorized("Invalid username or password"))?;
        if password_hash(salt, &req.password) != expected_hash {
            return Err(AppError::unauthorized("Invalid username or password"));
        }

        let session_id = Uuid::new_v4();
        let token = generate_session_token();
        let token_hash = hash_secret(&token);
        let expires_at =
            Utc::now() + Duration::seconds(configured_session_ttl_seconds(&self.pool).await);

        sqlx::query(
            r#"
            INSERT INTO user_sessions (id, user_id, token_hash, device_label, expires_at, last_seen_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            "#,
        )
        .bind(session_id)
        .bind(row.id)
        .bind(&token_hash)
        .bind(req.device_label)
        .bind(expires_at)
        .execute(&self.pool)
        .await?;

        sqlx::query("UPDATE users SET last_login_at = NOW() WHERE id = $1")
            .bind(row.id)
            .execute(&self.pool)
            .await?;

        Ok(LoginResponse {
            user: row_user(&row),
            token,
            session_id,
            expires_at,
        })
    }

    pub async fn authenticate_request(
        &self,
        req: &HttpRequest,
    ) -> Result<SessionContext, AppError> {
        let token = bearer_token_from_headers(req.headers())?;
        let token_hash = hash_secret(&token);
        authenticate_token_hash(&self.pool, &token_hash).await
    }

    pub async fn logout(&self, req: &HttpRequest) -> Result<(), AppError> {
        let context = self.authenticate_request(req).await?;
        sqlx::query(
            "UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL",
        )
        .bind(context.session_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_test_accounts(&self) -> Result<Vec<TestAccount>, AppError> {
        let accounts = sqlx::query_as::<_, TestAccount>(
            r#"
            SELECT username, display_name, role
            FROM users
            WHERE username IN (
                'alice.producer',
                'bob.artist',
                'chen.reviewer',
                'dana.manager',
                'eve.producer',
                'felix.artist',
                'grace.reviewer',
                'hao.manager',
                'iris.artist',
                'jo.viewer'
            )
              AND deleted_at IS NULL
              AND COALESCE(user_status, 'active') = 'active'
            ORDER BY username
            "#,
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(accounts)
    }
}

pub async fn authenticate_token_hash(
    pool: &PgPool,
    token_hash: &str,
) -> Result<SessionContext, AppError> {
    let row = sqlx::query_as::<_, SessionRow>(
        r#"
        SELECT
            s.id AS session_id,
            u.id AS user_id,
            u.username,
            u.display_name,
            u.email,
            u.role,
            u.avatar_url,
            s.expires_at,
            s.last_seen_at,
            COALESCE(cfg.idle_timeout_seconds, $2) AS idle_timeout_seconds
        FROM user_sessions s
        JOIN users u ON u.id = s.user_id
        LEFT JOIN admin_control_settings cfg ON cfg.id = 'default'
        WHERE s.token_hash = $1
          AND s.revoked_at IS NULL
          AND s.expires_at > NOW()
          AND u.deleted_at IS NULL
          AND COALESCE(u.user_status, 'active') = 'active'
        "#,
    )
    .bind(token_hash)
    .bind(DEFAULT_IDLE_TIMEOUT_SECONDS)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::unauthorized("Session token is invalid or expired"))?;

    if is_idle_expired(row.last_seen_at, row.idle_timeout_seconds) {
        sqlx::query(
            "UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL",
        )
        .bind(row.session_id)
        .execute(pool)
        .await?;
        return Err(AppError::unauthorized("Session token is idle-expired"));
    }

    if should_touch_session(row.last_seen_at) {
        sqlx::query("UPDATE user_sessions SET last_seen_at = NOW() WHERE id = $1")
            .bind(row.session_id)
            .execute(pool)
            .await?;
    }

    Ok(SessionContext {
        session_id: row.session_id,
        expires_at: row.expires_at,
        user: UserAccount {
            id: row.user_id,
            username: row.username,
            display_name: row.display_name,
            email: row.email,
            role: row.role,
            avatar_url: row.avatar_url,
        },
    })
}

pub fn bearer_token_from_headers(headers: &HeaderMap) -> Result<String, AppError> {
    optional_bearer_token_from_headers(headers)
        .ok_or_else(|| AppError::unauthorized("Bearer session token is required"))
}

pub fn optional_bearer_token_from_headers(headers: &HeaderMap) -> Option<String> {
    let value = headers.get("authorization")?.to_str().ok()?.trim();
    let token = value.strip_prefix("Bearer ")?;
    let token = token.trim();
    (!token.is_empty()).then(|| token.to_string())
}

pub fn hash_secret(secret: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(secret.as_bytes());
    hex::encode(hasher.finalize())
}

fn password_hash(salt: &str, password: &str) -> String {
    hash_secret(&format!("{}:{}", salt, password))
}

fn generate_session_token() -> String {
    format!(
        "alst_{}_{}",
        Uuid::new_v4().simple(),
        Uuid::new_v4().simple()
    )
}

fn session_touch_interval_seconds() -> i64 {
    std::env::var("SESSION_TOUCH_INTERVAL_SECONDS")
        .ok()
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(DEFAULT_SESSION_TOUCH_INTERVAL_SECONDS)
        .max(1)
}

fn should_touch_session(last_seen_at: Option<chrono::DateTime<Utc>>) -> bool {
    let interval = Duration::seconds(session_touch_interval_seconds());
    last_seen_at
        .map(|last_seen_at| Utc::now() - last_seen_at >= interval)
        .unwrap_or(true)
}

fn is_idle_expired(last_seen_at: Option<chrono::DateTime<Utc>>, idle_timeout_seconds: i64) -> bool {
    let timeout = Duration::seconds(idle_timeout_seconds.max(1));
    last_seen_at
        .map(|last_seen_at| Utc::now() - last_seen_at >= timeout)
        .unwrap_or(false)
}

fn row_user(row: &UserCredentialRow) -> UserAccount {
    UserAccount {
        id: row.id,
        username: row.username.clone(),
        display_name: row.display_name.clone(),
        email: row.email.clone(),
        role: row.role.clone(),
        avatar_url: row.avatar_url.clone(),
    }
}
