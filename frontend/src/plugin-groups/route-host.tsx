/*
```cypher
CREATE
  (f:File {name: "route-host.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/route-host", type: "module"}),
  (c1:Class {name: "PluginRouteHostProps", type: "class", language: "typescript", signature: "type PluginRouteHostProps"}),
  (c2:Class {name: "PluginPageKey", type: "class", language: "typescript", signature: "type PluginPageKey"}),
  (c3:Class {name: "PluginPageComponent", type: "class", language: "typescript", signature: "type PluginPageComponent"}),
  (fn1:Function {name: "PluginRouteHost", type: "function", language: "typescript", signature: "function PluginRouteHost(props: PluginRouteHostProps)"}),
  (fn2:Function {name: "routeMatchesPathname", type: "function", language: "typescript", signature: "function routeMatchesPathname(route: PluginRoute, pathname: string): boolean"}),
  (v1:Variable {name: "PLUGIN_PAGE_COMPONENTS", type: "variable"}),
  (v2:Variable {name: "PLUGIN_ROUTE_PAGE_KEYS", type: "variable"}),
  (v3:Variable {name: "pathname", type: "variable"}),
  (v4:Variable {name: "expectedRouteId", type: "variable"}),
  (v5:Variable {name: "pageKey", type: "variable"}),
  (v6:Variable {name: "pluginApp", type: "variable"}),
  (v7:Variable {name: "route", type: "variable"}),
  (v8:Variable {name: "resolvedPageKey", type: "variable"}),
  (v9:Variable {name: "PageComponent", type: "variable"}),
  (v10:Variable {name: "AuthGate", type: "variable"}),
  (v11:Variable {name: "fallbackRoute", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8),
  (fn1)-[:USES]->(v9),
  (fn1)-[:USES]->(v10),
  (fn1)-[:USES]->(v11),
  (fn1)-[:CALLS]->(fn2),
  (fn2)-[:USES]->(v3);
```
*/

import dynamic from 'next/dynamic';
import type { ElementType } from 'react';
import { notFound } from 'next/navigation';

import { AuthGate } from '@/components/auth/AuthGate';
import { ObservabilityPage } from '@/plugin-groups/observability';
import { getDefaultPluginApp, getPluginRoutes, resolvePluginRoute } from '@/plugin-groups/registry';
import type { PluginRoute } from '@/plugin-groups/types';

export type PluginPageKey =
  | 'AdminControlPage'
  | 'AiControlPage'
  | 'ApprovalQueuePage'
  | 'AssetDetailPage'
  | 'AssetsPage'
  | 'AutomationPage'
  | 'BriefEditorPage'
  | 'CalendarPage'
  | 'DataLakeQueryPage'
  | 'DeliveryPackagePage'
  | 'DesignRequirementsPage'
  | 'EnterpriseAdminPage'
  | 'GanttPage'
  | 'HomePage'
  | 'IssueDetailPage'
  | 'KanbanBoardPage'
  | 'ManagementConsolePage'
  | 'MilestoneTimelinePage'
  | 'ObservabilityPage'
  | 'PeopleIntelligencePage'
  | 'PlanningPage'
  | 'ReportsPage'
  | 'ReviewBoardPage'
  | 'SecurityAuditPage'
  | 'SettingsPage'
  | 'UploadPage'
  | 'VendorDashboardPage'
  | 'VerificationAppPage'
  | 'WikiAppPage'
  | 'WorkflowPage';

type PluginPageComponent = ElementType;

type PluginRouteHostProps = {
  pathname: string;
  expectedRouteId?: string;
  pageKey?: PluginPageKey;
};

