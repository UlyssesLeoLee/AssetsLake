/*
```cypher
CREATE
  (f:File {name: "three-user-exclusive-lock.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.three_user_exclusive_lock", type: "module"}),
  (fn1:Function {name: "jsonRequest", type: "function", language: "javascript", signature: "async function jsonRequest(path, options = {})"}),
  (fn2:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(result, status, label)"}),
  (fn3:Function {name: "timed", type: "function", language: "javascript", signature: "async function timed(label, fn)"}),
  (fn4:Function {name: "healthCheck", type: "function", language: "javascript", signature: "async function healthCheck()"}),
  (fn5:Function {name: "login", type: "function", language: "javascript", signature: "async function login(username)"}),
  (fn6:Function {name: "authHeaders", type: "function", language: "javascript", signature: "function authHeaders(session, lockToken)"}),
  (fn7:Function {name: "createIssue", type: "function", language: "javascript", signature: "async function createIssue(session)"}),
  (fn8:Function {name: "acquireLock", type: "function", language: "javascript", signature: "async function acquireLock(session, issueId)"}),
  (fn9:Function {name: "patchIssue", type: "function", language: "javascript", signature: "async function patchIssue(session, issue, lockToken)"}),
  (fn10:Function {name: "releaseLock", type: "function", language: "javascript", signature: "async function releaseLock(session, lockToken)"}),
  (fn11:Function {name: "logout", type: "function", language: "javascript", signature: "async function logout(session)"}),
  (fn12:Function {name: "three users keep one exclusive writer under concurrent lock race", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "API_BASE", type: "variable"}),
  (v2:Variable {name: "TEST_PASSWORD", type: "variable"}),
  (v3:Variable {name: "API_LATENCY_SLO_MS", type: "variable"}),
  (v4:Variable {name: "ACCOUNTS", type: "variable"}),
  (v5:Variable {name: "observations", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn1),
  (fn5)-[:USES]->(v3),
  (fn5)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn2),
  (fn7)-[:CALLS]->(fn1),
  (fn7)-[:CALLS]->(fn2),
  (fn7)-[:CALLS]->(fn6),
  (fn7)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn6),
  (fn9)-[:CALLS]->(fn1),
  (fn9)-[:CALLS]->(fn6),
  (fn10)-[:CALLS]->(fn1),
  (fn10)-[:CALLS]->(fn2),
  (fn10)-[:CALLS]->(fn6),
  (fn11)-[:CALLS]->(fn3),
  (fn11)-[:CALLS]->(fn1),
  (fn11)-[:CALLS]->(fn6),
  (fn12)-[:CALLS]->(fn3),
  (fn12)-[:CALLS]->(fn4),
  (fn12)-[:CALLS]->(fn5),
  (fn12)-[:CALLS]->(fn7),
  (fn12)-[:CALLS]->(fn8),
  (fn12)-[:CALLS]->(fn9),
  (fn12)-[:CALLS]->(fn10),
  (fn12)-[:CALLS]->(fn11);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';
import { performance } from 'node:perf_hooks';

const API_BASE =
  process.env.ASSETSLAKE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:18080';
const TEST_PASSWORD = process.env.ASSETSLAKE_TEST_PASSWORD || 'test';
const ADMIN_PASSWORD = process.env.ASSETSLAKE_ADMIN_PASSWORD || TEST_PASSWORD;
const API_LATENCY_SLO_MS = Number.parseInt(process.env.API_LATENCY_SLO_MS || '3000', 10);
const ACCOUNTS = ['alice.producer', 'bob.artist', 'dana.manager'];
const observations = [];

async function jsonRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(API_LATENCY_SLO_MS),
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
    `${label} expected HTTP ${status}, got HTTP ${result.response.status}: ${JSON.stringify(result.body)}`,
  );
}

async function timed(label, fn) {
  const startedAt = performance.now();
  const result = await fn();
  const elapsedMs = performance.now() - startedAt;
  observations.push({ label, elapsedMs: Math.round(elapsedMs) });
  assert.ok(elapsedMs <= API_LATENCY_SLO_MS, `${label} exceeded ${API_LATENCY_SLO_MS}ms`);
  return result;
}

async function healthCheck() {
  try {
    const result = await jsonRequest('/api/health');
    expectStatus(result, 200, `backend health at ${API_BASE}`);
  } catch (error) {
    throw new Error(
      `Backend API is not reachable at ${API_BASE} within ${API_LATENCY_SLO_MS}ms: ${error.message}`,
    );
  }
}

async function login(username) {
  const result = await jsonRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password: username === 'dana.manager' ? ADMIN_PASSWORD : TEST_PASSWORD,
      device_label: `three-user-lock-${username}-${Date.now()}`,
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
      title: `Three user exclusive lock ${Date.now()}`,
      description: 'Created by three-user exclusive lock test',
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
      purpose: `three-user lock race by ${session.user.username}`,
    }),
  });
}

async function patchIssue(session, issue, lockToken) {
  return jsonRequest(`/api/issues/${issue.id}`, {
    method: 'PATCH',
    headers: authHeaders(session, lockToken),
    body: JSON.stringify({
      description: `Edited by ${session.user.username} at ${Date.now()}`,
      expected_version: issue.version,
      actor: session.user.username,
    }),
  });
}

async function releaseLock(session, lockToken) {
  const result = await jsonRequest('/api/locks/release', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({ lock_token: lockToken }),
  });
  expectStatus(result, 200, 'winner releases lock');
}

async function logout(session) {
  await jsonRequest('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(session),
  });
}

test('three users keep one exclusive writer under concurrent lock race', async (t) => {
  await timed('backend health', healthCheck);
  const sessions = await timed('login three users', () => Promise.all(ACCOUNTS.map(login)));
  t.after(async () => {
    await Promise.allSettled(sessions.map(logout));
    console.log(`observations=${JSON.stringify(observations)}`);
  });

  const issue = await timed('create issue', () => createIssue(sessions[0]));
  const attempts = await timed('three-way lock race', () =>
    Promise.all(sessions.map((session) => acquireLock(session, issue.id))),
  );
  const winners = attempts.filter((result) => result.response.status === 201);
  const conflicts = attempts.filter((result) => result.response.status === 409);
  assert.equal(winners.length, 1, 'exactly one session wins the exclusive lock');
  assert.equal(conflicts.length, 2, 'the other two sessions receive conflicts');

  const winningLock = winners[0].body.data;
  const winner = sessions.find((session) => session.session_id === winningLock.session_id);
  const loser = sessions.find((session) => session.session_id !== winningLock.session_id);
  assert.ok(winner, 'winner session is resolved');
  assert.ok(loser, 'loser session is resolved');

  const loserWrite = await timed('loser write rejected', () => patchIssue(loser, issue));
  expectStatus(loserWrite, 409, 'loser write without lock');

  const winnerWrite = await timed('winner write accepted', () =>
    patchIssue(winner, issue, winningLock.lock_token),
  );
  expectStatus(winnerWrite, 200, 'winner write with lock');
  await timed('release lock', () => releaseLock(winner, winningLock.lock_token));
});
