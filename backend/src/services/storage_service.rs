use aws_config::Region;
use aws_credential_types::Credentials;
use aws_sdk_s3::config::{BehaviorVersion, Builder as S3ConfigBuilder};
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client as S3Client;
use bytes::Bytes;
use tracing::{info, instrument};

use crate::{config::MinioConfig, errors::AppError};

#[derive(Clone)]
pub struct StorageService {
    client: S3Client,
    bucket: String,
    public_endpoint: String,
}

impl StorageService {
    pub async fn new(cfg: &MinioConfig) -> anyhow::Result<Self> {
        let creds = Credentials::new(
            &cfg.access_key,
            &cfg.secret_key,
            None,
            None,
            "assetslake-static",
        );

        let s3_config = S3ConfigBuilder::new()
            .behavior_version(BehaviorVersion::latest())
            .endpoint_url(&cfg.endpoint)
            .region(Region::new("us-east-1"))
            .credentials_provider(creds)
            .force_path_style(true)
            .build();

        let client = S3Client::from_conf(s3_config);

        info!(
            endpoint = %cfg.endpoint,
            bucket = %cfg.bucket,
            "StorageService initialized"
        );

        Ok(Self {
            client,
            bucket: cfg.bucket.clone(),
            public_endpoint: cfg.public_endpoint.clone(),
        })
    }

    #[instrument(skip(self, data), fields(object_key = %object_key, content_type = %content_type))]
    pub async fn put_object(
        &self,
        object_key: &str,
        data: Bytes,
        content_type: &str,
    ) -> Result<(), AppError> {
        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(object_key)
            .content_type(content_type)
            .content_length(data.len() as i64)
            .body(ByteStream::from(data))
            .send()
            .await
            .map_err(|e| AppError::storage(format!("Failed to put object: {}", e)))?;

        info!(object_key, "Object stored in MinIO");
        Ok(())
    }

    #[instrument(skip(self), fields(object_key = %object_key))]
    pub async fn get_object(&self, object_key: &str) -> Result<Bytes, AppError> {
        let output = self
            .client
            .get_object()
            .bucket(&self.bucket)
            .key(object_key)
            .send()
            .await
            .map_err(|e| AppError::storage(format!("Failed to get object: {}", e)))?;

        let data = output
            .body
            .collect()
            .await
            .map_err(|e| AppError::storage(format!("Failed to read object body: {}", e)))?;

        Ok(Bytes::from(data.into_bytes().to_vec()))
    }

    #[instrument(skip(self), fields(object_key = %object_key))]
    pub async fn delete_object(&self, object_key: &str) -> Result<(), AppError> {
        self.client
            .delete_object()
            .bucket(&self.bucket)
            .key(object_key)
            .send()
            .await
            .map_err(|e| AppError::storage(format!("Failed to delete object: {}", e)))?;

        info!(object_key, "Object deleted from MinIO");
        Ok(())
    }

    /// Generate the public URL for an object
    pub fn public_url(&self, object_key: &str) -> String {
        format!("{}/{}/{}", self.public_endpoint, self.bucket, object_key)
    }

    pub fn bucket(&self) -> &str {
        &self.bucket
    }

    /// Generate a presigned URL for temporary access (stub — requires presigning setup)
    pub fn presigned_url(&self, _object_key: &str, _expires_secs: u64) -> String {
        // TODO: implement presigning via aws-sdk-s3 presigned requests
        unimplemented!("Presigned URLs not yet implemented")
    }
}
