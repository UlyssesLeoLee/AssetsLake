/*
```cypher
CREATE
  (f:File {name: "PeopleIntelligencePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/people-intelligence/PeopleIntelligencePage", type: "module"}),
  (fn1:Function {name: "PeopleIntelligencePage", type: "function", language: "typescript"}),
  (fn2:Function {name: "employeeInitials", type: "function", language: "typescript"}),
  (fn3:Function {name: "scorePercent", type: "function", language: "typescript"}),
  (fn4:Function {name: "capabilityKindLabel", type: "function", language: "typescript"}),
  (fn5:Function {name: "availabilityLabel", type: "function", language: "typescript"}),
  (fn6:Function {name: "formatDate", type: "function", language: "typescript"}),
  (fn7:Function {name: "approveCapability", type: "function", language: "typescript"}),
  (v1:Variable {name: "DEFAULT_WORKSPACE_ID", type: "variable"}),
  (v2:Variable {name: "TABS", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (fn1)-[:CONTAINS]->(fn7),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7);
```
*/

'use client';

import {
  AlertTriangle,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleUserRound,
  DatabaseZap,
  Gauge,
  ListFilter,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getStoredAuthSession } from '@/lib/authSession';
import { peopleIntelligenceApi } from '@/lib/peopleIntelligenceApi';
import type {
  CapabilityTaxonomyItem,
  EmployeeEvaluation,
  EmployeeProfile,
  PeopleSearchMatch,
} from '@/types/peopleIntelligence';

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

const TABS = [
  { id: 'directory', label: '员工目录', icon: Search },
  { id: 'profile', label: '我的画像', icon: CircleUserRound },
  { id: 'evaluation', label: '能力评估', icon: Gauge },
  { id: 'team', label: '团队矩阵', icon: UsersRound },
  { id: 'taxonomy', label: '能力分类', icon: DatabaseZap },
] as const;

type TabId = (typeof TABS)[number]['id'];

type ProfileDraft = {
  job_title: string;
  level: string;
  timezone: string;
  languages: string;
  availability_status: 'available' | 'limited' | 'unavailable';
  workload_percent: number;
  bio: string;
  searchable: boolean;
  capabilities: Record<string, number>;
};

