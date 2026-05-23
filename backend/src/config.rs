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
  (fn1:Function {name: "AppConfig::from_env", type: "function", language: "rust", signature: "fn from_env() -> anyhow::Result<Self>"}),
  (fn2:Function {name: "parse_bool", type: "function", language: "rust", signature: "fn parse_bool(value: &str) -> bool"}),
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
  (c1)-[:HAS_METHOD]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6);
```
*/

use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database_url: String,
    pub minio: MinioConfig,
    pub upload: UploadConfig,
    pub rag: RagMemoryConfig,
    pub ai_replica: AiReplicaConfig,
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

impl AppConfig {
    pub fn from_env() -> anyhow::Result<Self> {
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
            server: ServerConfig {
                host: env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".into()),
                port: env::var("SERVER_PORT")
                    .unwrap_or_else(|_| "8080".into())
                    .parse()
                    .unwrap_or(8080),
            },
            database_url: env::var("DATABASE_URL")
                .map_err(|_| anyhow::anyhow!("DATABASE_URL must be set"))?,
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
        })
    }
}

fn parse_bool(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "1" | "true" | "yes" | "on"
    )
}
