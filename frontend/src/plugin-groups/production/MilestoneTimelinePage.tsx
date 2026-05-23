/*
```cypher
CREATE
  (f:File {name: "MilestoneTimelinePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/MilestoneTimelinePage", type: "module"}),
  (fn1:Function {name: "MilestoneTimelinePage", type: "function", language: "typescript", signature: "function MilestoneTimelinePage()"}),
  (v1:Variable {name: "data", type: "variable"}),
  (v2:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2);
```
*/

'use client';

import { useMilestones } from '@/hooks/useProduction';
import {
  DEFAULT_PROJECT_ID,
  EmptyPanel,
  formatDate,
  PageHeader,
} from '@/plugin-groups/production/ProductionPluginPrimitives';

export function MilestoneTimelinePage() {
  const { data = [], isLoading } = useMilestones(DEFAULT_PROJECT_ID);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Milestone Timeline" subtitle={`${data.length} project milestones`} />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="relative ml-4 border-l border-surface-border">
          {data.map((milestone) => (
            <div key={milestone.id} className="relative mb-5 pl-6">
              <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full border border-brand-300 bg-brand-500" />
              <div className="rounded-lg border border-surface-border bg-surface-secondary p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-100">{milestone.name}</h2>
                  <span className="rounded-md border border-slate-600 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                    {milestone.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{milestone.description}</p>
                <div className="mt-3 text-xs text-slate-500">{formatDate(milestone.due_date)}</div>
              </div>
            </div>
          ))}
          {isLoading && <EmptyPanel title="Loading milestones" />}
          {!isLoading && data.length === 0 && <EmptyPanel title="No milestones" />}
        </div>
      </div>
    </div>
  );
}

export default MilestoneTimelinePage;
