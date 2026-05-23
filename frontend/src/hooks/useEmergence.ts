/*
```cypher
CREATE
  (f:File {name: "useEmergence.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/hooks/useEmergence", type: "module"}),
  (fn1:Function {name: "useEmergenceSnapshot", type: "function", language: "typescript", signature: "function useEmergenceSnapshot()"}),
  (v1:Variable {name: "emergenceApi", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1);
```
*/

'use client';

import { useQuery } from '@tanstack/react-query';
import { emergenceApi } from '@/lib/emergenceApi';

export function useEmergenceSnapshot() {
  return useQuery({
    queryKey: ['emergence-snapshot'],
    queryFn: () => emergenceApi.snapshot(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
