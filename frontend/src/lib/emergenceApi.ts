/*
```cypher
CREATE
  (f:File {name: "emergenceApi.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/emergenceApi", type: "module"}),
  (fn1:Function {name: "emergenceApi.snapshot", type: "function", language: "typescript", signature: "async snapshot(): Promise<EmergenceSnapshot>"}),
  (v1:Variable {name: "apiClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1);
```
*/

import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types/asset';
import type { EmergenceSnapshot } from '@/types/emergence';

export const emergenceApi = {
  snapshot: async (): Promise<EmergenceSnapshot> => {
    const { data } = await apiClient.get<ApiResponse<EmergenceSnapshot>>(
      '/api/management/emergence'
    );
    return data.data;
  },
};
