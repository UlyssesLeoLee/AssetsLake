/*
```cypher
CREATE
  (f:File {name: "lake_query_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::lake_query_service", type: "module"}),
  (c1:Class {name: "LakeQueryRequest", type: "class", language: "rust", signature: "struct LakeQueryRequest"}),
  (c2:Class {name: "LakeQueryResponse", type: "class", language: "rust", signature: "struct LakeQueryResponse"}),
  (c3:Class {name: "LakeQueryService", type: "class", language: "rust", signature: "struct LakeQueryService"}),
  (fn1:Function {name: "LakeQueryService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "LakeQueryService::execute_sql", type: "function", language: "rust", signature: "async fn execute_sql(&self, request: LakeQueryRequest) -> Result<LakeQueryResponse, AppError>"}),
  (fn3:Function {name: "LakeQueryService::execute_cypher", type: "function", language: "rust", signature: "async fn execute_cypher(&self, request: LakeQueryRequest) -> Result<LakeQueryResponse, AppError>"}),
  (fn4:Function {name: "LakeQueryService::fetch_json_rows", type: "function", language: "rust", signature: "async fn fetch_json_rows(&self, sql: &str) -> Result<Vec<Value>, AppError>"}),
  (fn5:Function {name: "normalize_limit", type: "function", language: "rust", signature: "fn normalize_limit(limit: Option<i64>) -> i64"}),
  (fn6:Function {name: "normalize_query", type: "function", language: "rust", signature: "fn normalize_query(query: &str) -> Result<String, AppError>"}),
  (fn7:Function {name: "validate_readonly_sql", type: "function", language: "rust", signature: "fn validate_readonly_sql(query: &str) -> Result<(), AppError>"}),
  (fn8:Function {name: "validate_readonly_cypher", type: "function", language: "rust", signature: "fn validate_readonly_cypher(query: &str) -> Result<(), AppError>"}),
  (fn9:Function {name: "contains_forbidden_token", type: "function", language: "rust", signature: "fn contains_forbidden_token(query: &str, forbidden: &[&str]) -> bool"}),
  (fn10:Function {name: "collect_columns", type: "function", language: "rust", signature: "fn collect_columns(rows: &[Value]) -> Vec<String>"}),
  (fn11:Function {name: "cypher_projection_sql", type: "function", language: "rust", signature: "fn cypher_projection_sql(query: &str, limit: i64) -> Result<(String, Vec<String>, Vec<String>), AppError>"}),
  (fn12:Function {name: "asset_nodes_sql", type: "function", language: "rust", signature: "fn asset_nodes_sql(limit: i64) -> String"}),
  (fn13:Function {name: "issue_nodes_sql", type: "function", language: "rust", signature: "fn issue_nodes_sql(limit: i64) -> String"}),
  (fn14:Function {name: "rag_memory_nodes_sql", type: "function", language: "rust", signature: "fn rag_memory_nodes_sql(limit: i64) -> String"}),
  (fn15:Function {name: "issue_asset_edges_sql", type: "function", language: "rust", signature: "fn issue_asset_edges_sql(limit: i64) -> String"}),
  (fn16:Function {name: "asset_version_edges_sql", type: "function", language: "rust", signature: "fn asset_version_edges_sql(limit: i64) -> String"}),
  (fn17:Function {name: "issue_comment_edges_sql", type: "function", language: "rust", signature: "fn issue_comment_edges_sql(limit: i64) -> String"}),
  (fn18:Function {name: "all_nodes_sql", type: "function", language: "rust", signature: "fn all_nodes_sql(limit: i64) -> String"}),
  (fn19:Function {name: "asset_insight_nodes_sql", type: "function", language: "rust", signature: "fn asset_insight_nodes_sql(limit: i64) -> String"}),
  (fn20:Function {name: "asset_insight_edges_sql", type: "function", language: "rust", signature: "fn asset_insight_edges_sql(limit: i64) -> String"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "query", type: "variable"}),
  (v3:Variable {name: "limit", type: "variable"}),
  (v4:Variable {name: "rows", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c3)-[:HAS_METHOD]->(fn1),
  (c3)-[:HAS_METHOD]->(fn2),
  (c3)-[:HAS_METHOD]->(fn3),
  (c3)-[:HAS_METHOD]->(fn4),
  (m)-[:CONTAINS]->(fn5),
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
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn6),
  (fn2)-[:CALLS]->(fn7),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn6),
  (fn3)-[:CALLS]->(fn8),
  (fn3)-[:CALLS]->(fn11),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v4),
  (fn4)-[:USES]->(v1),
  (fn7)-[:CALLS]->(fn9),
  (fn8)-[:CALLS]->(fn9),
  (fn11)-[:CALLS]->(fn12),
  (fn11)-[:CALLS]->(fn13),
  (fn11)-[:CALLS]->(fn14),
  (fn11)-[:CALLS]->(fn15),
  (fn11)-[:CALLS]->(fn16),
  (fn11)-[:CALLS]->(fn17),
  (fn11)-[:CALLS]->(fn18),
  (fn11)-[:CALLS]->(fn19),
  (fn11)-[:CALLS]->(fn20);
```
*/

