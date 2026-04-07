<script lang="ts">
  import { onMount } from 'svelte';

  // ── Types ──────────────────────────────────────────────────
  type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  type Slot = { subject: string; type: 'study' | 'revision' | 'past_paper' | 'break' };
  type Timetable = Record<Day, Record<string, Slot | null>>;

  const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const SUBJECTS = [
    'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences',
    'English HL', 'English FAL', 'Accounting', 'Business Studies',
    'History', 'Geography', 'Afrikaans', 'Information Technology',
    'Economics', 'Other Subject'
  ];

  const SESSION_TYPES = [
    { value: 'study',      label: 'New Content',  color: '#38bdf8' },
    { value: 'revision',   label: 'Revision',     color: '#f6c90e' },
    { value: 'past_paper', label: 'Past Paper',   color: '#4ade80' },
    { value: 'break',      label: 'Break',        color: '#8899a6' }
  ];

  // ── State ──────────────────────────────────────────────────
  let timetable: Timetable = {} as Timetable;
  let editing: { day: Day; time: string } | null = null;
  let editSubject = SUBJECTS[0];
  let editType: Slot['type'] = 'study';
  let saved = false;

  const STORAGE_KEY = 'mmm_timetable_v1';

  function emptyTimetable(): Timetable {
    const t = {} as Timetable;
    for (const day of DAYS) {
      t[day] = {};
      for (const time of TIME_SLOTS) {
        t[day][time] = null;
      }
    }
    return t;
  }

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    timetable = raw ? JSON.parse(raw) : emptyTimetable();
  });

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
    saved = true;
    setTimeout(() => saved = false, 1500);
  }

  function openEdit(day: Day, time: string) {
    editing = { day, time };
    const existing = timetable[day]?.[time];
    editSubject = existing?.subject ?? SUBJECTS[0];
    editType = existing?.type ?? 'study';
  }

  function saveSlot() {
    if (!editing) return;
    timetable[editing.day][editing.time] = { subject: editSubject, type: editType };
    timetable = { ...timetable };
    persist();
    editing = null;
  }

  function clearSlot() {
    if (!editing) return;
    timetable[editing.day][editing.time] = null;
    timetable = { ...timetable };
    persist();
    editing = null;
  }

  function slotColor(slot: Slot | null): string {
    if (!slot) return 'transparent';
    return SESSION_TYPES.find(t => t.value === slot.type)?.color ?? '#8899a6';
  }

  function slotLabel(slot: Slot | null): string {
    if (!slot) return '';
    return SESSION_TYPES.find(t => t.value === slot.type)?.label ?? '';
  }

  // Weekly study hour count
  $: totalHours = Object.values(timetable).reduce((acc, day) =>
    acc + Object.values(day).filter(s => s && s.type !== 'break').length, 0);
</script>

