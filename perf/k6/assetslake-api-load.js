/*
```cypher
CREATE
  (f:File {name: "assetslake-api-load.js", type: "file", language: "javascript"}),
  (m:Module {name: "perf.k6.assetslake_api_load", type: "module"}),
  (fn1:Function {name: "positiveInt", type: "function", language: "javascript", signature: "function positiveInt(name, fallback)"}),
  (fn2:Function {name: "envString", type: "function", language: "javascript", signature: "function envString(name, fallback)"}),
  (fn3:Function {name: "constantRateScenario", type: "function", language: "javascript", signature: "function constantRateScenario(exec, rate, preAllocatedVUs, maxVUs, tags)"}),
  (fn4:Function {name: "addScenario", type: "function", language: "javascript", signature: "function addScenario(name, exec, rate, preAllocatedVUs, maxVus, tags = {})"}),
  (fn5:Function {name: "addThreshold", type: "function", language: "javascript", signature: "function addThreshold(metric, values)"}),
  (fn6:Function {name: "buildUrl", type: "function", language: "javascript", signature: "function buildUrl(path)"}),
  (fn7:Function {name: "jsonBody", type: "function", language: "javascript", signature: "function jsonBody(response)"}),
  (fn8:Function {name: "requestJson", type: "function", language: "javascript", signature: "function requestJson(method, path, body, headers = {}, expectedStatuses = [200])"}),
  (fn9:Function {name: "authHeaders", type: "function", language: "javascript", signature: "function authHeaders(session)"}),
  (fn10:Function {name: "pickSession", type: "function", language: "javascript", signature: "function pickSession(data)"}),
  (fn11:Function {name: "login", type: "function", language: "javascript", signature: "function login(username)"}),
  (fn12:Function {name: "logout", type: "function", language: "javascript", signature: "function logout(session)"}),
  (fn13:Function {name: "createIssue", type: "function", language: "javascript", signature: "function createIssue(session)"}),
  (fn14:Function {name: "setup", type: "function", language: "javascript", signature: "export function setup()"}),
  (fn15:Function {name: "teardown", type: "function", language: "javascript", signature: "export function teardown(data)"}),
  (fn16:Function {name: "healthBaseline", type: "function", language: "javascript", signature: "export function healthBaseline()"}),
  (fn17:Function {name: "authRead", type: "function", language: "javascript", signature: "export function authRead(data)"}),
  (fn18:Function {name: "issueList", type: "function", language: "javascript", signature: "export function issueList(data)"}),
  (fn19:Function {name: "lockRace", type: "function", language: "javascript", signature: "export function lockRace(data)"}),
  (v1:Variable {name: "BASE_URL", type: "variable"}),
  (v2:Variable {name: "DURATION", type: "variable"}),
  (v3:Variable {name: "REQUEST_TIMEOUT", type: "variable"}),
  (v4:Variable {name: "TEST_PASSWORD", type: "variable"}),
  (v5:Variable {name: "ACCOUNT_NAMES", type: "variable"}),
  (v6:Variable {name: "scenarios", type: "variable"}),
  (v7:Variable {name: "thresholds", type: "variable"}),
  (v8:Variable {name: "unexpectedResponses", type: "variable"}),
  (v9:Variable {name: "lockWinners", type: "variable"}),
  (v10:Variable {name: "lockConflicts", type: "variable"}),
  (v11:Variable {name: "options", type: "variable"}),
  (v12:Variable {name: "LOCK_HOLD_SECONDS", type: "variable"}),
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
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8),
  (m)-[:USES]->(v9),
  (m)-[:USES]->(v10),
  (m)-[:USES]->(v11),
  (m)-[:USES]->(v12),
  (fn4)-[:CALLS]->(fn3),
  (fn5)-[:USES]->(v7),
  (fn6)-[:USES]->(v1),
  (fn8)-[:CALLS]->(fn6),
  (fn8)-[:USES]->(v3),
  (fn8)-[:USES]->(v8),
  (fn10)-[:USES]->(v5),
  (fn11)-[:CALLS]->(fn8),
  (fn11)-[:CALLS]->(fn7),
  (fn11)-[:USES]->(v4),
  (fn12)-[:CALLS]->(fn8),
  (fn12)-[:CALLS]->(fn9),
  (fn13)-[:CALLS]->(fn8),
  (fn13)-[:CALLS]->(fn9),
  (fn13)-[:CALLS]->(fn7),
  (fn14)-[:CALLS]->(fn11),
  (fn14)-[:CALLS]->(fn13),
  (fn14)-[:USES]->(v5),
  (fn15)-[:CALLS]->(fn12),
  (fn16)-[:CALLS]->(fn8),
  (fn17)-[:CALLS]->(fn8),
  (fn17)-[:CALLS]->(fn9),
  (fn17)-[:CALLS]->(fn10),
  (fn18)-[:CALLS]->(fn8),
  (fn18)-[:CALLS]->(fn9),
  (fn18)-[:CALLS]->(fn10),
  (fn19)-[:CALLS]->(fn8),
  (fn19)-[:CALLS]->(fn9),
  (fn19)-[:CALLS]->(fn10),
  (fn19)-[:CALLS]->(fn7),
  (fn19)-[:USES]->(v9),
  (fn19)-[:USES]->(v10),
  (fn19)-[:USES]->(v12);
```
*/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const BASE_URL = envString('BASE_URL', 'http://host.docker.internal:18080').replace(/\/+$/, '');
const DURATION = envString('DURATION', '1m');
const REQUEST_TIMEOUT = envString('REQUEST_TIMEOUT', '10s');
const TEST_PASSWORD = envString('ASSETSLAKE_TEST_PASSWORD', 'AssetsLake#2026');
const ACCOUNT_NAMES = envString(
  'ACCOUNTS',
  'alice.producer,bob.artist,chen.reviewer,dana.manager'
)
  .split(',')
  .map((account) => account.trim())
  .filter(Boolean);

