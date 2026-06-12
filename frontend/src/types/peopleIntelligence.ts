/*
```cypher
CREATE
  (f:File {name: "peopleIntelligence.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/peopleIntelligence", type: "module"}),
  (c1:Class {name: "CapabilityTaxonomyItem", type: "class", language: "typescript"}),
  (c2:Class {name: "EmployeeCapability", type: "class", language: "typescript"}),
  (c3:Class {name: "EmployeeProfile", type: "class", language: "typescript"}),
  (c4:Class {name: "PeopleSearchQuery", type: "class", language: "typescript"}),
  (c5:Class {name: "PeopleSearchMatch", type: "class", language: "typescript"}),
  (c6:Class {name: "EmployeeEvaluation", type: "class", language: "typescript"}),
  (c7:Class {name: "UpdateEmployeeProfileRequest", type: "class", language: "typescript"}),
  (c8:Class {name: "PeopleReindexResponse", type: "class", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8);
```
*/

export interface CapabilityTaxonomyItem {
  id: string;
  parent_id?: string | null;
  kind: string;
  name: string;
  normalized_name: string;
  aliases: string[];
  description?: string | null;
  status: 'candidate' | 'approved' | 'retired';
  discovered_by: 'admin' | 'employee' | 'system';
}

export interface EmployeeCapability {
  id: string;
  capability_id: string;
  kind: string;
  name: string;
  aliases: string[];
  proficiency: number;
  source: 'self' | 'manager' | 'system';
  verification_status: 'pending' | 'verified' | 'rejected';
  evidence_count: number;
  last_evidenced_at?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  valid_until?: string | null;
}

export interface EmployeeWorkPreferences {
  preferred_capability_ids: string[];
  avoided_capability_ids: string[];
  preferred_project_types: string[];
  schedule: Record<string, unknown>;
}

export interface EmployeeProfile {
  user_id: string;
  workspace_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  role: string;
  department_id?: string | null;
  department_name?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  job_title?: string | null;
  level?: string | null;
  timezone: string;
  languages: string[];
  availability_status: 'available' | 'limited' | 'unavailable';
  workload_percent: number;
  bio: string;
  searchable: boolean;
  profile_version: number;
  capabilities: EmployeeCapability[];
  preferences: EmployeeWorkPreferences;
  updated_at: string;
}

export interface PeopleSearchQuery {
  workspace_id: string;
  query: string;
  capability_ids: string[];
  kinds: string[];
  languages: string[];
  availability_status?: string;
  max_workload_percent?: number;
  project_id?: string;
  limit?: number;
}

export interface MatchExplanation {
  semantic_score: number;
  verified_capability_score: number;
  evidence_score: number;
  availability_score: number;
  context_score: number;
  evidence_count: number;
  evidence_from?: string | null;
  evidence_to?: string | null;
  confidence: number;
  reasons: string[];
}

export interface PeopleSearchMatch {
  employee: EmployeeProfile;
  score: number;
  explanation: MatchExplanation;
}

export interface EvaluationDimension {
  key: string;
  label: string;
  value?: number | null;
  unit: string;
  status: string;
  confidence: number;
  evidence_count: number;
  explanation: string;
}

export interface EmployeeEmergentSignal {
  id: string;
  signal_type: string;
  title: string;
  summary: string;
  confidence: number;
  evidence_count: number;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface EmployeeEvidenceRef {
  id: string;
  evidence_type: string;
  source_app: string;
  source_entity_type: string;
  source_entity_id?: string | null;
  project_id?: string | null;
  occurred_at: string;
  weight: number;
  metadata: Record<string, unknown>;
}

export interface EmployeeEvaluation {
  employee: EmployeeProfile;
  window_days: number;
  insufficient_evidence: boolean;
  sample_size: number;
  project_count: number;
  confidence: number;
  dimensions: EvaluationDimension[];
  signals: EmployeeEmergentSignal[];
  recent_evidence: EmployeeEvidenceRef[];
  disclaimer: string;
}

export interface UpdateEmployeeProfileRequest {
  job_title?: string;
  level?: string;
  timezone?: string;
  languages?: string[];
  availability_status?: string;
  workload_percent?: number;
  bio?: string;
  searchable?: boolean;
  capabilities?: Array<{ capability_id: string; proficiency: number }>;
  preferences?: EmployeeWorkPreferences;
}

export interface PeopleReindexResponse {
  requested: number;
  indexed: number;
  failed: number;
  results: Array<{
    employee_id: string;
    point_id: string;
    collection: string;
    provider: string;
    indexed: boolean;
    error?: string | null;
  }>;
}
