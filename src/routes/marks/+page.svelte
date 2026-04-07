<script lang="ts">
  import { onMount } from 'svelte';
  import { computeAPS } from '$lib/aps';

  type MarkType = 'sba' | 'prelim' | 'final' | 'test' | 'assignment' | 'other';

  interface MarkEntry {
    id: string;
    subject: string;
    mark_type: MarkType;
    percentage: number;
    term: number;
    year: number;
    notes: string;
    recorded_at: string;
  }

  const SUBJECTS = [
    'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences',
    'English HL', 'English FAL', 'Accounting', 'Business Studies',
    'History', 'Geography', 'Afrikaans', 'Information Technology',
    'Economics', 'Life Orientation', 'Other Subject'
  ];

  const MARK_TYPES: { value: MarkType; label: string }[] = [
    { value: 'sba',        label: 'SBA / School Mark' },
    { value: 'prelim',     label: 'Prelim Exam' },
    { value: 'final',      label: 'Final Exam' },
    { value: 'test',       label: 'Class Test' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'other',      label: 'Other' }
  ];

  const STORAGE_KEY = 'mmm_marks_v1';
  const CURRENT_YEAR = new Date().getFullYear();

  // ── State ──────────────────────────────────────────────────
  let marks: MarkEntry[] = [];
  let showForm = false;
  let editingId: string | null = null;

  let fSubject = SUBJECTS[0];
  let fType: MarkType = 'sba';
  let fPct = '';
  let fTerm = 2;
  let fYear = CURRENT_YEAR;
  let fNotes = '';

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    marks = raw ? JSON.parse(raw) : [];
  });

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
    marks = [...marks];
  }

  function resetForm() {
    fSubject = SUBJECTS[0]; fType = 'sba'; fPct = '';
    fTerm = 2; fYear = CURRENT_YEAR; fNotes = '';
    editingId = null;
  }

  function openAdd() { resetForm(); showForm = true; }

  function openEdit(m: MarkEntry) {
    editingId = m.id;
    fSubject = m.subject; fType = m.mark_type;
    fPct = m.percentage.toString(); fTerm = m.term;
    fYear = m.year; fNotes = m.notes;
    showForm = true;
  }

  function saveMark() {
    const pct = Number(fPct);
    if (!fPct || pct < 0 || pct > 100) return;
    const entry: MarkEntry = {
      id: editingId ?? crypto.randomUUID(),
      subject: fSubject,
      mark_type: fType,
      percentage: pct,
      term: fTerm,
      year: fYear,
      notes: fNotes.trim(),
      recorded_at: new Date().toISOString()
    };
    if (editingId) {
      marks = marks.map(m => m.id === editingId ? entry : m);
    } else {
      marks = [entry, ...marks];
    }
    persist();
    showForm = false;
    resetForm();
  }

  function deleteMark(id: string) {
    marks = marks.filter(m => m.id !== id);
    persist();
  }

  // Best mark per subject (for APS estimate)
  $: bestBySubject = SUBJECTS.reduce((acc, subj) => {
    const subjectMarks = marks.filter(m => m.subject === subj && (m.mark_type === 'sba' || m.mark_type === 'prelim' || m.mark_type === 'final'));
    if (subjectMarks.length) {
      acc[subj] = Math.max(...subjectMarks.map(m => m.percentage)).toString();
    }
    return acc;
  }, {} as Record<string, string>);

  $: apsEstimate = computeAPS(bestBySubject);

  function markColor(pct: number): string {
    if (pct >= 80) return 'var(--accent3)';
    if (pct >= 70) return 'var(--accent2)';
    if (pct >= 60) return 'var(--accent)';
    if (pct >= 50) return '#f59e0b';
    return 'var(--danger)';
  }

  function markGrade(pct: number): string {
    if (pct >= 80) return 'Distinction';
    if (pct >= 70) return 'Merit';
    if (pct >= 60) return 'Achievement';
    if (pct >= 50) return 'Achieved';
    if (pct >= 40) return 'Adequate';
    if (pct >= 30) return 'Elementary';
    return 'Not Achieved';
  }

  // Group by subject for the overview
  $: bySubject = SUBJECTS.map(subj => {
    const subjectMarks = marks.filter(m => m.subject === subj);
    return { subj, marks: subjectMarks };
  }).filter(g => g.marks.length > 0);

  // Recent entries
  $: recent = [...marks].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()).slice(0, 20);
</script>

