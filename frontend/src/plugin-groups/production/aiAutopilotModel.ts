/*
```cypher
CREATE
  (f:File {name: "aiAutopilotModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/aiAutopilotModel", type: "module"}),
  (c1:Class {name: "AutopilotMode", type: "class", language: "typescript", signature: "type AutopilotMode"}),
  (c2:Class {name: "AutopilotRisk", type: "class", language: "typescript", signature: "type AutopilotRisk"}),
  (c3:Class {name: "AutopilotCommandStatus", type: "class", language: "typescript", signature: "type AutopilotCommandStatus"}),
  (c4:Class {name: "AutopilotActionSnapshot", type: "class", language: "typescript", signature: "interface AutopilotActionSnapshot"}),
  (c5:Class {name: "AutopilotSignalSnapshot", type: "class", language: "typescript", signature: "interface AutopilotSignalSnapshot"}),
  (c6:Class {name: "BuildAutopilotPlanInput", type: "class", language: "typescript", signature: "interface BuildAutopilotPlanInput"}),
  (c7:Class {name: "AutopilotCommand", type: "class", language: "typescript", signature: "interface AutopilotCommand"}),
  (c8:Class {name: "AutopilotPlan", type: "class", language: "typescript", signature: "interface AutopilotPlan"}),
  (fn1:Function {name: "buildAutopilotPlan", type: "function", language: "typescript", signature: "function buildAutopilotPlan(input: BuildAutopilotPlanInput): AutopilotPlan", visibility: "public"}),
  (fn2:Function {name: "selectAutopilotMode", type: "function", language: "typescript", signature: "function selectAutopilotMode(input: BuildAutopilotPlanInput): AutopilotMode", visibility: "private"}),
  (fn3:Function {name: "buildPlanSummary", type: "function", language: "typescript", signature: "function buildPlanSummary(input: BuildAutopilotPlanInput, commandCount: number): string", visibility: "private"}),
  (fn4:Function {name: "computeConfidence", type: "function", language: "typescript", signature: "function computeConfidence(input: BuildAutopilotPlanInput): number", visibility: "private"}),
  (fn5:Function {name: "buildCommand", type: "function", language: "typescript", signature: "function buildCommand(action: AutopilotActionSnapshot, order: number): AutopilotCommand", visibility: "private"}),
  (fn6:Function {name: "riskForAction", type: "function", language: "typescript", signature: "function riskForAction(actionId: string): AutopilotRisk", visibility: "private"}),
  (fn7:Function {name: "approvalRequiredForAction", type: "function", language: "typescript", signature: "function approvalRequiredForAction(actionId: string): boolean", visibility: "private"}),
  (fn8:Function {name: "statusForAction", type: "function", language: "typescript", signature: "function statusForAction(action: AutopilotActionSnapshot): AutopilotCommandStatus", visibility: "private"}),
  (fn9:Function {name: "intentForAction", type: "function", language: "typescript", signature: "function intentForAction(action: AutopilotActionSnapshot): string", visibility: "private"}),
  (fn10:Function {name: "impactForAction", type: "function", language: "typescript", signature: "function impactForAction(action: AutopilotActionSnapshot): string[]", visibility: "private"}),
  (fn11:Function {name: "fallbackCommand", type: "function", language: "typescript", signature: "function fallbackCommand(): AutopilotCommand", visibility: "private"}),
  (fn12:Function {name: "buildAuditTrail", type: "function", language: "typescript", signature: "function buildAuditTrail(input: BuildAutopilotPlanInput): string[]", visibility: "private"}),
  (fn13:Function {name: "slugGoal", type: "function", language: "typescript", signature: "function slugGoal(goal: string): string", visibility: "private"}),
  (v1:Variable {name: "AUTOPILOT_ACTION_ORDER", type: "variable"}),
  (v2:Variable {name: "HIGH_RISK_ACTIONS", type: "variable"}),
  (v3:Variable {name: "MEDIUM_RISK_ACTIONS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
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
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn11),
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn13),
  (fn1)-[:USES]->(v1),
  (fn5)-[:CALLS]->(fn6),
  (fn5)-[:CALLS]->(fn7),
  (fn5)-[:CALLS]->(fn8),
  (fn5)-[:CALLS]->(fn9),
  (fn5)-[:CALLS]->(fn10),
  (fn6)-[:USES]->(v2),
  (fn6)-[:USES]->(v3),
  (fn8)-[:CALLS]->(fn7);
```
*/

export type AutopilotMode = 'advisor' | 'operator' | 'manager';
export type AutopilotRisk = 'low' | 'medium' | 'high';
export type AutopilotCommandStatus = 'queued' | 'requires_approval' | 'blocked' | 'done';

export interface AutopilotActionSnapshot {
  id: string;
  title: string;
  app: string;
  targetLabel: string;
  writes: string[];
  disabled: boolean;
}

export interface AutopilotSignalSnapshot {
  id: string;
  source: string;
  strength: 'ready' | 'watch' | 'blocked';
}

export interface BuildAutopilotPlanInput {
  goal: string;
  issues: number;
  assets: number;
  codeAssets: number;
  versionedAssets: number;
  deliveryReadyPercent: number;
  actions: AutopilotActionSnapshot[];
  signals: AutopilotSignalSnapshot[];
}

export interface AutopilotCommand {
  id: string;
  actionId?: string;
  title: string;
  app: string;
  targetLabel: string;
  intent: string;
  writes: string[];
  impactPreview: string[];
  risk: AutopilotRisk;
  approvalRequired: boolean;
  status: AutopilotCommandStatus;
}

