// Real Supabase client — uses SvelteKit $env/static/public (required for browser access)
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl  = PUBLIC_SUPABASE_URL;
const supabaseKey  = PUBLIC_SUPABASE_ANON_KEY;

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase env vars not set — auth unavailable');
    return null as unknown as ReturnType<typeof createClient>;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}
