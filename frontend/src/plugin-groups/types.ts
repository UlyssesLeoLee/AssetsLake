/*
```cypher
CREATE
  (f:File {name: "types.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/types", type: "module"}),
  (c1:Class {name: "PluginManifest", type: "class", language: "typescript", signature: "interface PluginManifest"}),
  (c2:Class {name: "PluginAppPolicy", type: "class", language: "typescript", signature: "interface PluginAppPolicy"}),
  (fn1:Function {name: "flattenProductApps", type: "function", language: "typescript", signature: "function flattenProductApps(product: ProductArchitecture): PluginApp[]"}),
  (fn2:Function {name: "flattenAppPluginGroups", type: "function", language: "typescript", signature: "function flattenAppPluginGroups(app: PluginApp): ResolvedPluginGroup[]"}),
  (fn3:Function {name: "flattenGroupPlugins", type: "function", language: "typescript", signature: "function flattenGroupPlugins(group: PluginGroup, app?: PluginApp): Plugin[]"}),
  (fn4:Function {name: "flattenPluginRoutes", type: "function", language: "typescript", signature: "function flattenPluginRoutes(groups: readonly PluginGroup[], app?: PluginApp): PluginRoute[]"}),
  (fn5:Function {name: "flattenAppPlugins", type: "function", language: "typescript", signature: "function flattenAppPlugins(app: PluginApp): Plugin[]"}),
  (fn6:Function {name: "flattenAppPluginRoutes", type: "function", language: "typescript", signature: "function flattenAppPluginRoutes(app: PluginApp): PluginRoute[]"}),
  (fn7:Function {name: "navPluginRoutes", type: "function", language: "typescript", signature: "function navPluginRoutes(groups: readonly PluginGroup[], app?: PluginApp): PluginRoute[]"}),
  (fn8:Function {name: "navAppPluginRoutes", type: "function", language: "typescript", signature: "function navAppPluginRoutes(app: PluginApp): PluginRoute[]"}),
  (fn9:Function {name: "filterEnabledPluginsForApp", type: "function", language: "typescript", signature: "function filterEnabledPluginsForApp(app: PluginApp | undefined, plugins: readonly Plugin[]): Plugin[]"}),
  (fn10:Function {name: "isPluginEnabledForApp", type: "function", language: "typescript", signature: "function isPluginEnabledForApp(plugin: Plugin, app?: PluginApp): boolean"}),
  (v1:Variable {name: "product", type: "variable"}),
  (v2:Variable {name: "app", type: "variable"}),
  (v3:Variable {name: "group", type: "variable"}),
  (v4:Variable {name: "groups", type: "variable"}),
  (v5:Variable {name: "plugins", type: "variable"}),
  (v6:Variable {name: "routes", type: "variable"}),
  (v7:Variable {name: "policy", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
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
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn9),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn3),
  (fn4)-[:USES]->(v4),
  (fn4)-[:USES]->(v6),
  (fn5)-[:CALLS]->(fn2),
  (fn5)-[:USES]->(v2),
  (fn6)-[:CALLS]->(fn2),
  (fn6)-[:USES]->(v2),
  (fn7)-[:CALLS]->(fn4),
  (fn7)-[:USES]->(v4),
  (fn8)-[:CALLS]->(fn6),
  (fn8)-[:USES]->(v2),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:USES]->(v2),
  (fn9)-[:USES]->(v5),
  (fn10)-[:USES]->(v2),
  (fn10)-[:USES]->(v7);
```
*/

import type { LucideIcon } from 'lucide-react';

export type ProductArchitectureId = 'assetslake-product';

export type PluginAppId = 'studio-console' | 'production-console' | 'asset-console' | 'verification-app';

export type PluginGroupId =
  | 'workspace'
  | 'asset-library'
  | 'production-management'
  | 'production-planning'
  | 'production-execution'
  | 'production-timeline'
  | 'production-reporting'
  | 'production-workflow'
  | 'production-delivery'
  | 'production-enterprise'
  | 'identity-verification';

export type PluginId =
  | 'workspace.home'
  | 'production.ai-control'
  | 'production.management'
  | 'production.planning'
  | 'production.board'
  | 'production.briefs'
  | 'production.reviews'
  | 'production.approvals'
  | 'production.delivery'
  | 'production.milestones'
  | 'production.gantt'
  | 'production.calendar'
  | 'production.reports'
  | 'production.workflow'
  | 'production.automation'
  | 'production.enterprise'
  | 'production.vendors'
  | 'production.ai-orchestration'
  | 'production.data-lake'
  | 'verification.sms'
  | 'assets.library'
  | 'assets.query'
  | 'assets.upload';

export type PluginPermission =
  | 'project:read'
  | 'project:write'
  | 'issue:read'
  | 'issue:write'
  | 'asset:read'
  | 'asset:write'
  | 'workflow:read'
  | 'workflow:write'
  | 'automation:read'
  | 'automation:approve'
  | 'enterprise:admin'
  | 'report:read'
  | 'delivery:write'
  | 'verification:read'
  | 'verification:write'
  | 'verification:admin';

export type PluginLifecycle = 'ready' | 'guarded' | 'planned';

export interface PluginManifest {
  permissions: readonly PluginPermission[];
  dependencies?: readonly PluginId[];
  featureFlag?: string;
  lifecycle: PluginLifecycle;
  backendScopes: readonly string[];
}