use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::PgPool;

use crate::errors::AppError;

const MAX_QUERY_LIMIT: i64 = 200;
const DEFAULT_QUERY_LIMIT: i64 = 50;

#[derive(Debug, Clone, Deserialize)]
pub struct LakeQueryRequest {
    pub query: String,
    pub limit: Option<i64>,
}

#[derive(Debug, Clone, Serialize)]
pub struct LakeQueryResponse {
    pub engine: String,
    pub readonly: bool,
    pub columns: Vec<String>,
    pub rows: Vec<Value>,
    pub row_count: usize,
    pub warnings: Vec<String>,
}

#[derive(Clone)]
pub struct LakeQueryService {
    pool: PgPool,
}

impl LakeQueryService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn execute_sql(
        &self,
        request: LakeQueryRequest,
    ) -> Result<LakeQueryResponse, AppError> {
        let limit = normalize_limit(request.limit);
        let query = normalize_query(&request.query)?;
        validate_readonly_sql(&query)?;

        let wrapped_query = format!(
            "SELECT row_to_json(lake_query_row)::jsonb AS row FROM ({}) lake_query_row LIMIT {}",
            query, limit
        );

        let mut tx = self.pool.begin().await?;
        sqlx::query("SET TRANSACTION READ ONLY")
            .execute(&mut *tx)
            .await?;
        sqlx::query("SET LOCAL statement_timeout = '5000ms'")
            .execute(&mut *tx)
            .await?;
        let rows: Vec<Value> = sqlx::query_scalar(&wrapped_query)
            .fetch_all(&mut *tx)
            .await?;
        tx.commit().await?;

        Ok(LakeQueryResponse {
            engine: "postgresql".to_string(),
            readonly: true,
            columns: collect_columns(&rows),
            row_count: rows.len(),
            rows,
            warnings: vec![
                "SQL console is read-only: only SELECT/WITH queries are accepted.".to_string(),
            ],
        })
    }

    pub async fn execute_cypher(
        &self,
        request: LakeQueryRequest,
    ) -> Result<LakeQueryResponse, AppError> {
        let limit = normalize_limit(request.limit);
        let query = normalize_query(&request.query)?;
        validate_readonly_cypher(&query)?;
        let (sql, columns, warnings) = cypher_projection_sql(&query, limit)?;
        let rows = self.fetch_json_rows(&sql).await?;

        Ok(LakeQueryResponse {
            engine: "data-lake-cypher-projection".to_string(),
            readonly: true,
            columns,
            row_count: rows.len(),
            rows,
            warnings,
        })
    }

    async fn fetch_json_rows(&self, sql: &str) -> Result<Vec<Value>, AppError> {
        sqlx::query_scalar(sql)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)
    }
}

fn normalize_limit(limit: Option<i64>) -> i64 {
    limit
        .unwrap_or(DEFAULT_QUERY_LIMIT)
        .clamp(1, MAX_QUERY_LIMIT)
}

