import type { PluginId } from '@/plugin-groups/types';

export type AtomicPluginComponentStatus =
  | 'pending'
  | 'running'
  | 'committed'
  | 'rolling-back'
  | 'rolled-back'
  | 'failed'
  | 'rollback-failed'
  | 'skipped';

export interface AtomicPluginContext<
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly runId: string;
  readonly pluginId: PluginId;
  readonly signal?: AbortSignal;
  readonly state: TState;
  readonly journal: AtomicPluginJournalEntry[];
  record(entry: Omit<AtomicPluginJournalEntry, 'at' | 'runId' | 'pluginId'>): void;
}

export interface AtomicPluginJournalEntry {
  readonly at: string;
  readonly runId: string;
  readonly pluginId: PluginId;
  readonly componentId: string;
  readonly phase: 'execute' | 'commit' | 'rollback' | 'skip';
  readonly status: AtomicPluginComponentStatus;
  readonly message?: string;
}

export interface AtomicPluginComponent<
  TState extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly order: number;
  readonly dependencies?: readonly string[];
  readonly timeoutMs?: number;
  readonly retries?: number;
  readonly execute: (context: AtomicPluginContext<TState>) => Promise<TResult> | TResult;
  readonly rollback: (
    context: AtomicPluginContext<TState>,
    result: TResult | undefined,
    cause: unknown,
  ) => Promise<void> | void;
  readonly commit?: (context: AtomicPluginContext<TState>, result: TResult) => Promise<void> | void;
}

export interface AtomicPluginPlan<
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly runId: string;
  readonly pluginId: PluginId;
  readonly components: readonly AtomicPluginComponent<TState, unknown>[];
  readonly initialState?: TState;
  readonly signal?: AbortSignal;
}

export interface AtomicPluginComponentResult {
  readonly componentId: string;
  readonly status: AtomicPluginComponentStatus;
  readonly attempts: number;
  readonly error?: unknown;
}

export interface AtomicPluginRunResult<
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly ok: boolean;
  readonly runId: string;
  readonly pluginId: PluginId;
  readonly state: TState;
  readonly completed: readonly AtomicPluginComponentResult[];
  readonly journal: readonly AtomicPluginJournalEntry[];
  readonly error?: unknown;
}

interface CompletedComponent {
  readonly component: AtomicPluginComponent<Record<string, unknown>, unknown>;
  readonly result: unknown;
  readonly attempts: number;
}

export async function runAtomicPluginPlan<TState extends Record<string, unknown>>(
  plan: AtomicPluginPlan<TState>,
): Promise<AtomicPluginRunResult<TState>> {
  const components = orderAtomicPluginComponents(plan.components);
  const journal: AtomicPluginJournalEntry[] = [];
  const state = { ...(plan.initialState ?? ({} as TState)) } as TState;
  const completed: CompletedComponent[] = [];
  const componentResults: AtomicPluginComponentResult[] = [];

  const context: AtomicPluginContext<TState> = {
    runId: plan.runId,
    pluginId: plan.pluginId,
    signal: plan.signal,
    state,
    journal,
    record: (entry) => {
      journal.push({
        ...entry,
        at: new Date().toISOString(),
        runId: plan.runId,
        pluginId: plan.pluginId,
      });
    },
  };

  try {
    for (const component of components) {
      throwIfAborted(plan.signal);
      context.record({ componentId: component.id, phase: 'execute', status: 'running' });
      const { result, attempts } = await executeWithRetries(component, context);
      await runWithOptionalTimeout(
        () => component.commit?.(context, result),
        component.timeoutMs,
        plan.signal,
      );
      completed.push({
        component: component as AtomicPluginComponent<Record<string, unknown>, unknown>,
        result,
        attempts,
      });
      componentResults.push({ componentId: component.id, status: 'committed', attempts });
      context.record({ componentId: component.id, phase: 'commit', status: 'committed' });
    }

    return {
      ok: true,
      runId: plan.runId,
      pluginId: plan.pluginId,
      state,
      completed: componentResults,
      journal,
    };
  } catch (error) {
    const rolledBack = await rollbackCompletedComponents(completed, context, error);
    return {
      ok: false,
      runId: plan.runId,
      pluginId: plan.pluginId,
      state,
      completed: [...componentResults, ...rolledBack],
      journal,
      error,
    };
  }
}

