<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // ── Config ─────────────────────────────────────────────────
  const STUDY_MINS = 50;
  const BREAK_MINS = 10;
  const LONG_BREAK_MINS = 30;
  const CYCLES_BEFORE_LONG = 4;

  const SUBJECTS = [
    'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences',
    'English HL', 'English FAL', 'Accounting', 'Business Studies',
    'History', 'Geography', 'Afrikaans', 'Information Technology',
    'Economics', 'Life Orientation', 'Other Subject'
  ];

  type SessionType = 'study' | 'revision' | 'past_paper';
  type Phase = 'study' | 'break' | 'long_break';

  interface LogEntry {
    id: string;
    subject: string;
    session_type: SessionType;
    duration_mins: number;
    completed_at: string;
  }

  const STORAGE_KEY = 'mmm_pomodoro_log_v1';

  // ── State ──────────────────────────────────────────────────
  let phase: Phase = 'study';
  let cycleCount = 0;
  let secondsLeft = STUDY_MINS * 60;
  let running = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  let selectedSubject = SUBJECTS[0];
  let selectedType: SessionType = 'study';
  let log: LogEntry[] = [];

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    log = raw ? JSON.parse(raw) : [];
  });

  onDestroy(() => { if (intervalId) clearInterval(intervalId); });

  function totalMins(phase: Phase): number {
    if (phase === 'study') return STUDY_MINS;
    if (phase === 'break') return BREAK_MINS;
    return LONG_BREAK_MINS;
  }

  function start() {
    running = true;
    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    running = false;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  function tick() {
    secondsLeft--;
    if (secondsLeft <= 0) {
      handlePhaseEnd();
    }
  }

  function handlePhaseEnd() {
    pause();
    if (phase === 'study') {
      // Log the completed study session
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        subject: selectedSubject,
        session_type: selectedType,
        duration_mins: STUDY_MINS,
        completed_at: new Date().toISOString()
      };
      log = [entry, ...log];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));

      cycleCount++;
      if (cycleCount % CYCLES_BEFORE_LONG === 0) {
        phase = 'long_break';
        secondsLeft = LONG_BREAK_MINS * 60;
      } else {
        phase = 'break';
        secondsLeft = BREAK_MINS * 60;
      }
    } else {
      phase = 'study';
      secondsLeft = STUDY_MINS * 60;
    }
  }

  function reset() {
    pause();
    phase = 'study';
    secondsLeft = STUDY_MINS * 60;
  }

  function skipPhase() {
    pause();
    handlePhaseEnd();
  }

  function formatTime(secs: number): string {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  $: progress = 1 - secondsLeft / (totalMins(phase) * 60);
  $: circumference = 2 * Math.PI * 80; // r=80
  $: dashOffset = circumference * (1 - progress);

  $: phaseLabel = phase === 'study' ? 'Study Session' : phase === 'break' ? 'Short Break' : 'Long Break';
  $: phaseColor = phase === 'study' ? 'var(--accent)' : phase === 'break' ? 'var(--accent2)' : 'var(--accent3)';

  $: todayLog = log.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.completed_at).toDateString() === today;
  });
  $: todayMins = todayLog.reduce((acc, e) => acc + e.duration_mins, 0);
</script>

