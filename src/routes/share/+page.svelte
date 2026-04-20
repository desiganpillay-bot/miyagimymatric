<script lang="ts">
  import { onMount } from 'svelte';
  import { FIELDS, UNIVERSITIES } from '$lib/constants';
  import { rangeMid, computeAPS } from '$lib/aps';

  // ── State ──────────────────────────────────────────────────
  let aps        = 0;
  let best6: { name: string; pct: number; pts: number }[] = [];
  let targetField = '';
  let targetUnis: string[] = [];
  let examSystem = 'caps';
  let grade      = '12';
  let prelimDays = 0;
  let finalDays  = 0;
  let downloaded = false;
  let shared     = false;
  let canShare   = false;

  const DATES = {
    caps:  { prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') },
    ieb:   { prelims: new Date('2026-09-08'), finals: new Date('2026-11-10') },
    unsure:{ prelims: new Date('2026-08-25'), finals: new Date('2026-10-21') },
  } as const;

  function daysUntil(d: Date): number {
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.max(0, Math.round((d.getTime() - now.getTime()) / 86400000));
  }

  function ptsColor(pts: number): string {
    if (pts >= 6) return '#7AFF7A';
    if (pts >= 5) return '#7C4DFF';
    if (pts >= 4) return '#FFB300';
    return '#FF5C8A';
  }

  onMount(() => {
    canShare = !!navigator.share;
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (!raw) return;
      const state = JSON.parse(raw);
      const marks: Record<string, string> = state.subjectMarks || {};
      const answers = state.answers || {};

      examSystem = answers.exam_system || 'caps';
      grade      = answers.grade || '12';
      targetField = answers.field || '';
      targetUnis  = Array.isArray(answers.universities) ? answers.universities : [];

      // Compute APS
      const numMarks: Record<string, number> = {};
      Object.entries(marks).forEach(([s, r]) => { if (r) numMarks[s] = rangeMid(r); });
      const result = computeAPS(numMarks);
      aps   = result.total;
      best6 = result.best6.map((r: any) => ({ name: r.subject, pct: r.pct, pts: r.pts }));

      // Dates
      const key = (examSystem as keyof typeof DATES) in DATES ? examSystem as keyof typeof DATES : 'caps';
      prelimDays = daysUntil(DATES[key].prelims);
      finalDays  = daysUntil(DATES[key].finals);
    } catch {}
  });

  // Download card as PNG using canvas
  async function downloadCard() {
    const card = document.getElementById('share-card');
    if (!card) return;
    // Use html2canvas-lite approach via SVG foreignObject
    const xml = new XMLSerializer().serializeToString(card);
    // Fallback: just trigger print
    window.print();
    downloaded = true;
  }

  async function shareCard() {
    const text = `My APS: ${aps}/42 · ${finalDays} days to finals · Built with Miyagi My Matric 🎓\nmiyagimymatric.com`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Matric APS', text, url: 'https://miyagimymatric.com' });
        shared = true;
      } else {
        await navigator.clipboard.writeText(text);
        shared = true;
      }
    } catch {}
  }

  $: field = FIELDS.find(f => f.id === targetField);
  $: unis  = UNIVERSITIES.filter(u => targetUnis.includes(u.id)).slice(0, 3);
</script>

<svelte:head>
  <title>My APS Card — Miyagi My Matric</title>
</svelte:head>

