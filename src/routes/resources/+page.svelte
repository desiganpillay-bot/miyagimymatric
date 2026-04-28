<script lang="ts">
  import { onMount } from 'svelte';

  let examSystem: 'ieb' | 'caps' | 'unsure' = 'unsure';
  let active = 'all';
  let copied = '';

  const FILTERS = [
    { id: 'all',       label: 'All' },
    { id: 'free_data', label: '📶 Free Data' },
    { id: 'papers',    label: '📄 Past Papers' },
    { id: 'video',     label: '▶️ Watch' },
    { id: 'tools',     label: '🛠 Tools' },
    { id: 'vibes',     label: '💚 Wellbeing' },
  ];

  type Resource = {
    id: string;
    name: string;
    url: string;
    link: string;
    desc: string;
    tags: string[];
    category: string;
    badges: { label: string; color: string }[];
    stat?: string;
    tip?: string;
    ieb?: boolean;
    caps?: boolean;
  };

  const RESOURCES: Resource[] = [
    {
      id: 'siyavula',
      name: 'Siyavula',
      url: 'siyavula.com',
      link: 'https://www.siyavula.com',
      desc: 'Unlimited Maths & Science practice with instant feedback. Adapts to your level. The closest thing to a free personal tutor.',
      tags: ['Mathematics', 'Physical Sciences', 'Grade 10–12'],
      category: 'free_data',
      badges: [{ label: '📶 Zero-Rated', color: 'sky' }, { label: 'Free forever', color: 'lime' }],
      stat: 'Used by 2M+ SA learners',
      tip: 'Use daily. 30 min per weak subject. The algorithm knows what you don\'t.',
    },
    {
      id: 'dbe',
      name: 'DBE Past Papers',
      url: 'education.gov.za',
      link: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx',
      desc: 'Every official NSC paper + memo from 2016–2024. Plus free Mind the Gap guides. The most underused resource in SA.',
      tags: ['All NSC subjects', '2016–2024', 'Official memos'],
      category: 'papers',
      badges: [{ label: '📶 Zero-Rated', color: 'sky' }, { label: 'Official NSC', color: 'purple' }],
      stat: 'Free government resource — tell your whole class',
      tip: 'Download Mind the Gap guides. Most learners don\'t know they exist. They\'re free.',
      caps: true,
    },
    {
      id: 'kevinmaths',
      name: 'Kevin Maths Science',
      url: 'youtube.com/@kevinmathscience',
      link: 'https://www.youtube.com/@kevinmathscience',
      desc: 'Best SA matric Maths & Science channel. Full CAPS + IEB curriculum, topic by topic. His Euclidean Geometry series has saved thousands.',
      tags: ['Mathematics', 'Physical Sciences', 'CAPS + IEB'],
      category: 'video',
      badges: [{ label: 'Free', color: 'lime' }, { label: '1M+ subscribers', color: 'amber' }],
      stat: '~1 million subscribers',
      tip: 'Search "kevinmathscience [topic]". Start with your weakest topics.',
    },
    {
      id: 'matric-live',
      name: 'Matric Live',
      url: 'matriclive.com',
      link: 'https://www.matriclive.com',
      desc: 'Video lessons, AI tutor chat, mock exams. Download for offline. Built specifically for SA matric.',
      tags: ['Multiple subjects', 'AI tutor', 'Offline mode'],
      category: 'video',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'FNB App of Year 2024', color: 'amber' }],
      stat: 'FNB App of the Year 2024',
      tip: 'Download on Wi-Fi. Watch in taxi, at the bus stop, anywhere.',
    },
    {
      id: 'maski',
      name: 'Maski',
      url: 'maski.co.za',
      link: 'https://www.maski.co.za',
      desc: 'Ask any matric question on WhatsApp and get an instant explanation. No app download. Lives in your existing WhatsApp.',
      tags: ['All subjects', 'WhatsApp', 'AI tutor'],
      category: 'video',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'WhatsApp-based', color: 'sky' }],
      stat: '100,000+ users in 6 months',
      tip: 'Send "explain [concept] simply" or "give me a practice question on [topic]".',
    },
    {
      id: 'saexampapers',
      name: 'SA Exam Papers',
      url: 'saexampapers.co.za',
      link: 'https://www.saexampapers.co.za',
      desc: 'Largest paper archive in SA. NSC + IEB + provincial papers from 2008. Includes memos. If DBE doesn\'t have it, this will.',
      tags: ['All subjects', '2008–2024', 'IEB + NSC'],
      category: 'papers',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'Papers from 2008', color: 'amber' }],
      stat: 'Biggest SA paper archive',
      tip: 'Get at least 5 years of your subject. Work oldest → newest.',
    },
    {
      id: 'ieb-papers',
      name: 'IEB Official Papers',
      url: 'ieb.co.za',
      link: 'https://www.ieb.co.za/past-papers/',
      desc: 'Last 5 years of IEB papers free. These are YOUR papers — the exact structure, question style, and mark allocation you\'ll face.',
      tags: ['IEB', 'Last 5 years', 'All IEB subjects'],
      category: 'papers',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'IEB Official', color: 'purple' }],
      stat: 'The only papers that match your exam exactly',
      ieb: true,
      tip: 'IEB requires analysis and opinion. Write full sentences in practice, even for 1-mark questions.',
    },
    {
      id: 'anki',
      name: 'Anki',
      url: 'apps.ankiweb.net',
      link: 'https://apps.ankiweb.net',
      desc: 'Spaced repetition flashcards. The algorithm decides when to show each card based on how well you remembered it. Best for definitions, formulae, dates.',
      tags: ['All subjects', 'Spaced repetition', 'Free Android'],
      category: 'tools',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'Best flashcard app', color: 'amber' }],
      stat: 'Used by medical students worldwide',
      tip: 'Search AnkiWeb for shared SA matric decks. Or build your own — the act of making cards is itself study.',
    },
    {
      id: 'mindset',
      name: 'Mindset Learn',
      url: 'mindset.co.za',
      link: 'https://www.mindset.co.za',
      desc: 'Free video lessons for all major matric subjects — not just Maths. Life Sciences, History, Accounting, all covered.',
      tags: ['All major subjects', 'Life Sciences', 'History'],
      category: 'video',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'Vodacom Digital', color: 'sky' }],
      stat: 'DHET-supported curriculum content',
      tip: 'Available on Vodacom Digital Classroom network — free data.',
    },
    {
      id: 'sadag',
      name: 'SADAG Helpline',
      url: '0800 456 789',
      link: 'https://www.sadag.org',
      desc: 'Free, confidential, 24/7 mental health support. You don\'t have to be in crisis to call. Exam pressure counts.',
      tags: ['Mental health', '24/7', 'Free call'],
      category: 'vibes',
      badges: [{ label: 'Free', color: 'lime' }, { label: '24/7', color: 'sky' }],
      stat: '0800 456 789 — free to call',
      tip: 'Anxiety before exams is normal. Unmanaged anxiety hurts your performance. Call.',
    },
    {
      id: 'matric-app',
      name: 'Matric Exam Papers App',
      url: 'Android · Google Play',
      link: 'https://play.google.com/store/apps/details?id=za.co.matricexampapers',
      desc: 'DBE + IEB papers from 2008 on your phone. 40+ subjects. Papers save offline — no data needed once downloaded.',
      tags: ['Android', 'Offline', '40+ subjects'],
      category: 'papers',
      badges: [{ label: 'Free', color: 'lime' }, { label: 'Offline mode', color: 'sky' }],
      stat: 'Download on Wi-Fi, use anywhere',
      tip: 'Filter by your exam system (IEB or NSC) when downloading.',
    },
    {
      id: 'mindthegap',
      name: 'Mind the Gap Guides',
      url: 'education.gov.za',
      link: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/MindtheGap.aspx',
      desc: 'Free government study guides in plain English. Most learners have never heard of these. They\'re exactly aligned to the NSC curriculum.',
      tags: ['All NSC subjects', 'Free PDF', 'Plain English'],
      category: 'tools',
      badges: [{ label: '📶 Zero-Rated', color: 'sky' }, { label: 'Hidden gem 💎', color: 'amber' }],
      stat: 'Most learners don\'t know this exists',
      tip: 'Download the PDF for each of your subjects. Print if possible.',
      caps: true,
    },
    {
      id: 'avbob',
      name: 'AVBOB Step 12',
      url: 'avbob.co.za',
      link: 'https://www.avbob.co.za',
      desc: 'Free CAPS study guides in all 11 official SA languages — Zulu, Xhosa, Afrikaans, and more. Study in your home language.',
      tags: ['11 languages', 'CAPS aligned', 'Free PDF'],
      category: 'tools',
      badges: [{ label: 'Free', color: 'lime' }, { label: '11 languages', color: 'purple' }],
      stat: 'Study in your first language',
      tip: 'Share this with classmates who study in Zulu, Xhosa or Afrikaans.',
    },
  ];

  function copyLink(r: Resource) {
    const text = `${r.name} — ${r.url} 🎓 via Miyagi My Matric (miyagimymatric.com)`;
    navigator.clipboard.writeText(text).then(() => {
      copied = r.id;
      setTimeout(() => { copied = ''; }, 2000);
    });
  }

  function shareResource(r: Resource) {
    if (navigator.share) {
      navigator.share({ title: r.name, text: `Check out ${r.name} — ${r.desc}`, url: r.link });
    } else {
      copyLink(r);
    }
  }

  $: filtered = RESOURCES.filter(r => {
    if (active !== 'all' && r.category !== active) return false;
    if (examSystem === 'ieb' && r.caps === true && !r.ieb) return false; // hide pure CAPS resources for IEB
    return true;
  });

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const s = JSON.parse(raw)?.answers?.exam_system;
        if (s === 'ieb' || s === 'caps') examSystem = s;
      }
    } catch {}
  });
