/*
```cypher
CREATE
  (f:File {name: "ObservabilityPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/observability/ObservabilityPage", type: "module"}),
  (fn1:Function {name: "ObservabilityPage", type: "function", language: "typescript", signature: "export default async function ObservabilityPage()"}),
  (fn2:Function {name: "normalizeConsoleUrl", type: "function", language: "typescript", signature: "function normalizeConsoleUrl(value: string | undefined, fallback: string): string"}),
  (fn3:Function {name: "normalizeProxyTarget", type: "function", language: "typescript", signature: "function normalizeProxyTarget(value: string | undefined): string"}),
  (fn4:Function {name: "checkKialiHealth", type: "function", language: "typescript", signature: "async function checkKialiHealth(proxyTarget: string): Promise<KialiHealth>"}),
  (fn5:Function {name: "resolveRawKialiUrl", type: "function", language: "typescript", signature: "function resolveRawKialiUrl(kialiUrl: string, proxyTarget: string): string"}),
  (fn6:Function {name: "probeHttpStatus", type: "function", language: "typescript", signature: "function probeHttpStatus(url: URL, timeoutMs: number): Promise<number>"}),
  (c1:Class {name: "KialiHealth", type: "class", language: "typescript", signature: "type KialiHealth"}),
  (v1:Variable {name: "STATUS_ITEMS", type: "variable"}),
  (v2:Variable {name: "TOPOLOGY_CHECKS", type: "variable"}),
  (v3:Variable {name: "kialiUrl", type: "variable"}),
  (v4:Variable {name: "DEFAULT_KIALI_TOPOLOGY_URL", type: "variable"}),
  (v5:Variable {name: "skywalkingUrl", type: "variable"}),
  (v6:Variable {name: "DEFAULT_SKYWALKING_APM_URL", type: "variable"}),
  (v7:Variable {name: "fallback", type: "variable"}),
  (v8:Variable {name: "DEFAULT_KIALI_PROXY_TARGET", type: "variable"}),
  (v9:Variable {name: "kialiProxyTarget", type: "variable"}),
  (v10:Variable {name: "kialiHealth", type: "variable"}),
  (v11:Variable {name: "rawKialiUrl", type: "variable"}),
  (v12:Variable {name: "proxyTarget", type: "variable"}),
  (v13:Variable {name: "healthUrl", type: "variable"}),
  (v14:Variable {name: "timeoutMs", type: "variable"}),
  (v15:Variable {name: "statusCode", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v8),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v9),
  (fn1)-[:USES]->(v10),
  (fn1)-[:USES]->(v11),
  (fn2)-[:USES]->(v7),
  (fn3)-[:USES]->(v8),
  (fn4)-[:CALLS]->(fn6),
  (fn4)-[:USES]->(v12),
  (fn4)-[:USES]->(v13),
  (fn4)-[:USES]->(v15),
  (fn5)-[:USES]->(v3),
  (fn5)-[:USES]->(v12),
  (fn6)-[:USES]->(v14),
  (fn6)-[:USES]->(v15);
```
*/

import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { Activity, AlertTriangle, Database, ExternalLink, Network, RadioTower, RefreshCw, Route } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_ITEMS = [
  { label: 'Mesh graph', value: 'Kiali', icon: Route, tone: 'text-brand-300' },
  { label: 'Traffic source', value: 'Istio sidecar', icon: Network, tone: 'text-matcha-300' },
  { label: 'Metrics', value: 'Prometheus', icon: Database, tone: 'text-sakura-300' },
  { label: 'Trace/APM', value: 'SkyWalking', icon: RadioTower, tone: 'text-washi-200' },
] as const;

const TOPOLOGY_CHECKS = ['assetslake namespace', 'service graph', 'workload health', 'request rate', 'mTLS edges'] as const;
const DEFAULT_KIALI_TOPOLOGY_URL =
  '/kiali/console/graph/namespaces?namespaces=assetslake&graphType=service&duration=300&refresh=15000';
const DEFAULT_KIALI_PROXY_TARGET = 'http://127.0.0.1:20001';
const DEFAULT_SKYWALKING_APM_URL = 'http://localhost:18088/dashboard/GENERAL/All/General-Root';

type KialiHealth = {
  ok: boolean;
  detail: string;
};

function normalizeConsoleUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }

  if (trimmed.includes('?') || trimmed.includes('#')) {
    return trimmed;
  }
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

