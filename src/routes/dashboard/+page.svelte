<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabase } from '$lib/supabase';
  import { apsResult } from '$lib/stores/assessment';
  import { rangeMid } from '$lib/aps';
  import { getRiskTopics } from '$lib/highValueTopics';

  // ── Types ──────────────────────────────────────────────────
  type Profile = {
    exam_system: string | null;
    streak_current: number | null;
    consented_at: string | null;
    terms_version: string | null;
  };
  type Goal = { target_aps: number | null };
  type Mark = { subject_name: string; percentage: number; mark_type: string };
  type SbaTask = { task_name: string; subject_name: string; due_date: string };

  // ── State ──────────────────────────────────────────────────
  let loading = true;
  let authed = false;
  let localAPS = 0;
  let localSubjects: { name: string; mark: number }[] = [];
  let hasLocalAssessment = false;

  let profile: Profile | null = null;
  let targetAps: number | null = null;
  let currentAps = 0;
  let streak = 0;
  let recentMarks: Mark[] = [];
  let nextTask: SbaTask | null = null;

  // SVG ring animation
  let ringOffset = 339.3; // full circumference (r=54, c=2πr)
  const CIRCUMFERENCE = 339.3;

  // ── Exam dates ─────────────────────────────────────────────
  const DATES = {
    caps:  { prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') },
    ieb:   { prelims: new Date('2026-09-08'), finals: new Date('2026-11-10') },
    unsure:{ prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') }
  } as const;

  function daysUntil(d: Date): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = d.getTime() - now.getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  $: examKey = (profile?.exam_system ?? 'unsure') as keyof typeof DATES;
  $: prelimDays = daysUntil(DATES[examKey]?.prelims ?? DATES.unsure.prelims);
  $: finalDays  = daysUntil(DATES[examKey]?.finals  ?? DATES.unsure.finals);

  // SBA urgency — red pulse if due within 7 days
  $: taskUrgent = nextTask
    ? daysUntil(new Date(nextTask.due_date)) <= 7
    : false;

  // High-risk topics — subjects below 60% from localStorage
  $: riskTopics = (() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (!raw) return [];
      const state = JSON.parse(raw);
      const marks: Record<string, string> = state.subjectMarks || {};
      const numericMarks: Record<string, number> = {};
      Object.entries(marks).forEach(([s, r]) => { if (r) numericMarks[s] = rangeMid(r); });
      return getRiskTopics(numericMarks, 60);
    } catch { return []; }
  })();

  // Mark colour helper
  function markColor(pct: number): string {
    if (pct >= 60) return 'var(--accent3)';
    if (pct >= 50) return 'var(--accent)';
    return 'var(--danger)';
  }

  // ── Mount ──────────────────────────────────────────────────
  onMount(async () => {
    // Safety: never show spinner forever — clear after 8s regardless
    const safetyTimer = setTimeout(() => { loading = false; }, 8000);

    // ── Step 1: Read localStorage immediately (no auth required) ──
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const marks: Record<string, string> = state.subjectMarks || {};
        const subjects = Object.entries(marks)
          .filter(([, v]) => v)
          .map(([name, range]) => ({ name, mark: rangeMid(range) }))
          .sort((a, b) => a.mark - b.mark);
        localSubjects = subjects;
        localAPS = state.apsTotal ?? 0;
        hasLocalAssessment = true;

        // Use localStorage as source of truth for display
        currentAps = localAPS;
        profile = {
          exam_system: state.answers?.exam_system ?? 'caps',
          streak_current: null,
          consented_at: null,
          terms_version: null,
        };

        // Set ring offset
        const pct = Math.min(100, Math.round((localAPS / 42) * 100));
        ringOffset = CIRCUMFERENCE * (1 - pct / 100);
      }
    } catch {}

    // Show data immediately — don't wait for auth
    loading = false;
    clearTimeout(safetyTimer);

    // ── Step 2: Try to enrich from Supabase (non-blocking) ──
    try {
      const sb = getSupabase();
      if (!sb) return;
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;
      const uid = session.user.id;

      // Fetch all dashboard data in parallel
      const [profileRes, goalRes, marksRes, taskRes] = await Promise.all([
        sb.from('profiles')
          .select('exam_system, streak_current, consented_at, terms_version')
          .eq('id', uid)
          .single(),
        sb.from('goals')
          .select('target_aps')
          .eq('user_id', uid)
          .eq('is_primary', true)
          .single(),
        sb.from('subject_marks')
          .select('subject_name, percentage, mark_type')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(5),
        sb.from('sba_tasks')
          .select('task_name, subject_name, due_date')
          .eq('user_id', uid)
          .neq('status', 'submitted')
          .gt('due_date', new Date().toISOString())
          .order('due_date', { ascending: true })
          .limit(1)
      ]);

      profile = profileRes.data ?? null;
      targetAps = goalRes.data?.target_aps ?? null;
      recentMarks = (marksRes.data ?? []) as Mark[];
      nextTask = taskRes.data?.[0] ?? null;
      streak = profile?.streak_current ?? 0;

      // Current APS: use store value (from localStorage assessment marks)
      currentAps = $apsResult.total ?? 0;

      // Animate ring after data loads
      const ratio = Math.min(currentAps / 42, 1);
      setTimeout(() => {
        ringOffset = CIRCUMFERENCE * (1 - ratio);
      }, 100);
    } catch (e) {
      console.error('[dashboard] onMount error:', e);
    } finally {
      clearTimeout(safetyTimer);
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>My Plan — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading your plan…</p>
    </div>

  {:else if !hasLocalAssessment}
    <!-- ── No assessment at all — send to assessment ───── -->
    <div class="unauth-wrap">
      <div class="unauth-icon">🎯</div>
      <h2>Start here</h2>
      <p>Take the 5-minute self-assessment to get your APS score, subject insights, and a personalised study plan.</p>
      <button class="btn btn-next" on:click={() => goto('/assessment')}>
        Start My Assessment →
      </button>
    </div>

  {:else}
    <!-- ── Authenticated dashboard ──────────────────────── -->
    <header class="dash-header">
      <div class="badge">
        {profile?.exam_system === 'ieb' ? 'IEB' : profile?.exam_system === 'caps' ? 'CAPS/NSC' : 'Matric'} · 2026
      </div>
      <h1>My Plan</h1>
    </header>

    <!-- Row 1: APS Ring + Countdown cards -->
    <div class="top-row">

      <!-- APS Ring -->
      <div class="card aps-card">
        <div class="card-label">APS Score</div>
        <div class="ring-wrap">
          <svg class="ring-svg" viewBox="0 0 120 120" width="120" height="120">
            <!-- Track -->
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="10"/>
            <!-- Progress -->
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="var(--accent)"
              stroke-width="10"
              stroke-linecap="round"
              stroke-dasharray="{CIRCUMFERENCE}"
              stroke-dashoffset="{ringOffset}"
              transform="rotate(-90 60 60)"
              style="transition: stroke-dashoffset 1s ease;"
            />
          </svg>
          <div class="ring-centre">
            <span class="ring-num">{currentAps}</span>
            <span class="ring-denom">/42</span>
          </div>
        </div>
        {#if targetAps}
          <p class="aps-target">Target: <strong>{targetAps}</strong></p>
        {:else}
          <p class="aps-target muted">Set a goal to track progress</p>
        {/if}
      </div>

      <!-- Countdown: Prelims -->
      <div class="card countdown-card">
        <div class="card-label">Prelims</div>
        <div class="countdown-num">{prelimDays}</div>
        <div class="countdown-unit">days away</div>
        <div class="countdown-date">
          {DATES[examKey].prelims.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
        </div>
      </div>

      <!-- Countdown: Finals -->
      <div class="card countdown-card finals-card">
        <div class="card-label">Finals</div>
        <div class="countdown-num">{finalDays}</div>
        <div class="countdown-unit">days away</div>
        <div class="countdown-date">
          {DATES[examKey].finals.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
        </div>
      </div>

    </div>

    <!-- Row 2: Streak -->
    <div class="card streak-card">
      <div class="streak-inner">
        <span class="streak-flame">🔥</span>
        <span class="streak-num">{streak}</span>
        <span class="streak-label">day{streak === 1 ? '' : 's'} streak</span>
      </div>
      {#if streak === 0}
        <p class="streak-sub">Open the app and study today to start your streak.</p>
      {:else if streak < 7}
        <p class="streak-sub">Keep going — {7 - streak} more day{7 - streak === 1 ? '' : 's'} to a week streak.</p>
      {:else}
        <p class="streak-sub">🏆 {streak}-day streak. Don't break it.</p>
      {/if}
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <a href="/panic" class="qa-btn panic-btn">
        <span class="qa-icon">🚨</span>
        <span class="qa-label">Panic Mode</span>
        <span class="qa-sub">Rescue plan now</span>
      </a>
      <a href="/share" class="qa-btn share-btn">
        <span class="qa-icon">📤</span>
        <span class="qa-label">Share APS</span>
        <span class="qa-sub">My APS card</span>
      </a>
      <a href="/deep" class="qa-btn deep-btn">
        <span class="qa-icon">🎯</span>
        <span class="qa-label">Deep Scan</span>
        <span class="qa-sub">Study profile</span>
      </a>
    </div>

    <!-- Row 3: Recent Marks -->
    <div class="card marks-card">
      <div class="card-label">Recent Marks</div>
      {#if recentMarks.length === 0}
        <p class="empty-state">No marks recorded yet. <a href="/assessment">Update your assessment</a> to see them here.</p>
      {:else}
        <ul class="marks-list">
          {#each recentMarks as m}
            <li class="mark-row">
              <span class="mark-subject">{m.subject_name}</span>
              <span class="mark-type">{m.mark_type}</span>
              <span class="mark-pct" style="color: {markColor(m.percentage)}">{m.percentage}%</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Row 4: SBA Alert -->
    <div class="card sba-card" class:urgent={taskUrgent}>
      <div class="card-label">Next SBA Deadline</div>
      {#if nextTask}
        <div class="sba-inner">
          <div class="sba-info">
            <span class="sba-task">{nextTask.task_name}</span>
            <span class="sba-subject">{nextTask.subject_name}</span>
          </div>
          <div class="sba-due" class:pulse={taskUrgent}>
            {daysUntil(new Date(nextTask.due_date))} days
          </div>
        </div>
        {#if taskUrgent}
          <p class="urgent-note">Due soon — prioritise this task today.</p>
        {/if}
      {:else}
        <p class="empty-state">No upcoming SBA tasks recorded. Add them to stay on track.</p>
      {/if}
    </div>

    <!-- Row 5: High-Value Topics (sure to be tested) -->
    {#if riskTopics.length > 0}
    <div class="card risk-card">
      <div class="card-label">⚠️ Sure to be Tested — Your Weak Subjects</div>
      <p class="risk-intro">These topics carry the most exam marks in your lowest-scoring subjects. Focus here first.</p>
      {#each riskTopics as r}
        <div class="risk-subject">
          <div class="risk-subject-header">
            <span class="risk-subj-name">{r.subject}</span>
            <span class="risk-subj-mark" style="color: {r.mark < 50 ? 'var(--danger)' : 'var(--accent)'}">~{r.mark}%</span>
          </div>
          {#each r.topics as t}
            <div class="risk-topic">
              <div class="risk-topic-top">
                <span class="risk-topic-name">{t.topic}</span>
                <span class="risk-topic-paper">{t.paper}</span>
                <span class="risk-topic-weight">~{t.weight}% of paper</span>
              </div>
              <p class="risk-topic-tip">💡 {t.tip}</p>
            </div>
          {/each}
        </div>
      {/each}
      <a href="/timetable" class="risk-cta">Build a timetable focused on these topics →</a>
    </div>
    {/if}

    <div class="dash-footer">
      <a href="/assessment">← Update assessment</a>
      <a href="/privacy">Privacy Notice</a>
    </div>

  {/if}
</div>

<style>
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  /* ── Loading ─────────────────────────────────────── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
    color: var(--muted);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* ── Unauthenticated ─────────────────────────────── */
  .unauth-wrap {
    text-align: center;
    padding-top: 3rem;
    animation: fadeDown 0.5s ease both;
  }

  .unauth-wrap h1 {
    font-family: var(--font-head);
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 800;
    color: var(--text);
    margin: 0.5rem 0;
  }

  .unauth-wrap .subtitle {
    color: var(--muted);
    max-width: 480px;
    margin: 0 auto 2rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .unauth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    max-width: 420px;
    margin: 0 auto;
    animation: fadeUp 0.5s ease both;
  }

  .unauth-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .unauth-card h2 {
    font-family: var(--font-head);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 0.75rem;
  }

  .unauth-card p {
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* ── Header ──────────────────────────────────────── */
  .dash-header {
    text-align: center;
    margin-bottom: 1.75rem;
    animation: fadeDown 0.5s ease both;
  }

  .badge {
    display: inline-block;
    background: rgba(124,77,255,.12);
    color: var(--accent);
    border: 1px solid rgba(124,77,255,.25);
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
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 800;
    color: var(--text);
    margin: 0;
  }

  /* ── Card base ───────────────────────────────────── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    animation: fadeUp 0.4s ease both;
  }

  .card-label {
    font-family: var(--font-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }

  /* ── Top row ─────────────────────────────────────── */
  .top-row {
    display: grid;
    grid-template-columns: 160px 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    animation: fadeUp 0.4s ease both;
  }

  /* ── APS Ring ────────────────────────────────────── */
  .aps-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ring-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0.5rem auto;
  }

  .ring-svg { display: block; }

  .ring-centre {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    line-height: 1;
  }

  .ring-num {
    font-family: var(--font-head);
    font-size: 2rem;
    font-weight: 800;
    color: var(--accent);
  }

  .ring-denom {
    font-family: var(--font-head);
    font-size: 0.75rem;
    color: var(--muted);
  }

  .aps-target {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0.25rem 0 0;
  }
  .aps-target strong { color: var(--text); }

  /* ── Countdown cards ─────────────────────────────── */
  .countdown-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .finals-card {
    background: linear-gradient(135deg, rgba(255,92,138,.06), rgba(124,77,255,.04));
    border-color: rgba(255,92,138,.2);
  }

  .countdown-num {
    font-family: var(--font-head);
    font-size: 3rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .finals-card .countdown-num { color: var(--danger); }

  .countdown-unit {
    font-size: 0.8rem;
    color: var(--muted);
    margin-bottom: 0.5rem;
  }

  .countdown-date {
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
  }

  /* ── Streak ──────────────────────────────────────── */
  .streak-card {
    margin-bottom: 1rem;
    animation-delay: 0.1s;
  }

  .streak-inner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
  }

  .streak-flame { font-size: 2rem; }

  .streak-num {
    font-family: var(--font-head);
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
  }

  .streak-label {
    font-family: var(--font-head);
    font-size: 1rem;
    font-weight: 600;
    color: var(--muted);
  }

  .streak-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin: 0;
  }

  /* ── Quick actions ───────────────────────────────── */
  .quick-actions {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: .6rem; margin-bottom: 1rem;
  }
  .qa-btn {
    display: flex; flex-direction: column; align-items: center;
    gap: .2rem; padding: .9rem .5rem;
    border-radius: 16px; text-decoration: none;
    border: 1px solid var(--border);
    background: var(--surface);
    transition: border-color .15s, background .15s;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
  }
  .qa-btn:hover { background: rgba(255,244,232,.04); }
  .panic-btn { border-color: rgba(248,113,113,.25); }
  .panic-btn:hover { border-color: rgba(248,113,113,.5); background: rgba(248,113,113,.06); }
  .share-btn { border-color: rgba(56,189,248,.25); }
  .share-btn:hover { border-color: rgba(56,189,248,.5); background: rgba(56,189,248,.06); }
  .deep-btn  { border-color: rgba(124,77,255,.25); }
  .deep-btn:hover  { border-color: rgba(124,77,255,.5); background: rgba(124,77,255,.06); }
  .qa-icon  { font-size: 1.3rem; line-height: 1; }
  .qa-label {
    font-family: var(--font-head); font-size: .75rem; font-weight: 700;
    color: var(--text);
  }
  .qa-sub { font-size: .62rem; color: var(--muted); font-weight: 300; }

  /* ── Recent marks ────────────────────────────────── */
  .marks-card {
    margin-bottom: 1rem;
    animation-delay: 0.15s;
  }

  .marks-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mark-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    background: var(--surface2);
    border-radius: 8px;
  }

  .mark-subject {
    flex: 1;
    font-size: 0.88rem;
    color: var(--text);
    font-weight: 500;
  }

  .mark-type {
    font-size: 0.72rem;
    color: var(--muted);
    text-transform: uppercase;
    font-family: var(--font-head);
    letter-spacing: 0.05em;
  }

  .mark-pct {
    font-family: var(--font-head);
    font-size: 0.95rem;
    font-weight: 700;
    min-width: 40px;
    text-align: right;
  }

  /* ── SBA Alert ───────────────────────────────────── */
  .sba-card {
    margin-bottom: 1.5rem;
    animation-delay: 0.2s;
  }

  .sba-card.urgent {
    border-color: rgba(255,92,138,.4);
    background: linear-gradient(135deg, rgba(255,92,138,.06), var(--surface));
  }

  .sba-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .sba-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .sba-task {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text);
  }

  .sba-subject {
    font-size: 0.8rem;
    color: var(--muted);
  }

  .sba-due {
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--accent3);
    white-space: nowrap;
  }

  .sba-due.pulse { color: var(--danger); animation: pulse 1.5s ease-in-out infinite; }

  .urgent-note {
    font-size: 0.8rem;
    color: var(--danger);
    margin: 0.75rem 0 0;
  }

  /* ── Footer ──────────────────────────────────────── */
  .dash-footer {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding-top: 0.5rem;
  }

  .dash-footer a {
    color: var(--muted);
    font-size: 0.82rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .dash-footer a:hover { color: var(--accent2); }

  /* ── Shared ──────────────────────────────────────── */
  .empty-state {
    font-size: 0.875rem;
    color: var(--muted);
    margin: 0;
  }
  .empty-state a { color: var(--accent2); }

  .btn {
    font-family: var(--font-head);
    font-weight: 700;
    border: none;
    border-radius: var(--radius);
    padding: 0.75rem 1.75rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn:not(:disabled):hover { transform: translateY(-1px); }

  .btn-next {
    background: var(--grad-cta);
    color: #0d1117;
  }

  /* ── Responsive ──────────────────────────────────── */
  @media (max-width: 560px) {
    .top-row {
      grid-template-columns: 1fr 1fr;
    }
    .aps-card {
      grid-column: 1 / -1;
    }
  }

  /* ── High-value risk topics ──────────────────────── */
  .risk-card { border-color: rgba(255,92,138,.2); }
  .risk-intro { font-size: 0.8rem; color: var(--muted); margin: 0 0 1rem; line-height: 1.5; }
  .risk-subject { margin-bottom: 1.25rem; }
  .risk-subject:last-of-type { margin-bottom: 0.5rem; }
  .risk-subject-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .risk-subj-name { font-family: var(--font-head); font-size: 0.9rem; font-weight: 800; color: var(--text); }
  .risk-subj-mark { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; }
  .risk-topic { background: var(--surface2); border-radius: 8px; padding: 0.6rem 0.75rem; margin-bottom: 0.4rem; }
  .risk-topic-top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.3rem; }
  .risk-topic-name { font-size: 0.85rem; font-weight: 600; color: var(--text); flex: 1; }
  .risk-topic-paper { font-size: 0.68rem; background: rgba(124,77,255,.1); color: var(--accent); border-radius: 999px; padding: 0.15rem 0.5rem; white-space: nowrap; }
  .risk-topic-weight { font-size: 0.68rem; background: rgba(255,92,138,.1); color: var(--danger); border-radius: 999px; padding: 0.15rem 0.5rem; white-space: nowrap; font-family: var(--font-head); font-weight: 700; }
  .risk-topic-tip { font-size: 0.75rem; color: var(--muted); margin: 0; line-height: 1.5; }
  .risk-cta { display: inline-block; margin-top: 0.75rem; font-size: 0.8rem; color: var(--accent2); text-decoration: none; font-family: var(--font-head); font-weight: 600; }
  .risk-cta:hover { text-decoration: underline; }

  /* ── Plan-ready card ─────────────────────────────── */
  .plan-ready-card { background: var(--surface); border: 1px solid rgba(124,77,255,.25); border-radius: 16px; padding: 1.5rem; max-width: 480px; margin: 1.5rem auto 0; text-align: left; }
  .plan-aps-row { display: flex; gap: 1.5rem; margin-bottom: 1.25rem; align-items: flex-start; }
  .plan-aps-block { text-align: center; flex-shrink: 0; }
  .plan-aps-num { font-family: var(--font-head); font-size: 2.5rem; font-weight: 800; color: var(--accent); line-height: 1; }
  .plan-aps-label { font-size: 0.7rem; color: var(--muted); margin-top: 0.25rem; }
  .plan-subjects { flex: 1; }
  .plan-subjects-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--font-head); font-weight: 700; margin-bottom: 0.5rem; }
  .plan-subject-row { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
  .plan-subject-row:last-child { border-bottom: none; }
  .plan-subj-name { color: var(--text); }
  .plan-subj-mark { font-family: var(--font-head); font-weight: 700; font-size: 0.9rem; }
  .plan-actions { display: flex; flex-direction: column; gap: 0.5rem; }
  .btn-ghost-sm { background: transparent; border: 1px solid var(--border); color: var(--muted); font-family: var(--font-head); font-size: 0.85rem; font-weight: 600; padding: 0.65rem 1.25rem; border-radius: 999px; cursor: pointer; transition: all 0.2s; }
  .btn-ghost-sm:hover { border-color: var(--accent2); color: var(--accent2); }

  /* ── Animations ──────────────────────────────────── */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
</style>
