'use client';

import type { AssetFilters, AssetStatus, AssetType } from '@/types/asset';
import { ASSET_TYPE_LABELS, ASSET_STATUS_LABELS } from '@/types/asset';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface AssetFiltersPanelProps {
  filters: AssetFilters;
  onChange: (filters: Partial<AssetFilters>) => void;
}

const ASSET_TYPES: AssetType[] = [
  '3d_model',
  'texture',
  'concept_art',
  'audio',
  'video',
  'document',
  'animation',
  'vfx',
  'archive',
  'other',
];

const ASSET_STATUSES: AssetStatus[] = [
  'pending',
  'active',
  'archived',
  'rejected',
  'processing',
];

export function AssetFiltersPanel({ filters, onChange }: AssetFiltersPanelProps) {
  const hasActiveFilters =
    filters.asset_type || filters.status || filters.tag || filters.project_id;

  return (
    <div className="flex flex-col gap-5">
      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() =>
            onChange({ asset_type: '', status: '', tag: '', project_id: '' })
          }
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}

      {/* Asset Type */}
      <div>
        <h3 className="label mb-2">Asset Type</h3>
        <div className="flex flex-col gap-0.5">
          {ASSET_TYPES.map((type) => (
            <button
              key={type}
              onClick={() =>
                onChange({ asset_type: filters.asset_type === type ? '' : type })
              }
              className={cn(
                'text-left px-2.5 py-1.5 rounded-md text-xs transition-colors duration-100',
                filters.asset_type === type
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
              )}
            >
              {ASSET_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="label mb-2">Status</h3>
        <div className="flex flex-col gap-0.5">
          {ASSET_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() =>
                onChange({ status: filters.status === status ? '' : status })
              }
              className={cn(
                'text-left px-2.5 py-1.5 rounded-md text-xs transition-colors duration-100',
                filters.status === status
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
              )}
            >
              {ASSET_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
