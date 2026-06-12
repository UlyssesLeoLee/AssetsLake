/*
```cypher
CREATE
  (f:File {name: "designRequirement.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/designRequirement", type: "module"}),
  (c1:Class {name: "DesignRequirement", type: "class", language: "typescript", signature: "interface DesignRequirement"}),
  (c2:Class {name: "DesignRequirementAsset", type: "class", language: "typescript", signature: "interface DesignRequirementAsset"}),
  (c3:Class {name: "DesignRequirementComment", type: "class", language: "typescript", signature: "interface DesignRequirementComment"}),
  (c4:Class {name: "DesignRequirementDetail", type: "class", language: "typescript", signature: "interface DesignRequirementDetail"}),
  (c5:Class {name: "CreateDesignRequirementRequest", type: "class", language: "typescript", signature: "interface CreateDesignRequirementRequest"}),
  (c6:Class {name: "UpdateDesignRequirementRequest", type: "class", language: "typescript", signature: "interface UpdateDesignRequirementRequest"}),
  (c7:Class {name: "DesignAiDraft", type: "class", language: "typescript", signature: "interface DesignAiDraft"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7);
```
*/

export type DesignRequirementStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'archived';
export type DesignRequirementPriority = 'low' | 'medium' | 'high' | 'critical';
export type DesignAssetRelation = 'reference' | 'source' | 'target' | 'deliverable';

export interface DesignRequirement {
  id: string;
  workspace_id: string;
  project_id?: string | null;
  title: string;
  summary: string;
  status: DesignRequirementStatus;
  priority: DesignRequirementPriority;
  acceptance_criteria: string[];
  owner_name: string;
  reviewer_name?: string | null;
  due_date?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface DesignRequirementAsset {
  requirement_id: string;
  asset_id: string;
  asset_name: string;
  asset_type?: string | null;
  preview_url?: string | null;
  asset_version?: number | null;
  verified: boolean;
  relation_type: DesignAssetRelation;
  note?: string | null;
  attached_by_name: string;
  created_at: string;
}

export interface DesignRequirementComment {
  id: string;
  requirement_id: string;
  body: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface DesignRequirementDetail {
  requirement: DesignRequirement;
  assets: DesignRequirementAsset[];
  comments: DesignRequirementComment[];
}

export interface CreateDesignRequirementRequest {
  workspace_id: string;
  project_id?: string;
  title: string;
  summary?: string;
  priority?: DesignRequirementPriority;
  acceptance_criteria?: string[];
  due_date?: string;
}

export interface UpdateDesignRequirementRequest {
  title?: string;
  summary?: string;
  status?: DesignRequirementStatus;
  priority?: DesignRequirementPriority;
  acceptance_criteria?: string[];
  due_date?: string;
  expected_version: number;
}

export interface DesignAiDraft {
  title: string;
  summary: string;
  priority: DesignRequirementPriority;
  acceptance_criteria: string[];
  rationale: string;
}
