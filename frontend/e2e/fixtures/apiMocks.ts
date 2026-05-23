/*
```cypher
CREATE
  (f:File {name: "apiMocks.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/fixtures/apiMocks", type: "module"}),
  (fn1:Function {name: "ok", type: "function", language: "typescript", signature: "function ok<T>(data: T): ApiResponse<T>"}),
  (fn2:Function {name: "paginated", type: "function", language: "typescript", signature: "function paginated<T>(data: T[]): PaginatedResponse<T>"}),
  (fn3:Function {name: "issueDetail", type: "function", language: "typescript", signature: "function issueDetail(id: string): Issue"}),
  (fn4:Function {name: "json", type: "function", language: "typescript", signature: "async function json(route: Route, body: unknown, status?: number): Promise<void>"}),
  (fn5:Function {name: "mockApi", type: "function", language: "typescript", signature: "async function mockApi(page: Page): Promise<void>"}),
  (v1:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (v2:Variable {name: "DATA_IMAGE", type: "variable"}),
  (v3:Variable {name: "ISSUES", type: "variable"}),
  (v4:Variable {name: "DEPENDENCIES", type: "variable"}),
  (v5:Variable {name: "ASSETS", type: "variable"}),
  (v6:Variable {name: "UPLOAD_RESULT", type: "variable"}),
  (v7:Variable {name: "ENTERPRISE_CONTROLS", type: "variable"}),
  (v8:Variable {name: "route", type: "variable"}),
  (v9:Variable {name: "DELIVERY_PACKAGE", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn2)-[:USES]->(v3),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v8),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn2),
  (fn5)-[:CALLS]->(fn3),
  (fn5)-[:CALLS]->(fn4),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v3),
  (fn5)-[:USES]->(v4),
  (fn5)-[:USES]->(v5),
  (fn5)-[:USES]->(v6),
  (fn5)-[:USES]->(v7),
  (fn5)-[:USES]->(v9);
```
*/

import type { Page, Route } from '@playwright/test';
import type {
  ApiResponse,
  Asset,
  AnalyzeAssetResponse,
  AssetAiInsight,
  AssetSummary,
  AssetVersionDiff,
  AssetVersionSummary,
  PaginatedResponse,
  UploadResult,
} from '../../src/types/asset';
import type { DeliveryPackage, Issue, IssueComment, IssueStatusHistory, IssueSummary, IssueWorkLog, Milestone } from '../../src/types/production';
import type {
  IssueDependency,
  IssueEvent,
  ProjectAutomationCatalog,
  ProjectCalendarSnapshot,
  ProjectEnterpriseControls,
  ProjectGanttSnapshot,
  ProjectManagementEpic,
  ProjectManagementPlan,
  ProjectManagementSprint,
  ProjectReportsSnapshot,
  ProjectWorkflowCatalog,
} from '../../src/types/projectManagement';

const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';
const WORKSPACE_ID = '00000000-0000-0000-0000-000000000010';
const NOW = '2026-05-19T08:00:00Z';
const DATA_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100"%3E%3Crect width="160" height="100" fill="%230f172a"/%3E%3Ctext x="18" y="55" fill="%2367e8f9" font-family="Arial" font-size="16"%3EAssetsLake%3C/text%3E%3C/svg%3E';

const ISSUES: IssueSummary[] = [
  {
    id: 'issue-a',
    issue_key: 'AL-001',
    project_id: DEFAULT_PROJECT_ID,
    epic_id: 'epic-core',
    sprint_id: 'sprint-active',
    vendor_id: 'vendor-a',
    client_id: 'client-a',
    title: 'Concept Lock',
    issue_type: 'concept_art',
    asset_type: 'concept_art',
    status: 'backlog',
    priority: 'high',
    assignee_id: 'user-a',
    assignee_name: 'Maya Producer',
    start_date: '2026-05-20',
    due_date: '2026-05-24',
    story_points: 4,
    rank_key: '0001',
    revision_count: 1,
    qa_status: 'passed',
    asset_count: 1,
    thumbnail_url: DATA_IMAGE,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'issue-b',
    issue_key: 'AL-002',
    project_id: DEFAULT_PROJECT_ID,
    epic_id: 'epic-core',
    sprint_id: 'sprint-active',
    vendor_id: 'vendor-a',
    client_id: 'client-a',
    title: 'Model Pass',
    issue_type: 'character_model',
    asset_type: '3d_model',
    status: 'in_progress',
    priority: 'urgent',
    assignee_id: 'user-b',
    assignee_name: 'Lead Artist',
    start_date: '2026-05-25',
    due_date: '2026-05-29',
    story_points: 5,
    rank_key: '0002',
    revision_count: 0,
    qa_status: 'warning',
    asset_count: 2,
    thumbnail_url: DATA_IMAGE,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'issue-c',
    issue_key: 'AL-003',
    project_id: DEFAULT_PROJECT_ID,
    epic_id: 'epic-review',
    sprint_id: 'sprint-active',
    vendor_id: 'vendor-b',
    client_id: 'client-a',
    title: 'Client Review',
    issue_type: 'delivery_check',
    asset_type: 'document',
    status: 'submitted',
    priority: 'medium',
    assignee_id: 'user-c',
    assignee_name: 'Client Reviewer',
    start_date: '2026-06-01',
    due_date: '2026-06-03',
    story_points: 2,
    rank_key: '0003',
    revision_count: 2,
    qa_status: 'pending',
    asset_count: 1,
    thumbnail_url: DATA_IMAGE,
    created_at: NOW,
    updated_at: NOW,
  },
];

