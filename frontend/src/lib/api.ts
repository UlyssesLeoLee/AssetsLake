import axios, { AxiosProgressEvent } from 'axios';
import type {
  ApiResponse,
  Asset,
  AssetFilters,
  AssetSummary,
  PaginatedResponse,
  UpdateAssetRequest,
  UploadResult,
} from '@/types/asset';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unknown error';
    return Promise.reject(new Error(message));
  }
);

// ─── Assets ──────────────────────────────────────────────────────────────────

export const assetsApi = {
  list: async (filters: AssetFilters = {}): Promise<PaginatedResponse<AssetSummary>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    const { data } = await apiClient.get<PaginatedResponse<AssetSummary>>(
      `/api/assets?${params.toString()}`
    );
    return data;
  },

  search: async (filters: AssetFilters = {}): Promise<PaginatedResponse<AssetSummary>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    const { data } = await apiClient.get<PaginatedResponse<AssetSummary>>(
      `/api/assets/search?${params.toString()}`
    );
    return data;
  },

  get: async (id: string): Promise<Asset> => {
    const { data } = await apiClient.get<ApiResponse<Asset>>(`/api/assets/${id}`);
    return data.data;
  },

  upload: async (
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> => {
    const { data } = await apiClient.post<ApiResponse<UploadResult>>(
      '/api/assets/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300_000,
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      }
    );
    return data.data;
  },

  update: async (id: string, req: UpdateAssetRequest): Promise<Asset> => {
    const { data } = await apiClient.patch<ApiResponse<Asset>>(`/api/assets/${id}`, req);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/assets/${id}`);
  },
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: async (): Promise<{ status: string; service: string; version: string }> => {
    const { data } = await apiClient.get('/api/health');
    return data;
  },
};

// ─── Future extension points ──────────────────────────────────────────────────

/** Placeholder: Qdrant image similarity search */
export const similaritySearchApi = {
  searchByImage: async (_imageUrl: string): Promise<AssetSummary[]> => {
    // TODO: POST /api/assets/similar with image embedding
    return [];
  },
};

/** Placeholder: OpenSearch tag/full-text search */
export const fullTextSearchApi = {
  search: async (_query: string): Promise<AssetSummary[]> => {
    // TODO: GET /api/search/opensearch?q=...
    return [];
  },
};

/** Placeholder: Neo4j asset dependency graph */
export const graphApi = {
  getDependencies: async (_assetId: string): Promise<string[]> => {
    // TODO: GET /api/graph/{id}/dependencies
    return [];
  },
  getDependents: async (_assetId: string): Promise<string[]> => {
    // TODO: GET /api/graph/{id}/dependents
    return [];
  },
};