export interface PluginAppPolicy {
  enabledPlugins?: readonly PluginId[];
  disabledPlugins?: readonly PluginId[];
  allowedPermissions?: readonly PluginPermission[];
}

export interface PluginRoute {
  id: string;
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  exact?: boolean;
  nav?: boolean;
  order: number;
  pluginId?: PluginId;
  pluginLabel?: string;
  pluginAppId?: PluginAppId;
  pluginAppLabel?: string;
  pluginGroupId?: PluginGroupId;
  pluginGroupLabel?: string;
}

export interface Plugin {
  id: PluginId;
  label: string;
  description: string;
  icon: LucideIcon;
  order: number;
  nav?: boolean;
  apiScopes?: readonly string[];
  manifest: PluginManifest;
  routes: readonly PluginRoute[];
  pluginAppId?: PluginAppId;
  pluginAppLabel?: string;
  pluginGroupId?: PluginGroupId;
  pluginGroupLabel?: string;
}

export interface PluginGroup {
  id: PluginGroupId;
  label: string;
  description: string;
  order: number;
  apiScopes: readonly string[];
  plugins: readonly Plugin[];
  routes?: readonly PluginRoute[];
  pluginAppId?: PluginAppId;
  pluginAppLabel?: string;
}

export interface ResolvedPluginGroup extends PluginGroup {
  pluginAppId: PluginAppId;
  pluginAppLabel: string;
  plugins: readonly Plugin[];
  routes: readonly PluginRoute[];
}

export interface PluginApp {
  id: PluginAppId;
  label: string;
  description: string;
  order: number;
  policy?: PluginAppPolicy;
  pluginGroups: readonly PluginGroup[];
}

export interface ProductArchitecture {
  id: ProductArchitectureId;
  label: string;
  description: string;
  apps: readonly PluginApp[];
}

export function flattenProductApps(product: ProductArchitecture): PluginApp[] {
  return [...product.apps].sort((a, b) => a.order - b.order);
}

export function flattenAppPluginGroups(app: PluginApp): ResolvedPluginGroup[] {
  return app.pluginGroups
    .map((group) => {
      const scopedGroup: PluginGroup = {
        ...group,
        pluginAppId: app.id,
        pluginAppLabel: app.label,
      };

      return {
        ...scopedGroup,
        plugins: flattenGroupPlugins(scopedGroup, app),
        routes: flattenPluginRoutes([scopedGroup], app),
        pluginAppId: app.id,
        pluginAppLabel: app.label,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function flattenGroupPlugins(group: PluginGroup, app?: PluginApp): Plugin[] {
  return filterEnabledPluginsForApp(app, group.plugins)
    .map((plugin) => ({
      ...plugin,
      pluginAppId: group.pluginAppId,
      pluginAppLabel: group.pluginAppLabel,
      pluginGroupId: group.id,
      pluginGroupLabel: group.label,
    }))
    .sort((a, b) => a.order - b.order);
}

export function flattenPluginRoutes(groups: readonly PluginGroup[], app?: PluginApp): PluginRoute[] {
  return groups
    .flatMap((group) =>
      flattenGroupPlugins(group, app).flatMap((plugin) =>
        plugin.routes.map((route) => ({
          ...route,
          nav: route.nav ?? plugin.nav,
          pluginId: plugin.id,
          pluginLabel: plugin.label,
          pluginAppId: plugin.pluginAppId,
          pluginAppLabel: plugin.pluginAppLabel,
          pluginGroupId: plugin.pluginGroupId,
          pluginGroupLabel: plugin.pluginGroupLabel,
        }))
      )
    )
    .sort((a, b) => a.order - b.order);
}

export function filterEnabledPluginsForApp(app: PluginApp | undefined, plugins: readonly Plugin[]): Plugin[] {
  return plugins.filter((plugin) => isPluginEnabledForApp(plugin, app));
}

export function isPluginEnabledForApp(plugin: Plugin, app?: PluginApp): boolean {
  const policy = app?.policy;
  if (!policy) {
    return true;
  }

  if (policy.enabledPlugins && !policy.enabledPlugins.includes(plugin.id)) {
    return false;
  }

  if (policy.disabledPlugins?.includes(plugin.id)) {
    return false;
  }

  const allowedPermissions = policy.allowedPermissions;
  if (allowedPermissions) {
    return plugin.manifest.permissions.every((permission) => allowedPermissions.includes(permission));
  }

  return true;
}

export function flattenAppPlugins(app: PluginApp): Plugin[] {
  return flattenAppPluginGroups(app)
    .flatMap((group) => group.plugins)
    .sort((a, b) => a.order - b.order);
}

export function flattenAppPluginRoutes(app: PluginApp): PluginRoute[] {
  return flattenAppPluginGroups(app)
    .flatMap((group) => group.routes)
    .sort((a, b) => a.order - b.order);
}

export function navPluginRoutes(groups: readonly PluginGroup[], app?: PluginApp): PluginRoute[] {
  return flattenPluginRoutes(groups, app).filter((route) => route.nav);
}

export function navAppPluginRoutes(app: PluginApp): PluginRoute[] {
  return flattenAppPluginRoutes(app).filter((route) => route.nav);
}
