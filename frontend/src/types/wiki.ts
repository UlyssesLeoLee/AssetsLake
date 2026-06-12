/*
```cypher
CREATE
  (f:File {name: "wiki.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/wiki", type: "module"}),
  (c1:Class {name: "WikiSpace", type: "class", language: "typescript", signature: "interface WikiSpace"}),
  (c2:Class {name: "WikiPage", type: "class", language: "typescript", signature: "interface WikiPage"}),
  (c3:Class {name: "TextPatch", type: "class", language: "typescript", signature: "interface TextPatch"}),
  (c4:Class {name: "WikiPageUpdate", type: "class", language: "typescript", signature: "interface WikiPageUpdate"}),
  (c5:Class {name: "WikiPresence", type: "class", language: "typescript", signature: "interface WikiPresence"}),
  (c6:Class {name: "WikiSyncSnapshot", type: "class", language: "typescript", signature: "interface WikiSyncSnapshot"}),
  (c7:Class {name: "CreateWikiSpaceRequest", type: "class", language: "typescript", signature: "interface CreateWikiSpaceRequest"}),
  (c8:Class {name: "CreateWikiPageRequest", type: "class", language: "typescript", signature: "interface CreateWikiPageRequest"}),
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

export interface WikiSpace {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface WikiPage {
  id: string;
  workspace_id: string;
  space_id: string;
  parent_id?: string | null;
  title: string;
  slug: string;
  content_markdown: string;
  version: number;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface TextPatch {
  from: number;
  to: number;
  insert: string;
}

export interface WikiPageUpdate {
  id: string;
  page_id: string;
  client_id: string;
  base_version: number;
  version: number;
  patch: TextPatch;
  content_markdown: string;
  created_by_name: string;
  created_at: string;
}

export interface WikiPresence {
  page_id: string;
  client_id: string;
  user_id?: string | null;
  display_name: string;
  cursor_anchor?: number | null;
  cursor_head?: number | null;
  last_seen_at: string;
}

export interface WikiSyncSnapshot {
  page: WikiPage;
  updates: WikiPageUpdate[];
  collaborators: WikiPresence[];
}

export interface CreateWikiSpaceRequest {
  workspace_id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CreateWikiPageRequest {
  workspace_id: string;
  space_id: string;
  title: string;
  slug: string;
  content_markdown?: string;
}