<svelte:head>
  <title>Pomodoro Timer — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">50/10 Format</div>
    <h1>Pomodoro Timer</h1>
    <p class="subtitle">50 minutes focused study · 10 minutes break · Every 4 cycles: 30 min rest</p>
  </header>

  <!-- Subject picker -->
  <div class="picker-row">
    <div class="picker-field">
      <label class="field-label">Subject</label>
      <select class="select-input" bind:value={selectedSubject} disabled={running}>
        {#each SUBJECTS as s}<option value={s}>{s}</option>{/each}
      </select>
    </div>
    <div class="picker-field">
      <label class="field-label">Session type</label>
      <select class="select-input" bind:value={selectedType} disabled={running}>
        <option value="study">New Content</option>
        <option value="revision">Revision</option>
        <option value="past_paper">Past Paper</option>
      </select>
    </div>
  </div>

  <!-- Timer ring -->
  <div class="timer-card">
    <div class="phase-badge" style="color: {phaseColor}">{phaseLabel}</div>
    <div class="cycle-info">Cycle {Math.floor(cycleCount / 1) + (phase === 'study' ? 1 : 0)} · {CYCLES_BEFORE_LONG - (cycleCount % CYCLES_BEFORE_LONG)} until long break</div>

    <div class="ring-wrap">
      <svg viewBox="0 0 200 200" width="220" height="220">
        <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border)" stroke-width="10"/>
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke={phaseColor}
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="{circumference}"
          stroke-dashoffset="{dashOffset}"
          transform="rotate(-90 100 100)"
          style="transition: stroke-dashoffset 1s linear, stroke 0.3s ease;"
        />
      </svg>
      <div class="timer-display">
        <span class="timer-time">{formatTime(secondsLeft)}</span>
        <span class="timer-phase">{phase === 'study' ? selectedSubject.split(' ')[0] : 'Break'}</span>
      </div>
    </div>

    <div class="timer-controls">
      {#if !running}
        <button class="btn btn-next" on:click={start}>
          {secondsLeft === totalMins(phase) * 60 ? '▶ Start' : '▶ Resume'}
        </button>
      {:else}
        <button class="btn btn-outline" on:click={pause}>⏸ Pause</button>
      {/if}
      <button class="btn btn-outline" on:click={reset}>↺ Reset</button>
      <button class="btn btn-outline" on:click={skipPhase}>Skip →</button>
    </div>
  </div>

  <!-- Today's log -->
  <div class="log-card">
    <div class="log-header">
      <span class="log-title">Today's Sessions</span>
      <span class="log-total">{todayMins} mins studied</span>
    </div>
    {#if todayLog.length === 0}
      <p class="empty-log">No sessions logged today. Start a timer to track your study time.</p>
    {:else}
      <ul class="log-list">
        {#each todayLog as entry}
          <li class="log-entry">
            <span class="log-subject">{entry.subject}</span>
            <span class="log-type">{entry.session_type === 'past_paper' ? 'Past Paper' : entry.session_type === 'revision' ? 'Revision' : 'Study'}</span>
            <span class="log-time">{new Date(entry.completed_at).toLocaleTimeString('en-ZA', {hour:'2-digit',minute:'2-digit'})}</span>
            <span class="log-dur">{entry.duration_mins}m</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="tips">
    <p>💡 <strong>Wax on, wax off.</strong> Consistent 50-minute blocks beat 5-hour cramming sessions. Aim for 4–6 cycles per day during exam prep.</p>
  </div>
</div>

<style>
  .app { max-width: 600px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; z-index: 1; }

  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }
  .badge { display: inline-block; background: rgba(255,82,82,.12); color: var(--accent); border: 1px solid rgba(255,82,82,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 440px; margin: 0 auto; }

  /* Picker */
  .picker-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; animation: fadeUp 0.4s ease both; }
  .picker-field {}
  .field-label { display: block; font-size: 0.72rem; font-family: var(--font-head); font-weight: 600; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.35rem; }
  .select-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 0.55rem 0.75rem; font-size: 0.875rem; font-family: var(--font-body); }

  /* Timer card */
  .timer-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem 1.5rem; text-align: center; margin-bottom: 1rem; animation: fadeUp 0.4s ease both; }

  .phase-badge { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.25rem; }
  .cycle-info { font-size: 0.75rem; color: var(--muted); margin-bottom: 1rem; }

  .ring-wrap { position: relative; width: 220px; height: 220px; margin: 0 auto 1.5rem; }
  .ring-wrap svg { display: block; }

  .timer-display { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .timer-time { font-family: var(--font-head); font-size: 3rem; font-weight: 800; color: var(--text); line-height: 1; }
  .timer-phase { font-size: 0.75rem; color: var(--muted); margin-top: 0.25rem; }

  .timer-controls { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

  .btn { font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.7rem 1.5rem; cursor: pointer; font-size: 0.875rem; transition: opacity 0.2s, transform 0.15s; }
  .btn:hover { transform: translateY(-1px); }
  .btn-next { background: var(--accent); color: #0d1117; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  /* Log */
  .log-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; animation: fadeUp 0.5s ease both; }
  .log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .log-title { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; color: var(--text); }
  .log-total { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; color: var(--accent); }
  .empty-log { font-size: 0.82rem; color: var(--muted); margin: 0; }
  .log-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem; }
  .log-entry { display: flex; align-items: center; gap: 0.75rem; padding: 0.4rem 0.6rem; background: var(--surface2); border-radius: 8px; font-size: 0.8rem; }
  .log-subject { flex: 1; font-weight: 500; color: var(--text); }
  .log-type { color: var(--muted); font-size: 0.72rem; }
  .log-time { color: var(--muted); font-size: 0.72rem; }
  .log-dur { font-family: var(--font-head); font-weight: 700; color: var(--accent3); font-size: 0.78rem; }

  .tips { font-size: 0.82rem; color: var(--muted); text-align: center; padding: 0.5rem; }
  .tips strong { color: var(--text); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 480px) {
    .picker-row { grid-template-columns: 1fr; }
  }
</style>
