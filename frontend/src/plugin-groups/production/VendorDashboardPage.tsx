/*
```cypher
CREATE
  (f:File {name: "VendorDashboardPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/VendorDashboardPage", type: "module"}),
  (fn1:Function {name: "VendorDashboardPage", type: "function", language: "typescript", signature: "function VendorDashboardPage()"}),
  (v1:Variable {name: "vendorId", type: "variable"}),
  (v2:Variable {name: "issues", type: "variable"}),
  (v3:Variable {name: "submitted", type: "variable"}),
  (v4:Variable {name: "revisions", type: "variable"}),
  (v5:Variable {name: "approved", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5);
```
*/

'use client';

import { useState } from 'react';

import { useIssues } from '@/hooks/useProduction';
import {
  DEFAULT_VENDOR_ID,
  EmptyPanel,
  IssueRow,
  Metric,
  PageHeader,
} from '@/plugin-groups/production/ProductionPluginPrimitives';

export function VendorDashboardPage() {
  const [vendorId, setVendorId] = useState(DEFAULT_VENDOR_ID);
  const { data, isLoading } = useIssues({ vendor_id: vendorId || undefined, page_size: 150 });
  const issues = data?.data ?? [];
  const submitted = issues.filter((issue) => issue.status === 'submitted').length;
  const revisions = issues.filter((issue) => issue.status === 'revision_required').length;
  const approved = issues.filter((issue) => issue.status === 'approved').length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Assigned outsourcing production scope"
        actions={
          <input
            className="input w-80"
            value={vendorId}
            onChange={(event) => setVendorId(event.target.value)}
          />
        }
      />
      <div className="grid gap-4 p-5 md:grid-cols-3">
        <Metric label="Submitted" value={submitted} tone="text-cyan-300" />
        <Metric label="Revision" value={revisions} tone="text-amber-300" />
        <Metric label="Approved" value={approved} tone="text-emerald-300" />
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="rounded-lg border border-surface-border bg-surface-secondary">
          {(isLoading ? [] : issues).map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
          {!isLoading && issues.length === 0 && <EmptyPanel title="No assigned issues" />}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboardPage;
