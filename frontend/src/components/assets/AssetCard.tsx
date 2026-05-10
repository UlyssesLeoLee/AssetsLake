'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { AssetSummary } from '@/types/asset';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { formatBytes, formatRelative, isImageMime, TYPE_ICONS } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface AssetCardProps {
  asset: AssetSummary;
}

export function AssetCard({ asset }: AssetCardProps) {
  const isImage = isImageMime(asset.mime_type);
  const ext = asset.original_filename.split('.').pop()?.toUpperCase() ?? '';

  return (
    <Link
      href={`/assets/${asset.id}`}
      className="card group flex flex-col overflow-hidden hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-surface overflow-hidden">
        {isImage && asset.file_url ? (
          <Image
            src={asset.file_url}
            alt={asset.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-3xl">{TYPE_ICONS[asset.asset_type]}</span>
            <span className="text-xs font-mono text-slate-500 font-semibold tracking-wider">
              {ext}
            </span>
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={asset.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-sm font-semibold text-slate-100 truncate leading-snug">{asset.name}</p>
          <p className="text-xs text-slate-500 truncate font-mono">{asset.original_filename}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <TypeBadge type={asset.asset_type} size="xs" />
          <span className="text-xs text-slate-500">{formatBytes(asset.file_size)}</span>
        </div>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {asset.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag text-[10px]">
                {tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-[10px] text-slate-500">+{asset.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{asset.uploader}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{formatRelative(asset.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
