<script lang="ts">
  import { onMount } from 'svelte';

  let active = 'mathematics';
  let examSystem: 'ieb' | 'caps' | 'unsure' = 'unsure';

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const sys = state?.answers?.exam_system;
        if (sys === 'ieb' || sys === 'caps') examSystem = sys;
      }
    } catch {}
  });

  const subjects = [
    { id: 'mathematics',       label: 'Mathematics',        icon: '📐' },
    { id: 'sciences',          label: 'Physical Sciences',  icon: '⚗️' },
    { id: 'life_sciences',     label: 'Life Sciences',      icon: '🧬' },
    { id: 'english',           label: 'English',            icon: '📖' },
    { id: 'accounting',        label: 'Accounting',         icon: '🧾' },
    { id: 'business',          label: 'Business Studies',   icon: '📊' },
    { id: 'history',           label: 'History',            icon: '🏛️' },
    { id: 'geography',         label: 'Geography',          icon: '🗺️' }
  ];

  const content: Record<string, { overview: string; papers: { name: string; weight: string; focus: string[] }[]; tips: string[]; caution: string }> = {
    mathematics: {
      overview: 'Pure Mathematics is a gateway subject — a Level 5+ (60%+) opens doors to engineering, medicine, commerce, and IT at every SA university. The two papers test different skills; Paper 2 is consistently the one learners underperform in.',
      papers: [
        {
          name: 'Paper 1',
          weight: '~47% of total marks',
          focus: ['Functions & Graphs (parabola, hyperbola, exponential)', 'Calculus (differentiation, application to graphs)', 'Sequences & Series (arithmetic, geometric, sigma)', 'Finance (compound interest, annuities, depreciation)', 'Probability']
        },
        {
          name: 'Paper 2',
          weight: '~53% of total marks',
          focus: ['Euclidean Geometry (proofs — most feared nationally)', 'Analytical Geometry (distance, midpoint, gradient)', 'Statistics (regression, standard deviation)', 'Trigonometry (identities, equations, sine/cosine rule)', 'Transformation Geometry']
        }
      ],
      tips: [
        'Start Euclidean Geometry proofs in Term 1 — never leave them to Term 3',
        'Practice Paper 2 first each session — it\'s the harder paper',
        'Time: 1.2 minutes per mark. Flag and move on; come back to stuck questions',
        'Paper 2: begin with Statistics for easy guaranteed marks, then Analytical Geometry',
        'Past paper a week from Term 2 onwards — mark your own papers in red',
        'Functions and Calculus combined are nearly half of Paper 1 — master them completely'
      ],
      caution: 'SBA counts 25% for Maths. If you miss a test or assignment you cannot make it up — your final mark is permanently affected.'
    },
    sciences: {
      overview: 'Physical Sciences is examined in two separate papers covering Physics and Chemistry. Both papers are examinable every year — and Grade 10 and 11 content is fair game in Grade 12 finals. Study them in parallel; neglecting one is a common mistake.',
      papers: [
        {
          name: 'Paper 1 — Physics',
          weight: '~50% of total marks',
          focus: ['Mechanics (Newton\'s laws, projectile motion, momentum)', 'Waves, Sound & Light (Doppler, diffraction, optics)', 'Electricity & Magnetism (circuits, electromagnetism)', 'Electrodynamics (motors, generators, alternating current)', 'Optical Phenomena (photoelectric effect)']
        },
        {
          name: 'Paper 2 — Chemistry',
          weight: '~50% of total marks',
          focus: ['Chemical Change (reaction rates, chemical equilibrium)', 'Acids & Bases (pH, titrations, neutralisation)', 'Electrochemistry (galvanic cells, electrolysis)', 'Organic Chemistry (functional groups, reactions, polymers)', 'Industrial Chemistry (Haber, Contact, Chlor-alkali processes)']
        }
      ],
      tips: [
        'Definitions: memorise every definition word-for-word — they\'re exact-mark questions',
        'Data sheet: know which formula to use for each situation before the exam',
        'Paper 1: ~60% calculations. Show all working, including units',
        'Past papers: Sciences questions repeat patterns — past papers are non-negotiable',
        'Organic Chemistry (Paper 2) — draw every reaction until you can do it without notes',
        'Study Gr 10 & 11 content in July — examiners always include prior-year content'
      ],
      caution: 'IEB Physical Sciences Paper 1 and Paper 2 are equally weighted. CAPS has the same structure. Neglecting either paper = losing half your marks.'
    },
    life_sciences: {
      overview: 'Life Sciences is the most content-heavy science. The course covers a wide range of topics across two papers and requires both factual recall and the ability to apply concepts to unfamiliar contexts. Diagram-drawing under exam conditions is a non-negotiable skill.',
      papers: [
        {
          name: 'Paper 1',
          weight: 'Genetics, Evolution, Biodiversity',
          focus: ['DNA, RNA, protein synthesis', 'Genetics (Mendelian, codominance, sex-linkage)', 'Evolution (natural selection, fossil record, speciation)', 'Biodiversity (classification, taxonomy)', 'History of life on Earth']
        },
        {
          name: 'Paper 2',
          weight: 'Life Processes & Physiology',
          focus: ['Human reproduction & embryonic development', 'Nervous system (neurons, brain, reflexes)', 'Endocrine system', 'Immune system', 'Plants (photosynthesis, water transport, hormones)', 'IEB: 40-mark source-based essay with opinion + evidence']
        }
      ],
      tips: [
        'Draw and label every diagram from memory — eyes, ears, kidneys, neurons, flowers',
        'IEB learners: practise the 40-mark essay weekly. It requires analysis + your OWN opinion',
        'Active recall: cover your notes and write everything you remember. Check the gaps.',
        'Genetics calculations: practise crosses until ratios become second nature',
        'Create comparison tables: mitosis vs meiosis, oviparous vs viviparous, etc.',
        'Use mind maps for evolution and biodiversity topics — links between concepts matter'
      ],
      caution: 'Paper 2\'s extended response questions require you to argue using evidence, not just recall facts. Generic answers score poorly.'
    },
    english: {
      overview: 'English is three papers that test very different skills. Most learners underperform in Paper 3 (Writing) because they practise reading, not writing. One timed essay per week is the most effective English intervention — more than any other study technique.',
      papers: [
        {
          name: 'Paper 1 — Language in Context',
          weight: 'Comprehension, Summary, Language',
          focus: ['Comprehension (literal, inferential, evaluation questions)', 'Summary writing (8 points in your OWN words)', 'Language structures (advertisements, cartoons, language use)']
        },
        {
          name: 'Paper 2 — Literature',
          weight: 'Novel, Poetry, Drama',
          focus: ['Novel: character, theme, conflict, symbolism, context', 'Poetry: tone, imagery, diction, structure, perspective', 'Drama: playwright\'s purpose, dramatic techniques, setting']
        },
        {
          name: 'Paper 3 — Creative & Transactional Writing',
          weight: 'Two pieces of writing',
          focus: ['Essay formats: narrative, descriptive, discursive, argumentative, reflective', 'Transactional: formal letter, report, review, speech, diary']
        }
      ],
      tips: [
        'Paper 3: write one essay per week under timed conditions — 45 minutes per essay',
        'Rotate essay types: one week narrative, next week argumentative, etc.',
        'Literature: go beyond plot. Know characters\' motivations, themes, and symbols deeply',
        'Comprehension: always quote the text to support your answers — opinions alone score 0',
        'Summary: count your points. You need exactly the required number — not more, not fewer',
        'Vocabulary: learn 5 new words per week to improve essay quality'
      ],
      caution: 'IEB English Literature requires analysis and evaluation, not just describing what happened. "The author shows..." not "It says that..."'
    },
    accounting: {
      overview: 'Accounting rewards consistent practice more than any other subject. The financial statement formats are fixed — learners who have written them hundreds of times under time pressure perform significantly better than those who study theory alone.',
      papers: [
        {
          name: 'IEB: Paper 1 — Processing',
          weight: 'Bookkeeping and financial records',
          focus: ['Journals, ledgers, trial balance', 'Bank reconciliation', 'Creditors and debtors reconciliation', 'Fixed asset register', 'Payroll journals']
        },
        {
          name: 'IEB: Paper 2 — Reasoning & Analysis',
          weight: 'Financial statements and interpretation',
          focus: ['Income statement, balance sheet, cash flow', 'Ratio analysis and interpretation', 'Ethics and internal controls', 'Corporate governance', 'CAPS: both covered in one paper']
        }
      ],
      tips: [
        'Write out full financial statements from scratch at least 3 times per week',
        'Ratio questions = most marks lost nationally. Learn interpretation, not just formulas',
        'Bank reconciliation: practise until you can do it in 20 minutes without errors',
        'Ethics questions: use the framework — identify the issue, state the principle, give advice',
        'Mark own past papers immediately — Accounting mistakes compound (one error = chain errors)',
        'IEB Paper 2: allocate 50% of your prep time to ratio interpretation and analysis'
      ],
      caution: 'Do not study Accounting theory without also practising the calculations. Theory without application fails in exams.'
    },
    business: {
      overview: 'Business Studies rewards structured essay writing. The content is broad but the exam technique is narrow — learners who master the essay format consistently outscore those with more knowledge but weaker structure.',
      papers: [
        {
          name: 'One Paper (CAPS) / Two Papers (IEB)',
          weight: '150 marks total',
          focus: ['Business environments (PESTLE analysis)', 'Business functions (operations, HR, marketing, finance)', 'Entrepreneurship and business plans', 'Corporate social responsibility and ethics', 'Labour legislation (BCEA, LRA, EEA, BBBEE, CPA)', 'Forms of ownership and business organisations']
        }
      ],
      tips: [
        'Essay structure: Introduction (2 lines) → Body (comparison table or PEEL paragraphs) → Conclusion with recommendation',
        'Legislation questions: BBBEE vs EEA vs CPA — build comparison tables and memorise them',
        'Introduction format: define the topic in one sentence + state what you will discuss',
        'Use bullet points for content marks — they\'re faster and less likely to contain errors',
        'Case study questions: always refer back to the scenario by name',
        'Time allocation: 40 minutes per major essay — start planning before you write'
      ],
      caution: 'Generic answers without reference to the case study or legislation lose content marks. Always anchor your answer to what was asked.'
    },
    history: {
      overview: 'History is an essay subject. Source analysis (Paper 1) and argumentative essays (Paper 2) require very different skills. Most learners neglect source analysis skills — yet these are often the more accessible marks if practised correctly.',
      papers: [
        {
          name: 'Paper 1 — Source Analysis',
          weight: 'Compulsory sources + essay',
          focus: ['Source analysis: origin, purpose, reliability, limitations', 'Bias and perspective identification', 'Corroboration between sources', 'Own knowledge to supplement sources', 'Extended essay with source integration']
        },
        {
          name: 'Paper 2 — Essays',
          weight: 'Choice of essay topics',
          focus: ['Cold War and decolonisation', 'Independent Africa and the African National Congress', 'Civil society protests (anti-apartheid, Vietnam, feminism)', 'Democratic South Africa', 'IEB: historiography and theory questions']
        }
      ],
      tips: [
        'Source analysis: always state origin (who/when/where) + purpose (why it was created)',
        'Bias is not bad — show you understand WHY the source takes a particular view',
        'Paper 2 essay structure: PEEL — Point, Evidence, Explanation, Link back to question',
        'Plan essays for 5 minutes before writing — list 4–5 arguments, order them',
        'Allocate 45 minutes per essay including planning and checking',
        'IEB: historiography questions reward learners who can name historians and their arguments'
      ],
      caution: 'Do not write history as a narrative ("and then... and then..."). Always make an ARGUMENT that answers the question directly.'
    },
    geography: {
      overview: 'Geography combines mapwork (practical skills) with theory. Mapwork is underestimated — it\'s learnable, predictable marks that learners lose by not practising enough. Weekly mapwork exercises from Term 1 are the single most efficient intervention.',
      papers: [
        {
          name: 'Paper 1 — Physical Geography + Mapwork',
          weight: 'Climates, geomorphology, mapwork',
          focus: ['Climate and weather (global circulation, biomes, climate change)', 'Geomorphology (fluvial, coastal, arid processes)', 'Mapwork: topographic maps, contour interpretation, gradients, cross-sections, bearings, GIS']
        },
        {
          name: 'Paper 2 — Human Geography',
          weight: 'Population, settlement, economic',
          focus: ['Population (demographic transition, migration, urbanisation)', 'Settlement (rural vs urban, urban morphology, informal settlements)', 'Economic geography (primary, secondary, tertiary sectors)', 'Development indicators and inequality', 'GIS: data layers, buffering, spatial analysis']
        }
      ],
      tips: [
        'Mapwork: practise gradient calculation, cross-sections, and bearing weekly without fail',
        'GIS questions are predictable, straightforward marks — learn the terminology perfectly',
        'Climate diagrams: practise drawing and interpreting biome diagrams',
        'Human Geography essays: always use specific data and statistics in your answers',
        'Contour lines: if you can\'t interpret them quickly, spend 30 minutes per week on this alone',
        'Cross-sections: always label your axes, scale, and vertical exaggeration'
      ],
      caution: 'IEB Geography mapwork includes additional GIS components. Know the difference between raster and vector data, and the purpose of buffering.'
    }
  };
