// Auth helpers — magic link + Google OAuth via Supabase
import { getSupabase } from './supabase';

export async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
  try {
    const sb = getSupabase();
    if (!sb) return { error: 'Auth service unavailable' };
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e?.message ?? 'Unknown error' };
  }
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  try {
    const sb = getSupabase();
    if (!sb) return { error: 'Auth service unavailable' };
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e?.message ?? 'Unknown error' };
  }
}

export async function getSession() {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: { session } } = await sb.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

export async function signOut() {
  try {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
  } catch {}
}
