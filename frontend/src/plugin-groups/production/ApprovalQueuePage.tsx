/*
```cypher
CREATE
  (f:File {name: "ApprovalQueuePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ApprovalQueuePage", type: "module"}),
  (fn1:Function {name: "ApprovalQueuePage", type: "function", language: "typescript", signature: "function ApprovalQueuePage()"}),
  (v1:Variable {name: "queue", type: "variable"}),
  (v2:Variable {name: "approveIssue", type: "variable"}),
  (v3:Variable {name: "requestRevision", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3);
```
*/

'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import { useApproveIssue, useIssues, useRequestRevision } from '@/hooks/useProduction';
import {
  EmptyPanel,
  IssueRow,
  PageHeader,
} from '@/plugin-groups/production/ProductionPluginPrimitives';

export function ApprovalQueuePage() {
  const { data, isLoading } = useIssues({ page_size: 150 });
  const approveIssue = useApproveIssue();
  const requestRevision = useRequestRevision();
  const queue = (data?.data ?? []).filter((issue) =>
    ['submitted', 'internal_review', 'client_review'].includes(issue.status),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Art Director Approval Queue"
        subtitle={`${queue.length} issues pending decision`}
      />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-lg border border-surface-border bg-surface-secondary">
          {queue.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              actions={
                <div className="flex items-center gap-2">
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      requestRevision.mutate({
                        id: issue.id,
                        req: {
                          requester_name: 'Art Director',
                          reason: 'Revision required before approval',
                        },
                      })
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Revision
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() =>
                      approveIssue.mutate({
                        id: issue.id,
                        req: { approver_name: 'Art Director', scope: 'internal' },
                      })
                    }
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                </div>
              }
            />
          ))}
          {isLoading && <EmptyPanel title="Loading approvals" />}
          {!isLoading && queue.length === 0 && <EmptyPanel title="No pending approvals" />}
        </div>
      </div>
    </div>
  );
}

export default ApprovalQueuePage;
