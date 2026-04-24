<script lang="ts">
  import { onMount } from 'svelte';

  type Answers = Record<string, string | string[] | Record<string, number>>;
  interface Priority { action: string; why: string; }
  interface DimSummary { label: string; stat: string; action: string; }
  interface ProfileResult {
    archetype: string; tagline: string; insight: string;
    strength: string; risk: string;
    priorities: Priority[];
    confidenceMap: Record<string, number>;
    dimensions: DimSummary[];
    generatedAt: string;
  }

  let phase: 'intro' | 'questions' | 'result' = 'intro';
  let currentQ = 0;
  let answers: Answers = {};
  let multiSel: Set<string> = new Set();
  let sliders: Record<string, number> = {};
  let subjects: string[] = [];
  let assessmentMarks: Record<string, string> = {};
  let result: ProfileResult | null = null;
  let showProfile = false;

  const MARK_MID: Record<string, number> = {
    '90-100': 95, '80-89': 84, '70-79': 74, '60-69': 64,
    '50-59': 54, '40-49': 44, '30-39': 34, '0-29': 20,
  };
  const DEFAULT_SUBJECTS = ['Mathematics', 'English Home Language', 'Physical Sciences', 'History'];

  onMount(() => {
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        assessmentMarks = state.subjectMarks ?? {};
        const keys = Object.keys(assessmentMarks);
        subjects = keys.length > 0 ? keys : DEFAULT_SUBJECTS;
      } else {
        subjects = DEFAULT_SUBJECTS;
      }
    } catch { subjects = DEFAULT_SUBJECTS; }
    sliders = Object.fromEntries(subjects.map(s => [s, 5]));
  });

  type Option = { value: string; label: string; sub?: string };
  type Question = {
    id: string; dim: string; icon: string;
    text: string; sub?: string;
    type: 'choice' | 'multi' | 'sliders';
    options?: Option[];
  };

  const QUESTIONS: Question[] = [
    {
      id: 'd1_style', dim: 'Learning Style', icon: '👁',
      text: 'New topic. What do you actually do first?',
      type: 'choice',
      options: [
        { value: 'watch',    label: 'Find a YouTube video',       sub: 'Watch before attempting anything' },
        { value: 'read',     label: 'Open the textbook',          sub: 'Read through the chapter first' },
        { value: 'problems', label: 'Jump into examples',         sub: 'Learn by doing, fix gaps after' },
        { value: 'listen',   label: 'Ask someone to explain it',  sub: 'Hear it before reading anything' },
      ],
    },
    {
      id: 'd2_peak', dim: 'Focus & Energy', icon: '⚡',
      text: 'When do you actually study best?',
      type: 'choice',
      options: [
        { value: 'morning',    label: 'Morning',    sub: '6am – 12pm' },
        { value: 'afternoon',  label: 'Afternoon',  sub: '12pm – 5pm' },
        { value: 'evening',    label: 'Evening',    sub: '5pm – 9pm' },
        { value: 'late_night', label: 'Late night', sub: '9pm onwards' },
      ],
    },
    {
      id: 'd2_span', dim: 'Focus & Energy', icon: '⚡',
      text: 'How long before you lose momentum?',
      sub: 'Be honest — not aspirational.',
      type: 'choice',
      options: [
        { value: 'under_20', label: 'Under 20 min', sub: 'I lose focus fast' },
        { value: '20_45',    label: '20 – 45 min',  sub: 'Need regular breaks' },
        { value: '45_60',    label: '45 – 60 min',  sub: 'One solid block' },
        { value: '60_plus',  label: '60+ min',      sub: 'I can go long when locked in' },
      ],
    },
    {
      id: 'd2_killers', dim: 'Focus & Energy', icon: '⚡',
      text: 'What kills a session before you planned to stop?',
      sub: 'Select all that apply.',
      type: 'multi',
      options: [
        { value: 'phone', label: 'Phone nearby' },
        { value: 'stuck', label: 'Question I can\'t answer' },
        { value: 'tired', label: 'Getting tired' },
        { value: 'noise', label: 'Noise / interruptions' },
        { value: 'bored', label: 'Boredom with the subject' },
        { value: 'none',  label: 'Nothing — I stay focused' },
      ],
    },
    {
      id: 'd3_avoidance', dim: 'Procrastination', icon: '⏳',
      text: 'Your hardest subject is due tomorrow. Honest reaction?',
      type: 'choice',
      options: [
        { value: 'avoid',       label: 'I avoid opening it',          sub: 'I\'ll find reasons not to start' },
        { value: 'start_stall', label: 'I start, then stall quickly', sub: 'Momentum collapses within 20 min' },
        { value: 'steady',      label: 'I work through it steadily',  sub: 'Uncomfortable but I keep going' },
        { value: 'fine',        label: 'No real problem',             sub: 'I don\'t struggle here' },
      ],
    },
    {
      id: 'd3_override', dim: 'Procrastination', icon: '⏳',
      text: 'What actually gets you to open your books when you don\'t want to?',
      type: 'choice',
      options: [
        { value: 'deadline', label: 'A deadline tomorrow',          sub: 'Consequence is the only thing' },
        { value: 'peer',     label: 'A friend studying with me',    sub: 'Co-presence makes it happen' },
        { value: 'timer',    label: 'A ritual or timer',            sub: 'A system that kicks me in' },
        { value: 'internal', label: 'Nothing external — I just do it', sub: 'Self-driven' },
      ],
    },
    {
      id: 'd4_confidence', dim: 'Confidence Map', icon: '🎯',
      text: 'Rate your confidence in each subject right now.',
      sub: '1 = I\'m lost · 10 = I\'ve got this',
      type: 'sliders',
    },
    {
      id: 'd5_defence', dim: 'When Stuck', icon: '🛡',
      text: 'You hit a question you can\'t answer. First move?',
      type: 'choice',
      options: [
        { value: 'ask_mate',     label: 'Ask a mate who gets it',    sub: 'Text or call straight away' },
        { value: 'youtube',      label: 'YouTube or Google it',      sub: 'Find an explainer' },
        { value: 'skip',         label: 'Skip and come back',        sub: 'Flag it, keep moving' },
        { value: 'sit',          label: 'Sit with it until done',    sub: 'I don\'t leave questions' },
        { value: 'session_over', label: 'Session is basically over', sub: 'Hitting a wall ends it' },
      ],
    },
    {
      id: 'd5_network', dim: 'When Stuck', icon: '🛡',
      text: 'Do you have people you can actually call for help?',
      type: 'choice',
      options: [
        { value: 'strong', label: 'Yes — most subjects', sub: 'A go-to person in each area' },
        { value: 'some',   label: 'A couple of subjects', sub: 'Some gaps in my network' },
        { value: 'weak',   label: 'Not really',           sub: 'I mostly figure it out alone' },
      ],
    },
    {
      id: 'd6_accountability', dim: 'Accountability', icon: '🔑',
      text: 'What has actually worked to keep you studying?',
      sub: 'Not what should work — what has.',
      type: 'choice',
      options: [
        { value: 'co_study',     label: 'Someone studying alongside me', sub: 'In person or FaceTime' },
        { value: 'streak',       label: 'A streak or habit tracker',     sub: 'Not breaking the chain' },
        { value: 'parent',       label: 'A parent or teacher',           sub: 'External check-in' },
        { value: 'consequences', label: 'Fear of consequences',          sub: 'What happens if I don\'t' },
        { value: 'nothing',      label: 'Nothing external',              sub: 'Self-driven or I procrastinate' },
      ],
    },
    {
      id: 'd6_stakes', dim: 'Accountability', icon: '🔑',
      text: 'Do you know your APS target and which subjects need to change?',
      type: 'choice',
      options: [
        { value: 'yes',   label: 'Yes — exactly', sub: 'I know the number and the levers' },
        { value: 'vague', label: 'Sort of',        sub: 'Rough direction, not the detail' },
        { value: 'no',    label: 'Not really',     sub: 'I don\'t have a clear picture' },
      ],
    },
    {
      id: 'd7_honesty', dim: 'One last thing', icon: '🔒',
      text: 'Is there anything about your matric year you haven\'t told anyone?',
      sub: 'This is private. It won\'t be shown or shared.',
      type: 'choice',
      options: [
        { value: 'yes',        label: 'Yes',            sub: 'There\'s something I\'m carrying alone' },
        { value: 'no',         label: 'No',             sub: 'I\'m an open book' },
        { value: 'rather_not', label: 'Rather not say', sub: '' },
      ],
    },
  ];

  $: q = QUESTIONS[currentQ];
  $: progress = Math.round((currentQ / QUESTIONS.length) * 100);

  function start() { phase = 'questions'; }

  function choose(value: string) {
    answers[q.id] = value;
    advance();
  }

  function toggleMulti(v: string) {
    const s = new Set(multiSel);
    if (s.has(v)) s.delete(v); else s.add(v);
    multiSel = s;
  }

  function confirmMulti() {
    if (multiSel.size === 0) return;
    answers[q.id] = [...multiSel];
    multiSel = new Set();
    advance();
  }

  function confirmSliders() {
    answers[q.id] = { ...sliders };
    advance();
  }

  function advance() {
    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
    } else {
      result = computeProfile(answers, subjects, assessmentMarks);
      localStorage.setItem('mmm_deep_v1', JSON.stringify({ result, generatedAt: new Date().toISOString() }));
      phase = 'result';
      setTimeout(() => { showProfile = true; }, 2600);
    }
  }

  function goBack() {
    if (currentQ > 0) currentQ--;
    else phase = 'intro';
  }

  function retake() {
    phase = 'intro'; currentQ = 0;
    answers = {}; result = null; showProfile = false;
    multiSel = new Set();
    sliders = Object.fromEntries(subjects.map(s => [s, 5]));
  }

  // ── Helpers ───────────────────────────────────────────────
  function str(v: unknown): string { return typeof v === 'string' ? v : ''; }
  function arr(v: unknown): string[] { return Array.isArray(v) ? v : []; }
  function obj(v: unknown): Record<string, number> {
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v as Record<string, number> : {};
  }

  // ── Archetype computation ─────────────────────────────────
  function computeProfile(ans: Answers, subs: string[], marks: Record<string, string>): ProfileResult {
    const defence        = str(ans['d5_defence']);
    const network        = str(ans['d5_network']);
    const accountability = str(ans['d6_accountability']);
    const procrastination = str(ans['d3_avoidance']);
    const override       = str(ans['d3_override']);
    const style          = str(ans['d1_style']);
    const span           = str(ans['d2_span']);
    const peak           = str(ans['d2_peak']);
    const killers        = arr(ans['d2_killers']);
    const confidence     = obj(ans['d4_confidence']);

    const isPeer    = defence === 'ask_mate';
    const isSolo    = defence === 'sit' || defence === 'youtube';
    const isCoStudy = accountability === 'co_study';
    const isDeadline = override === 'deadline';
    const isInternal = override === 'internal';
    const isAvoider = procrastination === 'avoid' || defence === 'session_over';
    const isStaller = procrastination === 'start_stall';
    const isShort   = span === 'under_20' || span === '20_45';
    const strongNet = network === 'strong';

    // Calibration: compare slider confidence (×10) vs mark midpoint
    let totalDelta = 0, count = 0;
    Object.entries(confidence).forEach(([subj, conf]) => {
      const mid = MARK_MID[marks[subj]];
      if (mid !== undefined) { totalDelta += (conf * 10) - mid; count++; }
    });
    const avgDelta = count > 0 ? totalDelta / count : 0;
    const isOverconfident   = avgDelta > 15;
    const isUnderconfident  = avgDelta < -15;

    let archetype: string, tagline: string, insight: string, strength: string, risk: string;
    let priorities: Priority[];

    if (isUnderconfident) {
      archetype = 'The Silent Achiever';
      tagline = 'You\'re better than you think. The gap between your confidence and your marks is the whole problem.';
      insight = 'Low confidence that isn\'t matched by low marks is imposter syndrome. Past papers are the cure — not because you need practice, but because you need evidence of what you can already do.';
      strength = 'Consistent effort, low ego, coachable. You don\'t need motivation — you need proof.';
      risk = 'Underselling yourself in high-stakes moments. Anxiety that performs below ability on the day.';
      priorities = [
        { action: 'Do one past paper per weak-feeling subject under timed conditions — read the score before the memo', why: 'Data beats feelings. You need evidence, not more studying.' },
        { action: 'Track your predicted mark vs actual mark for 3 consecutive tests', why: 'The pattern will surprise you.' },
      ];
    } else if (isOverconfident) {
      archetype = 'The Blind Spot Builder';
      tagline = 'Your confidence is ahead of your marks. That\'s not a problem — it\'s data.';
      insight = 'High confidence with lower marks usually means one thing: you understand concepts but haven\'t done enough past papers under pressure. Recognition isn\'t the same as retrieval.';
      strength = 'Growth mindset, positive, doesn\'t spiral into anxiety.';
      risk = 'Getting surprised by exam results that felt like they should\'ve been higher.';
      priorities = [
        { action: 'Do one timed past paper per subject without notes before your next study session', why: 'Exam conditions reveal the gap between "I know this" and "I can do this under pressure".' },
        { action: 'For every wrong answer, write one sentence on why — not just the right answer', why: 'Pattern recognition only comes from understanding your error type.' },
      ];
    } else if (isPeer && isCoStudy && strongNet) {
      archetype = 'The Calibrated Outperformer';
      tagline = 'You know exactly where you stand. The problem is fixing it alone — and alone is the one mode you told us doesn\'t work.';
      insight = 'Your defence mechanism is solid and your network is real. The gap is structural: your go-to people aren\'t available when the wall hits. Scheduled sessions beat on-demand every time.';
      strength = 'Self-awareness + peer network. You know what works and have the people — you just need the structure locked in.';
      risk = '"I know what\'s wrong" paralysis. High self-awareness without scheduled action stays as awareness.';
      priorities = [
        { action: 'Book a standing co-study session for your weakest subject — same time every week', why: 'On-demand requests fail at 11pm. Structure beats intention.' },
        { action: 'Pre-decide your response to hitting a wall: flag it, skip it, WhatsApp your mate', why: 'Build the exit before you need it.' },
      ];
    } else if (isInternal && isSolo) {
      archetype = 'The Lone Ranger';
      tagline = 'You\'ve built an identity around solving it yourself. That\'s impressive — until you hit a ceiling you can\'t break alone.';
      insight = 'Self-reliance is a strength until the problem exceeds your knowledge. Getting comfortable asking for help before you\'re stuck is the next level.';
      strength = 'Discipline and independence. No external pressure needed to get started.';
      risk = 'Solving the wrong problem harder. Pride-based avoidance that looks like effort.';
      priorities = [
        { action: 'Find one subject where solo method isn\'t moving marks. Book one peer or tutor session', why: 'One session to validate — not a commitment to change.' },
        { action: '15-minute rule: if stuck for 15 min, escalate — YouTube, mate, or skip and flag', why: 'Sitting past 15 min without progress is diminishing returns.' },
      ];
    } else if (isAvoider || (isStaller && isDeadline)) {
      archetype = 'The Momentum Hunter';
      tagline = 'Getting started is 80% of your problem. Once you\'re in, you\'re fine.';
      insight = 'Avoidance isn\'t laziness — it\'s protection from the bad feeling of not knowing what to do next. The fix isn\'t willpower. It\'s removing the ambiguity before the session starts.';
      strength = 'When the session is structured and the task is clear, you work.';
      risk = 'Guilt loops that produce nothing. Confusing "I should study" with actually studying.';
      priorities = [
        { action: 'Never start a session without knowing the first 3 specific questions you\'ll attempt', why: 'Pre-planned sessions don\'t require decisions under pressure — they just require showing up.' },
        { action: 'Use a co-study partner for your hardest subject — just to be in the room with', why: 'Presence triggers momentum. You need activation, not accountability.' },
      ];
    } else if (isStaller && isShort) {
      archetype = 'The Sprinter';
      tagline = 'You can build momentum fast. The gap is keeping it going past the 20-minute mark.';
      insight = 'Short focus spans aren\'t fixed with willpower. They\'re fixed with structure. Your brain is wired for quick starts — the work is building the transition into deep work.';
      strength = 'Fast starter. Getting going is never your problem.';
      risk = 'Mistaking activity for progress. Starting 5 topics and finishing none.';
      priorities = [
        { action: 'Start with 25-min Pomodoro blocks, scale to 45-min over two weeks', why: 'Build the focus muscle — don\'t force it.' },
        { action: 'One subject per session only', why: 'Depth over breadth until focus extends naturally.' },
      ];
    } else {
      archetype = 'The Methodical Grinder';
      tagline = 'You\'ve got the work ethic. The question is whether you\'re working on the right things.';
      insight = 'Consistent effort is rare and valuable — but it can be misdirected. The highest-leverage move for you isn\'t more hours. It\'s auditing where those hours are going.';
      strength = 'Consistency, reliability, no external pressure needed.';
      risk = 'Grinding low-leverage activities and mistaking effort for impact.';
      priorities = [
        { action: 'Audit your last 5 study sessions: which subjects, which topics — is the distribution right?', why: 'Effort misdirected is worse than no effort — it creates false confidence.' },
        { action: 'Focus the next week on your two highest APS-leverage subjects only', why: 'Marginal gains on weak subjects beat maintenance on strong ones.' },
      ];
    }

    // Dimension summaries
    const peakLabel: Record<string, string> = {
      morning: 'Morning (6am–12pm)', afternoon: 'Afternoon (12–5pm)',
      evening: 'Evening (5–9pm)', late_night: 'Late night (9pm+)',
    };
    const spanLabel: Record<string, string> = {
      under_20: '<20 min', '20_45': '20–45 min', '45_60': '45–60 min', '60_plus': '60+ min',
    };
    const styleActions: Record<string, string> = {
      watch:    'Every new topic: YouTube explainer first. Never open with the textbook.',
      read:     'Use chapter summaries first, then worked examples, then practice.',
      problems: 'Start with one easy worked example per topic — anchor the method before attempting problems.',
      listen:   'Study groups, voice notes, podcasts — if you can hear it explained first, you\'ll retain it.',
    };

    const dimensions: DimSummary[] = [
      {
        label: `Learning: ${style === 'watch' ? 'Visual · Watch → Practice' : style === 'read' ? 'Reading-first' : style === 'problems' ? 'Kinesthetic · Dive in' : 'Auditory · Explanation first'}`,
        stat: peak ? `Peak window: ${peakLabel[peak] ?? peak}` : '',
        action: styleActions[style] ?? 'Match your first-step approach to your natural wiring.',
      },
      {
        label: `Focus span: ${spanLabel[span] ?? span}`,
        stat: killers.length > 0 ? `Session killers: ${killers.filter(k => k !== 'none').slice(0, 2).join(', ')}` : '',
        action: isShort
          ? 'Use 25-min blocks. Don\'t fight your span — work with it and extend over time.'
          : 'Use 50/10 Pomodoro. Your window is an asset — protect it with a phone-free zone.',
      },
      {
        label: `When stuck: ${defence === 'ask_mate' ? 'Ask a mate' : defence === 'youtube' ? 'YouTube/Google' : defence === 'sit' ? 'Sit with it' : defence === 'skip' ? 'Skip & return' : 'Session ends'}`,
        stat: `Peer network: ${network === 'strong' ? 'Strong' : network === 'some' ? 'Partial' : 'Weak'}`,
        action: isPeer
          ? 'Book study support in advance — not as an emergency call when the wall hits.'
          : isSolo
          ? '15-minute cap on solo struggle. Then escalate — YouTube, mate, or skip.'
          : 'Build a skip-and-flag habit so one unknown question doesn\'t end the session.',
      },
    ];

    return { archetype, tagline, insight, strength, risk, priorities, confidenceMap: confidence, dimensions, generatedAt: new Date().toISOString() };
  }
