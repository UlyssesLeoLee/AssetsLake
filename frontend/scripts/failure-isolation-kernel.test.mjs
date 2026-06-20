import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_PATH = join(FRONTEND_ROOT, 'src', 'plugin-groups', 'failure-isolation-kernel.ts');
const SOURCE = readFileSync(SOURCE_PATH, 'utf8');
let modulePromise;

async function loadKernel() {
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

test('failure isolation kernel declares contract-first plugin boundaries', () => {
  assert.match(SOURCE, /PluginCapabilityContract/);
  assert.match(SOURCE, /inputSchema/);
  assert.match(SOURCE, /outputSchema/);
  assert.match(SOURCE, /timeoutMs/);
  assert.match(SOURCE, /idempotent/);
  assert.match(SOURCE, /fallback/);
  assert.match(SOURCE, /FailureIsolationKernel/);
  assert.match(SOURCE, /KernelPluginEvent/);
  assert.doesNotMatch(SOURCE, /Plugin A -> Plugin B/);
});

test('failure isolation kernel degrades optional plugin failures through fallback', async () => {
  const { FailureIsolationKernel } = await loadKernel();
  const kernel = new FailureIsolationKernel();
  kernel.register({
    pluginId: 'ai-summary-plugin',
    contract: {
      capability: 'asset.ai.summary',
      inputSchema: 'AssetSummaryRequest@1',
      outputSchema: 'AssetSummary@1',
      version: '1.0.0',
      compatibleKernel: '^1.0.0',
      timeoutMs: 50,
      requirement: 'degradable',
      idempotent: true,
      retry: { maxAttempts: 2, backoffMs: 1, jitter: false },
      fallback: {
        strategy: 'static-result',
        reason: 'AI summary is non-critical.',
        value: { summary: 'AI summary unavailable.', stale: false },
      },
    },
    execute() {
      throw new Error('provider unavailable');
    },
  });

  const result = await kernel.execute({
    capability: 'asset.ai.summary',
    input: { assetId: 'asset-1' },
    correlationId: 'corr-1',
    idempotencyKey: 'asset.ai.summary:asset-1:v1',
  });

  assert.equal(result.status, 'fallback');
  assert.equal(result.degraded, true);
  assert.equal(result.attempts, 2);
  assert.deepEqual(result.output, { summary: 'AI summary unavailable.', stale: false });
});

test('failure isolation kernel rejects unsafe retry contracts', async () => {
  const { FailureIsolationKernel, PluginContractError } = await loadKernel();
  const kernel = new FailureIsolationKernel();

  assert.throws(
    () =>
      kernel.register({
        pluginId: 'export-plugin',
        contract: {
          capability: 'asset.export.package',
          inputSchema: 'ExportRequest@1',
          outputSchema: 'ExportResult@1',
          version: '1.0.0',
          compatibleKernel: '^1.0.0',
          timeoutMs: 100,
          requirement: 'required',
          idempotent: false,
          retry: { maxAttempts: 2, backoffMs: 1, jitter: false },
        },
        execute() {
          return { ok: true };
        },
      }),
    PluginContractError,
  );
});
