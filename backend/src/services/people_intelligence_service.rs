/*
```cypher
CREATE
  (f:File {name: "people_intelligence_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::people_intelligence_service", type: "module"}),
  (c1:Class {name: "PeopleIntelligenceService", type: "class", language: "rust"}),
  (c2:Class {name: "EmployeeProfileRow", type: "class", language: "rust"}),
  (c3:Class {name: "EmployeeCapabilityRow", type: "class", language: "rust"}),
  (c4:Class {name: "EmployeeEvidenceRow", type: "class", language: "rust"}),
  (c5:Class {name: "EmployeeSignalRow", type: "class", language: "rust"}),
  (c6:Class {name: "EmployeeCorrectionRow", type: "class", language: "rust"}),
  (c7:Class {name: "QdrantPoint", type: "class", language: "rust"}),
  (c8:Class {name: "QdrantSearchResponse", type: "class", language: "rust"}),
  (c9:Class {name: "QdrantSearchResult", type: "class", language: "rust"}),
  (c10:Class {name: "PendingPeopleEvent", type: "class", language: "rust"}),
  (fn1:Function {name: "PeopleIntelligenceService::new", type: "function", language: "rust"}),
  (fn2:Function {name: "PeopleIntelligenceService::load_profile", type: "function", language: "rust"}),
  (fn3:Function {name: "PeopleIntelligenceService::load_capability", type: "function", language: "rust"}),
  (fn4:Function {name: "PeopleIntelligenceService::reconcile_employee_evidence", type: "function", language: "rust"}),
  (fn5:Function {name: "PeopleIntelligenceService::load_recent_evidence", type: "function", language: "rust"}),
  (fn6:Function {name: "PeopleIntelligenceService::load_signals", type: "function", language: "rust"}),
  (fn7:Function {name: "PeopleIntelligenceService::upsert_metric_snapshot", type: "function", language: "rust"}),
  (fn8:Function {name: "PeopleIntelligenceService::build_embedding", type: "function", language: "rust"}),
  (fn9:Function {name: "PeopleIntelligenceService::projection_document", type: "function", language: "rust"}),
  (fn10:Function {name: "PeopleIntelligenceService::ensure_collection", type: "function", language: "rust"}),
  (fn11:Function {name: "PeopleIntelligenceService::upsert_qdrant_point", type: "function", language: "rust"}),
  (fn12:Function {name: "PeopleIntelligenceService::search_qdrant", type: "function", language: "rust"}),
  (fn13:Function {name: "EmployeeIntelligenceIf::get_profile", type: "function", language: "rust"}),
  (fn14:Function {name: "EmployeeIntelligenceIf::update_self_profile", type: "function", language: "rust"}),
  (fn15:Function {name: "EmployeeIntelligenceIf::verify_capability", type: "function", language: "rust"}),
  (fn16:Function {name: "EmployeeIntelligenceIf::search_people", type: "function", language: "rust"}),
  (fn17:Function {name: "EmployeeIntelligenceIf::get_evaluation", type: "function", language: "rust"}),
  (fn18:Function {name: "EmployeeIntelligenceIf::submit_correction", type: "function", language: "rust"}),
  (fn19:Function {name: "EmployeeIntelligenceIf::rerank_content", type: "function", language: "rust"}),
  (fn20:Function {name: "EmployeeIntelligenceIf::refresh_employee_projection", type: "function", language: "rust"}),
  (fn21:Function {name: "ensure_internal_actor", type: "function", language: "rust"}),
  (fn22:Function {name: "can_evaluate", type: "function", language: "rust"}),
  (fn23:Function {name: "normalize_role", type: "function", language: "rust"}),
  (fn24:Function {name: "validate_profile_request", type: "function", language: "rust"}),
  (fn25:Function {name: "build_dimensions", type: "function", language: "rust"}),
  (fn26:Function {name: "build_emergent_signals", type: "function", language: "rust"}),
  (fn27:Function {name: "ratio", type: "function", language: "rust"}),
  (fn28:Function {name: "confidence", type: "function", language: "rust"}),
  (fn29:Function {name: "lexical_similarity", type: "function", language: "rust"}),
  (fn30:Function {name: "normalized_terms", type: "function", language: "rust"}),
  (fn31:Function {name: "hash_embedding", type: "function", language: "rust"}),
  (fn32:Function {name: "normalize_vector", type: "function", language: "rust"}),
  (fn33:Function {name: "safe_collection_segment", type: "function", language: "rust"}),
  (fn34:Function {name: "clamp_score", type: "function", language: "rust"}),
  (fn35:Function {name: "EmployeeCapability::from", type: "function", language: "rust"}),
  (fn36:Function {name: "EmployeeEvidenceRef::from", type: "function", language: "rust"}),
  (fn37:Function {name: "EmployeeEmergentSignal::from", type: "function", language: "rust"}),
  (fn38:Function {name: "EmployeeCorrection::from", type: "function", language: "rust"}),
  (fn39:Function {name: "PeopleIntelligenceService::employee_ids_for_workspace", type: "function", language: "rust"}),
  (fn40:Function {name: "EmployeeIntelligenceIf::list_capabilities", type: "function", language: "rust"}),
  (fn41:Function {name: "EmployeeIntelligenceIf::approve_capability", type: "function", language: "rust"}),
  (fn42:Function {name: "PeopleIntelligenceService::spawn_event_consumer", type: "function", language: "rust"}),
  (fn43:Function {name: "PeopleIntelligenceService::consume_pending_events", type: "function", language: "rust"}),
  (fn44:Function {name: "PeopleIntelligenceService::employee_ids_for_event", type: "function", language: "rust"}),
  (fn45:Function {name: "PeopleIntelligenceService::reconcile_all_projections", type: "function", language: "rust"}),
  (fn46:Function {name: "payload_uuid", type: "function", language: "rust"}),
  (tm:Module {name: "crate::services::people_intelligence_service::tests", type: "module"}),
  (tfn1:Function {name: "hash_embedding_is_stable_and_normalized", type: "function", language: "rust"}),
  (tfn2:Function {name: "lexical_similarity_supports_chinese_bigrams", type: "function", language: "rust"}),
  (tfn3:Function {name: "confidence_requires_samples_and_projects", type: "function", language: "rust"}),
  (tfn4:Function {name: "external_roles_are_rejected", type: "function", language: "rust"}),
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
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (c1)-[:HAS_METHOD]->(fn10),
  (c1)-[:HAS_METHOD]->(fn11),
  (c1)-[:HAS_METHOD]->(fn12),
  (c1)-[:HAS_METHOD]->(fn13),
  (c1)-[:HAS_METHOD]->(fn14),
  (c1)-[:HAS_METHOD]->(fn15),
  (c1)-[:HAS_METHOD]->(fn16),
  (c1)-[:HAS_METHOD]->(fn17),
  (c1)-[:HAS_METHOD]->(fn18),
  (c1)-[:HAS_METHOD]->(fn19),
  (c1)-[:HAS_METHOD]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
  (m)-[:CONTAINS]->(fn23),
  (m)-[:CONTAINS]->(fn24),
  (m)-[:CONTAINS]->(fn25),
  (m)-[:CONTAINS]->(fn26),
  (m)-[:CONTAINS]->(fn27),
  (m)-[:CONTAINS]->(fn28),
  (m)-[:CONTAINS]->(fn29),
  (m)-[:CONTAINS]->(fn30),
  (m)-[:CONTAINS]->(fn31),
  (m)-[:CONTAINS]->(fn32),
  (m)-[:CONTAINS]->(fn33),
  (m)-[:CONTAINS]->(fn34),
  (m)-[:CONTAINS]->(fn35),
  (m)-[:CONTAINS]->(fn36),
  (m)-[:CONTAINS]->(fn37),
  (m)-[:CONTAINS]->(fn38),
  (c1)-[:HAS_METHOD]->(fn39),
  (c1)-[:HAS_METHOD]->(fn40),
  (c1)-[:HAS_METHOD]->(fn41),
  (c1)-[:HAS_METHOD]->(fn42),
  (c1)-[:HAS_METHOD]->(fn43),
  (c1)-[:HAS_METHOD]->(fn44),
  (c1)-[:HAS_METHOD]->(fn45),
  (m)-[:CONTAINS]->(fn46),
  (m)-[:CONTAINS]->(tm),
  (tm)-[:CONTAINS]->(tfn1),
  (tm)-[:CONTAINS]->(tfn2),
  (tm)-[:CONTAINS]->(tfn3),
  (tm)-[:CONTAINS]->(tfn4),
  (fn2)-[:CALLS]->(fn3),
  (fn8)-[:CALLS]->(fn31),
  (fn8)-[:CALLS]->(fn32),
  (fn9)-[:CALLS]->(fn2),
  (fn10)-[:CALLS]->(fn33),
  (fn13)-[:CALLS]->(fn21),
  (fn13)-[:CALLS]->(fn2),
  (fn14)-[:CALLS]->(fn21),
  (fn14)-[:CALLS]->(fn24),
  (fn14)-[:CALLS]->(fn2),
  (fn15)-[:CALLS]->(fn22),
  (fn15)-[:CALLS]->(fn3),
  (fn16)-[:CALLS]->(fn21),
  (fn16)-[:CALLS]->(fn8),
  (fn16)-[:CALLS]->(fn12),
  (fn16)-[:CALLS]->(fn2),
  (fn16)-[:CALLS]->(fn29),
  (fn16)-[:CALLS]->(fn28),
  (fn16)-[:CALLS]->(fn34),
  (fn17)-[:CALLS]->(fn22),
  (fn17)-[:CALLS]->(fn4),
  (fn17)-[:CALLS]->(fn2),
  (fn17)-[:CALLS]->(fn25),
  (fn17)-[:CALLS]->(fn26),
  (fn17)-[:CALLS]->(fn5),
  (fn17)-[:CALLS]->(fn6),
  (fn17)-[:CALLS]->(fn7),
  (fn18)-[:CALLS]->(fn21),
  (fn19)-[:CALLS]->(fn21),
  (fn19)-[:CALLS]->(fn2),
  (fn19)-[:CALLS]->(fn29),
  (fn19)-[:CALLS]->(fn34),
  (fn20)-[:CALLS]->(fn4),
  (fn20)-[:CALLS]->(fn9),
  (fn20)-[:CALLS]->(fn8),
  (fn20)-[:CALLS]->(fn10),
  (fn20)-[:CALLS]->(fn11),
  (fn22)-[:CALLS]->(fn23),
  (fn25)-[:CALLS]->(fn27),
  (fn25)-[:CALLS]->(fn28),
  (fn29)-[:CALLS]->(fn30),
  (fn31)-[:CALLS]->(fn32);
```
*/

