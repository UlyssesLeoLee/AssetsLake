/*
```cypher
CREATE
  (f:File {name: "validation.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/validation", type: "module"}),
  (c1:Class {name: "PluginArchitectureIssue", type: "class", language: "typescript", signature: "interface PluginArchitectureIssue"}),
  (c2:Class {name: "PluginArchitectureHealth", type: "class", language: "typescript", signature: "interface PluginArchitectureHealth"}),
  (fn1:Function {name: "validateProductArchitecture", type: "function", language: "typescript", signature: "function validateProductArchitecture(product: ProductArchitecture): PluginArchitectureHealth"}),
  (fn2:Function {name: "assertHealthyProductArchitecture", type: "function", language: "typescript", signature: "function assertHealthyProductArchitecture<T extends ProductArchitecture>(product: T): T"}),
  (fn3:Function {name: "formatProductArchitectureIssues", type: "function", language: "typescript", signature: "function formatProductArchitectureIssues(issues: readonly PluginArchitectureIssue[]): string"}),
  (fn4:Function {name: "validateApp", type: "function", language: "typescript", signature: "function validateApp(app: PluginApp, issues: PluginArchitectureIssue[]): void"}),
  (fn5:Function {name: "validateGroup", type: "function", language: "typescript", signature: "function validateGroup(group: PluginGroup, path: string, issues: PluginArchitectureIssue[]): void"}),
  (fn6:Function {name: "validatePlugin", type: "function", language: "typescript", signature: "function validatePlugin(plugin: Plugin, path: string, issues: PluginArchitectureIssue[]): void"}),
  (fn7:Function {name: "validateRoute", type: "function", language: "typescript", signature: "function validateRoute(route: PluginRoute, path: string, issues: PluginArchitectureIssue[]): void"}),
  (fn8:Function {name: "expectUnique", type: "function", language: "typescript", signature: "function expectUnique<T>(items: readonly T[], path: string, code: string, label: string, pick: (item: T) => string | number, issues: PluginArchitectureIssue[]): void"}),
  (fn9:Function {name: "pushIssue", type: "function", language: "typescript", signature: "function pushIssue(issues: PluginArchitectureIssue[], issue: PluginArchitectureIssue): void"}),
  (fn10:Function {name: "isBlank", type: "function", language: "typescript", signature: "function isBlank(value: string | undefined): boolean"}),
  (v1:Variable {name: "product", type: "variable"}),
  (v2:Variable {name: "issues", type: "variable"}),
  (v3:Variable {name: "app", type: "variable"}),
  (v4:Variable {name: "group", type: "variable"}),
  (v5:Variable {name: "plugin", type: "variable"}),
  (v6:Variable {name: "route", type: "variable"}),
  (v7:Variable {name: "manifest", type: "variable"}),
  (v8:Variable {name: "pluginIds", type: "variable"}),
  (v9:Variable {name: "policy", type: "variable"}),
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
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:CALLS]->(fn3),
  (fn4)-[:CALLS]->(fn5),
  (fn4)-[:CALLS]->(fn8),
  (fn4)-[:USES]->(v3),
  (fn4)-[:USES]->(v8),
  (fn4)-[:USES]->(v9),
  (fn5)-[:CALLS]->(fn6),
  (fn5)-[:CALLS]->(fn8),
  (fn5)-[:USES]->(v4),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:CALLS]->(fn8),
  (fn6)-[:USES]->(v5),
  (fn6)-[:USES]->(v7),
  (fn7)-[:CALLS]->(fn10),
  (fn7)-[:USES]->(v6),
  (fn8)-[:CALLS]->(fn9);
```
*/

import type { Plugin, PluginApp, PluginGroup, PluginRoute, ProductArchitecture } from '@/plugin-groups/types';

export type PluginArchitectureIssueSeverity = 'error' | 'warning';

export interface PluginArchitectureIssue {
  severity: PluginArchitectureIssueSeverity;
  code: string;
  path: string;
  message: string;
}

export interface PluginArchitectureHealth {
  ok: boolean;
  errors: PluginArchitectureIssue[];
  warnings: PluginArchitectureIssue[];
}

