/*
```cypher
CREATE
  (f:File {name: "app-assistant-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.app-assistant-contract", type: "module"}),
  (fn1:Function {name: "read", type: "function", language: "javascript"}),
  (fn2:Function {name: "every app receives the shared narrow assistant bar", type: "function", language: "javascript"}),
  (fn3:Function {name: "assistant graph uses controlled employee context and guarded writes", type: "function", language: "javascript"}),
  (fn4:Function {name: "assistant history persists without PII fields", type: "function", language: "javascript"}),
  (v1:Variable {name: "ROOT", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
  (fn4)-[:CALLS]->(fn1),
  (fn1)-[:USES]->(v1);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(...segments) {
  return readFileSync(resolve(ROOT, ...segments), 'utf8');
}

test('every app receives the shared narrow assistant bar', () => {
  const shell = read('frontend', 'src', 'components', 'layout', 'AppShell.tsx');
  const bar = read('frontend', 'src', 'components', 'layout', 'AppCommandBar.tsx');
  const api = read('frontend', 'src', 'lib', 'appAssistantApi.ts');

  assert.match(shell, /<main[\s\S]*<AppCommandBar/);
  assert.match(shell, /resolvePluginRoute\(pathname\)/);
  assert.match(bar, /h-\[38px\]/);
  assert.match(bar, /title="Chat history"/);
  assert.match(bar, /fixed bottom-\[46px\]/);
  assert.match(bar, /assetslake:assistant-action/);
  assert.match(bar, /requires_human_approval/);
  assert.match(bar, /replica-only write/);
  assert.match(bar, /approveAction/);
  assert.match(api, /recordReplicaAction[\s\S]*x-assetslake-ai-write-scope/);
});

test('assistant graph uses controlled employee context and guarded writes', () => {
  const handler = read('backend', 'src', 'handlers', 'management_handler.rs');

  for (const node of [
    'observe_app_context',
    'load_employee_profile',
    'match_capability_tags',
    'detect_emergent_signals',
    'propose_guarded_actions',
    'human_approval',
    'execute_allowed_action',
    'learn_from_feedback',
  ]) {
    assert.match(handler, new RegExp(node));
  }
  assert.match(handler, /get_profile\(actor, actor\.user_id\)/);
  assert.match(handler, /get_evaluation\(actor, actor\.user_id, 90\)/);
  assert.match(handler, /Primary writes[\s\S]*require explicit human approval/);
  assert.match(handler, /PII-free profile projection/);
});

test('assistant history persists without PII fields', () => {
  const handler = read('backend', 'src', 'handlers', 'management_handler.rs');
  const service = read('backend', 'src', 'services', 'app_assistant_service.rs');
  const migration = read('database', 'migrations', '021_app_assistant_conversations.sql');

  const contextStart = handler.indexOf('struct PeopleAssistantContext');
  const contextEnd = handler.indexOf('struct PeopleCapabilityContext');
  const contextContract = handler.slice(contextStart, contextEnd);

  assert.match(service, /record_exchange[\s\S]*assistant_messages/);
  assert.match(service, /list_history[\s\S]*ORDER BY updated_at DESC/);
  assert.match(migration, /assistant_conversations[\s\S]*assistant_messages/);
  assert.doesNotMatch(contextContract, /username|display_name|email|bio|comment/);
  assert.match(contextContract, /capabilities[\s\S]*preferred_project_types[\s\S]*confidence/);
});
