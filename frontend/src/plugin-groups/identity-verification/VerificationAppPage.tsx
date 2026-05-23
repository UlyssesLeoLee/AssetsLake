/*
```cypher
CREATE
  (f:File {name: "VerificationAppPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/identity-verification/VerificationAppPage", type: "module"}),
  (fn1:Function {name: "VerificationAppPage", type: "function", language: "typescript", signature: "function VerificationAppPage()"}),
  (fn2:Function {name: "loadApp", type: "function", language: "typescript", signature: "async function loadApp(): Promise<void>"}),
  (fn3:Function {name: "refreshOutbox", type: "function", language: "typescript", signature: "async function refreshOutbox(): Promise<void>"}),
  (fn4:Function {name: "resetChallenge", type: "function", language: "typescript", signature: "function resetChallenge(nextPurpose?: VerificationPurpose): void"}),
  (fn5:Function {name: "requestCode", type: "function", language: "typescript", signature: "async function requestCode(): Promise<void>"}),
  (fn6:Function {name: "verifyCode", type: "function", language: "typescript", signature: "async function verifyCode(): Promise<void>"}),
  (fn7:Function {name: "submitRegister", type: "function", language: "typescript", signature: "async function submitRegister(): Promise<void>"}),
  (fn8:Function {name: "submitPasswordChange", type: "function", language: "typescript", signature: "async function submitPasswordChange(): Promise<void>"}),
  (fn9:Function {name: "StatusPill", type: "function", language: "typescript", signature: "function StatusPill(props: { label: string; tone?: string })"}),
  (fn10:Function {name: "OutboxList", type: "function", language: "typescript", signature: "function OutboxList(props: { items: VerificationOutboxItem[]; onRefresh: () => void; loading: boolean })"}),
  (fn11:Function {name: "formatTime", type: "function", language: "typescript", signature: "function formatTime(value: string): string"}),
  (c1:Class {name: "VerificationPurpose", type: "class", language: "typescript", signature: "type VerificationPurpose"}),
  (v1:Variable {name: "app", type: "variable"}),
  (v2:Variable {name: "challenge", type: "variable"}),
  (v3:Variable {name: "verified", type: "variable"}),
  (v4:Variable {name: "outbox", type: "variable"}),
  (v5:Variable {name: "purpose", type: "variable"}),
  (v6:Variable {name: "channel", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:CONTAINS]->(fn4),
  (fn1)-[:CONTAINS]->(fn5),
  (fn1)-[:CONTAINS]->(fn6),
  (fn1)-[:CONTAINS]->(fn7),
  (fn1)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:CONTAINS]->(fn10),
  (m)-[:CONTAINS]->(fn11),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn1)-[:CALLS]->(fn5),
  (fn1)-[:CALLS]->(fn6),
  (fn1)-[:CALLS]->(fn7),
  (fn1)-[:CALLS]->(fn8),
  (fn1)-[:CALLS]->(fn9),
  (fn1)-[:CALLS]->(fn10),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn2)-[:USES]->(v1),
  (fn3)-[:USES]->(v4),
  (fn4)-[:USES]->(v2),
  (fn4)-[:USES]->(v3),
  (fn4)-[:USES]->(v5),
  (fn5)-[:USES]->(v1),
  (fn5)-[:USES]->(v2),
  (fn5)-[:USES]->(v5),
  (fn5)-[:USES]->(v6),
  (fn6)-[:USES]->(v2),
  (fn6)-[:USES]->(v3),
  (fn7)-[:USES]->(v1),
  (fn7)-[:USES]->(v2),
  (fn7)-[:USES]->(v3),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v2),
  (fn8)-[:USES]->(v3),
  (fn10)-[:CALLS]->(fn11);
```
*/

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  ClipboardList,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  UserPlus,
} from 'lucide-react';

import { verificationApi } from '@/lib/verificationApi';
import { cn } from '@/lib/utils';
import type {
  StartVerificationResponse,
  VerificationAppInfo,
  VerificationOutboxItem,
  VerifyCodeResponse,
} from '@/types/verification';

