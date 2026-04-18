<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Miyagi My Matric — Your Matric Sensei</title>
  <meta name="description" content="Your SA Grade 12 study companion. APS tracker, smart timetable, study sessions and personalised strategy — built for SA learners." />
</svelte:head>

<div class="app">
  <!-- Header -->
  <header class="hero">
    <div class="badge">IEB · CAPS · NSC · Grade 10–12</div>
    <h1>Miyagi<span class="accent-text">My</span>Matric</h1>
    <p class="tagline">Your Matric Sensei</p>
    <p class="positioning">
      Miyagi My Matric guides SA Grade 10–12 learners from first visit to exam-ready. A smart assessment profiles your subjects, intensity, and readiness — then generates a fully personalised study plan.
    </p>
    <div class="route-fork">
      <button class="btn btn-next fork-primary" on:click={() => goto('/assessment')}>
        New here? Start Assessment →
      </button>
      <button class="btn btn-ghost fork-secondary" on:click={() => goto('/dashboard')}>
        Already registered? Go to My Plan
      </button>
    </div>
    <p class="no-login">It takes less than five minutes to get started · no login required</p>
  </header>

  <!-- 3-step journey -->
  <div class="steps">
    <div class="step-card" id="sc1" style="animation-delay: 0s">
      <div class="step-num">STEP 01</div>
      <h3>Self-Assessment &amp; APS Analysis</h3>
      <p>Rate your subjects, set university goals, and get a personalised study hours recommendation.</p>
      <a href="/assessment" class="step-link">Start here →</a>
    </div>
    <div class="step-card" id="sc2" style="animation-delay: 0.08s">
      <div class="step-num accent">STEP 02</div>
      <h3>Personalised Timetable</h3>
      <p>Generate a subject-balanced weekly schedule — hours matched to your APS gap and goals. Stretch mode on by default.</p>
      <a href="/timetable" class="step-link">Build timetable →</a>
    </div>
    <div class="step-card" style="animation-delay: 0.16s">
      <div class="step-num">STEP 03</div>
      <h3>Free SA Resources</h3>
      <p>Curated SA-specific tools, zero-rated platforms, past papers, and mental health support.</p>
      <a href="/resources" class="step-link">Explore resources →</a>
    </div>
  </div>

  <!-- Tools nav -->
  <div class="tools-section">
    <h2 class="tools-heading">Your Study Tools</h2>
    <div class="tools-grid">
      <a href="/assessment" class="tool-link">
        <span class="tool-icon">🎯</span>
        <span class="tool-name">Self-Assessment</span>
        <span class="tool-desc">APS + university match</span>
      </a>
      <a href="/timetable" class="tool-link">
        <span class="tool-icon">📅</span>
        <span class="tool-name">Timetable</span>
        <span class="tool-desc">Weekly study planner</span>
      </a>
      <a href="/pomodoro" class="tool-link">
        <span class="tool-icon">⏱️</span>
        <span class="tool-name">Pomodoro Timer</span>
        <span class="tool-desc">50/10 focused sessions</span>
      </a>
      <a href="/sba" class="tool-link">
        <span class="tool-icon">✅</span>
        <span class="tool-name">SBA Tracker</span>
        <span class="tool-desc">Deadlines + submissions</span>
      </a>
      <a href="/marks" class="tool-link">
        <span class="tool-icon">📊</span>
        <span class="tool-name">Marks Tracker</span>
        <span class="tool-desc">Live APS calculator</span>
      </a>
      <a href="/subjects" class="tool-link">
        <span class="tool-icon">📚</span>
        <span class="tool-name">Subject Strategy</span>
        <span class="tool-desc">Per-subject tips + papers</span>
      </a>
      <a href="/techniques" class="tool-link">
        <span class="tool-icon">🧠</span>
        <span class="tool-name">Study Techniques</span>
        <span class="tool-desc">Evidence-based methods</span>
      </a>
      <a href="/resources" class="tool-link">
        <span class="tool-icon">📶</span>
        <span class="tool-name">Resources</span>
        <span class="tool-desc">Zero-rated + free tools</span>
      </a>
      <a href="/dashboard" class="tool-link">
        <span class="tool-icon">🏠</span>
        <span class="tool-name">Dashboard</span>
        <span class="tool-desc">Your progress overview</span>
      </a>
    </div>
  </div>

  <!-- Sensei quote -->
  <div class="sensei-block">
    <div class="sensei-quote">
      "First learn stand, then learn fly. Wax on, wax off."
    </div>
    <div class="sensei-attr">— Mr. Miyagi · and also: do your past papers</div>
  </div>

  <!-- CTA -->
  <div class="cta-block">
    <h2>It takes less than five minutes to get started.</h2>
    <p>Answer 6 sections. Get a personalised study profile, live APS, and a recommended strategy for your subjects and universities.</p>
    <button class="btn btn-finish" on:click={() => goto('/assessment')}>
      Begin Assessment →
    </button>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p>Built for SA learners · IEB + CAPS · Free for now</p>
    <p class="footer-sub">
      SADAG mental health support: <strong>0800 456 789</strong> (free) ·
      DBE past papers: <strong>education.gov.za</strong>
    </p>
    <p class="footer-links">
      <a href="/how-it-works">How It Works</a> ·
      <a href="/privacy">Privacy</a> ·
      <a href="/terms">Terms</a>
    </p>
  </footer>
