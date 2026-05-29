/*
```cypher
CREATE
  (f:File {name: "interface-gallery.spec.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/interface-gallery.spec", type: "module"}),
  (c1:Class {name: "InterfaceRoute", type: "class", language: "typescript", signature: "type InterfaceRoute"}),
  (fn1:Function {name: "beforeEach mock API setup", type: "function", language: "typescript", signature: "test.beforeEach callback"}),
  (fn2:Function {name: "captures every interface as screenshots with trace", type: "function", language: "typescript", signature: "test callback"}),
  (fn3:Function {name: "prepareGalleryDirectory", type: "function", language: "typescript", signature: "function prepareGalleryDirectory(): void"}),
  (fn4:Function {name: "captureInterface", type: "function", language: "typescript", signature: "async function captureInterface(page: Page, route: InterfaceRoute, index: number, testInfo: TestInfo): Promise<string>"}),
  (fn5:Function {name: "settlePage", type: "function", language: "typescript", signature: "async function settlePage(page: Page): Promise<void>"}),
  (fn6:Function {name: "galleryFileName", type: "function", language: "typescript", signature: "function galleryFileName(route: InterfaceRoute, index: number): string"}),
  (fn7:Function {name: "padIndex", type: "function", language: "typescript", signature: "function padIndex(index: number): string"}),
  (v1:Variable {name: "GALLERY_ROOT", type: "variable"}),
  (v2:Variable {name: "INTERFACE_ROUTES", type: "variable"}),
  (v3:Variable {name: "page", type: "variable"}),
  (v4:Variable {name: "route", type: "variable"}),
  (v5:Variable {name: "testInfo", type: "variable"}),
  (v6:Variable {name: "screenshots", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (fn1)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn3),
  (fn2)-[:CALLS]->(fn4),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v5),
  (fn2)-[:USES]->(v6),
  (fn3)-[:USES]->(v1),
  (fn4)-[:CALLS]->(fn5),
  (fn4)-[:CALLS]->(fn6),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v3),
  (fn4)-[:USES]->(v4),
  (fn4)-[:USES]->(v5),
  (fn5)-[:USES]->(v3),
  (fn6)-[:CALLS]->(fn7),
  (fn6)-[:USES]->(v4);
```
*/

import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { mockApi } from './fixtures/apiMocks';

type InterfaceRoute = {
  id: string;
  label: string;
  path: string;
};

const GALLERY_ROOT = join(process.cwd(), 'test-results', 'interface-gallery', 'screenshots');

const INTERFACE_ROUTES: InterfaceRoute[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'ai-control', label: 'AI Control', path: '/ai-control' },
  { id: 'management', label: 'Management', path: '/management' },
  { id: 'planning', label: 'Planning', path: '/planning' },
  { id: 'briefs', label: 'Briefs', path: '/briefs' },
  { id: 'board', label: 'Board', path: '/board' },
  { id: 'issue-detail', label: 'Issue Detail', path: '/issues/issue-a' },
  { id: 'reviews', label: 'Reviews', path: '/reviews' },
  { id: 'approvals', label: 'Approvals', path: '/approvals' },
  { id: 'vendors', label: 'Vendors', path: '/vendors' },
  { id: 'gantt', label: 'Gantt', path: '/gantt' },
  { id: 'calendar', label: 'Calendar', path: '/calendar' },
  { id: 'milestones', label: 'Milestones', path: '/milestones' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'workflow', label: 'Workflow', path: '/workflow' },
  { id: 'automation', label: 'Automation', path: '/automation' },
  { id: 'delivery-packages', label: 'Delivery Packages', path: '/delivery-packages' },
  { id: 'enterprise', label: 'Enterprise', path: '/enterprise' },
  { id: 'assets', label: 'Asset Library', path: '/assets' },
  { id: 'asset-detail', label: 'Asset Detail', path: '/assets/asset-a' },
  { id: 'data-lake-query', label: 'Data Lake Query', path: '/data-lake-query' },
  { id: 'upload', label: 'Upload', path: '/upload' },
  { id: 'verification', label: 'Verification', path: '/verification' },
  { id: 'observability', label: 'Observability', path: '/observability' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

test.use({
  viewport: { width: 1440, height: 1000 },
});

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('captures every interface as screenshots with trace', async ({ page }, testInfo) => {
  prepareGalleryDirectory();

  const screenshots: string[] = [];
  for (let index = 0; index < INTERFACE_ROUTES.length; index += 1) {
    const route = INTERFACE_ROUTES[index];
    screenshots.push(await captureInterface(page, route, index, testInfo));
  }

  expect(screenshots).toHaveLength(INTERFACE_ROUTES.length);
  for (const screenshotPath of screenshots) {
    expect(existsSync(screenshotPath)).toBe(true);
  }
});

function prepareGalleryDirectory(): void {
  rmSync(GALLERY_ROOT, { recursive: true, force: true });
  mkdirSync(GALLERY_ROOT, { recursive: true });
}

async function captureInterface(page: Page, route: InterfaceRoute, index: number, testInfo: TestInfo): Promise<string> {
  const fileName = galleryFileName(route, index);
  const screenshotPath = join(GALLERY_ROOT, fileName);

  await page.goto(route.path, { waitUntil: 'domcontentloaded' });
  await settlePage(page);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
  await testInfo.attach(`${padIndex(index + 1)}-${route.id}`, {
    path: screenshotPath,
    contentType: 'image/png',
  });

  return screenshotPath;
}

async function settlePage(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
  await page.locator('body').waitFor({ state: 'visible' });
  await page.waitForTimeout(600);
}

function galleryFileName(route: InterfaceRoute, index: number): string {
  return `${padIndex(index + 1)}-${route.id}.png`;
}

function padIndex(index: number): string {
  return String(index).padStart(2, '0');
}
