/*
```cypher
CREATE
  (f:File {name: "verification.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::verification", type: "module"}),
  (c1:Class {name: "VerificationAppInfo", type: "class", language: "rust", signature: "struct VerificationAppInfo"}),
  (c2:Class {name: "StartVerificationRequest", type: "class", language: "rust", signature: "struct StartVerificationRequest"}),
  (c3:Class {name: "StartVerificationResponse", type: "class", language: "rust", signature: "struct StartVerificationResponse"}),
  (c4:Class {name: "VerifyCodeRequest", type: "class", language: "rust", signature: "struct VerifyCodeRequest"}),
  (c5:Class {name: "VerifyCodeResponse", type: "class", language: "rust", signature: "struct VerifyCodeResponse"}),
  (c6:Class {name: "RegisterWithVerificationRequest", type: "class", language: "rust", signature: "struct RegisterWithVerificationRequest"}),
  (c7:Class {name: "ChangePasswordWithVerificationRequest", type: "class", language: "rust", signature: "struct ChangePasswordWithVerificationRequest"}),
  (c8:Class {name: "VerificationUserResponse", type: "class", language: "rust", signature: "struct VerificationUserResponse"}),
  (c9:Class {name: "VerificationOutboxItem", type: "class", language: "rust", signature: "struct VerificationOutboxItem"}),
  (c10:Class {name: "VerificationMutationResponse", type: "class", language: "rust", signature: "struct VerificationMutationResponse"}),
  (v1:Variable {name: "app_key", type: "variable"}),
  (v2:Variable {name: "challenge_id", type: "variable"}),
  (v3:Variable {name: "verification_token", type: "variable"}),
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
  (c1)-[:USES]->(v1),
  (c2)-[:USES]->(v1),
  (c3)-[:USES]->(v1),
  (c3)-[:USES]->(v2),
  (c5)-[:USES]->(v2),
  (c5)-[:USES]->(v3),
  (c6)-[:USES]->(v1),
  (c6)-[:USES]->(v2),
  (c6)-[:USES]->(v3),
  (c7)-[:USES]->(v1),
  (c7)-[:USES]->(v2),
  (c7)-[:USES]->(v3);
```
*/

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct VerificationAppInfo {
    pub app_key: String,
    pub name: String,
    pub owner_email: String,
    pub sender_email: String,
    pub sms_sender_label: String,
    pub dev_code_visible: bool,
}

#[derive(Debug, Clone, Deserialize)]
pub struct StartVerificationRequest {
    pub app_key: Option<String>,
    pub purpose: String,
    pub channel: Option<String>,
    pub phone_number: Option<String>,
    pub email: Option<String>,
    pub client_ref: Option<String>,
    pub metadata: Option<Value>,
}

#[derive(Debug, Clone, Serialize)]
pub struct StartVerificationResponse {
    pub challenge_id: Uuid,
    pub app_key: String,
    pub purpose: String,
    pub channel: String,
    pub masked_target: String,
    pub expires_at: DateTime<Utc>,
    pub delivery_status: String,
    pub dev_code: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct VerifyCodeRequest {
    pub code: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct VerifyCodeResponse {
    pub challenge_id: Uuid,
    pub purpose: String,
    pub verified: bool,
    pub masked_target: String,
    pub verification_token: String,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RegisterWithVerificationRequest {
    pub app_key: Option<String>,
    pub challenge_id: Uuid,
    pub verification_token: String,
    pub username: String,
    pub password: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ChangePasswordWithVerificationRequest {
    pub app_key: Option<String>,
    pub challenge_id: Uuid,
    pub verification_token: String,
    pub username: String,
    pub new_password: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct VerificationUserResponse {
    pub id: Uuid,
    pub username: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub role: String,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct VerificationOutboxItem {
    pub id: Uuid,
    pub challenge_id: Uuid,
    pub app_key: String,
    pub channel: String,
    pub provider: String,
    pub recipient_masked: String,
    pub subject: Option<String>,
    pub body: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub sent_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct VerificationMutationResponse {
    pub success: bool,
    pub user: Option<VerificationUserResponse>,
}