const DEPENDENCIES: IssueDependency[] = [
  {
    id: 'dep-a-b',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    source_issue_id: 'issue-a',
    target_issue_id: 'issue-b',
    dependency_type: 'blocks',
    description: 'Concept lock gates modeling.',
    created_by: 'user-a',
    created_at: NOW,
  },
  {
    id: 'dep-b-c',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    source_issue_id: 'issue-b',
    target_issue_id: 'issue-c',
    dependency_type: 'blocks',
    description: 'Model pass gates client review.',
    created_by: 'user-b',
    created_at: NOW,
  },
];

const EPICS: ProjectManagementEpic[] = [
  {
    id: 'epic-core',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    epic_key: 'EP-001',
    name: 'Character Pipeline',
    summary: 'Outsourced character delivery pipeline.',
    status: 'in_progress',
    priority: 'high',
    owner_id: 'user-a',
    start_date: '2026-05-20',
    target_date: '2026-06-10',
    rank_key: '0001',
    metadata: {},
    created_at: NOW,
    updated_at: NOW,
  },
];

const SPRINTS: ProjectManagementSprint[] = [
  {
    id: 'sprint-active',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    name: 'Sprint 12',
    goal: 'Lock concept, model, and client review.',
    status: 'active',
    start_date: '2026-05-20',
    end_date: '2026-06-03',
    capacity_points: 24,
    committed_points: 11,
    completed_points: 0,
    created_at: NOW,
    updated_at: NOW,
  },
];

const EVENTS: IssueEvent[] = [
  {
    id: 'event-a',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    issue_id: 'issue-a',
    event_type: 'created',
    actor_id: 'user-a',
    actor_name: 'Producer',
    payload: {},
    created_at: NOW,
  },
];

