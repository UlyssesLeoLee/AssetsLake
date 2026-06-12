/*
```cypher
CREATE
  (f:File {name: "AdminControlPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/AdminControlPage", type: "module"}),
  (fn1:Function {name: "AdminControlPage", type: "function", language: "typescript", signature: "function AdminControlPage()"}),
  (fn2:Function {name: "minutesFromSeconds", type: "function", language: "typescript", signature: "function minutesFromSeconds(value: number): number"}),
  (fn3:Function {name: "secondsFromMinutes", type: "function", language: "typescript", signature: "function secondsFromMinutes(value: string): number"}),
  (fn4:Function {name: "formatTimestamp", type: "function", language: "typescript", signature: "function formatTimestamp(value?: string | null): string"}),
  (fn5:Function {name: "alertToneClass", type: "function", language: "typescript", signature: "function alertToneClass(severity: string): string"}),
  (fn6:Function {name: "roleToneClass", type: "function", language: "typescript", signature: "function roleToneClass(role: string): string"}),
  (v1:Variable {name: "USER_ROLES", type: "variable"}),
  (v2:Variable {name: "settingsDraft", type: "variable"}),
  (v3:Variable {name: "roleDrafts", type: "variable"}),
  (v4:Variable {name: "snapshot", type: "variable"}),
  (v5:Variable {name: "updateSettings", type: "variable"}),
  (v6:Variable {name: "updateUserRole", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6);
```
*/

'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  AlertTriangle,
  Ban,
  BrainCircuit,
  Download,
  GitBranch,
  Loader2,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  UnlockKeyhole,
  UserRoundCog,
} from 'lucide-react';

