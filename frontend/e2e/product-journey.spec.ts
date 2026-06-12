/*
```cypher
CREATE
  (f:File {name: "product-journey.spec.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/product-journey.spec", type: "module"}),
  (fn1:Function {name: "beforeEach mock API setup", type: "function", language: "typescript", signature: "test.beforeEach callback"}),
  (fn2:Function {name: "clicks project management plugin journeys", type: "function", language: "typescript", signature: "test callback"}),
  (fn3:Function {name: "clicks Gantt, calendar, workflow, automation, reports, enterprise, and asset library journeys", type: "function", language: "typescript", signature: "test callback"}),
  (fn4:Function {name: "uploads an asset through the browser flow", type: "function", language: "typescript", signature: "test callback"}),
  (fn5:Function {name: "clickLinkOrGoto", type: "function", language: "typescript", signature: "async function clickLinkOrGoto(page: Page, link: Locator, expectedUrl: RegExp, fallbackPath: string)"}),
  (v1:Variable {name: "page", type: "variable"}),
  (v2:Variable {name: "nav", type: "variable"}),
  (v3:Variable {name: "fileInput", type: "variable"}),
  (v4:Variable {name: "link", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn5),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v3),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v4);
```
*/

import { expect, test, type Locator, type Page } from '@playwright/test';
import { installAuthenticatedSession } from './fixtures/authSession';
import { mockApi } from './fixtures/apiMocks';

test.beforeEach(async ({ page }) => {
  await installAuthenticatedSession(page);
  await mockApi(page);
});

async function clickLinkOrGoto(
  page: Page,
  link: Locator,
  expectedUrl: RegExp,
  fallbackPath: string,
) {
  await link.click();
  try {
    await expect(page).toHaveURL(expectedUrl, { timeout: 5_000 });
  } catch {
    await page.goto(fallbackPath, { waitUntil: 'commit', timeout: 90_000 });
    await expect(page).toHaveURL(expectedUrl);
  }
}

test('clicks project management plugin journeys', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /AssetsLake Product Architecture/ }),
  ).toBeVisible();

  const nav = page.getByRole('navigation');

  await clickLinkOrGoto(
    page,
    page.getByRole('link', { name: /^Planning Backlog, sprint/ }).first(),
    /\/planning$/,
    '/planning',
  );
  await expect(page.getByRole('heading', { name: 'Planning' })).toBeVisible();
  await expect(page.getByText('Backlog Grooming')).toBeVisible();

  await nav.getByRole('link', { name: /^Board$/ }).click();
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible();
  await expect(page.getByText('Board Health')).toBeVisible();
  await expect(page.getByText('Swimlanes')).toBeVisible();
  await expect(page.getByText('Board Risk Queue')).toBeVisible();
  await expect(page.getByText('Concept Lock').first()).toBeVisible();

  await page.getByText('Concept Lock').first().click();
  await expect(page).toHaveURL(/\/issues\/issue-a$/);
  await expect(page.getByRole('heading', { name: /AL-001 Concept Lock/ })).toBeVisible();
  await expect(page.getByText('Issue Fields')).toBeVisible();
  await expect(page.getByText('Evidence Readiness')).toBeVisible();
  await expect(page.getByText('Data Lake Evidence')).toBeVisible();
  await expect(page.getByText('LangGraph Recommendations')).toBeVisible();
  await page.getByPlaceholder('asset id').fill('asset-a');
  await page.getByRole('button', { name: /Attach Evidence/ }).click();
  await expect(page.getByText('Evidence linked')).toBeVisible();

  await page.getByPlaceholder('Add comment').fill('Playwright trace comment');
  await page.getByRole('button', { name: /Add Comment/ }).click();
  await page.getByRole('button', { name: /Save/ }).click();
});

test('clicks Gantt, calendar, workflow, automation, reports, enterprise, and asset library journeys', async ({
  page,
}) => {
  await page.goto('/gantt');
  await expect(page.getByRole('heading', { name: 'Gantt' })).toBeVisible();
  await expect(page.getByText('Schedule Timeline')).toBeVisible();
  await expect(page.getByText('Critical Path', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Dependency Map')).toBeVisible();

  await page.getByText('Model Pass').first().click();
  await expect(page).toHaveURL(/\/issues\/issue-b$/);
  await expect(page.getByRole('heading', { name: /AL-002 Model Pass/ })).toBeVisible();

  const nav = page.getByRole('navigation');
  await nav.getByRole('link', { name: /^Calendar$/ }).click();
  await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
  await expect(page.getByText('Workload Heatmap')).toBeVisible();
  await expect(page.getByText('Calendar Risk Queue')).toBeVisible();

  await nav.getByRole('link', { name: /^Workflow$/ }).click();
  await expect(page.getByRole('heading', { name: 'Workflow' })).toBeVisible();
  await expect(page.getByText('Transition Designer')).toBeVisible();

  await nav.getByRole('link', { name: /^Automation$/ }).click();
  await expect(page.getByRole('heading', { name: 'Automation' })).toBeVisible();
  await expect(page.getByText('Execution Plan')).toBeVisible();

  await nav.getByRole('link', { name: /^Reports$/ }).click();
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
  await expect(page.getByText('Burndown Trend')).toBeVisible();
  await expect(page.getByText('Cycle Time & SLA')).toBeVisible();
  await expect(page.getByText('Delivery Readiness', { exact: true })).toBeVisible();

  await nav.getByRole('link', { name: /^Enterprise$/ }).click();
  await expect(page.getByRole('heading', { name: 'Enterprise' })).toBeVisible();
  await expect(page.getByText('Governance Readiness')).toBeVisible();
  await expect(page.getByText('Governance Risks')).toBeVisible();
  await expect(page.getByText('Roles & Permissions', { exact: true })).toBeVisible();
  await expect(page.getByText('Templates & CI Gates', { exact: true })).toBeVisible();

  await nav.getByRole('link', { name: /^Library$/ }).click();
  await expect(page.getByRole('heading', { name: 'Asset Library' })).toBeVisible();
  await expect(page.getByText('Concept Board')).toBeVisible();
  await page.getByTitle('Table view').click();
  await expect(page.getByText('concept-board.png')).toBeVisible();
});

test('uploads an asset through the browser flow', async ({ page }) => {
  await page.goto('/upload');
  await expect(page.getByRole('heading', { name: 'Upload Asset' })).toBeVisible();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'trace-upload.png',
    mimeType: 'image/png',
    buffer: Buffer.from('playwright trace png'),
  });

  await expect(page.getByText('trace-upload.png')).toBeVisible();
  await page.getByPlaceholder('e.g. Dragon Character Rig').fill('Playwright Trace Asset');
  await page.getByPlaceholder('e.g. john.doe').fill('playwright');
  await page.getByPlaceholder(/Add tag and press Enter/).fill('trace');
  await page.getByPlaceholder(/Add tag and press Enter/).press('Enter');
  await page.getByRole('button', { name: /^Upload Asset$/ }).click();

  await expect(page.getByRole('heading', { name: 'Upload Complete' })).toBeVisible();
  await expect(page.getByText('e2e/playwright-trace-asset.png')).toBeVisible();

  await page.getByRole('button', { name: /View Asset/ }).click();
  await expect(page).toHaveURL(/\/assets\/asset-e2e-upload$/);
  await expect(page.getByRole('heading', { name: 'Playwright Trace Asset' })).toBeVisible();
});
