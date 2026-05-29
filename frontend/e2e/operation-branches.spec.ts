/*
```cypher
CREATE
  (f:File {name: "operation-branches.spec.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/operation-branches.spec", type: "module"}),
  (fn1:Function {name: "beforeEach mock API setup", type: "function", language: "typescript", signature: "test.beforeEach callback"}),
  (fn2:Function {name: "operation branch: management intelligence to brief creation", type: "function", language: "typescript", signature: "test callback"}),
  (fn3:Function {name: "operation branch: kanban drag and issue opening", type: "function", language: "typescript", signature: "test callback"}),
  (fn4:Function {name: "operation branch: issue lifecycle actions", type: "function", language: "typescript", signature: "test callback"}),
  (fn5:Function {name: "operation branch: review and approval decisions", type: "function", language: "typescript", signature: "test callback"}),
  (fn6:Function {name: "operation branch: timeline analytics workflow and governance", type: "function", language: "typescript", signature: "test callback"}),
  (fn7:Function {name: "operation branch: delivery package creation and submission", type: "function", language: "typescript", signature: "test callback"}),
  (fn8:Function {name: "operation branch: asset library detail and upload", type: "function", language: "typescript", signature: "test callback"}),
  (fn9:Function {name: "operation branch: AI settings save and test", type: "function", language: "typescript", signature: "test callback"}),
  (fn15:Function {name: "operation branch: AI control cross-app execution", type: "function", language: "typescript", signature: "test callback"}),
  (fn10:Function {name: "gotoApp", type: "function", language: "typescript", signature: "async function gotoApp(page: Page, path: string): Promise<void>"}),
  (fn11:Function {name: "expectHeading", type: "function", language: "typescript", signature: "async function expectHeading(page: Page, name: string | RegExp): Promise<void>"}),
  (fn12:Function {name: "fillBriefForm", type: "function", language: "typescript", signature: "async function fillBriefForm(page: Page): Promise<void>"}),
  (fn13:Function {name: "dragIssueToColumn", type: "function", language: "typescript", signature: "async function dragIssueToColumn(page: Page, issueTitle: string, columnTitle: string): Promise<void>"}),
  (fn14:Function {name: "clickFirstButton", type: "function", language: "typescript", signature: "async function clickFirstButton(page: Page, name: RegExp): Promise<void>"}),
  (v1:Variable {name: "page", type: "variable"}),
  (v2:Variable {name: "issueTitle", type: "variable"}),
  (v3:Variable {name: "columnTitle", type: "variable"}),
  (v4:Variable {name: "name", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn10),
  (fn2)-[:CALLS]->(fn11),
  (fn2)-[:CALLS]->(fn12),
  (fn2)-[:USES]->(v1),
  (fn3)-[:CALLS]->(fn10),
  (fn3)-[:CALLS]->(fn11),
  (fn3)-[:CALLS]->(fn13),
  (fn3)-[:USES]->(v1),
  (fn4)-[:CALLS]->(fn10),
  (fn4)-[:CALLS]->(fn11),
  (fn4)-[:CALLS]->(fn14),
  (fn4)-[:USES]->(v1),
  (fn5)-[:CALLS]->(fn10),
  (fn5)-[:CALLS]->(fn11),
  (fn5)-[:CALLS]->(fn14),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn10),
  (fn6)-[:CALLS]->(fn11),
  (fn6)-[:USES]->(v1),
  (fn7)-[:CALLS]->(fn10),
  (fn7)-[:CALLS]->(fn11),
  (fn7)-[:USES]->(v1),
  (fn8)-[:CALLS]->(fn10),
  (fn8)-[:CALLS]->(fn11),
  (fn8)-[:USES]->(v1),
  (fn9)-[:CALLS]->(fn10),
  (fn9)-[:CALLS]->(fn11),
  (fn9)-[:USES]->(v1),
  (fn15)-[:CALLS]->(fn10),
  (fn15)-[:CALLS]->(fn11),
  (fn15)-[:USES]->(v1),
  (fn10)-[:USES]->(v1),
  (fn11)-[:USES]->(v1),
  (fn11)-[:USES]->(v4),
  (fn12)-[:USES]->(v1),
  (fn13)-[:USES]->(v1),
  (fn13)-[:USES]->(v2),
  (fn13)-[:USES]->(v3),
  (fn14)-[:USES]->(v1),
  (fn14)-[:USES]->(v4);
```
*/

