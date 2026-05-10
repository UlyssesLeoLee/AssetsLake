use actix_web::web;

use crate::handlers::{asset_handler, health_handler, project_handler};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(health_handler::health)
        .service(asset_handler::upload_asset)
        .service(asset_handler::list_assets)
        .service(asset_handler::search_assets)
        .service(asset_handler::get_asset)
        .service(asset_handler::update_asset)
        .service(asset_handler::delete_asset)
        .service(project_handler::list_projects);
}
