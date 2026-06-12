/*
```cypher
CREATE
  (f:File {name: "WikiAppPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/wiki/WikiAppPage", type: "module"}),
  (fn1:Function {name: "slugify", type: "function", language: "typescript", signature: "function slugify(value: string): string"}),
  (fn2:Function {name: "computePatch", type: "function", language: "typescript", signature: "function computePatch(before: string, after: string): TextPatch"}),
  (fn3:Function {name: "WikiAppPage", type: "function", language: "typescript", signature: "function WikiAppPage()"}),
  (v1:Variable {name: "WORKSPACE_ID", type: "variable"}),
  (v2:Variable {name: "spaces", type: "variable"}),
  (v3:Variable {name: "pages", type: "variable"}),
  (v4:Variable {name: "content", type: "variable"}),
  (v5:Variable {name: "serverContent", type: "variable"}),
  (v6:Variable {name: "version", type: "variable"}),
  (v7:Variable {name: "collaborators", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:USES]->(v1),
  (fn3)-[:CALLS]->(fn1),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v2),
  (fn3)-[:USES]->(v3),
  (fn3)-[:USES]->(v4),
  (fn3)-[:USES]->(v5),
  (fn3)-[:USES]->(v6),
  (fn3)-[:USES]->(v7);
```
*/

'use client';

