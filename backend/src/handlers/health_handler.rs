use actix_web::{get, web, HttpResponse};
use serde::Serialize;

use crate::AppState;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    version: &'static str,
}

#[get("/api/health")]
pub async fn health(_state: web::Data<AppState>) -> HttpResponse {
    HttpResponse::Ok().json(HealthResponse {
        status: "ok",
        service: "assetslake-backend",
        version: env!("CARGO_PKG_VERSION"),
    })
}
