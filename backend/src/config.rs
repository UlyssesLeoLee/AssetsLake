/*
```cypher
CREATE
  (f:File {name: "config.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::config", type: "module"}),
  (c1:Class {name: "AppConfig", type: "class", language: "rust", signature: "struct AppConfig"}),
  (c2:Class {name: "ServerConfig", type: "class", language: "rust", signature: "struct ServerConfig"}),
  (c3:Class {name: "MinioConfig", type: "class", language: "rust", signature: "struct MinioConfig"}),
  (c4:Class {name: "UploadConfig", type: "class", language: "rust", signature: "struct UploadConfig"}),
  (c5:Class {name: "RagMemoryConfig", type: "class", language: "rust", signature: "struct RagMemoryConfig"}),
  (c6:Class {name: "AiReplicaConfig", type: "class", language: "rust", signature: "struct AiReplicaConfig"}),
  (c7:Class {name: "EventPipelineConfig", type: "class", language: "rust", signature: "struct EventPipelineConfig"}),
  (c8:Class {name: "DomainService", type: "class", language: "rust", signature: "enum DomainService"}),
  (fn1:Function {name: "AppConfig::from_env", type: "function", language: "rust", signature: "fn from_env() -> anyhow::Result<Self>"}),
  (fn2:Function {name: "parse_bool", type: "function", language: "rust", signature: "fn parse_bool(value: &str) -> bool"}),
  (fn3:Function {name: "DomainService::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn4:Function {name: "DomainService::from_value", type: "function", language: "rust", signature: "fn from_value(value: &str) -> Self"}),
  (fn5:Function {name: "DomainService::as_str", type: "function", language: "rust", signature: "fn as_str(self) -> &'static str"}),
  (fn6:Function {name: "DomainService::database_env_key", type: "function", language: "rust", signature: "fn database_env_key(self) -> Option<&'static str>"}),
  (fn7:Function {name: "resolve_database_url", type: "function", language: "rust", signature: "fn resolve_database_url(service: DomainService) -> anyhow::Result<String>"}),
  (v1:Variable {name: "max_mb", type: "variable"}),
  (v2:Variable {name: "rag_enabled", type: "variable"}),
  (v3:Variable {name: "vector_size", type: "variable"}),
  (v4:Variable {name: "replication_factor", type: "variable"}),
  (v5:Variable {name: "ai_replica_enabled", type: "variable"}),
  (v6:Variable {name: "ai_replica_vector_size", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (c1)-[:HAS_METHOD]->(fn1),
  (c8)-[:HAS_METHOD]->(fn3),
  (c8)-[:HAS_METHOD]->(fn4),
  (c8)-[:HAS_METHOD]->(fn5),
  (c8)-[:HAS_METHOD]->(fn6),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn7),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn7),
  (fn3)-[:CALLS]->(fn4),
  (fn7)-[:CALLS]->(fn6),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn7)-[:USES]->(v3);
```
*/

use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub service: DomainService,
    pub server: ServerConfig,
    pub database_url: String,
    pub minio: MinioConfig,
    pub upload: UploadConfig,
    pub rag: RagMemoryConfig,
    pub ai_replica: AiReplicaConfig,
    pub events: EventPipelineConfig,
}

#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone)]
pub struct MinioConfig {
    pub endpoint: String,
    pub access_key: String,
    pub secret_key: String,
    pub bucket: String,
    pub public_endpoint: String,
}

#[derive(Debug, Clone)]
pub struct UploadConfig {
    pub max_size_bytes: u64,
}

#[derive(Debug, Clone)]
pub struct RagMemoryConfig {
    pub enabled: bool,
    pub qdrant_url: String,
    pub collection: String,
    pub vector_size: usize,
    pub replication_factor: usize,
}

#[derive(Debug, Clone)]
pub struct AiReplicaConfig {
    pub enabled: bool,
    pub qdrant_url: String,
    pub collection: String,
    pub vector_size: usize,
}

#[derive(Debug, Clone)]
pub struct EventPipelineConfig {
    pub enabled: bool,
    pub outbox_relay_enabled: bool,
    pub dry_run: bool,
    pub service_name: String,
    pub kafka_brokers: Option<String>,
    pub kafka_client_id: String,
    pub poll_interval_seconds: u64,
    pub batch_size: i64,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum DomainService {
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

impl DomainService {
    pub fn from_env() -> Self {
        let value = env::var("ASSETSLAKE_SERVICE")
            .or_else(|_| env::var("BACKEND_SERVICE"))
            .unwrap_or_else(|_| "gateway".to_string());
        Self::from_value(&value)
    }

    pub fn from_value(value: &str) -> Self {
        match value.trim().to_ascii_lowercase().replace('_', "-").as_str() {
            "gateway" | "all" | "api-gateway" => Self::Gateway,
            "assets" | "asset" | "asset-api" | "assets-api" => Self::Assets,
            "production" | "production-flow" | "production-api" => Self::Production,
            "projects" | "project" | "projects-api" => Self::Projects,
            "identity" | "verification" | "verification-api" | "identity-api" => Self::Identity,
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
            _ => Self::Gateway,
        }
    }

    pub fn as_str(self) -> &'static str {
        match self {
            Self::Gateway => "gateway",
            Self::Assets => "assets",
            Self::Production => "production",
            Self::Projects => "projects",
            Self::Identity => "identity",
            Self::Planning => "planning",
            Self::Workflow => "workflow",
            Self::Reporting => "reporting",
            Self::Wiki => "wiki",
            Self::DesignRequirements => "design-requirements",
            Self::PeopleIntelligence => "people-intelligence",
        }
    }

    fn database_env_key(self) -> Option<&'static str> {
        match self {
            Self::Gateway => None,
            Self::Assets => Some("ASSETS_DATABASE_URL"),
            Self::Production => Some("PRODUCTION_DATABASE_URL"),
            Self::Projects => Some("PROJECTS_DATABASE_URL"),
            Self::Identity => Some("IDENTITY_DATABASE_URL"),
            Self::Planning => Some("PLANNING_DATABASE_URL"),
            Self::Workflow => Some("WORKFLOW_DATABASE_URL"),
            Self::Reporting => Some("REPORTING_DATABASE_URL"),
            Self::Wiki => Some("WIKI_DATABASE_URL"),
            Self::DesignRequirements => Some("DESIGN_REQUIREMENTS_DATABASE_URL"),
            Self::PeopleIntelligence => Some("PEOPLE_INTELLIGENCE_DATABASE_URL"),
        }
    }
}

