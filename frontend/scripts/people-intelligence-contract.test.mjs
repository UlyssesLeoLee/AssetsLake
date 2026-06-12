/*
```cypher
CREATE
  (f:File {name: "people-intelligence-contract.test.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend.scripts.people-intelligence-contract", type: "module"}),
  (fn1:Function {name: "read", type: "function", language: "javascript"}),
  (fn2:Function {name: "people intelligence exposes isolated IF and privacy contracts", type: "function", language: "javascript"}),
  (fn3:Function {name: "people intelligence scoring remains multidimensional and explainable", type: "function", language: "javascript"}),
  (v1:Variable {name: "ROOT", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn1),
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

test('people intelligence exposes isolated IF and privacy contracts', () => {
  const employeeIf = read('backend', 'src', 'interfaces', 'employee_intelligence_if.rs');
  const evidenceIf = read('backend', 'src', 'interfaces', 'work_evidence_if.rs');
  const service = read('backend', 'src', 'services', 'people_intelligence_service.rs');
  const migration = read('database', 'migrations', '019_people_intelligence.sql');
  const eventMigration = read('database', 'migrations', '020_people_event_consumer.sql');
  const productionHandler = read('backend', 'src', 'handlers', 'production_handler.rs');
  const registry = read('frontend', 'src', 'plugin-groups', 'registry.ts');
  const backendDeployments = read('infra', 'k8s', 'backend-microservices.yaml');
  const frontendDeployments = read('infra', 'k8s', 'frontend-domain-apps.yaml');
  const ingress = read('infra', 'k8s', 'ingress.yaml');
  const qdrant = read('infra', 'k8s', 'qdrant.yaml');

  assert.match(employeeIf, /trait EmployeeIntelligenceIf[\s\S]*search_people[\s\S]*get_evaluation[\s\S]*rerank_content[\s\S]*refresh_employee_projection/);
  assert.match(evidenceIf, /trait WorkEvidenceIf[\s\S]*summarize_employee_work/);
  assert.match(service, /projection_document[\s\S]*capabilities:[\s\S]*completed_work_180d/);
  assert.doesNotMatch(service, /projection_document[\s\S]{0,2500}profile\.email/);
  assert.match(migration, /employee_profiles[\s\S]*employee_evidence[\s\S]*employee_metric_snapshots[\s\S]*employee_vector_projections/);
  assert.match(eventMigration, /attempt_count[\s\S]*available_at[\s\S]*last_error/);
  assert.match(service, /spawn_event_consumer[\s\S]*consume_pending_events[\s\S]*people_event_receipts/);
  assert.match(productionHandler, /IssueWorkLogCreated[\s\S]*IssueDeleted[\s\S]*ReviewCreated[\s\S]*IssueApproved[\s\S]*RevisionRequested/);
  assert.match(registry, /id: 'people-intelligence-app'/);
  assert.match(registry, /id: 'people\.intelligence'/);
  assert.match(backendDeployments, /assetslake-people-intelligence-api[\s\S]*value: people-intelligence/);
  assert.match(frontendDeployments, /assetslake-people-intelligence-frontend[\s\S]*value: people-intelligence-app/);
  assert.match(ingress, /path: \/api\/people[\s\S]*assetslake-people-intelligence-api/);
  assert.match(qdrant, /kind: StatefulSet[\s\S]*name: assetslake-qdrant[\s\S]*qdrant-data/);
});

test('people intelligence scoring remains multidimensional and explainable', () => {
  const service = read('backend', 'src', 'services', 'people_intelligence_service.rs');
  const model = read('backend', 'src', 'models', 'people_intelligence.rs');

  assert.match(service, /semantic \* 0\.45[\s\S]*verified_score \* 0\.25[\s\S]*evidence_score \* 0\.15[\s\S]*availability_score \* 0\.10[\s\S]*context_score \* 0\.05/);
  assert.match(service, /MIN_EVALUATION_TASKS: i32 = 5/);
  assert.match(service, /MIN_EVALUATION_PROJECTS: i32 = 2/);
  assert.match(service, /complexity_normalized_revision/);
  assert.match(service, /SELECT point_id FROM employee_vector_projections WHERE employee_id = \$1/);
  assert.match(service, /"quality"[\s\S]*"delivery"[\s\S]*"professional"[\s\S]*"growth"[\s\S]*"collaboration"[\s\S]*"data-confidence"/);
  assert.match(model, /struct MatchExplanation[\s\S]*semantic_score[\s\S]*confidence[\s\S]*reasons/);
  assert.doesNotMatch(model, /overall_score|employee_rank|leaderboard/);
});
