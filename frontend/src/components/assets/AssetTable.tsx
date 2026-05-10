'use client';

import Link from 'next/link';
import type { AssetSummary } from '@/types/asset';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { formatBytes, formatDate, TYPE_ICONS } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface AssetTableProps {
  assets: AssetSummary[];
}

export function AssetTable({ assets }: AssetTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border bg-surface-elevated">
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
              Asset
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden md:table-cell">
              Tags
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden lg:table-cell">
              Size
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden lg:table-cell">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden xl:table-cell">
              Uploader
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden xl:table-cell">
              Created
            </th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className="hover:bg-surface-elevated/50 transition-colors duration-100 group"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-base shrink-0">
                    {TYPE_ICONS[asset.asset_type]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100 truncate max-w-[180px]">{asset.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[180px] font-mono">
                      {asset.original_filename}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <TypeBadge type={asset.asset_type} size="xs" />
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex gap-1 flex-wrap max-w-[160px]">
                  {asset.tags.slice(0, 2).map((t) => (
                    <span key={t} className="tag text-[10px]">
                      {t}
                    </span>
                  ))}
                  {asset.tags.length > 2 && (
                    <span className="text-[10px] text-slate-500">+{asset.tags.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-slate-400 tabular-nums">
                {formatBytes(asset.file_size)}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <StatusBadge status={asset.status} size="sm" />
              </td>
              <td className="px-4 py-3 hidden xl:table-cell text-slate-400">
                {asset.uploader}
              </td>
              <td className="px-4 py-3 hidden xl:table-cell text-slate-500 text-xs tabular-nums">
                {formatDate(asset.created_at)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/assets/${asset.id}`}
                  className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 transition-opacity"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
