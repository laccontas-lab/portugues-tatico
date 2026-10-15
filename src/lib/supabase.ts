// ==============================================================================
// Supabase Client for Português Tático (Frontend / Browser)
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.ts';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('PORTUGUES_TATICO_SUPABASE_URL') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('PORTUGUES_TATICO_SUPABASE_ANON_KEY') || '' : '';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || storedUrl || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  storedKey ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Returns a configured Supabase client or throws if unconfigured
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase não está configurado no frontend. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    localStorage.setItem('PORTUGUES_TATICO_SUPABASE_URL', cleanUrl);
    localStorage.setItem('PORTUGUES_TATICO_SUPABASE_ANON_KEY', key.trim());
    window.location.reload();
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('PORTUGUES_TATICO_SUPABASE_URL');
    localStorage.removeItem('PORTUGUES_TATICO_SUPABASE_ANON_KEY');
    window.location.reload();
  }
}