export function orderAtomicPluginComponents<TState extends Record<string, unknown>>(
  components: readonly AtomicPluginComponent<TState, unknown>[],
): AtomicPluginComponent<TState, unknown>[] {
  const byId = new Map(components.map((component) => [component.id, component]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const ordered: AtomicPluginComponent<TState, unknown>[] = [];

  const visit = (component: AtomicPluginComponent<TState, unknown>) => {
    if (visited.has(component.id)) return;
    if (visiting.has(component.id)) {
      throw new Error(`Atomic plugin component dependency cycle at ${component.id}.`);
    }
    visiting.add(component.id);
    for (const dependencyId of component.dependencies ?? []) {
      const dependency = byId.get(dependencyId);
      if (!dependency) {
        throw new Error(
          `Atomic plugin component ${component.id} depends on missing ${dependencyId}.`,
        );
      }
      visit(dependency);
    }
    visiting.delete(component.id);
    visited.add(component.id);
    ordered.push(component);
  };

  [...components].sort((a, b) => a.order - b.order).forEach(visit);
  return ordered;
}

async function executeWithRetries<TState extends Record<string, unknown>, TResult>(
  component: AtomicPluginComponent<TState, TResult>,
  context: AtomicPluginContext<TState>,
): Promise<{ result: TResult; attempts: number }> {
  const maxAttempts = Math.max(1, (component.retries ?? 0) + 1);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await runWithOptionalTimeout(
        () => component.execute(context),
        component.timeoutMs,
        context.signal,
      );
      return { result, attempts: attempt };
    } catch (error) {
      lastError = error;
      context.record({
        componentId: component.id,
        phase: 'execute',
        status: attempt === maxAttempts ? 'failed' : 'running',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  throw lastError;
}

async function rollbackCompletedComponents<TState extends Record<string, unknown>>(
  completed: readonly CompletedComponent[],
  context: AtomicPluginContext<TState>,
  cause: unknown,
): Promise<AtomicPluginComponentResult[]> {
  const outcomes: AtomicPluginComponentResult[] = [];
  for (const item of [...completed].reverse()) {
    context.record({ componentId: item.component.id, phase: 'rollback', status: 'rolling-back' });
    try {
      await runWithOptionalTimeout(
        () =>
          item.component.rollback(
            context as AtomicPluginContext<Record<string, unknown>>,
            item.result,
            cause,
          ),
        item.component.timeoutMs,
        context.signal,
      );
      outcomes.push({
        componentId: item.component.id,
        status: 'rolled-back',
        attempts: item.attempts,
      });
      context.record({ componentId: item.component.id, phase: 'rollback', status: 'rolled-back' });
    } catch (rollbackError) {
      outcomes.push({
        componentId: item.component.id,
        status: 'rollback-failed',
        attempts: item.attempts,
        error: rollbackError,
      });
      context.record({
        componentId: item.component.id,
        phase: 'rollback',
        status: 'rollback-failed',
        message: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
      });
    }
  }
  return outcomes;
}

async function runWithOptionalTimeout<T>(
  operation: () => Promise<T> | T,
  timeoutMs: number | undefined,
  signal: AbortSignal | undefined,
): Promise<T> {
  throwIfAborted(signal);
  if (!timeoutMs) {
    return await operation();
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Atomic plugin operation timed out after ${timeoutMs}ms.`)),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
    throwIfAborted(signal);
  }
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw signal.reason ?? new Error('Atomic plugin run was aborted.');
  }
}
