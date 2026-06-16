/*
```cypher
CREATE
  (f:File {name: "011_llm_optimizer.sql", type: "file", language: "sql"}),
  (m:Module {name: "llm_optimizer_schema", type: "module"}),
  (v1:Variable {name: "llm_optimization_signals", type: "variable"}),
  (v2:Variable {name: "llm_prompt_versions", type: "variable"}),
  (v3:Variable {name: "llm_optimization_runs", type: "variable"}),
  (v4:Variable {name: "idx_llm_signals_operation_project", type: "variable"}),
  (v5:Variable {name: "idx_llm_signals_created_at", type: "variable"}),
  (v6:Variable {name: "idx_llm_signals_prompt_version", type: "variable"}),
  (v7:Variable {name: "idx_llm_prompt_versions_operation", type: "variable"}),
  (v8:Variable {name: "idx_llm_optimization_runs_created", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8);
```
*/

-- Raw telemetry emitted after every AI call, tagged by project and operation.
-- Signals accumulate cross-project so the optimizer can learn globally.
CREATE TABLE IF NOT EXISTS llm_optimization_signals (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type      TEXT NOT NULL,
    project_id          UUID,
    prompt_version_id   UUID,
    model               TEXT NOT NULL,
    quality_score       REAL,              -- 0.0-1.0; NULL means not yet graded
    latency_ms          INTEGER,
    tokens_used         INTEGER,
    actor               TEXT NOT NULL DEFAULT 'system',
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_signals_operation_project
    ON llm_optimization_signals(operation_type, project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_llm_signals_created_at
    ON llm_optimization_signals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_llm_signals_prompt_version
    ON llm_optimization_signals(prompt_version_id, created_at DESC);

-- Versioned prompt templates generated (and later validated) by the optimizer.
-- Multiple versions can coexist; the one with the highest validated avg score wins.
CREATE TABLE IF NOT EXISTS llm_prompt_versions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type      TEXT NOT NULL,
    version             INTEGER NOT NULL DEFAULT 1,
    system_prompt       TEXT NOT NULL,
    rationale           TEXT NOT NULL DEFAULT '',
    status              TEXT NOT NULL DEFAULT 'candidate',   -- candidate | active | retired
    sample_count        INTEGER NOT NULL DEFAULT 0,
    avg_quality_score   REAL,
    optimization_run_id UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    promoted_at         TIMESTAMPTZ,
    retired_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_llm_prompt_versions_operation
    ON llm_prompt_versions(operation_type, status, avg_quality_score DESC NULLS LAST);

-- Audit log of every optimization loop execution.
CREATE TABLE IF NOT EXISTS llm_optimization_runs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    triggered_by        TEXT NOT NULL DEFAULT 'scheduler',  -- scheduler | api
    signals_analyzed    INTEGER NOT NULL DEFAULT 0,
    operations_improved INTEGER NOT NULL DEFAULT 0,
    new_versions        INTEGER NOT NULL DEFAULT 0,
    insight             TEXT NOT NULL DEFAULT '',
    status              TEXT NOT NULL DEFAULT 'ok',         -- ok | partial | failed
    error               TEXT,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_llm_optimization_runs_created
    ON llm_optimization_runs(started_at DESC);
