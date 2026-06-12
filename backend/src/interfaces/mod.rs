/*
```cypher
CREATE
  (f:File {name: "mod.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces", type: "module"}),
  (c1:Class {name: "AppActor", type: "class", language: "rust", signature: "struct AppActor"}),
  (fn1:Function {name: "AppActor::from_session", type: "function", language: "rust", signature: "fn from_session(session: &SessionContext) -> Self"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1);
```
*/

use uuid::Uuid;

use crate::models::auth::SessionContext;

pub mod asset_if;
pub mod design_ai_if;
pub mod design_requirement_if;
pub mod employee_intelligence_if;
pub mod wiki_if;
pub mod work_evidence_if;

#[derive(Debug, Clone)]
pub struct AppActor {
    pub user_id: Uuid,
    pub display_name: String,
    pub role: String,
}

impl AppActor {
    pub fn from_session(session: &SessionContext) -> Self {
        Self {
            user_id: session.user.id,
            display_name: session.lock_owner_label(),
            role: session.user.role.clone(),
        }
    }
}