const HEALTH_RPS = positiveInt('HEALTH_RPS', 500);
const AUTH_RPS = positiveInt('AUTH_RPS', 120);
const ISSUE_RPS = positiveInt('ISSUE_RPS', 60);
const LOCK_RPS = positiveInt('LOCK_RPS', 30);
const MAX_VUS = positiveInt('MAX_VUS', 1000);
const P95_MS = positiveInt('P95_MS', 3000);
const HEALTH_P95_MS = positiveInt('HEALTH_P95_MS', 750);
const FAIL_RATE = Number(__ENV.FAIL_RATE || '0.01');
const LOCK_HOLD_SECONDS = Number(__ENV.LOCK_HOLD_SECONDS || '0.05');

const scenarios = {};
const thresholds = {
  http_req_failed: [`rate<${FAIL_RATE}`],
  http_req_duration: [`p(95)<${P95_MS}`],
  checks: ['rate>0.99'],
  unexpected_responses: ['count==0'],
};

const unexpectedResponses = new Counter('unexpected_responses');
const lockWinners = new Counter('lock_winners');
const lockConflicts = new Counter('lock_conflicts');

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 399 }, 409));

addScenario('health_baseline', 'healthBaseline', HEALTH_RPS, Math.max(50, Math.ceil(HEALTH_RPS / 10)), MAX_VUS, {
  endpoint_group: 'health',
});
addScenario('auth_read', 'authRead', AUTH_RPS, Math.max(20, Math.ceil(AUTH_RPS / 6)), MAX_VUS, {
  endpoint_group: 'auth',
});
addScenario('issue_list', 'issueList', ISSUE_RPS, Math.max(10, Math.ceil(ISSUE_RPS / 5)), MAX_VUS, {
  endpoint_group: 'production',
});
addScenario('lock_race', 'lockRace', LOCK_RPS, Math.max(10, Math.ceil(LOCK_RPS / 3)), MAX_VUS, {
  endpoint_group: 'locks',
});

addThreshold('http_req_duration{scenario:health_baseline}', [`p(95)<${HEALTH_P95_MS}`]);

if (Object.keys(scenarios).length === 0) {
  throw new Error('At least one *_RPS environment variable must be greater than zero.');
}

export const options = {
  discardResponseBodies: false,
  scenarios,
  thresholds,
};

