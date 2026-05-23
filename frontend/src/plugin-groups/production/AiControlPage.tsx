/*
```cypher
CREATE
  (f:File {name: "AiControlPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/AiControlPage", type: "module"}),
  (c1:Class {name: "AiControlActionType", type: "class", language: "typescript", signature: "type AiControlActionType"}),
  (c2:Class {name: "AiControlAction", type: "class", language: "typescript", signature: "interface AiControlAction"}),
  (c3:Class {name: "AiControlAppSurface", type: "class", language: "typescript", signature: "interface AiControlAppSurface"}),
  (c4:Class {name: "AiControlModel", type: "class", language: "typescript", signature: "interface AiControlModel"}),
  (c5:Class {name: "BuildAiControlModelInput", type: "class", language: "typescript", signature: "interface BuildAiControlModelInput"}),
  (c6:Class {name: "ChatMessage", type: "class", language: "typescript", signature: "interface ChatMessage"}),
  (c7:Class {name: "EmergentSignalStrength", type: "class", language: "typescript", signature: "type EmergentSignalStrength"}),
  (c8:Class {name: "EmergentSignal", type: "class", language: "typescript", signature: "interface EmergentSignal"}),
  (c9:Class {name: "AutopilotPlanPanelProps", type: "class", language: "typescript", signature: "interface AutopilotPlanPanelProps"}),
  (fn1:Function {name: "AiControlPage", type: "function", language: "typescript", signature: "function AiControlPage()"}),
  (fn2:Function {name: "ApiConnectionPanel", type: "function", language: "typescript", signature: "function ApiConnectionPanel(props: ApiConnectionPanelProps)"}),
  (fn3:Function {name: "ChatPanel", type: "function", language: "typescript", signature: "function ChatPanel(props: ChatPanelProps)"}),
  (fn4:Function {name: "ControlButtonMenu", type: "function", language: "typescript", signature: "function ControlButtonMenu(props: ControlButtonMenuProps)"}),
  (fn5:Function {name: "ControlButton", type: "function", language: "typescript", signature: "function ControlButton(props: { action: AiControlAction; executing: boolean; onExecute: (action: AiControlAction) => void })"}),
  (fn6:Function {name: "ContextMenu", type: "function", language: "typescript", signature: "function ContextMenu(props: { model: AiControlModel })"}),
  (fn7:Function {name: "AppAccessMenu", type: "function", language: "typescript", signature: "function AppAccessMenu(props: { apps: AiControlAppSurface[]; onRefresh: () => void })"}),
  (fn8:Function {name: "Metric", type: "function", language: "typescript", signature: "function Metric(props: { label: string; value: string | number; detail: string; tone?: string })"}),
  (fn9:Function {name: "StatusPill", type: "function", language: "typescript", signature: "function StatusPill(props: { label: string; tone?: string })"}),
  (fn10:Function {name: "buildAiControlModel", type: "function", language: "typescript", signature: "function buildAiControlModel(input: BuildAiControlModelInput): AiControlModel"}),
  (fn11:Function {name: "buildActionQueue", type: "function", language: "typescript", signature: "function buildActionQueue(issues: IssueSummary[], assets: AssetSummary[]): AiControlAction[]"}),
  (fn12:Function {name: "executeAiControlAction", type: "function", language: "typescript", signature: "async function executeAiControlAction(action: AiControlAction): Promise<void>"}),
  (fn13:Function {name: "buildChatContext", type: "function", language: "typescript", signature: "function buildChatContext(model: AiControlModel): string"}),
  (fn14:Function {name: "pickRiskIssue", type: "function", language: "typescript", signature: "function pickRiskIssue(issues: IssueSummary[]): IssueSummary | undefined"}),
  (fn15:Function {name: "pickReviewIssue", type: "function", language: "typescript", signature: "function pickReviewIssue(issues: IssueSummary[]): IssueSummary | undefined"}),
  (fn16:Function {name: "pickAssetTarget", type: "function", language: "typescript", signature: "function pickAssetTarget(assets: AssetSummary[]): AssetSummary | undefined"}),
  (fn17:Function {name: "isOverdue", type: "function", language: "typescript", signature: "function isOverdue(issue: IssueSummary): boolean"}),
  (fn18:Function {name: "shortDate", type: "function", language: "typescript", signature: "function shortDate(value?: string): string"}),
  (fn19:Function {name: "messageId", type: "function", language: "typescript", signature: "function messageId(prefix: string): string"}),
  (fn20:Function {name: "EmergentControlMenu", type: "function", language: "typescript", signature: "function EmergentControlMenu(props: { model: AiControlModel })"}),
  (fn21:Function {name: "buildEmergentSignals", type: "function", language: "typescript", signature: "function buildEmergentSignals(issues: IssueSummary[], assets: AssetSummary[], deliveryReadyPercent: number): EmergentSignal[]"}),
  (fn23:Function {name: "pickVersionedAsset", type: "function", language: "typescript", signature: "function pickVersionedAsset(assets: AssetSummary[]): AssetSummary | undefined"}),
  (fn26:Function {name: "AutopilotPlanPanel", type: "function", language: "typescript", signature: "function AutopilotPlanPanel(props: AutopilotPlanPanelProps)"}),
  (fn27:Function {name: "handleGenerateAutopilotPlan", type: "function", language: "typescript", signature: "function handleGenerateAutopilotPlan()"}),
  (fn28:Function {name: "handleToggleCommandApproval", type: "function", language: "typescript", signature: "function handleToggleCommandApproval(commandId: string)"}),
  (fn29:Function {name: "updateAutopilotCommandStatus", type: "function", language: "typescript", signature: "function updateAutopilotCommandStatus(commandId: string, status: AutopilotCommand['status'])"}),
  (fn30:Function {name: "handleExecuteAutopilotCommand", type: "function", language: "typescript", signature: "async function handleExecuteAutopilotCommand(command: AutopilotCommand)"}),
  (fn31:Function {name: "handleRunApprovedAutopilot", type: "function", language: "typescript", signature: "async function handleRunApprovedAutopilot()"}),
  (v1:Variable {name: "DEFAULT_PROJECT_ID", type: "variable"}),
  (v2:Variable {name: "AI_CONTROL_APPS", type: "variable"}),
  (v3:Variable {name: "settings", type: "variable"}),
  (v4:Variable {name: "messages", type: "variable"}),
  (v5:Variable {name: "model", type: "variable"}),
  (v6:Variable {name: "autopilotPlan", type: "variable"}),
  (v7:Variable {name: "approvedCommandIds", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (m)-[:CONTAINS]->(fn12),
  (m)-[:CONTAINS]->(fn13),
  (m)-[:CONTAINS]->(fn14),
  (m)-[:CONTAINS]->(fn15),
  (m)-[:CONTAINS]->(fn16),
  (m)-[:CONTAINS]->(fn17),
  (m)-[:CONTAINS]->(fn18),
  (m)-[:CONTAINS]->(fn19),
  (m)-[:CONTAINS]->(fn20),
  (m)-[:CONTAINS]->(fn21),
  (m)-[:CONTAINS]->(fn23),
  (m)-[:CONTAINS]->(fn26),
  (fn1)-[:CONTAINS]->(fn27),
  (fn1)-[:CONTAINS]->(fn28),
  (fn1)-[:CONTAINS]->(fn29),
  (fn1)-[:CONTAINS]->(fn30),
  (fn1)-[:CONTAINS]->(fn31),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn26),
  (fn1)-[:CALLS]->(fn20),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn10),
  (fn1)-[:CALLS]->(fn12),
  (fn1)-[:CALLS]->(fn13),
  (fn1)-[:CALLS]->(fn19),
  (fn1)-[:CALLS]->(fn27),
  (fn1)-[:CALLS]->(fn28),
  (fn1)-[:CALLS]->(fn30),
  (fn1)-[:CALLS]->(fn31),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn4)-[:CALLS]->(fn5),
  (fn5)-[:CALLS]->(fn9),
  (fn6)-[:CALLS]->(fn8),
  (fn7)-[:CALLS]->(fn9),
  (fn26)-[:CALLS]->(fn9),
  (fn20)-[:CALLS]->(fn8),
  (fn20)-[:CALLS]->(fn9),
  (fn10)-[:CALLS]->(fn11),
  (fn10)-[:CALLS]->(fn21),
  (fn10)-[:CALLS]->(fn17),
  (fn10)-[:USES]->(v2),
  (fn11)-[:CALLS]->(fn14),
  (fn11)-[:CALLS]->(fn15),
  (fn11)-[:CALLS]->(fn16),
  (fn11)-[:CALLS]->(fn23),
  (fn11)-[:CALLS]->(fn18),
  (fn13)-[:USES]->(v5),
  (fn21)-[:CALLS]->(fn14),
  (fn21)-[:CALLS]->(fn15),
  (fn21)-[:CALLS]->(fn23),
  (fn27)-[:USES]->(v5),
  (fn27)-[:USES]->(v6),
  (fn28)-[:USES]->(v7),
  (fn29)-[:USES]->(v6),
  (fn30)-[:CALLS]->(fn12),
  (fn30)-[:USES]->(v5),
  (fn30)-[:USES]->(v7),
  (fn31)-[:CALLS]->(fn30),
  (fn31)-[:USES]->(v6),
  (fn31)-[:USES]->(v7),
  (fn14)-[:CALLS]->(fn17);
```
*/

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Database,
  FlaskConical,
  GitBranch,
  GitPullRequest,
  KeyRound,
  ListChecks,
  Loader2,
  MessageSquare,
  Network,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useAssets } from '@/hooks/useAssets';
