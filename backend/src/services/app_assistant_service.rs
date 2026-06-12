/*
```cypher
CREATE
  (f:File {name: "app_assistant_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::app_assistant_service", type: "module"}),
  (c1:Class {name: "AppAssistantService", type: "class", language: "rust", signature: "struct AppAssistantService"}),
  (c2:Class {name: "AssistantConversation", type: "class", language: "rust", signature: "struct AssistantConversation"}),
  (c3:Class {name: "AssistantMessage", type: "class", language: "rust", signature: "struct AssistantMessage"}),
  (fn1:Function {name: "AppAssistantService::record_exchange", type: "function", language: "rust"}),
  (fn2:Function {name: "AppAssistantService::list_history", type: "function", language: "rust"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2);
```
*/

use chrono::{DateTime, Utc};
use serde::Serialize;
use serde_json::Value;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::errors::AppError;

#[derive(Clone)]
pub struct AppAssistantService {
    pool: PgPool,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AssistantMessage {
    pub id: Uuid,
    pub role: String,
    pub content: String,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct AssistantConversation {
    pub id: Uuid,
    pub app_id: String,
    pub route_id: String,
    pub pathname: String,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    #[sqlx(skip)]
    pub messages: Vec<AssistantMessage>,
}

impl AppAssistantService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    #[allow(clippy::too_many_arguments)]
    pub async fn record_exchange(
        &self,
        user_id: Uuid,
        conversation_id: Option<Uuid>,
        app_id: &str,
        route_id: &str,
        pathname: &str,
        user_message: &str,
        assistant_message: &str,
        assistant_metadata: Value,
    ) -> Result<Uuid, AppError> {
        let mut transaction = self.pool.begin().await?;
        let existing_id = if let Some(id) = conversation_id {
            sqlx::query_scalar::<_, Uuid>(
                "SELECT id FROM assistant_conversations WHERE id = $1 AND user_id = $2",
            )
            .bind(id)
            .bind(user_id)
            .fetch_optional(&mut *transaction)
            .await?
        } else {
            None
        };

        let resolved_id = match existing_id {
            Some(id) => {
                sqlx::query(
                    r#"
                    UPDATE assistant_conversations
                    SET app_id = $2, route_id = $3, pathname = $4, updated_at = NOW()
                    WHERE id = $1
                    "#,
                )
                .bind(id)
                .bind(app_id)
                .bind(route_id)
                .bind(pathname)
                .execute(&mut *transaction)
                .await?;
                id
            }
            None => {
                let id = Uuid::new_v4();
                let title = conversation_title(user_message);
                sqlx::query(
                    r#"
                    INSERT INTO assistant_conversations
                        (id, user_id, app_id, route_id, pathname, title)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    "#,
                )
                .bind(id)
                .bind(user_id)
                .bind(app_id)
                .bind(route_id)
                .bind(pathname)
                .bind(title)
                .execute(&mut *transaction)
                .await?;
                id
            }
        };

        sqlx::query(
            r#"
            INSERT INTO assistant_messages (conversation_id, role, content, metadata)
            VALUES ($1, 'user', $2, '{}'::jsonb), ($1, 'assistant', $3, $4)
            "#,
        )
        .bind(resolved_id)
        .bind(user_message)
        .bind(assistant_message)
        .bind(assistant_metadata)
        .execute(&mut *transaction)
        .await?;

        transaction.commit().await?;
        Ok(resolved_id)
    }

    pub async fn list_history(
        &self,
        user_id: Uuid,
        app_id: Option<&str>,
        limit: i64,
    ) -> Result<Vec<AssistantConversation>, AppError> {
        let mut conversations = sqlx::query_as::<_, AssistantConversation>(
            r#"
            SELECT id, app_id, route_id, pathname, title, created_at, updated_at
            FROM assistant_conversations
            WHERE user_id = $1 AND ($2::text IS NULL OR app_id = $2)
            ORDER BY updated_at DESC
            LIMIT $3
            "#,
        )
        .bind(user_id)
        .bind(app_id)
        .bind(limit.clamp(1, 20))
        .fetch_all(&self.pool)
        .await?;

        for conversation in &mut conversations {
            conversation.messages = sqlx::query_as::<_, AssistantMessage>(
                r#"
                SELECT id, role, content, metadata, created_at
                FROM assistant_messages
                WHERE conversation_id = $1
                ORDER BY created_at ASC
                LIMIT 100
                "#,
            )
            .bind(conversation.id)
            .fetch_all(&self.pool)
            .await?;
        }

        Ok(conversations)
    }
}

fn conversation_title(message: &str) -> String {
    let compact = message.split_whitespace().collect::<Vec<_>>().join(" ");
    let mut chars = compact.chars();
    let title = chars.by_ref().take(72).collect::<String>();
    if chars.next().is_some() {
        format!("{}...", title)
    } else if title.is_empty() {
        "New assistant conversation".to_string()
    } else {
        title
    }
}

#[cfg(test)]
mod tests {
    use super::conversation_title;

    #[test]
    fn conversation_title_is_compact_and_bounded() {
        assert_eq!(
            conversation_title("  find   a senior  rigger "),
            "find a senior rigger"
        );
        assert!(conversation_title(&"x".repeat(100)).len() <= 75);
    }
}
