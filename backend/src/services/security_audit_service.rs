/*
```cypher
CREATE
  (f:File {name: "security_audit_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::security_audit_service", type: "module"}),
  (c1:Class {name: "SecurityAuditService", type: "class", language: "rust", signature: "struct SecurityAuditService"}),
  (c2:Class {name: "SecurityAuditInput", type: "class", language: "rust", signature: "struct SecurityAuditInput"}),
  (c3:Class {name: "SecurityAuditQuery", type: "class", language: "rust", signature: "struct SecurityAuditQuery"}),
  (c4:Class {name: "SecurityAuditEvent", type: "class", language: "rust", signature: "struct SecurityAuditEvent"}),
  (fn1:Function {name: "SecurityAuditService::new", type: "function", language: "rust", signature: "pub fn new(pool: PgPool, event_publisher: EventPublisherService) -> Self"}),
  (fn2:Function {name: "SecurityAuditService::record", type: "function", language: "rust", signature: "pub async fn record(&self, input: SecurityAuditInput)"}),
  (fn3:Function {name: "SecurityAuditService::record_http_request", type: "function", language: "rust", signature: "pub async fn record_http_request(&self, req: &HttpRequest, input: SecurityAuditInput)"}),
  (fn4:Function {name: "SecurityAuditService::record_service_request", type: "function", language: "rust", signature: "pub async fn record_service_request(&self, req: &ServiceRequest, session: Option<&SessionContext>, input: SecurityAuditInput)"}),
  (fn5:Function {name: "SecurityAuditService::insert_audit_log", type: "function", language: "rust", signature: "async fn insert_audit_log(&self, input: &SecurityAuditInput) -> Result<(), AppError>"}),
  (fn21:Function {name: "SecurityAuditService::list_events", type: "function", language: "rust", signature: "pub async fn list_events(&self, query: SecurityAuditQuery) -> Result<Vec<SecurityAuditEvent>, AppError>"}),
  (fn6:Function {name: "SecurityAuditInput::new", type: "function", language: "rust", signature: "pub fn new(action: impl Into<String>, outcome: impl Into<String>, entity_type: impl Into<String>, entity_id: Option<Uuid>) -> Self"}),
  (fn7:Function {name: "SecurityAuditInput::reason", type: "function", language: "rust", signature: "pub fn reason(mut self, reason: impl Into<String>) -> Self"}),
  (fn8:Function {name: "SecurityAuditInput::severity", type: "function", language: "rust", signature: "pub fn severity(mut self, severity: impl Into<String>) -> Self"}),
  (fn9:Function {name: "SecurityAuditInput::metadata", type: "function", language: "rust", signature: "pub fn metadata(mut self, metadata: Value) -> Self"}),
  (fn10:Function {name: "SecurityAuditInput::actor", type: "function", language: "rust", signature: "pub fn actor(mut self, actor: impl Into<String>) -> Self"}),
  (fn20:Function {name: "SecurityAuditInput::session", type: "function", language: "rust", signature: "pub fn session(self, session: &SessionContext) -> Self"}),
  (fn11:Function {name: "SecurityAuditInput::with_http_request", type: "function", language: "rust", signature: "fn with_http_request(mut self, req: &HttpRequest) -> Self"}),
  (fn12:Function {name: "SecurityAuditInput::with_service_request", type: "function", language: "rust", signature: "fn with_service_request(mut self, req: &ServiceRequest) -> Self"}),
  (fn13:Function {name: "SecurityAuditInput::with_session", type: "function", language: "rust", signature: "fn with_session(mut self, session: &SessionContext) -> Self"}),
  (fn14:Function {name: "SecurityAuditInput::to_audit_diff", type: "function", language: "rust", signature: "fn to_audit_diff(&self) -> Value"}),
  (fn15:Function {name: "SecurityAuditInput::to_domain_event", type: "function", language: "rust", signature: "fn to_domain_event(&self) -> DomainEventInput"}),
  (fn16:Function {name: "client_ip_from_http_request", type: "function", language: "rust", signature: "fn client_ip_from_http_request(req: &HttpRequest) -> Option<String>"}),
  (fn17:Function {name: "client_ip_from_service_request", type: "function", language: "rust", signature: "fn client_ip_from_service_request(req: &ServiceRequest) -> Option<String>"}),
  (fn18:Function {name: "user_agent_from_headers", type: "function", language: "rust", signature: "fn user_agent_from_headers(headers: &HeaderMap) -> Option<String>"}),
  (fn22:Function {name: "normalize_optional_filter", type: "function", language: "rust", signature: "fn normalize_optional_filter(value: Option<String>) -> Option<String>"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "event_publisher", type: "variable"}),
  (v3:Variable {name: "input", type: "variable"}),
  (v4:Variable {name: "query", type: "variable"}),
  (v5:Variable {name: "limit", type: "variable"}),
  (v6:Variable {name: "action", type: "variable"}),
  (v7:Variable {name: "outcome", type: "variable"}),
  (v8:Variable {name: "entity_type", type: "variable"}),
  (fn19:Function {name: "security_audit_aggregate_id", type: "function", language: "rust", signature: "fn security_audit_aggregate_id() -> Uuid"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn21),
  (c2)-[:HAS_METHOD]->(fn6),
  (c2)-[:HAS_METHOD]->(fn7),
  (c2)-[:HAS_METHOD]->(fn8),
  (c2)-[:HAS_METHOD]->(fn9),
  (c2)-[:HAS_METHOD]->(fn10),
  (c2)-[:HAS_METHOD]->(fn20),
  (c2)-[:HAS_METHOD]->(fn11),
  (c2)-[:HAS_METHOD]->(fn12),
  (c2)-[:HAS_METHOD]->(fn13),
  (c2)-[:HAS_METHOD]->(fn14),
  (c2)-[:HAS_METHOD]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn22),
  (m)-[:CONTAINS]->(fn19),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:CALLS]->(fn15),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn11),
  (fn3)-[:CALLS]->(fn13),
  (fn3)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn12),
  (fn4)-[:CALLS]->(fn13),
  (fn4)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn14),
  (fn20)-[:CALLS]->(fn13),
  (fn5)-[:USES]->(v1),
  (fn21)-[:CALLS]->(fn22),
  (fn21)-[:USES]->(v1),
  (fn21)-[:USES]->(v4),
  (fn21)-[:USES]->(v5),
  (fn21)-[:USES]->(v6),
  (fn21)-[:USES]->(v7),
  (fn21)-[:USES]->(v8),
  (fn11)-[:CALLS]->(fn16),
  (fn11)-[:CALLS]->(fn18),
  (fn12)-[:CALLS]->(fn17),
  (fn12)-[:CALLS]->(fn18),
  (fn15)-[:CALLS]->(fn19);
```
*/

