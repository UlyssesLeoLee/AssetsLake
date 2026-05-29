/*
```cypher
CREATE
  (f:File {name: "registry.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/registry", type: "module"}),
  (fn1:Function {name: "getProductArchitecture", type: "function", language: "typescript", signature: "function getProductArchitecture(): ProductArchitecture"}),
  (fn2:Function {name: "getPluginApps", type: "function", language: "typescript", signature: "function getPluginApps(): readonly PluginApp[]"}),
  (fn3:Function {name: "getDefaultPluginApp", type: "function", language: "typescript", signature: "function getDefaultPluginApp(): PluginApp"}),
  (fn4:Function {name: "getPluginApp", type: "function", language: "typescript", signature: "function getPluginApp(id: PluginAppId): PluginApp | undefined"}),
  (fn5:Function {name: "getPluginGroups", type: "function", language: "typescript", signature: "function getPluginGroups(appId?: PluginAppId): readonly ResolvedPluginGroup[]"}),
  (fn6:Function {name: "getPlugins", type: "function", language: "typescript", signature: "function getPlugins(appId?: PluginAppId): Plugin[]"}),
  (fn7:Function {name: "getPluginRoutes", type: "function", language: "typescript", signature: "function getPluginRoutes(appId?: PluginAppId): PluginRoute[]"}),
  (fn8:Function {name: "getNavPluginRoutes", type: "function", language: "typescript", signature: "function getNavPluginRoutes(appId?: PluginAppId): PluginRoute[]"}),
  (fn9:Function {name: "getPluginGroup", type: "function", language: "typescript", signature: "function getPluginGroup(id: PluginGroupId, appId?: PluginAppId): ResolvedPluginGroup | undefined"}),
  (fn10:Function {name: "resolvePluginRoute", type: "function", language: "typescript", signature: "function resolvePluginRoute(pathname: string, appId?: PluginAppId): PluginRoute | undefined"}),
  (fn11:Function {name: "getProductArchitectureHealth", type: "function", language: "typescript", signature: "function getProductArchitectureHealth(): PluginArchitectureHealth"}),
  (v1:Variable {name: "WORKSPACE_PLUGIN_GROUP", type: "variable"}),
  (v2:Variable {name: "PRODUCTION_MANAGEMENT_PLUGIN_GROUP", type: "variable"}),
  (v3:Variable {name: "PRODUCTION_PLANNING_PLUGIN_GROUP", type: "variable"}),
  (v4:Variable {name: "PRODUCTION_EXECUTION_PLUGIN_GROUP", type: "variable"}),
  (v5:Variable {name: "PRODUCTION_TIMELINE_PLUGIN_GROUP", type: "variable"}),
  (v6:Variable {name: "PRODUCTION_REPORTING_PLUGIN_GROUP", type: "variable"}),
  (v7:Variable {name: "PRODUCTION_WORKFLOW_PLUGIN_GROUP", type: "variable"}),
  (v8:Variable {name: "PRODUCTION_DELIVERY_PLUGIN_GROUP", type: "variable"}),
  (v9:Variable {name: "PRODUCTION_ENTERPRISE_PLUGIN_GROUP", type: "variable"}),
  (v10:Variable {name: "ASSET_LIBRARY_PLUGIN_GROUP", type: "variable"}),
  (v11:Variable {name: "ASSETSLAKE_PRODUCT", type: "variable"}),
  (v12:Variable {name: "DEFAULT_PLUGIN_APP_ID", type: "variable"}),
  (v13:Variable {name: "pathname", type: "variable"}),
  (v14:Variable {name: "assertHealthyProductArchitecture", type: "variable"}),
  (v15:Variable {name: "validateProductArchitecture", type: "variable"}),
  (v16:Variable {name: "IDENTITY_VERIFICATION_PLUGIN_GROUP", type: "variable"}),
  (v17:Variable {name: "OBSERVABILITY_PLUGIN_GROUP", type: "variable"}),
  (f)-[:CONTAINS]->(m),
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
  (fn1)-[:USES]->(v11),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v11),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:USES]->(v12),
  (fn4)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn3),
  (fn5)-[:CALLS]->(fn4),
  (fn6)-[:CALLS]->(fn3),
  (fn6)-[:CALLS]->(fn4),
  (fn7)-[:CALLS]->(fn3),
  (fn7)-[:CALLS]->(fn4),
  (fn8)-[:CALLS]->(fn3),
  (fn8)-[:CALLS]->(fn4),
  (fn9)-[:CALLS]->(fn5),
  (fn10)-[:CALLS]->(fn7),
  (fn10)-[:USES]->(v13),
  (fn11)-[:USES]->(v11),
  (fn11)-[:USES]->(v15),
  (m)-[:USES]->(v14),
  (m)-[:USES]->(v16),
  (m)-[:USES]->(v17);
```
*/

