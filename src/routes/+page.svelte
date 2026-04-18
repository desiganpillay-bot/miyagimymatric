<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabase } from '$lib/supabase';

  const steps = [
    { n: '01', title: 'Start with assessment',      body: 'Answer a guided set of questions to understand your current position, subject confidence, habits, and pressure points.' },
    { n: '02', title: 'Unlock your learner profile', body: 'See your strengths, risk areas, learning style, and where your focus will have the greatest payoff.' },
    { n: '03', title: 'Get your study plan',         body: 'Receive a practical weekly plan shaped around your actual profile instead of generic study advice.' },
    { n: '04', title: 'Generate your timetable',     body: 'Turn the plan into realistic study blocks that fit your school week, energy, and available time.' },
    { n: '05', title: 'Use matched resources',       body: 'Access revision tools, papers, notes, and drills aligned to your exact subjects and gaps.' },
  ];

  const features = [
    { title: 'Assessment-led',     body: 'The learner is never confused about where to begin. One strong CTA drives the journey.' },
    { title: 'Profile-powered',    body: 'The platform explains why the plan is relevant, which builds trust and motivation.' },
    { title: 'Execution-focused',  body: 'The timetable and resources feel like the outcome of the system, not disconnected add-ons.' },
  ];

  // Redirect logged-in users with completed setup to their plan
  onMount(async () => {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      const hasAssessment = !!localStorage.getItem('mmm_assessment_v1');
      const hasTimetable  = !!localStorage.getItem('mmm_timetable_v1');
      if (hasAssessment && hasTimetable) goto('/dashboard');
    }
  });
</script>

<svelte:head>
  <title>Miyagi My Matric — Discipline your effort. Master your matric.</title>
  <meta name="description" content="Start with one guided assessment. Unlock your learner profile, build a focused study plan, and access matched SA matric resources." />
</svelte:head>

