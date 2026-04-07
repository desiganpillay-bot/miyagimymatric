<script lang="ts">
  import { onMount } from 'svelte';
  import { getSupabase } from '$lib/supabase';

  // ── Types ──────────────────────────────────────────────────
  type TaskStatus = 'pending' | 'in_progress' | 'submitted';
  type TaskType = 'test' | 'assignment' | 'project' | 'practical' | 'oral' | 'exam' | 'other';

  interface SbaTask {
    id: string;
    subject: string;
    task_name: string;
    task_type: TaskType;
    due_date: string;
    weight_pct: number;
    status: TaskStatus;
    mark_obtained: number | null;
    mark_total: number | null;
    is_critical: boolean;
    notes: string;
  }

  const SUBJECTS = [
    'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences',
    'English HL', 'English FAL', 'Accounting', 'Business Studies',
    'History', 'Geography', 'Afrikaans', 'Information Technology',
    'Economics', 'Life Orientation', 'Other Subject'
  ];

  const TASK_TYPES: { value: TaskType; label: string }[] = [
    { value: 'test',       label: 'Test' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'project',    label: 'Project / PAT' },
    { value: 'practical',  label: 'Practical' },
    { value: 'oral',       label: 'Oral / Presentation' },
    { value: 'exam',       label: 'Prelim Exam' },
    { value: 'other',      label: 'Other' }
  ];

  const STORAGE_KEY = 'mmm_sba_v1';

  // ── State ──────────────────────────────────────────────────
  let tasks: SbaTask[] = [];
  let showForm = false;
  let editingId: string | null = null;

  // Form fields
  let fSubject = SUBJECTS[0];
  let fName = '';
  let fType: TaskType = 'test';
  let fDue = '';
  let fWeight = 10;
  let fStatus: TaskStatus = 'pending';
  let fMarkObtained = '';
  let fMarkTotal = '';
  let fCritical = false;
  let fNotes = '';

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  });

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    tasks = [...tasks];
    syncToSupabase(tasks).catch(() => {});
  }

  async function syncToSupabase(taskList: SbaTask[]) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const uid = session.user.id;
    const STATUS_MAP: Record<TaskStatus, string> = {
      pending: 'upcoming',
      in_progress: 'in_progress',
      submitted: 'submitted'
    };
    const rows = taskList.map(t => ({
      id: t.id,
      user_id: uid,
      subject_name: t.subject,
      task_name: t.task_name,
      task_type: t.task_type === 'exam' ? 'prelim' : t.task_type,
      due_date: t.due_date || null,
      weight_pct: t.weight_pct,
      status: STATUS_MAP[t.status],
      mark_obtained: t.mark_obtained,
      mark_total: t.mark_total,
      is_critical: t.is_critical,
      notes: t.notes,
      updated_at: new Date().toISOString()
    }));
    await sb.from('sba_tasks').upsert(rows, { onConflict: 'id' });
  }

  async function syncDeleteFromSupabase(id: string) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    await sb.from('sba_tasks').delete().eq('id', id).eq('user_id', session.user.id);
  }

  function daysUntil(dateStr: string): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const due = new Date(dateStr);
    return Math.round((due.getTime() - now.getTime()) / 86400000);
  }

  function urgencyClass(task: SbaTask): string {
    if (task.status === 'submitted') return 'done';
    const d = daysUntil(task.due_date);
    if (d < 0)  return 'overdue';
    if (d <= 3) return 'critical';
    if (d <= 7) return 'urgent';
    return 'normal';
  }

  function urgencyLabel(task: SbaTask): string {
    if (task.status === 'submitted') return 'Submitted';
    const d = daysUntil(task.due_date);
    if (d < 0)  return `${Math.abs(d)}d overdue`;
    if (d === 0) return 'Due today';
    if (d === 1) return 'Due tomorrow';
    return `${d} days`;
  }

  function resetForm() {
    fSubject = SUBJECTS[0]; fName = ''; fType = 'test';
    fDue = ''; fWeight = 10; fStatus = 'pending';
    fMarkObtained = ''; fMarkTotal = ''; fCritical = false; fNotes = '';
    editingId = null;
  }

  function openAdd() { resetForm(); showForm = true; }

  function openEdit(task: SbaTask) {
    editingId = task.id;
    fSubject = task.subject; fName = task.task_name; fType = task.task_type;
    fDue = task.due_date; fWeight = task.weight_pct; fStatus = task.status;
    fMarkObtained = task.mark_obtained?.toString() ?? '';
    fMarkTotal = task.mark_total?.toString() ?? '';
    fCritical = task.is_critical; fNotes = task.notes;
    showForm = true;
  }

  function saveTask() {
    if (!fName.trim() || !fDue) return;
    const task: SbaTask = {
      id: editingId ?? crypto.randomUUID(),
      subject: fSubject,
      task_name: fName.trim(),
      task_type: fType,
      due_date: fDue,
      weight_pct: fWeight,
      status: fStatus,
      mark_obtained: fMarkObtained ? Number(fMarkObtained) : null,
      mark_total: fMarkTotal ? Number(fMarkTotal) : null,
      is_critical: fCritical,
      notes: fNotes.trim()
    };
    if (editingId) {
      tasks = tasks.map(t => t.id === editingId ? task : t);
    } else {
      tasks = [task, ...tasks];
    }
    persist();
    showForm = false;
    resetForm();
  }

  function deleteTask(id: string) {
    tasks = tasks.filter(t => t.id !== id);
    persist();
    syncDeleteFromSupabase(id).catch(() => {});
  }

  function markSubmitted(id: string) {
    tasks = tasks.map(t => t.id === id ? { ...t, status: 'submitted' as TaskStatus } : t);
    persist();
  }

  // Sort: overdue first, then by due date, submitted last
  $: sorted = [...tasks].sort((a, b) => {
    if (a.status === 'submitted' && b.status !== 'submitted') return 1;
    if (b.status === 'submitted' && a.status !== 'submitted') return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  $: pending = sorted.filter(t => t.status !== 'submitted');
  $: submitted = sorted.filter(t => t.status === 'submitted');

  $: totalWeight = tasks.reduce((acc, t) => acc + (t.weight_pct || 0), 0);
</script>

<svelte:head>
  <title>SBA Tracker — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">SBA Tracker</div>
    <h1>SBA Task Tracker</h1>
    <p class="subtitle">SBA is worth 25% of your final mark. Never miss a submission — each task counts.</p>
  </header>

  <!-- Summary -->
  <div class="summary-bar">
    <div class="stat">
      <span class="stat-num">{pending.length}</span>
      <span class="stat-label">outstanding</span>
    </div>
    <div class="stat">
      <span class="stat-num">{submitted.length}</span>
      <span class="stat-label">submitted</span>
    </div>
    <div class="stat">
      <span class="stat-num" class:danger={totalWeight > 100}>{totalWeight}%</span>
      <span class="stat-label">total weight</span>
    </div>
    <button class="btn btn-next add-btn" on:click={openAdd}>+ Add Task</button>
  </div>

  <!-- SBA importance callout -->
  <div class="callout">
    <strong>🚨 Missing an SBA task</strong> can result in "Not Resulted" — meaning no NSC certificate at all, regardless of exam performance.
  </div>

  <!-- Pending tasks -->
  {#if pending.length === 0}
    <div class="empty-card">
      <p>No outstanding tasks. Add your SBA tasks to stay on track.</p>
      <button class="btn btn-next" on:click={openAdd}>Add your first task</button>
    </div>
  {:else}
    <div class="task-list">
      {#each pending as task}
        {@const urg = urgencyClass(task)}
        <div class="task-card {urg}">
          <div class="task-top">
            <div class="task-meta">
              <span class="task-subject">{task.subject}</span>
              <span class="task-type">{TASK_TYPES.find(t => t.value === task.task_type)?.label}</span>
              {#if task.is_critical}<span class="critical-badge">Critical</span>{/if}
            </div>
            <div class="urgency-pill {urg}">{urgencyLabel(task)}</div>
          </div>

          <div class="task-name">{task.task_name}</div>

          <div class="task-bottom">
            <div class="task-detail">
              <span>Due: {new Date(task.due_date).toLocaleDateString('en-ZA', {day:'numeric',month:'short',year:'numeric'})}</span>
              <span>Weight: {task.weight_pct}%</span>
              {#if task.mark_obtained !== null && task.mark_total}
                <span>Mark: {task.mark_obtained}/{task.mark_total} ({Math.round(task.mark_obtained/task.mark_total*100)}%)</span>
              {/if}
            </div>
            <div class="task-actions">
              <button class="action-btn" on:click={() => markSubmitted(task.id)}>✓ Done</button>
              <button class="action-btn" on:click={() => openEdit(task)}>Edit</button>
              <button class="action-btn danger" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>

          {#if task.notes}
            <p class="task-notes">{task.notes}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Submitted tasks (collapsed) -->
  {#if submitted.length > 0}
    <details class="submitted-section">
      <summary>Submitted tasks ({submitted.length})</summary>
      <div class="task-list" style="margin-top: 0.75rem">
        {#each submitted as task}
          <div class="task-card done">
            <div class="task-top">
              <div class="task-meta">
                <span class="task-subject">{task.subject}</span>
                <span class="task-type">{TASK_TYPES.find(t => t.value === task.task_type)?.label}</span>
              </div>
              <div class="urgency-pill done">✓ Submitted</div>
            </div>
            <div class="task-name">{task.task_name}</div>
            <div class="task-bottom">
              <div class="task-detail">
                {#if task.mark_obtained !== null && task.mark_total}
                  <span>Mark: {task.mark_obtained}/{task.mark_total} ({Math.round(task.mark_obtained/task.mark_total*100)}%)</span>
                {/if}
              </div>
              <div class="task-actions">
                <button class="action-btn danger" on:click={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </details>
  {/if}
</div>

<!-- Add/Edit modal -->
{#if showForm}
  <div class="modal-backdrop" role="presentation" on:click|self={() => { showForm = false; resetForm(); }} on:keydown={() => {}}>
    <div class="modal">
      <h3>{editingId ? 'Edit Task' : 'Add SBA Task'}</h3>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Subject</label>
          <select class="select-input" bind:value={fSubject}>
            {#each SUBJECTS as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Task type</label>
          <select class="select-input" bind:value={fType}>
            {#each TASK_TYPES as t}<option value={t.value}>{t.label}</option>{/each}
          </select>
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Task name</label>
        <input class="text-input" type="text" placeholder="e.g. Term 2 Test — Functions" bind:value={fName} />
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Due date</label>
          <input class="text-input" type="date" bind:value={fDue} />
        </div>
        <div class="form-field">
          <label class="field-label">Weight (%)</label>
          <input class="text-input" type="number" min="1" max="100" bind:value={fWeight} />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Mark obtained</label>
          <input class="text-input" type="number" placeholder="e.g. 68" bind:value={fMarkObtained} />
        </div>
        <div class="form-field">
          <label class="field-label">Out of</label>
          <input class="text-input" type="number" placeholder="e.g. 100" bind:value={fMarkTotal} />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Status</label>
          <select class="select-input" bind:value={fStatus}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
        <div class="form-field check-field">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={fCritical} />
            Mark as critical
          </label>
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Notes (optional)</label>
        <input class="text-input" type="text" placeholder="Any reminders or requirements" bind:value={fNotes} />
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" on:click={() => { showForm = false; resetForm(); }}>Cancel</button>
        <button class="btn btn-next" disabled={!fName.trim() || !fDue} on:click={saveTask}>
          {editingId ? 'Update' : 'Add Task'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }

  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }

  .badge { display: inline-block; background: rgba(246,201,14,.12); color: var(--accent); border: 1px solid rgba(246,201,14,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }

  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto; }

  /* Summary bar */
  .summary-bar { display: flex; align-items: center; gap: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem 1.25rem; margin-bottom: 1rem; flex-wrap: wrap; animation: fadeUp 0.4s ease both; }
  .stat { display: flex; align-items: baseline; gap: 0.35rem; }
  .stat-num { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--accent); }
  .stat-num.danger { color: var(--danger); }
  .stat-label { font-size: 0.75rem; color: var(--muted); }
  .add-btn { margin-left: auto; padding: 0.5rem 1.25rem; font-size: 0.85rem; }

  /* Callout */
  .callout { background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.25); border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--text); margin-bottom: 1.25rem; line-height: 1.5; }
  .callout strong { color: var(--danger); }

  /* Empty */
  .empty-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2.5rem; text-align: center; animation: fadeUp 0.4s ease both; }
  .empty-card p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.25rem; }

  /* Task list */
  .task-list { display: flex; flex-direction: column; gap: 0.75rem; animation: fadeUp 0.4s ease both; }

  .task-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    border-left: 4px solid var(--border);
  }
  .task-card.normal   { border-left-color: var(--accent2); }
  .task-card.urgent   { border-left-color: var(--accent); }
  .task-card.critical { border-left-color: var(--danger); background: rgba(248,113,113,.04); }
  .task-card.overdue  { border-left-color: var(--danger); background: rgba(248,113,113,.08); }
  .task-card.done     { border-left-color: var(--accent3); opacity: 0.7; }

  .task-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; gap: 0.5rem; }
  .task-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .task-subject { font-family: var(--font-head); font-size: 0.75rem; font-weight: 700; color: var(--text); }
  .task-type { font-size: 0.7rem; color: var(--muted); background: var(--surface2); padding: 0.15rem 0.5rem; border-radius: 999px; }
  .critical-badge { font-size: 0.65rem; font-weight: 700; color: var(--danger); background: rgba(248,113,113,.15); padding: 0.15rem 0.5rem; border-radius: 999px; }

  .urgency-pill { font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; white-space: nowrap; }
  .urgency-pill.normal   { background: rgba(56,189,248,.12); color: var(--accent2); }
  .urgency-pill.urgent   { background: rgba(246,201,14,.12); color: var(--accent); animation: pulse 2s ease-in-out infinite; }
  .urgency-pill.critical { background: rgba(248,113,113,.15); color: var(--danger); animation: pulse 1.5s ease-in-out infinite; }
  .urgency-pill.overdue  { background: rgba(248,113,113,.2); color: var(--danger); }
  .urgency-pill.done     { background: rgba(74,222,128,.12); color: var(--accent3); }

  .task-name { font-size: 0.95rem; font-weight: 500; color: var(--text); margin-bottom: 0.5rem; }

  .task-bottom { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .task-detail { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.75rem; color: var(--muted); }
  .task-actions { display: flex; gap: 0.4rem; }

  .action-btn { font-size: 0.72rem; font-family: var(--font-head); font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); cursor: pointer; transition: border-color 0.15s; }
  .action-btn:hover { border-color: var(--accent2); }
  .action-btn.danger { color: var(--danger); }
  .action-btn.danger:hover { border-color: var(--danger); }

  .task-notes { font-size: 0.78rem; color: var(--muted); margin: 0.5rem 0 0; font-style: italic; }

  /* Submitted section */
  .submitted-section { margin-top: 1.5rem; }
  .submitted-section summary { font-family: var(--font-head); font-size: 0.85rem; font-weight: 600; color: var(--muted); cursor: pointer; padding: 0.5rem 0; }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; width: 100%; max-width: 480px; animation: fadeUp 0.2s ease both; }
  .modal h3 { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--accent); margin: 0 0 1.25rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-field { margin-bottom: 0.75rem; }
  .check-field { display: flex; align-items: flex-end; padding-bottom: 0.75rem; }
  .field-label { display: block; font-size: 0.72rem; font-family: var(--font-head); font-weight: 600; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.35rem; }
  .select-input, .text-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 0.55rem 0.75rem; font-size: 0.875rem; font-family: var(--font-body); box-sizing: border-box; }
  .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text); cursor: pointer; }
  .checkbox-label input { accent-color: var(--accent); }

  .modal-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
  .btn { flex: 1; font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.7rem 1rem; cursor: pointer; font-size: 0.875rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-next { background: var(--accent); color: #0d1117; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

  @media (max-width: 560px) {
    .form-row { grid-template-columns: 1fr; }
    .task-bottom { flex-direction: column; align-items: flex-start; }
  }
</style>
