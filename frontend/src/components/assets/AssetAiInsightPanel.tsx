/*
```cypher
CREATE
  (f:File {name: "AssetAiInsightPanel.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/assets/AssetAiInsightPanel", type: "module"}),
  (fn1:Function {name: "AssetAiInsightPanel", type: "function", language: "typescript", signature: "function AssetAiInsightPanel(props: { assetId: string })"}),
  (fn2:Function {name: "handleAnalyze", type: "function", language: "typescript", signature: "async function handleAnalyze(): Promise<void>"}),
  (fn3:Function {name: "InsightPills", type: "function", language: "typescript", signature: "function InsightPills(props: { items: string[]; empty: string })"}),
  (v1:Variable {name: "assetId", type: "variable"}),
  (v2:Variable {name: "insights", type: "variable"}),
  (v3:Variable {name: "latest", type: "variable"}),
  (v4:Variable {name: "analyzeMutation", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v4);
```
*/

'use client';

import toast from 'react-hot-toast';
import { AlertTriangle, BrainCircuit, Loader2, RefreshCw, Sparkles, Tags } from 'lucide-react';

import { useAnalyzeAsset, useAssetInsights } from '@/hooks/useAssets';
import { formatDate } from '@/lib/utils';

export function AssetAiInsightPanel({ assetId }: { assetId: string }) {
  const { data: insights = [], isLoading } = useAssetInsights(assetId);
  const analyzeMutation = useAnalyzeAsset();
  const latest = insights[0];

  async function handleAnalyze() {
    try {
      const response = await analyzeMutation.mutateAsync(assetId);
      toast.success(
        response.rag_stored ? 'AI insight indexed into RAG memory' : 'AI insight saved'
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Asset analysis failed');
    }
  }

  return (
    <section className="card mt-6 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-surface-border px-5 py-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-brand-300" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            AI Multimodal Insight
          </h2>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={analyzeMutation.isPending}
        >
          {analyzeMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : latest ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {latest ? 'Re-analyze' : 'Analyze'}
        </button>
      </div>

      <div className="grid gap-4 p-5">
        {isLoading ? (
          <div className="text-sm text-slate-500">Loading AI insight</div>
        ) : latest ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-surface px-2 py-1 text-slate-300">
                {latest.modality}
              </span>
              <span>{latest.provider}</span>
              {latest.model && <span>{latest.model}</span>}
              <span>{formatDate(latest.created_at)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-200">{latest.summary}</p>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Tags className="h-3.5 w-3.5" />
                  Labels
                </div>
                <InsightPills items={latest.labels} empty="No labels" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Risks
                </div>
                <InsightPills items={latest.quality_risks} empty="No risks" />
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reuse
                </div>
                <InsightPills items={latest.reuse_suggestions} empty="No suggestions" />
              </div>
            </div>

            {latest.detected_text && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Detected Text
                </div>
                <pre className="max-h-40 overflow-auto rounded-lg border border-surface-border bg-surface p-3 text-xs leading-relaxed text-slate-300">
                  {latest.detected_text}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-surface-border bg-surface p-4 text-sm text-slate-400">
            Run analysis to identify image content, readable document/code text, quality risks, reuse tags, and RAG-ready context.
          </div>
        )}
      </div>
    </section>
  );
}

function InsightPills({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) {
    return <div className="text-xs text-slate-500">{empty}</div>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-surface-border bg-surface px-2 py-1 text-xs text-slate-300">
          {item}
        </span>
      ))}
    </div>
  );
}
