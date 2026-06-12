/*
```cypher
CREATE
  (f:File {name: "019_people_intelligence.sql", type: "file", language: "sql"}),
  (m:Module {name: "database.migrations.people_intelligence", type: "module"}),
  (c1:Class {name: "departments", type: "class", language: "sql"}),
  (c2:Class {name: "employee_profiles", type: "class", language: "sql"}),
  (c3:Class {name: "capability_taxonomy", type: "class", language: "sql"}),
  (c4:Class {name: "employee_capabilities", type: "class", language: "sql"}),
  (c5:Class {name: "employee_work_preferences", type: "class", language: "sql"}),
  (c6:Class {name: "employee_evidence", type: "class", language: "sql"}),
  (c7:Class {name: "employee_metric_snapshots", type: "class", language: "sql"}),
  (c8:Class {name: "employee_emergent_signals", type: "class", language: "sql"}),
  (c9:Class {name: "employee_corrections", type: "class", language: "sql"}),
  (c10:Class {name: "people_embedding_profiles", type: "class", language: "sql"}),
  (c11:Class {name: "employee_vector_projections", type: "class", language: "sql"}),
  (c12:Class {name: "people_event_receipts", type: "class", language: "sql"}),
  (c13:Class {name: "people_index_jobs", type: "class", language: "sql"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (m)-[:CONTAINS]->(c11),
  (m)-[:CONTAINS]->(c12),
  (m)-[:CONTAINS]->(c13);
```
*/

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(160) NOT NULL,
    code VARCHAR(64) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(workspace_id, code)
);

CREATE TABLE IF NOT EXISTS employee_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(160),
    level VARCHAR(64),
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Shanghai',
    languages TEXT[] NOT NULL DEFAULT ARRAY['zh-CN']::TEXT[],
    availability_status VARCHAR(32) NOT NULL DEFAULT 'available'
        CHECK (availability_status IN ('available', 'limited', 'unavailable')),
    workload_percent INTEGER NOT NULL DEFAULT 0 CHECK (workload_percent BETWEEN 0 AND 100),
    bio TEXT NOT NULL DEFAULT '',
    searchable BOOLEAN NOT NULL DEFAULT TRUE,
    profile_version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_profiles_workspace
    ON employee_profiles(workspace_id, availability_status, workload_percent);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_manager
    ON employee_profiles(manager_id);

CREATE TABLE IF NOT EXISTS capability_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES capability_taxonomy(id) ON DELETE SET NULL,
    kind VARCHAR(32) NOT NULL
        CHECK (kind IN ('skill', 'tool', 'style', 'asset_type', 'pipeline_stage', 'domain', 'language')),
    name VARCHAR(160) NOT NULL,
    normalized_name VARCHAR(160) NOT NULL,
    aliases TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    status VARCHAR(24) NOT NULL DEFAULT 'approved'
        CHECK (status IN ('candidate', 'approved', 'retired')),
    discovered_by VARCHAR(32) NOT NULL DEFAULT 'admin'
        CHECK (discovered_by IN ('admin', 'employee', 'system')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, kind, normalized_name)
);

CREATE INDEX IF NOT EXISTS idx_capability_taxonomy_lookup
    ON capability_taxonomy(workspace_id, kind, status);
CREATE INDEX IF NOT EXISTS idx_capability_taxonomy_aliases
    ON capability_taxonomy USING GIN(aliases);

CREATE TABLE IF NOT EXISTS employee_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    capability_id UUID NOT NULL REFERENCES capability_taxonomy(id) ON DELETE CASCADE,
    proficiency SMALLINT NOT NULL DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 5),
    source VARCHAR(24) NOT NULL DEFAULT 'self'
        CHECK (source IN ('self', 'manager', 'system')),
    verification_status VARCHAR(24) NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    evidence_count INTEGER NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
    last_evidenced_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(employee_id, capability_id)
);

