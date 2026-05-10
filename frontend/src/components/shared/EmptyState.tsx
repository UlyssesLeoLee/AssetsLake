import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center">
        <PackageOpen className="w-7 h-7 text-slate-500" />
      </div>
      <div>
        <h3 className="text-slate-200 font-semibold">{title}</h3>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
