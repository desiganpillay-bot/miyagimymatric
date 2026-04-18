import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Use cross-subdomain cookies so the PKCE code verifier is readable on both
// miyagimymatric.com and www.miyagimymatric.com after Vercel's redirect.
function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.includes('miyagimymatric.com')
    ? '.miyagimymatric.com'
    : '';
}

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!_client) {
    _client = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookieOptions: {
        domain: getCookieDomain(),
        path: '/',
        sameSite: 'lax',
        maxAge: 34560000
      }
    });
  }
  return _client;
}
