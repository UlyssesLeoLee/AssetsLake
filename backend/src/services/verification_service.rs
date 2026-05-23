/*
```cypher
CREATE
  (f:File {name: "verification_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::verification_service", type: "module"}),
  (c1:Class {name: "VerificationService", type: "class", language: "rust", signature: "struct VerificationService"}),
  (c2:Class {name: "VerificationConfig", type: "class", language: "rust", signature: "struct VerificationConfig"}),
  (c3:Class {name: "VerificationAppRow", type: "class", language: "rust", signature: "struct VerificationAppRow"}),
  (c4:Class {name: "ChallengeRow", type: "class", language: "rust", signature: "struct ChallengeRow"}),
  (c5:Class {name: "VerificationUserRow", type: "class", language: "rust", signature: "struct VerificationUserRow"}),
  (c6:Class {name: "SmsProviderConfig", type: "class", language: "rust", signature: "enum SmsProviderConfig"}),
  (c7:Class {name: "SmsDeliveryResult", type: "class", language: "rust", signature: "struct SmsDeliveryResult"}),
  (c8:Class {name: "TwilioMessageResponse", type: "class", language: "rust", signature: "struct TwilioMessageResponse"}),
  (c9:Class {name: "TwilioErrorResponse", type: "class", language: "rust", signature: "struct TwilioErrorResponse"}),
  (c10:Class {name: "EmailProviderConfig", type: "class", language: "rust", signature: "enum EmailProviderConfig"}),
  (c11:Class {name: "SmtpDeliveryRequest", type: "class", language: "rust", signature: "struct SmtpDeliveryRequest<'a>"}),
  (mt:Module {name: "crate::services::verification_service::tests", type: "module"}),
  (fn1:Function {name: "VerificationService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "VerificationService::app_info", type: "function", language: "rust", signature: "async fn app_info(&self) -> Result<VerificationAppInfo, AppError>"}),
  (fn3:Function {name: "VerificationService::start_challenge", type: "function", language: "rust", signature: "async fn start_challenge(&self, req: StartVerificationRequest) -> Result<StartVerificationResponse, AppError>"}),
  (fn4:Function {name: "VerificationService::verify_code", type: "function", language: "rust", signature: "async fn verify_code(&self, challenge_id: Uuid, req: VerifyCodeRequest) -> Result<VerifyCodeResponse, AppError>"}),
  (fn5:Function {name: "VerificationService::register", type: "function", language: "rust", signature: "async fn register(&self, req: RegisterWithVerificationRequest) -> Result<VerificationMutationResponse, AppError>"}),
  (fn6:Function {name: "VerificationService::change_password", type: "function", language: "rust", signature: "async fn change_password(&self, req: ChangePasswordWithVerificationRequest) -> Result<VerificationMutationResponse, AppError>"}),
  (fn7:Function {name: "VerificationService::list_outbox", type: "function", language: "rust", signature: "async fn list_outbox(&self, limit: Option<i64>) -> Result<Vec<VerificationOutboxItem>, AppError>"}),
  (fn8:Function {name: "VerificationService::app_by_key", type: "function", language: "rust", signature: "async fn app_by_key(&self, app_key: &str) -> Result<VerificationAppRow, AppError>"}),
  (fn32:Function {name: "VerificationService::deliver_sms", type: "function", language: "rust", signature: "async fn deliver_sms(&self, recipient: &str, body: &str) -> Result<SmsDeliveryResult, AppError>"}),
  (fn33:Function {name: "VerificationService::send_twilio_sms", type: "function", language: "rust", signature: "async fn send_twilio_sms(&self, account_sid: &str, auth_token: &str, from_number: Option<&str>, messaging_service_sid: Option<&str>, recipient: &str, body: &str) -> Result<SmsDeliveryResult, AppError>"}),
  (fn34:Function {name: "VerificationService::update_outbox_delivery", type: "function", language: "rust", signature: "async fn update_outbox_delivery(&self, outbox_id: Uuid, result: &SmsDeliveryResult) -> Result<(), AppError>"}),
  (fn38:Function {name: "VerificationService::deliver_email", type: "function", language: "rust", signature: "async fn deliver_email(&self, recipient: &str, subject: &str, body: &str) -> Result<SmsDeliveryResult, AppError>"}),
  (fn39:Function {name: "VerificationService::send_smtp_email", type: "function", language: "rust", signature: "async fn send_smtp_email(&self, req: SmtpDeliveryRequest<'_>) -> Result<SmsDeliveryResult, AppError>"}),
  (fn9:Function {name: "VerificationConfig::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn10:Function {name: "load_verified_challenge_for_consumption", type: "function", language: "rust", signature: "async fn load_verified_challenge_for_consumption(tx: &mut Transaction<'_, Postgres>, app_key: &str, challenge_id: Uuid, token: &str, purpose: &str) -> Result<ChallengeRow, AppError>"}),
  (fn11:Function {name: "consume_challenge", type: "function", language: "rust", signature: "async fn consume_challenge(tx: &mut Transaction<'_, Postgres>, challenge_id: Uuid) -> Result<(), AppError>"}),
  (fn12:Function {name: "row_user", type: "function", language: "rust", signature: "fn row_user(row: VerificationUserRow) -> VerificationUserResponse"}),
  (fn13:Function {name: "password_hash", type: "function", language: "rust", signature: "fn password_hash(salt: &str, password: &str) -> String"}),
  (fn14:Function {name: "code_hash", type: "function", language: "rust", signature: "fn code_hash(salt: &str, code: &str) -> String"}),
  (fn15:Function {name: "generate_numeric_code", type: "function", language: "rust", signature: "fn generate_numeric_code(digits: usize) -> String"}),
  (fn16:Function {name: "generate_verification_token", type: "function", language: "rust", signature: "fn generate_verification_token() -> String"}),
  (fn17:Function {name: "normalize_app_key", type: "function", language: "rust", signature: "fn normalize_app_key(value: &str) -> Result<String, AppError>"}),
  (fn18:Function {name: "normalize_purpose", type: "function", language: "rust", signature: "fn normalize_purpose(value: &str) -> Result<String, AppError>"}),
  (fn19:Function {name: "normalize_channel", type: "function", language: "rust", signature: "fn normalize_channel(value: &str) -> Result<String, AppError>"}),
  (fn20:Function {name: "normalize_code", type: "function", language: "rust", signature: "fn normalize_code(value: &str) -> Result<String, AppError>"}),
  (fn21:Function {name: "normalize_username", type: "function", language: "rust", signature: "fn normalize_username(value: &str) -> Result<String, AppError>"}),
  (fn22:Function {name: "normalize_password", type: "function", language: "rust", signature: "fn normalize_password(value: &str, label: &str) -> Result<String, AppError>"}),
  (fn23:Function {name: "normalize_phone", type: "function", language: "rust", signature: "fn normalize_phone(value: &str) -> Result<String, AppError>"}),
  (fn24:Function {name: "normalize_email", type: "function", language: "rust", signature: "fn normalize_email(value: &str) -> Result<String, AppError>"}),
  (fn25:Function {name: "masked_target", type: "function", language: "rust", signature: "fn masked_target(channel: &str, target: &str) -> String"}),
  (fn26:Function {name: "masked_email", type: "function", language: "rust", signature: "fn masked_email(value: &str) -> String"}),
  (fn27:Function {name: "masked_suffix", type: "function", language: "rust", signature: "fn masked_suffix(value: &str) -> String"}),
  (fn28:Function {name: "purpose_label", type: "function", language: "rust", signature: "fn purpose_label(value: &str) -> &'static str"}),
  (fn29:Function {name: "parse_bool", type: "function", language: "rust", signature: "fn parse_bool(value: &str) -> bool"}),
  (fn30:Function {name: "is_unique_violation", type: "function", language: "rust", signature: "fn is_unique_violation(error: &sqlx::Error) -> bool"}),
  (fn31:Function {name: "hash_secret", type: "function", language: "rust", signature: "fn hash_secret(secret: &str) -> String"}),
  (fn35:Function {name: "SmsProviderConfig::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn36:Function {name: "SmsProviderConfig::name", type: "function", language: "rust", signature: "fn name(&self) -> &'static str"}),
  (fn37:Function {name: "optional_env", type: "function", language: "rust", signature: "fn optional_env(key: &str) -> Option<String>"}),
  (fn40:Function {name: "EmailProviderConfig::from_env", type: "function", language: "rust", signature: "fn from_env() -> Self"}),
  (fn41:Function {name: "EmailProviderConfig::name", type: "function", language: "rust", signature: "fn name(&self) -> &str"}),
  (fn42:Function {name: "tests::reset_email_env", type: "function", language: "rust", signature: "fn reset_email_env()"}),
  (fn43:Function {name: "tests::with_email_env", type: "function", language: "rust", signature: "fn with_email_env(run: impl FnOnce())"}),
  (fn44:Function {name: "tests::email_provider_config_supports_gmail_defaults", type: "function", language: "rust", signature: "fn email_provider_config_supports_gmail_defaults()"}),
  (fn45:Function {name: "tests::email_provider_auto_prefers_gmail", type: "function", language: "rust", signature: "fn email_provider_auto_prefers_gmail()"}),
  (fn46:Function {name: "tests::email_provider_config_supports_outlook_defaults", type: "function", language: "rust", signature: "fn email_provider_config_supports_outlook_defaults()"}),
  (fn47:Function {name: "tests::email_provider_auto_falls_back_to_local_outbox", type: "function", language: "rust", signature: "fn email_provider_auto_falls_back_to_local_outbox()"}),
  (v1:Variable {name: "pool", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (v3:Variable {name: "app_key", type: "variable"}),
  (v4:Variable {name: "challenge_id", type: "variable"}),
  (v5:Variable {name: "verification_token", type: "variable"}),
  (v6:Variable {name: "tests::ENV_MUTEX", type: "variable"}),
  (v7:Variable {name: "tests::EMAIL_ENV_KEYS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(mt),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn32),
  (c1)-[:HAS_METHOD]->(fn33),
  (c1)-[:HAS_METHOD]->(fn34),
  (c1)-[:HAS_METHOD]->(fn38),
  (c1)-[:HAS_METHOD]->(fn39),
  (c2)-[:HAS_METHOD]->(fn9),
  (c6)-[:HAS_METHOD]->(fn35),
  (c6)-[:HAS_METHOD]->(fn36),
  (c10)-[:HAS_METHOD]->(fn40),
  (c10)-[:HAS_METHOD]->(fn41),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn22),
  (m)-[:CONTAINS]->(fn23),
  (m)-[:CONTAINS]->(fn24),
  (m)-[:CONTAINS]->(fn25),
  (m)-[:CONTAINS]->(fn26),
  (m)-[:CONTAINS]->(fn27),
  (m)-[:CONTAINS]->(fn28),
  (m)-[:CONTAINS]->(fn29),
  (m)-[:CONTAINS]->(fn30),
  (m)-[:CONTAINS]->(fn37),
  (mt)-[:CONTAINS]->(fn42),
  (mt)-[:CONTAINS]->(fn43),
  (mt)-[:CONTAINS]->(fn44),
  (mt)-[:CONTAINS]->(fn45),
  (mt)-[:CONTAINS]->(fn46),
  (mt)-[:CONTAINS]->(fn47),
  (fn42)-[:USES]->(v7),
  (fn43)-[:USES]->(v6),
  (fn43)-[:CALLS]->(fn42),
  (fn44)-[:CALLS]->(fn43),
  (fn44)-[:CALLS]->(fn40),
  (fn45)-[:CALLS]->(fn43),
  (fn45)-[:CALLS]->(fn40),
  (fn46)-[:CALLS]->(fn43),
  (fn46)-[:CALLS]->(fn40),
  (fn47)-[:CALLS]->(fn43),
  (fn47)-[:CALLS]->(fn40),
  (fn1)-[:CALLS]->(fn9),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn8),
  (fn3)-[:CALLS]->(fn8),
  (fn3)-[:CALLS]->(fn17),
  (fn3)-[:CALLS]->(fn18),
  (fn3)-[:CALLS]->(fn19),
  (fn3)-[:CALLS]->(fn23),
  (fn3)-[:CALLS]->(fn24),
  (fn3)-[:CALLS]->(fn15),
  (fn3)-[:CALLS]->(fn14),
  (fn3)-[:CALLS]->(fn25),
  (fn3)-[:CALLS]->(fn28),
  (fn3)-[:CALLS]->(fn32),
  (fn3)-[:CALLS]->(fn38),
  (fn3)-[:CALLS]->(fn34),
  (fn4)-[:CALLS]->(fn20),
  (fn4)-[:CALLS]->(fn14),
  (fn4)-[:CALLS]->(fn16),
  (fn4)-[:CALLS]->(fn25),
  (fn5)-[:CALLS]->(fn17),
  (fn5)-[:CALLS]->(fn21),
  (fn5)-[:CALLS]->(fn22),
  (fn5)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn13),
  (fn5)-[:CALLS]->(fn23),
  (fn5)-[:CALLS]->(fn24),
  (fn5)-[:CALLS]->(fn11),
  (fn5)-[:CALLS]->(fn12),
  (fn5)-[:CALLS]->(fn30),
  (fn6)-[:CALLS]->(fn17),
  (fn6)-[:CALLS]->(fn21),
  (fn6)-[:CALLS]->(fn22),
  (fn6)-[:CALLS]->(fn10),
  (fn6)-[:CALLS]->(fn13),
  (fn6)-[:CALLS]->(fn11),
  (fn6)-[:CALLS]->(fn12),
  (fn8)-[:USES]->(v3),
  (fn10)-[:CALLS]->(fn13),
  (fn10)-[:USES]->(v3),
  (fn10)-[:USES]->(v4),
  (fn10)-[:USES]->(v5),
  (fn13)-[:CALLS]->(fn31),
  (fn14)-[:CALLS]->(fn20),
  (fn14)-[:CALLS]->(fn31),
  (fn24)-[:CALLS]->(fn20),
  (fn25)-[:CALLS]->(fn26),
  (fn25)-[:CALLS]->(fn27),
  (fn9)-[:CALLS]->(fn29),
  (fn9)-[:CALLS]->(fn35),
  (fn9)-[:CALLS]->(fn40),
  (fn32)-[:CALLS]->(fn33),
  (fn35)-[:CALLS]->(fn37),
  (fn38)-[:CALLS]->(fn39),
  (fn40)-[:CALLS]->(fn37);
```
*/

