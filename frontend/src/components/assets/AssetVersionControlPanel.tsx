/*
```cypher
CREATE
  (f:File {name: "AssetVersionControlPanel.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/assets/AssetVersionControlPanel", type: "module"}),
  (fn1:Function {name: "AssetVersionControlPanel", type: "function", language: "typescript", signature: "function AssetVersionControlPanel(props: { assetId: string; currentVersion: number })", visibility: "public"}),
  (fn2:Function {name: "CommitRow", type: "function", language: "typescript", signature: "function CommitRow(props: { version: AssetVersionSummary; active: boolean })", visibility: "private"}),
  (fn3:Function {name: "DiffRow", type: "function", language: "typescript", signature: "function DiffRow(props: { item: AssetVersionDiffItem })", visibility: "private"}),
  (fn4:Function {name: "formatDelta", type: "function", language: "typescript", signature: "function formatDelta(value: number): string", visibility: "private"}),
  (v1:Variable {name: "assetId", type: "variable"}),
  (v2:Variable {name: "currentVersion", type: "variable"}),
  (v3:Variable {name: "versions", type: "variable"}),
  (v4:Variable {name: "baseVersion", type: "variable"}),
  (v5:Variable {name: "headVersion", type: "variable"}),
  (v6:Variable {name: "diff", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6);
```
*/

'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Diff, GitBranch, GitCommit, History } from 'lucide-react';

import { useAssetVersionDiff, useAssetVersions } from '@/hooks/useAssets';
import { cn, formatBytes, formatDate } from '@/lib/utils';
import type { AssetVersionDiffItem, AssetVersionSummary } from '@/types/asset';

export function AssetVersionControlPanel({
  assetId,
  currentVersion,
}: {
  assetId: string;
  currentVersion: number;
}) {
  const { data: versions = [], isLoading } = useAssetVersions(assetId);
  const orderedVersions = useMemo(
    () => [...versions].sort((a, b) => b.version - a.version),
    [versions],
  );
  const latestVersion = orderedVersions[0]?.version ?? currentVersion;
  const initialBaseVersion =
    orderedVersions.length > 1
      ? orderedVersions[orderedVersions.length - 1].version
      : latestVersion;
  const [baseVersion, setBaseVersion] = useState<number | undefined>(undefined);
  const [headVersion, setHeadVersion] = useState<number | undefined>(undefined);
  const { data: diff } = useAssetVersionDiff(assetId, baseVersion, headVersion);

  useEffect(() => {
    if (orderedVersions.length === 0) return;
    setBaseVersion((value) => value ?? initialBaseVersion);
    setHeadVersion((value) => value ?? latestVersion);
  }, [initialBaseVersion, latestVersion, orderedVersions.length]);

  return (
    <section className="card mt-6 overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-surface-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <GitBranch className="h-4 w-4 text-brand-300" />
            Version Control
          </div>
          <p className="mt-1 text-xs text-slate-500">
            GitHub-style commits, branches, and version comparison for lake assets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-surface-border bg-surface px-2 py-1 font-mono text-xs text-brand-200">
            {orderedVersions[0]?.branch_name ?? 'main'}
          </span>
          <span className="rounded-md border border-surface-border bg-surface px-2 py-1 text-xs text-slate-300">
            v{currentVersion}
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div
          role="region"
          aria-label="Commit Timeline"
          className="border-b border-surface-border p-5 lg:border-b-0 lg:border-r"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <History className="h-4 w-4 text-slate-400" />
              Commit Timeline
            </div>
            <span className="text-xs text-slate-500">{orderedVersions.length} commits</span>
          </div>

          <div className="space-y-2">
            {isLoading && (
              <div className="rounded-lg border border-surface-border bg-surface p-3 text-sm text-slate-500">
                Loading versions
              </div>
            )}
            {!isLoading && orderedVersions.length === 0 && (
              <div className="rounded-lg border border-surface-border bg-surface p-3 text-sm text-slate-500">
                No version commits yet
              </div>
            )}
            {orderedVersions.map((version) => (
              <CommitRow
                key={version.id}
                version={version}
                active={version.version === currentVersion}
              />
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="flex-1">
              <span className="label">Base</span>
              <select
                className="input"
                value={baseVersion ?? ''}
                onChange={(event) => setBaseVersion(Number(event.target.value))}
              >
                {orderedVersions.map((version) => (
                  <option key={version.id} value={version.version}>
                    v{version.version} / {version.commit_sha}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="label">Head</span>
              <select
                className="input"
                value={headVersion ?? ''}
                onChange={(event) => setHeadVersion(Number(event.target.value))}
              >
                {orderedVersions.map((version) => (
                  <option key={version.id} value={version.version}>
                    v{version.version} / {version.commit_sha}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 rounded-lg border border-surface-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <Diff className="h-4 w-4 text-brand-300" />
                Compare
              </div>
              <span className="font-mono text-xs text-slate-400">
                {diff ? `${diff.base.commit_sha}...${diff.head.commit_sha}` : 'select versions'}
              </span>
            </div>

            {diff ? (
              <div className="p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
                    <div className="text-xs uppercase text-slate-500">Size Delta</div>
                    <div className="mt-1 font-mono text-sm text-slate-100">
                      {formatDelta(diff.file_size_delta)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
                    <div className="text-xs uppercase text-slate-500">Checksum</div>
                    <div
                      className={cn(
                        'mt-1 text-sm',
                        diff.checksum_changed ? 'text-amber-300' : 'text-emerald-300',
                      )}
                    >
                      {diff.checksum_changed ? 'changed' : 'unchanged'}
                    </div>
                  </div>
                  <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
                    <div className="text-xs uppercase text-slate-500">Object</div>
                    <div
                      className={cn(
                        'mt-1 text-sm',
                        diff.object_changed ? 'text-amber-300' : 'text-emerald-300',
                      )}
                    >
                      {diff.object_changed ? 'changed' : 'unchanged'}
                    </div>
                  </div>
                </div>
                <div className="mt-4 divide-y divide-surface-border overflow-hidden rounded-lg border border-surface-border">
                  {diff.changes.map((item) => (
                    <DiffRow key={item.field} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-sm text-slate-500">Select two versions to compare.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommitRow({ version, active }: { version: AssetVersionSummary; active: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3',
        active ? 'border-brand-400/40 bg-brand-500/10' : 'border-surface-border bg-surface',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-slate-400" />
            <span className="font-mono text-xs text-brand-200">{version.commit_sha}</span>
            {active && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
          </div>
          <div className="mt-1 truncate text-sm font-medium text-slate-100">
            {version.change_note || `Asset version ${version.version}`}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {version.uploader} / {formatDate(version.created_at)}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-xs text-slate-300">v{version.version}</div>
          <div className="mt-1 text-xs text-slate-500">{formatBytes(version.file_size)}</div>
        </div>
      </div>
    </div>
  );
}

function DiffRow({ item }: { item: AssetVersionDiffItem }) {
  return (
    <div className="grid gap-2 bg-surface-elevated px-3 py-2 text-xs md:grid-cols-[120px_1fr_1fr]">
      <span className={cn('font-medium', item.changed ? 'text-amber-300' : 'text-slate-500')}>
        {item.field}
      </span>
      <code className="truncate rounded bg-surface px-2 py-1 font-mono text-slate-400">
        {item.before}
      </code>
      <code className="truncate rounded bg-surface px-2 py-1 font-mono text-slate-200">
        {item.after}
      </code>
    </div>
  );
}

function formatDelta(value: number): string {
  if (value === 0) return '0 B';
  return `${value > 0 ? '+' : '-'}${formatBytes(Math.abs(value))}`;
}
