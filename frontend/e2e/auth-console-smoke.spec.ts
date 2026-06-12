/*
```cypher
CREATE
  (f:File {name: "auth-console-smoke.spec.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/auth-console-smoke", type: "module"}),
  (fn1:Function {name: "signInWithSeedAccount", type: "function", language: "typescript", signature: "async function signInWithSeedAccount(page: Page, username: string)"}),
  (fn2:Function {name: "auth gated console lists ten accounts and keeps a browser session", type: "function", language: "typescript", signature: "test(...)"}),
  (fn3:Function {name: "admin app is visible only to admin sessions", type: "function", language: "typescript", signature: "test(...)"}),
  (v1:Variable {name: "TEST_PASSWORD", type: "variable"}),
  (v2:Variable {name: "EXPECTED_ACCOUNTS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1);
```
*/

import { expect, test, type Page } from '@playwright/test';

const TEST_PASSWORD = process.env.ASSETSLAKE_TEST_PASSWORD ?? 'test';
const ADMIN_PASSWORD = process.env.ASSETSLAKE_ADMIN_PASSWORD ?? TEST_PASSWORD;

const EXPECTED_ACCOUNTS = [
  'alice.producer',
  'bob.artist',
  'chen.reviewer',
  'dana.manager',
  'eve.producer',
  'felix.artist',
  'grace.reviewer',
  'hao.manager',
  'iris.artist',
  'jo.viewer',
];

async function signInWithSeedAccount(page: Page, username: string) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in to AssetsLake' })).toBeVisible();

  const accountSelect = page.getByLabel('Account');
  await expect(accountSelect).toBeVisible();
  await expect(accountSelect.locator('option')).toHaveCount(EXPECTED_ACCOUNTS.length);

  const optionValues = await accountSelect
    .locator('option')
    .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value).sort());
  expect(optionValues).toEqual([...EXPECTED_ACCOUNTS].sort());

  await accountSelect.selectOption(username);
  await page
    .getByLabel('Password')
    .fill(username === 'dana.manager' ? ADMIN_PASSWORD : TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
}

test('auth gated console lists ten accounts and keeps a browser session', async ({ page }) => {
  await signInWithSeedAccount(page, 'alice.producer');

  await page.reload();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to AssetsLake' })).toBeVisible();
});

test('admin app is visible only to admin sessions', async ({ page }) => {
  await signInWithSeedAccount(page, 'alice.producer');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Admin' })).toHaveCount(0);

  await page.goto('/admin-control');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin Control' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to AssetsLake' })).toBeVisible();
  await signInWithSeedAccount(page, 'dana.manager');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Admin' })).toBeVisible();

  await page.goto('/admin-control');
  await expect(page.getByRole('heading', { name: 'Admin Control' })).toBeVisible();
  await expect(page.getByText('Session Policy', { exact: true })).toBeVisible();
});
