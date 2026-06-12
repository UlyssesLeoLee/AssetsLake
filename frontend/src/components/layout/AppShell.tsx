/*
```cypher
CREATE
  (f:File {name: "AppShell.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/components/layout/AppShell", type: "module"}),
  (fn1:Function {name: "AppShell", type: "function", language: "typescript", signature: "function AppShell(props: { children: React.ReactNode })"}),
  (v1:Variable {name: "NAV_ITEMS", type: "variable"}),
  (v2:Variable {name: "PLUGIN_APP", type: "variable"}),
  (v3:Variable {name: "pathname", type: "variable"}),
  (v4:Variable {name: "settingsActive", type: "variable"}),
  (v5:Variable {name: "OBSERVABILITY_NAV_ITEM", type: "variable"}),
  (v6:Variable {name: "PRIMARY_NAV_ITEMS", type: "variable"}),
  (v7:Variable {name: "observabilityActive", type: "variable"}),
  (v8:Variable {name: "SETTINGS_NAV_ITEM", type: "variable"}),
  (v9:Variable {name: "session", type: "variable"}),
  (v10:Variable {name: "handleLogout", type: "variable"}),
  (v11:Variable {name: "visiblePrimaryNavItems", type: "variable"}),
  (v12:Variable {name: "visibleObservabilityNavItem", type: "variable"}),
  (v13:Variable {name: "visibleSettingsNavItem", type: "variable"}),
  (v14:Variable {name: "VisibleObservabilityIcon", type: "variable"}),
  (v15:Variable {name: "VisibleSettingsIcon", type: "variable"}),
  (v16:Variable {name: "currentRoute", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
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
  (fn1)-[:USES]->(v11),
  (fn1)-[:USES]->(v12),
  (fn1)-[:USES]->(v13),
  (fn1)-[:USES]->(v14),
  (fn1)-[:USES]->(v15),
  (fn1)-[:USES]->(v16);
```
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppCommandBar } from '@/components/layout/AppCommandBar';
import { authApi } from '@/lib/authApi';
import {
  AUTH_SESSION_EVENT,
  type AuthSession,
  clearStoredAuthSession,
  getStoredAuthSession,
} from '@/lib/authSession';
import { filterPluginRoutesForRole, roleCanAccessRouteId } from '@/lib/rolePermissions';
import { cn } from '@/lib/utils';
import {
  getDefaultPluginApp,
  getNavPluginRoutes,
  getPluginRoutes,
  resolvePluginRoute,
} from '@/plugin-groups/registry';

const NAV_ITEMS = getNavPluginRoutes();
const OBSERVABILITY_NAV_ITEM = getPluginRoutes().find((route) => route.href === '/observability');
const SETTINGS_NAV_ITEM = getPluginRoutes().find((route) => route.href === '/settings');
const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((route) => route.href !== OBSERVABILITY_NAV_ITEM?.href);
const PLUGIN_APP = getDefaultPluginApp();

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const settingsActive = pathname === '/settings';
  const observabilityActive = OBSERVABILITY_NAV_ITEM
    ? pathname === OBSERVABILITY_NAV_ITEM.href ||
      pathname.startsWith(`${OBSERVABILITY_NAV_ITEM.href}/`)
    : false;
  const role = session?.user.role;
  const visiblePrimaryNavItems = filterPluginRoutesForRole(PRIMARY_NAV_ITEMS, role);
  const visibleObservabilityNavItem =
    OBSERVABILITY_NAV_ITEM && roleCanAccessRouteId(role, OBSERVABILITY_NAV_ITEM.id)
      ? OBSERVABILITY_NAV_ITEM
      : undefined;
  const visibleSettingsNavItem =
    SETTINGS_NAV_ITEM && roleCanAccessRouteId(role, SETTINGS_NAV_ITEM.id)
      ? SETTINGS_NAV_ITEM
      : undefined;
  const VisibleObservabilityIcon = visibleObservabilityNavItem?.icon;
  const VisibleSettingsIcon = visibleSettingsNavItem?.icon;
  const currentRoute = resolvePluginRoute(pathname);
  const currentAppId = currentRoute?.pluginAppId ?? PLUGIN_APP.id;
  const currentAppLabel = currentRoute?.pluginAppLabel ?? PLUGIN_APP.label;
  const currentRouteId = currentRoute?.id ?? 'unknown-route';
  const currentRouteLabel = currentRoute?.label ?? currentAppLabel;
  const displayName = session?.user.display_name ?? session?.user.username;
  const userInitial = displayName?.slice(0, 1).toUpperCase() ?? 'A';

  useEffect(() => {
    const refreshSession = () => setSession(getStoredAuthSession());
    refreshSession();
    window.addEventListener(AUTH_SESSION_EVENT, refreshSession);
    window.addEventListener('storage', refreshSession);
    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, refreshSession);
      window.removeEventListener('storage', refreshSession);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Local session cleanup is still the source of truth for this browser.
    } finally {
      clearStoredAuthSession();
    }
  };

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden">
      {/* Top nav */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-5 border-b border-surface-border bg-[#0b0f14]/92 px-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
        {/* Logo */}
        <Link href="/" className="mr-1 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-300/25 bg-[linear-gradient(135deg,#1f7ad8,#df754a)] shadow-[0_8px_24px_rgba(31,122,216,0.22)]">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-white">AssetsLake</span>
            <span className="hidden text-[10px] font-medium text-washi-200/70 sm:block">
              {PLUGIN_APP.label}
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.025] p-1">
          {visiblePrimaryNavItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-brand-500/15 text-brand-100 shadow-[inset_0_0_0_1px_rgba(134,197,255,0.14)] after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-sakura-300'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100',
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-sakura-300' : 'text-slate-500')} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side — future: user menu */}
        <div className="ml-auto flex items-center gap-3">
          {visibleObservabilityNavItem && VisibleObservabilityIcon ? (
            <Link
              href={visibleObservabilityNavItem.href}
              title={visibleObservabilityNavItem.description ?? 'Observability'}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors',
                observabilityActive
                  ? 'border-brand-300/35 bg-brand-500/15 text-brand-100'
                  : 'border-surface-border bg-surface-elevated/80 text-slate-300 hover:border-brand-500/35 hover:text-slate-100',
              )}
            >
              <VisibleObservabilityIcon
                className={cn(
                  'h-4 w-4',
                  observabilityActive ? 'text-sakura-300' : 'text-slate-500',
                )}
              />
              <span className="hidden lg:inline">Observability</span>
            </Link>
          ) : null}
          <div className="hidden max-w-44 truncate rounded-md border border-surface-border bg-surface-elevated/70 px-2.5 py-1 text-xs font-medium text-slate-400 sm:block">
            {displayName ?? PLUGIN_APP.label}
          </div>
          {visibleSettingsNavItem && VisibleSettingsIcon ? (
            <Link
              href={visibleSettingsNavItem.href}
              aria-label={visibleSettingsNavItem.label}
              title={visibleSettingsNavItem.description ?? visibleSettingsNavItem.label}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                settingsActive
                  ? 'border-sakura-300/35 bg-sakura-300/10 text-sakura-300'
                  : 'border-surface-border bg-surface-elevated/80 text-slate-400 hover:border-brand-500/35 hover:text-slate-100',
              )}
            >
              <VisibleSettingsIcon className="h-4 w-4" />
            </Link>
          ) : null}
          {session ? (
            <button
              type="button"
              aria-label="Sign out"
              title="Sign out"
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-border bg-surface-elevated/80 text-slate-400 transition-colors hover:border-sakura-300/35 hover:text-sakura-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : null}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-matcha-300/25 bg-matcha-400/10">
            <span className="text-xs font-semibold text-matcha-300">{userInitial}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      <AppCommandBar
        session={session}
        pathname={pathname}
        appId={currentAppId}
        appLabel={currentAppLabel}
        routeId={currentRouteId}
        routeLabel={currentRouteLabel}
      />
    </div>
  );
}