</script>

<svelte:head>
  <title>Subject Strategy — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Home</a>
    <div class="badge">Subject Guides</div>
    <h1>Subject Strategy</h1>
    <p class="subtitle">Evidence-based strategies for SA matric subjects — what to prioritise and how to study it.</p>
    {#if examSystem === 'ieb'}
      <div class="curriculum-banner ieb">📋 <strong>IEB learner</strong> — strategies and paper structures shown are IEB-specific. IEB exams test higher-order thinking (analysis, evaluation, opinion) more than CAPS.</div>
    {:else if examSystem === 'caps'}
      <div class="curriculum-banner caps">📋 <strong>CAPS / NSC learner</strong> — strategies shown are aligned to the CAPS curriculum and NSC exam structure.</div>
    {:else}
      <div class="curriculum-banner unsure">⚠️ Exam system not set. <a href="/assessment" class="banner-link">Complete your assessment</a> to see curriculum-specific guidance.</div>
    {/if}
  </header>

  <!-- Tab bar -->
  <div class="tabs">
    {#each subjects as s}
      <button
        class="tab"
        class:active={active === s.id}
        on:click={() => active = s.id}
      >
        <span class="tab-icon">{s.icon}</span>
        <span class="tab-label">{s.label}</span>
      </button>
    {/each}
  </div>

  <!-- Content -->
  {#if content[active]}
    {@const c = content[active]}
    <div class="content-area">

      <p class="overview">{c.overview}</p>

      <!-- Papers -->
      <div class="section-head">Papers & Mark Allocation</div>
      <div class="papers-grid">
        {#each c.papers as paper}
          <div class="paper-card">
            <div class="paper-name">{paper.name}</div>
            <div class="paper-weight">{paper.weight}</div>
            <ul class="paper-focus">
              {#each paper.focus as f}
                <li>{f}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>

      <!-- Curriculum-specific callout -->
      {#if examSystem === 'ieb' || examSystem === 'caps'}
        {#if active === 'accounting' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB Accounting has two separate papers.</strong> Paper 1 (Processing) focuses on journals, ledgers, and bookkeeping. Paper 2 (Reasoning & Analysis) focuses on financial statements and ratios. Prepare for both independently — they test different skills.</div>
        {:else if active === 'accounting' && examSystem === 'caps'}
          <div class="curr-callout caps">📋 <strong>CAPS Accounting is a single paper</strong> covering all topics. Allocate time proportionally — financial statements and ratio interpretation carry the most marks.</div>
        {:else if active === 'life_sciences' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB Paper 2 includes a compulsory 40-mark source-based essay</strong> requiring your own opinion supported by evidence. This does not appear in CAPS. Practise writing structured arguments weekly from Term 2.</div>
        {:else if active === 'english' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB English demands higher-order analysis throughout.</strong> Comprehension questions ask for evaluation and inference, not just retrieval. Literature essays must argue a position — "The author shows..." not "It says...". Bloom's taxonomy levels 4–6 dominate.</div>
        {:else if active === 'history' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB History requires source booklet analysis with bias, reliability, and perspective evaluation.</strong> Every source-based answer needs origin + purpose + limitation + own knowledge. The essay mark scheme rewards structured argument over content volume.</div>
        {:else if active === 'sciences' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB Physical Sciences Paper 1 includes a 10-minute reading period</strong> before you write. Use it to read all questions and plan your calculation approach. IEB questions often require application to unfamiliar contexts — not just formula substitution.</div>
        {:else if active === 'mathematics' && examSystem === 'ieb'}
          <div class="curr-callout ieb">📋 <strong>IEB Mathematics has the same paper structure as CAPS</strong> but questions at the higher end demand more interpretation and application. Ensure you can explain your reasoning, not just calculate answers.</div>
        {/if}
      {/if}

      <!-- Tips -->
      <div class="section-head">Study Strategy</div>
      <div class="tips-list">
        {#each c.tips as tip, i}
          <div class="tip-item">
            <span class="tip-num">{i + 1}</span>
            <span class="tip-text">{tip}</span>
          </div>
        {/each}
      </div>

      <!-- Caution -->
      <div class="caution-card">
        <span class="caution-icon">⚠️</span>
        <span class="caution-text">{c.caution}</span>
      </div>

    </div>
  {/if}
</div>

<style>
  .app { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; z-index: 1; }
  .page-header { text-align: center; margin-bottom: 1.5rem; animation: fadeDown 0.5s ease both; }
  .back-link { display: inline-block; color: var(--muted); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; transition: color 0.2s; }
  .back-link:hover { color: var(--accent2); }
  .badge { display: inline-block; background: rgba(246,201,14,.12); color: var(--accent); border: 1px solid rgba(246,201,14,.25); border-radius: 999px; padding: 0.3rem 1rem; font-family: var(--font-head); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.75rem; }
  h1 { font-family: var(--font-head); font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
  .subtitle { color: var(--muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto; }

  /* Tabs */
  .tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem; animation: fadeUp 0.4s ease both; }
  .tab { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.85rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-family: var(--font-head); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tab:hover { border-color: var(--accent2); color: var(--accent2); }
  .tab.active { background: var(--accent); border-color: var(--accent); color: #0d1117; }
  .tab-icon { font-size: 1rem; }
  .tab-label {}

  /* Content */
  .content-area { animation: fadeIn 0.3s ease both; }

  .overview { color: var(--text); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; }

  .section-head { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem; }

  /* Papers */
  .papers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .paper-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; }
  .paper-name { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; color: var(--accent); margin-bottom: 0.25rem; }
  .paper-weight { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.75rem; font-style: italic; }
  .paper-focus { padding-left: 1.1rem; margin: 0; }
  .paper-focus li { font-size: 0.82rem; color: var(--text); line-height: 1.6; margin-bottom: 0.3rem; }

  /* Tips */
  .tips-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
  .tip-item { display: flex; gap: 0.75rem; align-items: flex-start; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; }
  .tip-num { font-family: var(--font-head); font-size: 0.8rem; font-weight: 800; color: var(--accent); min-width: 20px; }
  .tip-text { font-size: 0.875rem; color: var(--text); line-height: 1.5; }

  /* Caution */
  .caution-card { display: flex; gap: 0.75rem; align-items: flex-start; background: rgba(248,113,113,.07); border: 1px solid rgba(248,113,113,.25); border-radius: 10px; padding: 1rem; }
  .caution-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.1rem; }
  .caution-text { font-size: 0.85rem; color: var(--text); line-height: 1.5; }

  /* Curriculum banners */
  .curriculum-banner { border-radius: 10px; padding: 0.65rem 1rem; font-size: 0.8rem; line-height: 1.5; margin-top: 0.75rem; }
  .curriculum-banner.ieb { background: rgba(56,189,248,.08); border: 1px solid rgba(56,189,248,.25); color: var(--accent2); }
  .curriculum-banner.caps { background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.25); color: var(--accent3); }
  .curriculum-banner.unsure { background: rgba(246,201,14,.08); border: 1px solid rgba(246,201,14,.2); color: var(--accent); }
  .curriculum-banner strong { color: inherit; }
  .banner-link { color: inherit; font-weight: 700; }
  .curr-callout { border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.82rem; line-height: 1.6; margin-bottom: 1rem; }
  .curr-callout.ieb { background: rgba(56,189,248,.07); border: 1px solid rgba(56,189,248,.25); color: var(--text); }
  .curr-callout.caps { background: rgba(74,222,128,.07); border: 1px solid rgba(74,222,128,.25); color: var(--text); }
  .curr-callout strong { color: inherit; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 560px) {
    .tab-label { display: none; }
    .tab { padding: 0.5rem; }
    .tab-icon { font-size: 1.2rem; }
  }
</style>
