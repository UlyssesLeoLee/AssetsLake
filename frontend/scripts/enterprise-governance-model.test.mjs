/*
```cypher
CREATE
  (f:File {name: "enterprise-governance-model.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/enterprise-governance-model.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "loadEnterpriseGovernanceModel", type: "function", language: "javascript", signature: "function loadEnterpriseGovernanceModel()"}),
  (fn3:Function {name: "enterprise governance model scores permissions, gates, webhooks, and audit", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "ts", type: "variable"}),
  (v4:Variable {name: "model", type: "variable"}),
  (v5:Variable {name: "controls", type: "variable"}),
  (v6:Variable {name: "governance", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v4),
  (fn3)-[:USES]->(v5),
  (fn3)-[:USES]->(v6);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = {
  enterpriseGovernanceModel: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'enterpriseGovernanceModel.ts'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function loadEnterpriseGovernanceModel() {
  const source = readText(FILES.enterpriseGovernanceModel);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: FILES.enterpriseGovernanceModel,
  });
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in enterpriseGovernanceModel: ${specifier}`);
    },
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: FILES.enterpriseGovernanceModel, timeout: 1000 });
  return module.exports;
}

test('enterprise governance model scores permissions, gates, webhooks, and audit', () => {
  const model = loadEnterpriseGovernanceModel();
  const controls = {
    project_id: 'project-a',
    roles: [
      { role: 'admin', scope: 'workspace', member_count: 1, permissions: ['project:admin', 'workflow:edit'] },
      { role: 'producer', scope: 'project', member_count: 2, permissions: ['issue:write', 'workflow:edit'] },
    ],
    notifications: [
      { event: 'assignments', channels: ['email'], delivery_policy: 'immediate', enabled: true },
      { event: 'automation', channels: ['webhook'], delivery_policy: 'guarded', enabled: false },
    ],
    import_export: [
      { job_type: 'csv_import', direction: 'import', format: 'csv', status: 'ready', description: 'Import.' },
      { job_type: 'json_export', direction: 'export', format: 'json', status: 'ready', description: 'Export.' },
    ],
    webhooks: [
      { event: 'issue_transition', status: 'active', target: 'target-a', retry_policy: '3_attempts' },
      { event: 'automation', status: 'guarded', target: 'target-b', retry_policy: 'manual_review' },
    ],
    templates: [],
    ci_gates: [
      { name: 'unit', command: 'pnpm test', required: true, status: 'passing' },
      { name: 'smoke', command: 'pnpm smoke', required: true, status: 'failed' },
    ],
    audit: { policy: 'append_only', retention_days: 180, drilldowns: ['issue_history'], export_formats: ['json'] },
  };

  assert.equal(JSON.stringify(model.buildPermissionCoverage(controls)), '["issue:write","project:admin","workflow:edit"]');
  assert.equal(model.buildGovernanceRisks(controls).length, 4);

  const governance = model.buildEnterpriseGovernanceModel(controls);
  assert.equal(governance.score, 30);
  assert.equal(governance.enabledNotificationCount, 1);
  assert.equal(governance.requiredCiPassing, 1);
  assert.equal(governance.requiredCiTotal, 2);
  assert.equal(governance.importReadyCount, 2);
  assert.equal(governance.webhookActiveCount, 1);
  assert.equal(governance.auditDrilldownCount, 1);

  const empty = model.buildEnterpriseGovernanceModel(undefined);
  assert.equal(empty.score, 75);
  assert.equal(empty.risks[0].id, 'audit_retention');
});