import {
  useAdminControlUsers,
  useAdminOperationTraces,
  useAdminControlSnapshot,
  useRunAdminAiRiskAnalysis,
  useUpdateAdminControlSettings,
  useUpdateAdminRiskPolicy,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from '@/hooks/useAdminControl';
import { adminControlApi } from '@/lib/adminControlApi';
import { loadAiSettings, type AiSettings } from '@/lib/aiSettings';
import { cn } from '@/lib/utils';
import {
  Metric,
  PageShell,
  Panel,
} from '@/plugin-groups/production/ProjectManagementPluginPrimitives';
import type {
  AdminAiRiskAnalysis,
  AdminControlSettings,
  AdminRiskPolicySettings,
  AdminUserSummary,
  AdminUsersQuery,
} from '@/types/adminControl';

const USER_ROLES = [
  'admin',
  'producer',
  'artist',
  'reviewer',
  'manager',
  'viewer',
  'client',
  'vendor',
] as const;
const USER_PAGE_LIMIT = 10;
const TRACE_PAGE_LIMIT = 20;

export function AdminControlPage() {
  const { data: snapshot, error, isFetching, isLoading, refetch } = useAdminControlSnapshot();
  const [userFilters, setUserFilters] = useState<AdminUsersQuery>({
    q: '',
    status: '',
    role: '',
    risk_level: '',
    limit: USER_PAGE_LIMIT,
    offset: 0,
  });
  const [traceOffset, setTraceOffset] = useState(0);
  const usersQuery = useMemo(() => ({ ...userFilters, limit: USER_PAGE_LIMIT }), [userFilters]);
  const tracesQuery = useMemo(
    () => ({ limit: TRACE_PAGE_LIMIT, offset: traceOffset }),
    [traceOffset],
  );
  const {
    data: usersPage,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useAdminControlUsers(usersQuery);
  const {
    data: operationTracePage,
    isFetching: tracesFetching,
    refetch: refetchTraces,
  } = useAdminOperationTraces(tracesQuery);
  const updateSettings = useUpdateAdminControlSettings();
  const updateRiskPolicy = useUpdateAdminRiskPolicy();
  const updateUserRole = useUpdateAdminUserRole();
  const updateUserStatus = useUpdateAdminUserStatus();
  const runAiRiskAnalysis = useRunAdminAiRiskAnalysis();
  const [settingsDraft, setSettingsDraft] = useState<AdminControlSettings | null>(null);
  const [riskPolicyDraft, setRiskPolicyDraft] = useState<AdminRiskPolicySettings | null>(null);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string>>({});
  const [statusReasons, setStatusReasons] = useState<Record<string, string>>({});
  const [aiSettings, setAiSettings] = useState<AiSettings | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AdminAiRiskAnalysis | null>(null);

  const users = usersPage?.items ?? snapshot?.users_page?.items ?? snapshot?.users ?? [];
  const traces =
    operationTracePage?.items ??
    snapshot?.operation_traces_page?.items ??
    snapshot?.operation_traces ??
    [];

  useEffect(() => {
    if (!snapshot) {
      return;
    }
    setSettingsDraft((current) =>
      current?.updated_at === snapshot.settings.updated_at ? current : snapshot.settings,
    );
    if (snapshot.risk_policy) {
      setRiskPolicyDraft((current) =>
        current?.updated_at === snapshot.risk_policy.updated_at ? current : snapshot.risk_policy,
      );
    }
  }, [snapshot]);

  useEffect(() => {
    setRoleDrafts(Object.fromEntries(users.map((user) => [user.id, user.role])));
  }, [users]);

  useEffect(() => {
    setAiSettings(loadAiSettings());
  }, []);

  const settings = settingsDraft ?? snapshot?.settings;
  const riskPolicy = riskPolicyDraft ?? snapshot?.risk_policy;
  const settingsDirty = useMemo(() => {
    if (!settingsDraft || !snapshot) {
      return false;
    }
    return (
      settingsDraft.session_ttl_seconds !== snapshot.settings.session_ttl_seconds ||
      settingsDraft.idle_timeout_seconds !== snapshot.settings.idle_timeout_seconds ||
      settingsDraft.abnormal_login_threshold !== snapshot.settings.abnormal_login_threshold ||
      settingsDraft.abnormal_window_minutes !== snapshot.settings.abnormal_window_minutes ||
      settingsDraft.failed_login_alert_enabled !== snapshot.settings.failed_login_alert_enabled ||
      settingsDraft.rbac_denial_alert_enabled !== snapshot.settings.rbac_denial_alert_enabled
    );
  }, [settingsDraft, snapshot]);
  const riskPolicyDirty = useMemo(() => {
    if (!riskPolicyDraft || !snapshot?.risk_policy) {
      return false;
    }
    return (
      riskPolicyDraft.session_weight !== snapshot.risk_policy.session_weight ||
      riskPolicyDraft.lock_weight !== snapshot.risk_policy.lock_weight ||
      riskPolicyDraft.event_weight !== snapshot.risk_policy.event_weight ||
      riskPolicyDraft.blocked_weight !== snapshot.risk_policy.blocked_weight ||
      riskPolicyDraft.auth_failure_weight !== snapshot.risk_policy.auth_failure_weight ||
      riskPolicyDraft.rbac_denial_weight !== snapshot.risk_policy.rbac_denial_weight ||
      riskPolicyDraft.high_session_threshold !== snapshot.risk_policy.high_session_threshold ||
      riskPolicyDraft.high_event_threshold !== snapshot.risk_policy.high_event_threshold ||
      riskPolicyDraft.ai_analysis_enabled !== snapshot.risk_policy.ai_analysis_enabled ||
      riskPolicyDraft.langgraph_risk_node !== snapshot.risk_policy.langgraph_risk_node
    );
  }, [riskPolicyDraft, snapshot]);
  const aiConfigured = Boolean(aiSettings?.enabled && aiSettings.apiKey.trim().length > 0);

  const patchSettingsDraft = (patch: Partial<AdminControlSettings>) => {
    setSettingsDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const patchRiskPolicyDraft = (patch: Partial<AdminRiskPolicySettings>) => {
    setRiskPolicyDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const saveSettings = () => {
    if (!settingsDraft) {
      return;
    }
    updateSettings.mutate(
      {
        session_ttl_seconds: settingsDraft.session_ttl_seconds,
        idle_timeout_seconds: settingsDraft.idle_timeout_seconds,
        abnormal_login_threshold: settingsDraft.abnormal_login_threshold,
        abnormal_window_minutes: settingsDraft.abnormal_window_minutes,
        failed_login_alert_enabled: settingsDraft.failed_login_alert_enabled,
        rbac_denial_alert_enabled: settingsDraft.rbac_denial_alert_enabled,
      },
      {
        onSuccess: () => toast.success('Admin settings saved'),
        onError: (saveError) =>
          toast.error(saveError instanceof Error ? saveError.message : 'Save failed'),
      },
    );
  };

  const saveRiskPolicy = () => {
    if (!riskPolicyDraft) {
      return;
    }
    updateRiskPolicy.mutate(
      {
        session_weight: riskPolicyDraft.session_weight,
        lock_weight: riskPolicyDraft.lock_weight,
        event_weight: riskPolicyDraft.event_weight,
        blocked_weight: riskPolicyDraft.blocked_weight,
        auth_failure_weight: riskPolicyDraft.auth_failure_weight,
        rbac_denial_weight: riskPolicyDraft.rbac_denial_weight,
        high_session_threshold: riskPolicyDraft.high_session_threshold,
        high_event_threshold: riskPolicyDraft.high_event_threshold,
        ai_analysis_enabled: riskPolicyDraft.ai_analysis_enabled,
        langgraph_risk_node: riskPolicyDraft.langgraph_risk_node,
      },
      {
        onSuccess: () => toast.success('Risk policy saved'),
        onError: (saveError) =>
          toast.error(saveError instanceof Error ? saveError.message : 'Risk policy save failed'),
      },
    );
  };

  const runRiskAnalysis = () => {
    runAiRiskAnalysis.mutate(
      {
        instruction:
          'Prioritize account blocking, RBAC denials, session anomalies, and audit trace evidence.',
      },
      {
        onSuccess: (analysis) => {
          setAiAnalysis(analysis);
          toast.success(
            analysis.ai_status.used
              ? 'AI risk analysis completed'
              : 'Local risk analysis completed',
          );
        },
        onError: (analysisError) =>
          toast.error(
            analysisError instanceof Error ? analysisError.message : 'AI risk analysis failed',
          ),
      },
    );
  };

  const exportTraces = async () => {
    try {
      const csv = await adminControlApi.exportOperationTraces({
        limit: 1_000,
        offset: 0,
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'assetslake-admin-operation-traces.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Operation traces exported');
    } catch (exportError) {
      toast.error(exportError instanceof Error ? exportError.message : 'Export failed');
    }
  };

  const updateUserFilter = (patch: Partial<AdminUsersQuery>) => {
    setUserFilters((current) => ({ ...current, ...patch, offset: 0 }));
  };

  const saveUserRole = (user: AdminUserSummary) => {
    const role = roleDrafts[user.id] ?? user.role;
    updateUserRole.mutate(
      { userId: user.id, role },
      {
        onSuccess: () => toast.success(`${user.username} role updated`),
        onError: (saveError) =>
          toast.error(saveError instanceof Error ? saveError.message : 'Role update failed'),
      },
    );
  };

  const saveUserStatus = (user: AdminUserSummary, blocked: boolean) => {
    const reason = statusReasons[user.id]?.trim();
    if (blocked && !reason) {
      toast.error('Block reason is required');
      return;
    }
    updateUserStatus.mutate(
      { userId: user.id, blocked, reason: reason || undefined },
      {
        onSuccess: () => {
          toast.success(`${user.username} ${blocked ? 'blocked' : 'unblocked'}`);
          setStatusReasons((current) => ({ ...current, [user.id]: '' }));
        },
        onError: (saveError) =>
          toast.error(saveError instanceof Error ? saveError.message : 'Status update failed'),
      },
    );
  };

  return (
    <PageShell
      title="Admin Control"
      subtitle="Session policy, user permissions, runtime usage, and security alerts"
    >
      {error instanceof Error ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          {error.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          label="Active Sessions"
          value={snapshot?.usage.active_sessions ?? 0}
          detail={`${snapshot?.usage.expiring_sessions ?? 0} expiring soon`}
          tone="text-cyan-300"
        />
        <Metric
          label="Users"
          value={snapshot?.usage.total_users ?? 0}
          detail="active accounts"
          tone="text-emerald-300"
        />
        <Metric
          label="Auth Failures"
          value={snapshot?.usage.auth_failures_window ?? 0}
          detail={`${settings?.abnormal_window_minutes ?? 0} min window`}
          tone="text-amber-300"
        />
        <Metric
          label="RBAC Denials"
          value={snapshot?.usage.rbac_denials_window ?? 0}
          detail={`${snapshot?.usage.audit_events_24h ?? 0} audit events in 24h`}
          tone="text-sakura-300"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Metric
          label="Blocked Users"
          value={snapshot?.security_posture.blocked_users ?? 0}
          detail={`${snapshot?.security_posture.revocable_sessions ?? 0} revocable sessions`}
          tone="text-red-300"
        />
        <Metric
          label="High Risk"
          value={snapshot?.security_posture.high_risk_users ?? 0}
          detail="risk-ranked accounts"
          tone="text-amber-300"
        />
        <Metric
          label="Admin Sessions"
          value={snapshot?.security_posture.active_admin_sessions ?? 0}
          detail="active admin control surface"
          tone="text-brand-200"
        />
        <Metric
          label="Active Locks"
          value={snapshot?.security_posture.active_user_locks ?? 0}
          detail={`${snapshot?.security_posture.recent_admin_actions ?? 0} admin actions in 24h`}
          tone="text-cyan-300"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Panel title="Session Policy" icon={<TimerReset className="h-4 w-4" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-xs text-slate-500">
              Session TTL minutes
              <input
                className="input"
                min={5}
                max={43_200}
                type="number"
                value={settings ? minutesFromSeconds(settings.session_ttl_seconds) : 720}
                onChange={(event) =>
                  patchSettingsDraft({
                    session_ttl_seconds: secondsFromMinutes(event.target.value),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Idle timeout minutes
              <input
                className="input"
                min={1}
                max={43_200}
                type="number"
                value={settings ? minutesFromSeconds(settings.idle_timeout_seconds) : 60}
                onChange={(event) =>
                  patchSettingsDraft({
                    idle_timeout_seconds: secondsFromMinutes(event.target.value),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Alert threshold
              <input
                className="input"
                min={1}
                max={10_000}
                type="number"
                value={settings?.abnormal_login_threshold ?? 5}
                onChange={(event) =>
                  patchSettingsDraft({
                    abnormal_login_threshold: Math.max(1, Number(event.target.value) || 1),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Alert window minutes
              <input
                className="input"
                min={1}
                max={1_440}
                type="number"
                value={settings?.abnormal_window_minutes ?? 15}
                onChange={(event) =>
                  patchSettingsDraft({
                    abnormal_window_minutes: Math.max(1, Number(event.target.value) || 1),
                  })
                }
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-surface-border pt-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                className="h-4 w-4 rounded border-surface-border bg-slate-950"
                checked={settings?.failed_login_alert_enabled ?? true}
                type="checkbox"
                onChange={(event) =>
                  patchSettingsDraft({ failed_login_alert_enabled: event.target.checked })
                }
              />
              Failed login alerts
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                className="h-4 w-4 rounded border-surface-border bg-slate-950"
                checked={settings?.rbac_denial_alert_enabled ?? true}
                type="checkbox"
                onChange={(event) =>
                  patchSettingsDraft({ rbac_denial_alert_enabled: event.target.checked })
                }
              />
              RBAC denial alerts
            </label>
            <button
              className="btn-primary ml-auto"
              disabled={!settingsDirty || updateSettings.isPending}
              type="button"
              onClick={saveSettings}
            >
              <Save className="h-4 w-4" />
              {updateSettings.isPending ? 'Saving' : 'Save'}
            </button>
          </div>
        </Panel>

        <Panel title="Alerts" icon={<ShieldAlert className="h-4 w-4" />}>
          <div className="space-y-3">
            {(snapshot?.alerts ?? []).map((alert) => (
              <div
                key={`${alert.title}-${alert.created_at}`}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm',
                  alertToneClass(alert.severity),
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{alert.title}</span>
                  <span className="text-xs opacity-75">{formatTimestamp(alert.created_at)}</span>
                </div>
                <div className="mt-1 text-xs opacity-80">{alert.detail}</div>
              </div>
            ))}
            {isLoading ? <div className="text-sm text-slate-500">Loading alerts</div> : null}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <Panel title="Risk Policy" icon={<BrainCircuit className="h-4 w-4" />}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1 text-xs text-slate-500">
              Session weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.session_weight ?? 8}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    session_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Lock weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.lock_weight ?? 10}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    lock_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Event weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.event_weight ?? 3}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    event_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Blocked weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.blocked_weight ?? 70}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    blocked_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              Auth failure weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.auth_failure_weight ?? 12}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    auth_failure_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              RBAC denial weight
              <input
                className="input"
                min={0}
                max={100}
                type="number"
                value={riskPolicy?.rbac_denial_weight ?? 14}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    rbac_denial_weight: Math.max(0, Number(event.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              High session threshold
              <input
                className="input"
                min={1}
                max={10_000}
                type="number"
                value={riskPolicy?.high_session_threshold ?? 4}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    high_session_threshold: Math.max(1, Number(event.target.value) || 1),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-slate-500">
              High event threshold
              <input
                className="input"
                min={1}
                max={100_000}
                type="number"
                value={riskPolicy?.high_event_threshold ?? 25}
                onChange={(event) =>
                  patchRiskPolicyDraft({
                    high_event_threshold: Math.max(1, Number(event.target.value) || 1),
                  })
                }
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 border-t border-surface-border pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="grid gap-1 text-xs text-slate-500">
              LangGraph risk node
              <input
                className="input"
                value={riskPolicy?.langgraph_risk_node ?? 'admin_risk_orchestrator'}
                onChange={(event) =>
                  patchRiskPolicyDraft({ langgraph_risk_node: event.target.value })
                }
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  className="h-4 w-4 rounded border-surface-border bg-slate-950"
                  checked={riskPolicy?.ai_analysis_enabled ?? true}
                  type="checkbox"
                  onChange={(event) =>
                    patchRiskPolicyDraft({ ai_analysis_enabled: event.target.checked })
                  }
                />
                AI analysis
              </label>
              <button
                className="btn-primary"
                disabled={!riskPolicyDirty || updateRiskPolicy.isPending}
                type="button"
                onClick={saveRiskPolicy}
              >
                <Save className="h-4 w-4" />
                {updateRiskPolicy.isPending ? 'Saving' : 'Save'}
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="AI Risk Analysis" icon={<BrainCircuit className="h-4 w-4" />}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 text-xs text-slate-500">
              <div className="truncate text-slate-300">
                {aiSettings?.provider ?? 'NVIDIA NIM'} / {aiSettings?.model ?? 'model'}
              </div>
              <div className={cn('mt-1', aiConfigured ? 'text-emerald-300' : 'text-amber-300')}>
                {aiConfigured ? 'API key configured' : 'Local fallback until API key is set'}
              </div>
            </div>
            <button
              className="btn-primary"
              disabled={runAiRiskAnalysis.isPending}
              type="button"
              onClick={runRiskAnalysis}
            >
              {runAiRiskAnalysis.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
              Analyze
            </button>
          </div>

          <div className="mt-4 rounded-md border border-surface-border bg-slate-950/50 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className={cn('badge', alertToneClass(aiAnalysis?.severity ?? 'info'))}>
                {aiAnalysis?.severity ?? 'ready'}
              </span>
              <span className="text-xs text-slate-500">
                {aiAnalysis ? formatTimestamp(aiAnalysis.generated_at) : 'Not run'}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-300">
              {aiAnalysis?.summary ?? 'Run analysis to generate governance recommendations.'}
            </div>
            {aiAnalysis?.ai_status.error ? (
              <div className="mt-2 text-xs text-amber-200">{aiAnalysis.ai_status.error}</div>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {(
              aiAnalysis?.langgraph_nodes ?? [
                {
                  name: riskPolicy?.langgraph_risk_node ?? 'admin_risk_orchestrator',
                  state: 'ready',
                  detail: 'Risk scoring, evidence tracing, and guarded recommendations.',
                },
              ]
            ).map((node) => (
              <div
                key={`${node.name}-${node.state}`}
                className="rounded-md border border-surface-border bg-surface-elevated/50 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-slate-100">{node.name}</span>
                  <span className="badge border-cyan-500/35 bg-cyan-500/10 text-cyan-200">
                    {node.state}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{node.detail}</div>
              </div>
            ))}
          </div>

          {aiAnalysis?.recommendations.length ? (
            <div className="mt-4 space-y-2">
              {aiAnalysis.recommendations.map((recommendation) => (
                <div
                  key={`${recommendation.title}-${recommendation.target}`}
                  className="rounded-md border border-surface-border bg-slate-950/50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-100">{recommendation.title}</span>
                    <span className={cn('badge', alertToneClass(recommendation.severity))}>
                      {recommendation.severity}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{recommendation.target}</div>
                  <div className="mt-2 text-xs text-slate-300">{recommendation.action}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]">
        <Panel title="User Permissions" icon={<UserRoundCog className="h-4 w-4" />}>
          <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_140px_140px_140px]">
              <label className="grid gap-1 text-xs text-slate-500">
                Search
                <span className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    className="input pl-8"
                    placeholder="Name, email, username"
                    value={userFilters.q ?? ''}
                    onChange={(event) => updateUserFilter({ q: event.target.value })}
                  />
                </span>
              </label>
              <label className="grid gap-1 text-xs text-slate-500">
                Status
                <select
                  className="input"
                  value={userFilters.status ?? ''}
                  onChange={(event) => updateUserFilter({ status: event.target.value })}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs text-slate-500">
                Role
                <select
                  className="input"
                  value={userFilters.role ?? ''}
                  onChange={(event) => updateUserFilter({ role: event.target.value })}
                >
                  <option value="">All</option>
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-slate-500">
                Risk
                <select
                  className="input"
                  value={userFilters.risk_level ?? ''}
                  onChange={(event) => updateUserFilter({ risk_level: event.target.value })}
                >
                  <option value="">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="watch">Watch</option>
                  <option value="normal">Normal</option>
                </select>
              </label>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                {usersPage?.offset ?? snapshot?.users_page?.offset ?? 0}-
                {(usersPage?.offset ?? snapshot?.users_page?.offset ?? 0) + users.length} /{' '}
                {usersPage?.total ?? snapshot?.users_page?.total ?? users.length}
              </span>
              <button
                className="inline-flex h-8 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated/80 px-3 font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
                disabled={usersFetching}
                type="button"
                onClick={() => void refetchUsers()}
              >
                <RefreshCw className={cn('h-3.5 w-3.5', usersFetching && 'animate-spin')} />
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-left text-sm">
              <thead className="border-b border-surface-border text-xs uppercase text-slate-500">
                <tr>
                  <th className="w-60 px-3 py-2 font-medium">User</th>
                  <th className="w-40 px-3 py-2 font-medium">Role</th>
                  <th className="w-36 px-3 py-2 font-medium">Activity</th>
                  <th className="w-44 px-3 py-2 font-medium">Last Login</th>
                  <th className="w-72 px-3 py-2 font-medium">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((user) => {
                  const draftRole = roleDrafts[user.id] ?? user.role;
                  const changed = draftRole !== user.role;
                  const blocked = user.status === 'blocked';
                  const updating =
                    updateUserRole.isPending && updateUserRole.variables?.userId === user.id;
                  const statusUpdating =
                    updateUserStatus.isPending && updateUserStatus.variables?.userId === user.id;
                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        'align-middle transition hover:bg-slate-900/50',
                        blocked && 'bg-red-950/15',
                      )}
                    >
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-100">
                          {user.display_name ?? user.username}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-500">
                          {user.email ?? user.username}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className={cn('badge', statusToneClass(user.status))}>
                            {user.status}
                          </span>
                          <span className={cn('badge', riskToneClass(user.risk_level))}>
                            {user.risk_level} {user.risk_score}
                          </span>
                        </div>
                        {user.blocked_reason ? (
                          <div className="mt-2 line-clamp-2 text-xs text-amber-200">
                            {user.blocked_reason}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        <select
                          className={cn(
                            'h-9 rounded-md border px-2 text-sm outline-none',
                            roleToneClass(draftRole),
                          )}
                          disabled={blocked}
                          value={draftRole}
                          onChange={(event) =>
                            setRoleDrafts((current) => ({
                              ...current,
                              [user.id]: event.target.value,
                            }))
                          }
                        >
                          {USER_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-300">
                        <div>{user.active_sessions} sessions</div>
                        <div className="mt-1 text-slate-500">{user.active_locks} locks</div>
                        <div className="mt-1 text-slate-500">{user.recent_event_count} events</div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-400">
                        {formatTimestamp(user.last_login_at)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="inline-flex h-8 items-center gap-2 rounded-md border border-brand-500/40 bg-brand-500/10 px-3 text-xs font-medium text-brand-200 transition hover:bg-brand-500/20 disabled:opacity-50"
                              disabled={!changed || updating || blocked}
                              type="button"
                              onClick={() => saveUserRole(user)}
                            >
                              <Save className="h-3.5 w-3.5" />
                              {updating ? 'Saving' : 'Role'}
                            </button>
                            <button
                              className={cn(
                                'inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium transition disabled:opacity-50',
                                blocked
                                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                                  : 'border-red-500/35 bg-red-500/10 text-red-200 hover:bg-red-500/20',
                              )}
                              disabled={
                                statusUpdating ||
                                (!blocked && !(statusReasons[user.id]?.trim().length ?? 0))
                              }
                              type="button"
                              onClick={() => saveUserStatus(user, !blocked)}
                            >
                              {blocked ? (
                                <UnlockKeyhole className="h-3.5 w-3.5" />
                              ) : (
                                <Ban className="h-3.5 w-3.5" />
                              )}
                              {statusUpdating ? 'Saving' : blocked ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                          <input
                            className="input h-8 text-xs"
                            placeholder={blocked ? 'Unblock reason' : 'Block reason'}
                            value={statusReasons[user.id] ?? ''}
                            onChange={(event) =>
                              setStatusReasons((current) => ({
                                ...current,
                                [user.id]: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!usersFetching && users.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No users found</div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
            <button
              className="inline-flex h-8 items-center rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
              disabled={(usersPage?.offset ?? 0) <= 0 || usersFetching}
              type="button"
              onClick={() =>
                setUserFilters((current) => ({
                  ...current,
                  offset: Math.max(0, (current.offset ?? 0) - USER_PAGE_LIMIT),
                }))
              }
            >
              Prev
            </button>
            <button
              className="inline-flex h-8 items-center rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
              disabled={usersPage?.next_offset == null || usersFetching}
              type="button"
              onClick={() =>
                setUserFilters((current) => ({
                  ...current,
                  offset: usersPage?.next_offset ?? (current.offset ?? 0) + USER_PAGE_LIMIT,
                }))
              }
            >
              Next
            </button>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Effective RBAC" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="flex justify-end">
              <button
                className="inline-flex h-8 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
                disabled={isFetching}
                type="button"
                onClick={() => void refetch()}
              >
                <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
                Refresh
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {(snapshot?.role_permissions ?? []).map((role) => (
                <div
                  key={role.role}
                  className="border-b border-surface-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn('badge', roleToneClass(role.role))}>{role.role}</span>
                    <span className="text-xs text-slate-500">{role.user_count} users</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {role.permissions.map((permission) => (
                      <span
                        key={`${role.role}-${permission}`}
                        className="rounded border border-surface-border bg-slate-950/70 px-1.5 py-0.5 text-[11px] text-slate-400"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Operation Trace" icon={<GitBranch className="h-4 w-4" />}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-500">
                {operationTracePage?.offset ?? snapshot?.operation_traces_page?.offset ?? 0}-
                {(operationTracePage?.offset ?? snapshot?.operation_traces_page?.offset ?? 0) +
                  traces.length}{' '}
                /{' '}
                {operationTracePage?.total ??
                  snapshot?.operation_traces_page?.total ??
                  traces.length}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
                  disabled={tracesFetching}
                  type="button"
                  onClick={() => void refetchTraces()}
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', tracesFetching && 'animate-spin')} />
                  Refresh
                </button>
                <button
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-cyan-500/35 bg-cyan-500/10 px-3 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  type="button"
                  onClick={() => void exportTraces()}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
              {traces.map((trace) => (
                <div
                  key={trace.id}
                  className="rounded-md border border-surface-border bg-slate-950/50 px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-100">
                        {trace.action}
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500">{trace.summary}</div>
                    </div>
                    <span
                      className={cn('badge shrink-0', alertToneClass(trace.severity ?? 'info'))}
                    >
                      {trace.outcome ?? 'recorded'}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-brand-300" />
                      <span className="truncate">{trace.actor ?? 'system'}</span>
                      <span>{formatTimestamp(trace.created_at)}</span>
                    </div>
                    {trace.reason ? (
                      <div className="truncate text-amber-200">{trace.reason}</div>
                    ) : null}
                    {trace.path ? (
                      <div className="truncate font-mono text-[11px] text-slate-600">
                        {trace.path}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {!tracesFetching && traces.length === 0 ? (
                <div className="text-sm text-slate-500">No operation traces found</div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                className="inline-flex h-8 items-center rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
                disabled={traceOffset <= 0 || tracesFetching}
                type="button"
                onClick={() => setTraceOffset((current) => Math.max(0, current - TRACE_PAGE_LIMIT))}
              >
                Prev
              </button>
              <button
                className="inline-flex h-8 items-center rounded-md border border-surface-border bg-surface-elevated/80 px-3 text-xs font-medium text-slate-300 transition hover:border-brand-500/35 hover:text-slate-100 disabled:opacity-60"
                disabled={operationTracePage?.next_offset == null || tracesFetching}
                type="button"
                onClick={() =>
                  setTraceOffset(operationTracePage?.next_offset ?? traceOffset + TRACE_PAGE_LIMIT)
                }
              >
                Next
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

function minutesFromSeconds(value: number): number {
  return Math.round(value / 60);
}

function secondsFromMinutes(value: string): number {
  return Math.max(60, Math.round((Number(value) || 0) * 60));
}

function formatTimestamp(value?: string | null): string {
  if (!value) {
    return 'Never';
  }
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function alertToneClass(severity: string): string {
  if (severity === 'critical') {
    return 'border-red-500/35 bg-red-500/10 text-red-200';
  }
  if (severity === 'warning') {
    return 'border-amber-500/35 bg-amber-500/10 text-amber-200';
  }
  if (severity === 'normal') {
    return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200';
  }
  return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200';
}

function statusToneClass(status: string): string {
  if (status === 'blocked') {
    return 'border-red-500/35 bg-red-500/10 text-red-200';
  }
  return 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200';
}

function riskToneClass(riskLevel: string): string {
  if (riskLevel === 'critical') {
    return 'border-red-500/35 bg-red-500/10 text-red-200';
  }
  if (riskLevel === 'high') {
    return 'border-amber-500/35 bg-amber-500/10 text-amber-200';
  }
  if (riskLevel === 'watch') {
    return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200';
  }
  return 'border-surface-border bg-slate-950 text-slate-300';
}

function roleToneClass(role: string): string {
  if (role === 'admin') {
    return 'border-sakura-300/35 bg-sakura-300/10 text-sakura-200';
  }
  if (role === 'producer') {
    return 'border-brand-400/35 bg-brand-500/10 text-brand-200';
  }
  if (role === 'artist') {
    return 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200';
  }
  if (role === 'reviewer') {
    return 'border-amber-400/35 bg-amber-500/10 text-amber-200';
  }
  return 'border-surface-border bg-slate-950 text-slate-300';
}

export default AdminControlPage;
