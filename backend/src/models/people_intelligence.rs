/*
```cypher
CREATE
  (f:File {name: "people_intelligence.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::people_intelligence", type: "module"}),
  (c1:Class {name: "EmployeeProfile", type: "class", language: "rust"}),
  (c2:Class {name: "EmployeeCapability", type: "class", language: "rust"}),
  (c3:Class {name: "EmployeeWorkPreferences", type: "class", language: "rust"}),
  (c4:Class {name: "EmployeeEvidenceRef", type: "class", language: "rust"}),
  (c5:Class {name: "EmployeeMetricSnapshot", type: "class", language: "rust"}),
  (c6:Class {name: "EmployeeEmergentSignal", type: "class", language: "rust"}),
  (c7:Class {name: "EmployeeCorrection", type: "class", language: "rust"}),
  (c8:Class {name: "UpdateEmployeeProfileRequest", type: "class", language: "rust"}),
  (c9:Class {name: "EmployeeCapabilityInput", type: "class", language: "rust"}),
  (c10:Class {name: "VerifyCapabilityRequest", type: "class", language: "rust"}),
  (c11:Class {name: "PeopleSearchQuery", type: "class", language: "rust"}),
  (c12:Class {name: "PeopleSearchMatch", type: "class", language: "rust"}),
  (c13:Class {name: "MatchExplanation", type: "class", language: "rust"}),
  (c14:Class {name: "EmployeeEvaluation", type: "class", language: "rust"}),
  (c15:Class {name: "EvaluationDimension", type: "class", language: "rust"}),
  (c16:Class {name: "SubmitCorrectionRequest", type: "class", language: "rust"}),
  (c17:Class {name: "ContentSearchCandidate", type: "class", language: "rust"}),
  (c18:Class {name: "ContentRerankRequest", type: "class", language: "rust"}),
  (c19:Class {name: "ContentSearchResult", type: "class", language: "rust"}),
  (c20:Class {name: "PeopleReindexRequest", type: "class", language: "rust"}),
  (c21:Class {name: "PeopleReindexResponse", type: "class", language: "rust"}),
  (c22:Class {name: "EmployeeProjectionResult", type: "class", language: "rust"}),
  (c23:Class {name: "WorkEvidenceSummary", type: "class", language: "rust"}),
  (c24:Class {name: "CapabilityTaxonomyItem", type: "class", language: "rust"}),
  (fn1:Function {name: "default_accessible", type: "function", language: "rust", signature: "fn default_accessible() -> bool"}),
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
  (m)-[:CONTAINS]->(fn1);
```
*/

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeProfile {
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub role: String,
    pub department_id: Option<Uuid>,
    pub department_name: Option<String>,
    pub manager_id: Option<Uuid>,
    pub manager_name: Option<String>,
    pub job_title: Option<String>,
    pub level: Option<String>,
    pub timezone: String,
    pub languages: Vec<String>,
    pub availability_status: String,
    pub workload_percent: i32,
    pub bio: String,
    pub searchable: bool,
    pub profile_version: i64,
    pub capabilities: Vec<EmployeeCapability>,
    pub preferences: EmployeeWorkPreferences,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeCapability {
    pub id: Uuid,
    pub capability_id: Uuid,
    pub kind: String,
    pub name: String,
    pub aliases: Vec<String>,
    pub proficiency: i16,
    pub source: String,
    pub verification_status: String,
    pub evidence_count: i32,
    pub last_evidenced_at: Option<DateTime<Utc>>,
    pub verified_by: Option<Uuid>,
    pub verified_at: Option<DateTime<Utc>>,
    pub valid_until: Option<NaiveDate>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct EmployeeWorkPreferences {
    #[serde(default)]
    pub preferred_capability_ids: Vec<Uuid>,
    #[serde(default)]
    pub avoided_capability_ids: Vec<Uuid>,
    #[serde(default)]
    pub preferred_project_types: Vec<String>,
    #[serde(default)]
    pub schedule: Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeEvidenceRef {
    pub id: Uuid,
    pub evidence_type: String,
    pub source_app: String,
    pub source_entity_type: String,
    pub source_entity_id: Option<Uuid>,
    pub project_id: Option<Uuid>,
    pub occurred_at: DateTime<Utc>,
    pub weight: f64,
    pub metadata: Value,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize)]
pub struct EmployeeMetricSnapshot {
    pub window_days: i32,
    pub sample_size: i32,
    pub project_count: i32,
    pub confidence: f64,
    pub metrics: Value,
    pub as_of_date: NaiveDate,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeEmergentSignal {
    pub id: Uuid,
    pub signal_type: String,
    pub title: String,
    pub summary: String,
    pub confidence: f64,
    pub evidence_count: i32,
    pub status: String,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeCorrection {
    pub id: Uuid,
    pub employee_id: Uuid,
    pub correction_type: String,
    pub target_id: Option<Uuid>,
    pub reason: String,
    pub proposed_value: Option<Value>,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateEmployeeProfileRequest {
    pub job_title: Option<String>,
    pub level: Option<String>,
    pub timezone: Option<String>,
    pub languages: Option<Vec<String>>,
    pub availability_status: Option<String>,
    pub workload_percent: Option<i32>,
    pub bio: Option<String>,
    pub searchable: Option<bool>,
    pub capabilities: Option<Vec<EmployeeCapabilityInput>>,
    pub preferences: Option<EmployeeWorkPreferences>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct EmployeeCapabilityInput {
    pub capability_id: Uuid,
    pub proficiency: i16,
}

#[derive(Debug, Deserialize)]
pub struct VerifyCapabilityRequest {
    pub verification_status: String,
    pub proficiency: Option<i16>,
    pub valid_until: Option<NaiveDate>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct PeopleSearchQuery {
    pub workspace_id: Uuid,
    pub query: String,
    #[serde(default)]
    pub capability_ids: Vec<Uuid>,
    #[serde(default)]
    pub kinds: Vec<String>,
    #[serde(default)]
    pub languages: Vec<String>,
    pub availability_status: Option<String>,
    pub max_workload_percent: Option<i32>,
    pub project_id: Option<Uuid>,
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, Serialize)]
pub struct PeopleSearchMatch {
    pub employee: EmployeeProfile,
    pub score: f64,
    pub explanation: MatchExplanation,
}

#[derive(Debug, Clone, Serialize)]
pub struct MatchExplanation {
    pub semantic_score: f64,
    pub verified_capability_score: f64,
    pub evidence_score: f64,
    pub availability_score: f64,
    pub context_score: f64,
    pub evidence_count: i32,
    pub evidence_from: Option<DateTime<Utc>>,
    pub evidence_to: Option<DateTime<Utc>>,
    pub confidence: f64,
    pub reasons: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeEvaluation {
    pub employee: EmployeeProfile,
    pub window_days: i32,
    pub insufficient_evidence: bool,
    pub sample_size: i32,
    pub project_count: i32,
    pub confidence: f64,
    pub dimensions: Vec<EvaluationDimension>,
    pub signals: Vec<EmployeeEmergentSignal>,
    pub recent_evidence: Vec<EmployeeEvidenceRef>,
    pub disclaimer: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct EvaluationDimension {
    pub key: String,
    pub label: String,
    pub value: Option<f64>,
    pub unit: String,
    pub status: String,
    pub confidence: f64,
    pub evidence_count: i32,
    pub explanation: String,
}

#[derive(Debug, Deserialize)]
pub struct SubmitCorrectionRequest {
    pub correction_type: String,
    pub target_id: Option<Uuid>,
    pub reason: String,
    pub proposed_value: Option<Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContentSearchCandidate {
    pub id: String,
    pub content_type: String,
    pub title: String,
    pub summary: String,
    pub base_score: f64,
    pub project_id: Option<Uuid>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default = "default_accessible")]
    pub accessible: bool,
}

#[derive(Debug, Deserialize)]
pub struct ContentRerankRequest {
    pub project_id: Option<Uuid>,
    pub candidates: Vec<ContentSearchCandidate>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ContentSearchResult {
    #[serde(flatten)]
    pub candidate: ContentSearchCandidate,
    pub personalized_score: f64,
    pub reasons: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct PeopleReindexRequest {
    pub workspace_id: Uuid,
    #[serde(default)]
    pub employee_ids: Vec<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct PeopleReindexResponse {
    pub requested: usize,
    pub indexed: usize,
    pub failed: usize,
    pub results: Vec<EmployeeProjectionResult>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmployeeProjectionResult {
    pub employee_id: Uuid,
    pub point_id: Uuid,
    pub collection: String,
    pub provider: String,
    pub indexed: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Default)]
pub struct WorkEvidenceSummary {
    pub window_days: i32,
    pub completed_issues: i32,
    pub project_count: i32,
    pub on_time_issues: i32,
    pub first_pass_approved: i32,
    pub qa_passed: i32,
    pub revision_count: i32,
    pub review_completed: i32,
    pub delivery_count: i32,
    pub work_log_count: i32,
    pub estimated_story_points: f64,
    pub logged_minutes: i64,
    pub evidence_from: Option<DateTime<Utc>>,
    pub evidence_to: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct CapabilityTaxonomyItem {
    pub id: Uuid,
    pub parent_id: Option<Uuid>,
    pub kind: String,
    pub name: String,
    pub normalized_name: String,
    pub aliases: Vec<String>,
    pub description: Option<String>,
    pub status: String,
    pub discovered_by: String,
}

fn default_accessible() -> bool {
    true
}
