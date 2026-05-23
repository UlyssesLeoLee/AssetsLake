/*
```cypher
CREATE
  (f:File {name: "production.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::production", type: "module"}),
  (c1:Class {name: "IssueType", type: "class", language: "rust"}),
  (c2:Class {name: "IssueStatus", type: "class", language: "rust"}),
  (c3:Class {name: "IssuePriority", type: "class", language: "rust"}),
  (c4:Class {name: "ProductionRole", type: "class", language: "rust"}),
  (c5:Class {name: "ReviewScope", type: "class", language: "rust"}),
  (c6:Class {name: "ReviewRoundStatus", type: "class", language: "rust"}),
  (c7:Class {name: "DeliveryPackageStatus", type: "class", language: "rust"}),
  (c8:Class {name: "AiQaStatus", type: "class", language: "rust"}),
  (c9:Class {name: "QaSeverity", type: "class", language: "rust"}),
  (c10:Class {name: "Issue", type: "class", language: "rust"}),
  (c11:Class {name: "IssueSummary", type: "class", language: "rust"}),
  (c12:Class {name: "IssueComment", type: "class", language: "rust"}),
  (c13:Class {name: "IssueStatusHistory", type: "class", language: "rust"}),
  (c14:Class {name: "IssueAssetSummary", type: "class", language: "rust"}),
  (c15:Class {name: "IssueWorkLog", type: "class", language: "rust"}),
  (c16:Class {name: "ReviewRound", type: "class", language: "rust"}),
  (c17:Class {name: "ReviewComment", type: "class", language: "rust"}),
  (c18:Class {name: "Milestone", type: "class", language: "rust"}),
  (c19:Class {name: "DeliveryPackage", type: "class", language: "rust"}),
  (c20:Class {name: "DeliveryPackageAsset", type: "class", language: "rust"}),
  (c21:Class {name: "CreateIssueRequest", type: "class", language: "rust"}),
  (c22:Class {name: "UpdateIssueRequest", type: "class", language: "rust"}),
  (c23:Class {name: "IssueQuery", type: "class", language: "rust"}),
  (c24:Class {name: "TransitionIssueRequest", type: "class", language: "rust"}),
  (c25:Class {name: "CreateIssueCommentRequest", type: "class", language: "rust"}),
  (c26:Class {name: "CreateIssueWorkLogRequest", type: "class", language: "rust"}),
  (c27:Class {name: "AttachIssueAssetRequest", type: "class", language: "rust"}),
  (c28:Class {name: "CreateReviewRequest", type: "class", language: "rust"}),
  (c29:Class {name: "ApproveIssueRequest", type: "class", language: "rust"}),
  (c30:Class {name: "RequestRevisionRequest", type: "class", language: "rust"}),
  (c31:Class {name: "MilestoneQuery", type: "class", language: "rust"}),
  (c32:Class {name: "CreateDeliveryPackageRequest", type: "class", language: "rust"}),
  (c33:Class {name: "SubmitDeliveryPackageRequest", type: "class", language: "rust"}),
  (fn1:Function {name: "IssueQuery::page", type: "function", language: "rust", signature: "fn page(&self) -> i64"}),
  (fn2:Function {name: "IssueQuery::page_size", type: "function", language: "rust", signature: "fn page_size(&self) -> i64"}),
  (fn3:Function {name: "IssueQuery::offset", type: "function", language: "rust", signature: "fn offset(&self) -> i64"}),
  (v1:Variable {name: "page", type: "variable"}),
  (v2:Variable {name: "page_size", type: "variable"}),
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
  (m)-[:CONTAINS]->(c12),
  (m)-[:CONTAINS]->(c13),
  (m)-[:CONTAINS]->(c14),
  (m)-[:CONTAINS]->(c15),
  (m)-[:CONTAINS]->(c16),
  (m)-[:CONTAINS]->(c17),
  (m)-[:CONTAINS]->(c18),
  (m)-[:CONTAINS]->(c19),
  (m)-[:CONTAINS]->(c20),
  (m)-[:CONTAINS]->(c21),
  (m)-[:CONTAINS]->(c22),
  (m)-[:CONTAINS]->(c23),
  (m)-[:CONTAINS]->(c24),
  (m)-[:CONTAINS]->(c25),
  (m)-[:CONTAINS]->(c26),
  (m)-[:CONTAINS]->(c27),
  (m)-[:CONTAINS]->(c28),
  (m)-[:CONTAINS]->(c29),
  (m)-[:CONTAINS]->(c30),
  (m)-[:CONTAINS]->(c31),
  (m)-[:CONTAINS]->(c32),
  (m)-[:CONTAINS]->(c33),
  (c22)-[:HAS_METHOD]->(fn1),
  (c22)-[:HAS_METHOD]->(fn2),
  (c22)-[:HAS_METHOD]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2);
```
*/

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

