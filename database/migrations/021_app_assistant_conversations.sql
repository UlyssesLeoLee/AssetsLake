-- ```cypher
-- CREATE
--   (f:File {name: "021_app_assistant_conversations.sql", type: "file", language: "sql"}),
--   (t1:Table {name: "assistant_conversations", type: "table"}),
--   (t2:Table {name: "assistant_messages", type: "table"}),
--   (f)-[:CREATES]->(t1),
--   (f)-[:CREATES]->(t2),
--   (t2)-[:BELONGS_TO]->(t1);
-- ```

CREATE TABLE IF NOT EXISTS assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_id TEXT NOT NULL,
    route_id TEXT NOT NULL DEFAULT '',
    pathname TEXT NOT NULL DEFAULT '/',
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assistant_conversations_user_app_updated
    ON assistant_conversations(user_id, app_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS assistant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assistant_messages_conversation_created
    ON assistant_messages(conversation_id, created_at ASC);
