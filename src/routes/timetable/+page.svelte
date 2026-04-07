<script lang="ts">
  import { onMount } from 'svelte';
  import { rangeMid, computeAPS } from '$lib/aps';
  import { getHighValueTopics } from '$lib/highValueTopics';

  // ── Types ─────────────────────────────────────────────────────────
  type SlotType = 'sleep' | 'school' | 'lunch' | 'dinner' | 'leisure' | 'pp' | 'sr' | 'study' | 'free';

  interface Slot {
    type: SlotType;
    label: string;
    sub: string;
    colorCls: string;
    task: string;
    conf: number;
    mark: number;
    subjName: string;
  }

  interface TtSubject {
    name: string;
    current: number;
    target: number;
    priority: 'high' | 'med' | 'low';
    confidence: number;
  }

  interface Resource { i: string; n: string; d: string; u: string; }

  // ── Constants ─────────────────────────────────────────────────────
  const TT_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const TT_SHORT = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  const SLOT_START = 6;
  const N_SLOTS = (22 - SLOT_START) * 2; // 32 slots (06:00–22:00)
  const slotIndices = Array.from({ length: N_SLOTS }, (_, i) => i);

  const MODE_HRS: Record<string, number>    = { default: 15, stretch: 28, optimal: 35 };
  const MODE_TARGET: Record<string, number> = { default: 50, stretch: 60, optimal: 70 };

  // ── State ─────────────────────────────────────────────────────────
  let mode = 'stretch';
  let grid: Slot[][] = [];
  let ttSubjects: TtSubject[] = [];
  let profile: Record<string, any> = {};
  let subjectMarks: Record<string, string> = {};
  let subjectRatings: Record<string, number> = {};
  let hasAssessment = false;

  let modalSlot: Slot | null = null;
  let showModal = false;

  let currentAPS = 0;
  let targetAPS = 0;
  let hoursPerWeek = 28;
  let alloc: Record<string, number> = {};

  // ── Helpers ───────────────────────────────────────────────────────
  function slotTime(idx: number): { h: number; m: number; hh: string; mm: string } {
    const totalMin = SLOT_START * 60 + idx * 30;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return { h, m, hh: String(h).padStart(2, '0'), mm: String(m).padStart(2, '0') };
  }

  function abbrevSubj(name: string): string {
    const map: Record<string, string> = {
      'Mathematics': 'Maths', 'Mathematical Literacy': 'Maths Lit',
      'Physical Sciences': 'Phys Sci', 'Life Sciences': 'Life Sci',
      'English HL': 'Eng HL', 'English FAL': 'Eng FAL',
      'Accounting': 'Acc', 'Business Studies': 'Biz Stud',
      'Life Orientation': 'LO', 'Information Technology': 'IT',
      'Economics': 'Econ', 'History': 'History', 'Geography': 'Geo',
      'Afrikaans': 'Afr', 'Computer Applications Technology': 'CAT'
    };
    return map[name] || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 5);
  }

  function slotBgClass(slot: Slot): string {
    if (slot.type === 'sleep')   return 'b-sleep';
    if (slot.type === 'school')  return 'b-school';
    if (slot.type === 'lunch')   return 'b-lunch';
    if (slot.type === 'dinner')  return 'b-dinner';
    if (slot.type === 'leisure') return 'b-leisure';
    if (slot.type === 'pp')      return 'b-pp';
    if (slot.type === 'sr')      return 'b-sr';
    if (slot.type === 'study')   return slot.colorCls;
    return 'b-empty';
  }

  // ── Smart shuffle ─────────────────────────────────────────────────
  function smartShuffle(arr: number[]): number[] {
    const a = [...arr].sort(() => Math.random() - 0.5);
    for (let i = 2; i < a.length; i++) {
      if (a[i] === a[i - 1] && a[i] === a[i - 2]) {
        for (let j = i + 1; j < a.length; j++) {
          if (a[j] !== a[i]) { [a[i], a[j]] = [a[j], a[i]]; break; }
        }
      }
    }
    return a;
  }

  // ── Hour allocation ───────────────────────────────────────────────
  function computeHourAllocation(m: string): Record<string, number> {
    const totalHrs = MODE_HRS[m];
    const freeHrs = Math.max(0, totalHrs - 3 - 2); // subtract ppHrs(3) + srHrs(2)
    const priorityW: Record<string, number> = { high: 3, med: 2, low: 1 };
    const weights = ttSubjects.map(s => Math.max(1, s.target - s.current) * (priorityW[s.priority] || 2));
    const totalW = weights.reduce((a, b) => a + b, 0) || 1;
    const result: Record<string, number> = {};
    ttSubjects.forEach((s, i) => {
      result[s.name] = Math.round((weights[i] / totalW) * freeHrs * 2) / 2;
    });
    return result;
  }

  // ── Task library ──────────────────────────────────────────────────
  function getTTTask(subjName: string, sessIdx: number, di: number): string {
    const style = String(profile.learning_style || 'reading');
    const system = String(profile.exam_system || 'caps');
    const challenges: string[] = Array.isArray(profile.challenges) ? profile.challenges : [];
    const ppHabit = String(profile.past_papers || 'never');
    const conf = ttSubjects.find(s => s.name === subjName)?.confidence || 3;
    const phase = conf <= 2 ? 'foundation' : conf <= 3 ? 'consolidation' : 'exam_prep';

    const tasks: Record<string, Record<string, Record<string, string | string[]>>> = {
      'Mathematics': {
        foundation: {
          visual: ['Draw a mind map of all function types — sketch each shape', 'Colour-code each algebra step — one colour per operation', 'Sketch parabola, hyperbola, exponential from memory, label intercepts'],
          reading: ['Blurt every formula onto blank paper, then check', 'Write all Grade 12 theorems in your own words', 'Summarise all calculus rules with one worked example each'],
          listening: ['Watch Kevinmathscience on your weakest topic — pause and repeat key steps', 'Explain differentiation from first principles out loud'],
          doing: ['10 mixed algebra questions — no calculator, show all working', '5 Euclidean geometry riders — write every reason', '8 function graph questions under 15 min']
        },
        consolidation: {
          visual: ['Sketch 8 function transformations from memory'],
          reading: ['One-page summary of all Paper 1 topics — close book first', 'Flashcards: theorem statement front, proof back'],
          doing: ['Paper 1 Section A — no calculator, 20 min strict', 'Pick 3 weakest question types, drill 5 each']
        },
        exam_prep: {
          visual: ['Time-trial: full functions question under 8 min'],
          reading: ['Annotate a past paper memo — circle every mark you would have lost'],
          doing: ['Full past paper under exam conditions — no notes', 'Self-mark with DBE memo, tally every lost mark by topic']
        }
      },
      'Physical Sciences': {
        foundation: {
          visual: ['Draw a labelled circuit diagram from memory', 'Mind-map Newton Laws with force diagrams'],
          reading: ['Blurt all Physics equations, then check formula sheet', 'Write all definitions from today chapter in your own words'],
          listening: ['Watch Mindset Learn on your weakest Physics chapter', 'Explain the photoelectric effect out loud until fluent'],
          doing: ['8 calculation questions — show units every step', 'Balance 8 chemical equations without examples']
        },
        consolidation: {
          visual: ['Compare all wave properties side by side in a table'],
          reading: ['Write definitions for all Grade 10–12 key terms — examinable across grades'],
          doing: ['Timed: 10 electricity calculations in 20 min', 'Drill all explain-the-difference questions from past papers']
        },
        exam_prep: {
          doing: ['Full Paper 1 under strict 3-hour exam conditions', 'Memo analysis: write WHY each mark is awarded beside every answer']
        }
      },
      'Life Sciences': {
        foundation: {
          visual: ['Draw full DNA replication from memory — every enzyme labelled', 'Sketch mitosis vs meiosis side by side — all stages'],
          reading: ['Blurt everything you know about this chapter, find every gap', 'Summarise each life process in 5 bullets, then test yourself'],
          doing: ['All textbook questions for this chapter', 'Redo every incorrect answer from your last Life Sciences test']
        },
        consolidation: {
          visual: ['Draw full protein synthesis — DNA to amino acid, no notes'],
          reading: ['Comparison table: mitosis vs meiosis, every difference'],
          doing: ['10 source-based questions — use only the provided source', 'Practice essay on evolution in 25 min']
        },
        exam_prep: {
          doing: [
            system === 'ieb' ? 'Full 40-mark source essay timed at 45 min (IEB)' : 'Full Paper 2 section under exam conditions',
            'Blank-page diagram drill: 3 key diagrams from memory'
          ]
        }
      },
      'English HL': {
        foundation: {
          visual: ['Character web for your novel — link every motivation', 'Mind-map all themes with 2 quotes each'],
          reading: ['Blurt full plot of prescribed novel — check gaps', 'Write 5 key quotes per character and what each reveals'],
          doing: ['One timed PEEL paragraph on a set-work theme — 15 min', 'Comprehension passage with inference questions — 20 min']
        },
        consolidation: {
          reading: ['Write intro and conclusion for 3 different essay questions'],
          doing: ['Full timed essay — 40 min — no planning, straight to writing', 'Unseen poem analysis: tone, imagery, structure, message']
        },
        exam_prep: {
          doing: ['Full Paper 2 literature essay — 45 min per essay', 'Revise all grammar and punctuation rules from Paper 1 Section A']
        }
      },
      'Accounting': {
        foundation: {
          visual: ['Draw the accounting equation with labelled T-accounts'],
          reading: ['Write all definitions: debits, credits, assets, liabilities', 'Summarise the bookkeeping cycle in your own words — all 8 steps'],
          doing: ['Full set of journals for a sample transaction', 'Post to ledger, balance, check totals']
        },
        consolidation: {
          reading: ['Write the formula for every ratio — memorise 5 by blurting'],
          doing: ['Full Income Statement and Balance Sheet under 45 min', 'Interpret all ratios: one sentence each explaining business health']
        },
        exam_prep: {
          doing: ['Paper 1 Section A — journals under strict time (1.2 min per mark)', 'Calculate and interpret all key ratios from a past paper question']
        }
      },
      'Business Studies': {
        foundation: {
          visual: ['PESTLE analysis map for a South African business'],
          reading: ['Blurt all consumer protection legislation: CPA, BBBEE, EEA', 'Comparison table: all 3 forms of business ownership'],
          doing: ['Full PEEL essay on a prescribed topic — 25 min', '5 case study questions from a past paper']
        },
        consolidation: {
          reading: ['Memorise all 8 forms of ownership from memory'],
          doing: ['40-mark essay — intro, 5 body paragraphs, recommendation', 'Data response question from a past paper — full answer']
        },
        exam_prep: {
          doing: ['Full exam essay on your weakest topic — time strictly', 'Mark against memo, tally every missed mark']
        }
      },
      'History': {
        foundation: {
          visual: ['Timeline of all key events in your first essay topic', 'Mind-map causes, events, consequences'],
          reading: ['Blurt key facts of this chapter, check textbook for gaps'],
          doing: ['Full source analysis using SORC method', 'Introduction for 3 different essay questions']
        },
        consolidation: {
          reading: ['Full essay plan: thesis, 4 argument points, conclusion outline'],
          doing: ['Timed essay — 45 min — on your weakest topic', 'Evaluate 4 sources: origin, purpose, bias, reliability']
        },
        exam_prep: {
          doing: ['Full Paper 1 source analysis — timed at 2.5 hours', 'One essay per exam topic — 40 min each']
        }
      },
      'Geography': {
        foundation: {
          visual: ['Draw a river valley cross-section from source to mouth', 'Sketch a synoptic weather chart — label all features'],
          reading: ['Blurt all mapwork skills: contour, gradient, bearing, cross-section'],
          doing: ['Full mapwork exercise: gradient and cross-section and bearing', '5 source-based questions on a topographic map extract']
        },
        consolidation: {
          doing: ['Full mapwork section in 45 min — timed', 'Full paragraph answers on all settlement pattern types']
        },
        exam_prep: {
          doing: ['Full Paper 1 under timed conditions: Physical and Mapwork', 'All GIS question types from past papers']
        }
      },
      'Life Orientation': {
        foundation: {
          reading: ['Check LO portfolio requirements — list what is outstanding'],
          doing: ['Write one paragraph on personal development — peer review ready', 'Complete any outstanding LO SBA task or CAT component']
        },
        exam_prep: {
          doing: ['Finalise LO portfolio — check all evidence is included', 'Complete CAT practice questions']
        }
      }
    };

    const generic: Record<string, Record<string, string>> = {
      foundation:    { visual: 'Draw a topic mind map from memory, then check for gaps', reading: 'Blurt: close notes, write everything you know, fill gaps', listening: 'Record yourself explaining this topic — replay and improve', doing: '10 practice questions on today topic — no notes' },
      consolidation: { visual: 'Visual comparison of the two hardest sub-topics', reading: 'One-page topic summary in your own words — test yourself', listening: 'Explain this topic to a family member for 5 min', doing: '20 questions in 25 min — check every answer' },
      exam_prep:     { visual: 'Map every question type and what each demands', reading: 'Annotate past paper answers against the memo', listening: 'Narrate reasoning aloud as you write each answer', doing: 'Full past paper — strict exam conditions, no notes' }
    };

    const subKey = Object.keys(tasks).find(k => subjName.toLowerCase().includes(k.toLowerCase()));
    let task = '';
    if (subKey && tasks[subKey][phase]) {
      const po = tasks[subKey][phase];
      const arr = po[style] || po.doing || po.reading || Object.values(po)[0];
      task = Array.isArray(arr) ? arr[sessIdx % arr.length] : String(arr);
    } else {
      task = generic[phase]?.[style] || generic[phase]?.doing || '';
    }

    if (challenges.includes('understanding') && phase === 'foundation') task = 'Gap focus: ' + task;
    if (challenges.includes('procrastination')) task = 'Start with the easiest part first. ' + task;
    if (challenges.includes('anxiety') && phase === 'exam_prep') task = 'Box breathe x4 first. ' + task;
    if (system === 'ieb' && phase === 'exam_prep') task += ' [IEB: focus on application and source analysis]';
    if (ppHabit === 'never' && phase !== 'foundation') task += ' — also do 10 min of a past paper after';

    return task;
  }

  // ── Resource DB ───────────────────────────────────────────────────
  const TT_RES_DB: Record<string, Resource[]> = {
    'Mathematics': [
      { i: '🎥', n: 'Kevinmathscience', d: 'YouTube · CAPS & IEB aligned', u: 'https://www.youtube.com/@Kevinmathscience' },
      { i: '📘', n: 'Siyavula Maths Gr 12', d: 'Free adaptive practice, zero-rated', u: 'https://www.siyavula.com/read/maths/grade-12' },
      { i: '📄', n: 'DBE Past Papers — Maths', d: 'All papers 2016+, free', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Maths', d: 'Worked examples and summaries', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Physical Sciences': [
      { i: '🎥', n: 'Kevinmathscience — Phys Sci', d: 'Physics and Chemistry, CAPS and IEB', u: 'https://www.youtube.com/@Kevinmathscience' },
      { i: '📘', n: 'Siyavula Physical Sciences', d: 'Free practice, zero-rated', u: 'https://www.siyavula.com/read/science/grade-12' },
      { i: '📄', n: 'DBE Past Papers — Phys Sci', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Phys Sci', d: 'Official study guide, free', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Life Sciences': [
      { i: '🎥', n: 'Mindset Learn — Life Sciences', d: 'Free video lessons by topic', u: 'https://www.mindset.co.za' },
      { i: '📄', n: 'DBE Past Papers — Life Sciences', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Life Sciences', d: 'Diagrams, summaries and questions', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' },
      { i: '🔍', n: 'SA Exam Papers — Life Sciences', d: 'Papers back to 2008', u: 'https://www.saexampapers.co.za' }
    ],
    'English': [
      { i: '📄', n: 'DBE Past Papers — English HL/FAL', d: 'All papers from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '🔍', n: 'SA Exam Papers — English', d: 'Papers from 2008', u: 'https://www.saexampapers.co.za' },
      { i: '📖', n: 'DBE Mind the Gap — English HL', d: 'Language, literature and writing', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Accounting': [
      { i: '🎥', n: 'Mindset Learn — Accounting', d: 'Financial statements video lessons', u: 'https://www.mindset.co.za' },
      { i: '📄', n: 'DBE Past Papers — Accounting', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Accounting', d: 'Ratios, statements and worked examples', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Business Studies': [
      { i: '🎥', n: 'Mindset Learn — Business Studies', d: 'Free video lessons by topic', u: 'https://www.mindset.co.za' },
      { i: '📄', n: 'DBE Past Papers — Business Studies', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Business Studies', d: 'Essay guides and legislation summaries', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'History': [
      { i: '🎥', n: 'Mindset Learn — History', d: 'Source analysis and essay video lessons', u: 'https://www.mindset.co.za' },
      { i: '📄', n: 'DBE Past Papers — History', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — History', d: 'Source skills and essay frameworks', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Geography': [
      { i: '🎥', n: 'Mindset Learn — Geography', d: 'Mapwork and physical geography videos', u: 'https://www.mindset.co.za' },
      { i: '📄', n: 'DBE Past Papers — Geography', d: 'Papers and memos from 2016', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '📖', n: 'DBE Mind the Gap — Geography', d: 'Mapwork and human geography guides', u: 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/MindtheGap.aspx' }
    ],
    'Life Orientation': [
      { i: '📖', n: 'AVBOB Step 12 — LO Guide', d: 'Free in all 11 SA languages', u: 'https://step12.avbob.co.za' },
      { i: '📄', n: 'DBE Past Papers — Life Orientation', d: 'CAT papers and memos', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' }
    ],
    '_pp': [
      { i: '📄', n: 'DBE NSC Past Papers (all subjects)', d: '2016–2024, free, zero-rated', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '🔍', n: 'SA Exam Papers (2008–present)', d: 'Largest SA collection, all subjects', u: 'https://www.saexampapers.co.za' },
      { i: '📱', n: 'Matric Exam Papers App', d: 'DBE and IEB and provincial, offline-capable', u: 'https://play.google.com/store/search?q=matric+exam+papers' }
    ],
    '_sr': [
      { i: '🃏', n: 'Anki Flashcards', d: 'Free on Android, SM-2 algorithm', u: 'https://apps.ankiweb.net' },
      { i: '💬', n: 'Maski — WhatsApp AI Tutor', d: 'SA-built, 100k+ users, any phone', u: 'https://maski.co.za' },
      { i: '⚡', n: 'Matric Live — Quiz Battles', d: 'Gamified revision, offline capable', u: 'https://www.matriclive.com' }
    ],
    '_default': [
      { i: '📄', n: 'DBE Past Papers', d: 'All NSC papers 2016+, free', u: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx' },
      { i: '⚡', n: 'Matric Live', d: 'Interactive lessons and AI support', u: 'https://www.matriclive.com' },
      { i: '📖', n: 'AVBOB Step 12', d: 'Free in all 11 SA languages', u: 'https://step12.avbob.co.za' }
    ]
  };

  function getTTResources(subjName: string, type: string): Resource[] {
    if (type === 'pp') return TT_RES_DB['_pp'];
    if (type === 'sr') return TT_RES_DB['_sr'];
    const k = Object.keys(TT_RES_DB).find(key => key[0] !== '_' && subjName.toLowerCase().includes(key.toLowerCase()));
    return TT_RES_DB[k || '_default'] || TT_RES_DB['_default'];
  }

  // ── Build grid ────────────────────────────────────────────────────
  function buildGrid() {
    if (ttSubjects.length === 0) return;
    const tgt = MODE_TARGET[mode];
    hoursPerWeek = MODE_HRS[mode];

    ttSubjects = ttSubjects.map(s => {
      const gap = Math.max(0, tgt - s.current);
      const priority: 'high' | 'med' | 'low' = gap >= 15 ? 'high' : gap >= 7 ? 'med' : 'low';
      return { ...s, target: tgt, priority };
    });

    alloc = computeHourAllocation(mode);

    const ppSlots = 4; // 2 weekend days × 2 slots

    const schedule: Slot[][] = TT_DAYS.map((_, di) => {
      const isWknd = di >= 5;
      return slotIndices.map(si => {
        const { h, m } = slotTime(si);
        const wakeH = isWknd ? 8 : 7;

        const free  = (): Slot => ({ type: 'free',    label: '', sub: '', colorCls: '', task: '', conf: 0, mark: 0, subjName: '' });
        const fixed = (type: SlotType, label: string, sub: string): Slot =>
          ({ type, label, sub, colorCls: '', task: '', conf: 0, mark: 0, subjName: '' });

        if (h < wakeH) return fixed('sleep', '😴 Sleep', '');

        if (!isWknd && ((h === 7 && m === 30) || (h > 7 && h < 14) || (h === 14 && m === 0)))
          return fixed('school', '🏫 School', 'Attend classes');

        if (isWknd && h === 12 && m === 30) return fixed('lunch', '🍽 Lunch', '30 min break');

        if (!isWknd && h === 14 && m === 30) return fixed('leisure', '🚌 Travel Home', 'Decompress');
        if (!isWknd && h === 15 && m === 0)  return fixed('leisure', '🎮 Break', 'Rest before study');
        if (h === 17 && m === 30)  return fixed('leisure', '🎮 Leisure', 'Walk / unwind');
        if (h === 18 && m === 0)   return fixed('dinner',  '🍜 Dinner', 'Family time');
        if (h === 18 && m === 30)  return fixed('leisure', '🌙 Unwind', 'After dinner');
        if (h === 21 && m === 0)   return fixed('leisure', '📖 Wind Down', 'Screen-free');
        if (h === 21 && m === 30)  return fixed('leisure', '📖 Wind Down', 'Screen-free');

        if (isWknd && h >= 8 && h < 10)  return fixed('leisure', '☀️ Morning Free', 'Recharge');
        if (isWknd && h >= 15 && h < 16) return fixed('leisure', '⚽ Sport / Hobby', 'Active break');

        return free();
      });
    });

    const openByDay = TT_DAYS.map((_, di) =>
      schedule[di].reduce<number[]>((acc, s, si) => s.type === 'free' ? [...acc, si] : acc, [])
    );

    const totalHrs = MODE_HRS[mode];
    const targetSlots = Math.min(totalHrs * 2, openByDay.reduce((a, b) => a + b.length, 0));
    const priorityW: Record<string, number> = { high: 3, med: 2, low: 1 };
    const wts = ttSubjects.map(s => Math.max(1, s.target - s.current) * (priorityW[s.priority] || 2));
    const totalW = wts.reduce((a, b) => a + b, 0) || 1;
    const pool: number[] = [];
    ttSubjects.forEach((_, i) => {
      const c = Math.round((wts[i] / totalW) * targetSlots * 1.2);
      for (let j = 0; j < c; j++) pool.push(i);
    });
    const shuffled = smartShuffle(pool);

    let pi = 0, ppPlaced = 0, srPlaced = 0;
    const sessCount: Record<string, number> = {};

    TT_DAYS.forEach((_, di) => {
      const isWknd = di >= 5;
      const open = openByDay[di];
      const slotsPerDay = Math.ceil(targetSlots / 7) * (isWknd ? 2 : 1);

      open.forEach((si, oi) => {
        if (isWknd && oi < 2 && ppPlaced < ppSlots) {
          const ppTask = String(profile.past_papers) === 'never'
            ? 'Start with Section A only (30 min). Check against memo. Write down every mark lost.'
            : 'Full past paper — DBE exam conditions. Self-mark strictly against memo.';
          schedule[di][si] = { type: 'pp', label: '📝 Past Paper', sub: 'Timed practice', task: ppTask, colorCls: '', conf: 3, mark: 0, subjName: 'Past Paper' };
          ppPlaced++;
          return;
        }

        if (di === 6 && oi >= open.length - 2 && srPlaced < 2) {
          const styleKey = String(profile.learning_style || 'doing');
          const srTasks: Record<string, string> = {
            visual:    'Review all mind maps from this week — cover and redraw from memory.',
            reading:   'Blurt all topics studied this week — 10 min per subject. Check gaps.',
            listening: 'Record a 2-min summary of each topic. Replay all.',
            doing:     'Flashcard drill: all cards from this week. Failed cards back to box 1.'
          };
          schedule[di][si] = { type: 'sr', label: '🔁 Spaced Review', sub: 'Recall and consolidate', task: srTasks[styleKey] || srTasks.doing, colorCls: '', conf: 3, mark: 0, subjName: 'Spaced Review' };
          srPlaced++;
          return;
        }

        if (pi < shuffled.length && oi < slotsPerDay) {
          const sIdx = shuffled[pi % shuffled.length];
          const subj = ttSubjects[sIdx];
          if (!subj) { pi++; return; }
          const key = `${di}-${subj.name}`;
          sessCount[key] = (sessCount[key] || 0) + 1;
          const cls = 'sc-' + 'ABCDEFGHI'[sIdx % 9];
          const task = hasAssessment ? getTTTask(subj.name, sessCount[key] - 1, di) : '';
          schedule[di][si] = { type: 'study', label: abbrevSubj(subj.name), sub: subj.name, colorCls: cls, task, conf: subj.confidence, mark: subj.current, subjName: subj.name };
          pi++;
        }
      });
    });

    grid = schedule;

    const apsResult = computeAPS(subjectMarks);
    currentAPS = apsResult.total;
    const targetMarkMap: Record<string, string> = {};
    ttSubjects.forEach(s => {
      const p = s.target;
      targetMarkMap[s.name] = p >= 90 ? '90-100' : p >= 80 ? '80-89' : p >= 70 ? '70-79' : p >= 60 ? '60-69' : p >= 50 ? '50-59' : p >= 40 ? '40-49' : p >= 30 ? '30-39' : '0-29';
    });
    targetAPS = computeAPS(targetMarkMap).total;

    try { localStorage.setItem('mmm_timetable_v1', JSON.stringify({ mode })); } catch {}
  }

  // ── Mount ─────────────────────────────────────────────────────────
  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        subjectMarks   = state.subjectMarks   || {};
        subjectRatings = state.subjectRatings  || {};
        profile        = state.answers         || {};
        hasAssessment  = subjects.length > 0;

        const subjects = Object.keys(subjectMarks).filter(s => subjectMarks[s]);
        if (subjects.length > 0) {
          const tgt = MODE_TARGET[mode];
          ttSubjects = subjects.map(name => {
            const current = rangeMid(subjectMarks[name]);
            const conf    = subjectRatings[name] || 3;
            const gap     = Math.max(0, tgt - current);
            const priority: 'high' | 'med' | 'low' = gap >= 15 ? 'high' : gap >= 7 ? 'med' : 'low';
            return { name, current, target: tgt, priority, confidence: conf };
          });
          buildGrid();
        }
      }
    } catch (e) {
      console.error('Timetable mount error:', e);
    }
  });

  // ── Mode switch ───────────────────────────────────────────────────
  function setMode(m: string) {
    mode = m;
    buildGrid();
  }

  // ── Modal ─────────────────────────────────────────────────────────
  function openModal(slot: Slot) {
    modalSlot = slot;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    modalSlot = null;
  }

  function handleBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) closeModal();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeModal();
  }

  // ── Derived ───────────────────────────────────────────────────────
  $: modalResources = modalSlot ? getTTResources(modalSlot.subjName, modalSlot.type) : [];
  $: modalHighValue = (modalSlot && modalSlot.type === 'study') ? getHighValueTopics(modalSlot.subjName, 2) : [];
  $: apsGap    = targetAPS - currentAPS;
  $: termHours = hoursPerWeek * 10;
  $: allocSorted  = [...ttSubjects].sort((a, b) => (alloc[b.name] || 0) - (alloc[a.name] || 0));
  $: maxAllocHrs  = Math.max(...Object.values(alloc), 1);

  const scBg: Record<string, string> = { 'sc-A':'#dff3e4','sc-B':'#dde8f7','sc-C':'#fef3d8','sc-D':'#f7ddf0','sc-E':'#ddf7f4','sc-F':'#f7ede0','sc-G':'#ede0f7','sc-H':'#f0f7dd','sc-I':'#f7dddd' };
  const scFg: Record<string, string> = { 'sc-A':'#155a28','sc-B':'#153480','sc-C':'#7a4a08','sc-D':'#7a1060','sc-E':'#0a5550','sc-F':'#7a3808','sc-G':'#4a0a78','sc-H':'#3a5808','sc-I':'#7a1818' };

  $: mBadgeBg = modalSlot ? (modalSlot.type === 'pp' ? '#1a2214' : modalSlot.type === 'sr' ? '#2a2000' : scBg[modalSlot.colorCls] || '#1f2937') : '#1f2937';
  $: mBadgeFg = modalSlot ? (modalSlot.type === 'pp' ? '#4ade80' : modalSlot.type === 'sr' ? '#f6c90e' : scFg[modalSlot.colorCls] || '#f0f4f8') : '#f0f4f8';
  $: mPhase   = modalSlot ? ((modalSlot.conf || 3) <= 2 ? 'Foundation — build from zero' : (modalSlot.conf || 3) <= 3 ? 'Consolidation — deepen understanding' : 'Exam prep — timed and high-stakes') : '';
</script>

<svelte:head>
  <title>Smart Timetable — Miyagi My Matric</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="app">
  <header class="page-header">
    <h1>Smart Timetable</h1>
    <p class="sub">Auto-generated from your assessment — personalised to your subjects, marks, and goals</p>
  </header>

  {#if ttSubjects.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h2>Complete your self-assessment first</h2>
      <p>Your timetable is personalised to your subjects, marks, and study goals.<br>Complete the 6-section assessment to unlock it.</p>
      <a href="/assessment" class="btn-primary">Start Assessment →</a>
    </div>

  {:else}

    <!-- Mode tabs -->
    <div class="mode-tabs">
      <button class="mode-tab {mode === 'default' ? 'active' : ''}" on:click={() => setMode('default')}>
        <span class="mode-label">Default</span>
        <span class="mode-hrs">~15 hrs/wk</span>
        <span class="mode-desc">Maintain marks</span>
      </button>
      <button class="mode-tab stretch {mode === 'stretch' ? 'active' : ''}" on:click={() => setMode('stretch')}>
        <span class="mode-badge">Recommended</span>
        <span class="mode-label">Stretch</span>
        <span class="mode-hrs">~28 hrs/wk</span>
        <span class="mode-desc">Bridge the gap</span>
      </button>
      <button class="mode-tab {mode === 'optimal' ? 'active' : ''}" on:click={() => setMode('optimal')}>
        <span class="mode-label">Optimal</span>
        <span class="mode-hrs">~35 hrs/wk</span>
        <span class="mode-desc">Overshoot targets</span>
      </button>
    </div>

    <!-- APS callout -->
    <div class="aps-callout">
      <div class="aps-head">📊 APS Study Needs Analysis</div>
      <div class="aps-nums">
        <div class="aps-num-block">
          <div class="aps-num-val current">{currentAPS}</div>
          <div class="aps-num-lbl">Current APS /42</div>
        </div>
        <div class="aps-arrow">→</div>
        <div class="aps-num-block">
          <div class="aps-num-val target">{targetAPS}</div>
          <div class="aps-num-lbl">Target APS /42</div>
        </div>
        <div class="aps-num-block">
          <div class="aps-num-val neutral">{hoursPerWeek}</div>
          <div class="aps-num-lbl">Hrs/week</div>
        </div>
        <div class="aps-num-block">
          <div class="aps-num-val neutral">{termHours}</div>
          <div class="aps-num-lbl">Term total</div>
        </div>
      </div>
      <p class="aps-text">
        {#if apsGap > 0}
          You need <strong>{apsGap} more APS point{apsGap !== 1 ? 's' : ''}</strong> to hit your target.
          With <strong>{hoursPerWeek} hrs/week × 10 weeks = {termHours} study hours</strong>, this gap is
          <strong>{apsGap <= 2 ? 'very achievable' : apsGap <= 5 ? 'achievable with consistent effort' : 'ambitious — prioritise your weakest subjects ruthlessly'}</strong>.
        {:else}
          <strong>Your current APS already meets your target!</strong> Focus on consistency, maximising SBA marks, and full past papers under timed conditions.
        {/if}
      </p>
      <p class="aps-note">A learner with 80% SBA only needs 53% in the final exam to achieve 60% overall — strong SBA marks are your most reliable safety net.</p>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-block">
        <div class="stat-val">{hoursPerWeek}</div>
        <div class="stat-lbl">Hours/Week</div>
      </div>
      <div class="stat-block">
        <div class="stat-val">{termHours}</div>
        <div class="stat-lbl">Term Total</div>
      </div>
      <div class="stat-block">
        <div class="stat-val">{ttSubjects.length}</div>
        <div class="stat-lbl">Subjects</div>
      </div>
      <div class="stat-block">
        <div class="stat-val">2×</div>
        <div class="stat-lbl">Past Paper Days</div>
      </div>
    </div>

    <!-- Allocation bars -->
    <div class="alloc-section">
      <h3 class="section-label">Subject Allocation</h3>
      <div class="alloc-rows">
        {#each allocSorted as s}
          {@const h = alloc[s.name] || 0}
          {@const gap = s.target - s.current}
          {@const barCol = gap >= 15 ? 'var(--danger)' : gap >= 7 ? 'var(--accent)' : 'var(--accent3)'}
          {@const pct = maxAllocHrs > 0 ? Math.round((h / maxAllocHrs) * 100) : 0}
          {@const gLabel = gap > 0 ? '+' + gap + '% gap' : 'on target'}
          <div class="alloc-row">
            <div class="alloc-name">{s.name}</div>
            <div class="alloc-bar-wrap"><div class="alloc-bar" style="width:{pct}%;background:{barCol}"></div></div>
            <div class="alloc-hrs">{h}h</div>
            <div class="alloc-gap {s.priority}">{gLabel}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Grid -->
    {#if grid.length > 0}
    <div class="grid-wrap">
      <div class="grid-scroll">
        <table class="tt-table">
          <thead>
            <tr>
              <th class="time-head">TIME</th>
              {#each TT_SHORT as day, di}
                <th class="{di >= 5 ? 'wknd' : ''}">{day}<br><span class="day-full">{TT_DAYS[di]}</span></th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each slotIndices as si}
              {@const t = slotTime(si)}
              <tr class="{si % 2 === 0 ? 'hr-start' : ''}">
                <td class="time-cell">
                  {#if si % 2 === 0}
                    <span class="time-hh">{t.hh}:00</span>
                  {:else}
                    <span class="time-mm">:30</span>
                  {/if}
                </td>
                {#each TT_DAYS as _, di}
                  {@const slot = grid[di] ? grid[di][si] : null}
                  {@const isFixed = !!slot && (slot.type === 'sleep' || slot.type === 'school' || slot.type === 'leisure')}
                  {@const isRepeat = isFixed && si % 2 !== 0}
                  {@const isClickable = !!slot && (slot.type === 'study' || slot.type === 'pp' || slot.type === 'sr') && !isRepeat}
                  <td class="blk-cell">
                    {#if slot}
                      <div
                        class="tt-blk {slotBgClass(slot)} {isClickable ? 'clickable' : ''}"
                        on:click={() => { if (isClickable && slot) openModal(slot); }}
                        role={isClickable ? 'button' : undefined}
                        tabindex={isClickable ? 0 : undefined}
                        on:keydown={(e) => { if (e.key === 'Enter' && isClickable && slot) openModal(slot); }}
                        aria-label={isClickable && slot ? slot.subjName + ' task' : undefined}
                      >
                        {#if !isRepeat && slot.label}
                          <span class="blk-label">{slot.label}</span>
                        {/if}
                        {#if !isRepeat && slot.task}
                          <span class="blk-task">{slot.task.substring(0, 58)}{slot.task.length > 58 ? '…' : ''}</span>
                        {:else if !isRepeat && slot.sub && slot.type === 'study'}
                          <span class="blk-sub">{slot.sub}</span>
                        {/if}
                      </div>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    {/if}

    <!-- Legend + Regenerate -->
    <div class="legend-row">
      <div class="legend">
        {#each ttSubjects as s, i}
          {@const dotCls = 'sc-' + 'ABCDEFGHI'[i % 9]}
          <div class="legend-chip">
            <div class="legend-dot {dotCls}"></div>
            <span>{s.name}</span>
          </div>
        {/each}
        <div class="legend-chip"><div class="legend-dot b-pp-dot"></div><span>Past Papers</span></div>
        <div class="legend-chip"><div class="legend-dot b-sr-dot"></div><span>Spaced Review</span></div>
        <div class="legend-chip"><div class="legend-dot b-lei-dot"></div><span>Leisure / Meals</span></div>
      </div>
      <button class="btn-regen" on:click={buildGrid}>↻ Regenerate</button>
    </div>

  {/if}
</div>

<!-- Modal -->
{#if showModal && modalSlot}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click={handleBackdrop}>
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" on:click={closeModal} aria-label="Close">✕</button>
      <div class="modal-badge" style="background:{mBadgeBg};color:{mBadgeFg}">{modalSlot.label || modalSlot.subjName}</div>
      <h2 class="modal-title">{modalSlot.subjName}</h2>
      {#if modalSlot.mark > 0}
        <div class="modal-meta">Current mark: ~{modalSlot.mark}% · Phase: {mPhase}</div>
      {/if}
      <div class="modal-task-box">
        <div class="modal-task-lbl">Today's Task</div>
        <p>{modalSlot.task || 'Complete your assessment to unlock personalised tasks.'}</p>
      </div>
      {#if modalHighValue.length > 0}
      <div class="modal-hv-box">
        <div class="modal-task-lbl">Sure to be Tested</div>
        {#each modalHighValue as t}
          <div class="modal-hv-topic">
            <div class="modal-hv-top">
              <span class="modal-hv-name">{t.topic}</span>
              <span class="modal-hv-weight">~{t.weight}% of paper</span>
            </div>
            <p class="modal-hv-tip">{t.paper}</p>
          </div>
        {/each}
      </div>
      {/if}
      <div class="modal-resources">
        <div class="modal-res-lbl">Free SA Resources</div>
        {#each modalResources as r}
          <a class="res-link" href={r.u} target="_blank" rel="noopener noreferrer">
            <span class="res-icon">{r.i}</span>
            <div class="res-body">
              <span class="res-name">{r.n}</span>
              <span class="res-desc">{r.d}</span>
            </div>
            <span class="res-arr">↗</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* ── Layout ──────────────────────────────────────────── */
  .app { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
  .page-header { margin-bottom: 2rem; animation: fadeDown .5s ease both; }
  .page-header h1 { font-family: var(--font-head); font-size: clamp(1.6rem,4vw,2.4rem); font-weight: 800; margin-bottom: .4rem; }
  .sub { color: var(--muted); font-size: .9rem; font-weight: 300; }

  /* ── Empty state ─────────────────────────────────────── */
  .empty-state { text-align: center; padding: 4rem 1rem; animation: fadeUp .4s ease both; }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty-state h2 { font-family: var(--font-head); font-size: 1.4rem; font-weight: 700; margin-bottom: .8rem; }
  .empty-state p { color: var(--muted); font-weight: 300; line-height: 1.6; margin-bottom: 1.5rem; }
  .btn-primary { display: inline-block; background: var(--accent); color: #0d1117; font-family: var(--font-head); font-weight: 700; padding: .75rem 1.5rem; border-radius: 10px; text-decoration: none; font-size: .9rem; }

  /* ── Mode tabs ───────────────────────────────────────── */
  .mode-tabs { display: flex; gap: .75rem; margin-bottom: 1.5rem; animation: fadeUp .35s ease both; flex-wrap: wrap; }
  .mode-tab { flex: 1; min-width: 110px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1rem .8rem; cursor: pointer; text-align: left; transition: border-color .2s, transform .15s; position: relative; display: flex; flex-direction: column; gap: .2rem; }
  .mode-tab:hover { border-color: rgba(246,201,14,.3); transform: translateY(-1px); }
  .mode-tab.active { border-color: var(--accent); background: rgba(246,201,14,.06); }
  .mode-badge { position: absolute; top: .5rem; right: .5rem; background: var(--accent); color: #0d1117; font-size: .5rem; font-weight: 700; padding: .15rem .4rem; border-radius: 20px; font-family: var(--font-head); text-transform: uppercase; letter-spacing: .05em; }
  .mode-label { font-family: var(--font-head); font-size: .95rem; font-weight: 700; color: var(--text); }
  .mode-hrs  { font-size: .8rem; color: var(--accent); font-weight: 600; }
  .mode-desc { font-size: .7rem; color: var(--muted); font-weight: 300; }

  /* ── APS callout ─────────────────────────────────────── */
  .aps-callout { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem 1.5rem; margin-bottom: 1.5rem; animation: fadeUp .4s ease both; }
  .aps-head { font-family: var(--font-head); font-weight: 700; font-size: .88rem; margin-bottom: 1rem; }
  .aps-nums { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
  .aps-num-block { text-align: center; }
  .aps-num-val { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; line-height: 1; }
  .aps-num-val.current { color: var(--accent2); }
  .aps-num-val.target  { color: var(--accent3); }
  .aps-num-val.neutral { color: var(--accent); }
  .aps-num-lbl { font-size: .62rem; color: var(--muted); margin-top: .2rem; }
  .aps-arrow { font-size: 1.2rem; color: var(--muted); }
  .aps-text { font-size: .82rem; color: var(--muted); line-height: 1.6; margin-bottom: .4rem; }
  .aps-text strong { color: var(--text); }
  .aps-note { font-size: .7rem; color: var(--muted); font-style: italic; }

  /* ── Stats ───────────────────────────────────────────── */
  .stats-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .stat-block { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: .9rem 1.2rem; flex: 1; min-width: 80px; text-align: center; animation: fadeUp .4s ease both; }
  .stat-val { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-lbl { font-size: .62rem; color: var(--muted); margin-top: .3rem; text-transform: uppercase; letter-spacing: .05em; font-family: var(--font-head); }

  /* ── Allocation ──────────────────────────────────────── */
  .alloc-section { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem 1.4rem; margin-bottom: 1.5rem; animation: fadeUp .45s ease both; }
  .section-label { font-family: var(--font-head); font-size: .72rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin: 0 0 .9rem; }
  .alloc-rows { display: flex; flex-direction: column; gap: .45rem; }
  .alloc-row { display: grid; grid-template-columns: 140px 1fr 38px 68px; align-items: center; gap: .6rem; }
  .alloc-name { font-size: .75rem; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .alloc-bar-wrap { background: var(--surface2); border-radius: 4px; height: 5px; overflow: hidden; }
  .alloc-bar { height: 100%; border-radius: 4px; transition: width .5s ease; }
  .alloc-hrs { font-size: .7rem; color: var(--muted); text-align: right; font-family: var(--font-head); }
  .alloc-gap { font-size: .58rem; padding: .12rem .4rem; border-radius: 20px; font-weight: 700; font-family: var(--font-head); text-align: center; }
  .alloc-gap.high { background: rgba(248,113,113,.15); color: var(--danger); }
  .alloc-gap.med  { background: rgba(246,201,14,.15);  color: var(--accent); }
  .alloc-gap.low  { background: rgba(74,222,128,.15);  color: var(--accent3); }

  /* ── Grid ────────────────────────────────────────────── */
  .grid-wrap { margin-bottom: 1rem; animation: fadeUp .5s ease both; }
  .grid-scroll { overflow-x: auto; border: 1px solid var(--border); border-radius: 16px; }
  .tt-table { border-collapse: collapse; width: 100%; min-width: 560px; }
  .tt-table thead th { position: sticky; top: 0; background: var(--surface); z-index: 5; font-family: var(--font-head); font-size: .62rem; font-weight: 700; letter-spacing: .07em; padding: .55rem .3rem; text-align: center; border-bottom: 1px solid var(--border); color: var(--muted); }
  .tt-table thead th.wknd { color: var(--accent); }
  .time-head { position: sticky; left: 0; z-index: 10 !important; background: var(--surface); }
  .day-full { display: block; font-size: .42rem; font-weight: 400; opacity: .5; letter-spacing: 0; }
  .time-cell { position: sticky; left: 0; z-index: 2; background: var(--bg); width: 42px; min-width: 42px; text-align: right; padding-right: .4rem; border-right: 1px solid var(--border); }
  .time-hh { font-size: .62rem; color: var(--muted); font-family: var(--font-head); font-weight: 600; }
  .time-mm { font-size: .52rem; color: rgba(136,153,166,.35); font-family: var(--font-head); }
  .blk-cell { padding: 1px; }
  .hr-start .blk-cell, .hr-start .time-cell { border-top: 1px solid rgba(45,55,72,.45); }

  /* ── Slot blocks ─────────────────────────────────────── */
  .tt-blk { width: 100%; min-height: 20px; border-radius: 3px; padding: 2px 3px; display: flex; flex-direction: column; gap: 1px; overflow: hidden; }
  .tt-blk.clickable { cursor: pointer; transition: opacity .15s, transform .1s; }
  .tt-blk.clickable:hover { opacity: .82; transform: scale(1.03); }
  .blk-label { font-size: .58rem; font-weight: 700; font-family: var(--font-head); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
  .blk-task  { font-size: .5rem; opacity: .75; line-height: 1.2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .blk-sub   { font-size: .5rem; opacity: .55; }

  /* Fixed block colours */
  .b-sleep   { background: rgba(10,14,20,.8); }
  .b-school  { background: rgba(22,33,50,.75); }
  .b-lunch   { background: rgba(120,60,10,.2); }
  .b-dinner  { background: rgba(120,60,10,.2); }
  .b-leisure { background: rgba(35,45,60,.5); }
  .b-empty   { background: transparent; }
  .b-pp  { background: rgba(74,222,128,.12); border-left: 2px solid var(--accent3); }
  .b-sr  { background: rgba(246,201,14,.1);  border-left: 2px solid var(--accent); }

  /* Study colours */
  .sc-A { background: rgba(34,197,94,.16);   color: #4ade80; }
  .sc-B { background: rgba(56,189,248,.16);  color: #38bdf8; }
  .sc-C { background: rgba(246,201,14,.16);  color: #f6c90e; }
  .sc-D { background: rgba(232,121,249,.16); color: #e879f9; }
  .sc-E { background: rgba(45,212,191,.16);  color: #2dd4bf; }
  .sc-F { background: rgba(251,146,60,.16);  color: #fb923c; }
  .sc-G { background: rgba(167,139,250,.16); color: #a78bfa; }
  .sc-H { background: rgba(163,230,53,.16);  color: #a3e635; }
  .sc-I { background: rgba(248,113,113,.16); color: #f87171; }

  /* ── Legend ──────────────────────────────────────────── */
  .legend-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-top: .75rem; }
  .legend { display: flex; flex-wrap: wrap; gap: .35rem .65rem; }
  .legend-chip { display: flex; align-items: center; gap: .3rem; font-size: .65rem; color: var(--muted); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .legend-dot.sc-A { background: #4ade80; }
  .legend-dot.sc-B { background: #38bdf8; }
  .legend-dot.sc-C { background: #f6c90e; }
  .legend-dot.sc-D { background: #e879f9; }
  .legend-dot.sc-E { background: #2dd4bf; }
  .legend-dot.sc-F { background: #fb923c; }
  .legend-dot.sc-G { background: #a78bfa; }
  .legend-dot.sc-H { background: #a3e635; }
  .legend-dot.sc-I { background: #f87171; }
  .b-pp-dot  { background: var(--accent3); border-radius: 3px; }
  .b-sr-dot  { background: var(--accent);  border-radius: 3px; }
  .b-lei-dot { background: rgba(35,45,60,.8); border: 1px solid var(--border); border-radius: 3px; }

  .btn-regen { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--font-head); font-size: .78rem; font-weight: 600; padding: .5rem 1.1rem; border-radius: 10px; cursor: pointer; transition: border-color .2s; white-space: nowrap; }
  .btn-regen:hover { border-color: rgba(246,201,14,.4); }

  /* ── Modal ───────────────────────────────────────────── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.72); z-index: 100; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn .2s ease; }
  @media (min-width: 600px) { .modal-overlay { align-items: center; padding: 1rem; } }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px 20px 0 0; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; padding: 1.5rem; position: relative; animation: slideUp .25s ease; }
  @media (min-width: 600px) { .modal { border-radius: 20px; } }
  .modal-close { position: absolute; top: 1rem; right: 1rem; background: var(--surface2); border: none; color: var(--muted); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: .75rem; display: flex; align-items: center; justify-content: center; }
  .modal-badge { display: inline-block; padding: .3rem .75rem; border-radius: 20px; font-family: var(--font-head); font-size: .72rem; font-weight: 700; margin-bottom: .75rem; }
  .modal-title { font-family: var(--font-head); font-size: 1.2rem; font-weight: 800; margin-bottom: .4rem; }
  .modal-meta  { font-size: .73rem; color: var(--muted); margin-bottom: 1rem; }
  .modal-task-box { background: var(--surface2); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
  .modal-task-lbl { font-family: var(--font-head); font-size: .62rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .45rem; }
  .modal-task-box p { font-size: .85rem; line-height: 1.65; color: var(--text); margin: 0; }
  .modal-hv-box { background: rgba(248,113,113,.06); border: 1px solid rgba(248,113,113,.15); border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .modal-hv-topic { }
  .modal-hv-top { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
  .modal-hv-name { font-size: 0.82rem; font-weight: 600; color: var(--text); }
  .modal-hv-weight { font-size: 0.65rem; background: rgba(248,113,113,.15); color: var(--danger); border-radius: 999px; padding: 0.1rem 0.45rem; font-family: var(--font-head); font-weight: 700; white-space: nowrap; }
  .modal-hv-tip { font-size: 0.7rem; color: var(--muted); margin: 0.1rem 0 0; }
  .modal-resources { display: flex; flex-direction: column; gap: .45rem; }
  .modal-res-lbl { font-family: var(--font-head); font-size: .62rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .2rem; }
  .res-link { display: flex; align-items: center; gap: .7rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: .65rem .85rem; text-decoration: none; transition: border-color .2s; }
  .res-link:hover { border-color: rgba(246,201,14,.3); }
  .res-icon { font-size: 1.05rem; flex-shrink: 0; }
  .res-body  { flex: 1; min-width: 0; }
  .res-name  { display: block; font-family: var(--font-head); font-size: .76rem; font-weight: 700; color: var(--text); }
  .res-desc  { display: block; font-size: .63rem; color: var(--muted); margin-top: .1rem; }
  .res-arr   { color: var(--muted); font-size: .8rem; flex-shrink: 0; }

  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Mobile ──────────────────────────────────────────── */
  @media (max-width: 560px) {
    .alloc-row { grid-template-columns: 90px 1fr 32px 56px; }
    .stats-bar { gap: .5rem; }
    .stat-block { padding: .7rem .6rem; }
    .aps-nums { gap: .8rem; }
    .mode-tabs { gap: .4rem; }
    .mode-tab  { min-width: 95px; }
  }
</style>
