'use client';

import type { UploadResult } from '@/types/asset';
import { ASSET_TYPE_LABELS } from '@/types/asset';
import { formatBytes } from '@/lib/utils';
import { CheckCircle2, Eye, Upload, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadSuccessProps {
  result: UploadResult;
  onUploadAnother: () => void;
  onView: () => void;
}

export function UploadSuccess({ result, onUploadAnother, onView }: UploadSuccessProps) {
  const copyKey = () => {
    navigator.clipboard.writeText(result.object_key);
    toast.success('Object key copied');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="card p-8 flex flex-col items-center gap-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-1">Upload Complete</h2>
          <p className="text-slate-400 text-sm">
            Your asset has been stored in MinIO and registered in PostgreSQL.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onView} className="btn-primary">
            <Eye className="w-4 h-4" />
            View Asset
          </button>
          <button onClick={onUploadAnother} className="btn-secondary">
            <Upload className="w-4 h-4" />
            Upload Another
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Upload Details
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="Asset ID" value={result.asset_id} mono />
          <Detail label="Name" value={result.name} />
          <Detail label="Type" value={ASSET_TYPE_LABELS[result.asset_type]} />
          <Detail label="Size" value={formatBytes(result.file_size)} />
          <Detail label="Status" value={result.status} />
          <Detail label="Version" value={`v${result.version}`} />
          <Detail label="Bucket" value={result.bucket} mono />
        </div>

        <div className="mt-4 pt-4 border-t border-surface-border">
          <label className="label">MinIO Object Key</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs text-brand-300 bg-surface p-2.5 rounded border border-surface-border truncate font-mono">
              {result.object_key}
            </code>
            <button onClick={copyKey} className="btn-ghost p-2 shrink-0">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <p className={`text-slate-200 truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  );
}
