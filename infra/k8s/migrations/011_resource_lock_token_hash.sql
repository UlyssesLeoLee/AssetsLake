-- Store exclusive lock tokens as one-way hashes.
-- Version: 1.0.0

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE resource_locks
    ADD COLUMN IF NOT EXISTS lock_token_hash TEXT;

UPDATE resource_locks
SET lock_token_hash = encode(digest(lock_token::bytea, 'sha256'), 'hex')
WHERE lock_token_hash IS NULL
  AND lock_token IS NOT NULL;

ALTER TABLE resource_locks
    ALTER COLUMN lock_token DROP NOT NULL;

ALTER TABLE resource_locks
    DROP CONSTRAINT IF EXISTS resource_locks_lock_token_key;

UPDATE resource_locks
SET lock_token = NULL
WHERE lock_token IS NOT NULL;

ALTER TABLE resource_locks
    ALTER COLUMN lock_token_hash SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_resource_locks_lock_token_hash
    ON resource_locks(lock_token_hash);
