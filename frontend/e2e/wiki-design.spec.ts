/*
```cypher
CREATE
  (f:File {name: "wiki-design.spec.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/wiki-design.spec", type: "module"}),
  (fn1:Function {name: "json", type: "function", language: "typescript", signature: "async function json(route: Route, data: unknown): Promise<void>"}),
  (fn2:Function {name: "installWikiMocks", type: "function", language: "typescript", signature: "async function installWikiMocks(page: Page): Promise<void>"}),
  (fn3:Function {name: "installDesignMocks", type: "function", language: "typescript", signature: "async function installDesignMocks(page: Page): Promise<void>"}),
  (fn4:Function {name: "wiki autosaves collaborative edits and shows presence", type: "function", language: "typescript", signature: "test callback"}),
  (fn5:Function {name: "design requirements draft with AI and bind governed assets", type: "function", language: "typescript", signature: "test callback"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1);
```
*/

import { expect, test, type Page, type Route } from '@playwright/test';

import { installAuthenticatedSession } from './fixtures/authSession';

const NOW = '2026-06-12T08:00:00.000Z';

async function json(route: Route, data: unknown): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data }),
  });
}

async function installWikiMocks(page: Page): Promise<void> {
  let content = '# Start\n\nShared notes';
  let version = 1;
  const pageRecord = () => ({
    id: 'wiki-page-1',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    space_id: 'wiki-space-1',
    parent_id: null,
    title: 'Start',
    slug: 'start',
    content_markdown: content,
    version,
    updated_by_name: 'Playwright Artist',
    created_at: NOW,
    updated_at: NOW,
  });

  await page.route('**/api/wiki/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;

    if (request.method() === 'GET' && pathname === '/api/wiki/spaces') {
      return json(route, [
        {
          id: 'wiki-space-1',
          workspace_id: '00000000-0000-0000-0000-000000000001',
          name: 'Product Wiki',
          slug: 'product-wiki',
          description: 'Shared product knowledge',
          created_by_name: 'Playwright Artist',
          created_at: NOW,
          updated_at: NOW,
        },
      ]);
    }
    if (request.method() === 'GET' && pathname === '/api/wiki/spaces/wiki-space-1/pages') {
      return json(route, [pageRecord()]);
    }
    if (request.method() === 'GET' && pathname === '/api/wiki/pages/wiki-page-1/sync') {
      return json(route, {
        page: pageRecord(),
        updates: [],
        collaborators: [
          {
            page_id: 'wiki-page-1',
            client_id: 'remote-editor',
            user_id: 'user-remote',
            display_name: 'Remote Editor',
            cursor_anchor: 3,
            cursor_head: 3,
            last_seen_at: NOW,
          },
        ],
      });
    }
    if (request.method() === 'POST' && pathname.endsWith('/presence')) {
      return json(route, [
        {
          page_id: 'wiki-page-1',
          client_id: 'remote-editor',
          user_id: 'user-remote',
          display_name: 'Remote Editor',
          cursor_anchor: 3,
          cursor_head: 3,
          last_seen_at: NOW,
        },
      ]);
    }
    if (request.method() === 'POST' && pathname.endsWith('/updates')) {
      const body = request.postDataJSON() as {
        client_id: string;
        base_version: number;
        patch: { from: number; to: number; insert: string };
      };
      const chars = Array.from(content);
      chars.splice(
        body.patch.from,
        body.patch.to - body.patch.from,
        ...Array.from(body.patch.insert),
      );
      content = chars.join('');
      version += 1;
      return json(route, {
        id: 'wiki-update-1',
        page_id: 'wiki-page-1',
        client_id: body.client_id,
        base_version: body.base_version,
        version,
        patch: body.patch,
        content_markdown: content,
        created_by_name: 'Playwright Artist',
        created_at: NOW,
      });
    }

    await route.abort();
  });
}

