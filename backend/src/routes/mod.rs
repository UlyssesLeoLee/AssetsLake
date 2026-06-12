/*
```cypher
CREATE
  (f:File {name: "mod.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::routes", type: "module"}),
  (c1:Class {name: "ServiceRouteSet", type: "class", language: "rust", signature: "enum ServiceRouteSet"}),
  (fn1:Function {name: "configure", type: "function", language: "rust", signature: "pub fn configure(cfg: &mut web::ServiceConfig)"}),
  (fn2:Function {name: "configure_health", type: "function", language: "rust", signature: "fn configure_health(cfg: &mut web::ServiceConfig)"}),
  (fn3:Function {name: "configure_assets", type: "function", language: "rust", signature: "fn configure_assets(cfg: &mut web::ServiceConfig)"}),
  (fn4:Function {name: "configure_production", type: "function", language: "rust", signature: "fn configure_production(cfg: &mut web::ServiceConfig)"}),
  (fn5:Function {name: "configure_projects", type: "function", language: "rust", signature: "fn configure_projects(cfg: &mut web::ServiceConfig)"}),
  (fn8:Function {name: "configure_auth", type: "function", language: "rust", signature: "fn configure_auth(cfg: &mut web::ServiceConfig)"}),
  (fn9:Function {name: "configure_locks", type: "function", language: "rust", signature: "fn configure_locks(cfg: &mut web::ServiceConfig)"}),
  (fn10:Function {name: "configure_verification", type: "function", language: "rust", signature: "fn configure_verification(cfg: &mut web::ServiceConfig)"}),
  (fn11:Function {name: "configure_security", type: "function", language: "rust", signature: "fn configure_security(cfg: &mut web::ServiceConfig)"}),
  (fn12:Function {name: "configure_admin", type: "function", language: "rust", signature: "fn configure_admin(cfg: &mut web::ServiceConfig)"}),
  (fn13:Function {name: "configure_wiki", type: "function", language: "rust", signature: "fn configure_wiki(cfg: &mut web::ServiceConfig)"}),
  (fn14:Function {name: "configure_design_requirements", type: "function", language: "rust", signature: "fn configure_design_requirements(cfg: &mut web::ServiceConfig)"}),
  (fn15:Function {name: "configure_people_intelligence", type: "function", language: "rust", signature: "fn configure_people_intelligence(cfg: &mut web::ServiceConfig)"}),
  (fn6:Function {name: "ServiceRouteSet::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn7:Function {name: "ServiceRouteSet::from_value", type: "function", language: "rust", signature: "fn from_value(value: &str) -> Self"}),
  (v1:Variable {name: "cfg", type: "variable"}),
  (v2:Variable {name: "route_set", type: "variable"}),
  (v3:Variable {name: "ASSETSLAKE_SERVICE", type: "variable"}),
  (v4:Variable {name: "management_handler", type: "variable"}),
  (v5:Variable {name: "auth_handler", type: "variable"}),
  (v6:Variable {name: "lock_handler", type: "variable"}),
  (v7:Variable {name: "verification_handler", type: "variable"}),
  (v8:Variable {name: "security_audit_handler", type: "variable"}),
  (v9:Variable {name: "admin_control_handler", type: "variable"}),
  (v10:Variable {name: "wiki_handler", type: "variable"}),
  (v11:Variable {name: "design_requirement_handler", type: "variable"}),
  (v12:Variable {name: "people_intelligence_handler", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:CALLS]->(fn9),
  (fn1)-[:CALLS]->(fn10),
  (fn1)-[:CALLS]->(fn11),
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn13),
  (fn1)-[:CALLS]->(fn14),
  (fn1)-[:CALLS]->(fn15),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v4),
  (fn8)-[:USES]->(v5),
  (fn9)-[:USES]->(v6),
  (fn10)-[:USES]->(v7),
  (fn11)-[:USES]->(v8),
  (fn12)-[:USES]->(v9),
  (fn13)-[:USES]->(v10),
  (fn14)-[:USES]->(v11),
  (fn15)-[:USES]->(v12),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:USES]->(v3);
```
*/

use std::env;

use actix_web::web;

use crate::handlers::{
    admin_control_handler, asset_analysis_handler, asset_handler, auth_handler,
    data_lake_query_handler, design_requirement_handler, emergence_handler, health_handler,
    lock_handler, management_handler, people_intelligence_handler, production_handler,
    project_handler, project_management_handler, security_audit_handler, verification_handler,
    wiki_handler,
};

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum ServiceRouteSet {
    Gateway,
    Assets,
    Production,
    Projects,
    Identity,
    Planning,
    Workflow,
    Reporting,
    Wiki,
    DesignRequirements,
    PeopleIntelligence,
}

