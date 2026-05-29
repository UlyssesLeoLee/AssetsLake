/*
```cypher
CREATE
  (f:File {name: "main.rs", type: "file", language: "rust"}),
  (m:Module {name: "assetslake_backend::main", type: "module"}),
  (c1:Class {name: "AppState", type: "class", language: "rust", signature: "struct AppState"}),
  (fn1:Function {name: "main", type: "function", language: "rust", signature: "async fn main() -> std::io::Result<()>"}),
  (v1:Variable {name: "cfg", type: "variable"}),
  (v2:Variable {name: "pool", type: "variable"}),
  (v3:Variable {name: "app_state", type: "variable"}),
  (v4:Variable {name: "workers", type: "variable"}),
  (v5:Variable {name: "verification_service", type: "variable"}),
  (v6:Variable {name: "_telemetry_guard", type: "variable"}),
  (v7:Variable {name: "event_publisher_service", type: "variable"}),
  (v8:Variable {name: "security_audit_service", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8);
```
*/

use std::env;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use tracing::info;
use tracing_actix_web::TracingLogger;

mod config;
mod errors;
mod handlers;
mod models;
mod repositories;
mod routes;
mod services;

use config::AppConfig;
use services::{
    ai_index_service::AiIndexService,
    ai_replica_action_service::AiReplicaActionService,
    asset_analysis_service::AssetAnalysisService,
    asset_service::AssetService,
    auth_service::AuthService,
    authorization_service::enforce_route_authorization,
    emergence_service::EmergenceService,
    event_publisher_service::EventPublisherService,
    graph_relation_service::GraphRelationService,
    lake_query_service::LakeQueryService,
    maintenance_service::{MaintenanceConfig, MaintenanceService},
    production_service::ProductionService,
    project_management_service::ProjectManagementService,
    rag_memory_service::RagMemoryService,
    rate_limit_service::RateLimitService,
    resource_lock_service::ResourceLockService,
    search_index_service::SearchIndexService,
    security_audit_service::SecurityAuditService,
    storage_service::StorageService,
    telemetry_service,
    verification_service::VerificationService,
};

pub struct AppState {
    pub asset_service: AssetService,
    pub storage_service: StorageService,
    pub ai_index_service: AiIndexService,
    pub search_index_service: SearchIndexService,
    pub graph_relation_service: GraphRelationService,
    pub event_publisher_service: EventPublisherService,
    pub production_service: ProductionService,
    pub project_management_service: ProjectManagementService,
    pub rag_memory_service: RagMemoryService,
    pub lake_query_service: LakeQueryService,
    pub asset_analysis_service: AssetAnalysisService,
    pub ai_replica_action_service: AiReplicaActionService,
    pub auth_service: AuthService,
    pub resource_lock_service: ResourceLockService,
    pub verification_service: VerificationService,
    pub rate_limit_service: RateLimitService,
    pub emergence_service: EmergenceService,
    pub security_audit_service: SecurityAuditService,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();

    let cfg = AppConfig::from_env().expect("Failed to load configuration");
    let _telemetry_guard = telemetry_service::init(cfg.service);
    let bind_addr = format!("{}:{}", cfg.server.host, cfg.server.port);

    info!(
        host = %cfg.server.host,
        port = cfg.server.port,
        service = cfg.service.as_str(),
        "AssetsLake backend starting"
    );

    let pool = repositories::create_pool(&cfg.database_url)
        .await
        .expect("Failed to connect to PostgreSQL");

    let storage_service = StorageService::new(&cfg.minio)
        .await
        .expect("Failed to initialize MinIO storage service");

    let asset_service = AssetService::new(pool.clone(), storage_service.clone(), cfg.clone())
        .expect("Failed to initialize asset security service");
    let production_service = ProductionService::new(pool.clone());
    let project_management_service = ProjectManagementService::new(pool.clone());
    let asset_analysis_service = AssetAnalysisService::new(pool.clone(), storage_service.clone());
    MaintenanceService::spawn(pool.clone(), MaintenanceConfig::from_env());
    EventPublisherService::spawn_outbox_relay(pool.clone(), cfg.events.clone());
    let event_publisher_service = EventPublisherService::new(pool.clone(), cfg.events.clone());
    let security_audit_service =
        SecurityAuditService::new(pool.clone(), event_publisher_service.clone());

    let app_state = web::Data::new(AppState {
        asset_service,
        storage_service,
        ai_index_service: AiIndexService::new_stub(),
        search_index_service: SearchIndexService::new_stub(),
        graph_relation_service: GraphRelationService::new_stub(),
        event_publisher_service,
        production_service,
        project_management_service,
        rag_memory_service: RagMemoryService::new(pool.clone(), cfg.rag.clone()),
        lake_query_service: LakeQueryService::new(pool.clone()),
        asset_analysis_service,
        ai_replica_action_service: AiReplicaActionService::new(cfg.ai_replica.clone()),
        auth_service: AuthService::new(pool.clone()),
        resource_lock_service: ResourceLockService::new(pool.clone()),
        verification_service: VerificationService::new(pool.clone()),
        rate_limit_service: RateLimitService::from_env(),
        emergence_service: EmergenceService::new(pool.clone()),
        security_audit_service,
    });

    let default_workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4);
    let workers = env::var("SERVER_WORKERS")
        .ok()
        .and_then(|value| value.parse::<usize>().ok())
        .filter(|value| *value > 0)
        .unwrap_or(default_workers);

    info!("Listening on {} with {} workers", bind_addr, workers);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(TracingLogger::default())
            .wrap(middleware::Compress::default())
            .wrap(middleware::from_fn(enforce_route_authorization))
            .wrap(cors)
            .app_data(app_state.clone())
            .app_data(
                web::JsonConfig::default()
                    .limit(1024 * 1024)
                    .error_handler(|err, _| {
                        let response =
                            errors::AppError::validation(err.to_string()).into_response();
                        actix_web::error::InternalError::from_response(err, response).into()
                    }),
            )
            .configure(routes::configure)
    })
    .bind(&bind_addr)?
    .workers(workers)
    .run()
    .await
}
