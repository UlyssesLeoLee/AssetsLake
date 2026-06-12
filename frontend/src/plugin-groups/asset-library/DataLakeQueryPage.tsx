/*
```cypher
CREATE
  (f:File {name: "DataLakeQueryPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/asset-library/DataLakeQueryPage", type: "module"}),
  (c1:Class {name: "QuerySample", type: "class", language: "typescript", signature: "interface QuerySample"}),
  (fn1:Function {name: "DataLakeQueryPage", type: "function", language: "typescript", signature: "function DataLakeQueryPage()"}),
  (fn2:Function {name: "handleRun", type: "function", language: "typescript", signature: "async function handleRun(): Promise<void>"}),
  (fn3:Function {name: "applySample", type: "function", language: "typescript", signature: "function applySample(sample: QuerySample): void"}),
  (fn4:Function {name: "ResultTable", type: "function", language: "typescript", signature: "function ResultTable(props: { result: DataLakeQueryResponse | null })"}),
  (fn5:Function {name: "formatCell", type: "function", language: "typescript", signature: "function formatCell(value: unknown): string"}),
  (v1:Variable {name: "QUERY_SAMPLES", type: "variable"}),
  (v2:Variable {name: "engine", type: "variable"}),
  (v3:Variable {name: "query", type: "variable"}),
  (v4:Variable {name: "result", type: "variable"}),
  (v5:Variable {name: "running", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn2)-[:USES]->(v2),
  (fn2)-[:USES]->(v3),
  (fn2)-[:USES]->(v4),
  (fn2)-[:USES]->(v5),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn4)-[:CALLS]->(fn5),
  (fn4)-[:USES]->(v4);
```
*/

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Braces, Database, Loader2, Network, Play, ShieldCheck, Table2 } from 'lucide-react';

import { dataLakeQueryApi } from '@/lib/dataLakeQueryApi';
import { cn } from '@/lib/utils';
import type { DataLakeQueryEngine, DataLakeQueryResponse } from '@/types/dataLakeQuery';

interface QuerySample {
  engine: DataLakeQueryEngine;
  label: string;
  query: string;
}

const QUERY_SAMPLES: QuerySample[] = [
  {
    engine: 'sql',
    label: 'Recent Assets',
    query:
      'SELECT id, name, original_filename, asset_type, version, tags, embedding_id, updated_at FROM assets WHERE deleted_at IS NULL ORDER BY updated_at DESC',
  },
  {
    engine: 'sql',
    label: 'Issue Evidence',
    query:
      'SELECT i.issue_key, i.title, i.status, ia.link_type, a.name AS asset_name, a.asset_type FROM issues i JOIN issue_assets ia ON ia.issue_id = i.id JOIN assets a ON a.id = ia.asset_id WHERE i.deleted_at IS NULL AND a.deleted_at IS NULL ORDER BY ia.created_at DESC',
  },
  {
    engine: 'sql',
    label: 'RAG Memory',
    query:
      'SELECT operation_type, app, entity_type, actor, summary, embedding_provider, created_at FROM rag_operation_memories ORDER BY created_at DESC',
  },
  {
    engine: 'sql',
    label: 'AI Insights',
    query:
      'SELECT a.name, x.modality, x.provider, x.summary, x.labels, x.quality_risks, x.created_at FROM asset_ai_insights x JOIN assets a ON a.id = x.asset_id WHERE a.deleted_at IS NULL ORDER BY x.created_at DESC',
  },
  {
    engine: 'cypher',
    label: 'Asset Nodes',
    query: 'MATCH (a:Asset) RETURN a LIMIT 20',
  },
  {
    engine: 'cypher',
    label: 'Evidence Graph',
    query: 'MATCH (i:Issue)-[r:HAS_EVIDENCE]->(a:Asset) RETURN i, r, a LIMIT 20',
  },
  {
    engine: 'cypher',
    label: 'Memory Nodes',
    query: 'MATCH (m:RagMemory) RETURN m LIMIT 20',
  },
  {
    engine: 'cypher',
    label: 'Insight Graph',
    query: 'MATCH (a:Asset)-[r:HAS_INSIGHT]->(x:AiInsight) RETURN a, r, x LIMIT 20',
  },
];

