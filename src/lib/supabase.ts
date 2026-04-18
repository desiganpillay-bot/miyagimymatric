import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Cross-subdomain storage: mirrors auth data to a .miyagimymatric.com cookie
// so the PKCE code verifier survives when Vercel serves auth/callback on a
// different subdomain (miyagimymatric.com vs www.miyagimymatric.com).
function makeCrossSubdomainStorage() {
  const domainAttr = () => {
    if (typeof window === 'undefined') return '';
    return window.location.hostname.includes('miyagimymatric.com')
      ? '; domain=.miyagimymatric.com'
      : '';
  };

  // Safe cookie name: replace non-alphanumeric chars, cap at 80 chars
  const cn = (key: string) =>
    'mmm_' + key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 76);

  return {
    getItem(key: string): string | null {
      if (typeof window === 'undefined') return null;
      // Primary: localStorage
      try {
        const v = localStorage.getItem(key);
        if (v !== null) return v;
      } catch {}
      // Fallback: cross-subdomain cookie (different origin after Vercel redirect)
      const name = cn(key);
      const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      if (m) { try { return decodeURIComponent(m[1]); } catch {} }
      return null;
    },
    setItem(key: string, value: string): void {
      if (typeof window === 'undefined') return;
      try { localStorage.setItem(key, value); } catch {}
      document.cookie =
        `${cn(key)}=${encodeURIComponent(value)}; max-age=3600; path=/${domainAttr()}; SameSite=Lax`;
    },
    removeItem(key: string): void {
      if (typeof window === 'undefined') return;
      try { localStorage.removeItem(key); } catch {}
      document.cookie = `${cn(key)}=; max-age=0; path=/${domainAttr()}`;
    }
  };
}

export function createSupabaseClient() {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce',
      storage: makeCrossSubdomainStorage(),
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
