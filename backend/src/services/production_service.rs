/*
```cypher
CREATE
  (f:File {name: "production_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::production_service", type: "module"}),
  (c1:Class {name: "ProductionService", type: "class", language: "rust"}),
  (fn1:Function {name: "ProductionService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "ProductionService::create_issue", type: "function", language: "rust", signature: "async fn create_issue(&self, req: CreateIssueRequest) -> Result<Issue, AppError>"}),
  (fn3:Function {name: "ProductionService::list_issues", type: "function", language: "rust", signature: "async fn list_issues(&self, query: &IssueQuery) -> Result<(Vec<IssueSummary>, i64), AppError>"}),
  (fn21:Function {name: "ProductionService::board_sync_snapshot", type: "function", language: "rust", signature: "async fn board_sync_snapshot(&self, query: &IssueBoardSyncQuery) -> Result<IssueBoardSyncSnapshot, AppError>"}),
  (fn4:Function {name: "ProductionService::find_issue", type: "function", language: "rust", signature: "async fn find_issue(&self, id: Uuid) -> Result<Issue, AppError>"}),
  (fn5:Function {name: "ProductionService::update_issue", type: "function", language: "rust", signature: "async fn update_issue(&self, id: Uuid, req: UpdateIssueRequest) -> Result<Issue, AppError>"}),
  (fn6:Function {name: "ProductionService::transition_issue", type: "function", language: "rust", signature: "async fn transition_issue(&self, id: Uuid, req: TransitionIssueRequest) -> Result<Issue, AppError>"}),
  (fn7:Function {name: "ProductionService::add_comment", type: "function", language: "rust", signature: "async fn add_comment(&self, issue_id: Uuid, req: CreateIssueCommentRequest) -> Result<IssueComment, AppError>"}),
  (fn8:Function {name: "ProductionService::list_comments", type: "function", language: "rust", signature: "async fn list_comments(&self, issue_id: Uuid) -> Result<Vec<IssueComment>, AppError>"}),
  (fn9:Function {name: "ProductionService::create_work_log", type: "function", language: "rust", signature: "async fn create_work_log(&self, issue_id: Uuid, req: CreateIssueWorkLogRequest) -> Result<IssueWorkLog, AppError>"}),
  (fn10:Function {name: "ProductionService::list_work_logs", type: "function", language: "rust", signature: "async fn list_work_logs(&self, issue_id: Uuid) -> Result<Vec<IssueWorkLog>, AppError>"}),
  (fn11:Function {name: "ProductionService::delete_issue", type: "function", language: "rust", signature: "async fn delete_issue(&self, id: Uuid) -> Result<(), AppError>"}),
  (fn12:Function {name: "ProductionService::attach_asset", type: "function", language: "rust", signature: "async fn attach_asset(&self, issue_id: Uuid, req: AttachIssueAssetRequest) -> Result<(), AppError>"}),
  (fn13:Function {name: "ProductionService::list_issue_assets", type: "function", language: "rust", signature: "async fn list_issue_assets(&self, issue_id: Uuid) -> Result<Vec<IssueAssetSummary>, AppError>"}),
  (fn14:Function {name: "ProductionService::list_issue_history", type: "function", language: "rust", signature: "async fn list_issue_history(&self, issue_id: Uuid) -> Result<Vec<IssueStatusHistory>, AppError>"}),
  (fn15:Function {name: "ProductionService::create_review", type: "function", language: "rust", signature: "async fn create_review(&self, issue_id: Uuid, req: CreateReviewRequest) -> Result<ReviewRound, AppError>"}),
  (fn16:Function {name: "ProductionService::approve_issue", type: "function", language: "rust", signature: "async fn approve_issue(&self, issue_id: Uuid, req: ApproveIssueRequest) -> Result<Issue, AppError>"}),
  (fn17:Function {name: "ProductionService::request_revision", type: "function", language: "rust", signature: "async fn request_revision(&self, issue_id: Uuid, req: RequestRevisionRequest) -> Result<Issue, AppError>"}),
  (fn18:Function {name: "ProductionService::list_milestones", type: "function", language: "rust", signature: "async fn list_milestones(&self, query: &MilestoneQuery) -> Result<Vec<Milestone>, AppError>"}),
  (fn19:Function {name: "ProductionService::create_delivery_package", type: "function", language: "rust", signature: "async fn create_delivery_package(&self, req: CreateDeliveryPackageRequest) -> Result<DeliveryPackage, AppError>"}),
  (fn20:Function {name: "ProductionService::submit_delivery_package", type: "function", language: "rust", signature: "async fn submit_delivery_package(&self, id: Uuid, req: SubmitDeliveryPackageRequest) -> Result<DeliveryPackage, AppError>"}),
  (v1:Variable {name: "repo", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:HAS_METHOD]->(fn1),
  (c1)-[:HAS_METHOD]->(fn2),
  (c1)-[:HAS_METHOD]->(fn3),
  (c1)-[:HAS_METHOD]->(fn21),
  (c1)-[:HAS_METHOD]->(fn4),
  (c1)-[:HAS_METHOD]->(fn5),
  (c1)-[:HAS_METHOD]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (c1)-[:HAS_METHOD]->(fn8),
  (c1)-[:HAS_METHOD]->(fn9),
  (c1)-[:HAS_METHOD]->(fn10),
  (c1)-[:HAS_METHOD]->(fn11),
  (c1)-[:HAS_METHOD]->(fn12),
  (c1)-[:HAS_METHOD]->(fn13),
  (c1)-[:HAS_METHOD]->(fn14),
  (c1)-[:HAS_METHOD]->(fn15),
  (c1)-[:HAS_METHOD]->(fn16),
  (c1)-[:HAS_METHOD]->(fn17),
  (c1)-[:HAS_METHOD]->(fn18),
  (c1)-[:HAS_METHOD]->(fn19),
  (c1)-[:HAS_METHOD]->(fn20),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:USES]->(v1),
  (fn7)-[:USES]->(v1),
  (fn8)-[:USES]->(v1),
  (fn9)-[:USES]->(v1),
  (fn10)-[:USES]->(v1),
  (fn11)-[:USES]->(v1),
  (fn12)-[:USES]->(v1),
  (fn13)-[:USES]->(v1),
  (fn14)-[:USES]->(v1),
  (fn15)-[:USES]->(v1),
  (fn16)-[:USES]->(v1),
  (fn17)-[:USES]->(v1),
  (fn18)-[:USES]->(v1),
  (fn19)-[:USES]->(v1),
  (fn20)-[:USES]->(v1);
```
*/