import { useIssues, useManagementIntelligence } from '@/hooks/useProduction';
import {
  useEnterpriseControls,
  useProjectAutomation,
  useProjectManagementPlan,
  useProjectReports,
  useProjectWorkflow,
} from '@/hooks/useProjectManagement';
import {
  DEFAULT_AI_SETTINGS,
  clearAiSettings,
  loadAiSettings,
  saveAiSettings,
  type AiSettings,
} from '@/lib/aiSettings';
import { productionApi } from '@/lib/productionApi';
import { cn } from '@/lib/utils';
import {
  buildAutopilotPlan,
  type AutopilotCommand,
  type AutopilotPlan,
} from '@/plugin-groups/production/aiAutopilotModel';
import type { AssetSummary, AssetType } from '@/types/asset';
import type { IssueSummary } from '@/types/production';

const DEFAULT_PROJECT_ID = '00000000-0000-0000-0000-000000000001';

const AI_CONTROL_APPS: AiControlAppSurface[] = [
  { name: 'Jira Flow', reads: ['issues', 'reviews', 'work logs'], writes: ['replica issue proposals', 'replica comments', 'replica transitions', 'replica evidence links'] },
  { name: 'Data Lake', reads: ['assets', 'code category', 'tags'], writes: ['replica asset tags', 'replica review notes', 'replica AI index state'] },
  { name: 'Version Graph', reads: ['asset versions', 'branches', 'commit ids'], writes: ['replica version gates', 'replica commit review notes'] },
  { name: 'Governance', reads: ['roles', 'CI gates', 'audit policy'], writes: ['replica approval proposals'] },
];

type AiControlActionType =
  | 'comment_risk'
  | 'transition_review'
  | 'log_ai_work'
  | 'update_asset_evidence'
  | 'index_data_lake'
  | 'stamp_version_gate'
  | 'create_issue_from_asset'
  | 'attach_asset_evidence';

type EmergentSignalStrength = 'ready' | 'watch' | 'blocked';

interface AiControlAction {
  id: string;
  type: AiControlActionType;
  title: string;
  app: string;
  targetLabel: string;
  targetIssueId?: string;
  targetAssetId?: string;
  targetAssetTags?: string[];
  targetAssetName?: string;
  targetAssetType?: AssetType;
  targetAssetVersion?: number;
  targetProjectId?: string;
  severity: 'normal' | 'warning' | 'critical';
  intent: string;
  writes: string[];
  disabledReason?: string;
}

interface EmergentSignal {
  id: string;
  title: string;
  source: string;
  detail: string;
  strength: EmergentSignalStrength;
}

interface AiControlAppSurface {
  name: string;
  reads: string[];
  writes: string[];
}

