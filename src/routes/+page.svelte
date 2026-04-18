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
      <button class="btn btn-next fork-secondary" on:click={() => goto('/dashboard')}>
        Take me back to my Plan →
      </button>
    </div>
    <p class="no-login">It takes less than five minutes to get started · no login required</p>
  </header>

  <!-- Resources teaser -->
  <section class="resources-teaser">
    <p class="teaser-label">Complete your assessment to unlock</p>
    <div class="teaser-grid">
      <div class="teaser-item locked">
        <span class="teaser-icon">📄</span>
        <div>
          <div class="teaser-name">Past Papers</div>
          <div class="teaser-sub">IEB + NSC · matched to your subjects</div>
        </div>
        <span class="lock">🔒</span>
      </div>
      <div class="teaser-item locked">
        <span class="teaser-icon">📐</span>
        <div>
          <div class="teaser-name">Siyavula</div>
          <div class="teaser-sub">Adaptive Maths & Science · zero-rated</div>
        </div>
        <span class="lock">🔒</span>
      </div>
      <div class="teaser-item locked">
        <span class="teaser-icon">▶️</span>
        <div>
          <div class="teaser-name">Video Lessons</div>
          <div class="teaser-sub">Kevinmathscience · Mindset Learn</div>
        </div>
        <span class="lock">🔒</span>
      </div>
      <div class="teaser-item locked">
        <span class="teaser-icon">🤖</span>
        <div>
          <div class="teaser-name">AI Tutors</div>
          <div class="teaser-sub">Maski WhatsApp · 100k+ learners</div>
        </div>
        <span class="lock">🔒</span>
      </div>
      <div class="teaser-item locked">
        <span class="teaser-icon">🧠</span>
        <div>
          <div class="teaser-name">Flashcard Tools</div>
          <div class="teaser-sub">Anki · Quizlet · spaced repetition</div>
        </div>
        <span class="lock">🔒</span>
      </div>
      <div class="teaser-item locked">
        <span class="teaser-icon">📅</span>
        <div>
          <div class="teaser-name">Study Timetable</div>
          <div class="teaser-sub">Personalised · 3 intensity modes</div>
        </div>
        <span class="lock">🔒</span>
      </div>
    </div>
    <button class="btn btn-next teaser-cta" on:click={() => goto('/assessment')}>
      Start Assessment — it's free →
    </button>
  </section>

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
    background: rgba(255, 244, 232, 0.06);
    border: 1px solid rgba(255, 244, 232, 0.28);
    color: rgba(255, 244, 232, 0.85);
    font-family: var(--font-head);
    font-weight: 600;
    font-size: .88rem;
    padding: .7rem 1.4rem;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color .2s, color .2s, background .2s;
  }
  .btn-ghost:hover { border-color: rgba(255,244,232,.55); color: var(--text); background: rgba(255,244,232,.10); }

  .no-login {
    font-size: .82rem;
    color: var(--accent3);
    font-weight: 600;
    margin-bottom: 0;
    letter-spacing: .02em;
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
    border-color: rgba(255,82,82,.30);
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
    background: linear-gradient(135deg, rgba(255,82,82,.05), rgba(105,180,255,.04));
    border: 1px solid rgba(255,82,82,.18);
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

  /* Resources teaser */
  .resources-teaser {
    margin: 0 0 2.5rem;
    animation: fadeUp .5s ease .1s both;
  }

  .teaser-label {
    font-family: var(--font-head);
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: center;
    margin-bottom: 1rem;
  }

  .teaser-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem;
    margin-bottom: 1.1rem;
  }

  .teaser-item {
    display: flex;
    align-items: center;
    gap: .75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: .75rem .9rem;
    position: relative;
    overflow: hidden;
  }

  .teaser-item.locked {
    opacity: .55;
    filter: blur(0px);
  }

  .teaser-item.locked::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 6px,
      rgba(255,244,232,.015) 6px,
      rgba(255,244,232,.015) 12px
    );
    pointer-events: none;
  }

  .teaser-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .teaser-item > div { flex: 1; min-width: 0; }

  .teaser-name {
    font-family: var(--font-head);
    font-size: .78rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .teaser-sub {
    font-size: .65rem;
    color: var(--muted);
    line-height: 1.3;
    margin-top: .1rem;
  }

  .lock {
    font-size: .75rem;
    flex-shrink: 0;
    opacity: .5;
  }

  .teaser-cta {
    display: block;
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }

  /* Mobile */
  @media (max-width: 640px) {
    .steps { grid-template-columns: 1fr; }
    .tools-grid { grid-template-columns: repeat(2, 1fr); }
    .hero { padding: 2rem 0 1.5rem; }
    .hero-actions { flex-direction: column; }
  }
</style>
