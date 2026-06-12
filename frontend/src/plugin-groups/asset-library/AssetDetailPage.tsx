/*
```cypher
CREATE
  (f:File {name: "AssetDetailPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/asset-library/AssetDetailPage", type: "module"}),
  (fn1:Function {name: "AssetDetailPage", type: "function", language: "typescript", signature: "function AssetDetailPage()"}),
  (fn2:Function {name: "handleDelete", type: "function", language: "typescript", signature: "async () => Promise<void>"}),
  (fn3:Function {name: "InfoRow", type: "function", language: "typescript", signature: "function InfoRow(props: { label: string; value: string; mono?: boolean })"}),
  (fn4:Function {name: "ExtensionStub", type: "function", language: "typescript", signature: "function ExtensionStub(props: { title: string; status: string; active: boolean; description: string })"}),
  (fn5:Function {name: "AssetVersionControlPanel", type: "function", language: "typescript", signature: "function AssetVersionControlPanel(props: { assetId: string; currentVersion: number })"}),
  (v1:Variable {name: "id", type: "variable"}),
  (v2:Variable {name: "asset", type: "variable"}),
  (v3:Variable {name: "deleteMutation", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v3);
```
*/

'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, ExternalLink, Trash2 } from 'lucide-react';

import { AssetAiInsightPanel } from '@/components/assets/AssetAiInsightPanel';
import { AssetMetaPanel } from '@/components/assets/AssetMetaPanel';
import { AssetPreview } from '@/components/assets/AssetPreview';
import { AssetVersionControlPanel } from '@/components/assets/AssetVersionControlPanel';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { useAsset, useDeleteAsset } from '@/hooks/useAssets';
import { formatBytes } from '@/lib/utils';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const { data: asset, isLoading, isError } = useAsset(id);
  const deleteMutation = useDeleteAsset();

  const handleDelete = async () => {
    if (!confirm('Delete this asset? This action is reversible via database restore only.')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Asset deleted');
      router.push('/assets');
    } catch (e) {
      toast.error(String(e));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="font-medium text-red-400">Asset not found</p>
        <Link href="/assets" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/assets" className="transition-colors hover:text-slate-200">
          Asset Library
        </Link>
        <span>/</span>
        <span className="max-w-xs truncate text-slate-200">{asset.name}</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <TypeBadge type={asset.asset_type} />
            <StatusBadge status={asset.status} />
            <span className="font-mono text-xs text-slate-500">v{asset.version}</span>
          </div>
          <h1 className="truncate text-2xl font-bold text-white">{asset.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{asset.original_filename}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={asset.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-secondary text-red-400 hover:border-red-500/30 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssetPreview asset={asset} />
        </div>
        <div>
          <AssetMetaPanel asset={asset} />
        </div>
      </div>

      <AssetVersionControlPanel assetId={asset.id} currentVersion={asset.version} />
      <AssetAiInsightPanel assetId={asset.id} />

      <div className="card mt-6 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Storage Reference
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoRow label="Bucket" value={asset.bucket} mono />
          <InfoRow label="Object Key" value={asset.object_key} mono />
          <InfoRow label="File Size" value={formatBytes(asset.file_size)} />
          <InfoRow label="MIME Type" value={asset.mime_type} mono />
          {asset.checksum_sha256 && (
            <InfoRow label="SHA-256" value={`${asset.checksum_sha256.slice(0, 16)}...`} mono />
          )}
          <InfoRow label="Version" value={`v${asset.version}`} />
        </div>
        <div className="mt-4 border-t border-surface-border pt-4">
          <label className="label">File URL</label>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-surface-border bg-surface p-2 font-mono text-xs text-slate-300">
              {asset.file_url}
            </code>
            <a
              href={asset.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ExtensionStub
          title="Qdrant Vector Index"
          status={asset.embedding_id ? 'indexed' : 'not indexed'}
          active={!!asset.embedding_id}
          description="Image similarity search via vector embeddings"
        />
        <ExtensionStub
          title="OpenSearch Index"
          status={asset.search_doc_id ? 'indexed' : 'not indexed'}
          active={!!asset.search_doc_id}
          description="Full-text tag and metadata search"
        />
        <ExtensionStub
          title="Neo4j Graph Node"
          status={asset.graph_node_id ? 'connected' : 'not connected'}
          active={!!asset.graph_node_id}
          description="Asset dependency graph relationships"
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <p className={`truncate text-sm text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function ExtensionStub({
  title,
  status,
  active,
  description,
}: {
  title: string;
  status: string;
  active: boolean;
  description: string;
}) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300">{title}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}