function positiveInt(name, fallback) {
  const value = Number.parseInt(__ENV[name] || `${fallback}`, 10);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a positive integer or zero.`);
  }
  return value;
}

function envString(name, fallback) {
  const value = __ENV[name];
  return value === undefined || value === '' ? fallback : value;
}

function constantRateScenario(exec, rate, preAllocatedVUs, maxVUs, tags) {
  return {
    executor: 'constant-arrival-rate',
    exec,
    rate,
    timeUnit: '1s',
    duration: DURATION,
    preAllocatedVUs,
    maxVUs,
    gracefulStop: '10s',
    tags,
  };
}

function addScenario(name, exec, rate, preAllocatedVUs, maxVus, tags = {}) {
  if (rate > 0) {
    scenarios[name] = constantRateScenario(exec, rate, preAllocatedVUs, maxVus, tags);
  }
}

function addThreshold(metric, values) {
  if (scenarios[metric.match(/\{scenario:([^}]+)\}/)?.[1]]) {
    thresholds[metric] = values;
  }
}

function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

function jsonBody(response) {
  if (!response.body) {
    return null;
  }
  return JSON.parse(response.body);
}

function requestJson(method, path, body, headers = {}, expectedStatuses = [200]) {
  const params = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      ...headers,
    },
    timeout: REQUEST_TIMEOUT,
    tags: {
      route: path.split('?')[0],
    },
  };
  const payload = body === null || body === undefined ? null : JSON.stringify(body);
  const response = http.request(method, buildUrl(path), payload, params);
  const ok = expectedStatuses.includes(response.status);

  check(response, {
    [`${method} ${path} returned ${expectedStatuses.join(' or ')}`]: () => ok,
  });

  if (!ok) {
    unexpectedResponses.add(1);
  }

  return response;
}

function authHeaders(session) {
  return {
    authorization: `Bearer ${session.token}`,
  };
}

function pickSession(data) {
  return data.sessions[(__VU - 1) % data.sessions.length];
}

function login(username) {
  const response = requestJson(
    'POST',
    '/api/auth/login',
    {
      username,
      password: TEST_PASSWORD,
      device_label: `k6-${username}-${Date.now()}`,
    },
    {},
    [200]
  );
  return jsonBody(response).data;
}

function logout(session) {
  requestJson('POST', '/api/auth/logout', null, authHeaders(session), [200, 401]);
}

function createIssue(session) {
  const response = requestJson(
    'POST',
    '/api/issues',
    {
      title: `k6 high concurrency issue ${Date.now()}`,
      description: 'Created by the AssetsLake k6 performance test setup.',
      issue_type: 'technical_art',
      priority: 'medium',
      story_points: 1,
    },
    authHeaders(session),
    [201]
  );
  return jsonBody(response).data;
}

export function setup() {
  if (ACCOUNT_NAMES.length === 0) {
    throw new Error('ACCOUNTS must contain at least one username.');
  }

  if (AUTH_RPS === 0 && ISSUE_RPS === 0 && LOCK_RPS === 0) {
    return { sessions: [], issueId: null };
  }

  const sessions = ACCOUNT_NAMES.map((username) => login(username));
  const issue = createIssue(sessions[0]);
  return { sessions, issueId: issue.id };
}

export function teardown(data) {
  for (const session of data.sessions || []) {
    logout(session);
  }
}

export function healthBaseline() {
  requestJson('GET', '/api/health', null, {}, [200]);
}

export function authRead(data) {
  const session = pickSession(data);
  requestJson('GET', '/api/auth/me', null, authHeaders(session), [200]);
}

export function issueList(data) {
  const session = pickSession(data);
  requestJson('GET', '/api/issues?page=1&page_size=20', null, authHeaders(session), [200]);
}

export function lockRace(data) {
  const session = pickSession(data);
  const response = requestJson(
    'POST',
    '/api/locks/acquire',
    {
      resource_type: 'issue',
      resource_id: data.issueId,
      ttl_seconds: 30,
      purpose: `k6 lock race vu=${__VU} iter=${__ITER}`,
    },
    authHeaders(session),
    [201, 409]
  );

  if (response.status === 201) {
    lockWinners.add(1);
    const lock = jsonBody(response).data;
    if (LOCK_HOLD_SECONDS > 0) {
      sleep(LOCK_HOLD_SECONDS);
    }
    requestJson('POST', '/api/locks/release', { lock_token: lock.lock_token }, authHeaders(session), [
      200,
      409,
    ]);
  } else if (response.status === 409) {
    lockConflicts.add(1);
  }
}
