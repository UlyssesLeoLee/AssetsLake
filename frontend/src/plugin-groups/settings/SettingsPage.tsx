/*
```cypher
CREATE
  (f:File {name: "SettingsPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/settings/SettingsPage", type: "module"}),
  (fn1:Function {name: "SettingsPage", type: "function", language: "typescript", signature: "function SettingsPage()"}),
  (fn2:Function {name: "updateSetting", type: "function", language: "typescript", signature: "function updateSetting<K extends keyof AiSettings>(key: K, value: AiSettings[K]): void"}),
  (fn3:Function {name: "handleSave", type: "function", language: "typescript", signature: "function handleSave(): void"}),
  (fn4:Function {name: "handleReset", type: "function", language: "typescript", signature: "function handleReset(): void"}),
  (fn5:Function {name: "handleTest", type: "function", language: "typescript", signature: "async function handleTest(): Promise<void>"}),
  (v1:Variable {name: "settings", type: "variable"}),
  (v2:Variable {name: "testing", type: "variable"}),
  (v3:Variable {name: "testResult", type: "variable"}),
  (v4:Variable {name: "queryClient", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:CONTAINS]->(fn5),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn3)-[:USES]->(v1),
  (fn3)-[:USES]->(v4),
  (fn4)-[:USES]->(v1),
  (fn4)-[:USES]->(v4),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn5)-[:USES]->(v3),
  (fn5)-[:USES]->(v4);
```
*/

'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle2, FlaskConical, KeyRound, Loader2, RotateCcw, Save } from 'lucide-react';

import { productionApi } from '@/lib/productionApi';
import {
  DEFAULT_AI_SETTINGS,
  clearAiSettings,
  loadAiSettings,
  saveAiSettings,
  type AiSettings,
} from '@/lib/aiSettings';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    setSettings(loadAiSettings());
  }, []);

  function updateSetting<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    const saved = saveAiSettings(settings);
    setSettings(saved);
    setTestResult(null);
    queryClient.invalidateQueries({ queryKey: ['management-intelligence'] });
    queryClient.invalidateQueries({ queryKey: ['project-automation'] });
    toast.success('AI API settings saved');
  }

  function handleReset() {
    clearAiSettings();
    setSettings(DEFAULT_AI_SETTINGS);
    setTestResult(null);
    queryClient.invalidateQueries({ queryKey: ['management-intelligence'] });
    queryClient.invalidateQueries({ queryKey: ['project-automation'] });
    toast.success('AI API settings reset');
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    saveAiSettings(settings);

    try {
      const result = await productionApi.management.chat({
        message: 'Confirm the AssetsLake AI API connection in one concise sentence.',
        context: 'Settings connection test for chat and guarded AI control.',
      });
      const status = result.ai_status;
      if (status?.used) {
        setTestResult({
          ok: true,
          message: `${status.provider ?? 'AI provider'} responded with ${result.actions.length} chat control actions.`,
        });
        queryClient.invalidateQueries({ queryKey: ['management-intelligence'] });
        toast.success('AI API test passed');
      } else {
        const message = status?.error ?? 'AI API is not configured';
        setTestResult({ ok: false, message });
        toast.error(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI API test failed';
      setTestResult({ ok: false, message });
      toast.error(message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-300">
          <KeyRound className="h-3.5 w-3.5" />
          Settings
        </div>
        <h1 className="mt-1 truncate text-xl font-bold text-white">AI API</h1>
        <p className="mt-0.5 text-sm text-slate-400">Provider credentials for LangGraph and management intelligence.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <section className="max-w-3xl rounded-lg border border-surface-border bg-surface-secondary">
          <div className="flex items-center justify-between gap-4 border-b border-surface-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Connection</h2>
              <div className="mt-1 text-xs text-slate-500">{settings.provider || 'Custom AI'} / {settings.model || 'No model selected'}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.enabled}
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={cn(
                'relative h-6 w-11 rounded-full border transition-colors',
                settings.enabled ? 'border-brand-500/60 bg-brand-500/40' : 'border-surface-border bg-surface-elevated'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                  settings.enabled ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2">
            <label>
              <span className="label">Provider</span>
              <input
                className="input"
                value={settings.provider}
                onChange={(event) => updateSetting('provider', event.target.value)}
                placeholder="NVIDIA NIM"
              />
            </label>

            <label>
              <span className="label">Model</span>
              <input
                className="input"
                value={settings.model}
                onChange={(event) => updateSetting('model', event.target.value)}
                placeholder={DEFAULT_AI_SETTINGS.model}
              />
            </label>

            <label>
              <span className="label">Embedding Model</span>
              <input
                className="input"
                value={settings.embeddingModel}
                onChange={(event) => updateSetting('embeddingModel', event.target.value)}
                placeholder={DEFAULT_AI_SETTINGS.embeddingModel}
              />
            </label>

            <label className="md:col-span-2">
              <span className="label">Base URL</span>
              <input
                className="input"
                value={settings.baseUrl}
                onChange={(event) => updateSetting('baseUrl', event.target.value)}
                placeholder={DEFAULT_AI_SETTINGS.baseUrl}
              />
            </label>

            <label className="md:col-span-2">
              <span className="label">API Key</span>
              <input
                className="input font-mono"
                type="password"
                value={settings.apiKey}
                onChange={(event) => updateSetting('apiKey', event.target.value)}
                placeholder="nvapi-..."
                autoComplete="off"
              />
            </label>
          </div>

          {testResult && (
            <div className="mx-4 mb-4 rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className={cn('flex items-start gap-2 text-sm', testResult.ok ? 'text-emerald-300' : 'text-amber-300')}>
                {testResult.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-surface-border px-4 py-3">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button type="button" className="btn-secondary" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
              Test
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
