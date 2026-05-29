/*
```cypher
CREATE
  (f:File {name: "security_audit_handler.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::handlers::security_audit_handler", type: "module"}),
  (fn1:Function {name: "list_security_audit_events", type: "function", language: "rust", signature: "pub async fn list_security_audit_events(state: web::Data<AppState>, query: web::Query<SecurityAuditQuery>) -> Result<HttpResponse, AppError>"}),
  (v1:Variable {name: "state", type: "variable"}),
  (v2:Variable {name: "query", type: "variable"}),
  (v3:Variable {name: "events", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3);
```
*/

use actix_web::{get, web, HttpResponse};

use crate::{
    errors::{ApiResponse, AppError},
    services::security_audit_service::SecurityAuditQuery,
    AppState,
};

#[get("/api/security/audit-events")]
pub async fn list_security_audit_events(
    state: web::Data<AppState>,
    query: web::Query<SecurityAuditQuery>,
) -> Result<HttpResponse, AppError> {
    let events = state
        .security_audit_service
        .list_events(query.into_inner())
        .await?;
    Ok(HttpResponse::Ok().json(ApiResponse::ok(events)))
}
