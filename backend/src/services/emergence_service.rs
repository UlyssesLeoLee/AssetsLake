/*
```cypher
CREATE
  (f:File {name: "emergence_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::emergence_service", type: "module"}),
  (c1:Class {name: "EmergenceService", type: "class", language: "rust", signature: "struct EmergenceService"}),
  (c2:Class {name: "IssueEmergenceMetrics", type: "class", language: "rust", signature: "struct IssueEmergenceMetrics"}),
  (c3:Class {name: "AssetEmergenceMetrics", type: "class", language: "rust", signature: "struct AssetEmergenceMetrics"}),
  (c4:Class {name: "GovernanceEmergenceMetrics", type: "class", language: "rust", signature: "struct GovernanceEmergenceMetrics"}),
  (c5:Class {name: "EmergenceSnapshot", type: "class", language: "rust", signature: "struct EmergenceSnapshot"}),
  (c6:Class {name: "EmergenceMetrics", type: "class", language: "rust", signature: "struct EmergenceMetrics"}),
  (c7:Class {name: "EmergenceLoopStage", type: "class", language: "rust", signature: "struct EmergenceLoopStage"}),
  (c8:Class {name: "EmergenceSignal", type: "class", language: "rust", signature: "struct EmergenceSignal"}),
  (c9:Class {name: "EmergenceRecommendation", type: "class", language: "rust", signature: "struct EmergenceRecommendation"}),
  (fn1:Function {name: "EmergenceService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "EmergenceService::snapshot", type: "function", language: "rust", signature: "pub async fn snapshot(&self) -> Result<EmergenceSnapshot, AppError>"}),
  (fn3:Function {name: "load_issue_metrics", type: "function", language: "rust", signature: "async fn load_issue_metrics(pool: &PgPool) -> Result<IssueEmergenceMetrics, AppError>"}),
  (fn4:Function {name: "load_asset_metrics", type: "function", language: "rust", signature: "async fn load_asset_metrics(pool: &PgPool) -> Result<AssetEmergenceMetrics, AppError>"}),
  (fn5:Function {name: "load_governance_metrics", type: "function", language: "rust", signature: "async fn load_governance_metrics(pool: &PgPool) -> Result<GovernanceEmergenceMetrics, AppError>"}),
  (fn6:Function {name: "build_snapshot", type: "function", language: "rust", signature: "fn build_snapshot(issue: IssueEmergenceMetrics, asset: AssetEmergenceMetrics, governance: GovernanceEmergenceMetrics) -> EmergenceSnapshot"}),
  (fn7:Function {name: "derive_posture", type: "function", language: "rust", signature: "fn derive_posture(metrics: &EmergenceMetrics) -> String"}),
  (fn8:Function {name: "build_loop", type: "function", language: "rust", signature: "fn build_loop(metrics: &EmergenceMetrics) -> Vec<EmergenceLoopStage>"}),
  (fn9:Function {name: "build_signals", type: "function", language: "rust", signature: "fn build_signals(metrics: &EmergenceMetrics) -> Vec<EmergenceSignal>"}),
  (fn10:Function {name: "build_recommendations", type: "function", language: "rust", signature: "fn build_recommendations(metrics: &EmergenceMetrics) -> Vec<EmergenceRecommendation>"}),
  (fn11:Function {name: "calculate_percent", type: "function", language: "rust", signature: "fn calculate_percent(value: i64, total: i64) -> i64"}),
  (fn12:Function {name: "clamp_percent", type: "function", language: "rust", signature: "fn clamp_percent(value: i64) -> i64"}),
  (fn13:Function {name: "tone_from_percent", type: "function", language: "rust", signature: "fn tone_from_percent(value: i64) -> &'static str"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "issue", type: "variable"}),
  (v3:Variable {name: "asset", type: "variable"}),
  (v4:Variable {name: "governance", type: "variable"}),
  (v5:Variable {name: "metrics", type: "variable"}),
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
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn8),
  (fn6)-[:CALLS]->(fn9),
  (fn6)-[:CALLS]->(fn10),
  (fn6)-[:CALLS]->(fn11),
  (fn6)-[:CALLS]->(fn12),
  (fn6)-[:USES]->(v5),
  (fn8)-[:USES]->(v5),
  (fn9)-[:CALLS]->(fn13),
  (fn9)-[:USES]->(v5),
  (fn10)-[:USES]->(v5),
  (fn11)-[:CALLS]->(fn12);
```
*/

