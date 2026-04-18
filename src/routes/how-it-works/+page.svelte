<svelte:head>
  <title>How It Works — Miyagi My Matric</title>
  <meta name="description" content="A guided 5-step system for SA matric learners. Assessment, profile, study plan, timetable, and matched resources — all built around you." />
</svelte:head>

<div class="app">

  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">How It Works</div>
    <h1>A system built around<br><span class="grad-text">you, not a template.</span></h1>
    <p class="sub">Most study advice is generic. This isn't. Every recommendation, timetable, and resource is generated from your actual answers — your subjects, your marks, your goals.</p>
  </header>

  <!-- 5-step journey -->
  <section class="steps-section">
    <div class="section-label">The 5-step journey</div>

    <div class="step-list">

      <div class="step-block">
        <div class="step-aside">
          <div class="step-badge">01</div>
          <div class="step-line"></div>
        </div>
        <div class="step-content">
          <h2>Complete the assessment</h2>
          <p>Answer six sections covering your exam system (IEB or CAPS), subjects and current marks, university and career goals, learning style, study habits, and pressure points. Takes under five minutes. No login required to start.</p>
          <div class="step-tags">
            <span class="tag">IEB + CAPS</span>
            <span class="tag">Grade 10–12</span>
            <span class="tag">Under 5 min</span>
          </div>
          <a href="/assessment" class="step-cta">Start Assessment →</a>
        </div>
      </div>

      <div class="step-block">
        <div class="step-aside">
          <div class="step-badge">02</div>
          <div class="step-line"></div>
        </div>
        <div class="step-content">
          <h2>Unlock your learner profile</h2>
          <p>Your results are calculated immediately. You get a live APS score, a subject priority list ranked by gap size, a learning style classification, and a recommended study approach. Your profile updates every time you update your marks.</p>
          <div class="step-tags">
            <span class="tag">Live APS</span>
            <span class="tag">Subject gaps</span>
            <span class="tag">Learning style</span>
          </div>
        </div>
      </div>

      <div class="step-block">
        <div class="step-aside">
          <div class="step-badge">03</div>
          <div class="step-line"></div>
        </div>
        <div class="step-content">
          <h2>Get your study plan</h2>
          <p>Based on your profile, the platform calculates how many hours per week you need per subject to close your APS gap. High-priority subjects get more time. Low-confidence subjects get foundational tasks first. The plan adapts to your term and exam timeline.</p>
          <div class="step-tags">
            <span class="tag">Weighted by gap</span>
            <span class="tag">Term-aware</span>
            <span class="tag">SBA included</span>
          </div>
        </div>
      </div>

      <div class="step-block">
        <div class="step-aside">
          <div class="step-badge">04</div>
          <div class="step-line"></div>
        </div>
        <div class="step-content">
          <h2>Generate your timetable</h2>
          <p>The study plan becomes a real weekly timetable. Study blocks are distributed across all seven days, weighted by subject priority. Fixed blocks (school, sleep, meals) are placed automatically. You choose between three intensity modes: Default, Stretch, or Optimal.</p>
          <div class="step-tags">
            <span class="tag">3 intensity modes</span>
            <span class="tag">7-day grid</span>
            <span class="tag">Editable</span>
          </div>
          <a href="/timetable" class="step-cta">Build Timetable →</a>
        </div>
      </div>

      <div class="step-block">
        <div class="step-aside">
          <div class="step-badge last">05</div>
        </div>
        <div class="step-content">
          <h2>Use matched resources</h2>
          <p>Resources are filtered to your subjects and exam system. You see the most useful past papers, zero-rated platforms, video channels, and revision tools for your specific situation — not a generic list of everything available.</p>
          <div class="step-tags">
            <span class="tag">IEB + NSC papers</span>
            <span class="tag">Zero-rated</span>
            <span class="tag">By subject</span>
          </div>
          <a href="/resources" class="step-cta">Browse Resources →</a>
        </div>
      </div>

    </div>
  </section>

  <!-- What makes it different -->
  <section class="diff-section">
    <div class="section-label">What makes this different</div>
    <div class="diff-grid">
      <div class="diff-card">
        <div class="diff-title">Built for SA learners</div>
        <p>IEB and CAPS/NSC are both fully supported throughout — exam dates, past papers, marking guidelines, and subject-specific strategies are accurate for both systems.</p>
      </div>
      <div class="diff-card">
        <div class="diff-title">No generic advice</div>
        <p>Every tip, technique, and resource is matched to your profile. A learner with 85% in Mathematics gets different guidance than one at 42%.</p>
      </div>
      <div class="diff-card">
        <div class="diff-title">Works on any device</div>
        <p>Designed for a 375px screen first. Most SA learners access the internet on a smartphone. The whole system works without a data-heavy connection.</p>
      </div>
      <div class="diff-card">
        <div class="diff-title">SBA is treated seriously</div>
        <p>25% of your final mark is SBA. Missing tasks risks a "Not Resulted" outcome. The SBA tracker ensures you never miss a deadline.</p>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq-section">
    <div class="section-label">Common questions</div>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">Do I need to create an account?</div>
        <p class="faq-a">No. The assessment, timetable, and most tools work without any login. Your data saves automatically to this browser. Create an account to sync across devices.</p>
      </div>
      <div class="faq-item">
        <div class="faq-q">Is it free?</div>
        <p class="faq-a">Yes. All core features are free. There are no paywalls on the assessment, timetable, or resources.</p>
      </div>
      <div class="faq-item">
        <div class="faq-q">Does it work for Grade 10 and 11?</div>
        <p class="faq-a">Yes. The assessment and timetable work for Grade 10–12. APS projections are most accurate for Grade 12 learners who have current marks to enter.</p>
      </div>
      <div class="faq-item">
        <div class="faq-q">What if I write IEB?</div>
        <p class="faq-a">IEB is fully supported. Select IEB in the first assessment question and all recommendations, past paper links, and study strategies will be calibrated for IEB.</p>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <div class="cta-block">
    <h2>Ready to build your plan?</h2>
    <p>Complete the assessment. Get your profile. Build your timetable.</p>
    <a href="/assessment" class="btn btn-finish">Start Assessment →</a>
  </div>

