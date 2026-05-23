/*
```cypher
CREATE
  (f:File {name: "dataLakeQuery.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/dataLakeQuery", type: "module"}),
  (c1:Class {name: "DataLakeQueryEngine", type: "class", language: "typescript", signature: "type DataLakeQueryEngine"}),
  (c2:Class {name: "DataLakeQueryRequest", type: "class", language: "typescript", signature: "interface DataLakeQueryRequest"}),
  (c3:Class {name: "DataLakeQueryResponse", type: "class", language: "typescript", signature: "interface DataLakeQueryResponse"}),
  (v1:Variable {name: "DataLakeQueryRow", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:USES]->(v1);
```
*/

export type DataLakeQueryEngine = 'sql' | 'cypher';

export type DataLakeQueryRow = Record<string, unknown>;

export interface DataLakeQueryRequest {
  query: string;
  limit?: number;
}

export interface DataLakeQueryResponse {
  engine: string;
  readonly: boolean;
  columns: string[];
  rows: DataLakeQueryRow[];
  row_count: number;
  warnings: string[];
}