async function installDesignMocks(page: Page): Promise<void> {
  const requirement = {
    id: 'requirement-1',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    project_id: null,
    title: 'Hero lighting',
    summary: 'Define the hero lighting target.',
    status: 'draft',
    priority: 'high',
    acceptance_criteria: ['Key light direction is approved'],
    owner_name: 'Playwright Artist',
    reviewer_name: null,
    due_date: null,
    version: 1,
    created_at: NOW,
    updated_at: NOW,
  };
  const detail = { requirement, assets: [] as unknown[], comments: [] as unknown[] };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;

    if (request.method() === 'GET' && pathname === '/api/auth/me') {
      return json(route, {
        user: {
          id: 'user-e2e-admin',
          username: 'playwright.admin',
          display_name: 'Playwright Admin',
          email: 'playwright@example.test',
          role: 'admin',
          avatar_url: null,
        },
        session_id: 'session-playwright-e2e',
        expires_at: '2099-01-01T00:00:00.000Z',
      });
    }
    if (request.method() === 'GET' && pathname === '/api/auth/test-accounts') {
      return json(route, []);
    }
    if (request.method() === 'GET' && pathname === '/api/assets') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 'asset-a', name: 'Hero Render', version: 4 }],
          total: 1,
          page: 1,
          page_size: 100,
          total_pages: 1,
        }),
      });
      return;
    }
    if (request.method() === 'GET' && pathname === '/api/design-requirements') {
      return json(route, [requirement]);
    }
    if (request.method() === 'GET' && pathname === '/api/design-requirements/requirement-1') {
      return json(route, detail);
    }
    if (request.method() === 'POST' && pathname.endsWith('/assets')) {
      const binding = {
        requirement_id: requirement.id,
        asset_id: 'asset-a',
        asset_name: 'Hero Render',
        asset_type: 'concept_art',
        preview_url: null,
        asset_version: 4,
        verified: true,
        relation_type: 'reference',
        note: 'Primary reference',
        attached_by_name: 'Playwright Admin',
        created_at: NOW,
      };
      detail.assets.push(binding);
      return json(route, binding);
    }
    if (request.method() === 'POST' && pathname.endsWith('/comments')) {
      const comment = {
        id: 'comment-1',
        requirement_id: requirement.id,
        body: 'Ready for review',
        author_name: 'Playwright Admin',
        created_at: NOW,
        updated_at: NOW,
      };
      detail.comments.push(comment);
      return json(route, comment);
    }
    if (request.method() === 'POST' && pathname === '/api/design-requirements/ai/draft') {
      return json(route, {
        title: 'AI hero lighting',
        summary: 'Use a controlled cinematic key light with readable silhouettes.',
        priority: 'high',
        acceptance_criteria: [
          'Silhouette remains readable',
          'Lighting matches the bound reference',
        ],
        rationale: 'Derived from the design prompt and governed asset context.',
      });
    }

    await route.abort();
  });
}

test('wiki autosaves collaborative edits and shows presence', async ({ page }) => {
  await installAuthenticatedSession(page, 'artist');
  await installWikiMocks(page);

  await page.goto('/wiki');
  await expect(page.getByRole('heading', { name: 'Start' })).toBeVisible();
  await expect(page.getByText('Remote Editor')).toBeVisible();

  const updateResponse = page.waitForResponse((response) =>
    response.url().includes('/api/wiki/pages/wiki-page-1/updates'),
  );
  await page.locator('textarea').fill('# Start\n\nCollaborative edit');
  await updateResponse;

  await expect(page.getByText('Version 2')).toBeVisible();
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
});

test('design requirements draft with AI and bind governed assets', async ({ page }) => {
  await installAuthenticatedSession(page);
  await installDesignMocks(page);

  await page.goto('/design-requirements');
  await expect(page.getByRole('heading', { name: 'Design Requirements' })).toBeVisible();
  await page.getByRole('button', { name: /Hero lighting/ }).click();
  await expect(page.getByPlaceholder('Requirement title')).toHaveValue('Hero lighting');

  await page
    .getByPlaceholder('Describe the visual goal, constraints, audience, and delivery context')
    .fill('Create cinematic hero lighting based on the linked render.');
  await page.getByRole('button', { name: 'Generate draft' }).click();
  await expect(page.getByPlaceholder('Requirement title')).toHaveValue('AI hero lighting');

  await page.locator('select').nth(3).selectOption('asset-a');
  await page.getByPlaceholder('Link note').fill('Primary reference');
  await page.getByRole('button', { name: 'Link' }).click();
  await expect(page.getByText('Hero Render', { exact: true })).toBeVisible();

  await page.getByPlaceholder('Add a comment').fill('Ready for review');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Ready for review')).toBeVisible();
});
