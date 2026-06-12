/*
```cypher
CREATE
  (f:File {name: "verification-integration.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.verification_integration", type: "module"}),
  (fn1:Function {name: "apiRequest", type: "function", language: "javascript", signature: "async function apiRequest(method, path, body, expectedStatuses)"}),
  (fn2:Function {name: "extractCode", type: "function", language: "javascript", signature: "async function extractCode(challenge)"}),
  (fn3:Function {name: "test_registration_password_change", type: "function", language: "javascript", signature: "test('sms verification registers and changes password', async () => void)"}),
  (fn4:Function {name: "makePassword", type: "function", language: "javascript", signature: "function makePassword(label)"}),
  (v1:Variable {name: "API_URL", type: "variable"}),
  (v2:Variable {name: "challenge", type: "variable"}),
  (v3:Variable {name: "verification_token", type: "variable"}),
  (v4:Variable {name: "randomBytes", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:CALLS]->(fn4),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn4)-[:USES]->(v4);
```
*/

import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';

const API_URL =
  process.env.ASSETSLAKE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:18080';

async function apiRequest(method, path, body, expectedStatuses = [200]) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  assert.ok(
    expectedStatuses.includes(response.status),
    `${method} ${path} expected ${expectedStatuses.join('/')} got ${response.status}: ${JSON.stringify(data)}`,
  );
  return { status: response.status, data };
}

async function extractCode(challenge) {
  if (challenge.dev_code) {
    return challenge.dev_code;
  }

  const outbox = await apiRequest('GET', '/api/verification/outbox?limit=25');
  const message = outbox.data.data.find((item) => item.challenge_id === challenge.challenge_id);
  assert.ok(message, 'outbox message for challenge exists');
  const match = message.body.match(/(\d{4,8})/);
  assert.ok(match, 'outbox message contains verification code');
  return match[1];
}

function makePassword(label) {
  return `${label}-${randomBytes(18).toString('base64url')}`;
}

test('sms verification registers and changes password', async () => {
  const stamp = Date.now();
  const username = `vfy_${stamp}`;
  const phone = `+86139${String(stamp).slice(-8)}`;
  const oldPassword = makePassword('old');
  const newPassword = makePassword('new');

  const registrationChallenge = await apiRequest(
    'POST',
    '/api/verification/challenges',
    {
      app_key: 'assetslake',
      purpose: 'registration',
      channel: 'sms',
      phone_number: phone,
      client_ref: username,
    },
    [201],
  );
  const registrationCode = await extractCode(registrationChallenge.data.data);
  const registrationVerify = await apiRequest(
    'POST',
    `/api/verification/challenges/${registrationChallenge.data.data.challenge_id}/verify`,
    { code: registrationCode },
  );
  const registrationToken = registrationVerify.data.data.verification_token;
  assert.ok(registrationToken.startsWith('vfy_'));

  const registered = await apiRequest(
    'POST',
    '/api/verification/register',
    {
      app_key: 'assetslake',
      challenge_id: registrationChallenge.data.data.challenge_id,
      verification_token: registrationToken,
      username,
      password: oldPassword,
      display_name: 'Verification Test',
      phone_number: phone,
    },
    [201],
  );
  assert.equal(registered.data.data.user.username, username);

  await apiRequest('POST', '/api/auth/login', {
    username,
    password: oldPassword,
    device_label: 'verification-integration',
  });

  const passwordChallenge = await apiRequest(
    'POST',
    '/api/verification/challenges',
    {
      app_key: 'assetslake',
      purpose: 'password_change',
      channel: 'sms',
      phone_number: phone,
      client_ref: username,
    },
    [201],
  );
  const passwordCode = await extractCode(passwordChallenge.data.data);
  const passwordVerify = await apiRequest(
    'POST',
    `/api/verification/challenges/${passwordChallenge.data.data.challenge_id}/verify`,
    { code: passwordCode },
  );

  await apiRequest('POST', '/api/verification/password', {
    app_key: 'assetslake',
    challenge_id: passwordChallenge.data.data.challenge_id,
    verification_token: passwordVerify.data.data.verification_token,
    username,
    new_password: newPassword,
  });

  await apiRequest(
    'POST',
    '/api/auth/login',
    {
      username,
      password: oldPassword,
      device_label: 'verification-integration-old-password',
    },
    [401],
  );
  await apiRequest('POST', '/api/auth/login', {
    username,
    password: newPassword,
    device_label: 'verification-integration-new-password',
  });
});