import { expect, test, type Page } from '@playwright/test';
import { mockApi } from './fixtures/apiMocks';

test.use({
  viewport: { width: 1440, height: 1000 },
});

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('operation branch: management intelligence to brief creation', async ({ page }) => {
  await gotoApp(page, '/management');
  await expectHeading(page, /Emergent Asset Lake Operating System/);
  await expect(page.getByText('Emergent Operating Layer')).toBeVisible();

  await page.getByRole('link', { name: /New Brief/ }).click();
  await expect(page).toHaveURL(/\/briefs$/);
  await expectHeading(page, 'Brief Editor');
  await fillBriefForm(page);
  await page.getByRole('button', { name: /Create Issue/ }).click();
  await expect(page.getByText(/AL-001 created/)).toBeVisible();
  await page.getByText(/AL-001 created/).click();
  await expect(page).toHaveURL(/\/issues\/issue-a$/);
  await expectHeading(page, /AL-001 Concept Lock/);
});

test('operation branch: kanban drag and issue opening', async ({ page }) => {
  await gotoApp(page, '/board');
  await expectHeading(page, 'Kanban Board');
  await expect(page.getByText('Board Health')).toBeVisible();

  await dragIssueToColumn(page, 'Concept Lock', 'In Progress');
  await page.getByText('Model Pass').first().click();
  await expect(page).toHaveURL(/\/issues\/issue-b$/);
  await expectHeading(page, /AL-002 Model Pass/);
});

test('operation branch: issue lifecycle actions', async ({ page }) => {
  await gotoApp(page, '/issues/issue-a');
  await expectHeading(page, /AL-001 Concept Lock/);

  await page.getByLabel('Title').fill('Concept Lock Trace Update');
  await page.getByLabel('Priority').selectOption('urgent');
  await page.getByLabel('Due Date').fill('2026-06-08');
  await page.getByLabel('Story Points').fill('8');
  await page.getByPlaceholder('asset id').fill('asset-a');
  await page.getByRole('button', { name: /Attach Evidence/ }).click();
  await expect(page.getByText('Evidence linked')).toBeVisible();

  await page.getByPlaceholder('Add comment').fill('Trace comment from operation branch');
  await page.getByRole('button', { name: /Add Comment/ }).click();
  await page.getByLabel('Note').fill('Trace work log');
  await page.getByRole('button', { name: /Log Work/ }).click();
  await page.getByPlaceholder('Review note').fill('Internal trace review note');
  await clickFirstButton(page, /^Internal$/);
  await page.getByPlaceholder('Review note').fill('Client trace review note');
  await clickFirstButton(page, /^Client$/);
  await page.getByPlaceholder('Revision reason').fill('Trace revision request');
  await clickFirstButton(page, /Revision/);
  await clickFirstButton(page, /Save/);
  await clickFirstButton(page, /Approve/);
});

test('operation branch: review and approval decisions', async ({ page }) => {
  await gotoApp(page, '/reviews');
  await expectHeading(page, 'Review Board');
  await expect(page.getByText('Internal Review')).toBeVisible();
  await page.getByRole('main').getByRole('link', { name: /Approvals/ }).click();
  await expect(page).toHaveURL(/\/approvals$/);
  await expectHeading(page, 'Art Director Approval Queue');
  await clickFirstButton(page, /Revision/);
  await clickFirstButton(page, /Approve/);
});

