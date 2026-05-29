/*
```cypher
CREATE
  (f:File {name: "asset_security_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::asset_security_service", type: "module"}),
  (c1:Class {name: "AssetSecurityService", type: "class", language: "rust", signature: "struct AssetSecurityService"}),
  (c2:Class {name: "AssetAccessToken", type: "class", language: "rust", signature: "struct AssetAccessToken"}),
  (fn1:Function {name: "AssetSecurityService::from_env", type: "function", language: "rust", signature: "pub fn from_env() -> anyhow::Result<Self>"}),
  (fn2:Function {name: "AssetSecurityService::content_url", type: "function", language: "rust", signature: "pub fn content_url(&self, asset_id: Uuid, version: Option<i32>) -> String"}),
  (fn3:Function {name: "AssetSecurityService::validate_token", type: "function", language: "rust", signature: "pub fn validate_token(&self, asset_id: Uuid, version: Option<i32>, token: &AssetAccessToken) -> bool"}),
  (fn4:Function {name: "AssetSecurityService::validate_upload", type: "function", language: "rust", signature: "pub fn validate_upload(&self, filename: &str, declared_mime: &str, bytes: &[u8]) -> Result<(), AppError>"}),
  (fn5:Function {name: "AssetSecurityService::content_disposition", type: "function", language: "rust", signature: "pub fn content_disposition(&self, filename: &str, mime_type: &str, download: bool) -> String"}),
  (fn6:Function {name: "AssetSecurityService::read_auth_required", type: "function", language: "rust", signature: "pub fn read_auth_required(&self) -> bool"}),
  (fn7:Function {name: "parse_bool_env", type: "function", language: "rust", signature: "fn parse_bool_env(key: &str, default_value: bool) -> bool"}),
  (fn8:Function {name: "parse_i64_env", type: "function", language: "rust", signature: "fn parse_i64_env(key: &str, default_value: i64) -> i64"}),
  (fn9:Function {name: "parse_usize_env", type: "function", language: "rust", signature: "fn parse_usize_env(key: &str, default_value: usize) -> usize"}),
  (fn10:Function {name: "parse_csv_set", type: "function", language: "rust", signature: "fn parse_csv_set(key: &str, default_value: &str) -> HashSet<String>"}),
  (fn11:Function {name: "extension", type: "function", language: "rust", signature: "fn extension(filename: &str) -> String"}),
  (fn12:Function {name: "normalized_mime", type: "function", language: "rust", signature: "fn normalized_mime(mime: &str) -> String"}),
  (fn13:Function {name: "has_blocked_binary_signature", type: "function", language: "rust", signature: "fn has_blocked_binary_signature(bytes: &[u8]) -> bool"}),
  (fn14:Function {name: "sanitize_header_filename", type: "function", language: "rust", signature: "fn sanitize_header_filename(filename: &str) -> String"}),
  (fn15:Function {name: "sign", type: "function", language: "rust", signature: "fn sign(secret: &str, message: &str) -> Option<String>"}),
  (fn16:Function {name: "signature_message", type: "function", language: "rust", signature: "fn signature_message(asset_id: Uuid, version: Option<i32>, expires: i64) -> String"}),
  (v1:Variable {name: "signed_urls_enabled", type: "variable"}),
  (v2:Variable {name: "token_secret", type: "variable"}),
  (v3:Variable {name: "blocked_extensions", type: "variable"}),
  (v4:Variable {name: "blocked_mime_types", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:CALLS]->(fn9),
  (fn1)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn15),
  (fn2)-[:CALLS]->(fn16),
  (fn3)-[:CALLS]->(fn15),
  (fn3)-[:CALLS]->(fn16),
  (fn4)-[:CALLS]->(fn11),
  (fn4)-[:CALLS]->(fn12),
  (fn4)-[:CALLS]->(fn13),
  (fn5)-[:CALLS]->(fn12),
  (fn5)-[:CALLS]->(fn14),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4);
```
*/

use std::{collections::HashSet, env};

use chrono::Utc;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use uuid::Uuid;

use crate::errors::AppError;

type HmacSha256 = Hmac<Sha256>;

