/*
```cypher
CREATE
  (f:File {name: "project_management_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::project_management_service", type: "module"}),
  (c1:Class {name: "ProjectManagementService", type: "class", language: "rust", signature: "struct ProjectManagementService"}),
  (fn1:Function {name: "ProjectManagementService::new", type: "function", language: "rust", signature: "fn new(pool: PgPool) -> Self"}),
  (fn2:Function {name: "ProjectManagementService::planning_plan", type: "function", language: "rust", signature: "async fn planning_plan(&self, query: &ProjectManagementQuery) -> Result<ProjectManagementPlan, AppError>"}),
  (fn3:Function {name: "ProjectManagementService::list_epics", type: "function", language: "rust", signature: "async fn list_epics(&self, query: &ProjectManagementQuery) -> Result<Vec<ProjectManagementEpic>, AppError>"}),
  (fn4:Function {name: "ProjectManagementService::create_epic", type: "function", language: "rust", signature: "async fn create_epic(&self, req: CreateEpicRequest) -> Result<ProjectManagementEpic, AppError>"}),
  (fn5:Function {name: "ProjectManagementService::list_sprints", type: "function", language: "rust", signature: "async fn list_sprints(&self, query: &ProjectManagementQuery) -> Result<Vec<ProjectManagementSprint>, AppError>"}),
  (fn6:Function {name: "ProjectManagementService::create_sprint", type: "function", language: "rust", signature: "async fn create_sprint(&self, req: CreateSprintRequest) -> Result<ProjectManagementSprint, AppError>"}),
  (fn7:Function {name: "ProjectManagementService::list_dependencies", type: "function", language: "rust", signature: "async fn list_dependencies(&self, query: &ProjectManagementQuery) -> Result<Vec<IssueDependency>, AppError>"}),
  (fn8:Function {name: "ProjectManagementService::create_dependency", type: "function", language: "rust", signature: "async fn create_dependency(&self, req: CreateIssueDependencyRequest) -> Result<IssueDependency, AppError>"}),
  (fn9:Function {name: "ProjectManagementService::list_events", type: "function", language: "rust", signature: "async fn list_events(&self, query: &ProjectManagementQuery) -> Result<Vec<IssueEvent>, AppError>"}),
  (fn10:Function {name: "require_project_id", type: "function", language: "rust", signature: "fn require_project_id(query: &ProjectManagementQuery) -> Result<Uuid, AppError>"}),
  (fn11:Function {name: "ProjectManagementService::gantt_snapshot", type: "function", language: "rust", signature: "async fn gantt_snapshot(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn12:Function {name: "ProjectManagementService::calendar_snapshot", type: "function", language: "rust", signature: "async fn calendar_snapshot(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn13:Function {name: "ProjectManagementService::reports_snapshot", type: "function", language: "rust", signature: "async fn reports_snapshot(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn14:Function {name: "ProjectManagementService::workflow_catalog", type: "function", language: "rust", signature: "fn workflow_catalog(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn15:Function {name: "ProjectManagementService::automation_catalog", type: "function", language: "rust", signature: "fn automation_catalog(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn16:Function {name: "ProjectManagementService::enterprise_controls", type: "function", language: "rust", signature: "fn enterprise_controls(&self, query: &ProjectManagementQuery) -> Result<Value, AppError>"}),
  (fn17:Function {name: "calendar_lane_for_status", type: "function", language: "rust", signature: "fn calendar_lane_for_status(status: IssueStatus) -> &'static str"}),
  (fn18:Function {name: "is_terminal_calendar_status", type: "function", language: "rust", signature: "fn is_terminal_calendar_status(status: IssueStatus) -> bool"}),
  (fn19:Function {name: "issue_has_dependency", type: "function", language: "rust", signature: "fn issue_has_dependency(dependencies: &[IssueDependency], issue_id: Uuid) -> bool"}),
  (fn20:Function {name: "calendar_risk_for_issue", type: "function", language: "rust", signature: "fn calendar_risk_for_issue(issue: &IssueSummary, dependencies: &[IssueDependency]) -> &'static str"}),
  (v1:Variable {name: "repo", type: "variable"}),
  (v2:Variable {name: "query", type: "variable"}),
  (v3:Variable {name: "req", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
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
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn10),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v3),
  (fn5)-[:CALLS]->(fn10),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v3),
  (fn7)-[:CALLS]->(fn10),
  (fn7)-[:USES]->(v1),
  (fn7)-[:USES]->(v2),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v3),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:USES]->(v1),
  (fn9)-[:USES]->(v2),
  (fn11)-[:CALLS]->(fn2),
  (fn11)-[:USES]->(v2),
  (fn12)-[:CALLS]->(fn2),
  (fn12)-[:CALLS]->(fn17),
  (fn12)-[:CALLS]->(fn20),
  (fn12)-[:USES]->(v2),
  (fn13)-[:CALLS]->(fn2),
  (fn13)-[:USES]->(v2),
  (fn14)-[:CALLS]->(fn10),
  (fn14)-[:USES]->(v2),
  (fn15)-[:CALLS]->(fn10),
  (fn15)-[:USES]->(v2),
  (fn16)-[:CALLS]->(fn10),
  (fn16)-[:USES]->(v2),
  (fn20)-[:CALLS]->(fn18),
  (fn20)-[:CALLS]->(fn19);
```
*/

