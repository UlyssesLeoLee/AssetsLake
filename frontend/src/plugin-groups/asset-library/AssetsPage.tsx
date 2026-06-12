/*
```cypher
CREATE
  (f:File {name: "AssetsPage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/asset-library/AssetsPage", type: "module"}),
  (fn1:Function {name: "AssetsPage", type: "function", language: "typescript", signature: "function AssetsPage()"}),
  (fn2:Function {name: "handleFilterChange", type: "function", language: "typescript", signature: "(next: Partial<AssetFilters>) => void"}),
  (fn3:Function {name: "handlePageChange", type: "function", language: "typescript", signature: "(page: number) => void"}),
  (v1:Variable {name: "view", type: "variable"}),
  (v2:Variable {name: "filters", type: "variable"}),
  (v3:Variable {name: "data", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v2),
  (fn3)-[:USES]->(v2);
```
*/

'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';

import { AssetFiltersPanel } from '@/components/assets/AssetFiltersPanel';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { AssetTable } from '@/components/assets/AssetTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { useAssets } from '@/hooks/useAssets';
import type { AssetFilters } from '@/types/asset';

type ViewMode = 'grid' | 'table';

export default function AssetsPage() {
  const [view, setView] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<AssetFilters>({ page: 1, page_size: 24 });

  const { data, isLoading, isError, error } = useAssets(filters);

  const handleFilterChange = useCallback((next: Partial<AssetFilters>) => {
    setFilters((prev) => ({ ...prev, ...next, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <div className="flex h-full flex-col gap-0">
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">Asset Library</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {data ? `${data.total.toLocaleString()} assets` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={view} onChange={setView} />
          <Link href="/upload" className="btn-primary">
            <Upload className="h-4 w-4" />
            Upload
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-surface-border p-4">
          <AssetFiltersPanel filters={filters} onChange={handleFilterChange} />
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-surface-border px-5 py-3">
            <SearchBar
              value={filters.q || ''}
              onChange={(q) => handleFilterChange({ q })}
              placeholder="Search by name, filename, tag..."
            />
          </div>

          <div className="flex-1 p-5">
            {isLoading && <LoadingGrid />}

            {isError && (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <p className="mb-2 font-medium text-red-400">Failed to load assets</p>
                  <p className="text-sm text-slate-500">{String(error)}</p>
                </div>
              </div>
            )}

            {!isLoading && !isError && data && data.data.length === 0 && (
              <EmptyState
                title="No assets found"
                description={
                  filters.q || filters.asset_type || filters.status || filters.tag
                    ? 'Try adjusting your filters or search query'
                    : 'Upload your first asset to get started'
                }
                action={
                  <Link href="/upload" className="btn-primary mt-4">
                    <Upload className="h-4 w-4" />
                    Upload Asset
                  </Link>
                }
              />
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <>
                {view === 'grid' ? (
                  <AssetGrid assets={data.data} />
                ) : (
                  <AssetTable assets={data.data} />
                )}

                <div className="mt-6">
                  <Pagination
                    page={data.page}
                    totalPages={data.total_pages}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