export default function DataLakeQueryPage() {
  const [engine, setEngine] = useState<DataLakeQueryEngine>('sql');
  const [query, setQuery] = useState(QUERY_SAMPLES[0].query);
  const [limit, setLimit] = useState(50);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DataLakeQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    const text = query.trim();
    if (!text || running) return;

    setRunning(true);
    setError(null);
    try {
      const response =
        engine === 'sql'
          ? await dataLakeQueryApi.sql({ query: text, limit })
          : await dataLakeQueryApi.cypher({ query: text, limit });
      setResult(response);
      toast.success(`${engine.toUpperCase()} returned ${response.row_count} rows`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Data lake query failed';
      setError(message);
      toast.error(message);
    } finally {
      setRunning(false);
    }
  }

  function applySample(sample: QuerySample) {
    setEngine(sample.engine);
    setQuery(sample.query);
    setError(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-300">
          <Database className="h-3.5 w-3.5" />
          Data Lake
        </div>
        <h1 className="mt-1 truncate text-xl font-bold text-white">Data Lake Query</h1>
        <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
          Query assets, issue evidence, version graph projections, and RAG operation memory with
          read-only SQL or Cypher.
        </p>
      </div>

      <div className="grid flex-1 gap-4 overflow-hidden p-5 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="flex min-h-0 flex-col rounded-lg border border-surface-border bg-surface-secondary">
          <div className="border-b border-surface-border px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <Braces className="h-4 w-4 text-brand-300" />
                Query Console
              </div>
              <div className="flex rounded-lg border border-surface-border bg-surface p-1">
                {(['sql', 'cypher'] as DataLakeQueryEngine[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEngine(item)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium uppercase',
                      engine === item
                        ? 'bg-brand-500 text-white'
                        : 'text-slate-400 hover:text-white',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4">
            <label>
              <span className="label">{engine === 'sql' ? 'SQL' : 'Cypher'}</span>
              <textarea
                className="input min-h-[260px] resize-none font-mono text-xs leading-relaxed"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                spellCheck={false}
              />
            </label>

            <label>
              <span className="label">Limit</span>
              <input
                className="input"
                type="number"
                min={1}
                max={200}
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
              />
            </label>

            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Samples
              </div>
              <div className="flex flex-wrap gap-2">
                {QUERY_SAMPLES.map((sample) => (
                  <button
                    key={`${sample.engine}-${sample.label}`}
                    type="button"
                    className="btn-secondary"
                    onClick={() => applySample(sample)}
                  >
                    {sample.engine === 'sql' ? (
                      <Table2 className="h-4 w-4" />
                    ) : (
                      <Network className="h-4 w-4" />
                    )}
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-4 mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
              {error}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Read-only guard enabled
            </div>
            <button type="button" className="btn-primary" onClick={handleRun} disabled={running}>
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Query
            </button>
          </div>
        </section>

        <section className="flex min-h-0 flex-col rounded-lg border border-surface-border bg-surface-secondary">
          <div className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Table2 className="h-4 w-4 text-brand-300" />
              Results
            </div>
            {result && (
              <div className="text-xs text-slate-500">
                {result.engine} / {result.row_count} rows
              </div>
            )}
          </div>

          {result?.warnings.length ? (
            <div className="border-b border-surface-border px-4 py-2 text-xs text-slate-500">
              {result.warnings.join(' ')}
            </div>
          ) : null}

          <ResultTable result={result} />
        </section>
      </div>
    </div>
  );
}

function ResultTable({ result }: { result: DataLakeQueryResponse | null }) {
  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Run a SQL or Cypher query to inspect the data lake.
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Query returned no rows.
      </div>
    );
  }

  const columns = result.columns.length > 0 ? result.columns : Object.keys(result.rows[0] ?? {});

  return (
    <div className="flex-1 overflow-auto">
      <table className="min-w-full divide-y divide-surface-border text-left text-sm">
        <thead className="sticky top-0 bg-surface-secondary">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {result.rows.map((row, index) => (
            <tr key={index} className="hover:bg-surface-elevated/70">
              {columns.map((column) => (
                <td
                  key={column}
                  className="max-w-[360px] whitespace-pre-wrap px-3 py-2 align-top font-mono text-xs text-slate-300"
                >
                  {formatCell(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value, null, 2);
}