<svelte:head>
  <title>Marks — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">Mark Tracker</div>
    <h1>My Marks</h1>
    <p class="subtitle">Track SBA tasks, tests, prelims, and finals. Your APS updates live as you add marks.</p>
  </header>

  <!-- APS summary -->
  {#if marks.length > 0}
    <div class="aps-banner">
      <div class="aps-left">
        <span class="aps-num">{apsEstimate.total}</span>
        <span class="aps-label">/ 42 APS (estimated from best marks)</span>
      </div>
      <button class="btn btn-next add-btn" on:click={openAdd}>+ Add Mark</button>
    </div>
  {:else}
    <div class="empty-hero">
      <p>No marks recorded yet. Add your first mark to start tracking your APS.</p>
      <button class="btn btn-next" on:click={openAdd}>+ Add your first mark</button>
    </div>
  {/if}

  <!-- SBA vs Exam explainer -->
  <div class="explainer">
    <div class="explainer-item">
      <span class="explainer-pct accent">25%</span>
      <div>
        <strong>SBA</strong>
        <p>Tests, assignments, projects, practicals, orals — all school-based work</p>
      </div>
    </div>
    <div class="divider"></div>
    <div class="explainer-item">
      <span class="explainer-pct muted">75%</span>
      <div>
        <strong>Final Exam</strong>
        <p>November papers · 80% SBA → only need 53% in exam to pass with 60%</p>
      </div>
    </div>
  </div>

  <!-- By subject overview -->
  {#if bySubject.length > 0}
    <div class="section-head">Subject overview</div>
    <div class="subject-grid">
      {#each bySubject as { subj, marks: sm }}
        {@const best = Math.max(...sm.map(m => m.percentage))}
        {@const latest = sm.sort((a,b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0]}
        <div class="subject-card">
          <div class="subject-name">{subj}</div>
          <div class="subject-pct" style="color: {markColor(latest.percentage)}">{latest.percentage}%</div>
          <div class="subject-grade">{markGrade(latest.percentage)}</div>
          <div class="subject-meta">{sm.length} mark{sm.length > 1 ? 's' : ''} · best: {best}%</div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Recent marks table -->
  {#if recent.length > 0}
    <div class="section-head" style="margin-top: 1.5rem">All marks</div>
    <div class="marks-table">
      {#each recent as m}
        <div class="mark-row">
          <div class="mark-info">
            <span class="mark-subject">{m.subject}</span>
            <span class="mark-type-badge">{MARK_TYPES.find(t => t.value === m.mark_type)?.label}</span>
            <span class="mark-term">T{m.term} {m.year}</span>
          </div>
          <div class="mark-right">
            <span class="mark-pct" style="color: {markColor(m.percentage)}">{m.percentage}%</span>
            <button class="icon-btn" on:click={() => openEdit(m)}>✎</button>
            <button class="icon-btn danger" on:click={() => deleteMark(m.id)}>✕</button>
          </div>
        </div>
        {#if m.notes}
          <div class="mark-notes">{m.notes}</div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if marks.length > 0}
    <div class="add-more">
      <button class="btn btn-outline" on:click={openAdd}>+ Add another mark</button>
    </div>
  {/if}
</div>

<!-- Modal -->
{#if showForm}
  <div class="modal-backdrop" on:click|self={() => { showForm = false; resetForm(); }}>
    <div class="modal">
      <h3>{editingId ? 'Edit Mark' : 'Add Mark'}</h3>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Subject</label>
          <select class="select-input" bind:value={fSubject}>
            {#each SUBJECTS as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Type</label>
          <select class="select-input" bind:value={fType}>
            {#each MARK_TYPES as t}<option value={t.value}>{t.label}</option>{/each}
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Percentage (%)</label>
          <input class="text-input" type="number" min="0" max="100" placeholder="e.g. 72" bind:value={fPct} />
        </div>
        <div class="form-field">
          <label class="field-label">Term</label>
          <select class="select-input" bind:value={fTerm}>
            <option value={1}>Term 1</option>
            <option value={2}>Term 2</option>
            <option value={3}>Term 3</option>
            <option value={4}>Term 4</option>
          </select>
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Notes (optional)</label>
        <input class="text-input" type="text" placeholder="e.g. Functions chapter, poor section B" bind:value={fNotes} />
      </div>

      {#if fPct && Number(fPct) >= 0}
        <div class="mark-preview" style="color: {markColor(Number(fPct))}">
          {Number(fPct)}% — {markGrade(Number(fPct))}
        </div>
      {/if}

      <div class="modal-actions">
        <button class="btn btn-outline" on:click={() => { showForm = false; resetForm(); }}>Cancel</button>
        <button class="btn btn-next" disabled={!fPct || Number(fPct) < 0 || Number(fPct) > 100} on:click={saveMark}>
          {editingId ? 'Update' : 'Save Mark'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; z-index: 1; }
  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }
  .badge { display: inline-block; background: rgba(246,201,14,.12); color: var(--accent); border: 1px solid rgba(246,201,14,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto; }

  /* APS banner */
  .aps-banner { display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; animation: fadeUp 0.4s ease both; gap: 1rem; flex-wrap: wrap; }
  .aps-left { display: flex; align-items: baseline; gap: 0.5rem; }
  .aps-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; color: var(--accent); }
  .aps-label { font-size: 0.8rem; color: var(--muted); }
  .add-btn { padding: 0.5rem 1.25rem; font-size: 0.85rem; white-space: nowrap; }

  /* Empty */
  .empty-hero { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2.5rem; text-align: center; margin-bottom: 1rem; animation: fadeUp 0.4s ease both; }
  .empty-hero p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.25rem; }

  /* SBA explainer */
  .explainer { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; gap: 1rem; animation: fadeUp 0.4s ease both; }
  .explainer-item { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
  .explainer-pct { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; }
  .explainer-pct.accent { color: var(--accent); }
  .explainer-pct.muted { color: var(--muted); }
  .explainer-item strong { display: block; font-family: var(--font-head); font-size: 0.85rem; color: var(--text); margin-bottom: 0.2rem; }
  .explainer-item p { font-size: 0.75rem; color: var(--muted); margin: 0; line-height: 1.4; }
  .divider { width: 1px; height: 40px; background: var(--border); flex-shrink: 0; }

  /* Section head */
  .section-head { font-family: var(--font-head); font-size: 0.75rem; font-weight: 700; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem; }

  /* Subject grid */
  .subject-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 0.5rem; animation: fadeUp 0.4s ease both; }
  .subject-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; }
  .subject-name { font-size: 0.72rem; color: var(--muted); margin-bottom: 0.4rem; font-family: var(--font-head); font-weight: 600; }
  .subject-pct { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; line-height: 1; margin-bottom: 0.2rem; }
  .subject-grade { font-size: 0.7rem; color: var(--muted); margin-bottom: 0.35rem; }
  .subject-meta { font-size: 0.65rem; color: var(--muted); }

  /* Marks table */
  .marks-table { display: flex; flex-direction: column; animation: fadeUp 0.4s ease both; }
  .mark-row { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border); gap: 0.5rem; }
  .mark-row:first-child { border-top: 1px solid var(--border); border-radius: 8px 8px 0 0; background: var(--surface); }
  .mark-row:last-child { border-radius: 0 0 8px 8px; background: var(--surface); }
  .mark-row { background: var(--surface); }
  .mark-info { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; flex: 1; }
  .mark-subject { font-size: 0.875rem; font-weight: 500; color: var(--text); }
  .mark-type-badge { font-size: 0.68rem; color: var(--muted); background: var(--surface2); padding: 0.1rem 0.45rem; border-radius: 999px; }
  .mark-term { font-size: 0.68rem; color: var(--muted); }
  .mark-right { display: flex; align-items: center; gap: 0.5rem; }
  .mark-pct { font-family: var(--font-head); font-size: 1rem; font-weight: 700; min-width: 40px; text-align: right; }
  .mark-notes { font-size: 0.72rem; color: var(--muted); padding: 0.25rem 0.75rem 0.5rem; background: var(--surface); border-left: 1px solid var(--border); border-right: 1px solid var(--border); font-style: italic; }

  .icon-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; }
  .icon-btn:hover { border-color: var(--accent2); color: var(--accent2); }
  .icon-btn.danger:hover { border-color: var(--danger); color: var(--danger); }

  .add-more { text-align: center; margin-top: 1.25rem; }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; width: 100%; max-width: 440px; animation: fadeUp 0.2s ease both; }
  .modal h3 { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--accent); margin: 0 0 1.25rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-field { margin-bottom: 0.75rem; }
  .field-label { display: block; font-size: 0.72rem; font-family: var(--font-head); font-weight: 600; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.35rem; }
  .select-input, .text-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 0.55rem 0.75rem; font-size: 0.875rem; font-family: var(--font-body); box-sizing: border-box; }
  .mark-preview { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; text-align: center; padding: 0.5rem; margin-bottom: 0.75rem; }
  .modal-actions { display: flex; gap: 0.75rem; }
  .btn { flex: 1; font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.7rem 1rem; cursor: pointer; font-size: 0.875rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-next { background: var(--accent); color: #0d1117; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 480px) {
    .form-row { grid-template-columns: 1fr; }
    .explainer { flex-direction: column; }
    .divider { width: 100%; height: 1px; }
  }
</style>
