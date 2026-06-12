/*
```cypher
CREATE
  (f:File {name: "work_evidence_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::work_evidence_if", type: "module"}),
  (c1:Class {name: "WorkEvidenceIf", type: "class", language: "rust"}),
  (fn1:Function {name: "WorkEvidenceIf::summarize_employee_work", type: "function", language: "rust"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1);
```
*/

use uuid::Uuid;

use crate::{errors::AppError, models::people_intelligence::WorkEvidenceSummary};

pub trait WorkEvidenceIf {
    async fn summarize_employee_work(
        &self,
        employee_id: Uuid,
        window_days: i32,
    ) -> Result<WorkEvidenceSummary, AppError>;
}
