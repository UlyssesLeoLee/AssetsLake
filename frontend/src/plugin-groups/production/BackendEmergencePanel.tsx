/*
```cypher
CREATE
  (f:File {name: "BackendEmergencePanel.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/BackendEmergencePanel", type: "module"}),
  (fn1:Function {name: "BackendEmergencePanel", type: "function", language: "typescript", signature: "function BackendEmergencePanel()"}),
  (fn2:Function {name: "EmergenceMetric", type: "function", language: "typescript", signature: "function EmergenceMetric(props: { label: string; value: string | number; detail: string; tone?: string })"}),
  (fn3:Function {name: "SignalBadge", type: "function", language: "typescript", signature: "function SignalBadge(props: { tone: string; label: string })"}),
  (fn4:Function {name: "toneClass", type: "function", language: "typescript", signature: "function toneClass(tone: string): string"}),
  (fn5:Function {name: "postureLabel", type: "function", language: "typescript", signature: "function postureLabel(posture: string): string"}),
  (v1:Variable {name: "snapshot", type: "variable"}),
  (v2:Variable {name: "useEmergenceSnapshot", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn4);
```
*/

'use client';

import { Activity, BrainCircuit, Database, ShieldCheck } from 'lucide-react';

import { useEmergenceSnapshot } from '@/hooks/useEmergence';
import { cn } from '@/lib/utils';

export function BackendEmergencePanel() {
  const { data: snapshot, isLoading, error } = useEmergenceSnapshot();

  if (isLoading) {
    return (
      <section className="mt-4 rounded-lg border border-surface-border bg-surface-secondary p-4 text-sm text-slate-400">
        Loading backend emergence snapshot
      </section>
    );
  }

  if (error || !snapshot) {
    return (
      <section className="mt-4 rounded-lg border border-shu-300/30 bg-shu-400/10 p-4 text-sm text-shu-200">
        Backend emergence snapshot unavailable
      </section>
    );
  }

  return (
    <section className="mt-4 overflow-hidden rounded-lg border border-surface-border bg-surface-secondary shadow-2xl shadow-black/20">
      <div className="grid gap-0 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-surface-border bg-[linear-gradient(135deg,rgba(31,122,216,0.13),rgba(143,181,95,0.08),rgba(232,163,165,0.08))] p-5 xl:border-b-0 xl:border-r">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-500/10 text-brand-200">
              <BrainCircuit className="h-4 w-4" />
            </span>
            Backend Emergence Engine
          </div>
          <div className="mt-5 flex items-end gap-3">
            <div className="text-5xl font-semibold text-white">{snapshot.readiness_percent}</div>
            <div className="pb-2 text-sm text-slate-400">system readiness</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-300 via-matcha-300 to-sakura-300"
              style={{ width: `${snapshot.readiness_percent}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <SignalBadge tone="healthy" label={postureLabel(snapshot.posture)} />
            <SignalBadge tone={snapshot.risk_count > 0 ? 'watch' : 'healthy'} label={`${snapshot.risk_count} risks`} />
            <SignalBadge tone="healthy" label={`${snapshot.metrics.active_sessions} sessions`} />
          </div>
          <div className="mt-5 grid gap-2">
            {snapshot.loop_stages.map((stage) => (
              <div key={stage.mode} className="rounded-lg border border-surface-border bg-surface/55 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-100">{stage.label}</span>
                  <span className="font-mono text-xs text-brand-200">{stage.value}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{stage.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <EmergenceMetric
              label="Evidence"
              value={`${snapshot.evidence_coverage_percent}%`}
              detail={`${snapshot.metrics.evidence_linked_issues}/${snapshot.metrics.total_issues} issues linked`}
              tone="text-emerald-300"
            />
            <EmergenceMetric
              label="Flow"
              value={`${snapshot.flow_health_percent}%`}
              detail={`${snapshot.metrics.open_issues} open issues`}
              tone="text-brand-300"
            />
            <EmergenceMetric
              label="AI/RAG"
              value={`${snapshot.ai_readiness_percent}%`}
              detail={`${snapshot.metrics.rag_memories} memories`}
              tone="text-washi-100"
            />
            <EmergenceMetric
              label="Locks"
              value={snapshot.metrics.active_locks}
              detail="active exclusive locks"
              tone="text-sakura-300"
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <Database className="h-4 w-4 text-brand-300" />
                Cross-App Signals
              </div>
              <div className="mt-3 space-y-2">
                {snapshot.signals.map((signal) => (
                  <div key={signal.id} className="rounded-md border border-surface-border bg-surface p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-100">{signal.label}</span>
                      <SignalBadge tone={signal.tone} label={signal.value} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{signal.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <ShieldCheck className="h-4 w-4 text-matcha-300" />
                Suggested Controls
              </div>
              <div className="mt-3 space-y-2">
                {snapshot.recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="rounded-md border border-surface-border bg-surface p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-100">{recommendation.title}</span>
                      <SignalBadge tone={recommendation.tone} label={recommendation.mode} />
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">{recommendation.action}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <Activity className="h-3.5 w-3.5 text-brand-300" />
                      {recommendation.app} / {recommendation.control_id} / {Math.round(recommendation.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmergenceMetric({
  label,
  value,
  detail,
  tone = 'text-slate-100',
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function SignalBadge({ tone, label }: { tone: string; label: string }) {
  return (
    <span className={cn('rounded-md border px-2 py-0.5 text-xs capitalize', toneClass(tone))}>
      {label}
    </span>
  );
}

function toneClass(tone: string): string {
  if (tone === 'healthy') return 'border-matcha-300/30 bg-matcha-400/10 text-matcha-300';
  if (tone === 'blocked') return 'border-shu-300/30 bg-shu-400/10 text-shu-300';
  return 'border-washi-200/25 bg-washi-100/10 text-washi-100';
}

function postureLabel(posture: string): string {
  if (posture === 'sense') return 'Sense mode';
  if (posture === 'act') return 'Act mode';
  return 'Decide mode';
}

export default BackendEmergencePanel;