function normalizeProxyTarget(value: string | undefined): string {
  const trimmed = value?.trim() || DEFAULT_KIALI_PROXY_TARGET;
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

async function checkKialiHealth(proxyTarget: string): Promise<KialiHealth> {
  const healthUrl = new URL('/kiali/healthz', proxyTarget);

  try {
    const statusCode = await probeHttpStatus(healthUrl, 2500);
    return {
      ok: statusCode >= 200 && statusCode < 300,
      detail: `Kiali health returned HTTP ${statusCode}`,
    };
  } catch (error) {
    const detail = error instanceof Error && error.name === 'TimeoutError'
      ? 'Kiali health check timed out'
      : 'Kiali proxy target is not reachable';
    return { ok: false, detail };
  }
}

function probeHttpStatus(url: URL, timeoutMs: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const requestFn = url.protocol === 'https:' ? httpsRequest : httpRequest;
    const request = requestFn(url, { method: 'GET', timeout: timeoutMs }, (response) => {
      const statusCode = response.statusCode ?? 0;
      response.resume();
      response.on('end', () => resolve(statusCode));
    });

    request.on('timeout', () => {
      const timeoutError = new Error('Kiali health check timed out');
      timeoutError.name = 'TimeoutError';
      request.destroy(timeoutError);
    });
    request.on('error', reject);
    request.end();
  });
}

function resolveRawKialiUrl(kialiUrl: string, proxyTarget: string): string {
  if (kialiUrl.startsWith('http://') || kialiUrl.startsWith('https://')) {
    return kialiUrl;
  }
  return new URL(kialiUrl, proxyTarget).toString();
}

export default async function ObservabilityPage() {
  const kialiProxyTarget = normalizeProxyTarget(process.env.KIALI_PROXY_URL);
  const kialiUrl = normalizeConsoleUrl(
    process.env.KIALI_CONSOLE_URL ?? process.env.NEXT_PUBLIC_KIALI_CONSOLE_URL,
    DEFAULT_KIALI_TOPOLOGY_URL
  );
  const skywalkingUrl = normalizeConsoleUrl(
    process.env.SKYWALKING_UI_URL ?? process.env.NEXT_PUBLIC_SKYWALKING_UI_URL,
    DEFAULT_SKYWALKING_APM_URL
  );
  const kialiHealth = await checkKialiHealth(kialiProxyTarget);
  const rawKialiUrl = resolveRawKialiUrl(kialiUrl, kialiProxyTarget);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0b0f14]">
      <div className="border-b border-surface-border bg-[#0f1620]">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="mr-1 text-xl font-semibold tracking-normal text-slate-100 md:text-2xl">Observability</h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${
                  kialiHealth.ok
                    ? 'border-matcha-300/25 bg-matcha-400/10 text-matcha-300'
                    : 'border-amber-300/25 bg-amber-300/10 text-amber-200'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                {kialiHealth.ok ? 'Live' : 'Unavailable'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-300/20 bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-200">
                <Network className="h-3.5 w-3.5" />
                Kiali topology
              </span>
            </div>

            <div className="flex min-w-0 flex-wrap gap-2 text-xs text-slate-400">
              {TOPOLOGY_CHECKS.map((item) => (
                <span key={item} className="rounded-md border border-white/[0.06] bg-white/[0.035] px-2 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STATUS_ITEMS.map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/[0.06] bg-[#111923] px-3 text-xs text-slate-400"
              >
                <Icon className={`h-4 w-4 shrink-0 ${tone}`} />
                <span className="font-medium uppercase text-slate-500">{label}</span>
                <span className="font-semibold text-slate-100">{value}</span>
              </div>
            ))}
            <a
              href={skywalkingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 text-sm font-medium text-slate-200 transition-colors hover:border-brand-400/50 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 text-sakura-300" />
              Open SkyWalking APM
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1920px] px-3 py-3">
        <div className="h-[calc(100vh-9rem)] min-h-[760px] overflow-hidden rounded-lg border border-surface-border bg-[#101820] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
          <div className="flex h-10 items-center justify-between border-b border-surface-border bg-[#111923] px-4">
            <div className="flex min-w-0 items-center gap-2">
              <Network className="h-4 w-4 shrink-0 text-brand-300" />
              <span className="truncate text-sm font-medium text-slate-200">Kiali service mesh topology</span>
            </div>
            <span className="rounded-md border border-white/[0.06] px-2 py-1 text-xs text-slate-500">assetslake</span>
          </div>
          {kialiHealth.ok ? (
            <iframe
              src={kialiUrl}
              title="Kiali service mesh topology"
              className="h-[calc(100%-2.5rem)] min-h-[720px] w-full bg-white"
            />
          ) : (
            <div className="flex h-[calc(100%-2.5rem)] min-h-[720px] items-center justify-center bg-[#0d141c] p-6">
              <div className="w-full max-w-xl rounded-lg border border-amber-300/25 bg-amber-300/[0.06] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-amber-100">Kiali proxy unavailable</h2>
                    <p className="mt-2 text-sm text-amber-100/80">{kialiHealth.detail}</p>
                    <div className="mt-4 rounded-md border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-slate-400">
                      Health check: <span className="text-slate-200">{new URL('/kiali/healthz', kialiProxyTarget).toString()}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href="/observability"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-amber-300/25 bg-amber-300/10 px-3 text-sm font-medium text-amber-100 hover:bg-amber-300/15"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </a>
                      <a
                        href={rawKialiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 text-sm font-medium text-slate-200 hover:border-brand-400/50 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4 text-brand-300" />
                        Open Kiali
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