use chrono::Utc;
use serde::Serialize;
use sqlx::{FromRow, PgPool};

use crate::errors::AppError;

#[derive(Clone)]
pub struct EmergenceService {
    pool: PgPool,
}

#[derive(Debug, Clone, FromRow)]
struct IssueEmergenceMetrics {
    total_issues: i64,
    open_issues: i64,
    review_issues: i64,
    delivery_issues: i64,
    evidence_linked_issues: i64,
    missing_evidence_issues: i64,
    overdue_issues: i64,
    qa_risk_issues: i64,
}

#[derive(Debug, Clone, FromRow)]
struct AssetEmergenceMetrics {
    total_assets: i64,
    active_assets: i64,
    code_assets: i64,
    versioned_assets: i64,
    ai_insights: i64,
}

#[derive(Debug, Clone, FromRow)]
struct GovernanceEmergenceMetrics {
    milestones: i64,
    delivery_packages: i64,
    rag_memories: i64,
    recent_rag_memories: i64,
    active_locks: i64,
    active_sessions: i64,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergenceSnapshot {
    pub generated_at: String,
    pub posture: String,
    pub readiness_percent: i64,
    pub evidence_coverage_percent: i64,
    pub flow_health_percent: i64,
    pub ai_readiness_percent: i64,
    pub risk_count: i64,
    pub metrics: EmergenceMetrics,
    pub loop_stages: Vec<EmergenceLoopStage>,
    pub signals: Vec<EmergenceSignal>,
    pub recommendations: Vec<EmergenceRecommendation>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergenceMetrics {
    pub total_issues: i64,
    pub open_issues: i64,
    pub review_issues: i64,
    pub delivery_issues: i64,
    pub evidence_linked_issues: i64,
    pub missing_evidence_issues: i64,
    pub overdue_issues: i64,
    pub qa_risk_issues: i64,
    pub total_assets: i64,
    pub active_assets: i64,
    pub code_assets: i64,
    pub versioned_assets: i64,
    pub ai_insights: i64,
    pub milestones: i64,
    pub delivery_packages: i64,
    pub rag_memories: i64,
    pub recent_rag_memories: i64,
    pub active_locks: i64,
    pub active_sessions: i64,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergenceLoopStage {
    pub mode: String,
    pub label: String,
    pub value: String,
    pub detail: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergenceSignal {
    pub id: String,
    pub label: String,
    pub value: String,
    pub detail: String,
    pub source: String,
    pub tone: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct EmergenceRecommendation {
    pub id: String,
    pub title: String,
    pub mode: String,
    pub action: String,
    pub impact: String,
    pub confidence: f32,
    pub tone: String,
    pub app: String,
    pub control_id: String,
}

impl EmergenceService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn snapshot(&self) -> Result<EmergenceSnapshot, AppError> {
        let issue = load_issue_metrics(&self.pool).await?;
        let asset = load_asset_metrics(&self.pool).await?;
        let governance = load_governance_metrics(&self.pool).await?;
        Ok(build_snapshot(issue, asset, governance))
    }
}

async fn load_issue_metrics(pool: &PgPool) -> Result<IssueEmergenceMetrics, AppError> {
    sqlx::query_as::<_, IssueEmergenceMetrics>(
        r#"
        SELECT
            COUNT(*)::BIGINT AS total_issues,
            COUNT(*) FILTER (
                WHERE status::TEXT IN (
                    'backlog', 'brief_ready', 'assigned', 'in_progress',
                    'submitted', 'internal_review', 'client_review', 'revision_required'
                )
            )::BIGINT AS open_issues,
            COUNT(*) FILTER (
                WHERE status::TEXT IN ('submitted', 'internal_review', 'client_review', 'revision_required')
            )::BIGINT AS review_issues,
            COUNT(*) FILTER (
                WHERE status::TEXT IN ('approved', 'delivered')
            )::BIGINT AS delivery_issues,
            COUNT(*) FILTER (
                WHERE EXISTS (SELECT 1 FROM issue_assets ia WHERE ia.issue_id = i.id)
            )::BIGINT AS evidence_linked_issues,
            COUNT(*) FILTER (
                WHERE status::TEXT IN ('submitted', 'internal_review', 'client_review', 'revision_required')
                  AND NOT EXISTS (SELECT 1 FROM issue_assets ia WHERE ia.issue_id = i.id)
            )::BIGINT AS missing_evidence_issues,
            COUNT(*) FILTER (
                WHERE due_date < CURRENT_DATE
                  AND status::TEXT IN (
                    'backlog', 'brief_ready', 'assigned', 'in_progress',
                    'submitted', 'internal_review', 'client_review', 'revision_required'
                  )
            )::BIGINT AS overdue_issues,
            COUNT(*) FILTER (
                WHERE qa_status::TEXT IN ('warning', 'failed')
            )::BIGINT AS qa_risk_issues
        FROM issues i
        WHERE deleted_at IS NULL
        "#,
    )
    .fetch_one(pool)
    .await
    .map_err(Into::into)
}

async fn load_asset_metrics(pool: &PgPool) -> Result<AssetEmergenceMetrics, AppError> {
    sqlx::query_as::<_, AssetEmergenceMetrics>(
        r#"
        SELECT
            COUNT(*)::BIGINT AS total_assets,
            COUNT(*) FILTER (WHERE status::TEXT = 'active')::BIGINT AS active_assets,
            COUNT(*) FILTER (WHERE asset_type::TEXT = 'code')::BIGINT AS code_assets,
            COUNT(*) FILTER (WHERE version > 1)::BIGINT AS versioned_assets,
            (SELECT COUNT(*)::BIGINT FROM asset_ai_insights) AS ai_insights
        FROM assets
        WHERE deleted_at IS NULL
        "#,
    )
    .fetch_one(pool)
    .await
    .map_err(Into::into)
}

async fn load_governance_metrics(pool: &PgPool) -> Result<GovernanceEmergenceMetrics, AppError> {
    sqlx::query_as::<_, GovernanceEmergenceMetrics>(
        r#"
        SELECT
            (SELECT COUNT(*)::BIGINT FROM milestones WHERE deleted_at IS NULL) AS milestones,
            (SELECT COUNT(*)::BIGINT FROM delivery_packages WHERE deleted_at IS NULL) AS delivery_packages,
            (SELECT COUNT(*)::BIGINT FROM rag_operation_memories) AS rag_memories,
            (SELECT COUNT(*)::BIGINT FROM rag_operation_memories WHERE created_at > NOW() - INTERVAL '24 hours') AS recent_rag_memories,
            (SELECT COUNT(*)::BIGINT FROM resource_locks WHERE released_at IS NULL AND expires_at > NOW()) AS active_locks,
            (SELECT COUNT(*)::BIGINT FROM user_sessions WHERE revoked_at IS NULL AND expires_at > NOW()) AS active_sessions
        "#,
    )
    .fetch_one(pool)
    .await
    .map_err(Into::into)
}

fn build_snapshot(
    issue: IssueEmergenceMetrics,
    asset: AssetEmergenceMetrics,
    governance: GovernanceEmergenceMetrics,
) -> EmergenceSnapshot {
    let evidence_coverage_percent = if issue.total_issues > 0 {
        calculate_percent(issue.evidence_linked_issues, issue.total_issues)
    } else if asset.total_assets > 0 {
        100
    } else {
        0
    };
    let risk_count = issue.missing_evidence_issues + issue.overdue_issues + issue.qa_risk_issues;
    let flow_health_percent =
        clamp_percent(100 - calculate_percent(risk_count, issue.open_issues.max(1)));
    let ai_readiness_percent = clamp_percent(
        20 + if governance.rag_memories > 0 { 25 } else { 0 }
            + if governance.recent_rag_memories > 0 {
                15
            } else {
                0
            }
            + if asset.ai_insights > 0 { 20 } else { 0 }
            + if governance.active_sessions > 0 {
                10
            } else {
                0
            },
    );
    let delivery_percent = if issue.delivery_issues > 0 {
        80
    } else if governance.delivery_packages > 0 {
        65
    } else {
        40
    };
    let readiness_percent = clamp_percent(
        ((evidence_coverage_percent as f32 * 0.34)
            + (flow_health_percent as f32 * 0.28)
            + (ai_readiness_percent as f32 * 0.28)
            + (delivery_percent as f32 * 0.10))
            .round() as i64,
    );
    let metrics = EmergenceMetrics {
        total_issues: issue.total_issues,
        open_issues: issue.open_issues,
        review_issues: issue.review_issues,
        delivery_issues: issue.delivery_issues,
        evidence_linked_issues: issue.evidence_linked_issues,
        missing_evidence_issues: issue.missing_evidence_issues,
        overdue_issues: issue.overdue_issues,
        qa_risk_issues: issue.qa_risk_issues,
        total_assets: asset.total_assets,
        active_assets: asset.active_assets,
        code_assets: asset.code_assets,
        versioned_assets: asset.versioned_assets,
        ai_insights: asset.ai_insights,
        milestones: governance.milestones,
        delivery_packages: governance.delivery_packages,
        rag_memories: governance.rag_memories,
        recent_rag_memories: governance.recent_rag_memories,
        active_locks: governance.active_locks,
        active_sessions: governance.active_sessions,
    };

    EmergenceSnapshot {
        generated_at: Utc::now().to_rfc3339(),
        posture: derive_posture(&metrics),
        readiness_percent,
        evidence_coverage_percent,
        flow_health_percent,
        ai_readiness_percent,
        risk_count,
        loop_stages: build_loop(&metrics),
        signals: build_signals(&metrics),
        recommendations: build_recommendations(&metrics),
        metrics,
    }
}

fn derive_posture(metrics: &EmergenceMetrics) -> String {
    if metrics.missing_evidence_issues > 0 || metrics.total_assets == 0 {
        "sense".to_string()
    } else if metrics.overdue_issues > 0 || metrics.qa_risk_issues > 0 || metrics.rag_memories == 0
    {
        "decide".to_string()
    } else {
        "act".to_string()
    }
}

fn build_loop(metrics: &EmergenceMetrics) -> Vec<EmergenceLoopStage> {
    vec![
        EmergenceLoopStage {
            mode: "sense".to_string(),
            label: "Sense".to_string(),
            value: format!(
                "{}/{}",
                metrics.evidence_linked_issues, metrics.total_issues
            ),
            detail: format!(
                "{} assets, {} code files, {} AI insights",
                metrics.total_assets, metrics.code_assets, metrics.ai_insights
            ),
        },
        EmergenceLoopStage {
            mode: "decide".to_string(),
            label: "Decide".to_string(),
            value: (metrics.overdue_issues + metrics.qa_risk_issues).to_string(),
            detail: format!(
                "{} overdue, {} QA risks, {} review evidence gaps",
                metrics.overdue_issues, metrics.qa_risk_issues, metrics.missing_evidence_issues
            ),
        },
        EmergenceLoopStage {
            mode: "act".to_string(),
            label: "Act".to_string(),
            value: metrics.delivery_issues.to_string(),
            detail: format!(
                "{} delivery candidates, {} packages, {} active locks",
                metrics.delivery_issues, metrics.delivery_packages, metrics.active_locks
            ),
        },
    ]
}

fn build_signals(metrics: &EmergenceMetrics) -> Vec<EmergenceSignal> {
    let evidence_percent = if metrics.total_issues > 0 {
        calculate_percent(metrics.evidence_linked_issues, metrics.total_issues)
    } else if metrics.total_assets > 0 {
        100
    } else {
        0
    };
    let flow_percent = clamp_percent(
        100 - calculate_percent(
            metrics.overdue_issues + metrics.qa_risk_issues,
            metrics.open_issues.max(1),
        ),
    );
    let ai_percent = clamp_percent(
        20 + if metrics.rag_memories > 0 { 25 } else { 0 }
            + if metrics.recent_rag_memories > 0 {
                15
            } else {
                0
            }
            + if metrics.ai_insights > 0 { 20 } else { 0 }
            + if metrics.active_sessions > 0 { 10 } else { 0 },
    );

    vec![
        EmergenceSignal {
            id: "data_lake_evidence".to_string(),
            label: "Data lake evidence".to_string(),
            value: format!("{}%", evidence_percent),
            detail: format!(
                "{} linked issues, {} missing review evidence, {} versioned assets",
                metrics.evidence_linked_issues,
                metrics.missing_evidence_issues,
                metrics.versioned_assets
            ),
            source: "data_lake".to_string(),
            tone: tone_from_percent(evidence_percent).to_string(),
        },
        EmergenceSignal {
            id: "project_flow".to_string(),
            label: "Project flow".to_string(),
            value: format!("{}%", flow_percent),
            detail: format!(
                "{} open issues, {} overdue, {} QA risks",
                metrics.open_issues, metrics.overdue_issues, metrics.qa_risk_issues
            ),
            source: "project_flow".to_string(),
            tone: tone_from_percent(flow_percent).to_string(),
        },
        EmergenceSignal {
            id: "ai_memory".to_string(),
            label: "AI memory".to_string(),
            value: format!("{}%", ai_percent),
            detail: format!(
                "{} RAG memories, {} recent, {} multimodal insights",
                metrics.rag_memories, metrics.recent_rag_memories, metrics.ai_insights
            ),
            source: "ai".to_string(),
            tone: tone_from_percent(ai_percent).to_string(),
        },
        EmergenceSignal {
            id: "governance_locks".to_string(),
            label: "Governance locks".to_string(),
            value: metrics.active_locks.to_string(),
            detail: format!(
                "{} active sessions, {} milestones, {} packages",
                metrics.active_sessions, metrics.milestones, metrics.delivery_packages
            ),
            source: "automation".to_string(),
            tone: if metrics.active_locks > 8 {
                "watch"
            } else {
                "healthy"
            }
            .to_string(),
        },
    ]
}

fn build_recommendations(metrics: &EmergenceMetrics) -> Vec<EmergenceRecommendation> {
    let mut recommendations = Vec::new();

    if metrics.total_assets == 0 {
        recommendations.push(EmergenceRecommendation {
            id: "lake_intake_gap".to_string(),
            title: "Seed the data lake".to_string(),
            mode: "sense".to_string(),
            action: "Upload or sync source assets so project flow can build evidence lineage."
                .to_string(),
            impact: format!(
                "{} open issues currently have no active asset pool to draw from",
                metrics.open_issues
            ),
            confidence: 0.9,
            tone: "blocked".to_string(),
            app: "Data Lake".to_string(),
            control_id: "upload-assets".to_string(),
        });
    } else if metrics.missing_evidence_issues > 0 {
        recommendations.push(EmergenceRecommendation {
            id: "evidence_gate".to_string(),
            title: "Evidence-first review gate".to_string(),
            mode: "sense".to_string(),
            action: "Prioritize attaching data lake assets before review or approval decisions."
                .to_string(),
            impact: format!(
                "{} review items are missing lake evidence",
                metrics.missing_evidence_issues
            ),
            confidence: 0.88,
            tone: "blocked".to_string(),
            app: "Data Lake".to_string(),
            control_id: "attach-asset-evidence".to_string(),
        });
    } else if metrics.total_issues > 0
        && metrics.evidence_linked_issues * 100 < metrics.total_issues * 60
    {
        recommendations.push(EmergenceRecommendation {
            id: "evidence_coverage".to_string(),
            title: "Raise issue evidence coverage".to_string(),
            mode: "sense".to_string(),
            action: "Link existing data lake assets to active issues before downstream automation."
                .to_string(),
            impact: format!(
                "{} of {} issues have linked evidence",
                metrics.evidence_linked_issues, metrics.total_issues
            ),
            confidence: 0.84,
            tone: "watch".to_string(),
            app: "Data Lake".to_string(),
            control_id: "attach-asset-evidence".to_string(),
        });
    }

    if metrics.overdue_issues > 0 || metrics.qa_risk_issues > 0 {
        recommendations.push(EmergenceRecommendation {
            id: "risk_triage".to_string(),
            title: "AI risk triage queue".to_string(),
            mode: "decide".to_string(),
            action: "Rank overdue and QA-risk issues for producer review with RAG context."
                .to_string(),
            impact: format!(
                "{} flow risks need decision support",
                metrics.overdue_issues + metrics.qa_risk_issues
            ),
            confidence: 0.82,
            tone: "watch".to_string(),
            app: "Jira Flow".to_string(),
            control_id: "comment-risk".to_string(),
        });
    }

    if metrics.rag_memories == 0 || metrics.recent_rag_memories == 0 {
        recommendations.push(EmergenceRecommendation {
            id: "rag_feedback_loop".to_string(),
            title: "Close the RAG feedback loop".to_string(),
            mode: "decide".to_string(),
            action:
                "Distill current operations into RAG so AI decisions reflect recent product state."
                    .to_string(),
            impact: format!(
                "{} total RAG memories, {} in the last day",
                metrics.rag_memories, metrics.recent_rag_memories
            ),
            confidence: 0.79,
            tone: "watch".to_string(),
            app: "AI Control".to_string(),
            control_id: "distill-emergence".to_string(),
        });
    }

    if metrics.delivery_issues > 0 || metrics.delivery_packages > 0 {
        recommendations.push(EmergenceRecommendation {
            id: "delivery_package".to_string(),
            title: "Package delivery readiness".to_string(),
            mode: "act".to_string(),
            action: "Assemble approved work, asset evidence, version gates, and audit trail."
                .to_string(),
            impact: format!(
                "{} delivery candidates and {} packages are available",
                metrics.delivery_issues, metrics.delivery_packages
            ),
            confidence: 0.84,
            tone: "healthy".to_string(),
            app: "Delivery".to_string(),
            control_id: "version-gate".to_string(),
        });
    }

    if recommendations.is_empty() {
        recommendations.push(EmergenceRecommendation {
            id: "continuous_loop".to_string(),
            title: "Continuous operating loop".to_string(),
            mode: "act".to_string(),
            action:
                "Keep sensing evidence, deciding priority, and preparing replica-only AI actions."
                    .to_string(),
            impact: "No blocking signals are present in the current operating surface.".to_string(),
            confidence: 0.72,
            tone: "healthy".to_string(),
            app: "Management".to_string(),
            control_id: "refresh-emergence".to_string(),
        });
    }

    recommendations.truncate(4);
    recommendations
}

fn calculate_percent(value: i64, total: i64) -> i64 {
    if total <= 0 {
        return 0;
    }
    clamp_percent(((value as f32 / total as f32) * 100.0).round() as i64)
}

fn clamp_percent(value: i64) -> i64 {
    value.clamp(0, 100)
}

fn tone_from_percent(value: i64) -> &'static str {
    if value >= 75 {
        "healthy"
    } else if value >= 45 {
        "watch"
    } else {
        "blocked"
    }
}
