/*
```cypher
CREATE
  (f:File {name: "ReportsPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/ReportsPage", type: "module"}),
  (fn1:Function {name: "ReportsPage", type: "function", language: "typescript", signature: "function ReportsPage()"}),
  (v1:Variable {name: "reports", type: "variable"}),
  (v2:Variable {name: "reportModel", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2);
```
*/

'use client';

import { useProjectReports } from '@/hooks/useProjectManagement';
import {
  BurndownTrendPanel,
  CumulativeFlowPanel,
  CycleSlaPanel,
  DeliveryReadinessPanel,
  VelocityPanel,
} from '@/plugin-groups/production/ReportAnalyticsPrimitives';
import { buildReportsDashboardModel } from '@/plugin-groups/production/reportAnalyticsModel';
import {
  DEFAULT_PROJECT_ID,
  Metric,
  PageShell,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

export function ReportsPage() {
  const { data: reports } = useProjectReports(DEFAULT_PROJECT_ID);
  const reportModel = buildReportsDashboardModel(reports);

  return (
    <PageShell title="Reports" subtitle="Burndown, velocity, cumulative flow, cycle time, aging, SLA, and delivery readiness">
      <div className="grid gap-4 md:grid-cols-4">
        {reportModel.kpis.map((kpi) => (
          <Metric key={kpi.label} label={kpi.label} value={kpi.value} detail={kpi.detail} tone={kpi.tone} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <BurndownTrendPanel model={reportModel} />
        <VelocityPanel reports={reports} model={reportModel} />
        <CumulativeFlowPanel model={reportModel} />
        <CycleSlaPanel model={reportModel} />
        <DeliveryReadinessPanel reports={reports} model={reportModel} />
      </div>
    </PageShell>
  );
}

export default ReportsPage;
