/*
```cypher
CREATE
  (f:File {name: "llm_optimizer_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::llm_optimizer_service", type: "module"}),
  (c1:Class {name: "OptimizationSignal", type: "class", language: "rust", signature: "struct OptimizationSignal"}),
  (c2:Class {name: "PromptVersion", type: "class", language: "rust", signature: "struct PromptVersion"}),
  (c3:Class {name: "OptimizationRun", type: "class", language: "rust", signature: "struct OptimizationRun"}),
  (c4:Class {name: "LlmOptimizerService", type: "class", language: "rust", signature: "struct LlmOptimizerService"}),
  (c5:Class {name: "RecordSignalInput", type: "class", language: "rust", signature: "struct RecordSignalInput"}),
  (c6:Class {name: "LoopStatus", type: "class", language: "rust", signature: "struct LoopStatus"}),
  (c7:Class {name: "SignalAggregate", type: "class", language: "rust", signature: "struct SignalAggregate"}),
  (c8:Class {name: "PromptSuggestion", type: "class", language: "rust", signature: "struct PromptSuggestion"}),
  (fn1:Function {name: "LlmOptimizerService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "LlmOptimizerService::spawn_background_loop", type: "function", language: "rust", signature: "pub fn spawn_background_loop(&self)"}),
  (fn3:Function {name: "LlmOptimizerService::record_signal", type: "function", language: "rust", signature: "pub async fn record_signal(&self, input: RecordSignalInput) -> Result<Uuid, AppError>"}),
  (fn4:Function {name: "LlmOptimizerService::run_optimization_loop", type: "function", language: "rust", signature: "pub async fn run_optimization_loop(&self, ai_config: Option<&AiProviderConfig>, triggered_by: &str) -> Result<OptimizationRun, AppError>"}),
  (fn5:Function {name: "LlmOptimizerService::get_best_prompt", type: "function", language: "rust", signature: "pub async fn get_best_prompt(&self, operation_type: &str) -> Result<Option<PromptVersion>, AppError>"}),
  (fn6:Function {name: "LlmOptimizerService::get_loop_status", type: "function", language: "rust", signature: "pub async fn get_loop_status(&self) -> Result<LoopStatus, AppError>"}),
  (fn7:Function {name: "LlmOptimizerService::list_prompt_versions", type: "function", language: "rust", signature: "pub async fn list_prompt_versions(&self, operation_type: &str) -> Result<Vec<PromptVersion>, AppError>"}),
  (fn8:Function {name: "aggregate_signals", type: "function", language: "rust", signature: "async fn aggregate_signals(pool: &PgPool, window_hours: i64) -> Result<Vec<SignalAggregate>, AppError>"}),
  (fn9:Function {name: "suggest_prompt", type: "function", language: "rust", signature: "async fn suggest_prompt(ai_config: &AiProviderConfig, agg: &SignalAggregate, current_prompt: &str) -> Result<PromptSuggestion, AppError>"}),
  (fn10:Function {name: "promote_best_candidate", type: "function", language: "rust", signature: "async fn promote_best_candidate(pool: &PgPool, operation_type: &str) -> Result<bool, AppError>"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "LOOP_INTERVAL_HOURS", type: "variable"}),
  (v3:Variable {name: "SIGNAL_WINDOW_HOURS", type: "variable"}),
  (v4:Variable {name: "MIN_SIGNALS_TO_OPTIMIZE", type: "variable"}),
  (v5:Variable {name: "CANDIDATE_PROMOTION_THRESHOLD", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (c4)-[:HAS_METHOD]->(fn1),
  (c4)-[:HAS_METHOD]->(fn2),
  (c4)-[:HAS_METHOD]->(fn3),
  (c4)-[:HAS_METHOD]->(fn4),
  (c4)-[:HAS_METHOD]->(fn5),
  (c4)-[:HAS_METHOD]->(fn6),
  (c4)-[:HAS_METHOD]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (fn2)-[:CALLS]->(fn4),
  (fn4)-[:CALLS]->(fn8),
  (fn4)-[:CALLS]->(fn9),
  (fn4)-[:CALLS]->(fn10),
  (fn8)-[:USES]->(v3),
  (fn9)-[:CALLS]->(fn1);
```
*/

