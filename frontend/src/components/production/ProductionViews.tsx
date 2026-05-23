/*
```cypher
CREATE
  (f:File {name: "ProductionViews.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/production/ProductionViews", type: "module"}),
  (v1:Variable {name: "KanbanBoardPage", type: "variable"}),
  (v2:Variable {name: "IssueDetailPage", type: "variable"}),
  (v3:Variable {name: "BriefEditorPage", type: "variable"}),
  (v4:Variable {name: "ReviewBoardPage", type: "variable"}),
  (v5:Variable {name: "VendorDashboardPage", type: "variable"}),
  (v6:Variable {name: "DeliveryPackagePage", type: "variable"}),
  (v7:Variable {name: "MilestoneTimelinePage", type: "variable"}),
  (v8:Variable {name: "ApprovalQueuePage", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8);
```
*/

export { ApprovalQueuePage } from '@/plugin-groups/production/ApprovalQueuePage';
export { BriefEditorPage } from '@/plugin-groups/production/BriefEditorPage';
export { DeliveryPackagePage } from '@/plugin-groups/production/DeliveryPackagePage';
export { IssueDetailPage } from '@/plugin-groups/production/IssueDetailPage';
export { KanbanBoardPage } from '@/plugin-groups/production/KanbanBoardPage';
export { MilestoneTimelinePage } from '@/plugin-groups/production/MilestoneTimelinePage';
export { ReviewBoardPage } from '@/plugin-groups/production/ReviewBoardPage';
export { VendorDashboardPage } from '@/plugin-groups/production/VendorDashboardPage';
