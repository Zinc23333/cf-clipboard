// src/types.ts
export interface Env {
  DB: D1Database;
  TOKEN?: string;
}

export interface ClipboardEntry {
  key: string;
  content: string;
  created_at: number;
  updated_at: number;
  expires_at?: number;
}

export interface APIResponse {
  message?: string;
  expires_at?: string;
  expires_in?: string;
  total?: number;
  items?: any[];
}