export function validateProductArchitecture(product: ProductArchitecture): PluginArchitectureHealth {
  const issues: PluginArchitectureIssue[] = [];

  if (isBlank(product.id)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'product.id.required',
      path: 'product',
      message: 'Product id is required.',
    });
  }

  if (product.apps.length < 2) {
    pushIssue(issues, {
      severity: 'error',
      code: 'product.apps.multiple-required',
      path: 'product.apps',
      message: 'A product architecture must be composed from multiple plugin apps.',
    });
  }

  expectUnique(product.apps, 'product.apps', 'app.id.unique', 'plugin app id', (app) => app.id, issues);
  product.apps.forEach((app) => validateApp(app, issues));

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  return { ok: errors.length === 0, errors, warnings };
}

export function assertHealthyProductArchitecture<T extends ProductArchitecture>(product: T): T {
  const health = validateProductArchitecture(product);
  if (!health.ok) {
    throw new Error(formatProductArchitectureIssues(health.errors));
  }

  return product;
}

export function formatProductArchitectureIssues(issues: readonly PluginArchitectureIssue[]): string {
  return issues.map((issue) => `[${issue.severity}] ${issue.path} ${issue.code}: ${issue.message}`).join('\n');
}

function validateApp(app: PluginApp, issues: PluginArchitectureIssue[]): void {
  const path = `product.apps.${app.id}`;

  if (isBlank(app.label)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'app.label.required',
      path,
      message: 'Plugin app label is required.',
    });
  }

  if (app.pluginGroups.length < 2) {
    pushIssue(issues, {
      severity: 'error',
      code: 'app.groups.multiple-required',
      path: `${path}.pluginGroups`,
      message: 'Each plugin app must be composed from multiple plugin groups.',
    });
  }

  const plugins = app.pluginGroups.flatMap((group) => group.plugins);
  const routes = plugins.flatMap((plugin) => plugin.routes);
  const pluginIds = new Set(plugins.map((plugin) => plugin.id));
  const policy = app.policy;

  expectUnique(app.pluginGroups, `${path}.pluginGroups`, 'group.id.unique', 'plugin group id', (group) => group.id, issues);
  expectUnique(plugins, `${path}.plugins`, 'plugin.id.unique', 'plugin id', (plugin) => plugin.id, issues);
  expectUnique(routes, `${path}.routes`, 'route.id.unique', 'route id', (route) => route.id, issues);
  expectUnique(routes, `${path}.routes`, 'route.href.unique', 'route href', (route) => route.href, issues);
  expectUnique(routes, `${path}.routes`, 'route.order.unique', 'route order', (route) => route.order, issues);

  for (const plugin of plugins) {
    for (const dependencyId of plugin.manifest?.dependencies ?? []) {
      if (!pluginIds.has(dependencyId)) {
        pushIssue(issues, {
          severity: 'error',
          code: 'plugin.dependency.missing',
          path: `${path}.plugins.${plugin.id}.manifest.dependencies`,
          message: `Plugin ${plugin.id} depends on ${dependencyId}, but the app does not include that plugin.`,
        });
      }
    }
  }

  for (const pluginId of [...(policy?.enabledPlugins ?? []), ...(policy?.disabledPlugins ?? [])]) {
    if (!pluginIds.has(pluginId)) {
      pushIssue(issues, {
        severity: 'error',
        code: 'app.policy.plugin.unknown',
        path: `${path}.policy`,
        message: `App policy references plugin ${pluginId}, but the app does not include that plugin group.`,
      });
    }
  }

  for (const pluginId of policy?.enabledPlugins ?? []) {
    if (policy?.disabledPlugins?.includes(pluginId)) {
      pushIssue(issues, {
        severity: 'error',
        code: 'app.policy.plugin.conflict',
        path: `${path}.policy`,
        message: `App policy both enables and disables plugin ${pluginId}.`,
      });
    }
  }

  app.pluginGroups.forEach((group) => validateGroup(group, `${path}.pluginGroups.${group.id}`, issues));
}

