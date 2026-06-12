/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/wiki/page", type: "module"}),
  (fn1:Function {name: "WikiPage", type: "function", language: "typescript", signature: "function WikiPage()"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1);
```
*/

import { PluginRouteHost } from '@/plugin-groups/route-host';

export default function WikiPage() {
  return <PluginRouteHost pathname="/wiki" expectedRouteId="wiki.editor" />;
}
