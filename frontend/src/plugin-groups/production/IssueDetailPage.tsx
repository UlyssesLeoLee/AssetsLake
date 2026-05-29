/*
```cypher
CREATE
  (f:File {name: "IssueDetailPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/IssueDetailPage", type: "module"}),
  (fn1:Function {name: "IssueDetailPage", type: "function", language: "typescript", signature: "function IssueDetailPage()"}),
  (fn2:Function {name: "createReview.mutationFn", type: "function", language: "typescript", signature: "(scope: 'internal' | 'client') => Promise<unknown>"}),
  (fn3:Function {name: "createReview.onSuccess", type: "function", language: "typescript", signature: "() => void"}),
  (fn4:Function {name: "issueFieldSyncEffect", type: "function", language: "typescript", signature: "useEffect callback"}),
  (v1:Variable {name: "issueId", type: "variable"}),
  (v2:Variable {name: "issue", type: "variable"}),
  (v3:Variable {name: "assets", type: "variable"}),
  (v4:Variable {name: "history", type: "variable"}),
  (v5:Variable {name: "comments", type: "variable"}),
  (v6:Variable {name: "workLogs", type: "variable"}),
  (v7:Variable {name: "annotation", type: "variable"}),
  (v8:Variable {name: "evidenceModel", type: "variable"}),
  (v9:Variable {name: "attachAssetId", type: "variable"}),
  (v10:Variable {name: "attachLinkType", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:USES]->(v7),
  (fn1)-[:USES]->(v8),
  (fn1)-[:USES]->(v9),
  (fn1)-[:USES]->(v10),
  (fn2)-[:USES]->(v1),
  (fn2)-[:USES]->(v7),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v2);
```
*/

'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GitBranch,
  ImageIcon,
  Link2,
  MessageSquare,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';

import {
  useAddIssueComment,
  useApproveIssue,
  useAttachIssueAsset,
  useCreateIssueWorkLog,
  useDeleteIssue,
  useIssue,
  useIssueAssets,
  useIssueComments,
  useIssueHistory,
  useIssueWorkLogs,
  useRequestRevision,
  useUpdateIssue,
} from '@/hooks/useProduction';
import { productionApi } from '@/lib/productionApi';
import { cn } from '@/lib/utils';
import type { AttachIssueAssetRequest, IssuePriority, IssueStatus } from '@/types/production';
import {
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  ISSUE_TYPE_LABELS,
} from '@/types/production';
import {
  AI_QA_RULES,
  EmptyPanel,
  formatDate,
  formatMinutes,
  getParamId,
  PageHeader,
  PriorityPill,
  QaPill,
  SectionTitle,
  StatusPill,
} from '@/plugin-groups/production/ProductionPluginPrimitives';
import {
  DataLakeEvidencePanel,
  IssueEvidenceReadinessPanel,
  LangGraphRecommendationPanel,
} from '@/plugin-groups/production/IssueEvidencePrimitives';
import { buildIssueEvidenceModel } from '@/plugin-groups/production/issueEvidenceModel';

