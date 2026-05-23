/*
```cypher
CREATE
  (f:File {name: "emergence.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/emergence", type: "module"}),
  (c1:Class {name: "EmergenceMetrics", type: "class", language: "typescript", signature: "interface EmergenceMetrics"}),
  (c2:Class {name: "EmergenceLoopStage", type: "class", language: "typescript", signature: "interface EmergenceLoopStage"}),
  (c3:Class {name: "EmergenceSignal", type: "class", language: "typescript", signature: "interface EmergenceSignal"}),
  (c4:Class {name: "EmergenceRecommendation", type: "class", language: "typescript", signature: "interface EmergenceRecommendation"}),
  (c5:Class {name: "EmergenceSnapshot", type: "class", language: "typescript", signature: "interface EmergenceSnapshot"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5);
```
*/

export interface EmergenceMetrics {
  total_issues: number;
  open_issues: number;
  review_issues: number;
  delivery_issues: number;
  evidence_linked_issues: number;
  missing_evidence_issues: number;
  overdue_issues: number;
  qa_risk_issues: number;
  total_assets: number;
  active_assets: number;
  code_assets: number;
  versioned_assets: number;
  ai_insights: number;
  milestones: number;
  delivery_packages: number;
  rag_memories: number;
  recent_rag_memories: number;
  active_locks: number;
  active_sessions: number;
}

export interface EmergenceLoopStage {
  mode: 'sense' | 'decide' | 'act' | string;
  label: string;
  value: string;
  detail: string;
}

export interface EmergenceSignal {
  id: string;
  label: string;
  value: string;
  detail: string;
  source: 'data_lake' | 'project_flow' | 'ai' | 'automation' | string;
  tone: 'healthy' | 'watch' | 'blocked' | string;
}

export interface EmergenceRecommendation {
  id: string;
  title: string;
  mode: 'sense' | 'decide' | 'act' | string;
  action: string;
  impact: string;
  confidence: number;
  tone: 'healthy' | 'watch' | 'blocked' | string;
  app: string;
  control_id: string;
}

export interface EmergenceSnapshot {
  generated_at: string;
  posture: 'sense' | 'decide' | 'act' | string;
  readiness_percent: number;
  evidence_coverage_percent: number;
  flow_health_percent: number;
  ai_readiness_percent: number;
  risk_count: number;
  metrics: EmergenceMetrics;
  loop_stages: EmergenceLoopStage[];
  signals: EmergenceSignal[];
  recommendations: EmergenceRecommendation[];
}
