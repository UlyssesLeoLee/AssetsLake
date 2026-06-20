export type PluginCapabilityRequirement = 'required' | 'degradable' | 'optional';

export type PluginCapabilityStatus =
  | 'success'
  | 'partial'
  | 'fallback'
  | 'timeout'
  | 'failed'
  | 'skipped';

export interface PluginFallbackPolicy<TOutput = unknown> {
  readonly strategy: 'cached-result' | 'empty-result' | 'static-result' | 'skip';
  readonly reason: string;
  readonly value?: TOutput;
}

export interface PluginRetryPolicy {
  readonly maxAttempts: number;
  readonly backoffMs: number;
  readonly jitter: boolean;
}

export interface PluginCapabilityContract<TInput = unknown, TOutput = unknown> {
  readonly capability: string;
  readonly inputSchema: string;
  readonly outputSchema: string;
  readonly version: string;
  readonly compatibleKernel: string;
  readonly timeoutMs: number;
  readonly requirement: PluginCapabilityRequirement;
  readonly idempotent: boolean;
  readonly retry: PluginRetryPolicy;
  readonly fallback?: PluginFallbackPolicy<TOutput>;
}

export interface PluginExecutionContext {
  readonly pluginId: string;
  readonly capability: string;
  readonly correlationId: string;
  readonly idempotencyKey: string;
  readonly signal: AbortSignal;
  emit(event: KernelPluginEvent): void;
}

export interface PluginCapabilityHandler<TInput = unknown, TOutput = unknown> {
  readonly pluginId: string;
  readonly contract: PluginCapabilityContract<TInput, TOutput>;
  execute(input: TInput, context: PluginExecutionContext): Promise<TOutput> | TOutput;
}

export interface KernelPluginEvent<TPayload = unknown> {
  readonly type: string;
  readonly pluginId: string;
  readonly capability: string;
  readonly correlationId: string;
  readonly payload: TPayload;
  readonly occurredAt: string;
}

export interface PluginExecutionResult<TOutput = unknown> {
  readonly status: PluginCapabilityStatus;
  readonly pluginId: string;
  readonly capability: string;
  readonly correlationId: string;
  readonly attempts: number;
  readonly durationMs: number;
  readonly output?: TOutput;
  readonly error?: string;
  readonly degraded: boolean;
  readonly events: readonly KernelPluginEvent[];
}

export interface KernelCapabilityRequest<TInput = unknown> {
  readonly capability: string;
  readonly input: TInput;
  readonly correlationId: string;
  readonly idempotencyKey: string;
}

export class PluginContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginContractError';
  }
}

export function validateCapabilityContract(contract: PluginCapabilityContract): void {
  if (!contract.capability.trim()) {
    throw new PluginContractError('Plugin capability contract must declare a capability name.');
  }
  if (!contract.inputSchema.trim() || !contract.outputSchema.trim()) {
    throw new PluginContractError(`${contract.capability} must declare input and output schemas.`);
  }
  if (!contract.version.trim() || !contract.compatibleKernel.trim()) {
    throw new PluginContractError(`${contract.capability} must declare version compatibility.`);
  }
  if (!Number.isFinite(contract.timeoutMs) || contract.timeoutMs <= 0) {
    throw new PluginContractError(`${contract.capability} must declare a positive timeout.`);
  }
  if (contract.retry.maxAttempts < 1) {
    throw new PluginContractError(`${contract.capability} retry attempts must be at least one.`);
  }
  if (contract.requirement !== 'required' && !contract.fallback) {
    throw new PluginContractError(
      `${contract.capability} is ${contract.requirement} and must declare a fallback policy.`,
    );
  }
  if (!contract.idempotent && contract.retry.maxAttempts > 1) {
    throw new PluginContractError(
      `${contract.capability} cannot retry a non-idempotent boundary more than once.`,
    );
  }
}

export class FailureIsolationKernel {
  private readonly handlers = new Map<string, PluginCapabilityHandler>();

  register(handler: PluginCapabilityHandler): void {
    validateCapabilityContract(handler.contract);
    if (this.handlers.has(handler.contract.capability)) {
      throw new PluginContractError(
        `Duplicate capability registered: ${handler.contract.capability}.`,
      );
    }
    this.handlers.set(handler.contract.capability, handler);
  }

  async execute<TInput, TOutput>(
    request: KernelCapabilityRequest<TInput>,
  ): Promise<PluginExecutionResult<TOutput>> {
    const handler = this.handlers.get(request.capability) as
      | PluginCapabilityHandler<TInput, TOutput>
      | undefined;

    if (!handler) {
      return {
        status: 'skipped',
        pluginId: 'kernel',
        capability: request.capability,
        correlationId: request.correlationId,
        attempts: 0,
        durationMs: 0,
        error: `No plugin registered for capability ${request.capability}.`,
        degraded: true,
        events: [],
      };
    }

    const startedAt = Date.now();
    const events: KernelPluginEvent[] = [];
    let lastError: unknown;

    for (let attempt = 1; attempt <= handler.contract.retry.maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), handler.contract.timeoutMs);
      const context: PluginExecutionContext = {
        pluginId: handler.pluginId,
        capability: handler.contract.capability,
        correlationId: request.correlationId,
        idempotencyKey: request.idempotencyKey,
        signal: controller.signal,
        emit(event) {
          events.push(event);
        },
      };

      try {
        const output = await Promise.race([
          Promise.resolve(handler.execute(request.input, context)),
          waitForAbort(controller.signal, handler.contract.timeoutMs),
        ]);
        clearTimeout(timeout);
        return {
          status: 'success',
          pluginId: handler.pluginId,
          capability: handler.contract.capability,
          correlationId: request.correlationId,
          attempts: attempt,
          durationMs: Date.now() - startedAt,
          output,
          degraded: false,
          events,
        };
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        if (attempt < handler.contract.retry.maxAttempts) {
          await sleep(retryDelay(handler.contract.retry, attempt));
        }
      }
    }

    return fallbackResult(handler, request, events, startedAt, lastError);
  }
}

function fallbackResult<TInput, TOutput>(
  handler: PluginCapabilityHandler<TInput, TOutput>,
  request: KernelCapabilityRequest<TInput>,
  events: readonly KernelPluginEvent[],
  startedAt: number,
  error: unknown,
): PluginExecutionResult<TOutput> {
  const fallback = handler.contract.fallback;
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (fallback && fallback.strategy === 'static-result') {
    return {
      status: 'fallback',
      pluginId: handler.pluginId,
      capability: handler.contract.capability,
      correlationId: request.correlationId,
      attempts: handler.contract.retry.maxAttempts,
      durationMs: Date.now() - startedAt,
      output: fallback.value as TOutput,
      error: errorMessage,
      degraded: true,
      events,
    };
  }

  return {
    status: errorMessage.includes('timed out') ? 'timeout' : 'failed',
    pluginId: handler.pluginId,
    capability: handler.contract.capability,
    correlationId: request.correlationId,
    attempts: handler.contract.retry.maxAttempts,
    durationMs: Date.now() - startedAt,
    error: errorMessage,
    degraded: handler.contract.requirement !== 'required',
    events,
  };
}

function retryDelay(policy: PluginRetryPolicy, attempt: number): number {
  const baseDelay = policy.backoffMs * attempt;
  return policy.jitter ? Math.floor(baseDelay * 1.2) : baseDelay;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForAbort(signal: AbortSignal, timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    signal.addEventListener(
      'abort',
      () => reject(new Error(`Plugin capability timed out after ${timeoutMs}ms.`)),
      { once: true },
    );
  });
}
