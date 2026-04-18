<script lang="ts">
  import { onMount } from 'svelte';
  import { getSupabase } from '$lib/supabase';
  import { rangeMid } from '$lib/aps';

  // ── Types ──────────────────────────────────────────────────
  type TaskStatus = 'pending' | 'in_progress' | 'submitted';
  type TaskType   = 'test' | 'assignment' | 'project' | 'practical' | 'oral' | 'exam' | 'other';

  interface SbaTask {
    id: string;
    subject: string;
    task_name: string;
    task_type: TaskType;
    term: number;
    due_date: string;      // '' = not yet set
    weight_pct: number;
    status: TaskStatus;
    mark_obtained: number | null;
    mark_total:    number | null;
    is_critical: boolean;
    notes: string;
    from_template: boolean;
  }

  interface TaskTemplate {
    name: string;
    type: TaskType;
    term: number;
    weight: number;
    critical: boolean;
  }

  // ── CAPS SBA templates per subject ────────────────────────
  // Source: DBE Subject Assessment Guidelines (CAPS Grade 12)
  const SBA_TEMPLATES: Record<string, TaskTemplate[]> = {
    'Mathematics': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Assignment / Investigation', type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (counts as SBA)', type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Mathematical Literacy': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Assignment',             type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Physical Sciences': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Practical Task',         type: 'practical',  term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Term 3 Practical Task',         type: 'practical',  term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Life Sciences': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Practical / Dissection', type: 'practical',  term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Research Task (PAT)',           type: 'project',    term: 2, weight: 10, critical: true  },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'English HL': [
      { name: 'Creative Writing Essay (T1)',   type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Oral: Prepared Reading (T1)',   type: 'oral',       term: 1, weight: 10, critical: false },
      { name: 'Language in Context Test',      type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Transactional Writing',         type: 'assignment', term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Oral: Prepared Speech (T3)',    type: 'oral',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'English FAL': [
      { name: 'Creative Writing Essay (T1)',   type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Oral: Prepared Reading (T1)',   type: 'oral',       term: 1, weight: 10, critical: false },
      { name: 'Language in Context Test',      type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Oral: Prepared Speech (T3)',    type: 'oral',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Afrikaans': [
      { name: 'Creative Writing / Opstel',     type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Mondeling (Prepared Reading)',  type: 'oral',       term: 1, weight: 10, critical: false },
      { name: 'Taalgebruik Test',              type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Mondeling: Prepared Speech',   type: 'oral',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Accounting': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Assignment',             type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Project (Accounting Records)',  type: 'project',    term: 3, weight: 10, critical: true  },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Business Studies': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Case Study/Assignment',  type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Economics': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Term 1 Assignment/Case Study',  type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'History': [
      { name: 'Term 1 Test',                   type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'Source Analysis Task',          type: 'assignment', term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Research Essay (PAT)',          type: 'project',    term: 2, weight: 15, critical: true  },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Geography': [
      { name: 'Term 1 Mapwork Test',           type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'GIS / Fieldwork Assignment',    type: 'project',    term: 1, weight: 10, critical: false },
      { name: 'Term 2 Test',                   type: 'test',       term: 2, weight: 10, critical: false },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'Term 3 Test',                   type: 'test',       term: 3, weight: 10, critical: false },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Life Orientation': [
      { name: 'Physical Education Portfolio',  type: 'project',    term: 1, weight: 15, critical: true  },
      { name: 'Research Project / LO Task',    type: 'project',    term: 2, weight: 20, critical: true  },
      { name: 'Oral / Group Task',             type: 'oral',       term: 2, weight: 10, critical: false },
      { name: 'Work Readiness / Career Task',  type: 'assignment', term: 3, weight: 15, critical: false },
    ],
    'Information Technology': [
      { name: 'Term 1 Theory Test',            type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'PAT Phase 1 (Analysis)',        type: 'project',    term: 1, weight: 15, critical: true  },
      { name: 'Term 2 Practical Task',         type: 'practical',  term: 2, weight: 10, critical: false },
      { name: 'PAT Phase 2 (Design/Dev)',      type: 'project',    term: 2, weight: 20, critical: true  },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'PAT Phase 3 (Implementation)', type: 'project',    term: 3, weight: 20, critical: true  },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
    'Computer Applications Technology': [
      { name: 'Term 1 Theory Test',            type: 'test',       term: 1, weight: 10, critical: false },
      { name: 'PAT Phase 1 (Analysis)',        type: 'project',    term: 1, weight: 15, critical: true  },
      { name: 'Term 2 Practical Task',         type: 'practical',  term: 2, weight: 10, critical: false },
      { name: 'PAT Phase 2 (Design)',          type: 'project',    term: 2, weight: 20, critical: true  },
      { name: 'Mid-Year Exam (SBA)',           type: 'exam',       term: 2, weight: 25, critical: true  },
      { name: 'PAT Phase 3 (Final)',           type: 'project',    term: 3, weight: 20, critical: true  },
      { name: 'Prelim / Trial Exam (SBA)',     type: 'exam',       term: 3, weight: 25, critical: true  },
    ],
  };

  const FALLBACK_TEMPLATE: TaskTemplate[] = [
    { name: 'Term 1 Test',               type: 'test',       term: 1, weight: 10, critical: false },
    { name: 'Term 1 Assignment',         type: 'assignment', term: 1, weight: 10, critical: false },
    { name: 'Term 2 Test',               type: 'test',       term: 2, weight: 10, critical: false },
    { name: 'Mid-Year Exam (SBA)',       type: 'exam',       term: 2, weight: 25, critical: true  },
    { name: 'Term 3 Test',               type: 'test',       term: 3, weight: 10, critical: false },
    { name: 'Prelim / Trial Exam (SBA)', type: 'exam',       term: 3, weight: 25, critical: true  },
  ];

  const TASK_TYPES: { value: TaskType; label: string }[] = [
    { value: 'test',       label: 'Test' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'project',    label: 'Project / PAT' },
    { value: 'practical',  label: 'Practical' },
    { value: 'oral',       label: 'Oral / Presentation' },
    { value: 'exam',       label: 'Prelim Exam' },
    { value: 'other',      label: 'Other' },
  ];

  const STORAGE_KEY = 'mmm_sba_v1';

  // ── State ──────────────────────────────────────────────────
  let tasks: SbaTask[]        = [];
  let assessmentSubjects: string[] = [];
  let activeSubject: string   = '';
  let showForm                = false;
  let editingId: string | null = null;
  let profileCompletion       = 0;  // 0–100 based on dates filled

  // Form fields
  let fSubject      = '';
  let fName         = '';
  let fType: TaskType       = 'test';
  let fTerm         = 1;
  let fDue          = '';
  let fWeight       = 10;
  let fStatus: TaskStatus   = 'pending';
  let fMarkObtained = '';
  let fMarkTotal    = '';
  let fCritical     = false;
  let fNotes        = '';

  // ── Helpers ────────────────────────────────────────────────
  function makeTask(subj: string, tmpl: TaskTemplate): SbaTask {
    return {
      id: crypto.randomUUID(),
      subject: subj,
      task_name: tmpl.name,
      task_type: tmpl.type,
      term: tmpl.term,
      due_date: '',
      weight_pct: tmpl.weight,
      status: 'pending',
      mark_obtained: null,
      mark_total: null,
      is_critical: tmpl.critical,
      notes: '',
      from_template: true,
    };
  }

  function getSubjectsFromAssessment(): string[] {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (!raw) return [];
      const state = JSON.parse(raw);
      const marks: Record<string, string> = state.subjectMarks || {};
      return Object.entries(marks)
        .filter(([, v]) => v && v !== '')
        .map(([k]) => k);
    } catch { return []; }
  }

  function seedTemplates(subjects: string[], existing: SbaTask[]): SbaTask[] {
    const seeded = [...existing];
    for (const subj of subjects) {
      const hasAny = existing.some(t => t.subject === subj);
      if (!hasAny) {
        const templates = SBA_TEMPLATES[subj] ?? FALLBACK_TEMPLATE;
        for (const tmpl of templates) {
          seeded.push(makeTask(subj, tmpl));
        }
      }
    }
    return seeded;
  }

  function calcProfileCompletion(taskList: SbaTask[], subjects: string[]): number {
    if (!subjects.length) return 0;
    const total = taskList.filter(t => subjects.includes(t.subject)).length;
    if (!total) return 0;
    const withDate = taskList.filter(t => subjects.includes(t.subject) && t.due_date).length;
    return Math.round((withDate / total) * 100);
  }

  onMount(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: SbaTask[] = raw ? JSON.parse(raw) : [];
    assessmentSubjects = getSubjectsFromAssessment();
    const seeded = seedTemplates(assessmentSubjects, existing);
    tasks = seeded;
    persist(false); // save seeded tasks silently
    activeSubject = assessmentSubjects[0] ?? '';
    profileCompletion = calcProfileCompletion(tasks, assessmentSubjects);
  });

  function persist(syncCloud = true) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    tasks = [...tasks];
    profileCompletion = calcProfileCompletion(tasks, assessmentSubjects);
    if (syncCloud) syncToSupabase(tasks).catch(() => {});
  }

  async function syncToSupabase(taskList: SbaTask[]) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const uid = session.user.id;
    const rows = taskList
      .filter(t => t.due_date)  // only sync tasks that have dates
      .map(t => ({
        id: t.id,
        user_id: uid,
        subject_name: t.subject,
        task_name: t.task_name,
        task_type: t.task_type === 'exam' ? 'prelim' : t.task_type,
        due_date: t.due_date || null,
        weight_pct: t.weight_pct,
        status: t.status === 'pending' ? 'upcoming' : t.status,
        mark_obtained: t.mark_obtained,
        mark_total: t.mark_total,
        is_critical: t.is_critical,
        notes: t.notes,
        updated_at: new Date().toISOString(),
      }));
    if (rows.length) await sb.from('sba_tasks').upsert(rows, { onConflict: 'id' });
  }

  function daysUntil(dateStr: string): number {
    if (!dateStr) return 999;
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.round((new Date(dateStr).getTime() - now.getTime()) / 86400000);
  }

  function urgencyClass(task: SbaTask): string {
    if (task.status === 'submitted') return 'done';
    if (!task.due_date) return 'no-date';
    const d = daysUntil(task.due_date);
    if (d < 0)   return 'overdue';
    if (d <= 3)  return 'critical';
    if (d <= 7)  return 'urgent';
    return 'normal';
  }

  function urgencyLabel(task: SbaTask): string {
    if (task.status === 'submitted') return '✓ Done';
    if (!task.due_date) return 'Add date →';
    const d = daysUntil(task.due_date);
    if (d < 0)   return `${Math.abs(d)}d overdue`;
    if (d === 0) return 'Due today';
    if (d === 1) return 'Due tomorrow';
    return `${d} days`;
  }

  function resetForm() {
    fSubject = activeSubject || (assessmentSubjects[0] ?? '');
    fName = ''; fType = 'test'; fTerm = 1; fDue = ''; fWeight = 10;
    fStatus = 'pending'; fMarkObtained = ''; fMarkTotal = '';
    fCritical = false; fNotes = '';
    editingId = null;
  }

  function openAdd(subj?: string) {
    resetForm();
    if (subj) fSubject = subj;
    showForm = true;
  }

  function openEdit(task: SbaTask) {
    editingId       = task.id;
    fSubject        = task.subject;
    fName           = task.task_name;
    fType           = task.task_type;
    fTerm           = task.term;
    fDue            = task.due_date;
    fWeight         = task.weight_pct;
    fStatus         = task.status;
    fMarkObtained   = task.mark_obtained?.toString() ?? '';
    fMarkTotal      = task.mark_total?.toString()    ?? '';
    fCritical       = task.is_critical;
    fNotes          = task.notes;
    showForm        = true;
  }

  function saveTask() {
    if (!fName.trim()) return;
    const task: SbaTask = {
      id:            editingId ?? crypto.randomUUID(),
      subject:       fSubject,
      task_name:     fName.trim(),
      task_type:     fType,
      term:          fTerm,
      due_date:      fDue,
      weight_pct:    fWeight,
      status:        fStatus,
      mark_obtained: fMarkObtained ? Number(fMarkObtained) : null,
      mark_total:    fMarkTotal    ? Number(fMarkTotal)    : null,
      is_critical:   fCritical,
      notes:         fNotes.trim(),
      from_template: false,
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
  }

  function markSubmitted(id: string) {
    tasks = tasks.map(t => t.id === id ? { ...t, status: 'submitted' as TaskStatus } : t);
    persist();
  }

  // ── Derived ────────────────────────────────────────────────
  $: subjectList = assessmentSubjects.length
    ? assessmentSubjects
    : [...new Set(tasks.map(t => t.subject))];

  $: activeTab = activeSubject || subjectList[0] || '';

  $: tabTasks = tasks
    .filter(t => t.subject === activeTab)
    .sort((a, b) => {
      if (a.status === 'submitted' && b.status !== 'submitted') return 1;
      if (b.status === 'submitted' && a.status !== 'submitted') return -1;
      if (!a.due_date && b.due_date) return 1;
      if (a.due_date && !b.due_date) return -1;
      return (a.term - b.term) || new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  $: pendingCount    = tasks.filter(t => t.status !== 'submitted' && t.due_date).length;
  $: noDatesCount    = tasks.filter(t => t.status !== 'submitted' && !t.due_date).length;
  $: overdueCount    = tasks.filter(t => t.status !== 'submitted' && t.due_date && daysUntil(t.due_date) < 0).length;
</script>

<svelte:head>
  <title>SBA Tracker — Miyagi My Matric</title>
</svelte:head>

<div class="app">

  <header class="page-header">
    <a href="/dashboard" class="back-link">← Dashboard</a>
    <div class="badge">SBA Tracker</div>
    <h1>SBA Tasks</h1>
    <p class="subtitle">25% of your final mark. Never miss a submission — "Not Resulted" means no NSC, regardless of exam performance.</p>
  </header>

  <!-- Profile completion bar -->
  {#if noDatesCount > 0}
    <div class="completion-banner">
      <div class="completion-top">
        <span class="completion-label">Profile completion</span>
        <span class="completion-pct">{profileCompletion}%</span>
      </div>
      <div class="completion-track">
        <div class="completion-fill" style="width: {profileCompletion}%"></div>
      </div>
      <p class="completion-hint">{noDatesCount} task{noDatesCount !== 1 ? 's' : ''} still need a due date. Add your school's dates to complete your profile.</p>
    </div>
  {:else if profileCompletion === 100}
    <div class="completion-banner complete">
      <span class="completion-label">✓ SBA profile complete — all dates set</span>
    </div>
  {/if}

  <!-- Summary bar -->
  <div class="summary-bar">
    <div class="stat">
      <span class="stat-num" class:danger={overdueCount > 0}>{overdueCount || pendingCount}</span>
      <span class="stat-label">{overdueCount > 0 ? 'overdue' : 'upcoming'}</span>
    </div>
    <div class="stat">
      <span class="stat-num muted">{noDatesCount}</span>
      <span class="stat-label">no date yet</span>
    </div>
    <div class="stat">
      <span class="stat-num done-col">{tasks.filter(t=>t.status==='submitted').length}</span>
      <span class="stat-label">submitted</span>
    </div>
    <button class="btn btn-next add-btn" on:click={() => openAdd(activeTab)}>+ Add Task</button>
  </div>

  <!-- No assessment warning -->
  {#if !assessmentSubjects.length}
    <div class="no-assess-callout">
      <strong>Complete your assessment first</strong> to get your subjects auto-loaded here.
      <a href="/assessment">Go to assessment →</a>
    </div>
  {/if}

  <!-- Subject tabs -->
  {#if subjectList.length > 0}
    <div class="subject-tabs">
      {#each subjectList as subj}
        {@const subjTasks = tasks.filter(t => t.subject === subj)}
        {@const subjNoDates = subjTasks.filter(t => !t.due_date && t.status !== 'submitted').length}
        {@const subjDone = subjTasks.filter(t => t.status === 'submitted').length}
        <button
          class="tab-btn"
          class:active={activeTab === subj}
          on:click={() => { activeSubject = subj; }}
        >
          <span class="tab-name">{subj}</span>
          {#if subjNoDates > 0}
            <span class="tab-dot needs-date">{subjNoDates}</span>
          {:else if subjDone === subjTasks.length && subjTasks.length > 0}
            <span class="tab-dot all-done">✓</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Task list for active subject -->
    <div class="task-section">
      <div class="task-section-header">
        <span class="task-section-title">{activeTab}</span>
        <button class="add-task-link" on:click={() => openAdd(activeTab)}>+ Add custom task</button>
      </div>

      {#if tabTasks.length === 0}
        <div class="empty-card">
          <p>No tasks for this subject yet.</p>
          <button class="btn btn-next" on:click={() => openAdd(activeTab)}>Add a task</button>
        </div>
      {:else}
        <div class="task-list">
          {#each tabTasks as task}
            {@const urg = urgencyClass(task)}
            <div class="task-card {urg}" class:template={task.from_template && !task.due_date}>
              <div class="task-top">
                <div class="task-meta">
                  <span class="term-badge">T{task.term}</span>
                  <span class="task-type-pill">{TASK_TYPES.find(t=>t.value===task.task_type)?.label}</span>
                  {#if task.is_critical}<span class="critical-badge">Critical</span>{/if}
                </div>
                <button class="urgency-pill {urg}" on:click={() => openEdit(task)}>
                  {urgencyLabel(task)}
                </button>
              </div>

              <div class="task-name">{task.task_name}</div>

              <div class="task-bottom">
                <div class="task-detail">
                  {#if task.due_date}
                    <span>Due: {new Date(task.due_date).toLocaleDateString('en-ZA', {day:'numeric',month:'short'})}</span>
                  {:else}
                    <span class="needs-date-text">Tap to add your school's date</span>
                  {/if}
                  <span>Weight: {task.weight_pct}%</span>
                  {#if task.mark_obtained !== null && task.mark_total}
                    <span class="mark-result">{task.mark_obtained}/{task.mark_total} ({Math.round(task.mark_obtained/task.mark_total*100)}%)</span>
                  {/if}
                </div>
                <div class="task-actions">
                  {#if task.status !== 'submitted'}
                    <button class="action-btn done-btn" on:click={() => markSubmitted(task.id)}>✓</button>
                  {/if}
                  <button class="action-btn" on:click={() => openEdit(task)}>Edit</button>
                  <button class="action-btn danger" on:click={() => deleteTask(task.id)}>✕</button>
                </div>
              </div>

              {#if task.notes}
                <p class="task-notes">{task.notes}</p>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

</div>

<!-- Add/Edit modal -->
{#if showForm}
  <div class="modal-backdrop" role="presentation"
    on:click|self={() => { showForm = false; resetForm(); }}
    on:keydown={() => {}}
  >
    <div class="modal">
      <h3>{editingId ? 'Edit Task' : 'Add SBA Task'}</h3>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">Subject</label>
          <select class="select-input" bind:value={fSubject}>
            {#each subjectList as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Type</label>
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
          <label class="field-label">Due date <span class="hint">(your school's date)</span></label>
          <input class="text-input" type="date" bind:value={fDue} />
        </div>
        <div class="form-field">
          <label class="field-label">Term</label>
          <select class="select-input" bind:value={fTerm}>
            <option value={1}>Term 1</option>
            <option value={2}>Term 2</option>
            <option value={3}>Term 3</option>
          </select>
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
        <div class="form-field">
          <label class="field-label">Weight (%)</label>
          <input class="text-input" type="number" min="1" max="100" bind:value={fWeight} />
        </div>
      </div>

      <div class="form-field checkbox-row">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={fCritical} />
          Mark as critical
        </label>
      </div>

      <div class="form-field">
        <label class="field-label">Notes (optional)</label>
        <input class="text-input" type="text" placeholder="Any reminders or requirements" bind:value={fNotes} />
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" on:click={() => { showForm = false; resetForm(); }}>Cancel</button>
        <button class="btn btn-next" disabled={!fName.trim()} on:click={saveTask}>
          {editingId ? 'Update' : 'Add Task'}
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
  .badge { display: inline-block; background: rgba(255,82,82,.12); color: var(--accent); border: 1px solid rgba(255,82,82,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.85rem; max-width: 500px; margin: 0 auto; line-height: 1.6; }

  /* Completion banner */
  .completion-banner { background: var(--surface); border: 1px solid rgba(105,180,255,.25); border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; animation: fadeUp 0.4s ease both; }
  .completion-banner.complete { border-color: rgba(122,255,122,.25); }
  .completion-top { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
  .completion-label { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  .completion-banner.complete .completion-label { color: var(--accent3); }
  .completion-pct { font-family: var(--font-head); font-size: 0.8rem; font-weight: 700; color: var(--accent2); }
  .completion-track { height: 4px; background: var(--surface2); border-radius: 100px; overflow: hidden; margin-bottom: 0.5rem; }
  .completion-fill { height: 100%; background: var(--grad-cta); border-radius: 100px; transition: width 0.6s ease; }
  .completion-hint { font-size: 0.75rem; color: var(--muted); margin: 0; }

  /* Summary bar */
  .summary-bar { display: flex; align-items: center; gap: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem 1.1rem; margin-bottom: 1rem; flex-wrap: wrap; animation: fadeUp 0.4s ease both; }
  .stat { display: flex; align-items: baseline; gap: 0.3rem; }
  .stat-num { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--accent); }
  .stat-num.danger { color: var(--danger); }
  .stat-num.muted  { color: var(--muted); }
  .stat-num.done-col { color: var(--accent3); }
  .stat-label { font-size: 0.72rem; color: var(--muted); }
  .add-btn { margin-left: auto; padding: 0.45rem 1.1rem; font-size: 0.82rem; border: none; border-radius: 100px; background: var(--grad-cta); color: #07070B; font-family: var(--font-head); font-weight: 700; cursor: pointer; white-space: nowrap; }

  /* No assessment */
  .no-assess-callout { background: rgba(245,245,106,.06); border: 1px solid rgba(245,245,106,.2); border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--text); margin-bottom: 1rem; }
  .no-assess-callout a { color: var(--accent2); text-decoration: none; margin-left: 0.5rem; }

  /* Subject tabs */
  .subject-tabs { display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.1rem; margin-bottom: 1rem; flex-wrap: nowrap; }
  .subject-tabs::-webkit-scrollbar { display: none; }

  .tab-btn { flex-shrink: 0; display: flex; align-items: center; gap: 0.35rem; background: var(--surface); border: 1px solid var(--border); border-radius: 100px; padding: 0.4rem 0.85rem; font-family: var(--font-head); font-size: 0.72rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .tab-btn:hover { border-color: var(--accent2); color: var(--text); }
  .tab-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(255,82,82,.08); }

  .tab-dot { width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 800; }
  .tab-dot.needs-date { background: rgba(245,245,106,.25); color: #F5F56A; }
  .tab-dot.all-done   { background: rgba(122,255,122,.20); color: var(--accent3); }

  /* Task section */
  .task-section { animation: fadeUp 0.3s ease both; }
  .task-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .task-section-title { font-family: var(--font-head); font-size: 0.8rem; font-weight: 700; color: var(--text); }
  .add-task-link { font-family: var(--font-head); font-size: 0.72rem; font-weight: 600; color: var(--accent2); background: none; border: none; cursor: pointer; padding: 0; }
  .add-task-link:hover { text-decoration: underline; }

  /* Task cards */
  .task-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .task-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0.9rem 1.1rem; border-left: 3px solid var(--border); }
  .task-card.no-date  { border-left-color: rgba(245,245,106,.5); background: rgba(245,245,106,.03); }
  .task-card.normal   { border-left-color: var(--accent2); }
  .task-card.urgent   { border-left-color: var(--accent4); }
  .task-card.critical { border-left-color: var(--danger); background: rgba(255,82,82,.04); }
  .task-card.overdue  { border-left-color: var(--danger); background: rgba(255,82,82,.07); }
  .task-card.done     { border-left-color: var(--accent3); opacity: 0.65; }

  .task-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; gap: 0.5rem; flex-wrap: wrap; }
  .task-meta { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }

  .term-badge { font-family: var(--font-head); font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em; background: var(--surface2); color: var(--muted); padding: 0.15rem 0.45rem; border-radius: 4px; }
  .task-type-pill { font-size: 0.68rem; color: var(--muted); background: var(--surface2); padding: 0.15rem 0.5rem; border-radius: 999px; }
  .critical-badge { font-size: 0.6rem; font-weight: 700; color: var(--danger); background: rgba(255,82,82,.15); padding: 0.15rem 0.45rem; border-radius: 999px; }

  .urgency-pill { font-family: var(--font-head); font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; white-space: nowrap; border: none; cursor: pointer; }
  .urgency-pill.no-date  { background: rgba(245,245,106,.15); color: #F5F56A; }
  .urgency-pill.normal   { background: rgba(105,180,255,.12); color: var(--accent2); }
  .urgency-pill.urgent   { background: rgba(245,245,106,.15); color: #F5F56A; }
  .urgency-pill.critical { background: rgba(255,82,82,.15);  color: var(--danger); animation: pulse 1.5s ease-in-out infinite; }
  .urgency-pill.overdue  { background: rgba(255,82,82,.20);  color: var(--danger); }
  .urgency-pill.done     { background: rgba(122,255,122,.15); color: var(--accent3); }

  .task-name { font-size: 0.9rem; font-weight: 600; color: var(--text); margin-bottom: 0.45rem; }

  .task-bottom { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .task-detail { display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.72rem; color: var(--muted); }
  .needs-date-text { color: rgba(245,245,106,.7); font-style: italic; }
  .mark-result { color: var(--accent3); font-weight: 600; }

  .task-actions { display: flex; gap: 0.35rem; }
  .action-btn { font-size: 0.7rem; font-family: var(--font-head); font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .action-btn:hover { border-color: var(--accent2); color: var(--accent2); }
  .action-btn.done-btn { border-color: rgba(122,255,122,.3); color: var(--accent3); }
  .action-btn.done-btn:hover { background: rgba(122,255,122,.1); }
  .action-btn.danger { color: var(--danger); }
  .action-btn.danger:hover { border-color: var(--danger); }

  .task-notes { font-size: 0.72rem; color: var(--muted); margin: 0.4rem 0 0; font-style: italic; }

  /* Empty */
  .empty-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; text-align: center; }
  .empty-card p { color: var(--muted); font-size: 0.875rem; margin-bottom: 1rem; }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 200; display: flex; align-items: flex-end; justify-content: center; padding: 0; }
  @media (min-width: 520px) { .modal-backdrop { align-items: center; padding: 1rem; } }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px 20px 0 0; padding: 1.5rem 1.5rem 2rem; width: 100%; max-width: 480px; animation: slideUp 0.22s ease both; max-height: 90vh; overflow-y: auto; }
  @media (min-width: 520px) { .modal { border-radius: 16px; } }
  .modal h3 { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--accent); margin: 0 0 1.25rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-field { margin-bottom: 0.75rem; }
  .field-label { display: block; font-size: 0.68rem; font-family: var(--font-head); font-weight: 700; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.3rem; }
  .hint { font-weight: 400; text-transform: none; letter-spacing: 0; }
  .select-input, .text-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 0.55rem 0.75rem; font-size: 0.875rem; font-family: var(--font-body); box-sizing: border-box; outline: none; }
  .select-input:focus, .text-input:focus { border-color: var(--accent); }
  .checkbox-row { display: flex; align-items: center; }
  .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text); cursor: pointer; }
  .checkbox-label input { accent-color: var(--accent); }

  .modal-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
  .btn { flex: 1; font-family: var(--font-head); font-weight: 700; border: none; border-radius: var(--radius); padding: 0.75rem 1rem; cursor: pointer; font-size: 0.875rem; transition: opacity 0.2s; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-next { background: var(--grad-cta); color: #07070B; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp   { from { opacity: 0; transform: translateY(12px);  } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp  { from { opacity: 0; transform: translateY(40px);  } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

  @media (max-width: 480px) {
    .form-row { grid-template-columns: 1fr; }
    .task-bottom { flex-direction: column; align-items: flex-start; }
    .summary-bar { gap: 0.75rem; }
  }
</style>
