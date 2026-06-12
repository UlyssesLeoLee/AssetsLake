/*
```cypher
CREATE
  (f:File {name: "employee_intelligence_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::employee_intelligence_if", type: "module"}),
  (c1:Class {name: "EmployeeIntelligenceIf", type: "class", language: "rust"}),
  (fn1:Function {name: "EmployeeIntelligenceIf::get_profile", type: "function", language: "rust"}),
  (fn2:Function {name: "EmployeeIntelligenceIf::update_self_profile", type: "function", language: "rust"}),
  (fn3:Function {name: "EmployeeIntelligenceIf::verify_capability", type: "function", language: "rust"}),
  (fn4:Function {name: "EmployeeIntelligenceIf::search_people", type: "function", language: "rust"}),
  (fn5:Function {name: "EmployeeIntelligenceIf::get_evaluation", type: "function", language: "rust"}),
  (fn6:Function {name: "EmployeeIntelligenceIf::submit_correction", type: "function", language: "rust"}),
  (fn7:Function {name: "EmployeeIntelligenceIf::rerank_content", type: "function", language: "rust"}),
  (fn8:Function {name: "EmployeeIntelligenceIf::refresh_employee_projection", type: "function", language: "rust"}),
  (fn9:Function {name: "EmployeeIntelligenceIf::list_capabilities", type: "function", language: "rust"}),
  (fn10:Function {name: "EmployeeIntelligenceIf::approve_capability", type: "function", language: "rust"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (c1)-[:HAS_METHOD]->(fn10);
```
*/

use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::AppActor,
    models::people_intelligence::{
        CapabilityTaxonomyItem, ContentRerankRequest, ContentSearchResult, EmployeeCapability,
        EmployeeCorrection, EmployeeEvaluation, EmployeeProfile, EmployeeProjectionResult,
        PeopleSearchMatch, PeopleSearchQuery, SubmitCorrectionRequest,
        UpdateEmployeeProfileRequest, VerifyCapabilityRequest,
    },
    services::ai_provider_service::AiProviderConfig,
};

pub trait EmployeeIntelligenceIf {
    async fn list_capabilities(
        &self,
        actor: &AppActor,
        workspace_id: Uuid,
        include_candidates: bool,
    ) -> Result<Vec<CapabilityTaxonomyItem>, AppError>;

    async fn approve_capability(
        &self,
        actor: &AppActor,
        capability_id: Uuid,
    ) -> Result<CapabilityTaxonomyItem, AppError>;

    async fn get_profile(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
    ) -> Result<EmployeeProfile, AppError>;

    async fn update_self_profile(
        &self,
        actor: &AppActor,
        request: UpdateEmployeeProfileRequest,
    ) -> Result<EmployeeProfile, AppError>;

    async fn verify_capability(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        capability_id: Uuid,
        request: VerifyCapabilityRequest,
    ) -> Result<EmployeeCapability, AppError>;

    async fn search_people(
        &self,
        actor: &AppActor,
        ai_config: Option<&AiProviderConfig>,
        query: PeopleSearchQuery,
    ) -> Result<Vec<PeopleSearchMatch>, AppError>;

    async fn get_evaluation(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        window_days: i32,
    ) -> Result<EmployeeEvaluation, AppError>;

    async fn submit_correction(
        &self,
        actor: &AppActor,
        employee_id: Uuid,
        request: SubmitCorrectionRequest,
    ) -> Result<EmployeeCorrection, AppError>;

    async fn rerank_content(
        &self,
        actor: &AppActor,
        request: ContentRerankRequest,
    ) -> Result<Vec<ContentSearchResult>, AppError>;

    async fn refresh_employee_projection(
        &self,
        actor: &AppActor,
        ai_config: Option<&AiProviderConfig>,
        employee_id: Uuid,
    ) -> Result<EmployeeProjectionResult, AppError>;
}