test('operation branch: timeline analytics workflow and governance', async ({ page }) => {
  await gotoApp(page, '/gantt');
  await expectHeading(page, 'Gantt');
  await expect(page.getByText('Schedule Timeline')).toBeVisible();
  await page.getByText('Model Pass').first().click();
  await expectHeading(page, /AL-002 Model Pass/);

  await gotoApp(page, '/calendar');
  await expectHeading(page, 'Calendar');
  await expect(page.getByText('Workload Heatmap')).toBeVisible();

  await gotoApp(page, '/reports');
  await expectHeading(page, 'Reports');
  await expect(page.getByText('Burndown Trend')).toBeVisible();

  await gotoApp(page, '/workflow');
  await expectHeading(page, 'Workflow');
  await expect(page.getByText('Transition Designer')).toBeVisible();

  await gotoApp(page, '/automation');
  await expectHeading(page, 'Automation');
  await expect(page.getByText('Execution Plan')).toBeVisible();

  await gotoApp(page, '/enterprise');
  await expectHeading(page, 'Enterprise');
  await expect(page.getByText('Governance Readiness')).toBeVisible();
});

test('operation branch: delivery package creation and submission', async ({ page }) => {
  await gotoApp(page, '/delivery-packages');
  await expectHeading(page, 'Delivery Package');
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole('button', { name: /Create Package/ }).click();
  await expect(page.getByText('Approved Art Delivery')).toBeVisible();
  await page.getByRole('button', { name: /Submit/ }).click();
  await expect(page.getByText(/Submitted by delivery-manager/)).toBeVisible();
});

test('operation branch: asset library detail and upload', async ({ page }) => {
  await gotoApp(page, '/assets');
  await expectHeading(page, 'Asset Library');
  await page.getByRole('button', { name: 'Code' }).click();
  await expect(page.getByText('build_pipeline.ts')).toBeVisible();
  await page.getByPlaceholder(/Search by name/).fill('Concept');
  await page.getByTitle('Table view').click();
  await expect(page.getByText('concept-board.png')).toBeVisible();

  await gotoApp(page, '/assets/asset-a');
  await expectHeading(page, 'Concept Board');
  await expect(page.getByText('Version Control')).toBeVisible();
  await expect(page.getByText('AI Multimodal Insight')).toBeVisible();
  await expect(page.getByText('character-reference')).toBeVisible();
  await page.getByRole('button', { name: /Re-analyze/ }).click();
  await expect(page.getByText(/AI insight indexed into RAG memory/)).toBeVisible();
  const commitTimeline = page.getByRole('region', { name: 'Commit Timeline' });
  await expect(commitTimeline.getByText('deadbeef0011', { exact: true })).toBeVisible();
  await expect(commitTimeline.getByText('feedbeef0022', { exact: true })).toBeVisible();

  await gotoApp(page, '/data-lake-query');
  await expectHeading(page, 'Data Lake Query');
  await page.getByRole('button', { name: /Run Query/ }).click();
  await expect(page.getByText('Build Pipeline Script').first()).toBeVisible();
  await page.getByRole('button', { name: /^Evidence Graph$/ }).click();
  await page.getByRole('button', { name: /Run Query/ }).click();
  await expect(page.getByText('HAS_EVIDENCE').first()).toBeVisible();
  await page.getByRole('button', { name: /^Insight Graph$/ }).click();
  await page.getByRole('button', { name: /Run Query/ }).click();
  await expect(page.getByText('HAS_INSIGHT').first()).toBeVisible();

  await gotoApp(page, '/upload');
  await expectHeading(page, 'Upload Asset');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'operation-branch.png',
    mimeType: 'image/png',
    buffer: Buffer.from('playwright operation branch png'),
  });
  await expect(page.getByText('operation-branch.png')).toBeVisible();
  await page.getByPlaceholder('e.g. Dragon Character Rig').fill('Operation Branch Asset');
  await page.getByPlaceholder('e.g. john.doe').fill('playwright');
  await page.getByPlaceholder(/Add tag and press Enter/).fill('branch');
  await page.getByPlaceholder(/Add tag and press Enter/).press('Enter');
  await page.getByRole('button', { name: /^Upload Asset$/ }).click();
  await expectHeading(page, 'Upload Complete');
  await page.getByRole('button', { name: /View Asset/ }).click();
  await expect(page).toHaveURL(/\/assets\/asset-e2e-upload$/);
  await expectHeading(page, 'Playwright Trace Asset');
});

