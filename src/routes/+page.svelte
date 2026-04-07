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
    <div class="badge">Grade 10 · 11 · 12 · SA Learners</div>
    <h1>Miyagi<span class="accent-text">My</span>Matric</h1>
    <p class="tagline">Your Matric Sensei</p>
    <p class="sub">
      The study platform that knows SA matric inside out — live APS tracking, personalised timetable,
      SBA deadlines, and a study strategy built around how <em>you</em> learn.
    </p>
    <div class="hero-actions">
      <button class="btn btn-next" on:click={() => goto('/assessment')}>
        Begin Your Assessment ✦
      </button>
      <p class="no-login">No login required to start · saves automatically</p>
    </div>
  </header>

  <!-- Features -->
  <div class="features">
    <div class="feature-card" style="animation-delay: 0s">
      <div class="feature-icon">📐</div>
      <h3>Live APS Calculator</h3>
      <p>See your APS update in real time as you enter marks. Compares instantly against your target universities and programmes.</p>
    </div>
    <div class="feature-card" style="animation-delay: 0.07s">
      <div class="feature-icon">📅</div>
      <h3>Smart Timetable</h3>
      <p>Build a weekly study plan around your subjects, peak focus times, and exam dates. Prelims and finals built in.</p>
    </div>
    <div class="feature-card" style="animation-delay: 0.14s">
      <div class="feature-icon">⏱</div>
      <h3>Pomodoro Timer</h3>
      <p>50/10 format recommended by SA educators — study hard, break intentionally. Every session logged automatically.</p>
    </div>
    <div class="feature-card" style="animation-delay: 0.21s">
      <div class="feature-icon">📋</div>
      <h3>SBA Tracker</h3>
      <p>Never miss a submission. SBA tasks are worth 25% of your final mark — track every one with deadline alerts.</p>
    </div>
    <div class="feature-card" style="animation-delay: 0.28s">
      <div class="feature-icon">📄</div>
      <h3>Report Upload</h3>
      <p>Upload your school report and we'll read your marks automatically. Up to 3 reports — track your progress over time.</p>
    </div>
    <div class="feature-card" style="animation-delay: 0.35s">
      <div class="feature-icon">🔥</div>
      <h3>Study Streaks</h3>
      <p>Build a daily study habit with streaks and XP. Small consistent sessions beat last-minute cramming every time.</p>
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
      Start My Assessment →
    </button>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p>Built for SA learners · IEB + CAPS · Free for now</p>
    <p class="footer-sub">
      SADAG mental health support: <strong>0800 456 789</strong> (free) ·
      DBE past papers: <strong>education.gov.za</strong>
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
    background: linear-gradient(135deg, #fff 0%, #c0d0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .accent-text {
    -webkit-text-fill-color: var(--accent);
    color: var(--accent);
  }

  .tagline {
    font-family: var(--font-head);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }

  .sub {
    color: var(--muted);
    font-size: 1rem;
    font-weight: 300;
    max-width: 520px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .6rem;
  }

  .no-login {
    font-size: .75rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* Feature grid */
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 2.5rem 0;
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.4rem;
    animation: fadeUp .4s ease both;
    transition: border-color .2s, transform .2s;
  }

  .feature-card:hover {
    border-color: var(--border);
    transform: translateY(-2px);
  }

  .feature-icon {
    font-size: 1.8rem;
    margin-bottom: .7rem;
  }

  .feature-card h3 {
    font-family: var(--font-head);
    font-size: .9rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: .5rem;
  }

  .feature-card p {
    font-size: .8rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
  }

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
    border-color: rgba(246,201,14,.35);
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
    background: linear-gradient(135deg, rgba(246,201,14,.04), rgba(56,189,248,.03));
    border: 1px solid rgba(246,201,14,.15);
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

  .footer-sub {
    font-size: .72rem !important;
  }

  /* Mobile */
  @media (max-width: 560px) {
    .features {
      grid-template-columns: 1fr;
    }

    .tools-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .hero { padding: 2rem 0 1.5rem; }
  }
</style>