use std::time::Duration;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::{FromRow, PgPool};
use tracing::{error, info, warn};
use uuid::Uuid;

use crate::{
    errors::AppError,
    services::ai_provider_service::{AiProviderConfig, AiProviderService},
};

// How often the background loop wakes to run optimization (hours).
const LOOP_INTERVAL_HOURS: u64 = 6;
// How far back to look for signals in each optimization run (hours).
const SIGNAL_WINDOW_HOURS: i64 = 48;
// Minimum number of signals required before attempting to optimize an operation.
const MIN_SIGNALS_TO_OPTIMIZE: i64 = 10;
// Minimum avg quality score a candidate prompt must reach before it gets promoted to active.
const CANDIDATE_PROMOTION_THRESHOLD: f64 = 0.70;

// ─── Public domain types ───────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct RecordSignalInput {
    pub operation_type: String,
    pub project_id: Option<Uuid>,
    pub prompt_version_id: Option<Uuid>,
    pub model: String,
    pub quality_score: Option<f32>,
    pub latency_ms: Option<i32>,
    pub tokens_used: Option<i32>,
    pub actor: String,
    pub metadata: Value,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct OptimizationSignal {
    pub id: Uuid,
    pub operation_type: String,
    pub project_id: Option<Uuid>,
    pub prompt_version_id: Option<Uuid>,
    pub model: String,
    pub quality_score: Option<f32>,
    pub latency_ms: Option<i32>,
    pub tokens_used: Option<i32>,
    pub actor: String,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct PromptVersion {
    pub id: Uuid,
    pub operation_type: String,
    pub version: i32,
    pub system_prompt: String,
    pub rationale: String,
    pub status: String,
    pub sample_count: i32,
    pub avg_quality_score: Option<f32>,
    pub optimization_run_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub promoted_at: Option<DateTime<Utc>>,
    pub retired_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct OptimizationRun {
    pub id: Uuid,
    pub triggered_by: String,
    pub signals_analyzed: i32,
    pub operations_improved: i32,
    pub new_versions: i32,
    pub insight: String,
    pub status: String,
    pub error: Option<String>,
    pub started_at: DateTime<Utc>,
    pub finished_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct LoopStatus {
    pub last_run: Option<OptimizationRun>,
    pub total_signals: i64,
    pub active_prompt_count: i64,
    pub candidate_prompt_count: i64,
    pub total_runs: i64,
    pub next_run_in_hours: u64,
}

// ─── Internal aggregation type ─────────────────────────────────────────────

#[derive(Debug, FromRow)]
struct SignalAggregate {
    operation_type: String,
    signal_count: i64,
    avg_quality: Option<f64>,
    avg_latency_ms: Option<f64>,
    low_quality_samples: Value,
}

#[derive(Debug, Deserialize)]
struct PromptSuggestion {
    system_prompt: String,
    rationale: String,
}

// ─── Service ───────────────────────────────────────────────────────────────

#[derive(Clone)]
pub struct LlmOptimizerService {
    pool: PgPool,
}

impl LlmOptimizerService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Starts a background tokio task that runs the optimization loop on a
    /// fixed cadence. The loop uses no AI config (signals-only analysis) unless
    /// a config is injected via the manual `/run` endpoint.
    pub fn spawn_background_loop(&self) {
        let svc = self.clone();
        tokio::spawn(async move {
            loop {
                tokio::time::sleep(Duration::from_secs(LOOP_INTERVAL_HOURS * 3600)).await;
                info!("LlmOptimizer: background loop waking up");
                if let Err(e) = svc.run_optimization_loop(None, "scheduler").await {
                    error!(error = %e, "LlmOptimizer: background loop error");
                }
            }
        });
    }

    /// Persist a telemetry signal emitted after an AI call.
    pub async fn record_signal(&self, input: RecordSignalInput) -> Result<Uuid, AppError> {
        let id = Uuid::new_v4();
        sqlx::query(
            r#"
            INSERT INTO llm_optimization_signals
                (id, operation_type, project_id, prompt_version_id, model,
                 quality_score, latency_ms, tokens_used, actor, metadata)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            "#,
        )
        .bind(id)
        .bind(&input.operation_type)
        .bind(input.project_id)
        .bind(input.prompt_version_id)
        .bind(&input.model)
        .bind(input.quality_score)
        .bind(input.latency_ms)
        .bind(input.tokens_used)
        .bind(&input.actor)
        .bind(&input.metadata)
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        // After accumulating enough signals, immediately promote any ready candidate.
        let _ = promote_best_candidate(&self.pool, &input.operation_type).await;

        Ok(id)
    }

    /// Core optimization loop: aggregate recent signals across all projects,
    /// optionally generate improved prompt versions via AI, record the run.
    pub async fn run_optimization_loop(
        &self,
        ai_config: Option<&AiProviderConfig>,
        triggered_by: &str,
    ) -> Result<OptimizationRun, AppError> {
        let run_id = Uuid::new_v4();
        let started_at = Utc::now();

        sqlx::query(
            "INSERT INTO llm_optimization_runs (id, triggered_by, started_at) VALUES ($1,$2,$3)",
        )
        .bind(run_id)
        .bind(triggered_by)
        .bind(started_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        let result = self
            .execute_loop_body(run_id, ai_config, triggered_by)
            .await;

        let (status, error_msg, signals, improved, new_vers, insight) = match result {
            Ok((s, i, n, ins)) => ("ok".to_string(), None, s, i, n, ins),
            Err(ref e) => {
                error!(error = %e, "LlmOptimizer: loop body failed");
                ("failed".to_string(), Some(e.to_string()), 0, 0, 0, String::new())
            }
        };

        sqlx::query(
            r#"
            UPDATE llm_optimization_runs
               SET signals_analyzed   = $2,
                   operations_improved = $3,
                   new_versions        = $4,
                   insight             = $5,
                   status              = $6,
                   error               = $7,
                   finished_at         = NOW()
             WHERE id = $1
            "#,
        )
        .bind(run_id)
        .bind(signals)
        .bind(improved)
        .bind(new_vers)
        .bind(&insight)
        .bind(&status)
        .bind(&error_msg)
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        sqlx::query_as::<_, OptimizationRun>(
            "SELECT * FROM llm_optimization_runs WHERE id = $1",
        )
        .bind(run_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))
    }

    async fn execute_loop_body(
        &self,
        run_id: Uuid,
        ai_config: Option<&AiProviderConfig>,
        _triggered_by: &str,
    ) -> Result<(i32, i32, i32, String), AppError> {
        let aggregates = aggregate_signals(&self.pool, SIGNAL_WINDOW_HOURS).await?;
        let total_signals: i32 = aggregates.iter().map(|a| a.signal_count as i32).sum();

        if aggregates.is_empty() {
            info!("LlmOptimizer: no signals in window, nothing to optimize");
            return Ok((0, 0, 0, "No signals collected in the observation window.".to_string()));
        }

        let mut operations_improved = 0i32;
        let mut new_versions = 0i32;
        let mut insights: Vec<String> = Vec::new();

        for agg in &aggregates {
            if agg.signal_count < MIN_SIGNALS_TO_OPTIMIZE {
                continue;
            }

            let avg_q = agg.avg_quality.unwrap_or(1.0);
            insights.push(format!(
                "{}: {:.0} signals, avg_quality={:.2}",
                agg.operation_type, agg.signal_count, avg_q
            ));

            // Only invoke AI for prompt improvement when quality is below threshold.
            if avg_q >= CANDIDATE_PROMOTION_THRESHOLD {
                // Still check if any candidate is ready to be promoted.
                if promote_best_candidate(&self.pool, &agg.operation_type).await? {
                    operations_improved += 1;
                }
                continue;
            }

            let current_prompt = self
                .get_best_prompt(&agg.operation_type)
                .await?
                .map(|p| p.system_prompt)
                .unwrap_or_else(|| format!(
                    "You are a helpful AI assistant for the {} operation.",
                    agg.operation_type
                ));

            if let Some(config) = ai_config {
                match suggest_prompt(config, agg, &current_prompt).await {
                    Ok(suggestion) => {
                        let next_version = next_version_number(&self.pool, &agg.operation_type).await?;
                        sqlx::query(
                            r#"
                            INSERT INTO llm_prompt_versions
                                (operation_type, version, system_prompt, rationale,
                                 status, optimization_run_id)
                            VALUES ($1,$2,$3,$4,'candidate',$5)
                            "#,
                        )
                        .bind(&agg.operation_type)
                        .bind(next_version)
                        .bind(&suggestion.system_prompt)
                        .bind(&suggestion.rationale)
                        .bind(run_id)
                        .execute(&self.pool)
                        .await
                        .map_err(|e| AppError::Database(e.to_string()))?;

                        new_versions += 1;
                        operations_improved += 1;
                        info!(
                            operation = %agg.operation_type,
                            version = next_version,
                            "LlmOptimizer: created new candidate prompt"
                        );
                    }
                    Err(e) => {
                        warn!(operation = %agg.operation_type, error = %e, "LlmOptimizer: prompt suggestion failed");
                    }
                }
            } else {
                // Without AI config, still log the observation.
                warn!(
                    operation = %agg.operation_type,
                    avg_quality = avg_q,
                    "LlmOptimizer: low quality detected but no AI config available for improvement"
                );
            }
        }

        let insight = if insights.is_empty() {
            "Insufficient signal volume for optimization.".to_string()
        } else {
            insights.join("; ")
        };

        Ok((total_signals, operations_improved, new_versions, insight))
    }

    /// Returns the current best (highest avg quality, active status) prompt for
    /// a given operation type.  Returns `None` when no validated prompt exists
    /// yet — callers fall back to their built-in system prompt.
    pub async fn get_best_prompt(
        &self,
        operation_type: &str,
    ) -> Result<Option<PromptVersion>, AppError> {
        sqlx::query_as::<_, PromptVersion>(
            r#"
            SELECT * FROM llm_prompt_versions
             WHERE operation_type = $1 AND status = 'active'
             ORDER BY avg_quality_score DESC NULLS LAST, promoted_at DESC
             LIMIT 1
            "#,
        )
        .bind(operation_type)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))
    }

    /// Returns all prompt versions for an operation type (any status).
    pub async fn list_prompt_versions(
        &self,
        operation_type: &str,
    ) -> Result<Vec<PromptVersion>, AppError> {
        sqlx::query_as::<_, PromptVersion>(
            r#"
            SELECT * FROM llm_prompt_versions
             WHERE operation_type = $1
             ORDER BY version DESC
            "#,
        )
        .bind(operation_type)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))
    }

    /// High-level status summary for the optimizer dashboard.
    pub async fn get_loop_status(&self) -> Result<LoopStatus, AppError> {
        let last_run = sqlx::query_as::<_, OptimizationRun>(
            "SELECT * FROM llm_optimization_runs ORDER BY started_at DESC LIMIT 1",
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        let total_signals: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM llm_optimization_signals")
            .fetch_one(&self.pool)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        let active_prompt_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM llm_prompt_versions WHERE status = 'active'",
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        let candidate_prompt_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM llm_prompt_versions WHERE status = 'candidate'",
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

        let total_runs: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM llm_optimization_runs")
                .fetch_one(&self.pool)
                .await
                .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(LoopStatus {
            last_run,
            total_signals,
            active_prompt_count,
            candidate_prompt_count,
            total_runs,
            next_run_in_hours: LOOP_INTERVAL_HOURS,
        })
    }
}