function validateGroup(group: PluginGroup, path: string, issues: PluginArchitectureIssue[]): void {
  if (isBlank(group.label)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'group.label.required',
      path,
      message: 'Plugin group label is required.',
    });
  }

  if (group.plugins.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'group.plugins.required',
      path: `${path}.plugins`,
      message: 'Plugin group must contain at least one plugin.',
    });
  }

  if (group.apiScopes.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'group.apiScopes.required',
      path: `${path}.apiScopes`,
      message: 'Plugin group must declare API scopes.',
    });
  }

  expectUnique(group.plugins, `${path}.plugins`, 'plugin.order.unique-in-group', 'plugin order', (plugin) => plugin.order, issues);
  group.plugins.forEach((plugin) => validatePlugin(plugin, `${path}.plugins.${plugin.id}`, issues));
}

function validatePlugin(plugin: Plugin, path: string, issues: PluginArchitectureIssue[]): void {
  const manifest = plugin.manifest;

  if (isBlank(plugin.label)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'plugin.label.required',
      path,
      message: 'Plugin label is required.',
    });
  }

  if (plugin.apiScopes?.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'plugin.apiScopes.required',
      path: `${path}.apiScopes`,
      message: 'Plugin must declare API scopes.',
    });
  }

  if (!manifest) {
    pushIssue(issues, {
      severity: 'error',
      code: 'plugin.manifest.required',
      path: `${path}.manifest`,
      message: 'Plugin manifest is required.',
    });
  } else {
    if (manifest.permissions.length === 0) {
      pushIssue(issues, {
        severity: 'error',
        code: 'plugin.manifest.permissions.required',
        path: `${path}.manifest.permissions`,
        message: 'Plugin manifest must declare permissions.',
      });
    }

    if (manifest.backendScopes.length === 0) {
      pushIssue(issues, {
        severity: 'error',
        code: 'plugin.manifest.backendScopes.required',
        path: `${path}.manifest.backendScopes`,
        message: 'Plugin manifest must declare backend scopes.',
      });
    }

    if (isBlank(manifest.lifecycle)) {
      pushIssue(issues, {
        severity: 'error',
        code: 'plugin.manifest.lifecycle.required',
        path: `${path}.manifest.lifecycle`,
        message: 'Plugin manifest must declare lifecycle state.',
      });
    }
  }

  if (plugin.nav && plugin.routes.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'plugin.nav.route-required',
      path: `${path}.routes`,
      message: 'A navigation plugin must expose at least one route.',
    });
  }

  expectUnique(plugin.routes, `${path}.routes`, 'route.order.unique-in-plugin', 'route order', (route) => route.order, issues);
  plugin.routes.forEach((route) => validateRoute(route, `${path}.routes.${route.id}`, issues));
}

function validateRoute(route: PluginRoute, path: string, issues: PluginArchitectureIssue[]): void {
  if (isBlank(route.id)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'route.id.required',
      path,
      message: 'Route id is required.',
    });
  }

  if (isBlank(route.href) || !route.href.startsWith('/')) {
    pushIssue(issues, {
      severity: 'error',
      code: 'route.href.absolute',
      path,
      message: 'Route href must be an absolute app path.',
    });
  }

  if (isBlank(route.label)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'route.label.required',
      path,
      message: 'Route label is required.',
    });
  }

  if (!Number.isFinite(route.order)) {
    pushIssue(issues, {
      severity: 'error',
      code: 'route.order.required',
      path,
      message: 'Route order must be finite.',
    });
  }
}

function expectUnique<T>(
  items: readonly T[],
  path: string,
  code: string,
  label: string,
  pick: (item: T) => string | number,
  issues: PluginArchitectureIssue[]
): void {
  const seen = new Set<string | number>();
  for (const item of items) {
    const value = pick(item);
    if (seen.has(value)) {
      pushIssue(issues, {
        severity: 'error',
        code,
        path,
        message: `Duplicate ${label}: ${value}.`,
      });
      continue;
    }
    seen.add(value);
  }
}

function pushIssue(issues: PluginArchitectureIssue[], issue: PluginArchitectureIssue): void {
  issues.push(issue);
}

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim().length === 0;
}
