/*
```cypher
CREATE
  (f:File {name: "EnterpriseAdminPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/EnterpriseAdminPage", type: "module"}),
  (fn1:Function {name: "EnterpriseAdminPage", type: "function", language: "typescript", signature: "function EnterpriseAdminPage()"}),
  (fn2:Function {name: "StatusBadge", type: "function", language: "typescript", signature: "function StatusBadge(props: { status: string })"}),
  (v1:Variable {name: "controls", type: "variable"}),
  (v2:Variable {name: "roles", type: "variable"}),
  (v3:Variable {name: "notifications", type: "variable"}),
  (v4:Variable {name: "importExport", type: "variable"}),
  (v5:Variable {name: "webhooks", type: "variable"}),
  (v6:Variable {name: "templates", type: "variable"}),
  (v7:Variable {name: "ciGates", type: "variable"}),
  (v8:Variable {name: "governanceModel", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8),
  (fn1)-[:CALLS]->(fn2);
```
*/

'use client';

import { Bell, FileJson, ShieldCheck, Workflow } from 'lucide-react';

import { useEnterpriseControls } from '@/hooks/useProjectManagement';
import { cn } from '@/lib/utils';
import {
  GovernanceReadinessPanel,
  GovernanceRiskPanel,
} from '@/plugin-groups/production/EnterpriseGovernancePrimitives';
import {
  DEFAULT_PROJECT_ID,
  Metric,
  PageShell,
  Panel,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';
import { buildEnterpriseGovernanceModel } from '@/plugin-groups/production/enterpriseGovernanceModel';

export function EnterpriseAdminPage() {
  const { data: controls } = useEnterpriseControls(DEFAULT_PROJECT_ID);
  const roles = controls?.roles ?? [];
  const notifications = controls?.notifications ?? [];
  const importExport = controls?.import_export ?? [];
  const webhooks = controls?.webhooks ?? [];
  const templates = controls?.templates ?? [];
  const ciGates = controls?.ci_gates ?? [];
  const governanceModel = buildEnterpriseGovernanceModel(controls);

  return (
    <PageShell title="Enterprise" subtitle="Roles, notifications, import/export, webhooks, templates, audit, and CI readiness">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Roles" value={roles.length} detail="project access policies" />
        <Metric label="Notifications" value={governanceModel.enabledNotificationCount} detail="enabled event rules" tone="text-cyan-300" />
        <Metric label="Integrations" value={governanceModel.webhookActiveCount} detail="active webhook events" tone="text-emerald-300" />
        <Metric label="CI Required" value={`${governanceModel.requiredCiPassing}/${governanceModel.requiredCiTotal}`} detail="required gates passing" tone="text-amber-300" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <GovernanceReadinessPanel model={governanceModel} />
        <GovernanceRiskPanel model={governanceModel} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Roles & Permissions" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.role} className="rounded-md border border-surface-border bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{role.role}</div>
                    <div className="mt-1 text-xs text-slate-500">{role.scope} scope / {role.member_count} members</div>
                  </div>
                  <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300">
                    {role.permissions.length} permissions
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span key={permission} className="badge border-slate-600 bg-slate-700/30 text-slate-300">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {roles.length === 0 && <div className="p-4 text-sm text-slate-500">Loading role controls</div>}
          </div>
        </Panel>

        <Panel title="Notifications & Audit" icon={<Bell className="h-4 w-4" />}>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.event} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-100">{notification.event}</div>
                  <StatusBadge status={notification.enabled ? 'enabled' : 'disabled'} />
                </div>
                <div className="mt-2 text-xs text-slate-500">{notification.delivery_policy}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {notification.channels.map((channel) => (
                    <span key={channel} className="badge border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {controls?.audit && (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="text-sm font-medium text-emerald-200">{controls.audit.policy}</div>
                <div className="mt-1 text-xs text-emerald-300">{controls.audit.retention_days} day retention</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {controls.audit.drilldowns.map((item) => (
                    <span key={item} className="badge border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel title="Import / Export" icon={<FileJson className="h-4 w-4" />}>
          <div className="space-y-3">
            {importExport.map((job) => (
              <div key={job.job_type} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-100">{job.job_type}</div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="mt-1 text-xs text-slate-500">{job.direction} / {job.format}</div>
                <div className="mt-2 text-sm text-slate-400">{job.description}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Webhooks" icon={<Workflow className="h-4 w-4" />}>
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.event} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-100">{webhook.event}</div>
                  <StatusBadge status={webhook.status} />
                </div>
                <div className="mt-1 truncate text-xs text-brand-300">{webhook.target}</div>
                <div className="mt-2 text-xs text-slate-500">{webhook.retry_policy}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Templates & CI Gates" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="space-y-4">
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.name} className="rounded-md border border-surface-border bg-slate-900/40 p-3">
                  <div className="text-sm font-semibold text-slate-100">{template.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{template.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.includes.map((item) => (
                      <span key={item} className="badge border-slate-600 bg-slate-700/30 text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-surface-border pt-4">
              {ciGates.map((gate) => (
                <div key={gate.name} className="flex items-center justify-between gap-3 rounded-md bg-slate-900/40 px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-100">{gate.name}</div>
                    <div className="truncate text-xs text-slate-500">{gate.command}</div>
                  </div>
                  <StatusBadge status={gate.status} />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'badge',
        status === 'passing' || status === 'ready' || status === 'active' || status === 'enabled'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : status === 'planned' || status === 'guarded'
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            : 'border-slate-600 bg-slate-700/30 text-slate-300'
      )}
    >
      {status}
    </span>
  );
}

export default EnterpriseAdminPage;
