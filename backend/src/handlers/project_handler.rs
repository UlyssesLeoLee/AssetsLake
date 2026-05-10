use actix_web::{get, web, HttpResponse};

use crate::{errors::AppError, AppState};

#[get("/api/projects")]
pub async fn list_projects(_state: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "data": [{
            "id": "00000000-0000-0000-0000-000000000001",
            "name": "Default Project",
            "code": "DEFAULT",
            "description": "Default project for ungrouped assets",
            "status": "active",
            "color": "#6366f1"
        }],
        "success": true
    })))
}
