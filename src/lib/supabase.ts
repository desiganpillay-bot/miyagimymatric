import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    _client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
      }
    });
  }
  return _client;
}