<div class="page">

  <!-- ── Top Nav ──────────────────────────────────────────── -->
  <header class="top-nav">
    <div class="nav-inner">
      <div class="brand">
        <div class="brand-mark">M</div>
        <span class="brand-name">Miyagi My Matric</span>
      </div>
      <nav class="nav-links">
        <a href="/resources" class="nav-link">Resources</a>
        <a href="/assessment" class="nav-link">Login</a>
        <a href="/assessment" class="nav-cta">Start Assessment</a>
      </nav>
    </div>
  </header>

  <!-- ── Hero ─────────────────────────────────────────────── -->
  <section class="hero">
    <div class="hero-left">
      <div class="eyebrow">premium concept · neon discipline</div>
      <h1>Discipline your effort.<br><span class="grad-text">Master your matric.</span></h1>
      <p class="hero-sub">
        Start with one guided assessment. Unlock your learner profile, build a focused study plan, generate a practical timetable, and use matched resources that help you improve with purpose.
      </p>
      <div class="hero-actions">
        <a href="/assessment" class="btn-primary">Start Assessment</a>
        <a href="/assessment?demo=1" class="btn-secondary">See Sample Profile</a>
      </div>
      <div class="feature-pills">
        {#each features as f}
          <div class="pill">
            <div class="pill-title">{f.title}</div>
            <div class="pill-body">{f.body}</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="hero-right">
      <div class="profile-card">
        <div class="profile-card-inner">
          <div class="profile-header">
            <div>
              <div class="profile-label">learner snapshot</div>
              <div class="profile-title">Your profile</div>
            </div>
            <div class="profile-ready">74% ready</div>
          </div>

          <div class="profile-grid">
            {#each [
              ['Strongest subject',  'English Home Language'],
              ['Priority subject',   'Physical Sciences'],
              ['Study style',        'Short focused sessions'],
              ['Recommended mode',   'Guided weekly plan'],
            ] as [label, value]}
              <div class="profile-cell">
                <div class="cell-label">{label}</div>
                <div class="cell-value">{value}</div>
              </div>
            {/each}
          </div>

          <div class="journey-card">
            <div class="journey-header">
              <div>
                <div class="journey-label">progress path</div>
                <div class="journey-title">Assessment to execution</div>
              </div>
              <div class="journey-badge">Live journey</div>
            </div>
            <div class="journey-steps">
              {#each ['Assessment','Profile','Study Plan','Timetable','Resources'] as item, i}
                <div class="journey-step">
                  <div class="step-n">Step {i + 1}</div>
                  <div class="step-name">{item}</div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── How It Works + Why ───────────────────────────────── -->
  <section class="lower">

    <div class="glass-card">
      <div class="section-pill">how the platform works</div>
      <div class="steps-list">
        {#each steps as s}
          <div class="step-row">
            <div class="step-num-badge">{s.n}</div>
            <div>
              <div class="step-title">{s.title}</div>
              <div class="step-body">{s.body}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="glass-card">
      <div class="why-header">
        <div>
          <div class="section-pill-sm">packaged direction</div>
          <div class="why-title">Why this works</div>
        </div>
        <div class="chosen-badge">chosen route</div>
      </div>

      <div class="why-grid">
        <div class="why-cell">
          <div class="why-cell-title">Positioning</div>
          <p class="why-cell-body">Feels premium and high-focus without looking like generic school software. Gives the platform confidence and aspiration.</p>
        </div>
        <div class="why-cell">
          <div class="why-cell-title">Audience fit</div>
          <p class="why-cell-body">Strong enough for teens to feel energized, but polished enough that parents and schools can trust it.</p>
        </div>
        <div class="why-cell wide">
          <div class="why-cell-title">Exam systems</div>
          <p class="why-cell-body">Built for both IEB and CAPS/NSC learners. Every recommendation, past paper link, and study tip is labelled by exam system.</p>
        </div>
      </div>

      <div class="cta-strip">
        <div class="cta-strip-title">Ready to start?</div>
        <p class="cta-strip-body">Complete the assessment in under 5 minutes. No login required to begin.</p>
        <a href="/assessment" class="btn-primary btn-full">Begin Assessment →</a>
      </div>
    </div>

  </section>

  <!-- ── Footer ───────────────────────────────────────────── -->
  <footer class="footer">
    <span>© 2026 Miyagi My Matric</span>
    <a href="/privacy">Privacy Notice</a>
    <a href="/terms">Terms of Use</a>
  </footer>

</div>

<style>
  .page {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.25rem 3rem;
  }

  /* ── Top Nav ─────────────────────────────────────────── */
  .top-nav {
    padding: 1rem 0;
    margin-bottom: .5rem;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.30);
    border: 1px solid rgba(255, 244, 232, 0.10);
    border-radius: 2rem;
    padding: .8rem 1.2rem;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: .75rem;
    text-decoration: none;
    flex-shrink: 0;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF2DA6, #7C3AED, #FFB703);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #07070B;
    flex-shrink: 0;
  }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: .95rem;
    color: #FFF4E8;
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: nowrap;
  }

  .nav-link {
    font-family: 'Syne', sans-serif;
    font-size: .8rem;
    color: rgba(255, 244, 232, 0.70);
    text-decoration: none;
    padding: .45rem .9rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(255,244,232,.04);
    transition: color .15s, border-color .15s;
    white-space: nowrap;
  }

  .nav-link:hover { color: #FFF4E8; border-color: rgba(255,244,232,.25); }

  .nav-cta {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: .8rem;
    color: #07070B;
    text-decoration: none;
    padding: .5rem 1.1rem;
    border-radius: 1.5rem;
    background: linear-gradient(to right, #FF2DA6, #7C3AED, #FFB703);
    white-space: nowrap;
    transition: opacity .15s;
  }

  .nav-cta:hover { opacity: .88; }

  /* ── Hero ──────────────────────────────────────────────── */
  .hero {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem 0 2rem;
  }

  @media (min-width: 900px) {
    .hero {
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 3rem;
      padding: 2rem 0 3rem;
    }
  }

  .eyebrow {
    display: inline-flex;
    border: 1px solid rgba(255, 45, 166, 0.30);
    background: linear-gradient(to right, rgba(255,45,166,.15), rgba(124,58,237,.15));
    color: rgba(255, 214, 239, 0.90);
    font-family: 'Syne', sans-serif;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .26em;
    text-transform: uppercase;
    padding: .3rem .85rem;
    border-radius: 100px;
    margin-bottom: 1.1rem;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 7vw, 3.6rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -.02em;
    color: #FFF4E8;
    margin-bottom: 1.1rem;
  }

  .grad-text {
    background: linear-gradient(to right, #FF2DA6, #C084FC, #FFB703);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: clamp(.9rem, 2.2vw, 1.05rem);
    line-height: 1.75;
    color: rgba(255,244,232,.75);
    max-width: 520px;
    margin-bottom: 1.6rem;
  }

  .hero-actions {
    display: flex;
    gap: .75rem;
    flex-wrap: wrap;
    margin-bottom: 1.8rem;
  }

  .btn-primary {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: .9rem;
    color: #07070B;
    text-decoration: none;
    padding: .8rem 1.8rem;
    border-radius: 100px;
    background: linear-gradient(to right, #FF2DA6, #7C3AED, #FFB703);
    box-shadow: 0 8px 30px rgba(255,45,166,.30);
    transition: opacity .15s, transform .15s;
    display: inline-flex;
    align-items: center;
  }

  .btn-primary:hover { opacity: .9; transform: translateY(-1px); }

  .btn-full { width: 100%; justify-content: center; }

  .btn-secondary {
    font-family: 'Syne', sans-serif;
    font-weight: 500;
    font-size: .9rem;
    color: rgba(255,244,232,.85);
    text-decoration: none;
    padding: .8rem 1.8rem;
    border-radius: 100px;
    border: 1px solid rgba(255,244,232,.14);
    background: rgba(255,244,232,.05);
    backdrop-filter: blur(8px);
    transition: border-color .15s;
    display: inline-flex;
    align-items: center;
  }

  .btn-secondary:hover { border-color: rgba(255,244,232,.30); }

  /* Feature pills */
  .feature-pills {
    display: grid;
    grid-template-columns: 1fr;
    gap: .6rem;
  }

  @media (min-width: 560px) {
    .feature-pills { grid-template-columns: repeat(3, 1fr); }
  }

  .pill {
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(255,244,232,.04);
    border-radius: 1.4rem;
    padding: 1rem 1.1rem;
    backdrop-filter: blur(8px);
  }

  .pill-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 600; color: #FFF4E8; margin-bottom: .35rem; }
  .pill-body  { font-size: .78rem; line-height: 1.55; color: rgba(255,244,232,.60); }

  /* ── Profile card ─────────────────────────────────────── */
  .hero-right { position: relative; }

  .profile-card {
    position: relative;
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(0,0,0,.25);
    border-radius: 2rem;
    padding: 1rem;
    box-shadow: 0 20px 80px rgba(0,0,0,.50);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  /* Glow orbs behind card */
  .hero-right::before,
  .hero-right::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
  }

  .hero-right::before {
    width: 130px; height: 130px;
    top: -2rem; right: -1.5rem;
    background: #7C3AED;
    opacity: .22;
    filter: blur(48px);
  }

  .hero-right::after {
    width: 110px; height: 110px;
    bottom: 0; left: -1rem;
    background: #FF2DA6;
    opacity: .18;
    filter: blur(40px);
  }

  .profile-card-inner {
    border: 1px solid rgba(255,244,232,.10);
    background: #09090f;
    border-radius: 1.6rem;
    padding: 1.1rem;
  }

  .profile-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .5rem;
    border-bottom: 1px solid rgba(255,244,232,.08);
    padding-bottom: .9rem;
    margin-bottom: 1rem;
  }

  .profile-label {
    font-family: 'Syne', sans-serif;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .20em;
    text-transform: uppercase;
    color: rgba(255,244,232,.40);
    margin-bottom: .2rem;
  }

  .profile-title {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #FFF4E8;
  }

  .profile-ready {
    font-family: 'Syne', sans-serif;
    font-size: .72rem;
    color: rgba(255,244,232,.65);
    border: 1px solid rgba(255,244,232,.12);
    background: rgba(255,244,232,.06);
    padding: .25rem .7rem;
    border-radius: 100px;
    white-space: nowrap;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem;
    margin-bottom: .8rem;
  }

  .profile-cell {
    border: 1px solid rgba(255,244,232,.08);
    background: rgba(255,244,232,.04);
    border-radius: 1.2rem;
    padding: .8rem;
  }

  .cell-label {
    font-family: 'Syne', sans-serif;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,244,232,.38);
    margin-bottom: .4rem;
  }

  .cell-value {
    font-size: .82rem;
    font-weight: 500;
    color: #FFF4E8;
    line-height: 1.3;
  }

  /* Journey strip */
  .journey-card {
    border: 1px solid rgba(255,244,232,.08);
    background: rgba(255,244,232,.04);
    border-radius: 1.2rem;
    padding: .9rem;
  }

  .journey-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .5rem;
    margin-bottom: .8rem;
  }

  .journey-label {
    font-family: 'Syne', sans-serif;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,244,232,.38);
    margin-bottom: .2rem;
  }

  .journey-title {
    font-size: .82rem;
    font-weight: 500;
    color: #FFF4E8;
  }

  .journey-badge {
    font-family: 'Syne', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    color: #07070B;
    background: linear-gradient(to right, #FF2DA6, #7C3AED, #FFB703);
    padding: .25rem .65rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .journey-steps {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: .4rem;
  }

  .journey-step {
    border: 1px solid rgba(255,244,232,.08);
    background: rgba(0,0,0,.20);
    border-radius: .75rem;
    padding: .5rem .3rem;
    text-align: center;
  }

  .step-n {
    font-family: 'Syne', sans-serif;
    font-size: .52rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(255,244,232,.35);
    margin-bottom: .2rem;
  }

  .step-name {
    font-size: .66rem;
    font-weight: 500;
    color: #FFF4E8;
    line-height: 1.2;
  }

  /* ── Lower section ────────────────────────────────────── */
  .lower {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  @media (min-width: 900px) {
    .lower {
      grid-template-columns: 0.95fr 1.05fr;
      gap: 2rem;
    }
  }

  .glass-card {
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(0,0,0,.25);
    border-radius: 2rem;
    padding: 1.5rem;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .section-pill {
    display: inline-flex;
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(255,244,232,.05);
    color: rgba(255,244,232,.55);
    font-family: 'Syne', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .22em;
    text-transform: uppercase;
    padding: .3rem .8rem;
    border-radius: 100px;
    margin-bottom: 1.1rem;
  }

  .section-pill-sm {
    font-family: 'Syne', sans-serif;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(255,244,232,.40);
    margin-bottom: .3rem;
  }

  /* Steps list */
  .steps-list { display: grid; gap: .6rem; }

  .step-row {
    display: flex;
    gap: .9rem;
    align-items: flex-start;
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(255,244,232,.04);
    border-radius: 1.4rem;
    padding: .9rem 1rem;
  }

  .step-num-badge {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF2DA6, #7C3AED, #FFB703);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: .78rem;
    font-weight: 700;
    color: #07070B;
  }

  .step-title { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 600; color: #FFF4E8; margin-bottom: .25rem; }
  .step-body  { font-size: .8rem; line-height: 1.55; color: rgba(255,244,232,.60); }

  /* Why section */
  .why-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .75rem;
    margin-bottom: 1.1rem;
  }

  .why-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #FFF4E8;
  }

  .chosen-badge {
    font-family: 'Syne', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #FFD983;
    border: 1px solid rgba(255,183,3,.25);
    background: rgba(255,183,3,.10);
    padding: .3rem .75rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .why-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .75rem;
    margin-bottom: 1.2rem;
  }

  .why-cell {
    border: 1px solid rgba(255,244,232,.10);
    background: rgba(255,244,232,.04);
    border-radius: 1.4rem;
    padding: 1rem;
  }

  .why-cell.wide { grid-column: 1 / -1; }

  .why-cell-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 600; color: #FFF4E8; margin-bottom: .4rem; }
  .why-cell-body  { font-size: .8rem; line-height: 1.6; color: rgba(255,244,232,.60); }

  /* CTA strip */
  .cta-strip {
    border: 1px solid rgba(255,244,232,.10);
    background: linear-gradient(to right, rgba(255,45,166,.10), rgba(124,58,237,.10), rgba(255,183,3,.10));
    border-radius: 1.5rem;
    padding: 1.2rem;
  }

  .cta-strip-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; color: #FFF4E8; margin-bottom: .35rem; }
  .cta-strip-body  { font-size: .82rem; color: rgba(255,244,232,.60); line-height: 1.5; margin-bottom: 1rem; }

  /* ── Footer ──────────────────────────────────────────── */
  .footer {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 2rem 0 1rem;
    font-size: .78rem;
    color: rgba(255,244,232,.35);
  }

  .footer a {
    color: rgba(255,244,232,.45);
    text-decoration: none;
    transition: color .15s;
  }

  .footer a:hover { color: rgba(255,244,232,.80); }

  /* ── Mobile tweaks ──────────────────────────────────── */
  @media (max-width: 480px) {
    .nav-link { display: none; }
    .brand-name { font-size: .82rem; }
    .why-grid { grid-template-columns: 1fr; }
    .journey-steps { grid-template-columns: repeat(5, 1fr); }
    .step-name { font-size: .58rem; }
  }
</style>
