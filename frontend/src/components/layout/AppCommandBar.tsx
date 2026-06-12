/*
```cypher
CREATE
  (f:File {name: "AppCommandBar.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/layout/AppCommandBar", type: "module"}),
  (c1:Class {name: "AppCommandBarProps", type: "class", language: "typescript"}),
  (fn1:Function {name: "AppCommandBar", type: "function", language: "typescript"}),
  (fn2:Function {name: "AssistantMessageView", type: "function", language: "typescript"}),
  (fn3:Function {name: "temporaryMessage", type: "function", language: "typescript"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3);
```
*/

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  BrainCircuit,
  Check,
  History,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';

import { appAssistantApi } from '@/lib/appAssistantApi';
import type { AuthSession } from '@/lib/authSession';
import { cn } from '@/lib/utils';
import type {
  AppAssistantAction,
  AppAssistantConversation,
  AppAssistantMessage,
  AppAssistantMessageMetadata,
} from '@/types/appAssistant';

interface AppCommandBarProps {
  session: AuthSession | null;
  pathname: string;
  appId: string;
  appLabel: string;
  routeId: string;
  routeLabel: string;
}

export function AppCommandBar({
  session,
  pathname,
  appId,
  appLabel,
  routeId,
  routeLabel,
}: AppCommandBarProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedAppRef = useRef<string>();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<AppAssistantConversation[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<AppAssistantMessage[]>([]);
  const [error, setError] = useState<string>();
  const [pendingAction, setPendingAction] = useState<AppAssistantAction>();
  const [executingActionId, setExecutingActionId] = useState<string>();

  const latestPeopleContext = useMemo(
    () =>
      [...messages].reverse().find((message) => message.metadata.people_context)?.metadata
        .people_context,
    [messages],
  );

  const loadHistory = useCallback(async () => {
    if (!session) return;
    setHistoryLoading(true);
    setError(undefined);
    try {
      const result = await appAssistantApi.history(appId);
      setHistory(result);
      if (initializedAppRef.current !== appId && result[0]) {
        initializedAppRef.current = appId;
        setConversationId(result[0].id);
        setMessages(result[0].messages);
      }
    } catch (historyError) {
      setError(historyError instanceof Error ? historyError.message : 'History unavailable');
    } finally {
      setHistoryLoading(false);
    }
  }, [appId, session]);

  useEffect(() => {
    setConversationId(undefined);
    setMessages([]);
    setHistory([]);
    setError(undefined);
    setPendingAction(undefined);
    initializedAppRef.current = undefined;
  }, [appId]);

  useEffect(() => {
    if (historyOpen) void loadHistory();
  }, [historyOpen, loadHistory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async () => {
    const message = input.trim();
    if (!message || !session || sending) return;
    const optimistic = temporaryMessage('user', message);
    setMessages((current) => [...current, optimistic]);
    setInput('');
    setSending(true);
    setError(undefined);
    initializedAppRef.current = appId;
    setHistoryOpen(true);

    try {
      const response = await appAssistantApi.chat({
        message,
        conversation_id: conversationId,
        app_id: appId,
        route_id: routeId,
        pathname,
        context: JSON.stringify({
          app_label: appLabel,
          route_label: routeLabel,
          pathname,
          control_mode: 'guarded',
        }),
      });
      const metadata: AppAssistantMessageMetadata = {
        actions: response.actions,
        langgraph_nodes: response.langgraph_nodes,
        people_context: response.people_context,
        ai_status: response.ai_status,
      };
      setConversationId(response.conversation_id);
      setMessages((current) => [
        ...current,
        temporaryMessage('assistant', response.message, metadata),
      ]);
      const refreshed = await appAssistantApi.history(appId);
      setHistory(refreshed);
    } catch (chatError) {
      const messageText = chatError instanceof Error ? chatError.message : 'Assistant unavailable';
      setError(messageText);
      setMessages((current) => [...current, temporaryMessage('system', messageText)]);
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (conversation: AppAssistantConversation) => {
    setConversationId(conversation.id);
    setMessages(conversation.messages);
    setError(undefined);
  };

  const startConversation = () => {
    setConversationId(undefined);
    setMessages([]);
    setInput('');
    setError(undefined);
    setPendingAction(undefined);
  };

  const runAction = (action: AppAssistantAction) => {
    window.dispatchEvent(
      new CustomEvent('assetslake:assistant-action', {
        detail: { ...action, app_id: appId, route_id: routeId, pathname },
      }),
    );
    if (action.requires_human_approval) {
      setPendingAction(action);
      return;
    }
    if (action.href) router.push(action.href);
  };

  const approveAction = async () => {
    if (!pendingAction || executingActionId) return;
    setExecutingActionId(pendingAction.action_id);
    setError(undefined);
    try {
      const result = await appAssistantApi.recordReplicaAction({
        action_id: pendingAction.action_id,
        title: pendingAction.label,
        app: appLabel,
        target_label: routeLabel,
        intent: pendingAction.description,
        writes: [pendingAction.kind],
        metadata: {
          conversation_id: conversationId,
          app_id: appId,
          route_id: routeId,
          pathname,
        },
      });
      setMessages((current) => [
        ...current,
        temporaryMessage(
          'system',
          `${pendingAction.label} recorded to ${result.record.write_scope} control (${result.record.status}).`,
        ),
      ]);
      setPendingAction(undefined);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed');
    } finally {
      setExecutingActionId(undefined);
    }
  };

  return (
    <div className="relative z-40 flex h-[38px] shrink-0 items-center border-t border-white/[0.08] bg-[#090d12]/96 px-2 shadow-[0_-10px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      {historyOpen ? (
        <section className="fixed bottom-[46px] right-3 z-50 flex max-h-[min(58vh,520px)] w-[min(430px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg border border-white/[0.1] bg-[#0d131a]/98 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-white/[0.08] px-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-300/20 bg-brand-500/10 text-brand-200">
              <BrainCircuit className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-100">{routeLabel}</div>
              <div className="truncate text-[10px] text-slate-500">{appLabel}</div>
            </div>
            <button
              type="button"
              title="New conversation"
              aria-label="New conversation"
              onClick={startConversation}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Close history"
              aria-label="Close history"
              onClick={() => setHistoryOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </header>

          {history.length > 1 ? (
            <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.06] px-2 py-1.5">
              {history.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  title={conversation.title}
                  onClick={() => selectConversation(conversation)}
                  className={cn(
                    'max-w-36 shrink-0 truncate rounded-md border px-2 py-1 text-[10px] transition-colors',
                    conversation.id === conversationId
                      ? 'border-brand-300/25 bg-brand-500/12 text-brand-100'
                      : 'border-transparent text-slate-500 hover:border-white/[0.08] hover:text-slate-300',
                  )}
                >
                  {conversation.title}
                </button>
              ))}
            </div>
          ) : null}

          <div ref={scrollRef} className="min-h-36 flex-1 space-y-2 overflow-y-auto p-3">
            {historyLoading && messages.length === 0 ? (
              <div className="flex h-28 items-center justify-center text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-28 items-center justify-center text-xs text-slate-600">
                Ready for a command
              </div>
            ) : (
              messages.map((message) => (
                <AssistantMessageView key={message.id} message={message} onAction={runAction} />
              ))
            )}
            {sending ? (
              <div className="flex items-center gap-2 px-1 py-2 text-[11px] text-slate-500">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-brand-300" />
                Running graph
              </div>
            ) : null}
          </div>

          {pendingAction ? (
            <div className="flex shrink-0 items-center gap-2 border-t border-amber-300/15 bg-amber-300/[0.035] px-3 py-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-amber-100">
                  {pendingAction.label}
                </div>
                <div className="truncate text-[9px] text-amber-200/50">replica-only write</div>
              </div>
              <button
                type="button"
                onClick={() => setPendingAction(undefined)}
                disabled={Boolean(executingActionId)}
                className="h-6 rounded-md px-2 text-[10px] text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void approveAction()}
                disabled={Boolean(executingActionId)}
                className="inline-flex h-6 items-center gap-1 rounded-md border border-amber-300/25 bg-amber-300/10 px-2 text-[10px] font-medium text-amber-100 transition-colors hover:border-amber-300/45 disabled:opacity-50"
              >
                {executingActionId ? (
                  <LoaderCircle className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Approve
              </button>
            </div>
          ) : null}

          {error ? (
            <div className="shrink-0 border-t border-rose-400/15 bg-rose-400/[0.04] px-3 py-2 text-[10px] text-rose-300">
              {error}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="hidden min-w-0 items-center gap-1.5 border-r border-white/[0.08] pr-2 sm:flex">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-sakura-300" />
          <span className="max-w-32 truncate text-[10px] font-semibold uppercase text-slate-400">
            {routeLabel}
          </span>
          {latestPeopleContext?.available ? (
            <span
              title={`${latestPeopleContext.capabilities.length} capability tags in context`}
              className="flex items-center gap-1 text-[10px] text-emerald-300"
            >
              <UsersRound className="h-3 w-3" />
              {latestPeopleContext.capabilities.length}
            </span>
          ) : null}
        </div>

        <form
          className="flex min-w-0 flex-1 items-center gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={!session || sending}
            aria-label="Assistant command"
            placeholder={session ? `Command ${routeLabel}...` : 'Sign in to use assistant'}
            className="h-7 min-w-0 flex-1 border-0 bg-transparent px-1 text-xs text-slate-100 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            title="Send command"
            aria-label="Send command"
            disabled={!session || sending || !input.trim()}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-brand-300/20 bg-brand-500/10 text-brand-200 transition-colors hover:border-brand-300/40 hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {sending ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5" />
            )}
          </button>
        </form>

        <button
          type="button"
          title="Chat history"
          aria-label="Chat history"
          disabled={!session}
          onClick={() => setHistoryOpen((current) => !current)}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-35',
            historyOpen
              ? 'border-sakura-300/30 bg-sakura-300/10 text-sakura-200'
              : 'border-white/[0.08] text-slate-500 hover:border-white/[0.14] hover:text-slate-200',
          )}
        >
          <History className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function AssistantMessageView({
  message,
  onAction,
}: {
  message: AppAssistantMessage;
  onAction: (action: AppAssistantAction) => void;
}) {
  const nodes = message.metadata.langgraph_nodes ?? [];
  const actions = message.metadata.actions ?? [];
  return (
    <div
      className={cn(
        'max-w-[92%] rounded-md border px-2.5 py-2 text-xs leading-relaxed',
        message.role === 'user'
          ? 'ml-auto border-brand-300/20 bg-brand-500/10 text-brand-50'
          : message.role === 'system'
            ? 'border-rose-400/20 bg-rose-400/[0.06] text-rose-200'
            : 'border-white/[0.08] bg-white/[0.035] text-slate-200',
      )}
    >
      <div className="whitespace-pre-wrap break-words">{message.content}</div>
      {nodes.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1 border-t border-white/[0.06] pt-2">
          {nodes.slice(0, 4).map((node) => (
            <span
              key={node.name}
              title={node.detail}
              className={cn(
                'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px]',
                node.state === 'guarded'
                  ? 'border-amber-300/20 text-amber-300'
                  : node.state === 'ready'
                    ? 'border-emerald-300/20 text-emerald-300'
                    : 'border-slate-600 text-slate-500',
              )}
            >
              {node.state === 'guarded' ? (
                <ShieldCheck className="h-2.5 w-2.5" />
              ) : (
                <Check className="h-2.5 w-2.5" />
              )}
              {node.name.replaceAll('_', ' ')}
            </span>
          ))}
          {nodes.length > 4 ? (
            <span className="px-1 py-0.5 text-[9px] text-slate-600">+{nodes.length - 4}</span>
          ) : null}
        </div>
      ) : null}
      {actions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {actions.map((action) => (
            <button
              key={action.action_id}
              type="button"
              title={action.description}
              onClick={() => onAction(action)}
              className={cn(
                'inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[10px] font-medium transition-colors',
                action.requires_human_approval
                  ? 'border-amber-300/20 bg-amber-300/[0.06] text-amber-200 hover:border-amber-300/40'
                  : 'border-brand-300/20 bg-brand-500/10 text-brand-100 hover:border-brand-300/40',
              )}
            >
              {action.requires_human_approval ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <ArrowUp className="h-3 w-3 rotate-45" />
              )}
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function temporaryMessage(
  role: AppAssistantMessage['role'],
  content: string,
  metadata: AppAssistantMessageMetadata = {},
): AppAssistantMessage {
  return {
    id: `assistant-${role}-${Date.now()}-${Math.round(Math.random() * 10_000)}`,
    role,
    content,
    metadata,
    created_at: new Date().toISOString(),
  };
}
