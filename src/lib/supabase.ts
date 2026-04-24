// Real Supabase client using env vars (never reads from JSON file)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.PUBLIC_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase env vars not set — auth unavailable');
    return null as unknown as ReturnType<typeof createClient>;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}