export interface AutopilotPlan {
  id: string;
  goal: string;
  mode: AutopilotMode;
  confidence: number;
  summary: string;
  commands: AutopilotCommand[];
  auditTrail: string[];
}

const AUTOPILOT_ACTION_ORDER = [
  'index-data-lake',
  'version-gate',
  'attach-asset-evidence',
  'create-issue-from-asset',
  'transition-review',
  'comment-risk',
  'log-ai-work',
  'update-asset-evidence',
];

const HIGH_RISK_ACTIONS = new Set(['create-issue-from-asset', 'transition-review']);
const MEDIUM_RISK_ACTIONS = new Set(['version-gate', 'attach-asset-evidence', 'comment-risk']);

export function buildAutopilotPlan(input: BuildAutopilotPlanInput): AutopilotPlan {
  const actionsById = new Map(input.actions.map((action) => [action.id, action]));
  const commands = AUTOPILOT_ACTION_ORDER
    .map((actionId) => actionsById.get(actionId))
    .filter((action): action is AutopilotActionSnapshot => Boolean(action))
    .slice(0, 6)
    .map(buildCommand);

  const finalCommands = commands.length > 0 ? commands : [fallbackCommand()];

  return {
    id: `plan-${slugGoal(input.goal)}-${input.actions.length}-${input.signals.length}`,
    goal: input.goal.trim() || 'Drive the project toward delivery readiness',
    mode: selectAutopilotMode(input),
    confidence: computeConfidence(input),
    summary: buildPlanSummary(input, finalCommands.length),
    commands: finalCommands,
    auditTrail: buildAuditTrail(input),
  };
}

function selectAutopilotMode(input: BuildAutopilotPlanInput): AutopilotMode {
  if (input.deliveryReadyPercent >= 75 && input.signals.every((signal) => signal.strength !== 'blocked')) {
    return 'manager';
  }
  if (input.actions.some((action) => !action.disabled)) {
    return 'operator';
  }
  return 'advisor';
}

function buildPlanSummary(input: BuildAutopilotPlanInput, commandCount: number): string {
  return `${commandCount} commands across ${input.assets} lake assets, ${input.versionedAssets} versioned records, and ${input.issues} Jira-style issues.`;
}

function computeConfidence(input: BuildAutopilotPlanInput): number {
  let score = 0.42;
  if (input.assets > 0) score += 0.14;
  if (input.issues > 0) score += 0.14;
  if (input.codeAssets > 0) score += 0.1;
  if (input.versionedAssets > 0) score += 0.1;
  if (input.deliveryReadyPercent >= 50) score += 0.1;
  return Math.min(0.92, Number(score.toFixed(2)));
}

function buildCommand(action: AutopilotActionSnapshot, order: number): AutopilotCommand {
  return {
    id: `cmd-${order + 1}-${action.id}`,
    actionId: action.id,
    title: action.title,
    app: action.app,
    targetLabel: action.targetLabel,
    intent: intentForAction(action),
    writes: action.writes,
    impactPreview: impactForAction(action),
    risk: riskForAction(action.id),
    approvalRequired: approvalRequiredForAction(action.id),
    status: statusForAction(action),
  };
}

function riskForAction(actionId: string): AutopilotRisk {
  if (HIGH_RISK_ACTIONS.has(actionId)) return 'high';
  if (MEDIUM_RISK_ACTIONS.has(actionId)) return 'medium';
  return 'low';
}

function approvalRequiredForAction(actionId: string): boolean {
  return riskForAction(actionId) !== 'low';
}

function statusForAction(action: AutopilotActionSnapshot): AutopilotCommandStatus {
  if (action.disabled) return 'blocked';
  return approvalRequiredForAction(action.id) ? 'requires_approval' : 'queued';
}

function intentForAction(action: AutopilotActionSnapshot): string {
  if (action.id === 'index-data-lake') return 'Record a replica proposal to promote useful lake records into AI-readable retrieval context.';
  if (action.id === 'version-gate') return 'Record a replica branch-style gate proposal for the most relevant asset version.';
  if (action.id === 'attach-asset-evidence') return 'Record a replica evidence-link proposal for the strongest Jira-style work item.';
  if (action.id === 'create-issue-from-asset') return 'Record a replica follow-up issue proposal from selected lake evidence.';
  if (action.id === 'transition-review') return 'Record a replica review-lane transition proposal after evidence is prepared.';
  if (action.id === 'comment-risk') return 'Record a replica risk-note proposal for the strongest issue target.';
  return `Record ${action.title} through the replica-only control bus.`;
}

function impactForAction(action: AutopilotActionSnapshot): string[] {
  return [
    `Target: ${action.targetLabel}`,
    `App boundary: ${action.app}`,
    `Replica writes: ${action.writes.join(', ') || 'none'}`,
  ];
}

function fallbackCommand(): AutopilotCommand {
  return {
    id: 'cmd-observe-context',
    title: 'Observe Context',
    app: 'AI Control',
    targetLabel: 'No executable target',
    intent: 'Collect more lake, version, and issue context before recording replica shadow actions.',
    writes: [],
    impactPreview: ['No product data will be modified.'],
    risk: 'low',
    approvalRequired: false,
    status: 'blocked',
  };
}

function buildAuditTrail(input: BuildAutopilotPlanInput): string[] {
  return [
    `Goal captured: ${input.goal.trim() || 'delivery readiness'}`,
    `Observed ${input.assets} assets, ${input.versionedAssets} versioned records, and ${input.issues} issues.`,
    `Guardrails: high and medium risk commands require approval before replica recording.`,
  ];
}

function slugGoal(goal: string): string {
  return (goal.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'delivery-readiness').replace(/^-|-$/g, '');
}