const PLUGIN_PAGE_COMPONENTS = {
  AdminControlPage: dynamic(() =>
    import('@/plugin-groups/production/AdminControlPage').then((module) => module.AdminControlPage),
  ),
  AiControlPage: dynamic(() =>
    import('@/plugin-groups/production/AiControlPage').then((module) => module.AiControlPage),
  ),
  ApprovalQueuePage: dynamic(() =>
    import('@/plugin-groups/production/ApprovalQueuePage').then(
      (module) => module.ApprovalQueuePage,
    ),
  ),
  AssetDetailPage: dynamic(() => import('@/plugin-groups/asset-library/AssetDetailPage')),
  AssetsPage: dynamic(() => import('@/plugin-groups/asset-library/AssetsPage')),
  AutomationPage: dynamic(() =>
    import('@/plugin-groups/production/AutomationPage').then((module) => module.AutomationPage),
  ),
  BriefEditorPage: dynamic(() =>
    import('@/plugin-groups/production/BriefEditorPage').then((module) => module.BriefEditorPage),
  ),
  CalendarPage: dynamic(() =>
    import('@/plugin-groups/production/CalendarPage').then((module) => module.CalendarPage),
  ),
  DataLakeQueryPage: dynamic(() => import('@/plugin-groups/asset-library/DataLakeQueryPage')),
  DeliveryPackagePage: dynamic(() =>
    import('@/plugin-groups/production/DeliveryPackagePage').then(
      (module) => module.DeliveryPackagePage,
    ),
  ),
  DesignRequirementsPage: dynamic(
    () => import('@/plugin-groups/design-requirements/DesignRequirementsPage'),
  ),
  EnterpriseAdminPage: dynamic(() =>
    import('@/plugin-groups/production/EnterpriseAdminPage').then(
      (module) => module.EnterpriseAdminPage,
    ),
  ),
  GanttPage: dynamic(() =>
    import('@/plugin-groups/production/GanttPage').then((module) => module.GanttPage),
  ),
  HomePage: dynamic(() => import('@/plugin-groups/workspace/HomePage')),
  IssueDetailPage: dynamic(() =>
    import('@/plugin-groups/production/IssueDetailPage').then((module) => module.IssueDetailPage),
  ),
  KanbanBoardPage: dynamic(() =>
    import('@/plugin-groups/production/KanbanBoardPage').then((module) => module.KanbanBoardPage),
  ),
  ManagementConsolePage: dynamic(() =>
    import('@/plugin-groups/production/ManagementConsolePage').then(
      (module) => module.ManagementConsolePage,
    ),
  ),
  MilestoneTimelinePage: dynamic(() =>
    import('@/plugin-groups/production/MilestoneTimelinePage').then(
      (module) => module.MilestoneTimelinePage,
    ),
  ),
  ObservabilityPage: ObservabilityPage as unknown as PluginPageComponent,
  PeopleIntelligencePage: dynamic(
    () => import('@/plugin-groups/people-intelligence/PeopleIntelligencePage'),
  ),
  PlanningPage: dynamic(() =>
    import('@/plugin-groups/production/PlanningPage').then((module) => module.PlanningPage),
  ),
  ReportsPage: dynamic(() =>
    import('@/plugin-groups/production/ReportsPage').then((module) => module.ReportsPage),
  ),
  ReviewBoardPage: dynamic(() =>
    import('@/plugin-groups/production/ReviewBoardPage').then((module) => module.ReviewBoardPage),
  ),
  SecurityAuditPage: dynamic(() =>
    import('@/plugin-groups/production/SecurityAuditPage').then(
      (module) => module.SecurityAuditPage,
    ),
  ),
  SettingsPage: dynamic(() => import('@/plugin-groups/settings/SettingsPage')),
  UploadPage: dynamic(() => import('@/plugin-groups/asset-library/UploadPage')),
  VendorDashboardPage: dynamic(() =>
    import('@/plugin-groups/production/VendorDashboardPage').then(
      (module) => module.VendorDashboardPage,
    ),
  ),
  VerificationAppPage: dynamic(
    () => import('@/plugin-groups/identity-verification/VerificationAppPage'),
  ),
  WikiAppPage: dynamic(() => import('@/plugin-groups/wiki/WikiAppPage')),
  WorkflowPage: dynamic(() =>
    import('@/plugin-groups/production/WorkflowPage').then((module) => module.WorkflowPage),
  ),
} satisfies Record<PluginPageKey, PluginPageComponent>;

const PLUGIN_ROUTE_PAGE_KEYS: Record<string, PluginPageKey> = {
  'admin.control': 'AdminControlPage',
  'assets.library': 'AssetsPage',
  'assets.query': 'DataLakeQueryPage',
  'assets.upload': 'UploadPage',
  'design.requirements': 'DesignRequirementsPage',
  'observability.runtime': 'ObservabilityPage',
  'people.intelligence': 'PeopleIntelligencePage',
  'production.ai-control': 'AiControlPage',
  'production.approvals': 'ApprovalQueuePage',
  'production.automation': 'AutomationPage',
  'production.board': 'KanbanBoardPage',
  'production.board.detail': 'IssueDetailPage',
  'production.briefs': 'BriefEditorPage',
  'production.calendar': 'CalendarPage',
  'production.delivery': 'DeliveryPackagePage',
  'production.enterprise': 'EnterpriseAdminPage',
  'production.gantt': 'GanttPage',
  'production.management': 'ManagementConsolePage',
  'production.milestones': 'MilestoneTimelinePage',
  'production.planning': 'PlanningPage',
  'production.reports': 'ReportsPage',
  'production.reviews': 'ReviewBoardPage',
  'production.security-audit': 'SecurityAuditPage',
  'production.vendors': 'VendorDashboardPage',
  'production.workflow': 'WorkflowPage',
  'verification.sms': 'VerificationAppPage',
  'wiki.editor': 'WikiAppPage',
  'workspace.home': 'HomePage',
  'workspace.settings': 'SettingsPage',
};

function routeMatchesPathname(route: PluginRoute, pathname: string): boolean {
  return route.exact
    ? pathname === route.href
    : pathname === route.href || pathname.startsWith(`${route.href}/`);
}

export function PluginRouteHost({ pathname, expectedRouteId, pageKey }: PluginRouteHostProps) {
  const pluginApp = getDefaultPluginApp();
  const fallbackRoute = expectedRouteId
    ? getPluginRoutes('studio-console').find(
        (candidate) =>
          candidate.id === expectedRouteId && routeMatchesPathname(candidate, pathname),
      )
    : undefined;
  const route = resolvePluginRoute(pathname, pluginApp.id) ?? fallbackRoute;

  if (!route || (expectedRouteId && route.id !== expectedRouteId)) {
    notFound();
  }

  const resolvedPageKey = pageKey ?? PLUGIN_ROUTE_PAGE_KEYS[route.id];
  const PageComponent = resolvedPageKey ? PLUGIN_PAGE_COMPONENTS[resolvedPageKey] : undefined;

  if (!PageComponent) {
    notFound();
  }

  return (
    <AuthGate pathname={pathname} routeId={route.id}>
      <PageComponent />
    </AuthGate>
  );
}
