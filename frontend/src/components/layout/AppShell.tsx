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
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4);
```
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultPluginApp, getNavPluginRoutes } from '@/plugin-groups/registry';

const NAV_ITEMS = getNavPluginRoutes();
const PLUGIN_APP = getDefaultPluginApp();

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const settingsActive = pathname === '/settings';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-5 border-b border-surface-border bg-[#0b0f14]/92 px-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
        {/* Logo */}
        <Link href="/" className="mr-1 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-300/25 bg-[linear-gradient(135deg,#1f7ad8,#df754a)] shadow-[0_8px_24px_rgba(31,122,216,0.22)]">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-white">AssetsLake</span>
            <span className="hidden text-[10px] font-medium text-washi-200/70 sm:block">{PLUGIN_APP.label}</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.025] p-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-brand-500/15 text-brand-100 shadow-[inset_0_0_0_1px_rgba(134,197,255,0.14)] after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-sakura-300'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
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
          <div className="hidden rounded-md border border-surface-border bg-surface-elevated/70 px-2.5 py-1 text-xs font-medium text-slate-400 sm:block">
            Studio Console
          </div>
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
              settingsActive
                ? 'border-sakura-300/35 bg-sakura-300/10 text-sakura-300'
                : 'border-surface-border bg-surface-elevated/80 text-slate-400 hover:border-brand-500/35 hover:text-slate-100'
            )}
          >
            <Settings className="h-4 w-4" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-matcha-300/25 bg-matcha-400/10">
            <span className="text-xs font-semibold text-matcha-300">A</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