// ─── Internal helpers ──────────────────────────────────────────────────────

async fn aggregate_signals(
    pool: &PgPool,
    window_hours: i64,
) -> Result<Vec<SignalAggregate>, AppError> {
    sqlx::query_as::<_, SignalAggregate>(
        r#"
        SELECT
            operation_type,
            COUNT(*)::BIGINT                             AS signal_count,
            AVG(quality_score)::DOUBLE PRECISION         AS avg_quality,
            AVG(latency_ms)::DOUBLE PRECISION            AS avg_latency_ms,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'quality_score', quality_score,
                        'model',         model,
                        'metadata',      metadata
                    )
                ) FILTER (WHERE quality_score IS NOT NULL AND quality_score < 0.5)
                    OVER (PARTITION BY operation_type ORDER BY quality_score ASC)
                    [0:5],
                '[]'::jsonb
            )                                            AS low_quality_samples
        FROM llm_optimization_signals
        WHERE created_at >= NOW() - ($1 || ' hours')::INTERVAL
        GROUP BY operation_type
        ORDER BY avg_quality ASC NULLS FIRST
        "#,
    )
    .bind(window_hours)
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))
}

async fn suggest_prompt(
    ai_config: &AiProviderConfig,
    agg: &SignalAggregate,
    current_prompt: &str,
) -> Result<PromptSuggestion, AppError> {
    let svc = AiProviderService::new();

    let system = r#"You are an expert prompt engineer specializing in improving LLM system prompts.
Analyze the provided performance data and generate an improved system prompt.
Respond with valid JSON only: {"system_prompt": "...", "rationale": "..."}"#;

    let user = format!(
        r#"Operation type: {op}
Current system prompt: {prompt}
Performance window (last {hours}h):
- Signal count: {count}
- Average quality score: {avg:.2} (scale 0-1, higher is better)
- Average latency: {lat:.0}ms
- Low-quality sample metadata: {samples}

Identify the root causes of poor quality and write an improved system prompt.
Keep the prompt concise, specific, and actionable."#,
        op = agg.operation_type,
        prompt = current_prompt,
        hours = SIGNAL_WINDOW_HOURS,
        count = agg.signal_count,
        avg = agg.avg_quality.unwrap_or(0.0),
        lat = agg.avg_latency_ms.unwrap_or(0.0),
        samples = agg.low_quality_samples,
    );

    svc.chat_json::<PromptSuggestion>(ai_config, system, &user)
        .await
}

