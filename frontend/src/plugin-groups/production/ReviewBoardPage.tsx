/*
```cypher
CREATE
  (f:File {name: "ReviewBoardPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ReviewBoardPage", type: "module"}),
  (fn1:Function {name: "ReviewBoardPage", type: "function", language: "typescript", signature: "function ReviewBoardPage()"}),
  (v1:Variable {name: "reviewIssues", type: "variable"}),
  (v2:Variable {name: "internal", type: "variable"}),
  (v3:Variable {name: "client", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3);
```
*/

'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import { useIssues } from '@/hooks/useProduction';
import { PageHeader, ReviewLane } from '@/plugin-groups/production/ProductionPluginPrimitives';

export function ReviewBoardPage() {
  const { data, isLoading } = useIssues({ page_size: 150 });
  const reviewIssues = (data?.data ?? []).filter((issue) =>
    ['submitted', 'internal_review', 'client_review', 'revision_required'].includes(issue.status)
  );
  const internal = reviewIssues.filter((issue) =>
    ['submitted', 'internal_review', 'revision_required'].includes(issue.status)
  );
  const client = reviewIssues.filter((issue) => issue.status === 'client_review');

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Review Board"
        subtitle={`${reviewIssues.length} issues in review flow`}
        actions={
          <Link href="/approvals" className="btn-secondary">
            <ShieldCheck className="h-4 w-4" />
            Approvals
          </Link>
        }
      />
      <div className="grid flex-1 gap-4 overflow-y-auto p-5 xl:grid-cols-2">
        <ReviewLane title="Internal Review" issues={internal} loading={isLoading} />
        <ReviewLane title="Client Review" issues={client} loading={isLoading} />
      </div>
    </div>
  );
}

export default ReviewBoardPage;
