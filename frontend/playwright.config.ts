/*
```cypher
CREATE
  (f:File {name: "playwright.config.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/playwright.config", type: "module"}),
  (v1:Variable {name: "PORT", type: "variable"}),
  (v2:Variable {name: "BASE_URL", type: "variable"}),
  (v3:Variable {name: "config", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3);
```
*/

import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results/playwright',
  timeout: 120_000,
  expect: {
    timeout: 30_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    trace: {
      mode: 'on',
      screenshots: true,
      snapshots: true,
      sources: true,
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `pnpm exec next dev --hostname 127.0.0.1 --port ${PORT}`,
    url: `${BASE_URL}/wiki`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
