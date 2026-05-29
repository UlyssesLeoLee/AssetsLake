import axios, { AxiosHeaders, AxiosProgressEvent } from 'axios';
import type {
  ApiResponse,
  Asset,
  AnalyzeAssetResponse,
  AssetAiInsight,
  AssetFilters,
  AssetSummary,
  AssetVersionDiff,
  AssetVersionSummary,
  PaginatedResponse,
  UpdateAssetRequest,
  UploadResult,
} from '@/types/asset';
import { getAiRequestHeaders } from '@/lib/aiSettings';
import { clearStoredAuthSession, getStoredAuthToken } from '@/lib/authSession';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const AI_HEADER_ENDPOINTS = [
  '/api/management/chat',
  '/api/management/rag/search',
  '/api/management/replica-actions',
  '/api/data-lake/query/sql',
  '/api/data-lake/query/cypher',
  '/api/project-management/automation',
];

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const url = typeof config.url === 'string' ? config.url : '';
  const headers = AxiosHeaders.from(config.headers);
  const token = getStoredAuthToken();
  const shouldAttachAuthHeader = token && !url.includes('/api/auth/login');
  const shouldAttachAiHeaders = AI_HEADER_ENDPOINTS.some((endpoint) => url.includes(endpoint));

  if (shouldAttachAuthHeader && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (shouldAttachAiHeaders) {
    Object.entries(getAiRequestHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuthSession();
    }
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

  versions: async (id: string): Promise<AssetVersionSummary[]> => {
    const { data } = await apiClient.get<ApiResponse<AssetVersionSummary[]>>(
      `/api/assets/${id}/versions`
    );
    return data.data;
  },

  compareVersions: async (
    id: string,
    base: number,
    head: number
  ): Promise<AssetVersionDiff> => {
    const params = new URLSearchParams({ base: String(base), head: String(head) });
    const { data } = await apiClient.get<ApiResponse<AssetVersionDiff>>(
      `/api/assets/${id}/versions/compare?${params.toString()}`
    );
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

  insights: async (id: string): Promise<AssetAiInsight[]> => {
    const { data } = await apiClient.get<ApiResponse<AssetAiInsight[]>>(
      `/api/assets/${id}/insights`
    );
    return data.data;
  },

  analyze: async (id: string): Promise<AnalyzeAssetResponse> => {
    const { data } = await apiClient.post<ApiResponse<AnalyzeAssetResponse>>(
      `/api/assets/${id}/analyze`
    );
    return data.data;
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
