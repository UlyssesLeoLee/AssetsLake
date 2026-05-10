'use client';

import { useState, useCallback } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { AssetTable } from '@/components/assets/AssetTable';
import { AssetFiltersPanel } from '@/components/assets/AssetFiltersPanel';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import type { AssetFilters } from '@/types/asset';
import { Upload } from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex flex-col gap-0 h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
        <div>
          <h1 className="text-xl font-bold text-white">Asset Library</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {data ? `${data.total.toLocaleString()} assets` : 'Loading…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={view} onChange={setView} />
          <Link href="/upload" className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0 border-r border-surface-border overflow-y-auto p-4">
          <AssetFiltersPanel filters={filters} onChange={handleFilterChange} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Search + toolbar */}
          <div className="px-5 py-3 border-b border-surface-border flex items-center gap-3">
            <SearchBar
              value={filters.q || ''}
              onChange={(q) => handleFilterChange({ q })}
              placeholder="Search by name, filename, tag…"
            />
          </div>

          <div className="flex-1 p-5">
            {isLoading && <LoadingGrid />}

            {isError && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-400 font-medium mb-2">Failed to load assets</p>
                  <p className="text-slate-500 text-sm">{String(error)}</p>
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
                    <Upload className="w-4 h-4" />
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
