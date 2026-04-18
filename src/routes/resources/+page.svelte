<script lang="ts">
  import { onMount } from 'svelte';

  type Category = 'zero_rated' | 'past_papers' | 'video' | 'tools' | 'mental_health';

  let active = 'zero_rated';
  let examSystem: 'ieb' | 'caps' | 'unsure' = 'unsure';

  const CATEGORIES = [
    { id: 'zero_rated',    label: 'Zero-Rated',       icon: '📶' },
    { id: 'past_papers',   label: 'Past Papers',       icon: '📄' },
    { id: 'video',         label: 'Video Lessons',     icon: '▶️' },
    { id: 'tools',         label: 'Study Tools',       icon: '🛠️' },
    { id: 'mental_health', label: 'Mental Health',     icon: '💚' },
  ];

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const sys = state?.answers?.exam_system;
        if (sys === 'ieb' || sys === 'caps') examSystem = sys;
      }
    } catch {}
  });
</script>

<svelte:head>
  <title>Study Resources — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">Free SA Resources</div>
    <h1>Study Resources</h1>
    <p class="subtitle">The best free tools for SA matric learners. All vetted. Zero-rated platforms are free to access on MTN and Vodacom.</p>
    {#if examSystem === 'ieb'}
      <div class="curriculum-banner ieb">📋 Showing resources for <strong>IEB learners</strong> — based on your assessment. IEB papers differ significantly from CAPS. Use IEB-specific resources.</div>
    {:else if examSystem === 'caps'}
      <div class="curriculum-banner caps">📋 Showing resources for <strong>CAPS / NSC learners</strong> — based on your assessment. Focus on DBE papers, not IEB papers.</div>
    {:else}
      <div class="curriculum-banner unsure">⚠️ Your exam system is not set. <a href="/assessment" class="banner-link">Complete your assessment</a> to see curriculum-specific resources.</div>
    {/if}
  </header>

  <!-- Tab bar -->
  <div class="tab-bar">
    {#each CATEGORIES as c}
      <button
        class="tab-btn"
        class:active={active === c.id}
        on:click={() => { active = c.id; }}
      >
        <span class="tab-icon">{c.icon}</span>
        <span class="tab-label">{c.label}</span>
      </button>
    {/each}
  </div>

  <!-- ── Zero-Rated ─────────────────────────────────────────── -->
  {#if active === 'zero_rated'}
    <div class="section-wrap">
      <div class="section-intro">
        <h2>Zero-Rated Platforms</h2>
        <p>These sites cost <strong>no data</strong> to access on MTN, Vodacom, and Telkom. If you are on a different network or outside SA, normal data rates apply.</p>
      </div>

      <div class="resource-card featured">
        <div class="resource-header">
          <div>
            <div class="resource-name">Siyavula</div>
            <div class="resource-url">siyavula.com</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip zero">Zero-rated</span>
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">Adaptive Maths and Physical Sciences practice for Grade 10–12. Unlimited questions with instant feedback. The system tracks which concepts you have mastered and which need work. This is the closest thing SA learners have to a personal tutor for these two subjects.</p>
        <div class="subject-tags">
          <span class="stag">Mathematics</span>
          <span class="stag">Mathematical Literacy</span>
          <span class="stag">Physical Sciences</span>
        </div>
        <p class="resource-tip">💡 Use Siyavula for daily practice. Spend 30 minutes per subject per day on concepts you are struggling with. The adaptive system will show you more of what you need.</p>
      </div>

      <div class="resource-card featured">
        <div class="resource-header">
          <div>
            <div class="resource-name">DBE Website</div>
            <div class="resource-url">education.gov.za</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip zero">Zero-rated</span>
            <span class="badge-chip free">Free</span>
            <span class="badge-chip official">Official</span>
          </div>
        </div>
        <p class="resource-desc">All NSC past papers (2016+) with official memorandums. Also hosts the Mind the Gap study guides — free, government-produced study guides in plain English for the highest-weight matric subjects.</p>
        <div class="subject-tags">
          <span class="stag">All NSC subjects</span>
          <span class="stag">Mind the Gap guides</span>
          <span class="stag">2016–2024 papers</span>
        </div>
        <p class="resource-tip">💡 Download the Mind the Gap guides for your subjects. They are free, curriculum-aligned, and written in simple language. Many learners do not know they exist.</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Mindset Learn</div>
            <div class="resource-url">mindset.co.za</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">Video lessons across all major matric subjects. Produced with DHET support and curriculum-aligned. Available on YouTube and via the Vodacom Digital Classroom network.</p>
      </div>
    </div>

  <!-- ── Past Papers ─────────────────────────────────────────── -->
  {:else if active === 'past_papers'}
    <div class="section-wrap">
      <div class="section-intro">
        <h2>Past Papers</h2>
        <p>Past papers are the single most effective study tool. Do them under exam conditions, then mark and diagnose — do not just read through them.</p>
      </div>

      {#if examSystem === 'ieb'}
        <!-- IEB LEARNERS -->
        <div class="curriculum-alert ieb">
          <strong>You write IEB.</strong> Use IEB papers only — CAPS/DBE papers have a different structure, different question styles, and different mark allocations. Practising CAPS papers as an IEB learner will give you false confidence and teach you the wrong approach.
        </div>

        <div class="resource-card featured">
          <div class="resource-header">
            <div>
              <div class="resource-name">IEB Past Papers — Official</div>
              <div class="resource-url">ieb.co.za/assessment/high-schools/nsc-past-papers</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip free">Last 5 years free</span>
              <span class="badge-chip official">IEB Official ✓</span>
            </div>
          </div>
          <p class="resource-desc">The official source for IEB papers. Last 5 years available free. These are the exact papers you will write — use these first and always.</p>
          <p class="resource-tip">💡 IEB papers require analysis, evaluation, and opinion — not just recall. When practising, write full sentences and justify every answer, even when the question looks simple.</p>
        </div>

        <div class="resource-card featured">
          <div class="resource-header">
            <div>
              <div class="resource-name">SA Exam Papers — IEB Section</div>
              <div class="resource-url">saexampapers.co.za</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip free">Free</span>
              <span class="badge-chip best">Papers from 2008</span>
            </div>
          </div>
          <p class="resource-desc">Largest IEB paper archive — 2008 to present. Filter by IEB specifically. Includes memos. Use this for older papers once you've exhausted the official IEB site.</p>
        </div>

        <div class="resource-card">
          <div class="resource-header">
            <div>
              <div class="resource-name">CAPS / DBE Papers — Stretch Practice Only</div>
              <div class="resource-url">education.gov.za</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip zero">Zero-rated</span>
              <span class="badge-chip caution">⚠️ Not your curriculum</span>
            </div>
          </div>
          <p class="resource-desc">CAPS papers are structurally different from IEB. Only use them if you have exhausted IEB papers and want additional calculation or factual recall practice — never for essay or analysis questions.</p>
        </div>

      {:else}
        <!-- CAPS / NSC LEARNERS (default) -->
        {#if examSystem === 'caps'}
        <div class="curriculum-alert caps">
          <strong>You write CAPS / NSC.</strong> Focus on DBE papers. IEB papers have different question styles — practising them can teach you the wrong approach for your exam.
        </div>
        {/if}

        <div class="resource-card featured">
          <div class="resource-header">
            <div>
              <div class="resource-name">DBE Past Papers — Official</div>
              <div class="resource-url">education.gov.za</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip zero">Zero-rated</span>
              <span class="badge-chip official">Official NSC ✓</span>
            </div>
          </div>
          <p class="resource-desc">Official NSC papers with official memorandums. 2016–2024. These are the exact papers you will write. The most reliable source — original files, not scans. Includes November finals and supplementary exams.</p>
          <p class="resource-tip">💡 Download the last 5 years for each of your subjects. Work through them from oldest to newest — this shows you how question styles evolve and what repeats.</p>
        </div>

        <div class="resource-card featured">
          <div class="resource-header">
            <div>
              <div class="resource-name">SA Exam Papers — NSC Section</div>
              <div class="resource-url">saexampapers.co.za</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip free">Free</span>
              <span class="badge-chip best">Papers from 2008</span>
            </div>
          </div>
          <p class="resource-desc">Largest NSC paper archive — 2008 to present. Also includes provincial papers (Eastern Cape, Western Cape, etc.) which are useful for additional practice. Always use DBE papers first.</p>
        </div>

        <div class="resource-card">
          <div class="resource-header">
            <div>
              <div class="resource-name">IEB Papers — Stretch Practice Only</div>
              <div class="resource-url">ieb.co.za/assessment/high-schools/nsc-past-papers</div>
            </div>
            <div class="badges-wrap">
              <span class="badge-chip caution">⚠️ Not your curriculum</span>
            </div>
          </div>
          <p class="resource-desc">IEB papers are harder and structured differently. Only use them if you are aiming for 80%+ and have finished all available CAPS papers. Good for stretch practice on calculation and factual subjects — not for essay technique.</p>
        </div>
      {/if}

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Matric Exam Papers App</div>
            <div class="resource-url">Android — free download</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">Mobile app with DBE + IEB papers from 2008+. 40+ subjects. Papers download for offline use — ideal for learners without reliable data. Filter by your exam system when downloading.</p>
      </div>

      <div class="info-card">
        <h3>How to use past papers correctly</h3>
        <ol class="step-list">
          <li>Complete under timed, exam conditions — no notes, no phone</li>
          <li>Mark strictly using the official memo for <strong>your exam system</strong></li>
          <li>Identify root cause of every error (concept gap vs time vs careless)</li>
          <li>Revise only the concepts you got wrong</li>
          <li>Retry those questions blind, 2 days later</li>
        </ol>
        <p class="info-note">See the <a href="/techniques" class="inline-link">Study Techniques</a> page for the full past papers method.</p>
      </div>
    </div>

  <!-- ── Video Lessons ────────────────────────────────────────── -->
  {:else if active === 'video'}
    <div class="section-wrap">
      <div class="section-intro">
        <h2>Video Lessons</h2>
        <p>When a concept is not clicking from your notes or textbook, a good video explanation can unlock it in minutes. Use these to supplement — not replace — active recall practice.</p>
      </div>

      <div class="resource-card featured">
        <div class="resource-header">
          <div>
            <div class="resource-name">Kevinmathscience</div>
            <div class="resource-url">YouTube · @kevinmathscience</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
            <span class="badge-chip best">~1M subscribers</span>
          </div>
        </div>
        <p class="resource-desc">The go-to YouTube channel for SA matric Maths and Physical Sciences. Kevin Wee covers the full CAPS and IEB curriculum, topic by topic. Explanations are clear, step-by-step, and SA curriculum specific. His Euclidean Geometry series alone has saved thousands of learners.</p>
        <div class="subject-tags">
          <span class="stag">Mathematics</span>
          <span class="stag">Physical Sciences</span>
          <span class="stag">CAPS + IEB</span>
        </div>
        <p class="resource-tip">💡 Search "kevinmathscience [topic]" to find the exact lesson you need. Start with topics where you scored below 50% in tests.</p>
      </div>

      <div class="resource-card featured">
        <div class="resource-header">
          <div>
            <div class="resource-name">Mindset Learn</div>
            <div class="resource-url">YouTube · mindsetlearn.com</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
            <span class="badge-chip zero">Vodacom Digital Classroom</span>
          </div>
        </div>
        <p class="resource-desc">Covers all major matric subjects, not just Maths and Science. Produced with DHET support. Video lessons are curriculum-aligned and exam-focused. Available via Vodacom Digital Classroom network (zero-rated).</p>
        <div class="subject-tags">
          <span class="stag">All major subjects</span>
          <span class="stag">Life Sciences</span>
          <span class="stag">Accounting</span>
          <span class="stag">History</span>
        </div>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Matric Live</div>
            <div class="resource-url">matriclive.com · Android app</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
            <span class="badge-chip best">FNB App of the Year 2024</span>
          </div>
        </div>
        <p class="resource-desc">Video lessons, AI chat tutor, and mock exams. Covers multiple subjects. Built specifically for SA matric. Offline capability — download videos while on Wi-Fi, watch anywhere.</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Maski</div>
            <div class="resource-url">WhatsApp-based AI tutor</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">WhatsApp-based AI tutor. Ask questions in plain language and get explanations, worked examples, and tips. 100,000+ users within 6 months of its March 2025 launch. No app download required — works via your existing WhatsApp.</p>
        <p class="resource-tip">💡 Maski is great for quick concept checks between study sessions. Ask "explain [concept] simply" or "give me a practice question on [topic]."</p>
      </div>

      <div class="caution-card">
        <strong>Warning:</strong> Watching videos is passive learning. It creates an illusion of understanding without actual retention. After every video, close it and blurt back everything you just learned before moving on.
      </div>
    </div>

  <!-- ── Study Tools ──────────────────────────────────────────── -->
  {:else if active === 'tools'}
    <div class="section-wrap">
      <div class="section-intro">
        <h2>Study Tools</h2>
        <p>The right tools reduce friction and help you stick to your system. Keep it simple — one tool per job.</p>
      </div>

      <div class="info-card built-in">
        <h3>Built into this app</h3>
        <div class="builtin-list">
          <a href="/timetable" class="builtin-item">
            <span class="builtin-icon">📅</span>
            <div>
              <div class="builtin-name">Study Timetable</div>
              <div class="builtin-desc">Plan your week across all subjects. Colour-coded by session type.</div>
            </div>
          </a>
          <a href="/pomodoro" class="builtin-item">
            <span class="builtin-icon">⏱️</span>
            <div>
              <div class="builtin-name">Pomodoro Timer</div>
              <div class="builtin-desc">50/10 format. Logs sessions by subject. Tracks today's study time.</div>
            </div>
          </a>
          <a href="/sba" class="builtin-item">
            <span class="builtin-icon">✅</span>
            <div>
              <div class="builtin-name">SBA Task Tracker</div>
              <div class="builtin-desc">Track all SBA tasks with deadlines, urgency alerts, and status.</div>
            </div>
          </a>
          <a href="/marks" class="builtin-item">
            <span class="builtin-icon">📊</span>
            <div>
              <div class="builtin-name">Marks Tracker</div>
              <div class="builtin-desc">Log marks. Live APS calculation. Subject overview and gaps.</div>
            </div>
          </a>
          <a href="/assessment" class="builtin-item">
            <span class="builtin-icon">🎯</span>
            <div>
              <div class="builtin-name">Self-Assessment</div>
              <div class="builtin-desc">Find your APS, target university, and personalised action plan.</div>
            </div>
          </a>
        </div>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Anki</div>
            <div class="resource-url">apps.ankiweb.net · Free Android</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
            <span class="badge-chip best">Best flashcard app</span>
          </div>
        </div>
        <p class="resource-desc">Spaced repetition flashcards using the SM-2 algorithm. It automatically schedules when to show each card based on how well you remembered it. Best for definitions, formulae, dates, vocabulary. Steep initial setup but enormous long-term payoff.</p>
        <p class="resource-tip">💡 Search AnkiWeb for shared decks: "matric life sciences," "matric accounting," etc. You can use community decks or build your own — building your own is better (the act of creating cards is itself study).</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Quizlet</div>
            <div class="resource-url">quizlet.com · Free tier</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free tier</span>
          </div>
        </div>
        <p class="resource-desc">Easier to use than Anki. Free tier includes flashcards, learn mode, and basic spaced repetition. Many SA matric decks already exist — search "[subject] matric CAPS." Works on web and app.</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Google Calendar</div>
            <div class="resource-url">calendar.google.com · Free</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">Use Google Calendar to block out study sessions and SBA deadlines. Colour-code by subject. Set reminders 3 days before SBA due dates. Share your timetable with your family so they know your schedule.</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">Notion</div>
            <div class="resource-url">notion.com · Free personal tier</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free personal</span>
          </div>
        </div>
        <p class="resource-desc">Build subject wikis, track SBA tasks, and organise notes. Notion's free personal tier is generous. Templates for students available — search "matric study tracker" in Notion templates.</p>
      </div>
    </div>

  <!-- ── Mental Health ────────────────────────────────────────── -->
  {:else if active === 'mental_health'}
    <div class="section-wrap">
      <div class="section-intro">
        <h2>Mental Health & Wellbeing</h2>
        <p>Matric is genuinely stressful. Managing your mental health is not separate from studying — it <em>is</em> studying. A burnt-out learner learns nothing.</p>
      </div>

      <div class="resource-card featured">
        <div class="resource-header">
          <div>
            <div class="resource-name">SADAG</div>
            <div class="resource-url">sadag.org</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
            <span class="badge-chip official">24/7 Helpline</span>
          </div>
        </div>
        <p class="resource-desc">South African Depression and Anxiety Group. The primary mental health support organisation in SA. Helpline available 24 hours a day, 7 days a week.</p>
        <div class="hotline-card">
          <div class="hotline-num">0800 456 789</div>
          <div class="hotline-label">Free · 24/7 · Confidential</div>
        </div>
        <p class="resource-tip">💡 You do not have to be in crisis to call. If you are feeling overwhelmed, anxious, or unable to cope with exam pressure, this service exists for exactly that. There is no shame in asking for support.</p>
      </div>

      <div class="resource-card">
        <div class="resource-header">
          <div>
            <div class="resource-name">AVBOB Step 12</div>
            <div class="resource-url">avbob.co.za</div>
          </div>
          <div class="badges-wrap">
            <span class="badge-chip free">Free</span>
          </div>
        </div>
        <p class="resource-desc">Free CAPS study guides in all 11 official South African languages. A rare resource that makes high-quality study material accessible to learners who study in their home language.</p>
      </div>

      <div class="info-card">
        <h3>Signs you need a break — not more study</h3>
        <ul class="tip-list">
          <li>You have been studying for hours but cannot remember what you read 30 minutes ago</li>
          <li>You feel physically tense, your shoulders are up near your ears</li>
          <li>You are re-reading the same paragraph without understanding it</li>
          <li>Small things are making you disproportionately angry or upset</li>
          <li>You are avoiding starting because even opening your notes feels impossible</li>
        </ul>
        <p class="info-note" style="margin-top: 0.75rem;">Any of these signals means your brain is saturated. A 30-minute walk, a meal, or 8 hours of sleep will produce more learning than continuing to sit at your desk.</p>
      </div>

      <div class="info-card">
        <h3>Sleep and exam performance</h3>
        <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin: 0 0 0.5rem;">Memory consolidation — the process that moves information from short-term to long-term storage — happens during sleep. Sleeping 7–9 hours the night after studying is literally part of the learning process. Cramming all night before an exam and sleeping 3 hours is self-sabotage.</p>
        <div class="sleep-rule">
          <strong>The rule:</strong> Finish studying by 21:00. In bed by 22:00. Exam day will look after itself.
        </div>
      </div>

      <div class="info-card">
        <h3>Exam anxiety — what actually helps</h3>
        <ol class="step-list">
          <li><strong>Preparation is the antidote.</strong> Anxiety is highest when you feel underprepared. Past papers and consistent study are the only long-term fix.</li>
          <li><strong>Breathing before entering the hall.</strong> 4 counts in, hold 4, out 4. This activates your parasympathetic nervous system and reduces cortisol.</li>
          <li><strong>Read the whole paper first</strong> before answering. Identify easy questions. Start there — build confidence before tackling hard questions.</li>
          <li><strong>Time management.</strong> Know your marks per minute (150 marks / 150 mins = 1 mark per minute for Maths). Do not spend 20 minutes on a 2-mark question.</li>
          <li><strong>Leave gaps, come back.</strong> Write something partial, move on, return. A blank answer scores 0. A partial answer can score 1–3 marks.</li>
        </ol>
      </div>
    </div>
  {/if}
</div>

<style>
  .app { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; z-index: 1; }

  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }
  .badge { display: inline-block; background: rgba(255,82,82,.12); color: var(--accent); border: 1px solid rgba(255,82,82,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto; }

  /* Tab bar */
  .tab-bar { display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.5rem; scrollbar-width: none; animation: fadeUp 0.4s ease both; }
  .tab-bar::-webkit-scrollbar { display: none; }
  .tab-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-family: var(--font-head); font-size: 0.78rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
  .tab-btn:hover { border-color: var(--accent); color: var(--text); }
  .tab-btn.active { background: rgba(255,82,82,.12); border-color: rgba(255,82,82,.4); color: var(--accent); }
  .tab-icon { font-size: 1rem; }

  /* Section */
  .section-wrap { display: flex; flex-direction: column; gap: 1rem; animation: fadeUp 0.3s ease both; }

  .section-intro { }
  .section-intro h2 { font-family: var(--font-head); font-size: 1.25rem; font-weight: 800; color: var(--accent); margin: 0 0 0.4rem; }
  .section-intro p { color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin: 0; }
  .section-intro strong { color: var(--text); }

  /* Resource card */
  .resource-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem 1.5rem; }
  .resource-card.featured { border-color: rgba(255,82,82,.2); }

  .resource-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .resource-name { font-family: var(--font-head); font-size: 1rem; font-weight: 800; color: var(--text); }
  .resource-url { font-size: 0.75rem; color: var(--accent2); margin-top: 0.1rem; }

  .badges-wrap { display: flex; gap: 0.4rem; flex-wrap: wrap; flex-shrink: 0; }
  .badge-chip { font-size: 0.65rem; font-family: var(--font-head); font-weight: 700; border-radius: 999px; padding: 0.2rem 0.55rem; white-space: nowrap; }
  .badge-chip.zero { background: rgba(105,180,255,.1); color: var(--accent2); }
  .badge-chip.free { background: rgba(122,255,122,.1); color: var(--accent3); }
  .badge-chip.official { background: rgba(255,82,82,.1); color: var(--accent); }
  .badge-chip.best { background: rgba(255,82,82,.1); color: var(--accent); }

  .resource-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin: 0 0 0.75rem; }
  .resource-tip { font-size: 0.8rem; color: var(--muted); line-height: 1.5; background: var(--surface2); border-radius: 8px; padding: 0.6rem 0.8rem; margin: 0; }

  .subject-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.75rem; }
  .stag { font-size: 0.68rem; font-family: var(--font-head); font-weight: 600; background: var(--surface2); border: 1px solid var(--border); border-radius: 999px; padding: 0.2rem 0.55rem; color: var(--muted); }

  /* Info card */
  .info-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem 1.5rem; }
  .info-card h3 { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; color: var(--text); margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-note { font-size: 0.8rem; color: var(--muted); margin: 0; }
  .inline-link { color: var(--accent2); text-decoration: none; }
  .inline-link:hover { text-decoration: underline; }

  .step-list, .tip-list { padding-left: 1.25rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .step-list li, .tip-list li { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }
  .step-list li strong, .tip-list li strong { color: var(--text); }

  /* Built-in tools */
  .info-card.built-in { border-color: rgba(255,82,82,.2); }
  .builtin-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .builtin-item { display: flex; align-items: center; gap: 0.75rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; text-decoration: none; transition: border-color 0.2s; }
  .builtin-item:hover { border-color: rgba(255,82,82,.3); }
  .builtin-icon { font-size: 1.2rem; flex-shrink: 0; }
  .builtin-name { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; color: var(--text); }
  .builtin-desc { font-size: 0.75rem; color: var(--muted); margin-top: 0.1rem; }

  /* Hotline */
  .hotline-card { background: rgba(122,255,122,.08); border: 1px solid rgba(122,255,122,.2); border-radius: 12px; padding: 1rem; text-align: center; margin: 0.75rem 0; }
  .hotline-num { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--accent3); }
  .hotline-label { font-size: 0.75rem; color: var(--muted); margin-top: 0.25rem; }

  /* Sleep rule */
  .sleep-rule { background: var(--surface2); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--muted); }
  .sleep-rule strong { color: var(--accent); }

  /* Caution */
  .caution-card { background: rgba(248,113,113,.07); border: 1px solid rgba(248,113,113,.2); border-radius: 12px; padding: 1rem 1.25rem; font-size: 0.875rem; color: var(--muted); line-height: 1.6; }
  .caution-card strong { color: var(--danger); }

  /* Curriculum banner + alert */
  .curriculum-banner { border-radius: 10px; padding: 0.65rem 1rem; font-size: 0.8rem; line-height: 1.5; margin-top: 0.75rem; }
  .curriculum-banner.ieb { background: rgba(105,180,255,.08); border: 1px solid rgba(105,180,255,.25); color: var(--accent2); }
  .curriculum-banner.caps { background: rgba(122,255,122,.08); border: 1px solid rgba(122,255,122,.25); color: var(--accent3); }
  .curriculum-banner.unsure { background: rgba(255,82,82,.08); border: 1px solid rgba(255,82,82,.2); color: var(--accent); }
  .curriculum-banner strong { color: inherit; }
  .banner-link { color: inherit; font-weight: 700; }
  .curriculum-alert { border-radius: 12px; padding: 0.85rem 1rem; font-size: 0.85rem; line-height: 1.6; margin-bottom: 0.5rem; }
  .curriculum-alert.ieb { background: rgba(105,180,255,.08); border: 1px solid rgba(105,180,255,.3); color: var(--text); }
  .curriculum-alert.caps { background: rgba(122,255,122,.08); border: 1px solid rgba(122,255,122,.3); color: var(--text); }
  .curriculum-alert strong { color: inherit; }
  .badge-chip.caution { background: rgba(248,113,113,.1); color: var(--danger); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 480px) {
    .tab-label { display: none; }
    .tab-btn { padding: 0.5rem 0.75rem; }
    .resource-header { flex-direction: column; }
  }
</style>
