/*
```cypher
CREATE
  (f:File {name: "design_requirement.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::design_requirement", type: "module"}),
  (c1:Class {name: "DesignRequirement", type: "class", language: "rust", signature: "struct DesignRequirement"}),
  (c2:Class {name: "DesignRequirementAsset", type: "class", language: "rust", signature: "struct DesignRequirementAsset"}),
  (c3:Class {name: "DesignRequirementComment", type: "class", language: "rust", signature: "struct DesignRequirementComment"}),
  (c4:Class {name: "CreateDesignRequirementRequest", type: "class", language: "rust", signature: "struct CreateDesignRequirementRequest"}),
  (c5:Class {name: "UpdateDesignRequirementRequest", type: "class", language: "rust", signature: "struct UpdateDesignRequirementRequest"}),
  (c6:Class {name: "AttachDesignAssetRequest", type: "class", language: "rust", signature: "struct AttachDesignAssetRequest"}),
  (c7:Class {name: "CreateDesignCommentRequest", type: "class", language: "rust", signature: "struct CreateDesignCommentRequest"}),
  (c8:Class {name: "DesignRequirementQuery", type: "class", language: "rust", signature: "struct DesignRequirementQuery"}),
  (c9:Class {name: "DesignRequirementDetail", type: "class", language: "rust", signature: "struct DesignRequirementDetail"}),
  (c10:Class {name: "DesignAiDraftRequest", type: "class", language: "rust", signature: "struct DesignAiDraftRequest"}),
  (c11:Class {name: "DesignAiDraft", type: "class", language: "rust", signature: "struct DesignAiDraft"}),
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
  (m)-[:CONTAINS]->(c11);
```
*/

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct DesignRequirement {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Option<Uuid>,
    pub title: String,
    pub summary: String,
    pub status: String,
    pub priority: String,
    pub acceptance_criteria: Json<Vec<String>>,
    pub owner_id: Option<Uuid>,
    pub owner_name: String,
    pub reviewer_id: Option<Uuid>,
    pub reviewer_name: Option<String>,
    pub due_date: Option<NaiveDate>,
    pub version: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct DesignRequirementAsset {
    pub requirement_id: Uuid,
    pub asset_id: Uuid,
    pub asset_name: String,
    pub asset_type: Option<String>,
    pub preview_url: Option<String>,
    pub asset_version: Option<i32>,
    pub verified: bool,
    pub relation_type: String,
    pub note: Option<String>,
    pub attached_by: Option<Uuid>,
    pub attached_by_name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct DesignRequirementComment {
    pub id: Uuid,
    pub requirement_id: Uuid,
    pub body: String,
    pub author_id: Option<Uuid>,
    pub author_name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDesignRequirementRequest {
    pub workspace_id: Uuid,
    pub project_id: Option<Uuid>,
    pub title: String,
    pub summary: Option<String>,
    pub priority: Option<String>,
    pub acceptance_criteria: Option<Vec<String>>,
    pub due_date: Option<NaiveDate>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDesignRequirementRequest {
    pub title: Option<String>,
    pub summary: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub acceptance_criteria: Option<Vec<String>>,
    pub reviewer_id: Option<Uuid>,
    pub reviewer_name: Option<String>,
    pub due_date: Option<NaiveDate>,
    pub expected_version: i64,
}

#[derive(Debug, Deserialize)]
pub struct AttachDesignAssetRequest {
    pub asset_id: Uuid,
    pub relation_type: Option<String>,
    pub note: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDesignCommentRequest {
    pub body: String,
}

#[derive(Debug, Deserialize)]
pub struct DesignRequirementQuery {
    pub workspace_id: Uuid,
    pub status: Option<String>,
    pub asset_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct DesignRequirementDetail {
    pub requirement: DesignRequirement,
    pub assets: Vec<DesignRequirementAsset>,
    pub comments: Vec<DesignRequirementComment>,
}

#[derive(Debug, Deserialize)]
pub struct DesignAiDraftRequest {
    pub workspace_id: Uuid,
    pub project_id: Option<Uuid>,
    pub prompt: String,
    pub asset_ids: Vec<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DesignAiDraft {
    pub title: String,
    pub summary: String,
    pub priority: String,
    pub acceptance_criteria: Vec<String>,
    pub rationale: String,
}
