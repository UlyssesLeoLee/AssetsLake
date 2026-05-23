/*
```cypher
CREATE
  (f:File {name: "008_asset_ai_insights.sql", type: "file", language: "sql"}),
  (m:Module {name: "asset_ai_insights_schema", type: "module"}),
  (v1:Variable {name: "asset_ai_insights", type: "variable"}),
  (v2:Variable {name: "idx_asset_ai_insights_asset", type: "variable"}),
  (v3:Variable {name: "idx_asset_ai_insights_status", type: "variable"}),
  (v4:Variable {name: "idx_asset_ai_insights_labels", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4);
```
*/

CREATE TABLE IF NOT EXISTS asset_ai_insights (
    id                 UUID PRIMARY KEY,
    asset_id           UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    modality           TEXT NOT NULL,
    provider           TEXT NOT NULL,
    model              TEXT,
    status             TEXT NOT NULL DEFAULT 'completed',
    summary            TEXT NOT NULL,
    labels             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    detected_text      TEXT,
    quality_risks      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    reuse_suggestions  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    entities           JSONB NOT NULL DEFAULT '{}'::JSONB,
    raw_response       JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_ai_insights_asset
    ON asset_ai_insights(asset_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_asset_ai_insights_status
    ON asset_ai_insights(status, modality, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_asset_ai_insights_labels
    ON asset_ai_insights USING GIN(labels);