use actix_web::{dev::ServiceRequest, http::header::HeaderMap, HttpMessage, HttpRequest};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::auth::SessionContext,
    services::event_publisher_service::{DomainEventInput, EventPublisherService},
};

#[derive(Clone)]
pub struct SecurityAuditService {
    pool: PgPool,
    event_publisher: EventPublisherService,
}

#[derive(Debug, Clone)]
pub struct SecurityAuditInput {
    action: String,
    outcome: String,
    severity: String,
    entity_type: String,
    entity_id: Option<Uuid>,
    actor_id: Option<Uuid>,
    actor: Option<String>,
    actor_role: Option<String>,
    method: Option<String>,
    path: Option<String>,
    client_ip: Option<String>,
    user_agent: Option<String>,
    reason: Option<String>,
    metadata: Value,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SecurityAuditQuery {
    pub limit: Option<i64>,
    pub action: Option<String>,
    pub outcome: Option<String>,
    pub entity_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct SecurityAuditEvent {
    pub id: i64,
    pub entity_type: String,
    pub entity_id: Uuid,
    pub action: String,
    pub actor_id: Option<Uuid>,
    pub actor: Option<String>,
    pub diff: Value,
    pub created_at: DateTime<Utc>,
}

impl SecurityAuditService {
    pub fn new(pool: PgPool, event_publisher: EventPublisherService) -> Self {
        Self {
            pool,
            event_publisher,
        }
    }

    pub async fn record(&self, input: SecurityAuditInput) {
        if let Err(error) = self.insert_audit_log(&input).await {
            tracing::warn!(
                action = %input.action,
                entity_type = %input.entity_type,
                error = %error,
                "Security audit log insert failed"
            );
        }

        if let Err(error) = self.event_publisher.stage(input.to_domain_event()).await {
            tracing::warn!(
                action = %input.action,
                entity_type = %input.entity_type,
                error = %error,
                "Security audit domain event was not staged"
            );
        }
    }

    pub async fn record_http_request(&self, req: &HttpRequest, input: SecurityAuditInput) {
        let mut input = input;
        if let Some(session) = req.extensions().get::<SessionContext>() {
            input = input.with_session(session);
        }
        let input = input.with_http_request(req);
        self.record(input).await;
    }

    pub async fn record_service_request(
        &self,
        req: &ServiceRequest,
        session: Option<&SessionContext>,
        input: SecurityAuditInput,
    ) {
        let mut input = input;
        if let Some(session) = session {
            input = input.with_session(session);
        }
        let input = input.with_service_request(req);
        self.record(input).await;
    }

    async fn insert_audit_log(&self, input: &SecurityAuditInput) -> Result<(), AppError> {
        sqlx::query(
            r#"
            INSERT INTO audit_log (entity_type, entity_id, action, actor_id, actor, diff)
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(&input.entity_type)
        .bind(input.entity_id.unwrap_or_else(security_audit_aggregate_id))
        .bind(&input.action)
        .bind(input.actor_id)
        .bind(&input.actor)
        .bind(input.to_audit_diff())
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_events(
        &self,
        query: SecurityAuditQuery,
    ) -> Result<Vec<SecurityAuditEvent>, AppError> {
        let limit = query.limit.unwrap_or(50).clamp(1, 200);
        let action = normalize_optional_filter(query.action);
        let outcome = normalize_optional_filter(query.outcome);
        let entity_type = normalize_optional_filter(query.entity_type);

        let events = sqlx::query_as::<_, SecurityAuditEvent>(
            r#"
            SELECT id, entity_type, entity_id, action, actor_id, actor, COALESCE(diff, '{}'::jsonb) AS diff, created_at
            FROM audit_log
            WHERE ($1::text IS NULL OR action = $1)
              AND ($2::text IS NULL OR diff->>'outcome' = $2)
              AND ($3::text IS NULL OR entity_type = $3)
            ORDER BY created_at DESC
            LIMIT $4
            "#,
        )
        .bind(action.as_deref())
        .bind(outcome.as_deref())
        .bind(entity_type.as_deref())
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        Ok(events)
    }
}

impl SecurityAuditInput {
    pub fn new(
        action: impl Into<String>,
        outcome: impl Into<String>,
        entity_type: impl Into<String>,
        entity_id: Option<Uuid>,
    ) -> Self {
        Self {
            action: action.into(),
            outcome: outcome.into(),
            severity: "info".to_string(),
            entity_type: entity_type.into(),
            entity_id,
            actor_id: None,
            actor: None,
            actor_role: None,
            method: None,
            path: None,
            client_ip: None,
            user_agent: None,
            reason: None,
            metadata: json!({}),
        }
    }

    pub fn reason(mut self, reason: impl Into<String>) -> Self {
        self.reason = Some(reason.into());
        self
    }

    pub fn severity(mut self, severity: impl Into<String>) -> Self {
        self.severity = severity.into();
        self
    }

    pub fn metadata(mut self, metadata: Value) -> Self {
        self.metadata = metadata;
        self
    }

    pub fn actor(mut self, actor: impl Into<String>) -> Self {
        self.actor = Some(actor.into());
        self
    }

    pub fn session(self, session: &SessionContext) -> Self {
        self.with_session(session)
    }

    fn with_http_request(mut self, req: &HttpRequest) -> Self {
        self.method = Some(req.method().as_str().to_string());
        self.path = Some(req.path().to_string());
        self.client_ip = client_ip_from_http_request(req);
        self.user_agent = user_agent_from_headers(req.headers());
        self
    }

    fn with_service_request(mut self, req: &ServiceRequest) -> Self {
        self.method = Some(req.method().as_str().to_string());
        self.path = Some(req.path().to_string());
        self.client_ip = client_ip_from_service_request(req);
        self.user_agent = user_agent_from_headers(req.headers());
        self
    }

    fn with_session(mut self, session: &SessionContext) -> Self {
        self.actor_id = Some(session.user.id);
        self.actor = Some(
            session
                .user
                .display_name
                .clone()
                .unwrap_or_else(|| session.user.username.clone()),
        );
        self.actor_role = Some(session.user.role.clone());
        self
    }

    fn to_audit_diff(&self) -> Value {
        json!({
            "outcome": &self.outcome,
            "severity": &self.severity,
            "actor_role": &self.actor_role,
            "method": &self.method,
            "path": &self.path,
            "client_ip": &self.client_ip,
            "user_agent": &self.user_agent,
            "reason": &self.reason,
            "metadata": &self.metadata,
        })
    }

    fn to_domain_event(&self) -> DomainEventInput {
        let aggregate_id = self.entity_id.unwrap_or_else(security_audit_aggregate_id);
        DomainEventInput::new(
            "audit.domain-event.v1",
            "SecurityAuditRecorded",
            self.entity_type.clone(),
            aggregate_id,
            json!({
                "action": &self.action,
                "outcome": &self.outcome,
                "severity": &self.severity,
                "entity_type": &self.entity_type,
                "entity_id": &self.entity_id,
                "actor_id": &self.actor_id,
                "actor": &self.actor,
                "actor_role": &self.actor_role,
                "method": &self.method,
                "path": &self.path,
                "client_ip": &self.client_ip,
                "user_agent": &self.user_agent,
                "reason": &self.reason,
                "metadata": &self.metadata,
            }),
        )
        .idempotency_key(format!(
            "security-audit:{}:{}:{}",
            self.action,
            aggregate_id,
            Uuid::new_v4()
        ))
    }
}

fn security_audit_aggregate_id() -> Uuid {
    Uuid::nil()
}

fn client_ip_from_http_request(req: &HttpRequest) -> Option<String> {
    req.connection_info()
        .realip_remote_addr()
        .map(|value| value.to_string())
}

fn client_ip_from_service_request(req: &ServiceRequest) -> Option<String> {
    req.connection_info()
        .realip_remote_addr()
        .map(|value| value.to_string())
}

fn user_agent_from_headers(headers: &HeaderMap) -> Option<String> {
    headers
        .get("user-agent")
        .and_then(|value| value.to_str().ok())
        .filter(|value| !value.trim().is_empty())
        .map(|value| value.to_string())
}

fn normalize_optional_filter(value: Option<String>) -> Option<String> {
    value
        .map(|item| item.trim().to_string())
        .filter(|item| !item.is_empty())
}
