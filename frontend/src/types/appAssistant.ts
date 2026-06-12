/*
```cypher
CREATE
  (f:File {name: "appAssistant.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/appAssistant", type: "module"}),
  (c1:Class {name: "AppAssistantChatRequest", type: "class", language: "typescript"}),
  (c2:Class {name: "AppAssistantChatResponse", type: "class", language: "typescript"}),
  (c3:Class {name: "AppAssistantConversation", type: "class", language: "typescript"}),
  (c4:Class {name: "AppAssistantAction", type: "class", language: "typescript"}),
  (c5:Class {name: "AppAssistantPeopleContext", type: "class", language: "typescript"}),
  (c6:Class {name: "AppAssistantReplicaActionResult", type: "class", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6);
```
*/

export interface AppAssistantLangGraphNode {
  name: string;
  state: 'ready' | 'guarded' | 'planned' | string;
  detail: string;
}

export interface AppAssistantAction {
  label: string;
  action_id: string;
  kind: string;
  description: string;
  href?: string | null;
  requires_human_approval: boolean;
  status: 'ready' | 'requires_approval' | string;
}

export interface AppAssistantCapabilityContext {
  name: string;
  kind: string;
  proficiency: number;
  verification_status: string;
  evidence_count: number;
}

export interface AppAssistantSignalContext {
  signal_type: string;
  title: string;
  confidence: number;
  evidence_count: number;
}

export interface AppAssistantPeopleContext {
  available: boolean;
  job_title?: string | null;
  level?: string | null;
  languages: string[];
  availability_status?: string | null;
  workload_percent?: number | null;
  capabilities: AppAssistantCapabilityContext[];
  preferred_project_types: string[];
  evidence_sample_size: number;
  project_count: number;
  confidence: number;
  emergent_signals: AppAssistantSignalContext[];
}

export interface AppAssistantChatRequest {
  message: string;
  context?: string;
  max_tokens?: number;
  conversation_id?: string;
  app_id: string;
  route_id: string;
  pathname: string;
}

export interface AppAssistantChatResponse {
  conversation_id: string;
  message: string;
  actions: AppAssistantAction[];
  langgraph_nodes: AppAssistantLangGraphNode[];
  people_context: AppAssistantPeopleContext;
  ai_status?: {
    configured: boolean;
    used: boolean;
    provider?: string | null;
    model?: string | null;
    error?: string | null;
  };
}

export interface AppAssistantMessageMetadata {
  actions?: AppAssistantAction[];
  langgraph_nodes?: AppAssistantLangGraphNode[];
  people_context?: AppAssistantPeopleContext;
  ai_status?: AppAssistantChatResponse['ai_status'];
}

export interface AppAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: AppAssistantMessageMetadata;
  created_at: string;
}

export interface AppAssistantConversation {
  id: string;
  app_id: string;
  route_id: string;
  pathname: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: AppAssistantMessage[];
}

export interface AppAssistantReplicaActionResult {
  record: {
    vector_id: string;
    collection: string;
    write_scope: string;
    replica_url: string;
    status: string;
    created_at: string;
  };
}
