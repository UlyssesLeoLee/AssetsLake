/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/admin-control/page", type: "module"}),
  (fn1:Function {name: "Page", type: "function", language: "typescript", signature: "export default function Page()"}),
  (v1:Variable {name: "PluginRouteHost", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1);
```
*/

import { PluginRouteHost } from '@/plugin-groups/route-host';

export default function Page() {
  return <PluginRouteHost pathname="/admin-control" expectedRouteId="admin.control" />;
}
