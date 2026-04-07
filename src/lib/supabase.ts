import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseClient() {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      detectSessionInUrl: true,
      persistSession: true
    }
  });
}

// Singleton for use in browser context
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    _client = createSupabaseClient();
  }
  return _client;
}
