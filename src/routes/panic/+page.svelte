<script lang="ts">
  import { onMount } from 'svelte';
  import { SUBJECTS } from '$lib/constants';
  import { rangeMid } from '$lib/aps';

  // ── Types ──────────────────────────────────────────────────
  interface StudyBlock {
    start: number; // minutes from now
    duration: number; // minutes
    subject: string;
    focus: string;
    technique: string;
    tip: string;
  }

  // ── State ──────────────────────────────────────────────────
  let step: 'setup' | 'plan' = 'setup';
  let selectedSubject = '';
  let hoursAvailable = 4;
  let examTomorrow = true;
  let assessmentSubjects: string[] = [];
  let weakestSubjects: { name: string; pct: number; gap: number }[] = [];
  let plan: StudyBlock[] = [];
  let startTime = new Date();

  // High-value topics per subject (exam-focused)
  const HIGH_VALUE: Record<string, { topic: string; tip: string }[]> = {
    'Mathematics': [
      { topic: 'Functions & Graphs — read graph, find equation, interpret', tip: 'Paper 1: ~30 marks. Sketch the graph from memory first.' },
      { topic: 'Calculus — derivatives, application (min/max)', tip: 'Use the rules: power, chain, product. Show all working.' },
      { topic: 'Sequences & Series — arithmetic + geometric', tip: 'Memorise Tn and Sn formulae. Know when to use which.' },
      { topic: 'Probability — Venn diagrams, counting principle', tip: 'Draw the Venn first. Label ALL regions including the outside.' },
    ],
    'Physical Sciences': [
      { topic: 'Newton\'s Laws — free body diagrams, net force', tip: 'Always draw the FBD. Label every force with magnitude and direction.' },
      { topic: 'Electricity — Ohm\'s Law, series vs parallel circuits', tip: 'Series: same current. Parallel: same voltage. Write this on your page.' },
      { topic: 'Organic Chemistry — naming, reactions, functional groups', tip: 'IUPAC naming: longest chain first. Count carbons carefully.' },
      { topic: 'Waves & Light — Doppler effect, interference', tip: 'Doppler: higher frequency when approaching. Draw wave fronts.' },
    ],
    'Life Sciences': [
      { topic: 'DNA & Protein synthesis — transcription, translation', tip: 'Use the codon table in the exam. Know the steps in order.' },
      { topic: 'Human reproduction — hormones, menstrual cycle', tip: 'Draw and label the cycle. Know LH, FSH, oestrogen, progesterone.' },
      { topic: 'Evolution — natural selection, evidence', tip: 'BPFS: Biogeography, Palaeontology, Fossils, Selective breeding.' },
      { topic: 'Photosynthesis & Respiration — equations, stages', tip: 'Know the light and dark reactions. Memorise the net equations.' },
    ],
    'English Home Language': [
      { topic: 'Essay writing — argument, descriptive, narrative', tip: 'Spend 5 min planning. Use PEEL for paragraphs. End with a clincher.' },
      { topic: 'Language structures — tenses, sentence types, punctuation', tip: '10 min of Language Q before tackling comprehension.' },
      { topic: 'Comprehension — inference, tone, purpose questions', tip: 'Underline the question word. Answer IN THE TEXT first, then infer.' },
      { topic: 'Literature — themes, characters, context', tip: 'Use PETER: Point, Evidence, Technique, Explanation, Reader response.' },
    ],
    'Mathematics Literacy': [
      { topic: 'Finance — loans, interest, budgets, inflation', tip: 'Show full calculation. Always state your formula first.' },
      { topic: 'Maps & Scale — distance, scale, direction', tip: 'Bearing is measured clockwise from North. Draw a North arrow.' },
      { topic: 'Statistics — mean, median, box-and-whisker', tip: 'Five-number summary: min, Q1, median, Q3, max. Know what outliers are.' },
      { topic: 'Probability — basic and compound events', tip: 'P(A or B) = P(A) + P(B) – P(A and B). Draw a Venn.' },
    ],
    'Accounting': [
      { topic: 'Financial statements — income statement, balance sheet', tip: 'Do the format from memory first, then fill in. Never skip a line.' },
      { topic: 'Cash flow — operating, investing, financing activities', tip: 'Operating: profit + non-cash items. Know the 3 sections.' },
      { topic: 'Ratios — liquidity, solvency, profitability', tip: 'Memorise 6 key ratios. Interpret: higher/lower means what for the business?' },
      { topic: 'VAT and depreciation calculations', tip: 'VAT: inclusive ÷ 1.15. Straight-line vs diminishing balance — know both.' },
    ],
    'History': [
      { topic: 'Source analysis — origin, purpose, reliability, bias', tip: 'OPVL: Origin, Purpose, Value, Limitation. Quote from the source.' },
      { topic: 'Essay structure — PEEL, argument, evidence', tip: 'Spend 10 min on essay plan. Topic sentence must answer the question.' },
      { topic: 'Cold War — US/USSR rivalry, key events 1945–1991', tip: 'Know: Truman Doctrine, Marshall Plan, Berlin, Cuba, Vietnam in order.' },
      { topic: 'Civil rights — US + SA — comparison questions', tip: 'Compare directly: "Similarly... However..." Link to context always.' },
    ],
    'Geography': [
      { topic: 'Mapwork — contours, cross-sections, gradient, bearing', tip: 'Gradient = vertical interval ÷ horizontal distance. Show formula.' },
      { topic: 'Climate and weather — synoptic charts, rainfall types', tip: 'Know the 3 rainfall types: convectional, frontal, orographic + diagrams.' },
      { topic: 'Geomorphology — rivers, weathering, mass movement', tip: 'River processes: erosion, transportation, deposition. Draw the long profile.' },
      { topic: 'Settlement — urbanisation, rural-urban migration, informal settlements', tip: 'Know push and pull factors. SA context: apartheid spatial planning.' },
    ],
  };

  function getTopics(subject: string): { topic: string; tip: string }[] {
    return HIGH_VALUE[subject] ?? [
      { topic: 'Review past exam papers — focus on question 1 first', tip: 'Q1 is usually the easiest. Bank those marks.' },
      { topic: 'Mind-map key concepts from memory', tip: 'Do it WITHOUT notes first. Gaps reveal what you don\'t know.' },
      { topic: 'Work through the memorandum of the last past paper', tip: 'Don\'t just read — redo the questions you got wrong.' },
      { topic: 'Summarise in your own words', tip: 'If you can\'t explain it simply, you don\'t know it yet.' },
    ];
  }

  function buildPlan(subject: string, hours: number): StudyBlock[] {
    const topics = getTopics(subject);
    const totalMin = hours * 60;
    const blocks: StudyBlock[] = [];

    // Pomodoro 50/10 blocks
    let elapsed = 0;
    let topicIdx = 0;
    let blockNum = 0;

    while (elapsed < totalMin - 10) {
      const remaining = totalMin - elapsed;
      if (remaining < 20) break;

      const studyDur = Math.min(50, remaining - 10);
      const t = topics[topicIdx % topics.length];

      blocks.push({
        start: elapsed,
        duration: studyDur,
        subject,
        focus: t.topic,
        technique: blockNum === 0 ? 'Active recall — read, close notes, write from memory' :
                   blockNum === 1 ? 'Past paper questions — work under timed conditions' :
                   blockNum === 2 ? 'Explain it out loud (Feynman technique)' :
                                   'Past paper — mark your own work with the memo',
        tip: t.tip,
      });

      elapsed += studyDur;
      topicIdx++;
      blockNum++;

      if (elapsed < totalMin - 10) {
        // Break block
        const breakDur = blockNum % 4 === 0 ? 30 : 10;
        blocks.push({
          start: elapsed,
          duration: Math.min(breakDur, totalMin - elapsed),
          subject: '—',
          focus: blockNum % 4 === 0 ? 'Long break — eat something, walk, breathe' : 'Short break — stand up, stretch, water',
          technique: '',
          tip: '',
        });
        elapsed += breakDur;
      }
    }

    return blocks;
  }

  function formatTime(minutesFromNow: number): string {
    const d = new Date(startTime.getTime() + minutesFromNow * 60000);
    return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }

  function generate() {
    if (!selectedSubject) return;
    startTime = new Date();
    plan = buildPlan(selectedSubject, hoursAvailable);
    step = 'plan';
  }

  function reset() {
    step = 'setup';
    plan = [];
  }

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const marks: Record<string, string> = state.subjectMarks || {};
        assessmentSubjects = Object.entries(marks)
          .filter(([, v]) => v && v !== '')
          .map(([k]) => k);
        weakestSubjects = assessmentSubjects
          .map(name => ({ name, pct: rangeMid(marks[name] || ''), gap: 60 - rangeMid(marks[name] || '') }))
          .filter(s => s.gap > 0)
          .sort((a, b) => b.gap - a.gap)
          .slice(0, 3);
        if (weakestSubjects.length > 0 && !selectedSubject) {
          selectedSubject = weakestSubjects[0].name;
        }
      }
    } catch {}
    if (!selectedSubject && SUBJECTS.length > 0) selectedSubject = SUBJECTS[0];
  });

  $: isBreak = (b: StudyBlock) => b.subject === '—';
  $: subjectList = assessmentSubjects.length ? assessmentSubjects : SUBJECTS.slice(0, 8);
