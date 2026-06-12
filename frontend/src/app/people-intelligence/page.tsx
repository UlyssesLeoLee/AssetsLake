/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/people-intelligence/page", type: "module"}),
  (fn1:Function {name: "PeopleIntelligenceRoute", type: "function", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1);
```
*/

import { PluginRouteHost } from '@/plugin-groups/route-host';

export default function PeopleIntelligenceRoute() {
  return <PluginRouteHost pathname="/people-intelligence" expectedRouteId="people.intelligence" />;
}
