<script lang="ts">
  import { onMount } from 'svelte';
  import { rangeMid } from '$lib/aps';

  interface TestEntry {
    id: string;
    subject: string;
    date: string;
    topic: string;           // e.g. "Functions & Graphs"
    sections: string;        // optional: "Q1 Algebra, Q2 Sequences, Q3 Calculus"
    obtained: number | null;
    total: number;
    term: number;
    notes: string;
    file_name: string;       // optional: name of uploaded/photographed paper
    recorded_at: string;
  }

  const STORAGE_KEY = 'mmm_marks_v1';
  const CURRENT_TERM = (() => {
    const m = new Date().getMonth() + 1;
    if (m <= 3) return 1;
    if (m <= 6) return 2;
    if (m <= 9) return 3;
    return 4;
  })();

  // ── State ──────────────────────────────────────────────────
  let tests: TestEntry[]         = [];
  let assessmentSubjects: string[] = [];
  let activeSubject              = '';
  let showForm                   = false;
  let editingId: string | null   = null;
  let fileInput: HTMLInputElement;

  // Form fields
  let fSubject  = '';
  let fDate     = new Date().toISOString().split('T')[0];
  let fTopic    = '';
  let fSections = '';
  let fObtained = '';
  let fTotal    = '100';
  let fTerm     = CURRENT_TERM;
  let fNotes    = '';
  let fFileName = '';

  // ── Helpers ────────────────────────────────────────────────
  function getSubjectsFromAssessment(): string[] {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (!raw) return [];
      const state = JSON.parse(raw);
      const marks: Record<string, string> = state.subjectMarks || {};
      return Object.entries(marks).filter(([, v]) => v && v !== '').map(([k]) => k);
    } catch { return []; }
  }

  function pct(entry: TestEntry): number | null {
    if (entry.obtained === null || !entry.total) return null;
    return Math.round((entry.obtained / entry.total) * 100);
  }

  function markColor(p: number): string {
    if (p >= 80) return 'var(--accent3)';
    if (p >= 70) return 'var(--accent2)';
    if (p >= 60) return 'var(--accent)';
    if (p >= 50) return 'var(--accent4)';
    return 'var(--danger)';
  }

  function trend(entries: TestEntry[]): 'up' | 'down' | 'flat' | null {
    const withPct = entries
      .filter(e => e.obtained !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => pct(e)!);
    if (withPct.length < 2) return null;
    const last3 = withPct.slice(-3);
    const delta = last3[last3.length - 1] - last3[0];
    if (delta > 3)  return 'up';
    if (delta < -3) return 'down';
    return 'flat';
  }

  function avg(entries: TestEntry[]): number | null {
    const vals = entries.filter(e => e.obtained !== null).map(e => pct(e)!);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    tests = raw ? JSON.parse(raw) : [];
    assessmentSubjects = getSubjectsFromAssessment();
    activeSubject = assessmentSubjects[0] ?? [...new Set(tests.map(t => t.subject))][0] ?? '';
  });

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    tests = [...tests];
  }

  function resetForm() {
    fSubject  = activeSubject || assessmentSubjects[0] || '';
    fDate     = new Date().toISOString().split('T')[0];
    fTopic    = '';
    fSections = '';
    fObtained = '';
    fTotal    = '100';
    fTerm     = CURRENT_TERM;
    fNotes    = '';
    fFileName = '';
    editingId = null;
  }

  function openAdd(subj?: string) {
    resetForm();
    if (subj) fSubject = subj;
    showForm = true;
  }

  function openEdit(e: TestEntry) {
    editingId = e.id;
    fSubject  = e.subject;
    fDate     = e.date;
    fTopic    = e.topic;
    fSections = e.sections;
    fObtained = e.obtained?.toString() ?? '';
    fTotal    = e.total.toString();
    fTerm     = e.term;
    fNotes    = e.notes;
    fFileName = e.file_name;
    showForm  = true;
  }

  function handleFile(evt: Event) {
    const f = (evt.target as HTMLInputElement).files?.[0];
    if (f) fFileName = f.name;
  }

  function saveTest() {
    if (!fSubject || !fDate) return;
    const entry: TestEntry = {
      id:          editingId ?? crypto.randomUUID(),
      subject:     fSubject,
      date:        fDate,
      topic:       fTopic.trim(),
      sections:    fSections.trim(),
      obtained:    fObtained !== '' ? Number(fObtained) : null,
      total:       Number(fTotal) || 100,
      term:        fTerm,
      notes:       fNotes.trim(),
      file_name:   fFileName,
      recorded_at: new Date().toISOString(),
    };
    if (editingId) {
      tests = tests.map(t => t.id === editingId ? entry : t);
    } else {
      tests = [entry, ...tests];
    }
    persist();
    showForm = false;
    resetForm();
  }

  function deleteTest(id: string) {
    tests = tests.filter(t => t.id !== id);
    persist();
  }

  // ── Derived ────────────────────────────────────────────────
  $: subjectList = assessmentSubjects.length
    ? assessmentSubjects
    : [...new Set(tests.map(t => t.subject))];

  $: activeTab = activeSubject || subjectList[0] || '';

  $: tabTests = tests
    .filter(t => t.subject === activeTab)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  $: tabAvg   = avg(tabTests);
  $: tabTrend = trend(tabTests);