use std::{
    collections::{HashMap, HashSet},
    env,
    time::Duration,
};

use chrono::{DateTime, NaiveDate, Utc};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use sqlx::{types::Json, FromRow, PgPool, Row};
use uuid::Uuid;

use crate::{
    config::RagMemoryConfig,
    errors::AppError,
    interfaces::{
        employee_intelligence_if::EmployeeIntelligenceIf, work_evidence_if::WorkEvidenceIf,
        AppActor,
    },
    models::people_intelligence::{
        CapabilityTaxonomyItem, ContentRerankRequest, ContentSearchResult, EmployeeCapability,
        EmployeeCorrection, EmployeeEmergentSignal, EmployeeEvaluation, EmployeeEvidenceRef,
        EmployeeProfile, EmployeeProjectionResult, EmployeeWorkPreferences, EvaluationDimension,
        MatchExplanation, PeopleSearchMatch, PeopleSearchQuery, SubmitCorrectionRequest,
        UpdateEmployeeProfileRequest, VerifyCapabilityRequest, WorkEvidenceSummary,
    },
    services::{
        ai_provider_service::{AiProviderConfig, AiProviderService},
        event_publisher_service::{DomainEventInput, EventPublisherService},
        work_evidence_service::WorkEvidenceService,
    },
};

const MIN_EVALUATION_TASKS: i32 = 5;
const MIN_EVALUATION_PROJECTS: i32 = 2;
const PEOPLE_EVENT_BATCH_SIZE: i64 = 100;
const PEOPLE_EVENT_TYPES: &[&str] = &[
    "AssetUploaded",
    "AssetUpdated",
    "AssetDeleted",
    "IssueCreated",
    "IssueUpdated",
    "IssueTransitioned",
    "IssueDeleted",
    "IssueAssetAttached",
    "IssueWorkLogCreated",
    "ReviewCreated",
    "IssueApproved",
    "RevisionRequested",
    "DeliveryPackageCreated",
    "DeliveryPackageSubmissionRequested",
    "employee.profile.changed",
    "capability.verified",
];

#[derive(Clone)]
pub struct PeopleIntelligenceService {
    pool: PgPool,
    vector_config: RagMemoryConfig,
    client: reqwest::Client,
    work_evidence: WorkEvidenceService,
    event_publisher: EventPublisherService,
}

#[derive(FromRow)]
struct EmployeeProfileRow {
    user_id: Uuid,
    workspace_id: Uuid,
    username: String,
    display_name: String,
    avatar_url: Option<String>,
    role: String,
    department_id: Option<Uuid>,
    department_name: Option<String>,
    manager_id: Option<Uuid>,
    manager_name: Option<String>,
    job_title: Option<String>,
    level: Option<String>,
    timezone: String,
    languages: Vec<String>,
    availability_status: String,
    workload_percent: i32,
    bio: String,
    searchable: bool,
    profile_version: i64,
    updated_at: DateTime<Utc>,
}

#[derive(FromRow)]
struct EmployeeCapabilityRow {
    id: Uuid,
    capability_id: Uuid,
    kind: String,
    name: String,
    aliases: Vec<String>,
    proficiency: i16,
    source: String,
    verification_status: String,
    evidence_count: i32,
    last_evidenced_at: Option<DateTime<Utc>>,
    verified_by: Option<Uuid>,
    verified_at: Option<DateTime<Utc>>,
    valid_until: Option<NaiveDate>,
}

#[derive(FromRow)]
struct EmployeeEvidenceRow {
    id: Uuid,
    evidence_type: String,
    source_app: String,
    source_entity_type: String,
    source_entity_id: Option<Uuid>,
    project_id: Option<Uuid>,
    occurred_at: DateTime<Utc>,
    weight: f64,
    metadata: Json<Value>,
}

#[derive(FromRow)]
struct EmployeeSignalRow {
    id: Uuid,
    signal_type: String,
    title: String,
    summary: String,
    confidence: f64,
    evidence_count: i32,
    status: String,
    metadata: Json<Value>,
    created_at: DateTime<Utc>,
}

#[derive(FromRow)]
struct EmployeeCorrectionRow {
    id: Uuid,
    employee_id: Uuid,
    correction_type: String,
    target_id: Option<Uuid>,
    reason: String,
    proposed_value: Option<Json<Value>>,
    status: String,
    created_at: DateTime<Utc>,
}

#[derive(Serialize)]
struct QdrantPoint {
    id: String,
    vector: Vec<f32>,
    payload: Value,
}

#[derive(Deserialize)]
struct QdrantSearchResponse {
    result: Vec<QdrantSearchResult>,
}

#[derive(Deserialize)]
struct QdrantSearchResult {
    score: f64,
    payload: Option<Value>,
}

#[derive(FromRow)]
struct PendingPeopleEvent {
    event_id: Uuid,
    event_type: String,
    aggregate_type: String,
    aggregate_id: Uuid,
    payload: Value,
}

impl PeopleIntelligenceService {
    pub fn new(
        pool: PgPool,
        mut vector_config: RagMemoryConfig,
        event_publisher: EventPublisherService,
    ) -> Self {
        vector_config.collection = "assetslake_people".to_string();
        vector_config.vector_size = vector_config.vector_size.clamp(8, 4096);
        Self {
            work_evidence: WorkEvidenceService::new(pool.clone()),
            pool,
            vector_config,
            client: reqwest::Client::builder()
                .connect_timeout(Duration::from_secs(3))
                .timeout(Duration::from_secs(12))
                .build()
                .expect("people intelligence HTTP client should build"),
            event_publisher,
        }
    }

    pub fn spawn_event_consumer(&self) {
        let enabled = env::var("PEOPLE_EVENT_CONSUMER_ENABLED")
            .ok()
            .map(|value| {
                matches!(
                    value.trim().to_ascii_lowercase().as_str(),
                    "1" | "true" | "yes" | "on"
                )
            })
            .unwrap_or(true);
        if !enabled {
            return;
        }
        let event_interval = env::var("PEOPLE_EVENT_CONSUMER_INTERVAL_SECONDS")
            .ok()
            .and_then(|value| value.parse::<u64>().ok())
            .unwrap_or(15)
            .clamp(5, 3600);
        let reconcile_interval = env::var("PEOPLE_RECONCILE_INTERVAL_SECONDS")
            .ok()
            .and_then(|value| value.parse::<u64>().ok())
            .unwrap_or(86_400)
            .clamp(300, 604_800);
        let service = self.clone();
        tokio::spawn(async move {
            let mut event_timer = tokio::time::interval(Duration::from_secs(event_interval));
            let mut reconcile_timer =
                tokio::time::interval(Duration::from_secs(reconcile_interval));
            event_timer.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
            reconcile_timer.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
            reconcile_timer.tick().await;
            loop {
                tokio::select! {
                    _ = event_timer.tick() => {
                        match service.consume_pending_events().await {
                            Ok(processed) if processed > 0 => {
                                tracing::info!(processed, "People intelligence events processed");
                            }
                            Ok(_) => {}
                            Err(error) => {
                                tracing::warn!(error = %error, "People intelligence event pass failed");
                            }
                        }
                    }
                    _ = reconcile_timer.tick() => {
                        match service.reconcile_all_projections().await {
                            Ok(indexed) => {
                                tracing::info!(indexed, "People intelligence nightly reconciliation completed");
                            }
                            Err(error) => {
                                tracing::warn!(error = %error, "People intelligence nightly reconciliation failed");
                            }
                        }
                    }
                }
            }
        });
    }

    async fn consume_pending_events(&self) -> Result<usize, AppError> {
        let event_types = PEOPLE_EVENT_TYPES
            .iter()
            .map(|value| (*value).to_string())
            .collect::<Vec<_>>();
        let events = sqlx::query_as::<_, PendingPeopleEvent>(
            r#"
            WITH candidates AS (
                SELECT outbox.event_id, outbox.event_type
                FROM outbox_events outbox
                LEFT JOIN people_event_receipts receipt ON receipt.event_id = outbox.event_id
                WHERE outbox.event_type = ANY($1)
                  AND (
                        receipt.event_id IS NULL
                        OR (receipt.status = 'failed' AND receipt.available_at <= NOW())
                        OR (receipt.status = 'processing' AND receipt.updated_at <= NOW() - INTERVAL '5 minutes')
                  )
                ORDER BY outbox.occurred_at, outbox.event_id
                LIMIT $2
            ), claimed AS (
                INSERT INTO people_event_receipts (
                    event_id, event_type, status, attempt_count, available_at,
                    last_error, processed_at, updated_at
                )
                SELECT event_id, event_type, 'processing', 1, NOW(), NULL, NULL, NOW()
                FROM candidates
                ON CONFLICT (event_id) DO UPDATE SET
                    status = 'processing',
                    attempt_count = people_event_receipts.attempt_count + 1,
                    last_error = NULL,
                    updated_at = NOW()
                WHERE (people_event_receipts.status = 'failed' AND people_event_receipts.available_at <= NOW())
                   OR (people_event_receipts.status = 'processing'
                       AND people_event_receipts.updated_at <= NOW() - INTERVAL '5 minutes')
                RETURNING event_id
            )
            SELECT outbox.event_id, outbox.event_type, outbox.aggregate_type,
                   outbox.aggregate_id, outbox.payload
            FROM outbox_events outbox
            JOIN claimed ON claimed.event_id = outbox.event_id
            ORDER BY outbox.occurred_at, outbox.event_id
            "#,
        )
        .bind(event_types)
        .bind(PEOPLE_EVENT_BATCH_SIZE)
        .fetch_all(&self.pool)
        .await?;

        let mut processed = 0;
        for event in events {
            let result = async {
                let employee_ids = self.employee_ids_for_event(&event).await?;
                let actor = AppActor {
                    user_id: Uuid::nil(),
                    display_name: "People Intelligence Worker".to_string(),
                    role: "admin".to_string(),
                };
                for employee_id in employee_ids {
                    self.refresh_employee_projection(&actor, None, employee_id)
                        .await?;
                }
                Ok::<(), AppError>(())
            }
            .await;
            match result {
                Ok(()) => {
                    sqlx::query(
                        r#"
                        UPDATE people_event_receipts
                        SET status = 'processed', processed_at = NOW(), last_error = NULL
                        WHERE event_id = $1
                        "#,
                    )
                    .bind(event.event_id)
                    .execute(&self.pool)
                    .await?;
                    processed += 1;
                }
                Err(error) => {
                    tracing::warn!(
                        event_id = %event.event_id,
                        event_type = %event.event_type,
                        error = %error,
                        "People intelligence event will be retried"
                    );
                    sqlx::query(
                        r#"
                        UPDATE people_event_receipts
                        SET status = 'failed', last_error = $2,
                            available_at = NOW() + make_interval(
                                secs => LEAST(attempt_count * 30, 900)
                            )
                        WHERE event_id = $1
                        "#,
                    )
                    .bind(event.event_id)
                    .bind(error.to_string())
                    .execute(&self.pool)
                    .await?;
                }
            }
        }
        Ok(processed)
    }

