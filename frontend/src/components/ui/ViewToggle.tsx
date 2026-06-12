'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  value: 'grid' | 'table';
  onChange: (v: 'grid' | 'table') => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-surface-elevated border border-surface-border rounded-lg p-0.5 gap-0.5">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-1.5 rounded-md transition-colors duration-100',
          value === 'grid'
            ? 'bg-brand-500/20 text-brand-300'
            : 'text-slate-500 hover:text-slate-300',
        )}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('table')}
        className={cn(
          'p-1.5 rounded-md transition-colors duration-100',
          value === 'table'
            ? 'bg-brand-500/20 text-brand-300'
            : 'text-slate-500 hover:text-slate-300',
        )}
        title="Table view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