use std::env;

use chrono::{DateTime, Duration, Utc};
use lettre::{
    message::{header::ContentType, Mailbox},
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};
use serde::Deserialize;
use serde_json::Value;
use sqlx::{FromRow, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::verification::{
        ChangePasswordWithVerificationRequest, RegisterWithVerificationRequest,
        StartVerificationRequest, StartVerificationResponse, VerificationAppInfo,
        VerificationMutationResponse, VerificationOutboxItem, VerificationUserResponse,
        VerifyCodeRequest, VerifyCodeResponse,
    },
    services::auth_service::hash_secret,
};

const DEFAULT_APP_KEY: &str = "assetslake";
const DEFAULT_OWNER_EMAIL: &str = "hanakagumi@outlook.com";
const DEFAULT_SENDER_LABEL: &str = "AssetsLake";

#[derive(Clone)]
pub struct VerificationService {
    pool: PgPool,
    config: VerificationConfig,
    http_client: reqwest::Client,
}

#[derive(Debug, Clone)]
struct VerificationConfig {
    default_app_key: String,
    owner_email: String,
    sender_email: String,
    sms_sender_label: String,
    code_digits: usize,
    code_ttl_seconds: i64,
    dev_code_visible: bool,
    sms_provider: SmsProviderConfig,
    email_provider: EmailProviderConfig,
}