CREATE INDEX IF NOT EXISTS idx_employee_capabilities_employee
    ON employee_capabilities(employee_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_employee_capabilities_capability
    ON employee_capabilities(capability_id, verification_status);

CREATE TABLE IF NOT EXISTS employee_work_preferences (
    employee_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferred_capability_ids UUID[] NOT NULL DEFAULT '{}',
    avoided_capability_ids UUID[] NOT NULL DEFAULT '{}',
    preferred_project_types TEXT[] NOT NULL DEFAULT '{}',
    schedule JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID UNIQUE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    capability_id UUID REFERENCES capability_taxonomy(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    evidence_type VARCHAR(48) NOT NULL,
    source_app VARCHAR(64) NOT NULL,
    source_entity_type VARCHAR(64) NOT NULL,
    source_entity_id UUID,
    weight NUMERIC(8,4) NOT NULL DEFAULT 1,
    occurred_at TIMESTAMPTZ NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_evidence_employee_time
    ON employee_evidence(employee_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_employee_evidence_project
    ON employee_evidence(project_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS employee_metric_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    window_days INTEGER NOT NULL CHECK (window_days IN (30, 90, 180, 365)),
    as_of_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sample_size INTEGER NOT NULL DEFAULT 0,
    project_count INTEGER NOT NULL DEFAULT 0,
    confidence NUMERIC(6,5) NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 1),
    metrics JSONB NOT NULL DEFAULT '{}'::JSONB,
    benchmark_group VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(employee_id, window_days, as_of_date)
);

CREATE TABLE IF NOT EXISTS employee_emergent_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signal_type VARCHAR(48) NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    confidence NUMERIC(6,5) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    evidence_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(24) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'accepted', 'rejected', 'expired')),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_employee_emergent_signals_employee
    ON employee_emergent_signals(employee_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS employee_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    correction_type VARCHAR(48) NOT NULL,
    target_id UUID,
    reason TEXT NOT NULL,
    proposed_value JSONB,
    status VARCHAR(24) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'accepted', 'rejected', 'withdrawn')),
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_employee_corrections_employee
    ON employee_corrections(employee_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS people_embedding_profiles (
    workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL DEFAULT 'local-hash',
    model VARCHAR(160) NOT NULL DEFAULT 'privacy-hash-v1',
    collection_alias VARCHAR(200) NOT NULL,
    vector_size INTEGER NOT NULL DEFAULT 384 CHECK (vector_size BETWEEN 8 AND 4096),
    data_policy VARCHAR(32) NOT NULL DEFAULT 'redacted'
        CHECK (data_policy IN ('redacted', 'local-only')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_vector_projections (
    employee_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    point_id UUID NOT NULL UNIQUE,
    collection_name VARCHAR(200) NOT NULL,
    vector_version BIGINT NOT NULL DEFAULT 1,
    profile_version BIGINT NOT NULL DEFAULT 1,
    provider VARCHAR(64) NOT NULL,
    model VARCHAR(160) NOT NULL,
    document_sha256 VARCHAR(64) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'indexed', 'failed', 'disabled')),
    last_error TEXT,
    indexed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people_event_receipts (
    event_id UUID PRIMARY KEY,
    event_type VARCHAR(80) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'processing'
        CHECK (status IN ('processing', 'processed', 'failed')),
    attempt_count INTEGER NOT NULL DEFAULT 1,
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_error TEXT,
    processed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people_index_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(24) NOT NULL DEFAULT 'queued'
        CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO employee_profiles (user_id, workspace_id)
SELECT id, '00000000-0000-0000-0000-000000000001'
FROM users
WHERE deleted_at IS NULL
  AND LOWER(role) NOT IN ('client', 'vendor')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO capability_taxonomy (
    workspace_id, kind, name, normalized_name, aliases, status, discovered_by, approved_at
)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'asset_type', '概念设计', 'concept-art', ARRAY['concept art', '原画'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'asset_type', '角色建模', 'character-modeling', ARRAY['character model', '角色模型'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'asset_type', '场景建模', 'environment-modeling', ARRAY['environment art', '场景美术'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'skill', '贴图材质', 'texturing', ARRAY['texture', '材质'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'skill', '绑定', 'rigging', ARRAY['rig', '骨骼绑定'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'skill', '动画', 'animation', ARRAY['animation', '动作'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'skill', '特效', 'vfx', ARRAY['VFX', '视觉特效'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'skill', '技术美术', 'technical-art', ARRAY['TA', 'technical artist'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'tool', 'Blender', 'blender', ARRAY['blender3d'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'tool', 'Maya', 'maya', ARRAY['autodesk maya'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'tool', 'ZBrush', 'zbrush', ARRAY['z-brush'], 'approved', 'admin', NOW()),
    ('00000000-0000-0000-0000-000000000001', 'tool', 'Substance 3D Painter', 'substance-painter', ARRAY['SP', 'substance'], 'approved', 'admin', NOW())
ON CONFLICT (workspace_id, kind, normalized_name) DO NOTHING;

INSERT INTO people_embedding_profiles (
    workspace_id, collection_alias
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'assetslake_people_00000000_384'
)
ON CONFLICT (workspace_id) DO NOTHING;

DROP TRIGGER IF EXISTS trg_departments_updated_at ON departments;
CREATE TRIGGER trg_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_employee_profiles_updated_at ON employee_profiles;
CREATE TRIGGER trg_employee_profiles_updated_at BEFORE UPDATE ON employee_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_capability_taxonomy_updated_at ON capability_taxonomy;
CREATE TRIGGER trg_capability_taxonomy_updated_at BEFORE UPDATE ON capability_taxonomy
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_employee_capabilities_updated_at ON employee_capabilities;
CREATE TRIGGER trg_employee_capabilities_updated_at BEFORE UPDATE ON employee_capabilities
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_employee_work_preferences_updated_at ON employee_work_preferences;
CREATE TRIGGER trg_employee_work_preferences_updated_at BEFORE UPDATE ON employee_work_preferences
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_employee_vector_projections_updated_at ON employee_vector_projections;
CREATE TRIGGER trg_employee_vector_projections_updated_at BEFORE UPDATE ON employee_vector_projections
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_people_index_jobs_updated_at ON people_index_jobs;
CREATE TRIGGER trg_people_index_jobs_updated_at BEFORE UPDATE ON people_index_jobs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