const MILESTONES: Milestone[] = [
  {
    id: 'milestone-alpha',
    workspace_id: WORKSPACE_ID,
    project_id: DEFAULT_PROJECT_ID,
    name: 'Alpha Review',
    description: 'First client package review.',
    due_date: '2026-06-05',
    status: 'active',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
];

const ASSETS: AssetSummary[] = [
  {
    id: 'asset-a',
    name: 'Concept Board',
    original_filename: 'concept-board.png',
    asset_type: 'concept_art',
    mime_type: 'image/png',
    tags: ['concept', 'trace'],
    file_url: DATA_IMAGE,
    preview_url: DATA_IMAGE,
    file_size: 2048,
    version: 1,
    project_id: DEFAULT_PROJECT_ID,
    uploader: 'Maya Producer',
    status: 'active',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'asset-code-a',
    name: 'Build Pipeline Script',
    original_filename: 'build_pipeline.ts',
    asset_type: 'code',
    mime_type: 'text/typescript',
    tags: ['code', 'pipeline'],
    file_url: 'data:text/plain;base64,ZXhwb3J0IGNvbnN0IGJ1aWxkID0gKCkgPT4gJ2Fzc2V0cyc7',
    preview_url: undefined,
    file_size: 512,
    version: 3,
    project_id: DEFAULT_PROJECT_ID,
    uploader: 'Tech Artist',
    status: 'active',
    created_at: NOW,
    updated_at: NOW,
  },
];

const ASSET_VERSIONS: AssetVersionSummary[] = [
  {
    id: 'asset-a-version-2',
    asset_id: 'asset-a',
    version: 2,
    bucket: 'assetslake-e2e',
    object_key: 'e2e/concept-board-v2.png',
    file_url: DATA_IMAGE,
    file_size: 3072,
    checksum_sha256: 'feedbeef0022conceptboardv2',
    uploader_id: 'user-b',
    uploader: 'Lead Artist',
    change_note: 'Refined silhouette and palette pass',
    created_at: '2026-05-20T10:00:00Z',
    branch_name: 'main',
    commit_sha: 'feedbeef0022',
  },
  {
    id: 'asset-a-version-1',
    asset_id: 'asset-a',
    version: 1,
    bucket: 'assetslake-e2e',
    object_key: 'e2e/concept-board.png',
    file_url: DATA_IMAGE,
    file_size: 2048,
    checksum_sha256: 'deadbeef0011conceptboardv1',
    uploader_id: 'user-a',
    uploader: 'Maya Producer',
    change_note: 'Initial concept board commit',
    created_at: NOW,
    branch_name: 'main',
    commit_sha: 'deadbeef0011',
  },
];

const ASSET_VERSION_DIFF: AssetVersionDiff = {
  asset_id: 'asset-a',
  base: ASSET_VERSIONS[1],
  head: ASSET_VERSIONS[0],
  file_size_delta: 1024,
  checksum_changed: true,
  object_changed: true,
  changes: [
    {
      field: 'object_key',
      before: 'e2e/concept-board.png',
      after: 'e2e/concept-board-v2.png',
      changed: true,
    },
    {
      field: 'checksum_sha256',
      before: 'deadbeef0011conceptboardv1',
      after: 'feedbeef0022conceptboardv2',
      changed: true,
    },
    {
      field: 'file_size',
      before: '2048',
      after: '3072',
      changed: true,
    },
    {
      field: 'uploader',
      before: 'Maya Producer',
      after: 'Lead Artist',
      changed: true,
    },
  ],
};

const ASSET_INSIGHTS: AssetAiInsight[] = [
  {
    id: 'insight-asset-a',
    asset_id: 'asset-a',
    modality: 'image',
    provider: 'Playwright AI',
    model: 'trace-vision-model',
    status: 'completed',
    summary: 'Concept board recognized as a reusable character reference with readable title text and delivery evidence value.',
    labels: ['concept', 'character-reference', 'palette'],
    detected_text: 'AssetsLake',
    quality_risks: ['Verify final resolution before client delivery.'],
    reuse_suggestions: ['Attach this concept board to model pass tasks as visual evidence.'],
    entities: { subject: 'concept board' },
    raw_response: { source: 'playwright' },
    created_at: NOW,
  },
];

const ANALYZE_ASSET_RESPONSE: AnalyzeAssetResponse = {
  asset: {
    id: 'asset-a',
    name: 'Concept Board',
    original_filename: 'concept-board.png',
    description: 'Concept board fixture for Playwright operation traces.',
    asset_type: 'concept_art',
    mime_type: 'image/png',
    tags: ['concept', 'trace'],
    bucket: 'assetslake-e2e',
    object_key: 'e2e/concept-board.png',
    file_url: DATA_IMAGE,
    preview_url: DATA_IMAGE,
    file_size: 2048,
    checksum_sha256: 'e2e-checksum',
    version: 1,
    parent_id: undefined,
    project_id: DEFAULT_PROJECT_ID,
    uploader_id: 'user-e2e',
    uploader: 'Maya Producer',
    status: 'active',
    reviewed_by: undefined,
    reviewed_at: undefined,
    review_note: undefined,
    ai_tags: ASSET_INSIGHTS[0].labels,
    embedding_id: 'qdrant-e2e',
    search_doc_id: 'opensearch-e2e',
    graph_node_id: 'neo4j-e2e',
    created_at: NOW,
    updated_at: NOW,
    deleted_at: undefined,
  },
  insight: ASSET_INSIGHTS[0],
  rag_stored: true,
};

const UPLOAD_RESULT: UploadResult = {
  asset_id: 'asset-e2e-upload',
  bucket: 'assetslake-e2e',
  object_key: 'e2e/playwright-trace-asset.png',
  file_url: DATA_IMAGE,
  preview_url: DATA_IMAGE,
  name: 'Playwright Trace Asset',
  original_filename: 'trace-upload.png',
  asset_type: 'concept_art',
  mime_type: 'image/png',
  file_size: 19,
  tags: ['trace'],
  version: 1,
  status: 'active',
  created_at: NOW,
};

const DELIVERY_PACKAGE: DeliveryPackage = {
  id: 'delivery-package-e2e',
  workspace_id: WORKSPACE_ID,
  project_id: DEFAULT_PROJECT_ID,
  vendor_id: 'vendor-a',
  client_id: 'client-a',
  name: 'Approved Art Delivery',
  status: 'draft',
  notes: 'Created during Playwright operation branch trace.',
  created_at: NOW,
  updated_at: NOW,
};

const ENTERPRISE_CONTROLS: ProjectEnterpriseControls = {
  project_id: DEFAULT_PROJECT_ID,
  roles: [
    { role: 'admin', scope: 'workspace', member_count: 1, permissions: ['project:admin', 'workflow:edit'] },
    { role: 'producer', scope: 'project', member_count: 3, permissions: ['issue:write', 'sprint:plan'] },
  ],
  notifications: [
    { event: 'assignments', channels: ['in_app', 'email'], delivery_policy: 'immediate', enabled: true },
    { event: 'automation_results', channels: ['in_app', 'webhook'], delivery_policy: 'guarded_result', enabled: true },
  ],
  import_export: [
    { job_type: 'csv_import', direction: 'import', format: 'csv', status: 'ready', description: 'Bulk issue import.' },
    { job_type: 'json_export', direction: 'export', format: 'json', status: 'ready', description: 'Project export.' },
  ],
  webhooks: [
    { event: 'issue_transition', status: 'active', target: 'project_webhook.issue_transition', retry_policy: '3_attempts' },
  ],
  templates: [
    { name: 'Outsourcing Art Board', description: 'Brief through delivery workflow.', includes: ['workflow', 'roles'] },
  ],
  ci_gates: [
    { name: 'unit', command: 'pnpm run test:ut', required: true, status: 'passing' },
    { name: 'browser_paths', command: 'pnpm run test:e2e', required: true, status: 'passing' },
  ],
  audit: {
    policy: 'append_only',
    retention_days: 365,
    drilldowns: ['issue_history', 'automation_runs'],
    export_formats: ['json', 'csv'],
  },
};

function ok<T>(data: T): ApiResponse<T> {
  return { data, success: true };
}

function paginated<T>(data: T[]): PaginatedResponse<T> {
  return {
    data,
    total: data.length,
    page: 1,
    page_size: data.length,
    total_pages: 1,
    success: true,
  };
}

function issueDetail(id: string): Issue {
  const summary = ISSUES.find((issue) => issue.id === id) ?? ISSUES[0];
  return {
    ...summary,
    workspace_id: WORKSPACE_ID,
    brief_id: 'brief-e2e',
    milestone_id: 'milestone-alpha',
    description: 'Playwright trace issue fixture with editable fields, comments, work logs, and assets.',
    reporter_id: 'user-reporter',
    metadata: {},
  };
}

async function json(route: Route, body: unknown, status = 200): Promise<void> {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function mockApi(page: Page): Promise<void> {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const method = request.method();

    if (pathname === '/api/health') {
      return json(route, { status: 'ok', service: 'assetslake', version: 'e2e' });
    }

    if (pathname === '/api/assets/upload' && method === 'POST') {
      return json(route, ok(UPLOAD_RESULT));
    }

    if (pathname === '/api/assets' || pathname === '/api/assets/search') {
      return json(route, paginated(ASSETS));
    }

    const assetVersionsCompareMatch = pathname.match(/^\/api\/assets\/([^/]+)\/versions\/compare$/);
    if (assetVersionsCompareMatch) {
      return json(route, ok(ASSET_VERSION_DIFF));
    }

    const assetVersionsMatch = pathname.match(/^\/api\/assets\/([^/]+)\/versions$/);
    if (assetVersionsMatch) {
      return json(route, ok(ASSET_VERSIONS));
    }

    const assetInsightsMatch = pathname.match(/^\/api\/assets\/([^/]+)\/insights$/);
    if (assetInsightsMatch) {
      return json(route, ok(ASSET_INSIGHTS.filter((insight) => insight.asset_id === assetInsightsMatch[1])));
    }

    const assetAnalyzeMatch = pathname.match(/^\/api\/assets\/([^/]+)\/analyze$/);
    if (assetAnalyzeMatch && method === 'POST') {
      return json(route, ok(ANALYZE_ASSET_RESPONSE));
    }

    const assetMatch = pathname.match(/^\/api\/assets\/([^/]+)$/);
    if (assetMatch) {
      const sourceAsset = ASSETS.find((asset) => asset.id === assetMatch[1]);
      const asset: Asset = sourceAsset
        ? {
            ...sourceAsset,
            description: 'Concept board fixture for Playwright operation traces.',
            bucket: 'assetslake-e2e',
            object_key: `e2e/${sourceAsset.original_filename}`,
            checksum_sha256: 'e2e-checksum',
            parent_id: undefined,
            uploader_id: 'user-e2e',
            reviewed_by: undefined,
            reviewed_at: undefined,
            review_note: undefined,
            ai_tags: ['trace'],
            embedding_id: 'qdrant-e2e',
            search_doc_id: 'opensearch-e2e',
            graph_node_id: 'neo4j-e2e',
            deleted_at: undefined,
          }
        : {
            ...UPLOAD_RESULT,
            id: UPLOAD_RESULT.asset_id,
            description: 'Uploaded during Playwright E2E trace.',
            checksum_sha256: 'e2e-checksum',
            parent_id: undefined,
            project_id: DEFAULT_PROJECT_ID,
            uploader_id: 'user-e2e',
            uploader: 'Playwright',
            reviewed_by: undefined,
            reviewed_at: undefined,
            review_note: undefined,
            ai_tags: ['trace'],
            embedding_id: 'qdrant-e2e',
            search_doc_id: 'opensearch-e2e',
            graph_node_id: 'neo4j-e2e',
            updated_at: NOW,
          };
      return json(route, ok(asset));
    }

    if (pathname === '/api/issues' && method === 'GET') {
      return json(route, paginated(ISSUES));
    }

    if (pathname === '/api/issues' && method === 'POST') {
      return json(route, ok(issueDetail('issue-a')));
    }

    const issueMatch = pathname.match(/^\/api\/issues\/([^/]+)$/);
    if (issueMatch) {
      if (method === 'DELETE') {
        return route.fulfill({ status: 204 });
      }
      return json(route, ok(issueDetail(issueMatch[1])));
    }

    const issueChildMatch = pathname.match(/^\/api\/issues\/([^/]+)\/([^/]+)$/);
    if (issueChildMatch) {
      const issueId = issueChildMatch[1];
      const child = issueChildMatch[2];
      if (child === 'comments') {
        const comment: IssueComment = {
          id: 'comment-e2e',
          issue_id: issueId,
          author_id: 'user-e2e',
          author_name: 'Playwright',
          body: 'Playwright trace comment',
          visibility: 'internal',
          created_at: NOW,
        };
        return json(route, ok(method === 'POST' ? comment : [comment]));
      }
      if (child === 'work-logs') {
        const workLog: IssueWorkLog = {
          id: 'worklog-e2e',
          issue_id: issueId,
          author_id: 'user-e2e',
          author_name: 'Playwright',
          time_spent_minutes: 45,
          started_at: NOW,
          body: 'E2E work log',
          created_at: NOW,
        };
        return json(route, ok(method === 'POST' ? workLog : [workLog]));
      }
      if (child === 'assets') {
        return json(route, ok(ASSETS.map((asset) => ({ ...asset, link_type: 'reference' }))));
      }
      if (child === 'history') {
        const history: IssueStatusHistory[] = [
          {
            id: 'history-e2e',
            issue_id: issueId,
            from_status: 'backlog',
            to_status: 'in_progress',
            actor_id: 'user-e2e',
            actor: 'Playwright',
            reason: 'E2E fixture',
            created_at: NOW,
          },
        ];
        return json(route, ok(history));
      }
      if (['transition', 'review', 'approve', 'request-revision', 'attach-asset'].includes(child)) {
        return json(route, ok(issueDetail(issueId)));
      }
    }

    if (pathname === '/api/milestones') {
      return json(route, ok(MILESTONES));
    }

    if (pathname === '/api/management/intelligence') {
      return json(route, ok({
        product_surface: 'AssetsLake Playwright E2E',
        langgraph_nodes: [
          { name: 'intake_classifier', state: 'ready', detail: 'Classifies incoming issues.' },
          { name: 'evidence_retriever', state: 'ready', detail: 'Fetches data lake evidence.' },
        ],
        data_lake_feeds: [
          { name: 'asset_lineage', detail: 'Links assets to project evidence.' },
        ],
        automation_rules: [
          { name: 'review_gate', detail: 'Requires human approval.', guardrail: 'human_review_required' },
        ],
        ai_status: {
          configured: true,
          used: true,
          provider: 'Playwright AI',
          model: 'trace-model',
        },
      }));
    }

    if (pathname === '/api/management/chat' && method === 'POST') {
      return json(route, ok({
        message: 'AI Control ready: inspect risks, then use a guarded control button to write product state.',
        actions: [
          { label: 'Risk Comment', action_id: 'comment-risk', kind: 'issue.comment' },
          { label: 'Asset Evidence Update', action_id: 'update-asset-evidence', kind: 'asset.update' },
          { label: 'Lake Index', action_id: 'index-data-lake', kind: 'asset.index' },
          { label: 'Version Gate', action_id: 'version-gate', kind: 'asset.version_gate' },
          { label: 'Open Issue', action_id: 'create-issue-from-asset', kind: 'issue.create_from_asset' },
          { label: 'Attach Evidence', action_id: 'attach-asset-evidence', kind: 'issue.attach_asset' },
        ],
        ai_status: {
          configured: true,
          used: true,
          provider: 'Playwright AI',
          model: 'trace-model',
        },
      }));
    }

    if (pathname === '/api/management/rag/search' && method === 'POST') {
      return json(route, ok({
        qdrant_enabled: true,
        collection: 'assetslake_operation_memories',
        embedding_provider: 'playwright_embedding',
        matches: [
          {
            id: 'rag-memory-e2e',
            score: 0.91,
            operation_type: 'asset.updated',
            app: 'Data Lake',
            entity_type: 'asset',
            entity_id: 'asset-code-a',
            actor: 'AI Control',
            summary: 'Indexed data lake operation memory',
            content: 'Playwright RAG memory fixture for operation feedback.',
            metadata: { source: 'playwright' },
            created_at: NOW,
          },
        ],
      }));
    }

    if (pathname === '/api/data-lake/query/sql' && method === 'POST') {
      const body = request.postData() ?? '';
      if (body.includes('asset_ai_insights')) {
        return json(route, ok({
          engine: 'postgresql',
          readonly: true,
          columns: ['name', 'modality', 'provider', 'summary'],
          rows: [
            {
              name: 'Concept Board',
              modality: 'image',
              provider: 'Playwright AI',
              summary: ASSET_INSIGHTS[0].summary,
            },
          ],
          row_count: 1,
          warnings: ['SQL console is read-only: only SELECT/WITH queries are accepted.'],
        }));
      }
      return json(route, ok({
        engine: 'postgresql',
        readonly: true,
        columns: ['id', 'name', 'asset_type', 'version'],
        rows: [
          {
            id: 'asset-code-a',
            name: 'Build Pipeline Script',
            asset_type: 'code',
            version: 3,
          },
        ],
        row_count: 1,
        warnings: ['SQL console is read-only: only SELECT/WITH queries are accepted.'],
      }));
    }

    if (pathname === '/api/data-lake/query/cypher' && method === 'POST') {
      const body = request.postData() ?? '';
      if (body.includes('HAS_INSIGHT')) {
        return json(route, ok({
          engine: 'data-lake-cypher-projection',
          readonly: true,
          columns: ['a', 'r', 'x'],
          rows: [
            {
              a: { id: 'asset-a', label: 'Asset', properties: { name: 'Concept Board' } },
              r: { type: 'HAS_INSIGHT', properties: { provider: 'Playwright AI' } },
              x: { id: 'insight-asset-a', label: 'AiInsight', properties: { summary: ASSET_INSIGHTS[0].summary } },
            },
          ],
          row_count: 1,
          warnings: ['Cypher runs against the AssetsLake graph projection.'],
        }));
      }
      return json(route, ok({
        engine: 'data-lake-cypher-projection',
        readonly: true,
        columns: ['i', 'r', 'a'],
        rows: [
          {
            i: { id: 'issue-b', label: 'Issue', properties: { issue_key: 'AL-002', title: 'Model Pass' } },
            r: { type: 'HAS_EVIDENCE', properties: { link_type: 'reference' } },
            a: { id: 'asset-code-a', label: 'Asset', properties: { name: 'Build Pipeline Script' } },
          },
        ],
        row_count: 1,
        warnings: ['Cypher runs against the AssetsLake graph projection.'],
      }));
    }

    if (pathname === '/api/delivery-packages' && method === 'POST') {
      return json(route, ok(DELIVERY_PACKAGE));
    }

    if (pathname === `/api/delivery-packages/${DELIVERY_PACKAGE.id}/submit` && method === 'POST') {
      return json(route, ok({ ...DELIVERY_PACKAGE, status: 'submitted', submitted_by: 'delivery-manager', submitted_at: NOW }));
    }

    if (pathname.startsWith('/api/project-management')) {
      const plan: ProjectManagementPlan = {
        project_id: DEFAULT_PROJECT_ID,
        epics: EPICS,
        sprints: SPRINTS,
        backlog: ISSUES.filter((issue) => issue.status === 'backlog' || issue.status === 'brief_ready'),
        active_sprint: ISSUES.filter((issue) => ['assigned', 'in_progress', 'submitted'].includes(issue.status)),
        dependencies: DEPENDENCIES,
        recent_events: EVENTS,
      };

      if (pathname === '/api/project-management/plan') return json(route, ok(plan));
      if (pathname === '/api/project-management/epics') return json(route, ok(EPICS));
      if (pathname === '/api/project-management/sprints') return json(route, ok(SPRINTS));
      if (pathname === '/api/project-management/dependencies') return json(route, ok(DEPENDENCIES));
      if (pathname === '/api/project-management/events') return json(route, ok(EVENTS));

      if (pathname === '/api/project-management/gantt') {
        const gantt: ProjectGanttSnapshot = {
          project_id: DEFAULT_PROJECT_ID,
          schedule_items: ISSUES.map((issue) => ({
            id: issue.id,
            issue_key: issue.issue_key,
            title: issue.title,
            status: issue.status,
            priority: issue.priority,
            start_date: issue.start_date,
            due_date: issue.due_date,
            story_points: issue.story_points,
            dependency_count: DEPENDENCIES.filter((dep) => dep.source_issue_id === issue.id || dep.target_issue_id === issue.id).length,
          })),
          dependencies: DEPENDENCIES,
          baseline_status: 'ready_for_baseline_capture',
        };
        return json(route, ok(gantt));
      }

      if (pathname === '/api/project-management/calendar') {
        const calendar: ProjectCalendarSnapshot = {
          project_id: DEFAULT_PROJECT_ID,
          events: ISSUES.map((issue) => ({
            id: issue.id,
            title: issue.title,
            item_type: 'issue_due_date',
            date: issue.due_date,
            end_date: issue.due_date,
            status: issue.status,
            lane: issue.status === 'submitted' ? 'review' : 'sprint',
            risk: issue.id === 'issue-b' ? 'blocked' : 'normal',
            owner: issue.assignee_name,
          })),
          lanes: [
            { id: 'sprint', label: 'Sprint Plan', calendar_type: 'sprint', status: 'ready', event_count: 2 },
            { id: 'release', label: 'Release Milestones', calendar_type: 'release', status: 'planned', event_count: 1 },
            { id: 'review', label: 'Review Windows', calendar_type: 'review', status: 'ready', event_count: 1 },
            { id: 'vendor', label: 'Vendor Delivery', calendar_type: 'vendor', status: 'ready', event_count: 0 },
          ],
          workload: [
            { date: '2026-05-24', total: 1, review: 0, vendor: 0, risk: 0 },
            { date: '2026-05-29', total: 1, review: 0, vendor: 0, risk: 1 },
            { date: '2026-06-03', total: 1, review: 1, vendor: 0, risk: 0 },
          ],
          review_calendar: 'ready',
          vendor_delivery_calendar: 'ready',
        };
        return json(route, ok(calendar));
      }

      if (pathname === '/api/project-management/reports') {
        const reports: ProjectReportsSnapshot = {
          project_id: DEFAULT_PROJECT_ID,
          burndown: {
            open: 3,
            closed: 1,
            points: [
              { label: 'Start', open: 4, closed: 0, ideal_remaining: 4 },
              { label: 'Mid', open: 3, closed: 1, ideal_remaining: 2 },
              { label: 'Now', open: 3, closed: 1, ideal_remaining: 0 },
            ],
          },
          velocity: {
            sprints: 1,
            status: 'calculated_from_story_points',
            average_completed: 8,
            predictability_percent: 80,
            points: [{ sprint: 'Sprint 24.1', committed: 10, completed: 8, carryover: 2 }],
          },
          cumulative_flow: {
            backlog: 1,
            active: 2,
            review: 1,
            done: 1,
            points: [
              { label: 'Start', backlog: 3, active: 1, review: 0, done: 0 },
              { label: 'Now', backlog: 1, active: 2, review: 1, done: 1 },
            ],
          },
          cycle_time: {
            event_samples: 1,
            metrics: [
              { name: 'Brief to Assignment', average_hours: 8, p85_hours: 18, sample_size: 1 },
              { name: 'Review Turnaround', average_hours: 22, p85_hours: 36, sample_size: 1 },
            ],
          },
          sla: {
            overall_compliance_percent: 82,
            metrics: [
              { name: 'Review SLA', target_hours: 24, breached: 1, total: 4, compliance_percent: 75 },
              { name: 'Evidence SLA', target_hours: 12, breached: 0, total: 4, compliance_percent: 100 },
            ],
          },
          delivery_readiness: {
            dependency_count: DEPENDENCIES.length,
            epic_count: EPICS.length,
            blocked_count: 1,
            missing_evidence_count: 0,
            ready_percent: 82,
          },
        };
        return json(route, ok(reports));
      }

      if (pathname === '/api/project-management/workflow') {
        const workflow: ProjectWorkflowCatalog = {
          project_id: DEFAULT_PROJECT_ID,
          statuses: ['backlog', 'brief_ready', 'assigned', 'in_progress', 'submitted', 'internal_review', 'client_review', 'revision_required', 'approved', 'delivered'],
          guards: ['assignment_required', 'asset_evidence_required'],
          validators: ['valid_transition', 'required_fields'],
          transitions: [
            { id: 'backlog_to_brief_ready', from_status: 'backlog', to_status: 'brief_ready', name: 'Backlog to Brief Ready', guard: 'required_fields', validator: 'valid_transition', approval_required: false, evidence_required: false, sla_hours: 8 },
            { id: 'brief_ready_to_assigned', from_status: 'brief_ready', to_status: 'assigned', name: 'Brief Ready to Assigned', guard: 'assignment_required', validator: 'required_fields', approval_required: false, evidence_required: false, sla_hours: 8 },
            { id: 'assigned_to_in_progress', from_status: 'assigned', to_status: 'in_progress', name: 'Assigned to In Progress', guard: 'assignment_required', validator: 'valid_transition', approval_required: false, evidence_required: false, sla_hours: 8 },
            { id: 'in_progress_to_submitted', from_status: 'in_progress', to_status: 'submitted', name: 'In Progress to Submitted', guard: 'asset_evidence_required', validator: 'data_lake_evidence_present', approval_required: false, evidence_required: true, sla_hours: 12 },
            { id: 'submitted_to_internal_review', from_status: 'submitted', to_status: 'internal_review', name: 'Submitted to Internal Review', guard: 'human_approval_required', validator: 'required_fields', approval_required: true, evidence_required: true, sla_hours: 24 },
            { id: 'client_review_to_approved', from_status: 'client_review', to_status: 'approved', name: 'Client Review to Approved', guard: 'human_approval_required', validator: 'data_lake_evidence_present', approval_required: true, evidence_required: true, sla_hours: 24 },
          ],
          approval_policy: {
            default_reviewer_role: 'art_director',
            data_lake_evidence_required: true,
            human_approval_statuses: ['internal_review', 'client_review', 'approved'],
            audit_event: 'workflow_transition_reviewed',
          },
        };
        return json(route, ok(workflow));
      }

      if (pathname === '/api/project-management/automation') {
        const automation: ProjectAutomationCatalog = {
          project_id: DEFAULT_PROJECT_ID,
          rules: [
            { id: 'overdue_escalation', name: 'Overdue Escalation', trigger: 'issue_due_date_missed', conditions: ['status_not_delivered', 'assignee_present'], actions: ['summarize_data_lake_evidence', 'notify_producer'], langgraph_node: 'priority_planner', guardrail: 'human_review_required', enabled: true, approval_required: true },
            { id: 'review_gate', name: 'Review Gate', trigger: 'status_entered_internal_review', conditions: ['asset_evidence_present', 'reviewer_available'], actions: ['prepare_review_context', 'request_human_approval'], langgraph_node: 'evidence_retriever', guardrail: 'human_review_required', enabled: true, approval_required: true },
          ],
          langgraph_nodes: ['intake_classifier', 'evidence_retriever'],
          runbook: [
            { id: 'collect-context', node: 'intake_classifier', action: 'classify_issue_and_trigger', reads: ['issue', 'workflow_event'], writes: ['automation_run'], requires_approval: false },
            { id: 'retrieve-evidence', node: 'evidence_retriever', action: 'load_asset_lineage_and_history', reads: ['data_lake', 'issue_events'], writes: ['evidence_summary'], requires_approval: false },
          ],
          guardrail: 'human_review_required',
        };
        return json(route, ok(automation));
      }

      if (pathname === '/api/project-management/enterprise') {
        return json(route, ok(ENTERPRISE_CONTROLS));
      }
    }

    return json(route, { success: false, error: `Unhandled E2E mock route: ${method} ${pathname}` }, 404);
  });
}