export default function PeopleIntelligencePage() {
  const session = getStoredAuthSession();
  const [activeTab, setActiveTab] = useState<TabId>('directory');
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [taxonomy, setTaxonomy] = useState<CapabilityTaxonomyItem[]>([]);
  const [matches, setMatches] = useState<PeopleSearchMatch[]>([]);
  const [query, setQuery] = useState('擅长角色建模和贴图，当前负载较低');
  const [selectedKind, setSelectedKind] = useState('');
  const [availability, setAvailability] = useState('');
  const [maxWorkload, setMaxWorkload] = useState(100);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EmployeeEvaluation | null>(null);
  const [evaluationWindow, setEvaluationWindow] = useState(90);
  const [correctionReason, setCorrectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  const runSearch = useCallback(async () => {
    setSearching(true);
    try {
      const result = await peopleIntelligenceApi.search({
        workspace_id: profile?.workspace_id ?? DEFAULT_WORKSPACE_ID,
        query,
        capability_ids: [],
        kinds: selectedKind ? [selectedKind] : [],
        languages: [],
        availability_status: availability || undefined,
        max_workload_percent: maxWorkload,
        limit: 40,
      });
      setMatches(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '无法搜索员工');
    } finally {
      setSearching(false);
    }
  }, [availability, maxWorkload, profile?.workspace_id, query, selectedKind]);

  useEffect(() => {
    let cancelled = false;
    async function loadWorkspace() {
      setLoading(true);
      try {
        const mine = await peopleIntelligenceApi.myProfile();
        const capabilities = await peopleIntelligenceApi.capabilities(
          mine.workspace_id,
          session?.user.role === 'admin',
        );
        if (cancelled) return;
        setProfile(mine);
        setSelectedEmployeeId(mine.user_id);
        setTaxonomy(capabilities);
        setProfileDraft({
          job_title: mine.job_title ?? '',
          level: mine.level ?? '',
          timezone: mine.timezone,
          languages: mine.languages.join(', '),
          availability_status: mine.availability_status,
          workload_percent: mine.workload_percent,
          bio: mine.bio,
          searchable: mine.searchable,
          capabilities: Object.fromEntries(
            mine.capabilities
              .filter((capability) => capability.source === 'self')
              .map((capability) => [capability.capability_id, capability.proficiency]),
          ),
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '无法加载员工智能工作区');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadWorkspace();
    return () => {
      cancelled = true;
    };
  }, [session?.user.role]);

  useEffect(() => {
    if (profile) void runSearch();
  }, [profile, runSearch]);

  const loadEvaluation = useCallback(async () => {
    const employeeId = selectedEmployeeId ?? profile?.user_id;
    if (!employeeId) return;
    setEvaluationLoading(true);
    try {
      setEvaluation(await peopleIntelligenceApi.evaluation(employeeId, evaluationWindow));
    } catch (error) {
      setEvaluation(null);
      toast.error(error instanceof Error ? error.message : '没有权限查看该员工评估');
    } finally {
      setEvaluationLoading(false);
    }
  }, [evaluationWindow, profile?.user_id, selectedEmployeeId]);

  useEffect(() => {
    if (activeTab === 'evaluation') void loadEvaluation();
  }, [activeTab, loadEvaluation]);

  const groupedTaxonomy = useMemo(() => {
    return taxonomy.reduce<Record<string, CapabilityTaxonomyItem[]>>((groups, capability) => {
      (groups[capability.kind] ??= []).push(capability);
      return groups;
    }, {});
  }, [taxonomy]);

  const saveProfile = async () => {
    if (!profileDraft) return;
    setSaving(true);
    try {
      const updated = await peopleIntelligenceApi.updateMyProfile({
        job_title: profileDraft.job_title,
        level: profileDraft.level,
        timezone: profileDraft.timezone,
        languages: profileDraft.languages
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        availability_status: profileDraft.availability_status,
        workload_percent: profileDraft.workload_percent,
        bio: profileDraft.bio,
        searchable: profileDraft.searchable,
        capabilities: Object.entries(profileDraft.capabilities).map(
          ([capability_id, proficiency]) => ({ capability_id, proficiency }),
        ),
      });
      setProfile(updated);
      toast.success('员工画像已更新');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '画像保存失败');
    } finally {
      setSaving(false);
    }
  };

  const submitCorrection = async () => {
    if (!profile || correctionReason.trim().length < 5) return;
    try {
      await peopleIntelligenceApi.submitCorrection(profile.user_id, correctionReason.trim());
      setCorrectionReason('');
      toast.success('纠错申请已提交');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '纠错申请提交失败');
    }
  };

  const reindex = async () => {
    if (!profile) return;
    setReindexing(true);
    try {
      const result = await peopleIntelligenceApi.reindex(profile.workspace_id);
      toast.success(`索引完成：${result.indexed}/${result.requested}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '向量索引失败');
    } finally {
      setReindexing(false);
    }
  };

  const approveCapability = async (capabilityId: string) => {
    try {
      const approved = await peopleIntelligenceApi.approveCapability(capabilityId);
      setTaxonomy((items) =>
        items.map((item) => (item.id === approved.id ? approved : item)),
      );
      toast.success('候选能力已批准');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '能力批准失败');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        正在加载员工智能工作区
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BrainCircuit className="h-5 w-5 text-teal-700" />
              员工智能
            </div>
            <p className="mt-1 text-sm text-slate-500">能力画像、人才检索与可解释评估</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">{profile?.display_name}</span>
            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium uppercase text-slate-600">
              {profile?.role}
            </span>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5" aria-label="员工智能视图">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="mx-auto max-w-[1500px] px-5 py-6">
        {activeTab === 'directory' && (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-r border-slate-200 pr-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <ListFilter className="h-4 w-4" /> 筛选
              </div>
              <label className="block text-xs font-medium text-slate-600">能力类型</label>
              <select
                value={selectedKind}
                onChange={(event) => setSelectedKind(event.target.value)}
                className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm"
              >
                <option value="">全部类型</option>
                {Object.keys(groupedTaxonomy).map((kind) => (
                  <option key={kind} value={kind}>
                    {capabilityKindLabel(kind)}
                  </option>
                ))}
              </select>
              <label className="mt-5 block text-xs font-medium text-slate-600">可用状态</label>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm"
              >
                <option value="">全部状态</option>
                <option value="available">可安排</option>
                <option value="limited">有限可用</option>
                <option value="unavailable">不可用</option>
              </select>
              <div className="mt-5 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>最高负载</span><span>{maxWorkload}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={maxWorkload}
                onChange={(event) => setMaxWorkload(Number(event.target.value))}
                className="mt-2 w-full accent-teal-700"
              />
              <button
                type="button"
                onClick={() => void runSearch()}
                className="mt-5 flex h-9 w-full items-center justify-center gap-2 bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                应用筛选
              </button>
            </aside>

            <section>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runSearch();
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-10 w-full border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-700"
                    placeholder="描述需要的岗位、能力、工具或项目情境"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-10 items-center gap-2 bg-teal-700 px-4 text-sm font-medium text-white hover:bg-teal-800"
                >
                  {searching && <Loader2 className="h-4 w-4 animate-spin" />}
                  搜索
                </button>
              </form>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{matches.length} 位候选人</span>
                <span>语义 45% · 核验能力 25% · 证据 15% · 可用性 10% · 项目 5%</span>
              </div>
              <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200 bg-white">
                {matches.map((match) => (
                  <button
                    key={match.employee.user_id}
                    type="button"
                    onClick={() => {
                      setSelectedEmployeeId(match.employee.user_id);
                      setActiveTab('evaluation');
                    }}
                    className="grid w-full gap-4 px-4 py-4 text-left hover:bg-slate-50 md:grid-cols-[minmax(220px,1fr)_minmax(260px,1.4fr)_110px_24px] md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-teal-50 text-sm font-semibold text-teal-800">
                        {employeeInitials(match.employee.display_name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{match.employee.display_name}</div>
                        <div className="truncate text-sm text-slate-500">
                          {match.employee.job_title || '岗位待完善'} · {match.employee.department_name || '未分配部门'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.employee.capabilities.slice(0, 5).map((capability) => (
                          <span
                            key={capability.id}
                            className={`border px-2 py-0.5 text-xs ${
                              capability.verification_status === 'verified'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            {capability.name} L{capability.proficiency}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 truncate text-xs text-slate-500">
                        {match.explanation.reasons.join(' · ')}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-900">匹配 {scorePercent(match.score)}%</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {availabilityLabel(match.employee.availability_status)} · 负载 {match.employee.workload_percent}%
                      </div>
                    </div>
                    <ChevronRight className="hidden h-4 w-4 text-slate-400 md:block" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'profile' && profileDraft && (
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section>
              <div className="mb-5">
                <h1 className="text-xl font-semibold">我的专业画像</h1>
                <p className="mt-1 text-sm text-slate-500">自述内容等待主管核验，系统推导能力保留独立来源。</p>
              </div>
              <div className="grid gap-4 border-y border-slate-200 bg-white py-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  岗位
                  <input
                    value={profileDraft.job_title}
                    onChange={(event) => setProfileDraft({ ...profileDraft, job_title: event.target.value })}
                    className="mt-1 h-9 w-full border border-slate-300 px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  职级
                  <input
                    value={profileDraft.level}
                    onChange={(event) => setProfileDraft({ ...profileDraft, level: event.target.value })}
                    className="mt-1 h-9 w-full border border-slate-300 px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  时区
                  <input
                    value={profileDraft.timezone}
                    onChange={(event) => setProfileDraft({ ...profileDraft, timezone: event.target.value })}
                    className="mt-1 h-9 w-full border border-slate-300 px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  语言
                  <input
                    value={profileDraft.languages}
                    onChange={(event) => setProfileDraft({ ...profileDraft, languages: event.target.value })}
                    className="mt-1 h-9 w-full border border-slate-300 px-3 font-normal"
                    placeholder="zh-CN, en-US"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  专业简介
                  <textarea
                    value={profileDraft.bio}
                    onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })}
                    className="mt-1 min-h-24 w-full resize-y border border-slate-300 p-3 font-normal"
                  />
                </label>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">自述能力</h2>
                  <span className="text-xs text-slate-500">熟练度 1-5</span>
                </div>
                <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200 bg-white">
                  {taxonomy.filter((item) => item.status === 'approved').map((capability) => {
                    const selected = profileDraft.capabilities[capability.id];
                    return (
                      <div key={capability.id} className="flex min-h-12 items-center gap-3 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(selected)}
                          onChange={(event) => {
                            const capabilities = { ...profileDraft.capabilities };
                            if (event.target.checked) capabilities[capability.id] = 3;
                            else delete capabilities[capability.id];
                            setProfileDraft({ ...profileDraft, capabilities });
                          }}
                          className="h-4 w-4 accent-teal-700"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{capability.name}</div>
                          <div className="truncate text-xs text-slate-500">
                            {capabilityKindLabel(capability.kind)} · {capability.aliases.join(', ') || '无别名'}
                          </div>
                        </div>
                        {selected && (
                          <input
                            type="range"
                            min={1}
                            max={5}
                            value={selected}
                            onChange={(event) =>
                              setProfileDraft({
                                ...profileDraft,
                                capabilities: {
                                  ...profileDraft.capabilities,
                                  [capability.id]: Number(event.target.value),
                                },
                              })
                            }
                            className="w-24 accent-teal-700"
                            title={`熟练度 ${selected}`}
                          />
                        )}
                        <span className="w-5 text-right text-sm font-medium">{selected || ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            <aside className="border-l border-slate-200 pl-6">
              <h2 className="font-semibold">可用性</h2>
              <div className="mt-3 grid grid-cols-3 border border-slate-300">
                {(['available', 'limited', 'unavailable'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setProfileDraft({ ...profileDraft, availability_status: status })}
                    className={`h-9 text-xs font-medium ${
                      profileDraft.availability_status === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {availabilityLabel(status)}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex justify-between text-sm font-medium">
                <span>当前负载</span><span>{profileDraft.workload_percent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={profileDraft.workload_percent}
                onChange={(event) => setProfileDraft({ ...profileDraft, workload_percent: Number(event.target.value) })}
                className="mt-2 w-full accent-teal-700"
              />
              <label className="mt-6 flex items-start gap-3 border-y border-slate-200 py-4 text-sm">
                <input
                  type="checkbox"
                  checked={profileDraft.searchable}
                  onChange={(event) => setProfileDraft({ ...profileDraft, searchable: event.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
                <span>
                  <span className="block font-medium">允许内部人才检索</span>
                  <span className="mt-1 block text-xs text-slate-500">客户和外部供应商始终无法访问员工画像。</span>
                </span>
              </label>
              <button
                type="button"
                onClick={() => void saveProfile()}
                disabled={saving}
                className="mt-6 flex h-10 w-full items-center justify-center gap-2 bg-teal-700 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                保存画像
              </button>
            </aside>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-semibold">{evaluation?.employee.display_name || '能力评估'}</h1>
                <p className="mt-1 text-sm text-slate-500">多维证据视图，不生成员工总分或团队排名。</p>
              </div>
              <select
                value={evaluationWindow}
                onChange={(event) => setEvaluationWindow(Number(event.target.value))}
                className="h-9 border border-slate-300 bg-white px-3 text-sm"
              >
                {[30, 90, 180, 365].map((days) => <option key={days} value={days}>{days} 天</option>)}
              </select>
            </div>
            {evaluationLoading ? (
              <div className="flex h-64 items-center justify-center text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />正在聚合证据</div>
            ) : evaluation ? (
              <div className="grid gap-7 pt-5 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div>
                  {evaluation.insufficient_evidence && (
                    <div className="mb-5 flex gap-3 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      证据不足：当前有 {evaluation.sample_size} 个有效任务、{evaluation.project_count} 个项目，暂不输出趋势值。
                    </div>
                  )}
                  <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
                    {evaluation.dimensions.map((dimension) => (
                      <div key={dimension.key} className="grid gap-3 px-4 py-4 sm:grid-cols-[140px_minmax(0,1fr)_90px] sm:items-center">
                        <div className="font-medium">{dimension.label}</div>
                        <div>
                          <div className="h-2 bg-slate-100">
                            <div className="h-2 bg-teal-600" style={{ width: `${Math.max(0, Math.min(100, dimension.value ?? 0))}%` }} />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">{dimension.explanation}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{dimension.value == null ? '证据不足' : `${Math.round(dimension.value)}${dimension.unit}`}</div>
                          <div className="mt-1 text-xs text-slate-500">置信 {scorePercent(dimension.confidence)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h2 className="mt-7 font-semibold">近期证据</h2>
                  <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200 bg-white">
                    {evaluation.recent_evidence.length ? evaluation.recent_evidence.slice(0, 12).map((evidence) => (
                      <div key={evidence.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <div><span className="font-medium">{evidence.evidence_type}</span><span className="ml-2 text-slate-500">{evidence.source_app}</span></div>
                        <time className="shrink-0 text-xs text-slate-500">{formatDate(evidence.occurred_at)}</time>
                      </div>
                    )) : <div className="px-4 py-8 text-center text-sm text-slate-500">暂无可追溯证据</div>}
                  </div>
                </div>
                <aside className="border-l border-slate-200 pl-6">
                  <div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-teal-700" />涌现信号</div>
                  <div className="mt-3 space-y-3">
                    {evaluation.signals.length ? evaluation.signals.map((signal) => (
                      <div key={signal.id} className="border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{signal.title}</span><span className="text-xs text-slate-500">{scorePercent(signal.confidence)}%</span></div>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{signal.summary}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">尚未形成稳定的涌现信号。</p>}
                  </div>
                  {evaluation.employee.user_id === profile?.user_id && (
                    <div className="mt-7 border-t border-slate-200 pt-5">
                      <h2 className="font-semibold">纠错与申诉</h2>
                      <textarea
                        value={correctionReason}
                        onChange={(event) => setCorrectionReason(event.target.value)}
                        className="mt-3 min-h-24 w-full border border-slate-300 p-3 text-sm"
                        placeholder="指出不准确的证据、指标或能力归属"
                      />
                      <button type="button" onClick={() => void submitCorrection()} disabled={correctionReason.trim().length < 5} className="mt-2 h-9 w-full border border-slate-900 text-sm font-medium disabled:opacity-40">提交纠错</button>
                    </div>
                  )}
                  <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">{evaluation.disclaimer}</p>
                </aside>
              </div>
            ) : <div className="py-16 text-center text-sm text-slate-500">选择本人或有管理权限的员工查看评估。</div>}
          </section>
        )}

        {activeTab === 'team' && (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div><h1 className="text-xl font-semibold">团队能力矩阵</h1><p className="mt-1 text-sm text-slate-500">仅展示能力覆盖与负载，不进行员工排名。</p></div>
              <span className="text-sm text-slate-500">{matches.length} 位内部员工</span>
            </div>
            <div className="overflow-x-auto border-y border-slate-200 bg-white">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                  <tr><th className="px-4 py-3">员工</th><th className="px-4 py-3">岗位</th><th className="px-4 py-3">已核验能力</th><th className="px-4 py-3">负载</th><th className="px-4 py-3">证据</th><th className="px-4 py-3">状态</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {matches.map(({ employee, explanation }) => (
                    <tr key={employee.user_id}>
                      <td className="px-4 py-3 font-medium">{employee.display_name}</td>
                      <td className="px-4 py-3 text-slate-600">{employee.job_title || '待完善'}</td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{employee.capabilities.filter((item) => item.verification_status === 'verified').slice(0, 4).map((item) => <span key={item.id} className="border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-800">{item.name}</span>)}</div></td>
                      <td className="px-4 py-3"><div className="h-1.5 w-24 bg-slate-100"><div className="h-1.5 bg-cyan-600" style={{ width: `${employee.workload_percent}%` }} /></div><span className="mt-1 block text-xs text-slate-500">{employee.workload_percent}%</span></td>
                      <td className="px-4 py-3 text-slate-600">{explanation.evidence_count}</td>
                      <td className="px-4 py-3">{availabilityLabel(employee.availability_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'taxonomy' && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div><h1 className="text-xl font-semibold">能力分类与索引</h1><p className="mt-1 text-sm text-slate-500">系统发现的新能力保持候选状态，审批前不进入正式筛选。</p></div>
              {session?.user.role === 'admin' && (
                <button type="button" onClick={() => void reindex()} disabled={reindexing} className="flex h-9 items-center gap-2 bg-slate-900 px-3 text-sm font-medium text-white disabled:opacity-50">
                  {reindexing ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseZap className="h-4 w-4" />}重建员工向量
                </button>
              )}
            </div>
            <div className="mt-5 grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(groupedTaxonomy).map(([kind, items]) => (
                <div key={kind}>
                  <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">{capabilityKindLabel(kind)}</h2><span className="text-xs text-slate-500">{items.length}</span></div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
                    {items.map((item) => (
                      <div key={item.id} className="px-3 py-3">
                        <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{item.name}</span>{item.status === 'candidate' && session?.user.role === 'admin' ? <button type="button" onClick={() => void approveCapability(item.id)} className="text-xs font-medium text-teal-700 hover:text-teal-900">批准</button> : <span className={`text-xs ${item.status === 'candidate' ? 'text-amber-700' : 'text-emerald-700'}`}>{item.status === 'candidate' ? '候选' : '已批准'}</span>}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{item.aliases.join(', ') || item.normalized_name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3 border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <ShieldCheck className="h-5 w-5 shrink-0 text-teal-700" />
              向量文档只包含岗位、能力、工具、语言、可用性和聚合证据，不包含姓名、邮箱、客户名称、评论正文或私人信息。
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function employeeInitials(name: string): string {
  const normalized = name.trim();
  if (!normalized) return '?';
  return normalized.length <= 2 ? normalized : normalized.slice(0, 2).toUpperCase();
}

function scorePercent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function capabilityKindLabel(kind: string): string {
  return ({ skill: '专业技能', tool: '工具', style: '风格', asset_type: '资产类型', pipeline_stage: '制作阶段', domain: '项目领域', language: '语言' } as Record<string, string>)[kind] ?? kind;
}

function availabilityLabel(status: string): string {
  return ({ available: '可安排', limited: '有限可用', unavailable: '不可用' } as Record<string, string>)[status] ?? status;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