import {
  Boxes,
  ClipboardCheck,
  Database,
  FileText,
  KanbanSquare,
  KeyRound,
  LayoutGrid,
  ListChecks,
  Milestone,
  Network,
  PackageCheck,
  Settings,
  ShieldCheck,
  Truck,
  Upload,
} from 'lucide-react';

import {
  flattenAppPluginGroups,
  flattenAppPlugins,
  flattenAppPluginRoutes,
  flattenProductApps,
  navAppPluginRoutes,
  type Plugin,
  type PluginApp,
  type PluginAppId,
  type PluginGroup,
  type PluginGroupId,
  type PluginRoute,
  type ProductArchitecture,
  type ResolvedPluginGroup,
} from '@/plugin-groups/types';
import {
  assertHealthyProductArchitecture,
  validateProductArchitecture,
  type PluginArchitectureHealth,
} from '@/plugin-groups/validation';

const WORKSPACE_PLUGIN_GROUP = {
  id: 'workspace',
  label: 'Workspace',
  description: 'Entry dashboard and cross-plugin shortcuts.',
  order: 0,
  apiScopes: ['health'],
  plugins: [
    {
      id: 'workspace.home',
      label: 'Home',
      description: 'Plugin group overview and primary workflow shortcuts.',
      icon: Boxes,
      nav: true,
      order: 0,
      apiScopes: ['health'],
      manifest: {
        permissions: ['project:read'],
        lifecycle: 'ready',
        backendScopes: ['health'],
      },
      routes: [
        {
          id: 'workspace.home',
          href: '/',
          label: 'Home',
          description: 'Plugin group overview and primary workflow shortcuts.',
          icon: Boxes,
          exact: true,
          nav: true,
          order: 0,
        },
      ],
    },
    {
      id: 'workspace.settings',
      label: 'Settings',
      description: 'App-level AI provider and runtime connection settings.',
      icon: Settings,
      order: 1,
      apiScopes: ['settings', 'ai'],
      manifest: {
        permissions: ['settings:read', 'settings:write'],
        lifecycle: 'ready',
        backendScopes: ['settings', 'ai'],
      },
      routes: [
        {
          id: 'workspace.settings',
          href: '/settings',
          label: 'Settings',
          description: 'AI provider and runtime connection settings.',
          icon: Settings,
          nav: false,
          order: 99,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const IDENTITY_VERIFICATION_PLUGIN_GROUP = {
  id: 'identity-verification',
  label: 'Identity Verification',
  description: 'Reusable SMS verification service for registration and password changes.',
  order: 5,
  apiScopes: ['verification', 'users'],
  plugins: [
    {
      id: 'verification.sms',
      label: 'Verification',
      description: 'Self-hosted SMS challenge, local outbox, registration, and password reset surface.',
      icon: KeyRound,
      nav: true,
      order: 5,
      apiScopes: ['verification', 'users'],
      manifest: {
        permissions: ['verification:read', 'verification:write', 'verification:admin'],
        lifecycle: 'ready',
        backendScopes: ['verification', 'users'],
      },
      routes: [
        {
          id: 'verification.sms',
          href: '/verification',
          label: 'Verify',
          description: 'SMS challenge and account recovery service.',
          icon: KeyRound,
          nav: true,
          order: 25,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_MANAGEMENT_PLUGIN_GROUP = {
  id: 'production-management',
  label: 'Production Management',
  description: 'Portfolio health, AI orchestration, and data lake management evidence.',
  order: 10,
  apiScopes: ['issues', 'milestones', 'assets', 'langgraph', 'ai', 'data-lake'],
  plugins: [
    {
      id: 'production.ai-control',
      label: 'AI Control',
      description: 'Cross-app AI operator for governed read/write management across the product.',
      icon: ShieldCheck,
      nav: true,
      order: 8,
      apiScopes: ['issues', 'assets', 'project-management', 'workflow', 'automation', 'enterprise', 'ai', 'data-lake'],
      manifest: {
        permissions: [
          'project:read',
          'project:write',
          'issue:read',
          'issue:write',
          'asset:read',
          'asset:write',
          'workflow:read',
          'workflow:write',
          'automation:read',
          'automation:approve',
          'enterprise:admin',
          'report:read',
          'delivery:write',
        ],
        dependencies: ['production.management', 'production.board', 'production.workflow', 'production.automation', 'production.data-lake', 'assets.library'],
        featureFlag: 'ai.control',
        lifecycle: 'guarded',
        backendScopes: ['issues', 'assets', 'project-management', 'workflow', 'automation', 'enterprise', 'ai', 'data-lake'],
      },
      routes: [
        {
          id: 'production.ai-control',
          href: '/ai-control',
          label: 'AI Control',
          description: 'Cross-app AI operator for governed product control.',
          icon: ShieldCheck,
          nav: true,
          order: 8,
        },
      ],
    },
    {
      id: 'production.management',
      label: 'Management',
      description: 'Jira-grade portfolio, sprint, automation, AI, and data lake command center.',
      icon: KanbanSquare,
      nav: true,
      order: 9,
      apiScopes: ['issues', 'milestones', 'assets', 'langgraph', 'ai', 'data-lake'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'asset:read', 'automation:read', 'report:read'],
        dependencies: ['production.board', 'production.reports', 'production.data-lake'],
        lifecycle: 'ready',
        backendScopes: ['issues', 'milestones', 'assets', 'langgraph', 'ai', 'data-lake'],
      },
      routes: [
        {
          id: 'production.management',
          href: '/management',
          label: 'Management',
          description: 'Portfolio, sprint, automation, AI, and data lake command center.',
          icon: KanbanSquare,
          nav: true,
          order: 9,
        },
      ],
    },
    {
      id: 'production.ai-orchestration',
      label: 'AI Orchestration',
      description: 'LangGraph issue triage, routing, risk detection, and automation graph.',
      icon: ShieldCheck,
      order: 17,
      apiScopes: ['langgraph', 'ai', 'issues', 'audit-log'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'automation:read', 'automation:approve'],
        dependencies: ['production.workflow', 'production.automation', 'production.data-lake'],
        featureFlag: 'ai.orchestration',
        lifecycle: 'guarded',
        backendScopes: ['langgraph', 'ai', 'issues', 'audit-log'],
      },
      routes: [],
    },
    {
      id: 'production.data-lake',
      label: 'Data Lake Sync',
      description: 'Evidence, assets, issue events, review notes, embeddings, and lakehouse lineage.',
      icon: LayoutGrid,
      order: 18,
      apiScopes: ['assets', 'events', 'data-lake', 'vector-index', 'search-index'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'asset:read'],
        featureFlag: 'data-lake.evidence',
        lifecycle: 'ready',
        backendScopes: ['assets', 'events', 'data-lake', 'vector-index', 'search-index'],
      },
      routes: [],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_PLANNING_PLUGIN_GROUP = {
  id: 'production-planning',
  label: 'Production Planning',
  description: 'Backlog grooming, sprint planning, briefs, and project scheduling inputs.',
  order: 20,
  apiScopes: ['issues', 'epics', 'sprints', 'milestones'],
  plugins: [
    {
      id: 'production.planning',
      label: 'Planning',
      description: 'Backlog, sprint, milestone, and capacity planning surface.',
      icon: ListChecks,
      nav: true,
      order: 10,
      apiScopes: ['issues', 'epics', 'sprints', 'milestones'],
      manifest: {
        permissions: ['project:read', 'project:write', 'issue:read', 'issue:write'],
        lifecycle: 'ready',
        backendScopes: ['issues', 'epics', 'sprints', 'milestones'],
      },
      routes: [
        {
          id: 'production.planning',
          href: '/planning',
          label: 'Planning',
          description: 'Backlog, sprint, milestone, and capacity planning surface.',
          icon: ListChecks,
          nav: true,
          order: 10,
        },
      ],
    },
    {
      id: 'production.briefs',
      label: 'Briefs',
      description: 'Create production briefs and issue scopes.',
      icon: FileText,
      order: 11,
      apiScopes: ['issues'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'issue:write'],
        dependencies: ['production.planning'],
        lifecycle: 'ready',
        backendScopes: ['issues'],
      },
      routes: [
        {
          id: 'production.briefs',
          href: '/briefs',
          label: 'Briefs',
          description: 'Create production briefs and issue scopes.',
          icon: FileText,
          order: 13,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_EXECUTION_PLUGIN_GROUP = {
  id: 'production-execution',
  label: 'Production Execution',
  description: 'Issue board, review gates, approvals, and vendor execution views.',
  order: 30,
  apiScopes: ['issues'],
  plugins: [
    {
      id: 'production.board',
      label: 'Board',
      description: 'Kanban issue flow for outsourcing production.',
      icon: KanbanSquare,
      nav: true,
      order: 11,
      apiScopes: ['issues'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'issue:write'],
        lifecycle: 'ready',
        backendScopes: ['issues'],
      },
      routes: [
        {
          id: 'production.board',
          href: '/board',
          label: 'Board',
          description: 'Kanban issue flow for outsourcing production.',
          icon: KanbanSquare,
          nav: true,
          order: 11,
        },
        {
          id: 'production.board.detail',
          href: '/issues',
          label: 'Issue Detail',
          description: 'Issue fields, comments, work logs, review annotations, and audit history.',
          icon: KanbanSquare,
          nav: false,
          order: 12,
        },
      ],
    },
    {
      id: 'production.reviews',
      label: 'Reviews',
      description: 'Internal and client review lanes.',
      icon: ClipboardCheck,
      nav: true,
      order: 14,
      apiScopes: ['issues'],
      manifest: {
        permissions: ['issue:read', 'issue:write', 'asset:read'],
        dependencies: ['production.board', 'production.data-lake'],
        lifecycle: 'ready',
        backendScopes: ['issues'],
      },
      routes: [
        {
          id: 'production.reviews',
          href: '/reviews',
          label: 'Reviews',
          description: 'Internal and client review lanes.',
          icon: ClipboardCheck,
          nav: true,
          order: 14,
        },
      ],
    },
    {
      id: 'production.approvals',
      label: 'Approvals',
      description: 'Art director approval and revision queue.',
      icon: ShieldCheck,
      nav: true,
      order: 15,
      apiScopes: ['issues'],
      manifest: {
        permissions: ['issue:read', 'issue:write', 'automation:approve'],
        dependencies: ['production.reviews', 'production.workflow'],
        lifecycle: 'ready',
        backendScopes: ['issues'],
      },
      routes: [
        {
          id: 'production.approvals',
          href: '/approvals',
          label: 'Approvals',
          description: 'Art director approval and revision queue.',
          icon: ShieldCheck,
          nav: true,
          order: 15,
        },
      ],
    },
    {
      id: 'production.vendors',
      label: 'Vendors',
      description: 'Vendor-facing assignment dashboard.',
      icon: Truck,
      order: 24,
      apiScopes: ['issues'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'issue:write'],
        dependencies: ['production.board'],
        lifecycle: 'ready',
        backendScopes: ['issues'],
      },
      routes: [
        {
          id: 'production.vendors',
          href: '/vendors',
          label: 'Vendors',
          description: 'Vendor-facing assignment dashboard.',
          icon: Truck,
          order: 24,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_TIMELINE_PLUGIN_GROUP = {
  id: 'production-timeline',
  label: 'Production Timeline',
  description: 'Gantt, calendar, milestones, dependency scheduling, and roadmap control.',
  order: 40,
  apiScopes: ['milestones', 'issue-dependencies', 'gantt', 'calendar'],
  plugins: [
    {
      id: 'production.gantt',
      label: 'Gantt',
      description: 'Schedule bars, dependencies, baseline drift, and critical path readiness.',
      icon: Milestone,
      nav: true,
      order: 16,
      apiScopes: ['gantt', 'issue-dependencies', 'milestones'],
      manifest: {
        permissions: ['project:read', 'project:write', 'issue:read'],
        dependencies: ['production.planning'],
        lifecycle: 'ready',
        backendScopes: ['gantt', 'issue-dependencies', 'milestones'],
      },
      routes: [
        {
          id: 'production.gantt',
          href: '/gantt',
          label: 'Gantt',
          description: 'Schedule bars, dependencies, baseline drift, and critical path readiness.',
          icon: Milestone,
          nav: true,
          order: 16,
        },
      ],
    },
    {
      id: 'production.calendar',
      label: 'Calendar',
      description: 'Sprint, release, review, and vendor delivery calendar.',
      icon: ClipboardCheck,
      nav: true,
      order: 17,
      apiScopes: ['calendar', 'issues', 'milestones'],
      manifest: {
        permissions: ['project:read', 'project:write', 'issue:read'],
        dependencies: ['production.planning'],
        lifecycle: 'ready',
        backendScopes: ['calendar', 'issues', 'milestones'],
      },
      routes: [
        {
          id: 'production.calendar',
          href: '/calendar',
          label: 'Calendar',
          description: 'Sprint, release, review, and vendor delivery calendar.',
          icon: ClipboardCheck,
          nav: true,
          order: 17,
        },
      ],
    },
    {
      id: 'production.milestones',
      label: 'Milestones',
      description: 'Project milestone timeline.',
      icon: Milestone,
      order: 18,
      apiScopes: ['milestones'],
      manifest: {
        permissions: ['project:read', 'project:write'],
        dependencies: ['production.planning'],
        lifecycle: 'ready',
        backendScopes: ['milestones'],
      },
      routes: [
        {
          id: 'production.milestones',
          href: '/milestones',
          label: 'Milestones',
          description: 'Project milestone timeline.',
          icon: Milestone,
          order: 18,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_REPORTING_PLUGIN_GROUP = {
  id: 'production-reporting',
  label: 'Production Reporting',
  description: 'Dashboards, burndown, velocity, flow, aging, SLA, and delivery readiness.',
  order: 50,
  apiScopes: ['reports', 'issues', 'events', 'data-lake'],
  plugins: [
    {
      id: 'production.reports',
      label: 'Reports',
      description: 'Producer dashboards and delivery analytics.',
      icon: LayoutGrid,
      nav: true,
      order: 19,
      apiScopes: ['reports', 'issues', 'events', 'data-lake'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'asset:read', 'report:read'],
        dependencies: ['production.board', 'production.data-lake'],
        lifecycle: 'ready',
        backendScopes: ['reports', 'issues', 'events', 'data-lake'],
      },
      routes: [
        {
          id: 'production.reports',
          href: '/reports',
          label: 'Reports',
          description: 'Producer dashboards and delivery analytics.',
          icon: LayoutGrid,
          nav: true,
          order: 19,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_WORKFLOW_PLUGIN_GROUP = {
  id: 'production-workflow',
  label: 'Production Workflow',
  description: 'Configurable workflow, automation, AI guardrails, and execution audit.',
  order: 60,
  apiScopes: ['workflow', 'automation', 'langgraph', 'audit-log'],
  plugins: [
    {
      id: 'production.workflow',
      label: 'Workflow',
      description: 'Status transitions, validators, guards, and approval policy.',
      icon: ShieldCheck,
      nav: true,
      order: 20,
      apiScopes: ['workflow', 'audit-log'],
      manifest: {
        permissions: ['project:read', 'workflow:read', 'workflow:write'],
        lifecycle: 'ready',
        backendScopes: ['workflow', 'audit-log'],
      },
      routes: [
        {
          id: 'production.workflow',
          href: '/workflow',
          label: 'Workflow',
          description: 'Status transitions, validators, guards, and approval policy.',
          icon: ShieldCheck,
          nav: true,
          order: 20,
        },
      ],
    },
    {
      id: 'production.automation',
      label: 'Automation',
      description: 'Automation rule catalog, LangGraph actions, and human approval gates.',
      icon: KanbanSquare,
      nav: true,
      order: 21,
      apiScopes: ['automation', 'langgraph', 'ai', 'audit-log'],
      manifest: {
        permissions: ['project:read', 'issue:read', 'workflow:read', 'automation:read', 'automation:approve'],
        dependencies: ['production.workflow', 'production.data-lake'],
        featureFlag: 'automation.langgraph',
        lifecycle: 'guarded',
        backendScopes: ['automation', 'langgraph', 'ai', 'audit-log'],
      },
      routes: [
        {
          id: 'production.automation',
          href: '/automation',
          label: 'Automation',
          description: 'Automation rule catalog, LangGraph actions, and human approval gates.',
          icon: KanbanSquare,
          nav: true,
          order: 21,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_DELIVERY_PLUGIN_GROUP = {
  id: 'production-delivery',
  label: 'Production Delivery',
  description: 'Approved asset packaging and delivery submission.',
  order: 70,
  apiScopes: ['delivery-packages'],
  plugins: [
    {
      id: 'production.delivery',
      label: 'Delivery',
      description: 'Approved asset packaging and submission.',
      icon: PackageCheck,
      nav: true,
      order: 14,
      apiScopes: ['delivery-packages'],
      manifest: {
        permissions: ['issue:read', 'asset:read', 'delivery:write'],
        dependencies: ['production.approvals', 'assets.library'],
        lifecycle: 'ready',
        backendScopes: ['delivery-packages'],
      },
      routes: [
        {
          id: 'production.delivery',
          href: '/delivery-packages',
          label: 'Delivery',
          description: 'Approved asset packaging and submission.',
          icon: PackageCheck,
          nav: true,
          order: 22,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const PRODUCTION_ENTERPRISE_PLUGIN_GROUP = {
  id: 'production-enterprise',
  label: 'Enterprise Controls',
  description: 'Roles, notifications, import/export, webhooks, templates, and CI gates.',
  order: 80,
  apiScopes: ['permissions', 'notifications', 'import-export', 'webhooks', 'ci'],
  plugins: [
    {
      id: 'production.enterprise',
      label: 'Enterprise',
      description: 'Enterprise productization controls and operational readiness.',
      icon: Boxes,
      nav: true,
      order: 23,
      apiScopes: ['permissions', 'notifications', 'import-export', 'webhooks', 'ci'],
      manifest: {
        permissions: ['project:read', 'workflow:read', 'automation:read', 'enterprise:admin'],
        dependencies: ['production.workflow', 'production.automation'],
        lifecycle: 'guarded',
        backendScopes: ['permissions', 'notifications', 'import-export', 'webhooks', 'ci'],
      },
      routes: [
        {
          id: 'production.enterprise',
          href: '/enterprise',
          label: 'Enterprise',
          description: 'Enterprise productization controls and operational readiness.',
          icon: Boxes,
          nav: true,
          order: 23,
        },
      ],
    },
    {
      id: 'production.security-audit',
      label: 'Security Audit',
      description: 'Runtime audit trail for RBAC denials, asset access, signed URLs, and storage security.',
      icon: ShieldCheck,
      nav: true,
      order: 23.5,
      apiScopes: ['audit-log', 'security', 'assets'],
      manifest: {
        permissions: ['enterprise:admin'],
        dependencies: ['production.enterprise'],
        lifecycle: 'ready',
        backendScopes: ['audit-log', 'security', 'assets'],
      },
      routes: [
        {
          id: 'production.security-audit',
          href: '/security-audit',
          label: 'Security Audit',
          description: 'Audit RBAC denials, asset access, signed URLs, and storage security events.',
          icon: ShieldCheck,
          nav: true,
          order: 23.5,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const ASSET_LIBRARY_PLUGIN_GROUP = {
  id: 'asset-library',
  label: 'Asset Library',
  description: 'Asset search, metadata, preview, upload, and object storage references.',
  order: 90,
  apiScopes: ['assets', 'projects'],
  plugins: [
    {
      id: 'assets.library',
      label: 'Library',
      description: 'Browse, filter, preview, and manage art assets.',
      icon: LayoutGrid,
      nav: true,
      order: 90,
      apiScopes: ['assets', 'projects'],
      manifest: {
        permissions: ['project:read', 'asset:read'],
        lifecycle: 'ready',
        backendScopes: ['assets', 'projects'],
      },
      routes: [
        {
          id: 'assets.library',
          href: '/assets',
          label: 'Library',
          description: 'Browse, filter, preview, and manage art assets.',
          icon: LayoutGrid,
          nav: true,
          order: 90,
        },
      ],
    },
    {
      id: 'assets.query',
      label: 'Lake Query',
      description: 'Read-only SQL and Cypher console for data lake records and graph projections.',
      icon: Database,
      nav: true,
      order: 91,
      apiScopes: ['assets', 'issues', 'data-lake', 'vector-index'],
      manifest: {
        permissions: ['project:read', 'asset:read'],
        dependencies: ['assets.library'],
        lifecycle: 'ready',
        backendScopes: ['assets', 'issues', 'data-lake', 'vector-index'],
      },
      routes: [
        {
          id: 'assets.query',
          href: '/data-lake-query',
          label: 'Lake Query',
          description: 'Read-only SQL and Cypher console for data lake records and graph projections.',
          icon: Database,
          nav: true,
          order: 91,
        },
      ],
    },
    {
      id: 'assets.upload',
      label: 'Upload',
      description: 'Upload source files with metadata and tags.',
      icon: Upload,
      nav: true,
      order: 92,
      apiScopes: ['assets', 'projects'],
      manifest: {
        permissions: ['project:read', 'asset:read', 'asset:write'],
        dependencies: ['assets.library'],
        lifecycle: 'ready',
        backendScopes: ['assets', 'projects'],
      },
      routes: [
        {
          id: 'assets.upload',
          href: '/upload',
          label: 'Upload',
          description: 'Upload source files with metadata and tags.',
          icon: Upload,
          nav: true,
          order: 92,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const OBSERVABILITY_PLUGIN_GROUP = {
  id: 'observability',
  label: 'Observability',
  description: 'Kiali service mesh topology with SkyWalking trace drilldown.',
  order: 95,
  apiScopes: ['observability', 'skywalking', 'traces'],
  plugins: [
    {
      id: 'observability.runtime',
      label: 'Topology',
      description: 'In-cluster Kiali topology and trace inspection.',
      icon: Network,
      nav: true,
      order: 95,
      apiScopes: ['observability', 'skywalking', 'traces'],
      manifest: {
        permissions: ['observability:read'],
        lifecycle: 'ready',
        backendScopes: ['observability', 'skywalking', 'traces'],
      },
      routes: [
        {
          id: 'observability.runtime',
          href: '/observability',
          label: 'Topology',
          description: 'Runtime Kiali topology and trace inspection.',
          icon: Network,
          nav: true,
          order: 95,
        },
      ],
    },
  ],
} as const satisfies PluginGroup;

const ASSETSLAKE_PRODUCT = assertHealthyProductArchitecture({
  id: 'assetslake-product',
  label: 'AssetsLake',
  description: 'Composable art asset lake product assembled from plugin apps, plugin groups, and plugins.',
  apps: [
    {
      id: 'studio-console',
      label: 'Studio Console',
      description: 'Primary production workspace for supervisors and internal artists.',
      order: 0,
      pluginGroups: [
        WORKSPACE_PLUGIN_GROUP,
        IDENTITY_VERIFICATION_PLUGIN_GROUP,
        PRODUCTION_MANAGEMENT_PLUGIN_GROUP,
        PRODUCTION_PLANNING_PLUGIN_GROUP,
        PRODUCTION_EXECUTION_PLUGIN_GROUP,
        PRODUCTION_TIMELINE_PLUGIN_GROUP,
        PRODUCTION_REPORTING_PLUGIN_GROUP,
        PRODUCTION_WORKFLOW_PLUGIN_GROUP,
        PRODUCTION_DELIVERY_PLUGIN_GROUP,
        PRODUCTION_ENTERPRISE_PLUGIN_GROUP,
        ASSET_LIBRARY_PLUGIN_GROUP,
        OBSERVABILITY_PLUGIN_GROUP,
      ],
    },
    {
      id: 'production-console',
      label: 'Production Console',
      description: 'Focused app for issue execution, reviews, approvals, vendors, and delivery.',
      order: 10,
      policy: {
        enabledPlugins: [
          'workspace.home',
          'workspace.settings',
          'production.data-lake',
          'production.board',
          'production.reviews',
          'production.approvals',
          'production.vendors',
          'production.reports',
          'production.workflow',
          'production.delivery',
          'assets.library',
        ],
        allowedPermissions: [
          'project:read',
          'issue:read',
          'issue:write',
          'asset:read',
          'workflow:read',
          'workflow:write',
          'automation:read',
          'automation:approve',
          'report:read',
          'delivery:write',
          'settings:read',
          'settings:write',
        ],
      },
      pluginGroups: [
        WORKSPACE_PLUGIN_GROUP,
        PRODUCTION_MANAGEMENT_PLUGIN_GROUP,
        PRODUCTION_EXECUTION_PLUGIN_GROUP,
        PRODUCTION_REPORTING_PLUGIN_GROUP,
        PRODUCTION_WORKFLOW_PLUGIN_GROUP,
        PRODUCTION_DELIVERY_PLUGIN_GROUP,
        ASSET_LIBRARY_PLUGIN_GROUP,
      ],
    },
    {
      id: 'planning-console',
      label: 'Planning Console',
      description: 'Focused app for planning, briefs, Gantt, calendar, and milestones.',
      order: 15,
      policy: {
        enabledPlugins: [
          'workspace.home',
          'workspace.settings',
          'production.planning',
          'production.briefs',
          'production.gantt',
          'production.calendar',
          'production.milestones',
        ],
        allowedPermissions: ['project:read', 'project:write', 'issue:read', 'issue:write', 'settings:read', 'settings:write'],
      },
      pluginGroups: [
        WORKSPACE_PLUGIN_GROUP,
        PRODUCTION_PLANNING_PLUGIN_GROUP,
        PRODUCTION_TIMELINE_PLUGIN_GROUP,
      ],
    },
    {
      id: 'workflow-console',
      label: 'Workflow Console',
      description: 'Focused app for workflow, automation, enterprise controls, and data lake triggers.',
      order: 18,
      policy: {
        enabledPlugins: [
          'workspace.home',
          'workspace.settings',
          'production.data-lake',
          'production.board',
          'production.reports',
          'production.workflow',
          'production.automation',
          'production.enterprise',
          'production.security-audit',
          'assets.library',
        ],
        allowedPermissions: [
          'project:read',
          'issue:read',
          'issue:write',
          'asset:read',
          'workflow:read',
          'workflow:write',
          'automation:read',
          'automation:approve',
          'enterprise:admin',
          'report:read',
          'settings:read',
          'settings:write',
        ],
      },
      pluginGroups: [
        WORKSPACE_PLUGIN_GROUP,
        PRODUCTION_MANAGEMENT_PLUGIN_GROUP,
        PRODUCTION_EXECUTION_PLUGIN_GROUP,
        PRODUCTION_REPORTING_PLUGIN_GROUP,
        PRODUCTION_WORKFLOW_PLUGIN_GROUP,
        PRODUCTION_ENTERPRISE_PLUGIN_GROUP,
        ASSET_LIBRARY_PLUGIN_GROUP,
      ],
    },
    {
      id: 'reporting-console',
      label: 'Reporting Console',
      description: 'Focused app for management views, reports, AI control, and data lake query.',
      order: 19,
      policy: {
        enabledPlugins: [
          'workspace.home',
          'workspace.settings',
          'production.ai-control',
          'production.management',
          'production.board',
          'production.reports',
          'production.workflow',
          'production.automation',
          'production.data-lake',
          'assets.library',
          'assets.query',
          'observability.runtime',
        ],
        allowedPermissions: [
          'project:read',
          'issue:read',
          'issue:write',
          'asset:read',
          'asset:write',
          'workflow:read',
          'workflow:write',
          'automation:read',
          'automation:approve',
          'report:read',
          'observability:read',
          'settings:read',
          'settings:write',
        ],
      },
      pluginGroups: [
        WORKSPACE_PLUGIN_GROUP,
        PRODUCTION_MANAGEMENT_PLUGIN_GROUP,
        PRODUCTION_EXECUTION_PLUGIN_GROUP,
        PRODUCTION_REPORTING_PLUGIN_GROUP,
        PRODUCTION_WORKFLOW_PLUGIN_GROUP,
        ASSET_LIBRARY_PLUGIN_GROUP,
        OBSERVABILITY_PLUGIN_GROUP,
      ],
    },
    {
      id: 'asset-console',
      label: 'Asset Console',
      description: 'Focused app for asset library operations, upload, search, metadata, and storage references.',
      order: 20,
      policy: {
        enabledPlugins: ['workspace.home', 'workspace.settings', 'assets.library', 'assets.query', 'assets.upload'],
        allowedPermissions: ['project:read', 'asset:read', 'asset:write', 'settings:read', 'settings:write'],
      },
      pluginGroups: [WORKSPACE_PLUGIN_GROUP, ASSET_LIBRARY_PLUGIN_GROUP],
    },
    {
      id: 'observability-console',
      label: 'Observability App',
      description: 'Focused app for Kiali runtime topology and SkyWalking trace operations.',
      order: 25,
      policy: {
        enabledPlugins: ['workspace.home', 'workspace.settings', 'observability.runtime'],
        allowedPermissions: ['project:read', 'observability:read', 'settings:read', 'settings:write'],
      },
      pluginGroups: [WORKSPACE_PLUGIN_GROUP, OBSERVABILITY_PLUGIN_GROUP],
    },
    {
      id: 'verification-app',
      label: 'Verification App',
      description: 'Standalone identity verification service for reusable registration and password recovery flows.',
      order: 30,
      policy: {
        enabledPlugins: ['workspace.home', 'workspace.settings', 'verification.sms'],
        allowedPermissions: [
          'project:read',
          'settings:read',
          'settings:write',
          'verification:read',
          'verification:write',
          'verification:admin',
        ],
      },
      pluginGroups: [WORKSPACE_PLUGIN_GROUP, IDENTITY_VERIFICATION_PLUGIN_GROUP],
    },
  ],
} as const satisfies ProductArchitecture);

const DEFAULT_PLUGIN_APP_ID: PluginAppId = 'studio-console';
const PLUGIN_APP_IDS: readonly PluginAppId[] = [
  'studio-console',
  'production-console',
  'planning-console',
  'workflow-console',
  'reporting-console',
  'asset-console',
  'observability-console',
  'verification-app',
];

function configuredPluginAppId(): PluginAppId {
  const configured = process.env.NEXT_PUBLIC_APP_ID;
  return isPluginAppId(configured) ? configured : DEFAULT_PLUGIN_APP_ID;
}

function isPluginAppId(value: string | undefined): value is PluginAppId {
  return PLUGIN_APP_IDS.includes(value as PluginAppId);
}

export function getProductArchitecture(): ProductArchitecture {
  return ASSETSLAKE_PRODUCT;
}

export function getProductArchitectureHealth(): PluginArchitectureHealth {
  return validateProductArchitecture(ASSETSLAKE_PRODUCT);
}

export function getPluginApps(): readonly PluginApp[] {
  return flattenProductApps(getProductArchitecture());
}

export function getDefaultPluginApp(): PluginApp {
  return getPluginApp(configuredPluginAppId()) ?? getPluginApps()[0];
}

export function getPluginApp(id: PluginAppId): PluginApp | undefined {
  return getPluginApps().find((app) => app.id === id);
}

export function getPluginGroups(appId?: PluginAppId): readonly ResolvedPluginGroup[] {
  const app = appId ? getPluginApp(appId) : getDefaultPluginApp();
  return app ? flattenAppPluginGroups(app) : [];
}

export function getPlugins(appId?: PluginAppId): Plugin[] {
  const app = appId ? getPluginApp(appId) : getDefaultPluginApp();
  return app ? flattenAppPlugins(app) : [];
}

export function getPluginRoutes(appId?: PluginAppId): PluginRoute[] {
  const app = appId ? getPluginApp(appId) : getDefaultPluginApp();
  return app ? flattenAppPluginRoutes(app) : [];
}

export function getNavPluginRoutes(appId?: PluginAppId): PluginRoute[] {
  const app = appId ? getPluginApp(appId) : getDefaultPluginApp();
  return app ? navAppPluginRoutes(app) : [];
}

export function getPluginGroup(id: PluginGroupId, appId?: PluginAppId): ResolvedPluginGroup | undefined {
  return getPluginGroups(appId).find((group) => group.id === id);
}

export function resolvePluginRoute(pathname: string, appId?: PluginAppId): PluginRoute | undefined {
  return getPluginRoutes(appId).find((route) =>
    route.exact ? pathname === route.href : pathname === route.href || pathname.startsWith(`${route.href}/`)
  );
}
