/*
```cypher
CREATE
  (f:File {name: "wiki-design-app-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.wiki-design-app-contract", type: "module"}),
  (fn1:Function {name: "read", type: "function", language: "javascript", signature: "function read(...segments)"}),
  (fn2:Function {name: "wiki and design requirement apps expose isolated IF contracts", type: "function", language: "javascript", signature: "test callback"}),
  (v1:Variable {name: "ROOT", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn2)-[:CALLS]->(fn1),
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

test('wiki and design requirement apps expose isolated IF contracts', () => {
  const routes = read('backend', 'src', 'routes', 'mod.rs');
  const config = read('backend', 'src', 'config.rs');
  const wikiIf = read('backend', 'src', 'interfaces', 'wiki_if.rs');
  const designIf = read('backend', 'src', 'interfaces', 'design_requirement_if.rs');
  const assetIf = read('backend', 'src', 'interfaces', 'asset_if.rs');
  const aiIf = read('backend', 'src', 'interfaces', 'design_ai_if.rs');
  const migration = read('database', 'migrations', '018_wiki_design_requirements.sql');
  const registry = read('frontend', 'src', 'plugin-groups', 'registry.ts');

  assert.match(config, /Wiki[\s\S]*DesignRequirements[\s\S]*WIKI_DATABASE_URL[\s\S]*DESIGN_REQUIREMENTS_DATABASE_URL/);
  assert.match(routes, /configure_wiki[\s\S]*configure_design_requirements/);
  assert.match(wikiIf, /trait WikiIf[\s\S]*apply_update[\s\S]*sync_page[\s\S]*touch_presence/);
  assert.match(designIf, /trait DesignRequirementIf[\s\S]*attach_asset<A: AssetIf>[\s\S]*add_comment/);
  assert.match(assetIf, /trait AssetIf[\s\S]*resolve_asset/);
  assert.match(aiIf, /trait DesignAiIf[\s\S]*draft_requirement/);
  assert.match(migration, /wiki_page_updates[\s\S]*wiki_presence[\s\S]*design_requirement_assets/);
  assert.match(registry, /id: 'wiki-app'[\s\S]*id: 'design-requirements-app'/);
  assert.match(
    read('frontend', 'src', 'lib', 'rolePermissions.ts'),
    /'design\.requirements': \['design-requirement:read'\][\s\S]*'wiki\.editor': \['wiki:read'\]/,
  );
});