fn normalize_query(query: &str) -> Result<String, AppError> {
    let trimmed = query.trim();
    if trimmed.is_empty() {
        return Err(AppError::validation("Query is required"));
    }

    let without_trailing_semicolon = trimmed.trim_end_matches(';').trim();
    if without_trailing_semicolon.contains(';') {
        return Err(AppError::validation(
            "Only one read-only statement is allowed",
        ));
    }

    Ok(without_trailing_semicolon.to_string())
}

fn validate_readonly_sql(query: &str) -> Result<(), AppError> {
    let normalized = query.trim_start().to_ascii_lowercase();
    if !(normalized.starts_with("select ") || normalized.starts_with("with ")) {
        return Err(AppError::validation(
            "SQL query must start with SELECT or WITH",
        ));
    }

    let forbidden = [
        "insert", "update", "delete", "drop", "alter", "truncate", "create", "merge", "grant",
        "revoke", "copy", "vacuum", "analyze", "refresh", "listen", "notify", "call", "execute",
        "do", "set", "reset", "lock", "nextval", "setval",
    ];
    if contains_forbidden_token(query, &forbidden) {
        return Err(AppError::validation(
            "SQL query contains a keyword that is not allowed in the read-only console",
        ));
    }

    Ok(())
}

fn validate_readonly_cypher(query: &str) -> Result<(), AppError> {
    let normalized = query.trim_start().to_ascii_lowercase();
    if !normalized.starts_with("match ") {
        return Err(AppError::validation("Cypher query must start with MATCH"));
    }

    let forbidden = [
        "create", "merge", "delete", "detach", "set", "remove", "drop", "call", "load", "foreach",
    ];
    if contains_forbidden_token(query, &forbidden) {
        return Err(AppError::validation(
            "Cypher query contains a write or procedure keyword that is not allowed",
        ));
    }

    Ok(())
}

fn contains_forbidden_token(query: &str, forbidden: &[&str]) -> bool {
    query
        .split(|c: char| !(c.is_ascii_alphanumeric() || c == '_'))
        .map(|token| token.to_ascii_lowercase())
        .any(|token| forbidden.iter().any(|item| token == *item))
}

fn collect_columns(rows: &[Value]) -> Vec<String> {
    let mut columns = Vec::new();
    for row in rows {
        if let Some(object) = row.as_object() {
            for key in object.keys() {
                if !columns.contains(key) {
                    columns.push(key.clone());
                }
            }
        }
    }

    if columns.is_empty() && !rows.is_empty() {
        columns.push("value".to_string());
    }
    columns
}

