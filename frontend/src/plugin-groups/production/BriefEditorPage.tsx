/*
```cypher
CREATE
  (f:File {name: "BriefEditorPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/BriefEditorPage", type: "module"}),
  (fn1:Function {name: "BriefEditorPage", type: "function", language: "typescript", signature: "function BriefEditorPage()"}),
  (fn2:Function {name: "submitBrief", type: "function", language: "typescript", signature: "const submitBrief = () => void"}),
  (v1:Variable {name: "createIssue", type: "variable"}),
  (v2:Variable {name: "title", type: "variable"}),
  (v3:Variable {name: "issueType", type: "variable"}),
  (v4:Variable {name: "priority", type: "variable"}),
  (v5:Variable {name: "criteria", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:CALLS]->(fn2);
```
*/

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';

import { useCreateIssue } from '@/hooks/useProduction';
import type { IssuePriority, IssueType } from '@/types/production';
import { ISSUE_PRIORITY_LABELS, ISSUE_TYPE_LABELS } from '@/types/production';
import {
  DEFAULT_CLIENT_ID,
  DEFAULT_PROJECT_ID,
  DEFAULT_VENDOR_ID,
  ISSUE_TYPES,
  Metric,
  PageHeader,
} from '@/plugin-groups/production/ProductionPluginPrimitives';

export function BriefEditorPage() {
  const createIssue = useCreateIssue();
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('concept_art');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [storyPoints, setStoryPoints] = useState('3');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('style match\nsource files included\nnaming convention passed');

  const submitBrief = () => {
    createIssue.mutate({
      project_id: DEFAULT_PROJECT_ID,
      vendor_id: DEFAULT_VENDOR_ID,
      client_id: DEFAULT_CLIENT_ID,
      title: title || 'Untitled art brief',
      description,
      issue_type: issueType,
      asset_type: issueType === 'ui_art' ? 'ui' : issueType === 'concept_art' ? 'concept_art' : 'other',
      priority,
      due_date: dueDate || undefined,
      story_points: storyPoints ? Number(storyPoints) : undefined,
      metadata: {
        brief: true,
        acceptance_criteria: criteria.split('\n').filter(Boolean),
      },
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Brief Editor"
        subtitle="Art requirements, acceptance criteria, and vendor-ready issue creation"
        actions={
          <button className="btn-primary" onClick={submitBrief} disabled={createIssue.isPending}>
            <Send className="h-4 w-4" />
            Create Issue
          </button>
        }
      />

      <div className="grid flex-1 gap-4 overflow-y-auto p-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-surface-border bg-surface-secondary p-4">
          <label className="label" htmlFor="brief-title">Title</label>
          <input
            id="brief-title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <label>
              <span className="label">Type</span>
              <select
                aria-label="Type"
                className="input"
                value={issueType}
                onChange={(event) => setIssueType(event.target.value as IssueType)}
              >
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {ISSUE_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label">Priority</span>
              <select
                aria-label="Priority"
                className="input"
                value={priority}
                onChange={(event) => setPriority(event.target.value as IssuePriority)}
              >
                {(['low', 'medium', 'high', 'urgent'] as IssuePriority[]).map((item) => (
                  <option key={item} value={item}>
                    {ISSUE_PRIORITY_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label">Due Date</span>
              <input
                aria-label="Due Date"
                className="input"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </label>
            <label>
              <span className="label">Story Points</span>
              <input
                aria-label="Story Points"
                className="input"
                type="number"
                min={0}
                step={0.5}
                value={storyPoints}
                onChange={(event) => setStoryPoints(event.target.value)}
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="label">Brief</span>
            <textarea
              aria-label="Brief"
              className="input min-h-64 resize-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="mt-4 block">
            <span className="label">Acceptance Criteria</span>
            <textarea
              aria-label="Acceptance Criteria"
              className="input min-h-36 resize-none"
              value={criteria}
              onChange={(event) => setCriteria(event.target.value)}
            />
          </label>
        </section>

        <aside className="space-y-4">
          <Metric label="Project" value="DEFAULT" />
          <Metric label="Vendor" value="VENDOR" />
          <Metric label="Client" value="CLIENT" />
          {createIssue.data && (
            <Link
              href={`/issues/${createIssue.data.id}`}
              className="block rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"
            >
              {createIssue.data.issue_key} created
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

export default BriefEditorPage;
