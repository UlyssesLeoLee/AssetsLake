import type { AssetType } from '@/types/asset';
import { ASSET_TYPE_LABELS } from '@/types/asset';
import { TYPE_COLORS, cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: AssetType;
  size?: 'xs' | 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        TYPE_COLORS[type],
        size === 'xs' ? 'text-[10px] px-1.5 py-0' : 'text-xs',
      )}
    >
      {ASSET_TYPE_LABELS[type]}
    </span>
  );
}