const DEFAULT_BLOCKED_EXTENSIONS: &str =
    "exe,dll,com,scr,msi,dmg,app,deb,rpm,apk,ipa,jar,war,ear,svg";
const DEFAULT_BLOCKED_MIME_TYPES: &str = "application/x-msdownload,application/x-dosexec,application/x-msi,image/svg+xml,text/html,application/xhtml+xml";

#[derive(Debug, Clone)]
pub struct AssetSecurityService {
    signed_urls_enabled: bool,
    read_auth_required: bool,
    access_audit_enabled: bool,
    token_secret: String,
    token_ttl_seconds: i64,
    max_filename_bytes: usize,
    blocked_extensions: HashSet<String>,
    blocked_mime_types: HashSet<String>,
}

#[derive(Debug, Clone)]
pub struct AssetAccessToken {
    pub expires: Option<i64>,
    pub signature: Option<String>,
}

impl AssetSecurityService {
    pub fn from_env() -> anyhow::Result<Self> {
        let signed_urls_enabled = parse_bool_env("ASSET_SIGNED_URLS_ENABLED", false);
        let read_auth_required = parse_bool_env("ASSET_READ_AUTH_REQUIRED", false);
        let token_secret = env::var("ASSET_ACCESS_TOKEN_SECRET")
            .or_else(|_| env::var("INTERNAL_SERVICE_TOKEN"))
            .unwrap_or_default();

        if signed_urls_enabled && token_secret.len() < 32 {
            anyhow::bail!(
                "ASSET_ACCESS_TOKEN_SECRET must be at least 32 bytes when signed asset URLs are enabled"
            );
        }

        Ok(Self {
            signed_urls_enabled,
            read_auth_required,
            access_audit_enabled: parse_bool_env("ASSET_ACCESS_AUDIT_ENABLED", true),
            token_secret,
            token_ttl_seconds: parse_i64_env("ASSET_SIGNED_URL_TTL_SECONDS", 300).clamp(30, 3600),
            max_filename_bytes: parse_usize_env("MAX_ASSET_FILENAME_BYTES", 180).clamp(32, 255),
            blocked_extensions: parse_csv_set(
                "ASSET_BLOCKED_EXTENSIONS",
                DEFAULT_BLOCKED_EXTENSIONS,
            ),
            blocked_mime_types: parse_csv_set(
                "ASSET_BLOCKED_MIME_TYPES",
                DEFAULT_BLOCKED_MIME_TYPES,
            ),
        })
    }

    pub fn content_url(&self, asset_id: Uuid, version: Option<i32>) -> String {
        let path = match version {
            Some(version) => format!("/api/assets/{asset_id}/versions/{version}/content"),
            None => format!("/api/assets/{asset_id}/content"),
        };

        if !self.signed_urls_enabled {
            return path;
        }

        let expires = Utc::now().timestamp() + self.token_ttl_seconds;
        let message = signature_message(asset_id, version, expires);
        let Some(signature) = sign(&self.token_secret, &message) else {
            return path;
        };

        format!("{path}?expires={expires}&signature={signature}")
    }

    pub fn validate_token(
        &self,
        asset_id: Uuid,
        version: Option<i32>,
        token: &AssetAccessToken,
    ) -> bool {
        let Some(expires) = token.expires else {
            return false;
        };
        let Some(signature) = token.signature.as_deref() else {
            return false;
        };
        if expires < Utc::now().timestamp() || self.token_secret.is_empty() {
            return false;
        }

        let message = signature_message(asset_id, version, expires);
        sign(&self.token_secret, &message)
            .map(|expected| expected == signature)
            .unwrap_or(false)
    }

    pub fn validate_upload(
        &self,
        filename: &str,
        declared_mime: &str,
        bytes: &[u8],
    ) -> Result<(), AppError> {
        let trimmed = filename.trim();
        if trimmed.is_empty() || trimmed.as_bytes().len() > self.max_filename_bytes {
            return Err(AppError::validation(format!(
                "Asset filename must be 1-{} bytes",
                self.max_filename_bytes
            )));
        }
        if trimmed.contains('\0') {
            return Err(AppError::validation(
                "Asset filename contains an invalid byte",
            ));
        }

        let ext = extension(trimmed);
        if !ext.is_empty() && self.blocked_extensions.contains(&ext) {
            return Err(AppError::UnsupportedMediaType(format!(
                "File extension .{ext} is blocked by asset storage policy"
            )));
        }

        let mime = normalized_mime(declared_mime);
        if self.blocked_mime_types.contains(&mime) {
            return Err(AppError::UnsupportedMediaType(format!(
                "MIME type {mime} is blocked by asset storage policy"
            )));
        }

        if has_blocked_binary_signature(bytes) {
            return Err(AppError::UnsupportedMediaType(
                "Executable binary signatures are blocked by asset storage policy".to_string(),
            ));
        }

        Ok(())
    }

