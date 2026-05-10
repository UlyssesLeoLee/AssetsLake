'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAsset, useUpdateAsset, useDeleteAsset } from '@/hooks/useAssets';
import { AssetPreview } from '@/components/assets/AssetPreview';
import { AssetMetaPanel } from '@/components/assets/AssetMetaPanel';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { formatBytes, formatDate } from '@/lib/utils';
import { ArrowLeft, Download, Trash2, Edit3, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
        <p className="text-red-400 font-medium">Asset not found</p>
        <Link href="/assets" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/assets" className="hover:text-slate-200 transition-colors">
          Asset Library
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate max-w-xs">{asset.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <TypeBadge type={asset.asset_type} />
            <StatusBadge status={asset.status} />
            <span className="text-xs text-slate-500 font-mono">v{asset.version}</span>
          </div>
          <h1 className="text-2xl font-bold text-white truncate">{asset.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{asset.original_filename}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={asset.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-secondary text-red-400 hover:text-red-300 hover:border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <AssetPreview asset={asset} />
        </div>

        {/* Metadata panel */}
        <div>
          <AssetMetaPanel asset={asset} />
        </div>
      </div>

      {/* Storage info */}
      <div className="mt-6 card p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
          Storage Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Bucket" value={asset.bucket} mono />
          <InfoRow label="Object Key" value={asset.object_key} mono />
          <InfoRow label="File Size" value={formatBytes(asset.file_size)} />
          <InfoRow label="MIME Type" value={asset.mime_type} mono />
          {asset.checksum_sha256 && (
            <InfoRow
              label="SHA-256"
              value={`${asset.checksum_sha256.slice(0, 16)}…`}
              mono
            />
          )}
          <InfoRow label="Version" value={`v${asset.version}`} />
        </div>
        <div className="mt-4 pt-4 border-t border-surface-border">
          <label className="label">File URL</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs text-slate-300 bg-surface p-2 rounded border border-surface-border truncate font-mono">
              {asset.file_url}
            </code>
            <a
              href={asset.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* AI / Search extensions placeholder */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <p className={`text-sm text-slate-200 truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-300">{title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            active
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-500/20 text-slate-400'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}
