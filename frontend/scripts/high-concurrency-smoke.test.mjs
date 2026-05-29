/*
```cypher
CREATE
  (f:File {name: "high-concurrency-smoke.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.high_concurrency_smoke", type: "module"}),
  (fn1:Function {name: "jsonRequest", type: "function", language: "javascript", signature: "async function jsonRequest(path, options = {})"}),
  (fn2:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(result, status, label)"}),
  (fn3:Function {name: "login", type: "function", language: "javascript", signature: "async function login(username)"}),
  (fn4:Function {name: "authHeaders", type: "function", language: "javascript", signature: "function authHeaders(session, lockToken)"}),
  (fn5:Function {name: "createIssue", type: "function", language: "javascript", signature: "async function createIssue(session)"}),
  (fn6:Function {name: "acquireLock", type: "function", language: "javascript", signature: "async function acquireLock(session, issueId)"}),
  (fn7:Function {name: "logout", type: "function", language: "javascript", signature: "async function logout(session)"}),
  (fn8:Function {name: "test_concurrent_health_and_auth", type: "function", language: "javascript", signature: "test('concurrent health and auth requests stay responsive', async () => void)"}),
  (fn9:Function {name: "test_lock_race", type: "function", language: "javascript", signature: "test('concurrent lock race grants one owner', async () => void)"}),
  (v1:Variable {name: "API_BASE", type: "variable"}),
  (v2:Variable {name: "TEST_PASSWORD", type: "variable"}),
  (v3:Variable {name: "ACCOUNTS", type: "variable"}),
  (v4:Variable {name: "HEALTH_CONCURRENCY", type: "variable"}),
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
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn1),
  (fn7)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn2),
  (fn8)-[:CALLS]->(fn3),
  (fn8)-[:CALLS]->(fn4),
  (fn8)-[:CALLS]->(fn7),
  (fn9)-[:CALLS]->(fn2),
  (fn9)-[:CALLS]->(fn3),
  (fn9)-[:CALLS]->(fn5),
  (fn9)-[:CALLS]->(fn6),
  (fn9)-[:CALLS]->(fn7);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';

const API_BASE =
  process.env.ASSETSLAKE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:18080';
const TEST_PASSWORD = process.env.ASSETSLAKE_TEST_PASSWORD || 'AssetsLake#2026';
const HEALTH_CONCURRENCY = Number.parseInt(process.env.HIGH_CONCURRENCY_HEALTH || '200', 10);
const ACCOUNTS = ['alice.producer', 'bob.artist', 'chen.reviewer', 'dana.manager'];

async function jsonRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

function expectStatus(result, status, label) {
  assert.equal(
    result.response.status,
    status,
    `${label} expected HTTP ${status}, got HTTP ${result.response.status}: ${JSON.stringify(result.body)}`
  );
}

async function login(username) {
  const result = await jsonRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password: TEST_PASSWORD,
      device_label: `concurrency-${username}-${Date.now()}`,
    }),
  });
  expectStatus(result, 200, `${username} login`);
  return result.body.data;
}

function authHeaders(session, lockToken) {
  return {
    authorization: `Bearer ${session.token}`,
    ...(lockToken ? { 'x-assetslake-lock-token': lockToken } : {}),
  };
}

async function createIssue(session) {
  const result = await jsonRequest('/api/issues', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      title: `High concurrency smoke ${Date.now()}`,
      description: 'Created by high-concurrency smoke test',
      issue_type: 'technical_art',
      priority: 'medium',
      story_points: 1,
    }),
  });
  expectStatus(result, 201, 'issue create');
  return result.body.data;
}

async function acquireLock(session, issueId) {
  return jsonRequest('/api/locks/acquire', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      resource_type: 'issue',
      resource_id: issueId,
      ttl_seconds: 120,
      purpose: `concurrency smoke by ${session.user.username}`,
    }),
  });
}

async function logout(session) {
  await jsonRequest('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(session),
  });
}

test('concurrent health and auth requests stay responsive', async () => {
  const healthResponses = await Promise.all(
    Array.from({ length: HEALTH_CONCURRENCY }, () => jsonRequest('/api/health'))
  );
  for (const [index, response] of healthResponses.entries()) {
    expectStatus(response, 200, `health ${index}`);
  }

  const sessions = await Promise.all(ACCOUNTS.map((account) => login(account)));
  const meResponses = await Promise.all(
    sessions.flatMap((session) =>
      Array.from({ length: 5 }, () =>
        jsonRequest('/api/auth/me', { headers: authHeaders(session) })
      )
    )
  );
  for (const [index, response] of meResponses.entries()) {
    expectStatus(response, 200, `me ${index}`);
  }

  await Promise.all(sessions.map((session) => logout(session)));
});

test('concurrent lock race grants one owner', async () => {
  const sessions = await Promise.all(ACCOUNTS.map((account) => login(account)));
  const issue = await createIssue(sessions[0]);
  const attempts = await Promise.all(sessions.map((session) => acquireLock(session, issue.id)));
  const winners = attempts.filter((result) => result.response.status === 201);
  const conflicts = attempts.filter((result) => result.response.status === 409);

  assert.equal(winners.length, 1, 'exactly one lock winner is granted');
  assert.equal(conflicts.length, sessions.length - 1, 'all other sessions receive conflicts');

  const winner = sessions.find((session) => session.session_id === winners[0].body.data.session_id);
  assert.ok(winner, 'winning session can be resolved');
  await jsonRequest('/api/locks/release', {
    method: 'POST',
    headers: authHeaders(winner),
    body: JSON.stringify({ lock_token: winners[0].body.data.lock_token }),
  });
  await Promise.all(sessions.map((session) => logout(session)));
});