<div class="app share-page">

  <div class="page-intro">
    <p class="intro-label">Share your progress</p>
    <p class="intro-sub">Your APS snapshot — post to WhatsApp status or IG stories.</p>
  </div>

  <!-- The shareable card -->
  <div class="card-wrap">
    <div id="share-card" class="share-card">
      <!-- Background orbs -->
      <div class="card-orb orb1"></div>
      <div class="card-orb orb2"></div>

      <!-- Top: brand -->
      <div class="card-brand">
        <span class="brand-m">M</span>
        <span class="brand-name">Miyagi My Matric</span>
      </div>

      <!-- APS hero -->
      <div class="card-aps-wrap">
        <div class="card-aps-score">{aps}</div>
        <div class="card-aps-denom">/42 APS</div>
      </div>

      <!-- Progress bar -->
      <div class="card-bar-track">
        <div class="card-bar-fill" style="width: {Math.min(100, Math.round((aps / 42) * 100))}%"></div>
      </div>

      <!-- Countdowns -->
      <div class="card-counts">
        <div class="card-count">
          <div class="count-val">{prelimDays}</div>
          <div class="count-label">days to prelims</div>
        </div>
        <div class="card-count-divider"></div>
        <div class="card-count">
          <div class="count-val">{finalDays}</div>
          <div class="count-label">days to finals</div>
        </div>
        {#if field}
        <div class="card-count-divider"></div>
        <div class="card-count">
          <div class="count-val" style="font-size: 1rem">{field.icon}</div>
          <div class="count-label">{field.label}</div>
        </div>
        {/if}
      </div>

      <!-- Best 6 subjects -->
      {#if best6.length > 0}
      <div class="card-subjects">
        <div class="subjects-label">Best 6 subjects</div>
        <div class="subjects-list">
          {#each best6.slice(0, 6) as s}
            <div class="subject-chip">
              <span class="chip-name">{s.name.split(' ')[0]}</span>
              <span class="chip-pts" style="color: {ptsColor(s.pts)}">{s.pts}</span>
            </div>
          {/each}
        </div>
      </div>
      {/if}

      <!-- Uni targets -->
      {#if unis.length > 0}
      <div class="card-unis">
        {#each unis as u}
          <span class="uni-chip">{u.abbr}</span>
        {/each}
      </div>
      {/if}

      <!-- Footer -->
      <div class="card-footer">
        <span class="footer-tag">{examSystem.toUpperCase()} · Grade {grade}</span>
        <span class="footer-url">miyagimymatric.com</span>
      </div>
    </div>
  </div>

  <!-- Action buttons -->
  <div class="share-actions">
    <button class="btn btn-next share-btn" on:click={shareCard}>
      {shared ? '✓ Copied to clipboard' : (canShare ? '↑ Share' : '↑ Copy to clipboard')}
    </button>
    <button class="btn btn-outline share-btn" on:click={downloadCard}>
      {downloaded ? '✓ Saving...' : '⬇ Save as image'}
    </button>
  </div>

  <p class="share-hint">
    On iPhone: tap Share → Save to Photos.<br>
    On Android: screenshot the card above.
  </p>

  <div class="back-links">
    <a href="/dashboard" class="back-link-item">← My Plan</a>
    <a href="/assessment" class="back-link-item">Update my profile →</a>
  </div>
</div>

<style>
  .share-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5rem;
  }

  .page-intro {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .intro-label {
    font-family: var(--font-head);
    font-size: .65rem; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); margin-bottom: .3rem;
  }
  .intro-sub {
    font-size: .85rem; color: var(--muted); font-weight: 300;
  }

  /* Card */
  .card-wrap {
    width: 100%;
    max-width: 360px;
    margin-bottom: 1.5rem;
  }

  .share-card {
    position: relative;
    background: #0D0A18;
    border-radius: 24px;
    padding: 2rem 1.8rem 1.5rem;
    overflow: hidden;
    border: 1px solid rgba(124,77,255,.25);
    box-shadow: 0 24px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(124,77,255,.1);
  }

  .card-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .orb1 {
    width: 220px; height: 220px;
    top: -80px; left: -60px;
    background: radial-gradient(circle, rgba(124,77,255,.25) 0%, transparent 70%);
  }
  .orb2 {
    width: 180px; height: 180px;
    bottom: -60px; right: -40px;
    background: radial-gradient(circle, rgba(224,64,251,.18) 0%, transparent 70%);
  }

  .card-brand {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: 1.8rem;
    position: relative;
  }
  .brand-m {
    width: 26px; height: 26px;
    border-radius: 7px;
    background: linear-gradient(135deg, #7C4DFF, #E040FB, #FFB300);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: .75rem; font-weight: 800; color: #0D0A18;
  }
  .brand-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .72rem; font-weight: 700;
    color: rgba(255,244,232,.5);
    letter-spacing: .04em;
  }

  .card-aps-wrap {
    display: flex;
    align-items: baseline;
    gap: .5rem;
    margin-bottom: .75rem;
    position: relative;
  }
  .card-aps-score {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 5rem; font-weight: 800; line-height: 1;
    background: linear-gradient(135deg, #7C4DFF, #E040FB, #FFB300);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .card-aps-denom {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem; font-weight: 600;
    color: rgba(255,244,232,.35);
    padding-bottom: .8rem;
  }

  .card-bar-track {
    height: 6px;
    background: rgba(255,244,232,.08);
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    position: relative;
  }
  .card-bar-fill {
    height: 100%;
    background: linear-gradient(to right, #7C4DFF, #E040FB, #FFB300);
    border-radius: 100px;
    transition: width .8s cubic-bezier(.4,0,.2,1);
  }

  .card-counts {
    display: flex;
    align-items: center;
    gap: .8rem;
    margin-bottom: 1.4rem;
    position: relative;
  }
  .card-count { flex: 1; text-align: center; }
  .count-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem; font-weight: 800;
    color: #FFF4E8; line-height: 1; margin-bottom: .2rem;
  }
  .count-label {
    font-size: .62rem; color: rgba(255,244,232,.4);
    font-weight: 300; line-height: 1.3;
  }
  .card-count-divider {
    width: 1px; height: 32px;
    background: rgba(255,244,232,.1);
    flex-shrink: 0;
  }

  .card-subjects {
    margin-bottom: 1rem;
    position: relative;
  }
  .subjects-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .6rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: rgba(255,244,232,.3);
    margin-bottom: .5rem;
  }
  .subjects-list {
    display: flex; flex-wrap: wrap; gap: .35rem;
  }
  .subject-chip {
    display: flex; align-items: center; gap: .3rem;
    background: rgba(255,244,232,.05);
    border: 1px solid rgba(255,244,232,.08);
    border-radius: 6px;
    padding: .25rem .5rem;
  }
  .chip-name {
    font-size: .68rem; color: rgba(255,244,232,.6);
    font-family: 'Space Grotesk', sans-serif;
  }
  .chip-pts {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .72rem; font-weight: 800;
  }

  .card-unis {
    display: flex; gap: .4rem; margin-bottom: 1.2rem;
    position: relative;
  }
  .uni-chip {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .65rem; font-weight: 800;
    color: var(--accent2);
    background: rgba(224,64,251,.1);
    border: 1px solid rgba(224,64,251,.2);
    border-radius: 5px;
    padding: .2rem .5rem;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: .8rem;
    border-top: 1px solid rgba(255,244,232,.07);
    position: relative;
  }
  .footer-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .6rem; font-weight: 700;
    color: rgba(255,244,232,.25);
    letter-spacing: .08em; text-transform: uppercase;
  }
  .footer-url {
    font-size: .6rem;
    color: rgba(255,244,232,.2);
    font-weight: 300;
  }

  /* Actions */
  .share-actions {
    display: flex;
    flex-direction: column;
    gap: .6rem;
    width: 100%;
    max-width: 360px;
    margin-bottom: .75rem;
  }
  .share-btn { width: 100%; }

  .share-hint {
    font-size: .72rem;
    color: var(--muted);
    font-weight: 300;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .back-links {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .back-link-item {
    font-family: var(--font-head);
    font-size: .78rem; font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    transition: color .15s;
  }
  .back-link-item:hover { color: var(--text); }

  @media print {
    .share-actions, .share-hint, .back-links, .page-intro { display: none; }
    .share-card { box-shadow: none; border: none; }
  }
</style>
