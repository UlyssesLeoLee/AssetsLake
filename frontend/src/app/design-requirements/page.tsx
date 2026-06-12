/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/design-requirements/page", type: "module"}),
  (fn1:Function {name: "DesignRequirementsRoute", type: "function", language: "typescript", signature: "function DesignRequirementsRoute()"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1);
```
*/

import { PluginRouteHost } from '@/plugin-groups/route-host';

export default function DesignRequirementsRoute() {
  return (
    <PluginRouteHost
      pathname="/design-requirements"
      expectedRouteId="design.requirements"
    />
  );
}
