<script lang="ts">
  let active = 'recall';

  const TECHNIQUES = [
    { id: 'recall',       label: 'Active Recall',      icon: '🧠' },
    { id: 'spaced',       label: 'Spaced Repetition',  icon: '📅' },
    { id: 'pomodoro',     label: 'Pomodoro',            icon: '⏱️' },
    { id: 'mindmap',      label: 'Mind Mapping',        icon: '🗺️' },
    { id: 'feynman',      label: 'Feynman',             icon: '💬' },
    { id: 'pastpapers',   label: 'Past Papers',         icon: '📝' },
  ];
</script>

<svelte:head>
  <title>Study Techniques — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">Evidence-Based</div>
    <h1>Study Techniques</h1>
    <p class="subtitle">The six methods used by top SA matric students. Each one is backed by research and endorsed by educators.</p>
  </header>

  <!-- Tab bar -->
  <div class="tab-bar">
    {#each TECHNIQUES as t}
      <button
        class="tab-btn"
        class:active={active === t.id}
        on:click={() => active = t.id}
      >
        <span class="tab-icon">{t.icon}</span>
        <span class="tab-label">{t.label}</span>
      </button>
    {/each}
  </div>

  <!-- ── Active Recall ─────────────────────────────────────── -->
  {#if active === 'recall'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">🧠</span>
        <div>
          <h2>Active Recall (Blurting)</h2>
          <p class="hero-sub">The single most effective study method per learning science research. Forces your brain to retrieve — not just re-read.</p>
        </div>
      </div>

      <div class="card">
        <h3>How it works</h3>
        <ol class="step-list">
          <li>Study a section of your notes for <strong>20–30 minutes</strong>. Read actively — underline, highlight, question.</li>
          <li>Close your notes completely. Blank page or whiteboard in front of you.</li>
          <li>Write (or say aloud) <strong>everything you can remember</strong> from that section — no peeking. This is "blurting."</li>
          <li>Open your notes. Identify every gap — what did you forget or get wrong?</li>
          <li>Study <em>only</em> the gaps. Repeat step 2–4 for just those gaps.</li>
        </ol>
      </div>

      <div class="card">
        <h3>Why it works for matric</h3>
        <p>Re-reading creates an illusion of knowing. Active recall forces retrieval practice — the same mental process tested in exams. Every time you retrieve a piece of information, that memory trace strengthens. Struggling to remember is not failure — it is the learning.</p>
        <div class="stat-row">
          <div class="stat-chip"><span class="stat-num">2×</span><span class="stat-text">better retention than re-reading</span></div>
          <div class="stat-chip"><span class="stat-num">50%</span><span class="stat-text">less study time for the same result</span></div>
        </div>
      </div>

      <div class="card">
        <h3>Subject tips</h3>
        <ul class="tip-list">
          <li><strong>Mathematics:</strong> Close your notes and attempt a past question from scratch without hints.</li>
          <li><strong>Life Sciences:</strong> Draw a full labelled diagram from memory — then check.</li>
          <li><strong>History:</strong> Blurt all facts you know about a topic before reading the source.</li>
          <li><strong>Physical Sciences:</strong> Write all formulae and their units from memory before attempting calculations.</li>
          <li><strong>Accounting:</strong> Reconstruct a full financial statement template before filling in numbers.</li>
        </ul>
      </div>

      <div class="caution-card">
        <strong>Avoid:</strong> Using highlighting and re-reading as your main study strategy. It feels productive but produces very little learning. Reserve it for the first pass only.
      </div>
    </div>

  <!-- ── Spaced Repetition ─────────────────────────────────── -->
  {:else if active === 'spaced'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">📅</span>
        <div>
          <h2>Spaced Repetition</h2>
          <p class="hero-sub">Review content at increasing intervals so it moves from short-term to long-term memory permanently.</p>
        </div>
      </div>

      <div class="card">
        <h3>The review schedule</h3>
        <p>After learning something new, review it at these intervals:</p>
        <div class="schedule-grid">
          <div class="schedule-item">
            <span class="schedule-day">Day 1</span>
            <span class="schedule-label">Learn it</span>
          </div>
          <div class="schedule-arrow">→</div>
          <div class="schedule-item">
            <span class="schedule-day">Day 2</span>
            <span class="schedule-label">1st review</span>
          </div>
          <div class="schedule-arrow">→</div>
          <div class="schedule-item">
            <span class="schedule-day">Day 4</span>
            <span class="schedule-label">2nd review</span>
          </div>
          <div class="schedule-arrow">→</div>
          <div class="schedule-item">
            <span class="schedule-day">Day 8</span>
            <span class="schedule-label">3rd review</span>
          </div>
          <div class="schedule-arrow">→</div>
          <div class="schedule-item">
            <span class="schedule-day">Day 22</span>
            <span class="schedule-label">4th review</span>
          </div>
          <div class="schedule-arrow">→</div>
          <div class="schedule-item accent">
            <span class="schedule-day">Exam</span>
            <span class="schedule-label">Permanent</span>
          </div>
        </div>
        <p class="schedule-note">Each review should use <strong>active recall</strong> — not re-reading. The intervals can vary; the key is increasing gap each time.</p>
      </div>

      <div class="card">
        <h3>Tools to use</h3>
        <div class="tool-list">
          <div class="tool-item">
            <div class="tool-name">Anki</div>
            <div class="tool-desc">Free Android app. Uses the SM-2 algorithm to schedule cards automatically. Best for definitions, formulae, dates, vocabulary. Steep learning curve but most powerful.</div>
            <a href="#" class="tool-tag">Free · Android · Offline</a>
          </div>
          <div class="tool-item">
            <div class="tool-name">Quizlet</div>
            <div class="tool-desc">Easier to use than Anki. Free tier includes flashcards and basic learn mode. Many SA matric decks already exist — search "[subject] matric".</div>
            <a href="#" class="tool-tag">Free tier · Web + App</a>
          </div>
          <div class="tool-item">
            <div class="tool-name">Physical flashcards</div>
            <div class="tool-desc">Old school but effective. Write one concept per card. Sort into "know," "unsure," and "no idea" piles. Review the "no idea" pile first, daily.</div>
            <a href="#" class="tool-tag">No data required</a>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>What to put on cards</h3>
        <ul class="tip-list">
          <li>Definitions (one per card)</li>
          <li>Mathematical formulae and their conditions</li>
          <li>Historical dates and events</li>
          <li>Chemical equations and reaction types</li>
          <li>Business Studies legislation (BBBEE, EEA, CPA) clauses</li>
          <li>Geography: water cycle stages, soil types, climate factors</li>
        </ul>
      </div>

      <div class="caution-card">
        <strong>Important:</strong> Start spaced repetition in Term 1 — not Term 3. It only works because of the <em>space</em>. If you start in September, you will not get enough repetitions before October finals.
      </div>
    </div>

  <!-- ── Pomodoro ──────────────────────────────────────────── -->
  {:else if active === 'pomodoro'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">⏱️</span>
        <div>
          <h2>Pomodoro Technique</h2>
          <p class="hero-sub">SA educators recommend 50/10 — not the traditional 25/5 — for the longer, more demanding matric content.</p>
        </div>
      </div>

      <div class="card">
        <h3>The matric format</h3>
        <div class="pomodoro-cycle">
          <div class="pom-block study">
            <span class="pom-time">50 min</span>
            <span class="pom-label">Focused study</span>
            <span class="pom-note">Phone off, door closed</span>
          </div>
          <div class="pom-sep">→</div>
          <div class="pom-block break">
            <span class="pom-time">10 min</span>
            <span class="pom-label">Short break</span>
            <span class="pom-note">Stand up, move, water</span>
          </div>
          <div class="pom-sep">×4</div>
          <div class="pom-block long">
            <span class="pom-time">30 min</span>
            <span class="pom-label">Long break</span>
            <span class="pom-note">After every 4 cycles</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Rules during study blocks</h3>
        <ul class="tip-list">
          <li>Phone in another room or on airplane mode — not face down on desk</li>
          <li>One subject, one task per block. Do not switch mid-block.</li>
          <li>If a random thought appears, write it on a scrap paper ("capture list") and return immediately</li>
          <li>Do not stop early. If you finish the task, review it or start the next question</li>
          <li>During breaks: no social media — it re-engages distraction networks</li>
        </ul>
      </div>

      <div class="card">
        <h3>Planning your day</h3>
        <p>A typical productive matric study day looks like this:</p>
        <div class="day-plan">
          <div class="day-row">
            <span class="day-time">07:00–07:50</span>
            <span class="day-task">Cycle 1 — hardest subject (e.g. Maths)</span>
          </div>
          <div class="day-row break-row">
            <span class="day-time">07:50–08:00</span>
            <span class="day-task muted">Break</span>
          </div>
          <div class="day-row">
            <span class="day-time">08:00–08:50</span>
            <span class="day-task">Cycle 2 — second subject</span>
          </div>
          <div class="day-row break-row">
            <span class="day-time">08:50–09:00</span>
            <span class="day-task muted">Break</span>
          </div>
          <div class="day-row">
            <span class="day-time">09:00–09:50</span>
            <span class="day-task">Cycle 3 — third subject or revision</span>
          </div>
          <div class="day-row break-row">
            <span class="day-time">09:50–10:00</span>
            <span class="day-task muted">Break</span>
          </div>
          <div class="day-row">
            <span class="day-time">10:00–10:50</span>
            <span class="day-task">Cycle 4 — past paper practice</span>
          </div>
          <div class="day-row long-row">
            <span class="day-time">10:50–11:20</span>
            <span class="day-task accent">Long break (30 min) — earned!</span>
          </div>
        </div>
        <p class="schedule-note">4–6 cycles per day is the target during exam prep. That is 3.5–5 hours of genuine focused study.</p>
      </div>

      <div class="cta-card">
        <p>Use the built-in timer to track your sessions and log study time by subject.</p>
        <a href="/pomodoro" class="btn btn-next">Open Pomodoro Timer →</a>
      </div>
    </div>

  <!-- ── Mind Mapping ─────────────────────────────────────── -->
  {:else if active === 'mindmap'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">🗺️</span>
        <div>
          <h2>Mind Mapping</h2>
          <p class="hero-sub">Build a visual map of how concepts connect. Most powerful for content-heavy subjects like Life Sciences and History.</p>
        </div>
      </div>

      <div class="card">
        <h3>The right way to mind map</h3>
        <ol class="step-list">
          <li><strong>From memory first.</strong> Put the topic in the centre. Branch out everything you already know — before opening your notes. This is the active recall step.</li>
          <li><strong>Check and fill gaps.</strong> Open your notes. Add what you missed in a different colour. Those additions are your actual learning gaps.</li>
          <li><strong>Connect branches.</strong> Draw lines between related concepts across branches. These cross-connections are high-value exam knowledge.</li>
          <li><strong>Reduce.</strong> Your final map should fit on one A4 page. If it doesn't, you're including too much detail — condense to principles, not facts.</li>
          <li><strong>Redraw from memory.</strong> 2 days later, try to redraw the entire map without looking. This is your review.</li>
        </ol>
      </div>

      <div class="card">
        <h3>Best subjects for mind maps</h3>
        <div class="subject-grid">
          <div class="subject-chip high">Life Sciences ★★★</div>
          <div class="subject-chip high">History ★★★</div>
          <div class="subject-chip mid">Geography ★★</div>
          <div class="subject-chip mid">Business Studies ★★</div>
          <div class="subject-chip mid">English Literature ★★</div>
          <div class="subject-chip low">Economics ★</div>
        </div>
        <p class="schedule-note">Not ideal for Mathematics, Accounting, or Physical Sciences — those require procedural practice, not concept mapping.</p>
      </div>

      <div class="card">
        <h3>Life Sciences example structure</h3>
        <div class="mm-example">
          <div class="mm-centre">Photosynthesis</div>
          <div class="mm-branches">
            <div class="mm-branch">
              <span class="mm-main">Light reactions</span>
              <span class="mm-sub">→ Thylakoid membrane</span>
              <span class="mm-sub">→ ATP + NADPH produced</span>
              <span class="mm-sub">→ Water split (photolysis)</span>
            </div>
            <div class="mm-branch">
              <span class="mm-main">Calvin cycle</span>
              <span class="mm-sub">→ Stroma</span>
              <span class="mm-sub">→ CO₂ fixed</span>
              <span class="mm-sub">→ Glucose produced</span>
            </div>
            <div class="mm-branch">
              <span class="mm-main">Factors affecting rate</span>
              <span class="mm-sub">→ Light intensity</span>
              <span class="mm-sub">→ CO₂ concentration</span>
              <span class="mm-sub">→ Temperature</span>
            </div>
          </div>
        </div>
      </div>

      <div class="caution-card">
        <strong>Avoid:</strong> Drawing mind maps directly from your notes. This is just copying, not learning. Always start from memory — the struggle is the point.
      </div>
    </div>

  <!-- ── Feynman ───────────────────────────────────────────── -->
  {:else if active === 'feynman'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">💬</span>
        <div>
          <h2>Feynman Technique</h2>
          <p class="hero-sub">Named after physicist Richard Feynman. If you cannot explain it simply, you do not understand it. Stumbling reveals your real gaps.</p>
        </div>
      </div>

      <div class="card">
        <h3>The four steps</h3>
        <ol class="step-list">
          <li><strong>Choose a concept.</strong> Write it at the top of a blank page. Example: "How does natural selection work?"</li>
          <li><strong>Explain it in plain English</strong> — as if you are teaching it to a Grade 8 learner who has never heard of it. No jargon allowed. No formulae without explanation.</li>
          <li><strong>Find where you stumble.</strong> Every time you hesitate, use a vague word, or write "etc." — that is a gap. Circle it. These are exactly the concepts the examiner will test.</li>
          <li><strong>Go back and learn the gaps.</strong> Return to your notes or textbook, study only that gap, then retry step 2.</li>
        </ol>
      </div>

      <div class="card">
        <h3>What good vs bad Feynman looks like</h3>
        <div class="compare-grid">
          <div class="compare-col bad">
            <div class="compare-label danger">Weak explanation</div>
            <p>"Natural selection is when organisms adapt to their environment over time through genetic changes and stuff, and the stronger ones survive…"</p>
            <p class="compare-flag">⚠️ "adapt," "stuff," "stronger" are vague. This student cannot answer an analysis question.</p>
          </div>
          <div class="compare-col good">
            <div class="compare-label good-label">Strong explanation</div>
            <p>"Within a population, individuals have random genetic variations. Some variations make survival or reproduction more likely in that specific environment. Those individuals have more offspring. Over generations, the useful variation becomes more common in the population."</p>
            <p class="compare-flag success">✓ Precise. No vague language. Ready for IEB source-analysis questions.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Best uses per subject</h3>
        <ul class="tip-list">
          <li><strong>Physical Sciences:</strong> Explain Newton's third law without saying "equal and opposite." Explain what current is without saying "flow of electrons."</li>
          <li><strong>Life Sciences:</strong> Explain the difference between mitosis and meiosis to someone who has never heard of cells.</li>
          <li><strong>History:</strong> Explain what caused World War 1 to someone who only knows it involved countries fighting.</li>
          <li><strong>Economics:</strong> Explain inflation without using the word "prices" or "money."</li>
          <li><strong>Business Studies:</strong> Explain what BBBEE is to a small business owner who has never heard of it.</li>
        </ul>
      </div>

      <div class="caution-card">
        <strong>The Feynman test:</strong> If you need more than 3 sentences to explain one concept, you are overcomplicating it or hiding a gap behind words. Keep simplifying.
      </div>
    </div>

  <!-- ── Past Papers ──────────────────────────────────────── -->
  {:else if active === 'pastpapers'}
    <div class="technique-wrap">
      <div class="technique-hero">
        <span class="hero-icon">📝</span>
        <div>
          <h2>Past Papers</h2>
          <p class="hero-sub">The single most effective tool per every SA educator surveyed. Not just for practice — for diagnosis and exam strategy.</p>
        </div>
      </div>

      <div class="card">
        <h3>How to use past papers correctly</h3>
        <ol class="step-list">
          <li><strong>Full exam conditions first.</strong> Complete the paper in the exact time allowed, without notes. Treat it like the real thing. Do not stop early.</li>
          <li><strong>Mark strictly.</strong> Use the official memorandum. Do not give yourself benefit-of-the-doubt marks. Circle every question you got wrong or skipped.</li>
          <li><strong>Diagnose, not just score.</strong> For every wrong answer, identify the root cause: Did you not know the concept? Misread the question? Make an arithmetic error? Run out of time? Different root causes require different fixes.</li>
          <li><strong>Targeted revision.</strong> Study only the concepts you got wrong. Do not redo work you already know — this is time wasted.</li>
          <li><strong>Retry just the wrong questions</strong> — blind, without notes — 2 days later.</li>
        </ol>
      </div>

      <div class="card">
        <h3>How many papers to do</h3>
        <div class="paper-targets">
          <div class="paper-row">
            <span class="paper-subject">Mathematics</span>
            <span class="paper-count">10+ papers per paper (P1 + P2 separately)</span>
          </div>
          <div class="paper-row">
            <span class="paper-subject">Physical Sciences</span>
            <span class="paper-count">8+ papers per paper (Physics + Chemistry)</span>
          </div>
          <div class="paper-row">
            <span class="paper-subject">Life Sciences</span>
            <span class="paper-count">6+ per paper — focus on IEB source questions</span>
          </div>
          <div class="paper-row">
            <span class="paper-subject">Accounting</span>
            <span class="paper-count">8+ — until financial statements are automatic</span>
          </div>
          <div class="paper-row">
            <span class="paper-subject">History</span>
            <span class="paper-count">6+ — practise PEEL essays separately</span>
          </div>
          <div class="paper-row">
            <span class="paper-subject">English</span>
            <span class="paper-count">6+ Paper 3 — one timed essay per week</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Where to find past papers</h3>
        <div class="resource-list">
          <div class="resource-item">
            <div class="resource-name">DBE Website</div>
            <div class="resource-desc">education.gov.za — all NSC papers 2016+ with memorandums. Official source.</div>
            <span class="resource-tag free">Free · Zero-rated MTN/Vodacom</span>
          </div>
          <div class="resource-item">
            <div class="resource-name">SA Exam Papers</div>
            <div class="resource-desc">saexampapers.co.za — largest collection. 2008+. Includes provincial and IEB papers.</div>
            <span class="resource-tag free">Free</span>
          </div>
          <div class="resource-item">
            <div class="resource-name">IEB Past Papers</div>
            <div class="resource-desc">ieb.co.za — last 5 years of IEB papers free. Older papers available for purchase.</div>
            <span class="resource-tag free">Free (last 5 years)</span>
          </div>
          <div class="resource-item">
            <div class="resource-name">Matric Exam Papers App</div>
            <div class="resource-desc">40+ subjects, 2008+. Both DBE and IEB. Works offline after download.</div>
            <span class="resource-tag free">Free · Android</span>
          </div>
        </div>
      </div>

      <div class="caution-card">
        <strong>Do not:</strong> Read through a past paper and think "I could answer this." That is illusion of competence. Write your answers fully under timed conditions. Only then will you know what you actually know.
      </div>
    </div>
  {/if}
</div>

<style>
  .app { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; z-index: 1; }

  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }
  .badge { display: inline-block; background: rgba(246,201,14,.12); color: var(--accent); border: 1px solid rgba(246,201,14,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto; }

  /* Tab bar */
  .tab-bar { display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.5rem; scrollbar-width: none; animation: fadeUp 0.4s ease both; }
  .tab-bar::-webkit-scrollbar { display: none; }

  .tab-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-family: var(--font-head); font-size: 0.78rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
  .tab-btn:hover { border-color: var(--accent); color: var(--text); }
  .tab-btn.active { background: rgba(246,201,14,.12); border-color: rgba(246,201,14,.4); color: var(--accent); }
  .tab-icon { font-size: 1rem; }
  .tab-label { }

  /* Technique wrap */
  .technique-wrap { display: flex; flex-direction: column; gap: 1rem; animation: fadeUp 0.3s ease both; }

  .technique-hero { display: flex; align-items: flex-start; gap: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; }
  .hero-icon { font-size: 2.5rem; flex-shrink: 0; }
  .technique-hero h2 { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--accent); margin: 0 0 0.35rem; }
  .hero-sub { color: var(--muted); font-size: 0.875rem; margin: 0; line-height: 1.5; }

  /* Card */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; }
  .card h3 { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; color: var(--text); margin: 0 0 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .card p { color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin: 0 0 0.75rem; }
  .card p:last-child { margin-bottom: 0; }

  /* Lists */
  .step-list, .tip-list { padding-left: 1.25rem; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
  .step-list li, .tip-list li { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }
  .step-list li strong, .tip-list li strong { color: var(--text); }

  /* Stats */
  .stat-row { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
  .stat-chip { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; flex: 1; min-width: 120px; }
  .stat-num { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-text { font-size: 0.72rem; color: var(--muted); }

  /* Spaced repetition schedule */
  .schedule-grid { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin: 0.75rem 0; }
  .schedule-item { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 0.75rem; text-align: center; display: flex; flex-direction: column; gap: 0.15rem; }
  .schedule-item.accent { border-color: rgba(246,201,14,.4); background: rgba(246,201,14,.08); }
  .schedule-day { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--accent); }
  .schedule-label { font-size: 0.65rem; color: var(--muted); }
  .schedule-arrow { color: var(--muted); font-size: 0.875rem; }
  .schedule-note { font-size: 0.8rem; color: var(--muted); margin-top: 0.75rem !important; }

  /* Tools */
  .tool-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .tool-item { background: var(--surface2); border-radius: 10px; padding: 0.85rem 1rem; }
  .tool-name { font-family: var(--font-head); font-size: 0.875rem; font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
  .tool-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.5rem; }
  .tool-tag { font-size: 0.68rem; background: rgba(56,189,248,.1); color: var(--accent2); border-radius: 999px; padding: 0.2rem 0.6rem; text-decoration: none; }

  /* Pomodoro cycle */
  .pomodoro-cycle { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 0.5rem 0; }
  .pom-block { border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0.2rem; min-width: 100px; flex: 1; }
  .pom-block.study { background: rgba(246,201,14,.1); border: 1px solid rgba(246,201,14,.25); }
  .pom-block.break { background: rgba(56,189,248,.1); border: 1px solid rgba(56,189,248,.25); }
  .pom-block.long { background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.25); }
  .pom-time { font-family: var(--font-head); font-size: 1.2rem; font-weight: 800; color: var(--text); }
  .pom-label { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text); }
  .pom-note { font-size: 0.7rem; color: var(--muted); }
  .pom-sep { color: var(--muted); font-size: 0.875rem; font-weight: 700; }

  /* Day plan */
  .day-plan { display: flex; flex-direction: column; gap: 0.2rem; margin: 0.75rem 0; }
  .day-row { display: flex; gap: 1rem; padding: 0.4rem 0.6rem; background: var(--surface2); border-radius: 6px; font-size: 0.8rem; }
  .day-row.break-row { background: rgba(56,189,248,.05); }
  .day-row.long-row { background: rgba(74,222,128,.08); }
  .day-time { color: var(--muted); white-space: nowrap; font-family: var(--font-head); font-size: 0.72rem; min-width: 100px; }
  .day-task { color: var(--text); }
  .day-task.muted { color: var(--muted); }
  .day-task.accent { color: var(--accent3); font-weight: 600; }

  /* Mind map */
  .subject-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0 0.75rem; }
  .subject-chip { padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-family: var(--font-head); font-weight: 600; }
  .subject-chip.high { background: rgba(74,222,128,.12); border: 1px solid rgba(74,222,128,.3); color: var(--accent3); }
  .subject-chip.mid { background: rgba(246,201,14,.08); border: 1px solid rgba(246,201,14,.25); color: var(--accent); }
  .subject-chip.low { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }

  .mm-example { background: var(--surface2); border-radius: 10px; padding: 1rem; margin-top: 0.5rem; }
  .mm-centre { font-family: var(--font-head); font-weight: 800; color: var(--accent); font-size: 1rem; text-align: center; margin-bottom: 1rem; }
  .mm-branches { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
  .mm-branch { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .mm-main { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text); }
  .mm-sub { font-size: 0.7rem; color: var(--muted); }

  /* Compare grid */
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
  .compare-col { background: var(--surface2); border-radius: 10px; padding: 1rem; }
  .compare-col.bad { border-top: 2px solid var(--danger); }
  .compare-col.good { border-top: 2px solid var(--accent3); }
  .compare-label { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .compare-label.danger { color: var(--danger); }
  .compare-label.good-label { color: var(--accent3); }
  .compare-col p { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin: 0 0 0.5rem; }
  .compare-flag { font-size: 0.75rem !important; }
  .compare-flag.success { color: var(--accent3) !important; }

  /* Past papers */
  .paper-targets { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.5rem; }
  .paper-row { display: flex; gap: 1rem; align-items: baseline; padding: 0.5rem 0.75rem; background: var(--surface2); border-radius: 8px; }
  .paper-subject { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text); min-width: 140px; }
  .paper-count { font-size: 0.8rem; color: var(--muted); }

  .resource-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }
  .resource-item { background: var(--surface2); border-radius: 10px; padding: 0.85rem 1rem; }
  .resource-name { font-family: var(--font-head); font-size: 0.875rem; font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
  .resource-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.5rem; }
  .resource-tag { display: inline-block; font-size: 0.68rem; border-radius: 999px; padding: 0.2rem 0.6rem; }
  .resource-tag.free { background: rgba(74,222,128,.1); color: var(--accent3); }

  /* Caution + CTA */
  .caution-card { background: rgba(248,113,113,.07); border: 1px solid rgba(248,113,113,.2); border-radius: 12px; padding: 1rem 1.25rem; font-size: 0.875rem; color: var(--muted); line-height: 1.6; }
  .caution-card strong { color: var(--danger); }

  .cta-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; text-align: center; }
  .cta-card p { color: var(--muted); font-size: 0.875rem; margin: 0 0 1rem; }
  .btn { display: inline-block; font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.7rem 1.5rem; cursor: pointer; font-size: 0.875rem; text-decoration: none; transition: opacity 0.2s, transform 0.15s; }
  .btn:hover { transform: translateY(-1px); }
  .btn-next { background: var(--accent); color: #0d1117; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 600px) {
    .compare-grid { grid-template-columns: 1fr; }
    .schedule-grid { gap: 0.3rem; }
    .schedule-arrow { display: none; }
    .tab-label { display: none; }
    .tab-btn { padding: 0.5rem 0.75rem; }
    .paper-subject { min-width: 100px; }
    .paper-row { flex-direction: column; gap: 0.2rem; }
  }
</style>