import {
  AlertTriangle,
  BookOpen,
  Check,
  FilePlus2,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { wikiApi } from '@/lib/wikiApi';
import type { TextPatch, WikiPage, WikiPresence, WikiSpace } from '@/types/wiki';

const WORKSPACE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID ?? '00000000-0000-0000-0000-000000000001';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function computePatch(before: string, after: string): TextPatch {
  const previous = Array.from(before);
  const next = Array.from(after);
  let prefix = 0;
  while (prefix < previous.length && prefix < next.length && previous[prefix] === next[prefix]) {
    prefix += 1;
  }
  let previousSuffix = previous.length;
  let nextSuffix = next.length;
  while (
    previousSuffix > prefix &&
    nextSuffix > prefix &&
    previous[previousSuffix - 1] === next[nextSuffix - 1]
  ) {
    previousSuffix -= 1;
    nextSuffix -= 1;
  }
  return {
    from: prefix,
    to: previousSuffix,
    insert: next.slice(prefix, nextSuffix).join(''),
  };
}

export default function WikiAppPage() {
  const [spaces, setSpaces] = useState<WikiSpace[]>([]);
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string>();
  const [activePageId, setActivePageId] = useState<string>();
  const [activeTitle, setActiveTitle] = useState('');
  const [content, setContent] = useState('');
  const [serverContent, setServerContent] = useState('');
  const [version, setVersion] = useState(0);
  const [collaborators, setCollaborators] = useState<WikiPresence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [showSpaceForm, setShowSpaceForm] = useState(false);
  const [showPageForm, setShowPageForm] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const clientId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `wiki-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  ).current;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeSpace = useMemo(
    () => spaces.find((space) => space.id === activeSpaceId),
    [activeSpaceId, spaces],
  );

  const loadSpaces = useCallback(async () => {
    setLoading(true);
    try {
      const result = await wikiApi.listSpaces(WORKSPACE_ID);
      setSpaces(result);
      setActiveSpaceId((current) => current ?? result[0]?.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load wiki spaces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSpaces();
  }, [loadSpaces]);

  useEffect(() => {
    if (!activeSpaceId) {
      setPages([]);
      return;
    }
    void wikiApi
      .listPages(activeSpaceId)
      .then((result) => {
        setPages(result);
        if (!result.some((page) => page.id === activePageId)) {
          setActivePageId(result[0]?.id);
        }
      })
      .catch((error: Error) => toast.error(error.message));
  }, [activePageId, activeSpaceId]);

  const loadPage = useCallback(async (pageId: string) => {
    const snapshot = await wikiApi.syncPage(pageId, 0);
    setActivePageId(pageId);
    setActiveTitle(snapshot.page.title);
    setContent(snapshot.page.content_markdown);
    setServerContent(snapshot.page.content_markdown);
    setVersion(snapshot.page.version);
    setCollaborators(snapshot.collaborators);
    setSyncError('');
  }, []);

  useEffect(() => {
    if (!activePageId) {
      setActiveTitle('');
      setContent('');
      setServerContent('');
      setVersion(0);
      return;
    }
    void loadPage(activePageId).catch((error: Error) => toast.error(error.message));
  }, [activePageId, loadPage]);

  useEffect(() => {
    if (!activePageId) return;
    const timer = window.setInterval(() => {
      void wikiApi
        .syncPage(activePageId, version)
        .then((snapshot) => {
          setCollaborators(snapshot.collaborators);
          if (snapshot.page.version > version && content === serverContent) {
            setContent(snapshot.page.content_markdown);
            setServerContent(snapshot.page.content_markdown);
            setVersion(snapshot.page.version);
          }
        })
        .catch(() => undefined);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [activePageId, content, serverContent, version]);

  useEffect(() => {
    if (!activePageId) return;
    const heartbeat = () => {
      const input = textareaRef.current;
      void wikiApi
        .touchPresence(
          activePageId,
          clientId,
          input?.selectionStart,
          input?.selectionEnd,
        )
        .then(setCollaborators)
        .catch(() => undefined);
    };
    heartbeat();
    const timer = window.setInterval(heartbeat, 10_000);
    return () => window.clearInterval(timer);
  }, [activePageId, clientId]);

  useEffect(() => {
    if (!activePageId || content === serverContent || saving || syncError) return;
    const localContent = content;
    const baseContent = serverContent;
    const baseVersion = version;
    const timer = window.setTimeout(() => {
      setSaving(true);
      void wikiApi
        .applyUpdate(activePageId, clientId, baseVersion, computePatch(baseContent, localContent))
        .then((update) => {
          setServerContent(update.content_markdown);
          setVersion(update.version);
          setContent((current) =>
            current === localContent ? update.content_markdown : current,
          );
          setSyncError('');
        })
        .catch((error: Error) => setSyncError(error.message))
        .finally(() => setSaving(false));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [activePageId, clientId, content, saving, serverContent, syncError, version]);

  const createSpace = async () => {
    const name = spaceName.trim();
    if (!name) return;
    try {
      const space = await wikiApi.createSpace({
        workspace_id: WORKSPACE_ID,
        name,
        slug: slugify(name),
      });
      setSpaces((current) => [space, ...current]);
      setActiveSpaceId(space.id);
      setSpaceName('');
      setShowSpaceForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create wiki space');
    }
  };

  const createPage = async () => {
    const title = pageTitle.trim();
    if (!title || !activeSpaceId) return;
    try {
      const page = await wikiApi.createPage({
        workspace_id: WORKSPACE_ID,
        space_id: activeSpaceId,
        title,
        slug: slugify(title),
        content_markdown: `# ${title}\n\n`,
      });
      setPages((current) => [page, ...current]);
      setPageTitle('');
      setShowPageForm(false);
      await loadPage(page.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create wiki page');
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
    <div className="flex min-h-[calc(100vh-4rem)] bg-white text-slate-900">
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-slate-50">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-700" />
            <span className="truncate text-sm font-semibold">Knowledge Wiki</span>
          </div>
          <button
            className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
            onClick={() => setShowSpaceForm((value) => !value)}
            title="New space"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showSpaceForm && (
          <div className="border-b border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-600"
                value={spaceName}
                onChange={(event) => setSpaceName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && void createSpace()}
                placeholder="Space name"
              />
              <button
                className="rounded bg-emerald-700 p-1.5 text-white hover:bg-emerald-800"
                onClick={() => void createSpace()}
                title="Create space"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="border-b border-slate-200 p-3">
          <select
            className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
            value={activeSpaceId ?? ''}
            onChange={(event) => setActiveSpaceId(event.target.value || undefined)}
          >
            <option value="">Select space</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <span className="text-xs font-semibold uppercase text-slate-500">Pages</span>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-200"
            onClick={() => setShowPageForm((value) => !value)}
            title="New page"
            disabled={!activeSpaceId}
          >
            <FilePlus2 className="h-4 w-4" />
          </button>
        </div>

        {showPageForm && (
          <div className="px-3 pb-3">
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                value={pageTitle}
                onChange={(event) => setPageTitle(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && void createPage()}
                placeholder="Page title"
              />
              <button
                className="rounded bg-emerald-700 p-1.5 text-white"
                onClick={() => void createPage()}
                title="Create page"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <nav className="space-y-0.5 px-2">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`w-full truncate rounded px-3 py-2 text-left text-sm ${
                page.id === activePageId
                  ? 'bg-emerald-100 font-medium text-emerald-950'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setActivePageId(page.id)}
            >
              {page.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">{activeTitle || activeSpace?.name || 'Wiki'}</h1>
            {activePageId && (
              <p className="text-xs text-slate-500">Version {version}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded border border-slate-300 bg-slate-50 p-0.5 text-xs">
              <button
                className={`rounded px-2.5 py-1 ${mode === 'edit' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setMode('edit')}
              >
                Edit
              </button>
              <button
                className={`rounded px-2.5 py-1 ${mode === 'preview' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setMode('preview')}
              >
                Preview
              </button>
            </div>
            <span className="flex min-w-20 items-center justify-end gap-1 text-xs text-slate-500">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? 'Saving' : content === serverContent ? 'Saved' : 'Pending'}
            </span>
          </div>
        </header>

        {syncError && (
          <div className="flex items-center justify-between border-b border-amber-300 bg-amber-50 px-5 py-2 text-sm text-amber-900">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {syncError}
            </span>
            <button
              className="flex items-center gap-1 rounded px-2 py-1 font-medium hover:bg-amber-100"
              onClick={() => activePageId && void loadPage(activePageId)}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        )}

        {!activePageId ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
            <BookOpen className="h-8 w-8" />
            <span className="text-sm">Create or select a page</span>
          </div>
        ) : mode === 'edit' ? (
          <textarea
            ref={textareaRef}
            className="min-h-[calc(100vh-7.5rem)] w-full resize-none border-0 bg-white px-8 py-7 font-mono text-[15px] leading-7 outline-none"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onSelect={() => {
              const input = textareaRef.current;
              if (input) {
                void wikiApi.touchPresence(
                  activePageId,
                  clientId,
                  input.selectionStart,
                  input.selectionEnd,
                );
              }
            }}
            spellCheck
          />
        ) : (
          <article className="mx-auto max-w-4xl whitespace-pre-wrap px-8 py-8 text-[15px] leading-7 text-slate-800">
            {content || 'No content'}
          </article>
        )}
      </main>

      <aside className="w-60 shrink-0 border-l border-slate-200 bg-slate-50">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 text-sm font-semibold">
          <Users className="h-4 w-4 text-cyan-700" /> Collaborators
        </div>
        <div className="space-y-2 p-3">
          {collaborators.map((person) => (
            <div key={person.client_id} className="flex items-center gap-2 px-1 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-900">
                {person.display_name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 truncate text-sm text-slate-700">
                {person.display_name}
              </span>
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          ))}
          {collaborators.length === 0 && (
            <p className="px-1 py-2 text-xs text-slate-500">No active collaborators</p>
          )}
        </div>
      </aside>
    </div>
  );
}
