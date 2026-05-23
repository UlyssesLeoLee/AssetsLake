/*
```cypher
CREATE
  (f:File {name: "auth.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::auth", type: "module"}),
  (c1:Class {name: "UserAccount", type: "class", language: "rust", signature: "struct UserAccount"}),
  (c2:Class {name: "LoginRequest", type: "class", language: "rust", signature: "struct LoginRequest"}),
  (c3:Class {name: "LoginResponse", type: "class", language: "rust", signature: "struct LoginResponse"}),
  (c4:Class {name: "SessionUserResponse", type: "class", language: "rust", signature: "struct SessionUserResponse"}),
  (c5:Class {name: "SessionContext", type: "class", language: "rust", signature: "struct SessionContext"}),
  (c6:Class {name: "TestAccount", type: "class", language: "rust", signature: "struct TestAccount"}),
  (c7:Class {name: "AcquireLockRequest", type: "class", language: "rust", signature: "struct AcquireLockRequest"}),
  (c8:Class {name: "RenewLockRequest", type: "class", language: "rust", signature: "struct RenewLockRequest"}),
  (c9:Class {name: "ReleaseLockRequest", type: "class", language: "rust", signature: "struct ReleaseLockRequest"}),
  (c10:Class {name: "ResourceLock", type: "class", language: "rust", signature: "struct ResourceLock"}),
  (c11:Class {name: "LockStatusResponse", type: "class", language: "rust", signature: "struct LockStatusResponse"}),
  (fn1:Function {name: "SessionContext::lock_owner_label", type: "function", language: "rust", signature: "fn lock_owner_label(&self) -> String"}),
  (v1:Variable {name: "user", type: "variable"}),
  (v2:Variable {name: "lock", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (c5)-[:HAS_METHOD]->(fn1),
  (fn1)-[:USES]->(v1),
  (c11)-[:USES]->(v2);
```
*/

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserAccount {
    pub id: Uuid,
    pub username: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub role: String,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
    pub device_label: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct LoginResponse {
    pub user: UserAccount,
    pub token: String,
    pub session_id: Uuid,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SessionUserResponse {
    pub user: UserAccount,
    pub session_id: Uuid,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct SessionContext {
    pub session_id: Uuid,
    pub user: UserAccount,
    pub expires_at: DateTime<Utc>,
}

impl SessionContext {
    pub fn lock_owner_label(&self) -> String {
        self.user
            .display_name
            .clone()
            .unwrap_or_else(|| self.user.username.clone())
    }
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct TestAccount {
    pub username: String,
    pub display_name: Option<String>,
    pub role: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AcquireLockRequest {
    pub resource_type: String,
    pub resource_id: Uuid,
    pub ttl_seconds: Option<i64>,
    pub purpose: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RenewLockRequest {
    pub lock_token: String,
    pub ttl_seconds: Option<i64>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ReleaseLockRequest {
    pub lock_token: String,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ResourceLock {
    pub id: Uuid,
    pub resource_type: String,
    pub resource_id: Uuid,
    pub holder_user_id: Uuid,
    pub holder_username: String,
    pub holder_display_name: Option<String>,
    pub session_id: Uuid,
    pub lock_token: String,
    pub purpose: Option<String>,
    pub expires_at: DateTime<Utc>,
    pub released_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct LockStatusResponse {
    pub locked: bool,
    pub lock: Option<ResourceLock>,
}
