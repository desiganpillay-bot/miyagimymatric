<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabase } from '$lib/supabase';

  let status = 'Signing you in...';
  let error = '';

  onMount(() => {
    const sb = getSupabase();
    let resolved = false;

    // Implicit flow: Supabase detects access_token in URL hash and fires SIGNED_IN
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (resolved) return;
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        resolved = true;
        subscription.unsubscribe();

        const user = session.user;

        // Persist POPIA consent
        try {
          const consentRaw = localStorage.getItem('mmm_popia_consent');
          const consentAt  = consentRaw ? JSON.parse(consentRaw).consented_at : null;
          if (consentAt) {
            await sb.from('profiles').upsert({
              id:           user.id,
              consented_at: consentAt,
              terms_version: '1.0',
            }, { onConflict: 'id' });
          }
        } catch {}

        // Migrate localStorage assessment (non-blocking)
        try {
          const raw = localStorage.getItem('mmm_assessment_v1');
          if (raw) {
            await sb.from('assessment_snapshots').upsert({
              user_id: user.id,
              snapshot: JSON.parse(raw),
              created_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
          }
        } catch {}

        status = 'Signed in! Loading your plan...';
        const hasAssessment = !!localStorage.getItem('mmm_assessment_v1');
        setTimeout(() => goto(hasAssessment ? '/dashboard' : '/assessment'), 800);
      }
    });

    // Timeout fallback — if no auth event after 10s, show error
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        subscription.unsubscribe();
        error = 'Sign-in timed out. Please try again.';
        status = '';
      }
    }, 10000);
  });
</script>

<svelte:head>
  <title>Signing in — Miyagi My Matric</title>
</svelte:head>

<div class="callback-page">
  <div class="callback-card">
    <div class="brand-mark">M</div>

    {#if error}
      <div class="cb-error">
        <div class="cb-error-title">Something went wrong</div>
        <div class="cb-error-msg">{error}</div>
        <a href="/" class="cb-back">← Try again</a>
      </div>
    {:else}
      <div class="cb-spinner"></div>
      <div class="cb-status">{status}</div>
    {/if}
  </div>
</div>

<style>
  .callback-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .callback-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    text-align: center;
  }

  .brand-mark {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: var(--grad-cta);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head);
    font-size: 1.3rem; font-weight: 800;
    color: #0D0A18;
    margin-bottom: .5rem;
  }

  .cb-spinner {
    width: 28px; height: 28px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  .cb-status {
    font-family: var(--font-head);
    font-size: .85rem; font-weight: 600;
    color: var(--muted);
  }

  .cb-error-title {
    font-family: var(--font-head);
    font-size: 1rem; font-weight: 700;
    color: var(--danger); margin-bottom: .4rem;
  }

  .cb-error-msg {
    font-size: .82rem; color: var(--muted);
    font-weight: 300; margin-bottom: 1rem;
  }

  .cb-back {
    font-family: var(--font-head);
    font-size: .8rem; font-weight: 700;
    color: var(--accent); text-decoration: none;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>