</script>

<svelte:head>
  <title>Panic Mode — Miyagi My Matric</title>
</svelte:head>

<div class="app panic-page">

  {#if step === 'setup'}
    <!-- ── Setup ── -->
    <div class="panic-header">
      <div class="panic-badge">🚨 Panic Mode</div>
      <h1>Exam tomorrow.<br>Let's get you ready.</h1>
      <p class="panic-sub">Tell us what you're writing — we'll build the most efficient study plan for the time you have left.</p>
    </div>

    <div class="setup-card">
      <!-- Subject -->
      <div class="setup-field">
        <label class="field-label">Which subject?</label>
        {#if weakestSubjects.length > 0}
          <p class="field-hint">Your weakest subjects — start here:</p>
          <div class="weak-chips">
            {#each weakestSubjects as s}
              <button
                class="weak-chip {selectedSubject === s.name ? 'selected' : ''}"
                on:click={() => selectedSubject = s.name}
              >
                <span class="wc-name">{s.name}</span>
                <span class="wc-pct" style="color: var(--danger)">{s.pct}%</span>
              </button>
            {/each}
          </div>
        {/if}
        <select class="select-input" bind:value={selectedSubject}>
          {#each subjectList as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>

      <!-- Hours -->
      <div class="setup-field">
        <label class="field-label">How many hours do you have?</label>
        <div class="hours-grid">
          {#each [1, 2, 3, 4, 5, 6] as h}
            <button
              class="hour-btn {hoursAvailable === h ? 'selected' : ''}"
              on:click={() => hoursAvailable = h}
            >
              {h}h
            </button>
          {/each}
        </div>
      </div>

      <!-- Exam tomorrow toggle -->
      <div class="setup-field toggle-field">
        <div>
          <div class="field-label">Exam is tomorrow</div>
          <div class="field-hint">Activates exam-day mode — focus on recall, not learning new content</div>
        </div>
        <button
          class="toggle-btn {examTomorrow ? 'on' : ''}"
          on:click={() => examTomorrow = !examTomorrow}
          aria-label="Toggle exam tomorrow"
        >
          <div class="toggle-knob"></div>
        </button>
      </div>

      <button class="btn btn-finish panic-go" on:click={generate}>
        Build my rescue plan →
      </button>
    </div>

  {:else}
    <!-- ── Plan ── -->
    <div class="plan-header">
      <div class="panic-badge small">🚨 {selectedSubject} · {hoursAvailable}h rescue plan</div>
      <div class="plan-start-time">Starting now — {formatTime(0)}</div>
    </div>

    {#if weakestSubjects.length > 0}
      {@const ws = weakestSubjects.find(s => s.name === selectedSubject)}
      {#if ws}
        <div class="gap-callout">
          Currently at <strong style="color: var(--danger)">{ws.pct}%</strong> in {ws.name} — you need 60% to pass. This plan targets the highest-value topics first.
        </div>
      {/if}
    {/if}

    <!-- Timeline -->
    <div class="plan-timeline">
      {#each plan as block, i}
        <div class="timeline-row">
          <div class="timeline-time">{formatTime(block.start)}</div>
          <div class="timeline-track">
            <div class="timeline-dot {isBreak(block) ? 'break' : 'study'}"></div>
            {#if i < plan.length - 1}
              <div class="timeline-line"></div>
            {/if}
          </div>
          <div class="timeline-card {isBreak(block) ? 'break-card' : 'study-card'}">
            {#if isBreak(block)}
              <div class="break-label">{block.focus}</div>
              <div class="break-dur">{block.duration} min</div>
            {:else}
              <div class="study-duration">{block.duration} min · {block.technique}</div>
              <div class="study-focus">{block.focus}</div>
              {#if block.tip}
                <div class="study-tip">💡 {block.tip}</div>
              {/if}
            {/if}
          </div>
        </div>
      {/each}

      <!-- End marker -->
      <div class="timeline-row">
        <div class="timeline-time">{formatTime(plan.reduce((acc, b) => acc + b.duration, 0))}</div>
        <div class="timeline-track">
          <div class="timeline-dot done"></div>
        </div>
        <div class="timeline-card done-card">
          <div class="done-text">🎯 Done. You've put in the work. Get some sleep — memory consolidates overnight.</div>
        </div>
      </div>
    </div>

    <!-- Bottom CTAs -->
    <div class="plan-actions">
      <button class="btn btn-outline" on:click={reset}>← Different subject</button>
      <a href="/techniques" class="btn btn-ghost-link">Study techniques →</a>
    </div>
  {/if}
</div>

<style>
  .panic-page { max-width: 600px; }

  /* Header */
  .panic-header {
    text-align: center;
    margin-bottom: 2rem;
    animation: fadeDown .5s ease both;
  }

  .panic-badge {
    display: inline-block;
    background: rgba(255,92,138,.15);
    border: 1px solid rgba(255,92,138,.35);
    color: var(--danger);
    font-family: var(--font-head);
    font-size: .7rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .35rem 1rem; border-radius: 100px;
    margin-bottom: 1rem;
  }
  .panic-badge.small { font-size: .62rem; margin-bottom: .5rem; }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    font-weight: 800; color: var(--text);
    line-height: 1.15; margin-bottom: .6rem;
  }

  .panic-sub {
    font-size: .88rem; color: var(--muted);
    font-weight: 300; line-height: 1.6;
    max-width: 420px; margin: 0 auto;
  }

  /* Setup card */
  .setup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.8rem;
    animation: fadeUp .4s ease both;
  }

  .setup-field { margin-bottom: 1.5rem; }
  .field-label {
    font-family: var(--font-head);
    font-size: .75rem; font-weight: 700;
    color: var(--text); margin-bottom: .4rem;
    display: block;
  }
  .field-hint {
    font-size: .72rem; color: var(--muted);
    font-weight: 300; margin-bottom: .5rem;
  }

  .weak-chips {
    display: flex; flex-wrap: wrap; gap: .4rem;
    margin-bottom: .75rem;
  }
  .weak-chip {
    display: flex; align-items: center; gap: .4rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: .35rem .8rem;
    cursor: pointer;
    transition: all .15s;
    font-family: var(--font-head);
  }
  .weak-chip:hover { border-color: var(--accent); }
  .weak-chip.selected { border-color: var(--accent); background: rgba(124,77,255,.1); }
  .wc-name { font-size: .75rem; font-weight: 600; color: var(--text); }
  .wc-pct  { font-size: .72rem; font-weight: 700; }

  .select-input {
    width: 100%;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: .7rem 1rem;
    font-family: var(--font-body);
    font-size: .88rem;
    outline: none;
    cursor: pointer;
    margin-top: .3rem;
  }
  .select-input:focus { border-color: var(--accent); }

  .hours-grid {
    display: flex; gap: .5rem; flex-wrap: wrap;
  }
  .hour-btn {
    flex: 1; min-width: 48px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--muted);
    border-radius: 10px;
    padding: .6rem;
    font-family: var(--font-head);
    font-size: .82rem; font-weight: 700;
    cursor: pointer; transition: all .15s;
    text-align: center;
  }
  .hour-btn:hover { border-color: var(--accent); color: var(--text); }
  .hour-btn.selected { border-color: var(--accent); background: rgba(124,77,255,.12); color: var(--accent); }

  .toggle-field {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
  }
  .toggle-btn {
    width: 48px; height: 27px;
    border-radius: 100px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    position: relative; cursor: pointer;
    transition: background .2s, border-color .2s;
    flex-shrink: 0;
    padding: 0;
  }
  .toggle-btn.on {
    background: var(--accent);
    border-color: var(--accent);
  }
  .toggle-knob {
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(255,244,232,.4);
    transition: left .2s, background .2s;
  }
  .toggle-btn.on .toggle-knob {
    left: 23px;
    background: #0D0A18;
  }

  .panic-go { width: 100%; margin-top: .5rem; }

  /* Plan */
  .plan-header { margin-bottom: 1rem; }
  .plan-start-time {
    font-size: .8rem; color: var(--muted);
    font-weight: 300; margin-top: .3rem;
  }

  .plan-timeline { margin-bottom: 1.5rem; }

  .timeline-row {
    display: flex;
    gap: .8rem;
    align-items: flex-start;
  }

  .timeline-time {
    font-family: var(--font-head);
    font-size: .65rem; font-weight: 700;
    color: var(--muted);
    width: 40px; flex-shrink: 0;
    padding-top: .6rem;
    text-align: right;
  }

  .timeline-track {
    display: flex; flex-direction: column;
    align-items: center; flex-shrink: 0;
    padding-top: .55rem;
  }

  .timeline-dot {
    width: 12px; height: 12px; border-radius: 50%;
    flex-shrink: 0;
  }
  .timeline-dot.study { background: var(--accent); box-shadow: 0 0 8px rgba(124,77,255,.5); }
  .timeline-dot.break { background: var(--surface2); border: 2px solid var(--border); }
  .timeline-dot.done  { background: var(--accent3); box-shadow: 0 0 8px rgba(122,255,122,.5); }

  .timeline-line {
    width: 2px; flex: 1; min-height: 16px;
    background: var(--border);
    margin: 4px 0;
  }

  .timeline-card {
    flex: 1;
    border-radius: 12px;
    padding: .75rem 1rem;
    margin-bottom: .5rem;
    animation: fadeUp .3s ease both;
  }

  .study-card {
    background: var(--surface);
    border: 1px solid rgba(124,77,255,.2);
  }
  .break-card {
    background: transparent;
    border: 1px solid rgba(255,244,232,.06);
  }
  .done-card {
    background: rgba(122,255,122,.06);
    border: 1px solid rgba(122,255,122,.2);
  }

  .study-duration {
    font-size: .68rem; color: var(--accent);
    font-family: var(--font-head); font-weight: 700;
    letter-spacing: .04em; margin-bottom: .3rem;
    text-transform: uppercase;
  }
  .study-focus {
    font-size: .85rem; color: var(--text);
    font-weight: 600; line-height: 1.4;
    margin-bottom: .4rem;
  }
  .study-tip {
    font-size: .72rem; color: var(--muted);
    font-weight: 300; line-height: 1.5;
    background: rgba(255,244,232,.04);
    border-radius: 6px; padding: .4rem .6rem;
  }

  .break-label {
    font-size: .8rem; color: var(--muted);
    font-weight: 400;
  }
  .break-dur {
    font-size: .65rem; color: rgba(255,244,232,.3);
    font-family: var(--font-head); margin-top: .1rem;
  }

  .done-text {
    font-size: .82rem; color: var(--accent3);
    font-weight: 500; line-height: 1.5;
  }

  .plan-actions {
    display: flex; gap: .75rem; margin-bottom: 2rem;
  }
  .btn-ghost-link {
    font-family: var(--font-head);
    font-size: .82rem; font-weight: 700;
    color: var(--accent2); text-decoration: none;
    padding: .85rem 1.5rem;
    border: 1.5px solid rgba(224,64,251,.25);
    border-radius: 100px;
    transition: border-color .15s;
  }
  .btn-ghost-link:hover { border-color: var(--accent2); }

  .gap-callout {
    background: rgba(255,92,138,.06);
    border: 1px solid rgba(255,92,138,.2);
    border-radius: 12px; padding: .8rem 1rem;
    font-size: .82rem; color: var(--muted);
    font-weight: 300; line-height: 1.6;
    margin-bottom: 1.2rem;
  }
</style>
