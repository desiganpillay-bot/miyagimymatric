<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSession, signInWithMagicLink, signInWithGoogle } from '$lib/auth';

  // ── State ──────────────────────────────────────────────────
  let loading = true;
  let email = '';
  let sendStatus: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  let authError = '';
  let agreedTerms   = false;
  let agreedPrivacy = false;
  $: canProceed = agreedTerms && agreedPrivacy;

  onMount(async () => {
    const session = await getSession();
    if (session) {
      // Already authed — check if they've done assessment
      const hasAssessment = !!localStorage.getItem('mmm_assessment_v1');
      goto(hasAssessment ? '/dashboard' : '/assessment');
      return;
    }
    loading = false;
  });

  function saveConsent() {
    localStorage.setItem('mmm_popia_consent', JSON.stringify({
      consented_at: new Date().toISOString(),
      terms_version: '1.0',
    }));
  }

  async function handleMagicLink() {
    if (!canProceed || !email.trim()) return;
    sendStatus = 'sending';
    authError = '';
    saveConsent();
    const { error } = await signInWithMagicLink(email.trim());
    sendStatus = error ? 'error' : 'sent';
    if (error) authError = error;
  }

  async function handleGoogle() {
    if (!canProceed) return;
    saveConsent();
    await signInWithGoogle();
  }
</script>

<svelte:head>
  <title>Miyagi My Matric — Your Matric Sensei</title>
  <meta name="description" content="SA Grade 12 study companion. APS tracker, smart timetable, and personalised study plan — built for SA learners." />
</svelte:head>