impl ServiceRouteSet {
    fn from_env() -> Self {
        let value = env::var("ASSETSLAKE_SERVICE")
            .or_else(|_| env::var("BACKEND_SERVICE"))
            .unwrap_or_else(|_| "gateway".to_string());
        Self::from_value(&value)
    }

    fn from_value(value: &str) -> Self {
        let normalized = value.trim().to_ascii_lowercase().replace('_', "-");
        match normalized.as_str() {
            "gateway" | "all" | "api-gateway" => Self::Gateway,
            "assets" | "asset" | "asset-api" | "assets-api" => Self::Assets,
            "production" | "production-flow" | "production-api" => Self::Production,
            "projects" | "project" | "projects-api" => Self::Projects,
            "verification" | "identity" | "verification-api" | "identity-api" => Self::Identity,
            "planning" | "planning-api" | "schedule" => Self::Planning,
            "workflow" | "workflow-api" | "automation" => Self::Workflow,
            "reporting" | "reports" | "reporting-api" | "data-lake" => Self::Reporting,
            "wiki" | "wiki-api" => Self::Wiki,
            "design" | "design-requirements" | "design-requirements-api" => {
                Self::DesignRequirements
            }
            "people" | "people-intelligence" | "people-intelligence-api" => {
                Self::PeopleIntelligence
            }
            other => {
                tracing::warn!(
                    service = other,
                    "Unknown ASSETSLAKE_SERVICE value, falling back to gateway route set"
                );
                Self::Gateway
            }
        }
    }
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    let route_set = ServiceRouteSet::from_env();
    configure_health(cfg);

    match route_set {
        ServiceRouteSet::Gateway => {
            configure_identity(cfg);
            configure_assets(cfg);
            configure_production(cfg);
            configure_planning(cfg);
            configure_workflow(cfg);
            configure_reporting(cfg);
            configure_projects(cfg);
            configure_wiki(cfg);
            configure_design_requirements(cfg);
            configure_people_intelligence(cfg);
        }
        ServiceRouteSet::Assets => {
            configure_assets(cfg);
        }
        ServiceRouteSet::Production => {
            configure_production(cfg);
        }
        ServiceRouteSet::Projects => configure_projects(cfg),
        ServiceRouteSet::Identity => configure_identity(cfg),
        ServiceRouteSet::Planning => configure_planning(cfg),
        ServiceRouteSet::Workflow => configure_workflow(cfg),
        ServiceRouteSet::Reporting => configure_reporting(cfg),
        ServiceRouteSet::Wiki => configure_wiki(cfg),
        ServiceRouteSet::DesignRequirements => configure_design_requirements(cfg),
        ServiceRouteSet::PeopleIntelligence => configure_people_intelligence(cfg),
    }
}

fn configure_health(cfg: &mut web::ServiceConfig) {
    cfg.service(health_handler::health);
}

fn configure_auth(cfg: &mut web::ServiceConfig) {
    cfg.service(auth_handler::login)
        .service(auth_handler::logout)
        .service(auth_handler::me)
        .service(auth_handler::test_accounts);
}

fn configure_locks(cfg: &mut web::ServiceConfig) {
    cfg.service(lock_handler::acquire_lock)
        .service(lock_handler::renew_lock)
        .service(lock_handler::release_lock)
        .service(lock_handler::current_lock);
}

fn configure_verification(cfg: &mut web::ServiceConfig) {
    cfg.service(verification_handler::app_info)
        .service(verification_handler::start_challenge)
        .service(verification_handler::verify_code)
        .service(verification_handler::register)
        .service(verification_handler::change_password)
        .service(verification_handler::outbox);
}

fn configure_identity(cfg: &mut web::ServiceConfig) {
    configure_auth(cfg);
    configure_locks(cfg);
    configure_verification(cfg);
}

fn configure_assets(cfg: &mut web::ServiceConfig) {
    cfg.service(asset_handler::upload_asset)
        .service(asset_handler::list_assets)
        .service(asset_handler::search_assets)
        .service(asset_handler::get_asset_content)
        .service(asset_handler::list_asset_versions)
        .service(asset_handler::get_asset_version_content)
        .service(asset_handler::compare_asset_versions)
        .service(asset_analysis_handler::analyze_asset)
        .service(asset_analysis_handler::list_asset_insights)
        .service(asset_handler::internal_get_asset)
        .service(asset_handler::get_asset)
        .service(asset_handler::update_asset)
        .service(asset_handler::delete_asset);
}

