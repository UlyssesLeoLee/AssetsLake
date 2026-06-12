'use client';

import type { Asset } from '@/types/asset';
import { ASSET_TYPE_LABELS, ASSET_STATUS_LABELS } from '@/types/asset';
import { formatBytes, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';

interface AssetMetaPanelProps {
  asset: Asset;
}

export function AssetMetaPanel({ asset }: AssetMetaPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Description */}
      {asset.description && (
        <div className="card p-4">
          <label className="label">Description</label>
          <p className="text-sm text-slate-300 leading-relaxed">{asset.description}</p>
        </div>
      )}

      {/* Core metadata */}
      <div className="card p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Asset Info
        </h2>
        <div className="flex flex-col gap-3">
          <MetaRow label="Type">
            <TypeBadge type={asset.asset_type} size="xs" />
          </MetaRow>
          <MetaRow label="Status">
            <StatusBadge status={asset.status} size="sm" />
          </MetaRow>
          <MetaRow label="Version">
            <span className="text-sm font-mono text-slate-200">v{asset.version}</span>
          </MetaRow>
          <MetaRow label="Uploader">
            <span className="text-sm text-slate-200">{asset.uploader}</span>
          </MetaRow>
          <MetaRow label="Created">
            <span className="text-sm text-slate-200">{formatDate(asset.created_at)}</span>
          </MetaRow>
          <MetaRow label="Updated">
            <span className="text-sm text-slate-200">{formatDate(asset.updated_at)}</span>
          </MetaRow>
        </div>
      </div>

      {/* Tags */}
      {(asset.tags.length > 0 || asset.ai_tags.length > 0) && (
        <div className="card p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Tags
          </h2>
          {asset.tags.length > 0 && (
            <div className="mb-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5 block">
                Manual
              </label>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {asset.ai_tags.length > 0 && (
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5 block">
                AI Generated
              </label>
              <div className="flex flex-wrap gap-1.5">
                {asset.ai_tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review info */}
      {(asset.reviewed_at || asset.review_note) && (
        <div className="card p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Review
          </h2>
          {asset.reviewed_at && (
            <MetaRow label="Reviewed At">
              <span className="text-sm text-slate-200">{formatDate(asset.reviewed_at)}</span>
            </MetaRow>
          )}
          {asset.review_note && (
            <div className="mt-2">
              <label className="label">Note</label>
              <p className="text-sm text-slate-300">{asset.review_note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}
