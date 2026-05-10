'use client';

import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  filename: string;
}

export function UploadProgress({ progress, filename }: UploadProgressProps) {
  return (
    <div className="card p-8 flex flex-col items-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-500/15 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-brand-400 animate-spin" />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-1">Uploading…</h2>
        <p className="text-sm text-slate-400 truncate max-w-sm">{filename}</p>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Progress</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Storing in MinIO and writing metadata to PostgreSQL…
      </div>
    </div>
  );
}
