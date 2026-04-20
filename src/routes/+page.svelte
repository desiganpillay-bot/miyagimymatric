<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let hasAssessment = false;

  onMount(() => {
    hasAssessment = !!localStorage.getItem('mmm_assessment_v1');
  });

  function handleCTA() {
    if (hasAssessment) {
      goto('/dashboard');
    } else {
      goto('/assessment');
    }
  }
</script>

<svelte:head>
  <title>Miyagi My Matric — Your Matric Sensei</title>
  <meta name="description" content="Your SA Grade 12 study companion. APS tracker, smart timetable, and personalised strategy — built for SA learners." />
</svelte:head>

<div class="app landing">
  <header class="hero">
    <div class="badge">IEB · CAPS · Grade 10–12</div>

    <h1>Miyagi<span class="accent-text">My</span>Matric</h1>
    <p class="tagline">Your Matric Sensei</p>

    <p class="sub">
      5-minute assessment → personalised study plan → exam ready.
    </p>

    <div class="cta-wrap">
      <button class="btn btn-next cta-main" on:click={handleCTA}>
        {hasAssessment ? 'Continue my plan →' : 'Start — it\'s free →'}
      </button>
      {#if !hasAssessment}
        <p class="cta-note">No login · under 5 minutes · built for SA learners</p>
      {:else}
        <p class="cta-note">Welcome back — your plan is saved</p>
      {/if}
    </div>

    <!-- Inline micro-steps — no separate page needed -->
    <div class="steps-row">
      <div class="micro-step">
        <span class="step-num">01</span>
        <span class="step-text">Tell us your subjects & marks</span>
      </div>
      <span class="step-arrow">›</span>
      <div class="micro-step">
        <span class="step-num">02</span>
        <span class="step-text">Get your live APS + priority gaps</span>
      </div>
      <span class="step-arrow">›</span>
      <div class="micro-step">
        <span class="step-num">03</span>
        <span class="step-text">Smart timetable built around you</span>
      </div>
    </div>
  </header>

  <!-- What you unlock -->
  <section class="unlock-section">
    <p class="unlock-label">What you unlock in 5 minutes</p>
    <div class="unlock-list">
      <div class="unlock-item hot">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" fill="url(#g-danger)" stroke="none"/>
            <defs><linearGradient id="g-danger" x1="4" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5C8A"/><stop offset="1" stop-color="#FF5C8A" stop-opacity=".6"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">Panic Mode</span>
          <span class="unlock-desc">Exam tomorrow? Get a rescue plan for every hour you have left.</span>
        </div>
        <span class="unlock-badge new-badge">New</span>
      </div>
      <div class="unlock-item">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="12" width="4" height="9" rx="1" fill="url(#g-aps)"/>
            <rect x="10" y="7" width="4" height="14" rx="1" fill="url(#g-aps)" opacity=".8"/>
            <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#g-aps)" opacity=".6"/>
            <defs><linearGradient id="g-aps" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#7C4DFF"/><stop offset="1" stop-color="#E040FB"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">Live APS Score</span>
          <span class="unlock-desc">See exactly where you stand vs UCT, Wits, UP — updates as your marks change.</span>
        </div>
      </div>
      <div class="unlock-item">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V15M12 3L8 7M12 3L16 7" stroke="url(#g-share)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 17V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V17" stroke="url(#g-share)" stroke-width="2" stroke-linecap="round"/>
            <defs><linearGradient id="g-share" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#E040FB"/><stop offset="1" stop-color="#FFB300"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">Shareable APS Card</span>
          <span class="unlock-desc">Post your score to WhatsApp status or IG stories. Show your progress.</span>
        </div>
        <span class="unlock-badge fire-badge">Hot</span>
      </div>
      <div class="unlock-item">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="17" rx="2" stroke="url(#g-cal)" stroke-width="1.8"/>
            <path d="M3 9H21" stroke="url(#g-cal)" stroke-width="1.8"/>
            <path d="M8 2V6M16 2V6" stroke="url(#g-cal)" stroke-width="1.8" stroke-linecap="round"/>
            <rect x="7" y="13" width="3" height="3" rx=".5" fill="url(#g-cal)"/>
            <rect x="14" y="13" width="3" height="3" rx=".5" fill="url(#g-cal)" opacity=".6"/>
            <defs><linearGradient id="g-cal" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#7C4DFF"/><stop offset="1" stop-color="#69B4FF"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">Smart Timetable</span>
          <span class="unlock-desc">Auto-built for your weakest subjects. 3 intensity modes.</span>
        </div>
      </div>
      <div class="unlock-item">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11L12 14L22 4" stroke="url(#g-sba)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="url(#g-sba)" stroke-width="1.8" stroke-linecap="round"/>
            <defs><linearGradient id="g-sba" x1="3" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#7AFF7A"/><stop offset="1" stop-color="#69B4FF"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">SBA Tracker</span>
          <span class="unlock-desc">Every deadline, colour-coded by urgency. Never "Not Resulted".</span>
        </div>
      </div>
      <div class="unlock-item">
        <span class="unlock-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="url(#g-timer)" stroke-width="1.8"/>
            <path d="M12 7V12L15.5 14.5" stroke="url(#g-timer)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 2H14" stroke="url(#g-timer)" stroke-width="2" stroke-linecap="round"/>
            <defs><linearGradient id="g-timer" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#FFB300"/><stop offset="1" stop-color="#E040FB"/></linearGradient></defs>
          </svg>
        </span>
        <div class="unlock-text">
          <span class="unlock-name">50/10 Pomodoro</span>
          <span class="unlock-desc">SA educators' format. Tracks your hours per subject automatically.</span>
        </div>
      </div>
    </div>
  </section> class="footer">
    <p>Built for SA learners · IEB + CAPS · Free</p>
    <p class="footer-links">
      <a href="/privacy">Privacy</a> ·
      <a href="/terms">Terms</a> ·
      SADAG: <strong>0800 456 789</strong>
    </p>
  </footer>
</div>

<style>
  .landing {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
  }

  .hero {
    text-align: center;
    padding: 3rem 0 2rem;
    animation: fadeDown .5s ease both;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(2.4rem, 7vw, 4rem);
    font-weight: 800;
    line-height: 1;
    margin-bottom: .4rem;
    background: linear-gradient(135deg, #FFF4E8 0%, rgba(255,244,232,.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .accent-text {
    background: var(--grad-cta);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    font-family: var(--font-head);
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: .14em;
    text-transform: uppercase;
    margin-bottom: 1.4rem;
  }

  .sub {
    font-size: 1rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  /* CTA */
  .cta-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .6rem;
    margin-bottom: 2.5rem;
  }

  .cta-main {
    width: 100%;
    max-width: 320px;
    font-size: 1rem;
    padding: 1rem 2rem;
  }

  .cta-note {
    font-size: .78rem;
    color: var(--accent3);
    font-weight: 500;
    letter-spacing: .02em;
  }

  /* Micro steps */
  .steps-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: .75rem;
    flex-wrap: wrap;
    margin-bottom: .5rem;
  }

  .micro-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .3rem;
    max-width: 120px;
  }

  .step-num {
    font-family: var(--font-head);
    font-size: .6rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: .1em;
  }

  .step-text {
    font-size: .72rem;
    color: var(--muted);
    font-weight: 400;
    line-height: 1.4;
    text-align: center;
  }

  .step-arrow {
    color: rgba(255,244,232,.2);
    font-size: 1.2rem;
    align-self: center;
    margin-top: .2rem;
  }

  /* Tool preview */
  .tools-preview {
    margin: 0 0 2rem;
    animation: fadeUp .5s ease .15s both;
  }

  .tools-label {
    font-family: var(--font-head);
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: center;
    margin-bottom: .9rem;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem;
  }

  .tool-card {
    display: flex;
    align-items: center;
    gap: .75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: .85rem 1rem;
  }

  .tool-icon { font-size: 1.2rem; flex-shrink: 0; }

  .tool-name {
    font-family: var(--font-head);
    font-size: .8rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .tool-desc {
    font-size: .65rem;
    color: var(--muted);
    margin-top: .1rem;
  }

  /* Unlock section */
  .unlock-section {
    margin: 0 0 2rem;
    animation: fadeUp .5s ease .1s both;
  }

  .unlock-label {
    font-family: var(--font-head);
    font-size: .62rem; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); text-align: center;
    margin-bottom: .9rem;
  }

  .unlock-list {
    display: flex; flex-direction: column; gap: .45rem;
  }

  .unlock-item {
    display: flex; align-items: center; gap: .85rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: .75rem 1rem;
    transition: border-color .2s;
  }
  .unlock-item:hover { border-color: rgba(124,77,255,.3); }
  .unlock-item.hot { border-color: rgba(255,92,138,.2); }

  .unlock-icon {
    width: 32px; height: 32px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2);
    border-radius: 9px;
    padding: 6px;
  }
  .unlock-icon svg { width: 100%; height: 100%; }

  .unlock-text {
    flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0;
  }
  .unlock-name {
    font-family: var(--font-head); font-size: .82rem; font-weight: 700;
    color: var(--text);
  }
  .unlock-desc {
    font-size: .7rem; color: var(--muted); font-weight: 300;
    line-height: 1.4;
  }

  .unlock-badge {
    font-family: var(--font-head); font-size: .6rem; font-weight: 700;
    padding: .18rem .5rem; border-radius: 5px;
    flex-shrink: 0; white-space: nowrap;
  }
  .new-badge { background: rgba(124,77,255,.15); color: var(--accent); border: 1px solid rgba(124,77,255,.3); }
  .fire-badge { background: rgba(255,179,0,.12); color: var(--accent4); border: 1px solid rgba(255,179,0,.25); font-size: .8rem; }

  /* Footer */
  .footer {
    text-align: center;
    padding: 1.5rem 0 .5rem;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .footer p {
    font-size: .75rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: .3rem;
  }

  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    transition: color .15s;
  }
  .footer-links a:hover { color: var(--text); }

  @media (max-width: 480px) {
    .steps-row { gap: .5rem; }
    .step-arrow { display: none; }
    .micro-step { max-width: 80px; }
    .tools-grid { grid-template-columns: 1fr; }
  }
</style>
