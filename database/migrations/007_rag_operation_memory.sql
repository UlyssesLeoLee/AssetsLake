/*
```cypher
CREATE
  (f:File {name: "007_rag_operation_memory.sql", type: "file", language: "sql"}),
  (m:Module {name: "rag_operation_memory_schema", type: "module"}),
  (v1:Variable {name: "rag_operation_memories", type: "variable"}),
  (v2:Variable {name: "idx_rag_operation_memories_entity", type: "variable"}),
  (v3:Variable {name: "idx_rag_operation_memories_created", type: "variable"}),
  (v4:Variable {name: "idx_rag_operation_memories_operation", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4);
```
*/

-- Operation memory journal for the Qdrant-backed RAG loop.
CREATE TABLE IF NOT EXISTS rag_operation_memories (
    id                UUID PRIMARY KEY,
    vector_id         TEXT NOT NULL UNIQUE,
    operation_type    TEXT NOT NULL,
    app               TEXT NOT NULL,
    entity_type       TEXT NOT NULL,
    entity_id         UUID,
    actor             TEXT NOT NULL DEFAULT 'system',
    summary           TEXT NOT NULL,
    content           TEXT NOT NULL,
    embedding_provider TEXT NOT NULL,
    embedding_model   TEXT,
    qdrant_collection TEXT NOT NULL,
    payload           JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    indexed_at        TIMESTAMPTZ,
    error             TEXT
);

CREATE INDEX IF NOT EXISTS idx_rag_operation_memories_entity
    ON rag_operation_memories(entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rag_operation_memories_created
    ON rag_operation_memories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rag_operation_memories_operation
    ON rag_operation_memories(operation_type, app, created_at DESC);
