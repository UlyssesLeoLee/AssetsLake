'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACCEPTED_MIME_TYPES } from '@/types/asset';

interface UploadZoneProps {
  onFile: (file: File) => void;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

export function UploadZone({ onFile }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-5 cursor-pointer',
          'transition-all duration-200',
          isDragActive && !isDragReject
            ? 'border-brand-500 bg-brand-500/5'
            : isDragReject
            ? 'border-red-500 bg-red-500/5'
            : 'border-surface-border hover:border-brand-500/50 hover:bg-brand-500/3 bg-surface-secondary'
        )}
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
            isDragActive && !isDragReject
              ? 'bg-brand-500/20'
              : 'bg-surface-elevated'
          )}
        >
          {isDragActive ? (
            <CloudUpload className="w-8 h-8 text-brand-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <div className="text-center">
          <p className="text-slate-200 font-semibold text-lg">
            {isDragActive && !isDragReject
              ? 'Drop to upload'
              : isDragReject
              ? 'File type not supported'
              : 'Drag & drop your asset'}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            or{' '}
            <span className="text-brand-400 hover:text-brand-300">browse files</span>
          </p>
          <p className="text-slate-600 text-xs mt-3">Max file size: 500 MB</p>
        </div>
      </div>

      {/* Accepted formats */}
      <div>
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          Supported Formats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(ACCEPTED_MIME_TYPES).map(([category, exts]) => (
            <div key={category} className="card-elevated p-3">
              <p className="text-xs font-semibold text-slate-300 mb-1">{category}</p>
              <p className="text-[11px] text-slate-500 font-mono">{exts.join(' ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