</script>

<svelte:head>
  <title>Resources — Miyagi My Matric</title>
</svelte:head>

<div class="app resources-page">

  <!-- Header -->
  <div class="res-header">
    <div class="res-headline">
      Free tools that actually<br><span class="grad-text">move your APS.</span>
    </div>
    <p class="res-sub">Curated for SA matric. Every resource is free. Zero-rated = no data cost on MTN/Vodacom/Telkom.</p>

    {#if examSystem === 'ieb'}
      <div class="sys-pill ieb">IEB · Showing IEB-specific resources</div>
    {:else if examSystem === 'caps'}
      <div class="sys-pill caps">CAPS / NSC · Showing NSC resources</div>
    {:else}
      <div class="sys-pill unsure">
        <a href="/assessment">Complete your assessment</a> to filter by your exam system
      </div>
    {/if}
  </div>

  <!-- Filter tabs -->
  <div class="filter-tabs">
    {#each FILTERS as f}
      <button class="filter-btn {active === f.id ? 'on' : ''}" on:click={() => active = f.id}>
        {f.label}
      </button>
    {/each}
  </div>

  <!-- Resource grid -->
  <div class="resource-grid">
    {#each filtered as r (r.id)}
      <div class="res-card">
        <!-- Top -->
        <div class="res-top">
          <div class="res-info">
            <div class="res-name">{r.name}</div>
            <div class="res-url">{r.url}</div>
          </div>
          <div class="res-badges">
            {#each r.badges as b}
              <span class="chip chip-{b.color}">{b.label}</span>
            {/each}
          </div>
        </div>

        <!-- Desc -->
        <p class="res-desc">{r.desc}</p>

        <!-- Tags -->
        <div class="res-tags">
          {#each r.tags as t}
            <span class="res-tag">{t}</span>
          {/each}
        </div>

        <!-- Stat -->
        {#if r.stat}
          <div class="res-stat">{r.stat}</div>
        {/if}

        <!-- Tip -->
        {#if r.tip}
          <div class="res-tip">💡 {r.tip}</div>
        {/if}

        <!-- Actions -->
        <div class="res-actions">
          <a href={r.link} target="_blank" rel="noopener" class="res-open">Open →</a>
          <button class="res-share" on:click={() => shareResource(r)}>
            {copied === r.id ? '✓ Copied' : '↑ Share'}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Panic Mode CTA -->
  <div class="panic-cta">
    <div class="panic-cta-text">
      <div class="panic-cta-title">🚨 Exam tomorrow?</div>
      <div class="panic-cta-sub">Let Miyagi build you a rescue plan for the hours you have left.</div>
    </div>
    <a href="/panic" class="btn-panic">Panic Mode →</a>
  </div>

</div>

<style>
  .resources-page { max-width: 720px; }

  /* Header */
  .res-header { margin-bottom: 1.5rem; animation: fadeDown .5s ease both; }
  .res-headline {
    font-family: var(--font-head);
    font-size: clamp(1.7rem, 5vw, 2.4rem);
    font-weight: 800; line-height: 1.15;
    color: var(--text); margin-bottom: .6rem;
  }
  .grad-text {
    background: var(--grad-cta);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .res-sub {
    font-size: .85rem; color: var(--muted);
    font-weight: 300; line-height: 1.6; margin-bottom: .75rem;
  }

  .sys-pill {
    display: inline-block;
    font-family: var(--font-head); font-size: .7rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    padding: .3rem .9rem; border-radius: 100px;
  }
  .sys-pill.ieb    { background: rgba(124,77,255,.12); border: 1px solid rgba(124,77,255,.3); color: var(--accent); }
  .sys-pill.caps   { background: rgba(122,255,122,.10); border: 1px solid rgba(122,255,122,.3); color: var(--accent3); }
  .sys-pill.unsure { background: rgba(255,244,232,.05); border: 1px solid rgba(255,244,232,.1); color: var(--muted); font-weight: 400; font-size: .75rem; text-transform: none; }
  .sys-pill.unsure a { color: var(--accent); font-weight: 700; text-decoration: none; }

  /* Filters */
  .filter-tabs {
    display: flex; gap: .4rem;
    overflow-x: auto; scrollbar-width: none;
    margin-bottom: 1.2rem; padding-bottom: 2px;
    animation: fadeUp .3s ease both;
  }
  .filter-tabs::-webkit-scrollbar { display: none; }

  .filter-btn {
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: .4rem .85rem;
    font-family: var(--font-head); font-size: .72rem; font-weight: 700;
    color: var(--muted); cursor: pointer; transition: all .15s;
    white-space: nowrap;
  }
  .filter-btn:hover { border-color: var(--accent); color: var(--text); }
  .filter-btn.on { background: var(--accent); color: #0D0A18; border-color: var(--accent); }

  /* Grid */
  .resource-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: .75rem;
    margin-bottom: 1.5rem;
    animation: fadeUp .35s ease both;
  }

  /* Card */
  .res-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.1rem 1.2rem;
    transition: border-color .2s, transform .15s;
  }
  .res-card:hover {
    border-color: rgba(124,77,255,.3);
    transform: translateY(-1px);
  }

  .res-top {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: .75rem;
    margin-bottom: .6rem; flex-wrap: wrap;
  }
  .res-name {
    font-family: var(--font-head); font-size: .95rem;
    font-weight: 800; color: var(--text);
  }
  .res-url { font-size: .68rem; color: var(--accent5, #69B4FF); margin-top: 2px; }

  .res-badges { display: flex; gap: .3rem; flex-wrap: wrap; flex-shrink: 0; }

  .chip {
    font-family: var(--font-head); font-size: .58rem; font-weight: 700;
    padding: .18rem .5rem; border-radius: 100px;
    white-space: nowrap;
  }
  .chip-sky    { background: rgba(105,180,255,.12); color: #69B4FF; border: 1px solid rgba(105,180,255,.25); }
  .chip-lime   { background: rgba(122,255,122,.10); color: var(--accent3); border: 1px solid rgba(122,255,122,.22); }
  .chip-amber  { background: rgba(255,179,0,.10);  color: var(--accent4); border: 1px solid rgba(255,179,0,.22); }
  .chip-purple { background: rgba(124,77,255,.12); color: var(--accent);  border: 1px solid rgba(124,77,255,.25); }

  .res-desc {
    font-size: .82rem; color: var(--muted);
    font-weight: 300; line-height: 1.6;
    margin-bottom: .6rem;
  }

  .res-tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .6rem; }
  .res-tag {
    font-size: .62rem; color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 5px; padding: .15rem .45rem;
    font-family: var(--font-head); font-weight: 600;
  }

  .res-stat {
    font-family: var(--font-head); font-size: .68rem; font-weight: 700;
    color: var(--accent4); letter-spacing: .04em;
    margin-bottom: .5rem;
  }

  .res-tip {
    font-size: .75rem; color: var(--muted);
    font-weight: 300; line-height: 1.5;
    background: rgba(255,244,232,.04);
    border-radius: 8px; padding: .5rem .7rem;
    margin-bottom: .7rem;
  }

  .res-actions {
    display: flex; gap: .5rem; align-items: center;
    padding-top: .6rem;
    border-top: 1px solid var(--border);
  }

  .res-open {
    font-family: var(--font-head); font-size: .78rem; font-weight: 700;
    color: var(--accent); text-decoration: none;
    padding: .45rem 1rem;
    background: rgba(124,77,255,.12);
    border: 1px solid rgba(124,77,255,.25);
    border-radius: 100px;
    transition: background .15s;
  }
  .res-open:hover { background: rgba(124,77,255,.22); }

  .res-share {
    font-family: var(--font-head); font-size: .72rem; font-weight: 700;
    color: var(--muted); background: transparent;
    border: 1px solid var(--border);
    border-radius: 100px; padding: .45rem .9rem;
    cursor: pointer; transition: all .15s;
  }
  .res-share:hover { color: var(--text); border-color: rgba(255,244,232,.3); }

  /* Panic CTA */
  .panic-cta {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
    background: rgba(255,92,138,.07);
    border: 1px solid rgba(255,92,138,.2);
    border-radius: 16px; padding: 1.2rem 1.4rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .panic-cta-title {
    font-family: var(--font-head); font-size: .95rem; font-weight: 800;
    color: var(--danger); margin-bottom: .2rem;
  }
  .panic-cta-sub { font-size: .78rem; color: var(--muted); font-weight: 300; }
  .btn-panic {
    font-family: var(--font-head); font-size: .82rem; font-weight: 700;
    color: var(--danger); text-decoration: none;
    background: rgba(255,92,138,.15);
    border: 1px solid rgba(255,92,138,.3);
    border-radius: 100px; padding: .6rem 1.2rem;
    white-space: nowrap; flex-shrink: 0;
    transition: background .15s;
  }
  .btn-panic:hover { background: rgba(255,92,138,.25); }

  @media (max-width: 480px) {
    .panic-cta { flex-direction: column; align-items: flex-start; }
  }
</style>
