/*
```cypher
CREATE
  (f:File {name: "020_people_event_consumer.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.people_event_consumer", type: "module"}),
  (c1:Class {name: "people_event_receipts.retry_state", type: "class", language: "sql"}),
  (fn1:Function {name: "set_updated_at", type: "function", language: "plpgsql", signature: "trigger()"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (c1)-[:USES]->(fn1);
```
*/

ALTER TABLE people_event_receipts
    ADD COLUMN IF NOT EXISTS status VARCHAR(24),
    ADD COLUMN IF NOT EXISTS attempt_count INTEGER,
    ADD COLUMN IF NOT EXISTS available_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_error TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE people_event_receipts
    ALTER COLUMN processed_at DROP NOT NULL,
    ALTER COLUMN processed_at DROP DEFAULT;

UPDATE people_event_receipts
SET status = COALESCE(status, 'processed'),
    attempt_count = COALESCE(attempt_count, 1),
    available_at = COALESCE(available_at, processed_at, NOW()),
    updated_at = COALESCE(updated_at, processed_at, NOW());

ALTER TABLE people_event_receipts
    ALTER COLUMN status SET DEFAULT 'processing',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN attempt_count SET DEFAULT 1,
    ALTER COLUMN attempt_count SET NOT NULL,
    ALTER COLUMN available_at SET DEFAULT NOW(),
    ALTER COLUMN available_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'people_event_receipts_status_check'
    ) THEN
        ALTER TABLE people_event_receipts
            ADD CONSTRAINT people_event_receipts_status_check
            CHECK (status IN ('processing', 'processed', 'failed'));
    END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_people_event_receipts_retry
    ON people_event_receipts(status, available_at, updated_at);

DROP TRIGGER IF EXISTS trg_people_event_receipts_updated_at ON people_event_receipts;
CREATE TRIGGER trg_people_event_receipts_updated_at
BEFORE UPDATE ON people_event_receipts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