</script>

<svelte:head>
  <title>Deep Assessment — Miyagi</title>
</svelte:head>

<!-- ── Intro ─────────────────────────────────────────────── -->
{#if phase === 'intro'}
  <div class="app">
    <div class="intro-wrap">
      <div class="intro-badge">7 dimensions · ~7 minutes</div>
      <h1 class="intro-title">Deep Scan</h1>
      <p class="intro-sub">This builds your actual study profile — not generic advice. Answer honestly, not aspirationally.</p>
      <div class="intro-dims">
        {#each ['👁 Learning style', '⚡ Focus & energy', '⏳ Procrastination', '🎯 Confidence map', '🛡 When you\'re stuck', '🔑 Accountability', '🔒 One last thing'] as d}
          <div class="intro-dim">{d}</div>
        {/each}
      </div>
      <button class="cta-btn" on:click={start}>Start deep scan →</button>
      <p class="intro-note">Results saved locally. Nothing leaves your device.</p>
    </div>
  </div>

<!-- ── Questions ─────────────────────────────────────────── -->
{:else if phase === 'questions'}
  <div class="app">
    <div class="progress-bar"><div class="progress-fill" style="width:{progress}%"></div></div>
    <div class="progress-meta">
      <span class="dim-tag">{q.icon} {q.dim}</span>
      <span class="q-count">{currentQ + 1} / {QUESTIONS.length}</span>
    </div>

    {#key currentQ}
      <div class="q-wrap">
        <div class="q-text">{q.text}</div>
        {#if q.sub}<div class="q-sub">{q.sub}</div>{/if}

        {#if q.type === 'choice'}
          <div class="options">
            {#each q.options ?? [] as opt}
              <button class="opt-btn" on:click={() => choose(opt.value)}>
                <span class="opt-label">{opt.label}</span>
                {#if opt.sub}<span class="opt-sub">{opt.sub}</span>{/if}
              </button>
            {/each}
          </div>

        {:else if q.type === 'multi'}
          <div class="options">
            {#each q.options ?? [] as opt}
              <button class="opt-btn" class:selected={multiSel.has(opt.value)} on:click={() => toggleMulti(opt.value)}>
                <span class="opt-label">{opt.label}</span>
                {#if multiSel.has(opt.value)}<span class="opt-check">✓</span>{/if}
              </button>
            {/each}
          </div>
          <button class="cta-btn" disabled={multiSel.size === 0} on:click={confirmMulti}>Continue →</button>

        {:else if q.type === 'sliders'}
          <div class="sliders-list">
            {#each subjects as s}
              <div class="slider-row">
                <div class="slider-name">{s}</div>
                <div class="slider-track">
                  <input type="range" min="1" max="10" step="1" bind:value={sliders[s]} class="slider" />
                  <span class="slider-val">{sliders[s] ?? 5}</span>
                </div>
              </div>
            {/each}
          </div>
          <button class="cta-btn" on:click={confirmSliders}>Continue →</button>
        {/if}
      </div>
    {/key}

    <button class="back-btn" on:click={goBack}>← Back</button>
  </div>

<!-- ── Result ─────────────────────────────────────────────── -->
{:else if phase === 'result' && result}
  {#if !showProfile}
    <div class="reveal-overlay">
      <div class="reveal-label">Your archetype</div>
      <div class="reveal-name">{result.archetype}</div>
    </div>
  {:else}
    <div class="app profile-page">
      <div class="profile-header">
        <div class="profile-badge">Deep Assessment Complete</div>
        <div class="profile-archetype">{result.archetype}</div>
      </div>

      <div class="hero-card">
        <div class="hero-tagline">"{result.tagline}"</div>
        <div class="divider"></div>
        <div class="insight-label">The real insight</div>
        <div class="insight-text">{result.insight}</div>
        <div class="sr-row">
          <div class="sr-item">
            <span class="sr-badge strength">STRENGTH</span>
            <span class="sr-text">{result.strength}</span>
          </div>
          <div class="sr-item">
            <span class="sr-badge risk">RISK</span>
            <span class="sr-text">{result.risk}</span>
          </div>
        </div>
      </div>

      <div class="section-label">🔥 Your priorities — in order</div>
      {#each result.priorities as p, i}
        <div class="priority-card">
          <div class="p-num">{i + 1}</div>
          <div class="p-body">
            <div class="p-action">{p.action}</div>
            <div class="p-why">{p.why}</div>
          </div>
        </div>
      {/each}

      {#if Object.keys(result.confidenceMap).length > 0}
        <div class="section-label">🎯 Confidence map</div>
        <div class="conf-card">
          {#each Object.entries(result.confidenceMap) as [subj, conf]}
            <div class="conf-row">
              <div class="conf-name">{subj}</div>
              <div class="conf-track">
                <div class="conf-fill" style="width:{Number(conf) * 10}%"></div>
              </div>
              <div class="conf-val">{conf}/10</div>
            </div>
          {/each}
        </div>
      {/if}

      <div class="section-label">📊 Your profile</div>
      {#each result.dimensions as d}
        <div class="dim-card">
          <div class="dim-label">{d.label}</div>
          {#if d.stat}<div class="dim-stat">{d.stat}</div>{/if}
          <div class="dim-action">→ {d.action}</div>
        </div>
      {/each}

      <div class="retake-card">
        <div class="retake-title">Re-take in 4 weeks</div>
        <div class="retake-sub">Your profile shifts as you act on these interventions. The re-measure date is when you check if it worked.</div>
        <button class="retake-btn" on:click={retake}>Re-take assessment</button>
      </div>

      <div style="height:2rem"></div>
    </div>
  {/if}
{/if}

<style>
  /* ── Intro ──────────────────────────────────────────────── */
  .intro-wrap {
    max-width: 480px; margin: 0 auto;
    padding: 2rem 0; text-align: center;
    animation: fadeUp .4s ease both;
  }
  .intro-badge {
    display: inline-block;
    background: rgba(124,77,255,.12);
    border: 1px solid rgba(124,77,255,.3);
    color: #a78bfa;
    font-family: var(--font-head); font-size: .65rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .3rem .9rem; border-radius: 100px; margin-bottom: 1rem;
  }
  .intro-title {
    font-family: var(--font-head);
    font-size: clamp(2.2rem, 8vw, 3rem); font-weight: 800;
    color: var(--text); margin-bottom: .6rem; line-height: 1;
  }
  .intro-sub {
    font-size: .88rem; color: var(--muted); font-weight: 300;
    line-height: 1.6; max-width: 360px; margin: 0 auto 1.5rem;
  }
  .intro-dims {
    display: flex; flex-wrap: wrap; gap: .4rem;
    justify-content: center; margin-bottom: 1.8rem;
  }
  .intro-dim {
    font-family: var(--font-head); font-size: .68rem; font-weight: 600;
    color: var(--muted); background: var(--surface);
    border: 1px solid var(--border); border-radius: 100px;
    padding: .25rem .75rem;
  }
  .intro-note {
    font-size: .72rem; color: rgba(255,244,232,.3);
    margin-top: .8rem; font-weight: 300;
  }

  /* ── CTA button ─────────────────────────────────────────── */
  .cta-btn {
    display: block; width: 100%; max-width: 320px; margin: 0 auto;
    background: var(--grad-cta, linear-gradient(135deg, #7c4dff, #e040fb));
    color: #fff; border: none; border-radius: 14px;
    font-family: var(--font-head); font-size: .9rem; font-weight: 700;
    padding: 1rem; cursor: pointer; letter-spacing: .02em;
    transition: opacity .15s;
  }
  .cta-btn:disabled { opacity: .4; cursor: not-allowed; }
  .cta-btn:hover:not(:disabled) { opacity: .9; }

  /* ── Progress ───────────────────────────────────────────── */
  .progress-bar {
    height: 3px; background: var(--border);
    border-radius: 2px; margin-bottom: .8rem; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, #7c4dff, #e040fb);
    border-radius: 2px; transition: width .3s ease;
  }
  .progress-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.4rem;
  }
  .dim-tag {
    font-family: var(--font-head); font-size: .72rem; font-weight: 700;
    color: #a78bfa; letter-spacing: .04em;
  }
  .q-count { font-size: .7rem; color: var(--muted); }

  /* ── Question ───────────────────────────────────────────── */
  .q-wrap { animation: slideIn .2s ease both; }
  @keyframes slideIn {
    from { transform: translateX(24px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  .q-text {
    font-family: var(--font-head); font-size: clamp(1.1rem, 4vw, 1.35rem);
    font-weight: 700; color: var(--text); line-height: 1.3;
    margin-bottom: .4rem;
  }
  .q-sub { font-size: .8rem; color: var(--muted); margin-bottom: 1.2rem; font-weight: 300; }

  /* ── Options ────────────────────────────────────────────── */
  .options { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1rem; }
  .opt-btn {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: .85rem 1rem;
    text-align: left; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    gap: .5rem; transition: border-color .15s, background .15s;
  }
  .opt-btn:hover { border-color: rgba(124,77,255,.4); background: rgba(124,77,255,.06); }
  .opt-btn.selected { border-color: #7c4dff; background: rgba(124,77,255,.12); }
  .opt-label {
    font-family: var(--font-head); font-size: .88rem; font-weight: 700;
    color: var(--text); display: block;
  }
  .opt-sub { font-size: .72rem; color: var(--muted); font-weight: 300; margin-top: .15rem; display: block; }
  .opt-check { color: #a78bfa; font-size: .9rem; flex-shrink: 0; }

  /* ── Sliders ────────────────────────────────────────────── */
  .sliders-list { display: flex; flex-direction: column; gap: .9rem; margin-bottom: 1.4rem; }
  .slider-row { display: flex; flex-direction: column; gap: .3rem; }
  .slider-name { font-size: .78rem; font-weight: 600; color: var(--text); }
  .slider-track { display: flex; align-items: center; gap: .7rem; }
  .slider {
    flex: 1; -webkit-appearance: none; appearance: none;
    height: 4px; border-radius: 2px;
    background: linear-gradient(to right, #7c4dff, #e040fb);
    outline: none; cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 18px; height: 18px;
    border-radius: 50%; background: #a78bfa;
    border: 2px solid #0d0a18; cursor: pointer;
  }
  .slider-val {
    font-family: var(--font-head); font-size: .85rem; font-weight: 800;
    color: #a78bfa; min-width: 1.5rem; text-align: right;
  }

  /* ── Back button ────────────────────────────────────────── */
  .back-btn {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: .78rem; font-family: var(--font-head);
    font-weight: 600; padding: 1rem 0; margin-top: .5rem;
    transition: color .15s;
  }
  .back-btn:hover { color: var(--text); }

  /* ── Reveal overlay ─────────────────────────────────────── */
  .reveal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #080510;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: .6rem; padding: 2rem;
  }
  .reveal-label {
    font-family: var(--font-head); font-size: .7rem; font-weight: 700;
    letter-spacing: .2em; text-transform: uppercase;
    color: rgba(167,139,250,.6);
    animation: fadeIn .5s ease both;
  }
  .reveal-name {
    font-family: var(--font-head);
    font-size: clamp(1.6rem, 7vw, 3rem); font-weight: 800;
    color: #fff; text-align: center; line-height: 1.2;
    text-shadow: 0 0 60px rgba(124,77,255,.8), 0 0 20px rgba(124,77,255,.4);
    animation: revealSlam .4s cubic-bezier(.17,.67,.35,1.4) .3s both;
  }
  @keyframes revealSlam {
    from { transform: scale(1.6); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  /* ── Profile ────────────────────────────────────────────── */
  .profile-page { max-width: 600px; animation: fadeIn .4s ease both; }
  .profile-header { text-align: center; margin-bottom: 1.5rem; }
  .profile-badge {
    display: inline-block;
    background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.25);
    color: #4ade80; font-family: var(--font-head); font-size: .65rem;
    font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    padding: .3rem .9rem; border-radius: 100px; margin-bottom: .8rem;
  }
  .profile-archetype {
    font-family: var(--font-head); font-size: clamp(1.4rem, 5vw, 2rem);
    font-weight: 800; color: var(--text); line-height: 1.2;
  }

  .hero-card {
    background: linear-gradient(135deg, rgba(124,77,255,.1), rgba(224,64,251,.06));
    border: 1px solid rgba(124,77,255,.3);
    border-radius: 20px; padding: 1.5rem;
    margin-bottom: 1rem; animation: fadeUp .4s ease both;
  }
  .hero-tagline {
    font-size: .88rem; color: var(--muted); font-style: italic;
    line-height: 1.65; margin-bottom: 1rem; font-weight: 300;
  }
  .divider { height: 1px; background: rgba(255,244,232,.08); margin-bottom: 1rem; }
  .insight-label {
    font-family: var(--font-head); font-size: .6rem; font-weight: 700;
    letter-spacing: .15em; text-transform: uppercase; color: #f87171; margin-bottom: .4rem;
  }
  .insight-text {
    font-size: .85rem; color: var(--text); line-height: 1.65; margin-bottom: 1rem;
  }
  .sr-row { display: flex; flex-direction: column; gap: .6rem; }
  .sr-item { display: flex; gap: .6rem; align-items: flex-start; }
  .sr-badge {
    font-family: var(--font-head); font-size: .58rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: .2rem .5rem; border-radius: 4px; flex-shrink: 0; margin-top: 2px;
  }
  .sr-badge.strength { background: rgba(74,222,128,.15); color: #4ade80; }
  .sr-badge.risk     { background: rgba(248,113,113,.15); color: #f87171; }
  .sr-text { font-size: .78rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

  .section-label {
    font-family: var(--font-head); font-size: .72rem; font-weight: 700;
    color: var(--text); margin: 1.2rem 0 .6rem; letter-spacing: .02em;
  }

  .priority-card {
    display: flex; gap: .8rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: .9rem 1rem; margin-bottom: .5rem;
    animation: fadeUp .45s ease both;
  }
  .p-num {
    font-family: var(--font-head); font-size: 1.2rem; font-weight: 800;
    color: rgba(124,77,255,.5); flex-shrink: 0; padding-top: 2px;
  }
  .p-action { font-size: .85rem; font-weight: 600; color: var(--text); margin-bottom: .25rem; }
  .p-why { font-size: .75rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

  .conf-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1rem 1.2rem; margin-bottom: .5rem;
  }
  .conf-row { display: flex; align-items: center; gap: .6rem; margin-bottom: .6rem; }
  .conf-name { font-size: .72rem; color: var(--muted); font-weight: 400; min-width: 100px; flex-shrink: 0; }
  .conf-track { flex: 1; height: 6px; background: rgba(255,244,232,.08); border-radius: 3px; overflow: hidden; }
  .conf-fill { height: 100%; background: linear-gradient(90deg, #7c4dff, #a78bfa); border-radius: 3px; }
  .conf-val { font-family: var(--font-head); font-size: .7rem; font-weight: 700; color: #a78bfa; min-width: 2.5rem; text-align: right; }

  .dim-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: .9rem 1rem; margin-bottom: .5rem;
  }
  .dim-label { font-family: var(--font-head); font-size: .8rem; font-weight: 700; color: var(--text); margin-bottom: .2rem; }
  .dim-stat { font-size: .72rem; color: var(--muted); margin-bottom: .4rem; }
  .dim-action { font-size: .78rem; color: #a78bfa; font-weight: 500; line-height: 1.5; }

  .retake-card {
    background: rgba(124,77,255,.06); border: 1px solid rgba(124,77,255,.2);
    border-radius: 16px; padding: 1.2rem; margin-top: 1rem; text-align: center;
  }
  .retake-title { font-family: var(--font-head); font-size: .8rem; font-weight: 700; color: #a78bfa; margin-bottom: .4rem; }
  .retake-sub { font-size: .75rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem; }
  .retake-btn {
    background: none; border: 1px solid rgba(124,77,255,.4);
    color: #a78bfa; border-radius: 10px; padding: .6rem 1.2rem;
    font-family: var(--font-head); font-size: .78rem; font-weight: 700;
    cursor: pointer; transition: background .15s;
  }
  .retake-btn:hover { background: rgba(124,77,255,.1); }
</style>
