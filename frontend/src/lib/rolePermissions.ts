/*
```cypher
CREATE
  (f:File {name: "rolePermissions.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/rolePermissions", type: "module"}),
  (fn1:Function {name: "normalizeRole", type: "function", language: "typescript", signature: "function normalizeRole(role?: string | null): string"}),
  (fn2:Function {name: "rolePermissionSet", type: "function", language: "typescript", signature: "function rolePermissionSet(role?: string | null): ReadonlySet<PluginPermission>"}),
  (fn3:Function {name: "roleHasPermission", type: "function", language: "typescript", signature: "function roleHasPermission(role: string | null | undefined, permission: PluginPermission): boolean"}),
  (fn4:Function {name: "routePermissionRequirements", type: "function", language: "typescript", signature: "function routePermissionRequirements(routeId?: string): readonly PluginPermission[]"}),
  (fn5:Function {name: "roleCanAccessRouteId", type: "function", language: "typescript", signature: "function roleCanAccessRouteId(role: string | null | undefined, routeId?: string): boolean"}),
  (fn6:Function {name: "filterPluginRoutesForRole", type: "function", language: "typescript", signature: "function filterPluginRoutesForRole<T extends Pick<PluginRoute, 'id'>>(routes: readonly T[], role?: string | null): T[]"}),
  (v1:Variable {name: "PUBLIC_ROUTE_IDS", type: "variable"}),
  (v2:Variable {name: "ROUTE_PERMISSION_REQUIREMENTS", type: "variable"}),
  (v3:Variable {name: "ROLE_PERMISSIONS", type: "variable"}),
  (v4:Variable {name: "ALL_PLUGIN_PERMISSIONS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn2),
  (fn4)-[:USES]->(v2),
  (fn5)-[:CALLS]->(fn3),
  (fn5)-[:CALLS]->(fn4),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn5);
```
*/

import type { PluginPermission, PluginRoute } from '@/plugin-groups/types';

const PUBLIC_ROUTE_IDS = new Set<string>(['workspace.home', 'verification.sms']);

const ALL_PLUGIN_PERMISSIONS: readonly PluginPermission[] = [
  'asset:read',
  'asset:write',
  'automation:approve',
  'automation:read',
  'delivery:write',
  'enterprise:admin',
  'issue:read',
  'issue:write',
  'observability:read',
  'project:read',
  'project:write',
  'report:read',
  'settings:read',
  'settings:write',
  'verification:admin',
  'verification:read',
  'verification:write',
  'wiki:read',
  'wiki:write',
  'design-requirement:read',
  'design-requirement:write',
  'design-requirement:ai',
  'people:read',
  'people:write',
  'people:evaluate',
  'people:admin',
  'workflow:read',
  'workflow:write',
];

const ROUTE_PERMISSION_REQUIREMENTS: Record<string, readonly PluginPermission[]> = {
  'admin.control': ['enterprise:admin'],
  'assets.library': ['asset:read'],
  'assets.query': ['report:read'],
  'assets.upload': ['asset:write'],
  'design.requirements': ['design-requirement:read'],
  'observability.runtime': ['observability:read'],
  'people.intelligence': ['people:read'],
  'production.ai-control': ['automation:read'],
  'production.approvals': ['automation:approve'],
  'production.automation': ['automation:read'],
  'production.board': ['issue:read'],
  'production.board.detail': ['issue:read'],
  'production.briefs': ['issue:read'],
  'production.calendar': ['project:read'],
  'production.delivery': ['delivery:write'],
  'production.enterprise': ['enterprise:admin'],
  'production.gantt': ['project:read'],
  'production.management': ['issue:read'],
  'production.milestones': ['project:read'],
  'production.planning': ['project:read'],
  'production.reports': ['report:read'],
  'production.reviews': ['issue:read'],
  'production.security-audit': ['enterprise:admin'],
  'production.vendors': ['issue:read'],
  'production.workflow': ['workflow:read'],
  'workspace.home': ['project:read'],
  'workspace.settings': ['settings:read'],
  'wiki.editor': ['wiki:read'],
};

const ROLE_PERMISSIONS: Record<string, readonly PluginPermission[]> = {
  producer: [
    'asset:read',
    'asset:write',
    'automation:approve',
    'automation:read',
    'delivery:write',
    'issue:read',
    'issue:write',
    'observability:read',
    'project:read',
    'project:write',
    'report:read',
    'settings:read',
    'settings:write',
    'verification:read',
    'wiki:read',
    'wiki:write',
    'design-requirement:read',
    'design-requirement:write',
    'design-requirement:ai',
    'people:read',
    'people:write',
    'people:evaluate',
    'workflow:read',
    'workflow:write',
  ],
  artist: [
    'asset:read',
    'asset:write',
    'design-requirement:ai',
    'design-requirement:read',
    'design-requirement:write',
    'issue:read',
    'issue:write',
    'project:read',
    'people:read',
    'people:write',
    'people:evaluate',
    'wiki:read',
    'wiki:write',
  ],
  reviewer: [
    'asset:read',
    'automation:approve',
    'automation:read',
    'design-requirement:read',
    'design-requirement:write',
    'issue:read',
    'project:read',
    'people:read',
    'people:write',
    'people:evaluate',
    'report:read',
    'verification:read',
    'wiki:read',
    'wiki:write',
    'workflow:read',
  ],
  manager: [
    'asset:read',
    'design-requirement:read',
    'issue:read',
    'people:read',
    'people:write',
    'people:evaluate',
    'project:read',
    'report:read',
    'wiki:read',
    'wiki:write',
  ],
  viewer: ['asset:read', 'design-requirement:read', 'issue:read', 'project:read', 'wiki:read'],
  client: ['asset:read', 'design-requirement:read', 'issue:read', 'project:read', 'wiki:read'],
  vendor: ['asset:read', 'design-requirement:read', 'issue:read', 'project:read', 'wiki:read'],
};

export function normalizeRole(role?: string | null): string {
  return role?.trim().toLowerCase().replaceAll('_', '-') ?? '';
}

function rolePermissionSet(role?: string | null): ReadonlySet<PluginPermission> {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'admin') {
    return new Set(ALL_PLUGIN_PERMISSIONS);
  }
  return new Set(ROLE_PERMISSIONS[normalizedRole] ?? []);
}

export function roleHasPermission(
  role: string | null | undefined,
  permission: PluginPermission,
): boolean {
  return rolePermissionSet(role).has(permission);
}

export function routePermissionRequirements(routeId?: string): readonly PluginPermission[] {
  return routeId ? (ROUTE_PERMISSION_REQUIREMENTS[routeId] ?? []) : [];
}

export function roleCanAccessRouteId(role: string | null | undefined, routeId?: string): boolean {
  if (!routeId || PUBLIC_ROUTE_IDS.has(routeId)) {
    return true;
  }

  const requirements = routePermissionRequirements(routeId);
  if (requirements.length === 0) {
    return normalizeRole(role) === 'admin';
  }
  return requirements.every((permission) => roleHasPermission(role, permission));
}

export function filterPluginRoutesForRole<T extends Pick<PluginRoute, 'id'>>(
  routes: readonly T[],
  role?: string | null,
): T[] {
  return routes.filter((route) => roleCanAccessRouteId(role, route.id));
}
