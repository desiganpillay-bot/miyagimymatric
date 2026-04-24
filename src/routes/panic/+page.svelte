<script lang="ts">
  import { onMount } from 'svelte';
  import { SUBJECTS } from '$lib/constants';
  import { rangeMid } from '$lib/aps';

  interface StudyBlock {
    start: number;
    duration: number;
    subject: string;
    focus: string;
    technique: string;
    tip: string;
  }

  // ── State ──────────────────────────────────────────────────
  let mode: 'exam' | 'sba' = 'exam';
  let step: 'setup' | 'plan' = 'setup';
  let selectedSubject = '';
  let selectedPaper = 'all';
  let hoursAvailable = 4;
  let examTomorrow = true;
  let sbaTaskType = 'essay';
  let assessmentSubjects: string[] = [];
  let weakestSubjects: { name: string; pct: number; gap: number }[] = [];
  let plan: StudyBlock[] = [];
  let startTime = new Date();

  // ── Multi-paper subjects ────────────────────────────────────
  const SUBJECT_PAPERS: Record<string, string[]> = {
    'Mathematics':           ['Paper 1', 'Paper 2'],
    'Mathematical Literacy': ['Paper 1', 'Paper 2'],
    'Physical Sciences':     ['Paper 1', 'Paper 2'],
    'Life Sciences':         ['Paper 1', 'Paper 2'],
    'English HL':            ['Paper 1', 'Paper 2', 'Paper 3'],
    'English FAL':           ['Paper 1', 'Paper 2', 'Paper 3'],
    'Afrikaans':             ['Paper 1', 'Paper 2', 'Paper 3'],
    'History':               ['Paper 1', 'Paper 2'],
    'Geography':             ['Paper 1', 'Paper 2'],
    'Accounting':            ['Paper 1', 'Paper 2'],
  };

  // ── High-value topics per subject + paper ──────────────────
  const HIGH_VALUE: Record<string, { topic: string; tip: string }[]> = {
    'Mathematics': [
      { topic: '[P1] Functions & Graphs — sketch, equation, interpret', tip: '~30 marks in P1. Sketch from memory first, then annotate.' },
      { topic: '[P2] Analytical Geometry — distance, midpoint, gradient, circles', tip: 'Always draw a diagram. State formula before substituting.' },
      { topic: '[P1] Calculus — derivatives, application, optimisation', tip: 'Power rule, chain rule, product rule. Show every step.' },
      { topic: '[P2] Euclidean Geometry — proofs, circle theorems', tip: 'Most feared nationally. Start with what you know, build from there.' },
      { topic: '[P1] Sequences & Series — arithmetic + geometric, Sigma', tip: 'Memorise Tn and Sn. Know when series converges (|r| < 1).' },
      { topic: '[P2] Trigonometry — identities, 2D/3D problems, compound angles', tip: 'Derive identities from sin²+cos²=1. Sketch the triangle first.' },
      { topic: '[P1] Probability — Venn diagrams, counting principle', tip: 'Draw Venn first. Label ALL regions including outside. Complement rule.' },
      { topic: '[P2] Statistics — regression, correlation, ogives', tip: 'Know how to read and plot cumulative frequency. Use your calculator.' },
    ],
    'Mathematics Paper 1': [
      { topic: 'Functions & Graphs — parabola, hyperbola, exponential, log', tip: '~30 marks. Sketch from memory first, then annotate intercepts.' },
      { topic: 'Calculus — derivatives, stationary points, optimisation', tip: 'Power rule, chain rule, product rule. Show every substitution step.' },
      { topic: 'Sequences & Series — arithmetic, geometric, Sigma notation', tip: 'Memorise Tn and Sn. Know when geometric series converges.' },
      { topic: 'Exponents & Logarithms — simplify, solve equations', tip: 'Convert between log and exponential form. Know log laws cold.' },
      { topic: 'Probability — Venn diagrams, counting principle, tree diagrams', tip: 'Draw Venn first. Label ALL regions. Complement rule saves time.' },
      { topic: 'Finance — compound interest, present/future value, annuities', tip: 'Use the formula sheet. Know which formula applies to which context.' },
    ],
    'Mathematics Paper 2': [
      { topic: 'Euclidean Geometry — circle theorems, proofs, proportionality', tip: 'Most failed topic nationally. State every reason. Work from given info.' },
      { topic: 'Analytical Geometry — distance, midpoint, gradient, circles', tip: 'Always draw a diagram. Identify what you need before calculating.' },
      { topic: 'Trigonometry — identities, reduction formulae, 2D/3D', tip: 'Derive identities step by step. Sketch triangles for 3D problems.' },
      { topic: 'Statistics — regression line, correlation, ogives, quartiles', tip: 'Use your calculator for regression. Know how to read ogives.' },
    ],
    'Physical Sciences': [
      { topic: '[P1] Newton\'s Laws — free body diagrams, net force', tip: 'Always draw the FBD. Label every force with magnitude and direction.' },
      { topic: '[P2] Organic Chemistry — naming, reactions, functional groups', tip: 'IUPAC naming: longest chain first. Count carbons carefully.' },
      { topic: '[P1] Electricity & Circuits — Ohm\'s Law, series vs parallel', tip: 'Series: same current. Parallel: same voltage. Write this on your page.' },
      { topic: '[P2] Acids & Bases — pH, neutralisation, indicators', tip: 'pH < 7 = acid, > 7 = base. Acid + base → salt + water.' },
      { topic: '[P1] Momentum & Impulse — collisions, conservation', tip: 'Elastic: KE conserved. Inelastic: momentum conserved, KE not.' },
      { topic: '[P2] Chemical equilibrium — Le Chatelier\'s principle', tip: 'System shifts to oppose the change. Pressure → fewer gas moles.' },
      { topic: '[P1] Waves & Light — Doppler effect, interference', tip: 'Doppler: higher frequency when approaching. Draw wave fronts.' },
      { topic: '[P2] Electrochemistry — galvanic vs electrolytic cells', tip: 'Galvanic: spontaneous. Electrolytic: external power. Use the table.' },
    ],
    'Physical Sciences Paper 1': [
      { topic: 'Newton\'s Laws — free body diagrams, net force, inclined planes', tip: 'Always draw the FBD. Label every force with magnitude and direction.' },
      { topic: 'Electricity & Circuits — Ohm\'s Law, series vs parallel', tip: 'Series: same current. Parallel: same voltage. Write this on your page.' },
      { topic: 'Momentum & Impulse — collisions, Newton\'s 3rd law', tip: 'Elastic: KE conserved. Inelastic: momentum conserved but KE lost.' },
      { topic: 'Waves & Light — Doppler effect, diffraction, interference', tip: 'Doppler: higher frequency when approaching. Draw wave fronts.' },
      { topic: 'Vertical projectile motion — equations of motion', tip: 'Take upward as positive. At max height v = 0. g = 9.8 m/s².' },
      { topic: 'Work, energy and power — conservation of mechanical energy', tip: 'W = F·d·cosθ. No friction: KE + PE = constant throughout.' },
    ],
    'Physical Sciences Paper 2': [
      { topic: 'Organic Chemistry — naming, functional groups, reactions', tip: 'IUPAC naming: longest chain first. Count carbons carefully.' },
      { topic: 'Acids & Bases — pH, neutralisation, indicators', tip: 'pH < 7 = acid, > 7 = base. Acid + base → salt + water.' },
      { topic: 'Chemical Change — reaction types, energy changes', tip: 'Exothermic releases energy. Endothermic absorbs energy.' },
      { topic: 'Electrochemistry — galvanic vs electrolytic cells', tip: 'Galvanic: spontaneous. Electrolytic: external power. Know the table.' },
      { topic: 'Chemical equilibrium — Le Chatelier\'s principle', tip: 'System shifts to oppose the change. Pressure → fewer gas moles.' },
      { topic: 'Matter & Materials — atomic structure, periodic trends', tip: 'IE and electronegativity increase across a period. Know the trends.' },
    ],
    'Life Sciences': [
      { topic: '[P1] DNA & Protein synthesis — transcription, translation', tip: 'Use the codon table in the exam. Know the steps in order.' },
      { topic: '[P2] Plants — support, transport, photosynthesis', tip: 'Draw xylem vs phloem. Stomata open when guard cells absorb water.' },
      { topic: '[P1] Genetics — Mendelian, meiosis, sex-linked traits', tip: 'Always draw a Punnett square. Label genotype and phenotype.' },
      { topic: '[P2] Animals — nervous system, homeostasis, excretion', tip: 'Neuron: dendrites → cell body → axon → synapse. Draw it.' },
      { topic: '[P1] Evolution — natural selection, evidence, speciation', tip: 'BPFS: Biogeography, Palaeontology, Fossils, Selective breeding.' },
      { topic: '[P2] Ecology — biomes, nutrient cycles, population dynamics', tip: 'Know the nitrogen and carbon cycles. Draw food webs from memory.' },
    ],
    'Life Sciences Paper 1': [
      { topic: 'DNA & RNA — structure, replication, protein synthesis', tip: 'Use the codon table. Know: DNA → mRNA → tRNA → protein.' },
      { topic: 'Genetics — Mendelian inheritance, Punnett squares, sex-linked', tip: 'Always draw the Punnett square. State genotype and phenotype ratios.' },
      { topic: 'Meiosis — stages, crossing over, non-disjunction', tip: 'Meiosis I: homologous pairs separate. Meiosis II: chromatids separate.' },
      { topic: 'Evolution — natural selection, evidence, speciation', tip: 'BPFS: Biogeography, Palaeontology, Fossils, Selective breeding.' },
      { topic: 'Human reproduction — hormones, menstrual cycle, fertilisation', tip: 'Draw and label the cycle. Know LH, FSH, oestrogen, progesterone.' },
    ],
    'Life Sciences Paper 2': [
      { topic: 'Plants — support systems, transport, water uptake', tip: 'Draw xylem vs phloem. Stomata open when guard cells absorb water.' },
      { topic: 'Photosynthesis — light reactions, Calvin cycle, factors', tip: 'Know the light and dark reactions. Memorise the net equation.' },
      { topic: 'Animals — nervous system, synaptic transmission', tip: 'Neuron: dendrites → cell body → axon → synapse. Draw it from memory.' },
      { topic: 'Homeostasis — thermoregulation, osmoregulation, blood glucose', tip: 'Negative feedback loop. Know the effectors and receptors for each.' },
      { topic: 'Ecology — biomes, nutrient cycles, population growth', tip: 'Know the nitrogen and carbon cycles. Distinguish J-curve vs S-curve.' },
    ],
    'English HL': [
      { topic: '[P1] Comprehension — inference, tone, purpose, figure of speech', tip: 'Underline the question word. Answer from the text first, then infer.' },
      { topic: '[P2] Drama — themes, character, conflict, language', tip: 'Use PETER: Point, Evidence, Technique, Explanation, Reader response.' },
      { topic: '[P3] Essay — argumentative, discursive, narrative, descriptive', tip: 'Spend 5 min planning. PEEL paragraphs. End with a strong clincher.' },
      { topic: '[P1] Language & summary — grammar, sentence types, précis', tip: '10 min of Language Q before tackling comprehension. Read summary rubric.' },
      { topic: '[P2] Poetry — imagery, tone, structure, theme', tip: 'Read twice. Annotate devices. What is the speaker\'s attitude?' },
      { topic: '[P2] Novel / short stories — characterisation, setting, plot', tip: 'Know 3 quotes per character. Know the climax and how conflict resolves.' },
    ],
    'English HL Paper 1': [
      { topic: 'Comprehension — inference, tone, purpose, vocabulary in context', tip: 'Underline the question word. Answer from the text first, then infer.' },
      { topic: 'Summary writing — selecting relevant points, paraphrasing', tip: 'Number your points. Don\'t copy word for word. Stay within word limit.' },
      { topic: 'Language structures — tenses, sentence types, figures of speech', tip: 'Know passive vs active, direct vs indirect speech transformations.' },
      { topic: 'Cartoon / visual text — reading images, captions, irony', tip: 'Comment on: setting, body language, speech, artist\'s message.' },
    ],
    'English HL Paper 2': [
      { topic: 'Drama — themes, character development, conflict, stage craft', tip: 'Use PETER. Know 3 quotes per character. Know every act\'s turning point.' },
      { topic: 'Poetry — imagery, tone, structure, speaker, theme', tip: 'Read twice. Annotate devices. What is the speaker\'s attitude?' },
      { topic: 'Novel — characterisation, setting, plot, narrative perspective', tip: 'Know the climax and how each conflict resolves. Quote precisely.' },
      { topic: 'Short stories — theme, irony, symbol, structure', tip: 'Short stories often have a twist or revelation. Identify it early.' },
    ],
    'English HL Paper 3': [
      { topic: 'Argumentative essay — thesis, counter-argument, rebuttal', tip: 'State your position in the introduction. One idea per paragraph.' },
      { topic: 'Discursive essay — balanced discussion, no strong stance', tip: 'Present both sides fairly. Use hedging language: "arguably", "may".' },
      { topic: 'Narrative essay — character, conflict, climax, resolution', tip: 'Show, don\'t tell. Vary sentence length. Build tension before the climax.' },
      { topic: 'Descriptive essay — sensory detail, atmosphere, imagery', tip: 'Use all 5 senses. Strong opening image. Don\'t just list — describe.' },
      { topic: 'Transactional texts — letter, report, speech, advertisement', tip: 'Know the format conventions for each. Marks are easy here.' },
    ],
    'History': [
      { topic: '[P1] Source analysis — origin, purpose, reliability, bias', tip: 'OPVL: Origin, Purpose, Value, Limitation. Quote from the source.' },
      { topic: '[P2] Essay — PEEL structure, argument, evidence, historiography', tip: 'Spend 10 min planning. Topic sentence must answer the question.' },
      { topic: '[P1] Visual sources — cartoons, photos — what is the message?', tip: 'Who made it? When? What message? Who is the intended audience?' },
      { topic: '[P2] Cold War, Civil Rights, SA history — key events in order', tip: 'Use a timeline. Know causes → events → consequences for each topic.' },
    ],
    'History Paper 1': [
      { topic: 'Source analysis — origin, purpose, value, limitation (OPVL)', tip: 'Always quote from the source. Link to historical context.' },
      { topic: 'Visual sources — cartoons, photographs, propaganda', tip: 'Who made it? When? Intended audience? What\'s exaggerated or omitted?' },
      { topic: 'Comparing sources — agreement, contradiction, corroboration', tip: 'Compare directly: "Source A shows X while Source B shows Y because..."' },
      { topic: 'Extended source-based writing — use of multiple sources', tip: 'Use your own knowledge alongside the sources. Don\'t just describe.' },
    ],
    'History Paper 2': [
      { topic: 'Essay structure — introduction, body paragraphs, conclusion', tip: 'Spend 10 min planning. Topic sentence must answer the question directly.' },
      { topic: 'Historiography — different historical interpretations', tip: 'Name a historian. State their argument. Agree or disagree with evidence.' },
      { topic: 'Cold War — US/USSR rivalry, proxy wars, détente, end', tip: 'Truman Doctrine, Marshall Plan, Berlin, Cuba, Vietnam — in order.' },
      { topic: 'Civil Rights — US and SA comparison', tip: '"Similarly... However..." Compare causes, methods, outcomes.' },
    ],
    'Geography': [
      { topic: '[P1] Geomorphology — rivers, weathering, mass movement', tip: 'River processes: erosion, transport, deposition. Draw the long profile.' },
      { topic: '[P2] Mapwork — contours, cross-sections, gradient, bearing', tip: 'Gradient = VI ÷ HE. Bearing: clockwise from North. Show formula.' },
      { topic: '[P1] Climate & weather — synoptic charts, rainfall types', tip: 'Know all 3 rainfall types: convectional, frontal, orographic + diagrams.' },
      { topic: '[P2] Development — HDI, poverty, global inequalities', tip: 'Know the indicators of development. Use case studies.' },
      { topic: '[P1] Population — growth, migration, demographic transition', tip: 'DTM stages 1–5. Know push and pull factors for migration.' },
      { topic: '[P2] Settlement — urbanisation, informal settlements, SA context', tip: 'Know SA context: apartheid spatial planning and its legacy.' },
    ],
    'Geography Paper 1': [
      { topic: 'Geomorphology — rivers, weathering, mass movement, coasts', tip: 'River: erosion → transport → deposition. Draw the long profile.' },
      { topic: 'Climate & weather — synoptic charts, air masses, fronts', tip: 'Know all 3 rainfall types. Cold front: cold air replaces warm.' },
      { topic: 'Hydrosphere — water cycle, drainage basins, flooding', tip: 'Know the factors affecting run-off. Draw a drainage basin.' },
      { topic: 'Population — growth, distribution, demographic transition', tip: 'DTM stages 1–5. Know push and pull factors for migration.' },
    ],
    'Geography Paper 2': [
      { topic: 'Mapwork — contours, cross-sections, gradient, bearing, scale', tip: 'Gradient = VI ÷ HE. Bearing: clockwise from North. Show formula.' },
      { topic: 'GIS — data layers, buffering, spatial analysis', tip: 'Straightforward marks. Know the 5 components of GIS.' },
      { topic: 'Settlement — urbanisation, rural-urban migration, SA cities', tip: 'Know SA context: apartheid spatial planning, informal settlements.' },
      { topic: 'Development — HDI, MDGs, global inequalities, aid', tip: 'Know 3 development indicators. Use specific country examples.' },
    ],
    'Accounting': [
      { topic: '[P1] Ledger accounts — posting, balancing, trial balance', tip: 'Debit left, credit right. Assets and expenses have debit balances.' },
      { topic: '[P2] Ratio analysis — liquidity, solvency, profitability, activity', tip: 'Memorise the 6 key ratios. Interpret: what does it mean for the business?' },
      { topic: '[P1] Bank reconciliation — unpresented cheques, outstanding deposits', tip: 'Start with bank statement balance, adjust to cashbook, then reconcile.' },
      { topic: '[P2] Cash flow statement — operating, investing, financing', tip: 'Operating = profit ± non-cash items. Know all 3 sections.' },
      { topic: '[P1] VAT and depreciation', tip: 'VAT inclusive: ÷ 1.15. Straight-line vs diminishing balance — know both.' },
      { topic: '[P2] Analysis & interpretation — comment on trends', tip: 'Don\'t just calculate. Interpret: "This means the business is..."' },
    ],
    'Accounting Paper 1': [
      { topic: 'Ledger accounts — posting, balancing, trial balance', tip: 'Debit left, credit right. Assets and expenses have debit balances.' },
      { topic: 'Bank reconciliation — unpresented cheques, outstanding deposits', tip: 'Start with bank statement balance, adjust, then reconcile to cashbook.' },
      { topic: 'VAT — input vs output, calculations, recording', tip: 'Inclusive: ÷ 1.15. Exclusive: × 0.15. Know which applies.' },
      { topic: 'Depreciation — straight-line vs diminishing balance', tip: 'SL: same amount every year. DB: % of carrying value. Show formula.' },
      { topic: 'Financial statements — income statement, balance sheet', tip: 'Do the format from memory first, then fill in. Never skip a line.' },
    ],
    'Accounting Paper 2': [
      { topic: 'Ratio analysis — liquidity, solvency, profitability, activity', tip: 'Memorise 6 key ratios. Interpret: what does it mean for the business?' },
      { topic: 'Cash flow statement — operating, investing, financing activities', tip: 'Operating = profit ± non-cash items. Know all 3 sections.' },
      { topic: 'Interpretation and commentary — trends, recommendations', tip: 'Don\'t just calculate. Say what it means and what management should do.' },
      { topic: 'Budgets and projections — variances, management decisions', tip: 'Favourable variance: actual better than budget. Adverse: worse.' },
    ],
    'Mathematical Literacy': [
      { topic: '[P1] Finance — loans, interest, budgets, inflation', tip: 'Show full calculation. Always state your formula first.' },
      { topic: '[P2] Data handling — mean, median, box-and-whisker, scatter plots', tip: 'Five-number summary: min, Q1, median, Q3, max. Know what outliers are.' },
      { topic: '[P1] Measurement — area, perimeter, volume, conversions', tip: 'Write the formula first. Convert units before calculating.' },
      { topic: '[P2] Probability — basic and compound events, Venn diagrams', tip: 'P(A or B) = P(A) + P(B) – P(A and B). Draw a Venn.' },
      { topic: '[P1] Maps & Plans — scale, distance, direction, floor plans', tip: 'Bearing: clockwise from North. Scale: map distance ÷ scale = real distance.' },
      { topic: '[P2] Patterns — number patterns, tables, graphs, forecasting', tip: 'Identify if linear or exponential. Use the table to find the rule.' },
    ],
    'Mathematical Literacy Paper 1': [
      { topic: 'Finance — loans, compound interest, budgets, inflation, exchange rates', tip: 'Show full calculation. Always state your formula first.' },
      { topic: 'Measurement — area, perimeter, volume, conversions', tip: 'Write the formula first. Convert units before calculating.' },
      { topic: 'Maps & Plans — scale, distance, direction, floor plans, elevation', tip: 'Bearing: clockwise from North. Always show the scale calculation.' },
      { topic: 'Tariff systems — electricity, water, tax tables', tip: 'Read the tariff table carefully. Break into tiers if applicable.' },
    ],
    'Mathematical Literacy Paper 2': [
      { topic: 'Data handling — mean, median, mode, box-and-whisker, scatter plots', tip: 'Five-number summary: min, Q1, median, Q3, max. Know what outliers are.' },
      { topic: 'Probability — basic, relative frequency, Venn diagrams', tip: 'P(A or B) = P(A) + P(B) – P(A and B). Draw a Venn.' },
      { topic: 'Patterns — linear, quadratic, tables, graphs', tip: 'Identify if linear or not. Use a table to find first and second differences.' },
    ],
    'English FAL': [
      { topic: '[P1] Comprehension — vocabulary in context, inference, tone', tip: 'Answer what is asked. Use words from the text and add your explanation.' },
      { topic: '[P2] Literature — themes, characters, language', tip: 'Know 3 quotes per main character. Link evidence to the question.' },
      { topic: '[P3] Writing — essay types, letters, reports, reviews', tip: 'Know the format for transactional texts. Plan before you write.' },
    ],
    'English FAL Paper 1': [
      { topic: 'Comprehension — vocabulary, inference, tone, purpose', tip: 'Answer what is asked. Use text evidence + your explanation.' },
      { topic: 'Summary writing — selecting main points, paraphrasing', tip: 'Number your points. Don\'t copy word for word. Stay within word limit.' },
      { topic: 'Language structures — grammar, punctuation, transformation', tip: 'Know passive/active voice. Direct/indirect speech. Tense changes.' },
    ],
    'English FAL Paper 2': [
      { topic: 'Drama / Novel — character, theme, conflict, resolution', tip: 'Know 3 quotes per main character. Link evidence to the question.' },
      { topic: 'Poetry — imagery, mood, tone, structure', tip: 'Read twice. Annotate devices. What feeling does the poet create?' },
      { topic: 'Short stories — irony, symbol, theme, narrative voice', tip: 'Know the twist or revelation. Who is the narrator and are they reliable?' },
    ],
    'English FAL Paper 3': [
      { topic: 'Essay writing — argumentative, narrative, descriptive', tip: 'Plan for 5 min. PEEL paragraphs. Strong intro and conclusion.' },
      { topic: 'Transactional texts — formal letter, report, speech, review', tip: 'Know format conventions for each. Full marks available for format.' },
    ],
    'Afrikaans Paper 1': [
      { topic: 'Begrip (comprehension) — woordeskat, gevolgtrekkings, toon', tip: 'Lees die vraag eers. Gebruik die teks as bewys.' },
      { topic: 'Opsomming (summary) — hoofpunte, parafrasering', tip: 'Nommer jou punte. Moenie direk kopieer nie.' },
      { topic: 'Taalstrukture — grammatika, sinskonstruksie, transformasies', tip: 'Ken lyende vs bedrywende vorm. Ken tyd- en modusveranderinge.' },
    ],
    'Afrikaans Paper 2': [
      { topic: 'Drama/Roman — karakterisering, tema, konflik', tip: 'Ken 3 aanhalings per karakter. Koppel bewys aan die vraag.' },
      { topic: 'Poësie — beelding, toon, struktuur, tema', tip: 'Lees twee keer. Merk digterlike middele. Wat is die spreker se houding?' },
      { topic: 'Kortverhale — ironie, simbool, tema', tip: 'Identifiseer die hoogtepunt. Ken die vertellersperspektief.' },
    ],
    'Afrikaans Paper 3': [
      { topic: 'Opstel skryf — argumentatief, verhalend, beskrywend', tip: 'Beplan 5 min. PEEL paragrawe. Sterk inleiding en samevatting.' },
      { topic: 'Transaksionele tekste — formele brief, verslag, toespraak', tip: 'Ken die formaatkonvensies. Maklike punte hier.' },
    ],
  };

  const SBA_TASK_TYPES = [
    { id: 'essay',      label: '📝 Essay / Research essay' },
    { id: 'data',       label: '📊 Data response / Source analysis' },
    { id: 'practical',  label: '🔬 Practical report / Lab write-up' },
    { id: 'assignment', label: '📋 Assignment / Project' },
    { id: 'test',       label: '✏️ Controlled test (due soon)' },
  ];

  const SBA_STAGES: Record<string, { stage: string; duration: number; tip: string }[]> = {
    essay: [
      { stage: 'Read the question — underline instruction words', duration: 10, tip: 'Circle: discuss, analyse, evaluate, compare. These tell you HOW to answer.' },
      { stage: 'Brainstorm everything you know', duration: 15, tip: 'Dump everything on paper. No editing yet. Circle your 5 strongest points.' },
      { stage: 'Plan your argument — PEEL outline', duration: 15, tip: 'Point → Evidence → Explain → Link. One idea per paragraph.' },
      { stage: 'Write your introduction', duration: 15, tip: 'Define key terms. State your argument. Signpost your structure.' },
      { stage: 'Write body paragraphs', duration: 50, tip: 'One idea per paragraph. Quote evidence. Explain, don\'t just list.' },
      { stage: 'Write body paragraphs (cont.)', duration: 50, tip: 'Every paragraph must answer the question. Start with your topic sentence.' },
      { stage: 'Write conclusion', duration: 15, tip: 'No new info. Restate your argument. Answer the question directly.' },
      { stage: 'Edit and proofread', duration: 20, tip: 'Read aloud. Check: does every paragraph answer the question? Word count?' },
    ],
    data: [
      { stage: 'Read and annotate the data / sources', duration: 20, tip: 'Circle dates, underline stats, note the source of each piece of data.' },
      { stage: 'Plan responses — check marks per question', duration: 15, tip: 'Allocate time by marks. 2-mark answer = 2 sentences. 8-mark = a paragraph.' },
      { stage: 'Draft short-answer responses', duration: 50, tip: 'Use OPVL for sources. Always reference the data/source directly.' },
      { stage: 'Draft extended writing / data commentary', duration: 40, tip: 'Use the data to support your argument. Don\'t just describe the data.' },
      { stage: 'Review all answers against the question', duration: 20, tip: 'Have you answered exactly what was asked? Is each answer long enough?' },
    ],
    practical: [
      { stage: 'Write Aim, Hypothesis, Variables', duration: 20, tip: 'Aim: what you investigated. Hypothesis: what you predicted and why.' },
      { stage: 'Method and Materials', duration: 20, tip: 'Past tense, numbered steps. Include all apparatus, quantities, safety measures.' },
      { stage: 'Results table and graphs', duration: 40, tip: 'Label axes. Include units and a title. Data table first, then graph from it.' },
      { stage: 'Discussion — explain your results', duration: 40, tip: 'Link results to theory. Identify sources of error. Were they systematic or random?' },
      { stage: 'Conclusion and Reference list', duration: 20, tip: 'Answer the hypothesis directly: "The hypothesis was supported / not supported because..."' },
    ],
    assignment: [
      { stage: 'Read the question — break into sub-tasks', duration: 15, tip: 'List every part you need to address. Note the word count per section.' },
      { stage: 'Research and notes — textbook first', duration: 50, tip: 'Use your textbook first. Note page numbers for references. Don\'t copy.' },
      { stage: 'Outline — headings, sub-headings, word count per section', duration: 15, tip: 'Plan the structure before writing. Saves time and keeps you on track.' },
      { stage: 'Draft — write fast, don\'t edit yet', duration: 50, tip: 'Get ideas down. You can edit later. Leave placeholders for missing info.' },
      { stage: 'Edit, format, references', duration: 30, tip: 'Check referencing format. Word count. Title page. Bibliography. Proofread.' },
    ],
    test: [
      { stage: 'Identify all topics on the test scope', duration: 15, tip: 'Use the scope sheet if you have one. Circle every topic you\'re unsure of.' },
      { stage: 'Active recall — highest-value topic', duration: 50, tip: 'Close your notes. Write everything you know. Check gaps after.' },
      { stage: 'Active recall — second topic', duration: 50, tip: 'Same technique. Cover your notes. Write from memory. Verify.' },
      { stage: 'Past paper / practice questions — timed', duration: 40, tip: 'Do under exam conditions. No peeking. Mark it yourself after.' },
      { stage: 'Review wrong answers and gaps', duration: 25, tip: 'Focus only on what you got wrong. Re-read and re-attempt those questions.' },
    ],
  };

  function getTopicKey(subject: string, paper: string): string {
    if (paper === 'all') return subject;
    return `${subject} ${paper}`;
  }

  function getTopics(subject: string, paper: string): { topic: string; tip: string }[] {
    const key = getTopicKey(subject, paper);
    return HIGH_VALUE[key] ?? HIGH_VALUE[subject] ?? [
      { topic: 'Review past exam papers — focus on question 1 first', tip: 'Q1 is usually the easiest. Bank those marks.' },
      { topic: 'Mind-map key concepts from memory', tip: 'Do it WITHOUT notes first. Gaps reveal what you don\'t know.' },
      { topic: 'Work through the memorandum of the last past paper', tip: 'Don\'t just read — redo the questions you got wrong.' },
      { topic: 'Summarise in your own words', tip: 'If you can\'t explain it simply, you don\'t know it yet.' },
    ];
  }

  function buildExamPlan(subject: string, paper: string, hours: number): StudyBlock[] {
    const topics = getTopics(subject, paper);
    const totalMin = hours * 60;
    const blocks: StudyBlock[] = [];
    let elapsed = 0;
    let topicIdx = 0;
    let blockNum = 0;

    while (elapsed < totalMin - 10) {
      const remaining = totalMin - elapsed;
      if (remaining < 20) break;
      const studyDur = Math.min(50, remaining - 10);
      const t = topics[topicIdx % topics.length];

      blocks.push({
        start: elapsed,
        duration: studyDur,
        subject,
        focus: t.topic,
        technique: blockNum === 0 ? 'Active recall — read, close notes, write from memory' :
                   blockNum === 1 ? 'Past paper questions — work under timed conditions' :
                   blockNum === 2 ? 'Feynman technique — explain it out loud' :
                                   'Past paper — mark your own work with the memo',
        tip: t.tip,
      });

      elapsed += studyDur;
      topicIdx++;
      blockNum++;

      if (elapsed < totalMin - 10) {
        const breakDur = blockNum % 4 === 0 ? 30 : 10;
        blocks.push({
          start: elapsed,
          duration: Math.min(breakDur, totalMin - elapsed),
          subject: '—',
          focus: blockNum % 4 === 0 ? 'Long break — eat, walk, breathe' : 'Short break — stand up, stretch, water',
          technique: '',
          tip: '',
        });
        elapsed += breakDur;
      }
    }
    return blocks;
  }

  function buildSBAPlan(subject: string, taskType: string, hours: number): StudyBlock[] {
    const stages = SBA_STAGES[taskType] ?? SBA_STAGES['essay'];
    const totalMin = hours * 60;
    const blocks: StudyBlock[] = [];
    let elapsed = 0;
    let stageIdx = 0;

    for (const stage of stages) {
      if (elapsed >= totalMin - 5) break;
      const dur = Math.min(stage.duration, totalMin - elapsed - 5);
      if (dur < 5) break;

      blocks.push({
        start: elapsed,
        duration: dur,
        subject,
        focus: stage.stage,
        technique: `${stageIdx + 1} of ${stages.length}`,
        tip: stage.tip,
      });
      elapsed += dur;
      stageIdx++;

      // Add 10-min break after every ~50 min of work
      if (elapsed < totalMin - 15 && stageIdx % 3 === 0) {
        blocks.push({
          start: elapsed,
          duration: 10,
          subject: '—',
          focus: 'Short break — stand up, stretch, water',
          technique: '',
          tip: '',
        });
        elapsed += 10;
      }
    }
    return blocks;
  }

  function formatTime(minutesFromNow: number): string {
    const d = new Date(startTime.getTime() + minutesFromNow * 60000);
    return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }

  function generate() {
    if (!selectedSubject) return;
    startTime = new Date();
    if (mode === 'exam') {
      plan = buildExamPlan(selectedSubject, selectedPaper, hoursAvailable);
    } else {
      plan = buildSBAPlan(selectedSubject, sbaTaskType, hoursAvailable);
    }
    step = 'plan';
  }

  function reset() {
    step = 'setup';
    plan = [];
  }

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const marks: Record<string, string> = state.subjectMarks || {};
        assessmentSubjects = Object.entries(marks)
          .filter(([, v]) => v && v !== '')
          .map(([k]) => k);
        weakestSubjects = assessmentSubjects
          .map(name => ({ name, pct: rangeMid(marks[name] || ''), gap: 60 - rangeMid(marks[name] || '') }))
          .filter(s => s.gap > 0)
          .sort((a, b) => b.gap - a.gap)
          .slice(0, 3);
        if (weakestSubjects.length > 0 && !selectedSubject) {
          selectedSubject = weakestSubjects[0].name;
        }
      }
    } catch {}
    if (!selectedSubject && SUBJECTS.length > 0) selectedSubject = SUBJECTS[0];
  });

  $: papers = SUBJECT_PAPERS[selectedSubject] ?? [];
  $: { if (papers.length === 0) selectedPaper = 'all'; }
  $: isBreak = (b: StudyBlock) => b.subject === '—';
  $: subjectList = assessmentSubjects.length ? assessmentSubjects : Array.from(SUBJECTS).slice(0, 10);
  $: planLabel = mode === 'sba'
    ? `📝 ${selectedSubject} · ${SBA_TASK_TYPES.find(t => t.id === sbaTaskType)?.label.replace(/^.+? /, '') ?? 'SBA task'} · ${hoursAvailable}h`
    : `🚨 ${selectedSubject}${selectedPaper !== 'all' ? ' ' + selectedPaper : ''} · ${hoursAvailable}h rescue plan`;
  $: doneText = mode === 'sba'
    ? '✅ Task submitted. Take a breath — you got it done.'
    : '🎯 Done. You\'ve put in the work. Get some sleep — memory consolidates overnight.';
