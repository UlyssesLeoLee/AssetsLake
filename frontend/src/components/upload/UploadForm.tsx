'use client';

import { useState, KeyboardEvent } from 'react';
import { formatBytes } from '@/lib/utils';
import { X, Plus, FileIcon, AlertCircle } from 'lucide-react';
import type { UploadPayload } from '@/plugin-groups/asset-library/UploadPage';

interface UploadFormProps {
  file: File;
  onSubmit: (payload: UploadPayload) => void;
  onCancel: () => void;
  error: string | null;
}

export function UploadForm({ file, onSubmit, onCancel, error }: UploadFormProps) {
  const defaultName = file.name.replace(/\.[^/.]+$/, '');
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState('');
  const [uploader, setUploader] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ file, name, description, tags, uploader, projectId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* File info */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
          <FileIcon className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatBytes(file.size)} · {file.type || 'unknown MIME'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost p-1.5 text-slate-500 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/25">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Form fields */}
      <div className="card p-5 flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="label">Asset Name *</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Dragon Character Rig"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this asset…"
          />
        </div>

        {/* Uploader */}
        <div>
          <label className="label">Uploader / Artist</label>
          <input
            className="input"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            placeholder="e.g. john.doe"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              className="input flex-1"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tag and press Enter…"
            />
            <button type="button" onClick={addTag} className="btn-secondary px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="tag flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    className="text-brand-400 hover:text-brand-200 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary px-6">
          Upload Asset
        </button>
      </div>
    </form>
  );
}
