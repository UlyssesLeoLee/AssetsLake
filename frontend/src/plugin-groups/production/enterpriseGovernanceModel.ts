/*
```cypher
CREATE
  (f:File {name: "enterpriseGovernanceModel.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/enterpriseGovernanceModel", type: "module"}),
  (c1:Class {name: "EnterpriseGovernanceRisk", type: "class", language: "typescript", signature: "interface EnterpriseGovernanceRisk"}),
  (c2:Class {name: "EnterpriseGovernanceModel", type: "class", language: "typescript", signature: "interface EnterpriseGovernanceModel"}),
  (fn1:Function {name: "buildPermissionCoverage", type: "function", language: "typescript", signature: "function buildPermissionCoverage(controls?: ProjectEnterpriseControls): string[]"}),
  (fn2:Function {name: "buildGovernanceRisks", type: "function", language: "typescript", signature: "function buildGovernanceRisks(controls?: ProjectEnterpriseControls): EnterpriseGovernanceRisk[]"}),
  (fn3:Function {name: "buildEnterpriseGovernanceModel", type: "function", language: "typescript", signature: "function buildEnterpriseGovernanceModel(controls?: ProjectEnterpriseControls): EnterpriseGovernanceModel"}),
  (v1:Variable {name: "controls", type: "variable"}),
  (v2:Variable {name: "risks", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2);
```
*/

import type { ProjectEnterpriseControls } from '@/types/projectManagement';

export interface EnterpriseGovernanceRisk {
  id: string;
  severity: 'blocked' | 'watch';
  label: string;
  detail: string;
}

export interface EnterpriseGovernanceModel {
  score: number;
  permissionCoverage: string[];
  enabledNotificationCount: number;
  requiredCiPassing: number;
  requiredCiTotal: number;
  importReadyCount: number;
  webhookActiveCount: number;
  auditDrilldownCount: number;
  risks: EnterpriseGovernanceRisk[];
}

export function buildPermissionCoverage(controls?: ProjectEnterpriseControls): string[] {
  return Array.from(new Set((controls?.roles ?? []).flatMap((role) => role.permissions))).sort();
}

export function buildGovernanceRisks(controls?: ProjectEnterpriseControls): EnterpriseGovernanceRisk[] {
  const risks: EnterpriseGovernanceRisk[] = [];
  const requiredGates = (controls?.ci_gates ?? []).filter((gate) => gate.required);
  const failingRequired = requiredGates.filter((gate) => gate.status !== 'passing');
  const disabledNotifications = (controls?.notifications ?? []).filter((notification) => !notification.enabled);
  const guardedWebhooks = (controls?.webhooks ?? []).filter((webhook) => webhook.status === 'guarded');

  if (failingRequired.length > 0) {
    risks.push({
      id: 'required_ci',
      severity: 'blocked',
      label: 'Required CI gate',
      detail: `${failingRequired.length} required gate needs attention`,
    });
  }
  if (disabledNotifications.length > 0) {
    risks.push({
      id: 'notifications',
      severity: 'watch',
      label: 'Notification coverage',
      detail: `${disabledNotifications.length} event rule is disabled`,
    });
  }
  if (guardedWebhooks.length > 0) {
    risks.push({
      id: 'webhooks',
      severity: 'watch',
      label: 'Webhook review',
      detail: `${guardedWebhooks.length} webhook requires manual review`,
    });
  }
  if ((controls?.audit.retention_days ?? 0) < 365) {
    risks.push({
      id: 'audit_retention',
      severity: 'blocked',
      label: 'Audit retention',
      detail: 'Audit retention is below one year',
    });
  }

  return risks;
}

export function buildEnterpriseGovernanceModel(controls?: ProjectEnterpriseControls): EnterpriseGovernanceModel {
  const risks = buildGovernanceRisks(controls);
  const requiredGates = (controls?.ci_gates ?? []).filter((gate) => gate.required);
  const requiredCiPassing = requiredGates.filter((gate) => gate.status === 'passing').length;
  const blockedPenalty = risks.filter((risk) => risk.severity === 'blocked').length * 25;
  const watchPenalty = risks.filter((risk) => risk.severity === 'watch').length * 10;

  return {
    score: Math.max(0, 100 - blockedPenalty - watchPenalty),
    permissionCoverage: buildPermissionCoverage(controls),
    enabledNotificationCount: (controls?.notifications ?? []).filter((notification) => notification.enabled).length,
    requiredCiPassing,
    requiredCiTotal: requiredGates.length,
    importReadyCount: (controls?.import_export ?? []).filter((job) => job.status === 'ready').length,
    webhookActiveCount: (controls?.webhooks ?? []).filter((webhook) => webhook.status === 'active').length,
    auditDrilldownCount: controls?.audit.drilldowns.length ?? 0,
    risks,
  };
}
