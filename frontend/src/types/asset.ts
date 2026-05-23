export type AssetStatus = 'pending' | 'active' | 'archived' | 'rejected' | 'processing';

export type AssetType =
  | '3d_model'
  | 'texture'
  | 'concept_art'
  | 'audio'
  | 'video'
  | 'code'
  | 'document'
  | 'animation'
  | 'vfx'
  | 'ui'
  | 'font'
  | 'shader'
  | 'scene'
  | 'prefab'
  | 'archive'
  | 'other';

export interface Asset {
  id: string;
  name: string;
  original_filename: string;
  description?: string;
  asset_type: AssetType;
  mime_type: string;
  tags: string[];
  bucket: string;
  object_key: string;
  file_url: string;
  preview_url?: string;
  file_size: number;
  checksum_sha256?: string;
  version: number;
  parent_id?: string;
  project_id: string;
  uploader_id?: string;
  uploader: string;
  status: AssetStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
  ai_tags: string[];
  embedding_id?: string;
  search_doc_id?: string;
  graph_node_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AssetSummary {
  id: string;
  name: string;
  original_filename: string;
  asset_type: AssetType;
  mime_type: string;
  tags: string[];
  file_url: string;
  preview_url?: string;
  file_size: number;
  version: number;
  project_id: string;
  uploader: string;
  status: AssetStatus;
  created_at: string;
  updated_at: string;
}

export interface AssetVersionSummary {
  id: string;
  asset_id: string;
  version: number;
  bucket: string;
  object_key: string;
  file_url: string;
  file_size: number;
  checksum_sha256?: string;
  uploader_id?: string;
  uploader: string;
  change_note?: string;
  created_at: string;
  branch_name: string;
  commit_sha: string;
}

export interface AssetVersionDiffItem {
  field: string;
  before: string;
  after: string;
  changed: boolean;
}

export interface AssetVersionDiff {
  asset_id: string;
  base: AssetVersionSummary;
  head: AssetVersionSummary;
  file_size_delta: number;
  checksum_changed: boolean;
  object_changed: boolean;
  changes: AssetVersionDiffItem[];
}

export interface AssetAiInsight {
  id: string;
  asset_id: string;
  modality: string;
  provider: string;
  model?: string;
  status: string;
  summary: string;
  labels: string[];
  detected_text?: string;
  quality_risks: string[];
  reuse_suggestions: string[];
  entities: Record<string, unknown>;
  raw_response: Record<string, unknown>;
  created_at: string;
}

export interface AnalyzeAssetResponse {
  asset: Asset;
  insight: AssetAiInsight;
  rag_stored: boolean;
}

export interface UploadResult {
  asset_id: string;
  bucket: string;
  object_key: string;
  file_url: string;
  preview_url?: string;
  name: string;
  original_filename: string;
  asset_type: AssetType;
  mime_type: string;
  file_size: number;
  tags: string[];
  version: number;
  status: AssetStatus;
  created_at: string;
}

export interface UpdateAssetRequest {
  name?: string;
  description?: string;
  tags?: string[];
  status?: AssetStatus;
  project_id?: string;
  review_note?: string;
}

export interface AssetFilters {
  q?: string;
  asset_type?: AssetType | '';
  status?: AssetStatus | '';
  project_id?: string;
  tag?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  success: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  '3d_model': '3D Model',
  texture: 'Texture',
  concept_art: 'Concept Art',
  audio: 'Audio',
  video: 'Video',
  code: 'Code',
  document: 'Document',
  animation: 'Animation',
  vfx: 'VFX',
  ui: 'UI',
  font: 'Font',
  shader: 'Shader',
  scene: 'Scene',
  prefab: 'Prefab',
  archive: 'Archive',
  other: 'Other',
};

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  archived: 'Archived',
  rejected: 'Rejected',
  processing: 'Processing',
};

export const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  '3D Models': ['.fbx', '.obj', '.blend', '.dae', '.glb', '.gltf', '.3ds'],
  Textures: ['.png', '.jpg', '.jpeg', '.tga', '.bmp', '.tiff', '.exr', '.hdr', '.psd', '.psb'],
  Audio: ['.wav', '.mp3', '.ogg', '.flac'],
  Video: ['.mp4', '.mov', '.avi', '.mkv'],
  Code: ['.rs', '.py', '.js', '.ts', '.tsx', '.go', '.java', '.sql', '.json', '.yaml', '.toml'],
  Documents: ['.pdf', '.doc', '.docx'],
  Archives: ['.zip', '.7z', '.tar', '.gz', '.rar'],
};