#[derive(Debug, FromRow)]
struct VerificationAppRow {
    id: Uuid,
    app_key: String,
    name: String,
    owner_email: String,
    sender_email: String,
    sms_sender_label: String,
}

#[derive(Debug, FromRow)]
struct ChallengeRow {
    id: Uuid,
    purpose: String,
    channel: String,
    phone_number: Option<String>,
    email: Option<String>,
    code_salt: String,
    code_hash: String,
    verification_token_hash: Option<String>,
    attempts: i32,
    expires_at: DateTime<Utc>,
    verified_at: Option<DateTime<Utc>>,
    consumed_at: Option<DateTime<Utc>>,
    locked_at: Option<DateTime<Utc>>,
}

#[derive(Debug, FromRow)]
struct VerificationUserRow {
    id: Uuid,
    username: String,
    display_name: Option<String>,
    email: Option<String>,
    phone_number: Option<String>,
    role: String,
}

#[derive(Debug, Clone)]
enum SmsProviderConfig {
    LocalOutbox,
    Misconfigured {
        provider: String,
        message: String,
    },
    Twilio {
        account_sid: String,
        auth_token: String,
        from_number: Option<String>,
        messaging_service_sid: Option<String>,
    },
}

#[derive(Debug, Clone)]
struct SmsDeliveryResult {
    provider: String,
    status: String,
    provider_message_id: Option<String>,
    error_message: Option<String>,
}

#[derive(Debug, Deserialize)]
struct TwilioMessageResponse {
    sid: Option<String>,
    status: Option<String>,
    error_message: Option<String>,
}

#[derive(Debug, Deserialize)]
struct TwilioErrorResponse {
    code: Option<i64>,
    message: Option<String>,
}

#[derive(Debug, Clone)]
enum EmailProviderConfig {
    LocalOutbox,
    Misconfigured {
        provider: String,
        message: String,
    },
    Smtp {
        provider: String,
        host: String,
        port: u16,
        username: String,
        password: String,
        from_email: String,
        from_name: Option<String>,
    },
}

struct SmtpDeliveryRequest<'a> {
    provider: &'a str,
    host: &'a str,
    port: u16,
    username: &'a str,
    password: &'a str,
    from_email: &'a str,
    from_name: Option<&'a str>,
    recipient: &'a str,
    subject: &'a str,
    body: &'a str,
}

impl VerificationService {
    pub fn new(pool: PgPool) -> Self {
        Self {
            pool,
            config: VerificationConfig::from_env(),
            http_client: reqwest::Client::new(),
        }
    }

    pub async fn app_info(&self) -> Result<VerificationAppInfo, AppError> {
        let app = self.app_by_key(&self.config.default_app_key).await?;
        Ok(VerificationAppInfo {
            app_key: app.app_key,
            name: app.name,
            owner_email: app.owner_email,
            sender_email: app.sender_email,
            sms_sender_label: app.sms_sender_label,
            dev_code_visible: self.config.dev_code_visible,
        })
    }