    async fn employee_ids_for_event(
        &self,
        event: &PendingPeopleEvent,
    ) -> Result<Vec<Uuid>, AppError> {
        let mut employee_ids = HashSet::new();
        for key in [
            "employee_id",
            "assignee_id",
            "reviewer_id",
            "submitted_by",
            "included_by",
            "uploader_id",
        ] {
            if let Some(employee_id) = payload_uuid(&event.payload, key) {
                employee_ids.insert(employee_id);
            }
        }

        match event.aggregate_type.as_str() {
            "issue" => {
                let ids = sqlx::query_scalar::<_, Uuid>(
                    r#"
                    SELECT user_id
                    FROM (
                        SELECT assignee_id AS user_id FROM issues WHERE id = $1
                        UNION
                        SELECT user_id FROM issue_assignments WHERE issue_id = $1
                    ) employee
                    WHERE user_id IS NOT NULL
                    "#,
                )
                .bind(event.aggregate_id)
                .fetch_all(&self.pool)
                .await?;
                employee_ids.extend(ids);
            }
            "delivery_package" => {
                let ids = sqlx::query_scalar::<_, Uuid>(
                    r#"
                    SELECT user_id
                    FROM (
                        SELECT submitted_by AS user_id FROM delivery_packages WHERE id = $1
                        UNION
                        SELECT included_by FROM delivery_package_assets WHERE package_id = $1
                    ) employee
                    WHERE user_id IS NOT NULL
                    "#,
                )
                .bind(event.aggregate_id)
                .fetch_all(&self.pool)
                .await?;
                employee_ids.extend(ids);
            }
            "asset" => {
                if let Some(employee_id) = sqlx::query_scalar::<_, Option<Uuid>>(
                    "SELECT uploader_id FROM assets WHERE id = $1",
                )
                .bind(event.aggregate_id)
                .fetch_optional(&self.pool)
                .await?
                .flatten()
                {
                    employee_ids.insert(employee_id);
                }
            }
            "employee" => {
                employee_ids.insert(event.aggregate_id);
            }
            _ => {}
        }

        let mut internal_ids = Vec::new();
        for employee_id in employee_ids {
            let indexed = sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM employee_profiles WHERE user_id = $1)",
            )
            .bind(employee_id)
            .fetch_one(&self.pool)
            .await?;
            if indexed {
                internal_ids.push(employee_id);
            }
        }
        internal_ids.sort_unstable();
        Ok(internal_ids)
    }

    async fn reconcile_all_projections(&self) -> Result<usize, AppError> {
        let employee_ids = sqlx::query_scalar::<_, Uuid>(
            r#"
            SELECT profile.user_id
            FROM employee_profiles profile
            JOIN users account ON account.id = profile.user_id
            WHERE profile.searchable = TRUE
              AND account.deleted_at IS NULL
              AND lower(account.role) NOT IN ('client', 'vendor', 'external', 'supplier')
            ORDER BY profile.user_id
            "#,
        )
        .fetch_all(&self.pool)
        .await?;
        let actor = AppActor {
            user_id: Uuid::nil(),
            display_name: "People Intelligence Reconciler".to_string(),
            role: "admin".to_string(),
        };
        let mut indexed = 0;
        for employee_id in employee_ids {
            match self
                .refresh_employee_projection(&actor, None, employee_id)
                .await
            {
                Ok(result) if result.indexed => indexed += 1,
                Ok(_) => {}
                Err(error) => {
                    tracing::warn!(employee_id = %employee_id, error = %error, "Employee projection reconciliation failed");
                }
            }
        }
        Ok(indexed)
    }

    pub async fn employee_ids_for_workspace(
        &self,
        workspace_id: Uuid,
    ) -> Result<Vec<Uuid>, AppError> {
        Ok(sqlx::query_scalar::<_, Uuid>(
            r#"
            SELECT profile.user_id
            FROM employee_profiles profile
            JOIN users user_account ON user_account.id = profile.user_id
            WHERE profile.workspace_id = $1
              AND profile.searchable = TRUE
              AND user_account.deleted_at IS NULL
              AND LOWER(user_account.role) NOT IN ('client', 'vendor')
            ORDER BY profile.user_id
            "#,
        )
        .bind(workspace_id)
        .fetch_all(&self.pool)
        .await?)
    }

    async fn load_profile(&self, employee_id: Uuid) -> Result<EmployeeProfile, AppError> {
        sqlx::query(
            r#"
            INSERT INTO employee_profiles (user_id, workspace_id)
            SELECT id, '00000000-0000-0000-0000-000000000001'
            FROM users
            WHERE id = $1 AND deleted_at IS NULL AND LOWER(role) NOT IN ('client', 'vendor')
            ON CONFLICT (user_id) DO NOTHING
            "#,
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;

        let row = sqlx::query_as::<_, EmployeeProfileRow>(
            r#"
            SELECT profile.user_id, profile.workspace_id, user_account.username,
                   COALESCE(user_account.display_name, user_account.username) AS display_name,
                   user_account.avatar_url, user_account.role,
                   profile.department_id, department.name AS department_name,
                   profile.manager_id,
                   COALESCE(manager.display_name, manager.username) AS manager_name,
                   profile.job_title, profile.level, profile.timezone, profile.languages,
                   profile.availability_status, profile.workload_percent, profile.bio,
                   profile.searchable, profile.profile_version, profile.updated_at
            FROM employee_profiles profile
            JOIN users user_account ON user_account.id = profile.user_id
            LEFT JOIN departments department ON department.id = profile.department_id
            LEFT JOIN users manager ON manager.id = profile.manager_id
            WHERE profile.user_id = $1
              AND user_account.deleted_at IS NULL
              AND LOWER(user_account.role) NOT IN ('client', 'vendor')
            "#,
        )
        .bind(employee_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::not_found("Internal employee profile not found"))?;

        let capabilities = sqlx::query_as::<_, EmployeeCapabilityRow>(
            r#"
            SELECT employee_capability.id, employee_capability.capability_id,
                   taxonomy.kind, taxonomy.name, taxonomy.aliases,
                   employee_capability.proficiency, employee_capability.source,
                   employee_capability.verification_status, employee_capability.evidence_count,
                   employee_capability.last_evidenced_at, employee_capability.verified_by,
                   employee_capability.verified_at, employee_capability.valid_until
            FROM employee_capabilities employee_capability
            JOIN capability_taxonomy taxonomy ON taxonomy.id = employee_capability.capability_id
            WHERE employee_capability.employee_id = $1
              AND taxonomy.status <> 'retired'
            ORDER BY employee_capability.verification_status = 'verified' DESC,
                     employee_capability.proficiency DESC, taxonomy.name ASC
            "#,
        )
        .bind(employee_id)
        .fetch_all(&self.pool)
        .await?
        .into_iter()
        .map(EmployeeCapability::from)
        .collect();

        let preference = sqlx::query(
            r#"
            SELECT preferred_capability_ids, avoided_capability_ids,
                   preferred_project_types, schedule
            FROM employee_work_preferences
            WHERE employee_id = $1
            "#,
        )
        .bind(employee_id)
        .fetch_optional(&self.pool)
        .await?;
        let preferences = preference
            .map(|value| EmployeeWorkPreferences {
                preferred_capability_ids: value.get("preferred_capability_ids"),
                avoided_capability_ids: value.get("avoided_capability_ids"),
                preferred_project_types: value.get("preferred_project_types"),
                schedule: value.get::<Json<Value>, _>("schedule").0,
            })
            .unwrap_or_default();

        Ok(EmployeeProfile {
            user_id: row.user_id,
            workspace_id: row.workspace_id,
            username: row.username,
            display_name: row.display_name,
            avatar_url: row.avatar_url,
            role: row.role,
            department_id: row.department_id,
            department_name: row.department_name,
            manager_id: row.manager_id,
            manager_name: row.manager_name,
            job_title: row.job_title,
            level: row.level,
            timezone: row.timezone,
            languages: row.languages,
            availability_status: row.availability_status,
            workload_percent: row.workload_percent,
            bio: row.bio,
            searchable: row.searchable,
            profile_version: row.profile_version,
            capabilities,
            preferences,
            updated_at: row.updated_at,
        })
    }

    async fn load_capability(
        &self,
        employee_id: Uuid,
        capability_id: Uuid,
    ) -> Result<EmployeeCapability, AppError> {
        sqlx::query_as::<_, EmployeeCapabilityRow>(
            r#"
            SELECT employee_capability.id, employee_capability.capability_id,
                   taxonomy.kind, taxonomy.name, taxonomy.aliases,
                   employee_capability.proficiency, employee_capability.source,
                   employee_capability.verification_status, employee_capability.evidence_count,
                   employee_capability.last_evidenced_at, employee_capability.verified_by,
                   employee_capability.verified_at, employee_capability.valid_until
            FROM employee_capabilities employee_capability
            JOIN capability_taxonomy taxonomy ON taxonomy.id = employee_capability.capability_id
            WHERE employee_capability.employee_id = $1
              AND employee_capability.capability_id = $2
            "#,
        )
        .bind(employee_id)
        .bind(capability_id)
        .fetch_optional(&self.pool)
        .await?
        .map(EmployeeCapability::from)
        .ok_or_else(|| AppError::not_found("Employee capability not found"))
    }

    async fn reconcile_employee_evidence(&self, employee_id: Uuid) -> Result<(), AppError> {
        sqlx::query(
            "DELETE FROM employee_evidence WHERE employee_id = $1 AND source_app = 'production'",
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;

        sqlx::query(
            r#"
            UPDATE employee_capabilities
            SET evidence_count = 0, last_evidenced_at = NULL
            WHERE employee_id = $1 AND source = 'system'
            "#,
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO capability_taxonomy (
                workspace_id, kind, name, normalized_name, aliases, status, discovered_by
            )
            SELECT DISTINCT issue.workspace_id, 'asset_type',
                   REPLACE(INITCAP(REPLACE(issue.issue_type::text, '_', ' ')), ' ', ' '),
                   REPLACE(issue.issue_type::text, '_', '-'), ARRAY[issue.issue_type::text],
                   'candidate', 'system'
            FROM issues issue
            WHERE issue.assignee_id = $1
              AND issue.deleted_at IS NULL
              AND NOT EXISTS (
                    SELECT 1 FROM capability_taxonomy taxonomy
                    WHERE taxonomy.workspace_id = issue.workspace_id
                      AND taxonomy.normalized_name = REPLACE(issue.issue_type::text, '_', '-')
              )
            ON CONFLICT (workspace_id, kind, normalized_name) DO NOTHING
            "#,
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO employee_evidence (
                id, event_id, workspace_id, employee_id, capability_id, project_id,
                evidence_type, source_app, source_entity_type, source_entity_id,
                weight, occurred_at, metadata
            )
            SELECT uuid_generate_v4(),
                   uuid_generate_v5(
                       '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid,
                       $1::text || ':' || issue.id::text || ':issue-work'
                   ),
                   issue.workspace_id, $1, taxonomy.id, issue.project_id,
                   CASE WHEN issue.status::text IN ('approved', 'delivered', 'archived')
                        THEN 'issue.completed' ELSE 'issue.progress' END,
                   'production', 'issue', issue.id,
                   CASE WHEN issue.status::text IN ('approved', 'delivered', 'archived')
                        THEN 1.0 ELSE 0.35 END,
                   issue.updated_at,
                   jsonb_build_object(
                       'issue_type', issue.issue_type::text,
                       'asset_type', issue.asset_type::text,
                       'status', issue.status::text,
                       'qa_status', issue.qa_status::text,
                       'revision_count', issue.revision_count,
                       'story_points', issue.story_points
                   )
            FROM issues issue
            LEFT JOIN capability_taxonomy taxonomy
              ON taxonomy.workspace_id = issue.workspace_id
             AND taxonomy.normalized_name = REPLACE(issue.issue_type::text, '_', '-')
            WHERE issue.assignee_id = $1 AND issue.deleted_at IS NULL
            ON CONFLICT (event_id) DO UPDATE SET
                evidence_type = EXCLUDED.evidence_type,
                weight = EXCLUDED.weight,
                occurred_at = EXCLUDED.occurred_at,
                metadata = EXCLUDED.metadata,
                capability_id = EXCLUDED.capability_id
            "#,
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO employee_capabilities (
                employee_id, capability_id, proficiency, source, verification_status,
                evidence_count, last_evidenced_at
            )
            SELECT evidence.employee_id, evidence.capability_id,
                   LEAST(5, GREATEST(1, CEIL(LN(COUNT(*) + 1))::smallint)),
                   'system', 'pending', COUNT(*)::integer, MAX(evidence.occurred_at)
            FROM employee_evidence evidence
            WHERE evidence.employee_id = $1 AND evidence.capability_id IS NOT NULL
            GROUP BY evidence.employee_id, evidence.capability_id
            ON CONFLICT (employee_id, capability_id) DO UPDATE SET
                evidence_count = EXCLUDED.evidence_count,
                last_evidenced_at = EXCLUDED.last_evidenced_at,
                proficiency = CASE
                    WHEN employee_capabilities.source = 'system' THEN EXCLUDED.proficiency
                    ELSE employee_capabilities.proficiency
                END
            "#,
        )
        .bind(employee_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn load_recent_evidence(
        &self,
        employee_id: Uuid,
        window_days: i32,
    ) -> Result<Vec<EmployeeEvidenceRef>, AppError> {
        Ok(sqlx::query_as::<_, EmployeeEvidenceRow>(
            r#"
            SELECT id, evidence_type, source_app, source_entity_type, source_entity_id,
                   project_id, occurred_at, weight::double precision AS weight, metadata
            FROM employee_evidence
            WHERE employee_id = $1
              AND occurred_at >= NOW() - make_interval(days => $2)
            ORDER BY occurred_at DESC
            LIMIT 40
            "#,
        )
        .bind(employee_id)
        .bind(window_days)
        .fetch_all(&self.pool)
        .await?
        .into_iter()
        .map(EmployeeEvidenceRef::from)
        .collect())
    }

    async fn load_signals(
        &self,
        employee_id: Uuid,
    ) -> Result<Vec<EmployeeEmergentSignal>, AppError> {
        Ok(sqlx::query_as::<_, EmployeeSignalRow>(
            r#"
            SELECT id, signal_type, title, summary, confidence::double precision AS confidence,
                   evidence_count, status, metadata, created_at
            FROM employee_emergent_signals
            WHERE employee_id = $1 AND status = 'active'
              AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY confidence DESC, created_at DESC
            LIMIT 12
            "#,
        )
        .bind(employee_id)
        .fetch_all(&self.pool)
        .await?
        .into_iter()
        .map(EmployeeEmergentSignal::from)
        .collect())
    }

    async fn upsert_metric_snapshot(
        &self,
        employee_id: Uuid,
        workspace_id: Uuid,
        summary: &WorkEvidenceSummary,
        dimensions: &[EvaluationDimension],
    ) -> Result<(), AppError> {
        let metrics = serde_json::to_value(dimensions)
            .map_err(|error| AppError::internal(error.to_string()))?;
        sqlx::query(
            r#"
            INSERT INTO employee_metric_snapshots (
                employee_id, workspace_id, window_days, sample_size, project_count,
                confidence, metrics
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (employee_id, window_days, as_of_date) DO UPDATE SET
                sample_size = EXCLUDED.sample_size,
                project_count = EXCLUDED.project_count,
                confidence = EXCLUDED.confidence,
                metrics = EXCLUDED.metrics
            "#,
        )
        .bind(employee_id)
        .bind(workspace_id)
        .bind(summary.window_days)
        .bind(summary.completed_issues)
        .bind(summary.project_count)
        .bind(confidence(summary.completed_issues, summary.project_count))
        .bind(Json(metrics))
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn build_embedding(
        &self,
        ai_config: Option<&AiProviderConfig>,
        text: &str,
        input_type: &str,
    ) -> (Vec<f32>, String, String) {
        if let Some(config) = ai_config {
            let provider = AiProviderService::new();
            match provider
                .embed_text_with_input_type(config, text, input_type)
                .await
            {
                Ok(vector) if !vector.is_empty() => {
                    return (
                        normalize_vector(vector, self.vector_config.vector_size),
                        config.provider.clone(),
                        config.embedding_model.clone(),
                    );
                }
                Ok(_) => {}
                Err(error) => {
                    tracing::warn!(error = %error, "People embedding provider failed; using local fallback");
                }
            }
        }
        (
            hash_embedding(text, self.vector_config.vector_size),
            "local-hash".to_string(),
            "privacy-hash-v1".to_string(),
        )
    }

    async fn projection_document(
        &self,
        employee_id: Uuid,
    ) -> Result<(EmployeeProfile, String, i32), AppError> {
        let profile = self.load_profile(employee_id).await?;
        let summary = self
            .work_evidence
            .summarize_employee_work(employee_id, 180)
            .await?;
        let capabilities = profile
            .capabilities
            .iter()
            .map(|capability| {
                format!(
                    "{}:{}:level{}:{}",
                    capability.kind,
                    capability.name,
                    capability.proficiency,
                    capability.verification_status
                )
            })
            .collect::<Vec<_>>()
            .join("; ");
        let document = format!(
            "role: {}; job_title: {}; level: {}; languages: {}; timezone: {}; availability: {}; capabilities: {}; completed_work_180d: {}; projects_180d: {}; qa_passed_180d: {}; reviews_180d: {}",
            profile.role,
            profile.job_title.as_deref().unwrap_or("unspecified"),
            profile.level.as_deref().unwrap_or("unspecified"),
            profile.languages.join(", "),
            profile.timezone,
            profile.availability_status,
            capabilities,
            summary.completed_issues,
            summary.project_count,
            summary.qa_passed,
            summary.review_completed,
        );
        Ok((profile, document, summary.completed_issues))
    }

    async fn ensure_collection(&self, workspace_id: Uuid) -> Result<String, AppError> {
        let alias = format!(
            "{}_{}_{}",
            self.vector_config.collection,
            safe_collection_segment(&workspace_id.to_string()[..8]),
            self.vector_config.vector_size
        );
        let alias_url = format!(
            "{}/collections/{}",
            self.vector_config.qdrant_url.trim_end_matches('/'),
            alias
        );
        if self
            .client
            .get(&alias_url)
            .send()
            .await
            .map(|r| r.status().is_success())
            .unwrap_or(false)
        {
            return Ok(alias);
        }

        let collection = format!("{}_v1", alias);
        let collection_url = format!(
            "{}/collections/{}",
            self.vector_config.qdrant_url.trim_end_matches('/'),
            collection
        );
        let response = self
            .client
            .put(&collection_url)
            .json(&json!({
                "vectors": {"size": self.vector_config.vector_size, "distance": "Cosine"},
                "replication_factor": self.vector_config.replication_factor
            }))
            .send()
            .await
            .map_err(|error| {
                AppError::internal(format!("Qdrant collection request failed: {error}"))
            })?;
        if !response.status().is_success() && response.status() != StatusCode::CONFLICT {
            return Err(AppError::internal(format!(
                "Qdrant collection returned HTTP {}",
                response.status().as_u16()
            )));
        }

        let aliases_url = format!(
            "{}/collections/aliases",
            self.vector_config.qdrant_url.trim_end_matches('/')
        );
        let alias_response = self
            .client
            .post(aliases_url)
            .json(&json!({
                "actions": [{"create_alias": {"collection_name": collection, "alias_name": alias}}]
            }))
            .send()
            .await
            .map_err(|error| AppError::internal(format!("Qdrant alias request failed: {error}")))?;
        if !alias_response.status().is_success() && alias_response.status() != StatusCode::CONFLICT
        {
            return Err(AppError::internal(format!(
                "Qdrant alias returned HTTP {}",
                alias_response.status().as_u16()
            )));
        }
        Ok(alias)
    }

    async fn upsert_qdrant_point(
        &self,
        collection: &str,
        point: QdrantPoint,
    ) -> Result<(), AppError> {
        let url = format!(
            "{}/collections/{}/points?wait=true",
            self.vector_config.qdrant_url.trim_end_matches('/'),
            collection
        );
        let response = self
            .client
            .put(url)
            .json(&json!({"points": [point]}))
            .send()
            .await
            .map_err(|error| AppError::internal(format!("Qdrant upsert failed: {error}")))?;
        if !response.status().is_success() {
            return Err(AppError::internal(format!(
                "Qdrant upsert returned HTTP {}",
                response.status().as_u16()
            )));
        }
        Ok(())
    }

    async fn search_qdrant(
        &self,
        workspace_id: Uuid,
        vector: Vec<f32>,
        limit: u32,
    ) -> Result<HashMap<Uuid, f64>, AppError> {
        if !self.vector_config.enabled {
            return Ok(HashMap::new());
        }
        let collection = self.ensure_collection(workspace_id).await?;
        let url = format!(
            "{}/collections/{}/points/search",
            self.vector_config.qdrant_url.trim_end_matches('/'),
            collection
        );
        let response = self
            .client
            .post(url)
            .json(&json!({"vector": vector, "limit": limit, "with_payload": true}))
            .send()
            .await
            .map_err(|error| AppError::internal(format!("Qdrant people search failed: {error}")))?;
        if !response.status().is_success() {
            return Err(AppError::internal(format!(
                "Qdrant people search returned HTTP {}",
                response.status().as_u16()
            )));
        }
        let payload = response
            .json::<QdrantSearchResponse>()
            .await
            .map_err(|error| AppError::internal(format!("Invalid Qdrant response: {error}")))?;
        Ok(payload
            .result
            .into_iter()
            .filter_map(|result| {
                let employee_id = result
                    .payload?
                    .get("employee_id")?
                    .as_str()?
                    .parse::<Uuid>()
                    .ok()?;
                Some((employee_id, clamp_score(result.score)))
            })
            .collect())
    }
}

impl EmployeeIntelligenceIf for PeopleIntelligenceService {
    async fn list_capabilities(
        &self,
        actor: &AppActor,
        workspace_id: Uuid,
        include_candidates: bool,
    ) -> Result<Vec<CapabilityTaxonomyItem>, AppError> {
        ensure_internal_actor(actor)?;
        let can_view_candidates = include_candidates && normalize_role(&actor.role) == "admin";
        Ok(sqlx::query_as::<_, CapabilityTaxonomyItem>(
            r#"
            SELECT id, parent_id, kind, name, normalized_name, aliases,
                   description, status, discovered_by
            FROM capability_taxonomy
            WHERE workspace_id = $1
              AND status <> 'retired'
              AND ($2 OR status = 'approved')
            ORDER BY kind, name
            "#,
        )
        .bind(workspace_id)
        .bind(can_view_candidates)
        .fetch_all(&self.pool)
        .await?)
    }

    async fn approve_capability(
        &self,
        actor: &AppActor,
        capability_id: Uuid,
    ) -> Result<CapabilityTaxonomyItem, AppError> {
        if normalize_role(&actor.role) != "admin" {
            return Err(AppError::forbidden(
                "Capability approval requires admin access",
            ));
        }
        sqlx::query_as::<_, CapabilityTaxonomyItem>(
            r#"
            UPDATE capability_taxonomy
            SET status = 'approved', approved_by = $2, approved_at = NOW()
            WHERE id = $1 AND status = 'candidate'
            RETURNING id, parent_id, kind, name, normalized_name, aliases,
                      description, status, discovered_by
            "#,
        )
        .bind(capability_id)
        .bind(actor.user_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::not_found("Candidate capability not found"))
    }

    async fn get_profile(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
    ) -> Result<EmployeeProfile, AppError> {
        ensure_internal_actor(actor)?;
        self.load_profile(employee_id).await
    }

    async fn update_self_profile(
        &self,
        actor: &AppActor,
        request: UpdateEmployeeProfileRequest,
    ) -> Result<EmployeeProfile, AppError> {
        ensure_internal_actor(actor)?;
        validate_profile_request(&request)?;
        let mut transaction = self.pool.begin().await?;
        sqlx::query(
            r#"
            INSERT INTO employee_profiles (user_id, workspace_id)
            VALUES ($1, '00000000-0000-0000-0000-000000000001')
            ON CONFLICT (user_id) DO UPDATE SET
                job_title = COALESCE($2, employee_profiles.job_title),
                level = COALESCE($3, employee_profiles.level),
                timezone = COALESCE($4, employee_profiles.timezone),
                languages = COALESCE($5, employee_profiles.languages),
                availability_status = COALESCE($6, employee_profiles.availability_status),
                workload_percent = COALESCE($7, employee_profiles.workload_percent),
                bio = COALESCE($8, employee_profiles.bio),
                searchable = COALESCE($9, employee_profiles.searchable),
                profile_version = employee_profiles.profile_version + 1
            "#,
        )
        .bind(actor.user_id)
        .bind(request.job_title.map(|value| value.trim().to_string()))
        .bind(request.level.map(|value| value.trim().to_string()))
        .bind(request.timezone.map(|value| value.trim().to_string()))
        .bind(request.languages.map(|items| {
            items
                .into_iter()
                .map(|value| value.trim().to_string())
                .filter(|value| !value.is_empty())
                .collect::<Vec<_>>()
        }))
        .bind(request.availability_status)
        .bind(request.workload_percent)
        .bind(request.bio.map(|value| value.trim().to_string()))
        .bind(request.searchable)
        .execute(&mut *transaction)
        .await?;

        if let Some(capabilities) = request.capabilities {
            sqlx::query(
                "DELETE FROM employee_capabilities WHERE employee_id = $1 AND source = 'self'",
            )
            .bind(actor.user_id)
            .execute(&mut *transaction)
            .await?;
            for capability in capabilities {
                sqlx::query(
                    r#"
                    INSERT INTO employee_capabilities (
                        employee_id, capability_id, proficiency, source, verification_status
                    )
                    SELECT $1, taxonomy.id, $3, 'self', 'pending'
                    FROM capability_taxonomy taxonomy
                    WHERE taxonomy.id = $2 AND taxonomy.status = 'approved'
                    ON CONFLICT (employee_id, capability_id) DO UPDATE SET
                        proficiency = CASE
                            WHEN employee_capabilities.source = 'self' THEN EXCLUDED.proficiency
                            ELSE employee_capabilities.proficiency
                        END
                    "#,
                )
                .bind(actor.user_id)
                .bind(capability.capability_id)
                .bind(capability.proficiency)
                .execute(&mut *transaction)
                .await?;
            }
        }

        if let Some(preferences) = request.preferences {
            sqlx::query(
                r#"
                INSERT INTO employee_work_preferences (
                    employee_id, preferred_capability_ids, avoided_capability_ids,
                    preferred_project_types, schedule
                ) VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (employee_id) DO UPDATE SET
                    preferred_capability_ids = EXCLUDED.preferred_capability_ids,
                    avoided_capability_ids = EXCLUDED.avoided_capability_ids,
                    preferred_project_types = EXCLUDED.preferred_project_types,
                    schedule = EXCLUDED.schedule
                "#,
            )
            .bind(actor.user_id)
            .bind(preferences.preferred_capability_ids)
            .bind(preferences.avoided_capability_ids)
            .bind(preferences.preferred_project_types)
            .bind(Json(preferences.schedule))
            .execute(&mut *transaction)
            .await?;
        }
        transaction.commit().await?;

        let profile = self.load_profile(actor.user_id).await?;
        self.event_publisher
            .stage(
                DomainEventInput::new(
                    "people.profile.changed",
                    "employee.profile.changed",
                    "employee",
                    actor.user_id,
                    json!({"employee_id": actor.user_id, "profile_version": profile.profile_version}),
                )
                .workspace_id(Some(profile.workspace_id)),
            )
            .await?;
        Ok(profile)
    }

    async fn verify_capability(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        capability_id: Uuid,
        request: VerifyCapabilityRequest,
    ) -> Result<EmployeeCapability, AppError> {
        if !can_evaluate(actor, employee_id, &self.pool).await? {
            return Err(AppError::forbidden(
                "Capability verification is limited to managers",
            ));
        }
        let status = request.verification_status.trim().to_ascii_lowercase();
        if !matches!(status.as_str(), "verified" | "rejected" | "pending") {
            return Err(AppError::validation(
                "Unsupported capability verification status",
            ));
        }
        if request
            .proficiency
            .is_some_and(|value| !(1..=5).contains(&value))
        {
            return Err(AppError::validation(
                "Capability proficiency must be between 1 and 5",
            ));
        }
        let updated = sqlx::query(
            r#"
            UPDATE employee_capabilities
            SET verification_status = $3,
                proficiency = COALESCE($4, proficiency),
                valid_until = $5,
                verified_by = CASE WHEN $3 = 'verified' THEN $6 ELSE NULL END,
                verified_at = CASE WHEN $3 = 'verified' THEN NOW() ELSE NULL END,
                source = CASE WHEN $3 = 'verified' THEN 'manager' ELSE source END
            WHERE employee_id = $1 AND capability_id = $2
            "#,
        )
        .bind(employee_id)
        .bind(capability_id)
        .bind(&status)
        .bind(request.proficiency)
        .bind(request.valid_until)
        .bind(actor.user_id)
        .execute(&self.pool)
        .await?;
        if updated.rows_affected() == 0 {
            return Err(AppError::not_found("Employee capability not found"));
        }
        let capability = self.load_capability(employee_id, capability_id).await?;
        let profile = self.load_profile(employee_id).await?;
        self.event_publisher
            .stage(
                DomainEventInput::new(
                    "people.capability.verified",
                    "capability.verified",
                    "employee_capability",
                    capability.id,
                    json!({
                        "employee_id": employee_id,
                        "capability_id": capability_id,
                        "verification_status": capability.verification_status,
                        "verified_by": actor.user_id
                    }),
                )
                .workspace_id(Some(profile.workspace_id)),
            )
            .await?;
        Ok(capability)
    }

    async fn search_people(
        &self,
        actor: &AppActor,
        ai_config: Option<&AiProviderConfig>,
        query: PeopleSearchQuery,
    ) -> Result<Vec<PeopleSearchMatch>, AppError> {
        ensure_internal_actor(actor)?;
        let limit = query.limit.unwrap_or(12).clamp(1, 50);
        let employee_ids = sqlx::query_scalar::<_, Uuid>(
            r#"
            SELECT profile.user_id
            FROM employee_profiles profile
            JOIN users user_account ON user_account.id = profile.user_id
            WHERE profile.workspace_id = $1
              AND profile.searchable = TRUE
              AND user_account.deleted_at IS NULL
              AND LOWER(user_account.role) NOT IN ('client', 'vendor')
              AND ($2::text IS NULL OR profile.availability_status = $2)
              AND ($3::integer IS NULL OR profile.workload_percent <= $3)
              AND (COALESCE(array_length($4::text[], 1), 0) = 0 OR profile.languages && $4)
              AND (COALESCE(array_length($5::uuid[], 1), 0) = 0 OR EXISTS (
                    SELECT 1 FROM employee_capabilities employee_capability
                    WHERE employee_capability.employee_id = profile.user_id
                      AND employee_capability.capability_id = ANY($5)
              ))
            ORDER BY profile.updated_at DESC
            LIMIT 250
            "#,
        )
        .bind(query.workspace_id)
        .bind(query.availability_status.as_deref())
        .bind(query.max_workload_percent)
        .bind(&query.languages)
        .bind(&query.capability_ids)
        .fetch_all(&self.pool)
        .await?;

        let semantic_scores = if query.query.trim().is_empty() {
            HashMap::new()
        } else {
            let (vector, _, _) = self
                .build_embedding(ai_config, query.query.trim(), "query")
                .await;
            match self
                .search_qdrant(query.workspace_id, vector, limit.saturating_mul(5))
                .await
            {
                Ok(scores) => scores,
                Err(error) => {
                    tracing::warn!(error = %error, "People vector search unavailable; using lexical fallback");
                    HashMap::new()
                }
            }
        };

        let mut matches = Vec::new();
        for employee_id in employee_ids {
            let employee = self.load_profile(employee_id).await?;
            if !query.kinds.is_empty()
                && !employee
                    .capabilities
                    .iter()
                    .any(|capability| query.kinds.iter().any(|kind| kind == &capability.kind))
            {
                continue;
            }
            let searchable_text = format!(
                "{} {} {} {}",
                employee.job_title.as_deref().unwrap_or_default(),
                employee.level.as_deref().unwrap_or_default(),
                employee.languages.join(" "),
                employee
                    .capabilities
                    .iter()
                    .flat_map(|capability| {
                        std::iter::once(capability.name.clone()).chain(capability.aliases.clone())
                    })
                    .collect::<Vec<_>>()
                    .join(" ")
            );
            let semantic = semantic_scores
                .get(&employee_id)
                .copied()
                .unwrap_or_else(|| lexical_similarity(&query.query, &searchable_text));
            let verified_count = employee
                .capabilities
                .iter()
                .filter(|capability| capability.verification_status == "verified")
                .count() as i32;
            let requested_verified = employee
                .capabilities
                .iter()
                .filter(|capability| {
                    capability.verification_status == "verified"
                        && (query.capability_ids.is_empty()
                            || query.capability_ids.contains(&capability.capability_id))
                })
                .count() as i32;
            let verified_score = if query.capability_ids.is_empty() {
                (verified_count as f64 / 5.0).min(1.0)
            } else {
                ratio(requested_verified, query.capability_ids.len() as i32)
            };
            let evidence_count = employee
                .capabilities
                .iter()
                .map(|capability| capability.evidence_count)
                .sum::<i32>();
            let evidence_score =
                ((evidence_count.max(0) as f64 + 1.0).ln() / 21.0_f64.ln()).min(1.0);
            let availability_score = match employee.availability_status.as_str() {
                "available" => 1.0,
                "limited" => 0.55,
                _ => 0.1,
            } * (1.0 - employee.workload_percent as f64 / 125.0)
                .clamp(0.2, 1.0);
            let context_score = if let Some(project_id) = query.project_id {
                let assigned = sqlx::query_scalar::<_, bool>(
                    r#"
                    SELECT EXISTS (
                        SELECT 1 FROM project_role_assignments
                        WHERE project_id = $1 AND user_id = $2
                    )
                    "#,
                )
                .bind(project_id)
                .bind(employee_id)
                .fetch_one(&self.pool)
                .await?;
                if assigned {
                    1.0
                } else {
                    0.0
                }
            } else {
                0.5
            };
            let score = clamp_score(
                semantic * 0.45
                    + verified_score * 0.25
                    + evidence_score * 0.15
                    + availability_score * 0.10
                    + context_score * 0.05,
            );
            let evidence_from = employee
                .capabilities
                .iter()
                .filter_map(|capability| capability.last_evidenced_at)
                .min();
            let evidence_to = employee
                .capabilities
                .iter()
                .filter_map(|capability| capability.last_evidenced_at)
                .max();
            let mut reasons = employee
                .capabilities
                .iter()
                .filter(|capability| {
                    capability.verification_status == "verified"
                        && (query.query.is_empty()
                            || lexical_similarity(&query.query, &capability.name) > 0.0)
                })
                .take(3)
                .map(|capability| format!("已核验能力：{}", capability.name))
                .collect::<Vec<_>>();
            if employee.availability_status == "available" {
                reasons.push(format!("当前负载 {}%", employee.workload_percent));
            }
            if reasons.is_empty() {
                reasons.push("与查询中的岗位或能力语义相关".to_string());
            }
            matches.push(PeopleSearchMatch {
                employee,
                score,
                explanation: MatchExplanation {
                    semantic_score: semantic,
                    verified_capability_score: verified_score,
                    evidence_score,
                    availability_score,
                    context_score,
                    evidence_count,
                    evidence_from,
                    evidence_to,
                    confidence: confidence(evidence_count, 1),
                    reasons,
                },
            });
        }
        matches.sort_by(|left, right| right.score.total_cmp(&left.score));
        matches.truncate(limit as usize);
        Ok(matches)
    }

    async fn get_evaluation(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        window_days: i32,
    ) -> Result<EmployeeEvaluation, AppError> {
        if !can_evaluate(actor, employee_id, &self.pool).await? {
            return Err(AppError::forbidden("Employee evaluation is private"));
        }
        let window_days = match window_days {
            30 | 90 | 180 | 365 => window_days,
            _ => 90,
        };
        self.reconcile_employee_evidence(employee_id).await?;
        let employee = self.load_profile(employee_id).await?;
        let summary = self
            .work_evidence
            .summarize_employee_work(employee_id, window_days)
            .await?;
        let insufficient = summary.completed_issues < MIN_EVALUATION_TASKS
            || summary.project_count < MIN_EVALUATION_PROJECTS;
        let dimensions = build_dimensions(&employee, &summary, insufficient);
        build_emergent_signals(&self.pool, &employee, &summary, insufficient).await?;
        self.upsert_metric_snapshot(employee_id, employee.workspace_id, &summary, &dimensions)
            .await?;
        Ok(EmployeeEvaluation {
            employee,
            window_days,
            insufficient_evidence: insufficient,
            sample_size: summary.completed_issues,
            project_count: summary.project_count,
            confidence: confidence(summary.completed_issues, summary.project_count),
            dimensions,
            signals: self.load_signals(employee_id).await?,
            recent_evidence: self.load_recent_evidence(employee_id, window_days).await?,
            disclaimer: "仅用于辅助管理与个人成长，不得直接决定薪酬、晋升、绩效等级或淘汰。"
                .to_string(),
        })
    }

    async fn submit_correction(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        request: SubmitCorrectionRequest,
    ) -> Result<EmployeeCorrection, AppError> {
        ensure_internal_actor(actor)?;
        if actor.user_id != employee_id {
            return Err(AppError::forbidden(
                "Employees can only correct their own profile",
            ));
        }
        let reason = request.reason.trim();
        if reason.len() < 5 || reason.len() > 2000 {
            return Err(AppError::validation(
                "Correction reason must contain 5 to 2000 characters",
            ));
        }
        let row = sqlx::query_as::<_, EmployeeCorrectionRow>(
            r#"
            INSERT INTO employee_corrections (
                id, employee_id, correction_type, target_id, reason, proposed_value
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, employee_id, correction_type, target_id, reason,
                      proposed_value, status, created_at
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(employee_id)
        .bind(request.correction_type.trim())
        .bind(request.target_id)
        .bind(reason)
        .bind(request.proposed_value.map(Json))
        .fetch_one(&self.pool)
        .await?;
        Ok(EmployeeCorrection::from(row))
    }

    async fn rerank_content(
        &self,
        actor: &AppActor,
        request: ContentRerankRequest,
    ) -> Result<Vec<ContentSearchResult>, AppError> {
        ensure_internal_actor(actor)?;
        let profile = self.load_profile(actor.user_id).await?;
        let profile_terms = format!(
            "{} {} {}",
            profile.job_title.as_deref().unwrap_or_default(),
            profile.languages.join(" "),
            profile
                .capabilities
                .iter()
                .map(|capability| capability.name.clone())
                .collect::<Vec<_>>()
                .join(" ")
        );
        let mut results = request
            .candidates
            .into_iter()
            .filter(|candidate| candidate.accessible)
            .map(|candidate| {
                let content = format!(
                    "{} {} {}",
                    candidate.title,
                    candidate.summary,
                    candidate.tags.join(" ")
                );
                let profile_score = lexical_similarity(&profile_terms, &content);
                let context_score = match (request.project_id, candidate.project_id) {
                    (Some(active), Some(candidate_project)) if active == candidate_project => 1.0,
                    (None, _) => 0.5,
                    _ => 0.0,
                };
                let personalized_score = clamp_score(
                    candidate.base_score.clamp(0.0, 1.0) * 0.60
                        + profile_score * 0.25
                        + context_score * 0.15,
                );
                let mut reasons = Vec::new();
                if profile_score > 0.0 {
                    reasons.push("匹配你的岗位或能力画像".to_string());
                }
                if context_score == 1.0 {
                    reasons.push("属于当前项目".to_string());
                }
                ContentSearchResult {
                    candidate,
                    personalized_score,
                    reasons,
                }
            })
            .collect::<Vec<_>>();
        results.sort_by(|left, right| right.personalized_score.total_cmp(&left.personalized_score));
        Ok(results)
    }

    async fn refresh_employee_projection(
        &self,
        actor: &AppActor,
        ai_config: Option<&AiProviderConfig>,
        employee_id: Uuid,
    ) -> Result<EmployeeProjectionResult, AppError> {
        if normalize_role(&actor.role) != "admin" {
            return Err(AppError::forbidden(
                "People vector reindex requires admin access",
            ));
        }
        self.reconcile_employee_evidence(employee_id).await?;
        let (profile, document, evidence_count) = self.projection_document(employee_id).await?;
        let point_id = sqlx::query_scalar::<_, Uuid>(
            "SELECT point_id FROM employee_vector_projections WHERE employee_id = $1",
        )
        .bind(employee_id)
        .fetch_optional(&self.pool)
        .await?
        .unwrap_or_else(Uuid::new_v4);
        let collection = self.ensure_collection(profile.workspace_id).await?;
        let (vector, provider, model) = self.build_embedding(ai_config, &document, "passage").await;
        let document_sha256 = hex::encode(Sha256::digest(document.as_bytes()));
        let payload = json!({
            "employee_id": employee_id.to_string(),
            "workspace_id": profile.workspace_id.to_string(),
            "role": profile.role,
            "job_title": profile.job_title,
            "level": profile.level,
            "languages": profile.languages,
            "timezone": profile.timezone,
            "availability_status": profile.availability_status,
            "workload_percent": profile.workload_percent,
            "capabilities": profile.capabilities.iter().map(|item| json!({
                "id": item.capability_id,
                "kind": item.kind,
                "name": item.name,
                "proficiency": item.proficiency,
                "verified": item.verification_status == "verified"
            })).collect::<Vec<_>>(),
            "evidence_count": evidence_count,
            "profile_version": profile.profile_version
        });
        let write = self
            .upsert_qdrant_point(
                &collection,
                QdrantPoint {
                    id: point_id.to_string(),
                    vector,
                    payload,
                },
            )
            .await;
        let (status, last_error, indexed_at) = match &write {
            Ok(()) => ("indexed", None, Some(Utc::now())),
            Err(error) => ("failed", Some(error.to_string()), None),
        };
        sqlx::query(
            r#"
            INSERT INTO employee_vector_projections (
                employee_id, workspace_id, point_id, collection_name, profile_version,
                provider, model, document_sha256, status, last_error, indexed_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (employee_id) DO UPDATE SET
                point_id = EXCLUDED.point_id,
                collection_name = EXCLUDED.collection_name,
                vector_version = employee_vector_projections.vector_version + 1,
                profile_version = EXCLUDED.profile_version,
                provider = EXCLUDED.provider,
                model = EXCLUDED.model,
                document_sha256 = EXCLUDED.document_sha256,
                status = EXCLUDED.status,
                last_error = EXCLUDED.last_error,
                indexed_at = EXCLUDED.indexed_at
            "#,
        )
        .bind(employee_id)
        .bind(profile.workspace_id)
        .bind(point_id)
        .bind(&collection)
        .bind(profile.profile_version)
        .bind(&provider)
        .bind(&model)
        .bind(document_sha256)
        .bind(status)
        .bind(last_error.as_deref())
        .bind(indexed_at)
        .execute(&self.pool)
        .await?;
        Ok(EmployeeProjectionResult {
            employee_id,
            point_id,
            collection,
            provider,
            indexed: write.is_ok(),
            error: write.err().map(|error| error.to_string()),
        })
    }
}

impl From<EmployeeCapabilityRow> for EmployeeCapability {
    fn from(row: EmployeeCapabilityRow) -> Self {
        Self {
            id: row.id,
            capability_id: row.capability_id,
            kind: row.kind,
            name: row.name,
            aliases: row.aliases,
            proficiency: row.proficiency,
            source: row.source,
            verification_status: row.verification_status,
            evidence_count: row.evidence_count,
            last_evidenced_at: row.last_evidenced_at,
            verified_by: row.verified_by,
            verified_at: row.verified_at,
            valid_until: row.valid_until,
        }
    }
}

impl From<EmployeeEvidenceRow> for EmployeeEvidenceRef {
    fn from(row: EmployeeEvidenceRow) -> Self {
        Self {
            id: row.id,
            evidence_type: row.evidence_type,
            source_app: row.source_app,
            source_entity_type: row.source_entity_type,
            source_entity_id: row.source_entity_id,
            project_id: row.project_id,
            occurred_at: row.occurred_at,
            weight: row.weight,
            metadata: row.metadata.0,
        }
    }
}

impl From<EmployeeSignalRow> for EmployeeEmergentSignal {
    fn from(row: EmployeeSignalRow) -> Self {
        Self {
            id: row.id,
            signal_type: row.signal_type,
            title: row.title,
            summary: row.summary,
            confidence: row.confidence,
            evidence_count: row.evidence_count,
            status: row.status,
            metadata: row.metadata.0,
            created_at: row.created_at,
        }
    }
}

impl From<EmployeeCorrectionRow> for EmployeeCorrection {
    fn from(row: EmployeeCorrectionRow) -> Self {
        Self {
            id: row.id,
            employee_id: row.employee_id,
            correction_type: row.correction_type,
            target_id: row.target_id,
            reason: row.reason,
            proposed_value: row.proposed_value.map(|value| value.0),
            status: row.status,
            created_at: row.created_at,
        }
    }
}

fn ensure_internal_actor(actor: &AppActor) -> Result<(), AppError> {
    if matches!(normalize_role(&actor.role).as_str(), "client" | "vendor") {
        Err(AppError::forbidden(
            "External accounts cannot access employee intelligence",
        ))
    } else {
        Ok(())
    }
}

async fn can_evaluate(
    actor: &AppActor,
    employee_id: Uuid,
    pool: &PgPool,
) -> Result<bool, AppError> {
    if actor.user_id == employee_id || normalize_role(&actor.role) == "admin" {
        return Ok(true);
    }
    if !matches!(
        normalize_role(&actor.role).as_str(),
        "manager" | "producer" | "reviewer"
    ) {
        return Ok(false);
    }
    Ok(sqlx::query_scalar::<_, bool>(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM employee_profiles WHERE user_id = $1 AND manager_id = $2
            UNION ALL
            SELECT 1
            FROM project_role_assignments actor_assignment
            JOIN project_role_assignments employee_assignment
              ON employee_assignment.project_id = actor_assignment.project_id
            WHERE actor_assignment.user_id = $2 AND employee_assignment.user_id = $1
        )
        "#,
    )
    .bind(employee_id)
    .bind(actor.user_id)
    .fetch_one(pool)
    .await?)
}

fn normalize_role(role: &str) -> String {
    role.trim().to_ascii_lowercase().replace('_', "-")
}

fn payload_uuid(payload: &Value, key: &str) -> Option<Uuid> {
    payload
        .get(key)
        .and_then(Value::as_str)
        .and_then(|value| Uuid::parse_str(value).ok())
}

fn validate_profile_request(request: &UpdateEmployeeProfileRequest) -> Result<(), AppError> {
    if request
        .availability_status
        .as_deref()
        .is_some_and(|value| !matches!(value, "available" | "limited" | "unavailable"))
    {
        return Err(AppError::validation("Unsupported availability status"));
    }
    if request
        .workload_percent
        .is_some_and(|value| !(0..=100).contains(&value))
    {
        return Err(AppError::validation(
            "Workload percent must be between 0 and 100",
        ));
    }
    if request.bio.as_ref().is_some_and(|value| value.len() > 2000) {
        return Err(AppError::validation(
            "Profile bio must not exceed 2000 characters",
        ));
    }
    if request.capabilities.as_ref().is_some_and(|items| {
        items.len() > 80
            || items
                .iter()
                .any(|item| !(1..=5).contains(&item.proficiency))
    }) {
        return Err(AppError::validation(
            "Capabilities must contain at most 80 items with proficiency from 1 to 5",
        ));
    }
    Ok(())
}

fn build_dimensions(
    employee: &EmployeeProfile,
    summary: &WorkEvidenceSummary,
    insufficient: bool,
) -> Vec<EvaluationDimension> {
    let metric_confidence = confidence(summary.completed_issues, summary.project_count);
    let status = if insufficient {
        "insufficient"
    } else {
        "measured"
    };
    let metric =
        |key: &str, label: &str, value: Option<f64>, unit: &str, count: i32, explanation: &str| {
            EvaluationDimension {
                key: key.to_string(),
                label: label.to_string(),
                value: if insufficient { None } else { value },
                unit: unit.to_string(),
                status: status.to_string(),
                confidence: metric_confidence,
                evidence_count: count,
                explanation: if insufficient {
                    "有效任务少于 5 个或项目少于 2 个，暂不输出趋势判断。".to_string()
                } else {
                    explanation.to_string()
                },
            }
        };
    let verified = employee
        .capabilities
        .iter()
        .filter(|capability| capability.verification_status == "verified")
        .count() as i32;
    let complexity_units = summary
        .estimated_story_points
        .max(summary.completed_issues.max(1) as f64);
    let complexity_normalized_revision =
        clamp_score(1.0 - summary.revision_count.max(0) as f64 / complexity_units);
    vec![
        metric(
            "quality",
            "质量",
            Some(
                (ratio(summary.first_pass_approved, summary.completed_issues) * 0.45
                    + ratio(summary.qa_passed, summary.completed_issues) * 0.35
                    + complexity_normalized_revision * 0.20)
                    * 100.0,
            ),
            "%",
            summary.completed_issues,
            "首次通过率、QA 通过率与按任务复杂度归一化的返修率，不使用评论情绪或人格推断。",
        ),
        metric(
            "delivery",
            "交付",
            Some(ratio(summary.on_time_issues, summary.completed_issues) * 100.0),
            "%",
            summary.completed_issues,
            "在计划截止日前完成的已完成任务占比。",
        ),
        metric(
            "professional",
            "专业能力",
            Some((verified as f64 / 8.0).min(1.0) * 100.0),
            "%",
            employee.capabilities.iter().map(|item| item.evidence_count).sum(),
            "由已核验能力、相关证据数量和证据时效组成。",
        ),
        metric(
            "growth",
            "成长",
            Some(
                ((employee
                    .capabilities
                    .iter()
                    .filter(|item| item.source == "system")
                    .count() as f64
                    / 5.0)
                    .min(1.0))
                    * 100.0,
            ),
            "%",
            employee.capabilities.len() as i32,
            "反映有工作证据支持的新能力和相邻能力，不代表固定潜力。",
        ),
        metric(
            "collaboration",
            "协作",
            Some(
                ((summary.review_completed + summary.delivery_count) as f64 / 10.0).min(1.0)
                    * 100.0,
            ),
            "%",
            summary.review_completed + summary.delivery_count,
            "基于评审完成和交付参与，仅在岗位相关时解释。",
        ),
        EvaluationDimension {
            key: "data-confidence".to_string(),
            label: "数据可信度".to_string(),
            value: Some(metric_confidence * 100.0),
            unit: "%".to_string(),
            status: if insufficient { "low" } else { "measured" }.to_string(),
            confidence: metric_confidence,
            evidence_count: summary.completed_issues,
            explanation: format!(
                "基于 {} 个已完成任务、{} 个项目、{} 条工时记录（{} 分钟，估算 {:.1} 点）；证据范围 {} 至 {}。",
                summary.completed_issues,
                summary.project_count,
                summary.work_log_count,
                summary.logged_minutes,
                summary.estimated_story_points,
                summary.evidence_from.map(|value| value.date_naive().to_string()).unwrap_or_else(|| "未知".to_string()),
                summary.evidence_to.map(|value| value.date_naive().to_string()).unwrap_or_else(|| "未知".to_string()),
            ),
        },
    ]
}

async fn build_emergent_signals(
    pool: &PgPool,
    employee: &EmployeeProfile,
    summary: &WorkEvidenceSummary,
    insufficient: bool,
) -> Result<(), AppError> {
    sqlx::query(
        "UPDATE employee_emergent_signals SET status = 'expired' WHERE employee_id = $1 AND status = 'active'",
    )
    .bind(employee.user_id)
    .execute(pool)
    .await?;
    if insufficient {
        return Ok(());
    }
    let verified_count = employee
        .capabilities
        .iter()
        .filter(|item| item.verification_status == "verified" && item.proficiency >= 4)
        .count() as i32;
    let mut signals = Vec::new();
    if verified_count >= 2 && summary.review_completed >= 2 {
        signals.push((
            "mentor-potential",
            "导师潜力",
            "多个高熟练度能力已核验，并持续参与评审，可作为导师候选。",
            confidence(summary.completed_issues, summary.project_count),
            verified_count + summary.review_completed,
        ));
    }
    if summary.revision_count <= summary.completed_issues / 2
        && summary.first_pass_approved >= MIN_EVALUATION_TASKS
    {
        signals.push((
            "quality-pattern",
            "稳定质量模式",
            "近期首次通过和低返修同时出现，可继续观察是否跨项目稳定。",
            confidence(summary.completed_issues, summary.project_count) * 0.9,
            summary.completed_issues,
        ));
    }
    for (signal_type, title, summary_text, signal_confidence, evidence_count) in signals {
        sqlx::query(
            r#"
            INSERT INTO employee_emergent_signals (
                id, employee_id, signal_type, title, summary, confidence,
                evidence_count, metadata, expires_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '30 days')
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(employee.user_id)
        .bind(signal_type)
        .bind(title)
        .bind(summary_text)
        .bind(signal_confidence)
        .bind(evidence_count)
        .bind(Json(json!({"window_days": summary.window_days})))
        .execute(pool)
        .await?;
    }
    Ok(())
}

fn ratio(numerator: i32, denominator: i32) -> f64 {
    if denominator <= 0 {
        0.0
    } else {
        clamp_score(numerator.max(0) as f64 / denominator as f64)
    }
}

fn confidence(sample_size: i32, project_count: i32) -> f64 {
    clamp_score(
        (sample_size.max(0) as f64 / 20.0).min(1.0) * 0.7
            + (project_count.max(0) as f64 / 4.0).min(1.0) * 0.3,
    )
}

fn lexical_similarity(left: &str, right: &str) -> f64 {
    let left_terms = normalized_terms(left);
    let right_terms = normalized_terms(right);
    if left_terms.is_empty() || right_terms.is_empty() {
        return 0.0;
    }
    let matched = left_terms
        .iter()
        .filter(|term| right_terms.contains(term))
        .count();
    clamp_score(matched as f64 / left_terms.len() as f64)
}

fn normalized_terms(value: &str) -> Vec<String> {
    let normalized = value.trim().to_lowercase();
    let mut terms = normalized
        .split(|character: char| !character.is_alphanumeric())
        .filter(|term| !term.is_empty())
        .map(ToOwned::to_owned)
        .collect::<Vec<_>>();
    let characters = normalized
        .chars()
        .filter(|character| !character.is_whitespace())
        .collect::<Vec<_>>();
    for window in characters.windows(2) {
        terms.push(window.iter().collect());
    }
    terms.sort();
    terms.dedup();
    terms
}

fn hash_embedding(text: &str, size: usize) -> Vec<f32> {
    let size = size.clamp(8, 4096);
    let mut vector = vec![0.0_f32; size];
    for term in normalized_terms(text) {
        let digest = Sha256::digest(term.as_bytes());
        let index =
            u32::from_be_bytes([digest[0], digest[1], digest[2], digest[3]]) as usize % size;
        let sign = if digest[4] & 1 == 0 { 1.0 } else { -1.0 };
        vector[index] += sign;
    }
    normalize_vector(vector, size)
}

fn normalize_vector(mut vector: Vec<f32>, size: usize) -> Vec<f32> {
    vector.resize(size, 0.0);
    vector.truncate(size);
    let norm = vector.iter().map(|value| value * value).sum::<f32>().sqrt();
    if norm > f32::EPSILON {
        for value in &mut vector {
            *value /= norm;
        }
    }
    vector
}

fn safe_collection_segment(value: &str) -> String {
    value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || character == '_' {
                character
            } else {
                '_'
            }
        })
        .collect()
}

fn clamp_score(value: f64) -> f64 {
    if value.is_finite() {
        value.clamp(0.0, 1.0)
    } else {
        0.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_embedding_is_stable_and_normalized() {
        let first = hash_embedding("角色建模 Blender", 64);
        let second = hash_embedding("角色建模 Blender", 64);
        assert_eq!(first, second);
        assert_eq!(first.len(), 64);
        let norm = first.iter().map(|value| value * value).sum::<f32>().sqrt();
        assert!((norm - 1.0).abs() < 0.0001);
    }

    #[test]
    fn lexical_similarity_supports_chinese_bigrams() {
        assert!(lexical_similarity("角色建模", "高级角色模型与建模") > 0.0);
        assert_eq!(lexical_similarity("角色建模", "财务审计"), 0.0);
    }

    #[test]
    fn confidence_requires_samples_and_projects() {
        assert_eq!(confidence(0, 0), 0.0);
        assert!(confidence(20, 4) > confidence(5, 1));
        assert_eq!(confidence(20, 4), 1.0);
    }

    #[test]
    fn external_roles_are_rejected() {
        let actor = AppActor {
            user_id: Uuid::new_v4(),
            display_name: "External".to_string(),
            role: "vendor".to_string(),
        };
        assert!(ensure_internal_actor(&actor).is_err());
    }
}
