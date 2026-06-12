/*
```cypher
CREATE
  (f:File {name: "dataLakeQueryApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/dataLakeQueryApi", type: "module"}),
  (fn1:Function {name: "dataLakeQueryApi.sql", type: "function", language: "typescript", signature: "async sql(req: DataLakeQueryRequest): Promise<DataLakeQueryResponse>"}),
  (fn2:Function {name: "dataLakeQueryApi.cypher", type: "function", language: "typescript", signature: "async cypher(req: DataLakeQueryRequest): Promise<DataLakeQueryResponse>"}),
  (v1:Variable {name: "apiClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn1)-[:USES]->(v1),
  (fn2)-[:USES]->(v1);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type { DataLakeQueryRequest, DataLakeQueryResponse } from '@/types/dataLakeQuery';

export const dataLakeQueryApi = {
  sql: async (req: DataLakeQueryRequest): Promise<DataLakeQueryResponse> => {
    const { data } = await apiClient.post<ApiResponse<DataLakeQueryResponse>>(
      '/api/data-lake/query/sql',
      req,
      { timeout: 45_000 },
    );
    return data.data;
  },

  cypher: async (req: DataLakeQueryRequest): Promise<DataLakeQueryResponse> => {
    const { data } = await apiClient.post<ApiResponse<DataLakeQueryResponse>>(
      '/api/data-lake/query/cypher',
      req,
      { timeout: 45_000 },
    );
    return data.data;
  },
};
