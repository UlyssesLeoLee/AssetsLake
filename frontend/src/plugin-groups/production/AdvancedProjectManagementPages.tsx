/*
```cypher
CREATE
  (f:File {name: "AdvancedProjectManagementPages.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/AdvancedProjectManagementPages", type: "module"}),
  (v1:Variable {name: "GanttPage", type: "variable"}),
  (v2:Variable {name: "CalendarPage", type: "variable"}),
  (v3:Variable {name: "ReportsPage", type: "variable"}),
  (v4:Variable {name: "WorkflowPage", type: "variable"}),
  (v5:Variable {name: "AutomationPage", type: "variable"}),
  (v6:Variable {name: "EnterpriseAdminPage", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6);
```
*/

export { AutomationPage } from '@/plugin-groups/production/AutomationPage';
export { CalendarPage } from '@/plugin-groups/production/CalendarPage';
export { EnterpriseAdminPage } from '@/plugin-groups/production/EnterpriseAdminPage';
export { GanttPage } from '@/plugin-groups/production/GanttPage';
export { ReportsPage } from '@/plugin-groups/production/ReportsPage';
export { WorkflowPage } from '@/plugin-groups/production/WorkflowPage';