async fn next_version_number(pool: &PgPool, operation_type: &str) -> Result<i32, AppError> {
    let max: Option<i32> = sqlx::query_scalar(
        "SELECT MAX(version) FROM llm_prompt_versions WHERE operation_type = $1",
    )
    .bind(operation_type)
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(max.unwrap_or(0) + 1)
}

/// Promotes a candidate prompt to `active` if it has enough validated signals
/// above the quality threshold; retires the previously active prompt.
async fn promote_best_candidate(pool: &PgPool, operation_type: &str) -> Result<bool, AppError> {
    // Refresh avg_quality_score for all candidates of this operation.
    sqlx::query(
        r#"
        UPDATE llm_prompt_versions pv
           SET avg_quality_score = sub.avg_q,
               sample_count       = sub.cnt
          FROM (
            SELECT prompt_version_id,
                   AVG(quality_score)  AS avg_q,
                   COUNT(*)            AS cnt
              FROM llm_optimization_signals
             WHERE prompt_version_id IS NOT NULL
               AND quality_score IS NOT NULL
             GROUP BY prompt_version_id
          ) sub
         WHERE pv.id = sub.prompt_version_id
           AND pv.operation_type = $1
           AND pv.status = 'candidate'
        "#,
    )
    .bind(operation_type)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    // Find best candidate above promotion threshold.
    let candidate: Option<(Uuid,)> = sqlx::query_as(
        r#"
        SELECT id FROM llm_prompt_versions
         WHERE operation_type = $1
           AND status = 'candidate'
           AND avg_quality_score >= $2
           AND sample_count >= $3
         ORDER BY avg_quality_score DESC
         LIMIT 1
        "#,
    )
    .bind(operation_type)
    .bind(CANDIDATE_PROMOTION_THRESHOLD as f32)
    .bind(MIN_SIGNALS_TO_OPTIMIZE as i32)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    let Some((candidate_id,)) = candidate else {
        return Ok(false);
    };

    // Retire existing active prompts.
    sqlx::query(
        "UPDATE llm_prompt_versions SET status='retired', retired_at=NOW() WHERE operation_type=$1 AND status='active'",
    )
    .bind(operation_type)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    // Promote candidate.
    sqlx::query(
        "UPDATE llm_prompt_versions SET status='active', promoted_at=NOW() WHERE id=$1",
    )
    .bind(candidate_id)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    info!(
        operation = %operation_type,
        candidate_id = %candidate_id,
        "LlmOptimizer: promoted candidate prompt to active"
    );
    Ok(true)
}
