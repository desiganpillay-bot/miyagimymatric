<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { getSupabase } from '$lib/supabase';

  let status = 'Signing you in…';

  onMount(async () => {
    const sb = getSupabase();
    const code = $page.url.searchParams.get('code');

    if (code) {
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (error) {
        status = 'Sign-in failed. Please try again.';
        setTimeout(() => goto('/assessment'), 3000);
        return;
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