interface AiControlModel {
  totalIssues: number;
  riskIssues: number;
  reviewIssues: number;
  activeAssets: number;
  codeAssets: number;
  versionedAssets: number;
  planningRecords: number;
  automationRules: number;
  workflowTransitions: number;
  enterpriseControls: number;
  deliveryReadyPercent: number;
  emergentSignals: EmergentSignal[];
  apps: AiControlAppSurface[];
  actions: AiControlAction[];
}

interface BuildAiControlModelInput {
  issues: IssueSummary[];
  assets: AssetSummary[];
  planningRecords: number;
  automationRules: number;
  workflowTransitions: number;
  enterpriseControls: number;
  deliveryReadyPercent: number;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
}

interface ApiConnectionPanelProps {
  settings: AiSettings;
  testing: boolean;
  testResult: { ok: boolean; message: string } | null;
  onUpdate: <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => void;
  onSave: () => void;
  onReset: () => void;
  onTest: () => void;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  value: string;
  sending: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

interface ControlButtonMenuProps {
  actions: AiControlAction[];
  executingId: string | null;
  onExecute: (action: AiControlAction) => void;
}

interface AutopilotPlanPanelProps {
  goal: string;
  plan: AutopilotPlan | null;
  approvedCommandIds: Set<string>;
  runningCommandId: string | null;
  onGoalChange: (value: string) => void;
  onGeneratePlan: () => void;
  onToggleApproval: (commandId: string) => void;
  onExecuteCommand: (command: AutopilotCommand) => void;
  onRunApproved: () => void;
}

export function AiControlPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [runningCommandId, setRunningCommandId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [ragMemoryStatus, setRagMemoryStatus] = useState<string | null>(null);
  const [autopilotGoal, setAutopilotGoal] = useState('Drive this project to delivery readiness with lake evidence, version gates, and issue flow.');
  const [autopilotPlan, setAutopilotPlan] = useState<AutopilotPlan | null>(null);
  const [approvedCommandIds, setApprovedCommandIds] = useState<Set<string>>(() => new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'AI Control can correlate data lake assets, version history, and Jira-style flow. Control buttons now record replica-only shadow actions for review.',
    },
  ]);

  const { data: issueData, isLoading: issuesLoading } = useIssues({ page_size: 250 });
  const { data: assetsData } = useAssets({ page_size: 250 });
  const { data: intelligence } = useManagementIntelligence();
  const { data: plan } = useProjectManagementPlan(DEFAULT_PROJECT_ID);
  const { data: automation } = useProjectAutomation(DEFAULT_PROJECT_ID);
  const { data: workflow } = useProjectWorkflow(DEFAULT_PROJECT_ID);
  const { data: reports } = useProjectReports(DEFAULT_PROJECT_ID);
  const { data: enterprise } = useEnterpriseControls(DEFAULT_PROJECT_ID);

  useEffect(() => {
    setSettings(loadAiSettings());
  }, []);

  const issues = issueData?.data ?? [];
  const assets = assetsData?.data ?? [];
  const model = useMemo(
    () =>
      buildAiControlModel({
        issues,
        assets,
        planningRecords:
          (plan?.epics.length ?? 0) +
          (plan?.sprints.length ?? 0) +
          (plan?.dependencies.length ?? 0),
        automationRules: automation?.rules.length ?? intelligence?.automation_rules.length ?? 0,
        workflowTransitions: workflow?.transitions.length ?? 0,
        enterpriseControls:
          (enterprise?.roles.length ?? 0) +
          (enterprise?.notifications.length ?? 0) +
          (enterprise?.ci_gates.length ?? 0),
        deliveryReadyPercent: reports?.delivery_readiness.ready_percent ?? 0,
      }),
    [assets, automation?.rules.length, enterprise, intelligence?.automation_rules.length, issues, plan, reports, workflow?.transitions.length]
  );

  function handleGenerateAutopilotPlan() {
    const plan = buildAutopilotPlan({
      goal: autopilotGoal,
      issues: model.totalIssues,
      assets: model.activeAssets,
      codeAssets: model.codeAssets,
      versionedAssets: model.versionedAssets,
      deliveryReadyPercent: model.deliveryReadyPercent,
      actions: model.actions.map((action) => ({
        id: action.id,
        title: action.title,
        app: action.app,
        targetLabel: action.targetLabel,
        writes: action.writes,
        disabled: Boolean(action.disabledReason),
      })),
      signals: model.emergentSignals.map((signal) => ({
        id: signal.id,
        source: signal.source,
        strength: signal.strength,
      })),
    });
    setAutopilotPlan(plan);
    setApprovedCommandIds(new Set());
    toast.success('Autopilot plan generated');
  }

  function handleToggleCommandApproval(commandId: string) {
    setApprovedCommandIds((current) => {
      const next = new Set(current);
      if (next.has(commandId)) {
        next.delete(commandId);
      } else {
        next.add(commandId);
      }
      return next;
    });
  }

  function updateAutopilotCommandStatus(commandId: string, status: AutopilotCommand['status']) {
    setAutopilotPlan((current) => {
      if (!current) return current;
      return {
        ...current,
        commands: current.commands.map((command) =>
          command.id === commandId ? { ...command, status } : command
        ),
      };
    });
  }

  async function handleExecuteAutopilotCommand(command: AutopilotCommand) {
    if (command.status === 'blocked') {
      toast.error('Command is blocked by missing context');
      return;
    }

    if (command.approvalRequired && !approvedCommandIds.has(command.id)) {
      toast.error('Command requires approval');
      return;
    }

    const action = command.actionId
      ? model.actions.find((candidate) => candidate.id === command.actionId)
      : undefined;

    setRunningCommandId(command.id);
    try {
      if (action) {
        await executeAiControlAction(action);
        invalidateAiContext();
        await refreshRagMemory(action.intent);
      }
      updateAutopilotCommandStatus(command.id, 'done');
      setLastResult(`Autopilot recorded ${command.title} as a replica shadow action`);
      toast.success(`${command.title} recorded to replica`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setLastResult(message);
      toast.error(message);
    } finally {
      setRunningCommandId(null);
    }
  }

  async function handleRunApprovedAutopilot() {
    const runnableCommands =
      autopilotPlan?.commands.filter(
        (command) =>
          command.status !== 'done' &&
          command.status !== 'blocked' &&
          (!command.approvalRequired || approvedCommandIds.has(command.id))
      ) ?? [];

    if (runnableCommands.length === 0) {
      toast.error('No approved commands to run');
      return;
    }

    for (const command of runnableCommands) {
      await handleExecuteAutopilotCommand(command);
    }
  }

  function updateSetting<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function invalidateAiContext() {
    queryClient.invalidateQueries({ queryKey: ['management-intelligence'] });
    queryClient.invalidateQueries({ queryKey: ['issues'] });
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    queryClient.invalidateQueries({ queryKey: ['project-management-plan'] });
    queryClient.invalidateQueries({ queryKey: ['project-automation'] });
    queryClient.invalidateQueries({ queryKey: ['project-workflow'] });
    queryClient.invalidateQueries({ queryKey: ['project-reports'] });
    queryClient.invalidateQueries({ queryKey: ['enterprise-controls'] });
  }

  function handleSaveSettings() {
    const saved = saveAiSettings(settings);
    setSettings(saved);
    setTestResult(null);
    invalidateAiContext();
    toast.success('AI API saved');
  }

  function handleResetSettings() {
    clearAiSettings();
    setSettings(DEFAULT_AI_SETTINGS);
    setTestResult(null);
    invalidateAiContext();
    toast.success('AI API reset');
  }

  async function handleTestSettings() {
    setTesting(true);
    setTestResult(null);
    saveAiSettings(settings);

    try {
      const result = await productionApi.management.chat({
        message: 'Confirm the AI Control API connection in one concise sentence.',
        context: buildChatContext(model),
      });
      const status = result.ai_status;
      if (status?.used) {
        setTestResult({ ok: true, message: `${status.provider ?? 'AI provider'} responded with ${result.actions.length} control actions.` });
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

  async function handleSendChat() {
    const text = chatInput.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = { id: messageId('user'), role: 'user', content: text };
    setMessages((current) => [...current, userMessage]);
    setChatInput('');
    setSending(true);
    saveAiSettings(settings);

    try {
      const result = await productionApi.management.chat({
        message: text,
        context: buildChatContext(model),
      });
      setMessages((current) => [
        ...current,
        { id: messageId('assistant'), role: 'assistant', content: result.message },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI chat failed';
      setMessages((current) => [
        ...current,
        { id: messageId('system'), role: 'system', content: message },
      ]);
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  async function refreshRagMemory(query: string) {
    try {
      const result = await productionApi.management.ragSearch({
        query,
        limit: 3,
      });
      const state = result.qdrant_enabled ? 'Qdrant indexed' : 'disabled';
      setRagMemoryStatus(`${state}: ${result.matches.length} related operation memories via ${result.embedding_provider}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'RAG memory unavailable';
      setRagMemoryStatus(`RAG memory unavailable: ${message}`);
    }
  }

  async function handleExecute(action: AiControlAction) {
    setExecutingId(action.id);
    setLastResult(null);

    try {
      await executeAiControlAction(action);
      invalidateAiContext();
      await refreshRagMemory(action.intent);
      setLastResult(`Recorded ${action.title} as a replica shadow action`);
      toast.success(`${action.title} recorded to replica`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setLastResult(message);
      toast.error(message);
    } finally {
      setExecutingId(null);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-300">
          <Bot className="h-3.5 w-3.5" />
          AI Operator
        </div>
        <h1 className="mt-1 truncate text-xl font-bold text-white">AI Control</h1>
        <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
            Configure the AI API, chat with the operator, then record guarded replica-only actions.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.35fr]">
          <ApiConnectionPanel
            settings={settings}
            testing={testing}
            testResult={testResult}
            onUpdate={updateSetting}
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
            onTest={handleTestSettings}
          />
          <ChatPanel
            messages={messages}
            value={chatInput}
            sending={sending}
            onChange={setChatInput}
            onSend={handleSendChat}
          />
        </section>

        <AutopilotPlanPanel
          goal={autopilotGoal}
          plan={autopilotPlan}
          approvedCommandIds={approvedCommandIds}
          runningCommandId={runningCommandId}
          onGoalChange={setAutopilotGoal}
          onGeneratePlan={handleGenerateAutopilotPlan}
          onToggleApproval={handleToggleCommandApproval}
          onExecuteCommand={handleExecuteAutopilotCommand}
          onRunApproved={handleRunApprovedAutopilot}
        />

        {issuesLoading && (
          <div className="mt-4 rounded-lg border border-surface-border bg-surface-secondary p-4 text-sm text-slate-400">
            Loading AI control context
          </div>
        )}

        {lastResult && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-matcha-300/25 bg-matcha-400/10 p-3 text-sm text-matcha-200">
            <CheckCircle2 className="h-4 w-4" />
            {lastResult}
          </div>
        )}

        {ragMemoryStatus && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-300/25 bg-brand-400/10 p-3 text-sm text-brand-100">
            <Database className="h-4 w-4" />
            <span>RAG Memory {ragMemoryStatus}</span>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <EmergentControlMenu model={model} />
          <ControlButtonMenu actions={model.actions} executingId={executingId} onExecute={handleExecute} />
          <ContextMenu model={model} />
          <AppAccessMenu apps={model.apps} onRefresh={invalidateAiContext} />
        </div>
      </div>
    </div>
  );
}

function ApiConnectionPanel({
  settings,
  testing,
  testResult,
  onUpdate,
  onSave,
  onReset,
  onTest,
}: ApiConnectionPanelProps) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <KeyRound className="h-4 w-4 text-brand-300" />
            API Connection
          </div>
          <div className="mt-1 text-xs text-slate-500">{settings.provider || 'Custom AI'} / {settings.model || 'No model'}</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          onClick={() => onUpdate('enabled', !settings.enabled)}
          className={cn(
            'relative h-6 w-11 rounded-full border transition-colors',
            settings.enabled ? 'border-brand-500/60 bg-brand-500/40' : 'border-surface-border bg-surface-elevated'
          )}
        >
          <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', settings.enabled ? 'translate-x-5' : 'translate-x-0.5')} />
        </button>
      </div>

      <div className="grid gap-4 p-4">
        <label>
          <span className="label">Provider</span>
          <input className="input" value={settings.provider} onChange={(event) => onUpdate('provider', event.target.value)} />
        </label>
        <label>
          <span className="label">Model</span>
          <input className="input" value={settings.model} onChange={(event) => onUpdate('model', event.target.value)} />
        </label>
        <label>
          <span className="label">Embedding Model</span>
          <input className="input" value={settings.embeddingModel} onChange={(event) => onUpdate('embeddingModel', event.target.value)} />
        </label>
        <label>
          <span className="label">Base URL</span>
          <input className="input" value={settings.baseUrl} onChange={(event) => onUpdate('baseUrl', event.target.value)} />
        </label>
        <label>
          <span className="label">API Key</span>
          <input
            className="input font-mono"
            type="password"
            value={settings.apiKey}
            onChange={(event) => onUpdate('apiKey', event.target.value)}
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
        <button type="button" className="btn-secondary" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button type="button" className="btn-secondary" onClick={onTest} disabled={testing}>
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
          Test API
        </button>
        <button type="button" className="btn-primary" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save API
        </button>
      </div>
    </section>
  );
}

function ChatPanel({ messages, value, sending, onChange, onSend }: ChatPanelProps) {
  return (
    <section className="flex min-h-[560px] flex-col rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <MessageSquare className="h-4 w-4 text-brand-300" />
            Chat
          </div>
          <div className="mt-1 text-xs text-slate-500">Ask, plan, and decide before running a control button.</div>
        </div>
        <StatusPill label="control gated" tone="text-brand-300" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[88%] rounded-lg border p-3 text-sm leading-relaxed',
              message.role === 'user'
                ? 'ml-auto border-brand-500/30 bg-brand-500/10 text-brand-100'
                : message.role === 'system'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                : 'border-surface-border bg-surface-elevated text-slate-200'
            )}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="border-t border-surface-border p-4">
        <label className="sr-only" htmlFor="ai-control-message">Message</label>
        <textarea
          id="ai-control-message"
          className="input min-h-[86px] resize-y"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask AI Control what to inspect or which guarded action to run..."
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <div className="mt-3 flex justify-end">
          <button type="button" className="btn-primary" onClick={onSend} disabled={sending || !value.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

function AutopilotPlanPanel({
  goal,
  plan,
  approvedCommandIds,
  runningCommandId,
  onGoalChange,
  onGeneratePlan,
  onToggleApproval,
  onExecuteCommand,
  onRunApproved,
}: AutopilotPlanPanelProps) {
  return (
    <section className="mt-4 rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex flex-col gap-3 border-b border-surface-border px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <BrainCircuit className="h-4 w-4 text-brand-300" />
            AI Autopilot
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {plan ? `${plan.mode} / ${(plan.confidence * 100).toFixed(0)}% confidence` : 'goal-driven command queue'}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={onGeneratePlan}>
            <ListChecks className="h-4 w-4" />
            Generate Plan
          </button>
          <button type="button" className="btn-primary" onClick={onRunApproved} disabled={!plan || Boolean(runningCommandId)}>
            {runningCommandId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run Approved
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[0.8fr_1.4fr]">
        <div className="space-y-3">
          <label>
            <span className="label">Goal</span>
            <textarea
              className="input min-h-[118px] resize-y"
              value={goal}
              onChange={(event) => onGoalChange(event.target.value)}
            />
          </label>
          {plan && (
            <div className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="text-sm font-medium text-slate-100">{plan.summary}</div>
              <div className="mt-3 space-y-1">
                {plan.auditTrail.map((entry) => (
                  <div key={entry} className="text-xs text-slate-500">{entry}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!plan && (
            <div className="rounded-lg border border-surface-border bg-surface-elevated p-4 text-sm text-slate-500">
              No autopilot plan generated.
            </div>
          )}
          {plan?.commands.map((command) => {
            const approved = approvedCommandIds.has(command.id);
            const running = runningCommandId === command.id;
            const executeDisabled =
              command.status === 'blocked' ||
              command.status === 'done' ||
              running ||
              (command.approvalRequired && !approved);

            return (
              <section key={command.id} className="rounded-lg border border-surface-border bg-surface-elevated p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-100">{command.title}</div>
                      <StatusPill label={command.app} tone="text-brand-300" />
                      <StatusPill
                        label={command.risk}
                        tone={command.risk === 'high' ? 'text-red-300' : command.risk === 'medium' ? 'text-amber-300' : 'text-emerald-300'}
                      />
                      <StatusPill
                        label={command.status}
                        tone={command.status === 'done' ? 'text-emerald-300' : command.status === 'blocked' ? 'text-red-300' : 'text-slate-300'}
                      />
                    </div>
                    <div className="mt-1 font-mono text-xs text-brand-300">{command.targetLabel}</div>
                    <div className="mt-2 text-xs leading-relaxed text-slate-400">{command.intent}</div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {command.approvalRequired && (
                      <button
                        type="button"
                        className={approved ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => onToggleApproval(command.id)}
                        disabled={command.status === 'blocked' || command.status === 'done'}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {approved ? 'Approved' : 'Approve'}
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onExecuteCommand(command)}
                      disabled={executeDisabled}
                    >
                      {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Execute
                    </button>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-surface-border bg-surface p-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Impact Preview</div>
                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    {command.impactPreview.map((item) => (
                      <div key={item} className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-slate-400">{item}</div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmergentControlMenu({ model }: { model: AiControlModel }) {
  return (
    <details open className="group rounded-lg border border-surface-border bg-surface-secondary">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Network className="h-4 w-4 text-brand-300" />
          Emergent Control Matrix
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-surface-border p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Data Lake" value={model.activeAssets} detail={`${model.codeAssets} code assets`} tone="text-emerald-300" />
          <Metric label="Version Graph" value={model.versionedAssets} detail="branch-ready records" tone="text-cyan-300" />
          <Metric label="Jira Flow" value={model.totalIssues} detail={`${model.reviewIssues} review gates`} tone="text-brand-300" />
          <Metric label="Signals" value={model.emergentSignals.length} detail={`${model.riskIssues} risk inputs`} tone="text-amber-300" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {model.emergentSignals.map((signal) => (
            <section key={signal.id} className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-100">{signal.title}</div>
                  <div className="mt-1 truncate font-mono text-xs text-brand-300">{signal.source}</div>
                </div>
                <StatusPill
                  label={signal.strength}
                  tone={signal.strength === 'blocked' ? 'text-red-300' : signal.strength === 'watch' ? 'text-amber-300' : 'text-emerald-300'}
                />
              </div>
              <div className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">{signal.detail}</div>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}

function ControlButtonMenu({ actions, executingId, onExecute }: ControlButtonMenuProps) {
  return (
    <details open className="group rounded-lg border border-surface-border bg-surface-secondary">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Sparkles className="h-4 w-4 text-brand-300" />
          Common Control Buttons
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid gap-3 border-t border-surface-border p-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <ControlButton
            key={action.id}
            action={action}
            executing={executingId === action.id}
            onExecute={onExecute}
          />
        ))}
      </div>
    </details>
  );
}

function ControlButton({
  action,
  executing,
  onExecute,
}: {
  action: AiControlAction;
  executing: boolean;
  onExecute: (action: AiControlAction) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onExecute(action)}
      disabled={executing || Boolean(action.disabledReason)}
      aria-label={`Execute ${action.title}`}
      className="flex min-h-[156px] flex-col items-start rounded-lg border border-surface-border bg-surface-elevated p-3 text-left transition-colors hover:border-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {action.app === 'Version Graph' ? (
              <GitBranch className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            ) : action.app === 'Jira Flow' ? (
              <GitPullRequest className="h-3.5 w-3.5 shrink-0 text-brand-300" />
            ) : action.app === 'Data Lake' ? (
              <Database className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            )}
            <div className="truncate text-sm font-semibold text-slate-100">{action.title}</div>
          </div>
          <div className="mt-1 truncate font-mono text-xs text-brand-300">{action.targetLabel}</div>
        </div>
        <StatusPill
          label={action.severity}
          tone={action.severity === 'critical' ? 'text-red-300' : action.severity === 'warning' ? 'text-amber-300' : 'text-emerald-300'}
        />
      </div>
      <div className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">
        {action.disabledReason ?? action.intent}
      </div>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs font-medium text-brand-200">
        {executing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {executing ? 'Executing' : action.disabledReason ? 'No target' : 'Execute'}
      </div>
    </button>
  );
}

function ContextMenu({ model }: { model: AiControlModel }) {
  return (
    <details className="group rounded-lg border border-surface-border bg-surface-secondary">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Database className="h-4 w-4 text-brand-300" />
          Context Snapshot
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid gap-3 border-t border-surface-border p-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Issues" value={model.totalIssues} detail={`${model.riskIssues} risk inputs`} />
        <Metric label="Assets" value={model.activeAssets} detail="data lake records" tone="text-emerald-300" />
        <Metric label="Planning" value={model.planningRecords} detail="epics, sprints, links" tone="text-cyan-300" />
        <Metric label="Automation" value={model.automationRules} detail={`${model.workflowTransitions} transitions`} tone="text-brand-300" />
        <Metric label="Readiness" value={`${model.deliveryReadyPercent}%`} detail="delivery signal" tone="text-amber-300" />
      </div>
    </details>
  );
}

function AppAccessMenu({ apps, onRefresh }: { apps: AiControlAppSurface[]; onRefresh: () => void }) {
  return (
    <details className="group rounded-lg border border-surface-border bg-surface-secondary">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <RefreshCw className="h-4 w-4 text-brand-300" />
          App Access
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-surface-border p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {apps.map((app) => (
            <div key={app.name} className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-slate-100">{app.name}</div>
                <StatusPill label="read/write" tone="text-emerald-300" />
              </div>
              <div className="mt-2 text-xs leading-relaxed text-slate-500">Reads: {app.reads.join(', ')}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">Replica writes: {app.writes.join(', ')}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" className="btn-secondary" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh Context
          </button>
        </div>
      </div>
    </details>
  );
}

function Metric({
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
    <section className="rounded-lg border border-surface-border bg-surface-elevated p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </section>
  );
}

function StatusPill({ label, tone = 'text-slate-300' }: { label: string; tone?: string }) {
  return (
    <span className={cn('rounded-md border border-surface-border bg-surface px-2 py-0.5 text-xs', tone)}>
      {label}
    </span>
  );
}

function buildAiControlModel(input: BuildAiControlModelInput): AiControlModel {
  const reviewIssues = input.issues.filter((issue) =>
    ['submitted', 'internal_review', 'client_review', 'revision_required'].includes(issue.status)
  );
  const riskIssues = input.issues.filter(
    (issue) => issue.priority === 'urgent' || ['warning', 'failed'].includes(issue.qa_status) || isOverdue(issue)
  );
  const codeAssets = input.assets.filter((asset) => asset.asset_type === 'code');
  const versionedAssets = input.assets.filter((asset) => asset.version > 1);
  const emergentSignals = buildEmergentSignals(input.issues, input.assets, input.deliveryReadyPercent);

  return {
    totalIssues: input.issues.length,
    riskIssues: riskIssues.length,
    reviewIssues: reviewIssues.length,
    activeAssets: input.assets.length,
    codeAssets: codeAssets.length,
    versionedAssets: versionedAssets.length,
    planningRecords: input.planningRecords,
    automationRules: input.automationRules,
    workflowTransitions: input.workflowTransitions,
    enterpriseControls: input.enterpriseControls,
    deliveryReadyPercent: input.deliveryReadyPercent,
    emergentSignals,
    apps: AI_CONTROL_APPS,
    actions: buildActionQueue(input.issues, input.assets),
  };
}

function buildActionQueue(issues: IssueSummary[], assets: AssetSummary[]): AiControlAction[] {
  const riskIssue = pickRiskIssue(issues);
  const reviewIssue = pickReviewIssue(issues);
  const workIssue = issues.find((issue) => issue.status === 'in_progress') ?? riskIssue ?? issues[0];
  const asset = pickAssetTarget(assets);
  const codeAsset = assets.find((item) => item.asset_type === 'code');
  const versionAsset = pickVersionedAsset(assets) ?? asset;
  const riskTarget = riskIssue ?? workIssue ?? reviewIssue ?? issues[0];
  const reviewTarget = reviewIssue ?? workIssue ?? riskIssue ?? issues[0];
  const evidenceTarget = riskTarget ?? reviewTarget ?? workIssue ?? issues[0];

  return [
    {
      id: 'comment-risk',
      type: 'comment_risk',
      title: 'Risk Comment',
      app: 'Jira Flow',
      targetIssueId: riskTarget?.id,
      targetLabel: riskTarget ? `${riskTarget.issue_key} / ${shortDate(riskTarget.due_date)}` : 'No issue target',
      severity: riskTarget?.qa_status === 'failed' ? 'critical' : 'warning',
      intent: riskTarget ? `Propose an internal AI risk note for ${riskTarget.title}.` : 'No issue is available for risk annotation.',
      writes: ['replica comment proposal'],
      disabledReason: riskTarget ? undefined : 'Create or sync an issue before writing a risk comment.',
    },
    {
      id: 'transition-review',
      type: 'transition_review',
      title: 'Review Transition',
      app: 'Jira Flow',
      targetIssueId: reviewTarget?.id,
      targetLabel: reviewTarget ? `${reviewTarget.issue_key} / ${reviewTarget.status}` : 'No issue target',
      severity: 'normal',
      intent: reviewTarget ? `Propose moving ${reviewTarget.title} into internal review with an auditable AI actor.` : 'No issue is available for workflow transition.',
      writes: ['replica status transition proposal'],
      disabledReason: reviewTarget ? undefined : 'Create or sync an issue before running a workflow transition.',
    },
    {
      id: 'log-ai-work',
      type: 'log_ai_work',
      title: 'AI Work Log',
      app: 'Jira Flow',
      targetIssueId: workIssue?.id,
      targetLabel: workIssue ? `${workIssue.issue_key} / ${workIssue.story_points ?? 0} pts` : 'No issue target',
      severity: 'normal',
      intent: workIssue ? `Propose a cross-app context synthesis log for ${workIssue.title}.` : 'No issue is available for AI work logging.',
      writes: ['replica work log proposal'],
      disabledReason: workIssue ? undefined : 'Create or sync an issue before logging AI work.',
    },
    {
      id: 'update-asset-evidence',
      type: 'update_asset_evidence',
      title: 'Asset Evidence Update',
      app: 'Data Lake',
      targetAssetId: asset?.id,
      targetAssetTags: asset?.tags,
      targetAssetName: asset?.name,
      targetAssetType: asset?.asset_type,
      targetAssetVersion: asset?.version,
      targetProjectId: asset?.project_id,
      targetLabel: asset?.original_filename ?? 'No asset target',
      severity: asset?.asset_type === 'code' ? 'warning' : 'normal',
      intent: asset ? `Propose marking ${asset.name} as AI-reviewed evidence for cross-app retrieval.` : 'No data lake asset is available for evidence tagging.',
      writes: ['replica asset tag proposal', 'replica review note'],
      disabledReason: asset ? undefined : 'Upload or sync an asset before writing evidence tags.',
    },
    {
      id: 'index-data-lake',
      type: 'index_data_lake',
      title: 'Lake Index',
      app: 'Data Lake',
      targetAssetId: (codeAsset ?? asset)?.id,
      targetAssetTags: (codeAsset ?? asset)?.tags,
      targetAssetName: (codeAsset ?? asset)?.name,
      targetAssetType: (codeAsset ?? asset)?.asset_type,
      targetAssetVersion: (codeAsset ?? asset)?.version,
      targetProjectId: (codeAsset ?? asset)?.project_id,
      targetLabel: (codeAsset ?? asset)?.original_filename ?? 'No asset target',
      severity: codeAsset ? 'warning' : 'normal',
      intent: codeAsset
        ? `Propose promoting ${codeAsset.name} into the AI-readable code asset index.`
        : asset
        ? `Propose promoting ${asset.name} into the AI-readable data lake index.`
        : 'No asset is available for lake indexing.',
      writes: ['replica index proposal', 'replica review note'],
      disabledReason: codeAsset || asset ? undefined : 'Upload or sync an asset before indexing the data lake.',
    },
    {
      id: 'version-gate',
      type: 'stamp_version_gate',
      title: 'Version Gate',
      app: 'Version Graph',
      targetAssetId: versionAsset?.id,
      targetAssetTags: versionAsset?.tags,
      targetAssetName: versionAsset?.name,
      targetAssetType: versionAsset?.asset_type,
      targetAssetVersion: versionAsset?.version,
      targetProjectId: versionAsset?.project_id,
      targetLabel: versionAsset ? `${versionAsset.original_filename} / v${versionAsset.version}` : 'No version target',
      severity: versionAsset && versionAsset.version > 1 ? 'warning' : 'normal',
      intent: versionAsset
        ? `Propose stamping ${versionAsset.name} with a GitHub-style version gate for branch and commit review.`
        : 'No versioned asset is available for branch review.',
      writes: ['replica version gate proposal', 'replica review note'],
      disabledReason: versionAsset ? undefined : 'Upload or sync an asset before stamping a version gate.',
    },
    {
      id: 'create-issue-from-asset',
      type: 'create_issue_from_asset',
      title: 'Open Issue',
      app: 'Jira Flow',
      targetAssetId: asset?.id,
      targetAssetTags: asset?.tags,
      targetAssetName: asset?.name,
      targetAssetType: asset?.asset_type,
      targetAssetVersion: asset?.version,
      targetProjectId: asset?.project_id,
      targetLabel: asset?.original_filename ?? 'No asset target',
      severity: asset?.asset_type === 'code' ? 'warning' : 'normal',
      intent: asset ? `Propose a Jira-style follow-up issue from ${asset.name} and attach the source asset.` : 'No data lake asset is available for issue creation.',
      writes: ['replica issue proposal', 'replica asset link'],
      disabledReason: asset ? undefined : 'Upload or sync an asset before opening an issue.',
    },
    {
      id: 'attach-asset-evidence',
      type: 'attach_asset_evidence',
      title: 'Attach Evidence',
      app: 'Jira Flow',
      targetIssueId: evidenceTarget?.id,
      targetAssetId: asset?.id,
      targetAssetTags: asset?.tags,
      targetAssetName: asset?.name,
      targetAssetType: asset?.asset_type,
      targetAssetVersion: asset?.version,
      targetProjectId: asset?.project_id,
      targetLabel: evidenceTarget && asset ? `${evidenceTarget.issue_key} / ${asset.original_filename}` : 'No link target',
      severity: evidenceTarget?.priority === 'urgent' ? 'warning' : 'normal',
      intent: evidenceTarget && asset ? `Propose attaching ${asset.name} as AI-selected evidence for ${evidenceTarget.title}.` : 'An issue and an asset are required for evidence linking.',
      writes: ['replica issue asset link', 'replica comment'],
      disabledReason:
        evidenceTarget && asset ? undefined : 'Create or sync both an issue and an asset before attaching evidence.',
    },
  ];
}

async function executeAiControlAction(action: AiControlAction): Promise<void> {
  if (action.disabledReason) throw new Error(action.disabledReason);

  await productionApi.management.recordReplicaAction({
    action_id: action.id,
    title: action.title,
    app: action.app,
    target_label: action.targetLabel,
    intent: action.intent,
    writes: action.writes.map((write) => (write.startsWith('replica') ? write : `replica:${write}`)),
    metadata: {
      type: action.type,
      severity: action.severity,
      target_issue_id: action.targetIssueId,
      target_asset_id: action.targetAssetId,
      target_asset_name: action.targetAssetName,
      target_asset_type: action.targetAssetType,
      target_asset_version: action.targetAssetVersion,
      target_project_id: action.targetProjectId,
    },
  });
}

function buildChatContext(model: AiControlModel): string {
  return JSON.stringify({
    issues: model.totalIssues,
    risk_issues: model.riskIssues,
    review_issues: model.reviewIssues,
    active_assets: model.activeAssets,
    code_assets: model.codeAssets,
    versioned_assets: model.versionedAssets,
    planning_records: model.planningRecords,
    automation_rules: model.automationRules,
    workflow_transitions: model.workflowTransitions,
    enterprise_controls: model.enterpriseControls,
    delivery_ready_percent: model.deliveryReadyPercent,
    emergent_signals: model.emergentSignals.map((signal) => ({
      id: signal.id,
      source: signal.source,
      strength: signal.strength,
      detail: signal.detail,
    })),
    available_actions: model.actions.map((action) => ({
      id: action.id,
      title: action.title,
      app: action.app,
      target: action.targetLabel,
      writes: action.writes,
      disabled: Boolean(action.disabledReason),
    })),
  });
}

function buildEmergentSignals(issues: IssueSummary[], assets: AssetSummary[], deliveryReadyPercent: number): EmergentSignal[] {
  const signals: EmergentSignal[] = [];
  const codeAsset = assets.find((asset) => asset.asset_type === 'code');
  const versionAsset = pickVersionedAsset(assets);
  const riskIssue = pickRiskIssue(issues);
  const reviewIssue = pickReviewIssue(issues);

  signals.push({
    id: 'lake-index',
    title: codeAsset ? 'Code Lake Ready' : assets.length > 0 ? 'Asset Lake Ready' : 'Lake Intake Gap',
    source: 'Data Lake',
    detail: codeAsset
      ? `${codeAsset.original_filename} can seed code-aware retrieval and issue creation.`
      : assets.length > 0
      ? `${assets.length} assets can be indexed as AI evidence.`
      : 'No assets are available for AI evidence control.',
    strength: assets.length > 0 ? 'ready' : 'blocked',
  });

  signals.push({
    id: 'version-drift',
    title: versionAsset ? 'Version Gate Candidate' : 'Version Baseline',
    source: 'Version Graph',
    detail: versionAsset
      ? `${versionAsset.original_filename} is at v${versionAsset.version} and can receive a branch-style review gate.`
      : 'Current assets have no multi-version drift yet.',
    strength: versionAsset ? 'watch' : assets.length > 0 ? 'ready' : 'blocked',
  });

  signals.push({
    id: 'jira-flow',
    title: riskIssue ? 'Risk Flow' : reviewIssue ? 'Review Flow' : 'Backlog Flow',
    source: 'Jira Flow',
    detail: riskIssue
      ? `${riskIssue.issue_key} is the strongest control target.`
      : reviewIssue
      ? `${reviewIssue.issue_key} is ready for review coordination.`
      : `${issues.length} issues are available for planning control.`,
    strength: riskIssue ? 'watch' : issues.length > 0 ? 'ready' : 'blocked',
  });

  signals.push({
    id: 'delivery-emergence',
    title: 'Cross-App Readiness',
    source: 'Lake + Version + Jira',
    detail: `${deliveryReadyPercent}% delivery readiness from current project, evidence, and workflow signals.`,
    strength: deliveryReadyPercent >= 75 ? 'ready' : deliveryReadyPercent > 0 ? 'watch' : 'blocked',
  });

  return signals;
}

function pickRiskIssue(issues: IssueSummary[]): IssueSummary | undefined {
  return (
    issues.find((issue) => issue.qa_status === 'failed') ??
    issues.find((issue) => issue.priority === 'urgent') ??
    issues.find(isOverdue) ??
    issues.find((issue) => issue.qa_status === 'warning')
  );
}

function pickReviewIssue(issues: IssueSummary[]): IssueSummary | undefined {
  return (
    issues.find((issue) => issue.status === 'submitted') ??
    issues.find((issue) => issue.status === 'client_review') ??
    issues.find((issue) => issue.status === 'internal_review')
  );
}

function pickAssetTarget(assets: AssetSummary[]): AssetSummary | undefined {
  return assets.find((asset) => asset.asset_type === 'code') ?? assets[0];
}

function pickVersionedAsset(assets: AssetSummary[]): AssetSummary | undefined {
  return [...assets].sort((a, b) => b.version - a.version).find((asset) => asset.version > 1);
}

function isOverdue(issue: IssueSummary): boolean {
  return Boolean(issue.due_date && new Date(issue.due_date) < new Date() && !['delivered', 'archived'].includes(issue.status));
}

function shortDate(value?: string): string {
  if (!value) return 'no-date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(value));
}

function messageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

export default AiControlPage;
