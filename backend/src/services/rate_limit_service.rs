/*
```cypher
CREATE
  (f:File {name: "rate_limit_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::rate_limit_service", type: "module"}),
  (c1:Class {name: "RateLimitService", type: "class", language: "rust", signature: "struct RateLimitService"}),
  (c2:Class {name: "RateLimitConfig", type: "class", language: "rust", signature: "struct RateLimitConfig"}),
  (c3:Class {name: "RateLimitBucket", type: "class", language: "rust", signature: "struct RateLimitBucket"}),
  (fn1:Function {name: "RateLimitService::from_env", type: "function", language: "rust", signature: "pub fn from_env() -> Self"}),
  (fn2:Function {name: "RateLimitService::new", type: "function", language: "rust", signature: "pub fn new(config: RateLimitConfig) -> Self"}),
  (fn3:Function {name: "RateLimitService::check_login", type: "function", language: "rust", signature: "pub fn check_login(&self, req: &HttpRequest, username: &str) -> Result<(), AppError>"}),
  (fn4:Function {name: "RateLimitService::check_verification_challenge", type: "function", language: "rust", signature: "pub fn check_verification_challenge(&self, req: &HttpRequest, target: &str) -> Result<(), AppError>"}),
  (fn5:Function {name: "RateLimitService::check", type: "function", language: "rust", signature: "fn check(&self, key: String, max_requests: u32, window: Duration, label: &str) -> Result<(), AppError>"}),
  (fn6:Function {name: "RateLimitConfig::from_env", type: "function", language: "rust", signature: "pub fn from_env() -> Self"}),
  (fn7:Function {name: "RateLimitConfig::max_window", type: "function", language: "rust", signature: "fn max_window(&self) -> Duration"}),
  (fn8:Function {name: "env_u32", type: "function", language: "rust", signature: "fn env_u32(key: &str, default: u32) -> u32"}),
  (fn9:Function {name: "env_u64", type: "function", language: "rust", signature: "fn env_u64(key: &str, default: u64) -> u64"}),
  (fn10:Function {name: "client_addr", type: "function", language: "rust", signature: "fn client_addr(req: &HttpRequest) -> String"}),
  (v1:Variable {name: "buckets", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (v3:Variable {name: "req", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c2)-[:HAS_METHOD]->(fn6),
  (c2)-[:HAS_METHOD]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn2),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn10),
  (fn4)-[:CALLS]->(fn5),
  (fn4)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn8),
  (fn6)-[:CALLS]->(fn9),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v3),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2);
```
*/

use std::{
    collections::HashMap,
    env,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use actix_web::HttpRequest;

use crate::errors::AppError;

#[derive(Clone)]
pub struct RateLimitService {
    buckets: Arc<Mutex<HashMap<String, RateLimitBucket>>>,
    config: RateLimitConfig,
}

#[derive(Debug, Clone)]
pub struct RateLimitConfig {
    pub login_max_requests: u32,
    pub login_window: Duration,
    pub verification_max_requests: u32,
    pub verification_window: Duration,
}

#[derive(Debug, Clone, Copy)]
struct RateLimitBucket {
    window_started_at: Instant,
    count: u32,
}

impl RateLimitService {
    pub fn from_env() -> Self {
        Self::new(RateLimitConfig::from_env())
    }

    pub fn new(config: RateLimitConfig) -> Self {
        Self {
            buckets: Arc::new(Mutex::new(HashMap::new())),
            config,
        }
    }

    pub fn check_login(&self, req: &HttpRequest, username: &str) -> Result<(), AppError> {
        let normalized_username = username.trim().to_ascii_lowercase();
        self.check(
            format!("login:{}:{}", client_addr(req), normalized_username),
            self.config.login_max_requests,
            self.config.login_window,
            "login",
        )
    }

    pub fn check_verification_challenge(
        &self,
        req: &HttpRequest,
        target: &str,
    ) -> Result<(), AppError> {
        self.check(
            format!(
                "verification:{}:{}",
                client_addr(req),
                target.trim().to_ascii_lowercase()
            ),
            self.config.verification_max_requests,
            self.config.verification_window,
            "verification challenge",
        )
    }

    fn check(
        &self,
        key: String,
        max_requests: u32,
        window: Duration,
        label: &str,
    ) -> Result<(), AppError> {
        if max_requests == 0 {
            return Ok(());
        }

        let now = Instant::now();
        let mut buckets = self
            .buckets
            .lock()
            .map_err(|_| AppError::internal("Rate limiter state is unavailable"))?;
        let max_window = self.config.max_window();
        buckets.retain(|_, bucket| now.duration_since(bucket.window_started_at) <= max_window);

        let bucket = buckets.entry(key).or_insert(RateLimitBucket {
            window_started_at: now,
            count: 0,
        });
        if now.duration_since(bucket.window_started_at) >= window {
            bucket.window_started_at = now;
            bucket.count = 0;
        }
        if bucket.count >= max_requests {
            return Err(AppError::rate_limited(format!(
                "Too many {label} requests; retry after {} seconds",
                window.as_secs()
            )));
        }
        bucket.count += 1;
        Ok(())
    }
}

impl RateLimitConfig {
    pub fn from_env() -> Self {
        Self {
            login_max_requests: env_u32("RATE_LIMIT_LOGIN_MAX", 30),
            login_window: Duration::from_secs(env_u64("RATE_LIMIT_LOGIN_WINDOW_SECONDS", 60)),
            verification_max_requests: env_u32("RATE_LIMIT_VERIFICATION_MAX", 10),
            verification_window: Duration::from_secs(env_u64(
                "RATE_LIMIT_VERIFICATION_WINDOW_SECONDS",
                300,
            )),
        }
    }

    fn max_window(&self) -> Duration {
        self.login_window.max(self.verification_window)
    }
}

fn env_u32(key: &str, default: u32) -> u32 {
    env::var(key)
        .ok()
        .and_then(|value| value.parse::<u32>().ok())
        .unwrap_or(default)
}

fn env_u64(key: &str, default: u64) -> u64 {
    env::var(key)
        .ok()
        .and_then(|value| value.parse::<u64>().ok())
        .unwrap_or(default)
}

fn client_addr(req: &HttpRequest) -> String {
    if let Some(addr) = req.connection_info().realip_remote_addr() {
        return addr.to_string();
    }
    req.peer_addr()
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|| "unknown".to_string())
}
