/*
```cypher
CREATE
  (f:File {name: "issue-asset-attach-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/scripts/issue-asset-attach-contract.test", type: "module"}),
  (fn1:Function {name: "readText", type: "function", language: "javascript", signature: "function readText(filePath)"}),
  (fn2:Function {name: "issue asset attach contract keeps API, hook, page, and E2E aligned", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "FRONTEND_ROOT", type: "variable"}),
  (v2:Variable {name: "FILES", type: "variable"}),
  (v3:Variable {name: "productionApi", type: "variable"}),
  (v4:Variable {name: "productionHooks", type: "variable"}),
  (v5:Variable {name: "issueDetailPage", type: "variable"}),
  (v6:Variable {name: "playwrightSpec", type: "variable"}),
  (v7:Variable {name: "playwrightMocks", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn1)-[:USES]->(v2),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn2)-[:USES]->(v5),
  (fn2)-[:USES]->(v6),
  (fn2)-[:USES]->(v7);
```
*/

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = {
  productionApi: join(FRONTEND_ROOT, 'src', 'lib', 'productionApi.ts'),
  productionHooks: join(FRONTEND_ROOT, 'src', 'hooks', 'useProduction.ts'),
  issueDetailPage: join(FRONTEND_ROOT, 'src', 'plugin-groups', 'production', 'IssueDetailPage.tsx'),
  playwrightSpec: join(FRONTEND_ROOT, 'e2e', 'product-journey.spec.ts'),
  playwrightMocks: join(FRONTEND_ROOT, 'e2e', 'fixtures', 'apiMocks.ts'),
};

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

test('issue asset attach contract keeps API, hook, page, and E2E aligned', () => {
  const productionApi = readText(FILES.productionApi);
  const productionHooks = readText(FILES.productionHooks);
  const issueDetailPage = readText(FILES.issueDetailPage);
  const playwrightSpec = readText(FILES.playwrightSpec);
  const playwrightMocks = readText(FILES.playwrightMocks);

  assert.match(productionApi, /attachAsset[\s\S]*\/api\/issues\/\$\{id\}\/attach-asset/);
  assert.match(productionHooks, /export function useAttachIssueAsset\(\)[\s\S]*productionApi\.issues\.attachAsset[\s\S]*invalidateIssueCollections\(queryClient, variables\.id\)/);
  assert.match(issueDetailPage, /useAttachIssueAsset[\s\S]*Data Lake Asset ID[\s\S]*Attach Evidence[\s\S]*Evidence linked/);
  assert.match(playwrightSpec, /getByPlaceholder\('asset id'\)[\s\S]*getByRole\('button', \{ name: \/Attach Evidence\/ \}\)/);
  assert.match(playwrightMocks, /\['transition', 'review', 'approve', 'request-revision', 'attach-asset'\]/);
});