fn configure_production(cfg: &mut web::ServiceConfig) {
    cfg.service(production_handler::list_issues)
        .service(production_handler::issue_board_sync)
        .service(production_handler::create_issue)
        .service(production_handler::get_issue)
        .service(production_handler::update_issue)
        .service(production_handler::transition_issue)
        .service(production_handler::add_issue_comment)
        .service(production_handler::list_issue_comments)
        .service(production_handler::attach_issue_asset)
        .service(production_handler::list_issue_assets)
        .service(production_handler::list_issue_history)
        .service(production_handler::create_issue_work_log)
        .service(production_handler::list_issue_work_logs)
        .service(production_handler::delete_issue)
        .service(production_handler::create_issue_review)
        .service(production_handler::approve_issue)
        .service(production_handler::request_issue_revision)
        .service(production_handler::list_milestones)
        .service(production_handler::create_delivery_package)
        .service(production_handler::submit_delivery_package);
}

fn configure_planning(cfg: &mut web::ServiceConfig) {
    cfg.service(project_management_handler::planning_plan)
        .service(project_management_handler::list_epics)
        .service(project_management_handler::create_epic)
        .service(project_management_handler::list_sprints)
        .service(project_management_handler::create_sprint)
        .service(project_management_handler::list_dependencies)
        .service(project_management_handler::create_dependency)
        .service(project_management_handler::list_events)
        .service(project_management_handler::gantt_snapshot)
        .service(project_management_handler::calendar_snapshot);
}

fn configure_workflow(cfg: &mut web::ServiceConfig) {
    cfg.service(project_management_handler::workflow_catalog)
        .service(project_management_handler::automation_catalog)
        .service(project_management_handler::enterprise_controls);
}

fn configure_reporting(cfg: &mut web::ServiceConfig) {
    cfg.service(project_management_handler::reports_snapshot)
        .service(management_handler::management_intelligence)
        .service(management_handler::management_chat)
        .service(management_handler::management_chat_history)
        .service(management_handler::management_ai_test)
        .service(management_handler::management_autopilot_plan)
        .service(management_handler::management_rag_search)
        .service(management_handler::management_replica_action)
        .service(emergence_handler::emergence_snapshot)
        .service(emergence_handler::remember_emergence_snapshot);
    configure_security(cfg);
    configure_admin(cfg);
    configure_data_lake_query(cfg);
}

fn configure_data_lake_query(cfg: &mut web::ServiceConfig) {
    cfg.service(data_lake_query_handler::execute_sql_query)
        .service(data_lake_query_handler::execute_cypher_query);
}

fn configure_security(cfg: &mut web::ServiceConfig) {
    cfg.service(security_audit_handler::list_security_audit_events);
}

fn configure_admin(cfg: &mut web::ServiceConfig) {
    cfg.service(admin_control_handler::admin_control_snapshot)
        .service(admin_control_handler::admin_control_users)
        .service(admin_control_handler::admin_control_operation_traces)
        .service(admin_control_handler::export_admin_control_operation_traces)
        .service(admin_control_handler::update_admin_control_settings)
        .service(admin_control_handler::update_admin_risk_policy)
        .service(admin_control_handler::update_admin_user_role)
        .service(admin_control_handler::update_admin_user_status)
        .service(admin_control_handler::admin_ai_risk_analysis);
}

fn configure_projects(cfg: &mut web::ServiceConfig) {
    cfg.service(project_handler::list_projects);
}

fn configure_wiki(cfg: &mut web::ServiceConfig) {
    cfg.service(wiki_handler::list_spaces)
        .service(wiki_handler::create_space)
        .service(wiki_handler::list_pages)
        .service(wiki_handler::create_page)
        .service(wiki_handler::get_page)
        .service(wiki_handler::sync_page)
        .service(wiki_handler::apply_update)
        .service(wiki_handler::touch_presence);
}

fn configure_design_requirements(cfg: &mut web::ServiceConfig) {
    cfg.service(design_requirement_handler::list_requirements)
        .service(design_requirement_handler::create_requirement)
        .service(design_requirement_handler::get_requirement)
        .service(design_requirement_handler::update_requirement)
        .service(design_requirement_handler::attach_asset)
        .service(design_requirement_handler::add_comment)
        .service(design_requirement_handler::draft_requirement);
}

fn configure_people_intelligence(cfg: &mut web::ServiceConfig) {
    cfg.service(people_intelligence_handler::my_profile)
        .service(people_intelligence_handler::list_capabilities)
        .service(people_intelligence_handler::update_my_profile)
        .service(people_intelligence_handler::search_people)
        .service(people_intelligence_handler::personalize_content)
        .service(people_intelligence_handler::reindex_people)
        .service(people_intelligence_handler::approve_capability)
        .service(people_intelligence_handler::employee_evaluation)
        .service(people_intelligence_handler::verify_capability)
        .service(people_intelligence_handler::submit_correction)
        .service(people_intelligence_handler::employee_profile);
}
