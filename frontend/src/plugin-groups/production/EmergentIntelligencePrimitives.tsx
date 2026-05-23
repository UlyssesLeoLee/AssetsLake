/*
```cypher
CREATE
  (f:File {name: "EmergentIntelligencePrimitives.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/EmergentIntelligencePrimitives", type: "module"}),
  (fn1:Function {name: "EmergentCommandPanel", type: "function", language: "typescript", signature: "function EmergentCommandPanel(props: { model: EmergentOperatingModel })", visibility: "public"}),
  (fn2:Function {name: "ModePill", type: "function", language: "typescript", signature: "function ModePill(props: { stage: EmergentLoopStage; active: boolean })", visibility: "private"}),
  (fn3:Function {name: "SignalTile", type: "function", language: "typescript", signature: "function SignalTile(props: { signal: EmergentSignal })", visibility: "private"}),
  (fn4:Function {name: "RecommendationRow", type: "function", language: "typescript", signature: "function RecommendationRow(props: { recommendation: EmergentRecommendation; index: number })", visibility: "private"}),
  (fn5:Function {name: "getSignalIcon", type: "function", language: "typescript", signature: "function getSignalIcon(source: EmergentSignal['source']): LucideIcon", visibility: "private"}),
  (fn6:Function {name: "toneClass", type: "function", language: "typescript", signature: "function toneClass(tone: EmergentRecommendation['tone']): string", visibility: "private"}),
  (fn7:Function {name: "sourceToneClass", type: "function", language: "typescript", signature: "function sourceToneClass(source: EmergentSignal['source']): string", visibility: "private"}),
  (v1:Variable {name: "MODE_ICONS", type: "variable"}),
  (v2:Variable {name: "SIGNAL_ICONS", type: "variable"}),
  (v3:Variable {name: "model", type: "variable"}),
  (v4:Variable {name: "stage", type: "variable"}),
  (v5:Variable {name: "signal", type: "variable"}),
  (v6:Variable {name: "recommendation", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn5),
  (fn3)-[:CALLS]->(fn6),
  (fn3)-[:CALLS]->(fn7),
  (fn3)-[:USES]->(v5),
  (fn4)-[:CALLS]->(fn6),
  (fn4)-[:USES]->(v6),
  (fn5)-[:USES]->(v2);
```
*/

import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import type {
  EmergentLoopStage,
  EmergentOperatingModel,
  EmergentRecommendation,
  EmergentSignal,
} from '@/plugin-groups/production/emergentIntelligenceModel';

const MODE_ICONS: Record<EmergentLoopStage['mode'], LucideIcon> = {
  sense: Database,
  decide: BrainCircuit,
  act: ShieldCheck,
};

const SIGNAL_ICONS: Record<EmergentSignal['source'], LucideIcon> = {
  data_lake: Database,
  project_flow: GitBranch,
  ai: Sparkles,
  automation: ShieldCheck,
};

