<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabase } from '$lib/supabase';
  import { apsResult } from '$lib/stores/assessment';

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
    caps:  { prelims: new Date('2025-08-25'), finals: new Date('2025-10-21') },
    ieb:   { prelims: new Date('2025-09-09'), finals: new Date('2025-09-09') },
    unsure:{ prelims: new Date('2025-08-25'), finals: new Date('2025-10-21') }
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

  // Mark colour helper
  function markColor(pct: number): string {
    if (pct >= 60) return 'var(--accent3)';
    if (pct >= 50) return 'var(--accent)';
    return 'var(--danger)';
  }

  // ── Mount ──────────────────────────────────────────────────
  onMount(async () => {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      loading = false;
      return;
    }

    authed = true;
    const uid = session.user.id;

    // Write POPIA consent from localStorage if present (first login)
    const consentRaw = localStorage.getItem('mmm_consent_v1');
    if (consentRaw) {
      try {
        const consent = JSON.parse(consentRaw) as { consented_at: string; terms_version: string };
        await sb.from('profiles').upsert({
          id: uid,
          consented_at: consent.consented_at,
          terms_version: consent.terms_version
        }, { onConflict: 'id' });
        localStorage.removeItem('mmm_consent_v1');
      } catch {
        // non-critical — don't block dashboard render
      }
    }

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
    const target = targetAps ?? 42;
    const ratio = Math.min(currentAps / 42, 1);
    setTimeout(() => {
      ringOffset = CIRCUMFERENCE * (1 - ratio);
    }, 100);

    loading = false;
  });
</script>

<svelte:head>
  <title>Dashboard — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading your dashboard…</p>
    </div>

  {:else if !authed}
    <!-- ── Unauthenticated ───────────────────────────────── -->
    <div class="unauth-wrap">
      <div class="badge">Your Sensei Awaits</div>
      <h1>Your Dashboard</h1>
      <p class="subtitle">Complete your self-assessment first, then save your profile to unlock your personalised dashboard.</p>
      <div class="unauth-card">
        <div class="unauth-icon">🎯</div>
        <h2>No profile found</h2>
        <p>Take the 5-minute self-assessment to get your APS score, subject insights, and a personalised study plan.</p>
        <button class="btn btn-next" on:click={() => goto('/assessment')}>
          Start My Assessment →
        </button>
      </div>
    </div>

  {:else}
    <!-- ── Authenticated dashboard ──────────────────────── -->
    <header class="dash-header">
      <div class="badge">
        {profile?.exam_system === 'ieb' ? 'IEB' : profile?.exam_system === 'caps' ? 'CAPS/NSC' : 'Matric'} · 2025
      </div>
      <h1>Your Dashboard</h1>
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
      <p class="streak-sub">Keep studying daily to build your streak.</p>
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
    background: linear-gradient(135deg, rgba(248,113,113,.06), rgba(246,201,14,.04));
    border-color: rgba(248,113,113,.2);
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
    border-color: rgba(248,113,113,.4);
    background: linear-gradient(135deg, rgba(248,113,113,.06), var(--surface));
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
    background: linear-gradient(135deg, var(--accent), #e6b800);
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