type VerificationPurpose = 'registration' | 'password_change';
type VerificationChannel = 'sms' | 'email';

export default function VerificationAppPage() {
  const [app, setApp] = useState<VerificationAppInfo | null>(null);
  const [purpose, setPurpose] = useState<VerificationPurpose>('registration');
  const [channel, setChannel] = useState<VerificationChannel>('sms');
  const [phone, setPhone] = useState('+8613800000001');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<StartVerificationResponse | null>(null);
  const [verified, setVerified] = useState<VerifyCodeResponse | null>(null);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerDisplayName, setRegisterDisplayName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [passwordUsername, setPasswordUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [outbox, setOutbox] = useState<VerificationOutboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [outboxLoading, setOutboxLoading] = useState(false);

  useEffect(() => {
    loadApp();
    refreshOutbox();
  }, []);

  async function loadApp() {
    try {
      const response = await verificationApi.getApp();
      setApp(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load verification app');
    }
  }

  async function refreshOutbox() {
    setOutboxLoading(true);
    try {
      setOutbox(await verificationApi.outbox(12));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load outbox');
    } finally {
      setOutboxLoading(false);
    }
  }

  function resetChallenge(nextPurpose = purpose) {
    setPurpose(nextPurpose);
    setCode('');
    setChallenge(null);
    setVerified(null);
  }

  async function requestCode() {
    setLoading(true);
    setVerified(null);
    try {
      const targetEmail = email || registerEmail;
      const response = await verificationApi.startChallenge({
        app_key: app?.app_key ?? 'assetslake',
        purpose,
        channel,
        phone_number: channel === 'sms' ? phone : undefined,
        email: channel === 'email' ? targetEmail : undefined,
        client_ref: purpose === 'registration' ? registerUsername || undefined : passwordUsername || undefined,
      });
      setChallenge(response);
      setCode(response.dev_code ?? '');
      toast.success('Verification code queued');
      await refreshOutbox();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request code');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    if (!challenge) {
      toast.error('Request a code first');
      return;
    }
    setLoading(true);
    try {
      const response = await verificationApi.verifyCode(challenge.challenge_id, { code });
      setVerified(response);
      toast.success('Phone verified');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister() {
    if (!challenge || !verified) {
      toast.error('Complete SMS verification first');
      return;
    }
    setLoading(true);
    try {
      const response = await verificationApi.register({
        app_key: app?.app_key ?? 'assetslake',
        challenge_id: challenge.challenge_id,
        verification_token: verified.verification_token,
        username: registerUsername,
        password: registerPassword,
        display_name: registerDisplayName || undefined,
        email: registerEmail || (channel === 'email' ? email : undefined),
        phone_number: channel === 'sms' ? phone : undefined,
      });
      toast.success(`Registered ${response.user?.username ?? registerUsername}`);
      resetChallenge('registration');
      setRegisterPassword('');
      await refreshOutbox();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function submitPasswordChange() {
    if (!challenge || !verified) {
      toast.error('Complete SMS verification first');
      return;
    }
    setLoading(true);
    try {
      await verificationApi.changePassword({
        app_key: app?.app_key ?? 'assetslake',
        challenge_id: challenge.challenge_id,
        verification_token: verified.verification_token,
        username: passwordUsername,
        new_password: newPassword,
      });
      toast.success(`Password changed for ${passwordUsername}`);
      resetChallenge('password_change');
      setNewPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password change failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-matcha-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verification App
        </div>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">SMS Identity</h1>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
              <StatusPill label={app?.app_key ?? 'assetslake'} tone="text-brand-300" />
              <StatusPill label={app?.sender_email ?? 'hanakagumi@outlook.com'} tone="text-sakura-300" />
              <StatusPill label="local-outbox" tone="text-matcha-300" />
            </div>
          </div>
          <button type="button" className="btn-secondary" onClick={refreshOutbox} disabled={outboxLoading}>
            {outboxLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mx-auto grid w-full max-w-7xl gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg border border-surface-border bg-surface-secondary">
            <div className="grid border-b border-surface-border p-1 sm:grid-cols-2">
              {[
                { value: 'registration' as const, label: 'Register', icon: UserPlus },
                { value: 'password_change' as const, label: 'Password', icon: LockKeyhole },
              ].map((item) => {
                const Icon = item.icon;
                const active = purpose === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => resetChallenge(item.value)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-500/15 text-brand-100 shadow-[inset_0_0_0_1px_rgba(134,197,255,0.14)]'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-sakura-300' : 'text-slate-500')} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-2">
              <div className="space-y-4">
                <section className="rounded-lg border border-surface-border bg-surface-elevated p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                      {channel === 'sms' ? (
                        <Smartphone className="h-4 w-4 text-matcha-300" />
                      ) : (
                        <Mail className="h-4 w-4 text-sakura-300" />
                      )}
                      {channel === 'sms' ? 'SMS Challenge' : 'Email Challenge'}
                    </div>
                    <StatusPill label={challenge?.delivery_status ?? 'idle'} />
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="grid grid-cols-2 gap-1 rounded-lg border border-surface-border bg-surface p-1">
                      {[
                        { value: 'sms' as const, label: 'SMS', icon: Smartphone },
                        { value: 'email' as const, label: 'Email', icon: Mail },
                      ].map((item) => {
                        const Icon = item.icon;
                        const active = channel === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setChannel(item.value);
                              setCode('');
                              setChallenge(null);
                              setVerified(null);
                            }}
                            className={cn(
                              'flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                              active
                                ? 'bg-brand-500/15 text-brand-100'
                                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                            )}
                          >
                            <Icon className={cn('h-3.5 w-3.5', active ? 'text-sakura-300' : 'text-slate-500')} />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <label>
                      <span className="label">App Key</span>
                      <input className="input font-mono" value={app?.app_key ?? 'assetslake'} readOnly />
                    </label>
                    {channel === 'sms' ? (
                      <label>
                        <span className="label">Phone</span>
                        <input className="input" value={phone} onChange={(event) => setPhone(event.target.value)} />
                      </label>
                    ) : (
                      <label>
                        <span className="label">Email</span>
                        <input
                          className="input"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="name@example.com"
                        />
                      </label>
                    )}
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <label>
                        <span className="label">Code</span>
                        <input
                          className="input font-mono"
                          value={code}
                          onChange={(event) => setCode(event.target.value)}
                          placeholder="000000"
                        />
                      </label>
                      <button
                        type="button"
                        className="mt-6 flex h-10 w-10 items-center justify-center rounded-md border border-surface-border bg-surface text-slate-300 transition-colors hover:border-brand-500/40 hover:text-brand-200"
                        title="Use local code"
                        aria-label="Use local code"
                        onClick={() => challenge?.dev_code && setCode(challenge.dev_code)}
                        disabled={!challenge?.dev_code}
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {challenge && (
                    <div className="mt-4 rounded-md border border-surface-border bg-surface px-3 py-2 text-xs text-slate-400">
                      <div className="truncate font-mono text-brand-300">{challenge.challenge_id}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span>{challenge.masked_target}</span>
                        <span>{formatTime(challenge.expires_at)}</span>
                        {challenge.dev_code && <span className="font-mono text-matcha-300">{challenge.dev_code}</span>}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={requestCode} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send
                    </button>
                    <button type="button" className="btn-primary" onClick={verifyCode} disabled={loading || !challenge}>
                      <CheckCircle2 className="h-4 w-4" />
                      Verify
                    </button>
                  </div>
                </section>

                <section className="rounded-lg border border-surface-border bg-surface-elevated p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <Mail className="h-4 w-4 text-sakura-300" />
                    Service Mailbox
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-surface-border bg-surface px-3 py-2">
                      <span className="text-slate-500">Owner</span>
                      <span className="truncate text-slate-200">{app?.owner_email ?? 'hanakagumi@outlook.com'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-surface-border bg-surface px-3 py-2">
                      <span className="text-slate-500">From</span>
                      <span className="truncate text-slate-200">{app?.sender_email ?? 'hanakagumi@outlook.com'}</span>
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-lg border border-surface-border bg-surface-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    {purpose === 'registration' ? (
                      <UserPlus className="h-4 w-4 text-brand-300" />
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-brand-300" />
                    )}
                    {purpose === 'registration' ? 'Register Account' : 'Change Password'}
                  </div>
                  <StatusPill label={verified ? 'verified' : 'pending'} tone={verified ? 'text-matcha-300' : undefined} />
                </div>

                {purpose === 'registration' ? (
                  <div className="mt-4 grid gap-3">
                    <label>
                      <span className="label">Username</span>
                      <input
                        className="input"
                        value={registerUsername}
                        onChange={(event) => setRegisterUsername(event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="label">Display Name</span>
                      <input
                        className="input"
                        value={registerDisplayName}
                        onChange={(event) => setRegisterDisplayName(event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="label">Account Email</span>
                      <input
                        className="input"
                        value={registerEmail}
                        onChange={(event) => setRegisterEmail(event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="label">Password</span>
                      <input
                        className="input"
                        type="password"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.target.value)}
                      />
                    </label>
                    <button type="button" className="btn-primary mt-2 justify-center" onClick={submitRegister} disabled={loading || !verified}>
                      <UserPlus className="h-4 w-4" />
                      Create
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    <label>
                      <span className="label">Username</span>
                      <input
                        className="input"
                        value={passwordUsername}
                        onChange={(event) => setPasswordUsername(event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="label">New Password</span>
                      <input
                        className="input"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn-primary mt-2 justify-center"
                      onClick={submitPasswordChange}
                      disabled={loading || !verified}
                    >
                      <LockKeyhole className="h-4 w-4" />
                      Update
                    </button>
                  </div>
                )}

                {verified && (
                  <div className="mt-4 rounded-md border border-matcha-300/20 bg-matcha-400/10 px-3 py-2 text-xs text-matcha-200">
                    <div className="truncate font-mono">{verified.verification_token}</div>
                    <div className="mt-1">{verified.masked_target} / {formatTime(verified.expires_at)}</div>
                  </div>
                )}
              </section>
            </div>
          </section>

          <OutboxList items={outbox} onRefresh={refreshOutbox} loading={outboxLoading} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label, tone = 'text-slate-300' }: { label: string; tone?: string }) {
  return (
    <span className={cn('rounded-md border border-surface-border bg-surface px-2 py-0.5 text-xs', tone)}>
      {label}
    </span>
  );
}

function OutboxList({
  items,
  onRefresh,
  loading,
}: {
  items: VerificationOutboxItem[];
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface-secondary">
      <div className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <ClipboardList className="h-4 w-4 text-brand-300" />
          Outbox
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-border bg-surface text-slate-300 transition-colors hover:border-brand-500/40 hover:text-brand-200"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh outbox"
          aria-label="Refresh outbox"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </button>
      </div>
      <div className="max-h-[640px] overflow-y-auto p-3">
        <div className="space-y-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-surface-border bg-surface-elevated p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="h-3.5 w-3.5 shrink-0 text-matcha-300" />
                    <span className="truncate text-sm font-medium text-slate-100">{item.recipient_masked}</span>
                  </div>
                  <div className="mt-1 truncate font-mono text-xs text-brand-300">{item.challenge_id}</div>
                </div>
                <StatusPill label={item.status} tone="text-matcha-300" />
              </div>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">{item.body}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span>{item.app_key}</span>
                <span>{item.provider}</span>
                <span>{formatTime(item.created_at)}</span>
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <div className="rounded-lg border border-surface-border bg-surface-elevated p-6 text-center text-sm text-slate-500">
              No queued messages
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