use crate::models::asset::{AssetStatus, AssetType};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "issue_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum IssueType {
    ConceptArt,
    CharacterModel,
    EnvironmentModel,
    Texture,
    Rigging,
    Animation,
    Vfx,
    UiArt,
    Shader,
    TechnicalArt,
    DeliveryCheck,
    Bug,
    RevisionRequest,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "issue_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum IssueStatus {
    Backlog,
    BriefReady,
    Assigned,
    InProgress,
    Submitted,
    InternalReview,
    ClientReview,
    RevisionRequired,
    Approved,
    Delivered,
    Archived,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "issue_priority", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum IssuePriority {
    Low,
    Medium,
    High,
    Urgent,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "production_role", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
#[allow(dead_code)]
pub enum ProductionRole {
    Admin,
    Producer,
    ArtDirector,
    LeadArtist,
    Artist,
    TechnicalArtist,
    Reviewer,
    VendorManager,
    ClientViewer,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "review_scope", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum ReviewScope {
    Internal,
    Client,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "review_round_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum ReviewRoundStatus {
    Open,
    ChangesRequested,
    Approved,
    Closed,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "delivery_package_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum DeliveryPackageStatus {
    Draft,
    Submitted,
    Accepted,
    Rejected,
    Archived,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "ai_qa_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum AiQaStatus {
    Pending,
    Passed,
    Warning,
    Failed,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "qa_severity", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum QaSeverity {
    Info,
    Warning,
    Error,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Issue {
    pub id: Uuid,
    pub issue_key: String,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub brief_id: Option<Uuid>,
    pub epic_id: Option<Uuid>,
    pub sprint_id: Option<Uuid>,
    pub milestone_id: Option<Uuid>,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub title: String,
    pub description: Option<String>,
    pub issue_type: IssueType,
    pub asset_type: Option<AssetType>,
    pub status: IssueStatus,
    pub priority: IssuePriority,
    pub assignee_id: Option<Uuid>,
    pub reporter_id: Option<Uuid>,
    pub start_date: Option<NaiveDate>,
    pub due_date: Option<NaiveDate>,
    pub rank_key: String,
    pub revision_count: i32,
    pub qa_status: AiQaStatus,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueSummary {
    pub id: Uuid,
    pub issue_key: String,
    pub project_id: Uuid,
    pub epic_id: Option<Uuid>,
    pub sprint_id: Option<Uuid>,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub title: String,
    pub issue_type: IssueType,
    pub asset_type: Option<AssetType>,
    pub status: IssueStatus,
    pub priority: IssuePriority,
    pub assignee_id: Option<Uuid>,
    pub assignee_name: Option<String>,
    pub start_date: Option<NaiveDate>,
    pub due_date: Option<NaiveDate>,
    pub story_points: Option<f64>,
    pub rank_key: String,
    pub revision_count: i32,
    pub qa_status: AiQaStatus,
    pub asset_count: i64,
    pub thumbnail_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueComment {
    pub id: Uuid,
    pub issue_id: Uuid,
    pub author_id: Option<Uuid>,
    pub author_name: String,
    pub body: String,
    pub visibility: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueStatusHistory {
    pub id: Uuid,
    pub issue_id: Uuid,
    pub from_status: Option<IssueStatus>,
    pub to_status: IssueStatus,
    pub actor_id: Option<Uuid>,
    pub actor: String,
    pub reason: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueAssetSummary {
    pub id: Uuid,
    pub name: String,
    pub original_filename: String,
    pub asset_type: AssetType,
    pub mime_type: String,
    pub tags: Vec<String>,
    pub file_url: String,
    pub preview_url: Option<String>,
    pub file_size: i64,
    pub version: i32,
    pub project_id: Uuid,
    pub uploader: String,
    pub status: AssetStatus,
    pub link_type: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueWorkLog {
    pub id: Uuid,
    pub issue_id: Uuid,
    pub author_id: Option<Uuid>,
    pub author_name: String,
    pub time_spent_minutes: i32,
    pub started_at: DateTime<Utc>,
    pub body: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ReviewRound {
    pub id: Uuid,
    pub issue_id: Uuid,
    pub scope: ReviewScope,
    pub round_number: i32,
    pub status: ReviewRoundStatus,
    pub reviewer_id: Option<Uuid>,
    pub reviewer_name: String,
    pub summary: Option<String>,
    pub created_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ReviewComment {
    pub id: Uuid,
    pub review_round_id: Uuid,
    pub issue_id: Uuid,
    pub asset_id: Option<Uuid>,
    pub asset_version_id: Option<Uuid>,
    pub author_id: Option<Uuid>,
    pub author_name: String,
    pub body: String,
    pub annotation: Value,
    pub severity: QaSeverity,
    pub resolved: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Milestone {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub due_date: Option<NaiveDate>,
    pub status: String,
    pub sort_order: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DeliveryPackage {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub name: String,
    pub status: DeliveryPackageStatus,
    pub notes: Option<String>,
    pub submitted_by: Option<Uuid>,
    pub submitted_at: Option<DateTime<Utc>>,
    pub approved_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DeliveryPackageAsset {
    pub id: Uuid,
    pub package_id: Uuid,
    pub asset_id: Uuid,
    pub asset_version_id: Option<Uuid>,
    pub issue_id: Option<Uuid>,
    pub included_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateIssueRequest {
    pub workspace_id: Option<Uuid>,
    pub project_id: Option<Uuid>,
    pub brief_id: Option<Uuid>,
    pub epic_id: Option<Uuid>,
    pub sprint_id: Option<Uuid>,
    pub milestone_id: Option<Uuid>,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub title: String,
    pub description: Option<String>,
    pub issue_type: IssueType,
    pub asset_type: Option<AssetType>,
    pub priority: Option<IssuePriority>,
    pub assignee_id: Option<Uuid>,
    pub reporter_id: Option<Uuid>,
    pub start_date: Option<NaiveDate>,
    pub due_date: Option<NaiveDate>,
    pub story_points: Option<f64>,
    pub rank_key: Option<String>,
    pub metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateIssueRequest {
    pub brief_id: Option<Uuid>,
    pub epic_id: Option<Uuid>,
    pub sprint_id: Option<Uuid>,
    pub milestone_id: Option<Uuid>,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub issue_type: Option<IssueType>,
    pub asset_type: Option<AssetType>,
    pub status: Option<IssueStatus>,
    pub priority: Option<IssuePriority>,
    pub assignee_id: Option<Uuid>,
    pub start_date: Option<NaiveDate>,
    pub due_date: Option<NaiveDate>,
    pub story_points: Option<f64>,
    pub rank_key: Option<String>,
    pub qa_status: Option<AiQaStatus>,
    pub metadata: Option<Value>,
    pub actor: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct IssueQuery {
    pub page: Option<i64>,
    pub page_size: Option<i64>,
    pub q: Option<String>,
    pub project_id: Option<Uuid>,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub assignee_id: Option<Uuid>,
    pub issue_type: Option<String>,
    pub asset_type: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub due_before: Option<NaiveDate>,
}

impl IssueQuery {
    pub fn page(&self) -> i64 {
        self.page.unwrap_or(1).max(1)
    }

    pub fn page_size(&self) -> i64 {
        self.page_size.unwrap_or(100).clamp(1, 250)
    }

    pub fn offset(&self) -> i64 {
        (self.page() - 1) * self.page_size()
    }
}

#[derive(Debug, Deserialize)]
pub struct TransitionIssueRequest {
    pub status: IssueStatus,
    pub actor_id: Option<Uuid>,
    pub actor: Option<String>,
    pub reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateIssueCommentRequest {
    pub author_id: Option<Uuid>,
    pub author_name: Option<String>,
    pub body: String,
    pub visibility: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateIssueWorkLogRequest {
    pub author_id: Option<Uuid>,
    pub author_name: Option<String>,
    pub time_spent_minutes: i32,
    pub started_at: Option<DateTime<Utc>>,
    pub body: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AttachIssueAssetRequest {
    pub asset_id: Uuid,
    pub link_type: Option<String>,
    pub actor_id: Option<Uuid>,
    pub actor: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateReviewRequest {
    pub scope: ReviewScope,
    pub reviewer_id: Option<Uuid>,
    pub reviewer_name: Option<String>,
    pub summary: Option<String>,
    pub comment: Option<String>,
    pub asset_id: Option<Uuid>,
    pub annotation: Option<Value>,
    pub severity: Option<QaSeverity>,
}

#[derive(Debug, Deserialize)]
pub struct ApproveIssueRequest {
    pub approver_id: Option<Uuid>,
    pub approver_name: Option<String>,
    pub scope: Option<ReviewScope>,
    pub note: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RequestRevisionRequest {
    pub requester_id: Option<Uuid>,
    pub requester_name: Option<String>,
    pub scope: Option<ReviewScope>,
    pub reason: String,
    pub annotation: Option<Value>,
    pub asset_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct MilestoneQuery {
    pub project_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDeliveryPackageRequest {
    pub workspace_id: Option<Uuid>,
    pub project_id: Uuid,
    pub vendor_id: Option<Uuid>,
    pub client_id: Option<Uuid>,
    pub name: String,
    pub notes: Option<String>,
    pub asset_ids: Vec<Uuid>,
    pub included_by: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct SubmitDeliveryPackageRequest {
    pub submitted_by: Option<Uuid>,
    pub actor: Option<String>,
}