</script>

<svelte:head>
  <title>Test Marks — Miyagi My Matric</title>
</svelte:head>

<div class="app">

  <header class="page-header">
    <a href="/dashboard" class="back-link">← Dashboard</a>
    <div class="badge">Test Tracker</div>
    <h1>My Test Marks</h1>
    <p class="subtitle">Log class tests by subject and topic. Spot trends before they become problems.</p>
  </header>

  <!-- Subject tabs -->
  {#if subjectList.length === 0}
    <div class="no-assess-callout">
      <strong>Complete your assessment</strong> to get your subjects auto-loaded.
      <a href="/assessment">Go to assessment →</a>
    </div>
  {:else}
    <div class="subject-tabs">
      {#each subjectList as subj}
        {@const subjTests = tests.filter(t => t.subject === subj)}
        {@const subjAvg   = avg(subjTests)}
        <button
          class="tab-btn"
          class:active={activeTab === subj}
          on:click={() => { activeSubject = subj; }}
        >
          <span class="tab-name">{subj}</span>
          {#if subjAvg !== null}
            <span class="tab-avg" style="color: {markColor(subjAvg)}">{subjAvg}%</span>
          {:else}
            <span class="tab-avg empty">–</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Active subject panel -->
  {#if activeTab}
    <div class="subject-panel">

      <!-- Subject summary bar -->
      <div class="subject-summary">
        <div class="summary-left">
          <span class="summary-subj">{activeTab}</span>
          {#if tabAvg !== null}
            <span class="summary-avg" style="color: {markColor(tabAvg)}">{tabAvg}% avg</span>
          {/if}
          {#if tabTrend === 'up'}
            <span class="trend up">↑ improving</span>
          {:else if tabTrend === 'down'}
            <span class="trend down">↓ declining</span>
          {:else if tabTrend === 'flat'}
            <span class="trend flat">→ steady</span>
          {/if}
        </div>
        <button class="btn-add" on:click={() => openAdd(activeTab)}>+ Add test</button>
      </div>

      <!-- Test entries -->
      {#if tabTests.length === 0}
        <div class="empty-card">
          <p>No tests logged for {activeTab} yet.</p>
          <button class="btn btn-next" on:click={() => openAdd(activeTab)}>Log first test</button>
        </div>
      {:else}
        <div class="test-list">
          {#each tabTests as entry}
            {@const p = pct(entry)}
            <div class="test-card">
              <div class="test-top">
                <div class="test-left">
                  <span class="test-date">{new Date(entry.date).toLocaleDateString('en-ZA', {day:'numeric', month:'short'})}</span>
                  <span class="test-term">T{entry.term}</span>
                  {#if entry.topic}
                    <span class="test-topic">{entry.topic}</span>
                  {/if}
                </div>
                <div class="test-right">
                  {#if p !== null}
                    <span class="test-pct" style="color: {markColor(p)}">{p}%</span>
                    <span class="test-raw">{entry.obtained}/{entry.total}</span>
                  {:else}
                    <span class="test-pct muted">–/%</span>
                    <span class="test-raw">/{entry.total}</span>
                  {/if}
                </div>
              </div>

              {#if entry.sections}
                <div class="test-sections">
                  <span class="sections-label">Sections:</span> {entry.sections}
                </div>
              {/if}

              {#if entry.file_name}
                <div class="test-file">📎 {entry.file_name}</div>
              {/if}

              {#if entry.notes}
                <div class="test-notes">{entry.notes}</div>
              {/if}

              <div class="test-actions">
                <button class="action-btn" on:click={() => openEdit(entry)}>Edit</button>
                <button class="action-btn danger" on:click={() => deleteTest(entry.id)}>Delete</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    </div>
  {/if}

</div>

<!-- Modal -->
{#if showForm}
  <div class="modal-backdrop" role="presentation"
    on:click|self={() => { showForm = false; resetForm(); }}
    on:keydown={() => {}}
  >
    <div class="modal">
      <h3>{editingId ? 'Edit Test' : 'Log Test'}</h3>

      <!-- Subject + Date -->
      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Subject</label>
          <select class="select-input" bind:value={fSubject}>
            {#each subjectList as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Date written</label>
          <input class="text-input" type="date" bind:value={fDate} />
        </div>
      </div>

      <!-- Topic -->
      <div class="form-field">
        <label class="field-label">Topic / Chapter</label>
        <input class="text-input" type="text" placeholder="e.g. Functions & Graphs, Calculus" bind:value={fTopic} />
      </div>

      <!-- Sections tested (optional) -->
      <div class="form-field">
        <label class="field-label">Sections tested <span class="optional">optional</span></label>
        <input class="text-input" type="text" placeholder="e.g. Q1 Algebra, Q2 Sequences, Q3 Euclidean Geom" bind:value={fSections} />
      </div>

      <!-- Mark -->
      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Mark obtained</label>
          <input class="text-input" type="number" min="0" placeholder="e.g. 68" bind:value={fObtained} />
        </div>
        <div class="form-field">
          <label class="field-label">Out of</label>
          <input class="text-input" type="number" min="1" placeholder="100" bind:value={fTotal} />
        </div>
      </div>

      {#if fObtained !== '' && Number(fTotal) > 0}
        {@const preview = Math.round((Number(fObtained) / Number(fTotal)) * 100)}
        <div class="mark-preview" style="color: {markColor(preview)}">
          {preview}% — {preview >= 80 ? 'Distinction' : preview >= 70 ? 'Merit' : preview >= 60 ? 'Achievement' : preview >= 50 ? 'Achieved' : preview >= 40 ? 'Adequate' : 'Not Achieved'}
        </div>
      {/if}

      <!-- Term -->
      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Term</label>
          <select class="select-input" bind:value={fTerm}>
            <option value={1}>Term 1</option>
            <option value={2}>Term 2</option>
            <option value={3}>Term 3</option>
            <option value={4}>Term 4</option>
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Paper / file <span class="optional">optional</span></label>
          <div class="file-row">
            <input
              class="text-input file-name-display"
              type="text"
              placeholder="No file selected"
              bind:value={fFileName}
              readonly
            />
            <button class="file-btn" on:click={() => fileInput.click()}>📎</button>
          </div>
          <input
            bind:this={fileInput}
            type="file"
            accept="image/*,.pdf"
            style="display:none"
            on:change={handleFile}
          />
          <p class="file-hint">Tap 📎 to attach a photo of your test paper</p>
        </div>
      </div>

      <!-- Notes -->
      <div class="form-field">
        <label class="field-label">Notes <span class="optional">optional</span></label>
        <input class="text-input" type="text" placeholder="e.g. Struggled with section B, redo Euclidean" bind:value={fNotes} />
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" on:click={() => { showForm = false; resetForm(); }}>Cancel</button>
        <button class="btn btn-next" disabled={!fSubject || !fDate} on:click={saveTest}>
          {editingId ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 5rem; position: relative; z-index: 1; }

  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.8rem; margin-bottom: 1rem; transition: color 0.2s; font-family: var(--font-head); font-weight: 500; }
  .back-link:hover { color: var(--text); }
  .badge { display: inline-block; background: rgba(105,180,255,.12); color: var(--accent2); border: 1px solid rgba(105,180,255,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.85rem; max-width: 500px; margin: 0 auto; line-height: 1.6; }

  /* No assessment */
  .no-assess-callout { background: rgba(245,245,106,.06); border: 1px solid rgba(245,245,106,.2); border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--text); margin-bottom: 1rem; }
  .no-assess-callout a { color: var(--accent2); text-decoration: none; margin-left: 0.5rem; }

  /* Subject tabs */
  .subject-tabs { display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.1rem; margin-bottom: 1rem; flex-wrap: nowrap; }
  .subject-tabs::-webkit-scrollbar { display: none; }

  .tab-btn { flex-shrink: 0; display: flex; align-items: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 100px; padding: 0.4rem 0.85rem; font-family: var(--font-head); font-size: 0.72rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .tab-btn:hover { border-color: var(--accent2); color: var(--text); }
  .tab-btn.active { border-color: var(--accent2); color: var(--accent2); background: rgba(105,180,255,.08); }

  .tab-name { max-width: 110px; overflow: hidden; text-overflow: ellipsis; }
  .tab-avg { font-family: var(--font-head); font-size: 0.68rem; font-weight: 700; }
  .tab-avg.empty { color: var(--muted); }

  /* Subject panel */
  .subject-panel { animation: fadeUp 0.3s ease both; }

  .subject-summary { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem; gap: 1rem; }
  .summary-left { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .summary-subj { font-family: var(--font-head); font-size: 0.85rem; font-weight: 700; color: var(--text); }
  .summary-avg  { font-family: var(--font-head); font-size: 0.82rem; font-weight: 700; }
  .trend { font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 100px; }
  .trend.up   { background: rgba(122,255,122,.15); color: var(--accent3); }
  .trend.down { background: rgba(255,82,82,.15);  color: var(--danger); }
  .trend.flat { background: rgba(105,180,255,.12); color: var(--accent2); }

  .btn-add { flex-shrink: 0; background: var(--grad-cta); color: #07070B; border: none; border-radius: 100px; padding: 0.4rem 1rem; font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; cursor: pointer; }

  /* Empty */
  .empty-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; text-align: center; }
  .empty-card p { color: var(--muted); font-size: 0.875rem; margin-bottom: 1rem; }

  /* Test list */
  .test-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .test-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.9rem 1.1rem; }

  .test-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; gap: 0.5rem; }
  .test-left { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; flex: 1; }
  .test-date  { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: var(--muted); }
  .test-term  { font-size: 0.62rem; background: var(--surface2); color: var(--muted); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: var(--font-head); font-weight: 700; }
  .test-topic { font-size: 0.82rem; font-weight: 600; color: var(--text); }

  .test-right { display: flex; align-items: baseline; gap: 0.35rem; flex-shrink: 0; }
  .test-pct  { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; line-height: 1; }
  .test-pct.muted { color: var(--muted); }
  .test-raw  { font-size: 0.72rem; color: var(--muted); }

  .test-sections { font-size: 0.75rem; color: var(--muted); margin: 0.3rem 0; line-height: 1.5; }
  .sections-label { font-family: var(--font-head); font-weight: 700; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent2); margin-right: 0.25rem; }

  .test-file  { font-size: 0.72rem; color: var(--muted); margin: 0.25rem 0; }
  .test-notes { font-size: 0.72rem; color: var(--muted); font-style: italic; margin: 0.25rem 0; }

  .test-actions { display: flex; gap: 0.35rem; margin-top: 0.5rem; }
  .action-btn { font-size: 0.68rem; font-family: var(--font-head); font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .action-btn:hover { border-color: var(--accent2); color: var(--accent2); }
  .action-btn.danger:hover { border-color: var(--danger); color: var(--danger); }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  @media (min-width: 520px) { .modal-backdrop { align-items: center; padding: 1rem; } }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px 20px 0 0; padding: 1.5rem 1.5rem 2rem; width: 100%; max-width: 480px; animation: slideUp 0.22s ease both; max-height: 92vh; overflow-y: auto; }
  @media (min-width: 520px) { .modal { border-radius: 16px; } }
  .modal h3 { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--accent2); margin: 0 0 1.25rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-field { margin-bottom: 0.75rem; }
  .field-label { display: block; font-size: 0.68rem; font-family: var(--font-head); font-weight: 700; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.3rem; }
  .optional { font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 0.65rem; color: var(--muted); }
  .select-input, .text-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 0.55rem 0.75rem; font-size: 0.875rem; font-family: var(--font-body); box-sizing: border-box; outline: none; }
  .select-input:focus, .text-input:focus { border-color: var(--accent2); }

  .mark-preview { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; text-align: center; padding: 0.4rem; margin: -0.25rem 0 0.75rem; }

  .file-row { display: flex; gap: 0.4rem; }
  .file-name-display { flex: 1; cursor: default; font-size: 0.78rem; color: var(--muted); }
  .file-btn { flex-shrink: 0; width: 38px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; font-size: 1rem; cursor: pointer; }
  .file-hint { font-size: 0.65rem; color: var(--muted); margin-top: 0.25rem; }

  .modal-actions { display: flex; gap: 0.75rem; margin-top: 0.25rem; }
  .btn { flex: 1; font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.75rem 1rem; cursor: pointer; font-size: 0.875rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-next { background: var(--grad-cta); color: #07070B; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp   { from { opacity: 0; transform: translateY(12px);  } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp  { from { opacity: 0; transform: translateY(40px);  } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 480px) {
    .form-row { grid-template-columns: 1fr; }
    .subject-summary { flex-direction: column; align-items: flex-start; }
  }
</style>