    pub async fn start_challenge(
        &self,
        req: StartVerificationRequest,
    ) -> Result<StartVerificationResponse, AppError> {
        let app_key = normalize_app_key(
            req.app_key
                .as_deref()
                .unwrap_or(self.config.default_app_key.as_str()),
        )?;
        let app = self.app_by_key(&app_key).await?;
        let purpose = normalize_purpose(&req.purpose)?;
        let channel = normalize_channel(req.channel.as_deref().unwrap_or(
            if req.phone_number.is_some() {
                "sms"
            } else {
                "email"
            },
        ))?;

        let (phone_number, email, target) = if channel == "sms" {
            let phone = normalize_phone(req.phone_number.as_deref().ok_or_else(|| {
                AppError::validation("Phone number is required for SMS verification")
            })?)?;
            (Some(phone.clone()), None, phone)
        } else {
            let email = normalize_email(req.email.as_deref().ok_or_else(|| {
                AppError::validation("Email is required for email verification")
            })?)?;
            (None, Some(email.clone()), email)
        };

        let code = generate_numeric_code(self.config.code_digits);
        let code_salt = Uuid::new_v4().simple().to_string();
        let code_hash = code_hash(&code_salt, &code);
        let target_hash = hash_secret(&format!("{}:{}:{}:{}", app.id, purpose, channel, target));
        let expires_at = Utc::now() + Duration::seconds(self.config.code_ttl_seconds);
        let metadata = req.metadata.unwrap_or(Value::Object(Default::default()));

        let challenge_id = Uuid::new_v4();
        sqlx::query(
            r#"
            INSERT INTO verification_challenges (
                id, app_id, purpose, channel, phone_number, email, target_hash,
                code_salt, code_hash, expires_at, client_ref, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            "#,
        )
        .bind(challenge_id)
        .bind(app.id)
        .bind(&purpose)
        .bind(&channel)
        .bind(&phone_number)
        .bind(&email)
        .bind(target_hash)
        .bind(&code_salt)
        .bind(&code_hash)
        .bind(expires_at)
        .bind(req.client_ref)
        .bind(metadata)
        .execute(&self.pool)
        .await?;

        let masked_target = masked_target(&channel, &target);
        let body = if channel == "sms" {
            format!(
                "【{}】验证码 {}，用于{}，{} 分钟内有效。",
                app.sms_sender_label,
                code,
                purpose_label(&purpose),
                (self.config.code_ttl_seconds / 60).max(1)
            )
        } else {
            format!(
                "{} verification code: {}. Purpose: {}. Expires in {} minutes.",
                app.name,
                code,
                purpose_label(&purpose),
                (self.config.code_ttl_seconds / 60).max(1)
            )
        };
        let subject = (channel == "email").then(|| format!("{} verification code", app.name));
        let provider = if channel == "sms" {
            self.config.sms_provider.name()
        } else {
            self.config.email_provider.name()
        };

        let outbox_id = Uuid::new_v4();
        sqlx::query(
            r#"
            INSERT INTO verification_outbox (
                id, app_id, challenge_id, channel, provider, recipient, recipient_masked,
                subject, body, status, sent_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'queued', NULL)
            "#,
        )
        .bind(outbox_id)
        .bind(app.id)
        .bind(challenge_id)
        .bind(&channel)
        .bind(provider)
        .bind(&target)
        .bind(&masked_target)
        .bind(&subject)
        .bind(&body)
        .execute(&self.pool)
        .await?;

        let delivery = match channel.as_str() {
            "sms" => match self.deliver_sms(&target, &body).await {
                Ok(result) => result,
                Err(error) => {
                    let failed = SmsDeliveryResult {
                        provider: self.config.sms_provider.name().to_string(),
                        status: "failed".to_string(),
                        provider_message_id: None,
                        error_message: Some(error.to_string()),
                    };
                    self.update_outbox_delivery(outbox_id, &failed).await?;
                    return Err(error);
                }
            },
            "email" => match self
                .deliver_email(
                    &target,
                    subject.as_deref().unwrap_or("Verification code"),
                    &body,
                )
                .await
            {
                Ok(result) => result,
                Err(error) => {
                    let failed = SmsDeliveryResult {
                        provider: self.config.email_provider.name().to_string(),
                        status: "failed".to_string(),
                        provider_message_id: None,
                        error_message: Some(error.to_string()),
                    };
                    self.update_outbox_delivery(outbox_id, &failed).await?;
                    return Err(error);
                }
            },
            _ => SmsDeliveryResult {
                provider: "local-outbox".to_string(),
                status: "queued".to_string(),
                provider_message_id: None,
                error_message: None,
            },
        };
        self.update_outbox_delivery(outbox_id, &delivery).await?;

        Ok(StartVerificationResponse {
            challenge_id,
            app_key,
            purpose,
            channel,
            masked_target,
            expires_at,
            delivery_status: delivery.status,
            dev_code: self.config.dev_code_visible.then_some(code),
        })
    }

    pub async fn verify_code(
        &self,
        challenge_id: Uuid,
        req: VerifyCodeRequest,
    ) -> Result<VerifyCodeResponse, AppError> {
        let code = normalize_code(&req.code)?;
        let mut tx = self.pool.begin().await?;
        let row = sqlx::query_as::<_, ChallengeRow>(
            r#"
            SELECT
                c.id, c.purpose, c.channel, c.phone_number, c.email,
                c.code_salt, c.code_hash, c.verification_token_hash, c.attempts,
                c.expires_at, c.verified_at, c.consumed_at, c.locked_at
            FROM verification_challenges c
            JOIN verification_apps a ON a.id = c.app_id
            WHERE c.id = $1 AND a.is_active = TRUE
            FOR UPDATE
            "#,
        )
        .bind(challenge_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found("Verification challenge not found"))?;

        if row.consumed_at.is_some() {
            return Err(AppError::conflict(
                "Verification challenge has already been consumed",
            ));
        }
        if row.locked_at.is_some() {
            return Err(AppError::conflict("Verification challenge is locked"));
        }
        if row.verified_at.is_some() {
            return Err(AppError::conflict(
                "Verification challenge is already verified",
            ));
        }
        if row.expires_at <= Utc::now() {
            return Err(AppError::validation("Verification challenge has expired"));
        }

        if code_hash(&row.code_salt, &code) != row.code_hash {
            let attempts = row.attempts + 1;
            sqlx::query(
                r#"
                UPDATE verification_challenges
                SET attempts = $2,
                    locked_at = CASE WHEN $2 >= max_attempts THEN NOW() ELSE locked_at END
                WHERE id = $1
                "#,
            )
            .bind(row.id)
            .bind(attempts)
            .execute(&mut *tx)
            .await?;
            tx.commit().await?;
            return Err(AppError::validation("Verification code is invalid"));
        }

        let token = generate_verification_token();
        let token_hash = hash_secret(&token);
        sqlx::query(
            r#"
            UPDATE verification_challenges
            SET verified_at = NOW(), verification_token_hash = $2
            WHERE id = $1
            "#,
        )
        .bind(row.id)
        .bind(&token_hash)
        .execute(&mut *tx)
        .await?;
        tx.commit().await?;

        let target = row
            .phone_number
            .as_deref()
            .or(row.email.as_deref())
            .unwrap_or("");
        Ok(VerifyCodeResponse {
            challenge_id: row.id,
            purpose: row.purpose,
            verified: true,
            masked_target: masked_target(&row.channel, target),
            verification_token: token,
            expires_at: row.expires_at,
        })
    }

    pub async fn register(
        &self,
        req: RegisterWithVerificationRequest,
    ) -> Result<VerificationMutationResponse, AppError> {
        let app_key = normalize_app_key(
            req.app_key
                .as_deref()
                .unwrap_or(self.config.default_app_key.as_str()),
        )?;
        let username = normalize_username(&req.username)?;
        let password = normalize_password(&req.password, "Password")?;
        let mut tx = self.pool.begin().await?;
        let challenge = load_verified_challenge_for_consumption(
            &mut tx,
            &app_key,
            req.challenge_id,
            &req.verification_token,
            "registration",
        )
        .await?;

        let phone_number = match (
            req.phone_number.as_deref(),
            challenge.phone_number.as_deref(),
        ) {
            (Some(value), Some(challenge_value)) => {
                let phone = normalize_phone(value)?;
                if phone != challenge_value {
                    return Err(AppError::validation(
                        "Phone number does not match verification challenge",
                    ));
                }
                Some(phone)
            }
            (Some(value), None) => Some(normalize_phone(value)?),
            (None, Some(value)) => Some(value.to_string()),
            (None, None) => None,
        };
        let email = match (req.email.as_deref(), challenge.email.as_deref()) {
            (Some(value), Some(challenge_value)) => {
                let email = normalize_email(value)?;
                if email != challenge_value {
                    return Err(AppError::validation(
                        "Email does not match verification challenge",
                    ));
                }
                Some(email)
            }
            (Some(value), None) => Some(normalize_email(value)?),
            (None, Some(value)) => Some(value.to_string()),
            (None, None) => None,
        };

        let salt = Uuid::new_v4().simple().to_string();
        let password_hash = password_hash(&salt, &password);
        let display_name = req
            .display_name
            .and_then(|value| (!value.trim().is_empty()).then(|| value.trim().to_string()));

        let user = match sqlx::query_as::<_, VerificationUserRow>(
            r#"
            INSERT INTO users (
                username, display_name, email, phone_number, role, password_salt, password_hash
            )
            VALUES ($1, $2, $3, $4, 'artist', $5, $6)
            RETURNING id, username, display_name, email, phone_number, role
            "#,
        )
        .bind(&username)
        .bind(display_name)
        .bind(email)
        .bind(phone_number)
        .bind(salt)
        .bind(password_hash)
        .fetch_one(&mut *tx)
        .await
        {
            Ok(row) => row,
            Err(error) if is_unique_violation(&error) => {
                return Err(AppError::conflict(
                    "Username, email, or phone number already exists",
                ));
            }
            Err(error) => return Err(error.into()),
        };

        consume_challenge(&mut tx, challenge.id).await?;
        tx.commit().await?;

        Ok(VerificationMutationResponse {
            success: true,
            user: Some(row_user(user)),
        })
    }

    pub async fn change_password(
        &self,
        req: ChangePasswordWithVerificationRequest,
    ) -> Result<VerificationMutationResponse, AppError> {
        let app_key = normalize_app_key(
            req.app_key
                .as_deref()
                .unwrap_or(self.config.default_app_key.as_str()),
        )?;
        let username = normalize_username(&req.username)?;
        let password = normalize_password(&req.new_password, "New password")?;
        let mut tx = self.pool.begin().await?;
        let challenge = load_verified_challenge_for_consumption(
            &mut tx,
            &app_key,
            req.challenge_id,
            &req.verification_token,
            "password_change",
        )
        .await?;

        let user = sqlx::query_as::<_, VerificationUserRow>(
            r#"
            SELECT id, username, display_name, email, phone_number, role
            FROM users
            WHERE lower(username) = lower($1) AND deleted_at IS NULL
            FOR UPDATE
            "#,
        )
        .bind(&username)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::not_found("User not found"))?;

        if let Some(phone) = challenge.phone_number.as_deref() {
            if user.phone_number.as_deref() != Some(phone) {
                return Err(AppError::validation(
                    "Verification phone number does not match account",
                ));
            }
        }
        if let Some(email) = challenge.email.as_deref() {
            if user
                .email
                .as_deref()
                .map(|value| value.to_ascii_lowercase())
                != Some(email.to_string())
            {
                return Err(AppError::validation(
                    "Verification email does not match account",
                ));
            }
        }

        let salt = Uuid::new_v4().simple().to_string();
        let password_hash = password_hash(&salt, &password);
        sqlx::query(
            r#"
            UPDATE users
            SET password_salt = $2, password_hash = $3, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(user.id)
        .bind(salt)
        .bind(password_hash)
        .execute(&mut *tx)
        .await?;

        consume_challenge(&mut tx, challenge.id).await?;
        tx.commit().await?;

        Ok(VerificationMutationResponse {
            success: true,
            user: Some(row_user(user)),
        })
    }

    pub async fn list_outbox(
        &self,
        limit: Option<i64>,
    ) -> Result<Vec<VerificationOutboxItem>, AppError> {
        let limit = limit.unwrap_or(25).clamp(1, 100);
        let rows = sqlx::query_as::<_, VerificationOutboxItem>(
            r#"
            SELECT
                o.id, o.challenge_id, a.app_key, o.channel, o.provider,
                o.recipient_masked, o.subject, o.body, o.status, o.created_at, o.sent_at
            FROM verification_outbox o
            JOIN verification_apps a ON a.id = o.app_id
            ORDER BY o.created_at DESC
            LIMIT $1
            "#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows)
    }

    async fn app_by_key(&self, app_key: &str) -> Result<VerificationAppRow, AppError> {
        let app = sqlx::query_as::<_, VerificationAppRow>(
            r#"
            INSERT INTO verification_apps (app_key, name, owner_email, sender_email, sms_sender_label)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (app_key) DO UPDATE SET
                owner_email = COALESCE(NULLIF(verification_apps.owner_email, ''), EXCLUDED.owner_email),
                sender_email = COALESCE(NULLIF(verification_apps.sender_email, ''), EXCLUDED.sender_email),
                sms_sender_label = COALESCE(NULLIF(verification_apps.sms_sender_label, ''), EXCLUDED.sms_sender_label),
                is_active = TRUE,
                updated_at = NOW()
            RETURNING id, app_key, name, owner_email, sender_email, sms_sender_label
            "#,
        )
        .bind(app_key)
        .bind(format!("{} Verification", app_key))
        .bind(&self.config.owner_email)
        .bind(&self.config.sender_email)
        .bind(&self.config.sms_sender_label)
        .fetch_one(&self.pool)
        .await?;
        Ok(app)
    }

    async fn deliver_sms(
        &self,
        recipient: &str,
        body: &str,
    ) -> Result<SmsDeliveryResult, AppError> {
        match &self.config.sms_provider {
            SmsProviderConfig::LocalOutbox => Ok(SmsDeliveryResult {
                provider: "local-outbox".to_string(),
                status: "queued".to_string(),
                provider_message_id: None,
                error_message: None,
            }),
            SmsProviderConfig::Misconfigured { message, .. } => {
                Err(AppError::validation(message.clone()))
            }
            SmsProviderConfig::Twilio {
                account_sid,
                auth_token,
                from_number,
                messaging_service_sid,
            } => {
                self.send_twilio_sms(
                    account_sid,
                    auth_token,
                    from_number.as_deref(),
                    messaging_service_sid.as_deref(),
                    recipient,
                    body,
                )
                .await
            }
        }
    }

    async fn send_twilio_sms(
        &self,
        account_sid: &str,
        auth_token: &str,
        from_number: Option<&str>,
        messaging_service_sid: Option<&str>,
        recipient: &str,
        body: &str,
    ) -> Result<SmsDeliveryResult, AppError> {
        if from_number.is_none() && messaging_service_sid.is_none() {
            return Err(AppError::validation(
                "Twilio requires TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID",
            ));
        }

        let url = format!("https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json");
        let mut params = vec![("To", recipient.to_string()), ("Body", body.to_string())];
        if let Some(service_sid) = messaging_service_sid {
            params.push(("MessagingServiceSid", service_sid.to_string()));
        } else if let Some(from) = from_number {
            params.push(("From", from.to_string()));
        }

        let response = self
            .http_client
            .post(url)
            .basic_auth(account_sid, Some(auth_token))
            .form(&params)
            .send()
            .await
            .map_err(|error| AppError::storage(format!("Twilio SMS request failed: {error}")))?;

        let status_code = response.status();
        let body_text = response
            .text()
            .await
            .map_err(|error| AppError::storage(format!("Twilio SMS response failed: {error}")))?;

        if !status_code.is_success() {
            let parsed = serde_json::from_str::<TwilioErrorResponse>(&body_text).ok();
            let message = parsed
                .and_then(|value| {
                    value.message.map(|message| match value.code {
                        Some(code) => format!("{message} ({code})"),
                        None => message,
                    })
                })
                .unwrap_or_else(|| body_text.chars().take(240).collect());
            return Err(AppError::storage(format!(
                "Twilio SMS delivery failed ({status_code}): {message}"
            )));
        }

        let parsed = serde_json::from_str::<TwilioMessageResponse>(&body_text).ok();
        Ok(SmsDeliveryResult {
            provider: "twilio".to_string(),
            status: parsed
                .as_ref()
                .and_then(|value| value.status.clone())
                .unwrap_or_else(|| "sent".to_string()),
            provider_message_id: parsed.as_ref().and_then(|value| value.sid.clone()),
            error_message: parsed.and_then(|value| value.error_message),
        })
    }

    async fn update_outbox_delivery(
        &self,
        outbox_id: Uuid,
        result: &SmsDeliveryResult,
    ) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE verification_outbox
            SET provider = $2,
                status = $3,
                provider_message_id = $4,
                error_message = $5,
                sent_at = CASE WHEN $4 IS NOT NULL AND $5 IS NULL THEN NOW() ELSE sent_at END
            WHERE id = $1
            "#,
        )
        .bind(outbox_id)
        .bind(&result.provider)
        .bind(&result.status)
        .bind(&result.provider_message_id)
        .bind(&result.error_message)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn deliver_email(
        &self,
        recipient: &str,
        subject: &str,
        body: &str,
    ) -> Result<SmsDeliveryResult, AppError> {
        match &self.config.email_provider {
            EmailProviderConfig::LocalOutbox => Ok(SmsDeliveryResult {
                provider: "local-outbox".to_string(),
                status: "queued".to_string(),
                provider_message_id: None,
                error_message: None,
            }),
            EmailProviderConfig::Misconfigured { message, .. } => {
                Err(AppError::validation(message.clone()))
            }
            EmailProviderConfig::Smtp {
                provider,
                host,
                port,
                username,
                password,
                from_email,
                from_name,
            } => {
                self.send_smtp_email(SmtpDeliveryRequest {
                    provider,
                    host,
                    port: *port,
                    username,
                    password,
                    from_email,
                    from_name: from_name.as_deref(),
                    recipient,
                    subject,
                    body,
                })
                .await
            }
        }
    }

    async fn send_smtp_email(
        &self,
        req: SmtpDeliveryRequest<'_>,
    ) -> Result<SmsDeliveryResult, AppError> {
        let from_mailbox = Mailbox::new(
            req.from_name.map(str::to_string),
            req.from_email.parse().map_err(|error| {
                AppError::validation(format!("SMTP from email is invalid: {error}"))
            })?,
        );
        let to_mailbox = Mailbox::new(
            None,
            req.recipient.parse().map_err(|error| {
                AppError::validation(format!("Recipient email is invalid: {error}"))
            })?,
        );
        let email = Message::builder()
            .from(from_mailbox)
            .to(to_mailbox)
            .subject(req.subject)
            .header(ContentType::TEXT_PLAIN)
            .body(req.body.to_string())
            .map_err(|error| AppError::internal(format!("SMTP email build failed: {error}")))?;
        let mailer = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(req.host)
            .map_err(|error| AppError::validation(format!("SMTP relay config failed: {error}")))?
            .port(req.port)
            .credentials(Credentials::new(
                req.username.to_string(),
                req.password.to_string(),
            ))
            .build();

        mailer
            .send(email)
            .await
            .map_err(|error| AppError::storage(format!("SMTP email delivery failed: {error}")))?;

        Ok(SmsDeliveryResult {
            provider: req.provider.to_string(),
            status: "sent".to_string(),
            provider_message_id: None,
            error_message: None,
        })
    }
}

impl VerificationConfig {
    fn from_env() -> Self {
        let code_digits = env::var("VERIFICATION_CODE_DIGITS")
            .ok()
            .and_then(|value| value.parse::<usize>().ok())
            .unwrap_or(6)
            .clamp(4, 8);
        let code_ttl_seconds = env::var("VERIFICATION_CODE_TTL_SECONDS")
            .ok()
            .and_then(|value| value.parse::<i64>().ok())
            .unwrap_or(300)
            .clamp(60, 3600);
        let sms_provider = SmsProviderConfig::from_env();
        let email_provider = EmailProviderConfig::from_env();
        let dev_code_visible = env::var("VERIFICATION_DEV_CODE_VISIBLE")
            .map(|value| parse_bool(&value))
            .unwrap_or(
                matches!(sms_provider, SmsProviderConfig::LocalOutbox)
                    && matches!(email_provider, EmailProviderConfig::LocalOutbox),
            );

        Self {
            default_app_key: env::var("VERIFICATION_APP_KEY")
                .unwrap_or_else(|_| DEFAULT_APP_KEY.to_string()),
            owner_email: env::var("VERIFICATION_OWNER_EMAIL")
                .unwrap_or_else(|_| DEFAULT_OWNER_EMAIL.to_string()),
            sender_email: env::var("VERIFICATION_EMAIL_FROM")
                .unwrap_or_else(|_| DEFAULT_OWNER_EMAIL.to_string()),
            sms_sender_label: env::var("VERIFICATION_SMS_SENDER")
                .unwrap_or_else(|_| DEFAULT_SENDER_LABEL.to_string()),
            code_digits,
            code_ttl_seconds,
            dev_code_visible,
            sms_provider,
            email_provider,
        }
    }
}

impl SmsProviderConfig {
    fn from_env() -> Self {
        let provider = env::var("VERIFICATION_SMS_PROVIDER")
            .unwrap_or_else(|_| "local".to_string())
            .trim()
            .to_ascii_lowercase();
        match provider.as_str() {
            "twilio" => {
                let account_sid = optional_env("TWILIO_ACCOUNT_SID");
                let auth_token = optional_env("TWILIO_AUTH_TOKEN");
                match (account_sid, auth_token) {
                    (Some(account_sid), Some(auth_token)) => SmsProviderConfig::Twilio {
                        account_sid,
                        auth_token,
                        from_number: optional_env("TWILIO_FROM_NUMBER"),
                        messaging_service_sid: optional_env("TWILIO_MESSAGING_SERVICE_SID"),
                    },
                    _ => SmsProviderConfig::Misconfigured {
                        provider: "twilio".to_string(),
                        message: "Twilio requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN"
                            .to_string(),
                    },
                }
            }
            _ => SmsProviderConfig::LocalOutbox,
        }
    }