fn cypher_projection_sql(
    query: &str,
    limit: i64,
) -> Result<(String, Vec<String>, Vec<String>), AppError> {
    let normalized = query.to_ascii_lowercase();
    let warning = "Cypher runs against the AssetsLake graph projection: Asset, Issue, AssetVersion, IssueComment, RagMemory, AiInsight, HAS_EVIDENCE, HAS_VERSION, HAS_COMMENT, HAS_INSIGHT.".to_string();

    if normalized.contains("has_insight")
        || (normalized.contains(":asset")
            && normalized.contains(":aiinsight")
            && normalized.contains("-["))
    {
        return Ok((
            asset_insight_edges_sql(limit),
            vec!["a".to_string(), "r".to_string(), "x".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains("has_evidence")
        || (normalized.contains(":issue")
            && normalized.contains(":asset")
            && normalized.contains("-["))
    {
        return Ok((
            issue_asset_edges_sql(limit),
            vec!["i".to_string(), "r".to_string(), "a".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains("has_version")
        || normalized.contains(":assetversion")
        || normalized.contains(":asset_version")
    {
        return Ok((
            asset_version_edges_sql(limit),
            vec!["a".to_string(), "r".to_string(), "v".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains("has_comment") || normalized.contains(":issuecomment") {
        return Ok((
            issue_comment_edges_sql(limit),
            vec!["i".to_string(), "r".to_string(), "c".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains(":ragmemory") || normalized.contains(":rag_memory") {
        return Ok((
            rag_memory_nodes_sql(limit),
            vec!["m".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains(":aiinsight") || normalized.contains(":ai_insight") {
        return Ok((
            asset_insight_nodes_sql(limit),
            vec!["x".to_string()],
            vec![warning],
        ));
    }

    if normalized.contains(":issue") {
        return Ok((issue_nodes_sql(limit), vec!["i".to_string()], vec![warning]));
    }

    if normalized.contains(":asset") {
        return Ok((asset_nodes_sql(limit), vec!["a".to_string()], vec![warning]));
    }

    if normalized.contains("match (n)") {
        return Ok((all_nodes_sql(limit), vec!["n".to_string()], vec![warning]));
    }

    Err(AppError::validation(
        "Unsupported Cypher projection. Try MATCH (a:Asset), MATCH (i:Issue), MATCH (m:RagMemory), MATCH (x:AiInsight), MATCH (i:Issue)-[r:HAS_EVIDENCE]->(a:Asset), MATCH (a:Asset)-[r:HAS_VERSION]->(v:AssetVersion), MATCH (a:Asset)-[r:HAS_INSIGHT]->(x:AiInsight), or MATCH (i:Issue)-[r:HAS_COMMENT]->(c:IssueComment).",
    ))
}

fn asset_nodes_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'a', jsonb_build_object(
                'id', a.id,
                'label', 'Asset',
                'properties', jsonb_build_object(
                    'name', a.name,
                    'filename', a.original_filename,
                    'asset_type', a.asset_type,
                    'status', a.status,
                    'version', a.version,
                    'tags', a.tags,
                    'embedding_id', a.embedding_id,
                    'updated_at', a.updated_at
                )
            )
        ) AS row
        FROM assets a
        WHERE a.deleted_at IS NULL
        ORDER BY a.updated_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn issue_nodes_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'i', jsonb_build_object(
                'id', i.id,
                'label', 'Issue',
                'properties', jsonb_build_object(
                    'issue_key', i.issue_key,
                    'title', i.title,
                    'status', i.status,
                    'priority', i.priority,
                    'qa_status', i.qa_status,
                    'due_date', i.due_date,
                    'updated_at', i.updated_at
                )
            )
        ) AS row
        FROM issues i
        WHERE i.deleted_at IS NULL
        ORDER BY i.updated_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn rag_memory_nodes_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'm', jsonb_build_object(
                'id', m.id,
                'label', 'RagMemory',
                'properties', jsonb_build_object(
                    'operation_type', m.operation_type,
                    'app', m.app,
                    'entity_type', m.entity_type,
                    'entity_id', m.entity_id,
                    'actor', m.actor,
                    'summary', m.summary,
                    'embedding_provider', m.embedding_provider,
                    'qdrant_collection', m.qdrant_collection,
                    'created_at', m.created_at,
                    'indexed_at', m.indexed_at
                )
            )
        ) AS row
        FROM rag_operation_memories m
        ORDER BY m.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn asset_insight_nodes_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'x', jsonb_build_object(
                'id', x.id,
                'label', 'AiInsight',
                'properties', jsonb_build_object(
                    'asset_id', x.asset_id,
                    'modality', x.modality,
                    'provider', x.provider,
                    'model', x.model,
                    'status', x.status,
                    'summary', x.summary,
                    'labels', x.labels,
                    'quality_risks', x.quality_risks,
                    'created_at', x.created_at
                )
            )
        ) AS row
        FROM asset_ai_insights x
        ORDER BY x.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn issue_asset_edges_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'i', jsonb_build_object(
                'id', i.id,
                'label', 'Issue',
                'properties', jsonb_build_object('issue_key', i.issue_key, 'title', i.title, 'status', i.status)
            ),
            'r', jsonb_build_object(
                'type', 'HAS_EVIDENCE',
                'properties', jsonb_build_object('link_type', ia.link_type, 'created_at', ia.created_at)
            ),
            'a', jsonb_build_object(
                'id', a.id,
                'label', 'Asset',
                'properties', jsonb_build_object('name', a.name, 'filename', a.original_filename, 'asset_type', a.asset_type, 'version', a.version)
            )
        ) AS row
        FROM issue_assets ia
        JOIN issues i ON i.id = ia.issue_id AND i.deleted_at IS NULL
        JOIN assets a ON a.id = ia.asset_id AND a.deleted_at IS NULL
        ORDER BY ia.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn asset_insight_edges_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'a', jsonb_build_object(
                'id', a.id,
                'label', 'Asset',
                'properties', jsonb_build_object('name', a.name, 'filename', a.original_filename, 'asset_type', a.asset_type, 'version', a.version)
            ),
            'r', jsonb_build_object(
                'type', 'HAS_INSIGHT',
                'properties', jsonb_build_object('provider', x.provider, 'status', x.status, 'created_at', x.created_at)
            ),
            'x', jsonb_build_object(
                'id', x.id,
                'label', 'AiInsight',
                'properties', jsonb_build_object('modality', x.modality, 'summary', x.summary, 'labels', x.labels, 'quality_risks', x.quality_risks)
            )
        ) AS row
        FROM asset_ai_insights x
        JOIN assets a ON a.id = x.asset_id AND a.deleted_at IS NULL
        ORDER BY x.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn asset_version_edges_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'a', jsonb_build_object(
                'id', a.id,
                'label', 'Asset',
                'properties', jsonb_build_object('name', a.name, 'filename', a.original_filename, 'current_version', a.version)
            ),
            'r', jsonb_build_object(
                'type', 'HAS_VERSION',
                'properties', jsonb_build_object('version', av.version)
            ),
            'v', jsonb_build_object(
                'id', av.id,
                'label', 'AssetVersion',
                'properties', jsonb_build_object(
                    'version', av.version,
                    'branch_name', CASE WHEN av.version = a.version THEN 'main' ELSE 'history' END,
                    'commit_sha', LEFT(COALESCE(av.checksum_sha256, REPLACE(av.id::text, '-', '')), 12),
                    'change_note', av.change_note,
                    'created_at', av.created_at
                )
            )
        ) AS row
        FROM asset_versions av
        JOIN assets a ON a.id = av.asset_id AND a.deleted_at IS NULL
        ORDER BY av.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn issue_comment_edges_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT jsonb_build_object(
            'i', jsonb_build_object(
                'id', i.id,
                'label', 'Issue',
                'properties', jsonb_build_object('issue_key', i.issue_key, 'title', i.title, 'status', i.status)
            ),
            'r', jsonb_build_object(
                'type', 'HAS_COMMENT',
                'properties', jsonb_build_object('created_at', c.created_at, 'visibility', c.visibility)
            ),
            'c', jsonb_build_object(
                'id', c.id,
                'label', 'IssueComment',
                'properties', jsonb_build_object('author_name', c.author_name, 'body', c.body, 'visibility', c.visibility, 'created_at', c.created_at)
            )
        ) AS row
        FROM issue_comments c
        JOIN issues i ON i.id = c.issue_id AND i.deleted_at IS NULL
        ORDER BY c.created_at DESC
        LIMIT {}
        "#,
        limit
    )
}

fn all_nodes_sql(limit: i64) -> String {
    format!(
        r#"
        SELECT row FROM (
            SELECT jsonb_build_object(
                'n', jsonb_build_object(
                    'id', a.id,
                    'label', 'Asset',
                    'properties', jsonb_build_object('name', a.name, 'asset_type', a.asset_type, 'version', a.version, 'updated_at', a.updated_at)
                )
            ) AS row, a.updated_at AS sort_at
            FROM assets a
            WHERE a.deleted_at IS NULL
            UNION ALL
            SELECT jsonb_build_object(
                'n', jsonb_build_object(
                    'id', i.id,
                    'label', 'Issue',
                    'properties', jsonb_build_object('issue_key', i.issue_key, 'title', i.title, 'status', i.status, 'updated_at', i.updated_at)
                )
            ) AS row, i.updated_at AS sort_at
            FROM issues i
            WHERE i.deleted_at IS NULL
        ) lake_nodes
        ORDER BY sort_at DESC
        LIMIT {}
        "#,
        limit
    )
}
