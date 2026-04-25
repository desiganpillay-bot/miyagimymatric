<script lang="ts">
  import { onMount } from 'svelte';

  let phase: 'victory' | 'profile' = 'victory';
  let vrStep = 0;
  let particles: Array<{x: number; y: number; r: number; d: number; color: string}> = [];

  onMount(() => {
    // Generate confetti particles
    const colors = ['#f6c90e', '#38bdf8', '#4ade80', '#a78bfa', '#f87171', '#fff'];
    particles = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      r: 0.3 + Math.random() * 0.5,
      d: 2 + Math.random() * 3,
      color: colors[i % colors.length],
    }));

    const timings = [0, 500, 1100, 1700];
    timings.forEach((t, i) => { setTimeout(() => { vrStep = i; }, t); });
    setTimeout(() => { phase = 'profile'; }, 3200);
  });

  // ── Rav's profile data ────────────────────────────────────
  const rav = {
    name: 'Ravanth',
    preferred: 'Rav',
    school: 'Crawford Lonehill',
    archetype: 'The Calibrated Outperformer',
    tagline: 'You know exactly where you stand. The problem is you keep trying to fix it alone — and alone is the one mode you told us doesn\'t work.',
    insight: 'You\'re not avoiding Sciences because you\'re lazy. You\'re avoiding it because hitting a wall alone at 11pm with no clear next move is a genuinely bad feeling, and your brain has learned to route around it. The fix isn\'t willpower. It\'s removing the solo.',
    strength: 'Self-honesty. Your confidence ratings match your marks almost exactly — you\'re not delusional about your position, which makes the plan actually work.',
    risk: 'High self-awareness without structural support becomes "I know what\'s wrong" paralysis. Knowing the problem isn\'t the same as fixing it.',
    aps: { current: 34, upStatus: 'MET ✓', witsGap: 4 },
    subjects: [
      { name: 'Mathematics',   mark: 97, confidence: 7.5, band: 'STRONG', type: 'maintenance' },
      { name: 'CAT',           mark: 90, confidence: 7.5, band: 'STRONG', type: 'maintenance' },
      { name: 'History',       mark: 82, confidence: 7.5, band: 'STRONG', type: 'maintenance' },
      { name: 'English',       mark: 76, confidence: 5.5, band: 'MEDIUM', type: 'imposter' },
      { name: 'Afrikaans',     mark: 54, confidence: 3.5, band: 'HIGH',   type: 'real_gap' },
      { name: 'Phys Sciences', mark: 43, confidence: 3.5, band: 'HIGH',   type: 'real_gap' },
      { name: 'LO (exams)',    mark: null, confidence: 7.5, band: 'STRONG', type: 'maintenance' },
      { name: 'LO (admin)',    mark: null, confidence: 1.5, band: 'HIGH',   type: 'structural' },
    ],
    dimensions: [
      {
        id: 'd1', label: 'D1 — Learning Modality', icon: '👁',
        stat: 'Visual · Watch → Practice',
        body: 'You learn by watching worked examples first, then attempting problems. Textbook-first studying is low yield for you.',
        action: 'Every new topic: find a YouTube explainer first. Attempt problems only after watching. Never open with the textbook.',
      },
      {
        id: 'd2', label: 'D2 — Focus & Energy', icon: '⚡',
        stat: '9pm–11pm · 52-min focus span',
        body: 'Your focus doesn\'t collapse at a time limit — it collapses at the point of not-knowing. Phone nearby is a named session-killer.',
        action: 'Phone in another room for the 9pm block. Pre-decide your response to hitting a wall: flag it, skip it, photo to a mate. Build the exit before you need it.',
      },
      {
        id: 'd3', label: 'D3 — Procrastination', icon: '⏳',
        stat: 'Deadline-driven · Loses momentum at 20min',
        body: 'You don\'t avoid studying — you start and then stall. The trigger is "I don\'t know what to do next", not laziness or boredom. Plans built on hours will fail. Plans built on appointments will work.',
        action: 'Replace time-based goals with event-based commitments. "Tuesday 8pm Sciences with [name]" outperforms "I\'ll study Sciences 3× a week" every time.',
      },
      {
        id: 'd4', label: 'D4 — Confidence Map', icon: '🎯',
        stat: 'High calibration — no blind spots',
        body: 'Your confidence ratings track your marks closely across every subject. Unusually self-aware. English is the one exception — you\'re underrating yourself there (76% mark, 5.5 confidence). Easy lift.',
        action: 'Re-run this map on 21 May. If Physical Sciences confidence moves from 3–4 to 5–6, the intervention is working before your marks confirm it.',
      },
      {
        id: 'd5', label: 'D5 — Defence Mechanism', icon: '🛡',
        stat: 'Peer learner · Strong network',
        body: 'When you hit an unknown question, your first move is to ask a mate who gets it. You have a go-to person in every main subject. The weakness: they\'re not available at 11pm when the wall hits.',
        action: 'Book a standing Sciences session with a named mate. Same time every week. Not "let me know if you need help" — a calendar appointment.',
      },
      {
        id: 'd6', label: 'D6 — Stakes & Accountability', icon: '🔑',
        stat: 'Co-presence works · Everything else doesn\'t',
        body: 'Charts, streaks, parent check-ins, consequences, intrinsic motivation — none of these work for you. Co-study (in person or FaceTime) does. The highest-leverage APS play on your profile isn\'t Sciences. It\'s LO admin completion — no learning curve, pure task.',
        action: 'LO community service admin: Saturday morning before anything else. Two fixed co-study slots per week: Sciences + one other weak subject. Binary: it happened or it didn\'t.',
      },
    ],
    priorities: [
      { n: 1, action: 'Complete LO community service logging and admin', why: 'Highest APS return per hour on your entire profile. Pure task completion — no learning required.', timing: 'Saturday morning' },
      { n: 2, action: 'Book a named, standing Sciences co-study session', why: 'Your peer-learner defence mechanism needs structural availability, not on-demand requests.', timing: 'This week — calendar it' },
      { n: 3, action: 'Apply your Maths method to one Physics or Chemistry topic', why: 'YouTube explainer → 5 problems → repeat. You already own this method. Redirect it.', timing: 'First co-study session' },
      { n: 4, action: 'Phone in another room for the 9pm block', why: 'Phone proximity is a named session-killer. Removal, not DND.', timing: 'Tonight' },
    ],
    milestone: {
      date: '21 May 2026',
      target: 'Physical Sciences confidence moves from 3–4 to 5–6 on the same scale',
      note: 'Confidence shift precedes mark shift. If confidence moves, the intervention is working before results confirm it.',
    },
  };

  const bandColor: Record<string, string> = {
    STRONG: '#4ade80',
    MEDIUM: '#f6c90e',
    HIGH:   '#f87171',
  };

  const gapLabel: Record<string, string> = {
    maintenance:  'Maintenance',
    imposter:     'Underrating yourself',
    real_gap:     'Real gap',
    structural:   'Structural collapse',
  };

  const gapColor: Record<string, string> = {
    maintenance:  '#4ade80',
    imposter:     '#38bdf8',
    real_gap:     '#f87171',
    structural:   '#f87171',
  };

  let openDim: string | null = null;
  function toggleDim(id: string) { openDim = openDim === id ? null : id; }