    fn name(&self) -> &str {
        match self {
            SmsProviderConfig::LocalOutbox => "local-outbox",
            SmsProviderConfig::Misconfigured { provider, .. } => provider.as_str(),
            SmsProviderConfig::Twilio { .. } => "twilio",
        }
    }
}

async fn load_verified_challenge_for_consumption(
    tx: &mut Transaction<'_, Postgres>,
    app_key: &str,
    challenge_id: Uuid,
    token: &str,
    purpose: &str,
) -> Result<ChallengeRow, AppError> {
    let row = sqlx::query_as::<_, ChallengeRow>(
        r#"
        SELECT
            c.id, c.purpose, c.channel, c.phone_number, c.email,
            c.code_salt, c.code_hash, c.verification_token_hash, c.attempts,
            c.expires_at, c.verified_at, c.consumed_at, c.locked_at
        FROM verification_challenges c
        JOIN verification_apps a ON a.id = c.app_id
        WHERE c.id = $1 AND a.app_key = $2 AND c.purpose = $3 AND a.is_active = TRUE
        FOR UPDATE
        "#,
    )
    .bind(challenge_id)
    .bind(app_key)
    .bind(purpose)
    .fetch_optional(&mut **tx)
    .await?
    .ok_or_else(|| AppError::not_found("Verification challenge not found"))?;

    if row.consumed_at.is_some() {
        return Err(AppError::conflict(
            "Verification challenge has already been consumed",
        ));
    }
    if row.locked_at.is_some() {
        return Err(AppError::conflict("Verification challenge is locked"));
    }
    if row.verified_at.is_none() {
        return Err(AppError::validation(
            "Verification challenge is not verified",
        ));
    }
    if row.expires_at <= Utc::now() {
        return Err(AppError::validation("Verification challenge has expired"));
    }
    let token_hash = hash_secret(token);
    if row.verification_token_hash.as_deref() != Some(token_hash.as_str()) {
        return Err(AppError::unauthorized("Verification token is invalid"));
    }

    Ok(row)
}

async fn consume_challenge(
    tx: &mut Transaction<'_, Postgres>,
    challenge_id: Uuid,
) -> Result<(), AppError> {
    sqlx::query("UPDATE verification_challenges SET consumed_at = NOW() WHERE id = $1")
        .bind(challenge_id)
        .execute(&mut **tx)
        .await?;
    Ok(())
}

fn row_user(row: VerificationUserRow) -> VerificationUserResponse {
    VerificationUserResponse {
        id: row.id,
        username: row.username,
        display_name: row.display_name,
        email: row.email,
        phone_number: row.phone_number,
        role: row.role,
    }
}

fn password_hash(salt: &str, password: &str) -> String {
    hash_secret(&format!("{}:{}", salt, password))
}

fn code_hash(salt: &str, code: &str) -> String {
    hash_secret(&format!(
        "{}:{}",
        salt,
        normalize_code(code).unwrap_or_else(|_| code.to_string())
    ))
}

fn generate_numeric_code(digits: usize) -> String {
    let width = digits.clamp(4, 8);
    let modulus = 10_u128.pow(width as u32);
    let value = Uuid::new_v4().as_u128() % modulus;
    format!("{value:0width$}")
}

fn generate_verification_token() -> String {
    format!(
        "vfy_{}_{}",
        Uuid::new_v4().simple(),
        Uuid::new_v4().simple()
    )
}

fn normalize_app_key(value: &str) -> Result<String, AppError> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty()
        || value.len() > 128
        || !value
            .chars()
            .all(|item| item.is_ascii_alphanumeric() || item == '-' || item == '_')
    {
        return Err(AppError::validation(
            "App key must use letters, numbers, dash, or underscore",
        ));
    }
    Ok(value)
}

