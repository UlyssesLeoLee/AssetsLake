/*
```cypher
CREATE
  (f:File {name: "page.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/app/security-audit/page", type: "module"}),
  (fn1:Function {name: "Page", type: "function", language: "typescript", signature: "export default function Page()"}),
  (v2:Variable {name: "dynamic", type: "variable"}),
  (v1:Variable {name: "AuthGate", type: "variable"}),
  (v3:Variable {name: "SecurityAuditPage", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:USES]->(v2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v3);
```
*/

import { AuthGate } from '@/components/auth/AuthGate';
import { SecurityAuditPage } from '@/plugin-groups/production/SecurityAuditPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AuthGate pathname="/security-audit" routeId="production.security-audit">
      <SecurityAuditPage />
    </AuthGate>
  );
}
