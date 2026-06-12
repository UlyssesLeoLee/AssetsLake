/*
```cypher
CREATE
  (f:File {name: "wiki.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::models::wiki", type: "module"}),
  (c1:Class {name: "WikiSpace", type: "class", language: "rust", signature: "struct WikiSpace"}),
  (c2:Class {name: "WikiPage", type: "class", language: "rust", signature: "struct WikiPage"}),
  (c3:Class {name: "WikiPageUpdate", type: "class", language: "rust", signature: "struct WikiPageUpdate"}),
  (c4:Class {name: "WikiPresence", type: "class", language: "rust", signature: "struct WikiPresence"}),
  (c5:Class {name: "TextPatch", type: "class", language: "rust", signature: "struct TextPatch"}),
  (c6:Class {name: "CreateWikiSpaceRequest", type: "class", language: "rust", signature: "struct CreateWikiSpaceRequest"}),
  (c7:Class {name: "CreateWikiPageRequest", type: "class", language: "rust", signature: "struct CreateWikiPageRequest"}),
  (c8:Class {name: "ApplyWikiUpdateRequest", type: "class", language: "rust", signature: "struct ApplyWikiUpdateRequest"}),
  (c9:Class {name: "WikiPresenceRequest", type: "class", language: "rust", signature: "struct WikiPresenceRequest"}),
  (c10:Class {name: "WikiSyncQuery", type: "class", language: "rust", signature: "struct WikiSyncQuery"}),
  (c11:Class {name: "WikiSyncSnapshot", type: "class", language: "rust", signature: "struct WikiSyncSnapshot"}),
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
  (m)-[:CONTAINS]->(c11);
```
*/

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WikiSpace {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub created_by: Option<Uuid>,
    pub created_by_name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WikiPage {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub space_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub title: String,
    pub slug: String,
    pub content_markdown: String,
    pub version: i64,
    pub created_by: Option<Uuid>,
    pub created_by_name: String,
    pub updated_by: Option<Uuid>,
    pub updated_by_name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WikiPageUpdate {
    pub id: Uuid,
    pub page_id: Uuid,
    pub client_id: String,
    pub base_version: i64,
    pub version: i64,
    pub patch: serde_json::Value,
    pub content_markdown: String,
    pub created_by: Option<Uuid>,
    pub created_by_name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WikiPresence {
    pub page_id: Uuid,
    pub client_id: String,
    pub user_id: Option<Uuid>,
    pub display_name: String,
    pub cursor_anchor: Option<i32>,
    pub cursor_head: Option<i32>,
    pub last_seen_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextPatch {
    pub from: usize,
    pub to: usize,
    pub insert: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateWikiSpaceRequest {
    pub workspace_id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateWikiPageRequest {
    pub workspace_id: Uuid,
    pub space_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub title: String,
    pub slug: String,
    pub content_markdown: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ApplyWikiUpdateRequest {
    pub client_id: String,
    pub base_version: i64,
    pub patch: TextPatch,
}

#[derive(Debug, Deserialize)]
pub struct WikiPresenceRequest {
    pub client_id: String,
    pub cursor_anchor: Option<i32>,
    pub cursor_head: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct WikiSyncQuery {
    pub after_version: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct WikiSyncSnapshot {
    pub page: WikiPage,
    pub updates: Vec<WikiPageUpdate>,
    pub collaborators: Vec<WikiPresence>,
}