fn normalize_purpose(value: &str) -> Result<String, AppError> {
    match value.trim().to_ascii_lowercase().replace('-', "_").as_str() {
        "registration" | "register" | "signup" => Ok("registration".to_string()),
        "password_change" | "change_password" | "reset_password" => {
            Ok("password_change".to_string())
        }
        _ => Err(AppError::validation(
            "Purpose must be registration or password_change",
        )),
    }
}

fn normalize_channel(value: &str) -> Result<String, AppError> {
    match value.trim().to_ascii_lowercase().as_str() {
        "sms" => Ok("sms".to_string()),
        "email" => Ok("email".to_string()),
        _ => Err(AppError::validation("Channel must be sms or email")),
    }
}

fn normalize_code(value: &str) -> Result<String, AppError> {
    let code: String = value.chars().filter(|item| item.is_ascii_digit()).collect();
    if !(4..=8).contains(&code.len()) {
        return Err(AppError::validation(
            "Verification code must be 4 to 8 digits",
        ));
    }
    Ok(code)
}

fn normalize_username(value: &str) -> Result<String, AppError> {
    let value = value.trim().to_ascii_lowercase();
    if value.len() < 3
        || value.len() > 64
        || !value
            .chars()
            .all(|item| item.is_ascii_alphanumeric() || item == '.' || item == '_' || item == '-')
    {
        return Err(AppError::validation(
            "Username must be 3 to 64 characters and use letters, numbers, dot, dash, or underscore",
        ));
    }
    Ok(value)
}