test('operation branch: AI settings save and test', async ({ page }) => {
  await gotoApp(page, '/settings');
  await expectHeading(page, 'AI API');

  const aiSwitch = page.getByRole('switch');
  if ((await aiSwitch.getAttribute('aria-checked')) !== 'true') {
    await aiSwitch.click();
  }

  await page.getByLabel('Provider').fill('Playwright AI');
  await page.getByLabel('Model', { exact: true }).fill('trace-model');
  await page.getByLabel('Embedding Model').fill('trace-embedding-model');
  await page.getByLabel('Base URL').fill('https://playwright.local/v1');
  await page.getByLabel('API Key').fill('nvapi-playwright-trace-key');
  await page.getByRole('button', { name: /^Save$/ }).click();
  await page.getByRole('button', { name: /^Test$/ }).click();
  await expect(page.getByText(/responded with/)).toBeVisible();
});

test('operation branch: AI control cross-app execution', async ({ page }) => {
  await gotoApp(page, '/ai-control');
  await expectHeading(page, 'AI Control');
  await expect(page.getByText('API Connection')).toBeVisible();
  await expect(page.getByText('Chat', { exact: true })).toBeVisible();
  await expect(page.getByText('AI Autopilot')).toBeVisible();
  await expect(page.getByText('Emergent Control Matrix')).toBeVisible();
  await expect(page.getByText('Common Control Buttons')).toBeVisible();
  await expect(page.getByRole('button', { name: /Execute Version Gate/ })).toBeVisible();

  await page.getByLabel('API Key').fill('nvapi-playwright-trace-key');
  await page.getByRole('button', { name: /Save API/ }).click();
  await page.getByLabel('Goal').fill('Drive release readiness across lake, version graph, and Jira flow.');
  await page.getByRole('button', { name: /Generate Plan/ }).click();
  await expect(page.getByText('Impact Preview').first()).toBeVisible();
  await page.getByRole('button', { name: /Run Approved/ }).click();
  await expect(page.getByText(/Autopilot recorded Lake Index/)).toBeVisible();
  await expect(page.getByText(/RAG Memory/)).toBeVisible();
  await page.getByLabel('Message').fill('Summarize product risk and recommend a guarded control.');
  await page.getByRole('button', { name: /^Send$/ }).click();
  await expect(page.getByText(/AI Control ready/)).toBeVisible();
  await page.getByRole('button', { name: /Execute Risk Comment/ }).click();
  await expect(page.getByText(/Recorded Risk Comment/)).toBeVisible();
  await page.getByRole('button', { name: /Execute Asset Evidence Update/ }).click();
  await expect(page.getByText(/Recorded Asset Evidence Update/)).toBeVisible();
  await page.getByRole('button', { name: /Execute Attach Evidence/ }).click();
  await expect(page.getByText(/Recorded Attach Evidence/)).toBeVisible();
});

async function gotoApp(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
}

async function expectHeading(page: Page, name: string | RegExp): Promise<void> {
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

async function fillBriefForm(page: Page): Promise<void> {
  await page.getByLabel('Title').fill('Trace Branch Concept Brief');
  await page.getByRole('combobox', { name: 'Type' }).selectOption('concept_art');
  await page.getByRole('combobox', { name: 'Priority' }).selectOption('urgent');
  await page.getByLabel('Due Date').fill('2026-06-08');
  await page.getByLabel('Story Points').fill('5');
  await page.getByLabel('Brief').fill('Trace branch brief for data lake, project, and AI validation.');
  await page.getByLabel('Acceptance Criteria').fill('trace recorded\nassets linked\nAI decision visible');
}

async function dragIssueToColumn(page: Page, issueTitle: string, columnTitle: string): Promise<void> {
  const issueCard = page.getByRole('link', { name: new RegExp(issueTitle) }).first();
  const targetColumn = page.getByRole('region', { name: `${columnTitle} column` });

  await issueCard.dragTo(targetColumn);
  await page.waitForTimeout(500);
}

async function clickFirstButton(page: Page, name: RegExp): Promise<void> {
  await page.getByRole('button', { name }).first().click();
}
