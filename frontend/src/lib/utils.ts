import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import type { AssetStatus, AssetType } from '@/types/asset';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy HH:mm');
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith('image/') && mime !== 'image/vnd.adobe.photoshop';
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith('video/');
}

export function isAudioMime(mime: string): boolean {
  return mime.startsWith('audio/');
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() ?? '';
}

export const STATUS_COLORS: Record<AssetStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  archived: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

export const TYPE_COLORS: Record<AssetType, string> = {
  '3d_model': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  texture: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  concept_art: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  audio: 'bg-green-500/20 text-green-300 border-green-500/30',
  video: 'bg-red-500/20 text-red-300 border-red-500/30',
  document: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  animation: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  vfx: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  ui: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  font: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  shader: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  scene: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  prefab: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  archive: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

export const TYPE_ICONS: Record<AssetType, string> = {
  '3d_model': '🧊',
  texture: '🖼️',
  concept_art: '🎨',
  audio: '🎵',
  video: '🎬',
  document: '📄',
  animation: '🎭',
  vfx: '✨',
  ui: '🖱️',
  font: '🔤',
  shader: '⚙️',
  scene: '🏔️',
  prefab: '🧩',
  archive: '📦',
  other: '📁',
};
