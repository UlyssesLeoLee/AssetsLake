'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Upload,
  Database,
  Settings,
  Boxes,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Boxes },
  { href: '/assets', label: 'Library', icon: LayoutGrid },
  { href: '/upload', label: 'Upload', icon: Upload },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top nav */}
      <header className="h-14 border-b border-surface-border bg-surface-secondary flex items-center px-5 gap-6 shrink-0 z-30 sticky top-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">AssetsLake</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side — future: user menu */}
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            MinIO + PostgreSQL
          </div>
          <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <span className="text-xs text-brand-300 font-semibold">A</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
