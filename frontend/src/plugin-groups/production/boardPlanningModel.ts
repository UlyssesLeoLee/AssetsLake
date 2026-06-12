/*
```cypher
CREATE
  (f:File {name: "boardPlanningModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/boardPlanningModel", type: "module"}),
  (c1:Class {name: "BoardColumnModel", type: "class", language: "typescript", signature: "interface BoardColumnModel"}),
  (c2:Class {name: "BoardSwimlaneModel", type: "class", language: "typescript", signature: "interface BoardSwimlaneModel"}),
  (c3:Class {name: "BoardRiskItem", type: "class", language: "typescript", signature: "interface BoardRiskItem"}),
  (c4:Class {name: "BoardPlanningModel", type: "class", language: "typescript", signature: "interface BoardPlanningModel"}),
  (fn1:Function {name: "getBoardRisk", type: "function", language: "typescript", signature: "function getBoardRisk(issue: IssueSummary, today?: string): BoardRiskItem['risk']"}),
  (fn2:Function {name: "buildBoardColumns", type: "function", language: "typescript", signature: "function buildBoardColumns(issues: IssueSummary[], statuses?: IssueStatus[], wipLimits?: Partial<Record<IssueStatus, number>>): BoardColumnModel[]"}),
  (fn3:Function {name: "buildBoardSwimlanes", type: "function", language: "typescript", signature: "function buildBoardSwimlanes(issues: IssueSummary[], today?: string): BoardSwimlaneModel[]"}),
  (fn4:Function {name: "buildBoardPlanningModel", type: "function", language: "typescript", signature: "function buildBoardPlanningModel(issues: IssueSummary[], today?: string): BoardPlanningModel"}),
  (v1:Variable {name: "DEFAULT_BOARD_STATUSES", type: "variable"}),
  (v2:Variable {name: "BOARD_WIP_LIMITS", type: "variable"}),
  (v3:Variable {name: "PRIORITY_ORDER", type: "variable"}),
  (v4:Variable {name: "issues", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v4),
  (fn4)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn3),
  (fn4)-[:USES]->(v4);
```
*/

import type { IssuePriority, IssueStatus, IssueSummary } from '@/types/production';

export const DEFAULT_BOARD_STATUSES: IssueStatus[] = [
  'backlog',
  'brief_ready',
  'assigned',
  'in_progress',
  'submitted',
  'internal_review',
  'client_review',
  'revision_required',
  'approved',
  'delivered',
];

export const BOARD_WIP_LIMITS: Partial<Record<IssueStatus, number>> = {
  assigned: 6,
  in_progress: 6,
  submitted: 4,
  internal_review: 4,
  client_review: 3,
  revision_required: 3,
  approved: 5,
};

const PRIORITY_ORDER: IssuePriority[] = ['urgent', 'high', 'medium', 'low'];
const TERMINAL_STATUSES: IssueStatus[] = ['delivered', 'archived'];
const REVIEW_STATUSES: IssueStatus[] = [
  'submitted',
  'internal_review',
  'client_review',
  'revision_required',
];
const STATUS_LABELS: Partial<Record<IssueStatus, string>> = {
  backlog: 'Backlog',
  brief_ready: 'Brief Ready',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  internal_review: 'Internal Review',
  client_review: 'Client Review',
  revision_required: 'Revision Required',
  approved: 'Approved',
  delivered: 'Delivered',
};
const RISK_WEIGHT: Record<BoardRiskItem['risk'], number> = {
  overdue: 4,
  missing_evidence: 3,
  qa_warning: 2,
  high_priority: 1,
  none: 0,
};

export interface BoardColumnModel {
  status: IssueStatus;
  label: string;
  issues: IssueSummary[];
  count: number;
  storyPoints: number;
  limit?: number;
  wipState: 'healthy' | 'at_limit' | 'over_limit' | 'unlimited';
}

export interface BoardSwimlaneModel {
  priority: IssuePriority;
  count: number;
  reviewCount: number;
  riskCount: number;
  storyPoints: number;
}

export interface BoardRiskItem {
  issue: IssueSummary;
  risk: 'overdue' | 'missing_evidence' | 'qa_warning' | 'high_priority' | 'none';
}

export interface BoardPlanningModel {
  columns: BoardColumnModel[];
  swimlanes: BoardSwimlaneModel[];
  riskQueue: BoardRiskItem[];
  totalIssues: number;
  totalStoryPoints: number;
  wipBreachCount: number;
  reviewPressureCount: number;
}

export function getBoardRisk(
  issue: IssueSummary,
  today = new Date().toISOString().slice(0, 10),
): BoardRiskItem['risk'] {
  if (issue.due_date && issue.due_date < today && !TERMINAL_STATUSES.includes(issue.status)) {
    return 'overdue';
  }
  if (issue.asset_count === 0 && REVIEW_STATUSES.includes(issue.status)) {
    return 'missing_evidence';
  }
  if (issue.qa_status === 'failed' || issue.qa_status === 'warning') {
    return 'qa_warning';
  }
  if (issue.priority === 'urgent') {
    return 'high_priority';
  }
  return 'none';
}

export function buildBoardColumns(
  issues: IssueSummary[],
  statuses = DEFAULT_BOARD_STATUSES,
  wipLimits = BOARD_WIP_LIMITS,
): BoardColumnModel[] {
  return statuses.map((status) => {
    const columnIssues = issues.filter((issue) => issue.status === status);
    const limit = wipLimits[status];
    const count = columnIssues.length;
    const wipState =
      limit === undefined
        ? 'unlimited'
        : count > limit
          ? 'over_limit'
          : count === limit
            ? 'at_limit'
            : 'healthy';

    return {
      status,
      label: STATUS_LABELS[status] ?? status,
      issues: columnIssues,
      count,
      storyPoints: columnIssues.reduce((sum, issue) => sum + (issue.story_points ?? 0), 0),
      limit,
      wipState,
    };
  });
}

export function buildBoardSwimlanes(issues: IssueSummary[], today?: string): BoardSwimlaneModel[] {
  return PRIORITY_ORDER.map((priority) => {
    const priorityIssues = issues.filter((issue) => issue.priority === priority);
    return {
      priority,
      count: priorityIssues.length,
      reviewCount: priorityIssues.filter((issue) => REVIEW_STATUSES.includes(issue.status)).length,
      riskCount: priorityIssues.filter((issue) => getBoardRisk(issue, today) !== 'none').length,
      storyPoints: priorityIssues.reduce((sum, issue) => sum + (issue.story_points ?? 0), 0),
    };
  });
}

export function buildBoardPlanningModel(
  issues: IssueSummary[],
  today?: string,
): BoardPlanningModel {
  const columns = buildBoardColumns(issues);
  const riskQueue = issues
    .map((issue) => ({ issue, risk: getBoardRisk(issue, today) }))
    .filter((item) => item.risk !== 'none')
    .sort((left, right) => {
      const weightDelta = RISK_WEIGHT[right.risk] - RISK_WEIGHT[left.risk];
      if (weightDelta !== 0) return weightDelta;
      return (left.issue.due_date ?? '').localeCompare(right.issue.due_date ?? '');
    });

  return {
    columns,
    swimlanes: buildBoardSwimlanes(issues, today),
    riskQueue,
    totalIssues: issues.length,
    totalStoryPoints: issues.reduce((sum, issue) => sum + (issue.story_points ?? 0), 0),
    wipBreachCount: columns.filter((column) => column.wipState === 'over_limit').length,
    reviewPressureCount: issues.filter((issue) => REVIEW_STATUSES.includes(issue.status)).length,
  };
}