use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::production::{
        ApproveIssueRequest, AttachIssueAssetRequest, CreateDeliveryPackageRequest,
        CreateIssueCommentRequest, CreateIssueRequest, CreateIssueWorkLogRequest,
        CreateReviewRequest, DeliveryPackage, Issue, IssueAssetSummary, IssueBoardSyncQuery,
        IssueBoardSyncSnapshot, IssueComment, IssueQuery, IssueStatusHistory, IssueSummary,
        IssueWorkLog, Milestone, MilestoneQuery, RequestRevisionRequest, ReviewRound,
        SubmitDeliveryPackageRequest, TransitionIssueRequest, UpdateIssueRequest,
    },
    repositories::production_repository::ProductionRepository,
};

pub struct ProductionService {
    repo: ProductionRepository,
}

impl ProductionService {
    pub fn new(pool: PgPool) -> Self {
        Self {
            repo: ProductionRepository::new(pool),
        }
    }

    pub async fn create_issue(&self, req: CreateIssueRequest) -> Result<Issue, AppError> {
        self.repo.create_issue(req).await
    }

    pub async fn list_issues(
        &self,
        query: &IssueQuery,
    ) -> Result<(Vec<IssueSummary>, i64), AppError> {
        self.repo.list_issues(query).await
    }

    pub async fn board_sync_snapshot(
        &self,
        query: &IssueBoardSyncQuery,
    ) -> Result<IssueBoardSyncSnapshot, AppError> {
        self.repo.board_sync_snapshot(query).await
    }

    pub async fn find_issue(&self, id: Uuid) -> Result<Issue, AppError> {
        self.repo.find_issue(id).await
    }

    pub async fn update_issue(&self, id: Uuid, req: UpdateIssueRequest) -> Result<Issue, AppError> {
        self.repo.update_issue(id, req).await
    }

    pub async fn transition_issue(
        &self,
        id: Uuid,
        req: TransitionIssueRequest,
    ) -> Result<Issue, AppError> {
        self.repo.transition_issue(id, req).await
    }

    pub async fn add_comment(
        &self,
        issue_id: Uuid,
        req: CreateIssueCommentRequest,
    ) -> Result<IssueComment, AppError> {
        self.repo.add_comment(issue_id, req).await
    }

    pub async fn list_comments(&self, issue_id: Uuid) -> Result<Vec<IssueComment>, AppError> {
        self.repo.list_comments(issue_id).await
    }

    pub async fn create_work_log(
        &self,
        issue_id: Uuid,
        req: CreateIssueWorkLogRequest,
    ) -> Result<IssueWorkLog, AppError> {
        self.repo.create_work_log(issue_id, req).await
    }

    pub async fn list_work_logs(&self, issue_id: Uuid) -> Result<Vec<IssueWorkLog>, AppError> {
        self.repo.list_work_logs(issue_id).await
    }

    pub async fn delete_issue(&self, id: Uuid) -> Result<(), AppError> {
        self.repo.delete_issue(id).await
    }

    pub async fn attach_asset(
        &self,
        issue_id: Uuid,
        req: AttachIssueAssetRequest,
    ) -> Result<(), AppError> {
        self.repo.attach_asset(issue_id, req).await
    }

    pub async fn list_issue_assets(
        &self,
        issue_id: Uuid,
    ) -> Result<Vec<IssueAssetSummary>, AppError> {
        self.repo.list_issue_assets(issue_id).await
    }

    pub async fn list_issue_history(
        &self,
        issue_id: Uuid,
    ) -> Result<Vec<IssueStatusHistory>, AppError> {
        self.repo.list_issue_history(issue_id).await
    }

    pub async fn create_review(
        &self,
        issue_id: Uuid,
        req: CreateReviewRequest,
    ) -> Result<ReviewRound, AppError> {
        self.repo.create_review(issue_id, req).await
    }

    pub async fn approve_issue(
        &self,
        issue_id: Uuid,
        req: ApproveIssueRequest,
    ) -> Result<Issue, AppError> {
        self.repo.approve_issue(issue_id, req).await
    }

    pub async fn request_revision(
        &self,
        issue_id: Uuid,
        req: RequestRevisionRequest,
    ) -> Result<Issue, AppError> {
        self.repo.request_revision(issue_id, req).await
    }

    pub async fn list_milestones(
        &self,
        query: &MilestoneQuery,
    ) -> Result<Vec<Milestone>, AppError> {
        self.repo.list_milestones(query).await
    }

    pub async fn create_delivery_package(
        &self,
        req: CreateDeliveryPackageRequest,
    ) -> Result<DeliveryPackage, AppError> {
        self.repo.create_delivery_package(req).await
    }

    pub async fn submit_delivery_package(
        &self,
        id: Uuid,
        req: SubmitDeliveryPackageRequest,
    ) -> Result<DeliveryPackage, AppError> {
        self.repo.submit_delivery_package(id, req).await
    }
}