fn normalize_password(value: &str, label: &str) -> Result<String, AppError> {
    if value.len() < 8 {
        return Err(AppError::validation(format!(
            "{label} must be at least 8 characters"
        )));
    }
    Ok(value.to_string())
}

fn normalize_phone(value: &str) -> Result<String, AppError> {
    let compact: String = value
        .trim()
        .chars()
        .filter(|item| item.is_ascii_digit() || *item == '+')
        .collect();
    let plus_count = compact.chars().filter(|item| *item == '+').count();
    let digit_count = compact.chars().filter(|item| item.is_ascii_digit()).count();
    if compact.is_empty()
        || plus_count > 1
        || (plus_count == 1 && !compact.starts_with('+'))
        || !(8..=18).contains(&digit_count)
    {
        return Err(AppError::validation("Phone number format is invalid"));
    }
    Ok(compact)
}

fn normalize_email(value: &str) -> Result<String, AppError> {
    let value = value.trim().to_ascii_lowercase();
    if value.len() < 5 || value.len() > 256 || !value.contains('@') || value.ends_with('@') {
        return Err(AppError::validation("Email format is invalid"));
    }
    Ok(value)
}

fn masked_target(channel: &str, target: &str) -> String {
    if channel == "email" {
        masked_email(target)
    } else {
        masked_suffix(target)
    }
}

fn masked_email(value: &str) -> String {
    let Some((name, domain)) = value.split_once('@') else {
        return masked_suffix(value);
    };
    let head = name.chars().next().unwrap_or('*');
    format!("{head}***@{domain}")
}

fn masked_suffix(value: &str) -> String {
    let suffix_rev: String = value.chars().rev().take(4).collect();
    let suffix: String = suffix_rev.chars().rev().collect();
    format!("***{suffix}")
}

fn purpose_label(value: &str) -> &'static str {
    match value {
        "registration" => "注册",
        "password_change" => "修改密码",
        _ => "验证",
    }
}

fn parse_bool(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "1" | "true" | "yes" | "on"
    )
}

impl EmailProviderConfig {
    fn from_env() -> Self {
        let provider = env::var("VERIFICATION_EMAIL_PROVIDER")
            .unwrap_or_else(|_| "auto".to_string())
            .trim()
            .to_ascii_lowercase();
        let build_smtp = |provider: &str,
                          host: String,
                          port: u16,
                          username: Option<String>,
                          password: Option<String>,
                          from_email: Option<String>,
                          from_name: Option<String>|
         -> Option<EmailProviderConfig> {
            let from_email = from_email.or_else(|| username.clone());
            match (username, password, from_email) {
                (Some(username), Some(password), Some(from_email)) => {
                    Some(EmailProviderConfig::Smtp {
                        provider: provider.to_string(),
                        host,
                        port,
                        username,
                        password,
                        from_email,
                        from_name,
                    })
                }
                _ => None,
            }
        };
        let gmail = || {
            build_smtp(
                "gmail",
                optional_env("GMAIL_SMTP_HOST").unwrap_or_else(|| "smtp.gmail.com".to_string()),
                env::var("GMAIL_SMTP_PORT")
                    .ok()
                    .and_then(|value| value.parse::<u16>().ok())
                    .unwrap_or(587),
                optional_env("GMAIL_SMTP_USERNAME")
                    .or_else(|| optional_env("GMAIL_SMTP_USER"))
                    .or_else(|| optional_env("GMAIL_USERNAME"))
                    .or_else(|| optional_env("SMTP_USER")),
                optional_env("GMAIL_SMTP_PASSWORD")
                    .or_else(|| optional_env("GMAIL_SMTP_PASS"))
                    .or_else(|| optional_env("GMAIL_APP_PASSWORD"))
                    .or_else(|| optional_env("GMAIL_PASSWORD"))
                    .or_else(|| optional_env("SMTP_PASS")),
                optional_env("GMAIL_SMTP_FROM_EMAIL"),
                optional_env("GMAIL_SMTP_FROM_NAME").or_else(|| optional_env("SMTP_FROM_NAME")),
            )
        };
        let outlook = || {
            build_smtp(
                "outlook",
                optional_env("OUTLOOK_SMTP_HOST")
                    .unwrap_or_else(|| "smtp-mail.outlook.com".to_string()),
                env::var("OUTLOOK_SMTP_PORT")
                    .ok()
                    .and_then(|value| value.parse::<u16>().ok())
                    .unwrap_or(587),
                optional_env("OUTLOOK_SMTP_USERNAME")
                    .or_else(|| optional_env("OUTLOOK_SMTP_USER"))
                    .or_else(|| optional_env("OUTLOOK_USERNAME"))
                    .or_else(|| optional_env("SMTP_USERNAME"))
                    .or_else(|| optional_env("SMTP_USER")),
                optional_env("OUTLOOK_SMTP_PASSWORD")
                    .or_else(|| optional_env("OUTLOOK_SMTP_PASS"))
                    .or_else(|| optional_env("OUTLOOK_APP_PASSWORD"))
                    .or_else(|| optional_env("OUTLOOK_PASSWORD"))
                    .or_else(|| optional_env("SMTP_PASSWORD"))
                    .or_else(|| optional_env("SMTP_PASS")),
                optional_env("OUTLOOK_SMTP_FROM_EMAIL").or_else(|| optional_env("SMTP_FROM_EMAIL")),
                optional_env("OUTLOOK_SMTP_FROM_NAME").or_else(|| optional_env("SMTP_FROM_NAME")),
            )
        };
        let custom_smtp = || {
            let host = optional_env("SMTP_HOST");
            let username = optional_env("SMTP_USERNAME").or_else(|| optional_env("SMTP_USER"));
            let password = optional_env("SMTP_PASSWORD").or_else(|| optional_env("SMTP_PASS"));
            let from_email = optional_env("SMTP_FROM_EMAIL");
            host.and_then(|host| {
                build_smtp(
                    "smtp",
                    host,
                    env::var("SMTP_PORT")
                        .ok()
                        .and_then(|value| value.parse::<u16>().ok())
                        .unwrap_or(587),
                    username,
                    password,
                    from_email,
                    optional_env("SMTP_FROM_NAME"),
                )
            })
        };
        match provider.as_str() {
            "gmail" => gmail().unwrap_or_else(|| EmailProviderConfig::Misconfigured {
                provider: "gmail".to_string(),
                message: "Gmail requires GMAIL_SMTP_USERNAME/GMAIL_SMTP_PASSWORD or SMTP_USER/SMTP_PASS"
                    .to_string(),
            }),
            "outlook" | "outlook.com" => {
                outlook().unwrap_or_else(|| EmailProviderConfig::Misconfigured {
                    provider: "outlook".to_string(),
                    message:
                        "Outlook requires OUTLOOK_SMTP_USERNAME/OUTLOOK_SMTP_PASSWORD or SMTP_USER/SMTP_PASS"
                            .to_string(),
                })
            }
            "smtp" => custom_smtp().unwrap_or_else(|| EmailProviderConfig::Misconfigured {
                provider: "smtp".to_string(),
                message: "SMTP requires SMTP_HOST, SMTP_USERNAME/SMTP_USER, SMTP_PASSWORD/SMTP_PASS, and SMTP_FROM_EMAIL"
                    .to_string(),
            }),
            "auto" => gmail()
                .or_else(outlook)
                .or_else(custom_smtp)
                .unwrap_or(EmailProviderConfig::LocalOutbox),
            "local" | "local-outbox" => EmailProviderConfig::LocalOutbox,
            _ => EmailProviderConfig::LocalOutbox,
        }
    }

