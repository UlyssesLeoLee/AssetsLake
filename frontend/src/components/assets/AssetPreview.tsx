'use client';

import Image from 'next/image';
import type { Asset } from '@/types/asset';
import { isImageMime, isVideoMime, isAudioMime, TYPE_ICONS } from '@/lib/utils';
import { Download, ExternalLink } from 'lucide-react';

interface AssetPreviewProps {
  asset: Asset;
}

export function AssetPreview({ asset }: AssetPreviewProps) {
  const isImage = isImageMime(asset.mime_type);
  const isVideo = isVideoMime(asset.mime_type);
  const isAudio = isAudioMime(asset.mime_type);
  const ext = asset.original_filename.split('.').pop()?.toUpperCase() ?? '';

  return (
    <div className="card overflow-hidden">
      <div className="relative min-h-64 bg-surface flex items-center justify-center">
        {isImage ? (
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              src={asset.file_url}
              alt={asset.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : isVideo ? (
          <video
            src={asset.file_url}
            controls
            className="w-full max-h-96"
          >
            Your browser does not support video playback.
          </video>
        ) : isAudio ? (
          <div className="w-full p-8 flex flex-col items-center gap-4">
            <span className="text-5xl">{TYPE_ICONS[asset.asset_type]}</span>
            <audio src={asset.file_url} controls className="w-full">
              Your browser does not support audio playback.
            </audio>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12 px-6">
            <span className="text-6xl">{TYPE_ICONS[asset.asset_type]}</span>
            <div className="text-center">
              <p className="text-slate-300 font-semibold">{ext} File</p>
              <p className="text-slate-500 text-sm mt-1">
                No preview available for this file type
              </p>
            </div>
            <a
              href={asset.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2"
            >
              <Download className="w-4 h-4" />
              Download File
            </a>
          </div>
        )}
      </div>

      {/* Actions bar */}
      <div className="px-4 py-3 border-t border-surface-border flex items-center gap-3">
        <a
          href={asset.file_url}
          download={asset.original_filename}
          className="btn-secondary text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
        <a
          href={asset.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in MinIO
        </a>
      </div>
    </div>
  );
}