export function EmergentCommandPanel({ model }: { model: EmergentOperatingModel }) {
  const primaryRecommendation = model.recommendations[0];

  return (
    <section className="mt-4 overflow-hidden rounded-lg border border-surface-border bg-surface-secondary shadow-2xl shadow-black/20">
      <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
        <div className="border-b border-surface-border bg-[linear-gradient(135deg,rgba(243,234,216,0.08),rgba(31,122,216,0.08),rgba(143,181,95,0.06))] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-500/10 text-brand-200">
              <BrainCircuit className="h-4 w-4" />
            </span>
            Emergent Operating Layer
          </div>
          <div className="mt-5 flex items-end gap-3">
            <div className="text-5xl font-semibold text-white">{model.readinessPercent}</div>
            <div className="pb-2 text-sm text-slate-400">one-stop readiness</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-300 via-sakura-300 to-matcha-300"
              style={{ width: `${model.readinessPercent}%` }}
            />
          </div>
          <div className="mt-5 grid gap-2">
            {model.loop.map((stage) => (
              <ModePill key={stage.mode} stage={stage} active={stage.mode === model.mode} />
            ))}
          </div>
          {primaryRecommendation && (
            <div className="mt-5 rounded-lg border border-washi-200/20 bg-surface/60 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-washi-100">
                <CheckCircle2 className="h-4 w-4 text-matcha-300" />
                {primaryRecommendation.title}
              </div>
              <div className="mt-2 text-xs leading-relaxed text-slate-400">{primaryRecommendation.action}</div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {model.signals.map((signal) => (
              <SignalTile key={signal.id} signal={signal} />
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">One-stop Decisions</h2>
                <p className="mt-1 text-xs text-slate-500">Data lake, project flow, and AI actions in one loop.</p>
              </div>
              <span className="rounded-md border border-surface-border bg-surface px-2 py-1 text-xs text-brand-200">
                {model.riskCount} signals
              </span>
            </div>
            <div className="mt-3 divide-y divide-surface-border overflow-hidden rounded-lg border border-surface-border bg-surface-elevated">
              {model.recommendations.map((recommendation, index) => (
                <RecommendationRow key={recommendation.id} recommendation={recommendation} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModePill({ stage, active }: { stage: EmergentLoopStage; active: boolean }) {
  const Icon = MODE_ICONS[stage.mode];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-3 py-2',
        active ? 'border-brand-300/50 bg-brand-500/15' : 'border-surface-border bg-surface/55'
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
          active ? 'bg-brand-400/20 text-brand-100' : 'bg-surface-elevated text-slate-400'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-slate-100">{stage.label}</span>
          <span className="font-mono text-xs text-slate-400">{stage.value}</span>
        </div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{stage.detail}</div>
      </div>
    </div>
  );
}

function SignalTile({ signal }: { signal: EmergentSignal }) {
  const Icon = getSignalIcon(signal.source);

  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', sourceToneClass(signal.source))}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-100">{signal.label}</div>
            <div className="mt-0.5 text-xs text-slate-500">{signal.detail}</div>
          </div>
        </div>
        <span className={cn('rounded-md border px-2 py-0.5 font-mono text-xs', toneClass(signal.tone))}>{signal.value}</span>
      </div>
    </div>
  );
}

function RecommendationRow({ recommendation, index }: { recommendation: EmergentRecommendation; index: number }) {
  return (
    <div className="flex gap-3 p-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface font-mono text-xs text-slate-400">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-100">{recommendation.title}</span>
          <span className={cn('rounded-md border px-2 py-0.5 text-xs capitalize', toneClass(recommendation.tone))}>
            {recommendation.mode}
          </span>
        </div>
        <div className="mt-1 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />
          <span>{recommendation.action}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">{recommendation.impact}</div>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <div className="font-mono text-xs text-slate-400">{Math.round(recommendation.confidence * 100)}%</div>
        <div className="mt-0.5 text-xs text-slate-600">confidence</div>
      </div>
    </div>
  );
}

function getSignalIcon(source: EmergentSignal['source']): LucideIcon {
  return SIGNAL_ICONS[source] ?? Sparkles;
}

function toneClass(tone: EmergentRecommendation['tone']): string {
  if (tone === 'healthy') return 'border-matcha-300/30 bg-matcha-400/10 text-matcha-300';
  if (tone === 'blocked') return 'border-shu-300/30 bg-shu-400/10 text-shu-300';
  return 'border-washi-200/25 bg-washi-100/10 text-washi-100';
}

function sourceToneClass(source: EmergentSignal['source']): string {
  if (source === 'data_lake') return 'bg-brand-400/15 text-brand-200';
  if (source === 'project_flow') return 'bg-sakura-400/15 text-sakura-300';
  if (source === 'automation') return 'bg-matcha-400/15 text-matcha-300';
  return 'bg-washi-100/10 text-washi-100';
}