    pub fn content_disposition(&self, filename: &str, mime_type: &str, download: bool) -> String {
        let disposition = if download || !is_safe_inline_mime(mime_type) {
            "attachment"
        } else {
            "inline"
        };
        format!(
            "{disposition}; filename=\"{}\"",
            sanitize_header_filename(filename)
        )
    }

    pub fn read_auth_required(&self) -> bool {
        self.read_auth_required
    }

    pub fn access_audit_enabled(&self) -> bool {
        self.access_audit_enabled
    }
}

fn parse_bool_env(key: &str, default_value: bool) -> bool {
    env::var(key)
        .map(|value| {
            matches!(
                value.trim().to_ascii_lowercase().as_str(),
                "1" | "true" | "yes" | "on"
            )
        })
        .unwrap_or(default_value)
}

fn parse_i64_env(key: &str, default_value: i64) -> i64 {
    env::var(key)
        .ok()
        .and_then(|value| value.parse::<i64>().ok())
        .unwrap_or(default_value)
}

fn parse_usize_env(key: &str, default_value: usize) -> usize {
    env::var(key)
        .ok()
        .and_then(|value| value.parse::<usize>().ok())
        .unwrap_or(default_value)
}

fn parse_csv_set(key: &str, default_value: &str) -> HashSet<String> {
    env::var(key)
        .unwrap_or_else(|_| default_value.to_string())
        .split(',')
        .map(|value| value.trim().trim_start_matches('.').to_ascii_lowercase())
        .filter(|value| !value.is_empty())
        .collect()
}

fn extension(filename: &str) -> String {
    std::path::Path::new(filename)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or_default()
        .trim_start_matches('.')
        .to_ascii_lowercase()
}

fn normalized_mime(mime: &str) -> String {
    mime.split(';')
        .next()
        .unwrap_or(mime)
        .trim()
        .to_ascii_lowercase()
}

fn is_safe_inline_mime(mime: &str) -> bool {
    let mime = normalized_mime(mime);
    matches!(
        mime.as_str(),
        "image/png"
            | "image/jpeg"
            | "image/gif"
            | "image/webp"
            | "audio/mpeg"
            | "audio/ogg"
            | "audio/wav"
            | "video/mp4"
            | "video/webm"
            | "video/quicktime"
    )
}

fn has_blocked_binary_signature(bytes: &[u8]) -> bool {
    bytes.starts_with(b"MZ")
        || bytes.starts_with(b"\x7FELF")
        || bytes.starts_with(&[0xCA, 0xFE, 0xBA, 0xBE])
        || bytes.starts_with(&[0xFE, 0xED, 0xFA, 0xCE])
        || bytes.starts_with(&[0xFE, 0xED, 0xFA, 0xCF])
        || bytes.starts_with(&[0xCE, 0xFA, 0xED, 0xFE])
        || bytes.starts_with(&[0xCF, 0xFA, 0xED, 0xFE])
}

fn sanitize_header_filename(filename: &str) -> String {
    filename
        .chars()
        .map(|ch| match ch {
            '"' | '\\' | '\r' | '\n' | '\0' => '_',
            ch if ch.is_control() => '_',
            ch => ch,
        })
        .collect()
}

fn sign(secret: &str, message: &str) -> Option<String> {
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).ok()?;
    mac.update(message.as_bytes());
    Some(hex::encode(mac.finalize().into_bytes()))
}

fn signature_message(asset_id: Uuid, version: Option<i32>, expires: i64) -> String {
    format!(
        "asset-content:v1:{}:{}:{}",
        asset_id,
        version.unwrap_or_default(),
        expires
    )
}
