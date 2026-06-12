/*
```cypher
CREATE
  (f:File {name: "authSession.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/lib/authSession", type: "module"}),
  (c1:Class {name: "AuthUser", type: "class", language: "typescript", signature: "interface AuthUser"}),
  (c2:Class {name: "AuthSession", type: "class", language: "typescript", signature: "interface AuthSession"}),
  (fn1:Function {name: "getStoredAuthSession", type: "function", language: "typescript", signature: "function getStoredAuthSession(): AuthSession | null"}),
  (fn2:Function {name: "getStoredAuthToken", type: "function", language: "typescript", signature: "function getStoredAuthToken(): string | null"}),
  (fn3:Function {name: "storeAuthSession", type: "function", language: "typescript", signature: "function storeAuthSession(session: AuthSession): void"}),
  (fn4:Function {name: "clearStoredAuthSession", type: "function", language: "typescript", signature: "function clearStoredAuthSession(): void"}),
  (fn5:Function {name: "isAuthRequiredPath", type: "function", language: "typescript", signature: "function isAuthRequiredPath(pathname: string): boolean"}),
  (v1:Variable {name: "AUTH_SESSION_STORAGE_KEY", type: "variable"}),
  (v2:Variable {name: "AUTH_SESSION_EVENT", type: "variable"}),
  (v3:Variable {name: "PUBLIC_AUTH_PATH_PREFIXES", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (fn2)-[:CALLS]->(fn1),
  (fn3)-[:USES]->(v1),
  (fn4)-[:USES]->(v1),
  (fn5)-[:USES]->(v3);
```
*/

export interface AuthUser {
  id: string;
  username: string;
  display_name?: string | null;
  email?: string | null;
  role: string;
  avatar_url?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  session_id: string;
  expires_at: string;
}

export const AUTH_SESSION_STORAGE_KEY = 'assetslake.auth.session';
export const AUTH_SESSION_EVENT = 'assetslake-auth-session-changed';

const PUBLIC_AUTH_PATH_PREFIXES = ['/verification', '/app/identity'];

function hasBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emitSessionChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

function isExpired(session: AuthSession): boolean {
  const expiresAt = Date.parse(session.expires_at);
  return Number.isNaN(expiresAt) || expiresAt <= Date.now();
}

export function getStoredAuthSession(): AuthSession | null {
  if (!hasBrowserStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session.token || !session.user?.username || isExpired(session)) {
      clearStoredAuthSession();
      return null;
    }
    return session;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function getStoredAuthToken(): string | null {
  return getStoredAuthSession()?.token ?? null;
}

export function storeAuthSession(session: AuthSession): void {
  if (!hasBrowserStorage()) {
    return;
  }
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  emitSessionChanged();
}

export function clearStoredAuthSession(): void {
  if (!hasBrowserStorage()) {
    return;
  }
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  emitSessionChanged();
}

export function isAuthRequiredPath(pathname: string): boolean {
  const normalizedPath = pathname.trim() || '/';
  return !PUBLIC_AUTH_PATH_PREFIXES.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  );
}
