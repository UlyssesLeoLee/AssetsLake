/*
```cypher
CREATE
  (f:File {name: "UploadPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/asset-library/UploadPage", type: "module"}),
  (fn1:Function {name: "UploadPage", type: "function", language: "typescript", signature: "function UploadPage()"}),
  (fn2:Function {name: "handleFileDrop", type: "function", language: "typescript", signature: "(file: File) => void"}),
  (fn3:Function {name: "handleSubmit", type: "function", language: "typescript", signature: "async (payload: UploadPayload) => Promise<void>"}),
  (fn4:Function {name: "handleReset", type: "function", language: "typescript", signature: "() => void"}),
  (v1:Variable {name: "stage", type: "variable"}),
  (v2:Variable {name: "selectedFile", type: "variable"}),
  (v3:Variable {name: "progress", type: "variable"}),
  (v4:Variable {name: "result", type: "variable"}),
  (v5:Variable {name: "error", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1);
```
*/

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { UploadForm } from '@/components/upload/UploadForm';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { UploadSuccess } from '@/components/upload/UploadSuccess';
import { UploadZone } from '@/components/upload/UploadZone';
import { assetsApi } from '@/lib/api';
import type { UploadResult } from '@/types/asset';

type Stage = 'idle' | 'form' | 'uploading' | 'done';

export interface UploadPayload {
  file: File;
  name: string;
  description: string;
  tags: string[];
  uploader: string;
  projectId: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback((file: File) => {
    setSelectedFile(file);
    setStage('form');
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (payload: UploadPayload) => {
    if (!payload.file) return;

    setStage('uploading');
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('tags', payload.tags.join(','));
    formData.append('uploader', payload.uploader);
    if (payload.projectId) {
      formData.append('project_id', payload.projectId);
    }

    try {
      const uploadResult = await assetsApi.upload(formData, (pct) => setProgress(pct));
      setResult(uploadResult);
      setStage('done');
      toast.success('Asset uploaded successfully');
    } catch (e) {
      const msg = String(e);
      setError(msg);
      setStage('form');
      toast.error(msg);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStage('idle');
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload Asset</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload files to MinIO object storage with automatic type detection and metadata tagging.
        </p>
      </div>

      {stage === 'idle' && <UploadZone onFile={handleFileDrop} />}

      {stage === 'form' && selectedFile && (
        <UploadForm file={selectedFile} onSubmit={handleSubmit} onCancel={handleReset} error={error} />
      )}

      {stage === 'uploading' && <UploadProgress progress={progress} filename={selectedFile?.name ?? ''} />}

      {stage === 'done' && result && (
        <UploadSuccess
          result={result}
          onUploadAnother={handleReset}
          onView={() => router.push(`/assets/${result.asset_id}`)}
        />
      )}
    </div>
  );
}
