/*
```cypher
CREATE
  (f:File {name: "ten-user-exclusive-lock.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.ten_user_exclusive_lock", type: "module"}),
  (fn1:Function {name: "jsonRequest", type: "function", language: "javascript", signature: "async function jsonRequest(path, options = {})"}),
  (fn2:Function {name: "expectStatus", type: "function", language: "javascript", signature: "function expectStatus(result, status, label)"}),
  (fn3:Function {name: "timed", type: "function", language: "javascript", signature: "async function timed(label, fn)"}),
  (fn4:Function {name: "login", type: "function", language: "javascript", signature: "async function login(account)"}),
  (fn5:Function {name: "authHeaders", type: "function", language: "javascript", signature: "function authHeaders(session, lockToken)"}),
  (fn6:Function {name: "createIssue", type: "function", language: "javascript", signature: "async function createIssue(session, label)"}),
  (fn7:Function {name: "acquireLock", type: "function", language: "javascript", signature: "async function acquireLock(session, issueId, label)"}),
  (fn8:Function {name: "patchIssue", type: "function", language: "javascript", signature: "async function patchIssue(session, issue, lockToken)"}),
  (fn9:Function {name: "releaseLock", type: "function", language: "javascript", signature: "async function releaseLock(session, lockToken)"}),
  (fn10:Function {name: "logout", type: "function", language: "javascript", signature: "async function logout(session)"}),
  (fn11:Function {name: "assertExclusiveRace", type: "function", language: "javascript", signature: "async function assertExclusiveRace(sessions, issue, label)"}),
  (fn12:Function {name: "ten users exercise exclusive locks at multiple contention levels", type: "function", language: "javascript", signature: "test callback"}),
  (fn13:Function {name: "exclusive locks do not bypass write authorization", type: "function", language: "javascript", signature: "test callback"}),
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
  (m)-[:CONTAINS]->(fn13),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn1),
  (fn6)-[:CALLS]->(fn5),
  (fn7)-[:CALLS]->(fn1),
  (fn7)-[:CALLS]->(fn5),
  (fn8)-[:CALLS]->(fn1),
  (fn8)-[:CALLS]->(fn5),
  (fn9)-[:CALLS]->(fn1),
  (fn9)-[:CALLS]->(fn5),
  (fn10)-[:CALLS]->(fn1),
  (fn10)-[:CALLS]->(fn5),
  (fn11)-[:CALLS]->(fn7),
  (fn11)-[:CALLS]->(fn9),
  (fn12)-[:CALLS]->(fn3),
  (fn12)-[:CALLS]->(fn4),
  (fn12)-[:CALLS]->(fn6),
  (fn12)-[:CALLS]->(fn11),
  (fn12)-[:CALLS]->(fn10),
  (fn13)-[:CALLS]->(fn3),
  (fn13)-[:CALLS]->(fn4),
  (fn13)-[:CALLS]->(fn6),
  (fn13)-[:CALLS]->(fn7),
  (fn13)-[:CALLS]->(fn8),
  (fn13)-[:CALLS]->(fn9),
  (fn13)-[:CALLS]->(fn10);
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
const ACCOUNTS = [
  { username: 'alice.producer', canWrite: true },
  { username: 'bob.artist', canWrite: true },
  { username: 'chen.reviewer', canWrite: false },
  { username: 'dana.manager', canWrite: true },
  { username: 'eve.producer', canWrite: true },
  { username: 'felix.artist', canWrite: true },
  { username: 'grace.reviewer', canWrite: false },
  { username: 'hao.manager', canWrite: false },
  { username: 'iris.artist', canWrite: true },
  { username: 'jo.viewer', canWrite: false },
];
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
  assert.ok(
    elapsedMs <= API_LATENCY_SLO_MS,
    `${label} finished in ${elapsedMs.toFixed(0)}ms, over ${API_LATENCY_SLO_MS}ms SLO`,
  );
  return result;
}

async function login(account) {
  const result = await jsonRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: account.username,
      password: account.username === 'dana.manager' ? ADMIN_PASSWORD : TEST_PASSWORD,
      device_label: `ten-user-lock-${account.username}-${Date.now()}`,
    }),
  });
  expectStatus(result, 200, `${account.username} login`);
  return { ...result.body.data, canWrite: account.canWrite };
}

function authHeaders(session, lockToken) {
  return {
    authorization: `Bearer ${session.token}`,
    ...(lockToken ? { 'x-assetslake-lock-token': lockToken } : {}),
  };
}

async function createIssue(session, label) {
  const result = await jsonRequest('/api/issues', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      title: `Ten user exclusive lock ${label} ${Date.now()}`,
      description: `Created by ${label}`,
      issue_type: 'technical_art',
      priority: 'medium',
      story_points: 1,
    }),
  });
  expectStatus(result, 201, `${label} issue create`);
  return result.body.data;
}

async function acquireLock(session, issueId, label) {
  return jsonRequest('/api/locks/acquire', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      resource_type: 'issue',
      resource_id: issueId,
      ttl_seconds: 120,
      purpose: `${label} by ${session.user.username}`,
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
  expectStatus(result, 200, `${session.user.username} releases lock`);
}

async function logout(session) {
  await jsonRequest('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(session),
  });
}

async function assertExclusiveRace(sessions, issue, label) {
  const attempts = await timed(`${label} lock race`, () =>
    Promise.all(sessions.map((session) => acquireLock(session, issue.id, label))),
  );
  const winners = attempts.filter((result) => result.response.status === 201);
  const conflicts = attempts.filter((result) => result.response.status === 409);
  assert.equal(winners.length, 1, `${label} has exactly one lock winner`);
  assert.equal(conflicts.length, sessions.length - 1, `${label} rejects all other contenders`);

  const lock = winners[0].body.data;
  const winner = sessions.find((session) => session.session_id === lock.session_id);
  assert.ok(winner, `${label} winner session is resolved`);
  await timed(`${label} release`, () => releaseLock(winner, lock.lock_token));
  return { lock, winner };
}

test('ten users exercise exclusive locks at multiple contention levels', async (t) => {
  const health = await timed('backend health', () => jsonRequest('/api/health'));
  expectStatus(health, 200, `backend health at ${API_BASE}`);

  const listed = await timed('list ten test accounts', () =>
    jsonRequest('/api/auth/test-accounts'),
  );
  expectStatus(listed, 200, 'test account list');
  const listedUsernames = new Set(listed.body.data.map((account) => account.username));
  for (const account of ACCOUNTS) {
    assert.ok(listedUsernames.has(account.username), `${account.username} is listed`);
  }

  const sessions = await timed('login ten users', () => Promise.all(ACCOUNTS.map(login)));
  t.after(async () => {
    await Promise.allSettled(sessions.map(logout));
    console.log(`ten_user_observations=${JSON.stringify(observations)}`);
  });

  const creator = sessions.find((session) => session.user.username === 'alice.producer');
  assert.ok(creator, 'creator session is available');

  for (const { size, label } of [
    { size: 2, label: 'low two-user contention' },
    { size: 5, label: 'medium five-user contention' },
    { size: 10, label: 'high ten-user contention' },
  ]) {
    const issue = await timed(`${label} issue create`, () => createIssue(creator, label));
    await assertExclusiveRace(sessions.slice(0, size), issue, label);
  }
});

test('exclusive locks guard writes without bypassing authorization', async (t) => {
  const sessions = await timed('login ten users for write checks', () =>
    Promise.all(ACCOUNTS.map(login)),
  );
  t.after(async () => {
    await Promise.allSettled(sessions.map(logout));
    console.log(`ten_user_write_observations=${JSON.stringify(observations)}`);
  });

  const creator = sessions.find((session) => session.user.username === 'alice.producer');
  const writerSessions = sessions.filter((session) => session.canWrite);
  const viewer = sessions.find((session) => session.user.username === 'jo.viewer');
  assert.ok(creator, 'creator session is available');
  assert.ok(viewer, 'viewer session is available');
  assert.ok(writerSessions.length >= 2, 'writer sessions are available');

  const writerIssue = await timed('writer issue create', () =>
    createIssue(creator, 'writer-check'),
  );
  const attempts = await timed('six writer lock race', () =>
    Promise.all(
      writerSessions.map((session) => acquireLock(session, writerIssue.id, 'writer-check')),
    ),
  );
  const winners = attempts.filter((result) => result.response.status === 201);
  const conflicts = attempts.filter((result) => result.response.status === 409);
  assert.equal(winners.length, 1, 'one writer wins the write race');
  assert.equal(conflicts.length, writerSessions.length - 1, 'all other writers conflict');

  const winningLock = winners[0].body.data;
  const winner = writerSessions.find((session) => session.session_id === winningLock.session_id);
  const loser = writerSessions.find((session) => session.session_id !== winningLock.session_id);
  assert.ok(winner, 'writer winner session is resolved');
  assert.ok(loser, 'writer loser session is resolved');

  const loserWrite = await timed('writer loser rejected without lock', () =>
    patchIssue(loser, writerIssue),
  );
  expectStatus(loserWrite, 409, 'writer loser write without lock');

  const winnerWrite = await timed('writer winner accepted with lock', () =>
    patchIssue(winner, writerIssue, winningLock.lock_token),
  );
  expectStatus(winnerWrite, 200, 'writer winner write with lock');
  await timed('writer lock release', () => releaseLock(winner, winningLock.lock_token));

  const viewerIssue = await timed('viewer issue create', () =>
    createIssue(creator, 'viewer-check'),
  );
  const viewerLock = await timed('viewer can acquire lock', () =>
    acquireLock(viewer, viewerIssue.id, 'viewer-check'),
  );
  expectStatus(viewerLock, 201, 'viewer lock acquire');
  const viewerWrite = await timed('viewer write forbidden even with lock', () =>
    patchIssue(viewer, viewerIssue, viewerLock.body.data.lock_token),
  );
  expectStatus(viewerWrite, 403, 'viewer write with lock');
  await timed('viewer lock release', () => releaseLock(viewer, viewerLock.body.data.lock_token));
});
