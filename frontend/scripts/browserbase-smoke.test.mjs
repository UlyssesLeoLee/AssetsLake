/*
```cypher
CREATE
  (f:File {name: "browserbase-smoke.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/browserbase-smoke.test", type: "module", language: "javascript"}),
  (fn1:Function {name: "requireEnvironment", type: "function", language: "javascript", signature: "requireEnvironment(name)"}),
  (fn2:Function {name: "createSession", type: "function", language: "javascript", signature: "createSession(apiKey)"}),
  (fn3:Function {name: "releaseSession", type: "function", language: "javascript", signature: "releaseSession(apiKey, sessionId)"}),
  (fn4:Function {name: "browserbase smoke test callback", type: "function", language: "javascript", signature: "async test callback"}),
  (ext1:Function {name: "fetch", type: "function"}),
  (ext2:Function {name: "JSON.stringify", type: "function"}),
  (ext3:Function {name: "response.json", type: "function"}),
  (ext4:Function {name: "chromium.connectOverCDP", type: "function"}),
  (ext5:Function {name: "page.goto", type: "function"}),
  (ext6:Function {name: "page.title", type: "function"}),
  (ext7:Function {name: "page.getByText", type: "function"}),
  (ext8:Function {name: "locator.first", type: "function"}),
  (ext9:Function {name: "locator.waitFor", type: "function"}),
  (ext10:Function {name: "browser.close", type: "function"}),
  (ext11:Function {name: "assert.ok", type: "function"}),
  (ext12:Function {name: "test", type: "function"}),
  (ext13:Function {name: "console.log", type: "function"}),
  (ext14:Function {name: "String.trim", type: "function"}),
  (ext15:Function {name: "browser.contexts", type: "function"}),
  (ext16:Function {name: "context.pages", type: "function"}),
  (ext17:Function {name: "response.ok", type: "function"}),
  (ext18:Function {name: "response.status", type: "function"}),
  (v1:Variable {name: "API_URL", type: "variable"}),
  (v2:Variable {name: "apiKey", type: "variable"}),
  (v3:Variable {name: "targetUrl", type: "variable"}),
  (v4:Variable {name: "expectedText", type: "variable"}),
  (v5:Variable {name: "session", type: "variable"}),
  (v6:Variable {name: "browser", type: "variable"}),
  (v7:Variable {name: "value", type: "variable"}),
  (v8:Variable {name: "response", type: "variable"}),
  (v9:Variable {name: "body", type: "variable"}),
  (v10:Variable {name: "sessionId", type: "variable"}),
  (v11:Variable {name: "context", type: "variable"}),
  (v12:Variable {name: "page", type: "variable"}),
  (v13:Variable {name: "name", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CALLS]->(ext12),
  (fn1)-[:CALLS]->(ext14),
  (fn2)-[:CALLS]->(ext1),
  (fn2)-[:CALLS]->(ext2),
  (fn2)-[:CALLS]->(ext3),
  (fn2)-[:CALLS]->(ext11),
  (fn3)-[:CALLS]->(ext1),
  (fn3)-[:CALLS]->(ext2),
  (fn3)-[:CALLS]->(ext11),
  (fn4)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn3),
  (fn4)-[:CALLS]->(ext4),
  (fn4)-[:CALLS]->(ext5),
  (fn4)-[:CALLS]->(ext6),
  (fn4)-[:CALLS]->(ext7),
  (fn4)-[:CALLS]->(ext8),
  (fn4)-[:CALLS]->(ext9),
  (fn4)-[:CALLS]->(ext10),
  (fn4)-[:CALLS]->(ext11),
  (fn4)-[:CALLS]->(ext13),
  (fn4)-[:CALLS]->(ext14),
  (fn4)-[:CALLS]->(ext15),
  (fn4)-[:CALLS]->(ext16),
  (fn4)-[:CALLS]->(ext17),
  (fn4)-[:CALLS]->(ext18),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v13),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v8),
  (fn2)-[:USES]->(v9),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v8),
  (fn3)-[:USES]->(v10),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn4)-[:USES]->(v4),
  (fn4)-[:USES]->(v5),
  (fn4)-[:USES]->(v6),
  (fn4)-[:USES]->(v8),
  (fn4)-[:USES]->(v11),
  (fn4)-[:USES]->(v12);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from '@playwright/test';

const API_URL = 'https://api.browserbase.com/v1/sessions';

function requireEnvironment(name) {
  const value = process.env[name]?.trim();
  assert.ok(value, `${name} must be set`);
  return value;
}

async function createSession(apiKey) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BB-API-Key': apiKey,
    },
    body: JSON.stringify({
      timeout: 300,
      browserSettings: {
        viewport: { width: 1440, height: 900 },
      },
      userMetadata: {
        suite: 'assetslake-browserbase-smoke',
      },
    }),
  });
  const body = await response.json();
  assert.ok(response.ok, `Browserbase session creation failed (${response.status})`);
  assert.ok(body.id && body.connectUrl, 'Browserbase session response is incomplete');
  return body;
}

async function releaseSession(apiKey, sessionId) {
  const response = await fetch(`${API_URL}/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BB-API-Key': apiKey,
    },
    body: JSON.stringify({ status: 'REQUEST_RELEASE' }),
  });
  assert.ok(response.ok, `Browserbase session release failed (${response.status})`);
}

test('Browserbase cloud browser loads the configured test target', async () => {
  const apiKey = requireEnvironment('BROWSERBASE_API_KEY');
  const targetUrl = requireEnvironment('BROWSERBASE_TEST_URL');
  const expectedText = process.env.BROWSERBASE_EXPECTED_TEXT?.trim();
  let session;
  let browser;

  try {
    session = await createSession(apiKey);
    browser = await chromium.connectOverCDP(session.connectUrl);
    const context = browser.contexts()[0];
    const page = context.pages()[0];

    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    assert.ok(response?.ok(), `Target returned HTTP ${response?.status() ?? 'unknown'}`);
    assert.ok((await page.title()).trim(), 'Target page has an empty title');

    if (expectedText) {
      await page.getByText(expectedText, { exact: false }).first().waitFor({ state: 'visible' });
    }

    console.log(`Browserbase session: https://browserbase.com/sessions/${session.id}`);
  } finally {
    try {
      if (browser) {
        await browser.close();
      }
    } finally {
      if (session?.id) {
        await releaseSession(apiKey, session.id);
      }
    }
  }
});
