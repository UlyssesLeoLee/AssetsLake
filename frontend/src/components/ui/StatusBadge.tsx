import type { AssetStatus } from '@/types/asset';
import { ASSET_STATUS_LABELS } from '@/types/asset';
import { STATUS_COLORS, cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AssetStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        STATUS_COLORS[status],
        size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs',
      )}
    >
      {ASSET_STATUS_LABELS[status]}
    </span>
  );
}
