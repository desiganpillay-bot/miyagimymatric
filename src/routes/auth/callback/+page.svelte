<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabase } from '$lib/supabase';

  let status = 'Signing you in…';

  onMount(async () => {
    const sb = getSupabase();

    // With implicit flow, detectSessionInUrl:true means the client auto-parses
    // the access_token from the URL hash. We just need to wait for the session.
    const { data: { session }, error } = await sb.auth.getSession();

    if (error) {
      status = 'Sign-in failed: ' + error.message;
      setTimeout(() => goto('/assessment'), 3000);
      return;
    }

    // Persist POPIA consent from localStorage (written during assessment save prompt)
    if (session) {
      const consentRaw = localStorage.getItem('mmm_consent_v1');
      if (consentRaw) {
        try {
          const consent = JSON.parse(consentRaw) as { consented_at: string; terms_version: string };
          await sb.from('profiles').upsert(
            { id: session.user.id, consented_at: consent.consented_at, terms_version: consent.terms_version },
            { onConflict: 'id' }
          );
          localStorage.removeItem('mmm_consent_v1');
        } catch { /* non-critical — don't block redirect */ }
      }
    }

    goto('/dashboard');
  });
</script>

<div class="wrap">
  <div class="spinner"></div>
  <p>{status}</p>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
    color: var(--muted);
    font-family: var(--font-body);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
