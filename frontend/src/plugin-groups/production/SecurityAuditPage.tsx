/*
```cypher
CREATE
  (f:File {name: "SecurityAuditPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/SecurityAuditPage", type: "module"}),
  (fn1:Function {name: "SecurityAuditPage", type: "function", language: "typescript", signature: "function SecurityAuditPage()"}),
  (fn2:Function {name: "formatTimestamp", type: "function", language: "typescript", signature: "function formatTimestamp(value: string): string"}),
  (fn3:Function {name: "diffString", type: "function", language: "typescript", signature: "function diffString(event: SecurityAuditEvent, key: string): string"}),
  (fn4:Function {name: "metadataSummary", type: "function", language: "typescript", signature: "function metadataSummary(event: SecurityAuditEvent): string"}),
  (fn5:Function {name: "valueText", type: "function", language: "typescript", signature: "function valueText(value: unknown): string"}),
  (fn6:Function {name: "eventToneClass", type: "function", language: "typescript", signature: "function eventToneClass(event: SecurityAuditEvent): string"}),
  (fn7:Function {name: "shortId", type: "function", language: "typescript", signature: "function shortId(value: string): string"}),
  (v1:Variable {name: "ACTION_OPTIONS", type: "variable"}),
  (v2:Variable {name: "OUTCOME_OPTIONS", type: "variable"}),
  (v3:Variable {name: "ENTITY_OPTIONS", type: "variable"}),
  (v4:Variable {name: "filters", type: "variable"}),
  (v5:Variable {name: "events", type: "variable"}),
  (v6:Variable {name: "query", type: "variable"}),
  (v7:Variable {name: "securityAuditApi", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn4)-[:CALLS]->(fn5);
```
*/

'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Database, RefreshCw, ShieldCheck } from 'lucide-react';

