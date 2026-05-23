/*
```cypher
CREATE
  (f:File {name: "project_management.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::project_management", type: "module"}),
  (c1:Class {name: "SprintStatus", type: "class", language: "rust", signature: "enum SprintStatus"}),
  (c2:Class {name: "IssueDependencyType", type: "class", language: "rust", signature: "enum IssueDependencyType"}),
  (c3:Class {name: "IssueEventType", type: "class", language: "rust", signature: "enum IssueEventType"}),
  (c4:Class {name: "ProjectManagementEpic", type: "class", language: "rust", signature: "struct ProjectManagementEpic"}),
  (c5:Class {name: "ProjectManagementSprint", type: "class", language: "rust", signature: "struct ProjectManagementSprint"}),
  (c6:Class {name: "IssueDependency", type: "class", language: "rust", signature: "struct IssueDependency"}),
  (c7:Class {name: "IssueEvent", type: "class", language: "rust", signature: "struct IssueEvent"}),
  (c8:Class {name: "SavedIssueFilter", type: "class", language: "rust", signature: "struct SavedIssueFilter"}),
  (c9:Class {name: "ProjectManagementPlan", type: "class", language: "rust", signature: "struct ProjectManagementPlan"}),
  (c10:Class {name: "ProjectManagementQuery", type: "class", language: "rust", signature: "struct ProjectManagementQuery"}),
  (c11:Class {name: "CreateEpicRequest", type: "class", language: "rust", signature: "struct CreateEpicRequest"}),
  (c12:Class {name: "CreateSprintRequest", type: "class", language: "rust", signature: "struct CreateSprintRequest"}),
  (c13:Class {name: "CreateIssueDependencyRequest", type: "class", language: "rust", signature: "struct CreateIssueDependencyRequest"}),
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
  (m)-[:CONTAINS]->(c13);
```
*/

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

use crate::models::production::{IssuePriority, IssueStatus, IssueSummary};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "sprint_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum SprintStatus {
    Planned,
    Active,
    Completed,
    Cancelled,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "issue_dependency_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum IssueDependencyType {
    Blocks,
    IsBlockedBy,
    RelatesTo,
    Duplicates,
    ParentChild,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, sqlx::Type, PartialEq, Eq)]
#[sqlx(type_name = "issue_event_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum IssueEventType {
    Created,
    Updated,
    Ranked,
    Assigned,
    Transitioned,
    Commented,
    AssetLinked,
    DependencyLinked,
    SprintChanged,
    AiRecommended,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ProjectManagementEpic {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub epic_key: String,
    pub name: String,
    pub summary: Option<String>,
    pub status: IssueStatus,
    pub priority: IssuePriority,
    pub owner_id: Option<Uuid>,
    pub start_date: Option<NaiveDate>,
    pub target_date: Option<NaiveDate>,
    pub rank_key: String,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ProjectManagementSprint {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub name: String,
    pub goal: Option<String>,
    pub status: SprintStatus,
    pub start_date: Option<NaiveDate>,
    pub end_date: Option<NaiveDate>,
    pub capacity_points: f64,
    pub committed_points: f64,
    pub completed_points: f64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueDependency {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub source_issue_id: Uuid,
    pub target_issue_id: Uuid,
    pub dependency_type: IssueDependencyType,
    pub description: Option<String>,
    pub created_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct IssueEvent {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Uuid,
    pub issue_id: Uuid,
    pub event_type: IssueEventType,
    pub actor_id: Option<Uuid>,
    pub actor_name: String,
    pub payload: Value,
    pub created_at: DateTime<Utc>,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct SavedIssueFilter {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub project_id: Option<Uuid>,
    pub owner_id: Option<Uuid>,
    pub name: String,
    pub query: Value,
    pub is_shared: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectManagementPlan {
    pub project_id: Uuid,
    pub epics: Vec<ProjectManagementEpic>,
    pub sprints: Vec<ProjectManagementSprint>,
    pub backlog: Vec<IssueSummary>,
    pub active_sprint: Vec<IssueSummary>,
    pub dependencies: Vec<IssueDependency>,
    pub recent_events: Vec<IssueEvent>,
}

#[derive(Debug, Deserialize)]
pub struct ProjectManagementQuery {
    pub project_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct CreateEpicRequest {
    pub workspace_id: Option<Uuid>,
    pub project_id: Uuid,
    pub name: String,
    pub summary: Option<String>,
    pub priority: Option<IssuePriority>,
    pub owner_id: Option<Uuid>,
    pub start_date: Option<NaiveDate>,
    pub target_date: Option<NaiveDate>,
    pub metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSprintRequest {
    pub workspace_id: Option<Uuid>,
    pub project_id: Uuid,
    pub name: String,
    pub goal: Option<String>,
    pub start_date: Option<NaiveDate>,
    pub end_date: Option<NaiveDate>,
    pub capacity_points: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct CreateIssueDependencyRequest {
    pub workspace_id: Option<Uuid>,
    pub project_id: Uuid,
    pub source_issue_id: Uuid,
    pub target_issue_id: Uuid,
    pub dependency_type: IssueDependencyType,
    pub description: Option<String>,
    pub created_by: Option<Uuid>,
}
