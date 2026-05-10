export type AssetStatus = 'pending' | 'active' | 'archived' | 'rejected' | 'processing';

export type AssetType =
  | '3d_model'
  | 'texture'
  | 'concept_art'
  | 'audio'
  | 'video'
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
  Documents: ['.pdf', '.doc', '.docx'],
  Archives: ['.zip', '.7z', '.tar', '.gz', '.rar'],
};