impl AppConfig {
    pub fn from_env() -> anyhow::Result<Self> {
        let service = DomainService::from_env();
        let max_mb: u64 = env::var("MAX_UPLOAD_SIZE_MB")
            .unwrap_or_else(|_| "500".into())
            .parse()
            .unwrap_or(500);
        let rag_enabled = env::var("RAG_MEMORY_ENABLED")
            .map(|value| parse_bool(&value))
            .unwrap_or(true);
        let vector_size = env::var("QDRANT_VECTOR_SIZE")
            .unwrap_or_else(|_| "384".into())
            .parse()
            .unwrap_or(384);
        let replication_factor = env::var("QDRANT_REPLICATION_FACTOR")
            .unwrap_or_else(|_| "1".into())
            .parse::<usize>()
            .unwrap_or(1)
            .max(1);
        let ai_replica_enabled = env::var("AI_REPLICA_WRITE_ENABLED")
            .map(|value| parse_bool(&value))
            .unwrap_or(true);
        let ai_replica_vector_size = env::var("AI_REPLICA_VECTOR_SIZE")
            .unwrap_or_else(|_| "64".into())
            .parse()
            .unwrap_or(64);

        Ok(Self {
            service,
            server: ServerConfig {
                host: env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".into()),
                port: env::var("SERVER_PORT")
                    .unwrap_or_else(|_| "8080".into())
                    .parse()
                    .unwrap_or(8080),
            },
            database_url: resolve_database_url(service)?,
            minio: MinioConfig {
                endpoint: env::var("MINIO_ENDPOINT")
                    .unwrap_or_else(|_| "http://localhost:9000".into()),
                access_key: env::var("MINIO_ACCESS_KEY")
                    .map_err(|_| anyhow::anyhow!("MINIO_ACCESS_KEY must be set"))?,
                secret_key: env::var("MINIO_SECRET_KEY")
                    .map_err(|_| anyhow::anyhow!("MINIO_SECRET_KEY must be set"))?,
                bucket: env::var("MINIO_BUCKET").unwrap_or_else(|_| "art-assets".into()),
                public_endpoint: env::var("MINIO_PUBLIC_ENDPOINT")
                    .unwrap_or_else(|_| "http://localhost:9000".into()),
            },
            upload: UploadConfig {
                max_size_bytes: max_mb * 1024 * 1024,
            },
            rag: RagMemoryConfig {
                enabled: rag_enabled,
                qdrant_url: env::var("QDRANT_URL")
                    .unwrap_or_else(|_| "http://localhost:6333".into()),
                collection: env::var("QDRANT_COLLECTION")
                    .unwrap_or_else(|_| "assetslake_operation_memories".into()),
                vector_size,
                replication_factor,
            },
            ai_replica: AiReplicaConfig {
                enabled: ai_replica_enabled,
                qdrant_url: env::var("AI_REPLICA_QDRANT_URL")
                    .unwrap_or_else(|_| "http://localhost:6333".into()),
                collection: env::var("AI_REPLICA_ACTION_COLLECTION")
                    .unwrap_or_else(|_| "assetslake_ai_replica_actions".into()),
                vector_size: ai_replica_vector_size,
            },
            events: EventPipelineConfig {
                enabled: env::var("EVENT_PIPELINE_ENABLED")
                    .map(|value| parse_bool(&value))
                    .unwrap_or(true),
                outbox_relay_enabled: env::var("OUTBOX_RELAY_ENABLED")
                    .map(|value| parse_bool(&value))
                    .unwrap_or(true),
                dry_run: env::var("EVENT_RELAY_DRY_RUN")
                    .map(|value| parse_bool(&value))
                    .unwrap_or(true),
                service_name: service.as_str().to_string(),
                kafka_brokers: env::var("KAFKA_BROKERS")
                    .ok()
                    .filter(|value| !value.trim().is_empty()),
                kafka_client_id: env::var("KAFKA_CLIENT_ID")
                    .unwrap_or_else(|_| format!("assetslake-{}-outbox-relay", service.as_str())),
                poll_interval_seconds: env::var("OUTBOX_RELAY_INTERVAL_SECONDS")
                    .unwrap_or_else(|_| "5".into())
                    .parse()
                    .unwrap_or(5),
                batch_size: env::var("OUTBOX_RELAY_BATCH_SIZE")
                    .unwrap_or_else(|_| "100".into())
                    .parse()
                    .unwrap_or(100),
            },
        })
    }
}

fn resolve_database_url(service: DomainService) -> anyhow::Result<String> {
    if let Some(key) = service.database_env_key() {
        if let Ok(value) = env::var(key) {
            if !value.trim().is_empty() {
                return Ok(value);
            }
        }
    }

    env::var("DATABASE_URL").map_err(|_| {
        anyhow::anyhow!(
            "DATABASE_URL or {} must be set",
            service.database_env_key().unwrap_or("DATABASE_URL")
        )
    })
}

fn parse_bool(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "1" | "true" | "yes" | "on"
    )
}