</script>

<svelte:head>
  <title>Panic Mode — Miyagi My Matric</title>
</svelte:head>

<div class="app panic-page">

  {#if step === 'setup'}
    <div class="panic-header">
      <div class="panic-badge">🚨 Panic Mode</div>
      <h1>{mode === 'sba' ? 'SBA due soon.\nLet\'s get it done.' : 'Exam tomorrow.\nLet\'s get you ready.'}</h1>
      <p class="panic-sub">{mode === 'sba' ? 'Tell us what you\'re submitting — we\'ll build a focused task-completion plan.' : 'Tell us what you\'re writing — we\'ll build the most efficient plan for the time you have.'}</p>
    </div>

    <!-- Mode toggle -->
    <div class="mode-toggle">
      <button class="mode-btn {mode === 'exam' ? 'active' : ''}" on:click={() => { mode = 'exam'; hoursAvailable = 4; }}>
        📖 Exam tomorrow
      </button>
      <button class="mode-btn {mode === 'sba' ? 'active' : ''}" on:click={() => { mode = 'sba'; hoursAvailable = 3; }}>
        🗂️ SBA task due
      </button>
    </div>

    <div class="setup-card">

      <!-- Subject -->
      <div class="setup-field">
        <label class="field-label">Which subject?</label>
        {#if weakestSubjects.length > 0}
          <p class="field-hint">Your weakest subjects:</p>
          <div class="weak-chips">
            {#each weakestSubjects as s}
              <button
                class="weak-chip {selectedSubject === s.name ? 'selected' : ''}"
                on:click={() => { selectedSubject = s.name; selectedPaper = 'all'; }}
              >
                <span class="wc-name">{s.name}</span>
                <span class="wc-pct" style="color: var(--danger)">{s.pct}%</span>
              </button>
            {/each}
          </div>
        {/if}
        <select class="select-input" bind:value={selectedSubject} on:change={() => selectedPaper = 'all'}>
          {#each subjectList as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>

      <!-- Paper selector — only for multi-paper subjects in exam mode -->
      {#if mode === 'exam' && papers.length > 0}
        <div class="setup-field">
          <label class="field-label">Which paper?</label>
          <div class="paper-grid">
            <button
              class="paper-btn {selectedPaper === 'all' ? 'selected' : ''}"
              on:click={() => selectedPaper = 'all'}
            >All papers</button>
            {#each papers as p}
              <button
                class="paper-btn {selectedPaper === p ? 'selected' : ''}"
                on:click={() => selectedPaper = p}
              >{p}</button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- SBA task type -->
      {#if mode === 'sba'}
        <div class="setup-field">
          <label class="field-label">What type of task?</label>
          <div class="task-grid">
            {#each SBA_TASK_TYPES as t}
              <button
                class="task-btn {sbaTaskType === t.id ? 'selected' : ''}"
                on:click={() => sbaTaskType = t.id}
              >{t.label}</button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Hours -->
      <div class="setup-field">
        <label class="field-label">How many hours do you have?</label>
        <div class="hours-grid">
          {#each [1, 2, 3, 4, 5, 6] as h}
            <button
              class="hour-btn {hoursAvailable === h ? 'selected' : ''}"
              on:click={() => hoursAvailable = h}
            >{h}h</button>
          {/each}
        </div>
      </div>

      <!-- Exam tomorrow toggle — exam mode only -->
      {#if mode === 'exam'}
        <div class="setup-field toggle-field">
          <div>
            <div class="field-label">Exam is tomorrow</div>
            <div class="field-hint">Focus on recall over learning new content</div>
          </div>
          <button
            class="toggle-btn {examTomorrow ? 'on' : ''}"
            on:click={() => examTomorrow = !examTomorrow}
            aria-label="Toggle exam tomorrow"
          >
            <div class="toggle-knob"></div>
          </button>
        </div>
      {/if}

      <button class="btn btn-finish panic-go" on:click={generate}>
        {mode === 'sba' ? 'Build my task plan →' : 'Build my rescue plan →'}
      </button>
    </div>

  {:else}
    <!-- ── Plan ── -->
    <div class="plan-header">
      <div class="panic-badge small">{planLabel}</div>
      <div class="plan-start-time">Starting now — {formatTime(0)}</div>
    </div>

    {#if mode === 'exam' && weakestSubjects.length > 0}
      {@const ws = weakestSubjects.find(s => s.name === selectedSubject)}
      {#if ws}
        <div class="gap-callout">
          Currently at <strong style="color: var(--danger)">{ws.pct}%</strong> in {ws.name} — you need 60% to pass. This plan targets the highest-value topics first.
        </div>
      {/if}
    {/if}

    <!-- Timeline -->
    <div class="plan-timeline">
      {#each plan as block, i}
        <div class="timeline-row">
          <div class="timeline-time">{formatTime(block.start)}</div>
          <div class="timeline-track">
            <div class="timeline-dot {isBreak(block) ? 'break' : mode === 'sba' ? 'sba' : 'study'}"></div>
            {#if i < plan.length - 1}
              <div class="timeline-line"></div>
            {/if}
          </div>
          <div class="timeline-card {isBreak(block) ? 'break-card' : mode === 'sba' ? 'sba-card' : 'study-card'}">
            {#if isBreak(block)}
              <div class="break-label">{block.focus}</div>
              <div class="break-dur">{block.duration} min</div>
            {:else if mode === 'sba'}
              <div class="study-duration" style="color: var(--accent2)">{block.duration} min · Stage {block.technique}</div>
              <div class="study-focus">{block.focus}</div>
              {#if block.tip}
                <div class="study-tip">💡 {block.tip}</div>
              {/if}
            {:else}
              <div class="study-duration">{block.duration} min · {block.technique}</div>
              <div class="study-focus">{block.focus}</div>
              {#if block.tip}
                <div class="study-tip">💡 {block.tip}</div>
              {/if}
            {/if}
          </div>
        </div>
      {/each}

      <div class="timeline-row">
        <div class="timeline-time">{formatTime(plan.reduce((acc, b) => acc + b.duration, 0))}</div>
        <div class="timeline-track">
          <div class="timeline-dot done"></div>
        </div>
        <div class="timeline-card done-card">
          <div class="done-text">{doneText}</div>
        </div>
      </div>
    </div>

    <div class="plan-actions">
      <button class="btn btn-outline" on:click={reset}>← Change plan</button>
      {#if mode === 'exam'}
        <a href="/techniques" class="btn btn-ghost-link">Study techniques →</a>
      {:else}
        <a href="/sba" class="btn btn-ghost-link">SBA tracker →</a>
      {/if}
    </div>
  {/if}
</div>

<style>
  .panic-page { max-width: 600px; }

  .panic-header {
    text-align: center;
    margin-bottom: 1.5rem;
    animation: fadeDown .5s ease both;
  }

  .panic-badge {
    display: inline-block;
    background: rgba(255,92,138,.15);
    border: 1px solid rgba(255,92,138,.35);
    color: var(--danger);
    font-family: var(--font-head);
    font-size: .7rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .35rem 1rem; border-radius: 100px;
    margin-bottom: 1rem;
  }
  .panic-badge.small { font-size: .62rem; margin-bottom: .5rem; }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    font-weight: 800; color: var(--text);
    line-height: 1.15; margin-bottom: .6rem;
    white-space: pre-line;
  }

  .panic-sub {
    font-size: .88rem; color: var(--muted);
    font-weight: 300; line-height: 1.6;
    max-width: 420px; margin: 0 auto;
  }

  /* Mode toggle */
  .mode-toggle {
    display: flex; gap: .5rem;
    margin-bottom: 1.2rem;
    animation: fadeUp .3s ease both;
  }
  .mode-btn {
    flex: 1;
    background: var(--surface);
    border: 1.5px solid var(--border);
    color: var(--muted);
    border-radius: 12px;
    padding: .7rem 1rem;
    font-family: var(--font-head);
    font-size: .78rem; font-weight: 700;
    cursor: pointer; transition: all .15s;
    text-align: center;
  }
  .mode-btn:hover { border-color: var(--accent); color: var(--text); }
  .mode-btn.active { border-color: var(--danger); background: rgba(255,92,138,.08); color: var(--danger); }

  /* Setup card */
  .setup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.8rem;
    animation: fadeUp .4s ease both;
  }

  .setup-field { margin-bottom: 1.5rem; }
  .field-label {
    font-family: var(--font-head);
    font-size: .75rem; font-weight: 700;
    color: var(--text); margin-bottom: .4rem;
    display: block;
  }
  .field-hint {
    font-size: .72rem; color: var(--muted);
    font-weight: 300; margin-bottom: .5rem;
  }

  .weak-chips { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .75rem; }
  .weak-chip {
    display: flex; align-items: center; gap: .4rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: .35rem .8rem;
    cursor: pointer; transition: all .15s;
    font-family: var(--font-head);
  }
  .weak-chip:hover { border-color: var(--accent); }
  .weak-chip.selected { border-color: var(--accent); background: rgba(124,77,255,.1); }
  .wc-name { font-size: .75rem; font-weight: 600; color: var(--text); }
  .wc-pct  { font-size: .72rem; font-weight: 700; }

  .select-input {
    width: 100%;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: .7rem 1rem;
    font-family: var(--font-body);
    font-size: .88rem;
    outline: none; cursor: pointer;
    margin-top: .3rem;
  }
  .select-input:focus { border-color: var(--accent); }

  /* Paper selector */
  .paper-grid { display: flex; gap: .4rem; flex-wrap: wrap; }
  .paper-btn {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--muted);
    border-radius: 100px;
    padding: .4rem .9rem;
    font-family: var(--font-head);
    font-size: .75rem; font-weight: 700;
    cursor: pointer; transition: all .15s;
  }
  .paper-btn:hover { border-color: var(--accent); color: var(--text); }
  .paper-btn.selected { border-color: var(--accent); background: rgba(124,77,255,.12); color: var(--accent); }

  /* SBA task type */
  .task-grid { display: flex; flex-direction: column; gap: .4rem; }
  .task-btn {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--muted);
    border-radius: 10px;
    padding: .6rem 1rem;
    font-family: var(--font-head);
    font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: all .15s;
    text-align: left;
  }
  .task-btn:hover { border-color: var(--accent2); color: var(--text); }
  .task-btn.selected { border-color: var(--accent2); background: rgba(56,189,248,.08); color: var(--accent2); }

  .hours-grid { display: flex; gap: .5rem; flex-wrap: wrap; }
  .hour-btn {
    flex: 1; min-width: 48px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--muted);
    border-radius: 10px; padding: .6rem;
    font-family: var(--font-head);
    font-size: .82rem; font-weight: 700;
    cursor: pointer; transition: all .15s;
    text-align: center;
  }
  .hour-btn:hover { border-color: var(--accent); color: var(--text); }
  .hour-btn.selected { border-color: var(--accent); background: rgba(124,77,255,.12); color: var(--accent); }

  .toggle-field { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .toggle-btn {
    width: 48px; height: 27px; border-radius: 100px;
    background: var(--surface2); border: 1.5px solid var(--border);
    position: relative; cursor: pointer;
    transition: background .2s, border-color .2s;
    flex-shrink: 0; padding: 0;
  }
  .toggle-btn.on { background: var(--accent); border-color: var(--accent); }
  .toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,244,232,.4);
    transition: left .2s, background .2s;
  }
  .toggle-btn.on .toggle-knob { left: 23px; background: #0D0A18; }

  .panic-go { width: 100%; margin-top: .5rem; }

  /* Plan */
  .plan-header { margin-bottom: 1rem; }
  .plan-start-time { font-size: .8rem; color: var(--muted); font-weight: 300; margin-top: .3rem; }

  .plan-timeline { margin-bottom: 1.5rem; }

  .timeline-row { display: flex; gap: .8rem; align-items: flex-start; }

  .timeline-time {
    font-family: var(--font-head);
    font-size: .65rem; font-weight: 700; color: var(--muted);
    width: 40px; flex-shrink: 0; padding-top: .6rem; text-align: right;
  }

  .timeline-track {
    display: flex; flex-direction: column;
    align-items: center; flex-shrink: 0; padding-top: .55rem;
  }

  .timeline-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .timeline-dot.study { background: var(--accent); box-shadow: 0 0 8px rgba(124,77,255,.5); }
  .timeline-dot.sba   { background: var(--accent2); box-shadow: 0 0 8px rgba(56,189,248,.4); }
  .timeline-dot.break { background: var(--surface2); border: 2px solid var(--border); }
  .timeline-dot.done  { background: var(--accent3); box-shadow: 0 0 8px rgba(122,255,122,.5); }

  .timeline-line { width: 2px; flex: 1; min-height: 16px; background: var(--border); margin: 4px 0; }

  .timeline-card {
    flex: 1; border-radius: 12px; padding: .75rem 1rem;
    margin-bottom: .5rem; animation: fadeUp .3s ease both;
  }
  .study-card { background: var(--surface); border: 1px solid rgba(124,77,255,.2); }
  .sba-card   { background: var(--surface); border: 1px solid rgba(56,189,248,.2); }
  .break-card { background: transparent; border: 1px solid rgba(255,244,232,.06); }
  .done-card  { background: rgba(122,255,122,.06); border: 1px solid rgba(122,255,122,.2); }

  .study-duration {
    font-size: .68rem; color: var(--accent);
    font-family: var(--font-head); font-weight: 700;
    letter-spacing: .04em; margin-bottom: .3rem; text-transform: uppercase;
  }
  .study-focus { font-size: .85rem; color: var(--text); font-weight: 600; line-height: 1.4; margin-bottom: .4rem; }
  .study-tip {
    font-size: .72rem; color: var(--muted); font-weight: 300; line-height: 1.5;
    background: rgba(255,244,232,.04); border-radius: 6px; padding: .4rem .6rem;
  }

  .break-label { font-size: .8rem; color: var(--muted); font-weight: 400; }
  .break-dur { font-size: .65rem; color: rgba(255,244,232,.3); font-family: var(--font-head); margin-top: .1rem; }

  .done-text { font-size: .82rem; color: var(--accent3); font-weight: 500; line-height: 1.5; }

  .plan-actions { display: flex; gap: .75rem; margin-bottom: 2rem; }
  .btn-ghost-link {
    font-family: var(--font-head);
    font-size: .82rem; font-weight: 700;
    color: var(--accent2); text-decoration: none;
    padding: .85rem 1.5rem;
    border: 1.5px solid rgba(56,189,248,.25);
    border-radius: 100px; transition: border-color .15s;
  }
  .btn-ghost-link:hover { border-color: var(--accent2); }

  .gap-callout {
    background: rgba(255,92,138,.06);
    border: 1px solid rgba(255,92,138,.2);
    border-radius: 12px; padding: .8rem 1rem;
    font-size: .82rem; color: var(--muted);
    font-weight: 300; line-height: 1.6; margin-bottom: 1.2rem;
  }
</style>
