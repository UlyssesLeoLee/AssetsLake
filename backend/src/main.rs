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
    asset_service::AssetService,
    event_publisher_service::EventPublisherService,
    graph_relation_service::GraphRelationService,
    search_index_service::SearchIndexService,
    storage_service::StorageService,
};

pub struct AppState {
    pub asset_service: AssetService,
    pub storage_service: StorageService,
    pub ai_index_service: AiIndexService,
    pub search_index_service: SearchIndexService,
    pub graph_relation_service: GraphRelationService,
    pub event_publisher_service: EventPublisherService,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("assetslake_backend=info".parse().unwrap()),
        )
        .json()
        .init();

    let cfg = AppConfig::from_env().expect("Failed to load configuration");
    let bind_addr = format!("{}:{}", cfg.server.host, cfg.server.port);

    info!(
        host = %cfg.server.host,
        port = cfg.server.port,
        "AssetsLake backend starting"
    );

    let pool = repositories::create_pool(&cfg.database_url)
        .await
        .expect("Failed to connect to PostgreSQL");

    let storage_service = StorageService::new(&cfg.minio)
        .await
        .expect("Failed to initialize MinIO storage service");

    let asset_service = AssetService::new(pool.clone(), storage_service.clone(), cfg.clone());

    let app_state = web::Data::new(AppState {
        asset_service,
        storage_service,
        ai_index_service: AiIndexService::new_stub(),
        search_index_service: SearchIndexService::new_stub(),
        graph_relation_service: GraphRelationService::new_stub(),
        event_publisher_service: EventPublisherService::new_stub(),
    });

    let workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4);

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
            .wrap(cors)
            .app_data(app_state.clone())
            .app_data(
                web::JsonConfig::default()
                    .limit(1024 * 1024)
                    .error_handler(|err, _| {
                        let response = errors::AppError::validation(err.to_string()).into_response();
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