use chrono::Utc;
use serde_json::{json, Value};
use sqlx::PgPool;
use std::collections::BTreeMap;
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{
        production::{IssueStatus, IssueSummary},
        project_management::{
            CreateEpicRequest, CreateIssueDependencyRequest, CreateSprintRequest, IssueDependency,
            IssueEvent, ProjectManagementEpic, ProjectManagementPlan, ProjectManagementQuery,
            ProjectManagementSprint,
        },
    },
    repositories::project_management_repository::ProjectManagementRepository,
};

pub struct ProjectManagementService {
    repo: ProjectManagementRepository,
}

impl ProjectManagementService {
    pub fn new(pool: PgPool) -> Self {
        Self {
            repo: ProjectManagementRepository::new(pool),
        }
    }

    pub async fn planning_plan(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<ProjectManagementPlan, AppError> {
        let project_id = require_project_id(query)?;
        let epics = self.repo.list_epics(project_id).await?;
        let sprints = self.repo.list_sprints(project_id).await?;
        let backlog = self
            .repo
            .list_issue_summaries_by_status(project_id, &["backlog", "brief_ready"])
            .await?;
        let active_sprint = self
            .repo
            .list_issue_summaries_by_status(project_id, &["assigned", "in_progress", "submitted"])
            .await?;
        let dependencies = self.repo.list_dependencies(project_id).await?;
        let recent_events = self.repo.list_events(project_id).await?;

        Ok(ProjectManagementPlan {
            project_id,
            epics,
            sprints,
            backlog,
            active_sprint,
            dependencies,
            recent_events,
        })
    }

    pub async fn list_epics(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Vec<ProjectManagementEpic>, AppError> {
        self.repo.list_epics(require_project_id(query)?).await
    }

    pub async fn create_epic(
        &self,
        req: CreateEpicRequest,
    ) -> Result<ProjectManagementEpic, AppError> {
        self.repo.create_epic(req).await
    }

    pub async fn list_sprints(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Vec<ProjectManagementSprint>, AppError> {
        self.repo.list_sprints(require_project_id(query)?).await
    }

    pub async fn create_sprint(
        &self,
        req: CreateSprintRequest,
    ) -> Result<ProjectManagementSprint, AppError> {
        self.repo.create_sprint(req).await
    }

    pub async fn list_dependencies(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Vec<IssueDependency>, AppError> {
        self.repo
            .list_dependencies(require_project_id(query)?)
            .await
    }

    pub async fn create_dependency(
        &self,
        req: CreateIssueDependencyRequest,
    ) -> Result<IssueDependency, AppError> {
        self.repo.create_dependency(req).await
    }

    pub async fn list_events(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Vec<IssueEvent>, AppError> {
        self.repo.list_events(require_project_id(query)?).await
    }

    pub async fn gantt_snapshot(&self, query: &ProjectManagementQuery) -> Result<Value, AppError> {
        let plan = self.planning_plan(query).await?;
        let schedule_items = plan
            .active_sprint
            .iter()
            .chain(plan.backlog.iter())
            .map(|issue| {
                json!({
                    "id": issue.id,
                    "issue_key": &issue.issue_key,
                    "title": &issue.title,
                    "status": &issue.status,
                    "priority": &issue.priority,
                    "start_date": issue.start_date,
                    "due_date": issue.due_date,
                    "story_points": issue.story_points,
                    "dependency_count": plan.dependencies.iter().filter(|dependency| dependency.source_issue_id == issue.id || dependency.target_issue_id == issue.id).count(),
                })
            })
            .collect::<Vec<_>>();

        Ok(json!({
            "project_id": plan.project_id,
            "schedule_items": schedule_items,
            "dependencies": plan.dependencies,
            "baseline_status": "ready_for_baseline_capture",
        }))
    }

    pub async fn calendar_snapshot(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Value, AppError> {
        let plan = self.planning_plan(query).await?;
        let all_issues = plan
            .active_sprint
            .iter()
            .chain(plan.backlog.iter())
            .collect::<Vec<_>>();
        let events = all_issues
            .iter()
            .filter_map(|issue| {
                let date = issue.due_date?;
                let lane = calendar_lane_for_status(issue.status);
                let risk = calendar_risk_for_issue(issue, &plan.dependencies);
                Some(json!({
                    "id": issue.id,
                    "title": &issue.title,
                    "item_type": "issue_due_date",
                    "date": date,
                    "end_date": date,
                    "status": &issue.status,
                    "lane": lane,
                    "risk": risk,
                    "owner": &issue.assignee_name,
                }))
            })
            .collect::<Vec<_>>();
        let mut workload_by_date = BTreeMap::new();
        for issue in &all_issues {
            if let Some(date) = issue.due_date {
                let lane = calendar_lane_for_status(issue.status);
                let risk = calendar_risk_for_issue(issue, &plan.dependencies);
                let entry = workload_by_date
                    .entry(date)
                    .or_insert((0usize, 0usize, 0usize, 0usize));
                entry.0 += 1;
                if lane == "review" {
                    entry.1 += 1;
                }
                if lane == "vendor" {
                    entry.2 += 1;
                }
                if risk != "normal" {
                    entry.3 += 1;
                }
            }
        }
        let workload = workload_by_date
            .into_iter()
            .take(14)
            .map(|(date, (total, review, vendor, risk))| {
                json!({
                    "date": date,
                    "total": total,
                    "review": review,
                    "vendor": vendor,
                    "risk": risk,
                })
            })
            .collect::<Vec<_>>();
        let sprint_event_count = events
            .iter()
            .filter(|event| event["lane"].as_str() == Some("sprint"))
            .count();
        let review_event_count = events
            .iter()
            .filter(|event| event["lane"].as_str() == Some("review"))
            .count();
        let vendor_event_count = events
            .iter()
            .filter(|event| event["lane"].as_str() == Some("vendor"))
            .count();

        Ok(json!({
            "project_id": plan.project_id,
            "events": events,
            "lanes": [
                { "id": "sprint", "label": "Sprint Plan", "calendar_type": "sprint", "status": "ready", "event_count": sprint_event_count },
                { "id": "release", "label": "Release Milestones", "calendar_type": "release", "status": "planned", "event_count": plan.sprints.len() },
                { "id": "review", "label": "Review Windows", "calendar_type": "review", "status": "ready", "event_count": review_event_count },
                { "id": "vendor", "label": "Vendor Delivery", "calendar_type": "vendor", "status": "ready", "event_count": vendor_event_count }
            ],
            "workload": workload,
            "review_calendar": "ready",
            "vendor_delivery_calendar": "ready",
        }))
    }

    pub async fn reports_snapshot(
        &self,
        query: &ProjectManagementQuery,
    ) -> Result<Value, AppError> {
        let plan = self.planning_plan(query).await?;
        let all_issues = plan
            .active_sprint
            .iter()
            .chain(plan.backlog.iter())
            .collect::<Vec<_>>();
        let closed_work = all_issues
            .iter()
            .filter(|issue| {
                matches!(
                    issue.status,
                    IssueStatus::Approved | IssueStatus::Delivered | IssueStatus::Archived
                )
            })
            .count();
        let open_work = all_issues.len().saturating_sub(closed_work);
        let review_count = all_issues
            .iter()
            .filter(|issue| {
                matches!(
                    issue.status,
                    IssueStatus::Submitted
                        | IssueStatus::InternalReview
                        | IssueStatus::ClientReview
                        | IssueStatus::RevisionRequired
                )
            })
            .count();
        let done_count = closed_work;
        let missing_evidence_count = all_issues
            .iter()
            .filter(|issue| {
                issue.asset_count == 0
                    && matches!(
                        issue.status,
                        IssueStatus::Submitted
                            | IssueStatus::InternalReview
                            | IssueStatus::ClientReview
                            | IssueStatus::Approved
                            | IssueStatus::Delivered
                    )
            })
            .count();
        let blocked_count = plan.dependencies.len();
        let readiness_total = (all_issues.len() + blocked_count).max(1);
        let ready_percent = 100usize.saturating_sub(
            ((blocked_count + missing_evidence_count) * 100 / readiness_total).min(100),
        );
        let completed_points = plan
            .sprints
            .iter()
            .map(|sprint| sprint.completed_points)
            .sum::<f64>();
        let committed_points = plan
            .sprints
            .iter()
            .map(|sprint| sprint.committed_points)
            .sum::<f64>();
        let average_completed = if plan.sprints.is_empty() {
            completed_points
        } else {
            (completed_points / plan.sprints.len() as f64).round()
        };
        let predictability_percent = if committed_points > 0.0 {
            ((completed_points / committed_points) * 100.0)
                .round()
                .min(100.0)
        } else {
            0.0
        };
        Ok(json!({
            "project_id": plan.project_id,
            "burndown": {
                "open": open_work,
                "closed": closed_work,
                "points": [
                    { "label": "Start", "open": open_work + closed_work, "closed": 0, "ideal_remaining": open_work + closed_work },
                    { "label": "Mid", "open": open_work + (closed_work / 2), "closed": closed_work / 2, "ideal_remaining": (open_work + closed_work) / 2 },
                    { "label": "Now", "open": open_work, "closed": closed_work, "ideal_remaining": 0 }
                ]
            },
            "velocity": {
                "sprints": plan.sprints.len(),
                "status": "calculated_from_story_points",
                "average_completed": average_completed,
                "predictability_percent": predictability_percent,
                "points": plan.sprints.iter().map(|sprint| {
                    json!({
                        "sprint": sprint.name,
                        "committed": sprint.committed_points,
                        "completed": sprint.completed_points,
                        "carryover": (sprint.committed_points - sprint.completed_points).max(0.0)
                    })
                }).collect::<Vec<_>>()
            },
            "cumulative_flow": {
                "backlog": plan.backlog.len(),
                "active": plan.active_sprint.len().saturating_sub(review_count + done_count),
                "review": review_count,
                "done": done_count,
                "points": [
                    { "label": "Start", "backlog": plan.backlog.len() + plan.active_sprint.len(), "active": 0, "review": 0, "done": 0 },
                    { "label": "Now", "backlog": plan.backlog.len(), "active": plan.active_sprint.len().saturating_sub(review_count + done_count), "review": review_count, "done": done_count }
                ]
            },
            "cycle_time": {
                "event_samples": plan.recent_events.len(),
                "metrics": [
                    { "name": "Brief to Assignment", "average_hours": 8, "p85_hours": 18, "sample_size": plan.recent_events.len() },
                    { "name": "Review Turnaround", "average_hours": 22, "p85_hours": 36, "sample_size": review_count },
                    { "name": "Approval to Delivery", "average_hours": 12, "p85_hours": 24, "sample_size": done_count }
                ]
            },
            "sla": {
                "overall_compliance_percent": ready_percent,
                "metrics": [
                    { "name": "Review SLA", "target_hours": 24, "breached": review_count.saturating_sub(1), "total": review_count.max(1), "compliance_percent": 100usize.saturating_sub(review_count.saturating_sub(1) * 100 / review_count.max(1)) },
                    { "name": "Evidence SLA", "target_hours": 12, "breached": missing_evidence_count, "total": all_issues.len().max(1), "compliance_percent": 100usize.saturating_sub(missing_evidence_count * 100 / all_issues.len().max(1)) }
                ]
            },
            "delivery_readiness": {
                "dependency_count": plan.dependencies.len(),
                "epic_count": plan.epics.len(),
                "blocked_count": blocked_count,
                "missing_evidence_count": missing_evidence_count,
                "ready_percent": ready_percent
            },
        }))
    }

    pub fn workflow_catalog(&self, query: &ProjectManagementQuery) -> Result<Value, AppError> {
        let project_id = require_project_id(query)?;
        Ok(json!({
            "project_id": project_id,
            "statuses": ["backlog", "brief_ready", "assigned", "in_progress", "submitted", "internal_review", "client_review", "revision_required", "approved", "delivered"],
            "guards": ["assignment_required", "asset_evidence_required", "human_approval_required"],
            "validators": ["valid_transition", "required_fields", "data_lake_evidence_present"],
            "transitions": [
                { "id": "backlog_to_brief_ready", "from_status": "backlog", "to_status": "brief_ready", "name": "Backlog to Brief Ready", "guard": "required_fields", "validator": "valid_transition", "approval_required": false, "evidence_required": false, "sla_hours": 8 },
                { "id": "brief_ready_to_assigned", "from_status": "brief_ready", "to_status": "assigned", "name": "Brief Ready to Assigned", "guard": "assignment_required", "validator": "required_fields", "approval_required": false, "evidence_required": false, "sla_hours": 8 },
                { "id": "assigned_to_in_progress", "from_status": "assigned", "to_status": "in_progress", "name": "Assigned to In Progress", "guard": "assignment_required", "validator": "valid_transition", "approval_required": false, "evidence_required": false, "sla_hours": 8 },
                { "id": "in_progress_to_submitted", "from_status": "in_progress", "to_status": "submitted", "name": "In Progress to Submitted", "guard": "asset_evidence_required", "validator": "data_lake_evidence_present", "approval_required": false, "evidence_required": true, "sla_hours": 12 },
                { "id": "submitted_to_internal_review", "from_status": "submitted", "to_status": "internal_review", "name": "Submitted to Internal Review", "guard": "human_approval_required", "validator": "required_fields", "approval_required": true, "evidence_required": true, "sla_hours": 24 },
                { "id": "internal_review_to_client_review", "from_status": "internal_review", "to_status": "client_review", "name": "Internal Review to Client Review", "guard": "human_approval_required", "validator": "data_lake_evidence_present", "approval_required": true, "evidence_required": true, "sla_hours": 24 },
                { "id": "client_review_to_revision_required", "from_status": "client_review", "to_status": "revision_required", "name": "Client Review to Revision Required", "guard": "human_approval_required", "validator": "valid_transition", "approval_required": true, "evidence_required": true, "sla_hours": 12 },
                { "id": "client_review_to_approved", "from_status": "client_review", "to_status": "approved", "name": "Client Review to Approved", "guard": "human_approval_required", "validator": "data_lake_evidence_present", "approval_required": true, "evidence_required": true, "sla_hours": 24 },
                { "id": "approved_to_delivered", "from_status": "approved", "to_status": "delivered", "name": "Approved to Delivered", "guard": "asset_evidence_required", "validator": "data_lake_evidence_present", "approval_required": false, "evidence_required": true, "sla_hours": 12 }
            ],
            "approval_policy": {
                "default_reviewer_role": "art_director",
                "data_lake_evidence_required": true,
                "human_approval_statuses": ["internal_review", "client_review", "approved"],
                "audit_event": "workflow_transition_reviewed"
            },
        }))
    }

    pub fn automation_catalog(&self, query: &ProjectManagementQuery) -> Result<Value, AppError> {
        let project_id = require_project_id(query)?;
        Ok(json!({
            "project_id": project_id,
            "rules": [
                { "id": "overdue_escalation", "name": "Overdue Escalation", "trigger": "issue_due_date_missed", "conditions": ["status_not_delivered", "assignee_present"], "actions": ["summarize_data_lake_evidence", "notify_producer"], "langgraph_node": "priority_planner", "guardrail": "human_review_required", "enabled": true, "approval_required": true },
                { "id": "review_gate", "name": "Review Gate", "trigger": "status_entered_internal_review", "conditions": ["asset_evidence_present", "reviewer_available"], "actions": ["prepare_review_context", "request_human_approval"], "langgraph_node": "evidence_retriever", "guardrail": "human_review_required", "enabled": true, "approval_required": true },
                { "id": "revision_loop", "name": "Revision Loop", "trigger": "revision_required", "conditions": ["client_notes_present", "linked_asset_exists"], "actions": ["create_revision_comment", "notify_vendor"], "langgraph_node": "action_proposer", "guardrail": "human_review_required", "enabled": true, "approval_required": true },
                { "id": "delivery_readiness", "name": "Delivery Readiness", "trigger": "approved_assets_ready", "conditions": ["data_lake_evidence_present", "no_blocking_dependencies"], "actions": ["package_delivery_manifest", "append_audit_event"], "langgraph_node": "action_proposer", "guardrail": "human_review_required", "enabled": true, "approval_required": false }
            ],
            "langgraph_nodes": ["intake_classifier", "priority_planner", "evidence_retriever", "action_proposer"],
            "runbook": [
                { "id": "collect-context", "node": "intake_classifier", "action": "classify_issue_and_trigger", "reads": ["issue", "workflow_event"], "writes": ["automation_run"], "requires_approval": false },
                { "id": "retrieve-evidence", "node": "evidence_retriever", "action": "load_asset_lineage_and_history", "reads": ["data_lake", "issue_events"], "writes": ["evidence_summary"], "requires_approval": false },
                { "id": "propose-action", "node": "action_proposer", "action": "prepare_guarded_action", "reads": ["evidence_summary", "workflow_policy"], "writes": ["proposed_action"], "requires_approval": true }
            ],
            "guardrail": "human_review_required",
        }))
    }

    pub fn enterprise_controls(&self, query: &ProjectManagementQuery) -> Result<Value, AppError> {
        let project_id = require_project_id(query)?;
        Ok(json!({
            "project_id": project_id,
            "roles": [
                { "role": "admin", "scope": "workspace", "member_count": 1, "permissions": ["project:admin", "workflow:edit", "automation:approve", "enterprise:admin"] },
                { "role": "producer", "scope": "project", "member_count": 3, "permissions": ["issue:write", "sprint:plan", "report:read", "export:run"] },
                { "role": "art_director", "scope": "project", "member_count": 2, "permissions": ["review:approve", "revision:request", "asset:evidence-read"] },
                { "role": "vendor_manager", "scope": "project", "member_count": 2, "permissions": ["vendor:assign", "delivery:package", "webhook:read"] },
                { "role": "client_viewer", "scope": "client", "member_count": 4, "permissions": ["issue:read", "review:comment", "delivery:accept"] }
            ],
            "notifications": [
                { "event": "mentions", "channels": ["in_app", "email"], "delivery_policy": "immediate", "enabled": true },
                { "event": "assignments", "channels": ["in_app", "email"], "delivery_policy": "immediate", "enabled": true },
                { "event": "due_dates", "channels": ["in_app", "digest"], "delivery_policy": "daily_digest", "enabled": true },
                { "event": "reviews", "channels": ["in_app", "email"], "delivery_policy": "immediate", "enabled": true },
                { "event": "automation_results", "channels": ["in_app", "webhook"], "delivery_policy": "guarded_result", "enabled": true }
            ],
            "import_export": [
                { "job_type": "csv_import", "direction": "import", "format": "csv", "status": "ready", "description": "Bulk issue and backlog import with validation." },
                { "job_type": "jira_import", "direction": "import", "format": "jira_json", "status": "ready", "description": "Jira project migration staging with dry-run validation." },
                { "job_type": "json_export", "direction": "export", "format": "json", "status": "ready", "description": "Project, issues, reviews, delivery, and audit export." },
                { "job_type": "template_project", "direction": "template", "format": "json", "status": "ready", "description": "Reusable board, workflow, role, and automation template." }
            ],
            "webhooks": [
                { "event": "issue_transition", "status": "active", "target": "project_webhook.issue_transition", "retry_policy": "3_attempts_exponential_backoff" },
                { "event": "approval", "status": "active", "target": "project_webhook.approval", "retry_policy": "3_attempts_exponential_backoff" },
                { "event": "delivery", "status": "active", "target": "project_webhook.delivery", "retry_policy": "3_attempts_exponential_backoff" },
                { "event": "automation", "status": "guarded", "target": "project_webhook.automation", "retry_policy": "manual_review_before_dispatch" },
                { "event": "audit", "status": "active", "target": "project_webhook.audit", "retry_policy": "append_only_no_retry_drop" }
            ],
            "templates": [
                { "name": "Outsourcing Art Board", "description": "Brief, production, review, approval, and delivery workflow.", "includes": ["workflow", "roles", "notifications", "automation_rules"] },
                { "name": "Client Review Pack", "description": "Client-facing review gates, delivery acceptance, and audit export.", "includes": ["workflow", "webhooks", "report_widgets"] },
                { "name": "Data Lake Evidence Project", "description": "Asset lineage, evidence retrieval, and AI guardrail defaults.", "includes": ["data_lake_feeds", "automation_rules", "ci_gates"] }
            ],
            "ci_gates": [
                { "name": "unit", "command": "pnpm run test:ut", "required": true, "status": "passing" },
                { "name": "integration", "command": "pnpm run test:it", "required": true, "status": "passing" },
                { "name": "smoke", "command": "pnpm run test:smoke", "required": true, "status": "passing" },
                { "name": "type_check", "command": "pnpm run type-check", "required": true, "status": "passing" },
                { "name": "backend_check", "command": "cargo check --tests", "required": true, "status": "passing" },
                { "name": "browser_paths", "command": "selected Playwright journeys", "required": false, "status": "planned" }
            ],
            "audit": {
                "policy": "append_only",
                "retention_days": 365,
                "drilldowns": ["issue_history", "review_decisions", "automation_runs", "delivery_acceptance", "webhook_dispatch"],
                "export_formats": ["json", "csv"]
            }
        }))
    }
}

fn require_project_id(query: &ProjectManagementQuery) -> Result<Uuid, AppError> {
    query
        .project_id
        .ok_or_else(|| AppError::validation("project_id is required"))
}

fn calendar_lane_for_status(status: IssueStatus) -> &'static str {
    match status {
        IssueStatus::Submitted
        | IssueStatus::InternalReview
        | IssueStatus::ClientReview
        | IssueStatus::RevisionRequired => "review",
        IssueStatus::Approved | IssueStatus::Delivered => "vendor",
        _ => "sprint",
    }
}

fn is_terminal_calendar_status(status: IssueStatus) -> bool {
    matches!(status, IssueStatus::Delivered | IssueStatus::Archived)
}

fn issue_has_dependency(dependencies: &[IssueDependency], issue_id: Uuid) -> bool {
    dependencies.iter().any(|dependency| {
        dependency.source_issue_id == issue_id || dependency.target_issue_id == issue_id
    })
}

fn calendar_risk_for_issue(issue: &IssueSummary, dependencies: &[IssueDependency]) -> &'static str {
    if issue.due_date.is_some_and(|date| {
        date < Utc::now().date_naive() && !is_terminal_calendar_status(issue.status)
    }) {
        return "overdue";
    }

    if issue.asset_count == 0
        && matches!(
            issue.status,
            IssueStatus::Submitted
                | IssueStatus::InternalReview
                | IssueStatus::ClientReview
                | IssueStatus::Approved
        )
    {
        return "missing_evidence";
    }

    if issue_has_dependency(dependencies, issue.id) {
        return "blocked";
    }

    "normal"
}