<div class="app landing">

  {#if loading}
    <div class="loading-wrap"><div class="spinner"></div></div>

  {:else}
    <!-- Hero -->
    <header class="hero">
      <div class="badge">IEB · CAPS · Grade 10–12</div>
      <h1>Miyagi<span class="accent-text">My</span>Matric</h1>
      <p class="tagline">Your Matric Sensei</p>
      <p class="sub">5-minute assessment → live APS → personalised study plan.</p>
    </header>

    <!-- Two columns: unlock list + sign in -->
    <div class="split">

      <!-- Left: unlock list -->
      <div class="unlock-section">
        <p class="unlock-label">What you unlock</p>
        <div class="unlock-list">
          <div class="unlock-item hot">
            <span class="unlock-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" fill="#FF5C8A"/></svg>
            </span>
            <div class="unlock-text">
              <span class="unlock-name">Panic Mode</span>
              <span class="unlock-desc">Exam tomorrow? Rescue plan in seconds.</span>
            </div>
            <span class="unlock-badge new-badge">New</span>
          </div>
          <div class="unlock-item">
            <span class="unlock-icon">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="#7C4DFF"/><rect x="10" y="7" width="4" height="14" rx="1" fill="#7C4DFF" opacity=".8"/><rect x="17" y="3" width="4" height="18" rx="1" fill="#7C4DFF" opacity=".6"/></svg>
            </span>
            <div class="unlock-text">
              <span class="unlock-name">Live APS Score</span>
              <span class="unlock-desc">Your score vs UCT, Wits, UP — live.</span>
            </div>
          </div>
          <div class="unlock-item">
            <span class="unlock-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3V15M12 3L8 7M12 3L16 7" stroke="#E040FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 17V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V17" stroke="#E040FB" stroke-width="2" stroke-linecap="round"/></svg>
            </span>
            <div class="unlock-text">
              <span class="unlock-name">Shareable APS Card</span>
              <span class="unlock-desc">Post your score to WhatsApp · IG stories.</span>
            </div>
            <span class="unlock-badge fire-badge">Hot</span>
          </div>
          <div class="unlock-item">
            <span class="unlock-icon">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#69B4FF" stroke-width="1.8"/><path d="M3 9H21" stroke="#69B4FF" stroke-width="1.8"/><path d="M8 2V6M16 2V6" stroke="#69B4FF" stroke-width="1.8" stroke-linecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="#69B4FF"/></svg>
            </span>
            <div class="unlock-text">
              <span class="unlock-name">Smart Timetable</span>
              <span class="unlock-desc">Auto-built for your weakest subjects.</span>
            </div>
          </div>
          <div class="unlock-item">
            <span class="unlock-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 11L12 14L22 4" stroke="#7AFF7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#7AFF7A" stroke-width="1.8" stroke-linecap="round"/></svg>
            </span>
            <div class="unlock-text">
              <span class="unlock-name">SBA Tracker</span>
              <span class="unlock-desc">Every deadline. Never "Not Resulted".</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: sign in form -->
      <div class="auth-card">
        {#if sendStatus === 'sent'}
          <div class="sent-state">
            <div class="sent-icon">✉️</div>
            <div class="sent-title">Check your email</div>
            <div class="sent-desc">We sent a sign-in link to <strong>{email}</strong>.<br>Click it to continue.</div>
            <button class="btn-text-link" on:click={() => { sendStatus = 'idle'; email = ''; }}>Use a different email</button>
          </div>
        {:else}
          <div class="auth-heading">Create your account</div>
          <div class="auth-sub">Sign in to build your personalised matric plan.</div>

          <!-- POPIA consent — required -->
          <div class="consent-block">
            <label class="consent-row">
              <input type="checkbox" bind:checked={agreedTerms} />
              <span>I agree to the <a href="/terms" target="_blank">Terms of Use</a></span>
            </label>
            <label class="consent-row">
              <input type="checkbox" bind:checked={agreedPrivacy} />
              <span>I accept the <a href="/privacy" target="_blank">Privacy Notice</a> (POPIA)</span>
            </label>
            <p class="consent-minor">If under 18, ask a parent or guardian to review these first.</p>
          </div>

          <!-- Google -->
          <button class="google-btn" disabled={!canProceed} on:click={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="divider"><span>or</span></div>

          <div class="email-form">
            <input
              class="text-input"
              type="email"
              placeholder="your@email.com"
              bind:value={email}
              disabled={sendStatus === 'sending'}
            />
            <button
              class="btn btn-next"
              disabled={!canProceed || !email.trim() || sendStatus === 'sending'}
              on:click={handleMagicLink}
            >
              {sendStatus === 'sending' ? 'Sending…' : 'Send sign-in link →'}
            </button>
          </div>

          {#if authError}
            <p class="auth-error">{authError}</p>
          {/if}
        {/if}
      </div>
    </div>

    <footer class="footer">
      <p class="footer-links">
        <a href="/privacy">Privacy</a> ·
        <a href="/terms">Terms</a> ·
        SADAG: <strong>0800 456 789</strong>
      </p>
    </footer>
  {/if}
</div>

<style>
  .landing { display: flex; flex-direction: column; min-height: 100vh; }
  .loading-wrap { flex: 1; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 28px; height: 28px; border: 2.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }

  .hero { text-align: center; padding: 2.5rem 0 1.5rem; animation: fadeDown .5s ease both; }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(2rem, 6vw, 3rem); font-weight: 800; line-height: 1;
    margin-bottom: .3rem;
    background: linear-gradient(135deg, #FFF4E8 0%, rgba(255,244,232,.6) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .accent-text { background: var(--grad-cta); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .tagline { font-family: var(--font-head); font-size: .9rem; font-weight: 600; color: var(--accent); letter-spacing: .14em; text-transform: uppercase; margin-bottom: .6rem; }
  .sub { font-size: .85rem; color: var(--muted); font-weight: 300; line-height: 1.6; }

  /* Split layout */
  .split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    align-items: start;
    animation: fadeUp .4s ease .1s both;
  }

  /* Unlock list */
  .unlock-section { }
  .unlock-label { font-family: var(--font-head); font-size: .6rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-bottom: .65rem; }
  .unlock-list { display: flex; flex-direction: column; gap: .35rem; }
  .unlock-item { display: flex; align-items: center; gap: .7rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: .65rem .85rem; transition: border-color .15s; }
  .unlock-item:hover { border-color: rgba(124,77,255,.3); }
  .unlock-item.hot { border-color: rgba(255,92,138,.2); }
  .unlock-icon { width: 28px; height: 28px; flex-shrink: 0; background: var(--surface2); border-radius: 7px; padding: 5px; display: flex; align-items: center; justify-content: center; }
  .unlock-icon svg { width: 100%; height: 100%; }
  .unlock-text { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .unlock-name { font-family: var(--font-head); font-size: .78rem; font-weight: 700; color: var(--text); }
  .unlock-desc { font-size: .65rem; color: var(--muted); font-weight: 300; line-height: 1.3; }
  .unlock-badge { font-family: var(--font-head); font-size: .55rem; font-weight: 700; padding: .15rem .45rem; border-radius: 4px; flex-shrink: 0; }
  .new-badge  { background: rgba(124,77,255,.15); color: var(--accent); border: 1px solid rgba(124,77,255,.3); }
  .fire-badge { background: rgba(255,179,0,.12); color: var(--accent4); border: 1px solid rgba(255,179,0,.25); }

  /* Auth card */
  .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem; }
  .auth-heading { font-family: var(--font-head); font-size: .95rem; font-weight: 800; color: var(--text); margin-bottom: .2rem; }
  .auth-sub { font-size: .75rem; color: var(--muted); font-weight: 300; margin-bottom: 1.1rem; line-height: 1.5; }

  .consent-block { margin-bottom: 1.1rem; }
  .consent-row { display: flex; align-items: flex-start; gap: .5rem; font-size: .75rem; color: var(--muted); font-weight: 300; line-height: 1.5; cursor: pointer; margin-bottom: .5rem; }
  .consent-row input { margin-top: 2px; flex-shrink: 0; accent-color: var(--accent); }
  .consent-row a { color: var(--accent2); text-decoration: none; }
  .consent-row a:hover { text-decoration: underline; }
  .consent-minor { font-size: .65rem; color: rgba(255,244,232,.25); font-weight: 300; line-height: 1.5; }

  .google-btn { display: flex; align-items: center; justify-content: center; gap: .6rem; width: 100%; background: rgba(255,244,232,.06); border: 1px solid rgba(255,244,232,.15); border-radius: 10px; padding: .75rem; font-family: var(--font-head); font-size: .82rem; font-weight: 700; color: var(--text); cursor: pointer; transition: background .15s; margin-bottom: .9rem; }
  .google-btn:hover:not(:disabled) { background: rgba(255,244,232,.1); }
  .google-btn:disabled { opacity: .4; cursor: not-allowed; }

  .divider { display: flex; align-items: center; gap: .6rem; margin-bottom: .9rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .divider span { font-size: .7rem; color: var(--muted); font-weight: 300; }

  .email-form { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .5rem; }
  .text-input { width: 100%; background: var(--surface2); border: 1.5px solid var(--border); color: var(--text); border-radius: 8px; padding: .7rem .9rem; font-family: var(--font-body); font-size: .85rem; outline: none; transition: border-color .2s; }
  .text-input:focus { border-color: var(--accent); }
  .text-input::placeholder { color: var(--muted); }

  .sent-state { text-align: center; padding: 1rem 0; }
  .sent-icon { font-size: 2rem; margin-bottom: .6rem; }
  .sent-title { font-family: var(--font-head); font-size: .95rem; font-weight: 700; color: var(--text); margin-bottom: .35rem; }
  .sent-desc { font-size: .78rem; color: var(--muted); font-weight: 300; line-height: 1.6; margin-bottom: .9rem; }
  .btn-text-link { background: none; border: none; cursor: pointer; font-family: var(--font-head); font-size: .75rem; font-weight: 600; color: var(--muted); text-decoration: underline; transition: color .15s; padding: 0; }
  .btn-text-link:hover { color: var(--text); }

  .auth-error { font-size: .72rem; color: var(--danger); margin-top: .3rem; }

  /* Footer */
  .footer { text-align: center; padding: 1.2rem 0 .5rem; border-top: 1px solid var(--border); margin-top: auto; }
  .footer-links { font-size: .72rem; color: var(--muted); }
  .footer-links a { color: var(--muted); text-decoration: none; transition: color .15s; }
  .footer-links a:hover { color: var(--text); }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .split { grid-template-columns: 1fr; }
    .hero { padding: 2rem 0 1rem; }
  }
</style>
