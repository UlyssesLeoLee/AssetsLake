/*
```cypher
CREATE
  (f:File {name: "verification-real-sms.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.verification_real_sms", type: "module"}),
  (fn1:Function {name: "apiRequest", type: "function", language: "javascript", signature: "async function apiRequest(method, path, body, expectedStatuses)"}),
  (fn2:Function {name: "maskPhone", type: "function", language: "javascript", signature: "function maskPhone(value)"}),
  (fn3:Function {name: "test_real_sms_delivery", type: "function", language: "javascript", signature: "test('real SMS provider queues a verification code', options, async () => void)"}),
  (v1:Variable {name: "API_URL", type: "variable"}),
  (v2:Variable {name: "REAL_SMS_TO", type: "variable"}),
  (v3:Variable {name: "challenge", type: "variable"}),
  (v4:Variable {name: "outbox", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v4);
```
*/

import assert from 'node:assert/strict';
import test from 'node:test';

const API_URL =
  process.env.ASSETSLAKE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:18080';
const REAL_SMS_TO = process.env.REAL_SMS_TO;

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

function maskPhone(value) {
  return `***${String(value).slice(-4)}`;
}

test(
  'real SMS provider queues a verification code',
  { skip: REAL_SMS_TO ? false : 'REAL_SMS_TO is not set' },
  async () => {
    const challenge = await apiRequest(
      'POST',
      '/api/verification/challenges',
      {
        app_key: 'assetslake',
        purpose: 'registration',
        channel: 'sms',
        phone_number: REAL_SMS_TO,
        client_ref: `real-sms-${Date.now()}`,
      },
      [201],
    );

    const outbox = await apiRequest('GET', '/api/verification/outbox?limit=20');
    const message = outbox.data.data.find(
      (item) => item.challenge_id === challenge.data.data.challenge_id,
    );

    assert.ok(message, 'outbox message exists for real SMS challenge');
    assert.equal(message.provider, 'twilio');
    assert.ok(message.provider_message_id, 'provider message id is recorded');
    assert.equal(message.recipient_masked, maskPhone(REAL_SMS_TO));
  },
);
