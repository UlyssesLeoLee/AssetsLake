/*
```cypher
CREATE
  (f:File {name: "authSession.ts", type: "file", language: "typescript"}),
  (m:Module {name: "frontend/e2e/fixtures/authSession", type: "module"}),
  (c1:Class {name: "E2EAuthSession", type: "class", language: "typescript", signature: "type E2EAuthSession"}),
  (fn1:Function {name: "buildAuthSession", type: "function", language: "typescript", signature: "function buildAuthSession(role: string): E2EAuthSession"}),
  (fn2:Function {name: "installAuthenticatedSession", type: "function", language: "typescript", signature: "async function installAuthenticatedSession(page: Page, role?: string): Promise<void>"}),
  (v1:Variable {name: "AUTH_SESSION_STORAGE_KEY", type: "variable"}),
  (v2:Variable {name: "page", type: "variable"}),
  (v3:Variable {name: "role", type: "variable"}),
  (v4:Variable {name: "session", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:USES]->(v1),
  (fn1)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4);
```
*/

import type { Page } from '@playwright/test';

const AUTH_SESSION_STORAGE_KEY = 'assetslake.auth.session';

type E2EAuthSession = {
  user: {
    id: string;
    username: string;
    display_name: string;
    email: string;
    role: string;
    avatar_url: null;
  };
  token: string;
  session_id: string;
  expires_at: string;
};

function buildAuthSession(role: string): E2EAuthSession {
  return {
    user: {
      id: 'user-e2e-admin',
      username: 'playwright.admin',
      display_name: 'Playwright Admin',
      email: 'playwright@example.test',
      role,
      avatar_url: null,
    },
    token: 'playwright-e2e-token',
    session_id: 'session-playwright-e2e',
    expires_at: '2099-01-01T00:00:00.000Z',
  };
}

export async function installAuthenticatedSession(page: Page, role = 'admin'): Promise<void> {
  const session = buildAuthSession(role);
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: AUTH_SESSION_STORAGE_KEY, value: session },
  );
}