    fn name(&self) -> &str {
        match self {
            EmailProviderConfig::LocalOutbox => "local-outbox",
            EmailProviderConfig::Misconfigured { provider, .. } => provider.as_str(),
            EmailProviderConfig::Smtp { provider, .. } => provider.as_str(),
        }
    }
}

fn is_unique_violation(error: &sqlx::Error) -> bool {
    error
        .as_database_error()
        .and_then(|db_error| db_error.code())
        .as_deref()
        == Some("23505")
}

fn optional_env(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

#[cfg(test)]
mod tests {
    use std::sync::Mutex;

    use super::*;

    static ENV_MUTEX: Mutex<()> = Mutex::new(());
    const EMAIL_ENV_KEYS: &[&str] = &[
        "VERIFICATION_EMAIL_PROVIDER",
        "GMAIL_SMTP_HOST",
        "GMAIL_SMTP_PORT",
        "GMAIL_SMTP_USERNAME",
        "GMAIL_SMTP_USER",
        "GMAIL_USERNAME",
        "GMAIL_SMTP_PASSWORD",
        "GMAIL_SMTP_PASS",
        "GMAIL_APP_PASSWORD",
        "GMAIL_PASSWORD",
        "GMAIL_SMTP_FROM_EMAIL",
        "GMAIL_SMTP_FROM_NAME",
        "OUTLOOK_SMTP_HOST",
        "OUTLOOK_SMTP_PORT",
        "OUTLOOK_SMTP_USERNAME",
        "OUTLOOK_SMTP_USER",
        "OUTLOOK_USERNAME",
        "OUTLOOK_SMTP_PASSWORD",
        "OUTLOOK_SMTP_PASS",
        "OUTLOOK_APP_PASSWORD",
        "OUTLOOK_PASSWORD",
        "OUTLOOK_SMTP_FROM_EMAIL",
        "OUTLOOK_SMTP_FROM_NAME",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USERNAME",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "SMTP_PASS",
        "SMTP_FROM_EMAIL",
        "SMTP_FROM_NAME",
    ];

    fn reset_email_env() {
        for key in EMAIL_ENV_KEYS {
            env::remove_var(key);
        }
    }

    fn with_email_env(run: impl FnOnce()) {
        let _guard = ENV_MUTEX.lock().expect("email env mutex poisoned");
        reset_email_env();
        run();
        reset_email_env();
    }

    #[test]
    fn email_provider_config_supports_gmail_defaults() {
        with_email_env(|| {
            env::set_var("VERIFICATION_EMAIL_PROVIDER", "gmail");
            env::set_var("SMTP_USER", "lidian727@gmail.com");
            env::set_var("SMTP_PASS", "app-password");

            match EmailProviderConfig::from_env() {
                EmailProviderConfig::Smtp {
                    provider,
                    host,
                    port,
                    username,
                    password,
                    from_email,
                    ..
                } => {
                    assert_eq!(provider, "gmail");
                    assert_eq!(host, "smtp.gmail.com");
                    assert_eq!(port, 587);
                    assert_eq!(username, "lidian727@gmail.com");
                    assert_eq!(password, "app-password");
                    assert_eq!(from_email, "lidian727@gmail.com");
                }
                other => panic!("expected gmail smtp config, got {other:?}"),
            }
        });
    }

    #[test]
    fn email_provider_auto_prefers_gmail() {
        with_email_env(|| {
            env::set_var("VERIFICATION_EMAIL_PROVIDER", "auto");
            env::set_var("GMAIL_SMTP_USERNAME", "gmail@example.com");
            env::set_var("GMAIL_SMTP_PASSWORD", "gmail-password");
            env::set_var("OUTLOOK_SMTP_USERNAME", "outlook@example.com");
            env::set_var("OUTLOOK_SMTP_PASSWORD", "outlook-password");

            match EmailProviderConfig::from_env() {
                EmailProviderConfig::Smtp { provider, .. } => assert_eq!(provider, "gmail"),
                other => panic!("expected gmail smtp config, got {other:?}"),
            }
        });
    }

    #[test]
    fn email_provider_config_supports_outlook_defaults() {
        with_email_env(|| {
            env::set_var("VERIFICATION_EMAIL_PROVIDER", "outlook");
            env::set_var("OUTLOOK_SMTP_USERNAME", "hanakagumi@outlook.com");
            env::set_var("OUTLOOK_SMTP_PASSWORD", "app-password");

            match EmailProviderConfig::from_env() {
                EmailProviderConfig::Smtp {
                    provider,
                    host,
                    port,
                    username,
                    password,
                    from_email,
                    ..
                } => {
                    assert_eq!(provider, "outlook");
                    assert_eq!(host, "smtp-mail.outlook.com");
                    assert_eq!(port, 587);
                    assert_eq!(username, "hanakagumi@outlook.com");
                    assert_eq!(password, "app-password");
                    assert_eq!(from_email, "hanakagumi@outlook.com");
                }
                other => panic!("expected outlook smtp config, got {other:?}"),
            }
        });
    }

    #[test]
    fn email_provider_auto_falls_back_to_local_outbox() {
        with_email_env(|| {
            env::set_var("VERIFICATION_EMAIL_PROVIDER", "auto");
            assert!(matches!(
                EmailProviderConfig::from_env(),
                EmailProviderConfig::LocalOutbox
            ));
        });
    }
}
