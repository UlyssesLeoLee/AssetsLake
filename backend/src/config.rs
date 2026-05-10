use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database_url: String,
    pub minio: MinioConfig,
    pub upload: UploadConfig,
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

impl AppConfig {
    pub fn from_env() -> anyhow::Result<Self> {
        let max_mb: u64 = env::var("MAX_UPLOAD_SIZE_MB")
            .unwrap_or_else(|_| "500".into())
            .parse()
            .unwrap_or(500);

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
        })
    }
}