</div>

<style>
  .hero {
    text-align: center;
    padding: 3rem 0 2.5rem;
    animation: fadeDown .6s ease both;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 800;
    line-height: 1;
    margin-bottom: .5rem;
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
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .positioning {
    color: var(--muted);
    font-size: .95rem;
    font-weight: 300;
    max-width: 520px;
    margin: 0 auto 1.8rem;
    line-height: 1.75;
  }

  .route-fork {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .75rem;
    margin-bottom: .8rem;
  }

  .fork-primary  { width: 100%; max-width: 340px; }
  .fork-secondary { width: 100%; max-width: 340px; }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-head);
    font-weight: 600;
    font-size: .88rem;
    padding: .7rem 1.4rem;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: rgba(255,244,232,.30); color: var(--text); }

  .no-login {
    font-size: .75rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 0;
  }

  /* 3-step journey */
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 2.5rem 0;
  }

  .step-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.4rem;
    animation: fadeUp .4s ease both;
    transition: border-color .2s, transform .2s;
    display: flex;
    flex-direction: column;
    gap: .6rem;
  }

  .step-card:hover {
    border-color: rgba(255,45,166,.30);
    transform: translateY(-2px);
  }

  .step-num {
    font-family: var(--font-head);
    font-size: .65rem;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .step-num.accent { color: var(--accent); }

  .step-card h3 {
    font-family: var(--font-head);
    font-size: .9rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    line-height: 1.3;
  }

  .step-card p {
    font-size: .8rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
    margin: 0;
    flex: 1;
  }

  .step-link {
    font-family: var(--font-head);
    font-size: .78rem;
    font-weight: 700;
    color: var(--accent2);
    text-decoration: none;
    transition: color .2s;
  }
  .step-link:hover { color: var(--accent); }

  /* Tools section */
  .tools-section {
    margin: 0 0 2.5rem;
    animation: fadeUp .4s ease both;
  }

  .tools-heading {
    font-family: var(--font-head);
    font-size: 1rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .08em;
    margin: 0 0 1rem;
    text-align: center;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .65rem;
  }

  .tool-link {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .2rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: .9rem 1rem;
    text-decoration: none;
    transition: border-color .2s, transform .15s;
  }

  .tool-link:hover {
    border-color: rgba(255,45,166,.35);
    transform: translateY(-1px);
  }

  .tool-icon { font-size: 1.25rem; }

  .tool-name {
    font-family: var(--font-head);
    font-size: .8rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .tool-desc {
    font-size: .68rem;
    color: var(--muted);
    line-height: 1.3;
  }

  /* Sensei block */
  .sensei-block {
    text-align: center;
    padding: 2rem;
    margin: 1rem 0 2rem;
    background: linear-gradient(135deg, rgba(255,45,166,.05), rgba(124,58,237,.04));
    border: 1px solid rgba(255,45,166,.18);
    border-radius: 16px;
    animation: fadeIn .5s ease both;
  }

  .sensei-quote {
    font-family: var(--font-head);
    font-size: clamp(1rem, 3vw, 1.3rem);
    font-weight: 600;
    color: var(--text);
    font-style: italic;
    margin-bottom: .5rem;
  }

  .sensei-attr {
    font-size: .78rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* CTA block */
  .cta-block {
    text-align: center;
    padding: 2.5rem 1rem;
    animation: fadeUp .4s ease both;
  }

  .cta-block h2 {
    font-family: var(--font-head);
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: .6rem;
  }

  .cta-block p {
    color: var(--muted);
    font-weight: 300;
    max-width: 480px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
    font-size: .9rem;
  }

  /* Footer */
  .footer {
    text-align: center;
    padding: 2rem 0 1rem;
    border-top: 1px solid var(--border);
    margin-top: 2rem;
  }

  .footer p {
    font-size: .78rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: .3rem;
  }

  .footer-sub { font-size: .72rem !important; }

  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    transition: color .15s;
  }
  .footer-links a:hover { color: var(--text); }

  /* Mobile */
  @media (max-width: 640px) {
    .steps { grid-template-columns: 1fr; }
    .tools-grid { grid-template-columns: repeat(2, 1fr); }
    .hero { padding: 2rem 0 1.5rem; }
    .hero-actions { flex-direction: column; }
  }
</style>