</script>

<svelte:head>
  <title>⭐ Sensei — Miyagi</title>
</svelte:head>

<!-- ── Fortnite Victory Royale intro ── -->
{#if phase === 'victory'}
  <div class="vr-overlay" class:rays={vrStep >= 1}>
    <!-- Confetti particles (step 2+) -->
    {#if vrStep >= 2}
      {#each particles as p}
        <div class="vr-particle"
          style="left:{p.x}%; top:{p.y}%; width:{p.r}rem; height:{p.r * 2}rem; background:{p.color}; animation-duration:{p.d}s"
        ></div>
      {/each}
    {/if}

    <!-- Crown (step 0) -->
    {#if vrStep >= 0}
      <div class="vr-crown" class:visible={vrStep >= 0}>👑</div>
    {/if}

    <!-- VICTORY (step 1) -->
    {#if vrStep >= 1}
      <div class="vr-victory">VICTORY</div>
    {/if}

    <!-- ROYALE (step 2) -->
    {#if vrStep >= 2}
      <div class="vr-royale">ROYALE</div>
    {/if}

    <!-- #1 badge (step 3) -->
    {#if vrStep >= 3}
      <div class="vr-badge">#1</div>
    {/if}
  </div>

<!-- ── Profile ── -->
{:else}
  <div class="app sensei-page">

    <!-- Header -->
    <div class="sensei-header">
      <div class="sensei-badge">⭐ Sensei Mode · Private</div>
      <div class="student-name">{rav.preferred}</div>
      <div class="student-meta">{rav.school} · IEB Grade 12</div>
    </div>

    <!-- Hero card -->
    <div class="hero-card">
      <div class="archetype-label">Your archetype</div>
      <div class="archetype-name">{rav.archetype}</div>
      <div class="archetype-tagline">"{rav.tagline}"</div>
      <div class="divider"></div>
      <div class="insight-label">The real insight</div>
      <div class="insight-text">{rav.insight}</div>
      <div class="strength-risk">
        <div class="sr-item">
          <span class="sr-label strength">STRENGTH</span>
          <span class="sr-text">{rav.strength}</span>
        </div>
        <div class="sr-item">
          <span class="sr-label risk">RISK</span>
          <span class="sr-text">{rav.risk}</span>
        </div>
      </div>
    </div>

    <!-- APS Status -->
    <div class="aps-band">
      <div class="aps-item">
        <div class="aps-val">{rav.aps.current}</div>
        <div class="aps-key">Current APS</div>
      </div>
      <div class="aps-divider"></div>
      <div class="aps-item">
        <div class="aps-val met">UP</div>
        <div class="aps-key">{rav.aps.upStatus}</div>
      </div>
      <div class="aps-divider"></div>
      <div class="aps-item">
        <div class="aps-val gap">−{rav.aps.witsGap}</div>
        <div class="aps-key">Wits gap</div>
      </div>
    </div>

    <!-- This week -->
    <div class="section-label">🔥 This week — in order</div>
    <div class="priorities">
      {#each rav.priorities as p}
        <div class="priority-card">
          <div class="p-num">{p.n}</div>
          <div class="p-body">
            <div class="p-action">{p.action}</div>
            <div class="p-why">{p.why}</div>
            <div class="p-timing">⏰ {p.timing}</div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Confidence map -->
    <div class="section-label">🎯 Confidence map</div>
    <div class="conf-card">
      <div class="conf-legend">
        <span class="leg-item"><span class="leg-dot mark"></span>Mark %</span>
        <span class="leg-item"><span class="leg-dot conf"></span>Confidence /10</span>
      </div>
      {#each rav.subjects as s}
        <div class="conf-row">
          <div class="conf-name">{s.name}</div>
          <div class="conf-bars">
            <div class="bar-wrap">
              <div class="bar mark-bar" style="width: {s.mark ?? 0}%"></div>
              <span class="bar-label">{s.mark != null ? s.mark + '%' : '—'}</span>
            </div>
            <div class="bar-wrap">
              <div class="bar conf-bar" style="width: {(s.confidence / 10) * 100}%"></div>
              <span class="bar-label">{s.confidence}/10</span>
            </div>
          </div>
          <div class="conf-gap-label" style="color: {gapColor[s.type]}">{gapLabel[s.type]}</div>
        </div>
      {/each}
    </div>

    <!-- Dimension breakdown -->
    <div class="section-label">📊 6 Dimensions</div>
    <div class="dims-list">
      {#each rav.dimensions as d}
        <div class="dim-card {openDim === d.id ? 'open' : ''}">
          <button class="dim-header" on:click={() => toggleDim(d.id)}>
            <span class="dim-icon">{d.icon}</span>
            <span class="dim-label">{d.label}</span>
            <span class="dim-stat">{d.stat}</span>
            <span class="dim-chev">{openDim === d.id ? '▲' : '▼'}</span>
          </button>
          {#if openDim === d.id}
            <div class="dim-body">
              <p class="dim-text">{d.body}</p>
              <div class="dim-action">→ {d.action}</div>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- 4-week milestone -->
    <div class="milestone-card">
      <div class="ms-date">📅 Re-measure: {rav.milestone.date}</div>
      <div class="ms-target">{rav.milestone.target}</div>
      <div class="ms-note">{rav.milestone.note}</div>
    </div>

    <div style="height: 2rem"></div>
  </div>
{/if}

<style>
  /* ── Fortnite Victory Royale intro ─────────────────── */
  .vr-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #080510;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: .2rem; overflow: hidden;
    transition: background .5s ease;
  }
  .vr-overlay.rays {
    background: radial-gradient(ellipse 80% 60% at 50% 50%,
      rgba(246,201,14,.18) 0%,
      rgba(56,189,248,.10) 40%,
      #060310 100%);
  }
  .vr-overlay.rays::before {
    content: '';
    position: absolute; inset: 0;
    background: conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(246,201,14,.07) 20deg,
      transparent 40deg,
      rgba(56,189,248,.05) 60deg,
      transparent 80deg,
      rgba(246,201,14,.07) 100deg,
      transparent 120deg,
      rgba(56,189,248,.05) 140deg,
      transparent 160deg,
      rgba(246,201,14,.07) 180deg,
      transparent 200deg,
      rgba(56,189,248,.05) 220deg,
      transparent 240deg,
      rgba(246,201,14,.07) 260deg,
      transparent 280deg,
      rgba(56,189,248,.05) 300deg,
      transparent 320deg,
      rgba(246,201,14,.07) 340deg,
      transparent 360deg
    );
    animation: vr-spin 8s linear infinite;
    pointer-events: none;
  }

  @keyframes vr-spin { to { transform: rotate(360deg); } }

  .vr-crown {
    font-size: clamp(3rem, 14vw, 6rem);
    animation: vr-drop .4s cubic-bezier(.17,.67,.35,1.5) both;
    position: relative; z-index: 2;
  }
  @keyframes vr-drop {
    from { transform: translateY(-80px) scale(0.4); opacity: 0; }
    to   { transform: translateY(0)     scale(1);   opacity: 1; }
  }

  .vr-victory {
    font-family: var(--font-head);
    font-size: clamp(3.2rem, 16vw, 7.5rem);
    font-weight: 800; line-height: 1;
    color: #f6c90e;
    letter-spacing: .06em;
    text-shadow:
      0 0 60px rgba(246,201,14,.7),
      0 0 20px rgba(246,201,14,.5),
      3px 3px 0 rgba(0,0,0,.8);
    animation: vr-slam .3s cubic-bezier(.17,.67,.35,1.4) both;
    position: relative; z-index: 2;
  }

  .vr-royale {
    font-family: var(--font-head);
    font-size: clamp(2rem, 10vw, 4.5rem);
    font-weight: 800; line-height: 1;
    color: #38bdf8;
    letter-spacing: .25em;
    text-transform: uppercase;
    text-shadow:
      0 0 50px rgba(56,189,248,.7),
      0 0 15px rgba(56,189,248,.5),
      2px 2px 0 rgba(0,0,0,.8);
    animation: vr-rise .35s cubic-bezier(.17,.67,.35,1.4) both;
    position: relative; z-index: 2;
  }

  .vr-badge {
    font-family: var(--font-head);
    font-size: clamp(1rem, 5vw, 1.8rem);
    font-weight: 800; color: #fff;
    background: linear-gradient(135deg, #f6c90e, #fb923c);
    padding: .3rem 1.2rem; border-radius: 100px;
    margin-top: .4rem;
    box-shadow: 0 0 30px rgba(246,201,14,.5);
    animation: vr-pop .3s cubic-bezier(.17,.67,.35,1.6) both;
    position: relative; z-index: 2;
    letter-spacing: .05em;
  }

  @keyframes vr-slam {
    from { transform: scale(1.8) translateY(-20px); opacity: 0; }
    to   { transform: scale(1)   translateY(0);     opacity: 1; }
  }
  @keyframes vr-rise {
    from { transform: scale(.5) translateY(30px); opacity: 0; }
    to   { transform: scale(1)  translateY(0);    opacity: 1; }
  }
  @keyframes vr-pop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  /* Confetti particles */
  .vr-particle {
    position: absolute;
    border-radius: 2px;
    animation: vr-fall linear forwards;
    opacity: .85;
    pointer-events: none;
  }
  @keyframes vr-fall {
    from { transform: translateY(-10vh) rotate(0deg); opacity: .9; }
    to   { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  /* ── Profile ───────────────────────────────────────── */
  .sensei-page { max-width: 600px; animation: fadeIn .4s ease both; }

  .sensei-header { text-align: center; margin-bottom: 1.5rem; }
  .sensei-badge {
    display: inline-block;
    background: rgba(124,77,255,.15);
    border: 1px solid rgba(124,77,255,.4);
    color: #a78bfa;
    font-family: var(--font-head);
    font-size: .65rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .3rem .9rem; border-radius: 100px;
    margin-bottom: .8rem;
  }
  .student-name {
    font-family: var(--font-head);
    font-size: 2rem; font-weight: 800; color: var(--text);
  }
  .student-meta { font-size: .8rem; color: var(--muted); font-weight: 300; }

  /* Hero card */
  .hero-card {
    background: linear-gradient(135deg, rgba(124,77,255,.12), rgba(255,92,138,.08));
    border: 1px solid rgba(124,77,255,.35);
    border-radius: 20px; padding: 1.6rem;
    margin-bottom: 1rem;
    animation: fadeUp .4s ease both;
  }
  .archetype-label {
    font-family: var(--font-head);
    font-size: .6rem; font-weight: 700; letter-spacing: .15em;
    text-transform: uppercase; color: #a78bfa; margin-bottom: .3rem;
  }
  .archetype-name {
    font-family: var(--font-head);
    font-size: 1.4rem; font-weight: 800; color: var(--text);
    line-height: 1.2; margin-bottom: .8rem;
  }
  .archetype-tagline {
    font-size: .82rem; color: var(--muted); font-weight: 300;
    line-height: 1.6; font-style: italic; margin-bottom: 1rem;
  }
  .divider { height: 1px; background: rgba(255,244,232,.08); margin-bottom: 1rem; }
  .insight-label {
    font-family: var(--font-head);
    font-size: .6rem; font-weight: 700; letter-spacing: .15em;
    text-transform: uppercase; color: #f87171; margin-bottom: .4rem;
  }
  .insight-text {
    font-size: .85rem; color: var(--text); font-weight: 400;
    line-height: 1.65; margin-bottom: 1rem;
  }
  .strength-risk { display: flex; flex-direction: column; gap: .6rem; }
  .sr-item { display: flex; gap: .6rem; align-items: flex-start; }
  .sr-label {
    font-family: var(--font-head);
    font-size: .58rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; padding: .2rem .5rem;
    border-radius: 4px; flex-shrink: 0; margin-top: 2px;
  }
  .sr-label.strength { background: rgba(74,222,128,.15); color: #4ade80; }
  .sr-label.risk     { background: rgba(248,113,113,.15); color: #f87171; }
  .sr-text { font-size: .78rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

  /* APS band */
  .aps-band {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 1rem 1.2rem;
    display: flex; align-items: center; justify-content: space-around;
    margin-bottom: 1rem;
    animation: fadeUp .45s ease both;
  }
  .aps-item { text-align: center; }
  .aps-val {
    font-family: var(--font-head);
    font-size: 1.5rem; font-weight: 800; color: var(--text);
  }
  .aps-val.met { color: #4ade80; font-size: 1.1rem; }
  .aps-val.gap { color: #f87171; }
  .aps-key { font-size: .65rem; color: var(--muted); font-weight: 300; margin-top: .1rem; }
  .aps-divider { width: 1px; height: 40px; background: var(--border); }

  /* Section label */
  .section-label {
    font-family: var(--font-head);
    font-size: .72rem; font-weight: 700;
    color: var(--text); margin: 1.2rem 0 .6rem;
    letter-spacing: .02em;
  }

  /* Priorities */
  .priorities { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .5rem; }
  .priority-card {
    display: flex; gap: .8rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: .9rem 1rem;
    animation: fadeUp .5s ease both;
  }
  .p-num {
    font-family: var(--font-head);
    font-size: 1.2rem; font-weight: 800;
    color: rgba(124,77,255,.5); flex-shrink: 0; line-height: 1;
    padding-top: 2px;
  }
  .p-action { font-size: .85rem; font-weight: 600; color: var(--text); margin-bottom: .25rem; }
  .p-why { font-size: .75rem; color: var(--muted); font-weight: 300; line-height: 1.5; margin-bottom: .3rem; }
  .p-timing { font-size: .68rem; color: #a78bfa; font-family: var(--font-head); font-weight: 700; }

  /* Confidence map */
  .conf-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1rem 1.2rem;
    margin-bottom: .5rem;
    animation: fadeUp .55s ease both;
  }
  .conf-legend { display: flex; gap: 1rem; margin-bottom: .8rem; }
  .leg-item { display: flex; align-items: center; gap: .3rem; font-size: .65rem; color: var(--muted); }
  .leg-dot { width: 8px; height: 8px; border-radius: 50%; }
  .leg-dot.mark { background: #a78bfa; }
  .leg-dot.conf { background: #38bdf8; }

  .conf-row { margin-bottom: .7rem; }
  .conf-name { font-size: .72rem; font-weight: 600; color: var(--muted); margin-bottom: .3rem; }
  .conf-bars { display: flex; flex-direction: column; gap: .2rem; margin-bottom: .2rem; }
  .bar-wrap { display: flex; align-items: center; gap: .4rem; }
  .bar { height: 6px; border-radius: 3px; min-width: 2px; transition: width .4s ease; }
  .mark-bar { background: linear-gradient(90deg, #7c4dff, #a78bfa); }
  .conf-bar  { background: linear-gradient(90deg, #38bdf8, #7dd3fc); }
  .bar-label { font-size: .6rem; color: var(--muted); font-family: var(--font-head); flex-shrink: 0; }
  .conf-gap-label { font-size: .6rem; font-family: var(--font-head); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

  /* Dimensions */
  .dims-list { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .5rem; }
  .dim-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; transition: border-color .15s;
  }
  .dim-card.open { border-color: rgba(124,77,255,.35); }
  .dim-header {
    width: 100%; display: grid;
    grid-template-columns: 24px 1fr;
    gap: .4rem .6rem;
    padding: .8rem 1rem;
    background: none; border: none; cursor: pointer; text-align: left;
    align-items: center;
  }
  .dim-icon { font-size: 1rem; }
  .dim-label {
    font-family: var(--font-head);
    font-size: .75rem; font-weight: 700; color: var(--text);
    grid-column: 2;
  }
  .dim-stat {
    font-size: .68rem; color: var(--muted); font-weight: 300;
    grid-column: 2;
  }
  .dim-chev { font-size: .55rem; color: var(--muted); grid-column: 2; text-align: right; grid-row: 1; }
  .dim-body {
    padding: 0 1rem .9rem;
    border-top: 1px solid var(--border);
  }
  .dim-text { font-size: .8rem; color: var(--muted); font-weight: 300; line-height: 1.6; margin: .7rem 0 .5rem; }
  .dim-action {
    font-size: .78rem; color: #a78bfa; font-weight: 500;
    line-height: 1.5; padding: .5rem .7rem;
    background: rgba(124,77,255,.08); border-radius: 8px;
  }

  /* Milestone */
  .milestone-card {
    background: rgba(74,222,128,.06);
    border: 1px solid rgba(74,222,128,.2);
    border-radius: 16px; padding: 1.2rem;
    margin-bottom: .5rem;
    animation: fadeUp .6s ease both;
  }
  .ms-date { font-family: var(--font-head); font-size: .7rem; font-weight: 700; color: #4ade80; margin-bottom: .4rem; }
  .ms-target { font-size: .85rem; font-weight: 600; color: var(--text); margin-bottom: .4rem; }
  .ms-note { font-size: .75rem; color: var(--muted); font-weight: 300; line-height: 1.6; }
</style>
