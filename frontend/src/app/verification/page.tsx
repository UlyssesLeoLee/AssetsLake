/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/verification/page", type: "module"}),
  (fn1:Function {name: "VerificationPage", type: "function", language: "typescript", signature: "function VerificationPage()"}),
  (v1:Variable {name: "VerificationAppPage", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1);
```
*/

import VerificationAppPage from '@/plugin-groups/identity-verification/VerificationAppPage';

export default function VerificationPage() {
  return <VerificationAppPage />;
}
