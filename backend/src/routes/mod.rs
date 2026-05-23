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
  (fn6:Function {name: "ServiceRouteSet::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn7:Function {name: "ServiceRouteSet::from_value", type: "function", language: "rust", signature: "fn from_value(value: &str) -> Self"}),
  (v1:Variable {name: "cfg", type: "variable"}),
  (v2:Variable {name: "route_set", type: "variable"}),
  (v3:Variable {name: "ASSETSLAKE_SERVICE", type: "variable"}),
  (v4:Variable {name: "management_handler", type: "variable"}),
  (v5:Variable {name: "auth_handler", type: "variable"}),
  (v6:Variable {name: "lock_handler", type: "variable"}),
  (v7:Variable {name: "verification_handler", type: "variable"}),
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
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v4),
  (fn8)-[:USES]->(v5),
  (fn9)-[:USES]->(v6),
  (fn10)-[:USES]->(v7),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:USES]->(v3);
```
*/

use std::env;

use actix_web::web;

use crate::handlers::{
    asset_analysis_handler, asset_handler, auth_handler, data_lake_query_handler,
    emergence_handler, health_handler, lock_handler, management_handler, production_handler,
    project_handler, project_management_handler, verification_handler,
};

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum ServiceRouteSet {
    Gateway,
    Assets,
    Production,
    Projects,
    Verification,
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
            "verification" | "identity" | "verification-api" => Self::Verification,
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
    configure_auth(cfg);
    configure_locks(cfg);
    configure_verification(cfg);

    match route_set {
        ServiceRouteSet::Gateway => {
            configure_assets(cfg);
            configure_production(cfg);
            configure_data_lake_query(cfg);
            configure_projects(cfg);
        }
        ServiceRouteSet::Assets => {
            configure_assets(cfg);
            configure_data_lake_query(cfg);
        }
        ServiceRouteSet::Production => {
            configure_production(cfg);
            configure_data_lake_query(cfg);
        }
        ServiceRouteSet::Projects => configure_projects(cfg),
        ServiceRouteSet::Verification => {}
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

fn configure_assets(cfg: &mut web::ServiceConfig) {
    cfg.service(asset_handler::upload_asset)
        .service(asset_handler::list_assets)
        .service(asset_handler::search_assets)
        .service(asset_handler::list_asset_versions)
        .service(asset_handler::compare_asset_versions)
        .service(asset_analysis_handler::analyze_asset)
        .service(asset_analysis_handler::list_asset_insights)
        .service(asset_handler::get_asset)
        .service(asset_handler::update_asset)
        .service(asset_handler::delete_asset);
}

fn configure_production(cfg: &mut web::ServiceConfig) {
    cfg.service(production_handler::list_issues)
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
        .service(production_handler::submit_delivery_package)
        .service(project_management_handler::planning_plan)
        .service(project_management_handler::list_epics)
        .service(project_management_handler::create_epic)
        .service(project_management_handler::list_sprints)
        .service(project_management_handler::create_sprint)
        .service(project_management_handler::list_dependencies)
        .service(project_management_handler::create_dependency)
        .service(project_management_handler::list_events)
        .service(project_management_handler::gantt_snapshot)
        .service(project_management_handler::calendar_snapshot)
        .service(project_management_handler::reports_snapshot)
        .service(project_management_handler::workflow_catalog)
        .service(project_management_handler::automation_catalog)
        .service(project_management_handler::enterprise_controls)
        .service(management_handler::management_intelligence)
        .service(management_handler::management_chat)
        .service(management_handler::management_rag_search)
        .service(management_handler::management_replica_action)
        .service(emergence_handler::emergence_snapshot)
        .service(emergence_handler::remember_emergence_snapshot);
}

fn configure_data_lake_query(cfg: &mut web::ServiceConfig) {
    cfg.service(data_lake_query_handler::execute_sql_query)
        .service(data_lake_query_handler::execute_cypher_query);
}

fn configure_projects(cfg: &mut web::ServiceConfig) {
    cfg.service(project_handler::list_projects);
}