import {
  securityAuditApi,
  type SecurityAuditEvent,
  type SecurityAuditQuery,
} from '@/lib/securityAuditApi';
import { cn } from '@/lib/utils';
import {
  Metric,
  PageShell,
  Panel,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';

const ACTION_OPTIONS = [
  '',
  'auth_failed',
  'rbac_denied',
  'asset_uploaded',
  'asset_deleted',
  'asset_content_accessed',
  'asset_downloaded',
  'asset_content_denied',
] as const;

const OUTCOME_OPTIONS = ['', 'success', 'denied'] as const;
const ENTITY_OPTIONS = ['', 'security', 'asset'] as const;

export function SecurityAuditPage() {
  const [filters, setFilters] = useState<SecurityAuditQuery>({ limit: 100 });
  const query = useMemo(
    () => ({
      limit: filters.limit ?? 100,
      action: filters.action,
      outcome: filters.outcome,
      entity_type: filters.entity_type,
    }),
    [filters.action, filters.entity_type, filters.limit, filters.outcome],
  );

  const {
    data: events = [],
    error,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['security-audit-events', query],
    queryFn: () => securityAuditApi.list(query),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });

  const deniedEvents = events.filter((event) => diffString(event, 'outcome') === 'denied');
  const assetEvents = events.filter((event) => event.entity_type === 'asset');
  const accessEvents = events.filter(
    (event) => event.action.includes('content') || event.action.includes('download'),
  );

  return (
    <PageShell
      title="Security Audit"
      subtitle="RBAC denials, asset access, signed download, and storage security audit trail"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Loaded Events" value={events.length} detail="latest audit rows" />
        <Metric
          label="Denied"
          value={deniedEvents.length}
          detail="auth and RBAC blocks"
          tone="text-amber-300"
        />
        <Metric
          label="Asset Events"
          value={assetEvents.length}
          detail="storage and object access"
          tone="text-emerald-300"
        />
        <Metric
          label="Content Access"
          value={accessEvents.length}
          detail="preview and download reads"
          tone="text-cyan-300"
        />
      </div>

      <section className="mt-5 rounded-lg border border-surface-border bg-surface-secondary/90 px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-xs text-slate-500">
            Action
            <select
              className="h-9 rounded-md border border-surface-border bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-brand-400"
              value={filters.action ?? ''}
              onChange={(event) =>
                setFilters((current) => ({ ...current, action: event.target.value || undefined }))
              }
            >
              {ACTION_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'all actions'}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs text-slate-500">
            Outcome
            <select
              className="h-9 rounded-md border border-surface-border bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-brand-400"
              value={filters.outcome ?? ''}
              onChange={(event) =>
                setFilters((current) => ({ ...current, outcome: event.target.value || undefined }))
              }
            >
              {OUTCOME_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'all outcomes'}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs text-slate-500">
            Entity
            <select
              className="h-9 rounded-md border border-surface-border bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-brand-400"
              value={filters.entity_type ?? ''}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  entity_type: event.target.value || undefined,
                }))
              }
            >
              {ENTITY_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'all entities'}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs text-slate-500">
            Limit
            <input
              className="h-9 w-24 rounded-md border border-surface-border bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-brand-400"
              min={10}
              max={200}
              step={10}
              type="number"
              value={filters.limit ?? 100}
              onChange={(event) =>
                setFilters((current) => ({ ...current, limit: Number(event.target.value) || 100 }))
              }
            />
          </label>

          <button
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-md border border-brand-500/40 bg-brand-500/10 px-3 text-sm font-medium text-brand-200 transition hover:bg-brand-500/20 disabled:opacity-60"
            disabled={isFetching}
            type="button"
            onClick={() => void refetch()}
          >
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </section>

      <div className="mt-5">
        <Panel title="Audit Events" icon={<ShieldCheck className="h-4 w-4" />}>
          {error instanceof Error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              {error.message}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-left text-sm">
              <thead className="border-b border-surface-border text-xs uppercase text-slate-500">
                <tr>
                  <th className="w-40 px-3 py-2 font-medium">Time</th>
                  <th className="w-44 px-3 py-2 font-medium">Action</th>
                  <th className="w-28 px-3 py-2 font-medium">Outcome</th>
                  <th className="w-40 px-3 py-2 font-medium">Actor</th>
                  <th className="w-44 px-3 py-2 font-medium">Entity</th>
                  <th className="w-56 px-3 py-2 font-medium">Request</th>
                  <th className="min-w-64 px-3 py-2 font-medium">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {events.map((event) => (
                  <tr key={event.id} className="align-top transition hover:bg-slate-900/50">
                    <td className="px-3 py-3 text-xs text-slate-400">
                      {formatTimestamp(event.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('badge', eventToneClass(event))}>{event.action}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{diffString(event, 'outcome')}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-100">{event.actor ?? 'system'}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {diffString(event, 'actor_role')}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 text-slate-100">
                        <Database className="h-3.5 w-3.5 text-slate-500" />
                        {event.entity_type}
                      </div>
                      <div className="mt-1 font-mono text-xs text-slate-500">
                        {shortId(event.entity_id)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-slate-400">
                        {diffString(event, 'method')} {diffString(event, 'path')}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {diffString(event, 'client_ip')}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-400">{metadataSummary(event)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && <div className="p-4 text-sm text-slate-500">Loading audit events</div>}
            {!isLoading && events.length === 0 && (
              <div className="p-4 text-sm text-slate-500">
                No audit events match the current filters
              </div>
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value));
}

function diffString(event: SecurityAuditEvent, key: string): string {
  const value = event.diff?.[key];
  return typeof value === 'string' && value.trim() ? value : '-';
}

function metadataSummary(event: SecurityAuditEvent): string {
  const metadata = event.diff?.metadata;
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return '-';
  }

  const summary = Object.entries(metadata as Record<string, unknown>)
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${valueText(value)}`)
    .join(' / ');

  return summary || '-';
}

function valueText(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

function eventToneClass(event: SecurityAuditEvent): string {
  if (diffString(event, 'outcome') === 'denied') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  }
  if (event.entity_type === 'asset') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  }
  return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
}

function shortId(value: string): string {
  return value.length > 12 ? `${value.slice(0, 8)}...${value.slice(-4)}` : value;
}

export default SecurityAuditPage;
