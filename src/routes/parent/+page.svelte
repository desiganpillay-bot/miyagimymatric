<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { FIELDS, UNIVERSITIES } from '$lib/constants';
  import { computeAPS, rangeMid } from '$lib/aps';

  // ── State ──────────────────────────────────────────────────
  let error = '';
  let loaded = false;

  let aps = 0;
  let best6: { name: string; pct: number; aps: number }[] = [];
  let allSubjects: { name: string; pct: number; aps: number }[] = [];
  let examSystem = 'caps';
  let grade = '12';
  let targetFieldId = '';
  let targetUniIds: string[] = [];
  let weeklyHours = 0;
  let sbaAttitude = '';
  let challenges: string[] = [];

  const DATES = {
    caps:   { prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') },
    ieb:    { prelims: new Date('2026-09-08'), finals: new Date('2026-11-10') },
    unsure: { prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') }
  } as const;

  function daysUntil(d: Date): number {
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.max(0, Math.round((d.getTime() - now.getTime()) / 86400000));
  }

  function apsColor(aps: number): string {
    if (aps >= 6) return 'var(--accent3)';
    if (aps >= 5) return 'var(--accent2)';
    if (aps >= 4) return 'var(--accent)';
    return 'var(--danger)';
  }

  function challengeLabel(c: string): string {
    const map: Record<string, string> = {
      procrastination: 'Procrastination',
      distraction:     'Phone / social media',
      anxiety:         'Exam anxiety',
      understanding:   'Content gaps',
      time:            'Not enough time',
      data:            'Data / load shedding',
      space:           'No quiet study space',
      motivation:      'Low motivation'
    };
    return map[c] ?? c;
  }

  function sbaLabel(v: string): string {
    const map: Record<string, string> = {
      strategic:   'Treats tasks strategically — both prep and marks',
      complete:    'Completes tasks, focused on getting them done',
      last_minute: 'Often leaves tasks to the last minute',
      miss:        'Sometimes misses SBA tasks (high risk)'
    };
    return map[v] ?? v;
  }

  onMount(() => {
    const encoded = $page.url.searchParams.get('d');
    if (!encoded) {
      error = 'This link has no data. Ask your learner to re-share from the app.';
      return;
    }
    try {
      const decoded = JSON.parse(atob(encoded));
      const marks: Record<string, string> = decoded.subjectMarks || {};
      const answers = decoded.answers || {};

      examSystem     = answers.exam_system || 'caps';
      grade          = answers.grade || '12';
      targetFieldId  = answers.field || '';
      targetUniIds   = Array.isArray(answers.universities) ? answers.universities : [];
      weeklyHours    = Number(answers.weekly_hours) || 0;
      sbaAttitude    = answers.sba_attitude || '';
      challenges     = Array.isArray(answers.challenges) ? answers.challenges : [];

      const numMarks: Record<string, number> = {};
      Object.entries(marks).forEach(([s, r]) => { if (r) numMarks[s] = rangeMid(r); });

      const result = computeAPS(numMarks);
      aps   = result.total;
      best6 = result.best6.map((r: any) => ({ name: r.name, pct: r.pct, aps: r.aps }));

      allSubjects = Object.entries(numMarks)
        .map(([name, pct]) => {
          const b6 = result.best6.find((r: any) => r.name === name);
          return { name, pct, aps: b6?.aps ?? 0 };
        })
        .sort((a, b) => b.pct - a.pct);

      loaded = true;
    } catch {
      error = 'Could not read the shared data — ask your learner to re-share from the app.';
    }
  });

  $: examKey     = (examSystem as keyof typeof DATES) in DATES ? examSystem as keyof typeof DATES : 'caps';
  $: prelimDays  = loaded ? daysUntil(DATES[examKey].prelims) : 0;
  $: finalDays   = loaded ? daysUntil(DATES[examKey].finals)  : 0;
  $: targetField = FIELDS.find(f => f.id === targetFieldId);
  $: targetUnis  = UNIVERSITIES.filter(u => targetUniIds.includes(u.id));
  $: apsPercent  = Math.min(100, Math.round((aps / 42) * 100));
  $: sbaRisk     = sbaAttitude === 'miss';
</script>

<svelte:head>
  <title>Parent View — Miyagi My Matric</title>
</svelte:head>

<div class="app pv-page">

  <!-- Header -->
  <div class="pv-header">
    <div class="pv-brand">
      <span class="brand-m">M</span>
      <div class="brand-text">
        <span class="brand-name">Miyagi My Matric</span>
        <span class="brand-sub">Parent / Guardian View</span>
      </div>
    </div>
    <div class="pv-badge">Read only</div>
  </div>

  {#if error}
    <div class="pv-error">
      <p>⚠️ {error}</p>
    </div>

  {:else if !loaded}
    <div class="pv-loading">Loading profile…</div>

  {:else}

    <!-- APS hero -->
    <div class="pv-card pv-hero" style="animation: fadeUp .4s ease both">
      <div class="hero-ring-wrap">
        <svg viewBox="0 0 120 120" class="hero-ring">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface2)" stroke-width="10"/>
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--accent)"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="339.3"
            stroke-dashoffset="{339.3 - (339.3 * apsPercent / 100)}"
            transform="rotate(-90 60 60)"
            style="transition: stroke-dashoffset 1s ease"
          />
        </svg>
        <div class="hero-num">{aps}</div>
      </div>
      <div class="hero-info">
        <div class="hero-label">APS Score</div>
        <div class="hero-denom">out of 42</div>
        <div class="hero-sys">{examSystem.toUpperCase()} · Grade {grade}</div>
        {#if targetField}
          <div class="hero-field">{targetField.icon} {targetField.label}</div>
        {/if}
      </div>
    </div>

    <!-- Countdowns -->
    <div class="pv-card pv-counts" style="animation: fadeUp .45s ease both">
      <div class="count-item">
        <div class="count-val {prelimDays <= 30 ? 'urgent' : ''}">{prelimDays}</div>
        <div class="count-label">days to prelims</div>
      </div>
      <div class="count-divider"></div>
      <div class="count-item">
        <div class="count-val {finalDays <= 60 ? 'semi-urgent' : ''}">{finalDays}</div>
        <div class="count-label">days to finals</div>
      </div>
    </div>

    <!-- University targets -->
    {#if targetUnis.length > 0}
    <div class="pv-card" style="animation: fadeUp .5s ease both">
      <h3 class="pv-section-title">University Targets</h3>
      <div class="uni-list">
        {#each targetUnis as u}
          {@const req = targetField?.apsReqs?.[u.id]}
          <div class="uni-row">
            <div class="uni-info">
              <span class="uni-abbr">{u.abbr}</span>
              <span class="uni-name">{u.name}</span>
            </div>
            {#if req}
              <div class="uni-gap-block">
                {#if aps >= req}
                  <span class="uni-status met">✓ Met ({aps}/{req})</span>
                {:else}
                  <span class="uni-status gap">+{req - aps} needed ({aps}/{req})</span>
                {/if}
              </div>
            {:else}
              <span class="uni-status unknown">Requirements vary</span>
            {/if}
          </div>
        {/each}
      </div>
      {#if targetField}
        <p class="pv-note">{targetField.notes}</p>
      {/if}
    </div>
    {/if}

    <!-- Subject breakdown -->
    {#if allSubjects.length > 0}
    <div class="pv-card" style="animation: fadeUp .55s ease both">
      <h3 class="pv-section-title">Subject Marks</h3>
      <div class="subj-table">
        <div class="subj-thead">
          <span>Subject</span>
          <span>Mark</span>
          <span>APS</span>
        </div>
        {#each allSubjects as s}
          <div class="subj-tr {best6.some(b => b.name === s.name) ? 'in-best6' : ''}">
            <span class="subj-td name">
              {s.name}
              {#if best6.some(b => b.name === s.name)}
                <span class="best6-dot" title="Counts in APS"></span>
              {/if}
            </span>
            <span class="subj-td pct">{s.pct}%</span>
            <span class="subj-td pts" style="color: {apsColor(s.aps)}">{s.aps}</span>
          </div>
        {/each}
      </div>
      <p class="pv-note">APS uses best 6 subjects (highlighted · excludes Life Orientation).</p>
    </div>
    {/if}

    <!-- Study habits -->
    <div class="pv-card" style="animation: fadeUp .6s ease both">
      <h3 class="pv-section-title">Study Habits</h3>
      <div class="habits-grid">
        <div class="habit-item">
          <div class="habit-val">{weeklyHours || '—'}</div>
          <div class="habit-label">hrs/week studying outside school</div>
        </div>
        {#if sbaAttitude}
        <div class="habit-item {sbaRisk ? 'risk' : ''}">
          <div class="habit-val sba-ico">{sbaRisk ? '⚠️' : '✅'}</div>
          <div class="habit-label">SBA approach: {sbaLabel(sbaAttitude)}</div>
        </div>
        {/if}
      </div>
      {#if sbaRisk}
        <div class="pv-alert">
          SBA tasks are worth 25% of the final mark. Missing them can result in a "Not Resulted" status — no NSC certificate, regardless of exam performance.
        </div>
      {/if}
      {#if challenges.length > 0}
        <div class="challenges-wrap">
          <div class="challenges-label">Self-reported challenges:</div>
          <div class="challenges-list">
            {#each challenges as c}
              <span class="challenge-tag">{challengeLabel(c)}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- What you can do -->
    <div class="pv-card pv-help" style="animation: fadeUp .65s ease both">
      <h3 class="pv-section-title">How to support at home</h3>
      <ul class="help-list">
        <li>Ask about one specific subject per week — not "how was school?" but "how is [subject] going?"</li>
        <li>The single most effective matric tool is past exam papers. Ask if they're using them yet.</li>
        <li>Stress and sleep are top performance drivers. Check in without adding pressure.</li>
        {#if sbaRisk}
          <li><strong>Priority:</strong> Ask specifically about SBA deadlines — they are worth 25% and missing them has severe consequences.</li>
        {/if}
        {#if challenges.includes('anxiety')}
          <li>Your learner flagged exam anxiety. Consider the SADAG helpline (0800 456 789, free) if it becomes acute.</li>
        {/if}
      </ul>
    </div>

    <!-- Footer -->
    <div class="pv-footer">
      <p>This is a read-only snapshot shared by your learner.</p>
      <p>Data updates when they re-share from <strong>miyagimymatric.com</strong></p>
    </div>

  {/if}

</div>

<style>
  .pv-page { max-width: 560px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

  .pv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .pv-brand { display: flex; align-items: center; gap: .7rem; }
  .brand-m {
    font-family: var(--font-head);
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
  }
  .brand-text { display: flex; flex-direction: column; }
  .brand-name { font-family: var(--font-head); font-weight: 700; font-size: .95rem; }
  .brand-sub  { font-size: .72rem; color: var(--muted); }
  .pv-badge {
    font-size: .7rem;
    font-family: var(--font-head);
    font-weight: 700;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: .25rem .7rem;
  }

  .pv-error {
    background: rgba(248,113,113,.08);
    border: 1px solid rgba(248,113,113,.3);
    border-radius: var(--radius);
    padding: 1.5rem;
    color: var(--danger);
    text-align: center;
  }
  .pv-loading { text-align: center; color: var(--muted); padding: 2rem; }

  .pv-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.4rem;
    margin-bottom: 1rem;
  }

  /* APS hero */
  .pv-hero { display: flex; align-items: center; gap: 1.4rem; }
  .hero-ring-wrap { position: relative; width: 100px; flex-shrink: 0; }
  .hero-ring { width: 100px; height: 100px; display: block; }
  .hero-num {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-head);
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
  }
  .hero-info { display: flex; flex-direction: column; gap: .2rem; }
  .hero-label { font-size: .75rem; color: var(--muted); font-weight: 500; }
  .hero-denom { font-family: var(--font-head); font-size: .9rem; color: var(--muted); }
  .hero-sys   { font-size: .78rem; color: var(--accent2); margin-top: .3rem; font-weight: 600; }
  .hero-field { font-size: .85rem; margin-top: .2rem; }

  /* Countdowns */
  .pv-counts { display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
  .count-item { text-align: center; }
  .count-val {
    font-family: var(--font-head);
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
  }
  .count-val.urgent { color: var(--danger); }
  .count-val.semi-urgent { color: var(--accent); }
  .count-label { font-size: .75rem; color: var(--muted); margin-top: .2rem; }
  .count-divider { width: 1px; height: 40px; background: var(--border); }

  /* Section title */
  .pv-section-title {
    font-family: var(--font-head);
    font-size: .85rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin: 0 0 1rem;
  }

  /* University rows */
  .uni-list { display: flex; flex-direction: column; gap: .6rem; }
  .uni-row  { display: flex; align-items: center; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
  .uni-info { display: flex; align-items: baseline; gap: .5rem; }
  .uni-abbr { font-family: var(--font-head); font-weight: 700; font-size: .9rem; }
  .uni-name { font-size: .8rem; color: var(--muted); }
  .uni-status { font-size: .8rem; font-weight: 600; padding: .2rem .6rem; border-radius: 100px; }
  .uni-status.met     { background: rgba(74,222,128,.12); color: var(--accent3); }
  .uni-status.gap     { background: rgba(248,113,113,.1); color: var(--danger); }
  .uni-status.unknown { color: var(--muted); }

  /* Subject table */
  .subj-table { display: flex; flex-direction: column; gap: 0; }
  .subj-thead {
    display: grid;
    grid-template-columns: 1fr 60px 40px;
    font-size: .7rem;
    color: var(--muted);
    font-weight: 600;
    padding: 0 0 .4rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: .3rem;
  }
  .subj-tr {
    display: grid;
    grid-template-columns: 1fr 60px 40px;
    padding: .35rem 0;
    border-bottom: 1px solid rgba(255,255,255,.03);
    font-size: .85rem;
  }
  .subj-tr.in-best6 { background: rgba(246,201,14,.03); }
  .subj-td.name {
    display: flex;
    align-items: center;
    gap: .4rem;
    color: var(--text);
  }
  .subj-td.pct { color: var(--muted); }
  .subj-td.pts { font-family: var(--font-head); font-weight: 700; }
  .best6-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  /* Habits */
  .habits-grid { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: .8rem; }
  .habit-item { flex: 1; min-width: 120px; }
  .habit-item.risk .habit-label { color: var(--danger); }
  .habit-val {
    font-family: var(--font-head);
    font-size: 1.6rem;
    font-weight: 800;
  }
  .habit-val.sba-ico { font-size: 1.3rem; }
  .habit-label { font-size: .78rem; color: var(--muted); margin-top: .2rem; line-height: 1.4; }

  .pv-alert {
    background: rgba(248,113,113,.08);
    border: 1px solid rgba(248,113,113,.25);
    border-radius: 10px;
    padding: .75rem 1rem;
    font-size: .82rem;
    color: var(--danger);
    line-height: 1.5;
    margin-bottom: .8rem;
  }

  .challenges-wrap { margin-top: .6rem; }
  .challenges-label { font-size: .75rem; color: var(--muted); margin-bottom: .4rem; }
  .challenges-list { display: flex; flex-wrap: wrap; gap: .4rem; }
  .challenge-tag {
    font-size: .75rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: .2rem .6rem;
    color: var(--text);
  }

  /* Help section */
  .pv-help { background: var(--surface2); border-color: rgba(56,189,248,.15); }
  .help-list {
    margin: 0;
    padding: 0 0 0 1.2rem;
    display: flex;
    flex-direction: column;
    gap: .6rem;
    font-size: .88rem;
    line-height: 1.55;
    color: var(--text);
  }

  /* Note text */
  .pv-note { font-size: .75rem; color: var(--muted); margin: .8rem 0 0; line-height: 1.4; }

  /* Footer */
  .pv-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: .78rem;
    color: var(--muted);
    line-height: 1.6;
  }
  .pv-footer strong { color: var(--text); }

  /* Animations (matching site-wide) */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
