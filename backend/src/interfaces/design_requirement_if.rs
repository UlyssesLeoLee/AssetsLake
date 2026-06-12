/*
```cypher
CREATE
  (f:File {name: "design_requirement_if.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::interfaces::design_requirement_if", type: "module"}),
  (c1:Class {name: "DesignRequirementIf", type: "class", language: "rust", signature: "trait DesignRequirementIf"}),
  (fn1:Function {name: "DesignRequirementIf::list_requirements", type: "function", language: "rust", signature: "async fn list_requirements(&self, query: &DesignRequirementQuery) -> Result<Vec<DesignRequirement>, AppError>"}),
  (fn2:Function {name: "DesignRequirementIf::create_requirement", type: "function", language: "rust", signature: "async fn create_requirement(&self, actor: &AppActor, request: CreateDesignRequirementRequest) -> Result<DesignRequirement, AppError>"}),
  (fn3:Function {name: "DesignRequirementIf::get_requirement", type: "function", language: "rust", signature: "async fn get_requirement(&self, requirement_id: Uuid) -> Result<DesignRequirementDetail, AppError>"}),
  (fn4:Function {name: "DesignRequirementIf::update_requirement", type: "function", language: "rust", signature: "async fn update_requirement(&self, requirement_id: Uuid, request: UpdateDesignRequirementRequest) -> Result<DesignRequirement, AppError>"}),
  (fn5:Function {name: "DesignRequirementIf::attach_asset", type: "function", language: "rust", signature: "async fn attach_asset<A: AssetIf>(&self, asset_if: &A, actor: &AppActor, requirement_id: Uuid, request: AttachDesignAssetRequest) -> Result<DesignRequirementAsset, AppError>"}),
  (fn6:Function {name: "DesignRequirementIf::add_comment", type: "function", language: "rust", signature: "async fn add_comment(&self, actor: &AppActor, requirement_id: Uuid, request: CreateDesignCommentRequest) -> Result<DesignRequirementComment, AppError>"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6);
```
*/

use uuid::Uuid;

use crate::{
    errors::AppError,
    interfaces::{asset_if::AssetIf, AppActor},
    models::design_requirement::{
        AttachDesignAssetRequest, CreateDesignCommentRequest, CreateDesignRequirementRequest,
        DesignRequirement, DesignRequirementAsset, DesignRequirementComment,
        DesignRequirementDetail, DesignRequirementQuery, UpdateDesignRequirementRequest,
    },
};

pub trait DesignRequirementIf {
    async fn list_requirements(
        &self,
        query: &DesignRequirementQuery,
    ) -> Result<Vec<DesignRequirement>, AppError>;
    async fn create_requirement(
        &self,
        actor: &AppActor,
        request: CreateDesignRequirementRequest,
    ) -> Result<DesignRequirement, AppError>;
    async fn get_requirement(
        &self,
        requirement_id: Uuid,
    ) -> Result<DesignRequirementDetail, AppError>;
    async fn update_requirement(
        &self,
        requirement_id: Uuid,
        request: UpdateDesignRequirementRequest,
    ) -> Result<DesignRequirement, AppError>;
    async fn attach_asset<A: AssetIf>(
        &self,
        asset_if: &A,
        actor: &AppActor,
        requirement_id: Uuid,
        request: AttachDesignAssetRequest,
    ) -> Result<DesignRequirementAsset, AppError>;
    async fn add_comment(
        &self,
        actor: &AppActor,
        requirement_id: Uuid,
        request: CreateDesignCommentRequest,
    ) -> Result<DesignRequirementComment, AppError>;
}
