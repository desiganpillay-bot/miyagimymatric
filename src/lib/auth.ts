// Auth helpers — magic link + Google OAuth via Supabase
import { getSupabase } from './supabase';

export async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error: error?.message ?? null };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error: error?.message ?? null };
}

export async function getSession() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

export async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
}
