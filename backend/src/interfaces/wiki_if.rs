/*
```cypher
CREATE
  (f:File {name: "wiki_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::wiki_if", type: "module"}),
  (c1:Class {name: "WikiIf", type: "class", language: "rust", signature: "trait WikiIf"}),
  (fn1:Function {name: "WikiIf::list_spaces", type: "function", language: "rust", signature: "async fn list_spaces(&self, workspace_id: Uuid) -> Result<Vec<WikiSpace>, AppError>"}),
  (fn2:Function {name: "WikiIf::create_space", type: "function", language: "rust", signature: "async fn create_space(&self, actor: &AppActor, request: CreateWikiSpaceRequest) -> Result<WikiSpace, AppError>"}),
  (fn3:Function {name: "WikiIf::list_pages", type: "function", language: "rust", signature: "async fn list_pages(&self, space_id: Uuid) -> Result<Vec<WikiPage>, AppError>"}),
  (fn4:Function {name: "WikiIf::create_page", type: "function", language: "rust", signature: "async fn create_page(&self, actor: &AppActor, request: CreateWikiPageRequest) -> Result<WikiPage, AppError>"}),
  (fn5:Function {name: "WikiIf::get_page", type: "function", language: "rust", signature: "async fn get_page(&self, page_id: Uuid) -> Result<WikiPage, AppError>"}),
  (fn6:Function {name: "WikiIf::apply_update", type: "function", language: "rust", signature: "async fn apply_update(&self, actor: &AppActor, page_id: Uuid, request: ApplyWikiUpdateRequest) -> Result<WikiPageUpdate, AppError>"}),
  (fn7:Function {name: "WikiIf::sync_page", type: "function", language: "rust", signature: "async fn sync_page(&self, page_id: Uuid, after_version: i64) -> Result<WikiSyncSnapshot, AppError>"}),
  (fn8:Function {name: "WikiIf::touch_presence", type: "function", language: "rust", signature: "async fn touch_presence(&self, actor: &AppActor, page_id: Uuid, request: WikiPresenceRequest) -> Result<Vec<WikiPresence>, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8);
```
*/

use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::AppActor,
    models::wiki::{
        ApplyWikiUpdateRequest, CreateWikiPageRequest, CreateWikiSpaceRequest, WikiPage,
        WikiPageUpdate, WikiPresence, WikiPresenceRequest, WikiSpace, WikiSyncSnapshot,
    },
};

pub trait WikiIf {
    async fn list_spaces(&self, workspace_id: Uuid) -> Result<Vec<WikiSpace>, AppError>;
    async fn create_space(
        &self,
        actor: &AppActor,
        request: CreateWikiSpaceRequest,
    ) -> Result<WikiSpace, AppError>;
    async fn list_pages(&self, space_id: Uuid) -> Result<Vec<WikiPage>, AppError>;
    async fn create_page(
        &self,
        actor: &AppActor,
        request: CreateWikiPageRequest,
    ) -> Result<WikiPage, AppError>;
    async fn get_page(&self, page_id: Uuid) -> Result<WikiPage, AppError>;
    async fn apply_update(
        &self,
        actor: &AppActor,
        page_id: Uuid,
        request: ApplyWikiUpdateRequest,
    ) -> Result<WikiPageUpdate, AppError>;
    async fn sync_page(
        &self,
        page_id: Uuid,
        after_version: i64,
    ) -> Result<WikiSyncSnapshot, AppError>;
    async fn touch_presence(
        &self,
        actor: &AppActor,
        page_id: Uuid,
        request: WikiPresenceRequest,
    ) -> Result<Vec<WikiPresence>, AppError>;
}
