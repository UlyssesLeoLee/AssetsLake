/*
```cypher
CREATE
  (f:File {name: "aiSettings.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/aiSettings", type: "module"}),
  (c1:Class {name: "AiSettings", type: "class", language: "typescript", signature: "interface AiSettings"}),
  (fn1:Function {name: "readStoredSettings", type: "function", language: "typescript", signature: "function readStoredSettings(): Partial<AiSettings> | undefined"}),
  (fn2:Function {name: "normalizeAiSettings", type: "function", language: "typescript", signature: "function normalizeAiSettings(settings?: Partial<AiSettings>): AiSettings"}),
  (fn3:Function {name: "loadAiSettings", type: "function", language: "typescript", signature: "function loadAiSettings(): AiSettings"}),
  (fn4:Function {name: "saveAiSettings", type: "function", language: "typescript", signature: "function saveAiSettings(settings: AiSettings): AiSettings"}),
  (fn5:Function {name: "clearAiSettings", type: "function", language: "typescript", signature: "function clearAiSettings(): void"}),
  (fn6:Function {name: "isAiConfigured", type: "function", language: "typescript", signature: "function isAiConfigured(settings?: AiSettings): boolean"}),
  (fn7:Function {name: "getAiRequestHeaders", type: "function", language: "typescript", signature: "function getAiRequestHeaders(settings?: AiSettings): Record<string, string>"}),
  (v1:Variable {name: "AI_SETTINGS_STORAGE_KEY", type: "variable"}),
  (v2:Variable {name: "DEFAULT_AI_SETTINGS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn2)-[:USES]->(v2),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn4)-[:CALLS]->(fn2),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v1),
  (fn6)-[:CALLS]->(fn3),
  (fn7)-[:CALLS]->(fn3),
  (fn7)-[:CALLS]->(fn6);
```
*/

export interface AiSettings {
  enabled: boolean;
  provider: string;
  baseUrl: string;
  model: string;
  embeddingModel: string;
  apiKey: string;
}

export const AI_SETTINGS_STORAGE_KEY = 'assetslake.aiSettings.v1';

export const DEFAULT_AI_SETTINGS: AiSettings = {
  enabled: true,
  provider: 'NVIDIA NIM',
  baseUrl: 'https://integrate.api.nvidia.com/v1',
  model: 'meta/llama-3.2-1b-instruct',
  embeddingModel: 'nvidia/nv-embedqa-e5-v5',
  apiKey: '',
};

function readStoredSettings(): Partial<AiSettings> | undefined {
  if (typeof window === 'undefined') return undefined;

  const raw = window.localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
  if (!raw) return undefined;

  try {
    return JSON.parse(raw) as Partial<AiSettings>;
  } catch {
    return undefined;
  }
}

function normalizeAiSettings(settings: Partial<AiSettings> = {}): AiSettings {
  return {
    enabled: settings.enabled ?? DEFAULT_AI_SETTINGS.enabled,
    provider: (settings.provider ?? DEFAULT_AI_SETTINGS.provider).trim(),
    baseUrl: (settings.baseUrl ?? DEFAULT_AI_SETTINGS.baseUrl).trim(),
    model: (settings.model ?? DEFAULT_AI_SETTINGS.model).trim(),
    embeddingModel: (settings.embeddingModel ?? DEFAULT_AI_SETTINGS.embeddingModel).trim(),
    apiKey: settings.apiKey ?? '',
  };
}

export function loadAiSettings(): AiSettings {
  return normalizeAiSettings(readStoredSettings());
}

export function saveAiSettings(settings: AiSettings): AiSettings {
  const normalized = normalizeAiSettings(settings);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

export function clearAiSettings(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
  }
}

export function isAiConfigured(settings = loadAiSettings()): boolean {
  return (
    settings.enabled &&
    settings.apiKey.trim().length > 0 &&
    settings.baseUrl.length > 0 &&
    settings.model.length > 0
  );
}

export function getAiRequestHeaders(settings = loadAiSettings()): Record<string, string> {
  if (!isAiConfigured(settings)) return {};

  return {
    'x-assetslake-ai-provider': settings.provider || 'Custom AI',
    'x-assetslake-ai-base-url': settings.baseUrl,
    'x-assetslake-ai-model': settings.model,
    'x-assetslake-ai-embedding-model': settings.embeddingModel,
    'x-assetslake-ai-api-key': settings.apiKey.trim(),
  };
}
