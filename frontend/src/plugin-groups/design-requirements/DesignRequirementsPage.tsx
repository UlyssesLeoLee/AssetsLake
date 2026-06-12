/*
```cypher
CREATE
  (f:File {name: "DesignRequirementsPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/design-requirements/DesignRequirementsPage", type: "module"}),
  (fn1:Function {name: "DesignRequirementsPage", type: "function", language: "typescript", signature: "function DesignRequirementsPage()"}),
  (fn2:Function {name: "priorityClass", type: "function", language: "typescript", signature: "function priorityClass(priority: DesignRequirementPriority): string"}),
  (v1:Variable {name: "WORKSPACE_ID", type: "variable"}),
  (v2:Variable {name: "requirements", type: "variable"}),
  (v3:Variable {name: "detail", type: "variable"}),
  (v4:Variable {name: "assets", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:USES]->(v1),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4);
```
*/

'use client';

import {
  Check,
  ClipboardList,
  Image as ImageIcon,
  Link2,
  Loader2,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { assetsApi } from '@/lib/api';
import { designRequirementApi } from '@/lib/designRequirementApi';
import type { AssetSummary } from '@/types/asset';
import type {
  DesignAssetRelation,
  DesignRequirement,
  DesignRequirementDetail,
  DesignRequirementPriority,
  DesignRequirementStatus,
} from '@/types/designRequirement';

const WORKSPACE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID ?? '00000000-0000-0000-0000-000000000001';

const STATUSES: DesignRequirementStatus[] = [
  'draft',
  'review',
  'approved',
  'rejected',
  'archived',
];

function priorityClass(priority: DesignRequirementPriority): string {
  if (priority === 'critical') return 'bg-red-100 text-red-800';
  if (priority === 'high') return 'bg-amber-100 text-amber-800';
  if (priority === 'low') return 'bg-slate-100 text-slate-600';
  return 'bg-cyan-100 text-cyan-800';
}

export default function DesignRequirementsPage() {
  const [requirements, setRequirements] = useState<DesignRequirement[]>([]);
  const [detail, setDetail] = useState<DesignRequirementDetail>();
  const [assets, setAssets] = useState<AssetSummary[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<DesignRequirementPriority>('medium');
  const [status, setStatus] = useState<DesignRequirementStatus>('draft');
  const [criteria, setCriteria] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assetId, setAssetId] = useState('');
  const [relationType, setRelationType] = useState<DesignAssetRelation>('reference');
  const [assetNote, setAssetNote] = useState('');
  const [comment, setComment] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const loadRequirements = useCallback(async () => {
    setLoading(true);
    try {
      const result = await designRequirementApi.list(WORKSPACE_ID);
      setRequirements(result);
      setActiveId((current) => current ?? result[0]?.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load design requirements');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const result = await designRequirementApi.get(id);
    setDetail(result);
    setTitle(result.requirement.title);
    setSummary(result.requirement.summary);
    setPriority(result.requirement.priority);
    setStatus(result.requirement.status);
    setCriteria(result.requirement.acceptance_criteria.join('\n'));
    setDueDate(result.requirement.due_date ?? '');
  }, []);

  useEffect(() => {
    void Promise.all([
      loadRequirements(),
      assetsApi
        .list({ page: 1, page_size: 100 })
        .then((result) => setAssets(result.data))
        .catch(() => setAssets([])),
    ]);
  }, [loadRequirements]);

  useEffect(() => {
    if (!activeId) {
      setDetail(undefined);
      return;
    }
    void loadDetail(activeId).catch((error: Error) => toast.error(error.message));
  }, [activeId, loadDetail]);

  const boundAssetIds = useMemo(
    () => detail?.assets.map((binding) => binding.asset_id) ?? [],
    [detail],
  );

  const createRequirement = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const created = await designRequirementApi.create({
        workspace_id: WORKSPACE_ID,
        title: title.trim(),
        summary: summary.trim(),
        priority,
        acceptance_criteria: criteria
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        due_date: dueDate || undefined,
      });
      setRequirements((current) => [created, ...current]);
      setShowCreate(false);
      setActiveId(created.id);
      toast.success('Design requirement created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create requirement');
    } finally {
      setSaving(false);
    }
  };

  const saveRequirement = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await designRequirementApi.update(detail.requirement.id, {
        title: title.trim(),
        summary: summary.trim(),
        priority,
        status,
        acceptance_criteria: criteria
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        due_date: dueDate || undefined,
        expected_version: detail.requirement.version,
      });
      setRequirements((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      await loadDetail(updated.id);
      toast.success('Design requirement saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save requirement');
    } finally {
      setSaving(false);
    }
  };

  const attachAsset = async () => {
    if (!detail || !assetId) return;
    try {
      await designRequirementApi.attachAsset(
        detail.requirement.id,
        assetId,
        relationType,
        assetNote || undefined,
      );
      setAssetId('');
      setAssetNote('');
      await loadDetail(detail.requirement.id);
      toast.success('Asset linked');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to link asset');
    }
  };

  const addComment = async () => {
    if (!detail || !comment.trim()) return;
    try {
      await designRequirementApi.comment(detail.requirement.id, comment.trim());
      setComment('');
      await loadDetail(detail.requirement.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to add comment');
    }
  };

  const generateDraft = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const draft = await designRequirementApi.aiDraft(
        WORKSPACE_ID,
        aiPrompt.trim(),
        boundAssetIds,
        detail?.requirement.project_id ?? undefined,
      );
      setTitle(draft.title);
      setSummary(draft.summary);
      setPriority(draft.priority);
      setCriteria(draft.acceptance_criteria.join('\n'));
      if (!detail) setShowCreate(true);
      toast.success('AI draft applied to the form');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate AI draft');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-rose-700" />
          <div>
            <h1 className="text-base font-semibold">Design Requirements</h1>
            <p className="text-xs text-slate-500">{requirements.length} requirements</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={() => {
            setShowCreate(true);
            setDetail(undefined);
            setActiveId(undefined);
            setTitle('');
            setSummary('');
            setCriteria('');
            setPriority('medium');
            setStatus('draft');
            setDueDate('');
          }}
        >
          <Plus className="h-4 w-4" /> New requirement
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="border-r border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 p-3">
            <select
              className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
              value="all"
              onChange={() => undefined}
            >
              <option value="all">All statuses</option>
            </select>
          </div>
          <div className="divide-y divide-slate-200">
            {requirements.map((item) => (
              <button
                key={item.id}
                className={`w-full px-4 py-3 text-left ${
                  activeId === item.id ? 'bg-white shadow-[inset_3px_0_0_#be123c]' : 'hover:bg-slate-100'
                }`}
                onClick={() => {
                  setShowCreate(false);
                  setActiveId(item.id);
                }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-medium leading-5">{item.title}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${priorityClass(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{item.status}</span>
                  <span>v{item.version}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 px-7 py-6">
          {!detail && !showCreate ? (
            <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-slate-500">
              <ClipboardList className="h-8 w-8" />
              <span className="text-sm">Select a design requirement</span>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Title</label>
                  <input
                    className="w-full border-0 border-b border-slate-300 px-0 py-2 text-xl font-semibold outline-none focus:border-rose-700"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Requirement title"
                  />
                </div>
                <button
                  className="mt-5 flex items-center gap-2 rounded bg-rose-700 px-3 py-2 text-sm font-medium text-white hover:bg-rose-800 disabled:opacity-50"
                  onClick={() => void (showCreate ? createRequirement() : saveRequirement())}
                  disabled={saving || !title.trim()}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : showCreate ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {showCreate ? 'Create' : 'Save'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-slate-200 py-4">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Status
                  <select
                    className="mt-1.5 block w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm font-normal capitalize text-slate-900"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as DesignRequirementStatus)}
                    disabled={showCreate}
                  >
                    {STATUSES.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Priority
                  <select
                    className="mt-1.5 block w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm font-normal text-slate-900"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as DesignRequirementPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Due date
                  <input
                    type="date"
                    className="mt-1.5 block w-full rounded border border-slate-300 px-2 py-2 text-sm font-normal text-slate-900"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Summary</span>
                <textarea
                  className="min-h-36 w-full resize-y rounded border border-slate-300 px-3 py-3 text-sm leading-6 outline-none focus:border-rose-700"
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Design intent, constraints, context, and expected outcome"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Acceptance criteria</span>
                <textarea
                  className="min-h-40 w-full resize-y rounded border border-slate-300 px-3 py-3 text-sm leading-7 outline-none focus:border-rose-700"
                  value={criteria}
                  onChange={(event) => setCriteria(event.target.value)}
                  placeholder="One testable criterion per line"
                />
              </label>

              {detail && (
                <section className="border-t border-slate-200 pt-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <ImageIcon className="h-4 w-4 text-rose-700" /> Bound assets
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {detail.assets.map((binding) => (
                      <div key={binding.asset_id} className="flex min-w-0 gap-3 border border-slate-200 p-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-slate-100">
                          {binding.preview_url ? (
                            <img className="h-full w-full object-cover" src={binding.preview_url} alt="" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{binding.asset_name}</p>
                          <p className="mt-1 text-xs capitalize text-slate-500">{binding.relation_type} · v{binding.asset_version ?? '-'}</p>
                          {binding.note && <p className="mt-1 line-clamp-2 text-xs text-slate-600">{binding.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_130px_auto] gap-2">
                    <select
                      className="min-w-0 rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={assetId}
                      onChange={(event) => setAssetId(event.target.value)}
                    >
                      <option value="">Select asset</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} · v{asset.version}
                        </option>
                      ))}
                    </select>
                    <select
                      className="rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={relationType}
                      onChange={(event) => setRelationType(event.target.value as DesignAssetRelation)}
                    >
                      <option value="reference">Reference</option>
                      <option value="source">Source</option>
                      <option value="target">Target</option>
                      <option value="deliverable">Deliverable</option>
                    </select>
                    <button
                      className="flex items-center gap-1.5 rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                      disabled={!assetId}
                      onClick={() => void attachAsset()}
                    >
                      <Link2 className="h-4 w-4" /> Link
                    </button>
                  </div>
                  <input
                    className="mt-2 w-full rounded border border-slate-300 px-2 py-2 text-sm"
                    value={assetNote}
                    onChange={(event) => setAssetNote(event.target.value)}
                    placeholder="Link note"
                  />
                </section>
              )}

              {detail && (
                <section className="border-t border-slate-200 pt-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4 text-cyan-700" /> Comments
                  </div>
                  <div className="space-y-3">
                    {detail.comments.map((item) => (
                      <div key={item.id} className="border-l-2 border-cyan-600 pl-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{item.author_name}</span>
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && void addComment()}
                      placeholder="Add a comment"
                    />
                    <button
                      className="rounded bg-cyan-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                      disabled={!comment.trim()}
                      onClick={() => void addComment()}
                    >
                      Send
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}
        </main>

        <aside className="border-l border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-violet-700" /> AI draft
          </div>
          <textarea
            className="min-h-40 w-full resize-y rounded border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-violet-700"
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            placeholder="Describe the visual goal, constraints, audience, and delivery context"
          />
          <button
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-violet-700 px-3 py-2 text-sm font-medium text-white hover:bg-violet-800 disabled:opacity-50"
            onClick={() => void generateDraft()}
            disabled={aiLoading || !aiPrompt.trim()}
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate draft
          </button>
          <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
            {detail ? `${boundAssetIds.length} bound assets included in context.` : 'Draft will populate the new requirement form.'}
          </div>
        </aside>
      </div>
    </div>
  );
}
