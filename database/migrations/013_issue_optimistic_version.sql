/*
```cypher
CREATE
  (f:File {name: "013_issue_optimistic_version.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.issue_optimistic_version", type: "module"}),
  (c1:Class {name: "issues.version", type: "class", language: "sql", signature: "ALTER TABLE issues ADD COLUMN version"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1);
```
*/

-- Adds a monotonic version used by production write APIs for optimistic concurrency.
ALTER TABLE issues
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version >= 1);

CREATE INDEX IF NOT EXISTS idx_issues_version
  ON issues(id, version)
  WHERE deleted_at IS NULL;
