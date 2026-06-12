/*
```cypher
CREATE
  (f:File {name: "verification-real-email.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.verification_real_email", type: "module"}),
  (fn1:Function {name: "apiRequest", type: "function", language: "javascript", signature: "async function apiRequest(method, path, body, expectedStatuses)"}),
  (fn2:Function {name: "maskEmail", type: "function", language: "javascript", signature: "function maskEmail(value)"}),
  (fn3:Function {name: "test_real_email_delivery", type: "function", language: "javascript", signature: "test('real SMTP provider sends a verification code email', options, async () => void)"}),
  (v1:Variable {name: "API_URL", type: "variable"}),
  (v2:Variable {name: "REAL_EMAIL_TO", type: "variable"}),
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
const REAL_EMAIL_TO = process.env.REAL_EMAIL_TO;

async function apiRequest(method, path, body, expectedStatuses = [200, 201]) {
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

function maskEmail(value) {
  const [name, domain] = String(value).toLowerCase().split('@');
  return `${name?.[0] ?? '*'}***@${domain ?? ''}`;
}

test(
  'real SMTP provider sends a verification code email',
  { skip: REAL_EMAIL_TO ? false : 'REAL_EMAIL_TO is not set' },
  async () => {
    const challenge = await apiRequest('POST', '/api/verification/challenges', {
      app_key: 'assetslake',
      purpose: 'registration',
      channel: 'email',
      email: REAL_EMAIL_TO,
      client_ref: `real-email-${Date.now()}`,
    });

    assert.equal(challenge.data.data.delivery_status, 'sent');

    const outbox = await apiRequest('GET', '/api/verification/outbox?limit=20');
    const message = outbox.data.data.find(
      (item) => item.challenge_id === challenge.data.data.challenge_id,
    );

    assert.ok(message, 'outbox message exists for real email challenge');
    if (process.env.EXPECTED_EMAIL_PROVIDER) {
      assert.equal(message.provider, process.env.EXPECTED_EMAIL_PROVIDER);
    } else {
      assert.ok(
        ['gmail', 'outlook', 'smtp'].includes(message.provider),
        `unexpected provider ${message.provider}`,
      );
    }
    assert.equal(message.status, 'sent');
    assert.equal(message.recipient_masked, maskEmail(REAL_EMAIL_TO));
    assert.ok(message.subject, 'email subject is recorded');
  },
);