</div>

<style>
  .page-header {
    padding: 2.5rem 0 2rem;
    animation: fadeDown .5s ease both;
  }

  .back-link {
    display: inline-block;
    font-size: .8rem;
    color: var(--muted);
    text-decoration: none;
    margin-bottom: 1.2rem;
    transition: color .15s;
    font-family: var(--font-head);
    font-weight: 500;
  }
  .back-link:hover { color: var(--text); }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: .9rem;
    margin-top: .5rem;
  }

  .grad-text {
    background: var(--grad-cta);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sub {
    font-size: .95rem;
    color: var(--muted);
    line-height: 1.75;
    max-width: 560px;
    font-weight: 300;
  }

  /* ── Steps ───────────────────────────────────────── */
  .steps-section { margin-bottom: 3rem; }

  .step-list { display: flex; flex-direction: column; gap: 0; }

  .step-block {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 0 1.2rem;
    animation: fadeUp .4s ease both;
  }

  .step-aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: .2rem;
  }

  .step-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF2DA6, #7C3AED, #FFB703);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-head);
    font-size: .75rem;
    font-weight: 700;
    color: #07070B;
    flex-shrink: 0;
  }

  .step-line {
    flex: 1;
    width: 2px;
    background: var(--border);
    margin: .4rem 0;
    min-height: 1.5rem;
  }

  .step-badge.last { /* no line after last */ }

  .step-content {
    padding: 0 0 2.2rem;
  }

  .step-content h2 {
    font-family: var(--font-head);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: .55rem;
    line-height: 1.3;
  }

  .step-content p {
    font-size: .875rem;
    color: var(--muted);
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: .8rem;
  }

  .step-tags {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem;
    margin-bottom: .8rem;
  }

  .tag {
    font-family: var(--font-head);
    font-size: .65rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--accent2);
    background: rgba(124,58,237,.10);
    border: 1px solid rgba(124,58,237,.20);
    padding: .25rem .65rem;
    border-radius: 100px;
  }

  .step-cta {
    display: inline-block;
    font-family: var(--font-head);
    font-size: .8rem;
    font-weight: 700;
    color: var(--accent);
    text-decoration: none;
    transition: color .15s;
  }
  .step-cta:hover { color: var(--accent3); }

  /* ── What makes it different ──────────────────────── */
  .diff-section { margin-bottom: 3rem; }

  .diff-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .75rem;
  }

  .diff-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.2rem;
  }

  .diff-title {
    font-family: var(--font-head);
    font-size: .85rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: .5rem;
  }

  .diff-card p {
    font-size: .8rem;
    color: var(--muted);
    line-height: 1.65;
    font-weight: 300;
  }

  /* ── FAQ ──────────────────────────────────────────── */
  .faq-section { margin-bottom: 3rem; }

  .faq-list { display: grid; gap: .6rem; }

  .faq-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }

  .faq-q {
    font-family: var(--font-head);
    font-size: .88rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: .5rem;
  }

  .faq-a {
    font-size: .82rem;
    color: var(--muted);
    line-height: 1.65;
    font-weight: 300;
  }

  /* ── CTA ──────────────────────────────────────────── */
  .cta-block {
    text-align: center;
    padding: 2.5rem 1rem;
  }

  .cta-block h2 {
    font-family: var(--font-head);
    font-size: 1.7rem;
    font-weight: 700;
    margin-bottom: .5rem;
  }

  .cta-block p {
    color: var(--muted);
    font-size: .88rem;
    margin-bottom: 1.4rem;
    font-weight: 300;
  }

  /* ── Mobile ───────────────────────────────────────── */
  @media (max-width: 560px) {
    .diff-grid { grid-template-columns: 1fr; }
    .step-block { grid-template-columns: 44px 1fr; gap: 0 .9rem; }
  }
</style>