<svelte:head>
  <title>Timetable — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">Weekly Planner</div>
    <h1>Study Timetable</h1>
    <p class="subtitle">Click any block to add a study session. SA educators recommend 50 min study + 10 min break.</p>
  </header>

  <!-- Stats bar -->
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-num">{totalHours}</span>
      <span class="stat-label">study hours/week</span>
    </div>
    <div class="legend">
      {#each SESSION_TYPES as t}
        <span class="legend-item">
          <span class="legend-dot" style="background: {t.color}"></span>
          {t.label}
        </span>
      {/each}
    </div>
    {#if saved}
      <span class="saved-badge">✓ Saved</span>
    {/if}
  </div>

  <!-- Grid -->
  <div class="grid-wrap">
    <div class="grid" style="grid-template-columns: 56px repeat({DAYS.length}, 1fr)">
      <!-- Header row -->
      <div class="grid-corner"></div>
      {#each DAYS as day}
        <div class="grid-day">{day}</div>
      {/each}

      <!-- Time rows -->
      {#each TIME_SLOTS as time}
        <div class="grid-time">{time}</div>
        {#each DAYS as day}
          {@const slot = timetable[day]?.[time] ?? null}
          <button
            class="grid-cell"
            class:filled={slot !== null}
            style="border-left: 3px solid {slotColor(slot)}; background: {slot ? slotColor(slot) + '18' : 'transparent'}"
            on:click={() => openEdit(day, time)}
          >
            {#if slot}
              <span class="cell-subject">{slot.subject.split(' ')[0]}</span>
              <span class="cell-type">{slotLabel(slot)}</span>
            {/if}
          </button>
        {/each}
      {/each}
    </div>
  </div>

  <p class="tip">💡 Tip: Use the 50/10 Pomodoro format — 50 minutes focused study, 10 minutes break. 4 cycles then a 30-minute rest.</p>
</div>

<!-- Edit modal -->
{#if editing}
  <div class="modal-backdrop" on:click|self={() => editing = null}>
    <div class="modal">
      <h3>{editing.day} · {editing.time}</h3>

      <label class="field-label">Subject</label>
      <select class="select-input" bind:value={editSubject}>
        {#each SUBJECTS as s}
          <option value={s}>{s}</option>
        {/each}
      </select>

      <label class="field-label">Session type</label>
      <div class="type-grid">
        {#each SESSION_TYPES as t}
          <button
            class="type-btn"
            class:selected={editType === t.value}
            style="border-color: {editType === t.value ? t.color : 'var(--border)'}; color: {editType === t.value ? t.color : 'var(--muted)'}"
            on:click={() => editType = t.value as Slot['type']}
          >
            {t.label}
          </button>
        {/each}
      </div>

      <div class="modal-actions">
        <button class="btn btn-danger" on:click={clearSlot}>Clear</button>
        <button class="btn btn-next" on:click={saveSlot}>Save</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    position: relative;
    z-index: 1;
  }

  .page-header {
    text-align: center;
    margin-bottom: 1.5rem;
    animation: fadeDown 0.5s ease both;
  }

  .back-link {
    display: inline-block;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--accent2); }

  .badge {
    display: inline-block;
    background: rgba(246,201,14,.12);
    color: var(--accent);
    border: 1px solid rgba(246,201,14,.25);
    border-radius: 999px;
    padding: 0.3rem 1rem;
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 800;
    color: var(--text);
    margin: 0 0 0.5rem;
  }

  .subtitle {
    color: var(--muted);
    font-size: 0.875rem;
    max-width: 500px;
    margin: 0 auto;
  }

  /* Stats bar */
  .stats-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    animation: fadeUp 0.4s ease both;
  }

  .stat { display: flex; align-items: baseline; gap: 0.4rem; }
  .stat-num {
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--accent);
  }
  .stat-label { font-size: 0.78rem; color: var(--muted); }

  .legend { display: flex; gap: 1rem; flex-wrap: wrap; margin-left: auto; }
  .legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: var(--muted); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .saved-badge {
    font-size: 0.78rem;
    color: var(--accent3);
    font-weight: 600;
    animation: fadeIn 0.2s ease;
  }

  /* Grid */
  .grid-wrap {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid var(--border);
    animation: fadeUp 0.4s ease both;
  }

  .grid {
    display: grid;
    min-width: 600px;
  }

  .grid-corner { background: var(--surface2); border-bottom: 1px solid var(--border); }
  .grid-day {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    border-left: 1px solid var(--border);
    padding: 0.5rem 0.25rem;
    text-align: center;
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.05em;
  }

  .grid-time {
    background: var(--surface2);
    border-top: 1px solid var(--border);
    padding: 0.35rem 0.5rem;
    font-size: 0.65rem;
    color: var(--muted);
    text-align: right;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .grid-cell {
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
    min-height: 48px;
    padding: 0.25rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    transition: background 0.15s;
    background: transparent;
    color: var(--text);
    text-align: left;
  }

  .grid-cell:hover { background: rgba(246,201,14,.06) !important; }

  .cell-subject {
    font-family: var(--font-head);
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .cell-type {
    font-size: 0.6rem;
    color: var(--muted);
    line-height: 1.2;
  }

  /* Tip */
  .tip {
    text-align: center;
    font-size: 0.8rem;
    color: var(--muted);
    margin-top: 1rem;
    animation: fadeUp 0.5s ease both;
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.6);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
    width: 100%;
    max-width: 360px;
    animation: fadeUp 0.2s ease both;
  }

  .modal h3 {
    font-family: var(--font-head);
    font-size: 1rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0 0 1.25rem;
  }

  .field-label {
    display: block;
    font-size: 0.75rem;
    font-family: var(--font-head);
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .select-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    padding: 0.6rem 0.75rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    font-family: var(--font-body);
  }

  .type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .type-btn {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface2);
    font-size: 0.8rem;
    font-family: var(--font-head);
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    flex: 1;
    font-family: var(--font-head);
    font-weight: 700;
    border: none;
    border-radius: var(--radius);
    padding: 0.7rem 1rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;
  }

  .btn-next { background: var(--accent); color: #0d1117; }
  .btn-danger { background: rgba(248,113,113,.15); color: var(--danger); border: 1px solid rgba(248,113,113,.3); }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>
