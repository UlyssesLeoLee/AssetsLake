import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_PATH = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'atomic-orchestrator.ts');
const SOURCE = readFileSync(SOURCE_PATH, 'utf8');
let modulePromise;

async function loadOrchestrator() {
  if (!modulePromise) {
    modulePromise = import(
      `data:text/javascript;base64,${Buffer.from(
        ts.transpileModule(SOURCE, {
          compilerOptions: {
            module: ts.ModuleKind.ES2022,
            target: ts.ScriptTarget.ES2022,
            verbatimModuleSyntax: true,
          },
          fileName: pathToFileURL(SOURCE_PATH).href,
        }).outputText,
      ).toString('base64')}`
    );
  }
  return modulePromise;
}

test('atomic plugin orchestrator declares rollback-first execution semantics', () => {
  assert.match(SOURCE, /runAtomicPluginPlan/);
  assert.match(SOURCE, /rollbackCompletedComponents/);
  assert.match(SOURCE, /orderAtomicPluginComponents/);
  assert.match(SOURCE, /executeWithRetries/);
  assert.match(SOURCE, /timeoutMs/);
  assert.match(SOURCE, /AbortSignal/);
  assert.match(SOURCE, /journal/);
  assert.match(
    SOURCE,
    /\[\.\.\.completed\]\.reverse\(\)/,
    'rollback happens in reverse commit order',
  );
  assert.match(SOURCE, /dependency cycle/, 'dependency cycles are rejected before execution');
  assert.match(SOURCE, /depends on missing/, 'missing dependencies are rejected before execution');
});

test('atomic plugin orchestrator rolls back committed components after failure', async () => {
  const { runAtomicPluginPlan } = await loadOrchestrator();
  const events = [];
  const result = await runAtomicPluginPlan({
    runId: 'run-test-rollback',
    pluginId: 'production.workflow',
    initialState: { applied: [] },
    components: [
      {
        id: 'reserve',
        label: 'Reserve capacity',
        order: 10,
        async execute(context) {
          context.state.applied.push('reserve');
          events.push('execute:reserve');
          return { reservationId: 'slot-1' };
        },
        rollback(context) {
          context.state.applied = context.state.applied.filter((item) => item !== 'reserve');
          events.push('rollback:reserve');
        },
      },
      {
        id: 'publish',
        label: 'Publish workflow',
        order: 20,
        dependencies: ['reserve'],
        execute() {
          events.push('execute:publish');
          throw new Error('publish failed');
        },
        rollback() {
          events.push('rollback:publish');
        },
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.deepEqual(events, ['execute:reserve', 'execute:publish', 'rollback:reserve']);
  assert.deepEqual(result.state.applied, []);
  assert.equal(result.completed.at(-1).componentId, 'reserve');
  assert.equal(result.completed.at(-1).status, 'rolled-back');
  assert.equal(result.journal.at(-1).phase, 'rollback');
});

test('atomic plugin orchestrator orders dependencies and rejects unsafe graphs', async () => {
  const { orderAtomicPluginComponents } = await loadOrchestrator();
  const ordered = orderAtomicPluginComponents([
    {
      id: 'child',
      label: 'Child',
      order: 1,
      dependencies: ['parent'],
      execute() {},
      rollback() {},
    },
    { id: 'parent', label: 'Parent', order: 2, execute() {}, rollback() {} },
  ]);

  assert.deepEqual(
    ordered.map((component) => component.id),
    ['parent', 'child'],
  );
  assert.throws(
    () =>
      orderAtomicPluginComponents([
        { id: 'a', label: 'A', order: 1, dependencies: ['b'], execute() {}, rollback() {} },
        { id: 'b', label: 'B', order: 2, dependencies: ['a'], execute() {}, rollback() {} },
      ]),
    /dependency cycle/,
  );
  assert.throws(
    () =>
      orderAtomicPluginComponents([
        { id: 'a', label: 'A', order: 1, dependencies: ['missing'], execute() {}, rollback() {} },
      ]),
    /depends on missing/,
  );
});
