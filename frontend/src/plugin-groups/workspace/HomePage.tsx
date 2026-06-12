/*
```cypher
CREATE
  (f:File {name: "HomePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/workspace/HomePage", type: "module"}),
  (fn1:Function {name: "HomePage", type: "function", language: "typescript", signature: "function HomePage()"}),
  (fn2:Function {name: "AppPanel", type: "function", language: "typescript", signature: "function AppPanel(props: { app: PluginApp })"}),
  (fn3:Function {name: "PluginGroupPanel", type: "function", language: "typescript", signature: "function PluginGroupPanel(props: { group: ResolvedPluginGroup })"}),
  (fn4:Function {name: "PluginShortcut", type: "function", language: "typescript", signature: "function PluginShortcut(props: { plugin: Plugin })"}),
  (fn5:Function {name: "RouteShortcut", type: "function", language: "typescript", signature: "function RouteShortcut(props: { route: PluginRoute })"}),
  (fn6:Function {name: "CapabilityStrip", type: "function", language: "typescript", signature: "function CapabilityStrip()"}),
  (v1:Variable {name: "product", type: "variable"}),
  (v2:Variable {name: "pluginApp", type: "variable"}),
  (v3:Variable {name: "pluginApps", type: "variable"}),
  (v4:Variable {name: "pluginGroups", type: "variable"}),
  (v5:Variable {name: "navRoutes", type: "variable"}),
  (v6:Variable {name: "CAPABILITIES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn4),
  (fn4)-[:CALLS]->(fn5),
  (fn6)-[:USES]->(v6);
```
*/

import Link from 'next/link';
import { ArrowRight, Boxes } from 'lucide-react';

import {
  getDefaultPluginApp,
  getNavPluginRoutes,
  getPluginApps,
  getPluginGroups,
  getProductArchitecture,
} from '@/plugin-groups/registry';
import type { Plugin, PluginApp, PluginRoute, ResolvedPluginGroup } from '@/plugin-groups/types';

const CAPABILITIES = [
  'Qdrant Vector Search',
  'OpenSearch Full-Text',
  'Neo4j Dependency Graph',
  'Kafka Event Pipeline',
  'AI Auto-Tagging',
  'Thumbnail Generation',
  'Version Comparison',
  'Review Workflow',
  'Outsourcing Delivery',
  'Role-Based Access Control',
];

export default function HomePage() {
  const product = getProductArchitecture();
  const pluginApp = getDefaultPluginApp();
  const pluginApps = getPluginApps();
  const pluginGroups = getPluginGroups(pluginApp.id);
  const navRoutes = getNavPluginRoutes(pluginApp.id).filter((route) => route.href !== '/');

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border border-surface-border bg-surface-secondary p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {product.label} Product Architecture
                </h1>
                <p className="mt-1 text-sm text-slate-400">{product.description}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {navRoutes.slice(0, 6).map((route) => (
                <RouteShortcut key={route.id} route={route} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-secondary p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Plugin Apps
            </h2>
            <div className="mt-4 space-y-3">
              {pluginApps.map((app) => (
                <AppPanel key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {pluginGroups.map((group) => (
            <PluginGroupPanel key={group.id} group={group} />
          ))}
        </section>

        <CapabilityStrip />
      </div>
    </div>
  );
}

function AppPanel({ app }: { app: PluginApp }) {
  const pluginCount = app.pluginGroups.reduce((total, group) => total + group.plugins.length, 0);

  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-100">{app.label}</div>
          <div className="mt-1 truncate text-xs text-slate-500">{app.description}</div>
        </div>
        <span className="rounded-md border border-brand-500/25 bg-brand-500/10 px-2 py-0.5 text-xs text-brand-300">
          {app.pluginGroups.length} groups / {pluginCount} plugins
        </span>
      </div>
    </div>
  );
}

function PluginGroupPanel({ group }: { group: ResolvedPluginGroup }) {
  const Icon = group.plugins[0]?.icon ?? Boxes;

  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-brand-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-100">{group.label}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{group.description}</p>
          <div className="mt-2 text-xs text-slate-600">
            {group.plugins.length} plugins / {group.routes.length} pages
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {group.plugins.map((plugin) => (
          <PluginShortcut key={plugin.id} plugin={plugin} />
        ))}
      </div>
    </section>
  );
}

function PluginShortcut({ plugin }: { plugin: Plugin }) {
  const primaryRoute = plugin.routes[0];

  if (!primaryRoute) {
    return (
      <div className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-2.5">
        <div className="truncate text-sm font-medium text-slate-200">{plugin.label}</div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{plugin.description}</div>
      </div>
    );
  }

  return <RouteShortcut route={primaryRoute} />;
}

function RouteShortcut({ route }: { route: PluginRoute }) {
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-surface-elevated px-3 py-2.5 transition-colors hover:border-brand-500/40"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-300" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-200">
            {route.pluginLabel ?? route.label}
          </span>
          {route.description && (
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {route.description}
            </span>
          )}
        </span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-brand-300" />
    </Link>
  );
}

function CapabilityStrip() {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Extension Capabilities
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {CAPABILITIES.map((item) => (
          <span
            key={item}
            className="rounded-md border border-surface-border bg-surface-elevated px-3 py-1 text-xs text-slate-400"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
