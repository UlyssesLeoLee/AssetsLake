import type { AssetSummary } from '@/types/asset';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: AssetSummary[];
}

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