export function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = getParamId(params?.id);
  const queryClient = useQueryClient();
  const { data: issue, isLoading, isError, error } = useIssue(issueId);
  const { data: assets = [] } = useIssueAssets(issueId);
  const { data: history = [] } = useIssueHistory(issueId);
  const { data: comments = [] } = useIssueComments(issueId);
  const { data: workLogs = [] } = useIssueWorkLogs(issueId);
  const updateIssue = useUpdateIssue();
  const deleteIssue = useDeleteIssue();
  const addComment = useAddIssueComment();
  const createWorkLog = useCreateIssueWorkLog();
  const attachIssueAsset = useAttachIssueAsset();
  const approveIssue = useApproveIssue();
  const requestRevision = useRequestRevision();
  const [revisionReason, setRevisionReason] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [workLogMinutes, setWorkLogMinutes] = useState(60);
  const [workLogBody, setWorkLogBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<IssuePriority>('medium');
  const [editStatus, setEditStatus] = useState<IssueStatus>('backlog');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStoryPoints, setEditStoryPoints] = useState('');
  const [editRankKey, setEditRankKey] = useState('000000');
  const [attachAssetId, setAttachAssetId] = useState('');
  const [attachLinkType, setAttachLinkType] = useState<NonNullable<AttachIssueAssetRequest['link_type']>>('reference');
  const [annotation, setAnnotation] = useState({ x: 0.5, y: 0.5, width: 0.25, height: 0.2 });

  const createReview = useMutation({
    mutationFn: (scope: 'internal' | 'client') =>
      productionApi.issues.review(issueId as string, {
        scope,
        reviewer_name: scope === 'internal' ? 'Art Director' : 'Client Reviewer',
        comment: reviewComment,
        annotation,
        severity: 'warning',
      }),
    onSuccess: () => {
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['issue-history', issueId] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });

  useEffect(() => {
    if (!issue) return;
    setEditTitle(issue.title);
    setEditPriority(issue.priority);
    setEditStatus(issue.status);
    setEditDueDate(issue.due_date ?? '');
    setEditStoryPoints(issue.story_points === undefined ? '' : String(issue.story_points));
    setEditRankKey(issue.rank_key ?? '000000');
  }, [issue?.id]);

  if (!issueId) {
    return <EmptyPanel title="Issue not found" />;
  }

  if (isLoading) {
    return <EmptyPanel title="Loading issue" />;
  }

  if (isError || !issue) {
    return <EmptyPanel title="Failed to load issue" subtitle={String(error)} />;
  }

  const evidenceModel = buildIssueEvidenceModel(issue, assets, history, comments);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title={`${issue.issue_key} ${issue.title}`}
        subtitle={`${ISSUE_TYPE_LABELS[issue.issue_type]} - ${ISSUE_STATUS_LABELS[issue.status]}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                requestRevision.mutate({
                  id: issue.id,
                  req: {
                    requester_name: 'Art Director',
                    reason: revisionReason || 'Revision required',
                    annotation,
                  },
                })
              }
            >
              <AlertTriangle className="h-4 w-4" />
              Revision
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                updateIssue.mutate({
                  id: issue.id,
                  req: {
                    title: editTitle,
                    priority: editPriority,
                    status: editStatus,
                    due_date: editDueDate || undefined,
                    story_points: editStoryPoints ? Number(editStoryPoints) : undefined,
                    rank_key: editRankKey || undefined,
                    actor: 'producer',
                    expected_version: issue.version,
                  },
                })
              }
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                approveIssue.mutate({
                  id: issue.id,
                  req: { approver_name: 'Art Director', scope: 'internal', note: 'Approved' },
                })
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>
            <button
              className="btn-secondary border-red-500/30 text-red-300 hover:bg-red-500/10"
              onClick={() =>
                deleteIssue.mutate(issue.id, {
                  onSuccess: () => router.push('/board'),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<FileText className="h-4 w-4" />} title="Issue Fields" />
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <label className="lg:col-span-2">
                <span className="label">Title</span>
                <input className="input" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
              </label>
              <label>
                <span className="label">Status</span>
                <select className="input" value={editStatus} onChange={(event) => setEditStatus(event.target.value as IssueStatus)}>
                  {ISSUE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {ISSUE_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="label">Priority</span>
                <select className="input" value={editPriority} onChange={(event) => setEditPriority(event.target.value as IssuePriority)}>
                  {(['low', 'medium', 'high', 'urgent'] as IssuePriority[]).map((priority) => (
                    <option key={priority} value={priority}>
                      {ISSUE_PRIORITY_LABELS[priority]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="label">Due Date</span>
                <input className="input" type="date" value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} />
              </label>
              <label>
                <span className="label">Story Points</span>
                <input className="input" type="number" min={0} step={0.5} value={editStoryPoints} onChange={(event) => setEditStoryPoints(event.target.value)} />
              </label>
              <label className="lg:col-span-2">
                <span className="label">Rank Key</span>
                <input className="input" value={editRankKey} onChange={(event) => setEditRankKey(event.target.value)} />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusPill status={issue.status} />
              <PriorityPill priority={issue.priority} />
              <QaPill status={issue.qa_status} />
              <span className="badge border-slate-600 bg-slate-700/30 text-slate-300">
                R{issue.revision_count}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {issue.description || 'No description'}
            </p>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<ImageIcon className="h-4 w-4" />} title="Assets" />
            <div className="mt-3 grid gap-3 rounded-lg border border-surface-border bg-surface-elevated p-3 md:grid-cols-[1fr_160px_auto]">
              <label>
                <span className="label">Data Lake Asset ID</span>
                <input
                  className="input"
                  value={attachAssetId}
                  onChange={(event) => setAttachAssetId(event.target.value)}
                  placeholder="asset id"
                />
              </label>
              <label>
                <span className="label">Link Type</span>
                <select
                  className="input"
                  value={attachLinkType}
                  onChange={(event) => setAttachLinkType(event.target.value as NonNullable<AttachIssueAssetRequest['link_type']>)}
                >
                  <option value="reference">Reference</option>
                  <option value="submission">Submission</option>
                  <option value="dependency">Dependency</option>
                </select>
              </label>
              <button
                className="btn-secondary self-end"
                disabled={!attachAssetId.trim() || attachIssueAsset.isPending}
                onClick={() =>
                  attachIssueAsset.mutate(
                    {
                      id: issue.id,
                      req: {
                        asset_id: attachAssetId.trim(),
                        link_type: attachLinkType,
                        actor: 'producer',
                      },
                    },
                    { onSuccess: () => setAttachAssetId('') }
                  )
                }
              >
                <Link2 className="h-4 w-4" />
                Attach Evidence
              </button>
              {attachIssueAsset.isSuccess && <div className="text-xs text-emerald-300 md:col-span-3">Evidence linked</div>}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex gap-3 rounded-lg border border-surface-border bg-surface-elevated p-3"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
                    {asset.preview_url || asset.file_url ? (
                      <img
                        src={asset.preview_url || asset.file_url}
                        alt={asset.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-100">{asset.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      v{asset.version} - {asset.asset_type} - {asset.link_type}
                    </div>
                    <div className="mt-2 inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                      {asset.status}
                    </div>
                  </div>
                </div>
              ))}
              {assets.length === 0 && <p className="text-sm text-slate-500">No linked assets</p>}
            </div>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<MessageSquare className="h-4 w-4" />} title="Comments" />
            <div className="mt-3 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-surface-border bg-surface-elevated p-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>{comment.author_name}</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{comment.body}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-slate-500">No comments</p>}
            </div>
            <textarea
              className="input mt-3 min-h-24 resize-none"
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Add comment"
            />
            <button
              className="btn-secondary mt-3 w-full justify-center"
              disabled={!commentBody.trim() || addComment.isPending}
              onClick={() =>
                addComment.mutate(
                  { id: issue.id, req: { author_name: 'Producer', body: commentBody, visibility: 'internal' } },
                  { onSuccess: () => setCommentBody('') }
                )
              }
            >
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </button>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<Clock className="h-4 w-4" />} title="Work Logs" />
            <div className="mt-3 grid gap-3 md:grid-cols-[140px_1fr]">
              <label>
                <span className="label">Minutes</span>
                <input className="input" type="number" min={1} value={workLogMinutes} onChange={(event) => setWorkLogMinutes(Number(event.target.value))} />
              </label>
              <label>
                <span className="label">Note</span>
                <input className="input" value={workLogBody} onChange={(event) => setWorkLogBody(event.target.value)} />
              </label>
            </div>
            <button
              className="btn-secondary mt-3"
              disabled={workLogMinutes <= 0 || createWorkLog.isPending}
              onClick={() =>
                createWorkLog.mutate(
                  {
                    id: issue.id,
                    req: { author_name: 'Artist', time_spent_minutes: workLogMinutes, body: workLogBody || undefined },
                  },
                  { onSuccess: () => setWorkLogBody('') }
                )
              }
            >
              <Clock className="h-4 w-4" />
              Log Work
            </button>
            <div className="mt-3 space-y-2">
              {workLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-md border border-surface-border bg-surface-elevated px-3 py-2 text-sm">
                  <span className="text-slate-300">{log.author_name}</span>
                  <span className="text-slate-500">{formatMinutes(log.time_spent_minutes)}</span>
                </div>
              ))}
              {workLogs.length === 0 && <p className="text-sm text-slate-500">No work logged</p>}
            </div>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<GitBranch className="h-4 w-4" />} title="Status History" />
            <div className="mt-3 space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <div>
                    <div className="text-slate-200">
                      {entry.from_status ? ISSUE_STATUS_LABELS[entry.from_status] : 'Created'} -&gt;{' '}
                      {ISSUE_STATUS_LABELS[entry.to_status]}
                    </div>
                    <div className="text-xs text-slate-500">
                      {entry.actor} - {formatDate(entry.created_at)}
                      {entry.reason ? ` - ${entry.reason}` : ''}
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm text-slate-500">No history</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <IssueEvidenceReadinessPanel model={evidenceModel} />
          <DataLakeEvidencePanel model={evidenceModel} />
          <LangGraphRecommendationPanel model={evidenceModel} />

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<ShieldCheck className="h-4 w-4" />} title="Review" />
            <textarea
              className="input mt-3 min-h-28 resize-none"
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder="Review note"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(['x', 'y', 'width', 'height'] as const).map((key) => (
                <label key={key} className="text-xs text-slate-400">
                  {key}
                  <input
                    className="input mt-1"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={annotation[key]}
                    onChange={(event) =>
                      setAnnotation((prev) => ({
                        ...prev,
                        [key]: Number(event.target.value),
                      }))
                    }
                  />
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => createReview.mutate('internal')}>
                Internal
              </button>
              <button className="btn-secondary flex-1" onClick={() => createReview.mutate('client')}>
                Client
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<Sparkles className="h-4 w-4" />} title="AI QA" />
            <div className="mt-3 space-y-2">
              {AI_QA_RULES.map((rule, index) => (
                <div
                  key={rule}
                  className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-elevated px-3 py-2"
                >
                  <span className="text-xs text-slate-300">{rule}</span>
                  <span className={cn('h-2 w-2 rounded-full', index < 5 ? 'bg-emerald-400' : 'bg-amber-400')} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
            <SectionTitle icon={<Calendar className="h-4 w-4" />} title="Schedule" />
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Start</span>
                <span className="text-slate-200">{formatDate(issue.start_date)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Due</span>
                <span className="text-slate-200">{formatDate(issue.due_date)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vendor</span>
                <span className="max-w-40 truncate text-slate-200">{issue.vendor_id || '-'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sprint</span>
                <span className="max-w-40 truncate text-slate-200">{issue.sprint_id || '-'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Epic</span>
                <span className="max-w-40 truncate text-slate-200">{issue.epic_id || '-'}</span>
              </div>
            </div>
            <textarea
              className="input mt-3 min-h-20 resize-none"
              value={revisionReason}
              onChange={(event) => setRevisionReason(event.target.value)}
              placeholder="Revision reason"
            />
          </section>
        </aside>
      </div>
    </div>
  );
}

export default IssueDetailPage;
