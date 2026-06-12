/*
```cypher
CREATE
  (f:File {name: "auth-locks-integration.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/auth-locks-integration.test", type: "module"}),
  (fn1:Function {name: "jsonRequest", type: "function", language: "javascript", signature: "async function jsonRequest(path, options = {})"}),
  (fn2:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(response, status, label)"}),
  (fn3:Function {name: "login", type: "function", language: "javascript", signature: "async function login(username)"}),
  (fn4:Function {name: "authHeaders", type: "function", language: "javascript", signature: "function authHeaders(session, lockToken)"}),
  (fn5:Function {name: "createIssue", type: "function", language: "javascript", signature: "async function createIssue(session)"}),
  (fn6:Function {name: "acquireLock", type: "function", language: "javascript", signature: "async function acquireLock(session, issueId)"}),
  (fn7:Function {name: "patchIssue", type: "function", language: "javascript", signature: "async function patchIssue(session, issueId, lockToken)"}),
  (fn8:Function {name: "releaseLock", type: "function", language: "javascript", signature: "async function releaseLock(session, lockToken)"}),
  (fn9:Function {name: "logout", type: "function", language: "javascript", signature: "async function logout(session)"}),
  (fn10:Function {name: "multi account session tokens enforce exclusive issue locks", type: "function", language: "javascript", signature: "test callback"}),
  (fn11:Function {name: "parallel lock acquisition grants one winner", type: "function", language: "javascript", signature: "test callback"}),
  (fn12:Function {name: "write routes require auth and RBAC", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "API_BASE", type: "variable"}),
  (v2:Variable {name: "TEST_PASSWORD", type: "variable"}),
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
  (fn3)-[:CALLS]->(fn1),
  (fn5)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn1),
  (fn7)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn1),
  (fn9)-[:CALLS]->(fn1),
  (fn10)-[:CALLS]->(fn2),
  (fn10)-[:CALLS]->(fn3),
  (fn10)-[:CALLS]->(fn5),
  (fn10)-[:CALLS]->(fn6),
  (fn10)-[:CALLS]->(fn7),
  (fn10)-[:CALLS]->(fn8),
  (fn10)-[:CALLS]->(fn9),
  (fn11)-[:CALLS]->(fn2),
  (fn11)-[:CALLS]->(fn3),
  (fn11)-[:CALLS]->(fn5),
  (fn11)-[:CALLS]->(fn6),
  (fn11)-[:CALLS]->(fn8),
  (fn11)-[:CALLS]->(fn9),
  (fn12)-[:CALLS]->(fn1),
  (fn12)-[:CALLS]->(fn2),
  (fn12)-[:CALLS]->(fn3),
  (fn12)-[:CALLS]->(fn4),
  (fn12)-[:CALLS]->(fn9);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';

const API_BASE =
  process.env.ASSETSLAKE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:18080';
const TEST_PASSWORD = process.env.ASSETSLAKE_TEST_PASSWORD || 'test';
const ADMIN_PASSWORD = process.env.ASSETSLAKE_ADMIN_PASSWORD || TEST_PASSWORD;

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
    `${label} expected HTTP ${status}, got HTTP ${result.response.status}: ${JSON.stringify(result.body)}`,
  );
}

async function login(username) {
  const result = await jsonRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password: username === 'dana.manager' ? ADMIN_PASSWORD : TEST_PASSWORD,
      device_label: `integration-${username}`,
    }),
  });
  expectStatus(result, 200, `${username} login`);
  assert.ok(result.body.data.token, `${username} receives a session token`);
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
      title: `Exclusive lock integration ${Date.now()}`,
      description: 'Created by auth-lock integration test',
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
      purpose: `integration lock by ${session.user.username}`,
    }),
  });
}

async function patchIssue(session, issueId, lockToken) {
  return jsonRequest(`/api/issues/${issueId}`, {
    method: 'PATCH',
    headers: authHeaders(session, lockToken),
    body: JSON.stringify({
      description: `Edited by ${session.user.username} at ${Date.now()}`,
      actor: session.user.username,
    }),
  });
}

async function releaseLock(session, lockToken) {
  return jsonRequest('/api/locks/release', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({ lock_token: lockToken }),
  });
}

async function logout(session) {
  await jsonRequest('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(session),
  });
}

test('write routes require auth and RBAC', async () => {
  const unauthenticated = await jsonRequest('/api/issues', {
    method: 'POST',
    body: JSON.stringify({
      title: `Unauthorized issue create ${Date.now()}`,
      issue_type: 'technical_art',
      priority: 'medium',
    }),
  });
  expectStatus(unauthenticated, 401, 'unauthenticated issue create');

  const reviewer = await login('chen.reviewer');
  const forbidden = await jsonRequest('/api/issues', {
    method: 'POST',
    headers: authHeaders(reviewer),
    body: JSON.stringify({
      title: `Reviewer issue create ${Date.now()}`,
      issue_type: 'technical_art',
      priority: 'medium',
    }),
  });
  expectStatus(forbidden, 403, 'reviewer issue create');
  await logout(reviewer);
});

test('multi account session tokens enforce exclusive issue locks', async () => {
  const alice = await login('alice.producer');
  const bob = await login('bob.artist');
  const issue = await createIssue(alice);

  const aliceLock = await acquireLock(alice, issue.id);
  expectStatus(aliceLock, 201, 'alice acquires issue lock');
  const lockToken = aliceLock.body.data.lock_token;
  assert.ok(lockToken, 'lock acquisition returns a lock token');

  const bobLock = await acquireLock(bob, issue.id);
  expectStatus(bobLock, 409, 'bob cannot acquire held issue lock');

  const bobWriteWithoutLock = await patchIssue(bob, issue.id);
  expectStatus(bobWriteWithoutLock, 409, 'bob cannot write locked issue without token');

  const bobWriteWithAliceToken = await patchIssue(bob, issue.id, lockToken);
  expectStatus(bobWriteWithAliceToken, 409, 'bob cannot write with another session lock token');

  const aliceWrite = await patchIssue(alice, issue.id, lockToken);
  expectStatus(aliceWrite, 200, 'alice can write with her lock token');

  const bobRelease = await releaseLock(bob, lockToken);
  expectStatus(bobRelease, 409, 'bob cannot release alice lock');

  const aliceRelease = await releaseLock(alice, lockToken);
  expectStatus(aliceRelease, 200, 'alice releases lock');

  const bobLockAfterRelease = await acquireLock(bob, issue.id);
  expectStatus(bobLockAfterRelease, 201, 'bob can acquire after release');
  await releaseLock(bob, bobLockAfterRelease.body.data.lock_token);

  await logout(alice);
  await logout(bob);
});

test('parallel lock acquisition grants one winner', async () => {
  const sessions = await Promise.all([
    login('alice.producer'),
    login('bob.artist'),
    login('chen.reviewer'),
    login('dana.manager'),
  ]);
  const issue = await createIssue(sessions[0]);

  const attempts = await Promise.all(sessions.map((session) => acquireLock(session, issue.id)));
  const winners = attempts.filter((result) => result.response.status === 201);
  const conflicts = attempts.filter((result) => result.response.status === 409);

  assert.equal(winners.length, 1, 'exactly one session wins a parallel lock race');
  assert.equal(conflicts.length, sessions.length - 1, 'all other sessions receive conflicts');

  const winningLock = winners[0].body.data;
  const winner = sessions.find((session) => session.session_id === winningLock.session_id);
  assert.ok(winner, 'winner session is identifiable');
  await releaseLock(winner, winningLock.lock_token);

  await Promise.all(sessions.map((session) => logout(session)));
});
