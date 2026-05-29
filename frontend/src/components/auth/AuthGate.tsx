/*
```cypher
CREATE
  (f:File {name: "AuthGate.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/auth/AuthGate", type: "module"}),
  (c1:Class {name: "AuthGateProps", type: "class", language: "typescript", signature: "type AuthGateProps"}),
  (fn1:Function {name: "AuthGate", type: "function", language: "typescript", signature: "function AuthGate(props: AuthGateProps)"}),
  (fn2:Function {name: "buildDeviceLabel", type: "function", language: "typescript", signature: "function buildDeviceLabel(): string"}),
  (v1:Variable {name: "authApi", type: "variable"}),
  (v2:Variable {name: "session", type: "variable"}),
  (v3:Variable {name: "accounts", type: "variable"}),
  (v4:Variable {name: "loginForm", type: "variable"}),
  (v5:Variable {name: "protectedRoute", type: "variable"}),
  (v6:Variable {name: "routeAllowed", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:USES]->(v5),
  (fn1)-[:USES]->(v6),
  (fn1)-[:CALLS]->(fn2);
```
*/

'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import { authApi, type TestAccount } from '@/lib/authApi';
import { roleCanAccessRouteId } from '@/lib/rolePermissions';
import {
  AUTH_SESSION_EVENT,
  type AuthSession,
  getStoredAuthSession,
  isAuthRequiredPath,
  storeAuthSession,
} from '@/lib/authSession';
import { cn } from '@/lib/utils';

type AuthGateProps = {
  pathname: string;
  routeId?: string;
  children: ReactNode;
};

type LoginFormState = {
  username: string;
  password: string;
};

function buildDeviceLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'web';
  }
  const platform = navigator.platform || 'browser';
  return `web:${platform}`.slice(0, 80);
}

export function AuthGate({ pathname, routeId, children }: AuthGateProps) {
  const protectedRoute = useMemo(() => isAuthRequiredPath(pathname), [pathname]);
  const [checking, setChecking] = useState(protectedRoute);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [accounts, setAccounts] = useState<TestAccount[]>([]);
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    username: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!protectedRoute) {
      setChecking(false);
      return;
    }

    const refreshSession = () => {
      const storedSession = getStoredAuthSession();
      setSession(storedSession);
      setChecking(false);
    };

    refreshSession();
    window.addEventListener(AUTH_SESSION_EVENT, refreshSession);
    window.addEventListener('storage', refreshSession);

    const storedSession = getStoredAuthSession();
    if (storedSession) {
      void authApi
        .me()
        .then((current) => {
          const refreshedSession = {
            ...storedSession,
            user: current.user,
            session_id: current.session_id,
            expires_at: current.expires_at,
          };
          storeAuthSession(refreshedSession);
          setSession(refreshedSession);
        })
        .catch(() => undefined);
    }

    void authApi
      .testAccounts()
      .then((nextAccounts) => {
        setAccounts(nextAccounts);
        if (nextAccounts.length > 0) {
          setLoginForm((current) => ({
            ...current,
            username: current.username || nextAccounts[0].username,
          }));
        }
      })
      .catch(() => undefined);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, refreshSession);
      window.removeEventListener('storage', refreshSession);
    };
  }, [protectedRoute]);

  if (!protectedRoute) {
    return children;
  }

  if (checking) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-400/30 border-t-brand-300" />
      </section>
    );
  }

  if (session) {
    const routeAllowed = roleCanAccessRouteId(session.user.role, routeId);
    if (!routeAllowed) {
      return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-surface-secondary px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-sakura-300/25 bg-sakura-400/10">
              <LockKeyhole className="h-5 w-5 text-sakura-200" />
            </div>
            <h1 className="text-lg font-semibold text-slate-100">Access denied</h1>
            <p className="mt-1 text-sm text-slate-400">
              {session.user.display_name ?? session.user.username} cannot open this app.
            </p>
          </div>
        </section>
      );
    }
    return children;
  }

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const nextSession = await authApi.login({
        username: loginForm.username.trim(),
        password: loginForm.password,
        device_label: buildDeviceLabel(),
      });
      storeAuthSession(nextSession);
      setSession(nextSession);
      setLoginForm((current) => ({ ...current, password: '' }));
      toast.success('Signed in');
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Sign in failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-surface-border bg-surface-secondary shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="border-b border-surface-border px-6 py-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-brand-300/25 bg-brand-500/15">
            <ShieldCheck className="h-5 w-5 text-brand-200" />
          </div>
          <h1 className="text-lg font-semibold text-slate-100">Sign in to AssetsLake</h1>
          <p className="mt-1 text-sm text-slate-400">Secure workspace access</p>
        </div>

        <form className="space-y-4 px-6 py-5" onSubmit={submitLogin}>
          {accounts.length > 0 ? (
            <label className="block">
              <span className="label">Account</span>
              <select
                className="input"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, username: event.target.value }))
                }
              >
                {accounts.map((account) => (
                  <option key={account.username} value={account.username}>
                    {(account.display_name ?? account.username) + ` · ${account.role}`}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="label">Username</span>
              <input
                className="input"
                autoComplete="username"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, username: event.target.value }))
                }
              />
            </label>
          )}

          <label className="block">
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !loginForm.username.trim() || !loginForm.password}
            className={cn('btn-primary w-full justify-center', submitting ? 'opacity-70' : '')}
          >
            <LogIn className="h-4 w-4" />
            {submitting ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}
