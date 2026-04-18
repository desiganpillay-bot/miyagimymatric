import { getSupabase } from './supabase';

// Always use canonical www domain in prod to match Vercel's redirect behaviour.
// Vercel redirects miyagimymatric.com → www.miyagimymatric.com, so the callback
// must also land on www — otherwise the PKCE code verifier is on the wrong origin.
function getCallbackUrl(): string {
  if (typeof window === 'undefined') return 'https://www.miyagimymatric.com/auth/callback';
  const host = window.location.hostname;
  if (host === 'miyagimymatric.com' || host === 'www.miyagimymatric.com') {
    return 'https://www.miyagimymatric.com/auth/callback';
  }
  return `${window.location.origin}/auth/callback`; // localhost / preview
}

export async function signInWithMagicLink(email: string) {
  const supabase = getSupabase();
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getCallbackUrl(),
      shouldCreateUser: true
    }
  });
}

export async function signInWithGoogle() {
  const supabase = getSupabase();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getCallbackUrl(),
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  });
}

export async function signOut() {
  const supabase = getSupabase();
  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
