'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api';
import type { AssetFilters, UpdateAssetRequest } from '@/types/asset';

export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: () => assetsApi.list(filters),
    staleTime: 30_000,
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetsApi.get(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSearchAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: ['assets-search', filters],
    queryFn: () => assetsApi.search(filters),
    enabled: !!(filters.q && filters.q.length >= 1),
    staleTime: 15_000,
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateAssetRequest }) =>
      assetsApi.update(id, req),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.setQueryData(['asset', asset.id], asset);
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
